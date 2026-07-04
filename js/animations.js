/**
 * YogSetu - Verified Yoga Teacher Directory
 * Animations, Transitions, Theme Toggle, and Cursor FX
 */

// Touch device detection
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Global Dark Mode state
let isDarkMode = false;

// ------------------------------------------
// LENIS SMOOTH SCROLL INITIALIZATION
// ------------------------------------------
let lenis = null;
if (!isTouchDevice && typeof Lenis !== 'undefined') {
  // Inject Lenis styling dynamically and promote animated elements to GPU layer for max FPS
  const style = document.createElement('style');
  style.id = 'lenis-styles';
  style.textContent = `
    html.lenis, html.lenis body {
      height: auto;
    }
    .lenis.lenis-smooth {
      scroll-behavior: auto !important;
    }
    .lenis.lenis-smooth [data-lenis-prevent] {
      overscroll-behavior: contain;
    }
    .lenis.lenis-stopped {
      overflow: hidden;
    }
    .lenis.lenis-scrolling iframe {
      pointer-events: none;
    }
    #custom-cursor-dot,
    #custom-cursor-ring,
    .draw-line-h,
    .draw-line-v,
    .organic-shadow-hover {
      will-change: transform;
    }
  `;
  document.head.appendChild(style);

  // Initialize Lenis with disabled internal RAF (autoRaf: false) to prevent frame double-handling
  lenis = new Lenis({
    autoRaf: false,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing for ultra-smoothness
    direction: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.2,
    infinite: false,
  });

  // Share lenis globally
  window.lenis = lenis;

  // Connect to GSAP ScrollTrigger
  lenis.on('scroll', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.update();
    }
  });

  // Integrate Lenis frame ticks with GSAP ticker loop (primary driver)
  if (typeof gsap !== 'undefined') {
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    // Disable lag smoothing to prevent jumping / drops
    gsap.ticker.lagSmoothing(0);
  }

  // Anchor links smooth scrolling interceptor
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (href === '#' || href.startsWith('#teacher-profile/')) return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target);
    }
  });
}

// ------------------------------------------
// FAIL-SAFE PRELOADER TIMEOUT
// ------------------------------------------
const preloaderTimeout = setTimeout(() => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    preloader.style.opacity = '0';
    preloader.style.transform = 'translateY(-100%)';
    setTimeout(() => {
      if (preloader.parentNode) preloader.remove();
    }, 600);
  }
  if (typeof gsap === 'undefined') {
    document.body.style.cursor = 'default';
    const cursorDot = document.getElementById('custom-cursor-dot');
    const cursorRing = document.getElementById('custom-cursor-ring');
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
  }
}, 5000);

// Vanilla preloader counter fallback
function runVanillaPreloaderCounter() {
  const counter = document.getElementById('preloader-counter');
  if (!counter) return;
  let count = 0;
  const interval = setInterval(() => {
    count += 5;
    if (count >= 100) {
      count = 100;
      clearInterval(interval);
    }
    counter.textContent = count.toString().padStart(2, '0');
  }, 90);
}

