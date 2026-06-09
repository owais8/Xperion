/* ════════════════════════════════════════════════════════════════════
   XPERION  ·  v3  Motion System
   Custom cursor · Magnetic CTAs · Tilt · Scroll reveal · Counters
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* Reduced-motion: freeze SMIL/SVG animations (blog illustrations, signal
     traces) to a settled end state so nothing keeps moving. */
  if (reduced) {
    try {
      $$('svg').forEach((s) => {
        if (s.setCurrentTime) s.setCurrentTime(60);
        if (s.pauseAnimations) s.pauseAnimations();
      });
    } catch (e) {}
  }

  /* (Custom-cursor handler removed — the .xp-cursor markup was retired
     site-wide, so this block was permanently inert. Native cursor is used.) */

  /* ── NAV SCROLLED + PROGRESS BAR ─────────────────────────────── */
  const nav = $('#xpNav');
  const prog = $('#xpProgress');
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 24);
    if (prog) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ── MAGNETIC BUTTONS ────────────────────────────────────────── */
  if (canHover && !reduced) {
    $$('[data-magnetic], .xp-cta, .btn-primary, .form-submit').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ── CARD TILT + CURSOR SPOTLIGHT ────────────────────────────── */
  if (canHover && !reduced) {
    $$('[data-tilt], .cap-card, .related-card, .team-card, .number-card, .pm-card, .spotlight-card, .phase, .outcome-card, .model-card, .industry-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', (px * 100) + '%');
        card.style.setProperty('--my', (py * 100) + '%');
        if (card.matches('[data-tilt]')) {
          const rx = (py - 0.5) * -4;
          const ry = (px - 0.5) * 4;
          card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        }
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ── SCROLL REVEAL ───────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal, .reveal-stagger').forEach(el => io.observe(el));
  } else {
    $$('.reveal, .reveal-stagger').forEach(el => el.classList.add('in-view'));
  }

  /* ── COUNTER ANIMATIONS ──────────────────────────────────────── */
  function animate(el) {
    if (reduced) return;
    const raw = el.textContent.trim();
    const m = raw.match(/^(\d+(?:[.,]\d+)?)/);
    if (!m) return;
    const target = parseFloat(m[1].replace(',', '.'));
    if (!isFinite(target) || target === 0) return;
    const suffix = raw.slice(m[0].length);
    const isInt = !m[1].includes('.') && !m[1].includes(',');
    const start = performance.now();
    const dur = 1400;
    function tick(t) {
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      const v = target * eased;
      el.textContent = (isInt ? Math.round(v) : v.toFixed(1)) + suffix;
      if (k < 1) requestAnimationFrame(tick);
      else el.textContent = m[1] + suffix;
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    const seen = new WeakSet();
    const nio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !seen.has(e.target)) {
          seen.add(e.target);
          animate(e.target);
        }
      });
    }, { threshold: 0.5 });
    $$('.page-hero-stat-num, .number-card .num, .outcome-num').forEach(el => nio.observe(el));
  }

  /* ── FAQ accordion: close other items when opening one ─────── */
  $$('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        $$('.faq-item').forEach(other => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ── SMOOTH SCROLL FOR ANCHORS ───────────────────────────────── */
  $$('a[href^="#"]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;
    a.addEventListener('click', (e) => {
      const t = $(href);
      if (!t) return;
      e.preventDefault();
      const top = t.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  /* ── MOBILE NAV ──────────────────────────────────────────────────
     The markup ships a .xp-burger but no drawer. Build one once from the
     live desktop nav (.xp-nav-menu + .xp-cta) so links never drift, then
     wire open/close with focus return, ESC, and scroll-lock. Fixes the
     dead burger across every connected page in one place. */
  (function mobileNav() {
    const burger = $('.xp-burger');
    const menu = $('.xp-nav-menu');
    if (!burger || !menu) return;

    let drawer = $('#xpMobileNav');
    if (!drawer) {
      drawer = document.createElement('nav');
      drawer.id = 'xpMobileNav';
      drawer.className = 'xp-mobile-nav';
      drawer.setAttribute('aria-label', 'Mobile navigation');
      drawer.setAttribute('aria-hidden', 'true');

      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'xp-mnav-close';
      close.setAttribute('aria-label', 'Close menu');
      close.setAttribute('data-close', '');
      close.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      drawer.appendChild(close);

      // Clone the live menu so dropdown rows + direct links come along.
      drawer.appendChild(menu.cloneNode(true));
      // Carry the primary CTA to the bottom of the drawer.
      const cta = $('.xp-cta');
      if (cta) {
        const c = cta.cloneNode(true);
        c.style.transform = '';
        drawer.appendChild(c);
      }
      document.body.appendChild(drawer);
    }

    let lastFocus = null;
    const open = () => {
      lastFocus = document.activeElement;
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      burger.setAttribute('aria-expanded', 'true');
      burger.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      const first = drawer.querySelector('a, button');
      if (first) first.focus({ preventScroll: true });
    };
    const close = () => {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      burger.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    };

    burger.setAttribute('aria-controls', 'xpMobileNav');
    burger.setAttribute('aria-expanded', 'false');
    burger.addEventListener('click', () => drawer.classList.contains('open') ? close() : open());
    drawer.addEventListener('click', (e) => {
      if (e.target.closest('a[href]') || e.target.closest('[data-close]')) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) close();
    });
    // Auto-close if the viewport grows back to desktop while open.
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && drawer.classList.contains('open')) close();
    }, { passive: true });
  })();

  /* ── ACTIVE NAV LINK BASED ON PATHNAME ───────────────────────── */
  const here = (location.pathname.split('/').pop() || '').toLowerCase();
  if (here) {
    $$('.xp-nav-item').forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href && href === here) a.classList.add('active');
    });
  }

  /* ── PAGE TRANSITIONS, v3.4 ─────────────────────────────────
     Intercept same-origin nav links, fade veil in, then navigate.
     On the destination, body.is-entering fires the rise-in animation.
     Hooks: prefers-reduced-motion disables veil entirely.
     pageshow handles bfcache back-nav (Safari/Firefox restore from cache). */
  if (!reduced) {
    // Ensure veil exists. Pages that pre-bake it skip creation.
    let veil = $('.xp-page-veil');
    if (!veil) {
      veil = document.createElement('div');
      veil.className = 'xp-page-veil';
      veil.setAttribute('aria-hidden', 'true');
      document.body.appendChild(veil);
    }

    // Mark page entering so the rise animation runs once per real load.
    document.body.classList.add('is-entering');
    const clearEntering = () => document.body.classList.remove('is-entering');
    // Clear after the longest enter animation finishes (var(--d-expr) = 420ms).
    setTimeout(clearEntering, 480);

    // Same-origin internal link interceptor.
    const VEIL_HOLD = 240; // matches --d-std + a hair
    const isInternal = (a) => {
      try {
        const url = new URL(a.href, location.href);
        if (url.origin !== location.origin) return false;
        if (url.pathname === location.pathname && url.hash) return false; // anchor within page
        if (a.target && a.target !== '_self') return false;
        if (a.hasAttribute('download')) return false;
        if (a.getAttribute('rel') === 'external') return false;
        const ext = (url.pathname.split('.').pop() || '').toLowerCase();
        if (ext && !['html', 'htm', ''].includes(ext)) return false;
        return true;
      } catch (e) { return false; }
    };
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const a = e.target.closest('a[href]');
      if (!a || !isInternal(a)) return;
      e.preventDefault();
      const href = a.getAttribute('href');
      document.body.classList.add('is-leaving');
      // Failsafe: if navigation doesn't happen, lift the veil.
      const failsafe = setTimeout(() => document.body.classList.remove('is-leaving'), 1200);
      setTimeout(() => {
        clearTimeout(failsafe);
        location.assign(href);
      }, VEIL_HOLD);
    });

    // bfcache restore: if the user back-buttons to a cached page, clear the leaving state and re-run rise.
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        document.body.classList.remove('is-leaving');
        document.body.classList.remove('is-entering');
        // Force reflow then re-add to re-trigger animation.
        void document.body.offsetWidth;
        document.body.classList.add('is-entering');
        setTimeout(() => document.body.classList.remove('is-entering'), 480);
      }
    });
  }

  /* ════════════════════════════════════════════════════════════════
     SITE-WIDE v3.8: 3D scroll tilt + ambient constellation canvas
     Brought up from the landing page. Available to every connected
     page that links xperion.js.
     ════════════════════════════════════════════════════════════════ */
  const xpReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const xpQS  = (s, r = document) => r.querySelector(s);
  const xpQSA = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ── 3D SCROLL TILT ─────────────────────────────────────────────
     Adds rotateX/scale/translate as the element enters the viewport,
     settles to flat in the upper third, reverses on exit. Composite-
     only (transform + opacity). IntersectionObserver gates per-element
     work so offscreen sections cost nothing. */
  (function scroll3D() {
    if (xpReduced) return;
    const items = xpQSA('.scroll-3d');
    if (!items.length) return;
    const live = new Set();
    let raf = 0;
    const isMobile = () => window.innerWidth <= 768;
    function tick() {
      raf = 0;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const mobile = isMobile();
      const rotateMax = mobile ? 12 : 18;
      const scaleMin  = mobile ? 0.95 : 0.94;
      const translateMax = mobile ? 24 : 40;
      const opacityMin   = mobile ? 0.7 : 0.55;
      live.forEach(el => {
        const rect = el.getBoundingClientRect();
        const entryStart = vh;
        const entryEnd   = vh * 0.35;
        const entryRange = entryStart - entryEnd;
        const entryTrav  = entryStart - rect.top;
        const entryP = Math.max(0, Math.min(1, entryTrav / entryRange));
        const exitStart = vh * 0.4;
        const exitTrav  = exitStart - rect.bottom;
        const exitP = Math.max(0, Math.min(1, exitTrav / Math.max(1, exitStart)));
        const visible = Math.max(0, 1 - exitP) * entryP;
        const eased = 1 - Math.pow(1 - visible, 2.2);
        const rotate = rotateMax * (1 - eased);
        const scale  = scaleMin + (1 - scaleMin) * eased;
        const translateY = translateMax * (1 - eased);
        const opacity = opacityMin + (1 - opacityMin) * eased;
        el.style.setProperty('--s3d-rotate', rotate.toFixed(2) + 'deg');
        el.style.setProperty('--s3d-scale', scale.toFixed(3));
        el.style.setProperty('--s3d-translate', translateY.toFixed(1) + 'px');
        el.style.setProperty('--s3d-opacity', opacity.toFixed(2));
      });
    }
    function schedule() {
      if (raf || !live.size) return;
      raf = requestAnimationFrame(tick);
    }
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) live.add(e.target);
          else live.delete(e.target);
        });
        schedule();
      }, { rootMargin: '20% 0px 20% 0px' });
      items.forEach(el => io.observe(el));
    } else {
      items.forEach(el => live.add(el));
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    schedule();
  })();

  /* ── SECTION-FIELD CONSTELLATION CANVAS ─────────────────────────
     Any <canvas class="section-field"> on a page gets a drifting-
     particle constellation overlay. Renderer is composite-only at the
     DOM level (single canvas layer); pauses when offscreen. */
  function xpMakeField(canvas, opts) {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const density = (opts && opts.density) || 0.7;
    let W = 0, H = 0;
    let nodes = [];
    let rafId = 0;
    let running = false;
    function resize() {
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, Math.floor(r.width));
      H = Math.max(1, Math.floor(r.height));
      canvas.width  = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }
    function build() {
      nodes = [];
      const count = Math.round((W * H) / 18000 * density);
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: 0.6 + Math.random() * 1.4,
          a: 0.25 + Math.random() * 0.45,
          accent: Math.random() < 0.18
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -8) p.x = W + 8;
        if (p.x > W + 8) p.x = -8;
        if (p.y < -8) p.y = H + 8;
        if (p.y > H + 8) p.y = -8;
      });
      const linkDist = 140; const linkSq = linkDist * linkDist;
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y, d2 = dx*dx + dy*dy;
          if (d2 < linkSq) {
            const op = (1 - d2/linkSq) * 0.22;
            ctx.strokeStyle = 'rgba(0,201,167,' + op + ')';
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      nodes.forEach(p => {
        const col = p.accent ? '245,158,11' : '255,255,255';
        ctx.fillStyle = 'rgba(' + col + ',' + p.a + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
        if (p.accent) {
          ctx.fillStyle = 'rgba(245,158,11,0.12)';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r*4, 0, Math.PI*2); ctx.fill();
        }
      });
    }
    function tick() {
      if (!running) return;
      draw();
      rafId = requestAnimationFrame(tick);
    }
    function start() {
      if (running) return;
      running = true;
      canvas.classList.add('is-live');
      rafId = requestAnimationFrame(tick);
    }
    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    }
    let resizeRaf = 0;
    window.addEventListener('resize', () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resize);
    });
    resize();
    return { start, stop };
  }
  if (!xpReduced) {
    xpQSA('.section-field').forEach(c => {
      const field = xpMakeField(c, { density: 0.6 });
      if (!field) return;
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach(e => e.isIntersecting ? field.start() : field.stop());
        }, { rootMargin: '120px' });
        io.observe(c);
      } else {
        field.start();
      }
    });
  }

  /* ── HERO GRID FIELD ────────────────────────────────────────────
     Ports the landing hero's animated grid (#heroField, variant 'grid')
     to every connected-page hero. Injects a <canvas class="hero-field">
     into each .page-hero and renders a pulsing teal/amber node grid with
     data photons traveling along the edges, lighting nodes on arrival.
     Gated by reduced-motion; pauses offscreen via IntersectionObserver.
     The landing page ships its own inline engine and does not load this
     file, so there is no duplication there. */
  function xpMakeGridField(canvas, opts) {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const density = (opts && opts.density) || 1;
    let W = 0, H = 0, nodes = [], photons = [], rafId = 0, last = 0, running = false;

    function resize() {
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, Math.floor(r.width));
      H = Math.max(1, Math.floor(r.height));
      canvas.width  = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }
    function build() {
      nodes = []; photons = [];
      const step = Math.max(74, Math.min(W, H) / 9);
      const cols = Math.ceil(W / step) + 2;
      const rows = Math.ceil(H / step) + 2;
      const offX = (W - (cols - 1) * step) / 2;
      const offY = (H - (rows - 1) * step) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          nodes.push({ x: offX + c * step, y: offY + r * step, c: c, r: r,
            phase: Math.random() * Math.PI * 2,
            base: 0.06 + Math.random() * 0.10, lit: 0,
            accent: Math.random() < 0.12 });
        }
      }
      const pool = Math.round(7 * density);
      for (let i = 0; i < pool; i++) photons.push(spawnPhoton());
    }
    function spawnPhoton() {
      if (!nodes.length) return null;
      const n = nodes[Math.floor(Math.random() * nodes.length)];
      const dir = Math.floor(Math.random() * 4);
      const targets = nodes.filter(m => {
        if (dir === 0) return m.r === n.r && m.c === n.c + 1;
        if (dir === 1) return m.c === n.c && m.r === n.r + 1;
        if (dir === 2) return m.r === n.r && m.c === n.c - 1;
        if (dir === 3) return m.c === n.c && m.r === n.r - 1;
      });
      if (!targets.length) return spawnPhoton();
      const t = targets[0];
      return { from: n, to: t, progress: 0,
        speed: 0.4 + Math.random() * 0.5,
        accent: Math.random() < 0.22, delay: Math.random() * 2.4 };
    }
    function drawGrid(dt) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,255,255,0.045)';
      ctx.beginPath();
      const seen = new Set();
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          if ((m.r === n.r && Math.abs(m.c - n.c) === 1) ||
              (m.c === n.c && Math.abs(m.r - n.r) === 1)) {
            const key = i + '-' + j;
            if (seen.has(key)) continue;
            seen.add(key);
            ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y);
          }
        }
      }
      ctx.stroke();
      const now = performance.now() * 0.001;
      nodes.forEach(n => {
        n.lit *= 0.95;
        const pulse = 0.5 + 0.5 * Math.sin(now * 0.6 + n.phase);
        const a = Math.min(0.95, n.base * (0.7 + pulse * 0.6) + n.lit);
        const accent = n.accent;
        const color = accent ? 'rgba(245,158,11,' + a + ')' : 'rgba(0,201,167,' + a + ')';
        ctx.fillStyle = color;
        const radius = 1.1 + (accent ? 0.6 : 0.3) + n.lit * 2;
        ctx.beginPath(); ctx.arc(n.x, n.y, radius, 0, Math.PI * 2); ctx.fill();
        if (n.lit > 0.3) {
          ctx.fillStyle = accent ? 'rgba(245,158,11,' + (n.lit * 0.25) + ')' : 'rgba(0,201,167,' + (n.lit * 0.25) + ')';
          ctx.beginPath(); ctx.arc(n.x, n.y, radius * 4, 0, Math.PI * 2); ctx.fill();
        }
      });
      for (let i = 0; i < photons.length; i++) {
        const p = photons[i];
        if (!p) { photons[i] = spawnPhoton(); continue; }
        if (p.delay > 0) { p.delay -= dt; continue; }
        p.progress += p.speed * dt;
        if (p.progress >= 1) { p.to.lit = Math.min(1.4, p.to.lit + 0.85); photons[i] = spawnPhoton(); continue; }
        const x = p.from.x + (p.to.x - p.from.x) * p.progress;
        const y = p.from.y + (p.to.y - p.from.y) * p.progress;
        const trailX = p.from.x + (p.to.x - p.from.x) * Math.max(0, p.progress - 0.12);
        const trailY = p.from.y + (p.to.y - p.from.y) * Math.max(0, p.progress - 0.12);
        const grad = ctx.createLinearGradient(trailX, trailY, x, y);
        const col = p.accent ? '245,158,11' : '0,201,167';
        grad.addColorStop(0, 'rgba(' + col + ',0)');
        grad.addColorStop(1, 'rgba(' + col + ',0.95)');
        ctx.strokeStyle = grad; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(trailX, trailY); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(' + col + ',0.18)';
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
      }
    }
    function tick(t) {
      if (!running) return;
      const dt = Math.min(0.05, (t - last) * 0.001 || 0.016);
      last = t;
      ctx.clearRect(0, 0, W, H);
      drawGrid(dt);
      rafId = requestAnimationFrame(tick);
    }
    function start() {
      if (running) return;
      running = true; last = (window.performance && performance.now()) || 0;
      canvas.classList.add('is-live');
      rafId = requestAnimationFrame(tick);
    }
    function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = 0; }
    let resizeRaf = 0;
    window.addEventListener('resize', () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resize);
    });
    resize();
    return { start: start, stop: stop };
  }
  /* ════════════════════════════════════════════════════════════════
     SUB-PAGE HERO FIELD (.page-hero)
     Carries the landing hero's WebGL interlocking-loops field to every
     connected page. Three.js is loaded on demand; if WebGL or the lib is
     unavailable — or motion is reduced / small touch screen — it falls
     back to the 2D grid field so a hero is never blank.
     ════════════════════════════════════════════════════════════════ */
  (function pageHeroFields() {
    const heroes = xpQSA('.page-hero');
    if (!heroes.length) return;

    function start2D(hero) {
      if (xpReduced || hero.querySelector(':scope > .hero-field')) return;
      const cv = document.createElement('canvas');
      cv.className = 'hero-field';
      cv.setAttribute('aria-hidden', 'true');
      hero.appendChild(cv);
      const field = xpMakeGridField(cv, { density: 1 });
      if (!field) return;
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((es) => es.forEach(e => e.isIntersecting ? field.start() : field.stop()), { rootMargin: '100px' }).observe(cv);
      } else { field.start(); }
    }

    const smallTouch = window.matchMedia('(max-width: 700px)').matches && window.matchMedia('(pointer: coarse)').matches;
    let webglOK = false;
    if (!xpReduced && !smallTouch) {
      try { const t = document.createElement('canvas'); webglOK = !!(t.getContext('webgl') || t.getContext('experimental-webgl')); } catch (e) { webglOK = false; }
    }
    if (!webglOK) { heroes.forEach(start2D); return; }

    loadThree((THREE) => {
      if (!THREE) { heroes.forEach(start2D); return; }
      heroes.forEach((hero) => { try { heroLoopField(hero, THREE); } catch (e) { start2D(hero); } });
    });

    function loadThree(cb) {
      if (window.THREE) return cb(window.THREE);
      let s = document.querySelector('script[data-three]');
      if (s) { s.addEventListener('load', () => cb(window.THREE || null)); s.addEventListener('error', () => cb(null)); return; }
      s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      s.setAttribute('data-three', '');
      s.onload = () => cb(window.THREE || null);
      s.onerror = () => cb(null);
      document.head.appendChild(s);
    }

    function heroLoopField(hero, THREE) {
      if (hero.querySelector(':scope > .hero-gl')) return;
      const canvas = document.createElement('canvas');
      canvas.className = 'hero-gl';
      canvas.setAttribute('aria-hidden', 'true');
      hero.appendChild(canvas);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(dpr); renderer.setClearAlpha(0);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
      camera.position.set(0, 0, 46);
      const group = new THREE.Group(); scene.add(group);

      const tex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.28, 'rgba(255,255,255,0.85)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.beginPath(); g.arc(32, 32, 32, 0, Math.PI * 2); g.fill(); const t = new THREE.Texture(c); t.needsUpdate = true; return t; })();
      const TEAL = new THREE.Color(0x00C9A7), GREEN = new THREE.Color(0x3DDC97), AMBER = new THREE.Color(0xF59E0B), GOLD = new THREE.Color(0xFCD34D), VIOLET = new THREE.Color(0x7C3AED), WHITE = new THREE.Color(0xffffff);
      function cloud(count, size, gen) {
        const tgt = new Float32Array(count * 3), src = new Float32Array(count * 3), col = new Float32Array(count * 3), tmp = new THREE.Color();
        for (let i = 0; i < count; i++) { const o = i * 3, p = gen(i, tmp); tgt[o] = p[0]; tgt[o + 1] = p[1]; tgt[o + 2] = p[2]; col[o] = tmp.r; col[o + 1] = tmp.g; col[o + 2] = tmp.b; src[o] = (Math.random() - 0.5) * 150; src[o + 1] = (Math.random() - 0.5) * 110; src[o + 2] = (Math.random() - 0.5) * 150; }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(src.slice(), 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        const mat = new THREE.PointsMaterial({ size, map: tex, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true, opacity: 0.95 });
        const pts = new THREE.Points(geo, mat); pts.userData = { target: tgt, source: src, count }; group.add(pts); return pts;
      }
      const R = 14, tube = 2.6;
      const core = cloud(1800, 1.1, (i, tmp) => { const b = i >= 900, a = Math.random() * Math.PI * 2, jr = (Math.random() - 0.5) * tube, jk = (Math.random() - 0.5) * tube, k = Math.sin(a) * 0.5 + 0.5; if (!b) { tmp.copy(TEAL).lerp(GREEN, k); return [Math.cos(a) * (R + jr), Math.sin(a) * (R + jr), jk]; } tmp.copy(AMBER).lerp(GOLD, k * 0.7); if (Math.random() < 0.05) tmp.copy(VIOLET); return [Math.cos(a) * (R + jr) + R * 0.62, jk, Math.sin(a) * (R + jr)]; });
      const amb = cloud(700, 0.5, (i, tmp) => { const rr = 26 + Math.random() * 32, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1); tmp.copy(Math.random() < 0.5 ? TEAL : AMBER).lerp(WHITE, 0.55); return [rr * Math.sin(ph) * Math.cos(th), rr * Math.sin(ph) * Math.sin(th) * 0.7, rr * Math.cos(ph)]; });

      let W = 0, H = 0;
      function resize() { const r = hero.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height); renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); const wide = W >= 981; group.position.x = wide ? 10 : 0; group.position.y = wide ? 1 : 0; group.scale.setScalar(wide ? 0.82 : (W < 560 ? 0.6 : 0.72)); }
      resize();
      const pointer = { x: 0, y: 0 }, ease = { x: 0, y: 0 }; let spin = 0;
      window.addEventListener('mousemove', (e) => { pointer.x = (e.clientX / window.innerWidth) * 2 - 1; pointer.y = (e.clientY / window.innerHeight) * 2 - 1; }, { passive: true });
      let rt = 0; window.addEventListener('resize', () => { if (rt) cancelAnimationFrame(rt); rt = requestAnimationFrame(resize); }, { passive: true });
      function form(pts, e) { const pos = pts.geometry.attributes.position.array, t = pts.userData.target, s = pts.userData.source, n = pts.userData.count * 3; for (let i = 0; i < n; i++) pos[i] = s[i] + (t[i] - s[i]) * e; pts.geometry.attributes.position.needsUpdate = true; }
      let t0 = performance.now(), FORM = 1700, formed = false, running = false, raf = 0;
      function frame(now) { if (!running) return; const e = Math.min(1, (now - t0) / FORM); if (!formed) { const ee = 1 - Math.pow(1 - e, 3); form(core, ee); form(amb, ee); if (e >= 1) formed = true; } spin += 0.0016; ease.x += (pointer.x - ease.x) * 0.045; ease.y += (pointer.y - ease.y) * 0.045; group.rotation.y = spin + ease.x * 0.4; group.rotation.x = Math.sin(now * 0.00018) * 0.1 + ease.y * 0.26; amb.rotation.y = -spin * 0.5; renderer.render(scene, camera); raf = requestAnimationFrame(frame); }
      function start() { if (running) return; running = true; canvas.classList.add('is-live'); hero.classList.add('gl-live'); raf = requestAnimationFrame(frame); }
      function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
      if ('IntersectionObserver' in window) { new IntersectionObserver((es) => es.forEach(x => x.isIntersecting ? start() : stop()), { rootMargin: '120px' }).observe(hero); } else { start(); }
    }
  })();
})();
