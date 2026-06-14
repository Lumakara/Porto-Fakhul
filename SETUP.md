# 🛠️ Manual Setup Checklist

Everything that must be configured **by hand** before this portfolio is fully
functional in production. Work top-to-bottom.

---

## 1. Install & environment

```bash
npm install
cp .env.example .env
```

Fill in `.env`. **Important:** every variable is prefixed `VITE_`, which means
it is **bundled into the public client JavaScript**. Only ever put values here
that are safe to expose publicly.

| Variable | Required? | Public? | Notes |
| --- | --- | --- | --- |
| `VITE_EMAILJS_PUBLIC_KEY` | Yes (for contact form) | ✅ public by design | From EmailJS dashboard |
| `VITE_EMAILJS_SERVICE_ID` | Yes | ✅ | EmailJS service |
| `VITE_EMAILJS_TEMPLATE_CONTACT` | Yes | ✅ | Notification template ID |
| `VITE_EMAILJS_TEMPLATE_AUTOREPLY` | Optional | ✅ | Auto-reply template ID |
| `VITE_NEOXR_BASE_URL` | Optional | ✅ | Defaults to `https://api.neoxr.eu/api` |
| `VITE_NEOXR_API_KEY` | Optional | ✅ usage key | Get your own at [neoxr.eu](https://api.neoxr.eu) |
| `VITE_NEOXR_PRIMARY` | Optional | ✅ | Defaults to `/gpt4` |
| `VITE_NEOXR_FALLBACK` | Optional | ✅ | Defaults to `/llama` |

> ⛔ **Never** place a real secret (e.g. an `sk-...` OpenAI key, a database
> URL, a private API token) in a `VITE_` variable — it will be visible to
> anyone who views the site source. See `docs/SECURITY_PRODUCTION.md`.

---

## 2. CV PDFs  (Download CV menu)

Drop three files in `public/cv/` (see `public/cv/README.md`):

- `public/cv/cv-ats-web-dev.pdf`
- `public/cv/cv-ats-umum.pdf`
- `public/cv/cv-design-umum.pdf`

Filenames are **case-sensitive** in production.

---

## 3. Images & media

| Folder | What to add |
| --- | --- |
| `public/brand/` | `avatar.webp`, `cover.webp`, `portrait-1.webp` … `portrait-5.webp` |
| `public/projects/{project-id}/` | `cover.webp` + `screen-1.webp`, `screen-2.webp`, … |
| `public/music/` | `ambient.mp3`, `lofi.mp3`, `electronic.mp3` (optional) |
| `public/` | `og-preview.jpg` (1200×630 social card), `favicon.svg` |

Missing images fail gracefully (a clean placeholder is shown), so the layout
never breaks while you upload assets.

---

## 4. EmailJS (contact form)

1. Create an account at [emailjs.com](https://www.emailjs.com).
2. Create an email **service** and two **templates** (notification + auto-reply).
   Reference HTML lives in `public/emailjs-templates/`.
3. Put the IDs/keys in `.env` (table above), or run `npm run setup:emailjs`.
4. **Lock it down:** in EmailJS → *Account → Security*, set **Allowed Origins**
   to your production domain only, and enable rate limiting.
5. Full guide: `docs/EMAILJS_SETUP_GUIDE.md`.

---

## 5. AI assistant (Neoxr) — optional

- Works out of the box with a shared default key, which is **rate-limited**.
- For production, get your own key at [api.neoxr.eu](https://api.neoxr.eu) and
  set `VITE_NEOXR_API_KEY`.
- To hide the key from the client, route requests through the included edge
  proxy `api/chat.ts` (set `NEOXR_*` — **without** the `VITE_` prefix — in
  Vercel env vars).

---

## 6. Deploy (Vercel)

1. Import the repo into Vercel.
2. Add every `.env` variable under *Project Settings → Environment Variables*.
3. Deploy. `vercel.json` already handles SPA rewrites, clean URLs, and security
   headers.

---

## 7. Before going public

Run through `docs/SECURITY_PRODUCTION.md` — especially rotating any secret that
was ever committed, and confirming `.env` is no longer tracked by git.
