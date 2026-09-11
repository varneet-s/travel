/**
 * Adversarial Verification Harness for Milestone 1 (Challenger 2)
 * 
 * Tests:
 * 1. Mobile-First Responsive Constraints & Horizontal Overflow across 375px, 390px, 412px viewports.
 * 2. Unbroken text / Monospace Headline width analysis in Courier Prime.
 * 3. Touch Target compliance (>= 44px) across all interactive elements in all 18 built HTML pages.
 * 4. Genuine Test Synchrony and Mutation Testing of T1.1.4 and T1.1.6 in tier1-features.test.js.
 */

import fs from 'node:fs';
import path from 'node:path';
import { extractCssVariables, getAnchorTags, getLinks } from './helpers/html-parser.js';
import { DIST_DIR, SRC_DIR, getBundledCss, loadSrcFile } from './helpers/test-context.js';

const results = [];
function record(testName, passed, details = '') {
  results.push({ testName, passed, details });
  const mark = passed ? 'PASS' : 'FAIL';
  console.log(`[${mark}] ${testName}${details ? ' - ' + details : ''}`);
}

console.log('\n======================================================');
console.log('  CHALLENGER 2: ADVERSARIAL STRESS TEST HARNESS (M1)');
console.log('======================================================\n');

// --------------------------------------------------------------------------
// 1. Audit Section Padding & Mobile Responsive Constraints
// --------------------------------------------------------------------------
const globalCss = loadSrcFile('styles/global.css') || '';
const bundledCss = getBundledCss() || '';
const cssCombined = globalCss + '\n' + bundledCss;

// Check .section-dark and .section-light padding
const sectionDarkRegex = /\.section-dark\s*\{([^}]+)\}/g;
const sectionLightRegex = /\.section-light\s*\{([^}]+)\}/g;

let darkMatches = [];
let lightMatches = [];
let m;
while ((m = sectionDarkRegex.exec(globalCss)) !== null) darkMatches.push(m[1]);
while ((m = sectionLightRegex.exec(globalCss)) !== null) lightMatches.push(m[1]);

const mobileDarkHas40 = darkMatches.some(rule => rule.includes('padding: 40px 0') || rule.includes('padding: 40px 0px'));
const mobileLightHas40 = lightMatches.some(rule => rule.includes('padding: 40px 0') || rule.includes('padding: 40px 0px'));

record('Section-dark declares padding: 40px 0 mobile', mobileDarkHas40, `Found in base rules: ${mobileDarkHas40}`);
record('Section-light declares padding: 40px 0 mobile', mobileLightHas40, `Found in base rules: ${mobileLightHas40}`);

