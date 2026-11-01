# CLAUDE.md — Engman Wulff Project Context

## What is this project?

A production-ready static portfolio website for **Engman Wulff**, an African creative and media studio based in Accra, Ghana. The studio works across photography, documentary film, and video production, serving NGOs, development organisations, brands, and institutions across West Africa (Ghana, Burkina Faso, Ivory Coast, Sierra Leone, Togo).

Live domain: **https://engmanwulff.com** (registered on GoDaddy, hosted on Cloudflare Pages)

---

## Architecture Rule — Static Only

**Do not migrate this site to Next.js, Astro, Framer, Nuxt, or any CMS.**

This is a deliberately lean, fast, hand-coded static site. A 6-section portfolio does not need a build pipeline. The entire site is:

```
index.html          ← all markup
styles.css          ← all styles
main.js             ← all behaviour
assets/             ← all project images (copied manually)
wulff.original.html ← untouched prototype backup
```

Support files: `CONTENT.md`, `DESIGN-SYSTEM.md`, `DEPLOY.md`, `robots.txt`, `sitemap.xml`, `site.webmanifest`

---

## Content Rule

**Never invent content.** Every piece of copy, every project title, every stat, and every image reference must trace back to `CONTENT.md`. If something is missing, mark it `[TODO]` and move on. Do not fill gaps with plausible-sounding placeholder text.

---

## Design Tokens (CSS custom properties)

As of the **Nov 2026 minimal-white redesign** (modelled on the clean, airy look of ekowquansah.com) the site is **pure white, minimal, Montserrat**, with gold kept only as an accent and in the logo:

```css
--bg:          #FFFFFF   /* pure white page background */
--ink:         #141414   /* primary text (dark) */
--ink-soft:    #3A3A3A   /* secondary dark text */
--gold:        #C9A96E   /* accent */
--gold-dim:    #9A7A42   /* readable gold on white (eyebrows, focus) */
--line:        rgba(20,20,20,0.12)   /* hairline dividers on white */
--line-strong: rgba(20,20,20,0.22)
--gray:        #6E6A64   /* secondary text */
--hero-text:   #FBFAF8   /* light text over the hero photos */
```

Only two surfaces stay dark: the **hero** (full-bleed photo slideshow with a scrim + light text) and the **lightbox** (immersive viewer). Everything else is white (a couple of sections use `#FAF9F7` for a whisper of contrast). The ethics/clients bands use `#FAF9F7`.

---

## Typography

- **Everything:** Montserrat (300, 400, 500, 600, 700; 300i/400i) — one corporate sans for headings, body, nav, eyebrows, logo context. Light weights (300) for large display; 500/600 for tracked uppercase labels.
- **Eyebrow style:** Montserrat 600, 11px, 0.28em letter-spacing, uppercase, `var(--gold-dim)`
- **Logo (Nov 2026): the "A4 shutter" identity.** An inline SVG in the header and footer — a 6-blade camera-shutter mark (one blade gold `#C9A96E`) + "ENGMAN WULFF" stacked wordmark (Montserrat 600 / 300). It uses `currentColor`, so it's cream over the hero photo (`--hero-text`, with a drop-shadow) and ink on white when the header is `.scrolled`; the gold blade is constant. The mark spins into focus once on load (`@keyframes shutterSpin`, suppressed under reduced-motion). Favicon/app icons (`assets/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`) are the shutter too. The old raster wordmarks (`logo-ew*.webp`) are retired; the original `logo-ew.webp` also had a baked-in "LIGHT" watermark — don't use it.

**History:** Started Cormorant Garamond + Inter on a warm dark palette → briefly all-black (Aug 2026) → a Space Grotesk / Fraunces experiment (reverted) → **Nov 2026: pure-white minimal Montserrat redesign** (current), modelled on ekowquansah.com. All work (photos, films, galleries) was preserved through the reskin; only the look changed.

---

## File Structure

```
/
├── index.html
├── styles.css
├── main.js
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── CONTENT.md          ← single source of truth for all copy & assets
├── CLAUDE.md           ← this file
├── DESIGN-SYSTEM.md
├── DEPLOY.md
├── wulff.original.html ← original prototype, do not modify
└── assets/
    ├── OHNI-00392.jpg  ← hero image
    ├── OHNI-07900.jpg  ← about section image (swap with team photo if available)
    ├── aged1-10.jpg    ← The Last Portrait cover
    ├── ace-35.jpg      ← Love Your Problem cover
    ├── OHNI-06789.jpg  ← OHNI Foundation cover
    ├── NAT082.jpeg     ← Touching Grass cover
    ├── UNIC912.jpeg    ← UNICEF WASH cover
    └── (all gallery images listed in CONTENT.md)
```

---

## Key Interactions

| Component | Behaviour |
|-----------|-----------|
| Header | Fixed; shrinks + blurs on scroll > 40px |
| Hero | Static image, scale-in animation on load |
| Marquee | Auto-scrolling, infinite, no JS |
| Services | Hover expands row padding + slides title right |
| Filmstrip | Drag-to-scroll; click any card → lightbox gallery |
| Lightbox | Full-screen gallery; prev/next; keyboard (←→ Esc) |
| Testimonials | Two-slide carousel, auto-advances every 6s |
| Contact form | Web3Forms POST; loading / success / error states |
| Footer year | Set dynamically via JS (`new Date().getFullYear()`) |

---

## How to Run Locally

No build step needed. Open `index.html` directly in a browser, or use any static server:

```bash
# Python (built-in)
python3 -m http.server 8080

# Node (npx)
npx serve .
```

Then visit http://localhost:8080

Note: images won't load until you copy project files into `/assets/` (see DEPLOY.md).

---

## How to Deploy

See `DEPLOY.md` for full instructions. Short version:

1. Copy all project images into `/assets/`
2. Get a Web3Forms key at web3forms.com and paste into `index.html`
3. Get a Cloudflare Web Analytics token and paste into `index.html`
4. Push to GitHub → connect repo to Cloudflare Pages
5. Set GoDaddy DNS to Cloudflare nameservers (see DEPLOY.md)
