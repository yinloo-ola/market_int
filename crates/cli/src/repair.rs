// Stock-repair analyzer: prices a long-call / n-short-call overlay on an
// owned 100-share lot against a live Tiger chain. Explicit `--sell` legs
// print a payoff table; `--scan` enumerates short-strike ratios to hunt
// for the optimal repair of a given cost basis.

use std::collections::{BTreeMap, BTreeSet};

use chrono::Local;

use market_int_core::model::{OptionChainSide, OptionStrikeCandle};
use market_int_core::tiger::api_caller::Requester;

// ---------- pure payoff math ----------

/// One overlay structure: 100 shares + 1 long call + short call legs.
pub struct Structure {
    pub spot: f64,
    pub bought: f64,
    pub buy_strike: f64,
    pub buy_mid: f64,
    /// (strike, qty, mid) per short leg.
    pub sell_legs: Vec<(f64, u32, f64)>,
}

impl Structure {
    /// Net premium per share: positive = credit collected, negative = debit paid.
    pub fn net_per_share(&self) -> f64 {
        self.sell_legs.iter().map(|(_, q, m)| f64::from(*q) * m).sum::<f64>() - self.buy_mid
    }

    fn sell_qty_total(&self) -> u32 {
        self.sell_legs.iter().map(|(_, q, _)| q).sum()
    }

    fn highest_strike(&self) -> f64 {
        self.sell_legs
            .iter()
            .map(|(k, _, _)| *k)
            .chain(std::iter::once(self.buy_strike))
            .fold(f64::NEG_INFINITY, f64::max)
    }

    /// Options P&L per share at expiry price `p`.
    pub fn options_pnl(&self, p: f64) -> f64 {
        let mut v = (p - self.buy_strike).max(0.0) - self.buy_mid;
        for (k, q, m) in &self.sell_legs {
            v -= (p - *k).max(0.0) * f64::from(*q);
            v += m * f64::from(*q);
        }
        v
    }

    /// Whole position P&L in dollars at expiry (100 shares + the overlay).
    pub fn total_pnl(&self, p: f64) -> f64 {
        100.0 * (p - self.spot + self.options_pnl(p))
    }

    /// Unrealized hole being repaired, in dollars.
    pub fn hole(&self) -> f64 {
        (self.bought - self.spot).max(0.0) * 100.0
    }

    /// Total-P&L slope per $1 of WMT above every strike: shares +1, long
    /// call +1, each short −1 (per share). 0 ⇒ capped payoff; <0 ⇒ the
    /// short quantity exceeds what shares + the long call cover (naked).
    pub fn slope_above(&self) -> f64 {
        2.0 - f64::from(self.sell_qty_total())
    }

    /// Expiry prices where the position P&L crosses zero — exact roots of
    /// the piecewise-linear payoff between strike kinks.
    pub fn breakevens(&self) -> Vec<f64> {
        let mut kinks: Vec<f64> = vec![self.spot, self.buy_strike];
        kinks.extend(self.sell_legs.iter().map(|(k, _, _)| *k));
        kinks.sort_by(|a, b| a.partial_cmp(b).unwrap());
        kinks.dedup();

        let mut roots = Vec::new();
        let (mut prev_p, mut prev_v) = (0.0f64, self.total_pnl(0.0));
        for k in kinks.into_iter().chain(std::iter::once(self.highest_strike() + 50.0)) {
            let v = self.total_pnl(k);
            if prev_v == 0.0 {
                roots.push(prev_p);
            } else if (prev_v < 0.0) != (v < 0.0) {
                roots.push(prev_p + prev_v / (prev_v - v) * (k - prev_p));
            }
            prev_p = k;
            prev_v = v;
        }
        roots.sort_by(|a, b| a.partial_cmp(b).unwrap());
        roots.dedup();
        roots
    }

