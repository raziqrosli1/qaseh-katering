/* ============ INVOICES PAGE ============ */
(function () {
  'use strict';
  const D = window.DEMO, S = window.SELERA;
  const $ = S.$, tf = S.tf;
  S.mountShell({ page: 'invoices', title: 'Invoices', subtitle: 'Billing overview' });

  const state = { q: '', status: '' };

  (function stats() {
    const paid = D.invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
    const pending = D.invoices.filter(i => i.status === 'pending' || i.status === 'partial').reduce((s, i) => s + i.balance, 0);
    const overdue = D.invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.balance, 0);
    const billed = D.invoices.filter(i => i.status !== 'refunded').reduce((s, i) => s + i.total, 0);
    $('#inv-stats').innerHTML = `
      <div class="st-box"><div class="n num">${D.RMk(billed)}</div><div class="l"><span class="avail" style="color:var(--ink)">${tf('Total billed', 'Jumlah dibilkan')}</span></div></div>
      <div class="st-box"><div class="n num" style="color:var(--green-d)">${D.RMk(paid)}</div><div class="l">${tf('Paid', 'Dibayar')}</div></div>
      <div class="st-box"><div class="n num" style="color:#B45309">${D.RMk(pending)}</div><div class="l">${tf('Outstanding', 'Tertunggak')}</div></div>
      <div class="st-box"><div class="n num" style="color:var(--red)">${D.RMk(overdue)}</div><div class="l">${tf('Overdue', 'Lewat')}</div></div>`;
  })();

  function filtered() {
    return D.invoices.filter(iv => {
      if (state.status && iv.status !== state.status) return false;
      if (state.q) { const q = state.q.toLowerCase(); if (!(iv.no + ' ' + iv.customer + ' ' + iv.pkg).toLowerCase().includes(q)) return false; }
      return true;
    });
  }

  function render() {
    const rows = filtered(), body = $('#inv-body');
    $('#rc').textContent = rows.length + tf(' of ', ' dari ') + D.invoices.length + tf(' invoices', ' invois');
    if (!rows.length) { body.innerHTML = '<tr><td colspan="8" style="padding:0"></td></tr>'; S.emptyState(body.querySelector('td'), tf('No invoices found', 'Tiada invois dijumpai'), tf('Try a different search term or status filter.', 'Cuba carian atau penapis status lain.'), 'invoices'); return; }
    body.innerHTML = '';
    rows.forEach(iv => {
      const tr = document.createElement('tr'); tr.className = 'clickable';
      tr.innerHTML = `
        <td><span class="mono-code">${iv.no}</span><div class="muted" style="font-size:10.5px">${iv.orderId}</div></td>
        <td><div class="cust"><span class="avatar">${iv.initials}</span><span><b>${S.esc(iv.customer)}</b><small>${S.esc(iv.pkg)}</small></span></div></td>
        <td class="venue-c">${iv.issued}</td>
        <td class="venue-c">${S.fmtDate(iv.due, { day: 'numeric', month: 'short', year: 'numeric' })}</td>
        <td class="td-r amt num">${D.RM(iv.total)}</td>
        <td class="td-r num" style="color:${iv.balance > 0 ? 'var(--red)' : 'var(--green-d)'}">${D.RM(iv.balance)}</td>
        <td>${S.invBadge(iv.status)}</td>
        <td class="td-r"><button class="btn btn-sm" data-view="${iv.no}">${tf('View', 'Lihat')}</button></td>`;
      tr.addEventListener('click', e => { if (!e.target.closest('[data-view]')) S.invoiceModal(iv.no); });
      body.appendChild(tr);
    });
    body.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => S.invoiceModal(b.dataset.view)));
  }

  $('#q').addEventListener('input', e => { state.q = e.target.value; render(); });
  $('#f-status').addEventListener('change', e => { state.status = e.target.value; render(); });
  $('#export').addEventListener('click', () => S.toast(tf('Invoices exported to CSV (demo)', 'Invois dieksport ke CSV (demo)')));
  $('#new-inv').addEventListener('click', () => S.toast(tf('New invoice form opened (demo)', 'Borang invois baharu dibuka (demo)')));

  render();
})();
