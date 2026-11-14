/**
 * Original, procedurally drawn SVG artwork: the BloxBeacon logo and the
 * article thumbnails. Nothing here is taken from Roblox or any other site.
 * To use real images instead, add an `image` field to an article and point
 * it at a file you have the rights to use (see README).
 */

const logoMark = (size = 36) => `
<svg class="logo-mark" width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
  <rect width="48" height="48" rx="12" fill="#1f5cff"/>
  <path d="M24 14 5 5v10zM24 14l19-9v10z" fill="#fff" opacity=".38"/>
  <rect x="19" y="10" width="10" height="8" rx="2" fill="#fff"/>
  <path d="M18.5 21h11l3 17h-17z" fill="#fff"/>
  <path d="M17.6 27h12.8l.6 3.6H17z" fill="#1f5cff"/>
  <rect x="12" y="38" width="24" height="4" rx="2" fill="#fff"/>
</svg>`;

/** Simple block-style glyphs drawn inside a 100x100 box. */
const glyphs = {
  sword: '<path d="M70 12h18v18L46 72l-18-18z"/><path d="M20 58l22 22-8 8-8-8-10 10-8-8 10-10-6-6z"/>',
  anchor: '<circle cx="50" cy="20" r="10"/><path d="M44 30h12v40c10-2 16-9 18-18l12 4c-4 18-18 30-36 30S18 74 14 56l12-4c2 9 8 16 18 18z"/>',
  paw: '<circle cx="24" cy="42" r="10"/><circle cx="42" cy="24" r="10"/><circle cx="62" cy="24" r="10"/><circle cx="78" cy="42" r="10"/><path d="M50 44c14 0 26 14 26 26 0 10-8 14-16 12-6-2-14-2-20 0-8 2-16-2-16-12 0-12 12-26 26-26z"/>',
  wheel: '<path fill-rule="evenodd" d="M50 10a40 40 0 1 1 0 80 40 40 0 0 1 0-80zm0 14a26 26 0 1 0 0 52 26 26 0 0 0 0-52z"/><circle cx="50" cy="50" r="9"/><path d="M46 24h8v18h-8zM46 58h8v18h-8zM24 46h18v8H24zM58 46h18v8H58z"/>',
  pick: '<path d="M14 34C34 12 66 12 86 34l-8 8C62 28 38 28 22 42z"/><path d="M44 30h12v60H44z"/>',
  tower: '<path d="M24 12h12v10h8V12h12v10h8V12h12v26H24z"/><path d="M30 42h40l6 46H24z"/>',
  star: '<path d="M50 8l12 28 30 3-23 20 7 30-26-16-26 16 7-30L8 39l30-3z"/>',
  cup: '<path d="M18 30h52v30c0 12-10 22-22 22h-8c-12 0-22-10-22-22z"/><path fill-rule="evenodd" d="M70 36h6c8 0 14 6 14 13s-6 13-14 13h-6zm6 8v10a5 5 0 0 0 0-10z"/><path d="M34 10h8v14h-8zM50 10h8v14h-8z"/>',
  flag: '<path d="M22 10h10v80H22z"/><path d="M36 14h46L70 34l12 20H36z"/>',
  bolt: '<path d="M58 6L20 56h24l-6 38 42-54H54z"/>',
  code: '<path d="M34 24l8 8-18 18 18 18-8 8L8 50zM66 24l-8 8 18 18-18 18 8 8 26-26z"/>',
  shield: '<path d="M50 8l36 12v26c0 22-14 38-36 46C28 84 14 68 14 46V20z"/>',
};

/** Small deterministic random generator so artwork is stable between builds. */
function seeded(text) {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

function thumbnail({ slug, icon = 'star', hue = 220 }) {
  const rnd = seeded(slug);
  const blocks = [];
  for (let i = 0; i < 9; i++) {
    const s = 28 + Math.round(rnd() * 70);
    const x = Math.round(rnd() * 640 - s / 2);
    const y = Math.round(rnd() * 360 - s / 2);
    const o = (0.06 + rnd() * 0.12).toFixed(2);
    blocks.push(`<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${Math.round(s / 5)}" fill="hsl(${hue + Math.round(rnd() * 40 - 20)} 90% 70%)" opacity="${o}"/>`);
  }
  const glyph = glyphs[icon] || glyphs.star;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 70% 14%)"/><stop offset="1" stop-color="hsl(${hue} 85% 34%)"/></linearGradient>
<linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0v40" fill="none" stroke="#fff" stroke-opacity=".05"/></pattern>
</defs>
<rect width="640" height="360" fill="url(#g)"/>
<rect width="640" height="360" fill="url(#p)"/>
${blocks.join('\n')}
<path d="M320 180 60 -40h160zM320 180 580 -40H420z" fill="url(#b)"/>
<rect x="232" y="92" width="176" height="176" rx="40" fill="hsl(${hue} 95% 56%)"/>
<rect x="232" y="92" width="176" height="176" rx="40" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3"/>
<g transform="translate(270 130)" fill="#fff">${glyph}</g>
</svg>
`;
}

const ui = {
  search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg>',
  menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path class="m1" d="M4 7h16"/><path class="m2" d="M4 12h16"/><path class="m3" d="M4 17h16"/></svg>',
  copy: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6.5A2.5 2.5 0 0 1 7.500 4H15"/></svg>',
  arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  warn: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17.200v.1"/></svg>',
};

module.exports = { logoMark, thumbnail, ui };
