/**
 * YogSetu - Verified Yoga Teacher Directory
 * Animations, Transitions, Theme Toggle, and Cursor FX
 */

// Global Dark Mode state
let isDarkMode = false;

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
}, 2500);

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
  if (typeof gsap === 'undefined') return;

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
    });
  });
}

// ------------------------------------------
// GSAP PRELOADER & HERO TIMELINE
// ------------------------------------------
if (typeof gsap !== 'undefined') {
  const preloaderCount = document.getElementById('preloader-counter');
  
  if (document.getElementById('preloader')) {
    const countVal = { value: 0 };
    const preloaderTL = gsap.timeline({
      onComplete: () => {
        clearTimeout(preloaderTimeout);
        initScrollTriggers();
      }
    });

    // Animate breathing scale on preloader
    gsap.to('#preloader-circle', {
      scale: 1.15,
      duration: 1.3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Count up
    preloaderTL.to(countVal, {
      value: 100,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => {
        if (preloaderCount) preloaderCount.textContent = Math.floor(countVal.value).toString().padStart(2, '0');
      }
    });

    // Wipe out preloader
    preloaderTL.to('#preloader', {
      yPercent: -100,
      duration: 1.1,
      ease: "expo.inOut",
      delay: 0.1,
      onComplete: () => {
        const preEl = document.getElementById('preloader');
        if (preEl) preEl.remove();
      }
    });

    // Reveal split-text hero elements
    preloaderTL.fromTo('.split-child',
      { yPercent: 100 },
      { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.15 },
      "-=0.6"
    );
  } else {
    // Immediate scroll trigger activation for preloader-less pages
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
// DOM INITIALIZATION
// ------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initMagneticEffects();
  initFaqAccordions();
  initDramaticMenu();
  initStepsDeck();

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
