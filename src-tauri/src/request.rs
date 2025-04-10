use reqwest::header::{HeaderValue, CONTENT_TYPE};
use reqwest::{header::HeaderMap, header::COOKIE, Client, Error, Proxy};
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

#[command]

pub async fn fetch_data_buffer(
    url: &str,
    buffer: Vec<u8>,
    file_name: &str,
) -> Result<Vec<u8>, String> {
    let client_builder = Client::builder();

    // Fiddler Proxy
    // match Proxy::all("http://127.0.0.1:8888") {
    //     Ok(proxy) => {
    //         client_builder = client_builder.proxy(proxy);
    //     }
    //     Err(e) => {
    //         return Err(format!("Failed to set proxy: {}", e));
    //     }
    // }

    let client = client_builder.build().map_err(|e| e.to_string())?;

    let boundary = "*_r1999";
    let boundary_prefix = format!("---{}", boundary);
    let boundary_suffix = format!("---{}--", boundary);

    let mut body = Vec::new();
    body.extend_from_slice(format!("{}\r\n", boundary_prefix).as_bytes());
    body.extend_from_slice(
        format!(
            "Content-Disposition: form-data; name=\"data\"; filename=\"{}\"\r\n\r\n",
            file_name
        )
        .as_bytes(),
    );
    body.extend_from_slice(&buffer);
    body.extend_from_slice(format!("\r\n{}\r\n", boundary_suffix).as_bytes());

    let mut headers = HeaderMap::new();

    headers.insert("Host", HeaderValue::from_str("tiebac.baidu.com").unwrap());
    headers.insert("User-Agent", HeaderValue::from_str("neotieba").unwrap());
    headers.insert("x_bd_data_type", HeaderValue::from_str("protobuf").unwrap());
    // headers.insert("Accept-Encoding", HeaderValue::from_str("gzip").unwrap());
    headers.insert("Connection", HeaderValue::from_str("keep-alive").unwrap());
    headers.insert("Accept", HeaderValue::from_str("*/*").unwrap());

    headers.insert(
        CONTENT_TYPE,
        HeaderValue::from_str(&format!("multipart/form-data; boundary=-{}", boundary)).unwrap(),
    );
    // Host: tiebac.baidu.com
    // User-Agent: aiotieba/4.5.3
    // x_bd_data_type: protobuf
    // Accept-Encoding: gzip
    // Connection: keep-alive
    // Accept: */*
    // Content-Length: 119
    // Content-Type: multipart/form-data; boundary=-*_r1999

    // 发送 POST 请求
    match client.post(url).headers(headers).body(body).send().await {
        Ok(response) => {
            // 检查响应状态
            if response.status().is_success() {
                // 读取响应体为 Vec<u8>
                match response.bytes().await {
                    Ok(data) => Ok(data.to_vec()),
                    Err(e) => Err(format!("Failed to read response body: {}", e)),
                }
            } else {
                Err(format!("Request failed with status: {}", response.status()))
            }
        }
        Err(e) => Err(format!("Failed to send request: {}", e)),
    }
}
#[command]
pub async fn fetch_data_post(url: &str, body: String) -> Result<String, String> {
    let client = Client::new();
    let response = client
        .post(url)
        .body(body)
        .send()
        .await
        .map_err(|e| e.to_string())?;
    let text = response.text().await.map_err(|e| e.to_string())?;
    Ok(text)
}

pub async fn fetch_data_with_headers(url: &str, headers: HeaderMap) -> Result<ResponseData, Error> {
    let client = Client::new();
    let response = client.get(url).headers(headers).send().await?;
    let headers = response
        .headers()
        .iter()
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
    let response = client.get(url).send().await.map_err(|e| e.to_string())?;

    // 检查响应状态码
    if response.status().is_success() {
        // 获取响应文本
        let text = response.text().await.map_err(|e| e.to_string())?;
        Ok(text)
    } else {
        Err(format!(
            "Failed to fetch data. Status code: {}",
            response.status()
        ))
    }
}
