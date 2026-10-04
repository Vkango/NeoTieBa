use reqwest::header::{HeaderMap, HeaderValue, COOKIE, REFERER, USER_AGENT};
use reqwest::{Client, Proxy};
use serde::Serialize;
use std::collections::HashMap;
use std::sync::{Mutex, OnceLock};
use tauri::command;

#[derive(Serialize)]
pub struct ResponseData {
    pub text: String,
    pub headers: HashMap<String, String>,
}

fn build_client(proxy_url: Option<&str>) -> Result<Client, String> {
    static CLIENTS: OnceLock<Mutex<HashMap<Option<String>, Client>>> = OnceLock::new();
    let key = proxy_url
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned);
    let mut clients = CLIENTS
        .get_or_init(|| Mutex::new(HashMap::new()))
        .lock()
        .map_err(|_| "HTTP client cache lock poisoned".to_string())?;
    if let Some(client) = clients.get(&key) {
        return Ok(client.clone());
    }
    let mut builder = Client::builder().timeout(std::time::Duration::from_secs(30));

    if let Some(proxy_url) = key.as_deref() {
        let proxy = Proxy::all(proxy_url).map_err(|error| format!("Invalid proxy: {}", error))?;
        builder = builder.proxy(proxy);
    }

    let client = builder
        .build()
        .map_err(|error| format!("Failed to build HTTP client: {}", error))?;
    // Bound retained pools when users switch between many proxy configurations.
    if clients.len() >= 8 {
        clients.clear();
    }
    clients.insert(key, client.clone());
    Ok(client)
}

#[cfg(test)]
mod tests {
    use super::*;
    use tokio::io::{AsyncReadExt, AsyncWriteExt};
    use tokio::net::TcpListener;
    use tokio::time::{timeout, Duration};

    #[tokio::test]
    async fn form_posts_forward_headers_and_cookie_without_leaking_to_next_request() {
        timeout(Duration::from_secs(5), async {
            let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
            let proxy = format!("http://{}", listener.local_addr().unwrap());
            let server = tokio::spawn(async move {
                let (mut socket, _) = listener.accept().await.unwrap();
                let mut requests = Vec::new();
                for _ in 0..2 {
                    let mut header = Vec::new();
                    while !header.ends_with(b"\r\n\r\n") {
                        header.push(socket.read_u8().await.unwrap());
                    }
                    let header = String::from_utf8(header).unwrap().to_ascii_lowercase();
                    let length = header
                        .lines()
                        .find_map(|line| line.strip_prefix("content-length: "))
                        .unwrap()
                        .parse::<usize>()
                        .unwrap();
                    let mut body = vec![0; length];
                    socket.read_exact(&mut body).await.unwrap();
                    requests.push((header, body));
                    socket
                        .write_all(b"HTTP/1.1 200 OK\r\nContent-Length: 2\r\n\r\nOK")
                        .await
                        .unwrap();
                }
                requests
            });
            let headers = HashMap::from([(
                "Content-Type".to_string(),
                "application/x-www-form-urlencoded".to_string(),
            )]);
            assert_eq!(
                fetch_data_post(
                    "http://neotieba.invalid/",
                    "tid=123&sign=ABC".to_string(),
                    Some(proxy.clone()),
                    Some(headers),
                    Some("session=test".to_string())
                )
                .await
                .unwrap(),
                "OK"
            );
            assert_eq!(
                fetch_data_post(
                    "http://neotieba.invalid/",
                    "plain-body".to_string(),
                    Some(proxy),
                    None,
                    None
                )
                .await
                .unwrap(),
                "OK"
            );
            let requests = server.await.unwrap();
            assert!(requests[0]
                .0
                .contains("content-type: application/x-www-form-urlencoded\r\n"));
            assert!(requests[0].0.contains("cookie: session=test\r\n"));
            assert_eq!(requests[0].1, b"tid=123&sign=ABC");
            assert!(!requests[1].0.contains("cookie:"));
            assert!(!requests[1].0.contains("content-type:"));
            assert_eq!(requests[1].1, b"plain-body");
        })
        .await
        .expect("form requests did not complete on the shared connection");
    }

    #[tokio::test]
    async fn reuses_connection_without_retaining_cookie_headers() {
        timeout(Duration::from_secs(5), async {
            let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
            let proxy = format!("http://{}", listener.local_addr().unwrap());
            let server = tokio::spawn(async move {
                // Both requests must arrive on this single accepted connection.
                let (mut socket, _) = listener.accept().await.unwrap();
                let mut requests = Vec::new();
                for _ in 0..2 {
                    let mut request = Vec::new();
                    while !request.ends_with(b"\r\n\r\n") {
                        let byte = socket.read_u8().await.unwrap();
                        request.push(byte);
                    }
                    requests.push(String::from_utf8(request).unwrap().to_ascii_lowercase());
                    socket
                        .write_all(b"HTTP/1.1 200 OK\r\nContent-Length: 2\r\n\r\nOK")
                        .await
                        .unwrap();
                }
                requests
            });
            assert_eq!(
                fetch_data_with_cookie(
                    "http://neotieba.invalid/",
                    "session=test",
                    Some(proxy.clone())
                )
                .await
                .unwrap(),
                "OK"
            );
            assert_eq!(
                fetch_data("http://neotieba.invalid/", Some(&format!(" {proxy} ")))
                    .await
                    .unwrap(),
                "OK"
            );
            let requests = server.await.unwrap();
            assert!(requests[0].contains("cookie: session=test\r\n"));
            assert!(!requests[1].contains("cookie:"));
        })
        .await
        .expect("client did not reuse its connection");
    }
}

