//! Transient experiment harnesses for the put-score max_drop-safety redesign.
//!
//! These are NOT characterization tests — they read `data/data.db` and print
//! reports. They are gated with `#[ignore]` so a normal `cargo test` run is
//! unaffected.
//!
//! Run explicitly:
//!   cargo test experiments -- --ignored --nocapture
//!
//! Remove this file (and its `mod experiments;` line in main.rs) after the
//! decisions in docs/plans/2026-07-03-put-score-max-drop-safety-decisions.md land.

#![cfg(test)]

use std::collections::HashSet;

use rusqlite::Connection;

use crate::{
    constants,
    maxdrop,
    model,
    regime,
    store::{candle, max_drop, sharpe_ratio},
};

const DB_PATH: &str = "data/data.db";
const P_LOW: f64 = 0.90; // current PERCENTILE
const P_HIGH: f64 = 0.97; // candidate

struct ChainRow {
    underlying: String,
    strike: f64,
    price: f64,
    dte: u32,
    rate_of_return: f64,
    strike_from: f64,
    strike_to: f64,
}

fn open_db() -> Option<Connection> {
    if !std::path::Path::new(DB_PATH).exists() {
        eprintln!("SKIP: {DB_PATH} not found");
        return None;
    }
    match Connection::open(DB_PATH) {
        Ok(c) => Some(c),
        Err(e) => {
            eprintln!("SKIP: cannot open {DB_PATH}: {e}");
            None
        }
    }
}

fn all_symbols(conn: &Connection) -> Vec<String> {
    let Ok(mut stmt) = conn.prepare("SELECT DISTINCT symbol FROM candle ORDER BY symbol") else {
        return Vec::new();
    };
    let Ok(rows) = stmt.query_map([], |row| row.get::<_, String>(0)) else {
        return Vec::new();
    };
    rows.filter_map(|r| r.ok()).collect()
}

fn load_latest_puts(conn: &Connection) -> Vec<ChainRow> {
    // option_strike.updated is stored as TEXT; MAX() works lexicographically.
    let sql = "SELECT o.underlying, o.strike, o.underlying_price, o.dte,
                      o.rate_of_return, o.strike_from, o.strike_to
               FROM option_strike o
               INNER JOIN (
                   SELECT underlying, MAX(updated) AS mu
                   FROM option_strike GROUP BY underlying
               ) m ON o.underlying = m.underlying AND o.updated = m.mu
               WHERE o.side = 'put'";
    let Ok(mut stmt) = conn.prepare(sql) else {
        return Vec::new();
    };
    let rows = stmt.query_map([], |row| {
        Ok(ChainRow {
            underlying: row.get(0)?,
            strike: row.get(1)?,
            price: row.get(2)?,
            dte: row.get::<_, i64>(3)? as u32,
            rate_of_return: row.get(4)?,
            strike_from: row.get(5)?,
            strike_to: row.get(6)?,
        })
    });
    let Ok(rows) = rows else { return Vec::new() };
    rows.filter_map(|r| r.ok()).collect()
}

fn quartiles(vals: &mut Vec<f64>) -> (f64, f64, f64) {
    if vals.is_empty() {
        return (f64::NAN, f64::NAN, f64::NAN);
    }
    vals.sort_by(|a, b| a.partial_cmp(b).unwrap());
    let q = |p: f64| -> f64 {
        let idx = p * (vals.len() - 1) as f64;
        let lo = idx.floor() as usize;
        let hi = idx.ceil() as usize;
        if lo == hi {
            vals[lo]
        } else {
            vals[lo] + (vals[hi] - vals[lo]) * (idx - lo as f64)
        }
    };
    (q(0.25), q(0.50), q(0.75))
}

