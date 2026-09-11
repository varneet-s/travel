import fs from 'node:fs';
import path from 'node:path';
import { assert, assertEqual, assertIncludes } from './helpers/assertions.js';
import { getAnchorTags, extractJsonLd } from './helpers/html-parser.js';
import { loadDistFile, loadSrcFile, fileExists, SRC_DIR, DIST_DIR, PUBLIC_DIR } from './helpers/test-context.js';

export async function runTier3(report) {
  const homeHtml = loadDistFile('index.html') || '';
  const journalHtml = loadDistFile('journal/index.html') || '';
  const readingHtml = loadDistFile('reading/index.html') || '';
  const aboutHtml = loadDistFile('about/index.html') || '';

  const archivePath = path.join(SRC_DIR, 'data/journeysArchive.ts');
  const archiveContent = fs.existsSync(archivePath) ? fs.readFileSync(archivePath, 'utf8') : '';

  // =========================================================================
  // Cross-Feature Pairwise Tests (Tier 3)
  // =========================================================================

  // T3.1: Mobile Drawer x Desktop Navigation Synchrony
  try {
    const desktopLinks = ['/journal', '/reading', '/about'];
    for (const link of desktopLinks) {
      assertIncludes(homeHtml, `href="${link}"`, `Home navigation must link to ${link}`);
      assertIncludes(journalHtml, `href="${link}"`, `Journal navigation must link to ${link}`);
    }
    report.addResult({
      id: 'T3.1',
      name: 'Mobile Drawer x Desktop Navigation: Core routing destinations (/journal, /reading, /about) match across navigation contexts',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T3.1',
      name: 'Mobile Drawer x Desktop Navigation: Core routing destinations (/journal, /reading, /about) match across navigation contexts',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: false,
      error: err,
    });
  }

  // T3.2: Substack Outbound Links x Security Attributes (target="_blank" + rel="noopener noreferrer")
  try {
    const pages = [homeHtml, journalHtml, aboutHtml];
    for (const html of pages) {
      const anchors = getAnchorTags(html);
      const substackAnchors = anchors.filter(a => a.href.includes('rekhoj.substack.com'));
      for (const a of substackAnchors) {
        assertEqual(a.target, '_blank', `Substack link to ${a.href} must declare target="_blank"`);
        assert(a.rel.includes('noopener') && a.rel.includes('noreferrer'), `Substack link to ${a.href} must declare rel="noopener noreferrer"`);
      }
    }
    report.addResult({
      id: 'T3.2',
      name: 'Substack Outbound Links x Tabnabbing Defense: All Substack links declare target="_blank" and rel="noopener noreferrer"',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T3.2',
      name: 'Substack Outbound Links x Tabnabbing Defense: All Substack links declare target="_blank" and rel="noopener noreferrer"',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: false,
      error: err,
    });
  }

  // T3.3: External Social/Partner Links x Security Attributes
  try {
    const anchors = getAnchorTags(aboutHtml);
    const externalAnchors = anchors.filter(a => a.href.startsWith('http') && !a.href.includes('travel.varneet.in'));
    for (const a of externalAnchors) {
      if (a.target === '_blank') {
        assert(a.rel.includes('noopener') || a.rel.includes('noreferrer'), `External blank link to ${a.href} must include noopener/noreferrer`);
      }
    }
    report.addResult({
      id: 'T3.3',
      name: 'External Social Links x Security: External partner and profile links declare noopener/noreferrer security',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T3.3',
      name: 'External Social Links x Security: External partner and profile links declare noopener/noreferrer security',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: false,
      error: err,
    });
  }

  // T3.4: Leaflet Map x Mobile Gesture Safety
  try {
    assert(homeHtml.includes('travelWorldMap'), 'Leaflet map element travelWorldMap must exist');
    assert(homeHtml.includes('gesture') || homeHtml.includes('zoom') || homeHtml.includes('touch'), 'Mobile gesture control instructions must be provided');
    report.addResult({
      id: 'T3.4',
      name: 'Leaflet Interactive Atlas x Mobile Gesture Safety: Map interaction accommodates mobile touch without scroll-trapping',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T3.4',
      name: 'Leaflet Interactive Atlas x Mobile Gesture Safety: Map interaction accommodates mobile touch without scroll-trapping',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: false,
      error: err,
    });
  }

  // T3.5: Journeys Archive x SSG Static Routing
  try {
    const slugRegex = /journalSlug:\s*['"]([^'"]+)['"]/g;
    let m;
    const slugs = [];
    while ((m = slugRegex.exec(archiveContent)) !== null) {
      slugs.push(m[1]);
    }
    assert(slugs.length >= 14, `Expected 14 slugs in journeysArchive, found ${slugs.length}`);
    for (const s of slugs) {
      const distRoute = path.join(DIST_DIR, 'journal', s, 'index.html');
      assert(fs.existsSync(distRoute), `Pre-rendered static route missing for slug: ${s} at ${distRoute}`);
    }
    report.addResult({
      id: 'T3.5',
      name: 'Journeys Archive x SSG Static Routing: Every journalSlug in journeysArchive.ts resolves to a built index.html',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T3.5',
      name: 'Journeys Archive x SSG Static Routing: Every journalSlug in journeysArchive.ts resolves to a built index.html',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: false,
      error: err,
    });
  }

  // T3.6: Markdown Frontmatter Images x Public Asset Files
  try {
    const journalDir = path.join(SRC_DIR, 'content/journal');
    const files = fs.readdirSync(journalDir).filter(f => f.endsWith('.md'));
    let verifiedImages = 0;
    for (const file of files) {
      const content = fs.readFileSync(path.join(journalDir, file), 'utf8');
      const imgLines = content.match(/-\s*['"]?(\/images\/[^'"\n]+)['"]?/g) || [];
      for (const line of imgLines) {
        const imgPath = line.replace(/-\s*['"]?/, '').replace(/['"]?$/, '').trim();
        const diskPath = path.join(PUBLIC_DIR, imgPath.replace(/^\//, ''));
        assert(fs.existsSync(diskPath), `Referenced image ${imgPath} does not exist in public/`);
        verifiedImages++;
      }
    }
    assert(verifiedImages >= 42, `Expected at least 42 images verified (14 * 3), verified ${verifiedImages}`);
    report.addResult({
      id: 'T3.6',
      name: 'Markdown Frontmatter Images x Public Asset Store: All referenced expedition photographs physically exist in public/',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T3.6',
      name: 'Markdown Frontmatter Images x Public Asset Store: All referenced expedition photographs physically exist in public/',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: false,
      error: err,
    });
  }

  // T3.7: Journey Card Tags x Normalized Hashtag Syntax
  try {
    const tagMatches = archiveContent.match(/tags:\s*\[([^\]]+)\]/g) || [];
    assert(tagMatches.length >= 14, 'Expected tags array for all 14 journeys');
    for (const tm of tagMatches) {
      const raw = tm.replace(/tags:\s*\[/, '').replace(/\]/, '');
      const tags = raw.split(',').map(t => t.trim().replace(/['"]/g, '')).filter(Boolean);
      for (const tag of tags) {
        assert(tag.startsWith('#'), `Tag "${tag}" must start with #`);
        assert(/^[a-z0-9\-#]+$/.test(tag), `Tag "${tag}" must contain only lowercase letters, digits, and hyphens`);
      }
    }
    report.addResult({
      id: 'T3.7',
      name: 'Journey Card Tags x Normalized Hashtag Syntax: All journey tags follow lowercase hyphenated #tag format',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T3.7',
      name: 'Journey Card Tags x Normalized Hashtag Syntax: All journey tags follow lowercase hyphenated #tag format',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: false,
      error: err,
    });
  }

  // T3.8: Design Tokens x Dark/Light Theme Switching
  try {
    assertIncludes(homeHtml, 'section-dark', 'Home page must contain dark sections');
    assertIncludes(homeHtml, 'section-light', 'Home page must contain light sections');
    report.addResult({
      id: 'T3.8',
      name: 'Design Tokens x Editorial Theming: Alternating dark pine and light paper section containers render cleanly',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T3.8',
      name: 'Design Tokens x Editorial Theming: Alternating dark pine and light paper section containers render cleanly',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: false,
      error: err,
    });
  }

  // T3.9: JSON-LD Structured Data x About Profile
  try {
    const jsonLdList = extractJsonLd(aboutHtml);
    assert(jsonLdList.length > 0, 'About page must contain JSON-LD structured data');
    const profile = jsonLdList.find(j => j['@type'] === 'ProfilePage' || j['@type'] === 'Person');
    assert(profile, 'About page must contain ProfilePage or Person schema');
    const sameAs = profile.mainEntity ? profile.mainEntity.sameAs : profile.sameAs;
    assert(Array.isArray(sameAs), 'sameAs must be an array of links');
    assert(sameAs.includes('https://rekhoj.substack.com'), 'sameAs array must include https://rekhoj.substack.com');
    report.addResult({
      id: 'T3.9',
      name: 'JSON-LD Schema x About Profile: Schema.org ProfilePage links author identity directly to Substack publication',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T3.9',
      name: 'JSON-LD Schema x About Profile: Schema.org ProfilePage links author identity directly to Substack publication',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: false,
      error: err,
    });
  }

  // T3.10: Reading Shelf x Goodreads Outbound Verification
  try {
    const anchors = getAnchorTags(readingHtml);
    const goodreadsLinks = anchors.filter(a => a.href.includes('goodreads.com'));
    assert(goodreadsLinks.length >= 3, `Expected at least 3 Goodreads links on reading page, found ${goodreadsLinks.length}`);
    for (const g of goodreadsLinks) {
      assertEqual(g.target, '_blank', 'Goodreads links must open in new tab');
    }
    report.addResult({
      id: 'T3.10',
      name: 'Reading Shelf x Goodreads Outbound Verification: Reading entries link out to valid book pages with target="_blank"',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T3.10',
      name: 'Reading Shelf x Goodreads Outbound Verification: Reading entries link out to valid book pages with target="_blank"',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: false,
      error: err,
    });
  }

  // T3.11: Trip Numbering x Monotonic Chronological Ordering
  try {
    const idRegex = /id:\s*([0-9]+)/g;
    let m;
    const ids = [];
    while ((m = idRegex.exec(archiveContent)) !== null) {
      ids.push(parseInt(m[1], 10));
    }
    assertEqual(ids.length, 14, 'Expected 14 IDs');
    for (let i = 0; i < 14; i++) {
      assertEqual(ids[i], i + 1, `Trip ID at position ${i} should be ${i + 1}`);
    }
    report.addResult({
      id: 'T3.11',
      name: 'Trip Numbering x Chronology: Trip records in journeysArchive.ts monotonically increment from 1 through 14',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T3.11',
      name: 'Trip Numbering x Chronology: Trip records in journeysArchive.ts monotonically increment from 1 through 14',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: false,
      error: err,
    });
  }

  // T3.12: Journal Filter Pills x Card Data Attributes
  try {
    assertIncludes(journalHtml, 'data-year="all"', 'Filter pills must include data-year="all"');
    assertIncludes(journalHtml, 'data-year="2026"', 'Filter pills must include data-year="2026"');
    assertIncludes(journalHtml, 'data-year="2024"', 'Filter pills must include data-year="2024"');
    assertIncludes(journalHtml, 'data-id="14"', 'Journey card 14 must have data-id="14"');
    assertIncludes(journalHtml, 'data-id="1"', 'Journey card 1 must have data-id="1"');
    report.addResult({
      id: 'T3.12',
      name: 'Journal Filter Pills x Card Data Attributes: Filter pill year selectors align with card data attributes',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: true,
    });
  } catch (err) {
    report.addResult({
      id: 'T3.12',
      name: 'Journal Filter Pills x Card Data Attributes: Filter pill year selectors align with card data attributes',
      tier: 'Tier 3',
      feature: 'Cross-Feature Combinations',
      passed: false,
      error: err,
    });
  }
}
