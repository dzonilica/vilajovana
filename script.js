/* ════════════════════════════════════════════════════
   VILA JOVANA — interactions
═══════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ───── Loader ───── */
  const loader = document.getElementById('loader');
  const hideLoader = () => {
    loader && loader.classList.add('is-hidden');
  };
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 1700);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 1700));
    // Safety fallback — never stall longer than 3.5s
    setTimeout(hideLoader, 3500);
  }

  /* ───── Nav scroll state ───── */
  const nav = document.getElementById('nav');
  const updateNav = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ───── Mobile burger ───── */
  const burger = document.getElementById('burger');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });

    // Close when clicking a nav link
    nav.querySelectorAll('.nav__center a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ───── Hero tabs (Voiceflow-style switcher) ───── */
  const tabs = document.querySelectorAll('.hero__tab');
  const images = document.querySelectorAll('.hero__image');
  let autoIdx = 0;
  let autoTimer = null;

  const selectTab = (idx) => {
    tabs.forEach((t, i) => t.setAttribute('aria-selected', String(i === idx)));
    images.forEach((img, i) => img.classList.toggle('hero__image--active', i === idx));
    autoIdx = idx;
  };

  const startAuto = () => {
    stopAuto();
    autoTimer = setInterval(() => {
      autoIdx = (autoIdx + 1) % tabs.length;
      selectTab(autoIdx);
    }, 4500);
  };
  const stopAuto = () => { if (autoTimer) clearInterval(autoTimer); };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      selectTab(i);
      stopAuto();
    });
    tab.addEventListener('mouseenter', stopAuto);
  });

  if (tabs.length) startAuto();

  /* ───── Lightbox ───── */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCap = document.getElementById('lightboxCap');
  const lbClose = document.querySelector('.lightbox__close');

  document.querySelectorAll('.gallery .g').forEach(fig => {
    fig.addEventListener('click', () => {
      const src = fig.dataset.src;
      const cap = fig.dataset.caption || '';
      if (!src) return;
      lbImg.src = src;
      lbImg.alt = cap;
      lbCap.textContent = cap;
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLb = () => {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (lbClose) lbClose.addEventListener('click', closeLb);
  if (lb) {
    lb.addEventListener('click', (e) => {
      if (e.target === lb) closeLb();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb && lb.classList.contains('is-open')) closeLb();
  });

  /* ───── Year in footer ───── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ───── Reveal on scroll ───── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.about, .rooms, .gallery, .location, .contact, .room-card, .g, .video-card').forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });

})();
