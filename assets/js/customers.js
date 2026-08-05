/* ============ CUSTOMERS PAGE ============ */
(function () {
  'use strict';
  const D = window.DEMO, S = window.SELERA;
  const $ = S.$, el = S.el, tf = S.tf;

  S.mountShell({ page: 'customers', title: 'Customers', subtitle: 'Client directory' });

  const state = { q: '', sort: 'spent' };

  (function stats() {
    const total = D.customers.length;
    const repeat = D.customers.filter(c => c.orders > 1).length;
    const spent = D.customers.reduce((s, c) => s + c.spent, 0);
    const bookings = D.customers.reduce((s, c) => s + c.orders, 0);
    $('#cust-stats').innerHTML = `
      <div class="st-box"><div class="n num" data-count="${total}">${total}</div><div class="l">${tf('Total customers', 'Jumlah pelanggan')}</div></div>
      <div class="st-box"><div class="n num" data-count="${repeat}">${repeat}</div><div class="l">${tf('Repeat clients', 'Pelanggan berulang')}</div></div>
      <div class="st-box"><div class="n num">${D.RMk(spent)}</div><div class="l">${tf('Lifetime revenue', 'Jumlah hasil')}</div></div>
      <div class="st-box"><div class="n num" data-count="${bookings}">${bookings}</div><div class="l">${tf('Total bookings', 'Jumlah tempahan')}</div></div>`;
    S.countUp($('#cust-stats'));
  })();

  function list() {
    let rows = D.customers.filter(c => {
      if (state.q) { const q = state.q.toLowerCase(); if (!(c.name + ' ' + c.company + ' ' + c.city + ' ' + c.email).toLowerCase().includes(q)) return false; }
      return true;
    });
    rows.sort((a, b) => state.sort === 'name' ? a.name.localeCompare(b.name) : state.sort === 'orders' ? b.orders - a.orders : b.spent - a.spent);
    return rows;
  }

  function render() {
    const rows = list(), body = $('#cust-body');
    $('#rc').textContent = rows.length + tf(' of ', ' dari ') + D.customers.length + tf(' customers', ' pelanggan');
    if (!rows.length) { body.innerHTML = '<tr><td colspan="5" style="padding:0"></td></tr>'; S.emptyState(body.querySelector('td'), tf('No customers found', 'Tiada pelanggan dijumpai'), tf('Adjust your search to see results.', 'Ubah carian untuk lihat hasil.'), 'customers'); return; }
    body.innerHTML = '';
    rows.forEach(c => {
      const tr = document.createElement('tr'); tr.className = 'clickable';
      tr.innerHTML = `
        <td><div class="cust"><span class="avatar">${c.initials}</span><span><b>${S.esc(c.name)}</b><small>${S.esc(c.company !== '—' ? c.company : c.email)}</small></span></div></td>
        <td class="venue-c">${S.esc(c.city)}</td>
        <td class="td-r"><span class="pax-chip">${c.orders}</span></td>
        <td class="td-r amt num">${D.RM(c.spent)}</td>
        <td>${S.esc(c.favourite)}</td>`;
      tr.addEventListener('click', () => profile(c.id));
      body.appendChild(tr);
    });
  }

  function profile(id) {
    const c = D.getCustomer(id); if (!c) return;
    const orders = D.ordersByCustomer(id);
    const pays = D.paymentsByCustomer(id);
    const upcoming = orders.filter(o => o.date >= '2026-08-03' && o.status !== 'cancelled');
    const body = `
      <div class="d-sec">
        <div class="profile-hero">
          <span class="avatar">${c.initials}</span>
          <div><div class="ph-name">${S.esc(c.name)}</div>
            <div class="ph-sub"><span>${S.sIcon('phone')} ${S.esc(c.phone)}</span><span>${S.sIcon('mail')} ${S.esc(c.email)}</span></div>
            <div style="margin-top:8px" class="chips">${c.company !== '—' ? `<span class="chip-t">${S.esc(c.company)}</span>` : ''}<span class="chip-t">${S.esc(c.city)}</span><span class="chip-t">${tf('Since', 'Sejak')} ${c.since}</span></div>
          </div>
        </div>
      </div>

      <div class="stat-strip">
        <div class="st-box"><div class="n num">${c.orders}</div><div class="l">${tf('Total orders', 'Jumlah tempahan')}</div></div>
        <div class="st-box"><div class="n num">${D.RMk(c.spent)}</div><div class="l">${tf('Total spent', 'Jumlah belanja')}</div></div>
        <div class="st-box"><div class="n num">${c.upcoming}</div><div class="l">${tf('Upcoming', 'Akan datang')}</div></div>
        <div class="st-box"><div class="n num">${c.since}</div><div class="l">${tf('Customer since', 'Pelanggan sejak')}</div></div>
      </div>

      <div class="d-sec">
        <div class="st">${S.sIcon('tag')} ${tf('Preferences', 'Keutamaan')}</div>
        <div class="kv">
          <div><div class="k">${tf('Favourite package', 'Pakej kegemaran')}</div><div class="v strong">${S.esc(c.favourite)}</div></div>
          <div><div class="k">${tf('Home city', 'Bandar')}</div><div class="v">${S.esc(c.city)}</div></div>
        </div>
      </div>

      ${upcoming.length ? `<div class="d-sec"><div class="st">${S.sIcon('calendar')} ${tf('Upcoming bookings', 'Tempahan akan datang')}</div>
        ${upcoming.map(o => `<div class="list-line clickable" data-id="${o.id}" style="cursor:pointer"><b>${S.esc(o.eventType)}</b><span class="muted" style="font-size:11px;margin-left:8px">${S.fmtDate(o.date)}</span><span class="lx">${D.RM(o.total)}</span></div>`).join('')}</div>` : ''}

      <div class="d-sec">
        <div class="st">${S.sIcon('orders')} ${tf('Booking history', 'Sejarah tempahan')}</div>
        ${orders.map(o => `<div class="list-line clickable" data-id="${o.id}" style="cursor:pointer">
          <span class="mono-code">${o.id}</span>
          <span class="muted" style="font-size:11px;margin-left:8px">${S.esc(o.eventType)} · ${S.fmtDate(o.date, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span style="margin-left:auto;display:flex;align-items:center;gap:8px">${S.statusBadge(o.status)}<b>${D.RM(o.total)}</b></span></div>`).join('')}
      </div>

      <div class="d-sec">
        <div class="st">${S.sIcon('money')} ${tf('Payment history', 'Sejarah bayaran')}</div>
        ${pays.length ? pays.map(p => `<div class="list-line"><span>${p.kind === 'refund' ? tf('Refund', 'Pemulangan') : (tf('Payment', 'Bayaran') + ' · ' + S.cap(p.kind))}</span><span class="muted" style="font-size:11px;margin-left:8px">${S.fmtDate(p.date)} · ${p.method}</span><span class="lx" style="color:${p.amount < 0 ? 'var(--red)' : 'var(--green-d)'}">${p.amount < 0 ? '-' : ''}${D.RM(Math.abs(p.amount))}</span></div>`).join('') : `<span class="muted" style="font-size:12px">${tf('No payments yet', 'Belum ada bayaran')}</span>`}
      </div>

      <div class="d-sec">
        <div class="st">${S.sIcon('edit')} ${tf('Customer notes', 'Nota pelanggan')}</div>
        <p style="font-size:12.5px;color:var(--ink-soft);line-height:1.6">${S.esc(c.notes)}</p>
      </div>

      <div class="d-sec">
        <div class="st">${S.sIcon('mail')} ${tf('Recent communication', 'Komunikasi terkini')}</div>
        <div class="list-line"><span>${tf('WhatsApp · booking confirmation', 'WhatsApp · pengesahan tempahan')}</span><span class="lx muted" style="font-weight:500">${tf('2 days ago', '2 hari lalu')}</span></div>
        <div class="list-line"><span>${tf('Email · invoice ', 'Emel · invois ')}${orders[0] ? orders[0].invoice : ''}${tf(' sent', ' dihantar')}</span><span class="lx muted" style="font-weight:500">${tf('5 days ago', '5 hari lalu')}</span></div>
        <div class="list-line"><span>${tf('Call · menu tasting arrangement', 'Panggilan · atur sesi rasa menu')}</span><span class="lx muted" style="font-weight:500">${tf('1 week ago', '1 minggu lalu')}</span></div>
      </div>`;

    const foot = `<button class="btn" data-act="call">${S.sIcon('phone')} ${tf('Call', 'Panggil')}</button><button class="btn" data-act="mail">${S.sIcon('mail')} ${tf('Email', 'Emel')}</button><button class="btn btn-primary" data-act="book" style="margin-left:auto">${S.sIcon('plus')} ${tf('New booking', 'Tempahan baharu')}</button>`;
    S.openDrawer({
      title: tf('Customer Profile', 'Profil Pelanggan'), subtitle: S.esc(c.name), body, foot,
      onMount(root) {
        root.querySelectorAll('[data-id]').forEach(n => n.addEventListener('click', () => { S.closeDrawer(); setTimeout(() => S.orderDrawer(n.dataset.id), 260); }));
        root.querySelector('[data-act=call]').onclick = () => S.toast(tf('Calling ', 'Menghubungi ') + c.phone + ' (demo)');
        root.querySelector('[data-act=mail]').onclick = () => S.toast(tf('Compose email to ', 'Karang emel ke ') + c.email + ' (demo)');
        root.querySelector('[data-act=book]').onclick = () => { S.closeDrawer(); setTimeout(() => S.newBooking({ name: c.name, phone: c.phone, email: c.email, location: c.city }), 260); };
      }
    });
  }

  $('#q').addEventListener('input', e => { state.q = e.target.value; render(); });
  $('#f-sort').addEventListener('change', e => { state.sort = e.target.value; render(); });
  $('#add-cust').addEventListener('click', () => S.newBooking());

  render();

  // open from ?id=
  const id = new URLSearchParams(location.search).get('id');
  if (id) setTimeout(() => profile(id), 350);
})();
