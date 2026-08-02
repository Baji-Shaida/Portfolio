// Active tab highlighting on scroll
const tabs = document.querySelectorAll('.tab');
const sections = ['overview','skills','projects','certifications','education','contact']
  .map(id => document.getElementById(id))
  .filter(Boolean);

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const id = entry.target.id;
      tabs.forEach(t => t.classList.toggle('active', t.getAttribute('href') === '#' + id));
    }
  });
}, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });

sections.forEach(s => io.observe(s));

// Scroll reveal
const revealTargets = document.querySelectorAll(
  '.kpi-panel, .skill-group, .project-card, .mini-card, .cert-card, .edu-row, .contact-panel'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      revealIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealTargets.forEach(el => revealIO.observe(el));

// Mobile menu — simple: click hamburger toggles a basic dropdown built from tabs
const menuBtn = document.getElementById('menuBtn');
const tabsNav = document.getElementById('tabs');
if(menuBtn){
  menuBtn.addEventListener('click', () => {
    tabsNav.classList.toggle('mobile-open');
  });
}
