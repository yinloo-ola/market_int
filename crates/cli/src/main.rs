// CLI entrypoint: argument parsing and dispatch. All domain work lives in
// `market_int_core`; this crate owns only the Telegram publish half
// (publish.rs) and the backtest simulation (backtest.rs).
mod publish;
mod backtest;

use chrono::{Datelike, Local};
use chrono::NaiveDate;
use chrono_tz::America::New_York;
use clap::{Parser, Subcommand};
use dotenv::dotenv;

use market_int_core::model::OptionChainSide;
use market_int_core::option::ExpiryTimeframe;
use market_int_core::tiger::api_caller::Requester;
use market_int_core::{
    constants, model, quotes, sectors, store, symbols, tiger,
};

// Helper function to calculate the target expiration date (next Friday + 7 days)
fn calculate_target_expiration_date() -> chrono::DateTime<chrono_tz::Tz> {
    // Calculate target date (next Friday + 7 days)
    let mut target_expiration_date = Local::now();
    while target_expiration_date.weekday() != chrono::Weekday::Fri {
        target_expiration_date += chrono::Duration::days(1);
    }
    target_expiration_date += chrono::Duration::days(7);

    // Convert target date to New York timezone
    target_expiration_date.with_timezone(&New_York)
}

// Helper function to query option chain and log the results
async fn query_and_log_option_chain(
    requester: &Requester,
    symbol_list: &[&str],
    expiration_date_ny: &chrono::DateTime<chrono_tz::Tz>,
    side: &OptionChainSide,
    strike: Option<f64>,
    underlying: Option<f64>,
) -> Result<(), Box<dyn std::error::Error>> {
    let symbol = symbol_list[0];

    // With a --strike probe, mirror the production refresh: one kline pass
    // supplies the real last close (it annotates every parsed row). The
    // legacy band keeps its historical placeholder.
    let underlying_price = match (underlying, strike) {
        (Some(v), _) => v,
        (None, Some(_)) => {
            let candles = requester
                .query_stock_quotes(&[symbol], &chrono::Local::now(), 1, "day")
                .await?;
            let close = candles
                .last()
                .map(|c| c.close)
                .ok_or_else(|| format!("no candles returned for {symbol}"))?;
            log::info!("Fetched {symbol} underlying last close: {close}");
            close
        }
        (None, None) => 0.0,
    };
    let mut underlying_prices: std::collections::HashMap<String, f64> =
        std::collections::HashMap::new();
    underlying_prices.insert(symbol.to_string(), underlying_price);

    // Degenerate (strike, strike) = the refresh's "price OUR strike" query
    // shape (OI minimum 0 there, too); the legacy band stays the example.
    let (min_strike, max_strike) = strike.map_or((225.0, 235.0), |s| (s, s));

    log::info!(
        "Chain probe: {symbol} side={:?} strikes [{min_strike}, {max_strike}] underlying={underlying_price}",
        side
    );

    // Query option chain
    let option_chain = requester
        .query_option_chain(
            &[(symbol, (min_strike, max_strike))],
            &underlying_prices,
            expiration_date_ny,
            if strike.is_some() { 0 } else { constants::MIN_OPEN_INTEREST },
            side,
        )
        .await?;

    log::info!(
        "Chain returned {} row(s) for {:?} strikes [{min_strike}, {max_strike}]",
        option_chain.len(),
        symbol
    );
    for row in &option_chain {
        log::info!(
            "  strike {} mid {} (bid {} / ask {}) oi {:?}",
            row.strike,
            row.mid,
            row.bid,
            row.ask,
            row.open_interest
        );
    }

    // Serialize and log the output as JSON string
    let json_str = serde_json::to_string_pretty(&option_chain)?;
    log::info!("Option chain data: {}", json_str);

    Ok(())
}

// Command-line argument parser.
#[derive(Parser, Debug)]
#[command(about, long_about = None)]
struct Args {
    #[command(subcommand)]
    command: Commands,
}

