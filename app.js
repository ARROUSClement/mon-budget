'use strict';
/* Mon Budget — application 100 % locale (données dans le navigateur de l'iPhone). */

const STORE_KEY = 'mon-budget-v1';

const DEFAULT_CATS = [
  { id: 'courses', name: 'Courses', emoji: '🛒' },
  { id: 'restaurants', name: 'Restaurants & cafés', emoji: '🍽️' },
  { id: 'transport', name: 'Transport', emoji: '🚗' },
  { id: 'logement', name: 'Logement', emoji: '🏠' },
  { id: 'factures', name: 'Factures & assurances', emoji: '⚡' },
  { id: 'abonnements', name: 'Abonnements', emoji: '📺' },
  { id: 'sante', name: 'Santé', emoji: '💊' },
  { id: 'shopping', name: 'Shopping', emoji: '🛍️' },
  { id: 'loisirs', name: 'Loisirs', emoji: '🎉' },
  { id: 'voyages', name: 'Voyages', emoji: '✈️' },
  { id: 'epargne', name: 'Épargne', emoji: '💰' },
  { id: 'retraits', name: 'Retraits espèces', emoji: '🏧' },
  { id: 'divers', name: 'Divers', emoji: '📦' },
  { id: 'revenus', name: 'Revenus', emoji: '💶' },
];

/* Mots-clés → catégorie (libellés normalisés, sans accents, en minuscules). */
const KEYWORDS = {
  courses: ['carrefour', 'leclerc', 'auchan', 'intermarche', 'lidl', 'aldi', 'monoprix', 'franprix', 'casino', 'super u', 'hyper u', 'systeme u', 'picard', 'biocoop', 'naturalia', 'grand frais', 'netto', 'leader price', 'match', 'spar', 'cora', 'g20', 'proxi', 'carrefour city', 'boucherie', 'primeur'],
  restaurants: ['mcdo', 'mcdonald', 'burger king', 'kfc', 'quick', 'uber eats', 'ubereats', 'deliveroo', 'just eat', 'starbucks', 'restaurant', 'resto', 'brasserie', 'boulangerie', 'patisserie', 'sushi', 'pizza', 'cafe', 'bar ', 'subway', 'five guys', 'columbus', 'paul '],
  transport: ['sncf', 'ratp', 'navigo', 'uber', 'bolt', 'heetch', 'blablacar', 'total', 'esso', 'shell', 'avia', 'station', 'carburant', 'autoroute', 'vinci', 'sanef', 'aprr', 'peage', 'parking', 'indigo', 'tcl', 'tisseo', 'rtm', 'lime', 'velib', 'ouigo', 'trainline'],
  logement: ['loyer', 'foncia', 'nexity', 'syndic', 'charges copro', 'leroy merlin', 'castorama', 'brico'],
  factures: ['edf', 'engie', 'veolia', 'suez', 'eau de', 'orange', 'sosh', 'sfr', 'red by sfr', 'bouygues', 'free mobile', 'free telecom', 'assurance', 'maif', 'macif', 'matmut', 'axa', 'allianz', 'groupama', 'gmf', 'mma', 'direct assurance', 'impot', 'dgfip', 'tresor public', 'cotisation'],
  abonnements: ['netflix', 'spotify', 'deezer', 'disney', 'canal', 'apple.com', 'apple com', 'itunes', 'icloud', 'prime video', 'amazon prime', 'youtube', 'google one', 'openai', 'chatgpt', 'anthropic', 'claude.ai', 'microsoft', 'adobe', 'playstation plus', 'xbox', 'basic fit', 'fitness park', 'abonnement'],
  sante: ['pharmacie', 'pharma', 'docteur', 'dr ', 'medecin', 'dentiste', 'opticien', 'kine', 'doctolib', 'laboratoire', 'hopital', 'clinique', 'mutuelle'],
  shopping: ['amazon', 'amzn', 'fnac', 'darty', 'boulanger', 'zara', 'h&m', 'h et m', 'uniqlo', 'decathlon', 'ikea', 'cdiscount', 'vinted', 'apple store', 'sephora', 'action', 'primark', 'kiabi', 'celio', 'jules', 'shein', 'aliexpress', 'temu', 'zalando', 'galeries lafayette', 'printemps'],
  loisirs: ['cinema', 'ugc', 'pathe', 'gaumont', 'mk2', 'steam', 'playstation', 'nintendo', 'ticketmaster', 'fnac spectacles', 'billetterie', 'musee', 'bowling', 'concert', 'cultura', 'librairie'],
  voyages: ['airbnb', 'booking', 'expedia', 'air france', 'easyjet', 'ryanair', 'transavia', 'vueling', 'volotea', 'hotel', 'ibis', 'accor', 'flixbus'],
  retraits: ['retrait dab', 'retrait', 'dab '],
  epargne: ['livret a', 'livret', 'ldds', 'epargne', 'pel '],
  revenus: ['salaire', 'paie', 'caf ', 'pole emploi', 'france travail', 'cpam', 'ameli', 'remboursement'],
};

const FREQS = [
  ['week:1', 'Chaque semaine'],
  ['week:2', 'Toutes les 2 semaines'],
  ['month:1', 'Chaque mois'],
  ['month:2', 'Tous les 2 mois'],
  ['month:3', 'Chaque trimestre'],
  ['month:6', 'Chaque semestre'],
  ['year:1', 'Chaque année'],
  ['custom', 'Personnalisée…'],
];
const UNIT_LABEL = { day: ['jour', 'jours'], week: ['semaine', 'semaines'], month: ['mois', 'mois'], year: ['an', 'ans'] };
const PER_MONTH = { day: 30.4375, week: 30.4375 / 7, month: 1, year: 1 / 12 };

/* ---------- Utilitaires ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const pad = (n) => String(n).padStart(2, '0');
const isoOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const dateOf = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const today = () => isoOf(new Date());
const addDays = (s, n) => { const d = dateOf(s); d.setDate(d.getDate() + n); return isoOf(d); };
const monthOf = (s) => s.slice(0, 7);
const shiftMonth = (m, n) => { const [y, mo] = m.split('-').map(Number); const d = new Date(y, mo - 1 + n, 1); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; };
const endOfMonth = (m) => { const [y, mo] = m.split('-').map(Number); return isoOf(new Date(y, mo, 0)); };
const monthLabel = (m) => new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(dateOf(m + '-01'));
const dayLabel = (s) => new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(dateOf(s));
const shortDate = (s) => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(dateOf(s));
const EUR = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
const fmt = (c) => EUR.format((c || 0) / 100);
const fmtSigned = (c) => (c > 0 ? '+' : '') + fmt(c);
const sum = (arr) => arr.reduce((a, t) => a + t.amount, 0);
const hash = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };

/** "1 234,56 €", "-12.5", "(3,20)", "12,50EUR" → centimes (entier), NaN si illisible. */
function parseAmount(raw) {
  if (raw == null) return NaN;
  let s = String(raw).trim();
  if (!s) return NaN;
  let neg = false;
  if (/^\(.*\)$/.test(s)) { neg = true; s = s.slice(1, -1); }
  s = s.replace(/[\s  ]|€|eur(os)?/gi, '');
  if (s.endsWith('-')) { neg = true; s = s.slice(0, -1); }
  if (s.startsWith('-')) { neg = !neg; s = s.slice(1); } else if (s.startsWith('+')) s = s.slice(1);
  const lc = s.lastIndexOf(','), ld = s.lastIndexOf('.');
  if (lc > -1 && ld > -1) {
    s = lc > ld ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  } else if (lc > -1) {
    s = s.replace(/,/g, (m, i) => (i === lc ? '.' : ''));
  } else if ((s.match(/\./g) || []).length > 1) {
    s = s.replace(/\.(?=.*\.)/g, '');
  }
  if (!/^\d*\.?\d+$/.test(s)) return NaN;
  const v = Math.round(parseFloat(s) * 100);
  return neg ? -v : v;
}

