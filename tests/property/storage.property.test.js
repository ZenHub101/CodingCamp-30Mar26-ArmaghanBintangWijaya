// Feature: expense-budget-visualizer, Property 1: Transaction Add Round Trip

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';

// ─── In-memory localStorage mock ────────────────────────────────────────────

function createLocalStorageMock() {
  let store = {};
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
}

// ─── Storage functions (inlined from index.html) ─────────────────────────────

const STORAGE_KEY_TRANSACTIONS = 'transactions';

function makeStorage(lsMock) {
  function getTransactions() {
    try {
      const raw = lsMock.getItem(STORAGE_KEY_TRANSACTIONS);
      if (raw === null) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  function saveTransactions(transactions) {
    lsMock.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
  }

  function addTransaction(tx) {
    const transactions = getTransactions();
    transactions.push(tx);
    saveTransactions(transactions);
  }

  function deleteTransaction(id) {
    const transactions = getTransactions().filter(tx => tx.id !== id);
    saveTransactions(transactions);
  }

  return { getTransactions, saveTransactions, addTransaction, deleteTransaction };
}

// ─── Arbitraries ─────────────────────────────────────────────────────────────

const nonEmptyString = fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0);

const positiveAmount = fc.float({ min: 0.01, max: 1_000_000, noNaN: true, noDefaultInfinity: true })
  .map(n => Math.round(n * 100) / 100);

const dateString = fc.tuple(
  fc.integer({ min: 2000, max: 2099 }),
  fc.integer({ min: 1, max: 12 }),
  fc.integer({ min: 1, max: 28 }),
).map(([y, m, d]) => {
  const mm = String(m).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
});

const validTransaction = fc.record({
  id: nonEmptyString,
  name: nonEmptyString,
  amount: positiveAmount,
  category: nonEmptyString,
  date: dateString,
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Property 1: Transaction Add Round Trip', () => {
  let lsMock;
  let storage;

  beforeEach(() => {
    lsMock = createLocalStorageMock();
    storage = makeStorage(lsMock);
  });

  afterEach(() => {
    lsMock.clear();
  });

  it('adding a valid transaction and reading back should contain an equivalent transaction', () => {
    /**
     * Validates: Requirements 1.2, 5.1
     *
     * For any valid transaction (non-empty name, positive amount, non-empty category),
     * adding it via the storage module and then reading all transactions from storage
     * should return a list that contains an equivalent transaction.
     */
    fc.assert(
      fc.property(validTransaction, (tx) => {
        // Reset storage before each run
        lsMock.clear();
        storage = makeStorage(lsMock);

        storage.addTransaction(tx);
        const result = storage.getTransactions();

        const found = result.find(t => t.id === tx.id);
        expect(found).toBeDefined();
        expect(found.name).toBe(tx.name);
        expect(found.amount).toBe(tx.amount);
        expect(found.category).toBe(tx.category);
        expect(found.date).toBe(tx.date);
      }),
      { numRuns: 100 },
    );
  });
});
