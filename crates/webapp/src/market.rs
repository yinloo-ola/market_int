//! US-equity market-session clock (America/New_York) for the off-hours run
//! gate (ticket 22).
//!
//! Session = 09:30–16:00 ET, Monday–Friday. **US federal holidays are not
//! modeled** — a holiday Monday behaves like a trading day; the accepted cost
//! is one wasted-run allowance on ~9 days a year. Session times always exist
//! on their calendar dates (DST transitions happen long before 09:30), so
//! date+time → ET conversions are unambiguous.
//!
//! The off-hours *window* is "since the most recent 16:00 ET close": the run
//! gate allows exactly one armed run per window (see `run::off_hours_block`),
//! and `next_open_utc` says when the restriction lifts.

use chrono::{DateTime, Datelike, NaiveDate, NaiveTime, Utc, Weekday};
use chrono_tz::America::New_York;

const OPEN: NaiveTime = NaiveTime::from_hms_opt(9, 30, 0).unwrap();
const CLOSE: NaiveTime = NaiveTime::from_hms_opt(16, 0, 0).unwrap();

/// Market-session facts at an instant (spec: off-hours run gate).
#[derive(Debug, Clone, Copy)]
pub struct MarketWindow {
    /// True during 09:30–16:00 ET Mon–Fri (holidays not modeled).
    pub open: bool,
    /// Start of the current off-hours window: the most recent 16:00 ET close
    /// at or before `now` (walks back over weekends; meaningless while open,
    /// where the gate never consults it).
    pub window_started_at_utc: DateTime<Utc>,
    /// The next 09:30 ET open strictly after `now`.
    pub next_open_utc: DateTime<Utc>,
}

fn is_weekday(d: NaiveDate) -> bool {
    matches!(d.weekday(), Weekday::Mon | Weekday::Tue | Weekday::Wed | Weekday::Thu | Weekday::Fri)
}

fn to_utc(date: NaiveDate, t: NaiveTime) -> DateTime<Utc> {
    date.and_time(t)
        .and_local_timezone(New_York)
        .earliest()
        .expect("09:30/16:00 ET never fall in a DST gap")
        .with_timezone(&Utc)
}

/// Session facts for `now` (pass `Utc::now()` in production; tests freeze it).
pub fn session(now: DateTime<Utc>) -> MarketWindow {
    let et = now.with_timezone(&New_York);
    let date = et.date_naive();
    let t = et.time();
    let open = is_weekday(date) && t >= OPEN && t < CLOSE;

    // Most recent close: today's 16:00 after it has passed, otherwise walk
    // back one day (weekday pre-open, or a weekend date) and skip weekends.
    let mut close_date = date;
    if !(is_weekday(date) && t >= CLOSE) {
        close_date = close_date.pred_opt().expect("naive date");
    }
    while !is_weekday(close_date) {
        close_date = close_date.pred_opt().expect("naive date");
    }

    // Next open: today's 09:30 before it starts, otherwise walk forward and
    // skip weekends.
    let mut open_date = date;
    if !(is_weekday(date) && t < OPEN) {
        open_date = open_date.succ_opt().expect("naive date");
    }
    while !is_weekday(open_date) {
        open_date = open_date.succ_opt().expect("naive date");
    }

    MarketWindow {
        open,
        window_started_at_utc: to_utc(close_date, CLOSE),
        next_open_utc: to_utc(open_date, OPEN),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// UTC instant for an ET wall-clock on a 2026-September date (EDT).
    /// 2026-09: Mon 31 Aug · Wed 2 · Fri 4 · Sat 5 · Sun 6 · Mon 7 Sep.
    /// Sep 7 is a real US holiday — the deliberately not-modeled case.
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
        let w = session(et(2, 15, 0)); // Wed 15:00 ET
        assert!(w.open);
        // Window start is irrelevant while open, but defined: Tue 16:00 ET.
        assert_eq!(w.window_started_at_utc, et(1, 16, 0));
        assert_eq!(w.next_open_utc, et(3, 9, 30));
    }

    #[test]
    fn weekday_pre_open_is_closed_until_todays_open() {
        let w = session(et(2, 9, 0)); // Wed 09:00 ET
        assert!(!w.open);
        assert_eq!(w.window_started_at_utc, et(1, 16, 0)); // Tue close
        assert_eq!(w.next_open_utc, et(2, 9, 30)); // today's open
    }

    #[test]
    fn weekday_after_close_allows_one_window_until_next_open() {
        let w = session(et(2, 20, 0)); // Wed 20:00 ET
        assert!(!w.open);
        assert_eq!(w.window_started_at_utc, et(2, 16, 0)); // today's close
        assert_eq!(w.next_open_utc, et(3, 9, 30)); // Thu open
    }

    #[test]
    fn weekend_windows_span_from_friday_close_to_monday_open() {
        let sat = session(et(5, 12, 0)); // Sat 12:00 ET
        assert!(!sat.open);
        assert_eq!(sat.window_started_at_utc, et(4, 16, 0)); // Fri close
        assert_eq!(sat.next_open_utc, et(7, 9, 30)); // Mon open

        let sun = session(et(6, 12, 0)); // Sun 12:00 ET
        assert_eq!(sun.window_started_at_utc, et(4, 16, 0));
        assert_eq!(sun.next_open_utc, et(7, 9, 30));

        let mon_pre = session(et(7, 9, 0)); // Mon 09:00 ET
        assert_eq!(mon_pre.window_started_at_utc, et(4, 16, 0));
        assert_eq!(mon_pre.next_open_utc, et(7, 9, 30));
    }

    #[test]
    fn session_boundaries_open_at_930_close_at_1600() {
        assert!(session(et(2, 9, 30)).open); // Wed 09:30 ET — open edge
        assert!(!session(et(2, 16, 0)).open); // Wed 16:00 ET — closed edge
    }
}
