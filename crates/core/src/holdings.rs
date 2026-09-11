//! Holdings domain: open put positions the user sold, marked to market, with
//! the per-day pace rule that drives the buy-back decision
//! (docs/plans/2026-09-11-holdings/holdings-design.md).
//!
//! Pure math — no I/O, no serde (the webapp document layer owns JSON shapes;
//! timestamps serialize as RFC3339 strings there, matching the result-doc
//! precedent). The caller supplies "today" so every computation is
//! hermetically testable.

use chrono::{DateTime, Datelike, NaiveDate, Utc};

/// One open short-put position. `premium` is per share (contract = 100
/// shares); `contracts` is the multiplier count. serde: the webapp ledger
/// document round-trips these directly (chrono "serde" feature → RFC3339
/// timestamps, ISO dates).
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Holding {
    pub id: String,
    pub symbol: String,
    pub strike: f64,
    pub expiry: NaiveDate,
    pub premium: f64,
    pub contracts: u32,
    pub sold: NaiveDate,
    /// Latest Tiger mid mark; `None` until the first refresh succeeds.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mark: Option<Mark>,
}

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Mark {
    pub mid: f64,
    pub as_of: DateTime<Utc>,
}

/// The close decision for one holding, as rendered on the card.
/// `Option` fields are `None` exactly when no mark exists yet.
#[derive(Debug, Clone, PartialEq)]
pub struct HoldingView {
    pub pl_dollars: Option<f64>,
    pub pl_pct: Option<f64>,
    pub pace_per_day_dollars: Option<f64>,
    pub pace_per_day_pct: Option<f64>,
    pub days_elapsed: u32,
    pub days_total: u32,
    /// Linear pace target with a 1-day floor: a day-0 position has already
    /// "used" one day of theta, and a gap/IV-crush drop on sell day is a
    /// real close signal.
    pub target_pct: f64,
    /// Requires a mark — an unpriced position never flags.
    pub pace_met: bool,
}

/// Working days strictly after `from`, up to and including `to` (date-only,
/// weekdays only — holidays not modeled, same as market.rs). Inclusive `to`
/// is what makes expiry day count: sold Fri → expiry next Fri = 5.
pub fn working_days_after(from: NaiveDate, to: NaiveDate) -> u32 {
    let mut n = 0;
    let mut d = from;
    while d < to {
        d = d.succ_opt().unwrap_or_else(|| panic!("date overflow past {d}"));
        if d > to {
            break;
        }
        if !is_weekend(d) {
            n += 1;
        }
    }
    n
}

fn is_weekend(d: NaiveDate) -> bool {
    matches!(d.weekday(), chrono::Weekday::Sat | chrono::Weekday::Sun)
}

impl Holding {
    pub fn validate(&self) -> Result<(), String> {
        if self.symbol.trim().is_empty() {
            return Err("symbol is required".to_string());
        }
        if !(self.strike.is_finite() && self.strike > 0.0) {
            return Err("strike must be > 0".to_string());
        }
        if !(self.premium.is_finite() && self.premium > 0.0) {
            return Err("premium must be > 0".to_string());
        }
        if self.contracts == 0 {
            return Err("contracts must be at least 1".to_string());
        }
        if self.expiry <= self.sold {
            return Err("expiry must be after the sell date".to_string());
        }
        Ok(())
    }

