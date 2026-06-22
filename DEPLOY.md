# DEPLOY.md — Engman Wulff Deployment Guide

Live domain: **https://engmanwulff.com** (domain registered at GoDaddy)
Host: **Vercel** (chosen — free, fast, auto-deploys from GitHub)
Repo: **https://github.com/abeekuacquah1-oss/engmanwulff-site**

---

## ACTIVE SETUP — Vercel + GoDaddy domain

The code lives on GitHub. Vercel imports the repo and redeploys automatically
on every `git push`. GoDaddy stays as the domain registrar only (DNS points
at Vercel).

### Deploy on Vercel
1. https://vercel.com → Sign up → **Continue with GitHub**
2. **Add New… → Project** → import `engmanwulff-site`
3. Framework Preset: **Other**, Build Command: *(empty)*, Output Directory: *(default)*
4. **Deploy** → live at `engmanwulff-site.vercel.app`

### Add the custom domain
5. Project → **Settings → Domains** → add `engmanwulff.com` and `www.engmanwulff.com`

### GoDaddy DNS records (My Products → engmanwulff.com → DNS)

| Type  | Name | Value                   | TTL |
|-------|------|-------------------------|-----|
| A     | `@`  | `76.76.21.21`           | 600 |
| CNAME | `www`| `cname.vercel-dns.com`  | 600 |

- Delete any existing `A` record on `@` pointing to a GoDaddy parked IP first.
- If a `www` CNAME already exists, edit it rather than adding a duplicate.
- Propagation: ~10–30 min. Vercel issues SSL automatically.

### Future updates
Edit files locally → `git add -A && git commit -m "..." && git push`.
Vercel auto-deploys the new version in ~30s.

---

## Alternative host (Cloudflare Pages) — kept for reference

---

## Pre-Flight Checklist

Before deploying, confirm all of these are done:

- [ ] All project images copied into `/assets/` (see CONTENT.md for full list)
- [ ] Files with spaces renamed (see table below)
- [ ] `[YOUR_WEB3FORMS_KEY]` replaced in `index.html` (line search: `web3forms`)
- [ ] `[YOUR_CF_ANALYTICS_TOKEN]` replaced in `index.html` (line search: `cf-beacon`)
- [ ] `assets/favicon.ico` added (32×32 or 64×64 — export from the logo SVG)
- [ ] `assets/icon-192.png` and `assets/icon-512.png` added (for PWA manifest)
- [ ] `assets/og-share.jpg` added (1200×630px crop of a strong project image — used for social sharing)

---

## Rename These Files Before Copying to /assets/

| Original (in /Downloads/) | Rename to (in /assets/) |
|---------------------------|--------------------------|
| `LOVE YOUR PROBLEM/ace-10 (2).jpg` | `ace-10(2).jpg` |
| `LOVE YOUR PROBLEM/ace-14 (1).jpg` | `ace-14(1).jpg` |
| `LOVE YOUR PROBLEM/ace-19 (1).jpg` | `ace-19(1).jpg` |
| `LOVE YOUR PROBLEM/ace-24 (1).jpg` | `ace-24(1).jpg` |

All other filenames copy as-is (no spaces or special characters).

---

## Step 1 — Push to GitHub

1. Create a new **private** GitHub repository named `engmanwulff-site`
2. In Terminal, from the `potfolio website` folder:

```bash
git init
git add index.html styles.css main.js robots.txt sitemap.xml site.webmanifest assets/
git commit -m "Initial site build"
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/engmanwulff-site.git
git push -u origin main
```

---

## Step 2 — Deploy on Cloudflare Pages

1. Go to https://dash.cloudflare.com → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. Authorise Cloudflare to access your GitHub account
3. Select the `engmanwulff-site` repository
4. Set build settings:
   - **Framework preset:** None
   - **Build command:** *(leave blank)*
   - **Build output directory:** `/` (or leave blank — the root is the output)
