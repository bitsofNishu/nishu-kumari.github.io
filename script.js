/* ═══ MAIN SITE — script.js (JSON-driven) ═══ */
(function () {
  'use strict';

  /* ─── Redirect to loader if refreshed / accessed directly ─── */
  if (sessionStorage.getItem('bionex_loaded')) {
    sessionStorage.removeItem('bionex_loaded');
  } else {
    window.location.replace('index.html');
    return;
  }

  const $ = s => document.querySelector(s);       // Shorthand: select one element
  const $$ = s => document.querySelectorAll(s);    // Shorthand: select all elements
  const isMobile = matchMedia('(max-width:768px)').matches;

  /* ═══ DATA LOADING — Fetch all JSON files in parallel, then render each section ═══ */
  const load = f => fetch(`data/${f}`).then(r => r.json());

  Promise.all([
    load('hero.json'),
    load('about.json'),
    load('education.json'),
    load('projects.json'),
    load('skills.json'),
    load('certs.json'),
    load('contact.json'),
    load('gallery.json'),
  ]).then(([hero, about, edu, projects, skills, certs, contact, gallery]) => {
    renderHero(hero, about);
    renderAbout(about);
    renderEducation(edu);
    renderProjects(projects);
    renderSkills(skills);
    renderCerts(certs);
    renderGallery(gallery);
    renderContact(contact);
    initAnimations();
  });

  /* ═══ RENDERERS — Each function takes JSON data and injects HTML into its container ═══ */

  /* Hero: name, rotating taglines (typewriter effect), CTA buttons, profile avatar */

  function renderHero(h, about) {
    $('#hero').innerHTML = `
      <div class="hero-content reveal">
        <p class="hero-tag">SYSTEM :: <span class="status-online">ONLINE</span></p>
        <h1 class="hero-name"><span class="neon-text">${h.name}</span></h1>
        <p class="hero-subtitle typing-target"></p>
        <div class="hero-cta">${h.ctaButtons.map(b =>
          `<a href="${b.href}" class="btn-${b.style}">${b.text}</a>`).join('')}</div>
      </div>
      <div class="hero-avatar">
        <div class="avatar-wrap">
          <div class="avatar-ring"></div><div class="avatar-ring r2"></div>
          <div class="avatar-photo"><img src="${about.profileImage}" alt="${h.name}"><div class="avatar-scanline"></div></div>
        </div>
        <span class="avatar-name">${h.name.toUpperCase()}</span>
        <span class="avatar-status">● VERIFIED</span>
      </div>`;
    // Typewriter: types a line, pauses, deletes, moves to next line, loops forever
    const tt = $('.typing-target');
    let lineIdx = 0, charIdx = 0, deleting = false;
    function typeLoop() {
      const cur = h.taglines[lineIdx];
      if (!deleting) {
        tt.textContent = cur.slice(0, ++charIdx);
        if (charIdx === cur.length) { setTimeout(() => { deleting = true; typeLoop(); }, 2000); return; }
        setTimeout(typeLoop, 50 + Math.random() * 40);
      } else {
        tt.textContent = cur.slice(0, --charIdx);
        if (charIdx === 0) { deleting = false; lineIdx = (lineIdx + 1) % h.taglines.length; setTimeout(typeLoop, 400); return; }
        setTimeout(typeLoop, 30);
      }
    }
    setTimeout(typeLoop, 500);
  }

  /* About: data rows (label/value pairs) + bio paragraph */
  function renderAbout(a) {
    $('#about-content').innerHTML = `
      <div class="about-data">
        ${a.fields.map(f => `<div class="data-row"><span class="data-label">${f.label}</span><span class="data-value">${f.value}</span></div>`).join('')}
        <p class="about-bio">${a.bio}</p>
      </div>`;
  }

  /* Education: ascending vertical timeline — Class X at bottom, latest at top */
  function renderEducation(edu) {
    const el = $('#edu-timeline');
    edu.forEach((e, i) => {
      const badge = e.status === 'complete'
        ? '<span class="edu-badge complete">✓ COMPLETE</span>'
        : '<span class="edu-badge progress">◉ IN PROGRESS</span>';
      el.innerHTML += `
        <div class="edu-node" style="--i:${i}"><div class="edu-dot"></div>
          <div class="edu-card">
            <div class="edu-card-header"><img class="edu-logo" src="${e.logo}" alt="${e.board}"><span class="edu-board">${e.board}</span></div>
            <div class="edu-card-body">
              <div class="edu-left"><span class="edu-level">${e.level}</span><span class="edu-school">${e.school}</span></div>
              <div class="edu-right"><span class="edu-year">${e.year}</span>${badge}</div>
            </div>
          </div>
        </div>`;
    });
  }

  /* Projects: grid of glass cards with status badges, tags, and mouse-follow glow */
  function renderProjects(projects) {
    const el = $('#projects-grid');
    const statusLabel = { live: '● LIVE', complete: '● COMPLETE', progress: '● IN PROGRESS', future: '● FOR FUTURE' };
    projects.forEach(p => {
      el.innerHTML += `
        <div class="project-card reveal" data-tilt><div class="card-glow"></div>
          <div class="card-header"><span class="card-id">#${p.id}</span><span class="card-status ${p.status}">${statusLabel[p.status]}</span></div>
          <h3 class="card-title">${p.title}</h3>
          <p class="card-desc">${p.desc}</p>
          <div class="card-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
          <a href="${p.link}" class="card-link">ACCESS FILE →</a>
        </div>`;
    });
  }

  /* Skills: grid cards with animated gradient fill bars (animate on scroll into view) */
  function renderSkills(skills) {
    const el = $('#skills-grid');
    skills.forEach(s => {
      el.innerHTML += `
        <div class="skill-card"><img class="skill-icon" src="${s.icon}" alt="${s.name}">
          <span class="skill-name">${s.name}</span>
          <div class="skill-bar"><div class="skill-fill" style="--pct:${s.level}"></div></div>
        </div>`;
    });
  }

  /* Certs: clickable cards that open PDF in a full-screen modal iframe */
  function renderCerts(certs) {
    const el = $('#certs-grid');
    const modal = $('#cert-modal'), viewer = $('#cert-viewer'), close = $('#cert-modal-close');
    certs.forEach((c, i) => {
      const card = document.createElement('div');
      card.className = 'cert-card';
      card.innerHTML = `<div class="cert-provider-row"><img class="cert-logo" src="${c.logo}" alt="${c.provider}" title="${c.provider}"><span class="cert-provider-name">${c.provider}</span></div><span class="cert-title">${c.title}</span>
        <div class="cert-meta"><span class="cert-date">${c.date}</span><span class="cert-id">#CERT-${String(i+1).padStart(3,'0')}</span></div>
        <div class="cert-bar"><div class="cert-bar-fill"></div></div><span class="cert-view">VIEW CERTIFICATE →</span>`;
      card.addEventListener('click', () => { viewer.src = c.pdf; modal.classList.add('open'); });
      el.appendChild(card);
    });
    close.addEventListener('click', () => { modal.classList.remove('open'); viewer.src = ''; });
    modal.addEventListener('click', e => { if (e.target === modal) { modal.classList.remove('open'); viewer.src = ''; } });
  }

  /* Gallery: photos hanging from glowing stars via threads, polaroid-style frames */
  function renderGallery(gallery) {
    const el = $('#gallery-grid');
    gallery.forEach(g => {
      el.innerHTML += `
        <div class="gallery-item">
          <div class="gallery-thread"></div>
          <div class="gallery-frame"><img src="${g.src}" alt="${g.caption}" loading="lazy"></div>
          <div class="gallery-caption">${g.caption}</div>
        </div>`;
    });
  }

  /* Contact: interactive terminal with commands (help, about, email, etc.) + social links */
  function renderContact(c) {
    $('#contact-content').style.width = '100%';
    $('#contact-content').style.maxWidth = '1100px';
    $('#contact-content').innerHTML = `
      <div class="contact-terminal reveal">
        <div class="terminal-bar"><span class="terminal-dot red"></span><span class="terminal-dot yellow"></span><span class="terminal-dot green"></span><span class="terminal-title">nishu_comm_v1.0</span></div>
        <div class="terminal-body">
          <div id="terminal-output">
            <p class="term-line"><span class="term-prompt">${c.prompt}</span> init_contact_protocol</p>
            <p class="term-line sys">Establishing secure channel...</p>
            <p class="term-line sys">Connection verified. Ready for input.</p>
            <p class="term-line sys">Type <span class="hl">help</span> for available commands.</p>
          </div>
          <div class="terminal-input-row"><span class="term-prompt">${c.prompt}</span><input type="text" id="terminal-input" autocomplete="off" placeholder="type a command..."></div>
        </div>
      </div>
      <div class="contact-links reveal">${c.links.map(l => `<a href="${l.href}" target="_blank" class="contact-node">${l.icon} ${l.label}</a>`).join('')}</div>`;
    // Terminal commands — built from contact.json "commands" + dynamic link/skill data
    const termIn = $('#terminal-input'), termOut = $('#terminal-output');
    const cmds = Object.assign({}, c.commands || {});
    // Auto-generate link commands from contact links
    c.links.forEach(l => {
      const key = l.label.toLowerCase();
      const url = l.href.replace('mailto:', '');
      cmds[key] = [`→ <a href="${l.href}" target="_blank">${url}</a>`];
    });
    // Auto-generate skills command from skills.json (loaded earlier)
    load('skills.json').then(skills => {
      cmds.skills = skills.map(s => {
        const filled = Math.round(s.level / 10);
        const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
        return `${s.name} ${bar} ${s.level}%`;
      });
    });
    termIn.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const cmd = termIn.value.trim().toLowerCase(); termIn.value = '';
      if (!cmd) return;
      addLine(`<span class="term-prompt">${c.prompt}</span> ${cmd}`);
      if (cmd === 'clear') { termOut.innerHTML = ''; return; }
      (cmds[cmd] || [`Command not found: ${cmd}. Type <span class="hl">help</span> for options.`]).forEach(l => addLine(l, 'sys'));
      termOut.parentElement.scrollTop = termOut.parentElement.scrollHeight;
    });
    function addLine(html, cls) {
      const p = document.createElement('p');
      p.className = 'term-line' + (cls ? ' ' + cls : '');
      p.innerHTML = html; termOut.appendChild(p);
    }
  }

  /* ═══ ANIMATIONS — Initialized after all sections are rendered ═══ */
  function initAnimations() {
    // Custom cursor glow — follows mouse, enlarges on interactive elements
    const glow = $('#cursor-glow');
    if (!isMobile) {
      document.addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });
      $$('a,button,input,.project-card,.cert-card').forEach(el => {
        el.addEventListener('mouseenter', () => glow.classList.add('hover'));
        el.addEventListener('mouseleave', () => glow.classList.remove('hover'));
      });
    }

    // Scroll reveal — elements with .reveal fade up when scrolled into view
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    $$('.reveal').forEach(el => revealObs.observe(el));

    // Skill bars — animate fill width when card scrolls into view
    const skillObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('animated'); });
    }, { threshold: 0.3 });
    $$('.skill-card').forEach(el => skillObs.observe(el));

    // Nav rail — highlights active section dot based on scroll position
    const railNodes = $$('.rail-node');
    const navObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          railNodes.forEach(n => n.classList.remove('active'));
          const m = $(`.rail-node[href="#${e.target.id}"]`);
          if (m) m.classList.add('active');
        }
      });
    }, { threshold: 0.3 });
    $$('.section').forEach(s => navObs.observe(s));

    // Project card glow — radial gradient follows mouse position inside card
    $$('.project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });

    // Smooth scroll — all anchor links scroll smoothly instead of jumping
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => { e.preventDefault(); $(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' }); });
    });

    // Sound toggle — optional sci-fi beep on button/link clicks
    const soundBtn = $('#sound-toggle');
    let soundOn = false, audioCtx;
    soundBtn.addEventListener('click', () => { soundOn = !soundOn; soundBtn.textContent = soundOn ? '🔊' : '🔇'; if (soundOn) beep(600, 0.08); });
    function beep(f, d) {
      if (!soundOn) return;
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = 'sine'; o.frequency.value = f; g.gain.value = 0.05;
      o.connect(g).connect(audioCtx.destination); o.start();
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + d); o.stop(audioCtx.currentTime + d);
    }
    $$('a,button').forEach(el => el.addEventListener('click', () => beep(800, 0.06)));

    // ─── CONSTELLATION CONNECT GAME ───
    initStarGame(beep, soundOn);
  }

  function initStarGame(beep) {
    const canvas = $('#stargame-canvas');
    if (!canvas) return;
    const gc = canvas.getContext('2d');
    const wrap = canvas.parentElement;
    const toast = $('#stargame-toast');
    let gStars = [], connections = [], selected = null, manifestations = [], mIdx = 0, toastTimer;

    // Load manifestations from JSON
    load('manifestations.json').then(data => {
      manifestations = data;
      // Shuffle
      for (let i = manifestations.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [manifestations[i], manifestations[j]] = [manifestations[j], manifestations[i]];
      }
    });

    function showMantra() {
      if (!manifestations.length) return;
      toast.textContent = manifestations[mIdx % manifestations.length];
      toast.classList.add('show');
      mIdx++;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
    }
    const STAR_N = 35, HIT_R = 18;

    function resizeGame() {
      canvas.width = wrap.clientWidth;
      canvas.height = wrap.clientHeight;
      seedStars();
    }

    function seedStars() {
      gStars = [];
      for (let i = 0; i < STAR_N; i++) {
        const colors = [{r:255,g:255,b:255},{r:200,g:220,b:255},{r:255,g:240,b:200},{r:255,g:200,b:140},{r:255,g:180,b:200}];
        const c = colors[Math.floor(Math.random() * colors.length)];
        gStars.push({
          x: 40 + Math.random() * (canvas.width - 80),
          y: 40 + Math.random() * (canvas.height - 80),
          r: Math.random() * 2 + 1.5, color: c,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.02 + Math.random() * 0.02,
        });
      }
      connections = []; selected = null;
      updateCount();
    }

    function updateCount() {
      const el = $('#stargame-count');
      if (el) el.textContent = connections.length + ' star link' + (connections.length !== 1 ? 's' : '') + ' ✦';
    }

    function drawGame() {
      gc.clearRect(0, 0, canvas.width, canvas.height);
      // Draw connections
      connections.forEach(([a, b]) => {
        gc.beginPath(); gc.moveTo(gStars[a].x, gStars[a].y); gc.lineTo(gStars[b].x, gStars[b].y);
        const sa = gStars[a].color, sb = gStars[b].color;
        gc.strokeStyle = `rgba(${(sa.r+sb.r)/2},${(sa.g+sb.g)/2},${(sa.b+sb.b)/2},0.5)`;
        gc.lineWidth = 1.5; gc.shadowColor = gc.strokeStyle; gc.shadowBlur = 6; gc.stroke();
        gc.shadowBlur = 0; gc.lineWidth = 1;
      });
      // Draw stars
      gStars.forEach((s, i) => {
        s.twinkle += s.twinkleSpeed;
        const alpha = 0.5 + Math.sin(s.twinkle) * 0.3;
        const glow = 4 + Math.sin(s.twinkle) * 3;
        gc.beginPath(); gc.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        gc.fillStyle = `rgba(${s.color.r},${s.color.g},${s.color.b},${alpha})`;
        gc.shadowColor = `rgba(${s.color.r},${s.color.g},${s.color.b},${alpha * 0.7})`;
        gc.shadowBlur = glow; gc.fill(); gc.shadowBlur = 0;
        // Highlight selected
        if (i === selected) {
          gc.beginPath(); gc.arc(s.x, s.y, HIT_R, 0, Math.PI * 2);
          gc.strokeStyle = `rgba(52,211,153,0.5)`; gc.lineWidth = 1.5; gc.stroke(); gc.lineWidth = 1;
        }
      });
      requestAnimationFrame(drawGame);
    }

    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
      const my = (e.clientY - rect.top) * (canvas.height / rect.height);
      let hit = -1;
      for (let i = 0; i < gStars.length; i++) {
        if (Math.hypot(gStars[i].x - mx, gStars[i].y - my) < HIT_R) { hit = i; break; }
      }
      if (hit === -1) { selected = null; return; }
      if (selected === null) { selected = hit; beep(600, 0.06); return; }
      if (selected === hit) { selected = null; return; }
      // Check duplicate
      const dup = connections.some(([a,b]) => (a===selected&&b===hit)||(a===hit&&b===selected));
      if (!dup) { connections.push([selected, hit]); beep(900, 0.08); showMantra(); }
      selected = null;
      updateCount();
    });

    $('#stargame-clear')?.addEventListener('click', () => { connections = []; selected = null; updateCount(); beep(400, 0.1); });

    resizeGame();
    window.addEventListener('resize', resizeGame);
    drawGame();
  }

  /* ═══ CONSTELLATION BACKGROUND — 120 stars with realistic colors, twinkle, and connections ═══ */
  const cCanvas = $('#constellation-bg'), ctx = cCanvas.getContext('2d');
  let mouse = { x: -999, y: -999 }, stars = [];
  const STAR_COUNT = 120, CONNECT_DIST = 160;

  function resizeC() { cCanvas.width = innerWidth; cCanvas.height = innerHeight; }
  resizeC(); window.addEventListener('resize', resizeC);
  if (!isMobile) document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  // 6 realistic star temperature colors: white dwarf, blue-white, yellow, orange, pink nebula, cool blue
  const starColors = [
    { r: 255, g: 255, b: 255 }, { r: 200, g: 220, b: 255 }, { r: 255, g: 240, b: 200 },
    { r: 255, g: 200, b: 140 }, { r: 255, g: 180, b: 200 }, { r: 180, g: 200, b: 255 },
  ];
  for (let i = 0; i < STAR_COUNT; i++) {
    const c = starColors[Math.floor(Math.random() * starColors.length)];
    stars.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 2.5 + 0.5,
      color: c, twinkle: Math.random() * Math.PI * 2, twinkleSpeed: 0.015 + Math.random() * 0.025 });
  }

  // Biology fun facts — loaded from data/funfacts.json, shown as tooltips when hovering near stars
  let funFacts = [];
  load('funfacts.json').then(data => {
    funFacts = data;
    stars.forEach(s => { s.fact = funFacts[Math.floor(Math.random() * funFacts.length)]; });
  });

  let activeStarIdx = -1;
  function drawConstellation() {
    ctx.clearRect(0, 0, cCanvas.width, cCanvas.height);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.x += s.vx; s.y += s.vy;
      if (s.x < 0) s.x = cCanvas.width; if (s.x > cCanvas.width) s.x = 0;
      if (s.y < 0) s.y = cCanvas.height; if (s.y > cCanvas.height) s.y = 0;
      s.twinkle += s.twinkleSpeed;
      const alpha = 0.4 + Math.sin(s.twinkle) * 0.35;
      const glow = 4 + Math.sin(s.twinkle) * 4;
      const {r: cr, g: cg, b: cb} = s.color;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
      ctx.shadowColor = `rgba(${cr},${cg},${cb},${alpha * 0.7})`;
      ctx.shadowBlur = glow; ctx.fill(); ctx.shadowBlur = 0;
      if (i === activeStarIdx) {
        ctx.beginPath(); ctx.arc(s.x, s.y, 10, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.5)`; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r + 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},0.9)`; ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(${cr},${cg},${cb},0.6)`; ctx.fill(); ctx.shadowBlur = 0; ctx.lineWidth = 1;
      }
      for (let j = i + 1; j < stars.length; j++) {
        const s2 = stars[j], d = Math.hypot(s.x - s2.x, s.y - s2.y);
        if (d < CONNECT_DIST) {
          ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s2.x, s2.y);
          ctx.strokeStyle = `rgba(200,210,230,${0.08 * (1 - d / CONNECT_DIST)})`; ctx.stroke();
        }
      }
      const dm = Math.hypot(s.x - mouse.x, s.y - mouse.y);
      if (dm < 200) {
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(255,220,180,${0.25 * (1 - dm / 200)})`; ctx.lineWidth = 1.5; ctx.stroke(); ctx.lineWidth = 1;
      }
    }
    requestAnimationFrame(drawConstellation);
  }
  drawConstellation();

  // Star tooltips
  const tooltip = $('#star-tooltip');
  document.addEventListener('mousemove', e => {
    let closest = -1, closestD = 20;
    for (let i = 0; i < stars.length; i++) {
      const d = Math.hypot(e.clientX - stars[i].x, e.clientY - stars[i].y);
      if (d < closestD) { closest = i; closestD = d; }
    }
    if (closest !== -1) {
      if (closest !== activeStarIdx) { activeStarIdx = closest; tooltip.innerHTML = '<span class="tip-label">✦ DID YOU KNOW</span>' + stars[closest].fact; }
      tooltip.style.left = (e.clientX + 16) + 'px'; tooltip.style.top = (e.clientY - 10) + 'px';
      tooltip.classList.add('visible');
    } else { activeStarIdx = -1; tooltip.classList.remove('visible'); }
  });

  /* ═══ BIO-PARTICLES — Floating circular outlines + dots in background ═══ */
  const bCanvas = $('#bio-particles'), bctx = bCanvas.getContext('2d');
  let particles = [];
  function resizeB() { bCanvas.width = innerWidth; bCanvas.height = innerHeight; }
  resizeB(); window.addEventListener('resize', resizeB);
  for (let i = 0; i < 25; i++) {
    particles.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      r: Math.random() * 15 + 5, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.15 + 0.08, hue: Math.random() > 0.5 ? 255 : 320 });
  }
  function drawParticles() {
    bctx.clearRect(0, 0, bCanvas.width, bCanvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -50) p.x = bCanvas.width + 50; if (p.x > bCanvas.width + 50) p.x = -50;
      if (p.y < -50) p.y = bCanvas.height + 50; if (p.y > bCanvas.height + 50) p.y = -50;
      bctx.beginPath(); bctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      bctx.strokeStyle = `hsla(${p.hue},60%,60%,${p.opacity})`; bctx.lineWidth = 1; bctx.stroke();
      bctx.beginPath(); bctx.arc(p.x, p.y, p.r * 0.3, 0, Math.PI * 2);
      bctx.fillStyle = `hsla(${p.hue},60%,65%,${p.opacity * 1.5})`; bctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
})();
