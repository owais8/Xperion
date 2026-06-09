# Xperion — Deployment Manifest

**Cut date:** 2026-05-22
**Audience:** engineering, for build pipeline + deploy config
**Source of truth:** this folder, `/Documents/Claude/Projects/Xperion Brand Builder/`

---

## 1. Pre-deploy cleanup (run once, locally)

A tiered cleanup script is included: `cleanup.sh`. It prompts before each tier so nothing is deleted by accident.

```bash
cd "/Users/themacshop/Documents/Claude/Projects/Xperion Brand Builder"
bash cleanup.sh             # interactive — recommended
bash cleanup.sh --dry-run   # preview only, no deletion
```

What it cleans:

- **Tier 1 (always safe):** 16 zero-byte `xperion_*.html.bak` placeholder files
- **Tier 2 (recommended):** `design_audit` — superseded by `prelaunch_audit`
- **Tier 3 (optional):** `CLAUDE.md` and `xperion-brand.plugin` — only delete these if no further Claude sessions will run on this folder

Verify with `ls xperion_*.html.bak` — should print "No such file or directory".

---

## 2. Files to DEPLOY (public)

### HTML pages (19)

| File | Route | Notes |
|---|---|---|
| `./` | `/` | Landing. Configure web server to serve at root. |
| `about` | `/about` (or `.html`) | |
| `book-a-call` | `/book-a-call` | Primary CTA destination |
| `careers` | `/careers` | ⚠ Gate behind audit action C3 (placeholder job listings) |
| `how-we-work` | `/how-we-work` | |
| `leadership` | `/leadership` | ⚠ Gate behind blocker B3 (consent for named individuals) |
| `services` | `/services` | |
| `practice-resource-augmentation` | `/practices/resource-augmentation` | |
| `practice-ai-solutions` | `/practices/ai-solutions` | |
| `practice-consulting` | `/practices/consulting` | |
| `practice-marketing` | `/practices/marketing` | |
| `practice-design-ux` | `/practices/design-ux` | |
| `industry-healthcare` | `/industries/healthcare` | |
| `industry-financial-services` | `/industries/financial-services` | |
| `industry-manufacturing` | `/industries/manufacturing` | |
| `industry-retail` | `/industries/retail` | |
| `industry-enterprise-saas` | `/industries/enterprise-saas` | |
| `insights` | `/insights` | |
| `insights-article` | `/insights/ai-pilot-second-90` | Lightweight slug per article |
| `insights-case-study` | `/insights/ambient-clinical-14-weeks` | ⚠ Gate behind blocker B2 (claim review) |
| `insights-thought-leadership` | `/insights/agency-model-is-broken` | |

### Required legal pages (NOT YET WRITTEN — see blocker B1)

| File | Status |
|---|---|
| `privacy` | MUST WRITE before launch |
| `terms` | MUST WRITE before launch |
| `security` | MUST WRITE before launch |

### Stylesheets / scripts (3)

- `xperion.css` — shared design system, 1799 lines, ~82 KB
- `xperion-blog.css` — light reading theme for blog pages, 642 lines, ~18 KB
- `xperion.js` — shared JS for nav, magnetic buttons, scroll progress, reveal animations, FAQ accordion

### Static assets

- `xperion-mark.svg` — primary logo mark (full gradient)
- `xperion-mark-mono.svg` — monochrome mark variant
- `xperion-lockup.svg` — full lockup
- `xperion-og-image.png` — social share image (1200×630)
- `mark-trans.png` — transparent PNG variant
- `xperion-favicon-32.png` / `48.png` / `64.png` / `128.png` / `192.png` / `512.png` — favicon set
- `favicon.ico` — fallback favicon
- `manifest.json` — PWA manifest

### Infrastructure (newly added in this cycle)

- `robots.txt` — crawler control with Disallow entries for internal HTMLs (defense in depth)
- `sitemap.xml` — listing all 19 public pages
- `404.html` — branded not-found page, must be wired as the server's 404 handler

---

## 3. Files to EXCLUDE from deploy (internal-only)

These files exist in the project folder for internal use. **They must not be served on the public domain.** Add them to the build pipeline's exclusion list AND to `robots.txt` (already done — both layers of defense).

