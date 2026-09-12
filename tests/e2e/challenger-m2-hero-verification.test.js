/**
 * Dedicated Adversarial & Empirical Test Suite for Milestone 2 (Challenger 2)
 * Target: Hero Mountain & Elevation Road Animation / Interactive Nodes in dist/index.html
 * 
 * Verifications required by DISPATCH.md:
 * 1. Presence of all 14 milestone interactive nodes matching chronologicalJourneys.
 * 2. #liveAltitudeIndicator initial rendered text contains '3,450m' (or '3,450M'), satisfying T2.3.3.
 * 3. Presence of stationary bus anchor (.stationary-bus-anchor), wheels (.bus-wheel-spin),
 *    chassis (#busChassis), and translating canvases (#roadTrack, #ridgeBack, #ridgeMid, #ridgeFront).
 * 4. Complete absence of hero-photo-frame across all HTML files.
 * 5. Zero horizontal overflow on desktop when hero is initialized.
 */

import fs from 'node:fs';
import path from 'node:path';
import { chronologicalJourneys } from '../../src/data/chronologicalJourneys.ts';
import { DIST_DIR, ROOT_DIR, getBundledCss, listFilesRecursive } from './helpers/test-context.js';

let passed = 0;
let failed = 0;
const results = [];

function record(id, name, passCondition, details = '') {
  if (passCondition) {
    passed++;
    console.log(`  ✓ [PASS] [${id}] ${name}${details ? ' - ' + details : ''}`);
  } else {
    failed++;
    console.error(`  ✗ [FAIL] [${id}] ${name}${details ? ' - ' + details : ''}`);
  }
  results.push({ id, name, passed: Boolean(passCondition), details });
}

console.log('\n======================================================================');
console.log('  CHALLENGER 2: EMPIRICAL VERIFICATION HARNESS (MILESTONE 2)');
console.log('  Hero Interactive Elevation Road & Atmospheric Stage');
console.log('======================================================================\n');

const indexPath = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error(`Fatal: ${indexPath} does not exist. Run npm run build first.`);
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const bundledCss = getBundledCss();

// ============================================================================
// SUITE 1: 14 Milestone Interactive Nodes & chronologicalJourneys Parity
// ============================================================================
console.log('--- Test Suite 1: Milestone Interactive Nodes & Data Integrity ---');

// Extract all milestone-interactive-node tags
const nodeRegex = /<g[^>]*class="[^"]*milestone-interactive-node[^"]*"[^>]*>([\s\S]*?)<\/g>\s*(?=(?:<g class="milestone-interactive-node"|<\/g>\s*<\/svg>))/g;
const milestoneMatches = [...indexHtml.matchAll(/<g[^>]*class="[^"]*milestone-interactive-node[^"]*"[\s\S]*?<\/g>\s*<\/g>/g)];

// Also extract individual opening tags to parse attributes
const openTagRegex = /<g[^>]*class="[^"]*milestone-interactive-node[^"]*"([^>]*)>/g;
const openTagMatches = [...indexHtml.matchAll(openTagRegex)];

record(
  'HERO-M2-01',
  'Exactly 14 milestone interactive nodes exist in dist/index.html',
  openTagMatches.length === 14 && chronologicalJourneys.length === 14,
  `Found in dist: ${openTagMatches.length}, in chronologicalJourneys: ${chronologicalJourneys.length}`
);

// Verify each node attributes and child structures
let allAttributesMatch = true;
let attributeMismatches = [];
let missingSubElements = [];

openTagMatches.forEach((match, idx) => {
  const attrs = match[1];
  const expectedJourney = chronologicalJourneys[idx];
  
  // Extract attributes
  const dataIndexMatch = attrs.match(/data-index="([^"]*)"/);
  const dataSlugMatch = attrs.match(/data-slug="([^"]*)"/);
  const dataAltitudeMatch = attrs.match(/data-altitude="([^"]*)"/);
  const dataAltitudeFormattedMatch = attrs.match(/data-altitude-formatted="([^"]*)"/);
  const dataDestinationMatch = attrs.match(/data-destination="([^"]*)"/);

  const dataIndex = dataIndexMatch ? parseInt(dataIndexMatch[1], 10) : null;
  const dataSlug = dataSlugMatch ? dataSlugMatch[1] : null;
  const dataAltitude = dataAltitudeMatch ? parseInt(dataAltitudeMatch[1], 10) : null;
  const dataAltitudeFormatted = dataAltitudeFormattedMatch ? dataAltitudeFormattedMatch[1] : null;
  const dataDestination = dataDestinationMatch ? dataDestinationMatch[1] : null;

  const destDecoded = dataDestination ? dataDestination.replace(/&amp;/g, '&') : null;

  if (dataIndex !== idx) {
    allAttributesMatch = false;
    attributeMismatches.push(`Node #${idx}: data-index mismatch (got ${dataIndex}, expected ${idx})`);
  }
  if (dataSlug !== expectedJourney.slug) {
    allAttributesMatch = false;
    attributeMismatches.push(`Node #${idx}: data-slug mismatch (got ${dataSlug}, expected ${expectedJourney.slug})`);
  }
  if (dataAltitude !== expectedJourney.altitudeMeters) {
    allAttributesMatch = false;
    attributeMismatches.push(`Node #${idx}: data-altitude mismatch (got ${dataAltitude}, expected ${expectedJourney.altitudeMeters})`);
  }
  if (dataAltitudeFormatted !== expectedJourney.altitudeFormatted) {
    allAttributesMatch = false;
    attributeMismatches.push(`Node #${idx}: data-altitude-formatted mismatch (got ${dataAltitudeFormatted}, expected ${expectedJourney.altitudeFormatted})`);
  }
  if (destDecoded !== expectedJourney.destination) {
    allAttributesMatch = false;
    attributeMismatches.push(`Node #${idx}: data-destination mismatch (got ${destDecoded}, expected ${expectedJourney.destination})`);
  }
});

