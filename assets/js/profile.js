/* ============ MY PROFILE PAGE ============ */
(function () {
  'use strict';
  const D = window.DEMO, S = window.SELERA;
  const $ = S.$, tf = S.tf, esc = S.esc, sIcon = S.sIcon;

  S.mountShell({ page: 'profile', title: tf('My Profile', 'Profil Saya'), subtitle: tf('Account & personal settings', 'Akaun & tetapan peribadi') });

  const root = $('#profile-root');
  const u = window.QAUTH ? QAUTH.current() : null;
  if (!u) { root.innerHTML = `<div class="card pad">${tf('Not signed in.', 'Belum log masuk.')}</div>`; return; }

  const roleLabel = QAUTH.ROLE_LABELS[u.role] || u.role;
  const loc = S.lang() === 'bm' ? 'ms-MY' : 'en-GB';
  const lastLogin = u.lastLogin
    ? new Date(u.lastLogin).toLocaleString(loc, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : tf('This session', 'Sesi ini');
  const statusTxt = u.status === 'approved' ? tf('Approved', 'Diluluskan') : (u.status === 'pending' ? tf('Pending', 'Menunggu') : tf('Rejected', 'Ditolak'));

  root.innerHTML = `
    <div class="prof-page">
      <div class="card pad">
        <div class="prof-summary">
          <span class="prof-avatar">${QAUTH.initials(u.name)}</span>
          <div class="prof-id">
            <h2>${esc(u.name)}</h2>
            <div class="prof-email">${esc(u.email)}</div>
          </div>
          <span class="prof-role"><i></i>${esc(roleLabel)}</span>
        </div>
        <div class="prof-stats">
          <div class="ps"><span class="k">${tf('Phone', 'Telefon')}</span><span class="v">${esc(u.phone || '—')}</span></div>
          <div class="ps"><span class="k">${tf('Account status', 'Status akaun')}</span><span class="v">${statusTxt}</span></div>
          <div class="ps"><span class="k">${tf('Last login', 'Log masuk akhir')}</span><span class="v">${lastLogin}</span></div>
        </div>
      </div>

      <div class="card pad">
        <div class="prof-sec-t">${sIcon('users2')} ${tf('Personal details', 'Butiran peribadi')}</div>
        <div class="card-sub">${tf('Update your name and contact number', 'Kemas kini nama dan nombor anda')}</div>
        <div class="form-field"><label>${tf('Full name', 'Nama penuh')}</label><input id="p-name" value="${esc(u.name)}"></div>
        <div class="form-field"><label>${tf('Email (login ID)', 'Emel (ID log masuk)')}</label><input value="${esc(u.email)}" disabled></div>
        <div class="form-field"><label>${tf('Phone', 'Telefon')}</label><input id="p-phone" value="${esc(u.phone || '')}" placeholder="cth. 012-345 6789"></div>
        <div class="prof-actions"><button class="btn btn-primary" id="p-save">${sIcon('check')} ${tf('Save changes', 'Simpan perubahan')}</button></div>
      </div>

      <div class="card pad">
        <div class="prof-sec-t"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> ${tf('Change password', 'Tukar kata laluan')}</div>
        <div class="card-sub">${tf('Choose a new password (min 6 characters)', 'Pilih kata laluan baharu (min 6 aksara)')}</div>
        <div class="form-field"><label>${tf('Current password', 'Kata laluan semasa')}</label><input id="p-cur" type="password" placeholder="••••••••"></div>
        <div class="form-field"><label>${tf('New password', 'Kata laluan baharu')}</label><input id="p-new" type="password" placeholder="••••••••"></div>
        <div class="form-field"><label>${tf('Confirm new password', 'Sahkan kata laluan baharu')}</label><input id="p-cnf" type="password" placeholder="••••••••"></div>
        <div class="prof-actions"><button class="btn btn-primary" id="p-chpw">${tf('Update password', 'Kemas kini kata laluan')}</button></div>
      </div>
    </div>`;

  $('#p-save').addEventListener('click', () => {
    const name = $('#p-name').value.trim();
    if (!name) { S.toast(tf('Name cannot be empty', 'Nama tidak boleh kosong')); return; }
    QAUTH.updateProfile(u.id, { name, phone: $('#p-phone').value });
    S.toast(tf('Profile updated', 'Profil dikemas kini'));
    setTimeout(() => location.reload(), 650);
  });

  $('#p-chpw').addEventListener('click', () => {
    const cur = $('#p-cur').value, np = $('#p-new').value, cf = $('#p-cnf').value;
    if (np.length < 6) { S.toast(tf('Password must be at least 6 characters', 'Kata laluan mesti sekurang-kurangnya 6 aksara')); return; }
    if (np !== cf) { S.toast(tf('Passwords do not match', 'Kata laluan tidak sepadan')); return; }
    const res = QAUTH.changePassword(u.id, cur, np);
    if (!res.ok) { S.toast(tf('Current password is wrong', 'Kata laluan semasa salah')); return; }
    $('#p-cur').value = $('#p-new').value = $('#p-cnf').value = '';
    S.toast(tf('Password changed', 'Kata laluan ditukar'));
  });
})();
