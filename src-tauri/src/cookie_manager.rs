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
        // Keep deleting the remaining cookies even when one delete fails;
        // clear_baidu_cookies verifies the result instead of trusting this.
        let mut last_error = None;
        for cookie in cookies {
            if let Err(e) = window.delete_cookie(cookie) {
                eprintln!("[login] delete_cookie failed: {}", e);
                last_error = Some(format!("Failed to delete cookie: {}", e));
            }
        }
        match last_error {
            Some(error) => Err(error),
            None => Ok(()),
        }
    })
    .await
    .map_err(|e| e.to_string())?
}

fn cookie_identity(cookie: &Cookie<'_>) -> String {
    format!(
        "{} @ domain='{}' path='{}'",
        cookie.name(),
        cookie.domain().unwrap_or(""),
        cookie.path().unwrap_or("/")
    )
}

fn log_cookies(label: &str, cookies: &[Cookie<'_>]) {
    eprintln!("[login] {}: {} cookie(s)", label, cookies.len());
    for cookie in cookies {
        // Never log cookie values: BDUSS/STOKEN are credentials.
        eprintln!(
            "[login]   {} value_len={}",
            cookie_identity(cookie),
            cookie.value().len()
        );
    }
}

/// WebView2 may return the domain with or without a leading dot; cover both
/// spellings when overwriting, since cookie identity matching is exact.
fn domain_variants(domain: &str) -> Vec<String> {
    let flipped = match domain.strip_prefix('.') {
        Some(stripped) if !stripped.is_empty() => stripped.to_string(),
        Some(_) => return vec![domain.to_string()],
        None => format!(".{}", domain),
    };
    vec![domain.to_string(), flipped]
}

/// Build an expired cookie with the same identity so `AddOrUpdateCookie`
/// evicts the stored one even when `DeleteCookie` fails to match. The `cookie`
/// crate strips a leading dot from the domain, so identical effective
/// identities are de-duplicated here.
fn expired_twin(cookie: &Cookie<'_>) -> Vec<Cookie<'static>> {
    let mut twins: Vec<Cookie<'static>> = Vec::new();
    for domain in domain_variants(cookie.domain().unwrap_or_default()) {
        let twin = Cookie::build((cookie.name().to_string(), cookie.value().to_string()))
            .domain(domain)
            .path(cookie.path().unwrap_or("/").to_string())
            .http_only(cookie.http_only().unwrap_or(false))
            .secure(cookie.secure().unwrap_or(false))
            .expires(tauri::webview::cookie::time::OffsetDateTime::UNIX_EPOCH)
            .build();
        if !twins
            .iter()
            .any(|existing| existing.domain() == twin.domain())
        {
            twins.push(twin);
        }
    }
    twins
}

async fn expire_cookies<R: Runtime>(
    window: WebviewWindow<R>,
    cookies: Vec<Cookie<'static>>,
) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        let mut last_error = None;
        for cookie in &cookies {
            for twin in expired_twin(cookie) {
                if let Err(e) = window.set_cookie(twin) {
                    eprintln!(
                        "[login] expire-overwrite of {} failed: {}",
                        cookie_identity(cookie),
                        e
                    );
                    last_error = Some(format!("Failed to expire cookie: {}", e));
                }
            }
        }
        match last_error {
            Some(error) => Err(error),
            None => Ok(()),
        }
    })
    .await
    .map_err(|e| e.to_string())?
}

/// Best-effort removal of every Baidu cookie from the shared webview jar.
/// Some webviews (e.g. WebView2 through wry) cannot match stored cookies for
/// deletion, so this can silently fail; callers must never rely on it.
/// Browser login is confirmed manually, which keeps leftovers harmless.
pub async fn clear_baidu_cookies<R: Runtime>(window: WebviewWindow<R>) -> Result<(), String> {
    let cookies = read_native_cookies(window.clone()).await?;
    let targets: Vec<Cookie<'static>> = cookies.into_iter().filter(is_baidu_cookie).collect();
    log_cookies("clearing baidu cookies", &targets);

    if targets.is_empty() {
        return Ok(());
    }
    if let Err(error) = remove_cookies(window.clone(), targets.clone()).await {
        eprintln!("[login] cookie cleanup: {}", error);
    }
    if let Err(error) = expire_cookies(window.clone(), targets).await {
        eprintln!("[login] cookie cleanup: {}", error);
    }

    let remaining = read_native_cookies(window.clone()).await?;
    let leftover: Vec<String> = remaining
        .iter()
        .filter(|cookie| is_baidu_cookie(cookie))
        .map(cookie_identity)
        .collect();
    if leftover.is_empty() {
        eprintln!("[login] cookie cleanup: baidu jar is clean");
    } else {
        eprintln!(
            "[login] cookie cleanup left {} cookie(s) behind: {:?}",
            leftover.len(),
            leftover
        );
    }
    Ok(())
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

    #[test]
    fn domain_variants_cover_both_dot_spellings() {
        assert_eq!(
            domain_variants("baidu.com"),
            vec!["baidu.com".to_string(), ".baidu.com".to_string()]
        );
        assert_eq!(
            domain_variants(".baidu.com"),
            vec![".baidu.com".to_string(), "baidu.com".to_string()]
        );
        assert_eq!(domain_variants("."), vec![".".to_string()]);
    }

    #[test]
    fn expired_twin_keeps_identity_and_is_expired() {
        let mut source = auth_cookie("BDUSS", "session", "tieba.baidu.com");
        source.set_path("/w");
        let twins = expired_twin(&source);
        // The cookie crate strips the leading dot, so both domain spellings
        // collapse into one effective identity.
        assert_eq!(twins.len(), 1);
        let twin = &twins[0];
        assert_eq!(twin.name(), "BDUSS");
        assert_eq!(twin.value(), "session");
        assert_eq!(twin.path(), Some("/w"));
        assert!(twin.http_only().unwrap_or(false));
        assert!(twin.secure().unwrap_or(false));
        assert!(
            twin.expires_datetime().is_some_and(
                |expiry| expiry < tauri::webview::cookie::time::OffsetDateTime::now_utc()
            )
        );
    }
}
