/**
 * Reusable HTML building blocks. Every page is assembled from these, so a
 * change here (for example to the card or the header) updates the whole site.
 */
const site = require('../content/site');
const { logoMark, ui } = require('./art');

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const fmtDate = (iso) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(iso + 'T00:00:00Z')
  );

const time = (iso) => `<time datetime="${iso}">${fmtDate(iso)}</time>`;

const rootFor = (path) => {
  const depth = path.split('/').filter(Boolean).length;
  return depth ? '../'.repeat(depth) : './';
};

const NAV = [
  { key: 'home', label: 'Home', href: '' },
  { key: 'codes', label: 'Roblox Codes', href: 'codes/' },
  { key: 'scripts', label: 'Roblox Scripts', href: 'scripts/' },
];

const FOOTER = [
  ...NAV,
  { label: 'About Us', href: 'about/' },
  { label: 'Contact Us', href: 'contact/' },
  { label: 'Privacy Policy', href: 'privacy/' },
  { label: 'Disclaimer', href: 'disclaimer/' },
];

const SCRIPT_TYPES = {
  studio: { label: 'Roblox Studio', cls: 'tag-studio', long: 'For Roblox Studio development' },
  'third-party': { label: 'Third-party tool', cls: 'tag-third', long: 'Involves a third-party tool' },
};

function layout({ path, title, description, active, body, image }) {
  const root = rootFor(path);
  const fullTitle = path === '' ? `${site.name} – Roblox Codes & Scripts` : `${title} | ${site.name}`;
  const canonical = site.url.replace(/\/$/, '') + '/' + path;
  const link = (n) =>
    `<a href="${root}${n.href}"${n.key === active ? ' aria-current="page"' : ''}>${n.label}</a>`;

  return `<!doctype html>
<html lang="en" data-root="${root}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
${site.demoMode ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="${image ? 'article' : 'website'}">
<meta name="theme-color" content="#0b1634">
<link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="${root}assets/fonts/sora-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${root}assets/styles.css">
<script src="${root}assets/app.js" defer></script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-bar">
    <a class="brand" href="${root}" aria-label="${site.name} home">${logoMark(36)}<span class="brand-name">Blox<span>Beacon</span></span></a>
    <nav class="site-nav" id="site-nav" aria-label="Main">${NAV.map(link).join('')}</nav>
    <div class="header-actions">
      <button class="icon-btn" type="button" data-search-toggle aria-expanded="false" aria-controls="search-panel" aria-label="Search">${ui.search}</button>
      <button class="icon-btn menu-btn" type="button" data-menu-toggle aria-expanded="false" aria-controls="site-nav" aria-label="Menu">${ui.menu}</button>
    </div>
  </div>
  <div class="search-panel" id="search-panel" hidden>
    <div class="wrap">
      <form class="search-form" action="${root}search/" method="get" role="search">
        <label class="sr-only" for="header-q">Search code and script guides</label>
        <input id="header-q" name="q" type="search" placeholder="Search games, codes and scripts…" autocomplete="off" data-suggest>
        <button class="btn btn-primary" type="submit">Search</button>
      </form>
      <ul class="suggestions" data-suggestions hidden></ul>
    </div>
  </div>
</header>
${
  site.demoMode
    ? `<p class="demo-bar"><span class="wrap"><strong>Preview build.</strong> Games, codes, rewards and dates on this site are sample content, not real or verified.</span></p>`
    : ''
}
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <a class="brand" href="${root}">${logoMark(32)}<span class="brand-name">Blox<span>Beacon</span></span></a>
      <p class="footer-tag">${site.tagline}</p>
    </div>
    <nav aria-label="Footer"><ul class="footer-links">${FOOTER.map((n) => `<li><a href="${root}${n.href}">${n.label}</a></li>`).join('')}</ul></nav>
  </div>
  <div class="wrap footer-note">
    <p>${site.name} is an independent fan resource. It is not affiliated with, sponsored by or endorsed by Roblox Corporation. Roblox is a trademark of Roblox Corporation.</p>
    <p>© ${new Date().getUTCFullYear()} ${site.name}. Artwork on this site is original.</p>
  </div>
</footer>
<div class="toast" role="status" aria-live="polite" data-toast></div>
</body>
</html>
`;
}

