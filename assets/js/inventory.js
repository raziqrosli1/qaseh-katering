/* ============ INVENTORY PAGE (Qaseh Katering) ============ */
(function () {
  'use strict';
  const D = window.DEMO, S = window.SELERA;
  const $ = S.$, el = S.el, tf = S.tf;
  S.mountShell({ page: 'inventory', title: 'Inventori', subtitle: 'Stok & bahan mentah' });

  // ---- category → code prefix (kod ikut kategori) ----
  const CATPREFIX = { 'Barang Kering': 'BK', 'Ayam/Itik': 'AY', 'Daging': 'DG', 'Sayur': 'SY', 'Tenusu': 'TN', 'Rempah': 'RP', 'Makanan Laut': 'ML' };
  function prefixFor(cat) { if (CATPREFIX[cat]) return CATPREFIX[cat]; const letters = (cat || 'XX').replace(/[^A-Za-z]/g, '').toUpperCase(); return letters.slice(0, 2) || 'XX'; }
  function nextCode(cat) {
    const px = prefixFor(cat); let max = 0;
    D.inventory.forEach(i => { if (i.id && i.id.indexOf(px) === 0) { const n = parseInt(i.id.slice(px.length), 10); if (!isNaN(n) && n > max) max = n; } });
    return px + String(max + 1).padStart(2, '0');
  }

  const stBadge = s => `<span class="badge-s ${s === 'out' ? 'b-overdue' : s === 'low' ? 'b-partial' : 'b-paid'}"><i></i>${s === 'out' ? tf('Out of stock', 'Habis stok') : s === 'low' ? tf('Low stock', 'Stok rendah') : tf('In stock', 'Ada stok')}</span>`;
  const recompute = i => { i.qty = +i.qty || 0; i.reorder = +i.reorder || 0; i.cost = +i.cost || 0; i.status = i.qty <= 0 ? 'out' : (i.qty <= i.reorder ? 'low' : 'ok'); i.value = +(i.qty * i.cost).toFixed(2); };
  const state = { q: '', cat: '', status: '' };

  function refreshCatFilter() {
    const fcat = $('#f-cat'); const cur = fcat.value;
    fcat.innerHTML = `<option value="">${tf('All categories', 'Semua kategori')}</option>` + [...new Set(D.inventory.map(i => i.cat))].sort().map(c => `<option value="${S.esc(c)}">${S.esc(c)}</option>`).join('');
    fcat.value = cur;
  }

  function stats() {
    const total = D.inventory.length;
    const cats = new Set(D.inventory.map(i => i.cat)).size;
    const low = D.inventory.filter(i => i.status === 'low').length;
    const out = D.inventory.filter(i => i.status === 'out').length;
    const value = D.inventory.reduce((s, i) => s + i.value, 0);
    $('#inv-stats').innerHTML = `
      <div class="st-box"><div class="n num">${total}</div><div class="l">${tf('Total items', 'Jumlah item')} · ${cats} ${tf('categories', 'kategori')}</div></div>
      <div class="st-box"><div class="n num" style="color:#B45309">${low}</div><div class="l">${tf('Low stock', 'Stok rendah')}</div></div>
      <div class="st-box"><div class="n num" style="color:var(--red)">${out}</div><div class="l">${tf('Out of stock', 'Habis stok')}</div></div>
      <div class="st-box"><div class="n num">${D.RMk(value)}</div><div class="l">${tf('Stock value', 'Nilai stok')}</div></div>`;
  }

  function filtered() {
    return D.inventory.filter(i => {
      if (state.cat && i.cat !== state.cat) return false;
      if (state.status && i.status !== state.status) return false;
      if (state.q) { const q = state.q.toLowerCase(); if (!(i.name + ' ' + i.supplier + ' ' + i.id).toLowerCase().includes(q)) return false; }
      return true;
    });
  }

  function itemRow(i) {
    const tr = document.createElement('tr'); tr.className = 'clickable';
    tr.innerHTML = `
      <td><span class="mono-code">${i.id}</span> <b>${S.esc(i.name)}</b><div class="muted" style="font-size:10.5px">${S.esc(i.supplier)}</div></td>
      <td class="td-r"><span class="pax-chip">${i.qty} ${i.unit}</span></td>
      <td class="td-r venue-c">${i.reorder} ${i.unit}</td>
      <td class="td-r num">${D.RM(i.cost)}</td>
      <td class="td-r amt num">${D.RM(i.value)}</td>
      <td>${stBadge(i.status)}</td>`;
    tr.addEventListener('click', () => itemDrawer(i.id));
    return tr;
  }

  function render() {
    stats();
    const rows = filtered(), body = $('#inv-body');
    $('#rc').textContent = rows.length + ' ' + tf('of', 'dari') + ' ' + D.inventory.length + ' ' + tf('items', 'item');
    if (!rows.length) { body.innerHTML = '<tr><td colspan="6" style="padding:0"></td></tr>'; S.emptyState(body.querySelector('td'), tf('No items', 'Tiada item'), tf('Try changing the search/filter, or add a new item.', 'Cuba ubah carian/penapis, atau tambah item baharu.'), 'box'); return; }
    const groups = {};
    rows.forEach(i => { (groups[i.cat] = groups[i.cat] || []).push(i); });
    body.innerHTML = '';
    Object.keys(groups).sort().forEach(cat => {
      const items = groups[cat];
      const val = items.reduce((s, i) => s + i.value, 0);
      const alert = items.filter(i => i.status !== 'ok').length;
      const hr = document.createElement('tr'); hr.className = 'inv-cat-row';
      hr.innerHTML = `<td colspan="6"><span class="inv-cat-name">${S.esc(cat)}</span><span class="inv-cat-meta">${items.length} ${tf('items', 'item')} · ${D.RM(val)}${alert ? ` · <span>${alert} ${tf('need attention', 'perlu perhatian')}</span>` : ''}</span></td>`;
      body.appendChild(hr);
      items.forEach(i => body.appendChild(itemRow(i)));
    });
  }

  /* ---- add / edit item ---- */
  function itemModal(item) {
    const isNew = !item;
    const it = item || { id: '', name: '', cat: '', unit: 'kg', qty: 0, reorder: 0, cost: 0, supplier: '' };
    const cats = [...new Set(D.inventory.map(x => x.cat))].sort();
    const body = `
      <div class="form-row">
        <div class="form-field"><label>${tf('Category', 'Kategori')}</label><input id="m-cat" value="${S.esc(it.cat)}" list="m-cats" placeholder="${tf('e.g. Vegetables — type a new name to add', 'cth. Sayur — taip baharu untuk tambah kategori')}"><datalist id="m-cats">${cats.map(c => `<option value="${S.esc(c)}">`).join('')}</datalist></div>
        <div class="form-field"><label>${tf('Code (auto by category)', 'Kod (auto ikut kategori)')}</label><input id="m-id" value="${S.esc(it.id)}" readonly></div>
      </div>
      <div class="form-row one"><div class="form-field"><label>${tf('Ingredient name', 'Nama bahan')}</label><input id="m-name" value="${S.esc(it.name)}" placeholder="${tf('e.g. Dried chilli', 'cth. Cili Padi')}"></div></div>
      <div class="form-row">
        <div class="form-field"><label>${tf('Unit', 'Unit')}</label><input id="m-unit" value="${S.esc(it.unit)}" placeholder="kg / L / papan"></div>
        <div class="form-field"><label>${tf('Unit cost (RM)', 'Kos seunit (RM)')}</label><input id="m-cost" type="number" step="0.1" value="${it.cost}"></div>
      </div>
      <div class="form-row">
        <div class="form-field"><label>${tf('Current stock', 'Stok semasa')}</label><input id="m-qty" type="number" value="${it.qty}"></div>
        <div class="form-field"><label>${tf('Reorder level', 'Paras pesan semula')}</label><input id="m-reorder" type="number" value="${it.reorder}"></div>
      </div>
      <div class="form-row one"><div class="form-field"><label>${tf('Supplier', 'Pembekal')}</label><input id="m-supplier" value="${S.esc(it.supplier)}"></div></div>`;
    S.openModal({
      title: isNew ? tf('Add stock item', 'Tambah item stok') : tf('Edit item', 'Edit item'), subtitle: isNew ? tf('New item', 'Item baharu') : it.id, body, width: '520px',
      foot: `<button class="btn" id="m-cancel">${tf('Cancel', 'Batal')}</button><button class="btn btn-primary" id="m-save">${tf('Save', 'Simpan')}</button>`,
      onMount(root) {
        const g = s => root.querySelector(s).value;
        const catInp = root.querySelector('#m-cat'), idInp = root.querySelector('#m-id');
        if (isNew) { const upd = () => { idInp.value = nextCode(catInp.value.trim() || 'Lain-lain'); }; catInp.addEventListener('input', upd); upd(); }
        root.querySelector('#m-cancel').onclick = S.closeModal;
        root.querySelector('#m-save').onclick = () => {
          const cat = g('#m-cat').trim() || 'Lain-lain';
          const code = (idInp.value.trim()) || nextCode(cat);
          const rec = { id: code, name: g('#m-name').trim() || '(tanpa nama)', cat, unit: g('#m-unit').trim() || 'unit', qty: +g('#m-qty') || 0, reorder: +g('#m-reorder') || 0, cost: +g('#m-cost') || 0, supplier: g('#m-supplier').trim() || '—' };
          if (isNew) { if (D.getStockItem(rec.id)) { S.toast(tf('Code ', 'Kod ') + rec.id + tf(' already exists', ' sudah wujud')); return; } recompute(rec); D.inventory.push(rec); }
          else { Object.assign(it, rec); recompute(it); }
          D.saveInventory(); S.closeModal(); refreshCatFilter(); render(); renderRecipe(); renderBom(); S.toast(isNew ? tf('Item added: ', 'Item ditambah: ') + rec.id : tf('Item updated', 'Item dikemas kini'));
        };
      }
    });
  }

  function itemDrawer(id) {
    const i = D.getStockItem(id); if (!i) return;
    const body = `
      <div class="d-sec">
        <div class="flex between center" style="margin-bottom:12px">
          <div><div class="dh-t" style="font-size:16px">${S.esc(i.name)}</div><div class="dh-s">${i.id} · ${S.esc(i.cat)}</div></div>
          ${stBadge(i.status)}
        </div>
        <div class="kv">
          <div><div class="k">${tf('Current stock', 'Stok semasa')}</div><div class="v strong">${i.qty} ${i.unit}</div></div>
          <div><div class="k">${tf('Reorder level', 'Paras pesan semula')}</div><div class="v">${i.reorder} ${i.unit}</div></div>
          <div><div class="k">${tf('Unit cost', 'Kos seunit')}</div><div class="v">${D.RM(i.cost)}</div></div>
          <div><div class="k">${tf('Stock value', 'Nilai stok')}</div><div class="v strong">${D.RM(i.value)}</div></div>
          <div><div class="k">${tf('Supplier', 'Pembekal')}</div><div class="v">${S.esc(i.supplier)}</div></div>
        </div>
      </div>
      <div class="d-sec">
        <div class="st">${tf('Quick stock update', 'Kemas kini stok cepat')}</div>
        <div class="flex gap8 center">
          <label class="field" style="flex:1"><span class="muted" style="font-size:11px">${tf('New quantity', 'Kuantiti baharu')} (${i.unit})</span><input type="number" id="stk-qty" value="${i.qty}" min="0" style="text-align:right"></label>
          <button class="btn btn-primary" id="stk-save">${tf('Save', 'Simpan')}</button>
        </div>
        <div class="flex gap8 mt8">
          <button class="btn btn-sm" data-add="50">+50</button>
          <button class="btn btn-sm" data-add="100">+100</button>
          <button class="btn btn-sm" data-add="-10">−10</button>
        </div>
      </div>`;
    S.openDrawer({
      title: tf('Stock details', 'Butiran stok'), subtitle: S.esc(i.name), body,
      foot: `<button class="btn" id="stk-edit">${S.sIcon('edit')} ${tf('Edit item', 'Edit item')}</button><button class="btn btn-danger" id="stk-del" style="margin-left:auto">${S.sIcon('trash')} ${tf('Delete', 'Padam')}</button>`,
      onMount(root) {
        const input = root.querySelector('#stk-qty');
        root.querySelector('#stk-save').onclick = () => { i.qty = Math.max(0, parseInt(input.value || '0', 10)); recompute(i); D.saveInventory(); render(); S.toast(tf('Stock updated: ', 'Stok dikemas kini: ') + i.name); };
        root.querySelectorAll('[data-add]').forEach(b => b.onclick = () => { input.value = Math.max(0, i.qty + (+b.dataset.add)); });
        root.querySelector('#stk-edit').onclick = () => { S.closeDrawer(); setTimeout(() => itemModal(i), 260); };
        root.querySelector('#stk-del').onclick = () => {
          if (!confirm(tf('Delete item ', 'Padam item ') + i.name + '?')) return;
          const idx = D.inventory.findIndex(x => x.id === i.id); if (idx >= 0) D.inventory.splice(idx, 1);
          D.saveInventory(); S.closeDrawer(); refreshCatFilter(); render(); renderRecipe(); renderBom(); S.toast(tf('Item deleted', 'Item dipadam'));
        };
      }
    });
  }

  /* ---- BOM package dropdown ---- */
  (function fillBomPkg() {
    const sel = $('#bom-pkg');
    Object.keys(D.bom).forEach(name => { const o = document.createElement('option'); o.value = name; o.textContent = name; sel.appendChild(o); });
    sel.value = 'Buffet RM13.50';
  })();

  /* ---- Requirements planner (scaled from per-100 base) ---- */
  function renderBom() {
    const name = $('#bom-pkg').value, pax = Math.max(0, parseInt($('#bom-pax').value || '0', 10));
    const list = D.bom[name] || [], body = $('#bom-result');
    let shortItems = 0;
    body.innerHTML = list.map(b => {
      const it = D.getStockItem(b.id); if (!it) return '';
      const need = +(b.q * pax / D.bomBase).toFixed(1);
      const short = Math.max(0, +(need - it.qty).toFixed(1));
      if (short > 0) shortItems++;
      return `<tr>
        <td><b>${S.esc(it.name)}</b><div class="muted" style="font-size:10.5px">${b.q} ${it.unit}/100 pax</div></td>
        <td class="td-r num">${need} ${it.unit}</td>
        <td class="td-r num">${it.qty} ${it.unit}</td>
        <td class="td-r num" style="color:${short > 0 ? 'var(--red)' : 'var(--green-d)'}">${short > 0 ? short + ' ' + it.unit : '—'}</td>
        <td>${short > 0 ? `<span class="badge-s b-overdue"><i></i>${tf('Short', 'Tak cukup')}</span>` : `<span class="badge-s b-paid"><i></i>${tf('Enough', 'Mencukupi')}</span>`}</td>
      </tr>`;
    }).join('');
    $('#bom-note').textContent = shortItems ? (shortItems + ' ' + tf('ingredients short', 'bahan tidak mencukupi')) : tf('All ingredients sufficient', 'Semua bahan mencukupi');
    $('#bom-note').style.color = shortItems ? 'var(--red)' : 'var(--green-d)';
  }

  /* ---- Editable recipe (per 100 pax) ---- */
  function renderRecipeSum(name) {
    const list = D.bom[name] || [], pk = D.PACKAGES[name];
    let cost = 0; list.forEach(b => { const it = D.getStockItem(b.id); if (it) cost += b.q * it.cost / D.bomBase; });
    cost = +cost.toFixed(2);
    const per100 = +(cost * 100).toFixed(2);
    const price = (pk && pk.perPax) ? pk.price : null;
    const sum = $('#recipe-sum');
    if (price != null) {
      const profit = +(price - cost).toFixed(2), margin = Math.round(profit / price * 100);
      sum.innerHTML = `
        <div class="st-box"><div class="n num">${D.RM(per100)}</div><div class="l">${tf('Material cost / 100 pax', 'Kos bahan / 100 pax')}</div></div>
        <div class="st-box"><div class="n num">${D.RM(cost)}</div><div class="l">${tf('Cost / pax', 'Kos / pax')}</div></div>
        <div class="st-box"><div class="n num">${D.RM(price)}</div><div class="l">${tf('Selling price / pax', 'Harga jual / pax')}</div></div>
        <div class="st-box"><div class="n num" style="color:${margin >= 40 ? 'var(--green-d)' : '#B45309'}">${margin}%</div><div class="l">${tf('Gross margin', 'Margin kasar')}</div></div>`;
    } else {
      sum.innerHTML = `
        <div class="st-box"><div class="n num">${D.RM(per100)}</div><div class="l">${tf('Material cost / 100 pax', 'Kos bahan / 100 pax')}</div></div>
        <div class="st-box"><div class="n num">${D.RM(cost)}</div><div class="l">${tf('Cost / pax', 'Kos / pax')}</div></div>`;
    }
  }

  function renderRecipe() {
    const name = $('#bom-pkg').value, list = D.bom[name] || [], body = $('#recipe-body');
    body.innerHTML = list.map((b, idx) => {
      const it = D.getStockItem(b.id); if (!it) return '';
      const c = +(b.q * it.cost / D.bomBase).toFixed(2);
      return `<tr>
        <td><b>${S.esc(it.name)}</b><div class="muted" style="font-size:10.5px">${it.id} · ${D.RM(it.cost)}/${it.unit}</div></td>
        <td class="td-r"><input class="rc-inp" data-idx="${idx}" type="number" step="0.5" min="0" value="${b.q}" style="width:88px;text-align:right;border:1px solid var(--line);border-radius:8px;padding:6px 9px;font-family:inherit;font-size:12.5px"> <span class="muted">${it.unit}</span></td>
        <td class="td-r num" data-cost="${idx}">${D.RM(c)}</td>
        <td class="td-r"><button class="btn btn-sm" data-del="${idx}" title="${tf('Remove', 'Buang')}">✕</button></td>
      </tr>`;
    }).join('');
    body.querySelectorAll('.rc-inp').forEach(inp => inp.addEventListener('input', () => {
      list[+inp.dataset.idx].q = +inp.value || 0;
      const it = D.getStockItem(list[+inp.dataset.idx].id);
      body.querySelector(`[data-cost="${inp.dataset.idx}"]`).textContent = D.RM(+(list[+inp.dataset.idx].q * it.cost / D.bomBase).toFixed(2));
      renderRecipeSum(name);
    }));
    body.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => { list.splice(+b.dataset.del, 1); renderRecipe(); }));
    renderRecipeSum(name);
  }

  function addIngredientModal() {
    const name = $('#bom-pkg').value; const used = (D.bom[name] || []).map(b => b.id);
    const avail = D.inventory.filter(i => !used.includes(i.id));
    if (!avail.length) { S.toast(tf('All ingredients already in the recipe', 'Semua bahan sudah ada dalam resepi')); return; }
    const body = `<div class="form-row">
      <div class="form-field"><label>${tf('Ingredient', 'Bahan')}</label><select id="ing-id">${avail.map(i => `<option value="${i.id}">${S.esc(i.name)} (${i.unit})</option>`).join('')}</select></div>
      <div class="form-field"><label>${tf('Qty / 100 pax', 'Kuantiti / 100 pax')}</label><input id="ing-q" type="number" step="0.5" value="5"></div>
    </div>`;
    S.openModal({
      title: tf('Add ingredient to recipe', 'Tambah bahan ke resepi'), subtitle: name, body, width: '460px',
      foot: `<button class="btn" id="ing-cancel">${tf('Cancel', 'Batal')}</button><button class="btn btn-primary" id="ing-add">${tf('Add', 'Tambah')}</button>`,
      onMount(root) {
        root.querySelector('#ing-cancel').onclick = S.closeModal;
        root.querySelector('#ing-add').onclick = () => { (D.bom[name] = D.bom[name] || []).push({ id: root.querySelector('#ing-id').value, q: +root.querySelector('#ing-q').value || 0 }); S.closeModal(); renderRecipe(); S.toast(tf('Ingredient added — remember to Save recipe', 'Bahan ditambah — jangan lupa Simpan resepi')); };
      }
    });
  }

  /* ---- localize static labels in the HTML ---- */
  function localizeStatic() {
    const EXP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>';
    const PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
    const setTx = (sel, tx) => { const e = document.querySelector(sel); if (e) e.textContent = tx; };
    const setHTML = (sel, h) => { const e = document.querySelector(sel); if (e) e.innerHTML = h; };
    setTx('.page-head .ph-t', tf('Inventory', 'Inventori'));
    setTx('.page-head .ph-s', tf('Stock, categories & recipes', 'Stok, kategori & resepi'));
    setHTML('#export', EXP + tf('Export', 'Eksport'));
    setHTML('#add-item', PLUS + tf('Add item', 'Tambah item'));
    setTx('.inv-tab[data-view="stock"]', tf('Stock list', 'Senarai stok'));
    setTx('.inv-tab[data-view="bom"]', tf('Recipe & buying needs', 'Resepi & keperluan beli'));
    $('#q').placeholder = tf('Search item, code, supplier…', 'Cari item, kod, pembekal…');
    document.querySelectorAll('#f-status option').forEach(o => {
      const m = { '': tf('All status', 'Semua status'), ok: tf('In stock', 'Ada stok'), low: tf('Low stock', 'Stok rendah'), out: tf('Out of stock', 'Habis stok') };
      if (m[o.value] !== undefined) o.textContent = m[o.value];
    });
    const sh = document.querySelectorAll('#view-stock thead th');
    const sht = [tf('Item', 'Item'), tf('In stock', 'Stok ada'), tf('Reorder at', 'Pesan semula'), tf('Unit cost', 'Kos seunit'), tf('Value', 'Nilai'), tf('Status', 'Status')];
    sh.forEach((th, i) => { if (sht[i] !== undefined) th.textContent = sht[i]; });
    setHTML('#recipe-add-ing', PLUS + tf('Add ingredient', 'Tambah bahan'));
    setTx('#recipe-save', tf('Save recipe', 'Simpan resepi'));
    const paxLbl = document.querySelector('#view-bom label span.muted'); if (paxLbl) paxLbl.textContent = tf('Guests (pax)', 'Tetamu (pax)');
    const theads = document.querySelectorAll('#view-bom thead');
    if (theads[0]) { const t = theads[0].querySelectorAll('th'); [tf('Ingredient', 'Bahan'), tf('Needed', 'Perlu'), tf('In stock', 'Ada stok'), tf('Short', 'Kurang'), tf('Status', 'Status')].forEach((x, i) => { if (t[i]) t[i].textContent = x; }); }
    if (theads[1]) { const t = theads[1].querySelectorAll('th'); [tf('Ingredient', 'Bahan'), tf('Qty / 100 pax', 'Qty / 100 pax'), tf('Cost / pax', 'Kos / pax'), ''].forEach((x, i) => { if (t[i]) t[i].textContent = x; }); }
  }

  /* ---- tabs ---- */
  document.querySelectorAll('.inv-tab').forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('.inv-tab').forEach(x => x.classList.toggle('active', x === t));
    const v = t.dataset.view;
    $('#view-stock').hidden = v !== 'stock';
    $('#view-bom').hidden = v !== 'bom';
  }));

  /* ---- wiring ---- */
  $('#bom-pkg').addEventListener('change', () => { renderBom(); renderRecipe(); });
  $('#bom-pax').addEventListener('input', renderBom);
  $('#recipe-save').addEventListener('click', () => { D.saveBom(); renderBom(); S.toast(tf('Recipe saved', 'Resepi disimpan')); });
  $('#recipe-add-ing').addEventListener('click', addIngredientModal);
  $('#q').addEventListener('input', e => { state.q = e.target.value; render(); });
  $('#f-cat').addEventListener('change', e => { state.cat = e.target.value; render(); });
  $('#f-status').addEventListener('change', e => { state.status = e.target.value; render(); });
  $('#export').addEventListener('click', () => S.toast(tf('Stock exported to CSV (demo)', 'Stok dieksport ke CSV (demo)')));
  $('#add-item').addEventListener('click', () => itemModal(null));

  localizeStatic();
  refreshCatFilter();
  render();
  renderBom();
  renderRecipe();
})();
