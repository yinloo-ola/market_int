//! Holdings domain: open put positions the user sold, marked to market, with
//! the per-day pace rule that drives the buy-back decision
//! (docs/plans/2026-09-11-holdings/holdings-design.md).
//!
//! Pure math — no I/O, no serde (the webapp document layer owns JSON shapes;
//! timestamps serialize as RFC3339 strings there, matching the result-doc
//! precedent). The caller supplies "today" so every computation is
//! hermetically testable.

use chrono::{DateTime, Datelike, NaiveDate, Utc};

/// Longest allowed sold→expiry span (LEAPS ~2y). A validate() bound, and a
/// CPU bound: view() walks the whole span per request.
pub const MAX_HOLDING_SPAN_DAYS: i64 = 730;

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
    /// Underlying last close captured by the same refresh (informational —
    /// the pace rule uses the option's mid). `None` on marks from older
    /// ledgers or when the kline failed while the chain succeeded.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub underlying_price: Option<f64>,
}

/// One open short-covered-call position. Field-for-field the same shape as
/// `Holding` (sibling arrays in one ledger document); the ITM danger
/// direction (spot ABOVE strike for calls) is a rendering concern, never
/// the math.
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct CallHolding {
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

/// Shares held from an assignment — the lot a covered call is sold
/// against. Priced from the underlying spot, never from an option chain.
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct ShareLot {
    pub id: String,
    pub symbol: String,
    pub shares: u32,
    pub basis_per_share: f64,
    pub acquired: NaiveDate,
    /// Latest underlying spot; `None` until the first refresh succeeds.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mark: Option<SpotMark>,
}

/// The underlying spot quote a lot prices from, captured by the refresh
/// that covered its symbol.
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct SpotMark {
    pub spot: f64,
    pub as_of: DateTime<Utc>,
}

/// The close decision for one holding, as rendered on the card.
/// `Option` fields are `None` exactly when no mark exists yet.
#[derive(Debug, Clone, PartialEq, serde::Serialize)]
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
    /// `(spot − strike) / strike` — negative = the short put is ITM (danger).
    /// `None` without a mark or when the refresh had no underlying quote.
    pub spot_pct_vs_strike: Option<f64>,
}

/// Working days strictly after `from`, up to and including `to` (date-only,
/// weekdays only — holidays not modeled, same as market.rs). Inclusive `to`
/// is what makes expiry day count: sold Fri → expiry next Fri = 5.
/// Overflow-safe: a corrupt near-max date clamps instead of panicking.
pub fn working_days_after(from: NaiveDate, to: NaiveDate) -> u32 {
    let mut n = 0;
    let mut d = from;
    while let Some(next) = d.succ_opt() {
        d = next;
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
        validate_option_leg(
            &self.symbol,
            self.strike,
            self.premium,
            self.contracts,
            self.sold,
            self.expiry,
        )
    }

    /// The close-decision view as of `today` (ET calendar date).
    pub fn view(&self, today: NaiveDate) -> HoldingView {
        pace_view(
            self.strike,
            self.premium,
            self.contracts,
            self.sold,
            self.expiry,
            self.mark.as_ref(),
            today,
        )
    }
}

impl CallHolding {
    pub fn validate(&self) -> Result<(), String> {
        validate_option_leg(
            &self.symbol,
            self.strike,
            self.premium,
            self.contracts,
            self.sold,
            self.expiry,
        )
    }

    /// The close-decision view as of `today` (ET calendar date).
    pub fn view(&self, today: NaiveDate) -> HoldingView {
        pace_view(
            self.strike,
            self.premium,
            self.contracts,
            self.sold,
            self.expiry,
            self.mark.as_ref(),
            today,
        )
    }
}

/// The rendered lot row. `value`/P&L/spot need a spot mark; `capacity` and
/// the caller-supplied `covered` count (it derives from the calls array —
/// the lot can't see it) never do.
#[derive(Debug, Clone, PartialEq, serde::Serialize)]
pub struct LotView {
    pub value: Option<f64>,
    pub pl_dollars: Option<f64>,
    pub pl_pct: Option<f64>,
    /// `floor(shares / 100)` — how many covered calls the lot could back.
    pub capacity: u32,
    /// Covered-call contracts currently covering this lot (passed in).
    pub covered: u32,
    pub spot: Option<f64>,
    pub spot_as_of: Option<DateTime<Utc>>,
    /// Calendar days held, from `acquired` to the caller's `today`.
    pub age_days: u32,
}

