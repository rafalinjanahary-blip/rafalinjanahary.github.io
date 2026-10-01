/* =================================================================
   VALÉRY RAFALINJANAHARY — PORTFOLIO
   script.js — navigation, animations au scroll, modal vidéo, parallax
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------- YEAR -------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------- MOBILE NAV -------------------- */
  const navBurger = document.getElementById('navBurger');
  const navMobile = document.getElementById('navMobile');

  if (navBurger && navMobile) {
    navBurger.addEventListener('click', () => {
      const isOpen = navMobile.classList.toggle('is-open');
      navBurger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navMobile.querySelectorAll('.nav-mobile__link').forEach(link => {
      link.addEventListener('click', () => {
        navMobile.classList.remove('is-open');
        navBurger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -------------------- NAV GLASS ON SCROLL -------------------- */
  const navGlass = document.getElementById('navGlass');
  const onNavScroll = () => {
    if (!navGlass) return;
    if (window.scrollY > 40) {
      navGlass.style.background = 'rgba(10,24,48,0.78)';
    } else {
      navGlass.style.background = 'rgba(10,24,48,0.55)';
    }
  };
  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();

  /* -------------------- SCROLL REVEAL (Intersection Observer) -------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const skillBars = document.querySelectorAll('.skill-bar__fill');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // subtle stagger for elements revealed together
        const delay = Math.min((entry.target.dataset.staggerIndex || 0) * 70, 400);
        setTimeout(() => entry.target.classList.add('is-visible'), delay);

        // fill matching skill bars once their card is visible
        if (entry.target.classList.contains('skill-card')) {
          const bar = entry.target.querySelector('.skill-bar__fill');
          if (bar) setTimeout(() => bar.classList.add('is-filled'), 250);
        }

        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  // assign stagger index within each section for a natural cascade
  let lastParent = null, idx = 0;
  revealEls.forEach(el => {
    const parent = el.closest('.section, .hero');
    if (parent !== lastParent) { idx = 0; lastParent = parent; }
    el.dataset.staggerIndex = idx++;
    revealObserver.observe(el);
  });

  /* -------------------- SUBTLE PARALLAX (background logo + glows) -------------------- */
  const bgLogo = document.getElementById('bgLogo');
  const glowOne = document.getElementById('glowOne');
  const glowTwo = document.getElementById('glowTwo');
  let ticking = false;

  const applyParallax = () => {
    const y = window.scrollY;
    if (bgLogo) bgLogo.style.transform = `rotate(-6deg) translateY(${y * 0.04}px)`;
    if (glowOne) glowOne.style.transform = `translateY(${y * 0.08}px)`;
    if (glowTwo) glowTwo.style.transform = `translateY(${y * -0.05}px)`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }, { passive: true });

  /* -------------------- YOUTUBE VIDEOS -------------------- */
  const modal = document.getElementById('videoModal');
  const modalIframe = document.getElementById('modalIframe');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');

  const openModal = (youtubeId) => {
    if (!modal || !modalIframe) return;
    modalIframe.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modal || !modalIframe) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modalIframe.src = '';
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.video-card').forEach(card => {
    const ytId = card.dataset.yt;
    const thumbBtn = card.querySelector('.video-card__thumb');
    if (thumbBtn && ytId) {
      thumbBtn.addEventListener('click', () => openModal(ytId));
    }
  });

  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* -------------------- CURSOR GLOW (halo bleu qui suit la souris) -------------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (cursorGlow && !prefersReducedMotion && !isTouch) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let glowActive = false;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!glowActive) {
        glowActive = true;
        cursorGlow.classList.add('is-active');
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('is-active');
    });

    // smooth trailing follow (lerp) rendered every frame
    const renderGlow = () => {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(renderGlow);
    };
    requestAnimationFrame(renderGlow);
  }

  /* -------------------- QUICK CONTACT (bouton flottant Email / WhatsApp) -------------------- */
  const quickContact = document.getElementById('quickContact');
  const quickContactToggle = document.getElementById('quickContactToggle');
  const quickContactMenu = document.getElementById('quickContactMenu');

  if (quickContact && quickContactToggle && quickContactMenu) {
    quickContactToggle.addEventListener('click', () => {
      const isOpen = quickContact.classList.toggle('is-open');
      quickContactToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!quickContact.contains(e.target)) {
        quickContact.classList.remove('is-open');
        quickContactToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        quickContact.classList.remove('is-open');
        quickContactToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

});
