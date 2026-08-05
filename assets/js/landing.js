/* ============ QASEH KATERING — customer landing page ============ */
(function () {
  'use strict';
  const D = window.DEMO;
  const $ = (s, r = document) => r.querySelector(s);
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  const WA = '60105635298'; // Eva · Qaseh Katering
  const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

  /* nav shadow + scroll progress bar */
  const nav = $('#lp-nav');
  const prog = el('div', 'lp-progress'); document.body.appendChild(prog);
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 10);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (h > 0 ? (window.scrollY / h * 100) : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ---- render packages (from real Qaseh pricing) ---- */
  const popular = 'Buffet RM13.50';
  (function renderPackages() {
    const grid = $('#pkg-grid');
    Object.keys(D.PACKAGES).forEach(name => {
      const p = D.PACKAGES[name];
      const list = (D.MENUS[name] || []).slice(0, 6);
      const card = el('div', 'lp-pkg' + (name === popular ? ' feat' : ''));
      card.innerHTML = `
        ${name === popular ? '<span class="lp-badge-pop">PALING LARIS</span>' : ''}
        <span class="tierbar" style="background:${p.color}"></span>
        <div class="pk-name">${esc(name)}</div>
        <div class="pk-tier">${p.tier} · halal</div>
        <div class="pk-from">${p.perPax ? 'Dari' : 'Harga'}</div>
        <div class="pk-price"><span class="amt">RM ${p.price}</span><span class="per">/ ${p.perPax ? 'pax' : 'set'}</span></div>
        <ul>${list.map(f => `<li>${check}<span>${esc(f)}</span></li>`).join('')}</ul>
        <button class="btn ${name === popular ? 'btn-primary' : ''}" data-pkg="${esc(name)}">Pilih pakej ini</button>`;
      card.querySelector('[data-pkg]').addEventListener('click', () => {
        addToCart(name, D.PACKAGES[name].perPax ? 300 : 1);
        toast(name + ' ditambah ke anggaran');
        document.getElementById('quote').scrollIntoView({ behavior: 'smooth' });
      });
      grid.appendChild(card);
    });
  })();

  /* ---- render canopy packages ---- */
  (function renderCanopy() {
    const grid = $('#canopy-grid'); if (!grid) return;
    D.canopy.forEach(c => grid.appendChild(el('div', 'lp-price-card', `
      <div class="pc-top"><span class="pc-name">${esc(c.name)}</span><span class="pc-price">RM ${c.price}</span></div>
      <div class="pc-note">${esc(c.note || '')}</div>`)));
  })();

  /* ---- render add-ons ---- */
  (function renderAddons() {
    const grid = $('#addon-grid'); if (!grid) return;
    D.addons.forEach(a => grid.appendChild(el('div', 'lp-price-card', `
      <div class="pc-top"><span class="pc-name">${esc(a.name)}</span><span class="pc-price">RM ${a.price}<span style="font-size:11px;color:var(--mist);font-weight:500"> / ${esc(a.unit)}</span></span></div>
      <div class="pc-note">${esc(a.note || '')}</div>`)));
  })();

  /* ---- testimonials ---- */
  const grid_testi = $('#testi-grid');
  (function renderTesti() {
    const stars = '<div class="stars">' + '<svg viewBox="0 0 24 24"><path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/></svg>'.repeat(5) + '</div>';
    const items = [
      { t: 'Servis lancar untuk majlis kahwin kami di Langkap — makanan sedap dan tepat pada masa.', n: 'Nurul Huda', r: 'Perkahwinan · 400 pax', in: 'NH' },
      { t: 'Kenduri komuniti masjid berjalan lancar. Pramusaji mesra dan cekap uruskan tetamu ramai.', n: 'Aminah Yusof', r: 'Kenduri · 300 pax', in: 'AY' },
      { t: 'Set hidangan mempelai sangat kemas dan menyelerakan. Terima kasih Qaseh Katering!', n: 'Rajesh Kumar', r: 'Hidangan Mempelai', in: 'RK' },
    ];
    items.forEach(x => grid_testi.appendChild(el('div', 'lp-testi', `
      ${stars}<p>“${esc(x.t)}”</p>
      <div class="who"><span class="avatar">${x.in}</span><div><b>${esc(x.n)}</b><small>${esc(x.r)}</small></div></div>`)));
  })();

  /* ---- estimator add-ons (Qaseh) ---- */
  const addons = [
    { id: 'khemah', b: 'Khemah Arabian 20×20', s: 'Kanopi + lapik meja', price: 200 },
    { id: 'pelamin', b: 'Pelamin / Meja Beradab', s: 'Hiasan & set pengantin', price: 500 },
    { id: 'dj', b: 'DJ & PA System', s: 'Maksimum 4 jam', price: 500 },
    { id: 'kambing', b: 'Kambing Aqiqah Siap Masak', s: 'Anggaran 150 pax', price: 1300 },
  ];
  (function renderEstAddons() {
    const host = $('#e-addons');
    addons.forEach(a => {
      const row = el('div', 'lp-addon', `
        <span class="chk">${check}</span>
        <span class="meta"><b>${a.b}</b><small>${a.s}</small></span>
        <span class="price">+ RM ${a.price}</span>`);
      row.addEventListener('click', () => { row.classList.toggle('on'); recalc(); });
      row.dataset.id = a.id;
      host.appendChild(row);
    });
  })();

  /* ---- package dropdown ---- */
  (function fillPkgSelect() {
    const sel = $('#e-pkg');
    Object.keys(D.PACKAGES).forEach(name => {
      const p = D.PACKAGES[name];
      const o = document.createElement('option'); o.value = name;
      o.textContent = `${name} — RM ${p.price}/${p.perPax ? 'pax' : 'set'}`; sel.appendChild(o);
    });
    sel.value = popular;
  })();

  /* ---- estimator (multi-package cart) ---- */
  const cart = [];
  function addToCart(name, qty) {
    const ex = cart.find(c => c.name === name);
    if (ex) ex.qty = qty; else cart.push({ name, qty });
    recalc();
  }
  function renderCart() {
    const host = $('#e-cart');
    if (!cart.length) { host.innerHTML = '<div class="lp-hint" style="margin:0 0 8px">Belum ada pakej dipilih.</div>'; return; }
    host.innerHTML = cart.map((c, i) => {
      const p = D.PACKAGES[c.name];
      const sub = p.price * c.qty;
      const unit = (p.perPax ? c.qty + ' pax' : c.qty + ' set') + ' × RM ' + p.price;
      return `<div class="lp-cart-row"><span class="cr-name">${esc(c.name)}<span class="cr-sub">${unit}</span></span><span class="cr-amt">${D.RM(sub)}</span><button class="cr-del" data-i="${i}" type="button" title="Buang">&times;</button></div>`;
    }).join('');
    host.querySelectorAll('.cr-del').forEach(b => b.addEventListener('click', () => { cart.splice(+b.dataset.i, 1); recalc(); }));
  }
  function currentEstimate() {
    let base = 0;
    cart.forEach(c => { base += D.PACKAGES[c.name].price * c.qty; });
    let add = 0;
    $('#e-addons').querySelectorAll('.lp-addon.on').forEach(row => { const a = addons.find(x => x.id === row.dataset.id); add += a.price; });
    return { base, add, total: base + add, lines: cart.slice() };
  }
  function recalc() {
    const e = currentEstimate();
    renderCart();
    $('#e-line-pkgv').textContent = D.RM(e.base);
    $('#e-line-add').textContent = D.RM(e.add);
    $('#e-total').textContent = D.RM(e.total);
    updateWaLinks();
  }
  function updateUnitHint() {
    const p = D.PACKAGES[$('#e-pkg').value];
    $('#e-pax').value = (p && p.perPax) ? 300 : 1;
    const hint = $('#e-unit-hint');
    if (hint) hint.textContent = (p && p.perPax) ? 'Masukkan bilangan pax, kemudian tekan Tambah.' : 'Masukkan bilangan set, kemudian tekan Tambah.';
  }
  $('#e-pkg').addEventListener('change', updateUnitHint);
  $('#e-add').addEventListener('click', () => {
    const name = $('#e-pkg').value; const qty = Math.max(1, parseInt($('#e-pax').value || '1', 10));
    addToCart(name, qty);
    toast(name + ' ditambah ke anggaran');
  });

  /* ---- WhatsApp links ---- */
  function waLink(msg) { return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`; }
  function updateWaLinks() {
    const e = currentEstimate();
    const lines = e.lines.map(c => { const p = D.PACKAGES[c.name]; return `• ${c.name} — ${c.qty} ${p.perPax ? 'pax' : 'set'}`; }).join('\n');
    const quoteMsg = `Salam Qaseh Katering! Saya nak sebut harga:\n${lines || '• (belum pilih pakej)'}\n• Anggaran: ${D.RM(e.total)}\n\nBoleh bantu rancang majlis saya?`;
    const helloMsg = `Salam Qaseh Katering! Saya berminat dengan perkhidmatan katering untuk majlis. Boleh kongsikan maklumat lanjut?`;
    $('#form-wa').href = waLink(quoteMsg);
    $('#hero-wa').href = waLink(helloMsg);
    $('#band-wa').href = waLink(helloMsg);
    $('#foot-wa').href = waLink(helloMsg);
    const cwa = $('#contact-wa'); if (cwa) cwa.href = waLink(helloMsg);
  }

  /* ---- social media links (from BRAND.social — edit usernames in data.js) ---- */
  (function socialLinks() {
    const s = (D.BRAND && D.BRAND.social) || {};
    const wire = (id, url) => {
      const a = $('#' + id);
      if (!a) return;
      if (url) { a.href = url; a.style.display = ''; }
      else { a.style.display = 'none'; } // hide if no username set
    };
    wire('soc-ig', s.instagram ? 'https://instagram.com/' + s.instagram : '');
    wire('soc-fb', s.facebook ? 'https://facebook.com/' + s.facebook : '');
    wire('soc-tt', s.tiktok ? 'https://tiktok.com/@' + s.tiktok : '');
  })();

  /* ---- toast ---- */
  let toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = el('div', 'lp-toast'); document.body.appendChild(toastEl); }
    toastEl.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>${esc(msg)}`;
    requestAnimationFrame(() => toastEl.classList.add('show'));
    clearTimeout(toastEl._t); toastEl._t = setTimeout(() => toastEl.classList.remove('show'), 3600);
  }

  /* ---- enquiry form → saves into the system ---- */
  $('#enquiry-form').addEventListener('submit', e => {
    e.preventDefault();
    const est = currentEstimate();
    const pkgSummary = est.lines.map(c => c.name + ' (' + c.qty + (D.PACKAGES[c.name].perPax ? ' pax' : ' set') + ')').join(', ');
    const totalPax = est.lines.reduce((s, c) => s + (D.PACKAGES[c.name].perPax ? c.qty : 0), 0);
    const lead = {
      id: 'LEAD-' + Date.now().toString().slice(-6),
      name: $('#f-name').value.trim(), phone: $('#f-phone').value.trim(),
      eventType: $('#f-event').value, date: $('#f-date').value,
      location: $('#f-loc') ? $('#f-loc').value.trim() : '',
      pkg: pkgSummary || '—', pax: totalPax, estimate: est.total,
      message: $('#f-msg').value.trim(), ts: Date.now(),
    };
    if (!lead.name || !lead.phone) { toast('Sila isi nama dan nombor telefon'); return; }
    try {
      const leads = JSON.parse(localStorage.getItem('selera_leads') || '[]');
      leads.unshift(lead);
      localStorage.setItem('selera_leads', JSON.stringify(leads.slice(0, 50)));
    } catch (err) {}
    e.target.reset(); $('#f-event').value = lead.eventType;
    toast('Terima kasih, ' + lead.name.split(' ')[0] + '! Pertanyaan anda telah sampai ke pasukan kami.');
  });

  /* ---- customer review form (popup, opened from nav) ---- */
  let revRating = 5;
  const revStars = $('#rev-stars');
  function paintRev() {
    revStars.querySelectorAll('button svg').forEach((svg, i) => {
      const on = (i + 1) <= revRating;
      svg.setAttribute('fill', on ? '#F59E0B' : 'none');
      svg.setAttribute('stroke', on ? '#F59E0B' : '#D4D4D4');
    });
  }
  revStars.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { revRating = +b.dataset.r; paintRev(); }));
  paintRev();

  $('#rev-send').addEventListener('click', () => {
    const name = $('#rev-name').value.trim();
    const event = $('#rev-event').value.trim();
    const msg = $('#rev-msg').value.trim();
    if (!name || !msg) { toast('Sila isi nama dan ulasan ringkas'); return; }
    const review = { name, rating: revRating, event, msg, ts: Date.now(), source: 'website' };
    try {
      const arr = JSON.parse(localStorage.getItem('selera_feedback') || '[]');
      arr.unshift(review);
      localStorage.setItem('selera_feedback', JSON.stringify(arr.slice(0, 60)));
    } catch (e) {}
    const stars = '<div class="stars">' + Array.from({ length: revRating }, () => '<svg viewBox="0 0 24 24"><path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/></svg>').join('') + '</div>';
    const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const card = el('div', 'lp-testi', `${stars}<p>“${esc(msg)}”</p><div class="who"><span class="avatar">${initials}</span><div><b>${esc(name)}</b><small>${esc(event || 'Pelanggan disahkan')}</small></div></div>`);
    grid_testi.insertBefore(card, grid_testi.firstChild);
    $('#rev-name').value = ''; $('#rev-event').value = ''; $('#rev-msg').value = ''; revRating = 5; paintRev();
    closeFb();
    toast('Terima kasih, ' + name.split(' ')[0] + '! Ulasan anda telah dihantar.');
  });

  /* feedback popup open/close */
  const fbModal = $('#fb-modal');
  function openFb() { fbModal.classList.add('show'); setTimeout(() => { const n = $('#rev-name'); if (n) n.focus(); }, 250); }
  function closeFb() { fbModal.classList.remove('show'); }
  $('#open-feedback').addEventListener('click', openFb);
  const openFb2 = $('#open-feedback-2'); if (openFb2) openFb2.addEventListener('click', openFb);
  $('#fb-close').addEventListener('click', closeFb);
  fbModal.addEventListener('click', e => { if (e.target === fbModal) closeFb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeFb(); });

  /* ---- gallery: real photo upload (downscaled, saved to localStorage) ---- */
  const grid = $('#lp-gallery');
  const loadGallery = () => { try { return JSON.parse(localStorage.getItem('selera_gallery') || '[]'); } catch (e) { return []; } };
  const saveGallery = a => { try { localStorage.setItem('selera_gallery', JSON.stringify(a)); return true; } catch (e) { return false; } };
  function renderGallery() {
    grid.querySelectorAll('.lp-gtile.photo').forEach(n => n.remove());
    const photos = loadGallery();
    for (let i = photos.length - 1; i >= 0; i--) {
      const p = photos[i];
      const tile = el('div', 'lp-gtile photo');
      tile.style.backgroundImage = `url(${p.src})`;
      tile.innerHTML = `<button class="g-del" title="Buang" data-i="${i}">&times;</button><span class="cap"><b>${esc(p.cap || 'Majlis kami')}</b><small>Gambar anda</small></span>`;
      tile.querySelector('.g-del').addEventListener('click', ev => { ev.stopPropagation(); const a = loadGallery(); a.splice(+ev.currentTarget.dataset.i, 1); saveGallery(a); renderGallery(); toast('Gambar dibuang'); });
      grid.insertBefore(tile, grid.firstChild);
    }
  }
  function addFiles(files) {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const max = 900; let w = img.width, h = img.height;
          if (w > max || h > max) { const r = Math.min(max / w, max / h); w = Math.round(w * r); h = Math.round(h * r); }
          const c = document.createElement('canvas'); c.width = w; c.height = h;
          c.getContext('2d').drawImage(img, 0, 0, w, h);
          const src = c.toDataURL('image/jpeg', 0.72);
          const a = loadGallery();
          a.push({ src, cap: (file.name.replace(/\.[^.]+$/, '') || 'Majlis kami').slice(0, 24), ts: Date.now() });
          const ok = saveGallery(a.slice(-8));
          renderGallery();
          toast(ok ? 'Gambar ditambah ke galeri' : 'Storan penuh — buang gambar dahulu');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
  $('#gallery-add').addEventListener('click', () => $('#gallery-file').click());
  $('#gallery-file').addEventListener('change', e => { addFiles(e.target.files); e.target.value = ''; });
  renderGallery();

  addToCart(popular, 300);
  updateUnitHint();
  recalc();
  setupReveal();

  /* scroll reveal */
  function setupReveal() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('.lp-stats,.lp-pkg-grid,.lp-menu-grid,.lp-steps,.lp-gallery,.lp-testi-grid,.lp-addon-grid').forEach(g => {
      Array.from(g.children).forEach((c, i) => { c.style.transitionDelay = ((i % 4) * 0.07) + 's'; });
    });
    const sel = ['.lp-hero-grid>div', '.lp-center', '.lp-stat', '.lp-pkg', '.lp-price-card', '.lp-dish', '.lp-step', '.lp-gtile', '.lp-testi', '.lp-panel', '.lp-faq details', '.lp-contact', '.lp-band', '.lp-foot-cta', '.lp-foot-top'];
    const els = document.querySelectorAll(sel.join(','));
    els.forEach(e => e.setAttribute('data-reveal', ''));
    if (reduce) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    els.forEach(e => io.observe(e));
  }
})();
