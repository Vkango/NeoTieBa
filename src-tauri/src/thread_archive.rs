//! Per-thread tar archives for offline thread storage.
//!
//! Layout (`app_data_dir/saved_threads/{tid}.tar`), GNU tar format, append-only:
//! - `meta.json`             – ThreadMeta, rewritten as a duplicate entry (last entry wins)
//! - `pages/{n}.json`        – raw threadPage response (full view)
//! - `pages_lz/{n}.json`     – raw threadPage response (only-thread-author view)
//! - `floors/{pid}/{pn}.json`– raw floor (楼中楼) response pages
//! - `media/{sha1(url)}`     – media blobs named by the SHA-1 of their source URL
//!
//! Readers build a name -> (offset, len) index over a memmap of the whole file,
//! so any member is served with a single seek + memcpy regardless of archive size.
//! Before each append the trailing 1024-byte zero terminator is stripped and is
//! rewritten when the builder finishes, keeping the file a valid tar at rest.

use memmap2::Mmap;
use serde::{Deserialize, Serialize};
use sha1::{Digest, Sha1};
use std::collections::HashMap;
use std::fs::{self, File, OpenOptions};
use std::io::{Read, Seek, SeekFrom};
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex, OnceLock};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{command, AppHandle, Manager, Runtime};

pub const META_NAME: &str = "meta.json";
const PAGES_DIR: &str = "pages";
const PAGES_LZ_DIR: &str = "pages_lz";
const FLOORS_DIR: &str = "floors";
const MEDIA_DIR: &str = "media";
const BLOCK: usize = 512;
const TERMINATOR: usize = 1024;
const MAX_INDEX_LEN: u64 = 64 * 1024 * 1024 * 1024;

#[derive(Serialize, Deserialize, Clone, Debug, Default)]
#[serde(rename_all = "camelCase", default)]
pub struct ThreadMeta {
    pub tid: String,
    pub title: String,
    pub forum_id: i64,
    pub forum_name: String,
    pub forum_avatar: String,
    pub author_id: String,
    pub author_name: String,
    pub total_page: u32,
    pub saved_pages: Vec<u32>,
    pub saved_pages_lz: Vec<u32>,
    pub saved_floors: Vec<String>,
    pub only_author: bool,
    pub has_subposts: bool,
    pub media_count: u32,
    pub media_bytes: u64,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ArchiveSummary {
    #[serde(flatten)]
    pub meta: ThreadMeta,
    pub file_size: u64,
    pub page_count: u32,
    pub page_count_lz: u32,
    pub floor_count: u32,
    pub media_count: u32,
}

pub fn now_unix() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs() as i64)
        .unwrap_or(0)
}

pub fn validate_tid(tid: &str) -> Result<(), String> {
    if tid.is_empty() || !tid.bytes().all(|b| b.is_ascii_digit()) {
        return Err(format!("invalid tid: {tid}"));
    }
    Ok(())
}

pub fn archive_dir<R: Runtime>(app: &AppHandle<R>) -> Result<PathBuf, String> {
    // Optional override (also used by tests and for future portable mode);
    // when set it is the FULL archive directory, used as-is.
    if let Ok(dir) = std::env::var("NEOTIEBA_ARCHIVE_DIR") {
        if !dir.trim().is_empty() {
            let dir = PathBuf::from(dir.trim());
            fs::create_dir_all(&dir)
                .map_err(|e| format!("Failed to create {}: {e}", dir.display()))?;
            return Ok(dir);
        }
    }
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to resolve app data dir: {e}"))?
        .join("saved_threads");
    fs::create_dir_all(&dir).map_err(|e| format!("Failed to create {}: {e}", dir.display()))?;
    Ok(dir)
}

pub fn archive_path<R: Runtime>(app: &AppHandle<R>, tid: &str) -> Result<PathBuf, String> {
    validate_tid(tid)?;
    Ok(archive_dir(app)?.join(format!("{tid}.tar")))
}

// ---------------------------------------------------------------------------
// Member naming helpers (shared with the save worker)
// ---------------------------------------------------------------------------

