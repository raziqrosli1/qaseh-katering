/* ============ STAFF PAGE ============ */
(function () {
  'use strict';
  const D = window.DEMO, S = window.SELERA;
  const $ = S.$, el = S.el, tf = S.tf;
  S.mountShell({ page: 'staff', title: 'Staff', subtitle: 'Team & scheduling' });

  const roleClass = { Chef: 'role-chef', Kitchen: 'role-kitchen', Driver: 'role-driver', Waiter: 'role-waiter', Supervisor: 'role-supervisor' };
  const roleIcon = {
    Chef: '<path d="M8 21v-2a4 4 0 0 1 8 0v2M12 3v6M9 6h6"/><circle cx="12" cy="12" r="1"/>',
    Kitchen: '<path d="M3 2v7a3 3 0 0 0 6 0V2M6 2v20M16 2c-1.5 0-3 2-3 5s1.5 5 3 5v10"/>',
    Driver: '<path d="M10 17h4V5H2v12h3M20 17h2v-4l-3-4h-5v8h2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
    Waiter: '<path d="M3 11h18l-2 9H5zM7 11V7a5 5 0 0 1 10 0v4"/>',
    Supervisor: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>',
  };
  const availLabel = a => ({ free: tf('Available', 'Ada'), busy: tf('Assigned', 'Bertugas'), off: tf('On leave', 'Cuti') }[a] || a);
  const rawIcon = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const state = { q: '', role: '', avail: '' };

  (function stats() {
    const total = D.staff.length;
    const free = D.staff.filter(s => s.avail === 'free').length;
    const busy = D.staff.filter(s => s.avail === 'busy').length;
    const off = D.staff.filter(s => s.avail === 'off').length;
    $('#staff-stats').innerHTML = `
      <div class="st-box"><div class="n num" data-count="${total}">${total}</div><div class="l">${tf('Total team', 'Jumlah pasukan')}</div></div>
      <div class="st-box"><div class="n num" style="color:var(--green-d)" data-count="${free}">${free}</div><div class="l">${tf('Available', 'Ada')}</div></div>
      <div class="st-box"><div class="n num" style="color:#B45309" data-count="${busy}">${busy}</div><div class="l">${tf('Assigned', 'Bertugas')}</div></div>
      <div class="st-box"><div class="n num muted" data-count="${off}">${off}</div><div class="l">${tf('On leave', 'Cuti')}</div></div>`;
    S.countUp($('#staff-stats'));
  })();

  function filtered() {
    return D.staff.filter(s => {
      if (state.role && s.role !== state.role) return false;
      if (state.avail && s.avail !== state.avail) return false;
      if (state.q) { const q = state.q.toLowerCase(); if (!(s.name + ' ' + s.role + ' ' + s.team).toLowerCase().includes(q)) return false; }
      return true;
    });
  }

  function render() {
    const rows = filtered(), grid = $('#staff-grid');
    $('#rc').textContent = rows.length + tf(' of ', ' dari ') + D.staff.length + tf(' members', ' ahli');
    if (!rows.length) { grid.innerHTML = ''; const e = el('div'); e.style.gridColumn = '1/-1'; S.emptyState(e, tf('No staff found', 'Tiada staf dijumpai'), tf('Try a different role or availability filter.', 'Cuba penapis peranan atau ketersediaan lain.'), 'staff'); grid.appendChild(e); return; }
    grid.innerHTML = '';
    rows.forEach(s => {
      const c = el('div', 'card hover staff-card', `
        <div class="sc-top">
          <span class="avatar">${s.initials}</span>
          <div><div class="sc-name">${S.esc(s.name)}</div><div class="sc-sub">${s.team} · ${tf('since', 'sejak')} ${s.since}</div></div>
        </div>
        <div class="flex between center">
          <span class="tag-role ${roleClass[s.role]}">${s.role}</span>
          <span class="avail ${s.avail}"><i></i>${availLabel(s.avail)}</span>
        </div>
        <div class="sc-foot">
          <span class="rating-pill" style="color:#B45309"><svg viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/></svg>${s.rating}</span>
          <span class="muted" style="font-size:11px">${s.events} ${tf('events', 'majlis')} · ${s.assigned.length} ${tf('active', 'aktif')}</span>
        </div>`);
      c.addEventListener('click', () => profile(s.id));
      grid.appendChild(c);
    });
  }

  function profile(id) {
    const s = D.staff.find(x => x.id === id); if (!s) return;
    const assigned = s.assigned.map(oid => D.getOrder(oid)).filter(Boolean);
    const sched = [
      [tf('Mon', 'Isn'), s.avail !== 'off' ? tf('Dewan setup · Langkap', 'Set-up dewan · Langkap') : tf('Off day', 'Cuti')],
      [tf('Tue', 'Sel'), tf('Kitchen prep · Corporate', 'Sedia dapur · Korporat')],
      [tf('Wed', 'Rab'), tf('Available', 'Ada')],
      [tf('Thu', 'Kha'), tf('Wedding · Teluk Intan', 'Kahwin · Teluk Intan')],
      [tf('Fri', 'Jum'), s.avail === 'off' ? tf('Off day', 'Cuti') : tf('Standby', 'Sedia')],
      [tf('Sat', 'Sab'), tf('Wedding · 500 pax', 'Kahwin · 500 pax')],
      [tf('Sun', 'Ahd'), tf('Rest day', 'Hari rehat')],
    ];
    const body = `
      <div class="d-sec">
        <div class="profile-hero">
          <span class="avatar">${s.initials}</span>
          <div><div class="ph-name">${S.esc(s.name)}</div>
            <div class="ph-sub"><span class="tag-role ${roleClass[s.role]}">${s.role}</span><span class="avail ${s.avail}"><i></i>${availLabel(s.avail)}</span></div>
            <div class="ph-sub" style="margin-top:6px"><span>${S.sIcon('phone')} ${S.esc(s.phone)}</span><span>${S.sIcon('mail')} ${S.esc(s.email)}</span></div>
          </div>
        </div>
      </div>

      <div class="stat-strip">
        <div class="st-box"><div class="n num">${s.events}</div><div class="l">${tf('Events served', 'Majlis dilayan')}</div></div>
        <div class="st-box"><div class="n num">${s.rating}</div><div class="l">${tf('Avg. rating', 'Penilaian purata')}</div></div>
        <div class="st-box"><div class="n num">${s.assigned.length}</div><div class="l">${tf('Active jobs', 'Tugasan aktif')}</div></div>
        <div class="st-box"><div class="n num">${s.since}</div><div class="l">${tf('Member since', 'Ahli sejak')}</div></div>
      </div>

      <div class="d-sec">
        <div class="st">${S.sIcon('star')} ${tf('Performance', 'Prestasi')}</div>
        <div class="bc-row" style="margin-bottom:10px"><div class="bc-top" style="display:flex;justify-content:space-between;font-size:11.5px;margin-bottom:6px"><span>${tf('Service rating', 'Penilaian servis')}</span><b>${s.rating} / 5.0</b></div><div class="meter"><i style="background:var(--green)" data-w="${(s.rating / 5 * 100).toFixed(0)}"></i></div></div>
        <div class="bc-row" style="margin-bottom:10px"><div class="bc-top" style="display:flex;justify-content:space-between;font-size:11.5px;margin-bottom:6px"><span>${tf('Punctuality', 'Ketepatan masa')}</span><b>96%</b></div><div class="meter"><i style="background:var(--blue)" data-w="96"></i></div></div>
        <div class="bc-row"><div class="bc-top" style="display:flex;justify-content:space-between;font-size:11.5px;margin-bottom:6px"><span>${tf('Reliability', 'Kebolehpercayaan')}</span><b>92%</b></div><div class="meter"><i style="background:var(--purple)" data-w="92"></i></div></div>
      </div>

      <div class="d-sec">
        <div class="st">${S.sIcon('orders')} ${tf('Assigned events', 'Majlis ditugaskan')}</div>
        ${assigned.length ? assigned.map(o => `<div class="list-line clickable" data-id="${o.id}" style="cursor:pointer"><b>${S.esc(o.eventType)}</b><span class="muted" style="font-size:11px;margin-left:8px">${S.fmtDate(o.date)}</span><span class="lx">${o.guests} pax</span></div>`).join('') : `<span class="muted" style="font-size:12px">${tf('No active assignments', 'Tiada tugasan aktif')}</span>`}
      </div>

      <div class="d-sec">
        <div class="st">${S.sIcon('calendar')} ${tf('This week\u2019s schedule', 'Jadual minggu ini')}</div>
        ${sched.map(d => `<div class="list-line"><b style="width:38px">${d[0]}</b><span>${d[1]}</span></div>`).join('')}
      </div>`;
    const foot = `<button class="btn" data-act="call">${S.sIcon('phone')} ${tf('Call', 'Panggil')}</button><button class="btn" data-act="assign">${tf('Assign to event', 'Tugaskan ke majlis')}</button><button class="btn btn-primary" data-act="msg" style="margin-left:auto">${S.sIcon('mail')} ${tf('Message', 'Mesej')}</button>`;
    S.openDrawer({
      title: tf('Staff Profile', 'Profil Staf'), subtitle: S.esc(s.name) + ' · ' + s.role, body, foot,
      onMount(root) {
        root.querySelectorAll('.meter i').forEach(m => setTimeout(() => m.style.width = m.dataset.w + '%', 200));
        root.querySelectorAll('[data-id]').forEach(n => n.addEventListener('click', () => { S.closeDrawer(); setTimeout(() => S.orderDrawer(n.dataset.id), 260); }));
        root.querySelector('[data-act=call]').onclick = () => S.toast(tf('Calling ', 'Menghubungi ') + s.phone + ' (demo)');
        root.querySelector('[data-act=assign]').onclick = () => S.toast(s.name + tf(' assigned to event (demo)', ' ditugaskan ke majlis (demo)'));
        root.querySelector('[data-act=msg]').onclick = () => S.toast(tf('Message sent to ', 'Mesej dihantar ke ') + s.name + ' (demo)');
      }
    });
  }

  $('#q').addEventListener('input', e => { state.q = e.target.value; render(); });
  $('#f-role').addEventListener('change', e => { state.role = e.target.value; render(); });
  $('#f-avail').addEventListener('change', e => { state.avail = e.target.value; render(); });
  $('#add-staff').addEventListener('click', () => S.toast(tf('Add staff form opened (demo)', 'Borang tambah staf dibuka (demo)')));

  render();
})();
