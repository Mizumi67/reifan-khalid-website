"use strict";

/* ─────────────────────────────────────────────────────
   0. BINARY RAIN — intro background canvas
───────────────────────────────────────────────────── */
(function initBinaryRain() {
  const canvas = document.getElementById("binaryCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();

  const FONT_SIZE = 11;
  let cols  = Math.floor(canvas.width / FONT_SIZE);
  let drops = Array.from({ length: cols }, () => Math.random() * (canvas.height / 13));

  window.addEventListener("resize", () => {
    resize();
    cols  = Math.floor(canvas.width / FONT_SIZE);
    drops = Array.from({ length: cols }, () => Math.random() * (canvas.height / 13));
  });

  // Fill dark background on very first frame
  ctx.fillStyle = "#0b0914";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  function draw() {
    ctx.fillStyle = "rgba(8, 6, 16, 0.06)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = FONT_SIZE + "px 'JetBrains Mono', monospace";

    for (let i = 0; i < drops.length; i++) {
      var bit  = Math.random() > 0.5 ? "1" : "0";
      var x    = i * FONT_SIZE;
      var y    = drops[i] * FONT_SIZE;
      var head = y <= FONT_SIZE * 2;

      ctx.fillStyle = head
        ? "rgba(220, 255, 235, 0.95)"
        : "rgba(79, 255, 176, " + (0.12 + Math.random() * 0.40) + ")";

      ctx.fillText(bit, x, y);

      // Reset immediately when off screen — no gaps, always raining
      if (y > canvas.height) {
        drops[i] = -(Math.random() * 20 + 5); // restart from just above top
      }
      drops[i] += 0.55;
    }
  }

  var raf;
  function loop() { draw(); raf = requestAnimationFrame(loop); }
  loop();

  var screen = document.getElementById("intro-screen");
  if (screen) {
    // MUST check animationName — child animations bubble up and would cancel too early
    screen.addEventListener("animationend", function(e) {
      if (e.animationName === "introFadeOut") {
        cancelAnimationFrame(raf);
        canvas.classList.add("hidden");
      }
    });
  }
})();


/* ─────────────────────────────────────────────────────
   1. INTRO ANIMATION
───────────────────────────────────────────────────── */
(function initIntro() {
  var screen = document.getElementById("intro-screen");
  if (!screen) return;
  document.body.style.overflow = "hidden";
  setTimeout(function() {
    screen.classList.add("fade-out");
    // Fade canvas out at the same time as the intro screen
    var canvas = document.getElementById("binaryCanvas");
    if (canvas) canvas.classList.add("fade-out");

    screen.addEventListener("animationend", function(e) {
      if (e.animationName !== "introFadeOut") return;
      screen.style.display = "none";
      document.body.style.overflow = "";
      triggerHeroReveal();
    }, { once: true });
  }, 2800);
})();


/* ─────────────────────────────────────────────────────
   2. HERO REVEAL
───────────────────────────────────────────────────── */
function triggerHeroReveal() {
  document.querySelectorAll(".hero-section .reveal").forEach(function(el, i) {
    setTimeout(function() { el.classList.add("revealed"); }, i * 140);
  });
}


/* ─────────────────────────────────────────────────────
   3. LIGHTBOX — supports both image and video
       rotateY 360° spin-grow animation on open
───────────────────────────────────────────────────── */
(function initLightbox() {
  var lightbox  = document.getElementById("lightbox");
  var backdrop  = document.getElementById("lightboxBackdrop");
  var closeBtn  = document.getElementById("lightboxClose");
  var imgEl     = document.getElementById("lightboxImg");
  var videoEl   = document.getElementById("lightboxVideo");
  var footer    = document.getElementById("lightboxFooter");
  if (!lightbox) return;

  function openImage(imgSrc, websiteUrl) {
    // Show image, hide video
    imgEl.style.display = "";
    videoEl.style.display = "none";
    videoEl.pause();
    videoEl.src = "";
    imgEl.src = "";
    footer.innerHTML = "";

    if (websiteUrl) {
      var btn = document.createElement("a");
      btn.href = websiteUrl;
      btn.target = "_blank";
      btn.rel = "noopener noreferrer";
      btn.className = "btn-view-website";
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="currentColor" stroke-width="1.8"/></svg> View Website';
      footer.appendChild(btn);
    }

    triggerOpen();
    requestAnimationFrame(function() { imgEl.src = imgSrc; });
  }

  function openVideo(videoSrc) {
    // Show video, hide image
    imgEl.style.display = "none";
    imgEl.src = "";
    videoEl.style.display = "";
    videoEl.src = "";
    footer.innerHTML = "";

    triggerOpen();
    requestAnimationFrame(function() {
      videoEl.src = videoSrc;
      videoEl.load();
      videoEl.play();
    });
  }

  function triggerOpen() {
    lightbox.classList.remove("active");
    void lightbox.offsetWidth;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    setTimeout(function() {
      imgEl.src = "";
      imgEl.style.display = "";
      videoEl.pause();
      videoEl.src = "";
      videoEl.style.display = "none";
      footer.innerHTML = "";
    }, 400);
  }

  backdrop.addEventListener("click", closeLightbox);
  closeBtn.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", function(e) { if (e.key === "Escape") closeLightbox(); });

  // Cert cards — image only
  document.querySelectorAll(".cert-card[data-img]").forEach(function(card) {
    card.addEventListener("click", function() { openImage(card.dataset.img, null); });
  });

  // Project previews — image or video
  document.querySelectorAll(".clickable-preview").forEach(function(preview) {
    preview.addEventListener("click", function() {
      if (preview.dataset.video) {
        openVideo(preview.dataset.video);
      } else {
        openImage(preview.dataset.img, preview.dataset.website || null);
      }
    });
  });
})();


/* ─────────────────────────────────────────────────────
   4. THEME TOGGLE
───────────────────────────────────────────────────── */
(function initThemeToggle() {
  var btn = document.getElementById("themeToggle");
  if (!btn) return;
  var saved = localStorage.getItem("theme");
  if (saved === "light") {
    document.body.classList.add("light-mode");
  } else {
    document.body.classList.remove("light-mode");
    localStorage.setItem("theme", "dark");
  }
  btn.addEventListener("click", function() {
    btn.classList.remove("spinning");
    void btn.offsetWidth;
    btn.classList.add("spinning");
    btn.addEventListener("animationend", function() { btn.classList.remove("spinning"); }, { once: true });
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
  });
})();


/* ─────────────────────────────────────────────────────
   5. SCROLL REVEAL
───────────────────────────────────────────────────── */
(function initScrollReveal() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var delay = entry.target.dataset.delay || 0;
        setTimeout(function() { entry.target.classList.add("revealed"); }, delay * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal:not(.hero-section .reveal)").forEach(function(el) {
    observer.observe(el);
  });
})();


