# Design Document: Expense & Budget Visualizer

## Overview

A single-file, mobile-friendly web application for tracking daily spending. The app runs entirely in the browser with no backend or build toolchain — just a standalone `index.html` that uses Vanilla JS, CSS, and Chart.js via CDN. All data is persisted in the browser's Local Storage as a JSON array.

The three optional features (custom categories, monthly summary, transaction sorting) are included in the design as first-class features.

### Key Design Decisions

- **No build toolchain**: Everything lives in one HTML file (or minimal flat files). No npm, no bundler.
- **Chart.js via CDN**: Avoids any local dependency for the pie chart.
- **Local Storage as the source of truth**: All reads/writes go through a thin storage module; the UI always re-renders from storage state.
- **Event-driven UI updates**: A central `render()` function is called after every mutation so the balance, list, and chart stay in sync within 100ms.

---

## Architecture

The app follows a simple unidirectional data flow:

```
User Action → Mutation (Storage write) → render() → DOM update
```

```mermaid
flowchart TD
    A[User Interaction] --> B[Input Validation]
    B -->|valid| C[Storage Module]
    B -->|invalid| D[Inline Error Message]
    C --> E[render()]
    E --> F[Balance Component]
    E --> G[Transaction List Component]
    E --> H[Chart Component]
    E --> I[Monthly Summary Component]
```

All state lives in Local Storage. There is no in-memory state store — on every render, the app reads from storage and rebuilds the DOM. This keeps the implementation simple and ensures persistence is never out of sync with the UI.

---

## Components and Interfaces

### Storage Module (`storage.js` or inline `<script>`)

Responsible for all Local Storage reads and writes.

```js
// Transactions
getTransactions(): Transaction[]
saveTransactions(transactions: Transaction[]): void
addTransaction(tx: Transaction): void
deleteTransaction(id: string): void

// Custom Categories
getCategories(): string[]
saveCategories(categories: string[]): void
addCategory(name: string): void
```

### Render Controller

Called after every mutation. Orchestrates all component renders.

```js
render(): void  // reads storage, updates balance, list, chart, summary
```

### Input Form Component

Handles transaction submission and custom category addition. Performs inline validation before calling the storage module.

```js
handleFormSubmit(event: Event): void
handleAddCategory(event: Event): void
resetForm(): void
showValidationError(field: string, message: string): void
```

### Transaction List Component

Renders the scrollable list. Applies the current sort order if sorting is enabled.

```js
renderTransactionList(transactions: Transaction[], sortOrder: SortOrder): void
handleDelete(id: string): void
```

### Balance Component

```js
renderBalance(transactions: Transaction[]): void
```

### Chart Component

Wraps Chart.js. Destroys and recreates the chart instance on each render to avoid stale data.

```js
renderChart(transactions: Transaction[]): void
```

### Monthly Summary Component

Groups transactions by `YYYY-MM` and renders totals per category per month.

```js
renderMonthlySummary(transactions: Transaction[]): void
```

### Sorter Component

Renders sort controls and stores the selected sort order in memory (not in Local Storage, per requirement 10.4).

```js
renderSorter(): void
handleSortChange(order: SortOrder): void
```

---

## Data Models

### Transaction

```ts
interface Transaction {
  id: string;          // UUID or timestamp-based unique ID
  name: string;        // item name, non-empty
  amount: number;      // positive number
  category: string;    // category label
  date: string;        // ISO 8601 date string (YYYY-MM-DD), set at creation time
}
```

### Storage Schema

```ts
// localStorage key: "transactions"
Transaction[]   // JSON array

// localStorage key: "categories"
string[]        // JSON array of custom category names
```

### SortOrder

```ts
type SortOrder = "default" | "amount-asc" | "amount-desc" | "category-asc";
```

### Default Categories

```ts
const DEFAULT_CATEGORIES = ["Food", "Transport", "Fun", "Health", "Other"];
```

The full category list available in the selector is `DEFAULT_CATEGORIES.concat(getCategories())`.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Transaction Add Round Trip

*For any* valid transaction (non-empty name, positive amount, non-empty category), adding it via the storage module and then reading all transactions from storage should return a list that contains an equivalent transaction.

**Validates: Requirements 1.2, 5.1**

### Property 2: Empty Field Rejection

*For any* form submission where at least one of name, amount, or category is empty, the transaction count in storage should remain unchanged after the submission attempt.

**Validates: Requirements 1.3**

### Property 3: Invalid Amount Rejection

*For any* amount value that is non-positive (≤ 0) or non-numeric, the transaction count in storage should remain unchanged after the submission attempt.

**Validates: Requirements 1.4**

### Property 4: Form Reset After Submission

*For any* valid transaction submission, after the transaction is added, all form fields should be in their default empty state.

**Validates: Requirements 1.5**

### Property 5: Transaction List Renders All Fields

*For any* non-empty array of transactions, the rendered transaction list HTML should contain each transaction's name, amount, and category.

**Validates: Requirements 2.1**

### Property 6: Transaction Delete Round Trip

*For any* transaction that exists in storage, deleting it by ID and then reading all transactions from storage should return a list that does not contain that transaction.

**Validates: Requirements 2.3, 5.2**

### Property 7: Balance Invariant

*For any* set of transactions in storage, the rendered balance value should equal the arithmetic sum of all transaction amounts.

**Validates: Requirements 3.2, 3.3**

### Property 8: Chart Data Correctness

