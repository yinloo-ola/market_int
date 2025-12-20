use core::str;
use std::{env, usize};

use chrono::{DateTime, Datelike, Days, Local, Timelike, Weekday};
use chrono_tz::{America::New_York, Asia::Singapore};
use rusqlite::Connection;
use std::collections::HashMap;
use telegram_bot_api::{
    bot,
    types::{ChatId, InputFile},
};

use crate::{
    constants,
    http::client,
    model::{self, QuotesError},
    store::{candle, max_drop, option_chain, sharpe_ratio},
    symbols,
    tiger::api_caller::Requester,
};
use tokio::time::{Duration, sleep};

/// Enum to represent different option expiry timeframes
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum ExpiryTimeframe {
    Short,  // ~5 days (1 week)
    Medium, // ~20 days (4 weeks)
}

type NewYorkDateTime = DateTime<chrono_tz::Tz>;

/// Calculates trading days between two dates, excluding weekends
fn calculate_trading_days_to_expiry(from_date: NewYorkDateTime, to_date: NewYorkDateTime) -> u32 {
    let mut current = from_date;
    let mut trading_days = 0;
    
    while current < to_date {
        let weekday = current.weekday();
        // Weekday numbering: Mon=1, Tue=2, ..., Sat=6, Sun=0
        if weekday != Weekday::Sat && weekday != Weekday::Sun {
            trading_days += 1;
        }
        current = current + Days::new(1);
    }
    
    trading_days
}

/// Calculates adjusted strike range based on DTE and period
fn calculate_adjusted_strike_range(
    underlying_price: f64,
    percentile_drop: f64,
    ema_drop: f64,
    dte: u32,
    period: usize,
) -> (f64, f64) {
    // Ensure minimum DTE of 1 to avoid division by zero
    let effective_dte = dte.max(1);
    let adjustment_factor = effective_dte as f64 / period as f64;
    
    // Apply adjustment to drop values
    let adjusted_percentile_drop = percentile_drop * adjustment_factor;
    let adjusted_ema_drop = ema_drop * adjustment_factor;
    
    // Calculate strike prices
    let v1 = underlying_price * (1.0 - adjusted_ema_drop);
    let v2 = underlying_price * (1.0 - adjusted_percentile_drop);
    
    let (min_strike, max_strike) = if v1 < v2 { (v1, v2) } else { (v2, v1) };
    
    // Apply safety range adjustment
    let safety_range = (adjusted_percentile_drop - adjusted_ema_drop).abs() * 0.02;
    let adjusted_max_strike = max_strike * (1.0 - safety_range);
    
    (min_strike, adjusted_max_strike)
}

