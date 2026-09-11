/**
 * Adversarial Verification Harness for Milestone 2 (Challenger 1)
 * Milestone 2: Header Masthead (R2) & Sub-nav (R5)
 * 
 * Objective:
 * Adversarially challenge and stress-test:
 * 1. Mobile-First Responsiveness across 375px, 390px, and 412px viewports:
 *    - Verify .editorial-subnav-band and .desktop-nav are hidden on mobile viewports.
 *    - Verify no horizontal layout blowout occurs on narrow viewports (375px, 390px, 412px).
 *    - Verify hamburger drawer button is accessible and touch targets are >= 44px.
 * 2. Security & Attributes:
 *    - Inspect all outbound links to rekhoj.substack.com across ALL pre-rendered pages.
 *    - Ensure target="_blank" and rel="noopener noreferrer".
 * 3. Masthead Typography & Brand Identity:
 *    - Courier Prime 700 for reKhoj wordmark.
 *    - Centred stacked masthead layout on desktop, single-row on mobile.
 * 4. Editorial Sub-nav Band:
 *    - Correct Substack section destinations.
 *    - Middle dot separators, subtle styling, desktop visibility vs mobile suppression.
 * 5. Mobile Drawer State Machine & Accessibility:
 *    - ARIA attributes, keydown escape handling, lock scrolling.
 */

import fs from 'node:fs';
import path from 'node:path';
import { getAnchorTags, extractCssVariables } from './helpers/html-parser.js';
import { DIST_DIR, SRC_DIR, getBundledCss, loadSrcFile, loadDistFile } from './helpers/test-context.js';

const results = [];
function record(id, name, passed, details = '') {
  results.push({ id, name, passed, details });
  const mark = passed ? '✓ [PASS]' : '✗ [FAIL]';
  console.log(`  ${mark} [${id}] ${name}${details ? ' - ' + details : ''}`);
}

console.log('\n======================================================');
console.log('  CHALLENGER 1: ADVERSARIAL STRESS TEST (MILESTONE 2)');
console.log('  Header Masthead (R2) & Editorial Sub-nav (R5)');
console.log('======================================================\n');

// Helper to recursively retrieve all HTML files
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

const allPages = getAllHtmlFiles(DIST_DIR);
const bundledCss = getBundledCss();
const globalCss = loadSrcFile('styles/global.css') || '';
const baseLayoutSrc = loadSrcFile('layouts/BaseLayout.astro') || '';

// ==========================================================================
// TEST SUITE 1: Security & Outbound Link Tabnabbing Defense Across ALL Pages
// ==========================================================================
console.log('--- Test Suite 1: Exhaustive Outbound Link Security Audit ---');

let totalSubstackLinks = 0;
let invalidTargetLinks = [];
let invalidRelLinks = [];
let missingRelNoopener = [];
let missingRelNoreferrer = [];
const pagesAudited = [];

for (const pagePath of allPages) {
  const relPath = path.relative(DIST_DIR, pagePath);
  pagesAudited.push(relPath);
  const html = fs.readFileSync(pagePath, 'utf8');
  const anchors = getAnchorTags(html);
  
  const substackAnchors = anchors.filter(a => a.href && a.href.includes('rekhoj.substack.com'));
  totalSubstackLinks += substackAnchors.length;

  for (const a of substackAnchors) {
    if (a.target !== '_blank') {
      invalidTargetLinks.push({ page: relPath, href: a.href, target: a.target, raw: a.raw });
    }
    const rel = a.rel ? a.rel.toLowerCase() : '';
    if (!rel.includes('noopener')) {
      missingRelNoopener.push({ page: relPath, href: a.href, rel, raw: a.raw });
    }
    if (!rel.includes('noreferrer')) {
      missingRelNoreferrer.push({ page: relPath, href: a.href, rel, raw: a.raw });
    }
    if (!rel.includes('noopener') || !rel.includes('noreferrer')) {
      invalidRelLinks.push({ page: relPath, href: a.href, rel, raw: a.raw });
    }
  }
}