/// Candidate "new design" scorer: band-position safety, no hard >MAX cap.
/// Mirrors calculate_put_score but replaces strike_percentile safety with
/// position in [strike_from, strike_to] and drops the upper rate-of-return cap.
fn score_new(
    sharpe: f64,
    strike: f64,
    strike_from: f64,
    strike_to: f64,
    rate_of_return: f64,
) -> Option<f64> {
    if rate_of_return < constants::MIN_RATE_OF_RETURN {
        return None;
    }
    if sharpe <= 0.0 {
        return None;
    }
    let band = (strike_to - strike_from).abs();
    // deep end (strike = strike_from) -> safety 1.0; shallow end (strike_to) -> 0.0
    let safety = if band < 1e-9 {
        0.5
    } else {
        ((strike_to - strike) / band).clamp(0.0, 1.0)
    };
    let sharpe_norm = (sharpe / 2.0).clamp(0.0, 1.0);
    let return_norm = (rate_of_return / constants::IDEAL_RETURN).min(1.0);
    Some(0.20 * sharpe_norm + 0.40 * safety + 0.40 * return_norm)
}

/// Why the CURRENT calculate_put_score would reject a chain (mirrors its
/// pre-filter order). None = accepted.
fn current_reject_reason(sharpe: f64, sp_20d: f64, rate: f64) -> Option<&'static str> {
    if rate > constants::MAX_RATE_OF_RETURN {
        Some("rate>MAX")
    } else if rate < constants::MIN_RATE_OF_RETURN {
        Some("rate<MIN")
    } else if sharpe <= 0.0 {
        Some("sharpe<=0")
    } else if sp_20d > constants::MAX_STRIKE_PERCENTILE {
        Some("sp>CAP")
    } else {
        None
    }
}

#[test]
#[ignore]
fn exp1_percentile_band_geometry() {
    let Some(conn) = open_db() else {
        return;
    };
    let symbols = all_symbols(&conn);

    println!(
        "\n========== EXP 1: percentile A/B (band geometry), {P_LOW} vs {P_HIGH}, {} symbols ==========",
        symbols.len()
    );

    for period in [5usize, 20] {
        let mut ratios: Vec<f64> = Vec::new();
        let mut width_low: Vec<f64> = Vec::new();
        let mut width_high: Vec<f64> = Vec::new();
        let mut narrow_low = 0u32; // width < 1% of price at P_LOW
        let mut narrow_high = 0u32; // ... at P_HIGH
        let mut narrow2_low = 0u32;
        let mut narrow2_high = 0u32;
        let mut inversions = 0u32; // pct < ema (band flips)
        let mut stored_mismatch = 0u32; // recomputed P_LOW vs stored max_drop_periods
        let mut samples: Vec<(String, f64, f64, f64)> = Vec::new(); // (sym, price, w_low, w_high)

        for sym in &symbols {
            let Ok(candles) = candle::get_candles(&conn, sym, constants::CANDLE_COUNT) else {
                continue;
            };
            if candles.len() < period + 1 {
                continue;
            }
            let price = candles.last().unwrap().close;

            let Some((p_low, e_low)) =
                maxdrop::compute_max_drop_stats_with_percentile(&candles, period, P_LOW)
            else {
                continue;
            };
            let Some((p_high, e_high)) =
                maxdrop::compute_max_drop_stats_with_percentile(&candles, period, P_HIGH)
            else {
                continue;
            };

            // sanity: compare recomputed P_LOW to what is stored (computed by production)
            if let Ok((sp, se)) = max_drop::get_max_drop(&conn, sym, period) {
                if (sp - p_low).abs() > 1e-6 || (se - e_low).abs() > 1e-6 {
                    stored_mismatch += 1;
                }
            }

            if p_low < e_low || p_high < e_high {
                inversions += 1;
            }
            let w_low = (p_low - e_low).abs();
            let w_high = (p_high - e_high).abs();
            if w_low > 1e-9 {
                ratios.push(w_high / w_low);
            }
            width_low.push(w_low);
            width_high.push(w_high);
            if w_low < 0.01 {
                narrow_low += 1;
            }
            if w_high < 0.01 {
                narrow_high += 1;
            }
            if w_low < 0.02 {
                narrow2_low += 1;
            }
            if w_high < 0.02 {
                narrow2_high += 1;
            }
            samples.push((sym.clone(), price, w_low, w_high));
        }

        let n = width_low.len();
        let mut r = ratios;
        let (q25, q50, q75) = quartiles(&mut r);
        let wl_med = quartiles(&mut width_low).1;
        let wh_med = quartiles(&mut width_high).1;

        println!("\n--- period {period} ({n} symbols with data) ---");
        println!(
            "  band-width ratio ({P_HIGH}/{P_LOW}) quartiles: p25={:.2}x  median={:.2}x  p75={:.2}x",
            q25, q50, q75
        );
        println!(
            "  median band width (as % of price, adj≈1): {P_LOW}={:.2}%  ->  {P_HIGH}={:.2}%",
            wl_med * 100.0,
            wh_med * 100.0
        );
        println!(
            "  symbols with band < 1% of price: {P_LOW}={}  ->  {P_HIGH}={}",
            narrow_low, narrow_high
        );
        println!(
            "  symbols with band < 2% of price: {P_LOW}={}  ->  {P_HIGH}={}",
            narrow2_low,
            narrow2_high
        );
        println!("  band inversions (pct<ema): {inversions}   |   stored-vs-recomputed mismatches: {stored_mismatch}");

        // 10 narrowest at P_LOW, with their P_HIGH width (sort by w_low ascending)
        samples.sort_by(|a, b| a.2.partial_cmp(&b.2).unwrap());
        println!("  10 narrowest bands at P_LOW={P_LOW}:");
        println!("    {:<8} {:>10} {:>14} {:>14}", "symbol", "price", "w@0.90(%)", "w@0.97(%)");
        for (sym, price, w_low, w_high) in samples.iter().take(10) {
            println!(
                "    {:<8} {:>10.2} {:>13.2}% {:>13.2}%",
                sym,
                price,
                w_low * 100.0,
                w_high * 100.0
            );
        }
    }
    println!("\n(Strike-count deltas need a live API re-query — geometry only here.)");
}

