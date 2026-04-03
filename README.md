# CodingCamp-30Mar26-ArmaghanBintangWijaya

# ◈ Ledger — Expense & Budget Visualizer
 
A mobile-friendly expense tracker built with vanilla HTML, CSS, and JavaScript. No frameworks, no backend — everything runs in the browser and persists via `localStorage`.
 
---
 
## Features
 
### Core
- **Balance display** — shows remaining balance when a budget is set (Budget − Spent), or total spent when no budget is configured
- **Transaction log** — add entries with a name, amount, and category; delete any entry at any time
- **Doughnut chart** — live pie chart showing spending distribution by category, powered by Chart.js
- **Form validation** — all fields are required before an entry can be submitted
 
### Budget & Limits
- **Budget** — set a starting budget; the hero number becomes your remaining balance and turns red if you go over
- **Spending Limit** — optional alert threshold; triggers a warning banner when total spending crosses the limit (independent of budget)
 
### Optional Features Implemented
- **Custom categories** — add your own categories beyond Food, Transport, and Fun; each gets a unique color automatically
- **Monthly summary** — tap the calendar icon to see this month's total, entry count, average per entry, and per-category breakdown
- **Sort transactions** — sort by newest, oldest, highest amount, lowest amount, or category
- **Spending limit highlight** — over-limit entries and the balance are visually flagged in red
- **Dark / light mode** — toggle with the sun/moon icon in the header; preference is saved across sessions

---
 
## File Structure
 
```
CodingCamp-30Mar26-ArmaghanBintangWijaya/
├── index.html        # App shell and markup
├── css/
│   └── style.css     # All styles (design tokens, layout, components, animations)
├── js/
│   └── app.js        # All logic (state, localStorage, rendering, events)
├── .gitattributes
├── .vscode/
│   └── settings.json
└── README.md
```
 
---
 
## Getting Started
 
No build step or installation required.
 
1. Download or clone the project folder
2. Open `index.html` in any modern browser
3. Start adding transactions
 
That's it. Works offline after the first load (Google Fonts and Chart.js are loaded from CDN on first visit).
 
---

## Usage Guide
 
### Adding a Transaction
Fill in the **Item**, **Amount**, and **Category** fields, then click **Add Entry** or press `Enter`. The chart, balance, and transaction list all update instantly.
 
### Setting a Budget
Enter a value in the **Budget** field and click out of the field (or tab away). The hero display switches from "Total Spent" to "Balance" and shows how much you have left. Clear the field and tab away to remove the budget.
 
### Setting a Spending Limit
Enter a value in the **Spending Limit** field and tab away to save. When your total spending reaches this amount, a warning banner appears and the balance turns red. This is separate from the budget — useful as an early-warning threshold.
 
### Adding a Custom Category
Click **+ Category**, type a name, and press Enter or click **Add**. The new category is available immediately in the dropdown and is saved for future sessions.
 
### Monthly Summary
Click the calendar icon (top right) to open a panel showing this month's spending stats broken down by category.
 
### Sorting Transactions
Use the **Sort** dropdown above the transaction list to order entries by date (newest/oldest) or amount (highest/lowest), or group them by category.
 
### Switching Themes
Click the sun/moon icon in the header to toggle between dark and light mode. The preference is saved and restored on next visit.
 
---
 
## Technical Notes
 
**Storage** — all data is saved to `localStorage` under these keys:
 
| Key | Contents |
|---|---|
| `ledger_transactions` | Array of transaction objects |
| `ledger_categories` | Array of category objects (name + color) |
| `ledger_budget` | Budget amount (number) |
| `ledger_limit` | Spending limit amount (number) |
| `ledger_theme` | `"dark"` or `"light"` |
 
**Dependencies** (loaded via CDN, no install needed):
- [Chart.js 4.4.3](https://www.chartjs.org/) — doughnut chart
- [DM Serif Display, DM Mono, DM Sans](https://fonts.google.com/) — typography
 
**Browser support** — Chrome, Firefox, Edge, Safari (all modern versions).
 
---
 
## Clearing All Data
 
To reset the app completely, open your browser's DevTools, go to **Application → Local Storage**, and delete the keys listed above. Alternatively, run this in the browser console:
 
```js
['ledger_transactions','ledger_categories','ledger_budget','ledger_limit','ledger_theme']
  .forEach(k => localStorage.removeItem(k));
location.reload();
```