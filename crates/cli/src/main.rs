// CLI entrypoint: argument parsing and dispatch. All domain work lives in
// `market_int_core`; this crate owns only the Telegram publish half
// (publish.rs) and the backtest simulation (backtest.rs).
mod backtest;
mod publish;
mod repair;

use chrono::NaiveDate;
use chrono::{Datelike, Local};
use chrono_tz::America::New_York;
use clap::{Parser, Subcommand};
use dotenv::dotenv;

use market_int_core::model::OptionChainSide;
use market_int_core::option::ExpiryTimeframe;
use market_int_core::tiger::api_caller::Requester;
use market_int_core::{constants, model, quotes, sectors, store, symbols, tiger};

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

// Explicit --expiry probe target: YYYY-MM-DD at 16:00 New York. None when the
// date is malformed or the 16:00 time is missing/ambiguous (DST transition).
fn parse_expiry_target(date: &str) -> Option<chrono::DateTime<chrono_tz::Tz>> {
    let day = NaiveDate::parse_from_str(date, "%Y-%m-%d").ok()?;
    let naive = day.and_hms_opt(16, 0, 0)?;
    naive.and_local_timezone(New_York).single()
}

// Helper function to query option chain and log the results
async fn query_and_log_option_chain(
    requester: &Requester,
    symbol_list: &[&str],
    expiration_date_ny: &chrono::DateTime<chrono_tz::Tz>,
    side: &OptionChainSide,
    strike: Option<f64>,
    strike_to: Option<f64>,
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
    // shape (OI minimum 0 there, too); --strike-to widens it into a band.
    // The legacy band stays the example.
    let (min_strike, max_strike) = strike.map_or((225.0, 235.0), |s| (s, strike_to.unwrap_or(s)));

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
            if strike.is_some() {
                0
            } else {
                constants::MIN_OPEN_INTEREST
            },
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
        /// With --strike, probe the full band (strike, strike_to) instead of
        /// the degenerate (strike, strike) shape.
        #[arg(long)]
        strike_to: Option<f64>,
        /// Probe this listed expiry (YYYY-MM-DD) instead of the
        /// next-Friday+7 default — snapped to the nearest listed date.
        #[arg(long)]
        expiry: Option<String>,
        /// Underlying last close attached to the rows. With a --strike
        /// probe this is fetched from Tiger quotes when omitted — the
        /// production refresh always sends the real close.
        #[arg(long)]
        underlying: Option<f64>,
    },
    // Stock-repair analyzer: payoff table for explicit legs, or a
    // short-strike ratio scan, against a live Tiger chain.
    Repair {
        /// Symbol to analyze (first of a comma list).
        symbols: String,
        /// Share lot's bought price (cost basis).
        #[arg(long)]
        bought: f64,
        /// Expiry to probe (YYYY-MM-DD) — snapped to the nearest listed date.
        #[arg(long)]
        expiry: String,
        /// Long call strike (buy 1 contract).
        #[arg(long)]
        buy: f64,
        /// Short leg as STRIKE:QTY (e.g. 115:2). Repeatable; repeated
        /// strikes merge. Omit when using --scan.
        #[arg(long = "sell")]
        sells: Vec<String>,
        /// Enumerate short strikes × quantities instead of explicit legs.
        #[arg(long)]
        scan: bool,
        /// Quantities tried per short strike in --scan (comma list).
        #[arg(long, default_value = "1,2,3")]
        sell_qtys: String,
        /// --scan skips short strikes with open interest below this.
        #[arg(long, default_value_t = 50)]
        min_oi: u32,
        /// Emit CSV instead of markdown.
        #[arg(long, default_value_t = false)]
        csv: bool,
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
    // Run-up → breach quintile backtest (research, 2026-11): does a large
    // short-term run-up raise the probability that the forward 5-day min-low
    // breaches put-strike lines? Read-only; no production scoring change.
    BacktestRunup {
        symbols_file_path: String,
        /// Number of run-up buckets (5 = quintiles, 10 = deciles for a
        /// dose-response curve).
        #[arg(long, default_value_t = 5)]
        buckets: usize,
        /// Start date (YYYY-MM-DD, inclusive) — train/validate split lever.
        #[arg(long)]
        from: Option<String>,
        /// End date (YYYY-MM-DD, inclusive).
        #[arg(long)]
        to: Option<String>,
        /// Research override: stretch floor (default constants::RUNUP_STRETCH_FLOOR).
        #[arg(long)]
        floor: Option<f64>,
        /// Research override: stretch slope.
        #[arg(long)]
        slope: Option<f64>,
        /// Research override: stretch cap.
        #[arg(long)]
        cap: Option<f64>,
        /// Condition window in trading days (default 5 = the Short horizon;
        /// pass 20 to measure the Medium-horizon dose-response).
        #[arg(long, default_value_t = 5)]
        condition_days: usize,
        /// Outcome window in trading days (default 5; pass 20 to match).
        #[arg(long, default_value_t = 5)]
        horizon_days: usize,
        /// Grid-search floor×slope×cap (ranked by worst-bucket band-top P&L)
        /// instead of printing one table. Ignores --floor/--slope/--cap.
        #[arg(long, default_value_t = false)]
        grid: bool,
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
            let _ =
                market_int_core::pipeline::perform_all(&mut conn, &symbols_file_path, opts).await;
        }

        Commands::PublishOptionChain { symbols_file_path } => {
            let sectors = sectors::load_sectors("data/symbols.csv").unwrap_or_default();
            let regime = market_int_core::regime::MarketRegime::from_spy_trend(1.05);
            match publish::publish_option_chains(&symbols_file_path, conn, 5, &regime, &sectors)
                .await
            {
                Ok(_) => log::info!("Successfully published option chains"),
                Err(err) => log::error!("Error publishing option chains: {}", err),
            }
        }

        Commands::TestTiger {
            symbols,
            side,
            strike,
            strike_to,
            expiry,
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
            // Calculate target expiration date — an explicit --expiry wins;
            // otherwise next Friday + 7.
            let target_expiration_date_ny = match expiry.as_deref() {
                Some(date) => match parse_expiry_target(date) {
                    Some(target) => target,
                    None => {
                        log::error!(
                            "invalid --expiry {date:?} (want YYYY-MM-DD, unambiguous 16:00 New York)"
                        );
                        return;
                    }
                },
                None => calculate_target_expiration_date(),
            };

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
                strike_to,
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

        Commands::Repair {
            symbols,
            bought,
            expiry,
            buy,
            sells,
            scan,
            sell_qtys,
            min_oi,
            csv,
        } => {
            let qtys: Vec<u32> = sell_qtys
                .split(',')
                .filter_map(|q| q.trim().parse().ok())
                .collect();
            let args = repair::RepairArgs {
                symbol: symbols,
                bought,
                expiry,
                buy,
                sells,
                scan,
                sell_qtys: qtys,
                min_oi,
                csv,
            };
            if let Err(err) = repair::run(args).await {
                log::error!("repair: {err}");
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
            let sectors =
                market_int_core::sectors::load_sectors(&symbols_file_path).unwrap_or_default();

            let earnings_by_symbol = match &earnings {
                Some(path) => match backtest::load_earnings(path) {
                    Ok(m) => {
                        log::info!("Loaded earnings for {} symbols from {}", m.len(), path);
                        m
                    }
                    Err(e) => {
                        log::error!(
                            "Failed to load earnings from '{}': {}. Running earnings-blind.",
                            path,
                            e
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
                    &conn,
                    &symbols,
                    &sectors,
                    &earnings_by_symbol,
                    from_date,
                    to_date,
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
                    cfg,
                    &conn,
                    &symbols,
                    &sectors,
                    &earnings_by_symbol,
                    from_date,
                    to_date,
                );
                println!("{}", backtest::format_metrics(&metrics));
                all_metrics.push(metrics);
            }

            match backtest::write_csv(&output, &all_metrics) {
                Ok(_) => log::info!("Results written to {}", output),
                Err(e) => log::error!("Failed to write CSV: {}", e),
            }
        }
        Commands::BacktestRunup {
            symbols_file_path,
            buckets,
            from,
            to,
            floor,
            slope,
            cap,
            condition_days,
            horizon_days,
            grid,
        } => {
            let parse_date = |label: &str, s: &Option<String>| -> Option<chrono::NaiveDate> {
                s.as_ref().and_then(|s| match chrono::NaiveDate::parse_from_str(s, "%Y-%m-%d") {
                    Ok(d) => Some(d),
                    Err(e) => {
                        log::error!("Invalid --{} date '{}': {}", label, s, e);
                        None
                    }
                })
            };
            let from_date = parse_date("from", &from);
            let to_date = parse_date("to", &to);
            let (from_ts, to_ts) = (
                from_date.map(|d| d.and_hms_opt(0, 0, 0).unwrap().and_utc().timestamp() as u32),
                to_date.map(|d| d.and_hms_opt(23, 59, 59).unwrap().and_utc().timestamp() as u32),
            );
            let symbols = match symbols::read_symbols_from_file(&symbols_file_path) {
                Ok(s) => s,
                Err(e) => {
                    log::error!("Failed to read symbols: {}", e);
                    return;
                }
            };
            let candles_map = backtest::load_all_candles(&conn, &symbols);
            let params = runup::RunupParams {
                quintiles: buckets,
                condition_days,
                horizon_days,
                ..runup::RunupParams::default()
            };
            let mut series = Vec::new();
            let mut symbols_used = 0usize;
            for (symbol, candles) in &candles_map {
                let points = runup::extract_runup_series(candles, &params);
                if points.is_empty() {
                    log::warn!("No eligible observations for {}", symbol);
                    continue;
                }
                symbols_used += 1;
                series.extend(runup::filter_observations(&points, from_ts, to_ts));
            }
            if series.is_empty() {
                log::error!("No observations across {} symbols — run pull-quotes first?", symbols.len());
                return;
            }
            log::info!(
                "{} observations from {} symbols ({} in universe)",
                series.len(),
                symbols_used,
                symbols.len()
            );
            if grid {
                let results = runup::grid_search(&series, &params, &runup::default_grid());
                println!("{}", runup::print_grid(&results));
            } else {
                let cfg = if condition_days >= 20 {
                    runup::StretchConfig {
                        floor: floor.unwrap_or(constants::RUNUP_20D_STRETCH_FLOOR),
                        slope: slope.unwrap_or(constants::RUNUP_20D_STRETCH_SLOPE),
                        cap: cap.unwrap_or(constants::RUNUP_20D_STRETCH_CAP),
                    }
                } else {
                    runup::StretchConfig {
                        floor: floor.unwrap_or(constants::RUNUP_STRETCH_FLOOR),
                        slope: slope.unwrap_or(constants::RUNUP_STRETCH_SLOPE),
                        cap: cap.unwrap_or(constants::RUNUP_STRETCH_CAP),
                    }
                };
                let table = runup::breach_table_for_stretch(&series, &params, &cfg);
                println!("{}", runup::print_breach_table(&table, symbols_used, &params));
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
            match market_int_core::option::fetch_earnings_to_file(
                &mut requester,
                from_date,
                to_date,
                &output,
            )
            .await
            {
                Ok(n) => log::info!("Wrote {} earnings entries to {}", n, output),
                Err(e) => log::error!("Failed to fetch earnings: {}", e),
            }
        }
    }
}

mod runup;
