//! Background worker that crawls a Tieba thread (pages, 楼中楼 floors, media)
//! and appends everything into the per-thread tar archive managed by
//! [`crate::thread_archive`]. Progress is emitted as `thread-save-progress`
//! events so the frontend can render a live progress UI.

use crate::protobuf_api::bounded_decode_json;
use crate::request::fetch_bytes;
use crate::thread_archive::{
    self, floor_member, media_member, now_unix, page_member, update_meta_at, validate_tid,
};
use prost::Message;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::{HashMap, HashSet};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use tauri::{command, AppHandle, Emitter, Runtime, State};
use tieba_api::proto::{floor, thread_page};
use tieba_api::TiebaClient;

const PB_PAGE_URL: &str = "http://tiebac.baidu.com/c/f/pb/page?cmd=302001";
const PB_FLOOR_URL: &str = "https://tiebac.baidu.com/c/f/pb/floor?cmd=302002";
const MAX_FLOOR_PAGES: u32 = 50;
const DEFAULT_MAX_MEDIA_BYTES: u64 = 100 * 1024 * 1024;
const AVATAR_BASE: &str = "https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/";

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase", default)]
pub struct SaveOptions {
    pub only_author: bool,
    pub save_images: bool,
    pub save_video_audio: bool,
    pub save_subposts: bool,
    pub save_avatars: bool,
    /// `"1,2,1-5"` style page list; None/empty means all pages.
    pub page_range: Option<String>,
    pub max_media_bytes: u64,
}

impl Default for SaveOptions {
    fn default() -> Self {
        Self {
            only_author: false,
            save_images: true,
            save_video_audio: false,
            save_subposts: false,
            save_avatars: false,
            page_range: None,
            max_media_bytes: DEFAULT_MAX_MEDIA_BYTES,
        }
    }
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct SaveProgress {
    tid: String,
    phase: String,
    done: u32,
    total: u32,
    message: String,
}

#[derive(Default)]
pub struct SaveJobs(pub Arc<Mutex<HashMap<String, Arc<AtomicBool>>>>);

impl SaveJobs {
    fn is_running(&self, tid: &str) -> bool {
        self.0
            .lock()
            .unwrap_or_else(|p| p.into_inner())
            .get(tid)
            .is_some_and(|flag| !flag.load(Ordering::Relaxed))
    }
}

fn emit_progress<R: Runtime>(app: &AppHandle<R>, progress: SaveProgress) {
    let _ = app.emit("thread-save-progress", progress);
}

fn progress<R: Runtime>(
    app: &AppHandle<R>,
    tid: &str,
    phase: &str,
    done: u32,
    total: u32,
    message: String,
) {
    emit_progress(
        app,
        SaveProgress {
            tid: tid.to_string(),
            phase: phase.to_string(),
            done,
            total,
            message,
        },
    );
}

// ---------------------------------------------------------------------------
// Protobuf request building (mirrors the frontend's createCommon shape)
// ---------------------------------------------------------------------------

macro_rules! common_req {
    ($module:ident, $bduss:expr, $stoken:expr) => {
        $module::CommonReq {
            client_type: 2,
            client_version: "12.79.1.0".to_string(),
            bduss: $bduss.unwrap_or_default().to_string(),
            stoken: $stoken.unwrap_or_default().to_string(),
            ..Default::default()
        }
    };
}

fn cookie_header(bduss: Option<&str>, stoken: Option<&str>) -> Option<String> {
    match (
        bduss.filter(|v| !v.is_empty()),
        stoken.filter(|v| !v.is_empty()),
    ) {
        (Some(b), Some(s)) => Some(format!("BDUSS={b}; STOKEN={s};")),
        (Some(b), None) => Some(format!("BDUSS={b};")),
        (None, Some(s)) => Some(format!("STOKEN={s};")),
        _ => None,
    }
}

fn page_request(
    tid: i64,
    pn: u32,
    only_author: bool,
    bduss: Option<&str>,
    stoken: Option<&str>,
) -> thread_page::PbPageReqIdl {
    thread_page::PbPageReqIdl {
        data: Some(thread_page::DataReq {
            kz: tid,
            pn: pn as i32,
            rn: 30,
            r: 0,
            lz: if only_author { 1 } else { 0 },
            common: Some(common_req!(thread_page, bduss, stoken)),
            ..Default::default()
        }),
    }
}

fn floor_request(
    tid: i64,
    pid: i64,
    pn: u32,
    bduss: Option<&str>,
    stoken: Option<&str>,
) -> floor::PbFloorReqIdl {
    floor::PbFloorReqIdl {
        data: Some(floor::pb_floor_req_idl::DataReq {
            kz: tid,
            pid,
            pn: pn as i32,
            sort: 0,
            common: Some(common_req!(floor, bduss, stoken)),
            ..Default::default()
        }),
    }
}

async fn fetch_pb_json<TRes: prost::Message + serde::Serialize + Default + Send + 'static>(
    client: &TiebaClient,
    url: &str,
    request: &[u8],
    cookie: Option<&str>,
) -> Result<Value, String> {
    let bytes = client
        .post_protobuf(url, request, "file", cookie)
        .await
        .map_err(|e| e.to_string())?;
    bounded_decode_json::<TRes>(bytes)
}

