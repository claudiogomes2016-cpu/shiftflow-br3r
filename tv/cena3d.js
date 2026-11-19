/* ═══════════════════════════════════════════════════════════════════════════
   CENA 3D DA DOCA · Shift Flow · Painel da Expedição (Ball Três Rios)
   Empilhadeira de contrapeso (5 t) com operador leva um pallet de latas até a
   porta da carreta baú (ela nunca entra no baú) e sai de ré; o motorista encosta
   a armação de alumínio na carga e empurra o pallet para dentro. Ciclo de 16 s.

   · Three.js (WebGL), carregado só quando o painel abre; nada de vídeo.
   · Tudo modelado em código, em metros, com dimensões reais.
   · Independente dos dados: não lê nem altera nenhum número do painel.
   · Até 30 quadros/s; pausa com a aba oculta ou o painel fechado;
     baixa a qualidade sozinha em aparelho fraco; sem WebGL mostra uma imagem.

   Uso:  Cena3D.montar(elementoDaFaixa, { fallback: 'url-da-imagem' })
   (pode chamar de novo a cada atualização do painel: a cena é reaproveitada)
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.Cena3D) return;
  const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';
  const CICLO = 16;          // segundos por ciclo
  const FPS = 30;

  let host = null, fallbackUrl = '', estado = 'novo', api = null;

  function webglOk() {
    try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); }
    catch (e) { return false; }
  }
  function mostrarImagem() {
    if (!host) return;
    host.classList.add('c3d-img');
    if (fallbackUrl && !host.querySelector('img')) { const i = new Image(); i.alt = ''; i.src = fallbackUrl; host.appendChild(i); }
    const cv = host.querySelector('canvas'); if (cv) cv.style.display = 'none';
  }

  function montar(slot, opts) {
    if (!slot) return;
    if (opts && opts.fallback) fallbackUrl = opts.fallback;
    if (!host) { host = document.createElement('div'); host.className = 'c3d'; host.setAttribute('aria-hidden', 'true'); }
    if (host.parentNode !== slot) slot.appendChild(host);
    if (fallbackUrl && estado !== 'ok') host.style.backgroundImage = 'url("' + fallbackUrl + '")';   // imagem enquanto a cena carrega
    if (estado !== 'novo') { api && api.resize(); return; }
    const reduzir = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!webglOk()) { estado = 'imagem'; mostrarImagem(); return; }
    estado = 'carregando';
    import(THREE_URL).then(T => {
      try { api = construir(T, host, { parado: reduzir }); estado = 'ok'; host.style.backgroundImage = ''; }
      catch (e) { console.warn('[cena3d]', e); estado = 'imagem'; mostrarImagem(); }
    }).catch(() => { estado = 'imagem'; mostrarImagem(); });
  }
  window.Cena3D = { montar, imagem: mostrarImagem };

  // ═════════════════════════════════════════════════════════════════════════
  function construir(THREE, host, cfg) {
    const nucleos = navigator.hardwareConcurrency || 4;
    const movel = /Android|iPhone|iPad|Mobile|SmartTV|Tizen|Web0S|BRAVIA|AFT/i.test(navigator.userAgent);
    let Q = (movel || nucleos <= 4) ? 0 : 1;           // 1 = qualidade alta · 0 = leve

    const canvas = document.createElement('canvas');
    host.appendChild(canvas);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    let pr = Math.min(window.devicePixelRatio || 1, Q ? 2 : 1.25);
    renderer.setPixelRatio(pr);

    const scene = new THREE.Scene();
    const NEVOA = 0x0b1630;
    scene.background = new THREE.Color(NEVOA);
    scene.fog = new THREE.Fog(NEVOA, 26, 70);

    // ── ambiente para reflexos (sala com painéis de luz, como um galpão) ──
    {
      const pm = new THREE.PMREMGenerator(renderer);
      const env = new THREE.Scene();
      const sala = new THREE.Mesh(new THREE.BoxGeometry(30, 12, 30), new THREE.MeshStandardMaterial({ color: 0x3a4250, side: THREE.BackSide, roughness: 1 }));
      sala.position.y = 5; env.add(sala);
      const luz = (w, h, d, x, y, z, k, cor) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ color: new THREE.Color(cor || 0xffffff).multiplyScalar(k) })); m.position.set(x, y, z); env.add(m); };
      for (let i = -2; i <= 2; i++) luz(1.2, 0.1, 9, i * 4.5, 10.8, 0, 7);
      luz(0.1, 4, 12, -14.8, 4, 0, 2.2, 0x9fb8ff);
      luz(0.1, 4, 12, 14.8, 4, 0, 3.0, 0xffe2b8);
      luz(12, 3, 0.1, 0, 5, 14.8, 2.0);
      luz(30, 0.1, 30, 0, -0.9, 0, 0.25, 0x404850);
      scene.environment = pm.fromScene(env, 0.035).texture;
      pm.dispose();
    }

    // ── texturas feitas em canvas ──
    function tex(w, h, desenhar, rep, cor = true) {
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      desenhar(c.getContext('2d'), w, h);
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      if (rep) t.repeat.set(rep[0], rep[1]);
      if (cor) t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      return t;
    }
    let semente = 7;
    const rnd = () => (semente = (semente * 16807) % 2147483647) / 2147483647;
    function ruido(g, w, h, base, amp, n, tam) {
      g.fillStyle = base; g.fillRect(0, 0, w, h);
      for (let i = 0; i < n; i++) {
        const v = Math.floor((rnd() - 0.5) * amp);
        g.fillStyle = `rgba(${v > 0 ? 255 : 0},${v > 0 ? 255 : 0},${v > 0 ? 255 : 0},${Math.abs(v) / 255})`;
        const s = tam * (0.3 + rnd());
        g.fillRect(rnd() * w, rnd() * h, s, s);
      }
    }
    const T = {
      concreto: tex(512, 512, (g, w, h) => {
        ruido(g, w, h, '#8d8f8f', 34, 9000, 3);
        for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(40,38,34,${0.03 + rnd() * 0.05})`; g.beginPath(); g.ellipse(rnd() * w, rnd() * h, 20 + rnd() * 70, 10 + rnd() * 40, rnd() * 3, 0, 7); g.fill(); }
        g.strokeStyle = 'rgba(30,30,30,.35)'; g.lineWidth = 2; g.strokeRect(0, 0, w, h);      // junta de dilatação
      }, [1, 1]),
      asfalto: tex(512, 512, (g, w, h) => { ruido(g, w, h, '#2b2d30', 40, 14000, 2); for (let i = 0; i < 12; i++) { g.fillStyle = `rgba(0,0,0,${0.05 + rnd() * 0.08})`; g.beginPath(); g.ellipse(rnd() * w, rnd() * h, 30 + rnd() * 90, 15 + rnd() * 40, rnd() * 3, 0, 7); g.fill(); } }, [1, 1]),
      chapa: tex(256, 256, (g, w, h) => {      // chapa xadrez do nivelador
        g.fillStyle = '#6f757b'; g.fillRect(0, 0, w, h);
        for (let y = 0; y < h; y += 32) for (let x = 0; x < w; x += 32) {
          const o = ((y / 32) % 2) * 16;
          g.save(); g.translate(x + o + 8, y + 8); g.rotate(((x / 32 + y / 32) % 2) ? 0.785 : -0.785);
          g.fillStyle = '#9aa1a8'; g.fillRect(-9, -2, 18, 4); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(-9, 2, 18, 1.5); g.restore();
        }
      }, [3, 3]),
      zebra: tex(256, 32, (g, w, h) => { g.fillStyle = '#111'; g.fillRect(0, 0, w, h); g.fillStyle = '#f2b705'; for (let x = -32; x < w + 32; x += 32) { g.beginPath(); g.moveTo(x, h); g.lineTo(x + 16, h); g.lineTo(x + 32, 0); g.lineTo(x + 16, 0); g.fill(); } }, [1, 1]),
      parede: tex(512, 256, (g, w, h) => {     // telha trapezoidal do galpão
        g.fillStyle = '#7c8794'; g.fillRect(0, 0, w, h);
        for (let x = 0; x < w; x += 32) { const gr = g.createLinearGradient(x, 0, x + 32, 0); gr.addColorStop(0, '#5d6772'); gr.addColorStop(.2, '#9aa5b1'); gr.addColorStop(.55, '#86919d'); gr.addColorStop(.8, '#6a7480'); gr.addColorStop(1, '#5d6772'); g.fillStyle = gr; g.fillRect(x, 0, 32, h); }
        g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(0, h - 3, w, 3);
      }, [6, 1]),
      bau: tex(1024, 256, (g, w, h) => {        // lateral da carreta: painel de alumínio com montantes
        const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#f4f6f8'); gr.addColorStop(1, '#d9dde2'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        for (let x = 8; x < w; x += 42) { g.fillStyle = 'rgba(0,0,0,.10)'; g.fillRect(x, 0, 3, h); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(x + 3, 0, 2, h); }
        for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(90,80,60,${rnd() * 0.04})`; g.fillRect(rnd() * w, h * (0.6 + rnd() * 0.4), 30 + rnd() * 80, 4 + rnd() * 18); }
      }, [1, 1]),
      faixa: tex(128, 16, (g, w, h) => { for (let x = 0; x < w; x += 32) { g.fillStyle = (x / 32) % 2 ? '#f1f1f1' : '#d0161f'; g.fillRect(x, 0, 32, h); } }, [1, 1]),
      piso: tex(256, 256, (g, w, h) => { g.fillStyle = '#4a3a2c'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 21) { g.fillStyle = `rgba(${rnd() > .5 ? '255,220,170' : '0,0,0'},${0.04 + rnd() * 0.07})`; g.fillRect(x, 0, 20, h); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(x + 20, 0, 1, h); } }, [1, 1]),
      corrente: tex(32, 128, (g, w, h) => { g.clearRect(0, 0, w, h); for (let y = 0; y < h; y += 16) { g.fillStyle = '#2a2c30'; g.fillRect(4, y + 1, 24, 14); g.fillStyle = '#7d838b'; g.fillRect(7, y + 3, 6, 10); g.fillRect(19, y + 3, 6, 10); g.fillStyle = '#b8bec6'; g.beginPath(); g.arc(16, y + 8, 3, 0, 7); g.fill(); } }, [1, 30]),
      banda: tex(64, 512, (g, w, h) => { g.fillStyle = '#111'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 16) { g.fillStyle = '#2b2b2b'; g.fillRect(0, y, w, 9); g.fillStyle = '#060606'; g.fillRect(w * 0.45, y + 9, w * 0.1, 7); } }, [1, 1], false),
      ball: tex(512, 256, (g, w, h) => {
        g.clearRect(0, 0, w, h);
        g.fillStyle = '#1f3fa0'; g.font = 'italic 700 150px Georgia, "Times New Roman", serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText('Ball', w / 2, h / 2 + 6);
      }, [1, 1]),
      etiqueta: tex(256, 160, (g, w, h) => {
        g.fillStyle = '#fbfbf7'; g.fillRect(0, 0, w, h);
        g.fillStyle = '#1f3fa0'; g.font = 'italic 700 64px Georgia, serif'; g.textAlign = 'left'; g.fillText('Ball', 16, 66);
        g.fillStyle = '#333'; g.font = '600 15px Arial'; g.fillText('BEVERAGE PACKAGING', 16, 92); g.fillText('TRÊS RIOS · BR3R', 16, 112);
        for (let x = 16; x < 240; x += 4) { g.fillRect(x, 124, (x * 7) % 3 + 1, 26); }
      }, [1, 1]),
    };
    T.concreto.repeat.set(4, 4);
    T.asfalto.repeat.set(10, 10);

    // ── materiais ──
    const fis = (o) => new THREE.MeshPhysicalMaterial(o);
    const std = (o) => new THREE.MeshStandardMaterial(o);
    const MT = {
      vermelho: fis({ color: 0xb3121b, metalness: 0.35, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.08 }),
      grafite: std({ color: 0x24272c, metalness: 0.6, roughness: 0.45 }),
      preto: std({ color: 0x111214, metalness: 0.3, roughness: 0.55 }),
      aco: std({ color: 0x3b3f45, metalness: 0.85, roughness: 0.38 }),
      cromo: std({ color: 0xe8ecf0, metalness: 1, roughness: 0.08 }),
      aluminio: std({ color: 0xc9ced4, metalness: 1, roughness: 0.28 }),
      borracha: std({ color: 0x0d0d0e, metalness: 0, roughness: 0.92, bumpMap: T.banda, bumpScale: 0.6 }),
      pneuLiso: std({ color: 0x101011, metalness: 0, roughness: 0.85 }),
      aroVerm: std({ color: 0x9e1118, metalness: 0.5, roughness: 0.4 }),
      assento: std({ color: 0x1a1b1d, roughness: 0.7, metalness: 0 }),
      vidro: fis({ color: 0x0b1420, metalness: 0.2, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.02 }),
      farol: std({ color: 0xffffff, emissive: 0xfff4d8, emissiveIntensity: 2.2, roughness: 0.2 }),
      lanterna: std({ color: 0x400000, emissive: 0xff1a1a, emissiveIntensity: 1.6 }),
      ambar: std({ color: 0x402000, emissive: 0xff9a1a, emissiveIntensity: 1.8 }),
      giroflex: std({ color: 0x3a2000, emissive: 0xff8c00, emissiveIntensity: 0.4, transparent: true, opacity: 0.92 }),
      tela: std({ color: 0x0a2040, emissive: 0x3d8cff, emissiveIntensity: 0.9 }),
      branco: fis({ color: 0xf1f3f5, metalness: 0.1, roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.15 }),
      bau: std({ map: T.bau, metalness: 0.15, roughness: 0.42 }),
      bauLiso: std({ color: 0xe3e6ea, metalness: 0.2, roughness: 0.45 }),
      interior: std({ color: 0x6d7076, metalness: 0.3, roughness: 0.7 }),
      piso: std({ map: T.piso, roughness: 0.8 }),
      faixa: std({ map: T.faixa, roughness: 0.3, emissive: 0x220000, emissiveIntensity: 0.4 }),
      concreto: std({ map: T.concreto, roughness: 0.88, metalness: 0 }),
      concretoLat: std({ color: 0x7f8282, roughness: 0.9 }),
      asfalto: std({ map: T.asfalto, roughness: 0.95 }),
      chapa: std({ map: T.chapa, metalness: 0.7, roughness: 0.45 }),
      zebra: std({ map: T.zebra, roughness: 0.6 }),
      parede: std({ map: T.parede, metalness: 0.5, roughness: 0.5 }),
      amareloPiso: std({ color: 0xe0a400, roughness: 0.7 }),
      madeira: std({ color: 0x1c1d20, roughness: 0.55, metalness: 0.05 }),
      madeiraEsc: std({ color: 0x141517, roughness: 0.6 }),
      lata: std({ color: 0xd9dee4, metalness: 1, roughness: 0.22 }),
      lataTopo: std({ color: 0xb8bec6, metalness: 1, roughness: 0.3 }),
      papelao: std({ color: 0xb59266, roughness: 0.95 }),
      quadro: std({ color: 0x2e5aa8, roughness: 0.55, metalness: 0.05 }),
      cinta: std({ color: 0x2f9a3c, roughness: 0.45 }),
      filme: fis({ color: 0xdfe9f2, metalness: 0, roughness: 0.12, transparent: true, opacity: 0.2, clearcoat: 1, clearcoatRoughness: 0.05, depthWrite: false, side: THREE.DoubleSide }),
      etiqueta: std({ map: T.etiqueta, roughness: 0.6 }),
      ball: std({ map: T.ball, transparent: true, roughness: 0.4, depthWrite: false }),
      uniforme: std({ color: 0x1c2a4a, roughness: 0.85 }),
      calca: std({ color: 0x182238, roughness: 0.9 }),
      refletivo: std({ color: 0xd8dde3, roughness: 0.25, metalness: 0.4, emissive: 0x555a60, emissiveIntensity: 0.6 }),
      pele: std({ color: 0xb07a55, roughness: 0.6 }),
      capacete: fis({ color: 0xf4f4f0, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.1 }),
      luva: std({ color: 0x5b5f66, roughness: 0.8 }),
      bota: std({ color: 0x141414, roughness: 0.6 }),
      oculos: fis({ color: 0x101820, roughness: 0.05, metalness: 0.5, clearcoat: 1 }),
      luzTeto: new THREE.MeshBasicMaterial({ color: new THREE.Color(0xfff6e8).multiplyScalar(2.2) }),
      luzPoste: new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffc98a).multiplyScalar(2.5) }),
      bluespot: new THREE.MeshBasicMaterial({ color: 0x2f6bff, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }),
    };

    // ── utilitários de modelagem ──
    function add(geo, mat, pai, x = 0, y = 0, z = 0, sombra = true) {
      const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z);
      m.castShadow = sombra; m.receiveShadow = true; if (pai) pai.add(m); return m;
    }
    const caixa = (w, h, d) => new THREE.BoxGeometry(w, h, d);
    function cxR(w, h, d, b = 0.03, rc = 0) {           // caixa com arestas arredondadas
      b = Math.max(0.002, Math.min(b, w / 2 - 0.002, h / 2 - 0.002, d / 2 - 0.002));
      const iw = w - 2 * b, ih = h - 2 * b; rc = Math.min(rc, iw / 2, ih / 2);
      const s = new THREE.Shape(), x0 = -iw / 2, y0 = -ih / 2;
      if (rc > 0) {
        s.moveTo(x0 + rc, y0); s.lineTo(x0 + iw - rc, y0); s.quadraticCurveTo(x0 + iw, y0, x0 + iw, y0 + rc);
        s.lineTo(x0 + iw, y0 + ih - rc); s.quadraticCurveTo(x0 + iw, y0 + ih, x0 + iw - rc, y0 + ih);
        s.lineTo(x0 + rc, y0 + ih); s.quadraticCurveTo(x0, y0 + ih, x0, y0 + ih - rc);
        s.lineTo(x0, y0 + rc); s.quadraticCurveTo(x0, y0, x0 + rc, y0);
      } else { s.moveTo(x0, y0); s.lineTo(x0 + iw, y0); s.lineTo(x0 + iw, y0 + ih); s.lineTo(x0, y0 + ih); s.lineTo(x0, y0); }
      const dep = Math.max(0.001, d - 2 * b);
      const g = new THREE.ExtrudeGeometry(s, { depth: dep, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 3, curveSegments: 5 });
      g.translate(0, 0, -dep / 2);
      return g;
    }
    function perfil(pts, larg, b = 0.02) {               // extrusão de um perfil lateral (x,y) na largura z
      const s = new THREE.Shape(); s.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        if (p.length === 4) s.quadraticCurveTo(p[0], p[1], p[2], p[3]); else s.lineTo(p[0], p[1]);
      }
      const dep = Math.max(0.001, larg - 2 * b);
      const g = new THREE.ExtrudeGeometry(s, { depth: dep, bevelEnabled: b > 0, bevelThickness: b, bevelSize: b, bevelSegments: 3, curveSegments: 10 });
      g.translate(0, 0, -dep / 2);
      return g;
    }
    function cil(r1, r2, h, seg = 16, eixo = 'y', aberto = false) {
      const g = new THREE.CylinderGeometry(r1, r2, h, seg, 1, aberto);
      if (eixo === 'z') g.rotateX(Math.PI / 2); else if (eixo === 'x') g.rotateZ(Math.PI / 2);
      return g;
    }
    const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0);
    function haste(a, b, r, mat, pai, seg = 10, capsula = false) {   // cilindro entre dois pontos
      _a.set(...a); _b.set(...b);
      const len = _a.distanceTo(_b);
      const g = capsula ? new THREE.CapsuleGeometry(r, Math.max(0.001, len), 4, seg) : new THREE.CylinderGeometry(r, r, len, seg);
      const m = add(g, mat, pai, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
      m.quaternion.setFromUnitVectors(_up, _b.clone().sub(_a).normalize());
      return m;
    }
    function pneu(r, larg, rAro, matPneu, matAro, opts = {}) {   // roda completa, eixo em z
      const g = new THREE.Group();
      const c = Math.min(0.045, larg * 0.22);
      const pts = [[rAro, -larg / 2], [r - c, -larg / 2], [r - c * 0.25, -larg / 2 + c * 0.3], [r, -larg / 2 + c], [r, larg / 2 - c], [r - c * 0.25, larg / 2 - c * 0.3], [r - c, larg / 2], [rAro, larg / 2]]
        .map(p => new THREE.Vector2(p[0], p[1]));
      const tg = new THREE.LatheGeometry(pts, Q ? 40 : 26); tg.rotateX(Math.PI / 2);
      add(tg, matPneu, g);
      const aro = add(cil(rAro, rAro, larg * 0.92, 24, 'z'), matAro, g);
      const fx = opts.lado || 1;
      add(cil(rAro * 0.86, rAro * 0.86, 0.01, 24, 'z'), opts.matDisco || MT.aco, g, 0, 0, fx * larg * 0.47);
      add(cil(rAro * 0.32, rAro * 0.38, 0.07, 16, 'z'), opts.matCubo || MT.cromo, g, 0, 0, fx * (larg * 0.47 + 0.03));
      const nP = opts.parafusos || 8;
      for (let i = 0; i < nP; i++) { const a = i / nP * Math.PI * 2; add(cil(0.012, 0.012, 0.03, 6, 'z'), MT.cromo, g, Math.cos(a) * rAro * 0.52, Math.sin(a) * rAro * 0.52, fx * (larg * 0.47 + 0.012), false); }
      if (opts.furos) for (let i = 0; i < 6; i++) { const a = (i + 0.5) / 6 * Math.PI * 2; add(cil(rAro * 0.12, rAro * 0.12, 0.012, 10, 'z'), MT.preto, g, Math.cos(a) * rAro * 0.7, Math.sin(a) * rAro * 0.7, fx * larg * 0.475, false); }
      return g;
    }

    const cena = new THREE.Group(); scene.add(cena);
    const PISO = 0, CHAO = -1.25;      // piso da doca = piso da carreta · pátio 1,25 m abaixo

    // ═════════════ DOCA, GALPÃO E PÁTIO ═════════════
    const amb = new THREE.Group(); cena.add(amb);
    {
      // pátio (asfalto) com faixas de manobra
      const asf = add(new THREE.PlaneGeometry(120, 80), MT.asfalto, amb, -40, CHAO, 0, false); asf.rotation.x = -Math.PI / 2;
      for (const z of [-2.1, 2.1, -6.3]) { const f = add(new THREE.PlaneGeometry(22, 0.12), MT.amareloPiso, amb, -11, CHAO + 0.005, z, false); f.rotation.x = -Math.PI / 2; }
      // plataforma de concreto
      const plat = add(caixa(18, 1.25, 13), MT.concretoLat, amb, 9.15, CHAO / 2, -0.5);
      plat.receiveShadow = true;
      const topo = add(new THREE.PlaneGeometry(18, 13), MT.concreto, amb, 9.15, PISO + 0.002, -0.5, false); topo.rotation.x = -Math.PI / 2;
      T.concreto.repeat.set(4.5, 3.2);
      // faixa zebrada na borda e faixa amarela de pedestre
      for (const [z0, z1] of [[-6.95, -5.3], [-3.1, -1.1], [1.1, 5.7]]) {
        const tz = T.zebra.clone(); tz.needsUpdate = true; tz.repeat.set((z1 - z0) / 0.5, 1);
        const f = add(new THREE.PlaneGeometry(z1 - z0, 0.25), std({ map: tz, roughness: 0.6 }), amb, 0.3, PISO + 0.004, (z0 + z1) / 2, false); f.rotation.x = -Math.PI / 2; f.rotation.z = Math.PI / 2;
      }
      for (const z of [3.2]) { const f = add(new THREE.PlaneGeometry(14, 0.1), MT.amareloPiso, amb, 8.5, PISO + 0.004, z, false); f.rotation.x = -Math.PI / 2; }
      // niveladores de doca (chapa xadrez) com lábio sobre o piso da carreta
      for (const z of [0, -4.2]) {
        add(caixa(1.9, 0.04, 2.1), MT.chapa, amb, 1.1, PISO - 0.015, z, false);
        const labio = add(caixa(0.27, 0.025, 2.1), MT.chapa, amb, 0.015, PISO + 0.012, z, false); labio.rotation.z = -0.03;
        // batentes de borracha
        for (const s of [-1, 1]) { add(cxR(0.14, 0.42, 0.26, 0.02), MT.preto, amb, 0.08, -0.33, z + s * 1.18); add(caixa(0.02, 0.5, 0.36), MT.aco, amb, 0.155, -0.33, z + s * 1.18); }
      }
      // parede do galpão ao fundo, com portas de enrolar e janelas altas
      const pw = add(caixa(30, 8.5, 0.3), MT.parede, amb, 14.6, 4.0, -7.0); pw.material = MT.parede; T.parede.repeat.set(12, 1);
      for (const x of [5.5, 11.5]) {
        add(caixa(3.4, 4.2, 0.08), std({ color: 0x9aa3ad, metalness: 0.6, roughness: 0.4 }), amb, x, 2.1, -6.82);
        for (let y = 0.3; y < 4.2; y += 0.28) add(caixa(3.4, 0.02, 0.02), MT.aco, amb, x, y, -6.77, false);
        add(caixa(3.7, 0.18, 0.2), MT.amareloPiso, amb, x, 4.3, -6.78);
      }
      for (let x = 2; x < 28; x += 3.2) add(caixa(2.2, 0.7, 0.05), std({ color: 0x1a2a44, emissive: 0x2a3f66, emissiveIntensity: 0.6, roughness: 0.1, metalness: 0.4 }), amb, x, 6.6, -6.83, false);
      // cobertura metálica sobre a plataforma, com luminárias LED
      add(caixa(32, 0.25, 11), MT.grafite, amb, 13, 7.0, -1.6, false);
      for (let x = -1.5; x < 28; x += 4) for (const z of [-4.5, -0.5, 3.0]) add(caixa(1.3, 0.06, 0.32), MT.luzTeto, amb, x, 6.84, z, false);
      // pilares de concreto atrás (longe da câmera)
      for (const x of [3.2, 9.2, 15.2]) add(caixa(0.4, 7, 0.4), MT.concretoLat, amb, x, 3.5, -6.6);
      // postes de luz do pátio (ao longe)
      for (const [x, z] of [[-16, 9], [-34, 9], [-26, -11]]) {
        add(cil(0.08, 0.12, 10, 8), MT.grafite, amb, x, CHAO + 5, z, false);
        add(caixa(0.9, 0.12, 0.35), MT.luzPoste, amb, x + 0.4, CHAO + 10, z, false);
      }
      // cerca e silhueta de vegetação ao fundo
      const cerca = std({ color: 0x232b38, roughness: 0.9 });
      add(caixa(0.05, 2.2, 60), cerca, amb, -48, CHAO + 1.1, 0, false);
      for (let i = 0; i < 18; i++) { const r = 2 + rnd() * 2.5; add(new THREE.SphereGeometry(r, 10, 8), std({ color: 0x0f1a14, roughness: 1 }), amb, -54 - rnd() * 6, CHAO + r * 0.9, -30 + i * 3.6, false); }
    }

    // ═════════════ CARRETA BAÚ (3 eixos) ═════════════
    const COMP = 14.8, LARG = 2.6, ALT_INT = 2.7;
    function carreta(abertas, semCavalo) {
      const g = new THREE.Group();
      const x0 = 0, x1 = -COMP, xm = (x0 + x1) / 2;
      const esp = 0.05, h = ALT_INT + 0.12;
      // laterais (montantes na textura), teto e frente
      for (const s of [-1, 1]) {
        const lat = add(caixa(COMP - 0.16, h, esp), MT.bau, g, xm - 0.08, h / 2, s * (LARG / 2 - esp / 2));
        if (s < 0) lat.material = MT.bauLiso;
        // longarinas superior e inferior
        add(caixa(COMP, 0.1, 0.07), MT.aluminio, g, xm, h - 0.05, s * (LARG / 2 + 0.005));
        add(caixa(COMP, 0.16, 0.09), MT.aluminio, g, xm, -0.02, s * (LARG / 2 + 0.01));
        // faixa refletiva (padrão brasileiro)
        const f = add(new THREE.PlaneGeometry(COMP - 0.6, 0.05), MT.faixa, g, xm, 0.1, s * (LARG / 2 + 0.002), false); if (s < 0) f.rotation.y = Math.PI;
        T.faixa.repeat.set(30, 1);
        // revestimento interno
        add(caixa(COMP - 0.2, ALT_INT, 0.02), MT.interior, g, xm - 0.1, ALT_INT / 2, s * (LARG / 2 - esp - 0.01), false);
      }
      add(caixa(COMP, 0.06, LARG), MT.bauLiso, g, xm, h + 0.0, 0);
      add(caixa(COMP - 0.2, 0.02, LARG - 0.12), MT.interior, g, xm - 0.1, ALT_INT, 0, false);
      add(caixa(0.06, h, LARG), MT.bauLiso, g, x1 + 0.03, h / 2, 0);
      // assoalho
      add(caixa(COMP - 0.1, 0.06, LARG - 0.1), MT.piso, g, xm - 0.05, -0.03, 0, false);
      // quadro traseiro (colunas e travessa) — a boca de carga
      for (const s of [-1, 1]) add(cxR(0.12, h + 0.05, 0.12, 0.01), MT.aluminio, g, -0.06, h / 2, s * (LARG / 2 - 0.06));
      add(cxR(0.12, 0.16, LARG, 0.01), MT.aluminio, g, -0.06, h - 0.02, 0);
      add(cxR(0.14, 0.14, LARG, 0.01), MT.aco, g, -0.07, -0.08, 0);
      // portas traseiras: abertas = giradas 270° e encostadas nas laterais
      for (const s of [-1, 1]) {
        const p = new THREE.Group(); g.add(p);
        const largP = LARG / 2 - 0.02;
        add(caixa(largP, h - 0.04, 0.05), MT.bauLiso, p, -largP / 2, h / 2, 0);
        for (const k of [0.22, 0.78]) { add(cil(0.016, 0.016, h - 0.1, 8), MT.cromo, p, -largP * k, h / 2, s * 0.04); for (const y of [0.4, 1.4, 2.4]) add(caixa(0.05, 0.04, 0.04), MT.cromo, p, -largP * k, y, s * 0.04, false); }
        for (const y of [0.3, 1.4, 2.5]) add(caixa(0.16, 0.06, 0.03), MT.aco, p, -0.06, y, s * 0.03, false);
        if (abertas) p.position.set(0.0, 0, s * (LARG / 2 + 0.085));
        else { p.position.set(0.03, 0, s * (LARG / 2 - 0.02)); p.rotation.y = -s * Math.PI / 2; }
      }
      // chassi: longarinas, pino-rei, pés de apoio
      for (const s of [-0.45, 0.45]) add(caixa(11.7, 0.32, 0.12), MT.grafite, g, -6.15, -0.3, s);
      for (let x = -0.8; x > -12; x -= 1.2) add(caixa(0.08, 0.12, LARG - 0.2), MT.grafite, g, x, -0.12, 0, false);
      add(caixa(2.6, 0.04, 2.2), MT.aco, g, -13.4, -0.08, 0);
      const pe = semCavalo ? 1.12 : 0.85;
      for (const s of [-1, 1]) {
        add(caixa(0.12, pe, 0.12), MT.aco, g, -11.6, -0.175 - pe / 2, s * 0.95);
        add(caixa(0.3, 0.06, 0.3), MT.aco, g, -11.6, -0.2 - pe, s * 0.95);
        add(caixa(0.12, 0.12, 0.6), MT.preto, g, -11.6, -0.4, s * 0.8);
      }
      // para-choque traseiro (com faixa refletiva) e lanternas
      add(caixa(0.14, 0.16, LARG - 0.25), MT.aco, g, -0.25, -0.78, 0);
      const pf = add(new THREE.PlaneGeometry(LARG - 0.3, 0.1), MT.faixa, g, -0.17, -0.78, 0, false); pf.rotation.y = Math.PI / 2;
      for (const s of [-1, 1]) { add(caixa(0.12, 0.62, 0.08), MT.aco, g, -0.4, -0.45, s * 0.75); add(caixa(0.05, 0.08, 0.22), MT.lanterna, g, -0.16, -0.62, s * 0.95, false); add(caixa(0.05, 0.06, 0.1), MT.ambar, g, -0.16, -0.62, s * 0.75, false); }
      // eixos traseiros com rodado duplo
      const rodas = [];
      for (const ex of [-2.0, -3.32, -4.64]) {
        add(cil(0.07, 0.07, LARG - 0.35, 10, 'z'), MT.grafite, g, ex, -0.73, 0);
        for (const s of [-1, 1]) for (const k of [0, 1]) {
          const r = pneu(0.53, 0.28, 0.29, MT.borracha, MT.aluminio, { lado: s, furos: true, parafusos: 10, matDisco: MT.aluminio });
          r.position.set(ex, CHAO + 0.53, s * (LARG / 2 - 0.16 - k * 0.3)); g.add(r); rodas.push(r);
        }
        // suspensão
        for (const s of [-1, 1]) add(caixa(1.0, 0.08, 0.1), MT.preto, g, ex, -0.55, s * 0.45);
      }
      // para-lamas e protetor lateral
      for (const s of [-1, 1]) {
        add(caixa(4.0, 0.04, 0.68), MT.preto, g, -3.32, -0.12, s * 1.0);
        add(caixa(0.02, 0.5, 0.62), MT.preto, g, -5.25, -0.48, s * 1.0);
        for (const y of [-0.45, -0.75]) add(caixa(5.4, 0.08, 0.04), MT.aluminio, g, -8.2, y, s * 1.12);
      }
      // caixa de ferramentas e estepe
      add(cxR(0.8, 0.5, 0.5, 0.02), MT.preto, g, -7.2, -0.42, 0.95);
      const est = pneu(0.53, 0.28, 0.29, MT.pneuLiso, MT.aluminio, { lado: -1 }); est.rotation.x = Math.PI / 2; est.position.set(-9.6, -0.75, 0); g.add(est);
      // marca discreta na lateral visível
      const logo = add(new THREE.PlaneGeometry(1.5, 0.75), MT.ball, g, -10.6, 1.95, LARG / 2 + 0.006, false);
      logo.renderOrder = 2;
      g.userData.rodas = rodas;
      return g;
    }
    const car1 = carreta(true); cena.add(car1);
    const car2 = carreta(true, true); car2.position.z = -4.2; cena.add(car2);

    // ═════════════ CAVALO MECÂNICO (6x2, cabine avançada) ═════════════
    let cavalo;
    {
      const cv = new THREE.Group(); cena.add(cv); cavalo = cv;
      const y0 = CHAO;
      const xc = -17.6;    // centro da cabine
      // chassi
      for (const s of [-0.45, 0.45]) add(caixa(7.2, 0.28, 0.1), MT.grafite, cv, -15.3, y0 + 0.95, s);
      // quinta roda
      add(cxR(1.1, 0.12, 1.4, 0.03), MT.preto, cv, -13.4, y0 + 1.1, 0);
      // cabine
      add(cxR(2.3, 2.45, 2.5, 0.12, 0.05), MT.branco, cv, xc, y0 + 2.5, 0);
      add(cxR(1.8, 0.55, 2.42, 0.12, 0.15), MT.branco, cv, xc + 0.2, y0 + 3.95, 0);    // teto alto
      add(cxR(0.06, 0.45, 2.1, 0.02), MT.branco, cv, xc + 1.12, y0 + 4.1, 0);          // defletor
      // para-brisa, janelas e portas
      add(cxR(0.06, 1.0, 2.3, 0.02), MT.vidro, cv, xc - 1.16, y0 + 3.05, 0, false);
      for (const s of [-1, 1]) {
        const jan = add(new THREE.PlaneGeometry(0.9, 0.75), MT.vidro, cv, xc - 0.55, y0 + 3.1, s * 1.252, false); if (s < 0) jan.rotation.y = Math.PI;
        add(caixa(1.25, 0.012, 0.012), MT.preto, cv, xc - 0.45, y0 + 1.72, s * 1.255, false);
        add(caixa(0.012, 1.95, 0.012), MT.preto, cv, xc + 0.18, y0 + 2.62, s * 1.255, false);
        add(caixa(0.18, 0.04, 0.03), MT.cromo, cv, xc + 0.02, y0 + 2.35, s * 1.27, false);
        // espelhos
        haste([xc - 1.1, y0 + 3.3, s * 1.25], [xc - 1.25, y0 + 3.3, s * 1.45], 0.015, MT.preto, cv, 6);
        add(cxR(0.1, 0.45, 0.24, 0.02), MT.preto, cv, xc - 1.28, y0 + 3.15, s * 1.52);
        // degraus
        for (const y of [0.55, 0.95]) add(caixa(0.4, 0.04, 0.22), MT.aluminio, cv, xc - 0.65, y0 + y, s * 1.12, false);
        // para-lamas dianteiros
        add(cxR(1.25, 0.06, 0.4, 0.02), MT.preto, cv, -17.9, y0 + 1.15, s * 1.05);
      }
      // grade, faróis e para-choque
      add(caixa(0.05, 0.75, 1.6), MT.preto, cv, xc - 1.17, y0 + 1.95, 0);
      for (let y = 1.7; y < 2.3; y += 0.12) add(caixa(0.06, 0.03, 1.55), MT.grafite, cv, xc - 1.18, y0 + y, 0, false);
      add(cxR(0.3, 0.4, 2.5, 0.05), MT.grafite, cv, xc - 1.1, y0 + 1.15, 0);
      for (const s of [-1, 1]) add(caixa(0.05, 0.12, 0.38), MT.farol, cv, xc - 1.26, y0 + 1.2, s * 0.9, false);
      for (const z of [-0.6, -0.3, 0, 0.3, 0.6]) add(caixa(0.06, 0.05, 0.08), MT.ambar, cv, xc + 0.1, y0 + 4.25, z, false);
      // tanque de combustível, tanques de ar, caixa de bateria
      add(cil(0.3, 0.3, 1.2, 20, 'x'), MT.aluminio, cv, -16.0, y0 + 0.75, 0.88);
      add(cil(0.12, 0.12, 0.9, 12, 'x'), MT.aco, cv, -16.0, y0 + 0.75, -0.75);
      add(cxR(0.7, 0.5, 0.5, 0.02), MT.preto, cv, -16.0, y0 + 0.8, -0.95);
      // escapamento vertical atrás da cabine
      add(cil(0.07, 0.07, 1.6, 10), MT.cromo, cv, -16.25, y0 + 3.4, 1.05);
      // rodas: dianteira e tandem
      const rodas = [];
      for (const [ex, dupla] of [[-17.9, false], [-14.0, true], [-12.7, true]]) {
        add(cil(0.07, 0.07, 2.0, 10, 'z'), MT.grafite, cv, ex, y0 + 0.52, 0);
        for (const s of [-1, 1]) for (let k = 0; k < (dupla ? 2 : 1); k++) {
          const r = pneu(0.52, 0.3, 0.29, MT.borracha, MT.aluminio, { lado: s, furos: true, parafusos: 10, matDisco: MT.aluminio });
          r.position.set(ex, y0 + 0.52, s * (1.05 - k * 0.32)); cv.add(r); rodas.push(r);
        }
        if (dupla) for (const s of [-1, 1]) add(caixa(1.0, 0.04, 0.72), MT.preto, cv, ex, y0 + 1.12, s * 0.9);
      }
    }

    // ═════════════ PALLET DE LATAS ═════════════
    const PL = 1.42, PW = 1.12, PH = 0.144;                       // pallet de latas: 1,42 × 1,12 m
    const LATA_D = 0.066, LATA_H = 0.122, CAMADAS = 15, SEP = 0.004;
    const geoLata = (() => {                                       // perfil de lata 350 ml
      const r = LATA_D / 2, h = LATA_H;
      const p = [[0, 0.002], [r * 0.78, 0], [r * 0.95, 0.006], [r, 0.014], [r, h - 0.016], [r * 0.86, h - 0.004], [r * 0.84, h], [0, h]].map(v => new THREE.Vector2(v[0], v[1]));
      return new THREE.LatheGeometry(p, Q ? 12 : 8);
    })();
    function palletDeLatas(simples) {
      const g = new THREE.Group();
      if (simples) {
        const hT = PH + SEP + CAMADAS * (LATA_H + SEP) + 0.05;
        add(caixa(PL, PH, PW), MT.madeira, g, 0, PH / 2, 0);
        add(caixa(PL - 0.01, hT - PH, PW - 0.01), MT.lata, g, 0, (hT + PH) / 2, 0);
        add(caixa(PL + 0.01, 0.05, PW + 0.01), MT.quadro, g, 0, hT - 0.02, 0);
        return g;
      }
      // estrutura de madeira: tábuas de baixo, 3 longarinas, tábuas de cima
      for (const x of [-PL / 2 + 0.07, 0, PL / 2 - 0.07]) add(caixa(0.14, 0.022, PW), MT.madeiraEsc, g, x, 0.011, 0);
      for (const z of [-PW / 2 + 0.04, 0, PW / 2 - 0.04]) add(caixa(PL, 0.1, 0.08), MT.madeira, g, 0, 0.072, z);
      for (let i = 0; i < 7; i++) add(caixa(0.14, 0.022, PW), MT.madeira, g, -PL / 2 + 0.07 + i * (PL - 0.14) / 6, 0.133, 0);
      // camadas de latas (só as visíveis: a casca externa e a camada de cima) + folhas separadoras
      const pos = [];
      const nx = Math.floor(PL / LATA_D), dz = LATA_D * 0.866, nz = Math.floor((PW - LATA_D) / dz) + 1;
      const ox = -PL / 2 + LATA_D / 2 + (PL - nx * LATA_D) / 2, oz = -PW / 2 + LATA_D / 2 + (PW - LATA_D - (nz - 1) * dz) / 2;
      const passo = LATA_H + SEP;
      for (let c = 0; c < CAMADAS; c++) {
        const y = PH + SEP + c * passo;
        for (let j = 0; j < nz; j++) {
          const desl = (j % 2) * LATA_D / 2, n = nx - (j % 2);
          for (let i = 0; i < n; i++) {
            const borda = j === 0 || j === nz - 1 || i === 0 || i === n - 1 || c === CAMADAS - 1;
            if (borda) pos.push(ox + desl + i * LATA_D, y, oz + j * dz);
          }
        }
        add(caixa(PL - 0.004, SEP, PW - 0.004), MT.papelao, g, 0, y - SEP / 2, 0, false);
      }
      const n = pos.length / 3;
      const latas = new THREE.InstancedMesh(geoLata, MT.lata, n);
      const m4 = new THREE.Matrix4(), cor = new THREE.Color(), q = new THREE.Quaternion();
      for (let k = 0; k < n; k++) {
        q.setFromAxisAngle(_up, rnd() * 6.28);
        m4.compose(new THREE.Vector3(pos[k * 3], pos[k * 3 + 1], pos[k * 3 + 2]), q, new THREE.Vector3(1, 1, 1));
        latas.setMatrixAt(k, m4);
        const v = 0.9 + rnd() * 0.12; latas.setColorAt(k, cor.setRGB(v, v, v * 1.02));
      }
      latas.castShadow = true; latas.receiveShadow = true; g.add(latas);
      const topoY = PH + SEP + CAMADAS * passo;
      // miolo (não deixa ver através das frestas)
      add(caixa(PL - LATA_D * 2.2, topoY - PH - 0.02, PW - LATA_D * 2.2), MT.aco, g, 0, (topoY + PH) / 2 - 0.01, 0, false);
      // folha e quadro de topo + cintas
      add(caixa(PL, 0.004, PW), MT.papelao, g, 0, topoY + 0.002, 0, false);
      const qt = 0.05, qh = 0.045;
      for (const s of [-1, 1]) { add(caixa(PL, qh, qt), MT.quadro, g, 0, topoY + qh / 2 + 0.004, s * (PW / 2 - qt / 2)); add(caixa(qt, qh, PW - 2 * qt), MT.quadro, g, s * (PL / 2 - qt / 2), topoY + qh / 2 + 0.004, 0); }
      const hT = topoY + qh + 0.004;
      for (const x of [-0.36, 0.36]) {
        add(caixa(0.016, 0.003, PW + 0.012), MT.cinta, g, x, hT + 0.002, 0, false);
        for (const s of [-1, 1]) add(caixa(0.016, hT, 0.003), MT.cinta, g, x, hT / 2, s * (PW / 2 + 0.006), false);
      }
      // filme stretch (transparente, com brilho)
      const filme = add(caixa(PL + 0.012, topoY - 0.06, PW + 0.012), MT.filme, g, 0, (topoY + 0.06) / 2 + 0.02, 0, false);
      filme.castShadow = false; filme.renderOrder = 3;
      // etiqueta de identificação
      add(new THREE.PlaneGeometry(0.2, 0.125), MT.etiqueta, g, -PL / 2 + 0.25, 1.2, PW / 2 + 0.009, false);
      g.userData.altura = hT;
      return g;
    }

    // ═════════════ EMPILHADEIRA (contrapeso 5 t) ═════════════
    // Sistema local: frente = +X, origem no centro do eixo dianteiro, no chão.
    const fk = new THREE.Group(); cena.add(fk);
    const RF = 0.42, RT = 0.36, EIXO_T = -2.0;
    const rodasF = [], rodasT = [];
    const torre = new THREE.Group(), interna = new THREE.Group(), carro = new THREE.Group();
    let volante, cabeca, tronco, giro, luzGiro;
    {
      // corpo principal (perfil lateral extrudado)
      const corpo = [[-2.25, 0.3], [-2.25, 1.08], [-1.62, 1.1], [-1.58, 1.14], [-0.46, 1.14], [-0.42, 1.1], [-0.42, 0.82], [0.12, 0.82], [0.16, 0.86], [0.2, 1.2], [0.44, 1.2], [0.5, 1.12], [0.5, 0.36], [0.44, 0.3], [-2.25, 0.3]];
      add(perfil(corpo, 0.98, 0.03), MT.vermelho, fk);
      // contrapeso arredondado
      const cp = [[-2.8, 0.34], [-2.86, 0.6], [-2.86, 1.0], [-2.84, 1.3, -2.62, 1.38], [-2.1, 1.4], [-1.9, 1.38, -1.8, 1.26], [-1.78, 1.14], [-2.28, 1.1], [-2.28, 0.34], [-2.8, 0.34]];
      add(perfil(cp, 1.34, 0.11), MT.vermelho, fk);
      add(caixa(2.7, 0.14, 1.0), MT.preto, fk, -0.95, 0.38, 0);
      add(cxR(0.16, 0.22, 1.22, 0.05), MT.preto, fk, -2.9, 0.44, 0);              // para-choque traseiro
      for (const s of [-1, 1]) { add(caixa(0.03, 0.1, 0.16), MT.lanterna, fk, -2.86, 1.12, s * 0.46, false); add(caixa(0.03, 0.06, 0.1), MT.ambar, fk, -2.86, 0.99, s * 0.46, false); }
      add(caixa(0.025, 0.1, 0.42), std({ color: 0xeeeeee, roughness: 0.4 }), fk, -2.865, 0.8, 0, false);
      // laterais: degrau, para-lamas sobre as rodas da frente
      for (const s of [-1, 1]) {
        add(cxR(0.6, 0.05, 0.22, 0.015), MT.preto, fk, -0.55, 0.46, s * 0.6);
        add(perfil([[-0.52, 0.86], [-0.48, 1.0, -0.25, 1.06], [0.25, 1.06], [0.48, 1.0, 0.52, 0.86], [0.46, 0.84], [0.22, 0.97, 0, 0.97], [-0.22, 0.97, -0.46, 0.84], [-0.52, 0.86]], 0.34, 0.012), MT.vermelho, fk, 0, 0, s * 0.66);
      }
      // grade de ventilação e faixa preta
      for (let i = 0; i < 6; i++) add(caixa(0.36, 0.012, 0.02), MT.preto, fk, -2.08, 0.6 + i * 0.06, -0.69, false);
      add(caixa(1.6, 0.04, 0.985), MT.preto, fk, -1.0, 0.34, 0, false);
      // assoalho do operador
      add(caixa(0.56, 0.02, 0.9), std({ color: 0x1a1a1a, roughness: 0.95, bumpMap: T.chapa, bumpScale: 0.5 }), fk, -0.14, 0.83, 0, false);
      // painel e coluna de direção
      add(cxR(0.22, 0.12, 0.6, 0.03), MT.preto, fk, 0.3, 1.25, 0);
      add(caixa(0.012, 0.08, 0.14), MT.tela, fk, 0.2, 1.3, 0, false);
      haste([0.24, 1.2, 0], [-0.14, 1.5, 0], 0.035, MT.preto, fk, 10);
      const volBase = new THREE.Group(); volBase.position.set(-0.16, 1.52, 0); volBase.rotation.z = -1.05; fk.add(volBase);
      volante = new THREE.Group(); volBase.add(volante);
      const vol = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.016, 8, 32), MT.preto); vol.rotation.y = Math.PI / 2; vol.castShadow = true; volante.add(vol);
      for (let i = 0; i < 3; i++) { const a = i * 2.094; haste([0, 0, 0], [0, Math.sin(a) * 0.16, Math.cos(a) * 0.16], 0.009, MT.preto, volante, 6); }
      add(cil(0.035, 0.035, 0.04, 12, 'x'), MT.preto, volante);
      add(new THREE.SphereGeometry(0.018, 8, 6), MT.vermelho, volante, 0, 0.12, 0.1);        // manopla
      // alavancas hidráulicas (lado direito do operador)
      for (let i = 0; i < 3; i++) { haste([0.12, 1.12, 0.26 + i * 0.05], [0.0, 1.38, 0.26 + i * 0.05], 0.008, MT.cromo, fk, 6); add(new THREE.SphereGeometry(0.022, 10, 8), i === 0 ? MT.vermelho : MT.preto, fk, 0.0, 1.39, 0.26 + i * 0.05); }
      // assento com encosto
      add(cxR(0.5, 0.12, 0.5, 0.04), MT.assento, fk, -1.0, 1.21, 0);
      const enc = add(cxR(0.1, 0.55, 0.48, 0.04), MT.assento, fk, -1.3, 1.52, 0); enc.rotation.z = 0.15;
      add(cxR(0.3, 0.06, 0.06, 0.02), MT.assento, fk, -1.08, 1.4, -0.27);
      // cinto de segurança laranja
      haste([-1.24, 1.72, -0.2], [-0.96, 1.3, -0.2], 0.015, std({ color: 0xff6a00, roughness: 0.6 }), fk, 6);
      // proteção do operador (overhead guard)
      const GT = 2.32;
      for (const s of [-1, 1]) {
        haste([0.36, 1.18, s * 0.52], [0.2, GT, s * 0.52], 0.035, MT.preto, fk, 10);
        haste([-1.82, 1.36, s * 0.52], [-1.62, GT, s * 0.52], 0.035, MT.preto, fk, 10);
        add(caixa(1.9, 0.06, 0.07), MT.preto, fk, -0.71, GT, s * 0.52);
      }
      for (const x of [-1.62, 0.2]) add(caixa(0.07, 0.06, 1.1), MT.preto, fk, x, GT, 0);
      for (let i = 0; i < 6; i++) add(caixa(1.8, 0.02, 0.05), MT.preto, fk, -0.71, GT + 0.02, -0.4 + i * 0.16);
      // alça traseira com buzina, retrovisores, faróis, giroflex
      haste([-1.64, 1.6, -0.52], [-1.64, 2.0, -0.52], 0.02, std({ color: 0xffb300, roughness: 0.5 }), fk, 8);
      for (const s of [-1, 1]) { haste([0.2, 2.1, s * 0.55], [0.2, 2.2, s * 0.68], 0.008, MT.preto, fk, 6); add(cxR(0.02, 0.12, 0.16, 0.008), MT.cromo, fk, 0.2, 2.2, s * 0.72); }
      for (const s of [-1, 1]) { add(cxR(0.12, 0.1, 0.1, 0.02), MT.preto, fk, 0.24, GT + 0.06, s * 0.45); add(caixa(0.01, 0.07, 0.07), MT.farol, fk, 0.305, GT + 0.06, s * 0.45, false); }
      add(cxR(0.1, 0.1, 0.12, 0.02), MT.preto, fk, -1.66, GT + 0.06, 0.4); add(caixa(0.01, 0.07, 0.08), MT.farol, fk, -1.715, GT + 0.06, 0.4, false);
      add(cil(0.05, 0.06, 0.04, 12), MT.preto, fk, -1.5, GT + 0.05, -0.38);
      giro = add(cil(0.045, 0.045, 0.09, 14), MT.giroflex, fk, -1.5, GT + 0.12, -0.38, false);
      luzGiro = new THREE.PointLight(0xff8c00, 0, 3.5, 2); luzGiro.position.set(-1.5, GT + 0.12, -0.38); fk.add(luzGiro);
      // luz azul de segurança no chão (blue spot), ligada na ré
      const spot = add(new THREE.CircleGeometry(0.32, 24), MT.bluespot, fk, -4.6, 0.012, 0, false); spot.rotation.x = -Math.PI / 2; spot.castShadow = false;
      fk.userData.spot = spot;
      // rodas (motrizes na frente, direcionais atrás)
      for (const s of [-1, 1]) {
        const rf = pneu(RF, 0.3, 0.24, MT.pneuLiso, MT.aroVerm, { lado: s, parafusos: 8, matDisco: MT.aroVerm }); rf.position.set(0, RF, s * 0.66); fk.add(rf); rodasF.push(rf);
        const piv = new THREE.Group(); piv.position.set(EIXO_T, RT, s * 0.56); fk.add(piv);
        const rt = pneu(RT, 0.22, 0.18, MT.pneuLiso, MT.aroVerm, { lado: s, parafusos: 6, matDisco: MT.aroVerm }); piv.add(rt); rodasT.push({ piv, rt });
      }
      T.banda.repeat.set(1, 1);
      // ── torre (mastro) duplex com cilindros, correntes e garfos ──
      torre.position.set(0.6, 0.32, 0); fk.add(torre);       // pivô de inclinação
      const HT = 2.15;
      for (const s of [-1, 1]) {
        // canal externo (perfil C) + canal interno
        add(caixa(0.12, HT, 0.025), MT.grafite, torre, 0.04, HT / 2, s * 0.47);
        add(caixa(0.025, HT, 0.09), MT.grafite, torre, -0.02, HT / 2, s * 0.43);
        add(caixa(0.025, HT, 0.09), MT.grafite, torre, 0.1, HT / 2, s * 0.43);
        add(caixa(0.1, HT - 0.1, 0.02), MT.aco, interna, 0.08, (HT - 0.1) / 2 + 0.05, s * 0.37);
        add(caixa(0.02, HT - 0.1, 0.07), MT.aco, interna, 0.13, (HT - 0.1) / 2 + 0.05, s * 0.4);
        // cilindros de elevação (camisa preta + haste cromada)
        add(cil(0.05, 0.05, 1.5, 14), MT.preto, torre, 0.0, 0.85, s * 0.3);
        add(cil(0.03, 0.03, 0.62, 12), MT.cromo, interna, 0.0, 1.75, s * 0.3);
        // cilindros de inclinação (corpo → torre)
        haste([0.36, 0.98, s * 0.36], [0.6, 1.08, s * 0.36], 0.04, MT.preto, fk, 10); haste([0.5, 1.03, s * 0.36], [0.62, 1.085, s * 0.36], 0.022, MT.cromo, fk, 8);
      }
      torre.add(interna);
      for (const y of [0.15, 1.0, HT - 0.05]) add(caixa(0.1, 0.08, 0.98), MT.grafite, torre, 0.04, y, 0);
      add(caixa(0.1, 0.1, 0.86), MT.aco, interna, 0.08, HT - 0.02, 0);
      // polias e correntes
      for (const s of [-1, 1]) add(cil(0.06, 0.06, 0.05, 16, 'z'), MT.aco, interna, 0.0, HT - 0.08, s * 0.15);
      const corrMat = std({ map: T.corrente, transparent: true, alphaTest: 0.3, metalness: 0.8, roughness: 0.4 });
      for (const s of [-1, 1]) for (const k of [-0.03, 0.03]) {
        const c = add(new THREE.BoxGeometry(0.012, 1, 0.028), corrMat, torre, 0.125, 1, s * 0.15 + k, false);
        c.userData.corr = true; c.userData.z = s * 0.15 + k;
        (torre.userData.corr = torre.userData.corr || []).push(c);
      }
      // mangueiras hidráulicas
      for (const s of [-1, 1]) {
        const curva = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.25, 0.4, s * 0.2), new THREE.Vector3(-0.05, 0.55, s * 0.2), new THREE.Vector3(0.0, 1.4, s * 0.2), new THREE.Vector3(0.04, HT - 0.1, s * 0.22)]);
        add(new THREE.TubeGeometry(curva, 24, 0.012, 6), MT.preto, torre, 0, 0, 0, false);
      }
      // carro porta-garfos com grade de encosto
      torre.add(carro);
      add(caixa(0.06, 0.1, 1.12), MT.grafite, carro, 0.2, 0.43, 0);
      add(caixa(0.06, 0.1, 1.12), MT.grafite, carro, 0.2, 0.08, 0);
      add(caixa(0.05, 0.42, 1.0), MT.aco, carro, 0.17, 0.26, 0);
      for (let i = 0; i < 6; i++) add(caixa(0.03, 0.8, 0.03), MT.grafite, carro, 0.2, 0.88, -0.45 + i * 0.18);
      add(caixa(0.04, 0.04, 1.0), MT.grafite, carro, 0.2, 1.28, 0);
      add(caixa(0.04, 0.04, 1.0), MT.grafite, carro, 0.2, 0.9, 0);
      // garfos em L (forjados: haste vertical + lâmina afinando na ponta)
      const garfo = perfil([[0.22, 0.52], [0.27, 0.52], [0.27, 0.0], [1.44, 0.0], [1.44, -0.012], [1.2, -0.05], [0.28, -0.05], [0.22, -0.05, 0.22, 0.0], [0.22, 0.52]], 0.12, 0.006);
      for (const s of [-1, 1]) { add(garfo, MT.aco, carro, 0, 0, s * 0.3); add(caixa(0.06, 0.08, 0.13), MT.grafite, carro, 0.24, 0.45, s * 0.3); }
    }

    // ═════════════ OPERADOR ═════════════
    {
      const op = new THREE.Group(); fk.add(op);
      const QUADRIL = [-1.0, 1.3], OMBRO = [-1.04, 1.78];
      // pernas: coxas para frente, canelas até os pedais
      for (const s of [-1, 1]) {
        const z = s * 0.12;
        haste([QUADRIL[0], QUADRIL[1], z], [-0.5, 1.3, z * 1.15], 0.075, MT.calca, op, 10, true);
        haste([-0.5, 1.3, z * 1.15], [-0.3, 0.93, z * 1.2], 0.06, MT.calca, op, 10, true);
        add(cxR(0.26, 0.09, 0.11, 0.03), MT.bota, op, -0.2, 0.885, z * 1.2);
      }
      add(cxR(0.3, 0.16, 0.34, 0.07), MT.calca, op, -1.0, 1.32, 0);          // quadril
      // tronco (gira ao olhar para trás)
      tronco = new THREE.Group(); tronco.position.set(QUADRIL[0], QUADRIL[1], 0); op.add(tronco);
      const tg = new THREE.CapsuleGeometry(0.16, 0.3, 6, 14); tg.scale(0.85, 1, 1.15);
      const tm = add(tg, MT.uniforme, tronco, -0.02, 0.27, 0); tm.rotation.z = 0.08;
      // faixas refletivas no peito e nos ombros
      for (const y of [0.3, 0.42]) { const f = add(new THREE.CylinderGeometry(0.147, 0.147, 0.035, 18, 1, true), MT.refletivo, tronco, -0.015, y, 0, false); f.scale.set(0.86, 1, 1.17); }
      for (const s of [-1, 1]) haste([-0.1, 0.5, s * 0.12], [0.08, 0.5, s * 0.12], 0.02, MT.refletivo, tronco, 6);
      // braços com luvas nas mãos no volante
      for (const s of [-1, 1]) {
        haste([-1.04, 1.74, s * 0.2], [-0.7, 1.47, s * 0.25], 0.055, MT.uniforme, op, 10, true);
        haste([-0.7, 1.47, s * 0.25], [-0.27, 1.54, s * 0.15], 0.045, MT.uniforme, op, 10, true);
        add(new THREE.SphereGeometry(0.048, 10, 8), MT.luva, op, -0.23, 1.55, s * 0.14);
      }
      // pescoço, cabeça, capacete e óculos
      add(cil(0.05, 0.055, 0.1, 10), MT.pele, tronco, -0.03, 0.56, 0);
      cabeca = new THREE.Group(); cabeca.position.set(-0.03, 0.66, 0); tronco.add(cabeca);
      const cab = add(new THREE.SphereGeometry(0.1, 18, 14), MT.pele, cabeca, 0, 0, 0); cab.scale.set(1.05, 1.12, 0.95);
      add(new THREE.SphereGeometry(0.03, 8, 6), MT.pele, cabeca, 0.095, -0.01, 0);                  // nariz
      const cap = add(new THREE.SphereGeometry(0.128, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2), MT.capacete, cabeca, -0.005, 0.03, 0); cap.scale.set(1.08, 0.95, 1);
      add(new THREE.CylinderGeometry(0.135, 0.14, 0.012, 22), MT.capacete, cabeca, 0.0, 0.03, 0);
      const aba = add(new THREE.CylinderGeometry(0.13, 0.13, 0.01, 16, 1, false, -Math.PI / 2, Math.PI), MT.capacete, cabeca, 0.03, 0.035, 0); aba.rotation.y = Math.PI / 2; aba.scale.set(1, 1, 0.9);
      add(new THREE.BoxGeometry(0.02, 0.012, 0.03), MT.capacete, cabeca, 0, 0.155, 0, false);       // nervura
      const ocl = add(new THREE.CylinderGeometry(0.104, 0.104, 0.04, 16, 1, true, -1.0, 2.0), MT.oculos, cabeca, 0, 0.0, 0); ocl.rotation.y = Math.PI / 2; ocl.scale.set(1.04, 1, 0.95);
      haste([0.02, 0.0, 0.1], [-0.08, 0.0, 0.1], 0.006, MT.oculos, cabeca, 4);
      haste([0.02, 0.0, -0.1], [-0.08, 0.0, -0.1], 0.006, MT.oculos, cabeca, 4);
      // protetor auricular (concha) na lateral do capacete
      for (const s of [-1, 1]) add(cil(0.04, 0.04, 0.03, 12, 'z'), std({ color: 0xffb000, roughness: 0.5 }), cabeca, -0.01, -0.01, s * 0.105);
    }

    // ═════════════ PALLETS: o que a empilhadeira carrega ═════════════
    const pallet = palletDeLatas();
    // posição do pallet nos garfos: encostado no carro, lâminas dentro das aberturas
    const PALLET_X = 0.29 + PL / 2;       // centro do pallet no sistema do carro
    const VAO = 0.122;                    // da base do pallet até o topo do garfo (base 0,022 + vão 0,1)
    carro.add(pallet);
    // pallets já carregados no fundo da carreta (só se vê a silhueta, sem repetir o mesmo)
    for (const [x, z] of [[-13.9, 0.6], [-13.9, -0.6], [-12.4, 0.6], [-12.4, -0.6], [-10.9, 0.6], [-10.9, -0.6], [-9.4, -0.6]]) { const p = palletDeLatas(true); p.position.set(x, PISO, z); car1.add(p); }

    // ═════════════ TRAVA-RODAS (calço amarelo na roda dianteira da carreta) ═════════════
    {
      const amarelo = std({ color: 0xf2c200, roughness: 0.55 });
      const ex = -4.64, R = 0.53;                     // eixo dianteiro da carreta
      const xs = ex - Math.sqrt(R * R - (R - 0.24) * (R - 0.24));   // onde o pneu passa a 24 cm do chão
      const xb = ex - Math.sqrt(R * R - (R - 0.02) * (R - 0.02));
      const calco = perfil([[xs - 0.42, 0], [xb + 0.02, 0], [(xb + xs) / 2 + 0.03, 0.12, xs, 0.24], [xs - 0.08, 0.25], [xs - 0.42, 0.03], [xs - 0.42, 0]], 0.22, 0.012);
      for (const s of [-1, 1]) {
        add(calco, amarelo, car1, 0, CHAO, s * 1.14);
        for (let i = 0; i < 3; i++) add(caixa(0.02, 0.01, 0.2), std({ color: 0x8a6d00, roughness: 0.8 }), car1, xs - 0.34 + i * 0.1, CHAO + 0.06 + i * 0.04, s * 1.14, false);
        haste([xs - 0.42, CHAO + 0.02, s * 1.14], [xs - 0.62, CHAO + 0.012, s * 1.3], 0.008, MT.preto, car1, 4);
      }
    }

    // ═════════════ ARMAÇÃO DE ALUMÍNIO + MOTORISTA ═════════════
    // O motorista encosta a armação em pé na face da carga e empurra o pallet, que desliza no
    // assoalho do baú. Sistema local: a armação fica no plano x = 0 e empurra para +X.
    const pj = new THREE.Group(); cena.add(pj);
    const arm = new THREE.Group(); pj.add(arm);
    {
      const al = std({ color: 0xc4cad1, metalness: 1, roughness: 0.32 });
      const r = 0.018;
      const P = [[-0.16, 0.06], [0.16, 0.06], [0.34, 0.95], [0.34, 1.3], [0.16, 2.12], [-0.16, 2.12], [-0.34, 1.3], [-0.34, 0.95]];
      for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; haste([0, a[1], a[0]], [0, b[1], b[0]], r, al, arm, 6); }
      for (const z of [-0.11, 0.11]) haste([0, 0.06, z], [0, 2.12, z], r * 0.9, al, arm, 6);
      for (const [y, w] of [[0.45, 0.24], [0.95, 0.34], [1.3, 0.34], [1.72, 0.25]]) haste([0, y, -w], [0, y, w], r * 0.9, al, arm, 6);
      haste([0, 0.95, -0.34], [0, 0.45, 0.11], r * 0.8, al, arm, 6); haste([0, 1.3, 0.34], [0, 1.72, -0.11], r * 0.8, al, arm, 6);
      for (const z of [-0.16, 0.16]) add(caixa(0.05, 0.03, 0.05), MT.preto, arm, 0.01, 0.045, z, false);   // sapatas
    }
    // motorista: boné, colete verde-limão refletivo, camisa laranja, calça cinza (pernas e braços articulados)
    const mot = new THREE.Group(); pj.add(mot);
    const MM = { jeans: std({ color: 0xa3a39c, roughness: 0.9 }), camisa: std({ color: 0xe8732c, roughness: 0.8 }),
      colete: std({ color: 0xc6e02a, roughness: 0.6, emissive: 0x2a3300, emissiveIntensity: 0.5 }), bone: std({ color: 0x1d2a4d, roughness: 0.75 }) };
    function membro(r, mat) { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.88, 1, 10), mat); m.castShadow = true; mot.add(m); return m; }
    const junta = (r, mat) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), mat); m.castShadow = true; mot.add(m); return m; };
    const _d = new THREE.Vector3(), _pp = new THREE.Vector3();
    function liga(m, a, b) { _d.copy(b).sub(a); const L = Math.max(0.001, _d.length()); m.position.copy(a).addScaledVector(_d, 0.5); m.scale.set(1, L, 1); m.quaternion.setFromUnitVectors(_up, _d.multiplyScalar(1 / L)); }
    function ik(a, b, L1, L2, polo, out) {        // articulação (joelho/cotovelo) de 2 segmentos
      const d = Math.max(0.05, Math.min(L1 + L2 - 1e-3, a.distanceTo(b)));
      _d.copy(b).sub(a).normalize();
      const x = (L1 * L1 - L2 * L2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, L1 * L1 - x * x));
      _pp.copy(polo).addScaledVector(_d, -polo.dot(_d)).normalize();
      return out.copy(a).addScaledVector(_d, x).addScaledVector(_pp, h);
    }
    const perna = [-1, 1].map(s => ({ s, coxa: membro(0.075, MM.jeans), canela: membro(0.06, MM.jeans), joelho: junta(0.068, MM.jeans), bota: add(cxR(0.27, 0.1, 0.12, 0.035), MT.bota, mot) }));
    const braco = [-1, 1].map(s => ({ s, sup: membro(0.05, MM.camisa), ant: membro(0.042, MM.camisa), cot: junta(0.048, MM.camisa), mao: junta(0.046, MT.luva) }));
    add(cxR(0.26, 0.16, 0.36, 0.06), MM.jeans, mot, 0, 0.94, 0);
    const torso = new THREE.Group(); torso.position.set(0, 0.94, 0); mot.add(torso);
    { const g = new THREE.CapsuleGeometry(0.16, 0.32, 6, 14); g.scale(0.82, 1, 1.12); add(g, MM.camisa, torso, 0, 0.28, 0); }
    { const g = new THREE.CylinderGeometry(0.182, 0.18, 0.36, 18, 1, true); g.scale(0.86, 1, 1.13); add(g, MM.colete, torso, 0, 0.3, 0); }
    for (const y of [0.18, 0.3]) { const g = new THREE.CylinderGeometry(0.186, 0.185, 0.035, 18, 1, true); g.scale(0.87, 1, 1.14); add(g, MT.refletivo, torso, 0, y, 0, false); }
    add(cil(0.05, 0.055, 0.1, 10), MT.pele, torso, 0.01, 0.6, 0);
    const cabM = new THREE.Group(); cabM.position.set(0.01, 0.71, 0); torso.add(cabM);
    { const c = add(new THREE.SphereGeometry(0.1, 18, 14), MT.pele, cabM); c.scale.set(1.05, 1.12, 0.95); }
    add(new THREE.SphereGeometry(0.03, 8, 6), MT.pele, cabM, 0.095, -0.01, 0);
    { const c = add(new THREE.SphereGeometry(0.112, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2), MM.bone, cabM, -0.005, 0.035, 0); c.scale.set(1.08, 0.9, 1); }
    { const a = add(new THREE.CylinderGeometry(0.11, 0.11, 0.012, 16, 1, false, -Math.PI / 2, Math.PI), MM.bone, cabM, 0.07, 0.04, 0); a.rotation.y = Math.PI / 2; a.rotation.z = -0.12; a.scale.set(1, 1, 0.75); }
    { const o = add(new THREE.CylinderGeometry(0.104, 0.104, 0.04, 16, 1, true, -1.0, 2.0), MT.oculos, cabM, 0, 0, 0); o.rotation.y = Math.PI / 2; o.scale.set(1.04, 1, 0.95); }
    const _q1 = new THREE.Vector3(), _q2 = new THREE.Vector3(), _q3 = new THREE.Vector3(), _q4 = new THREE.Vector3();
    const POLO_JOELHO = new THREE.Vector3(1, 0, 0), POLO_COTOVELO = new THREE.Vector3(-0.4, -1, 0);
    // pose do motorista: ox = distância atrás da armação, inclinação do tronco, fase do passo, amplitude do passo
    function poseMotorista(ox, inclina, fase, amp) {
      mot.position.set(ox, 0, 0);
      const bob = 0.015 * amp * Math.abs(Math.cos(fase));
      torso.position.y = 0.94 + bob; torso.rotation.z = -inclina;
      for (const L of perna) {
        const f = fase + (L.s > 0 ? Math.PI : 0);
        const ax = 0.24 * amp * Math.sin(f), ay = 0.075 + 0.08 * amp * Math.max(0, Math.cos(f));
        const quad = _q1.set(0, 0.92 + bob, L.s * 0.1), torn = _q2.set(ax, ay, L.s * 0.11);
        const joe = ik(quad, torn, 0.45, 0.45, POLO_JOELHO, _q3);
        liga(L.coxa, quad, joe); liga(L.canela, joe, torn); L.joelho.position.copy(joe);
        L.bota.position.set(ax + 0.06, ay - 0.025, L.s * 0.11);
      }
      // mãos nos montantes da armação (convertidas para o sistema do motorista)
      const gx = -ox - 0.03, gy = 1.22;
      for (const B of braco) {
        const c = Math.cos(-inclina), sn = Math.sin(-inclina);
        const ombro = _q1.set(0.02 * c - 0.48 * sn, 0.94 + bob + 0.02 * sn + 0.48 * c, B.s * 0.2);
        const mao = _q2.set(gx, gy, B.s * 0.24);
        const cot = ik(ombro, mao, 0.31, 0.3, _q4.copy(POLO_COTOVELO).setZ(B.s * 0.6), _q3);
        liga(B.sup, ombro, cot); liga(B.ant, cot, mao); B.cot.position.copy(cot); B.mao.position.copy(mao);
      }
    }

    // ═════════════ SOMBRA DE CONTATO ═════════════
    const tSombra = tex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(0,0,0,.75)'); gr.addColorStop(.55, 'rgba(0,0,0,.4)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }, null, false);
    const mSombra = new THREE.MeshBasicMaterial({ map: tSombra, transparent: true, depthWrite: false });
    function penumbra(pai, w, d, x, y, z) { const m = add(new THREE.PlaneGeometry(w, d), mSombra, pai, x, y, z, false); m.rotation.x = -Math.PI / 2; m.castShadow = false; m.receiveShadow = false; m.renderOrder = 1; return m; }
    penumbra(fk, 4.2, 2.0, -1.05, 0.006, 0);
    penumbra(pj, 1.3, 1.0, -0.35, 0.006, 0);
    for (const c of [car1, car2]) { penumbra(c, 6.0, 3.4, -3.3, CHAO + 0.006, 0); penumbra(c, 3.0, 3.2, -11.6, CHAO + 0.006, 0); }
    penumbra(cavalo, 8.0, 3.4, -15.6, CHAO + 0.006, 0);

    // ═════════════ FUSÃO DAS PEÇAS FIXAS ═════════════
    // Junta, por material, as malhas que não se mexem entre si: de ~1.100 para ~150 desenhos por quadro.
    function juntar(lista, pai) {
      const porMat = new Map();
      for (const { m, mat4 } of lista) {
        const k = m.material.uuid + (m.castShadow ? 's' : 'n');
        if (!porMat.has(k)) porMat.set(k, { mat: m.material, sombra: m.castShadow, geos: [] });
        let g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
        g.applyMatrix4(mat4);
        porMat.get(k).geos.push(g);
      }
      for (const { mat, sombra, geos } of porMat.values()) {
        let n = 0; geos.forEach(g => n += g.attributes.position.count);
        const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2);
        let o = 0;
        for (const g of geos) {
          const c = g.attributes.position.count;
          pos.set(g.attributes.position.array, o * 3);
          if (!g.attributes.normal) g.computeVertexNormals();
          nor.set(g.attributes.normal.array, o * 3);
          if (g.attributes.uv) uv.set(g.attributes.uv.array, o * 2);
          o += c; g.dispose();
        }
        const bg = new THREE.BufferGeometry();
        bg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        bg.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
        bg.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
        bg.computeBoundingSphere();
        const mm = new THREE.Mesh(bg, mat); mm.castShadow = sombra; mm.receiveShadow = true; pai.add(mm);
      }
    }
    // tudo dentro de um grupo fixo (cenário, carretas, cavalo)
    function fundirTudo(raiz) {
      raiz.updateMatrixWorld(true);
      const inv = raiz.matrixWorld.clone().invert(), lista = [], tirar = [];
      raiz.traverse(o => { if (o.isMesh && !o.isInstancedMesh) { lista.push({ m: o, mat4: inv.clone().multiply(o.matrixWorld) }); tirar.push(o); } });
      tirar.forEach(o => o.parent.remove(o));
      for (let k = 0; k < 4; k++) { const vazios = []; raiz.traverse(o => { if (o !== raiz && o.isGroup && !o.children.length) vazios.push(o); }); vazios.forEach(o => o.parent.remove(o)); }
      juntar(lista, raiz);
    }
    // só as filhas diretas (as partes móveis continuam separadas)
    function fundirFilhas(grupo, manter = []) {
      const lista = [];
      grupo.children.slice().forEach(o => { if (o.isMesh && !o.isInstancedMesh && !manter.includes(o)) { o.updateMatrix(); lista.push({ m: o, mat4: o.matrix.clone() }); grupo.remove(o); } });
      juntar(lista, grupo);
    }
    fundirTudo(amb); fundirTudo(car1); fundirTudo(car2); fundirTudo(cavalo);
    [torre, interna, carro, tronco, cabeca, volante].forEach(g => fundirFilhas(g, (torre.userData.corr || [])));
    fundirFilhas(fk, [giro, fk.userData.spot]);
    fundirFilhas(pallet);
    rodasT.forEach(o => fundirFilhas(o.rt));
    fk.children.forEach(o => { if (o.isGroup && !o.userData.movel && o !== torre && o.children.length > 3 && o.children.every(c => c.isMesh)) fundirFilhas(o); });

    // ═════════════ LUZES ═════════════
    scene.add(new THREE.HemisphereLight(0x9db8ff, 0x2a2420, 0.3));
    Object.values(MT).forEach(m => { if (m.isMeshStandardMaterial) m.envMapIntensity = m.metalness > 0.6 ? 0.95 : 0.5; });
    const sol = new THREE.DirectionalLight(0xfff1de, 3.4);
    sol.position.set(9, 16, 10); sol.target.position.set(0, 0, -1); scene.add(sol, sol.target);
    sol.castShadow = true;
    sol.shadow.mapSize.set(Q ? 2048 : 1024, Q ? 2048 : 1024);
    Object.assign(sol.shadow.camera, { left: -9, right: 11, top: 9, bottom: -8, near: 2, far: 45 });
    sol.shadow.bias = -0.0004; sol.shadow.normalBias = 0.02; sol.shadow.radius = 4;
    const luzDoca = new THREE.SpotLight(0xfff0dc, 60, 16, 0.75, 0.6, 1.6);   // luz da cobertura sobre a doca
    luzDoca.position.set(3.5, 6.6, 1.5); luzDoca.target.position.set(1.5, 0, 0); scene.add(luzDoca, luzDoca.target);
    const luzBau = new THREE.PointLight(0xffe6c4, 2.0, 6, 2); luzBau.position.set(-1.2, 2.3, 0); scene.add(luzBau);
    const contra = new THREE.DirectionalLight(0x7f9cff, 0.7); contra.position.set(-15, 8, -10); scene.add(contra);

    // ═════════════ CÂMERA 3/4 ═════════════
    const cam = new THREE.PerspectiveCamera(30, 2, 0.5, 120);
    const ALVO = new THREE.Vector3(-3.2, 1.0, -0.2);
    const POS_CAM = new THREE.Vector3(10.8, 3.1, 8.6);
    function enquadrar(w, h) {
      const asp = w / Math.max(1, h);
      cam.aspect = asp;
      const hfov = 60 * Math.PI / 180;                        // largura de cena fixa; em faixa muito larga
      let vfov = 2 * Math.atan(Math.tan(hfov / 2) / asp) * 180 / Math.PI;   // a altura mínima manda
      cam.fov = Math.min(34, Math.max(27, vfov));             // faixa alta: corta as laterais, não sobra chão
      cam.position.copy(POS_CAM); cam.lookAt(ALVO);
      cam.updateProjectionMatrix();
    }

    // ═════════════ TRAJETO E LINHA DO TEMPO ═════════════
    // Empilhadeira: chega em curva e para no limite da porta do baú (não entra), apoia o pallet
    // logo depois da porta e sai de ré. O motorista vem com a paleteira e empurra o pallet para o
    // fundo do baú (onde a câmera não vê), depois volta para o lugar de espera na doca.
    const P0 = new THREE.Vector2(11.6, 1.6), C1 = new THREE.Vector2(8.0, 1.6), C2 = new THREE.Vector2(4.4, 0), PD = new THREE.Vector2(0.75, 0);
    const PALLET_PORTA = -0.85, PALLET_FUNDO = -3.8;    // centro do pallet: na porta · no fundo
    const amostras = [];
    {
      const N = 260; let acc = 0, ant = null;
      const bez = (t) => { const u = 1 - t; return new THREE.Vector2(u * u * u * P0.x + 3 * u * u * t * C1.x + 3 * u * t * t * C2.x + t * t * t * PD.x, u * u * u * P0.y + 3 * u * u * t * C1.y + 3 * u * t * t * C2.y + t * t * t * PD.y); };
      for (let i = 0; i <= N; i++) { const p = bez(i / N); if (ant) acc += p.distanceTo(ant); amostras.push({ p, s: acc }); ant = p; }
    }
    const S_TOT = amostras[amostras.length - 1].s;
    function noTrajeto(s) {
      s = Math.max(0, Math.min(S_TOT, s));
      let lo = 0, hi = amostras.length - 1;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (amostras[m].s < s) lo = m; else hi = m; }
      const a = amostras[lo], b = amostras[hi], k = (s - a.s) / Math.max(1e-6, b.s - a.s);
      const p = a.p.clone().lerp(b.p, k);
      const d = b.p.clone().sub(a.p).normalize();
      return { x: p.x, z: p.y, dx: d.x, dz: d.y };
    }
    const lin = (a, b, t) => Math.max(0, Math.min(1, (t - a) / (b - a)));
    const suave = (u) => u * u * (3 - 2 * u);
    // empilhadeira: chega (0–4,2) · apoia na porta (4,2–5,0) · ré até sair da tela (5,0–8,4) · espera fora
    function quadro(t) {
      let s, re = false;
      if (t < 4.2) { const u = t / 4.2; s = S_TOT * (1 - Math.pow(1 - u, 1.8)); }
      else if (t < 5.0) s = S_TOT;
      else if (t < 8.4) { s = S_TOT * (1 - Math.pow(lin(5.0, 8.4, t), 1.55)); re = true; }
      else s = 0;
      let garfo = 0.3, incl = 0.06;
      if (t >= 4.2 && t < 5.0) { const u = suave(lin(4.2, 5.0, t)); garfo = 0.3 - (0.3 - 0.095) * u; incl = 0.06 * (1 - u); }
      else if (t >= 5.0) { garfo = 0.095 + 0.1 * suave(lin(6.0, 6.6, t)); incl = 0.04 * suave(lin(6.0, 6.6, t)); }
      const solto = t >= 5.0 || (t >= 4.2 && garfo <= VAO + 0.0005);
      return { s, re, garfo, incl, solto };
    }
    // armação (plano de contato com a carga) e motorista: espera ao lado da porta, encosta na
    // carga, empurra o pallet até o fundo do baú e volta de costas para o lugar de espera
    const FACE = 0.75;                                       // do centro do pallet até a armação
    const PJ = { W: [1.15, -2.2], A: [PALLET_PORTA + FACE, 0], F: [PALLET_FUNDO + FACE, 0] };
    const PJ_TL = [[0, 6.2, 'W', 'W'], [6.2, 8.0, 'W', 'A'], [8.0, 8.3, 'A', 'A'], [8.3, 11.2, 'A', 'F'], [11.2, 11.6, 'F', 'F'], [11.6, 15.4, 'F', 'W'], [15.4, 16.01, 'W', 'W']];
    function posPJ(t) {
      for (const [a, b, de, para] of PJ_TL) if (t >= a && t < b) { const u = suave(lin(a, b, t)); return [PJ[de][0] + (PJ[para][0] - PJ[de][0]) * u, PJ[de][1] + (PJ[para][1] - PJ[de][1]) * u]; }
      return PJ.W.slice();
    }
    function quadroPJ(t) {
      const [x, z] = posPJ(t);
      let inclina = 0.05;
      if (t >= 8.0 && t < 11.2) inclina = 0.05 + 0.22 * suave(lin(8.0, 8.4, t));   // empurrando
      else if (t >= 11.6 && t < 15.4) inclina = -0.03;                               // volta de costas
      return { x, z, ox: -0.56, inclina, ergue: (t >= 8.0 && t < 11.2) ? 0 : 0.04 };
    }
    // passo do motorista: distância andada (com sinal: para frente / de costas), tabelada para o ciclo fechar igual
    const PASSO = []; {
      let acc = 0, ant = null;
      for (let i = 0; i <= 1600; i++) { const t = i * CICLO / 1600, q = quadroPJ(t), wx = q.x - q.ox, wz = q.z;
        if (ant) { const dx = wx - ant[0], dz = wz - ant[1], d = Math.hypot(dx, dz); acc += d * (dx <= 0.0001 ? 1 : -1); PASSO.push([acc, d / (CICLO / 1600)]); } else PASSO.push([0, 0]);
        ant = [wx, wz]; }
    }
    const passo = (t) => PASSO[Math.max(0, Math.min(PASSO.length - 1, Math.round(t / CICLO * 1600)))];

    // pallet solto: na porta, sendo empurrado ou no fundo do baú
    const palletSolto = new THREE.Group(); cena.add(palletSolto);

    // ═════════════ ANIMAÇÃO ═════════════
    let ultimoS = null, giroRodas = 0, esterco = 0, cabecaY = 0, velAnt = 0;
    function posicionar(t) {
      const f = quadro(t);
      const pt = noTrajeto(f.s);
      const ang = Math.atan2(-pt.dz, pt.dx);                        // frente = direção do trajeto
      fk.position.set(pt.x, PISO, pt.z);
      fk.rotation.y = ang;
      // rodas: giro pela distância percorrida (ré = sentido contrário)
      if (ultimoS !== null) { const ds = f.s - ultimoS; if (Math.abs(ds) < 3) giroRodas -= ds; }
      ultimoS = f.s;
      rodasF.forEach(r => r.rotation.z = giroRodas / RF);
      // direção nas rodas traseiras pela curvatura do trajeto
      const a2 = noTrajeto(f.s + 0.25), a1 = noTrajeto(f.s - 0.25);
      let dAng = Math.atan2(-a2.dz, a2.dx) - Math.atan2(-a1.dz, a1.dx);
      dAng = Math.atan2(Math.sin(dAng), Math.cos(dAng));
      const curv = dAng / 0.5;
      const alvoEst = Math.max(-0.7, Math.min(0.7, -Math.atan(2.0 * curv)));
      esterco += (alvoEst - esterco) * 0.25;
      rodasT.forEach(o => { o.piv.rotation.y = esterco; o.rt.rotation.z = giroRodas / RT; });
      volante.rotation.x = -esterco * 3.2;
      // torre, carro e garfos
      torre.rotation.z = f.incl;
      carro.position.y = f.garfo - torre.position.y;
      interna.position.y = Math.max(0, f.garfo - 1.1) * 0.5;
      (torre.userData.corr || []).forEach(c => { const topo = 2.07 + interna.position.y, base = carro.position.y + 0.48; c.scale.y = Math.max(0.05, topo - base); c.position.y = (topo + base) / 2; });
      // armação e motorista
      const q = quadroPJ(t), [dist, vel] = passo(t);
      pj.position.set(q.x, PISO, q.z); pj.rotation.y = Math.PI;
      arm.position.y = q.ergue;
      poseMotorista(q.ox, q.inclina + 0.015 * Math.sin(t * 2.1), dist / 0.62 * Math.PI, Math.min(1, vel / 0.7));
      cabM.rotation.y = (t < 6.0 || t > 15.4) ? -0.5 + 0.15 * Math.sin(t * 0.7) : 0;   // na espera, acompanha a empilhadeira
      // pallet: nos garfos da empilhadeira → na porta → na paleteira → no fundo do baú
      if (!f.solto) {
        if (pallet.parent !== carro) carro.add(pallet);
        pallet.position.set(PALLET_X, -VAO, 0); pallet.rotation.set(0, 0, 0);
      } else {
        if (pallet.parent !== palletSolto) palletSolto.add(pallet);
        let px = PALLET_PORTA; const py = 0;
        if (t >= 8.3 && t < 11.6) px = Math.min(PALLET_PORTA, q.x - FACE);
        else if (t >= 11.6) px = PALLET_FUNDO;
        pallet.position.set(px, PISO + py, 0); pallet.rotation.set(0, Math.PI, 0);
      }
      // operador: olha para trás na ré
      const alvoCab = f.re ? 1.9 : (t > 3.0 && t < 5.0 ? -0.15 : 0);
      cabecaY += (alvoCab - cabecaY) * 0.12;
      cabeca.rotation.y = cabecaY * 0.75; tronco.rotation.y = cabecaY * 0.07;
      cabeca.rotation.x = f.re ? -0.08 : 0;
      // giroflex e blue spot
      const fase = (t * 3.2) % 1;
      MT.giroflex.emissiveIntensity = 0.5 + 2.6 * Math.pow(Math.max(0, Math.sin(fase * Math.PI * 2)), 4);
      luzGiro.intensity = Q ? 0.9 * Math.pow(Math.max(0, Math.sin(fase * Math.PI * 2)), 4) : 0;
      giro.rotation.y = t * 9;
      MT.bluespot.opacity = f.re ? 0.7 : 0;
    }

    // ═════════════ LAÇO DE RENDERIZAÇÃO ═════════════
    let larg = 0, alt = 0, vivo = true, ultimoQuadro = 0, inicio = performance.now();
    const hist = [];
    function resize() {
      const w = host.clientWidth, h = host.clientHeight;
      const pequeno = w < 150 || h < 70;
      host.classList.toggle('c3d-oculto', pequeno);
      if (host.parentNode && host.parentNode.classList) host.parentNode.classList.toggle('c3d-vazio', pequeno);
      if (pequeno || (w === larg && h === alt)) return;
      larg = w; alt = h;
      renderer.setSize(w, h, false);
      enquadrar(w, h);
    }
    const ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(host); else addEventListener('resize', resize);
    resize();
    function rebaixar() {      // aparelho fraco: menos pixels → sombra mais simples → imagem parada
      if (pr > 1) { pr = 1; renderer.setPixelRatio(pr); larg = 0; resize(); return; }
      if (pr > 0.75) { pr = 0.75; renderer.setPixelRatio(pr); larg = 0; resize(); return; }
      if (sol.castShadow) { sol.castShadow = false; luzGiro.intensity = 0; Q = 0; return; }
      vivo = false; renderer.setAnimationLoop(null); mostrarImagem();
    }
    function laco(agora) {
      if (!vivo) return;
      if (document.hidden || !host.isConnected || host.offsetParent === null || host.classList.contains('c3d-oculto')) { ultimoQuadro = agora; hist.length = 0; return; }
      if (agora - ultimoQuadro < 1000 / FPS - 2) return;
      const dt = agora - ultimoQuadro; ultimoQuadro = agora;
      if (dt < 1000 && agora - inicio > 4000) { hist.push(dt); if (hist.length > 90) { const m = hist.reduce((a, b) => a + b, 0) / hist.length; hist.length = 0; if (m > 55) rebaixar(); } }
      const t = cfg.parado ? 2.6 : ((agora - inicio) / 1000) % CICLO;
      posicionar(t);
      renderer.render(scene, cam);
    }
    posicionar(0);
    renderer.compile(scene, cam);
    renderer.setAnimationLoop(laco);
    // ganchos para testes: quadro exato de um instante
    window.__cena3d = { quadro: (t) => { posicionar(t); renderer.render(scene, cam); }, parar: () => { vivo = false; renderer.setAnimationLoop(null); }, renderer, scene, cam, fk };
    return { resize };
  }
})();