impl ShareLot {
    /// Structural validation only — a future `acquired` date is rejected
    /// handler-side, matching how `sold` is handled today.
    pub fn validate(&self) -> Result<(), String> {
        if self.symbol.trim().is_empty() {
            return Err("symbol is required".to_string());
        }
        if self.shares == 0 {
            return Err("shares must be at least 1".to_string());
        }
        if !(self.basis_per_share.is_finite() && self.basis_per_share > 0.0) {
            return Err("basis must be > 0".to_string());
        }
        Ok(())
    }

    /// The lot row as of `today`, covered by `covered_contracts` call
    /// contracts.
    pub fn view(&self, today: NaiveDate, covered_contracts: u32) -> LotView {
        // u32 division floors — the contract is "floor(shares/100)".
        let capacity = self.shares / 100;
        let age_days = (today - self.acquired).num_days().max(0) as u32;
        let Some(mark) = &self.mark else {
            return LotView {
                value: None,
                pl_dollars: None,
                pl_pct: None,
                capacity,
                covered: covered_contracts,
                spot: None,
                spot_as_of: None,
                age_days,
            };
        };
        let value = mark.spot * self.shares as f64;
        let total_basis = self.basis_per_share * self.shares as f64;
        let pl_dollars = value - total_basis;
        LotView {
            value: Some(value),
            pl_dollars: Some(pl_dollars),
            pl_pct: Some(pl_dollars / total_basis),
            capacity,
            covered: covered_contracts,
            spot: Some(mark.spot),
            spot_as_of: Some(mark.as_of),
            age_days,
        }
    }
}

/// The contract rules both option kinds share — identical fields, identical
/// bounds (R1: `CallHolding::validate` applies the identical rules).
fn validate_option_leg(
    symbol: &str,
    strike: f64,
    premium: f64,
    contracts: u32,
    sold: NaiveDate,
    expiry: NaiveDate,
) -> Result<(), String> {
    if symbol.trim().is_empty() {
        return Err("symbol is required".to_string());
    }
    if !(strike.is_finite() && strike > 0.0) {
        return Err("strike must be > 0".to_string());
    }
    if !(premium.is_finite() && premium > 0.0) {
        return Err("premium must be > 0".to_string());
    }
    if contracts == 0 {
        return Err("contracts must be at least 1".to_string());
    }
    if expiry <= sold {
        return Err("expiry must be after the sell date".to_string());
    }
    // Span bound: no real put lives past ~2 years (LEAPS). Also a CPU
    // guard — every view() walks the sold→expiry span per request.
    if (expiry - sold).num_days() > MAX_HOLDING_SPAN_DAYS {
        return Err(format!(
            "expiry is more than {MAX_HOLDING_SPAN_DAYS} days out"
        ));
    }
    Ok(())
}

