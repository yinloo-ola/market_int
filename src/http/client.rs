use ratelimit::Ratelimiter;
use reqwest;
use serde::de::DeserializeOwned;
use std::env;
use std::sync::Arc;
use std::time::Duration;
use thiserror::Error;

// Base URL for the market data API.
const BASE_URL: &str = "https://api.marketdata.app/";

// Shared HTTP client instance.
lazy_static::lazy_static! {
    static ref CLIENT: Arc<reqwest::Client> = Arc::new(reqwest::Client::new());
}

// Rate limit: 5 requests per second.
const TOKEN_PER_SEC: u64 = 1;
// Rate limiter instance.
lazy_static::lazy_static! {
    static ref RATELIMITER: Arc<Ratelimiter> = Arc::new(
        Ratelimiter::builder(TOKEN_PER_SEC, Duration::from_millis(100))
            .max_tokens(TOKEN_PER_SEC)
            .initial_available(1)
            .build()
            .unwrap(),
    );
}

/// Custom error type for HTTP requests.
#[derive(Error, Debug)]
pub enum RequestError {
    #[error("Environment variable 'marketdata_token' not set")]
    TokenNotSet,
    #[error("HTTP error: {0}. Response body: {1}")]
    HttpError(reqwest::Url, u16, String),
    #[error("Error deserializing JSON: {0}")]
    JsonError(String),
    #[error("Other error: {0}")]
    Other(String),
}

/// Makes an HTTP request to the specified path with optional parameters.
pub async fn request<T: DeserializeOwned>(
    path: &str,                        // API path.
    params: Option<Vec<(&str, &str)>>, // Optional query parameters.
) -> Result<T, RequestError> {
    // Wait for rate limiter if necessary.
    if let Err(sleep) = RATELIMITER.try_wait() {
        std::thread::sleep(sleep);
    }

    // Construct the URL.
    let url = match params {
        Some(params) => reqwest::Url::parse_with_params(&format!("{}{}", BASE_URL, path), &params)
            .map_err(|e| RequestError::Other(e.to_string()))?,
        None => reqwest::Url::parse(&format!("{}{}", BASE_URL, path))
            .map_err(|e| RequestError::Other(e.to_string()))?,
    };

    // Get the API token from the environment variable.
    let token = env::var("marketdata_token").map_err(|_| RequestError::TokenNotSet)?;

    // Send the HTTP request.
    let response = CLIENT
        .get(url.as_str())
        .bearer_auth(token)
        .send()
        .await
        .map_err(|e| RequestError::Other(e.to_string()))?;

    // Get the response status code.
    let status = response.status();

    // Handle non-success status codes.
    if !status.is_success() {
        let body = response
            .text()
            .await
            .map_err(|e| RequestError::Other(e.to_string()))?;
        return Err(RequestError::HttpError(url, status.as_u16(), body));
    }

    // Deserialize the JSON response.
    response
        .json()
        .await
        .map_err(|e| RequestError::JsonError(e.to_string()))
}