    /// (cap label, capped total P&L in dollars) — NaN total when not capped.
    pub fn cap_summary(&self) -> (String, f64) {
        let k = self.highest_strike();
        match self.slope_above() {
            s if s > 0.0 => (
                format!("no cap (payoff keeps rising above ${k:.2})"),
                f64::NAN,
            ),
            s if s < 0.0 => (format!("NAKED: loss grows above ${k:.2}"), f64::NAN),
            _ => ("capped".to_string(), self.total_pnl(k + 1.0)),
        }
    }

    /// Prices worth tabulating: spot anchors, strike kinks, breakevens, and
    /// one row past the cap.
    pub fn table_prices(&self) -> Vec<f64> {
        let mut cents: BTreeSet<i64> = BTreeSet::new();
        let mut push = |p: f64| {
            cents.insert((p * 100.0).round() as i64);
        };
        for f in [0.90, 0.95, 1.00, 1.05, 1.10, 1.15, 1.20] {
            push(self.spot * f);
        }
        push(self.buy_strike);
        for (k, _, _) in &self.sell_legs {
            push(*k);
        }
        for b in self.breakevens() {
            push(b);
        }
        push(self.highest_strike() + 5.0);
        cents.into_iter().map(|c| c as f64 / 100.0).collect()
    }
}

/// Parse `STRIKE:QTY` sell specs, merging repeated strikes.
pub fn parse_sell_legs(specs: &[String]) -> Result<Vec<(f64, u32)>, String> {
    let mut legs: BTreeMap<u64, u32> = BTreeMap::new();
    for s in specs {
        let (k, q) = s
            .split_once(':')
            .ok_or_else(|| format!("--sell {s:?} must be STRIKE:QTY, e.g. 115:2"))?;
        let k: f64 = k.trim().parse().map_err(|_| format!("bad strike in --sell {s:?}"))?;
        let q: u32 = q.trim().parse().map_err(|_| format!("bad qty in --sell {s:?}"))?;
        if q == 0 {
            return Err(format!("--sell {s:?}: qty must be ≥ 1"));
        }
        *legs.entry((k * 100.0).round() as u64).or_insert(0) += q;
    }
    Ok(legs.into_iter().map(|(c, q)| (c as f64 / 100.0, q)).collect())
}

// ---------- output helpers ----------

/// Signed dollars with thousands separators: `+$1,958` / `-$116`.
fn usd(v: f64) -> String {
    if v.is_nan() {
        return "—".to_string();
    }
    let cents = (v * 100.0).round() as i64;
    let sign = if cents < 0 { '-' } else { '+' };
    let n = cents.unsigned_abs();
    let whole = (n / 100).to_string();
    let mut grouped = String::new();
    for (i, ch) in whole.chars().enumerate() {
        if i > 0 && (whole.len() - i) % 3 == 0 {
            grouped.push(',');
        }
        grouped.push(ch);
    }
    format!("{sign}${grouped}.{:02}", n % 100)
}

fn leg_line(prefix: &str, qty: u32, k: f64, row: &OptionStrikeCandle) -> String {
    format!(
        "{prefix} {qty}×{k:.0}C  mid {:.2}  (bid {:.2} / ask {:.2}, oi {}, iv {:.1}%)",
        row.mid,
        row.bid,
        row.ask,
        row.open_interest,
        row.implied_vol.unwrap_or(0.0) * 100.0
    )
}

fn repair_pct_label(st: &Structure, cap_value: f64) -> String {
    let hole = st.hole();
    if hole <= 0.0 {
        return "n/a (no loss to repair)".to_string();
    }
    if cap_value.is_nan() {
        return "—".to_string();
    }
    format!("{:.0}% of hole", cap_value / hole * 100.0)
}