// Subcommands for the application.
#[derive(Subcommand, Debug)]
enum Commands {
    // Pull quotes for specified symbols.
    PullQuotes {
        symbols_file_path: String,
    },
    // Pull option chain data with 5-day expiry.
    PullOptionChain5Day {
        symbols_file_path: String,
    },
    // Pull option chain data with 20-day expiry.
    PullOptionChain20Day {
        symbols_file_path: String,
    },
    // Publish option chain to telegram.
    PublishOptionChain {
        symbols_file_path: String,
    },
    PerformAll {
        symbols_file_path: String,
    },
    // Test Tiger API
    TestTiger {
        symbols: String,
        /// Option chain side to query. The holdings refresh sends `call`
        /// for covered calls — the previously untested path (the request
        /// always carries `in_the_money: false`).
        #[arg(long, default_value = "put")]
        side: String,
        /// Probe the refresh's degenerate (strike, strike) query at this
        /// strike. Omitted = the legacy 225–235 example band.
        #[arg(long)]
        strike: Option<f64>,
        /// Underlying last close attached to the rows. With a --strike
        /// probe this is fetched from Tiger quotes when omitted — the
        /// production refresh always sends the real close.
        #[arg(long)]
        underlying: Option<f64>,
    },
    // Backtest simulation
    Backtest {
        symbols_file_path: String,
        /// Start date (YYYY-MM-DD)
        #[arg(long, default_value = "2023-01-01")]
        from: String,
        /// End date (YYYY-MM-DD)
        #[arg(long, default_value = "2024-12-31")]
        to: String,
        /// Config preset name or "all"
        #[arg(long, default_value = "all")]
        config: String,
        /// DTE period: 5 or 20
        #[arg(long, default_value = "5")]
        period: Option<usize>,
        /// CSV output path
        #[arg(long, default_value = "backtest_results.csv")]
        output: String,
        /// Optional earnings calendar CSV (symbol,report_date[,...]) to apply
        /// the earnings-aware scoring rule for `production-mirror`. Generate via
        /// `fetch-earnings`. Absent → earnings-blind (today's behavior).
        #[arg(long)]
        earnings: Option<String>,
        /// Run in safety-calibration mode. Instead of simulating top-N picks,
        /// evaluate breach/assignment for EVERY strike across the band (plus an
        /// extension above `max_strike` toward spot) using the production-mirror
        /// band math, and print the empirical `safety → breach-rate` curve.
        /// Read-only analysis; no production scoring change. The `config` and
        /// `period` args are ignored — calibration always uses production-mirror.
        #[arg(long, default_value_t = false)]
        calibrate_safety: bool,
    },
    // Fetch the earnings calendar from Tiger to a CSV (feeds `backtest --earnings`)
    FetchEarnings {
        /// Start date (YYYY-MM-DD)
        from: String,
        /// End date (YYYY-MM-DD)
        to: String,
        /// CSV output path
        #[arg(long, default_value = "earnings.csv")]
        output: String,
    },
}

