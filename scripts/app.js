/* ══════════════════════════════════════════════
   LEDGER — app.js
   Vanilla JS | LocalStorage | Chart.js
══════════════════════════════════════════════ */

/* ── CONSTANTS & STATE ───────────────────────── */
const STORAGE_KEY   = 'ledger_transactions';
const CATS_KEY      = 'ledger_categories';
const LIMIT_KEY     = 'ledger_limit';
const THEME_KEY     = 'ledger_theme';

const BASE_CATEGORIES = [
  { name: 'Food',      color: '#f0a500' },
  { name: 'Transport', color: '#4db6c6' },
  { name: 'Fun',       color: '#a07df0' },
];

const CUSTOM_COLORS = [
  '#e87b5a','#6db87a','#e06fa0','#60c0e0','#c0a060',
  '#7ab8e8','#d4a060','#80c090','#d080b0','#90b8d0',
];

let state = {
  transactions: [],
  categories:   [],
  limit:        0,
  sortMode:     'date-desc',
  chart:        null,
};

/* ── PERSISTENCE ─────────────────────────────── */
function load() {
  try {
    state.transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const cats = JSON.parse(localStorage.getItem(CATS_KEY));
    state.categories = cats || [...BASE_CATEGORIES];
    state.limit = parseFloat(localStorage.getItem(LIMIT_KEY)) || 0;
  } catch {
    state.transactions = [];
    state.categories   = [...BASE_CATEGORIES];
    state.limit        = 0;
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
  localStorage.setItem(CATS_KEY,    JSON.stringify(state.categories));
  localStorage.setItem(LIMIT_KEY,   state.limit.toString());
}

/* ── CATEGORY HELPERS ────────────────────────── */
function getCategoryColor(name) {
  const cat = state.categories.find(c => c.name === name);
  return cat ? cat.color : '#888';
}

function populateCategorySelect() {
  const sel = document.getElementById('itemCategory');
  sel.innerHTML = '';
  state.categories.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = c.name;
    sel.appendChild(opt);
  });
}

/* ── FORMAT ──────────────────────────────────── */
function formatRp(n) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}

/* ── COMPUTE TOTALS ──────────────────────────── */
function computeTotals() {
  const totals = {};
  let grand = 0;
  state.transactions.forEach(tx => {
    totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
    grand += tx.amount;
  });
  return { totals, grand };
}

/* ── RENDER BALANCE HERO ─────────────────────── */
function renderBalance() {
  const { grand } = computeTotals();
  const el = document.getElementById('totalBalance');
  el.textContent = formatRp(grand);

  // Limit check
  const limitBanner  = document.getElementById('limitBanner');
  const limitMessage = document.getElementById('limitMessage');
  if (state.limit > 0 && grand >= state.limit) {
    el.classList.add('over-limit');
    limitMessage.textContent = `Limit ${formatRp(state.limit)} exceeded!`;
    limitBanner.style.display = 'flex';
    // Highlight each over-limit tx
    document.querySelectorAll('.tx-item').forEach(item => {
      item.classList.add('over-limit');
    });
  } else {
    el.classList.remove('over-limit');
    limitBanner.style.display = 'none';
    document.querySelectorAll('.tx-item').forEach(item => {
      item.classList.remove('over-limit');
    });
  }

  renderBalanceBar(grand);
}

function renderBalanceBar(grand) {
  const bar = document.getElementById('balanceBar');
  const { totals } = computeTotals();
  bar.innerHTML = '';
  if (grand === 0) return;
  state.categories.forEach(cat => {
    if (!totals[cat.name]) return;
    const seg = document.createElement('div');
    seg.className = 'balance-bar-segment';
    seg.style.width = ((totals[cat.name] / grand) * 100) + '%';
    seg.style.background = cat.color;
    bar.appendChild(seg);
  });
}

/* ── RENDER CHART ─────────────────────────────── */
function renderChart() {
  const { totals, grand } = computeTotals();
  const cats = state.categories.filter(c => totals[c.name]);

  const labels = cats.map(c => c.name);
  const data   = cats.map(c => totals[c.name]);
  const colors = cats.map(c => c.color);

  const centerNum = document.getElementById('chartCenterNum') ||
                    document.querySelector('.chart-center-num');
  const centerSub = document.querySelector('.chart-center-sub');
  centerNum.textContent = state.transactions.length;
  centerSub.textContent = state.transactions.length === 1 ? 'item' : 'items';

  const ctx = document.getElementById('spendingChart').getContext('2d');

  if (state.chart) state.chart.destroy();

  if (cats.length === 0) {
    state.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Empty'],
        datasets: [{ data: [1], backgroundColor: ['#2a2a32'], borderWidth: 0 }],
      },
      options: chartOptions(),
    });
    document.getElementById('chartLegend').innerHTML = '';
    return;
  }

  state.chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 6,
      }],
    },
    options: chartOptions(),
  });

  // Legend
  const legend = document.getElementById('chartLegend');
  legend.innerHTML = '';
  cats.forEach(cat => {
    const pct = grand > 0 ? Math.round((totals[cat.name] / grand) * 100) : 0;
    const li = document.createElement('div');
    li.className = 'legend-item';
    li.innerHTML = `
      <div class="legend-dot" style="background:${cat.color}"></div>
      <span class="legend-name">${cat.name}</span>
      <span class="legend-pct">${pct}%</span>
    `;
    legend.appendChild(li);
  });
}