/// Pulls option chains with configurable expiry timeframe
pub async fn retrieve_option_chains_with_expiry(
    symbols_file_path: &str, // Path to the file containing symbols.
    side: &model::OptionChainSide,
    conn: &mut Connection, // Database connection.
    expiry_timeframe: ExpiryTimeframe,
) -> model::Result<()> {
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    // Initialize the option_strike table in the database.
    option_chain::create_table(&conn)?;

    // Initialize Tiger API requester
    let requester = match Requester::new().await {
        Some(requester) => requester,
        None => {
            log::error!("Failed to initialize Tiger API requester");
            return Err(model::QuotesError::HttpError(client::RequestError::Other(
                "Failed to initialize Tiger API requester".into(),
            )));
        }
    };

    let period = if expiry_timeframe == ExpiryTimeframe::Medium {
        20
    } else {
        5
    };

    let mut all_chains: Vec<model::OptionStrikeCandle> = Vec::with_capacity(100);

    // Process symbols in batches of 10 (Tiger API limit)
    for chunk in symbols.chunks(10) {
        let symbols_for_expiry: Vec<&str> = chunk.iter().map(|s| s.as_str()).collect();
        
        // Get all eligible expiry dates for symbols in this batch
        let expirations = match requester.option_expiration(&symbols_for_expiry).await {
            Ok(expirations) => expirations,
            Err(e) => {
                log::error!("Failed to get option expirations for batch. Err: {}", e);
                // Log which symbols failed
                for symbol in &symbols_for_expiry {
                    log::error!("Failed symbol in batch: {}", symbol);
                }
                continue; // Skip this batch and continue with the next one
            }
        };

        // Get expiration date range based on timeframe and convert to New York timezone
        let expiration_date = get_expiration_date(expiry_timeframe);
        let target_date = expiration_date;
        let target_date_ny = target_date.with_timezone(&New_York);

        // Add a 1-second sleep between API calls to avoid overwhelming the Tiger API
        sleep(Duration::from_secs(1)).await;

        // Find the nearest expiration date to our target date
        let expiration_date_ny =
            match Requester::find_nearest_expiration(&expirations, &target_date_ny) {
                Some(expiration_date) => expiration_date,
                None => {
                    log::error!("Failed to find nearest expiration date for batch");
                    // Log which symbols failed
                    for symbol in &symbols_for_expiry {
                        log::error!("Failed symbol in batch: {}", symbol);
                    }
                    continue; // Skip this batch and continue with the next one
                }
            };

        // Calculate trading days to expiry
        let current_date_ny = Local::now().with_timezone(&New_York);
        let dte = calculate_trading_days_to_expiry(current_date_ny, expiration_date_ny);
        log::debug!("Trading days to expiry: {} for timeframe: {:?}", dte, expiry_timeframe);

        // Prepare symbol-strike range pairs for this batch with adjusted ranges
        let mut symbol_strike_ranges: Vec<(&str, (f64, f64))> = Vec::new();
        let mut underlying_prices: std::collections::HashMap<String, f64> =
            std::collections::HashMap::new();

        // Collect adjusted strike ranges for all symbols in this batch
        for symbol in chunk {
            let (percentile_drop, ema_drop) = max_drop::get_max_drop(&conn, symbol, period)?;
            let latest_candle = &candle::get_candles(&conn, symbol, 1)?[0];
            underlying_prices.insert(symbol.to_string(), latest_candle.close);
            
            let (min_strike, max_strike) = calculate_adjusted_strike_range(
                latest_candle.close,
                percentile_drop,
                ema_drop,
                dte,
                period
            );
            
            symbol_strike_ranges.push((symbol, (min_strike, max_strike)));
        }

        // Query Tiger API for option chains
        let chains = requester
            .query_option_chain(
                &symbol_strike_ranges,
                &underlying_prices,
                &expiration_date_ny,
                constants::MIN_OPEN_INTEREST,
                side,
            )
            .await;

        // Add a 1-second sleep between API calls to avoid overwhelming the Tiger API
        sleep(Duration::from_secs(1)).await;

        match chains {
            Ok(chains) => {
                // Filter out low quality chains
                let filtered_chains: Vec<_> = chains
                    .into_iter()
                    .filter(|chain| {
                        // Check if bid_size or ask_size is smaller than 3
                        if chain.bid_size < 3 || chain.ask_size < 3 {
                            return false;
                        }
                        // Check if volume or open_interest is smaller than 3
                        if chain.volume < 3 || chain.open_interest < 3 {
                            return false;
                        }
                        // Check if bid is smaller than 0.03 or ask is smaller than 0.05
                        if chain.bid < 0.03 || chain.ask < 0.05 {
                            return false;
                        }
                        // check if ask is more than 5 times of bid
                        if chain.ask > 5.0 * chain.bid {
                            return false;
                        }
                        true
                    })
                    .collect();

                // save to DB
                option_chain::save_option_strike(conn, &filtered_chains)?;
                all_chains.extend(filtered_chains);
            }
            Err(e) => {
                log::error!("Fail to retrieve option chain for batch. Err: {}", e);
                // Log which symbols failed
                for (symbol, _) in &symbol_strike_ranges {
                    log::error!("Failed symbol in batch: {}", symbol);
                }
            }
        }
    }

    // Collect Sharpe ratios for all symbols
    let mut sharpe_ratios: HashMap<String, f64> = HashMap::new();
    for symbol in &symbols {
        match sharpe_ratio::get_sharpe_ratio(&conn, symbol) {
            Ok(Some(ratio)) => {
                sharpe_ratios.insert(symbol.clone(), ratio);
            }
            Ok(None) => {
                log::warn!("No Sharpe ratio found for symbol: {}", symbol);
            }
            Err(err) => {
                log::error!("Failed to get Sharpe ratio for {}: {}", symbol, err);
            }
        }
    }

    publish_to_telegram(&all_chains, &sharpe_ratios, period).await
}

