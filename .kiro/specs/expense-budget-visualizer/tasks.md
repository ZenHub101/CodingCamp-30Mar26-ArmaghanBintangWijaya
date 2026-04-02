# Implementation Plan: Expense & Budget Visualizer

## Overview

Build a single-file, mobile-friendly web app (`index.html`) with Vanilla JS, CSS, and Chart.js via CDN. All state lives in Local Storage. A central `render()` function keeps the UI in sync after every mutation.

## Tasks

- [ ] 1. Set up project structure and data models
  - Create `index.html` with HTML skeleton, viewport meta tag, and Chart.js CDN script tag
  - Define the `Transaction` interface shape and `DEFAULT_CATEGORIES` constant in an inline `<script>`
  - Define the `SortOrder` type and initialise the in-memory `currentSortOrder` variable
  - _Requirements: 6.2, 7.1, 7.2_

- [ ] 2. Implement the Storage module
  - [ ] 2.1 Implement transaction storage functions
    - Write `getTransactions()`, `saveTransactions()`, `addTransaction()`, and `deleteTransaction()` using `localStorage`
    - Include try/catch for `SecurityError`/`QuotaExceededError` and malformed JSON fallback
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [ ]* 2.2 Write property test for transaction add round trip
    - **Property 1: Transaction Add Round Trip**
    - **Validates: Requirements 1.2, 5.1**
  - [ ]* 2.3 Write property test for transaction delete round trip
    - **Property 6: Transaction Delete Round Trip**
    - **Validates: Requirements 2.3, 5.2**
  - [ ]* 2.4 Write property test for storage serialization round trip
    - **Property 9: Storage Serialization Round Trip**
    - **Validates: Requirements 5.4**
  - [ ]* 2.5 Write unit tests for storage module
    - Test add, delete, get with known inputs; test malformed JSON fallback; test unavailable storage banner
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 3. Implement custom category storage functions
  - Write `getCategories()`, `saveCategories()`, and `addCategory()` in the storage module
  - `addCategory()` must reject empty names and case-insensitive duplicates and display a validation message
  - _Requirements: 8.2, 8.3, 8.4_
  - [ ]* 3.1 Write property test for custom category add round trip
    - **Property 10: Custom Category Add Round Trip**
    - **Validates: Requirements 8.2, 8.3**
  - [ ]* 3.2 Write property test for invalid category rejection
    - **Property 11: Invalid Category Rejection**
    - **Validates: Requirements 8.4**

- [ ] 4. Implement validation logic
  - Write `validateTransaction({ name, amount, category })` returning field-level error messages
  - Write `validateCategory(name, existingCategories)` returning an error message or null
  - _Requirements: 1.3, 1.4, 8.4_
  - [ ]* 4.1 Write property test for empty field rejection
    - **Property 2: Empty Field Rejection**
    - **Validates: Requirements 1.3**
  - [ ]* 4.2 Write property test for invalid amount rejection
    - **Property 3: Invalid Amount Rejection**
    - **Validates: Requirements 1.4**
  - [ ]* 4.3 Write unit tests for validation logic
    - Test empty string, `"0"`, `"-5"`, `"abc"`, and valid inputs for each field
    - _Requirements: 1.3, 1.4_

- [ ] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement the Balance component and render controller skeleton
  - [ ] 6.1 Implement `renderBalance(transactions)`
    - Sum all transaction amounts and update the balance DOM element
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ]* 6.2 Write property test for balance invariant
    - **Property 7: Balance Invariant**
    - **Validates: Requirements 3.2, 3.3**
  - [ ] 6.3 Implement the `render()` controller
    - Read transactions from storage and call `renderBalance`, `renderTransactionList`, `renderChart`, and `renderMonthlySummary`
    - Ensure `render()` completes DOM updates within 100ms of the storage mutation
    - _Requirements: 3.2, 4.2, 10.2_

- [ ] 7. Implement the Transaction List component
  - [ ] 7.1 Implement `renderTransactionList(transactions, sortOrder)`
    - Render each transaction's name, amount, and category as list items
    - Show empty-state message when the array is empty
    - Apply `currentSortOrder` before rendering
    - _Requirements: 2.1, 2.2, 2.4_
  - [ ] 7.2 Implement `handleDelete(id)`
    - Call `deleteTransaction(id)`, then call `render()`
    - _Requirements: 2.3_
  - [ ]* 7.3 Write property test for transaction list renders all fields
    - **Property 5: Transaction List Renders All Fields**
    - **Validates: Requirements 2.1**
  - [ ]* 7.4 Write unit tests for transaction list
    - Test empty-state message, delete wiring, and field rendering with known inputs
    - _Requirements: 2.1, 2.4_