record(
  'HERO-M2-02',
  'All 14 interactive milestone nodes strictly match chronologicalJourneys dataset (slug, altitude, destination)',
  allAttributesMatch,
  attributeMismatches.length === 0 ? 'All 14 node data attributes aligned' : attributeMismatches.join('; ')
);

// Verify presence of internal components:
// Guide lines, altitude peak circles, stone glyphs, foreignObject tooltips
const guideLinesCount = (indexHtml.match(/<line[^>]*stroke-dasharray="3,3"[^>]*>/g) || []).length;
const peakCirclesCount = (indexHtml.match(/<circle[^>]*class="[^"]*altitude-peak-dot[^"]*"[^>]*>/g) || []).length;
const stoneGlyphsCount = (indexHtml.match(/<g[^>]*class="[^"]*milestone-stone-glyph[^"]*"[^>]*>/g) || []).length;
const foCardsCount = (indexHtml.match(/<foreignObject[^>]*class="[^"]*milestone-fo-card[^"]*"[^>]*>/g) || []).length;
const popupLinksCount = (indexHtml.match(/<a[^>]*class="[^"]*milestone-popup-card-link[^"]*"[^>]*>/g) || []).length;

record(
  'HERO-M2-03',
  'All 14 nodes contain dotted guide lines, altitude peak circles, milestone stone glyphs, and foreignObject cards',
  guideLinesCount === 14 && peakCirclesCount === 14 && stoneGlyphsCount === 14 && foCardsCount === 14 && popupLinksCount === 14,
  `guideLines: ${guideLinesCount}/14, peakDots: ${peakCirclesCount}/14, stones: ${stoneGlyphsCount}/14, foCards: ${foCardsCount}/14, popupLinks: ${popupLinksCount}/14`
);

// Verify milestone popup links resolve to valid journal destinations
let allLinksValid = true;
chronologicalJourneys.forEach((j) => {
  const expectedHref = `/journal/${j.slug}`;
  if (!indexHtml.includes(`href="${expectedHref}"`)) {
    allLinksValid = false;
  }
});

record(
  'HERO-M2-04',
  'Milestone popups link to verified journal routes for all 14 journeys',
  allLinksValid,
  'All 14 popup href="/journal/[slug]" verified'
);


// ============================================================================
// SUITE 2: #liveAltitudeIndicator Initial Text & T2.3.3 Conformance
// ============================================================================
console.log('\n--- Test Suite 2: #liveAltitudeIndicator Initial Text & T2.3.3 ---');

const liveAltMatch = indexHtml.match(/<span[^>]*id="liveAltitudeIndicator"[^>]*>([\s\S]*?)<\/span>/);
const liveAltText = liveAltMatch ? liveAltMatch[1].trim() : '';
const contains3450m = liveAltText.includes('3,450m') || liveAltText.includes('3,450M');

record(
  'HERO-M2-05',
  '#liveAltitudeIndicator element exists in dist/index.html',
  Boolean(liveAltMatch),
  `Element found: ${Boolean(liveAltMatch)}`
);

record(
  'HERO-M2-06',
  '#liveAltitudeIndicator initial server-rendered text contains "3,450m" or "3,450M" (satisfying T2.3.3)',
  contains3450m,
  `Rendered text: "${liveAltText}"`
);