    /// The close-decision view as of `today` (ET calendar date).
    pub fn view(&self, today: NaiveDate) -> HoldingView {
        let days_total = working_days_after(self.sold, self.expiry);
        let anchor = today.min(self.expiry);
        let days_elapsed = working_days_after(self.sold, anchor).min(days_total);
        // Day 0 earns a full day's target.
        let target_pct = if days_total > 0 {
            days_elapsed.max(1) as f64 / days_total as f64
        } else {
            0.0
        };

        let Some(mark) = &self.mark else {
            return HoldingView {
                pl_dollars: None,
                pl_pct: None,
                pace_per_day_dollars: None,
                pace_per_day_pct: None,
                days_elapsed,
                days_total,
                target_pct,
                pace_met: false,
            };
        };

        let pl_per_share = self.premium - mark.mid;
        let pl_dollars = pl_per_share * 100.0 * self.contracts as f64;
        let pl_pct = pl_per_share / self.premium;
        let (pace_per_day_dollars, pace_per_day_pct) = if days_elapsed > 0 {
            (
                Some(pl_dollars / days_elapsed as f64),
                Some(pl_pct / days_elapsed as f64),
            )
        } else {
            (None, None)
        };
        HoldingView {
            pl_dollars: Some(pl_dollars),
            pl_pct: Some(pl_pct),
            pace_per_day_dollars,
            pace_per_day_pct,
            days_elapsed,
            days_total,
            target_pct,
            pace_met: pl_pct >= target_pct,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn holding(sold: NaiveDate, expiry: NaiveDate, mark_mid: Option<f64>) -> Holding {
        Holding {
            id: "h1".to_string(),
            symbol: "GOOG".to_string(),
            strike: 350.0,
            expiry,
            premium: 1.0,
            contracts: 1,
            sold,
            mark: mark_mid.map(|mid| Mark {
                mid,
                as_of: Utc::now(),
            }),
        }
    }

    /// The design doc's reference example: sold Fri 2026-09-04, expiry Fri
    /// 2026-09-11, $1.00 → $0.50 mid, viewed Tue 2026-09-08 — 2 of 5
    /// working days elapsed, +50% vs target 40%, $50.00 to capture.
    #[test]
    fn reference_example_is_pace_met() {
        let h = holding(
            NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
            NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
            Some(0.5),
        );
        let v = h.view(NaiveDate::from_ymd_opt(2026, 9, 8).unwrap());
        assert_eq!(v.days_elapsed, 2);
        assert_eq!(v.days_total, 5);
        assert_eq!(v.target_pct, 0.4);
        assert_eq!(v.pl_pct, Some(0.5));
        assert_eq!(v.pl_dollars, Some(50.0));
        assert_eq!(v.pace_per_day_pct, Some(0.25));
        assert_eq!(v.pace_per_day_dollars, Some(25.0));
        assert!(v.pace_met);
    }

    /// Day 0 earns a full day's target (the 1-day floor): a put sold today
    /// with 4 working days to expiry targets 25%, not 0%.
    #[test]
    fn day_zero_uses_one_day_floor() {
        let today = NaiveDate::from_ymd_opt(2026, 9, 8).unwrap();
        let h = holding(today, NaiveDate::from_ymd_opt(2026, 9, 14).unwrap(), Some(0.6));
        let v = h.view(today);
        assert_eq!(v.days_elapsed, 0);
        assert_eq!(v.days_total, 4);
        assert_eq!(v.target_pct, 0.25);
        // +60% on day 0 is comfortably past the floor.
        assert!(v.pace_met);
        // Per-day pace is undefined with zero elapsed days.
        assert_eq!(v.pace_per_day_pct, None);
    }

    /// An unpriced position never flags and reports no P&L numbers.
    #[test]
    fn no_mark_never_flags() {
        let h = holding(
            NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
            NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
            None,
        );
        let v = h.view(NaiveDate::from_ymd_opt(2026, 9, 8).unwrap());
        assert!(!v.pace_met);
        assert_eq!(v.pl_dollars, None);
        assert_eq!(v.pl_pct, None);
        assert_eq!(v.days_elapsed, 2, "day math runs without a mark");
    }

    /// Today past expiry clamps elapsed to total (never negative or over).
    #[test]
    fn today_past_expiry_clamps_elapsed() {
        let h = holding(
            NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
            NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
            Some(0.1),
        );
        let v = h.view(NaiveDate::from_ymd_opt(2026, 9, 20).unwrap());
        assert_eq!(v.days_elapsed, 5);
        assert_eq!(v.days_total, 5);
        assert_eq!(v.target_pct, 1.0);
    }

    /// Weekend span: Fri → next Fri is 5 working days, not 7.
    #[test]
    fn weekend_not_counted() {
        let n = working_days_after(
            NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
            NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
        );
        assert_eq!(n, 5);
    }

    /// Multiplier: P&L dollars are per-contract (×100) × contract count.
    #[test]
    fn dollars_scale_with_contracts() {
        let mut h = holding(
            NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
            NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
            Some(0.5),
        );
        h.contracts = 3;
        let v = h.view(NaiveDate::from_ymd_opt(2026, 9, 8).unwrap());
        assert_eq!(v.pl_dollars, Some(150.0));
    }

    #[test]
    fn validation_rejects_bad_fields() {
        let mut h = holding(
            NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
            NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
            None,
        );
        h.validate().unwrap();

        h.strike = 0.0;
        assert!(h.validate().is_err());
        h.strike = 350.0;

        h.premium = -1.0;
        assert!(h.validate().is_err());
        h.premium = 1.0;

        h.contracts = 0;
        assert!(h.validate().is_err());
        h.contracts = 1;

        h.expiry = h.sold;
        assert!(h.validate().is_err(), "expiry must be after sell date");

        h.symbol = "  ".to_string();
        assert!(h.validate().is_err());
    }
}
