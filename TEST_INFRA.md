# E2E Test Infrastructure & Test Architecture

## Overview
This document specifies the architecture, test harness, feature mapping, execution instructions, and pass/fail semantics of the 4-tier opaque-box E2E test suite for `travel.varneet.in`.

The suite verifies the site against the authoritative project requirements in `ORIGINAL_REQUEST.md` and the architecture contracts in `PROJECT.md`. It performs requirement-driven, opaque-box validation directly against the static site generation output in `dist/`, stylesheets, content collections, and data modules.

---

## Test Architecture & Guiding Principles

1. **Opaque-Box Requirement-Driven Testing**: Tests treat the website build output as a black box, verifying observable DOM structures, attributes, typography declarations, CSS design tokens, static file routing, JSON-LD schemas, and syndication contracts without coupling to internal Astro implementation details.
2. **Zero-Dependency Resilience**: Built entirely using native Node.js ESM (`node:fs`, `node:path`, `node:assert`). It does not rely on heavy, flaky headless browser runtimes or fragile third-party npm test frameworks, ensuring instant, deterministic execution across all environments and CI/CD pipelines.
3. **Multi-Tiered Defect Isolation**: Test suites are structured into four progressive tiers. Any failure is immediately locatable to a specific feature, boundary condition, cross-module interaction, or holistic user journey.
4. **Content Authenticity & Forensic Hardening**: The suite strictly validates zero synthetic, placeholder ("lorem ipsum"), dummy, or hallucinated content across all pre-rendered HTML routes.

---

## Directory Structure

```
tests/
└── e2e/
    ├── helpers/
    │   ├── assertions.js          # Lightweight test reporter, assertions, and summary formatting
    │   ├── html-parser.js         # Zero-dependency regex-based HTML/CSS extractor & DOM inspector
    │   └── test-context.js        # File loaders and directory path resolution utilities
    ├── tier1-features.test.js     # Tier 1: Feature Coverage (34 tests across 6 core features)
    ├── tier2-boundaries.test.js   # Tier 2: Boundary & Corner Cases (22 tests)
    ├── tier3-combinations.test.js # Tier 3: Cross-Feature Combinations (12 pairwise tests)
    ├── tier4-scenarios.test.js    # Tier 4: Real-World Application Scenarios (12 tests)
    └── runner.js                  # Master test runner orchestrating all tiers
```

---

## How to Execute the Tests

### Primary Execution Command
```bash
node tests/e2e/runner.js
```

### JSON Output Mode (for CI/CD reporting)
```bash
node tests/e2e/runner.js --json
```

---

## 4-Tier Test Taxonomy & Coverage

### Tier 1: Feature Coverage (>=5 tests per feature area)
Covers baseline happy paths and interface contract compliance for all 6 major feature areas:
- **Feature 1: Brand Tokens & Visual System**: Primary dark surface (`#0A241D`), terracotta accent (`#C85A32`), sage accent (`#B4CCC0`), `Fraunces` variable serif, `Source Sans 3` editorial sans, Google Fonts CDN link, `--container-max` (1040px) and `--reading-max` (720px) tokens. (7 tests: `T1.1.1`–`T1.1.7`)
- **Feature 2: Substack RSS Ingestion & Offline Cache**: Persistent offline cache file `src/data/substackCache.json`, `src/lib/substack.ts` module export, SubstackPost data interface contract, 4000ms fetch timeout, offline fallback logic, decommissioning of `api.rss2json.com`. (6 tests: `T1.2.1`–`T1.2.6`)
- **Feature 3: Authentic Empty State & Content Integrity**: Empty state container `#substackEmptyCard` / `.substack-empty-state`, authentic editorial copy, CTA button linking to `https://rekhoj.substack.com`, zero "lorem ipsum" filler text, zero mock author personas. (5 tests: `T1.3.1`–`T1.3.5`)
- **Feature 4: Mobile-First Layout & Responsiveness**: Mobile viewport meta tag on all pages, mobile navigation drawer / hamburger toggle element, accessible tap targets (min 44px), responsive photo collage single-column collapse, container horizontal gutters. (5 tests: `T1.4.1`–`T1.4.5`)
- **Feature 5: Atlas 14-Pin Synchrony & Leaflet Gesture Safety**: Plotting of all 14 authentic journeys, coverage of 4 states (HP, KA, UP, RJ), Leaflet 1.9.4 CSS/JS assets, mobile gesture scroll-trapping prevention, pin links to journal detail pages. (5 tests: `T1.5.1`–`T1.5.5`)
- **Feature 6: SSG Static Routing & SEO Metadata**: 14 markdown files in `src/content/journal/`, 14 pre-rendered static slug routes in `dist/journal/`, core page generation (`/`, `/about`, `/reading`, `/journal`), complete OpenGraph metadata, Twitter cards (`summary_large_image`), canonical URLs. (6 tests: `T1.6.1`–`T1.6.6`)

*Subtotal: 34 tests*

