// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod cookie_manager;
mod file_io;
mod request;
use cookie_manager::{
    clear_cookies, delete_cookie, get_baidu_auth_cookies, get_cookie, get_cookies,
    get_cookies_string, set_cookie,
};
use file_io::{copy_file_to_install_dir, read_file, read_file_bytes, write_file};
use request::{
    fetch_data, fetch_data_buffer, fetch_data_post, fetch_data_with_cookie, fetch_data_with_headers,
};
use tauri::Manager;
#[cfg(target_os = "windows")]
use window_vibrancy::*;
// use api::{ get_user_info };
use base64::{engine::general_purpose, Engine as _};
use reqwest::header::HeaderMap;
use serde_json::Value;
use tauri::command;

// src-tauri/src/main.rs
use tauri::{AppHandle, Emitter, Runtime, WebviewUrl, WebviewWindowBuilder};
use url::Url;

#[tauri::command]
async fn open_login<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    // 创建登录窗口
    let url = Url::parse("https://passport.baidu.com/v2/?login&u=https%3A%2F%2Ftieba.baidu.com")
        .map_err(|e| format!("无效的URL: {}", e))?;

    let _window = WebviewWindowBuilder::new(&app, "login_window", WebviewUrl::External(url))
        .title("登录百度账号")
        .inner_size(800.0, 600.0)
        .center()
        .initialization_script(include_str!("login_bridge.js"))
        .build()
        .map_err(|e| format!("创建窗口失败: {}", e))?;

    tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;

    let urls = vec![
        "https://passport.baidu.com",
        "https://tieba.baidu.com",
        "https://www.baidu.com",
    ];

    for url in urls {
        let _ = clear_cookies(app.clone(), "login_window".to_string(), url.to_string()).await;
    }

    Ok(())
}

#[tauri::command]
async fn handle_browser_login<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    let auth_result = get_baidu_auth_cookies(app.clone(), "login_window".to_string()).await?;

    if let Some((bduss, stoken)) = auth_result {
        let cookie_data = serde_json::json!({
            "bduss": bduss,
            "stoken": stoken
        });

        if let Some(main_window) = app.get_webview_window("main") {
            main_window
                .emit("browser-login-cookies", cookie_data)
                .map_err(|e| format!("发送事件失败: {}", e))?;
        } else {
            return Err("无法找到主窗口".to_string());
        }

        if let Some(login_window) = app.get_webview_window("login_window") {
            tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;
            let _ = login_window.close();
        }

        Ok(())
    } else {
        Err("未找到有效的登录凭证".to_string())
    }
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
fn set_wallpaper_effect<R: Runtime>(window: tauri::WebviewWindow<R>, effect: &str) -> Result<(), String> {
    if let Err(e) = apply_effect(&window, effect) {
        return Err(format!("apply_effect({}) failed: {}", effect, e));
    }
    Ok(())
}

#[tauri::command]
fn set_window_dark_mode<R: Runtime>(window: tauri::WebviewWindow<R>, dark: bool) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    if let Err(e) = apply_mica(&window, Some(dark)) {
        return Err(format!("apply_mica(dark) failed: {}", e));
    }
    Ok(())
}

#[cfg(target_os = "windows")]
fn apply_effect<R: Runtime>(window: &tauri::WebviewWindow<R>, effect: &str) -> Result<(), String> {
    match effect {
        "acrylic" => apply_acrylic(window, Some((255, 255, 255, 0)))
            .map_err(|e| format!("{}", e)),
        "mica" => apply_mica(window, None).map_err(|e| format!("{}", e)),
        _ => Ok(()),
    }
}

#[cfg(not(target_os = "windows"))]
fn apply_effect<R: Runtime>(_window: &tauri::WebviewWindow<R>, _effect: &str) -> Result<(), String> {
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
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_clipboard_x::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            toggle_devtools,
            set_wallpaper_effect,
            set_window_dark_mode,
            fetch_data_command,
            fetch_data_with_headers_command,
            read_file,
            read_file_bytes,
            copy_file_to_install_dir,
            write_file,
            fetch_data_with_cookie,
            fetch_data_post,
            fetch_data_buffer,
            fetch_data_buffer_base64,
            open_login,
            handle_browser_login,
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
