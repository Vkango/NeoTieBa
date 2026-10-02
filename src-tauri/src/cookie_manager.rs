use serde::{Deserialize, Serialize};
use tauri::{command, AppHandle, Manager, Runtime};
use tauri::{webview::Cookie, WebviewWindow};
use url::Url;

async fn read_native_cookies<R: Runtime>(
    window: WebviewWindow<R>,
) -> Result<Vec<Cookie<'static>>, String> {
    tauri::async_runtime::spawn_blocking(move || window.cookies().map_err(|e| e.to_string()))
        .await
        .map_err(|e| e.to_string())?
}

fn is_baidu_cookie(cookie: &Cookie<'_>) -> bool {
    cookie.domain().is_some_and(|domain| {
        domain.eq_ignore_ascii_case("baidu.com")
            || domain.to_ascii_lowercase().ends_with(".baidu.com")
    })
}

// This selects credentials for Tieba, not a general replacement for a browser's
// URL cookie matching. Prefer Tieba's root cookie over the parent-domain cookie.
fn select_auth(cookies: &[Cookie<'_>]) -> Option<(String, String)> {
    let select = |name: &str| {
        cookies
            .iter()
            .filter(|cookie| {
                cookie.name() == name
                    && !cookie.value().is_empty()
                    && cookie.path().unwrap_or("/") == "/"
                    && cookie.expires_datetime().is_none_or(|expiry| {
                        expiry > tauri::webview::cookie::time::OffsetDateTime::now_utc()
                    })
            })
            .filter_map(|cookie| {
                let priority = match cookie.domain()?.to_ascii_lowercase().as_str() {
                    "tieba.baidu.com" => 2,
                    "baidu.com" => 1,
                    _ => return None,
                };
                Some((priority, cookie.value()))
            })
            .max_by_key(|(priority, _)| *priority)
            .map(|(_, value)| value.to_string())
    };
    Some((select("BDUSS")?, select("STOKEN")?))
}

pub async fn read_baidu_auth<R: Runtime>(
    window: WebviewWindow<R>,
) -> Result<Option<(String, String)>, String> {
    Ok(select_auth(&read_native_cookies(window).await?))
}

async fn remove_cookies<R: Runtime>(
    window: WebviewWindow<R>,
    cookies: Vec<Cookie<'static>>,
) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        for cookie in cookies {
            window
                .delete_cookie(cookie)
                .map_err(|e| format!("Failed to delete cookie: {}", e))?;
        }
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

pub async fn clear_baidu_cookies<R: Runtime>(window: WebviewWindow<R>) -> Result<(), String> {
    let cookies = read_native_cookies(window.clone()).await?;
    remove_cookies(
        window,
        cookies.into_iter().filter(is_baidu_cookie).collect(),
    )
    .await
}

fn domain_matches(cookie: &Cookie<'_>, host: &str) -> bool {
    cookie.domain().is_some_and(|domain| {
        host.eq_ignore_ascii_case(domain)
            || host
                .to_ascii_lowercase()
                .ends_with(&format!(".{}", domain.to_ascii_lowercase()))
    })
}

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

    let cookies = tauri::async_runtime::spawn_blocking(move || {
        window
            .cookies_for_url(url_obj)
            .map_err(|e| format!("Failed to get cookies: {}", e))
    })
    .await
    .map_err(|e| e.to_string())??;

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

    let cookie = Cookie::build((cookie.name, cookie.value))
        .domain(".baidu.com")
        .path("/")
        .secure(true)
        .build();
    tauri::async_runtime::spawn_blocking(move || {
        window
            .set_cookie(cookie)
            .map_err(|e| format!("Failed to set cookie: {}", e))
    })
    .await
    .map_err(|e| e.to_string())?
}

/// 删除 cookie
#[command]
pub async fn delete_cookie<R: Runtime>(
    app: AppHandle<R>,
    window_label: String,
    url: String,
    name: String,
) -> Result<(), String> {
    let window = app
        .get_webview_window(&window_label)
        .ok_or_else(|| format!("Window '{}' not found", window_label))?;

    let url = Url::parse(&url).map_err(|e| e.to_string())?;
    let host = url.host_str().ok_or("URL has no host")?;
    let cookies = read_native_cookies(window.clone()).await?;
    remove_cookies(
        window,
        cookies
            .into_iter()
            .filter(|cookie| cookie.name() == name && domain_matches(cookie, host))
            .collect(),
    )
    .await
}

