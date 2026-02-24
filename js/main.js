/* ═══════════════════════════════════════════════════════════════
   REIFAN KHALID PORTFOLIO — main.js v5.1
   Wuthering Waves Cinematic Gold Edition
═══════════════════════════════════════════════════════════════ */

/* ── 1. INTRO SCREEN ── */
(function initIntro() {
  var screen = document.getElementById('intro-screen');
  if (!screen) return;

  /* Gold-tinted binary rain */
  var canvas = document.getElementById('binaryCanvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    var cols  = Math.floor(canvas.width / 16);
    var drops = [];
    for (var i = 0; i < cols; i++) drops[i] = Math.random() * -40;
    var chars = '01アイウエオカキクケコサシスセソタテトナニヌネノハヒフヘホ';

    function drawRain() {
      ctx.fillStyle = 'rgba(2,3,8,0.07)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '13px JetBrains Mono, monospace';
      for (var j = 0; j < drops.length; j++) {
        var ch = chars[Math.floor(Math.random() * chars.length)];
        var bright = Math.random() > 0.92 ? 1 : 0.2 + Math.random() * 0.3;
        ctx.fillStyle = 'rgba(200,160,80,' + bright + ')';
        ctx.fillText(ch, j * 16, drops[j] * 16);
        if (drops[j] * 16 > canvas.height && Math.random() > 0.975) drops[j] = 0;
        drops[j] += 0.45;
      }
    }
    var rainInterval = setInterval(drawRain, 40);
    setTimeout(function() { clearInterval(rainInterval); }, 3000);
  }

  /* Hide after delay */
  window.addEventListener('load', function() {
    setTimeout(function() {
      screen.classList.add('hidden');
      setTimeout(function() { screen.style.display = 'none'; }, 900);
    }, 2400);
  });
})();

