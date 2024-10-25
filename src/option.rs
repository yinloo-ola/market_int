use core::str;
use std::env;

use chrono::{DateTime, Datelike, Days, Local, Timelike, Weekday};
use rusqlite::Connection;
use telegram_bot_api::{
    bot,
    types::{ChatId, InputFile},
};

use crate::{
    constants,
    marketdata::api_caller,
    model::{self, QuotesError},
    store::{candle, option_chain, true_range},
    symbols,
};

/// Pulls option chains from the API based on ranges of symbols from the database.
pub async fn retrieve_option_chains_base_on_ranges(
    symbols_file_path: &str, // Path to the file containing symbols.
    side: &model::OptionChainSide,
    mut conn: Connection, // Database connection.
) -> model::Result<()> {
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    // Initialize the option_strike table in the database.
    option_chain::create_table(&conn)?;

    let mut all_chains: Vec<model::OptionStrikeCandle> = Vec::with_capacity(100);

    for symbol in symbols {
        let true_range = true_range::get_true_range(&conn, &symbol)?;
        let latest_candle = &candle::get_candles(&conn, &symbol, 1)?[0];
        let safety_range = (true_range.percentile_range - true_range.ema_range).abs() * 0.1;
        let v1 = latest_candle.close - true_range.ema_range;
        let v2 = latest_candle.close - true_range.percentile_range;
        let mut strike_range = if v1 < v2 { (v1, v2) } else { (v2, v1) }; // (smaller,bigger)
        strike_range.0 += safety_range; // increment smaller value by safety_range

        let chains = api_caller::option_chain(
            &symbol,
            strike_range,
            &get_expiration_date_range(),
            constants::MIN_OPEN_INTEREST,
            side,
        )
        .await;

        match chains {
            Ok(chains) => {
                // save to DB
                option_chain::save_option_strike(&mut conn, &chains)?;
                all_chains.extend(chains);
            }
            Err(e) => {
                log::error!("Fail to retrieve option chain for {}. Err: {}", symbol, e);
            }
        }
    }

    publish_to_telegram(&all_chains).await
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
    for symbol in symbols {
        let chains = option_chain::retrieve_option_chain(&mut conn, &symbol);
        match chains {
            Ok(chains) => all_chains.extend(chains),
            Err(err) => {
                log::error!("fail to retrieve chain for {}. Error: {}.", symbol, err);
                continue;
            }
        };
    }

    publish_to_telegram(&all_chains).await
}

pub async fn publish_to_telegram(all_chains: &[model::OptionStrikeCandle]) -> model::Result<()> {
    // Save all_chains to a csv file and upload it to dropbox
    let csv = model::option_chain_to_csv_vec(all_chains)?;

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
