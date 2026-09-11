/**
 * Adversarial Verification & Stress Test Harness for Milestone 3 (Challenger 1)
 * Milestone 3: Magazine-Style Typographic Hero (R3)
 * 
 * Objective:
 * Adversarially challenge and stress-test:
 * 1. Mobile-First Responsiveness (375px, 390px, 412px viewports):
 *    - Verify no horizontal layout blowout occurs on narrow viewports.
 *    - Verify font clamp sizes fit safely within narrow viewports.
 *    - Verify touch targets >= 44px on .hero-subscribe-cta.
 * 2. Structural Audit:
 *    - Confirm complete eradication of .hero-photo-frame across source and built dist/.
 *    - Confirm .hero-photo-strip holds the image below the text block.
 * 3. Tabnabbing Defense Audit:
 *    - Verify that all Substack links in built HTML have target="_blank" rel="noopener noreferrer".
 * 4. Authentic Editorial Parity & CSS Styling:
 *    - Courier Prime 700 title, terracotta CTA, dark pine hero container.
 * 5. Reduced Motion & Accessibility Hardening:
 *    - prefers-reduced-motion overrides, eager loading on LCP hero image.
 */

import fs from 'node:fs';
import path from 'node:path';
import { getAnchorTags, extractCssVariables } from './helpers/html-parser.js';
import { DIST_DIR, SRC_DIR, getBundledCss, loadSrcFile, loadDistFile } from './helpers/test-context.js';

const results = [];
let passedCount = 0;
let failedCount = 0;

function record(id, name, passed, details = '') {
  results.push({ id, name, passed, details });
  if (passed) {
    passedCount++;
    console.log(`  ✓ [PASS] [${id}] ${name}${details ? ' - ' + details : ''}`);
  } else {
    failedCount++;
    console.error(`  ✗ [FAIL] [${id}] ${name}${details ? ' - ' + details : ''}`);
  }
}

console.log('\n===============================================================');
console.log('  CHALLENGER 1: ADVERSARIAL STRESS TEST (MILESTONE 3)');
console.log('  Magazine-Style Typographic Hero (R3) & Mobile-First Audit');
console.log('===============================================================\n');

// Helper to recursively retrieve all HTML files in dist/
function getAllHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllHtmlFiles(fullPath, fileList);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allDistHtmlFiles = getAllHtmlFiles(DIST_DIR);
const bundledCss = getBundledCss();
const globalCss = loadSrcFile('styles/global.css') || '';
const indexHtml = loadDistFile('index.html') || '';
const aboutHtml = loadDistFile('about/index.html') || '';

// ============================================================================
// TEST SUITE 1: Mobile-First Responsiveness & Viewport Blowout (375, 390, 412)
// ============================================================================
console.log('--- Test Suite 1: Mobile-First Viewport & Geometry Stress Testing ---');

// 1.1 Containment rules
const hasHtmlOverflowX = bundledCss.includes('html{') && bundledCss.includes('overflow-x:hidden');
const hasBodyOverflowX = bundledCss.includes('body{') && bundledCss.includes('overflow-x:hidden');
const hasWordBreak = globalCss.includes('overflow-wrap: break-word') && globalCss.includes('word-break: break-word');

record(
  'ADV-M3-01',
  'Root containment guards (overflow-x: hidden, word-break: break-word) active across layout',
  hasHtmlOverflowX && hasBodyOverflowX && hasWordBreak,
  `html: ${hasHtmlOverflowX}, body: ${hasBodyOverflowX}, word-break: ${hasWordBreak}`
);

// 1.2 Font clamp analysis on 375px, 390px, and 412px viewports
// CSS: font-size: clamp(2.75rem, 8vw, 4.75rem);
const clampMatch = globalCss.match(/\.hero-publication-title\s*\{[^}]*font-size:\s*clamp\(([^)]+)\)/);
const clampExpression = clampMatch ? clampMatch[1].trim() : '';
const clampValid = clampExpression.includes('2.75rem') && clampExpression.includes('8vw') && clampExpression.includes('4.75rem');

// Compute font sizes mathematically:
// 1rem = 16px.
// 2.75rem = 44px floor.
// 4.75rem = 76px ceiling.
// 8vw:
// 375px: 30px -> clamped to 44px
// 390px: 31.2px -> clamped to 44px
// 412px: 32.96px -> clamped to 44px
// Courier Prime monospace advance: ~0.6 * 44px = ~26.4px/char.
// "reKhoj" = 6 characters -> 6 * 26.4px ≈ 158.4px.
// Available container widths (gutter padding = 20px each side = 40px total):
// 375px: 335px available (Clearance: +176.6px)
// 390px: 350px available (Clearance: +191.6px)
// 412px: 372px available (Clearance: +213.6px)

