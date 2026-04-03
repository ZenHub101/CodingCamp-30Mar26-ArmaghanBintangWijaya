# Tasks: Ledger — Expense Tracker

## Implementation Tasks

- [x] 1 Project scaffold and static shell
  - [x] 1.1 Create `index.html` with semantic sections: header, balance hero, summary panel, chart section, form section, list section, category modal
  - [x] 1.2 Link `css/style.css` and `js/app.js` in the HTML shell
  - [x] 1.3 Add CDN links for Chart.js 4.4.3 and Google Fonts (DM Serif Display, DM Mono, DM Sans)
  - [x] 1.4 Add `data-theme="dark"` default on `<html>` element

- [x] 2 Design tokens and global styles
  - [x] 2.1 Define CSS custom properties for dark theme on `:root`: background, surface layers, border, text, accent (`#f0a500`), danger (`#e05252`), category palette, radii, shadows, font stacks, transition
  - [x] 2.2 Override tokens for `[data-theme="light"]` with warm light palette
  - [x] 2.3 Apply CSS reset (`box-sizing`, margin/padding zero)
  - [x] 2.4 Style `body` with max-width 480px, centered, `padding-bottom: 2rem`

- [x] 3 Header component
  - [x] 3.1 Style `.app-header` as sticky, flex, space-between, with bottom border
  - [x] 3.2 Implement logo mark (◈ accent color) and logo text (DM Serif Display)
  - [x] 3.3 Style `.icon-btn` as circular 36px buttons with hover accent state
  - [x] 3.4 Implement theme icon swap: show sun icon in dark mode, moon icon in light mode via CSS `[data-theme]` selectors

- [x] 4 Balance hero section
  - [x] 4.1 Style `.balance-hero` with centered text layout
  - [x] 4.2 Style `.balance-amount` with `clamp(2.4rem, 10vw, 3.2rem)` DM Serif Display font
  - [x] 4.3 Implement `.over-limit` class with `color: var(--c-danger)` and `pulse-red` keyframe animation
  - [x] 4.4 Style `.balance-stats` row with divider between Budget and Spent values
  - [x] 4.5 Style `.balance-bar` as 4px tall flex strip with `overflow: hidden` and gap between segments
  - [x] 4.6 Style `.limit-banner` with danger border, background, and `slide-in` animation

- [x] 5 State management and persistence
  - [x] 5.1 Define `state` object with `transactions`, `categories`, `limit`, `sortMode`, `budget`, `chart` fields
  - [x] 5.2 Define `BASE_CATEGORIES` array with Food, Transport, Fun entries and hex colors
  - [x] 5.3 Define `CUSTOM_COLORS` array of 10 hex colors for user-added categories
  - [x] 5.4 Implement `load()`: parse all five localStorage keys, fall back to defaults on missing/corrupt data, wrap in try/catch
  - [x] 5.5 Implement `save()`: serialize all state fields to their respective localStorage keys

- [x] 6 Category helpers
  - [x] 6.1 Implement `getCategoryColor(name)`: find category by name, return its color or `'#888'` fallback
  - [x] 6.2 Implement `populateCategorySelect()`: clear and repopulate the `#itemCategory` select element from `state.categories`

- [x] 7 Formatting utilities
  - [x] 7.1 Implement `formatRp(n)`: return `'Rp ' + Math.round(n).toLocaleString('id-ID')`
  - [x] 7.2 Implement `formatDate(iso)`: return `toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })`
  - [x] 7.3 Implement `escHtml(str)`: replace `&`, `<`, `>`, `"` with HTML entities

- [x] 8 Compute totals
  - [x] 8.1 Implement `computeTotals()`: iterate `state.transactions`, accumulate per-category totals and grand total, return `{ totals, grand }`

- [x] 9 Balance hero rendering
  - [x] 9.1 Implement `renderBalance()`: branch on `state.budget > 0` to show remaining vs total spent, update label, toggle `.over-limit` class
  - [x] 9.2 Implement limit banner logic in `renderBalance()`: show/hide banner and apply/remove `.over-limit` on tx items based on `state.limit` vs `grand`
  - [x] 9.3 Implement `renderBalanceBar(grand)`: clear bar, skip if grand=0, create proportional segments per category

- [x] 10 Chart rendering
  - [x] 10.1 Implement `renderChart()`: compute totals, filter categories with data, update center label (count + "item"/"items")
  - [x] 10.2 Implement empty state chart: single grey segment labeled "Empty" when no transactions exist
  - [x] 10.3 Destroy previous `state.chart` instance before creating new Chart.js doughnut
  - [x] 10.4 Implement `chartOptions()`: cutout 68%, no built-in legend, custom tooltip with `formatRp`, 400ms rotation animation
  - [x] 10.5 Implement chart legend: render `.legend-item` divs with colored dot, category name, and percentage