// ------------------------------------------
// SUNRISE / MOONLIGHT THEME TOGGLE
// ------------------------------------------
function toggleTheme() {
  isDarkMode = !isDarkMode;
  const target = isDarkMode ? {
    canvas: '#16191B',
    canvasSecondary: '#1C1F22',
    panel: '#1F2225',
    text: '#E7ECEE',
    textSecondary: '#9AABB8',
    accent: '#D48C70', // Terracotta orange accent in dark mode
    accentHover: '#C87A53',
    border: 'rgba(212, 140, 112, 0.25)',
    badgeBg: 'rgba(212, 140, 112, 0.12)',
    badgeText: '#D48C70'
  } : {
    canvas: '#F4EFE6',
    canvasSecondary: '#E9E2D5',
    panel: '#FAF8F5',
    text: '#1C201D',
    textSecondary: '#5C645E',
    accent: '#49644F', // Forest Green in Sunrise mode
    accentHover: '#374E3C',
    border: 'rgba(73, 100, 79, 0.25)',
    badgeBg: '#EAEFEA',
    badgeText: '#374E3C'
  };

  // Toggle navbar icon
  const icon = document.getElementById('theme-toggle-icon');
  if (icon && typeof lucide !== 'undefined') {
    icon.setAttribute('data-lucide', isDarkMode ? 'sun' : 'moon');
    lucide.createIcons();
  }

  if (typeof gsap !== 'undefined') {
    // Smooth GSAP transition of CSS custom variables
    gsap.to(':root', {
      '--color-canvas': target.canvas,
      '--color-canvas-secondary': target.canvasSecondary,
      '--color-panel': target.panel,
      '--color-text': target.text,
      '--color-text-secondary': target.textSecondary,
      '--color-accent': target.accent,
      '--color-accent-hover': target.accentHover,
      '--color-border': target.border,
      '--color-badge-bg': target.badgeBg,
      '--color-badge-text': target.badgeText,
      duration: 0.8,
      ease: "power2.out"
    });

    // Rotate button
    gsap.fromTo('#theme-toggle-btn', { rotate: 0 }, { rotate: 360, duration: 0.6, ease: "back.out(1.5)" });

    // Update custom cursor color
    gsap.to('#custom-cursor-dot', { backgroundColor: target.accent, duration: 0.8 });
    gsap.to('#custom-cursor-ring', { borderColor: target.accent, duration: 0.8 });
  } else {
    // Fallback root CSS variables setting
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--color-canvas', target.canvas);
    rootStyle.setProperty('--color-canvas-secondary', target.canvasSecondary);
    rootStyle.setProperty('--color-panel', target.panel);
    rootStyle.setProperty('--color-text', target.text);
    rootStyle.setProperty('--color-text-secondary', target.textSecondary);
    rootStyle.setProperty('--color-accent', target.accent);
    rootStyle.setProperty('--color-accent-hover', target.accentHover);
    rootStyle.setProperty('--color-border', target.border);
    rootStyle.setProperty('--color-badge-bg', target.badgeBg);
    rootStyle.setProperty('--color-badge-text', target.badgeText);
  }

  // Communicate with booking module's toast system if available
  if (typeof showToast === 'function') {
    showToast(`Switched to ${isDarkMode ? 'Moonlight' : 'Sunrise'} Mode`);
  }
}

// ------------------------------------------
// CUSTOM LERP CURSOR
// ------------------------------------------
function initCustomCursor() {
  if (isTouchDevice) return;
  const cursorDot = document.getElementById('custom-cursor-dot');
  const cursorRing = document.getElementById('custom-cursor-ring');
  if (!cursorDot || !cursorRing) return;

  if (typeof gsap === 'undefined') {
    document.body.style.cursor = 'default';
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
    return;
  }
  
  let mouse = { x: 0, y: 0 };
  let ringPos = { x: 0, y: 0 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    gsap.set(cursorDot, { x: mouse.x, y: mouse.y });
  });

  gsap.ticker.add(() => {
    const dt = 1.0 - Math.pow(1.0 - 0.16, gsap.ticker.deltaRatio());
    ringPos.x += (mouse.x - ringPos.x) * dt;
    ringPos.y += (mouse.y - ringPos.y) * dt;
    gsap.set(cursorRing, { x: ringPos.x, y: ringPos.y });
  });

  document.addEventListener('mouseleave', () => {
    gsap.to([cursorDot, cursorRing], { opacity: 0, duration: 0.3 });
  });
  document.addEventListener('mouseenter', () => {
    gsap.to([cursorDot, cursorRing], { opacity: 1, duration: 0.3 });
  });

  attachCursorHoverListeners();
}

function attachCursorHoverListeners() {
  const body = document.body;
  document.querySelectorAll('.hover-trigger, a, button, select, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => body.classList.remove('cursor-hover'));
  });
}

