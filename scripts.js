/* ── ML Club, Uttara University — scripts.js ── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Theme Toggle (Day / Night) ── */
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  const toggleBtn = document.getElementById('theme-toggle');
  function updateToggleIcon() {
    if (!toggleBtn) return;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    toggleBtn.textContent = dark ? '☀️' : '🌙';
    toggleBtn.title = dark ? 'Switch to Day Mode' : 'Switch to Night Mode';
  }
  updateToggleIcon();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateToggleIcon();
    });
  }

  /* ── Active nav link ── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  /* ── Mobile hamburger ── */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  let menuOpen = false;
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      menuOpen = !menuOpen;
      if (menuOpen) {
        navLinks.style.cssText = `
          display:flex;flex-direction:column;
          position:fixed;top:62px;left:0;right:0;
          background:var(--nav-bg);
          backdrop-filter:blur(20px);
          padding:1.5rem 2rem;gap:1rem;
          border-bottom:1px solid var(--border);
          z-index:199;
        `;
      } else {
        navLinks.style.cssText = '';
      }
    });
  }

  /* ── Scroll-reveal cards ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(
    '.card, .course-card, .event-card, .member-card, .project-card, .blog-post-card'
  ).forEach((el, i) => {
    el.style.cssText += `
      opacity:0;
      transform:translateY(22px);
      transition:opacity 0.55s ${i * 0.06}s ease, transform 0.55s ${i * 0.06}s ease;
    `;
    observer.observe(el);
  });

  /* ── Animated counters ── */
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = Math.ceil(target / 80);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString() + suffix;
      if (current >= target) clearInterval(timer);
    }, 20);
  });

  /* ── Countdown timers ── */
  function updateCountdowns() {
    document.querySelectorAll('[data-countdown]').forEach(el => {
      const target = new Date(el.dataset.countdown).getTime();
      const diff = target - Date.now();
      if (diff <= 0) { el.textContent = 'Started'; return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      el.textContent = `${d}d ${h}h ${m}m`;
    });
  }
  updateCountdowns();
  setInterval(updateCountdowns, 60000);

  /* ── Tab switcher ── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('[data-tab-group]');
      if (!group) return;
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const id = btn.dataset.tab;
      document.querySelectorAll('[data-panel]').forEach(p => {
        p.style.display = p.dataset.panel === id ? 'block' : 'none';
      });
    });
  });

  /* ── Photo Slider ── */
  const slider = document.querySelector('.slider-slides');
  if (slider) {
    const slides    = slider.querySelectorAll('.slide');
    const dotsWrap  = document.querySelector('.slider-dots');
    const prevBtn   = document.querySelector('.slider-arrow.prev');
    const nextBtn   = document.querySelector('.slider-arrow.next');
    let current = 0;
    let autoTimer;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function goTo(idx) {
      slides[current].classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      slider.style.transform = `translateX(-${current * 100}%)`;
      dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function startAuto() {
      autoTimer = setInterval(() => goTo(current + 1), 4500);
    }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }

    slides[0].classList.add('active');

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    // Touch / swipe
    let touchStartX = 0;
    slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) { goTo(current + (dx < 0 ? 1 : -1)); resetAuto(); }
    });

    startAuto();
  }

  /* ── Course filter buttons ── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.course-filters').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ── Course search ── */
  const courseSearch = document.getElementById('course-search');
  if (courseSearch) {
    courseSearch.addEventListener('input', () => {
      const q = courseSearch.value.toLowerCase();
      document.querySelectorAll('.course-card').forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  /* ── Form validation ── */
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#e11d48';
          valid = false;
        } else {
          input.style.borderColor = '';
        }
      });
      if (valid) {
        const btn = form.querySelector('[type=submit]');
        if (btn) {
          const orig = btn.textContent;
          btn.textContent = '✓ Sent!';
          btn.style.background = '#16a34a';
          setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 3000);
        }
      }
    });
  });

});


const filterBtns = document.querySelectorAll(".filter-btn");

filterBtns.forEach(btn=>{
  btn.addEventListener("click",()=>{
    
    filterBtns.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");

  });
});