fn print_structure(
    symbol: &str,
    st: &Structure,
    rows: &BTreeMap<u64, OptionStrikeCandle>,
    csv: bool,
) {
    let row_of = |k: f64| &rows[&((k * 100.0).round() as u64)];
    let (cap_label, cap_value) = st.cap_summary();
    let be: Vec<String> = st.breakevens().iter().map(|b| format!("${b:.2}")).collect();
    let net = st.net_per_share() * 100.0;

    if csv {
        println!("wmt_at_expiry,stock_pnl,options_pnl,total_pnl");
        for p in st.table_prices() {
            println!(
                "{p:.2},{:.2},{:.2},{:.2}",
                100.0 * (p - st.spot),
                100.0 * st.options_pnl(p),
                st.total_pnl(p)
            );
        }
        return;
    }

    println!(
        "### {symbol} repair — spot {:.2} · basis {:.2} · hole {}",
        st.spot,
        st.bought,
        usd(st.hole())
    );
    println!("BUY  {}", leg_line("", 1, st.buy_strike, row_of(st.buy_strike)));
    for (k, q, _) in &st.sell_legs {
        println!("SELL {}", leg_line("", *q, *k, row_of(*k)));
    }
    let net_word = if net < 0.0 { "debit" } else { "credit" };
    println!(
        "Net: {} ({:.2}/sh {}) · breakeven {} · {} → {} ({})",
        usd(net),
        st.net_per_share().abs(),
        net_word,
        be.join(" / "),
        cap_label,
        usd(cap_value),
        repair_pct_label(st, cap_value)
    );
    println!();
    println!("| WMT at expiry | Stock P&L | Options P&L | Total P&L |");
    println!("|---:|---:|---:|---:|");
    for p in st.table_prices() {
        println!(
            "| ${p:.2} | {} | {} | **{}** |",
            usd(100.0 * (p - st.spot)),
            usd(100.0 * st.options_pnl(p)),
            usd(st.total_pnl(p))
        );
    }
}

fn print_scan(
    symbol: &str,
    spot: f64,
    bought: f64,
    buy: f64,
    buy_row: &OptionStrikeCandle,
    rows: &BTreeMap<u64, OptionStrikeCandle>,
    qtys: &[u32],
    min_oi: u32,
    csv: bool,
) {
    if csv {
        println!("sell_strike,qty,net_usd,breakeven,cap_above,capped_total_usd,repairs,flag");
    } else {
        println!(
            "### {symbol} repair scan — spot {spot:.2} · basis {bought:.2} · hole {} · BUY 1×{buy:.0}C mid {:.2}",
            usd((bought - spot).max(0.0) * 100.0),
            buy_row.mid
        );
        println!("| Sell strike | Qty | Net | Breakeven | Cap above | Capped total | Repairs | Flag |");
        println!("|---:|---:|---:|---:|---:|---:|---:|---|");
    }
    for row in rows.values() {
        if row.strike == buy || row.open_interest < min_oi {
            continue;
        }
        for &q in qtys {
            let st = Structure {
                spot,
                bought,
                buy_strike: buy,
                buy_mid: buy_row.mid,
                sell_legs: vec![(row.strike, q, row.mid)],
            };
            let (cap_label, cap_value) = st.cap_summary();
            let naked = cap_label.starts_with("NAKED");
            let nocap = cap_label.starts_with("no cap");
            let flag = if naked {
                "NAKED"
            } else if nocap {
                "no cap"
            } else {
                ""
            };
            let be: Vec<String> = st.breakevens().iter().map(|b| format!("{b:.2}")).collect();
            let repair = repair_pct_label(&st, cap_value);
            let cap_price = if cap_value.is_nan() {
                "—".to_string()
            } else {
                format!("${:.2}", row.strike)
            };
            if csv {
                println!(
                    "{:.1},{q},{:.2},\"{}\",\"{}\",\"{}\",\"{}\",{flag}",
                    row.strike,
                    st.net_per_share() * 100.0,
                    be.join(" / "),
                    cap_price,
                    cap_value,
                    repair,
                );
            } else {
                println!(
                    "| {:.1} | {q} | {} | ${} | {} | {} | {} | {flag} |",
                    row.strike,
                    usd(st.net_per_share() * 100.0),
                    be.join(" / $"),
                    cap_price,
                    usd(cap_value),
                    repair,
                );
            }
        }
    }
}