// ------------------------------------------
// MAGNETIC EFFECTS
// ------------------------------------------
function initMagneticEffects() {
  if (isTouchDevice || typeof gsap === 'undefined') return;

  setupMagnet('contact-submit-wrap', 'contact-submit-btn', 80, 0.4);
  setupMagnet('theme-toggle-wrap', 'theme-toggle-btn', 70, 0.45);
  setupMagnet('menu-toggle-wrap', 'menu-toggle-btn', 80, 0.4);
}

function setupMagnet(wrapperId, buttonId, hoverRadius = 70, power = 0.4) {
  const wrap = document.getElementById(wrapperId);
  const btn = document.getElementById(buttonId);
  if (!wrap || !btn) return;

  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    const distance = Math.sqrt(relX * relX + relY * relY);

    if (distance < hoverRadius) {
      gsap.to(btn, { x: relX * power, y: relY * power, duration: 0.3, ease: "power2.out" });
    } else {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
    }
  });

  wrap.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
  });
}

// ------------------------------------------
// FAQ ACCORDIONS
// ------------------------------------------
function initFaqAccordions() {
  document.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.onclick = () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('i');
      const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

      // Close all FAQ accordions
      document.querySelectorAll('.faq-content').forEach(c => c.style.maxHeight = '0px');
      document.querySelectorAll('.faq-toggle i').forEach(i => i.classList.remove('rotate-180'));

      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + "px";
        if (icon) icon.classList.add('rotate-180');
      }

      // Notify Lenis that the scrollable height has updated after layout transition
      if (window.lenis) {
        setTimeout(() => window.lenis.resize(), 300);
      }
    };
  });
}

// ------------------------------------------
// DRAMATIC FULLSCREEN OVERLAY MENU
// ------------------------------------------
function initDramaticMenu() {
  let isMenuOpen = false;
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const menuOverlay = document.getElementById('menu-overlay');
  const bar1 = document.getElementById('bar-1');
  const bar2 = document.getElementById('bar-2');

  if (!menuToggleBtn || !menuOverlay) return;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
      // Open Menu
      menuOverlay.classList.remove('hidden');
      gsap.fromTo(menuOverlay, { yPercent: -100 }, { yPercent: 0, duration: 0.8, ease: "power4.out" });
      
      // Morph burger icon to X
      gsap.to(bar1, { rotate: 45, y: 4, duration: 0.3 });
      gsap.to(bar2, { rotate: -45, y: -4, duration: 0.3 });
      
      // Stagger reveal menu links
      gsap.fromTo('.menu-link-wrapper', 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.08, delay: 0.2 }
      );
    } else {
      // Close Menu
      gsap.to(menuOverlay, {
        yPercent: -100,
        duration: 0.6,
        ease: "power4.in",
        onComplete: () => menuOverlay.classList.add('hidden')
      });
      
      // Morph X back to burger icon
      gsap.to(bar1, { rotate: 0, y: 0, duration: 0.3 });
      gsap.to(bar2, { rotate: 0, y: 0, duration: 0.3 });
    }
  }

  menuToggleBtn.addEventListener('click', toggleMenu);
  
  // Close menu when clicking links
  document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => {
      if (isMenuOpen) toggleMenu();
    });
  });
}

// ------------------------------------------
// DYNAMIC STEPS DECK SWITCHER
// ------------------------------------------
function initStepsDeck() {
  const stepLinks = document.querySelectorAll('.step-nav-link');
  const stepPanels = document.querySelectorAll('.step-content-panel');
  
  stepLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetStep = link.getAttribute('data-step');

      // Deactivate all nav links
      stepLinks.forEach(l => {
        l.classList.remove('!text-sage-700', 'font-bold');
        l.querySelector('.dot-indicator')?.classList.add('opacity-0');
      });

      // Activate clicked link
      link.classList.add('!text-sage-700', 'font-bold');
      link.querySelector('.dot-indicator')?.classList.remove('opacity-0');

      // Transition panels
      stepPanels.forEach(panel => {
        if (panel.getAttribute('data-panel') === targetStep) {
          panel.classList.remove('hidden');
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(panel, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
          }
        } else {
          panel.classList.add('hidden');
        }
      });



      // Notify Lenis that layout heights changed
      if (window.lenis) {
        setTimeout(() => window.lenis.resize(), 550);
      }
    });
  });
}

