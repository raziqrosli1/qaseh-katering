/* ============ SETTINGS PAGE ============ */
(function () {
  'use strict';
  const D = window.DEMO, S = window.SELERA;
  const $ = S.$, el = S.el, B = D.BRAND, tf = S.tf;
  S.mountShell({ page: 'settings', title: 'Settings', subtitle: 'Business configuration' });

  const ic = {
    company: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M9 6h.01M15 6h.01M9 10h.01M15 10h.01M9 14h.01M15 14h.01"/>',
    hours: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    bank: '<path d="M3 21h18M4 10h16M5 6l7-3 7 3M6 10v11M18 10v11M10 10v11M14 10v11"/>',
    invoice: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/>',
    theme: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    roles: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>',
    billing: '<path d="M2 9.5 12 4l10 5.5M4 10v9h16v-9M9 19v-5h6v5M2 21h20"/>',
  };
  const rawIcon = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

  const SECTIONS = [
    { id: 'company', label: tf('Company Profile', 'Profil Syarikat') },
    { id: 'business', label: tf('Business Info', 'Maklumat Perniagaan') },
    { id: 'hours', label: tf('Operating Hours', 'Waktu Operasi') },
    { id: 'bank', label: tf('Bank Accounts', 'Akaun Bank') },
    { id: 'invoice', label: tf('Invoice Settings', 'Tetapan Invois') },
    { id: 'theme', label: tf('Theme', 'Tema') },
    { id: 'notify', label: tf('Notifications', 'Notifikasi') },
    { id: 'billing', label: tf('Subscription & Hosting', 'Langganan & Hosting') },
    { id: 'security', label: tf('Security', 'Keselamatan') },
    { id: 'roles', label: tf('Roles & Permissions', 'Peranan & Kebenaran') },
  ];
  const navIcon = { company: 'company', business: 'company', hours: 'hours', bank: 'bank', invoice: 'invoice', theme: 'theme', notify: 'bell', security: 'lock', roles: 'roles', billing: 'billing' };

  // build nav
  const nav = $('#set-nav');
  SECTIONS.forEach((s, i) => {
    const b = el('button', i === 0 ? 'on' : '', `${rawIcon(ic[navIcon[s.id]])}${s.label}`);
    b.addEventListener('click', () => { nav.querySelector('.on').classList.remove('on'); b.classList.add('on'); render(s.id); });
    nav.appendChild(b);
  });

  const field = (label, value, type) => `<div class="form-field"><label>${label}</label><input type="${type || 'text'}" value="${S.esc(value)}"></div>`;
  const area = (label, value) => `<div class="form-field"><label>${label}</label><textarea>${S.esc(value)}</textarea></div>`;
  const toggle = (title, sub, on) => `<div class="toggle-row"><div class="meta"><b>${title}</b><small>${sub}</small></div><div class="grow"></div><div class="switch ${on ? 'on' : ''}"></div></div>`;

  function render(id) {
    const p = $('#set-panel');
    let h = '';
    if (id === 'company') {
      h = `<div class="card-title">${tf('Company Profile', 'Profil Syarikat')}</div><div class="card-sub">${tf('Your public business identity', 'Identiti perniagaan awam anda')}</div>
        <div class="flex center gap12" style="margin-bottom:18px"><span class="avatar" style="width:56px;height:56px;font-size:18px;border:1px solid var(--line)">QK</span>
          <div><button class="btn btn-sm">${tf('Upload logo', 'Muat naik logo')}</button><div class="muted" style="font-size:10.5px;margin-top:6px">${tf('PNG or SVG, up to 2MB', 'PNG atau SVG, sehingga 2MB')}</div></div></div>
        <div class="form-row">${field(tf('Business name', 'Nama perniagaan'), B.name + ' Catering')}${field(tf('Trading as', 'Berniaga sebagai'), 'Qaseh Katering Ops')}</div>
        <div class="form-row">${field(tf('Contact email', 'Emel'), B.email, 'email')}${field(tf('Phone', 'Telefon'), B.phone, 'tel')}</div>
        <div class="form-row one">${area(tf('Address', 'Alamat'), B.address)}</div>`;
    } else if (id === 'business') {
      h = `<div class="card-title">${tf('Business Information', 'Maklumat Perniagaan')}</div><div class="card-sub">${tf('Registration & tax details', 'Butiran pendaftaran & cukai')}</div>
        <div class="form-row">${field(tf('Company registration (SSM)', 'Pendaftaran syarikat (SSM)'), B.reg)}${field(tf('Legal entity', 'Entiti sah'), B.legal)}</div>
        <div class="form-row">${field(tf('SST number', 'Nombor SST'), B.ssm)}${field(tf('Website', 'Laman web'), B.web)}</div>
        <div class="form-row">${field(tf('Industry', 'Industri'), tf('Catering & Events', 'Katering & Majlis'))}${field(tf('Founded', 'Ditubuhkan'), '2013')}</div>`;
    } else if (id === 'hours') {
      const days = [tf('Monday', 'Isnin'), tf('Tuesday', 'Selasa'), tf('Wednesday', 'Rabu'), tf('Thursday', 'Khamis'), tf('Friday', 'Jumaat'), tf('Saturday', 'Sabtu'), tf('Sunday', 'Ahad')];
      h = `<div class="card-title">${tf('Operating Hours', 'Waktu Operasi')}</div><div class="card-sub">${tf('When your office accepts bookings', 'Bila pejabat anda menerima tempahan')}</div>`;
      days.forEach((d, i) => {
        const closed = i === 6;
        h += `<div class="toggle-row"><b style="width:110px">${d}</b>${closed ? `<span class="muted" style="font-size:12px">${tf('Closed', 'Tutup')}</span>` : '<span style="font-size:12.5px">9:00 AM – 6:00 PM</span>'}<div class="grow"></div><div class="switch ${closed ? '' : 'on'}"></div></div>`;
      });
    } else if (id === 'bank') {
      h = `<div class="card-title">${tf('Bank Accounts', 'Akaun Bank')}</div><div class="card-sub">${tf('Where payments are deposited', 'Ke mana bayaran didepositkan')}</div>
        <div class="d-sec" style="margin-bottom:12px"><div class="flex between center"><div><b>Maybank</b><div class="muted" style="font-size:11.5px">5124 8890 1234 · ${B.legal}</div></div><span class="badge-s b-completed"><i></i>${tf('Primary', 'Utama')}</span></div></div>
        <div class="d-sec" style="margin-bottom:12px"><div class="flex between center"><div><b>CIMB Bank</b><div class="muted" style="font-size:11.5px">7009 1122 3344 · ${B.legal}</div></div><span class="badge-s b-refunded"><i></i>${tf('Backup', 'Sokongan')}</span></div></div>
        <button class="btn">${S.sIcon('plus')} ${tf('Add bank account', 'Tambah akaun bank')}</button>`;
    } else if (id === 'invoice') {
      h = `<div class="card-title">${tf('Invoice Settings', 'Tetapan Invois')}</div><div class="card-sub">${tf('Defaults applied to new invoices', 'Nilai lalai untuk invois baharu')}</div>
        <div class="form-row">${field(tf('Invoice prefix', 'Awalan invois'), 'INV-2026-')}${field(tf('Next number', 'Nombor seterusnya'), '013')}</div>
        <div class="form-row">${field(tf('Default deposit (%)', 'Deposit lalai (%)'), '50')}${field(tf('Payment terms (days)', 'Terma bayaran (hari)'), '14')}</div>
        <div class="form-row">${field(tf('Tax rate — SST (%)', 'Kadar cukai — SST (%)'), '6')}${field(tf('Currency', 'Mata wang'), 'MYR (RM)')}</div>
        <div class="form-row one">${area(tf('Invoice footer note', 'Nota kaki invois'), tf('Thank you for choosing Qaseh Katering. Payment is due by the event date.', 'Terima kasih kerana memilih Qaseh Katering. Bayaran perlu dijelaskan sebelum tarikh majlis.'))}</div>`;
    } else if (id === 'theme') {
      h = `<div class="card-title">${tf('Theme', 'Tema')}</div><div class="card-sub">${tf('Appearance of your workspace', 'Rupa ruang kerja anda')}</div>
        <div class="grid2" style="margin-bottom:16px">
          <div class="d-sec" style="cursor:pointer;border-color:var(--ink)"><div class="flex between center"><b>${tf('Light', 'Cerah')}</b>${S.sIcon('check')}</div><div style="height:54px;border-radius:8px;background:linear-gradient(135deg,#fff,#f0f0f0);border:1px solid var(--line);margin-top:10px"></div></div>
          <div class="d-sec" style="cursor:pointer"><div class="flex between center"><b>${tf('Dark', 'Gelap')}</b></div><div style="height:54px;border-radius:8px;background:linear-gradient(135deg,#2a2a2a,#0a0a0a);margin-top:10px"></div></div>
        </div>
        <div class="mono-label" style="margin-bottom:10px">${tf('Accent colour', 'Warna aksen')}</div>
        <div class="chips">${['#0A0A0A', D.CLR.purple, D.CLR.blue, D.CLR.green, D.CLR.orange, D.CLR.cyan].map((c, i) => `<span style="width:30px;height:30px;border-radius:9px;background:${c};cursor:pointer;box-shadow:${i === 0 ? '0 0 0 2px var(--ink),0 0 0 4px #fff inset' : 'none'};border:2px solid ${i === 0 ? 'var(--ink)' : 'transparent'}"></span>`).join('')}</div>`;
    } else if (id === 'notify') {
      h = `<div class="card-title">${tf('Notification Settings', 'Tetapan Notifikasi')}</div><div class="card-sub">${tf('Choose what you get alerted about', 'Pilih perkara yang anda ingin dimaklumkan')}</div>
        ${toggle(tf('New bookings', 'Tempahan baharu'), tf('Notify when a customer submits a booking', 'Maklum bila pelanggan hantar tempahan'), true)}
        ${toggle(tf('Payment received', 'Bayaran diterima'), tf('Alert when a payment or deposit clears', 'Amaran bila bayaran atau deposit diterima'), true)}
        ${toggle(tf('Overdue invoices', 'Invois tertunggak'), tf('Daily reminder for unpaid invoices', 'Peringatan harian untuk invois belum dibayar'), true)}
        ${toggle(tf('Event reminders', 'Peringatan majlis'), tf('Day-before reminders for scheduled events', 'Peringatan sehari sebelum majlis'), true)}
        ${toggle(tf('Staff availability', 'Ketersediaan staf'), tf('Notify when staff mark themselves unavailable', 'Maklum bila staf tanda tidak tersedia'), false)}
        ${toggle(tf('Weekly summary email', 'Emel ringkasan mingguan'), tf('A performance digest every Monday', 'Ringkasan prestasi setiap Isnin'), true)}`;
    } else if (id === 'billing') {
      const b = D.billing;
      const dtag = iso => { const d = D.daysUntil(iso); if (isNaN(d)) return `<span class="badge-s b-completed"><i></i>${tf('Auto', 'Auto')}</span>`; const cls = d < 0 ? 'b-overdue' : d <= 21 ? 'b-pending' : 'b-completed'; const t = d < 0 ? tf(`Expired ${-d}d ago`, `Tamat ${-d}h lalu`) : d === 0 ? tf('Renews today', 'Perbaharui hari ini') : tf(`${d} days left`, `${d} hari lagi`); return `<span class="badge-s ${cls}"><i></i>${t}</span>`; };
      const totalMonthly = b.plan.price + b.items.reduce((s, it) => s + (it.cycle === 'month' ? it.cost : Math.round(it.cost / 12)), 0);
      h = `<div class="card-title">${tf('Subscription & Hosting', 'Langganan & Hosting')}</div>
        <div class="card-sub">${tf('Domain, server, SSL & renewals — keep auto-renew on so nothing lapses', 'Domain, pelayan, SSL & pembaharuan — pastikan auto-perbaharui aktif')}</div>
        <div class="d-sec" style="margin-bottom:14px">
          <div class="flex between center">
            <div><b style="font-size:15px">${b.plan.name} ${tf('plan', 'pelan')}</b><div class="muted" style="font-size:12px">${D.RM(b.plan.price)}/${b.plan.cycle} · ${tf('next billing', 'bil seterusnya')} ${S.fmtDate(b.plan.next)} · ${b.plan.card}</div></div>
            <span class="badge-s b-completed"><i></i>${tf('Active', 'Aktif')}</span>
          </div>
        </div>
        <div class="stat-strip" style="margin-bottom:16px">
          <div class="st-box"><div class="n num">${D.RM(totalMonthly)}</div><div class="l">${tf('Est. monthly cost', 'Anggaran kos bulanan')}</div></div>
          <div class="st-box"><div class="n num">${b.items.filter(i => i.auto).length}/${b.items.length}</div><div class="l">${tf('Auto-renew on', 'Auto-perbaharui aktif')}</div></div>
          <div class="st-box"><div class="n num">${Math.min(...b.items.map(i => D.daysUntil(i.expiry)).filter(d => d >= 0))}</div><div class="l">${tf('Days to next renewal', 'Hari ke pembaharuan')}</div></div>
          <div class="st-box"><div class="n num" style="color:var(--green-d)">${tf('Online', 'Dalam talian')}</div><div class="l">${tf('Site status', 'Status laman')}</div></div>
        </div>
        <div class="tbl-wrap"><table>
          <thead><tr><th>${tf('Service', 'Perkhidmatan')}</th><th>${tf('Provider', 'Pembekal')}</th><th>${tf('Renews on', 'Diperbaharui pada')}</th><th class="r">${tf('Cost', 'Kos')}</th><th>${tf('Auto-renew', 'Auto-perbaharui')}</th><th></th></tr></thead>
          <tbody>
          ${b.items.map((it, i) => `<tr>
            <td><b>${S.esc(it.type)}</b><div class="muted" style="font-size:10.5px">${S.esc(it.name)}</div></td>
            <td class="venue-c">${S.esc(it.provider)}</td>
            <td>${S.fmtDate(it.expiry)}<div style="margin-top:4px">${dtag(it.expiry)}</div></td>
            <td class="td-r num">${it.cost ? D.RM(it.cost) + '/' + it.cycle : tf('Free', 'Percuma')}</td>
            <td><div class="switch ${it.auto ? 'on' : ''}"></div></td>
            <td class="td-r"><button class="btn btn-sm" data-renew="${S.esc(it.type)}">${tf('Renew', 'Perbaharui')}</button></td>
          </tr>`).join('')}
          </tbody>
        </table></div>
        <p class="muted" style="font-size:11.5px;margin-top:14px;line-height:1.6">${tf('Auto-renew keeps your domain, hosting and SSL active without manual work. We email a reminder <b>14 days</b> before each renewal, and the dashboard flags anything expiring within 30 days.', 'Auto-perbaharui memastikan domain, hosting dan SSL kekal aktif tanpa kerja manual. Emel peringatan dihantar <b>14 hari</b> sebelum setiap pembaharuan, dan dashboard menandakan apa-apa yang tamat dalam 30 hari.')}</p>
        <div class="mono-label" style="margin:22px 0 10px">${tf('Recent subscription invoices', 'Invois langganan terkini')}</div>
        <div class="inv-list">
          ${b.invoices.map(iv => `<div class="inv-row" data-sbi="${iv.no}"><span class="code">${iv.no}<small>${S.fmtDate(iv.date)}</small></span><span class="amt num">${D.RM(iv.amount)}</span><span class="badge-s b-paid"><i></i>${tf('Paid', 'Dibayar')}</span></div>`).join('')}
        </div>`;
    } else if (id === 'security') {
      h = `<div class="card-title">${tf('Security', 'Keselamatan')}</div><div class="card-sub">${tf('Protect your account', 'Lindungi akaun anda')}</div>
        <div class="form-row">${field(tf('Current password', 'Kata laluan semasa'), '', 'password')}${field(tf('New password', 'Kata laluan baharu'), '', 'password')}</div>
        <div style="margin-top:6px">${toggle(tf('Two-factor authentication', 'Pengesahan dua faktor'), tf('Require a code from your phone at login', 'Perlukan kod dari telefon anda semasa log masuk'), true)}
        ${toggle(tf('Login alerts', 'Amaran log masuk'), tf('Email me about new device logins', 'Emel saya tentang log masuk peranti baharu'), true)}
        ${toggle(tf('Auto-logout', 'Auto-log keluar'), tf('Sign out after 30 minutes of inactivity', 'Log keluar selepas 30 minit tidak aktif'), false)}</div>
        <button class="btn btn-danger mt16">${tf('Sign out all devices', 'Log keluar semua peranti')}</button>`;
    } else if (id === 'roles') {
      const roles = [[tf('Owner', 'Pemilik'), tf('Full access to all modules', 'Akses penuh ke semua modul'), 'b-completed'], [tf('Operations Manager', 'Pengurus Operasi'), tf('Orders, calendar, staff, reports', 'Tempahan, kalendar, staf, laporan'), 'b-confirmed'], [tf('Finance', 'Kewangan'), tf('Invoices & payments only', 'Invois & bayaran sahaja'), 'b-preparing'], [tf('Staff / Crew', 'Staf / Kru'), tf('Task calendar — kitchen, service & delivery duties (no sales)', 'Kalendar tugasan — dapur, servis & penghantaran (tiada jualan)'), 'b-pending']];
      h = `<div class="card-title">${tf('Roles & Permissions', 'Peranan & Kebenaran')}</div><div class="card-sub">${tf('Team access control', 'Kawalan akses pasukan')}</div>`;
      roles.forEach(r => h += `<div class="toggle-row"><div class="meta"><b>${r[0]}</b><small>${r[1]}</small></div><div class="grow"></div><span class="badge-s ${r[2]}"><i></i>${tf('Active', 'Aktif')}</span></div>`);
      h += `<button class="btn mt16">${S.sIcon('plus')} ${tf('Add role', 'Tambah peranan')}</button>`;
    }
    p.innerHTML = h;
    // wire switches + theme selection
    p.querySelectorAll('.switch').forEach(sw => sw.addEventListener('click', () => sw.classList.toggle('on')));
    p.querySelectorAll('[data-renew]').forEach(btn => btn.addEventListener('click', () => S.toast(btn.dataset.renew + tf(' renewal initiated (demo)', ' pembaharuan dimulakan (demo)'))));
    p.querySelectorAll('[data-sbi]').forEach(row => row.addEventListener('click', () => S.toast(tf('Opening invoice ', 'Membuka invois ') + row.dataset.sbi + ' (demo)')));
    p.querySelectorAll('.grid2 .d-sec').forEach(card => card.addEventListener('click', () => {
      p.querySelectorAll('.grid2 .d-sec').forEach(x => { x.style.borderColor = 'var(--line)'; const chk = x.querySelector('svg'); if (chk) chk.remove(); });
      card.style.borderColor = 'var(--ink)';
    }));
  }

  $('#save').addEventListener('click', () => S.toast(tf('Settings saved successfully (demo)', 'Tetapan berjaya disimpan (demo)')));
  render('company');
})();