/// Calculates the expiration date based on the specified timeframe.
/// For Short timeframe: returns date for ~1 week expiry (5-7 days)
/// For Medium timeframe: returns date for ~4 weeks expiry (20-28 days)
fn get_expiration_date(timeframe: ExpiryTimeframe) -> DateTime<Local> {
    let now = Local::now().with_hour(12).unwrap();

    match timeframe {
        ExpiryTimeframe::Short => {
            // For short timeframe (~5 days/1 week), use current logic
            match now.weekday() {
                Weekday::Mon => now + Days::new(5),
                Weekday::Tue => now + Days::new(4),
                Weekday::Wed => now + Days::new(3 + 7),
                Weekday::Thu => now + Days::new(2 + 7),
                Weekday::Fri => now + Days::new(1 + 7),
                Weekday::Sat => now + Days::new(7),
                Weekday::Sun => now + Days::new(6),
            }
        }
        ExpiryTimeframe::Medium => {
            // For medium timeframe (~20 days/4 weeks), look further ahead
            match now.weekday() {
                Weekday::Mon => now + Days::new(5 + 3 * 7),
                Weekday::Tue => now + Days::new(4 + 3 * 7),
                Weekday::Wed => now + Days::new(3 + 4 * 7),
                Weekday::Thu => now + Days::new(2 + 4 * 7),
                Weekday::Fri => now + Days::new(1 + 4 * 7),
                Weekday::Sat => now + Days::new(0 + 4 * 7),
                Weekday::Sun => now + Days::new(4 * 7 - 1),
            }
        }
    }
}

pub async fn publish_option_chains(
    symbols_file_path: &str, // Path to the file containing symbols.
    mut conn: Connection,    // Database connection.
    period: usize,
) -> model::Result<()> {
    option_chain::create_table(&conn)?;
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    let mut all_chains: Vec<model::OptionStrikeCandle> = Vec::with_capacity(100);
    let mut sharpe_ratios: HashMap<String, f64> = HashMap::new();

    for symbol in &symbols {
        let chains = option_chain::retrieve_option_chain(&mut conn, symbol);
        match chains {
            Ok(chains) => all_chains.extend(chains),
            Err(err) => {
                log::error!("fail to retrieve chain for {}. Error: {}.", symbol, err);
                continue;
            }
        };

        // Get Sharpe ratio for this symbol
        match sharpe_ratio::get_sharpe_ratio(&conn, symbol) {
            Ok(Some(ratio)) => {
                sharpe_ratios.insert(symbol.clone(), ratio);
            }
            Ok(None) => {
                log::warn!("No Sharpe ratio found for symbol: {}", symbol);
            }
            Err(err) => {
                log::error!("Failed to get Sharpe ratio for {}: {}", symbol, err);
            }
        }
    }

    publish_to_telegram(&all_chains, &sharpe_ratios, period).await
}

pub async fn publish_to_telegram(
    all_chains: &[model::OptionStrikeCandle],
    sharpe_ratios: &HashMap<String, f64>,
    period: usize,
) -> model::Result<()> {
    // Save all_chains to a csv file and upload it to dropbox
    let csv = model::option_chain_to_csv_vec(all_chains, sharpe_ratios)?;

    let now_singapore = Local::now().with_timezone(&Singapore);
    let formatted_date = now_singapore.format("%d%b_%H%M").to_string();
    let filename = format!("/{}_{}day.csv", formatted_date, period);

    let token = env::var("telegram_bot_token")?;
    let chat_id = env::var("telegram_chat_id")?
        .parse::<i64>()
        .map_err(|_| QuotesError::EnvVarNotSet(env::VarError::NotPresent))?;
    let bot = bot::BotApi::new(token, None).await?;

    log::debug!("chat_id {chat_id}");

    let resp = bot
        .send_document(telegram_bot_api::methods::SendDocument {
            chat_id: ChatId::IntType(chat_id),
            document: InputFile::FileBytes(filename, csv),
            thumb: None,
            caption: None,
            parse_mode: None,
            caption_entities: None,
            disable_content_type_detection: None,
            disable_notification: None,
            protect_content: None,
            reply_to_message_id: None,
            allow_sending_without_reply: None,
            reply_markup: None,
        })
        .await;
    match resp {
        Ok(_) => log::info!("telegram send doc ok"),
        Err(err) => {
            log::error!("telegram send doc failed: {:?}", err);
            return Err(model::QuotesError::TelegramError(err));
        }
    }
    Ok(())
}