# Requirements

## Introduction

Ledger is a client-side personal expense tracking application built with vanilla HTML, CSS, and JavaScript. It runs entirely in the browser with no backend, persisting all state to `localStorage`. Users can log transactions by name, amount, and category; visualize spending via a doughnut chart; set a budget and/or spending limit; and review a monthly summary — all with dark/light theme support.

## Requirements

### 1. Transaction Management

**User Story:** As a user, I want to add, view, and delete expense transactions so that I can track my spending over time.

**Acceptance Criteria:**

1. WHEN the user fills in a valid item name, a positive amount, and selects a category and clicks "Add Entry" or presses Enter, THEN the system shall create a transaction with a unique ID, name, amount, category, and current ISO timestamp, prepend it to the list, persist to localStorage, and re-render the balance, chart, and list.
2. WHEN the user submits the form with an empty item name, THEN the system shall display "Please enter an item name." and not create a transaction.
3. WHEN the user submits the form with an amount that is zero, negative, or not a number, THEN the system shall display "Please enter a valid amount." and not create a transaction.
4. WHEN the user submits the form with no category selected, THEN the system shall display "Please select a category." and not create a transaction.
5. WHEN a transaction is successfully added, THEN the system shall clear the name and amount fields and return focus to the name field.
6. WHEN the user clicks the delete button on a transaction, THEN the system shall remove it from the list, persist the change, and re-render.

### 2. Category Management

**User Story:** As a user, I want to organize transactions into categories so that I can see how my spending is distributed.

**Acceptance Criteria:**

1. WHEN the application initializes without saved categories, THEN the system shall load three base categories: Food (`#f0a500`), Transport (`#4db6c6`), and Fun (`#a07df0`).
2. WHEN the user clicks "+ Category", THEN the system shall open the Add Category modal and focus the name input.
3. WHEN the user submits a non-empty category name, THEN the system shall add it with a color from the cycling 10-color custom palette, persist it, repopulate the dropdown, auto-select the new category, and close the modal.
4. WHEN the user submits a category name that already exists (case-insensitive), THEN the system shall close the modal without adding a duplicate.
5. WHEN the user submits an empty category name, THEN the system shall take no action.
6. WHEN the user presses Escape, clicks Cancel, or clicks outside the modal overlay, THEN the system shall close the modal without adding a category.

### 3. Balance Hero Display

**User Story:** As a user, I want to see my current balance or total spending prominently so that I know my financial position at a glance.

**Acceptance Criteria:**

1. WHILE no budget is set, THEN the system shall display the grand total of all transactions under the label "Total Spent".
2. WHEN the user enters a positive budget value and the field loses focus, THEN the system shall save it and display the remaining balance (budget − spent) under the label "Balance".
3. WHEN total spending exceeds the budget, THEN the system shall change the label to "Over Budget" and apply a red pulsing animation to the balance amount.
4. WHEN the budget is cleared to zero, THEN the system shall revert to "Total Spent" mode.
5. THEN the system shall display a stats row showing the current budget (or "—" if unset) and total spent.
6. THEN the system shall render a proportional horizontal color bar where each segment width equals `categoryTotal / grandTotal * 100%`.
7. WHEN total spending is zero, THEN the system shall render an empty balance bar.

### 4. Spending Limit

**User Story:** As a user, I want to set a spending limit alert so that I am warned when I approach or exceed my threshold.

**Acceptance Criteria:**

1. WHEN the user enters a positive spending limit and the field loses focus, THEN the system shall save it to localStorage and re-evaluate the limit condition.
2. WHEN total spending reaches or exceeds the limit, THEN the system shall display a warning banner with the message "Limit [amount] exceeded!" and highlight all transaction items in red.
3. WHEN total spending drops below the limit, THEN the system shall hide the banner and remove the red highlight from transaction items.
4. THEN the system shall evaluate the spending limit independently of the budget; both may be active simultaneously.

### 5. Spending Chart

**User Story:** As a user, I want to see a visual breakdown of my spending by category so that I can understand where my money is going.

**Acceptance Criteria:**

1. THEN the system shall render a doughnut chart using Chart.js showing spending distribution per category, each slice colored by its category color.
2. WHEN there are no transactions, THEN the system shall render a single grey placeholder slice labeled "Empty".
3. WHEN the chart is re-rendered, THEN the system shall destroy the previous Chart.js instance before creating a new one.
4. THEN the system shall display the total transaction count in the center of the chart, using "item" (singular) or "items" (plural).
5. THEN the system shall render a legend listing each active category with a colored dot, name, and percentage of total spending (rounded to nearest integer).
6. WHEN the user hovers over a chart slice, THEN the system shall display a tooltip with the category total formatted as Indonesian Rupiah.