/// Thin wrapper binding the protobuf endpoints to their request/response types.
struct PbApi<'a> {
    client: &'a TiebaClient,
    cookie: Option<&'a str>,
    bduss: Option<&'a str>,
    stoken: Option<&'a str>,
}

impl PbApi<'_> {
    async fn fetch_page(&self, tid: i64, pn: u32, only_author: bool) -> Result<Value, String> {
        let request = page_request(tid, pn, only_author, self.bduss, self.stoken);
        fetch_pb_json::<thread_page::PbPageResIdl>(
            self.client,
            PB_PAGE_URL,
            &request.encode_to_vec(),
            self.cookie,
        )
        .await
    }

    async fn fetch_floor(&self, tid: i64, pid: i64, pn: u32) -> Result<Value, String> {
        let request = floor_request(tid, pid, pn, self.bduss, self.stoken);
        fetch_pb_json::<floor::PbFloorResIdl>(
            self.client,
            PB_FLOOR_URL,
            &request.encode_to_vec(),
            self.cookie,
        )
        .await
    }
}

// ---------------------------------------------------------------------------
// Page range parsing
// ---------------------------------------------------------------------------

/// Parses `"1,2,1-5"` into a sorted, de-duplicated page list.
pub fn parse_page_range(spec: &str) -> Result<Vec<u32>, String> {
    let mut pages = Vec::new();
    for part in spec.split(',') {
        let part = part.trim();
        if part.is_empty() {
            continue;
        }
        if let Some((start, end)) = part.split_once('-') {
            let start: u32 = start
                .trim()
                .parse()
                .map_err(|_| format!("无效的页码范围: {part}"))?;
            let end: u32 = end
                .trim()
                .parse()
                .map_err(|_| format!("无效的页码范围: {part}"))?;
            if start == 0 || end < start {
                return Err(format!("无效的页码范围: {part}"));
            }
            pages.extend(start..=end);
        } else {
            let page: u32 = part.parse().map_err(|_| format!("无效的页码: {part}"))?;
            if page == 0 {
                return Err(format!("无效的页码: {part}"));
            }
            pages.push(page);
        }
    }
    pages.sort_unstable();
    pages.dedup();
    if pages.is_empty() {
        return Err("页码范围为空".to_string());
    }
    Ok(pages)
}

// ---------------------------------------------------------------------------
// Media URL collection
// ---------------------------------------------------------------------------

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum MediaKind {
    Image,
    VideoAudio,
    Avatar,
}

impl MediaKind {
    fn label(self) -> &'static str {
        match self {
            MediaKind::Image => "图片",
            MediaKind::VideoAudio => "视频/音频",
            MediaKind::Avatar => "头像",
        }
    }
}

const IMAGE_KEYS: &[&str] = &[
    "src",
    "big_src",
    "cdn_src",
    "big_cdn_src",
    "cdn_src_active",
    "big_pic",
    "small_pic",
    "origin_pic",
    "src_pic",
    "dynamic_pic",
    "vpic",
];

const VIDEO_AUDIO_KEYS: &[&str] = &["video_url", "voice_url", "vsrc", "vhsrc"];

const AVATAR_KEYS: &[&str] = &["portrait", "portraith"];

fn is_media_host(url: &str) -> bool {
    url::Url::parse(url).ok().is_some_and(|u| {
        u.host_str().is_some_and(|host| {
            let host = host.to_ascii_lowercase();
            host.ends_with("baidu.com")
                || host.ends_with("bdstatic.com")
                || host.ends_with("bdimg.com")
        })
    })
}

fn normalize_media(kind: MediaKind, value: &str) -> Option<String> {
    let value = value.trim();
    if value.is_empty() {
        return None;
    }
    let url = match kind {
        MediaKind::Avatar if !value.starts_with("http") => {
            format!("{AVATAR_BASE}{}", value.trim_start_matches('/'))
        }
        _ => value.to_string(),
    };
    if !url.starts_with("http") || !is_media_host(&url) {
        return None;
    }
    Some(url)
}

/// Recursively walks a decoded protobuf JSON response and collects media URLs
/// from the known field names, grouped by kind.
fn collect_media(value: &Value, options: &SaveOptions, out: &mut Vec<(String, MediaKind)>) {
    match value {
        Value::Object(map) => {
            for (key, child) in map {
                let kind = if options.save_images && IMAGE_KEYS.contains(&key.as_str()) {
                    Some(MediaKind::Image)
                } else if options.save_video_audio && VIDEO_AUDIO_KEYS.contains(&key.as_str()) {
                    Some(MediaKind::VideoAudio)
                } else if options.save_avatars && AVATAR_KEYS.contains(&key.as_str()) {
                    Some(MediaKind::Avatar)
                } else {
                    None
                };
                if let (Some(kind), Value::String(text)) = (kind, child) {
                    if let Some(url) = normalize_media(kind, text) {
                        out.push((url, kind));
                    }
                }
                collect_media(child, options, out);
            }
        }
        Value::Array(items) => {
            for item in items {
                collect_media(item, options, out);
            }
        }
        _ => {}
    }
}

