use reqwest::{self, RequestBuilder};
use serde::de::DeserializeOwned;
use std::{collections::HashMap, sync::Arc};
use thiserror::Error;

// Shared HTTP client instance.
lazy_static::lazy_static! {
    static ref CLIENT: Arc<reqwest::Client> = Arc::new(reqwest::Client::new());
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

pub enum Method {
    Get,
    Put(Option<Vec<u8>>),
    Post(Option<Vec<u8>>),
    Delete,
}

/// Makes an HTTP request to the specified path with optional parameters.
pub async fn request<T: DeserializeOwned>(
    method: Method,
    path: &str,                   // API path.
    params: HashMap<&str, &str>,  // Optional query parameters.
    headers: HashMap<&str, &str>, // Optional header parameters.
    token: Option<&str>,
) -> Result<T, RequestError> {
    // Construct the URL.
    let url = if params.len() > 0 {
        reqwest::Url::parse_with_params(path, &params)
            .map_err(|e| RequestError::Other(e.to_string()))?
    } else {
        reqwest::Url::parse(path).map_err(|e| RequestError::Other(e.to_string()))?
    };

    // Construct the request
    let mut req: RequestBuilder;
    match method {
        Method::Get => req = CLIENT.get(url.as_str()),
        Method::Delete => req = CLIENT.delete(url.as_str()),
        Method::Post(body) => {
            req = CLIENT.post(url.as_str());
            if let Some(body) = body {
                req = req.body(body);
            }
        }
        Method::Put(body) => {
            req = CLIENT.put(url.as_str());
            if let Some(body) = body {
                req = req.body(body);
            }
        }
    }

    if let Some(token) = token {
        req = req.bearer_auth(token)
    }

    if headers.len() > 0 {
        for (k, v) in headers {
            req = req.header(k, v);
        }
    }

    let response = req
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