- [x] 11 Transaction list rendering
  - [x] 11.1 Implement `renderList()`: clear container, show empty state if no transactions, otherwise render sorted items
  - [x] 11.2 Render each `.tx-item` with category color dot, name (escaped), category label, formatted date, formatted amount, delete button with trash SVG icon
  - [x] 11.3 Attach click handlers to all `.tx-delete` buttons after rendering
  - [x] 11.4 Implement `sortedTransactions()`: return new sorted array for all five sort modes without mutating state

- [x] 12 Monthly summary
  - [x] 12.1 Implement `renderSummary()`: filter transactions to current month (YYYY-MM prefix match), compute total, count, average, per-category breakdown
  - [x] 12.2 Render summary as `.summary-grid` with cells for Month, Total, Entries, Avg/entry, and per-category amounts
  - [x] 12.3 Style `.summary-grid` as two-column CSS grid with 1px gap background for dividers

- [x] 13 Add transaction action
  - [x] 13.1 Implement `addTransaction()`: read and validate form inputs, show inline errors on failure
  - [x] 13.2 On valid input: construct transaction object, unshift to `state.transactions`, call `save()`, call `renderAll()`, clear name and amount fields, refocus name input

- [x] 14 Delete transaction action
  - [x] 14.1 Implement `deleteTransaction(id)`: filter `state.transactions` by id, call `save()`, call `renderAll()`

- [x] 15 Custom category modal
  - [x] 15.1 Implement `openCategoryModal()`: set modal display to flex, clear input, focus input
  - [x] 15.2 Implement `closeCategoryModal()`: set modal display to none
  - [x] 15.3 Implement `confirmAddCategory()`: trim name, no-op if empty, deduplicate case-insensitively, assign CUSTOM_COLORS color by cycling index, push to state, save, repopulate select, auto-select new category, close modal
  - [x] 15.4 Style `.modal-overlay` with fixed inset, backdrop blur, fade-in animation
  - [x] 15.5 Style `.modal` card with slide-up animation, max-width 320px

- [x] 16 Theme system
  - [x] 16.1 Implement `initTheme()`: read `ledger_theme` from localStorage (default `'dark'`), set `document.documentElement.dataset.theme`
  - [x] 16.2 Implement `toggleTheme()`: flip `data-theme` between dark/light, persist to localStorage, call `renderChart()` to redraw with new colors

- [x] 17 Render orchestration
  - [x] 17.1 Implement `renderAll()`: call `renderBalance()`, `renderChart()`, `renderList()` in sequence

- [x] 18 Event wiring and initialization
  - [x] 18.1 Implement `init()`: call `initTheme()`, `load()`, `populateCategorySelect()`, `renderAll()`, restore budget/limit input values
  - [x] 18.2 Wire `change` event on `#spendingBudget`: update `state.budget`, save, re-render balance
  - [x] 18.3 Wire `change` event on `#spendingLimit`: update `state.limit`, save, re-render balance
  - [x] 18.4 Wire `click` on `#addTransactionBtn` to `addTransaction()`
  - [x] 18.5 Wire `keydown` Enter on `#itemName` and `#itemAmount` to `addTransaction()`
  - [x] 18.6 Wire `change` on `#sortSelect` to update `state.sortMode` and call `renderList()`
  - [x] 18.7 Wire `click` on `#themeToggle` to `toggleTheme()`
  - [x] 18.8 Wire `click` on `#summaryToggle` to toggle summary panel visibility and call `renderSummary()` on open
  - [x] 18.9 Wire `click` on `#summaryClose` to hide summary panel
  - [x] 18.10 Wire modal events: `#addCategoryBtn` → open, `#modalCancel` → close, `#modalConfirm` → confirm, Enter/Escape keydown on `#newCategoryName`, backdrop click to close
  - [x] 18.11 Register `init` on `DOMContentLoaded`

- [x] 19 Animations and transitions
  - [x] 19.1 Implement `slide-in` keyframe: opacity 0 → 1, translateY -6px → 0
  - [x] 19.2 Implement `slide-up` keyframe: opacity 0 → 1, translateY 16px → 0
  - [x] 19.3 Implement `fade-in` keyframe: opacity 0 → 1
  - [x] 19.4 Implement `pulse-red` keyframe: opacity 1 → 0.7 → 1 over 1.2s infinite
  - [x] 19.5 Apply `slide-in` to `.tx-item`, `.limit-banner`, `.error-msg`, `.panel`; `slide-up` to `.modal`; `fade-in` to `.modal-overlay`

- [x] 20 Responsive layout
  - [x] 20.1 Add `@media (max-width: 380px)` breakpoint: stack `.form-row` vertically, expand `.field--sm` to full width, stack `.chart-section` vertically, wrap `.chart-legend` items horizontally

- [x] 21 Error handling and edge cases
  - [x] 21.1 Implement `showError(el, msg)`: set error text, reset animation via `requestAnimationFrame` to re-trigger slide-in
  - [x] 21.2 Ensure `load()` try/catch resets to safe defaults on any JSON parse failure
  - [x] 21.3 Ensure `renderList()` preserves the `#emptyState` element as a sentinel (not recreated each render)
