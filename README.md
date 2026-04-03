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