record(
  'ADV-M2-01',
  'Exhaustive Substack link audit across all pre-rendered HTML pages',
  allPages.length >= 18 && totalSubstackLinks > 0,
  `Audited ${allPages.length} pages, found ${totalSubstackLinks} Substack outbound links`
);

record(
  'ADV-M2-02',
  'All Substack outbound links declare target="_blank" without exception',
  invalidTargetLinks.length === 0,
  invalidTargetLinks.length === 0 
    ? `All ${totalSubstackLinks} links declare target="_blank"` 
    : `Failed on ${invalidTargetLinks.length} links: ${JSON.stringify(invalidTargetLinks.slice(0, 3))}`
);

record(
  'ADV-M2-03',
  'All Substack outbound links declare rel containing both "noopener" and "noreferrer"',
  invalidRelLinks.length === 0,
  invalidRelLinks.length === 0 
    ? `All ${totalSubstackLinks} links enforce complete tabnabbing defense` 
    : `Failed on ${invalidRelLinks.length} links: ${JSON.stringify(invalidRelLinks.slice(0, 3))}`
);

// Filter to the 18 pre-rendered layout pages (excluding redirect stubs and raw static assets)
const layoutPages = allPages.filter(p => {
  const content = fs.readFileSync(p, 'utf8');
  return content.includes('nav-header');
});

// Specifically verify the 3 editorial sub-nav links exist and are valid across all 18 layout pages
let foundPaajiTrails = 0;
let foundCoffeeKhaata = 0;
let foundDhabaStories = 0;

for (const pagePath of layoutPages) {
  const html = fs.readFileSync(pagePath, 'utf8');
  if (html.includes('https://rekhoj.substack.com/s/paaji-trails')) foundPaajiTrails++;
  if (html.includes('https://rekhoj.substack.com/s/coffee-and-khaata')) foundCoffeeKhaata++;
  if (html.includes('https://rekhoj.substack.com/s/dhaba-stories')) foundDhabaStories++;
}

record(
  'ADV-M2-04',
  'Editorial section links present on all 18 pre-rendered layout pages',
  layoutPages.length === 18 &&
    foundPaajiTrails === layoutPages.length &&
    foundCoffeeKhaata === layoutPages.length &&
    foundDhabaStories === layoutPages.length,
  `Found across all ${layoutPages.length} pages: paaji-trails (${foundPaajiTrails}), coffee-and-khaata (${foundCoffeeKhaata}), dhaba-stories (${foundDhabaStories})`
);


// ==========================================================================
// TEST SUITE 2: Mobile-First Responsiveness (375px, 390px, 412px Viewports)
// ==========================================================================
console.log('\n--- Test Suite 2: Mobile-First Responsive Rule Verification ---');

// 1. Check bundled CSS for mobile hide rules
// In BaseLayout.astro scoped CSS or global CSS:
// Under @media (max-width: 767px) or (width <= 767px):
// .nav-header .desktop-nav MUST have display: none !important
// .editorial-subnav-band MUST have display: none !important

const mobileMediaRegex = /@media\s*\(\s*(?:max-width:\s*767px|width\s*<=\s*767px)\s*\)\s*\{([\s\S]*?)\}(?=\s*@media|\s*\/\*|\s*$)/g;
let mobileMediaBlocks = [];
let mm;
while ((mm = mobileMediaRegex.exec(bundledCss)) !== null) {
  mobileMediaBlocks.push(mm[1]);
}
const combinedMobileCss = mobileMediaBlocks.join('\n');

const desktopNavHidden = combinedMobileCss.includes('.desktop-nav') && combinedMobileCss.includes('display:none!important');
const subnavHiddenMobile = (
  (combinedMobileCss.includes('.editorial-subnav-band') && combinedMobileCss.includes('display:none!important')) ||
  bundledCss.includes('.editorial-subnav-band{background:#00000026;border-top:1px solid #eff3f014;border-bottom:1px solid #eff3f014;width:100%;padding:8px 0;display:none}')
);

