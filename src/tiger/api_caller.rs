use base64::{engine::general_purpose, Engine as _};
use chrono::Local;
use reqwest;
use rsa::{pkcs1::DecodeRsaPrivateKey, pkcs1v15::Pkcs1v15Sign, RsaPrivateKey};
use serde::{Deserialize, Serialize};
use serde_json;
use sha1::{Digest, Sha1};
use std::collections::HashMap;
use std::env;

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

    // QueryStockQuotes queries stock quotes from the Tiger API for a given symbol.
    pub async fn query_stock_quotes(&self, symbol: &str) -> Result<(), Box<dyn std::error::Error>> {
        let now = Local::now();
        let begin = now - chrono::Duration::days(30);

        let biz_content = serde_json::json!({
            "symbols": [symbol],
            "period": "week",
            "begin_time": begin.timestamp_millis(),
            "end_time": now.timestamp_millis(),
        });

        let resp = self
            .execute_query(METHOD_KLINE, "", Some(biz_content))
            .await?;

        println!("Kline data: {:?}", resp.data);
        Ok(())
    }

    // QueryOptionChain queries option chain data from the Tiger API for a given symbol.
    pub async fn query_option_chain(&self, symbol: &str) -> Result<(), Box<dyn std::error::Error>> {
        let biz_content = serde_json::json!({
            "option_basic": [{
                "symbol": symbol,
                "expiry": 1757649600000i64, // Example expiry timestamp
            }]
        });

        let resp = self
            .execute_query(METHOD_OPTION_CHAIN, "3.0", Some(biz_content))
            .await?;

        println!("Option chain data: {:?}", resp.data);
        Ok(())
    }

    // executeQuery executes a query to the Tiger API.
    async fn execute_query(
        &self,
        method: &str,
        version: &str,
        biz_content: Option<serde_json::Value>,
    ) -> Result<Response, Box<dyn std::error::Error>> {
        let tiger_id = env::var("TIGER_ID").map_err(|_| "Missing TIGER_ID environment variable")?;
        let private_key =
            env::var("TIGER_RSA").map_err(|_| "Missing TIGER_RSA environment variable")?;

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
            let biz_content_str = serde_json::to_string(&biz_content)
                .map_err(|e| format!("Failed to marshal biz_content: {}", e))?;
            data.insert(KEY_BIZ_CONTENT.to_string(), biz_content_str);
        }

        // Generate the signature
        let sign_content = get_sign_content(&data);
        let sign = sign_with_rsa(&private_key, sign_content.as_bytes())?;
        data.insert(KEY_SIGN.to_string(), sign);

        let body = serde_json::to_string(&data)
            .map_err(|e| format!("Failed to marshal request data: {}", e))?;

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
            .map_err(|e| format!("Request to Tiger API failed: {}", e))?;

        if !response.status().is_success() {
            return Err(format!("Unexpected response status: {}", response.status()).into());
        }

        let result: Response = response
            .json()
            .await
            .map_err(|e| format!("Failed to parse response: {}", e))?;

        if result.code != 0 {
            return Err(format!(
                "Tiger API error: code={}, message={}",
                result.code, result.message
            )
            .into());
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

fn sign_with_rsa(
    private_key: &str,
    sign_content: &[u8],
) -> Result<String, Box<dyn std::error::Error>> {
    let private_key_pem = fill_private_key_marker(private_key);

    // Parse the private key
    let private_key = RsaPrivateKey::from_pkcs1_pem(&private_key_pem)
        .map_err(|e| format!("Failed to parse private key: {}", e))?;

    // Create SHA1 hash of the content
    let mut hasher = Sha1::new();
    hasher.update(sign_content);
    let hashed = hasher.finalize();

    // Sign the hash with RSA
    let signature = private_key
        .sign(Pkcs1v15Sign::new::<sha1::Sha1>(), &hashed)
        .map_err(|e| format!("Failed to sign content: {}", e))?;

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