pub fn page_member(page: u32, only_author: bool) -> String {
    if only_author {
        format!("{PAGES_LZ_DIR}/{page}.json")
    } else {
        format!("{PAGES_DIR}/{page}.json")
    }
}

pub fn floor_member(pid: &str, pn: u32) -> String {
    format!("{FLOORS_DIR}/{pid}/{pn}.json")
}

pub fn media_member(url: &str) -> String {
    format!("{MEDIA_DIR}/{}", sha1_hex(url.as_bytes()))
}

pub fn sha1_hex(data: &[u8]) -> String {
    let mut hasher = Sha1::new();
    hasher.update(data);
    let digest = hasher.finalize();
    let mut out = String::with_capacity(digest.len() * 2);
    for byte in digest {
        out.push_str(&format!("{byte:02x}"));
    }
    out
}

// ---------------------------------------------------------------------------
// Locking and index cache
// ---------------------------------------------------------------------------

fn path_locks() -> &'static Mutex<HashMap<PathBuf, Arc<Mutex<()>>>> {
    static LOCKS: OnceLock<Mutex<HashMap<PathBuf, Arc<Mutex<()>>>>> = OnceLock::new();
    LOCKS.get_or_init(|| Mutex::new(HashMap::new()))
}

fn path_lock(path: &Path) -> Arc<Mutex<()>> {
    let mut locks = path_locks().lock().unwrap_or_else(|p| p.into_inner());
    locks
        .entry(path.to_path_buf())
        .or_insert_with(|| Arc::new(Mutex::new(())))
        .clone()
}

/// Separate lock table for meta.json read-modify-write sequences. Must always
/// be acquired BEFORE `path_lock` (lock order: meta_lock -> path_lock) so that
/// concurrent writers never interleave a read and a rewrite of meta.json.
fn meta_locks() -> &'static Mutex<HashMap<PathBuf, Arc<Mutex<()>>>> {
    static LOCKS: OnceLock<Mutex<HashMap<PathBuf, Arc<Mutex<()>>>>> = OnceLock::new();
    LOCKS.get_or_init(|| Mutex::new(HashMap::new()))
}

fn meta_lock(path: &Path) -> Arc<Mutex<()>> {
    let mut locks = meta_locks().lock().unwrap_or_else(|p| p.into_inner());
    locks
        .entry(path.to_path_buf())
        .or_insert_with(|| Arc::new(Mutex::new(())))
        .clone()
}

struct CacheEntry {
    len: u64,
    index: Arc<Index>,
}

fn index_cache() -> &'static Mutex<HashMap<PathBuf, CacheEntry>> {
    static CACHE: OnceLock<Mutex<HashMap<PathBuf, CacheEntry>>> = OnceLock::new();
    CACHE.get_or_init(|| Mutex::new(HashMap::new()))
}

// ---------------------------------------------------------------------------
// Low-level tar primitives
// ---------------------------------------------------------------------------

type Index = HashMap<String, (u64, u64)>;

fn parse_octal(bytes: &[u8]) -> u64 {
    let text = std::str::from_utf8(bytes).unwrap_or("");
    let text = text
        .trim_matches(|c: char| c == ' ' || c == '\0')
        .trim_start_matches('0');
    if text.is_empty() {
        return 0;
    }
    u64::from_str_radix(text, 8).unwrap_or(0)
}

fn c_string(bytes: &[u8]) -> String {
    let end = bytes.iter().position(|&b| b == 0).unwrap_or(bytes.len());
    String::from_utf8_lossy(&bytes[..end]).into_owned()
}

fn header_name(header: &[u8]) -> String {
    let name = c_string(&header[0..100]);
    if &header[257..262] == b"ustar" && header[262] == b'\0' {
        let prefix = c_string(&header[345..500]);
        if !prefix.is_empty() {
            return format!("{prefix}/{name}");
        }
    }
    name
}

fn is_zero_block(block: &[u8]) -> bool {
    block.iter().all(|&b| b == 0)
}

