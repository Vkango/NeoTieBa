use serde::{Deserialize, Serialize};
use tauri::{command, AppHandle, Manager, Runtime};
use url::Url;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CookieData {
    pub name: String,
    pub value: String,
}

#[command]
pub async fn get_cookies<R: Runtime>(
    app: AppHandle<R>,
    window_label: String,
    url: String,
) -> Result<Vec<CookieData>, String> {
    let window = app
        .get_webview_window(&window_label)
        .ok_or_else(|| format!("Window '{}' not found", window_label))?;

    let url_obj = Url::parse(&url).map_err(|e| format!("Invalid URL: {}", e))?;

    let cookies = window
        .cookies_for_url(url_obj)
        .map_err(|e| format!("Failed to get cookies: {}", e))?;

    Ok(cookies
        .into_iter()
        .map(|c| CookieData {
            name: c.name().to_string(),
            value: c.value().to_string(),
        })
        .collect())
}

/// 获取特定 cookie
#[command]
pub async fn get_cookie<R: Runtime>(
    app: AppHandle<R>,
    window_label: String,
    url: String,
    name: String,
) -> Result<Option<CookieData>, String> {
    let cookies = get_cookies(app, window_label, url).await?;
    Ok(cookies.into_iter().find(|c| c.name == name))
}
/// 设置 cookie
#[command]
pub async fn set_cookie<R: Runtime>(
    app: AppHandle<R>,
    window_label: String,
    cookie: CookieData,
) -> Result<(), String> {
    let window = app
        .get_webview_window(&window_label)
        .ok_or_else(|| format!("Window '{}' not found", window_label))?;

    let script = format!(
        "document.cookie = '{}={}; path=/; domain=.baidu.com';",
        cookie.name, cookie.value
    );

    window
        .eval(&script)
        .map_err(|e| format!("Failed to set cookie: {}", e))?;

    Ok(())
}

/// 删除 cookie
#[command]
pub async fn delete_cookie<R: Runtime>(
    app: AppHandle<R>,
    window_label: String,
    _url: String,
    name: String,
) -> Result<(), String> {
    let window = app
        .get_webview_window(&window_label)
        .ok_or_else(|| format!("Window '{}' not found", window_label))?;

    let script = format!(
        "document.cookie = '{}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.baidu.com';",
        name
    );

    window
        .eval(&script)
        .map_err(|e| format!("Failed to delete cookie: {}", e))?;

    Ok(())
}

/// 删除所有 cookies
#[command]
pub async fn clear_cookies<R: Runtime>(
    app: AppHandle<R>,
    window_label: String,
    url: String,
) -> Result<(), String> {
    let cookies = get_cookies(app.clone(), window_label.clone(), url.clone()).await?;

    for cookie in cookies {
        let _ = delete_cookie(app.clone(), window_label.clone(), url.clone(), cookie.name).await;
    }

    Ok(())
}

/// 获取 HttpOnly cookies
#[command]
pub async fn get_baidu_auth_cookies<R: Runtime>(
    app: AppHandle<R>,
    window_label: String,
) -> Result<Option<(String, String)>, String> {
    let url = "https://tieba.baidu.com".to_string();
    let cookies = get_cookies(app, window_label, url).await?;

    let bduss = cookies
        .iter()
        .find(|c| c.name == "BDUSS")
        .map(|c| c.value.clone());
    let stoken = cookies
        .iter()
        .find(|c| c.name == "STOKEN")
        .map(|c| c.value.clone());

    match (bduss, stoken) {
        (Some(bduss), Some(stoken)) => Ok(Some((bduss, stoken))),
        _ => Ok(None),
    }
}

#[command]
pub async fn get_cookies_string<R: Runtime>(
    app: AppHandle<R>,
    window_label: String,
    url: String,
) -> Result<String, String> {
    let cookies = get_cookies(app, window_label, url).await?;
    let cookie_str = cookies
        .iter()
        .map(|c| format!("{}={}", c.name, c.value))
        .collect::<Vec<_>>()
        .join("; ");
    Ok(cookie_str)
}