/* ─────────────────────────────────────────────────────
   6. NAVBAR
───────────────────────────────────────────────────── */
(function initNavbar() {
  var navbar = document.getElementById("navbar");
  var links  = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", function() {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  });

  var sections = document.querySelectorAll("section[id]");
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        links.forEach(function(l) { l.classList.remove("active"); });
        var active = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
        if (active) active.classList.add("active");
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(function(s) { io.observe(s); });

  var hamburger = document.getElementById("hamburger");
  var drawer    = document.getElementById("mobileDrawer");
  if (hamburger && drawer) {
    hamburger.addEventListener("click", function() {
      drawer.classList.toggle("open");
      hamburger.classList.toggle("open");
    });
    drawer.querySelectorAll(".mobile-link").forEach(function(link) {
      link.addEventListener("click", function() {
        drawer.classList.remove("open");
        hamburger.classList.remove("open");
      });
    });
  }
})();


/* ─────────────────────────────────────────────────────
   7. SKILL BARS — animate fill when scrolled into view
───────────────────────────────────────────────────── */
(function initSkillBars() {
  var bars = document.querySelectorAll(".skill-bar-fill");
  if (!bars.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Stagger each bar slightly
        var bar = entry.target;
        var idx = Array.from(bars).indexOf(bar);
        setTimeout(function() {
          bar.classList.add("animated");
        }, idx * 80);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(function(bar) { observer.observe(bar); });
})();
