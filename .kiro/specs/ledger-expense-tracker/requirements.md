# Requirements: Ledger — Expense Tracker

## Introduction

Ledger is a client-side personal expense tracking application. It runs entirely in the browser using vanilla HTML, CSS, and JavaScript, with all data persisted to `localStorage`. These requirements document the implemented behavior of the application.

---

## Requirement 1: Transaction Management

### 1.1 Add Transaction

WHEN the user fills in a valid item name, a positive amount, and selects a category, and clicks "Add Entry" or presses Enter in the name or amount field, THE SYSTEM SHALL create a new transaction object with a unique ID, the entered name, amount, category, and the current ISO timestamp, prepend it to the transaction list, persist all state to localStorage, and re-render the balance hero, chart, and transaction list.

WHEN the user submits the form with an empty item name, THE SYSTEM SHALL display the error message "Please enter an item name." in the form error area and SHALL NOT create a transaction.

WHEN the user submits the form with an amount that is zero, negative, or not a number, THE SYSTEM SHALL display the error message "Please enter a valid amount." in the form error area and SHALL NOT create a transaction.

WHEN the user submits the form with no category selected, THE SYSTEM SHALL display the error message "Please select a category." in the form error area and SHALL NOT create a transaction.

WHEN a transaction is successfully added, THE SYSTEM SHALL clear the item name and amount input fields and return focus to the item name field.

### 1.2 Delete Transaction

WHEN the user clicks the delete button on a transaction item, THE SYSTEM SHALL remove that transaction from the transaction list, persist the updated list to localStorage, and re-render the balance hero, chart, and transaction list.

### 1.3 Transaction Data Model

THE SYSTEM SHALL represent each transaction as an object with the following fields: `id` (string, `Date.now()` at creation time), `name` (string), `amount` (positive number), `category` (string matching an existing category name), and `date` (ISO 8601 string).

---

## Requirement 2: Category Management

### 2.1 Base Categories

THE SYSTEM SHALL initialize with three base categories: Food (color `#f0a500`), Transport (color `#4db6c6`), and Fun (color `#a07df0`), unless previously saved categories exist in localStorage.

### 2.2 Custom Categories

WHEN the user clicks the "+ Category" button, THE SYSTEM SHALL open the Add Category modal and focus the category name input.

WHEN the user submits a non-empty category name in the modal (via the "Add" button or pressing Enter), THE SYSTEM SHALL add the new category to the category list with a color assigned by cycling through the ten-color custom palette, persist the updated categories to localStorage, repopulate the category select dropdown, auto-select the new category, and close the modal.

WHEN the user submits a category name that already exists (case-insensitive comparison), THE SYSTEM SHALL close the modal without adding a duplicate category.

WHEN the user submits an empty category name, THE SYSTEM SHALL take no action.

WHEN the user presses Escape or clicks Cancel in the modal, THE SYSTEM SHALL close the modal without adding a category.

WHEN the user clicks outside the modal overlay, THE SYSTEM SHALL close the modal without adding a category.

### 2.3 Category Color Assignment

THE SYSTEM SHALL assign colors to custom categories by cycling through the CUSTOM_COLORS palette using the index `(totalCategories - 3) % 10`, where 3 is the number of base categories.

---

## Requirement 3: Balance Hero Display

### 3.1 No Budget Mode

WHILE no budget is set (budget = 0), THE SYSTEM SHALL display the grand total of all transaction amounts under the label "Total Spent".

### 3.2 Budget Mode

WHEN the user enters a positive value in the Budget field and the field loses focus, THE SYSTEM SHALL save the budget to localStorage and update the balance hero to display the remaining balance (budget − total spent) under the label "Balance".

WHILE a budget is set and total spending is within budget, THE SYSTEM SHALL display the remaining balance with the label "Balance".

WHEN total spending exceeds the set budget, THE SYSTEM SHALL change the balance label to "Over Budget", apply the `over-limit` CSS class to the balance amount element (triggering a red pulsing animation), and display the negative remaining amount.

WHEN the budget is cleared (set to 0), THE SYSTEM SHALL revert the balance hero to "Total Spent" mode.

### 3.3 Budget and Spent Stats Row

THE SYSTEM SHALL display a stats row below the balance amount showing the current budget value (or "—" if no budget is set) and the total amount spent.

### 3.4 Category Color Bar

THE SYSTEM SHALL render a proportional horizontal bar below the stats row where each segment represents a category's share of total spending, colored with that category's assigned color, with segment widths proportional to `categoryTotal / grandTotal * 100%`.

WHEN total spending is zero, THE SYSTEM SHALL render an empty balance bar.

---

## Requirement 4: Spending Limit

### 4.1 Limit Configuration

WHEN the user enters a positive value in the Spending Limit field and the field loses focus, THE SYSTEM SHALL save the limit to localStorage and re-evaluate the limit condition.

### 4.2 Limit Exceeded State

WHEN total spending reaches or exceeds the spending limit (and limit > 0), THE SYSTEM SHALL display a warning banner containing the message "Limit [formatted limit] exceeded!" and apply the `over-limit` CSS class to all transaction list items.

WHEN total spending drops below the spending limit, THE SYSTEM SHALL hide the warning banner and remove the `over-limit` class from all transaction list items.

### 4.3 Independence from Budget

THE SYSTEM SHALL evaluate the spending limit independently of the budget setting; both can be active simultaneously.

---

## Requirement 5: Spending Chart

### 5.1 Doughnut Chart

THE SYSTEM SHALL render a doughnut chart using Chart.js showing the spending distribution across categories, with each slice colored by its category color.

WHEN there are no transactions, THE SYSTEM SHALL render a single grey placeholder slice labeled "Empty".

