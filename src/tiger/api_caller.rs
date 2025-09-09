use base64::{Engine as _, engine::general_purpose};
use chrono::{DateTime, Local};
use reqwest;
use rsa::{RsaPrivateKey, pkcs1::DecodeRsaPrivateKey, pkcs1v15::Pkcs1v15Sign};
use serde::{Deserialize, Serialize};
use serde_json;
use sha1::{Digest, Sha1};
use std::collections::HashMap;
use std::env;

// Import necessary types
use crate::http::client::RequestError;
use crate::model::Candle;

// Constants for Tiger API request parameters
const KEY_TIGER_ID: &str = "tiger_id"; // KeyTigerID is the key for tiger_id parameter
const KEY_METHOD: &str = "method"; // KeyMethod is the key for method parameter
const KEY_CHARSET: &str = "charset"; // KeyCharset is the key for charset parameter
const KEY_SIGN_TYPE: &str = "sign_type"; // KeySignType is the key for sign_type parameter
const KEY_SIGN: &str = "sign"; // KeySign is the key for sign parameter
const KEY_TIMESTAMP: &str = "timestamp"; // KeyTimestamp is the key for timestamp parameter
const KEY_VERSION: &str = "version"; // KeyVersion is the key for version parameter
const KEY_BIZ_CONTENT: &str = "biz_content"; // KeyBizContent is the key for biz_content parameter
const KEY_DEVICE_ID: &str = "device_id"; // KeyDeviceID is the key for device_id parameter

// API method names used with the Tiger API.
const METHOD_GRAB_QUOTE_PERMISSION: &str = "grab_quote_permission"; // MethodGrabQuotePermission is the method to grab quote permission.
const METHOD_KLINE: &str = "kline"; // MethodKline is the method for kline data.
const METHOD_OPTION_CHAIN: &str = "option_chain"; // MethodOptionChain is the method for option chain data.

// Charset is the default charset for Tiger API requests
const CHARSET: &str = "UTF-8";

// SignType is the default signature type for Tiger API requests
const SIGN_TYPE: &str = "RSA";

// Endpoint is the base URL for Tiger API
const ENDPOINT: &str = "https://openapi.tigerfintech.com/gateway";

// Response represents a response from Tiger API
#[derive(Debug, Deserialize, Serialize)]
pub struct Response {
    pub code: i32,
    pub message: String,
    pub data: serde_json::Value,
    pub timestamp: i64,
}

// Requester represents a requester for Tiger API operations.
pub struct Requester {
    client: reqwest::Client,
}

impl Requester {
    // NewRequester creates a new Requester instance with the base URL set to the Tiger API endpoint.
    pub async fn new() -> Option<Requester> {
        let client = reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(3))
            .build()
            .ok()?;

        let requester = Requester { client };

        // Try to grab quote permission to test the connection
        let result = requester
            .execute_query(METHOD_GRAB_QUOTE_PERMISSION, "", None)
            .await;

        if result.is_err() {
            eprintln!("Failed to grab quote permission: {:?}", result.err());
            return None;
        }

