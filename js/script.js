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
