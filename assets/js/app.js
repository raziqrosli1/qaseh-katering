/* ============================================================
   SELERA · Catering Operations — SHARED SHELL + UI SYSTEM
   Injects sidebar/topbar, provides drawer/modal/toast,
   status badges, the reusable Order drawer + Invoice modal.
   Depends on: window.DEMO (data.js), window.CHART (charts.js)
   ============================================================ */
(function (global) {
  'use strict';
  const D = global.DEMO;
  const $ = (s, r = document) => r.querySelector(s);
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));

  /* ---------- ICONS ---------- */
  const I = {
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    orders: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    customers: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    invoices: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/>',
    payments: '<rect x="1" y="4" width="22" height="16" rx="2.5"/><path d="M1 10h22"/>',
    staff: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M19 8v6M22 11h-6"/>',
    reports: '<path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    logo: '<path d="M3 11h18M5 11a7 7 0 0 1 14 0M12 4v0M8 20h8M10 15v5M14 15v5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    map: '<path d="M9 2 3 5v17l6-3 6 3 6-3V2l-6 3z"/><path d="M9 2v17M15 5v17"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    users2: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>',
    utensils: '<path d="M3 2v7a3 3 0 0 0 6 0V2M6 2v20M16 2c-1.5 0-3 2-3 5s1.5 5 3 5v10"/>',
    box: '<path d="M21 8V21H3V8M1 3h22v5H1zM10 12h4"/>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>',
    printer: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    tag: '<path d="M20.59 13.41 12 22l-9-9V3h10l7.59 7.59a2 2 0 0 1 0 2.82z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    money: '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    star: '<path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M9 6h.01M15 6h.01M9 10h.01M15 10h.01M9 14h.01M15 14h.01"/>',
    fire: '<path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 1-3s-3 2-3 6a6 6 0 0 0 12 0c0-5-6-11-6-11z"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    panel: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>',
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.7 1.9L21.5 18l-1.8.6L19 21l-.7-2.4L16.5 18l1.8-1.1z"/>',
    send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
    home: '<path d="M3 9.5 12 3l9 6.5"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
    chat: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  };
  const sIcon = (name, cls) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ${cls ? 'class="' + cls + '"' : ''}>${I[name] || ''}</svg>`;

  /* ---------- NAV DEF ---------- */
  const NAV = [
    { cap: 'Overview', items: [
      { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', ic: 'dashboard' },
      { id: 'orders', label: 'Orders', href: 'orders.html', ic: 'orders', badge: D.orders.filter(o => ['confirmed', 'preparing', 'pending'].includes(o.status)).length },
      { id: 'calendar', label: 'Calendar', href: 'calendar.html', ic: 'calendar' },
      { id: 'customers', label: 'Customers', href: 'customers.html', ic: 'customers' },
    ]},
    { cap: 'Finance', items: [
      { id: 'invoices', label: 'Invoices', href: 'invoices.html', ic: 'invoices', badge: D.invoices.filter(i => i.status === 'pending' || i.status === 'overdue' || i.status === 'partial').length },
      { id: 'payments', label: 'Payments', href: 'payments.html', ic: 'payments' },
    ]},
    { cap: 'Operations', items: [
      { id: 'inventory', label: 'Inventory', href: 'inventory.html', ic: 'box', badge: D.inventory.filter(i => i.status !== 'ok').length },
      { id: 'reports', label: 'Reports', href: 'reports.html', ic: 'reports' },
      { id: 'settings', label: 'Settings', href: 'settings.html', ic: 'settings' },
    ]},
  ];

  /* ---------- ROLES (access control) ---------- */
  const ROLES = {
    owner:   { label: 'Owner / Admin', sales: true, pages: ['dashboard', 'orders', 'calendar', 'customers', 'invoices', 'payments', 'inventory', 'reports', 'settings'] },
    manager: { label: 'Operations Manager', sales: true, pages: ['dashboard', 'orders', 'calendar', 'customers', 'invoices', 'payments', 'inventory', 'reports'] },
    finance: { label: 'Finance', sales: true, pages: ['dashboard', 'invoices', 'payments', 'reports'] },
    staff:   { label: 'Staff / Crew', sales: false, pages: ['calendar'] },
  };
  const getRole = () => { try { return ROLES[localStorage.getItem('selera_role')] ? localStorage.getItem('selera_role') : 'owner'; } catch (e) { return 'owner'; } };
  const canSeeSales = () => (ROLES[getRole()] || ROLES.owner).sales !== false;

  /* ---------- LANGUAGE (EN / BM toggle) ---------- */
  const getLang = () => { try { return localStorage.getItem('qaseh_lang') === 'bm' ? 'bm' : 'en'; } catch (e) { return 'en'; } };
  const setLang = l => { try { localStorage.setItem('qaseh_lang', l === 'bm' ? 'bm' : 'en'); } catch (e) {} };
  // tf(en, bm) → returns the string for the active language. Pages use S.tf(...) freely.
  const tf = (en, bm) => (getLang() === 'bm' ? bm : en);
  const I18N = {
    caps: { Overview: ['Overview', 'Ringkasan'], Finance: ['Finance', 'Kewangan'], Operations: ['Operations', 'Operasi'] },
    nav: {
      dashboard: ['Dashboard', 'Dashboard'], orders: ['Orders', 'Tempahan'], calendar: ['Calendar', 'Kalendar'],
      customers: ['Customers', 'Pelanggan'], invoices: ['Invoices', 'Invois'], payments: ['Payments', 'Bayaran'],
      staff: ['Staff', 'Staf'], inventory: ['Inventory', 'Inventori'], reports: ['Reports', 'Laporan'], settings: ['Settings', 'Tetapan'],
    },
    pages: {
      orders: [['Orders', 'Manage bookings & quotes'], ['Tempahan', 'Urus tempahan & sebut harga']],
      calendar: [['Calendar', 'Events & preparation schedule'], ['Kalendar', 'Jadual majlis & persediaan']],
      customers: [['Customers', 'Client directory'], ['Pelanggan', 'Direktori pelanggan']],
      invoices: [['Invoices', 'Billing overview'], ['Invois', 'Ringkasan bil']],
      payments: [['Payments', 'Transactions & receipts'], ['Bayaran', 'Transaksi & resit']],
      staff: [['Staff', 'Team & scheduling'], ['Staf', 'Pasukan & jadual tugas']],
      inventory: [['Inventory', 'Stock, categories & recipes'], ['Inventori', 'Stok, kategori & resepi']],
      reports: [['Reports', 'Analytics & insights'], ['Laporan', 'Analitik & laporan perniagaan']],
      settings: [['Settings', 'Business configuration'], ['Tetapan', 'Tetapan perniagaan']],
    },
    ui: {
      search: ['Search orders, customers…', 'Cari tempahan, pelanggan…'],
      today: ['Today', 'Hari ini'], viewAs: ['Demo · view as', 'Demo · lihat sebagai'], language: ['Language', 'Bahasa'],
      website: ['View public website', 'Lihat laman web'], notifs: ['Notifications', 'Notifikasi'],
    },
  };
  const L = () => (getLang() === 'bm' ? 1 : 0);

  /* ---------- TOOLTIP ---------- */
  let tipEl;
  function ensureTip() { if (!tipEl) { tipEl = $('#tooltip') || document.body.appendChild(el('div', 'tt')); tipEl.id = 'tooltip'; } return tipEl; }
  const tip = {
    show(e, html) { ensureTip(); tipEl.innerHTML = html; tipEl.classList.add('show'); tip.move(e); },
    move(e) { ensureTip(); tipEl.style.left = (e.clientX + 14) + 'px'; tipEl.style.top = (e.clientY - 10) + 'px'; },
    hide() { if (tipEl) tipEl.classList.remove('show'); },
  };

  /* ---------- SHELL MOUNT ---------- */
  function mountShell(opts) {
    opts = opts || {};
    const page = opts.page || document.body.dataset.page || 'dashboard';
    // role-based access
    const role = getRole(); const roleDef = ROLES[role] || ROLES.owner;
    if (!roleDef.pages.includes(page)) { location.replace(roleDef.pages[0] + '.html'); return; }
    // restore collapsed preference
    try { if (localStorage.getItem('seleraNav') === 'collapsed') document.body.classList.add('nav-collapsed'); } catch (e) {}
    // sidebar
    const sb = $('#sidebar');
    if (sb) {
      sb.className = 'sidebar';
      let html = `<div class="brand"><span class="logo">${sIcon('logo').replace('stroke-width="1.7"', 'stroke-width="1.8"')}</span><span class="name">${D.BRAND.name}<span>${D.BRAND.tagline}</span></span></div>`;
      NAV.forEach(g => {
        const items = g.items.filter(it => roleDef.pages.includes(it.id));
        if (!items.length) return;
        html += `<nav class="nav-group"><div class="nav-cap">${(I18N.caps[g.cap] || [g.cap, g.cap])[L()]}</div>`;
        items.forEach(it => {
          const lbl = (I18N.nav[it.id] || [it.label, it.label])[L()];
          html += `<a class="nav-item${it.id === page ? ' active' : ''}" href="${it.href}" title="${lbl}">${sIcon(it.ic)}<span class="nav-t">${lbl}</span>${it.badge ? `<span class="badge">${it.badge}</span>` : ''}</a>`;
        });
        html += `</nav>`;
      });
      html += `<div class="side-foot">
        <a class="side-user" href="${roleDef.pages.includes('settings') ? 'settings.html' : 'dashboard.html'}"><span class="avatar">${D.USER.initials}</span><span class="meta"><b>${D.USER.name}</b><small>${roleDef.label}</small></span><span class="dot"></span></a>
        <div class="lang-switch"><span>${I18N.ui.language[L()]}</span><div class="lang-seg"><button type="button" data-lang="en" class="${getLang() === 'en' ? 'on' : ''}">EN</button><button type="button" data-lang="bm" class="${getLang() === 'bm' ? 'on' : ''}">BM</button></div></div>
        <div class="role-switch"><span>${I18N.ui.viewAs[L()]}</span><select id="role-select">${Object.keys(ROLES).map(r => `<option value="${r}" ${r === role ? 'selected' : ''}>${ROLES[r].label}</option>`).join('')}</select></div>
      </div>`;
      sb.innerHTML = html;
      sb.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => { if (b.dataset.lang !== getLang()) { setLang(b.dataset.lang); location.reload(); } }));
      const rs = $('#role-select');
      if (rs) rs.addEventListener('change', e => { try { localStorage.setItem('selera_role', e.target.value); } catch (_) {} location.href = 'dashboard.html'; });
    }
    // topbar
    const tb = $('#topbar');
    if (tb) {
      tb.className = 'topbar';
      const now = new Date();
      const dShort = now.toLocaleDateString(getLang() === 'bm' ? 'ms-MY' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
      const pi = I18N.pages[page];
      let ptitle = opts.title || 'Dashboard', psub = opts.subtitle || '';
      if (pi && page !== 'dashboard') { ptitle = pi[L()][0]; psub = pi[L()][1]; }
      tb.innerHTML = `
        <div class="topbar-lead">
          <button class="icon-btn" id="nav-toggle" aria-label="Toggle sidebar" title="Collapse / expand menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${I.panel}</svg></button>
          <div class="greet"><h1>${esc(ptitle)}</h1>${psub ? `<p>${esc(psub)}</p>` : ''}</div>
        </div>
        <div class="grow"></div>
        <label class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${I.search}</svg>
          <input id="global-search" placeholder="${I18N.ui.search[L()]}"></label>
        <div class="date-chip" title="${I18N.ui.today[L()]}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${I.calendar}</svg>${dShort}</div>
        <a class="icon-btn" id="home-btn" href="index.html" title="${I18N.ui.website[L()]}" aria-label="Home"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${I.home}</svg></a>
        <button class="icon-btn" id="notif-btn" aria-label="Notifications"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${I.bell}</svg><span class="ping"></span></button>
        <span class="avatar" id="avatar-btn" title="${esc(D.USER.name)}">${D.USER.initials}</span>`;
      $('#notif-btn').addEventListener('click', notifDrawer);
      $('#avatar-btn').addEventListener('click', () => location.href = 'settings.html');
      $('#nav-toggle').addEventListener('click', () => {
        if (window.matchMedia('(max-width:980px)').matches) {
          const open = document.body.classList.toggle('sidebar-open');
          $('#scrim').classList.toggle('show', open);
        } else {
          const on = document.body.classList.toggle('nav-collapsed');
          try { localStorage.setItem('seleraNav', on ? 'collapsed' : 'expanded'); } catch (e) {}
        }
      });
      // close mobile sidebar when a nav link is tapped
      $('#sidebar').addEventListener('click', e => { if (e.target.closest('.nav-item')) closeMobileNav(); });
      applyResponsiveNav();
      window.addEventListener('resize', applyResponsiveNav);
      const gs = $('#global-search');
      gs.readOnly = true;
      gs.addEventListener('focus', openPalette);
      gs.addEventListener('click', openPalette);
      document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); } });
    }
    // roots
    if (!$('#scrim')) document.body.appendChild(el('div', 'scrim')).id = 'scrim';
    if (!$('#drawer-root')) { const d = el('div', 'drawer'); d.id = 'drawer-root'; document.body.appendChild(d); }
    if (!$('#modal-root')) { const m = el('div', 'modal-wrap'); m.id = 'modal-root'; document.body.appendChild(m); }
    if (!$('#ai-fab')) {
      const fab = el('button', 'fab-ai'); fab.id = 'ai-fab';
      fab.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none">${I.sparkle}</svg><span>${tf('Ask AI', 'Tanya AI')}</span>`;
      fab.addEventListener('click', openAssistant);
      document.body.appendChild(fab);
    }
    localizeDom();
    ensureTip();
    $('#scrim').addEventListener('click', () => { closeDrawer(); closeModal(); closePalette(); closeMobileNav(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDrawer(); closeModal(); closePalette(); closeMobileNav(); } });
  }

  // Localize any static element tagged with data-en / data-bm (placeholder if data-i18n-ph).
  function localizeDom(root) {
    const bm = getLang() === 'bm';
    (root || document).querySelectorAll('[data-en]').forEach(elm => {
      const v = bm ? (elm.getAttribute('data-bm') != null ? elm.getAttribute('data-bm') : elm.getAttribute('data-en')) : elm.getAttribute('data-en');
      if (v == null) return;
      if (elm.hasAttribute('data-i18n-ph')) elm.setAttribute('placeholder', v);
      else elm.textContent = v;
    });
  }

  function closeMobileNav() {
    document.body.classList.remove('sidebar-open');
    if (!isDrawerOpen() && !isModalOpen()) { const s = $('#scrim'); if (s) s.classList.remove('show'); }
  }
  function applyResponsiveNav() {
    const mobile = window.matchMedia('(max-width:980px)').matches;
    if (mobile) {
      document.body.classList.remove('nav-collapsed');
    } else {
      document.body.classList.remove('sidebar-open');
      if (!isDrawerOpen() && !isModalOpen()) { const s = $('#scrim'); if (s) s.classList.remove('show'); }
      try { if (localStorage.getItem('seleraNav') === 'collapsed') document.body.classList.add('nav-collapsed'); } catch (e) {}
    }
  }

  /* ============================================================
     COMMAND PALETTE (Ctrl+K)
     ============================================================ */
  const pageIcon = { dashboard: 'dashboard', orders: 'orders', calendar: 'calendar', customers: 'customers', invoices: 'invoices', payments: 'payments', staff: 'staff', reports: 'reports', settings: 'settings' };
  function buildIndex() {
    const idx = [];
    NAV.forEach(g => g.items.forEach(it => idx.push({ type: 'Page', label: it.label, sub: 'Go to ' + it.label, icon: pageIcon[it.id] || 'dashboard', run: () => location.href = it.href })));
    D.orders.forEach(o => idx.push({ type: 'Order', label: o.id + ' · ' + o.customer, sub: o.eventType + ' · ' + fmtDate(o.date), icon: 'orders', key: (o.id + ' ' + o.customer + ' ' + o.eventType + ' ' + o.venue + ' ' + o.pkg).toLowerCase(), run: () => { closePalette(); orderDrawer(o.id); } }));
    D.customers.forEach(c => idx.push({ type: 'Customer', label: c.name, sub: c.orders + ' orders · ' + D.RMk(c.spent), icon: 'customers', key: (c.name + ' ' + c.company + ' ' + c.city).toLowerCase(), run: () => location.href = 'customers.html?id=' + c.id }));
    D.invoices.forEach(iv => idx.push({ type: 'Invoice', label: iv.no + ' · ' + iv.customer, sub: D.RM(iv.total) + ' · ' + iv.status, icon: 'invoices', key: (iv.no + ' ' + iv.customer).toLowerCase(), run: () => { closePalette(); invoiceModal(iv.no); } }));
    return idx;
  }
  let _pal;
  function openPalette() {
    if ($('#cmdk-root')) return;
    const idx = buildIndex();
    const root = el('div', 'cmdk-wrap'); root.id = 'cmdk-root';
    root.innerHTML = `
      <div class="cmdk">
        <div class="cmdk-in">${sIcon('search')}<input id="cmdk-input" placeholder="Search orders, customers, invoices, pages…" autocomplete="off"><span class="esc">ESC</span></div>
        <div class="cmdk-list" id="cmdk-list"></div>
        <div class="cmdk-foot"><span><b>↑ ↓</b> navigate</span><span><b>↵</b> open</span><span><b>esc</b> close</span></div>
      </div>`;
    document.body.appendChild(root);
    const input = $('#cmdk-input'), list = $('#cmdk-list');
    let results = [], sel = 0;
    function filter(q) {
      q = q.trim().toLowerCase();
      if (!q) return idx.filter(i => i.type === 'Page').concat(idx.filter(i => i.type === 'Order').slice(0, 4));
      return idx.filter(i => (i.key || i.label.toLowerCase()).includes(q) || i.label.toLowerCase().includes(q)).slice(0, 12);
    }
    function draw() {
      if (!results.length) { list.innerHTML = `<div class="cmdk-empty">No results found</div>`; return; }
      let html = '', lastType = '';
      results.forEach((r, i) => {
        if (r.type !== lastType) { html += `<div class="cmdk-cap">${r.type}s</div>`; lastType = r.type; }
        html += `<div class="cmdk-item ${i === sel ? 'sel' : ''}" data-i="${i}"><span class="ic">${sIcon(r.icon)}</span><span class="meta"><b>${esc(r.label)}</b><small>${esc(r.sub)}</small></span><span class="tag">${r.type}</span></div>`;
      });
      list.innerHTML = html;
      list.querySelectorAll('.cmdk-item').forEach(it => {
        it.addEventListener('click', () => results[+it.dataset.i].run());
        it.addEventListener('mousemove', () => { sel = +it.dataset.i; markSel(); });
      });
    }
    function markSel() { list.querySelectorAll('.cmdk-item').forEach(it => it.classList.toggle('sel', +it.dataset.i === sel)); const s = list.querySelector('.sel'); if (s) s.scrollIntoView({ block: 'nearest' }); }
    function refresh() { results = filter(input.value); sel = 0; draw(); }
    input.addEventListener('input', refresh);
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, results.length - 1); markSel(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); markSel(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (results[sel]) results[sel].run(); }
    });
    refresh();
    $('#scrim').classList.add('show');
    requestAnimationFrame(() => { root.classList.add('show'); input.focus(); });
    _pal = root;
  }
  function closePalette() { const r = $('#cmdk-root'); if (r) { r.classList.remove('show'); setTimeout(() => r.remove(), 200); if (!isDrawerOpen() && !isModalOpen()) $('#scrim') && $('#scrim').classList.remove('show'); } }

  /* ---------- DRAWER ---------- */
  function openDrawer(o) {
    const root = $('#drawer-root');
    root.innerHTML = `
      <div class="drawer-head"><div><div class="dh-t">${o.title}</div>${o.subtitle ? `<div class="dh-s">${o.subtitle}</div>` : ''}</div>
        <button class="x" aria-label="Close">${sIcon('x')}</button></div>
      <div class="drawer-body">${o.body}</div>
      ${o.foot ? `<div class="drawer-foot">${o.foot}</div>` : ''}`;
    root.querySelector('.x').addEventListener('click', closeDrawer);
    if (o.onMount) o.onMount(root);
    requestAnimationFrame(() => { $('#scrim').classList.add('show'); root.classList.add('show'); });
  }
  function closeDrawer() { const r = $('#drawer-root'); if (r) r.classList.remove('show'); if (!isModalOpen()) $('#scrim') && $('#scrim').classList.remove('show'); }

  /* ---------- MODAL ---------- */
  function openModal(o) {
    const root = $('#modal-root');
    root.innerHTML = `<div class="modal" style="${o.width ? 'width:' + o.width : ''}">
      <div class="modal-head"><div><div class="mh-t">${o.title}</div>${o.subtitle ? `<div class="mh-s">${o.subtitle}</div>` : ''}</div>
        <button class="x" aria-label="Close">${sIcon('x')}</button></div>
      <div class="modal-body">${o.body}</div>
      ${o.foot ? `<div class="modal-foot">${o.foot}</div>` : ''}</div>`;
    root.querySelector('.x').addEventListener('click', closeModal);
    if (o.onMount) o.onMount(root);
    requestAnimationFrame(() => { $('#scrim').classList.add('show'); root.classList.add('show'); });
  }
  function closeModal() { const r = $('#modal-root'); if (r) r.classList.remove('show'); if (!isDrawerOpen()) $('#scrim') && $('#scrim').classList.remove('show'); }
  const isModalOpen = () => $('#modal-root') && $('#modal-root').classList.contains('show');
  const isDrawerOpen = () => $('#drawer-root') && $('#drawer-root').classList.contains('show');

  /* ---------- TOAST ---------- */
  let toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = el('div'); toastEl.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%) translateY(20px);background:var(--ink);color:#fff;font-size:12.5px;font-weight:500;padding:11px 18px;border-radius:12px;box-shadow:var(--shadow-lg);z-index:300;opacity:0;transition:all .3s var(--ease);pointer-events:none;display:flex;align-items:center;gap:9px';
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#22C55E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${I.check}</svg>${esc(msg)}`;
    requestAnimationFrame(() => { toastEl.style.opacity = 1; toastEl.style.transform = 'translateX(-50%) translateY(0)'; });
    clearTimeout(toastEl._t); toastEl._t = setTimeout(() => { toastEl.style.opacity = 0; toastEl.style.transform = 'translateX(-50%) translateY(20px)'; }, 2600);
  }

  /* ---------- BADGES ---------- */
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const ST_LABEL = { confirmed: ['Confirmed', 'Disahkan'], preparing: ['Preparing', 'Sedang sedia'], completed: ['Completed', 'Selesai'], pending: ['Pending', 'Menunggu'], cancelled: ['Cancelled', 'Dibatalkan'] };
  const PAY_LABEL = { paid: ['Paid', 'Dibayar'], partial: ['Partial', 'Separa'], unpaid: ['Unpaid', 'Belum bayar'], refunded: ['Refunded', 'Dipulangkan'] };
  const INV_LABEL = { paid: ['Paid', 'Dibayar'], partial: ['Partial', 'Separa'], pending: ['Pending', 'Menunggu'], overdue: ['Overdue', 'Tertunggak'], refunded: ['Refunded', 'Dipulangkan'] };
  function statusBadge(s) { const l = ST_LABEL[s]; return `<span class="badge-s b-${s}"><i></i>${l ? l[L()] : cap(s)}</span>`; }
  function payBadge(p) {
    const map = { paid: 'b-paid', partial: 'b-partial', unpaid: 'b-overdue', refunded: 'b-refunded' };
    const l = PAY_LABEL[p];
    return `<span class="badge-s ${map[p] || 'b-pending'}"><i></i>${l ? l[L()] : cap(p)}</span>`;
  }
  function invBadge(s) {
    const map = { paid: 'b-paid', partial: 'b-partial', pending: 'b-pending', overdue: 'b-overdue', refunded: 'b-refunded' };
    const l = INV_LABEL[s];
    return `<span class="badge-s ${map[s] || 'b-pending'}"><i></i>${l ? l[L()] : cap(s)}</span>`;
  }

  /* ---------- EMPTY STATE ---------- */
  function emptyState(host, title, msg, icon) {
    host.innerHTML = `<div class="empty"><div class="ic">${sIcon(icon || 'inbox')}</div><b>${esc(title)}</b><p>${esc(msg)}</p></div>`;
  }

  /* ---------- COUNT UP ---------- */
  function countUp(scope) {
    (scope || document).querySelectorAll('[data-count]').forEach(node => {
      const raw = node.getAttribute('data-count');
      const m = raw.match(/[\d,\.]+/); if (!m) return;
      const target = parseFloat(m[0].replace(/,/g, ''));
      const prefix = raw.slice(0, m.index), suffix = raw.slice(m.index + m[0].length);
      const dec = m[0].includes('.') ? (m[0].split('.')[1] || '').length : 0;
      let start = null; const dur = 900;
      function step(ts) { if (!start) start = ts; const p = Math.min((ts - start) / dur, 1); const e = 1 - Math.pow(1 - p, 3); const val = target * e;
        node.textContent = prefix + (dec ? val.toFixed(dec) : Math.round(val).toLocaleString('en-MY')) + suffix;
        if (p < 1) requestAnimationFrame(step); else node.textContent = raw; }
      requestAnimationFrame(step);
    });
  }

  /* ---------- DATE FORMAT ---------- */
  function fmtDate(iso, opts) { const d = new Date(iso + 'T00:00:00'); return d.toLocaleDateString('en-GB', opts || { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }); }
  function fmtTime(t) { const [h, m] = t.split(':').map(Number); const ap = h < 12 ? 'AM' : 'PM'; const hh = h % 12 || 12; return `${hh}:${String(m).padStart(2, '0')} ${ap}`; }

  /* ============================================================
     REUSABLE ORDER DRAWER
     ============================================================ */
  function allAssign() { try { return JSON.parse(localStorage.getItem('selera_assign') || '{}'); } catch (e) { return {}; } }
  function getAssign(oid) { const a = allAssign(); if (a[oid]) return a[oid]; return D.staff.filter(s => s.assigned && s.assigned.includes(oid)).map(s => ({ staffId: s.id, duty: s.role })); }
  function setAssign(oid, list) { const a = allAssign(); a[oid] = list; try { localStorage.setItem('selera_assign', JSON.stringify(a)); } catch (e) {} }

  function orderDrawer(id) {
    const o = D.getOrder(id); if (!o) return;
    const showMoney = canSeeSales();
    const canManage = ['owner', 'manager'].includes(getRole());
    const menu = (D.MENUS[o.pkg] || []);
    const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(o.mapQuery || o.venue);
    const depPct = o.total > 0 ? Math.min(100, Math.round(o.deposit / o.total * 100)) : 0;
    const pkg = D.PACKAGES[o.pkg];
    const body = `
      <div class="d-sec">
        <div class="flex between center" style="margin-bottom:14px">
          <div><div class="dh-t" style="font-size:16px">${o.id}</div><div class="dh-s">${esc(o.eventType)} · ${esc(o.pkg)}</div></div>
          ${statusBadge(o.status)}
        </div>
        <div class="chips">
          <span class="chip-t">${pkg ? pkg.tier : ''}</span>
          <span class="chip-t">${o.guests} pax</span>
          <span class="chip-t">${fmtDate(o.date)}</span>
        </div>
      </div>

      ${showMoney ? `<div class="d-sec pay-hero">
        <div class="flex between center" style="margin-bottom:12px">
          <div class="st" style="margin:0">${sIcon('money')} ${tf('Payment summary', 'Ringkasan bayaran')}</div>
          ${payBadge(o.payStatus)}
        </div>
        <div class="stat-strip pay-grid">
          <div class="st-box"><div class="n num">${D.RM(o.total)}</div><div class="l">${tf('Contract total', 'Jumlah kontrak')}</div></div>
          <div class="st-box"><div class="n num" style="color:var(--green-d)">${D.RM(o.deposit)}</div><div class="l">${tf('Deposit paid', 'Deposit dibayar')}</div></div>
          <div class="st-box"><div class="n num" style="color:${o.balance > 0 ? 'var(--red)' : 'var(--green-d)'}">${D.RM(o.balance)}</div><div class="l">${tf('Balance due', 'Baki perlu dijelaskan')}</div></div>
        </div>
        <div class="pay-progress"><span style="width:${depPct}%"></span></div>
        <div class="flex between" style="font-size:11px;color:var(--mist);margin-top:7px">
          <span><b style="color:var(--ink)">${depPct}%</b> ${tf('of total paid', 'daripada jumlah telah dibayar')}</span>
          <span>${tf('Invoice', 'Invois')} ${o.invoice}</span>
        </div>
      </div>` : ''}

      <div class="d-sec">
        <div class="st">${sIcon('users2')} ${tf('Customer', 'Pelanggan')}</div>
        <div class="flex center gap12" style="margin-bottom:12px">
          <span class="avatar" style="width:42px;height:42px;font-size:14px;border:1px solid var(--line)">${o.initials}</span>
          <div><b style="font-size:13.5px">${esc(o.customer)}</b><div class="muted" style="font-size:11.5px">${esc(o.email)}</div></div>
        </div>
        <div class="kv">
          <div><div class="k">${tf('Phone', 'Telefon')}</div><div class="v">${esc(o.phone)}</div></div>
          <div><div class="k">${tf('Email', 'Emel')}</div><div class="v">${esc(o.email)}</div></div>
        </div>
      </div>

      <div class="d-sec">
        <div class="st">${sIcon('calendar')} ${tf('Event date & location', 'Tarikh & lokasi majlis')}</div>
        <div class="kv" style="margin-bottom:12px">
          <div><div class="k">${tf('Event type', 'Jenis majlis')}</div><div class="v strong">${esc(o.eventType)}</div></div>
          <div><div class="k">${tf('Guest count', 'Bilangan tetamu')}</div><div class="v strong">${o.guests} pax</div></div>
          <div><div class="k">${tf('Date', 'Tarikh')}</div><div class="v">${fmtDate(o.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div></div>
          <div><div class="k">${tf('Time', 'Masa')}</div><div class="v">${fmtTime(o.time)} – ${fmtTime(o.endTime)}</div></div>
        </div>
        <div class="kv one" style="margin-bottom:12px">
          <div><div class="k">${tf('Venue', 'Lokasi')}</div><div class="v strong">${esc(o.venue)}</div></div>
          <div><div class="k">${tf('Address', 'Alamat')}</div><div class="v">${esc(o.address)}</div></div>
        </div>
        <div class="map-preview">
          <span class="map-pin">${sIcon('pin')}</span>
          <span class="map-label">${esc(o.venue)}</span>
          <a class="map-open" href="${mapsUrl}" target="_blank" rel="noopener">${sIcon('map')} ${tf('Open Maps', 'Buka Peta')}</a>
        </div>
      </div>

      <div class="d-sec">
        <div class="st">${sIcon('utensils')} ${tf('Package & menu', 'Pakej & menu')}</div>
        <div class="kv" style="margin-bottom:12px">
          <div><div class="k">${tf('Package', 'Pakej')}</div><div class="v strong">${esc(o.pkg)}</div></div>
          <div><div class="k">${pkg && pkg.perPax ? tf('Price / pax', 'Harga / pax') : tf('Set price', 'Harga set')}</div><div class="v">${D.RM(pkg ? pkg.price : 0)}</div></div>
        </div>
        <div class="k" style="margin-bottom:8px">${tf('Menu list', 'Senarai menu')}</div>
        ${menu.map(m => `<div class="list-line">${sIcon('check', '')}<span>${esc(m)}</span></div>`).join('')}
      </div>

      <div class="d-sec">
        <div class="st">${sIcon('box')} ${tf('Setup & services', 'Kelengkapan & perkhidmatan')}</div>
        <div class="kv">
          <div><div class="k">${tf('Decoration', 'Hiasan')}</div><div class="v">${esc(o.services.decoration)}</div></div>
          <div><div class="k">${tf('Canopy / tent', 'Khemah / kanopi')}</div><div class="v">${esc(o.services.canopy)}</div></div>
          <div><div class="k">${tf('Tables', 'Meja')}</div><div class="v">${o.services.tables} ${tf('units', 'unit')}</div></div>
          <div><div class="k">${tf('Chairs', 'Kerusi')}</div><div class="v">${o.services.chairs} ${tf('units', 'unit')}</div></div>
          <div><div class="k">${tf('Waiters', 'Pramusaji')}</div><div class="v">${o.services.waiters} ${tf('crew', 'orang')}</div></div>
          <div><div class="k">${tf('Kitchen team', 'Pasukan dapur')}</div><div class="v">${o.services.kitchen} ${tf('crew', 'orang')}</div></div>
        </div>
        ${o.addOns && o.addOns.length ? `<div class="k" style="margin:14px 0 8px">${tf('Add-ons', 'Tambahan')}</div><div class="chips">${o.addOns.map(a => `<span class="chip-t">${esc(a)}</span>`).join('')}</div>` : ''}
      </div>

      <div class="d-sec">
        <div class="st">${sIcon('staff')} ${tf('Crew & duties', 'Pasukan bertugas')}${canManage ? '' : (tf(' · assigned by admin', ' · ditetapkan oleh admin'))}</div>
        <div id="assign-list"></div>
        ${canManage ? `<div class="flex gap8" style="margin-top:12px">
          <div class="select" style="flex:1"><select id="asg-staff">${D.staff.map(s => `<option value="${s.id}">${esc(s.name)} · ${s.role}</option>`).join('')}</select></div>
          <div class="select"><select id="asg-duty">${['Supervisor', 'Chef', 'Kitchen', 'Waiter', 'Driver'].map(d => `<option>${d}</option>`).join('')}</select></div>
          <button class="btn btn-sm" id="asg-add">${tf('Assign', 'Tugaskan')}</button>
        </div>` : ''}
      </div>

      <div class="d-sec">
        <div class="st">${sIcon('clock')} ${tf('Booking timeline', 'Perjalanan tempahan')}</div>
        <div class="timeline" style="margin-top:4px">
          ${o.timeline.map((t, i) => `<div class="tl-item ${i === o.timeline.length - 1 ? 'active' : 'done'}"><div class="time">${t[1].split(' ')[0]}<span>${t[1].split(' ').slice(1).join(' ')}</span></div><div class="track"><span class="node"></span><b>${esc(t[0])}</b></div></div>`).join('')}
        </div>
      </div>

      <div class="d-sec">
        <div class="st">${sIcon('edit')} ${tf('Notes', 'Nota')}</div>
        <p style="font-size:12.5px;color:var(--ink-soft);line-height:1.6">${esc(o.notes)}</p>
      </div>`;

    const foot = showMoney ? `
      <button class="btn" data-act="edit">${sIcon('edit')} ${tf('Edit', 'Edit')}</button>
      <button class="btn" data-act="print">${sIcon('printer')} ${tf('Print Invoice', 'Cetak Invois')}</button>
      <button class="btn" data-act="dup">${sIcon('copy')} ${tf('Duplicate', 'Salin')}</button>
      <button class="btn btn-danger" data-act="cancel" style="margin-left:auto">${sIcon('trash')} ${tf('Cancel Order', 'Batal Tempahan')}</button>` : '';

    openDrawer({
      title: tf('Order Details', 'Butiran Tempahan'), subtitle: o.id + ' · ' + esc(o.customer), body, foot,
      onMount(root) {
        const q = s => root.querySelector(s);
        // team assignment
        function renderAssign() {
          const list = getAssign(o.id); const host = q('#assign-list');
          if (!list.length) { host.innerHTML = '<div class="muted" style="font-size:12px">' + tf('No crew assigned yet', 'Belum ada pasukan ditugaskan') + (canManage ? tf(' — assign below.', ' — tugaskan di bawah.') : '.') + '</div>'; return; }
          host.innerHTML = list.map((a, i) => {
            const s = D.staff.find(x => x.id === a.staffId) || { name: a.staffId, initials: '?' };
            return `<div class="list-line"><span class="avatar" style="width:28px;height:28px;font-size:10px;border:1px solid var(--line)">${s.initials}</span><b style="font-size:12.5px;margin-left:2px">${esc(s.name)}</b><span class="tag-role role-${a.duty.toLowerCase()}" style="margin-left:8px">${a.duty}</span>${canManage ? `<button class="lx" data-rm="${i}" style="color:var(--faint);background:none;border:none;cursor:pointer;font-size:13px">✕</button>` : ''}</div>`;
          }).join('');
          host.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { const l = getAssign(o.id); l.splice(+b.dataset.rm, 1); setAssign(o.id, l); renderAssign(); });
        }
        renderAssign();
        if (canManage && q('#asg-add')) q('#asg-add').onclick = () => {
          const sid = q('#asg-staff').value, duty = q('#asg-duty').value;
          const l = getAssign(o.id);
          if (l.some(x => x.staffId === sid && x.duty === duty)) { toast(tf('Already assigned', 'Sudah ditugaskan')); return; }
          l.push({ staffId: sid, duty }); setAssign(o.id, l); renderAssign();
          const s = D.staff.find(x => x.id === sid); toast((s ? s.name : 'Staf') + tf(' assigned as ', ' ditugaskan sebagai ') + duty);
        };
        if (q('[data-act=edit]')) q('[data-act=edit]').onclick = () => toast(tf('Edit mode opened for ', 'Mod edit dibuka untuk ') + o.id + ' (demo)');
        if (q('[data-act=print]')) q('[data-act=print]').onclick = () => invoiceModal(o.invoice);
        if (q('[data-act=dup]')) q('[data-act=dup]').onclick = () => toast(tf('Order ', 'Tempahan ') + o.id + tf(' duplicated as draft (demo)', ' disalin sebagai draf (demo)'));
        if (q('[data-act=cancel]')) q('[data-act=cancel]').onclick = () => { if (confirm(tf('Cancel order ', 'Batalkan tempahan ') + o.id + tf('? This is a demo action.', '? Ini tindakan demo.'))) { closeDrawer(); toast(tf('Order ', 'Tempahan ') + o.id + tf(' cancelled (demo)', ' dibatalkan (demo)')); } };
      }
    });
  }

  /* ============================================================
     INVOICE MODAL (shared)
     ============================================================ */
  function invoiceModal(no) {
    const inv = D.getInvoice(no); if (!inv) return;
    const stamp = inv.status === 'paid' ? 'stamp-paid' : (inv.status === 'overdue' ? 'stamp-overdue' : 'stamp-pending');
    const stampLabel = inv.status === 'paid' ? tf('PAID', 'DIBAYAR') : inv.status === 'overdue' ? tf('OVERDUE', 'TERTUNGGAK') : inv.status === 'refunded' ? tf('REFUNDED', 'DIPULANGKAN') : tf('UNPAID', 'BELUM BAYAR');
    const lineTotal = inv.unit * inv.guests;
    const sst = Math.round(inv.total * 0.06);
    const body = `
      <div class="doc" id="doc-print">
        <div class="doc-top">
          <div class="doc-brand"><span class="logo">${sIcon('logo')}</span><div><b>${D.BRAND.name} Catering</b><small>${D.BRAND.legal}</small><small>${D.BRAND.reg}</small></div></div>
          <div class="doc-meta"><div class="big">${tf('INVOICE', 'INVOIS')}</div><small>${inv.no}</small><small>${tf('Issued', 'Dikeluarkan')}: ${inv.issued}</small><small>${tf('Due', 'Tarikh akhir')}: ${fmtDate(inv.due)}</small></div>
        </div>
        <div class="doc-parties">
          <div class="p"><div class="st">${tf('Billed To', 'Bil Kepada')}</div><p><b>${esc(inv.customer)}</b><br>${esc(inv.email)}<br>${esc(inv.phone)}<br>${esc(inv.address)}</p></div>
          <div class="p" style="text-align:right"><div class="st">${tf('From', 'Daripada')}</div><p>${D.BRAND.name} Catering<br>${esc(D.BRAND.address)}<br>${D.BRAND.phone}<br>${D.BRAND.ssm}</p></div>
        </div>
        <table>
          <thead><tr><th>${tf('Description', 'Keterangan')}</th><th class="r">${tf('Qty (pax)', 'Kuantiti (pax)')}</th><th class="r">${tf('Unit', 'Seunit')}</th><th class="r">${tf('Amount', 'Jumlah')}</th></tr></thead>
          <tbody>
            <tr><td><b>${esc(inv.pkg)}</b><br><span class="muted" style="font-size:11px">${tf('Catering package', 'Pakej katering')} · ${esc(inv.venue)}</span></td><td class="td-r">${inv.guests}</td><td class="td-r">${D.RM(inv.unit)}</td><td class="td-r amt">${D.RM(lineTotal)}</td></tr>
            <tr><td>${tf('Service, setup & logistics', 'Servis, pemasangan & logistik')}</td><td class="td-r">1</td><td class="td-r">—</td><td class="td-r amt">${D.RM(Math.max(0, inv.total - lineTotal - sst))}</td></tr>
          </tbody>
        </table>
        <div class="doc-total"><div class="box">
          <div class="r"><span class="muted">${tf('Subtotal', 'Subjumlah')}</span><span>${D.RM(inv.total - sst)}</span></div>
          <div class="r"><span class="muted">SST (6%)</span><span>${D.RM(sst)}</span></div>
          <div class="r"><span class="muted">${tf('Deposit paid', 'Deposit dibayar')}</span><span style="color:var(--green-d)">- ${D.RM(inv.deposit)}</span></div>
          <div class="r grand"><span>${tf('Balance Due', 'Baki Perlu Dibayar')}</span><span>${D.RM(inv.balance)}</span></div>
        </div></div>
        <div class="flex between center" style="margin-top:22px">
          <span class="doc-stamp ${stamp}">${stampLabel}</span>
          <div class="doc-note" style="border:none;padding:0;margin:0;text-align:right">Bank: Maybank 5124 8890 1234<br>Ref: ${inv.no}</div>
        </div>
        <div class="doc-note">${tf('Thank you for choosing', 'Terima kasih kerana memilih')} ${D.BRAND.name} Catering. ${tf('Payment is due by the event date. For enquiries contact', 'Bayaran perlu diselesaikan sebelum tarikh majlis. Untuk pertanyaan hubungi')} ${D.BRAND.phone} ${tf('or', 'atau')} ${D.BRAND.email}.</div>
      </div>`;
    const foot = `<button class="btn" data-act="dl">${sIcon('download')} ${tf('Download PDF', 'Muat turun PDF')}</button><button class="btn btn-primary" data-act="print">${sIcon('printer')} ${tf('Print Invoice', 'Cetak Invois')}</button>`;
    openModal({
      title: tf('Invoice ', 'Invois ') + inv.no, subtitle: esc(inv.customer) + ' · ' + D.RM(inv.total), body, foot, width: '720px',
      onMount(root) {
        root.querySelector('[data-act=print]').onclick = () => window.print();
        root.querySelector('[data-act=dl]').onclick = () => toast(tf('Invoice ', 'Invois ') + inv.no + tf(' downloaded (demo PDF)', ' dimuat turun (PDF demo)'));
      }
    });
  }

  /* ============================================================
     NOTIFICATIONS DRAWER
     ============================================================ */
  function notifDrawer() {
    const nIco = { ring: 'bell', check: 'check', cal: 'calendar', fire: 'fire', user: 'customers' };
    const body = `<div class="notif-list">${D.notifs.map((n, i) => `
      <div class="notif ${n.unread ? 'unread' : ''}" data-i="${i}">
        <span class="ic">${sIcon(nIco[n.ic] || 'bell')}</span>
        <div class="body"><p>${n.html}</p><div class="tm">${n.tm}</div></div>
      </div>`).join('')}</div>`;
    openDrawer({
      title: tf('Notifications', 'Notifikasi'), subtitle: D.notifs.filter(n => n.unread).length + tf(' unread', ' belum dibaca'), body,
      foot: `<button class="btn btn-block" id="mark-read">${tf('Mark all as read', 'Tanda semua telah dibaca')}</button>`,
      onMount(root) {
        root.querySelectorAll('.notif').forEach(nd => nd.onclick = () => { const n = D.notifs[+nd.dataset.i]; closeDrawer(); if (n.orderId) setTimeout(() => orderDrawer(n.orderId), 300); else if (n.link) location.href = n.link; });
        root.querySelector('#mark-read').onclick = () => { root.querySelectorAll('.notif').forEach(x => x.classList.remove('unread')); toast(tf('All notifications marked as read', 'Semua notifikasi ditanda telah dibaca')); };
      }
    });
  }

  /* ============================================================
     AI ASSISTANT (mock copilot — answers from demo data)
     ============================================================ */
  function aiAnswer(q) {
    q = (q || '').toLowerCase();
    if (/reven|sales|jualan|income|duit|untung/.test(q))
      return `Year-to-date revenue is <b>RM 268,400</b>, up <b>14.2%</b> vs last year. The current month is tracking at <b>RM 33,000</b> — your strongest month so far.`;
    if (/overdue|lewat|late|tunggak/.test(q)) {
      const ov = D.invoices.filter(i => i.status === 'overdue');
      return ov.length ? `You have <b>${ov.length} overdue invoice</b>: ${ov.map(i => i.no + ' (' + D.RM(i.balance) + ')').join(', ')}. I'd recommend following up today.` : `Good news — no overdue invoices right now.`;
    }
    if (/outstand|balance|owe|belum bayar|baki|pending pay/.test(q)) {
      const o = D.orders.reduce((s, x) => s + (x.payStatus !== 'refunded' ? x.balance : 0), 0);
      return `Total outstanding balance across active orders is <b>${D.RM(o)}</b>. The largest is the Langkap wedding (ORD-2604).`;
    }
    if (/today|hari ini|schedule|jadual/.test(q))
      return `Today you have <b>${D.schedule.length} scheduled tasks</b>. Next up: <b>set-up khemah & buffet</b> at Dewan Langkap (11:00 AM), then hidangan mempelai at 1:00 PM.`;
    if (/upcoming|next|akan datang|coming/.test(q)) {
      const up = D.orders.filter(o => o.date >= '2026-08-03' && o.status !== 'cancelled').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
      return `Your next events:<br>${up.map(o => '• <b>' + esc(o.eventType) + '</b> — ' + fmtDate(o.date) + ' (' + o.guests + ' pax)').join('<br>')}`;
    }
    if (/customer|client|pelanggan/.test(q)) {
      const t = [...D.customers].sort((a, b) => b.spent - a.spent)[0];
      return `Your top customer is <b>${esc(t.name)}</b> with <b>${D.RM(t.spent)}</b> across ${t.orders} orders. Favourite package: ${esc(t.favourite)}.`;
    }
    if (/package|pakej|popular|best.?sell|laris/.test(q)) {
      const p = D.charts.byPackage[0];
      return `<b>${p.k}</b> is your most-booked package at <b>${p.v}%</b> of bookings. Weddings and kenduri dominate overall.`;
    }
    if (/order|booking|tempahan/.test(q)) {
      const a = D.orders.filter(o => ['confirmed', 'preparing', 'pending'].includes(o.status)).length;
      return `You currently have <b>${a} active orders</b> and 12 total this month. 2 are in preparation and 1 pending confirmation.`;
    }
    if (/staff|team|crew|pekerja|kakitangan/.test(q)) {
      const f = D.staff.filter(s => s.avail === 'free').length;
      return `<b>${f} of ${D.staff.length} staff</b> are available today. Kitchen and service crews are mostly assigned to this weekend's weddings.`;
    }
    if (/hi|hello|hai|help|tolong|apa/.test(q))
      return `Hi ${esc(D.USER.name.split(' ')[0])}! I'm your Selera assistant. Ask me about revenue, orders, invoices, payments, customers, staff, or today's schedule.`;
    return `I can help with revenue, orders, overdue invoices, outstanding balances, upcoming events, top customers, best-selling packages, and staff availability. Try one of the suggestions above.`;
  }

  function openAssistant() {
    if (isDrawerOpen()) closeDrawer();
    const suggestions = ['Revenue this month', 'Any overdue invoices?', "Today's schedule", 'Top customer', 'Best-selling package', 'Outstanding balance'];
    const body = `
      <div class="ai-msgs" id="ai-msgs">
        <div class="ai-b bot">Hi ${esc(D.USER.name.split(' ')[0])} 👋 I'm your <b>Selera Assistant</b>. Ask me anything about your business — or tap a suggestion below.</div>
        <div class="ai-chips" id="ai-chips">${suggestions.map(s => `<button class="ai-chip">${s}</button>`).join('')}</div>
      </div>`;
    const foot = `<div class="ai-foot-in"><label class="field"><input id="ai-in" placeholder="Ask about revenue, orders, invoices…" autocomplete="off"></label><button class="btn btn-primary" id="ai-send">${sIcon('send')}</button></div>`;
    openDrawer({
      title: 'Selera Assistant', subtitle: 'AI copilot · demo', body, foot,
      onMount(root) {
        const msgs = root.querySelector('#ai-msgs'), input = root.querySelector('#ai-in');
        const scroll = () => { const b = root.querySelector('.drawer-body'); b.scrollTop = b.scrollHeight; };
        function ask(q) {
          if (!q.trim()) return;
          msgs.appendChild(el('div', 'ai-b me', esc(q))); scroll();
          const typing = el('div', 'ai-b bot', '<span class="ai-typing"><i></i><i></i><i></i></span>');
          msgs.appendChild(typing); scroll();
          setTimeout(() => { typing.innerHTML = aiAnswer(q); scroll(); }, 650);
        }
        root.querySelectorAll('.ai-chip').forEach(c => c.addEventListener('click', () => ask(c.textContent)));
        root.querySelector('#ai-send').addEventListener('click', () => { ask(input.value); input.value = ''; input.focus(); });
        input.addEventListener('keydown', e => { if (e.key === 'Enter') { ask(input.value); input.value = ''; } });
        setTimeout(() => input.focus(), 300);
      }
    });
  }

  /* ============================================================
     FEEDBACK POPUP
     ============================================================ */
  function openFeedback() {
    let rating = 5;
    const starSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="#D4D4D4" stroke-width="1.6"><path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/></svg>';
    const body = `
      <div style="text-align:center;margin-bottom:8px">
        <div class="fb-stars" id="fb-stars">${[1, 2, 3, 4, 5].map(i => `<button data-r="${i}" aria-label="${i} star">${starSvg}</button>`).join('')}</div>
        <div class="muted" id="fb-rlabel" style="font-size:11.5px;font-weight:500">Excellent</div>
      </div>
      <div class="form-field" style="margin-bottom:12px"><label>Category</label>
        <select id="fb-cat"><option>General feedback</option><option>Bug report</option><option>Feature idea</option><option>Compliment</option></select></div>
      <div class="form-field"><label>Your message</label><textarea id="fb-msg" placeholder="Tell us what's working well or what we can improve…"></textarea></div>`;
    openModal({
      title: 'Share feedback', subtitle: 'Help us improve Selera Ops', body, width: '460px',
      foot: `<button class="btn" id="fb-cancel">Cancel</button><button class="btn btn-primary" id="fb-send">${sIcon('send')} Send feedback</button>`,
      onMount(root) {
        const labels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Excellent' };
        const paint = () => root.querySelectorAll('#fb-stars button svg').forEach((svg, i) => { const on = (i + 1) <= rating; svg.setAttribute('fill', on ? '#F59E0B' : 'none'); svg.setAttribute('stroke', on ? '#F59E0B' : '#D4D4D4'); });
        root.querySelectorAll('#fb-stars button').forEach(b => b.addEventListener('click', () => { rating = +b.dataset.r; root.querySelector('#fb-rlabel').textContent = labels[rating]; paint(); }));
        paint();
        root.querySelector('#fb-cancel').onclick = closeModal;
        root.querySelector('#fb-send').onclick = () => {
          const fb = { rating, cat: root.querySelector('#fb-cat').value, msg: root.querySelector('#fb-msg').value.trim(), ts: Date.now() };
          try { const a = JSON.parse(localStorage.getItem('selera_feedback') || '[]'); a.unshift(fb); localStorage.setItem('selera_feedback', JSON.stringify(a.slice(0, 50))); } catch (e) {}
          closeModal(); toast('Thanks for your feedback!');
        };
      }
    });
  }

  /* ---------- STARS ---------- */
  function stars(n) {
    let h = '<div class="stars">';
    for (let i = 1; i <= 5; i++) h += `<svg viewBox="0 0 24 24" fill="${i <= n ? '#F59E0B' : 'none'}" stroke="${i <= n ? '#F59E0B' : '#D4D4D4'}" stroke-width="1.6">${I.star}</svg>`;
    return h + '</div>';
  }

  /* ---------- NEW BOOKING (admin manual key-in — full estimator) ---------- */
  function newBooking(prefill) {
    prefill = prefill || {};
    const pkgOpts = Object.keys(D.PACKAGES).map(n => { const p = D.PACKAGES[n]; return `<option value="${n}">${n} — ${D.RM(p.price)}${p.perPax ? '/pax' : '/set'}</option>`; }).join('');
    const evOpts = ['Majlis Perkahwinan', 'Majlis Pertunangan', 'Kenduri Kesyukuran', 'Aqiqah & Kesyukuran', 'Majlis Harijadi', 'Majlis Korporat', 'Jamuan / Event', 'Lain-lain'].map(e => `<option${prefill.eventType === e ? ' selected' : ''}>${e}</option>`).join('');
    const methodOpts = ['Bank Transfer', 'DuitNow QR', 'Tunai', 'Kad Kredit', '—'].map(m => `<option>${m}</option>`).join('');
    const extras = [
      ...(D.canopy || []).map(x => ({ group: 'Kanopi & persediaan', name: x.name, price: x.price })),
      ...(D.addons || []).map(x => ({ group: 'Tambahan', name: x.name + (x.unit ? ' / ' + x.unit : ''), price: x.price })),
    ];
    const body = `
      <div class="form-row">
        <div class="form-field"><label>${tf('Customer name', 'Nama pelanggan')}</label><input id="nb-name" value="${esc(prefill.name || '')}" placeholder="${tf('e.g. Aisyah binti Karim', 'cth. Aisyah binti Karim')}"></div>
        <div class="form-field"><label>${tf('Phone / WhatsApp', 'Telefon / WhatsApp')}</label><input id="nb-phone" value="${esc(prefill.phone || '')}" placeholder="cth. 012-345 6789"></div>
      </div>
      <div class="form-row">
        <div class="form-field"><label>${tf('Email (optional)', 'Emel (pilihan)')}</label><input id="nb-email" value="${esc(prefill.email || '')}" placeholder="cth. nama@gmail.com"></div>
        <div class="form-field"><label>${tf('Event type', 'Jenis majlis')}</label><select id="nb-event">${evOpts}</select></div>
      </div>
      <div class="form-row">
        <div class="form-field"><label>${tf('Event date', 'Tarikh majlis')}</label><input id="nb-date" type="date" value="${prefill.date || ''}"></div>
        <div class="form-field"><label>${tf('Time', 'Masa')}</label><input id="nb-time" type="time" value="11:00"></div>
      </div>
      <div class="form-row one"><div class="form-field"><label>${tf('Venue / hall', 'Lokasi / dewan')}</label><input id="nb-venue" value="${esc(prefill.venue || '')}" placeholder="${tf('e.g. Dewan Orang Ramai Langkap', 'cth. Dewan Orang Ramai Langkap')}"></div></div>
      <div class="form-row one"><div class="form-field"><label>${tf('Full address', 'Alamat penuh')}</label><input id="nb-address" value="${esc(prefill.location || '')}" placeholder="cth. Langkap, 36700 Teluk Intan, Perak"></div></div>

      <div class="form-row one"><div class="form-field">
        <label>${tf('Packages (add more than one)', 'Pakej (boleh tambah lebih dari satu)')}</label>
        <div style="display:flex;gap:8px;align-items:center">
          <div class="select" style="flex:1"><select id="nb-pkg">${pkgOpts}</select></div>
          <input id="nb-qty" type="number" min="1" value="200" style="width:88px;text-align:right">
          <button type="button" class="btn" id="nb-add-pkg">+ ${tf('Add', 'Tambah')}</button>
        </div>
        <div class="muted" id="nb-pkg-hint" style="font-size:11px;margin-top:6px"></div>
        <div id="nb-cart" style="margin-top:10px;display:flex;flex-direction:column;gap:8px"></div>
      </div></div>

      <div class="form-row one"><div class="form-field">
        <label>${tf('Add-ons & canopy', 'Tambahan & kanopi')}</label>
        <div id="nb-extras" style="max-height:200px;overflow:auto;border:1px solid var(--line);border-radius:12px"></div>
      </div></div>

      <div class="form-row">
        <div class="form-field"><label>${tf('Deposit received (RM)', 'Deposit diterima (RM)')}</label><input id="nb-deposit" type="number" min="0" value="500"></div>
        <div class="form-field"><label>${tf('Payment method', 'Kaedah bayaran')}</label><select id="nb-method">${methodOpts}</select></div>
      </div>
      <div class="form-row one"><div class="form-field"><label>${tf('Notes (optional)', 'Nota (pilihan)')}</label><textarea id="nb-notes" placeholder="${tf('Menu requests, decoration, special needs…', 'Permintaan menu, hiasan, keperluan khas…')}"></textarea></div></div>

      <div class="pay-box" style="margin-top:4px">
        <div class="pay-row"><span class="muted">${tf('Packages total', 'Jumlah pakej')}</span><span id="nb-base">RM 0</span></div>
        <div class="pay-row"><span class="muted">${tf('Add-ons & canopy', 'Tambahan & kanopi')}</span><span id="nb-add">RM 0</span></div>
        <div class="pay-row"><span class="muted">${tf('Grand total', 'Jumlah keseluruhan')}</span><span id="nb-total" style="font-weight:600">RM 0</span></div>
        <div class="pay-row"><span class="muted">${tf('Deposit', 'Deposit')}</span><span id="nb-dep" style="color:var(--green-d);font-weight:600">RM 0</span></div>
        <div class="pay-row total"><span>${tf('Balance', 'Baki')}</span><span id="nb-bal" style="font-weight:700">RM 0</span></div>
      </div>`;
    openModal({
      title: tf('New booking', 'Tempahan baharu'), subtitle: tf('Admin key-in — multiple packages & add-ons', 'Admin key-in tempahan — pelbagai pakej & tambahan'), body, width: '640px',
      foot: `<button class="btn" id="nb-cancel">${tf('Cancel', 'Batal')}</button><button class="btn btn-primary" id="nb-save">${tf('Save booking', 'Simpan tempahan')}</button>`,
      onMount(root) {
        const q = s => root.querySelector(s);
        const cart = [];
        const chosen = new Set();

        function renderExtras() {
          q('#nb-extras').innerHTML = extras.map((x, i) => `
            <label style="display:flex;align-items:center;gap:10px;padding:8px 11px;font-size:12.5px;cursor:pointer;border-bottom:1px solid var(--line)">
              <input type="checkbox" data-i="${i}" ${chosen.has(i) ? 'checked' : ''} style="width:16px;height:16px;flex:none">
              <span style="flex:1">${esc(x.name)}<span class="muted" style="font-size:10px;display:block">${x.group}</span></span>
              <b style="white-space:nowrap">+ ${D.RM(x.price)}</b>
            </label>`).join('');
          q('#nb-extras').querySelectorAll('input[type=checkbox]').forEach(cb => cb.onchange = () => { const i = +cb.dataset.i; cb.checked ? chosen.add(i) : chosen.delete(i); calc(); });
        }
        function renderCart() {
          if (!cart.length) { q('#nb-cart').innerHTML = `<div class="muted" style="font-size:11.5px">${tf('No package added yet.', 'Belum ada pakej ditambah.')}</div>`; return; }
          q('#nb-cart').innerHTML = cart.map((c, i) => { const p = D.PACKAGES[c.name]; return `
            <div style="display:flex;align-items:center;gap:10px;background:var(--bg-soft);border:1px solid var(--line);border-radius:10px;padding:8px 11px;font-size:12.5px">
              <span style="flex:1"><b>${esc(c.name)}</b><span class="muted" style="font-size:11px"> · ${c.qty} ${p.perPax ? 'pax' : 'set'}</span></span>
              <b>${D.RM(p.price * c.qty)}</b>
              <button type="button" data-rm="${i}" style="background:none;border:none;color:var(--faint);cursor:pointer;font-size:15px;line-height:1">✕</button>
            </div>`; }).join('');
          q('#nb-cart').querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { cart.splice(+b.dataset.rm, 1); renderCart(); calc(); });
        }
        function calc() {
          let base = 0; cart.forEach(c => base += D.PACKAGES[c.name].price * c.qty);
          let add = 0; chosen.forEach(i => add += extras[i].price);
          const total = base + add;
          const dep = Math.max(0, parseInt(q('#nb-deposit').value || '0', 10));
          q('#nb-base').textContent = D.RM(base);
          q('#nb-add').textContent = D.RM(add);
          q('#nb-total').textContent = D.RM(total);
          q('#nb-dep').textContent = D.RM(dep);
          q('#nb-bal').textContent = D.RM(Math.max(0, total - dep));
          return { base, add, total, dep };
        }
        function updHint() { const p = D.PACKAGES[q('#nb-pkg').value]; q('#nb-pkg-hint').textContent = (p && p.perPax) ? tf('Enter guest count (pax), then Add.', 'Masukkan bilangan pax, kemudian tekan Tambah.') : tf('Flat set — enter number of sets, then Add.', 'Set flat — masukkan bilangan set, kemudian Tambah.'); q('#nb-qty').value = (p && p.perPax) ? 200 : 1; }
        q('#nb-pkg').onchange = updHint;
        q('#nb-add-pkg').onclick = () => {
          const name = q('#nb-pkg').value, qty = Math.max(1, parseInt(q('#nb-qty').value || '1', 10));
          const ex = cart.find(c => c.name === name);
          if (ex) ex.qty += qty; else cart.push({ name, qty });
          renderCart(); calc();
        };
        q('#nb-deposit').addEventListener('input', calc);

        updHint(); renderExtras(); renderCart(); calc();
        q('#nb-cancel').onclick = closeModal;
        q('#nb-save').onclick = () => {
          const name = q('#nb-name').value.trim(), phone = q('#nb-phone').value.trim();
          if (!name || !phone) { toast(tf('Please fill name & phone', 'Sila isi nama & telefon')); return; }
          if (!cart.length) { toast(tf('Please add at least one package', 'Sila tambah sekurang-kurangnya satu pakej')); return; }
          const { total, dep } = calc();
          let guests = 0; cart.forEach(c => { if (D.PACKAGES[c.name].perPax) guests += c.qty; });
          if (!guests) guests = cart[0].qty;
          const primary = cart[0].name;
          const extraPkgs = cart.slice(1).map(c => c.name + ' (' + c.qty + ' ' + (D.PACKAGES[c.name].perPax ? 'pax' : 'set') + ')');
          const chosenNames = [...chosen].map(i => extras[i].name);
          const date = q('#nb-date').value || new Date().toISOString().slice(0, 10);
          const initials = (name.split(/\s+/).map(w => w[0]).join('') || 'NA').slice(0, 2).toUpperCase();
          const stamp = Date.now().toString();
          const addr = q('#nb-address').value.trim(), venue = q('#nb-venue').value.trim();
          const order = {
            id: 'ORD-' + stamp.slice(-5), invoice: 'INV-' + new Date().getFullYear() + '-' + stamp.slice(-4),
            customerId: 'WI-' + stamp.slice(-4), customer: name, initials, phone, email: q('#nb-email').value.trim() || '—',
            eventType: q('#nb-event').value, pkg: primary,
            venue: venue || '—', address: addr || '—', mapQuery: addr || venue || 'Langkap Perak',
            date, time: q('#nb-time').value || '11:00', endTime: '16:00', guests,
            services: { decoration: '—', canopy: '—', tables: 0, chairs: 0, waiters: 0, kitchen: 0 },
            addOns: [...extraPkgs, ...chosenNames], total, deposit: dep, method: q('#nb-method').value,
            status: dep > 0 ? 'confirmed' : 'pending',
            payStatus: (dep >= total && total > 0) ? 'paid' : dep > 0 ? 'partial' : 'unpaid',
            notes: q('#nb-notes').value.trim() || tf('Booking recorded manually by admin.', 'Tempahan direkod secara manual oleh admin.'),
            timeline: [[tf('Booking recorded (key-in)', 'Tempahan direkod (key-in)'), fmtDate(date)]],
          };
          D.addBooking(order);
          closeModal();
          toast(tf('Booking ', 'Tempahan ') + order.id + tf(' saved', ' disimpan'));
          setTimeout(() => location.reload(), 750);
        };
      }
    });
  }

  global.SELERA = {
    $, el, esc, I, sIcon, tip, mountShell, openDrawer, closeDrawer, openModal, closeModal, toast,
    statusBadge, payBadge, invBadge, emptyState, countUp, fmtDate, fmtTime, cap,
    orderDrawer, invoiceModal, notifDrawer, stars, openPalette, closePalette, openAssistant, openFeedback,
    newBooking,
    currentRole: getRole, canSeeSales, lang: getLang, tf, localizeDom,
  };

})(window);
