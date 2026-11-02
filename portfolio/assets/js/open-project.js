/* Opens a project's dashboard, looking for the file in the usual places:
     1. the project's url (projects/<folder>/<file>)
     2. the same folder as this page
     3. the parent folder (where the original dashboards usually live)
   using the file names listed in the project's `files`.

   Existence check: on http(s) a HEAD request; on file:// (opened from a
   drive, where fetch is blocked) the candidate is loaded as a <script>:
   onload means the file exists, onerror means it does not. Dashboards start
   with <!DOCTYPE, which is a syntax error in JavaScript, so nothing in them
   runs; that error is suppressed below. */
(function () {
  'use strict';

  const found = {};

  function candidates(p) {
    const names = p.files || [];
    const list = [p.url]
      .concat(names, names.map((n) => '../' + n), names.map((n) => 'projects/' + n))
      .filter(Boolean);
    return list.filter((u, i) => list.indexOf(u) === i);
  }

  function existsByScript(url) {
    return new Promise((resolve) => {
      const abs = new URL(url, location.href).href;
      // From file:// the error comes back as an opaque "Script error." with no file name.
      // Only script errors (ErrorEvent); the load failure of the <script> itself must reach its onerror.
      const swallow = (e) => {
        if (e instanceof ErrorEvent && (!e.filename || e.filename === abs)) { e.preventDefault(); e.stopImmediatePropagation(); }
      };
      window.addEventListener('error', swallow, true);
      const s = document.createElement('script');
      const done = (ok) => { window.removeEventListener('error', swallow, true); s.remove(); resolve(ok); };
      s.onload = () => done(true);
      s.onerror = () => done(false);
      s.src = abs;
      document.head.appendChild(s);
    });
  }

  async function exists(url) {
    if (location.protocol === 'file:') return existsByScript(url);
    try { return (await fetch(url, { method: 'HEAD', cache: 'no-store' })).ok; } catch (e) { return false; }
  }

  async function locate(p) {
    if (found[p.id]) return found[p.id];
    for (const url of candidates(p)) {
      if (await exists(url)) return (found[p.id] = new URL(url, location.href).href);
    }
    return null;
  }

  function toast(html) {
    let box = document.getElementById('open-project-toast');
    if (!box) {
      box = document.createElement('div');
      box.id = 'open-project-toast';
      box.setAttribute('role', 'alert');
      box.style.cssText = 'position:fixed;left:50%;bottom:72px;transform:translateX(-50%);z-index:1000;max-width:min(640px,calc(100vw - 32px));' +
        'background:#141A2E;color:#fff;border-left:5px solid #F2C46B;border-radius:10px;padding:14px 44px 14px 18px;' +
        'font:14px/1.5 Inter,Segoe UI,Arial,sans-serif;box-shadow:0 12px 32px rgba(0,0,0,.35)';
      document.body.appendChild(box);
    }
    box.innerHTML = html + '<button type="button" aria-label="OK" style="position:absolute;top:8px;right:10px;background:none;border:0;color:#fff;font-size:20px;cursor:pointer">×</button>';
    box.querySelector('button').onclick = () => box.remove();
    clearTimeout(box._t);
    box._t = setTimeout(() => box.remove(), 15000);
  }

  // Opens the tab right away (keeps the click's permission to open it), then
  // points it to the file once found.
  window.openProject = async function (p, text) {
    const tab = window.open('', '_blank');
    const url = await locate(p);
    if (url && tab) {
      tab.opener = null;
      tab.location.href = url;
      return;
    }
    if (tab) tab.close();
    if (url) { window.open(url, '_blank', 'noopener'); return; }
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const file = (p.files && p.files[0]) || p.url.split('/').pop();
    const folder = p.url.slice(0, p.url.lastIndexOf('/') + 1);
    toast(`<strong>${esc(text.title)}</strong><br>${esc(text.body)}<br><code style="color:#A9B8FF">${esc(folder + file)}</code>`);
  };

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-open]');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const p = window.PROJECTS.find((x) => x.id === a.dataset.open);
    if (!p) return;
    e.preventDefault();
    window.openProject(p, window.openProjectText ? window.openProjectText() : { title: 'File not found', body: 'Place the file here, next to this page:' });
  });
})();
