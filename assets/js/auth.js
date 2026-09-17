/* ============================================================
   QASEH KATERING — SIMULATED AUTH (client-side demo only)
   NOTE: This is a front-end simulation for demo purposes.
   Accounts + sessions live in localStorage. Passwords are NOT
   encrypted. A real deployment needs a backend (hashed
   passwords, server sessions/JWT, HTTPS). Do not use as-is
   for production security.
   ============================================================ */
(function (g) {
  'use strict';
  const UKEY = 'qaseh_users';
  const SKEY = 'qaseh_session';

  // role labels mirror app.js ROLES (owner reserved for the boss)
  const ROLE_LABELS = {
    owner: 'Owner / Admin',
    manager: 'Operations Manager',
    finance: 'Finance',
    staff: 'Staff / Crew',
  };
  // roles a new applicant may request (owner cannot be self-requested)
  const REQUESTABLE = ['manager', 'finance', 'staff'];

  function read() { try { return JSON.parse(localStorage.getItem(UKEY) || '[]'); } catch (e) { return []; } }
  function write(u) { try { localStorage.setItem(UKEY, JSON.stringify(u)); } catch (e) {} }

  // seed a default boss account on first run
  function seed() {
    let u = read();
    if (!u.some(x => x.role === 'owner')) {
      u.unshift({
        id: 'U-OWNER', name: 'Raziq Rosli', email: 'boss@qaseh.com',
        phone: '013-595 8306', password: 'admin123', role: 'owner',
        status: 'approved', createdAt: Date.now(),
      });
      write(u);
    }
    return u;
  }

  function all() { return seed(); }
  function findByEmail(email) { return all().find(x => (x.email || '').toLowerCase() === String(email || '').toLowerCase()); }

  function register(d) {
    const u = all();
    if (findByEmail(d.email)) return { ok: false, reason: 'exists' };
    const user = {
      id: 'U-' + Date.now().toString(36),
      name: (d.name || '').trim(), email: (d.email || '').trim(),
      phone: (d.phone || '').trim(), password: d.password || '',
      role: REQUESTABLE.includes(d.role) ? d.role : 'staff',
      status: 'pending', createdAt: Date.now(),
    };
    u.push(user); write(u);
    return { ok: true, user };
  }

  function login(email, password, remember) {
    const user = findByEmail(email);
    if (!user || user.password !== password) return { ok: false, reason: 'invalid' };
    if (user.status === 'pending') return { ok: false, reason: 'pending' };
    if (user.status === 'rejected') return { ok: false, reason: 'rejected' };
    // record last login
    const u = all(); const rec = u.find(x => x.id === user.id); if (rec) { rec.lastLogin = Date.now(); write(u); }
    try {
      // remember = persist across browser restarts (localStorage); else this tab only (sessionStorage)
      localStorage.removeItem(SKEY); sessionStorage.removeItem(SKEY);
      (remember ? localStorage : sessionStorage).setItem(SKEY, user.id);
      localStorage.setItem('selera_role', user.role);
    } catch (e) {}
    return { ok: true, user };
  }

  function current() {
    try {
      const id = sessionStorage.getItem(SKEY) || localStorage.getItem(SKEY);
      if (!id) return null;
      return all().find(x => x.id === id) || null;
    } catch (e) { return null; }
  }

  function logout() { try { localStorage.removeItem(SKEY); sessionStorage.removeItem(SKEY); } catch (e) {} }

  // simulated "forgot password" — a real system would email a secure reset link
  function resetPassword(email, newPass) {
    const u = all(); const x = u.find(y => (y.email || '').toLowerCase() === String(email || '').toLowerCase());
    if (!x) return { ok: false, reason: 'notfound' };
    x.password = newPass; write(u);
    return { ok: true, user: x };
  }

  // approval controls (owner only, enforced by UI)
  function setStatus(id, status, role) {
    const u = all(); const x = u.find(y => y.id === id);
    if (x) { x.status = status; if (role) x.role = role; write(u); }
  }
  function remove(id) { write(all().filter(x => x.id !== id)); }

  function initials(name) {
    return (String(name || '').split(/\s+/).map(w => w[0]).join('') || 'NA').slice(0, 2).toUpperCase();
  }

  g.QAUTH = { ROLE_LABELS, REQUESTABLE, all, register, login, current, logout, resetPassword, setStatus, remove, findByEmail, seed, initials };
})(window);