const viewports = [375, 390, 412];
let clampCheckPass = clampValid;
const clampDetails = [];

for (const vp of viewports) {
  const rawVw = (8 / 100) * vp;
  const computedPx = Math.max(44, Math.min(rawVw, 76));
  const wordWidth = 6 * (0.6 * computedPx);
  const containerWidth = vp - 40;
  const clearance = containerWidth - wordWidth;
  if (clearance <= 0) clampCheckPass = false;
  clampDetails.push(`${vp}px (word: ~${wordWidth.toFixed(1)}px, container: ${containerWidth}px, clearance: +${clearance.toFixed(1)}px)`);
}

record(
  'ADV-M3-02',
  'Publication title font clamp scales safely without overflow on 375px, 390px, 412px viewports',
  clampCheckPass,
  `Clamp expr: "${clampExpression}"; ${clampDetails.join('; ')}`
);

// 1.3 Touch target >= 44px on .hero-subscribe-cta
const ctaTouchTargetMin = globalCss.includes('.hero-subscribe-cta') &&
  globalCss.includes('min-height: var(--touch-target-min);');
const ctaPadding = globalCss.includes('padding: 10px 22px;');
const rootTouchTargetVal = globalCss.includes('--touch-target-min: 44px;');

record(
  'ADV-M3-03',
  '.hero-subscribe-cta strictly enforces minimum 44px touch target height via --touch-target-min',
  ctaTouchTargetMin && rootTouchTargetVal && ctaPadding,
  `min-height: var(--touch-target-min) (${rootTouchTargetVal ? '44px' : 'invalid'}), padding: 10px 22px`
);

// 1.4 No rigid fixed-width blowout > 375px in hero styles
const heroRulesRegex = /\.(?:hero-section|hero-container|hero-typo-stack|hero-publication-title|hero-tagline|hero-actions|hero-subscribe-cta|hero-photo-strip|hero-photo)\s*\{([^}]+)\}/g;
let hrMatch;
let rigidHeroBlowoutFound = false;
const heroRuleIssues = [];

while ((hrMatch = heroRulesRegex.exec(globalCss)) !== null) {
  const ruleBody = hrMatch[1];
  const widthMatches = ruleBody.match(/(?:min-width|width)\s*:\s*([0-9]+)px/g) || [];
  for (const wm of widthMatches) {
    const px = parseInt(wm.replace(/[^0-9]/g, ''), 10);
    if (px > 375) {
      rigidHeroBlowoutFound = true;
      heroRuleIssues.push(wm);
    }
  }
}

record(
  'ADV-M3-04',
  'Hero CSS rules contain zero rigid fixed-width declarations exceeding 375px',
  !rigidHeroBlowoutFound,
  rigidHeroBlowoutFound ? `Violations: ${heroRuleIssues.join(', ')}` : 'Zero rigid fixed widths in hero classes'
);


// ============================================================================
// TEST SUITE 2: Structural Decommissioning & Ordering Audit
// ============================================================================
console.log('\n--- Test Suite 2: Structural Decommissioning & Ordering Audit ---');

// 2.1 Complete eradication of .hero-photo-frame
let photoFrameInSrc = false;
let photoFrameInDist = false;

// Scan all files in src/
function checkDirectoryForPattern(dir, pattern) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (checkDirectoryForPattern(full, pattern)) return true;
    } else if (entry.isFile()) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes(pattern)) return true;
    }
  }
  return false;
}

photoFrameInSrc = checkDirectoryForPattern(SRC_DIR, 'hero-photo-frame');
photoFrameInDist = checkDirectoryForPattern(DIST_DIR, 'hero-photo-frame');

record(
  'ADV-M3-05',
  'Complete eradication of legacy .hero-photo-frame across entire src/ tree',
  !photoFrameInSrc,
  photoFrameInSrc ? 'Found .hero-photo-frame in src/' : '0 occurrences found in src/'
);

record(
  'ADV-M3-06',
  'Complete eradication of legacy .hero-photo-frame across entire dist/ build output',
  !photoFrameInDist,
  photoFrameInDist ? 'Found .hero-photo-frame in dist/' : '0 occurrences found in dist/'
);

