# 🛠️ Manual Setup — Porto-Fakhul

Panduan **lengkap dan detail** untuk semua hal yang harus kamu tambahkan secara
manual: API key AI, konfigurasi EmailJS (form kontak + auto-reply), serta file
media (foto, banner, screenshot, musik).

> Semua kunci di sisi browser (prefix `VITE_`) **ikut ter-bundle** dan bisa
> dilihat pengunjung. Itu wajar untuk EmailJS *public key*. Untuk OpenAI di
> produksi, pakai serverless proxy (lihat bagian 1B).

---

## 0. File `.env` (ringkasan semua variabel)

Buat file bernama **`.env`** di root proyek (sejajar `package.json`). Salin
templat ini lalu isi sesuai punyamu:

```env
# ─── AI Chat (OpenAI) ────────────────────────────────────────────────
VITE_AI_API_KEY=sk-kunci-utama-kamu
VITE_AI_API_KEY_2=sk-kunci-cadangan-kamu        # opsional (fallback otomatis)

# ─── EmailJS (form kontak) ───────────────────────────────────────────
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_CONTACT=template_xxxxxxx    # notifikasi → masuk ke Gmail kamu
VITE_EMAILJS_TEMPLATE_AUTOREPLY=template_yyyyyyy  # balasan otomatis → ke pengirim
```

> `.env` sudah ada di `.gitignore` — kunci **tidak** akan ter-commit.
> Setelah mengubah `.env`, **restart** `npm run dev` (atau redeploy di Vercel).

---

## 1. 🤖 AI Chat (OpenAI)

Chat bot mencoba sumber kunci secara berurutan dan **otomatis fallback**:

