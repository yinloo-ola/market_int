use base64::{Engine as _, engine::general_purpose};
use chrono::{DateTime, Local, TimeZone};
use chrono_tz;
use chrono_tz::America::New_York;
use reqwest;
use rsa::{RsaPrivateKey, pkcs1::DecodeRsaPrivateKey, pkcs1v15::Pkcs1v15Sign};
use serde::{Deserialize, Serialize};
use serde_json;
use sha1::{Digest, Sha1};
use std::collections::HashMap;
use std::env;

// Import necessary types
use crate::http::client::RequestError;
use crate::model::{self, Candle};

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
const METHOD_OPTION_EXPIRATION: &str = "option_expiration"; // MethodOptionExpiration is the method for option expiration data.

// Charset is the default charset for Tiger API requests
const CHARSET: &str = "UTF-8";

// Constants for API request parameters
const MAX_OPEN_INTEREST: u32 = 1000000;

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
        let candles_array =
            parse_response_as_array(&resp.data, "Invalid response format: expected array")?;

        if candles_array.is_empty() {
            return Ok(Vec::new());
        }

        // Convert all symbols' data to Candle structs
        let mut candles = Vec::new();
        for kline_data_value in candles_array {
            let kline_data = parse_value_as_object(
                kline_data_value,
                "Invalid response format: expected object",
            )?;

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
                    .ok_or_else(|| {
                        RequestError::Other("Missing or invalid 'low' value".to_string())
                    })?;

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

    pub async fn option_expiration(
        &self,
        symbols: &[&str],
    ) -> Result<Vec<model::OptionExpiration>, RequestError> {
        let biz_content = serde_json::json!({
            "symbols": symbols,
        });

        let resp = self
            .execute_query(METHOD_OPTION_EXPIRATION, "3.0", Some(biz_content))
            .await
            .map_err(|e| RequestError::Other(format!("Failed to execute query: {}", e)))?;

        // Parse the response data to extract option expiration information
        let expirations_array =
            parse_response_as_array(&resp.data, "Invalid response format: expected array")?;

        let mut expirations = Vec::new();
        for expiration_data_value in expirations_array {
            let expiration_data = parse_value_as_object(
                expiration_data_value,
                "Invalid response format: expected object",
            )?;

            // Extract values with proper error handling
            let symbol = expiration_data
                .get("symbol")
                .and_then(|v| v.as_str())
                .ok_or_else(|| {
                    RequestError::Other("Missing or invalid 'symbol' in response".to_string())
                })?
                .to_string();

            let count = expiration_data
                .get("count")
                .and_then(|v| v.as_u64())
                .map(|v| v as u32)
                .ok_or_else(|| {
                    RequestError::Other("Missing or invalid 'count' value".to_string())
                })?;

            let dates = expiration_data
                .get("dates")
                .and_then(|v| v.as_array())
                .ok_or_else(|| RequestError::Other("Missing or invalid 'dates' array".to_string()))?
                .iter()
                .map(|v| {
                    v.as_str()
                        .map(|s| s.to_string())
                        .ok_or_else(|| RequestError::Other("Invalid date string".to_string()))
                })
                .collect::<Result<Vec<String>, RequestError>>()?;

            let timestamps = expiration_data
                .get("timestamps")
                .and_then(|v| v.as_array())
                .ok_or_else(|| {
                    RequestError::Other("Missing or invalid 'timestamps' array".to_string())
                })?
                .iter()
                .map(|v| {
                    v.as_u64()
                        .ok_or_else(|| RequestError::Other("Invalid timestamp value".to_string()))
                })
                .collect::<Result<Vec<u64>, RequestError>>()?;

            let expiration = model::OptionExpiration {
                symbol,
                count,
                dates,
                timestamps,
            };

            expirations.push(expiration);
        }

        Ok(expirations)
    }

    /// Find the nearest expiration date to the specified target date
    /// Returns the DateTime in New York timezone
    pub fn find_nearest_expiration(
        expirations: &[model::OptionExpiration],
        target_date: &DateTime<chrono_tz::Tz>,
    ) -> Option<DateTime<chrono_tz::Tz>> {
        let target_timestamp_ms = target_date.timestamp_millis();

        // Collect all timestamps from all symbols
        let mut all_timestamps: Vec<i64> = Vec::new();
        for expiration in expirations {
            for &timestamp in &expiration.timestamps {
                all_timestamps.push(timestamp as i64);
            }
        }

        // Find the timestamp that is closest to our target
        all_timestamps.sort_by_key(|&timestamp| (timestamp - target_timestamp_ms).abs());

        // Convert the closest timestamp back to DateTime in New York timezone
        if let Some(&closest_timestamp) = all_timestamps.first()
            && let Some(dt) = chrono::Utc.timestamp_millis_opt(closest_timestamp).single()
        {
            return Some(dt.with_timezone(&New_York));
        }

        None
    }

    // QueryOptionChain queries option chain data from the Tiger API for a given symbol.
    pub async fn query_option_chain(
        &self,
        symbol_strike_ranges: &[(&str, (f64, f64))], // Stock symbols paired with their strike price ranges (min, max) inclusive.
        underlying_prices: &HashMap<String, f64>,    // Underlying prices for each symbol.
        expiration_date: &DateTime<chrono_tz::Tz>,   // Expiration date.
        min_open_interest: u32,                      // Minimum open interest.
        side: &model::OptionChainSide,
    ) -> Result<Vec<model::OptionStrikeCandle>, RequestError> {
        // Extract symbols from the combined structure
        let symbols: Vec<&str> = symbol_strike_ranges
            .iter()
            .map(|(symbol, _)| *symbol)
            .collect();

        // Create option_basic array for all symbols
        let option_basic: Vec<serde_json::Value> = symbols
            .iter()
            .map(|&symbol| {
                serde_json::json!({
                    "symbol": symbol,
                    "expiry": expiration_date.timestamp_millis(),
                })
            })
            .collect();

        let biz_content = serde_json::json!({
            "option_basic": option_basic,
            "option_filter":{
                "in_the_money": false,
                "open_interest":{
                    "min": min_open_interest,
                    "max": MAX_OPEN_INTEREST
                }

            }
        });

        let resp = self
            .execute_query(METHOD_OPTION_CHAIN, "3.0", Some(biz_content))
            .await
            .map_err(|e| RequestError::Other(format!("Failed to execute query: {}", e)))?;

        // Parse the response and return actual OptionStrikeCandle objects
        let mut candles: Vec<model::OptionStrikeCandle> = Vec::new();

        // The response data should be an array of objects with symbol, expiry, and items
        if let Some(data_array) = resp.data.as_array() {
            for symbol_data in data_array {
                // Extract symbol
                let symbol = symbol_data["symbol"].as_str().unwrap_or("").to_string();

                // Find the strike range for this symbol
                let strike_range = symbol_strike_ranges
                    .iter()
                    .find(|(s, _)| *s == symbol.as_str())
                    .map(|(_, strike_range)| *strike_range);

                if strike_range.is_none() {
                    // Skip symbols not in our original request
                    continue;
                }
                let strike_range = strike_range.unwrap();

                // Extract expiry timestamp
                let expiry_timestamp = symbol_data["expiry"].as_i64().unwrap_or(0);

                // Convert expiry timestamp to string format
                let expiry = format_expiry_timestamp(expiry_timestamp);

                // Process items (option strikes)
                if let Some(items_array) = symbol_data["items"].as_array() {
                    for item in items_array {
                        // Process call option if side is Call or side is not specified
                        if matches!(side, model::OptionChainSide::Call) {
                            let call_option = item["call"].as_object();
                            self.process_option_data(
                                call_option,
                                &symbol,
                                &expiry,
                                model::OptionChainSide::Call,
                                expiration_date,
                                strike_range,
                                underlying_prices.get(&symbol).copied().unwrap_or(0.0),
                                &mut candles,
                            );
                        }

                        // Process put option if side is Put or side is not specified
                        if matches!(side, model::OptionChainSide::Put) {
                            let put_option = item["put"].as_object();
                            self.process_option_data(
                                put_option,
                                &symbol,
                                &expiry,
                                model::OptionChainSide::Put,
                                expiration_date,
                                strike_range,
                                underlying_prices.get(&symbol).copied().unwrap_or(0.0),
                                &mut candles,
                            );
                        }
                    }
                }
            }
        }

        Ok(candles)
    }

    // Helper function to parse an option strike into an OptionStrikeCandle
    fn parse_option_strike_candle(
        &self,
        option_data: &serde_json::Map<String, serde_json::Value>,
        symbol: &str,
        expiry: &str,
        side: model::OptionChainSide,
        expiration_date: &DateTime<chrono_tz::Tz>,
        strike_range: (f64, f64),
        underlying_price: f64,
    ) -> Option<model::OptionStrikeCandle> {
        // Extract required fields
        let strike_str = option_data.get("strike")?.as_str()?;
        let strike: f64 = strike_str.parse().ok()?;

        let bid = option_data
            .get("bidPrice")
            .and_then(|v| v.as_f64())
            .unwrap_or(0.0);
        let ask = option_data
            .get("askPrice")
            .and_then(|v| v.as_f64())
            .unwrap_or(0.0);
        let last = option_data
            .get("latestPrice")
            .and_then(|v| v.as_f64())
            .unwrap_or(0.0);
        let bid_size = option_data
            .get("bidSize")
            .and_then(|v| v.as_u64())
            .unwrap_or(0) as u32;
        let ask_size = option_data
            .get("askSize")
            .and_then(|v| v.as_u64())
            .unwrap_or(0) as u32;
        let volume = option_data
            .get("volume")
            .and_then(|v| v.as_u64())
            .unwrap_or(0) as u32;
        let open_interest = option_data
            .get("openInterest")
            .and_then(|v| v.as_u64())
            .unwrap_or(0) as u32;

        // Calculate mid price
        let mid = calculate_mid_price(bid, ask, last);

        // Calculate days to expiration
        let now = chrono::Utc::now();
        // Convert expiration_date to UTC for comparison
        let expiration_utc = expiration_date.with_timezone(&chrono::Utc);
        let dte = (expiration_utc - now).num_days() as u32;

        // For now, we'll set some default values for fields we can't easily derive
        // In a real implementation, these might come from additional API calls or calculations
        let rate_of_return = format!("{:.3}", mid / strike / num_of_weeks(dte) * 52.0)
            .parse()
            .unwrap();
        let strike_from = format!("{:.3}", strike_range.0).parse().unwrap();
        let strike_to = format!("{:.3}", strike_range.1).parse().unwrap();

        // Create timestamp strings
        let updated = chrono::Utc::now().format("%Y-%m-%d %H:%M:%S").to_string();

        Some(model::OptionStrikeCandle {
            underlying: symbol.to_string(),
            strike,
            underlying_price,
            side,
            bid,
            mid,
            ask,
            bid_size,
            ask_size,
            last,
            expiration: expiry.to_string(),
            updated,
            dte,
            volume,
            open_interest,
            rate_of_return,
            strike_from,
            strike_to,
        })
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

    // Helper function to process option data and add matching candles to the result
    fn process_option_data(
        &self,
        option_data: Option<&serde_json::Map<String, serde_json::Value>>,
        symbol: &str,
        expiry: &str,
        side: model::OptionChainSide,
        expiration_date: &DateTime<chrono_tz::Tz>,
        strike_range: (f64, f64),
        underlying_price: f64,
        candles: &mut Vec<model::OptionStrikeCandle>,
    ) {
        if let Some(option) = option_data
            && let Some(candle) = self.parse_option_strike_candle(
                option,
                symbol,
                expiry,
                side,
                expiration_date,
                strike_range,
                underlying_price,
            )
        {
            // Filter by strike range for this symbol
            let (min_strike, max_strike) = strike_range;
            if candle.strike >= min_strike && candle.strike <= max_strike {
                candles.push(candle);
            }
        }
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

// Helper function to parse response data as an array
fn parse_response_as_array<'a>(
    response_data: &'a serde_json::Value,
    error_message: &str,
) -> Result<&'a Vec<serde_json::Value>, RequestError> {
    response_data
        .as_array()
        .ok_or_else(|| RequestError::Other(error_message.to_string()))
}

// Helper function to parse a JSON value as an object
fn parse_value_as_object<'a>(
    value: &'a serde_json::Value,
    error_message: &str,
) -> Result<&'a serde_json::Map<String, serde_json::Value>, RequestError> {
    value
        .as_object()
        .ok_or_else(|| RequestError::Other(error_message.to_string()))
}

// Helper function to convert expiry timestamp to string format
fn format_expiry_timestamp(timestamp: i64) -> String {
    if timestamp > 0 {
        // Convert timestamp to datetime string
        if let Some(expiry_dt) = chrono::Local.timestamp_millis_opt(timestamp).single() {
            expiry_dt.format("%Y-%m-%d").to_string()
        } else {
            "Unknown".to_string()
        }
    } else {
        "Unknown".to_string()
    }
}

// Calculates the number of weeks given the days to expiration.
fn num_of_weeks(dte: u32) -> f64 {
    if (5..=7).contains(&dte) {
        1.0
    } else {
        (dte / 7) as f64 + (dte % 7) as f64 / 5.0
    }
}

// Helper function to calculate mid price
fn calculate_mid_price(bid: f64, ask: f64, last: f64) -> f64 {
    if bid > 0.0 && ask > 0.0 {
        format!("{:.3}", (bid + ask) / 2.0).parse().unwrap()
    } else if bid > 0.0 {
        bid
    } else if ask > 0.0 {
        ask
    } else {
        last
    }
}
