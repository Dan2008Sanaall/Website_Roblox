/* BloxBeacon front-end behaviour: menu, search, listing filters, copy buttons. */
(function () {
  'use strict';
  // S is only set in the single-file build (BloxBeacon.html), where every page,
  // image and the search index are embedded and links use #/ addresses.
  var S = window.BB_SINGLE || null;
  var root = function () { return S ? '#/' : document.documentElement.getAttribute('data-root') || './'; };
  var imgSrc = function (rel) { return S ? S.images[rel.replace(/^img\/|\.svg$/g, '')] : root() + rel; };
  var getQuery = function () {
    var qs = S ? (location.hash.split('?')[1] || '') : location.search;
    return (new URLSearchParams(qs).get('q') || '').trim();
  };
  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };
  var escapeHtml = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ---------- toast ---------- */
  var toastEl = $('[data-toast]');
  var toastTimer;
  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2200);
  }

  /* ---------- mobile menu + search panel ---------- */
  var menuBtn = $('[data-menu-toggle]');
  var nav = $('#site-nav');
  var searchBtn = $('[data-search-toggle]');
  var panel = $('#search-panel');

  function setMenu(open) {
    if (!menuBtn) return;
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
  }
  function setSearch(open) {
    if (!searchBtn) return;
    panel.hidden = !open;
    searchBtn.setAttribute('aria-expanded', String(open));
    if (open) { loadIndex(); $('input', panel).focus(); }
  }
  if (menuBtn) menuBtn.addEventListener('click', function () {
    var open = menuBtn.getAttribute('aria-expanded') !== 'true';
    setSearch(false);
    setMenu(open);
  });
  if (searchBtn) searchBtn.addEventListener('click', function () {
    var open = searchBtn.getAttribute('aria-expanded') !== 'true';
    setMenu(false);
    setSearch(open);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (menuBtn && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
    if (searchBtn && searchBtn.getAttribute('aria-expanded') === 'true') { setSearch(false); searchBtn.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.site-header')) { setMenu(false); }
  });

  /* ---------- site search (index is loaded only when needed) ---------- */
  var indexPromise;
  function loadIndex() {
    if (S) return Promise.resolve(S.index);
    if (!indexPromise) {
      indexPromise = fetch(root() + 'assets/search-index.json')
        .then(function (r) { if (!r.ok) throw new Error('index'); return r.json(); })
        .catch(function () { indexPromise = null; return []; });
    }
    return indexPromise;
  }
  function searchIndex(items, query) {
    var words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return items
      .map(function (item) {
        var title = (item.title + ' ' + item.name).toLowerCase();
        var extra = (item.tag + ' ' + item.kind).toLowerCase();
        var score = 0;
        for (var i = 0; i < words.length; i++) {
          var w = words[i];
          if (title.indexOf(w) === 0) score += 3;
          else if (title.indexOf(w) !== -1) score += 2;
          else if (extra.indexOf(w) !== -1) score += 1;
          else return null;
        }
        return { item: item, score: score };
      })
      .filter(Boolean)
      .sort(function (a, b) { return b.score - a.score || a.item.title.localeCompare(b.item.title); })
      .map(function (x) { return x.item; });
  }
  var kindTag = function (item) {
    return '<span class="tag kind-' + item.kind + '">' + item.kind + ' guide</span>';
  };

  var suggestInput = $('[data-suggest]');
  var suggestList = $('[data-suggestions]');
  if (suggestInput) suggestInput.addEventListener('input', function () {
    var q = suggestInput.value.trim();
    if (q.length < 2) { suggestList.hidden = true; return; }
    loadIndex().then(function (items) {
      if (suggestInput.value.trim() !== q) return;
      var found = searchIndex(items, q).slice(0, 5);
      suggestList.innerHTML = found.length
        ? found.map(function (i) {
            return '<li><a href="' + root() + i.url + '">' + kindTag(i) + '<span>' + escapeHtml(i.title) + '</span></a></li>';
          }).join('')
        : '<li class="none">No results found. Press Search to see other options.</li>';
      suggestList.hidden = false;
    });
  });

  function initPage() {
  var searchPage = $('[data-search-page]');
  if (searchPage) {
    var q = getQuery();
    var input = $('input', searchPage);
    var countEl = $('[data-search-count]');
    var resultsEl = $('[data-search-results]');
    var emptyEl = $('[data-search-empty]');
    var run = function (query) {
      loadIndex().then(function (items) {
        var found = searchIndex(items, query);
        emptyEl.hidden = !query || found.length > 0;
        $('[data-search-term]').textContent = '“' + query + '”';
        countEl.textContent = !query
          ? 'Type a game name or topic to search.'
          : found.length ? found.length + (found.length === 1 ? ' result' : ' results') + ' for “' + query + '”' : '';
        resultsEl.innerHTML = found.map(function (i) {
          return '<li class="result"><img src="' + imgSrc(i.img) + '" alt="" width="640" height="360" loading="lazy">' +
            '<div>' + kindTag(i) + ' <span class="tag tag-plain">' + escapeHtml(i.tag) + '</span>' +
            '<h2><a href="' + root() + i.url + '">' + escapeHtml(i.title) + '</a></h2>' +
            '<p>' + escapeHtml(i.desc) + '</p></div></li>';
        }).join('');
      });
    };
    input.value = q;
    run(q);
    input.addEventListener('input', function () {
      var v = input.value.trim();
      var qs = v ? '?q=' + encodeURIComponent(v) : '';
      history.replaceState(null, '', S ? '#/search/' + qs : qs || location.pathname);
      run(v);
    });
  }

  /* ---------- listing pages: search, sort, category, load more ---------- */
  $$('[data-listing]').forEach(function (box) {
    var list = $('[data-items]', box);
    var items = $$('[data-item]', list);
    var search = $('[data-filter-search]', box);
    var sortBtns = $$('[data-sort]', box);
    var catBtns = $$('[data-cat]', box);
    var more = $('[data-more]', box);
    var empty = $('[data-empty]', box);
    var count = $('[data-count]', box);
    var pageSize = parseInt(box.getAttribute('data-page-size'), 10) || 6;
    var state = { q: '', sort: sortBtns.length ? 'published' : null, cat: 'all', shown: pageSize };

    function press(btns, attr, value) {
      btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value)); });
    }
    function render() {
      if (state.sort) {
        items.sort(function (a, b) {
          var x = a.dataset[state.sort], y = b.dataset[state.sort];
          return state.sort === 'title' ? x.localeCompare(y) : y.localeCompare(x) || a.dataset.title.localeCompare(b.dataset.title);
        });
        items.forEach(function (el) { list.appendChild(el); });
      }
      var words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      var matches = items.filter(function (el) {
        if (state.cat !== 'all' && el.dataset.cat !== state.cat) return false;
        return words.every(function (w) { return el.dataset.title.indexOf(w) !== -1; });
      });
      items.forEach(function (el) { el.hidden = true; });
      matches.slice(0, state.shown).forEach(function (el) { el.hidden = false; });
      var visible = Math.min(state.shown, matches.length);
      more.hidden = matches.length <= state.shown;
      empty.hidden = matches.length > 0;
      count.textContent = matches.length ? 'Showing ' + visible + ' of ' + matches.length + (matches.length === 1 ? ' guide' : ' guides') : '';
    }

    if (search) search.addEventListener('input', function () { state.q = search.value.trim(); state.shown = pageSize; render(); });
    sortBtns.forEach(function (b) {
      b.addEventListener('click', function () { state.sort = b.getAttribute('data-sort'); press(sortBtns, 'data-sort', state.sort); render(); });
    });
    catBtns.forEach(function (b) {
      b.addEventListener('click', function () { state.cat = b.getAttribute('data-cat'); state.shown = pageSize; press(catBtns, 'data-cat', state.cat); render(); });
    });
    more.addEventListener('click', function () {
      var firstNew = state.shown;
      state.shown += pageSize;
      render();
      var visible = items.filter(function (el) { return !el.hidden; });
      var link = visible[firstNew] && $('.card-title a', visible[firstNew]);
      if (link) link.focus();
    });
    $('[data-reset]', box).addEventListener('click', function () {
      state.q = ''; state.cat = 'all'; state.shown = pageSize;
      if (search) { search.value = ''; search.focus(); }
      press(catBtns, 'data-cat', 'all');
      render();
    });
    render();
  });
  }
  window.BB = { initPage: initPage, closePanels: function () { setMenu(false); setSearch(false); } };
  if (!S) initPage();

  /* ---------- copy buttons ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }
  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy]');
    if (!btn) return;
    var text = btn.getAttribute('data-copy');
    var label = $('[data-copy-label]', btn);
    copyText(text).then(function () {
      btn.classList.add('is-copied');
      label.textContent = 'Copied!';
      toast(text.length > 40 ? 'Script copied to clipboard' : 'Copied ' + text + ' to clipboard');
      clearTimeout(btn._t);
      btn._t = setTimeout(function () { btn.classList.remove('is-copied'); label.textContent = 'Copy'; }, 2000);
      btn.focus();
    }, function () {
      toast('Could not copy automatically. Select the text and copy it manually.');
    });
  });
})();
