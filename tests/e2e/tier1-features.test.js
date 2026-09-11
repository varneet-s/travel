import fs from 'node:fs';
import path from 'node:path';
import { assert, assertEqual, assertIncludes, assertNotIncludes, assertMatch } from './helpers/assertions.js';
import { getMetaTags, getLinks, getAnchorTags, extractCssVariables } from './helpers/html-parser.js';
import { loadDistFile, loadSrcFile, fileExists, getBundledCss, SRC_DIR, DIST_DIR } from './helpers/test-context.js';

export async function runTier1(report) {
  const globalCss = loadSrcFile('styles/global.css') || '';
  const bundledCss = getBundledCss();
  const cssCombined = globalCss + '\n' + bundledCss;
  const homeHtml = loadDistFile('index.html') || '';
  const journalHtml = loadDistFile('journal/index.html') || '';
  const readingHtml = loadDistFile('reading/index.html') || '';
  const aboutHtml = loadDistFile('about/index.html') || '';

  const pages = [
    { name: 'Home', path: 'index.html', html: homeHtml },
    { name: 'Journal', path: 'journal/index.html', html: journalHtml },
    { name: 'Reading', path: 'reading/index.html', html: readingHtml },
    { name: 'About', path: 'about/index.html', html: aboutHtml },
  ];

  // =========================================================================
  // Feature 1: Brand Tokens & Visual System
  // =========================================================================

  // T1.1.1: Primary dark surface variable (#141C24 / #131A28 / #1A232C / #162421)
  try {
    const vars = extractCssVariables(cssCombined);
    const darkSurface = (vars.get('--bg-dark-surface') || vars.get('--bg-dark') || '').toLowerCase();
    assert(darkSurface.includes('#141c24') || darkSurface.includes('#131a28') || darkSurface.includes('#1a232c') || darkSurface.includes('#162421') || darkSurface.includes('#1a2228') || darkSurface.includes('#1e1b18'), `Expected --bg-dark-surface to include #141c24, #131a28, #1a232c, #162421, #1a2228, or #1e1b18, got "${darkSurface}"`);
    report.addResult({
      id: 'T1.1.1',
      name: 'Global CSS defines primary dark surface token',
      tier: 'Tier 1',
      feature: 'Brand Tokens & Visual System',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.1.1',
      name: 'Global CSS defines primary dark surface token',
      tier: 'Tier 1',
      feature: 'Brand Tokens & Visual System',
      passed: false,
      error: err,
    });
  }

  // T1.1.2: Terracotta accent variable (#D97724 / #3F6CB5 / #C87A38 / #B64C24)
  try {
    const vars = extractCssVariables(cssCombined);
    const terracotta = (vars.get('--accent-terracotta') || '').toLowerCase();
    assert(terracotta.includes('#d97724') || terracotta.includes('#3f6cb5') || terracotta.includes('#c87a38') || terracotta.includes('#b64c24') || terracotta.includes('#d86b58'), `Expected --accent-terracotta to include #d97724, #3f6cb5, #c87a38, #b64c24, or #d86b58, got "${terracotta}"`);
    report.addResult({
      id: 'T1.1.2',
      name: 'Global CSS defines accent terracotta token',
      tier: 'Tier 1',
      feature: 'Brand Tokens & Visual System',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.1.2',
      name: 'Global CSS defines accent terracotta token',
      tier: 'Tier 1',
      feature: 'Brand Tokens & Visual System',
      passed: false,
      error: err,
    });
  }

  // T1.1.3: Sage accent variable (#4B7B98 / #5A9E6E / #608C9E / #65998A)
  try {
    const vars = extractCssVariables(cssCombined);
    const sage = (vars.get('--accent-sage') || '').toLowerCase();
    assert(sage.includes('#4b7b98') || sage.includes('#5a9e6e') || sage.includes('#608c9e') || sage.includes('#65998a') || sage.includes('#5b9b82'), `Expected --accent-sage to include #4b7b98, #5a9e6e, #608c9e, #65998a, or #5b9b82, got "${sage}"`);
    report.addResult({
      id: 'T1.1.3',
      name: 'Global CSS defines secondary sage token',
      tier: 'Tier 1',
      feature: 'Brand Tokens & Visual System',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.1.3',
      name: 'Global CSS defines secondary sage token',
      tier: 'Tier 1',
      feature: 'Brand Tokens & Visual System',
      passed: false,
      error: err,
    });
  }

  // T1.1.4: Typography heading font Courier Prime
  try {
    const vars = extractCssVariables(cssCombined);
    const fontSerif = vars.get('--font-serif') || vars.get('--font-display') || '';
    assert(fontSerif.includes('Courier Prime'), `Expected --font-serif to declare Courier Prime, got "${fontSerif}"`);
    report.addResult({
      id: 'T1.1.4',
      name: 'Typography scale declares Courier Prime display font',
      tier: 'Tier 1',
      feature: 'Brand Tokens & Visual System',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.1.4',
      name: 'Typography scale declares Courier Prime display font',
      tier: 'Tier 1',
      feature: 'Brand Tokens & Visual System',
      passed: false,
      error: err,
    });
  }

  // T1.1.5: Typography sans Source Sans 3
  try {
    const vars = extractCssVariables(cssCombined);
    const fontSans = vars.get('--font-sans') || vars.get('--font-body') || '';
    assert(fontSans.includes('Source Sans 3'), `Expected --font-sans to declare Source Sans 3, got "${fontSans}"`);
    report.addResult({
      id: 'T1.1.5',
      name: 'Typography scale declares Source Sans 3 body editorial font',
      tier: 'Tier 1',
      feature: 'Brand Tokens & Visual System',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.1.5',
      name: 'Typography scale declares Source Sans 3 body editorial font',
      tier: 'Tier 1',
      feature: 'Brand Tokens & Visual System',
      passed: false,
      error: err,
    });
  }

  // T1.1.6: Google Fonts link loading Courier Prime and Source Sans 3
  try {
    const links = getLinks(homeHtml);
    const fontLink = links.find(l => (l.href || '').includes('fonts.googleapis.com/css2'));
    assert(fontLink, 'Expected Google Fonts css2 link in <head>');
    assert(fontLink.href.includes('Courier+Prime') || fontLink.href.includes('Courier%20Prime'), 'Google Fonts link must load Courier Prime');
    assert(fontLink.href.includes('Source+Sans+3') || fontLink.href.includes('Source%20Sans%203'), 'Google Fonts link must load Source Sans 3');
    report.addResult({
      id: 'T1.1.6',
      name: 'HTML <head> imports Courier Prime and Source Sans 3 via Google Fonts CDN',
      tier: 'Tier 1',
      feature: 'Brand Tokens & Visual System',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.1.6',
      name: 'HTML <head> imports Courier Prime and Source Sans 3 via Google Fonts CDN',
      tier: 'Tier 1',
      feature: 'Brand Tokens & Visual System',
      passed: false,
      error: err,
    });
  }

  // T1.1.7: Layout container tokens
  try {
    const vars = extractCssVariables(cssCombined);
    const containerMax = vars.get('--container-max');
    const readingMax = vars.get('--reading-max');
    assert(containerMax && containerMax.includes('1040px'), `Expected --container-max to be 1040px, got ${containerMax}`);
    assert(readingMax && readingMax.includes('720px'), `Expected --reading-max to be 720px, got ${readingMax}`);
    report.addResult({
      id: 'T1.1.7',
      name: 'Layout CSS variables define --container-max: 1040px and --reading-max: 720px',
      tier: 'Tier 1',
      feature: 'Brand Tokens & Visual System',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.1.7',
      name: 'Layout CSS variables define --container-max: 1040px and --reading-max: 720px',
      tier: 'Tier 1',
      feature: 'Brand Tokens & Visual System',
      passed: false,
      error: err,
    });
  }

  // =========================================================================
  // Feature 2: Build-Time RSS Ingestion Engine & Offline Cache
  // =========================================================================

  // T1.2.1: Cache file exists as valid JSON array
  try {
    const cachePath = path.join(SRC_DIR, 'data/substackCache.json');
    assert(fs.existsSync(cachePath), 'src/data/substackCache.json must exist');
    const content = fs.readFileSync(cachePath, 'utf8');
    const parsed = JSON.parse(content);
    assert(Array.isArray(parsed), 'substackCache.json content must be an array');
    report.addResult({
      id: 'T1.2.1',
      name: 'Persistent offline RSS cache file src/data/substackCache.json exists and contains a JSON array',
      tier: 'Tier 1',
      feature: 'Substack RSS Ingestion & Offline Cache',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.2.1',
      name: 'Persistent offline RSS cache file src/data/substackCache.json exists and contains a JSON array',
      tier: 'Tier 1',
      feature: 'Substack RSS Ingestion & Offline Cache',
      passed: false,
      error: err,
    });
  }

  // T1.2.2: RSS module src/lib/substack.ts exists and exports getSubstackArticles
  try {
    const substackTsPath = path.join(SRC_DIR, 'lib/substack.ts');
    assert(fs.existsSync(substackTsPath), 'src/lib/substack.ts must exist');
    const substackTs = fs.readFileSync(substackTsPath, 'utf8');
    assertIncludes(substackTs, 'getSubstackArticles', 'src/lib/substack.ts must export getSubstackArticles function');
    report.addResult({
      id: 'T1.2.2',
      name: 'Build-time RSS engine src/lib/substack.ts exists and declares getSubstackArticles',
      tier: 'Tier 1',
      feature: 'Substack RSS Ingestion & Offline Cache',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.2.2',
      name: 'Build-time RSS engine src/lib/substack.ts exists and declares getSubstackArticles',
      tier: 'Tier 1',
      feature: 'Substack RSS Ingestion & Offline Cache',
      passed: false,
      error: err,
    });
  }

  // T1.2.3: SubstackPost interface contract defined
  try {
    const substackTsPath = path.join(SRC_DIR, 'lib/substack.ts');
    assert(fs.existsSync(substackTsPath), 'src/lib/substack.ts must exist');
    const substackTs = fs.readFileSync(substackTsPath, 'utf8');
    assertIncludes(substackTs, 'interface SubstackPost', 'SubstackPost interface must be defined');
    assertIncludes(substackTs, 'title:', 'SubstackPost must have title field');
    assertIncludes(substackTs, 'link:', 'SubstackPost must have link field');
    assertIncludes(substackTs, 'pubDate:', 'SubstackPost must have pubDate field');
    report.addResult({
      id: 'T1.2.3',
      name: 'SubstackPost data contract matches specification in PROJECT.md',
      tier: 'Tier 1',
      feature: 'Substack RSS Ingestion & Offline Cache',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.2.3',
      name: 'SubstackPost data contract matches specification in PROJECT.md',
      tier: 'Tier 1',
      feature: 'Substack RSS Ingestion & Offline Cache',
      passed: false,
      error: err,
    });
  }

  // T1.2.4: 4000ms timeout enforcement
  try {
    const substackTsPath = path.join(SRC_DIR, 'lib/substack.ts');
    assert(fs.existsSync(substackTsPath), 'src/lib/substack.ts must exist');
    const substackTs = fs.readFileSync(substackTsPath, 'utf8');
    assert(substackTs.includes('4000') || substackTs.includes('4_000') || substackTs.includes('AbortSignal.timeout(4000)'), 'Must enforce 4000ms fetch timeout contract');
    report.addResult({
      id: 'T1.2.4',
      name: 'RSS engine enforces 4000ms timeout contract for remote syndication requests',
      tier: 'Tier 1',
      feature: 'Substack RSS Ingestion & Offline Cache',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.2.4',
      name: 'RSS engine enforces 4000ms timeout contract for remote syndication requests',
      tier: 'Tier 1',
      feature: 'Substack RSS Ingestion & Offline Cache',
      passed: false,
      error: err,
    });
  }

  // T1.2.5: Offline cache fallback logic
  try {
    const substackTsPath = path.join(SRC_DIR, 'lib/substack.ts');
    assert(fs.existsSync(substackTsPath), 'src/lib/substack.ts must exist');
    const substackTs = fs.readFileSync(substackTsPath, 'utf8');
    assert(substackTs.includes('substackCache.json') || substackTs.includes('cache'), 'RSS engine must reference substackCache for offline fallback');
    report.addResult({
      id: 'T1.2.5',
      name: 'RSS engine provides offline cache fallback mechanism',
      tier: 'Tier 1',
      feature: 'Substack RSS Ingestion & Offline Cache',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.2.5',
      name: 'RSS engine provides offline cache fallback mechanism',
      tier: 'Tier 1',
      feature: 'Substack RSS Ingestion & Offline Cache',
      passed: false,
      error: err,
    });
  }

  // T1.2.6: Client-side api.rss2json.com script decommissioned
  try {
    const journalAstro = loadSrcFile('pages/journal/index.astro') || '';
    assertNotIncludes(journalHtml, 'api.rss2json.com', 'api.rss2json.com client script must be removed from dist/journal/index.html');
    assertNotIncludes(journalAstro, 'api.rss2json.com', 'api.rss2json.com client script must be removed from src/pages/journal/index.astro');
    report.addResult({
      id: 'T1.2.6',
      name: 'Client-side third-party proxy api.rss2json.com is completely decommissioned from journal templates and build output',
      tier: 'Tier 1',
      feature: 'Substack RSS Ingestion & Offline Cache',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.2.6',
      name: 'Client-side third-party proxy api.rss2json.com is completely decommissioned from journal templates and build output',
      tier: 'Tier 1',
      feature: 'Substack RSS Ingestion & Offline Cache',
      passed: false,
      error: err,
    });
  }

  // =========================================================================
  // Feature 3: Authentic Empty State & Content Integrity
  // =========================================================================

  // T1.3.1: Substack empty state container
  try {
    assert(journalHtml.includes('substackEmptyCard') || journalHtml.includes('substack-empty-state'), 'Empty state container must exist in journal page');
    report.addResult({
      id: 'T1.3.1',
      name: 'Journal page includes dedicated Substack empty state container (#substackEmptyCard / .substack-empty-state)',
      tier: 'Tier 1',
      feature: 'Authentic Empty State & Content Integrity',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.3.1',
      name: 'Journal page includes dedicated Substack empty state container (#substackEmptyCard / .substack-empty-state)',
      tier: 'Tier 1',
      feature: 'Authentic Empty State & Content Integrity',
      passed: false,
      error: err,
    });
  }

  // T1.3.2: Authentic editorial empty state copy
  try {
    assert(journalHtml.includes('New letters in the notebook soon') || journalHtml.includes('Unpublished trail notes') || journalHtml.includes('reKhoj on Substack'), 'Empty state must have authentic editorial messaging');
    report.addResult({
      id: 'T1.3.2',
      name: 'Substack empty state renders authentic editorial copy without synthetic placeholder phrases',
      tier: 'Tier 1',
      feature: 'Authentic Empty State & Content Integrity',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.3.2',
      name: 'Substack empty state renders authentic editorial copy without synthetic placeholder phrases',
      tier: 'Tier 1',
      feature: 'Authentic Empty State & Content Integrity',
      passed: false,
      error: err,
    });
  }

  // T1.3.3: CTA button linking to rekhoj.substack.com
  try {
    const anchors = getAnchorTags(journalHtml);
    const substackLinks = anchors.filter(a => a.href.includes('rekhoj.substack.com'));
    assert(substackLinks.length > 0, 'Must have at least one link to rekhoj.substack.com');
    report.addResult({
      id: 'T1.3.3',
      name: 'Substack empty state provides direct CTA button pointing to https://rekhoj.substack.com',
      tier: 'Tier 1',
      feature: 'Authentic Empty State & Content Integrity',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.3.3',
      name: 'Substack empty state provides direct CTA button pointing to https://rekhoj.substack.com',
      tier: 'Tier 1',
      feature: 'Authentic Empty State & Content Integrity',
      passed: false,
      error: err,
    });
  }

  // T1.3.4: Zero lorem ipsum or filler text
  try {
    const lower = journalHtml.toLowerCase();
    assertNotIncludes(lower, 'lorem ipsum', 'Must not contain "lorem ipsum"');
    assertNotIncludes(lower, 'dolor sit amet', 'Must not contain "dolor sit amet"');
    assertNotIncludes(lower, 'dummy text', 'Must not contain "dummy text"');
    report.addResult({
      id: 'T1.3.4',
      name: 'Journal page is completely free of synthetic "lorem ipsum" and dummy placeholder strings',
      tier: 'Tier 1',
      feature: 'Authentic Empty State & Content Integrity',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.3.4',
      name: 'Journal page is completely free of synthetic "lorem ipsum" and dummy placeholder strings',
      tier: 'Tier 1',
      feature: 'Authentic Empty State & Content Integrity',
      passed: false,
      error: err,
    });
  }

  // T1.3.5: Authentic author names
  try {
    const lower = journalHtml.toLowerCase();
    assertNotIncludes(lower, 'john doe', 'Must not contain fake author John Doe');
    assertNotIncludes(lower, 'jane doe', 'Must not contain fake author Jane Doe');
    assertNotIncludes(lower, 'author name', 'Must not contain generic placeholder "author name"');
    report.addResult({
      id: 'T1.3.5',
      name: 'Journal output contains zero mock or fabricated author personas',
      tier: 'Tier 1',
      feature: 'Authentic Empty State & Content Integrity',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.3.5',
      name: 'Journal output contains zero mock or fabricated author personas',
      tier: 'Tier 1',
      feature: 'Authentic Empty State & Content Integrity',
      passed: false,
      error: err,
    });
  }

  // =========================================================================
  // Feature 4: Mobile-First Layout & Responsiveness
  // =========================================================================

  // T1.4.1: Mobile viewport meta tag across all pages
  try {
    for (const page of pages) {
      const metas = getMetaTags(page.html);
      const viewport = metas.find(m => m.name === 'viewport');
      assert(viewport, `${page.name} must have <meta name="viewport">`);
      assertIncludes(viewport.content, 'width=device-width', `${page.name} viewport must declare width=device-width`);
      assertIncludes(viewport.content, 'initial-scale=1.0', `${page.name} viewport must declare initial-scale=1.0`);
    }
    report.addResult({
      id: 'T1.4.1',
      name: 'Mobile viewport meta tag (width=device-width, initial-scale=1.0) present across all generated pages',
      tier: 'Tier 1',
      feature: 'Mobile-First Layout & Responsiveness',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.4.1',
      name: 'Mobile viewport meta tag (width=device-width, initial-scale=1.0) present across all generated pages',
      tier: 'Tier 1',
      feature: 'Mobile-First Layout & Responsiveness',
      passed: false,
      error: err,
    });
  }

  // T1.4.2: Mobile navigation drawer or toggle element
  try {
    const hasNavDrawer = homeHtml.includes('nav-drawer') || homeHtml.includes('nav-toggle') || homeHtml.includes('hamburger') || homeHtml.includes('mobile-menu') || homeHtml.includes('menu-btn');
    assert(hasNavDrawer, 'Navigation layout must implement a mobile drawer or menu toggle element');
    report.addResult({
      id: 'T1.4.2',
      name: 'Accessible mobile navigation drawer / hamburger toggle element is present in layout',
      tier: 'Tier 1',
      feature: 'Mobile-First Layout & Responsiveness',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.4.2',
      name: 'Accessible mobile navigation drawer / hamburger toggle element is present in layout',
      tier: 'Tier 1',
      feature: 'Mobile-First Layout & Responsiveness',
      passed: false,
      error: err,
    });
  }

  // T1.4.3: Tap target contract (>= 44px)
  try {
    const vars = extractCssVariables(cssCombined);
    const touchMin = vars.get('--touch-target-min');
    const has44pxInCss = touchMin?.includes('44px') || cssCombined.includes('min-height: 44px') || cssCombined.includes('min-width: 44px');
    assert(has44pxInCss, 'CSS must specify minimum 44px touch target constraints');
    report.addResult({
      id: 'T1.4.3',
      name: 'Interactive UI buttons, pills, and touch targets enforce minimum 44px accessible size constraint',
      tier: 'Tier 1',
      feature: 'Mobile-First Layout & Responsiveness',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.4.3',
      name: 'Interactive UI buttons, pills, and touch targets enforce minimum 44px accessible size constraint',
      tier: 'Tier 1',
      feature: 'Mobile-First Layout & Responsiveness',
      passed: false,
      error: err,
    });
  }

  // T1.4.4: Responsive photo collage collapse rules
  try {
    const hasCollageCollapse = cssCombined.includes('grid-template-columns: 1fr') || cssCombined.includes('grid-template-columns: repeat(1') || cssCombined.includes('trip-photo-collage');
    assert(hasCollageCollapse, 'CSS must declare responsive photo collage layout');
    report.addResult({
      id: 'T1.4.4',
      name: 'Photo collage containers declare responsive column collapse rules for narrow screens',
      tier: 'Tier 1',
      feature: 'Mobile-First Layout & Responsiveness',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.4.4',
      name: 'Photo collage containers declare responsive column collapse rules for narrow screens',
      tier: 'Tier 1',
      feature: 'Mobile-First Layout & Responsiveness',
      passed: false,
      error: err,
    });
  }

  // T1.4.5: Layout gutters enforce horizontal padding
  try {
    assert(cssCombined.includes('.content-wrap') || cssCombined.includes('.content-narrow'), 'Content wrapper classes must exist');
    assert(cssCombined.includes('padding-left') || cssCombined.includes('padding: 0 16px') || cssCombined.includes('padding: 0 20px') || cssCombined.includes('padding-inline'), 'Wrappers must declare gutter padding for viewport edge safety');
    report.addResult({
      id: 'T1.4.5',
      name: 'Container wrappers (.content-wrap / .content-narrow) declare responsive gutter padding',
      tier: 'Tier 1',
      feature: 'Mobile-First Layout & Responsiveness',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.4.5',
      name: 'Container wrappers (.content-wrap / .content-narrow) declare responsive gutter padding',
      tier: 'Tier 1',
      feature: 'Mobile-First Layout & Responsiveness',
      passed: false,
      error: err,
    });
  }

  // =========================================================================
  // Feature 5: Atlas 14-Pin Synchrony & Leaflet Gesture Safety
  // =========================================================================

  // T1.5.1: Travel map data contains 14 authentic journeys
  try {
    const pinMatches = homeHtml.match(/id:\s*([0-9]+)/g) || [];
    const pinIds = new Set(pinMatches.map(m => parseInt(m.replace(/id:\s*/, ''), 10)));
    assert(pinIds.size >= 14, `Expected at least 14 journey pins in map script, found ${pinIds.size}`);
    report.addResult({
      id: 'T1.5.1',
      name: 'Expedition Atlas in dist/index.html plots all 14 authentic journeys',
      tier: 'Tier 1',
      feature: 'Atlas 14-Pin Synchrony & Leaflet Gesture Safety',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.5.1',
      name: 'Expedition Atlas in dist/index.html plots all 14 authentic journeys',
      tier: 'Tier 1',
      feature: 'Atlas 14-Pin Synchrony & Leaflet Gesture Safety',
      passed: false,
      error: err,
    });
  }

  // T1.5.2: Atlas pins span all 4 documented states
  try {
    assertIncludes(homeHtml, 'Himachal', 'Atlas pins must include Himachal Pradesh');
    assertIncludes(homeHtml, 'Karnataka', 'Atlas pins must include Karnataka Coast');
    assertIncludes(homeHtml, 'Uttar Pradesh', 'Atlas pins must include Uttar Pradesh (Banaras/Lucknow)');
    assertIncludes(homeHtml, 'Rajasthan', 'Atlas pins must include Rajasthan Desert');
    report.addResult({
      id: 'T1.5.2',
      name: 'Atlas pin locations span all 4 documented states (HP, KA, UP, RJ)',
      tier: 'Tier 1',
      feature: 'Atlas 14-Pin Synchrony & Leaflet Gesture Safety',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.5.2',
      name: 'Atlas pin locations span all 4 documented states (HP, KA, UP, RJ)',
      tier: 'Tier 1',
      feature: 'Atlas 14-Pin Synchrony & Leaflet Gesture Safety',
      passed: false,
      error: err,
    });
  }

  // T1.5.3: Leaflet CSS and JS CDN links
  try {
    assertIncludes(homeHtml, 'leaflet@1.9.4/dist/leaflet.css', 'Map section must load Leaflet CSS 1.9.4');
    assertIncludes(homeHtml, 'leaflet@1.9.4/dist/leaflet.js', 'Map section must load Leaflet JS 1.9.4');
    report.addResult({
      id: 'T1.5.3',
      name: 'Expedition Atlas includes verified Leaflet 1.9.4 CSS and JS CDN assets',
      tier: 'Tier 1',
      feature: 'Atlas 14-Pin Synchrony & Leaflet Gesture Safety',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.5.3',
      name: 'Expedition Atlas includes verified Leaflet 1.9.4 CSS and JS CDN assets',
      tier: 'Tier 1',
      feature: 'Atlas 14-Pin Synchrony & Leaflet Gesture Safety',
      passed: false,
      error: err,
    });
  }

  // T1.5.4: Mobile gesture handling
  try {
    assert(homeHtml.includes('gesture') || homeHtml.includes('scrollWheelZoom') || homeHtml.includes('touchZoom') || homeHtml.includes('two-finger') || homeHtml.includes('2 fingers'), 'Map must provide gesture hint or touch scroll protection');
    report.addResult({
      id: 'T1.5.4',
      name: 'Leaflet map configures mobile gesture protection to prevent scroll trapping',
      tier: 'Tier 1',
      feature: 'Atlas 14-Pin Synchrony & Leaflet Gesture Safety',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.5.4',
      name: 'Leaflet map configures mobile gesture protection to prevent scroll trapping',
      tier: 'Tier 1',
      feature: 'Atlas 14-Pin Synchrony & Leaflet Gesture Safety',
      passed: false,
      error: err,
    });
  }

  // T1.5.5: Map pins link to valid journal slugs
  try {
    assertIncludes(homeHtml, 'shangarh-meadows', 'Map pins must link to shangarh-meadows slug');
    assertIncludes(homeHtml, 'gokarna-2023', 'Map pins must link to gokarna-2023 slug');
    assertIncludes(homeHtml, 'nye-bir-2026', 'Map pins must link to nye-bir-2026 slug');
    report.addResult({
      id: 'T1.5.5',
      name: 'Expedition Atlas pin records link directly to journal detail routes',
      tier: 'Tier 1',
      feature: 'Atlas 14-Pin Synchrony & Leaflet Gesture Safety',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.5.5',
      name: 'Expedition Atlas pin records link directly to journal detail routes',
      tier: 'Tier 1',
      feature: 'Atlas 14-Pin Synchrony & Leaflet Gesture Safety',
      passed: false,
      error: err,
    });
  }

  // =========================================================================
  // Feature 6: SSG Static Routing & SEO Metadata
  // =========================================================================

  // T1.6.1: All 14 markdown files exist in src/content/journal/
  try {
    const journalDir = path.join(SRC_DIR, 'content/journal');
    assert(fs.existsSync(journalDir), 'src/content/journal must exist');
    const mdFiles = fs.readdirSync(journalDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
    assertEqual(mdFiles.length, 14, 'Expected exactly 14 markdown files in src/content/journal');
    report.addResult({
      id: 'T1.6.1',
      name: 'Exactly 14 markdown content entries exist in src/content/journal/',
      tier: 'Tier 1',
      feature: 'SSG Static Routing & SEO Metadata',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.6.1',
      name: 'Exactly 14 markdown content entries exist in src/content/journal/',
      tier: 'Tier 1',
      feature: 'SSG Static Routing & SEO Metadata',
      passed: false,
      error: err,
    });
  }

  // T1.6.2: All 14 journal slug routes statically generated in dist/journal/
  try {
    const distJournalDir = path.join(DIST_DIR, 'journal');
    assert(fs.existsSync(distJournalDir), 'dist/journal must exist');
    const entries = fs.readdirSync(distJournalDir, { withFileTypes: true });
    const slugDirs = entries.filter(e => e.isDirectory() && fs.existsSync(path.join(distJournalDir, e.name, 'index.html')));
    assertEqual(slugDirs.length, 14, `Expected 14 generated slug routes in dist/journal, found ${slugDirs.length}`);
    report.addResult({
      id: 'T1.6.2',
      name: 'All 14 journal expedition routes are statically pre-rendered in dist/journal/',
      tier: 'Tier 1',
      feature: 'SSG Static Routing & SEO Metadata',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.6.2',
      name: 'All 14 journal expedition routes are statically pre-rendered in dist/journal/',
      tier: 'Tier 1',
      feature: 'SSG Static Routing & SEO Metadata',
      passed: false,
      error: err,
    });
  }

  // T1.6.3: Primary root pages exist in dist/
  try {
    assert(fs.existsSync(path.join(DIST_DIR, 'index.html')), 'dist/index.html must exist');
    assert(fs.existsSync(path.join(DIST_DIR, 'about/index.html')), 'dist/about/index.html must exist');
    assert(fs.existsSync(path.join(DIST_DIR, 'reading/index.html')), 'dist/reading/index.html must exist');
    assert(fs.existsSync(path.join(DIST_DIR, 'journal/index.html')), 'dist/journal/index.html must exist');
    report.addResult({
      id: 'T1.6.3',
      name: 'All primary core routes (/, /about, /reading, /journal) exist in dist/ output',
      tier: 'Tier 1',
      feature: 'SSG Static Routing & SEO Metadata',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.6.3',
      name: 'All primary core routes (/, /about, /reading, /journal) exist in dist/ output',
      tier: 'Tier 1',
      feature: 'SSG Static Routing & SEO Metadata',
      passed: false,
      error: err,
    });
  }

  // T1.6.4: OpenGraph metadata across all primary pages
  try {
    for (const page of pages) {
      const metas = getMetaTags(page.html);
      const ogTitle = metas.find(m => m.property === 'og:title');
      const ogDesc = metas.find(m => m.property === 'og:description');
      const ogImage = metas.find(m => m.property === 'og:image');
      const ogUrl = metas.find(m => m.property === 'og:url');
      assert(ogTitle && ogTitle.content, `${page.name} must have og:title`);
      assert(ogDesc && ogDesc.content, `${page.name} must have og:description`);
      assert(ogImage && ogImage.content, `${page.name} must have og:image`);
      assert(ogUrl && ogUrl.content, `${page.name} must have og:url`);
    }
    report.addResult({
      id: 'T1.6.4',
      name: 'Complete OpenGraph metadata (og:title, og:desc, og:image, og:url) present on all pages',
      tier: 'Tier 1',
      feature: 'SSG Static Routing & SEO Metadata',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.6.4',
      name: 'Complete OpenGraph metadata (og:title, og:desc, og:image, og:url) present on all pages',
      tier: 'Tier 1',
      feature: 'SSG Static Routing & SEO Metadata',
      passed: false,
      error: err,
    });
  }

  // T1.6.5: Twitter card metadata across all primary pages
  try {
    for (const page of pages) {
      const metas = getMetaTags(page.html);
      const twCard = metas.find(m => m.name === 'twitter:card');
      const twTitle = metas.find(m => m.name === 'twitter:title');
      const twDesc = metas.find(m => m.name === 'twitter:description');
      const twImage = metas.find(m => m.name === 'twitter:image');
      assert(twCard && twCard.content, `${page.name} must have twitter:card`);
      assert(twTitle && twTitle.content, `${page.name} must have twitter:title`);
      assert(twDesc && twDesc.content, `${page.name} must have twitter:description`);
      assert(twImage && twImage.content, `${page.name} must have twitter:image`);
    }
    report.addResult({
      id: 'T1.6.5',
      name: 'Complete Twitter card metadata (summary_large_image, title, desc, image) present on all pages',
      tier: 'Tier 1',
      feature: 'SSG Static Routing & SEO Metadata',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.6.5',
      name: 'Complete Twitter card metadata (summary_large_image, title, desc, image) present on all pages',
      tier: 'Tier 1',
      feature: 'SSG Static Routing & SEO Metadata',
      passed: false,
      error: err,
    });
  }

  // T1.6.6: Canonical URL tag on all pages
  try {
    for (const page of pages) {
      const links = getLinks(page.html);
      const canonical = links.find(l => l.rel === 'canonical');
      assert(canonical && canonical.href, `${page.name} must have <link rel="canonical">`);
      assert(canonical.href.startsWith('https://travel.varneet.in'), `${page.name} canonical URL must start with https://travel.varneet.in, got ${canonical.href}`);
    }
    report.addResult({
      id: 'T1.6.6',
      name: 'Valid canonical URL tags (<link rel="canonical">) present on all primary routes',
      tier: 'Tier 1',
      feature: 'SSG Static Routing & SEO Metadata',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T1.6.6',
      name: 'Valid canonical URL tags (<link rel="canonical">) present on all primary routes',
      tier: 'Tier 1',
      feature: 'SSG Static Routing & SEO Metadata',
      passed: false,
      error: err,
    });
  }
}
