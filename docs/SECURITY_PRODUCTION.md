# 🔒 Production Security Analysis & Hardening

Assessment of the portfolio for public production, including DDoS/DoS exposure
and other attack vectors, with concrete mitigations. Items are marked
**[Done]** (already handled in this repo) or **[Action]** (you must do it).

---

## 0. Architecture in one line

A **static React SPA** built by Vite and served from **Vercel's CDN**, plus
two third-party integrations called from the browser: **EmailJS** (contact
form) and **Neoxr** (AI chat). There is an optional Vercel **edge proxy**
(`api/chat.ts`) for the AI chat.

Because the site is static + CDN-served, the classic "overwhelm my origin
server" DoS has a very small surface — most traffic is absorbed by the CDN.
The realistic risks are **abuse of the third-party integrations**, **secret
leakage**, and **client-side DoS** on weak devices.

---

## 1. Secrets & configuration

- 🔴 **[Action] Rotate any committed secret.** The repository's tracked `.env`
  has contained a real OpenAI-style key (`sk-...`). Treat it as **compromised**:
  rotate/revoke it, and never reference it from client code (it is unused by
  the app, which uses Neoxr).
- 🔴 **[Action] Stop tracking `.env`.** It is listed in `.gitignore` but was
  committed earlier. Run:
  ```bash
  git rm --cached .env && git commit -m "chore: stop tracking .env"
  ```
- ⚠️ **`VITE_` variables are public.** Anything with the `VITE_` prefix is
  inlined into the client bundle. The EmailJS public key and Neoxr usage key
  are *designed* to be public; never put a true secret behind a `VITE_` var.
- ✅ **[Done]** Server-only secrets (the AI proxy) read `NEOXR_*` **without**
  the `VITE_` prefix, so they stay out of the bundle.

---

## 2. HTTP security headers — **[Done]**

Set in `vercel.json` for every route:

| Header | Purpose |
| --- | --- |
| `Content-Security-Policy` | Restricts script/style/img/connect origins → strong XSS & data-exfiltration defense |
| `Strict-Transport-Security` | Forces HTTPS (2-year, preload) |
| `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` | Blocks clickjacking |
| `X-Content-Type-Options: nosniff` | Blocks MIME sniffing |
| `Referrer-Policy` | Limits referrer leakage |
| `Permissions-Policy` | Disables camera/mic/geolocation |
| `Cross-Origin-Opener-Policy` | Isolates the browsing context |

> The CSP allows exactly the origins the app needs: Google Fonts (style/font),
> `cdn.simpleicons.org` (brand icons), `api.neoxr.eu` and `api.emailjs.com`
> (`connect-src`). If you add a new external service, update the CSP or it will
> be blocked. `'unsafe-eval'` is intentionally **not** allowed (so the opt-in
> `eruda` debug console will not run in production — by design).

---

## 3. XSS & injection — low risk

- ✅ **[Done]** No `dangerouslySetInnerHTML`, `eval`, `innerHTML`, or
  `document.write` anywhere in `src/`. All rendered content comes from local
  data / i18n / typed props, and AI replies are rendered as **plain text**.
- ✅ **[Done]** CSP provides defense-in-depth even if a sink is added later.
- ⚠️ **[Action]** Keep it that way — if you ever render Markdown/HTML from the
  AI or a form, sanitize it (e.g. DOMPurify) and never inject raw HTML.

---

## 4. Contact form abuse (EmailJS)

The form calls EmailJS directly from the browser, so the public key is
visible. Without limits it can be scripted to spam your inbox and exhaust your
EmailJS quota.

- 🔴 **[Action] Restrict Allowed Origins** in EmailJS → *Account → Security* to
  your production domain only.
- 🔴 **[Action] Enable EmailJS rate limiting** (per-IP / per-period).
- 🟡 **[Action] Add a bot deterrent:** a hidden honeypot field and/or a CAPTCHA
  (Cloudflare Turnstile or hCaptcha) on the form.
- ✅ **[Done]** Client-side validation and length caps exist (UX layer only —
  not a security boundary).

---

## 5. AI chat abuse (Neoxr)

The Neoxr usage key is public when called from the client, so it can be reused
by others to burn your quota.

- 🟡 **[Action] Use your own Neoxr key** and set per-key rate limits in the
  Neoxr dashboard.
- 🟢 **[Recommended] Route via the edge proxy** `api/chat.ts` so the key is
  server-side (`NEOXR_*`), and add per-IP throttling there.
- ✅ **[Done]** The proxy already enforces request guards: max messages,
  max total characters, and JSON-only handling.

---

## 6. DDoS / DoS

- ✅ **[Done / Inherent]** Static assets are served by **Vercel's global CDN**,
  which absorbs volumetric traffic; there is no always-on origin server to
  overwhelm for the static site.
- 🟡 **[Action] Protect the dynamic endpoints.** Volumetric abuse will instead
  target the *integrations*. Put **rate limiting / WAF** in front of:
  - the EmailJS form (origin lock + CAPTCHA, section 4),
  - the AI chat (key limits / proxy throttle, section 5),
  - the `api/chat.ts` function (add IP-based rate limiting, e.g. Upstash
    Ratelimit, before going live with heavy traffic).
- 🟡 **[Action]** Enable Vercel's **Attack Challenge Mode / Firewall** for the
  project if you expect targeted abuse.
- ✅ **[Done] Client-side DoS resilience.** Heavy WebGL/animation is
  capability-gated and respects `prefers-reduced-motion` + the in-app motion
  toggle, so low-end phones don't lock up.

---

## 7. Dependencies & supply chain

- 🟡 **[Action]** Run `npm audit` (and `npm audit fix`) before each release;
  enable Dependabot/Renovate on the repo.
- 🟡 **[Action]** The brand icons load at runtime from `cdn.simpleicons.org`
  and fonts from Google Fonts. These are allow-listed in the CSP. If you prefer
  zero third-party runtime requests, self-host them.

---

## 8. Pre-launch checklist

- [ ] Rotated and removed any committed secret; `.env` is untracked.
- [ ] All production env vars set in Vercel (not in the repo).
- [ ] EmailJS: allowed origins locked + rate limiting + CAPTCHA/honeypot.
- [ ] Neoxr: own key with rate limits (ideally via the `api/chat.ts` proxy).
- [ ] `npm audit` clean (or known/accepted).
- [ ] Security headers verified in production (e.g. securityheaders.com).
- [ ] CSP verified — no blocked-resource errors in the browser console.
- [ ] CV PDFs contain no data you don't want publicly downloadable.
