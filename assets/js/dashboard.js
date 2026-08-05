/* ============ DASHBOARD PAGE ============ */
(function () {
  'use strict';
  const D = window.DEMO, S = window.SELERA, C = window.CHART;
  const $ = S.$, el = S.el, tf = S.tf;

  const _h = new Date().getHours();
  const _greet = _h < 12 ? tf('Good morning', 'Selamat pagi') : _h < 18 ? tf('Good afternoon', 'Selamat tengah hari') : tf('Good evening', 'Selamat petang');
  S.mountShell({ page: 'dashboard', title: _greet + ', ' + D.USER.name.split(' ')[0] });

  const icons = {
    money: '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    repeat: '<path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"/>',
    avg: '<path d="M3 3v18h18M7 12l3-3 4 4 6-7"/>',
  };

  /* KPI */
  const KPI_LABEL = {
    revenue: ['Total revenue (YTD)', 'Jumlah hasil (YTD)'],
    orders: ['Orders this month', 'Tempahan bulan ini'],
    events: ['Upcoming events', 'Majlis akan datang'],
    pending: ['Outstanding payments', 'Bayaran tertunggak'],
    repeat: ['Repeat customers', 'Pelanggan berulang'],
    aov: ['Avg. booking value', 'Purata nilai tempahan'],
  };
  function renderKPI() {
    const g = $('#kpi-grid');
    D.charts.kpis.forEach((k, i) => {
      const lab = KPI_LABEL[k.key] ? tf(KPI_LABEL[k.key][0], KPI_LABEL[k.key][1]) : k.lab;
      const c = el('div', 'card hover kpi reveal');
      c.style.animationDelay = (i * 0.05) + 's';
      const arrow = k.up
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="m5 12 7-7 7 7M12 5v14"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="m5 12 7 7 7-7M12 19V5"/></svg>';
      c.innerHTML = `
        <div class="top">
          <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${icons[k.ic]}</svg></span>
          <span class="trend ${k.up ? 'up' : 'down'}">${arrow}${k.d}</span>
        </div>
        <div class="body-kpi"><div class="val num" data-count="${k.val}">${k.val}</div><div class="lab">${lab}</div></div>`;
      const sp = el('div', 'spark'); c.appendChild(sp);
      C.sparkline(sp, k.spark, k.col, 180, 30);
      c.addEventListener('click', () => location.href = k.link);
      g.appendChild(c);
    });
  }

  /* sales trend datasets for 30D / 90D / 1Y toggle */
  const gen90 = () => Array.from({ length: 90 }, (_, i) => +(0.7 + i * 0.013 + Math.sin(i / 5) * 0.22).toFixed(2));
  const salesData = {
    '30D': { data: D.charts.sales, unit: 'k', sub: tf('Daily revenue · this month', 'Hasil harian · bulan ini') },
    '90D': { data: gen90(), unit: 'k', sub: tf('Daily revenue · last 90 days', 'Hasil harian · 90 hari lepas') },
    '1Y': { data: [18, 21, 19, 24, 22, 26, 24, 28, 26, 31, 29, 33], unit: 'k', sub: tf('Monthly revenue · last 12 months', 'Hasil bulanan · 12 bulan lepas'), labels: ['Okt', 'Nov', 'Dis', 'Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep'] },
  };
  function drawSales(range) {
    const cfg = salesData[range] || salesData['30D'];
    const host = $('#sales-chart'); host.innerHTML = '';
    C.line(host, cfg.data, { w: 640, h: 210, unit: cfg.unit, labels: cfg.labels });
    const sub = $('#sales-sub'); if (sub) sub.textContent = cfg.sub;
  }

  /* charts */
  function renderCharts() {
    drawSales('30D');
    C.gauge($('#goal-gauge'), 88, { color: D.CLR.purple, sub: tf('TARGET', 'SASARAN') });
    const dt = D.charts.orderStatus.reduce((a, b) => a + b.v, 0);
    C.donut($('#donut-chart'), D.charts.orderStatus, { center: String(dt), centerSub: tf('Total orders', 'Jumlah tempahan') });
    const dl = $('#donut-legend');
    const stName = { 'Selesai': tf('Completed', 'Selesai'), 'Disahkan': tf('Confirmed', 'Disahkan'), 'Sedang sedia': tf('Preparing', 'Sedang sedia'), 'Menunggu': tf('Pending', 'Menunggu') };
    D.charts.orderStatus.forEach(s => dl.appendChild(el('div', 'li', `<span class="sw" style="background:${s.c}"></span>${stName[s.k] || s.k}<b>${s.v} <span style="color:var(--mist);font-weight:500">${Math.round(s.v / dt * 100)}%</span></b>`)));
    C.bars($('#bar-chart'), D.charts.monthly, { h: 210, mode: 'perf', fmt: v => 'RM ' + (v / 1000).toFixed(1) + 'k', axisFmt: v => 'RM ' + Math.round(v / 1000) + 'k', suffix: ' 2026' });
    C.pie($('#pie-chart'), D.charts.byPackage);
    const pl = $('#pie-legend'); const total = 268400;
    const pkgName = k => k === 'Buffet RM10 & bawah' ? tf('Buffet RM10 & below', 'Buffet RM10 & bawah') : k;
    D.charts.byPackage.forEach(s => pl.appendChild(el('div', 'li', `<span class="sw" style="background:${s.c}"></span>${pkgName(s.k)}<b>${s.v}% <span style="color:var(--mist);font-weight:500">RM ${Math.round(total * s.v / 100 / 1000)}k</span></b>`)));
    C.area($('#area-chart'), D.charts.weekly, { h: 210, color: D.CLR.blue, axisFmt: v => Math.round(v) });
  }

  /* calendar (August 2026, events from orders) — Notion-style like the Calendar page */
  function renderCal() {
    const grid = $('#cal-grid'); grid.classList.add('cal-lg');
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(d => grid.appendChild(el('div', 'cal-dow', d)));
    const firstDow = 5, days = 31, today = 3;
    const stColor = { confirmed: D.CLR.blue, preparing: D.CLR.orange, pending: D.CLR.yellow, completed: D.CLR.green, cancelled: D.CLR.red };
    const evMap = {};
    D.orders.filter(o => o.date.startsWith('2026-08')).forEach(o => { const d = +o.date.slice(8, 10); (evMap[d] = evMap[d] || []).push(o); });
    for (let i = 0; i < firstDow; i++) grid.appendChild(el('div', 'cal-cell out', `<span class="d">${27 + i}</span>`));
    for (let d = 1; d <= days; d++) {
      const c = el('div', 'cal-cell' + (d === today ? ' today' : ''), `<span class="d">${d}</span>`);
      const ev = evMap[d];
      if (ev) {
        const wrap = el('div', 'cal-evs');
        ev.slice(0, 2).forEach(e => {
          const chip = el('div', 'ev-chip', `<i></i>${S.esc(e.eventType)}`);
          chip.style.background = stColor[e.status];
          if (e.status === 'pending') { chip.style.color = '#3a2e00'; chip.querySelector('i').style.background = 'rgba(0,0,0,.35)'; }
          wrap.appendChild(chip);
        });
        if (ev.length > 2) wrap.appendChild(el('div', 'ev-more', `+${ev.length - 2} more`));
        c.appendChild(wrap);
        c.style.cursor = 'pointer';
        c.addEventListener('mouseenter', e2 => S.tip.show(e2, ev.map(x => `<b>${x.eventType}</b> · <span class="sub">${S.fmtTime(x.time)} · ${x.guests} pax</span>`).join('<br>')));
        c.addEventListener('mousemove', S.tip.move);
        c.addEventListener('mouseleave', S.tip.hide);
        c.addEventListener('click', () => ev.length === 1 ? S.orderDrawer(ev[0].id) : location.href = 'calendar.html');
      }
      grid.appendChild(c);
    }
    const total = firstDow + days, trail = (7 - total % 7) % 7;
    for (let i = 1; i <= trail; i++) grid.appendChild(el('div', 'cal-cell out', `<span class="d">${i}</span>`));
  }

  /* timeline */
  function renderTimeline() {
    const t = $('#timeline');
    D.schedule.forEach(it => t.appendChild(el('div', 'tl-item ' + it.st, `
      <div class="time">${it.t}<span>${it.ap}</span></div>
      <div class="track"><span class="node"></span><b>${it.b}</b><small>${it.s}</small></div>`)));
  }

  /* recent orders (clickable) */
  function renderOrders() {
    const b = $('#orders-body');
    D.orders.slice(0, 7).forEach(o => {
      const tr = document.createElement('tr'); tr.className = 'clickable';
      tr.innerHTML = `
        <td><div class="cust"><span class="avatar">${o.initials}</span><span><b>${S.esc(o.customer)}</b><small>${S.esc(o.email)}</small></span></div></td>
        <td>${S.esc(o.pkg)}</td>
        <td class="td-r"><span class="pax-chip">${o.guests}</span></td>
        <td class="venue-c">${S.esc(o.venue)}</td>
        <td class="td-r amt num">${D.RM(o.total)}</td>
        <td>${S.statusBadge(o.status)}</td>
        <td>${S.payBadge(o.payStatus)}</td>`;
      tr.addEventListener('click', () => S.orderDrawer(o.id));
      b.appendChild(tr);
    });
  }

  /* invoice list */
  function renderInvoices() {
    const l = $('#inv-list');
    D.invoices.slice(0, 4).forEach(iv => {
      const row = el('div', 'inv-row', `
        <span class="code">${iv.no}<small>${S.esc(iv.customer)}</small></span>
        <span class="amt amt num">${D.RM(iv.total)}</span>
        ${S.invBadge(iv.status)}`);
      row.addEventListener('click', () => S.invoiceModal(iv.no));
      l.appendChild(row);
    });
  }

  /* staff overview */
  function renderStaff() {
    const free = D.staff.filter(s => s.avail === 'free').length;
    const busy = D.staff.filter(s => s.avail === 'busy').length;
    const off = D.staff.filter(s => s.avail === 'off').length;
    $('#staff-stats').innerHTML = `
      <div class="ss"><div class="n">${free}</div><div class="l">${tf('Available', 'Ada')}</div></div>
      <div class="ss"><div class="n">${busy}</div><div class="l">${tf('Assigned', 'Bertugas')}</div></div>
      <div class="ss"><div class="n">${off}</div><div class="l">${tf('On leave', 'Cuti')}</div></div>`;
    const teams = [
      { ic: 'utensils', b: tf('Kitchen team', 'Pasukan dapur'), role: 'Kitchen' },
      { ic: 'users2', b: tf('Service crew', 'Pasukan servis'), role: 'Service' },
      { ic: 'orders', b: tf('Logistics', 'Logistik'), role: 'Logistics' },
    ];
    const tl = $('#team-list');
    teams.forEach(t => {
      const members = D.staff.filter(s => s.team === t.role);
      const av = members.slice(0, 3).map(m => `<span class="avatar">${m.initials}</span>`).join('');
      const more = members.length > 3 ? `<span class="more">+${members.length - 3}</span>` : '';
      tl.appendChild(el('div', 'team-row', `
        <span class="ic">${S.sIcon(t.ic)}</span>
        <div class="meta"><b>${t.b}</b><small>${members.length} ${tf('members', 'ahli')} · ${members.filter(m => m.avail === 'busy').length} ${tf('on duty', 'bertugas')}</small></div>
        <div class="stack">${av}${more}</div>`));
    });
  }

  /* top customers */
  function renderTopCust() {
    const c = $('#top-cust');
    [...D.customers].sort((a, b) => b.spent - a.spent).slice(0, 3).forEach(t => {
      const row = el('div', 'tc-row', `
        <span class="avatar">${t.initials}</span>
        <span class="meta"><b>${S.esc(t.name)}</b><small>${t.orders} ${tf('orders', 'tempahan')} · ${t.city}</small></span>
        <span class="spend num">${D.RMk(t.spent)}</span>`);
      row.addEventListener('click', () => location.href = 'customers.html?id=' + t.id);
      c.appendChild(row);
    });
  }

  /* notifications */
  function renderNotifs() {
    const nIco = { ring: 'bell', check: 'check', cal: 'calendar', fire: 'fire', user: 'customers' };
    const l = $('#notif-list');
    $('#notif-sub').textContent = D.notifs.filter(n => n.unread).length + tf(' unread', ' belum dibaca');
    D.notifs.slice(0, 5).forEach((n, i) => {
      const nd = el('div', 'notif' + (n.unread ? ' unread' : ''), `
        <span class="ic">${S.sIcon(nIco[n.ic] || 'bell')}</span>
        <div class="body"><p>${n.html}</p><div class="tm">${n.tm}</div></div>`);
      nd.addEventListener('click', () => { if (n.orderId) S.orderDrawer(n.orderId); else if (n.link) location.href = n.link; });
      l.appendChild(nd);
    });
  }

  /* quick actions */
  function renderQA() {
    const qa = [
      { primary: true, ic: 'plus', b: tf('New booking', 'Tempahan baharu'), s: tf('Key-in a catering booking manually', 'Key-in tempahan secara manual'), act: () => S.newBooking() },
      { ic: 'invoices', b: tf('Create invoice', 'Cipta invois'), s: tf('Bill a confirmed order', 'Bilkan tempahan disahkan'), href: 'invoices.html' },
      { ic: 'customers', b: tf('Add customer', 'Tambah pelanggan'), s: tf('Register a new client', 'Daftar pelanggan baharu'), href: 'customers.html' },
      { ic: 'reports', b: tf('Generate report', 'Jana laporan'), s: tf('Export monthly performance', 'Eksport prestasi bulanan'), href: 'reports.html' },
      { ic: 'calendar', b: tf('Block calendar', 'Sekat kalendar'), s: tf('Reserve a preparation day', 'Tempah hari persediaan'), href: 'calendar.html' },
    ];
    const g = $('#qa-grid');
    qa.forEach(a => {
      const btn = el('button', 'qa' + (a.primary ? ' qa-primary' : ''), `
        <span class="ic">${S.sIcon(a.ic)}</span>
        <span><b>${a.b}</b><small>${a.s}</small></span>`);
      btn.addEventListener('click', () => a.href ? location.href = a.href : a.act && a.act());
      g.appendChild(btn);
    });
  }

  function fillBars() { document.querySelectorAll('.bc-fill').forEach(f => setTimeout(() => f.style.width = f.dataset.w + '%', 250)); }

  /* enquiry lead detail (came from the customer landing page) */
  function openLead(l) {
    const phone = (l.phone || '').replace(/\D/g, '');
    const waNum = phone.startsWith('0') ? '6' + phone : phone;
    const wa = 'https://wa.me/' + waNum + '?text=' + encodeURIComponent('Hi ' + l.name + ', thank you for your enquiry with Selera Catering! Regarding your ' + l.eventType + ' for ' + l.pax + ' pax — we\'d love to help. May I share a tailored quote?');
    const body = `
      <div class="kv">
        <div><div class="k">Name</div><div class="v strong">${S.esc(l.name)}</div></div>
        <div><div class="k">Phone</div><div class="v">${S.esc(l.phone)}</div></div>
        <div><div class="k">Event type</div><div class="v">${S.esc(l.eventType)}</div></div>
        <div><div class="k">Lokasi majlis</div><div class="v">${S.esc(l.location || '—')}</div></div>
        <div><div class="k">Preferred date</div><div class="v">${l.date ? S.fmtDate(l.date) : '—'}</div></div>
        <div><div class="k">Package</div><div class="v">${S.esc(l.pkg)}</div></div>
        <div><div class="k">Guests</div><div class="v">${l.pax} pax</div></div>
        <div><div class="k">Their estimate</div><div class="v strong">${D.RM(l.estimate)}</div></div>
        <div><div class="k">Received</div><div class="v">${new Date(l.ts).toLocaleString('en-GB')}</div></div>
      </div>
      ${l.message ? `<div class="d-sec" style="margin-top:14px"><div class="st">Message</div><p style="font-size:12.5px;line-height:1.6;color:var(--ink-soft)">${S.esc(l.message)}</p></div>` : ''}`;
    S.openModal({
      title: 'New enquiry · ' + l.id, subtitle: S.esc(l.name) + ' · from website', body, width: '560px',
      foot: `<button class="btn btn-danger" id="lead-del" style="margin-right:auto">Buang</button><a class="btn" href="${wa}" target="_blank" rel="noopener" style="color:#fff;background:#1FA855;border-color:#1FA855">Reply on WhatsApp</a><button class="btn btn-primary" id="lead-convert">Convert to order</button>`,
      onMount(root) {
        root.querySelector('#lead-convert').onclick = () => { S.closeModal(); S.toast('Enquiry converted to a draft order (demo)'); };
        root.querySelector('#lead-del').onclick = () => {
          if (!confirm('Buang enquiry ' + l.id + ' (' + l.name + ')?')) return;
          try { let leads = JSON.parse(localStorage.getItem('selera_leads') || '[]'); leads = leads.filter(x => x.id !== l.id); localStorage.setItem('selera_leads', JSON.stringify(leads)); } catch (e) {}
          S.closeModal(); renderActionCenter(); S.toast('Enquiry ' + l.id + ' dibuang');
        };
      }
    });
  }

  /* action center — items that need action */
  function renderActionCenter() {
    const host = $('#action-center');
    const items = [];
    const tint = { red: 'rgba(220,38,38,.12)', amber: 'rgba(245,158,11,.14)', blue: 'rgba(37,99,235,.1)', green: 'rgba(22,163,74,.12)' };
    const col = { red: D.CLR.red, amber: D.CLR.amber, blue: D.CLR.blue, green: D.CLR.green };

    // new enquiries from the landing page (reach the system via localStorage)
    let leads = [];
    try { leads = JSON.parse(localStorage.getItem('selera_leads') || '[]'); } catch (e) {}
    leads.slice(0, 3).forEach(l => items.push({
      c: 'green', ic: 'customers', b: tf('New enquiry · ', 'Pertanyaan baharu · ') + l.name, s: l.eventType + ' · ' + l.pax + ' pax · ' + tf('est. ', 'anggaran ') + D.RM(l.estimate), run: () => openLead(l)
    }));

    // low / out of stock alerts
    (D.inventory || []).filter(i => i.status !== 'ok').slice(0, 3).forEach(i => items.push({
      c: i.status === 'out' ? 'red' : 'amber', ic: 'box',
      b: (i.status === 'out' ? tf('Out of stock · ', 'Habis stok · ') : tf('Low stock · ', 'Stok rendah · ')) + i.name,
      s: i.qty + ' ' + i.unit + tf(' left · reorder at ', ' tinggal · pesan semula pada ') + i.reorder + ' ' + i.unit, run: () => location.href = 'inventory.html'
    }));

    // domain / hosting renewals expiring soon
    (D.billing ? D.billing.items : []).forEach(it => {
      const d = D.daysUntil(it.expiry);
      if (d < 0) items.push({ c: 'red', ic: 'settings', b: it.type + tf(' has expired', ' telah tamat tempoh'), s: it.name + tf(' · renew now to avoid downtime', ' · perbaharui segera'), run: () => location.href = 'settings.html' });
      else if (d <= 30) items.push({ c: 'amber', ic: 'settings', b: it.type + tf(' renews in ', ' diperbaharui dalam ') + d + tf(' days', ' hari'), s: it.name + ' · ' + it.provider + (it.auto ? tf(' · auto-renew on', ' · auto-perbaharui aktif') : tf(' · auto-renew OFF', ' · auto-perbaharui TUTUP')), run: () => location.href = 'settings.html' });
    });

    D.invoices.filter(i => i.status === 'overdue').forEach(iv => items.push({
      c: 'red', ic: 'invoices', b: tf('Overdue invoice ', 'Invois tertunggak ') + iv.no, s: S.esc(iv.customer) + ' · ' + D.RM(iv.balance) + tf(' outstanding', ' belum dijelaskan'), run: () => S.invoiceModal(iv.no)
    }));
    D.orders.filter(o => o.status === 'pending' && o.payStatus === 'unpaid').forEach(o => items.push({
      c: 'amber', ic: 'orders', b: tf('Awaiting confirmation · ', 'Menunggu pengesahan · ') + o.id, s: S.esc(o.customer) + ' · ' + S.esc(o.eventType), run: () => S.orderDrawer(o.id)
    }));
    // events happening today/tomorrow
    D.orders.filter(o => (o.date === '2026-08-03' || o.date === '2026-08-04') && o.status !== 'cancelled').forEach(o => items.push({
      c: 'blue', ic: 'calendar', b: tf('Upcoming event · ', 'Majlis akan datang · ') + S.esc(o.eventType), s: S.fmtDate(o.date) + ' · ' + o.guests + ' pax · ' + S.esc(o.venue), run: () => S.orderDrawer(o.id)
    }));
    // large outstanding balances
    D.orders.filter(o => o.payStatus === 'partial' && o.balance >= 30000).forEach(o => items.push({
      c: 'amber', ic: 'payments', b: 'Balance due · ' + o.id, s: S.esc(o.customer) + ' · ' + D.RM(o.balance) + ' before event', run: () => S.orderDrawer(o.id)
    }));

    $('#ac-sub').textContent = tf(items.length + ' item' + (items.length !== 1 ? 's' : '') + ' need your action', items.length + ' perkara perlukan tindakan');
    if (!items.length) { S.emptyState(host, tf('All caught up', 'Semua selesai'), tf('No outstanding actions right now. Nice work!', 'Tiada tindakan tertunggak sekarang. Syabas!'), 'check'); return; }
    items.slice(0, 5).forEach(it => {
      const row = el('div', 'attn-row', `
        <span class="attn-ic" style="background:${tint[it.c]}"><svg viewBox="0 0 24 24" fill="none" stroke="${col[it.c]}" stroke-linecap="round" stroke-linejoin="round">${S.I[it.ic]}</svg></span>
        <div class="meta"><b>${it.b}</b><small>${it.s}</small></div>
        <span class="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg></span>`);
      row.addEventListener('click', it.run);
      host.appendChild(row);
    });
  }

  /* smart insights — auto-generated facts */
  function renderInsights() {
    const host = $('#insights');
    const overdue = D.invoices.filter(i => i.status === 'overdue');
    const outstanding = D.orders.reduce((s, o) => s + (o.payStatus !== 'refunded' ? o.balance : 0), 0);
    const topPkg = D.charts.byPackage[0];
    const busiest = [...D.charts.monthly].sort((a, b) => b.v - a.v)[0];
    const rows = [
      { c: D.CLR.green, h: tf(`Revenue is <b>up 18.4%</b> year-to-date, reaching <b>RM 482,350</b>.`, `Hasil <b>naik 18.4%</b> tahun ini, mencapai <b>RM 482,350</b>.`) },
      { c: D.CLR.purple, h: tf(`<b>${topPkg.k}</b> is your top earner at <b>${topPkg.v}%</b> of total revenue.`, `<b>${topPkg.k}</b> penyumbang terbesar pada <b>${topPkg.v}%</b> daripada jumlah hasil.`) },
      { c: D.CLR.blue, h: tf(`<b>${busiest.m}</b> is the strongest month so far at <b>${D.RMk(busiest.v)}</b>.`, `<b>${busiest.m}</b> bulan terkuat setakat ini pada <b>${D.RMk(busiest.v)}</b>.`) },
      { c: D.CLR.amber, h: tf(`<b>${D.RMk(outstanding)}</b> in balances is still outstanding across active orders.`, `<b>${D.RMk(outstanding)}</b> baki masih tertunggak merentas tempahan aktif.`) },
      { c: overdue.length ? D.CLR.red : D.CLR.green, h: overdue.length ? tf(`<b>${overdue.length} invoice</b> is overdue — follow up to keep cash flow healthy.`, `<b>${overdue.length} invois</b> tertunggak — buat susulan untuk kekalkan aliran tunai.`) : tf(`No overdue invoices — cash flow looks healthy.`, `Tiada invois tertunggak — aliran tunai sihat.`) },
      { c: D.CLR.cyan, h: tf(`Repeat-customer rate holds strong at <b>84%</b> this quarter.`, `Kadar pelanggan berulang kekal kukuh pada <b>84%</b> suku ini.`) },
    ];
    rows.forEach(r => host.appendChild(el('div', 'insight', `<span class="dot" style="background:${r.c}"></span><span>${r.h}</span>`)));
  }

  /* sales range toggle */
  function wireSalesToggle() {
    const seg = $('#sales-seg'); if (!seg) return;
    seg.querySelectorAll('button').forEach(b => b.addEventListener('click', function () {
      seg.querySelector('.on').classList.remove('on'); this.classList.add('on');
      drawSales(this.textContent.trim());
    }));
  }

  renderKPI(); renderActionCenter(); renderInsights(); renderCharts(); renderCal(); renderTimeline(); renderOrders();
  renderInvoices(); renderTopCust(); renderNotifs(); renderQA();
  wireSalesToggle(); S.countUp(); fillBars();
})();