#[test]
#[ignore]
fn exp2_scoring_ab() {
    let Some(conn) = open_db() else {
        return;
    };
    let chains = load_latest_puts(&conn);
    let regime = regime::MarketRegime::from_spy_trend(1.05);

    println!(
        "\n========== EXP 2: scoring A/B (current vs new), {} put chains ==========",
        chains.len()
    );

    struct Scored {
        underlying: String,
        strike: f64,
        price: f64,
        dte: u32,
        rate: f64,
        current: Option<f64>,
        new: Option<f64>,
        reject: Option<&'static str>,
    }

    let mut scored: Vec<Scored> = Vec::new();
    for c in &chains {
        let sharpe = sharpe_ratio::get_sharpe_ratio(&conn, &c.underlying)
            .ok()
            .flatten()
            .unwrap_or(0.0);

        // 20-day range for the current arm's strike_percentile
        let sp_20d = match candle::get_candles(&conn, &c.underlying, constants::PRICE_PERCENTILE_DAYS) {
            Ok(cs) if !cs.is_empty() => {
                let min = cs.iter().map(|x| x.close).fold(f64::INFINITY, f64::min);
                let max = cs.iter().map(|x| x.close).fold(f64::NEG_INFINITY, f64::max);
                model::calculate_strike_percentile(c.strike, min, max)
            }
            _ => 0.5,
        };

        let reject = current_reject_reason(sharpe, sp_20d, c.rate_of_return);
        let current = model::calculate_put_score(sharpe, sp_20d, c.rate_of_return, 1.0, 1.0, &regime);
        let new = score_new(sharpe, c.strike, c.strike_from, c.strike_to, c.rate_of_return);

        scored.push(Scored {
            underlying: c.underlying.clone(),
            strike: c.strike,
            price: c.price,
            dte: c.dte,
            rate: c.rate_of_return,
            current,
            new,
            reject,
        });
    }

    // overall confusion breakdown
    let mut both = 0u32;
    let mut cur_only = 0u32; // current Some, new None
    let mut new_only = 0u32; // current None, new Some (recovered)
    let mut neither = 0u32;
    // recovery breakdown by current reject reason
    let mut rec_rate_max = 0u32;
    let mut rec_rate_min = 0u32;
    let mut rec_sharpe = 0u32;
    let mut rec_sp = 0u32;
    for s in &scored {
        match (s.current.is_some(), s.new.is_some()) {
            (true, true) => both += 1,
            (true, false) => cur_only += 1,
            (false, true) => {
                new_only += 1;
                match s.reject {
                    Some("rate>MAX") => rec_rate_max += 1,
                    Some("rate<MIN") => rec_rate_min += 1,
                    Some("sharpe<=0") => rec_sharpe += 1,
                    Some("sp>CAP") => rec_sp += 1,
                    _ => {}
                }
            }
            (false, false) => neither += 1,
        }
    }

    println!("\n--- overall acceptance matrix ---");
    println!("  both accept:    {both}");
    println!("  current only:   {cur_only}  (new rejects — sharpe<=0 or rate<MIN)");
    println!("  RECOVERED (new only): {new_only}");
    println!("     of which current rejected for: rate>MAX={rec_rate_max}  rate<MIN={rec_rate_min}  sharpe<=0={rec_sharpe}  sp>CAP={rec_sp}");
    println!("  neither:        {neither}");

    // per-timeframe top-3
    for (label, is_short) in [("short (~5d)", true), ("medium (~20d)", false)] {
        let bucket: Vec<&Scored> = scored
            .iter()
            .filter(|s| (s.dte <= 7) == is_short)
            .collect();
        if bucket.is_empty() {
            continue;
        }

        let pick_top3 = |key: fn(&Scored) -> Option<f64>| -> Vec<(&str, f64, f64, f64)> {
            let mut filtered: Vec<&Scored> = bucket.iter().copied().filter(|s| key(s).is_some()).collect();
            filtered.sort_by(|a, b| {
                key(b)
                    .unwrap()
                    .partial_cmp(&key(a).unwrap())
                    .unwrap()
            });
            let mut seen: HashSet<&str> = HashSet::new();
            let mut out = Vec::new();
            for s in filtered {
                if seen.insert(s.underlying.as_str()) {
                    out.push((s.underlying.as_str(), s.strike, s.rate, key(s).unwrap()));
                    if out.len() >= 3 {
                        break;
                    }
                }
            }
            out
        };

        let cur3 = pick_top3(|s| s.current);
        let new3 = pick_top3(|s| s.new);

        let mut cur_scores: Vec<f64> = bucket.iter().filter_map(|s| s.current).collect();
        let mut new_scores: Vec<f64> = bucket.iter().filter_map(|s| s.new).collect();
        let (cl, cm, ch) = quartiles(&mut cur_scores);
        let (nl, nm, nh) = quartiles(&mut new_scores);

        println!("\n--- timeframe: {label} ({} chains) ---", bucket.len());
        println!("  score quartiles  current: q25={:.3} med={:.3} q75={:.3}", cl, cm, ch);
        println!("  score quartiles  new:     q25={:.3} med={:.3} q75={:.3}", nl, nm, nh);
        println!("  TOP-3 CURRENT: {}", fmt_picks(&cur3));
        println!("  TOP-3 NEW:     {}", fmt_picks(&new3));
    }
    println!("\n(Selection uses unique-underlying only; sector-diversity rule omitted for this A/B.)");
}

fn fmt_picks(picks: &[(&str, f64, f64, f64)]) -> String {
    if picks.is_empty() {
        return "(none)".to_string();
    }
    picks
        .iter()
        .map(|(sym, strike, rate, score)| format!("{sym}${strike:.0}P r={rate:.2} s={score:.3}"))
        .collect::<Vec<_>>()
        .join("  |  ")
}
