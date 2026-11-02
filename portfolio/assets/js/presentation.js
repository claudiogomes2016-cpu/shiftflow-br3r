(function () {
  'use strict';

  const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';
  const state = { lang: 'pt', index: 0 };
  try {
    const saved = localStorage.getItem('pf_deck_lang');
    if (saved && window.I18N[saved]) state.lang = saved;
  } catch (e) {}
  const fromHash = parseInt(location.hash.slice(1), 10);
  if (fromHash > 0) state.index = fromHash - 1;

  const $ = (s) => document.querySelector(s);
  const ui = () => window.I18N[state.lang];
  const d = () => ui().deck;
  const tr = (v) => (v == null ? '' : typeof v === 'string' || Array.isArray(v) ? v : v[state.lang] ?? v.en);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const PITCH = window.PITCH || {};
  const projects = () => window.PROJECTS
    .filter((p) => p.status === 'live' && p.url && PITCH[p.id])
    .map((p) => Object.assign({}, p, { pitch: PITCH[p.id] }));

  function banner(b) {
    return `
      <header class="bnr">
        <img class="bnr-badge" src="${esc(window.SITE_BADGE)}" alt="Três Rios">
        <div class="bnr-txt">
          <div class="bnr-title">${esc(b.title)} <span>${esc(b.accent)}</span>${b.after ? ' ' + esc(b.after) : ''}</div>
          <div class="bnr-sub">${esc(b.sub)}</div>
          <div class="bnr-line">${esc(ui().motto)} • PLANTA TRÊS RIOS – BR3R</div>
        </div>
        <div class="bnr-brand">
          <img class="bnr-ball" src="${esc(window.BRAND_LOGO)}" alt="Ball">
          <p class="bnr-tag">LATAS QUE MOVEM<br>UM MUNDO MELHOR</p>
        </div>
      </header>`;
  }

  function foot(n, total, extra) {
    return `<footer class="foot">${extra || '<span></span>'}<span class="pageno">${String(n).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span></footer>`;
  }

  function coverSlide() {
    const devs = Object.values(window.DEVELOPERS).map((x) => `
      <div class="who"><span class="avatar">${esc(x.name.charAt(0))}</span>
        <span><strong>${esc(x.name)}</strong><small>${esc(tr(x.role))}</small></span></div>`).join('');
    return `
      <section class="slide cover">
        <div class="bnr">
          <div class="cover-top">
            <img class="bnr-badge" src="${esc(window.SITE_BADGE)}" alt="Três Rios">
            <div class="bnr-brand">
              <img class="bnr-ball" src="${esc(window.BRAND_LOGO)}" alt="Ball">
              <p class="bnr-tag">LATAS QUE MOVEM<br>UM MUNDO MELHOR</p>
            </div>
          </div>
          <div class="cover-title">
            <p class="kicker">${esc(d().kicker)}</p>
            <h1>LOGISTICS <span>DIGITAL</span><br>INNOVATION</h1>
            <p>${esc(d().coverText)}</p>
          </div>
          <div class="cover-foot">${devs}<span class="line">${esc(ui().motto)}</span></div>
        </div>
      </section>`;
  }

  function overviewSlide(n, total) {
    const cards = projects().map((p) => `
      <div class="mini">
        <div class="mini-bnr"><div class="t">${esc(p.banner.title)} <span>${esc(p.banner.accent)}</span></div><div class="s">${esc(p.banner.sub)}</div></div>
        <div class="mini-body"><p class="eyebrow">${esc(tr(p.category))}</p><p>${esc(tr(p.pitch.purpose))}</p></div>
      </div>`).join('');
    return `
      <section class="slide overview">
        ${banner({ title: 'LOGISTICS', accent: 'DIGITAL', after: 'INNOVATION', sub: d().overviewSub.toUpperCase() })}
        <div class="grid">${cards}</div>
        ${foot(n, total)}
      </section>`;
  }

  function projectSlide(p, n, total) {
    const dev = window.DEVELOPERS[p.developer];
    const items = tr(p.pitch.improved).map((t, i) =>
      `<li><span class="num">${i + 1}</span><span>${esc(t)}</span></li>`).join('');
    const devHtml = `
      <div class="dev"><span class="avatar">${esc(dev.name.charAt(0))}</span>
        <span>${esc(d().developer)} <strong>${esc(dev.name)}</strong> · ${esc(tr(dev.role))}</span>
        <a class="open" href="${esc(p.url)}" target="_blank" rel="noopener" data-open="${esc(p.id)}" style="margin-left:24px">${esc(d().open)} ${ARROW}</a>
      </div>`;
    return `
      <section class="slide${tr(p.pitch.improved).length > 3 ? ' dense' : ''}">
        ${banner(p.banner)}
        <div class="body">
          <div>
            <p class="eyebrow">${esc(tr(p.category))}</p>
            <div class="purpose">
              <p class="label">${esc(d().purpose)}</p>
              <h2>${esc(tr(p.pitch.purpose))}</h2>
            </div>
            <div class="practice">
              <p class="label">${esc(d().practice)}</p>
              <p>“${esc(tr(p.pitch.practice))}”</p>
            </div>
          </div>
          <div class="improved">
            <p class="label">${esc(d().improved)}</p>
            <ol>${items}</ol>
          </div>
        </div>
        ${foot(n, total, devHtml)}
      </section>`;
  }

  function closingSlide(n, total) {
    const steps = d().closingSteps.map((t, i) => `<li><span class="num">${i + 1}</span><span>${esc(t)}</span></li>`).join('');
    return `
      <section class="slide closing">
        ${banner({ title: 'LOGISTICS', accent: 'DIGITAL', after: 'INNOVATION', sub: d().thanks.toUpperCase() })}
        <div class="body">
          <div>
            <p class="eyebrow">${esc(d().closingKicker)}</p>
            <h2>${d().closingTitle}</h2>
            <p class="lead">${esc(d().closingLead)}</p>
          </div>
          <div class="improved"><ol>${steps}</ol></div>
        </div>
        ${foot(n, total)}
      </section>`;
  }

  window.openProjectText = () => ({ title: ui().notFoundTitle, body: ui().notFoundBody });

  function render() {
    document.documentElement.lang = state.lang === 'pt' ? 'pt-BR' : 'en';
    const list = projects();
    const total = list.length + 3;
    let html = coverSlide() + overviewSlide(2, total);
    list.forEach((p, i) => { html += projectSlide(p, i + 3, total); });
    html += closingSlide(total, total);
    $('#deck').innerHTML = html;
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = d()[el.dataset.i18n]; });
    document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)));
    go(state.index);
  }

  function go(i) {
    const slides = document.querySelectorAll('.slide');
    state.index = Math.max(0, Math.min(i, slides.length - 1));
    slides.forEach((s, k) => s.classList.toggle('active', k === state.index));
    $('#counter').textContent = `${state.index + 1} / ${slides.length}`;
    history.replaceState(null, '', '#' + (state.index + 1));
  }

  function fit() {
    const vp = $('#viewport');
    const scale = Math.min(vp.clientWidth / 1600, vp.clientHeight / 900);
    $('#deck').style.transform = `scale(${scale})`;
  }

  document.addEventListener('keydown', (e) => {
    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(state.index + 1); }
    else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); go(state.index - 1); }
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(Infinity);
    else if (e.key === 'f' || e.key === 'F') toggleFullscreen();
  });
  $('#prev').addEventListener('click', () => go(state.index - 1));
  $('#next').addEventListener('click', () => go(state.index + 1));
  $('#fullscreen').addEventListener('click', toggleFullscreen);
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]');
    if (!b) return;
    state.lang = b.dataset.lang;
    try { localStorage.setItem('pf_deck_lang', state.lang); } catch (err) {}
    render();
  });

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  }

  window.addEventListener('resize', fit);
  document.addEventListener('fullscreenchange', () => setTimeout(fit, 50));
  render();
  fit();
})();