#[tokio::main]
// Main function entry point.
async fn main() {
    dotenv().ok();

    env_logger::init();

    let args = Args::parse();

    let conn = store::sqlite::init_connection();
    if let Err(err) = conn {
        log::error!("Error initializing database connection: {}", err);
        return;
    }
    let mut conn = conn.unwrap();

    match args.command {
        Commands::PullQuotes { symbols_file_path } => {
            match quotes::pull_and_save(&symbols_file_path, &mut conn).await {
                Ok(_) => log::info!("Successfully pulled and saved quotes"),
                Err(err) => log::error!("Error pulling and saving quotes: {}", err),
            }
        }

        Commands::PullOptionChain5Day { symbols_file_path } => {
            let mut requester = match tiger::api_caller::Requester::new().await {
                Some(r) => r,
                None => {
                    log::error!("Failed to initialize Tiger API requester");
                    return;
                }
            };
            let regime = match market_int_core::regime::compute_spy_trend(&mut requester).await {
                Ok(spy_trend) => market_int_core::regime::MarketRegime::from_spy_trend(spy_trend),
                Err(e) => {
                    log::warn!("Failed to compute SPY regime, using bull defaults: {}", e);
                    market_int_core::regime::MarketRegime::from_spy_trend(1.05)
                }
            };
            let sectors = sectors::load_sectors("data/symbols.csv").unwrap_or_default();
            match publish::retrieve_option_chains_with_expiry(
                &symbols_file_path,
                &model::OptionChainSide::Put,
                &mut conn,
                ExpiryTimeframe::Short,
                &mut requester,
                &regime,
                &sectors,
            )
            .await
            {
                Ok(_) => log::info!("Successfully pulled and saved 5-day option chains"),
                Err(err) => log::error!("Error pulling 5-day option chains: {}", err),
            }
        }

        Commands::PullOptionChain20Day { symbols_file_path } => {
            let mut requester = match tiger::api_caller::Requester::new().await {
                Some(r) => r,
                None => {
                    log::error!("Failed to initialize Tiger API requester");
                    return;
                }
            };
            let regime = match market_int_core::regime::compute_spy_trend(&mut requester).await {
                Ok(spy_trend) => market_int_core::regime::MarketRegime::from_spy_trend(spy_trend),
                Err(e) => {
                    log::warn!("Failed to compute SPY regime, using bull defaults: {}", e);
                    market_int_core::regime::MarketRegime::from_spy_trend(1.05)
                }
            };
            let sectors = sectors::load_sectors("data/symbols.csv").unwrap_or_default();
            match publish::retrieve_option_chains_with_expiry(
                &symbols_file_path,
                &model::OptionChainSide::Put,
                &mut conn,
                ExpiryTimeframe::Medium,
                &mut requester,
                &regime,
                &sectors,
            )
            .await
            {
                Ok(_) => log::info!("Successfully pulled and saved 20-day option chains"),
                Err(err) => log::error!("Error pulling 20-day option chains: {}", err),
            }
        }

        Commands::PerformAll { symbols_file_path } => {
            // One orchestration path (market_int_core::pipeline); Telegram
            // publishing is injected as a hook so the webapp can run none.
            let opts = market_int_core::pipeline::PerformAllOptions {
                publish: Some(publish::telegram_publish_hook()),
                // CLI emits no pipeline events (no-op reporter default).
                progress: None,
            };
            // Everything is reported inside the pipeline — stage failures keep
            // their historical wording there, and its sole outer Err
            // (requester-init) is logged there too. The arm stays silent,
            // matching the old behavior exactly.
            let _ = market_int_core::pipeline::perform_all(&mut conn, &symbols_file_path, opts)
                .await;
        }

        Commands::PublishOptionChain { symbols_file_path } => {
            let sectors = sectors::load_sectors("data/symbols.csv").unwrap_or_default();
            let regime = market_int_core::regime::MarketRegime::from_spy_trend(1.05);
            match publish::publish_option_chains(&symbols_file_path, conn, 5, &regime, &sectors).await {
                Ok(_) => log::info!("Successfully published option chains"),
                Err(err) => log::error!("Error publishing option chains: {}", err),
            }
        }

        Commands::TestTiger {
            symbols,
            side,
            strike,
            underlying,
        } => {
            // Split the comma-separated symbols into a vector
            let symbol_list: Vec<&str> = symbols.split(',').map(|s| s.trim()).collect();

            let side = match side.as_str() {
                "put" => OptionChainSide::Put,
                "call" => OptionChainSide::Call,
                other => {
                    log::error!("unknown side {other:?} (want put|call)");
                    return;
                }
            };

            // Initialize Tiger API requester
            let mut requester = match tiger::api_caller::Requester::new().await {
                Some(requester) => requester,
                None => {
                    log::error!("Failed to initialize Tiger API requester");
                    return;
                }
            };

            log::info!("Successfully connected to Tiger API");

            // Test option chain
            // Calculate target expiration date
            let target_expiration_date_ny = calculate_target_expiration_date();

            // Get actual expiration dates from API and find the nearest one
            let expirations = match requester.option_expiration(&symbol_list).await {
                Ok(expirations) => expirations,
                Err(err) => {
                    log::error!("Error fetching option expirations: {}", err);
                    return;
                }
            };

            // Find the nearest expiration date to our target
            let nearest_expiration = match Requester::find_nearest_expiration(
                &expirations,
                &target_expiration_date_ny,
            ) {
                Some(nearest_expiration) => nearest_expiration,
                None => {
                    log::error!("Failed to find nearest expiration date");
                    return;
                }
            };

            log::info!("Using nearest expiration date: {:?}", nearest_expiration);

            // Query and log option chain data
            if let Err(err) = query_and_log_option_chain(
                &requester,
                &symbol_list,
                &nearest_expiration,
                &side,
                strike,
                underlying,
            )
            .await
            {
                log::error!("Error querying option chain: {}", err);
            }

            // Test earnings calendar
            let today_ny = Local::now().with_timezone(&New_York);
            let two_weeks_ny = today_ny + chrono::Duration::days(14);

            match requester
                .query_earnings_calendar("US", &today_ny, &two_weeks_ny)
                .await
            {
                Ok(entries) => {
                    let relevant: Vec<_> = entries
                        .iter()
                        .filter(|e| symbol_list.contains(&e.symbol.as_str()))
                        .collect();
                    log::info!(
                        "Earnings calendar: {} total, {} relevant to test symbols",
                        entries.len(),
                        relevant.len()
                    );
                    for entry in &relevant {
                        log::info!(
                            "  {} - Report: {} ({}) EPS: {:?}",
                            entry.symbol,
                            entry.report_date,
                            entry.report_time,
                            entry.expected_eps
                        );
                    }
                }
                Err(err) => {
                    log::error!("Failed to query earnings calendar: {}", err);
                }
            }
        }

        Commands::Backtest {
            symbols_file_path,
            from,
            to,
            config,
            period,
            output,
            earnings,
            calibrate_safety,
        } => {
            let from_date = match NaiveDate::parse_from_str(&from, "%Y-%m-%d") {
                Ok(d) => d,
                Err(e) => {
                    log::error!("Invalid --from date '{}': {}. Use YYYY-MM-DD.", from, e);
                    return;
                }
            };
            let to_date = match NaiveDate::parse_from_str(&to, "%Y-%m-%d") {
                Ok(d) => d,
                Err(e) => {
                    log::error!("Invalid --to date '{}': {}. Use YYYY-MM-DD.", to, e);
                    return;
                }
            };

            let symbols = match symbols::read_symbols_from_file(&symbols_file_path) {
                Ok(s) => s,
                Err(e) => {
                    log::error!("Failed to read symbols: {}", e);
                    return;
                }
            };
            let sectors = market_int_core::sectors::load_sectors(&symbols_file_path).unwrap_or_default();

            let earnings_by_symbol = match &earnings {
                Some(path) => match backtest::load_earnings(path) {
                    Ok(m) => {
                        log::info!("Loaded earnings for {} symbols from {}", m.len(), path);
                        m
                    }
                    Err(e) => {
                        log::error!(
                            "Failed to load earnings from '{}': {}. Running earnings-blind.",
                            path, e
                        );
                        std::collections::HashMap::new()
                    }
                },
                None => std::collections::HashMap::new(),
            };

            if calibrate_safety {
                log::info!(
                    "Running safety calibration: {} symbols, {} to {} (production-mirror, period 5)",
                    symbols.len(),
                    from_date,
                    to_date
                );
                let rows = backtest::run_safety_calibration(
                    &conn, &symbols, &sectors, &earnings_by_symbol, from_date, to_date,
                );
                println!("{}", backtest::print_safety_calibration(&rows));
                match backtest::write_calibration_csv(&output, &rows) {
                    Ok(_) => log::info!("Calibration CSV written to {}", output),
                    Err(e) => log::error!("Failed to write CSV: {}", e),
                }
                return;
            }

            let configs: Vec<backtest::BacktestConfig> = if config == "all" {
                backtest::BacktestConfig::all_presets()
                    .into_iter()
                    .map(|mut c| {
                        if let Some(p) = period {
                            c.period = p;
                        }
                        c
                    })
                    .collect()
            } else {
                match backtest::BacktestConfig::by_name(&config) {
                    Some(mut c) => {
                        if let Some(p) = period {
                            c.period = p;
                        }
                        vec![c]
                    }
                    None => {
                        log::error!(
                            "Unknown config '{}'. Available: {}",
                            config,
                            backtest::BacktestConfig::all_presets()
                                .iter()
                                .map(|c| c.name.as_str())
                                .collect::<Vec<_>>()
                                .join(", ")
                        );
                        return;
                    }
                }
            };

            log::info!(
                "Running backtest: {} configs, {} symbols, {} to {}",
                configs.len(),
                symbols.len(),
                from_date,
                to_date
            );

            let mut all_metrics = Vec::new();
            for cfg in &configs {
                log::info!("Running config: {}", cfg.name);
                let metrics = backtest::run_backtest(
                    cfg, &conn, &symbols, &sectors, &earnings_by_symbol, from_date, to_date,
                );
                println!("{}", backtest::format_metrics(&metrics));
                all_metrics.push(metrics);
            }

            match backtest::write_csv(&output, &all_metrics) {
                Ok(_) => log::info!("Results written to {}", output),
                Err(e) => log::error!("Failed to write CSV: {}", e),
            }
        }
        Commands::FetchEarnings { from, to, output } => {
            let from_date = match NaiveDate::parse_from_str(&from, "%Y-%m-%d") {
                Ok(d) => d,
                Err(e) => {
                    log::error!("Invalid --from date '{}': {}. Use YYYY-MM-DD.", from, e);
                    return;
                }
            };
            let to_date = match NaiveDate::parse_from_str(&to, "%Y-%m-%d") {
                Ok(d) => d,
                Err(e) => {
                    log::error!("Invalid --to date '{}': {}. Use YYYY-MM-DD.", to, e);
                    return;
                }
            };
            let mut requester = match tiger::api_caller::Requester::new().await {
                Some(r) => r,
                None => {
                    log::error!("Failed to initialize Tiger API requester");
                    return;
                }
            };
            match market_int_core::option::fetch_earnings_to_file(&mut requester, from_date, to_date, &output).await {
                Ok(n) => log::info!("Wrote {} earnings entries to {}", n, output),
                Err(e) => log::error!("Failed to fetch earnings: {}", e),
            }
        }
    }
}