/** "06/11/2026", "6/11/26", "2026-11-06", "20261106", "06.11.2026" → "2026-11-06" ou null. */
function parseDate(raw) {
  const s = String(raw || '').trim();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return valid(+m[1], +m[2], +m[3]);
  m = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})/);
  if (m) { let y = +m[3]; if (y < 100) y += 2000; return valid(y, +m[2], +m[1]); }
  m = s.match(/^(\d{4})(\d{2})(\d{2})/);
  if (m) return valid(+m[1], +m[2], +m[3]);
  return null;
  function valid(y, mo, d) {
    if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    const dt = new Date(y, mo - 1, d);
    return dt.getMonth() === mo - 1 ? isoOf(dt) : null;
  }
}

/** Nettoie un libellé bancaire : "ACHAT CB CARREFOUR 04.11.26 CARTE NUMERO 123" → "carrefour". */
function normLabel(label) {
  return String(label || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/carte\s*(numero|n°|no|x+)?\s*[\dx*]+/g, ' ')
    .replace(/\b(achat|paiement|payment|cb|carte|facture|prlv|prelevement|sepa|de|du|des|vir|virement|instantane|inst|recu|emis|vers|ref|europeen|permanent|retrait|dab|le|la|les|par|pour)\b/g, (w) => (w === 'retrait' || w === 'dab' || w === 'virement' ? w : ' '))
    .replace(/\b\d{1,2}[\/.]\d{1,2}([\/.]\d{2,4})?\b/g, ' ')
    .replace(/\b\d{3,}\b/g, ' ')
    .replace(/[^a-z0-9&.' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
/** Clé courte pour mémoriser un commerçant (2 premiers mots significatifs). */
const merchantKey = (label) => normLabel(label).split(' ').filter((w) => w.length > 1 && !['virement', 'retrait', 'dab'].includes(w)).slice(0, 2).join(' ');

/* ---------- Données ---------- */
function blankState() {
  return { v: 1, transactions: [], recurring: [], budgets: {}, categories: DEFAULT_CATS.map((c) => ({ ...c })), rules: [], apSeen: {} };
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) { const s = JSON.parse(raw); if (s && s.v) return Object.assign(blankState(), s); }
  } catch (e) { console.error(e); }
  return blankState();
}
let S = loadState();
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); }
  catch (e) { toast('⚠️ Enregistrement impossible : ' + e.message); }
}

const ui = { view: 'home', month: monthOf(today()), q: '', cat: '' };

const cat = (id) => S.categories.find((c) => c.id === id) || S.categories.find((c) => c.id === 'divers') || { id: 'divers', name: 'Divers', emoji: '📦' };
const expenseCats = () => S.categories.filter((c) => c.id !== 'revenus');

function guessCategory(label, amount) {
  const key = merchantKey(label);
  const norm = ' ' + normLabel(label) + ' ';
  if (key) {
    const rule = S.rules.find((r) => key === r.key || key.startsWith(r.key + ' ') || norm.includes(' ' + r.key + ' '));
    if (rule && S.categories.some((c) => c.id === rule.cat)) return rule.cat;
  }
  let best = null, bestLen = 0;
  for (const [c, kws] of Object.entries(KEYWORDS)) {
    if (amount < 0 && c === 'revenus') continue;
    for (const kw of kws) {
      if (norm.includes(' ' + kw) && kw.length > bestLen && S.categories.some((x) => x.id === c)) { best = c; bestLen = kw.length; }
    }
  }
  if (best) return best;
  return amount > 0 ? 'revenus' : 'divers';
}

function addTx(t) {
  const tx = { id: uid(), date: today(), amount: 0, label: '', cat: '', note: '', source: 'manuel', ...t };
  if (!tx.cat) tx.cat = guessCategory(tx.label, tx.amount);
  S.transactions.push(tx);
  return tx;
}

/* ---------- Récurrences ---------- */
function occurrence(rec, k) {
  const s = dateOf(rec.start), n = rec.every * k;
  if (rec.unit === 'day') return isoOf(new Date(s.getFullYear(), s.getMonth(), s.getDate() + n));
  if (rec.unit === 'week') return isoOf(new Date(s.getFullYear(), s.getMonth(), s.getDate() + 7 * n));
  const months = rec.unit === 'year' ? 12 * n : n;
  const first = new Date(s.getFullYear(), s.getMonth() + months, 1);
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  return isoOf(new Date(first.getFullYear(), first.getMonth(), Math.min(s.getDate(), last)));
}
/** Occurrences dans ]after, upto] (au plus `limit`). */
function occurrencesBetween(rec, after, upto, limit = Infinity) {
  const out = [];
  for (let k = 0; k < 50000 && out.length < limit; k++) {
    const d = occurrence(rec, k);
    if (d > upto || (rec.end && d > rec.end)) break;
    if (d > after) out.push(d);
  }
  return out;
}
const nextOccurrence = (rec) => occurrencesBetween(rec, today(), '9999-12-31', 1)[0];
const freqLabel = (rec) => {
  const f = FREQS.find(([v]) => v === `${rec.unit}:${rec.every}`);
  if (f) return f[1];
  const [one, many] = UNIT_LABEL[rec.unit];
  return rec.every === 1 ? `Chaque ${one}` : `Tous les ${rec.every} ${many}`;
};
const monthlyEquivalent = (rec) => Math.round(rec.amount * PER_MONTH[rec.unit] / rec.every);

/** Crée les opérations dues (jusqu'à aujourd'hui) pour chaque prélèvement récurrent. */
function materializeRecurring() {
  const t = today();
  let created = 0;
  for (const rec of S.recurring) {
    if (rec.paused) continue;
    const after = rec.generatedUntil || addDays(rec.start, -1);
    if (after >= t) continue;
    for (const d of occurrencesBetween(rec, after, t)) {
      addTx({ date: d, amount: rec.amount, label: rec.label, cat: rec.cat, source: 'recurrent', recurringId: rec.id, note: rec.note || '' });
      created++;
    }
    rec.generatedUntil = t;
  }
  if (created) save();
  return created;
}

/** Montants récurrents encore à venir dans le mois (après aujourd'hui), par catégorie. */
function plannedForMonth(m) {
  const res = {};
  const end = endOfMonth(m), start = addDays(m + '-01', -1);
  const after = start > today() ? start : today();
  if (after >= end) return res;
  for (const rec of S.recurring) {
    if (rec.paused || rec.amount >= 0) continue;
    const n = occurrencesBetween(rec, after, end).length;
    if (n) res[rec.cat] = (res[rec.cat] || 0) + -rec.amount * n;
  }
  return res;
}

/* ---------- Calculs ---------- */
const txInMonth = (m) => S.transactions.filter((t) => t.date.startsWith(m));
function spentByCat(txs) {
  const r = {};
  for (const t of txs) if (t.amount < 0) r[t.cat] = (r[t.cat] || 0) - t.amount;
  return r;
}
/** Moyennes sur les 3 derniers mois complets ayant des données. */
function averages() {
  const cur = monthOf(today());
  let months = [1, 2, 3].map((i) => shiftMonth(cur, -i)).filter((m) => S.transactions.some((t) => t.date.startsWith(m)));
  if (!months.length && S.transactions.some((t) => t.date.startsWith(cur))) months = [cur]; // seulement le mois en cours
  const spent = {}; let income = 0;
  for (const m of months) {
    const txs = txInMonth(m);
    for (const [c, v] of Object.entries(spentByCat(txs))) spent[c] = (spent[c] || 0) + v;
    income += sum(txs.filter((t) => t.amount > 0));
  }
  const n = months.length || 1;
  for (const c in spent) spent[c] = Math.round(spent[c] / n);
  return { months, spent, income: Math.round(income / n) };
}
const budgetTotal = () => Object.values(S.budgets).reduce((a, b) => a + (b || 0), 0);

/* ---------- Rendu ---------- */
function render() {
  const titles = { home: 'Mon Budget', ops: 'Opérations', budgets: 'Budgets', recurring: 'Récurrents', settings: 'Réglages' };
  $('#title').textContent = titles[ui.view];
  $('#main').innerHTML = VIEWS[ui.view]();
  $$('.tab').forEach((t) => t.classList.toggle('active', t.dataset.view === ui.view));
  $('.fab').hidden = ui.view === 'settings';
}

const monthSwitch = () => `
  <div class="month-switch">
    <button data-act="month" data-d="-1" aria-label="Mois précédent">‹</button>
    <strong>${esc(monthLabel(ui.month))}</strong>
    <button data-act="month" data-d="1" aria-label="Mois suivant">›</button>
  </div>`;

