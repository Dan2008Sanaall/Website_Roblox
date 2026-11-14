#!/usr/bin/env node
/**
 * BloxBeacon static site generator. No dependencies: run `node build.js`.
 * Reads content/*.js and writes a complete static website to ./docs
 */
const fs = require('fs');
const path = require('path');
const site = require('./content/site');
const codes = require('./content/codes');
const scripts = require('./content/scripts');
const { thumbnail, ui, logoMark } = require('./src/art');
const c = require('./src/components');
const { esc, time, layout, codeCard, scriptCard, breadcrumbs, copyButton, callout, SCRIPT_TYPES } = c;

const OUT = path.join(__dirname, 'docs');
const demo = site.demoMode;

const byDate = (key) => (a, b) => b[key].localeCompare(a[key]) || a.title.localeCompare(b.title);
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

function write(rel, html) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}
const page = (p) => write(path.join(p.path, 'index.html'), layout(p));

/* ---------- validate content ---------- */
const slugs = new Set();
for (const item of [...codes, ...scripts]) {
  if (!/^[a-z0-9-]+$/.test(item.slug)) throw new Error(`Bad slug: ${item.slug}`);
  if (slugs.has(item.slug)) throw new Error(`Duplicate slug: ${item.slug}`);
  slugs.add(item.slug);
}

