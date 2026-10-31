// Home page only: one panel at a time, Back/Forward support, shareable project links.
(function () {
  var root = document.documentElement;
  root.classList.add('panel-mode');

  var siteHeader = document.getElementById('home');
  var mainEl = document.querySelector('main');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var logoLink = document.getElementById('logoLink');
  var baseTitle = document.title;

  // The address bar always shows the clean URL. The open panel lives in history.state,
  // so Back, Forward and reload restore it without a #hash in the URL.
  var cleanPath = location.pathname.replace(/index\.html$/, '');
  var current = 'home';

  function navLabel(id) {
    var link = document.querySelector('.nav-links a[href="#' + id + '"]');
    return link ? link.textContent.trim() : '';
  }

  function showPanel(id, moveFocus) {
    var target = id && id !== 'home' ? document.getElementById(id) : null;
    if (target && !target.matches('main section')) target = null;

    siteHeader.classList.remove('is-active');
    mainEl.classList.remove('has-active');
    sections.forEach(function (sec) { sec.classList.remove('is-active'); });

    var heading;
    if (target) {
      mainEl.classList.add('has-active');
      target.classList.add('is-active');
      heading = target.querySelector('h2');
      current = target.id;
      document.title = navLabel(current) + ' · Mark Rose';
    } else {
      siteHeader.classList.add('is-active');
      heading = siteHeader.querySelector('h1');
      current = 'home';
      document.title = baseTitle;
    }

    // <header> and <main> are what scroll, and <main> is shared by every section.
    siteHeader.scrollTop = 0;
    mainEl.scrollTop = 0;

    navLinks.forEach(function (link) {
      if (link.getAttribute('href') === '#' + current) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    // Tell keyboard and screen-reader users that the content changed.
    if (moveFocus && heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }

  function remember() {
    try { history.replaceState({ panel: current }, '', cleanPath); } catch (e) { /* e.g. file:// */ }
  }

  // User-initiated navigation: add a history entry so Back steps to the previous panel.
  function go(id) {
    if (id === current) {
      showPanel(id, true);
      return;
    }
    showPanel(id, true);
    try { history.pushState({ panel: current }, '', cleanPath); } catch (e) { /* e.g. file:// */ }
  }

  // ----- Opening from a link such as /#projects or /#asl-detector -----
  var highlightTimer = null;
  function openFromHash(hash) {
    var id = hash.replace(/^#/, '');
    var el = id ? document.getElementById(id) : null;
    if (el && el.classList.contains('project-entry')) {
      showPanel('projects', false);
      el.scrollIntoView({ block: 'start' });
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
      el.classList.add('is-targeted');
      clearTimeout(highlightTimer);
      highlightTimer = setTimeout(function () { el.classList.remove('is-targeted'); }, 3000);
    } else {
      showPanel(id, false);
    }
    remember();
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      go(link.getAttribute('href').slice(1));
      if (window.siteNav) window.siteNav.closeDrawer();
    });
  });

  logoLink.addEventListener('click', function (e) {
    e.preventDefault();
    go('home');
    if (window.siteNav) window.siteNav.closeDrawer();
  });

  window.addEventListener('popstate', function (e) {
    showPanel((e.state && e.state.panel) || 'home', true);
  });

  // Someone pastes a /#projects link into the tab that already has the site open.
  window.addEventListener('hashchange', function () {
    if (location.hash) openFromHash(location.hash);
  });

  // ----- Shareable project links -----
  var statusEl = document.getElementById('shareStatus');

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () { return true; },
        function () { return legacyCopy(text); }
      );
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    var box = document.createElement('textarea');
    box.value = text;
    box.setAttribute('readonly', '');
    box.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(box);
    box.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    box.remove();
    return ok;
  }

  document.querySelectorAll('[data-share]').forEach(function (btn) {
    var label = btn.querySelector('.share-label');
    var original = label.textContent;
    var timer = null;

    btn.addEventListener('click', function () {
      var url = location.origin + cleanPath + '#' + btn.dataset.share;
      var name = btn.dataset.name || 'project';

      copyText(url).then(function (ok) {
        if (!ok) {
          window.prompt('Copy this link:', url);
          return;
        }
        label.textContent = 'Link copied';
        if (statusEl) statusEl.textContent = 'Link to ' + name + ' copied to clipboard.';
        clearTimeout(timer);
        timer = setTimeout(function () {
          label.textContent = original;
          if (statusEl) statusEl.textContent = '';
        }, 2200);
      });
    });
  });

  // ----- First load -----
  if (location.hash.length > 1) {
    openFromHash(location.hash);
  } else {
    showPanel((history.state && history.state.panel) || 'home', false);
    remember();
  }
})();