// ------------------------------------------
// GSAP PRELOADER & HERO TIMELINE (NELUMBO MORPH DESIGN)
// ------------------------------------------
function setupPaths(scope) {
  if (!scope) return;
  const paths = scope.querySelectorAll('.lotus-shadow, .lotus-main');
  paths.forEach(p => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
  });
}

function heroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo('.split-child',
    { yPercent: 100 },
    { yPercent: 0, duration: 1.1, stagger: 0.12 },
    0
  ).fromTo('.hero-eyebrow',
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.8 },
    0.3
  ).fromTo('.hero-details',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 1.0 },
    0.45
  ).fromTo('.absolute.bottom-8',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.8 },
    0.85
  );
  return tl;
}

function reveal() {
  const loaderLotus = document.getElementById('loaderLotus');
  const navMark = document.getElementById('navMark');
  const loaderEl = document.getElementById('preloader');
  const hero = document.getElementById('home');

  if (!loaderLotus || !navMark || !loaderEl || !hero) {
    // Fallback if elements are missing
    if (loaderEl) loaderEl.remove();
    document.body.classList.remove('is-loading');
    if (hero) hero.style.clipPath = 'none';
    if (navMark) navMark.style.opacity = '1';
    clearTimeout(preloaderTimeout);
    initScrollTriggers();
    heroEntrance();
    return;
  }

  // Position morph calculations
  const loaderRect = loaderLotus.getBoundingClientRect();
  const navRect = navMark.getBoundingClientRect();
  const scale = navRect.width / loaderRect.width;
  const dx = (navRect.left + navRect.width / 2) - (loaderRect.left + loaderRect.width / 2);
  const dy = (navRect.top + navRect.height / 2) - (loaderRect.top + loaderRect.height / 2);

  // Fade preloader inner content so only the lotus icon & sliding background remain visible
  const innerContent = loaderEl.querySelectorAll('div > span, div > p, #preloader-circle');

  const tl = gsap.timeline({
    onComplete: () => {
      loaderEl.style.display = 'none';
      loaderEl.remove();
      document.body.classList.remove('is-loading');
      hero.style.clipPath = 'none';
      clearTimeout(preloaderTimeout);
      initScrollTriggers();
    }
  });

  tl.to(innerContent, { opacity: 0, scale: 0.95, duration: 0.35, ease: 'power2.in' }, 0)
    .to(loaderLotus, { x: dx, y: dy, scale: scale, duration: 1.1, ease: 'power3.inOut' }, 0.1)
    .to(loaderEl, { yPercent: -100, duration: 1.1, ease: 'power3.inOut' }, 0.1)
    .to(hero, { clipPath: 'circle(150% at 50% 50%)', duration: 1.25, ease: 'power3.inOut' }, 0.15)
    .to(loaderLotus, { opacity: 0, duration: 0.2 }, 0.95)
    .to(navMark, { opacity: 1, duration: 0.25 }, 1.0)
    .add(heroEntrance(), 1.1);
}