const SRC = { applepay: ' Pay', banque: '🏦 Banque', recurrent: '🔁', manuel: '' };
function txRow(t) {
  const c = cat(t.cat);
  const badge = SRC[t.source] ? `<span class="badge">${SRC[t.source]}</span>` : '';
  return `<button class="row" data-act="editTx" data-id="${t.id}">
    <span class="emoji" aria-hidden="true">${c.emoji}</span>
    <span class="grow"><span class="t1">${esc(t.label || c.name)}</span><span class="t2">${esc(c.name)}${badge}</span></span>
    <span class="amt ${t.amount > 0 ? 'pos' : ''}">${fmtSigned(t.amount)}</span>
  </button>`;
}

function budgetMeter(c, spent, budget, planned = 0) {
  const ratio = budget ? spent / budget : 0;
  const level = ratio > 1 ? 'critical' : ratio >= 0.85 ? 'warning' : 'good';
  const w = Math.min(ratio, 1) * 100;
  const pw = budget ? Math.min(planned / budget, Math.max(0, 1 - Math.min(ratio, 1))) * 100 : 0;
  const status = ratio > 1
    ? `<span class="ic critical">✕ Dépassé de ${fmt(spent - budget)}</span>`
    : ratio >= 0.85 ? `<span class="ic warning">⚠ Reste ${fmt(budget - spent)}</span>`
      : `<span class="ic good">✓ Reste ${fmt(budget - spent)}</span>`;
  return `<button class="bar-row" data-act="filterCat" data-cat="${c.id}">
    <div class="bar-top"><span>${c.emoji} ${esc(c.name)}</span><span class="v">${fmt(spent)} <span class="p">/ ${fmt(budget)}</span></span></div>
    <div class="track" role="img" aria-label="${esc(c.name)} : ${Math.round(ratio * 100)} % du budget">
      ${w > 0 ? `<div class="fill ${level}" style="width:${w}%"></div>` : ''}
      ${pw > 0 ? `<div class="fill ${level} planned" style="width:${pw}%"></div>` : ''}
    </div>
    <div class="status">${status}<span>${planned ? `dont ${fmt(planned)} prévus` : `${Math.round(ratio * 100)} %`}</span></div>
  </button>`;
}

