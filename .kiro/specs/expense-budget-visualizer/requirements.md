# Requirements Document

## Introduction

A mobile-friendly, single-page web application that helps users track daily spending. The app displays a running balance, a scrollable transaction history, and a pie chart of spending by category. All data is stored client-side using the browser's Local Storage API. No backend or build toolchain is required — the app runs as a standalone HTML/CSS/Vanilla JS page and is compatible with modern browsers.

The app includes three optional enhancements selected by the user: custom categories, monthly summary view, and transaction sorting.

## Glossary

- **App**: The Expense & Budget Visualizer single-page web application.
- **Transaction**: A single spending record consisting of a name, amount, and category.
- **Category**: A label grouping transactions (e.g., Food, Transport, Fun, or a user-defined custom category).
- **Balance**: The sum of all transaction amounts currently stored.
- **Transaction_List**: The scrollable UI component displaying all stored transactions.
- **Input_Form**: The UI form used to submit new transactions.
- **Chart**: The pie chart component visualising spending distribution by category.
- **Storage**: The browser's Local Storage API used to persist transaction data.
- **Monthly_Summary**: A view aggregating transaction totals grouped by calendar month.
- **Sorter**: The UI control that reorders the Transaction_List by a chosen criterion.

---

## Requirements

### Requirement 1: Transaction Input

**User Story:** As a user, I want to enter a transaction with a name, amount, and category, so that I can record my spending.

#### Acceptance Criteria

1. THE Input_Form SHALL provide a text field for item name, a numeric field for amount, and a category selector.
2. WHEN the user submits the Input_Form with all fields filled and a valid positive numeric amount, THE App SHALL add the transaction to Storage and update the Transaction_List and Balance.
3. IF the user submits the Input_Form with one or more empty fields, THEN THE Input_Form SHALL display an inline validation message identifying the missing field(s) and SHALL NOT add a transaction.
4. IF the user enters a non-positive or non-numeric value in the amount field, THEN THE Input_Form SHALL display an inline validation message and SHALL NOT add a transaction.
5. WHEN a transaction is successfully added, THE Input_Form SHALL reset all fields to their default empty state.

---

### Requirement 2: Transaction List

**User Story:** As a user, I want to see a scrollable list of all my transactions, so that I can review my spending history.

#### Acceptance Criteria

1. THE Transaction_List SHALL display each transaction's name, amount, and category.
2. THE Transaction_List SHALL be scrollable when the number of transactions exceeds the visible viewport height.
3. WHEN the user deletes a transaction, THE App SHALL remove it from Storage and update the Transaction_List and Balance.
4. WHEN Storage contains no transactions, THE Transaction_List SHALL display an empty-state message indicating no transactions have been recorded.

---

### Requirement 3: Balance Display

**User Story:** As a user, I want to see my total spending balance at the top of the page, so that I always know how much I have spent.

#### Acceptance Criteria

1. THE App SHALL display the Balance prominently at the top of the page.
2. WHEN a transaction is added or deleted, THE App SHALL recalculate and re-render the Balance within 100ms of the Storage update.
3. THE App SHALL initialise the Balance from Storage on page load so that previously recorded data is reflected immediately.

---

### Requirement 4: Spending Chart

**User Story:** As a user, I want to see a pie chart of my spending by category, so that I can understand where my money is going.

#### Acceptance Criteria

1. THE Chart SHALL render a pie chart showing each Category's proportion of total spending.
2. WHEN a transaction is added or deleted, THE Chart SHALL update to reflect the new category totals within 100ms of the Storage update.
3. THE Chart SHALL label each segment with the Category name and its percentage of total spending.
4. WHEN Storage contains no transactions, THE Chart SHALL display a placeholder state indicating no data is available.
5. THE App SHALL load the Chart using Chart.js delivered via CDN, requiring no local build step.

---

### Requirement 5: Data Persistence

**User Story:** As a user, I want my transactions to be saved between sessions, so that I do not lose my data when I close the browser.

#### Acceptance Criteria

1. WHEN a transaction is added, THE Storage SHALL persist the transaction so it survives a page reload.
2. WHEN a transaction is deleted, THE Storage SHALL remove the transaction so it is absent after a page reload.
3. WHEN the App initialises, THE App SHALL read all transactions from Storage and render the Transaction_List, Balance, and Chart before the first user interaction.
4. THE Storage SHALL serialise transactions as a JSON array so that the data format is human-readable and round-trippable (serialise then deserialise produces an equivalent transaction set).

---

### Requirement 6: Mobile-Friendly Layout

**User Story:** As a user, I want the app to work well on my phone, so that I can track spending on the go.

#### Acceptance Criteria

1. THE App SHALL use a responsive layout that adapts to viewport widths from 320px to 1440px without horizontal scrolling.
2. THE App SHALL set the HTML viewport meta tag so that mobile browsers render the page at device width.
3. THE App SHALL size all interactive controls (buttons, inputs, selectors) to a minimum touch target of 44×44 CSS pixels.

---

### Requirement 7: Browser Compatibility

**User Story:** As a developer, I want the app to run in all modern browsers, so that users are not restricted to a specific browser.

#### Acceptance Criteria

1. THE App SHALL function correctly in the current stable releases of Chrome, Firefox, Edge, and Safari without polyfills or transpilation.
2. THE App SHALL use only Vanilla JavaScript with no framework dependencies, so that no build toolchain is required to run the app.

---

### Requirement 8: Custom Categories (Optional Feature)

**User Story:** As a user, I want to create my own spending categories, so that I can organise transactions in a way that fits my lifestyle.

#### Acceptance Criteria

1. WHERE custom categories are supported, THE Input_Form SHALL provide a control to add a new Category name.
2. WHEN the user adds a custom Category, THE App SHALL make it available in the category selector for all subsequent transactions.
3. WHEN the user adds a custom Category, THE Storage SHALL persist the custom Category list so it survives a page reload.
4. IF the user attempts to add a Category with an empty name or a name that duplicates an existing Category, THEN THE App SHALL display a validation message and SHALL NOT add the duplicate or empty Category.

---

### Requirement 9: Monthly Summary View (Optional Feature)

**User Story:** As a user, I want to see a summary of my spending grouped by month, so that I can track trends over time.

#### Acceptance Criteria

1. WHERE the monthly summary is supported, THE App SHALL provide a Monthly_Summary view that groups transactions by calendar month (YYYY-MM).
2. WHEN the user navigates to the Monthly_Summary view, THE App SHALL display the total spending per Category for each month present in Storage.
3. WHEN a transaction is added or deleted, THE Monthly_Summary SHALL reflect the updated totals the next time the view is rendered.
4. WHEN Storage contains no transactions, THE Monthly_Summary SHALL display an empty-state message.

---

### Requirement 10: Transaction Sorting (Optional Feature)

**User Story:** As a user, I want to sort my transaction list by amount or category, so that I can find and compare transactions more easily.

#### Acceptance Criteria

1. WHERE sorting is supported, THE Sorter SHALL provide options to sort the Transaction_List by amount (ascending and descending) and by Category (alphabetical).
2. WHEN the user selects a sort option, THE App SHALL re-render the Transaction_List in the chosen order within 100ms.
3. THE Sorter SHALL preserve the selected sort order when new transactions are added, so the list remains sorted after each addition.
4. THE Sorter SHALL sort by display order only and SHALL NOT alter the order in which transactions are stored in Storage.
