// ============================================================
// Timecode ticker (cosmetic, ties to scroll progress)
// ============================================================
const timecodeEl = document.getElementById('timecode');
const scrollpctEl = document.getElementById('scrollpct');

function fmt(n){ return String(n).padStart(2,'0'); }

function updateTimecode(){
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? window.scrollY / max : 0;
  const totalFrames = Math.floor(pct * 24 * 60 * 20); // arbitrary cinematic scale
  const frames = totalFrames % 24;
  const secs = Math.floor(totalFrames / 24) % 60;
  const mins = Math.floor(totalFrames / 24 / 60) % 60;
  const hrs = Math.floor(totalFrames / 24 / 60 / 60);
  if(timecodeEl) timecodeEl.textContent = `${fmt(hrs)}:${fmt(mins)}:${fmt(secs)}:${fmt(frames)}`;
  if(scrollpctEl) scrollpctEl.textContent = `${Math.round(pct*100)}%`;
}
window.addEventListener('scroll', updateTimecode, { passive:true });
updateTimecode();

// ============================================================
// Scroll reveal for scenes
// ============================================================
const revealTargets = document.querySelectorAll(
  '.signal-copy, .rack, .filmstrip-wrap, .credits-grid, .contact h2, .contact-sub, .contact-actions'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => io.observe(el));

// ============================================================
// Equalizer bars fill when in view
// ============================================================
const rackRows = document.querySelectorAll('.rack-row');
const rackIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const row = entry.target;
      const level = row.getAttribute('data-level') || 0;
      const fill = row.querySelector('.rack-fill');
      requestAnimationFrame(() => { fill.style.width = level + '%'; });
      rackIO.unobserve(row);
    }
  });
}, { threshold: 0.4 });
rackRows.forEach(r => rackIO.observe(r));

// ============================================================
// Filmstrip scroll progress track
// ============================================================
const filmstrip = document.getElementById('filmstrip');
const trackFill = document.getElementById('trackFill');
if(filmstrip && trackFill){
  const updateTrack = () => {
    const max = filmstrip.scrollWidth - filmstrip.clientWidth;
    const pct = max > 0 ? (filmstrip.scrollLeft / max) * 100 : 0;
    trackFill.style.width = Math.max(8, pct) + '%';
  };
  filmstrip.addEventListener('scroll', updateTrack, { passive:true });
  updateTrack();
}

// ============================================================
// Active nav dot based on section in view
// ============================================================
const navLinks = document.querySelectorAll('.reelnav a');
const sections = ['top','signal','instruments','reel','credits','contact']
  .map(id => document.getElementById(id))
  .filter(Boolean);

const navIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const id = entry.target.id;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => navIO.observe(s));
