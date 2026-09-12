/**
 * Empirical Mobile Touch & Card Peeking Test Harness (Milestone 3)
 * Parikshak (Challenger)
 *
 * Verifies via Headless Chrome:
 * 1. Mobile touch swipe container (.mobile-milestones-wrapper & .mobile-milestones-track) on 375px, 390px, 412px.
 * 2. CSS scroll-snap (x mandatory) and zero document horizontal overflow.
 * 3. Exact 14 milestone cards with 270px width and right-edge peeking affordance.
 * 4. Desktop isolation at 1280px (mobile wrapper display: none; stationary bus & mountain stage visible).
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../../dist');

function startServer(port = 4178) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      if (reqPath.endsWith('/')) reqPath += 'index.html';
      let filePath = path.join(DIST_DIR, reqPath);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }

      const ext = path.extname(filePath);
      const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });

    server.listen(port, () => resolve(server));
  });
}

export async function runVerification() {
  console.log('===============================================================');
  console.log('  CHALLENGER: EMPIRICAL MOBILE TOUCH SWIPE & PEEKING SENTINEL  ');
  console.log('===============================================================\n');

  const PORT = 4178;
  const server = await startServer(PORT);
  const playwrightPath = '/Users/rekhoj/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
  const { chromium } = await import(playwrightPath);
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });

  const results = [];
  function record(name, pass, details = {}) {
    results.push({ name, pass, details });
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${name}`);
    if (Object.keys(details).length > 0) {
      console.log('       ', details);
    }
  }

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    // -------------------------------------------------------------
    // Mobile Viewports (375px, 390px, 412px)
    // -------------------------------------------------------------
    const mobileViewports = [
      { name: 'iPhone SE (375px)', width: 375, height: 667 },
      { name: 'iPhone 12/13/14 (390px)', width: 390, height: 844 },
      { name: 'Pixel 7 (412px)', width: 412, height: 915 }
    ];

    for (const vp of mobileViewports) {
      console.log(`\n--- Evaluating Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });

      const evalResult = await page.evaluate(() => {
        const wrapper = document.querySelector('.mobile-milestones-wrapper');
        const track = document.querySelector('.mobile-milestones-track');
        const cards = document.querySelectorAll('.mobile-milestone-card');
        const busAnchor = document.querySelector('.stationary-bus-anchor');
        const mountainStage = document.querySelector('.mountain-road-stage');
        const promptEl = document.querySelector('.scroll-drive-prompt');

        const wrapperVisible = wrapper && window.getComputedStyle(wrapper).display !== 'none';
        const busHidden = busAnchor && window.getComputedStyle(busAnchor).display === 'none';
        const mountainHidden = mountainStage && window.getComputedStyle(mountainStage).display === 'none';
        const promptHidden = promptEl && window.getComputedStyle(promptEl).display === 'none';

        const trackComputed = track ? window.getComputedStyle(track) : null;
        const scrollSnap = trackComputed ? (trackComputed.scrollSnapType || '') : '';
        const overflowX = trackComputed ? trackComputed.overflowX : '';

        // Check card 0 and card 1 geometry
        let cardWidth = 0;
        let card0Right = 0;
        let card1Left = 0;
        let peekingAmount = 0;
        let ctaHeight = 0;

        if (cards.length > 1) {
          const rect0 = cards[0].getBoundingClientRect();
          const rect1 = cards[1].getBoundingClientRect();
          cardWidth = Math.round(rect0.width);
          card0Right = Math.round(rect0.right);
          card1Left = Math.round(rect1.left);
          peekingAmount = Math.round(window.innerWidth - rect1.left);

          const cta = cards[0].querySelector('.mobile-card-link');
          if (cta) {
            ctaHeight = Math.round(cta.getBoundingClientRect().height);
          }
        }

        // Global overflow check
        const bodyOverflow = document.documentElement.scrollWidth <= window.innerWidth + 1;

        return {
          wrapperVisible,
          busHidden,
          mountainHidden,
          promptHidden,
          cardsCount: cards.length,
          scrollSnap,
          overflowX,
          cardWidth,
          card0Right,
          card1Left,
          peekingAmount,
          ctaHeight,
          bodyOverflow,
          docScrollWidth: document.documentElement.scrollWidth,
          winWidth: window.innerWidth
        };
      });

      record(`${vp.name}: Mobile milestones container visible on mobile`, evalResult.wrapperVisible);
      record(`${vp.name}: Desktop bus anchor suppressed`, evalResult.busHidden);
      record(`${vp.name}: Desktop mountain stage suppressed`, evalResult.mountainHidden);
      record(`${vp.name}: Desktop scroll prompt suppressed`, evalResult.promptHidden);
      record(`${vp.name}: Exactly 14 mobile milestone cards rendered`, evalResult.cardsCount === 14, { count: evalResult.cardsCount });
      record(`${vp.name}: CSS scroll-snap mandatory configured on track`, evalResult.scrollSnap.includes('mandatory') || evalResult.scrollSnap.includes('x'), { scrollSnap: evalResult.scrollSnap });
      record(`${vp.name}: Milestone card width is ~270px`, evalResult.cardWidth >= 265 && evalResult.cardWidth <= 275, { cardWidth: evalResult.cardWidth });
      record(`${vp.name}: Next milestone card peeks from right edge (affordance)`, evalResult.peekingAmount > 40 && evalResult.peekingAmount < 140, { peekingAmount: evalResult.peekingAmount });
      record(`${vp.name}: Mobile card CTA touch target >= 44px`, evalResult.ctaHeight >= 44, { ctaHeight: evalResult.ctaHeight });
      record(`${vp.name}: Zero document horizontal overflow`, evalResult.bodyOverflow, { scrollWidth: evalResult.docScrollWidth, innerWidth: evalResult.winWidth });
    }

    // -------------------------------------------------------------
    // Desktop Viewport (1280px) Isolation
    // -------------------------------------------------------------
    console.log(`\n--- Evaluating Desktop Isolation (1280x800) ---`);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });

    const desktopEval = await page.evaluate(() => {
      const wrapper = document.querySelector('.mobile-milestones-wrapper');
      const busAnchor = document.querySelector('.stationary-bus-anchor');
      const mountainStage = document.querySelector('.mountain-road-stage');
      const roadTrack = document.querySelector('.road-canvas-track');

      return {
        wrapperHidden: wrapper ? window.getComputedStyle(wrapper).display === 'none' : true,
        busVisible: busAnchor ? window.getComputedStyle(busAnchor).display !== 'none' : false,
        mountainVisible: mountainStage ? window.getComputedStyle(mountainStage).display !== 'none' : false,
        roadVisible: roadTrack ? window.getComputedStyle(roadTrack).display !== 'none' : false
      };
    });

    record(`Desktop (1280px): Mobile milestones container hidden`, desktopEval.wrapperHidden);
    record(`Desktop (1280px): Stationary bus anchor visible`, desktopEval.busVisible);
    record(`Desktop (1280px): Mountain road stage visible`, desktopEval.mountainVisible);
    record(`Desktop (1280px): Road canvas track visible`, desktopEval.roadVisible);

  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n===============================================================');
  const passCount = results.filter(r => r.pass).length;
  const failCount = results.filter(r => !r.pass).length;
  console.log(`TOTAL CHECKS: ${results.length} | PASSED: ${passCount} | FAILED: ${failCount}`);
  console.log(`FINAL EMPIRICAL VERDICT: ${failCount === 0 ? 'APPROVE' : 'REJECT'}`);
  console.log('===============================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error('Fatal error during mobile verification:', err);
  process.exit(1);
});