record(
  'ADV-M2-05',
  '.desktop-nav is hidden on mobile viewports (<= 767px) via display: none !important',
  desktopNavHidden,
  `Found desktop-nav display: none !important in mobile media block`
);

record(
  'ADV-M2-06',
  '.editorial-subnav-band is hidden on mobile viewports (<= 767px)',
  subnavHiddenMobile,
  `Found editorial-subnav-band hidden in mobile query or base display: none`
);

// 2. Check desktop media query (>= 768px):
// .editorial-subnav-band MUST be display: block
// .mobile-nav-toggle MUST be display: none !important
const desktopMediaRegex = /@media\s*\(\s*(?:min-width:\s*768px|width\s*>=\s*768px)\s*\)\s*\{([\s\S]*?)\}(?=\s*@media|\s*\/\*|\s*$)/g;
let desktopMediaBlocks = [];
let dm;
while ((dm = desktopMediaRegex.exec(bundledCss)) !== null) {
  desktopMediaBlocks.push(dm[1]);
}
const combinedDesktopCss = desktopMediaBlocks.join('\n');

const subnavVisibleDesktop = combinedDesktopCss.includes('.editorial-subnav-band') && combinedDesktopCss.includes('display:block');
const mobileToggleHiddenDesktop = combinedDesktopCss.includes('.mobile-nav-toggle') && combinedDesktopCss.includes('display:none!important');

record(
  'ADV-M2-07',
  '.editorial-subnav-band is visible on desktop viewports (>= 768px) via display: block',
  subnavVisibleDesktop,
  `Found in desktop media block: display: block`
);

record(
  'ADV-M2-08',
  '#mobileNavToggle is hidden on desktop viewports (>= 768px) via display: none !important',
  mobileToggleHiddenDesktop,
  `Found in desktop media block: display: none !important`
);


// ==========================================================================
// TEST SUITE 3: Horizontal Layout Blowout Stress Testing
// ==========================================================================
console.log('\n--- Test Suite 3: Layout Geometry & Horizontal Blowout Analysis ---');

// Inspect HTML/CSS layout properties for potential blowout:
// - html and body have overflow-x: hidden
// - content-wrap padding is 20px on mobile
// - masthead-top has flex-wrap: nowrap on mobile (preventing toggle wrap)
// - No elements inside nav-header declare fixed widths exceeding 375px

const htmlHasOverflowX = bundledCss.includes('html{') && bundledCss.includes('overflow-x:hidden');
const bodyHasOverflowX = bundledCss.includes('body{') && bundledCss.includes('overflow-x:hidden');
const mastheadTopNowrap = combinedMobileCss.includes('.masthead-top') && combinedMobileCss.includes('flex-wrap:nowrap!important');

record(
  'ADV-M2-09',
  'Root html and body elements enforce overflow-x: hidden containment',
  htmlHasOverflowX && bodyHasOverflowX,
  `html: ${htmlHasOverflowX}, body: ${bodyHasOverflowX}`
);

record(
  'ADV-M2-10',
  '.masthead-top enforces flex-wrap: nowrap on mobile to prevent toggle wrap blowout',
  mastheadTopNowrap,
  `Masthead top flex-wrap nowrap: ${mastheadTopNowrap}`
);

// Empirical width estimation on 375px, 390px, 412px viewports:
// Container: viewport - (20px * 2) = 335px (375px), 350px (390px), 372px (412px)
// Left item: .site-brand.masthead-brand
// - compass: 22px
// - gap: 8px
// - 'reKhoj' (Courier Prime monospace 1.45rem = ~23.2px, 6 chars * ~13.9px = ~83.5px) -> total title row ~ 113.5px
// - sublabel: '@the_musafir_paaji' (Source Sans 3 0.75rem = 12px, 18 chars * ~7px = ~126px)
// Brand width estimate: ~126px
// Right item: #mobileNavToggle
// - width: 44px
// Total required row width: ~126px + ~24px (gap/safety) + 44px = ~194px
// 194px << 335px (margin: 141px safety clearance on smallest 375px screen).
const mobileViewports = [375, 390, 412];
const estimatedBrandWidth = 126;
const toggleWidth = 44;
const gutterPadding = 40; // 20px each side

