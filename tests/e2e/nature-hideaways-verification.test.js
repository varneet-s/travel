import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const rootDir = process.cwd();
const indexHtml = readFileSync(resolve(rootDir, 'dist/index.html'), 'utf-8');
const designMd = readFileSync(resolve(rootDir, 'design.md'), 'utf-8');
const globalCss = readFileSync(resolve(rootDir, 'src/styles/global.css'), 'utf-8');
const indexAstro = readFileSync(resolve(rootDir, 'src/pages/index.astro'), 'utf-8');
const baseLayout = readFileSync(resolve(rootDir, 'src/layouts/BaseLayout.astro'), 'utf-8');

console.log('\n--- NATURE\'S HIDEAWAYS VERIFICATION SENTINEL ---');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

// 1. Design.md verification
assert(designMd.includes('#0A1118'), 'design.md specifies primary #0A1118');
assert(designMd.includes('#0F1720'), 'design.md specifies surface #0F1720');
assert(designMd.includes('#FFFFFF'), 'design.md specifies text #FFFFFF');
assert(designMd.includes('Newsreader'), 'design.md specifies Newsreader for headings');
assert(designMd.includes('Inter'), 'design.md specifies Inter for body/UI');
assert(designMd.includes('8px'), 'design.md specifies 8px base unit');
assert(designMd.includes('16px'), 'design.md specifies 16px gaps');

// 2. Google Fonts exclusively loaded via <link> tags in <head>
assert(indexHtml.includes('fonts.googleapis.com/css2?family=Inter') && indexHtml.includes('Newsreader'),
  'Google Fonts (Inter and Newsreader) loaded via standard <link> in <head>');

// 3. Hero Section (100vh)
assert(indexAstro.includes('h-screen') && indexAstro.includes('h-[100vh]') && indexAstro.includes('object-cover'),
  'Hero section uses exactly h-screen h-[100vh] object-cover');
assert(indexAstro.includes('/images/scenery/real-mountains-himachal.jpg'),
  'Hero section uses real mountain visual');

// 4. Title Typography
assert(indexAstro.includes('Letters from'), 'Hero title includes Line 1 "Letters from"');
assert(indexAstro.includes('The Long way Home.'), 'Hero title includes Line 2 "The Long way Home."');
assert(indexAstro.includes('whitespace-nowrap'), 'Hero Line 2 forces single line using whitespace-nowrap');

// 5. Vertical GSAP Crossfade & Chronological Letters
assert(indexAstro.includes('letters-pinned-container'), 'Pinned container present for GSAP crossfade');
assert(indexAstro.includes('ScrollTrigger'), 'GSAP ScrollTrigger imported and registered');
assert(indexAstro.includes('Kangra Valley, Himachal Pradesh'), 'Includes letter for Kangra Valley');
assert(indexAstro.includes('Jaipur, Rajasthan'), 'Includes letter for Jaipur');
assert(indexAstro.includes('Jodhpur, Rajasthan'), 'Includes letter for Jodhpur');
assert(indexAstro.includes('Bir Billing, Himachal Pradesh'), 'Includes letter for Bir Billing');

// 6. Minimalist Reading List & Exclusions
assert(indexHtml.includes('Currently Reading on the Road'), 'Reading list section rendered');
assert(indexHtml.includes('1984') && indexHtml.includes('George Orwell'), 'Reading list includes 1984');
assert(indexHtml.includes('Haruki Murakami'), 'Reading list includes Murakami books');
assert(!indexHtml.includes('Letterboxd') && !indexAstro.includes('letterboxd') && !indexHtml.includes('Watched'),
  'Movie/cinema section strictly excluded');

// 7. Permanently Remove Hamburger Menu
assert(!indexHtml.includes('hamburger-box') && !indexHtml.includes('mobile-nav-toggle'),
  'No hamburger menu markup exists in built HTML');
assert(!baseLayout.includes('id="mobileNavToggle"') && !baseLayout.includes('mobileNavDrawer'),
  'No hamburger menu or drawer toggle exists in BaseLayout');

console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
process.exit(failed > 0 ? 1 : 0);
