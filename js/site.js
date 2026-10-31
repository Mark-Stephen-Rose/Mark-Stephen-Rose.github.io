// Shared by every page: theme toggle, accent picker and the mobile nav drawer.
(function () {
  var root = document.documentElement;

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* storage blocked */ }
  }

  // ----- Light / dark theme -----
  var themeToggle = document.getElementById('themeToggle');

  function setTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (persist) save('site-theme', theme);
    if (themeToggle) themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
    themeToggle.setAttribute('aria-pressed', String(root.getAttribute('data-theme') === 'dark'));
  }

  // Until the visitor picks a theme themselves, keep following their system setting.
  if (window.matchMedia) {
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
    var onSystemChange = function (e) {
      if (!read('site-theme')) setTheme(e.matches ? 'dark' : 'light', false);
    };
    if (systemDark.addEventListener) systemDark.addEventListener('change', onSystemChange);
  }

  // ----- Accent colour picker -----
  var swatches = document.querySelectorAll('.swatch');

  function setAccent(accent, persist) {
    root.setAttribute('data-accent', accent);
    if (persist) save('site-accent', accent);
    swatches.forEach(function (sw) {
      sw.setAttribute('aria-pressed', String(sw.dataset.accent === accent));
    });
  }

  swatches.forEach(function (sw) {
    sw.addEventListener('click', function () { setAccent(sw.dataset.accent, true); });
  });
  setAccent(root.getAttribute('data-accent') || 'sage', false);

  // ----- Mobile nav drawer -----
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navLinks');

  function isOpen() { return !!navMenu && navMenu.classList.contains('is-open'); }

  function setDrawer(open, returnFocus) {
    if (!navMenu || !navToggle) return;
    navMenu.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    if (!open && returnFocus) navToggle.focus();
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () { setDrawer(!isOpen(), false); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) setDrawer(false, true);
    });

    document.addEventListener('click', function (e) {
      if (isOpen() && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        setDrawer(false, false);
      }
    });
  }

  // Lets home.js close the drawer after a panel link is used.
  window.siteNav = { closeDrawer: function () { setDrawer(false, false); } };
})();