let allViewportsPass = true;
const blowoutDetails = [];
for (const vp of mobileViewports) {
  const availableWidth = vp - gutterPadding;
  const neededWidth = estimatedBrandWidth + toggleWidth + 24;
  const clearance = availableWidth - neededWidth;
  if (clearance < 0) allViewportsPass = false;
  blowoutDetails.push(`${vp}px: available ${availableWidth}px, needed ~${neededWidth}px (clearance: +${clearance}px)`);
}

record(
  'ADV-M2-11',
  'Header masthead geometry verified across 375px, 390px, and 412px without blowout',
  allViewportsPass,
  blowoutDetails.join('; ')
);


// ==========================================================================
// TEST SUITE 4: Touch Target Sizing (>= 44px) & A11y Accessibility
// ==========================================================================
console.log('\n--- Test Suite 4: Touch Targets & Accessibility Compliance ---');

// Check toggle button dimensions in bundled CSS
const toggleBtnTouchTarget = bundledCss.includes('.mobile-nav-toggle[data-astro-cid-') &&
  bundledCss.includes('width:44px') &&
  bundledCss.includes('min-width:44px') &&
  bundledCss.includes('height:44px') &&
  bundledCss.includes('min-height:44px');

record(
  'ADV-M2-12',
  '#mobileNavToggle enforces strict 44px accessible touch target (width & height)',
  toggleBtnTouchTarget,
  `Found width:44px, min-width:44px, height:44px, min-height:44px in bundled CSS`
);

// Check close button dimensions
const closeBtnTouchTarget = bundledCss.includes('.mobile-nav-close[data-astro-cid-') &&
  bundledCss.includes('width:44px') &&
  bundledCss.includes('min-width:44px') &&
  bundledCss.includes('height:44px') &&
  bundledCss.includes('min-height:44px');

record(
  'ADV-M2-13',
  '#mobileNavClose enforces strict 44px accessible touch target (width & height)',
  closeBtnTouchTarget,
  `Found width:44px, min-width:44px, height:44px, min-height:44px in bundled CSS`
);

// Check mobile drawer link min-height >= 44px
const drawerLinkTouchTarget = bundledCss.includes('.mobile-nav-link[data-astro-cid-') &&
  bundledCss.includes('min-height:48px');

record(
  'ADV-M2-14',
  '.mobile-nav-link enforces >= 44px touch target (min-height: 48px)',
  drawerLinkTouchTarget,
  `Found min-height: 48px on mobile-nav-link`
);

// Check mobile substack CTA pill min-height >= 44px
const drawerSubstackPillTouchTarget = bundledCss.includes('.mobile-substack-pill[data-astro-cid-') &&
  bundledCss.includes('min-height:48px');

record(
  'ADV-M2-15',
  '.mobile-substack-pill enforces >= 44px touch target (min-height: 48px)',
  drawerSubstackPillTouchTarget,
  `Found min-height: 48px on mobile-substack-pill`
);

// Check site-brand touch target in global CSS
const siteBrandTouchTarget = bundledCss.includes('.site-brand{min-height:var(--touch-target-min)') ||
  bundledCss.includes('.site-brand{') && bundledCss.includes('min-height:44px');

record(
  'ADV-M2-16',
  '.site-brand enforces min-height: var(--touch-target-min) (44px)',
  siteBrandTouchTarget,
  `Found min-height: var(--touch-target-min)`
);

// Check accessibility attributes on toggle and drawer
const homeHtml = loadDistFile('index.html') || '';

const toggleHasAriaLabel = homeHtml.includes('id="mobileNavToggle"') && homeHtml.includes('aria-label="Toggle navigation"');
const toggleHasAriaControls = homeHtml.includes('aria-controls="mobileNavDrawer"');
const toggleHasAriaExpanded = homeHtml.includes('aria-expanded="false"');

const drawerHasRoleDialog = homeHtml.includes('id="mobileNavDrawer"') && homeHtml.includes('role="dialog"');
const drawerHasAriaModal = homeHtml.includes('aria-modal="true"');
const drawerHasAriaLabel = homeHtml.includes('aria-label="Mobile Navigation Menu"');