/* ── 2. NAVBAR — scroll glass + active ── */
(function initNavbar() {
  var nav   = document.getElementById('navbar');
  var links = document.querySelectorAll('.nav-item, .mobile-link');
  if (!nav) return;

  window.addEventListener('scroll', function() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  var sections = document.querySelectorAll('section[id]');
  function setActive() {
    var sy = window.scrollY + 100;
    sections.forEach(function(sec) {
      if (sy >= sec.offsetTop && sy < sec.offsetTop + sec.offsetHeight) {
        links.forEach(function(l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + sec.id);
        });
      }
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  links.forEach(function(l) {
    l.addEventListener('click', function() {
      var drawer = document.getElementById('mobileDrawer');
      if (drawer) drawer.classList.remove('open');
    });
  });
})();

/* ── 4. HAMBURGER ── */
(function initHamburger() {
  var btn    = document.getElementById('hamburger');
  var drawer = document.getElementById('mobileDrawer');
  if (!btn || !drawer) return;
  btn.addEventListener('click', function() { drawer.classList.toggle('open'); });
  document.addEventListener('click', function(e) {
    if (!drawer.contains(e.target) && !btn.contains(e.target)) drawer.classList.remove('open');
  });
})();

/* ── 5. THEME TOGGLE ── */
(function initTheme() {
  var btn = document.getElementById('themeToggle');
  if (!btn) return;
  if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
  btn.addEventListener('click', function() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
  });
})();

/* ── 6. SCROLL REVEAL ── */
(function initReveal() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var delay = entry.target.dataset.delay || 0;
        setTimeout(function() { entry.target.classList.add('revealed'); }, delay * 110);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(function(el) { obs.observe(el); });
})();

/* ── 7. SKILL RINGS ── */
(function initRings() {
  var rings = document.querySelectorAll('.ring-fill');
  if (!rings.length) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var idx = Array.from(rings).indexOf(entry.target);
        setTimeout(function() { entry.target.classList.add('animated'); }, idx * 90);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  rings.forEach(function(r) { obs.observe(r); });
})();

/* ── 8. LIGHTBOX — 360° flip animation ── */
(function initLightbox() {
  var lb       = document.getElementById('lightbox');
  var backdrop = document.getElementById('lightboxBackdrop');
  var closeBtn = document.getElementById('lightboxClose');
  var imgEl    = document.getElementById('lightboxImg');
  var videoEl  = document.getElementById('lightboxVideo');
  var footer   = document.getElementById('lightboxFooter');
  if (!lb) return;

  /* Remove .active, force reflow, re-add — restarts CSS keyframe every time */
  function triggerOpen() {
    lb.classList.remove('active');
    void lb.offsetWidth;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function openImg(src, websiteUrl, sourceEl) {
    imgEl.src = ''; imgEl.style.display = 'block';
    videoEl.style.display = 'none';
    if (videoEl.pause) videoEl.pause(); videoEl.src = '';
    footer.innerHTML = '';
    if (websiteUrl) {
      var a = document.createElement('a');
      a.href = websiteUrl; a.target = '_blank'; a.rel = 'noopener';
      a.className = 'lb-visit-btn'; a.textContent = 'Visit Website →';
      footer.appendChild(a);
    }
    /* Flip the clicked element */
    if (sourceEl) {
      sourceEl.classList.add('card-flipping');
      setTimeout(function() { sourceEl.classList.remove('card-flipping'); }, 460);
    }
    triggerOpen();
    requestAnimationFrame(function() { imgEl.src = src; });
  }

  function openVideo(src, sourceEl) {
    imgEl.style.display = 'none'; imgEl.src = '';
    videoEl.src = ''; videoEl.style.display = 'block';
    footer.innerHTML = '';
    if (sourceEl) {
      sourceEl.classList.add('card-flipping');
      setTimeout(function() { sourceEl.classList.remove('card-flipping'); }, 460);
    }
    triggerOpen();
    requestAnimationFrame(function() { videoEl.src = src; videoEl.load(); });
  }

  function close() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(function() {
      imgEl.src = ''; imgEl.style.display = 'block';
      if (videoEl.pause) videoEl.pause(); videoEl.src = '';
      videoEl.style.display = 'none';
      footer.innerHTML = '';
    }, 400);
  }

  backdrop.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') close(); });

  document.querySelectorAll('.cert-row[data-img]').forEach(function(row) {
    row.addEventListener('click', function() { openImg(row.dataset.img, null, row); });
  });
  document.querySelectorAll('.clickable-preview').forEach(function(el) {
    el.addEventListener('click', function() {
      if (el.dataset.video) openVideo(el.dataset.video, el);
      else openImg(el.dataset.img, el.dataset.website || null, el);
    });
  });
})();

/* ── 9. BACKGROUND CANVAS — Pure Gold Ember Particles ── */
(function initBg() {
  var canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H, dpr;
  var particles = [];
  var hexes = [];
  var scanLines = [];
  var auroraT = 0;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    W = window.innerWidth; H = window.innerHeight;
    canvas.width  = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr, dpr);
    buildHexes();
  }

  /* Hex grid */
  function buildHexes() {
    hexes = [];
    var cols = Math.ceil(W / 100) + 2, rows = Math.ceil(H / 86) + 2;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        hexes.push({
          x: c * 100 + (r % 2) * 50 - 50,
          y: r * 86 - 43,
          t: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.005 + 0.002,
          base: Math.random() * 0.055 + 0.008
        });
      }
    }
  }

  function drawHex(x, y, size, alpha) {
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.strokeStyle = 'rgba(200,160,80,1)'; ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      var a = Math.PI / 3 * i - Math.PI / 6;
      var px = x + size * Math.cos(a), py = y + size * Math.sin(a);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.stroke(); ctx.restore();
  }

  /* Ember particles — pure gold, no teal */
  function Particle() { this.reset(true); }
  Particle.prototype.reset = function(init) {
    this.x = Math.random() * W;
    this.y = init ? Math.random() * H : H + 10;
    this.r = Math.random() * 1.8 + 0.4;
    this.vy = -(Math.random() * 0.55 + 0.12);
    this.vx = (Math.random() - 0.5) * 0.2;
    this.life = 0; this.maxLife = Math.random() * 450 + 180;
    this.tw = Math.random() * Math.PI * 2; this.tws = Math.random() * 0.025 + 0.008;
    /* Gold palette only */
    var c = ['rgba(200,160,80,', 'rgba(232,200,130,', 'rgba(245,220,150,', 'rgba(180,130,60,'];
    this.col = c[Math.floor(Math.random() * c.length)];
    this.diamond = Math.random() < 0.12;
  };
  Particle.prototype.update = function() {
    this.x += this.vx + Math.sin(this.life * 0.016) * 0.18;
    this.y += this.vy; this.life++; this.tw += this.tws;
    if (this.life > this.maxLife || this.y < -10) this.reset(false);
  };
  Particle.prototype.draw = function() {
    var p = this.life / this.maxLife;
    var alpha = Math.sin(p * Math.PI) * 0.7 * (0.65 + 0.35 * Math.sin(this.tw));
    ctx.save(); ctx.globalAlpha = alpha;
    if (this.diamond) {
      ctx.translate(this.x, this.y);
      ctx.rotate(Math.PI / 4 + this.life * 0.007);
      ctx.fillStyle = this.col + '1)';
      ctx.shadowColor = this.col + '1)'; ctx.shadowBlur = 5 * dpr;
      ctx.fillRect(-this.r * 0.8, -this.r * 0.8, this.r * 1.6, this.r * 1.6);
    } else {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.col + '1)';
      ctx.shadowColor = this.col + '1)'; ctx.shadowBlur = this.r * 4 * dpr;
      ctx.fill();
    }
    ctx.restore();
  };

  /* Horizontal scan lines */
  function ScanLine() { this.reset(true); }
  ScanLine.prototype.reset = function(init) {
    this.y = init ? Math.random() * H : -1;
    this.speed = Math.random() * 0.3 + 0.08;
    this.alpha = Math.random() * 0.05 + 0.01;
  };
  ScanLine.prototype.update = function() { this.y += this.speed; if (this.y > H + 1) this.reset(false); };
  ScanLine.prototype.draw = function() {
    ctx.save(); ctx.globalAlpha = this.alpha;
    ctx.strokeStyle = 'rgba(200,160,80,1)'; ctx.lineWidth = 0.4;
    ctx.beginPath(); ctx.moveTo(0, this.y); ctx.lineTo(W, this.y); ctx.stroke();
    ctx.restore();
  };

  /* Aurora glow — gold only */
  function drawAurora() {
    auroraT += 0.002;
    var g1 = ctx.createRadialGradient(
      W * 0.18 + Math.sin(auroraT * 0.5) * 60, H * 0.2 + Math.cos(auroraT * 0.35) * 40, 0,
      W * 0.18, H * 0.2, W * 0.5);
    g1.addColorStop(0,   'rgba(200,160,80,0.07)');
    g1.addColorStop(0.5, 'rgba(200,140,60,0.025)');
    g1.addColorStop(1,   'transparent');
    ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

    var g2 = ctx.createRadialGradient(
      W * 0.78 + Math.sin(auroraT * 0.4) * 50, H * 0.78 + Math.cos(auroraT * 0.6) * 40, 0,
      W * 0.78, H * 0.78, W * 0.4);
    g2.addColorStop(0,   'rgba(180,120,40,0.05)');
    g2.addColorStop(0.5, 'rgba(200,160,80,0.018)');
    g2.addColorStop(1,   'transparent');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
  }

  /* Init */
  for (var i = 0; i < 110; i++) particles.push(new Particle());
  for (var j = 0; j <   5; j++) scanLines.push(new ScanLine());

  function loop() {
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, W, H);
    drawAurora();
    hexes.forEach(function(h) {
      h.t += h.speed;
      drawHex(h.x, h.y, 36, h.base * (0.5 + 0.5 * Math.sin(h.t)));
    });
    scanLines.forEach(function(s) { s.update(); s.draw(); });
    particles.forEach(function(p) { p.update(); p.draw(); });
  }

  resize();
  window.addEventListener('resize', resize);
  loop();
})();
