// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod request;
mod read_file;
use tauri::Manager;
use window_vibrancy::*;
use request::{fetch_data, fetch_data_with_headers, fetch_data_with_cookie, fetch_data_post};
use read_file::read_file;
use tauri::command;
use reqwest::header::HeaderMap;
use serde_json::Value;
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
                        headers.insert(key.as_str().parse::<reqwest::header::HeaderName>().unwrap(), value_str.parse().unwrap());
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
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![fetch_data_command, fetch_data_with_headers_command, read_file, fetch_data_with_cookie, fetch_data_post])

        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            let _ = apply_mica(&window, Some(true));
                

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}