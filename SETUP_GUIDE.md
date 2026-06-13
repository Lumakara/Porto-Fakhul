# 🛠️ Porto-Fakhul — Manual Setup Guide

Panduan ini menjelaskan semua hal yang perlu kamu tambahkan secara manual agar portfolio berjalan penuh: API key AI, foto profil, screenshot proyek, dan lagu background.

---

## 1. 🤖 API Key AI (OpenAI)

Fitur **AI Chat** (tombol FAB di kanan bawah) butuh API key OpenAI.

### Cara Tercepat — File `.env` (lokal)

1. Buat file bernama **`.env`** di root proyek (sejajar `package.json`)
2. Isi dengan:
   ```
   VITE_AI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. Restart dev server (`npm run dev`) — selesai.

> File `.env` sudah ada di `.gitignore` — kunci **tidak akan ter-commit** ke GitHub.

### Cara Produksi — Vercel (Direkomendasikan)

Jika di-deploy ke **Vercel**, jangan pakai file `.env`. Set di sini:

```
Vercel Dashboard → Project Settings → Environment Variables
  Key   : OPENAI_API_KEY
  Value : sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  Env   : Production, Preview, Development
```

Ini menggunakan serverless proxy di `api/chat.ts` — kunci **tidak pernah dikirim ke browser**.

### Cara Alternatif — Hardcode (hanya untuk testing lokal)

Edit `src/config/ai.ts`, ganti baris:
```ts
const MANUAL_API_KEY = '';
```
menjadi:
```ts
const MANUAL_API_KEY = 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
```

> ⚠️ Jangan commit file ini jika kunci sudah diisi!

---

## 2. 🖼️ Foto Personal Branding (About Section)

Letakkan foto di folder: **`public/brand/`**

### Nama file wajib (format `.webp`):

| File | Deskripsi |
|------|-----------|
| `public/brand/portrait-1.webp` | Foto studio / headshot formal |
| `public/brand/portrait-2.webp` | Foto di workstation / coding |
| `public/brand/portrait-3.webp` | Foto candid / outdoor |
| `public/brand/portrait-4.webp` | Foto presentasi / berbicara |
| `public/brand/portrait-5.webp` | Foto casual |

### Tips Konversi ke WebP:
- Gunakan [Squoosh](https://squoosh.app) (gratis, browser-based)
- Ukuran ideal: **1000×1000px** (square) atau **750×1000px** (3:4 portrait)
- Quality: **80%**, format: **WebP**

> Kalau belum ada foto, UI tetap tampil dengan placeholder gradien + inisial "FR" — tidak ada yang rusak.

---

## 3. 📸 Screenshot / Gambar Proyek (Project Detail Gallery)

Tiap proyek punya 3 slot gambar (field `screens` di `src/data/projects.ts`).

### Langkah:

**a) Buat folder untuk tiap proyek di `public/projects/`:**
```
public/
  projects/
    bot-whatsapp-multifungsi/
      screen-1.webp
      screen-2.webp
      screen-3.webp
    ecommerce-platform/
      screen-1.webp
      screen-2.webp
      screen-3.webp
    smart-inventory/
      screen-1.webp
      ...
    management-platform/
      screen-1.webp
      ...
    whatsapp-chat-clone/
      screen-1.webp
      ...
```

**b) Edit `src/data/projects.ts` — ganti field `screens` dari label teks ke path gambar:**

Contoh untuk proyek `bot-whatsapp-multifungsi`:
```ts
// SEBELUM (hanya label teks)
screens: ['Menu Bot', 'Panel AI Chat', 'Sistem Game'],

// SESUDAH (path gambar nyata)
screens: [
  '/projects/bot-whatsapp-multifungsi/screen-1.webp',
  '/projects/bot-whatsapp-multifungsi/screen-2.webp',
  '/projects/bot-whatsapp-multifungsi/screen-3.webp',
],
```

Ulangi untuk semua 5 proyek.

> Kalau gambar belum ada, gallery tetap tampil dengan placeholder gradient — aman.

---

## 4. 🎵 Lagu Background Music

Letakkan file audio di folder: **`public/music/`**

### Nama file wajib:

| Playlist    | File yang dibutuhkan              |
|-------------|-----------------------------------|
| Ambient     | `public/music/ambient.mp3`        |
| Lo-Fi       | `public/music/lofi.mp3`           |
| Electronic  | `public/music/electronic.mp3`     |
| None        | *(tidak perlu file)*              |

### Format yang didukung:
- `.mp3` (paling aman, semua browser)
- `.ogg` atau `.m4a` (perlu edit `src` di `src/data/music.ts`)

### Tips:
- Durasi ideal: **1–3 menit loop**
- Ukuran file: di bawah **5 MB** per lagu untuk loading cepat
- Sumber lagu bebas royalti: [Pixabay Music](https://pixabay.com/music/), [Free Music Archive](https://freemusicarchive.org/)

> Musik baru aktif setelah user klik di halaman (browser policy autoplay). User enable via Settings panel.

---

## 5. 🔗 Link GitHub & Social

Edit file `src/data/projects.ts`, bagian atas:

```ts
const GITHUB_PROFILE = 'https://github.com/lumakara';      // ← ganti dengan GitHub kamu
const PORTFOLIO_REPO = 'https://github.com/Lumakara/Porto-Fakhul'; // ← repo portfolio
```

Untuk link per-proyek (live URL, demo, dll), edit field `links` di tiap objek proyek:
```ts
links: [
  { label: 'Live', href: 'https://nama-proyek.vercel.app', type: 'live' },
  { label: 'Repository', href: 'https://github.com/username/nama-repo', type: 'repo' },
],
```

---

## 6. 📝 Info Pribadi (Nama, Email, Lokasi)

Cari dan edit di `src/data/` atau `src/contexts/LanguageContext.tsx` — bagian teks hero, about, dan contact.

---

## 7. ✅ Checklist Setup

Centang setelah selesai:

- [ ] File `.env` dibuat dengan `VITE_AI_API_KEY`
- [ ] 5 foto `portrait-1.webp` sampai `portrait-5.webp` ditaruh di `public/brand/`
- [ ] Folder `public/projects/` dibuat dengan screenshot tiap proyek
- [ ] Field `screens` di `src/data/projects.ts` diupdate ke path gambar
- [ ] 3 file lagu ditaruh di `public/music/` (`ambient.mp3`, `lofi.mp3`, `electronic.mp3`)
- [ ] Link GitHub di `src/data/projects.ts` diupdate
- [ ] `OPENAI_API_KEY` diset di Vercel (untuk deployment produksi)

---

## 8. 🚀 Cara Deploy ke Vercel

```bash
# Install Vercel CLI (kalau belum)
npm i -g vercel

# Di folder proyek
vercel

# Atau push ke GitHub → Vercel otomatis deploy
```

Setelah deploy, set environment variable di Vercel Dashboard seperti dijelaskan di bagian 1.

---

## Struktur Folder Akhir (setelah setup manual)

```
public/
  brand/
    portrait-1.webp   ← foto kamu
    portrait-2.webp
    portrait-3.webp
    portrait-4.webp
    portrait-5.webp
  music/
    ambient.mp3       ← lagu kamu
    lofi.mp3
    electronic.mp3
  projects/
    bot-whatsapp-multifungsi/
      screen-1.webp   ← screenshot proyek
      screen-2.webp
      screen-3.webp
    ecommerce-platform/
      screen-1.webp
      ...
    (dst. untuk tiap proyek)

.env                  ← BUAT INI (jangan di-commit!)
  VITE_AI_API_KEY=sk-...
```