// ---------- entry point ----------

pub struct RepairArgs {
    pub symbol: String,
    pub bought: f64,
    pub expiry: String,
    pub buy: f64,
    pub sells: Vec<String>,
    pub scan: bool,
    pub sell_qtys: Vec<u32>,
    pub min_oi: u32,
    pub csv: bool,
}

fn missing_strike_msg(symbol: &str, k: f64, rows: &BTreeMap<u64, OptionStrikeCandle>) -> String {
    let listed: Vec<String> = rows.values().map(|r| format!("{:.1}", r.strike)).collect();
    format!("{symbol} {k}C not in returned chain — listed strikes: {}", listed.join(" "))
}

pub async fn run(args: RepairArgs) -> Result<(), Box<dyn std::error::Error>> {
    if !args.sells.is_empty() && args.scan {
        return Err("use either explicit --sell legs or --scan, not both".into());
    }
    if args.sells.is_empty() && !args.scan {
        return Err("provide --sell STRIKE:QTY (repeatable) or --scan".into());
    }
    if args.scan && args.sell_qtys.is_empty() {
        return Err("--scan needs --sell-qtys (e.g. 1,2,3)".into());
    }

    let symbol = args.symbol.split(',').next().unwrap_or("").trim().to_string();
    if symbol.is_empty() {
        return Err("no symbol given".into());
    }

    let mut requester = Requester::new()
        .await
        .ok_or("failed to initialize Tiger requester")?;
    let now = Local::now();
    let candles = requester.query_stock_quotes(&[&symbol], &now, 1, "day").await?;
    let spot = candles
        .last()
        .map(|c| c.close)
        .ok_or_else(|| format!("no candles returned for {symbol}"))?;
    log::info!("{symbol} underlying last close: {spot}");

    let target = crate::parse_expiry_target(&args.expiry)
        .ok_or_else(|| format!("invalid --expiry {:?} (want YYYY-MM-DD)", args.expiry))?;
    let expirations = requester.option_expiration(&[&symbol]).await?;
    let expiry = Requester::find_nearest_expiration(&expirations, &target)
        .ok_or("no listed expirations returned")?;
    log::info!("resolved expiry {expiry:?}");

    // Chain band: cover the legs (or the scan range) with margin on both sides.
    let sell_strikes: Vec<f64> = if args.scan {
        vec![]
    } else {
        parse_sell_legs(&args.sells)?.into_iter().map(|(k, _)| k).collect()
    };
    let lo = sell_strikes
        .iter()
        .chain(std::iter::once(&args.buy))
        .chain(std::iter::once(&spot))
        .fold(f64::INFINITY, |a, &b| a.min(b))
        - 10.0;
    let hi = if args.scan {
        (args.buy + 25.0).max(spot * 1.30)
    } else {
        sell_strikes
            .iter()
            .chain(std::iter::once(&args.buy))
            .fold(f64::NEG_INFINITY, |a, &b| a.max(b))
            + 10.0
    };

    let mut underlying_prices = std::collections::HashMap::new();
    underlying_prices.insert(symbol.clone(), spot);
    let chain = requester
        .query_option_chain(
            &[(symbol.as_str(), (lo, hi))],
            &underlying_prices,
            &expiry,
            0,
            &OptionChainSide::Call,
        )
        .await?;
    log::info!("chain returned {} row(s)", chain.len());
    let mut rows: BTreeMap<u64, OptionStrikeCandle> = BTreeMap::new();
    for r in chain {
        rows.insert((r.strike * 100.0).round() as u64, r);
    }

    let buy_row = rows
        .get(&((args.buy * 100.0).round() as u64))
        .ok_or_else(|| missing_strike_msg(&symbol, args.buy, &rows))?;

    if args.scan {
        print_scan(
            &symbol,
            spot,
            args.bought,
            args.buy,
            buy_row,
            &rows,
            &args.sell_qtys,
            args.min_oi,
            args.csv,
        );
    } else {
        let mut sell_legs = Vec::new();
        for (k, q) in parse_sell_legs(&args.sells)? {
            let row = rows
                .get(&((k * 100.0).round() as u64))
                .ok_or_else(|| missing_strike_msg(&symbol, k, &rows))?;
            sell_legs.push((k, q, row.mid));
        }
        let st = Structure {
            spot,
            bought: args.bought,
            buy_strike: args.buy,
            buy_mid: buy_row.mid,
            sell_legs,
        };
        print_structure(&symbol, &st, &rows, args.csv);
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn canonical() -> Structure {
        Structure {
            spot: 104.26,
            bought: 125.0,
            buy_strike: 105.0,
            buy_mid: 6.20,
            sell_legs: vec![(115.0, 2, 2.52)],
        }
    }

    #[test]
    fn canonical_repair_payoffs() {
        let s = canonical();
        assert!((s.options_pnl(110.0) - 3.84).abs() < 1e-9);
        assert!((s.total_pnl(110.0) - 958.0).abs() < 1e-6);
        assert!((s.total_pnl(115.0) - 1958.0).abs() < 1e-6);
        assert!((s.total_pnl(125.0) - 1958.0).abs() < 1e-6); // capped
        assert!((s.total_pnl(95.0) + 1042.0).abs() < 1e-6);
    }

    #[test]
    fn net_and_slope() {
        let s = canonical();
        assert!((s.net_per_share() + 1.16).abs() < 1e-9);
        assert_eq!(s.slope_above(), 0.0);
        assert!((s.hole() - 2074.0).abs() < 1e-9);
    }

    #[test]
    fn breakeven_lands_in_doubled_zone() {
        let s = canonical();
        let be = s.breakevens();
        assert_eq!(be.len(), 1);
        assert!((be[0] - 105.21).abs() < 1e-6);
    }

    #[test]
    fn credit_variant_caps_lower() {
        let s = Structure {
            spot: 104.26,
            bought: 125.0,
            buy_strike: 105.0,
            buy_mid: 6.20,
            sell_legs: vec![(110.0, 2, 4.05)],
        };
        assert!((s.net_per_share() - 1.90).abs() < 1e-9);
        assert!((s.total_pnl(120.0) - 1264.0).abs() < 1e-6);
        let be = s.breakevens();
        assert!((be[0] - 102.36).abs() < 1e-6);
    }

    #[test]
    fn three_shorts_are_naked() {
        let mut s = canonical();
        s.sell_legs[0].1 = 3;
        assert!(s.slope_above() < 0.0);
        let (label, v) = s.cap_summary();
        assert!(label.contains("NAKED"));
        assert!(v.is_nan());
    }

    #[test]
    fn single_short_has_no_cap() {
        let mut s = canonical();
        s.sell_legs[0].1 = 1;
        let (label, v) = s.cap_summary();
        assert!(label.contains("no cap"));
        assert!(v.is_nan());
    }

    #[test]
    fn sell_legs_parse_and_merge() {
        let legs = parse_sell_legs(&["115:2".into(), "110:1".into(), "115:1".into()]).unwrap();
        assert_eq!(legs, vec![(110.0, 1), (115.0, 3)]);
        assert!(parse_sell_legs(&["115".into()]).is_err());
        assert!(parse_sell_legs(&["115:x".into()]).is_err());
    }

    #[test]
    fn usd_formats_groups_and_signs() {
        assert_eq!(usd(1958.0), "+$1,958.00");
        assert_eq!(usd(-116.0), "-$116.00");
        assert_eq!(usd(0.0), "+$0.00");
        assert_eq!(usd(f64::NAN), "—");
    }
}
