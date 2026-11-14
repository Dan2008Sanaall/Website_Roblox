/* Router for the single-file build (BloxBeacon.html). Pages are embedded in
   window.BB_SINGLE.pages and shown according to the #/ part of the address. */
(function () {
  'use strict';
  var S = window.BB_SINGLE;
  var main = document.getElementById('main');
  var first = true;

  // Turn a relative link written for the multi-page site into a #/ address.
  function toHash(href, basePath) {
    if (!href || /^(#|[a-z][a-z0-9+.-]*:)/i.test(href)) return null;
    var u = new URL(href, 'http://x/' + basePath);
    return '#' + u.pathname + u.search;
  }
  function rewriteLinks(scope, basePath) {
    Array.prototype.forEach.call(scope.querySelectorAll('a[href]'), function (a) {
      var h = toHash(a.getAttribute('href'), basePath);
      if (h) a.setAttribute('href', h);
    });
  }
  function currentPath() {
    var h = location.hash;
    if (h.indexOf('#/') !== 0) return null;
    return h.slice(2).split('?')[0];
  }

  function render() {
    var path = currentPath();
    if (path === null) {
      if (!first) return; // in-page anchors such as "Skip to content"
      path = '';
    }
    var page = S.pages[path] || S.pages['404'];
    var basePath = S.pages[path] ? path : '';
    main.innerHTML = page.body.replace(/src="[^"]*img\/([a-z0-9-]+)\.svg"/g, function (m, slug) {
      return 'src="' + S.images[slug] + '"';
    });
    rewriteLinks(main, basePath);
    document.title = path === '' ? S.siteTitle : page.title + ' | ' + S.siteName;
    Array.prototype.forEach.call(document.querySelectorAll('#site-nav a'), function (a) {
      var target = a.getAttribute('href').slice(2).split('/')[0] || 'home';
      if (target === page.active) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    window.BB.closePanels();
    window.BB.initPage();
    if (!first) {
      window.scrollTo(0, 0);
      main.setAttribute('tabindex', '-1');
      main.focus({ preventScroll: true });
    }
    first = false;
  }

  rewriteLinks(document.querySelector('.site-header'), '');
  rewriteLinks(document.querySelector('.site-footer'), '');

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (form.getAttribute('role') !== 'search') return;
    e.preventDefault();
    var q = form.querySelector('input').value.trim();
    var next = '#/search/' + (q ? '?q=' + encodeURIComponent(q) : '');
    if (location.hash === next) render();
    else location.hash = next;
  });

  window.addEventListener('hashchange', render);
  render();
})();
