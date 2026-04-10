/* ═══ LOADER PAGE — loader.js (JSON-driven from data/loader.json) ═══ */
(function () {
  'use strict';

  // Clear session flag so refreshing main.html redirects back to loader
  sessionStorage.removeItem('bionex_loaded');

  /* ─── Background canvas: floating molecules connected by lines + bio symbols ─── */
  const lbgCanvas = document.getElementById('loader-bg-canvas');
  const lbg = lbgCanvas.getContext('2d');
  let mols = [];

  function resize() { lbgCanvas.width = innerWidth; lbgCanvas.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 50; i++) {
    mols.push({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      r: Math.random() * 3 + 1.5,
      vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
      hue: [255, 170, 320][i % 3],
    });
  }

  const bioSymbols = ['A','T','G','C','0','1','⧬','⟁','◇','⬡','{','}','<','>','λ','Σ','π','∞'];
  let syms = [];
  for (let i = 0; i < 35; i++) {
    syms.push({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      char: bioSymbols[Math.floor(Math.random() * bioSymbols.length)],
      size: Math.random() * 10 + 10, opacity: Math.random() * 0.15 + 0.05,
      hue: [255, 170, 320, 290][Math.floor(Math.random() * 4)],
      rot: Math.random() * 360, rotSpeed: (Math.random() - 0.5) * 0.5,
    });
  }

  function drawBg() {
    lbg.clearRect(0, 0, lbgCanvas.width, lbgCanvas.height);
    for (let i = 0; i < mols.length; i++) {
      const m = mols[i];
      m.x += m.vx; m.y += m.vy;
      if (m.x < 0) m.x = lbgCanvas.width; if (m.x > lbgCanvas.width) m.x = 0;
      if (m.y < 0) m.y = lbgCanvas.height; if (m.y > lbgCanvas.height) m.y = 0;
      lbg.beginPath(); lbg.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      lbg.fillStyle = `hsla(${m.hue},55%,55%,0.3)`; lbg.fill();
      for (let j = i + 1; j < mols.length; j++) {
        const m2 = mols[j];
        const d = Math.hypot(m.x - m2.x, m.y - m2.y);
        if (d < 120) {
          lbg.beginPath(); lbg.moveTo(m.x, m.y); lbg.lineTo(m2.x, m2.y);
          lbg.strokeStyle = `rgba(108,99,255,${0.12 * (1 - d / 120)})`; lbg.lineWidth = 0.8; lbg.stroke();
        }
      }
    }
    syms.forEach(s => {
      s.x += s.vx; s.y += s.vy; s.rot += s.rotSpeed;
      if (s.x < -30) s.x = lbgCanvas.width + 30; if (s.x > lbgCanvas.width + 30) s.x = -30;
      if (s.y < -30) s.y = lbgCanvas.height + 30; if (s.y > lbgCanvas.height + 30) s.y = -30;
      lbg.save(); lbg.translate(s.x, s.y); lbg.rotate(s.rot * Math.PI / 180);
      lbg.font = `${s.size}px 'Courier New',monospace`;
      lbg.fillStyle = `hsla(${s.hue},50%,45%,${s.opacity})`;
      lbg.textAlign = 'center'; lbg.textBaseline = 'middle'; lbg.fillText(s.char, 0, 0);
      lbg.restore();
    });
    requestAnimationFrame(drawBg);
  }
  drawBg();

  /* ─── DNA Helix: animated double helix drawn on a canvas element ─── */
  const dnaContainer = document.getElementById('loader-dna');
  const dnaCanvas = document.createElement('canvas');
  dnaCanvas.width = 120; dnaCanvas.height = 200;
  dnaCanvas.style.cssText = 'display:block;margin:0 auto';
  dnaContainer.appendChild(dnaCanvas);
  const dc = dnaCanvas.getContext('2d');
  let dnaAngle = 0;

  function drawDNA() {
    dc.clearRect(0, 0, 120, 200);
    for (let i = 0; i < 16; i++) {
      const y = 10 + i * 12, phase = dnaAngle + i * 0.45;
      const sin = Math.sin(phase), depth = Math.cos(phase), spread = sin * 40;
      const x1 = 60 - spread, x2 = 60 + spread;
      const s1 = 3 + depth * 1.5, s2 = 3 - depth * 1.5;
      const a1 = 0.5 + depth * 0.4, a2 = 0.5 - depth * 0.4;
      dc.beginPath(); dc.moveTo(x1, y); dc.lineTo(x2, y);
      const g = dc.createLinearGradient(x1, y, x2, y);
      g.addColorStop(0, `rgba(108,99,255,${Math.max(0.1, a1 * 0.4)})`);
      g.addColorStop(0.5, `rgba(192,132,252,0.2)`);
      g.addColorStop(1, `rgba(0,201,167,${Math.max(0.1, a2 * 0.4)})`);
      dc.strokeStyle = g; dc.lineWidth = 1.5; dc.stroke();
      dc.beginPath(); dc.arc(x1, y, Math.max(1, s1), 0, Math.PI * 2);
      dc.fillStyle = `rgba(108,99,255,${Math.max(0.2, a1)})`;
      dc.shadowColor = `rgba(108,99,255,${a1 * 0.5})`; dc.shadowBlur = 6; dc.fill();
      dc.beginPath(); dc.arc(x2, y, Math.max(1, s2), 0, Math.PI * 2);
      dc.fillStyle = `rgba(0,201,167,${Math.max(0.2, a2)})`;
      dc.shadowColor = `rgba(0,201,167,${a2 * 0.5})`; dc.shadowBlur = 6; dc.fill();
      dc.shadowBlur = 0;
    }
    dnaAngle += 0.035;
    requestAnimationFrame(drawDNA);
  }
  drawDNA();

  /* ─── Load all text content from data/loader.json ─── */
  /* JSON fields: title, readyText, readyName, readySuffix, buttonText, logs[] */
  fetch('data/loader.json').then(r => r.json()).then(data => {
    document.querySelector('.loader-label').textContent = data.title;
    const ready = document.getElementById('loader-ready');
    ready.innerHTML = `${data.readyText} <span class="ready-name">${data.readyName}</span>${data.readySuffix}`;
    const btn = document.getElementById('loader-enter');
    btn.textContent = data.buttonText;

    // Console logs: each entry has a delay (t) and HTML text, shown one at a time
    const con = document.getElementById('loader-console');
    data.logs.forEach(({ t, text }) => {
      setTimeout(() => {
        const now = new Date();
        const ts = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0') + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0') + ':' + String(now.getSeconds()).padStart(2,'0') + '.' + String(now.getMilliseconds()).padStart(3,'0');
        const line = document.createElement('div');
        line.className = 'log-line';
        line.innerHTML = text.replace(/\[[\d.]+\]/, `[${ts}]`);
        con.appendChild(line);
        while (con.children.length > 5) con.removeChild(con.firstChild);
      }, t);
    });

    // Show ready message at 3.2s, button at 3.6s
    setTimeout(() => ready.classList.add('visible'), 3200);
    setTimeout(() => btn.classList.add('visible'), 3600);

    // Click handler: warp animation (speed lines + zoom blur + dark overlay) → navigate to main.html
    btn.addEventListener('click', () => {
      btn.style.pointerEvents = 'none';
      sessionStorage.setItem('bionex_loaded', '1');

      const loader = document.getElementById('loader');
      // 40 speed lines radiating from center in theme colors
      const linesDiv = document.createElement('div');
      linesDiv.style.cssText = 'position:fixed;inset:0;z-index:950;pointer-events:none;overflow:hidden';
      const colors = ['#a78bfa','#34d399','#f9a8d4','#fb7185','#ffffff'];
      for (let i = 0; i < 40; i++) {
        const line = document.createElement('div');
        const angle = (i / 40) * 360;
        const delay = (Math.random() * 0.4).toFixed(2);
        line.style.cssText = `position:absolute;left:50%;top:50%;width:1.5px;height:0;opacity:0;background:linear-gradient(transparent,${colors[i%5]},transparent);transform-origin:center top;transform:rotate(${angle}deg);animation:lineGrow 1s ${delay}s cubic-bezier(0.4,0,0.2,1) forwards`;
        linesDiv.appendChild(line);
      }
      document.body.appendChild(linesDiv);

      // Zoom + blur loader content out smoothly
      loader.style.transition = 'transform 1.4s cubic-bezier(0.4,0,0.2,1), filter 1.4s ease, opacity 1.2s ease 0.2s';
      loader.style.transform = 'scale(2.5)';
      loader.style.filter = 'blur(12px)';
      loader.style.opacity = '0';

      // Dark overlay — reads --bg from CSS so it matches main.html background seamlessly
      const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#09080e';
      const overlay = document.createElement('div');
      overlay.style.cssText = `position:fixed;inset:0;z-index:960;background:${bgColor};opacity:0;transition:opacity 0.6s ease 0.8s`;
      document.body.appendChild(overlay);
      requestAnimationFrame(() => { overlay.style.opacity = '1'; });

      // Navigate to main site after animation completes
      setTimeout(() => { window.location.href = 'main.html'; }, 1500);
    });
  });

  const style = document.createElement('style');
  style.textContent = `@keyframes lineGrow{0%{height:0;opacity:0.8}60%{opacity:0.6}100%{height:45vh;opacity:0}}`;
  document.head.appendChild(style);
})();