- [ ] 8. Implement the Chart component
  - [ ] 8.1 Implement `renderChart(transactions)`
    - Aggregate amounts by category, destroy any existing Chart.js instance, and create a new pie chart
    - Label each segment with category name and percentage
    - Show placeholder state when transactions array is empty
    - Show fallback message if Chart.js failed to load from CDN
    - _Requirements: 4.1, 4.3, 4.4, 4.5_
  - [ ]* 8.2 Write property test for chart data correctness
    - **Property 8: Chart Data Correctness**
    - **Validates: Requirements 4.1, 4.3**
  - [ ]* 8.3 Write unit tests for chart data preparation
    - Test known category distributions and empty-state
    - _Requirements: 4.1, 4.3, 4.4_

- [ ] 9. Implement the Input Form component
  - [ ] 9.1 Implement `handleFormSubmit(event)`
    - Validate inputs using `validateTransaction`; show inline errors on failure; call `addTransaction` and `render()` on success
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [ ] 9.2 Implement `resetForm()` and call it after a successful submission
    - _Requirements: 1.5_
  - [ ] 9.3 Implement `showValidationError(field, message)` and clear errors on next valid submission or field change
    - _Requirements: 1.3, 1.4_
  - [ ] 9.4 Implement `handleAddCategory(event)` for the custom category control
    - Validate with `validateCategory`, show inline error on failure, call `addCategory` and refresh the selector on success
    - _Requirements: 8.1, 8.2, 8.4_
  - [ ]* 9.5 Write property test for form reset after submission
    - **Property 4: Form Reset After Submission**
    - **Validates: Requirements 1.5**
  - [ ]* 9.6 Write unit tests for form submission and category addition
    - Test valid submission, each validation failure path, and form reset
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 8.1, 8.4_

- [ ] 10. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement the Monthly Summary component
  - [ ] 11.1 Implement `renderMonthlySummary(transactions)`
    - Group transactions by `YYYY-MM`, compute per-category totals per month, and render the summary table/list
    - Show empty-state message when transactions array is empty
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  - [ ]* 11.2 Write property test for monthly grouping correctness
    - **Property 12: Monthly Grouping Correctness**
    - **Validates: Requirements 9.1, 9.2, 9.3**
  - [ ]* 11.3 Write unit tests for monthly summary
    - Test transactions spanning multiple months and empty-state
    - _Requirements: 9.1, 9.2, 9.4_

- [ ] 12. Implement the Sorter component
  - [ ] 12.1 Implement `renderSorter()` and `handleSortChange(order)`
    - Render sort controls (amount-asc, amount-desc, category-asc, default)
    - Store selected order in `currentSortOrder` (in-memory only, not in Local Storage)
    - Call `render()` after sort change; sort is applied inside `renderTransactionList`
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  - [ ]* 12.2 Write property test for sort correctness and stability
    - **Property 13: Sort Correctness and Stability**
    - **Validates: Requirements 10.2, 10.3**
  - [ ]* 12.3 Write property test for sort does not affect storage order
    - **Property 14: Sort Does Not Affect Storage Order**
    - **Validates: Requirements 10.4**
  - [ ]* 12.4 Write unit tests for sort function
    - Test each sort mode with known orderings
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 13. Implement responsive CSS and touch targets
  - Write CSS using relative units and media queries to support viewport widths 320px–1440px without horizontal scrolling
  - Set minimum touch target size of 44×44 CSS pixels for all interactive controls
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 14. Implement `init()` and wire everything together
  - Write `init()` to read from storage and call `render()` on `DOMContentLoaded`
  - Attach all event listeners (form submit, delete buttons, sort controls, add-category control)
  - Verify the full unidirectional flow: user action → storage mutation → `render()` → DOM update
  - _Requirements: 3.3, 5.3, 7.1, 7.2_

- [ ] 15. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use [fast-check](https://github.com/dubzzz/fast-check) with a minimum of 100 runs per property
- Unit tests and property tests live under `tests/unit/` and `tests/property/` respectively
- The sort order is intentionally kept in memory only — never written to Local Storage (Requirement 10.4)
