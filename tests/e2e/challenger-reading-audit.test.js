/**
 * CHALLENGER AUDIT: Goodreads RSS Integration & Trail Library (/reading)
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const distReadingPath = resolve(process.cwd(), 'dist/reading/index.html');
let distCssPath = '';
const astroDir = resolve(process.cwd(), 'dist/_astro');
if (existsSync(astroDir)) {
  const baseCssFile = readdirSync(astroDir).find(f => f.startsWith('BaseLayout') && f.endsWith('.css'));
  if (baseCssFile) {
    distCssPath = resolve(astroDir, baseCssFile);
  }
}

if (!existsSync(distReadingPath)) {
  console.error('FAIL: dist/reading/index.html does not exist. Run npm run build first.');
  process.exit(1);
}

const html = readFileSync(distReadingPath, 'utf-8');

console.log('===============================================================');
console.log('  CHALLENGER SENTINEL: READING PAGE & GOODREADS RSS AUDIT');
console.log('===============================================================');

let passed = 0;
let failed = 0;

function assert(condition, testId, description) {
  if (condition) {
    console.log(`  ✓ [PASS] [${testId}] ${description}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] [${testId}] ${description}`);
    failed++;
  }
}

// SECTION 1: Tabnabbing Defense Audit
console.log('\n--- SECTION 1: Tabnabbing Defense Audit ---');
const linkRegex = /<a\s+[^>]*href=["\x27]([^"\x27]+)["\x27][^>]*>/gi;
const allLinks = [];
let match;
while ((match = linkRegex.exec(html)) !== null) {
  allLinks.push({ tag: match[0], href: match[1] });
}

const goodreadsLinks = allLinks.filter(l => l.href.includes('goodreads.com'));
assert(goodreadsLinks.length >= 20, 'SEC-01', `Goodreads links discovered in markup (found: ${goodreadsLinks.length})`);

let goodreadsTabnabbingViolations = 0;
goodreadsLinks.forEach((l) => {
  const hasTarget = /target=["\x27]_blank["\x27]/i.test(l.tag);
  const hasRel = /rel=["\x27][^"\x27]*noopener[^"\x27]*noreferrer[^"\x27]*["\x27]/i.test(l.tag) ||
                 /rel=["\x27][^"\x27]*noreferrer[^"\x27]*noopener[^"\x27]*["\x27]/i.test(l.tag);
  if (!hasTarget || !hasRel) goodreadsTabnabbingViolations++;
});
assert(goodreadsTabnabbingViolations === 0, 'SEC-02', `All ${goodreadsLinks.length} Goodreads links have target="_blank" rel="noopener noreferrer" (violations: ${goodreadsTabnabbingViolations})`);

let allExternalViolations = 0;
const externalLinks = allLinks.filter(l => l.href.startsWith('http'));
externalLinks.forEach((l) => {
  const hasTarget = /target=["\x27]_blank["\x27]/i.test(l.tag);
  const hasRel = /rel=["\x27][^"\x27]*noopener[^"\x27]*noreferrer[^"\x27]*["\x27]/i.test(l.tag) ||
                 /rel=["\x27][^"\x27]*noreferrer[^"\x27]*noopener[^"\x27]*["\x27]/i.test(l.tag);
  if (!hasTarget || !hasRel) allExternalViolations++;
});
assert(allExternalViolations === 0, 'SEC-03', `Zero tabnabbing violations across all ${externalLinks.length} external links on /reading`);

// SECTION 2: Shelf Item Filtering Audit
console.log('\n--- SECTION 2: Shelf Item Filtering Audit ---');
const currentlyReadingCards = (html.match(/class=["\x27][^"\x27]*reading-card-horizontal[^"\x27]*["\x27]/g) || []).length;
const readBookCards = (html.match(/class=["\x27][^"\x27]*read-book-card[^"\x27]*["\x27]/g) || []).length;

assert(currentlyReadingCards === 4, 'SHLF-01', `Exactly 4 currently reading books rendered (rendered: ${currentlyReadingCards})`);
assert(readBookCards === 19, 'SHLF-02', `Exactly 19 read books rendered (rendered: ${readBookCards})`);

const dnfCards = (html.match(/class=["\x27][^"\x27]*(dnf|did-not-finish)[^"\x27]*["\x27]/gi) || []).length;
const wishlistCards = (html.match(/class=["\x27][^"\x27]*(wishlist|to-read)-card[^"\x27]*["\x27]/gi) || []).length;
assert(dnfCards === 0, 'SHLF-03', `Zero Did-Not-Finish (DNF) cards rendered (found: ${dnfCards})`);
assert(wishlistCards === 0, 'SHLF-04', `Zero To-Read / Wishlist cards rendered (found: ${wishlistCards})`);

// SECTION 3: T4.1.4 Integration Scenario Assertions
console.log('\n--- SECTION 3: T4.1.4 Scenario Assertions ---');
assert(html.includes('Trail Reading Shelf'), 'T414-01', 'Page contains "Trail Reading Shelf" marker');
assert(html.includes('1984'), 'T414-02', 'Page contains Orwell "1984" entry');
assert(html.includes('Haruki Murakami'), 'T414-03', 'Page contains "Haruki Murakami" entry');
assert(html.includes('trailConnection'), 'T414-04', 'Page contains "trailConnection" field notes element');

// SECTION 4: WCAG AA Color Contrast Analysis
console.log('\n--- SECTION 4: WCAG AA Color Contrast Analysis ---');
function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}
function relativeLuminance(rgb) {
  const srgb = rgb.map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}
function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const cardBg = '#ffffff';
const titleContrast = contrastRatio('#182024', cardBg);
const authorContrast = contrastRatio('#3d4e4a', cardBg);
const dateContrast = contrastRatio('#5c6e68', cardBg);
const starsGoldContrast = contrastRatio('#d86b58', cardBg);
const hoverContrast = contrastRatio('#bc5544', cardBg);

assert(titleContrast >= 4.5, 'WCAG-01', `Book title (#182024 on #ffffff) meets WCAG AA text contrast: ${titleContrast.toFixed(2)}:1 (req >= 4.5:1)`);
assert(authorContrast >= 4.5, 'WCAG-02', `Book author (#3d4e4a on #ffffff) meets WCAG AA text contrast: ${authorContrast.toFixed(2)}:1 (req >= 4.5:1)`);
assert(dateContrast >= 4.5, 'WCAG-03', `Read date (#5c6e68 on #ffffff) meets WCAG AA text contrast: ${dateContrast.toFixed(2)}:1 (req >= 4.5:1)`);
assert(starsGoldContrast >= 3.0, 'WCAG-04', `Star ratings UI icon (#d86b58 on #ffffff) meets WCAG AA UI graphic contrast: ${starsGoldContrast.toFixed(2)}:1 (req >= 3.0:1)`);
assert(hoverContrast >= 3.0, 'WCAG-05', `CTA hover link (#bc5544 on #ffffff) meets WCAG AA UI contrast: ${hoverContrast.toFixed(2)}:1 (req >= 3.0:1)`);

const ratingAriaLabels = (html.match(/aria-label=["\x27]Rating:\s*\d+\s*out of 5 stars["\x27]/g) || []).length;
assert(ratingAriaLabels === 19, 'WCAG-06', `All 19 rated books declare accessible aria-label with star rating (found: ${ratingAriaLabels})`);

// SECTION 5: Mobile Responsiveness & 375px Viewport Containment
console.log('\n--- SECTION 5: Mobile Viewport & 375px Containment ---');
const hasViewportMeta = /<meta\s+name=["\x27]viewport["\x27]\s+content=["\x27][^"\x27]*width=device-width[^"\x27]*["\x27]/i.test(html);
assert(hasViewportMeta, 'MOB-01', 'Responsive viewport meta tag present');

const hasMobileCollapse = html.includes('grid-template-columns:1fr') || html.includes('grid-template-columns: 1fr');
assert(hasMobileCollapse, 'MOB-02', 'Books grid declares single column collapse (grid-template-columns: 1fr) for narrow mobile viewports');

// Zero fixed width elements > 375px (strictly fixed width, not max-width)
const fixedWidthRegex = /(?:^|[;"])\s*(?<!max-|min-)width:\s*(\d+)px/gi;
const inlineWidths = [...html.matchAll(fixedWidthRegex)];
const exceedingWidths = inlineWidths.filter(m => parseInt(m[1], 10) > 375);
assert(exceedingWidths.length === 0, 'MOB-03', `Zero rigid fixed inline widths exceeding 375px (violations: ${exceedingWidths.length})`);

const inlineMinWidths = [...html.matchAll(/style=["\x27][^"\x27]*min-width:\s*(\d+)px/gi)];
const exceedingMinWidths = inlineMinWidths.filter(m => parseInt(m[1], 10) > 375);
assert(exceedingMinWidths.length === 0, 'MOB-04', `Zero rigid min-width declarations exceeding 375px (violations: ${exceedingMinWidths.length})`);

let globalCss = '';
if (existsSync(distCssPath)) {
  globalCss = readFileSync(distCssPath, 'utf-8');
}
const hasOverflowXHidden = globalCss.includes('overflow-x:hidden');
assert(hasOverflowXHidden, 'MOB-05', 'Global layout enforces overflow-x: hidden on root elements to prevent mobile horizontal scroll');

const hasWordBreak = html.includes('word-break:break-word') || html.includes('word-break: break-word');
assert(hasWordBreak, 'MOB-06', 'Reading book titles declare word-break: break-word to prevent title clipping on narrow screens');

console.log('===============================================================');
console.log(`TOTAL AUDIT TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('===============================================================');

if (failed > 0) process.exit(1);