const VIEWS = {
  home() {
    const m = ui.month, txs = txInMonth(m);
    if (!S.transactions.length && !S.recurring.length) return onboarding();
    const inc = sum(txs.filter((t) => t.amount > 0));
    const exp = -sum(txs.filter((t) => t.amount < 0));
    const bt = budgetTotal();
    const planned = Object.values(plannedForMonth(m)).reduce((a, b) => a + b, 0);
    const heroVal = bt ? bt - exp : inc - exp;
    const byCat = Object.entries(spentByCat(txs)).sort((a, b) => b[1] - a[1]);
    const max = byCat[0]?.[1] || 1;
    const upcoming = S.recurring.filter((r) => !r.paused)
      .flatMap((r) => occurrencesBetween(r, today(), addDays(today(), 30)).map((d) => ({ r, d })))
      .sort((a, b) => a.d.localeCompare(b.d)).slice(0, 6);
    const recent = [...txs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    return `${monthSwitch()}
    <section class="card hero">
      <div class="label">${bt ? 'Reste à dépenser (budgets du mois)' : 'Solde du mois'}</div>
      <div class="value ${heroVal < 0 ? 'neg' : ''}">${fmt(heroVal)}</div>
      ${planned ? `<div class="small muted">Encore ${fmt(planned)} de prélèvements prévus ce mois-ci</div>` : ''}
      <div class="tiles">
        <div class="tile"><div class="k">Revenus</div><div class="v">${fmt(inc)}</div></div>
        <div class="tile"><div class="k">Dépenses</div><div class="v">${fmt(exp)}</div></div>
        <div class="tile"><div class="k">Solde</div><div class="v">${fmtSigned(inc - exp)}</div></div>
      </div>
    </section>
    <section class="card">
      <h2>Dépenses par catégorie</h2>
      ${byCat.length ? byCat.map(([id, v]) => {
        const c = cat(id);
        return `<button class="bar-row" data-act="filterCat" data-cat="${id}">
          <div class="bar-top"><span>${c.emoji} ${esc(c.name)}</span><span class="v">${fmt(v)}<span class="p">${Math.round(v / exp * 100)} %</span></span></div>
          <div class="track"><div class="fill" style="width:${v / max * 100}%"></div></div>
        </button>`;
      }).join('') : '<p class="muted small">Aucune dépense ce mois-ci.</p>'}
    </section>
    <section class="card">
      <h2>Prélèvements à venir (30 j) <button class="link" data-act="go" data-view="recurring">Tout voir</button></h2>
      ${upcoming.length ? upcoming.map(({ r, d }) => `<button class="row" data-act="editRec" data-id="${r.id}">
        <span class="emoji">${cat(r.cat).emoji}</span>
        <span class="grow"><span class="t1">${esc(r.label)}</span><span class="t2">${esc(shortDate(d))} · ${esc(freqLabel(r))}</span></span>
        <span class="amt ${r.amount > 0 ? 'pos' : ''}">${fmtSigned(r.amount)}</span></button>`).join('')
        : '<p class="muted small">Aucun. Ajoute ton loyer, tes abonnements… dans l’onglet Récurrents.</p>'}
    </section>
    <section class="card">
      <h2>Dernières opérations <button class="link" data-act="go" data-view="ops">Tout voir</button></h2>
      ${recent.length ? recent.map(txRow).join('') : '<p class="muted small">Aucune opération ce mois-ci.</p>'}
    </section>`;
  },

  ops() {
    return `<div class="filters">
      <input type="search" placeholder="Rechercher (tous les mois)" value="${esc(ui.q)}" data-input="q">
      <select data-change="cat"><option value="">Toutes catégories</option>
        ${S.categories.map((c) => `<option value="${c.id}" ${ui.cat === c.id ? 'selected' : ''}>${c.emoji} ${esc(c.name)}</option>`).join('')}</select>
    </div>
    <div id="opsList">${VIEWS.opsList()}</div>`;
  },

  opsList() {
    const q = normLabel(ui.q);
    let txs = q ? S.transactions.filter((t) => normLabel(t.label + ' ' + (t.note || '') + ' ' + cat(t.cat).name).includes(q)) : txInMonth(ui.month);
    if (ui.cat) txs = txs.filter((t) => t.cat === ui.cat);
    txs = [...txs].sort((a, b) => b.date.localeCompare(a.date));
    const groups = {};
    for (const t of txs) (groups[t.date] ||= []).push(t);
    const total = sum(txs);
    return `${q ? '' : monthSwitch()}
    <p class="small muted">${txs.length} opération${txs.length > 1 ? 's' : ''} · total ${fmtSigned(total)}</p>
    <div class="card">
      ${txs.length ? Object.entries(groups).map(([d, list]) => `<div class="day-head"><span>${esc(dayLabel(d))}</span><span>${fmtSigned(sum(list))}</span></div>${list.map(txRow).join('')}`).join('')
        : '<div class="empty"><div class="big">🗒️</div>Aucune opération.<br><button class="link" data-act="newTx">Ajouter une dépense</button></div>'}
    </div>`;
  },

  budgets() {
    const m = ui.month, spent = spentByCat(txInMonth(m)), planned = plannedForMonth(m);
    const ids = Object.keys(S.budgets).filter((id) => S.budgets[id] > 0);
    const avg = averages();
    const bt = budgetTotal();
    const unbudgeted = Object.entries(spent).filter(([id]) => !(S.budgets[id] > 0)).sort((a, b) => b[1] - a[1]);
    const totalSpentBudgeted = ids.reduce((a, id) => a + (spent[id] || 0), 0);
    if (!ids.length) {
      return `<div class="card empty"><div class="big">🎯</div>
        <p>Aucun budget défini.</p>
        <p class="small">Je peux te proposer des budgets à partir de tes dépenses des derniers mois${avg.months.length ? '' : ' (importe d’abord ton relevé ou saisis tes dépenses)'}.</p>
        <div class="btns"><button class="btn primary" data-act="suggestBudgets">✨ Suggérer mes budgets</button><button class="btn" data-act="editBudgets">Définir à la main</button></div></div>`;
    }
    return `${monthSwitch()}
    <section class="card">
      <h2>Vue d’ensemble</h2>
      ${budgetMeter({ id: '', name: 'Total des budgets', emoji: '🎯' }, totalSpentBudgeted, bt, ids.reduce((a, id) => a + (planned[id] || 0), 0))}
      ${avg.income ? `<p class="small muted">Revenus moyens : <strong>${fmt(avg.income)}</strong>/mois · budgets : <strong>${fmt(bt)}</strong> → épargne possible : <strong>${fmtSigned(avg.income - bt)}</strong>/mois</p>` : ''}
    </section>
    <section class="card"><h2>Par catégorie</h2>
      ${ids.map((id) => budgetMeter(cat(id), spent[id] || 0, S.budgets[id], planned[id] || 0)).join('')}
    </section>
    ${unbudgeted.length ? `<section class="card"><h2>Hors budget</h2>
      ${unbudgeted.map(([id, v]) => `<button class="row" data-act="filterCat" data-cat="${id}"><span class="emoji">${cat(id).emoji}</span><span class="grow"><span class="t1">${esc(cat(id).name)}</span></span><span class="amt">${fmt(v)}</span></button>`).join('')}
    </section>` : ''}
    <div class="btns"><button class="btn" data-act="editBudgets">✏️ Modifier</button><button class="btn" data-act="suggestBudgets">✨ Recalculer</button></div>`;
  },

  recurring() {
    const list = [...S.recurring].sort((a, b) => (nextOccurrence(a) || '9').localeCompare(nextOccurrence(b) || '9'));
    const out = list.filter((r) => r.amount < 0 && !r.paused).reduce((a, r) => a + monthlyEquivalent(r), 0);
    const inc = list.filter((r) => r.amount > 0 && !r.paused).reduce((a, r) => a + monthlyEquivalent(r), 0);
    return `<section class="card hero">
      <div class="label">Charges fixes (équivalent mensuel)</div>
      <div class="value">${fmt(-out)}</div>
      ${inc ? `<div class="small muted">Revenus réguliers : ${fmt(inc)}/mois → reste ${fmtSigned(inc + out)}</div>` : ''}
    </section>
    <div class="card">
      ${list.length ? list.map((r) => {
        const n = nextOccurrence(r);
        return `<button class="row" data-act="editRec" data-id="${r.id}">
          <span class="emoji">${cat(r.cat).emoji}</span>
          <span class="grow"><span class="t1">${esc(r.label)}${r.paused ? ' <span class="badge">en pause</span>' : ''}</span>
          <span class="t2">${esc(freqLabel(r))} · ${n ? 'prochain ' + esc(shortDate(n)) : 'terminé'}</span></span>
          <span class="amt ${r.amount > 0 ? 'pos' : ''}">${fmtSigned(r.amount)}</span></button>`;
      }).join('') : '<div class="empty"><div class="big">🔁</div>Ajoute tes prélèvements : loyer, électricité, téléphone, abonnements, salaire…</div>'}
    </div>
    <button class="btn primary block" data-act="newRec">+ Nouveau prélèvement / revenu récurrent</button>`;
  },

  settings() {
    const appUrl = location.origin + location.pathname;
    return `<section class="card">
      <h2>Importer</h2>
      <p class="small muted">Relevé de ta banque (CSV ou OFX, ex. La Banque Postale) ou fichier Apple Pay créé par le Raccourci. Les doublons sont ignorés : tu peux réimporter sans risque.</p>
      <button class="btn primary block" data-act="pickFile">📥 Importer un fichier</button>
      <details style="margin-top:10px"><summary>Exporter depuis La Banque Postale</summary>
        <ol class="steps small">
          <li>Sur labanquepostale.fr (navigateur, version ordinateur si besoin), ouvre ton compte.</li>
          <li>Choisis <em>Télécharger / Exporter les opérations</em>, format <strong>CSV</strong> (ou OFX), la période la plus longue possible.</li>
          <li>Enregistre le fichier dans <em>Fichiers</em>, puis importe-le ici.</li>
        </ol></details>
    </section>
    <section class="card">
      <h2> Pay automatique</h2>
      <p class="small muted">Un Raccourci iOS enregistre chaque paiement Apple Pay dans un fichier, sans ouvrir l’app. Tu l’importes ensuite ici d’un tap.</p>
      <button class="btn block" data-act="applePayHelp">Voir la configuration</button>
    </section>
    <section class="card">
      <h2>Catégories <button class="link" data-act="newCat">+ Ajouter</button></h2>
      ${S.categories.map((c) => `<button class="row" data-act="editCat" data-id="${c.id}"><span class="emoji">${c.emoji}</span><span class="grow"><span class="t1">${esc(c.name)}</span></span><span class="muted">›</span></button>`).join('')}
    </section>
    <section class="card">
      <h2>Règles mémorisées</h2>
      ${S.rules.length ? S.rules.map((r, i) => `<div class="row"><span class="emoji">${cat(r.cat).emoji}</span><span class="grow"><span class="t1">« ${esc(r.key)} »</span><span class="t2">→ ${esc(cat(r.cat).name)}</span></span><button class="btn danger" data-act="delRule" data-i="${i}" aria-label="Supprimer">✕</button></div>`).join('')
        : '<p class="small muted">Quand tu changes la catégorie d’une opération, l’app retient le commerçant pour les prochaines fois.</p>'}
    </section>
    <section class="card">
      <h2>Sauvegarde</h2>
      <p class="small muted">Tes données restent uniquement sur cet iPhone. Exporte une sauvegarde de temps en temps (dans Fichiers / iCloud Drive).</p>
      <div class="btns"><button class="btn" data-act="exportBackup">💾 Exporter</button><button class="btn" data-act="importBackup">♻️ Restaurer</button></div>
      <div class="btns"><button class="btn" data-act="exportCsv">📄 Export CSV</button><button class="btn danger" data-act="wipe">Tout effacer</button></div>
    </section>
    <p class="small muted center">${S.transactions.length} opérations · ${S.recurring.length} récurrents<br>${esc(appUrl)}</p>`;
  },
};

function onboarding() {
  return `<div class="card empty">
    <div class="big">👋</div>
    <h3>Bienvenue !</h3>
    <p class="small">Commence par récupérer ton historique, puis laisse l’app te proposer des budgets.</p>
    <div class="btns" style="flex-direction:column">
      <button class="btn primary" data-act="pickFile">📥 Importer mon relevé bancaire (CSV)</button>
      <button class="btn" data-act="newTx">✍️ Saisir une dépense</button>
      <button class="btn" data-act="newRec">🔁 Ajouter un prélèvement (loyer, abonnement…)</button>
      <button class="btn" data-act="applePayHelp"> Configurer Apple Pay</button>
    </div></div>`;
}

/* ---------- Sheets / toasts ---------- */
function openSheet(html, onMount) {
  $('#sheetBody').innerHTML = html;
  $('#sheet').hidden = false;
  document.body.style.overflow = 'hidden';
  onMount && onMount($('#sheetBody'));
}
function closeSheet() { $('#sheet').hidden = true; $('#sheetBody').innerHTML = ''; document.body.style.overflow = ''; }
let toastTimer;
function toast(msg, action) {
  const el = $('#toast');
  el.innerHTML = `<span>${esc(msg)}</span>${action ? `<button>${esc(action.label)}</button>` : ''}`;
  el.hidden = false;
  if (action) el.querySelector('button').onclick = () => { el.hidden = true; action.run(); };
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, action ? 6000 : 3000);
}
const catOptions = (sel, includeIncome = true) => S.categories.filter((c) => includeIncome || c.id !== 'revenus')
  .map((c) => `<option value="${c.id}" ${c.id === sel ? 'selected' : ''}>${c.emoji} ${esc(c.name)}</option>`).join('');
const centsToInput = (c) => c ? (Math.abs(c) / 100).toFixed(2).replace('.', ',') : '';