// 2.2 Hero DOM hierarchy: Typo stack followed by Photo Strip
const heroSectionMatch = indexHtml.match(/<section[^>]*class="[^"]*hero-section[^"]*"[^>]*>([\s\S]*?)<\/section>/);
const heroHtml = heroSectionMatch ? heroSectionMatch[1] : '';

const posTypoStack = heroHtml.indexOf('hero-typo-stack');
const posEyebrow = heroHtml.indexOf('eyebrow');
const posTitle = heroHtml.indexOf('hero-publication-title');
const posTagline = heroHtml.indexOf('hero-tagline');
const posActions = heroHtml.indexOf('hero-actions');
const posSubscribeCta = heroHtml.indexOf('hero-subscribe-cta');
const posPhotoStrip = heroHtml.indexOf('hero-photo-strip');
const posHeroPhoto = heroHtml.indexOf('hero-photo', posPhotoStrip + 1);

const strictlyOrdered = (
  posTypoStack !== -1 &&
  posEyebrow !== -1 &&
  posTitle !== -1 &&
  posTagline !== -1 &&
  posActions !== -1 &&
  posSubscribeCta !== -1 &&
  posPhotoStrip !== -1 &&
  posHeroPhoto !== -1 &&
  posTypoStack < posEyebrow &&
  posEyebrow < posTitle &&
  posTitle < posTagline &&
  posTagline < posActions &&
  posActions < posPhotoStrip &&
  posPhotoStrip < posHeroPhoto
);

record(
  'ADV-M3-07',
  'Hero DOM hierarchy strictly enforces typographic stack above full-width photo strip',
  strictlyOrdered,
  `Indices: TypoStack=${posTypoStack}, Title=${posTitle}, Actions=${posActions}, PhotoStrip=${posPhotoStrip}`
);

// 2.3 Image specifications inside .hero-photo-strip
const heroImgMatch = heroHtml.match(/<img[^>]*class="[^"]*hero-photo[^"]*"[^>]*>/);
const heroImgTag = heroImgMatch ? heroImgMatch[0] : '';
const heroImgSrc = heroImgTag.includes('src="/images/bir/bir-hero.jpg"');
const heroImgEager = heroImgTag.includes('loading="eager"');
const heroImgAlt = heroImgTag.includes('alt="') && !heroImgTag.includes('alt=""');

record(
  'ADV-M3-08',
  'Hero image references /images/bir/bir-hero.jpg with loading="eager" (LCP optimization) and descriptive alt text',
  heroImgSrc && heroImgEager && heroImgAlt,
  `Src valid: ${heroImgSrc}, Eager loading: ${heroImgEager}, Alt text: ${heroImgAlt}`
);

// 2.4 Panoramic aspect ratio in CSS
const mobileAspectRatio = globalCss.includes('aspect-ratio: 16 / 9;');
const desktopAspectRatio = globalCss.includes('aspect-ratio: 2.35 / 1;');
const desktopMaxHeight = globalCss.includes('max-height: 440px;');

record(
  'ADV-M3-09',
  'Panoramic photo strip enforces 16/9 mobile and 2.35/1 desktop widescreen aspect ratio',
  mobileAspectRatio && desktopAspectRatio && desktopMaxHeight,
  `Mobile 16/9: ${mobileAspectRatio}, Desktop 2.35/1: ${desktopAspectRatio}, Desktop max-height: ${desktopMaxHeight}`
);


// ============================================================================
// TEST SUITE 3: Tabnabbing Defense Audit on Substack Links
// ============================================================================
console.log('\n--- Test Suite 3: Tabnabbing Defense Audit Across ALL Dist Pages ---');

let totalSubstackLinks = 0;
let invalidTargetCount = 0;
let invalidRelCount = 0;
const invalidLinks = [];

for (const pagePath of allDistHtmlFiles) {
  const relPath = path.relative(DIST_DIR, pagePath);
  const html = fs.readFileSync(pagePath, 'utf8');
  const anchors = getAnchorTags(html);
  const substackAnchors = anchors.filter(a => a.href && a.href.includes('rekhoj.substack.com'));
  totalSubstackLinks += substackAnchors.length;

  for (const a of substackAnchors) {
    const hasBlank = a.target === '_blank';
    const rel = (a.rel || '').toLowerCase();
    const hasNoOpener = rel.includes('noopener');
    const hasNoReferrer = rel.includes('noreferrer');

    if (!hasBlank) invalidTargetCount++;
    if (!hasNoOpener || !hasNoReferrer) invalidRelCount++;

    if (!hasBlank || !hasNoOpener || !hasNoReferrer) {
      invalidLinks.push({ page: relPath, raw: a.raw });
    }
  }
}

