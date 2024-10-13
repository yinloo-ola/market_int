use ratelimit::Ratelimiter;
use reqwest;
use serde::de::DeserializeOwned;
use std::env;
use std::sync::Arc;
use std::time::Duration;
use thiserror::Error;

const BASE_URL: &str = "https://api.marketdata.app/";

lazy_static::lazy_static! {
    static ref CLIENT: Arc<reqwest::Client> = Arc::new(reqwest::Client::new());
}

const TOKEN_PER_SEC: u64 = 1;
lazy_static::lazy_static! {
    static ref RATELIMITER: Arc<Ratelimiter> = Arc::new(
        Ratelimiter::builder(TOKEN_PER_SEC, Duration::from_secs(1)).max_tokens(TOKEN_PER_SEC).initial_available(TOKEN_PER_SEC).build().unwrap(),
    );
}

#[derive(Error, Debug)]
pub enum RequestError {
    #[error("Environment variable 'marketdata_token' not set")]
    TokenNotSet,
    #[error("HTTP error: {0}. Response body: {1}")]
    HttpError(u16, String),
    #[error("Error deserializing JSON: {0}")]
    JsonError(String),
    #[error("Other error: {0}")]
    Other(String),
}

pub async fn request<T: DeserializeOwned>(
    path: &str,
    params: Option<Vec<(&str, &str)>>,
) -> Result<T, RequestError> {
    if let Err(sleep) = RATELIMITER.try_wait() {
        std::thread::sleep(sleep);
    }

    let url = match params {
        Some(params) => reqwest::Url::parse_with_params(&format!("{}{}", BASE_URL, path), &params)
            .map_err(|e| RequestError::Other(e.to_string()))?,
        None => reqwest::Url::parse(&format!("{}{}", BASE_URL, path))
            .map_err(|e| RequestError::Other(e.to_string()))?,
    };

    let token = env::var("marketdata_token").map_err(|_| RequestError::TokenNotSet)?;

    let response = CLIENT
        .get(url)
        .bearer_auth(token)
        .send()
        .await
        .map_err(|e| RequestError::Other(e.to_string()))?;

    let status = response.status();

    if !status.is_success() {
        let body = response
            .text()
            .await
            .map_err(|e| RequestError::Other(e.to_string()))?;
        return Err(RequestError::HttpError(status.as_u16(), body));
    }

    response
        .json()
        .await
        .map_err(|e| RequestError::JsonError(e.to_string()))
}