if (typeof gsap !== 'undefined') {
  const preloader = document.getElementById('preloader');
  
  if (preloader) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      preloader.remove();
      document.body.classList.remove('is-loading');
      const hero = document.getElementById('home');
      if (hero) hero.style.clipPath = 'none';
      const navMark = document.getElementById('navMark');
      if (navMark) navMark.style.opacity = '1';
      clearTimeout(preloaderTimeout);
      initScrollTriggers();
      
      gsap.set('.split-child', { yPercent: 0 });
      gsap.set('.hero-eyebrow', { opacity: 1, y: 0 });
      gsap.set('.hero-details', { opacity: 1, y: 0 });
      gsap.set('.absolute.bottom-8', { opacity: 1, y: 0 });
    } else {
      const loaderLotus = document.getElementById('loaderLotus');
      setupPaths(loaderLotus);

      const preloaderCount = document.getElementById('preloader-counter');
      const countVal = { value: 0 };
      
      const preloaderTL = gsap.timeline();

      // Breathing loop on preloader circle
      gsap.to('#preloader-circle', {
        scale: 1.1,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      const shadowPath = loaderLotus ? loaderLotus.querySelector('.lotus-shadow') : null;
      const mainPath = loaderLotus ? loaderLotus.querySelector('.lotus-main') : null;

      // Draw SVG outlines and increment counter
      preloaderTL.to(countVal, {
        value: 100,
        duration: 2.2,
        ease: "power2.out",
        onUpdate: () => {
          if (preloaderCount) preloaderCount.textContent = Math.floor(countVal.value).toString().padStart(2, '0');
        }
      }, 0);

      if (shadowPath) {
        preloaderTL.to(shadowPath, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.inOut"
        }, 0.1);
      }

      if (mainPath) {
        preloaderTL.to(mainPath, {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: "power2.inOut"
        }, 0.35);
      }

      // Fill colors when drawing completes
      preloaderTL.to([shadowPath, mainPath], {
        fillOpacity: 1,
        strokeOpacity: 0,
        duration: 0.65,
        ease: "power2.out"
      }, 1.7);

      // Subtle lotus pulse on complete
      if (loaderLotus) {
        preloaderTL.to(loaderLotus, {
          scale: 1.08,
          duration: 0.35,
          ease: "power2.out",
          yoyo: true,
          repeat: 1
        }, 1.75);
      }

      // Chain the reveal morph sequence at the end of preloading
      preloaderTL.add(reveal, 2.5);
    }
  } else {
    // Immediate scroll trigger activation for preloader-less pages
    const navMark = document.getElementById('navMark');
    if (navMark) navMark.style.opacity = '1';
    initScrollTriggers();
  }
}

// ------------------------------------------
// SCROLLTRIGGER HANDLERS & DYNAMIC LINES
// ------------------------------------------
function initScrollTriggers() {
  if (typeof ScrollTrigger === 'undefined' || typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Dynamic Grid Lines drawing reveals on scroll
  document.querySelectorAll('.draw-line-h').forEach(line => {
    gsap.to(line, {
      scaleX: 1,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: line.parentElement,
        start: "top 85%",
        once: true
      }
    });
  });

  document.querySelectorAll('.draw-line-v').forEach(line => {
    gsap.to(line, {
      scaleY: 1,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: line.parentElement,
        start: "top 85%",
        once: true
      }
    });
  });

  // Stats number increment trigger
  document.querySelectorAll('.stat-number').forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const obj = { val: 0 };
    
    ScrollTrigger.create({
      trigger: stat,
      start: "top 90%",
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            stat.textContent = Math.floor(obj.val).toLocaleString();
          }
        });
      },
      once: true
    });
  });


  // Staggered reveals for other content grids
  ScrollTrigger.create({
    trigger: '#styles',
    start: 'top 75%',
    onEnter: () => {
      gsap.fromTo('#styles [class*="p-8"]',
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }
      );
    },
    once: true
  });

  ScrollTrigger.create({
    trigger: '#verification',
    start: 'top 75%',
    onEnter: () => {
      gsap.fromTo('#verification [class*="p-8"]',
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }
      );
    },
    once: true
  });
}