        Some(requester)
    }

    // QueryStockQuotes queries stock quotes from the Tiger API for given symbols.
    pub async fn query_stock_quotes(
        &self,
        symbols: &[&str],
        to: &DateTime<Local>,
        count: u32,
        period: &str,
    ) -> Result<Vec<Candle>, RequestError> {
        let biz_content = serde_json::json!({
            "symbols": symbols,
            "period": period,
            "limit": count,
            "end_time": to.timestamp_millis(),
        });

        // Execute the query and handle errors
        let resp = self
            .execute_query(METHOD_KLINE, "", Some(biz_content))
            .await
            .map_err(|e| RequestError::Other(format!("Failed to execute query: {}", e)))?;

        // Parse the response data to extract candle information
        let candles_array = resp.data.as_array().ok_or_else(|| {
            RequestError::Other("Invalid response format: expected array".to_string())
        })?;

        if candles_array.is_empty() {
            return Ok(Vec::new());
        }

        // Convert all symbols' data to Candle structs
        let mut candles = Vec::new();
        for kline_data_value in candles_array {
            let kline_data = kline_data_value.as_object().ok_or_else(|| {
                RequestError::Other("Invalid response format: expected object".to_string())
            })?;

            // Extract symbol from the kline data
            let symbol = kline_data
                .get("symbol")
                .and_then(|v| v.as_str())
                .ok_or_else(|| {
                    RequestError::Other("Missing or invalid 'symbol' in response".to_string())
                })?
                .to_string();

            // Extract the items array
            let items = kline_data
                .get("items")
                .and_then(|v| v.as_array())
                .ok_or_else(|| {
                    RequestError::Other("Missing or invalid 'items' in response".to_string())
                })?;

            // Convert items to Candle structs
            for item in items {
                let item_obj = item.as_object().ok_or_else(|| {
                    RequestError::Other("Invalid item format: expected object".to_string())
                })?;

                // Extract values with proper error handling
                let open = item_obj
                    .get("open")
                    .and_then(|v| v.as_f64())
                    .ok_or_else(|| {
                        RequestError::Other("Missing or invalid 'open' value".to_string())
                    })?;

                let high = item_obj
                    .get("high")
                    .and_then(|v| v.as_f64())
                    .ok_or_else(|| {
                        RequestError::Other("Missing or invalid 'high' value".to_string())
                    })?;

                let low = item_obj
                    .get("low")
                    .and_then(|v| v.as_f64())
                    .ok_or_else(|| RequestError::Other("Missing or invalid 'low' value".to_string()))?;

                let close = item_obj
                    .get("close")
                    .and_then(|v| v.as_f64())
                    .ok_or_else(|| {
                        RequestError::Other("Missing or invalid 'close' value".to_string())
                    })?;

                let volume = item_obj
                    .get("volume")
                    .and_then(|v| v.as_f64())
                    .map(|v| v as u32)
                    .ok_or_else(|| {
                        RequestError::Other("Missing or invalid 'volume' value".to_string())
                    })?;

                let timestamp = item_obj
                    .get("time")
                    .and_then(|v| v.as_f64())
                    .map(|v| (v / 1000.0) as u32) // Convert milliseconds to seconds
                    .ok_or_else(|| {
                        RequestError::Other("Missing or invalid 'time' value".to_string())
                    })?;

                let candle = Candle {
                    symbol: symbol.clone(),
                    open,
                    high,
                    low,
                    close,
                    volume,
                    timestamp,
                };

                candles.push(candle);
            }
        }

        Ok(candles)
    }

    // QueryOptionChain queries option chain data from the Tiger API for a given symbol.
    pub async fn query_option_chain(&self, symbol: &str) -> Result<(), RequestError> {
        let biz_content = serde_json::json!({
            "option_basic": [{
                "symbol": symbol,
                "expiry": 1757649600000i64, // Example expiry timestamp
            }]
        });

        let resp = self
            .execute_query(METHOD_OPTION_CHAIN, "3.0", Some(biz_content))
            .await
            .map_err(|e| RequestError::Other(format!("Failed to execute query: {}", e)))?;

        println!("Option chain data: {:?}", resp.data);
        Ok(())
    }

    // executeQuery executes a query to the Tiger API.
    async fn execute_query(
        &self,
        method: &str,
        version: &str,
        biz_content: Option<serde_json::Value>,
    ) -> Result<Response, RequestError> {
        let tiger_id = env::var("TIGER_ID").map_err(|_| {
            RequestError::Other("Missing TIGER_ID environment variable".to_string())
        })?;
        let private_key = env::var("TIGER_RSA").map_err(|_| {
            RequestError::Other("Missing TIGER_RSA environment variable".to_string())
        })?;

        // Format timestamp as "2006-01-02 15:04:05"
        let now = Local::now();
        let timestamp = now.format("%Y-%m-%d %H:%M:%S").to_string();

        let mut data = HashMap::new();
        data.insert(KEY_TIGER_ID.to_string(), tiger_id);
        data.insert(KEY_METHOD.to_string(), method.to_string());
        data.insert(KEY_CHARSET.to_string(), CHARSET.to_string());
        data.insert(KEY_SIGN_TYPE.to_string(), SIGN_TYPE.to_string());
        data.insert(KEY_TIMESTAMP.to_string(), timestamp);
        data.insert(KEY_VERSION.to_string(), "2.0".to_string());
        data.insert(KEY_DEVICE_ID.to_string(), "00:15:5d:34:01:5e".to_string());

        if !version.is_empty() {
            data.insert(KEY_VERSION.to_string(), version.to_string());
        }

        if let Some(biz_content) = biz_content {
            let biz_content_str = serde_json::to_string(&biz_content).map_err(|e| {
                RequestError::Other(format!("Failed to marshal biz_content: {}", e))
            })?;
            data.insert(KEY_BIZ_CONTENT.to_string(), biz_content_str);
        }

        // Generate the signature
        let sign_content = get_sign_content(&data);
        let sign = sign_with_rsa(&private_key, sign_content.as_bytes())
            .map_err(|e| RequestError::Other(format!("Failed to sign request: {}", e)))?;
        data.insert(KEY_SIGN.to_string(), sign);

        let body = serde_json::to_string(&data)
            .map_err(|e| RequestError::Other(format!("Failed to marshal request data: {}", e)))?;

        let response = self
            .client
            .post(ENDPOINT)
            .header(
                "Content-Type",
                format!("application/json;charset={}", CHARSET),
            )
            .header("Cache-Control", "no-cache")
            .header("Connection", "Keep-Alive")
            .body(body)
            .send()
            .await
            .map_err(|e| RequestError::Other(format!("Request to Tiger API failed: {}", e)))?;

        if !response.status().is_success() {
            return Err(RequestError::Other(format!(
                "Unexpected response status: {}",
                response.status()
            )));
        }

        let result: Response = response
            .json()
            .await
            .map_err(|e| RequestError::Other(format!("Failed to parse response: {}", e)))?;

        if result.code != 0 {
            return Err(RequestError::Other(format!(
                "Tiger API error: code={}, message={}",
                result.code, result.message
            )));
        }

        Ok(result)
    }
}

