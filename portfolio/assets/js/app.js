(function () {
  'use strict';

  const ICONS = {
    handover: '<path d="M7 7h11l-3-3M17 17H6l3 3"/><path d="M3 12h4M17 12h4"/>',
    warehouse: '<path d="M3 21V9l9-5 9 5v12"/><path d="M7 21v-8h10v8M7 17h10"/>',
    heatmap: '<rect x="3" y="3" width="5" height="5" rx="1"/><rect x="10" y="3" width="5" height="5" rx="1"/><rect x="17" y="3" width="4" height="5" rx="1"/><rect x="3" y="10" width="5" height="5" rx="1"/><rect x="10" y="10" width="5" height="5" rx="1" class="fill"/><rect x="17" y="10" width="4" height="5" rx="1"/><rect x="3" y="17" width="5" height="4" rx="1"/><rect x="10" y="17" width="5" height="4" rx="1"/><rect x="17" y="17" width="4" height="4" rx="1" class="fill"/>',
    truck: '<path d="M2 6h11v10H2zM13 10h4l4 4v2h-8"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    inventory: '<path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
    data: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'
  };
  const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';
  const CODE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/></svg>';

  const state = { lang: 'en', filter: 'all' };
  try {
    const saved = localStorage.getItem('pf_lang');
    if (saved && window.I18N[saved]) state.lang = saved;
  } catch (e) {}

  const $ = (s) => document.querySelector(s);
  const ui = () => window.I18N[state.lang];
  const tr = (v) => (v == null ? '' : typeof v === 'string' || Array.isArray(v) ? v : v[state.lang] ?? v.en);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.data}</svg>`;

  function applyStaticText() {
    document.documentElement.lang = state.lang === 'pt' ? 'pt-BR' : 'en';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const v = ui()[el.dataset.i18n];
      if (typeof v === 'string') el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const v = ui()[el.dataset.i18nTitle];
      el.title = v; el.setAttribute('aria-label', v);
    });
    document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)));
  }

  function renderTeam() {
    $('#team-list').innerHTML = Object.values(window.DEVELOPERS).map((d) => `
      <li><span class="avatar" aria-hidden="true">${esc(d.name.charAt(0))}</span>
        <span><strong>${esc(d.name)}</strong><small>${esc(tr(d.role))}</small></span></li>`).join('');
  }

  function renderFilters() {
    const opts = [['all', ui().filterAll]].concat(Object.entries(window.DEVELOPERS).map(([k, d]) => [k, d.name]));
    $('#filters').innerHTML = opts.map(([k, label]) =>
      `<button type="button" data-filter="${k}" aria-pressed="${state.filter === k}">${esc(label)}</button>`).join('');
  }

  function cardHTML(p) {
    const live = p.status === 'live' && p.url;
    const dev = window.DEVELOPERS[p.developer] || { name: p.developer, role: '' };
    const body = live
      ? `<p class="card-desc">${esc(tr(p.description))}</p>
         ${p.problem ? `<p class="card-problem">${esc(tr(p.problem))}</p>` : ''}`
      : `<p class="card-desc muted">${esc(ui().prepNote)}</p>`;
    const actions = live
      ? `<a class="btn btn-primary" href="${esc(p.url)}" target="_blank" rel="noopener">${esc(ui().open)} ${ARROW}<span class="sr-only"> (${esc(ui().openHint)})</span></a>
         ${p.tech ? `<button type="button" class="btn btn-ghost" data-tech="${esc(p.id)}">${CODE} ${esc(ui().tech)}</button>` : ''}`
      : '';
    return `
      <article class="card ${live ? 'is-live' : 'is-prep'}">
        <div class="card-top">
          <span class="card-icon">${icon(p.icon)}</span>
          <span class="status ${live ? 'status-live' : 'status-prep'}">${esc(live ? ui().statusLive : ui().statusPrep)}</span>
        </div>
        <p class="card-cat">${esc(tr(p.category))}</p>
        <h3 class="card-title">${esc(tr(p.name))}</h3>
        ${body}
        <div class="card-dev">
          <span class="avatar sm" aria-hidden="true">${esc(dev.name.charAt(0))}</span>
          <span><small>${esc(ui().developer)}</small>${esc(dev.name)}${dev.role ? ` · <span class="muted">${esc(tr(dev.role))}</span>` : ''}</span>
        </div>
        ${actions ? `<div class="card-actions">${actions}</div>` : ''}
      </article>`;
  }

  function renderGrid() {
    const list = window.PROJECTS.filter((p) => state.filter === 'all' || p.developer === state.filter);
    $('#grid').innerHTML = list.map(cardHTML).join('');
    const live = list.filter((p) => p.status === 'live' && p.url).length;
    $('#projects-summary').textContent = ui().summary(live, list.length - live);
  }

  function openTech(id) {
    const p = window.PROJECTS.find((x) => x.id === id);
    if (!p || !p.tech) return;
    const labels = ui().techSections;
    $('#tech-title').textContent = tr(p.name);
    $('#tech-body').innerHTML = Object.keys(labels).map((key) => {
      const v = tr(p.tech[key]);
      const content = !v || (Array.isArray(v) && !v.length)
        ? `<p class="muted">${esc(ui().techPending)}</p>`
        : Array.isArray(v) ? `<ul>${v.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : `<p>${esc(v)}</p>`;
      return `<section><h3>${esc(labels[key])}</h3>${content}</section>`;
    }).join('');
    const dlg = $('#tech-dialog');
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  }

  function render() { applyStaticText(); renderTeam(); renderFilters(); renderGrid(); }

  // Events
  document.addEventListener('click', (e) => {
    const lang = e.target.closest('[data-lang]');
    if (lang) {
      state.lang = lang.dataset.lang;
      try { localStorage.setItem('pf_lang', state.lang); } catch (err) {}
      render();
      return;
    }
    const f = e.target.closest('[data-filter]');
    if (f) { state.filter = f.dataset.filter; renderFilters(); renderGrid(); return; }
    const t = e.target.closest('[data-tech]');
    if (t) openTech(t.dataset.tech);
  });

  $('#tech-dialog').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) e.currentTarget.close();
  });

  $('#theme-toggle').addEventListener('click', () => {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('pf_theme', next); } catch (err) {}
  });

  if (window.BRAND_LOGO) {
    const img = $('#brand-logo');
    img.src = window.BRAND_LOGO; img.hidden = false;
  }
  $('#year').textContent = new Date().getFullYear();
  render();
})();
