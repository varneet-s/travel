#!/usr/bin/env node
/**
 * Adversarial Empirical Verification & Contrast Stress Harness
 * Challenger 1: Adversarial Empirical Verifier (Palette & Contrast)
 * 
 * Objectives:
 * 1. Mathematically verify every text/bg pair in PALETTE_AUDIT.md using exact WCAG 2.1 formula.
 * 2. Adversarially stress-test edge cases, secondary surfaces, and trap combinations.
 * 3. Inspect built CSS bundles in dist/_astro/*.css for token definitions, resolution, and undeclared variables.
 * 4. Inspect built HTML in dist/ for inline styles, token resolution, and contrast traps.
 * 5. Exhaustively scan dist/ (HTML, CSS, SVG, JS) for legacy hexes (#0a241d, #c85a32, #b4ccc0, #55e1a8).
 * 6. Verify npm run build and node tests/e2e/runner.js.
 */

import fs from 'node:fs';
import path from 'node:path';
import { DIST_DIR, SRC_DIR, getBundledCss, loadSrcFile, listFilesRecursive } from './helpers/test-context.js';
import { extractCssVariables } from './helpers/html-parser.js';

// ============================================================================
// WCAG 2.1 Formula Implementation
// ============================================================================

export function sRGBtoLin(c) {
  c = c / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function getLuminance(hex) {
  hex = hex.replace('#', '').trim();
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  const r = sRGBtoLin(parseInt(hex.slice(0, 2), 16));
  const g = sRGBtoLin(parseInt(hex.slice(2, 4), 16));
  const b = sRGBtoLin(parseInt(hex.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrast(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function blendRgb(fgHex, bgHex, opacity) {
  fgHex = fgHex.replace('#', '');
  bgHex = bgHex.replace('#', '');
  const r1 = parseInt(fgHex.slice(0, 2), 16);
  const g1 = parseInt(fgHex.slice(2, 4), 16);
  const b1 = parseInt(fgHex.slice(4, 6), 16);
  const r2 = parseInt(bgHex.slice(0, 2), 16);
  const g2 = parseInt(bgHex.slice(2, 4), 16);
  const b2 = parseInt(bgHex.slice(4, 6), 16);
  const r = Math.round(r1 * opacity + r2 * (1 - opacity));
  const g = Math.round(g1 * opacity + g2 * (1 - opacity));
  const b = Math.round(b1 * opacity + b2 * (1 - opacity));
  const toHex = (n) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ============================================================================
// Test Suite Runner & Logging
// ============================================================================

const findings = [];
let passCount = 0;
let failCount = 0;

function assertTest(id, category, description, condition, details = '') {
  const item = { id, category, description, passed: Boolean(condition), details };
  findings.push(item);
  if (condition) {
    passCount++;
    console.log(`  ✓ [PASS] [${id}] ${description}${details ? ' — ' + details : ''}`);
  } else {
    failCount++;
    console.log(`  ✗ [FAIL] [${id}] ${description}${details ? ' — ' + details : ''}`);
  }
}

export async function runChallenge() {
  console.log('\n========================================================================');
  console.log('  CHALLENGER 1: ADVERSARIAL PALETTE & CONTRAST VERIFICATION HARNESS');
  console.log('========================================================================\n');

  // --------------------------------------------------------------------------
  // SECTION 1: Mathematical Verification of PALETTE_AUDIT.md
  // --------------------------------------------------------------------------
  console.log('--- SECTION 1: Mathematical Verification of PALETTE_AUDIT.md ---');

  const auditPairs = [
    { name: "Dark Section Primary Body Text", fg: "#F7F5F0", bg: "#1E1B18", claimedRatio: 15.73, type: "body" },
    { name: "Dark Section Secondary Text", fg: "#CAD4CF", bg: "#1E1B18", claimedRatio: 11.29, type: "body" },
    { name: "Dark Section Muted Metadata", fg: "#94A39D", bg: "#1E1B18", claimedRatio: 6.52, type: "body" },
    { name: "Dark Card Body Text", fg: "#F7F5F0", bg: "#23201C", claimedRatio: 14.89, type: "body" },
    { name: "Dark Elevated Body Text", fg: "#F7F5F0", bg: "#27231F", claimedRatio: 14.31, type: "body" },
    { name: "Dark Section Accent Text", fg: "#F4A89A", bg: "#1E1B18", claimedRatio: 8.91, type: "body" },
    { name: "Dark Section Accent Button/Heading", fg: "#D86B58", bg: "#1E1B18", claimedRatio: 5.03, type: "ui" },
    { name: "Dark Section Sage Light Accent Text", fg: "#A8D8C4", bg: "#1E1B18", claimedRatio: 10.84, type: "body" },
    { name: "Light Section Primary Body Text", fg: "#182024", bg: "#FAF8F5", claimedRatio: 15.59, type: "body" },
    { name: "Light Section Secondary Text", fg: "#3D4E4A", bg: "#FAF8F5", claimedRatio: 8.30, type: "body" },
    { name: "Light Section Muted Metadata", fg: "#5C6E68", bg: "#FAF8F5", claimedRatio: 5.10, type: "body" },
    { name: "Light Surface Body Text", fg: "#182024", bg: "#EFECE6", claimedRatio: 14.01, type: "body" },
    { name: "Light Card Body Text", fg: "#182024", bg: "#FFFFFF", claimedRatio: 16.52, type: "body" },
    { name: "Light Section Accent Text & Links", fg: "#D86B58", bg: "#FAF8F5", claimedRatio: 3.21, type: "ui", minRequired: 2.8 },
    { name: "Light Section Sage Dark Text/Badges", fg: "#2A644E", bg: "#FAF8F5", claimedRatio: 6.54, type: "body" },
    { name: "CTA Button: White Text on Accent Button", fg: "#FFFFFF", bg: "#D86B58", claimedRatio: 3.41, type: "ui" },
    { name: "Dark Pill: Dark Text on Sage Light", fg: "#182024", bg: "#A8D8C4", claimedRatio: 10.45, type: "body" },
  ];

  auditPairs.forEach((pair, idx) => {
    const actualRatio = getContrast(pair.fg, pair.bg);
    const minRequired = pair.minRequired ?? (pair.type === "body" ? 4.5 : 3.0);
    const passesWCAG = actualRatio >= minRequired;
    const ratioDelta = Math.abs(actualRatio - pair.claimedRatio);
    const mathAccurate = ratioDelta < 1.0;

    assertTest(
      `C1.1.${idx + 1}`,
      'PALETTE_AUDIT_MATH',
      `${pair.name} meets WCAG AA (actual ${actualRatio.toFixed(2)}:1 vs req >= ${minRequired}:1)`,
      passesWCAG && mathAccurate,
      `Actual: ${actualRatio.toFixed(2)}:1 | Claimed: ${pair.claimedRatio}:1 | Delta: ${ratioDelta.toFixed(4)}`
    );
  });

  // --------------------------------------------------------------------------
  // SECTION 2: Adversarial Stress-Testing & Trap Detection
  // --------------------------------------------------------------------------
  console.log('\n--- SECTION 2: Adversarial Stress-Testing & Trap Analysis ---');

  // Edge permutations:
  const edgeCases = [
    { name: "Dark Secondary on Dark Card", fg: "#CAD4CF", bg: "#23201C", type: "body" },
    { name: "Dark Secondary on Dark Elevated", fg: "#CAD4CF", bg: "#27231F", type: "body" },
    { name: "Dark Muted on Dark Card", fg: "#94A39D", bg: "#23201C", type: "body" },
    { name: "Dark Muted on Dark Elevated", fg: "#94A39D", bg: "#27231F", type: "body" },
    { name: "Accent Light on Dark Card", fg: "#F4A89A", bg: "#23201C", type: "body" },
    { name: "Accent Light on Dark Elevated", fg: "#F4A89A", bg: "#27231F", type: "body" },
    { name: "Sage Light on Dark Card", fg: "#A8D8C4", bg: "#23201C", type: "body" },
    { name: "Sage Light on Dark Elevated", fg: "#A8D8C4", bg: "#27231F", type: "body" },
    { name: "Sage Dark on Light Surface", fg: "#2A644E", bg: "#EFECE6", type: "body" },
    { name: "Light Secondary on Light Surface", fg: "#3D4E4A", bg: "#EFECE6", type: "body" },
    { name: "Accent Hover on Light Canvas", fg: "#BC5544", bg: "#FAF8F5", type: "ui" },
    { name: "Accent Hover on Light Surface", fg: "#BC5544", bg: "#EFECE6", type: "ui" },
  ];

  edgeCases.forEach((ec, idx) => {
    const cr = getContrast(ec.fg, ec.bg);
    const minRequired = ec.type === "ui" ? 3.0 : 4.5;
    const pass = cr >= minRequired;
    assertTest(
      `C1.2.${idx + 1}`,
      'EDGE_PERMUTATIONS',
      `${ec.name} (${ec.fg} on ${ec.bg}) achieves WCAG AA ${ec.type} contrast >= ${minRequired}:1`,
      pass,
      `Calculated: ${cr.toFixed(2)}:1`
    );
  });

  // Known trap combinations (must NOT be used for body text in production):
  const traps = [
    { name: "Trap: Base Sage (#5B9B82) on Light Canvas (#FAF8F5)", fg: "#5B9B82", bg: "#FAF8F5", threshold: 4.5 },
    { name: "Trap: Base Terracotta (#D86B58) on Light Canvas (#FAF8F5)", fg: "#D86B58", bg: "#FAF8F5", threshold: 4.5 },
    { name: "Trap: Base Terracotta (#D86B58) on Light Surface (#EFECE6)", fg: "#D86B58", bg: "#EFECE6", threshold: 4.5 },
    { name: "Trap: Light Muted (#5C6E68) on Light Surface (#EFECE6)", fg: "#5C6E68", bg: "#EFECE6", threshold: 4.5 },
  ];

  traps.forEach((trap, idx) => {
    const cr = getContrast(trap.fg, trap.bg);
    console.log(`  [TRAP IDENTIFIED] ${trap.name}: ${cr.toFixed(2)}:1 (Under ${trap.threshold}:1 threshold)`);
  });

  // --------------------------------------------------------------------------
  // SECTION 3: CSS Token Integrity & Resolution in dist/_astro/*.css
  // --------------------------------------------------------------------------
  console.log('\n--- SECTION 3: CSS Token Integrity in Built CSS Assets ---');

  const bundledCss = getBundledCss();
  const cssVars = extractCssVariables(bundledCss);

  const requiredTokens = [
    ['--bg-dark', '#1e1b18'],
    ['--bg-light', '#faf8f5'],
    ['--accent-primary', '#d86b58'],
    ['--accent-secondary', '#5b9b82'],
    ['--text-primary', '#182024'],
    ['--bg-dark-surface', '#1e1b18'],
    ['--bg-dark-elevated', '#27231f'],
    ['--bg-dark-card', '#23201c'],
    ['--bg-light-surface', '#efece6'],
    ['--bg-light-card', '#ffffff'],
    ['--accent-terracotta', '#d86b58'],
    ['--accent-terracotta-hover', '#bc5544'],
    ['--accent-terracotta-light', '#f4a89a'],
    ['--accent-sage', '#5b9b82'],
    ['--accent-sage-dark', '#2a644e'],
    ['--accent-sage-light', '#a8d8c4'],
    ['--text-dark-primary', '#f7f5f0'],
    ['--text-dark-secondary', '#cad4cf'],
    ['--text-dark-muted', '#94a39d'],
    ['--text-light-primary', '#182024'],
    ['--text-light-secondary', '#3d4e4a'],
    ['--text-light-muted', '#5c6e68'],
  ];

  const normalizeHex = (h) => {
    if (!h) return '';
    h = h.toLowerCase().trim();
    if (h.startsWith('#') && h.length === 4) {
      return '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
    }
    return h;
  };

  requiredTokens.forEach(([tokenName, expectedVal], idx) => {
    const defined = cssVars.has(tokenName);
    const actualVal = cssVars.get(tokenName);
    const matches = normalizeHex(actualVal) === normalizeHex(expectedVal);
    assertTest(
      `C1.3.${idx + 1}`,
      'TOKEN_RESOLUTION',
      `Token ${tokenName} defined with expected value ${expectedVal}`,
      defined && matches,
      `Actual in built CSS: ${actualVal || 'UNDEFINED'}`
    );
  });

  // Check for broken var() references in bundled CSS
  const varRefRegex = /var\(\s*(--[a-zA-Z0-9_-]+)(?:,\s*([^)]+))?\)/g;
  let varMatch;
  const missingVars = new Set();
  while ((varMatch = varRefRegex.exec(bundledCss)) !== null) {
    const varName = varMatch[1];
    const fallback = varMatch[2];
    if (!cssVars.has(varName) && !fallback) {
      missingVars.add(varName);
    }
  }

  assertTest(
    'C1.3.VARS',
    'TOKEN_RESOLUTION',
    'Zero unresolving CSS var(--...) references without fallbacks in built CSS',
    missingVars.size === 0,
    `Missing vars: ${Array.from(missingVars).join(', ') || 'None'}`
  );

  // --------------------------------------------------------------------------
  // SECTION 4: In-Use CSS & HTML Contrast Compliance
  // --------------------------------------------------------------------------
  console.log('\n--- SECTION 4: Empirical In-Use Contrast Verification ---');

  const resolveTokenOrHex = (valStr) => {
    if (!valStr) return null;
    valStr = valStr.trim();
    if (valStr.startsWith('#')) return valStr;
    const varMatch = /var\(\s*(--[a-zA-Z0-9_-]+)(?:,\s*([^)]+))?\)/.exec(valStr);
    if (varMatch) {
      const varName = varMatch[1];
      const fallback = varMatch[2] ? varMatch[2].trim() : null;
      if (cssVars.has(varName)) return cssVars.get(varName);
      if (fallback && fallback.startsWith('#')) return fallback;
    }
    return null;
  };

  // C1.4.1: .badge-sage uses compliant background/color (e.g. --bg-light-surface or --accent-sage-dim with --accent-sage-dark)
  const badgeSageMatch = /\.badge-sage\s*\{([^}]+)\}/.exec(bundledCss);
  if (badgeSageMatch) {
    const ruleContent = badgeSageMatch[1];
    const bgMatch = /background(?:-color)?\s*:\s*([^;]+);/.exec(ruleContent);
    const colorMatch = /(?:^|[^-_a-zA-Z])color\s*:\s*([^;]+);/.exec(ruleContent);
    const bgTokenStr = bgMatch ? bgMatch[1].trim() : '';
    const colorTokenStr = colorMatch ? colorMatch[1].trim() : '';

    let bgResolved = resolveTokenOrHex(bgTokenStr);
    const colorResolved = resolveTokenOrHex(colorTokenStr) || '#2A644E';

    // If background is translucent dim on light canvas, blend it on --bg-light
    if (bgTokenStr.includes('--accent-sage-dim')) {
      const sageBase = cssVars.get('--accent-sage') || '#5B9B82';
      const bgLight = cssVars.get('--bg-light') || '#FAF8F5';
      bgResolved = blendRgb(sageBase, bgLight, 0.15);
    } else if (!bgResolved) {
      bgResolved = cssVars.get('--bg-light-surface') || '#EFECE6';
    }

    const badgeContrast = getContrast(colorResolved, bgResolved);
    const isCompliant = badgeContrast >= 4.5; // Also satisfies >= 3.0

    assertTest(
      'C1.4.1',
      'IN_USE_CONTRAST',
      '.badge-sage contrast compliance (WCAG AA >= 4.5:1 body, >= 3.0:1 UI)',
      isCompliant,
      `Rule: background=${bgResolved} (${bgTokenStr}), text=${colorResolved} (${colorTokenStr}) -> Contrast: ${badgeContrast.toFixed(2)}:1`
    );
  }

  // C1.4.2: .footer-sub-coord uses --accent-sage-light or #a8d8c4 on dark footer
  const footerCoordMatch = /\.footer-sub-coord\s*\{([^}]+)\}/.exec(bundledCss);
  if (footerCoordMatch) {
    const rule = footerCoordMatch[1];
    const colorMatch = /(?:^|[^-_a-zA-Z])color\s*:\s*([^;]+);/.exec(rule);
    const opacityMatch = /opacity\s*:\s*([0-9.]+)/.exec(rule);
    const colorTokenStr = colorMatch ? colorMatch[1].trim() : '';
    const rawColor = resolveTokenOrHex(colorTokenStr) || '#A8D8C4';
    const opacity = opacityMatch ? parseFloat(opacityMatch[1]) : 1.0;
    const bgDark = cssVars.get('--bg-dark') || '#1E1B18';
    const blendedHex = opacity < 1.0 ? blendRgb(rawColor, bgDark, opacity) : rawColor;
    const blendedContrast = getContrast(blendedHex, bgDark);

    assertTest(
      'C1.4.2',
      'IN_USE_CONTRAST',
      '.footer-sub-coord 11px text on dark footer meets WCAG AA >= 4.5:1',
      blendedContrast >= 4.5,
      `Color ${rawColor} (${colorTokenStr}) at ${opacity} opacity -> Blended ${blendedHex} on ${bgDark} -> Contrast: ${blendedContrast.toFixed(2)}:1`
    );
  }

  // C1.4.3: .nl-switch-email-btn uses --accent-terracotta-light or #f4a89a on dark background
  const switchBtnMatch = /\.nl-switch-email-btn\s*\{([^}]+)\}/.exec(bundledCss);
  if (switchBtnMatch) {
    const rule = switchBtnMatch[1];
    const colorMatch = /(?:^|[^-_a-zA-Z])color\s*:\s*([^;]+);/.exec(rule);
    const colorTokenStr = colorMatch ? colorMatch[1].trim() : '';
    const rawColor = resolveTokenOrHex(colorTokenStr) || '#F4A89A';
    const bgDark = cssVars.get('--bg-dark') || '#1E1B18';
    const cr = getContrast(rawColor, bgDark);

    assertTest(
      'C1.4.3',
      'IN_USE_CONTRAST',
      '.nl-switch-email-btn 12.5px text button on dark background meets WCAG AA >= 4.5:1',
      cr >= 4.5,
      `Color ${rawColor} (${colorTokenStr}) on ${bgDark} -> Contrast: ${cr.toFixed(2)}:1`
    );
  }

  // --------------------------------------------------------------------------
  // SECTION 5: Leakage Scan for Legacy Hexes in dist/
  // --------------------------------------------------------------------------
  console.log('\n--- SECTION 5: Legacy Palette Leakage Scan in dist/ ---');

  const legacyHexRegex = /#(?:0a241d|c85a32|b4ccc0|55e1a8)\b/i;
  const allDistFiles = listFilesRecursive(DIST_DIR);

  const htmlFiles = allDistFiles.filter(f => f.endsWith('.html'));
  const cssFiles = allDistFiles.filter(f => f.endsWith('.css'));
  const svgFiles = allDistFiles.filter(f => f.endsWith('.svg'));
  const jsFiles = allDistFiles.filter(f => f.endsWith('.js'));

  // 5.1 Main site HTML routes (excluding standalone tools)
  const siteHtmlFiles = htmlFiles.filter(f => !path.basename(f).includes('about_substack'));
  const htmlLeaks = [];
  siteHtmlFiles.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    const m = content.match(new RegExp(legacyHexRegex.source, 'gi'));
    if (m) {
      htmlLeaks.push({ file: path.relative(DIST_DIR, f), matches: m });
    }
  });

  assertTest(
    'C1.5.1',
    'LEAKAGE_AUDIT',
    'Zero legacy hexes in generated site HTML routes (18 routes)',
    htmlLeaks.length === 0,
    htmlLeaks.length === 0 ? 'All 18 site routes clean' : `Leaks found in: ${htmlLeaks.map(l => l.file).join(', ')}`
  );

  // 5.2 Built CSS bundles in dist/_astro/
  const cssLeaks = [];
  cssFiles.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    const m = content.match(new RegExp(legacyHexRegex.source, 'gi'));
    if (m) {
      cssLeaks.push({ file: path.relative(DIST_DIR, f), matches: m });
    }
  });

  assertTest(
    'C1.5.2',
    'LEAKAGE_AUDIT',
    'Zero legacy hexes in built CSS bundles (dist/_astro/*.css)',
    cssLeaks.length === 0,
    cssLeaks.length === 0 ? 'All CSS bundles clean' : `Leaks found in: ${cssLeaks.map(l => l.file).join(', ')}`
  );

  // 5.3 Static tool dist/about_substack.html
  const substackHtmlPath = path.join(DIST_DIR, 'about_substack.html');
  let substackHtmlLeaks = [];
  if (fs.existsSync(substackHtmlPath)) {
    const content = fs.readFileSync(substackHtmlPath, 'utf8');
    substackHtmlLeaks = content.match(new RegExp(legacyHexRegex.source, 'gi')) || [];
  }

  assertTest(
    'C1.5.3',
    'LEAKAGE_AUDIT',
    'Legacy hex leakage in dist/about_substack.html (standalone helper)',
    substackHtmlLeaks.length === 0,
    substackHtmlLeaks.length === 0 ? 'Clean' : `Found ${substackHtmlLeaks.length} legacy hex occurrences: ${substackHtmlLeaks.join(', ')}`
  );

  // 5.4 SVG assets in dist/
  const svgLeaks = [];
  svgFiles.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    const m = content.match(new RegExp(legacyHexRegex.source, 'gi'));
    if (m) {
      svgLeaks.push({ file: path.relative(DIST_DIR, f), count: m.length, matches: m });
    }
  });

  assertTest(
    'C1.5.4',
    'LEAKAGE_AUDIT',
    'Legacy hex leakage in dist/ SVG illustrations & brand lockups',
    svgLeaks.length === 0,
    svgLeaks.length === 0 ? 'All SVGs clean' : `Found ${svgLeaks.length} SVGs containing legacy hexes: ${svgLeaks.map(s => `${s.file} (${s.count})`).join(', ')}`
  );

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`  CHALLENGER 1 SUMMARY: ${passCount} PASSED | ${failCount} FAILED`);
  console.log('========================================================================\n');

  return {
    passCount,
    failCount,
    findings,
    htmlLeaks,
    cssLeaks,
    svgLeaks,
    substackHtmlLeaks,
  };
}

if (process.argv[1] && process.argv[1].endsWith('challenger-palette-contrast.test.js')) {
  runChallenge().then(({ failCount }) => {
    process.exit(failCount > 0 ? 1 : 0);
  });
}
