# Xperion · Website Source

This folder contains the full Xperion website source, ready for engineering handoff.

## Quick start

1. **Clean the folder** (one-time):
   ```bash
   bash cleanup.sh
   ```

2. **Read the deployment manifest**: open [`DEPLOY.md`](DEPLOY.md).
   It contains: file list (deploy vs exclude), route suggestions, server-config recommendations, CSP headers, and a pre-deploy verification checklist.

3. **Read the pre-launch audit**: open [`prelaunch_audit`](prelaunch_audit) in a browser.
   It contains: 3 blockers that gate public launch, 7 high-priority items, and an 18-item sign-off checklist.

## Folder map

| File / pattern | Purpose |
|---|---|
| `./` | Landing page (serve at `/`) |
| `about`, `book-a-call`, `careers`, `how-we-work`, `leadership`, `services` | Core company pages |
| `xperion_practice_*.html` (×5) | Practice pages: Resource Augmentation, AI Solutions, Consulting, Marketing, Design & UX |
| `xperion_industry_*.html` (×5) | Industry pages: Healthcare, Financial Services, Manufacturing, Retail, Enterprise SaaS |
| `insights`, `insights-article`, `insights-case-study`, `insights-thought-leadership` | Insights index + three long-form pieces (case study reframed as a playbook in v3.8 - no client-result claims) |
| `404.html` | Branded not-found page |
| `xperion.css` | Shared design system (nav, footer, sand utility, tech stack) |
| `xperion-home.css` | Landing-page styles, extracted from former inline blocks (v3.8). Mapped table of contents at the top of the file. Must load **after** `xperion.css` |
| `xperion-blog.css` | Light-theme reading stylesheet for blog pages (642 lines) |
| `xperion.js` | Nav, scroll progress, magnetic buttons, FAQ accordion, reveal animations |
| `xperion-mark.svg`, `xperion-mark-mono.svg`, `xperion-lockup.svg` | Logo SVGs (3 variants) |
| `xperion-favicon-*.png` (×6), `favicon.ico` | Favicon set |
| `xperion-og-image.png` | Social share image (1200×630) |
| `mark-trans.png` | Transparent PNG mark |
| `manifest.json` | PWA manifest |
| `robots.txt` | Crawler control with defense-in-depth Disallow for internal files |
| `sitemap.xml` | 19 public URLs with priorities |
| `DEPLOY.md` | Engineering handoff: build pipeline, server config, exclude list |
| `cleanup.sh` | Folder cleanup script (Tier 1/2/3) |
| `prelaunch_audit` | **Internal.** Pre-launch audit + blocker checklist |
| `brandbook` | **Internal.** Brand book v3 (Confidential) |
| `design_audit` | **Internal.** Original design audit (superseded by pre-launch audit) |
| `xperion-logo-source.ai` | **Internal.** Adobe Illustrator source |
| `xperion-brand.plugin` | **Internal.** Claude plugin for brand voice |
| `CLAUDE.md` | **Internal.** Project Claude configuration |
| `README.md` | This file |

## What to share with engineering

If you're emailing/zipping this folder for your engineering colleague:

1. Run `bash cleanup.sh` first (removes .bak files; you choose what else to remove)
2. Optionally exclude the **Internal** files listed above - they're not needed for deploy
3. Point them at `DEPLOY.md` as the entry document

## What's blocking public launch

Per `prelaunch_audit`:

- **B1** - Privacy, Terms, Security pages need to be written (currently mailto: stubs)
- **B2** - Healthcare case study has specific operational claims that need client sign-off OR a composite disclaimer
- **B3** - Leadership page publishes named individuals (Syed, Owais) with personal emails - consent required before public deploy

Engineering can deploy everything else; these three items gate launch independently.

## Versioning

- **Brand book version:** v3 (2026-05-22)
- **Site cycle:** post-audit + redesign + pre-launch QA
- **Last folder cleanup:** run `bash cleanup.sh` to perform
