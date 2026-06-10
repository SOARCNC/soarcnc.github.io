# Client Website Starter

Reusable skeleton for the agency client-website workflow (Template v2.x).
**Copy this folder, rename it `{{CLIENT_BRAND_NAME}}-website`, then swap in client content.**

## What's here

```
.
├── source-materials/     # client files — LOCAL ONLY, git-ignored, never commit
├── content/
│   ├── en/               # English copy (markdown) for easy editing
│   └── zh/               # 繁體中文 copy (markdown)
├── src/
│   ├── index.html        # EN pages
│   ├── about.html
│   ├── contact.html      # holds the 5 Tally form placeholders
│   ├── privacy.html
│   ├── zh/               # 繁中 mirror of every EN page
│   └── assets/
│       ├── css/styles.css
│       ├── images/
│       └── icons/
├── robots.txt
├── sitemap.xml
├── CNAME                 # put the bare domain here before go-live
└── .gitignore
```

## Per-client checklist (short form)

1. Fill the 7 worksheet fields and replace every `{{PLACEHOLDER}}` in the HTML, `CNAME`, `robots.txt`, `sitemap.xml`.
2. Drop client files in `source-materials/` (stays local — git-ignored).
3. Phase 1: Home + About + Contact + Privacy → deploy GitHub Pages → Cloudflare proxy → point domain.
4. Phase 2: remaining product/service pages. Phase 3: Careers/News + go-live security review.

## Baked-in non-negotiables

- `<meta charset="UTF-8">` is the first thing in every `<head>`.
- EN pages `lang="en"`; 繁中 pages `lang="zh-Hant"`; `hreflang` pairs link them.
- System Chinese font stack + 繁中 typography rules already in `styles.css`.
- Forms are Tally embed placeholders only — **no customer-data fields in site code.**
- CSP `<meta>` fallback present; real security headers go in Cloudflare.

## Placeholder index (find-and-replace these)

`{{CLIENT_BRAND_NAME}}` · `{{DOMAIN_NAME}}` · `{{LEGAL_NAME}}` · `{{ADDRESS}}` ·
`{{PRIVACY_EMAIL}}` · `{{PAGE_TITLE}}` · `{{META_DESCRIPTION}}` · `{{TAGLINE}}`
