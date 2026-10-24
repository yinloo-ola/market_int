# Review packet: 2026-10-24-holdings-elderly-mobile — feature review

Base: ad6a53b0f2edc0fb899b00c5b506693d899b8556

Head: bfa0c9ee80da4efa2363bf74dd4fac582c416b6b

## Commits

bfa0c9e feat(webapp): add visual screenshot verification script and preview harness (R6)
3178490 feat(webapp): add floating viewport ToastNotice with distinct status styling (R5)
77f6b3d feat(webapp): add focused HoldingsActionSheet with plain-English validation hints (R4)
9efee97 feat(webapp): add progressive-disclosure position cards for lots, puts, and calls (R3)
ef59f09 feat(webapp): add mobile CashSummaryBar and PoolManagerSheet (R2)
03b5d64 feat(webapp): establish accessible typography and touch tokens for holdings (R1)

## Changed files

 crates/webapp/frontend/dist/assets/app.css         |   2 +-
 crates/webapp/frontend/dist/assets/app.js          | 208 ++---
 crates/webapp/frontend/package-lock.json           |  40 +
 crates/webapp/frontend/package.json                |   3 +-
 crates/webapp/frontend/preview-holdings.html       |  12 +
 .../frontend/src/components/HoldingsPanel.jsx      | 705 ++++++++++++----
 crates/webapp/frontend/src/preview-holdings.jsx    | 175 ++++
 crates/webapp/frontend/src/smoke-entry.jsx         | 152 ++++
 crates/webapp/frontend/src/style.css               | 883 ++++++++++++++++-----
 scripts/capture-holdings-screenshots.mjs           | 157 ++++
 10 files changed, 1885 insertions(+), 452 deletions(-)

## Acceptance criteria (verbatim from the design doc)

### R1: Senior-friendly typography and touch target styling tokens
Establish accessible CSS styling tokens across the Holdings tab that elevate the base font to 14px, eliminate micro-fonts under 12px, remove opacity damping on text labels to guarantee WCAG AAA contrast in both light and dark themes, and enforce minimum 44×44px touch targets on mobile touch controls.

**Acceptance criteria**
- Given a mobile or desktop viewport, When any Holdings tab element renders, Then no text element has a computed font size smaller than 12px (status badges, pool tags, and metadata render at 12–14px; primary numbers render at 16–22px).
- Given light or dark mode, When viewing metadata and secondary labels in the Holdings tab, Then no text label uses `opacity` below 0.85, preserving high contrast against the panel background.
- Given a mobile viewport (<=900px), When interactive buttons, tab tiles, close triggers, or pool action controls render, Then their computed touch bounding box is at least 44px in height and width.

### Checkpoints: none
### Review: skip

### R2: Mobile Cash Summary Bar and Pool Manager Sheet
Replace the stacked top rail on mobile viewports (`<=900px`) with a compact Cash Summary Bar displaying Total Cash and Available Free Cash in prominent 18px text, coupled with an `[Accounts / Pools]` button that opens an accessible Pool Manager Sheet for viewing pool partitions, editing balances, adding pools, and deleting empty pools.

**Acceptance criteria**
- Given a viewport width <= 900px, When the Holdings tab renders, Then the desktop sidebar rail is replaced by a compact `CashSummaryBar` occupying <= 70px vertical height showing total cash and free cash.
- Given the mobile `CashSummaryBar`, When the user taps the `[Accounts / Pools]` button, Then an accessible `PoolManagerSheet` opens displaying all configured cash pools with 44px touch targets for selecting, editing cash, adding a new pool, or deleting an empty pool.
- Given a desktop viewport (>900px), When the Holdings tab renders, Then the full left sidebar rail continues to display all cash pool details and balance rows without regression.

### Checkpoints: none
### Review: skip

### R3: Progressive-disclosure position cards for Lots, Puts, and Calls
Decompose Lot, Put, and Call list items into unified, readable position cards featuring a primary high-contrast summary view (large ticker symbol, strike/basis, expiry/shares, bold P&L badge, and prominent 44px action buttons) and a tap-to-expand secondary details section for in-depth metrics.

**Acceptance criteria**
- Given any active Put or Call position, When rendered in the list, Then the default collapsed card displays Symbol (>=18px bold), Strike & Expiry, high-contrast P&L badge, status chip, and a 44px `[Close…]` action button.
- Given any collapsed Put or Call position card, When the card body is tapped, Then the card expands to reveal secondary metrics including the MiniBar pace track with target tick, days elapsed/total, original sold premium, current mid price, underlying spot distance, mark age, and assigned pool tag.
- Given any active Share Lot, When rendered in the list, Then the default collapsed card displays Symbol (>=18px bold), Shares & Cost Basis, dollar and percentage P&L, and 44px `[Sell Call]` and `[Close]` action buttons.
- Given an expanded position card, When tapped again, Then the secondary details collapse back to the compact summary state.

### Checkpoints: none
### Review: skip

### R4: Focused mobile Action Sheet with explicit validation hints
Refactor mutation forms (Sell Call, Close Lot, Put Close Dialog, Call Close Dialog, Assigned Lot Form) into a responsive `HoldingsActionSheet` container that opens as a focused bottom sheet / modal on mobile with 48px touch inputs, `inputmode="decimal"`, plain-English validation helper text when inputs are incomplete, and thumb-friendly Cancel and Submit buttons.

**Acceptance criteria**
- Given a mobile viewport (<=720px), When the user clicks an action button (`[+ Sell put]`, `[Sell call…]`, `[Close…]`, or `[+ New lot]`), Then the corresponding form renders inside a focused bottom-sheet overlay with a backdrop rather than shifting the inline page flow.
- Given an open action form with invalid or missing inputs (e.g. non-numeric price, empty symbol, expiry before tomorrow), When the user inspects the form footer, Then an explicit human-readable helper message explains what must be corrected, and the submit button is visibly disabled.
- Given an open action form, When the user taps the Cancel button, close icon, or backdrop overlay, Then the form closes immediately without submitting any network requests or modifying ledger state.
- Given an open action form with valid inputs, When the user taps the 48px submit button, Then the action submits the request to the existing backend endpoint and closes the sheet upon success.

### Checkpoints: none
### Review: skip

### R5: Floating viewport toast notifications with distinct status styling
Replace the top-of-pane auto-dismissing notice banner with a floating sticky toast (`ToastNotice`) anchored to the viewport that remains visible for 8 seconds (or until tapped/dismissed), featuring distinct high-contrast green styling for successes and prominent red styling for errors.

**Acceptance criteria**
- Given any user action (refreshing marks, closing a position, updating cash, reassigning a pool), When the operation succeeds, Then a green floating toast notification appears anchored to the viewport displaying the success message for 8 seconds.
- Given any user action that fails or returns an error, When the error occurs, Then a high-contrast red floating toast appears displaying the specific error message, remaining visible until tapped or dismissed.
- Given a displayed toast notification, When the user taps the toast or its close button, Then the toast dismisses immediately.

### Checkpoints: none
### Review: skip

### R6: Visual verification and responsive screenshot generation
Provide and execute an automated visual verification script using headless browser automation to capture high-resolution screenshots of the Holdings tab in both mobile (390×844) and desktop (1280×800) viewports into `gui-test-screenshots/`, validating visual hierarchy, aesthetic polish, and elderly-friendly usability.

**Acceptance criteria**
- Given the built webapp running locally, When the visual screenshot verification script executes, Then high-resolution screenshots of the Holdings tab are saved to `gui-test-screenshots/holdings-mobile.png` (390×844) and `gui-test-screenshots/holdings-desktop.png` (1280×800).
- Given the captured mobile screenshot, When inspected, Then typography is legible with >=14px body text, touch targets are >=44px, cash figures are visible above the fold, and position cards present clear high-contrast P&L summaries without text clipping or horizontal overflow.
- Given the captured desktop screenshot, When inspected, Then the multi-column layout is balanced, typography is crisp, and pool rails remain cleanly accessible.

### Checkpoints: none
### Review: skip

## Approaches considered

### Approach 1: Progressive-Disclosure Cards + Dedicated Action Sheet + Mobile Cash Summary Pill (Selected)
- Decomposes dense 18-metric tables into clean summary cards with tap-to-expand details.
- Uses a focused mobile bottom sheet with 48px inputs and validation helper text.
- Replaces crowded top rail with a compact cash summary bar on mobile.
- Replaces top notice with a floating sticky toast (success/error).
- Includes automated visual screenshot verification.
- **Why chosen**: Completely eliminates senior accessibility friction (small text, mistaps, off-screen forms) while preserving 100% of desktop power and backend reliability.

### Approach 2: CSS-Only Responsive Utility Layer & Inline Accordions (Rejected)
- Kept the existing DOM hierarchy intact and only adjusted padding and font sizes in CSS.
- **Why rejected**: On mobile smartphones, inline form expansion inside a scrollable list frequently gets obscured by virtual software keyboards, causing confusing off-screen jumps and accidental form cancellations.

### Approach 3: Dual-Mode Mobile/Desktop Views (Rejected)
- Rendered two completely separate Solid JSX view hierarchies (`MobileHoldingsView` vs `DesktopHoldingsView`).
- **Why rejected**: Excessive duplication of API interactions, state management, and edge-case handling; high maintenance burden and high risk of behavioural drift.

## Architecture

The architecture maintains strict decoupling between the presentation layer and the backend ledger engine:

```
+-----------------------------------------------------------------------------------+
| crates/webapp/frontend/src/components/HoldingsPanel.jsx                            |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | State: holdings(), dialog(), selectedPoolId(), expandedIds(), toast()       |  |
|  +-----------------------------------------------------------------------------+  |
|         |                                  |                           |          |
|         v                                  v                           v          |
|  [CashSummaryBar]                 [PositionCard]              [HoldingsActionSheet]
|  - Desktop: left sidebar          - Large Symbol & P&L        - Mobile: bottom sheet
|  - Mobile: compact 2-line bar     - 44px Action buttons       - 48px touch inputs   
|  - [Manage Pools] sheet trigger   - Tap-to-expand details     - Real-time validation
|                                                                 helper text         
+-----------------------------------------------------------------------------------+
                                         |
                                         v
                     crates/webapp/frontend/src/api.js
                                         | (HTTP JSON)
                                         v
                  crates/webapp/src/holdings.rs (GET/POST/PATCH/DELETE)
                                         |
                                         v
            Per-user JSON Ledger on Disk (/data/webapp/holdings/{uid}.json)
```

## Components

1. **`CashSummaryBar` & `PoolManagerSheet`**:
   - Manages cash display across screen sizes.
   - On mobile (`<=900px`): renders total cash, available cash, and active pool selector in a compact header, delegating pool configuration to `PoolManagerSheet`.
   - On desktop (`>900px`): renders the traditional sticky left rail.
2. **`PositionCard`**:
   - Replaces `OptionRow` and `LotRailRow` with high-contrast, accessible cards.
   - Primary row: Symbol (18px bold), key strike/basis metrics, P&L badge with semantic color tokens (`--ok`, `--err`), and 44px primary action button.
   - Secondary drawer: revealed on tap with animated expansion, showing pace track, spot metrics, mark age, and pool tag.
3. **`HoldingsActionSheet`**:
   - Mobile-first action dialog container wrapping `OptionForm`, `AddLotForm`, `SellCallForm`, `CloseLotForm`, `PutCloseDialog`, and `CallCloseDialog`.
   - Adapts from modal dialog on desktop to slide-up bottom sheet on mobile.
   - Includes full-width 48px inputs with `inputmode="decimal"` and explicit validation helper copy.
4. **`ToastNotice`**:
   - Fixed viewport notification container for feedback messages.
   - Green for success messages; high-contrast red for error alerts.

## Data flow

1. **Mounting**: `HoldingsPanel` mounts -> calls `getHoldings()` -> populates `holdings()` signal -> renders `CashSummaryBar` and list of `PositionCard` components.
2. **Expansion**: User taps a `PositionCard` -> toggles item ID in `expandedIds()` set -> secondary details animate open without triggering network requests.
3. **Action Trigger**: User taps `[Close…]` or `[Sell call…]` -> sets `dialog({ type, ... })` -> opens `HoldingsActionSheet` focused on the selected position.
4. **Validation & Submission**: User types values -> reactive `valid()` function computes state; if invalid, helper text renders above the submit button; if valid, submit button enables -> user taps submit -> calls `api.js` endpoint -> on success, triggers `flashSuccess()` and reloads ledger; on failure, triggers `flashError()`.

## Error handling

- All asynchronous API calls wrap with try/catch blocks routing to `flashError(err.message)`.
- `flashError` activates `ToastNotice` with a distinct `--err` background, high-contrast white text, and an explicit dismiss button.
- Form inputs provide real-time guidance before submission (e.g. indicating when contracts exceed capacity or prices are non-positive) rather than failing silently.

## Testing and visual verification

1. **DOM Smoke Suite (`npm --prefix crates/webapp/frontend run smoke`)**:
   - Verifies 44px touch target compliance for all interactive buttons and pool selectors.
   - Verifies progressive disclosure expansion and collapse behavior on position cards.
   - Verifies `CashSummaryBar` rendering and `PoolManagerSheet` interactions.
   - Verifies `HoldingsActionSheet` validation helper rendering and form submissions.
   - Verifies `ToastNotice` success and error states.
2. **Automated Visual Verification Script (`scripts/capture-holdings-screenshots.mjs`)**:
   - Runs headless browser automation via Playwright to take screenshots of the built webapp at:
     - Mobile viewport: 390×844 (iPhone 12/13/14 scale).
     - Desktop viewport: 1280×800.
   - Outputs screenshots to `gui-test-screenshots/holdings-mobile.png` and `gui-test-screenshots/holdings-desktop.png`.
3. **Backend Regression**:
   - `cargo test -p market_int_webapp holdings` (59 tests pass).
   - `cargo test -p market_int_core holdings` (27 tests pass).


## Feature acceptance (verbatim)

## Feature acceptance

- Given a mobile user viewing the Holdings tab on a 390×844 viewport with active cash, put, call, and share lot positions, When the user loads the page, Then the cash summary appears above the fold in >=18px font with a 44px `[Accounts / Pools]` button, each position displays as a high-contrast card with >=14px text and a 44px action button, tapping any card smoothly reveals secondary pace and spot details, tapping an action button opens a bottom sheet with 48px inputs and validation hints, and automated screenshot verification captures mobile and desktop views into `gui-test-screenshots/`.


## Production-risk notes (verbatim, if any)


## Diff

diff --git a/crates/webapp/frontend/dist/assets/app.css b/crates/webapp/frontend/dist/assets/app.css
index f97a531..b0c79df 100644
--- a/crates/webapp/frontend/dist/assets/app.css
+++ b/crates/webapp/frontend/dist/assets/app.css
@@ -1 +1 @@
-:root{--page: #f6f7f9;--panel: #ffffff;--border: #dde3ea;--accent: #0d5cd7;--ink: #1c2733;--muted: #51606f;--ok: #137a3a;--warn: #a06b00;--err: #a02a1a;--dot-green: #1a9f48;--dot-yellow: #d7a313;--dot-red: #cc4433;--pick-tint: #fdf6e0;--star: #c08a00;--on-accent: #ffffff;--row-hover: #f4f7fb;--pick-hover: #faf0cd;--sunk: #eef2f6;--faint: #9aa7b5;--danger-ink: #b3555f;--err-wash: #fdf0f0;--err-line: #e4b7b7;--chip-warn-bg: #f4e3c8;--chip-warn-ink: #8a5a00;--chip-err-bg: #f3d4d0;--chip-err-line: #e0b7b0;--chip-mute-bg: #e6ecf2;--chip-mute-line: #c9d2dd;--warn-wash: #fdf3df;--warn-line: #eedfb8;--exp-open: #eef4fc;--exp-inner: #fbfcfe;--exp-edge: #b9d2f2;--band-bg: #f2f5f8;--bar-track: #edf1f5;--pace-track: #e8edf3;--badge-ok-bg: #eef7f0;--badge-ok-line: #cfe5d6;--badge-warn-bg: #fbf3dd;--badge-warn-line: #ecd9ae;--badge-err-bg: #fbeeec;--badge-err-line: #e8c4bd;--readmit: #059669;--tip-bg: #1c2733;--tip-ink: #ffffff;--kind-put-bg: rgba(96, 165, 250, .18);--kind-put-ink: #7fb5f5;--kind-call-bg: rgba(251, 191, 36, .16);--kind-call-ink: #e8b84a}*{box-sizing:border-box}body{margin:0;background:var(--page);color:var(--ink);font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;font-size:13px;line-height:1.45}.shell{max-width:1280px;margin:0 auto;padding:16px;height:100vh;display:flex;flex-direction:column}.brand{display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 10px;margin:0 0 4px}.brand-mark{font-size:17px;font-weight:700;letter-spacing:-.01em;color:var(--ink)}.brand-accent{color:var(--accent)}.brand-sub{font-size:10.5px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}.cache-line{color:var(--muted);margin-bottom:12px}.pill{display:inline-block;padding:1px 8px;border-radius:999px;border:1px solid var(--border);background:var(--panel);margin-left:6px}.pill.fresh{border-color:var(--ok);color:var(--ok)}.pill.stale{border-color:var(--warn);color:var(--warn)}.pill.none,.pill.closed{color:var(--muted)}.error-banner{border:1px solid var(--err-line);background:var(--err-wash);color:var(--err);padding:10px 12px;border-radius:6px;margin-bottom:12px}.tabs{display:flex;gap:4px;margin-top:4px}.tab{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--panel);border:1px solid var(--border);border-bottom:none;border-radius:8px 8px 0 0;padding:6px 14px;font:inherit;color:var(--muted);cursor:pointer}.tab.active{color:var(--ink);box-shadow:inset 0 -2px 0 var(--accent);border-color:var(--accent)}.controls{display:flex;align-items:center;flex-wrap:wrap;gap:10px;padding:8px 0}.filter-input{width:220px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--panel);font:inherit;color:var(--ink)}.filter-input:focus{outline:none;border-color:var(--accent)}.check{display:inline-flex;align-items:center;gap:5px;cursor:pointer;-webkit-user-select:none;user-select:none;color:var(--ink)}.tool-btn{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:4px 10px;font:inherit;color:var(--ink);cursor:pointer}.tool-btn:hover{border-color:var(--accent)}.count-line{margin-left:auto;color:var(--muted);white-space:nowrap}.colpicker{position:relative;display:inline-block}.pop-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:40;background:transparent}.picker-panel{position:absolute;right:0;top:calc(100% + 4px);z-index:41;background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:10px 12px;width:min(430px,92vw);box-shadow:0 8px 24px #1c27331f}.picker-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px 10px;margin-bottom:8px}.pick-item{display:flex;align-items:center;gap:6px;font-size:12px;white-space:nowrap;cursor:pointer}.linklike{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;border:none;padding:2px 0;font:inherit;font-size:12px;color:var(--accent);text-decoration:underline;cursor:pointer}table{width:100%;border-collapse:collapse;background:var(--panel);border:1px solid var(--border);font-size:12.5px}th,td{text-align:left;padding:5px 8px;border-bottom:1px solid var(--border);white-space:nowrap}th{position:sticky;top:0;z-index:2;background:var(--panel);-webkit-user-select:none;user-select:none;cursor:pointer}th:hover{color:var(--accent)}.sort-arrow{display:inline-block;margin-left:4px;color:var(--accent)}td.num,th.num{text-align:right;font-family:ui-monospace,SF Mono,Menlo,monospace;font-variant-numeric:tabular-nums}td.strong{font-weight:700}tbody tr:hover td{background:var(--row-hover)}tr.pick td{background:var(--pick-tint)}tr.pick:hover td{background:var(--pick-hover)}tr.pick b{font-weight:700}.star{color:var(--star);font-weight:700;font-size:11px;margin-right:6px}.dot{display:inline-block;width:9px;height:9px;border-radius:50%;vertical-align:middle}.dot.green{background:var(--dot-green)}.dot.yellow{background:var(--dot-yellow)}.dot.red{background:var(--dot-red)}.chip{display:inline-block;padding:1px 6px;border-radius:999px;font-size:10px;font-family:-apple-system,SF Pro Text,Segoe UI,Roboto,sans-serif;vertical-align:middle;margin-left:6px}.chip.high{background:var(--chip-warn-bg);color:var(--chip-warn-ink)}.chip.extended{background:var(--chip-err-bg);color:var(--err)}.chip.normal{background:var(--chip-mute-bg);color:var(--muted)}tr.prow td{opacity:.62}.null-mark{color:var(--danger-ink);opacity:.85}.empty-panel{border:1px dashed var(--border);background:var(--panel);border-radius:8px;padding:18px;color:var(--muted)}.pager{position:sticky;bottom:0;z-index:3;display:flex;align-items:center;flex-wrap:wrap;gap:4px;padding:6px 10px;background:var(--panel);border:1px solid var(--border);border-top:none}.pager-label{color:var(--muted);margin-right:8px;white-space:nowrap}.pgbtn{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--panel);border:1px solid var(--border);border-radius:6px;min-width:26px;padding:2px 7px;font:inherit;font-size:12px;color:var(--ink);cursor:pointer}.pgbtn:hover:not(:disabled){border-color:var(--accent)}.pgbtn.active{background:var(--accent);border-color:var(--accent);color:var(--on-accent)}.pgbtn:disabled{opacity:.45;cursor:default}.pggap{color:var(--muted);padding:0 2px}.gate-wrap{min-height:100vh;display:grid;place-items:center;padding:24px}.gate-card{width:340px;background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:22px 24px}.gate-title{display:flex;flex-direction:column;align-items:flex-start;gap:4px;margin:0 0 16px}.gate-label{display:block;font-size:12px;color:var(--muted);margin-bottom:10px}.gate-label input{display:block;width:100%;margin-top:3px;padding:6px 8px;font:inherit;color:inherit;background:var(--page);border:1px solid var(--border);border-radius:5px}.gate-label input:focus{outline:none;border-color:var(--accent)}.btn{font:inherit;padding:6px 12px;border-radius:5px;border:1px solid var(--border);background:var(--panel);color:var(--ink);cursor:pointer}.btn:hover:not(:disabled){border-color:var(--accent)}.btn:disabled{opacity:.55;cursor:default}.btn-primary{width:100%;background:var(--accent);border-color:var(--accent);color:var(--on-accent)}.gate-toggle{display:inline-block;margin-top:10px;font:inherit;font-size:12px;background:none;border:none;color:var(--accent);cursor:pointer;padding:0}.gate-or{text-align:center;color:var(--muted);font-size:11px;margin:14px 0}.gate-error{margin-top:12px;padding:7px 10px;border:1px solid var(--err-line);border-radius:5px;background:var(--err-wash);color:var(--err);font-size:12px}.gate-note{color:var(--muted)}.user-box{position:relative;float:right;display:flex;align-items:center;font-size:12px}.user-pill{display:inline-flex;align-items:center;gap:6px}.user-box .user-email{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.user-caret{color:var(--muted);font-size:9px}.account-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:45;min-width:230px;padding:6px;background:var(--panel);border:1px solid var(--border);border-radius:8px;box-shadow:0 8px 24px #1c27331f}.acct-label{padding:5px 10px 3px;font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}.acct-email{padding:0 10px 4px;font-size:12px;word-break:break-all}.account-menu .btn-ghost{display:flex;width:100%;justify-content:center;margin-top:4px}.btn-ghost{font:inherit;font-size:12px;padding:3px 10px;border-radius:6px;border:1px solid var(--border);background:var(--panel);color:var(--ink);cursor:pointer}.btn-ghost:hover{border-color:var(--accent);color:var(--accent)}.modal-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:60;background:#1c273373;display:grid;place-items:center;padding:16px}.access-card{width:min(420px,100%);max-height:min(85dvh,720px);overflow-y:auto}.access-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0;border-bottom:1px solid var(--page);font-size:12.5px}.access-email{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.access-remove{flex:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;border:none;color:var(--err);font-size:13px;cursor:pointer;padding:2px 5px;border-radius:4px}.access-remove:hover{background:var(--badge-err-bg)}.access-remove:disabled{opacity:.4;cursor:default}.access-add{display:flex;flex-direction:column;gap:8px;margin-top:10px}.access-add input{width:100%;padding:7px 9px;font:inherit;color:inherit;background:var(--page);border:1px solid var(--border);border-radius:5px}.access-add .btn{width:100%}.access-add input:focus{outline:none;border-color:var(--accent)}.run-slot-head{float:right;margin-left:12px}.theme-slot-head{float:right;margin:0 10px;display:flex;align-items:center}.run-btn{font:inherit;padding:5px 14px;border-radius:5px;border:1px solid var(--accent);background:var(--accent);color:var(--on-accent);cursor:pointer}.run-btn:hover:not(:disabled){background:var(--accent-deep)}.run-btn:disabled{background:var(--chip-mute-bg);border-color:var(--chip-mute-line);color:var(--muted);cursor:default}.run-strip{clear:both;border:1px solid var(--border);background:var(--panel);border-radius:6px;padding:10px 14px;margin-bottom:14px}.toast-cached{background:var(--pick-tint);border:1px solid var(--warn-line);color:var(--chip-warn-ink);border-radius:5px;padding:6px 10px;font-size:12px;margin-bottom:8px}.toast-cached.warn{background:var(--chip-err-bg);border-color:var(--chip-err-line);color:var(--err)}.run-headline{font-size:13px;margin-bottom:8px}.run-stages{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(220px,1fr));gap:4px 24px}.run-stage{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--muted)}.run-stage .mark{width:1.1em;text-align:center}.run-stage.pending .mark{color:var(--faint)}.run-stage.active{color:var(--accent)}.run-stage.ok{color:var(--ok)}.run-stage.partial{color:var(--warn)}.run-stage.failed{color:var(--dot-red)}.run-count{font-variant-numeric:tabular-nums;color:var(--muted)}.run-bar{flex:1;height:6px;min-width:80px;background:var(--sunk);border-radius:3px;overflow:hidden}.run-bar .fill{display:block;height:100%;background:var(--accent);transition:width .25s ease-out}.run-errors{font-size:12px;color:var(--muted);margin-top:6px}.run-errors summary{cursor:pointer;color:var(--muted)}.run-errors ul{margin:6px 0 0 18px}.run-warn{margin-top:8px;font-size:12px;color:var(--err)}.pane{display:flex;flex-direction:column;flex:1 1 auto;min-height:0}.pane[hidden]{display:none}.scroll-region{flex:1 1 auto;min-height:140px;overflow:auto}.tip{position:relative}.tip-target{border-bottom:1px dotted var(--faint);cursor:help}.tip:after{content:attr(data-tip);display:none;position:absolute;top:calc(100% + 6px);left:0;z-index:40;width:max-content;max-width:340px;padding:6px 9px;border-radius:6px;background:var(--tip-bg);color:var(--tip-ink);font-size:11.5px;font-weight:400;line-height:1.45;white-space:normal;text-align:left;box-shadow:0 2px 10px #1c273347;pointer-events:none}.tip:hover:after,.tip:focus-within:after{display:block}.tip-flip:after{left:auto;right:0}tr.expandable{cursor:pointer}tr.expandable.open td{background:var(--exp-open)}th.exp-col,td.exp-col{width:26px;min-width:26px;padding:5px 2px;text-align:center;color:var(--muted)}tr.exp-row>td{background:var(--exp-inner);white-space:normal;padding:0}.expansion{border-left:3px solid var(--exp-edge);padding:10px 12px;max-width:calc(100vw - 24px);position:sticky;left:0}.exp-grid{display:grid;grid-template-columns:repeat(2,minmax(300px,1fr));gap:10px}.exp-block{min-width:0;background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:10px 12px}.exp-block h4{margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}.exp-chips{grid-column:1 / -1}.kv{display:grid;grid-template-columns:minmax(96px,max-content) 1fr;gap:1px 12px;align-items:baseline;margin-top:3px;font-size:12.5px}.kv-label{color:var(--muted)}.kv-value{text-align:right;font-family:ui-monospace,SF Mono,Menlo,monospace;font-variant-numeric:tabular-nums}.kv .muted-note{grid-column:1 / -1;text-align:left}.band-chart{position:relative;height:50px;margin:2px 0 10px;background:var(--band-bg);border:1px solid var(--border);border-radius:4px}.band-shade{position:absolute;top:0;height:30px;background:#0d5cd724;border-left:1px solid rgba(13,92,215,.35);border-right:1px solid rgba(13,92,215,.35)}.marker{position:absolute;top:0}.marker-tick{position:absolute;top:0;left:-1px;width:2px;height:20px}.marker-cap{position:absolute;top:32px;left:0;transform:translate(-50%);font-size:10px;line-height:1.25;color:var(--muted);white-space:nowrap;text-align:center}.mk-strike .marker-tick{height:30px;background:var(--accent)}.mk-strike .marker-cap{color:var(--accent);font-weight:600}.mk-be .marker-tick{background:var(--ok)}.mk-spot .marker-tick{background:var(--ink)}.bar-row{display:grid;grid-template-columns:minmax(120px,max-content) 1fr 48px;gap:8px;align-items:center;margin-top:5px;font-size:12px}.bar-weight{color:var(--muted);font-size:10.5px}.bar-track{display:block;height:8px;background:var(--bar-track);border-radius:4px;overflow:hidden}.bar-fill{display:block;height:100%;background:var(--accent);border-radius:4px}.bar-val{text-align:right;font-family:ui-monospace,SF Mono,Menlo,monospace;font-variant-numeric:tabular-nums}.bar-row.total{margin-top:9px;padding-top:7px;border-top:1px dashed var(--border)}.bar-row.total .bar-label{font-weight:600}.chip-hidden{display:inline-block;margin:0 6px 6px 0;padding:2px 9px;border:1px solid var(--border);border-radius:999px;background:var(--page);font-size:11.5px}.chip-hidden.is-null{opacity:.55}.earnings-banner{margin-bottom:10px;padding:7px 10px;border:1px solid var(--warn-line);border-radius:5px;background:var(--warn-wash);color:var(--chip-warn-ink);font-size:12px}.stage-badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.sbadge{display:inline-block;padding:2px 9px;border:1px solid var(--border);border-radius:999px;background:var(--panel);font-size:11.5px;color:var(--muted)}.sbadge summary{cursor:pointer;list-style:none}.sbadge summary::-webkit-details-marker{display:none}.sbadge.ok{color:var(--ok);border-color:var(--badge-ok-line);background:var(--badge-ok-bg)}.sbadge.partial{color:var(--warn);border-color:var(--badge-warn-line);background:var(--badge-warn-bg)}.sbadge.failed{color:var(--err);border-color:var(--badge-err-line);background:var(--badge-err-bg)}.errbox{margin:8px 0 0;padding:8px 10px;max-height:180px;overflow:auto;background:var(--err-wash);border:1px solid var(--badge-err-line);border-radius:5px;color:var(--err);font-size:11.5px;line-height:1.4;white-space:pre-wrap}.stage-failed-panel{border-color:var(--badge-err-line);background:var(--badge-err-bg);color:var(--err)}.stage-failed-panel .errbox{background:var(--panel)}.hero{margin-top:8px;padding:26px 30px;background:var(--panel);border:1px solid var(--border);border-radius:8px}.hero h2{margin:0 0 8px;font-size:15px}.hero p{margin:7px 0;max-width:72ch}.muted-note{color:var(--muted);font-size:12px}@media(max-width:640px){.picker-panel{position:fixed;left:12px;right:12px;top:auto;bottom:12px;width:auto;max-height:calc(100vh - 60px);overflow:auto}.exp-grid,.run-stages{grid-template-columns:1fr}.tip:after{position:fixed;top:auto;bottom:12px;left:12px;right:12px;width:auto;max-width:none}.tip-flip:after{right:12px}th .tip:after{display:none!important}th .tip-target{border-bottom:0;cursor:inherit}.pager{z-index:1}.expansion{z-index:2}th{z-index:3}}@media(max-width:480px){.picker-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}details.adjust{flex:none;margin:10px 0 0;background:var(--panel);border:1px solid var(--border);border-radius:10px;overflow:hidden}details.adjust summary{padding:10px 14px;font-weight:600;cursor:pointer;-webkit-user-select:none;user-select:none;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:8px}details.adjust summary::-webkit-details-marker{display:none}details.adjust summary:after{content:"▾";color:var(--muted)}details.adjust[open] summary:after{content:"▴"}details.adjust .hint{font-weight:400;font-size:12px;color:var(--muted)}details.adjust .hint-custom{color:var(--accent)}.adjust-body{padding:2px 14px 14px;border-top:1px solid var(--border)}.adjust-body .ctl{margin:12px 0 4px}.adjust-body .ctl label{display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px}.adjust-body .ctl .val{font-variant-numeric:tabular-nums;color:var(--muted)}.adjust-body input[type=range]{width:100%;accent-color:var(--accent)}.adjust-body .reset{margin-top:10px;width:100%;padding:9px 0;border-radius:8px;border:1px solid var(--border);background:transparent;font-size:14px;cursor:pointer}.score-cell .score-frozen{display:block;font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}.score-cell .score-frozen.readmit{color:var(--readmit)}@media(max-width:640px){.controls{flex-wrap:wrap}.count-line{flex:1 0 100%}}.holdings-refresh{flex:0 0 auto}.holdings-notice{border:1px solid var(--border);background:var(--panel);border-left:3px solid var(--accent);padding:6px 10px;border-radius:6px;margin-bottom:10px;color:var(--muted)}.holdings-pos{color:var(--ok)}.holdings-neg{color:var(--err)}.holdings-add{display:flex;gap:8px;align-items:center;flex-wrap:wrap;border:1px dashed var(--border);border-radius:8px;padding:8px 10px;background:var(--panel);flex:1}.holdings-add label{display:inline-flex;gap:4px;align-items:center;color:var(--muted);font-size:11px}.holdings-add input{border:1px solid var(--border);border-radius:6px;padding:4px 6px;font:inherit;background:var(--page);color:var(--ink);max-width:110px}.holdings-add input:first-child{text-transform:uppercase}.holdings-close-btn{font-size:11px}.holdings-bar{position:relative;height:10px;border-radius:999px;background:var(--pace-track);overflow:visible}.holdings-bar-fill{position:absolute;inset:0 auto 0 0;border-radius:999px;background:var(--accent);opacity:.85}.holdings-bar-mark{position:absolute;top:-3px;bottom:-3px;width:2px;background:var(--warn)}.holdings-card-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;border-top:1px solid var(--border);padding-top:8px}.holdings-card-stats div{display:flex;flex-direction:column;min-width:0}.holdings-card-stats span{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}.holdings-card-stats b{font-variant-numeric:tabular-nums;font-size:12.5px}.holdings-card-stats i{font-style:normal;font-size:10.5px;color:var(--muted)}.holdings-outcome{border:1px solid var(--accent);border-radius:8px;background:var(--panel);padding:10px 12px;margin-top:10px;max-width:420px}.holdings-outcome-head{font-weight:600;margin-bottom:8px}.holdings-outcome-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:8px}.holdings-outcome-row label{display:inline-flex;gap:5px;align-items:center;font-size:12px}.holdings-outcome-price{display:flex;gap:6px;align-items:center;font-size:12px;margin-bottom:8px}.holdings-outcome-price input{border:1px solid var(--border);border-radius:6px;padding:4px 6px;font:inherit;width:90px}.holdings-outcome-realized{font-size:12px;color:var(--muted);margin-bottom:8px}.holdings-outcome-actions{display:flex;gap:8px;justify-content:flex-end}@media(max-width:720px){.holdings-card-stats{grid-template-columns:repeat(2,1fr)}.holdings-refresh{justify-content:center}.holdings-add{display:grid;grid-template-columns:1fr 1fr;gap:8px 10px;width:100%}.holdings-add label{display:flex;flex-direction:column;align-items:stretch;gap:2px}.holdings-add input{max-width:none;width:100%}.holdings-add .btn,.holdings-add .btn-primary{grid-column:1 / -1}}.hp-tabs-shell{padding:16px 0 0}.hp-tabs-grid{display:grid;grid-template-columns:13rem 1fr;gap:1.1rem;align-items:start}.hp-tabs-rail{display:flex;flex-direction:column;gap:.55rem;position:sticky;top:10px}.hp-tabs-brand{font-size:.62rem;opacity:.6;text-transform:uppercase;letter-spacing:.05em;padding:2px 4px}.hp-tab-tile{width:100%;text-align:left;-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;cursor:pointer;background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:.6rem .8rem;color:var(--muted)}.hp-tab-tile.active{border-color:var(--accent);box-shadow:inset 3px 0 0 var(--accent);color:var(--ink)}.hp-tab-tile-name{font-weight:700;font-size:.8rem;letter-spacing:.04em}.hp-tab-tile-count{float:right;font-weight:700;color:var(--ink);font-variant-numeric:tabular-nums}.hp-tab-tile-sub{font-size:.68rem;margin-top:2px}.hp-tabs-main{display:flex;flex-direction:column;gap:.35rem;min-width:0}.hp-pane-head{display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem}.hp-pane-title{font-weight:700;font-size:.95rem}.hp-pane-head .holdings-refresh{margin-left:auto}.hp-pane-hint{margin-left:auto;font-size:.72rem;opacity:.6}.hp-rail-block{background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:.7rem .9rem}.hp-rail-label{font-size:.68rem;opacity:.6;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.3rem}.hp-rail-big{font-size:1.6rem;font-weight:700;color:var(--ok)}.hp-rail-sub{font-size:.72rem;opacity:.6;margin-top:.15rem}.hp-lot-card{display:flex;flex-direction:column;gap:.45rem;background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:.55rem .8rem}.hp-lot-row-top{display:flex;justify-content:space-between;gap:.6rem;font-size:.85rem}.hp-lot-row-top b{font-variant-numeric:tabular-nums}.hp-lot-row-sub{display:flex;justify-content:space-between;gap:.6rem;font-size:.72rem;opacity:.78;margin-top:.1rem}.hp-lot-row-sub b{font-variant-numeric:tabular-nums}.hp-lot-actions{display:flex;gap:.4rem;justify-content:flex-end}.holdings-preview{font-size:.72rem;color:var(--muted);font-style:normal}.hp-pool-tag{display:inline-block;padding:0 .35rem;border-radius:.5rem;background:var(--band-bg);color:var(--muted);font-size:.62rem;font-weight:600;margin-left:.3rem;vertical-align:.05em}.hp-spot-session{font-style:normal;font-weight:400;font-size:.68rem;color:var(--muted);margin-left:.3rem}.hp-lot-row-meta{display:flex;justify-content:space-between;gap:.6rem;font-size:.68rem;opacity:.55;margin-top:.1rem}.hp-lot-row-meta i{font-style:normal}.hp-toolbar-row{display:flex;gap:.5rem;align-items:center;margin-bottom:.4rem}.hp-list{display:flex;flex-direction:column;gap:.35rem;margin-bottom:.75rem}.hp-list-row{display:grid;grid-template-columns:minmax(14rem,1.4fr) 5rem minmax(9rem,1fr) 8rem auto;gap:.8rem;align-items:center;background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:.55rem .8rem}.hp-list-row.hp-row-met{border-color:var(--ok)}.hp-list-head{background:transparent;border:0;padding:.1rem .8rem;font-size:.68rem;opacity:.55;text-transform:uppercase;letter-spacing:.05em}.hp-list-pos{display:flex;align-items:baseline;gap:.5rem;flex-wrap:wrap}.hp-list-pos i,.hp-list-pace i{font-style:normal;font-size:.72rem;opacity:.6}.hp-kind{font-size:.6rem;font-weight:700;letter-spacing:.06em;border-radius:5px;padding:.1rem .35rem}.hp-kind[data-kind=put]{background:var(--kind-put-bg);color:var(--kind-put-ink)}.hp-kind[data-kind=call]{background:var(--kind-call-bg);color:var(--kind-call-ink)}.hp-list-pace .holdings-bar{min-width:7rem}.hp-slot{display:flex;flex-direction:column;gap:.45rem;min-width:0}.hp-list-status{display:flex;flex-direction:column;gap:.25rem;align-items:flex-start}.hp-list-stats{grid-column:1 / -1;margin-top:.15rem}.hp-cash-edit{margin-left:auto;font-size:.75rem}.hp-cash-editor{margin-left:auto;display:flex;gap:.35rem;align-items:center}.hp-cash-editor input{flex:1 1 6rem;min-width:0;font:inherit;padding:.25rem .45rem;border:1px solid var(--border);border-radius:6px;background:var(--panel);color:inherit}.hp-cash-editor .btn{font-size:.7rem;padding:.25rem .5rem}.hp-dialog-note{font-size:.72rem;opacity:.65;margin-top:.5rem;border-top:1px solid var(--border);padding-top:.4rem}@media(max-width:900px){.hp-tabs-grid{grid-template-columns:1fr}.hp-tabs-rail{position:static;flex-direction:row;flex-wrap:wrap;align-items:stretch}.hp-tabs-brand{width:100%}.hp-tabs-rail .hp-rail-block{flex:1 1 100%;display:flex;align-items:baseline;gap:.6rem;flex-wrap:wrap}.hp-tabs-rail .hp-rail-big{font-size:1.15rem}.hp-tabs-rail .hp-pool-section{flex:1 1 100%}.hp-tab-tile{flex:1;width:auto}.hp-pane-head .hp-pane-title,.hp-list-row.hp-list-head{display:none}.hp-list-row{display:flex;flex-direction:column;align-items:stretch;gap:.45rem}.hp-list-pos{justify-content:flex-start}.hp-list-pos .hp-pool-pick,.hp-list-pos .hp-pool-tag{margin-left:auto}.hp-list-pos>i{flex:1 1 100%}.hp-list-pace{display:flex;flex-direction:column;gap:.15rem}.hp-list-status{flex-direction:row;flex-wrap:wrap}.hp-list-row .holdings-close-btn{align-self:flex-end}.hp-lot-row-top>span:first-of-type{display:inline-flex;align-items:center;gap:.3rem;flex:1}.hp-lot-row-top .hp-pool-pick{margin-left:auto}}@media(max-width:720px){.hp-cash-editor{margin-left:0}}@media(max-width:480px){.hp-tab-tile{padding:.5rem .6rem}.hp-tab-tile-sub{font-size:.62rem}}@media(prefers-color-scheme:dark){:root{color-scheme:dark;--page: #12161c;--panel: #1b222b;--border: #2c3642;--accent: #4d8dff;--ink: #e6ebf1;--muted: #9aa8b6;--ok: #3dbd6e;--warn: #d9a441;--err: #e0705c;--dot-green: #34c464;--dot-yellow: #e3b93e;--dot-red: #e0604d;--pick-tint: #37301a;--star: #e0b45a;--on-accent: #081428;--row-hover: #202a36;--pick-hover: #3d3520;--sunk: #232c37;--faint: #6b7885;--danger-ink: #e08a92;--err-wash: #3a2422;--err-line: #6b3a35;--chip-warn-bg: #3d3013;--chip-warn-ink: #e2bc63;--chip-err-bg: #402624;--chip-err-line: #6e4038;--chip-mute-bg: #273240;--chip-mute-line: #3a4656;--warn-wash: #3b3013;--warn-line: #5c4d20;--exp-open: #1e2b3d;--exp-inner: #1a222d;--exp-edge: #2f4a73;--band-bg: #232c37;--bar-track: #2a3441;--pace-track: #2a3441;--badge-ok-bg: #1d2f25;--badge-ok-line: #2f5240;--badge-warn-bg: #352c14;--badge-warn-line: #5c4d24;--badge-err-bg: #35211f;--badge-err-line: #63362f;--readmit: #34c48f;--tip-bg: #e6ebf1;--tip-ink: #1c2733;--accent-deep: #3a76e0;--kind-put-ink: #8cc0ff;--kind-call-ink: #f0c766}}html[data-theme=dark]{color-scheme:dark;--page: #12161c;--panel: #1b222b;--border: #2c3642;--accent: #4d8dff;--ink: #e6ebf1;--muted: #9aa8b6;--ok: #3dbd6e;--warn: #d9a441;--err: #e0705c;--dot-green: #34c464;--dot-yellow: #e3b93e;--dot-red: #e0604d;--pick-tint: #37301a;--star: #e0b45a;--on-accent: #081428;--row-hover: #202a36;--pick-hover: #3d3520;--sunk: #232c37;--faint: #6b7885;--danger-ink: #e08a92;--err-wash: #3a2422;--err-line: #6b3a35;--chip-warn-bg: #3d3013;--chip-warn-ink: #e2bc63;--chip-err-bg: #402624;--chip-err-line: #6e4038;--chip-mute-bg: #273240;--chip-mute-line: #3a4656;--warn-wash: #3b3013;--warn-line: #5c4d20;--exp-open: #1e2b3d;--exp-inner: #1a222d;--exp-edge: #2f4a73;--band-bg: #232c37;--bar-track: #2a3441;--pace-track: #2a3441;--badge-ok-bg: #1d2f25;--badge-ok-line: #2f5240;--badge-warn-bg: #352c14;--badge-warn-line: #5c4d24;--badge-err-bg: #35211f;--badge-err-line: #63362f;--readmit: #34c48f;--tip-bg: #e6ebf1;--tip-ink: #1c2733;--accent-deep: #3a76e0;--kind-put-ink: #8cc0ff;--kind-call-ink: #f0c766}html[data-theme=light]{color-scheme:light;--page: #f6f7f9;--panel: #ffffff;--border: #dde3ea;--accent: #0d5cd7;--ink: #1c2733;--muted: #51606f;--ok: #137a3a;--warn: #a06b00;--err: #a02a1a;--dot-green: #1a9f48;--dot-yellow: #d7a313;--dot-red: #cc4433;--pick-tint: #fdf6e0;--star: #c08a00;--on-accent: #ffffff;--row-hover: #f4f7fb;--pick-hover: #faf0cd;--sunk: #eef2f6;--faint: #9aa7b5;--danger-ink: #b3555f;--err-wash: #fdf0f0;--err-line: #e4b7b7;--chip-warn-bg: #f4e3c8;--chip-warn-ink: #8a5a00;--chip-err-bg: #f3d4d0;--chip-err-line: #e0b7b0;--chip-mute-bg: #e6ecf2;--chip-mute-line: #c9d2dd;--warn-wash: #fdf3df;--warn-line: #eedfb8;--exp-open: #eef4fc;--exp-inner: #fbfcfe;--exp-edge: #b9d2f2;--band-bg: #f2f5f8;--bar-track: #edf1f5;--pace-track: #e8edf3;--badge-ok-bg: #eef7f0;--badge-ok-line: #cfe5d6;--badge-warn-bg: #fbf3dd;--badge-warn-line: #ecd9ae;--badge-err-bg: #fbeeec;--badge-err-line: #e8c4bd;--readmit: #059669;--tip-bg: #1c2733;--tip-ink: #ffffff;--accent-deep: #0a4cb4;--kind-put-ink: #7fb5f5;--kind-call-ink: #e8b84a}.hp-pool-section{display:flex;flex-direction:column;gap:.3rem;margin-top:.45rem}.hp-pool-list{display:flex;flex-direction:column;gap:.25rem}.hp-pool-item{border:1px solid var(--border);border-radius:7px;padding:.25rem .4rem}.hp-pool-item.active{border-color:var(--accent)}.hp-pool-line{display:flex;flex-wrap:wrap;gap:.3rem .45rem;align-items:center;min-width:0}.hp-pool-name-row{display:flex;gap:.3rem;align-items:center;min-width:0;flex:1 1 100%}.hp-pool-name{font:inherit;font-size:.72rem;font-weight:700;color:var(--ink);background:transparent;border:none;padding:0;cursor:pointer;flex:1;min-width:0;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hp-pool-item.active .hp-pool-name{color:var(--accent)}.hp-pool-cash{font-size:.66rem;opacity:.7;white-space:nowrap;font-variant-numeric:tabular-nums}.hp-pool-act{font-size:.6rem;padding:.05rem .3rem}.hp-pool-row{display:flex;gap:.3rem;align-items:center}.hp-pool-row input{flex:1;min-width:0;font:inherit;font-size:.7rem;padding:.15rem .35rem;border:1px solid var(--border);border-radius:5px;background:var(--panel);color:var(--ink)}.hp-pool-row .btn{font-size:.66rem;padding:.12rem .45rem}.hp-pool-del{color:var(--err);font-size:.66rem;padding:.05rem .3rem}.hp-pool-tag{font-size:.6rem;font-weight:700;letter-spacing:.03em;color:var(--muted);background:transparent;border:1px solid var(--border);border-radius:999px;padding:.06rem .4rem;white-space:nowrap}.hp-pool-pick{font:inherit;font-size:.62rem;font-weight:700;letter-spacing:.03em;color:var(--muted);background:var(--panel);border:1px solid var(--border);border-radius:999px;padding:.06rem .4rem;white-space:nowrap;cursor:pointer}.holdings-add select{font:inherit;padding:5px 6px;border:1px solid var(--border);border-radius:5px;background:var(--panel);color:var(--ink)}
+:root{--page: #f6f7f9;--panel: #ffffff;--border: #dde3ea;--accent: #0d5cd7;--ink: #1c2733;--muted: #51606f;--ok: #137a3a;--warn: #a06b00;--err: #a02a1a;--dot-green: #1a9f48;--dot-yellow: #d7a313;--dot-red: #cc4433;--pick-tint: #fdf6e0;--star: #c08a00;--on-accent: #ffffff;--row-hover: #f4f7fb;--pick-hover: #faf0cd;--sunk: #eef2f6;--faint: #9aa7b5;--danger-ink: #b3555f;--err-wash: #fdf0f0;--err-line: #e4b7b7;--chip-warn-bg: #f4e3c8;--chip-warn-ink: #8a5a00;--chip-err-bg: #f3d4d0;--chip-err-line: #e0b7b0;--chip-mute-bg: #e6ecf2;--chip-mute-line: #c9d2dd;--warn-wash: #fdf3df;--warn-line: #eedfb8;--exp-open: #eef4fc;--exp-inner: #fbfcfe;--exp-edge: #b9d2f2;--band-bg: #f2f5f8;--bar-track: #edf1f5;--pace-track: #e8edf3;--badge-ok-bg: #eef7f0;--badge-ok-line: #cfe5d6;--badge-warn-bg: #fbf3dd;--badge-warn-line: #ecd9ae;--badge-err-bg: #fbeeec;--badge-err-line: #e8c4bd;--readmit: #059669;--tip-bg: #1c2733;--tip-ink: #ffffff;--kind-put-bg: rgba(96, 165, 250, .18);--kind-put-ink: #7fb5f5;--kind-call-bg: rgba(251, 191, 36, .16);--kind-call-ink: #e8b84a}*{box-sizing:border-box}body{margin:0;background:var(--page);color:var(--ink);font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;font-size:13px;line-height:1.45}.shell{max-width:1280px;margin:0 auto;padding:16px;height:100vh;display:flex;flex-direction:column}.brand{display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 10px;margin:0 0 4px}.brand-mark{font-size:17px;font-weight:700;letter-spacing:-.01em;color:var(--ink)}.brand-accent{color:var(--accent)}.brand-sub{font-size:10.5px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}.cache-line{color:var(--muted);margin-bottom:12px}.pill{display:inline-block;padding:1px 8px;border-radius:999px;border:1px solid var(--border);background:var(--panel);margin-left:6px}.pill.fresh{border-color:var(--ok);color:var(--ok)}.pill.stale{border-color:var(--warn);color:var(--warn)}.pill.none,.pill.closed{color:var(--muted)}.error-banner{border:1px solid var(--err-line);background:var(--err-wash);color:var(--err);padding:10px 12px;border-radius:6px;margin-bottom:12px}.tabs{display:flex;gap:4px;margin-top:4px}.tab{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--panel);border:1px solid var(--border);border-bottom:none;border-radius:8px 8px 0 0;padding:6px 14px;font:inherit;color:var(--muted);cursor:pointer}.tab.active{color:var(--ink);box-shadow:inset 0 -2px 0 var(--accent);border-color:var(--accent)}.controls{display:flex;align-items:center;flex-wrap:wrap;gap:10px;padding:8px 0}.filter-input{width:220px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--panel);font:inherit;color:var(--ink)}.filter-input:focus{outline:none;border-color:var(--accent)}.check{display:inline-flex;align-items:center;gap:5px;cursor:pointer;-webkit-user-select:none;user-select:none;color:var(--ink)}.tool-btn{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:4px 10px;font:inherit;color:var(--ink);cursor:pointer}.tool-btn:hover{border-color:var(--accent)}.count-line{margin-left:auto;color:var(--muted);white-space:nowrap}.colpicker{position:relative;display:inline-block}.pop-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:40;background:transparent}.picker-panel{position:absolute;right:0;top:calc(100% + 4px);z-index:41;background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:10px 12px;width:min(430px,92vw);box-shadow:0 8px 24px #1c27331f}.picker-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px 10px;margin-bottom:8px}.pick-item{display:flex;align-items:center;gap:6px;font-size:12px;white-space:nowrap;cursor:pointer}.linklike{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;border:none;padding:2px 0;font:inherit;font-size:12px;color:var(--accent);text-decoration:underline;cursor:pointer}table{width:100%;border-collapse:collapse;background:var(--panel);border:1px solid var(--border);font-size:12.5px}th,td{text-align:left;padding:5px 8px;border-bottom:1px solid var(--border);white-space:nowrap}th{position:sticky;top:0;z-index:2;background:var(--panel);-webkit-user-select:none;user-select:none;cursor:pointer}th:hover{color:var(--accent)}.sort-arrow{display:inline-block;margin-left:4px;color:var(--accent)}td.num,th.num{text-align:right;font-family:ui-monospace,SF Mono,Menlo,monospace;font-variant-numeric:tabular-nums}td.strong{font-weight:700}tbody tr:hover td{background:var(--row-hover)}tr.pick td{background:var(--pick-tint)}tr.pick:hover td{background:var(--pick-hover)}tr.pick b{font-weight:700}.star{color:var(--star);font-weight:700;font-size:11px;margin-right:6px}.dot{display:inline-block;width:9px;height:9px;border-radius:50%;vertical-align:middle}.dot.green{background:var(--dot-green)}.dot.yellow{background:var(--dot-yellow)}.dot.red{background:var(--dot-red)}.chip{display:inline-block;padding:1px 6px;border-radius:999px;font-size:10px;font-family:-apple-system,SF Pro Text,Segoe UI,Roboto,sans-serif;vertical-align:middle;margin-left:6px}.chip.high{background:var(--chip-warn-bg);color:var(--chip-warn-ink)}.chip.extended{background:var(--chip-err-bg);color:var(--err)}.chip.normal{background:var(--chip-mute-bg);color:var(--muted)}tr.prow td{opacity:.62}.null-mark{color:var(--danger-ink);opacity:.85}.empty-panel{border:1px dashed var(--border);background:var(--panel);border-radius:8px;padding:18px;color:var(--muted)}.pager{position:sticky;bottom:0;z-index:3;display:flex;align-items:center;flex-wrap:wrap;gap:4px;padding:6px 10px;background:var(--panel);border:1px solid var(--border);border-top:none}.pager-label{color:var(--muted);margin-right:8px;white-space:nowrap}.pgbtn{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--panel);border:1px solid var(--border);border-radius:6px;min-width:26px;padding:2px 7px;font:inherit;font-size:12px;color:var(--ink);cursor:pointer}.pgbtn:hover:not(:disabled){border-color:var(--accent)}.pgbtn.active{background:var(--accent);border-color:var(--accent);color:var(--on-accent)}.pgbtn:disabled{opacity:.45;cursor:default}.pggap{color:var(--muted);padding:0 2px}.gate-wrap{min-height:100vh;display:grid;place-items:center;padding:24px}.gate-card{width:340px;background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:22px 24px}.gate-title{display:flex;flex-direction:column;align-items:flex-start;gap:4px;margin:0 0 16px}.gate-label{display:block;font-size:12px;color:var(--muted);margin-bottom:10px}.gate-label input{display:block;width:100%;margin-top:3px;padding:6px 8px;font:inherit;color:inherit;background:var(--page);border:1px solid var(--border);border-radius:5px}.gate-label input:focus{outline:none;border-color:var(--accent)}.btn{font:inherit;padding:6px 12px;border-radius:5px;border:1px solid var(--border);background:var(--panel);color:var(--ink);cursor:pointer}.btn:hover:not(:disabled){border-color:var(--accent)}.btn:disabled{opacity:.55;cursor:default}.btn-primary{width:100%;background:var(--accent);border-color:var(--accent);color:var(--on-accent)}.gate-toggle{display:inline-block;margin-top:10px;font:inherit;font-size:12px;background:none;border:none;color:var(--accent);cursor:pointer;padding:0}.gate-or{text-align:center;color:var(--muted);font-size:11px;margin:14px 0}.gate-error{margin-top:12px;padding:7px 10px;border:1px solid var(--err-line);border-radius:5px;background:var(--err-wash);color:var(--err);font-size:12px}.gate-note{color:var(--muted)}.user-box{position:relative;float:right;display:flex;align-items:center;font-size:12px}.user-pill{display:inline-flex;align-items:center;gap:6px}.user-box .user-email{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.user-caret{color:var(--muted);font-size:9px}.account-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:45;min-width:230px;padding:6px;background:var(--panel);border:1px solid var(--border);border-radius:8px;box-shadow:0 8px 24px #1c27331f}.acct-label{padding:5px 10px 3px;font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}.acct-email{padding:0 10px 4px;font-size:12px;word-break:break-all}.account-menu .btn-ghost{display:flex;width:100%;justify-content:center;margin-top:4px}.btn-ghost{font:inherit;font-size:12px;padding:3px 10px;border-radius:6px;border:1px solid var(--border);background:var(--panel);color:var(--ink);cursor:pointer}.btn-ghost:hover{border-color:var(--accent);color:var(--accent)}.modal-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:60;background:#1c273373;display:grid;place-items:center;padding:16px}.access-card{width:min(420px,100%);max-height:min(85dvh,720px);overflow-y:auto}.access-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0;border-bottom:1px solid var(--page);font-size:12.5px}.access-email{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.access-remove{flex:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;border:none;color:var(--err);font-size:13px;cursor:pointer;padding:2px 5px;border-radius:4px}.access-remove:hover{background:var(--badge-err-bg)}.access-remove:disabled{opacity:.4;cursor:default}.access-add{display:flex;flex-direction:column;gap:8px;margin-top:10px}.access-add input{width:100%;padding:7px 9px;font:inherit;color:inherit;background:var(--page);border:1px solid var(--border);border-radius:5px}.access-add .btn{width:100%}.access-add input:focus{outline:none;border-color:var(--accent)}.run-slot-head{float:right;margin-left:12px}.theme-slot-head{float:right;margin:0 10px;display:flex;align-items:center}.run-btn{font:inherit;padding:5px 14px;border-radius:5px;border:1px solid var(--accent);background:var(--accent);color:var(--on-accent);cursor:pointer}.run-btn:hover:not(:disabled){background:var(--accent-deep)}.run-btn:disabled{background:var(--chip-mute-bg);border-color:var(--chip-mute-line);color:var(--muted);cursor:default}.run-strip{clear:both;border:1px solid var(--border);background:var(--panel);border-radius:6px;padding:10px 14px;margin-bottom:14px}.toast-cached{background:var(--pick-tint);border:1px solid var(--warn-line);color:var(--chip-warn-ink);border-radius:5px;padding:6px 10px;font-size:12px;margin-bottom:8px}.toast-cached.warn{background:var(--chip-err-bg);border-color:var(--chip-err-line);color:var(--err)}.run-headline{font-size:13px;margin-bottom:8px}.run-stages{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(220px,1fr));gap:4px 24px}.run-stage{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--muted)}.run-stage .mark{width:1.1em;text-align:center}.run-stage.pending .mark{color:var(--faint)}.run-stage.active{color:var(--accent)}.run-stage.ok{color:var(--ok)}.run-stage.partial{color:var(--warn)}.run-stage.failed{color:var(--dot-red)}.run-count{font-variant-numeric:tabular-nums;color:var(--muted)}.run-bar{flex:1;height:6px;min-width:80px;background:var(--sunk);border-radius:3px;overflow:hidden}.run-bar .fill{display:block;height:100%;background:var(--accent);transition:width .25s ease-out}.run-errors{font-size:12px;color:var(--muted);margin-top:6px}.run-errors summary{cursor:pointer;color:var(--muted)}.run-errors ul{margin:6px 0 0 18px}.run-warn{margin-top:8px;font-size:12px;color:var(--err)}.pane{display:flex;flex-direction:column;flex:1 1 auto;min-height:0}.pane[hidden]{display:none}.scroll-region{flex:1 1 auto;min-height:140px;overflow:auto}.tip{position:relative}.tip-target{border-bottom:1px dotted var(--faint);cursor:help}.tip:after{content:attr(data-tip);display:none;position:absolute;top:calc(100% + 6px);left:0;z-index:40;width:max-content;max-width:340px;padding:6px 9px;border-radius:6px;background:var(--tip-bg);color:var(--tip-ink);font-size:11.5px;font-weight:400;line-height:1.45;white-space:normal;text-align:left;box-shadow:0 2px 10px #1c273347;pointer-events:none}.tip:hover:after,.tip:focus-within:after{display:block}.tip-flip:after{left:auto;right:0}tr.expandable{cursor:pointer}tr.expandable.open td{background:var(--exp-open)}th.exp-col,td.exp-col{width:26px;min-width:26px;padding:5px 2px;text-align:center;color:var(--muted)}tr.exp-row>td{background:var(--exp-inner);white-space:normal;padding:0}.expansion{border-left:3px solid var(--exp-edge);padding:10px 12px;max-width:calc(100vw - 24px);position:sticky;left:0}.exp-grid{display:grid;grid-template-columns:repeat(2,minmax(300px,1fr));gap:10px}.exp-block{min-width:0;background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:10px 12px}.exp-block h4{margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}.exp-chips{grid-column:1 / -1}.kv{display:grid;grid-template-columns:minmax(96px,max-content) 1fr;gap:1px 12px;align-items:baseline;margin-top:3px;font-size:12.5px}.kv-label{color:var(--muted)}.kv-value{text-align:right;font-family:ui-monospace,SF Mono,Menlo,monospace;font-variant-numeric:tabular-nums}.kv .muted-note{grid-column:1 / -1;text-align:left}.band-chart{position:relative;height:50px;margin:2px 0 10px;background:var(--band-bg);border:1px solid var(--border);border-radius:4px}.band-shade{position:absolute;top:0;height:30px;background:#0d5cd724;border-left:1px solid rgba(13,92,215,.35);border-right:1px solid rgba(13,92,215,.35)}.marker{position:absolute;top:0}.marker-tick{position:absolute;top:0;left:-1px;width:2px;height:20px}.marker-cap{position:absolute;top:32px;left:0;transform:translate(-50%);font-size:10px;line-height:1.25;color:var(--muted);white-space:nowrap;text-align:center}.mk-strike .marker-tick{height:30px;background:var(--accent)}.mk-strike .marker-cap{color:var(--accent);font-weight:600}.mk-be .marker-tick{background:var(--ok)}.mk-spot .marker-tick{background:var(--ink)}.bar-row{display:grid;grid-template-columns:minmax(120px,max-content) 1fr 48px;gap:8px;align-items:center;margin-top:5px;font-size:12px}.bar-weight{color:var(--muted);font-size:10.5px}.bar-track{display:block;height:8px;background:var(--bar-track);border-radius:4px;overflow:hidden}.bar-fill{display:block;height:100%;background:var(--accent);border-radius:4px}.bar-val{text-align:right;font-family:ui-monospace,SF Mono,Menlo,monospace;font-variant-numeric:tabular-nums}.bar-row.total{margin-top:9px;padding-top:7px;border-top:1px dashed var(--border)}.bar-row.total .bar-label{font-weight:600}.chip-hidden{display:inline-block;margin:0 6px 6px 0;padding:2px 9px;border:1px solid var(--border);border-radius:999px;background:var(--page);font-size:11.5px}.chip-hidden.is-null{opacity:.55}.earnings-banner{margin-bottom:10px;padding:7px 10px;border:1px solid var(--warn-line);border-radius:5px;background:var(--warn-wash);color:var(--chip-warn-ink);font-size:12px}.stage-badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.sbadge{display:inline-block;padding:2px 9px;border:1px solid var(--border);border-radius:999px;background:var(--panel);font-size:11.5px;color:var(--muted)}.sbadge summary{cursor:pointer;list-style:none}.sbadge summary::-webkit-details-marker{display:none}.sbadge.ok{color:var(--ok);border-color:var(--badge-ok-line);background:var(--badge-ok-bg)}.sbadge.partial{color:var(--warn);border-color:var(--badge-warn-line);background:var(--badge-warn-bg)}.sbadge.failed{color:var(--err);border-color:var(--badge-err-line);background:var(--badge-err-bg)}.errbox{margin:8px 0 0;padding:8px 10px;max-height:180px;overflow:auto;background:var(--err-wash);border:1px solid var(--badge-err-line);border-radius:5px;color:var(--err);font-size:11.5px;line-height:1.4;white-space:pre-wrap}.stage-failed-panel{border-color:var(--badge-err-line);background:var(--badge-err-bg);color:var(--err)}.stage-failed-panel .errbox{background:var(--panel)}.hero{margin-top:8px;padding:26px 30px;background:var(--panel);border:1px solid var(--border);border-radius:8px}.hero h2{margin:0 0 8px;font-size:15px}.hero p{margin:7px 0;max-width:72ch}.muted-note{color:var(--muted);font-size:12px}@media(max-width:640px){.picker-panel{position:fixed;left:12px;right:12px;top:auto;bottom:12px;width:auto;max-height:calc(100vh - 60px);overflow:auto}.exp-grid,.run-stages{grid-template-columns:1fr}.tip:after{position:fixed;top:auto;bottom:12px;left:12px;right:12px;width:auto;max-width:none}.tip-flip:after{right:12px}th .tip:after{display:none!important}th .tip-target{border-bottom:0;cursor:inherit}.pager{z-index:1}.expansion{z-index:2}th{z-index:3}}@media(max-width:480px){.picker-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}details.adjust{flex:none;margin:10px 0 0;background:var(--panel);border:1px solid var(--border);border-radius:10px;overflow:hidden}details.adjust summary{padding:10px 14px;font-weight:600;cursor:pointer;-webkit-user-select:none;user-select:none;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:8px}details.adjust summary::-webkit-details-marker{display:none}details.adjust summary:after{content:"▾";color:var(--muted)}details.adjust[open] summary:after{content:"▴"}details.adjust .hint{font-weight:400;font-size:12px;color:var(--muted)}details.adjust .hint-custom{color:var(--accent)}.adjust-body{padding:2px 14px 14px;border-top:1px solid var(--border)}.adjust-body .ctl{margin:12px 0 4px}.adjust-body .ctl label{display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px}.adjust-body .ctl .val{font-variant-numeric:tabular-nums;color:var(--muted)}.adjust-body input[type=range]{width:100%;accent-color:var(--accent)}.adjust-body .reset{margin-top:10px;width:100%;padding:9px 0;border-radius:8px;border:1px solid var(--border);background:transparent;font-size:14px;cursor:pointer}.score-cell .score-frozen{display:block;font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}.score-cell .score-frozen.readmit{color:var(--readmit)}@media(max-width:640px){.controls{flex-wrap:wrap}.count-line{flex:1 0 100%}}.holdings-refresh{flex:0 0 auto;min-height:44px;font-size:14px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;padding:8px 14px}.holdings-notice{border:1px solid var(--border);background:var(--panel);border-left:4px solid var(--accent);padding:10px 14px;border-radius:8px;margin-bottom:12px;color:var(--ink);font-size:14px;line-height:1.4}.holdings-pos{color:var(--ok)}.holdings-neg{color:var(--err)}.holdings-add{display:flex;gap:10px;align-items:center;flex-wrap:wrap;border:1px dashed var(--border);border-radius:10px;padding:12px 14px;background:var(--panel);flex:1}.holdings-add label{display:inline-flex;gap:6px;align-items:center;color:var(--muted);font-size:13.5px;font-weight:600}.holdings-add input{border:1px solid var(--border);border-radius:6px;padding:6px 10px;font:inherit;font-size:14px;background:var(--page);color:var(--ink);min-height:40px;max-width:120px}.holdings-add input:first-child{text-transform:uppercase}.holdings-close-btn{font-size:13px;font-weight:600;min-height:44px;padding:6px 14px;display:inline-flex;align-items:center;justify-content:center}.holdings-bar{position:relative;height:12px;border-radius:999px;background:var(--pace-track);overflow:visible}.holdings-bar-fill{position:absolute;inset:0 auto 0 0;border-radius:999px;background:var(--accent);opacity:.95}.holdings-bar-mark{position:absolute;top:-4px;bottom:-4px;width:3px;background:var(--warn);border-radius:1px}.holdings-card-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;border-top:1px solid var(--border);padding-top:10px}.holdings-card-stats div{display:flex;flex-direction:column;min-width:0}.holdings-card-stats span{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}.holdings-card-stats b{font-variant-numeric:tabular-nums;font-size:14px}.holdings-card-stats i{font-style:normal;font-size:12px;color:var(--muted)}.holdings-outcome{border:1px solid var(--accent);border-radius:10px;background:var(--panel);padding:14px 16px;margin-top:10px;max-width:440px}.holdings-outcome-head{font-weight:700;font-size:15px;margin-bottom:10px}.holdings-outcome-row{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:10px}.holdings-outcome-row label{display:inline-flex;gap:6px;align-items:center;font-size:13.5px}.holdings-outcome-price{display:flex;gap:8px;align-items:center;font-size:13.5px;margin-bottom:10px}.holdings-outcome-price input{border:1px solid var(--border);border-radius:6px;padding:6px 10px;font:inherit;font-size:14px;min-height:40px;width:110px}.holdings-outcome-realized{font-size:13.5px;color:var(--muted);margin-bottom:10px}.holdings-outcome-actions{display:flex;gap:10px;justify-content:flex-end}.holdings-outcome-actions .btn{min-height:40px;padding:6px 14px;font-size:14px}@media(max-width:720px){.holdings-card-stats{grid-template-columns:repeat(2,1fr)}.holdings-refresh{justify-content:center}.holdings-add{display:grid;grid-template-columns:1fr 1fr;gap:10px 12px;width:100%}.holdings-add label{display:flex;flex-direction:column;align-items:stretch;gap:4px}.holdings-add input{max-width:none;width:100%;min-height:44px}.holdings-add .btn,.holdings-add .btn-primary{grid-column:1 / -1;min-height:44px}}.hp-tabs-shell{padding:16px 0 0;font-size:14px;line-height:1.45}.hp-tabs-grid{display:grid;grid-template-columns:14rem 1fr;gap:1.25rem;align-items:start}.hp-tabs-rail{display:flex;flex-direction:column;gap:.65rem;position:sticky;top:10px}.hp-tabs-brand{font-size:.82rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;padding:4px 6px}.hp-tab-tile,.hp-mobile-tile{width:100%;text-align:left;-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;cursor:pointer;background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:.75rem .95rem;color:var(--muted);min-height:52px;transition:border-color .15s,box-shadow .15s,color .15s}.hp-tab-tile.active,.hp-mobile-tile.active{border-color:var(--accent);box-shadow:inset 3px 0 0 var(--accent);color:var(--ink)}.hp-tab-tile-name{font-weight:700;font-size:.95rem;letter-spacing:.04em}.hp-tab-tile-count{float:right;font-weight:700;color:var(--ink);font-variant-numeric:tabular-nums;font-size:.95rem}.hp-tab-tile-sub{font-size:.82rem;margin-top:3px;color:var(--muted)}.hp-tabs-main{display:flex;flex-direction:column;gap:.5rem;min-width:0}.hp-pane-head{display:flex;align-items:center;gap:.6rem;margin-bottom:.5rem}.hp-pane-title{font-weight:700;font-size:1.15rem;color:var(--ink)}.hp-pane-head .holdings-refresh{margin-left:auto}.hp-pane-hint{margin-left:auto;font-size:.85rem;color:var(--muted)}.hp-rail-block{background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:.85rem 1rem}.hp-rail-label{font-size:.82rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.35rem}.hp-rail-big{font-size:1.65rem;font-weight:800;color:var(--ok);line-height:1.2}.hp-rail-sub{font-size:.85rem;color:var(--muted);margin-top:.25rem}.hp-pos-card{display:flex;flex-direction:column;background:var(--panel);border:1px solid var(--border);border-radius:12px;overflow:hidden;transition:border-color .15s,box-shadow .15s}.hp-pos-card:hover{border-color:var(--accent)}.hp-pos-card.hp-row-met{border-color:var(--ok)}.hp-card-summary{display:flex;flex-direction:column;gap:.5rem;padding:.85rem 1.1rem;cursor:pointer;-webkit-user-select:none;user-select:none}.hp-card-top{display:flex;align-items:center;justify-content:space-between;gap:.75rem}.hp-card-symbol-line{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}.hp-card-symbol{font-size:1.15rem;font-weight:800;letter-spacing:.02em;color:var(--ink)}.hp-card-main{display:flex;align-items:baseline;justify-content:space-between;gap:.75rem;flex-wrap:wrap}.hp-card-meta{font-size:.9rem;color:var(--muted);font-weight:500}.hp-card-pl{font-size:1.05rem;font-weight:700;font-variant-numeric:tabular-nums;display:inline-flex;align-items:baseline;gap:.35rem}.hp-card-actions{display:flex;gap:.6rem;align-items:center;justify-content:flex-end;padding-top:.35rem;border-top:1px solid var(--border);margin-top:.2rem}.hp-card-actions .btn,.hp-card-actions .holdings-close-btn{min-height:44px;min-width:44px;padding:8px 16px;font-size:13.5px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;border-radius:8px}.hp-card-drawer{padding:.85rem 1.1rem;background:var(--page);border-top:1px solid var(--border);display:flex;flex-direction:column;gap:.65rem}.hp-card-drawer[hidden]{display:none!important}.hp-lot-card{display:flex;flex-direction:column;gap:.55rem;background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:.85rem 1.1rem}.hp-lot-row-top{display:flex;justify-content:space-between;gap:.75rem;font-size:1.05rem}.hp-lot-row-top b{font-variant-numeric:tabular-nums;font-size:1.1rem}.hp-lot-row-sub{display:flex;justify-content:space-between;gap:.75rem;font-size:.9rem;color:var(--muted);margin-top:.2rem}.hp-lot-row-sub b{font-variant-numeric:tabular-nums;font-size:1rem}.hp-lot-actions{display:flex;gap:.6rem;justify-content:flex-end;align-items:center}.hp-lot-actions .btn,.hp-lot-actions .holdings-close-btn{min-height:44px;min-width:44px;padding:8px 16px;font-size:13.5px;font-weight:600;display:inline-flex;align-items:center;justify-content:center}.holdings-preview{font-size:.9rem;color:var(--muted);font-style:normal;line-height:1.4}.hp-pool-tag{display:inline-block;padding:.15rem .55rem;border-radius:999px;background:var(--band-bg);border:1px solid var(--border);color:var(--muted);font-size:.78rem;font-weight:700;margin-left:.35rem;vertical-align:.05em;white-space:nowrap}.hp-spot-session{font-style:normal;font-weight:600;font-size:.8rem;color:var(--muted);margin-left:.35rem}.hp-lot-row-meta{display:flex;justify-content:space-between;gap:.75rem;font-size:.85rem;color:var(--muted);margin-top:.2rem}.hp-lot-row-meta i{font-style:normal}.hp-toolbar-row{display:flex;gap:.75rem;align-items:center;margin-bottom:.5rem}.hp-toolbar-row .btn{min-height:44px;padding:8px 16px;font-size:14px;font-weight:600;border-radius:8px}.hp-list{display:flex;flex-direction:column;gap:.5rem;margin-bottom:1rem}.hp-list-row{display:grid;grid-template-columns:minmax(14rem,1.4fr) 5.5rem minmax(9rem,1fr) 8.5rem auto;gap:.9rem;align-items:center;background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:.75rem 1rem}.hp-list-row.hp-row-met{border-color:var(--ok)}.hp-list-head{background:transparent;border:0;padding:.2rem 1rem;font-size:.82rem;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.05em}.hp-list-pos{display:flex;align-items:baseline;gap:.55rem;flex-wrap:wrap}.hp-list-pos i,.hp-list-pace i{font-style:normal;font-size:.85rem;color:var(--muted)}.hp-kind{font-size:.75rem;font-weight:700;letter-spacing:.06em;border-radius:6px;padding:.15rem .5rem}.hp-kind[data-kind=put]{background:var(--kind-put-bg);color:var(--kind-put-ink)}.hp-kind[data-kind=call]{background:var(--kind-call-bg);color:var(--kind-call-ink)}.hp-list-pace .holdings-bar{min-width:7.5rem}.hp-slot{display:flex;flex-direction:column;gap:.5rem;min-width:0}.hp-list-status{display:flex;flex-direction:column;gap:.35rem;align-items:flex-start}.hp-list-stats{grid-column:1 / -1;margin-top:.25rem}.hp-cash-edit{margin-left:auto;font-size:.85rem;min-height:44px;display:inline-flex;align-items:center}.hp-cash-editor{margin-left:auto;display:flex;gap:.5rem;align-items:center}.hp-cash-editor input{flex:1 1 7rem;min-width:0;font:inherit;font-size:14px;padding:.4rem .6rem;border:1px solid var(--border);border-radius:6px;background:var(--panel);color:inherit;min-height:40px}.hp-cash-editor .btn{font-size:13.5px;padding:.4rem .8rem;min-height:40px}.hp-dialog-note{font-size:.85rem;color:var(--muted);margin-top:.6rem;border-top:1px solid var(--border);padding-top:.5rem}.hp-cash-bar,.hp-mobile-tabs{display:none}.hp-pool-sheet{display:flex;position:fixed;top:0;right:0;bottom:0;left:0;z-index:1000;align-items:flex-end;justify-content:center}.hp-pool-sheet[hidden]{display:none!important}.hp-action-sheet{display:flex;position:fixed;top:0;right:0;bottom:0;left:0;z-index:1000;align-items:flex-end;justify-content:center}.hp-action-sheet[hidden]{display:none!important}.hp-sheet-backdrop{position:absolute;top:0;right:0;bottom:0;left:0;background:#0009;-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px)}.hp-sheet-container{position:relative;width:100%;max-width:540px;max-height:85vh;overflow-y:auto;background:var(--panel);border:1px solid var(--border);border-top-left-radius:16px;border-top-right-radius:16px;padding:1.25rem 1.4rem;box-shadow:0 -4px 24px #00000059;display:flex;flex-direction:column;gap:1rem}.hp-sheet-header{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);padding-bottom:.75rem}.hp-sheet-title{font-size:1.2rem;font-weight:800;color:var(--ink)}.hp-sheet-close{background:transparent;border:none;font-size:1.5rem;color:var(--muted);cursor:pointer;min-height:44px;min-width:44px;display:flex;align-items:center;justify-content:center;border-radius:8px}.hp-sheet-body{display:flex;flex-direction:column;gap:.85rem}.hp-sheet-footer{display:flex;gap:.75rem;align-items:center;justify-content:flex-end;border-top:1px solid var(--border);padding-top:.85rem}.hp-sheet-footer .btn{min-height:48px;padding:0 1.25rem;font-size:15px;font-weight:700;border-radius:10px}.hp-form-hint{font-size:.88rem;font-weight:600;color:var(--err);background:var(--err-wash, rgba(224, 112, 92, .1));border:1px solid var(--err-line, rgba(224, 112, 92, .3));border-radius:8px;padding:.6rem .85rem;line-height:1.35}.hp-action-sheet .holdings-add{display:flex;flex-direction:column;gap:12px;border:none;background:transparent;padding:0;width:100%}.hp-action-sheet .holdings-add label{display:flex;flex-direction:column;align-items:stretch;gap:6px;font-size:14px;font-weight:700;color:var(--ink)}.hp-action-sheet .holdings-add input,.hp-action-sheet .holdings-add select{box-sizing:border-box;width:100%;max-width:100%;min-height:48px;border-radius:8px;font-size:15px;padding:10px 12px}.hp-action-sheet .holdings-add .btn,.hp-action-sheet .holdings-add .btn-primary{min-height:48px;font-size:15px;font-weight:700;border-radius:10px;width:100%}.hp-action-sheet .hp-sheet-cancel{background:transparent;border:1px solid var(--border);color:var(--muted)}.hp-action-sheet .holdings-outcome{border:none;background:transparent;padding:0;margin:0;max-width:100%}.hp-action-sheet .holdings-outcome-head{display:none}.hp-action-sheet .holdings-outcome-row{display:flex;flex-direction:column;gap:10px;margin-bottom:12px}.hp-action-sheet .holdings-outcome-row label{display:flex;align-items:center;gap:10px;font-size:15px;font-weight:600;min-height:44px;padding:6px 12px;background:var(--page);border:1px solid var(--border);border-radius:8px;cursor:pointer}.hp-action-sheet .holdings-outcome-price{display:flex;flex-direction:column;align-items:stretch;gap:6px;font-size:14px;font-weight:700;margin-bottom:12px}.hp-action-sheet .holdings-outcome-price input{width:100%;min-height:48px;font-size:15px;border-radius:8px;padding:10px 12px;box-sizing:border-box}.hp-action-sheet .holdings-outcome-realized{font-size:15px;font-weight:600;margin-bottom:12px;padding:10px 12px;background:var(--page);border-radius:8px}.hp-action-sheet .holdings-outcome-actions{display:flex;flex-direction:column-reverse;gap:10px}.hp-action-sheet .holdings-outcome-actions .btn{width:100%;min-height:48px;font-size:15px;font-weight:700;border-radius:10px}@media(min-width:901px){.hp-action-sheet{align-items:center;justify-content:center}.hp-sheet-container{border-radius:16px;max-height:80vh}}.hp-toast-container{position:fixed;bottom:24px;left:50%;transform:translate(-50%);z-index:1100;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;width:90%;max-width:460px}.hp-toast{pointer-events:auto;display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;padding:12px 18px;border-radius:12px;font-size:14.5px;font-weight:600;line-height:1.4;box-shadow:0 6px 20px #00000059;animation:hpToastIn .25s ease-out}@keyframes hpToastIn{0%{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}.hp-toast-ok{background:var(--ok);color:#fff;border:1px solid rgba(255,255,255,.2)}.hp-toast-err{background:var(--err);color:#fff;border:1px solid rgba(255,255,255,.2)}.hp-toast-dismiss{background:transparent;border:none;color:inherit;font-size:1.4rem;cursor:pointer;min-height:44px;min-width:44px;display:flex;align-items:center;justify-content:center;border-radius:6px;opacity:.9}.hp-toast-dismiss:hover{opacity:1}@media(max-width:900px){.hp-tabs-grid{grid-template-columns:1fr}.hp-tabs-rail{display:none}.hp-cash-bar{display:flex;flex-direction:column;gap:.4rem;background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:.75rem 1rem;margin-bottom:.6rem}.hp-cash-bar-headline{display:flex;justify-content:space-between;align-items:baseline;gap:.5rem}.hp-cash-bar-total{font-size:1.25rem;font-weight:800;color:var(--ink)}.hp-cash-bar-free{font-size:1.15rem;font-weight:800;color:var(--ok)}.hp-cash-bar-subline{display:flex;justify-content:space-between;align-items:center;gap:.5rem}.hp-cash-bar-reserved{font-size:.88rem;color:var(--muted);font-weight:500}.hp-pool-sheet-btn{min-height:44px;min-width:44px;padding:0 1rem;font-size:13.5px;font-weight:700;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;background:var(--band-bg);border:1px solid var(--border);color:var(--ink);cursor:pointer}.hp-mobile-tabs{display:flex;gap:.5rem;margin-bottom:.6rem}.hp-mobile-tabs .hp-tab-tile,.hp-mobile-tabs .hp-mobile-tile{flex:1;min-height:52px;padding:.6rem .5rem;text-align:center}.hp-mobile-tabs .hp-tab-tile-count{float:none;margin-left:.35rem}.hp-pane-head .hp-pane-title,.hp-list-row.hp-list-head{display:none}.holdings-close-btn,.hp-pool-act,.hp-pool-del,.hp-pool-pick,.hp-tabs-main .btn,.hp-pool-sheet-btn,.hp-sheet-close,.hp-toast-dismiss{min-height:44px;min-width:44px;font-size:14px}}@media(max-width:480px){.hp-tab-tile{padding:.55rem .5rem}.hp-tab-tile-sub{font-size:.8rem}}@media(prefers-color-scheme:dark){:root{color-scheme:dark;--page: #12161c;--panel: #1b222b;--border: #2c3642;--accent: #4d8dff;--ink: #e6ebf1;--muted: #9aa8b6;--ok: #3dbd6e;--warn: #d9a441;--err: #e0705c;--dot-green: #34c464;--dot-yellow: #e3b93e;--dot-red: #e0604d;--pick-tint: #37301a;--star: #e0b45a;--on-accent: #081428;--row-hover: #202a36;--pick-hover: #3d3520;--sunk: #232c37;--faint: #6b7885;--danger-ink: #e08a92;--err-wash: #3a2422;--err-line: #6b3a35;--chip-warn-bg: #3d3013;--chip-warn-ink: #e2bc63;--chip-err-bg: #402624;--chip-err-line: #6e4038;--chip-mute-bg: #273240;--chip-mute-line: #3a4656;--warn-wash: #3b3013;--warn-line: #5c4d20;--exp-open: #1e2b3d;--exp-inner: #1a222d;--exp-edge: #2f4a73;--band-bg: #232c37;--bar-track: #2a3441;--pace-track: #2a3441;--badge-ok-bg: #1d2f25;--badge-ok-line: #2f5240;--badge-warn-bg: #352c14;--badge-warn-line: #5c4d24;--badge-err-bg: #35211f;--badge-err-line: #63362f;--readmit: #34c48f;--tip-bg: #e6ebf1;--tip-ink: #1c2733;--accent-deep: #3a76e0;--kind-put-ink: #8cc0ff;--kind-call-ink: #f0c766}}html[data-theme=dark]{color-scheme:dark;--page: #12161c;--panel: #1b222b;--border: #2c3642;--accent: #4d8dff;--ink: #e6ebf1;--muted: #9aa8b6;--ok: #3dbd6e;--warn: #d9a441;--err: #e0705c;--dot-green: #34c464;--dot-yellow: #e3b93e;--dot-red: #e0604d;--pick-tint: #37301a;--star: #e0b45a;--on-accent: #081428;--row-hover: #202a36;--pick-hover: #3d3520;--sunk: #232c37;--faint: #6b7885;--danger-ink: #e08a92;--err-wash: #3a2422;--err-line: #6b3a35;--chip-warn-bg: #3d3013;--chip-warn-ink: #e2bc63;--chip-err-bg: #402624;--chip-err-line: #6e4038;--chip-mute-bg: #273240;--chip-mute-line: #3a4656;--warn-wash: #3b3013;--warn-line: #5c4d20;--exp-open: #1e2b3d;--exp-inner: #1a222d;--exp-edge: #2f4a73;--band-bg: #232c37;--bar-track: #2a3441;--pace-track: #2a3441;--badge-ok-bg: #1d2f25;--badge-ok-line: #2f5240;--badge-warn-bg: #352c14;--badge-warn-line: #5c4d24;--badge-err-bg: #35211f;--badge-err-line: #63362f;--readmit: #34c48f;--tip-bg: #e6ebf1;--tip-ink: #1c2733;--accent-deep: #3a76e0;--kind-put-ink: #8cc0ff;--kind-call-ink: #f0c766}html[data-theme=light]{color-scheme:light;--page: #f6f7f9;--panel: #ffffff;--border: #dde3ea;--accent: #0d5cd7;--ink: #1c2733;--muted: #51606f;--ok: #137a3a;--warn: #a06b00;--err: #a02a1a;--dot-green: #1a9f48;--dot-yellow: #d7a313;--dot-red: #cc4433;--pick-tint: #fdf6e0;--star: #c08a00;--on-accent: #ffffff;--row-hover: #f4f7fb;--pick-hover: #faf0cd;--sunk: #eef2f6;--faint: #9aa7b5;--danger-ink: #b3555f;--err-wash: #fdf0f0;--err-line: #e4b7b7;--chip-warn-bg: #f4e3c8;--chip-warn-ink: #8a5a00;--chip-err-bg: #f3d4d0;--chip-err-line: #e0b7b0;--chip-mute-bg: #e6ecf2;--chip-mute-line: #c9d2dd;--warn-wash: #fdf3df;--warn-line: #eedfb8;--exp-open: #eef4fc;--exp-inner: #fbfcfe;--exp-edge: #b9d2f2;--band-bg: #f2f5f8;--bar-track: #edf1f5;--pace-track: #e8edf3;--badge-ok-bg: #eef7f0;--badge-ok-line: #cfe5d6;--badge-warn-bg: #fbf3dd;--badge-warn-line: #ecd9ae;--badge-err-bg: #fbeeec;--badge-err-line: #e8c4bd;--readmit: #059669;--tip-bg: #1c2733;--tip-ink: #ffffff;--accent-deep: #0a4cb4;--kind-put-ink: #7fb5f5;--kind-call-ink: #e8b84a}.hp-pool-section{display:flex;flex-direction:column;gap:.5rem;margin-top:.65rem}.hp-pool-list{display:flex;flex-direction:column;gap:.45rem}.hp-pool-item{border:1px solid var(--border);border-radius:8px;padding:.5rem .65rem;background:var(--panel)}.hp-pool-item.active{border-color:var(--accent)}.hp-pool-line{display:flex;flex-wrap:wrap;gap:.5rem .65rem;align-items:center;min-width:0}.hp-pool-name-row{display:flex;gap:.5rem;align-items:center;min-width:0;flex:1 1 100%}.hp-pool-name{font:inherit;font-size:.95rem;font-weight:700;color:var(--ink);background:transparent;border:none;padding:0;cursor:pointer;flex:1;min-width:0;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hp-pool-item.active .hp-pool-name{color:var(--accent)}.hp-pool-cash{font-size:.88rem;color:var(--muted);white-space:nowrap;font-variant-numeric:tabular-nums;font-weight:600}.hp-pool-act{font-size:.82rem;font-weight:600;padding:.25rem .6rem;border-radius:6px;cursor:pointer}.hp-pool-row{display:flex;gap:.45rem;align-items:center}.hp-pool-row input{flex:1;min-width:0;font:inherit;font-size:.85rem;padding:.35rem .55rem;border:1px solid var(--border);border-radius:6px;background:var(--panel);color:var(--ink);min-height:38px}.hp-pool-row .btn{font-size:.82rem;padding:.3rem .7rem;min-height:38px;font-weight:600}.hp-pool-del{color:var(--err);font-size:1.1rem;font-weight:800;padding:.2rem .55rem;cursor:pointer;border-radius:6px}.hp-pool-tag{font-size:.78rem;font-weight:700;letter-spacing:.03em;color:var(--muted);background:transparent;border:1px solid var(--border);border-radius:999px;padding:.15rem .5rem;white-space:nowrap}.hp-pool-pick{font:inherit;font-size:.82rem;font-weight:700;letter-spacing:.03em;color:var(--muted);background:var(--panel);border:1px solid var(--border);border-radius:999px;padding:.2rem .6rem;white-space:nowrap;cursor:pointer;min-height:38px}.holdings-add select{font:inherit;font-size:.9rem;padding:6px 10px;border:1px solid var(--border);border-radius:6px;background:var(--panel);color:var(--ink);min-height:40px}
diff --git a/crates/webapp/frontend/dist/assets/app.js b/crates/webapp/frontend/dist/assets/app.js
index ed1bb21..b9312a9 100644
--- a/crates/webapp/frontend/dist/assets/app.js
+++ b/crates/webapp/frontend/dist/assets/app.js
@@ -1,4 +1,4 @@
-(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const Ts=!1,As=(t,e)=>t===e,Wn=Symbol("solid-proxy"),Ps=typeof Proxy=="function",Rs=Symbol("solid-track"),nn={equals:As};let ci=fi;const Le=1,rn=2,ui={owned:null,cleanups:null,context:null,owner:null},kn={};var Q=null;let En=null,xs=null,X=null,oe=null,xe=null,mn=0;function Kt(t,e){const n=X,r=Q,i=t.length===0,s=e===void 0?r:e,a=i?ui:{owned:null,cleanups:null,context:s?s.context:null,owner:s},o=i?t:()=>t(()=>me(()=>xt(a)));Q=a,X=null;try{return Ke(o,!0)}finally{X=n,Q=r}}function M(t,e){e=e?Object.assign({},nn,e):nn;const n={value:t,observers:null,observerSlots:null,comparator:e.equals||void 0},r=i=>(typeof i=="function"&&(i=i(n.value)),hi(n,i));return[di.bind(n),r]}function Os(t,e,n){const r=_n(t,e,!0,Le);wt(r)}function v(t,e,n){const r=_n(t,e,!1,Le);wt(r)}function et(t,e,n){ci=Bs;const r=_n(t,e,!1,Le);r.user=!0,xe?xe.push(r):wt(r)}function ae(t,e,n){n=n?Object.assign({},nn,n):nn;const r=_n(t,e,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,wt(r),di.bind(r)}function Ns(t){return t&&typeof t=="object"&&"then"in t}function Ds(t,e,n){let r,i,s;typeof e=="function"?(r=t,i=e,s={}):(r=!0,i=t,s=e||{});let a=null,o=kn,l=!1,c="initialValue"in s,d=typeof r=="function"&&ae(r);const h=new Set,[p,m]=(s.storage||M)(s.initialValue),[b,T]=M(void 0),[_,S]=M(void 0,{equals:!1}),[E,O]=M(c?"ready":"unresolved");Q&&Oe(()=>{for(const P of h.keys())P.decrement();h.clear(),a=null});function R(P,$,N,V){return a===P&&(a=null,V!==void 0&&(c=!0),(P===o||$===o)&&s.onHydrated&&queueMicrotask(()=>s.onHydrated(V,{value:$})),o=kn,D($,N)),$}function D(P,$){Ke(()=>{$===void 0&&m(()=>P),O($!==void 0?"errored":c?"ready":"unresolved"),T($);for(const N of h.keys())N.decrement();h.clear()},!1)}function y(){const P=Ms,$=p(),N=b();if(N!==void 0&&!a)throw N;return X&&X.user,$}function A(P=!0){if(P!==!1&&l)return;l=!1;const $=d?d():r;if($==null||$===!1){R(a,me(p));return}let N;const V=o!==kn?o:me(()=>{try{return i($,{value:p(),refetching:P})}catch(Z){N=Z}});if(N!==void 0){R(a,void 0,Jt(N),$);return}else if(!Ns(V))return R(a,V,void 0,$),V;return a=V,"v"in V?(V.s===1?R(a,V.v,void 0,$):R(a,void 0,Jt(V.v),$),V):(l=!0,queueMicrotask(()=>l=!1),Ke(()=>{O(c?"refreshing":"pending"),S()},!1),V.then(Z=>R(V,Z,void 0,$),Z=>R(V,void 0,Jt(Z),$)))}Object.defineProperties(y,{state:{get:()=>E()},error:{get:()=>b()},loading:{get(){const P=E();return P==="pending"||P==="refreshing"}},latest:{get(){if(!c)return y();const P=b();if(P&&!a)throw P;return p()}}});let C=Q;return d?Os(()=>(C=Q,A(!1))):A(!1),[y,{refetch:P=>Ls(C,()=>A(P)),mutate:m}]}function me(t){if(X===null)return t();const e=X;X=null;try{return t()}finally{X=e}}function At(t,e,n){const r=Array.isArray(t);let i;return s=>{let a;if(r){a=Array(t.length);for(let l=0;l<t.length;l++)a[l]=t[l]()}else a=t();const o=me(()=>e(a,i,s));return i=a,o}}function mt(t){et(()=>me(t))}function Oe(t){return Q===null||(Q.cleanups===null?Q.cleanups=[t]:Q.cleanups.push(t)),t}function Ls(t,e){const n=Q,r=X;Q=t,X=null;try{return Ke(e,!0)}catch(i){Zn(i)}finally{Q=n,X=r}}const[Hf,Vf]=M(!1);let Ms;function di(){if(this.sources&&this.state)if(this.state===Le)wt(this);else{const t=oe;oe=null,Ke(()=>an(this),!1),oe=t}if(X){const t=this.observers;if(!t||t[t.length-1]!==X){const e=t?t.length:0;X.sources?(X.sources.push(this),X.sourceSlots.push(e)):(X.sources=[this],X.sourceSlots=[e]),t?(t.push(X),this.observerSlots.push(X.sources.length-1)):(this.observers=[X],this.observerSlots=[X.sources.length-1])}}return this.value}function hi(t,e,n){let r=t.value;return(!t.comparator||!t.comparator(r,e))&&(t.value=e,t.observers&&t.observers.length&&Ke(()=>{for(let i=0;i<t.observers.length;i+=1){const s=t.observers[i],a=En&&En.running;a&&En.disposed.has(s),(a?!s.tState:!s.state)&&(s.pure?oe.push(s):xe.push(s),s.observers&&gi(s)),a||(s.state=Le)}if(oe.length>1e6)throw oe=[],new Error},!1)),e}function wt(t){if(!t.fn)return;xt(t);const e=mn;Us(t,t.value,e)}function Us(t,e,n){let r;const i=Q,s=X;X=Q=t;try{r=t.fn(e)}catch(a){return t.pure&&(t.state=Le,t.owned&&t.owned.forEach(xt),t.owned=null),t.updatedAt=n+1,Zn(a)}finally{X=s,Q=i}(!t.updatedAt||t.updatedAt<=n)&&(t.updatedAt!=null&&"observers"in t?hi(t,r):t.value=r,t.updatedAt=n)}function _n(t,e,n,r=Le,i){const s={fn:t,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:e,owner:Q,context:Q?Q.context:null,pure:n};return Q===null||Q!==ui&&(Q.owned?Q.owned.push(s):Q.owned=[s]),s}function sn(t){if(t.state===0)return;if(t.state===rn)return an(t);if(t.suspense&&me(t.suspense.inFallback))return t.suspense.effects.push(t);const e=[t];for(;(t=t.owner)&&(!t.updatedAt||t.updatedAt<mn);)t.state&&e.push(t);for(let n=e.length-1;n>=0;n--)if(t=e[n],t.state===Le)wt(t);else if(t.state===rn){const r=oe;oe=null,Ke(()=>an(t,e[0]),!1),oe=r}}function Ke(t,e){if(oe)return t();let n=!1;e||(oe=[]),xe?n=!0:xe=[],mn++;try{const r=t();return Fs(n),r}catch(r){n||(xe=null),oe=null,Zn(r)}}function Fs(t){if(oe&&(fi(oe),oe=null),t)return;const e=xe;xe=null,e.length&&Ke(()=>ci(e),!1)}function fi(t){for(let e=0;e<t.length;e++)sn(t[e])}function Bs(t){let e,n=0;for(e=0;e<t.length;e++){const r=t[e];r.user?t[n++]=r:sn(r)}for(e=0;e<n;e++)sn(t[e])}function an(t,e){t.state=0;for(let n=0;n<t.sources.length;n+=1){const r=t.sources[n];if(r.sources){const i=r.state;i===Le?r!==e&&(!r.updatedAt||r.updatedAt<mn)&&sn(r):i===rn&&an(r,e)}}}function gi(t){for(let e=0;e<t.observers.length;e+=1){const n=t.observers[e];n.state||(n.state=rn,n.pure?oe.push(n):xe.push(n),n.observers&&gi(n))}}function xt(t){let e;if(t.sources)for(;t.sources.length;){const n=t.sources.pop(),r=t.sourceSlots.pop(),i=n.observers;if(i&&i.length){const s=i.pop(),a=n.observerSlots.pop();r<i.length&&(s.sourceSlots[a]=r,i[r]=s,n.observerSlots[r]=a)}}if(t.tOwned){for(e=t.tOwned.length-1;e>=0;e--)xt(t.tOwned[e]);delete t.tOwned}if(t.owned){for(e=t.owned.length-1;e>=0;e--)xt(t.owned[e]);t.owned=null}if(t.cleanups){for(e=t.cleanups.length-1;e>=0;e--)t.cleanups[e]();t.cleanups=null}t.state=0}function Jt(t){return t instanceof Error?t:new Error(typeof t=="string"?t:"Unknown error",{cause:t})}function Zn(t,e=Q){throw Jt(t)}const Hs=Symbol("fallback");function pr(t){for(let e=0;e<t.length;e++)t[e]()}function Vs(t,e,n={}){let r=[],i=[],s=[],a=0,o=e.length>1?[]:null;return Oe(()=>pr(s)),()=>{let l=t()||[],c=l.length,d,h;return l[Rs],me(()=>{let m,b,T,_,S,E,O,R,D;if(c===0)a!==0&&(pr(s),s=[],r=[],i=[],a=0,o&&(o=[])),n.fallback&&(r=[Hs],i[0]=Kt(y=>(s[0]=y,n.fallback())),a=1);else if(a===0){for(i=new Array(c),h=0;h<c;h++)r[h]=l[h],i[h]=Kt(p);a=c}else{for(T=new Array(c),_=new Array(c),o&&(S=new Array(c)),E=0,O=Math.min(a,c);E<O&&r[E]===l[E];E++);for(O=a-1,R=c-1;O>=E&&R>=E&&r[O]===l[R];O--,R--)T[R]=i[O],_[R]=s[O],o&&(S[R]=o[O]);for(m=new Map,b=new Array(R+1),h=R;h>=E;h--)D=l[h],d=m.get(D),b[h]=d===void 0?-1:d,m.set(D,h);for(d=E;d<=O;d++)D=r[d],h=m.get(D),h!==void 0&&h!==-1?(T[h]=i[d],_[h]=s[d],o&&(S[h]=o[d]),h=b[h],m.set(D,h)):s[d]();for(h=E;h<c;h++)h in T?(i[h]=T[h],s[h]=_[h],o&&(o[h]=S[h],o[h](h))):i[h]=Kt(p);i=i.slice(0,a=c),r=l.slice(0)}return i});function p(m){if(s[h]=m,o){const[b,T]=M(h);return o[h]=T,e(l[h],b)}return e(l[h])}}}function f(t,e){return me(()=>t(e||{}))}function zt(){return!0}const Ws={get(t,e,n){return e===Wn?n:t.get(e)},has(t,e){return e===Wn?!0:t.has(e)},set:zt,deleteProperty:zt,getOwnPropertyDescriptor(t,e){return{configurable:!0,enumerable:!0,get(){return t.get(e)},set:zt,deleteProperty:zt}},ownKeys(t){return t.keys()}};function In(t){return(t=typeof t=="function"?t():t)?t:{}}function js(){for(let t=0,e=this.length;t<e;++t){const n=this[t]();if(n!==void 0)return n}}function zs(...t){let e=!1;for(let a=0;a<t.length;a++){const o=t[a];e=e||!!o&&Wn in o,t[a]=typeof o=="function"?(e=!0,ae(o)):o}if(Ps&&e)return new Proxy({get(a){for(let o=t.length-1;o>=0;o--){const l=In(t[o])[a];if(l!==void 0)return l}},has(a){for(let o=t.length-1;o>=0;o--)if(a in In(t[o]))return!0;return!1},keys(){const a=[];for(let o=0;o<t.length;o++)a.push(...Object.keys(In(t[o])));return[...new Set(a)]}},Ws);const n={},r=Object.create(null);for(let a=t.length-1;a>=0;a--){const o=t[a];if(!o)continue;const l=Object.getOwnPropertyNames(o);for(let c=l.length-1;c>=0;c--){const d=l[c];if(d==="__proto__"||d==="constructor")continue;const h=Object.getOwnPropertyDescriptor(o,d);if(!r[d])r[d]=h.get?{enumerable:!0,configurable:!0,get:js.bind(n[d]=[h.get.bind(o)])}:h.value!==void 0?h:void 0;else{const p=n[d];p&&(h.get?p.push(h.get.bind(o)):h.value!==void 0&&p.push(()=>h.value))}}}const i={},s=Object.keys(r);for(let a=s.length-1;a>=0;a--){const o=s[a],l=r[o];l&&l.get?Object.defineProperty(i,o,l):i[o]=l?l.value:void 0}return i}const Gs=t=>`Stale read from <${t}>.`;function re(t){const e="fallback"in t&&{fallback:()=>t.fallback};return ae(Vs(()=>t.each,t.children,e||void 0))}function k(t){const e=t.keyed,n=ae(()=>t.when,void 0,void 0),r=e?n:ae(n,void 0,{equals:(i,s)=>!i==!s});return ae(()=>{const i=r();if(i){const s=t.children;return typeof s=="function"&&s.length>0?me(()=>s(e?i:()=>{if(!me(r))throw Gs("Show");return n()})):s}return t.fallback},void 0,void 0)}const q=t=>ae(()=>t());function qs(t,e,n){let r=n.length,i=e.length,s=r,a=0,o=0,l=e[i-1].nextSibling,c=null;for(;a<i||o<s;){if(e[a]===n[o]){a++,o++;continue}for(;e[i-1]===n[s-1];)i--,s--;if(i===a){const d=s<r?o?n[o-1].nextSibling:n[s-o]:l;for(;o<s;)t.insertBefore(n[o++],d)}else if(s===o)for(;a<i;)(!c||!c.has(e[a]))&&e[a].remove(),a++;else if(e[a]===n[s-1]&&n[o]===e[i-1]){const d=e[--i].nextSibling;t.insertBefore(n[o++],e[a++].nextSibling),t.insertBefore(n[--s],d),e[i]=n[s]}else{if(!c){c=new Map;let h=o;for(;h<s;)c.set(n[h],h++)}const d=c.get(e[a]);if(d!=null)if(o<d&&d<s){let h=a,p=1,m;for(;++h<i&&h<s&&!((m=c.get(e[h]))==null||m!==d+p);)p++;if(p>d-o){const b=e[a];for(;o<d;)t.insertBefore(n[o++],b)}else t.replaceChild(n[o++],e[a++])}else a++;else e[a++].remove()}}}const mr="_$DX_DELEGATE";function Ks(t,e,n,r={}){let i;return Kt(s=>{i=s,e===document?t():u(e,t(),e.firstChild?null:void 0,n)},r.owner),()=>{i(),e.textContent=""}}function g(t,e,n,r){let i;const s=()=>{const o=r?document.createElementNS("http://www.w3.org/1998/Math/MathML","template"):document.createElement("template");return o.innerHTML=t,n?o.content.firstChild.firstChild:r?o.firstChild:o.content.firstChild},a=e?()=>me(()=>document.importNode(i||(i=s()),!0)):()=>(i||(i=s())).cloneNode(!0);return a.cloneNode=a,a}function we(t,e=window.document){const n=e[mr]||(e[mr]=new Set);for(let r=0,i=t.length;r<i;r++){const s=t[r];n.has(s)||(n.add(s),e.addEventListener(s,Ys))}}function ne(t,e,n){n==null?t.removeAttribute(e):t.setAttribute(e,n)}function de(t,e){e==null?t.removeAttribute("class"):t.className=e}function j(t,e,n,r){Array.isArray(n)?(t[`$$${e}`]=n[0],t[`$$${e}Data`]=n[1]):t[`$$${e}`]=n}function tt(t,e,n){n!=null?t.style.setProperty(e,n):t.style.removeProperty(e)}function Js(t,e,n){return me(()=>t(e,n))}function u(t,e,n,r){if(n!==void 0&&!r&&(r=[]),typeof e!="function")return on(t,e,r,n);v(i=>on(t,e(),i,n),r)}function Ys(t){let e=t.target;const n=`$$${t.type}`,r=t.target,i=t.currentTarget,s=l=>Object.defineProperty(t,"target",{configurable:!0,value:l}),a=()=>{const l=e[n];if(l&&!e.disabled){const c=e[`${n}Data`];if(c!==void 0?l.call(e,c,t):l.call(e,t),t.cancelBubble)return}return e.host&&typeof e.host!="string"&&!e.host._$host&&e.contains(t.target)&&s(e.host),!0},o=()=>{for(;a()&&(e=e._$host||e.parentNode||e.host););};if(Object.defineProperty(t,"currentTarget",{configurable:!0,get(){return e||document}}),t.composedPath){const l=t.composedPath();s(l[0]);for(let c=0;c<l.length-2&&(e=l[c],!!a());c++){if(e._$host){e=e._$host,o();break}if(e.parentNode===i)break}}else o();s(r)}function on(t,e,n,r,i){for(;typeof n=="function";)n=n();if(e===n)return n;const s=typeof e,a=r!==void 0;if(t=a&&n[0]&&n[0].parentNode||t,s==="string"||s==="number"){if(s==="number"&&(e=e.toString(),e===n))return n;if(a){let o=n[0];o&&o.nodeType===3?o.data!==e&&(o.data=e):o=document.createTextNode(e),n=ct(t,n,r,o)}else n!==""&&typeof n=="string"?n=t.firstChild.data=e:n=t.textContent=e}else if(e==null||s==="boolean")n=ct(t,n,r);else{if(s==="function")return v(()=>{let o=e();for(;typeof o=="function";)o=o();n=on(t,o,n,r)}),()=>n;if(Array.isArray(e)){const o=[],l=n&&Array.isArray(n);if(jn(o,e,n,i))return v(()=>n=on(t,o,n,r,!0)),()=>n;if(o.length===0){if(n=ct(t,n,r),a)return n}else l?n.length===0?_r(t,o,r):qs(t,n,o):(n&&ct(t),_r(t,o));n=o}else if(e.nodeType){if(Array.isArray(n)){if(a)return n=ct(t,n,r,e);ct(t,n,null,e)}else n==null||n===""||!t.firstChild?t.appendChild(e):t.replaceChild(e,t.firstChild);n=e}}return n}function jn(t,e,n,r){let i=!1;for(let s=0,a=e.length;s<a;s++){let o=e[s],l=n&&n[t.length],c;if(!(o==null||o===!0||o===!1))if((c=typeof o)=="object"&&o.nodeType)t.push(o);else if(Array.isArray(o))i=jn(t,o,l)||i;else if(c==="function")if(r){for(;typeof o=="function";)o=o();i=jn(t,Array.isArray(o)?o:[o],Array.isArray(l)?l:[l])||i}else t.push(o),i=!0;else{const d=String(o);l&&l.nodeType===3&&l.data===d?t.push(l):t.push(document.createTextNode(d))}}return i}function _r(t,e,n=null){for(let r=0,i=e.length;r<i;r++)t.insertBefore(e[r],n)}function ct(t,e,n,r){if(n===void 0)return t.textContent="";const i=r||document.createTextNode("");if(e.length){let s=!1;for(let a=e.length-1;a>=0;a--){const o=e[a];if(i!==o){const l=o.parentNode===t;!s&&!a?l?t.replaceChild(i,o):t.insertBefore(i,n):l&&o.remove()}else s=!0}}else t.insertBefore(i,n);return[i]}let Yt=null;function Xs(t){Yt=t}async function ue(t,e={}){if(!Yt)return fetch(t,e);const n=new Headers(e.headers??{}),r=await Yt(!1);r&&n.set("Authorization",`Bearer ${r}`);let i=await fetch(t,{...e,headers:n});if(i.status===401){const s=await Yt(!0);s&&s!==r&&(n.set("Authorization",`Bearer ${s}`),i=await fetch(t,{...e,headers:n}))}return i}async function pi(){const t=await ue("/api/latest");if(!t.ok)throw new Error(`GET /api/latest -> ${t.status}`);return t.json()}async function Qs(){return ue("/api/me")}async function Zs(){const t=await ue("/api/grants");if(!t.ok)throw new Error(`GET /api/grants -> ${t.status}`);return t.json()}async function ea(t){const e=await ue("/api/grants/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/add -> ${e.status}`);return n}async function ta(t){const e=await ue("/api/grants/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/remove -> ${e.status}`);return n}async function na(){return await ue("/api/run",{method:"POST"})}async function ra(){return ue("/api/progress")}async function ia(){const t=await ue("/api/holdings");if(!t.ok)throw new Error(`GET /api/holdings -> ${t.status}`);const e=await t.json().catch(()=>null);if(e===null)throw new Error("GET /api/holdings returned non-JSON — the backend predates the holdings routes (rebuild/restart it)");return e}async function Cn(t){const e=await ue("/api/holdings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings -> ${e.status}`);return n}async function Tn(t){const e=await ue(`/api/holdings/${encodeURIComponent(t)}`,{method:"DELETE"}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`DELETE /api/holdings/${t} -> ${e.status}`);return n}async function br(t,e){const n=await ue(`/api/holdings/${encodeURIComponent(t)}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({pool_id:e})}),r=await n.json().catch(()=>null);if(!n.ok)throw new Error((r==null?void 0:r.error)??`PATCH /api/holdings/${t} -> ${n.status}`);return r}async function sa(){const t=await ue("/api/holdings/refresh",{method:"POST"}),e=await t.json().catch(()=>null);if(!t.ok)throw new Error((e==null?void 0:e.error)??`POST /api/holdings/refresh -> ${t.status}`);return e}async function yr(t){const e=await ue("/api/holdings/cash",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`PATCH /api/holdings/cash -> ${e.status}`);return n}async function aa(t,e,n,r){const i=await ue("/api/holdings/close",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lot_id:t,shares:e,price:n,...r?{pool_id:r}:{}})}),s=await i.json().catch(()=>null);if(!i.ok)throw new Error((s==null?void 0:s.error)??`POST /api/holdings/close -> ${i.status}`);return s}async function oa(t){const e=await ue("/api/holdings/called-away",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({call_id:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings/called-away -> ${e.status}`);return n}const la=()=>{};var vr={};/**
+(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const Fs=!1,Bs=(t,e)=>t===e,Yn=Symbol("solid-proxy"),Hs=typeof Proxy=="function",Vs=Symbol("solid-track"),cn={equals:Bs};let pi=vi;const Ve=1,un=2,mi={owned:null,cleanups:null,context:null,owner:null},xn={};var ie=null;let Rn=null,Ws=null,re=null,fe=null,Ue=null,Sn=0;function en(t,e){const n=re,r=ie,i=t.length===0,s=e===void 0?r:e,a=i?mi:{owned:null,cleanups:null,context:s?s.context:null,owner:s},o=i?t:()=>t(()=>$e(()=>Mt(a)));ie=a,re=null;try{return Xe(o,!0)}finally{re=n,ie=r}}function M(t,e){e=e?Object.assign({},cn,e):cn;const n={value:t,observers:null,observerSlots:null,comparator:e.equals||void 0},r=i=>(typeof i=="function"&&(i=i(n.value)),bi(n,i));return[_i.bind(n),r]}function js(t,e,n){const r=kn(t,e,!0,Ve);kt(r)}function w(t,e,n){const r=kn(t,e,!1,Ve);kt(r)}function st(t,e,n){pi=Xs;const r=kn(t,e,!1,Ve);r.user=!0,Ue?Ue.push(r):kt(r)}function he(t,e,n){n=n?Object.assign({},cn,n):cn;const r=kn(t,e,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,kt(r),_i.bind(r)}function zs(t){return t&&typeof t=="object"&&"then"in t}function Gs(t,e,n){let r,i,s;typeof e=="function"?(r=t,i=e,s={}):(r=!0,i=t,s=e||{});let a=null,o=xn,l=!1,u="initialValue"in s,d=typeof r=="function"&&he(r);const h=new Set,[g,_]=(s.storage||M)(s.initialValue),[b,T]=M(void 0),[m,v]=M(void 0,{equals:!1}),[P,D]=M(u?"ready":"unresolved");ie&&Fe(()=>{for(const N of h.keys())N.decrement();h.clear(),a=null});function R(N,I,k,B){return a===N&&(a=null,B!==void 0&&(u=!0),(N===o||I===o)&&s.onHydrated&&queueMicrotask(()=>s.onHydrated(B,{value:I})),o=xn,O(I,k)),I}function O(N,I){Xe(()=>{I===void 0&&_(()=>N),D(I!==void 0?"errored":u?"ready":"unresolved"),T(I);for(const k of h.keys())k.decrement();h.clear()},!1)}function x(){const N=Ks,I=g(),k=b();if(k!==void 0&&!a)throw k;return re&&re.user,I}function $(N=!0){if(N!==!1&&l)return;l=!1;const I=d?d():r;if(I==null||I===!1){R(a,$e(g));return}let k;const B=o!==xn?o:$e(()=>{try{return i(I,{value:g(),refetching:N})}catch(E){k=E}});if(k!==void 0){R(a,void 0,tn(k),I);return}else if(!zs(B))return R(a,B,void 0,I),B;return a=B,"v"in B?(B.s===1?R(a,B.v,void 0,I):R(a,void 0,tn(B.v),I),B):(l=!0,queueMicrotask(()=>l=!1),Xe(()=>{D(u?"refreshing":"pending"),v()},!1),B.then(E=>R(B,E,void 0,I),E=>R(B,void 0,tn(E),I)))}Object.defineProperties(x,{state:{get:()=>P()},error:{get:()=>b()},loading:{get(){const N=P();return N==="pending"||N==="refreshing"}},latest:{get(){if(!u)return x();const N=b();if(N&&!a)throw N;return g()}}});let A=ie;return d?js(()=>(A=ie,$(!1))):$(!1),[x,{refetch:N=>qs(A,()=>$(N)),mutate:_}]}function $e(t){if(re===null)return t();const e=re;re=null;try{return t()}finally{re=e}}function Ot(t,e,n){const r=Array.isArray(t);let i;return s=>{let a;if(r){a=Array(t.length);for(let l=0;l<t.length;l++)a[l]=t[l]()}else a=t();const o=$e(()=>e(a,i,s));return i=a,o}}function vt(t){st(()=>$e(t))}function Fe(t){return ie===null||(ie.cleanups===null?ie.cleanups=[t]:ie.cleanups.push(t)),t}function qs(t,e){const n=ie,r=re;ie=t,re=null;try{return Xe(e,!0)}catch(i){ar(i)}finally{ie=n,re=r}}const[ig,sg]=M(!1);let Ks;function _i(){if(this.sources&&this.state)if(this.state===Ve)kt(this);else{const t=fe;fe=null,Xe(()=>hn(this),!1),fe=t}if(re){const t=this.observers;if(!t||t[t.length-1]!==re){const e=t?t.length:0;re.sources?(re.sources.push(this),re.sourceSlots.push(e)):(re.sources=[this],re.sourceSlots=[e]),t?(t.push(re),this.observerSlots.push(re.sources.length-1)):(this.observers=[re],this.observerSlots=[re.sources.length-1])}}return this.value}function bi(t,e,n){let r=t.value;return(!t.comparator||!t.comparator(r,e))&&(t.value=e,t.observers&&t.observers.length&&Xe(()=>{for(let i=0;i<t.observers.length;i+=1){const s=t.observers[i],a=Rn&&Rn.running;a&&Rn.disposed.has(s),(a?!s.tState:!s.state)&&(s.pure?fe.push(s):Ue.push(s),s.observers&&yi(s)),a||(s.state=Ve)}if(fe.length>1e6)throw fe=[],new Error},!1)),e}function kt(t){if(!t.fn)return;Mt(t);const e=Sn;Js(t,t.value,e)}function Js(t,e,n){let r;const i=ie,s=re;re=ie=t;try{r=t.fn(e)}catch(a){return t.pure&&(t.state=Ve,t.owned&&t.owned.forEach(Mt),t.owned=null),t.updatedAt=n+1,ar(a)}finally{re=s,ie=i}(!t.updatedAt||t.updatedAt<=n)&&(t.updatedAt!=null&&"observers"in t?bi(t,r):t.value=r,t.updatedAt=n)}function kn(t,e,n,r=Ve,i){const s={fn:t,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:e,owner:ie,context:ie?ie.context:null,pure:n};return ie===null||ie!==mi&&(ie.owned?ie.owned.push(s):ie.owned=[s]),s}function dn(t){if(t.state===0)return;if(t.state===un)return hn(t);if(t.suspense&&$e(t.suspense.inFallback))return t.suspense.effects.push(t);const e=[t];for(;(t=t.owner)&&(!t.updatedAt||t.updatedAt<Sn);)t.state&&e.push(t);for(let n=e.length-1;n>=0;n--)if(t=e[n],t.state===Ve)kt(t);else if(t.state===un){const r=fe;fe=null,Xe(()=>hn(t,e[0]),!1),fe=r}}function Xe(t,e){if(fe)return t();let n=!1;e||(fe=[]),Ue?n=!0:Ue=[],Sn++;try{const r=t();return Ys(n),r}catch(r){n||(Ue=null),fe=null,ar(r)}}function Ys(t){if(fe&&(vi(fe),fe=null),t)return;const e=Ue;Ue=null,e.length&&Xe(()=>pi(e),!1)}function vi(t){for(let e=0;e<t.length;e++)dn(t[e])}function Xs(t){let e,n=0;for(e=0;e<t.length;e++){const r=t[e];r.user?t[n++]=r:dn(r)}for(e=0;e<n;e++)dn(t[e])}function hn(t,e){t.state=0;for(let n=0;n<t.sources.length;n+=1){const r=t.sources[n];if(r.sources){const i=r.state;i===Ve?r!==e&&(!r.updatedAt||r.updatedAt<Sn)&&dn(r):i===un&&hn(r,e)}}}function yi(t){for(let e=0;e<t.observers.length;e+=1){const n=t.observers[e];n.state||(n.state=un,n.pure?fe.push(n):Ue.push(n),n.observers&&yi(n))}}function Mt(t){let e;if(t.sources)for(;t.sources.length;){const n=t.sources.pop(),r=t.sourceSlots.pop(),i=n.observers;if(i&&i.length){const s=i.pop(),a=n.observerSlots.pop();r<i.length&&(s.sourceSlots[a]=r,i[r]=s,n.observerSlots[r]=a)}}if(t.tOwned){for(e=t.tOwned.length-1;e>=0;e--)Mt(t.tOwned[e]);delete t.tOwned}if(t.owned){for(e=t.owned.length-1;e>=0;e--)Mt(t.owned[e]);t.owned=null}if(t.cleanups){for(e=t.cleanups.length-1;e>=0;e--)t.cleanups[e]();t.cleanups=null}t.state=0}function tn(t){return t instanceof Error?t:new Error(typeof t=="string"?t:"Unknown error",{cause:t})}function ar(t,e=ie){throw tn(t)}const Qs=Symbol("fallback");function wr(t){for(let e=0;e<t.length;e++)t[e]()}function Zs(t,e,n={}){let r=[],i=[],s=[],a=0,o=e.length>1?[]:null;return Fe(()=>wr(s)),()=>{let l=t()||[],u=l.length,d,h;return l[Vs],$e(()=>{let _,b,T,m,v,P,D,R,O;if(u===0)a!==0&&(wr(s),s=[],r=[],i=[],a=0,o&&(o=[])),n.fallback&&(r=[Qs],i[0]=en(x=>(s[0]=x,n.fallback())),a=1);else if(a===0){for(i=new Array(u),h=0;h<u;h++)r[h]=l[h],i[h]=en(g);a=u}else{for(T=new Array(u),m=new Array(u),o&&(v=new Array(u)),P=0,D=Math.min(a,u);P<D&&r[P]===l[P];P++);for(D=a-1,R=u-1;D>=P&&R>=P&&r[D]===l[R];D--,R--)T[R]=i[D],m[R]=s[D],o&&(v[R]=o[D]);for(_=new Map,b=new Array(R+1),h=R;h>=P;h--)O=l[h],d=_.get(O),b[h]=d===void 0?-1:d,_.set(O,h);for(d=P;d<=D;d++)O=r[d],h=_.get(O),h!==void 0&&h!==-1?(T[h]=i[d],m[h]=s[d],o&&(v[h]=o[d]),h=b[h],_.set(O,h)):s[d]();for(h=P;h<u;h++)h in T?(i[h]=T[h],s[h]=m[h],o&&(o[h]=v[h],o[h](h))):i[h]=en(g);i=i.slice(0,a=u),r=l.slice(0)}return i});function g(_){if(s[h]=_,o){const[b,T]=M(h);return o[h]=T,e(l[h],b)}return e(l[h])}}}function f(t,e){return $e(()=>t(e||{}))}function Xt(){return!0}const ea={get(t,e,n){return e===Yn?n:t.get(e)},has(t,e){return e===Yn?!0:t.has(e)},set:Xt,deleteProperty:Xt,getOwnPropertyDescriptor(t,e){return{configurable:!0,enumerable:!0,get(){return t.get(e)},set:Xt,deleteProperty:Xt}},ownKeys(t){return t.keys()}};function Nn(t){return(t=typeof t=="function"?t():t)?t:{}}function ta(){for(let t=0,e=this.length;t<e;++t){const n=this[t]();if(n!==void 0)return n}}function na(...t){let e=!1;for(let a=0;a<t.length;a++){const o=t[a];e=e||!!o&&Yn in o,t[a]=typeof o=="function"?(e=!0,he(o)):o}if(Hs&&e)return new Proxy({get(a){for(let o=t.length-1;o>=0;o--){const l=Nn(t[o])[a];if(l!==void 0)return l}},has(a){for(let o=t.length-1;o>=0;o--)if(a in Nn(t[o]))return!0;return!1},keys(){const a=[];for(let o=0;o<t.length;o++)a.push(...Object.keys(Nn(t[o])));return[...new Set(a)]}},ea);const n={},r=Object.create(null);for(let a=t.length-1;a>=0;a--){const o=t[a];if(!o)continue;const l=Object.getOwnPropertyNames(o);for(let u=l.length-1;u>=0;u--){const d=l[u];if(d==="__proto__"||d==="constructor")continue;const h=Object.getOwnPropertyDescriptor(o,d);if(!r[d])r[d]=h.get?{enumerable:!0,configurable:!0,get:ta.bind(n[d]=[h.get.bind(o)])}:h.value!==void 0?h:void 0;else{const g=n[d];g&&(h.get?g.push(h.get.bind(o)):h.value!==void 0&&g.push(()=>h.value))}}}const i={},s=Object.keys(r);for(let a=s.length-1;a>=0;a--){const o=s[a],l=r[o];l&&l.get?Object.defineProperty(i,o,l):i[o]=l?l.value:void 0}return i}const ra=t=>`Stale read from <${t}>.`;function se(t){const e="fallback"in t&&{fallback:()=>t.fallback};return he(Zs(()=>t.each,t.children,e||void 0))}function S(t){const e=t.keyed,n=he(()=>t.when,void 0,void 0),r=e?n:he(n,void 0,{equals:(i,s)=>!i==!s});return he(()=>{const i=r();if(i){const s=t.children;return typeof s=="function"&&s.length>0?$e(()=>s(e?i:()=>{if(!$e(r))throw ra("Show");return n()})):s}return t.fallback},void 0,void 0)}const Y=t=>he(()=>t());function ia(t,e,n){let r=n.length,i=e.length,s=r,a=0,o=0,l=e[i-1].nextSibling,u=null;for(;a<i||o<s;){if(e[a]===n[o]){a++,o++;continue}for(;e[i-1]===n[s-1];)i--,s--;if(i===a){const d=s<r?o?n[o-1].nextSibling:n[s-o]:l;for(;o<s;)t.insertBefore(n[o++],d)}else if(s===o)for(;a<i;)(!u||!u.has(e[a]))&&e[a].remove(),a++;else if(e[a]===n[s-1]&&n[o]===e[i-1]){const d=e[--i].nextSibling;t.insertBefore(n[o++],e[a++].nextSibling),t.insertBefore(n[--s],d),e[i]=n[s]}else{if(!u){u=new Map;let h=o;for(;h<s;)u.set(n[h],h++)}const d=u.get(e[a]);if(d!=null)if(o<d&&d<s){let h=a,g=1,_;for(;++h<i&&h<s&&!((_=u.get(e[h]))==null||_!==d+g);)g++;if(g>d-o){const b=e[a];for(;o<d;)t.insertBefore(n[o++],b)}else t.replaceChild(n[o++],e[a++])}else a++;else e[a++].remove()}}}const $r="_$DX_DELEGATE";function sa(t,e,n,r={}){let i;return en(s=>{i=s,e===document?t():c(e,t(),e.firstChild?null:void 0,n)},r.owner),()=>{i(),e.textContent=""}}function p(t,e,n,r){let i;const s=()=>{const o=r?document.createElementNS("http://www.w3.org/1998/Math/MathML","template"):document.createElement("template");return o.innerHTML=t,n?o.content.firstChild.firstChild:r?o.firstChild:o.content.firstChild},a=e?()=>$e(()=>document.importNode(i||(i=s()),!0)):()=>(i||(i=s())).cloneNode(!0);return a.cloneNode=a,a}function Ce(t,e=window.document){const n=e[$r]||(e[$r]=new Set);for(let r=0,i=t.length;r<i;r++){const s=t[r];n.has(s)||(n.add(s),e.addEventListener(s,oa))}}function ae(t,e,n){n==null?t.removeAttribute(e):t.setAttribute(e,n)}function ye(t,e){e==null?t.removeAttribute("class"):t.className=e}function G(t,e,n,r){Array.isArray(n)?(t[`$$${e}`]=n[0],t[`$$${e}Data`]=n[1]):t[`$$${e}`]=n}function at(t,e,n){n!=null?t.style.setProperty(e,n):t.style.removeProperty(e)}function aa(t,e,n){return $e(()=>t(e,n))}function c(t,e,n,r){if(n!==void 0&&!r&&(r=[]),typeof e!="function")return fn(t,e,r,n);w(i=>fn(t,e(),i,n),r)}function oa(t){let e=t.target;const n=`$$${t.type}`,r=t.target,i=t.currentTarget,s=l=>Object.defineProperty(t,"target",{configurable:!0,value:l}),a=()=>{const l=e[n];if(l&&!e.disabled){const u=e[`${n}Data`];if(u!==void 0?l.call(e,u,t):l.call(e,t),t.cancelBubble)return}return e.host&&typeof e.host!="string"&&!e.host._$host&&e.contains(t.target)&&s(e.host),!0},o=()=>{for(;a()&&(e=e._$host||e.parentNode||e.host););};if(Object.defineProperty(t,"currentTarget",{configurable:!0,get(){return e||document}}),t.composedPath){const l=t.composedPath();s(l[0]);for(let u=0;u<l.length-2&&(e=l[u],!!a());u++){if(e._$host){e=e._$host,o();break}if(e.parentNode===i)break}}else o();s(r)}function fn(t,e,n,r,i){for(;typeof n=="function";)n=n();if(e===n)return n;const s=typeof e,a=r!==void 0;if(t=a&&n[0]&&n[0].parentNode||t,s==="string"||s==="number"){if(s==="number"&&(e=e.toString(),e===n))return n;if(a){let o=n[0];o&&o.nodeType===3?o.data!==e&&(o.data=e):o=document.createTextNode(e),n=ht(t,n,r,o)}else n!==""&&typeof n=="string"?n=t.firstChild.data=e:n=t.textContent=e}else if(e==null||s==="boolean")n=ht(t,n,r);else{if(s==="function")return w(()=>{let o=e();for(;typeof o=="function";)o=o();n=fn(t,o,n,r)}),()=>n;if(Array.isArray(e)){const o=[],l=n&&Array.isArray(n);if(Xn(o,e,n,i))return w(()=>n=fn(t,o,n,r,!0)),()=>n;if(o.length===0){if(n=ht(t,n,r),a)return n}else l?n.length===0?Sr(t,o,r):ia(t,n,o):(n&&ht(t),Sr(t,o));n=o}else if(e.nodeType){if(Array.isArray(n)){if(a)return n=ht(t,n,r,e);ht(t,n,null,e)}else n==null||n===""||!t.firstChild?t.appendChild(e):t.replaceChild(e,t.firstChild);n=e}}return n}function Xn(t,e,n,r){let i=!1;for(let s=0,a=e.length;s<a;s++){let o=e[s],l=n&&n[t.length],u;if(!(o==null||o===!0||o===!1))if((u=typeof o)=="object"&&o.nodeType)t.push(o);else if(Array.isArray(o))i=Xn(t,o,l)||i;else if(u==="function")if(r){for(;typeof o=="function";)o=o();i=Xn(t,Array.isArray(o)?o:[o],Array.isArray(l)?l:[l])||i}else t.push(o),i=!0;else{const d=String(o);l&&l.nodeType===3&&l.data===d?t.push(l):t.push(document.createTextNode(d))}}return i}function Sr(t,e,n=null){for(let r=0,i=e.length;r<i;r++)t.insertBefore(e[r],n)}function ht(t,e,n,r){if(n===void 0)return t.textContent="";const i=r||document.createTextNode("");if(e.length){let s=!1;for(let a=e.length-1;a>=0;a--){const o=e[a];if(i!==o){const l=o.parentNode===t;!s&&!a?l?t.replaceChild(i,o):t.insertBefore(i,n):l&&o.remove()}else s=!0}}else t.insertBefore(i,n);return[i]}let nn=null;function la(t){nn=t}async function me(t,e={}){if(!nn)return fetch(t,e);const n=new Headers(e.headers??{}),r=await nn(!1);r&&n.set("Authorization",`Bearer ${r}`);let i=await fetch(t,{...e,headers:n});if(i.status===401){const s=await nn(!0);s&&s!==r&&(n.set("Authorization",`Bearer ${s}`),i=await fetch(t,{...e,headers:n}))}return i}async function wi(){const t=await me("/api/latest");if(!t.ok)throw new Error(`GET /api/latest -> ${t.status}`);return t.json()}async function ca(){return me("/api/me")}async function ua(){const t=await me("/api/grants");if(!t.ok)throw new Error(`GET /api/grants -> ${t.status}`);return t.json()}async function da(t){const e=await me("/api/grants/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/add -> ${e.status}`);return n}async function ha(t){const e=await me("/api/grants/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/remove -> ${e.status}`);return n}async function fa(){return await me("/api/run",{method:"POST"})}async function ga(){return me("/api/progress")}async function pa(){const t=await me("/api/holdings");if(!t.ok)throw new Error(`GET /api/holdings -> ${t.status}`);const e=await t.json().catch(()=>null);if(e===null)throw new Error("GET /api/holdings returned non-JSON — the backend predates the holdings routes (rebuild/restart it)");return e}async function On(t){const e=await me("/api/holdings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings -> ${e.status}`);return n}async function Dn(t){const e=await me(`/api/holdings/${encodeURIComponent(t)}`,{method:"DELETE"}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`DELETE /api/holdings/${t} -> ${e.status}`);return n}async function kr(t,e){const n=await me(`/api/holdings/${encodeURIComponent(t)}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({pool_id:e})}),r=await n.json().catch(()=>null);if(!n.ok)throw new Error((r==null?void 0:r.error)??`PATCH /api/holdings/${t} -> ${n.status}`);return r}async function ma(){const t=await me("/api/holdings/refresh",{method:"POST"}),e=await t.json().catch(()=>null);if(!t.ok)throw new Error((e==null?void 0:e.error)??`POST /api/holdings/refresh -> ${t.status}`);return e}async function Er(t){const e=await me("/api/holdings/cash",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`PATCH /api/holdings/cash -> ${e.status}`);return n}async function _a(t,e,n,r){const i=await me("/api/holdings/close",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lot_id:t,shares:e,price:n,...r?{pool_id:r}:{}})}),s=await i.json().catch(()=>null);if(!i.ok)throw new Error((s==null?void 0:s.error)??`POST /api/holdings/close -> ${i.status}`);return s}async function ba(t){const e=await me("/api/holdings/called-away",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({call_id:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings/called-away -> ${e.status}`);return n}const va=()=>{};var Cr={};/**
  * @license
  * Copyright 2017 Google LLC
  *
@@ -13,7 +13,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const mi=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},ca=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],a=t[n++],o=t[n++],l=((i&7)<<18|(s&63)<<12|(a&63)<<6|o&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=t[n++],a=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},_i={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],a=i+1<t.length,o=a?t[i+1]:0,l=i+2<t.length,c=l?t[i+2]:0,d=s>>2,h=(s&3)<<4|o>>4;let p=(o&15)<<2|c>>6,m=c&63;l||(m=64,a||(p=64)),r.push(n[d],n[h],n[p],n[m])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(mi(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):ca(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const c=i<t.length?n[t.charAt(i)]:64;++i;const h=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||o==null||c==null||h==null)throw new ua;const p=s<<2|o>>4;if(r.push(p),c!==64){const m=o<<4&240|c>>2;if(r.push(m),h!==64){const b=c<<6&192|h;r.push(b)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class ua extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const da=function(t){const e=mi(t);return _i.encodeByteArray(e,!0)},bi=function(t){return da(t).replace(/\./g,"")},yi=function(t){try{return _i.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
+ */const $i=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},ya=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],a=t[n++],o=t[n++],l=((i&7)<<18|(s&63)<<12|(a&63)<<6|o&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=t[n++],a=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},Si={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],a=i+1<t.length,o=a?t[i+1]:0,l=i+2<t.length,u=l?t[i+2]:0,d=s>>2,h=(s&3)<<4|o>>4;let g=(o&15)<<2|u>>6,_=u&63;l||(_=64,a||(g=64)),r.push(n[d],n[h],n[g],n[_])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray($i(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):ya(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const u=i<t.length?n[t.charAt(i)]:64;++i;const h=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||o==null||u==null||h==null)throw new wa;const g=s<<2|o>>4;if(r.push(g),u!==64){const _=o<<4&240|u>>2;if(r.push(_),h!==64){const b=u<<6&192|h;r.push(b)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class wa extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const $a=function(t){const e=$i(t);return Si.encodeByteArray(e,!0)},ki=function(t){return $a(t).replace(/\./g,"")},Ei=function(t){try{return Si.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
  * @license
  * Copyright 2022 Google LLC
  *
@@ -28,7 +28,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function ha(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
+ */function Sa(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
  * @license
  * Copyright 2022 Google LLC
  *
@@ -43,7 +43,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const fa=()=>ha().__FIREBASE_DEFAULTS__,ga=()=>{if(typeof process>"u"||typeof vr>"u")return;const t=vr.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},pa=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&yi(t[1]);return e&&JSON.parse(e)},er=()=>{try{return la()||fa()||ga()||pa()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},ma=t=>{var e,n;return(n=(e=er())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},vi=()=>{var t;return(t=er())==null?void 0:t.config},wi=t=>{var e;return(e=er())==null?void 0:e[`_${t}`]};/**
+ */const ka=()=>Sa().__FIREBASE_DEFAULTS__,Ea=()=>{if(typeof process>"u"||typeof Cr>"u")return;const t=Cr.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Ca=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Ei(t[1]);return e&&JSON.parse(e)},or=()=>{try{return va()||ka()||Ea()||Ca()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Ia=t=>{var e,n;return(n=(e=or())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},Ci=()=>{var t;return(t=or())==null?void 0:t.config},Ii=t=>{var e;return(e=or())==null?void 0:e[`_${t}`]};/**
  * @license
  * Copyright 2017 Google LLC
  *
@@ -58,7 +58,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class $i{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
+ */class Ti{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
  * @license
  * Copyright 2017 Google LLC
  *
@@ -73,7 +73,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function ce(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function _a(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ce())}function ba(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function ya(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function va(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function wa(){const t=ce();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function $a(){try{return typeof indexedDB=="object"}catch{return!1}}function Sa(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(n){e(n)}})}/**
+ */function pe(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Ta(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(pe())}function Pa(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Aa(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function xa(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Ra(){const t=pe();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function Na(){try{return typeof indexedDB=="object"}catch{return!1}}function Oa(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(n){e(n)}})}/**
  * @license
  * Copyright 2017 Google LLC
  *
@@ -88,7 +88,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const ka="FirebaseError";class Je extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=ka,Object.setPrototypeOf(this,Je.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Mt.prototype.create)}}class Mt{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?Ea(s,r):"Error",o=`${this.serviceName}: ${a} (${i}).`;return new Je(i,o,r)}}function Ea(t,e){try{let n=0,r="";for(;n<t.length;){const i=t.indexOf("{$",n);if(i===-1){r+=t.substring(n);break}const s=t.indexOf("}",i+2);if(s===-1){r+=t.substring(n);break}const a=t.substring(i+2,s),o=e[a];r+=t.substring(n,i)+(o!=null?String(o):`<${a}?>`),n=s+1}return r}catch{return t}}function Ia(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function _t(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],a=e[i];if(wr(s)&&wr(a)){if(!_t(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function wr(t){return t!==null&&typeof t=="object"}/**
+ */const Da="FirebaseError";class Qe extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=Da,Object.setPrototypeOf(this,Qe.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Vt.prototype.create)}}class Vt{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?La(s,r):"Error",o=`${this.serviceName}: ${a} (${i}).`;return new Qe(i,o,r)}}function La(t,e){try{let n=0,r="";for(;n<t.length;){const i=t.indexOf("{$",n);if(i===-1){r+=t.substring(n);break}const s=t.indexOf("}",i+2);if(s===-1){r+=t.substring(n);break}const a=t.substring(i+2,s),o=e[a];r+=t.substring(n,i)+(o!=null?String(o):`<${a}?>`),n=s+1}return r}catch{return t}}function Ma(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function yt(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],a=e[i];if(Ir(s)&&Ir(a)){if(!yt(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function Ir(t){return t!==null&&typeof t=="object"}/**
  * @license
  * Copyright 2017 Google LLC
  *
@@ -103,7 +103,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function Ut(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Et(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function It(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function Ca(t,e){const n=new Ta(t,e);return n.subscribe.bind(n)}class Ta{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");Aa(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=An),i.error===void 0&&(i.error=An),i.complete===void 0&&(i.complete=An);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Aa(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function An(){}/**
+ */function Wt(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function At(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function xt(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function Ua(t,e){const n=new Fa(t,e);return n.subscribe.bind(n)}class Fa{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");Ba(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=Ln),i.error===void 0&&(i.error=Ln),i.complete===void 0&&(i.complete=Ln);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Ba(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Ln(){}/**
  * @license
  * Copyright 2021 Google LLC
  *
@@ -118,7 +118,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function Me(t){return t&&t._delegate?t._delegate:t}/**
+ */function We(t){return t&&t._delegate?t._delegate:t}/**
  * @license
  * Copyright 2025 Google LLC
  *
@@ -133,7 +133,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function tr(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Pa(t){return(await fetch(t,{credentials:"include"})).ok}class bt{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
+ */function lr(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Ha(t){return(await fetch(t,{credentials:"include"})).ok}class wt{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -148,7 +148,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Qe="[DEFAULT]";/**
+ */const rt="[DEFAULT]";/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -163,7 +163,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Ra{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new $i;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Oa(e))try{this.getOrInitializeService({instanceIdentifier:Qe})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Qe){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Qe){return this.instances.has(e)}getOptions(e=Qe){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(s);r===o&&a.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:xa(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Qe){return this.component?this.component.multipleInstances?e:Qe:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function xa(t){return t===Qe?void 0:t}function Oa(t){return t.instantiationMode==="EAGER"}/**
+ */class Va{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new Ti;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(ja(e))try{this.getOrInitializeService({instanceIdentifier:rt})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=rt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=rt){return this.instances.has(e)}getOptions(e=rt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(s);r===o&&a.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Wa(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=rt){return this.component?this.component.multipleInstances?e:rt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Wa(t){return t===rt?void 0:t}function ja(t){return t.instantiationMode==="EAGER"}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -178,7 +178,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Na{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Ra(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
+ */class za{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Va(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
  * @license
  * Copyright 2017 Google LLC
  *
@@ -193,7 +193,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */var J;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(J||(J={}));const Da={debug:J.DEBUG,verbose:J.VERBOSE,info:J.INFO,warn:J.WARN,error:J.ERROR,silent:J.SILENT},La=J.INFO,Ma={[J.DEBUG]:"log",[J.VERBOSE]:"log",[J.INFO]:"info",[J.WARN]:"warn",[J.ERROR]:"error"},Ua=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=Ma[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Si{constructor(e){this.name=e,this._logLevel=La,this._logHandler=Ua,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in J))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Da[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,J.DEBUG,...e),this._logHandler(this,J.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,J.VERBOSE,...e),this._logHandler(this,J.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,J.INFO,...e),this._logHandler(this,J.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,J.WARN,...e),this._logHandler(this,J.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,J.ERROR,...e),this._logHandler(this,J.ERROR,...e)}}const Fa=(t,e)=>e.some(n=>t instanceof n);let $r,Sr;function Ba(){return $r||($r=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ha(){return Sr||(Sr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ki=new WeakMap,zn=new WeakMap,Ei=new WeakMap,Pn=new WeakMap,nr=new WeakMap;function Va(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",a)},s=()=>{n(Ge(t.result)),i()},a=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&ki.set(n,t)}).catch(()=>{}),nr.set(e,t),e}function Wa(t){if(zn.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",a),t.removeEventListener("abort",a)},s=()=>{n(),i()},a=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",a),t.addEventListener("abort",a)});zn.set(t,e)}let Gn={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return zn.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Ei.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Ge(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function ja(t){Gn=t(Gn)}function za(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Rn(this),e,...n);return Ei.set(r,e.sort?e.sort():[e]),Ge(r)}:Ha().includes(t)?function(...e){return t.apply(Rn(this),e),Ge(ki.get(this))}:function(...e){return Ge(t.apply(Rn(this),e))}}function Ga(t){return typeof t=="function"?za(t):(t instanceof IDBTransaction&&Wa(t),Fa(t,Ba())?new Proxy(t,Gn):t)}function Ge(t){if(t instanceof IDBRequest)return Va(t);if(Pn.has(t))return Pn.get(t);const e=Ga(t);return e!==t&&(Pn.set(t,e),nr.set(e,t)),e}const Rn=t=>nr.get(t);function qa(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(t,e),o=Ge(a);return r&&a.addEventListener("upgradeneeded",l=>{r(Ge(a.result),l.oldVersion,l.newVersion,Ge(a.transaction),l)}),n&&a.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),o.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),o}const Ka=["get","getKey","getAll","getAllKeys","count"],Ja=["put","add","delete","clear"],xn=new Map;function kr(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(xn.get(e))return xn.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=Ja.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||Ka.includes(n)))return;const s=async function(a,...o){const l=this.transaction(a,i?"readwrite":"readonly");let c=l.store;return r&&(c=c.index(o.shift())),(await Promise.all([c[n](...o),i&&l.done]))[0]};return xn.set(e,s),s}ja(t=>({...t,get:(e,n,r)=>kr(e,n)||t.get(e,n,r),has:(e,n)=>!!kr(e,n)||t.has(e,n)}));/**
+ */var te;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(te||(te={}));const Ga={debug:te.DEBUG,verbose:te.VERBOSE,info:te.INFO,warn:te.WARN,error:te.ERROR,silent:te.SILENT},qa=te.INFO,Ka={[te.DEBUG]:"log",[te.VERBOSE]:"log",[te.INFO]:"info",[te.WARN]:"warn",[te.ERROR]:"error"},Ja=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=Ka[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Pi{constructor(e){this.name=e,this._logLevel=qa,this._logHandler=Ja,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in te))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Ga[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,te.DEBUG,...e),this._logHandler(this,te.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,te.VERBOSE,...e),this._logHandler(this,te.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,te.INFO,...e),this._logHandler(this,te.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,te.WARN,...e),this._logHandler(this,te.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,te.ERROR,...e),this._logHandler(this,te.ERROR,...e)}}const Ya=(t,e)=>e.some(n=>t instanceof n);let Tr,Pr;function Xa(){return Tr||(Tr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Qa(){return Pr||(Pr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ai=new WeakMap,Qn=new WeakMap,xi=new WeakMap,Mn=new WeakMap,cr=new WeakMap;function Za(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",a)},s=()=>{n(Ye(t.result)),i()},a=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&Ai.set(n,t)}).catch(()=>{}),cr.set(e,t),e}function eo(t){if(Qn.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",a),t.removeEventListener("abort",a)},s=()=>{n(),i()},a=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",a),t.addEventListener("abort",a)});Qn.set(t,e)}let Zn={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Qn.get(t);if(e==="objectStoreNames")return t.objectStoreNames||xi.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Ye(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function to(t){Zn=t(Zn)}function no(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Un(this),e,...n);return xi.set(r,e.sort?e.sort():[e]),Ye(r)}:Qa().includes(t)?function(...e){return t.apply(Un(this),e),Ye(Ai.get(this))}:function(...e){return Ye(t.apply(Un(this),e))}}function ro(t){return typeof t=="function"?no(t):(t instanceof IDBTransaction&&eo(t),Ya(t,Xa())?new Proxy(t,Zn):t)}function Ye(t){if(t instanceof IDBRequest)return Za(t);if(Mn.has(t))return Mn.get(t);const e=ro(t);return e!==t&&(Mn.set(t,e),cr.set(e,t)),e}const Un=t=>cr.get(t);function io(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(t,e),o=Ye(a);return r&&a.addEventListener("upgradeneeded",l=>{r(Ye(a.result),l.oldVersion,l.newVersion,Ye(a.transaction),l)}),n&&a.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),o.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",u=>i(u.oldVersion,u.newVersion,u))}).catch(()=>{}),o}const so=["get","getKey","getAll","getAllKeys","count"],ao=["put","add","delete","clear"],Fn=new Map;function Ar(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Fn.get(e))return Fn.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=ao.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||so.includes(n)))return;const s=async function(a,...o){const l=this.transaction(a,i?"readwrite":"readonly");let u=l.store;return r&&(u=u.index(o.shift())),(await Promise.all([u[n](...o),i&&l.done]))[0]};return Fn.set(e,s),s}to(t=>({...t,get:(e,n,r)=>Ar(e,n)||t.get(e,n,r),has:(e,n)=>!!Ar(e,n)||t.has(e,n)}));/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -208,7 +208,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Ya{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Xa(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function Xa(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const qn="@firebase/app",Er="0.16.1";/**
+ */class oo{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(lo(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function lo(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const er="@firebase/app",xr="0.16.1";/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -223,7 +223,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Ne=new Si("@firebase/app"),Qa="@firebase/app-compat",Za="@firebase/analytics-compat",eo="@firebase/analytics",to="@firebase/app-check-compat",no="@firebase/app-check",ro="@firebase/auth",io="@firebase/auth-compat",so="@firebase/database",ao="@firebase/data-connect",oo="@firebase/database-compat",lo="@firebase/functions",co="@firebase/functions-compat",uo="@firebase/installations",ho="@firebase/installations-compat",fo="@firebase/messaging",go="@firebase/messaging-compat",po="@firebase/performance",mo="@firebase/performance-compat",_o="@firebase/remote-config",bo="@firebase/remote-config-compat",yo="@firebase/storage",vo="@firebase/storage-compat",wo="@firebase/firestore",$o="@firebase/ai",So="@firebase/firestore-compat",ko="firebase",Eo="12.18.0";/**
+ */const Be=new Pi("@firebase/app"),co="@firebase/app-compat",uo="@firebase/analytics-compat",ho="@firebase/analytics",fo="@firebase/app-check-compat",go="@firebase/app-check",po="@firebase/auth",mo="@firebase/auth-compat",_o="@firebase/database",bo="@firebase/data-connect",vo="@firebase/database-compat",yo="@firebase/functions",wo="@firebase/functions-compat",$o="@firebase/installations",So="@firebase/installations-compat",ko="@firebase/messaging",Eo="@firebase/messaging-compat",Co="@firebase/performance",Io="@firebase/performance-compat",To="@firebase/remote-config",Po="@firebase/remote-config-compat",Ao="@firebase/storage",xo="@firebase/storage-compat",Ro="@firebase/firestore",No="@firebase/ai",Oo="@firebase/firestore-compat",Do="firebase",Lo="12.18.0";/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -238,7 +238,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Kn="[DEFAULT]",Io={[qn]:"fire-core",[Qa]:"fire-core-compat",[eo]:"fire-analytics",[Za]:"fire-analytics-compat",[no]:"fire-app-check",[to]:"fire-app-check-compat",[ro]:"fire-auth",[io]:"fire-auth-compat",[so]:"fire-rtdb",[ao]:"fire-data-connect",[oo]:"fire-rtdb-compat",[lo]:"fire-fn",[co]:"fire-fn-compat",[uo]:"fire-iid",[ho]:"fire-iid-compat",[fo]:"fire-fcm",[go]:"fire-fcm-compat",[po]:"fire-perf",[mo]:"fire-perf-compat",[_o]:"fire-rc",[bo]:"fire-rc-compat",[yo]:"fire-gcs",[vo]:"fire-gcs-compat",[wo]:"fire-fst",[So]:"fire-fst-compat",[$o]:"fire-vertex","fire-js":"fire-js",[ko]:"fire-js-all"};/**
+ */const tr="[DEFAULT]",Mo={[er]:"fire-core",[co]:"fire-core-compat",[ho]:"fire-analytics",[uo]:"fire-analytics-compat",[go]:"fire-app-check",[fo]:"fire-app-check-compat",[po]:"fire-auth",[mo]:"fire-auth-compat",[_o]:"fire-rtdb",[bo]:"fire-data-connect",[vo]:"fire-rtdb-compat",[yo]:"fire-fn",[wo]:"fire-fn-compat",[$o]:"fire-iid",[So]:"fire-iid-compat",[ko]:"fire-fcm",[Eo]:"fire-fcm-compat",[Co]:"fire-perf",[Io]:"fire-perf-compat",[To]:"fire-rc",[Po]:"fire-rc-compat",[Ao]:"fire-gcs",[xo]:"fire-gcs-compat",[Ro]:"fire-fst",[Oo]:"fire-fst-compat",[No]:"fire-vertex","fire-js":"fire-js",[Do]:"fire-js-all"};/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -253,7 +253,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const ln=new Map,Co=new Map,Jn=new Map;function Ir(t,e){try{t.container.addComponent(e)}catch(n){Ne.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Ot(t){const e=t.name;if(Jn.has(e))return Ne.debug(`There were multiple attempts to register component ${e}.`),!1;Jn.set(e,t);for(const n of ln.values())Ir(n,t);for(const n of Co.values())Ir(n,t);return!0}function Ii(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function ge(t){return t==null?!1:t.settings!==void 0}/**
+ */const gn=new Map,Uo=new Map,nr=new Map;function Rr(t,e){try{t.container.addComponent(e)}catch(n){Be.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Ut(t){const e=t.name;if(nr.has(e))return Be.debug(`There were multiple attempts to register component ${e}.`),!1;nr.set(e,t);for(const n of gn.values())Rr(n,t);for(const n of Uo.values())Rr(n,t);return!0}function Ri(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function be(t){return t==null?!1:t.settings!==void 0}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -268,7 +268,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const To={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ce=new Mt("app","Firebase",To);/**
+ */const Fo={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ne=new Vt("app","Firebase",Fo);/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -283,7 +283,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Ao{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new bt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ce.create("app-deleted",{appName:this._name})}}/**
+ */class Bo{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new wt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ne.create("app-deleted",{appName:this._name})}}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -298,7 +298,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Ft=Eo;function Ci(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:Kn,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw Ce.create("bad-app-name",{appName:String(i)});if(n||(n=vi()),!n)throw Ce.create("no-options");const s=ln.get(i);if(s)if(_t(n,s.options)){if(_t(r,s.config))return s;throw Ce.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw Ce.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(n)});const a=new Na(i);for(const l of Jn.values())a.addComponent(l);const o=new Ao(n,r,a);return ln.set(i,o),o}function Po(t=Kn){const e=ln.get(t);if(!e&&t===Kn&&vi())return Ci();if(!e)throw Ce.create("no-app",{appName:t});return e}function ht(t,e,n){let r=Io[t]??t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const a=[`Unable to register library "${r}" with version "${e}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&a.push("and"),s&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Ne.warn(a.join(" "));return}Ot(new bt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
+ */const jt=Lo;function Ni(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:tr,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw Ne.create("bad-app-name",{appName:String(i)});if(n||(n=Ci()),!n)throw Ne.create("no-options");const s=gn.get(i);if(s)if(yt(n,s.options)){if(yt(r,s.config))return s;throw Ne.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw Ne.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(n)});const a=new za(i);for(const l of nr.values())a.addComponent(l);const o=new Bo(n,r,a);return gn.set(i,o),o}function Ho(t=tr){const e=gn.get(t);if(!e&&t===tr&&Ci())return Ni();if(!e)throw Ne.create("no-app",{appName:t});return e}function pt(t,e,n){let r=Mo[t]??t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const a=[`Unable to register library "${r}" with version "${e}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&a.push("and"),s&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Be.warn(a.join(" "));return}Ut(new wt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
  * @license
  * Copyright 2021 Google LLC
  *
@@ -313,7 +313,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Ro="firebase-heartbeat-database",xo=1,Nt="firebase-heartbeat-store";let On=null;function Ti(){return On||(On=qa(Ro,xo,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Nt)}catch(n){console.warn(n)}}}}).catch(t=>{throw Ce.create("idb-open",{originalErrorMessage:t.message})})),On}async function Oo(t){try{const n=(await Ti()).transaction(Nt),r=await n.objectStore(Nt).get(Ai(t));return await n.done,r}catch(e){if(e instanceof Je)Ne.warn(e.message);else{const n=Ce.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Ne.warn(n.message)}}}async function Cr(t,e){try{const r=(await Ti()).transaction(Nt,"readwrite");await r.objectStore(Nt).put(e,Ai(t)),await r.done}catch(n){if(n instanceof Je)Ne.warn(n.message);else{const r=Ce.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Ne.warn(r.message)}}}function Ai(t){return`${t.name}!${t.options.appId}`}/**
+ */const Vo="firebase-heartbeat-database",Wo=1,Ft="firebase-heartbeat-store";let Bn=null;function Oi(){return Bn||(Bn=io(Vo,Wo,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Ft)}catch(n){console.warn(n)}}}}).catch(t=>{throw Ne.create("idb-open",{originalErrorMessage:t.message})})),Bn}async function jo(t){try{const n=(await Oi()).transaction(Ft),r=await n.objectStore(Ft).get(Di(t));return await n.done,r}catch(e){if(e instanceof Qe)Be.warn(e.message);else{const n=Ne.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Be.warn(n.message)}}}async function Nr(t,e){try{const r=(await Oi()).transaction(Ft,"readwrite");await r.objectStore(Ft).put(e,Di(t)),await r.done}catch(n){if(n instanceof Qe)Be.warn(n.message);else{const r=Ne.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Be.warn(r.message)}}}function Di(t){return`${t.name}!${t.options.appId}`}/**
  * @license
  * Copyright 2021 Google LLC
  *
@@ -328,7 +328,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const No=1024,Do=30;class Lo{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Uo(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Tr();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>Do){const a=Fo(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Ne.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Tr(),{heartbeatsToSend:r,unsentEntries:i}=Mo(this._heartbeatsCache.heartbeats),s=bi(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Ne.warn(n),""}}}function Tr(){return new Date().toISOString().substring(0,10)}function Mo(t,e=No){const n=[];let r=t.slice();for(const i of t){const s=n.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),Ar(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Ar(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Uo{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return $a()?Sa().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Oo(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Cr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Cr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Ar(t){return bi(JSON.stringify({version:2,heartbeats:t})).length}function Fo(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
+ */const zo=1024,Go=30;class qo{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Jo(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Or();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>Go){const a=Yo(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Be.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Or(),{heartbeatsToSend:r,unsentEntries:i}=Ko(this._heartbeatsCache.heartbeats),s=ki(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Be.warn(n),""}}}function Or(){return new Date().toISOString().substring(0,10)}function Ko(t,e=zo){const n=[];let r=t.slice();for(const i of t){const s=n.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),Dr(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Dr(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Jo{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Na()?Oa().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await jo(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Nr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Nr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Dr(t){return ki(JSON.stringify({version:2,heartbeats:t})).length}function Yo(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -343,7 +343,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function Bo(t){Ot(new bt("platform-logger",e=>new Ya(e),"PRIVATE")),Ot(new bt("heartbeat",e=>new Lo(e),"PRIVATE")),ht(qn,Er,t),ht(qn,Er,"esm2020"),ht("fire-js","")}/**
+ */function Xo(t){Ut(new wt("platform-logger",e=>new oo(e),"PRIVATE")),Ut(new wt("heartbeat",e=>new qo(e),"PRIVATE")),pt(er,xr,t),pt(er,xr,"esm2020"),pt("fire-js","")}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -358,7 +358,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */Bo("");var Ho="firebase",Vo="12.18.0";/**
+ */Xo("");var Qo="firebase",Zo="12.18.0";/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -373,7 +373,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */ht(Ho,Vo,"app");function Pi(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Wo=Pi,Ri=new Mt("auth","Firebase",Pi());/**
+ */pt(Qo,Zo,"app");function Li(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const el=Li,Mi=new Vt("auth","Firebase",Li());/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -388,7 +388,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const cn=new Si("@firebase/auth");function xi(t,...e){cn.logLevel<=J.WARN&&cn.warn(`Auth (${Ft}): ${t}`,...e)}function Xt(t,...e){cn.logLevel<=J.ERROR&&cn.error(`Auth (${Ft}): ${t}`,...e)}/**
+ */const pn=new Pi("@firebase/auth");function Ui(t,...e){pn.logLevel<=te.WARN&&pn.warn(`Auth (${jt}): ${t}`,...e)}function rn(t,...e){pn.logLevel<=te.ERROR&&pn.error(`Auth (${jt}): ${t}`,...e)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -403,7 +403,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function _e(t,...e){throw ir(t,...e)}function ve(t,...e){return ir(t,...e)}function rr(t,e,n){const r={...Wo(),[e]:n};return new Mt("auth","Firebase",r).create(e,{appName:t.name})}function Se(t){return rr(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Oi(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&_e(t,"argument-error"),rr(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function ir(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return Ri.create(t,...e)}function H(t,e,...n){if(!t)throw ir(e,...n)}function Te(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Xt(e),new Error(e)}function De(t,e){t||Te(e)}/**
+ */function Se(t,...e){throw dr(t,...e)}function Ee(t,...e){return dr(t,...e)}function ur(t,e,n){const r={...el(),[e]:n};return new Vt("auth","Firebase",r).create(e,{appName:t.name})}function Pe(t){return ur(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Fi(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&Se(t,"argument-error"),ur(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function dr(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return Mi.create(t,...e)}function j(t,e,...n){if(!t)throw dr(e,...n)}function Oe(t){const e="INTERNAL ASSERTION FAILED: "+t;throw rn(e),new Error(e)}function He(t,e){t||Oe(e)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -418,7 +418,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function Yn(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function jo(){return Pr()==="http:"||Pr()==="https:"}function Pr(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
+ */function rr(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function tl(){return Lr()==="http:"||Lr()==="https:"}function Lr(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -433,7 +433,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function zo(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(jo()||ya()||"connection"in navigator)?navigator.onLine:!0}function Go(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
+ */function nl(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(tl()||Aa()||"connection"in navigator)?navigator.onLine:!0}function rl(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -448,7 +448,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Bt{constructor(e,n){this.shortDelay=e,this.longDelay=n,De(n>e,"Short delay should be less than long delay!"),this.isMobile=_a()||va()}get(){return zo()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
+ */class zt{constructor(e,n){this.shortDelay=e,this.longDelay=n,He(n>e,"Short delay should be less than long delay!"),this.isMobile=Ta()||xa()}get(){return nl()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -463,7 +463,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function sr(t,e){De(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
+ */function hr(t,e){He(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -478,7 +478,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Ni{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Te("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Te("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Te("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
+ */class Bi{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Oe("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Oe("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Oe("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -493,7 +493,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const qo={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
+ */const il={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -508,7 +508,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Ko=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Jo=new Bt(3e4,6e4);function Ye(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function Xe(t,e,n,r,i={}){return Di(t,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const o=Ut({...a,key:t.config.apiKey}).slice(1),l=await t._getAdditionalHeaders();l["Content-Type"]="application/json",t.languageCode&&(l["X-Firebase-Locale"]=t.languageCode);const c={method:e,headers:l,...s};return ba()||(c.referrerPolicy="strict-origin-when-cross-origin"),t.emulatorConfig&&tr(t.emulatorConfig.host)&&(c.credentials="include"),Ni.fetch()(await Li(t,t.config.apiHost,n,o),c)})}async function Di(t,e,n){t._canInitEmulator=!1;const r={...qo,...e};try{const i=new Xo(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw Gt(t,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const o=s.ok?a.errorMessage:a.error.message,[l,c]=o.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw Gt(t,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw Gt(t,"email-already-in-use",a);if(l==="USER_DISABLED")throw Gt(t,"user-disabled",a);const d=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw rr(t,d,c);_e(t,d)}}catch(i){if(i instanceof Je)throw i;_e(t,"network-request-failed",{message:String(i)})}}async function Ht(t,e,n,r,i={}){const s=await Xe(t,e,n,r,i);return"mfaPendingCredential"in s&&_e(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function Li(t,e,n,r){const i=`${e}${n}?${r}`,s=t,a=s.config.emulator?sr(t.config,i):`${t.config.apiScheme}://${i}`;return Ko.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}function Yo(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Xo{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(ve(this.auth,"network-request-failed")),Jo.get())})}}function Gt(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=ve(t,e,r);return i.customData._tokenResponse=n,i}function Rr(t){return t!==void 0&&t.enterprise!==void 0}class Qo{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return Yo(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function Zo(t,e){return Xe(t,"GET","/v2/recaptchaConfig",Ye(t,e))}/**
+ */const sl=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],al=new zt(3e4,6e4);function Ze(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function et(t,e,n,r,i={}){return Hi(t,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const o=Wt({...a,key:t.config.apiKey}).slice(1),l=await t._getAdditionalHeaders();l["Content-Type"]="application/json",t.languageCode&&(l["X-Firebase-Locale"]=t.languageCode);const u={method:e,headers:l,...s};return Pa()||(u.referrerPolicy="strict-origin-when-cross-origin"),t.emulatorConfig&&lr(t.emulatorConfig.host)&&(u.credentials="include"),Bi.fetch()(await Vi(t,t.config.apiHost,n,o),u)})}async function Hi(t,e,n){t._canInitEmulator=!1;const r={...il,...e};try{const i=new ll(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw Qt(t,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const o=s.ok?a.errorMessage:a.error.message,[l,u]=o.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw Qt(t,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw Qt(t,"email-already-in-use",a);if(l==="USER_DISABLED")throw Qt(t,"user-disabled",a);const d=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw ur(t,d,u);Se(t,d)}}catch(i){if(i instanceof Qe)throw i;Se(t,"network-request-failed",{message:String(i)})}}async function Gt(t,e,n,r,i={}){const s=await et(t,e,n,r,i);return"mfaPendingCredential"in s&&Se(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function Vi(t,e,n,r){const i=`${e}${n}?${r}`,s=t,a=s.config.emulator?hr(t.config,i):`${t.config.apiScheme}://${i}`;return sl.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}function ol(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class ll{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(Ee(this.auth,"network-request-failed")),al.get())})}}function Qt(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=Ee(t,e,r);return i.customData._tokenResponse=n,i}function Mr(t){return t!==void 0&&t.enterprise!==void 0}class cl{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return ol(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function ul(t,e){return et(t,"GET","/v2/recaptchaConfig",Ze(t,e))}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -523,7 +523,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function el(t,e){return Xe(t,"POST","/v1/accounts:delete",e)}async function un(t,e){return Xe(t,"POST","/v1/accounts:lookup",e)}/**
+ */async function dl(t,e){return et(t,"POST","/v1/accounts:delete",e)}async function mn(t,e){return et(t,"POST","/v1/accounts:lookup",e)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -538,7 +538,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function Pt(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function tl(t,e=!1){const n=Me(t),r=await n.getIdToken(e),i=ar(r);H(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:Pt(Nn(i.auth_time)),issuedAtTime:Pt(Nn(i.iat)),expirationTime:Pt(Nn(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Nn(t){return Number(t)*1e3}function ar(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Xt("JWT malformed, contained fewer than 3 sections"),null;try{const i=yi(n);return i?JSON.parse(i):(Xt("Failed to decode base64 JWT payload"),null)}catch(i){return Xt("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function xr(t){const e=ar(t);return H(e,"internal-error"),H(typeof e.exp<"u","internal-error"),H(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
+ */function Dt(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function hl(t,e=!1){const n=We(t),r=await n.getIdToken(e),i=fr(r);j(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:Dt(Hn(i.auth_time)),issuedAtTime:Dt(Hn(i.iat)),expirationTime:Dt(Hn(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Hn(t){return Number(t)*1e3}function fr(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return rn("JWT malformed, contained fewer than 3 sections"),null;try{const i=Ei(n);return i?JSON.parse(i):(rn("Failed to decode base64 JWT payload"),null)}catch(i){return rn("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Ur(t){const e=fr(t);return j(e,"internal-error"),j(typeof e.exp<"u","internal-error"),j(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -553,7 +553,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function Dt(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Je&&nl(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function nl({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
+ */async function Bt(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Qe&&fl(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function fl({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -568,7 +568,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class rl{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
+ */class gl{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -583,7 +583,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Xn{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Pt(this.lastLoginAt),this.creationTime=Pt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
+ */class ir{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Dt(this.lastLoginAt),this.creationTime=Dt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -598,7 +598,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function dn(t){var h;const e=t.auth,n=await t.getIdToken(),r=await Dt(t,un(e,{idToken:n}));H(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const s=(h=i.providerUserInfo)!=null&&h.length?Mi(i.providerUserInfo):[],a=sl(t.providerData,s),o=t.isAnonymous,l=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),c=o?l:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new Xn(i.createdAt,i.lastLoginAt),isAnonymous:c};Object.assign(t,d)}async function il(t){const e=Me(t);await dn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function sl(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function Mi(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
+ */async function _n(t){var h;const e=t.auth,n=await t.getIdToken(),r=await Bt(t,mn(e,{idToken:n}));j(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const s=(h=i.providerUserInfo)!=null&&h.length?Wi(i.providerUserInfo):[],a=ml(t.providerData,s),o=t.isAnonymous,l=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),u=o?l:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new ir(i.createdAt,i.lastLoginAt),isAnonymous:u};Object.assign(t,d)}async function pl(t){const e=We(t);await _n(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function ml(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function Wi(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -613,7 +613,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function al(t,e){const n=await Di(t,{},async()=>{const r=Ut({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,a=await Li(t,i,"/v1/token",`key=${s}`),o=await t._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:o,body:r};return t.emulatorConfig&&tr(t.emulatorConfig.host)&&(l.credentials="include"),Ni.fetch()(a,l)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function ol(t,e){return Xe(t,"POST","/v2/accounts:revokeToken",Ye(t,e))}/**
+ */async function _l(t,e){const n=await Hi(t,{},async()=>{const r=Wt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,a=await Vi(t,i,"/v1/token",`key=${s}`),o=await t._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:o,body:r};return t.emulatorConfig&&lr(t.emulatorConfig.host)&&(l.credentials="include"),Bi.fetch()(a,l)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function bl(t,e){return et(t,"POST","/v2/accounts:revokeToken",Ze(t,e))}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -628,7 +628,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class ft{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){H(e.idToken,"internal-error"),H(typeof e.idToken<"u","internal-error"),H(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):xr(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){H(e.length!==0,"internal-error");const n=xr(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(H(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await al(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,a=new ft;return r&&(H(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(H(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(H(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new ft,this.toJSON())}_performRefresh(){return Te("not implemented")}}/**
+ */class mt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){j(e.idToken,"internal-error"),j(typeof e.idToken<"u","internal-error"),j(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Ur(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){j(e.length!==0,"internal-error");const n=Ur(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(j(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await _l(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,a=new mt;return r&&(j(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(j(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(j(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new mt,this.toJSON())}_performRefresh(){return Oe("not implemented")}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -643,7 +643,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function He(t,e){H(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class ye{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new rl(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Xn(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await Dt(this,this.stsTokenManager.getToken(this.auth,e));return H(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return tl(this,e)}reload(){return il(this)}_assign(e){this!==e&&(H(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new ye({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){H(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await dn(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ge(this.auth.app))return Promise.reject(Se(this.auth));const e=await this.getIdToken();return await Dt(this,el(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,s=n.phoneNumber??void 0,a=n.photoURL??void 0,o=n.tenantId??void 0,l=n._redirectEventId??void 0,c=n.createdAt??void 0,d=n.lastLoginAt??void 0,{uid:h,emailVerified:p,isAnonymous:m,providerData:b,stsTokenManager:T}=n;H(h&&T,e,"internal-error");const _=ft.fromJSON(this.name,T);H(typeof h=="string",e,"internal-error"),He(r,e.name),He(i,e.name),H(typeof p=="boolean",e,"internal-error"),H(typeof m=="boolean",e,"internal-error"),He(s,e.name),He(a,e.name),He(o,e.name),He(l,e.name),He(c,e.name),He(d,e.name);const S=new ye({uid:h,auth:e,email:i,emailVerified:p,displayName:r,isAnonymous:m,photoURL:a,phoneNumber:s,tenantId:o,stsTokenManager:_,createdAt:c,lastLoginAt:d});return b&&Array.isArray(b)&&(S.providerData=b.map(E=>({...E}))),l&&(S._redirectEventId=l),S}static async _fromIdTokenResponse(e,n,r=!1){const i=new ft;i.updateFromServerResponse(n);const s=new ye({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await dn(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];H(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?Mi(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),o=new ft;o.updateFromIdToken(r);const l=new ye({uid:i.localId,auth:e,stsTokenManager:o,isAnonymous:a}),c={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Xn(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,c),l}}/**
+ */function ze(t,e){j(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class ke{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new gl(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new ir(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await Bt(this,this.stsTokenManager.getToken(this.auth,e));return j(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return hl(this,e)}reload(){return pl(this)}_assign(e){this!==e&&(j(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new ke({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){j(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await _n(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(be(this.auth.app))return Promise.reject(Pe(this.auth));const e=await this.getIdToken();return await Bt(this,dl(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,s=n.phoneNumber??void 0,a=n.photoURL??void 0,o=n.tenantId??void 0,l=n._redirectEventId??void 0,u=n.createdAt??void 0,d=n.lastLoginAt??void 0,{uid:h,emailVerified:g,isAnonymous:_,providerData:b,stsTokenManager:T}=n;j(h&&T,e,"internal-error");const m=mt.fromJSON(this.name,T);j(typeof h=="string",e,"internal-error"),ze(r,e.name),ze(i,e.name),j(typeof g=="boolean",e,"internal-error"),j(typeof _=="boolean",e,"internal-error"),ze(s,e.name),ze(a,e.name),ze(o,e.name),ze(l,e.name),ze(u,e.name),ze(d,e.name);const v=new ke({uid:h,auth:e,email:i,emailVerified:g,displayName:r,isAnonymous:_,photoURL:a,phoneNumber:s,tenantId:o,stsTokenManager:m,createdAt:u,lastLoginAt:d});return b&&Array.isArray(b)&&(v.providerData=b.map(P=>({...P}))),l&&(v._redirectEventId=l),v}static async _fromIdTokenResponse(e,n,r=!1){const i=new mt;i.updateFromServerResponse(n);const s=new ke({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await _n(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];j(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?Wi(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),o=new mt;o.updateFromIdToken(r);const l=new ke({uid:i.localId,auth:e,stsTokenManager:o,isAnonymous:a}),u={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new ir(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,u),l}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -658,7 +658,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Or=new Map;function Ae(t){De(t instanceof Function,"Expected a class definition");let e=Or.get(t);return e?(De(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Or.set(t,e),e)}/**
+ */const Fr=new Map;function De(t){He(t instanceof Function,"Expected a class definition");let e=Fr.get(t);return e?(He(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Fr.set(t,e),e)}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -673,7 +673,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Ui{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Ui.type="NONE";const Nr=Ui;/**
+ */class ji{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}ji.type="NONE";const Br=ji;/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -688,7 +688,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function Qt(t,e,n){return`firebase:${t}:${e}:${n}`}class gt{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=Qt(this.userKey,i.apiKey,s),this.fullPersistenceKey=Qt("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await un(this.auth,{idToken:e}).catch(()=>{});return n?ye._fromGetAccountInfoResponse(this.auth,n,e):null}return ye._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new gt(Ae(Nr),e,r);const i=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let s=i[0]||Ae(Nr);const a=Qt(r,e.config.apiKey,e.name);let o=null;for(const c of n)try{const d=await c._get(a);if(d){let h;if(typeof d=="string"){const p=await un(e,{idToken:d}).catch(()=>{});if(!p)break;h=await ye._fromGetAccountInfoResponse(e,p,d)}else h=ye._fromJSON(e,d);c!==s&&(o=h),s=c;break}}catch{}const l=i.filter(c=>c._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new gt(s,e,r):(s=l[0],o&&await s._set(a,o.toJSON()),await Promise.all(n.map(async c=>{if(c!==s)try{await c._remove(a)}catch{}})),new gt(s,e,r))}}/**
+ */function sn(t,e,n){return`firebase:${t}:${e}:${n}`}class _t{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=sn(this.userKey,i.apiKey,s),this.fullPersistenceKey=sn("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await mn(this.auth,{idToken:e}).catch(()=>{});return n?ke._fromGetAccountInfoResponse(this.auth,n,e):null}return ke._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new _t(De(Br),e,r);const i=(await Promise.all(n.map(async u=>{if(await u._isAvailable())return u}))).filter(u=>u);let s=i[0]||De(Br);const a=sn(r,e.config.apiKey,e.name);let o=null;for(const u of n)try{const d=await u._get(a);if(d){let h;if(typeof d=="string"){const g=await mn(e,{idToken:d}).catch(()=>{});if(!g)break;h=await ke._fromGetAccountInfoResponse(e,g,d)}else h=ke._fromJSON(e,d);u!==s&&(o=h),s=u;break}}catch{}const l=i.filter(u=>u._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new _t(s,e,r):(s=l[0],o&&await s._set(a,o.toJSON()),await Promise.all(n.map(async u=>{if(u!==s)try{await u._remove(a)}catch{}})),new _t(s,e,r))}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -703,7 +703,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function Dr(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Vi(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Fi(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(ji(e))return"Blackberry";if(zi(e))return"Webos";if(Bi(e))return"Safari";if((e.includes("chrome/")||Hi(e))&&!e.includes("edge/"))return"Chrome";if(Wi(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Fi(t=ce()){return/firefox\//i.test(t)}function Bi(t=ce()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Hi(t=ce()){return/crios\//i.test(t)}function Vi(t=ce()){return/iemobile/i.test(t)}function Wi(t=ce()){return/android/i.test(t)}function ji(t=ce()){return/blackberry/i.test(t)}function zi(t=ce()){return/webos/i.test(t)}function or(t=ce()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function ll(t=ce()){var e;return or(t)&&!!((e=window.navigator)!=null&&e.standalone)}function cl(){return wa()&&document.documentMode===10}function Gi(t=ce()){return or(t)||Wi(t)||zi(t)||ji(t)||/windows phone/i.test(t)||Vi(t)}/**
+ */function Hr(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Ki(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(zi(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Yi(e))return"Blackberry";if(Xi(e))return"Webos";if(Gi(e))return"Safari";if((e.includes("chrome/")||qi(e))&&!e.includes("edge/"))return"Chrome";if(Ji(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function zi(t=pe()){return/firefox\//i.test(t)}function Gi(t=pe()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function qi(t=pe()){return/crios\//i.test(t)}function Ki(t=pe()){return/iemobile/i.test(t)}function Ji(t=pe()){return/android/i.test(t)}function Yi(t=pe()){return/blackberry/i.test(t)}function Xi(t=pe()){return/webos/i.test(t)}function gr(t=pe()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function vl(t=pe()){var e;return gr(t)&&!!((e=window.navigator)!=null&&e.standalone)}function yl(){return Ra()&&document.documentMode===10}function Qi(t=pe()){return gr(t)||Ji(t)||Xi(t)||Yi(t)||/windows phone/i.test(t)||Ki(t)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -718,7 +718,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function qi(t,e=[]){let n;switch(t){case"Browser":n=Dr(ce());break;case"Worker":n=`${Dr(ce())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Ft}/${r}`}/**
+ */function Zi(t,e=[]){let n;switch(t){case"Browser":n=Hr(pe());break;case"Worker":n=`${Hr(pe())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${jt}/${r}`}/**
  * @license
  * Copyright 2022 Google LLC
  *
@@ -733,7 +733,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class ul{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((a,o)=>{try{const l=e(s);a(l)}catch(l){o(l)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
+ */class wl{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((a,o)=>{try{const l=e(s);a(l)}catch(l){o(l)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
  * @license
  * Copyright 2023 Google LLC
  *
@@ -748,7 +748,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function dl(t,e={}){return Xe(t,"GET","/v2/passwordPolicy",Ye(t,e))}/**
+ */async function $l(t,e={}){return et(t,"GET","/v2/passwordPolicy",Ze(t,e))}/**
  * @license
  * Copyright 2023 Google LLC
  *
@@ -763,7 +763,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const hl=6;class fl{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??hl,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
+ */const Sl=6;class kl{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??Sl,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -778,7 +778,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class gl{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Lr(this),this.idTokenSubscription=new Lr(this),this.beforeStateQueue=new ul(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Ri,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Ae(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await gt.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await un(this,{idToken:e}),r=await ye._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var s;if(ge(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(o,o))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(s=this.redirectUser)==null?void 0:s._redirectEventId,o=r==null?void 0:r._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===o)&&(l!=null&&l.user)&&(r=l.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return H(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await dn(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Go()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(ge(this.app))return Promise.reject(Se(this));const n=e?Me(e):null;return n&&H(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&H(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return ge(this.app)?Promise.reject(Se(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return ge(this.app)?Promise.reject(Se(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ae(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await dl(this),n=new fl(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Mt("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await ol(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Ae(e)||this._popupRedirectResolver;H(n,this,"argument-error"),this.redirectPersistenceManager=await gt.create(this,[Ae(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let a=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(H(o,this,"internal-error"),o.then(()=>{a||s(this.currentUser)}),typeof n=="function"){const l=e.addObserver(n,r,i);return()=>{a=!0,l()}}else{const l=e.addObserver(n);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return H(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=qi(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(ge(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&xi(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Ue(t){return Me(t)}class Lr{constructor(e){this.auth=e,this.observer=null,this.addObserver=Ca(n=>this.observer=n)}get next(){return H(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
+ */class El{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Vr(this),this.idTokenSubscription=new Vr(this),this.beforeStateQueue=new wl(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Mi,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=De(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await _t.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await mn(this,{idToken:e}),r=await ke._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var s;if(be(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(o,o))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(s=this.redirectUser)==null?void 0:s._redirectEventId,o=r==null?void 0:r._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===o)&&(l!=null&&l.user)&&(r=l.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return j(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await _n(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=rl()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(be(this.app))return Promise.reject(Pe(this));const n=e?We(e):null;return n&&j(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&j(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return be(this.app)?Promise.reject(Pe(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return be(this.app)?Promise.reject(Pe(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(De(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await $l(this),n=new kl(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Vt("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await bl(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&De(e)||this._popupRedirectResolver;j(n,this,"argument-error"),this.redirectPersistenceManager=await _t.create(this,[De(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let a=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(j(o,this,"internal-error"),o.then(()=>{a||s(this.currentUser)}),typeof n=="function"){const l=e.addObserver(n,r,i);return()=>{a=!0,l()}}else{const l=e.addObserver(n);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return j(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Zi(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(be(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&Ui(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function je(t){return We(t)}class Vr{constructor(e){this.auth=e,this.observer=null,this.addObserver=Ua(n=>this.observer=n)}get next(){return j(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -793,7 +793,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */let bn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function pl(t){bn=t}function Ki(t){return bn.loadJS(t)}function ml(){return bn.recaptchaEnterpriseScript}function _l(){return bn.gapiScript}function bl(t){return`__${t}${Math.floor(Math.random()*1e6)}`}class yl{constructor(){this.enterprise=new vl}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class vl{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}/**
+ */let En={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Cl(t){En=t}function es(t){return En.loadJS(t)}function Il(){return En.recaptchaEnterpriseScript}function Tl(){return En.gapiScript}function Pl(t){return`__${t}${Math.floor(Math.random()*1e6)}`}class Al{constructor(){this.enterprise=new xl}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class xl{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}/**
  * @license
  * Copyright 2022 Google LLC
  *
@@ -808,7 +808,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const wl="recaptcha-enterprise",Ji="NO_RECAPTCHA",Mr="onFirebaseAuthREInstanceReady";class Ve{constructor(e){this.type=wl,this.auth=Ue(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,o)=>{Zo(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)o(new Error("recaptcha Enterprise site key undefined"));else{const c=new Qo(l);return s.tenantId==null?s._agentRecaptchaConfig=c:s._tenantRecaptchaConfigs[s.tenantId]=c,a(c.siteKey)}}).catch(l=>{o(l)})})}function i(s,a,o){const l=window.grecaptcha;Rr(l)?l.enterprise.ready(()=>{l.enterprise.execute(s,{action:e}).then(c=>{a(c)}).catch(()=>{a(Ji)})}):o(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new yl().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{r(this.auth).then(async o=>{if(!n&&Rr(window.grecaptcha)&&Ve.scriptInjectionDeferred)await Ve.scriptInjectionDeferred.promise,i(o,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let l=ml();l.length!==0&&(l+=o+`&onload=${Mr}`),Ve.scriptInjectionDeferred=new $i,window[Mr]=()=>{var c;(c=Ve.scriptInjectionDeferred)==null||c.resolve()},Ki(l).then(()=>{var c;return(c=Ve.scriptInjectionDeferred)==null?void 0:c.promise}).then(()=>{i(o,s,a)}).catch(c=>{a(c)})}}).catch(o=>{a(o)})})}}Ve.scriptInjectionDeferred=null;async function Ur(t,e,n,r=!1,i=!1){const s=new Ve(t);let a;if(i)a=Ji;else try{a=await s.verify(n)}catch{a=await s.verify(n,!0)}const o={...e};if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in o){const l=o.phoneEnrollmentInfo.phoneNumber,c=o.phoneEnrollmentInfo.recaptchaToken;Object.assign(o,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:c,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in o){const l=o.phoneSignInInfo.recaptchaToken;Object.assign(o,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return o}return r?Object.assign(o,{captchaResp:a}):Object.assign(o,{captchaResponse:a}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Qn(t,e,n,r,i){var s;if((s=t._getRecaptchaConfig())!=null&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await Ur(t,e,n,n==="getOobCode");return r(t,a)}else return r(t,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Ur(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(a)})}/**
+ */const Rl="recaptcha-enterprise",ts="NO_RECAPTCHA",Wr="onFirebaseAuthREInstanceReady";class Ge{constructor(e){this.type=Rl,this.auth=je(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,o)=>{ul(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)o(new Error("recaptcha Enterprise site key undefined"));else{const u=new cl(l);return s.tenantId==null?s._agentRecaptchaConfig=u:s._tenantRecaptchaConfigs[s.tenantId]=u,a(u.siteKey)}}).catch(l=>{o(l)})})}function i(s,a,o){const l=window.grecaptcha;Mr(l)?l.enterprise.ready(()=>{l.enterprise.execute(s,{action:e}).then(u=>{a(u)}).catch(()=>{a(ts)})}):o(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new Al().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{r(this.auth).then(async o=>{if(!n&&Mr(window.grecaptcha)&&Ge.scriptInjectionDeferred)await Ge.scriptInjectionDeferred.promise,i(o,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let l=Il();l.length!==0&&(l+=o+`&onload=${Wr}`),Ge.scriptInjectionDeferred=new Ti,window[Wr]=()=>{var u;(u=Ge.scriptInjectionDeferred)==null||u.resolve()},es(l).then(()=>{var u;return(u=Ge.scriptInjectionDeferred)==null?void 0:u.promise}).then(()=>{i(o,s,a)}).catch(u=>{a(u)})}}).catch(o=>{a(o)})})}}Ge.scriptInjectionDeferred=null;async function jr(t,e,n,r=!1,i=!1){const s=new Ge(t);let a;if(i)a=ts;else try{a=await s.verify(n)}catch{a=await s.verify(n,!0)}const o={...e};if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in o){const l=o.phoneEnrollmentInfo.phoneNumber,u=o.phoneEnrollmentInfo.recaptchaToken;Object.assign(o,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:u,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in o){const l=o.phoneSignInInfo.recaptchaToken;Object.assign(o,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return o}return r?Object.assign(o,{captchaResp:a}):Object.assign(o,{captchaResponse:a}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function sr(t,e,n,r,i){var s;if((s=t._getRecaptchaConfig())!=null&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await jr(t,e,n,n==="getOobCode");return r(t,a)}else return r(t,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await jr(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(a)})}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -823,7 +823,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function $l(t,e){const n=Ii(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(_t(s,e??{}))return i;_e(i,"already-initialized")}return n.initialize({options:e})}function Sl(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(Ae);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function kl(t,e,n){const r=Ue(t);H(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=Yi(e),{host:a,port:o}=El(e),l=o===null?"":`:${o}`,c={url:`${s}//${a}${l}/`},d=Object.freeze({host:a,port:o,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){H(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),H(_t(c,r.config.emulator)&&_t(d,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=c,r.emulatorConfig=d,r.settings.appVerificationDisabledForTesting=!0,tr(a)?Pa(`${s}//${a}${l}`):Il()}function Yi(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function El(t){const e=Yi(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Fr(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:Fr(a)}}}function Fr(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function Il(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
+ */function Nl(t,e){const n=Ri(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(yt(s,e??{}))return i;Se(i,"already-initialized")}return n.initialize({options:e})}function Ol(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(De);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Dl(t,e,n){const r=je(t);j(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=ns(e),{host:a,port:o}=Ll(e),l=o===null?"":`:${o}`,u={url:`${s}//${a}${l}/`},d=Object.freeze({host:a,port:o,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){j(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),j(yt(u,r.config.emulator)&&yt(d,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=u,r.emulatorConfig=d,r.settings.appVerificationDisabledForTesting=!0,lr(a)?Ha(`${s}//${a}${l}`):Ml()}function ns(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function Ll(t){const e=ns(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:zr(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:zr(a)}}}function zr(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function Ml(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -838,7 +838,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class lr{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Te("not implemented")}_getIdTokenResponse(e){return Te("not implemented")}_linkToIdToken(e,n){return Te("not implemented")}_getReauthenticationResolver(e){return Te("not implemented")}}async function Cl(t,e){return Xe(t,"POST","/v1/accounts:signUp",e)}/**
+ */class pr{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Oe("not implemented")}_getIdTokenResponse(e){return Oe("not implemented")}_linkToIdToken(e,n){return Oe("not implemented")}_getReauthenticationResolver(e){return Oe("not implemented")}}async function Ul(t,e){return et(t,"POST","/v1/accounts:signUp",e)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -853,7 +853,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function Tl(t,e){return Ht(t,"POST","/v1/accounts:signInWithPassword",Ye(t,e))}/**
+ */async function Fl(t,e){return Gt(t,"POST","/v1/accounts:signInWithPassword",Ze(t,e))}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -868,7 +868,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function Al(t,e){return Ht(t,"POST","/v1/accounts:signInWithEmailLink",Ye(t,e))}async function Pl(t,e){return Ht(t,"POST","/v1/accounts:signInWithEmailLink",Ye(t,e))}/**
+ */async function Bl(t,e){return Gt(t,"POST","/v1/accounts:signInWithEmailLink",Ze(t,e))}async function Hl(t,e){return Gt(t,"POST","/v1/accounts:signInWithEmailLink",Ze(t,e))}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -883,7 +883,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Lt extends lr{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new Lt(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new Lt(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Qn(e,n,"signInWithPassword",Tl);case"emailLink":return Al(e,{email:this._email,oobCode:this._password});default:_e(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Qn(e,r,"signUpPassword",Cl);case"emailLink":return Pl(e,{idToken:n,email:this._email,oobCode:this._password});default:_e(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
+ */class Ht extends pr{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new Ht(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new Ht(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return sr(e,n,"signInWithPassword",Fl);case"emailLink":return Bl(e,{email:this._email,oobCode:this._password});default:Se(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return sr(e,r,"signUpPassword",Ul);case"emailLink":return Hl(e,{idToken:n,email:this._email,oobCode:this._password});default:Se(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -898,7 +898,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function pt(t,e){return Ht(t,"POST","/v1/accounts:signInWithIdp",Ye(t,e))}/**
+ */async function bt(t,e){return Gt(t,"POST","/v1/accounts:signInWithIdp",Ze(t,e))}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -913,7 +913,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Rl="http://localhost";class rt extends lr{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new rt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):_e("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=n;if(!r||!i)return null;const a=new rt(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return pt(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,pt(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,pt(e,n)}buildRequest(){const e={requestUri:Rl,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Ut(n)}return e}}/**
+ */const Vl="http://localhost";class lt extends pr{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new lt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):Se("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=n;if(!r||!i)return null;const a=new lt(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return bt(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,bt(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,bt(e,n)}buildRequest(){const e={requestUri:Vl,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Wt(n)}return e}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -928,7 +928,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function xl(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Ol(t){const e=Et(It(t)).link,n=e?Et(It(e)).deep_link_id:null,r=Et(It(t)).deep_link_id;return(r?Et(It(r)).link:null)||r||n||e||t}class cr{constructor(e){const n=Et(It(e)),r=n.apiKey??null,i=n.oobCode??null,s=xl(n.mode??null);H(r&&i&&s,"argument-error"),this.apiKey=r,this.operation=s,this.code=i,this.continueUrl=n.continueUrl??null,this.languageCode=n.lang??null,this.tenantId=n.tenantId??null}static parseLink(e){const n=Ol(e);try{return new cr(n)}catch{return null}}}/**
+ */function Wl(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function jl(t){const e=At(xt(t)).link,n=e?At(xt(e)).deep_link_id:null,r=At(xt(t)).deep_link_id;return(r?At(xt(r)).link:null)||r||n||e||t}class mr{constructor(e){const n=At(xt(e)),r=n.apiKey??null,i=n.oobCode??null,s=Wl(n.mode??null);j(r&&i&&s,"argument-error"),this.apiKey=r,this.operation=s,this.code=i,this.continueUrl=n.continueUrl??null,this.languageCode=n.lang??null,this.tenantId=n.tenantId??null}static parseLink(e){const n=jl(e);try{return new mr(n)}catch{return null}}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -943,7 +943,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class $t{constructor(){this.providerId=$t.PROVIDER_ID}static credential(e,n){return Lt._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=cr.parseLink(n);return H(r,"argument-error"),Lt._fromEmailAndCode(e,r.code,r.tenantId)}}$t.PROVIDER_ID="password";$t.EMAIL_PASSWORD_SIGN_IN_METHOD="password";$t.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
+ */class Et{constructor(){this.providerId=Et.PROVIDER_ID}static credential(e,n){return Ht._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=mr.parseLink(n);return j(r,"argument-error"),Ht._fromEmailAndCode(e,r.code,r.tenantId)}}Et.PROVIDER_ID="password";Et.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Et.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -958,7 +958,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class yn{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
+ */class Cn{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -973,7 +973,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Vt extends yn{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
+ */class qt extends Cn{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -988,7 +988,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class We extends Vt{constructor(){super("facebook.com")}static credential(e){return rt._fromParams({providerId:We.PROVIDER_ID,signInMethod:We.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return We.credentialFromTaggedObject(e)}static credentialFromError(e){return We.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return We.credential(e.oauthAccessToken)}catch{return null}}}We.FACEBOOK_SIGN_IN_METHOD="facebook.com";We.PROVIDER_ID="facebook.com";/**
+ */class qe extends qt{constructor(){super("facebook.com")}static credential(e){return lt._fromParams({providerId:qe.PROVIDER_ID,signInMethod:qe.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return qe.credentialFromTaggedObject(e)}static credentialFromError(e){return qe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return qe.credential(e.oauthAccessToken)}catch{return null}}}qe.FACEBOOK_SIGN_IN_METHOD="facebook.com";qe.PROVIDER_ID="facebook.com";/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1003,7 +1003,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Ie extends Vt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return rt._fromParams({providerId:Ie.PROVIDER_ID,signInMethod:Ie.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return Ie.credentialFromTaggedObject(e)}static credentialFromError(e){return Ie.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return Ie.credential(n,r)}catch{return null}}}Ie.GOOGLE_SIGN_IN_METHOD="google.com";Ie.PROVIDER_ID="google.com";/**
+ */class Re extends qt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return lt._fromParams({providerId:Re.PROVIDER_ID,signInMethod:Re.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return Re.credentialFromTaggedObject(e)}static credentialFromError(e){return Re.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return Re.credential(n,r)}catch{return null}}}Re.GOOGLE_SIGN_IN_METHOD="google.com";Re.PROVIDER_ID="google.com";/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1018,7 +1018,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class je extends Vt{constructor(){super("github.com")}static credential(e){return rt._fromParams({providerId:je.PROVIDER_ID,signInMethod:je.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return je.credentialFromTaggedObject(e)}static credentialFromError(e){return je.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return je.credential(e.oauthAccessToken)}catch{return null}}}je.GITHUB_SIGN_IN_METHOD="github.com";je.PROVIDER_ID="github.com";/**
+ */class Ke extends qt{constructor(){super("github.com")}static credential(e){return lt._fromParams({providerId:Ke.PROVIDER_ID,signInMethod:Ke.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ke.credentialFromTaggedObject(e)}static credentialFromError(e){return Ke.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ke.credential(e.oauthAccessToken)}catch{return null}}}Ke.GITHUB_SIGN_IN_METHOD="github.com";Ke.PROVIDER_ID="github.com";/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1033,7 +1033,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class ze extends Vt{constructor(){super("twitter.com")}static credential(e,n){return rt._fromParams({providerId:ze.PROVIDER_ID,signInMethod:ze.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return ze.credentialFromTaggedObject(e)}static credentialFromError(e){return ze.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return ze.credential(n,r)}catch{return null}}}ze.TWITTER_SIGN_IN_METHOD="twitter.com";ze.PROVIDER_ID="twitter.com";/**
+ */class Je extends qt{constructor(){super("twitter.com")}static credential(e,n){return lt._fromParams({providerId:Je.PROVIDER_ID,signInMethod:Je.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return Je.credentialFromTaggedObject(e)}static credentialFromError(e){return Je.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return Je.credential(n,r)}catch{return null}}}Je.TWITTER_SIGN_IN_METHOD="twitter.com";Je.PROVIDER_ID="twitter.com";/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1048,7 +1048,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function Nl(t,e){return Ht(t,"POST","/v1/accounts:signUp",Ye(t,e))}/**
+ */async function zl(t,e){return Gt(t,"POST","/v1/accounts:signUp",Ze(t,e))}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1063,7 +1063,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class it{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await ye._fromIdTokenResponse(e,r,i),a=Br(r);return new it({user:s,providerId:a,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Br(r);return new it({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Br(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
+ */class ct{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await ke._fromIdTokenResponse(e,r,i),a=Gr(r);return new ct({user:s,providerId:a,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Gr(r);return new ct({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Gr(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1078,7 +1078,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class hn extends Je{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,hn.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new hn(e,n,r,i)}}function Xi(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?hn._fromErrorAndOperation(t,s,e,r):s})}async function Dl(t,e,n=!1){const r=await Dt(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return it._forOperation(t,"link",r)}/**
+ */class bn extends Qe{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,bn.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new bn(e,n,r,i)}}function rs(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?bn._fromErrorAndOperation(t,s,e,r):s})}async function Gl(t,e,n=!1){const r=await Bt(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return ct._forOperation(t,"link",r)}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -1093,7 +1093,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function Ll(t,e,n=!1){const{auth:r}=t;if(ge(r.app))return Promise.reject(Se(r));const i="reauthenticate";try{const s=await Dt(t,Xi(r,i,e,t),n);H(s.idToken,r,"internal-error");const a=ar(s.idToken);H(a,r,"internal-error");const{sub:o}=a;return H(t.uid===o,r,"user-mismatch"),it._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&_e(r,"user-mismatch"),s}}/**
+ */async function ql(t,e,n=!1){const{auth:r}=t;if(be(r.app))return Promise.reject(Pe(r));const i="reauthenticate";try{const s=await Bt(t,rs(r,i,e,t),n);j(s.idToken,r,"internal-error");const a=fr(s.idToken);j(a,r,"internal-error");const{sub:o}=a;return j(t.uid===o,r,"user-mismatch"),ct._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&Se(r,"user-mismatch"),s}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1108,7 +1108,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function Qi(t,e,n=!1){if(ge(t.app))return Promise.reject(Se(t));const r="signIn",i=await Xi(t,r,e),s=await it._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function Ml(t,e){return Qi(Ue(t),e)}/**
+ */async function is(t,e,n=!1){if(be(t.app))return Promise.reject(Pe(t));const r="signIn",i=await rs(t,r,e),s=await ct._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function Kl(t,e){return is(je(t),e)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1123,7 +1123,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function Zi(t){const e=Ue(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Ul(t,e,n){if(ge(t.app))return Promise.reject(Se(t));const r=Ue(t),a=await Qn(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Nl).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&Zi(t),l}),o=await it._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(o.user),o}function Fl(t,e,n){return ge(t.app)?Promise.reject(Se(t)):Ml(Me(t),$t.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Zi(t),r})}function Bl(t,e,n,r){return Me(t).onIdTokenChanged(e,n,r)}function Hl(t,e,n){return Me(t).beforeAuthStateChanged(e,n)}function Vl(t,e,n,r){return Me(t).onAuthStateChanged(e,n,r)}function Wl(t){return Me(t).signOut()}const fn="__sak";/**
+ */async function ss(t){const e=je(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Jl(t,e,n){if(be(t.app))return Promise.reject(Pe(t));const r=je(t),a=await sr(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",zl).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&ss(t),l}),o=await ct._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(o.user),o}function Yl(t,e,n){return be(t.app)?Promise.reject(Pe(t)):Kl(We(t),Et.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&ss(t),r})}function Xl(t,e,n,r){return We(t).onIdTokenChanged(e,n,r)}function Ql(t,e,n){return We(t).beforeAuthStateChanged(e,n)}function Zl(t,e,n,r){return We(t).onAuthStateChanged(e,n,r)}function ec(t){return We(t).signOut()}const vn="__sak";/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -1138,7 +1138,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class es{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(fn,"1"),this.storage.removeItem(fn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
+ */class as{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(vn,"1"),this.storage.removeItem(vn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1153,7 +1153,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const jl=1e3,zl=10;class ts extends es{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Gi(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,o,l)=>{this.notifyListeners(a,l)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!n&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);cl()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,zl):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},jl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}ts.type="LOCAL";const Gl=ts;/**
+ */const tc=1e3,nc=10;class os extends as{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Qi(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,o,l)=>{this.notifyListeners(a,l)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!n&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);yl()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,nc):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},tc)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}os.type="LOCAL";const rc=os;/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1168,7 +1168,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class ns extends es{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}ns.type="SESSION";const rs=ns;/**
+ */class ls extends as{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}ls.type="SESSION";const cs=ls;/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -1183,7 +1183,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function ql(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
+ */function ic(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -1198,7 +1198,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class vn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new vn(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const o=Array.from(a).map(async c=>c(n.origin,s)),l=await ql(o);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}vn.receivers=[];/**
+ */class In{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new In(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const o=Array.from(a).map(async u=>u(n.origin,s)),l=await ic(o);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}In.receivers=[];/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1213,7 +1213,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function ur(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
+ */function _r(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -1228,7 +1228,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Kl{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((o,l)=>{const c=ur("",20);i.port1.start();const d=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(h){const p=h;if(p.data.eventId===c)switch(p.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),o(p.data.response);break;default:clearTimeout(d),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
+ */class sc{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((o,l)=>{const u=_r("",20);i.port1.start();const d=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(h){const g=h;if(g.data.eventId===u)switch(g.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),o(g.data.response);break;default:clearTimeout(d),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:u,data:n},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1243,7 +1243,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function ke(){return window}function Jl(t){ke().location.href=t}/**
+ */function Ae(){return window}function ac(t){Ae().location.href=t}/**
  * @license
  * Copyright 2020 Google LLC.
  *
@@ -1258,7 +1258,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function is(){return typeof ke().WorkerGlobalScope<"u"&&typeof ke().importScripts=="function"}async function Yl(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Xl(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function Ql(){return is()?self:null}/**
+ */function us(){return typeof Ae().WorkerGlobalScope<"u"&&typeof Ae().importScripts=="function"}async function oc(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function lc(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function cc(){return us()?self:null}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -1273,7 +1273,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const ss="firebaseLocalStorageDb",Zl=1,gn="firebaseLocalStorage",as="fbase_key";class Wt{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function wn(t,e){return t.transaction([gn],e?"readwrite":"readonly").objectStore(gn)}function ec(){const t=indexedDB.deleteDatabase(ss);return new Wt(t).toPromise()}function os(){const t=indexedDB.open(ss,Zl);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(gn,{keyPath:as})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(gn)?e(r):(r.close(),await ec(),e(await os()))})})}async function Hr(t,e,n){const r=wn(t,!0).put({[as]:e,value:n});return new Wt(r).toPromise()}async function tc(t,e){const n=wn(t,!1).get(e),r=await new Wt(n).toPromise();return r===void 0?null:r.value}function Vr(t,e){const n=wn(t,!0).delete(e);return new Wt(n).toPromise()}const nc=800,rc=3;class ls{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isClosing)throw new Error("Database is closing");return this.dbPromise?this.dbPromise:(this.dbPromise=os(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(this.isClosing||n++>rc)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return is()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=vn._getInstance(Ql()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await Yl(),!this.activeServiceWorker)return;this.sender=new Kl(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Xl()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await Hr(e,fn,"1"),await Vr(e,fn)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Hr(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>tc(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Vr(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(i=>{const s=wn(i,!1).getAll();return new Wt(s).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}catch(e){return this.isClosing||xi(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),nc)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}ls.type="LOCAL";const ic=ls;new Bt(3e4,6e4);/**
+ */const ds="firebaseLocalStorageDb",uc=1,yn="firebaseLocalStorage",hs="fbase_key";class Kt{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Tn(t,e){return t.transaction([yn],e?"readwrite":"readonly").objectStore(yn)}function dc(){const t=indexedDB.deleteDatabase(ds);return new Kt(t).toPromise()}function fs(){const t=indexedDB.open(ds,uc);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(yn,{keyPath:hs})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(yn)?e(r):(r.close(),await dc(),e(await fs()))})})}async function qr(t,e,n){const r=Tn(t,!0).put({[hs]:e,value:n});return new Kt(r).toPromise()}async function hc(t,e){const n=Tn(t,!1).get(e),r=await new Kt(n).toPromise();return r===void 0?null:r.value}function Kr(t,e){const n=Tn(t,!0).delete(e);return new Kt(n).toPromise()}const fc=800,gc=3;class gs{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isClosing)throw new Error("Database is closing");return this.dbPromise?this.dbPromise:(this.dbPromise=fs(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(this.isClosing||n++>gc)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return us()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=In._getInstance(cc()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await oc(),!this.activeServiceWorker)return;this.sender=new sc(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||lc()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await qr(e,vn,"1"),await Kr(e,vn)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>qr(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>hc(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Kr(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(i=>{const s=Tn(i,!1).getAll();return new Kt(s).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}catch(e){return this.isClosing||Ui(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),fc)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}gs.type="LOCAL";const pc=gs;new zt(3e4,6e4);/**
  * @license
  * Copyright 2021 Google LLC
  *
@@ -1288,7 +1288,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function dr(t,e){return e?Ae(e):(H(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
+ */function br(t,e){return e?De(e):(j(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -1303,7 +1303,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class hr extends lr{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return pt(e,this._buildIdpRequest())}_linkToIdToken(e,n){return pt(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return pt(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function sc(t){return Qi(t.auth,new hr(t),t.bypassAuthState)}function ac(t){const{auth:e,user:n}=t;return H(n,e,"internal-error"),Ll(n,new hr(t),t.bypassAuthState)}async function oc(t){const{auth:e,user:n}=t;return H(n,e,"internal-error"),Dl(n,new hr(t),t.bypassAuthState)}/**
+ */class vr extends pr{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return bt(e,this._buildIdpRequest())}_linkToIdToken(e,n){return bt(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return bt(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function mc(t){return is(t.auth,new vr(t),t.bypassAuthState)}function _c(t){const{auth:e,user:n}=t;return j(n,e,"internal-error"),ql(n,new vr(t),t.bypassAuthState)}async function bc(t){const{auth:e,user:n}=t;return j(n,e,"internal-error"),Gl(n,new vr(t),t.bypassAuthState)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1318,7 +1318,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class cs{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:a,type:o}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(l))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return sc;case"linkViaPopup":case"linkViaRedirect":return oc;case"reauthViaPopup":case"reauthViaRedirect":return ac;default:_e(this.auth,"internal-error")}}resolve(e){De(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){De(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
+ */class ps{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:a,type:o}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(l))}catch(u){this.reject(u)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return mc;case"linkViaPopup":case"linkViaRedirect":return bc;case"reauthViaPopup":case"reauthViaRedirect":return _c;default:Se(this.auth,"internal-error")}}resolve(e){He(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){He(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1333,7 +1333,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const lc=new Bt(2e3,1e4);async function cc(t,e,n){if(ge(t.app))return Promise.reject(ve(t,"operation-not-supported-in-this-environment"));const r=Ue(t);Oi(t,e,yn);const i=dr(r,n);return new Ze(r,"signInViaPopup",e,i).executeNotNull()}class Ze extends cs{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,Ze.currentPopupAction&&Ze.currentPopupAction.cancel(),Ze.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return H(e,this.auth,"internal-error"),e}async onExecution(){De(this.filter.length===1,"Popup operations only handle one event");const e=ur();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(ve(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(ve(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Ze.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(ve(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,lc.get())};e()}}Ze.currentPopupAction=null;/**
+ */const vc=new zt(2e3,1e4);async function yc(t,e,n){if(be(t.app))return Promise.reject(Ee(t,"operation-not-supported-in-this-environment"));const r=je(t);Fi(t,e,Cn);const i=br(r,n);return new it(r,"signInViaPopup",e,i).executeNotNull()}class it extends ps{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,it.currentPopupAction&&it.currentPopupAction.cancel(),it.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return j(e,this.auth,"internal-error"),e}async onExecution(){He(this.filter.length===1,"Popup operations only handle one event");const e=_r();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(Ee(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(Ee(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,it.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Ee(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,vc.get())};e()}}it.currentPopupAction=null;/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1348,7 +1348,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const uc="pendingRedirect",Zt=new Map;class dc extends cs{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Zt.get(this.auth._key());if(!e){try{const r=await hc(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Zt.set(this.auth._key(),e)}return this.bypassAuthState||Zt.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function hc(t,e){const n=ds(e),r=us(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}async function fc(t,e){return us(t)._set(ds(e),"true")}function gc(t,e){Zt.set(t._key(),e)}function us(t){return Ae(t._redirectPersistence)}function ds(t){return Qt(uc,t.config.apiKey,t.name)}/**
+ */const wc="pendingRedirect",an=new Map;class $c extends ps{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=an.get(this.auth._key());if(!e){try{const r=await Sc(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}an.set(this.auth._key(),e)}return this.bypassAuthState||an.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Sc(t,e){const n=_s(e),r=ms(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}async function kc(t,e){return ms(t)._set(_s(e),"true")}function Ec(t,e){an.set(t._key(),e)}function ms(t){return De(t._redirectPersistence)}function _s(t){return sn(wc,t.config.apiKey,t.name)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1363,7 +1363,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function pc(t,e,n){return mc(t,e,n)}async function mc(t,e,n){if(ge(t.app))return Promise.reject(Se(t));const r=Ue(t);Oi(t,e,yn),await r._initializationPromise;const i=dr(r,n);return await fc(i,r),i._openRedirect(r,e,"signInViaRedirect")}async function _c(t,e,n=!1){if(ge(t.app))return Promise.reject(Se(t));const r=Ue(t),i=dr(r,e),a=await new dc(r,i,n).execute();return a&&!n&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
+ */function Cc(t,e,n){return Ic(t,e,n)}async function Ic(t,e,n){if(be(t.app))return Promise.reject(Pe(t));const r=je(t);Fi(t,e,Cn),await r._initializationPromise;const i=br(r,n);return await kc(i,r),i._openRedirect(r,e,"signInViaRedirect")}async function Tc(t,e,n=!1){if(be(t.app))return Promise.reject(Pe(t));const r=je(t),i=br(r,e),a=await new $c(r,i,n).execute();return a&&!n&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1378,7 +1378,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const bc=600*1e3;class yc{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!vc(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!hs(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(ve(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=bc&&this.cachedEventUids.clear(),this.cachedEventUids.has(Wr(e))}saveEventToCache(e){this.cachedEventUids.add(Wr(e)),this.lastProcessedEventTime=Date.now()}}function Wr(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function hs({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function vc(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return hs(t);default:return!1}}/**
+ */const Pc=600*1e3;class Ac{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!xc(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!bs(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(Ee(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Pc&&this.cachedEventUids.clear(),this.cachedEventUids.has(Jr(e))}saveEventToCache(e){this.cachedEventUids.add(Jr(e)),this.lastProcessedEventTime=Date.now()}}function Jr(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function bs({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function xc(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return bs(t);default:return!1}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1393,7 +1393,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function wc(t,e={}){return Xe(t,"GET","/v1/projects",e)}/**
+ */async function Rc(t,e={}){return et(t,"GET","/v1/projects",e)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1408,7 +1408,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const $c=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Sc=/^https?/;async function kc(t){if(t.config.emulator)return;const{authorizedDomains:e}=await wc(t);for(const n of e)try{if(Ec(n))return}catch{}_e(t,"unauthorized-domain")}function Ec(t){const e=Yn(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===r}if(!Sc.test(n))return!1;if($c.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
+ */const Nc=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Oc=/^https?/;async function Dc(t){if(t.config.emulator)return;const{authorizedDomains:e}=await Rc(t);for(const n of e)try{if(Lc(n))return}catch{}Se(t,"unauthorized-domain")}function Lc(t){const e=rr(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===r}if(!Oc.test(n))return!1;if(Nc.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
  * @license
  * Copyright 2020 Google LLC.
  *
@@ -1423,7 +1423,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Ic=new Bt(3e4,6e4);function jr(){const t=ke().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function Cc(t){return new Promise((e,n)=>{var i,s,a;function r(){jr(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{jr(),n(ve(t,"network-request-failed"))},timeout:Ic.get()})}if((s=(i=ke().gapi)==null?void 0:i.iframes)!=null&&s.Iframe)e(gapi.iframes.getContext());else if((a=ke().gapi)!=null&&a.load)r();else{const o=bl("iframefcb");return ke()[o]=()=>{gapi.load?r():n(ve(t,"network-request-failed"))},Ki(`${_l()}?onload=${o}`).catch(l=>n(l))}}).catch(e=>{throw en=null,e})}let en=null;function Tc(t){return en=en||Cc(t),en}/**
+ */const Mc=new zt(3e4,6e4);function Yr(){const t=Ae().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function Uc(t){return new Promise((e,n)=>{var i,s,a;function r(){Yr(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Yr(),n(Ee(t,"network-request-failed"))},timeout:Mc.get()})}if((s=(i=Ae().gapi)==null?void 0:i.iframes)!=null&&s.Iframe)e(gapi.iframes.getContext());else if((a=Ae().gapi)!=null&&a.load)r();else{const o=Pl("iframefcb");return Ae()[o]=()=>{gapi.load?r():n(Ee(t,"network-request-failed"))},es(`${Tl()}?onload=${o}`).catch(l=>n(l))}}).catch(e=>{throw on=null,e})}let on=null;function Fc(t){return on=on||Uc(t),on}/**
  * @license
  * Copyright 2020 Google LLC.
  *
@@ -1438,7 +1438,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Ac=new Bt(5e3,15e3),Pc="__/auth/iframe",Rc="emulator/auth/iframe",xc={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Oc=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Nc(t){const e=t.config;H(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?sr(e,Rc):`https://${t.config.authDomain}/${Pc}`,r={apiKey:e.apiKey,appName:t.name,v:Ft},i=Oc.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${Ut(r).slice(1)}`}async function Dc(t){const e=await Tc(t),n=ke().gapi;return H(n,t,"internal-error"),e.open({where:document.body,url:Nc(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:xc,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=ve(t,"network-request-failed"),o=ke().setTimeout(()=>{s(a)},Ac.get());function l(){ke().clearTimeout(o),i(r)}r.ping(l).then(l,()=>{s(a)})}))}/**
+ */const Bc=new zt(5e3,15e3),Hc="__/auth/iframe",Vc="emulator/auth/iframe",Wc={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},jc=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function zc(t){const e=t.config;j(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?hr(e,Vc):`https://${t.config.authDomain}/${Hc}`,r={apiKey:e.apiKey,appName:t.name,v:jt},i=jc.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${Wt(r).slice(1)}`}async function Gc(t){const e=await Fc(t),n=Ae().gapi;return j(n,t,"internal-error"),e.open({where:document.body,url:zc(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Wc,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=Ee(t,"network-request-failed"),o=Ae().setTimeout(()=>{s(a)},Bc.get());function l(){Ae().clearTimeout(o),i(r)}r.ping(l).then(l,()=>{s(a)})}))}/**
  * @license
  * Copyright 2020 Google LLC.
  *
@@ -1453,7 +1453,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Lc={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Mc=500,Uc=600,Fc="_blank",Bc="http://localhost";class zr{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Hc(t,e,n,r=Mc,i=Uc){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let o="";const l={...Lc,width:r.toString(),height:i.toString(),top:s,left:a},c=ce().toLowerCase();n&&(o=Hi(c)?Fc:n),Fi(c)&&(e=e||Bc,l.scrollbars="yes");const d=Object.entries(l).reduce((p,[m,b])=>`${p}${m}=${b},`,"");if(ll(c)&&o!=="_self")return Vc(e||"",o),new zr(null);const h=window.open(e||"",o,d);H(h,t,"popup-blocked");try{h.focus()}catch{}return new zr(h)}function Vc(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
+ */const qc={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Kc=500,Jc=600,Yc="_blank",Xc="http://localhost";class Xr{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Qc(t,e,n,r=Kc,i=Jc){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let o="";const l={...qc,width:r.toString(),height:i.toString(),top:s,left:a},u=pe().toLowerCase();n&&(o=qi(u)?Yc:n),zi(u)&&(e=e||Xc,l.scrollbars="yes");const d=Object.entries(l).reduce((g,[_,b])=>`${g}${_}=${b},`,"");if(vl(u)&&o!=="_self")return Zc(e||"",o),new Xr(null);const h=window.open(e||"",o,d);j(h,t,"popup-blocked");try{h.focus()}catch{}return new Xr(h)}function Zc(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
  * @license
  * Copyright 2021 Google LLC
  *
@@ -1468,7 +1468,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Wc="__/auth/handler",jc="emulator/auth/handler",zc=encodeURIComponent("fac");async function Gr(t,e,n,r,i,s){H(t.config.authDomain,t,"auth-domain-config-required"),H(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:Ft,eventId:i};if(e instanceof yn){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",Ia(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,h]of Object.entries({}))a[d]=h}if(e instanceof Vt){const d=e.getScopes().filter(h=>h!=="");d.length>0&&(a.scopes=d.join(","))}t.tenantId&&(a.tid=t.tenantId);const o=a;for(const d of Object.keys(o))o[d]===void 0&&delete o[d];const l=await t._getAppCheckToken(),c=l?`#${zc}=${encodeURIComponent(l)}`:"";return`${Gc(t)}?${Ut(o).slice(1)}${c}`}function Gc({config:t}){return t.emulator?sr(t,jc):`https://${t.authDomain}/${Wc}`}/**
+ */const eu="__/auth/handler",tu="emulator/auth/handler",nu=encodeURIComponent("fac");async function Qr(t,e,n,r,i,s){j(t.config.authDomain,t,"auth-domain-config-required"),j(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:jt,eventId:i};if(e instanceof Cn){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",Ma(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,h]of Object.entries({}))a[d]=h}if(e instanceof qt){const d=e.getScopes().filter(h=>h!=="");d.length>0&&(a.scopes=d.join(","))}t.tenantId&&(a.tid=t.tenantId);const o=a;for(const d of Object.keys(o))o[d]===void 0&&delete o[d];const l=await t._getAppCheckToken(),u=l?`#${nu}=${encodeURIComponent(l)}`:"";return`${ru(t)}?${Wt(o).slice(1)}${u}`}function ru({config:t}){return t.emulator?hr(t,tu):`https://${t.authDomain}/${eu}`}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1483,7 +1483,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Dn="webStorageSupport";class qc{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=rs,this._completeRedirectFn=_c,this._overrideRedirectResult=gc}async _openPopup(e,n,r,i){var a;De((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const s=await Gr(e,n,r,Yn(),i);return Hc(e,s,ur())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await Gr(e,n,r,Yn(),i);return Jl(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(De(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await Dc(e),r=new yc(e);return n.register("authEvent",i=>(H(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Dn,{type:Dn},i=>{var a;const s=(a=i==null?void 0:i[0])==null?void 0:a[Dn];s!==void 0&&n(!!s),_e(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=kc(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Gi()||Bi()||or()}}const Kc=qc;var qr="@firebase/auth",Kr="1.13.5";/**
+ */const Vn="webStorageSupport";class iu{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=cs,this._completeRedirectFn=Tc,this._overrideRedirectResult=Ec}async _openPopup(e,n,r,i){var a;He((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const s=await Qr(e,n,r,rr(),i);return Qc(e,s,_r())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await Qr(e,n,r,rr(),i);return ac(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(He(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await Gc(e),r=new Ac(e);return n.register("authEvent",i=>(j(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Vn,{type:Vn},i=>{var a;const s=(a=i==null?void 0:i[0])==null?void 0:a[Vn];s!==void 0&&n(!!s),Se(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=Dc(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Qi()||Gi()||gr()}}const su=iu;var Zr="@firebase/auth",ei="1.13.5";/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1498,7 +1498,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Jc{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){H(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
+ */class au{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){j(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1513,7 +1513,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function Yc(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Xc(t){Ot(new bt("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=r.options;H(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:o,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:qi(t)},c=new gl(r,i,s,l);return Sl(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),Ot(new bt("auth-internal",e=>{const n=Ue(e.getProvider("auth").getImmediate());return(r=>new Jc(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),ht(qr,Kr,Yc(t)),ht(qr,Kr,"esm2020")}/**
+ */function ou(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function lu(t){Ut(new wt("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=r.options;j(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:o,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Zi(t)},u=new El(r,i,s,l);return Ol(u,n),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),Ut(new wt("auth-internal",e=>{const n=je(e.getProvider("auth").getImmediate());return(r=>new au(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),pt(Zr,ei,ou(t)),pt(Zr,ei,"esm2020")}/**
  * @license
  * Copyright 2021 Google LLC
  *
@@ -1528,5 +1528,5 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Qc=300,Zc=wi("authIdTokenMaxAge")||Qc;let Jr=null;const eu=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>Zc)return;const i=n==null?void 0:n.token;Jr!==i&&(Jr=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function tu(t=Po()){const e=Ii(t,"auth");if(e.isInitialized())return e.getImmediate();const n=$l(t,{popupRedirectResolver:Kc,persistence:[ic,Gl,rs]}),r=wi("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=eu(s.toString());Hl(n,a,()=>a(n.currentUser)),Bl(n,o=>a(o))}}const i=ma("auth");return i&&kl(n,`http://${i}`),n}function nu(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}pl({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=ve("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",nu().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Xc("Browser");const ru={},be=ru,yt=!!(be.VITE_FIREBASE_API_KEY&&be.VITE_FIREBASE_PROJECT_ID&&be.VITE_FIREBASE_APP_ID);let Ln=null;function ut(){if(!yt)throw new Error("Firebase auth is not configured: set VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_APP_ID");if(!Ln){const t=Ci({apiKey:be.VITE_FIREBASE_API_KEY,authDomain:be.VITE_FIREBASE_AUTH_DOMAIN,projectId:be.VITE_FIREBASE_PROJECT_ID,appId:be.VITE_FIREBASE_APP_ID,...be.VITE_FIREBASE_STORAGE_BUCKET&&{storageBucket:be.VITE_FIREBASE_STORAGE_BUCKET},...be.VITE_FIREBASE_MESSAGING_SENDER_ID&&{messagingSenderId:be.VITE_FIREBASE_MESSAGING_SENDER_ID}});Ln=tu(t)}return Ln}function Yr(){return new Ie}async function Xr(){if(!yt)return;const t=ut();t.currentUser&&await Wl(t)}var iu=g(`<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><p>Signed in as <b></b> — this account isn't authorized for this deployment.</p><p class=gate-note>Ask the owner to add your address to the allow list, or sign out to use a different account.</p><button type=button class="btn btn-primary"style=margin-top:12px>Sign out`),su=g('<form><label class=gate-label>Email<input type=email required autocomplete=email placeholder=you@example.com></label><label class=gate-label>Password<input type=password required placeholder=••••••••></label><button type=submit class="btn btn-primary">'),au=g("<button type=button class=gate-toggle>"),ou=g("<div class=gate-or>── or ──"),lu=g("<button type=button class=btn>Continue with Google"),cu=g("<div class=gate-error role=alert>"),uu=g("<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates"),du=g("<p>Authentication is not configured — sign-in cannot start. Point <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_PROJECT_ID</code> and <code>VITE_FIREBASE_APP_ID</code> at a provisioned Firebase project (checklist: crates/webapp/README.md), rebuild <code>npm run build</code>, then reload."),hu=g("<p class=gate-note>The server itself still answers: its API stays open until it boots with a Firebase project id of its own.");const fu={"auth/invalid-credential":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/email-already-in-use":"That email already has an account — switch to Sign in.","auth/weak-password":"Password is too weak — use at least 6 characters.","auth/unauthorized-domain":"This domain isn't authorized in the Firebase console yet.","auth/popup-closed-by-user":"Google sign-in cancelled — popup closed.","auth/popup-blocked":"The browser blocked the sign-in popup — allow popups for this site, or use email sign-in.","auth/operation-not-allowed":"Email/password sign-in isn't enabled for this app yet.","auth/too-many-requests":"Too many attempts — wait a moment and try again.","auth/network-request-failed":"Network problem — check your connection and try again."};function Qr(t){const e=(t==null?void 0:t.code)??"";return fu[e]??`Sign-in failed${e?` (${e})`:""} — check your details and try again.`}function gu(t){return(()=>{var e=iu(),n=e.firstChild,r=n.firstChild,i=r.nextSibling,s=i.firstChild,a=s.nextSibling,o=i.nextSibling,l=o.nextSibling;return u(a,()=>t.email),j(l,"click",t.onSignOut),e})()}function pu(){const[t,e]=M("signin"),[n,r]=M(""),[i,s]=M(""),[a,o]=M(!1),[l,c]=M("");Xs(async p=>{if(!yt)return null;const m=ut().currentUser;return m?await m.getIdToken(p):null});async function d(p){if(p.preventDefault(),!a()){o(!0),c("");try{const m=ut();t()==="create"?await Ul(m,n(),i()):await Fl(m,n(),i())}catch(m){c(Qr(m))}finally{o(!1)}}}async function h(){if(!a()){o(!0),c("");try{await cc(ut(),Yr())}catch(p){if(new Set(["auth/popup-blocked","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"]).has(p==null?void 0:p.code)){await pc(ut(),Yr());return}c(Qr(p))}finally{o(!1)}}}return(()=>{var p=uu(),m=p.firstChild;return m.firstChild,u(m,f(k,{when:yt,get fallback(){return[du(),hu()]},get children(){return[(()=>{var b=su(),T=b.firstChild,_=T.firstChild,S=_.nextSibling,E=T.nextSibling,O=E.firstChild,R=O.nextSibling,D=E.nextSibling;return b.addEventListener("submit",d),S.$$input=y=>r(y.currentTarget.value),R.$$input=y=>s(y.currentTarget.value),u(D,(()=>{var y=q(()=>!!a());return()=>y()?"Working…":t()==="create"?"Create account":"Sign in"})()),v(y=>{var A=t()==="create"?"new-password":"current-password",C=a();return A!==y.e&&ne(R,"autocomplete",y.e=A),C!==y.t&&(D.disabled=y.t=C),y},{e:void 0,t:void 0}),v(()=>S.value=n()),v(()=>R.value=i()),b})(),(()=>{var b=au();return b.$$click=()=>{c(""),e(t()==="create"?"signin":"create")},u(b,()=>t()==="create"?"⇄ Have an account? Sign in":"⇄ Need an account? Create one"),v(()=>b.disabled=a()),b})(),ou(),(()=>{var b=lu();return b.$$click=h,v(()=>b.disabled=a()),b})(),f(k,{get when(){return l()},get children(){var b=cu();return u(b,l),b}})]}}),null),p})()}we(["click","input"]);var mu=g("<div class=gate-error role=alert>"),_u=g("<p class=gate-note>No grant-file entries yet."),bu=g("<p class=gate-note>Also allowed via WEBAPP_OWNER_EMAILS: "),yu=g('<div class=modal-backdrop><div class="gate-card access-card"role=dialog aria-modal=true aria-label="Access control"><h1 class=gate-title>Access control</h1><p class=gate-note>Emails allowed to use this webapp. Changes apply immediately.</p><form class=access-add><input type=email placeholder=new.email@host aria-label="email to allow"required><button type=submit class="btn btn-primary"></button></form><button type=button class=btn style=margin-top:12px;width:100%>Close'),vu=g("<div class=access-row><span class=access-email></span><button type=button class=access-remove>✕");function wu(t){const[e,n]=M([]),[r,i]=M([]),[s,a]=M(""),[o,l]=M(!1),[c,d]=M(""),h=_=>{n((_==null?void 0:_.file_grants)??[]),i((_==null?void 0:_.static_emails)??[])};mt(async()=>{try{h(await Zs())}catch{d("Could not load the grant list.")}});const m=_=>{_.key==="Escape"&&t.onClose()};mt(()=>{window.addEventListener("keydown",m),Oe(()=>window.removeEventListener("keydown",m));const _=document.querySelector(".access-add input");_==null||_.focus()});const b=async _=>{if(_.preventDefault(),!(o()||!s().trim())){l(!0),d("");try{h(await ea(s())),a("")}catch(S){d(S.message)}l(!1)}},T=async _=>{if(!o()){l(!0),d("");try{h(await ta(_))}catch(S){d(S.message)}l(!1)}};return(()=>{var _=yu(),S=_.firstChild,E=S.firstChild,O=E.nextSibling,R=O.nextSibling,D=R.firstChild,y=D.nextSibling,A=R.nextSibling;return j(_,"click",t.onClose),S.$$click=C=>C.stopPropagation(),u(S,f(k,{get when(){return c()},get children(){var C=mu();return u(C,c),C}}),R),u(S,f(re,{get each(){return e()},children:C=>(()=>{var P=vu(),$=P.firstChild,N=$.nextSibling;return u($,C),N.$$click=()=>T(C),ne(N,"title",`Remove ${C}`),ne(N,"aria-label",`Remove ${C}`),v(()=>N.disabled=o()),P})()}),R),u(S,f(k,{get when(){return e().length===0},get children(){return _u()}}),R),R.addEventListener("submit",b),D.$$input=C=>a(C.currentTarget.value),u(y,()=>o()?"…":"Add"),u(S,f(k,{get when(){return r().length>0},get children(){var C=bu();return C.firstChild,u(C,()=>r().join(", "),null),C}}),A),j(A,"click",t.onClose),v(()=>y.disabled=o()),v(()=>D.value=s()),_})()}we(["click","input"]);const Pe=Object.freeze({weightSharpe:.2,weightSafety:.4,weightReturn:.4,weightTrend:0,minRateOfReturn:.2,idealReturn:.8,trendScoreFloor:1.02,trendScoreBand:.06,earningsSafetyMultiplier:.5,topPicksCount:3}),Rt=(t,e,n)=>Math.min(n,Math.max(e,t));function $u(t,e,n){const r=n-e;return Math.abs(r)<1e-9?.5:Rt((n-t)/r,0,1)}function Su(t,e,n,r,i=Pe){if(n<i.minRateOfReturn||t<=0)return null;const s=Rt(t/2,0,1),a=Rt(e,0,1),o=Math.min(n/i.idealReturn,1),l=Rt((r-i.trendScoreFloor)/i.trendScoreBand,0,1),c={sharpe:i.weightSharpe*s,safety:i.weightSafety*a,return:i.weightReturn*o,trend:i.weightTrend*l};return c.total=c.sharpe+c.safety+c.return+c.trend,c}function ku(t,e=Pe){const n=t.rate_of_return;if(n==null||!Number.isFinite(n))return null;const r=t.sharpe_ratio??0,i=t.trend_short??0,s=t.earnings_before_expiry!=null;let a=t.delta!=null?Rt(1+t.delta,0,1):$u(t.strike,t.strike_from,t.strike_to);return s&&(a*=e.earningsSafetyMultiplier),Su(r,a,n,i,e)}function Eu(t,e=Pe.topPicksCount){const n=t.map((a,o)=>({...a,i:o})).filter(a=>a.score!=null).sort((a,o)=>o.score-a.score||a.i-o.i),r=new Set,i=new Set,s=[];for(const a of n){if(s.length>=e)break;const{row:o}=a;r.has(o.underlying)||o.sector!=="Unknown"&&i.has(o.sector)||(r.add(o.underlying),o.sector!=="Unknown"&&i.add(o.sector),s.push(a))}return s}function Iu(t){return t.weightSharpe===Pe.weightSharpe&&t.weightSafety===Pe.weightSafety&&t.weightReturn===Pe.weightReturn&&t.minRateOfReturn===Pe.minRateOfReturn}var Cu=g("<span class=hint>production defaults · drag to re-rank live"),Tu=g("<details class=adjust><summary>Adjust scoring </summary><div class=adjust-body><button type=button class=reset>Reset to production defaults"),Au=g('<span class="hint hint-custom">custom weights'),Pu=g("<div class=ctl><label> <span class=val></span></label><input type=range min=0>");function Ru(){const[t,e]=M({...Pe});return{params:t,isCustom:()=>!Iu(t()),setParam:(n,r)=>e(i=>({...i,[n]:r})),reset:()=>e({...Pe})}}const xu=[{key:"weightSharpe",label:"Sharpe weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightSafety",label:"Safety weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightReturn",label:"Return weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"minRateOfReturn",label:"Min rate-of-return floor",max:.5,step:.01,fmt:t=>`${Math.round(t*100)}%`,weight:!1}];function Ou(t){const e=()=>t.scoring.isCustom(),n=()=>{const r=t.scoring.params();return r.weightSharpe+r.weightSafety+r.weightReturn||1};return(()=>{var r=Tu(),i=r.firstChild;i.firstChild;var s=i.nextSibling,a=s.firstChild;return u(i,f(k,{get when(){return!e()},get fallback(){return Au()},get children(){return Cu()}}),null),u(s,f(re,{each:xu,children:o=>(()=>{var l=Pu(),c=l.firstChild,d=c.firstChild,h=d.nextSibling,p=c.nextSibling;return u(c,()=>o.label,d),u(h,()=>o.fmt(t.scoring.params()[o.key]),null),u(h,f(k,{get when(){return o.weight},get children(){return[" ","· ",q(()=>Math.round(t.scoring.params()[o.key]/n()*100)),"% of weight"]}}),null),p.$$input=m=>t.scoring.setParam(o.key,Number(m.currentTarget.value)),v(m=>{var b=o.max,T=o.step;return b!==m.e&&ne(p,"max",m.e=b),T!==m.t&&ne(p,"step",m.t=T),m},{e:void 0,t:void 0}),v(()=>p.value=t.scoring.params()[o.key]),l})()}),a),a.$$click=()=>t.scoring.reset(),v(()=>r.open=e()),r})()}we(["click","input"]);const $n=[{id:"underlying",label:"Underlying",kind:"text",align:"left"},{id:"sector",label:"Sector",kind:"text",align:"left"},{id:"strike",label:"Strike",kind:"fixed2",align:"num"},{id:"expiration",label:"Expiry",kind:"date",align:"left"},{id:"bid",label:"Bid",kind:"fixed2",align:"num"},{id:"mid",label:"Mid",kind:"fixed2",align:"num"},{id:"ask",label:"Ask",kind:"fixed2",align:"num"},{id:"rate_of_return",label:"ROR",kind:"pct1",align:"num"},{id:"score",label:"Score",kind:"fixed3",align:"num"},{id:"delta",label:"Delta",kind:"fixed3",align:"num"},{id:"iv_rv_ratio",label:"IV/RV",kind:"ivrv",align:"num"},{id:"realized_vol",label:"Realized vol",kind:"fixed3",align:"num"},{id:"price_percentile",label:"Price pctl",kind:"pct0",align:"num"},{id:"underlying_price",label:"Spot",kind:"fixed2",align:"num"},{id:"bid_size",label:"Bid sz",kind:"int",align:"num"},{id:"ask_size",label:"Ask sz",kind:"int",align:"num"},{id:"volume",label:"Volume",kind:"int",align:"num"},{id:"open_interest",label:"Open int",kind:"int",align:"num"},{id:"strike_from",label:"Band lo",kind:"fixed2",align:"num"},{id:"strike_to",label:"Band hi",kind:"fixed2",align:"num"},{id:"sharpe_ratio",label:"Sharpe",kind:"fixed3",align:"num"},{id:"strike_percentile",label:"Strike pctl",kind:"fixed3",align:"num"},{id:"earnings_before_expiry",label:"Earnings",kind:"earnings",align:"left"},{id:"trend_short",label:"Trend 20",kind:"fixed3",align:"num"},{id:"trend_long",label:"Trend 50",kind:"fixed3",align:"num"},{id:"implied_vol",label:"Implied vol",kind:"fixed3",align:"num"}],Ct=["underlying","sector","strike","expiration","bid","mid","ask","rate_of_return","score","delta","iv_rv_ratio","realized_vol","price_percentile"],fs="webapp.columns.v1";function Nu(){try{const t=localStorage.getItem(fs);if(!t)return Ct;const e=JSON.parse(t);if(!Array.isArray(e))return Ct;const n=new Set($n.map(i=>i.id)),r=e.filter(i=>n.has(i));return r.length>0?[...new Set(r)]:Ct}catch{return Ct}}function Du(t){try{localStorage.setItem(fs,JSON.stringify(t))}catch{}}var Lu=g("<div class=pop-backdrop>"),Mu=g('<div class=picker-panel role=menu aria-label="visible columns"><div class=picker-grid></div><button type=button class=linklike>Reset defaults'),Uu=g("<span class=colpicker><button type=button class=tool-btn>columns ▾"),Fu=g("<label class=pick-item><input type=checkbox>");function Bu(t){const[e,n]=M(!1);return(()=>{var r=Uu(),i=r.firstChild;return i.$$click=()=>n(!e()),u(r,f(k,{get when(){return e()},get children(){return[(()=>{var s=Lu();return s.$$click=()=>n(!1),s})(),(()=>{var s=Mu(),a=s.firstChild,o=a.nextSibling;return u(a,f(re,{each:$n,children:l=>(()=>{var c=Fu(),d=c.firstChild;return d.addEventListener("change",h=>t.store.toggle(l.id,h.currentTarget.checked)),u(c,()=>l.label,null),v(()=>d.checked=t.store.isOn(l.id)),c})()})),o.$$click=()=>t.store.reset(),s})()]}}),null),v(()=>ne(i,"aria-expanded",e())),r})()}we(["click"]);var Hu=g('<div class=pager role=navigation aria-label="table pagination"><span class=pager-label>page <!> / </span><button type=button class=pgbtn aria-label="previous page">‹</button><button type=button class=pgbtn aria-label="next page">›'),Vu=g("<span class=pggap>…"),Wu=g("<button type=button class=pgbtn>");function ju(t,e){const n=Math.max(e,1),r=Math.min(Math.max(t,1),n);if(n<=7)return Array.from({length:n},(l,c)=>c+1);const s=[...new Set([1,2,r-1,r,r+1,n-1,n])].filter(l=>l>=1&&l<=n).sort((l,c)=>l-c),a=[];let o=0;for(const l of s)l-o>1&&a.push("…"),a.push(l),o=l;return a}function zu(t){const e=ae(()=>ju(t.page(),t.pageCount())),n=()=>t.onGo(Math.max(1,t.page()-1)),r=()=>t.onGo(Math.min(t.pageCount(),t.page()+1));return(()=>{var i=Hu(),s=i.firstChild,a=s.firstChild,o=a.nextSibling;o.nextSibling;var l=s.nextSibling,c=l.nextSibling;return u(s,()=>t.page(),o),u(s,()=>t.pageCount(),null),l.$$click=n,u(i,f(re,{get each(){return e()},children:d=>d==="…"?Vu():(()=>{var h=Wu();return h.$$click=()=>t.onGo(d),u(h,d),v(()=>h.classList.toggle("active",d===t.page())),h})()}),c),c.$$click=r,v(d=>{var h=t.page()<=1,p=t.page()>=t.pageCount();return h!==d.e&&(l.disabled=d.e=h),p!==d.t&&(c.disabled=d.t=p),d},{e:void 0,t:void 0}),i})()}we(["click"]);var Gu=g("<span class=tip>");function St(t){let e;const n=()=>{if(!e)return;const r=e.getBoundingClientRect(),i=r.right+352;e.classList.toggle("tip-flip",i>window.innerWidth&&r.left>352)};return(()=>{var r=Gu();r.$$focusin=n,r.addEventListener("pointerenter",n);var i=e;return typeof i=="function"?Js(i,r):e=r,u(r,()=>t.children),v(()=>ne(r,"data-tip",t.text??"")),r})()}we(["focusin"]);const nt="∅";function te(t){return t==null||typeof t=="number"&&!Number.isFinite(t)}function Tt(t){return Number(t??0).toLocaleString("en-US")}function pn(t){if(!t)return null;const e=new Date(t).getTime();return Number.isNaN(e)?null:e}function gs(t){return ps(t,{hour:"2-digit",minute:"2-digit"})}function qu(t){return ps(t,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function ps(t,e){const n=pn(t);if(n!==null)try{return new Intl.DateTimeFormat(void 0,{...e,hourCycle:"h23",timeZoneName:"short"}).format(n)}catch{return}}const ms={text:nt,isNull:!0},Mn=(t,e)=>({text:Number(t).toFixed(e),isNull:!1});function Zr(t,e){return!e||te(t)?null:t>=e.vol_tier_high?"green":t>=e.vol_tier_mid?"yellow":"red"}function Ku(t,e){return!e||te(t)?null:t>e.momentum_extended?"EXTENDED":t>e.momentum_high?"HIGH":"NORMAL"}function Ju(t){if(!t||typeof t!="object"||te(t.report_date))return ms;const e=typeof t.report_time=="string"?` (${t.report_time.replaceAll("_"," ")})`:"";return{text:`⚠ ${t.report_date}${e}`,isNull:!1}}function pe(t,e){if(te(e))return ms;switch(t){case"fixed2":return Mn(e,2);case"fixed3":return Mn(e,3);case"ivrv":return Mn(e,2);case"pct1":return{text:`${(e*100).toFixed(1)}%`,isNull:!1};case"pct0":return{text:`${Math.round(e*100)}%`,isNull:!1};case"int":return{text:Number(e).toLocaleString("en-US"),isNull:!1};case"earnings":return Ju(e);default:return{text:String(e),isNull:!1}}}const ei=t=>Number(t*100).toFixed(0);function Yu(t){const e=t??{},n=e.vol_tier_high??"?",r=e.vol_tier_mid??"?",i=ei(e.momentum_high),s=ei(e.momentum_extended);return{underlying:`The stock this put is written on. The colored dot is the realized-vol tier: green ≥ ${n}, yellow ${r}–${n}, red < ${r} — higher vol pays richer premium at matched assignment risk.`,sector:"GICS sector from symbols.csv. Context for diversification; not used in scoring.",strike:"Price you would buy the stock at if assigned. Deeper (lower) strikes are safer but pay less premium.",underlying_price:"Latest close of the underlying stock.",bid:"Best price a buyer will pay — the conservative fill for a seller.",mid:"(bid + ask) / 2 — the premium used for scoring, assuming half the spread is crossed.",ask:"Best price a seller demands.",bid_size:"Contracts quoted at the bid — a liquidity and depth signal.",ask_size:"Contracts quoted at the ask — a liquidity and depth signal.",expiration:"Contract expiry date. Short tab targets ~5–7 days to expiry, Medium ~20–28.",volume:"Option contracts traded today.",open_interest:"Option contracts still open — liquidity and positioning.",rate_of_return:"Annualized premium yield: mid ÷ strike scaled to a year. The pre-filter requires ≥ 30%.",strike_from:"Lower edge of the scored strike band, from 5/20-day max-drop stats. Below it the premium is too thin.",strike_to:"Upper edge of the scored strike band. Above it you are too close to spot for the premium.",sharpe_ratio:"Risk-adjusted drift of the underlying. 20% of the score; the pre-filter requires > 0.",strike_percentile:"Where the strike sits in the 20-day price range (0 = bottom, 1 = top). Blank when no 20-day range exists.",score:"Composite pick score: 20% Sharpe + 40% band safety (delta-aware, earnings-discounted) + 40% closeness of ror to the 0.80 ideal.",price_percentile:`Where spot sits in its 20-day range. Above the ${i}th percentile = HIGH momentum, above the ${s}th = EXTENDED.`,earnings_before_expiry:"The company reports earnings before this option expires — safety is discounted when set.",trend_short:"price ÷ EMA20. Above 1 means price is above its 20-day average — an independent breach-risk signal.",trend_long:"price ÷ EMA50. Same idea on the 50-day average.",realized_vol:"20-day annualized realized volatility of the underlying — the vol-tier input.",implied_vol:"Volatility the option market is pricing into this contract.",delta:"Put delta from Tiger (Black-Scholes fallback): roughly assignment probability with a minus sign, e.g. −0.21 ≈ 21%. Deeper real delta also boosts the safety score.",iv_rv_ratio:"Implied ÷ realized volatility. Above 1 the market prices more fear than realized — a premium-richness signal that boosts safety past a threshold.",band_range:"The scored strike band, derived from max-drop stats — the shaded range in the chart above.",band_depth:"How deep the strike sits inside the band (1 = at the safe bottom). Feeds the 40% safety component.",cushion_be:"How far spot can fall before hitting break-even, as % of spot.",capital:"Cash collateral if assigned: strike × 100 shares.",premium:"Premium collected up front: mid × 100.",breakeven:"strike − mid. The stock can fall to this price before the position loses money.",ann_ror:"Annualized premium yield — same number as the ror column.",sb_sharpe:"20% weight — Sharpe clamped to [0, 2].",sb_safety:"40% weight — band position, boosted by deep real delta or high IV/RV, discounted when earnings fall inside the window.",sb_ret:"40% weight — annualized ror closest to the 0.80 ideal scores highest."}}function kt(t,e){return Yu(e)[t]??t}var _s=g("<span class=tip-target>"),Xu=g("<div class=kv><span class=kv-label></span><span class=kv-value>"),Qu=g("<span class=tip-target>Strike position in band"),Zu=g('<div class=band-chart role=img aria-label="strike position inside scored band"><div class=band-shade>'),ed=g("<div class=exp-block><h4>"),td=g("<div class=kv-value>Band unavailable (∅)"),nd=g("<div><span class=marker-tick></span><span class=marker-cap><br>"),rd=g("<div class=exp-block><h4>Premium economics"),id=g("<b>"),sd=g('<div class="bar-row total"><span class=bar-label>total</span><span class="num bar-val"><b>'),ad=g("<div class=muted-note>earnings-discounted safety applied"),od=g("<div class=exp-block><h4>Score breakdown"),ld=g("<div class=kv><span class=kv-label>score</span><span class=kv-value><b></b></span><span class=muted-note>breakdown unavailable for this row"),cd=g('<div class=bar-row><span class=bar-label> <span class=bar-weight>(<!>%)</span></span><span class=bar-track><span class=bar-fill></span></span><span class="num bar-val">'),ud=g("<span class=muted-note>all columns visible"),dd=g('<div class="exp-block exp-chips"><h4>Hidden columns'),hd=g("<span class=tip-target>: "),fd=g("<span>"),gd=g("<span class=tip-target>band safety is already discounted by the earnings rule."),pd=g("<div class=earnings-banner>⚠ Earnings <b></b> (<!>)<!> — "),md=g("<div class=expansion><div class=exp-grid>");const Un={sharpe:.2,safety:.4,return_part:.4};function Fn(t,e=2){return te(t)?nt:`$${Number(t).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})}`}function $e(t,e,n){return(()=>{var r=Xu(),i=r.firstChild,s=i.nextSibling;return u(i,f(St,{get text(){return kt(t,e)},get children(){var a=_s();return u(a,()=>t.replace(/_/g," ")),a}})),u(s,n),r})()}function _d(t){const e=t.row,n=e.strike_to-e.strike_from,r=n>0?(e.strike_to-e.strike)/n:null,i=te(e.mid)?null:e.strike-e.mid,s=i!=null&&!te(e.underlying_price)&&e.underlying_price!==0?(e.underlying_price-i)/e.underlying_price*100:null,a=e.strike_from,o=Math.max(e.underlying_price??e.strike_to,e.strike_to)*1.005,l=Math.max(o,a),c=!te(a)&&l>a&&!te(e.strike),d=p=>{if(te(p))return null;const m=(p-a)/(l-a)*100;return Math.min(100,Math.max(0,m))},h=c?[{cls:"mk-strike",label:"strike",v:e.strike},{cls:"mk-spot",label:"spot",v:e.underlying_price}].filter(p=>d(p.v)!=null):[];return(()=>{var p=ed(),m=p.firstChild;return u(m,f(St,{get text(){return kt("band_range",t.thresholds)},get children(){return Qu()}})),u(p,f(k,{when:c,get fallback(){return td()},get children(){var b=Zu(),T=b.firstChild;return u(b,f(re,{each:h,children:_=>(()=>{var S=nd(),E=S.firstChild,O=E.nextSibling,R=O.firstChild;return u(O,()=>_.label,R),u(O,()=>pe("fixed2",_.v).text,null),v(D=>{var y=`marker ${_.cls}`,A=`${d(_.v)}%`;return y!==D.e&&de(S,D.e=y),A!==D.t&&tt(S,"left",D.t=A),D},{e:void 0,t:void 0}),S})()}),null),v(_=>{var S=`${d(e.strike_from)}%`,E=`${Math.max(0,d(e.strike_to)-d(e.strike_from))}%`;return S!==_.e&&tt(T,"left",_.e=S),E!==_.t&&tt(T,"width",_.t=E),_},{e:void 0,t:void 0}),b}}),null),u(p,()=>$e("band_range",t.thresholds,`${pe("fixed2",e.strike_from).text} → ${pe("fixed2",e.strike_to).text}`),null),u(p,()=>$e("band_depth",t.thresholds,r==null?nt:`${(r*100).toFixed(1)}%`),null),u(p,()=>$e("cushion_be",t.thresholds,s==null?nt:`${s.toFixed(1)}%`),null),p})()}function bd(t){const e=t.row,n=te(e.strike)?null:e.strike*100,r=te(e.mid)?null:e.mid*100,i=r==null?null:e.strike-e.mid,s=pe("pct1",e.rate_of_return);return(()=>{var a=rd();return a.firstChild,u(a,()=>$e("capital",t.thresholds,n==null?nt:Fn(n,0)),null),u(a,()=>$e("premium",t.thresholds,r==null?nt:Fn(r)),null),u(a,()=>$e("breakeven",t.thresholds,i==null?nt:Fn(i)),null),u(a,()=>$e("ann_ror",t.thresholds,(()=>{var o=id();return u(o,()=>s.text),o})()),null),u(a,()=>$e("bid",t.thresholds,pe("fixed2",e.bid).text),null),u(a,()=>$e("ask",t.thresholds,pe("fixed2",e.ask).text),null),u(a,()=>$e("expiration",t.thresholds,e.expiration),null),a})()}function yd(t){const e=t.row,n=e.score_components,r=[{key:"sb_sharpe",label:"Sharpe",weight:Un.sharpe,v:n==null?void 0:n.sharpe},{key:"sb_safety",label:"Band safety",weight:Un.safety,v:n==null?void 0:n.safety},{key:"sb_ret",label:"Return vs ideal",weight:Un.return_part,v:n==null?void 0:n.return}];return(()=>{var i=od();return i.firstChild,u(i,f(k,{when:n,get fallback(){return(()=>{var s=ld(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>pe("fixed3",e.score).text),s})()},get children(){return[f(re,{each:r,children:s=>{const a=te(s.v)||s.weight===0?null:s.v/s.weight;return(()=>{var o=cd(),l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=d.firstChild,p=h.nextSibling;p.nextSibling;var m=l.nextSibling,b=m.firstChild,T=m.nextSibling;return u(l,f(St,{get text(){return kt(s.key,t.thresholds)},get children(){var _=_s();return u(_,()=>s.label),_}}),c),u(d,()=>s.weight*100,p),u(T,()=>pe("fixed3",s.v).text),v(_=>tt(b,"width",`${Math.min(100,Math.max(0,(a??0)*100))}%`)),o})()}}),(()=>{var s=sd(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>pe("fixed3",e.score).text),s})(),f(k,{get when(){return e.earnings_before_expiry},get children(){return ad()}})]}}),null),i})()}function vd(t){const e=()=>t.hiddenDefs.map(n=>({def:n,cell:pe(n.kind,n.id==="earnings_before_expiry"?t.row.earnings_before_expiry:t.row[n.id])}));return(()=>{var n=dd();return n.firstChild,u(n,f(re,{get each(){return e()},children:({def:r,cell:i})=>(()=>{var s=fd();return u(s,f(St,{get text(){return kt(r.id,t.thresholds)},get children(){var a=hd(),o=a.firstChild;return u(a,()=>r.label,o),u(a,()=>i.text,null),a}})),v(()=>de(s,`chip-hidden${i.isNull?" is-null":""}`)),s})()}),null),u(n,f(k,{get when(){return t.hiddenDefs.length===0},get children(){return ud()}}),null),n})()}function wd(t){const e=t.row,n=e.earnings_before_expiry;return(()=>{var r=md(),i=r.firstChild;return u(r,f(k,{when:n,get children(){var s=pd(),a=s.firstChild,o=a.nextSibling,l=o.nextSibling,c=l.nextSibling,d=c.nextSibling,h=d.nextSibling;return h.nextSibling,u(o,()=>n.report_date),u(s,f(k,{get when(){return n.report_time},children:p=>p().replaceAll("_"," ")}),c),u(s,f(k,{get when(){return!te(n.expected_eps)},get children(){return[" ","· expected EPS ",q(()=>pe("fixed2",n.expected_eps).text)]}}),h),u(s,f(St,{get text(){return kt("earnings_before_expiry",t.thresholds)},get children(){return gd()}}),null),s}}),i),u(i,f(_d,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(bd,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(yd,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(vd,{row:e,get hiddenDefs(){return t.hiddenDefs},get thresholds(){return t.thresholds}}),null),r})()}var $d=g("<span class=null-mark>"),Sd=g("<span class=star>★"),kd=g("<td><b>"),Bn=g("<span>"),ti=g("<td class=num>"),Ed=g("<span class=score-frozen>prod "),Id=g('<td class="num score-cell">'),Cd=g('<span class="score-frozen readmit">re-admitted'),Td=g("<td>"),Ad=g("<table><thead><tr><th class=exp-col aria-hidden=true></th></tr></thead><tbody>"),Pd=g("<span class=sort-arrow>"),Rd=g("<span class=tip-target>"),xd=g("<th role=button tabindex=0>"),Od=g("<tr class=expandable><td class=exp-col>"),Nd=g("<tr class=exp-row><td>");const Dd=t=>`${t.underlying}|${t.strike}`;function Ld(t){return(()=>{var e=$d();return u(e,()=>t.text),e})()}function qt(t){const e=pe(t.kind,t.value);return f(k,{get when(){return!e.isNull},get fallback(){return f(Ld,{get text(){return e.text}})},get children(){return e.text}})}function Md(t){const e=t.col,n=t.row;return e.id==="underlying"?(()=>{var r=kd(),i=r.firstChild;return u(r,f(k,{get when(){return t.pickRank!=null},get children(){var s=Sd();return s.firstChild,u(s,()=>t.pickRank,null),s}}),i),u(i,()=>n.underlying),u(r,f(k,{get when(){return Zr(n.realized_vol,t.thresholds)},children:s=>[" ",(()=>{var a=Bn();return v(()=>de(a,`dot ${s()}`)),a})()]}),null),r})():e.id==="realized_vol"?(()=>{var r=ti();return u(r,f(k,{get when(){return Zr(n.realized_vol,t.thresholds)},children:i=>[(()=>{var s=Bn();return v(()=>de(s,`dot ${i()}`)),s})()," "]}),null),u(r,f(qt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),r})():e.id==="score"?(()=>{var r=Id();return u(r,f(qt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(k,{get when(){var i;return(i=t.customScores)==null?void 0:i.call(t)},get children(){return f(k,{get when(){return!te(n.frozen_score)},get fallback(){return f(k,{get when(){return!te(n.score)},get children(){return Cd()}})},get children(){var i=Ed();return i.firstChild,u(i,()=>n.frozen_score.toFixed(3),null),i}})}}),null),r})():e.id==="price_percentile"?(()=>{var r=ti();return u(r,f(qt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(k,{get when(){return Ku(n.price_percentile,t.thresholds)},children:i=>[" ",(()=>{var s=Bn();return u(s,i),v(()=>de(s,`chip ${i().toLowerCase()}`)),s})()]}),null),r})():(()=>{var r=Td();return u(r,f(qt,{get kind(){return e.kind},get value(){return n[e.id]}})),v(i=>{var s=e.align==="num",a=e.id==="rate_of_return";return s!==i.e&&r.classList.toggle("num",i.e=s),a!==i.t&&r.classList.toggle("strong",i.t=a),i},{e:void 0,t:void 0}),r})()}function Ud(t){const e=ae(()=>$n.filter(n=>t.visibleCols().includes(n.id)));return(()=>{var n=Ad(),r=n.firstChild,i=r.firstChild;i.firstChild;var s=r.nextSibling;return u(i,f(re,{get each(){return e()},children:a=>{const o=()=>t.sortKey()===a.id;return(()=>{var l=xd();return l.$$keydown=c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),t.onSort(a.id))},l.$$click=()=>t.onSort(a.id),u(l,f(St,{get text(){return kt(a.id,t.thresholds)},get children(){var c=Rd();return u(c,()=>a.label,null),u(c,f(k,{get when(){return o()},get children(){return[" ",(()=>{var d=Pd();return u(d,()=>t.sortDir()==="asc"?"↑":"↓"),d})()]}}),null),c}})),v(c=>{var d=a.align==="num",h=o()?t.sortDir()==="asc"?"ascending":"descending":void 0;return d!==c.e&&l.classList.toggle("num",c.e=d),h!==c.t&&ne(l,"aria-sort",c.t=h),c},{e:void 0,t:void 0}),l})()}}),null),u(s,f(re,{get each(){return t.rows()},children:a=>{const o=()=>t.pickRankOf(a),l=()=>Dd(a),c=()=>t.openKey()!=null&&t.openKey()===l();return[(()=>{var d=Od(),h=d.firstChild;return d.$$click=()=>t.onToggleRow(a),u(h,()=>c()?"▾":"▸"),u(d,f(re,{get each(){return e()},children:p=>f(Md,{col:p,row:a,get thresholds(){return t.thresholds},get pickRank(){return o()},get customScores(){return t.customScores}})}),null),v(p=>{var m=o()!=null,b=!!te(a.score),T=!!c();return m!==p.e&&d.classList.toggle("pick",p.e=m),b!==p.t&&d.classList.toggle("prow",p.t=b),T!==p.a&&d.classList.toggle("open",p.a=T),p},{e:void 0,t:void 0,a:void 0}),d})(),f(k,{get when(){return c()},get children(){var d=Nd(),h=d.firstChild;return u(h,f(wd,{row:a,get thresholds(){return t.thresholds},get hiddenDefs(){return t.hiddenDefs()}})),v(()=>ne(h,"colspan",e().length+1)),d}})]}})),n})()}we(["click","keydown"]);function Fd(t,e){return typeof t=="number"&&typeof e=="number"?t-e:String(t).localeCompare(String(e),void 0,{sensitivity:"base"})}const dt=t=>te(t);function Bd(t,e,n){const r=n==="desc"?-1:1;return[...t].sort((i,s)=>{const a=i[e],o=s[e],l=dt(a),c=dt(o);return l||c?l&&c?0:l?1:-1:r*Fd(a,o)})}function Hd(t){return[...t].sort((e,n)=>{const r=e.score,i=n.score,s=dt(r),a=dt(i);if(s||a)return s&&a?0:s?1:-1;let o=i-r;if(o!==0)return o;const l=e.rate_of_return,c=n.rate_of_return,d=dt(l),h=dt(c);return d||h?d&&h?0:d?1:-1:c-l})}var Vd=g("<div class=stage-badges>"),Wd=g("<pre class=errbox>"),jd=g("<details><summary> "),zd=g("<div class=scroll-region>"),Gd=g('<section class=pane><div class=controls><input type=search class=filter-input placeholder="filter underlying / sector…"aria-label="filter rows by underlying or sector"><label class=check><input type=checkbox>scored only</label><span class=count-line> rows (filtered from <!>)'),qd=g("<div class=empty-panel><b>No scored candidates on this timeframe.</b> Untick <b>scored only</b> to browse the <!> raw rows — none cleared the scoring gates (return floor, Sharpe &gt; 0). Try lowering the floor in <b>Adjust scoring</b>."),Kd=g("<div class=empty-panel>No rows match the current filter."),Jd=g('<div class="empty-panel stage-failed-panel"><b> <!> — no rows</b><pre class=errbox>');const Hn=100,Yd=150,ni={short:{id:"chains_short",label:"Chains · Short"},medium:{id:"chains_medium",label:"Chains · Medium"}};function Xd(t){const e=i=>i==="failed"?"failed":i==="partial"?"partial":"ok",n=i=>i==="failed"?"✗":i==="partial"?"△":"✓",r=i=>i.replaceAll("_"," ");return(()=>{var i=Vd();return u(i,f(re,{get each(){return t.stages??[]},children:s=>(()=>{var a=jd(),o=a.firstChild,l=o.firstChild;return u(o,()=>n(s.status),l),u(o,()=>r(s.name),null),u(a,f(k,{get when(){return s.error},get children(){var c=Wd();return u(c,()=>s.error),c}}),null),v(()=>de(a,`sbadge ${e(s.status)}`)),a})()})),i})()}function ri(t){const[e,n]=M(""),[r,i]=M(""),[s,a]=M(!0),[o,l]=M(null),[c,d]=M("asc"),[h,p]=M(1);let m;Oe(()=>clearTimeout(m));const b=()=>{var I;return((I=t.tf)==null?void 0:I.rows)??[]},T=ae(()=>{const I=t.scoring.params(),B=t.scoring.isCustom();return b().map(x=>{const W=ku(x,I);return{...x,frozen_score:x.score,live_parts:W,score:B?W==null?null:W.total:x.score}})}),_=ae(()=>T().filter(I=>!te(I.score)&&te(I.frozen_score)).length),S=I=>{const B=I.currentTarget.value;n(B),clearTimeout(m),m=setTimeout(()=>{i(B.trim().toLowerCase()),p(1)},Yd)},E=I=>{a(I),p(1)},O=I=>{o()!==I?(l(I),d("asc")):c()==="asc"?d("desc"):(l(null),d("asc")),p(1)},[R,D]=M(null),y=I=>{const B=`${I.underlying}|${I.strike}`;D(x=>x===B?null:B)};et(At([o,c,h,r,s],()=>D(null))),et(At(t.active,()=>D(null))),et(At(t.columns.visible,()=>p(1)));const A=()=>$n.filter(I=>!t.columns.visible().includes(I.id)),C=()=>(t.stages??[]).find(I=>I.name===ni[t.id].id),P=ae(()=>{const I=r();return I?T().filter(B=>{const x=B.underlying,W=B.sector;return x!=null&&String(x).toLowerCase().includes(I)||W!=null&&String(W).toLowerCase().includes(I)}):T()}),$=ae(()=>{const I=P();return s()?I.filter(B=>!te(B.score)):I}),N=ae(()=>o()?Bd($(),o(),c()):Hd($())),V=ae(()=>Math.max(1,Math.ceil(N().length/Hn))),Z=()=>Math.min(h(),V()),ie=()=>{const I=Z();return N().slice((I-1)*Hn,I*Hn)},he=ae(()=>{var B;const I=new Map;if(t.scoring.isCustom()){const x=Eu(T().map(W=>({row:W,score:W.score})));for(const W of x)I.set(`${W.row.underlying}|${W.row.strike}`,I.size+1)}else for(const x of((B=t.tf)==null?void 0:B.top_picks)??[])I.set(`${x.underlying}|${x.strike}`,x.rank??"?");return I}),F=I=>he().get(`${I.underlying}|${I.strike}`);return(()=>{var I=Gd(),B=I.firstChild,x=B.firstChild,W=x.nextSibling,K=W.firstChild,G=W.nextSibling,fe=G.firstChild,Fe=fe.nextSibling;return Fe.nextSibling,u(I,f(Xd,{get stages(){return t.stages}}),B),x.$$input=S,K.addEventListener("change",se=>E(se.currentTarget.checked)),u(B,f(Bu,{get store(){return t.columns}}),G),u(G,()=>Tt(N().length),fe),u(G,()=>Tt(b().length),Fe),u(G,f(k,{get when(){return q(()=>!!t.scoring.isCustom())()&&_()>0},get children(){return[" ","· ",q(()=>Tt(_()))," re-admitted by lower floor"]}}),null),u(I,f(k,{get when(){return ie().length>0},get children(){var se=zd();return u(se,f(Ud,{get visibleCols(){return t.columns.visible},rows:ie,sortKey:o,sortDir:c,onSort:O,get thresholds(){return t.thresholds},pickRankOf:F,openKey:R,onToggleRow:y,hiddenDefs:A,get customScores(){return t.scoring.isCustom}})),se}}),null),u(I,f(k,{get when(){return ie().length===0},get children(){return f(k,{get when(){var se,Ee;return((se=C())==null?void 0:se.status)==="failed"||((Ee=C())==null?void 0:Ee.status)==="partial"},get fallback(){return f(k,{get when(){return q(()=>!!s())()&&P().length>0},get fallback(){return Kd()},get children(){var se=qd(),Ee=se.firstChild,Be=Ee.nextSibling,st=Be.nextSibling,at=st.nextSibling,ot=at.nextSibling;return ot.nextSibling,u(se,()=>Tt(P().length),ot),se}})},children:se=>(()=>{var Ee=Jd(),Be=Ee.firstChild,st=Be.firstChild,at=st.nextSibling;at.nextSibling;var ot=Be.nextSibling;return u(Be,()=>se().status==="partial"?"△":"✗",st),u(Be,()=>ni[t.id].label,at),u(ot,()=>se().error??"stage produced no data"),Ee})()})}}),null),u(I,f(k,{get when(){return N().length>0},get children(){return f(zu,{page:Z,pageCount:V,onGo:p})}}),null),v(()=>I.hidden=!t.active()),v(()=>x.value=e()),v(()=>K.checked=s()),I})()}we(["input"]);var Qd=g("<div class=holdings-bar><div class=holdings-bar-fill></div><div class=holdings-bar-mark>"),Zd=g('<span class=hp-cash-editor><input inputmode=decimal placeholder=150000><button type=button class="btn btn-primary">save</button><button type=button class=btn>cancel'),eh=g('<button type=button class="btn-ghost hp-cash-edit">'),th=g("<div class=hp-pool-list>"),nh=g('<div class=hp-rail-block><div class=hp-rail-label>free to sell puts</div><div class=hp-rail-big></div><div class=hp-rail-sub> cash − <!> reserved</div><div class=hp-pool-section><div class="hp-pool-row hp-pool-add"><input placeholder="new pool name"aria-label="new pool name"><button type=button class=btn>add'),rh=g('<span class=hp-pool-name-row><button type=button class=hp-pool-name></button><button type=button class="btn hp-pool-del">×'),ih=g('<span class=hp-pool-line><span class=hp-pool-cash></span><button type=button class="btn-ghost hp-pool-act">cash</button><button type=button class="btn-ghost hp-pool-act">rename'),sh=g("<div class=hp-pool-item>"),ah=g("<span class=hp-pool-row><input><button type=button class=btn>save</button><button type=button class=btn>cancel"),bs=g("<select class=hp-pool-pick>"),oh=g('<button type=button class="btn-ghost holdings-close-btn">sell call…'),lh=g('<div class=hp-slot><div class=hp-lot-card><div class=hp-lot-row><div class=hp-lot-row-top><span> sh </span><b></b></div><div class=hp-lot-row-sub><span>bought <!> · </span><b></b></div><div class=hp-lot-row-meta><i>last </i><i>covered <!>/</i></div></div><div class=hp-lot-actions><button type=button class="btn-ghost holdings-close-btn">close…'),ys=g("<span class=hp-pool-tag>"),jt=g("<option>"),ch=g("<i class=hp-spot-session>"),uh=g('<span class="chip high">buy back?'),dh=g('<span class="chip high">ITM — called away?'),fr=g("<b>"),hh=g("<i>"),fh=g('<div class=hp-slot><div class=hp-list-row><span class=hp-list-pos><span class=hp-kind></span><b> <!> ×</b><i>exp <!> · <!>/<!> wd</i></span><span></span><span class=hp-list-pace><i>target </i></span><span class=hp-list-status></span><button type=button class="btn-ghost holdings-close-btn">close…</button><div class="holdings-card-stats hp-list-stats"><div><span>sold at</span><b></b></div><div><span>now (mid)</span><b></b><i></i></div><div><span>spot</span></div><div><span>close captures</span><b>'),gh=g('<span class="chip normal">holding'),ph=g("<b>—"),mh=g("<label>pool<select>"),_h=g("<div class=hp-dialog-note>coverage is shown per lot — recorded even if it exceeds held shares"),bh=g('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>strike<input inputmode=decimal></label><label>premium<input inputmode=decimal></label><label>contracts <input inputmode=numeric></label><label>sold <input type=date></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary"></button><button type=button class=btn>Cancel'),yh=g("<label>pool (deduct <!> from)<select>"),vh=g('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>shares <input inputmode=numeric placeholder="e.g. 100"></label><label>basis / share<input inputmode=decimal placeholder="e.g. 349.00"></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class=btn>Cancel'),wh=g('<div class=holdings-outcome><div class=holdings-outcome-head>Sell covered call · <!> sh </div><form class=holdings-add><label>strike<input inputmode=decimal placeholder="e.g. 360.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.20"></label><label>contracts <input inputmode=numeric></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Sell call</button><button type=button class=btn>Cancel'),$h=g("<i class=holdings-preview>"),Sh=g('<div class=holdings-outcome><div class=holdings-outcome-head>Close lot · <!> sh </div><form class=holdings-add><label>shares<input inputmode=numeric></label><label>sale price<input inputmode=decimal placeholder="e.g. 360.00"></label><button type=submit class="btn btn-primary">Close </button><button type=button class=btn>Cancel'),vs=g("<label class=holdings-outcome-price><input inputmode=decimal>"),kh=g("<div class=hp-dialog-note>confirming creates a share lot prefilled at basis = strike − premium"),Eh=g('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>P ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>assigned</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),Ih=g("<label>pool (deduct strike × 100 × contracts from)<select>"),Ch=g('<div class=holdings-outcome><div class=holdings-outcome-head>Record assigned shares</div><form class=holdings-add><label>symbol <input></label><label>shares <input inputmode=numeric></label><label>basis / share<input inputmode=decimal></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class=btn>Cancel'),Th=g("<div class=hp-dialog-note>confirming auto-reduces the <!> lot by <!> sh"),Ah=g('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>C ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>called away</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),Ph=g("<div class=hp-list>"),ii=g("<div class=empty-panel>"),Rh=g('<div class=hp-list><div class="hp-list-row hp-list-head"><span>position</span><span>P&L</span><span>pace</span><span>status</span><span>'),xh=g("<span class=hp-pane-hint> sh held"),Oh=g("<div class=hp-toolbar-row><button type=button class=btn>"),Nh=g('<button type=button class="btn holdings-refresh">⟳<span class=holdings-refresh-label> Refresh marks'),Dh=g("<div class=holdings-notice>"),Lh=g('<div class="holdings-panel hp-tabs-shell"><div class=hp-tabs-grid><aside class=hp-tabs-rail><div class=hp-tabs-brand>Wheel ledger</div></aside><main class=hp-tabs-main><div class=hp-pane-head><span class=hp-pane-title>'),Mh=g("<button type=button class=hp-tab-tile><span class=hp-tab-tile-name></span><span class=hp-tab-tile-count></span><div class=hp-tab-tile-sub>");const Re=t=>(t<0?"-$":"$")+Math.abs(t).toLocaleString(void 0,{maximumFractionDigits:0}),vt=t=>(t<0?"-$":"$")+Math.abs(t).toFixed(2),tn=(t,e=0)=>`${(t*100).toFixed(e)}%`,qe=()=>new Date().toLocaleDateString("en-CA",{timeZone:"America/New_York"}),ws=(t,e)=>{const[n,r,i]=t.split("-").map(Number);return new Date(Date.UTC(n,r-1,i+e,12)).toLocaleDateString("en-CA",{timeZone:"America/New_York"})};function $s(t){if(!t)return"";const e=Math.max(0,(Date.now()-new Date(t).getTime())/1e3),n=Math.floor(e/60);return n<1?"just now":n<60?`${n} min ago`:`about ${Math.floor(n/60)} h ago`}function Uh(t){const e=()=>t.v.pl_pct==null?0:Math.max(0,Math.min(100,t.v.pl_pct*100));return(()=>{var n=Qd(),r=n.firstChild,i=r.nextSibling;return v(s=>{var a=`${e()}%`,o=`${Math.min(100,t.v.target_pct*100)}%`;return a!==s.e&&tt(r,"width",s.e=a),o!==s.t&&tt(i,"left",s.t=o),s},{e:void 0,t:void 0}),n})()}function Fh(t){const[e,n]=M(t.cash==null?"":String(t.cash)),r=()=>Number.isFinite(Number(e()))&&Number(e())>=0;return(()=>{var i=Zd(),s=i.firstChild,a=s.nextSibling,o=a.nextSibling;return s.$$keydown=l=>{var c;return l.key==="Escape"&&((c=t.onCancel)==null?void 0:c.call(t))},s.$$input=l=>n(l.target.value),a.$$click=()=>t.onSave(Number(e())),o.$$click=()=>{var l;return(l=t.onCancel)==null?void 0:l.call(t)},v(()=>{var l;return a.disabled=!r()||((l=t.busy)==null?void 0:l.call(t))}),v(()=>s.value=e()),i})()}function Bh(t){const[e,n]=M(!1),[r,i]=M(null),[s,a]=M(""),o=()=>t.pools??[],l=()=>t.pool,c=()=>l()?l().cash:t.cash,d=()=>l()?l().reserved:t.reserved,h=()=>l()?l().free:t.free,p=()=>c()==null,m=_=>{var S;_&&_!==((S=l())==null?void 0:S.id)&&t.onSelectPool(_),i(_??null),n(!0)},b=()=>{const _=o().find(S=>S.id===r());return _?_.cash:t.cash},T=async()=>{var _;!s().trim()||(_=t.busy)!=null&&_.call(t)||await t.onAddPool(s().trim())&&a("")};return(()=>{var _=nh(),S=_.firstChild,E=S.nextSibling,O=E.nextSibling,R=O.firstChild,D=R.nextSibling;D.nextSibling;var y=O.nextSibling,A=y.firstChild,C=A.firstChild,P=C.nextSibling;return u(E,(()=>{var $=q(()=>h()==null);return()=>$()?"—":Re(h())})()),u(O,(()=>{var $=q(()=>c()==null);return()=>$()?"—":Re(c())})(),R),u(O,()=>Re(d()),D),u(_,f(k,{get when(){return!e()},get fallback(){return f(Fh,{get cash(){return b()},get busy(){return t.busy},onSave:async $=>{await t.onSaveCash($,r())&&n(!1)},onCancel:()=>n(!1)})},get children(){var $=eh();return $.$$click=()=>{var N;return m(((N=l())==null?void 0:N.id)??null)},u($,()=>p()?"set cash":"edit cash"),$}}),y),u(y,f(k,{get when(){return o().length>0},get children(){var $=th();return u($,f(re,{get each(){return o()},children:N=>f(Hh,{pool:N,get selected(){var V;return((V=l())==null?void 0:V.id)===N.id},get busy(){return t.busy},onSelect:()=>{n(!1),t.onSelectPool(N.id)},onEditCash:()=>m(N.id),onRename:V=>t.onRenamePool(N.id,V),onDelete:()=>t.onDeletePool(N.id)})})),$}}),A),C.$$keydown=$=>$.key==="Enter"&&T(),C.$$input=$=>a($.target.value),P.$$click=T,v(()=>{var $;return P.disabled=!s().trim()||(($=t.busy)==null?void 0:$.call(t))}),v(()=>C.value=s()),_})()}function Hh(t){const[e,n]=M(!1),[r,i]=M(t.pool.name),s=()=>{i(t.pool.name),n(!0)},a=()=>{var l;const o=r().trim();!o||o===t.pool.name||(l=t.busy)!=null&&l.call(t)||(t.onRename(o),n(!1))};return(()=>{var o=sh();return u(o,f(k,{get when(){return!e()},get fallback(){return(()=>{var l=ah(),c=l.firstChild,d=c.nextSibling,h=d.nextSibling;return c.$$keydown=p=>{p.key==="Enter"?a():p.key==="Escape"&&n(!1)},c.$$input=p=>i(p.target.value),d.$$click=a,h.$$click=()=>n(!1),v(p=>{var T;var m=`rename ${t.pool.name}`,b=((T=t.busy)==null?void 0:T.call(t))||!r().trim()||r().trim()===t.pool.name;return m!==p.e&&ne(c,"aria-label",p.e=m),b!==p.t&&(d.disabled=p.t=b),p},{e:void 0,t:void 0}),v(()=>c.value=r()),l})()},get children(){return[(()=>{var l=rh(),c=l.firstChild,d=c.nextSibling;return j(c,"click",t.onSelect),u(c,()=>t.pool.name),j(d,"click",t.onDelete),v(h=>{var b;var p=(b=t.busy)==null?void 0:b.call(t),m=`delete ${t.pool.name}`;return p!==h.e&&(d.disabled=h.e=p),m!==h.t&&ne(d,"aria-label",h.t=m),h},{e:void 0,t:void 0}),l})(),(()=>{var l=ih(),c=l.firstChild,d=c.nextSibling,h=d.nextSibling;return u(c,()=>Re(t.pool.cash)),j(d,"click",t.onEditCash),h.$$click=s,l})()]}})),v(()=>o.classList.toggle("active",!!t.selected)),o})()}const Vh={PreMarket:"pre",AfterHours:"post",OverNight:"overnight"};function Wh(t){const e=t.lot,n=()=>e.view;return(()=>{var r=lh(),i=r.firstChild,s=i.firstChild,a=s.firstChild,o=a.firstChild,l=o.firstChild,c=o.nextSibling,d=a.nextSibling,h=d.firstChild,p=h.firstChild,m=p.nextSibling;m.nextSibling;var b=h.nextSibling,T=d.nextSibling,_=T.firstChild;_.firstChild;var S=_.nextSibling,E=S.firstChild,O=E.nextSibling;O.nextSibling;var R=s.nextSibling,D=R.firstChild;return u(o,()=>e.shares,l),u(o,()=>e.symbol,null),u(o,f(k,{get when(){var y;return(((y=t.pools)==null?void 0:y.length)??0)>1},get fallback(){return f(k,{get when(){return t.showPool},get children(){var y=ys();return u(y,()=>e.pool_name??"Main"),y}})},get children(){var y=bs();return y.addEventListener("change",A=>{var C;return(C=t.onPoolChange)==null?void 0:C.call(t,e,A.currentTarget.value)}),u(y,f(re,{get each(){return t.pools},children:A=>(()=>{var C=jt();return u(C,()=>A.name),v(()=>C.value=A.id),C})()})),v(()=>ne(y,"aria-label",`cash pool for ${e.symbol} lot`)),v(()=>{var A,C;return y.value=e.pool_id??((C=(A=t.pools)==null?void 0:A[0])==null?void 0:C.id)??""}),y}}),null),u(c,(()=>{var y=q(()=>n().spot==null);return()=>y()?"—":vt(n().spot)})(),null),u(c,f(k,{get when(){var y;return Vh[(y=e.mark)==null?void 0:y.session]},children:y=>(()=>{var A=ch();return u(A,y),A})()}),null),u(h,()=>vt(e.basis_per_share),m),u(h,()=>e.acquired,null),u(b,f(k,{get when(){return n().pl_dollars!=null},fallback:"—",get children(){return`${Re(n().pl_dollars)} (${(n().pl_pct??0)>=0?"+":""}${tn(n().pl_pct,1)})`}})),u(_,()=>{var y;return $s((y=e.mark)==null?void 0:y.as_of)||"—"},null),u(S,()=>n().covered,O),u(S,()=>n().capacity,null),u(R,f(k,{get when(){return n().capacity>0},get children(){var y=oh();return y.$$click=()=>t.onSellDialog(e),y}}),D),D.$$click=()=>t.onCloseDialog(e),u(r,f(k,{get when(){return t.dialogFor("sellCall",e.id)},keyed:!0,children:y=>f(qh,{get lot(){return y.lot},get onDone(){return t.onDialogDone},get onSell(){return t.onSellCall}})}),null),u(r,f(k,{get when(){return t.dialogFor("closeLot",e.id)},keyed:!0,children:y=>f(Kh,{get lot(){return y.lot},get busy(){return t.busy},get onDone(){return t.onDialogDone},get onClose(){return t.onCloseLot}})}),null),v(()=>de(b,(n().pl_dollars??0)>=0?"holdings-pos":"holdings-neg")),r})()}function jh(t){const e=t.x,n=()=>e.v.spot_pct_vs_strike!=null&&e.v.spot_pct_vs_strike>0,r=()=>e.p.kind==="call"?e.v.spot_pct_vs_strike>0:e.v.spot_pct_vs_strike<0;return(()=>{var i=fh(),s=i.firstChild,a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=l.firstChild,d=c.nextSibling;d.nextSibling;var h=l.nextSibling,p=h.firstChild,m=p.nextSibling,b=m.nextSibling,T=b.nextSibling,_=T.nextSibling,S=_.nextSibling;S.nextSibling;var E=a.nextSibling,O=E.nextSibling,R=O.firstChild;R.firstChild;var D=O.nextSibling,y=D.nextSibling,A=y.nextSibling,C=A.firstChild,P=C.firstChild,$=P.nextSibling,N=C.nextSibling,V=N.firstChild,Z=V.nextSibling,ie=Z.nextSibling,he=N.nextSibling;he.firstChild;var F=he.nextSibling,I=F.firstChild,B=I.nextSibling;return u(o,()=>e.p.kind.toUpperCase()),u(l,()=>e.p.symbol,c),u(l,()=>e.p.strike,d),u(l,()=>e.p.kind==="put"?"P":"C",d),u(l,()=>e.p.contracts,null),u(a,f(k,{get when(){return q(()=>e.p.kind==="call")()&&t.showPool},get children(){var x=ys();return u(x,()=>e.p.pool_name),x}}),h),u(a,f(k,{get when(){return q(()=>e.p.kind==="put")()&&t.showPool},get children(){var x=bs();return x.addEventListener("change",W=>{var K;return(K=t.onPoolChange)==null?void 0:K.call(t,e.p.id,W.target.value)}),u(x,f(re,{get each(){return t.pools},children:W=>(()=>{var K=jt();return u(K,()=>W.name),v(()=>K.value=W.id),K})()})),v(W=>{var fe,Fe;var K=`cash pool for ${e.p.symbol} ${e.p.strike} put`,G=(Fe=(fe=t.dialogActions)==null?void 0:fe.busy)==null?void 0:Fe.call(fe);return K!==W.e&&ne(x,"aria-label",W.e=K),G!==W.t&&(x.disabled=W.t=G),W},{e:void 0,t:void 0}),v(()=>{var W,K;return x.value=((K=(W=t.pools)==null?void 0:W.find(G=>G.name===e.p.pool_name))==null?void 0:K.id)??""}),x}}),h),u(h,()=>e.p.expiry,m),u(h,()=>e.v.days_elapsed,T),u(h,()=>e.v.days_total,S),u(E,(()=>{var x=q(()=>e.v.pl_pct==null);return()=>x()?"—":`${e.v.pl_pct>=0?"+":""}${tn(e.v.pl_pct,1)}`})()),u(O,f(Uh,{get v(){return e.v}}),R),u(R,()=>tn(e.v.target_pct),null),u(D,f(k,{get when(){return e.v.pace_met},get fallback(){return gh()},get children(){return uh()}}),null),u(D,f(k,{get when(){return q(()=>e.p.kind==="call")()&&n()},get children(){return dh()}}),null),y.$$click=()=>t.onClose(e),u($,()=>vt(e.p.premium)),u(Z,(()=>{var x=q(()=>e.p.mark==null);return()=>x()?"—":e.p.mark.mid.toFixed(2)})()),u(ie,(()=>{var x=q(()=>e.p.mark==null);return()=>x()?"unpriced":$s(e.p.mark.as_of)})()),u(he,f(k,{get when(){var x;return((x=e.p.mark)==null?void 0:x.underlying_price)!=null},get fallback(){return ph()},get children(){return[(()=>{var x=fr();return u(x,()=>e.p.mark.underlying_price.toFixed(2)),x})(),(()=>{var x=hh();return u(x,(()=>{var W=q(()=>e.v.spot_pct_vs_strike==null);return()=>W()?"":`${e.v.spot_pct_vs_strike>=0?"+":""}${tn(e.v.spot_pct_vs_strike,1)} vs strike`})()),v(()=>de(x,r()&&e.v.spot_pct_vs_strike!=null?"holdings-neg":"holdings-pos")),x})()]}}),null),u(B,(()=>{var x=q(()=>e.v.pl_dollars==null);return()=>x()?"—":vt(e.v.pl_dollars)})()),u(i,f(k,{get when(){return t.dialogFor(e.p.kind,e.p.id)},keyed:!0,children:x=>f(Qh,zs({d:x,get pools(){return t.pools}},()=>t.dialogActions))}),null),v(x=>{var W=!!e.v.pace_met,K=e.p.kind,G=e.v.pl_pct>=0?"holdings-pos":"holdings-neg",fe=(e.v.pl_dollars??0)>=0?"holdings-pos":"holdings-neg";return W!==x.e&&s.classList.toggle("hp-row-met",x.e=W),K!==x.t&&ne(o,"data-kind",x.t=K),G!==x.a&&de(E,x.a=G),fe!==x.o&&de(B,x.o=fe),x},{e:void 0,t:void 0,a:void 0,o:void 0}),i})()}function zh(t){var o,l;const e=t.kind,n=()=>t.pools??[],[r,i]=M({symbol:"",strike:"",premium:"",contracts:"1",sold:qe(),expiry:ws(qe(),7),pool_id:((l=(o=t.pools)==null?void 0:o[0])==null?void 0:l.id)??""}),s=c=>d=>i({...r(),[c]:d.target.value}),a=()=>r().symbol.trim()&&[r().strike,r().premium,r().contracts].every(c=>Number(c)>0)&&r().expiry>r().sold&&r().sold<=qe();return(()=>{var c=bh(),d=c.firstChild,h=d.firstChild,p=h.nextSibling,m=d.nextSibling,b=m.firstChild,T=b.nextSibling,_=m.nextSibling,S=_.firstChild,E=S.nextSibling,O=_.nextSibling,R=O.firstChild,D=R.nextSibling,y=O.nextSibling,A=y.firstChild,C=A.nextSibling,P=y.nextSibling,$=P.firstChild,N=$.nextSibling,V=P.nextSibling,Z=V.nextSibling;return c.addEventListener("submit",ie=>{var he,F;ie.preventDefault(),!(!a()||(he=t.busy)!=null&&he.call(t))&&t.onAdd({...e==="call"?{kind:"call"}:{},...n().length>0?{pool_id:r().pool_id||((F=n()[0])==null?void 0:F.id)}:{},symbol:r().symbol.trim().toUpperCase(),strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:r().sold,expiry:r().expiry})}),j(p,"input",s("symbol")),j(T,"input",s("strike")),ne(T,"placeholder",e==="call"?"e.g. 355.00":"e.g. 350.00"),j(E,"input",s("premium")),ne(E,"placeholder",e==="call"?"e.g. 1.80":"e.g. 1.00"),j(D,"input",s("contracts")),u(c,f(k,{get when(){return n().length>1},get children(){var ie=mh(),he=ie.firstChild,F=he.nextSibling;return j(F,"input",s("pool_id")),u(F,f(re,{get each(){return n()},children:I=>(()=>{var B=jt();return u(B,()=>I.name),v(()=>B.value=I.id),B})()})),v(()=>F.value=r().pool_id),ie}}),y),j(C,"input",s("sold")),j(N,"input",s("expiry")),u(V,e==="call"?"Sell call":"Sell put"),j(Z,"click",t.onDone),u(c,f(k,{when:e==="call",get children(){return _h()}}),null),v(()=>{var ie;return V.disabled=!a()||((ie=t.busy)==null?void 0:ie.call(t))}),v(()=>p.value=r().symbol),v(()=>T.value=r().strike),v(()=>E.value=r().premium),v(()=>D.value=r().contracts),v(()=>C.value=r().sold),v(()=>N.value=r().expiry),c})()}function Gh(t){var a;const e=()=>t.pools??[],[n,r]=M({symbol:"",shares:"",basis_per_share:"",acquired:qe(),pool_id:((a=e()[0])==null?void 0:a.id)??""}),i=o=>l=>r({...n(),[o]:l.target.value}),s=()=>n().symbol.trim()&&Number(n().shares)>0&&Number(n().basis_per_share)>0;return(()=>{var o=vh(),l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=l.nextSibling,p=h.firstChild,m=p.nextSibling,b=h.nextSibling,T=b.firstChild,_=T.nextSibling,S=b.nextSibling,E=S.firstChild,O=E.nextSibling,R=S.nextSibling,D=R.nextSibling;return o.addEventListener("submit",y=>{var A,C;y.preventDefault(),!(!s()||(A=t.busy)!=null&&A.call(t))&&t.onAdd({kind:"lot",symbol:n().symbol.trim().toUpperCase(),shares:Math.trunc(Number(n().shares)),basis_per_share:Number(n().basis_per_share),acquired:n().acquired,...e().length>0?{pool_id:n().pool_id||((C=e()[0])==null?void 0:C.id)}:{}})}),j(d,"input",i("symbol")),j(m,"input",i("shares")),j(_,"input",i("basis_per_share")),u(o,f(k,{get when(){return e().length>1},get children(){var y=yh(),A=y.firstChild,C=A.nextSibling,P=C.nextSibling,$=P.nextSibling;return u(y,()=>Math.trunc(Number(n().shares)*Number(n().basis_per_share)||0).toLocaleString(),C),j($,"input",i("pool_id")),u($,f(re,{get each(){return e()},children:N=>(()=>{var V=jt();return u(V,()=>N.name),v(()=>V.value=N.id),V})()})),v(()=>$.value=n().pool_id),y}}),S),j(O,"input",i("acquired")),j(D,"click",t.onDone),v(()=>{var y;return R.disabled=!s()||((y=t.busy)==null?void 0:y.call(t))}),v(()=>d.value=n().symbol),v(()=>m.value=n().shares),v(()=>_.value=n().basis_per_share),v(()=>O.value=n().acquired),o})()}function qh(t){const e=t.lot,n=()=>Math.floor(e.shares/100),[r,i]=M({strike:"",premium:"",contracts:String(n()),expiry:ws(qe(),7)}),s=o=>l=>i({...r(),[o]:l.target.value}),a=()=>Number(r().strike)>0&&Number(r().premium)>0&&Number(r().contracts)>=1&&Number(r().contracts)<=n()&&r().expiry>qe();return(()=>{var o=wh(),l=o.firstChild,c=l.firstChild,d=c.nextSibling;d.nextSibling;var h=l.nextSibling,p=h.firstChild,m=p.firstChild,b=m.nextSibling,T=p.nextSibling,_=T.firstChild,S=_.nextSibling,E=T.nextSibling,O=E.firstChild,R=O.nextSibling,D=E.nextSibling,y=D.firstChild,A=y.nextSibling,C=D.nextSibling,P=C.nextSibling;return u(l,()=>e.shares,d),u(l,()=>e.symbol,null),h.addEventListener("submit",$=>{var N;$.preventDefault(),!(!a()||(N=t.busy)!=null&&N.call(t))&&t.onSell(e,{kind:"call",symbol:e.symbol,strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:qe(),expiry:r().expiry})}),j(b,"input",s("strike")),j(S,"input",s("premium")),j(R,"input",s("contracts")),j(A,"input",s("expiry")),j(P,"click",t.onDone),v(()=>{var $;return C.disabled=!a()||(($=t.busy)==null?void 0:$.call(t))}),v(()=>b.value=r().strike),v(()=>S.value=r().premium),v(()=>R.value=r().contracts),v(()=>A.value=r().expiry),o})()}function Kh(t){const e=t.lot,[n,r]=M({shares:String(e.shares),price:""}),i=c=>d=>r({...n(),[c]:d.target.value}),s=()=>Math.trunc(Number(n().shares)),a=()=>Number(n().price),o=()=>Number.isInteger(s())&&s()>=1&&s()<=e.shares&&a()>0,l=()=>o()?s()*a():null;return(()=>{var c=Sh(),d=c.firstChild,h=d.firstChild,p=h.nextSibling;p.nextSibling;var m=d.nextSibling,b=m.firstChild,T=b.firstChild,_=T.nextSibling,S=b.nextSibling,E=S.firstChild,O=E.nextSibling,R=S.nextSibling;R.firstChild;var D=R.nextSibling;return u(d,()=>e.shares,p),u(d,()=>e.symbol,null),m.addEventListener("submit",y=>{var A;y.preventDefault(),!(!o()||(A=t.busy)!=null&&A.call(t))&&t.onClose(e,s(),a())}),m.$$keydown=y=>{y.key==="Escape"&&t.onDone()},j(_,"input",i("shares")),j(O,"input",i("price")),u(m,f(k,{get when(){return l()!=null},get children(){var y=$h();return u(y,()=>`${s()} sh × $${a().toFixed(2)} → $${l().toFixed(2)} → pool ${e.pool_name??"Main"}`),y}}),R),u(R,(()=>{var y=q(()=>s()===e.shares);return()=>y()?"lot":`${s()} sh`})(),null),j(D,"click",t.onDone),v(()=>{var y;return R.disabled=!o()||((y=t.busy)==null?void 0:y.call(t))}),v(()=>_.value=n().shares),v(()=>O.value=n().price),c})()}function Jh(t){var o,l;const e=t.d.pos,[n,r]=M("bought-back"),[i,s]=M(((l=(o=e.mark)==null?void 0:o.mid)==null?void 0:l.toFixed(2))??""),a=()=>{if(n()==="expired")return e.premium*100*e.contracts;const c=Number(i());return Number.isFinite(c)?n()==="assigned"?(e.strike-c+e.premium)*100*e.contracts:(e.premium-c)*100*e.contracts:null};return(()=>{var c=Eh(),d=c.firstChild,h=d.firstChild,p=h.nextSibling,m=p.nextSibling,b=m.nextSibling;b.nextSibling;var T=d.nextSibling,_=T.firstChild,S=_.firstChild,E=_.nextSibling,O=E.firstChild,R=E.nextSibling,D=R.firstChild,y=T.nextSibling;y.firstChild;var A=y.nextSibling,C=A.firstChild,P=C.nextSibling;return u(d,()=>e.symbol,p),u(d,()=>e.strike,b),u(d,()=>e.contracts,null),S.addEventListener("change",()=>r("bought-back")),O.addEventListener("change",()=>r("expired")),D.addEventListener("change",()=>r("assigned")),u(c,f(k,{get when(){return n()!=="expired"},get children(){var $=vs(),N=$.firstChild;return u($,()=>n()==="assigned"?"share price at assignment":"close price/share",N),N.$$input=V=>s(V.target.value),v(()=>N.value=i()),$}}),y),u(y,f(k,{get when(){return a()!==null},fallback:"—",get children(){var $=fr();return u($,()=>vt(a())),v(()=>de($,a()>=0?"holdings-pos":"holdings-neg")),$}}),null),j(C,"click",t.onDone),P.$$click=()=>t.onConfirmPut(e,n(),n()==="expired"?null:Number(i())),u(c,f(k,{get when(){return n()==="assigned"},get children(){return kh()}}),null),v(()=>{var $;return P.disabled=(($=t.busy)==null?void 0:$.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),v(()=>S.checked=n()==="bought-back"),v(()=>O.checked=n()==="expired"),v(()=>D.checked=n()==="assigned"),c})()}function Yh(t){var a,o;const e=()=>t.pools??[],[n,r]=M({...t.d.prefill,pool_id:((a=t.d.pos)==null?void 0:a.pool_id)??((o=e()[0])==null?void 0:o.id)??""}),i=l=>c=>r({...n(),[l]:c.target.value}),s=()=>n().symbol.trim()&&Number(n().shares)>0&&Number(n().basis_per_share)>0;return(()=>{var l=Ch(),c=l.firstChild,d=c.nextSibling,h=d.firstChild,p=h.firstChild,m=p.nextSibling,b=h.nextSibling,T=b.firstChild,_=T.nextSibling,S=b.nextSibling,E=S.firstChild,O=E.nextSibling,R=S.nextSibling,D=R.firstChild,y=D.nextSibling,A=R.nextSibling,C=A.nextSibling;return d.addEventListener("submit",P=>{var $,N;P.preventDefault(),!(!s()||($=t.busy)!=null&&$.call(t))&&t.onAssign(t.d.pos,{kind:"lot",symbol:n().symbol.trim().toUpperCase(),shares:Math.trunc(Number(n().shares)),basis_per_share:Number(n().basis_per_share),acquired:n().acquired,assigned_from:t.d.pos.id,...e().length>0?{pool_id:n().pool_id||((N=e()[0])==null?void 0:N.id)}:{}})}),j(m,"input",i("symbol")),j(_,"input",i("shares")),u(d,f(k,{get when(){return e().length>1},get children(){var P=Ih(),$=P.firstChild,N=$.nextSibling;return j(N,"input",i("pool_id")),u(N,f(re,{get each(){return e()},children:V=>(()=>{var Z=jt();return u(Z,()=>V.name),v(()=>Z.value=V.id),Z})()})),v(()=>N.value=n().pool_id),P}}),S),j(O,"input",i("basis_per_share")),j(y,"input",i("acquired")),j(C,"click",t.onDone),v(()=>{var P;return A.disabled=!s()||((P=t.busy)==null?void 0:P.call(t))}),v(()=>m.value=n().symbol),v(()=>_.value=n().shares),v(()=>O.value=n().basis_per_share),v(()=>y.value=n().acquired),l})()}function Xh(t){var o,l;const e=t.d.pos,[n,r]=M("bought-back"),[i,s]=M(((l=(o=e.mark)==null?void 0:o.mid)==null?void 0:l.toFixed(2))??""),a=()=>{if(n()==="expired")return e.premium*100*e.contracts;const c=Number(i());return Number.isFinite(c)?n()==="called-away"?(e.strike-c+e.premium)*100*e.contracts:(e.premium-c)*100*e.contracts:null};return(()=>{var c=Ah(),d=c.firstChild,h=d.firstChild,p=h.nextSibling,m=p.nextSibling,b=m.nextSibling;b.nextSibling;var T=d.nextSibling,_=T.firstChild,S=_.firstChild,E=_.nextSibling,O=E.firstChild,R=E.nextSibling,D=R.firstChild,y=T.nextSibling;y.firstChild;var A=y.nextSibling,C=A.firstChild,P=C.nextSibling;return u(d,()=>e.symbol,p),u(d,()=>e.strike,b),u(d,()=>e.contracts,null),S.addEventListener("change",()=>r("bought-back")),O.addEventListener("change",()=>r("expired")),D.addEventListener("change",()=>r("called-away")),u(c,f(k,{get when(){return n()!=="expired"},get children(){var $=vs(),N=$.firstChild;return u($,()=>n()==="called-away"?"share price at call":"close price/share",N),N.$$input=V=>s(V.target.value),v(()=>N.value=i()),$}}),y),u(y,f(k,{get when(){return a()!==null},fallback:"—",get children(){var $=fr();return u($,()=>vt(a())),v(()=>de($,a()>=0?"holdings-pos":"holdings-neg")),$}}),null),j(C,"click",t.onDone),P.$$click=()=>t.onConfirmCall(e,n(),n()==="expired"?null:Number(i())),u(c,f(k,{get when(){return n()==="called-away"},get children(){var $=Th(),N=$.firstChild,V=N.nextSibling,Z=V.nextSibling,ie=Z.nextSibling;return ie.nextSibling,u($,()=>e.symbol,V),u($,()=>e.contracts*100,ie),$}}),null),v(()=>{var $;return P.disabled=(($=t.busy)==null?void 0:$.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),v(()=>S.checked=n()==="bought-back"),v(()=>O.checked=n()==="expired"),v(()=>D.checked=n()==="called-away"),c})()}function Qh(t){return t.d.type==="put"?t.d.stage==="lot"?f(Yh,{get d(){return t.d},get pools(){return t.pools},get busy(){return t.busy},get onDone(){return t.onDone},get onAssign(){return t.onAssign}}):f(Jh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmPut(){return t.onConfirmPut}}):f(Xh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmCall(){return t.onConfirmCall}})}function Zh(){const[t,e]=M(null),[n,r]=M("");let i;const s=w=>{r(w),clearTimeout(i),i=setTimeout(()=>r(""),4e3)};Oe(()=>clearTimeout(i));const[a,o]=M(null),[l,c]=M(!1),d=async()=>{try{e(await ia())}catch(w){s(`Holdings API error: ${w.message}`)}};mt(d);const h=()=>{var w;return((w=t())==null?void 0:w.positions)??[]},p=()=>{var w;return((w=t())==null?void 0:w.calls)??[]},m=()=>{var w;return((w=t())==null?void 0:w.lots)??[]},b=()=>h().map(w=>({p:{...w,kind:"put"},v:w.view})),T=()=>p().map(w=>({p:{...w,kind:"call"},v:w.view})),_=w=>w.v.pl_pct==null?-1/0:w.v.pl_pct-w.v.target_pct,S=(w,L)=>{var Y,le;const U=a();return!U||U.type!==w?null:(((Y=U.pos)==null?void 0:Y.id)??((le=U.lot)==null?void 0:le.id))===L?U:null},E=async w=>{if(l())return null;c(!0);try{return await w()}catch(L){return s(L.message),null}finally{c(!1)}},O=async()=>{var U;const w=await E(()=>sa());if(!w)return;const L=((U=w.refresh)==null?void 0:U.stale)??[];s(L.length?`Marks refreshed — ${L.length} entry(ies) unpriced (kept last mark).`:"Marks refreshed."),await d()},R=async(w,L)=>{await E(()=>Cn(w))&&(s(L),o(null),await d())},D=async(w,L)=>{await E(()=>Cn(L))&&(s(`Assigned — recorded ${L.shares} sh ${L.symbol} at $${L.basis_per_share.toFixed(2)} basis.`),o(null),await d())},y=async(w,L,U)=>{if(L==="assigned"){o({type:"put",pos:w,stage:"lot",prefill:{symbol:w.symbol,shares:w.contracts*100,basis_per_share:+(w.strike-w.premium).toFixed(2),acquired:qe()}});return}await E(()=>Tn(w.id))&&(s(L==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),o(null),await d())},A=async(w,L,U)=>{if(L==="called-away"){const Y=await E(()=>oa(w.id));if(!Y)return;s(Y.reduced?`Called away — ${w.symbol} lot reduced by ${w.contracts*100} sh.`:`Called away — call removed. ${Y.reason??""}`),o(null),await d();return}await E(()=>Tn(w.id))&&(s(L==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),o(null),await d())},C=async(w,L)=>{const U=await E(()=>yr(L?{cash:w,pool_id:L}:{cash:w}));return U?(e(z=>({...z??{},cash:U.cash,cash_reserved:U.cash_reserved,cash_free:U.cash_free,cash_pools:U.pool?((z==null?void 0:z.cash_pools)??[]).map(Y=>Y.id===U.pool.id?{...Y,...U.pool}:Y):(z==null?void 0:z.cash_pools)??[]})),s(U.pool?`Cash set to ${Re(U.pool.cash)} — ${Re(U.pool.free)} free in ${U.pool.name}.`:`Cash set to ${Re(U.cash)} — ${Re(U.cash_free)} free.`),!0):!1},P=()=>{var w;return((w=t())==null?void 0:w.cash_pools)??[]},[$,N]=M(null),V=()=>{const w=P();return w.length?w.find(L=>L.id===$())??w[0]:null},Z=async w=>{var U;const L=await E(()=>Cn({kind:"pool",name:w}));return L?(s(`Pool “${w}” added — set its cash with the strip.`),N(((U=L.pool)==null?void 0:U.id)??null),await d(),!0):!1},ie=async(w,L)=>{await E(()=>yr({pool_id:w,name:L}))&&(s(`Pool renamed to “${L}”.`),await d())},he=async w=>{await E(()=>Tn(w))&&(s("Pool deleted."),$()===w&&N(null),await d())},F=async(w,L)=>{var z;const U=await E(()=>br(w,L));U&&(s(`Put moved to ${((z=U.position)==null?void 0:z.pool_name)??"the pool"}.`),await d())},I=async(w,L)=>{var z;const U=await E(()=>br(w.id,L));U&&(s(`${w.symbol} lot moved to ${((z=U.lot)==null?void 0:z.pool_name)??"the pool"}.`),await d())},B={busy:l,onDone:()=>o(null),onConfirmPut:y,onConfirmCall:A,onAssign:D},[x,W]=M("lots"),K=()=>[{id:"lots",label:"Lots",count:m().length,sub:`${m().reduce((w,L)=>w+L.shares,0)} sh held`},{id:"puts",label:"Puts",count:h().length,sub:`${h().filter(w=>w.view.pace_met).length} pace-met`},{id:"calls",label:"Calls",count:p().length,sub:`${p().filter(w=>w.view.spot_pct_vs_strike>0).length} ITM`}],G=()=>[...b()].sort((w,L)=>_(L)-_(w)),fe=()=>[...T()].sort((w,L)=>_(L)-_(w)),Fe={lots:{label:"+ New lot",type:"addLot"},puts:{label:"+ Sell put",type:"addPut"},calls:{label:"+ Sell call",type:"addCall"}},se={lots:"No recorded lots — assignments land here.",puts:"No open puts — press “+ Sell put” to record one.",calls:"No open calls — press “+ Sell call” to record one."},Ee=w=>{if(w==="lots")return f(k,{get when(){return m().length>0},get fallback(){return(()=>{var U=ii();return u(U,()=>se.lots),U})()},get children(){var U=Ph();return u(U,f(re,{get each(){return m()},children:z=>f(Wh,{lot:z,dialogFor:S,busy:l,get pools(){return P()},get showPool(){return P().length>1},onPoolChange:I,onSellDialog:Y=>o({type:"sellCall",lot:Y}),onCloseDialog:Y=>o({type:"closeLot",lot:Y}),onDialogDone:()=>o(null),onSellCall:(Y,le)=>R(le,`Sold ${le.symbol} ${le.strike}C ×${le.contracts} — Refresh marks to price.`),onCloseLot:async(Y,le,ee,lt)=>{await E(()=>aa(Y.id,le,ee,lt))&&(s(`Closed ${le} sh ${Y.symbol} — $${(le*ee).toFixed(2)} to the pool.`),o(null),await d())}})})),U}});const L=w==="puts"?G():fe();return f(k,{get when(){return L.length>0},get fallback(){return(()=>{var U=ii();return u(U,()=>se[w]),U})()},get children(){var U=Rh();return U.firstChild,u(U,f(re,{each:L,children:z=>f(jh,{x:z,get showPool(){return P().length>1},get pools(){return P()},onPoolChange:F,dialogFor:S,dialogActions:B,onClose:Y=>o({type:Y.p.kind,pos:Y.p})})}),null),U}})},Be=w=>f(k,{get when(){var L,U,z;return w==="lots"&&((L=a())==null?void 0:L.type)==="addLot"||w==="puts"&&((U=a())==null?void 0:U.type)==="addPut"||w==="calls"&&((z=a())==null?void 0:z.type)==="addCall"},keyed:!0,get children(){return w==="lots"?f(Gh,{get pools(){return P()},busy:l,onDone:()=>o(null),onAdd:L=>R(L,`Recorded ${L.shares} sh ${L.symbol}.`)}):f(zh,{kind:w==="puts"?"put":"call",get pools(){return P()},busy:l,onDone:()=>o(null),onAdd:L=>R(L,`Sold ${L.symbol} ${L.strike}${w==="puts"?"P":"C"} ×${L.contracts} — Refresh marks to price.`)})}}),st=w=>(()=>{var L=Oh(),U=L.firstChild;return U.$$click=()=>o({type:Fe[w].type}),u(U,()=>Fe[w].label),u(L,f(k,{when:w==="lots",get children(){var z=xh(),Y=z.firstChild;return u(z,()=>m().reduce((le,ee)=>le+ee.shares,0),Y),z}}),null),L})(),at=()=>(()=>{var w=Nh();return w.$$click=O,v(()=>w.disabled=l()),w})(),ot=()=>f(k,{get when(){return n()},get children(){var w=Dh();return u(w,n),w}});return(()=>{var w=Lh(),L=w.firstChild,U=L.firstChild;U.firstChild;var z=U.nextSibling,Y=z.firstChild,le=Y.firstChild;return u(U,f(Bh,{get cash(){var ee;return((ee=t())==null?void 0:ee.cash)??null},get reserved(){var ee;return((ee=t())==null?void 0:ee.cash_reserved)??0},get free(){var ee;return((ee=t())==null?void 0:ee.cash_free)??null},get pools(){return P()},get pool(){return V()},busy:l,onSaveCash:C,onSelectPool:N,onAddPool:Z,onRenamePool:ie,onDeletePool:he}),null),u(U,f(re,{get each(){return K()},children:ee=>(()=>{var lt=Mh(),Sn=lt.firstChild,gr=Sn.nextSibling,Cs=gr.nextSibling;return lt.$$click=()=>W(ee.id),u(Sn,()=>ee.label.toUpperCase()),u(gr,()=>ee.count),u(Cs,()=>ee.sub),v(()=>lt.classList.toggle("active",x()===ee.id)),lt})()}),null),u(le,()=>K().find(ee=>ee.id===x()).label),u(Y,at,null),u(z,ot,null),u(z,()=>st(x()),null),u(z,()=>Be(x()),null),u(z,()=>Ee(x()),null),w})()}we(["input","keydown","click"]);async function ef(t,e){let n;try{n=t.body.getReader()}catch{return"lost"}const r=new TextDecoder;let i="";try{for(;;){const{done:s,value:a}=await n.read();if(s)break;i+=r.decode(a,{stream:!0});let o;for(;(o=i.indexOf(`
-`))>=0;){const l=i.slice(0,o).replace(/\r$/,"");if(i=i.slice(o+1),!l.startsWith("data:"))continue;const c=l.slice(5).trim();if(c)try{e(JSON.parse(c))}catch{}}}return"completed"}catch{return"lost"}}var tf=g("<button type=button class=run-btn>"),nf=g("<span class=run-count>/"),rf=g("<span class=run-bar><span class=fill>"),sf=g("<li><span class=mark></span><span class=label>"),af=g("<div class=toast-cached>Served from cache — last run <!> min old"),of=g('<div class="toast-cached warn">'),lf=g("<div class=run-headline>"),cf=g("<ul class=run-stages>"),uf=g("<details class=run-errors><summary>details</summary><ul>"),df=g("<div class=run-warn>Closing this tab stops the run."),hf=g("<div class=run-warn>Re-checking every 15 s…"),ff=g("<div class=run-strip>"),gf=g("<li> ");const Ss=["quotes","metrics","chains_short","chains_medium"],ks={quotes:"Quotes",metrics:"Indicators",chains_short:"Chains · 5-day",chains_medium:"Chains · 20-day"},pf=15e3,Es=t=>t!==null&&Date.now()>=t;function si(t){const e=Math.floor(t/60),n=t%60;return`${e}:${String(n).padStart(2,"0")}`}function mf(t){const[e,n]=M("idle"),[r,i]=M(R()),[s,a]=M(null),[o,l]=M(0),[c,d]=M(null),[h,p]=M(null),[m,b]=M("");let T=null,_=null;const[S,E]=M(0);let O=null;et(()=>{const F=t();if(O&&(clearTimeout(O),O=null),(F==null?void 0:F.run_allowed)===!1){const I=pn(F.next_open_utc);I!==null&&(O=setTimeout(()=>E(B=>B+1),Math.max(0,I-Date.now())))}});function R(){return Object.fromEntries(Ss.map(F=>[F,{status:"pending",error:null}]))}function D(){T&&clearInterval(T),T=null,_&&clearInterval(_),_=null}function y(){l(0),T=setInterval(()=>l(F=>F+1),1e3)}function A(F){switch(F.type){case"stage_started":i(I=>({...I,[F.stage]:{status:"running",error:null}}));break;case"batch_done":a({stage:F.stage,done:F.done,total:F.total});break;case"stage_finished":i(I=>({...I,[F.stage]:{status:F.ok?"ok":"failed",error:F.error??null}}));break;case"run_finished":d(F);break}}function C(){D();const F=c(),I=((F==null?void 0:F.stages)??[]).some(B=>B.name.startsWith("chains")&&["ok","partial"].includes(B.status));n(F&&(I||F.ok)?"done":"failed"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"))}async function P(F){let I=!1;return await ef(F,B=>{A(B),B.type==="run_finished"&&(I=!0)}),I?(C(),!0):!1}async function $(F){n("detached"),_=setInterval(async()=>{var I,B,x;try{const W=await pi(),K=((B=(I=W==null?void 0:W.result)==null?void 0:I.run)==null?void 0:B.finished_at_utc)??null;if(K&&K!==F){i(N(W.result)),D(),n("done"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"));return}((x=W==null?void 0:W.run_state)==null?void 0:x.status)!=="running"&&(D(),n("idle"),b("Stream lost and the run was canceled — press Run to retry."))}catch{}},pf)}function N(F){const I=R();for(const B of(F==null?void 0:F.stages)??[])I[B.name]&&(I[B.name]={status:B.status,error:B.error});return I}async function V(){var x,W,K;if(["starting","running","detached"].includes(e()))return;b(""),d(null),a(null),i(R()),p(null);const F=((K=(W=(x=t())==null?void 0:x.result)==null?void 0:W.run)==null?void 0:K.finished_at_utc)??null;n("running"),y();let I;try{I=await na()}catch{D(),n("idle"),b("Run failed to start — network or server unreachable.");return}const B=I.headers.get("content-type")??"";if(I.ok&&B.includes("application/json")){const G=await I.json().catch(()=>null);if(D(),n("idle"),(G==null?void 0:G.status)==="cached"){p(G.age_secs),setTimeout(()=>p(null),6e3);return}}if(I.status===403&&B.includes("application/json")){const G=await I.json().catch(()=>null);D(),n("idle"),b(G!=null&&G.next_open_utc?`Off-market runs are hourly — the next unlocks at ${new Date(G.next_open_utc).toLocaleString()}.`:"Off-market runs are hourly — try again after the next hour mark.");return}if(I.status===202){const G=await ra();if(G.ok&&(G.headers.get("content-type")??"").includes("text/event-stream")){await P(G)||await $(F);return}await $(F);return}if(B.includes("text/event-stream")){await P(I)||await $(F);return}D(),n("idle"),b(`Unexpected /api/run response (${I.status}, ${B||"no type"}).`)}return Oe(()=>{D(),O&&clearTimeout(O)}),{phase:e,stageStates:r,batch:s,elapsedSecs:o,terminal:c,cachedToast:h,notice:m,triggerRun:V,isBusy:()=>["starting","running","detached"].includes(e()),runAllowed:()=>{S();const F=t();return(F==null?void 0:F.run_allowed)!==!1?!0:Es(pn(F==null?void 0:F.next_open_utc))},nextOpenUtc:()=>{var F;return((F=t())==null?void 0:F.next_open_utc)??null}}}function _f(t){const e=()=>!t.run.runAllowed(),n=()=>gs(t.run.nextOpenUtc()),r=()=>t.run.phase()==="running"?"Run…":t.run.phase()==="detached"?"Run in progress":e()?n()?`Run at ${n()}`:"Run locked":"▶ Run pipeline";return(()=>{var i=tf();return i.$$click=()=>t.run.triggerRun(),u(i,r),v(s=>{var a=t.run.isBusy()||e(),o=e()&&t.run.nextOpenUtc()?`Off-market runs are hourly — next unlocks at ${new Date(t.run.nextOpenUtc()).toLocaleString()}`:void 0;return a!==s.e&&(i.disabled=s.e=a),o!==s.t&&ne(i,"title",s.t=o),s},{e:void 0,t:void 0}),i})()}function bf(t){const e=()=>{const i=t.run.stageStates()[t.name].status;return i==="pending"?"pending":i==="running"?"active":i},n=()=>({ok:"✓",partial:"△",failed:"✗",active:"◦",pending:"·"})[e()],r=()=>{const i=t.run.batch();return i&&i.stage===t.name&&e()==="active"?Math.round(i.done/Math.max(i.total,1)*100):null};return(()=>{var i=sf(),s=i.firstChild,a=s.nextSibling;return u(s,n),u(a,()=>ks[t.name]),u(i,f(k,{get when(){return r()!==null},get children(){return[(()=>{var o=nf(),l=o.firstChild;return u(o,()=>t.run.batch().done,l),u(o,()=>t.run.batch().total,null),o})(),(()=>{var o=rf(),l=o.firstChild;return v(c=>tt(l,"width",`${r()}%`)),o})()]}}),null),v(()=>de(i,`run-stage ${e()}`)),i})()}function yf(t){const e=t.run,n=()=>e.terminal(),r=()=>{if(e.phase()==="detached")return"Stream lost — the run continues server-side and will be saved. Re-checking…";if(e.phase()==="running"&&!n())return["Running pipeline · elapsed ",q(()=>si(e.elapsedSecs()))];if(n()){const s=(n().stages??[]).some(a=>a.name.startsWith("chains")&&["ok","partial"].includes(a.status));return s&&n().ok?["Run finished ✓ · ",q(()=>si(Math.round(n().duration_secs)))]:s?"Run finished △ · what succeeded is shown below":"Run finished ✗ · nothing produced — retry allowed"}return""};return f(k,{get when(){return["running","detached"].includes(e.phase())||n()||e.cachedToast()||e.notice()},get children(){var i=ff();return u(i,f(k,{get when(){return e.cachedToast()},get children(){var s=af(),a=s.firstChild,o=a.nextSibling;return o.nextSibling,u(s,()=>Math.floor(e.cachedToast()/60),o),s}}),null),u(i,f(k,{get when(){return e.notice()},get children(){var s=of();return u(s,()=>e.notice()),s}}),null),u(i,f(k,{get when(){return["running","detached"].includes(e.phase())||n()},get children(){return[(()=>{var s=lf();return u(s,r),s})(),(()=>{var s=cf();return u(s,()=>Ss.map(a=>f(bf,{name:a,run:e}))),s})(),f(k,{get when(){return q(()=>!!n())()&&(n().stages??[]).some(s=>s.status!=="ok")},get children(){var s=uf(),a=s.firstChild,o=a.nextSibling;return u(o,()=>(n().stages??[]).filter(l=>l.status!=="ok").map(l=>(()=>{var c=gf(),d=c.firstChild;return u(c,()=>l.status==="partial"?"△":"✗",d),u(c,()=>ks[l.name]??l.name,null),u(c,(()=>{var h=q(()=>!!l.error);return()=>h()?`: ${l.error}`:""})(),null),c})())),s}})]}}),null),u(i,f(k,{get when(){return q(()=>e.phase()==="running")()&&!n()},get children(){return df()}}),null),u(i,f(k,{get when(){return e.phase()==="detached"},get children(){return hf()}}),null),i}})}we(["click"]);var Is=g("<b>"),vf=g("<span>Market closed · last run <b></b> ago"),wf=g("<div class=cache-line><span></span><span class=pill>run: "),$f=g("<span>Cached · <b></b> left"),Sf=g("<span>Stale · last run <b></b> ago"),kf=g("<nav class=tabs role=tablist aria-label=timeframes>"),Ef=g("<button type=button role=tab class=tab>"),If=g("<svg><circle cx=12 cy=12 r=4></svg>",!1,!0,!1),Cf=g('<svg><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></svg>',!1,!0,!1),Tf=g('<button type=button class="btn-ghost theme-toggle"><svg width=14 height=14 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true>'),Af=g('<svg><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></svg>',!1,!0,!1),Pf=g('<button type=button class="btn-ghost user-pill"aria-haspopup=menu><svg width=13 height=13 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx=12 cy=7 r=4></circle></svg><span class=user-email></span><span class=user-caret aria-hidden=true>▾'),Rf=g("<div class=pop-backdrop>"),xf=g("<div class=account-menu role=menu aria-label=account><div class=acct-label>Signed in as</div><div class=acct-email></div><button type=button class=btn-ghost role=menuitem>Manage access</button><button type=button class=btn-ghost role=menuitem>Sign out"),Of=g("<div class=error-banner>API error: "),Nf=g("<div class=shell><header><div class=user-box></div><div class=theme-slot-head></div><h1 class=brand><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><div class=run-slot-head>"),Df=g("<div class=hero><h2>No run yet</h2><p>Press <b>▶ Run pipeline</b> to pull quotes, compute max-drop bands / Sharpe / percentiles, then score every in-range put strike across the universe. A full run typically takes 4–7 minutes and streams live progress right here.</p><p class=muted-note>Demo data: point <code>webapp_result_file</code> (or <code>--result-file</code>) at <code>crates/webapp/fixtures/sample_last_run.json</code>.");function Lf(){const[t,e]=M(Nu()),n=r=>{e(r),Du(r)};return{visible:t,isOn:r=>t().includes(r),toggle:(r,i)=>n(i?[...t(),r]:t().filter(s=>s!==r)),reset:()=>n(Ct)}}function ai(t,e){var r;const n=(r=t==null?void 0:t.stages)==null?void 0:r.find(i=>i.name===e);return n&&n.status==="failed"?n.error??"failed":void 0}function Mf(t,e){var r,i,s;const n=(i=(r=t())==null?void 0:r.timeframes)==null?void 0:i[e];return((s=n==null?void 0:n.rows)==null?void 0:s.length)??(n==null?void 0:n.row_count)??0}function oi(t){const e=Math.floor(t/60);if(e<60)return`${e} min`;const n=Math.floor(e/60),r=e%60;return r?`${n} h ${r} min`:`${n} h`}function Vn(t){return f(k,{get when(){return t.at()},get children(){return[" ","· run ",(()=>{var e=Is();return u(e,()=>t.at()),e})()]}})}function Uf(t){const[e,n]=M(0);mt(()=>{const m=setInterval(()=>n(b=>b+1),3e4);Oe(()=>clearInterval(m))});let r=Date.now(),i=0;et(At(()=>t.envelope,m=>{r=Date.now(),i=(m==null?void 0:m.age_secs)??0}));const s=()=>(e(),i+Math.floor((Date.now()-r)/1e3)),a=()=>t.envelope.cache_state,o=()=>t.envelope.market_open===!1,l=()=>{const m=Math.max(0,(t.envelope.cache_secs??0)-s());return m>=60?`${Math.floor(m/60)}m`:`${m}s`},c=()=>{var m,b;return qu((b=(m=t.envelope.result)==null?void 0:m.run)==null?void 0:b.finished_at_utc)},d=()=>{e();const m=t.envelope.next_open_utc,b=pn(m);if(!(b===null||Es(b)))return gs(m)},h=()=>o()&&a()==="stale"?"closed":a(),p=()=>a()==="fresh"||a()==="stale";return(()=>{var m=wf(),b=m.firstChild,T=b.nextSibling;return T.firstChild,u(m,f(k,{get when(){return q(()=>!!o())()&&p()},get fallback(){return f(k,{get when(){return a()==="fresh"},get fallback(){return f(k,{get when(){return a()==="stale"},get children(){var _=Sf(),S=_.firstChild,E=S.nextSibling;return E.nextSibling,u(E,()=>oi(s())),u(_,f(Vn,{at:c}),null),_}})},get children(){var _=$f(),S=_.firstChild,E=S.nextSibling;return E.nextSibling,u(E,l),u(_,f(Vn,{at:c}),null),_}})},get children(){var _=vf(),S=_.firstChild,E=S.nextSibling;return E.nextSibling,u(E,()=>oi(s())),u(_,f(Vn,{at:c}),null),u(_,f(k,{get when(){return d()},get children(){return[" ","· next run ",(()=>{var O=Is();return u(O,d),O})()]}}),null),_}}),b),u(b,(()=>{var _=q(()=>h()==="closed");return()=>_()?"market closed":a()})()),u(T,()=>{var _;return((_=t.envelope.run_state)==null?void 0:_.status)??"idle"},null),v(()=>de(b,"pill "+h())),m})()}function li(t){const e=[{id:"short",label:"Short · 5-day"},{id:"medium",label:"Medium · 20-day"},{id:"holdings",label:"Holdings",holdings:!0}];return(()=>{var n=kf();return u(n,()=>e.map(r=>(()=>{var i=Ef();return i.$$click=()=>t.onTab(r.id),u(i,()=>r.label,null),u(i,(()=>{var s=q(()=>!r.holdings);return()=>s()&&` (${Tt(Mf(t.result,r.id))})`})(),null),v(s=>{var a=t.tab()===r.id,o=t.tab()===r.id;return a!==s.e&&ne(i,"aria-selected",s.e=a),o!==s.t&&i.classList.toggle("active",s.t=o),s},{e:void 0,t:void 0}),i})())),n})()}function Ff(){const[t,e]=M(null),n=()=>window.matchMedia("(prefers-color-scheme: dark)").matches,r=()=>t()??(n()?"dark":"light"),i=()=>{const a=r()==="dark"?"light":"dark";document.documentElement.dataset.theme=a,e(a)},s=()=>r()==="dark"?"Switch to light theme":"Switch to dark theme";return(()=>{var a=Tf(),o=a.firstChild;return a.$$click=i,u(o,f(k,{get when(){return r()==="dark"},get fallback(){return Af()},get children(){return[If(),Cf()]}})),v(l=>{var c=s(),d=s();return c!==l.e&&ne(a,"aria-label",l.e=c),d!==l.t&&ne(a,"title",l.t=d),l},{e:void 0,t:void 0}),a})()}function Bf(){const[t,e]=M(void 0),[n,{refetch:r}]=Ds(t,S=>S?pi():void 0);mt(()=>{if(!yt){e(null);return}const S=Vl(ut(),e);Oe(S)});const[i,s]=M(!1);et(At(t,S=>{s(!1),!(!S||!yt)&&Qs().then(E=>s(E.status===403)).catch(()=>{})})),mt(()=>{const S=()=>r();window.addEventListener("webapp:refresh-latest",S),Oe(()=>window.removeEventListener("webapp:refresh-latest",S))});const a=()=>{var S,E;return((S=t())==null?void 0:S.email)||((E=t())==null?void 0:E.uid)||""},[o,l]=M(!1),[c,d]=M(!1),h=Lf(),[p,m]=M("short"),b=()=>p()==="holdings",T=Ru(),_=mf(()=>n());return f(k,{get when(){return t()},get fallback(){return f(pu,{})},get children(){return[f(k,{get when(){return!i()},get fallback(){return f(gu,{get email(){return a()},onSignOut:()=>Xr()})},get children(){var S=Nf(),E=S.firstChild,O=E.firstChild,R=O.nextSibling,D=R.nextSibling,y=D.nextSibling;return u(O,f(k,{get when(){return t()},get children(){return[(()=>{var A=Pf(),C=A.firstChild,P=C.nextSibling;return A.$$click=()=>l(!o()),u(P,a),v(()=>ne(A,"aria-expanded",o())),A})(),f(k,{get when(){return o()},get children(){return[(()=>{var A=Rf();return A.$$click=()=>l(!1),A})(),(()=>{var A=xf(),C=A.firstChild,P=C.nextSibling,$=P.nextSibling,N=$.nextSibling;return u(P,a),$.$$click=()=>{l(!1),d(!0)},N.$$click=()=>{l(!1),Xr()},A})()]}})]}})),u(R,f(Ff,{})),u(E,f(k,{get when(){return q(()=>!n.loading)()&&!n.error},get children(){return f(Uf,{get envelope(){return n()}})}}),y),u(y,f(_f,{run:_})),u(S,f(k,{get when(){return n.error},get children(){var A=Of();return A.firstChild,u(A,()=>n.error.message,null),A}}),null),u(S,f(yf,{run:_}),null),u(S,f(k,{get when(){return b()},get children(){return[f(li,{result:()=>{var A;return(A=n())==null?void 0:A.result},tab:p,onTab:m}),f(Zh,{})]}}),null),u(S,f(k,{get when(){return!b()},get children(){return f(k,{get when(){var A;return q(()=>!n.loading)()&&((A=n())==null?void 0:A.result)},get fallback(){return f(k,{get when(){return!n.loading},get children(){return Df()}})},children:A=>{const C=()=>A();return[f(Ou,{scoring:T}),f(li,{result:C,tab:p,onTab:m}),f(ri,{id:"short",active:()=>p()==="short",get tf(){var P;return(P=C().timeframes)==null?void 0:P.short},get stageError(){return ai(C(),"chains_short")},get stages(){return C().stages},get thresholds(){return C().thresholds},columns:h,scoring:T}),f(ri,{id:"medium",active:()=>p()==="medium",get tf(){var P;return(P=C().timeframes)==null?void 0:P.medium},get stageError(){return ai(C(),"chains_medium")},get stages(){return C().stages},get thresholds(){return C().thresholds},columns:h,scoring:T})]}})}}),null),S}}),f(k,{get when(){return c()},get children(){return f(wu,{onClose:()=>d(!1)})}})]}})}we(["click"]);Ks(()=>f(Bf,{}),document.getElementById("root"));
+ */const cu=300,uu=Ii("authIdTokenMaxAge")||cu;let ti=null;const du=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>uu)return;const i=n==null?void 0:n.token;ti!==i&&(ti=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function hu(t=Ho()){const e=Ri(t,"auth");if(e.isInitialized())return e.getImmediate();const n=Nl(t,{popupRedirectResolver:su,persistence:[pc,rc,cs]}),r=Ii("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=du(s.toString());Ql(n,a,()=>a(n.currentUser)),Xl(n,o=>a(o))}}const i=Ia("auth");return i&&Dl(n,`http://${i}`),n}function fu(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}Cl({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=Ee("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",fu().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});lu("Browser");const gu={VITE_FIREBASE_API_KEY:"AIzaSyBtK1j6G7Mr22CT40I9aOn0TIq8BnnjNjA",VITE_FIREBASE_APP_ID:"1:971967977307:web:7751e467b279190596ec7e",VITE_FIREBASE_AUTH_DOMAIN:"market-int-1e5e4.firebaseapp.com",VITE_FIREBASE_PROJECT_ID:"market-int-1e5e4"},xe=gu,$t=!!xe.VITE_FIREBASE_APP_ID;let Wn=null;function ft(){if(!$t)throw new Error("Firebase auth is not configured: set VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_APP_ID");if(!Wn){const t=Ni({apiKey:xe.VITE_FIREBASE_API_KEY,authDomain:xe.VITE_FIREBASE_AUTH_DOMAIN,projectId:xe.VITE_FIREBASE_PROJECT_ID,appId:xe.VITE_FIREBASE_APP_ID,...xe.VITE_FIREBASE_STORAGE_BUCKET&&{storageBucket:xe.VITE_FIREBASE_STORAGE_BUCKET},...xe.VITE_FIREBASE_MESSAGING_SENDER_ID&&{messagingSenderId:xe.VITE_FIREBASE_MESSAGING_SENDER_ID}});Wn=hu(t)}return Wn}function ni(){return new Re}async function ri(){if(!$t)return;const t=ft();t.currentUser&&await ec(t)}var pu=p(`<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><p>Signed in as <b></b> — this account isn't authorized for this deployment.</p><p class=gate-note>Ask the owner to add your address to the allow list, or sign out to use a different account.</p><button type=button class="btn btn-primary"style=margin-top:12px>Sign out`),mu=p('<form><label class=gate-label>Email<input type=email required autocomplete=email placeholder=you@example.com></label><label class=gate-label>Password<input type=password required placeholder=••••••••></label><button type=submit class="btn btn-primary">'),_u=p("<button type=button class=gate-toggle>"),bu=p("<div class=gate-or>── or ──"),vu=p("<button type=button class=btn>Continue with Google"),yu=p("<div class=gate-error role=alert>"),wu=p("<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates"),$u=p("<p>Authentication is not configured — sign-in cannot start. Point <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_PROJECT_ID</code> and <code>VITE_FIREBASE_APP_ID</code> at a provisioned Firebase project (checklist: crates/webapp/README.md), rebuild <code>npm run build</code>, then reload."),Su=p("<p class=gate-note>The server itself still answers: its API stays open until it boots with a Firebase project id of its own.");const ku={"auth/invalid-credential":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/email-already-in-use":"That email already has an account — switch to Sign in.","auth/weak-password":"Password is too weak — use at least 6 characters.","auth/unauthorized-domain":"This domain isn't authorized in the Firebase console yet.","auth/popup-closed-by-user":"Google sign-in cancelled — popup closed.","auth/popup-blocked":"The browser blocked the sign-in popup — allow popups for this site, or use email sign-in.","auth/operation-not-allowed":"Email/password sign-in isn't enabled for this app yet.","auth/too-many-requests":"Too many attempts — wait a moment and try again.","auth/network-request-failed":"Network problem — check your connection and try again."};function ii(t){const e=(t==null?void 0:t.code)??"";return ku[e]??`Sign-in failed${e?` (${e})`:""} — check your details and try again.`}function Eu(t){return(()=>{var e=pu(),n=e.firstChild,r=n.firstChild,i=r.nextSibling,s=i.firstChild,a=s.nextSibling,o=i.nextSibling,l=o.nextSibling;return c(a,()=>t.email),G(l,"click",t.onSignOut),e})()}function Cu(){const[t,e]=M("signin"),[n,r]=M(""),[i,s]=M(""),[a,o]=M(!1),[l,u]=M("");la(async g=>{if(!$t)return null;const _=ft().currentUser;return _?await _.getIdToken(g):null});async function d(g){if(g.preventDefault(),!a()){o(!0),u("");try{const _=ft();t()==="create"?await Jl(_,n(),i()):await Yl(_,n(),i())}catch(_){u(ii(_))}finally{o(!1)}}}async function h(){if(!a()){o(!0),u("");try{await yc(ft(),ni())}catch(g){if(new Set(["auth/popup-blocked","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"]).has(g==null?void 0:g.code)){await Cc(ft(),ni());return}u(ii(g))}finally{o(!1)}}}return(()=>{var g=wu(),_=g.firstChild;return _.firstChild,c(_,f(S,{when:$t,get fallback(){return[$u(),Su()]},get children(){return[(()=>{var b=mu(),T=b.firstChild,m=T.firstChild,v=m.nextSibling,P=T.nextSibling,D=P.firstChild,R=D.nextSibling,O=P.nextSibling;return b.addEventListener("submit",d),v.$$input=x=>r(x.currentTarget.value),R.$$input=x=>s(x.currentTarget.value),c(O,(()=>{var x=Y(()=>!!a());return()=>x()?"Working…":t()==="create"?"Create account":"Sign in"})()),w(x=>{var $=t()==="create"?"new-password":"current-password",A=a();return $!==x.e&&ae(R,"autocomplete",x.e=$),A!==x.t&&(O.disabled=x.t=A),x},{e:void 0,t:void 0}),w(()=>v.value=n()),w(()=>R.value=i()),b})(),(()=>{var b=_u();return b.$$click=()=>{u(""),e(t()==="create"?"signin":"create")},c(b,()=>t()==="create"?"⇄ Have an account? Sign in":"⇄ Need an account? Create one"),w(()=>b.disabled=a()),b})(),bu(),(()=>{var b=vu();return b.$$click=h,w(()=>b.disabled=a()),b})(),f(S,{get when(){return l()},get children(){var b=yu();return c(b,l),b}})]}}),null),g})()}Ce(["click","input"]);var Iu=p("<div class=gate-error role=alert>"),Tu=p("<p class=gate-note>No grant-file entries yet."),Pu=p("<p class=gate-note>Also allowed via WEBAPP_OWNER_EMAILS: "),Au=p('<div class=modal-backdrop><div class="gate-card access-card"role=dialog aria-modal=true aria-label="Access control"><h1 class=gate-title>Access control</h1><p class=gate-note>Emails allowed to use this webapp. Changes apply immediately.</p><form class=access-add><input type=email placeholder=new.email@host aria-label="email to allow"required><button type=submit class="btn btn-primary"></button></form><button type=button class=btn style=margin-top:12px;width:100%>Close'),xu=p("<div class=access-row><span class=access-email></span><button type=button class=access-remove>✕");function Ru(t){const[e,n]=M([]),[r,i]=M([]),[s,a]=M(""),[o,l]=M(!1),[u,d]=M(""),h=m=>{n((m==null?void 0:m.file_grants)??[]),i((m==null?void 0:m.static_emails)??[])};vt(async()=>{try{h(await ua())}catch{d("Could not load the grant list.")}});const _=m=>{m.key==="Escape"&&t.onClose()};vt(()=>{window.addEventListener("keydown",_),Fe(()=>window.removeEventListener("keydown",_));const m=document.querySelector(".access-add input");m==null||m.focus()});const b=async m=>{if(m.preventDefault(),!(o()||!s().trim())){l(!0),d("");try{h(await da(s())),a("")}catch(v){d(v.message)}l(!1)}},T=async m=>{if(!o()){l(!0),d("");try{h(await ha(m))}catch(v){d(v.message)}l(!1)}};return(()=>{var m=Au(),v=m.firstChild,P=v.firstChild,D=P.nextSibling,R=D.nextSibling,O=R.firstChild,x=O.nextSibling,$=R.nextSibling;return G(m,"click",t.onClose),v.$$click=A=>A.stopPropagation(),c(v,f(S,{get when(){return u()},get children(){var A=Iu();return c(A,u),A}}),R),c(v,f(se,{get each(){return e()},children:A=>(()=>{var N=xu(),I=N.firstChild,k=I.nextSibling;return c(I,A),k.$$click=()=>T(A),ae(k,"title",`Remove ${A}`),ae(k,"aria-label",`Remove ${A}`),w(()=>k.disabled=o()),N})()}),R),c(v,f(S,{get when(){return e().length===0},get children(){return Tu()}}),R),R.addEventListener("submit",b),O.$$input=A=>a(A.currentTarget.value),c(x,()=>o()?"…":"Add"),c(v,f(S,{get when(){return r().length>0},get children(){var A=Pu();return A.firstChild,c(A,()=>r().join(", "),null),A}}),$),G($,"click",t.onClose),w(()=>x.disabled=o()),w(()=>O.value=s()),m})()}Ce(["click","input"]);const Le=Object.freeze({weightSharpe:.2,weightSafety:.4,weightReturn:.4,weightTrend:0,minRateOfReturn:.2,idealReturn:.8,trendScoreFloor:1.02,trendScoreBand:.06,earningsSafetyMultiplier:.5,topPicksCount:3}),Lt=(t,e,n)=>Math.min(n,Math.max(e,t));function Nu(t,e,n){const r=n-e;return Math.abs(r)<1e-9?.5:Lt((n-t)/r,0,1)}function Ou(t,e,n,r,i=Le){if(n<i.minRateOfReturn||t<=0)return null;const s=Lt(t/2,0,1),a=Lt(e,0,1),o=Math.min(n/i.idealReturn,1),l=Lt((r-i.trendScoreFloor)/i.trendScoreBand,0,1),u={sharpe:i.weightSharpe*s,safety:i.weightSafety*a,return:i.weightReturn*o,trend:i.weightTrend*l};return u.total=u.sharpe+u.safety+u.return+u.trend,u}function Du(t,e=Le){const n=t.rate_of_return;if(n==null||!Number.isFinite(n))return null;const r=t.sharpe_ratio??0,i=t.trend_short??0,s=t.earnings_before_expiry!=null;let a=t.delta!=null?Lt(1+t.delta,0,1):Nu(t.strike,t.strike_from,t.strike_to);return s&&(a*=e.earningsSafetyMultiplier),Ou(r,a,n,i,e)}function Lu(t,e=Le.topPicksCount){const n=t.map((a,o)=>({...a,i:o})).filter(a=>a.score!=null).sort((a,o)=>o.score-a.score||a.i-o.i),r=new Set,i=new Set,s=[];for(const a of n){if(s.length>=e)break;const{row:o}=a;r.has(o.underlying)||o.sector!=="Unknown"&&i.has(o.sector)||(r.add(o.underlying),o.sector!=="Unknown"&&i.add(o.sector),s.push(a))}return s}function Mu(t){return t.weightSharpe===Le.weightSharpe&&t.weightSafety===Le.weightSafety&&t.weightReturn===Le.weightReturn&&t.minRateOfReturn===Le.minRateOfReturn}var Uu=p("<span class=hint>production defaults · drag to re-rank live"),Fu=p("<details class=adjust><summary>Adjust scoring </summary><div class=adjust-body><button type=button class=reset>Reset to production defaults"),Bu=p('<span class="hint hint-custom">custom weights'),Hu=p("<div class=ctl><label> <span class=val></span></label><input type=range min=0>");function Vu(){const[t,e]=M({...Le});return{params:t,isCustom:()=>!Mu(t()),setParam:(n,r)=>e(i=>({...i,[n]:r})),reset:()=>e({...Le})}}const Wu=[{key:"weightSharpe",label:"Sharpe weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightSafety",label:"Safety weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightReturn",label:"Return weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"minRateOfReturn",label:"Min rate-of-return floor",max:.5,step:.01,fmt:t=>`${Math.round(t*100)}%`,weight:!1}];function ju(t){const e=()=>t.scoring.isCustom(),n=()=>{const r=t.scoring.params();return r.weightSharpe+r.weightSafety+r.weightReturn||1};return(()=>{var r=Fu(),i=r.firstChild;i.firstChild;var s=i.nextSibling,a=s.firstChild;return c(i,f(S,{get when(){return!e()},get fallback(){return Bu()},get children(){return Uu()}}),null),c(s,f(se,{each:Wu,children:o=>(()=>{var l=Hu(),u=l.firstChild,d=u.firstChild,h=d.nextSibling,g=u.nextSibling;return c(u,()=>o.label,d),c(h,()=>o.fmt(t.scoring.params()[o.key]),null),c(h,f(S,{get when(){return o.weight},get children(){return[" ","· ",Y(()=>Math.round(t.scoring.params()[o.key]/n()*100)),"% of weight"]}}),null),g.$$input=_=>t.scoring.setParam(o.key,Number(_.currentTarget.value)),w(_=>{var b=o.max,T=o.step;return b!==_.e&&ae(g,"max",_.e=b),T!==_.t&&ae(g,"step",_.t=T),_},{e:void 0,t:void 0}),w(()=>g.value=t.scoring.params()[o.key]),l})()}),a),a.$$click=()=>t.scoring.reset(),w(()=>r.open=e()),r})()}Ce(["click","input"]);const Pn=[{id:"underlying",label:"Underlying",kind:"text",align:"left"},{id:"sector",label:"Sector",kind:"text",align:"left"},{id:"strike",label:"Strike",kind:"fixed2",align:"num"},{id:"expiration",label:"Expiry",kind:"date",align:"left"},{id:"bid",label:"Bid",kind:"fixed2",align:"num"},{id:"mid",label:"Mid",kind:"fixed2",align:"num"},{id:"ask",label:"Ask",kind:"fixed2",align:"num"},{id:"rate_of_return",label:"ROR",kind:"pct1",align:"num"},{id:"score",label:"Score",kind:"fixed3",align:"num"},{id:"delta",label:"Delta",kind:"fixed3",align:"num"},{id:"iv_rv_ratio",label:"IV/RV",kind:"ivrv",align:"num"},{id:"realized_vol",label:"Realized vol",kind:"fixed3",align:"num"},{id:"price_percentile",label:"Price pctl",kind:"pct0",align:"num"},{id:"underlying_price",label:"Spot",kind:"fixed2",align:"num"},{id:"bid_size",label:"Bid sz",kind:"int",align:"num"},{id:"ask_size",label:"Ask sz",kind:"int",align:"num"},{id:"volume",label:"Volume",kind:"int",align:"num"},{id:"open_interest",label:"Open int",kind:"int",align:"num"},{id:"strike_from",label:"Band lo",kind:"fixed2",align:"num"},{id:"strike_to",label:"Band hi",kind:"fixed2",align:"num"},{id:"sharpe_ratio",label:"Sharpe",kind:"fixed3",align:"num"},{id:"strike_percentile",label:"Strike pctl",kind:"fixed3",align:"num"},{id:"earnings_before_expiry",label:"Earnings",kind:"earnings",align:"left"},{id:"trend_short",label:"Trend 20",kind:"fixed3",align:"num"},{id:"trend_long",label:"Trend 50",kind:"fixed3",align:"num"},{id:"implied_vol",label:"Implied vol",kind:"fixed3",align:"num"}],Rt=["underlying","sector","strike","expiration","bid","mid","ask","rate_of_return","score","delta","iv_rv_ratio","realized_vol","price_percentile"],vs="webapp.columns.v1";function zu(){try{const t=localStorage.getItem(vs);if(!t)return Rt;const e=JSON.parse(t);if(!Array.isArray(e))return Rt;const n=new Set(Pn.map(i=>i.id)),r=e.filter(i=>n.has(i));return r.length>0?[...new Set(r)]:Rt}catch{return Rt}}function Gu(t){try{localStorage.setItem(vs,JSON.stringify(t))}catch{}}var qu=p("<div class=pop-backdrop>"),Ku=p('<div class=picker-panel role=menu aria-label="visible columns"><div class=picker-grid></div><button type=button class=linklike>Reset defaults'),Ju=p("<span class=colpicker><button type=button class=tool-btn>columns ▾"),Yu=p("<label class=pick-item><input type=checkbox>");function Xu(t){const[e,n]=M(!1);return(()=>{var r=Ju(),i=r.firstChild;return i.$$click=()=>n(!e()),c(r,f(S,{get when(){return e()},get children(){return[(()=>{var s=qu();return s.$$click=()=>n(!1),s})(),(()=>{var s=Ku(),a=s.firstChild,o=a.nextSibling;return c(a,f(se,{each:Pn,children:l=>(()=>{var u=Yu(),d=u.firstChild;return d.addEventListener("change",h=>t.store.toggle(l.id,h.currentTarget.checked)),c(u,()=>l.label,null),w(()=>d.checked=t.store.isOn(l.id)),u})()})),o.$$click=()=>t.store.reset(),s})()]}}),null),w(()=>ae(i,"aria-expanded",e())),r})()}Ce(["click"]);var Qu=p('<div class=pager role=navigation aria-label="table pagination"><span class=pager-label>page <!> / </span><button type=button class=pgbtn aria-label="previous page">‹</button><button type=button class=pgbtn aria-label="next page">›'),Zu=p("<span class=pggap>…"),ed=p("<button type=button class=pgbtn>");function td(t,e){const n=Math.max(e,1),r=Math.min(Math.max(t,1),n);if(n<=7)return Array.from({length:n},(l,u)=>u+1);const s=[...new Set([1,2,r-1,r,r+1,n-1,n])].filter(l=>l>=1&&l<=n).sort((l,u)=>l-u),a=[];let o=0;for(const l of s)l-o>1&&a.push("…"),a.push(l),o=l;return a}function nd(t){const e=he(()=>td(t.page(),t.pageCount())),n=()=>t.onGo(Math.max(1,t.page()-1)),r=()=>t.onGo(Math.min(t.pageCount(),t.page()+1));return(()=>{var i=Qu(),s=i.firstChild,a=s.firstChild,o=a.nextSibling;o.nextSibling;var l=s.nextSibling,u=l.nextSibling;return c(s,()=>t.page(),o),c(s,()=>t.pageCount(),null),l.$$click=n,c(i,f(se,{get each(){return e()},children:d=>d==="…"?Zu():(()=>{var h=ed();return h.$$click=()=>t.onGo(d),c(h,d),w(()=>h.classList.toggle("active",d===t.page())),h})()}),u),u.$$click=r,w(d=>{var h=t.page()<=1,g=t.page()>=t.pageCount();return h!==d.e&&(l.disabled=d.e=h),g!==d.t&&(u.disabled=d.t=g),d},{e:void 0,t:void 0}),i})()}Ce(["click"]);var rd=p("<span class=tip>");function Ct(t){let e;const n=()=>{if(!e)return;const r=e.getBoundingClientRect(),i=r.right+352;e.classList.toggle("tip-flip",i>window.innerWidth&&r.left>352)};return(()=>{var r=rd();r.$$focusin=n,r.addEventListener("pointerenter",n);var i=e;return typeof i=="function"?aa(i,r):e=r,c(r,()=>t.children),w(()=>ae(r,"data-tip",t.text??"")),r})()}Ce(["focusin"]);const ot="∅";function le(t){return t==null||typeof t=="number"&&!Number.isFinite(t)}function Nt(t){return Number(t??0).toLocaleString("en-US")}function wn(t){if(!t)return null;const e=new Date(t).getTime();return Number.isNaN(e)?null:e}function ys(t){return ws(t,{hour:"2-digit",minute:"2-digit"})}function id(t){return ws(t,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function ws(t,e){const n=wn(t);if(n!==null)try{return new Intl.DateTimeFormat(void 0,{...e,hourCycle:"h23",timeZoneName:"short"}).format(n)}catch{return}}const $s={text:ot,isNull:!0},jn=(t,e)=>({text:Number(t).toFixed(e),isNull:!1});function si(t,e){return!e||le(t)?null:t>=e.vol_tier_high?"green":t>=e.vol_tier_mid?"yellow":"red"}function sd(t,e){return!e||le(t)?null:t>e.momentum_extended?"EXTENDED":t>e.momentum_high?"HIGH":"NORMAL"}function ad(t){if(!t||typeof t!="object"||le(t.report_date))return $s;const e=typeof t.report_time=="string"?` (${t.report_time.replaceAll("_"," ")})`:"";return{text:`⚠ ${t.report_date}${e}`,isNull:!1}}function we(t,e){if(le(e))return $s;switch(t){case"fixed2":return jn(e,2);case"fixed3":return jn(e,3);case"ivrv":return jn(e,2);case"pct1":return{text:`${(e*100).toFixed(1)}%`,isNull:!1};case"pct0":return{text:`${Math.round(e*100)}%`,isNull:!1};case"int":return{text:Number(e).toLocaleString("en-US"),isNull:!1};case"earnings":return ad(e);default:return{text:String(e),isNull:!1}}}const ai=t=>Number(t*100).toFixed(0);function od(t){const e=t??{},n=e.vol_tier_high??"?",r=e.vol_tier_mid??"?",i=ai(e.momentum_high),s=ai(e.momentum_extended);return{underlying:`The stock this put is written on. The colored dot is the realized-vol tier: green ≥ ${n}, yellow ${r}–${n}, red < ${r} — higher vol pays richer premium at matched assignment risk.`,sector:"GICS sector from symbols.csv. Context for diversification; not used in scoring.",strike:"Price you would buy the stock at if assigned. Deeper (lower) strikes are safer but pay less premium.",underlying_price:"Latest close of the underlying stock.",bid:"Best price a buyer will pay — the conservative fill for a seller.",mid:"(bid + ask) / 2 — the premium used for scoring, assuming half the spread is crossed.",ask:"Best price a seller demands.",bid_size:"Contracts quoted at the bid — a liquidity and depth signal.",ask_size:"Contracts quoted at the ask — a liquidity and depth signal.",expiration:"Contract expiry date. Short tab targets ~5–7 days to expiry, Medium ~20–28.",volume:"Option contracts traded today.",open_interest:"Option contracts still open — liquidity and positioning.",rate_of_return:"Annualized premium yield: mid ÷ strike scaled to a year. The pre-filter requires ≥ 30%.",strike_from:"Lower edge of the scored strike band, from 5/20-day max-drop stats. Below it the premium is too thin.",strike_to:"Upper edge of the scored strike band. Above it you are too close to spot for the premium.",sharpe_ratio:"Risk-adjusted drift of the underlying. 20% of the score; the pre-filter requires > 0.",strike_percentile:"Where the strike sits in the 20-day price range (0 = bottom, 1 = top). Blank when no 20-day range exists.",score:"Composite pick score: 20% Sharpe + 40% band safety (delta-aware, earnings-discounted) + 40% closeness of ror to the 0.80 ideal.",price_percentile:`Where spot sits in its 20-day range. Above the ${i}th percentile = HIGH momentum, above the ${s}th = EXTENDED.`,earnings_before_expiry:"The company reports earnings before this option expires — safety is discounted when set.",trend_short:"price ÷ EMA20. Above 1 means price is above its 20-day average — an independent breach-risk signal.",trend_long:"price ÷ EMA50. Same idea on the 50-day average.",realized_vol:"20-day annualized realized volatility of the underlying — the vol-tier input.",implied_vol:"Volatility the option market is pricing into this contract.",delta:"Put delta from Tiger (Black-Scholes fallback): roughly assignment probability with a minus sign, e.g. −0.21 ≈ 21%. Deeper real delta also boosts the safety score.",iv_rv_ratio:"Implied ÷ realized volatility. Above 1 the market prices more fear than realized — a premium-richness signal that boosts safety past a threshold.",band_range:"The scored strike band, derived from max-drop stats — the shaded range in the chart above.",band_depth:"How deep the strike sits inside the band (1 = at the safe bottom). Feeds the 40% safety component.",cushion_be:"How far spot can fall before hitting break-even, as % of spot.",capital:"Cash collateral if assigned: strike × 100 shares.",premium:"Premium collected up front: mid × 100.",breakeven:"strike − mid. The stock can fall to this price before the position loses money.",ann_ror:"Annualized premium yield — same number as the ror column.",sb_sharpe:"20% weight — Sharpe clamped to [0, 2].",sb_safety:"40% weight — band position, boosted by deep real delta or high IV/RV, discounted when earnings fall inside the window.",sb_ret:"40% weight — annualized ror closest to the 0.80 ideal scores highest."}}function It(t,e){return od(e)[t]??t}var Ss=p("<span class=tip-target>"),ld=p("<div class=kv><span class=kv-label></span><span class=kv-value>"),cd=p("<span class=tip-target>Strike position in band"),ud=p('<div class=band-chart role=img aria-label="strike position inside scored band"><div class=band-shade>'),dd=p("<div class=exp-block><h4>"),hd=p("<div class=kv-value>Band unavailable (∅)"),fd=p("<div><span class=marker-tick></span><span class=marker-cap><br>"),gd=p("<div class=exp-block><h4>Premium economics"),pd=p("<b>"),md=p('<div class="bar-row total"><span class=bar-label>total</span><span class="num bar-val"><b>'),_d=p("<div class=muted-note>earnings-discounted safety applied"),bd=p("<div class=exp-block><h4>Score breakdown"),vd=p("<div class=kv><span class=kv-label>score</span><span class=kv-value><b></b></span><span class=muted-note>breakdown unavailable for this row"),yd=p('<div class=bar-row><span class=bar-label> <span class=bar-weight>(<!>%)</span></span><span class=bar-track><span class=bar-fill></span></span><span class="num bar-val">'),wd=p("<span class=muted-note>all columns visible"),$d=p('<div class="exp-block exp-chips"><h4>Hidden columns'),Sd=p("<span class=tip-target>: "),kd=p("<span>"),Ed=p("<span class=tip-target>band safety is already discounted by the earnings rule."),Cd=p("<div class=earnings-banner>⚠ Earnings <b></b> (<!>)<!> — "),Id=p("<div class=expansion><div class=exp-grid>");const zn={sharpe:.2,safety:.4,return_part:.4};function Gn(t,e=2){return le(t)?ot:`$${Number(t).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})}`}function Te(t,e,n){return(()=>{var r=ld(),i=r.firstChild,s=i.nextSibling;return c(i,f(Ct,{get text(){return It(t,e)},get children(){var a=Ss();return c(a,()=>t.replace(/_/g," ")),a}})),c(s,n),r})()}function Td(t){const e=t.row,n=e.strike_to-e.strike_from,r=n>0?(e.strike_to-e.strike)/n:null,i=le(e.mid)?null:e.strike-e.mid,s=i!=null&&!le(e.underlying_price)&&e.underlying_price!==0?(e.underlying_price-i)/e.underlying_price*100:null,a=e.strike_from,o=Math.max(e.underlying_price??e.strike_to,e.strike_to)*1.005,l=Math.max(o,a),u=!le(a)&&l>a&&!le(e.strike),d=g=>{if(le(g))return null;const _=(g-a)/(l-a)*100;return Math.min(100,Math.max(0,_))},h=u?[{cls:"mk-strike",label:"strike",v:e.strike},{cls:"mk-spot",label:"spot",v:e.underlying_price}].filter(g=>d(g.v)!=null):[];return(()=>{var g=dd(),_=g.firstChild;return c(_,f(Ct,{get text(){return It("band_range",t.thresholds)},get children(){return cd()}})),c(g,f(S,{when:u,get fallback(){return hd()},get children(){var b=ud(),T=b.firstChild;return c(b,f(se,{each:h,children:m=>(()=>{var v=fd(),P=v.firstChild,D=P.nextSibling,R=D.firstChild;return c(D,()=>m.label,R),c(D,()=>we("fixed2",m.v).text,null),w(O=>{var x=`marker ${m.cls}`,$=`${d(m.v)}%`;return x!==O.e&&ye(v,O.e=x),$!==O.t&&at(v,"left",O.t=$),O},{e:void 0,t:void 0}),v})()}),null),w(m=>{var v=`${d(e.strike_from)}%`,P=`${Math.max(0,d(e.strike_to)-d(e.strike_from))}%`;return v!==m.e&&at(T,"left",m.e=v),P!==m.t&&at(T,"width",m.t=P),m},{e:void 0,t:void 0}),b}}),null),c(g,()=>Te("band_range",t.thresholds,`${we("fixed2",e.strike_from).text} → ${we("fixed2",e.strike_to).text}`),null),c(g,()=>Te("band_depth",t.thresholds,r==null?ot:`${(r*100).toFixed(1)}%`),null),c(g,()=>Te("cushion_be",t.thresholds,s==null?ot:`${s.toFixed(1)}%`),null),g})()}function Pd(t){const e=t.row,n=le(e.strike)?null:e.strike*100,r=le(e.mid)?null:e.mid*100,i=r==null?null:e.strike-e.mid,s=we("pct1",e.rate_of_return);return(()=>{var a=gd();return a.firstChild,c(a,()=>Te("capital",t.thresholds,n==null?ot:Gn(n,0)),null),c(a,()=>Te("premium",t.thresholds,r==null?ot:Gn(r)),null),c(a,()=>Te("breakeven",t.thresholds,i==null?ot:Gn(i)),null),c(a,()=>Te("ann_ror",t.thresholds,(()=>{var o=pd();return c(o,()=>s.text),o})()),null),c(a,()=>Te("bid",t.thresholds,we("fixed2",e.bid).text),null),c(a,()=>Te("ask",t.thresholds,we("fixed2",e.ask).text),null),c(a,()=>Te("expiration",t.thresholds,e.expiration),null),a})()}function Ad(t){const e=t.row,n=e.score_components,r=[{key:"sb_sharpe",label:"Sharpe",weight:zn.sharpe,v:n==null?void 0:n.sharpe},{key:"sb_safety",label:"Band safety",weight:zn.safety,v:n==null?void 0:n.safety},{key:"sb_ret",label:"Return vs ideal",weight:zn.return_part,v:n==null?void 0:n.return}];return(()=>{var i=bd();return i.firstChild,c(i,f(S,{when:n,get fallback(){return(()=>{var s=vd(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return c(l,()=>we("fixed3",e.score).text),s})()},get children(){return[f(se,{each:r,children:s=>{const a=le(s.v)||s.weight===0?null:s.v/s.weight;return(()=>{var o=yd(),l=o.firstChild,u=l.firstChild,d=u.nextSibling,h=d.firstChild,g=h.nextSibling;g.nextSibling;var _=l.nextSibling,b=_.firstChild,T=_.nextSibling;return c(l,f(Ct,{get text(){return It(s.key,t.thresholds)},get children(){var m=Ss();return c(m,()=>s.label),m}}),u),c(d,()=>s.weight*100,g),c(T,()=>we("fixed3",s.v).text),w(m=>at(b,"width",`${Math.min(100,Math.max(0,(a??0)*100))}%`)),o})()}}),(()=>{var s=md(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return c(l,()=>we("fixed3",e.score).text),s})(),f(S,{get when(){return e.earnings_before_expiry},get children(){return _d()}})]}}),null),i})()}function xd(t){const e=()=>t.hiddenDefs.map(n=>({def:n,cell:we(n.kind,n.id==="earnings_before_expiry"?t.row.earnings_before_expiry:t.row[n.id])}));return(()=>{var n=$d();return n.firstChild,c(n,f(se,{get each(){return e()},children:({def:r,cell:i})=>(()=>{var s=kd();return c(s,f(Ct,{get text(){return It(r.id,t.thresholds)},get children(){var a=Sd(),o=a.firstChild;return c(a,()=>r.label,o),c(a,()=>i.text,null),a}})),w(()=>ye(s,`chip-hidden${i.isNull?" is-null":""}`)),s})()}),null),c(n,f(S,{get when(){return t.hiddenDefs.length===0},get children(){return wd()}}),null),n})()}function Rd(t){const e=t.row,n=e.earnings_before_expiry;return(()=>{var r=Id(),i=r.firstChild;return c(r,f(S,{when:n,get children(){var s=Cd(),a=s.firstChild,o=a.nextSibling,l=o.nextSibling,u=l.nextSibling,d=u.nextSibling,h=d.nextSibling;return h.nextSibling,c(o,()=>n.report_date),c(s,f(S,{get when(){return n.report_time},children:g=>g().replaceAll("_"," ")}),u),c(s,f(S,{get when(){return!le(n.expected_eps)},get children(){return[" ","· expected EPS ",Y(()=>we("fixed2",n.expected_eps).text)]}}),h),c(s,f(Ct,{get text(){return It("earnings_before_expiry",t.thresholds)},get children(){return Ed()}}),null),s}}),i),c(i,f(Td,{row:e,get thresholds(){return t.thresholds}}),null),c(i,f(Pd,{row:e,get thresholds(){return t.thresholds}}),null),c(i,f(Ad,{row:e,get thresholds(){return t.thresholds}}),null),c(i,f(xd,{row:e,get hiddenDefs(){return t.hiddenDefs},get thresholds(){return t.thresholds}}),null),r})()}var Nd=p("<span class=null-mark>"),Od=p("<span class=star>★"),Dd=p("<td><b>"),qn=p("<span>"),oi=p("<td class=num>"),Ld=p("<span class=score-frozen>prod "),Md=p('<td class="num score-cell">'),Ud=p('<span class="score-frozen readmit">re-admitted'),Fd=p("<td>"),Bd=p("<table><thead><tr><th class=exp-col aria-hidden=true></th></tr></thead><tbody>"),Hd=p("<span class=sort-arrow>"),Vd=p("<span class=tip-target>"),Wd=p("<th role=button tabindex=0>"),jd=p("<tr class=expandable><td class=exp-col>"),zd=p("<tr class=exp-row><td>");const Gd=t=>`${t.underlying}|${t.strike}`;function qd(t){return(()=>{var e=Nd();return c(e,()=>t.text),e})()}function Zt(t){const e=we(t.kind,t.value);return f(S,{get when(){return!e.isNull},get fallback(){return f(qd,{get text(){return e.text}})},get children(){return e.text}})}function Kd(t){const e=t.col,n=t.row;return e.id==="underlying"?(()=>{var r=Dd(),i=r.firstChild;return c(r,f(S,{get when(){return t.pickRank!=null},get children(){var s=Od();return s.firstChild,c(s,()=>t.pickRank,null),s}}),i),c(i,()=>n.underlying),c(r,f(S,{get when(){return si(n.realized_vol,t.thresholds)},children:s=>[" ",(()=>{var a=qn();return w(()=>ye(a,`dot ${s()}`)),a})()]}),null),r})():e.id==="realized_vol"?(()=>{var r=oi();return c(r,f(S,{get when(){return si(n.realized_vol,t.thresholds)},children:i=>[(()=>{var s=qn();return w(()=>ye(s,`dot ${i()}`)),s})()," "]}),null),c(r,f(Zt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),r})():e.id==="score"?(()=>{var r=Md();return c(r,f(Zt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),c(r,f(S,{get when(){var i;return(i=t.customScores)==null?void 0:i.call(t)},get children(){return f(S,{get when(){return!le(n.frozen_score)},get fallback(){return f(S,{get when(){return!le(n.score)},get children(){return Ud()}})},get children(){var i=Ld();return i.firstChild,c(i,()=>n.frozen_score.toFixed(3),null),i}})}}),null),r})():e.id==="price_percentile"?(()=>{var r=oi();return c(r,f(Zt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),c(r,f(S,{get when(){return sd(n.price_percentile,t.thresholds)},children:i=>[" ",(()=>{var s=qn();return c(s,i),w(()=>ye(s,`chip ${i().toLowerCase()}`)),s})()]}),null),r})():(()=>{var r=Fd();return c(r,f(Zt,{get kind(){return e.kind},get value(){return n[e.id]}})),w(i=>{var s=e.align==="num",a=e.id==="rate_of_return";return s!==i.e&&r.classList.toggle("num",i.e=s),a!==i.t&&r.classList.toggle("strong",i.t=a),i},{e:void 0,t:void 0}),r})()}function Jd(t){const e=he(()=>Pn.filter(n=>t.visibleCols().includes(n.id)));return(()=>{var n=Bd(),r=n.firstChild,i=r.firstChild;i.firstChild;var s=r.nextSibling;return c(i,f(se,{get each(){return e()},children:a=>{const o=()=>t.sortKey()===a.id;return(()=>{var l=Wd();return l.$$keydown=u=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),t.onSort(a.id))},l.$$click=()=>t.onSort(a.id),c(l,f(Ct,{get text(){return It(a.id,t.thresholds)},get children(){var u=Vd();return c(u,()=>a.label,null),c(u,f(S,{get when(){return o()},get children(){return[" ",(()=>{var d=Hd();return c(d,()=>t.sortDir()==="asc"?"↑":"↓"),d})()]}}),null),u}})),w(u=>{var d=a.align==="num",h=o()?t.sortDir()==="asc"?"ascending":"descending":void 0;return d!==u.e&&l.classList.toggle("num",u.e=d),h!==u.t&&ae(l,"aria-sort",u.t=h),u},{e:void 0,t:void 0}),l})()}}),null),c(s,f(se,{get each(){return t.rows()},children:a=>{const o=()=>t.pickRankOf(a),l=()=>Gd(a),u=()=>t.openKey()!=null&&t.openKey()===l();return[(()=>{var d=jd(),h=d.firstChild;return d.$$click=()=>t.onToggleRow(a),c(h,()=>u()?"▾":"▸"),c(d,f(se,{get each(){return e()},children:g=>f(Kd,{col:g,row:a,get thresholds(){return t.thresholds},get pickRank(){return o()},get customScores(){return t.customScores}})}),null),w(g=>{var _=o()!=null,b=!!le(a.score),T=!!u();return _!==g.e&&d.classList.toggle("pick",g.e=_),b!==g.t&&d.classList.toggle("prow",g.t=b),T!==g.a&&d.classList.toggle("open",g.a=T),g},{e:void 0,t:void 0,a:void 0}),d})(),f(S,{get when(){return u()},get children(){var d=zd(),h=d.firstChild;return c(h,f(Rd,{row:a,get thresholds(){return t.thresholds},get hiddenDefs(){return t.hiddenDefs()}})),w(()=>ae(h,"colspan",e().length+1)),d}})]}})),n})()}Ce(["click","keydown"]);function Yd(t,e){return typeof t=="number"&&typeof e=="number"?t-e:String(t).localeCompare(String(e),void 0,{sensitivity:"base"})}const gt=t=>le(t);function Xd(t,e,n){const r=n==="desc"?-1:1;return[...t].sort((i,s)=>{const a=i[e],o=s[e],l=gt(a),u=gt(o);return l||u?l&&u?0:l?1:-1:r*Yd(a,o)})}function Qd(t){return[...t].sort((e,n)=>{const r=e.score,i=n.score,s=gt(r),a=gt(i);if(s||a)return s&&a?0:s?1:-1;let o=i-r;if(o!==0)return o;const l=e.rate_of_return,u=n.rate_of_return,d=gt(l),h=gt(u);return d||h?d&&h?0:d?1:-1:u-l})}var Zd=p("<div class=stage-badges>"),eh=p("<pre class=errbox>"),th=p("<details><summary> "),nh=p("<div class=scroll-region>"),rh=p('<section class=pane><div class=controls><input type=search class=filter-input placeholder="filter underlying / sector…"aria-label="filter rows by underlying or sector"><label class=check><input type=checkbox>scored only</label><span class=count-line> rows (filtered from <!>)'),ih=p("<div class=empty-panel><b>No scored candidates on this timeframe.</b> Untick <b>scored only</b> to browse the <!> raw rows — none cleared the scoring gates (return floor, Sharpe &gt; 0). Try lowering the floor in <b>Adjust scoring</b>."),sh=p("<div class=empty-panel>No rows match the current filter."),ah=p('<div class="empty-panel stage-failed-panel"><b> <!> — no rows</b><pre class=errbox>');const Kn=100,oh=150,li={short:{id:"chains_short",label:"Chains · Short"},medium:{id:"chains_medium",label:"Chains · Medium"}};function lh(t){const e=i=>i==="failed"?"failed":i==="partial"?"partial":"ok",n=i=>i==="failed"?"✗":i==="partial"?"△":"✓",r=i=>i.replaceAll("_"," ");return(()=>{var i=Zd();return c(i,f(se,{get each(){return t.stages??[]},children:s=>(()=>{var a=th(),o=a.firstChild,l=o.firstChild;return c(o,()=>n(s.status),l),c(o,()=>r(s.name),null),c(a,f(S,{get when(){return s.error},get children(){var u=eh();return c(u,()=>s.error),u}}),null),w(()=>ye(a,`sbadge ${e(s.status)}`)),a})()})),i})()}function ci(t){const[e,n]=M(""),[r,i]=M(""),[s,a]=M(!0),[o,l]=M(null),[u,d]=M("asc"),[h,g]=M(1);let _;Fe(()=>clearTimeout(_));const b=()=>{var C;return((C=t.tf)==null?void 0:C.rows)??[]},T=he(()=>{const C=t.scoring.params(),W=t.scoring.isCustom();return b().map(H=>{const z=Du(H,C);return{...H,frozen_score:H.score,live_parts:z,score:W?z==null?null:z.total:H.score}})}),m=he(()=>T().filter(C=>!le(C.score)&&le(C.frozen_score)).length),v=C=>{const W=C.currentTarget.value;n(W),clearTimeout(_),_=setTimeout(()=>{i(W.trim().toLowerCase()),g(1)},oh)},P=C=>{a(C),g(1)},D=C=>{o()!==C?(l(C),d("asc")):u()==="asc"?d("desc"):(l(null),d("asc")),g(1)},[R,O]=M(null),x=C=>{const W=`${C.underlying}|${C.strike}`;O(H=>H===W?null:W)};st(Ot([o,u,h,r,s],()=>O(null))),st(Ot(t.active,()=>O(null))),st(Ot(t.columns.visible,()=>g(1)));const $=()=>Pn.filter(C=>!t.columns.visible().includes(C.id)),A=()=>(t.stages??[]).find(C=>C.name===li[t.id].id),N=he(()=>{const C=r();return C?T().filter(W=>{const H=W.underlying,z=W.sector;return H!=null&&String(H).toLowerCase().includes(C)||z!=null&&String(z).toLowerCase().includes(C)}):T()}),I=he(()=>{const C=N();return s()?C.filter(W=>!le(W.score)):C}),k=he(()=>o()?Xd(I(),o(),u()):Qd(I())),B=he(()=>Math.max(1,Math.ceil(k().length/Kn))),E=()=>Math.min(h(),B()),J=()=>{const C=E();return k().slice((C-1)*Kn,C*Kn)},q=he(()=>{var W;const C=new Map;if(t.scoring.isCustom()){const H=Lu(T().map(z=>({row:z,score:z.score})));for(const z of H)C.set(`${z.row.underlying}|${z.row.strike}`,C.size+1)}else for(const H of((W=t.tf)==null?void 0:W.top_picks)??[])C.set(`${H.underlying}|${H.strike}`,H.rank??"?");return C}),F=C=>q().get(`${C.underlying}|${C.strike}`);return(()=>{var C=rh(),W=C.firstChild,H=W.firstChild,z=H.nextSibling,ce=z.firstChild,Z=z.nextSibling,ve=Z.firstChild,tt=ve.nextSibling;return tt.nextSibling,c(C,f(lh,{get stages(){return t.stages}}),W),H.$$input=v,ce.addEventListener("change",oe=>P(oe.currentTarget.checked)),c(W,f(Xu,{get store(){return t.columns}}),Z),c(Z,()=>Nt(k().length),ve),c(Z,()=>Nt(b().length),tt),c(Z,f(S,{get when(){return Y(()=>!!t.scoring.isCustom())()&&m()>0},get children(){return[" ","· ",Y(()=>Nt(m()))," re-admitted by lower floor"]}}),null),c(C,f(S,{get when(){return J().length>0},get children(){var oe=nh();return c(oe,f(Jd,{get visibleCols(){return t.columns.visible},rows:J,sortKey:o,sortDir:u,onSort:D,get thresholds(){return t.thresholds},pickRankOf:F,openKey:R,onToggleRow:x,hiddenDefs:$,get customScores(){return t.scoring.isCustom}})),oe}}),null),c(C,f(S,{get when(){return J().length===0},get children(){return f(S,{get when(){var oe,L;return((oe=A())==null?void 0:oe.status)==="failed"||((L=A())==null?void 0:L.status)==="partial"},get fallback(){return f(S,{get when(){return Y(()=>!!s())()&&N().length>0},get fallback(){return sh()},get children(){var oe=ih(),L=oe.firstChild,X=L.nextSibling,ne=X.nextSibling,ge=ne.nextSibling,_e=ge.nextSibling;return _e.nextSibling,c(oe,()=>Nt(N().length),_e),oe}})},children:oe=>(()=>{var L=ah(),X=L.firstChild,ne=X.firstChild,ge=ne.nextSibling;ge.nextSibling;var _e=X.nextSibling;return c(X,()=>oe().status==="partial"?"△":"✗",ne),c(X,()=>li[t.id].label,ge),c(_e,()=>oe().error??"stage produced no data"),L})()})}}),null),c(C,f(S,{get when(){return k().length>0},get children(){return f(nd,{page:E,pageCount:B,onGo:g})}}),null),w(()=>C.hidden=!t.active()),w(()=>H.value=e()),w(()=>ce.checked=s()),C})()}Ce(["input"]);var ch=p("<div class=holdings-bar><div class=holdings-bar-fill></div><div class=holdings-bar-mark>"),uh=p('<div class=hp-cash-bar><div class=hp-cash-bar-headline><span class=hp-cash-bar-total> <span style=font-size:0.85rem;font-weight:500;color:var(--muted)>cash</span></span><span class=hp-cash-bar-free> <span style=font-size:0.85rem;font-weight:500;color:var(--muted)>free</span></span></div><div class=hp-cash-bar-subline><span class=hp-cash-bar-reserved> reserved · </span><button type=button class="btn hp-pool-sheet-btn">Accounts / Pools'),ks=p('<button type=button class="btn-ghost hp-cash-edit">'),Es=p("<div class=hp-pool-list>"),dh=p('<div class=hp-pool-sheet><div class=hp-sheet-backdrop></div><div class=hp-sheet-container role=dialog aria-modal=true aria-label="Manage Cash and Pools"><div class=hp-sheet-header><div class=hp-sheet-title>Accounts & Cash Pools</div><button type=button class=hp-sheet-close aria-label="Close sheet">×</button></div><div class=hp-sheet-body><div class=hp-rail-block><div class=hp-rail-label></div><div class=hp-rail-big></div><div class=hp-rail-sub> cash − <!> reserved</div></div><div class=hp-pool-section><div class="hp-pool-row hp-pool-add"style=margin-top:0.5rem><input placeholder="new pool name"aria-label="new pool name"><button type=button class=btn>add</button></div></div></div><div class=hp-sheet-footer><button type=button class="btn btn-primary">Done'),hh=p('<span class=hp-cash-editor><input inputmode=decimal placeholder=150000><button type=button class="btn btn-primary">save</button><button type=button class=btn>cancel'),fh=p('<div class=hp-rail-block><div class=hp-rail-label>free to sell puts</div><div class=hp-rail-big></div><div class=hp-rail-sub> cash − <!> reserved</div><div class=hp-pool-section><div class="hp-pool-row hp-pool-add"><input placeholder="new pool name"aria-label="new pool name"><button type=button class=btn>add'),gh=p('<span class=hp-pool-name-row><button type=button class=hp-pool-name></button><button type=button class="btn hp-pool-del">×'),ph=p('<span class=hp-pool-line><span class=hp-pool-cash></span><button type=button class="btn-ghost hp-pool-act">cash</button><button type=button class="btn-ghost hp-pool-act">rename'),mh=p("<div class=hp-pool-item>"),_h=p("<span class=hp-pool-row><input><button type=button class=btn>save</button><button type=button class=btn>cancel"),Cs=p("<select class=hp-pool-pick>"),bh=p('<button type=button class="btn-ghost holdings-close-btn">sell call…'),vh=p('<div class=hp-slot><div class="hp-pos-card hp-lot-card hp-lot-row"><div class=hp-card-summary><div class="hp-lot-row-top hp-card-top"><span class=hp-card-symbol-line><span class=hp-card-symbol> sh </span></span><b></b></div><div class="hp-lot-row-sub hp-card-main"><span>bought <!> · </span><b class=hp-card-pl></b></div><div class="hp-lot-actions hp-card-actions"><button type=button class="btn-ghost holdings-close-btn">close…</button></div></div><div class=hp-card-drawer><div class=hp-lot-row-meta><i>last price </i><i>covered <!>/</i></div><div class=holdings-preview>Total Value: <!> · Account: '),Is=p("<span class=hp-pool-tag>"),Jt=p("<option>"),yh=p("<i class=hp-spot-session>"),wh=p("<span style=font-size:0.85rem;font-weight:600;margin-left:4px>(<!>)"),$h=p('<span class="chip high">buy back?'),Sh=p('<span class="chip high">ITM — called away?'),yr=p("<b>"),kh=p("<i>"),Eh=p('<div class=hp-slot><div class="hp-pos-card hp-list-row"><div class=hp-card-summary><div class=hp-card-top><span class="hp-list-pos hp-card-symbol-line"><span class=hp-kind></span><b class=hp-card-symbol> <!> ×</b></span><span class=hp-card-pl></span></div><div class=hp-card-main><span class=hp-card-meta>exp <!> · <!>/<!> wd</span><span class=hp-list-status></span></div><div class=hp-card-actions><button type=button class="btn-ghost holdings-close-btn">close…</button></div></div><div class=hp-card-drawer><div class=hp-list-pace style=display:flex;align-items:center;gap:10px><i style=font-size:0.85rem;color:var(--muted)>target </i></div><div class="holdings-card-stats hp-list-stats"><div><span>sold at</span><b></b></div><div><span>now (mid)</span><b></b><i></i></div><div><span>spot</span></div><div><span>close captures</span><b>'),Ch=p('<span class="chip normal">holding'),Ih=p("<b>—"),Th=p('<div class=hp-action-sheet role=dialog aria-modal=true><div class=hp-sheet-backdrop></div><div class=hp-sheet-container><div class=hp-sheet-header><div class=hp-sheet-title></div><button type=button class="hp-sheet-close hp-sheet-cancel"aria-label=Close>×</button></div><div class=hp-sheet-body>'),Ph=p("<label>pool<select>"),ut=p("<div class=hp-form-hint>"),Ah=p("<div class=hp-dialog-note>coverage is shown per lot — recorded even if it exceeds held shares"),xh=p('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>strike<input inputmode=decimal></label><label>premium<input inputmode=decimal></label><label>contracts <input inputmode=numeric></label><label>sold <input type=date></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary"></button><button type=button class="btn hp-sheet-cancel">Cancel'),Rh=p("<label>pool (deduct <!> from)<select>"),Nh=p('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>shares <input inputmode=numeric placeholder="e.g. 100"></label><label>basis / share<input inputmode=decimal placeholder="e.g. 349.00"></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class="btn hp-sheet-cancel">Cancel'),Oh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Sell covered call · <!> sh </div><form class=holdings-add><label>strike<input inputmode=decimal placeholder="e.g. 360.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.20"></label><label>contracts <input inputmode=numeric></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Sell call</button><button type=button class="btn hp-sheet-cancel">Cancel'),Dh=p("<i class=holdings-preview>"),Lh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Close lot · <!> sh </div><form class=holdings-add><label>shares<input inputmode=numeric></label><label>sale price<input inputmode=decimal placeholder="e.g. 360.00"></label><button type=submit class="btn btn-primary">Close </button><button type=button class="btn hp-sheet-cancel">Cancel'),Ts=p("<label class=holdings-outcome-price><input inputmode=decimal>"),Mh=p("<div class=hp-dialog-note>confirming creates a share lot prefilled at basis = strike − premium"),Uh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>P ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>assigned</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class="btn hp-sheet-cancel">Cancel</button><button type=button class="btn btn-primary">Confirm'),Fh=p("<label>pool (deduct strike × 100 × contracts from)<select>"),Bh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Record assigned shares</div><form class=holdings-add><label>symbol <input></label><label>shares <input inputmode=numeric></label><label>basis / share<input inputmode=decimal></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class="btn hp-sheet-cancel">Cancel'),Hh=p("<div class=hp-dialog-note>confirming auto-reduces the <!> lot by <!> sh"),Vh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>C ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>called away</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class="btn hp-sheet-cancel">Cancel</button><button type=button class="btn btn-primary">Confirm'),Wh=p("<div class=hp-toast-container aria-live=polite>"),jh=p('<div class="hp-toast holdings-notice"role=alert><span class=hp-toast-msg></span><button type=button class=hp-toast-dismiss aria-label="Dismiss notice">×'),zh=p("<div class=hp-list>"),ui=p("<div class=empty-panel>"),Gh=p('<div class=hp-list><div class="hp-list-row hp-list-head"><span>position</span><span>P&L</span><span>pace</span><span>status</span><span>'),qh=p("<span class=hp-pane-hint> sh held"),Kh=p('<div class=hp-toolbar-row><button type=button class="btn hp-add-btn">'),Jh=p('<button type=button class="btn holdings-refresh">⟳<span class=holdings-refresh-label> Refresh marks'),Yh=p("<div class=holdings-notice>"),Xh=p('<div class="holdings-panel hp-tabs-shell"><div class=hp-mobile-tabs></div><div class=hp-tabs-grid><aside class=hp-tabs-rail><div class=hp-tabs-brand>Wheel ledger</div></aside><main class=hp-tabs-main><div class=hp-pane-head><span class=hp-pane-title>'),Qh=p("<button type=button class=hp-mobile-tile><span class=hp-tab-tile-name></span><span class=hp-tab-tile-count></span><div class=hp-tab-tile-sub>"),Zh=p("<button type=button class=hp-tab-tile><span class=hp-tab-tile-name></span><span class=hp-tab-tile-count></span><div class=hp-tab-tile-sub>");const ue=t=>(t<0?"-$":"$")+Math.abs(t).toLocaleString(void 0,{maximumFractionDigits:0}),St=t=>(t<0?"-$":"$")+Math.abs(t).toFixed(2),ln=(t,e=0)=>`${(t*100).toFixed(e)}%`,Me=()=>new Date().toLocaleDateString("en-CA",{timeZone:"America/New_York"}),Ps=(t,e)=>{const[n,r,i]=t.split("-").map(Number);return new Date(Date.UTC(n,r-1,i+e,12)).toLocaleDateString("en-CA",{timeZone:"America/New_York"})};function As(t){if(!t)return"";const e=Math.max(0,(Date.now()-new Date(t).getTime())/1e3),n=Math.floor(e/60);return n<1?"just now":n<60?`${n} min ago`:`about ${Math.floor(n/60)} h ago`}function ef(t){const e=()=>t.v.pl_pct==null?0:Math.max(0,Math.min(100,t.v.pl_pct*100));return(()=>{var n=ch(),r=n.firstChild,i=r.nextSibling;return w(s=>{var a=`${e()}%`,o=`${Math.min(100,t.v.target_pct*100)}%`;return a!==s.e&&at(r,"width",s.e=a),o!==s.t&&at(i,"left",s.t=o),s},{e:void 0,t:void 0}),n})()}function tf(t){const e=()=>t.pool,n=()=>e()?e().cash:t.cash,r=()=>e()?e().reserved:t.reserved,i=()=>e()?e().free:t.free,s=()=>e()?e().name:"All Pools";return(()=>{var a=uh(),o=a.firstChild,l=o.firstChild,u=l.firstChild;u.nextSibling;var d=l.nextSibling,h=d.firstChild;h.nextSibling;var g=o.nextSibling,_=g.firstChild,b=_.firstChild,T=_.nextSibling;return c(l,(()=>{var m=Y(()=>n()==null);return()=>m()?"—":ue(n())})(),u),c(d,(()=>{var m=Y(()=>i()==null);return()=>m()?"—":ue(i())})(),h),c(_,()=>ue(r()),b),c(_,s,null),G(T,"click",t.onOpenPools),a})()}function nf(t){const[e,n]=M(!1),[r,i]=M(null),[s,a]=M(""),o=()=>t.pools??[],l=()=>t.pool,u=()=>l()?l().cash:t.cash,d=()=>l()?l().reserved:t.reserved,h=()=>l()?l().free:t.free,g=()=>u()==null,_=m=>{var v;m&&m!==((v=l())==null?void 0:v.id)&&t.onSelectPool(m),i(m??null),n(!0)},b=()=>{const m=o().find(v=>v.id===r());return m?m.cash:t.cash},T=async()=>{var m;!s().trim()||(m=t.busy)!=null&&m.call(t)||await t.onAddPool(s().trim())&&a("")};return(()=>{var m=dh(),v=m.firstChild,P=v.nextSibling,D=P.firstChild,R=D.firstChild,O=R.nextSibling,x=D.nextSibling,$=x.firstChild,A=$.firstChild,N=A.nextSibling,I=N.nextSibling,k=I.firstChild,B=k.nextSibling;B.nextSibling;var E=$.nextSibling,J=E.firstChild,q=J.firstChild,F=q.nextSibling,C=x.nextSibling,W=C.firstChild;return G(v,"click",t.onClose),G(O,"click",t.onClose),c(A,(()=>{var H=Y(()=>!!l());return()=>H()?`${l().name} — free to sell puts`:"Total Free Cash"})()),c(N,(()=>{var H=Y(()=>h()==null);return()=>H()?"—":ue(h())})()),c(I,(()=>{var H=Y(()=>u()==null);return()=>H()?"—":ue(u())})(),k),c(I,()=>ue(d()),B),c($,f(S,{get when(){return!e()},get fallback(){return f(xs,{get cash(){return b()},get busy(){return t.busy},onSave:async H=>{await t.onSaveCash(H,r())&&n(!1)},onCancel:()=>n(!1)})},get children(){var H=ks();return H.$$click=()=>{var z;return _(((z=l())==null?void 0:z.id)??null)},c(H,()=>g()?"set cash":"edit cash"),H}}),null),c(E,f(S,{get when(){return o().length>0},get children(){var H=Es();return c(H,f(se,{get each(){return o()},children:z=>f(Rs,{pool:z,get selected(){var ce;return((ce=l())==null?void 0:ce.id)===z.id},get busy(){return t.busy},onSelect:()=>{n(!1),t.onSelectPool(z.id)},onEditCash:()=>_(z.id),onRename:ce=>t.onRenamePool(z.id,ce),onDelete:()=>t.onDeletePool(z.id)})})),H}}),J),q.$$keydown=H=>H.key==="Enter"&&T(),q.$$input=H=>a(H.target.value),F.$$click=T,G(W,"click",t.onClose),w(H=>{var Z;var z=!t.open,ce=!s().trim()||((Z=t.busy)==null?void 0:Z.call(t));return z!==H.e&&(m.hidden=H.e=z),ce!==H.t&&(F.disabled=H.t=ce),H},{e:void 0,t:void 0}),w(()=>q.value=s()),m})()}function xs(t){const[e,n]=M(t.cash==null?"":String(t.cash)),r=()=>Number.isFinite(Number(e()))&&Number(e())>=0;return(()=>{var i=hh(),s=i.firstChild,a=s.nextSibling,o=a.nextSibling;return s.$$keydown=l=>{var u;return l.key==="Escape"&&((u=t.onCancel)==null?void 0:u.call(t))},s.$$input=l=>n(l.target.value),a.$$click=()=>t.onSave(Number(e())),o.$$click=()=>{var l;return(l=t.onCancel)==null?void 0:l.call(t)},w(()=>{var l;return a.disabled=!r()||((l=t.busy)==null?void 0:l.call(t))}),w(()=>s.value=e()),i})()}function rf(t){const[e,n]=M(!1),[r,i]=M(null),[s,a]=M(""),o=()=>t.pools??[],l=()=>t.pool,u=()=>l()?l().cash:t.cash,d=()=>l()?l().reserved:t.reserved,h=()=>l()?l().free:t.free,g=()=>u()==null,_=m=>{var v;m&&m!==((v=l())==null?void 0:v.id)&&t.onSelectPool(m),i(m??null),n(!0)},b=()=>{const m=o().find(v=>v.id===r());return m?m.cash:t.cash},T=async()=>{var m;!s().trim()||(m=t.busy)!=null&&m.call(t)||await t.onAddPool(s().trim())&&a("")};return(()=>{var m=fh(),v=m.firstChild,P=v.nextSibling,D=P.nextSibling,R=D.firstChild,O=R.nextSibling;O.nextSibling;var x=D.nextSibling,$=x.firstChild,A=$.firstChild,N=A.nextSibling;return c(P,(()=>{var I=Y(()=>h()==null);return()=>I()?"—":ue(h())})()),c(D,(()=>{var I=Y(()=>u()==null);return()=>I()?"—":ue(u())})(),R),c(D,()=>ue(d()),O),c(m,f(S,{get when(){return!e()},get fallback(){return f(xs,{get cash(){return b()},get busy(){return t.busy},onSave:async I=>{await t.onSaveCash(I,r())&&n(!1)},onCancel:()=>n(!1)})},get children(){var I=ks();return I.$$click=()=>{var k;return _(((k=l())==null?void 0:k.id)??null)},c(I,()=>g()?"set cash":"edit cash"),I}}),x),c(x,f(S,{get when(){return o().length>0},get children(){var I=Es();return c(I,f(se,{get each(){return o()},children:k=>f(Rs,{pool:k,get selected(){var B;return((B=l())==null?void 0:B.id)===k.id},get busy(){return t.busy},onSelect:()=>{n(!1),t.onSelectPool(k.id)},onEditCash:()=>_(k.id),onRename:B=>t.onRenamePool(k.id,B),onDelete:()=>t.onDeletePool(k.id)})})),I}}),$),A.$$keydown=I=>I.key==="Enter"&&T(),A.$$input=I=>a(I.target.value),N.$$click=T,w(()=>{var I;return N.disabled=!s().trim()||((I=t.busy)==null?void 0:I.call(t))}),w(()=>A.value=s()),m})()}function Rs(t){const[e,n]=M(!1),[r,i]=M(t.pool.name),s=()=>{i(t.pool.name),n(!0)},a=()=>{var l;const o=r().trim();!o||o===t.pool.name||(l=t.busy)!=null&&l.call(t)||(t.onRename(o),n(!1))};return(()=>{var o=mh();return c(o,f(S,{get when(){return!e()},get fallback(){return(()=>{var l=_h(),u=l.firstChild,d=u.nextSibling,h=d.nextSibling;return u.$$keydown=g=>{g.key==="Enter"?a():g.key==="Escape"&&n(!1)},u.$$input=g=>i(g.target.value),d.$$click=a,h.$$click=()=>n(!1),w(g=>{var T;var _=`rename ${t.pool.name}`,b=((T=t.busy)==null?void 0:T.call(t))||!r().trim()||r().trim()===t.pool.name;return _!==g.e&&ae(u,"aria-label",g.e=_),b!==g.t&&(d.disabled=g.t=b),g},{e:void 0,t:void 0}),w(()=>u.value=r()),l})()},get children(){return[(()=>{var l=gh(),u=l.firstChild,d=u.nextSibling;return G(u,"click",t.onSelect),c(u,()=>t.pool.name),G(d,"click",t.onDelete),w(h=>{var b;var g=(b=t.busy)==null?void 0:b.call(t),_=`delete ${t.pool.name}`;return g!==h.e&&(d.disabled=h.e=g),_!==h.t&&ae(d,"aria-label",h.t=_),h},{e:void 0,t:void 0}),l})(),(()=>{var l=ph(),u=l.firstChild,d=u.nextSibling,h=d.nextSibling;return c(u,()=>ue(t.pool.cash)),G(d,"click",t.onEditCash),h.$$click=s,l})()]}})),w(()=>o.classList.toggle("active",!!t.selected)),o})()}const sf={PreMarket:"pre",AfterHours:"post",OverNight:"overnight"};function af(t){const[e,n]=M(!1),r=t.lot,i=()=>r.view;return(()=>{var s=vh(),a=s.firstChild,o=a.firstChild,l=o.firstChild,u=l.firstChild,d=u.firstChild,h=d.firstChild,g=u.nextSibling,_=l.nextSibling,b=_.firstChild,T=b.firstChild,m=T.nextSibling;m.nextSibling;var v=b.nextSibling,P=_.nextSibling,D=P.firstChild,R=o.nextSibling,O=R.firstChild,x=O.firstChild;x.firstChild;var $=x.nextSibling,A=$.firstChild,N=A.nextSibling;N.nextSibling;var I=O.nextSibling,k=I.firstChild,B=k.nextSibling;return B.nextSibling,o.$$click=()=>n(E=>!E),c(d,()=>r.shares,h),c(d,()=>r.symbol,null),c(u,f(S,{get when(){var E;return(((E=t.pools)==null?void 0:E.length)??0)>1},get fallback(){return f(S,{get when(){return t.showPool},get children(){var E=Is();return c(E,()=>r.pool_name??"Main"),E}})},get children(){var E=Cs();return E.addEventListener("change",J=>{var q;return(q=t.onPoolChange)==null?void 0:q.call(t,r,J.currentTarget.value)}),E.$$click=J=>J.stopPropagation(),c(E,f(se,{get each(){return t.pools},children:J=>(()=>{var q=Jt();return c(q,()=>J.name),w(()=>q.value=J.id),q})()})),w(()=>ae(E,"aria-label",`cash pool for ${r.symbol} lot`)),w(()=>{var J,q;return E.value=r.pool_id??((q=(J=t.pools)==null?void 0:J[0])==null?void 0:q.id)??""}),E}}),null),c(g,(()=>{var E=Y(()=>i().spot==null);return()=>E()?"—":St(i().spot)})(),null),c(g,f(S,{get when(){var E;return sf[(E=r.mark)==null?void 0:E.session]},children:E=>(()=>{var J=yh();return c(J,E),J})()}),null),c(b,()=>St(r.basis_per_share),m),c(b,()=>r.acquired,null),c(v,f(S,{get when(){return i().pl_dollars!=null},fallback:"—",get children(){return`${ue(i().pl_dollars)} (${(i().pl_pct??0)>=0?"+":""}${ln(i().pl_pct,1)})`}})),c(P,f(S,{get when(){return i().capacity>0},get children(){var E=bh();return E.$$click=J=>{J.stopPropagation(),t.onSellDialog(r)},E}}),D),D.$$click=E=>{E.stopPropagation(),t.onCloseDialog(r)},c(x,()=>{var E;return As((E=r.mark)==null?void 0:E.as_of)||"—"},null),c($,()=>i().covered,N),c($,()=>i().capacity,null),c(I,(()=>{var E=Y(()=>i().value==null);return()=>E()?"—":ue(i().value)})(),B),c(I,()=>r.pool_name??"Main",null),c(s,f(S,{get when(){return t.dialogFor("sellCall",r.id)},keyed:!0,children:E=>f($n,{get title(){return`Sell covered call · ${E.lot.shares} sh ${E.lot.symbol}`},get onDone(){return t.onDialogDone},get children(){return f(uf,{get lot(){return E.lot},get onDone(){return t.onDialogDone},get onSell(){return t.onSellCall}})}})}),null),c(s,f(S,{get when(){return t.dialogFor("closeLot",r.id)},keyed:!0,children:E=>f($n,{get title(){return`Close lot · ${E.lot.shares} sh ${E.lot.symbol}`},get onDone(){return t.onDialogDone},get children(){return f(df,{get lot(){return E.lot},get busy(){return t.busy},get onDone(){return t.onDialogDone},get onClose(){return t.onCloseLot}})}})}),null),w(E=>{var J=(i().pl_dollars??0)>=0,q=(i().pl_dollars??0)<0,F=!e();return J!==E.e&&v.classList.toggle("holdings-pos",E.e=J),q!==E.t&&v.classList.toggle("holdings-neg",E.t=q),F!==E.a&&(R.hidden=E.a=F),E},{e:void 0,t:void 0,a:void 0}),s})()}function of(t){const[e,n]=M(!1),r=t.x,i=()=>r.v.spot_pct_vs_strike!=null&&r.v.spot_pct_vs_strike>0,s=()=>r.p.kind==="call"?r.v.spot_pct_vs_strike>0:r.v.spot_pct_vs_strike<0;return(()=>{var a=Eh(),o=a.firstChild,l=o.firstChild,u=l.firstChild,d=u.firstChild,h=d.firstChild,g=h.nextSibling,_=g.firstChild,b=_.nextSibling;b.nextSibling;var T=d.nextSibling,m=u.nextSibling,v=m.firstChild,P=v.firstChild,D=P.nextSibling,R=D.nextSibling,O=R.nextSibling,x=O.nextSibling,$=x.nextSibling;$.nextSibling;var A=v.nextSibling,N=m.nextSibling,I=N.firstChild,k=l.nextSibling,B=k.firstChild,E=B.firstChild;E.firstChild;var J=B.nextSibling,q=J.firstChild,F=q.firstChild,C=F.nextSibling,W=q.nextSibling,H=W.firstChild,z=H.nextSibling,ce=z.nextSibling,Z=W.nextSibling;Z.firstChild;var ve=Z.nextSibling,tt=ve.firstChild,oe=tt.nextSibling;return l.$$click=()=>n(L=>!L),c(h,()=>r.p.kind.toUpperCase()),c(g,()=>r.p.symbol,_),c(g,()=>r.p.strike,b),c(g,()=>r.p.kind==="put"?"P":"C",b),c(g,()=>r.p.contracts,null),c(d,f(S,{get when(){return Y(()=>r.p.kind==="call")()&&t.showPool},get children(){var L=Is();return c(L,()=>r.p.pool_name),L}}),null),c(d,f(S,{get when(){return Y(()=>r.p.kind==="put")()&&t.showPool},get children(){var L=Cs();return L.addEventListener("change",X=>{var ne;return(ne=t.onPoolChange)==null?void 0:ne.call(t,r.p.id,X.target.value)}),L.$$click=X=>X.stopPropagation(),c(L,f(se,{get each(){return t.pools},children:X=>(()=>{var ne=Jt();return c(ne,()=>X.name),w(()=>ne.value=X.id),ne})()})),w(X=>{var _e,nt;var ne=`cash pool for ${r.p.symbol} ${r.p.strike} put`,ge=(nt=(_e=t.dialogActions)==null?void 0:_e.busy)==null?void 0:nt.call(_e);return ne!==X.e&&ae(L,"aria-label",X.e=ne),ge!==X.t&&(L.disabled=X.t=ge),X},{e:void 0,t:void 0}),w(()=>{var X,ne;return L.value=((ne=(X=t.pools)==null?void 0:X.find(ge=>ge.name===r.p.pool_name))==null?void 0:ne.id)??""}),L}}),null),c(T,(()=>{var L=Y(()=>r.v.pl_pct==null);return()=>L()?"—":`${r.v.pl_pct>=0?"+":""}${ln(r.v.pl_pct,1)}`})(),null),c(T,f(S,{get when(){return r.v.pl_dollars!=null},get children(){var L=wh(),X=L.firstChild,ne=X.nextSibling;return ne.nextSibling,c(L,()=>ue(r.v.pl_dollars),ne),L}}),null),c(v,()=>r.p.expiry,D),c(v,()=>r.v.days_elapsed,O),c(v,()=>r.v.days_total,$),c(A,f(S,{get when(){return r.v.pace_met},get fallback(){return Ch()},get children(){return $h()}}),null),c(A,f(S,{get when(){return Y(()=>r.p.kind==="call")()&&i()},get children(){return Sh()}}),null),I.$$click=L=>{L.stopPropagation(),t.onClose(r)},c(B,f(ef,{get v(){return r.v}}),E),c(E,()=>ln(r.v.target_pct),null),c(C,()=>St(r.p.premium)),c(z,(()=>{var L=Y(()=>r.p.mark==null);return()=>L()?"—":r.p.mark.mid.toFixed(2)})()),c(ce,(()=>{var L=Y(()=>r.p.mark==null);return()=>L()?"unpriced":As(r.p.mark.as_of)})()),c(Z,f(S,{get when(){var L;return((L=r.p.mark)==null?void 0:L.underlying_price)!=null},get fallback(){return Ih()},get children(){return[(()=>{var L=yr();return c(L,()=>r.p.mark.underlying_price.toFixed(2)),L})(),(()=>{var L=kh();return c(L,(()=>{var X=Y(()=>r.v.spot_pct_vs_strike==null);return()=>X()?"":`${r.v.spot_pct_vs_strike>=0?"+":""}${ln(r.v.spot_pct_vs_strike,1)} vs strike`})()),w(()=>ye(L,s()&&r.v.spot_pct_vs_strike!=null?"holdings-neg":"holdings-pos")),L})()]}}),null),c(oe,(()=>{var L=Y(()=>r.v.pl_dollars==null);return()=>L()?"—":St(r.v.pl_dollars)})()),c(a,f(S,{get when(){return t.dialogFor(r.p.kind,r.p.id)},keyed:!0,children:L=>f($n,{get title(){return Y(()=>L.type==="put"&&L.stage==="lot")()?"Record assigned shares":`Close ${L.pos.symbol} ${L.pos.strike}${L.type==="put"?"P":"C"} ×${L.pos.contracts}`},get onDone(){var X;return(X=t.dialogActions)==null?void 0:X.onDone},get children(){return f(pf,na({d:L,get pools(){return t.pools}},()=>t.dialogActions))}})}),null),w(L=>{var X=!!r.v.pace_met,ne=r.p.kind,ge=r.v.pl_pct>=0,_e=r.v.pl_pct<0,nt=!e(),Yt=(r.v.pl_dollars??0)>=0?"holdings-pos":"holdings-neg";return X!==L.e&&o.classList.toggle("hp-row-met",L.e=X),ne!==L.t&&ae(h,"data-kind",L.t=ne),ge!==L.a&&T.classList.toggle("holdings-pos",L.a=ge),_e!==L.o&&T.classList.toggle("holdings-neg",L.o=_e),nt!==L.i&&(k.hidden=L.i=nt),Yt!==L.n&&ye(oe,L.n=Yt),L},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0}),a})()}function $n(t){return(()=>{var e=Th(),n=e.firstChild,r=n.nextSibling,i=r.firstChild,s=i.firstChild,a=s.nextSibling,o=i.nextSibling;return G(n,"click",t.onDone),c(s,()=>t.title),G(a,"click",t.onDone),c(o,()=>t.children),w(()=>ae(e,"aria-label",t.title||"Position Action")),e})()}function lf(t){var l,u;const e=t.kind,n=()=>t.pools??[],[r,i]=M({symbol:"",strike:"",premium:"",contracts:"1",sold:Me(),expiry:Ps(Me(),7),pool_id:((u=(l=t.pools)==null?void 0:l[0])==null?void 0:u.id)??""}),s=d=>h=>i({...r(),[d]:h.target.value}),a=()=>r().symbol.trim()&&[r().strike,r().premium,r().contracts].every(d=>Number(d)>0)&&r().expiry>r().sold&&r().sold<=Me(),o=()=>r().symbol.trim()?!r().strike||Number(r().strike)<=0?"Please enter a positive strike price.":!r().premium||Number(r().premium)<=0?"Please enter a positive option premium.":!r().contracts||Number(r().contracts)<1?"Contracts must be at least 1.":r().expiry<=r().sold?"Expiration date must be after the sold date.":null:"Please enter a stock symbol (e.g. AAPL, NVDA).";return(()=>{var d=xh(),h=d.firstChild,g=h.firstChild,_=g.nextSibling,b=h.nextSibling,T=b.firstChild,m=T.nextSibling,v=b.nextSibling,P=v.firstChild,D=P.nextSibling,R=v.nextSibling,O=R.firstChild,x=O.nextSibling,$=R.nextSibling,A=$.firstChild,N=A.nextSibling,I=$.nextSibling,k=I.firstChild,B=k.nextSibling,E=I.nextSibling,J=E.nextSibling;return d.addEventListener("submit",q=>{var F,C;q.preventDefault(),!(!a()||(F=t.busy)!=null&&F.call(t))&&t.onAdd({...e==="call"?{kind:"call"}:{},...n().length>0?{pool_id:r().pool_id||((C=n()[0])==null?void 0:C.id)}:{},symbol:r().symbol.trim().toUpperCase(),strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:r().sold,expiry:r().expiry})}),G(_,"input",s("symbol")),G(m,"input",s("strike")),ae(m,"placeholder",e==="call"?"e.g. 355.00":"e.g. 350.00"),G(D,"input",s("premium")),ae(D,"placeholder",e==="call"?"e.g. 1.80":"e.g. 1.00"),G(x,"input",s("contracts")),c(d,f(S,{get when(){return n().length>1},get children(){var q=Ph(),F=q.firstChild,C=F.nextSibling;return G(C,"input",s("pool_id")),c(C,f(se,{get each(){return n()},children:W=>(()=>{var H=Jt();return c(H,()=>W.name),w(()=>H.value=W.id),H})()})),w(()=>C.value=r().pool_id),q}}),$),G(N,"input",s("sold")),G(B,"input",s("expiry")),c(d,f(S,{get when(){return o()},get children(){var q=ut();return c(q,o),q}}),E),c(E,e==="call"?"Sell call":"Sell put"),G(J,"click",t.onDone),c(d,f(S,{when:e==="call",get children(){return Ah()}}),null),w(()=>{var q;return E.disabled=!a()||((q=t.busy)==null?void 0:q.call(t))}),w(()=>_.value=r().symbol),w(()=>m.value=r().strike),w(()=>D.value=r().premium),w(()=>x.value=r().contracts),w(()=>N.value=r().sold),w(()=>B.value=r().expiry),d})()}function cf(t){var o;const e=()=>t.pools??[],[n,r]=M({symbol:"",shares:"",basis_per_share:"",acquired:Me(),pool_id:((o=e()[0])==null?void 0:o.id)??""}),i=l=>u=>r({...n(),[l]:u.target.value}),s=()=>n().symbol.trim()&&Number(n().shares)>0&&Number(n().basis_per_share)>0,a=()=>n().symbol.trim()?!n().shares||Number(n().shares)<=0?"Shares must be at least 1.":!n().basis_per_share||Number(n().basis_per_share)<=0?"Please enter a positive cost basis per share.":null:"Please enter a stock symbol (e.g. AAPL, GOOG).";return(()=>{var l=Nh(),u=l.firstChild,d=u.firstChild,h=d.nextSibling,g=u.nextSibling,_=g.firstChild,b=_.nextSibling,T=g.nextSibling,m=T.firstChild,v=m.nextSibling,P=T.nextSibling,D=P.firstChild,R=D.nextSibling,O=P.nextSibling,x=O.nextSibling;return l.addEventListener("submit",$=>{var A,N;$.preventDefault(),!(!s()||(A=t.busy)!=null&&A.call(t))&&t.onAdd({kind:"lot",symbol:n().symbol.trim().toUpperCase(),shares:Math.trunc(Number(n().shares)),basis_per_share:Number(n().basis_per_share),acquired:n().acquired,...e().length>0?{pool_id:n().pool_id||((N=e()[0])==null?void 0:N.id)}:{}})}),G(h,"input",i("symbol")),G(b,"input",i("shares")),G(v,"input",i("basis_per_share")),c(l,f(S,{get when(){return e().length>1},get children(){var $=Rh(),A=$.firstChild,N=A.nextSibling,I=N.nextSibling,k=I.nextSibling;return c($,()=>Math.trunc(Number(n().shares)*Number(n().basis_per_share)||0).toLocaleString(),N),G(k,"input",i("pool_id")),c(k,f(se,{get each(){return e()},children:B=>(()=>{var E=Jt();return c(E,()=>B.name),w(()=>E.value=B.id),E})()})),w(()=>k.value=n().pool_id),$}}),P),G(R,"input",i("acquired")),c(l,f(S,{get when(){return a()},get children(){var $=ut();return c($,a),$}}),O),G(x,"click",t.onDone),w(()=>{var $;return O.disabled=!s()||(($=t.busy)==null?void 0:$.call(t))}),w(()=>h.value=n().symbol),w(()=>b.value=n().shares),w(()=>v.value=n().basis_per_share),w(()=>R.value=n().acquired),l})()}function uf(t){const e=t.lot,n=()=>Math.floor(e.shares/100),[r,i]=M({strike:"",premium:"",contracts:String(n()),expiry:Ps(Me(),7)}),s=l=>u=>i({...r(),[l]:u.target.value}),a=()=>Number(r().strike)>0&&Number(r().premium)>0&&Number(r().contracts)>=1&&Number(r().contracts)<=n()&&r().expiry>Me(),o=()=>!r().strike||Number(r().strike)<=0?"Please enter a positive strike price.":!r().premium||Number(r().premium)<=0?"Please enter a positive premium.":!r().contracts||Number(r().contracts)<1?"Contracts must be at least 1.":Number(r().contracts)>n()?`Contracts cannot exceed lot capacity of ${n()}.`:r().expiry<=Me()?"Expiration date must be in the future.":null;return(()=>{var l=Oh(),u=l.firstChild,d=u.firstChild,h=d.nextSibling;h.nextSibling;var g=u.nextSibling,_=g.firstChild,b=_.firstChild,T=b.nextSibling,m=_.nextSibling,v=m.firstChild,P=v.nextSibling,D=m.nextSibling,R=D.firstChild,O=R.nextSibling,x=D.nextSibling,$=x.firstChild,A=$.nextSibling,N=x.nextSibling,I=N.nextSibling;return c(u,()=>e.shares,h),c(u,()=>e.symbol,null),g.addEventListener("submit",k=>{var B;k.preventDefault(),!(!a()||(B=t.busy)!=null&&B.call(t))&&t.onSell(e,{kind:"call",symbol:e.symbol,strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:Me(),expiry:r().expiry})}),G(T,"input",s("strike")),G(P,"input",s("premium")),G(O,"input",s("contracts")),G(A,"input",s("expiry")),c(g,f(S,{get when(){return o()},get children(){var k=ut();return c(k,o),k}}),N),G(I,"click",t.onDone),w(()=>{var k;return N.disabled=!a()||((k=t.busy)==null?void 0:k.call(t))}),w(()=>T.value=r().strike),w(()=>P.value=r().premium),w(()=>O.value=r().contracts),w(()=>A.value=r().expiry),l})()}function df(t){const e=t.lot,[n,r]=M({shares:String(e.shares),price:""}),i=d=>h=>r({...n(),[d]:h.target.value}),s=()=>Math.trunc(Number(n().shares)),a=()=>Number(n().price),o=()=>Number.isInteger(s())&&s()>=1&&s()<=e.shares&&a()>0,l=()=>!s()||s()<1||s()>e.shares?`Shares to close must be between 1 and ${e.shares}.`:!a()||a()<=0?"Please enter a positive sale price per share.":null,u=()=>o()?s()*a():null;return(()=>{var d=Lh(),h=d.firstChild,g=h.firstChild,_=g.nextSibling;_.nextSibling;var b=h.nextSibling,T=b.firstChild,m=T.firstChild,v=m.nextSibling,P=T.nextSibling,D=P.firstChild,R=D.nextSibling,O=P.nextSibling;O.firstChild;var x=O.nextSibling;return c(h,()=>e.shares,_),c(h,()=>e.symbol,null),b.addEventListener("submit",$=>{var A;$.preventDefault(),!(!o()||(A=t.busy)!=null&&A.call(t))&&t.onClose(e,s(),a())}),b.$$keydown=$=>{$.key==="Escape"&&t.onDone()},G(v,"input",i("shares")),G(R,"input",i("price")),c(b,f(S,{get when(){return u()!=null},get children(){var $=Dh();return c($,()=>`${s()} sh × $${a().toFixed(2)} → $${u().toFixed(2)} → pool ${e.pool_name??"Main"}`),$}}),O),c(b,f(S,{get when(){return l()},get children(){var $=ut();return c($,l),$}}),O),c(O,(()=>{var $=Y(()=>s()===e.shares);return()=>$()?"lot":`${s()} sh`})(),null),G(x,"click",t.onDone),w(()=>{var $;return O.disabled=!o()||(($=t.busy)==null?void 0:$.call(t))}),w(()=>v.value=n().shares),w(()=>R.value=n().price),d})()}function hf(t){var l,u;const e=t.d.pos,[n,r]=M("bought-back"),[i,s]=M(((u=(l=e.mark)==null?void 0:l.mid)==null?void 0:u.toFixed(2))??""),a=()=>n()!=="expired"&&(!i()||!Number.isFinite(Number(i()))||Number(i())<0)?"Please enter a valid price per share.":null,o=()=>{if(n()==="expired")return e.premium*100*e.contracts;const d=Number(i());return Number.isFinite(d)?n()==="assigned"?(e.strike-d+e.premium)*100*e.contracts:(e.premium-d)*100*e.contracts:null};return(()=>{var d=Uh(),h=d.firstChild,g=h.firstChild,_=g.nextSibling,b=_.nextSibling,T=b.nextSibling;T.nextSibling;var m=h.nextSibling,v=m.firstChild,P=v.firstChild,D=v.nextSibling,R=D.firstChild,O=D.nextSibling,x=O.firstChild,$=m.nextSibling;$.firstChild;var A=$.nextSibling,N=A.firstChild,I=N.nextSibling;return c(h,()=>e.symbol,_),c(h,()=>e.strike,T),c(h,()=>e.contracts,null),P.addEventListener("change",()=>r("bought-back")),R.addEventListener("change",()=>r("expired")),x.addEventListener("change",()=>r("assigned")),c(d,f(S,{get when(){return n()!=="expired"},get children(){var k=Ts(),B=k.firstChild;return c(k,()=>n()==="assigned"?"share price at assignment":"close price/share",B),B.$$input=E=>s(E.target.value),w(()=>B.value=i()),k}}),$),c($,f(S,{get when(){return o()!==null},fallback:"—",get children(){var k=yr();return c(k,()=>St(o())),w(()=>ye(k,o()>=0?"holdings-pos":"holdings-neg")),k}}),null),c(d,f(S,{get when(){return a()},get children(){var k=ut();return c(k,a),k}}),A),G(N,"click",t.onDone),I.$$click=()=>t.onConfirmPut(e,n(),n()==="expired"?null:Number(i())),c(d,f(S,{get when(){return n()==="assigned"},get children(){return Mh()}}),null),w(()=>{var k;return I.disabled=((k=t.busy)==null?void 0:k.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),w(()=>P.checked=n()==="bought-back"),w(()=>R.checked=n()==="expired"),w(()=>x.checked=n()==="assigned"),d})()}function ff(t){var o,l;const e=()=>t.pools??[],[n,r]=M({...t.d.prefill,pool_id:((o=t.d.pos)==null?void 0:o.pool_id)??((l=e()[0])==null?void 0:l.id)??""}),i=u=>d=>r({...n(),[u]:d.target.value}),s=()=>n().symbol.trim()&&Number(n().shares)>0&&Number(n().basis_per_share)>0,a=()=>n().symbol.trim()?!n().shares||Number(n().shares)<=0?"Shares must be greater than 0.":!n().basis_per_share||Number(n().basis_per_share)<=0?"Cost basis must be greater than 0.":null:"Please enter a stock symbol.";return(()=>{var u=Bh(),d=u.firstChild,h=d.nextSibling,g=h.firstChild,_=g.firstChild,b=_.nextSibling,T=g.nextSibling,m=T.firstChild,v=m.nextSibling,P=T.nextSibling,D=P.firstChild,R=D.nextSibling,O=P.nextSibling,x=O.firstChild,$=x.nextSibling,A=O.nextSibling,N=A.nextSibling;return h.addEventListener("submit",I=>{var k,B;I.preventDefault(),!(!s()||(k=t.busy)!=null&&k.call(t))&&t.onAssign(t.d.pos,{kind:"lot",symbol:n().symbol.trim().toUpperCase(),shares:Math.trunc(Number(n().shares)),basis_per_share:Number(n().basis_per_share),acquired:n().acquired,assigned_from:t.d.pos.id,...e().length>0?{pool_id:n().pool_id||((B=e()[0])==null?void 0:B.id)}:{}})}),G(b,"input",i("symbol")),G(v,"input",i("shares")),c(h,f(S,{get when(){return e().length>1},get children(){var I=Fh(),k=I.firstChild,B=k.nextSibling;return G(B,"input",i("pool_id")),c(B,f(se,{get each(){return e()},children:E=>(()=>{var J=Jt();return c(J,()=>E.name),w(()=>J.value=E.id),J})()})),w(()=>B.value=n().pool_id),I}}),P),G(R,"input",i("basis_per_share")),G($,"input",i("acquired")),c(h,f(S,{get when(){return a()},get children(){var I=ut();return c(I,a),I}}),A),G(N,"click",t.onDone),w(()=>{var I;return A.disabled=!s()||((I=t.busy)==null?void 0:I.call(t))}),w(()=>b.value=n().symbol),w(()=>v.value=n().shares),w(()=>R.value=n().basis_per_share),w(()=>$.value=n().acquired),u})()}function gf(t){var l,u;const e=t.d.pos,[n,r]=M("bought-back"),[i,s]=M(((u=(l=e.mark)==null?void 0:l.mid)==null?void 0:u.toFixed(2))??""),a=()=>n()!=="expired"&&(!i()||!Number.isFinite(Number(i()))||Number(i())<0)?"Please enter a valid price per share.":null,o=()=>{if(n()==="expired")return e.premium*100*e.contracts;const d=Number(i());return Number.isFinite(d)?n()==="called-away"?(e.strike-d+e.premium)*100*e.contracts:(e.premium-d)*100*e.contracts:null};return(()=>{var d=Vh(),h=d.firstChild,g=h.firstChild,_=g.nextSibling,b=_.nextSibling,T=b.nextSibling;T.nextSibling;var m=h.nextSibling,v=m.firstChild,P=v.firstChild,D=v.nextSibling,R=D.firstChild,O=D.nextSibling,x=O.firstChild,$=m.nextSibling;$.firstChild;var A=$.nextSibling,N=A.firstChild,I=N.nextSibling;return c(h,()=>e.symbol,_),c(h,()=>e.strike,T),c(h,()=>e.contracts,null),P.addEventListener("change",()=>r("bought-back")),R.addEventListener("change",()=>r("expired")),x.addEventListener("change",()=>r("called-away")),c(d,f(S,{get when(){return n()!=="expired"},get children(){var k=Ts(),B=k.firstChild;return c(k,()=>n()==="called-away"?"share price at call":"close price/share",B),B.$$input=E=>s(E.target.value),w(()=>B.value=i()),k}}),$),c($,f(S,{get when(){return o()!==null},fallback:"—",get children(){var k=yr();return c(k,()=>St(o())),w(()=>ye(k,o()>=0?"holdings-pos":"holdings-neg")),k}}),null),c(d,f(S,{get when(){return a()},get children(){var k=ut();return c(k,a),k}}),A),G(N,"click",t.onDone),I.$$click=()=>t.onConfirmCall(e,n(),n()==="expired"?null:Number(i())),c(d,f(S,{get when(){return n()==="called-away"},get children(){var k=Hh(),B=k.firstChild,E=B.nextSibling,J=E.nextSibling,q=J.nextSibling;return q.nextSibling,c(k,()=>e.symbol,E),c(k,()=>e.contracts*100,q),k}}),null),w(()=>{var k;return I.disabled=((k=t.busy)==null?void 0:k.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),w(()=>P.checked=n()==="bought-back"),w(()=>R.checked=n()==="expired"),w(()=>x.checked=n()==="called-away"),d})()}function pf(t){return t.d.type==="put"?t.d.stage==="lot"?f(ff,{get d(){return t.d},get pools(){return t.pools},get busy(){return t.busy},get onDone(){return t.onDone},get onAssign(){return t.onAssign}}):f(hf,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmPut(){return t.onConfirmPut}}):f(gf,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmCall(){return t.onConfirmCall}})}function mf(t){return(()=>{var e=Wh();return c(e,f(S,{get when(){return t.toast()},keyed:!0,children:n=>(()=>{var r=jh(),i=r.firstChild,s=i.nextSibling;return G(r,"click",t.onDismiss),c(i,()=>n.msg),s.$$click=a=>{a.stopPropagation(),t.onDismiss()},w(a=>{var o=n.kind==="ok",l=n.kind==="err";return o!==a.e&&r.classList.toggle("hp-toast-ok",a.e=o),l!==a.t&&r.classList.toggle("hp-toast-err",a.t=l),a},{e:void 0,t:void 0}),r})()})),e})()}function _f(){const[t,e]=M(null),[n,r]=M(null),[i,s]=M(!1);let a;const o=()=>{clearTimeout(a),r(null)},l=(y,U="ok")=>{r({msg:y,kind:U}),clearTimeout(a),U==="ok"&&(a=setTimeout(()=>r(null),8e3))},u=()=>{var y;return((y=n())==null?void 0:y.msg)??""};Fe(()=>clearTimeout(a));const[d,h]=M(null),[g,_]=M(!1),b=async()=>{try{e(await pa())}catch(y){l(`Holdings API error: ${y.message}`,"err")}};vt(b);const T=()=>{var y;return((y=t())==null?void 0:y.positions)??[]},m=()=>{var y;return((y=t())==null?void 0:y.calls)??[]},v=()=>{var y;return((y=t())==null?void 0:y.lots)??[]},P=()=>T().map(y=>({p:{...y,kind:"put"},v:y.view})),D=()=>m().map(y=>({p:{...y,kind:"call"},v:y.view})),R=y=>y.v.pl_pct==null?-1/0:y.v.pl_pct-y.v.target_pct,O=(y,U)=>{var ee,de;const V=d();return!V||V.type!==y?null:(((ee=V.pos)==null?void 0:ee.id)??((de=V.lot)==null?void 0:de.id))===U?V:null},x=async y=>{if(g())return null;_(!0);try{return await y()}catch(U){return l(U.message,"err"),null}finally{_(!1)}},$=async()=>{var V;const y=await x(()=>ma());if(!y)return;const U=((V=y.refresh)==null?void 0:V.stale)??[];l(U.length?`Marks refreshed — ${U.length} entry(ies) unpriced (kept last mark).`:"Marks refreshed."),await b()},A=async(y,U)=>{await x(()=>On(y))&&(l(U),h(null),await b())},N=async(y,U)=>{await x(()=>On(U))&&(l(`Assigned — recorded ${U.shares} sh ${U.symbol} at $${U.basis_per_share.toFixed(2)} basis.`),h(null),await b())},I=async(y,U,V)=>{if(U==="assigned"){h({type:"put",pos:y,stage:"lot",prefill:{symbol:y.symbol,shares:y.contracts*100,basis_per_share:+(y.strike-y.premium).toFixed(2),acquired:Me()}});return}await x(()=>Dn(y.id))&&(l(U==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),h(null),await b())},k=async(y,U,V)=>{if(U==="called-away"){const ee=await x(()=>ba(y.id));if(!ee)return;l(ee.reduced?`Called away — ${y.symbol} lot reduced by ${y.contracts*100} sh.`:`Called away — call removed. ${ee.reason??""}`),h(null),await b();return}await x(()=>Dn(y.id))&&(l(U==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),h(null),await b())},B=async(y,U)=>{const V=await x(()=>Er(U?{cash:y,pool_id:U}:{cash:y}));return V?(e(Q=>({...Q??{},cash:V.cash,cash_reserved:V.cash_reserved,cash_free:V.cash_free,cash_pools:V.pool?((Q==null?void 0:Q.cash_pools)??[]).map(ee=>ee.id===V.pool.id?{...ee,...V.pool}:ee):(Q==null?void 0:Q.cash_pools)??[]})),l(V.pool?`Cash set to ${ue(V.pool.cash)} — ${ue(V.pool.free)} free in ${V.pool.name}.`:`Cash set to ${ue(V.cash)} — ${ue(V.cash_free)} free.`),!0):!1},E=()=>{var y;return((y=t())==null?void 0:y.cash_pools)??[]},[J,q]=M(null),F=()=>{const y=E();return y.length?y.find(U=>U.id===J())??y[0]:null},C=async y=>{var V;const U=await x(()=>On({kind:"pool",name:y}));return U?(l(`Pool “${y}” added — set its cash with the strip.`),q(((V=U.pool)==null?void 0:V.id)??null),await b(),!0):!1},W=async(y,U)=>{await x(()=>Er({pool_id:y,name:U}))&&(l(`Pool renamed to “${U}”.`),await b())},H=async y=>{await x(()=>Dn(y))&&(l("Pool deleted."),J()===y&&q(null),await b())},z=async(y,U)=>{var Q;const V=await x(()=>kr(y,U));V&&(l(`Put moved to ${((Q=V.position)==null?void 0:Q.pool_name)??"the pool"}.`),await b())},ce=async(y,U)=>{var Q;const V=await x(()=>kr(y.id,U));V&&(l(`${y.symbol} lot moved to ${((Q=V.lot)==null?void 0:Q.pool_name)??"the pool"}.`),await b())},Z={busy:g,onDone:()=>h(null),onConfirmPut:I,onConfirmCall:k,onAssign:N},[ve,tt]=M("lots"),oe=()=>[{id:"lots",label:"Lots",count:v().length,sub:`${v().reduce((y,U)=>y+U.shares,0)} sh held`},{id:"puts",label:"Puts",count:T().length,sub:`${T().filter(y=>y.view.pace_met).length} pace-met`},{id:"calls",label:"Calls",count:m().length,sub:`${m().filter(y=>y.view.spot_pct_vs_strike>0).length} ITM`}],L=()=>[...P()].sort((y,U)=>R(U)-R(y)),X=()=>[...D()].sort((y,U)=>R(U)-R(y)),ne={lots:{label:"+ New lot",type:"addLot"},puts:{label:"+ Sell put",type:"addPut"},calls:{label:"+ Sell call",type:"addCall"}},ge={lots:"No recorded lots — assignments land here.",puts:"No open puts — press “+ Sell put” to record one.",calls:"No open calls — press “+ Sell call” to record one."},_e=y=>{if(y==="lots")return f(S,{get when(){return v().length>0},get fallback(){return(()=>{var V=ui();return c(V,()=>ge.lots),V})()},get children(){var V=zh();return c(V,f(se,{get each(){return v()},children:Q=>f(af,{lot:Q,dialogFor:O,busy:g,get pools(){return E()},get showPool(){return E().length>1},onPoolChange:ce,onSellDialog:ee=>h({type:"sellCall",lot:ee}),onCloseDialog:ee=>h({type:"closeLot",lot:ee}),onDialogDone:()=>h(null),onSellCall:(ee,de)=>A(de,`Sold ${de.symbol} ${de.strike}C ×${de.contracts} — Refresh marks to price.`),onCloseLot:async(ee,de,dt,K)=>{await x(()=>_a(ee.id,de,dt,K))&&(l(`Closed ${de} sh ${ee.symbol} — $${(de*dt).toFixed(2)} to the pool.`),h(null),await b())}})})),V}});const U=y==="puts"?L():X();return f(S,{get when(){return U.length>0},get fallback(){return(()=>{var V=ui();return c(V,()=>ge[y]),V})()},get children(){var V=Gh();return V.firstChild,c(V,f(se,{each:U,children:Q=>f(of,{x:Q,get showPool(){return E().length>1},get pools(){return E()},onPoolChange:z,dialogFor:O,dialogActions:Z,onClose:ee=>h({type:ee.p.kind,pos:ee.p})})}),null),V}})},nt=y=>f(S,{get when(){var U,V,Q;return y==="lots"&&((U=d())==null?void 0:U.type)==="addLot"||y==="puts"&&((V=d())==null?void 0:V.type)==="addPut"||y==="calls"&&((Q=d())==null?void 0:Q.type)==="addCall"},keyed:!0,get children(){return f($n,{title:y==="lots"?"Record Share Lot":y==="puts"?"Sell Put Option":"Sell Call Option",onDone:()=>h(null),get children(){return y==="lots"?f(cf,{get pools(){return E()},busy:g,onDone:()=>h(null),onAdd:U=>A(U,`Recorded ${U.shares} sh ${U.symbol}.`)}):f(lf,{kind:y==="puts"?"put":"call",get pools(){return E()},busy:g,onDone:()=>h(null),onAdd:U=>A(U,`Sold ${U.symbol} ${U.strike}${y==="puts"?"P":"C"} ×${U.contracts} — Refresh marks to price.`)})}})}}),Yt=y=>(()=>{var U=Kh(),V=U.firstChild;return V.$$click=()=>h({type:ne[y].type}),c(V,()=>ne[y].label),c(U,f(S,{when:y==="lots",get children(){var Q=qh(),ee=Q.firstChild;return c(Q,()=>v().reduce((de,dt)=>de+dt.shares,0),ee),Q}}),null),U})(),Ms=()=>(()=>{var y=Jh();return y.$$click=$,w(()=>y.disabled=g()),y})(),Us=()=>f(S,{get when(){return u()},get children(){var y=Yh();return c(y,u),y}});return(()=>{var y=Xh(),U=y.firstChild,V=U.nextSibling,Q=V.firstChild;Q.firstChild;var ee=Q.nextSibling,de=ee.firstChild,dt=de.firstChild;return c(y,f(tf,{get cash(){var K;return((K=t())==null?void 0:K.cash)??null},get reserved(){var K;return((K=t())==null?void 0:K.cash_reserved)??0},get free(){var K;return((K=t())==null?void 0:K.cash_free)??null},get pools(){return E()},get pool(){return F()},onOpenPools:()=>s(!0)}),U),c(U,f(se,{get each(){return oe()},children:K=>(()=>{var Ie=Qh(),Tt=Ie.firstChild,Pt=Tt.nextSibling,An=Pt.nextSibling;return Ie.$$click=()=>tt(K.id),c(Tt,()=>K.label.toUpperCase()),c(Pt,()=>K.count),c(An,()=>K.sub),w(()=>Ie.classList.toggle("active",ve()===K.id)),Ie})()})),c(y,f(S,{get when(){return i()},get children(){return f(nf,{open:!0,onClose:()=>s(!1),get cash(){var K;return((K=t())==null?void 0:K.cash)??null},get reserved(){var K;return((K=t())==null?void 0:K.cash_reserved)??0},get free(){var K;return((K=t())==null?void 0:K.cash_free)??null},get pools(){return E()},get pool(){return F()},busy:g,onSaveCash:B,onSelectPool:q,onAddPool:C,onRenamePool:W,onDeletePool:H})}}),V),c(Q,f(rf,{get cash(){var K;return((K=t())==null?void 0:K.cash)??null},get reserved(){var K;return((K=t())==null?void 0:K.cash_reserved)??0},get free(){var K;return((K=t())==null?void 0:K.cash_free)??null},get pools(){return E()},get pool(){return F()},busy:g,onSaveCash:B,onSelectPool:q,onAddPool:C,onRenamePool:W,onDeletePool:H}),null),c(Q,f(se,{get each(){return oe()},children:K=>(()=>{var Ie=Zh(),Tt=Ie.firstChild,Pt=Tt.nextSibling,An=Pt.nextSibling;return Ie.$$click=()=>tt(K.id),c(Tt,()=>K.label.toUpperCase()),c(Pt,()=>K.count),c(An,()=>K.sub),w(()=>Ie.classList.toggle("active",ve()===K.id)),Ie})()}),null),c(dt,()=>oe().find(K=>K.id===ve()).label),c(de,Ms,null),c(ee,Us,null),c(ee,()=>Yt(ve()),null),c(ee,()=>nt(ve()),null),c(ee,()=>_e(ve()),null),c(y,f(mf,{toast:n,onDismiss:o}),null),y})()}Ce(["click","input","keydown"]);async function bf(t,e){let n;try{n=t.body.getReader()}catch{return"lost"}const r=new TextDecoder;let i="";try{for(;;){const{done:s,value:a}=await n.read();if(s)break;i+=r.decode(a,{stream:!0});let o;for(;(o=i.indexOf(`
+`))>=0;){const l=i.slice(0,o).replace(/\r$/,"");if(i=i.slice(o+1),!l.startsWith("data:"))continue;const u=l.slice(5).trim();if(u)try{e(JSON.parse(u))}catch{}}}return"completed"}catch{return"lost"}}var vf=p("<button type=button class=run-btn>"),yf=p("<span class=run-count>/"),wf=p("<span class=run-bar><span class=fill>"),$f=p("<li><span class=mark></span><span class=label>"),Sf=p("<div class=toast-cached>Served from cache — last run <!> min old"),kf=p('<div class="toast-cached warn">'),Ef=p("<div class=run-headline>"),Cf=p("<ul class=run-stages>"),If=p("<details class=run-errors><summary>details</summary><ul>"),Tf=p("<div class=run-warn>Closing this tab stops the run."),Pf=p("<div class=run-warn>Re-checking every 15 s…"),Af=p("<div class=run-strip>"),xf=p("<li> ");const Ns=["quotes","metrics","chains_short","chains_medium"],Os={quotes:"Quotes",metrics:"Indicators",chains_short:"Chains · 5-day",chains_medium:"Chains · 20-day"},Rf=15e3,Ds=t=>t!==null&&Date.now()>=t;function di(t){const e=Math.floor(t/60),n=t%60;return`${e}:${String(n).padStart(2,"0")}`}function Nf(t){const[e,n]=M("idle"),[r,i]=M(R()),[s,a]=M(null),[o,l]=M(0),[u,d]=M(null),[h,g]=M(null),[_,b]=M("");let T=null,m=null;const[v,P]=M(0);let D=null;st(()=>{const F=t();if(D&&(clearTimeout(D),D=null),(F==null?void 0:F.run_allowed)===!1){const C=wn(F.next_open_utc);C!==null&&(D=setTimeout(()=>P(W=>W+1),Math.max(0,C-Date.now())))}});function R(){return Object.fromEntries(Ns.map(F=>[F,{status:"pending",error:null}]))}function O(){T&&clearInterval(T),T=null,m&&clearInterval(m),m=null}function x(){l(0),T=setInterval(()=>l(F=>F+1),1e3)}function $(F){switch(F.type){case"stage_started":i(C=>({...C,[F.stage]:{status:"running",error:null}}));break;case"batch_done":a({stage:F.stage,done:F.done,total:F.total});break;case"stage_finished":i(C=>({...C,[F.stage]:{status:F.ok?"ok":"failed",error:F.error??null}}));break;case"run_finished":d(F);break}}function A(){O();const F=u(),C=((F==null?void 0:F.stages)??[]).some(W=>W.name.startsWith("chains")&&["ok","partial"].includes(W.status));n(F&&(C||F.ok)?"done":"failed"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"))}async function N(F){let C=!1;return await bf(F,W=>{$(W),W.type==="run_finished"&&(C=!0)}),C?(A(),!0):!1}async function I(F){n("detached"),m=setInterval(async()=>{var C,W,H;try{const z=await wi(),ce=((W=(C=z==null?void 0:z.result)==null?void 0:C.run)==null?void 0:W.finished_at_utc)??null;if(ce&&ce!==F){i(k(z.result)),O(),n("done"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"));return}((H=z==null?void 0:z.run_state)==null?void 0:H.status)!=="running"&&(O(),n("idle"),b("Stream lost and the run was canceled — press Run to retry."))}catch{}},Rf)}function k(F){const C=R();for(const W of(F==null?void 0:F.stages)??[])C[W.name]&&(C[W.name]={status:W.status,error:W.error});return C}async function B(){var H,z,ce;if(["starting","running","detached"].includes(e()))return;b(""),d(null),a(null),i(R()),g(null);const F=((ce=(z=(H=t())==null?void 0:H.result)==null?void 0:z.run)==null?void 0:ce.finished_at_utc)??null;n("running"),x();let C;try{C=await fa()}catch{O(),n("idle"),b("Run failed to start — network or server unreachable.");return}const W=C.headers.get("content-type")??"";if(C.ok&&W.includes("application/json")){const Z=await C.json().catch(()=>null);if(O(),n("idle"),(Z==null?void 0:Z.status)==="cached"){g(Z.age_secs),setTimeout(()=>g(null),6e3);return}}if(C.status===403&&W.includes("application/json")){const Z=await C.json().catch(()=>null);O(),n("idle"),b(Z!=null&&Z.next_open_utc?`Off-market runs are hourly — the next unlocks at ${new Date(Z.next_open_utc).toLocaleString()}.`:"Off-market runs are hourly — try again after the next hour mark.");return}if(C.status===202){const Z=await ga();if(Z.ok&&(Z.headers.get("content-type")??"").includes("text/event-stream")){await N(Z)||await I(F);return}await I(F);return}if(W.includes("text/event-stream")){await N(C)||await I(F);return}O(),n("idle"),b(`Unexpected /api/run response (${C.status}, ${W||"no type"}).`)}return Fe(()=>{O(),D&&clearTimeout(D)}),{phase:e,stageStates:r,batch:s,elapsedSecs:o,terminal:u,cachedToast:h,notice:_,triggerRun:B,isBusy:()=>["starting","running","detached"].includes(e()),runAllowed:()=>{v();const F=t();return(F==null?void 0:F.run_allowed)!==!1?!0:Ds(wn(F==null?void 0:F.next_open_utc))},nextOpenUtc:()=>{var F;return((F=t())==null?void 0:F.next_open_utc)??null}}}function Of(t){const e=()=>!t.run.runAllowed(),n=()=>ys(t.run.nextOpenUtc()),r=()=>t.run.phase()==="running"?"Run…":t.run.phase()==="detached"?"Run in progress":e()?n()?`Run at ${n()}`:"Run locked":"▶ Run pipeline";return(()=>{var i=vf();return i.$$click=()=>t.run.triggerRun(),c(i,r),w(s=>{var a=t.run.isBusy()||e(),o=e()&&t.run.nextOpenUtc()?`Off-market runs are hourly — next unlocks at ${new Date(t.run.nextOpenUtc()).toLocaleString()}`:void 0;return a!==s.e&&(i.disabled=s.e=a),o!==s.t&&ae(i,"title",s.t=o),s},{e:void 0,t:void 0}),i})()}function Df(t){const e=()=>{const i=t.run.stageStates()[t.name].status;return i==="pending"?"pending":i==="running"?"active":i},n=()=>({ok:"✓",partial:"△",failed:"✗",active:"◦",pending:"·"})[e()],r=()=>{const i=t.run.batch();return i&&i.stage===t.name&&e()==="active"?Math.round(i.done/Math.max(i.total,1)*100):null};return(()=>{var i=$f(),s=i.firstChild,a=s.nextSibling;return c(s,n),c(a,()=>Os[t.name]),c(i,f(S,{get when(){return r()!==null},get children(){return[(()=>{var o=yf(),l=o.firstChild;return c(o,()=>t.run.batch().done,l),c(o,()=>t.run.batch().total,null),o})(),(()=>{var o=wf(),l=o.firstChild;return w(u=>at(l,"width",`${r()}%`)),o})()]}}),null),w(()=>ye(i,`run-stage ${e()}`)),i})()}function Lf(t){const e=t.run,n=()=>e.terminal(),r=()=>{if(e.phase()==="detached")return"Stream lost — the run continues server-side and will be saved. Re-checking…";if(e.phase()==="running"&&!n())return["Running pipeline · elapsed ",Y(()=>di(e.elapsedSecs()))];if(n()){const s=(n().stages??[]).some(a=>a.name.startsWith("chains")&&["ok","partial"].includes(a.status));return s&&n().ok?["Run finished ✓ · ",Y(()=>di(Math.round(n().duration_secs)))]:s?"Run finished △ · what succeeded is shown below":"Run finished ✗ · nothing produced — retry allowed"}return""};return f(S,{get when(){return["running","detached"].includes(e.phase())||n()||e.cachedToast()||e.notice()},get children(){var i=Af();return c(i,f(S,{get when(){return e.cachedToast()},get children(){var s=Sf(),a=s.firstChild,o=a.nextSibling;return o.nextSibling,c(s,()=>Math.floor(e.cachedToast()/60),o),s}}),null),c(i,f(S,{get when(){return e.notice()},get children(){var s=kf();return c(s,()=>e.notice()),s}}),null),c(i,f(S,{get when(){return["running","detached"].includes(e.phase())||n()},get children(){return[(()=>{var s=Ef();return c(s,r),s})(),(()=>{var s=Cf();return c(s,()=>Ns.map(a=>f(Df,{name:a,run:e}))),s})(),f(S,{get when(){return Y(()=>!!n())()&&(n().stages??[]).some(s=>s.status!=="ok")},get children(){var s=If(),a=s.firstChild,o=a.nextSibling;return c(o,()=>(n().stages??[]).filter(l=>l.status!=="ok").map(l=>(()=>{var u=xf(),d=u.firstChild;return c(u,()=>l.status==="partial"?"△":"✗",d),c(u,()=>Os[l.name]??l.name,null),c(u,(()=>{var h=Y(()=>!!l.error);return()=>h()?`: ${l.error}`:""})(),null),u})())),s}})]}}),null),c(i,f(S,{get when(){return Y(()=>e.phase()==="running")()&&!n()},get children(){return Tf()}}),null),c(i,f(S,{get when(){return e.phase()==="detached"},get children(){return Pf()}}),null),i}})}Ce(["click"]);var Ls=p("<b>"),Mf=p("<span>Market closed · last run <b></b> ago"),Uf=p("<div class=cache-line><span></span><span class=pill>run: "),Ff=p("<span>Cached · <b></b> left"),Bf=p("<span>Stale · last run <b></b> ago"),Hf=p("<nav class=tabs role=tablist aria-label=timeframes>"),Vf=p("<button type=button role=tab class=tab>"),Wf=p("<svg><circle cx=12 cy=12 r=4></svg>",!1,!0,!1),jf=p('<svg><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></svg>',!1,!0,!1),zf=p('<button type=button class="btn-ghost theme-toggle"><svg width=14 height=14 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true>'),Gf=p('<svg><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></svg>',!1,!0,!1),qf=p('<button type=button class="btn-ghost user-pill"aria-haspopup=menu><svg width=13 height=13 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx=12 cy=7 r=4></circle></svg><span class=user-email></span><span class=user-caret aria-hidden=true>▾'),Kf=p("<div class=pop-backdrop>"),Jf=p("<div class=account-menu role=menu aria-label=account><div class=acct-label>Signed in as</div><div class=acct-email></div><button type=button class=btn-ghost role=menuitem>Manage access</button><button type=button class=btn-ghost role=menuitem>Sign out"),Yf=p("<div class=error-banner>API error: "),Xf=p("<div class=shell><header><div class=user-box></div><div class=theme-slot-head></div><h1 class=brand><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><div class=run-slot-head>"),Qf=p("<div class=hero><h2>No run yet</h2><p>Press <b>▶ Run pipeline</b> to pull quotes, compute max-drop bands / Sharpe / percentiles, then score every in-range put strike across the universe. A full run typically takes 4–7 minutes and streams live progress right here.</p><p class=muted-note>Demo data: point <code>webapp_result_file</code> (or <code>--result-file</code>) at <code>crates/webapp/fixtures/sample_last_run.json</code>.");function Zf(){const[t,e]=M(zu()),n=r=>{e(r),Gu(r)};return{visible:t,isOn:r=>t().includes(r),toggle:(r,i)=>n(i?[...t(),r]:t().filter(s=>s!==r)),reset:()=>n(Rt)}}function hi(t,e){var r;const n=(r=t==null?void 0:t.stages)==null?void 0:r.find(i=>i.name===e);return n&&n.status==="failed"?n.error??"failed":void 0}function eg(t,e){var r,i,s;const n=(i=(r=t())==null?void 0:r.timeframes)==null?void 0:i[e];return((s=n==null?void 0:n.rows)==null?void 0:s.length)??(n==null?void 0:n.row_count)??0}function fi(t){const e=Math.floor(t/60);if(e<60)return`${e} min`;const n=Math.floor(e/60),r=e%60;return r?`${n} h ${r} min`:`${n} h`}function Jn(t){return f(S,{get when(){return t.at()},get children(){return[" ","· run ",(()=>{var e=Ls();return c(e,()=>t.at()),e})()]}})}function tg(t){const[e,n]=M(0);vt(()=>{const _=setInterval(()=>n(b=>b+1),3e4);Fe(()=>clearInterval(_))});let r=Date.now(),i=0;st(Ot(()=>t.envelope,_=>{r=Date.now(),i=(_==null?void 0:_.age_secs)??0}));const s=()=>(e(),i+Math.floor((Date.now()-r)/1e3)),a=()=>t.envelope.cache_state,o=()=>t.envelope.market_open===!1,l=()=>{const _=Math.max(0,(t.envelope.cache_secs??0)-s());return _>=60?`${Math.floor(_/60)}m`:`${_}s`},u=()=>{var _,b;return id((b=(_=t.envelope.result)==null?void 0:_.run)==null?void 0:b.finished_at_utc)},d=()=>{e();const _=t.envelope.next_open_utc,b=wn(_);if(!(b===null||Ds(b)))return ys(_)},h=()=>o()&&a()==="stale"?"closed":a(),g=()=>a()==="fresh"||a()==="stale";return(()=>{var _=Uf(),b=_.firstChild,T=b.nextSibling;return T.firstChild,c(_,f(S,{get when(){return Y(()=>!!o())()&&g()},get fallback(){return f(S,{get when(){return a()==="fresh"},get fallback(){return f(S,{get when(){return a()==="stale"},get children(){var m=Bf(),v=m.firstChild,P=v.nextSibling;return P.nextSibling,c(P,()=>fi(s())),c(m,f(Jn,{at:u}),null),m}})},get children(){var m=Ff(),v=m.firstChild,P=v.nextSibling;return P.nextSibling,c(P,l),c(m,f(Jn,{at:u}),null),m}})},get children(){var m=Mf(),v=m.firstChild,P=v.nextSibling;return P.nextSibling,c(P,()=>fi(s())),c(m,f(Jn,{at:u}),null),c(m,f(S,{get when(){return d()},get children(){return[" ","· next run ",(()=>{var D=Ls();return c(D,d),D})()]}}),null),m}}),b),c(b,(()=>{var m=Y(()=>h()==="closed");return()=>m()?"market closed":a()})()),c(T,()=>{var m;return((m=t.envelope.run_state)==null?void 0:m.status)??"idle"},null),w(()=>ye(b,"pill "+h())),_})()}function gi(t){const e=[{id:"short",label:"Short · 5-day"},{id:"medium",label:"Medium · 20-day"},{id:"holdings",label:"Holdings",holdings:!0}];return(()=>{var n=Hf();return c(n,()=>e.map(r=>(()=>{var i=Vf();return i.$$click=()=>t.onTab(r.id),c(i,()=>r.label,null),c(i,(()=>{var s=Y(()=>!r.holdings);return()=>s()&&` (${Nt(eg(t.result,r.id))})`})(),null),w(s=>{var a=t.tab()===r.id,o=t.tab()===r.id;return a!==s.e&&ae(i,"aria-selected",s.e=a),o!==s.t&&i.classList.toggle("active",s.t=o),s},{e:void 0,t:void 0}),i})())),n})()}function ng(){const[t,e]=M(null),n=()=>window.matchMedia("(prefers-color-scheme: dark)").matches,r=()=>t()??(n()?"dark":"light"),i=()=>{const a=r()==="dark"?"light":"dark";document.documentElement.dataset.theme=a,e(a)},s=()=>r()==="dark"?"Switch to light theme":"Switch to dark theme";return(()=>{var a=zf(),o=a.firstChild;return a.$$click=i,c(o,f(S,{get when(){return r()==="dark"},get fallback(){return Gf()},get children(){return[Wf(),jf()]}})),w(l=>{var u=s(),d=s();return u!==l.e&&ae(a,"aria-label",l.e=u),d!==l.t&&ae(a,"title",l.t=d),l},{e:void 0,t:void 0}),a})()}function rg(){const[t,e]=M(void 0),[n,{refetch:r}]=Gs(t,v=>v?wi():void 0);vt(()=>{if(!$t){e(null);return}const v=Zl(ft(),e);Fe(v)});const[i,s]=M(!1);st(Ot(t,v=>{s(!1),!(!v||!$t)&&ca().then(P=>s(P.status===403)).catch(()=>{})})),vt(()=>{const v=()=>r();window.addEventListener("webapp:refresh-latest",v),Fe(()=>window.removeEventListener("webapp:refresh-latest",v))});const a=()=>{var v,P;return((v=t())==null?void 0:v.email)||((P=t())==null?void 0:P.uid)||""},[o,l]=M(!1),[u,d]=M(!1),h=Zf(),[g,_]=M("short"),b=()=>g()==="holdings",T=Vu(),m=Nf(()=>n());return f(S,{get when(){return t()},get fallback(){return f(Cu,{})},get children(){return[f(S,{get when(){return!i()},get fallback(){return f(Eu,{get email(){return a()},onSignOut:()=>ri()})},get children(){var v=Xf(),P=v.firstChild,D=P.firstChild,R=D.nextSibling,O=R.nextSibling,x=O.nextSibling;return c(D,f(S,{get when(){return t()},get children(){return[(()=>{var $=qf(),A=$.firstChild,N=A.nextSibling;return $.$$click=()=>l(!o()),c(N,a),w(()=>ae($,"aria-expanded",o())),$})(),f(S,{get when(){return o()},get children(){return[(()=>{var $=Kf();return $.$$click=()=>l(!1),$})(),(()=>{var $=Jf(),A=$.firstChild,N=A.nextSibling,I=N.nextSibling,k=I.nextSibling;return c(N,a),I.$$click=()=>{l(!1),d(!0)},k.$$click=()=>{l(!1),ri()},$})()]}})]}})),c(R,f(ng,{})),c(P,f(S,{get when(){return Y(()=>!n.loading)()&&!n.error},get children(){return f(tg,{get envelope(){return n()}})}}),x),c(x,f(Of,{run:m})),c(v,f(S,{get when(){return n.error},get children(){var $=Yf();return $.firstChild,c($,()=>n.error.message,null),$}}),null),c(v,f(Lf,{run:m}),null),c(v,f(S,{get when(){return b()},get children(){return[f(gi,{result:()=>{var $;return($=n())==null?void 0:$.result},tab:g,onTab:_}),f(_f,{})]}}),null),c(v,f(S,{get when(){return!b()},get children(){return f(S,{get when(){var $;return Y(()=>!n.loading)()&&(($=n())==null?void 0:$.result)},get fallback(){return f(S,{get when(){return!n.loading},get children(){return Qf()}})},children:$=>{const A=()=>$();return[f(ju,{scoring:T}),f(gi,{result:A,tab:g,onTab:_}),f(ci,{id:"short",active:()=>g()==="short",get tf(){var N;return(N=A().timeframes)==null?void 0:N.short},get stageError(){return hi(A(),"chains_short")},get stages(){return A().stages},get thresholds(){return A().thresholds},columns:h,scoring:T}),f(ci,{id:"medium",active:()=>g()==="medium",get tf(){var N;return(N=A().timeframes)==null?void 0:N.medium},get stageError(){return hi(A(),"chains_medium")},get stages(){return A().stages},get thresholds(){return A().thresholds},columns:h,scoring:T})]}})}}),null),v}}),f(S,{get when(){return u()},get children(){return f(Ru,{onClose:()=>d(!1)})}})]}})}Ce(["click"]);sa(()=>f(rg,{}),document.getElementById("root"));
diff --git a/crates/webapp/frontend/package-lock.json b/crates/webapp/frontend/package-lock.json
index 64857b3..6f9b2eb 100644
--- a/crates/webapp/frontend/package-lock.json
+++ b/crates/webapp/frontend/package-lock.json
@@ -14,6 +14,7 @@
       "devDependencies": {
         "@happy-dom/global-registrator": "^20.11.9",
         "happy-dom": "^20.11.9",
+        "playwright": "^1.64.1",
         "vite": "^6.0.0",
         "vite-plugin-solid": "^2.11.14"
       }
@@ -49,6 +50,7 @@
       "integrity": "sha512-RgHBCvtjbOK2gXSNBNIkNoEc9qoVEtau3hj8gEqKQuL3HZAibKarWFEI3Lfm6EYKkLalOh8eSrj9b+ch9H/VBA==",
       "dev": true,
       "license": "MIT",
+      "peer": true,
       "dependencies": {
         "@babel/code-frame": "^7.29.7",
         "@babel/generator": "^7.29.7",
@@ -790,6 +792,7 @@
       "resolved": "https://registry.npmjs.org/@firebase/app/-/app-0.16.1.tgz",
       "integrity": "sha512-tjUEorFyKrurH7PbLWv9zDHRuU4mLefgD/yY38D584ziorIRlQz/PVjx4c/SCGyCuUlmyzt72mK+Lh+COAywNQ==",
       "license": "Apache-2.0",
+      "peer": true,
       "dependencies": {
         "@firebase/component": "0.7.5",
         "@firebase/logger": "0.5.2",
@@ -857,6 +860,7 @@
       "resolved": "https://registry.npmjs.org/@firebase/app-compat/-/app-compat-0.5.17.tgz",
       "integrity": "sha512-5GdJWobqs6jbNYOnaQiSa4Ng8gnFerhqr7nY+v5jlnT7o9QbEeIZRLPQpnLe0TxYSWfRV2lAMbyR0kbXeIos9Q==",
       "license": "Apache-2.0",
+      "peer": true,
       "dependencies": {
         "@firebase/app": "0.16.1",
         "@firebase/component": "0.7.5",
@@ -873,6 +877,7 @@
       "resolved": "https://registry.npmjs.org/@firebase/app-types/-/app-types-0.9.6.tgz",
       "integrity": "sha512-yPLahy7Esfu2w/yme3msVK4xTkDXQqq6szfQn8yVOQpCKiT5GVFjqNpLbuz6NkX0WuTwUidkmPewW3r4xkvpeg==",
       "license": "Apache-2.0",
+      "peer": true,
       "dependencies": {
         "@firebase/logger": "0.5.2"
       }
@@ -1347,6 +1352,7 @@
       "integrity": "sha512-c/z/gaIlaaLZEuGbE6sLUuJ61tskg1JghvhcNQzW948ASBinbVBBRnZTC4b4yt4LaEtJQkYlyzqLHcutFwEIvA==",
       "hasInstallScript": true,
       "license": "Apache-2.0",
+      "peer": true,
       "dependencies": {
         "tslib": "^2.1.0"
       },
@@ -2063,6 +2069,7 @@
         }
       ],
       "license": "MIT",
+      "peer": true,
       "dependencies": {
         "baseline-browser-mapping": "^2.11.12",
         "caniuse-lite": "^1.0.30001809",
@@ -2557,6 +2564,7 @@
       "integrity": "sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==",
       "dev": true,
       "license": "MIT",
+      "peer": true,
       "engines": {
         "node": ">=12"
       },
@@ -2564,6 +2572,35 @@
         "url": "https://github.com/sponsors/jonschlinkert"
       }
     },
+    "node_modules/playwright": {
+      "version": "1.64.1",
+      "resolved": "https://registry.npmjs.org/playwright/-/playwright-1.64.1.tgz",
+      "integrity": "sha512-HCrVhHr5QQuwYoswEUGTb7gGp522yflbv/ST8nF4sFWGuLjQCt17Q/EubpGGSNKYn1tsTCPZxqHhHCfVURu7UA==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "dependencies": {
+        "playwright-core": "1.64.1"
+      },
+      "bin": {
+        "playwright": "cli.js"
+      },
+      "engines": {
+        "node": ">=20"
+      }
+    },
+    "node_modules/playwright-core": {
+      "version": "1.64.1",
+      "resolved": "https://registry.npmjs.org/playwright-core/-/playwright-core-1.64.1.tgz",
+      "integrity": "sha512-BC4s8y6SEVA6Q1rSxZTto8hI1KUI3xXlHGZgvGqP4IqPdI/a6FX9H29IDNz7vKo9l21b6LfYosScPL6M3xxyDQ==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "bin": {
+        "playwright-core": "cli.js"
+      },
+      "engines": {
+        "node": ">=20"
+      }
+    },
     "node_modules/postcss": {
       "version": "8.5.26",
       "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.26.tgz",
@@ -2715,6 +2752,7 @@
       "resolved": "https://registry.npmjs.org/seroval/-/seroval-1.5.6.tgz",
       "integrity": "sha512-rVQVWjjSvlINzaQPZH5JFqsqEsIWdTxY3iJZCnTL/5gQbXIRooVZKI60tVCkOVfzcRPejboxO2t0P89dg5mQaA==",
       "license": "MIT",
+      "peer": true,
       "engines": {
         "node": ">=10"
       }
@@ -2736,6 +2774,7 @@
       "resolved": "https://registry.npmjs.org/solid-js/-/solid-js-1.9.15.tgz",
       "integrity": "sha512-EeiY2xfpZJqPLjXspVEKjAII4yv8NyG//NxZ3IpOFHdUNnnTyL0uJOeS9LWGvA7cFCz5y94cjFwYlmw5Luncsg==",
       "license": "MIT",
+      "peer": true,
       "dependencies": {
         "csstype": "^3.1.0",
         "seroval": "~1.5.4",
@@ -2859,6 +2898,7 @@
       "integrity": "sha512-NTKlcQjlAK7MlQoyb6LgaqHc8sso/pVyUJYWMws3jg21uTJw/LddqIFPcPqP6PzpgbIcZyKI85sFE4HBrQDA8A==",
       "dev": true,
       "license": "MIT",
+      "peer": true,
       "dependencies": {
         "esbuild": "^0.25.0",
         "fdir": "^6.4.4",
diff --git a/crates/webapp/frontend/package.json b/crates/webapp/frontend/package.json
index c2a1edd..897d860 100644
--- a/crates/webapp/frontend/package.json
+++ b/crates/webapp/frontend/package.json
@@ -17,7 +17,8 @@
   "devDependencies": {
     "@happy-dom/global-registrator": "^20.11.9",
     "happy-dom": "^20.11.9",
+    "playwright": "^1.64.1",
     "vite": "^6.0.0",
     "vite-plugin-solid": "^2.11.14"
   }
-}
\ No newline at end of file
+}
diff --git a/crates/webapp/frontend/preview-holdings.html b/crates/webapp/frontend/preview-holdings.html
new file mode 100644
index 0000000..6819488
--- /dev/null
+++ b/crates/webapp/frontend/preview-holdings.html
@@ -0,0 +1,12 @@
+<!doctype html>
+<html lang="en">
+  <head>
+    <meta charset="utf-8" />
+    <meta name="viewport" content="width=device-width, initial-scale=1" />
+    <title>Holdings Preview · MarketInt</title>
+  </head>
+  <body>
+    <div id="root"></div>
+    <script type="module" src="/src/preview-holdings.jsx"></script>
+  </body>
+</html>
diff --git a/crates/webapp/frontend/src/components/HoldingsPanel.jsx b/crates/webapp/frontend/src/components/HoldingsPanel.jsx
index f78c30f..84dd399 100644
--- a/crates/webapp/frontend/src/components/HoldingsPanel.jsx
+++ b/crates/webapp/frontend/src/components/HoldingsPanel.jsx
@@ -68,6 +68,153 @@ function MiniBar(props) {
   );
 }
 
+/* ── mobile cash summary bar (<=900px) ─────────────────────────── */
+
+function CashSummaryBar(props) {
+  const sel = () => props.pool;
+  const cash = () => (sel() ? sel().cash : props.cash);
+  const reserved = () => (sel() ? sel().reserved : props.reserved);
+  const free = () => (sel() ? sel().free : props.free);
+  const poolName = () => (sel() ? sel().name : "All Pools");
+
+  return (
+    <div class="hp-cash-bar">
+      <div class="hp-cash-bar-headline">
+        <span class="hp-cash-bar-total">
+          {cash() == null ? "—" : money(cash())} <span style={{ "font-size": "0.85rem", "font-weight": "500", color: "var(--muted)" }}>cash</span>
+        </span>
+        <span class="hp-cash-bar-free">
+          {free() == null ? "—" : money(free())} <span style={{ "font-size": "0.85rem", "font-weight": "500", color: "var(--muted)" }}>free</span>
+        </span>
+      </div>
+      <div class="hp-cash-bar-subline">
+        <span class="hp-cash-bar-reserved">
+          {money(reserved())} reserved · {poolName()}
+        </span>
+        <button
+          type="button"
+          class="btn hp-pool-sheet-btn"
+          onClick={props.onOpenPools}
+        >
+          Accounts / Pools
+        </button>
+      </div>
+    </div>
+  );
+}
+
+/* ── mobile pool manager sheet modal ───────────────────────────── */
+
+function PoolManagerSheet(props) {
+  const [editing, setEditing] = createSignal(false);
+  const [editPool, setEditPool] = createSignal(null);
+  const [newName, setNewName] = createSignal("");
+  const pools = () => props.pools ?? [];
+  const sel = () => props.pool;
+  const cash = () => (sel() ? sel().cash : props.cash);
+  const reserved = () => (sel() ? sel().reserved : props.reserved);
+  const free = () => (sel() ? sel().free : props.free);
+  const neverSet = () => cash() == null;
+
+  const editCash = (poolId) => {
+    if (poolId && poolId !== sel()?.id) props.onSelectPool(poolId);
+    setEditPool(poolId ?? null);
+    setEditing(true);
+  };
+  const editorCash = () => {
+    const p = pools().find((x) => x.id === editPool());
+    return p ? p.cash : props.cash;
+  };
+  const submitAdd = async () => {
+    if (!newName().trim() || props.busy?.()) return;
+    if (await props.onAddPool(newName().trim())) setNewName("");
+  };
+
+  return (
+    <div class="hp-pool-sheet" hidden={!props.open}>
+      <div class="hp-sheet-backdrop" onClick={props.onClose} />
+      <div class="hp-sheet-container" role="dialog" aria-modal="true" aria-label="Manage Cash and Pools">
+        <div class="hp-sheet-header">
+          <div class="hp-sheet-title">Accounts & Cash Pools</div>
+          <button type="button" class="hp-sheet-close" aria-label="Close sheet" onClick={props.onClose}>
+            ×
+          </button>
+        </div>
+        <div class="hp-sheet-body">
+          <div class="hp-rail-block">
+            <div class="hp-rail-label">{sel() ? `${sel().name} — free to sell puts` : "Total Free Cash"}</div>
+            <div class="hp-rail-big">{free() == null ? "—" : money(free())}</div>
+            <div class="hp-rail-sub">
+              {cash() == null ? "—" : money(cash())} cash − {money(reserved())} reserved
+            </div>
+            <Show
+              when={!editing()}
+              fallback={
+                <CashEditor
+                  cash={editorCash()}
+                  busy={props.busy}
+                  onSave={async (n) => {
+                    const res = await props.onSaveCash(n, editPool());
+                    if (res) setEditing(false);
+                  }}
+                  onCancel={() => setEditing(false)}
+                />
+              }
+            >
+              <button
+                type="button"
+                class="btn-ghost hp-cash-edit"
+                onClick={() => editCash(sel()?.id ?? null)}
+              >
+                {neverSet() ? "set cash" : "edit cash"}
+              </button>
+            </Show>
+          </div>
+          <div class="hp-pool-section">
+            <Show when={pools().length > 0}>
+              <div class="hp-pool-list">
+                <For each={pools()}>
+                  {(p) => (
+                    <PoolRow
+                      pool={p}
+                      selected={sel()?.id === p.id}
+                      busy={props.busy}
+                      onSelect={() => {
+                        setEditing(false);
+                        props.onSelectPool(p.id);
+                      }}
+                      onEditCash={() => editCash(p.id)}
+                      onRename={(name) => props.onRenamePool(p.id, name)}
+                      onDelete={() => props.onDeletePool(p.id)}
+                    />
+                  )}
+                </For>
+              </div>
+            </Show>
+            <div class="hp-pool-row hp-pool-add" style={{ "margin-top": "0.5rem" }}>
+              <input
+                placeholder="new pool name"
+                aria-label="new pool name"
+                value={newName()}
+                onInput={(e) => setNewName(e.target.value)}
+                onKeyDown={(e) => e.key === "Enter" && submitAdd()}
+              />
+              <button type="button" class="btn" disabled={!newName().trim() || props.busy?.()} onClick={submitAdd}>
+                add
+              </button>
+            </div>
+          </div>
+        </div>
+        <div class="hp-sheet-footer">
+          <button type="button" class="btn btn-primary" onClick={props.onClose}>
+            Done
+          </button>
+        </div>
+      </div>
+    </div>
+  );
+}
+
 /* ── rail ──────────────────────────────────────────────────────── */
 
 function CashEditor(props) {
@@ -285,23 +432,19 @@ function PoolRow(props) {
 const SPOT_SESSION_LABELS = { PreMarket: "pre", AfterHours: "post", OverNight: "overnight" };
 
 function LotRailRow(props) {
+  const [expanded, setExpanded] = createSignal(false);
   const l = props.lot;
   const v = () => l.view;
-  // The headline price IS the latest known price (extended-hours R3/R4):
-  // when the mark names a source session, a small muted tag says which one
-  // (e.g. `overnight` on a weekend). No tag = the regular-session price.
+
   return (
     <div class="hp-slot">
-      {/* One bordered card per lot — info AND its action buttons enclosed
-          together, so a button can't read as belonging to the next lot
-          below it (lots have no card otherwise, unlike the option rows). */}
-      <div class="hp-lot-card">
-        <div class="hp-lot-row">
-          <div class="hp-lot-row-top">
-            <span>
-              {l.shares} sh {l.symbol}
-              {/* Lot IS the shares' pool — the picker re-homes the lot (PATCH,
-                  a field rewrite) exactly like a put's picker. */}
+      <div class="hp-pos-card hp-lot-card hp-lot-row">
+        <div class="hp-card-summary" onClick={() => setExpanded((e) => !e)}>
+          <div class="hp-lot-row-top hp-card-top">
+            <span class="hp-card-symbol-line">
+              <span class="hp-card-symbol">
+                {l.shares} sh {l.symbol}
+              </span>
               <Show
                 when={(props.pools?.length ?? 0) > 1}
                 fallback={<Show when={props.showPool}><span class="hp-pool-tag">{l.pool_name ?? "Main"}</span></Show>}
@@ -310,6 +453,7 @@ function LotRailRow(props) {
                   class="hp-pool-pick"
                   aria-label={`cash pool for ${l.symbol} lot`}
                   value={l.pool_id ?? props.pools?.[0]?.id ?? ""}
+                  onClick={(e) => e.stopPropagation()}
                   onChange={(e) => props.onPoolChange?.(l, e.currentTarget.value)}
                 >
                   <For each={props.pools}>{(p) => <option value={p.id}>{p.name}</option>}</For>
@@ -323,56 +467,80 @@ function LotRailRow(props) {
               </Show>
             </b>
           </div>
-          <div class="hp-lot-row-sub">
+
+          <div class="hp-lot-row-sub hp-card-main">
             <span>
               bought {money2(l.basis_per_share)} · {l.acquired}
             </span>
-            <b class={(v().pl_dollars ?? 0) >= 0 ? "holdings-pos" : "holdings-neg"}>
+            <b class="hp-card-pl" classList={{ "holdings-pos": (v().pl_dollars ?? 0) >= 0, "holdings-neg": (v().pl_dollars ?? 0) < 0 }}>
               <Show when={v().pl_dollars != null} fallback="—">
                 {`${money(v().pl_dollars)} (${(v().pl_pct ?? 0) >= 0 ? "+" : ""}${pct(v().pl_pct, 1)})`}
               </Show>
             </b>
           </div>
-          <div class="hp-lot-row-meta">
-            <i>last {ageText(l.mark?.as_of) || "—"}</i>
-            <i>
-              covered {v().covered}/{v().capacity}
-            </i>
-          </div>
-        </div>
-        <div class="hp-lot-actions">
-          {/* pool pickers render inside both forms when the ledger has 2+ pools */}
-          <Show when={v().capacity > 0}>
+
+          <div class="hp-lot-actions hp-card-actions">
+            <Show when={v().capacity > 0}>
+              <button
+                type="button"
+                class="btn-ghost holdings-close-btn"
+                onClick={(e) => {
+                  e.stopPropagation();
+                  props.onSellDialog(l);
+                }}
+              >
+                sell call…
+              </button>
+            </Show>
             <button
               type="button"
               class="btn-ghost holdings-close-btn"
-              onClick={() => props.onSellDialog(l)}
+              onClick={(e) => {
+                e.stopPropagation();
+                props.onCloseDialog(l);
+              }}
             >
-              sell call…
+              close…
             </button>
-          </Show>
-          <button
-            type="button"
-            class="btn-ghost holdings-close-btn"
-            onClick={() => props.onCloseDialog(l)}
-          >
-            close…
-          </button>
+          </div>
+        </div>
+
+        {/* Secondary details drawer */}
+        <div class="hp-card-drawer" hidden={!expanded()}>
+          <div class="hp-lot-row-meta">
+            <i>last price {ageText(l.mark?.as_of) || "—"}</i>
+            <i>
+              covered {v().covered}/{v().capacity}
+            </i>
+          </div>
+          <div class="holdings-preview">
+            Total Value: {v().value == null ? "—" : money(v().value)} · Account: {l.pool_name ?? "Main"}
+          </div>
         </div>
       </div>
       <Show when={props.dialogFor("sellCall", l.id)} keyed>
         {(d) => (
-          <SellCallForm lot={d.lot} onDone={props.onDialogDone} onSell={props.onSellCall} />
+          <HoldingsActionSheet
+            title={`Sell covered call · ${d.lot.shares} sh ${d.lot.symbol}`}
+            onDone={props.onDialogDone}
+          >
+            <SellCallForm lot={d.lot} onDone={props.onDialogDone} onSell={props.onSellCall} />
+          </HoldingsActionSheet>
         )}
       </Show>
       <Show when={props.dialogFor("closeLot", l.id)} keyed>
         {(d) => (
-          <CloseLotForm
-            lot={d.lot}
-            busy={props.busy}
+          <HoldingsActionSheet
+            title={`Close lot · ${d.lot.shares} sh ${d.lot.symbol}`}
             onDone={props.onDialogDone}
-            onClose={props.onCloseLot}
-          />
+          >
+            <CloseLotForm
+              lot={d.lot}
+              busy={props.busy}
+              onDone={props.onDialogDone}
+              onClose={props.onCloseLot}
+            />
+          </HoldingsActionSheet>
         )}
       </Show>
     </div>
@@ -382,107 +550,167 @@ function LotRailRow(props) {
 /* ── list rows ─────────────────────────────────────────────────── */
 
 function OptionRow(props) {
+  const [expanded, setExpanded] = createSignal(false);
   const x = props.x; // { p, v }
   const itm = () => x.v.spot_pct_vs_strike != null && x.v.spot_pct_vs_strike > 0;
   const spotDanger = () =>
     x.p.kind === "call" ? x.v.spot_pct_vs_strike > 0 : x.v.spot_pct_vs_strike < 0;
+
   return (
     <div class="hp-slot">
-      <div class="hp-list-row" classList={{ "hp-row-met": x.v.pace_met }}>
-        <span class="hp-list-pos">
-          <span class="hp-kind" data-kind={x.p.kind}>
-            {x.p.kind.toUpperCase()}
-          </span>
-          <b>
-            {x.p.symbol} {x.p.strike}
-            {x.p.kind === "put" ? "P" : "C"} ×{x.p.contracts}
-          </b>
-          {/* Calls don't reserve cash and their pool is fixed at creation —
-              an indicator pill, not the put's reassignment picker. */}
-          <Show when={x.p.kind === "call" && props.showPool}>
-            <span class="hp-pool-tag">{x.p.pool_name}</span>
-          </Show>
-          {/* Which pool of cash this put spends (server-resolved name;
-              hidden on single-pool ledgers where there's nothing to tell).
-              Multi-pool ledgers get a picker — the reservation follows the
-              choice server-side (cash pools R4). */}
-          <Show when={x.p.kind === "put" && props.showPool}>
-            <select
-              class="hp-pool-pick"
-              aria-label={`cash pool for ${x.p.symbol} ${x.p.strike} put`}
-              value={props.pools?.find((p) => p.name === x.p.pool_name)?.id ?? ""}
-              disabled={props.dialogActions?.busy?.()}
-              onChange={(e) => props.onPoolChange?.(x.p.id, e.target.value)}
-            >
-              <For each={props.pools}>
-                {(p) => <option value={p.id}>{p.name}</option>}
-              </For>
-            </select>
-          </Show>
-          <i>
-            exp {x.p.expiry} · {x.v.days_elapsed}/{x.v.days_total} wd
-          </i>
-        </span>
-        <span class={x.v.pl_pct >= 0 ? "holdings-pos" : "holdings-neg"}>
-          {x.v.pl_pct == null ? "—" : `${x.v.pl_pct >= 0 ? "+" : ""}${pct(x.v.pl_pct, 1)}`}
-        </span>
-        <span class="hp-list-pace">
-          <MiniBar v={x.v} />
-          <i>target {pct(x.v.target_pct)}</i>
-        </span>
-        <span class="hp-list-status">
-          <Show when={x.v.pace_met} fallback={<span class="chip normal">holding</span>}>
-            <span class="chip high">buy back?</span>
-          </Show>
-          <Show when={x.p.kind === "call" && itm()}>
-            <span class="chip high">ITM — called away?</span>
-          </Show>
-        </span>
-        <button
-          type="button"
-          class="btn-ghost holdings-close-btn"
-          onClick={() => props.onClose(x)}
+      <div
+        class="hp-pos-card hp-list-row"
+        classList={{ "hp-row-met": x.v.pace_met }}
+      >
+        <div
+          class="hp-card-summary"
+          onClick={() => setExpanded((e) => !e)}
         >
-          close…
-        </button>
-        {/* Full stats line — sold at / now mid + age / spot vs strike
-            (danger-colored in the kind's ITM direction) / close captures. */}
-        <div class="holdings-card-stats hp-list-stats">
-          <div>
-            <span>sold at</span>
-            <b>{money2(x.p.premium)}</b>
+          <div class="hp-card-top">
+            <span class="hp-list-pos hp-card-symbol-line">
+              <span class="hp-kind" data-kind={x.p.kind}>
+                {x.p.kind.toUpperCase()}
+              </span>
+              <b class="hp-card-symbol">
+                {x.p.symbol} {x.p.strike}
+                {x.p.kind === "put" ? "P" : "C"} ×{x.p.contracts}
+              </b>
+              <Show when={x.p.kind === "call" && props.showPool}>
+                <span class="hp-pool-tag">{x.p.pool_name}</span>
+              </Show>
+              <Show when={x.p.kind === "put" && props.showPool}>
+                <select
+                  class="hp-pool-pick"
+                  aria-label={`cash pool for ${x.p.symbol} ${x.p.strike} put`}
+                  value={props.pools?.find((p) => p.name === x.p.pool_name)?.id ?? ""}
+                  disabled={props.dialogActions?.busy?.()}
+                  onClick={(e) => e.stopPropagation()}
+                  onChange={(e) => props.onPoolChange?.(x.p.id, e.target.value)}
+                >
+                  <For each={props.pools}>
+                    {(p) => <option value={p.id}>{p.name}</option>}
+                  </For>
+                </select>
+              </Show>
+            </span>
+            <span class="hp-card-pl" classList={{ "holdings-pos": x.v.pl_pct >= 0, "holdings-neg": x.v.pl_pct < 0 }}>
+              {x.v.pl_pct == null ? "—" : `${x.v.pl_pct >= 0 ? "+" : ""}${pct(x.v.pl_pct, 1)}`}
+              <Show when={x.v.pl_dollars != null}>
+                <span style={{ "font-size": "0.85rem", "font-weight": "600", "margin-left": "4px" }}>
+                  ({money(x.v.pl_dollars)})
+                </span>
+              </Show>
+            </span>
           </div>
-          <div>
-            <span>now (mid)</span>
-            <b>{x.p.mark == null ? "—" : x.p.mark.mid.toFixed(2)}</b>
-            <i>{x.p.mark == null ? "unpriced" : ageText(x.p.mark.as_of)}</i>
+
+          <div class="hp-card-main">
+            <span class="hp-card-meta">
+              exp {x.p.expiry} · {x.v.days_elapsed}/{x.v.days_total} wd
+            </span>
+            <span class="hp-list-status">
+              <Show when={x.v.pace_met} fallback={<span class="chip normal">holding</span>}>
+                <span class="chip high">buy back?</span>
+              </Show>
+              <Show when={x.p.kind === "call" && itm()}>
+                <span class="chip high">ITM — called away?</span>
+              </Show>
+            </span>
           </div>
-          <div>
-            <span>spot</span>
-            <Show when={x.p.mark?.underlying_price != null} fallback={<b>—</b>}>
-              <b>{x.p.mark.underlying_price.toFixed(2)}</b>
-              <i class={spotDanger() && x.v.spot_pct_vs_strike != null ? "holdings-neg" : "holdings-pos"}>
-                {x.v.spot_pct_vs_strike == null
-                  ? ""
-                  : `${x.v.spot_pct_vs_strike >= 0 ? "+" : ""}${pct(x.v.spot_pct_vs_strike, 1)} vs strike`}
-              </i>
-            </Show>
+
+          <div class="hp-card-actions">
+            <button
+              type="button"
+              class="btn-ghost holdings-close-btn"
+              onClick={(e) => {
+                e.stopPropagation();
+                props.onClose(x);
+              }}
+            >
+              close…
+            </button>
           </div>
-          <div>
-            <span>close captures</span>
-            <b class={(x.v.pl_dollars ?? 0) >= 0 ? "holdings-pos" : "holdings-neg"}>
-              {x.v.pl_dollars == null ? "—" : money2(x.v.pl_dollars)}
-            </b>
+        </div>
+
+        {/* Secondary details drawer */}
+        <div class="hp-card-drawer" hidden={!expanded()}>
+          <div class="hp-list-pace" style={{ display: "flex", "align-items": "center", gap: "10px" }}>
+            <MiniBar v={x.v} />
+            <i style={{ "font-size": "0.85rem", color: "var(--muted)" }}>target {pct(x.v.target_pct)}</i>
+          </div>
+          <div class="holdings-card-stats hp-list-stats">
+            <div>
+              <span>sold at</span>
+              <b>{money2(x.p.premium)}</b>
+            </div>
+            <div>
+              <span>now (mid)</span>
+              <b>{x.p.mark == null ? "—" : x.p.mark.mid.toFixed(2)}</b>
+              <i>{x.p.mark == null ? "unpriced" : ageText(x.p.mark.as_of)}</i>
+            </div>
+            <div>
+              <span>spot</span>
+              <Show when={x.p.mark?.underlying_price != null} fallback={<b>—</b>}>
+                <b>{x.p.mark.underlying_price.toFixed(2)}</b>
+                <i class={spotDanger() && x.v.spot_pct_vs_strike != null ? "holdings-neg" : "holdings-pos"}>
+                  {x.v.spot_pct_vs_strike == null
+                    ? ""
+                    : `${x.v.spot_pct_vs_strike >= 0 ? "+" : ""}${pct(x.v.spot_pct_vs_strike, 1)} vs strike`}
+                </i>
+              </Show>
+            </div>
+            <div>
+              <span>close captures</span>
+              <b class={(x.v.pl_dollars ?? 0) >= 0 ? "holdings-pos" : "holdings-neg"}>
+                {x.v.pl_dollars == null ? "—" : money2(x.v.pl_dollars)}
+              </b>
+            </div>
           </div>
         </div>
       </div>
       <Show when={props.dialogFor(x.p.kind, x.p.id)} keyed>
-        {(d) => <ClosePanel d={d} pools={props.pools} {...props.dialogActions} />}
+        {(d) => (
+          <HoldingsActionSheet
+            title={
+              d.type === "put" && d.stage === "lot"
+                ? "Record assigned shares"
+                : `Close ${d.pos.symbol} ${d.pos.strike}${d.type === "put" ? "P" : "C"} ×${d.pos.contracts}`
+            }
+            onDone={props.dialogActions?.onDone}
+          >
+            <ClosePanel d={d} pools={props.pools} {...props.dialogActions} />
+          </HoldingsActionSheet>
+        )}
       </Show>
     </div>
   );
 }
 
+/* ── focused mobile action sheet container ──────────────────────── */
+
+function HoldingsActionSheet(props) {
+  return (
+    <div class="hp-action-sheet" role="dialog" aria-modal="true" aria-label={props.title || "Position Action"}>
+      <div class="hp-sheet-backdrop" onClick={props.onDone} />
+      <div class="hp-sheet-container">
+        <div class="hp-sheet-header">
+          <div class="hp-sheet-title">{props.title}</div>
+          <button
+            type="button"
+            class="hp-sheet-close hp-sheet-cancel"
+            aria-label="Close"
+            onClick={props.onDone}
+          >
+            ×
+          </button>
+        </div>
+        <div class="hp-sheet-body">
+          {props.children}
+        </div>
+      </div>
+    </div>
+  );
+}
+
 /* ── forms ─────────────────────────────────────────────────────── */
 
 /* Free-field option sell — one form for both sides (kind-less = put, the
@@ -509,6 +737,14 @@ function OptionForm(props) {
     [f().strike, f().premium, f().contracts].every((x) => Number(x) > 0) &&
     f().expiry > f().sold &&
     f().sold <= todayET();
+  const hint = () => {
+    if (!f().symbol.trim()) return "Please enter a stock symbol (e.g. AAPL, NVDA).";
+    if (!f().strike || Number(f().strike) <= 0) return "Please enter a positive strike price.";
+    if (!f().premium || Number(f().premium) <= 0) return "Please enter a positive option premium.";
+    if (!f().contracts || Number(f().contracts) < 1) return "Contracts must be at least 1.";
+    if (f().expiry <= f().sold) return "Expiration date must be after the sold date.";
+    return null;
+  };
   return (
     <form
       class="holdings-add"
@@ -568,10 +804,13 @@ function OptionForm(props) {
       <label>
         expiry <input type="date" value={f().expiry} onInput={set("expiry")} />
       </label>
+      <Show when={hint()}>
+        <div class="hp-form-hint">{hint()}</div>
+      </Show>
       <button type="submit" class="btn btn-primary" disabled={!valid() || props.busy?.()}>
         {kind === "call" ? "Sell call" : "Sell put"}
       </button>
-      <button type="button" class="btn" onClick={props.onDone}>
+      <button type="button" class="btn hp-sheet-cancel" onClick={props.onDone}>
         Cancel
       </button>
       <Show when={kind === "call"}>
@@ -595,6 +834,12 @@ function AddLotForm(props) {
   const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
   const valid = () =>
     f().symbol.trim() && Number(f().shares) > 0 && Number(f().basis_per_share) > 0;
+  const hint = () => {
+    if (!f().symbol.trim()) return "Please enter a stock symbol (e.g. AAPL, GOOG).";
+    if (!f().shares || Number(f().shares) <= 0) return "Shares must be at least 1.";
+    if (!f().basis_per_share || Number(f().basis_per_share) <= 0) return "Please enter a positive cost basis per share.";
+    return null;
+  };
   return (
     <form
       class="holdings-add"
@@ -634,10 +879,13 @@ function AddLotForm(props) {
       <label>
         acquired <input type="date" value={f().acquired} onInput={set("acquired")} />
       </label>
+      <Show when={hint()}>
+        <div class="hp-form-hint">{hint()}</div>
+      </Show>
       <button type="submit" class="btn btn-primary" disabled={!valid() || props.busy?.()}>
         Record lot
       </button>
-      <button type="button" class="btn" onClick={props.onDone}>
+      <button type="button" class="btn hp-sheet-cancel" onClick={props.onDone}>
         Cancel
       </button>
     </form>
@@ -662,6 +910,14 @@ function SellCallForm(props) {
     Number(f().contracts) >= 1 &&
     Number(f().contracts) <= capacity() &&
     f().expiry > todayET();
+  const hint = () => {
+    if (!f().strike || Number(f().strike) <= 0) return "Please enter a positive strike price.";
+    if (!f().premium || Number(f().premium) <= 0) return "Please enter a positive premium.";
+    if (!f().contracts || Number(f().contracts) < 1) return "Contracts must be at least 1.";
+    if (Number(f().contracts) > capacity()) return `Contracts cannot exceed lot capacity of ${capacity()}.`;
+    if (f().expiry <= todayET()) return "Expiration date must be in the future.";
+    return null;
+  };
   return (
     <div class="holdings-outcome">
       <div class="holdings-outcome-head">
@@ -697,10 +953,13 @@ function SellCallForm(props) {
         <label>
           expiry <input type="date" value={f().expiry} onInput={set("expiry")} />
         </label>
+        <Show when={hint()}>
+          <div class="hp-form-hint">{hint()}</div>
+        </Show>
         <button type="submit" class="btn btn-primary" disabled={!valid() || props.busy?.()}>
           Sell call
         </button>
-        <button type="button" class="btn" onClick={props.onDone}>
+        <button type="button" class="btn hp-sheet-cancel" onClick={props.onDone}>
           Cancel
         </button>
       </form>
@@ -716,6 +975,11 @@ function CloseLotForm(props) {
   const price = () => Number(f().price);
   const valid = () =>
     Number.isInteger(shares()) && shares() >= 1 && shares() <= lot.shares && price() > 0;
+  const hint = () => {
+    if (!shares() || shares() < 1 || shares() > lot.shares) return `Shares to close must be between 1 and ${lot.shares}.`;
+    if (!price() || price() <= 0) return "Please enter a positive sale price per share.";
+    return null;
+  };
   const proceeds = () => (valid() ? shares() * price() : null);
   // Proceeds return to the lot's own pool — no override (the money
   // physically lands in the account where the shares were held).
@@ -748,10 +1012,13 @@ function CloseLotForm(props) {
             {`${shares()} sh × $${price().toFixed(2)} → $${proceeds().toFixed(2)} → pool ${lot.pool_name ?? "Main"}`}
           </i>
         </Show>
+        <Show when={hint()}>
+          <div class="hp-form-hint">{hint()}</div>
+        </Show>
         <button type="submit" class="btn btn-primary" disabled={!valid() || props.busy?.()}>
           Close {shares() === lot.shares ? "lot" : `${shares()} sh`}
         </button>
-        <button type="button" class="btn" onClick={props.onDone}>
+        <button type="button" class="btn hp-sheet-cancel" onClick={props.onDone}>
           Cancel
         </button>
       </form>
@@ -765,6 +1032,12 @@ function PutCloseDialog(props) {
   const pos = props.d.pos;
   const [outcome, setOutcome] = createSignal("bought-back");
   const [price, setPrice] = createSignal(pos.mark?.mid?.toFixed(2) ?? "");
+  const hint = () => {
+    if (outcome() !== "expired" && (!price() || !Number.isFinite(Number(price())) || Number(price()) < 0)) {
+      return "Please enter a valid price per share.";
+    }
+    return null;
+  };
   // Realized P&L preview — the one client-side computation (see file header).
   const realized = () => {
     if (outcome() === "expired") return pos.premium * 100 * pos.contracts;
@@ -819,8 +1092,11 @@ function PutCloseDialog(props) {
           </b>
         </Show>
       </div>
+      <Show when={hint()}>
+        <div class="hp-form-hint">{hint()}</div>
+      </Show>
       <div class="holdings-outcome-actions">
-        <button type="button" class="btn" onClick={props.onDone}>
+        <button type="button" class="btn hp-sheet-cancel" onClick={props.onDone}>
           Cancel
         </button>
         <button
@@ -854,6 +1130,12 @@ function AssignedLotForm(props) {
   const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
   const valid = () =>
     f().symbol.trim() && Number(f().shares) > 0 && Number(f().basis_per_share) > 0;
+  const hint = () => {
+    if (!f().symbol.trim()) return "Please enter a stock symbol.";
+    if (!f().shares || Number(f().shares) <= 0) return "Shares must be greater than 0.";
+    if (!f().basis_per_share || Number(f().basis_per_share) <= 0) return "Cost basis must be greater than 0.";
+    return null;
+  };
   return (
     <div class="holdings-outcome">
       <div class="holdings-outcome-head">Record assigned shares</div>
@@ -899,10 +1181,13 @@ function AssignedLotForm(props) {
         <label>
           acquired <input type="date" value={f().acquired} onInput={set("acquired")} />
         </label>
+        <Show when={hint()}>
+          <div class="hp-form-hint">{hint()}</div>
+        </Show>
         <button type="submit" class="btn btn-primary" disabled={!valid() || props.busy?.()}>
           Record lot
         </button>
-        <button type="button" class="btn" onClick={props.onDone}>
+        <button type="button" class="btn hp-sheet-cancel" onClick={props.onDone}>
           Cancel
         </button>
       </form>
@@ -914,6 +1199,12 @@ function CallCloseDialog(props) {
   const pos = props.d.pos;
   const [outcome, setOutcome] = createSignal("bought-back");
   const [price, setPrice] = createSignal(pos.mark?.mid?.toFixed(2) ?? "");
+  const hint = () => {
+    if (outcome() !== "expired" && (!price() || !Number.isFinite(Number(price())) || Number(price()) < 0)) {
+      return "Please enter a valid price per share.";
+    }
+    return null;
+  };
   const realized = () => {
     if (outcome() === "expired") return pos.premium * 100 * pos.contracts;
     const close = Number(price());
@@ -967,8 +1258,11 @@ function CallCloseDialog(props) {
           </b>
         </Show>
       </div>
+      <Show when={hint()}>
+        <div class="hp-form-hint">{hint()}</div>
+      </Show>
       <div class="holdings-outcome-actions">
-        <button type="button" class="btn" onClick={props.onDone}>
+        <button type="button" class="btn hp-sheet-cancel" onClick={props.onDone}>
           Cancel
         </button>
         <button
@@ -1003,19 +1297,63 @@ function ClosePanel(props) {
   );
 }
 
+/* ── floating viewport toast notice (R5) ────────────────────────── */
+
+function ToastNotice(props) {
+  return (
+    <div class="hp-toast-container" aria-live="polite">
+      <Show when={props.toast()} keyed>
+        {(t) => (
+          <div
+            class="hp-toast holdings-notice"
+            classList={{
+              "hp-toast-ok": t.kind === "ok",
+              "hp-toast-err": t.kind === "err",
+            }}
+            onClick={props.onDismiss}
+            role="alert"
+          >
+            <span class="hp-toast-msg">{t.msg}</span>
+            <button
+              type="button"
+              class="hp-toast-dismiss"
+              aria-label="Dismiss notice"
+              onClick={(e) => {
+                e.stopPropagation();
+                props.onDismiss();
+              }}
+            >
+              ×
+            </button>
+          </div>
+        )}
+      </Show>
+    </div>
+  );
+}
+
 /* ── the panel ─────────────────────────────────────────────────── */
 
 export default function HoldingsPanel() {
   const [ledger, setLedger] = createSignal(null);
-  const [notice, setNotice] = createSignal("");
+  const [toast, setToast] = createSignal(null); // { msg: string, kind: 'ok' | 'err' }
+  const [poolSheetOpen, setPoolSheetOpen] = createSignal(false);
   let flashTimer;
-  // One timer at a time: an overlapping flash must not let the previous
-  // timer wipe the newer message early (and nothing fires after unmount).
-  const flash = (msg) => {
-    setNotice(msg);
+
+  const dismissToast = () => {
     clearTimeout(flashTimer);
-    flashTimer = setTimeout(() => setNotice(""), 4000);
+    setToast(null);
   };
+
+  // 8-second duration for successes, sticky for errors until dismissed
+  const flash = (msg, kind = "ok") => {
+    setToast({ msg, kind });
+    clearTimeout(flashTimer);
+    if (kind === "ok") {
+      flashTimer = setTimeout(() => setToast(null), 8000);
+    }
+  };
+  const notice = () => toast()?.msg ?? "";
   onCleanup(() => clearTimeout(flashTimer));
 
   // The one open panel: {type:'put'|'call'|'sellCall'|'addPut'|'addCall'
@@ -1030,7 +1368,7 @@ export default function HoldingsPanel() {
     try {
       setLedger(await getHoldings());
     } catch (err) {
-      flash(`Holdings API error: ${err.message}`);
+      flash(`Holdings API error: ${err.message}`, "err");
     }
   };
   onMount(load);
@@ -1060,7 +1398,7 @@ export default function HoldingsPanel() {
     try {
       return await fn();
     } catch (err) {
-      flash(err.message);
+      flash(err.message, "err");
       return null;
     } finally {
       setBusy(false);
@@ -1364,34 +1702,39 @@ export default function HoldingsPanel() {
       }
       keyed
     >
-      {id === "lots" ? (
-        <AddLotForm
-          pools={pools()}
-          busy={busy}
-          onDone={() => setDialog(null)}
-          onAdd={(f) => onAdd(f, `Recorded ${f.shares} sh ${f.symbol}.`)}
-        />
-      ) : (
-        <OptionForm
-          kind={id === "puts" ? "put" : "call"}
-          pools={pools()}
-          busy={busy}
-          onDone={() => setDialog(null)}
-          onAdd={(f) =>
-            onAdd(
-              f,
-              `Sold ${f.symbol} ${f.strike}${id === "puts" ? "P" : "C"} ×${f.contracts} — Refresh marks to price.`
-            )
-          }
-        />
-      )}
+      <HoldingsActionSheet
+        title={id === "lots" ? "Record Share Lot" : id === "puts" ? "Sell Put Option" : "Sell Call Option"}
+        onDone={() => setDialog(null)}
+      >
+        {id === "lots" ? (
+          <AddLotForm
+            pools={pools()}
+            busy={busy}
+            onDone={() => setDialog(null)}
+            onAdd={(f) => onAdd(f, `Recorded ${f.shares} sh ${f.symbol}.`)}
+          />
+        ) : (
+          <OptionForm
+            kind={id === "puts" ? "put" : "call"}
+            pools={pools()}
+            busy={busy}
+            onDone={() => setDialog(null)}
+            onAdd={(f) =>
+              onAdd(
+                f,
+                `Sold ${f.symbol} ${f.strike}${id === "puts" ? "P" : "C"} ×${f.contracts} — Refresh marks to price.`
+              )
+            }
+          />
+        )}
+      </HoldingsActionSheet>
     </Show>
   );
   const paneToolbar = (id) => (
     <div class="hp-toolbar-row">
       <button
         type="button"
-        class="btn"
+        class="btn hp-add-btn"
         onClick={() => setDialog({ type: paneAdd[id].type })}
       >
         {paneAdd[id].label}
@@ -1421,6 +1764,47 @@ export default function HoldingsPanel() {
 
   return (
     <div class="holdings-panel hp-tabs-shell">
+      <CashSummaryBar
+        cash={ledger()?.cash ?? null}
+        reserved={ledger()?.cash_reserved ?? 0}
+        free={ledger()?.cash_free ?? null}
+        pools={pools()}
+        pool={selectedPool()}
+        onOpenPools={() => setPoolSheetOpen(true)}
+      />
+      <div class="hp-mobile-tabs">
+        <For each={paneDefs()}>
+          {(t) => (
+            <button
+              type="button"
+              class="hp-mobile-tile"
+              classList={{ active: pane() === t.id }}
+              onClick={() => setPane(t.id)}
+            >
+              <span class="hp-tab-tile-name">{t.label.toUpperCase()}</span>
+              <span class="hp-tab-tile-count">{t.count}</span>
+              <div class="hp-tab-tile-sub">{t.sub}</div>
+            </button>
+          )}
+        </For>
+      </div>
+      <Show when={poolSheetOpen()}>
+        <PoolManagerSheet
+          open={true}
+          onClose={() => setPoolSheetOpen(false)}
+          cash={ledger()?.cash ?? null}
+          reserved={ledger()?.cash_reserved ?? 0}
+          free={ledger()?.cash_free ?? null}
+          pools={pools()}
+          pool={selectedPool()}
+          busy={busy}
+          onSaveCash={onSaveCash}
+          onSelectPool={setPoolSelId}
+          onAddPool={onAddPool}
+          onRenamePool={onRenamePool}
+          onDeletePool={onDeletePool}
+        />
+      </Show>
       <div class="hp-tabs-grid">
         <aside class="hp-tabs-rail">
           <div class="hp-tabs-brand">Wheel ledger</div>
@@ -1465,6 +1849,7 @@ export default function HoldingsPanel() {
           {paneRows(pane())}
         </main>
       </div>
+      <ToastNotice toast={toast} onDismiss={dismissToast} />
     </div>
   );
 }
diff --git a/crates/webapp/frontend/src/preview-holdings.jsx b/crates/webapp/frontend/src/preview-holdings.jsx
new file mode 100644
index 0000000..6a15c8a
--- /dev/null
+++ b/crates/webapp/frontend/src/preview-holdings.jsx
@@ -0,0 +1,175 @@
+import { render } from "solid-js/web";
+import HoldingsPanel from "./components/HoldingsPanel";
+import "./style.css";
+
+// Realistic senior-investor wheel ledger
+const PREVIEW_LEDGER = {
+  schema_version: 1,
+  cash: 125000,
+  cash_reserved: 40000,
+  cash_free: 85000,
+  cash_pools: [
+    { id: "main-ira", name: "Main Retirement (IRA)", cash: 75000, reserved: 25000, free: 50000 },
+    { id: "ibkr-tax", name: "IBKR Active Account", cash: 50000, reserved: 15000, free: 35000 },
+  ],
+  positions: [
+    {
+      id: "p1",
+      symbol: "NVDA",
+      strike: 125,
+      expiry: "2026-11-06",
+      premium: 3.40,
+      contracts: 2,
+      sold: "2026-10-10",
+      pool_id: "main-ira",
+      pool_name: "Main Retirement (IRA)",
+      mark: { mid: 0.95, as_of: new Date().toISOString(), underlying_price: 139.50 },
+      view: {
+        pl_dollars: 490.0,
+        pl_pct: 0.72,
+        pace_per_day_dollars: 35.0,
+        pace_per_day_pct: 0.05,
+        days_elapsed: 14,
+        days_total: 27,
+        target_pct: 0.51,
+        pace_met: true,
+        spot_pct_vs_strike: (139.50 - 125) / 125,
+      },
+    },
+    {
+      id: "p2",
+      symbol: "MSFT",
+      strike: 420,
+      expiry: "2026-11-20",
+      premium: 4.80,
+      contracts: 1,
+      sold: "2026-10-18",
+      pool_id: "ibkr-tax",
+      pool_name: "IBKR Active Account",
+      mark: { mid: 3.10, as_of: new Date().toISOString(), underlying_price: 432.20 },
+      view: {
+        pl_dollars: 170.0,
+        pl_pct: 0.354,
+        pace_per_day_dollars: 28.0,
+        pace_per_day_pct: 0.06,
+        days_elapsed: 6,
+        days_total: 33,
+        target_pct: 0.18,
+        pace_met: true,
+        spot_pct_vs_strike: (432.20 - 420) / 420,
+      },
+    },
+    {
+      id: "p3",
+      symbol: "TSLA",
+      strike: 210,
+      expiry: "2026-11-13",
+      premium: 4.10,
+      contracts: 1,
+      sold: "2026-10-20",
+      pool_id: "main-ira",
+      pool_name: "Main Retirement (IRA)",
+      mark: { mid: 3.45, as_of: new Date().toISOString(), underlying_price: 219.00 },
+      view: {
+        pl_dollars: 65.0,
+        pl_pct: 0.158,
+        pace_per_day_dollars: 16.0,
+        pace_per_day_pct: 0.04,
+        days_elapsed: 4,
+        days_total: 24,
+        target_pct: 0.16,
+        pace_met: false,
+        spot_pct_vs_strike: (219.00 - 210) / 210,
+      },
+    },
+  ],
+  lots: [
+    {
+      id: "l1",
+      symbol: "AAPL",
+      shares: 200,
+      basis_per_share: 215.50,
+      acquired: "2026-09-15",
+      pool_id: "main-ira",
+      pool_name: "Main Retirement (IRA)",
+      mark: { as_of: new Date().toISOString() },
+      view: {
+        value: 46560.0,
+        pl_dollars: 3460.0,
+        pl_pct: 3460 / 43100,
+        capacity: 1,
+        covered: 1,
+        spot: 232.80,
+        spot_as_of: new Date().toISOString(),
+        age_days: 39,
+      },
+    },
+    {
+      id: "l2",
+      symbol: "GOOG",
+      shares: 100,
+      basis_per_share: 170.20,
+      acquired: "2026-10-02",
+      pool_id: "ibkr-tax",
+      pool_name: "IBKR Active Account",
+      mark: { as_of: new Date().toISOString() },
+      view: {
+        value: 17850.0,
+        pl_dollars: 830.0,
+        pl_pct: 830 / 17020,
+        capacity: 1,
+        covered: 0,
+        spot: 178.50,
+        spot_as_of: new Date().toISOString(),
+        age_days: 22,
+      },
+    },
+  ],
+  calls: [
+    {
+      id: "c1",
+      symbol: "AAPL",
+      strike: 240,
+      expiry: "2026-11-13",
+      premium: 2.80,
+      contracts: 1,
+      sold: "2026-10-12",
+      pool_id: "main-ira",
+      pool_name: "Main Retirement (IRA)",
+      mark: { mid: 0.85, as_of: new Date().toISOString(), underlying_price: 232.80 },
+      view: {
+        pl_dollars: 195.0,
+        pl_pct: 0.696,
+        pace_per_day_dollars: 16.0,
+        pace_per_day_pct: 0.05,
+        days_elapsed: 12,
+        days_total: 32,
+        target_pct: 0.375,
+        pace_met: true,
+        spot_pct_vs_strike: (232.80 - 240) / 240,
+      },
+    },
+  ],
+};
+
+// Client-side mock for screenshot preview
+window.fetch = async (url, opts = {}) => {
+  const method = opts.method || "GET";
+  if (url.includes("/api/holdings")) {
+    return new Response(JSON.stringify(PREVIEW_LEDGER), {
+      status: 200,
+      headers: { "Content-Type": "application/json" },
+    });
+  }
+  return new Response(JSON.stringify({ status: "ok" }), {
+    status: 200,
+    headers: { "Content-Type": "application/json" },
+  });
+};
+
+const params = new URLSearchParams(window.location.search);
+if (params.get("theme")) {
+  document.documentElement.dataset.theme = params.get("theme");
+}
+
+render(() => <HoldingsPanel />, document.getElementById("root"));
diff --git a/crates/webapp/frontend/src/smoke-entry.jsx b/crates/webapp/frontend/src/smoke-entry.jsx
index 287a3f4..a85bf3f 100644
--- a/crates/webapp/frontend/src/smoke-entry.jsx
+++ b/crates/webapp/frontend/src/smoke-entry.jsx
@@ -1161,6 +1161,158 @@ ok("reset restores production view", qa("#root " + rowsSel).length === 1);
   );
 }
 
+// ── R1: Senior-friendly typography and touch target styling tokens ──
+{
+  const testTile = document.createElement("button");
+  testTile.className = "hp-tab-tile";
+  document.body.appendChild(testTile);
+  const cs = window.getComputedStyle(testTile);
+  ok("R1: tab tile min-height is at least 44px", parseFloat(cs.minHeight) >= 44);
+
+  const testBtn = document.createElement("button");
+  testBtn.className = "holdings-close-btn";
+  document.body.appendChild(testBtn);
+  const csBtn = window.getComputedStyle(testBtn);
+  ok("R1: close button min-height is at least 44px", parseFloat(csBtn.minHeight) >= 44);
+  ok("R1: close button font size is at least 12px", parseFloat(csBtn.fontSize) >= 12);
+}
+
+// ── Feature Acceptance: Elderly-Friendly Mobile Holdings E2E ──
+{
+  const HP = (await import("./components/HoldingsPanel")).default;
+  const e2eLedger = {
+    schema_version: 1,
+    cash: 50000,
+    cash_pools: [
+      { id: "main", name: "Main", cash: 30000 },
+      { id: "ibkr", name: "IBKR", cash: 20000 },
+    ],
+    positions: [
+      {
+        id: "e2e-p1",
+        symbol: "NVDA",
+        strike: 120,
+        expiry: "2026-10-30",
+        premium: 2.5,
+        contracts: 1,
+        sold: "2026-10-15",
+        pool_id: "main",
+        mark: { mid: 1.0, as_of: "2026-10-20T19:00:00Z", underlying_price: 135.0 },
+        view: {
+          pl_dollars: 150.0,
+          pl_pct: 0.6,
+          pace_per_day_dollars: 30.0,
+          pace_per_day_pct: 0.12,
+          days_elapsed: 5,
+          days_total: 15,
+          target_pct: 0.33,
+          pace_met: true,
+          spot_pct_vs_strike: (135 - 120) / 120,
+        },
+      },
+    ],
+    lots: [
+      {
+        id: "e2e-l1",
+        symbol: "AAPL",
+        shares: 100,
+        basis_per_share: 220.0,
+        acquired: "2026-10-01",
+        pool_id: "ibkr",
+        mark: { as_of: "2026-10-20T19:00:00Z" },
+        view: {
+          value: 23500.0,
+          pl_dollars: 1500.0,
+          pl_pct: 1500 / 22000,
+          capacity: 1,
+          covered: 0,
+          spot: 235.0,
+          spot_as_of: "2026-10-20T19:00:00Z",
+          age_days: 19,
+        },
+      },
+    ],
+    calls: [
+      {
+        id: "e2e-c1",
+        symbol: "MSFT",
+        strike: 450,
+        expiry: "2026-11-06",
+        premium: 3.0,
+        contracts: 1,
+        sold: "2026-10-18",
+        pool_id: "main",
+        mark: { mid: 1.5, as_of: "2026-10-20T19:00:00Z", underlying_price: 440.0 },
+        view: {
+          pl_dollars: 150.0,
+          pl_pct: 0.5,
+          pace_per_day_dollars: 75.0,
+          pace_per_day_pct: 0.25,
+          days_elapsed: 2,
+          days_total: 19,
+          target_pct: 0.1,
+          pace_met: true,
+          spot_pct_vs_strike: (440 - 450) / 450,
+        },
+      },
+    ],
+  };
+
+  const jsonRes = (v) =>
+    new Response(JSON.stringify(v), { status: 200, headers: { "Content-Type": "application/json" } });
+  globalThis.fetch = async (path, opts = {}) => {
+    return jsonRes(e2eLedger);
+  };
+
+  const div = document.createElement("div");
+  div.id = "e2e-root";
+  document.body.appendChild(div);
+  render(() => <HP />, div);
+  await tick();
+  await tick();
+  await tick();
+
+  // 1. Mobile Cash Summary Bar & Pool Manager Sheet
+  const cashBar = div.querySelector(".hp-cash-bar");
+  ok("E2E: mobile cash summary bar renders with accounts button", !!cashBar && !!cashBar.querySelector(".hp-pool-sheet-btn"));
+  const poolSheetBtn = cashBar?.querySelector(".hp-pool-sheet-btn");
+  poolSheetBtn?.click();
+  await tick();
+  const poolSheet = div.querySelector(".hp-pool-sheet");
+  ok("E2E: pool manager sheet opens on button tap", !!poolSheet && !poolSheet.hidden);
+  poolSheet?.querySelector(".hp-sheet-close")?.click();
+  await tick();
+  ok("E2E: pool manager sheet closes", !div.querySelector(".hp-pool-sheet:not([hidden])"));
+
+  // 2. Position Cards with Progressive Disclosure
+  const posCards = div.querySelectorAll(".hp-pos-card");
+  ok("E2E: position cards render in collapsed state", posCards.length >= 1 && !posCards[0].querySelector(".hp-card-drawer:not([hidden])"));
+  const firstCardBody = posCards[0]?.querySelector(".hp-card-summary") || posCards[0];
+  firstCardBody?.click();
+  await tick();
+  ok("E2E: tapping position card toggles secondary drawer open", !!div.querySelector(".hp-pos-card .hp-card-drawer:not([hidden])"));
+  firstCardBody?.click();
+  await tick();
+  ok("E2E: tapping position card collapses secondary drawer", !div.querySelector(".hp-pos-card .hp-card-drawer:not([hidden])"));
+
+  // 3. Focused Action Sheet & Validation Hints
+  const sellPutBtn = div.querySelector(".hp-add-btn");
+  sellPutBtn?.click();
+  await tick();
+  const actionSheet = div.querySelector(".hp-action-sheet");
+  ok("E2E: action button opens focused action sheet", !!actionSheet && !actionSheet.hidden);
+  const hint = actionSheet?.querySelector(".hp-form-hint");
+  const submitBtn = actionSheet?.querySelector('button[type="submit"]');
+  ok("E2E: action sheet shows validation helper and disables submit when inputs incomplete", !!hint && submitBtn?.disabled);
+  actionSheet?.querySelector(".hp-sheet-cancel")?.click();
+  await tick();
+  ok("E2E: cancel button closes action sheet", !div.querySelector(".hp-action-sheet:not([hidden])"));
+
+  // 4. Floating Viewport Toast
+  ok("E2E: toast container is mounted in DOM", !!div.querySelector(".hp-toast-container"));
+  ok("R5: toast container has aria-live polite", div.querySelector(".hp-toast-container")?.getAttribute("aria-live") === "polite");
+}
+
 console.log(JSON.stringify({ total: checks.length }));
 let failedCount = 0;
 for (const [name, passed] of checks) {
diff --git a/crates/webapp/frontend/src/style.css b/crates/webapp/frontend/src/style.css
index 4f3df15..c6e540a 100644
--- a/crates/webapp/frontend/src/style.css
+++ b/crates/webapp/frontend/src/style.css
@@ -1200,66 +1200,83 @@ details.adjust .hint-custom { color: var(--accent); }
 }
 
 /* ── Holdings panel (2026-09-11-holdings, variant B) ─────────────────
+   Senior-friendly typography & touch tokens (2026-10-24).
    Cards sorted most-ahead-of-pace first; the pace bar (fill vs the amber
    target tick) is the close decision; stat strip anchors it in dollars. */
 
-
-
-
-.holdings-refresh { flex: 0 0 auto; }
+.holdings-refresh {
+  flex: 0 0 auto;
+  min-height: 44px;
+  font-size: 14px;
+  font-weight: 600;
+  display: inline-flex;
+  align-items: center;
+  justify-content: center;
+  padding: 8px 14px;
+}
 
 .holdings-notice {
   border: 1px solid var(--border);
   background: var(--panel);
-  border-left: 3px solid var(--accent);
-  padding: 6px 10px;
-  border-radius: 6px;
-  margin-bottom: 10px;
-  color: var(--muted);
+  border-left: 4px solid var(--accent);
+  padding: 10px 14px;
+  border-radius: 8px;
+  margin-bottom: 12px;
+  color: var(--ink);
+  font-size: 14px;
+  line-height: 1.4;
 }
 
 .holdings-pos { color: var(--ok); }
 .holdings-neg { color: var(--err); }
 
-
 /* add-position form: an inline row on desktop */
 .holdings-add {
   display: flex;
-  gap: 8px;
+  gap: 10px;
   align-items: center;
   flex-wrap: wrap;
   border: 1px dashed var(--border);
-  border-radius: 8px;
-  padding: 8px 10px;
+  border-radius: 10px;
+  padding: 12px 14px;
   background: var(--panel);
   flex: 1;
 }
 .holdings-add label {
   display: inline-flex;
-  gap: 4px;
+  gap: 6px;
   align-items: center;
   color: var(--muted);
-  font-size: 11px;
+  font-size: 13.5px;
+  font-weight: 600;
 }
 .holdings-add input {
   border: 1px solid var(--border);
   border-radius: 6px;
-  padding: 4px 6px;
+  padding: 6px 10px;
   font: inherit;
+  font-size: 14px;
   background: var(--page);
   color: var(--ink);
-  max-width: 110px;
+  min-height: 40px;
+  max-width: 120px;
 }
 .holdings-add input:first-child { text-transform: uppercase; }
 
-
-
-.holdings-close-btn { font-size: 11px; }
+.holdings-close-btn {
+  font-size: 13px;
+  font-weight: 600;
+  min-height: 44px;
+  padding: 6px 14px;
+  display: inline-flex;
+  align-items: center;
+  justify-content: center;
+}
 
 /* the decision bar: fill = profit%, tick = pace target */
 .holdings-bar {
   position: relative;
-  height: 10px;
+  height: 12px;
   border-radius: 999px;
   background: var(--pace-track);
   overflow: visible;
@@ -1269,56 +1286,61 @@ details.adjust .hint-custom { color: var(--accent); }
   inset: 0 auto 0 0;
   border-radius: 999px;
   background: var(--accent);
-  opacity: 0.85;
+  opacity: 0.95;
 }
 .holdings-bar-mark {
   position: absolute;
-  top: -3px;
-  bottom: -3px;
-  width: 2px;
+  top: -4px;
+  bottom: -4px;
+  width: 3px;
   background: var(--warn);
+  border-radius: 1px;
 }
 
 /* sold at / now (mid) / close captures */
 .holdings-card-stats {
   display: grid;
   grid-template-columns: repeat(4, 1fr);
-  gap: 6px;
+  gap: 8px;
   border-top: 1px solid var(--border);
-  padding-top: 8px;
+  padding-top: 10px;
 }
 .holdings-card-stats div { display: flex; flex-direction: column; min-width: 0; }
 .holdings-card-stats span {
-  font-size: 10px;
+  font-size: 12px;
+  font-weight: 600;
   text-transform: uppercase;
-  letter-spacing: 0.06em;
+  letter-spacing: 0.05em;
   color: var(--muted);
 }
-.holdings-card-stats b { font-variant-numeric: tabular-nums; font-size: 12.5px; }
-.holdings-card-stats i { font-style: normal; font-size: 10.5px; color: var(--muted); }
+.holdings-card-stats b { font-variant-numeric: tabular-nums; font-size: 14px; }
+.holdings-card-stats i { font-style: normal; font-size: 12px; color: var(--muted); }
 
 /* outcome-confirm dialog (bought back / expired / assigned) */
 .holdings-outcome {
   border: 1px solid var(--accent);
-  border-radius: 8px;
+  border-radius: 10px;
   background: var(--panel);
-  padding: 10px 12px;
+  padding: 14px 16px;
   margin-top: 10px;
-  max-width: 420px;
+  max-width: 440px;
 }
-.holdings-outcome-head { font-weight: 600; margin-bottom: 8px; }
-.holdings-outcome-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; }
-.holdings-outcome-row label { display: inline-flex; gap: 5px; align-items: center; font-size: 12px; }
-.holdings-outcome-price { display: flex; gap: 6px; align-items: center; font-size: 12px; margin-bottom: 8px; }
+.holdings-outcome-head { font-weight: 700; font-size: 15px; margin-bottom: 10px; }
+.holdings-outcome-row { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 10px; }
+.holdings-outcome-row label { display: inline-flex; gap: 6px; align-items: center; font-size: 13.5px; }
+.holdings-outcome-price { display: flex; gap: 8px; align-items: center; font-size: 13.5px; margin-bottom: 10px; }
 .holdings-outcome-price input {
   border: 1px solid var(--border);
   border-radius: 6px;
-  padding: 4px 6px;
+  padding: 6px 10px;
   font: inherit;
-  width: 90px;
+  font-size: 14px;
+  min-height: 40px;
+  width: 110px;
 }
-.holdings-outcome-realized { font-size: 12px; color: var(--muted); margin-bottom: 8px; }
-.holdings-outcome-actions { display: flex; gap: 8px; justify-content: flex-end; }
+.holdings-outcome-realized { font-size: 13.5px; color: var(--muted); margin-bottom: 10px; }
+.holdings-outcome-actions { display: flex; gap: 10px; justify-content: flex-end; }
+.holdings-outcome-actions .btn { min-height: 40px; padding: 6px 14px; font-size: 14px; }
 
 @media (max-width: 720px) {
   /* Four stat cells wrap to a 2×2 grid on phones. */
@@ -1328,17 +1350,17 @@ details.adjust .hint-custom { color: var(--accent); }
   .holdings-add {
     display: grid;
     grid-template-columns: 1fr 1fr;
-    gap: 8px 10px;
+    gap: 10px 12px;
     width: 100%;
   }
   .holdings-add label {
     display: flex;
     flex-direction: column;
     align-items: stretch;
-    gap: 2px;
+    gap: 4px;
   }
-  .holdings-add input { max-width: none; width: 100%; }
-  .holdings-add .btn, .holdings-add .btn-primary { grid-column: 1 / -1; }
+  .holdings-add input { max-width: none; width: 100%; min-height: 44px; }
+  .holdings-add .btn, .holdings-add .btn-primary { grid-column: 1 / -1; min-height: 44px; }
 }
 
 /* ── Wheel holdings, side-rail sub-tabs (2026-09-19-holdings-subtabs,
@@ -1346,219 +1368,691 @@ details.adjust .hint-custom { color: var(--accent); }
    LOTS | PUTS | CALLS as tile buttons in a sticky rail beside the active
    pane column; cash strip + Refresh marks + notice reachable from every
    tab; dialogs anchor inline under the entry that opened them. Below
-   900px the rail collapses to a horizontal tile strip (user-approved
-   prototype); list rows stack there as before. */
-.hp-tabs-shell { padding: 16px 0 0; }
+   900px the rail collapses into a compact CashSummaryBar and tile strip. */
+.hp-tabs-shell {
+  padding: 16px 0 0;
+  font-size: 14px;
+  line-height: 1.45;
+}
 .hp-tabs-grid {
-  display: grid; grid-template-columns: 13rem 1fr;
-  gap: 1.1rem; align-items: start;
+  display: grid; grid-template-columns: 14rem 1fr;
+  gap: 1.25rem; align-items: start;
 }
 .hp-tabs-rail {
-  display: flex; flex-direction: column; gap: 0.55rem;
+  display: flex; flex-direction: column; gap: 0.65rem;
   position: sticky; top: 10px;
 }
 .hp-tabs-brand {
-  font-size: 0.62rem; opacity: 0.6; text-transform: uppercase;
-  letter-spacing: 0.05em; padding: 2px 4px;
+  font-size: 0.82rem; font-weight: 700; color: var(--muted); text-transform: uppercase;
+  letter-spacing: 0.05em; padding: 4px 6px;
 }
-.hp-tab-tile {
+.hp-tab-tile,
+.hp-mobile-tile {
   width: 100%; text-align: left; appearance: none; font: inherit; cursor: pointer;
   background: var(--panel); border: 1px solid var(--border); border-radius: 10px;
-  padding: 0.6rem 0.8rem; color: var(--muted);
-}
-.hp-tab-tile.active { border-color: var(--accent); box-shadow: inset 3px 0 0 var(--accent); color: var(--ink); }
-.hp-tab-tile-name { font-weight: 700; font-size: 0.8rem; letter-spacing: 0.04em; }
-.hp-tab-tile-count { float: right; font-weight: 700; color: var(--ink); font-variant-numeric: tabular-nums; }
-.hp-tab-tile-sub { font-size: 0.68rem; margin-top: 2px; }
-.hp-tabs-main { display: flex; flex-direction: column; gap: 0.35rem; min-width: 0; }
-.hp-pane-head { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
-.hp-pane-title { font-weight: 700; font-size: 0.95rem; }
+  padding: 0.75rem 0.95rem; color: var(--muted);
+  min-height: 52px;
+  transition: border-color 0.15s, box-shadow 0.15s, color 0.15s;
+}
+.hp-tab-tile.active,
+.hp-mobile-tile.active { border-color: var(--accent); box-shadow: inset 3px 0 0 var(--accent); color: var(--ink); }
+.hp-tab-tile-name { font-weight: 700; font-size: 0.95rem; letter-spacing: 0.04em; }
+.hp-tab-tile-count { float: right; font-weight: 700; color: var(--ink); font-variant-numeric: tabular-nums; font-size: 0.95rem; }
+.hp-tab-tile-sub { font-size: 0.82rem; margin-top: 3px; color: var(--muted); }
+.hp-tabs-main { display: flex; flex-direction: column; gap: 0.5rem; min-width: 0; }
+.hp-pane-head { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem; }
+.hp-pane-title { font-weight: 700; font-size: 1.15rem; color: var(--ink); }
 .hp-pane-head .holdings-refresh { margin-left: auto; }
-.hp-pane-hint { margin-left: auto; font-size: 0.72rem; opacity: 0.6; }
+.hp-pane-hint { margin-left: auto; font-size: 0.85rem; color: var(--muted); }
 .hp-rail-block {
   background: var(--panel);
   border: 1px solid var(--border);
   border-radius: 10px;
-  padding: 0.7rem 0.9rem;
+  padding: 0.85rem 1rem;
 }
 .hp-rail-label {
-  font-size: 0.68rem;
-  opacity: 0.6;
+  font-size: 0.82rem;
+  font-weight: 600;
+  color: var(--muted);
   text-transform: uppercase;
   letter-spacing: 0.05em;
-  margin-bottom: 0.3rem;
+  margin-bottom: 0.35rem;
 }
-.hp-rail-big { font-size: 1.6rem; font-weight: 700; color: var(--ok); }
-.hp-rail-sub { font-size: 0.72rem; opacity: 0.6; margin-top: 0.15rem; }
+.hp-rail-big { font-size: 1.65rem; font-weight: 800; color: var(--ok); line-height: 1.2; }
+.hp-rail-sub { font-size: 0.85rem; color: var(--muted); margin-top: 0.25rem; }
 
-/* One card per lot (mirrors .hp-list-row): the info block and its action
-   buttons share one bordered box, so "sell call…" can't read as belonging
-   to the next lot below it. */
+/* Position Card (Universal progressive-disclosure card for Lots, Puts, Calls) */
+.hp-pos-card {
+  display: flex;
+  flex-direction: column;
+  background: var(--panel);
+  border: 1px solid var(--border);
+  border-radius: 12px;
+  overflow: hidden;
+  transition: border-color 0.15s, box-shadow 0.15s;
+}
+.hp-pos-card:hover {
+  border-color: var(--accent);
+}
+.hp-pos-card.hp-row-met {
+  border-color: var(--ok);
+}
+.hp-card-summary {
+  display: flex;
+  flex-direction: column;
+  gap: 0.5rem;
+  padding: 0.85rem 1.1rem;
+  cursor: pointer;
+  user-select: none;
+}
+.hp-card-top {
+  display: flex;
+  align-items: center;
+  justify-content: space-between;
+  gap: 0.75rem;
+}
+.hp-card-symbol-line {
+  display: flex;
+  align-items: center;
+  gap: 0.5rem;
+  flex-wrap: wrap;
+}
+.hp-card-symbol {
+  font-size: 1.15rem;
+  font-weight: 800;
+  letter-spacing: 0.02em;
+  color: var(--ink);
+}
+.hp-card-main {
+  display: flex;
+  align-items: baseline;
+  justify-content: space-between;
+  gap: 0.75rem;
+  flex-wrap: wrap;
+}
+.hp-card-meta {
+  font-size: 0.9rem;
+  color: var(--muted);
+  font-weight: 500;
+}
+.hp-card-pl {
+  font-size: 1.05rem;
+  font-weight: 700;
+  font-variant-numeric: tabular-nums;
+  display: inline-flex;
+  align-items: baseline;
+  gap: 0.35rem;
+}
+.hp-card-actions {
+  display: flex;
+  gap: 0.6rem;
+  align-items: center;
+  justify-content: flex-end;
+  padding-top: 0.35rem;
+  border-top: 1px solid var(--border);
+  margin-top: 0.2rem;
+}
+.hp-card-actions .btn,
+.hp-card-actions .holdings-close-btn {
+  min-height: 44px;
+  min-width: 44px;
+  padding: 8px 16px;
+  font-size: 13.5px;
+  font-weight: 600;
+  display: inline-flex;
+  align-items: center;
+  justify-content: center;
+  border-radius: 8px;
+}
+.hp-card-drawer {
+  padding: 0.85rem 1.1rem;
+  background: var(--page);
+  border-top: 1px solid var(--border);
+  display: flex;
+  flex-direction: column;
+  gap: 0.65rem;
+}
+.hp-card-drawer[hidden] {
+  display: none !important;
+}
+
+/* One card per lot (mirrors .hp-list-row) */
 .hp-lot-card {
   display: flex;
   flex-direction: column;
-  gap: 0.45rem;
+  gap: 0.55rem;
   background: var(--panel);
   border: 1px solid var(--border);
-  border-radius: 10px;
-  padding: 0.55rem 0.8rem;
+  border-radius: 12px;
+  padding: 0.85rem 1.1rem;
 }
-.hp-lot-row-top { display: flex; justify-content: space-between; gap: 0.6rem; font-size: 0.85rem; }
-.hp-lot-row-top b { font-variant-numeric: tabular-nums; }
+.hp-lot-row-top { display: flex; justify-content: space-between; gap: 0.75rem; font-size: 1.05rem; }
+.hp-lot-row-top b { font-variant-numeric: tabular-nums; font-size: 1.1rem; }
 .hp-lot-row-sub {
   display: flex;
   justify-content: space-between;
-  gap: 0.6rem;
-  font-size: 0.72rem;
-  opacity: 0.78;
-  margin-top: 0.1rem;
+  gap: 0.75rem;
+  font-size: 0.9rem;
+  color: var(--muted);
+  margin-top: 0.2rem;
 }
-.hp-lot-row-sub b { font-variant-numeric: tabular-nums; }
-/* Buttons pin to the card's bottom-right — the same side the option rows
-   put their close button, and far from the next card's left-aligned symbol. */
+.hp-lot-row-sub b { font-variant-numeric: tabular-nums; font-size: 1rem; }
 .hp-lot-actions {
   display: flex;
-  gap: 0.4rem;
+  gap: 0.6rem;
   justify-content: flex-end;
+  align-items: center;
+}
+.hp-lot-actions .btn,
+.hp-lot-actions .holdings-close-btn {
+  min-height: 44px;
+  min-width: 44px;
+  padding: 8px 16px;
+  font-size: 13.5px;
+  font-weight: 600;
+  display: inline-flex;
+  align-items: center;
+  justify-content: center;
 }
 .holdings-preview {
-  font-size: 0.72rem;
+  font-size: 0.9rem;
   color: var(--muted);
   font-style: normal;
+  line-height: 1.4;
 }
 .hp-pool-tag {
   display: inline-block;
-  padding: 0 0.35rem;
-  border-radius: 0.5rem;
+  padding: 0.15rem 0.55rem;
+  border-radius: 999px;
   background: var(--band-bg);
+  border: 1px solid var(--border);
   color: var(--muted);
-  font-size: 0.62rem;
-  font-weight: 600;
-  margin-left: 0.3rem;
+  font-size: 0.78rem;
+  font-weight: 700;
+  margin-left: 0.35rem;
   vertical-align: 0.05em;
+  white-space: nowrap;
 }
 .hp-spot-session {
   font-style: normal;
-  font-weight: 400;
-  font-size: 0.68rem;
+  font-weight: 600;
+  font-size: 0.8rem;
   color: var(--muted);
-  margin-left: 0.3rem;
+  margin-left: 0.35rem;
 }
 .hp-lot-row-meta {
   display: flex;
   justify-content: space-between;
-  gap: 0.6rem;
-  font-size: 0.68rem;
-  opacity: 0.55;
-  margin-top: 0.1rem;
+  gap: 0.75rem;
+  font-size: 0.85rem;
+  color: var(--muted);
+  margin-top: 0.2rem;
 }
 .hp-lot-row-meta i { font-style: normal; }
-.hp-toolbar-row { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem; }
+.hp-toolbar-row { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.5rem; }
+.hp-toolbar-row .btn {
+  min-height: 44px;
+  padding: 8px 16px;
+  font-size: 14px;
+  font-weight: 600;
+  border-radius: 8px;
+}
 
 /* Bottom margin keeps the last row clear of the viewport edge on mobile. */
-.hp-list { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem; }
+.hp-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
 .hp-list-row {
   display: grid;
-  grid-template-columns: minmax(14rem, 1.4fr) 5rem minmax(9rem, 1fr) 8rem auto;
-  gap: 0.8rem;
+  grid-template-columns: minmax(14rem, 1.4fr) 5.5rem minmax(9rem, 1fr) 8.5rem auto;
+  gap: 0.9rem;
   align-items: center;
   background: var(--panel);
   border: 1px solid var(--border);
-  border-radius: 10px;
-  padding: 0.55rem 0.8rem;
+  border-radius: 12px;
+  padding: 0.75rem 1rem;
 }
 .hp-list-row.hp-row-met { border-color: var(--ok); }
 .hp-list-head {
   background: transparent;
   border: 0;
-  padding: 0.1rem 0.8rem;
-  font-size: 0.68rem;
-  opacity: 0.55;
+  padding: 0.2rem 1rem;
+  font-size: 0.82rem;
+  color: var(--muted);
+  font-weight: 600;
   text-transform: uppercase;
   letter-spacing: 0.05em;
 }
-.hp-list-pos { display: flex; align-items: baseline; gap: 0.5rem; flex-wrap: wrap; }
+.hp-list-pos { display: flex; align-items: baseline; gap: 0.55rem; flex-wrap: wrap; }
 .hp-list-pos i,
-.hp-list-pace i { font-style: normal; font-size: 0.72rem; opacity: 0.6; }
+.hp-list-pace i { font-style: normal; font-size: 0.85rem; color: var(--muted); }
 .hp-kind {
-  font-size: 0.6rem;
+  font-size: 0.75rem;
   font-weight: 700;
   letter-spacing: 0.06em;
-  border-radius: 5px;
-  padding: 0.1rem 0.35rem;
+  border-radius: 6px;
+  padding: 0.15rem 0.5rem;
 }
 .hp-kind[data-kind="put"] { background: var(--kind-put-bg); color: var(--kind-put-ink); }
 .hp-kind[data-kind="call"] { background: var(--kind-call-bg); color: var(--kind-call-ink); }
-.hp-list-pace .holdings-bar { min-width: 7rem; }
-.hp-slot { display: flex; flex-direction: column; gap: 0.45rem; min-width: 0; }
-.hp-list-status { display: flex; flex-direction: column; gap: 0.25rem; align-items: flex-start; }
-.hp-list-stats { grid-column: 1 / -1; margin-top: 0.15rem; }
-.hp-cash-edit { margin-left: auto; font-size: 0.75rem; }
-.hp-cash-editor { margin-left: auto; display: flex; gap: 0.35rem; align-items: center; }
+.hp-list-pace .holdings-bar { min-width: 7.5rem; }
+.hp-slot { display: flex; flex-direction: column; gap: 0.5rem; min-width: 0; }
+.hp-list-status { display: flex; flex-direction: column; gap: 0.35rem; align-items: flex-start; }
+.hp-list-stats { grid-column: 1 / -1; margin-top: 0.25rem; }
+.hp-cash-edit { margin-left: auto; font-size: 0.85rem; min-height: 44px; display: inline-flex; align-items: center; }
+.hp-cash-editor { margin-left: auto; display: flex; gap: 0.5rem; align-items: center; }
 .hp-cash-editor input {
-  flex: 1 1 6rem;
+  flex: 1 1 7rem;
   min-width: 0;
   font: inherit;
-  padding: 0.25rem 0.45rem;
+  font-size: 14px;
+  padding: 0.4rem 0.6rem;
   border: 1px solid var(--border);
   border-radius: 6px;
   background: var(--panel);
   color: inherit;
+  min-height: 40px;
 }
-.hp-cash-editor .btn { font-size: 0.7rem; padding: 0.25rem 0.5rem; }
+.hp-cash-editor .btn { font-size: 13.5px; padding: 0.4rem 0.8rem; min-height: 40px; }
 .hp-dialog-note {
-  font-size: 0.72rem;
-  opacity: 0.65;
-  margin-top: 0.5rem;
+  font-size: 0.85rem;
+  color: var(--muted);
+  margin-top: 0.6rem;
+  border-top: 1px solid var(--border);
+  padding-top: 0.5rem;
+}
+
+/* ── Mobile Cash Summary Bar (<=900px) ────────────────────────────── */
+.hp-cash-bar,
+.hp-mobile-tabs {
+  display: none;
+}
+
+/* ── Mobile Pool Manager Sheet Modal ─────────────────────────────── */
+.hp-pool-sheet {
+  display: flex;
+  position: fixed;
+  inset: 0;
+  z-index: 1000;
+  align-items: flex-end;
+  justify-content: center;
+}
+.hp-pool-sheet[hidden] {
+  display: none !important;
+}
+
+/* ── Focused Mobile Action Sheet Container ────────────────────────── */
+.hp-action-sheet {
+  display: flex;
+  position: fixed;
+  inset: 0;
+  z-index: 1000;
+  align-items: flex-end;
+  justify-content: center;
+}
+.hp-action-sheet[hidden] {
+  display: none !important;
+}
+
+.hp-sheet-backdrop {
+  position: absolute;
+  inset: 0;
+  background: rgba(0, 0, 0, 0.6);
+  backdrop-filter: blur(2px);
+}
+
+.hp-sheet-container {
+  position: relative;
+  width: 100%;
+  max-width: 540px;
+  max-height: 85vh;
+  overflow-y: auto;
+  background: var(--panel);
+  border: 1px solid var(--border);
+  border-top-left-radius: 16px;
+  border-top-right-radius: 16px;
+  padding: 1.25rem 1.4rem;
+  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.35);
+  display: flex;
+  flex-direction: column;
+  gap: 1rem;
+}
+
+.hp-sheet-header {
+  display: flex;
+  align-items: center;
+  justify-content: space-between;
+  border-bottom: 1px solid var(--border);
+  padding-bottom: 0.75rem;
+}
+.hp-sheet-title {
+  font-size: 1.2rem;
+  font-weight: 800;
+  color: var(--ink);
+}
+.hp-sheet-close {
+  background: transparent;
+  border: none;
+  font-size: 1.5rem;
+  color: var(--muted);
+  cursor: pointer;
+  min-height: 44px;
+  min-width: 44px;
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  border-radius: 8px;
+}
+
+.hp-sheet-body {
+  display: flex;
+  flex-direction: column;
+  gap: 0.85rem;
+}
+.hp-sheet-footer {
+  display: flex;
+  gap: 0.75rem;
+  align-items: center;
+  justify-content: flex-end;
   border-top: 1px solid var(--border);
-  padding-top: 0.4rem;
+  padding-top: 0.85rem;
+}
+.hp-sheet-footer .btn {
+  min-height: 48px;
+  padding: 0 1.25rem;
+  font-size: 15px;
+  font-weight: 700;
+  border-radius: 10px;
+}
+
+/* Explicit validation helper hint */
+.hp-form-hint {
+  font-size: 0.88rem;
+  font-weight: 600;
+  color: var(--err);
+  background: var(--err-wash, rgba(224, 112, 92, 0.1));
+  border: 1px solid var(--err-line, rgba(224, 112, 92, 0.3));
+  border-radius: 8px;
+  padding: 0.6rem 0.85rem;
+  line-height: 1.35;
+}
+
+/* Action sheet interior form styling */
+.hp-action-sheet .holdings-add {
+  display: flex;
+  flex-direction: column;
+  gap: 12px;
+  border: none;
+  background: transparent;
+  padding: 0;
+  width: 100%;
+}
+.hp-action-sheet .holdings-add label {
+  display: flex;
+  flex-direction: column;
+  align-items: stretch;
+  gap: 6px;
+  font-size: 14px;
+  font-weight: 700;
+  color: var(--ink);
+}
+.hp-action-sheet .holdings-add input,
+.hp-action-sheet .holdings-add select {
+  box-sizing: border-box;
+  width: 100%;
+  max-width: 100%;
+  min-height: 48px;
+  border-radius: 8px;
+  font-size: 15px;
+  padding: 10px 12px;
+}
+.hp-action-sheet .holdings-add .btn,
+.hp-action-sheet .holdings-add .btn-primary {
+  min-height: 48px;
+  font-size: 15px;
+  font-weight: 700;
+  border-radius: 10px;
+  width: 100%;
+}
+.hp-action-sheet .hp-sheet-cancel {
+  background: transparent;
+  border: 1px solid var(--border);
+  color: var(--muted);
 }
+.hp-action-sheet .holdings-outcome {
+  border: none;
+  background: transparent;
+  padding: 0;
+  margin: 0;
+  max-width: 100%;
+}
+.hp-action-sheet .holdings-outcome-head {
+  display: none;
+}
+.hp-action-sheet .holdings-outcome-row {
+  display: flex;
+  flex-direction: column;
+  gap: 10px;
+  margin-bottom: 12px;
+}
+.hp-action-sheet .holdings-outcome-row label {
+  display: flex;
+  align-items: center;
+  gap: 10px;
+  font-size: 15px;
+  font-weight: 600;
+  min-height: 44px;
+  padding: 6px 12px;
+  background: var(--page);
+  border: 1px solid var(--border);
+  border-radius: 8px;
+  cursor: pointer;
+}
+.hp-action-sheet .holdings-outcome-price {
+  display: flex;
+  flex-direction: column;
+  align-items: stretch;
+  gap: 6px;
+  font-size: 14px;
+  font-weight: 700;
+  margin-bottom: 12px;
+}
+.hp-action-sheet .holdings-outcome-price input {
+  width: 100%;
+  min-height: 48px;
+  font-size: 15px;
+  border-radius: 8px;
+  padding: 10px 12px;
+  box-sizing: border-box;
+}
+.hp-action-sheet .holdings-outcome-realized {
+  font-size: 15px;
+  font-weight: 600;
+  margin-bottom: 12px;
+  padding: 10px 12px;
+  background: var(--page);
+  border-radius: 8px;
+}
+.hp-action-sheet .holdings-outcome-actions {
+  display: flex;
+  flex-direction: column-reverse;
+  gap: 10px;
+}
+.hp-action-sheet .holdings-outcome-actions .btn {
+  width: 100%;
+  min-height: 48px;
+  font-size: 15px;
+  font-weight: 700;
+  border-radius: 10px;
+}
+@media (min-width: 901px) {
+  .hp-action-sheet {
+    align-items: center;
+    justify-content: center;
+  }
+  .hp-sheet-container {
+    border-radius: 16px;
+    max-height: 80vh;
+  }
+}
+
+/* ── Floating Viewport Toast (R5) ─────────────────────────────────── */
+.hp-toast-container {
+  position: fixed;
+  bottom: 24px;
+  left: 50%;
+  transform: translateX(-50%);
+  z-index: 1100;
+  display: flex;
+  flex-direction: column;
+  align-items: center;
+  gap: 8px;
+  pointer-events: none;
+  width: 90%;
+  max-width: 460px;
+}
+.hp-toast {
+  pointer-events: auto;
+  display: flex;
+  align-items: center;
+  justify-content: space-between;
+  gap: 12px;
+  width: 100%;
+  padding: 12px 18px;
+  border-radius: 12px;
+  font-size: 14.5px;
+  font-weight: 600;
+  line-height: 1.4;
+  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
+  animation: hpToastIn 0.25s ease-out;
+}
+@keyframes hpToastIn {
+  from { opacity: 0; transform: translateY(16px); }
+  to { opacity: 1; transform: translateY(0); }
+}
+.hp-toast-ok {
+  background: var(--ok);
+  color: #ffffff;
+  border: 1px solid rgba(255, 255, 255, 0.2);
+}
+.hp-toast-err {
+  background: var(--err);
+  color: #ffffff;
+  border: 1px solid rgba(255, 255, 255, 0.2);
+}
+.hp-toast-dismiss {
+  background: transparent;
+  border: none;
+  color: inherit;
+  font-size: 1.4rem;
+  cursor: pointer;
+  min-height: 44px;
+  min-width: 44px;
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  border-radius: 6px;
+  opacity: 0.9;
+}
+.hp-toast-dismiss:hover {
+  opacity: 1;
+}
+
 @media (max-width: 900px) {
-  /* The rail collapses to a horizontal tile strip (brand line, full-width
-     cash strip, three flex tiles) and the list rows stack — further
-     compaction happens below 720px. */
+  /* Mobile layout: Cash summary bar replaces desktop sidebar rail */
   .hp-tabs-grid { grid-template-columns: 1fr; }
-  .hp-tabs-rail { position: static; flex-direction: row; flex-wrap: wrap; align-items: stretch; }
-  .hp-tabs-brand { width: 100%; }
-  .hp-tabs-rail .hp-rail-block {
-    flex: 1 1 100%;
-    display: flex; align-items: baseline; gap: 0.6rem;
-    flex-wrap: wrap;
+  .hp-tabs-rail { display: none; }
+
+  .hp-cash-bar {
+    display: flex;
+    flex-direction: column;
+    gap: 0.4rem;
+    background: var(--panel);
+    border: 1px solid var(--border);
+    border-radius: 12px;
+    padding: 0.75rem 1rem;
+    margin-bottom: 0.6rem;
   }
-  .hp-tabs-rail .hp-rail-big { font-size: 1.15rem; }
-  /* The pool list wraps to its own full-width line under the figures. */
-  .hp-tabs-rail .hp-pool-section { flex: 1 1 100%; }
-  .hp-tab-tile { flex: 1; width: auto; }
-  .hp-pane-head .hp-pane-title { display: none; }
-  .hp-list-row.hp-list-head { display: none; }
-  .hp-list-row { display: flex; flex-direction: column; align-items: stretch; gap: 0.45rem; }
-  /* Deterministic two-line head: kind + symbol + pool picker on the first
-     line (picker pinned right), exp meta always on its own line below —
-     wrap-by-accident depending on name lengths is not okay. */
-  .hp-list-pos { justify-content: flex-start; }
-  .hp-list-pos .hp-pool-pick { margin-left: auto; }
-  .hp-list-pos .hp-pool-tag { margin-left: auto; }
-  .hp-list-pos > i { flex: 1 1 100%; }
-  .hp-list-pace { display: flex; flex-direction: column; gap: 0.15rem; }
-  .hp-list-status { flex-direction: row; flex-wrap: wrap; }
-  .hp-list-row .holdings-close-btn { align-self: flex-end; }
-  /* Lot row: pool picker pinned to the row-head's right edge, matching
-     the put row (the price stays rightmost, picker beside it). */
-  .hp-lot-row-top > span:first-of-type {
+  .hp-cash-bar-headline {
+    display: flex;
+    justify-content: space-between;
+    align-items: baseline;
+    gap: 0.5rem;
+  }
+  .hp-cash-bar-total {
+    font-size: 1.25rem;
+    font-weight: 800;
+    color: var(--ink);
+  }
+  .hp-cash-bar-free {
+    font-size: 1.15rem;
+    font-weight: 800;
+    color: var(--ok);
+  }
+  .hp-cash-bar-subline {
+    display: flex;
+    justify-content: space-between;
+    align-items: center;
+    gap: 0.5rem;
+  }
+  .hp-cash-bar-reserved {
+    font-size: 0.88rem;
+    color: var(--muted);
+    font-weight: 500;
+  }
+  .hp-pool-sheet-btn {
+    min-height: 44px;
+    min-width: 44px;
+    padding: 0 1rem;
+    font-size: 13.5px;
+    font-weight: 700;
+    border-radius: 8px;
     display: inline-flex;
     align-items: center;
-    gap: 0.3rem;
+    justify-content: center;
+    background: var(--band-bg);
+    border: 1px solid var(--border);
+    color: var(--ink);
+    cursor: pointer;
+  }
+
+  /* Mobile sub-tabs tile strip under cash bar */
+  .hp-mobile-tabs {
+    display: flex;
+    gap: 0.5rem;
+    margin-bottom: 0.6rem;
+  }
+  .hp-mobile-tabs .hp-tab-tile,
+  .hp-mobile-tabs .hp-mobile-tile {
     flex: 1;
+    min-height: 52px;
+    padding: 0.6rem 0.5rem;
+    text-align: center;
+  }
+  .hp-mobile-tabs .hp-tab-tile-count {
+    float: none;
+    margin-left: 0.35rem;
+  }
+
+  .hp-pane-head .hp-pane-title { display: none; }
+  .hp-list-row.hp-list-head { display: none; }
+
+  /* Mobile touch target minimum 44px enforcement */
+  .holdings-close-btn,
+  .hp-pool-act,
+  .hp-pool-del,
+  .hp-pool-pick,
+  .hp-tabs-main .btn,
+  .hp-pool-sheet-btn,
+  .hp-sheet-close,
+  .hp-toast-dismiss {
+    min-height: 44px;
+    min-width: 44px;
+    font-size: 14px;
   }
-  .hp-lot-row-top .hp-pool-pick { margin-left: auto; }
-}
-@media (max-width: 720px) {
-  .hp-cash-editor { margin-left: 0; }
 }
 
 @media (max-width: 480px) {
-  .hp-tab-tile { padding: 0.5rem 0.6rem; }
-  .hp-tab-tile-sub { font-size: 0.62rem; }
+  .hp-tab-tile { padding: 0.55rem 0.5rem; }
+  .hp-tab-tile-sub { font-size: 0.8rem; }
 }
 
 /* ── Dark mode (2026-09-23-dark-mode) ─────────────────────────────────
@@ -1722,54 +2216,71 @@ html[data-theme="light"] {
 }
 
 /* ── cash pools rail UI (2026-09-23-holdings-cash-pools; list UX after
-   preview feedback — always-visible rows, no manage toggle) ── */
-.hp-pool-section { display: flex; flex-direction: column; gap: 0.3rem; margin-top: 0.45rem; }
-.hp-pool-list { display: flex; flex-direction: column; gap: 0.25rem; }
+   preview feedback — always-visible rows, accessible touch tokens) ── */
+.hp-pool-section { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.65rem; }
+.hp-pool-list { display: flex; flex-direction: column; gap: 0.45rem; }
 .hp-pool-item {
   border: 1px solid var(--border);
-  border-radius: 7px;
-  padding: 0.25rem 0.4rem;
+  border-radius: 8px;
+  padding: 0.5rem 0.65rem;
+  background: var(--panel);
 }
 .hp-pool-item.active { border-color: var(--accent); }
 /* The name takes a full line with the delete button at its right; cash +
-   actions wrap onto a second line — in the 13rem rail one line for all of
-   it leaves the name zero-width. */
-.hp-pool-line { display: flex; flex-wrap: wrap; gap: 0.3rem 0.45rem; align-items: center; min-width: 0; }
-.hp-pool-name-row { display: flex; gap: 0.3rem; align-items: center; min-width: 0; flex: 1 1 100%; }
+   actions wrap onto a second line */
+.hp-pool-line { display: flex; flex-wrap: wrap; gap: 0.5rem 0.65rem; align-items: center; min-width: 0; }
+.hp-pool-name-row { display: flex; gap: 0.5rem; align-items: center; min-width: 0; flex: 1 1 100%; }
 .hp-pool-name {
-  font: inherit; font-size: 0.72rem; font-weight: 700; color: var(--ink);
+  font: inherit; font-size: 0.95rem; font-weight: 700; color: var(--ink);
   background: transparent; border: none; padding: 0; cursor: pointer;
   flex: 1; min-width: 0; text-align: left;
   overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
 }
 .hp-pool-item.active .hp-pool-name { color: var(--accent); }
 .hp-pool-cash {
-  font-size: 0.66rem; opacity: 0.7; white-space: nowrap;
+  font-size: 0.88rem; color: var(--muted); white-space: nowrap;
   font-variant-numeric: tabular-nums;
+  font-weight: 600;
+}
+.hp-pool-act {
+  font-size: 0.82rem;
+  font-weight: 600;
+  padding: 0.25rem 0.6rem;
+  border-radius: 6px;
+  cursor: pointer;
 }
-.hp-pool-act { font-size: 0.6rem; padding: 0.05rem 0.3rem; }
-.hp-pool-row { display: flex; gap: 0.3rem; align-items: center; }
+.hp-pool-row { display: flex; gap: 0.45rem; align-items: center; }
 .hp-pool-row input {
-  flex: 1; min-width: 0; font: inherit; font-size: 0.7rem;
-  padding: 0.15rem 0.35rem; border: 1px solid var(--border); border-radius: 5px;
+  flex: 1; min-width: 0; font: inherit; font-size: 0.85rem;
+  padding: 0.35rem 0.55rem; border: 1px solid var(--border); border-radius: 6px;
   background: var(--panel); color: var(--ink);
+  min-height: 38px;
+}
+.hp-pool-row .btn { font-size: 0.82rem; padding: 0.3rem 0.7rem; min-height: 38px; font-weight: 600; }
+.hp-pool-del {
+  color: var(--err);
+  font-size: 1.1rem;
+  font-weight: 800;
+  padding: 0.2rem 0.55rem;
+  cursor: pointer;
+  border-radius: 6px;
 }
-.hp-pool-row .btn { font-size: 0.66rem; padding: 0.12rem 0.45rem; }
-.hp-pool-del { color: var(--err); font-size: 0.66rem; padding: 0.05rem 0.3rem; }
 /* Which-pool tag on put rows (multi-pool ledgers only). */
 .hp-pool-tag {
-  font-size: 0.6rem; font-weight: 700; letter-spacing: 0.03em;
+  font-size: 0.78rem; font-weight: 700; letter-spacing: 0.03em;
   color: var(--muted); background: transparent; border: 1px solid var(--border);
-  border-radius: 999px; padding: 0.06rem 0.4rem; white-space: nowrap;
+  border-radius: 999px; padding: 0.15rem 0.5rem; white-space: nowrap;
 }
 /* The put-row pool picker (same slot the tag held) — selects where the
    put's strike×100×contracts reservation lands. */
 .hp-pool-pick {
-  font: inherit; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.03em;
+  font: inherit; font-size: 0.82rem; font-weight: 700; letter-spacing: 0.03em;
   color: var(--muted); background: var(--panel); border: 1px solid var(--border);
-  border-radius: 999px; padding: 0.06rem 0.4rem; white-space: nowrap; cursor: pointer;
+  border-radius: 999px; padding: 0.2rem 0.6rem; white-space: nowrap; cursor: pointer;
+  min-height: 38px;
 }
 .holdings-add select {
-  font: inherit; padding: 5px 6px; border: 1px solid var(--border);
-  border-radius: 5px; background: var(--panel); color: var(--ink);
+  font: inherit; font-size: 0.9rem; padding: 6px 10px; border: 1px solid var(--border);
+  border-radius: 6px; background: var(--panel); color: var(--ink);
+  min-height: 40px;
 }
diff --git a/scripts/capture-holdings-screenshots.mjs b/scripts/capture-holdings-screenshots.mjs
new file mode 100755
index 0000000..1c0d1f9
--- /dev/null
+++ b/scripts/capture-holdings-screenshots.mjs
@@ -0,0 +1,157 @@
+#!/usr/bin/env node
+/**
+ * Automated visual verification and screenshot capture for Holdings tab.
+ * Captures high-resolution mobile (390x844) and desktop (1280x800) screenshots
+ * to gui-test-screenshots/ per requirement R6.
+ */
+
+import { spawn } from "node:child_process";
+import { mkdirSync, existsSync } from "node:fs";
+import { resolve } from "node:path";
+import http from "node:http";
+
+const PORT = 5176;
+const PREVIEW_URL = `http://localhost:${PORT}/preview-holdings.html?theme=dark`;
+const OUTPUT_DIR = resolve("gui-test-screenshots");
+
+if (!existsSync(OUTPUT_DIR)) {
+  mkdirSync(OUTPUT_DIR, { recursive: true });
+}
+
+function waitForServer(url, timeoutMs = 20000) {
+  const start = Date.now();
+  return new Promise((resolve, reject) => {
+    const check = () => {
+      http.get(url, (res) => {
+        if (res.statusCode === 200 || res.statusCode === 304) {
+          resolve();
+        } else {
+          retry();
+        }
+      }).on("error", () => {
+        retry();
+      });
+    };
+    const retry = () => {
+      if (Date.now() - start > timeoutMs) {
+        reject(new Error(`Server at ${url} did not respond within ${timeoutMs}ms`));
+      } else {
+        setTimeout(check, 300);
+      }
+    };
+    check();
+  });
+}
+
+async function main() {
+  console.log("Starting preview dev server on port", PORT);
+  const viteProcess = spawn(
+    "npx",
+    ["vite", "--port", String(PORT), "--strictPort"],
+    {
+      cwd: resolve("crates/webapp/frontend"),
+      stdio: "pipe",
+    }
+  );
+
+  viteProcess.stderr.on("data", (d) => process.stderr.write(d));
+
+  try {
+    await waitForServer(PREVIEW_URL);
+    console.log("Preview server ready at", PREVIEW_URL);
+
+    let chromium;
+    try {
+      const pw = await import("playwright");
+      chromium = pw.chromium;
+    } catch {
+      const pw = await import("/Users/yinlootan/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs");
+      chromium = pw.chromium;
+    }
+
+    const browser = await chromium.launch({ headless: true });
+
+    // 1. Mobile Viewport (iPhone 12/13/14 scale: 390x844)
+    console.log("Capturing mobile screenshot (390x844)...");
+    const mobileContext = await browser.newContext({
+      viewport: { width: 390, height: 844 },
+      deviceScaleFactor: 2,
+      isMobile: true,
+      hasTouch: true,
+    });
+    const mobilePage = await mobileContext.newPage();
+    await mobilePage.goto(PREVIEW_URL, { waitUntil: "networkidle" });
+    await mobilePage.waitForSelector(".hp-cash-bar");
+    await mobilePage.waitForSelector(".hp-pos-card");
+
+    // Collapsed mobile overview
+    await mobilePage.screenshot({
+      path: resolve(OUTPUT_DIR, "holdings-mobile.png"),
+      fullPage: false,
+    });
+    console.log("Saved gui-test-screenshots/holdings-mobile.png");
+
+    // Tap first position card to expand drawer
+    const firstCard = await mobilePage.locator(".hp-card-summary").first();
+    await firstCard.click();
+    await mobilePage.waitForTimeout(300);
+    await mobilePage.screenshot({
+      path: resolve(OUTPUT_DIR, "holdings-mobile-drawer.png"),
+      fullPage: false,
+    });
+    console.log("Saved gui-test-screenshots/holdings-mobile-drawer.png");
+
+    // Open Accounts / Pools sheet
+    const poolBtn = await mobilePage.locator(".hp-pool-sheet-btn");
+    await poolBtn.click();
+    await mobilePage.waitForSelector(".hp-pool-sheet:not([hidden])");
+    await mobilePage.waitForTimeout(300);
+    await mobilePage.screenshot({
+      path: resolve(OUTPUT_DIR, "holdings-mobile-sheet.png"),
+      fullPage: false,
+    });
+    console.log("Saved gui-test-screenshots/holdings-mobile-sheet.png");
+
+    // Close pool sheet, open Sell Put action sheet with validation hint
+    await mobilePage.locator(".hp-sheet-close").click();
+    await mobilePage.waitForTimeout(300);
+    await mobilePage.locator(".hp-add-btn").first().click();
+    await mobilePage.waitForSelector(".hp-action-sheet:not([hidden])");
+    await mobilePage.waitForTimeout(300);
+    await mobilePage.screenshot({
+      path: resolve(OUTPUT_DIR, "holdings-mobile-action.png"),
+      fullPage: false,
+    });
+    console.log("Saved gui-test-screenshots/holdings-mobile-action.png");
+
+    await mobileContext.close();
+
+    // 2. Desktop Viewport (1280x800)
+    console.log("Capturing desktop screenshot (1280x800)...");
+    const desktopContext = await browser.newContext({
+      viewport: { width: 1280, height: 800 },
+      deviceScaleFactor: 2,
+    });
+    const desktopPage = await desktopContext.newPage();
+    await desktopPage.goto(PREVIEW_URL, { waitUntil: "networkidle" });
+    await desktopPage.waitForSelector(".hp-tabs-rail");
+    await desktopPage.waitForSelector(".hp-pos-card");
+    await desktopPage.screenshot({
+      path: resolve(OUTPUT_DIR, "holdings-desktop.png"),
+      fullPage: false,
+    });
+    console.log("Saved gui-test-screenshots/holdings-desktop.png");
+
+    await desktopContext.close();
+    await browser.close();
+
+    console.log("\nVisual screenshot verification completed successfully!");
+  } finally {
+    viteProcess.kill();
+  }
+}
+
+main().catch((err) => {
+  console.error("Screenshot capture failed:", err);
+  process.exit(1);
+});

