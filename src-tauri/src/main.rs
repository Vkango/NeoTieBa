// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod request;
use tauri::Manager;
use window_vibrancy::*;
use request::fetch_data;
use tauri::command;

#[command]
async fn fetch_data_command(url: &str) -> Result<String, String> {
    match fetch_data(url).await {
        Ok(data) => Ok(data),
        Err(e) => Err(format!("Failed to fetch data: {}", e)),
    }
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![fetch_data_command])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_mica(&window, None);
                

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}