### 6. Transaction List

**User Story:** As a user, I want to view and sort my transaction history so that I can review my spending in different orders.

**Acceptance Criteria:**

1. THEN the system shall render each transaction showing a category color dot, item name, category label, formatted date, formatted amount, and a delete button.
2. WHEN the transaction list is empty, THEN the system shall display "No entries yet. Add your first transaction above."
3. WHEN the user selects a sort option, THEN the system shall re-render the list in the selected order without mutating the underlying transaction array.
4. THEN the system shall support five sort modes: Newest (date desc, default), Oldest (date asc), Highest (amount desc), Lowest (amount asc), and Category (alphabetical asc).
5. THEN the system shall escape all user-supplied strings before DOM injection, replacing `&`, `<`, `>`, and `"` with HTML entities.

### 7. Monthly Summary

**User Story:** As a user, I want to see a summary of my spending for the current month so that I can review my monthly financial activity.

**Acceptance Criteria:**

1. WHEN the user clicks the calendar icon, THEN the system shall toggle the summary panel — opening and rendering it if hidden, or closing it if visible.
2. WHEN the user clicks the close button inside the panel, THEN the system shall hide the panel.
3. THEN the system shall display for the current calendar month: the month/year label, total spent, entry count, and average per entry.
4. THEN the system shall display a per-category breakdown for all categories with at least one transaction in the current month.
5. WHEN there are no transactions in the current month, THEN the system shall display zero values for total, entries, and average.

### 8. Theme

**User Story:** As a user, I want to switch between dark and light themes so that I can use the app comfortably in different lighting conditions.

**Acceptance Criteria:**

1. WHEN the user clicks the theme toggle button, THEN the system shall flip the `data-theme` attribute on `<html>`, persist the choice to localStorage, and re-render the chart.
2. WHEN the application initializes, THEN the system shall restore the saved theme from localStorage, defaulting to dark if none is stored.
3. WHILE the dark theme is active, THEN the system shall display the sun icon in the toggle button.
4. WHILE the light theme is active, THEN the system shall display the moon icon in the toggle button.

### 9. Data Persistence

**User Story:** As a user, I want my data to be saved automatically so that it is available when I return to the app.

**Acceptance Criteria:**

1. WHEN a transaction is added or deleted, a category is added, or the budget or limit is changed, THEN the system shall synchronously write all state to localStorage.
2. WHEN the application initializes, THEN the system shall read transactions, categories, budget, and limit from localStorage before rendering.
3. WHEN localStorage contains malformed JSON, THEN the system shall catch the error and initialize with an empty transaction list and the three base categories without throwing.
4. THEN the system shall use the keys: `ledger_transactions`, `ledger_categories`, `ledger_budget`, `ledger_limit`, `ledger_theme`.

### 10. Formatting and Localization

**User Story:** As a user, I want amounts and dates displayed in Indonesian locale format so that the app feels native to my region.

**Acceptance Criteria:**

1. THEN the system shall format all monetary amounts as "Rp " followed by the amount rounded to the nearest integer with Indonesian locale thousand separators (e.g., "Rp 1.250.000").
2. THEN the system shall format transaction dates in Indonesian locale short format showing two-digit day and abbreviated month (e.g., "15 Jan").

### 11. Responsive Layout

**User Story:** As a user, I want the app to work well on my mobile device so that I can track expenses on the go.

**Acceptance Criteria:**

1. THEN the system shall constrain the layout to a maximum width of 480px, centered horizontally.
2. WHEN the viewport width is 380px or less, THEN the system shall stack form rows vertically, expand small fields to full width, stack the chart and legend vertically, and wrap legend items horizontally.

### 12. Keyboard and UX

**User Story:** As a user, I want to interact with the app efficiently using my keyboard so that data entry is fast.

**Acceptance Criteria:**

1. WHEN the user presses Enter while focused on the item name or amount field, THEN the system shall submit the add transaction form.
2. WHEN the user presses Enter while focused on the category name input in the modal, THEN the system shall confirm adding the category.
3. WHEN the user presses Escape while focused on the category name input, THEN the system shall dismiss the modal.
4. WHEN the application initializes with a previously saved budget or limit, THEN the system shall restore those values into the corresponding input fields.
5. WHEN the Add Category modal is opened, THEN the system shall move focus to the category name input.
