/* =============================================
   KHATUNA — MODERN INTERACTIVE SCRIPTS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ---- PRELOADER ----
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 600);
  });
  // Fallback in case load doesn't fire
  setTimeout(() => preloader.classList.add('hidden'), 3000);

  // ---- CUSTOM CURSOR ----
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (cursor && follower && window.innerWidth > 768) {
    let mx = 0, my = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    (function moveCursor() {
      fx += (mx - fx) * 0.15;
      fy += (my - fy) * 0.15;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
      cursor.style.transform = 'translate(-50%, -50%)';
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';
      requestAnimationFrame(moveCursor);
    })();

    document.querySelectorAll('a, button, .g-card, .srv-btn, .tag').forEach(el => {
      el.addEventListener('mouseenter', () => {
        follower.style.width = '56px';
        follower.style.height = '56px';
        follower.style.borderColor = 'rgba(212,168,83,0.5)';
      });
      el.addEventListener('mouseleave', () => {
        follower.style.width = '36px';
        follower.style.height = '36px';
        follower.style.borderColor = '';
      });
    });
  } else {
    if (cursor) cursor.style.display = 'none';
    if (follower) follower.style.display = 'none';
  }

  // ---- NAVBAR ----
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  });

  // ---- MOBILE MENU ----
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  burger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    const lines = burger.querySelectorAll('.burger-line');
    if (menuOpen) {
      lines[0].style.transform = 'rotate(45deg) translate(3px, 3px)';
      lines[1].style.transform = 'rotate(-45deg) translate(3px, -3px)';
      document.body.style.overflow = 'hidden';
    } else {
      lines[0].style.transform = '';
      lines[1].style.transform = '';
      document.body.style.overflow = '';
    }
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      const lines = burger.querySelectorAll('.burger-line');
      lines[0].style.transform = '';
      lines[1].style.transform = '';
      document.body.style.overflow = '';
    });
  });

  // ---- HERO SLIDESHOW ----
  const slides = document.querySelectorAll('.hero-slide');
  const counterEl = document.getElementById('counterCurrent');
  let currentSlide = 0;

  // Load bg images via data-src
  slides.forEach(s => {
    const src = s.dataset.src;
    if (src) s.style.backgroundImage = `url('${src}')`;
  });

  function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
    if (counterEl) counterEl.textContent = String(currentSlide + 1).padStart(2, '0');
  }

  setInterval(nextSlide, 5000);

  // ---- SERVICE TABS ----
  const srvBtns = document.querySelectorAll('.srv-btn');
  const srvPanels = document.querySelectorAll('.srv-panel');

  srvBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      srvBtns.forEach(b => b.classList.remove('active'));
      srvPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('panel-' + btn.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });

  // ---- GALLERY LIGHTBOX ----
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');

  document.querySelectorAll('.g-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (!img || !lightbox) return;
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (lbClose) lbClose.addEventListener('click', e => { e.stopPropagation(); closeLightbox(); });
  if (lightbox) lightbox.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  // ---- SCROLL REVEAL ----
  const revealEls = document.querySelectorAll('.reveal-el');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), +delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ---- NUMBER COUNTER ----
  const metricNums = document.querySelectorAll('.metric-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const isFloat = target % 1 !== 0;
        let current = 0;
        const step = target / 60;
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          el.textContent = isFloat ? current.toFixed(1) : Math.round(current);
        }, 16);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  metricNums.forEach(el => counterObserver.observe(el));

  // ---- SMOOTH SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- PARALLAX ON HERO ----
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    const hero = document.getElementById('hero');
    if (hero && scroll < window.innerHeight) {
      const content = hero.querySelector('.hero-content');
      if (content) {
        content.style.transform = `translateY(${scroll * 0.3}px)`;
        content.style.opacity = 1 - scroll / (window.innerHeight * 0.8);
      }
    }
  });

  // ---- FAQ ACCORDION ----
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('open');
      // Close all others
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Toggle current
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ---- FLOATING CHAT ----
  const floatBtn = document.getElementById('floatBtn');
  const floatChat = document.getElementById('floatChat');
  if (floatBtn && floatChat) {
    floatBtn.addEventListener('click', () => {
      floatChat.classList.toggle('open');
    });
    // Close when clicking outside
    document.addEventListener('click', e => {
      if (!floatChat.contains(e.target)) {
        floatChat.classList.remove('open');
      }
    });
  }

  // ---- BOOKING FORM ----
  const bookingForm = document.getElementById('bookingForm');
  const formSuccess = document.getElementById('formSuccess');
  if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      // Get form data
      const name = document.getElementById('formName').value;
      const phone = document.getElementById('formPhone').value;
      const service = document.getElementById('formService').value;
      const date = document.getElementById('formDate').value;

      // In a real app you'd send this to a server
      console.log('Booking:', { name, phone, service, date });

      // Show success
      formSuccess.classList.add('show');
      bookingForm.reset();

      // Hide success after 5s
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    });
  }

});
