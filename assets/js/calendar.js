/* ============ CALENDAR PAGE ============ */
(function () {
  'use strict';
  const D = window.DEMO, S = window.SELERA;
  const $ = S.$, el = S.el, tf = S.tf;
  const LOC = S.lang() === 'bm' ? 'ms-MY' : 'en-GB';

  S.mountShell({ page: 'calendar', title: 'Calendar', subtitle: 'Events & schedule' });

  const stColor = { confirmed: D.CLR.blue, preparing: D.CLR.orange, pending: D.CLR.yellow, completed: D.CLR.green, cancelled: D.CLR.red };
  const TODAY = new Date(2026, 7, 3);
  // On phones the full month grid is too cramped, so start on the Week view (still switchable).
  const IS_MOBILE = window.matchMedia('(max-width:640px)').matches;
  let view = IS_MOBILE ? 'week' : 'month';
  let cursor = new Date(2026, 7, 1); // month cursor
  const MONTHS = S.lang() === 'bm'
    ? ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DOW = S.lang() === 'bm' ? ['Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab', 'Ahd'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const ordersOn = iso => D.orders.filter(o => o.date === iso);
  const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  /* ---- MONTH ---- */
  function renderMonth() {
    const y = cursor.getFullYear(), m = cursor.getMonth();
    $('#cal-title').innerHTML = `${MONTHS[m]} <span class="yr">${y}</span>`;
    const host = el('div', 'cal-grid cal-lg');
    DOW.forEach(d => host.appendChild(el('div', 'cal-dow', d)));
    const first = new Date(y, m, 1); let dow = (first.getDay() + 6) % 7; // Mon=0
    const days = new Date(y, m + 1, 0).getDate();
    const prevDays = new Date(y, m, 0).getDate();
    for (let i = 0; i < dow; i++) host.appendChild(el('div', 'cal-cell out', `<span class="d">${prevDays - dow + 1 + i}</span>`));
    for (let d = 1; d <= days; d++) {
      const isToday = (y === TODAY.getFullYear() && m === TODAY.getMonth() && d === TODAY.getDate());
      const c = el('div', 'cal-cell' + (isToday ? ' today' : ''), `<span class="d">${d}</span>`);
      const ev = ordersOn(iso(y, m, d));
      if (ev.length) {
        const wrap = el('div', 'cal-evs');
        ev.slice(0, 2).forEach(e => {
          const chip = el('div', 'ev-chip', `<i></i>${S.esc(e.eventType)}`);
          chip.style.background = stColor[e.status];
          if (e.status === 'pending') { chip.style.color = '#3a2e00'; chip.querySelector('i').style.background = 'rgba(0,0,0,.35)'; }
          wrap.appendChild(chip);
        });
        if (ev.length > 2) wrap.appendChild(el('div', 'ev-more', `+${ev.length - 2} ${tf('more', 'lagi')}`));
        c.appendChild(wrap);
        c.style.cursor = 'pointer';
        c.addEventListener('mouseenter', e2 => S.tip.show(e2, ev.map(x => `<b>${x.eventType}</b> · <span class="sub">${S.fmtTime(x.time)} · ${x.guests} pax</span>`).join('<br>')));
        c.addEventListener('mousemove', S.tip.move);
        c.addEventListener('mouseleave', S.tip.hide);
        c.addEventListener('click', () => ev.length === 1 ? S.orderDrawer(ev[0].id) : dayModal(iso(y, m, d), ev));
      }
      host.appendChild(c);
    }
    const total = dow + days, trail = (7 - total % 7) % 7;
    for (let i = 1; i <= trail; i++) host.appendChild(el('div', 'cal-cell out', `<span class="d">${i}</span>`));
    swap(host);
  }

  /* ---- WEEK ---- */
  function renderWeek() {
    const y = cursor.getFullYear(), m = cursor.getMonth();
    // week containing the 1st shown; use cursor as week start reference around TODAY for August
    const base = new Date(y, m, cursor._weekDay || 3);
    let ws = new Date(base); ws.setDate(base.getDate() - ((base.getDay() + 6) % 7));
    $('#cal-title').innerHTML = `${tf('Week of', 'Minggu')} ${ws.getDate()} ${MONTHS[ws.getMonth()].slice(0, 3)} <span class="yr">${ws.getFullYear()}</span>`;
    const wrap = el('div', '', '');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:8px';
    for (let i = 0; i < 7; i++) {
      const dt = new Date(ws); dt.setDate(ws.getDate() + i);
      const key = iso(dt.getFullYear(), dt.getMonth(), dt.getDate());
      const ev = ordersOn(key);
      const isToday = dt.toDateString() === TODAY.toDateString();
      const row = el('div', 'card', '');
      row.style.cssText = 'display:grid;grid-template-columns:88px 1fr;gap:14px;padding:14px 16px;align-items:center' + (isToday ? ';border-color:var(--ink)' : '');
      const dayName = DOW[i];
      row.innerHTML = `<div><b style="font-size:14px">${dayName} ${dt.getDate()}</b><div class="muted" style="font-size:10.5px">${MONTHS[dt.getMonth()].slice(0, 3)}${isToday ? ' · ' + tf('Today', 'Hari ini') : ''}</div></div>`;
      const list = el('div', '', '');
      list.style.cssText = 'display:flex;flex-direction:column;gap:6px';
      if (ev.length) {
        ev.forEach(e => {
          const item = el('div', 'clickable', `<span class="badge-s b-${e.status}" style="margin-right:8px"><i></i>${S.esc(e.eventType)}</span><span class="muted" style="font-size:11.5px">${S.fmtTime(e.time)} · ${e.guests} pax · ${S.esc(e.venue)}</span>`);
          item.style.cssText = 'cursor:pointer;display:flex;align-items:center;flex-wrap:wrap';
          item.addEventListener('click', () => S.orderDrawer(e.id));
          list.appendChild(item);
        });
      } else {
        list.innerHTML = `<span class="muted" style="font-size:11.5px">${tf('No events', 'Tiada majlis')}</span>`;
      }
      row.appendChild(list);
      wrap.appendChild(row);
    }
    swap(wrap);
  }

  /* ---- DAY ---- */
  function renderDay() {
    const dt = new Date(cursor.getFullYear(), cursor.getMonth(), cursor._weekDay || 3);
    $('#cal-title').innerHTML = `${dt.toLocaleDateString(LOC, { weekday: 'long', day: 'numeric', month: 'long' })} <span class="yr">${dt.getFullYear()}</span>`;
    const key = iso(dt.getFullYear(), dt.getMonth(), dt.getDate());
    const ev = ordersOn(key);
    const wrap = el('div', '', '');
    const hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
    wrap.style.cssText = 'display:flex;flex-direction:column';
    hours.forEach(h => {
      const row = el('div', '', '');
      row.style.cssText = 'display:grid;grid-template-columns:64px 1fr;gap:14px;border-bottom:1px solid var(--line);min-height:52px;padding:8px 0';
      const evs = ev.filter(e => e.time <= h && e.endTime > h);
      const startHere = ev.filter(e => e.time.slice(0, 2) === h.slice(0, 2));
      let inner = '';
      startHere.forEach(e => {
        inner += `<div class="clickable" data-id="${e.id}" style="cursor:pointer;background:var(--bg-soft);border:1px solid var(--line);border-left:3px solid ${stColor[e.status]};border-radius:10px;padding:10px 12px;margin-bottom:6px">
          <b style="font-size:12.5px">${S.esc(e.eventType)}</b> ${S.statusBadge(e.status)}
          <div class="muted" style="font-size:11px;margin-top:2px">${S.fmtTime(e.time)}–${S.fmtTime(e.endTime)} · ${e.guests} pax · ${S.esc(e.venue)}</div></div>`;
      });
      row.innerHTML = `<div class="muted" style="font-size:11px;font-weight:600;padding-top:4px">${S.fmtTime(h)}</div><div>${inner || '<span class="muted" style="font-size:11px">—</span>'}</div>`;
      wrap.appendChild(row);
    });
    wrap.querySelectorAll('[data-id]').forEach(n => n.addEventListener('click', () => S.orderDrawer(n.dataset.id)));
    if (!ev.length) { const e = el('div'); S.emptyState(e, tf('No events scheduled', 'Tiada majlis dijadualkan'), tf('This day is currently free. Great time to block for preparation.', 'Hari ini masih kosong. Sesuai untuk tempah hari persediaan.'), 'calendar'); wrap.appendChild(e); }
    swap(wrap);
  }

  function swap(node) { const host = $('#cal-view'); host.innerHTML = ''; host.appendChild(node); }

  function renderStats() {
    const y = cursor.getFullYear(), m = cursor.getMonth();
    const prefix = `${y}-${String(m + 1).padStart(2, '0')}`;
    const evs = D.orders.filter(o => o.date.startsWith(prefix) && o.status !== 'cancelled');
    const guests = evs.reduce((s, o) => s + o.guests, 0);
    const rev = evs.reduce((s, o) => s + o.total, 0);
    const confirmed = evs.filter(o => o.status === 'confirmed').length;
    const preparing = evs.filter(o => o.status === 'preparing').length;
    const revBox = S.canSeeSales()
      ? `<div class="st-box"><div class="n num">${D.RMk(rev)}</div><div class="l">${tf('Booked revenue', 'Hasil ditempah')}</div></div>`
      : `<div class="st-box"><div class="n num">${preparing}</div><div class="l">${tf('In preparation', 'Dalam penyediaan')}</div></div>`;
    $('#cal-stats').innerHTML = `
      <div class="st-box"><div class="n num">${evs.length}</div><div class="l">${tf('Events this month', 'Majlis bulan ini')}</div></div>
      <div class="st-box"><div class="n num">${guests.toLocaleString('en-MY')}</div><div class="l">${tf('Total guests', 'Jumlah tetamu')}</div></div>
      ${revBox}
      <div class="st-box"><div class="n num">${confirmed}</div><div class="l">${tf('Confirmed events', 'Majlis disahkan')}</div></div>`;
  }

  function render() { view === 'month' ? renderMonth() : view === 'week' ? renderWeek() : renderDay(); renderStats(); }

  /* day modal for multi-event days */
  function dayModal(key, ev) {
    const body = ev.map(e => `<div class="list-line clickable" data-id="${e.id}" style="cursor:pointer">
        <span class="badge-s b-${e.status}"><i></i>${S.esc(e.eventType)}</span>
        <span class="muted" style="font-size:11.5px;margin-left:8px">${S.fmtTime(e.time)} · ${e.guests} pax</span>
        <span class="lx">${D.RM(e.total)}</span></div>`).join('');
    S.openModal({
      title: S.fmtDate(key, { weekday: 'long', day: 'numeric', month: 'long' }), subtitle: ev.length + tf(' events', ' majlis'), body, width: '480px',
      onMount(root) { root.querySelectorAll('[data-id]').forEach(n => n.addEventListener('click', () => { S.closeModal(); setTimeout(() => S.orderDrawer(n.dataset.id), 250); })); }
    });
  }

  /* upcoming */
  (function upcoming() {
    const host = $('#upcoming');
    const up = D.orders.filter(o => o.date >= '2026-08-03' && o.status !== 'cancelled').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
    up.forEach(o => {
      const row = el('div', 'team-row', `
        <span class="ic" style="background:${stColor[o.status]}1a;border-color:transparent"><svg viewBox="0 0 24 24" fill="none" stroke="${stColor[o.status]}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></span>
        <div class="meta"><b>${S.esc(o.eventType)}</b><small>${S.fmtDate(o.date)} · ${o.guests} pax</small></div>
        <span class="muted" style="font-size:11px;font-weight:600">${S.fmtDate(o.date, { day: 'numeric', month: 'short' })}</span>`);
      row.style.cssText = 'cursor:pointer;padding:8px 0;border-bottom:1px solid var(--line)';
      row.addEventListener('click', () => S.orderDrawer(o.id));
      host.appendChild(row);
    });
  })();

  /* nav */
  $('#view-tabs').querySelectorAll('button').forEach(b => b.addEventListener('click', function () {
    $('#view-tabs').querySelector('.on').classList.remove('on'); this.classList.add('on');
    view = this.dataset.v; render();
  }));
  // sync active tab with the starting view (Week on mobile)
  (function syncTab() {
    const vt = $('#view-tabs'); if (!vt) return;
    const cur = vt.querySelector('.on'); if (cur) cur.classList.remove('on');
    const btn = vt.querySelector('[data-v="' + view + '"]'); if (btn) btn.classList.add('on');
  })();
  $('#cal-prev').addEventListener('click', () => { step(-1); });
  $('#cal-next').addEventListener('click', () => { step(1); });
  $('#cal-today').addEventListener('click', () => { cursor = new Date(2026, 7, 1); cursor._weekDay = 3; render(); });
  function step(dir) {
    if (view === 'month') cursor.setMonth(cursor.getMonth() + dir);
    else if (view === 'week') cursor.setDate((cursor._weekDay || 3) + dir * 7), cursor._weekDay = cursor.getDate();
    else cursor._weekDay = (cursor._weekDay || 3) + dir;
    render();
  }

  render();
})();
