# Design System Blueprint — the_musafir_paaji (reKhoj)

> Based on the **Web Design Approach** workflow:
> *Research → System → Design → Development*
> *"Design first. Systemize second. Develop with clarity."*

---

## 1. Stack & Architecture

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Astro 5 (Static Output) | Zero-JS default, instant page transitions, Content Collections |
| **Styling** | Vanilla CSS Design Tokens | Maximum control, zero CSS runtime, hardware-accelerated transforms |
| **Motion** | CSS Spring Micro-interactions | `cubic-bezier(0.16, 1, 0.3, 1)`, scroll reveals, radar pulse |
| **Mapping** | Leaflet + Google Maps Satellite | Real-world mountain & terrain exploration without API keys |
| **Typography** | Google Fonts (Fraunces + Source Sans 3) | Editorial bookcraft serif paired with clean legible sans |
| **Deployment** | Static (GitHub Pages / Vercel) | Edge cached, 100/100 Lighthouse performance |

---

## 2. Typography System

*"Font pairing decides how the website feels before the user reads a single word."*

### Font Pairing
- **Display & Headings**: `Fraunces` (Serif, variable optical size, soft warmth, editorial poise)
- **Body & Metadata**: `Source Sans 3` / `Inter` (Sans-serif, neutral, highly legible at small sizes)
- **Eyebrows & Field Badges**: Monospace / Sans uppercase with `letter-spacing: 0.08em`

### Strict Type Scale
| Role | Size | Font | Line Height | Use Case |
|---|---|---|---|---|
| **Display H1** | `64px` (`3.4rem` clamp) | Fraunces 700 | `1.1` | Hero titles, landing page anchors |
| **Section H2** | `40px` (`2.2rem`) | Fraunces 600 | `1.2` | Section headings, dispatch titles |
| **Card H3** | `26px` (`1.45rem`) | Fraunces 600 | `1.3` | Journey cards, itinerary titles |
| **Subhead** | `20px` (`1.2rem`) | Source Sans 500 | `1.4` | Lead paragraphs, story excerpts |
| **Body** | `16px–17px` | Source Sans 400 | `1.65` | Long-form reading, field dispatches |
| **Small / Captions** | `13px–14px` | Source Sans 500 | `1.5` | Memories, highlight lists, meta lines |
| **Micro / Eyebrow** | `11px–12px` | Source Sans 700 | `1.2` | Tags, dates, coordinates, badges |

---

## 3. Color System: The 60–30–10 Rule

*"Color should create hierarchy — not noise."*

```
┌──────────────────────────────────────┬──────────────────────┬──────────┐
│  60% PRIMARY (Dominant Surfaces)    │  30% SECONDARY       │  10%     │
│  Light: #EFF3F0 (Mist) / #FFFFFF    │  Typography & Depth  │  ACCENT  │
│  Dark:  #0E2E25 (Deodar Forest)     │  #15221E / #40524C   │  #C85A32 │
└──────────────────────────────────────┴──────────────────────┴──────────┘
```

### Palette Breakdown
- **60% Primary Surfaces**:
  - Light mode: `--bg-light` (`#EFF3F0`), `--bg-light-card` (`#FFFFFF`)
  - Dark mode (Atlas/Hero): `--bg-dark` (`#0E2E25`), `--bg-dark-surface` (`#0A241D`)
- **30% Secondary & Typography**:
  - Dark text on light: `--text-light-primary` (`#15221E`), `--text-light-secondary` (`#40524C`)
  - Light text on dark: `--text-dark-primary` (`#EFF3F0`), `--text-dark-secondary` (`#B9CAC2`)
  - Borders: `rgba(14, 46, 37, 0.12)` (light) / `rgba(239, 243, 240, 0.12)` (dark)
- **10% Accent (Focal Points & CTAs Only)**:
  - `--accent-terracotta`: `#C85A32` (Primary CTAs, active pills, route pins, key links)
  - `--accent-sage`: `#B4CCC0` / `#A2D1BB` (Soft contextual highlights, sub-badges)

---

## 4. Spacing & Layout Tokens

- **Container Max Width**: `1040px` (Clean reading margins, no excessive sprawl)
- **Reading Max Width**: `720px` (Optimal 65–75 characters per line for long-form essays)
- **Grid Gutters**: `12px` (mobile), `24px` (tablet), `32px` (desktop)
- **Card Padding**: `24px 28px` (desktop), `18px 16px` (mobile)
- **Border Radius**:
  - Cards: `16px`
  - Photo Cells: `10px`
  - Pills & Badges: `999px` (full pill)

---

## 5. Component Library

### 1. Unified Journey Card
- **Header**: Trip number pill (`Trip #01`), role badges (`With Raw Diaries`, `Trip Leader`), date badge.
- **Location Banner**: Destination, region, and trail coordinates.
- **Title & Summary**: Fraunces title + unhurried two-sentence summary.
- **3-Photo Collage**: Responsive 3-cell grid with hover zoom (`scale(1.04)`).
- **Memories Box**: 3 bulleted field marks with terracotta bullets.
- **Single CTA**: Dedicated, high-contrast `Read Full Dispatch & Story →`.

### 2. Expedition Atlas (Map Stage)
- **Provider**: Google Maps Satellite Hybrid + Dark Pine Atlas mode switch.
- **Interaction**: Mouse wheel & 2-finger touchpad zoom (`scrollWheelZoom: true`).
- **Pins**: Radar-pulsing custom DOM beacons with location labels.
- **Floating Field Card**: Inspect summary, altitudes, dates, and click through.

### 3. Filter Controls
- **Pill Buttons**: Rounded `999px`, active terracotta fill, hover elevation.

---

## 6. Motion & Animation Rules

- **Standard Easing Curve**: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy spring, natural stop)
- **Hover Micro-interaction**:
  - Cards: `translateY(-3px)`, subtle shadow depth `box-shadow: 0 8px 30px rgba(0,0,0,0.06)`
  - Link Arrows: `.arrow-spring` translates `+4px` on hover
  - Photos: `transform: scale(1.04)` over `0.55s`
- **Scroll Entrance**: IntersectionObserver triggers `.reveal-on-scroll` with `stagger-1`, `stagger-2`, `stagger-3`.

---

## 7. Development Flow Checklist

- [x] **01 Structure**: Clean Astro pages and Markdown Content Collections.
- [x] **02 Components**: Reusable, tokenized cards, maps, navigation, and book lists.
- [x] **03 Responsive UI**: Mobile-first breakpoints at `640px` and `768px`.
- [x] **04 Interactions**: Smooth zooming, region filtering, timeline sorting.
- [x] **05 Polish**: Privacy assurance (100% face-free), zero duplicate buttons, high contrast.
- [x] **06 Deploy**: Fast static compilation, SEO schemas, valid OG tags.
