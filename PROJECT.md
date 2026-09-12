# Project: reKhoj Travel Architecture & Stability Hardening

## Architecture
Astro v7.3.1 static site (`output: "static"`) with Lenis smooth-scrolling and GSAP ScrollTrigger animation engine, nature-inspired palette token system, Google Fonts typography, responsive layout (<768px mobile CSS scroll-snap vs >=768px pinned horizontal parallax), and offline-first cached RSS feeds.

### Data Flow & Component Hierarchy
```
BaseLayout.astro
├── Header Bar: Left Brand Anchor (collapsed on mobile) + Right Wayfinding Trigger
├── Navigation: Overlay Drawer (all 6 sections + 3 archive routes) + Side Wayfinding Dots (desktop homepage only)
├── Central Scroll Engine: Lenis + GSAP ScrollTrigger synchronized ticker + teardown hooks
└── Page Content (e.g. index.astro)
    ├── #hero: OpeningSequence.astro
    │   ├── Desktop (>=768px): Pinned horizontal parallax (stationary bus + translating road/mountains/milestones)
    │   └── Mobile (<768px): Unpinned vertical flow + touch-native CSS scroll-snap milestone carousel
    ├── #dispatch: FeaturedDispatch.astro
    ├── #atlas: TravelMap.astro (Leaflet 1.9.4, 14 authentic journey pins)
    ├── #consuming: CurrentlyConsuming.astro (Goodreads books + Letterboxd films with empty fallbacks)
    ├── #letters: Dispatches archive preview (Substack with empty fallback card)
    └── #volunteer: Impact & Community section
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Lenis & GSAP ScrollTrigger Sync | `lenis.on('scroll', ScrollTrigger.update)`, GSAP ticker drives `lenis.raf`, `lagSmoothing(0)` | M1 | Follow-up R1 |
| 2 | Teardown & Lifecycle Cleanup | Revert GSAP contexts and destroy Lenis instances on page transitions and unmount | M1 | Follow-up R1 |
| 3 | Asset Preloading & CLS Guard | Preload critical hero visual assets (`/images/bir/bir-hero.jpg`, compass SVG) to keep CLS < 0.1 | M1 | Follow-up R1 |
| 4 | Graceful RSS Fallback UI | Empty-state fallback UI for Substack in `index.astro` and Goodreads/Letterboxd in `CurrentlyConsuming.astro` | M1 | Follow-up R1 |
| 5 | Mobile Header Navigation Clearance | Eliminate 58px button collision on 375px-412px viewports; collapse header labels; relocate telemetry HUD | M1 | Survey / Follow-up R1 |
| 6 | Desktop Side Dots Scoping | Scope side-wayfinding dots to homepage (`/`) to avoid dead anchor links on archive pages | M1 | Survey / Follow-up R1 |
| 7 | Stationary Bus & Pinned Canvas | Pin hero road near bottom; bus stays visually stationary in frame on desktop (>=768px) | M2 | Follow-up R2 |
| 8 | Multi-layer Parallax Depth | Differential horizontal speeds for mountain ridges (0.20x back, 0.45x mid, 1.17x front) | M2 | Follow-up R2 |
| 9 | Chronological Milestones Pacing | 14 altitude milestones pass in sequence with comfortable pacing (~250px vertical scroll per stop) | M2 | Follow-up R2 |
| 10 | Seamless Pin Release & Handoff | Clean release of GSAP pin after 14th milestone, smoothly resuming vertical scroll to `#dispatch` | M2 | Follow-up R2 |
| 11 | Adversarial Test DOM Retention | Maintain exact DOM order of typo-stack, CTA, and photo strip to preserve test suite contracts | M2 | Survey / Adv tests |
| 12 | Mobile Touch-Native Swipe Container | Unpinned touch-native horizontal carousel with CSS scroll-snap (`scroll-snap-type: x mandatory`) on <768px | M3 | Follow-up R3 |
| 13 | Responsive Peeking & Zero Scrolljacking | 270px cards with 71px-108px peeking on 375px-412px viewports; zero horizontal overflow | M3 | Follow-up R3 |
| 14 | E2E Test Suite Expansion & Audit | 100% pass on master test runner (`node tests/e2e/runner.js`), build pass, and forensic audit | M4 | Follow-up Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Root-Cause Stability, Sync & Fallbacks | Lenis/GSAP installation, scroll engine sync, teardown, RSS UI fallbacks, nav clearance, preloading | None | DONE |
| M2 | Pinned Horizontal Hero Parallax (Desktop) | Stationary bus, translating road/mountains/milestones, parallax speed ratios, clean pin release | M1 | DONE |
| M3 | Mobile Touch Experience & Geometry | CSS scroll-snap milestone carousel (<768px), 375/390/412px geometry verification, zero scrolljacking | M1, M2 | IN_PROGRESS |
| M4 | Final Integration, Test Suite Pass & Audit | Build exit 0, master runner pass, test suite expansion, forensic integrity audit | M1, M2, M3 | PLANNED |

## Interface Contracts
### Scroll Engine (`src/scripts/scroll-engine.ts`)
- Exports `initScrollEngine()` returning `{ lenis, ctx, destroy }`.
- `lenis.on('scroll', ScrollTrigger.update)` keeps ScrollTrigger position strictly synchronized with Lenis virtual scroll.
- `gsap.ticker.add((time) => lenis.raf(time * 1000))` binds RAF execution to GSAP's optimized ticker.
- `destroy()` calls `ctx.revert()` and `lenis.destroy()`.

### Hero Stage (`src/components/OpeningSequence.astro`)
- Desktop container (`>= 768px`): `#hero.opening-sequence-hero` with `.stationary-bus-anchor` (stationary layer) and `.horizontal-parallax-stage` (translating canvas).
- Mobile container (`< 768px`): `.mobile-milestones-wrapper` containing `.mobile-milestones-track` (`scroll-snap-type: x mandatory; overscroll-behavior-x: contain;`).
- Retains DOM sequence: `.hero-typo-stack` -> `.eyebrow` -> `h1.hero-publication-title` -> `p.hero-tagline` -> `.hero-actions` -> `.hero-subscribe-cta` -> `.hero-photo-strip` -> `.hero-photo`.

## Code Layout
- `package.json`: Dependency manifests (`lenis`, `gsap`).
- `src/layouts/BaseLayout.astro`: Shell layout, asset preloads, header bar, overlay menu, side wayfinding dots, scroll engine initialization.
- `src/scripts/scroll-engine.ts`: Centralized Lenis & GSAP ScrollTrigger synchronization and teardown logic.
- `src/components/OpeningSequence.astro`: Desktop pinned horizontal hero parallax + mobile touch CSS scroll-snap milestones.
- `src/pages/index.astro`: Homepage layout, Substack fallback UI card.
- `src/components/CurrentlyConsuming.astro`: Goodreads & Letterboxd empty state fallback UI cards.
- `src/pages/reading/index.astro`: Reading shelf empty state fallback UI cards.
- `tests/e2e/runner.js`: Master test suite runner.
- `tests/e2e/`: Auxiliary and tier test suites.
