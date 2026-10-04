use reqwest::{Client, Proxy};
use std::time::Duration;
use thiserror::Error;

pub mod proto {
    pub mod thread_page { include!(concat!(env!("OUT_DIR"), "/proto/thread_page/_.rs")); }
    pub mod bar_page { include!(concat!(env!("OUT_DIR"), "/proto/bar_page/_.rs")); }
    pub mod floor { include!(concat!(env!("OUT_DIR"), "/proto/floor/_.rs")); }
    pub mod profile { include!(concat!(env!("OUT_DIR"), "/proto/profile/_.rs")); }
    pub mod user_post { include!(concat!(env!("OUT_DIR"), "/proto/user_post/_.rs")); }
}

#[derive(Debug, Error)]
pub enum TiebaError {
    #[error("invalid proxy: {0}")]
    InvalidProxy(String),
    #[error("request failed: {0}")]
    Request(#[from] reqwest::Error),
    #[error("server returned HTTP {0}")]
    Http(u16),
    #[error("response exceeded the {0} byte limit")]
    ResponseTooLarge(usize),
}

#[derive(Clone, Debug)]
pub struct TiebaClient {
    client: Client,
    max_response_bytes: usize,
}

impl TiebaClient {
    pub fn new(proxy_url: Option<&str>) -> Result<Self, TiebaError> {
        let mut builder = Client::builder().timeout(Duration::from_secs(30));
        if let Some(proxy) = proxy_url.filter(|value| !value.trim().is_empty()) {
            builder = builder.proxy(Proxy::all(proxy).map_err(|e| TiebaError::InvalidProxy(e.to_string()))?);
        }
        Ok(Self { client: builder.build()?, max_response_bytes: 32 * 1024 * 1024 })
    }

    pub fn with_max_response_bytes(mut self, limit: usize) -> Self {
        self.max_response_bytes = limit;
        self
    }

    pub async fn post_protobuf(&self, url: &str, payload: &[u8], file_name: &str, cookie: Option<&str>) -> Result<Vec<u8>, TiebaError> {
        let form = reqwest::multipart::Part::bytes(payload.to_vec()).file_name(file_name.to_owned());
        let mut request = self.client.post(url).header("x_bd_data_type", "protobuf")
            .multipart(reqwest::multipart::Form::new().part("data", form));
        if let Some(cookie) = cookie.filter(|value| !value.is_empty()) { request = request.header(reqwest::header::COOKIE, cookie); }
        let response = request.send().await?;
        let status = response.status();
        if !status.is_success() { return Err(TiebaError::Http(status.as_u16())); }
        let bytes = response.bytes().await?;
        if bytes.len() > self.max_response_bytes { return Err(TiebaError::ResponseTooLarge(self.max_response_bytes)); }
        Ok(bytes.to_vec())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn default_response_limit_is_bounded() {
        let client = TiebaClient::new(None).unwrap();
        assert_eq!(client.max_response_bytes, 32 * 1024 * 1024);
    }
}