/// Scans a whole tar image, recording the last entry per member name
/// (tar's standard duplicate-name semantics) as (data offset, data length).
fn build_index(bytes: &[u8]) -> Result<Index, String> {
    let mut index = Index::new();
    let mut pos: usize = 0;
    let mut long_name: Option<String> = None;
    while pos + BLOCK <= bytes.len() {
        let header = &bytes[pos..pos + BLOCK];
        if is_zero_block(header) {
            break;
        }
        let stored_cksum = parse_octal(&header[148..156]);
        // The checksum is the byte sum of the header with the checksum field
        // filled with eight ASCII spaces (8 * 32 = 256).
        let computed: u32 = header
            .iter()
            .enumerate()
            .filter(|(i, _)| !(148..156).contains(i))
            .map(|(_, &b)| b as u32)
            .sum::<u32>()
            + 256;
        if stored_cksum != computed as u64 {
            return Err(format!(
                "tar header checksum mismatch at offset {pos}, archive may be corrupted"
            ));
        }
        let size = parse_octal(&header[124..136]) as usize;
        let typeflag = header[156];
        let data_start = pos + BLOCK;
        let data_end = data_start.saturating_add(size).min(bytes.len());
        let data = &bytes[data_start..data_end];
        match typeflag {
            b'L' => long_name = Some(c_string(data)),
            b'0' | 0 => {
                let name = long_name.take().unwrap_or_else(|| header_name(header));
                let name = name.trim_start_matches("./").to_string();
                index.insert(name, (data_start as u64, size as u64));
            }
            _ => long_name = None,
        }
        pos = data_start + size.div_ceil(BLOCK) * BLOCK;
    }
    Ok(index)
}

fn index_for_file(file: &File, path: &Path, len: u64) -> Result<Arc<Index>, String> {
    if len > MAX_INDEX_LEN {
        return Err(format!(
            "archive {} is larger than the {} byte index limit",
            path.display(),
            MAX_INDEX_LEN
        ));
    }
    {
        let cache = index_cache().lock().unwrap_or_else(|p| p.into_inner());
        if let Some(entry) = cache.get(path) {
            if entry.len == len {
                return Ok(entry.index.clone());
            }
        }
    }
    let mmap = unsafe { Mmap::map(file) }
        .map_err(|e| format!("Failed to mmap {}: {e}", path.display()))?;
    let index = Arc::new(build_index(&mmap)?);
    index_cache()
        .lock()
        .unwrap_or_else(|p| p.into_inner())
        .insert(
            path.to_path_buf(),
            CacheEntry {
                len,
                index: index.clone(),
            },
        );
    Ok(index)
}

/// Appends members to a tar file, keeping it valid at rest by stripping and
/// rewriting the trailing zero terminator. Existing files are extended;
/// missing files are created.
pub fn append_members_at(path: &Path, entries: &[(String, Vec<u8>)]) -> Result<(), String> {
    if entries.is_empty() {
        return Ok(());
    }
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create {}: {e}", parent.display()))?;
    }
    let lock = path_lock(path);
    let _guard = lock.lock().unwrap_or_else(|p| p.into_inner());
    let mut file = OpenOptions::new()
        .read(true)
        .write(true)
        .create(true)
        .truncate(false)
        .open(path)
        .map_err(|e| format!("Failed to open {}: {e}", path.display()))?;

    let len = file
        .metadata()
        .map_err(|e| format!("Failed to stat {}: {e}", path.display()))?
        .len();
    if len >= TERMINATOR as u64 {
        file.seek(SeekFrom::End(-(TERMINATOR as i64)))
            .map_err(|e| format!("Failed to seek in {}: {e}", path.display()))?;
        let mut tail = [0u8; TERMINATOR];
        file.read_exact(&mut tail)
            .map_err(|e| format!("Failed to read tail of {}: {e}", path.display()))?;
        if is_zero_block(&tail[..BLOCK]) && is_zero_block(&tail[BLOCK..]) {
            file.set_len(len - TERMINATOR as u64)
                .map_err(|e| format!("Failed to truncate {}: {e}", path.display()))?;
        }
    }
    file.seek(SeekFrom::End(0))
        .map_err(|e| format!("Failed to seek in {}: {e}", path.display()))?;

    let mut builder = tar::Builder::new(file);
    for (name, data) in entries {
        let mut header = tar::Header::new_gnu();
        header
            .set_path(name)
            .map_err(|e| format!("Invalid member name {name:?}: {e}"))?;
        header.set_size(data.len() as u64);
        header.set_mode(0o644);
        header.set_mtime(now_unix().max(0) as u64);
        header.set_cksum();
        builder
            .append(&header, data.as_slice())
            .map_err(|e| format!("Failed to append {name:?} to {}: {e}", path.display()))?;
    }
    let file = builder
        .into_inner()
        .map_err(|e| format!("Failed to finalize {}: {e}", path.display()))?;
    file.sync_data()
        .map_err(|e| format!("Failed to sync {}: {e}", path.display()))?;
    Ok(())
}

