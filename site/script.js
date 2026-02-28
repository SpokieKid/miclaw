/* ========================================
   MiClaw — Product Page Scripts
   Vanilla JS, no dependencies
   ======================================== */

(function () {
  'use strict';

  /* -----------------------------------------
     1. SCROLL REVEAL (Intersection Observer)
     ----------------------------------------- */
  function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    // Respect reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveals.forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* -----------------------------------------
     2. NAV — Scroll styling & mobile toggle
     ----------------------------------------- */
  function initNav() {
    var nav = document.getElementById('nav');
    var toggle = document.getElementById('navToggle');
    var mobileNav = document.getElementById('mobileNav');
    var mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

    // Scroll class
    function onScroll() {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile toggle
    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        toggle.classList.toggle('active');
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
      });

      mobileLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          toggle.classList.remove('active');
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }
  }

  /* -----------------------------------------
     3. HERO — Particle canvas
     ----------------------------------------- */
  function initHeroCanvas() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    // Skip heavy canvas on reduced-motion or very small screens
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.innerWidth < 480
    ) {
      return;
    }

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var particles = [];
    var PARTICLE_COUNT = Math.min(Math.floor(window.innerWidth / 12), 80);
    var animId;

    function resize() {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    }

    function createParticles() {
      particles = [];
      var w = canvas.offsetWidth;
      var h = canvas.offsetHeight;

      for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.3 + 0.05,
        });
      }
    }

    function draw() {
      var w = canvas.offsetWidth;
      var h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      // Draw connection lines
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            var alpha = (1 - dist / 120) * 0.06;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(74, 158, 255, ' + alpha + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      for (var k = 0; k < particles.length; k++) {
        var p = particles[k];

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74, 158, 255, ' + p.opacity + ')';
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    // Debounced resize
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resize();
        createParticles();
      }, 200);
    });

    // Pause when hero is not visible
    var heroSection = document.getElementById('hero');
    if (heroSection) {
      var heroObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              if (!animId) draw();
            } else {
              if (animId) {
                cancelAnimationFrame(animId);
                animId = null;
              }
            }
          });
        },
        { threshold: 0 }
      );
      heroObserver.observe(heroSection);
    }
  }

  /* -----------------------------------------
     4. DEVICE LED — Interactive demo
     ----------------------------------------- */
  function initDeviceDemo() {
    var btn = document.getElementById('deviceBtn');
    var led = document.getElementById('deviceLed');
    if (!btn || !led) return;

    var isRecording = false;
    var timeoutId;

    btn.addEventListener('mousedown', function () {
      isRecording = true;
      led.classList.add('recording');
      led.classList.remove('success');
    });

    btn.addEventListener('mouseup', function () {
      if (isRecording) {
        isRecording = false;
        led.classList.remove('recording');
        led.classList.add('success');

        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
          led.classList.remove('success');
        }, 2000);
      }
    });

    btn.addEventListener('mouseleave', function () {
      if (isRecording) {
        isRecording = false;
        led.classList.remove('recording');
      }
    });

    // Touch support
    btn.addEventListener('touchstart', function (e) {
      e.preventDefault();
      isRecording = true;
      led.classList.add('recording');
      led.classList.remove('success');
    }, { passive: false });

    btn.addEventListener('touchend', function (e) {
      e.preventDefault();
      if (isRecording) {
        isRecording = false;
        led.classList.remove('recording');
        led.classList.add('success');

        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
          led.classList.remove('success');
        }, 2000);
      }
    });
  }

  /* -----------------------------------------
     5. SMOOTH SCROLL for anchor links
     ----------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;

        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var navHeight = document.getElementById('nav').offsetHeight;
          var y = target.getBoundingClientRect().top + window.scrollY - navHeight;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  }

  /* -----------------------------------------
     6. ACTIVE NAV LINK highlight
     ----------------------------------------- */
  function initActiveNav() {
    var sections = document.querySelectorAll('.section, .hero');
    var navLinks = document.querySelectorAll('.nav-links a');
    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            navLinks.forEach(function (link) {
              var href = link.getAttribute('href');
              if (href === '#' + id) {
                link.style.color = 'var(--text-primary)';
              } else {
                link.style.color = '';
              }
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* -----------------------------------------
     7. COUNTER ANIMATION for stats
     ----------------------------------------- */
  function initCounters() {
    var counters = document.querySelectorAll('.channel-stat-num, .footer-stat-num');

    counters.forEach(function (el) {
      var text = el.textContent.trim();
      // Match numbers like "449+"
      var match = text.match(/^(\d+)(\+?)$/);
      if (!match) return;

      var target = parseInt(match[1], 10);
      var suffix = match[2] || '';
      var hasAnimated = false;

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !hasAnimated) {
              hasAnimated = true;
              animateCounter(el, target, suffix);
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(el);
    });
  }

  function animateCounter(el, target, suffix) {
    var duration = 1200;
    var start = performance.now();

    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  /* -----------------------------------------
     INIT
     ----------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initNav();
    initHeroCanvas();
    initDeviceDemo();
    initSmoothScroll();
    initActiveNav();
    initCounters();
  });
})();
