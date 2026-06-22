# DESIGN-SYSTEM.md — Engman Wulff Visual Language

Preserve everything documented here. If a future session changes any of these values, it must be intentional and flagged.

---

## Colour Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--ink` | `#0E0E0E` | Body background, dark sections |
| `--ink-soft` | `#1A1714` | Footer, submit button, about body text areas |
| `--paper` | `#F5F0E8` | Primary text on dark, light section backgrounds |
| `--paper-warm` | `#FAF8F4` | Reserved / hover states |
| `--gold` | `#C9A96E` | Primary accent — eyebrows, hover underlines, selection highlight |
| `--gold-dim` | `#9A7A42` | Gold on light backgrounds (services, about, contact) |
| `--line` | `rgba(245,240,232,0.14)` | Dividers on dark backgrounds |
| `--line-dark` | `rgba(26,23,20,0.12)` | Dividers on light backgrounds |
| `--gray` | `#8C887F` | Secondary/supporting text |

Text on light sections (services, about, contact) uses `#54504a` for body copy and `#6b665c` for supporting text.

---

## Typography

### Typefaces
- **Cormorant Garamond** — display, headings, hero, pull quotes, logo, filmstrip card titles
  - Weights used: 300 (roman & italic), 400, 500
- **Inter** — all UI text, body copy, labels, nav, eyebrows, form fields
  - Weights used: 300, 400, 500, 600

### Scale
| Role | Size | Weight | Notes |
|------|------|--------|-------|
| Hero title | `clamp(48px, 8vw, 124px)` | 300 | Cormorant, line-height 0.96 |
| Section title | `clamp(36px, 4.2vw, 58px)` | 300 | Cormorant, line-height 1.05 |
| Service row title | `clamp(28px, 3.6vw, 46px)` | 400 | Cormorant |
| About h2 | `clamp(30px, 3.6vw, 46px)` | 300 | Cormorant |
| Quote text | `clamp(26px, 3.4vw, 42px)` | 300i | Cormorant italic |
| Contact title | `clamp(40px, 6vw, 84px)` | 300 | Cormorant |
| Body copy | 15–15.5px | 300 | Inter, line-height 1.8–1.85 |
| Eyebrow | 11px | 500 | Inter, 0.32em tracking, uppercase |
| Nav links | 12px | — | Inter, 0.18em tracking, uppercase |
| Frame title | 30px | 400 | Cormorant |
| Frame tag | 10.5px | — | Inter, 0.2em tracking, uppercase, `--gold` |

---

## Spacing Scale

- Section padding: `160px 0` (desktop), `100px 0` (≤980px)
- Max content width: `1360px` (`.wrap`)
- Horizontal page padding: `48px` (desktop), `28px` (≤980px)
- Section head bottom margin: `88px`
- Service row padding: `38px 0` → hover `50px 0`

---

## Responsive Breakpoints

| Breakpoint | Changes |
|------------|---------|
| `≤ 980px` | Desktop nav hidden → hamburger menu; about/contact/form grids collapse to 1-col; process grid → 2-col; service row hides description column; hero/filmstrip padding reduces |
| `≤ 600px` | Process grid → 1-col; filmstrip frames shrink (`80vw`, `480px` tall); about stats wrap; tall frame height normalises |

---

## Signature Components

### Fixed Nav
- Transparent at top; blurs + darkens on `scrollY > 40px`
- Logo SVG shrinks from 34px → 26px tall on scroll
- Gold underline slide-in on desktop link hover
- CTA button: gold-dim border → gold fill on hover
- Mobile: fullscreen overlay slides down from top (`.mobile-nav.open`)

### Hero
- Full-viewport, static image with CSS gradient overlay
- Image scales from 1.08 → 1.00 on load (`heroIn` keyframe, 2.4s)
- Eyebrow, title, sub-copy each fade+slide up with staggered delays (0.6s, 0.8s, 1.1s)
- Gradient: `rgba(14,14,14,0.25) 0% → rgba(14,14,14,0.35) 45% → rgba(14,14,14,0.92) 100%`
- Scroll cue fades in at 1.6s delay

### Marquee Strip
- Pure CSS infinite scroll (`@keyframes scroll`, 32s linear)
- Gold uppercase Inter labels separated by Cormorant italic dashes
- No JS — only `prefers-reduced-motion` can pause it

### Services Hover Rows
- CSS grid: `100px 1fr 320px 40px`
- Row hover: padding expands (`38px` → `50px`), title translates right 8px, arrow rotates 45°
- All transitions: `cubic-bezier(.16,.84,.44,1)`

### Filmstrip
- CSS flex, `overflow-x: auto`, `scrollbar-width: none`
- Drag-to-scroll (mousedown/mousemove in main.js, velocity 1.4×)
- Cards are 520px wide (max) × 640px; `.tall` cards are 720px with `-40px` top margin for visual rhythm
- Image hover: `scale(1.02) → scale(1.1)`, desaturate 15% → full colour
- **Clicking any card opens the lightbox gallery**

### Lightbox
- Fixed fullscreen overlay, `z-index: 500`
- Opens with `opacity: 0 → 1` transition; body overflow locked while open
- Prev/next via arrow buttons or keyboard `←` / `→`
- Dismiss via `×` button, clicking backdrop, or `Escape`
- Bottom bar: category + year tag, project title, description, image counter
- Images displayed with `object-fit: contain` — handles both portrait and landscape

### Reveal on Scroll
- Elements with `.reveal` start at `opacity: 0; translateY(28px)`
- IntersectionObserver adds `.in` at `threshold: 0.12` (observed once then detached)
- `prefers-reduced-motion`: all animations/transitions set to `0.01ms`

### Testimonial Carousel
- Two slides; active slide shown, inactive `display:none`
- Dot navigation + prev/next buttons
- Auto-advances every 6 seconds

### Floating-Label Form
- Labels positioned absolute, animate up on focus or when field has value
- Uses `:placeholder-shown` to detect empty state
- Select field uses same pattern with always-raised label
- Submits to Web3Forms endpoint; shows loading/success/error inline states

### About Section
- 2-column grid, 90px gap (collapses to 1-col at 980px)
- Image has `aspect-ratio: 4/5` with `::after` gold border inset 18px
- Stats bar separated by top border, three columns with large Cormorant number + small uppercase label

### Process Cards
- 4-column grid with 1px gap on `var(--line)` background (gap creates divider lines)
- Each card: large italic Cormorant step number, heading, body copy
- Collapses to 2-col at 980px, 1-col at 600px

### Footer
- Two-row: logo + nav links; then copyright + email
- Year set dynamically by JS
- Background: `--ink-soft`
