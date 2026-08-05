/* ============ REPORTS PAGE ============ */
(function () {
  'use strict';
  const D = window.DEMO, S = window.SELERA, C = window.CHART;
  const $ = S.$, el = S.el, tf = S.tf;
  S.mountShell({ page: 'reports', title: 'Reports', subtitle: 'Analytics & insights' });

  /* stat strip */
  $('#rep-stats').innerHTML = `
    <div class="st-box"><div class="n num">RM 482,350</div><div class="l"><span class="trend up" style="padding:1px 6px 1px 4px">▲ 18.4%</span> ${tf('YTD revenue', 'Hasil YTD')}</div></div>
    <div class="st-box"><div class="n num" data-count="142">142</div><div class="l"><span class="trend up" style="padding:1px 6px 1px 4px">▲ 9.2%</span> ${tf('Total orders', 'Jumlah tempahan')}</div></div>
    <div class="st-box"><div class="n num">RM 3,250</div><div class="l"><span class="trend up" style="padding:1px 6px 1px 4px">▲ 5.4%</span> ${tf('Avg. order value', 'Purata nilai tempahan')}</div></div>
    <div class="st-box"><div class="n num" data-count="38">38</div><div class="l"><span class="trend up" style="padding:1px 6px 1px 4px">▲ 12</span> ${tf('New customers', 'Pelanggan baharu')}</div></div>`;
  S.countUp($('#rep-stats'));

  /* revenue trend (line) */
  C.line($('#c-revenue'), D.charts.sales, { w: 720, h: 230, unit: 'k' });

  /* yearly comparison (bars) */
  C.bars($('#c-yearly'), D.charts.yearly, { w: 300, h: 200, mode: 'perf', fmt: v => 'RM ' + Math.round(v / 1000) + 'k', axisFmt: v => 'RM ' + Math.round(v / 1000) + 'k' });

  /* monthly sales (bars) */
  C.bars($('#c-monthly'), D.charts.monthly, { w: 300, h: 190, mode: 'perf', fmt: v => 'RM ' + (v / 1000).toFixed(1) + 'k', axisFmt: v => 'RM ' + Math.round(v / 1000) + 'k', suffix: ' 2026' });

  /* revenue by event type (pie) */
  C.pie($('#c-event'), D.charts.byEventType, { size: 130, r: 60 });
  const le = $('#l-event'); const totalRev = 482350;
  D.charts.byEventType.forEach(s => le.appendChild(el('div', 'li', `<span class="sw" style="background:${s.c}"></span>${s.k}<b>${s.v}% <span style="color:var(--mist);font-weight:500">RM ${Math.round(totalRev * s.v / 100 / 1000)}k</span></b>`)));

  /* revenue by package (pie) */
  C.pie($('#c-pkg'), D.charts.byPackage, { size: 130, r: 60 });
  const lp = $('#l-pkg');
  D.charts.byPackage.forEach(s => lp.appendChild(el('div', 'li', `<span class="sw" style="background:${s.c}"></span>${s.k}<b>${s.v}% <span style="color:var(--mist);font-weight:500">RM ${Math.round(totalRev * s.v / 100 / 1000)}k</span></b>`)));

  /* customer growth (area) */
  const gLabels = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  C.area($('#c-growth'), D.charts.customerGrowth, { w: 560, h: 200, color: D.CLR.green, unit: 'new', labels: gLabels });

  /* peak months (bars volume) */
  C.bars($('#c-peak'), D.charts.peakMonths, { w: 560, h: 200, mode: 'volume', fmt: v => v + ' orders' });

  /* top selling menu (hbars) */
  C.hbars($('#c-menu'), D.charts.topMenu.map(m => ({ k: m.k, v: m.v, c: D.CLR.purple })), { fmt: v => v + '×' });

  /* best customers (hbars) */
  const top = [...D.customers].sort((a, b) => b.spent - a.spent).slice(0, 5).map(c => ({ k: c.name.split(' ').slice(0, 2).join(' '), v: c.spent, c: D.CLR.blue }));
  C.hbars($('#c-topcust'), top, { fmt: v => D.RMk(v) });

  /* ---- customer reviews (submitted on the website) ---- */
  const ago = ts => { const m = Math.round((Date.now() - ts) / 60000); if (m < 60) return m + tf(' min ago', ' min lalu'); const h = Math.round(m / 60); if (h < 24) return h + tf(' hr ago', ' jam lalu'); return Math.round(h / 24) + tf(' d ago', ' hari lalu'); };
  let allFb = [];
  const fbFilter = { rate: '' };

  function fbStars(n) {
    return '<div class="stars" style="display:inline-flex;gap:1px">' + [1, 2, 3, 4, 5].map(i => `<svg viewBox="0 0 24 24" width="12" height="12" fill="${i <= n ? '#F59E0B' : 'none'}" stroke="${i <= n ? '#F59E0B' : '#D4D4D4'}" stroke-width="1.6"><path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/></svg>`).join('') + '</div>';
  }
  const inits = n => (n || 'Guest').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  function renderFbList() {
    const list = $('#fb-list'); list.innerHTML = '';
    const rows = allFb.filter(f => (!fbFilter.rate || f.rating === +fbFilter.rate));
    $('#fb-sub').textContent = rows.length + tf(' of ', ' dari ') + allFb.length + tf(' reviews', ' ulasan');
    if (!rows.length) { S.emptyState(list, tf('No reviews match', 'Tiada ulasan sepadan'), tf('Try a different rating filter.', 'Cuba penapis penilaian lain.'), 'chat'); return; }
    rows.slice(0, 8).forEach(f => {
      const name = f.name || 'Guest';
      list.appendChild(el('div', '', `
        <div style="padding:12px 0;border-bottom:1px solid var(--line)">
          <div class="flex center between" style="margin-bottom:6px">
            <div class="flex center gap8"><span class="avatar" style="width:26px;height:26px;font-size:10px;border:1px solid var(--line)">${inits(name)}</span><b style="font-size:12.5px">${S.esc(name)}</b></div>
            ${fbStars(f.rating)}
          </div>
          <p style="font-size:12.5px;color:var(--ink-soft);line-height:1.55">“${S.esc(f.msg || '')}”</p>
          <div class="muted" style="font-size:10.5px;margin-top:5px">${f.event ? S.esc(f.event) + ' · ' : ''}${ago(f.ts)}${f.source === 'website' ? tf(' · via website', ' · dari laman web') : ''}</div>
        </div>`));
    });
  }

  function renderFeedback() {
    const demo = [
      { name: 'Nurul Huda binti Aziz', rating: 5, event: 'Wedding · 500 pax', msg: 'Flawless service at our wedding — the pelamin was stunning and every guest was served on time.', ts: Date.now() - 3600e3 * 6, source: 'website' },
      { name: 'Faizal Rahman', rating: 5, event: 'Corporate lunch', msg: 'Our quarterly townhall lunch is always handled perfectly. Punctual and professional.', ts: Date.now() - 3600e3 * 30, source: 'website' },
      { name: 'Rajesh Kumar', rating: 5, event: 'Private dinner', msg: 'Felt like a five-star restaurant at home. Plated beautifully, tasted even better.', ts: Date.now() - 3600e3 * 54, source: 'website' },
      { name: 'Siti Aisyah', rating: 4, event: 'Birthday · 80 pax', msg: 'Great food and friendly crew. Setup was a touch late but everything else was excellent.', ts: Date.now() - 3600e3 * 80, source: 'website' },
      { name: 'Tan Wei Ming', rating: 5, event: 'Engagement', msg: 'Beautiful decor and delicious spread. Our families were very impressed.', ts: Date.now() - 3600e3 * 100, source: 'website' },
    ];
    let stored = [];
    try { stored = JSON.parse(localStorage.getItem('selera_feedback') || '[]'); } catch (e) {}
    allFb = stored.concat(demo);

    renderFbList();
    $('#fb-frate').addEventListener('change', e => { fbFilter.rate = e.target.value; renderFbList(); });

    const avg = (allFb.reduce((s, f) => s + f.rating, 0) / allFb.length);
    const dist = [5, 4, 3, 2, 1].map(r => allFb.filter(f => f.rating === r).length);
    const host = $('#fb-summary');
    host.innerHTML = `
      <div class="ra-hero"><div class="big num">${avg.toFixed(1)}</div>${S.stars(Math.round(avg))}</div>
      <div class="bar-comp" style="margin-top:6px">
        ${[5, 4, 3, 2, 1].map((r, i) => `
          <div class="bc-row"><div class="bc-top" style="display:flex;justify-content:space-between;font-size:11.5px;margin-bottom:6px"><span>${r} ${tf('star', 'bintang')}</span><b>${dist[i]}</b></div>
          <div class="bc-track"><div class="mf" style="height:100%;border-radius:20px;background:var(--amber);width:0;transition:width .9s var(--ease)"></div></div></div>`).join('')}
      </div>`;
    const mx = Math.max(...dist, 1);
    host.querySelectorAll('.mf').forEach((m, i) => setTimeout(() => m.style.width = (dist[i] / mx * 100) + '%', 150 + i * 80));
  }
  renderFeedback();

  /* exports */
  $('#export-pdf').addEventListener('click', () => S.toast(tf('Report exported as PDF (demo)', 'Laporan dieksport sebagai PDF (demo)')));
  $('#export-csv').addEventListener('click', () => S.toast(tf('Report data exported as CSV (demo)', 'Data laporan dieksport sebagai CSV (demo)')));
  $('#period').addEventListener('change', e => S.toast(tf('Period changed to: ', 'Tempoh ditukar ke: ') + e.target.value + ' (demo)'));
})();
