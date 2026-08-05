/* ============ ORDERS PAGE ============ */
(function () {
  'use strict';
  const D = window.DEMO, S = window.SELERA;
  const $ = S.$, el = S.el, tf = S.tf;

  S.mountShell({ page: 'orders', title: 'Orders', subtitle: 'Booking management' });

  const PER = 6;
  let page = 1;
  const state = { q: '', status: '', pkg: '', pay: '', date: '' };

  // read ?q= from global search
  const params = new URLSearchParams(location.search);
  if (params.get('q')) state.q = params.get('q');
  if (params.get('id')) setTimeout(() => S.orderDrawer(params.get('id')), 350);

  // populate package filter
  const fpkg = $('#f-pkg');
  [...new Set(D.orders.map(o => o.pkg))].forEach(p => { const o = document.createElement('option'); o.value = p; o.textContent = p; fpkg.appendChild(o); });

  // stat strip
  (function stats() {
    const active = D.orders.filter(o => ['confirmed', 'preparing', 'pending'].includes(o.status)).length;
    const revenue = D.orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
    const outstanding = D.orders.reduce((s, o) => s + (o.payStatus !== 'refunded' ? o.balance : 0), 0);
    const guests = D.orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.guests, 0);
    $('#order-stats').innerHTML = `
      <div class="st-box"><div class="n num" data-count="${active}">${active}</div><div class="l">${tf('Active orders', 'Tempahan aktif')}</div></div>
      <div class="st-box"><div class="n num">${D.RMk(revenue)}</div><div class="l">${tf('Total contract value', 'Nilai kontrak')}</div></div>
      <div class="st-box"><div class="n num">${D.RMk(outstanding)}</div><div class="l">${tf('Outstanding balance', 'Baki tertunggak')}</div></div>
      <div class="st-box"><div class="n num" data-count="${guests.toLocaleString('en-MY')}">${guests.toLocaleString('en-MY')}</div><div class="l">${tf('Guests served', 'Tetamu dilayan')}</div></div>`;
    S.countUp($('#order-stats'));
  })();

  function filtered() {
    return D.orders.filter(o => {
      if (state.status && o.status !== state.status) return false;
      if (state.pkg && o.pkg !== state.pkg) return false;
      if (state.pay && o.payStatus !== state.pay) return false;
      if (state.date && o.date !== state.date) return false;
      if (state.q) {
        const q = state.q.toLowerCase();
        const hay = (o.id + ' ' + o.customer + ' ' + o.venue + ' ' + o.eventType + ' ' + o.pkg + ' ' + o.email).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function render() {
    const rows = filtered();
    const body = $('#orders-body');
    $('#rc').textContent = rows.length + tf(' of ', ' dari ') + D.orders.length + tf(' orders', ' tempahan');
    const pages = Math.max(1, Math.ceil(rows.length / PER));
    if (page > pages) page = pages;
    if (!rows.length) {
      body.innerHTML = `<tr><td colspan="8" style="padding:0"></td></tr>`;
      S.emptyState(body.querySelector('td'), tf('No orders found', 'Tiada tempahan dijumpai'), tf('Try adjusting your search or filters.', 'Cuba ubah carian atau penapis anda.'), 'inbox');
      $('#pager').innerHTML = '';
      return;
    }
    const slice = rows.slice((page - 1) * PER, page * PER);
    body.innerHTML = '';
    slice.forEach(o => {
      const tr = document.createElement('tr'); tr.className = 'clickable';
      tr.innerHTML = `
        <td><span class="mono-code">${o.id}</span><div class="muted" style="font-size:10.5px">${o.invoice}</div></td>
        <td><div class="cust"><span class="avatar">${o.initials}</span><span><b>${S.esc(o.customer)}</b><small>${S.esc(o.phone)}</small></span></div></td>
        <td>${S.esc(o.eventType)}<div class="muted" style="font-size:10.5px">${S.esc(o.pkg)}</div></td>
        <td>${S.fmtDate(o.date)}<div class="muted" style="font-size:10.5px">${S.fmtTime(o.time)}</div></td>
        <td class="td-r"><span class="pax-chip">${o.guests}</span></td>
        <td class="td-r amt num">${D.RM(o.total)}</td>
        <td>${S.statusBadge(o.status)}</td>
        <td>${S.payBadge(o.payStatus)}</td>`;
      tr.addEventListener('click', () => S.orderDrawer(o.id));
      body.appendChild(tr);
    });
    renderPager(rows.length, pages);
  }

  function renderPager(count, pages) {
    const start = (page - 1) * PER + 1, end = Math.min(count, page * PER);
    let btns = `<button ${page === 1 ? 'disabled' : ''} data-p="${page - 1}">‹</button>`;
    for (let i = 1; i <= pages; i++) btns += `<button class="${i === page ? 'on' : ''}" data-p="${i}">${i}</button>`;
    btns += `<button ${page === pages ? 'disabled' : ''} data-p="${page + 1}">›</button>`;
    $('#pager').innerHTML = `<div class="pg-info">${tf('Showing', 'Papar')} ${start}–${end} ${tf('of', 'dari')} ${count}</div><div class="pg-btns">${btns}</div>`;
    $('#pager').querySelectorAll('button[data-p]').forEach(b => b.addEventListener('click', () => { const p = +b.dataset.p; if (p >= 1 && p <= pages) { page = p; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }));
  }

  // wire filters
  $('#q').value = state.q;
  $('#q').addEventListener('input', e => { state.q = e.target.value; page = 1; render(); });
  $('#f-status').addEventListener('change', e => { state.status = e.target.value; page = 1; render(); });
  $('#f-pkg').addEventListener('change', e => { state.pkg = e.target.value; page = 1; render(); });
  $('#f-pay').addEventListener('change', e => { state.pay = e.target.value; page = 1; render(); });
  $('#f-date').addEventListener('change', e => { state.date = e.target.value; page = 1; render(); });
  $('#new-order').addEventListener('click', () => S.newBooking());

  render();
})();
