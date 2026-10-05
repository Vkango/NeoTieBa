// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod cookie_manager;
mod file_io;
mod protobuf_api;
mod request;
use protobuf_api::protobuf_call;

use cookie_manager::{
    clear_cookies, delete_cookie, get_baidu_auth_cookies, get_cookie, get_cookies,
    get_cookies_string, set_cookie,
};
use file_io::{copy_file_to_install_dir, read_file, read_file_bytes, write_file};
use request::{fetch_image, http_request, test_connection, RequestSchema};
use tauri::Manager;
#[cfg(not(target_os = "macos"))]
use tauri_plugin_decorum::WebviewWindowExt;
#[cfg(any(target_os = "windows", target_os = "macos"))]
use window_vibrancy::*;
// use api::{ get_user_info };
use base64::{engine::general_purpose, Engine as _};
use tauri::command;

// src-tauri/src/main.rs
use tauri::{AppHandle, Emitter, Runtime, WebviewUrl, WebviewWindow, WebviewWindowBuilder};
use url::Url;
#[cfg(target_os = "macos")]
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

use std::sync::{Mutex, OnceLock};

// Browser login flow state: remembers the credentials present when the login
// window opened, so a stale session can be told apart from a fresh login.
#[derive(Default)]
struct BrowserLoginState {
    baseline: Option<(String, String)>,
    settled: bool,
}

fn login_state() -> &'static Mutex<BrowserLoginState> {
    static STATE: OnceLock<Mutex<BrowserLoginState>> = OnceLock::new();
    STATE.get_or_init(|| Mutex::new(BrowserLoginState::default()))
}

fn is_tieba_url(url: &Url) -> bool {
    url.host_str().is_some_and(|host| {
        host.eq_ignore_ascii_case("tieba.baidu.com")
            || host.to_ascii_lowercase().ends_with(".tieba.baidu.com")
    })
}

async fn complete_login<R: Runtime>(
    app: AppHandle<R>,
    login_window: Option<WebviewWindow<R>>,
    bduss: String,
    stoken: String,
) -> Result<(), String> {
    {
        let mut state = login_state().lock().unwrap();
        if state.settled {
            return Ok(());
        }
        state.settled = true;
    }
    let main = app
        .get_webview_window("main")
        .ok_or_else(|| "无法找到主窗口".to_string())?;
    main.emit(
        "browser-login-cookies",
        serde_json::json!({
            "bduss": bduss, "stoken": stoken,
        }),
    )
    .map_err(|e| e.to_string())?;

    // The app persists the credentials itself; clean the shared jar so the
    // next login starts logged-out where the platform allows it.
    if let Some(login_window) = login_window {
        if let Err(error) = cookie_manager::clear_baidu_cookies(login_window.clone()).await {
            eprintln!("[login] post-login cookie cleanup failed: {}", error);
        }
        let _ = login_window.close();
    }
    Ok(())
}

// Runs when the login window is destroyed. If the user closed it right after
// logging in, the fresh credentials are still in the shared cookie jar and
// are picked up from the main window.
fn finalize_closed_login<R: Runtime>(app: AppHandle<R>) {
    if let Some(main) = app.get_webview_window("main") {
        let _ = main.emit("browser-login-window-closed", ());
    }
    tauri::async_runtime::spawn(async move {
        let (baseline, settled) = {
            let state = login_state().lock().unwrap();
            (state.baseline.clone(), state.settled)
        };
        if settled {
            return;
        }
        let Some(main) = app.get_webview_window("main") else {
            return;
        };
        let Ok(Some((bduss, stoken))) = cookie_manager::read_baidu_auth(main).await else {
            return;
        };
        if baseline.as_ref() != Some(&(bduss.clone(), stoken.clone())) {
            eprintln!("[login] login window closed after a fresh login, recovering credentials");
            let _ = complete_login(app, None, bduss, stoken).await;
        }
    });
}

#[tauri::command]
async fn open_login<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("login_window") {
        return window.set_focus().map_err(|e| e.to_string());
    }

    let url = Url::parse("https://passport.baidu.com/v2/?login&u=https%3A%2F%2Ftieba.baidu.com")
        .map_err(|e| format!("无效的URL: {}", e))?;

    let window = WebviewWindowBuilder::new(
        &app,
        "login_window",
        WebviewUrl::External(Url::parse("about:blank").unwrap()),
    )
    .title("登录百度账号")
    .inner_size(800.0, 600.0)
    .center()
    .build()
    .map_err(|e| format!("创建窗口失败: {}", e))?;

    // Best effort: clear the native cookie store before the login page loads
    // so it starts logged-out where the platform allows it. Clearing is NOT
    // reliable on every webview backend.
    if let Err(error) = cookie_manager::clear_baidu_cookies(window.clone()).await {
        eprintln!("[login] cookie cleanup failed: {}", error);
    }

    // Capture whatever credentials survived the cleanup; login detection
    // below only ever accepts credentials DIFFERENT from these, so a stale
    // session can never be mistaken for a completed login.
    let baseline = cookie_manager::read_baidu_auth(window.clone()).await?;
    {
        let mut state = login_state().lock().unwrap();
        state.baseline = baseline;
        state.settled = false;
    }

    let close_app = app.clone();
    window.on_window_event(move |event| {
        if matches!(event, tauri::WindowEvent::Destroyed) {
            finalize_closed_login(close_app.clone());
        }
    });

    if let Err(error) = window.navigate(url) {
        let _ = window.close();
        return Err(format!("打开登录页失败: {}", error));
    }

    // Auto-complete once the page has actually landed on tieba.baidu.com
    // (passport redirects there after a successful login) with credentials
    // that differ from the ones captured at open time.
    let poll_app = app.clone();
    tauri::async_runtime::spawn(async move {
        loop {
            if login_state().lock().unwrap().settled {
                return;
            }
            let Some(login_window) = poll_app.get_webview_window("login_window") else {
                return;
            };
            let auth = match cookie_manager::read_baidu_auth(login_window.clone()).await {
                Ok(auth) => auth,
                Err(_) => None,
            };
            if let Some((bduss, stoken)) = auth {
                let unchanged = {
                    let state = login_state().lock().unwrap();
                    state.baseline.as_ref() == Some(&(bduss.clone(), stoken.clone()))
                };
                let on_tieba = login_window
                    .url()
                    .map(|url| is_tieba_url(&url))
                    .unwrap_or(false);
                if !unchanged && on_tieba {
                    eprintln!("[login] fresh credentials detected on tieba.baidu.com");
                    let _ = complete_login(poll_app, Some(login_window), bduss, stoken).await;
                    return;
                }
            }
            tokio::time::sleep(std::time::Duration::from_secs(1)).await;
        }
    });
    Ok(())
}