/// 删除所有 cookies
#[command]
pub async fn clear_cookies<R: Runtime>(
    app: AppHandle<R>,
    window_label: String,
    url: String,
) -> Result<(), String> {
    let window = app
        .get_webview_window(&window_label)
        .ok_or_else(|| format!("Window '{}' not found", window_label))?;
    let url = Url::parse(&url).map_err(|e| e.to_string())?;
    let host = url.host_str().ok_or("URL has no host")?;
    let cookies = read_native_cookies(window.clone()).await?;
    remove_cookies(
        window,
        cookies
            .into_iter()
            .filter(|cookie| domain_matches(cookie, host))
            .collect(),
    )
    .await
}

/// 获取 HttpOnly cookies
#[command]
pub async fn get_baidu_auth_cookies<R: Runtime>(
    app: AppHandle<R>,
    window_label: String,
) -> Result<Option<(String, String)>, String> {
    let window = app
        .get_webview_window(&window_label)
        .ok_or_else(|| format!("Window '{}' not found", window_label))?;
    read_baidu_auth(window).await
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

#[cfg(test)]
mod tests {
    use super::*;

    fn auth_cookie(name: &str, value: &str, domain: &str) -> Cookie<'static> {
        Cookie::build((name.to_string(), value.to_string()))
            .domain(domain.to_string())
            .path("/")
            .http_only(true)
            .secure(true)
            .build()
    }

    #[test]
    fn reads_parent_domain_http_only_credentials() {
        let cookies = vec![
            auth_cookie("BDUSS", "session", ".baidu.com"),
            auth_cookie("STOKEN", "token", ".baidu.com"),
        ];
        assert_eq!(
            select_auth(&cookies),
            Some(("session".into(), "token".into()))
        );
    }

    #[test]
    fn prefers_tieba_credentials_and_ignores_wrong_scopes() {
        let mut wrong_path = auth_cookie("STOKEN", "wrong-path", "tieba.baidu.com");
        wrong_path.set_path("/other");
        let cookies = vec![
            auth_cookie("BDUSS", "parent", ".baidu.com"),
            auth_cookie("BDUSS", "tieba", "tieba.baidu.com"),
            auth_cookie("STOKEN", "token", ".baidu.com"),
            wrong_path,
            auth_cookie("BDUSS", "passport", "passport.baidu.com"),
            auth_cookie("STOKEN", "unrelated", "evilbaidu.com"),
        ];
        assert_eq!(
            select_auth(&cookies),
            Some(("tieba".into(), "token".into()))
        );
    }

    #[test]
    fn rejects_missing_empty_and_expired_credentials() {
        let mut bduss = auth_cookie("BDUSS", "session", ".baidu.com");
        let empty = auth_cookie("STOKEN", "", ".baidu.com");
        assert_eq!(select_auth(&[bduss.clone(), empty]), None);
        bduss.set_expires(tauri::webview::cookie::time::OffsetDateTime::UNIX_EPOCH);
        assert_eq!(
            select_auth(&[bduss, auth_cookie("STOKEN", "token", ".baidu.com")]),
            None
        );
    }

    #[test]
    fn cleanup_respects_domain_boundaries_and_keeps_cookie_identity() {
        assert!(is_baidu_cookie(&auth_cookie(
            "BDUSS",
            "session",
            ".baidu.com"
        )));
        assert!(is_baidu_cookie(&auth_cookie(
            "BDUSS",
            "session",
            "passport.baidu.com"
        )));
        assert!(!is_baidu_cookie(&auth_cookie(
            "BDUSS",
            "session",
            "evilbaidu.com"
        )));
        assert!(!is_baidu_cookie(&auth_cookie(
            "BDUSS",
            "session",
            "baidu.com.evil.test"
        )));
        assert!(domain_matches(
            &auth_cookie("BDUSS", "session", ".baidu.com"),
            "tieba.baidu.com"
        ));
        assert!(!domain_matches(
            &auth_cookie("BDUSS", "session", ".baidu.com"),
            "evilbaidu.com"
        ));
    }
}