1. Serverless proxy `/api/chat` (kunci server, paling aman)
2. Kunci dari panel **Settings** di web (kalau pengunjung mengisi sendiri)
3. `VITE_AI_API_KEY` (kunci #1)
4. `VITE_AI_API_KEY_2` (kunci #2 — cadangan)

Kalau gagal, chat menampilkan **log error detail** (klik "Error logs" di balon
merah) yang menunjukkan persis di langkah mana dan kenapa (status HTTP + pesan
dari OpenAI), lalu mencoba kunci berikutnya.

### 1A. Cara cepat (lokal) — file `.env`
Isi `VITE_AI_API_KEY` (dan opsional `VITE_AI_API_KEY_2`) seperti contoh di atas.

Alternatif tanpa `.env`: buka `src/config/ai.ts` dan isi:
```ts
const MANUAL_API_KEY   = 'sk-...';   // kunci utama
const MANUAL_API_KEY_2 = 'sk-...';   // kunci cadangan
```

### 1B. Produksi (Vercel) — paling aman
Set di **Vercel → Project Settings → Environment Variables** (sisi server,
TIDAK pakai prefix `VITE_`):

```
OPENAI_API_KEY    = sk-kunci-utama
OPENAI_API_KEY_2  = sk-kunci-cadangan   (opsional)
```

Proxy `api/chat.ts` membaca ini dan **tidak pernah** mengirim kunci ke browser.
Setelah menambah env var, **Redeploy** agar aktif.

> Cara dapat API key: https://platform.openai.com/api-keys
> Pastikan akun punya saldo/billing aktif, kalau tidak OpenAI mengembalikan
> error 429 (quota) dan akan terlihat jelas di log.

---

## 2. ✉️ EmailJS — Form Kontak + Auto-Reply

Alur yang dibangun:
**Pengunjung kirim pesan → masuk ke Gmail kamu (notifikasi) → balasan otomatis
dikirim ke email pengunjung.** Web menampilkan log detail (berhasil / gagal di
mana & kenapa).

### Langkah-langkah

1. **Daftar** di https://www.emailjs.com (gratis).
2. **Email Services** → *Add New Service* → pilih **Gmail** → hubungkan akun
   Gmail kamu. Catat **Service ID** (mis. `service_ab12cde`).
3. **Email Templates** → buat **DUA** template:

   **Template A — Notifikasi (masuk ke Gmail kamu)**
   - *To Email*: `{{to_email}}` (atau langsung email kamu)
   - *From Name*: `{{from_name}}`
   - *Reply To*: `{{reply_to}}`
   - *Subject*: `Pesan baru dari {{name}}`
   - *Content*: tampilkan `{{name}}`, `{{email}}`, `{{message}}`, `{{time}}`
   - Catat **Template ID** → ini `VITE_EMAILJS_TEMPLATE_CONTACT`.

   **Template B — Auto-Reply (balasan ke pengirim)**
   - *To Email*: `{{to_email}}` ← penting, ini diisi email pengirim otomatis
   - *Subject*: `Terima kasih sudah menghubungi, {{name}}!`
   - *Content*: **salin isi file** [`docs/emailjs-autoreply-template.html`](./emailjs-autoreply-template.html)
     lalu tempel di editor template (mode *Code/HTML*).
   - Catat **Template ID** → ini `VITE_EMAILJS_TEMPLATE_AUTOREPLY`.

4. **Account → General** → salin **Public Key** → ini `VITE_EMAILJS_PUBLIC_KEY`.
5. Isi keempat nilai ke `.env` (lihat bagian 0), lalu restart/redeploy.
6. (Disarankan) **Account → Security → Allowed Origins**: tambahkan domain
   web kamu (mis. `https://porto-fakhul.vercel.app`) agar kunci tidak disalahgunakan.

### Variabel template yang dikirim aplikasi
Aplikasi mengirim superset nama variabel umum, jadi kamu bebas memakai yang mana:

| Variabel        | Isi                                  |
|-----------------|--------------------------------------|
| `{{name}}` / `{{from_name}}` | Nama pengirim          |
| `{{email}}` / `{{from_email}}` / `{{reply_to}}` | Email pengirim |
| `{{message}}`   | Isi pesan                            |
| `{{title}}`     | "New message from <nama>"            |
| `{{time}}`      | Waktu kirim (WIB)                    |
| `{{to_name}}`   | Nama tujuan                          |
| `{{to_email}}`  | Email tujuan (kamu / pengirim)       |

> Kalau salah satu env var EmailJS belum diisi, form akan **gagal dengan log
> jelas** menyebut variabel mana yang hilang. Auto-reply bersifat *best-effort*:
> kalau hanya auto-reply yang gagal, pesan utama tetap terkirim.

---

## 3. 🖼️ File Media Lokal (taruh di folder `public/`)

File di `public/` disajikan dari root situs. Jadi `public/brand/cover.webp`
diakses sebagai `/brand/cover.webp`.

### 3A. About — banner & avatar (WAJIB agar tidak tampil placeholder)
| File                      | Dipakai untuk            | Rasio ideal |
|---------------------------|--------------------------|-------------|
| `public/brand/cover.webp` | Banner sampul section About | ~16:5 (mis. 1200×360) |
| `public/brand/avatar.webp`| Foto avatar (kotak)      | 1:1 (mis. 400×400)    |

### 3B. About — photo strip (sudah ada, bisa diganti)
`public/brand/portrait-1.webp` … `portrait-5.webp` (rasio 3:4). Klik foto di web
untuk memperbesar + navigasi prev/next.

### 3C. Project — cover kartu & banner detail
Secara default kartu proyek & banner halaman detail memakai **screenshot
pertama** (`screen-1.webp`) tiap proyek — jadi sudah langsung jalan.

Kalau mau cover khusus (beda dari galeri), tambahkan file:
```
public/projects/<id-proyek>/cover.webp
```
lalu set field `cover` di `src/data/projects.ts`, contoh:
```ts
{
  id: 'ecommerce-platform',
  cover: '/projects/ecommerce-platform/cover.webp',
  ...
}
```
ID proyek yang tersedia: `bot-whatsapp-multifungsi`, `ecommerce-platform`,
`smart-inventory`, `management-platform`, `whatsapp-chat-clone`.

### 3D. Project — galeri (screenshot)
`public/projects/<id-proyek>/screen-1.webp`, `screen-2.webp`, `screen-3.webp`
(rasio 4:3). Sudah terpasang. Di HP galeri bisa digeser horizontal; di desktop
tampil grid 3 kolom.

### 3E. Musik latar (opsional)
`public/music/ambient.mp3`, `public/music/lofi.mp3`, `public/music/electronic.mp3`.
Aktifkan via panel Settings (ikon ✨ kanan bawah → Settings → Music).

> **Tips WebP:** pakai https://squoosh.app, quality ~80%. Kalau file belum ada,
> UI menampilkan placeholder solid bertuliskan "Add image" (bukan error).

---

## 4. 🎨 Ikon Teknologi (otomatis)

Bagian "Tech Stack" di halaman detail proyek menarik ikon brand dari
**Simple Icons CDN** (`cdn.simpleicons.org`) berdasarkan nama teknologi di
`src/data/projects.ts`. Tidak perlu setup. Teknologi yang belum punya ikon akan
tampil sebagai chip berlabel (ikon kode generik). Untuk menambah/memetakan ikon,
edit `src/data/techIcons.ts`.

---

## 5. ✅ Checklist

- [ ] `.env` dibuat & diisi (AI + EmailJS)
- [ ] `VITE_AI_API_KEY` (+ opsional `_2`) terisi / `OPENAI_API_KEY` di Vercel
- [ ] EmailJS: service Gmail + 2 template dibuat, 4 env var terisi
- [ ] Template auto-reply diisi dari `docs/emailjs-autoreply-template.html`
- [ ] `public/brand/cover.webp` & `public/brand/avatar.webp` ditambahkan
- [ ] (opsional) `cover.webp` per proyek + field `cover` di `projects.ts`
- [ ] (opsional) file musik di `public/music/`
- [ ] Restart dev server / Redeploy Vercel
- [ ] Tes form kontak → cek inbox Gmail + email balasan otomatis
- [ ] Tes chat bot → kirim pesan, kalau error buka "Error logs"
