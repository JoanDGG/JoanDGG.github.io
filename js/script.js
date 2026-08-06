/* ---------- Falling pixels background ---------- */
(function initPixelRain(){
  const canvas = document.getElementById('pixel-rain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const colors = ['#ff2970', '#00ebeb', '#d60047', '#009392', '#f3eef7'];
  let particles = [];
  let width, height, dpr;

  function sizeCanvas(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeParticle(randomY){
    const depth = Math.random();
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -10,
      size: 1.5 + depth * 3.5,
      speed: 0.4 + depth * 1.6,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.15 + depth * 0.55
    };
  }

  function initParticles(){
    const density = Math.max(40, Math.min(140, Math.floor((width * height) / 16000)));
    particles = Array.from({ length: density }, () => makeParticle(true));
  }

  function draw(){
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.y += p.speed;
      if (p.y > height + 10){
        p.y = -10;
        p.x = Math.random() * width;
      }
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  sizeCanvas();
  initParticles();

  if (reduceMotion){
    // Draw a single static frame instead of animating continuously
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1;
  } else {
    requestAnimationFrame(draw);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { sizeCanvas(); initParticles(); }, 200);
  });
})();

/* ---------- Scroll reveal transitions ---------- */
(function initScrollReveal(){
  const groupSelectors = ['.grid-featured', '.grid-all', '.skills-grid'];
  groupSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(group => {
      Array.from(group.children).forEach((el, i) => {
        el.setAttribute('data-reveal', '');
        el.style.transitionDelay = (i % 6) * 0.07 + 's';
      });
    });
  });

  document.querySelectorAll('.timeline > .t-item').forEach((el, i) => {
    el.setAttribute('data-reveal', '');
    el.style.transitionDelay = Math.min(i, 5) * 0.06 + 's';
  });

  document.querySelectorAll('.contact-panel').forEach(el => el.setAttribute('data-reveal', ''));

  const revealTargets = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in-view'));
  }
})();

const menuToggle = document.getElementById('menuToggle');
  const engineNav = document.getElementById('engineNav');
  menuToggle.addEventListener('click', () => { engineNav.classList.toggle('open'); });
  engineNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => engineNav.classList.remove('open'));
  });

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const setActive = () => {
    let current = sections[0].id;
    const offset = 120;
    sections.forEach(sec => { if (window.scrollY + offset >= sec.offsetTop) current = sec.id; });
    navLinks.forEach(link => { link.classList.toggle('active', link.getAttribute('href') === '#' + current); });
  };
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  const filterBar = document.getElementById('filterBar');
  const rows = document.querySelectorAll('#allProjectsGrid .row-card');
  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    rows.forEach(row => {
      const tags = row.dataset.tags.split(' ');
      row.classList.toggle('hide', f !== 'all' && !tags.includes(f));
    });
  });