/// Collects floor tasks and media URLs from one decoded page JSON, honouring
/// the current save options. Shared by the fetch loop and the archived-page
/// rescan so incremental saves can pick up newly enabled options.
fn scan_page_json(
    page_data: &Value,
    options: &SaveOptions,
    floor_seen: &mut HashSet<String>,
    floor_tasks: &mut Vec<(String, i64, u32)>,
    media_urls: &mut Vec<(String, MediaKind)>,
) {
    if options.save_subposts {
        if let Some(posts) = page_data.get("post_list").and_then(Value::as_array) {
            for post in posts {
                let sub_post_number = post
                    .get("sub_post_number")
                    .and_then(Value::as_u64)
                    .unwrap_or(0);
                if sub_post_number == 0 {
                    continue;
                }
                let pid = match post.get("id") {
                    Some(Value::Number(number)) => number.to_string(),
                    Some(Value::String(text)) => text.clone(),
                    _ => continue,
                };
                let pid_num = post.get("id").and_then(|v| match v {
                    Value::Number(n) => n.as_i64(),
                    Value::String(s) => s.parse().ok(),
                    _ => None,
                });
                if floor_seen.insert(pid.clone()) {
                    floor_tasks.push((pid, pid_num.unwrap_or(0), sub_post_number as u32));
                }
            }
        }
    }
    if options.save_images || options.save_video_audio || options.save_avatars {
        collect_media(page_data, options, media_urls);
    }
}

// ---------------------------------------------------------------------------
// Save job
// ---------------------------------------------------------------------------

struct CrawlContext<R: Runtime> {
    app: AppHandle<R>,
    options: SaveOptions,
    cancel: Arc<AtomicBool>,
}

impl<R: Runtime> CrawlContext<R> {
    fn cancelled(&self) -> bool {
        self.cancel.load(Ordering::Relaxed)
    }
}

fn json_str(value: &Value, pointer: &str) -> Option<String> {
    value
        .pointer(pointer)
        .and_then(Value::as_str)
        .filter(|s| !s.is_empty())
        .map(str::to_string)
}

fn json_i64(value: &Value, pointer: &str) -> Option<i64> {
    value.pointer(pointer).and_then(|v| match v {
        Value::Number(n) => n.as_i64(),
        Value::String(s) => s.parse().ok(),
        _ => None,
    })
}

/// Downloads one media URL (unless its blob is already archived) and appends
/// it to the archive. Returns Ok(false) when skipped, Ok(true) when stored.
async fn store_media<R: Runtime>(
    ctx: &CrawlContext<R>,
    tid: &str,
    url: &str,
) -> Result<bool, String> {
    let member = media_member(url);
    if thread_archive::has_member(&ctx.app, tid, &member)? {
        return Ok(false);
    }
    let (mime, bytes) = fetch_bytes(
        url,
        None,
        "https://tieba.baidu.com/",
        Some(ctx.options.max_media_bytes),
    )
    .await?;
    if bytes.is_empty() {
        return Ok(false);
    }
    let _ = mime;
    thread_archive::append_member(&ctx.app, tid, &member, &bytes)?;
    update_meta_at(&thread_archive::archive_path(&ctx.app, tid)?, |meta| {
        meta.media_count += 1;
        meta.media_bytes += bytes.len() as u64;
    })?;
    Ok(true)
}