*For any* non-empty set of transactions, the chart data preparation function should produce category totals that sum to the total balance, and the percentage labels for each category should sum to 100%.

**Validates: Requirements 4.1, 4.3**

### Property 9: Storage Serialization Round Trip

*For any* array of transactions, serializing it to JSON and then deserializing it should produce an array of transactions equivalent to the original (same IDs, names, amounts, categories, and dates).

**Validates: Requirements 5.4**

### Property 10: Custom Category Add Round Trip

*For any* valid (non-empty, non-duplicate) custom category name, adding it via the storage module and then reading the category list should return a list that includes that category name, and the category selector should include it as an option.

**Validates: Requirements 8.2, 8.3**

### Property 11: Invalid Category Rejection

*For any* category name that is empty or duplicates an existing category (case-insensitive), the category list in storage should remain unchanged after the addition attempt.

**Validates: Requirements 8.4**

### Property 12: Monthly Grouping Correctness

*For any* set of transactions, the monthly summary grouping function should produce groups keyed by YYYY-MM such that the sum of amounts per category within each group equals the sum of all transaction amounts for that category in that calendar month.

**Validates: Requirements 9.1, 9.2, 9.3**

### Property 13: Sort Correctness and Stability

*For any* array of transactions and any valid sort order (amount-asc, amount-desc, category-asc), the sorted result should be ordered according to the chosen criterion, and adding a new transaction should preserve that sort order in the re-rendered list.

**Validates: Requirements 10.2, 10.3**

### Property 14: Sort Does Not Affect Storage Order

*For any* sort operation applied to the transaction list, the order of transactions returned by the storage module should be unchanged before and after the sort.

**Validates: Requirements 10.4**

---

## Error Handling

### Validation Errors (User-Facing)

| Scenario | Behavior |
|---|---|
| Empty name field | Inline error below name input; form not submitted |
| Empty or missing category | Inline error below category selector; form not submitted |
| Amount ≤ 0 or non-numeric | Inline error below amount input; form not submitted |
| Empty custom category name | Inline error; category not added |
| Duplicate custom category name | Inline error; category not added |

All validation errors are displayed inline next to the offending field and cleared on the next valid submission or field change.

### Storage Errors

- If `localStorage` is unavailable (e.g., private browsing with storage blocked), the app should catch the `SecurityError` or `QuotaExceededError` and display a banner warning the user that data will not be persisted.
- If the stored JSON is malformed (e.g., manually corrupted), `JSON.parse` will throw. The app should catch this, log a warning, and fall back to an empty transaction list rather than crashing.

### Chart Errors

- If Chart.js fails to load from CDN, the chart container should display a fallback message: "Chart unavailable — could not load Chart.js."
- The chart instance is destroyed and recreated on each render to prevent stale data or canvas context errors.

---

## Testing Strategy

### Dual Testing Approach

Both unit tests and property-based tests are required. They are complementary:

- **Unit tests** cover specific examples, edge cases, and integration points.
- **Property-based tests** verify universal correctness across randomly generated inputs.

### Unit Tests

Focus areas:
- Storage module: add, delete, get, serialize/deserialize with known inputs
- Validation logic: specific valid and invalid inputs (empty string, `"0"`, `"-5"`, `"abc"`)
- Balance calculation: known transaction sets with expected sums
- Chart data preparation: known category distributions
- Monthly grouping: transactions spanning multiple months
- Sort function: known orderings for each sort mode
- Empty-state rendering: empty transaction array produces empty-state message
- Initialization: `init()` reads from storage and renders correctly

### Property-Based Tests

**Library**: [fast-check](https://github.com/dubzzz/fast-check) (JavaScript, no build required via CDN or inline)

**Configuration**: Minimum 100 runs per property (`numRuns: 100`).

Each property test must include a comment tag in the format:
`// Feature: expense-budget-visualizer, Property N: <property text>`

| Property | Test Description |
|---|---|
| P1 | Generate random valid transactions, add each, verify storage contains them |
| P2 | Generate submissions with at least one empty field, verify storage count unchanged |
| P3 | Generate non-positive/non-numeric amounts, verify storage count unchanged |
| P4 | Generate valid transactions, submit, verify all form fields are empty strings |
| P5 | Generate random transaction arrays, render list, verify each tx's fields appear in output |
| P6 | Generate random transaction sets, delete a random one, verify it's absent from storage |
| P7 | Generate random transaction arrays, verify `sum(amounts) === renderBalance()` |
| P8 | Generate random transaction arrays, verify chart category totals sum to balance and percentages sum to 100 |
| P9 | Generate random transaction arrays, serialize then deserialize, verify equivalence |
| P10 | Generate valid category names, add each, verify it appears in storage and selector |
| P11 | Generate empty or duplicate category names, verify category list unchanged |
| P12 | Generate transactions across random months, verify monthly group sums match per-month per-category totals |
| P13 | Generate random transaction arrays and sort orders, verify sorted output is correctly ordered and stable after additions |
| P14 | Generate random transaction arrays, apply sort, verify storage order is unchanged |

### Test File Structure

```
tests/
  unit/
    storage.test.js
    validation.test.js
    balance.test.js
    chart.test.js
    monthly.test.js
    sort.test.js
  property/
    storage.property.test.js
    validation.property.test.js
    balance.property.test.js
    chart.property.test.js
    monthly.property.test.js
    sort.property.test.js
```
