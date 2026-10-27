// Theme
const themeToggles = document.querySelectorAll('[data-theme-toggle]');
const updateThemeControls = theme => {
  const dark = theme === 'dark';
  themeToggles.forEach(toggle => {
    toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.querySelector('i').className = `fa-solid ${dark ? 'fa-sun' : 'fa-moon'}`;
    const label = toggle.querySelector('span');
    if (label) label.textContent = dark ? 'Light mode' : 'Dark mode';
  });
};
const setTheme = theme => {
  document.documentElement.dataset.theme = theme;
  updateThemeControls(theme);
  try {
    localStorage.setItem('cvTheme', theme);
  } catch {
    // Theme still applies for the current visit when storage is unavailable.
  }
};
const initialTheme = document.documentElement.dataset.theme || 'light';
updateThemeControls(initialTheme);
themeToggles.forEach(toggle => toggle.addEventListener('click', () => {
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
}));

// Loader
window.addEventListener('load', () => setTimeout(() => document.getElementById('loader').classList.add('hide'), 700));

// Typing title
const words = ['web', 'future', 'people', 'real world'];
const typed = document.getElementById('typed');
let w = 0, c = 0, del = false;
(function type() {
  const word = words[w];
  typed.textContent = word.slice(0, c);
  if (!del && c === word.length) { del = true; return setTimeout(type, 1400); }
  if (del && c === 0) { del = false; w = (w + 1) % words.length; }
  c += del ? -1 : 1;
  setTimeout(type, del ? 60 : 110);
})();

// Scroll reveal + animated skill bars
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('.bar i').forEach(b => (b.style.width = b.dataset.w + '%'));
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Scroll-spy navigation
const links = [...document.querySelectorAll('#nav a')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

// Mobile menu
const sidebar = document.getElementById('sidebar');
document.getElementById('menuBtn').addEventListener('click', () => sidebar.classList.toggle('open'));
links.forEach(a => a.addEventListener('click', () => sidebar.classList.remove('open')));

// Project modal
const modal = document.getElementById('modal');
const open = card => {
  document.getElementById('mTitle').textContent = card.dataset.title;
  document.getElementById('mDesc').textContent = card.dataset.desc;
  document.getElementById('mTech').innerHTML = card.dataset.tech.split(',').map(t => `<span>${t}</span>`).join('');
  document.getElementById('mRepo').href = card.dataset.repo;
  const demo = document.getElementById('mDemo');
  demo.style.display = card.dataset.demo ? '' : 'none';
  demo.href = card.dataset.demo || '#';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
};
const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); };
document.querySelectorAll('.project').forEach(card => {
  card.addEventListener('click', () => open(card));
  card.addEventListener('keydown', e => { if (e.key === 'Enter') open(card); });
});
document.getElementById('closeModal').addEventListener('click', close);
modal.addEventListener('click', e => { if (e.target === modal) close(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
