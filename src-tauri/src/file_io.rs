use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;
use tauri::command;

#[command]
pub fn read_file(relative_path: &str) -> Result<String, tauri::Error> {
    let path = Path::new(relative_path);
    let mut file = File::open(&path).map_err(|e| tauri::Error::from(e))?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .map_err(|e| tauri::Error::from(e))?;
    Ok(contents)
}

#[command]
pub fn write_file(relative_path: &str, content: &str) -> Result<(), tauri::Error> {
    let path = Path::new(relative_path);

    // 确保目标目录存在
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent).map_err(|e| tauri::Error::from(e))?;
    }

    // 打开文件（如果不存在则创建）并写入内容
    let mut file = File::create(path).map_err(|e| tauri::Error::from(e))?;
    file.write_all(content.as_bytes())
        .map_err(|e| tauri::Error::from(e))?;

    Ok(())
}