/// Reads BDUSS/STOKEN from the login window after the user explicitly
/// confirmed they finished logging in (e.g. re-using the same account, where
/// the credentials did not change and auto-detection stays silent).
#[tauri::command]
async fn finish_browser_login<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    let window = app
        .get_webview_window("login_window")
        .ok_or_else(|| "登录窗口未打开".to_string())?;

    let (bduss, stoken) = cookie_manager::read_baidu_auth(window.clone())
        .await?
        .ok_or_else(|| "未检测到登录凭据, 请先在登录窗口完成登录".to_string())?;

    complete_login(app, Some(window), bduss, stoken).await
}

#[tauri::command]
async fn cancel_browser_login<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("login_window") {
        // Mark settled first so closing the window cannot recover the
        // credentials from the jar afterwards.
        login_state().lock().unwrap().settled = true;
        let _ = window.close();
    }
    Ok(())
}

#[tauri::command]
fn toggle_devtools<R: Runtime>(window: tauri::WebviewWindow<R>) {
    if window.is_devtools_open() {
        window.close_devtools();
    } else {
        window.open_devtools();
    }
}

#[tauri::command]
fn set_wallpaper_effect<R: Runtime>(
    window: tauri::WebviewWindow<R>,
    effect: &str,
    dark: Option<bool>,
) -> Result<(), String> {
    if let Err(e) = apply_effect(&window, effect, dark) {
        return Err(format!("apply_effect({}) failed: {}", effect, e));
    }
    Ok(())
}

#[tauri::command]
fn set_window_dark_mode<R: Runtime>(
    window: tauri::WebviewWindow<R>,
    dark: bool,
) -> Result<(), String> {
    // Theme must not implicitly replace the selected wallpaper effect.
    window
        .set_theme(Some(if dark {
            tauri::Theme::Dark
        } else {
            tauri::Theme::Light
        }))
        .map_err(|error| error.to_string())?;
    Ok(())
}

#[cfg(target_os = "windows")]
fn apply_effect<R: Runtime>(
    window: &tauri::WebviewWindow<R>,
    effect: &str,
    dark: Option<bool>,
) -> Result<(), String> {
    clear_acrylic(window).map_err(|e| e.to_string())?;
    clear_mica(window).map_err(|e| e.to_string())?;
    match effect {
        "acrylic" => apply_acrylic(window, Some((255, 255, 255, 0))).map_err(|e| format!("{}", e)),
        "mica" => apply_mica(window, dark).map_err(|e| format!("{}", e)),
        "image" | "solid" => Ok(()),
        _ => Err("Unsupported wallpaper effect".into()),
    }
}

#[cfg(not(target_os = "windows"))]
fn apply_effect<R: Runtime>(
    _window: &tauri::WebviewWindow<R>,
    _effect: &str,
    _dark: Option<bool>,
) -> Result<(), String> {
    Ok(())
}

#[command]
async fn http_request_command(request: RequestSchema) -> Result<request::ResponseData, String> {
    http_request(request).await
}

#[command]
async fn fetch_image_base64(url: &str, proxy_url: Option<String>) -> Result<String, String> {
    let (mime, bytes) = fetch_image(url, proxy_url.as_deref()).await?;
    Ok(format!(
        "data:{};base64,{}",
        mime,
        general_purpose::STANDARD.encode(bytes)
    ))
}

fn main() {
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_clipboard_x::init())
        .plugin(tauri_plugin_opener::init());

    // decorum's macOS traffic-light positioning currently dereferences a
    // null NSView on recent macOS versions during window creation.
    #[cfg(not(target_os = "macos"))]
    {
        builder = builder.plugin(tauri_plugin_decorum::init());
    }

    builder
        .invoke_handler(tauri::generate_handler![
            toggle_devtools,
            set_wallpaper_effect,
            set_window_dark_mode,
            http_request_command,
            test_connection,
            read_file,
            read_file_bytes,
            copy_file_to_install_dir,
            write_file,
            fetch_image_base64,
            open_login,
            finish_browser_login,
            cancel_browser_login,
            get_cookies,
            get_cookie,
            set_cookie,
            delete_cookie,
            clear_cookies,
            get_baidu_auth_cookies,
            get_cookies_string,
            protobuf_call
        ])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(not(target_os = "macos"))]
            window
                .create_overlay_titlebar()
                .expect("failed to create overlay titlebar");

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            let _ = apply_acrylic(&window, Some((255, 255, 255, 0)));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