WHEN the chart is re-rendered, THE SYSTEM SHALL destroy the previous Chart.js instance before creating a new one.

### 5.2 Chart Center Label

THE SYSTEM SHALL display the total number of transactions in the center of the doughnut chart, with the label "item" (singular) when there is exactly one transaction, and "items" (plural) otherwise.

### 5.3 Chart Legend

THE SYSTEM SHALL render a legend alongside the chart listing each category that has at least one transaction, showing a colored dot, the category name, and the percentage of total spending that category represents (rounded to the nearest integer).

### 5.4 Chart Tooltips

WHEN the user hovers over a chart slice, THE SYSTEM SHALL display a tooltip showing the total amount spent in that category formatted as Indonesian Rupiah (e.g., "Rp 25.000").

---

## Requirement 6: Transaction List

### 6.1 List Rendering

THE SYSTEM SHALL render all transactions in the transaction list, each showing a colored category dot, the item name, the category label, the formatted date, the formatted amount, and a delete button.

WHEN the transaction list is empty, THE SYSTEM SHALL display an empty state message: "No entries yet. Add your first transaction above."

### 6.2 Sorting

WHEN the user selects a sort option from the sort dropdown, THE SYSTEM SHALL re-render the transaction list in the selected order without modifying the underlying transaction array.

THE SYSTEM SHALL support the following sort modes:
- Newest (date descending, default)
- Oldest (date ascending)
- Highest (amount descending)
- Lowest (amount ascending)
- Category (alphabetical ascending by category name)

### 6.3 XSS Prevention

THE SYSTEM SHALL escape all user-supplied strings (item name, category name) before injecting them into the DOM via innerHTML, replacing `&`, `<`, `>`, and `"` with their HTML entities.

---

## Requirement 7: Monthly Summary

### 7.1 Summary Panel Toggle

WHEN the user clicks the calendar icon in the header, THE SYSTEM SHALL toggle the monthly summary panel: opening it (and rendering its content) if it is hidden, or closing it if it is visible.

WHEN the user clicks the close button (✕) inside the summary panel, THE SYSTEM SHALL hide the panel.

### 7.2 Summary Content

THE SYSTEM SHALL display the following statistics for the current calendar month: the month and year label, the total amount spent, the number of entries, and the average amount per entry.

THE SYSTEM SHALL additionally display a per-category breakdown showing the total spent in each category that has at least one transaction in the current month.

WHEN there are no transactions in the current month, THE SYSTEM SHALL display zero values for total, entries, and average.

---

## Requirement 8: Theme

### 8.1 Theme Toggle

WHEN the user clicks the theme toggle button in the header, THE SYSTEM SHALL switch between dark and light themes by toggling the `data-theme` attribute on the `<html>` element, persist the selected theme to localStorage under the key `ledger_theme`, and re-render the chart to apply theme-appropriate colors.

### 8.2 Theme Persistence

WHEN the application initializes, THE SYSTEM SHALL restore the previously saved theme from localStorage, defaulting to dark theme if no preference is stored.

### 8.3 Theme Icon

WHILE the dark theme is active, THE SYSTEM SHALL display the sun icon in the theme toggle button.

WHILE the light theme is active, THE SYSTEM SHALL display the moon icon in the theme toggle button.

---

## Requirement 9: Data Persistence

### 9.1 Save on Mutation

WHEN any of the following occur — a transaction is added, a transaction is deleted, a category is added, the budget is changed, the spending limit is changed — THE SYSTEM SHALL synchronously write all state to localStorage.

### 9.2 Load on Init

WHEN the application initializes (DOMContentLoaded), THE SYSTEM SHALL read transactions, categories, budget, and limit from localStorage and hydrate the application state before rendering.

### 9.3 Corrupt Data Recovery

WHEN localStorage contains malformed JSON for transactions or categories, THE SYSTEM SHALL catch the parse error and initialize with an empty transaction list and the three base categories, without throwing an unhandled exception.

### 9.4 Storage Keys

THE SYSTEM SHALL use the following localStorage keys: `ledger_transactions` (transaction array), `ledger_categories` (category array), `ledger_budget` (budget number), `ledger_limit` (spending limit number), `ledger_theme` (theme string).

---

## Requirement 10: Formatting

### 10.1 Currency Formatting

THE SYSTEM SHALL format all monetary amounts as Indonesian Rupiah using the prefix "Rp " followed by the amount rounded to the nearest integer and formatted with Indonesian locale thousand separators (e.g., "Rp 1.250.000").

### 10.2 Date Formatting

THE SYSTEM SHALL format transaction dates using Indonesian locale short format showing two-digit day and abbreviated month (e.g., "15 Jan").

---

## Requirement 11: Responsive Layout

### 11.1 Mobile-First Layout

THE SYSTEM SHALL constrain the application to a maximum width of 480px, centered horizontally, suitable for mobile use.

WHEN the viewport width is 380px or less, THE SYSTEM SHALL stack form rows vertically, expand small fields to full width, stack the chart and legend vertically, and wrap legend items horizontally.

---

## Requirement 12: Accessibility and UX

### 12.1 Keyboard Navigation

THE SYSTEM SHALL allow users to submit the add transaction form by pressing Enter while focused on the item name or amount input fields.

THE SYSTEM SHALL allow users to confirm adding a category by pressing Enter while focused on the category name input in the modal.

THE SYSTEM SHALL allow users to dismiss the category modal by pressing Escape while focused on the category name input.

### 12.2 Input Restoration

WHEN the application initializes and a budget or spending limit was previously saved, THE SYSTEM SHALL restore those values into the corresponding input fields.

### 12.3 Focus Management

WHEN the Add Category modal is opened, THE SYSTEM SHALL move focus to the category name input field.