/* ---------- start clean, copy assets ---------- */
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(path.join(__dirname, 'src/assets'), path.join(OUT, 'assets'), { recursive: true });
write('.nojekyll', '');
write('assets/favicon.svg', logoMark(48).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '));
for (const item of [...codes, ...scripts]) write(`img/${item.slug}.svg`, thumbnail(item));

/* ---------- shared pieces ---------- */
const sectionHead = (title, href, linkLabel, root, sub = '') => `
<div class="section-head">
  <div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>
  ${href ? `<a class="more-link" href="${root}${href}">${linkLabel} ${ui.arrow}</a>` : ''}
</div>`;

const pageHero = (root, crumbs, title, intro) => `
<section class="page-hero"><div class="wrap">
  ${breadcrumbs(root, crumbs)}
  <h1>${title}</h1>
  <p class="lead">${intro}</p>
</div></section>`;

const emptyState = (what) => `
<div class="empty" data-empty hidden>
  <h2>No ${what} match your search</h2>
  <p>Check the spelling, try a shorter name, or clear the filters to see everything.</p>
  <button class="btn btn-outline" type="button" data-reset>Clear search and filters</button>
</div>`;

/* ---------- home ---------- */
{
  const root = './';
  const latestCodes = [...codes].sort(byDate('updated')).slice(0, 6);
  const latestScripts = [...scripts].sort(byDate('updated')).slice(0, 3);
  const popular = codes.filter((g) => g.popular).sort((a, b) => a.popular - b.popular);

  page({
    path: '',
    active: 'home',
    title: site.name,
    description: site.description,
    body: `
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <p class="eyebrow">Independent Roblox guides</p>
      <h1>${site.tagline}</h1>
      <p class="lead">${site.name} collects Roblox game codes in one tidy place, with the reward for each code and clear steps to redeem it. You will also find Roblox Studio script tutorials for building your own games.</p>
      <div class="hero-cta">
        <a class="btn btn-primary btn-lg" href="${root}codes/">Browse Roblox Codes ${ui.arrow}</a>
        <a class="btn btn-ghost btn-lg" href="${root}scripts/">Browse Roblox Scripts</a>
      </div>
      <ul class="hero-stats">
        <li><strong>${codes.length}</strong> ${demo ? 'sample ' : ''}code guides</li>
        <li><strong>${scripts.length}</strong> ${demo ? 'sample ' : ''}script guides</li>
      </ul>
    </div>
    <a class="hero-feature" href="${root}codes/${latestCodes[0].slug}/">
      <img src="${root}img/${latestCodes[0].slug}.svg" alt="" width="640" height="360" fetchpriority="high">
      <span class="hero-feature-body">
        <span class="tag">Latest code guide</span>
        <span class="hero-feature-title">${esc(latestCodes[0].title)} codes</span>
        <span class="hero-feature-meta">${plural(latestCodes[0].active.length, 'active code')} · Updated ${time(latestCodes[0].updated)}</span>
      </span>
    </a>
  </div>
</section>

<section class="section"><div class="wrap">
  ${sectionHead('Latest Roblox Codes', 'codes/', 'All code guides', root, 'Recently updated code guides, newest first.')}
  <ul class="cards cards-3">${latestCodes.map((g) => codeCard(g, root)).join('')}</ul>
</div></section>

<section class="section section-tint"><div class="wrap">
  ${sectionHead('Popular Roblox Games', 'codes/', 'Browse all games', root, demo ? 'Placeholder games used to preview this section.' : 'Jump straight to codes for the games players look up most.')}
  <ul class="game-tiles">${popular
    .map(
      (g) => `<li><a class="game-tile" href="${root}codes/${g.slug}/">
        <img src="${root}img/${g.slug}.svg" alt="" width="640" height="360" loading="lazy" decoding="async">
        <span><strong>${esc(g.title)}</strong><small>${esc(g.genre)} · ${plural(g.active.length, 'active code')}</small></span>
      </a></li>`
    )
    .join('')}</ul>
</div></section>

<section class="section"><div class="wrap">
  ${sectionHead('Latest Roblox Scripts', 'scripts/', 'All script guides', root, 'Tutorials and explainers, each labelled by where the script runs.')}
  <ul class="cards cards-3">${latestScripts.map((s) => scriptCard(s, root)).join('')}</ul>
</div></section>

<section class="section section-about"><div class="wrap about-grid">
  <div>
    <h2>What is ${site.name}?</h2>
    <p>${site.name} is a fan-made guide site for Roblox players and creators. Its main job is simple: list the codes for each game, say what every code gives you, and show how to redeem it.</p>
    <p>The scripts section is kept separate. It focuses on Luau tutorials for Roblox Studio, and clearly labels anything that involves third-party tools so you can see the risks before you read on.</p>
    <p><a class="more-link" href="${root}about/">More about us ${ui.arrow}</a></p>
  </div>
  <ul class="promise">
    <li><strong>Clear labels</strong>Active and expired codes are listed separately, with the date they were last checked.</li>
    <li><strong>No account details, ever</strong>We will never ask for your Roblox password or login.</li>
    <li><strong>Honest about risk</strong>We do not call a script safe unless that has been verified.</li>
  </ul>
</div></section>`,
  });
}

/* ---------- codes listing ---------- */
{
  const p = 'codes/';
  const root = c.rootFor(p);
  const list = [...codes].sort(byDate('published'));
  page({
    path: p,
    active: 'codes',
    title: 'Roblox Codes – game code guides',
    description: 'Browse Roblox code guides by game. Each guide lists active and expired codes, their rewards and how to redeem them.',
    body: `
${pageHero(root, [{ label: 'Home', href: '' }, { label: 'Roblox Codes' }], 'Roblox Codes', 'Pick a game to see its active codes, what each one rewards, and how to redeem them. Use search or sorting to find a guide quickly.')}
<section class="section"><div class="wrap" data-listing data-page-size="6">
  <div class="toolbar">
    <div class="field">
      <label for="codes-q">Search games</label>
      <div class="input-icon">${ui.search}<input id="codes-q" type="search" placeholder="e.g. Blade Harbor" autocomplete="off" data-filter-search></div>
    </div>
    <div class="field">
      <span class="field-label" id="sort-label">Sort by</span>
      <div class="segmented" role="group" aria-labelledby="sort-label">
        <button type="button" data-sort="published" aria-pressed="true">Latest</button>
        <button type="button" data-sort="updated" aria-pressed="false">Recently updated</button>
        <button type="button" data-sort="title" aria-pressed="false">A–Z</button>
      </div>
    </div>
  </div>
  <p class="result-count" role="status" aria-live="polite" data-count></p>
  <ul class="cards cards-3" data-items>${list.map((g, i) => codeCard(g, root, { eager: i === 0 })).join('')}</ul>
  ${emptyState('games')}
  <div class="load-more"><button class="btn btn-outline btn-lg" type="button" data-more hidden>Load more</button></div>
</div></section>`,
  });
}

/* ---------- code guide pages ---------- */
const related = (list, item, key, n = 3) => {
  const others = list.filter((x) => x !== item);
  const same = others.filter((x) => x[key] === item[key]);
  const rest = others.filter((x) => x[key] !== item[key]);
  return [...same, ...rest].slice(0, n);
};

for (const g of codes) {
  const p = `codes/${g.slug}/`;
  const root = c.rootFor(p);
  const codeRow = (x, active) => `<li class="code-row${active ? '' : ' is-expired'}">
    <div class="code-main"><code class="code-pill">${esc(x.code)}</code><span class="code-reward">${esc(x.reward)}</span></div>
    ${active ? copyButton(x.code, `Copy code ${x.code}`) : '<span class="tag tag-plain">Expired</span>'}
  </li>`;

  page({
    path: p,
    active: 'codes',
    image: true,
    title: `${g.title} codes – active codes, rewards and how to redeem`,
    description: g.summary,
    body: `
<article class="article">
  <header class="page-hero"><div class="wrap narrow">
    ${breadcrumbs(root, [{ label: 'Home', href: '' }, { label: 'Roblox Codes', href: 'codes/' }, { label: g.title }])}
    <p class="card-tags"><span class="tag">Codes</span><span class="tag tag-plain">${esc(g.genre)}</span></p>
    <h1>${esc(g.title)} codes</h1>
    <p class="lead">${esc(g.intro)}</p>
    <dl class="meta">
      <div><dt>Codes last checked</dt><dd>${time(g.checked)}</dd></div>
      <div><dt>Article updated</dt><dd>${time(g.updated)}</dd></div>
      <div><dt>Active codes</dt><dd>${g.active.length}</dd></div>
    </dl>
  </div></header>
  <div class="wrap narrow prose">
    <img class="feature-img" src="${root}img/${g.slug}.svg" alt="${demo ? 'Placeholder' : 'Featured'} artwork for the ${esc(g.title)} code guide" width="640" height="360" fetchpriority="high">
    ${demo ? callout('info', 'Sample guide', `<p>${esc(g.title)} is a placeholder game. The codes, rewards and dates below are examples that show how this page works. They will not redeem anywhere.</p>`) : ''}

    <section aria-labelledby="active-h">
      <h2 id="active-h">Active ${esc(g.title)} codes <span class="count">${g.active.length}</span></h2>
      ${
        g.active.length
          ? `<ul class="code-list">${g.active.map((x) => codeRow(x, true)).join('')}</ul>`
          : `<p class="none">There are no active codes listed right now. See below for where new codes are announced.</p>`
      }
    </section>

    <section aria-labelledby="expired-h">
      <h2 id="expired-h">Expired codes <span class="count">${g.expired.length}</span></h2>
      ${
        g.expired.length
          ? `<p>These codes no longer work. They are kept here so you do not waste time trying them.</p><ul class="code-list">${g.expired.map((x) => codeRow(x, false)).join('')}</ul>`
          : `<p class="none">No expired codes have been recorded for this game yet.</p>`
      }
    </section>

    <section aria-labelledby="redeem-h">
      <h2 id="redeem-h">How to redeem ${esc(g.title)} codes</h2>
      <ol class="steps">${g.redeem.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
      <p>Codes are often case-sensitive, so copying and pasting is the safest way to enter them. If a code does not work, it may have expired or may need a newer server.</p>
    </section>

    <section aria-labelledby="sources-h">
      <h2 id="sources-h">Where to find new codes</h2>
      <p>Developers decide when to release codes. These are the usual places to check:</p>
      <ul>${g.sources.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      <p>A real code is only ever entered inside the game. Ignore any site or message that asks for your Roblox password in exchange for codes or Robux.</p>
    </section>
  </div>
</article>
<section class="section section-tint"><div class="wrap">
  ${sectionHead('Related game guides', 'codes/', 'All code guides', root)}
  <ul class="cards cards-3">${related(codes, g, 'genre').map((x) => codeCard(x, root, { desc: false })).join('')}</ul>
</div></section>`,
  });
}

/* ---------- scripts listing ---------- */
{
  const p = 'scripts/';
  const root = c.rootFor(p);
  const list = [...scripts].sort(byDate('updated'));
  page({
    path: p,
    active: 'scripts',
    title: 'Roblox Scripts – Studio tutorials and explainers',
    description: 'Roblox script guides, labelled by whether they are for Roblox Studio development or involve third-party tools, with requirements and safety notes.',
    body: `
${pageHero(root, [{ label: 'Home', href: '' }, { label: 'Roblox Scripts' }], 'Roblox Scripts', 'Luau tutorials and explainers. Every guide is labelled so you know whether a script is meant for building your own game in Roblox Studio or depends on a third-party tool.')}
<section class="section"><div class="wrap" data-listing data-page-size="6">
  <div class="legend">
    <p><span class="tag tag-studio">Roblox Studio</span> Runs in Roblox’s official, free development tool, in games you create.</p>
    <p><span class="tag tag-third">Third-party tool</span> Relies on software not made by Roblox. These carry account and security risks, which each article explains.</p>
  </div>
  <div class="toolbar">
    <div class="field">
      <label for="scripts-q">Search scripts</label>
      <div class="input-icon">${ui.search}<input id="scripts-q" type="search" placeholder="e.g. leaderboard" autocomplete="off" data-filter-search></div>
    </div>
    <div class="field">
      <span class="field-label" id="cat-label">Category</span>
      <div class="segmented" role="group" aria-labelledby="cat-label">
        <button type="button" data-cat="all" aria-pressed="true">All</button>
        <button type="button" data-cat="studio" aria-pressed="false">Roblox Studio</button>
        <button type="button" data-cat="third-party" aria-pressed="false">Third-party tool</button>
      </div>
    </div>
  </div>
  <p class="result-count" role="status" aria-live="polite" data-count></p>
  <ul class="cards cards-3" data-items>${list.map((s) => scriptCard(s, root)).join('')}</ul>
  ${emptyState('script guides')}
  <div class="load-more"><button class="btn btn-outline btn-lg" type="button" data-more hidden>Load more</button></div>
</div></section>`,
  });
}

/* ---------- script guide pages ---------- */
for (const s of scripts) {
  const p = `scripts/${s.slug}/`;
  const root = c.rootFor(p);
  const type = SCRIPT_TYPES[s.type];
  const third = s.type === 'third-party';

  page({
    path: p,
    active: 'scripts',
    image: true,
    title: s.title,
    description: s.summary,
    body: `
<article class="article">
  <header class="page-hero"><div class="wrap narrow">
    ${breadcrumbs(root, [{ label: 'Home', href: '' }, { label: 'Roblox Scripts', href: 'scripts/' }, { label: s.title }])}
    <p class="card-tags"><span class="tag ${type.cls}">${type.label}</span><span class="tag tag-plain">${esc(s.purpose)}</span></p>
    <h1>${esc(s.title)}</h1>
    <p class="lead">${esc(s.summary)}</p>
    <dl class="meta">
      <div><dt>Topic</dt><dd>${esc(s.topic)}</dd></div>
      <div><dt>Runs in</dt><dd>${type.long}</dd></div>
      <div><dt>Last updated</dt><dd>${time(s.updated)}</dd></div>
    </dl>
  </div></header>
  <div class="wrap narrow prose">
    <img class="feature-img" src="${root}img/${s.slug}.svg" alt="Illustration for the guide: ${esc(s.title)}" width="640" height="360" fetchpriority="high">
    ${
      third
        ? callout('warn', 'Third-party tools carry real risks', '<p>This article is about scripts that need software not made by Roblox. Using them breaks Roblox’s Terms of Use and can get an account banned. We have not verified any such tool or script as safe.</p>')
        : demo
        ? callout('info', 'Sample article', '<p>This is a sample tutorial included to preview the site. The script is a teaching example for Roblox Studio. Test it in your own place before relying on it.</p>')
        : ''
    }

    <section aria-labelledby="what-h">
      <h2 id="what-h">${third ? 'What these scripts are' : 'What this script does'}</h2>
      ${s.what.map((t) => `<p>${esc(t)}</p>`).join('')}
    </section>

    <section aria-labelledby="req-h">
      <h2 id="req-h">${third ? 'What they depend on' : 'Requirements'}</h2>
      <ul>${s.requirements.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    </section>

    ${
      s.code
        ? `<section aria-labelledby="code-h">
      <h2 id="code-h">The script</h2>
      <figure class="codeblock">
        <figcaption><span>${esc(s.codeLabel || 'Luau')}</span>${copyButton(s.code, 'Copy script')}</figcaption>
        <pre tabindex="0" aria-label="Luau source code"><code>${c.highlightLuau(s.code)}</code></pre>
      </figure>
    </section>`
        : ''
    }

    <section aria-labelledby="steps-h">
      <h2 id="steps-h">${third ? 'How to stay safe' : 'How to use it'}</h2>
      <ol class="steps">${s.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
    </section>

    ${callout('warn', third ? 'Risks to know about' : 'Before you use this', `<ul>${s.warnings.map((t) => `<li>${esc(t)}</li>`).join('')}<li>${site.name} will never ask for your Roblox password or account details.</li></ul>`)}
  </div>
</article>
<section class="section section-tint"><div class="wrap">
  ${sectionHead('Related tutorials', 'scripts/', 'All script guides', root)}
  <ul class="cards cards-3">${related(scripts, s, 'type').map((x) => scriptCard(x, root, { desc: false })).join('')}</ul>
</div></section>`,
  });
}

/* ---------- search ---------- */
write(
  'assets/search-index.json',
  JSON.stringify([
    ...codes.map((g) => ({ kind: 'Code', title: `${g.title} codes`, name: g.title, tag: g.genre, desc: g.summary, url: `codes/${g.slug}/`, img: `img/${g.slug}.svg`, date: g.updated })),
    ...scripts.map((s) => ({ kind: 'Script', title: s.title, name: s.topic, tag: SCRIPT_TYPES[s.type].label, desc: s.summary, url: `scripts/${s.slug}/`, img: `img/${s.slug}.svg`, date: s.updated })),
  ])
);
{
  const p = 'search/';
  const root = c.rootFor(p);
  page({
    path: p,
    title: 'Search',
    description: `Search ${site.name} for Roblox code guides and script guides.`,
    body: `
${pageHero(root, [{ label: 'Home', href: '' }, { label: 'Search' }], 'Search', 'Search article titles and game names across both Roblox Codes and Roblox Scripts.')}
<section class="section"><div class="wrap narrow" data-search-page>
  <form class="search-form search-form-page" action="./" method="get" role="search">
    <label class="sr-only" for="page-q">Search</label>
    <input id="page-q" name="q" type="search" placeholder="Search games, codes and scripts…" autocomplete="off">
    <button class="btn btn-primary" type="submit">Search</button>
  </form>
  <p class="result-count" role="status" aria-live="polite" data-search-count></p>
  <ul class="results" data-search-results></ul>
  <div class="empty" data-search-empty hidden>
    <h2>No results found</h2>
    <p>Nothing matched <strong data-search-term></strong>. Try a game name, a shorter keyword, or browse a section instead.</p>
    <p class="empty-actions"><a class="btn btn-primary" href="${root}codes/">Browse Roblox Codes</a> <a class="btn btn-outline" href="${root}scripts/">Browse Roblox Scripts</a></p>
  </div>
  <noscript><p>Search needs JavaScript. You can still browse <a href="${root}codes/">Roblox Codes</a> and <a href="${root}scripts/">Roblox Scripts</a>.</p></noscript>
</div></section>`,
  });
}

/* ---------- simple text pages ---------- */
const textPage = (p, title, description, html) => {
  const root = c.rootFor(p);
  page({
    path: p,
    title,
    description,
    body: `${pageHero(root, [{ label: 'Home', href: '' }, { label: title }], title, description)}
<section class="section"><div class="wrap narrow prose">${html(root)}</div></section>`,
  });
};

textPage('about/', 'About Us', `What ${site.name} is, who it is for and how its guides are put together.`, (root) => `
<h2>Our purpose</h2>
<p>${site.name} is an independent fan resource for Roblox players and creators. The main focus is <a href="${root}codes/">Roblox Codes</a>: one page per game, listing active and expired codes, the reward for each, and how to redeem them.</p>
<p>The <a href="${root}scripts/">Roblox Scripts</a> section is separate. It concentrates on Luau tutorials for Roblox Studio, and labels anything involving third-party tools along with the risks.</p>
<h2>How guides are meant to work</h2>
<ul>
  <li>Each code guide shows when its codes were last checked.</li>
  <li>Codes that stop working are moved to the expired list rather than deleted.</li>
  <li>Script guides state their requirements and include safety notes. We do not describe a script as safe unless that has been verified.</li>
</ul>
${demo ? callout('info', 'This is a preview build', '<p>The site currently contains sample content only. The games are placeholders and the codes, rewards and dates are not real. There is no live data feed, database or admin dashboard connected yet.</p>') : ''}
<h2>Independence</h2>
<p>${site.name} is not affiliated with, sponsored by or endorsed by Roblox Corporation.</p>`);

textPage('contact/', 'Contact Us', 'How to send a correction, report an expired code or get in touch.', () => `
<h2>Get in touch</h2>
<p>Spotted an expired code or a mistake in a guide? Email us and include the page address so we can find it.</p>
<p><a class="btn btn-primary" href="mailto:${site.contactEmail}">Email ${site.contactEmail}</a></p>
${demo ? callout('info', 'Placeholder address', '<p>This email address is a placeholder for the preview build and does not receive mail. There is no contact form because no backend has been set up to deliver messages.</p>') : ''}
<h2>Keep your account safe</h2>
<p>Never send us your Roblox password, login codes or cookies. We will never ask for them.</p>`);

textPage('privacy/', 'Privacy Policy', `How ${site.name} handles visitor information.`, () => `
${demo ? callout('info', 'Starter text', '<p>This policy describes the site as it is currently built. Review it, and have it checked against the laws that apply to you, before launching or adding analytics, adverts or forms.</p>') : ''}
<h2>What this site collects</h2>
<p>As built, ${site.name} is a static website. It has no accounts, no contact form, no analytics scripts, no advertising scripts and sets no cookies.</p>
<h2>Search and copy buttons</h2>
<p>Search runs entirely in your browser using a small index file. What you type is not sent to us. Copy buttons place text on your clipboard and do nothing else.</p>
<h2>Hosting</h2>
<p>Whichever company hosts the site may keep standard server logs, such as IP address and requested page, under its own privacy policy.</p>
<h2>Children</h2>
<p>We do not knowingly collect personal information from anyone, including children.</p>
<h2>Changes</h2>
<p>If the site starts collecting any data, this page will be updated to explain what and why.</p>`);

textPage('disclaimer/', 'Disclaimer', `Important information about how to use the content on ${site.name}.`, () => `
<h2>Not affiliated with Roblox</h2>
<p>${site.name} is an independent fan resource. It is not affiliated with, sponsored by or endorsed by Roblox Corporation. Roblox and related names are trademarks of their owners. Game names belong to their developers.</p>
<h2>Codes</h2>
<p>Codes are created and controlled by each game’s developer, who can change or expire them at any time. A code listed as active may stop working without notice.</p>
${demo ? '<p><strong>All codes, rewards, games and dates currently on this site are sample content and are not real.</strong></p>' : ''}
<h2>Scripts</h2>
<p>Script tutorials are provided for learning and are used at your own risk. Test them in your own place first. We do not claim any script is safe, undetectable or guaranteed to work.</p>
<p>${site.name} does not publish or link to exploit tools. Running third-party scripts in games you do not own breaks Roblox’s Terms of Use and can lead to account bans and security problems.</p>
<h2>Your account</h2>
<p>We never ask for Roblox passwords or account details. Treat any request for them as a scam.</p>`);

/* ---------- 404 + sitemap ---------- */
write(
  '404.html',
  layout({
    path: '',
    title: 'Page not found',
    description: 'That page could not be found.',
    body: `<section class="section"><div class="wrap narrow"><div class="empty">
  <h1>Page not found</h1><p>The page may have moved or the address may be mistyped.</p>
  <p class="empty-actions"><a class="btn btn-primary" href="./codes/">Browse Roblox Codes</a> <a class="btn btn-outline" href="./">Go home</a></p>
</div></div></section>`,
  }).replace(/<title>.*?<\/title>/, `<title>Page not found | ${site.name}</title>`)
);

const urls = ['', 'codes/', ...codes.map((g) => `codes/${g.slug}/`), 'scripts/', ...scripts.map((s) => `scripts/${s.slug}/`), 'about/', 'contact/', 'privacy/', 'disclaimer/'];
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${site.url.replace(/\/$/, '')}/${u}</loc></url>`)
    .join('\n')}\n</urlset>\n`
);

console.log(`Built ${urls.length + 2} pages (${codes.length} code guides, ${scripts.length} script guides) -> docs/`);
