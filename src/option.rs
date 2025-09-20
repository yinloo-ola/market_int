use core::str;
use std::env;

use chrono::{DateTime, Datelike, Days, Local, Timelike, Weekday};
use chrono_tz::America::New_York;
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
    store::{candle, option_chain, sharpe_ratio, true_range},
    symbols,
    tiger::api_caller::Requester,
};
use tokio::time::{Duration, sleep};

/// Pulls option chains from the API based on ranges of symbols from the database.
pub async fn retrieve_option_chains_base_on_ranges(
    symbols_file_path: &str, // Path to the file containing symbols.
    side: &model::OptionChainSide,
    mut conn: Connection, // Database connection.
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

    let mut all_chains: Vec<model::OptionStrikeCandle> = Vec::with_capacity(100);

    // Process symbols in batches of 10 (Tiger API limit)
    for chunk in symbols.chunks(10) {
        // Prepare symbol-strike range pairs for this batch
        let mut symbol_strike_ranges: Vec<(&str, (f64, f64))> = Vec::new();
        let mut underlying_prices: std::collections::HashMap<String, f64> =
            std::collections::HashMap::new();

        // Collect strike ranges for all symbols in this batch
        for symbol in chunk {
            let true_range_ratio = true_range::get_true_range(&conn, symbol)?;
            let latest_candle = &candle::get_candles(&conn, symbol, 1)?[0];
            underlying_prices.insert(symbol.to_string(), latest_candle.close);
            let safety_range =
                (true_range_ratio.percentile_range - true_range_ratio.ema_range).abs() * 0.1;
            let v1 = latest_candle.close * (1.0 - true_range_ratio.ema_range);
            let v2 = latest_candle.close * (1.0 - true_range_ratio.percentile_range);
            let mut strike_range = match v1 < v2 {
                true => (v1, v2),
                false => (v2, v1),
            }; // (smaller,bigger)
            strike_range.1 *= 1.0 - safety_range; // decrement bigger value by safety_range
            symbol_strike_ranges.push((symbol, strike_range));
        }

        // Get expiration date range and convert to New York timezone
        let expiration_date_range = get_expiration_date_range();
        // Use the option_expiration API to get the next expiry date that is at least 4 days from now
        let target_date = expiration_date_range.0 + chrono::Duration::days(4);
        let target_date_ny = target_date.with_timezone(&New_York);

        // Get all eligible expiry dates for symbols in this batch
        let symbols_for_expiry: Vec<&str> = symbol_strike_ranges
            .iter()
            .map(|&(symbol, _)| symbol)
            .collect();
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

        // Add a 1-second sleep between API calls to avoid overwhelming the Tiger API
        sleep(Duration::from_secs(1)).await;

        // Find the nearest expiration date to our target date (4 days from now)
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
                option_chain::save_option_strike(&mut conn, &filtered_chains)?;
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

    publish_to_telegram(&all_chains, &sharpe_ratios).await
}

/// Calculates the range of expiration dates to use when fetching option chains.
/// The range is determined based on the current day of the week.
/// Returns a tuple containing the start and end dates of the expiration date range.
fn get_expiration_date_range() -> (DateTime<Local>, DateTime<Local>) {
    let now = Local::now().with_hour(12).unwrap();
    match now.weekday() {
        Weekday::Mon => (now + Days::new(3), now + Days::new(3 + 2)), // Thur to Sat
        Weekday::Tue => (now + Days::new(2), now + Days::new(2 + 7)), // Thur to next Sat
        Weekday::Wed => (now + Days::new(1 + 7), now + Days::new(1 + 7 + 2)), // Next Thur to next Sat
        Weekday::Thu => (now + Days::new(7), now + Days::new(7 + 2)), // Next Thur to next Sat
        Weekday::Fri => (now + Days::new(6), now + Days::new(6 + 2)), // Next Thur to next Sat
        Weekday::Sat => (now + Days::new(5), now + Days::new(5 + 2)), // Next Thur to next Sat
        Weekday::Sun => (now + Days::new(4), now + Days::new(4 + 2)), // Next Thur to next Sat
    }
}

pub async fn publish_option_chains(
    symbols_file_path: &str, // Path to the file containing symbols.
    mut conn: Connection,    // Database connection.
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

    publish_to_telegram(&all_chains, &sharpe_ratios).await
}

pub async fn publish_to_telegram(
    all_chains: &[model::OptionStrikeCandle],
    sharpe_ratios: &HashMap<String, f64>,
) -> model::Result<()> {
    // Save all_chains to a csv file and upload it to dropbox
    let csv = model::option_chain_to_csv_vec(all_chains, sharpe_ratios)?;

    let now = Local::now();
    let formatted_date = now.format("%Y%m%d_%H%M").to_string();
    let filename = format!("/{}.csv", formatted_date);

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