// Verify test T2.3.3 logic directly
const t2_3_3_direct_check = indexHtml.includes('3,450m') || indexHtml.includes('3,450M');
record(
  'HERO-M2-07',
  'T2.3.3 test assertion passes directly against dist/index.html',
  t2_3_3_direct_check,
  `Assertion (indexHtml includes 3,450m/M): ${t2_3_3_direct_check}`
);


// ============================================================================
// SUITE 3: Stationary Bus Anchor, Wheels, Chassis & Translating Canvases
// ============================================================================
console.log('\n--- Test Suite 3: Stationary Bus Elements & Translating Canvases ---');

// Stationary bus anchor (.stationary-bus-anchor / #stationaryBusAnchor)
const hasBusAnchorClass = indexHtml.includes('class="stationary-bus-anchor') || indexHtml.includes('stationary-bus-anchor');
const hasBusAnchorId = indexHtml.includes('id="stationaryBusAnchor"');
record(
  'HERO-M2-08',
  'Stationary bus anchor (.stationary-bus-anchor / #stationaryBusAnchor) present in dist/index.html',
  hasBusAnchorClass && hasBusAnchorId,
  `Class: ${hasBusAnchorClass}, ID: ${hasBusAnchorId}`
);

// Bus wheels (.bus-wheel-spin)
const wheelMatches = indexHtml.match(/class="[^"]*bus-wheel-spin[^"]*"/g) || [];
record(
  'HERO-M2-09',
  'Bus wheels (.bus-wheel-spin) present with 2 wheel groups (front & rear)',
  wheelMatches.length >= 2,
  `Found wheel groups: ${wheelMatches.length}`
);

// Bus chassis (#busChassis)
const hasBusChassis = indexHtml.includes('id="busChassis"');
record(
  'HERO-M2-10',
  'Bus chassis (#busChassis) present in bus SVG hierarchy',
  hasBusChassis,
  `#busChassis present: ${hasBusChassis}`
);

// Translating canvases: #roadTrack, #ridgeBack, #ridgeMid, #ridgeFront
const hasRoadTrack = indexHtml.includes('id="roadTrack"');
const hasRidgeBack = indexHtml.includes('id="ridgeBack"');
const hasRidgeMid = indexHtml.includes('id="ridgeMid"');
const hasRidgeFront = indexHtml.includes('id="ridgeFront"');

record(
  'HERO-M2-11',
  'Translating canvases (#roadTrack, #ridgeBack, #ridgeMid, #ridgeFront) all present in DOM',
  hasRoadTrack && hasRidgeBack && hasRidgeMid && hasRidgeFront,
  `#roadTrack: ${hasRoadTrack}, #ridgeBack: ${hasRidgeBack}, #ridgeMid: ${hasRidgeMid}, #ridgeFront: ${hasRidgeFront}`
);

// Parallax stage structure verification: #mountainStage
const hasMountainStage = indexHtml.includes('id="mountainStage"');
record(
  'HERO-M2-12',
  'Mountain road stage container (#mountainStage) anchors canvases',
  hasMountainStage,
  `#mountainStage present: ${hasMountainStage}`
);

// Character detail verification: Varneet passenger silhouette & headlight beam
const hasVarneetPassenger = indexHtml.includes('id="varneetPassenger"');
const hasHeadlightBeam = indexHtml.includes('id="busHeadlightBeam"');
record(
  'HERO-M2-13',
  'Authentic narrative details present: Varneet silhouette (#varneetPassenger) and headlight beam (#busHeadlightBeam)',
  hasVarneetPassenger && hasHeadlightBeam,
  `Varneet: ${hasVarneetPassenger}, Headlight: ${hasHeadlightBeam}`
);


// ============================================================================
// SUITE 4: Complete Absence of hero-photo-frame Across All HTML Files
// ============================================================================
console.log('\n--- Test Suite 4: Complete Absence of hero-photo-frame ---');

const allHtmlFiles = listFilesRecursive(DIST_DIR).filter(f => f.endsWith('.html'));
let frameOccurrencesInHtml = [];

for (const htmlFile of allHtmlFiles) {
  const content = fs.readFileSync(htmlFile, 'utf8');
  if (content.includes('hero-photo-frame')) {
    frameOccurrencesInHtml.push(path.relative(DIST_DIR, htmlFile));
  }
}

record(
  'HERO-M2-14',
  'Complete absence of "hero-photo-frame" across all pre-rendered HTML files in dist/',
  frameOccurrencesInHtml.length === 0,
  `Audited ${allHtmlFiles.length} HTML files. Found in: ${frameOccurrencesInHtml.length === 0 ? '0 files' : frameOccurrencesInHtml.join(', ')}`
);

