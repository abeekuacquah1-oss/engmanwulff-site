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

```css
--ink:        #0E0E0E   /* near-black background */
--ink-soft:   #1A1714   /* footer, about-copy contrast */
--paper:      #F5F0E8   /* warm off-white text/backgrounds */
--paper-warm: #FAF8F4   /* lighter warm white */
--gold:       #C9A96E   /* primary accent */
--gold-dim:   #9A7A42   /* darker gold for light backgrounds */
--line:       rgba(245,240,232,0.14)   /* subtle dividers on dark */
--line-dark:  rgba(26,23,20,0.12)      /* dividers on light */
--gray:       #8C887F   /* secondary text */
```

---

## Typography

- **Display / serif:** Cormorant Garamond (300, 400, 400i, 500) — headings, hero, quotes, logo
- **UI / sans:** Inter (300, 400, 500, 600) — body, labels, nav, eyebrows
- **Eyebrow style:** Inter 500, 11px, 0.32em letter-spacing, uppercase, `var(--gold)`

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