/** Article card used on the homepage, listing pages and related sections. */
function card({ root, href, img, alt, tag, tagCls = '', extraTag, title, desc, dateLabel, date, attrs = '', eager }) {
  return `<li class="card" ${attrs}>
  <a class="card-media" href="${root}${href}" tabindex="-1" aria-hidden="true">
    <img src="${root}${img}" alt="" width="640" height="360" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
    ${site.demoMode ? '<span class="chip-demo">Sample</span>' : ''}
  </a>
  <div class="card-body">
    <p class="card-tags"><span class="tag ${tagCls}">${esc(tag)}</span>${extraTag ? `<span class="tag tag-plain">${esc(extraTag)}</span>` : ''}</p>
    <h3 class="card-title"><a href="${root}${href}">${esc(title)}</a></h3>
    ${desc ? `<p class="card-desc">${esc(desc)}</p>` : ''}
    <p class="card-date">${dateLabel} ${time(date)}</p>
  </div>
</li>`;
}

const codeCard = (g, root, opts = {}) =>
  card({
    root,
    href: `codes/${g.slug}/`,
    img: `img/${g.slug}.svg`,
    tag: 'Codes',
    extraTag: g.genre,
    title: `${g.title} codes`,
    desc: opts.desc === false ? '' : g.summary,
    dateLabel: 'Updated',
    date: g.updated,
    eager: opts.eager,
    attrs: `data-item data-title="${esc(g.title.toLowerCase())}" data-published="${g.published}" data-updated="${g.updated}" data-cat="${esc(g.genre)}"`,
  });

const scriptCard = (s, root, opts = {}) =>
  card({
    root,
    href: `scripts/${s.slug}/`,
    img: `img/${s.slug}.svg`,
    tag: SCRIPT_TYPES[s.type].label,
    tagCls: SCRIPT_TYPES[s.type].cls,
    extraTag: s.purpose,
    title: s.title,
    desc: opts.desc === false ? '' : s.summary,
    dateLabel: 'Updated',
    date: s.updated,
    attrs: `data-item data-title="${esc((s.title + ' ' + s.topic).toLowerCase())}" data-published="${s.published}" data-updated="${s.updated}" data-cat="${s.type}"`,
  });

const breadcrumbs = (root, items) =>
  `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items
    .map((i) => (i.href !== undefined ? `<li><a href="${root}${i.href}">${esc(i.label)}</a></li>` : `<li aria-current="page">${esc(i.label)}</li>`))
    .join('')}</ol></nav>`;

const copyButton = (text, label = 'Copy') =>
  `<button class="btn btn-copy" type="button" data-copy="${esc(text)}" aria-label="${esc(label)}">${ui.copy}<span data-copy-label>Copy</span></button>`;

const callout = (kind, title, html) =>
  `<aside class="callout callout-${kind}"><p class="callout-title">${kind === 'warn' ? ui.warn : ''}${esc(title)}</p>${html}</aside>`;

/** Very small Luau highlighter that runs at build time (no client JS). */
function highlightLuau(src) {
  const re = /(--[^\n]*)|("(?:[^"\\\n]|\\.)*")|\b(local|function|end|if|then|else|elseif|for|in|do|while|return|not|and|or|nil|true|false)\b|\b(\d+(?:\.\d+)?)\b/g;
  let out = '';
  let last = 0;
  let m;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index));
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'k' : 'n';
    out += `<span class="t-${cls}">${esc(m[0])}</span>`;
    last = re.lastIndex;
  }
  return out + esc(src.slice(last));
}

module.exports = { esc, time, fmtDate, rootFor, layout, card, codeCard, scriptCard, breadcrumbs, copyButton, callout, highlightLuau, SCRIPT_TYPES };
