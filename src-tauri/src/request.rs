use reqwest::{Error, Client, header::HeaderMap};
use serde::Serialize;
use std::collections::HashMap;
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