// Helper functions

fn fill_private_key_marker(private_key: &str) -> String {
    // Check if it already has proper PEM formatting
    if private_key.contains("-----BEGIN RSA PRIVATE KEY-----") {
        return private_key.to_string();
    }

    // Format the Base64 content with 64-character lines
    let mut formatted_key = String::new();
    formatted_key.push_str("-----BEGIN RSA PRIVATE KEY-----\n");

    // Break the Base64 string into 64-character lines
    let mut chars = private_key.chars().peekable();
    let mut line_count = 0;

    while chars.peek().is_some() {
        let chunk: String = chars.by_ref().take(64).collect();
        formatted_key.push_str(&chunk);
        formatted_key.push('\n');
        line_count += 1;

        // Safety check to avoid infinite loops
        if line_count > 1000 {
            break;
        }
    }

    formatted_key.push_str("-----END RSA PRIVATE KEY-----\n");
    formatted_key
}

fn sign_with_rsa(private_key: &str, sign_content: &[u8]) -> Result<String, RequestError> {
    let private_key_pem = fill_private_key_marker(private_key);

    // Parse the private key
    let private_key = RsaPrivateKey::from_pkcs1_pem(&private_key_pem)
        .map_err(|e| RequestError::Other(format!("Failed to parse private key: {}", e)))?;

    // Create SHA1 hash of the content
    let mut hasher = Sha1::new();
    hasher.update(sign_content);
    let hashed = hasher.finalize();

    // Sign the hash with RSA
    let signature = private_key
        .sign(Pkcs1v15Sign::new::<sha1::Sha1>(), &hashed)
        .map_err(|e| RequestError::Other(format!("Failed to sign content: {}", e)))?;

    // Encode the signature as base64
    let encoded_signature = general_purpose::STANDARD.encode(&signature);
    Ok(encoded_signature)
}

fn get_sign_content(params: &HashMap<String, String>) -> String {
    let mut keys: Vec<&String> = params.keys().collect();
    keys.sort();

    let mut sign_content = String::new();
    for key in keys {
        if let Some(value) = params.get(key) {
            sign_content.push_str(&format!("&{}={}", key, value));
        }
    }

    // Remove the leading '&'
    if !sign_content.is_empty() {
        sign_content.remove(0);
    }

    sign_content
}