#[allow(clippy::too_many_lines)]
async fn run_save<R: Runtime>(
    app: AppHandle<R>,
    tid: String,
    options: SaveOptions,
    bduss: Option<String>,
    stoken: Option<String>,
    proxy_url: Option<String>,
    cancel: Arc<AtomicBool>,
) -> Result<String, String> {
    validate_tid(&tid)?;
    let archive = thread_archive::archive_path(&app, &tid)?;
    let client = TiebaClient::new(proxy_url.as_deref()).map_err(|e| e.to_string())?;
    let cookie = cookie_header(bduss.as_deref(), stoken.as_deref());
    let api = PbApi {
        client: &client,
        cookie: cookie.as_deref(),
        bduss: bduss.as_deref(),
        stoken: stoken.as_deref(),
    };
    let ctx = CrawlContext {
        app: app.clone(),
        options,
        cancel,
    };

    // ---- Phase 0: probe page 1 for thread info and total pages ----
    progress(&app, &tid, "pages", 0, 1, "正在获取帖子信息...".into());
    let tid_num: i64 = tid.parse().map_err(|_| format!("invalid tid: {tid}"))?;
    let first = api.fetch_page(tid_num, 1, ctx.options.only_author).await?;
    if let Some(errmsg) = json_str(&first, "/error/errmsg").filter(|_| {
        first.pointer("/error/errorno").is_some_and(|v| {
            v.as_i64()
                .or_else(|| v.as_str().and_then(|s| s.parse().ok()))
                != Some(0)
        })
    }) {
        return Err(format!("贴吧服务器错误: {errmsg}"));
    }
    let data = first
        .pointer("/data")
        .cloned()
        .ok_or_else(|| "响应缺少 data 字段".to_string())?;

    let title = json_str(&data, "/thread/title").unwrap_or_else(|| format!("贴子{tid}"));
    let total_page = json_i64(&data, "/page/total_page")
        .filter(|v| *v > 0)
        .or_else(|| json_i64(&data, "/page/new_total_page").filter(|v| *v > 0))
        .unwrap_or(1) as u32;
    let author_name = json_str(&data, "/thread/author/name_show")
        .or_else(|| json_str(&data, "/thread/author/name"))
        .unwrap_or_default();

    // ---- Phase 1: pages ----
    let saved_pages: Vec<u32> = if ctx.options.only_author {
        thread_archive::read_meta_at(&archive)?
            .map(|m| m.saved_pages_lz)
            .unwrap_or_default()
    } else {
        thread_archive::read_meta_at(&archive)?
            .map(|m| m.saved_pages)
            .unwrap_or_default()
    };
    let saved_set: HashSet<u32> = saved_pages.iter().copied().collect();

    let target_pages: Vec<u32> = match ctx.options.page_range.as_deref().map(str::trim) {
        Some(spec) if !spec.is_empty() => parse_page_range(spec)?
            .into_iter()
            .filter(|page| *page <= total_page)
            .collect(),
        _ => (1..=total_page).collect(),
    };
    let todo_pages: Vec<u32> = target_pages
        .iter()
        .copied()
        .filter(|page| !saved_set.contains(page))
        .collect();
    let total = todo_pages.len() as u32;

    update_meta_at(&archive, |meta| {
        meta.tid = tid.clone();
        meta.title = title.clone();
        meta.forum_id = json_i64(&data, "/forum/id").unwrap_or(0);
        meta.forum_name = json_str(&data, "/forum/name").unwrap_or_default();
        meta.forum_avatar = json_str(&data, "/forum/avatar").unwrap_or_default();
        meta.author_id = json_i64(&data, "/thread/author/id")
            .map(|v| v.to_string())
            .or_else(|| json_str(&data, "/thread/author/id"))
            .unwrap_or_default();
        meta.author_name = author_name.clone();
        meta.total_page = total_page;
        meta.only_author = ctx.options.only_author;
        if meta.created_at == 0 {
            meta.created_at = now_unix();
        }
        meta.updated_at = now_unix();
    })?;

    if total == 0 {
        progress(&app, &tid, "pages", 0, 0, "所有目标页均已保存".into());
    }

    let mut floor_tasks: Vec<(String, i64, u32)> = Vec::new();
    let mut floor_seen: HashSet<String> = thread_archive::read_meta_at(&archive)?
        .map(|m| m.saved_floors)
        .unwrap_or_default()
        .into_iter()
        .collect();
    let mut media_urls: Vec<(String, MediaKind)> = Vec::new();
    let mut media_seen: HashSet<String> = HashSet::new();

    // 增量保存支持：已归档的页面也按当前选项重扫一遍，补收集楼中楼与媒体
    // （例如首次只保存了图片，二次增量再开启头像/楼中楼/视频）。
    for page in target_pages
        .iter()
        .copied()
        .filter(|page| saved_set.contains(page))
    {
        if ctx.cancelled() {
            return Err("__cancelled__".to_string());
        }
        let member = page_member(page, ctx.options.only_author);
        let Some(bytes) = thread_archive::read_member_by_tid(&app, &tid, &member)? else {
            continue;
        };
        let Ok(value) = serde_json::from_slice::<Value>(&bytes) else {
            continue;
        };
        let Some(page_data) = value.pointer("/data") else {
            continue;
        };
        scan_page_json(
            &page_data,
            &ctx.options,
            &mut floor_seen,
            &mut floor_tasks,
            &mut media_urls,
        );
    }

    for (index, page) in todo_pages.iter().enumerate() {
        if ctx.cancelled() {
            return Err("__cancelled__".to_string());
        }
        let value = if *page == 1 {
            first.clone()
        } else {
            api.fetch_page(tid_num, *page, ctx.options.only_author)
                .await?
        };
        let page_data = value
            .pointer("/data")
            .cloned()
            .ok_or_else(|| format!("第 {page} 页响应缺少 data 字段"))?;

        scan_page_json(
            &page_data,
            &ctx.options,
            &mut floor_seen,
            &mut floor_tasks,
            &mut media_urls,
        );

        let json = serde_json::to_vec(&value).map_err(|e| e.to_string())?;
        thread_archive::append_member(
            &app,
            &tid,
            &page_member(*page, ctx.options.only_author),
            &json,
        )?;
        update_meta_at(&archive, |meta| {
            let list = if ctx.options.only_author {
                &mut meta.saved_pages_lz
            } else {
                &mut meta.saved_pages
            };
            if !list.contains(page) {
                list.push(*page);
            }
            meta.has_subposts = meta.has_subposts || !floor_tasks.is_empty();
            meta.updated_at = now_unix();
        })?;
        progress(
            &app,
            &tid,
            "pages",
            (index + 1) as u32,
            total,
            format!("已保存第 {page} 页 ({title})"),
        );
    }

    // ---- Phase 2: floors (楼中楼) ----
    let floor_total = floor_tasks.len() as u32;
    for (index, (pid_str, pid, sub_post_number)) in floor_tasks.iter().enumerate() {
        if ctx.cancelled() {
            return Err("__cancelled__".to_string());
        }
        let mut fetched: u32 = 0;
        let mut pn: u32 = 0;
        loop {
            if ctx.cancelled() {
                return Err("__cancelled__".to_string());
            }
            pn += 1;
            if pn > MAX_FLOOR_PAGES || fetched >= *sub_post_number {
                break;
            }
            let value = api.fetch_floor(tid_num, *pid, pn).await?;
            let page_data = value
                .pointer("/data")
                .cloned()
                .ok_or_else(|| format!("楼中楼 {pid} 第 {pn} 页响应缺少 data 字段"))?;
            let count = page_data
                .get("subpost_list")
                .and_then(Value::as_array)
                .map(|list| list.len() as u32)
                .unwrap_or(0);
            if count == 0 {
                break;
            }
            if ctx.options.save_images || ctx.options.save_video_audio || ctx.options.save_avatars {
                collect_media(&page_data, &ctx.options, &mut media_urls);
            }
            let json = serde_json::to_vec(&value).map_err(|e| e.to_string())?;
            thread_archive::append_member(&app, &tid, &floor_member(pid_str, pn), &json)?;
            fetched += count;
        }
        let member_dir = "floors";
        update_meta_at(&archive, |meta| {
            if !meta.saved_floors.contains(pid_str) {
                meta.saved_floors.push(pid_str.clone());
            }
            meta.has_subposts = true;
            let _ = member_dir;
            meta.updated_at = now_unix();
        })?;
        progress(
            &app,
            &tid,
            "floors",
            (index + 1) as u32,
            floor_total,
            format!("已保存楼中楼 {pid_str} ({}/{})", index + 1, floor_total),
        );
    }

    // ---- Phase 3: media ----
    // De-duplicate by URL, skipping blobs that are already archived.
    let mut queue: Vec<(String, MediaKind)> = Vec::new();
    for (url, kind) in media_urls {
        if media_seen.insert(url.clone()) {
            queue.push((url, kind));
        }
    }
    let media_total = queue.len() as u32;
    let mut stored: u32 = 0;
    let mut failed: u32 = 0;
    for (index, (url, kind)) in queue.iter().enumerate() {
        if ctx.cancelled() {
            return Err("__cancelled__".to_string());
        }
        match store_media(&ctx, &tid, url).await {
            Ok(true) => {
                stored += 1;
                if stored.is_multiple_of(5) || index as u32 + 1 == media_total {
                    progress(
                        &app,
                        &tid,
                        "media",
                        index as u32 + 1,
                        media_total,
                        format!("已保存 {} {}/{}", kind.label(), index + 1, media_total),
                    );
                }
            }
            Ok(false) => {}
            Err(error) => {
                failed += 1;
                eprintln!("[thread-save] media {url} failed: {error}");
            }
        }
    }

    update_meta_at(&archive, |meta| {
        meta.updated_at = now_unix();
    })?;
    if ctx.cancelled() {
        return Err("__cancelled__".to_string());
    }
    let mut message = format!(
        "保存完成：{}/{} 页",
        saved_pages.len() + todo_pages.len(),
        if ctx
            .options
            .page_range
            .as_deref()
            .map(str::trim)
            .is_some_and(|s| !s.is_empty())
        {
            target_pages.len()
        } else {
            total_page as usize
        }
    );
    if floor_total > 0 {
        message.push_str(&format!("，{floor_total} 组楼中楼"));
    }
    message.push_str(&format!("，{stored} 个媒体文件"));
    if failed > 0 {
        message.push_str(&format!("（{failed} 个失败）"));
    }
    Ok(message)
}

