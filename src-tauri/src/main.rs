// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod cookie_manager;
mod file_io;
mod request;

use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};
use cookie_manager::{
    clear_cookies, delete_cookie, get_baidu_auth_cookies, get_cookie, get_cookies,
    get_cookies_string, set_cookie,
};
use file_io::{copy_file_to_install_dir, read_file, read_file_bytes, write_file};
use request::{
    fetch_data, fetch_data_buffer, fetch_data_post, fetch_data_with_cookie, fetch_data_with_headers,
    fetch_image, test_connection,
};
use tauri::Manager;
#[cfg(not(target_os = "macos"))]
use tauri_plugin_decorum::WebviewWindowExt;
#[cfg(any(target_os = "windows", target_os = "macos"))]
use window_vibrancy::*;
// use api::{ get_user_info };
use base64::{engine::general_purpose, Engine as _};
use reqwest::header::HeaderMap;
use serde_json::Value;
use tauri::command;

// src-tauri/src/main.rs
use tauri::{AppHandle, Emitter, Runtime, WebviewUrl, WebviewWindowBuilder};
use url::Url;
#[cfg(target_os = "macos")]
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

#[tauri::command]
async fn open_login<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("login_window") {
        return window.set_focus().map_err(|e| e.to_string());
    }

    let url = Url::parse("https://passport.baidu.com/v2/?login&u=https%3A%2F%2Ftieba.baidu.com")
        .map_err(|e| format!("无效的URL: {}", e))?;

    // Clear the native cookie store before any login requests can recreate cookies.
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

    let cancelled = Arc::new(AtomicBool::new(false));
    let destroyed = cancelled.clone();
    window.on_window_event(move |event| {
        if matches!(event, tauri::WindowEvent::Destroyed) {
            destroyed.store(true, Ordering::Relaxed);
        }
    });
    if let Err(error) = cookie_manager::clear_baidu_cookies(window.clone()).await {
        let _ = window.close();
        return Err(error);
    }
    if let Err(error) = window.navigate(url) {
        let _ = window.close();
        return Err(format!("打开登录页失败: {}", error));
    }
    tauri::async_runtime::spawn(async move {
        let deadline = tokio::time::Instant::now() + std::time::Duration::from_secs(300);
        let result = async {
            loop {
                if cancelled.load(Ordering::Relaxed) {
                    return Ok(());
                }
                if let Some((bduss, stoken)) =
                    cookie_manager::read_baidu_auth(window.clone()).await?
                {
                    if cancelled.load(Ordering::Relaxed) {
                        return Ok(());
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
                    let _ = window.close();
                    return Ok::<(), String>(());
                }
                if tokio::time::Instant::now() >= deadline {
                    return Err("登录超时，请重新打开登录窗口".to_string());
                }
                tokio::time::sleep(std::time::Duration::from_secs(1)).await;
            }
        }
            .await;
        if let Err(error) = result {
            if !cancelled.load(Ordering::Relaxed) {
                if let Some(main) = app.get_webview_window("main") {
                    let _ = main.emit("browser-login-error", error);
                }
                let _ = window.close();
            }
        }
    });
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
fn set_wallpaper_effect<R: Runtime>(window: tauri::WebviewWindow<R>, effect: &str, dark: Option<bool>) -> Result<(), String> {
    if let Err(e) = apply_effect(&window, effect, dark) {
        return Err(format!("apply_effect({}) failed: {}", effect, e));
    }
    Ok(())
}

#[tauri::command]
fn set_window_dark_mode<R: Runtime>(window: tauri::WebviewWindow<R>, dark: bool) -> Result<(), String> {
    // Theme must not implicitly replace the selected wallpaper effect.
    window.set_theme(Some(if dark { tauri::Theme::Dark } else { tauri::Theme::Light })).map_err(|error| error.to_string())?;
    Ok(())
}

#[cfg(target_os = "windows")]
fn apply_effect<R: Runtime>(window: &tauri::WebviewWindow<R>, effect: &str, dark: Option<bool>) -> Result<(), String> {
    clear_acrylic(window).map_err(|e| e.to_string())?;
    clear_mica(window).map_err(|e| e.to_string())?;
    match effect {
        "acrylic" => apply_acrylic(window, Some((255, 255, 255, 0)))
            .map_err(|e| format!("{}", e)),
        "mica" => apply_mica(window, dark).map_err(|e| format!("{}", e)),
        "image" | "solid" => Ok(()),
        _ => Err("Unsupported wallpaper effect".into()),
    }
}

#[cfg(not(target_os = "windows"))]
fn apply_effect<R: Runtime>(_window: &tauri::WebviewWindow<R>, _effect: &str, _dark: Option<bool>) -> Result<(), String> {
    Ok(())
}

#[command]
async fn fetch_data_command(url: &str, proxy_url: Option<String>) -> Result<Value, String> {
    match fetch_data(url, proxy_url.as_deref()).await {
        Ok(data) => Ok(serde_json::Value::String(data)),
        Err(e) => Err(format!("Failed to fetch data: {}", e)),
    }
}

#[command]
async fn fetch_data_with_headers_command(
    url: &str,
    headers_json: &str,
    proxy_url: Option<String>,
) -> Result<Value, String> {
    let headers: HeaderMap = match serde_json::from_str(headers_json) {
        Ok(json) => {
            let mut headers = HeaderMap::new();
            if let Value::Object(map) = json {
                for (key, value) in map {
                    if let Some(value_str) = value.as_str() {
                        let header_name = key
                            .as_str()
                            .parse::<reqwest::header::HeaderName>()
                            .map_err(|e| format!("Invalid header name '{}': {}", key, e))?;
                        let header_value = value_str
                            .parse()
                            .map_err(|e| format!("Invalid header value for '{}': {}", key, e))?;
                        headers.insert(header_name, header_value);
                    }
                }
            }
            headers
        }
        Err(e) => return Err(format!("Invalid headers JSON: {}", e)),
    };

    match fetch_data_with_headers(url, headers, proxy_url.as_deref()).await {
        Ok(data) => Ok(serde_json::to_value(data).unwrap()),
        Err(e) => Err(format!("Failed to fetch data: {}", e)),
    }
}

#[command]
async fn fetch_data_buffer_base64(
    url: &str,
    buffer: Vec<u8>,
    proxy_url: Option<String>,
    file_name: &str,
) -> Result<String, String> {
    match fetch_data_buffer(url, buffer, file_name, proxy_url).await {
        Ok(data) => Ok(general_purpose::STANDARD.encode(&data)),
        Err(e) => Err(format!("Failed to fetch data: {}", e)),
    }
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
            fetch_data_command,
            test_connection,
            fetch_data_with_headers_command,
            read_file,
            read_file_bytes,
            copy_file_to_install_dir,
            write_file,
            fetch_data_with_cookie,
            fetch_data_post,
            fetch_data_buffer,
            fetch_data_buffer_base64,
            fetch_image_base64,
            open_login,
            get_cookies,
            get_cookie,
            set_cookie,
            delete_cookie,
            clear_cookies,
            get_baidu_auth_cookies,
            get_cookies_string
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
