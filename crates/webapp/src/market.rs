//! US-equity market-session clock (America/New_York) for the off-hours run
//! gate (ticket 22).
//!
//! Session = 09:30–16:00 ET, Monday–Friday. **US federal holidays are not
//! modeled** — a holiday Monday behaves like a trading day; the accepted cost
//! is one wasted-run allowance on ~9 days a year. Session times always exist
//! on their calendar dates (DST transitions happen long before 09:30), so
//! date+time → ET conversions are unambiguous.
//!
//! Outside the session the run gate is hourly (see `run::off_hours_block`,
//! relaxed from the original one-run-per-close-to-open window); this module
//! only answers "is the session open right now?".

use chrono::{DateTime, Datelike, NaiveDate, NaiveTime, Utc, Weekday};
use chrono_tz::America::New_York;

const OPEN: NaiveTime = NaiveTime::from_hms_opt(9, 30, 0).unwrap();
const CLOSE: NaiveTime = NaiveTime::from_hms_opt(16, 0, 0).unwrap();

fn is_weekday(d: NaiveDate) -> bool {
    matches!(
        d.weekday(),
        Weekday::Mon | Weekday::Tue | Weekday::Wed | Weekday::Thu | Weekday::Fri
    )
}

/// True during 09:30–16:00 ET Mon–Fri (holidays not modeled). Pass
/// `Utc::now()` in production; tests freeze it.
pub fn is_open(now: DateTime<Utc>) -> bool {
    let et = now.with_timezone(&New_York);
    is_weekday(et.date_naive()) && et.time() >= OPEN && et.time() < CLOSE
}

#[cfg(test)]
mod tests {
    use super::*;

    /// UTC instant for an ET wall-clock on a 2026-September date (EDT).
    /// 2026-09: Wed 2 · Fri 4 · Sat 5 · Sun 6.
    fn et(sep_day: u32, h: u32, min: u32) -> DateTime<Utc> {
        NaiveDate::from_ymd_opt(2026, 9, sep_day)
            .unwrap()
            .and_hms_opt(h, min, 0)
            .unwrap()
            .and_local_timezone(New_York)
            .unwrap()
            .with_timezone(&Utc)
    }

    #[test]
    fn mid_session_is_open() {
        assert!(is_open(et(2, 15, 0))); // Wed 15:00 ET
        assert!(is_open(et(2, 9, 30))); // 09:30 ET — open edge
    }

    #[test]
    fn weekday_pre_open_and_after_close_are_closed() {
        assert!(!is_open(et(2, 9, 0))); // Wed 09:00 ET
        assert!(!is_open(et(2, 16, 0))); // Wed 16:00 ET — closed edge
        assert!(!is_open(et(2, 20, 0))); // Wed 20:00 ET
    }

    #[test]
    fn weekends_are_closed() {
        assert!(!is_open(et(5, 12, 0))); // Sat noon ET
        assert!(!is_open(et(6, 12, 0))); // Sun noon ET
    }
}
