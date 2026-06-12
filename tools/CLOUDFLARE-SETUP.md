# Cloudflare — HTTPS + Security setup (soartaiwan.com)

Cloudflare sits **in front of GitHub Pages**: it provides HTTPS, a CDN, DDoS
protection, and the security headers. Do this **after** the site is pushed to
GitHub and GitHub Pages is enabled.

> ⚠️ **This changes the live domain.** soartaiwan.com currently serves the old
> Google Site. Step 3 (nameservers) and Step 4 (DNS) repoint the domain to the
> new site. Only do them once you've reviewed the new site and are ready to switch.

---

## Order of operations
1. Push code to GitHub → enable **GitHub Pages** (Settings → Pages → Deploy from `main`).
2. In GitHub Pages, set the **custom domain** to `soartaiwan.com` (the `CNAME` file already contains it).
3. Add the site to **Cloudflare** and move nameservers.
4. Add **DNS records** for GitHub Pages.
5. Turn on **SSL + security settings + headers**.
6. Verify (securityheaders.com → target grade **A**).

---

## Step 3 — Add site to Cloudflare
1. Cloudflare dashboard → **Add a site** → `soartaiwan.com` → Free plan.
2. Cloudflare shows **2 nameservers** (e.g. `xxx.ns.cloudflare.com`).
3. At your **domain registrar**, replace the current nameservers with those two.
   (Propagation: minutes to a few hours.)

## Step 4 — DNS records (in Cloudflare → DNS)
GitHub Pages apex + www:

| Type | Name | Value | Proxy |
|---|---|---|---|
| A | `@` | `185.199.108.153` | 🟠 Proxied |
| A | `@` | `185.199.109.153` | 🟠 Proxied |
| A | `@` | `185.199.110.153` | 🟠 Proxied |
| A | `@` | `185.199.111.153` | 🟠 Proxied |
| AAAA | `@` | `2606:50c0:8000::153` | 🟠 Proxied |
| AAAA | `@` | `2606:50c0:8001::153` | 🟠 Proxied |
| AAAA | `@` | `2606:50c0:8002::153` | 🟠 Proxied |
| AAAA | `@` | `2606:50c0:8003::153` | 🟠 Proxied |
| CNAME | `www` | `SOARCNC.github.io` | 🟠 Proxied |

> 🔑 **Cert gotcha:** first set these to **DNS only** (grey cloud) until GitHub Pages
> shows "✅ HTTPS provisioned" for the custom domain (can take ~15–30 min). Then
> switch them to **Proxied** (orange cloud) and set SSL to Full (strict) below.

## Step 5 — SSL/TLS + speed
- **SSL/TLS → Overview:** `Full (strict)`
- **SSL/TLS → Edge Certificates:**
  - **Always Use HTTPS:** On
  - **Automatic HTTPS Rewrites:** On
  - **Minimum TLS Version:** TLS 1.2
  - **HSTS (HTTP Strict Transport Security):** Enable → max-age 12 months, include subdomains, preload
- **Speed → Optimization / Brotli:** On.

## Step 6 — Security headers (Rules → Transform Rules → Modify Response Header → Create)
Create one rule, "Security headers", applied to all incoming requests, **Set static** for each:

| Header | Value |
|---|---|
| `Content-Security-Policy` | `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' https://tally.so; frame-src https://tally.so; connect-src 'self'; font-src 'self'; base-uri 'self'; form-action 'self' https://tally.so; frame-ancestors 'none'; upgrade-insecure-requests` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` |

> The pages already ship a `<meta http-equiv="Content-Security-Policy">` fallback;
> the Cloudflare header above is the authoritative one and also covers `frame-ancestors`
> (clickjacking) and HSTS, which a meta tag can't set.

## Step 7 — Verify
- Visit `https://soartaiwan.com` and `https://www.soartaiwan.com` → both load over HTTPS, no warnings.
- https://securityheaders.com/?q=soartaiwan.com → aim for **A**.
- Browser DevTools console → no CSP violations on any page (especially the Tally forms on /contact).
- Lighthouse (DevTools) → Performance / SEO / Best-Practices.

## Notes
- If the Tally forms get blocked by CSP after go-live, confirm `script-src` and
  `frame-src` include `https://tally.so` (they do above). If Tally serves embeds
  from another subdomain, add it here.
- Keep **2FA** on the Cloudflare account and the GitHub account.