5. Click **Save and Deploy**

Cloudflare will give you a preview URL like `engmanwulff-site.pages.dev`. The site should be live there within ~60 seconds.

---

## Step 3 — Connect the Custom Domain (engmanwulff.com)

### Option A — Point GoDaddy nameservers to Cloudflare (Recommended)

This gives you full Cloudflare control (CDN, SSL, analytics, future redirects).

**In Cloudflare:**
1. Go to https://dash.cloudflare.com → **Add a Site** → enter `engmanwulff.com` → choose **Free plan**
2. Cloudflare will scan existing DNS records. Review and keep any you need.
3. Cloudflare will give you two nameserver addresses. They look like:
   ```
   XXX.ns.cloudflare.com
   YYY.ns.cloudflare.com
   ```
   (The exact values are unique to your account — copy them from the Cloudflare dashboard.)

**In GoDaddy:**
1. Log in → **My Products** → find `engmanwulff.com` → **DNS** → **Nameservers**
2. Select **I'll use my own nameservers**
3. Delete the existing GoDaddy nameservers
4. Enter the two Cloudflare nameservers from above
5. Save. DNS propagation takes 1–48 hours (usually under 30 min).

**Then in Cloudflare Pages:**
1. Go to your Pages project → **Custom domains** → **Set up a custom domain**
2. Enter `engmanwulff.com` → Cloudflare adds the CNAME automatically
3. Also add `www.engmanwulff.com` and set it to redirect to `engmanwulff.com`

SSL is automatic (free Let's Encrypt cert via Cloudflare).

---

### Option B — Keep GoDaddy DNS, add CNAME only

If you prefer to keep GoDaddy as your DNS provider:

**In GoDaddy DNS settings, add:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | `www` | `engmanwulff-site.pages.dev` | 1 Hour |
| CNAME | `@` | `engmanwulff-site.pages.dev` | 1 Hour |

> Note: GoDaddy does not support CNAME on the root (`@`) for all plans. If yours doesn't allow it, use Option A (Cloudflare nameservers) instead.

Then in Cloudflare Pages → **Custom domains**, add `engmanwulff.com` so Cloudflare issues an SSL cert for it.

---

## Step 4 — Verify Deployment

After DNS propagates, check:

- https://engmanwulff.com loads the site with valid SSL (padlock in browser)
- https://www.engmanwulff.com redirects to https://engmanwulff.com
- All images load (no broken image icons)
- Contact form submits (you receive an email at info@engmanwulff.com)

---

## Web3Forms Setup (Contact Form — Free)

1. Go to https://web3forms.com
2. Enter `info@engmanwulff.com` → click **Create Access Key**
3. Copy the key
4. In `index.html`, find `[YOUR_WEB3FORMS_KEY]` and replace it with your key
5. Test: submit the form → check info@engmanwulff.com inbox (check spam folder first time)

Free tier: 250 submissions/month. That's more than enough for a studio inquiry form.

---

## Cloudflare Web Analytics Setup (Free, Privacy-Friendly)

1. In Cloudflare dashboard → **Web Analytics** → **Add a site** → enter `engmanwulff.com`
2. Copy the JavaScript snippet token (looks like: `abc123def456...`)
3. In `index.html`, find `[YOUR_CF_ANALYTICS_TOKEN]` and replace it
4. No cookies, no GDPR banner needed — Cloudflare Web Analytics is privacy-first

---

## Future Updates

To update the site after launch:

```bash
# Make edits to index.html / styles.css / main.js
git add -A
git commit -m "Describe what changed"
git push
```

Cloudflare Pages auto-deploys on every push to `main`. New version live in ~30 seconds.

---

## Adding Social Links Later

When Instagram/YouTube/LinkedIn handles are confirmed, add them to:
1. `CONTENT.md` — update the social table
2. `index.html` — find the `<!-- SOCIAL LINKS -->` comment in the contact section and uncomment/fill in the `<a>` tags