#[command]
pub async fn thread_save_start<R: Runtime>(
    app: AppHandle<R>,
    jobs: State<'_, SaveJobs>,
    tid: String,
    options: Option<SaveOptions>,
    bduss: Option<String>,
    stoken: Option<String>,
    proxy_url: Option<String>,
) -> Result<(), String> {
    validate_tid(&tid)?;
    if jobs.is_running(&tid) {
        return Err("该帖子正在保存中".to_string());
    }
    let cancel = Arc::new(AtomicBool::new(false));
    jobs.0
        .lock()
        .unwrap_or_else(|p| p.into_inner())
        .insert(tid.clone(), cancel.clone());
    let options = options.unwrap_or_default();

    let worker_app = app.clone();
    let worker_tid = tid.clone();
    let jobs_map = jobs.0.clone();
    tauri::async_runtime::spawn(async move {
        let cancelled = cancel.clone();
        let result = run_save(
            worker_app.clone(),
            worker_tid.clone(),
            options,
            bduss,
            stoken,
            proxy_url,
            cancel,
        )
        .await;
        jobs_map
            .lock()
            .unwrap_or_else(|p| p.into_inner())
            .remove(&worker_tid);
        let (phase, message) = match result {
            Ok(message) => ("done", message),
            Err(error) if error == "__cancelled__" => ("cancelled", "已取消保存".to_string()),
            Err(error) => ("error", error),
        };
        let _ = cancelled;
        progress(&worker_app, &worker_tid, phase, 0, 0, message);
    });
    Ok(())
}

