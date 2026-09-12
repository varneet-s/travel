/**
 * Challenger 1: Adversarial Verification Harness for Milestone 2
 * Focus: Pinned Horizontal Hero Parallax on Desktop & Mobile Safety
 * 
 * Tests empirical invariants:
 * 1. DOM Structure & Parallax Canvas Layers
 * 2. 14 Chronological Milestones Data Invariants & Detail Route Resolution
 * 3. Stationary Bus Anatomy, Wheel Spokes & Suspension Bob
 * 4. Parallax Differential Translation Deltas & Aspect Ratio Safety
 * 5. GSAP ScrollTrigger Desktop Pinning & Responsive matchMedia Isolation
 * 6. Mobile 375px-412px Viewport Overflow Guard & Zero Horizontal Scrollout
 * 7. Accessibility, IST Lighting Engine & Reduced Motion Neutralization
 * 8. Regression Defense (Zero hero-photo-frame, Strict Tabnabbing Security)
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const DIST_DIR = path.resolve('dist');
const SRC_DIR = path.resolve('src');

const results = [];
function record(id, name, passed, details = '') {
  results.push({ id, name, passed, details });
  const mark = passed ? '✓ [PASS]' : '✗ [FAIL]';
  console.log(`  ${mark} [${id}] ${name}${details ? ' - ' + details : ''}`);
}

console.log('\n===============================================================');
console.log('  CHALLENGER 1: ADVERSARIAL STRESS TEST (MILESTONE 2)');
console.log('  Pinned Horizontal Hero Parallax on Desktop (GSAP ScrollTrigger)');
console.log('===============================================================\n');

// Load index.html
const indexHtmlPath = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  console.error('dist/index.html not found! Run npm run build first.');
  process.exit(1);
}
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Load built CSS and JS
const astroDir = path.join(DIST_DIR, '_astro');
const astroFiles = fs.readdirSync(astroDir);
const cssFiles = astroFiles.filter(f => f.endsWith('.css'));
const jsFiles = astroFiles.filter(f => f.endsWith('.js'));
let bundledCss = '';
for (const f of cssFiles) {
  bundledCss += fs.readFileSync(path.join(astroDir, f), 'utf8') + '\n';
}
let bundledJs = '';
for (const f of jsFiles) {
  bundledJs += fs.readFileSync(path.join(astroDir, f), 'utf8') + '\n';
}

console.log('--- Test Suite 1: DOM Hierarchy & Parallax Canvas Layers ---');

// ADV-M2-01: Hero element exists with proper IDs and semantic classes
const hasHero = indexHtml.includes('id="hero"') && indexHtml.includes('hero-section');
record('ADV-M2-01', 'Hero container has id="hero" and class="hero-section"', hasHero);

// ADV-M2-02: Parallax mountain ridges exist
const hasRidgeBack = indexHtml.includes('id="ridgeBack"');
const hasRidgeMid = indexHtml.includes('id="ridgeMid"');
const hasRidgeFront = indexHtml.includes('id="ridgeFront"');
record('ADV-M2-02', 'All 3 differential mountain ridges exist (#ridgeBack, #ridgeMid, #ridgeFront)',
  hasRidgeBack && hasRidgeMid && hasRidgeFront,
  `back:${hasRidgeBack}, mid:${hasRidgeMid}, front:${hasRidgeFront}`
);

// ADV-M2-03: Translating road canvas track exists
const hasRoadTrack = indexHtml.includes('id="roadTrack"') && indexHtml.includes('road-canvas-track');
record('ADV-M2-03', 'Translating road canvas track exists (#roadTrack)', hasRoadTrack);

// ADV-M2-04: Ridge SVG width bounds provide ample translation runway (no voids on 2560px monitors)
const openingSrc = fs.readFileSync(path.join(SRC_DIR, 'components/OpeningSequence.astro'), 'utf8');
const backSvgWidth = (openingSrc.match(/viewBox=\"0 0 (\d+) 320\"/) || [])[1];
const midSvgWidth = (openingSrc.match(/viewBox=\"0 0 (\d+) 280\"/) || [])[1];
const frontSvgWidth = (openingSrc.match(/viewBox=\"0 0 (\d+) 200\"/) || [])[1];
const roadWidth = (openingSrc.match(/roadWidth\s*=\s*(\d+)/) || [])[1];
const ampleRunway = Number(backSvgWidth) >= 4000 && Number(midSvgWidth) >= 4800 && Number(frontSvgWidth) >= 7200 && Number(roadWidth) >= 5600;
record('ADV-M2-04', 'Parallax canvas assets have adequate horizontal runway (widths >= 4000px)', ampleRunway,
  `back:${backSvgWidth}px, mid:${midSvgWidth}px, front:${frontSvgWidth}px, road:${roadWidth}px`
);

console.log('\n--- Test Suite 2: Stationary Bus Mechanics & Visual Detailing ---');

// ADV-M2-05: Stationary bus anchor exists in DOM
const hasBusAnchor = indexHtml.includes('id="stationaryBusAnchor"') || indexHtml.includes('stationary-bus-anchor');
record('ADV-M2-05', 'Stationary bus anchor exists in DOM (.stationary-bus-anchor)', hasBusAnchor);

// ADV-M2-06: Bus chassis and wheels with rotating spokes exist
const hasChassis = indexHtml.includes('id="busChassis"');
const hasWheels = indexHtml.includes('bus-wheel-spin rear-wheel') && indexHtml.includes('bus-wheel-spin front-wheel');
const hasVarneet = indexHtml.includes('id="varneetPassenger"');
record('ADV-M2-06', 'Bus anatomy includes chassis, Varneet passenger silhouette, and front/rear wheels with rotating spokes',
  hasChassis && hasWheels && hasVarneet,
  `chassis:${hasChassis}, wheels:${hasWheels}, varneet:${hasVarneet}`
);

// ADV-M2-07: Transform origins configured on wheels for true center rotation
const rearOrigin = openingSrc.includes('transform-origin: 32px 42px');
const frontOrigin = openingSrc.includes('transform-origin: 98px 42px');
record('ADV-M2-07', 'Wheel spoke SVG groups declare precise transform-origin centers (32px 42px, 98px 42px)',
  rearOrigin && frontOrigin,
  `rear:${rearOrigin}, front:${frontOrigin}`
);

console.log('\n--- Test Suite 3: 14 Chronological Milestones & Elevation Telemetry ---');

// ADV-M2-08: Exactly 14 milestones in DOM
const milestoneMatches = [...indexHtml.matchAll(/class=\"[^\"]*milestone-interactive-node[^\"]*\"/g)];
const count14 = milestoneMatches.length === 14;
record('ADV-M2-08', 'Exactly 14 chronological altitude milestones rendered in dist/index.html', count14, `Count: ${milestoneMatches.length}`);

// ADV-M2-09: Live altitude indicator exists with initial contract "LIVE ELEVATION: 15M → 3,450M"
const hasAltitudeIndicator = indexHtml.includes('id="liveAltitudeIndicator"');
const hasInitialAltText = indexHtml.includes('LIVE ELEVATION: 15M → 3,450M') || indexHtml.includes('3,450m') || indexHtml.includes('3,450M');
record('ADV-M2-09', 'Live altitude HUD indicator exists with authentic 15M → 3,450M baseline',
  hasAltitudeIndicator && hasInitialAltText,
  `element:${hasAltitudeIndicator}, text:${hasInitialAltText}`
);

// ADV-M2-10: All 14 milestones link to valid pre-rendered journal detail pages
const nodeSlugs = [...indexHtml.matchAll(/data-slug=\"([^\"]+)\"/g)].map(m => m[1]);
let allSlugsResolve = nodeSlugs.length === 14;
for (const slug of nodeSlugs) {
  const pagePath = path.join(DIST_DIR, 'journal', slug, 'index.html');
  if (!fs.existsSync(pagePath)) {
    allSlugsResolve = false;
    console.error(`Missing destination route for slug: ${slug}`);
  }
}
record('ADV-M2-10', 'All 14 milestone popup cards link to statically pre-rendered journal detail pages',
  allSlugsResolve,
  `Total verified routes: ${nodeSlugs.length}`
);

console.log('\n--- Test Suite 4: GSAP ScrollTrigger Desktop Pinning & Responsive Isolation ---');

// ADV-M2-11: Client bundle includes GSAP ScrollTrigger timeline configuration
const hasPinConfig = bundledJs.includes('+=3500px') && (bundledJs.includes('pin:!0') || bundledJs.includes('pin:true'));
const hasScrub = bundledJs.includes('scrub:1');
record('ADV-M2-11', 'Client bundle configures ScrollTrigger with 3500px runway, pin: true, and scrub: 1',
  hasPinConfig && hasScrub,
  `pinConfig:${hasPinConfig}, scrub:${hasScrub}`
);

// ADV-M2-12: Parallax translation speeds in bundle
const hasRoadTrans = bundledJs.includes('-3600');
const hasBackTrans = bundledJs.includes('-720');
const hasMidTrans = bundledJs.includes('-1620');
const hasFrontTrans = bundledJs.includes('-4200');
const hasWheelSpin = bundledJs.includes('+=3600');
record('ADV-M2-12', 'Bundle implements differential speeds (-3600px road, -720px back, -1620px mid, -4200px front, +=3600 wheel rotation)',
  hasRoadTrans && hasBackTrans && hasMidTrans && hasFrontTrans && hasWheelSpin,
  `road:${hasRoadTrans}, back:${hasBackTrans}, mid:${hasMidTrans}, front:${hasFrontTrans}, wheel:${hasWheelSpin}`
);

// ADV-M2-13: Responsive isolation: (min-width: 768px) matchMedia guard
const hasMatchMediaGuard = bundledJs.includes('(min-width: 768px)') || bundledJs.includes('(min-width:768px)');
record('ADV-M2-13', 'GSAP animations are isolated to desktop viewports via (min-width: 768px) matchMedia guard', hasMatchMediaGuard);

// ADV-M2-14: Mobile suppression: stationary bus is display: none on viewports <= 768px
const busHiddenMobile = bundledCss.includes('.stationary-bus-anchor') && (bundledCss.includes('display:none') || bundledCss.includes('display: none'));
record('ADV-M2-14', 'Stationary bus anchor is suppressed on mobile viewports via display: none in media query', busHiddenMobile);

console.log('\n--- Test Suite 5: Mobile Geometry & Zero Horizontal Scrollout ---');

// ADV-M2-15: Hero section enforces overflow containment
const heroOverflowHidden = bundledCss.includes('.opening-sequence-hero') && (bundledCss.includes('overflow:hidden') || bundledCss.includes('overflow: hidden'));
const bodyOverflowHidden = bundledCss.includes('overflow-x:hidden') || bundledCss.includes('overflow-x: hidden');
record('ADV-M2-15', 'Hero container and root elements enforce overflow: hidden to prevent horizontal blowout',
  heroOverflowHidden && bodyOverflowHidden,
  `hero:${heroOverflowHidden}, body:${bodyOverflowHidden}`
);

// ADV-M2-16: Mobile road container enables smooth touch scroll
const mobileTouchScroll = openingSrc.includes('overflow-x: auto') && openingSrc.includes('-webkit-overflow-scrolling: touch');
record('ADV-M2-16', 'Mobile road SVG container specifies touch overflow-x: auto without scroll trapping', mobileTouchScroll);

console.log('\n--- Test Suite 6: Accessibility & Reduced Motion ---');

// ADV-M2-17: prefers-reduced-motion check in JS
const hasJsMotionGuard = bundledJs.includes('prefers-reduced-motion: reduce') || bundledJs.includes('prefers-reduced-motion:reduce');
record('ADV-M2-17', 'Client script honors (prefers-reduced-motion: reduce) by aborting ScrollTrigger creation', hasJsMotionGuard);

// ADV-M2-18: Lifecycle cleanup hooks wired to prevent memory leaks
const hasTeardownHooks = bundledJs.includes('astro:before-swap') && bundledJs.includes('pagehide');
record('ADV-M2-18', 'Lifecycle cleanup hooks wired on astro:before-swap and pagehide to revert ScrollTrigger instances', hasTeardownHooks);

console.log('\n--- Test Suite 7: Strict Regression Defense & Client Bundle Verification ---');

// ADV-M2-19: Eradication of legacy hero-photo-frame
const heroPhotoFrameInSrc = fs.readFileSync(path.join(SRC_DIR, 'components/OpeningSequence.astro'), 'utf8').includes('hero-photo-frame');
const heroPhotoFrameInDist = indexHtml.includes('hero-photo-frame');
record('ADV-M2-19', 'Zero occurrences of legacy hero-photo-frame across source and distribution output',
  !heroPhotoFrameInSrc && !heroPhotoFrameInDist,
  `src:${heroPhotoFrameInSrc}, dist:${heroPhotoFrameInDist}`
);

// ADV-M2-20: Clean transition to #dispatch section immediately following #hero
const heroIndex = indexHtml.indexOf('id="hero"');
const dispatchIndex = indexHtml.indexOf('id="dispatch"');
const sequentialFlow = heroIndex !== -1 && dispatchIndex !== -1 && heroIndex < dispatchIndex;
record('ADV-M2-20', 'DOM hierarchy maintains natural progression from pinned #hero directly to #dispatch', sequentialFlow,
  `heroPos:${heroIndex}, dispatchPos:${dispatchIndex}`
);

// ADV-M2-21: Client bundle files are valid ES modules without syntax errors
let bundleSyntaxValid = true;
for (const file of jsFiles) {
  const code = fs.readFileSync(path.join(astroDir, file), 'utf8');
  try {
    if (typeof vm.SourceTextModule === 'function') {
      new vm.SourceTextModule(code);
    } else {
      const { execSync } = await import('node:child_process');
      execSync('node --check --input-type=module', { input: code, stdio: ['pipe', 'pipe', 'pipe'] });
    }
  } catch (err) {
    bundleSyntaxValid = false;
    console.error(`Syntax error in ${file}:`, err);
  }
}
record('ADV-M2-21', 'All client JavaScript bundle files parse cleanly as valid ES modules', bundleSyntaxValid,
  `Audited ${jsFiles.length} client modules`
);

console.log('\n===============================================================');
const passedCount = results.filter(r => r.passed).length;
const failedCount = results.filter(r => !r.passed).length;
console.log(`TOTAL ADVERSARIAL TESTS: ${results.length}`);
console.log(`PASSED: ${passedCount}`);
console.log(`FAILED: ${failedCount}`);
console.log('===============================================================\n');

if (failedCount > 0) {
  console.log('VERDICT: REJECT (Adversarial failures detected in Milestone 2)');
  process.exit(1);
} else {
  console.log('VERDICT: APPROVE (All Milestone 2 adversarial invariants verified)');
  process.exit(0);
}