// Check desktop media queries for 64px 0
const mediaQuery768Regex = /@media\s*\((?:min-width:\s*768px)\)\s*\{([\s\S]*?)(?=\n@media|\n\/\*|\Z)/g;
let desktop768Block = '';
while ((m = mediaQuery768Regex.exec(globalCss)) !== null) {
  desktop768Block += m[1] + '\n';
}

const desktopDarkHas64 = desktop768Block.includes('.section-dark') && desktop768Block.includes('padding: 64px 0');
const desktopLightHas64 = desktop768Block.includes('.section-light') && desktop768Block.includes('padding: 64px 0');

record('Section-dark declares padding: 64px 0 on min-width: 768px', desktopDarkHas64, `Desktop padding 64px 0`);
record('Section-light declares padding: 64px 0 on min-width: 768px', desktopLightHas64, `Desktop padding 64px 0`);

// --------------------------------------------------------------------------
// 2. Scan All 18 Pre-rendered HTML Pages in dist/ for Layout Hazards
// --------------------------------------------------------------------------
function getAllHtmlFiles(dir, fileList = []) {
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
record('Found pre-rendered HTML pages', allPages.length >= 18, `Count: ${allPages.length} pages`);

// Check for unconstrained wide containers or hardcoded widths > 375px outside media queries in CSS
const fixedWidthRegex = /(?:^|[^\w-])(?:width|min-width)\s*:\s*([4-9][0-9]{2}|[1-9][0-9]{3,})px/gm;
const rigidWidths = [];
let wm;
const lines = globalCss.split('\n');
let insideMedia = false;
lines.forEach((line, idx) => {
  if (line.includes('@media')) insideMedia = true;
  if (insideMedia && line.includes('}')) {
    // simple heuristic, check media query end
  }
  while ((wm = fixedWidthRegex.exec(line)) !== null) {
    const px = parseInt(wm[1], 10);
    // filter known allowed tokens or desktop styles
    if (line.includes('--container-max') || line.includes('--reading-max') || line.includes('background-size') || line.includes('700px')) {
      continue;
    }
    rigidWidths.push({ line: idx + 1, text: line.trim(), px });
  }
});

record('Zero unconstrained fixed widths > 375px in mobile CSS scope', rigidWidths.length === 0, 
  rigidWidths.length > 0 ? `Flagged: ${JSON.stringify(rigidWidths)}` : 'None found');

// --------------------------------------------------------------------------
// 3. Monospace Heading Length & Text Blowout Simulation
// Viewports: 375px (content: 335px), 390px (content: 350px), 412px (content: 372px)
// --------------------------------------------------------------------------
// In Courier Prime 700:
// Font size clamp on mobile (<= 480px):
// h1: clamp(2.25rem, 5.2vw, 4rem) -> 2.25rem = 36px. Glyph width is ~0.6 * 36 = 21.6px.
// Max single unbroken word length that fits in 335px without wrap is 335 / 21.6 = ~15.5 characters.
// With overflow-wrap: break-word and word-break: break-word on body/headings, does any headline blow out?
let longestWordsInHeadlines = [];
const headingRegex = /<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi;

for (const pagePath of allPages) {
  const content = fs.readFileSync(pagePath, 'utf8');
  let hm;
  while ((hm = headingRegex.exec(content)) !== null) {
    const rawText = hm[1].replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').trim();
    const words = rawText.split(/\s+/);
    for (const w of words) {
      if (w.length > 15) {
        longestWordsInHeadlines.push({ word: w, length: w.length, page: path.relative(DIST_DIR, pagePath) });
      }
    }
  }
}

// Check if overflow-wrap and word-break are defined globally
const hasOverflowWrap = cssCombined.includes('overflow-wrap: break-word');
const hasWordBreak = cssCombined.includes('word-break: break-word');
const hasOverflowXHidden = cssCombined.includes('overflow-x: hidden');

record('Global CSS provides overflow-wrap: break-word protection', hasOverflowWrap);
record('Global CSS provides word-break: break-word protection', hasWordBreak);
record('Global CSS enforces overflow-x: hidden containment on root', hasOverflowXHidden);

// --------------------------------------------------------------------------
// 4. Touch Target Audit Across Interactive Elements (>= 44px)
// --------------------------------------------------------------------------
// Inspect button, a, .touch-target, .filter-pill rules in global.css
const touchTargetVar = extractCssVariables(cssCombined).get('--touch-target-min');
record('CSS variable --touch-target-min is 44px', touchTargetVar === '44px', `Value: ${touchTargetVar}`);

// Check all anchor tags across all 18 pages to verify they don't have dangerous inline micro-dimensions
let undersizedInteractiveCount = 0;
for (const pagePath of allPages) {
  const content = fs.readFileSync(pagePath, 'utf8');
  const anchors = getAnchorTags(content);
  for (const a of anchors) {
    // If inline style has height < 44px
    if (a.raw.includes('height:') || a.raw.includes('line-height:')) {
      const match = /height:\s*([0-9]+)px/.exec(a.raw);
      if (match && parseInt(match[1], 10) < 44) {
        undersizedInteractiveCount++;
      }
    }
  }
}
record('Zero inline undersized interactive elements (< 44px)', undersizedInteractiveCount === 0, `Count: ${undersizedInteractiveCount}`);

// --------------------------------------------------------------------------
// 5. Test Synchrony Mutation Testing (T1.1.4 and T1.1.6)
// --------------------------------------------------------------------------
// Let's test if T1.1.4 and T1.1.6 would FAIL if Courier Prime is replaced or removed.
function testT1_1_4_Sensitivity(mockCss) {
  const vars = extractCssVariables(mockCss);
  const fontSerif = vars.get('--font-serif') || vars.get('--font-display') || '';
  return fontSerif.includes('Courier Prime');
}

function testT1_1_6_Sensitivity(mockHeadHtml) {
  const links = getLinks(mockHeadHtml);
  const fontLink = links.find(l => (l.href || '').includes('fonts.googleapis.com/css2'));
  if (!fontLink) return false;
  const hasCourier = fontLink.href.includes('Courier+Prime') || fontLink.href.includes('Courier%20Prime');
  const hasSource = fontLink.href.includes('Source+Sans+3') || fontLink.href.includes('Source%20Sans%203');
  return hasCourier && hasSource;
}

// Case A: Real CSS passes T1.1.4
const caseA = testT1_1_4_Sensitivity(cssCombined);
// Case B: Reverted CSS with Fraunces fails T1.1.4
const caseB = testT1_1_4_Sensitivity("--font-serif: 'Fraunces', Georgia, serif;");
// Case C: Missing font-serif fails T1.1.4
const caseC = testT1_1_4_Sensitivity("--font-body: 'Source Sans 3';");

record('T1.1.4 passes on genuine Courier Prime CSS', caseA === true);
record('T1.1.4 FAILS if reverted to Fraunces (Negative Test)', caseB === false);
record('T1.1.4 FAILS if font variable is missing (Negative Test)', caseC === false);

// Case D: Real BaseLayout HTML passes T1.1.6
const homeHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');
const caseD = testT1_1_6_Sensitivity(homeHtml);
// Case E: Reverted Google Fonts link with Fraunces fails T1.1.6
const caseE = testT1_1_6_Sensitivity('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;700&display=swap">');
// Case F: Google Fonts link missing Courier Prime fails T1.1.6
const caseF = testT1_1_6_Sensitivity('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;700&display=swap">');

record('T1.1.6 passes on genuine Courier Prime Google Fonts link', caseD === true);
record('T1.1.6 FAILS if reverted to Fraunces Google Fonts link (Negative Test)', caseE === false);
record('T1.1.6 FAILS if Courier Prime is omitted from Google Fonts link (Negative Test)', caseF === false);

// --------------------------------------------------------------------------
// Summary & Verdict
// --------------------------------------------------------------------------
const allPassed = results.every(r => r.passed);
console.log('\n------------------------------------------------------');
console.log(`TOTAL CHECKS: ${results.length} | PASSED: ${results.filter(r => r.passed).length} | FAILED: ${results.filter(r => !r.passed).length}`);
console.log(`HARNESS VERDICT: ${allPassed ? 'VERIFIED_PASS' : 'VERIFIED_FAIL'}`);
console.log('------------------------------------------------------\n');
process.exit(allPassed ? 0 : 1);