/// The pace computation exists once (R1): working days, the 1-day floor,
/// per-day pace, `pace_met`. `Holding::view` and `CallHolding::view` both
/// delegate; `spot_pct_vs_strike` keeps one formula for both — the danger
/// direction (below strike for puts, above for calls) is rendering.
fn pace_view(
    strike: f64,
    premium: f64,
    contracts: u32,
    sold: NaiveDate,
    expiry: NaiveDate,
    mark: Option<&Mark>,
    today: NaiveDate,
) -> HoldingView {
    let days_total = working_days_after(sold, expiry);
    let anchor = today.min(expiry);
    let days_elapsed = working_days_after(sold, anchor).min(days_total);
    // Day 0 earns a full day's target.
    let target_pct = if days_total > 0 {
        days_elapsed.max(1) as f64 / days_total as f64
    } else {
        0.0
    };

    let Some(mark) = mark else {
        return HoldingView {
            pl_dollars: None,
            pl_pct: None,
            pace_per_day_dollars: None,
            pace_per_day_pct: None,
            days_elapsed,
            days_total,
            target_pct,
            pace_met: false,
            spot_pct_vs_strike: None,
        };
    };
    let spot_pct_vs_strike = mark
        .underlying_price
        .map(|spot| (spot - strike) / strike);

    let pl_per_share = premium - mark.mid;
    let pl_dollars = pl_per_share * 100.0 * contracts as f64;
    let pl_pct = pl_per_share / premium;
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
        spot_pct_vs_strike,
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
                underlying_price: None,
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

    /// R6: spot vs strike — negative means the short put is ITM (danger);
    /// absent underlying quote ⇒ None.
    #[test]
    fn spot_pct_vs_strike() {
        let mut h = holding(
            NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
            NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
            Some(0.5),
        );
        h.mark.as_mut().unwrap().underlying_price = Some(331.2);
        let v = h.view(NaiveDate::from_ymd_opt(2026, 9, 8).unwrap());
        let pct = v.spot_pct_vs_strike.unwrap();
        assert!((pct - (331.2 - 350.0) / 350.0).abs() < 1e-12);
        assert!(pct < 0.0, "spot below strike is ITM danger");

        h.mark.as_mut().unwrap().underlying_price = None;
        assert_eq!(h.view(NaiveDate::from_ymd_opt(2026, 9, 8).unwrap()).spot_pct_vs_strike, None);
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
        h.expiry = NaiveDate::from_ymd_opt(2026, 9, 11).unwrap();

        h.symbol = "  ".to_string();
        assert!(h.validate().is_err());
    }

    /// Span bound: LEAPS-length puts are rejected (also the CPU guard for
    /// view()'s per-request span walk).
    #[test]
    fn validation_rejects_overlong_span() {
        let mut h = holding(
            NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
            NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
            None,
        );
        h.validate().unwrap();
        h.expiry = NaiveDate::from_ymd_opt(2028, 9, 4).unwrap();
        assert!(h.validate().is_err(), "span > 730 days rejected");
        h.expiry = NaiveDate::from_ymd_opt(2028, 8, 30).unwrap();
        h.validate().unwrap();
    }

    /// R1: the wheel's covered-call ledger type — same shape, same rules,
    /// one shared pace implementation.
    mod call_holding {
        use super::*;

        fn call_holding(sold: NaiveDate, expiry: NaiveDate, mark_mid: Option<f64>) -> CallHolding {
            CallHolding {
                id: "c1".to_string(),
                symbol: "GOOG".to_string(),
                strike: 350.0,
                expiry,
                premium: 1.0,
                contracts: 1,
                sold,
                mark: mark_mid.map(|mid| Mark {
                    mid,
                    as_of: Utc::now(),
                    underlying_price: None,
                }),
            }
        }

        fn dates() -> (NaiveDate, NaiveDate, NaiveDate) {
            (
                NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
                NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
                NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
            )
        }

        /// Pinning assertion: one pace implementation, two callers — a
        /// CallHolding and a Holding with identical field values produce
        /// identical HoldingViews.
        #[test]
        fn call_view_equals_put_view_field_for_field() {
            let (sold, expiry, today) = dates();
            let mut put = holding(sold, expiry, Some(0.5));
            let mut call_h = call_holding(sold, expiry, Some(0.5));
            assert_eq!(put.view(today), call_h.view(today));

            put.mark = None;
            call_h.mark = None;
            assert_eq!(put.view(today), call_h.view(today), "also mark-less");
        }

        /// Identical validate() rules: the same six rejections.
        #[test]
        fn validation_rejects_the_same_bad_fields() {
            let (sold, expiry, _) = dates();
            let mut call_h = call_holding(sold, expiry, None);
            call_h.validate().unwrap();

            call_h.strike = 0.0;
            assert!(call_h.validate().is_err());
            call_h.strike = 350.0;

            call_h.premium = -1.0;
            assert!(call_h.validate().is_err());
            call_h.premium = 1.0;

            call_h.contracts = 0;
            assert!(call_h.validate().is_err());
            call_h.contracts = 1;

            call_h.expiry = call_h.sold;
            assert!(call_h.validate().is_err(), "expiry must be after sell date");
            call_h.expiry = NaiveDate::from_ymd_opt(2028, 9, 4).unwrap();
            assert!(call_h.validate().is_err(), "span > 730 days rejected");
            call_h.expiry = expiry;

            call_h.symbol = "  ".to_string();
            assert!(call_h.validate().is_err());
        }

        /// Without a mark: pace_met false and the P&L fields are None — but
        /// days_elapsed/days_total/target_pct still compute.
        #[test]
        fn no_mark_never_flags_but_day_math_runs() {
            let (sold, expiry, today) = dates();
            let call_h = call_holding(sold, expiry, None);
            let v = call_h.view(today);
            assert!(!v.pace_met);
            assert_eq!(v.pl_dollars, None);
            assert_eq!(v.pl_pct, None);
            assert_eq!(v.days_elapsed, 2);
            assert_eq!(v.days_total, 5);
            assert_eq!(v.target_pct, 0.4);
        }
    }

    /// R2: share lots from assignments, priced from the underlying spot.
    mod share_lot {
        use super::*;

        fn lot(shares: u32, basis: f64) -> ShareLot {
            ShareLot {
                id: "l1".to_string(),
                symbol: "GOOG".to_string(),
                shares,
                basis_per_share: basis,
                acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
                mark: None,
            }
        }

        /// The design doc's reference numbers: 200 sh @ $349.00 basis,
        /// spot $344.20, 2 contracts covered.
        #[test]
        fn reference_lot_view() {
            let today = NaiveDate::from_ymd_opt(2026, 9, 8).unwrap();
            let mut l = lot(200, 349.0);
            l.mark = Some(SpotMark {
                spot: 344.20,
                as_of: Utc::now(),
            });
            let v = l.view(today, 2);
            let value = v.value.unwrap();
            assert!((value - 68840.0).abs() < 1e-6, "value {value}");
            let pl = v.pl_dollars.unwrap();
            assert!((pl - (-960.0)).abs() < 1e-6, "P&L {pl}");
            let pct = v.pl_pct.unwrap();
            assert!((pct - (-960.0 / 69_800.0)).abs() < 1e-12, "P&L% {pct}");
            assert_eq!(v.capacity, 2);
            assert_eq!(v.covered, 2);
            assert_eq!(v.spot, Some(344.20));
            assert!(v.spot_as_of.is_some());
            assert_eq!(v.age_days, 0);
        }

        /// Unpriced lots report no value/P&L/spot but still compute
        /// capacity, and carry the passed-in covered count.
        #[test]
        fn unpriced_lot_still_computes_capacity() {
            let today = NaiveDate::from_ymd_opt(2026, 9, 10).unwrap();
            let l = lot(200, 349.0);
            let v = l.view(today, 1);
            assert_eq!(v.value, None);
            assert_eq!(v.pl_dollars, None);
            assert_eq!(v.pl_pct, None);
            assert_eq!(v.capacity, 2);
            assert_eq!(v.covered, 1);
            assert_eq!(v.spot, None);
            assert_eq!(v.spot_as_of, None);
            assert_eq!(v.age_days, 2);
        }

        /// Capacity floors, never rounds.
        #[test]
        fn capacity_floors() {
            let today = NaiveDate::from_ymd_opt(2026, 9, 8).unwrap();
            assert_eq!(lot(150, 10.0).view(today, 0).capacity, 1);
            assert_eq!(lot(99, 10.0).view(today, 0).capacity, 0);
            assert_eq!(lot(300, 10.0).view(today, 0).capacity, 3);
        }

        /// Structural validation only — future `acquired` dates are a
        /// handler concern (R6), matching how `sold` is handled.
        #[test]
        fn validation_rejects_bad_fields() {
            let mut l = lot(100, 10.0);
            l.validate().unwrap();

            l.symbol = "  ".to_string();
            assert!(l.validate().is_err());
            l.symbol = "GOOG".to_string();

            l.shares = 0;
            assert!(l.validate().is_err());
            l.shares = 100;

            l.basis_per_share = 0.0;
            assert!(l.validate().is_err());
            l.basis_per_share = -1.0;
            assert!(l.validate().is_err());
        }
    }
}