fn read_member_at(path: &Path, name: &str) -> Result<Option<Vec<u8>>, String> {
    let lock = path_lock(path);
    let _guard = lock.lock().unwrap_or_else(|p| p.into_inner());
    let file = match File::open(path) {
        Ok(file) => file,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => return Ok(None),
        Err(error) => return Err(format!("Failed to open {}: {error}", path.display())),
    };
    let len = file
        .metadata()
        .map_err(|e| format!("Failed to stat {}: {e}", path.display()))?
        .len();
    if len == 0 {
        return Ok(None);
    }
    let index = index_for_file(&file, path, len)?;
    match index.get(name) {
        Some(&(offset, size)) => {
            let mmap = unsafe { Mmap::map(&file) }
                .map_err(|e| format!("Failed to mmap {}: {e}", path.display()))?;
            let start = offset as usize;
            let end = start.saturating_add(size as usize).min(mmap.len());
            Ok(Some(mmap[start..end].to_vec()))
        }
        None => Ok(None),
    }
}

fn member_names_at(path: &Path, prefix: &str) -> Result<Vec<String>, String> {
    let lock = path_lock(path);
    let _guard = lock.lock().unwrap_or_else(|p| p.into_inner());
    let file = match File::open(path) {
        Ok(file) => file,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => return Ok(Vec::new()),
        Err(error) => return Err(format!("Failed to open {}: {error}", path.display())),
    };
    let len = file
        .metadata()
        .map_err(|e| format!("Failed to stat {}: {e}", path.display()))?
        .len();
    if len == 0 {
        return Ok(Vec::new());
    }
    let index = index_for_file(&file, path, len)?;
    let mut names: Vec<String> = index
        .keys()
        .filter(|name| name.starts_with(prefix))
        .cloned()
        .collect();
    names.sort();
    Ok(names)
}

// ---------------------------------------------------------------------------
// Meta helpers
// ---------------------------------------------------------------------------

pub fn read_meta_at(path: &Path) -> Result<Option<ThreadMeta>, String> {
    match read_member_at(path, META_NAME)? {
        Some(bytes) => serde_json::from_slice(&bytes)
            .map(Some)
            .map_err(|e| format!("Corrupted meta.json in {}: {e}", path.display())),
        None => Ok(None),
    }
}

pub fn write_meta_at(path: &Path, meta: &ThreadMeta) -> Result<(), String> {
    let json = serde_json::to_vec(meta).map_err(|e| format!("Failed to encode meta: {e}"))?;
    append_members_at(path, &[(META_NAME.to_string(), json)])
}

/// Reads the current meta, applies `mutate`, and appends the updated entry.
/// The whole read-modify-write runs under the per-path meta lock so parallel
/// callers (concurrent page/floor/media workers) never lose updates.
pub fn update_meta_at(
    path: &Path,
    mutate: impl FnOnce(&mut ThreadMeta),
) -> Result<ThreadMeta, String> {
    let lock = meta_lock(path);
    let _guard = lock.lock().unwrap_or_else(|p| p.into_inner());
    let mut meta = read_meta_at(path)?.unwrap_or_default();
    mutate(&mut meta);
    write_meta_at(path, &meta)?;
    Ok(meta)
}

