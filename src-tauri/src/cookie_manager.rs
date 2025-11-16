use serde::{Deserialize, Serialize};
use tauri::{command, AppHandle, Manager, Runtime};

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

    #[cfg(target_os = "windows")]
    {
        use tokio::sync::oneshot;
        use webview2_com::{
            take_pwstr, GetCookiesCompletedHandler,
            Microsoft::Web::WebView2::Win32::ICoreWebView2_2,
        };
        use windows::core::{Interface, HSTRING, PWSTR};
        let (done_tx, done_rx) = oneshot::channel::<Result<Vec<CookieData>, String>>();
        let url_clone = url.clone();

        window
            .with_webview(move |webview| unsafe {
                let _ = (|| -> Result<(), String> {
                    let core = webview
                        .controller()
                        .CoreWebView2()
                        .map_err(|e| format!("Failed to get CoreWebView2: {:?}", e))?;

                    let core2 = Interface::cast::<ICoreWebView2_2>(&core)
                        .map_err(|e| format!("Failed to cast to ICoreWebView2_2: {:?}", e))?;
                    let uri = HSTRING::from(url_clone.as_str());
                    let manager = core2
                        .CookieManager()
                        .map_err(|e| format!("Failed to get CookieManager: {:?}", e))?;

                    GetCookiesCompletedHandler::wait_for_async_operation(
                        Box::new(move |handler| {
                            manager
                                .GetCookies(&uri, &handler)
                                .map_err(|e| webview2_com::Error::WindowsError(e))
                        }),
                        Box::new(move |hresult, list| {
                            if let Err(e) = hresult {
                                let _ = done_tx.send(Err(format!("GetCookies failed: {:?}", e)));
                                return Ok(());
                            }

                            match list {
                                Some(list) => {
                                    let mut count: u32 = 0;
                                    if let Err(e) = list.Count(&mut count) {
                                        let _ = done_tx.send(Err(format!("Count failed: {:?}", e)));
                                        return Ok(());
                                    }

                                    let mut cookies = Vec::new();
                                    for i in 0..count {
                                        match list.GetValueAtIndex(i) {
                                            Ok(cookie) => {
                                                let mut name = PWSTR::null();
                                                let mut value = PWSTR::null();

                                                if let Err(e) = cookie.Name(&mut name) {
                                                    let _ = done_tx
                                                        .send(Err(format!("Name failed: {:?}", e)));
                                                    return Ok(());
                                                }
                                                if let Err(e) = cookie.Value(&mut value) {
                                                    let _ = done_tx.send(Err(format!(
                                                        "Value failed: {:?}",
                                                        e
                                                    )));
                                                    return Ok(());
                                                }

                                                cookies.push(CookieData {
                                                    name: take_pwstr(name),
                                                    value: take_pwstr(value),
                                                });
                                            }
                                            Err(e) => {
                                                let _ = done_tx.send(Err(format!(
                                                    "GetValueAtIndex failed: {:?}",
                                                    e
                                                )));
                                                return Ok(());
                                            }
                                        }
                                    }

                                    let _ = done_tx.send(Ok(cookies));
                                }
                                None => {
                                    let _ = done_tx.send(Ok(Vec::new()));
                                }
                            }
                            Ok(())
                        }),
                    )
                    .map_err(|e| format!("wait_for_async_operation failed: {:?}", e))?;

                    Ok(())
                })();
            })
            .map_err(|e| format!("with_webview failed: {:?}", e))?;

        done_rx
            .await
            .map_err(|e| format!("Channel receive failed: {:?}", e))?
    }

    // Windows only
    #[cfg(not(target_os = "windows"))]
    {
        Err("Cookie access is only supported on Windows platform".to_string())
    }
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