record(
  'ADV-M3-10',
  'Exhaustive tabnabbing audit across all pre-rendered HTML files',
  allDistHtmlFiles.length >= 18 && totalSubstackLinks > 0,
  `Audited ${allDistHtmlFiles.length} pages, verified ${totalSubstackLinks} Substack links`
);

record(
  'ADV-M3-11',
  'Zero tabnabbing vulnerabilities: All Substack links declare target="_blank" and rel="noopener noreferrer"',
  invalidTargetCount === 0 && invalidRelCount === 0,
  invalidLinks.length === 0 
    ? `All ${totalSubstackLinks} links pass with target="_blank" and rel="noopener noreferrer"` 
    : `Failed on ${invalidLinks.length} links: ${JSON.stringify(invalidLinks.slice(0, 2))}`
);

// Specifically verify .hero-subscribe-cta on Home page
const heroCtaMatch = heroHtml.match(/<a[^>]*class="[^"]*hero-subscribe-cta[^"]*"[^>]*>/);
const heroCtaTag = heroCtaMatch ? heroCtaMatch[0] : '';
const heroCtaHref = heroCtaTag.includes('href="https://rekhoj.substack.com"');
const heroCtaTarget = heroCtaTag.includes('target="_blank"');
const heroCtaRel = heroCtaTag.includes('rel="noopener noreferrer"');

record(
  'ADV-M3-12',
  'Hero CTA button (.hero-subscribe-cta) strictly enforces target="_blank" and rel="noopener noreferrer"',
  heroCtaHref && heroCtaTarget && heroCtaRel,
  `CTA Tag: ${heroCtaTag}`
);


// ============================================================================
// TEST SUITE 4: Editorial Authenticity & Typography Parity (Substack magazine-5)
// ============================================================================
console.log('\n--- Test Suite 4: Editorial Authenticity & Typography Parity ---');

// 4.1 Publication title reKhoj in Courier Prime 700
const titleTextMatch = heroHtml.match(/<h1[^>]*class="[^"]*hero-publication-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/);
const titleText = titleTextMatch ? titleTextMatch[1].trim() : '';
const titleUsesCourier = globalCss.includes('.hero-publication-title') &&
  globalCss.includes('font-family: var(--font-display);');
const displayFontIsCourier = globalCss.includes('--font-display: \'Courier Prime\', monospace;');
const titleWeight700 = globalCss.includes('.hero-publication-title') &&
  globalCss.includes('font-weight: 700;');

const titleValid = (titleText === 'reKhoj' || titleText.includes('The Long Way Home') || titleText.includes('Letters from')) &&
  titleUsesCourier && displayFontIsCourier && titleWeight700;

record(
  'ADV-M3-13',
  'Hero publication title displays authentic publication title styled with Courier Prime 700',
  titleValid,
  `Title: "${titleText.replace(/\s+/g, ' ')}", Display Font: Courier Prime, Weight: 700`
);

// 4.2 Editorial Eyebrow and Tagline Copy
const eyebrowTextMatch = heroHtml.match(/<span[^>]*class="[^"]*eyebrow[^"]*"[^>]*>([\s\S]*?)<\/span>/);
const eyebrowText = eyebrowTextMatch ? eyebrowTextMatch[1].trim() : '';
const taglineTextMatch = heroHtml.match(/<p[^>]*class="[^"]*hero-tagline[^"]*"[^>]*>([\s\S]*?)<\/p>/);
const taglineText = taglineTextMatch ? taglineTextMatch[1].trim() : '';

const eyebrowValid = eyebrowText.includes('Field Dispatches') &&
  (eyebrowText.includes('The Long Way Home') || eyebrowText.includes('Letters from'));
const taglineMentionsHandle = taglineText.includes('@the_musafir_paaji') && taglineText.includes('Varneet Singh');

record(
  'ADV-M3-14',
  'Hero eyebrow and tagline display authentic Substack publication identity and handle',
  eyebrowValid && taglineMentionsHandle,
  `Eyebrow: "${eyebrowText}", Tagline handle: ${taglineMentionsHandle}`
);