// ---------------------------------------------------------------------------
// Tauri-facing helpers (used by thread_save and the media protocol handler)
// ---------------------------------------------------------------------------

pub fn append_member<R: Runtime>(
    app: &AppHandle<R>,
    tid: &str,
    name: &str,
    data: &[u8],
) -> Result<(), String> {
    let path = archive_path(app, tid)?;
    append_members_at(&path, &[(name.to_string(), data.to_vec())])
}

pub fn read_member_by_tid<R: Runtime>(
    app: &AppHandle<R>,
    tid: &str,
    name: &str,
) -> Result<Option<Vec<u8>>, String> {
    read_member_at(&archive_path(app, tid)?, name)
}

/// Lists the names of all members under `prefix` (e.g. `media/`) in one
/// archive. Used by the save worker to prefetch the already-stored media set
/// instead of probing member by member.
pub fn member_names_by_tid<R: Runtime>(
    app: &AppHandle<R>,
    tid: &str,
    prefix: &str,
) -> Result<Vec<String>, String> {
    member_names_at(&archive_path(app, tid)?, prefix)
}

// ---------------------------------------------------------------------------
// Sniffing and URL classification (shared with thread_save)
// ---------------------------------------------------------------------------

/// Detects the MIME type of a stored media blob from its magic bytes.
pub fn sniff_mime(bytes: &[u8]) -> &'static str {
    if bytes.starts_with(&[0xFF, 0xD8, 0xFF]) {
        "image/jpeg"
    } else if bytes.starts_with(&[0x89, b'P', b'N', b'G']) {
        "image/png"
    } else if bytes.starts_with(b"GIF8") {
        "image/gif"
    } else if bytes.len() > 12 && &bytes[0..4] == b"RIFF" && &bytes[8..12] == b"WEBP" {
        "image/webp"
    } else if bytes.starts_with(b"BM") {
        "image/bmp"
    } else if bytes.len() > 12 && &bytes[4..8] == b"ftyp" {
        if &bytes[8..12] == b"M4A " || &bytes[8..12] == b"M4B " {
            "audio/mp4"
        } else {
            "video/mp4"
        }
    } else if bytes.starts_with(b"ID3")
        || (bytes.len() > 2 && bytes[0] == 0xFF && (bytes[1] & 0xE6) == 0xE2)
    {
        "audio/mpeg"
    } else if bytes.starts_with(b"fLaC") {
        "audio/flac"
    } else if bytes.starts_with(b"OggS") {
        "audio/ogg"
    } else if bytes.len() > 12 && &bytes[0..4] == b"RIFF" && &bytes[8..12] == b"WAVE" {
        "audio/wav"
    } else if bytes.starts_with(&[0x1A, 0x45, 0xDF, 0xA3]) {
        "video/webm"
    } else {
        "application/octet-stream"
    }
}

// ---------------------------------------------------------------------------
// Tauri commands
// ---------------------------------------------------------------------------

#[command]
pub fn archive_read_meta<R: Runtime>(
    app: AppHandle<R>,
    tid: String,
) -> Result<Option<ArchiveSummary>, String> {
    let path = archive_path(&app, &tid)?;
    let Some(meta) = read_meta_at(&path)? else {
        return Ok(None);
    };
    let file_size = fs::metadata(&path).map(|m| m.len()).unwrap_or(0);
    Ok(Some(summarize_archive(&path, meta, file_size)?))
}

#[command]
pub fn archive_read_page<R: Runtime>(
    app: AppHandle<R>,
    tid: String,
    page: u32,
    only_author: bool,
) -> Result<String, String> {
    let path = archive_path(&app, &tid)?;
    let name = page_member(page, only_author);
    match read_member_at(&path, &name)? {
        Some(bytes) => String::from_utf8(bytes)
            .map_err(|e| format!("Page {page} of thread {tid} is not valid UTF-8: {e}")),
        None => Err(format!("Thread {tid} has no archived page {page}")),
    }
}