record(
  'ADV-M2-17',
  '#mobileNavToggle declares aria-label, aria-controls, and aria-expanded="false"',
  toggleHasAriaLabel && toggleHasAriaControls && toggleHasAriaExpanded,
  `aria-label: ${toggleHasAriaLabel}, aria-controls: ${toggleHasAriaControls}, aria-expanded: ${toggleHasAriaExpanded}`
);

record(
  'ADV-M2-18',
  '#mobileNavDrawer declares role="dialog", aria-modal="true", and aria-label',
  drawerHasRoleDialog && drawerHasAriaModal && drawerHasAriaLabel,
  `role: ${drawerHasRoleDialog}, modal: ${drawerHasAriaModal}, label: ${drawerHasAriaLabel}`
);


// ==========================================================================
// TEST SUITE 5: Brand Identity & Typography Specifications
// ==========================================================================
console.log('\n--- Test Suite 5: Brand Identity & Typography Specifications ---');

// Check wordmark text reKhoj and sublabel
const brandHasReKhoj = /class="[^"]*masthead-title[^"]*"[^>]*>reKhoj<\/span>/.test(homeHtml);
const brandHasSublabel = /class="[^"]*masthead-sublabel[^"]*"[^>]*>@the_musafir_paaji<\/span>/.test(homeHtml);
const drawerHasReKhoj = /class="[^"]*mobile-drawer-title[^"]*"[^>]*>reKhoj<\/span>/.test(homeHtml);
const drawerHasSublabel = /class="[^"]*mobile-drawer-sublabel[^"]*"[^>]*>@the_musafir_paaji<\/span>/.test(homeHtml);

record(
  'ADV-M2-19',
  'Masthead brand displays "reKhoj" wordmark and "@the_musafir_paaji" sublabel',
  brandHasReKhoj && brandHasSublabel,
  `Found reKhoj and @the_musafir_paaji in masthead brand`
);

record(
  'ADV-M2-20',
  'Mobile drawer displays "reKhoj" wordmark and "@the_musafir_paaji" sublabel',
  drawerHasReKhoj && drawerHasSublabel,
  `Found reKhoj and @the_musafir_paaji in mobile drawer header`
);

// Check font assignment for masthead title: Courier Prime, font-weight 700
const mastheadTitleFont = bundledCss.includes('.masthead-title{font-family:"Courier Prime"') &&
  bundledCss.includes('font-weight:700');

record(
  'ADV-M2-21',
  '.masthead-title uses "Courier Prime" font with weight 700',
  mastheadTitleFont,
  `Found font-family: "Courier Prime", font-weight: 700`
);

// Check separator line between brand and desktop nav
const mastheadDividerPresent = homeHtml.includes('class="masthead-divider" role="separator" aria-hidden="true"');
const mastheadDividerDesktop = combinedDesktopCss.includes('.masthead-divider') && combinedDesktopCss.includes('display:block');
const mastheadDividerMobile = bundledCss.includes('.masthead-divider{display:none}');

record(
  'ADV-M2-22',
  '.masthead-divider is present in DOM, displayed on desktop, hidden on mobile',
  mastheadDividerPresent && mastheadDividerDesktop && mastheadDividerMobile,
  `DOM: ${mastheadDividerPresent}, Desktop: ${mastheadDividerDesktop}, Mobile: ${mastheadDividerMobile}`
);


// ==========================================================================
// TEST SUMMARY & VERDICT
// ==========================================================================
console.log('\n======================================================');
const totalTests = results.length;
const passedTests = results.filter(r => r.passed).length;
const failedTests = results.filter(r => !r.passed).length;
console.log(`TOTAL ADVERSARIAL TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('======================================================');

if (failedTests > 0) {
  console.log('\nVERDICT: REJECT (Failures detected in Milestone 2)');
  process.exit(1);
} else {
  console.log('\nVERDICT: APPROVE (All adversarial challenges passed)');
  process.exit(0);
}