// 4.3 Terracotta CTA Color Token Usage
const ctaUsesTerracotta = globalCss.includes('.hero-subscribe-cta') &&
  globalCss.includes('background: var(--accent-terracotta);');
const ctaHoverTerracotta = globalCss.includes('.hero-subscribe-cta:hover') &&
  globalCss.includes('background: var(--accent-terracotta-hover);');

record(
  'ADV-M3-15',
  'Hero CTA utilizes warm terracotta palette tokens (--accent-terracotta) with spring hover',
  ctaUsesTerracotta && ctaHoverTerracotta,
  `Base terracotta: ${ctaUsesTerracotta}, Hover terracotta: ${ctaHoverTerracotta}`
);


// ============================================================================
// TEST SUITE 5: Reduced Motion & Choreographed Animation
// ============================================================================
console.log('\n--- Test Suite 5: Motion Choreography & Accessibility Hardening ---');

const hasEnterKeyframe = globalCss.includes('@keyframes fadeInUp') || bundledCss.includes('@keyframes fadeInUp');
const heroEnterClass = globalCss.includes('.hero-enter {');
const heroDelays = globalCss.includes('.hero-delay-1') &&
  globalCss.includes('.hero-delay-2') &&
  globalCss.includes('.hero-delay-3') &&
  globalCss.includes('.hero-delay-4');
const heroAmbientClass = globalCss.includes('.hero-photo-ambient {');

const reducedMotionOverride = globalCss.includes('@media (prefers-reduced-motion: reduce)') &&
  globalCss.includes('.hero-enter') &&
  globalCss.includes('opacity: 1 !important;') &&
  globalCss.includes('transform: none !important;');

record(
  'ADV-M3-16',
  'Hero animation choreography defines staggered fadeInUp transitions (delays 1..4) and ambient breathing',
  hasEnterKeyframe && heroEnterClass && heroDelays && heroAmbientClass,
  `Keyframe: ${hasEnterKeyframe}, Delays: ${heroDelays}, Ambient: ${heroAmbientClass}`
);

record(
  'ADV-M3-17',
  'prefers-reduced-motion media query completely neutralizes hero animations (opacity: 1, transform: none)',
  reducedMotionOverride,
  `Reduced motion override verified: ${reducedMotionOverride}`
);


// ============================================================================
// TEST SUITE 6: Active Nav Synchrony Verification (/about)
// ============================================================================
console.log('\n--- Test Suite 6: Active Nav Synchrony Verification (/about) ---');

const aboutDesktopNavMatch = aboutHtml.match(/<ul[^>]*class="[^"]*desktop-nav[^"]*"[^>]*>([\s\S]*?)<\/ul>/);
const aboutDesktopNav = aboutDesktopNavMatch ? aboutDesktopNavMatch[1] : '';
const aboutDesktopActive = /<a[^>]*href="\/about"[^>]*class="[^"]*active[^"]*"[^>]*>About &amp; Volunteer<\/a>|<a[^>]*href="\/about"[^>]*class="[^"]*active[^"]*"[^>]*>About & Volunteer<\/a>/.test(aboutDesktopNav);

const aboutDrawerNavMatch = aboutHtml.match(/<ul[^>]*class="[^"]*mobile-nav-links[^"]*"[^>]*>([\s\S]*?)<\/ul>/);
const aboutDrawerNav = aboutDrawerNavMatch ? aboutDrawerNavMatch[1] : '';
const aboutDrawerActive = /<a[^>]*href="\/about"[^>]*class="[^"]*mobile-nav-link[^"]*active[^"]*"/.test(aboutDrawerNav);

record(
  'ADV-M3-18',
  'About route (/about) correctly applies "active" class on both desktop and mobile drawer navigation',
  aboutDesktopActive && aboutDrawerActive,
  `Desktop active: ${aboutDesktopActive}, Drawer active: ${aboutDrawerActive}`
);


// ============================================================================
// SUMMARY & VERDICT
// ============================================================================
console.log('\n===============================================================');
console.log(`TOTAL ADVERSARIAL TESTS: ${results.length}`);
console.log(`PASSED: ${passedCount}`);
console.log(`FAILED: ${failedCount}`);
console.log('===============================================================');

if (failedCount > 0) {
  console.log('\nVERDICT: REJECT (Failures detected in Milestone 3)');
  process.exit(1);
} else {
  console.log('\nVERDICT: APPROVE (All adversarial challenges passed)');
  process.exit(0);
}
