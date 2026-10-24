# Design: Holdings Tab Simplification & Senior-Friendly Mobile UX

## At a glance

The webapp's Holdings tab serves as a personal wheel-strategy ledger (tracking cash pools, put options, share lots, and covered calls). The current UI is desktop-heavy, dense, uses micro-fonts (down to 9.6px), low-contrast opacity damping (`0.55–0.70`), and tiny touch targets (11–13px), making mobile usage frustrating and error-prone for older investors. This redesign delivers an accessible, mobile-first experience with a clean Cash Summary Bar, progressive-disclosure position cards (large symbols, bold P&L, 44px buttons), bottom-sheet action dialogs with explicit input validation helpers, sticky floating toasts, and visual screenshot verification across mobile and desktop viewports. All backend APIs, domain calculations, and data models remain untouched.

**Key decisions**
- Frontend-only overhaul: refactor `HoldingsPanel.jsx`, `style.css`, and DOM smoke tests while preserving all `/api/holdings*` endpoints and ledger schemas verbatim (rejected: full-stack schema bump — unnecessary risk when API contracts and core domain math are already sound).
- Progressive disclosure on cards: display 4–5 core metrics in large, bold type by default with a tap-to-expand details drawer (rejected: flat 18-metric tables on mobile — causes extreme cognitive overload and horizontal squishing).
- Dedicated bottom-sheet action container on mobile: open sell/close forms in a focused modal sheet with 48px touch inputs and plain-English validation helpers (rejected: inline row expansions on mobile — keyboard popups obscure submit buttons and cause off-screen scroll jumps).
- Mobile Cash Summary Bar with Pool Manager Sheet: collapse the multi-row top rail on mobile into a clean cash headline with an `[Accounts / Pools]` button opening a dedicated manager sheet (rejected: permanent rail unwrap — consumed more than half the mobile viewport before positions were visible).
- Automated visual screenshot verification: capture mobile (390×844) and desktop (1280×800) screenshots into `gui-test-screenshots/` using headless browser automation to verify usability and aesthetics.

| R# | Requirement in one line | Risk |
|---|---|---|
| R1 | Senior-friendly typography and touch target styling tokens | low |
| R2 | Mobile Cash Summary Bar and Pool Manager Sheet | low |
| R3 | Progressive-disclosure position cards for Lots, Puts, and Calls | low |
| R4 | Focused mobile Action Sheet with explicit validation hints | low |
| R5 | Floating viewport toast notifications with distinct status styling | low |
| R6 | Visual verification and responsive screenshot generation | low |

## Requirements

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

## Feature acceptance

- Given a mobile user viewing the Holdings tab on a 390×844 viewport with active cash, put, call, and share lot positions, When the user loads the page, Then the cash summary appears above the fold in >=18px font with a 44px `[Accounts / Pools]` button, each position displays as a high-contrast card with >=14px text and a 44px action button, tapping any card smoothly reveals secondary pace and spot details, tapping an action button opens a bottom sheet with 48px inputs and validation hints, and automated screenshot verification captures mobile and desktop views into `gui-test-screenshots/`.

### Feature review: auto