#[command]
pub fn archive_read_floor<R: Runtime>(
    app: AppHandle<R>,
    tid: String,
    pid: String,
    pn: u32,
) -> Result<String, String> {
    let path = archive_path(&app, &tid)?;
    let name = floor_member(&pid, pn);
    match read_member_at(&path, &name)? {
        Some(bytes) => String::from_utf8(bytes)
            .map_err(|e| format!("Floor {pid} page {pn} of thread {tid} is not valid UTF-8: {e}")),
        None => Err(format!(
            "Thread {tid} has no archived floor {pid} page {pn}"
        )),
    }
}

/// Assembles the summary (counts + on-disk size) for one archive file.
fn summarize_archive(
    path: &Path,
    meta: ThreadMeta,
    file_size: u64,
) -> Result<ArchiveSummary, String> {
    Ok(ArchiveSummary {
        page_count: member_names_at(path, &format!("{PAGES_DIR}/"))?.len() as u32,
        page_count_lz: member_names_at(path, &format!("{PAGES_LZ_DIR}/"))?.len() as u32,
        floor_count: member_names_at(path, &format!("{FLOORS_DIR}/"))?.len() as u32,
        media_count: member_names_at(path, &format!("{MEDIA_DIR}/"))?.len() as u32,
        file_size,
        meta,
    })
}

#[command]
pub fn archive_list<R: Runtime>(app: AppHandle<R>) -> Result<Vec<ArchiveSummary>, String> {
    let dir = archive_dir(&app)?;
    let mut entries: Vec<(PathBuf, ArchiveSummary)> = Vec::new();
    for entry in fs::read_dir(&dir).map_err(|e| format!("Failed to read {}: {e}", dir.display()))? {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        if path.extension().and_then(|e| e.to_str()) != Some("tar") {
            continue;
        }
        let file_size = entry
            .metadata()
            .map(|m| m.len())
            .map_err(|e| format!("Failed to stat {}: {e}", path.display()))?;
        let Some(meta) = read_meta_at(&path).unwrap_or(None) else {
            continue;
        };
        entries.push((path.clone(), summarize_archive(&path, meta, file_size)?));
    }
    entries.sort_by_key(|(_, summary)| std::cmp::Reverse(summary.meta.updated_at));
    Ok(entries.into_iter().map(|(_, summary)| summary).collect())
}

#[command]
pub fn archive_delete<R: Runtime>(app: AppHandle<R>, tid: String) -> Result<(), String> {
    let path = archive_path(&app, &tid)?;
    match fs::remove_file(&path) {
        Ok(()) => Ok(()),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(()),
        Err(e) => Err(format!("Failed to delete {}: {e}", path.display())),
    }
}