// ------------------------------------------
// HERO BACKGROUND TRANSITION (CROSS-FADE ON HOVER)
// ------------------------------------------
function initHeroHoverBg() {
  if (isTouchDevice || typeof gsap === 'undefined') return;

  const ctaSixMonths = document.getElementById('cta-six-months');
  const bgHover = document.getElementById('hero-bg-hover');
  const bgDefault = document.getElementById('hero-bg-default');

  if (ctaSixMonths && bgHover) {
    ctaSixMonths.addEventListener('mouseenter', () => {
      // Cross-fade: scale up and fade in the secondary background
      gsap.to(bgHover, {
        opacity: 0.75,
        scale: 1.05,
        duration: 0.8,
        ease: 'power2.out'
      });
      if (bgDefault) {
        gsap.to(bgDefault, {
          opacity: 0.15,
          scale: 0.98,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
    });

    ctaSixMonths.addEventListener('mouseleave', () => {
      // Revert transition
      gsap.to(bgHover, {
        opacity: 0,
        scale: 1.0,
        duration: 0.6,
        ease: 'power2.out'
      });
      if (bgDefault) {
        gsap.to(bgDefault, {
          opacity: 0.70,
          scale: 1.0,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    });
  }
}

// ------------------------------------------
// NAV BAR ROLLING TEXT EFFECT ON HOVER
// ------------------------------------------
function initNavRollingLinks() {
  if (isTouchDevice || typeof gsap === 'undefined') return;

  // Inject styles dynamically if not already present
  if (!document.getElementById('roll-link-styles')) {
    const style = document.createElement('style');
    style.id = 'roll-link-styles';
    style.textContent = `
      .roll-link {
        position: relative;
        display: inline-block;
        overflow: hidden;
        vertical-align: top;
        height: 1.25em;
        line-height: 1.25em;
      }
      .roll-text {
        display: block;
        white-space: nowrap;
      }
      .roll-text span {
        font-style: normal !important;
      }
      .menu-link.roll-link {
        height: 1.2em;
        line-height: 1.2em;
        overflow: hidden;
        position: relative;
        display: inline-block;
      }
    `;
    document.head.appendChild(style);
  }

  // Helper to split text element content into character spans
  function splitTextIntoChars(element) {
    const text = element.textContent.trim();
    element.innerHTML = '';
    const chars = [];
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      if (char === ' ') {
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = char;
      }
      element.appendChild(span);
      chars.push(span);
    }
    return chars;
  }

  // Auto-enhance any .menu-link in sidenav/overlay that doesn't have .roll-text children yet
  document.querySelectorAll('.menu-link').forEach(link => {
    if (!link.classList.contains('roll-link') && link.querySelectorAll('.roll-text').length === 0) {
      const rawText = link.textContent.trim();
      link.classList.add('roll-link');
      link.innerHTML = `
        <span class="roll-text block">${rawText}</span>
        <span class="roll-text block absolute top-0 left-0 right-0 pointer-events-none text-sage-600 italic">${rawText}</span>
      `;
    }
  });

  // Bind stagger hover timeline for each link
  document.querySelectorAll('.roll-link').forEach(link => {
    if (link.dataset.rollBound === 'true') return;
    link.dataset.rollBound = 'true';

    const texts = link.querySelectorAll('.roll-text');
    if (texts.length >= 2) {
      const chars1 = splitTextIntoChars(texts[0]);
      const chars2 = splitTextIntoChars(texts[1]);

      const tlHover = gsap.timeline({ paused: true })
        .to(chars1, {
          yPercent: -100,
          duration: 0.6,
          ease: "power3.inOut",
          stagger: 0.025
        }, 0)
        .fromTo(chars2, 
          { yPercent: 100, skewX: 0 },
          {
            yPercent: 0,
            skewX: -12,
            duration: 0.6,
            ease: "power3.inOut",
            stagger: 0.025
          },
          0.04
        );

      link.addEventListener('mouseenter', () => {
        tlHover.play();
      });
      link.addEventListener('mouseleave', () => {
        tlHover.reverse();
      });
    }
  });
}

// ------------------------------------------
// LINK HOVER PREVIEW ANIMATION (GSAP)
// ------------------------------------------
function initLinkPreviews() {
  if (isTouchDevice || typeof gsap === 'undefined') return;

  // Create preview container
  const preview = document.createElement('div');
  preview.id = 'link-preview-container';
  preview.style.position = 'fixed';
  preview.style.width = '190px';
  preview.style.height = '120px';
  preview.style.borderRadius = '16px';
  preview.style.overflow = 'hidden';
  preview.style.boxShadow = '0 20px 45px rgba(0,0,0,0.22)';
  preview.style.border = '2.5px solid var(--color-canvas)';
  preview.style.pointerEvents = 'none';
  preview.style.zIndex = '9998';
  preview.style.opacity = '0';
  preview.style.visibility = 'hidden';
  preview.style.transform = 'translate(-50%, -50%) scale(0.85)';
  preview.style.willChange = 'transform, opacity';
  
  const img = document.createElement('img');
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  preview.appendChild(img);
  document.body.appendChild(preview);

  let activeLink = null;
  const quickX = gsap.quickTo(preview, "x", { duration: 0.45, ease: "power3.out" });
  const quickY = gsap.quickTo(preview, "y", { duration: 0.45, ease: "power3.out" });
  const quickRotate = gsap.quickTo(preview, "rotate", { duration: 0.6, ease: "power2.out" });

  // Map URLs to preview images
  const urlMap = {
    'index.html': 'images/hero_background.jpg',
    'teachers.html': 'images/yoga_1.png',
    'jobs.html': 'images/yoga_4.png',
    'contact.html': 'images/yoga_3.png'
  };

  // Find all nav links
  const links = document.querySelectorAll('.roll-link, .menu-link, nav a, #menu-overlay a');
  
  links.forEach(link => {
    const href = link.getAttribute('href') || '';
    let previewImg = '';
    
    // Find matching preview
    for (const key in urlMap) {
      if (href.includes(key)) {
        previewImg = urlMap[key];
        break;
      }
    }
    
    if (!previewImg) return;

    link.addEventListener('mouseenter', (e) => {
      activeLink = link;
      img.src = previewImg;
      
      // Position instantly on first enter
      gsap.set(preview, { 
        x: e.clientX, 
        y: e.clientY,
        visibility: 'visible'
      });
      
      gsap.to(preview, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      });
    });

    link.addEventListener('mousemove', (e) => {
      if (activeLink !== link) return;
      quickX(e.clientX + 15);
      quickY(e.clientY - 60);
      
      const angle = (e.clientX / window.innerWidth - 0.5) * 15;
      quickRotate(angle);
    });

    link.addEventListener('mouseleave', () => {
      activeLink = null;
      gsap.to(preview, {
        opacity: 0,
        scale: 0.85,
        rotate: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          if (!activeLink) {
            preview.style.visibility = 'hidden';
            img.src = '';
          }
        }
      });
    });
  });
}

// ------------------------------------------
// DOM INITIALIZATION
// ------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initMagneticEffects();
  initFaqAccordions();
  initDramaticMenu();
  initStepsDeck();
  initHeroHoverBg();
  initNavRollingLinks();
  initLinkPreviews();

  // Inject mobile-responsive CSS overrides for touch devices
  if (isTouchDevice) {
    const mobileStyle = document.createElement('style');
    mobileStyle.id = 'mobile-responsive-overrides';
    mobileStyle.textContent = `
      @media (hover: none) and (pointer: coarse) {
        body { cursor: default !important; }
        #custom-cursor-dot, #custom-cursor-ring { display: none !important; }
        .paper-texture { display: none !important; }
        .organic-shadow-hover:hover { transform: none; }
      }
    `;
    document.head.appendChild(mobileStyle);
  }

  // Bind theme toggle click
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Fallback preloader count up if GSAP offline
  if (typeof gsap === 'undefined') {
    runVanillaPreloaderCounter();
  }
});