pub async fn fetch_data(url: &str, proxy_url: Option<&str>) -> Result<String, String> {
    let client = build_client(proxy_url)?;
    let response = client
        .get(url)
        .send()
        .await
        .map_err(|error| format!("Failed to send request: {}", error))?;

    response
        .text()
        .await
        .map_err(|error| format!("Failed to read response body: {}", error))
}

pub async fn fetch_image(url: &str, proxy_url: Option<&str>) -> Result<(String, Vec<u8>), String> {
    let client = build_client(proxy_url)?;
    let response = client
        .get(url)
        .header(USER_AGENT, "Mozilla/5.0 (NeoTieBa)")
        .header(REFERER, "https://tieba.baidu.com/")
        .send()
        .await
        .map_err(|error| format!("Failed to fetch image: {}", error))?
        .error_for_status()
        .map_err(|error| format!("Image request failed: {}", error))?;

    let mime = response
        .headers()
        .get(reqwest::header::CONTENT_TYPE)
        .and_then(|value| value.to_str().ok())
        .and_then(|value| value.split(';').next())
        .filter(|value| value.starts_with("image/"))
        .unwrap_or("image/jpeg")
        .to_string();
    let bytes = response
        .bytes()
        .await
        .map_err(|error| format!("Failed to read image: {}", error))?
        .to_vec();

    Ok((mime, bytes))
}

#[command]
pub async fn fetch_data_post(
    url: &str,
    body: String,
    proxy_url: Option<String>,
    headers: Option<HashMap<String, String>>,
    cookie: Option<String>,
) -> Result<String, String> {
    let client = build_client(proxy_url.as_deref())?;
    let mut request = client.post(url).body(body);
    if let Some(headers) = headers {
        for (name, value) in headers {
            let name = name
                .parse::<reqwest::header::HeaderName>()
                .map_err(|error| format!("Invalid header name: {}", error))?;
            let value = HeaderValue::from_str(&value)
                .map_err(|error| format!("Invalid header value: {}", error))?;
            request = request.header(name, value);
        }
    }
    if let Some(cookie) = cookie.filter(|value| !value.is_empty()) {
        request = request.header(COOKIE, cookie);
    }
    let response = request
        .send()
        .await
        .map_err(|error| format!("Failed to send post request: {}", error))?;

    response
        .text()
        .await
        .map_err(|error| format!("Failed to read response body: {}", error))
}

pub async fn fetch_data_with_headers(
    url: &str,
    headers: HeaderMap,
    proxy_url: Option<&str>,
) -> Result<ResponseData, String> {
    let client = build_client(proxy_url)?;
    let response = client
        .get(url)
        .headers(headers)
        .send()
        .await
        .map_err(|error| format!("Failed to send header request: {}", error))?;

    let headers = response
        .headers()
        .iter()
        .map(|(key, value)| (key.to_string(), value.to_str().unwrap_or("").to_string()))
        .collect();

    let text = response
        .text()
        .await
        .map_err(|error| format!("Failed to read response body: {}", error))?;

    Ok(ResponseData { text, headers })
}

#[command]
pub async fn fetch_data_with_cookie(
    url: &str,
    cookie: &str,
    proxy_url: Option<String>,
) -> Result<String, String> {
    let mut headers = HeaderMap::new();

    if !cookie.trim().is_empty() {
        headers.insert(
            COOKIE,
            HeaderValue::from_str(cookie).map_err(|error| format!("Invalid cookie: {}", error))?,
        );
    }

    let client = build_client(proxy_url.as_deref())?;
    let response = client
        .get(url)
        .headers(headers)
        .send()
        .await
        .map_err(|error| format!("Failed to send cookie request: {}", error))?;

    if !response.status().is_success() {
        return Err(format!("Request failed with status: {}", response.status()));
    }

    response
        .text()
        .await
        .map_err(|error| format!("Failed to read response body: {}", error))
}

// Connectivity and HTTP acceptance are separate: a 403 still proves reachability.
async fn probe_url(url: &str, proxy_url: Option<&str>) -> Result<u16, String> {
    let response = build_client(proxy_url)?
        .get(url)
        .header(USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
        .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
        .send().await.map_err(|error| format!("连接失败: {}", error))?;
    Ok(response.status().as_u16())
}

#[command]
pub async fn test_connection(proxy_url: Option<String>) -> Result<u16, String> {
    probe_url("https://tieba.baidu.com", proxy_url.as_deref()).await
}

#[cfg(test)]
mod connectivity_tests {
    use super::*;
    use tokio::io::{AsyncReadExt, AsyncWriteExt};
    #[tokio::test]
    async fn forbidden_is_reachable_and_probe_sends_browser_headers() {
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let address = listener.local_addr().unwrap();
        let server = tokio::spawn(async move {
            let (mut socket, _) = listener.accept().await.unwrap();
            let mut header = Vec::new();
            while !header.ends_with(b"\r\n\r\n") {
                header.push(socket.read_u8().await.unwrap());
            }
            let header = String::from_utf8(header).unwrap().to_ascii_lowercase();
            assert!(header.contains("user-agent: mozilla/5.0"));
            socket
                .write_all(
                    b"HTTP/1.1 403 Forbidden\r\nContent-Length: 0\r\nConnection: close\r\n\r\n",
                )
                .await
                .unwrap();
        });
        assert_eq!(
            probe_url(
                &format!("http://{address}/"),
                Some(&format!("http://{address}"))
            )
            .await
            .unwrap(),
            403
        );
        server.await.unwrap();
    }
}
