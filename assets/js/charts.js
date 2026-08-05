/* ============================================================
   SELERA · Catering Operations — CHART RENDERERS
   Color-coded SVG charts with entrance animations + tooltips.
   Depends on: window.DEMO (colors), #tooltip element (via app.js)
   ============================================================ */
(function (global) {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const mk = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const svg = (w, h) => {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', `0 0 ${w} ${h}`); s.setAttribute('class', 'chart-svg'); s.style.height = h + 'px';
    return s;
  };
  let _gid = 0;
  const uid = p => p + '_' + (++_gid);
  const cv = (n, f) => { try { const v = getComputedStyle(document.body).getPropertyValue(n).trim(); return v || f; } catch (e) { return f; } };

  // tooltip bridge (app.js provides these; fall back to no-op)
  const tip = {
    show: (e, html) => global.SELERA && global.SELERA.tip.show(e, html),
    move: e => global.SELERA && global.SELERA.tip.move(e),
    hide: () => global.SELERA && global.SELERA.tip.hide(),
  };

  /* ---------- SPARKLINE ---------- */
  function sparkline(host, data, color, w = 180, h = 30) {
    const s = svg(w, h); s.setAttribute('preserveAspectRatio', 'none'); s.style.height = h + 'px';
    const mn = Math.min(...data), mx = Math.max(...data), rng = (mx - mn) || 1;
    const pts = data.map((v, i) => [i / (data.length - 1) * w, h - 4 - ((v - mn) / rng) * (h - 8)]);
    const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const gid = uid('spk');
    const defs = mk('defs', {}); const lg = mk('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 });
    lg.appendChild(mk('stop', { offset: '0%', 'stop-color': color, 'stop-opacity': .30 }));
    lg.appendChild(mk('stop', { offset: '100%', 'stop-color': color, 'stop-opacity': 0 }));
    defs.appendChild(lg); s.appendChild(defs);
    s.appendChild(mk('path', { d: d + ` L ${w} ${h} L 0 ${h} Z`, fill: `url(#${gid})` }));
    const line = mk('path', { d, fill: 'none', stroke: color, 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    s.appendChild(line);
    if (line.getTotalLength) { const L = line.getTotalLength(); line.style.strokeDasharray = L; line.style.strokeDashoffset = L; line.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 1100, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }); }
    s.appendChild(mk('circle', { cx: pts[pts.length - 1][0], cy: pts[pts.length - 1][1], r: 2.6, fill: color }));
    host.appendChild(s);
    return s;
  }

  /* ---------- SMOOTH LINE (sales trend) ---------- */
  function line(host, data, opts = {}) {
    const W = opts.w || 640, H = opts.h || 210, pad = { l: 38, r: 12, t: 16, b: 24 };
    const unit = opts.unit || 'k';
    const s = svg(W, H); host.appendChild(s);
    const mx = Math.max(...data) * 1.12, mn = 0;
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + ih * i / 4;
      s.appendChild(mk('line', { x1: pad.l, y1: y, x2: W - pad.r, y2: y, stroke: '#F0F0F0', 'stroke-width': 1 }));
      const t = mk('text', { x: pad.l - 6, y: y + 3, 'text-anchor': 'end', fill: '#B4B4B4', 'font-size': 8.5, 'font-family': 'Poppins' });
      t.textContent = 'RM ' + Math.round(mx * (1 - i / 4)) + unit; s.appendChild(t);
    }
    const X = i => pad.l + iw * i / (data.length - 1);
    const Y = v => pad.t + ih * (1 - (v - mn) / (mx - mn));
    const pts = data.map((v, i) => [X(i), Y(v)]);
    function smooth(p) {
      let d = `M ${p[0][0]} ${p[0][1]}`;
      for (let i = 0; i < p.length - 1; i++) {
        const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
        const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
      } return d;
    }
    const dLine = smooth(pts);
    const defs = mk('defs', {});
    const ag = mk('linearGradient', { id: 'salesArea', x1: 0, y1: 0, x2: 0, y2: 1 });
    ag.appendChild(mk('stop', { offset: '0%', 'stop-color': '#16A34A', 'stop-opacity': .20 }));
    ag.appendChild(mk('stop', { offset: '55%', 'stop-color': '#16A34A', 'stop-opacity': .05 }));
    ag.appendChild(mk('stop', { offset: '100%', 'stop-color': '#16A34A', 'stop-opacity': 0 }));
    defs.appendChild(ag);
    const sg = mk('linearGradient', { id: 'salesStroke', x1: 0, y1: 0, x2: 1, y2: 0 });
    data.forEach((v, i) => {
      const delta = i ? v - data[i - 1] : 0.5;
      const col = delta >= 0.05 ? '#16A34A' : delta < -0.8 ? '#DC2626' : delta < 0 ? '#F59E0B' : '#16A34A';
      sg.appendChild(mk('stop', { offset: (i / (data.length - 1) * 100).toFixed(1) + '%', 'stop-color': col }));
    });
    defs.appendChild(sg); s.appendChild(defs);
    s.appendChild(mk('path', { d: dLine + ` L ${X(data.length - 1)} ${pad.t + ih} L ${X(0)} ${pad.t + ih} Z`, fill: 'url(#salesArea)' }));
    const ln = mk('path', { d: dLine, fill: 'none', stroke: 'url(#salesStroke)', 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    s.appendChild(ln);
    if (ln.getTotalLength) { const L = ln.getTotalLength(); ln.style.strokeDasharray = L; ln.style.strokeDashoffset = L; ln.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 1400, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }); }
    // highlight peak
    const maxIdx = data.indexOf(Math.max(...data)), mp = pts[maxIdx];
    const anchor = maxIdx >= data.length - 2 ? 'end' : (maxIdx <= 1 ? 'start' : 'middle');
    const halo = mk('circle', { cx: mp[0], cy: mp[1], r: 9, fill: '#16A34A', opacity: .14 }); s.appendChild(halo);
    halo.animate([{ r: 6, opacity: .28 }, { r: 11, opacity: .06 }], { duration: 1800, iterations: Infinity, easing: 'ease-in-out' });
    s.appendChild(mk('circle', { cx: mp[0], cy: mp[1], r: 4.5, fill: '#16A34A', stroke: '#fff', 'stroke-width': 2 }));
    const ml = mk('text', { x: mp[0], y: mp[1] - 12, 'text-anchor': anchor, fill: '#15803D', 'font-size': 10.5, 'font-weight': 600, 'font-family': 'Poppins' });
    ml.textContent = 'Peak · RM ' + data[maxIdx].toFixed(1) + unit; s.appendChild(ml);
    // hover
    const hoverLine = mk('line', { x1: 0, y1: pad.t, x2: 0, y2: pad.t + ih, stroke: '#0A0A0A', 'stroke-width': 1, 'stroke-dasharray': '3 3', opacity: 0 }); s.appendChild(hoverLine);
    const dot = mk('circle', { r: 4, fill: '#0A0A0A', stroke: '#fff', 'stroke-width': 2, opacity: 0 }); s.appendChild(dot);
    const rect = mk('rect', { x: 0, y: 0, width: W, height: H, fill: 'transparent' }); s.appendChild(rect);
    rect.addEventListener('mousemove', ev => {
      const b = s.getBoundingClientRect(); const mx2 = (ev.clientX - b.left) / b.width * W;
      let idx = Math.round((mx2 - pad.l) / iw * (data.length - 1)); idx = Math.max(0, Math.min(data.length - 1, idx));
      const px = X(idx), py = Y(data[idx]);
      hoverLine.setAttribute('x1', px); hoverLine.setAttribute('x2', px); hoverLine.setAttribute('opacity', .35);
      dot.setAttribute('cx', px); dot.setAttribute('cy', py); dot.setAttribute('opacity', 1);
      tip.show(ev, `<b>RM ${data[idx].toFixed(1)}${unit}</b><br><span class="sub">${opts.labels ? opts.labels[idx] : 'Day ' + (idx + 1)}</span>`);
    });
    rect.addEventListener('mouseleave', () => { hoverLine.setAttribute('opacity', 0); dot.setAttribute('opacity', 0); tip.hide(); });
    return s;
  }

  /* ---------- DONUT ---------- */
  function donut(host, segs, opts = {}) {
    const size = opts.size || 160, r = opts.r || 64, rin = opts.rin || 44, cx = size / 2, cy = size / 2;
    const total = segs.reduce((a, b) => a + b.v, 0);
    const s = svg(size, size); s.style.height = size + 'px'; host.appendChild(s);
    let ang = -Math.PI / 2;
    segs.forEach((seg, i) => {
      const frac = seg.v / total, a2 = ang + frac * Math.PI * 2, gap = 0.03;
      const large = frac > 0.5 ? 1 : 0;
      const x1 = cx + r * Math.cos(ang + gap), y1 = cy + r * Math.sin(ang + gap);
      const x2 = cx + r * Math.cos(a2 - gap), y2 = cy + r * Math.sin(a2 - gap);
      const xi2 = cx + rin * Math.cos(a2 - gap), yi2 = cy + rin * Math.sin(a2 - gap);
      const xi1 = cx + rin * Math.cos(ang + gap), yi1 = cy + rin * Math.sin(ang + gap);
      const p = mk('path', { d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${rin} ${rin} 0 ${large} 0 ${xi1} ${yi1} Z`, fill: seg.c });
      p.style.transformOrigin = `${cx}px ${cy}px`;
      p.style.transition = 'opacity .5s var(--ease), transform .3s var(--ease)';
      p.style.cursor = 'pointer'; p.style.opacity = 0; p.style.transform = 'scale(.85)';
      setTimeout(() => { p.style.opacity = 1; p.style.transform = 'scale(1)'; }, 120 + i * 110);
      p.addEventListener('mouseenter', ev => { p.style.transform = 'scale(1.05)'; tip.show(ev, `<b>${seg.k}</b> · ${seg.v}<br><span class="sub">${Math.round(frac * 100)}% of total</span>`); });
      p.addEventListener('mousemove', tip.move);
      p.addEventListener('mouseleave', () => { p.style.transform = 'scale(1)'; tip.hide(); });
      s.appendChild(p); ang = a2;
    });
    if (opts.center) {
      const ct = mk('text', { class: 'donut-center', x: cx, y: cy - 2 }); ct.appendChild(mk('tspan', { x: cx, class: 'big' })).textContent = opts.center;
      const t2 = mk('text', { class: 'donut-center', x: cx, y: cy + 16 }); t2.appendChild(mk('tspan', { x: cx, class: 'sm' })).textContent = opts.centerSub || '';
      s.appendChild(ct); s.appendChild(t2);
    }
    return { total };
  }

  /* ---------- PIE ---------- */
  function pie(host, segs, opts = {}) {
    const size = opts.size || 136, r = opts.r || 62, cx = size / 2, cy = size / 2;
    const total = segs.reduce((a, b) => a + b.v, 0);
    const s = svg(size, size); s.style.height = size + 'px'; host.appendChild(s);
    let ang = -Math.PI / 2;
    segs.forEach((seg, i) => {
      const frac = seg.v / total, a2 = ang + frac * Math.PI * 2, large = frac > 0.5 ? 1 : 0;
      const x1 = cx + r * Math.cos(ang), y1 = cy + r * Math.sin(ang);
      const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
      const p = mk('path', { d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, fill: seg.c, stroke: '#fff', 'stroke-width': 2 });
      p.style.transformOrigin = `${cx}px ${cy}px`; p.style.transition = 'transform .5s var(--ease), opacity .5s'; p.style.cursor = 'pointer';
      p.style.opacity = 0; setTimeout(() => p.style.opacity = 1, 100 + i * 90);
      p.addEventListener('mouseenter', ev => { p.style.transform = 'scale(1.05)'; tip.show(ev, `<b>${seg.k}</b><br><span class="sub">${seg.v}% of total</span>`); });
      p.addEventListener('mousemove', tip.move);
      p.addEventListener('mouseleave', () => { p.style.transform = 'scale(1)'; tip.hide(); });
      s.appendChild(p); ang = a2;
    });
    return { total };
  }

  /* ---------- BARS (vertical, performance-colored) ---------- */
  function bars(host, items, opts = {}) {
    const W = opts.w || 300, H = opts.h || 190;
    const grid = opts.grid !== false;
    const pad = { l: grid ? 34 : 8, r: 10, t: 14, b: 22 };
    const C = global.DEMO.CLR;
    const s = svg(W, H); host.appendChild(s);
    const vals = items.map(m => m.v), mx = Math.max(...vals) * 1.1, mnV = Math.min(...vals);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    const bw = iw / items.length * 0.52;
    const mode = opts.mode || 'perf'; // perf | volume
    // gridlines + axis labels (labels sit in the left gutter, clear of the bars)
    if (grid) {
      const axisFmt = opts.axisFmt || (v => Math.round(v));
      for (let i = 0; i <= 4; i++) {
        const y = pad.t + ih * i / 4;
        s.appendChild(mk('line', { x1: pad.l, y1: y, x2: W - pad.r, y2: y, stroke: '#F0F0F0', 'stroke-width': 1 }));
        const t = mk('text', { x: pad.l - 6, y: y + 3, 'text-anchor': 'end', fill: '#B4B4B4', 'font-size': 8.5, 'font-family': 'Poppins' });
        t.textContent = axisFmt(mx * (1 - i / 4)); s.appendChild(t);
      }
    }
    const colorOf = (m, isLast) => {
      if (mode === 'volume') return m.v >= avg ? C.blue : C.gray;
      return isLast ? C.purple : m.v === mnV ? C.red : m.v >= avg ? C.green : C.orange;
    };
    items.forEach((m, i) => {
      const x = pad.l + iw * (i + 0.5) / items.length - bw / 2;
      const h = ih * (m.v / mx), y = pad.t + ih - h;
      const isLast = i === items.length - 1;
      const col = colorOf(m, isLast);
      const bar = mk('rect', { x, y: pad.t + ih, width: bw, height: 0, rx: 5, fill: col }); s.appendChild(bar);
      setTimeout(() => { bar.setAttribute('height', h); bar.setAttribute('y', y); bar.style.transition = 'height .8s cubic-bezier(.22,1,.36,1),y .8s cubic-bezier(.22,1,.36,1),opacity .2s'; }, 60 + i * 70);
      bar.style.cursor = 'pointer';
      bar.addEventListener('mouseenter', ev => { bar.style.opacity = .8; tip.show(ev, `<b>${opts.fmt ? opts.fmt(m.v) : m.v}</b><br><span class="sub">${m.m}${opts.suffix || ''}</span>`); });
      bar.addEventListener('mousemove', tip.move);
      bar.addEventListener('mouseleave', () => { bar.style.opacity = 1; tip.hide(); });
      const tx = mk('text', { x: x + bw / 2, y: H - 6, 'text-anchor': 'middle', fill: '#B4B4B4', 'font-size': 9.5, 'font-family': 'Poppins', 'font-weight': isLast ? 600 : 400 });
      tx.textContent = m.m; if (isLast && mode === 'perf') tx.setAttribute('fill', C.purple); s.appendChild(tx);
    });
    return s;
  }

  /* ---------- HORIZONTAL BARS (ranked lists) ---------- */
  function hbars(host, items, opts = {}) {
    const color = opts.color || global.DEMO.CLR.blue;
    const mx = Math.max(...items.map(i => i.v));
    const wrap = document.createElement('div');
    wrap.style.display = 'flex'; wrap.style.flexDirection = 'column'; wrap.style.gap = '12px';
    items.forEach((it, i) => {
      const row = document.createElement('div');
      row.innerHTML = `
        <div class="bc-top" style="display:flex;justify-content:space-between;font-size:11.5px;margin-bottom:6px">
          <span style="color:var(--graphite)">${it.k}</span><b>${opts.fmt ? opts.fmt(it.v) : it.v}</b>
        </div>
        <div class="bc-track"><div class="mf" style="height:100%;border-radius:20px;background:${it.c || color};width:0;transition:width .9s var(--ease)"></div></div>`;
      wrap.appendChild(row);
      setTimeout(() => { row.querySelector('.mf').style.width = (it.v / mx * 100).toFixed(1) + '%'; }, 120 + i * 90);
    });
    host.appendChild(wrap);
  }

  /* ---------- AREA (weekly volume) ---------- */
  function area(host, data, opts = {}) {
    const W = opts.w || 300, H = opts.h || 190;
    const grid = opts.grid !== false;
    const pad = { l: grid ? 30 : 6, r: 10, t: 14, b: 22 };
    const color = opts.color || global.DEMO.CLR.blue;
    const s = svg(W, H); host.appendChild(s);
    const mx = Math.max(...data) * 1.15, iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    const X = i => pad.l + iw * i / (data.length - 1), Y = v => pad.t + ih * (1 - v / mx);
    const pts = data.map((v, i) => [X(i), Y(v)]);
    // gridlines + axis labels (labels sit in the left gutter, clear of the line)
    if (grid) {
      const axisFmt = opts.axisFmt || (v => Math.round(v));
      for (let i = 0; i <= 4; i++) {
        const y = pad.t + ih * i / 4;
        s.appendChild(mk('line', { x1: pad.l, y1: y, x2: W - pad.r, y2: y, stroke: '#F0F0F0', 'stroke-width': 1 }));
        const t = mk('text', { x: pad.l - 6, y: y + 3, 'text-anchor': 'end', fill: '#B4B4B4', 'font-size': 8.5, 'font-family': 'Poppins' });
        t.textContent = axisFmt(mx * (1 - i / 4)); s.appendChild(t);
      }
    }
    const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const gid = uid('area'); const defs = mk('defs', {}); const lg = mk('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 });
    lg.appendChild(mk('stop', { offset: '0%', 'stop-color': color, 'stop-opacity': .16 }));
    lg.appendChild(mk('stop', { offset: '100%', 'stop-color': color, 'stop-opacity': 0 }));
    defs.appendChild(lg); s.appendChild(defs);
    s.appendChild(mk('path', { d: d + ` L ${X(data.length - 1)} ${pad.t + ih} L ${X(0)} ${pad.t + ih} Z`, fill: `url(#${gid})` }));
    const ln = mk('path', { d, fill: 'none', stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    s.appendChild(ln);
    if (ln.getTotalLength) { const L = ln.getTotalLength(); ln.style.strokeDasharray = L; ln.style.strokeDashoffset = L; ln.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 1200, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }); }
    pts.forEach((p, i) => {
      const c = mk('circle', { cx: p[0], cy: p[1], r: 3, fill: '#fff', stroke: color, 'stroke-width': 1.8 }); c.style.cursor = 'pointer';
      c.addEventListener('mouseenter', ev => { c.setAttribute('r', 4.5); tip.show(ev, `<b>${data[i]} ${opts.unit || 'orders'}</b><br><span class="sub">${opts.labels ? opts.labels[i] : 'Week ' + (i + 1)}</span>`); });
      c.addEventListener('mousemove', tip.move);
      c.addEventListener('mouseleave', () => { c.setAttribute('r', 3); tip.hide(); });
      s.appendChild(c);
    });
    // x-axis labels
    if (opts.xaxis !== false) {
      data.forEach((v, i) => {
        const lab = opts.labels ? opts.labels[i] : 'W' + (i + 1);
        const t = mk('text', { x: X(i), y: H - 5, 'text-anchor': 'middle', fill: '#B4B4B4', 'font-size': 9, 'font-family': 'Poppins' });
        t.textContent = lab; s.appendChild(t);
      });
    }
    return s;
  }

  /* ---------- GAUGE (progress ring) ---------- */
  function gauge(host, pct, opts = {}) {
    const size = opts.size || 92, sw = opts.sw || 9, r = (size - sw) / 2 - 1, cx = size / 2, cy = size / 2, C = 2 * Math.PI * r;
    const color = opts.color || global.DEMO.CLR.purple;
    const s = svg(size, size); s.style.height = size + 'px'; host.appendChild(s);
    s.appendChild(mk('circle', { cx, cy, r, fill: 'none', stroke: cv('--line', '#ECECEC'), 'stroke-width': sw }));
    const arc = mk('circle', { cx, cy, r, fill: 'none', stroke: color, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-dasharray': C.toFixed(1), 'stroke-dashoffset': C.toFixed(1), transform: `rotate(-90 ${cx} ${cy})` });
    s.appendChild(arc);
    requestAnimationFrame(() => { arc.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1)'; arc.setAttribute('stroke-dashoffset', (C * (1 - Math.min(pct, 100) / 100)).toFixed(1)); });
    const t1 = mk('text', { x: cx, y: cy - 1, 'text-anchor': 'middle', 'font-family': 'Poppins', 'font-weight': 700, 'font-size': 18, fill: cv('--ink', '#0A0A0A') }); t1.textContent = Math.round(pct) + '%'; s.appendChild(t1);
    if (opts.sub) { const t2 = mk('text', { x: cx, y: cy + 13, 'text-anchor': 'middle', 'font-family': 'Poppins', 'font-weight': 600, 'font-size': 7.5, 'letter-spacing': '.06em', fill: cv('--mist', '#8E8E8E') }); t2.textContent = opts.sub; s.appendChild(t2); }
    return s;
  }

  global.CHART = { sparkline, line, donut, pie, bars, hbars, area, gauge };

})(window);
