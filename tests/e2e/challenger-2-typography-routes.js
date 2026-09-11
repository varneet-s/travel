/**
 * Empirical Verification & Adversarial Challenge Suite
 * Challenger 2: Typography, Google Fonts Loading, Route Integrity & Leaflet Map
 * 
 * Execution:
 *   node tests/e2e/challenger-2-typography-routes.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

let passedTests = 0;
let failedTests = 0;
const testResults = [];

function assert(condition, testId, description, details = '') {
  const status = condition ? 'PASS' : 'FAIL';
  if (condition) {
    passedTests++;
    console.log(`  ✓ [${testId}] ${description}${details ? ' (' + details + ')' : ''}`);
  } else {
    failedTests++;
    console.error(`  ✗ [${testId}] ${description}${details ? ' - ' + details : ''}`);
  }
  testResults.push({ id: testId, description, passed: Boolean(condition), details });
  return Boolean(condition);
}

// Helper: load file text
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    return null;
  }
}

// Helper: find all HTML files
function getHtmlFiles(dir) {
  const results = [];
  function recurse(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        recurse(full);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        results.push(full);
      }
    }
  }
  recurse(dir);
  return results;
}

// Main verification runner
async function runVerification() {
  console.log('================================================================');
  console.log('  CHALLENGER 2: ADVERSARIAL TYPOGRAPHY & ROUTE INTEGRITY SUITE');
  console.log('================================================================\n');

  // ============================================================================
  // SECTION 1: Google Fonts Endpoint & Typography System
  // ============================================================================
  console.log('--- SECTION 1: Google Fonts & Typography System ---');

  const baseLayoutPath = path.join(SRC_DIR, 'layouts', 'BaseLayout.astro');
  const baseLayoutContent = readFile(baseLayoutPath);
  assert(Boolean(baseLayoutContent), 'T1.1', 'BaseLayout.astro exists and is readable');

  // Check preconnect links
  const hasPreconnectGoogle = baseLayoutContent.includes('rel="preconnect" href="https://fonts.googleapis.com"');
  const hasPreconnectGstatic = baseLayoutContent.includes('rel="preconnect" href="https://fonts.gstatic.com" crossorigin');
  assert(hasPreconnectGoogle && hasPreconnectGstatic, 'T1.2', 'Google Fonts preconnect tags exist with crossorigin on gstatic');

  // Extract Google Fonts stylesheet href
  const fontLinkMatch = baseLayoutContent.match(/<link\s+[^>]*href=["'](https:\/\/fonts\.googleapis\.com\/css2\?[^"']+)["'][^>]*>/i);
  const fontHref = fontLinkMatch ? fontLinkMatch[1] : null;
  assert(Boolean(fontHref), 'T1.3', 'Google Fonts stylesheet <link> tag found in BaseLayout.astro', fontHref || 'NONE');

  if (fontHref) {
    // Check family parameters in URL
    const hasCourierPrime = fontHref.includes('family=Courier+Prime');
    const hasNewsreader = fontHref.includes('family=Newsreader');
    const hasSourceSans3 = fontHref.includes('family=Source+Sans+3');
    const hasDisplaySwap = fontHref.includes('display=swap');

    assert(hasCourierPrime, 'T1.4', 'Google Fonts URL requests Courier Prime family');
    assert(hasNewsreader, 'T1.5', 'Google Fonts URL requests Newsreader family');
    assert(hasSourceSans3, 'T1.6', 'Google Fonts URL requests Source Sans 3 family');
    assert(hasDisplaySwap, 'T1.7', 'Google Fonts URL requests display=swap for performance');

    // Live HTTP GET request to verify Google Fonts API responds 200 with @font-face rules
    try {
      const resp = await fetch(fontHref, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
      });
      assert(resp.status === 200, 'T1.8', 'Google Fonts endpoint returns HTTP 200 OK', `Status: ${resp.status}`);
      const cssText = await resp.text();
      const hasCourierFace = cssText.includes("font-family: 'Courier Prime'");
      const hasNewsreaderFace = cssText.includes("font-family: 'Newsreader'");
      const hasSourceSansFace = cssText.includes("font-family: 'Source Sans 3'");
      assert(hasCourierFace && hasNewsreaderFace && hasSourceSansFace, 'T1.9', 'Google Fonts response contains @font-face for all 3 families',
        `Courier: ${hasCourierFace}, Newsreader: ${hasNewsreaderFace}, SourceSans3: ${hasSourceSansFace}`);
    } catch (networkErr) {
      assert(false, 'T1.8', 'Google Fonts network fetch succeeded', networkErr.message);
    }
  }

  // Check CSS font variables in global.css
  const globalCssPath = path.join(SRC_DIR, 'styles', 'global.css');
  const globalCss = readFile(globalCssPath);
  assert(Boolean(globalCss), 'T1.10', 'src/styles/global.css exists and is readable');

  const serifHasNewsreader = /--font-serif:\s*['"]Newsreader['"]/i.test(globalCss);
  const headingHasNewsreader = /--font-heading:\s*['"]Newsreader['"]/i.test(globalCss);
  const displayHasCourier = /--font-display:\s*['"]Courier Prime['"]/i.test(globalCss);
  const sansHasSourceSans = /--font-sans:\s*['"]Source Sans 3['"]/i.test(globalCss);
  const bodyHasSourceSans = /--font-body:\s*['"]Source Sans 3['"]/i.test(globalCss);
  const monoHasCourier = /--font-mono:\s*['"]Courier Prime['"]/i.test(globalCss);

  assert(serifHasNewsreader, 'T1.11', '--font-serif assigns Newsreader as primary serif font');
  assert(headingHasNewsreader, 'T1.12', '--font-heading assigns Newsreader for editorial titles');
  assert(displayHasCourier, 'T1.13', '--font-display assigns Courier Prime for wordmark and display');
  assert(sansHasSourceSans, 'T1.14', '--font-sans assigns Source Sans 3 for UI');
  assert(bodyHasSourceSans, 'T1.15', '--font-body assigns Source Sans 3 for prose reading');
  assert(monoHasCourier, 'T1.16', '--font-mono assigns Courier Prime for technical notes');

  // Verify Fraunces is completely absent
  const frauncesMatchesInCss = (globalCss.match(/Fraunces/gi) || []).length;
  assert(frauncesMatchesInCss === 0, 'T1.17', 'Zero occurrences of legacy "Fraunces" font in global.css', `Found: ${frauncesMatchesInCss}`);

  // ============================================================================
  // SECTION 2: All 18 Pages in dist/ Compilation, HTML Structure & Navigation
  // ============================================================================
  console.log('\n--- SECTION 2: All 18 Pages in dist/ & Navigation Integrity ---');

  const expected18Pages = [
    'index.html',
    'about/index.html',
    'reading/index.html',
    'journal/index.html',
    'journal/banaras-ghats/index.html',
    'journal/bir-billing/index.html',
    'journal/chitkul-kinnaur/index.html',
    'journal/gokarna-2023/index.html',
    'journal/jibhi-nye-gang/index.html',
    'journal/jibhi-seraj-2023/index.html',
    'journal/jibhi-trip-leader/index.html',
    'journal/lucknow-heritage/index.html',
    'journal/manali-sissu-winter/index.html',
    'journal/manali-spring-thaw/index.html',
    'journal/nye-bir-2026/index.html',
    'journal/rajasthan-roadtrip/index.html',
    'journal/shangarh-meadows/index.html',
    'journal/shoja-jalori/index.html'
  ];

  let missingPages = 0;
  for (const pageRel of expected18Pages) {
    const fullPath = path.join(DIST_DIR, pageRel);
    const exists = fs.existsSync(fullPath);
    if (!exists) missingPages++;
  }
  assert(missingPages === 0, 'T2.1', 'All 18 expected core and expedition pages exist in dist/', `Missing: ${missingPages}`);

  // Adversarially audit every one of the 18 pages
  let allPagesHaveValidDocType = true;
  let allPagesHaveRootTags = true;
  let allPagesHaveTitles = true;
  let allPagesHaveViewport = true;
  let allPagesHaveCanonical = true;
  let brokenInternalLinks = [];
  let unclosedTagsPages = [];
  let insecureBlankLinks = [];

  for (const pageRel of expected18Pages) {
    const fullPath = path.join(DIST_DIR, pageRel);
    const content = readFile(fullPath);
    if (!content) continue;

    // Doctype check
    if (!content.toLowerCase().startsWith('<!doctype html>')) {
      allPagesHaveValidDocType = false;
    }

    // Root tags
    const hasHtml = content.includes('<html') && content.includes('</html>');
    const hasHead = content.includes('<head') && content.includes('</head>');
    const hasBody = content.includes('<body') && content.includes('</body>');
    if (!hasHtml || !hasHead || !hasBody) {
      allPagesHaveRootTags = false;
    }

    // Title check
    const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
    if (!titleMatch || !titleMatch[1].trim() || titleMatch[1].includes('undefined') || titleMatch[1].includes('null')) {
      allPagesHaveTitles = false;
      console.error(`Missing or corrupt title on ${pageRel}: ${titleMatch ? titleMatch[1] : 'NONE'}`);
    }

    // Viewport check
    if (!content.includes('name="viewport"') || !content.includes('width=device-width')) {
      allPagesHaveViewport = false;
    }

    // Canonical link check
    if (!/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/travel\.varneet\.in[^"']+["']/i.test(content)) {
      allPagesHaveCanonical = false;
      console.error(`Invalid canonical URL on ${pageRel}`);
    }

    // Navigation links audit
    const linkRegex = /<a\s+([^>]+)>/gi;
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      const attrs = match[1];
      const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
      if (!hrefMatch) continue;
      const href = hrefMatch[1].trim();

      // Check external target="_blank" safety
      if (href.startsWith('http://') || href.startsWith('https://')) {
        const isBlank = /target=["']_blank["']/i.test(attrs);
        const hasNoopener = /rel=["'][^"']*noopener[^"']*["']/i.test(attrs);
        const hasNoreferrer = /rel=["'][^"']*noreferrer[^"']*["']/i.test(attrs);
        if (isBlank && (!hasNoopener || !hasNoreferrer)) {
          insecureBlankLinks.push({ page: pageRel, href });
        }
      }

      // Check internal links
      if (href.startsWith('/') && !href.startsWith('//')) {
        // Normalize path
        let targetRoute = href.split('?')[0].split('#')[0];
        if (targetRoute === '') targetRoute = '/';

        // Check if target file exists
        let targetFile;
        if (targetRoute.endsWith('.html') || targetRoute.endsWith('.svg') || targetRoute.endsWith('.png') || targetRoute.endsWith('.jpg') || targetRoute.endsWith('.xml')) {
          targetFile = path.join(DIST_DIR, targetRoute);
        } else if (targetRoute === '/') {
          targetFile = path.join(DIST_DIR, 'index.html');
        } else {
          // Check route/index.html or route.html
          targetFile = path.join(DIST_DIR, targetRoute, 'index.html');
          if (!fs.existsSync(targetFile)) {
            targetFile = path.join(DIST_DIR, `${targetRoute}.html`);
          }
        }

        // Special exception: redirects /contact and /volunteering are generated as directories with index.html in dist
        if (!fs.existsSync(targetFile)) {
          brokenInternalLinks.push({ page: pageRel, href, targetFile });
        }
      }
    }
  }

  assert(allPagesHaveValidDocType, 'T2.2', 'All 18 pages declare valid <!doctype html>');
  assert(allPagesHaveRootTags, 'T2.3', 'All 18 pages contain well-formed <html>, <head>, and <body> structures');
  assert(allPagesHaveTitles, 'T2.4', 'All 18 pages contain non-empty, valid <title> tags');
  assert(allPagesHaveViewport, 'T2.5', 'All 18 pages define responsive viewport meta tag');
  assert(allPagesHaveCanonical, 'T2.6', 'All 18 pages declare valid canonical URL tags');
  assert(insecureBlankLinks.length === 0, 'T2.7', 'Zero insecure target="_blank" links (all declare rel="noopener noreferrer")',
    `Violations: ${insecureBlankLinks.length}`);
  assert(brokenInternalLinks.length === 0, 'T2.8', 'Zero broken internal navigation links across all 18 pages',
    brokenInternalLinks.length > 0 ? JSON.stringify(brokenInternalLinks.slice(0, 3)) : 'Clean');

  // ============================================================================
  // SECTION 3: All 14 Journey Markdown Files & Detail Page Contracts
  // ============================================================================
  console.log('\n--- SECTION 3: 14 Journey Content Files & Return Links ---');

  const journalDir = path.join(SRC_DIR, 'content', 'journal');
  const markdownFiles = fs.readdirSync(journalDir).filter(f => f.endsWith('.md'));
  assert(markdownFiles.length === 14, 'T3.1', 'Exactly 14 markdown journey files exist in src/content/journal/', `Found: ${markdownFiles.length}`);

  let allMarkdownValid = true;
  let allDetailPagesExist = true;
  let allHaveReturnLinks = true;
  let allDetailTitlesMatch = true;

  for (const mdFile of markdownFiles) {
    const slug = path.basename(mdFile, '.md');
    const mdContent = readFile(path.join(journalDir, mdFile));

    // Check frontmatter
    const titleMatch = mdContent.match(/^title:\s*["']?([^"\n\r]+)["']?/m);
    const dateMatch = mdContent.match(/^date:\s*["']?([^"\n\r]+)["']?/m);
    const title = titleMatch ? titleMatch[1].trim() : null;

    if (!title || !dateMatch) {
      allMarkdownValid = false;
      console.error(`Invalid frontmatter in ${mdFile}`);
    }

    // Detail page in dist/journal/[slug]/index.html
    const detailPath = path.join(DIST_DIR, 'journal', slug, 'index.html');
    if (!fs.existsSync(detailPath)) {
      allDetailPagesExist = false;
      console.error(`Missing detail page for slug ${slug} at ${detailPath}`);
      continue;
    }

    const detailHtml = readFile(detailPath);
    // Check return link to /journal
    const hasReturnLink = detailHtml.includes('href="/journal"');
    if (!hasReturnLink) {
      allHaveReturnLinks = false;
      console.error(`Missing return link to /journal in ${detailPath}`);
    }

    // Check title presence
    if (title && !detailHtml.includes(title)) {
      allDetailTitlesMatch = false;
      console.error(`Detail page does not include journey title "${title}" in ${detailPath}`);
    }
  }

  assert(allMarkdownValid, 'T3.2', 'All 14 markdown files have valid title and date frontmatter');
  assert(allDetailPagesExist, 'T3.3', 'All 14 journey markdown files have pre-rendered detail pages at /journal/[slug]');
  assert(allHaveReturnLinks, 'T3.4', 'All 14 journey detail pages provide valid return links to /journal');
  assert(allDetailTitlesMatch, 'T3.5', 'All 14 journey detail pages render their authentic markdown journey titles');

  // ============================================================================
  // SECTION 4: Leaflet Map Container & 14 Journey Pins Verification
  // ============================================================================
  console.log('\n--- SECTION 4: Leaflet Map Container & Pins Verification ---');

  const homeHtmlPath = path.join(DIST_DIR, 'index.html');
  const homeHtml = readFile(homeHtmlPath);

  // Check map container element
  const hasMapContainer = homeHtml.includes('id="travelWorldMap"');
  const hasMapWrapper = homeHtml.includes('class="map-wrapper');
  assert(hasMapContainer && hasMapWrapper, 'T4.1', 'Leaflet map container (#travelWorldMap) and wrapper exist in dist/index.html');

  // Check Leaflet CDN assets
  const hasLeafletCss = homeHtml.includes('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
  const hasLeafletJs = homeHtml.includes('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
  assert(hasLeafletCss && hasLeafletJs, 'T4.2', 'Leaflet 1.9.4 CSS and JS CDN assets loaded in dist/index.html');

  // Check map gesture safety attributes
  const hasGestureBar = homeHtml.includes('class="map-gesture-bar');
  const hasGestureInstruction = homeHtml.includes('Use 2 fingers on touchscreen/touchpad to zoom');
  assert(hasGestureBar && hasGestureInstruction, 'T4.3', 'Map gesture instruction bar exists and guides mobile users');

  // Check pin popup / active pin card container
  const hasActivePinCard = homeHtml.includes('id="activePinCard"');
  const hasPinCardImg = homeHtml.includes('id="pinCardImg"');
  const hasPinCardTitle = homeHtml.includes('id="pinCardTitle"');
  const hasPinCardLink = homeHtml.includes('id="pinCardLink"');
  const hasClosePinCard = homeHtml.includes('id="closePinCard"');
  assert(hasActivePinCard && hasPinCardImg && hasPinCardTitle && hasPinCardLink && hasClosePinCard, 'T4.4',
    'Interactive pin detail card elements exist in DOM');

  // Check TravelMap.astro component source for pin dataset integrity
  const travelMapSrcPath = path.join(SRC_DIR, 'components', 'TravelMap.astro');
  const travelMapSrc = readFile(travelMapSrcPath);

  // Check journeyPins dataset
  const journeyPinsMatch = travelMapSrc.match(/const\s+journeyPins\s*=\s*(\[[\s\S]*?\]);/);
  assert(Boolean(journeyPinsMatch), 'T4.5', 'journeyPins dataset found in TravelMap.astro');

  if (journeyPinsMatch) {
    let pins = [];
    try {
      // Evaluate pin array safely
      const pinsEvaluator = new Function(`return ${journeyPinsMatch[1]}`);
      pins = pinsEvaluator();
    } catch (parseErr) {
      console.error('Failed to parse journeyPins:', parseErr.message);
    }

    assert(pins.length === 14, 'T4.6', 'journeyPins array contains exactly 14 pin records', `Count: ${pins.length}`);

    let allCoordsValid = true;
    let allSlugsMatchMarkdown = true;
    let allCoversExist = true;

    for (const pin of pins) {
      // Lat / lng validation (India subcontinent bounding box)
      const validLat = typeof pin.lat === 'number' && pin.lat >= 8.0 && pin.lat <= 36.0;
      const validLng = typeof pin.lng === 'number' && pin.lng >= 68.0 && pin.lng <= 97.0;
      if (!validLat || !validLng) {
        allCoordsValid = false;
        console.error(`Invalid coordinates for pin ${pin.title}: lat=${pin.lat}, lng=${pin.lng}`);
      }

      // Slug corresponds to an existing markdown file in src/content/journal/
      const mdExists = fs.existsSync(path.join(SRC_DIR, 'content', 'journal', `${pin.slug}.md`));
      if (!mdExists) {
        allSlugsMatchMarkdown = false;
        console.error(`Pin slug ${pin.slug} does not match any markdown journey file`);
      }

      // Cover image exists in public/
      if (pin.cover) {
        const localImagePath = path.join(PUBLIC_DIR, pin.cover.replace(/^\//, ''));
        if (!fs.existsSync(localImagePath)) {
          allCoversExist = false;
          console.error(`Pin cover image missing: ${localImagePath}`);
        }
      }
    }

    assert(allCoordsValid, 'T4.7', 'All 14 pins have valid geographic coordinates within India bounds');
    assert(allSlugsMatchMarkdown, 'T4.8', 'All 14 pins link to valid journey detail slugs matching markdown content');
    assert(allCoversExist, 'T4.9', 'All 14 pin cover photographs physically exist in public/');
  }

  // Check map initialization options
  const hasScrollWheelZoomFalse = travelMapSrc.includes('scrollWheelZoom: false');
  const hasMobileTouchProtection = travelMapSrc.includes('isMobileTouch') && travelMapSrc.includes('map.dragging.disable()');
  assert(hasScrollWheelZoomFalse, 'T4.10', 'Leaflet map disables mouse scrollWheelZoom to prevent vertical scroll hijack');
  assert(hasMobileTouchProtection, 'T4.11', 'Leaflet map implements single-finger mobile gesture safety');

  // ============================================================================
  // SECTION 5: Extended Adversarial Stress Testing
  // ============================================================================
  console.log('\n--- SECTION 5: Extended Adversarial Stress Testing ---');

  // 5.1 Image asset existence across all 18 pages
  let missingImages = [];
  for (const pageRel of expected18Pages) {
    const fullPath = path.join(DIST_DIR, pageRel);
    const content = readFile(fullPath);
    if (!content) continue;

    const imgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      const src = match[1];
      if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
        continue;
      }
      // Local image
      const cleanSrc = src.split('?')[0].split('#')[0].replace(/^\//, '');
      const distImgPath = path.join(DIST_DIR, cleanSrc);
      const publicImgPath = path.join(PUBLIC_DIR, cleanSrc);
      if (!fs.existsSync(distImgPath) && !fs.existsSync(publicImgPath)) {
        missingImages.push({ page: pageRel, src });
      }
    }
  }
  assert(missingImages.length === 0, 'T5.1', 'All images referenced across all 18 pages physically exist on disk',
    missingImages.length > 0 ? JSON.stringify(missingImages.slice(0, 3)) : 'All images resolved');

  // 5.2 Unique descriptive page titles across all 18 pages
  const titles = new Map();
  let duplicateTitles = [];
  for (const pageRel of expected18Pages) {
    const fullPath = path.join(DIST_DIR, pageRel);
    const content = readFile(fullPath);
    if (!content) continue;
    const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';
    if (titles.has(title)) {
      duplicateTitles.push({ title, page1: titles.get(title), page2: pageRel });
    } else {
      titles.set(title, pageRel);
    }
  }
  assert(duplicateTitles.length === 0, 'T5.2', 'All 18 pages declare distinct, unique page titles',
    duplicateTitles.length > 0 ? JSON.stringify(duplicateTitles) : `Unique count: ${titles.size}`);

  // 5.3 Duplicate element IDs on any individual page
  let pagesWithDuplicateIds = [];
  for (const pageRel of expected18Pages) {
    const fullPath = path.join(DIST_DIR, pageRel);
    const content = readFile(fullPath);
    if (!content) continue;

    const idRegex = /\sid=["']([^"']+)["']/gi;
    const ids = new Set();
    const dups = [];
    let match;
    while ((match = idRegex.exec(content)) !== null) {
      const id = match[1];
      if (ids.has(id)) {
        dups.push(id);
      } else {
        ids.add(id);
      }
    }
    if (dups.length > 0) {
      pagesWithDuplicateIds.push({ page: pageRel, duplicates: dups });
    }
  }
  assert(pagesWithDuplicateIds.length === 0, 'T5.3', 'Zero duplicate element IDs on any page',
    pagesWithDuplicateIds.length > 0 ? JSON.stringify(pagesWithDuplicateIds) : 'All page IDs unique');

  // 5.4 Multi-User-Agent Google Fonts Accessibility Stress Test
  const userAgents = [
    { name: 'Chrome MacOS', ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36' },
    { name: 'Safari iOS', ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1' },
    { name: 'Firefox Linux', ua: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0' }
  ];

  let multiUaSuccess = true;
  for (const agent of userAgents) {
    try {
      const r = await fetch(fontHref, { headers: { 'User-Agent': agent.ua } });
      if (r.status !== 200) multiUaSuccess = false;
    } catch (e) {
      multiUaSuccess = false;
    }
  }
  assert(multiUaSuccess, 'T5.4', 'Google Fonts endpoint returns 200 across Chrome, Safari iOS, and Firefox');

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log('\n================================================================');
  console.log(`  VERIFICATION COMPLETE: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log(`  VERDICT: ${failedTests === 0 ? 'APPROVE' : 'REJECT'}`);
  console.log('================================================================\n');

  return { passed: passedTests, failed: failedTests, verdict: failedTests === 0 ? 'APPROVE' : 'REJECT' };
}

runVerification().then((result) => {
  process.exit(result.failed > 0 ? 1 : 0);
}).catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