#[command]
pub fn archive_media_lookup<R: Runtime>(
    app: AppHandle<R>,
    tid: String,
    url: String,
) -> Result<Vec<u8>, String> {
    let member = media_member(&url);
    read_member_by_tid(&app, &tid, &member)?
        .ok_or_else(|| format!("Thread {tid} has no archived media for {url}"))
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    fn temp_tar(tag: &str) -> PathBuf {
        let dir = std::env::temp_dir().join(format!(
            "neotieba-archive-test-{}-{tag}",
            std::process::id()
        ));
        fs::create_dir_all(&dir).unwrap();
        dir.join("test.tar")
    }

    fn cleanup(path: &Path) {
        if let Some(dir) = path.parent() {
            let _ = fs::remove_dir_all(dir);
        }
    }

    #[test]
    fn append_and_read_roundtrip() {
        let path = temp_tar("roundtrip");
        cleanup(&path);
        append_members_at(
            &path,
            &[
                ("pages/1.json".into(), br#"{"a":1}"#.to_vec()),
                ("media/deadbeef".into(), vec![1, 2, 3, 4]),
            ],
        )
        .unwrap();
        // Second append exercises terminator stripping.
        append_members_at(&path, &[("pages/2.json".into(), b"{}".to_vec())]).unwrap();

        let pages = member_names_at(&path, "pages/").unwrap();
        assert_eq!(pages, vec!["pages/1.json", "pages/2.json"]);
        assert_eq!(
            read_member_at(&path, "pages/1.json").unwrap(),
            Some(br#"{"a":1}"#.to_vec())
        );
        assert_eq!(
            read_member_at(&path, "media/deadbeef").unwrap(),
            Some(vec![1, 2, 3, 4])
        );
        assert_eq!(read_member_at(&path, "pages/404.json").unwrap(), None);
        cleanup(&path);
    }

    #[test]
    fn duplicate_names_take_last_entry() {
        let path = temp_tar("dup");
        cleanup(&path);
        append_members_at(&path, &[("meta.json".into(), br#"{"v":1}"#.to_vec())]).unwrap();
        append_members_at(&path, &[("meta.json".into(), br#"{"v":2}"#.to_vec())]).unwrap();
        assert_eq!(
            read_member_at(&path, "meta.json").unwrap(),
            Some(br#"{"v":2}"#.to_vec())
        );
        let meta: ThreadMeta =
            serde_json::from_slice(&read_member_at(&path, "meta.json").unwrap().unwrap()).unwrap();
        assert_eq!(meta.tid, "");
        cleanup(&path);
    }

    #[test]
    fn meta_roundtrip_and_update() {
        let path = temp_tar("meta");
        cleanup(&path);
        let meta = update_meta_at(&path, |meta| {
            meta.tid = "123".into();
            meta.title = "����".into();
            meta.saved_pages.push(1);
            meta.updated_at = 42;
        })
        .unwrap();
        assert_eq!(meta.title, "����");
        let reloaded = read_meta_at(&path).unwrap().unwrap();
        assert_eq!(reloaded.saved_pages, vec![1]);
        assert_eq!(reloaded.tid, "123");
        cleanup(&path);
    }

    #[test]
    fn media_member_is_deterministic_sha1() {
        assert_eq!(
            media_member("https://imgsrc.baidu.com/a.jpg"),
            format!("media/{}", sha1_hex(b"https://imgsrc.baidu.com/a.jpg"))
        );
        assert_ne!(media_member("a"), media_member("b"));
        assert_eq!(sha1_hex(b"abc"), "a9993e364706816aba3e25717850c26c9cd0d89d");
    }

    #[test]
    fn sniff_mime_detects_common_formats() {
        assert_eq!(sniff_mime(&[0xFF, 0xD8, 0xFF, 0xE0]), "image/jpeg");
        assert_eq!(sniff_mime(&[0x89, b'P', b'N', b'G', 0x0D]), "image/png");
        assert_eq!(sniff_mime(b"GIF89a"), "image/gif");
        assert_eq!(sniff_mime(b"RIFFxxxxWEBPVP8 "), "image/webp");
        let mut mp4 = vec![0, 0, 0, 0];
        mp4.extend_from_slice(b"ftypisom");
        mp4.extend_from_slice(&[0, 0, 0, 0]);
        assert_eq!(sniff_mime(&mp4), "video/mp4");
        assert_eq!(sniff_mime(b"ID3\x03"), "audio/mpeg");
        assert_eq!(sniff_mime(b"not media"), "application/octet-stream");
    }

    #[test]
    fn empty_file_reads_as_absent() {
        let path = temp_tar("empty");
        cleanup(&path);
        fs::create_dir_all(path.parent().unwrap()).unwrap();
        fs::write(&path, b"").unwrap();
        assert!(read_meta_at(&path).unwrap().is_none());
        assert_eq!(read_member_at(&path, "meta.json").unwrap(), None);
        assert!(member_names_at(&path, "pages/").unwrap().is_empty());
        cleanup(&path);
    }

    #[test]
    fn missing_file_reads_as_absent() {
        let path = temp_tar("missing");
        cleanup(&path);
        assert!(read_meta_at(&path).unwrap().is_none());
        assert_eq!(read_member_at(&path, "meta.json").unwrap(), None);
        assert!(member_names_at(&path, "pages/").unwrap().is_empty());
        // Writing into a missing file recreates it.
        update_meta_at(&path, |meta| meta.tid = "9".into()).unwrap();
        assert_eq!(read_meta_at(&path).unwrap().unwrap().tid, "9");
        cleanup(&path);
    }
}
