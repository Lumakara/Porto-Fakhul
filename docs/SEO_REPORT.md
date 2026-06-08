# SEO & Discoverability Report

A portfolio's core job is to be **found and shared**. This is where the project is weakest relative to its visual quality.

---

## 1. Rendering Model — Critical

- The app is **client-side rendered only** (Vite SPA). `index.html` ships an empty `<div id="root">`; all content is injected by JS.
- Worse, `App.tsx` gates the entire app behind `isLoading` until `Preloader` completes (~2–3s). Even JS-executing crawlers may see only the preloader.
- **Impact:** Search engines and social/link-preview bots (LinkedIn, WhatsApp, Slack, Twitter/X, Discord) that don't fully execute JS see **no real content** — no headings, no bio, no projects.
- **Fix (pick one):**
  - **SSG/prerender** the home + 404 routes (`vite-plugin-prerender` / `@prerenderer`, or `vite-react-ssg`), **or**
  - migrate to a meta-framework (**Astro** or **Next.js**) — Astro is ideal here: keep React islands for the interactive bits, ship static HTML for everything else.
  - This is the single highest-leverage SEO change.

---

## 2. Metadata Audit (`index.html`)

| Tag | Status | Finding |
|---|---|---|
| `<title>` | ✅ | "Fakhul Rohman \| Portfolio" — fine |
| `<meta name="description">` | ✅ | Present (Indonesian) — fine |
| `<meta name="keywords">` | ⚠️ | Deprecated/ignored by Google; harmless |
| `lang="en"` | ❌ | Content is Indonesian; mismatch (also a11y A-10). Set `lang="id"` |
| `<meta name="language" content="Indonesian">` | ⚠️ | Non-standard; conflicts with `lang="en"` |
| Canonical (`<link rel="canonical">`) | ❌ | Missing |
| Viewport | ✅ | Present |
| Favicon | ✅ | `favicon.svg` present |

### Open Graph / Social

| Tag | Status | Finding |
|---|---|---|
| `og:type`, `og:url`, `og:title`, `og:description` | ✅ | Present |
| `og:image` → `https://porto-fakhul.vercel.app/og-preview.jpg` | ❌ | **File does not exist** in `public/`. Every share renders a broken/blank card. |
| `og:locale` | ❌ | Missing — should be `id_ID` |
| `og:site_name` | ❌ | Missing |
| Twitter Card (`twitter:card`, `twitter:title`, etc.) | ❌ | Entirely missing |

---

## 3. Structured Data — Missing
- No JSON-LD. For a personal portfolio, a **`Person`** schema (name, jobTitle, address `Depok, Jawa Barat`, `sameAs` GitHub/LinkedIn, email) is high-value and can yield rich results / knowledge-panel signals.
- Consider also `WebSite` + `BreadcrumbList` if routes expand.

---

## 4. Crawl Infrastructure — Missing

| Asset | Status | Action |
|---|---|---|
| `public/robots.txt` | ❌ Missing | Add with `Sitemap:` reference |
| `public/sitemap.xml` | ❌ Missing | Add (even a single-URL sitemap helps) |
| `public/og-preview.jpg` | ❌ Missing | Create a 1200×630 branded card |

---

## 5. Heading Hierarchy — OK
- Home: one `<h1>` (Hero "Where / Creativity / Meets Technology"), section `<h2>`s (About, Projects, Skills, Contact, footer CTA), nested `<h3>/<h4>` in cards/timeline. Logical.
- 404: its own `<h1>`. Fine.
- **Minor:** Hero `<h1>` is split across animated `<span>`s — ensure the accessible name reads as a coherent sentence (it does, since spans are inline text).

---

## 6. Routing & Indexing
- No real router. `App.tsx` treats any `pathname !== '/'` as 404, and `vercel.json` rewrites everything to `index.html`. So deep links can't be indexed as distinct pages. Fine for a one-pager, but if blog/case-study routes are added later, adopt a real router + per-route prerender.

---

## 7. Prioritized SEO Backlog

| ID | Action | Effort | Priority |
|---|---|---|---|
| SEO-1 | Prerender/SSG (or migrate to Astro/Next) so HTML contains content | L | Critical |
| SEO-2 | Create & reference real `og-preview.jpg` (1200×630) | S | Critical |
| SEO-3 | Fix `lang` → `id`, add `og:locale=id_ID`, `og:site_name` | XS | High |
| SEO-4 | Add Twitter Card tags | XS | High |
| SEO-5 | Add `Person` JSON-LD | S | High |
| SEO-6 | Add `robots.txt` + `sitemap.xml` + canonical | S | High |
| SEO-7 | Remove preloader gate from crawl path (tie to Perf P-3) | M | High |

**Acceptance:** Lighthouse SEO ≥ 95; valid Rich Results test for `Person`; non-broken OG/Twitter preview verified via sharing debuggers; `view-source` shows real headings/text.
