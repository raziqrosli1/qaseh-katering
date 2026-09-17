/* ============ PAYMENTS PAGE ============ */
(function () {
  'use strict';
  const D = window.DEMO, S = window.SELERA;
  const $ = S.$, tf = S.tf;
  S.mountShell({ page: 'payments', title: 'Payments', subtitle: 'Transactions & receipts' });

  const methodIcon = {
    'Bank Transfer': '<rect x="1" y="4" width="22" height="16" rx="2.5"/><path d="M1 10h22"/>',
    'FPX': '<path d="M3 3v18h18M8 17V9M13 17V5M18 17v-6"/>',
    'Credit Card': '<rect x="1" y="4" width="22" height="16" rx="2.5"/><path d="M1 10h22M6 15h4"/>',
    'Cash': '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
  };
  const kindLabel = k => ({ deposit: tf('Deposit', 'Deposit'), full: tf('Full payment', 'Bayaran penuh'), balance: tf('Balance', 'Baki'), refund: tf('Refund', 'Pemulangan') }[k] || k);
  const rawIcon = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const state = { q: '', kind: '', method: '' };

  (function stats() {
    const received = D.payments.filter(p => p.amount > 0).reduce((s, p) => s + p.amount, 0);
    const deposits = D.payments.filter(p => p.kind === 'deposit').reduce((s, p) => s + p.amount, 0);
    const refunds = Math.abs(D.payments.filter(p => p.kind === 'refund').reduce((s, p) => s + p.amount, 0));
    const count = D.payments.length;
    $('#pay-stats').innerHTML = `
      <div class="st-box"><div class="n num" style="color:var(--green-d)">${D.RMk(received)}</div><div class="l">${tf('Total received', 'Jumlah diterima')}</div></div>
      <div class="st-box"><div class="n num">${D.RMk(deposits)}</div><div class="l">${tf('Deposits collected', 'Deposit dikutip')}</div></div>
      <div class="st-box"><div class="n num" style="color:var(--red)">${D.RMk(refunds)}</div><div class="l">${tf('Refunds issued', 'Pemulangan dibuat')}</div></div>
      <div class="st-box"><div class="n num" data-count="${count}">${count}</div><div class="l">${tf('Transactions', 'Transaksi')}</div></div>`;
    S.countUp($('#pay-stats'));
  })();

  function filtered() {
    return D.payments.filter(p => {
      if (state.kind && p.kind !== state.kind) return false;
      if (state.method && p.method !== state.method) return false;
      if (state.q) { const q = state.q.toLowerCase(); if (!(p.id + ' ' + p.customer + ' ' + p.invoice + ' ' + p.method).toLowerCase().includes(q)) return false; }
      return true;
    });
  }

  function render() {
    const rows = filtered(), body = $('#pay-body');
    $('#rc').textContent = rows.length + tf(' of ', ' dari ') + D.payments.length + tf(' transactions', ' transaksi');
    if (!rows.length) { body.innerHTML = '<tr><td colspan="8" style="padding:0"></td></tr>'; S.emptyState(body.querySelector('td'), tf('No transactions found', 'Tiada transaksi dijumpai'), tf('Adjust filters to view payment records.', 'Ubah penapis untuk lihat rekod bayaran.'), 'payments'); return; }
    body.innerHTML = '';
    rows.forEach(p => {
      const refund = p.amount < 0;
      const tr = document.createElement('tr'); tr.className = 'clickable';
      tr.innerHTML = `
        <td><span class="mono-code">${p.id}</span></td>
        <td><div class="cust"><span class="avatar">${p.initials}</span><b>${S.esc(p.customer)}</b></div></td>
        <td class="venue-c">${p.invoice}</td>
        <td><div class="flex center gap8"><span class="method-ic">${rawIcon(methodIcon[p.method])}</span>${p.method}</div></td>
        <td><span class="badge-s ${refund ? 'b-refunded' : p.kind === 'deposit' ? 'b-partial' : 'b-paid'}"><i></i>${kindLabel(p.kind)}</span></td>
        <td class="venue-c">${S.fmtDate(p.date)}</td>
        <td class="td-r amt num" style="color:${refund ? 'var(--red)' : 'var(--green-d)'}">${refund ? '-' : '+'} ${D.RM(Math.abs(p.amount))}</td>
        <td class="td-r"><button class="btn btn-sm" data-r="${p.id}">${tf('Receipt', 'Resit')}</button></td>`;
      tr.addEventListener('click', e => { if (!e.target.closest('[data-r]')) receipt(p); });
      body.appendChild(tr);
    });
    body.querySelectorAll('[data-r]').forEach(b => b.addEventListener('click', () => receipt(D.payments.find(x => x.id === b.dataset.r))));
  }

  function receipt(p) {
    const o = D.getOrder(p.orderId);
    const refund = p.amount < 0;
    const body = `
      <div class="doc" id="doc-print">
        <div class="doc-top">
          <div class="doc-brand"><span class="logo">${S.sIcon('logo')}</span><div><b>${D.BRAND.name} Catering</b><small>${D.BRAND.legal}</small></div></div>
          <div class="doc-meta"><div class="big">${refund ? tf('REFUND', 'PEMULANGAN') : tf('RECEIPT', 'RESIT')}</div><small>${p.id}</small><small>${S.fmtDate(p.date, { day: 'numeric', month: 'long', year: 'numeric' })}</small></div>
        </div>
        <div class="doc-parties">
          <div class="p"><div class="st">${tf('Received From', 'Diterima Daripada')}</div><p><b>${S.esc(p.customer)}</b><br>${o ? S.esc(o.email) : ''}<br>${o ? S.esc(o.phone) : ''}</p></div>
          <div class="p" style="text-align:right"><div class="st">${tf('Reference', 'Rujukan')}</div><p>${tf('Invoice', 'Invois')}: ${p.invoice}<br>${tf('Order', 'Tempahan')}: ${p.orderId}<br>${tf('Method', 'Kaedah')}: ${p.method}${o && o.advisor && o.advisor !== '—' ? `<br>${tf('Advisor', 'Ejen')}: ${S.esc(o.advisor)}` : ''}${o && o.fulfilment === 'pickup' ? `<br>${tf('Self-pickup', 'Ambil sendiri')}` : ''}</p></div>
        </div>
        <table>
          <thead><tr><th>${tf('Description', 'Keterangan')}</th><th class="r">${tf('Amount', 'Jumlah')}</th></tr></thead>
          <tbody>
            <tr><td><b>${kindLabel(p.kind)}</b><br><span class="muted" style="font-size:11px">${o ? S.esc(o.eventType) + ' · ' + S.esc(o.pkg) : ''}</span></td><td class="td-r amt">${refund ? '-' : ''}${D.RM(Math.abs(p.amount))}</td></tr>
          </tbody>
        </table>
        <div class="doc-total"><div class="box">
          ${o ? `<div class="r"><span class="muted">${tf('Contract total', 'Jumlah kontrak')}</span><span>${D.RM(o.total)}</span></div>
          <div class="r"><span class="muted">${tf('Paid to date', 'Dibayar setakat ini')}</span><span>${D.RM(o.deposit)}</span></div>
          <div class="r grand"><span>${tf('Balance', 'Baki')}</span><span>${D.RM(o.balance)}</span></div>` : ''}
        </div></div>
        <div class="flex between center" style="margin-top:22px">
          <span class="doc-stamp ${refund ? 'stamp-overdue' : 'stamp-paid'}">${refund ? tf('REFUNDED', 'DIPULANGKAN') : tf('RECEIVED', 'DITERIMA')}</span>
        </div>
        <div class="doc-note">${tf('This is a computer-generated receipt from', 'Ini adalah resit janaan komputer daripada')} ${D.BRAND.name} Catering. ${tf('Thank you for your payment. For enquiries contact', 'Terima kasih atas bayaran anda. Untuk pertanyaan hubungi')} ${D.BRAND.phone}.</div>
      </div>
      <div class="d-sec" style="margin-top:16px">
        <div class="st">${S.sIcon('clock')} ${tf('Payment timeline', 'Perjalanan bayaran')}</div>
        <div class="timeline" style="margin-top:4px">
          <div class="tl-item done"><div class="time">${tf('Init', 'Mula')}</div><div class="track"><span class="node"></span><b>${tf('Payment initiated', 'Bayaran dimulakan')}</b><small>${p.method}</small></div></div>
          <div class="tl-item done"><div class="time">${tf('Auth', 'Sah')}</div><div class="track"><span class="node"></span><b>${tf('Authorised by bank', 'Disahkan oleh bank')}</b><small>${tf('Reference', 'Rujukan')} ${p.id}</small></div></div>
          <div class="tl-item active"><div class="time">${tf('Done', 'Siap')}</div><div class="track"><span class="node"></span><b>${refund ? tf('Refund completed', 'Pemulangan selesai') : tf('Payment cleared', 'Bayaran diterima')}</b><small>${S.fmtDate(p.date)}</small></div></div>
        </div>
      </div>`;
    const foot = `<button class="btn" data-dl>${S.sIcon('download')} ${tf('Download', 'Muat turun')}</button><button class="btn btn-primary" data-print>${S.sIcon('printer')} ${tf('Print receipt', 'Cetak resit')}</button>`;
    S.openModal({
      title: (refund ? tf('Refund ', 'Pemulangan ') : tf('Receipt ', 'Resit ')) + p.id, subtitle: S.esc(p.customer) + ' · ' + D.RM(Math.abs(p.amount)), body, foot, width: '640px',
      onMount(root) { root.querySelector('[data-print]').onclick = () => S.printDoc(); root.querySelector('[data-dl]').onclick = () => S.toast(tf('Receipt ', 'Resit ') + p.id + tf(' downloaded (demo)', ' dimuat turun (demo)')); }
    });
  }

  $('#q').addEventListener('input', e => { state.q = e.target.value; render(); });
  $('#f-kind').addEventListener('change', e => { state.kind = e.target.value; render(); });
  $('#f-method').addEventListener('change', e => { state.method = e.target.value; render(); });
  $('#export').addEventListener('click', () => S.toast(tf('Payments exported to CSV (demo)', 'Bayaran dieksport ke CSV (demo)')));
  $('#record').addEventListener('click', () => S.toast(tf('Record payment form opened (demo)', 'Borang rekod bayaran dibuka (demo)')));

  render();
})();