/* ---------- Formulaire opération ---------- */
function openTxForm(t, prefill = {}) {
  const isNew = !t;
  const d = t || { date: today(), amount: 0, label: '', cat: '', note: '', source: 'manuel', ...prefill };
  const income = d.amount > 0;
  const labels = [...new Set(S.transactions.map((x) => x.label).filter(Boolean))].slice(-200);
  openSheet(`<h3>${isNew ? (d.source === 'applepay' ? ' Paiement Apple Pay' : 'Nouvelle opération') : 'Modifier l’opération'}</h3>
  <form id="f" autocomplete="off">
    <div class="seg">
      <label><input type="radio" name="type" value="exp" ${income ? '' : 'checked'}>Dépense</label>
      <label><input type="radio" name="type" value="inc" ${income ? 'checked' : ''}>Revenu</label>
    </div>
    <label class="field"><span>Montant (€)</span><input class="amount-input" name="amount" type="text" inputmode="decimal" placeholder="0,00" value="${centsToInput(d.amount)}" required></label>
    <label class="field"><span>Libellé / commerçant</span><input name="label" type="text" list="labels" value="${esc(d.label)}" placeholder="ex. Carrefour, Loyer…"></label>
    <datalist id="labels">${labels.map((l) => `<option value="${esc(l)}">`).join('')}</datalist>
    <div class="two">
      <label class="field"><span>Catégorie</span><select name="cat">${catOptions(d.cat || guessCategory(d.label, d.amount || -1))}</select></label>
      <label class="field"><span>Date</span><input name="date" type="date" value="${d.date}" max="2100-12-31" required></label>
    </div>
    <label class="field"><span>Note</span><input name="note" type="text" value="${esc(d.note || '')}" placeholder="facultatif"></label>
    <label class="check"><input type="checkbox" name="remember"> <span>Toujours classer ce commerçant dans cette catégorie</span></label>
    ${isNew ? '<label class="check"><input type="checkbox" name="repeat"> <span>C’est un prélèvement récurrent (régler la périodicité ensuite)</span></label>' : ''}
    ${t?.recurringId ? '<p class="small muted">🔁 Générée par un prélèvement récurrent.</p>' : ''}
    ${t?.bankLabel ? `<p class="small muted">🏦 Rapprochée avec la banque : ${esc(t.bankLabel)}</p>` : ''}
    <div class="btns">
      <button class="btn primary" type="submit">Enregistrer</button>
      ${isNew ? '<button class="btn" type="submit" name="again" value="1">Enregistrer + une autre</button>' : '<button class="btn danger" type="button" data-act="delTx">Supprimer</button>'}
    </div>
  </form>`, (root) => {
    const f = $('#f', root);
    let catTouched = !!(t || prefill.cat);
    f.cat.addEventListener('change', () => { catTouched = true; f.remember.checked = true; });
    const reguess = () => { if (!catTouched) f.cat.value = guessCategory(f.label.value, f.type.value === 'inc' ? 1 : -1); };
    f.label.addEventListener('input', reguess);
    $$('input[name=type]', f).forEach((r) => r.addEventListener('change', reguess));
    if (isNew && !d.amount) setTimeout(() => f.amount.focus(), 250);
    const del = $('[data-act=delTx]', root);
    if (del) del.onclick = () => {
      const i = S.transactions.findIndex((x) => x.id === t.id);
      const [removed] = S.transactions.splice(i, 1);
      save(); closeSheet(); render();
      toast('Opération supprimée', { label: 'Annuler', run: () => { S.transactions.push(removed); save(); render(); } });
    };
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const again = e.submitter?.name === 'again';
      const abs = Math.abs(parseAmount(f.amount.value));
      if (!abs) { f.amount.focus(); toast('Montant invalide'); return; }
      const amount = f.type.value === 'inc' ? abs : -abs;
      const data = { amount, label: f.label.value.trim(), cat: f.cat.value, date: f.date.value || today(), note: f.note.value.trim() };
      let tx;
      if (t) { tx = Object.assign(S.transactions.find((x) => x.id === t.id), data); }
      else {
        tx = addTx({ ...data, source: d.source || 'manuel', card: d.card });
      }
      if (f.remember.checked) learnRule(tx.label, tx.cat);
      save();
      if (f.repeat?.checked) {
        closeSheet(); render();
        return openRecForm(null, { label: tx.label, amount: tx.amount, cat: tx.cat, start: tx.date, fromTx: tx.id });
      }
      ui.month = monthOf(tx.date);
      render();
      if (again) {
        openTxForm(null, { date: tx.date });
        toast(`✓ ${fmtSigned(tx.amount)} ajouté`);
      } else { closeSheet(); toast('✓ Enregistré'); }
    });
  });
}

function learnRule(label, catId) {
  const key = merchantKey(label);
  if (!key) return;
  const existing = S.rules.find((r) => r.key === key);
  if (existing) existing.cat = catId; else S.rules.push({ key, cat: catId });
  let n = 0;
  for (const x of S.transactions) if (merchantKey(x.label) === key && x.cat !== catId) { x.cat = catId; n++; }
  if (n) setTimeout(() => toast(`${n} autre${n > 1 ? 's' : ''} opération${n > 1 ? 's' : ''} reclassée${n > 1 ? 's' : ''}`), 1200);
}

