use reqwest::{Error, Client, header::HeaderMap, header::COOKIE};
use serde::Serialize;
use std::collections::HashMap;
use tauri::command;
#[derive(Serialize)]
pub struct ResponseData {
    pub text: String,
    pub headers: HashMap<String, String>,
}

pub async fn fetch_data(url: &str) -> Result<String, Error> {
    let response = reqwest::get(url).await?;
    let text = response.text().await?;
    Ok(text)
}

pub async fn fetch_data_with_headers(url: &str, headers: HeaderMap) -> Result<ResponseData, Error> {
    let client = Client::new();
    let response = client.get(url).headers(headers).send().await?;
    let headers = response.headers().iter()
        .map(|(k, v)| (k.to_string(), v.to_str().unwrap_or("").to_string()))
        .collect();
    let text = response.text().await?;
    Ok(ResponseData { text, headers })
}
#[command]
pub async fn fetch_data_with_cookie(url: &str, cookie: &str) -> Result<String, String> {
    // 创建 HeaderMap 并插入 BDUSS Cookie
    let mut headers = HeaderMap::new();
    let cookie_value = cookie;
    headers.insert(COOKIE, cookie_value.parse().unwrap());

    // 创建 reqwest 客户端并设置代理
    let client = reqwest::Client::builder()
        .default_headers(headers)
        // .proxy(reqwest::Proxy::all("http://127.0.0.1:8888").map_err(|e| e.to_string())?)
        .build()
        .map_err(|e| e.to_string())?;

    // 发送 GET 请求
    let response = client.get(url)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    // 检查响应状态码
    if response.status().is_success() {
        // 获取响应文本
        let text = response.text().await.map_err(|e| e.to_string())?;
        Ok(text)
    } else {
        Err(format!("Failed to fetch data. Status code: {}", response.status()))
    }
}