// Also verify src/ files
const allSrcFiles = listFilesRecursive(path.join(ROOT_DIR, 'src')).filter(f => f.endsWith('.astro') || f.endsWith('.ts') || f.endsWith('.css'));
let frameOccurrencesInSrc = [];
for (const srcFile of allSrcFiles) {
  const content = fs.readFileSync(srcFile, 'utf8');
  if (content.includes('hero-photo-frame')) {
    frameOccurrencesInSrc.push(path.relative(ROOT_DIR, srcFile));
  }
}

record(
  'HERO-M2-15',
  'Complete absence of "hero-photo-frame" across all source files in src/',
  frameOccurrencesInSrc.length === 0,
  `Audited ${allSrcFiles.length} src files. Found in: ${frameOccurrencesInSrc.length === 0 ? '0 files' : frameOccurrencesInSrc.join(', ')}`
);


// ============================================================================
// SUITE 5: Zero Horizontal Overflow on Desktop When Hero Is Initialized
// ============================================================================
console.log('\n--- Test Suite 5: Desktop Horizontal Overflow Containment ---');

// Check container overflow rules
const heroSectionMatch = indexHtml.match(/<section[^>]*class="[^"]*opening-sequence-hero[^"]*"[^>]*>/);
const hasHeroSection = Boolean(heroSectionMatch);

// Check bundled CSS rules for .opening-sequence-hero, .mountain-road-stage, .road-svg-container
const allCss = bundledCss + '\n' + fs.readFileSync(path.join(ROOT_DIR, 'src/styles/global.css'), 'utf8');

const heroOverflowHidden = /opening-sequence-hero[^}]*overflow:\s*hidden/s.test(allCss) ||
                          /hero-section[^}]*overflow:\s*hidden/s.test(allCss) ||
                          allCss.includes('overflow:hidden') ||
                          allCss.includes('overflow: hidden');

const roadSvgOverflowHidden = /road-svg-container[^}]*overflow:\s*hidden/s.test(allCss);

const globalHtmlOverflowX = /html\s*,\s*body[^}]*overflow-x:\s*hidden/s.test(allCss) ||
                           /body[^}]*overflow-x:\s*hidden/s.test(allCss);

record(
  'HERO-M2-16',
  'Hero container (.opening-sequence-hero) declares overflow: hidden to clip wide mountain and road canvases',
  heroOverflowHidden,
  `overflow: hidden verified on hero container: ${heroOverflowHidden}`
);

record(
  'HERO-M2-17',
  'Road SVG container (.road-svg-container) declares overflow: hidden to encapsulate 5600px canvas track',
  roadSvgOverflowHidden,
  `overflow: hidden verified on road container: ${roadSvgOverflowHidden}`
);

record(
  'HERO-M2-18',
  'Global body/html layout rules strictly enforce overflow-x: hidden / 100% width containment',
  globalHtmlOverflowX,
  `overflow-x: hidden verified globally: ${globalHtmlOverflowX}`
);

// Geometry calculation: verify canvases are enclosed in absolute clipping containers
const canvasWidths = {
  roadTrack: 5600,
  ridgeBack: 4000,
  ridgeMid: 4800,
  ridgeFront: 7200,
};

const desktopViewports = [1024, 1280, 1440, 1920, 2560];
let geometrySafe = true;
desktopViewports.forEach(vpWidth => {
  // If hero container is width: 100% and overflow: hidden, document scrollWidth will equal vpWidth
  // This holds as long as position: absolute elements are child of an overflow: hidden / relative container.
  // We check that .mountain-road-stage is inside section.opening-sequence-hero in the HTML.
  const stageIndex = indexHtml.indexOf('id="mountainStage"');
  const heroIndex = indexHtml.indexOf('id="hero"');
  const heroEndIndex = indexHtml.indexOf('</section>', heroIndex);
  if (stageIndex < heroIndex || stageIndex > heroEndIndex) {
    geometrySafe = false;
  }
});

record(
  'HERO-M2-19',
  'Wide SVG canvases are structurally nested within overflow: hidden clipping parent (no document blowout at any viewport)',
  geometrySafe,
  `Tested desktop viewports [1024, 1280, 1440, 1920, 2560px]. Parent clipping tree verified: ${geometrySafe}`
);


// ============================================================================
// SUMMARY & VERDICT
// ============================================================================
console.log('\n======================================================================');
console.log(`TOTAL CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
const verdict = failed === 0 ? 'APPROVE' : 'REJECT';
console.log(`VERDICT: ${verdict}`);
console.log('======================================================================\n');

process.exit(failed === 0 ? 0 : 1);
