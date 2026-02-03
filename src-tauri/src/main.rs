// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod cookie_manager;
mod file_io;
mod request;
use cookie_manager::{
    clear_cookies, delete_cookie, get_baidu_auth_cookies, get_cookie, get_cookies,
    get_cookies_string, set_cookie,
};
use file_io::{read_file, write_file};
use request::{
    fetch_data, fetch_data_buffer, fetch_data_post, fetch_data_with_cookie, fetch_data_with_headers,
};
use tauri::Manager;
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

#[command]
async fn fetch_data_command(url: &str) -> Result<Value, String> {
    match fetch_data(url).await {
        Ok(data) => Ok(serde_json::Value::String(data)),
        Err(e) => Err(format!("Failed to fetch data: {}", e)),
    }
}

#[command]
async fn fetch_data_with_headers_command(url: &str, headers_json: &str) -> Result<Value, String> {
    let headers: HeaderMap = match serde_json::from_str(headers_json) {
        Ok(json) => {
            let mut headers = HeaderMap::new();
            if let Value::Object(map) = json {
                for (key, value) in map {
                    if let Some(value_str) = value.as_str() {
                        headers.insert(
                            key.as_str().parse::<reqwest::header::HeaderName>().unwrap(),
                            value_str.parse().unwrap(),
                        );
                    }
                }
            }
            headers
        }
        Err(e) => return Err(format!("Invalid headers JSON: {}", e)),
    };

    match fetch_data_with_headers(url, headers).await {
        Ok(data) => Ok(serde_json::to_value(data).unwrap()),
        Err(e) => Err(format!("Failed to fetch data: {}", e)),
    }
}

#[command]
async fn fetch_data_buffer_base64(
    url: &str,
    buffer: Vec<u8>,
    proxy_url: Option<&str>,
    file_name: &str,
) -> Result<String, String> {
    match fetch_data_buffer(url, buffer, file_name).await {
        Ok(data) => Ok(general_purpose::STANDARD.encode(&data)),
        Err(e) => Err(format!("Failed to fetch data: {}", e)),
    }
}
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![
            fetch_data_command,
            fetch_data_with_headers_command,
            read_file,
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
            // let _ = apply_mica(&window, Some(true));
            apply_acrylic(&window, Some((255, 255, 255, 0)))
                .expect("Unsupported platform! 'apply_acrylic' is only supported on Windows");
            window.open_devtools();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
