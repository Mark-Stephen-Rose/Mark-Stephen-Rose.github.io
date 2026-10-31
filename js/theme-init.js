// Runs in <head>, before first paint, so the page never flashes the wrong theme.
// Saved choice wins; otherwise follow the visitor's system setting.
(function () {
  var root = document.documentElement;
  var ACCENTS = ['sage', 'indigo', 'plum', 'forest', 'slate'];
  var theme = null;
  var accent = null;
  try {
    theme = localStorage.getItem('site-theme');
    accent = localStorage.getItem('site-accent');
  } catch (e) { /* storage blocked: fall back to defaults */ }

  if (theme !== 'dark' && theme !== 'light') {
    theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  root.setAttribute('data-theme', theme);
  if (ACCENTS.indexOf(accent) !== -1) root.setAttribute('data-accent', accent);
})();