#[command]
pub fn thread_save_cancel(jobs: State<'_, SaveJobs>, tid: String) -> Result<(), String> {
    if let Some(flag) = jobs.0.lock().unwrap_or_else(|p| p.into_inner()).get(&tid) {
        flag.store(true, Ordering::Relaxed);
        Ok(())
    } else {
        Err("该帖子没有正在进行的保存任务".to_string())
    }
}

#[command]
pub fn thread_save_status(jobs: State<'_, SaveJobs>, tid: String) -> Result<bool, String> {
    Ok(jobs.is_running(&tid))
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn page_range_parses_lists_and_ranges() {
        assert_eq!(parse_page_range("1,2").unwrap(), vec![1, 2]);
        assert_eq!(parse_page_range("1-3,5").unwrap(), vec![1, 2, 3, 5]);
        assert!(parse_page_range("3-1").is_err());
        assert_eq!(parse_page_range(" 2 , 4-5 ").unwrap(), vec![2, 4, 5]);
        assert_eq!(parse_page_range("2,2,1").unwrap(), vec![1, 2]);
    }

    #[test]
    fn page_range_rejects_garbage() {
        assert!(parse_page_range("a").is_err());
        assert!(parse_page_range("").is_err());
        assert!(parse_page_range("0").is_err());
        assert!(parse_page_range("1-").is_err());
    }

    #[test]
    fn media_collection_follows_options() {
        let value = serde_json::json!({
            "post_list": [{
                "content": [{"type": 3, "src": "https://imgsrc.baidu.com/a.jpg", "text": "x"}],
                "media": [{"big_pic": "https://imgsrc.baidu.com/b.jpg"}],
                "video_info": {"video_url": "https://vd3.bdstatic.com/md.mp4"},
                "author": {"portrait": "abc"}
            }]
        });
        let mut options = SaveOptions {
            save_images: true,
            ..Default::default()
        };
        let mut out = Vec::new();
        collect_media(&value, &options, &mut out);
        assert_eq!(out.len(), 2);
        assert!(out.iter().all(|(_, kind)| *kind == MediaKind::Image));

        options.save_video_audio = true;
        options.save_avatars = true;
        out.clear();
        collect_media(&value, &options, &mut out);
        assert_eq!(out.len(), 4);
        assert!(out.iter().any(|(url, kind)| *kind == MediaKind::VideoAudio
            && url == "https://vd3.bdstatic.com/md.mp4"));
        assert!(out
            .iter()
            .any(|(url, kind)| *kind == MediaKind::Avatar && url == &format!("{AVATAR_BASE}abc")));
    }

    #[test]
    fn scan_page_json_queues_floors_and_media_by_options() {
        let page_data = serde_json::json!({
            "post_list": [
                {"id": 111, "sub_post_number": 3, "content": [{"src": "https://imgsrc.baidu.com/a.jpg"}]},
                {"id": 222, "sub_post_number": 0},
                {"id": "333", "sub_post_number": 1, "author": {"portrait": "p1"}}
            ]
        });

        // 首次只保存图片：只收集媒体，不排楼中楼任务。
        let options = SaveOptions {
            save_images: true,
            ..Default::default()
        };
        let mut floor_seen = HashSet::new();
        let mut floor_tasks = Vec::new();
        let mut media_urls = Vec::new();
        scan_page_json(
            &page_data,
            &options,
            &mut floor_seen,
            &mut floor_tasks,
            &mut media_urls,
        );
        assert!(floor_tasks.is_empty());
        assert_eq!(media_urls.len(), 1);

        // 增量开启楼中楼 + 头像：重扫已归档页要能补齐两者。
        let options = SaveOptions {
            save_images: true,
            save_subposts: true,
            save_avatars: true,
            ..Default::default()
        };
        scan_page_json(
            &page_data,
            &options,
            &mut floor_seen,
            &mut floor_tasks,
            &mut media_urls,
        );
        assert_eq!(floor_tasks.len(), 2);
        assert_eq!(floor_tasks[0], ("111".to_string(), 111, 3));
        assert_eq!(floor_tasks[1], ("333".to_string(), 333, 1));
        // 头像新进队列；图片 URL 因 media 去重由调用方负责，这里只断言增量。
        assert!(media_urls
            .iter()
            .any(|(url, kind)| *kind == MediaKind::Avatar && url == &format!("{AVATAR_BASE}p1")));
    }

    #[test]
    fn foreign_media_hosts_are_rejected() {
        let value = serde_json::json!({
            "content": [
                {"src": "https://evil.example.com/a.jpg"},
                {"src": "https://imgsrc.baidu.com/forum/b.jpg"}
            ]
        });
        let options = SaveOptions::default();
        let mut out = Vec::new();
        collect_media(&value, &options, &mut out);
        assert_eq!(out.len(), 1);
        assert_eq!(out[0].0, "https://imgsrc.baidu.com/forum/b.jpg");
    }

    #[test]
    fn request_builders_mirror_frontend_shape() {
        let request = page_request(9608447031, 2, true, Some("bduss-x"), Some("stoken-y"));
        let data = request.data.unwrap();
        assert_eq!(data.kz, 9608447031);
        assert_eq!(data.pn, 2);
        assert_eq!(data.rn, 30);
        assert_eq!(data.lz, 1);
        let common = data.common.unwrap();
        assert_eq!(common.client_type, 2);
        assert_eq!(common.client_version, "12.79.1.0");
        assert_eq!(common.bduss, "bduss-x");
        assert_eq!(common.stoken, "stoken-y");

        let floor_req = floor_request(1, 2, 3, None, None);
        let data = floor_req.data.unwrap();
        assert_eq!(data.kz, 1);
        assert_eq!(data.pid, 2);
        assert_eq!(data.pn, 3);
        assert_eq!(data.sort, 0);

        assert_eq!(
            cookie_header(Some("b"), Some("s")).as_deref(),
            Some("BDUSS=b; STOKEN=s;")
        );
    }

    /// Live smoke test against the real Tieba endpoint:
    /// `cargo test -- --ignored live_crawl_small_thread`
    #[tokio::test]
    #[ignore]
    async fn live_crawl_small_thread() {
        let client = TiebaClient::new(None).unwrap();
        let request = page_request(9608447031, 1, false, None, None);
        let value = fetch_pb_json::<thread_page::PbPageResIdl>(
            &client,
            PB_PAGE_URL,
            &request.encode_to_vec(),
            None,
        )
        .await
        .expect("threadPage request failed");
        let title = json_str(&value, "/data/thread/title").expect("missing thread title");
        assert!(!title.is_empty());
        let total_page = json_i64(&value, "/data/page/total_page").unwrap_or(1);
        assert!(total_page >= 1);
        let mut media = Vec::new();
        collect_media(&value, &SaveOptions::default(), &mut media);
        println!(
            "thread 9608447031: title={title} total_page={total_page} media_urls={}",
            media.len()
        );

        // The first post with replies must expose a floor target.
        let posts = value
            .pointer("/data/post_list")
            .and_then(Value::as_array)
            .cloned()
            .unwrap_or_default();
        assert!(!posts.is_empty());
    }

    /// Live smoke test for the floor (楼中楼) endpoint:
    /// `cargo test -- --ignored live_crawl_floor`
    #[tokio::test]
    #[ignore]
    async fn live_crawl_floor() {
        let client = TiebaClient::new(None).unwrap();
        let page = fetch_pb_json::<thread_page::PbPageResIdl>(
            &client,
            PB_PAGE_URL,
            &page_request(9608447031, 1, false, None, None).encode_to_vec(),
            None,
        )
        .await
        .expect("threadPage request failed");
        let post = page
            .pointer("/data/post_list")
            .and_then(Value::as_array)
            .and_then(|posts| {
                posts.iter().find(|post| {
                    post.get("sub_post_number")
                        .and_then(Value::as_u64)
                        .unwrap_or(0)
                        > 0
                })
            })
            .cloned()
            .expect("thread has no subposts on page 1");
        let pid = post.get("id").and_then(Value::as_i64).expect("post id");
        let sub_post_number = post
            .get("sub_post_number")
            .and_then(Value::as_u64)
            .unwrap_or(0);

        let floor = fetch_pb_json::<floor::PbFloorResIdl>(
            &client,
            PB_FLOOR_URL,
            &floor_request(9608447031, pid, 1, None, None).encode_to_vec(),
            None,
        )
        .await
        .expect("floor request failed");
        let count = floor
            .pointer("/data/subpost_list")
            .and_then(Value::as_array)
            .map(|list| list.len())
            .unwrap_or(0);
        println!("floor {pid}: sub_post_number={sub_post_number} fetched={count}");
        assert!(count > 0);
    }

    /// Full end-to-end: crawls the small thread (pages + floors + media) into
    /// a real tar archive, then reads everything back.
    /// `cargo test -- --ignored live_save_small_thread_end_to_end`
    #[tokio::test]
    #[ignore]
    async fn live_save_small_thread_end_to_end() {
        let _guard = LIVE_ARCHIVE_LOCK.lock().unwrap_or_else(|p| p.into_inner());
        let temp = live_archive_dir("small");
        let app = tauri::test::mock_app();
        let handle = app.handle().clone();
        let options = SaveOptions {
            save_images: true,
            save_subposts: true,
            save_avatars: true,
            ..Default::default()
        };
        let message = run_save(
            handle.clone(),
            "9608447031".to_string(),
            options,
            None,
            None,
            None,
            Arc::new(AtomicBool::new(false)),
        )
        .await
        .expect("save failed");
        println!("save result: {message}");

        let archive = thread_archive::archive_path(&handle, "9608447031").unwrap();
        let meta = thread_archive::read_meta_at(&archive)
            .unwrap()
            .expect("meta missing");
        assert_eq!(meta.tid, "9608447031");
        assert_eq!(meta.saved_pages.len(), 3);
        assert!(!meta.saved_floors.is_empty());
        assert!(meta.media_count > 0);
        println!(
            "archive: pages={:?} floors={} media={} bytes={}",
            meta.saved_pages,
            meta.saved_floors.len(),
            meta.media_count,
            meta.media_bytes
        );

        // Every saved page must be readable and parse back into JSON.
        for page in &meta.saved_pages {
            let member = page_member(*page, false);
            let bytes = thread_archive::read_member_by_tid(&handle, "9608447031", &member)
                .unwrap()
                .unwrap_or_else(|| panic!("{member} missing"));
            let value: Value = serde_json::from_slice(&bytes).expect("page not valid JSON");
            assert!(value.pointer("/data/post_list").is_some());
        }
        // Media blobs must be retrievable by their URL hash.
        let first_floor = floor_member(&meta.saved_floors[0], 1);
        let floor_bytes = thread_archive::read_member_by_tid(&handle, "9608447031", &first_floor)
            .unwrap()
            .expect("floor missing");
        let floor_json: Value = serde_json::from_slice(&floor_bytes).unwrap();
        let mut media = Vec::new();
        collect_media(&floor_json, &SaveOptions::default(), &mut media);
        if let Some((url, _)) = media.first() {
            let blob =
                thread_archive::read_member_by_tid(&handle, "9608447031", &media_member(url))
                    .unwrap()
                    .unwrap_or_else(|| panic!("media for {url} missing"));
            assert!(!blob.is_empty());
        }

        // Cleanup only the temp dir this test owns.
        drop(handle);
        let _ = std::fs::remove_dir_all(&temp);
        std::env::remove_var(ARCHIVE_DIR_ENV);
    }

    /// Large-thread smoke test with a page range (no floors/media to keep it
    /// fast): `cargo test -- --ignored live_save_large_thread_page_range`
    #[tokio::test]
    #[ignore]
    async fn live_save_large_thread_page_range() {
        let _guard = LIVE_ARCHIVE_LOCK.lock().unwrap_or_else(|p| p.into_inner());
        let temp = live_archive_dir("large");
        let app = tauri::test::mock_app();
        let handle = app.handle().clone();
        let options = SaveOptions {
            page_range: Some("1-2".to_string()),
            ..Default::default()
        };
        let message = run_save(
            handle.clone(),
            "9308723286".to_string(),
            options,
            None,
            None,
            None,
            Arc::new(AtomicBool::new(false)),
        )
        .await
        .expect("save failed");
        println!("save result: {message}");

        let archive = thread_archive::archive_path(&handle, "9308723286").unwrap();
        let meta = thread_archive::read_meta_at(&archive)
            .unwrap()
            .expect("meta missing");
        assert_eq!(meta.saved_pages, vec![1, 2]);
        assert!(meta.total_page >= 2, "large thread should have many pages");
        println!(
            "large thread: title={} total_page={} saved={:?}",
            meta.title, meta.total_page, meta.saved_pages
        );

        // Incremental re-run with an overlapping range must not re-save pages.
        let before = std::fs::metadata(&archive).unwrap().len();
        let options = SaveOptions {
            page_range: Some("2-3".to_string()),
            ..Default::default()
        };
        let message = run_save(
            handle.clone(),
            "9308723286".to_string(),
            options,
            None,
            None,
            None,
            Arc::new(AtomicBool::new(false)),
        )
        .await
        .expect("incremental save failed");
        println!("incremental result: {message}");
        let meta = thread_archive::read_meta_at(&archive).unwrap().unwrap();
        assert_eq!(meta.saved_pages, vec![1, 2, 3]);
        let after = std::fs::metadata(&archive).unwrap().len();
        assert!(after > before, "page 3 must have been appended");

        drop(handle);
        let _ = std::fs::remove_dir_all(&temp);
        std::env::remove_var(ARCHIVE_DIR_ENV);
    }

    const ARCHIVE_DIR_ENV: &str = "NEOTIEBA_ARCHIVE_DIR";

    /// Live tests must never touch the real per-user archive directory: the
    /// mock app's `app_data_dir` resolves to the system data root, so tests
    /// redirect archives into a throwaway temp dir instead. The mutex keeps
    /// the process-global env override exclusive between tests.
    static LIVE_ARCHIVE_LOCK: std::sync::Mutex<()> = std::sync::Mutex::new(());

    fn live_archive_dir(tag: &str) -> std::path::PathBuf {
        let dir = std::env::temp_dir().join(format!(
            "neotieba-live-archive-{}-{tag}",
            std::process::id()
        ));
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(&dir).unwrap();
        std::env::set_var(ARCHIVE_DIR_ENV, &dir);
        dir
    }
}