### Tier 2: Boundary & Corner Cases (>=5 tests per area)
Covers stress limits, extreme viewports, fault-tolerant offline handling, and rogue color elimination:
- **Viewport Boundaries (375px, 390px, 412px)**: CSS `max-width: 100%` and `overflow-x: hidden` enforcement, no rigid fixed widths exceeding mobile viewports, fluid grid scaling, zero horizontal scrollbars, extreme title length word wrapping. (5 tests: `T2.1.1`–`T2.1.5`)
- **RSS & Cache Fault Tolerance**: Offline cache empty array `[]` handling, corrupt cache JSON error recovery, empty RSS XML (`<rss><channel></channel></rss>`) safety, missing `<enclosure>` banner handling, description truncation (max 160 chars). (5 tests: `T2.2.1`–`T2.2.5`)
- **Atlas & Coordinate Boundaries**: Pin latitude (-90..90) and longitude (-180..180) range checks, Indian subcontinent geo bounding box, altitude limits (peak 3,450m), optional journal detail slug safety. (4 tests: `T2.3.1`–`T2.3.4`)
- **Content & Schema Boundaries**: Journey years within 2023–2026, non-empty date strings, strict role taxonomy validation, markdown frontmatter minimum 3 images. (4 tests: `T2.4.1`–`T2.4.4`)
- **Rogue Color Boundaries**: Complete elimination of `#55E1A8`, `#48cae4`, `#071914` from stylesheets and templates, verification of core triad consistency. (4 tests: `T2.5.1`–`T2.5.4`)

*Subtotal: 22 tests*

### Tier 3: Cross-Feature Combinations (Pairwise)
Validates interactions between disparate subsystems:
- `T3.1`: Mobile navigation drawer x Desktop navigation routing synchrony
- `T3.2`: Substack outbound links x Tabnabbing security (`target="_blank"` + `rel="noopener noreferrer"`)
- `T3.3`: External social and partner links x Security attributes
- `T3.4`: Leaflet interactive atlas x Mobile gesture safety
- `T3.5`: Journeys archive data records x SSG pre-rendered HTML routes
- `T3.6`: Markdown frontmatter image paths x Physical disk assets in `public/`
- `T3.7`: Journey card tags x Normalized lowercase hyphenated hashtag syntax
- `T3.8`: Design tokens x Editorial dark pine and light paper section alternation
- `T3.9`: JSON-LD Schema.org ProfilePage x Substack publication profile link
- `T3.10`: Reading shelf book companion logs x Validated Goodreads outbound links
- `T3.11`: Trip numbering x Monotonic chronological ordering (1 to 14)
- `T3.12`: Journal filter pill year selectors x Card data-year attributes

*Subtotal: 12 tests*

### Tier 4: Real-World Application Scenarios
Simulates realistic end-user flows and end-to-end operational conditions:
- **Scenario 1: End-to-End User Navigation Journey** (5 tests):
  - `T4.1.1`: User lands on Home with valid branding and navigation
  - `T4.1.2`: User navigates to `/journal`, exploring 14-trip archive and Substack section
  - `T4.1.3`: User drills into a specific expedition (`/journal/shangarh-meadows`)
  - `T4.1.4`: User navigates to `/reading`, inspecting trail companion books
  - `T4.1.5`: User visits `/about`, inspecting homestay volunteering pitch and contact channels
- **Scenario 2: Offline Build Resilience & Fallback Integrity** (2 tests):
  - `T4.2.1`: Build succeeds during offline network isolation via `substackCache.json`
  - `T4.2.2`: Journal page maintains complete visual structure when RSS feed has 0 items
- **Scenario 3: Zero Synthetic / Mock Content Forensic Audit** (2 tests):
  - `T4.3.1`: Whole-site scan verifies 0 occurrences of placeholder text across all HTML pages
  - `T4.3.2`: Every documented trip corresponds to a verified real-world Indian expedition
- **Scenario 4: Global Brand System Consistency** (2 tests):
  - `T4.4.1`: Dark Pine surface token (`#0A241D`) uniformly anchors all page layouts
  - `T4.4.2`: Terracotta accent token (`#C85A32`) uniformly highlights actions and markers
- **Scenario 5: Mobile Usability & Tap Target Safety** (1 test):
  - `T4.5.1`: All interactive elements conform to accessible touch dimensions (min 44px)

*Subtotal: 12 tests*

---

## Test Count Threshold Verification

The project mandate specifies:
$$\text{Total Test Count} \ge 11 \times N + \max(5, \lfloor N/2 \rfloor)$$
where $N = 6$ major feature areas.

$$\text{Threshold} = 11 \times 6 + \max(5, 3) = 66 + 5 = 71 \text{ tests}$$

| Tier | Name | Test Count |
|------|------|------------|
| Tier 1 | Feature Coverage | 34 |
| Tier 2 | Boundary & Corner Cases | 22 |
| Tier 3 | Cross-Feature Combinations | 12 |
| Tier 4 | Real-World Application Scenarios | 12 |
| **Total** | **All Tiers Combined** | **80** |

**80 tests $\ge$ 71 tests** (exceeds requirement by 9 tests).

---

## Pass/Fail Semantics & Exit Codes

- **Exit Code 0**: All 80 tests passed cleanly. Output meets all acceptance criteria.
- **Exit Code 1**: One or more tests failed. The runner outputs a breakdown grouped by Tier, showing the exact test ID, descriptive name, and verbatim failure reason for rapid defect resolution.
