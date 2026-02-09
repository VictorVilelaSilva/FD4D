use axum::{
    extract::{Json, State},
    http::{HeaderMap, StatusCode},
    routing::{get, post},
    Router,
};
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tower_http::cors::CorsLayer;

#[derive(Clone, Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct WebhookRequest {
    id: String,
    timestamp: String,
    method: String,
    path: String,
    headers: HashMap<String, String>,
    body: String,
    status_code: u16,
    error_reason: Option<String>,
}

#[derive(Clone)]
struct WebhookState {
    requests: Arc<Mutex<Vec<WebhookRequest>>>,
    auth_method: Arc<Mutex<String>>,
    auth_value: Arc<Mutex<String>>,
}

static WEBHOOK_STATE: Lazy<WebhookState> = Lazy::new(|| WebhookState {
    requests: Arc::new(Mutex::new(Vec::new())),
    auth_method: Arc::new(Mutex::new(String::new())),
    auth_value: Arc::new(Mutex::new(String::new())),
});

type ServerHandle = tokio::task::JoinHandle<()>;
static SERVER_HANDLE: Lazy<Arc<Mutex<Option<ServerHandle>>>> =
    Lazy::new(|| Arc::new(Mutex::new(None)));

async fn handle_webhook(
    State(state): State<WebhookState>,
    headers: HeaderMap,
    body: String,
) -> (StatusCode, Json<serde_json::Value>) {
    let auth_method = state.auth_method.lock().unwrap().clone();
    let auth_value = state.auth_value.lock().unwrap().clone();

    let mut status_code = 200;
    let mut error_reason: Option<String> = None;

    if !auth_method.is_empty() && !auth_value.is_empty() {
        let auth_valid = match auth_method.as_str() {
            "bearer" => {
                if let Some(auth_header) = headers.get("authorization") {
                    if let Ok(value) = auth_header.to_str() {
                        value == format!("Bearer {}", auth_value) || value == auth_value
                    } else {
                        false
                    }
                } else {
                    false
                }
            }
            "api-key" => {
                if let Some(api_key) = headers.get("x-api-key") {
                    if let Ok(value) = api_key.to_str() {
                        value == auth_value
                    } else {
                        false
                    }
                } else {
                    false
                }
            }
            "basic" => {
                if let Some(auth_header) = headers.get("authorization") {
                    if let Ok(value) = auth_header.to_str() {
                        value == format!("Basic {}", auth_value) || value == auth_value
                    } else {
                        false
                    }
                } else {
                    false
                }
            }
            _ => true,
        };

        if !auth_valid {
            status_code = 401;
            error_reason = Some("Authentication failed: Invalid credentials".to_string());
        }
    }

    let headers_map: HashMap<String, String> = headers
        .iter()
        .map(|(k, v)| (k.to_string(), v.to_str().unwrap_or("").to_string()))
        .collect();

    let request = WebhookRequest {
        id: uuid::Uuid::new_v4().to_string(),
        timestamp: chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string(),
        method: "POST".to_string(),
        path: "/webhook".to_string(),
        headers: headers_map,
        body: body.clone(),
        status_code,
        error_reason: error_reason.clone(),
    };

    state.requests.lock().unwrap().push(request);

    let response_body = if status_code == 200 {
        serde_json::json!({
            "success": true,
            "message": "Webhook received successfully"
        })
    } else {
        serde_json::json!({
            "success": false,
            "error": error_reason.unwrap_or_else(|| "Unknown error".to_string())
        })
    };

    (
        StatusCode::from_u16(status_code).unwrap(),
        Json(response_body),
    )
}

async fn health_check() -> &'static str {
    "Webhook server is running"
}

#[tauri::command(rename_all = "camelCase")]
pub async fn start_webhook_server(
    port: u16,
    auth_method: String,
    auth_value: String,
) -> Result<String, String> {
    {
        let handle_guard = SERVER_HANDLE.lock().unwrap();
        if handle_guard.is_some() {
            return Err("Server is already running".to_string());
        }
    }

    WEBHOOK_STATE.requests.lock().unwrap().clear();
    *WEBHOOK_STATE.auth_method.lock().unwrap() = auth_method;
    *WEBHOOK_STATE.auth_value.lock().unwrap() = auth_value;

    let app = Router::new()
        .route("/webhook", post(handle_webhook))
        .route("/health", get(health_check))
        .layer(CorsLayer::permissive())
        .with_state(WEBHOOK_STATE.clone());

    let addr = format!("0.0.0.0:{}", port);
    let listener = match tokio::net::TcpListener::bind(&addr).await {
        Ok(l) => l,
        Err(e) => return Err(format!("Failed to bind to {}: {}", addr, e)),
    };

    let handle = tokio::spawn(async move {
        if let Err(e) = axum::serve(listener, app).await {
            eprintln!("Server error: {}", e);
        }
    });

    *SERVER_HANDLE.lock().unwrap() = Some(handle);

    Ok(format!("http://localhost:{}/webhook", port))
}

#[tauri::command]
pub async fn stop_webhook_server() -> Result<(), String> {
    let mut handle_guard = SERVER_HANDLE.lock().unwrap();
    if let Some(handle) = handle_guard.take() {
        handle.abort();
        Ok(())
    } else {
        Err("No server is running".to_string())
    }
}

#[tauri::command]
pub fn get_webhook_requests() -> Vec<WebhookRequest> {
    WEBHOOK_STATE.requests.lock().unwrap().clone()
}

#[tauri::command]
pub fn clear_webhook_requests() {
    WEBHOOK_STATE.requests.lock().unwrap().clear();
}

#[derive(Clone, Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SendWebhookResponse {
    status_code: u16,
    headers: HashMap<String, String>,
    body: String,
    error_reason: Option<String>,
}

#[tauri::command(rename_all = "camelCase")]
pub async fn send_webhook_request(
    url: String,
    method: String,
    headers: HashMap<String, String>,
    body: String,
) -> Result<SendWebhookResponse, String> {
    let client = reqwest::Client::new();

    let mut request_builder = match method.to_uppercase().as_str() {
        "GET" => client.get(&url),
        "POST" => client.post(&url),
        "PUT" => client.put(&url),
        "DELETE" => client.delete(&url),
        "PATCH" => client.patch(&url),
        _ => return Err(format!("Unsupported HTTP method: {}", method)),
    };

    for (key, value) in &headers {
        request_builder = request_builder.header(key.as_str(), value.as_str());
    }

    if !body.is_empty() && method.to_uppercase() != "GET" {
        request_builder = request_builder
            .header("content-type", "application/json")
            .body(body);
    }

    match request_builder.send().await {
        Ok(response) => {
            let status_code = response.status().as_u16();
            let resp_headers: HashMap<String, String> = response
                .headers()
                .iter()
                .map(|(k, v)| (k.to_string(), v.to_str().unwrap_or("").to_string()))
                .collect();
            let resp_body = response.text().await.unwrap_or_default();

            let error_reason = if status_code >= 400 {
                Some(format!(
                    "HTTP {}: {}",
                    status_code,
                    resp_body.chars().take(200).collect::<String>()
                ))
            } else {
                None
            };

            Ok(SendWebhookResponse {
                status_code,
                headers: resp_headers,
                body: resp_body,
                error_reason,
            })
        }
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}