function chartOptions() {
  return {
    cutout: '68%',
    plugins: { legend: { display: false }, tooltip: {
      callbacks: {
        label: ctx => ` ${formatRp(ctx.raw)}`,
      },
      backgroundColor: 'rgba(32,32,38,0.95)',
      titleColor: '#e8e6e0',
      bodyColor: '#f0a500',
      borderColor: '#2e2e38',
      borderWidth: 1,
      padding: 10,
    }},
    animation: { animateRotate: true, duration: 400 },
  };
}

/* ── RENDER TRANSACTION LIST ─────────────────── */
function renderList() {
  const container  = document.getElementById('transactionList');
  const emptyState = document.getElementById('emptyState');
  const sorted     = sortedTransactions();

  // Keep empty state sentinel
  container.innerHTML = '';
  if (sorted.length === 0) {
    container.appendChild(emptyState);
    return;
  }

  sorted.forEach(tx => {
    const item = document.createElement('div');
    item.className = 'tx-item';
    item.dataset.id = tx.id;

    const color = getCategoryColor(tx.category);
    item.innerHTML = `
      <div class="tx-cat-dot" style="background:${color}"></div>
      <div class="tx-info">
        <div class="tx-name">${escHtml(tx.name)}</div>
        <div class="tx-meta">
          <span class="tx-category">${escHtml(tx.category)}</span>
          <span class="tx-date">${formatDate(tx.date)}</span>
        </div>
      </div>
      <span class="tx-amount">${formatRp(tx.amount)}</span>
      <button class="tx-delete" data-id="${tx.id}" title="Delete">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4h6v2"/>
        </svg>
      </button>
    `;
    container.appendChild(item);
  });

  // Attach delete handlers
  container.querySelectorAll('.tx-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteTransaction(btn.dataset.id));
  });
}

function sortedTransactions() {
  const list = [...state.transactions];
  switch (state.sortMode) {
    case 'date-desc':    return list.sort((a,b) => b.date.localeCompare(a.date));
    case 'date-asc':     return list.sort((a,b) => a.date.localeCompare(b.date));
    case 'amount-desc':  return list.sort((a,b) => b.amount - a.amount);
    case 'amount-asc':   return list.sort((a,b) => a.amount - b.amount);
    case 'category':     return list.sort((a,b) => a.category.localeCompare(b.category));
    default:             return list;
  }
}

/* ── RENDER MONTHLY SUMMARY ──────────────────── */
function renderSummary() {
  const content = document.getElementById('summaryContent');
  const now     = new Date();
  const thisMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

  const txThisMonth = state.transactions.filter(tx =>
    tx.date.startsWith(thisMonth)
  );

  const totalMonth = txThisMonth.reduce((s, t) => s + t.amount, 0);
  const byCategory  = {};
  txThisMonth.forEach(tx => {
    byCategory[tx.category] = (byCategory[tx.category] || 0) + tx.amount;
  });

  const monthLabel = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  let html = `
    <div class="summary-cell">
      <div class="summary-cell-label">Month</div>
      <div class="summary-cell-value">${monthLabel}</div>
    </div>
    <div class="summary-cell">
      <div class="summary-cell-label">Total</div>
      <div class="summary-cell-value">${formatRp(totalMonth)}</div>
    </div>
    <div class="summary-cell">
      <div class="summary-cell-label">Entries</div>
      <div class="summary-cell-value">${txThisMonth.length}</div>
    </div>
    <div class="summary-cell">
      <div class="summary-cell-label">Avg/entry</div>
      <div class="summary-cell-value">${txThisMonth.length ? formatRp(totalMonth/txThisMonth.length) : 'Rp 0'}</div>
    </div>
  `;

  state.categories.forEach(cat => {
    if (byCategory[cat.name]) {
      html += `
        <div class="summary-cell">
          <div class="summary-cell-label" style="color:${cat.color}">${cat.name}</div>
          <div class="summary-cell-value">${formatRp(byCategory[cat.name])}</div>
        </div>
      `;
    }
  });

  content.innerHTML = html;
}