| File | Purpose |
|---|---|
| `brandbook` | Internal brand guidelines (160 KB), labeled "Confidential" |
| `design_audit` | Internal design audit report from this cycle |
| `prelaunch_audit` | This handoff document |
| `xperion-logo-source.ai` | Adobe Illustrator source — never deploy |
| `xperion-brand.plugin` | Internal Claude plugin file |
| `CLAUDE.md` | Project-level Claude instructions |
| `DEPLOY.md` | This document |
| `xperion_*.html.bak` (16 files) | Should already be deleted per step 1 |

Suggested build-pipeline exclude pattern (adapt to your stack):

```
brandbook
design_audit
prelaunch_audit
xperion-logo-source.ai
xperion-brand.plugin
CLAUDE.md
DEPLOY.md
*.bak
.DS_Store
.git/
```

---

## 4. Server / hosting configuration

### Recommended

- **HTTPS only** with HSTS header (`max-age=31536000; includeSubDomains; preload`)
- **Serve `./` at `/`** (either via server rewrite or rename to `index.html` in the deploy bundle)
- **Configure 404 handler** to serve `/404.html` (still HTTP 404 status, not 200)
- **Brotli + gzip** compression for `*.html`, `*.css`, `*.js`, `*.svg`
- **Cache-Control** for static assets: `public, max-age=31536000, immutable` on favicons + logo SVGs; `public, max-age=86400` on `*.css` + `*.js`; `public, max-age=300` on HTML pages

### Content-Security-Policy header (sane default)

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://cdn.simpleicons.org;
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action mailto:;
```

Note `'unsafe-inline'` for `style-src` and `script-src` is required because the pages use inline `<style>` blocks and inline event handlers in `xperion.js`. If you want to remove `'unsafe-inline'`, extract all inline CSS to external sheets and use nonces or hashes — that's a larger refactor.

### Other security headers (paste into nginx/Caddy/Cloudflare config)

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()
```

---

## 5. Pre-deploy verification checklist

Before pushing to production, verify:

- [ ] `.bak` files deleted (step 1 above)
- [ ] Privacy, Terms, Security pages written and reviewed by counsel (blocker B1)
- [ ] Healthcare case study has client sign-off OR composite disclaimer (blocker B2)
- [ ] Syed + Owais consent to public name + email (blocker B3)
- [ ] LinkedIn `href="#"` links on leadership page either filled in with real URLs or removed
- [ ] Social handles in footer verified to exist (LinkedIn, Instagram, X, YouTube)
- [ ] USPTO trademark clearance for "Xperion" name + logo
- [ ] Internal HTMLs excluded from build pipeline AND blocked in `robots.txt`
- [ ] `sitemap.xml` deployed at `/sitemap.xml`
- [ ] `robots.txt` deployed at `/robots.txt`
- [ ] `404.html` wired as server's 404 handler
- [ ] HTTPS certificate active with HSTS
- [ ] CSP + security headers in place
- [ ] Lighthouse audit ≥90 on Performance / Accessibility / Best Practices / SEO for landing + one practice page + one blog page
- [ ] axe-core or WAVE accessibility audit passes on every page
- [ ] Tested on actual iOS Safari + Android Chrome + Firefox + Edge (not just desktop Chrome)
- [ ] All internal links resolve (no 404s when clicking through site)
- [ ] Operational commitments honored (48hr proposal, 1–2wk placement, 30-day guarantee)
- [ ] Google Search Console + sitemap submitted post-launch

---

## 6. Post-launch action queue

These don't block launch but should be tackled in the first sprint:

- **Inline the simpleicons SVGs** as a single sprite served from `xperion.ai/icons.svg` — removes the cdn.simpleicons.org dependency (currently 60+ requests on practice pages with tech-stack sections)
- **Migrate landing's inline CSS into `xperion.css`** — landing carries ~1300 lines of inline styles that duplicate the shared stylesheet (see audit finding #26 in `design_audit`)
- **Add analytics** (Plausible, Fathom, or GA4) with proper Privacy Policy disclosure
- **Set up form-handler** for `book-a-call` if the page evolves beyond mailto
- **Surface NYC + Islamabad geography in connected page heroes** (currently only on landing + brandbook hero copy; the footer tagline now mentions both on every page, but the connected page heros don't)
- **Replace Unicode glyph icons** (◆ ⊞ ▲ ◇) in nav dropdowns + section eyebrows with inline SVG icons (renders inconsistently across OSes)

---

## 7. Open files referenced by this doc

- Full design audit (32 findings): `design_audit`
- Pre-launch audit + checklist (this doc's parent): `prelaunch_audit`
- Brand book (v3, internal): `brandbook`
