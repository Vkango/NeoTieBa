use prost::Message;
use serde::de::DeserializeOwned;
use serde_json::Value;
use std::thread;
use tieba_api::proto::{bar_page, floor, profile, thread_page, user_post};
use tieba_api::TiebaClient;

fn snake(value: Value) -> Value {
    match value {
        Value::Object(map) => Value::Object(
            map.into_iter()
                .map(|(key, value)| {
                    let mut out = String::new();
                    for ch in key.chars() {
                        if ch.is_uppercase() {
                            out.push('_');
                        }
                        out.extend(ch.to_lowercase());
                    }
                    let out = out.trim_start_matches('_').to_string();
                    (out, snake(value))
                })
                .collect(),
        ),
        Value::Array(items) => Value::Array(items.into_iter().map(snake).collect()),
        Value::String(text) => {
            if let Ok(value) = text.parse::<i64>() {
                Value::Number(value.into())
            } else if let Ok(value) = text.parse::<u64>() {
                Value::Number(value.into())
            } else {
                Value::String(text)
            }
        }
        other => other,
    }
}

fn inject_auth(mut request: Value, bduss: Option<&str>, stoken: Option<&str>) -> Value {
    if let Value::Object(root) = &mut request {
        if let Some(Value::Object(data)) = root.get_mut("data") {
            let common = data
                .entry("common".to_string())
                .or_insert_with(|| Value::Object(Default::default()));
            if let Value::Object(common) = common {
                if let Some(value) = bduss.filter(|v| !v.is_empty()) {
                    common.insert("bduss".into(), Value::String(value.into()));
                }
                if let Some(value) = stoken.filter(|v| !v.is_empty()) {
                    common.insert("stoken".into(), Value::String(value.into()));
                }
            }
        }
    }
    request
}

fn decode<T: DeserializeOwned>(
    request: Value,
    bduss: Option<&str>,
    stoken: Option<&str>,
) -> Result<T, String> {
    let mut request = request;
    if let Value::Object(root) = &mut request {
        if let Some(Value::Object(data)) = root.get_mut("data") {
            if let Some(Value::Object(common)) = data.get_mut("common") {
                if let Some(value) = common.remove("BDUSS") {
                    common.insert("bduss".into(), value);
                }
                if let Some(value) = common.remove("b_d_u_s_s") {
                    common.insert("bduss".into(), value);
                }
            }
        }
    }
    request = inject_auth(request, bduss, stoken);
    serde_json::from_value(snake(request)).map_err(|e| format!("invalid protobuf request: {e}"))
}

fn bounded_decode_json<T: Message + serde::Serialize + Default + Send + 'static>(
    bytes: Vec<u8>,
) -> Result<Value, String> {
    let handle = thread::Builder::new()
        .stack_size(64 * 1024 * 1024)
        .spawn(move || {
            let value = T::decode(bytes.as_slice())
                .map_err(|e| format!("failed to decode protobuf response: {e}"))?;
            serde_json::to_value(value)
                .map_err(|e| format!("failed to serialize protobuf response: {e}"))
        })
        .map_err(|e| format!("failed to start serializer: {e}"))?;
    handle
        .join()
        .map_err(|_| "protobuf response exceeded serialization depth".to_string())?
}

#[tauri::command]
pub async fn protobuf_call(
    endpoint: String,
    request: Value,
    proxy_url: Option<String>,
    bduss: Option<String>,
    stoken: Option<String>,
) -> Result<Value, String> {
    let client = TiebaClient::new(proxy_url.as_deref()).map_err(|e| e.to_string())?;
    macro_rules! call {
        ($req:ty, $res:ty, $url:expr) => {{
            let value: $req = decode(request, bduss.as_deref(), stoken.as_deref())?;
            let cookie = match (
                bduss.as_deref().filter(|v| !v.is_empty()),
                stoken.as_deref().filter(|v| !v.is_empty()),
            ) {
                (Some(b), Some(s)) => Some(format!("BDUSS={b}; STOKEN={s};")),
                (Some(b), None) => Some(format!("BDUSS={b};")),
                (None, Some(s)) => Some(format!("STOKEN={s};")),
                _ => None,
            };
            let bytes = client
                .post_protobuf($url, &value.encode_to_vec(), "file", cookie.as_deref())
                .await
                .map_err(|e| e.to_string())?;
            if bytes.len() > 32 * 1024 * 1024 {
                return Err("protobuf response is larger than 32 MiB".into());
            }
            return bounded_decode_json::<$res>(bytes);
        }};
    }
    match endpoint.as_str() {
        "threadPage" => call!(
            thread_page::PbPageReqIdl,
            thread_page::PbPageResIdl,
            "http://tiebac.baidu.com/c/f/pb/page?cmd=302001"
        ),
        "barPage" => call!(
            bar_page::FrsPageReqIdl,
            bar_page::FrsPageResIdl,
            "http://tiebac.baidu.com/c/f/frs/page?cmd=301001"
        ),
        "floor" => call!(
            floor::PbFloorReqIdl,
            floor::PbFloorResIdl,
            "https://tiebac.baidu.com/c/f/pb/floor?cmd=302002"
        ),
        "userProfile" => call!(
            profile::ProfileReqIdl,
            profile::ProfileResIdl,
            "http://tiebac.baidu.com/c/u/user/profile?cmd=303012"
        ),
        "userPosts" => call!(
            user_post::UserPostReqIdl,
            user_post::UserPostResIdl,
            "https://tiebac.baidu.com/c/u/feed/userpost?cmd=303002"
        ),
        _ => Err(format!("unknown protobuf endpoint: {endpoint}")),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tieba_api::proto::bar_page::FrsPageReqIdl;

    #[test]
    fn view_bar_threads_request_matches_frontend_shape() {
        let request = serde_json::json!({
            "data": { "common": { "_clientType": 2, "_clientVersion": "12.64.1.1" },
                "kw": "rust", "pn": 1, "rn": 50, "rnNeed": 55, "isGood": 0, "sortType": 6 }
        });
        let value: FrsPageReqIdl = decode(request, None, None).unwrap();
        let bytes = value.encode_to_vec();
        assert!(!bytes.is_empty());
    }

    #[test]
    fn auth_is_normalized_and_injected_into_common() {
        for key in ["BDUSS", "bduss", "b_d_u_s_s"] {
            let request = serde_json::json!({
                "data": { "common": { key: "body-value", "_clientType": 2, "_clientVersion": "12.64.1.1" },
                    "kw": "rust", "pn": 1, "rn": 50, "rnNeed": 55, "isGood": 0, "sortType": 6 }
            });
            let value: FrsPageReqIdl = decode(request, Some("injected"), Some("token")).unwrap();
            let common = value.data.unwrap().common.unwrap();
            assert_eq!(common.bduss, "injected");
            assert_eq!(common.stoken, "token");
        }
    }
}