/* ── ADD TRANSACTION ─────────────────────────── */
function addTransaction() {
  const nameEl   = document.getElementById('itemName');
  const amtEl    = document.getElementById('itemAmount');
  const catEl    = document.getElementById('itemCategory');
  const limitEl  = document.getElementById('spendingLimit');
  const errorEl  = document.getElementById('formError');

  const name   = nameEl.value.trim();
  const amount = parseFloat(amtEl.value);
  const cat    = catEl.value;
  const limit  = parseFloat(limitEl.value) || 0;

  // Validate
  if (!name) {
    showError(errorEl, 'Please enter an item name.'); return;
  }
  if (!amount || amount <= 0) {
    showError(errorEl, 'Please enter a valid amount.'); return;
  }
  if (!cat) {
    showError(errorEl, 'Please select a category.'); return;
  }

  errorEl.textContent = '';

  const tx = {
    id:       Date.now().toString(),
    name,
    amount,
    category: cat,
    date:     new Date().toISOString(),
  };

  if (limit > 0) state.limit = limit;

  state.transactions.unshift(tx);
  save();
  renderAll();

  // Reset inputs
  nameEl.value  = '';
  amtEl.value   = '';
  nameEl.focus();
}

function deleteTransaction(id) {
  state.transactions = state.transactions.filter(t => t.id !== id);
  save();
  renderAll();
}

/* ── ADD CUSTOM CATEGORY ─────────────────────── */
function openCategoryModal() {
  document.getElementById('categoryModal').style.display = 'flex';
  document.getElementById('newCategoryName').value = '';
  document.getElementById('newCategoryName').focus();
}

function closeCategoryModal() {
  document.getElementById('categoryModal').style.display = 'none';
}

function confirmAddCategory() {
  const name = document.getElementById('newCategoryName').value.trim();
  if (!name) return;

  // Deduplicate
  if (state.categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
    closeCategoryModal();
    return;
  }

  const colorIndex = (state.categories.length - BASE_CATEGORIES.length) % CUSTOM_COLORS.length;
  state.categories.push({ name, color: CUSTOM_COLORS[colorIndex] });
  save();
  populateCategorySelect();

  // Select the new category
  document.getElementById('itemCategory').value = name;
  closeCategoryModal();
}

/* ── THEME ───────────────────────────────────── */
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  document.documentElement.dataset.theme = saved;
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
  // Redraw chart with new colors
  renderChart();
}

/* ── RENDER ALL ──────────────────────────────── */
function renderAll() {
  renderBalance();
  renderChart();
  renderList();
}

/* ── HELPERS ─────────────────────────────────── */
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showError(el, msg) {
  el.textContent = msg;
  el.style.animation = 'none';
  requestAnimationFrame(() => el.style.animation = '');
}

/* ── INIT ─────────────────────────────────────── */
function init() {
  initTheme();
  load();

  populateCategorySelect();
  renderAll();

  // Restore saved limit
  if (state.limit > 0) {
    document.getElementById('spendingLimit').value = state.limit;
  }

  // Event: Add transaction
  document.getElementById('addTransactionBtn').addEventListener('click', addTransaction);

  // Event: Enter key on inputs
  ['itemName','itemAmount'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') addTransaction();
    });
  });

  // Event: Sort
  document.getElementById('sortSelect').addEventListener('change', e => {
    state.sortMode = e.target.value;
    renderList();
  });

  // Event: Theme toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // Event: Summary panel
  document.getElementById('summaryToggle').addEventListener('click', () => {
    const panel = document.getElementById('summaryPanel');
    if (panel.style.display === 'none') {
      renderSummary();
      panel.style.display = 'block';
    } else {
      panel.style.display = 'none';
    }
  });

  document.getElementById('summaryClose').addEventListener('click', () => {
    document.getElementById('summaryPanel').style.display = 'none';
  });

  // Event: Add category modal
  document.getElementById('addCategoryBtn').addEventListener('click', openCategoryModal);
  document.getElementById('modalCancel').addEventListener('click', closeCategoryModal);
  document.getElementById('modalConfirm').addEventListener('click', confirmAddCategory);
  document.getElementById('newCategoryName').addEventListener('keydown', e => {
    if (e.key === 'Enter') confirmAddCategory();
    if (e.key === 'Escape') closeCategoryModal();
  });
  document.getElementById('categoryModal').addEventListener('click', e => {
    if (e.target === document.getElementById('categoryModal')) closeCategoryModal();
  });
}

document.addEventListener('DOMContentLoaded', init);