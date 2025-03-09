use std::fs::File;
use std::io::Read;
use std::path::Path;
use tauri::command;

#[command]
pub fn read_file(relative_path: &str) -> Result<String, tauri::Error> {
    let path = Path::new(relative_path);
    let mut file = File::open(&path).map_err(|e| tauri::Error::from(e))?;
    let mut contents = String::new();
    file.read_to_string(&mut contents).map_err(|e| tauri::Error::from(e))?;
    Ok(contents)
}