/* ---------- Formulaire récurrent ---------- */
function openRecForm(r, prefill = {}) {
  const isNew = !r;
  const d = r || { label: '', amount: 0, cat: '', unit: 'month', every: 1, start: today(), end: '', note: '', ...prefill };
  const fv = `${d.unit}:${d.every}`;
  const preset = FREQS.some(([v]) => v === fv) ? fv : 'custom';
  openSheet(`<h3>${isNew ? 'Nouveau récurrent' : 'Modifier le récurrent'}</h3>
  <form id="f" autocomplete="off">
    <div class="seg">
      <label><input type="radio" name="type" value="exp" ${d.amount > 0 ? '' : 'checked'}>Prélèvement</label>
      <label><input type="radio" name="type" value="inc" ${d.amount > 0 ? 'checked' : ''}>Revenu</label>
    </div>
    <label class="field"><span>Montant (€)</span><input class="amount-input" name="amount" type="text" inputmode="decimal" placeholder="0,00" value="${centsToInput(d.amount)}" required></label>
    <label class="field"><span>Libellé</span><input name="label" type="text" value="${esc(d.label)}" placeholder="ex. Loyer, EDF, Netflix, Salaire" required></label>
    <label class="field"><span>Catégorie</span><select name="cat">${catOptions(d.cat || guessCategory(d.label, d.amount || -1))}</select></label>
    <label class="field"><span>Périodicité</span><select name="freq">${FREQS.map(([v, l]) => `<option value="${v}" ${v === preset ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    <div class="two" id="custom" ${preset === 'custom' ? '' : 'hidden'}>
      <label class="field"><span>Tous les</span><input name="every" type="number" min="1" max="999" value="${d.every}"></label>
      <label class="field"><span>Unité</span><select name="unit">${Object.entries(UNIT_LABEL).map(([u, [, many]]) => `<option value="${u}" ${u === d.unit ? 'selected' : ''}>${many}</option>`).join('')}</select></label>
    </div>
    <div class="two">
      <label class="field"><span>${isNew ? 'Premier prélèvement' : 'Date de référence'}</span><input name="start" type="date" value="${d.start}" required></label>
      <label class="field"><span>Fin (facultatif)</span><input name="end" type="date" value="${d.end || ''}"></label>
    </div>
    ${isNew && !prefill.fromTx ? '<label class="check" id="pastWrap" hidden><input type="checkbox" name="past"> <span>Ajouter aussi les prélèvements passés depuis cette date</span></label>' : ''}
    ${!isNew ? `<label class="check"><input type="checkbox" name="paused" ${d.paused ? 'checked' : ''}> <span>En pause (ne plus générer d’opérations)</span></label>` : ''}
    <p class="small muted" id="preview"></p>
    <div class="btns">
      <button class="btn primary" type="submit">Enregistrer</button>
      ${isNew ? '' : '<button class="btn danger" type="button" data-act="delRec">Supprimer</button>'}
    </div>
  </form>`, (root) => {
    const f = $('#f', root);
    const read = () => {
      let unit = 'month', every = 1;
      if (f.freq.value === 'custom') { unit = f.unit.value; every = Math.max(1, parseInt(f.every.value, 10) || 1); }
      else [unit, every] = [f.freq.value.split(':')[0], +f.freq.value.split(':')[1]];
      return { unit, every, start: f.start.value || today(), end: f.end.value || '' };
    };
    const update = () => {
      $('#custom', root).hidden = f.freq.value !== 'custom';
      const tmp = read();
      const next = occurrencesBetween(tmp, addDays(today(), -1), '9999-12-31', 3);
      $('#preview', root).textContent = next.length ? 'Prochaines dates : ' + next.map(shortDate).join(', ') : 'Aucune date à venir.';
      const pw = $('#pastWrap', root);
      if (pw) pw.hidden = !(tmp.start < today());
    };
    f.addEventListener('input', update); f.addEventListener('change', update); update();
    const del = $('[data-act=delRec]', root);
    if (del) del.onclick = () => {
      if (!confirm('Supprimer ce récurrent ? Les opérations déjà créées sont conservées.')) return;
      S.recurring = S.recurring.filter((x) => x.id !== r.id); save(); closeSheet(); render();
    };
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const abs = Math.abs(parseAmount(f.amount.value));
      if (!abs) { toast('Montant invalide'); return; }
      const data = { ...read(), amount: f.type.value === 'inc' ? abs : -abs, label: f.label.value.trim(), cat: f.cat.value };
      if (r) {
        const rec = S.recurring.find((x) => x.id === r.id);
        Object.assign(rec, data, { paused: !!f.paused?.checked });
        if (!rec.generatedUntil || rec.generatedUntil < addDays(rec.start, -1)) rec.generatedUntil = addDays(rec.start, -1);
      } else {
        const rec = { id: uid(), ...data };
        if (prefill.fromTx) {
          rec.generatedUntil = data.start; // l'opération d'origine compte comme 1re occurrence
          const tx = S.transactions.find((x) => x.id === prefill.fromTx);
          if (tx) tx.recurringId = rec.id;
        } else if (data.start < today() && !f.past?.checked) {
          rec.generatedUntil = today();
        }
        S.recurring.push(rec);
      }
      const n = materializeRecurring();
      save(); closeSheet(); render();
      toast(n ? `✓ Enregistré · ${n} opération${n > 1 ? 's' : ''} créée${n > 1 ? 's' : ''}` : '✓ Enregistré');
    });
  });
}

/* ---------- Budgets ---------- */
function openBudgetForm(values = S.budgets, title = 'Mes budgets mensuels', intro = '') {
  const avg = averages();
  const cats = expenseCats();
  openSheet(`<h3>${title}</h3>${intro}
  <form id="f">
    ${cats.map((c) => `<label class="field"><span>${c.emoji} ${esc(c.name)}${avg.spent[c.id] ? ` · moy. ${fmt(avg.spent[c.id])}` : ''}</span>
      <input type="text" inputmode="decimal" name="b_${c.id}" placeholder="—" value="${centsToInput(values[c.id] || 0)}"></label>`).join('')}
    <p class="small muted" id="tot"></p>
    <div class="btns"><button class="btn primary" type="submit">Enregistrer</button><button class="btn" type="button" data-act="closeSheet">Annuler</button></div>
  </form>`, (root) => {
    const f = $('#f', root);
    const total = () => {
      const t = cats.reduce((a, c) => a + (Math.abs(parseAmount(f['b_' + c.id].value)) || 0), 0);
      $('#tot', root).innerHTML = `Total : <strong>${fmt(t)}</strong>/mois${avg.income ? ` · revenus moyens ${fmt(avg.income)} → épargne ${fmtSigned(avg.income - t)}` : ''}`;
    };
    f.addEventListener('input', total); total();
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const b = {};
      for (const c of cats) { const v = Math.abs(parseAmount(f['b_' + c.id].value)); if (v) b[c.id] = v; }
      S.budgets = b; save(); closeSheet(); ui.view = 'budgets'; render(); toast('✓ Budgets enregistrés');
    });
  });
}

function suggestBudgets() {
  const avg = averages();
  const sugg = {};
  for (const [id, v] of Object.entries(avg.spent)) if (id !== 'revenus' && id !== 'epargne' && v > 0) sugg[id] = Math.ceil(v / 500) * 500;
  // Sans historique : partir des charges récurrentes.
  for (const r of S.recurring) if (r.amount < 0 && !r.paused && !sugg[r.cat]) sugg[r.cat] = Math.ceil(-monthlyEquivalent(r) / 500) * 500;
  if (!Object.keys(sugg).length) { toast('Pas encore assez de données : importe ton relevé ou saisis tes dépenses.'); return; }
  const n = avg.months.length;
  const intro = `<p class="small muted">${n ? `Calculé sur la moyenne de tes dépenses des ${n} dernier${n > 1 ? 's' : ''} mois complet${n > 1 ? 's' : ''} (${avg.months.map(monthLabel).join(', ')}), arrondie aux 5 € supérieurs.` : 'Basé sur tes prélèvements récurrents.'} Ajuste les montants puis enregistre. Astuce : baisse un peu les postes « plaisir » pour dégager de l’épargne.</p>`;
  openBudgetForm(sugg, '✨ Budgets suggérés', intro);
}

/* ---------- Catégories ---------- */
function openCatForm(c) {
  openSheet(`<h3>${c ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h3>
  <form id="f"><div class="two" style="grid-template-columns:80px 1fr">
    <label class="field"><span>Emoji</span><input name="emoji" type="text" value="${esc(c?.emoji || '🏷️')}" maxlength="4" style="text-align:center"></label>
    <label class="field"><span>Nom</span><input name="name" type="text" value="${esc(c?.name || '')}" required></label></div>
    <div class="btns"><button class="btn primary" type="submit">Enregistrer</button>
    ${c && !['divers', 'revenus'].includes(c.id) ? '<button class="btn danger" type="button" data-act="delCat">Supprimer</button>' : ''}</div></form>`, (root) => {
    const f = $('#f', root);
    const del = $('[data-act=delCat]', root);
    if (del) del.onclick = () => {
      if (!confirm(`Supprimer « ${c.name} » ? Ses opérations passeront dans Divers.`)) return;
      S.transactions.forEach((t) => { if (t.cat === c.id) t.cat = 'divers'; });
      S.recurring.forEach((t) => { if (t.cat === c.id) t.cat = 'divers'; });
      S.rules = S.rules.filter((r) => r.cat !== c.id);
      delete S.budgets[c.id];
      S.categories = S.categories.filter((x) => x.id !== c.id);
      save(); closeSheet(); render();
    };
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = { name: f.name.value.trim(), emoji: f.emoji.value.trim() || '🏷️' };
      if (c) Object.assign(S.categories.find((x) => x.id === c.id), data);
      else S.categories.splice(S.categories.length - 1, 0, { id: 'c' + uid(), ...data });
      save(); closeSheet(); render();
    });
  });
}

/* ---------- Import ---------- */
function decodeFile(buf) {
  try { return new TextDecoder('utf-8', { fatal: true }).decode(buf).replace(/^﻿/, ''); }
  catch { return new TextDecoder('windows-1252').decode(buf); }
}
async function handleFile(file) {
  const text = decodeFile(await file.arrayBuffer());
  if (/^\s*AP\|/m.test(text)) return importApplePay(text);
  if (/<STMTTRN>/i.test(text)) return confirmImport(parseOFX(text), file.name);
  return openCsvMapper(text, file.name);
}

function detectDelimiter(lines) {
  const sample = lines.slice(0, 40).join('\n');
  const counts = [';', '\t', ',', '|'].map((d) => [d, sample.split(d).length]);
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0][0];
}
function parseCSV(text, delim) {
  const rows = []; let row = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += ch;
    } else if (ch === '"' && field === '') q = true;
    else if (ch === delim) { row.push(field.trim()); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field.trim()); rows.push(row); row = []; field = '';
    } else field += ch;
  }
  if (field || row.length) { row.push(field.trim()); rows.push(row); }
  return rows;
}
const H = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
function guessMapping(rows) {
  let headerIdx = -1;
  for (let i = 0; i < Math.min(rows.length, 30); i++) {
    const cells = rows[i].map(H);
    const score = cells.filter((c) => /^date|libelle|montant|debit|credit|amount|description|label|operation|intitule/.test(c)).length;
    if (score >= 2) { headerIdx = i; break; }
  }
  const header = headerIdx >= 0 ? rows[headerIdx].map(H) : [];
  const find = (re, not) => header.findIndex((h) => re.test(h) && !(not && not.test(h)));
  let map = {
    date: find(/date.*(operation|op)|^date$/),
    label: find(/libelle|description|label|intitule|detail|nature/),
    amount: find(/montant|amount|somme/, /franc/),
    debit: find(/debit/),
    credit: find(/credit/),
  };
  if (map.date < 0) map.date = find(/date/);
  if (map.amount >= 0) { map.debit = -1; map.credit = -1; }
  const data = rows.slice(headerIdx + 1).filter((r) => r.length >= 2 && r.some((c) => c));
  // Sans en-tête : deviner par le contenu.
  if (headerIdx < 0 && data.length) {
    const cols = Math.max(...data.slice(0, 20).map((r) => r.length));
    const isDate = (j) => data.slice(0, 10).filter((r) => parseDate(r[j])).length >= 5;
    const isNum = (j) => data.slice(0, 10).filter((r) => !isNaN(parseAmount(r[j]))).length >= 5;
    for (let j = 0; j < cols; j++) {
      if (map.date < 0 && isDate(j)) map.date = j;
      else if (map.amount < 0 && isNum(j)) map.amount = j;
    }
    let best = -1, bestLen = 0;
    for (let j = 0; j < cols; j++) {
      if (j === map.date || j === map.amount) continue;
      const len = data.slice(0, 10).reduce((a, r) => a + (r[j] || '').length, 0);
      if (len > bestLen) { best = j; bestLen = len; }
    }
    map.label = best;
  }
  return { headerIdx, map, data, headerRow: headerIdx >= 0 ? rows[headerIdx] : null };
}
function rowsFromMapping(data, map, invert) {
  const out = [];
  for (const r of data) {
    const date = parseDate(r[map.date]);
    let amount;
    if (map.amount >= 0) amount = parseAmount(r[map.amount]);
    else {
      const db = parseAmount(r[map.debit]), cr = parseAmount(r[map.credit]);
      amount = (isNaN(cr) ? 0 : Math.abs(cr)) - (isNaN(db) ? 0 : Math.abs(db));
      if (isNaN(db) && isNaN(cr)) amount = NaN;
    }
    if (!date || isNaN(amount) || amount === 0) continue;
    if (invert) amount = -amount;
    const label = (map.label >= 0 ? r[map.label] : '') || '';
    out.push({ date, amount, label: label.replace(/\s+/g, ' ').trim() });
  }
  return out;
}

function openCsvMapper(text, name) {
  const lines = text.split(/\r?\n/);
  const delim = detectDelimiter(lines);
  const rows = parseCSV(text, delim);
  const g = guessMapping(rows);
  const cols = Math.max(0, ...g.data.slice(0, 30).map((r) => r.length));
  const colName = (j) => g.headerRow?.[j] || `Colonne ${j + 1}`;
  const sel = (key, label, optional) => `<label class="field"><span>${label}</span><select name="${key}">
    ${optional ? '<option value="-1">—</option>' : ''}
    ${Array.from({ length: cols }, (_, j) => `<option value="${j}" ${g.map[key] === j ? 'selected' : ''}>${esc(colName(j))} (ex. ${esc((g.data[0]?.[j] || '').slice(0, 18))})</option>`).join('')}</select></label>`;
  openSheet(`<h3>Importer « ${esc(name)} »</h3>
  <p class="small muted">${g.data.length} lignes détectées. Vérifie les colonnes :</p>
  <form id="f">
    <div class="two">${sel('date', 'Date')}${sel('label', 'Libellé', true)}</div>
    ${sel('amount', 'Montant (signé)', true)}
    <div class="two">${sel('debit', 'ou Débit', true)}${sel('credit', 'et Crédit', true)}</div>
    <label class="check"><input type="checkbox" name="invert"> <span>Inverser le signe (si les dépenses apparaissent en positif)</span></label>
    <div class="scroll-x"><table class="preview" id="prev"></table></div>
    <div class="btns"><button class="btn primary" type="submit" id="go">Importer</button><button class="btn" type="button" data-act="closeSheet">Annuler</button></div>
  </form>`, (root) => {
    const f = $('#f', root);
    const current = () => {
      const map = { date: +f.date.value, label: +f.label.value, amount: +f.amount.value, debit: +f.debit.value, credit: +f.credit.value };
      return rowsFromMapping(g.data, map, f.invert.checked);
    };
    const upd = () => {
      const out = current();
      $('#prev', root).innerHTML = '<tr><th>Date</th><th>Libellé</th><th>Montant</th></tr>' +
        out.slice(0, 6).map((r) => `<tr><td>${esc(shortDate(r.date))}</td><td>${esc(r.label.slice(0, 40))}</td><td class="n">${fmtSigned(r.amount)}</td></tr>`).join('');
      $('#go', root).textContent = `Importer ${out.length} opération${out.length > 1 ? 's' : ''}`;
      $('#go', root).disabled = !out.length;
    };
    f.addEventListener('change', upd); upd();
    f.addEventListener('submit', (e) => { e.preventDefault(); finishImport(current()); });
  });
}

function parseOFX(text) {
  const out = [];
  for (const block of text.split(/<STMTTRN>/i).slice(1)) {
    const get = (tag) => (block.match(new RegExp(`<${tag}>([^<\\r\\n]*)`, 'i')) || [])[1]?.trim() || '';
    const date = parseDate(get('DTPOSTED')), amount = parseAmount(get('TRNAMT'));
    const label = [get('NAME'), get('MEMO')].filter(Boolean).join(' ');
    if (date && !isNaN(amount) && amount) out.push({ date, amount, label });
  }
  return out;
}
function confirmImport(rows, name) {
  if (!rows.length) return toast('Aucune opération trouvée dans ce fichier.');
  openSheet(`<h3>Importer « ${esc(name)} »</h3><p>${rows.length} opérations trouvées (${esc(shortDate(rows.reduce((a, r) => (r.date < a ? r.date : a), rows[0].date)))} → ${esc(shortDate(rows.reduce((a, r) => (r.date > a ? r.date : a), rows[0].date)))}).</p>
    <div class="btns"><button class="btn primary" id="go">Importer</button><button class="btn" data-act="closeSheet">Annuler</button></div>`,
  (root) => { $('#go', root).onclick = () => finishImport(rows); });
}

/** Ajoute les lignes bancaires en évitant les doublons et en rapprochant les paiements Apple Pay. */
function finishImport(rows) {
  const fpOf = (r) => `${r.date}|${r.amount}|${normLabel(r.label)}`;
  const existing = {};
  for (const t of S.transactions) if (t.fp) existing[t.fp] = (existing[t.fp] || 0) + 1;
  let added = 0, dup = 0, matched = 0;
  for (const r of rows) {
    const fp = fpOf(r);
    if (existing[fp] > 0) { existing[fp]--; dup++; continue; }
    // Paiement déjà capté par Apple Pay (la banque l'enregistre 0 à 5 jours plus tard).
    const ap = r.amount < 0 && S.transactions.find((t) => t.source === 'applepay' && !t.bankFp && t.amount === r.amount && r.date >= addDays(t.date, -1) && r.date <= addDays(t.date, 5));
    if (ap) { ap.bankFp = fp; ap.fp = fp; ap.bankLabel = r.label; matched++; continue; }
    // Opération déjà créée par un récurrent : même montant, ±3 jours.
    const rec = S.transactions.find((t) => t.source === 'recurrent' && !t.bankFp && t.amount === r.amount && r.date >= addDays(t.date, -3) && r.date <= addDays(t.date, 3));
    if (rec) { rec.bankFp = fp; rec.fp = fp; rec.bankLabel = r.label; matched++; continue; }
    addTx({ ...r, source: 'banque', fp });
    added++;
  }
  save(); closeSheet();
  const last = rows.reduce((a, r) => (r.date > a ? r.date : a), '0000');
  if (added && last !== '0000') ui.month = monthOf(last);
  ui.view = 'home'; render();
  openSheet(`<h3>✓ Import terminé</h3>
    <p><strong>${added}</strong> opération${added > 1 ? 's' : ''} ajoutée${added > 1 ? 's' : ''}${dup ? `<br>${dup} doublon${dup > 1 ? 's' : ''} ignoré${dup > 1 ? 's' : ''}` : ''}${matched ? `<br>${matched} rapprochée${matched > 1 ? 's' : ''} avec Apple Pay / récurrents` : ''}</p>
    <p class="small muted">Les catégories ont été devinées. Corrige-les en touchant une opération : l’app retiendra le commerçant.</p>
    <div class="btns">${Object.keys(S.budgets).length ? '' : '<button class="btn primary" data-act="suggestBudgets">✨ Suggérer mes budgets</button>'}<button class="btn" data-act="closeSheet">OK</button></div>`);
}

/** Lignes écrites par le Raccourci : AP|2026-11-06 12:30|12,50 €|Carrefour|Carte Visa */
function importApplePay(text) {
  let added = 0;
  for (const line of text.split(/\r?\n/)) {
    if (!/^\s*AP\|/.test(line)) continue;
    const id = 'ap' + hash(line.trim());
    if (S.apSeen[id]) continue;
    const [, d, m, merchant = '', card = ''] = line.trim().split('|');
    const amount = parseAmount(m);
    if (isNaN(amount) || !amount) continue;
    addTx({ date: parseDate(d) || today(), amount: -Math.abs(amount), label: merchant.trim(), card: card.trim(), source: 'applepay' });
    S.apSeen[id] = 1; added++;
  }
  save(); render();
  toast(added ? ` ${added} paiement${added > 1 ? 's' : ''} Apple Pay importé${added > 1 ? 's' : ''}` : 'Aucun nouveau paiement Apple Pay');
}

function applePayHelp() {
  const url = location.origin + location.pathname;
  openSheet(`<h3> Apple Pay automatique</h3>
  <p class="small">L’app étant 100 % locale, le Raccourci note chaque paiement dans un fichier iCloud Drive ; tu l’importes ici quand tu veux (les doublons sont ignorés).</p>
  <h4>1. Créer l’automatisation</h4>
  <ol class="steps small">
    <li>App <strong>Raccourcis</strong> → onglet <strong>Automatisation</strong> → <strong>+</strong> → <strong>Transaction</strong>.</li>
    <li>Sélectionne ta carte (ex. La Banque Postale), laisse toutes les catégories, choisis <strong>Exécuter immédiatement</strong>.</li>
    <li>Action <strong>Formater la date</strong> : <em>Date actuelle</em>, format personnalisé <code>yyyy-MM-dd HH:mm</code>.</li>
    <li>Action <strong>Ajouter au fichier texte</strong> (Append to Text File) avec ce texte, en insérant les variables du déclencheur :<br>
      <code>AP|[Date formatée]|[Montant]|[Commerçant]|[Carte]</code><br>
      Fichier : <code>Raccourcis/budget-applepay.txt</code>, option « Créer une nouvelle ligne » activée.</li>
  </ol>
  <h4>2. Importer</h4>
  <p class="small">Réglages → <strong>Importer un fichier</strong> → iCloud Drive → Raccourcis → <code>budget-applepay.txt</code>. Quand le relevé bancaire est importé ensuite, les paiements déjà captés sont rapprochés au lieu d’être dupliqués.</p>
  <details><summary>Variante : saisie immédiate (dans Safari)</summary>
    <p class="small">Si tu utilises l’app dans Safari (pas depuis l’écran d’accueil), la dernière action peut être <strong>Ouvrir les URL</strong> :<br>
    <code>${esc(url)}?ap=1&amp;m=[Montant]&amp;n=[Commerçant]&amp;c=[Carte]</code><br>
    (passe Commerçant par l’action <em>Encoder en URL</em>). L’app s’ouvre avec le paiement pré-rempli, tu valides d’un tap. ⚠️ Sur iPhone, l’app installée sur l’écran d’accueil a un stockage séparé de Safari : choisis l’une ou l’autre.</p>
  </details>
  <div class="btns"><button class="btn primary" data-act="pickFile">📥 Importer le fichier maintenant</button></div>`);
}

/* ---------- Sauvegarde ---------- */
function download(name, content, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
function exportCsv() {
  const rows = [['Date', 'Libellé', 'Montant', 'Catégorie', 'Source', 'Note']];
  for (const t of [...S.transactions].sort((a, b) => a.date.localeCompare(b.date))) {
    rows.push([t.date, t.label, (t.amount / 100).toFixed(2).replace('.', ','), cat(t.cat).name, t.source, t.note || '']);
  }
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\r\n');
  download(`budget-${today()}.csv`, '﻿' + csv, 'text/csv');
}

/* ---------- Actions ---------- */
const ACTIONS = {
  go: (el) => { ui.view = el.dataset.view; if (ui.view !== 'ops') ui.cat = ''; render(); scrollTo(0, 0); },
  month: (el) => { ui.month = shiftMonth(ui.month, +el.dataset.d); render(); },
  newTx: () => openTxForm(null, ui.month !== monthOf(today()) ? { date: endOfMonth(ui.month) < today() ? endOfMonth(ui.month) : today() } : {}),
  editTx: (el) => openTxForm(S.transactions.find((t) => t.id === el.dataset.id)),
  newRec: () => openRecForm(null),
  editRec: (el) => openRecForm(S.recurring.find((r) => r.id === el.dataset.id)),
  filterCat: (el) => { if (!el.dataset.cat) return; ui.cat = el.dataset.cat; ui.q = ''; ui.view = 'ops'; render(); scrollTo(0, 0); },
  editBudgets: () => openBudgetForm(),
  suggestBudgets: () => suggestBudgets(),
  closeSheet: () => closeSheet(),
  pickFile: () => { $('#fileInput').value = ''; $('#fileInput').click(); },
  applePayHelp: () => applePayHelp(),
  newCat: () => openCatForm(null),
  editCat: (el) => openCatForm(S.categories.find((c) => c.id === el.dataset.id)),
  delRule: (el) => { S.rules.splice(+el.dataset.i, 1); save(); render(); },
  exportBackup: () => download(`budget-sauvegarde-${today()}.json`, JSON.stringify(S), 'application/json'),
  importBackup: () => { $('#backupInput').value = ''; $('#backupInput').click(); },
  exportCsv: () => exportCsv(),
  wipe: () => {
    if (!confirm('Effacer TOUTES les données de l’app ? Pense à exporter une sauvegarde avant.')) return;
    S = blankState(); save(); render(); toast('Données effacées');
  },
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el || !ACTIONS[el.dataset.act]) return;
  e.preventDefault();
  if (el.closest('#sheetBody') && !['closeSheet', 'pickFile'].includes(el.dataset.act)) closeSheet();
  ACTIONS[el.dataset.act](el);
});
let qTimer;
document.addEventListener('input', (e) => {
  if (e.target.dataset.input !== 'q') return;
  clearTimeout(qTimer);
  qTimer = setTimeout(() => { ui.q = e.target.value; $('#opsList').innerHTML = VIEWS.opsList(); }, 200);
});
document.addEventListener('change', (e) => { if (e.target.dataset.change === 'cat') { ui.cat = e.target.value; render(); } });
$('#fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0]; if (!file) return;
  closeSheet();
  handleFile(file).catch((err) => { console.error(err); toast('Fichier illisible : ' + err.message); });
});
$('#backupInput').addEventListener('change', async (e) => {
  const file = e.target.files[0]; if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!data || !data.v || !Array.isArray(data.transactions)) throw new Error('format inconnu');
    if (!confirm(`Remplacer les données actuelles par cette sauvegarde (${data.transactions.length} opérations) ?`)) return;
    S = Object.assign(blankState(), data); save(); render(); toast('✓ Sauvegarde restaurée');
  } catch (err) { toast('Sauvegarde invalide : ' + err.message); }
});

/* ---------- Démarrage ---------- */
function handleUrl() {
  const p = new URLSearchParams(location.search);
  if (!p.has('m')) return;
  const amount = parseAmount(p.get('m'));
  history.replaceState(null, '', location.pathname); // un rechargement ne rouvre pas le formulaire
  if (isNaN(amount) || !amount) return;
  openTxForm(null, { amount: -Math.abs(amount), label: p.get('n') || '', card: p.get('c') || '', source: 'applepay' });
}

materializeRecurring();
render();
handleUrl();
document.addEventListener('visibilitychange', () => { if (!document.hidden && materializeRecurring()) render(); });
if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('sw.js').catch(console.error);
}
