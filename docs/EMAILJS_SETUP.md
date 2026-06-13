# 📧 Panduan Lengkap Setup EmailJS — Porto-Fakhul

Panduan ini menjelaskan **langkah demi langkah** cara mengatur EmailJS dari nol
sampai form kontak di portofoliomu berfungsi penuh:

```
Pengunjung isi form  →  Pesan masuk ke Gmail kamu  →  Balasan otomatis ke pengunjung
```

Estimasi waktu: **15–20 menit**.

---

## Daftar Isi

1. [Apa itu EmailJS?](#1-apa-itu-emailjs)
2. [Buat Akun EmailJS](#2-buat-akun-emailjs)
3. [Hubungkan Gmail (Email Service)](#3-hubungkan-gmail-email-service)
4. [Buat Template 1 — Notifikasi ke Kamu](#4-buat-template-1--notifikasi-ke-kamu)
5. [Buat Template 2 — Balasan Otomatis ke Pengunjung](#5-buat-template-2--balasan-otomatis-ke-pengunjung)
6. [Ambil Public Key](#6-ambil-public-key)
7. [Isi File `.env`](#7-isi-file-env)
8. [Deploy ke Vercel](#8-deploy-ke-vercel)
9. [Tes Pengiriman](#9-tes-pengiriman)
10. [Troubleshooting](#10-troubleshooting)
11. [Keamanan & Rate Limit](#11-keamanan--rate-limit)
12. [Ringkasan Semua ID yang Dibutuhkan](#12-ringkasan-semua-id-yang-dibutuhkan)

---

## 1. Apa itu EmailJS?

EmailJS adalah layanan yang memungkinkan kamu mengirim email **langsung dari
browser** tanpa server/backend. Tidak perlu Node.js, PHP, atau server SMTP.

**Cara kerjanya di proyek ini:**
```
[Form Kontak di Website]
         │
         ▼
[EmailJS SDK di Browser]
         │
         ├── Template 1 ──► Gmail kamu (notifikasi pesan masuk)
         │
         └── Template 2 ──► Email pengunjung (konfirmasi otomatis)
```

**Paket Gratis (Free Tier) mencakup:**
- 200 email per bulan
- 2 template email
- 1 email service
- Cukup untuk portfolio personal

---

## 2. Buat Akun EmailJS

**2.1.** Buka **https://www.emailjs.com**

**2.2.** Klik tombol **"Sign Up For Free"** (pojok kanan atas)

**2.3.** Isi form pendaftaran:
```
Email    : (gunakan Gmail kamu — fakhulrohman2@gmail.com)
Password : (buat password yang kuat)
```

**2.4.** Klik **"Create Account"**

**2.5.** Cek inbox Gmail → klik link verifikasi yang dikirim EmailJS

**2.6.** Login ke dashboard: **https://dashboard.emailjs.com**

Tampilan dashboard akan seperti ini:
```
┌─────────────────────────────────────────┐
│  EmailJS Dashboard                      │
│  ┌──────────┐  ┌───────────┐  ┌──────┐ │
│  │ Services │  │ Templates │  │ API  │ │
│  └──────────┘  └───────────┘  └──────┘ │
└─────────────────────────────────────────┘
```

---

## 3. Hubungkan Gmail (Email Service)

Ini adalah "jembatan" antara EmailJS dan Gmail kamu.

**3.1.** Di sidebar kiri, klik **"Email Services"**

**3.2.** Klik tombol **"Add New Service"** (tombol oranye/biru)

**3.3.** Pilih **"Gmail"** dari daftar provider yang muncul

**3.4.** Di panel yang muncul, isi:
```
Service Name : Porto-Fakhul Gmail        ← nama bebas, untuk identifikasi
Service ID   : (otomatis diisi, contoh: service_abc1234) ← CATAT INI
```

**3.5.** Klik tombol **"Connect Account"**

**3.6.** Browser akan membuka popup Google OAuth:
- Pilih akun Gmail kamu (fakhulrohman2@gmail.com)
- Klik **"Continue"** / **"Allow"**
- Popup akan tertutup otomatis

**3.7.** Klik tombol **"Create Service"**

**3.8.** Kamu akan melihat service baru muncul di daftar dengan status **"Connected"**

> ✅ **Service ID sudah didapat!**
> Contoh: `service_k7abc123`
> Simpan di catatan — akan dipakai di `.env` nanti.

---

## 4. Buat Template 1 — Notifikasi ke Kamu

Template ini dikirim **ke Gmail kamu** setiap ada pengunjung yang mengirim pesan.

### 4.1. Buat Template Baru

**4.1.1.** Di sidebar kiri, klik **"Email Templates"**

**4.1.2.** Klik **"Create New Template"** (tombol biru/oranye)

**4.1.3.** Kamu akan masuk ke editor template

### 4.2. Isi Tab "Settings" (Pengaturan Pengiriman)

Di bagian atas editor ada beberapa field. Isi **persis** seperti berikut:

| Field | Isi | Keterangan |
|-------|-----|------------|
| **Template Name** | `Contact Notification` | Nama bebas, untuk identifikasi |
| **Subject** | `📬 Pesan baru dari {{name}} — Porto-Fakhul` | Subject email yang kamu terima |
| **To Email** | `fakhulrohman2@gmail.com` | ← **Email kamu**, bukan variabel |
| **From Name** | `{{from_name}}` | Nama pengirim tampil sebagai nama visitor |
| **Reply To** | `{{reply_to}}` | Saat kamu klik "Reply" di Gmail, langsung ke visitor |

> ⚠️ **Penting:** Field **"To Email"** isi dengan email kamu langsung
> (`fakhulrohman2@gmail.com`), **bukan** `{{to_email}}`. Ini memastikan
> semua notifikasi masuk ke inbox kamu.

### 4.3. Isi Body Template (HTML)

**4.3.1.** Di bagian bawah editor, cari tab atau tombol **"Code"** / **"HTML"** / **"<> Edit as HTML"**

**4.3.2.** Klik tab tersebut untuk beralih ke mode HTML

**4.3.3.** **Hapus semua isi** yang ada di editor (Ctrl+A → Delete)

**4.3.4.** Buka file `docs/emailjs-contact-template.html` di repositori kamu

**4.3.5.** **Salin semua isi** file tersebut (Ctrl+A → Ctrl+C)

**4.3.6.** **Tempel** ke editor EmailJS (Ctrl+V)

### 4.4. Simpan Template

**4.4.1.** Klik tombol **"Save"** (pojok kanan atas)

**4.4.2.** Catat **Template ID** yang tertera di halaman:
```
Template ID: template_abc1234    ← CATAT INI
```

> ✅ **Template ID #1 sudah didapat!**
> Ini adalah `VITE_EMAILJS_TEMPLATE_CONTACT` di file `.env`.

### 4.5. (Opsional) Preview Template

Klik tombol **"Preview"** di atas editor untuk melihat tampilan email.
Isi field preview dengan data dummy:
```
name    : Budi Santoso
email   : budi@example.com
message : Halo, saya tertarik dengan portofolio kamu!
time    : 13 Jun 2025, 14:30
```
Klik **"Send Test Email"** → cek inbox Gmail kamu.

---

## 5. Buat Template 2 — Balasan Otomatis ke Pengunjung

Template ini dikirim **ke email pengunjung** sebagai konfirmasi bahwa pesannya
sudah diterima.

### 5.1. Buat Template Baru

**5.1.1.** Klik **"Create New Template"** lagi (atau kembali ke daftar template)

**5.1.2.** Masuk ke editor template baru

### 5.2. Isi Tab "Settings"

| Field | Isi | Keterangan |
|-------|-----|------------|
| **Template Name** | `Auto Reply Visitor` | Nama bebas |
| **Subject** | `✨ Terima kasih, {{name}}! Pesanmu sudah diterima` | Subject yang dilihat pengunjung |
| **To Email** | `{{to_email}}` | ← **Pakai variabel ini** — diisi email pengunjung oleh aplikasi |
| **From Name** | `Fakhul Rohman` | Nama yang tampil sebagai pengirim |
| **Reply To** | `fakhulrohman2@gmail.com` | Saat pengunjung reply, masuk ke kamu |

> ⚠️ **Penting:** Field **"To Email"** di template ini HARUS `{{to_email}}`
> (dengan kurung kurawal). Aplikasi akan otomatis mengisi ini dengan email
> pengunjung saat pengiriman.

### 5.3. Isi Body Template (HTML)

**5.3.1.** Klik tab **"Code"** / **"HTML"** di editor

**5.3.2.** Hapus semua isi yang ada

**5.3.3.** Buka file `docs/emailjs-autoreply-template.html` di repositori

**5.3.4.** Salin semua isi lalu tempel ke editor EmailJS

### 5.4. Simpan Template

**5.4.1.** Klik **"Save"**

**5.4.2.** Catat **Template ID**:
```
Template ID: template_xyz5678    ← CATAT INI
```

> ✅ **Template ID #2 sudah didapat!**
> Ini adalah `VITE_EMAILJS_TEMPLATE_AUTOREPLY` di file `.env`.

---

## 6. Ambil Public Key

Public Key dipakai oleh aplikasi untuk mengautentikasi request ke EmailJS.

**6.1.** Di sidebar kiri, klik **"Account"**

**6.2.** Scroll ke bagian **"API Keys"** atau **"General"**

**6.3.** Kamu akan melihat:
```
┌──────────────────────────────────────────────┐
│  Public Key                                  │
│  ┌──────────────────────────────────┐ [Copy] │
│  │ AbCdEfGhIjKlMnOpQrSt             │        │
│  └──────────────────────────────────┘        │
└──────────────────────────────────────────────┘
```

**6.4.** Klik **"Copy"** atau salin manual

> ✅ **Public Key sudah didapat!**
> Ini adalah `VITE_EMAILJS_PUBLIC_KEY` di file `.env`.
>
> Contoh: `AbCdEfGhIjKlMnOpQrSt12345` (panjang ~20 karakter)

---

## 7. Isi File `.env`

Sekarang kamu punya semua ID yang dibutuhkan. Saatnya memasukkannya ke proyek.

**7.1.** Buka folder root proyek (tempat `package.json` berada)

**7.2.** Cari file bernama **`.env`** (sudah ada dari setup sebelumnya)

> Jika belum ada, buat file baru bernama `.env` (perhatikan titik di awal nama)

**7.3.** Tambahkan atau ubah baris berikut:

```env
# ─── EmailJS Configuration ───────────────────────────────────────────────────
VITE_EMAILJS_PUBLIC_KEY=AbCdEfGhIjKlMnOpQrSt12345
VITE_EMAILJS_SERVICE_ID=service_k7abc123
VITE_EMAILJS_TEMPLATE_CONTACT=template_abc1234
VITE_EMAILJS_TEMPLATE_AUTOREPLY=template_xyz5678
```

Ganti nilai di atas dengan ID yang kamu catat dari langkah 3, 4, 5, dan 6.

**Contoh `.env` lengkap:**
```env
# AI Chat (OpenAI)
VITE_AI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_AI_API_KEY_2=sk-proj-yyyyyyyyyyyyyyyyyyyyyyyyyy

# EmailJS
VITE_EMAILJS_PUBLIC_KEY=AbCdEfGhIjKlMnOpQrSt12345
VITE_EMAILJS_SERVICE_ID=service_k7abc123
VITE_EMAILJS_TEMPLATE_CONTACT=template_abc1234
VITE_EMAILJS_TEMPLATE_AUTOREPLY=template_xyz5678
```

**7.4.** Simpan file `.env`

**7.5.** Restart dev server:
```bash
# Stop server (Ctrl+C), lalu jalankan ulang:
npm run dev
```

> ⚠️ **Ingat:** File `.env` sudah ada di `.gitignore` — tidak akan ter-commit
> ke GitHub. Aman untuk menyimpan ID di sini.

---

## 8. Deploy ke Vercel

Setelah deploy, kamu perlu menambahkan variabel yang sama ke Vercel agar
form kontak tetap berfungsi di website publik.

### 8.1. Cara Menambahkan di Vercel Dashboard

**8.1.1.** Buka **https://vercel.com/dashboard**

**8.1.2.** Klik project **Porto-Fakhul** (atau nama project kamu)

**8.1.3.** Klik tab **"Settings"** (di menu atas)

**8.1.4.** Di sidebar kiri, klik **"Environment Variables"**

**8.1.5.** Tambahkan satu per satu variabel berikut:

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Name                              │ Value                               │
├──────────────────────────────────────────────────────────────────────────│
│  VITE_EMAILJS_PUBLIC_KEY           │ AbCdEfGhIjKlMnOpQrSt12345          │
│  VITE_EMAILJS_SERVICE_ID           │ service_k7abc123                    │
│  VITE_EMAILJS_TEMPLATE_CONTACT     │ template_abc1234                    │
│  VITE_EMAILJS_TEMPLATE_AUTOREPLY   │ template_xyz5678                    │
│  VITE_AI_API_KEY                   │ sk-proj-xxxx...                     │
│  OPENAI_API_KEY                    │ sk-proj-xxxx...   (untuk proxy)     │
└──────────────────────────────────────────────────────────────────────────┘
```

Untuk setiap variabel:
1. Klik **"Add New"**
2. Isi **Name** dan **Value**
3. Centang: ✅ Production  ✅ Preview  ✅ Development
4. Klik **"Save"**

**8.1.6.** Setelah semua variabel ditambahkan, klik **"Redeploy"** atau push commit
baru agar perubahan aktif.

### 8.2. Cara Cepat via Vercel CLI (opsional)

```bash
vercel env add VITE_EMAILJS_PUBLIC_KEY
vercel env add VITE_EMAILJS_SERVICE_ID
vercel env add VITE_EMAILJS_TEMPLATE_CONTACT
vercel env add VITE_EMAILJS_TEMPLATE_AUTOREPLY
```

Setiap perintah akan meminta kamu mengetikkan nilai dan memilih environment.

---

## 9. Tes Pengiriman

Setelah semua dikonfigurasi, lakukan tes berikut:

### 9.1. Tes Lokal (Dev Server)

**9.1.1.** Pastikan `npm run dev` sudah berjalan

**9.1.2.** Buka **http://localhost:5173** (atau port yang tertera)

**9.1.3.** Scroll ke section **Contact**

**9.1.4.** Isi form dengan data nyata:
```
Nama    : Test User
Email   : (email kamu sendiri, agar bisa melihat balasan otomatis)
Pesan   : Ini adalah pesan tes dari form kontak porto-fakhul.
```

**9.1.5.** Klik tombol **"Kirim"** / **"Send"**

**9.1.6.** Amati **log yang tampil di web** (layer konsol animasi):
```
✓ Initialising EmailJS transport…
✓ Sending notification to fakhulrohman2@gmail.com…
✓ Notification delivered (HTTP 200)
✓ Sending auto-reply to test@example.com…
✓ Auto-reply sent to visitor (HTTP 200)
✓ Done. Message delivered successfully.
```

**9.1.7.** Cek **2 inbox email**:
- Gmail kamu → harus ada notifikasi "📬 Pesan baru dari Test User"
- Email yang kamu isi di form → harus ada balasan otomatis "✨ Terima kasih, Test User!"

### 9.2. Tes di Vercel (Produksi)

Ulangi langkah 9.1 di URL Vercel kamu (bukan localhost).

---

## 10. Troubleshooting

### ❌ "EmailJS not configured — missing VITE_EMAILJS_PUBLIC_KEY"

**Penyebab:** File `.env` belum diisi atau nama variabel salah.

**Solusi:**
1. Pastikan file `.env` ada di root proyek (sejajar `package.json`)
2. Pastikan nama variabel persis `VITE_EMAILJS_PUBLIC_KEY` (huruf kapital semua, ada `VITE_` di depan)
3. Restart dev server setelah mengubah `.env`

---

### ❌ "Notification email failed (HTTP 400)"

**Penyebab:** Service ID atau Template ID salah.

**Solusi:**
1. Buka EmailJS dashboard → salin ulang Service ID dan Template ID
2. Pastikan tidak ada spasi di awal/akhir nilai di `.env`
3. Verifikasi Service status = "Connected" di EmailJS dashboard

---

### ❌ "Notification email failed (HTTP 401)" atau "Unauthorized"

**Penyebab:** Public Key salah atau akun EmailJS belum terverifikasi.

**Solusi:**
1. Cek email verifikasi dari EmailJS saat daftar — klik link verifikasi
2. Salin ulang Public Key dari **Account → API Keys**
3. Pastikan tidak memakai Private Key (yang lebih panjang, dimulai beda)

---

### ❌ "Notification email failed (HTTP 403)" atau "Domain not allowed"

**Penyebab:** Domain website tidak ada di whitelist EmailJS.

**Solusi:**
1. Buka EmailJS dashboard → **Account → Security**
2. Di bagian **"Allowed Origins"**, tambahkan:
   - `http://localhost:5173` (untuk dev)
   - `https://porto-fakhul.vercel.app` (URL Vercel kamu)
   - Domain custom jika ada
3. Klik Save, coba lagi

---

### ❌ Balasan otomatis tidak terkirim, tapi notifikasi berhasil

**Penyebab:** `VITE_EMAILJS_TEMPLATE_AUTOREPLY` tidak diisi, atau template auto-reply
field "To Email" tidak menggunakan `{{to_email}}`.

**Solusi:**
1. Cek Template 2 di EmailJS dashboard → Settings → **"To Email"** harus `{{to_email}}`
2. Cek `.env` → `VITE_EMAILJS_TEMPLATE_AUTOREPLY` sudah diisi
3. Perhatikan log di web: jika ada baris `⚠ Auto-reply failed`, klik "Error logs"
   untuk melihat detail HTTP status

---

### ❌ Email masuk tapi tanpa nama/pesan (variabel `{{name}}` tidak terganti)

**Penyebab:** Nama variabel di template EmailJS tidak cocok dengan yang dikirim.

**Solusi:**
Aplikasi mengirim variabel berikut (lihat `src/lib/emailService.ts`):
```
name, from_name, email, from_email, reply_to,
message, title, time, to_name, to_email
```
Pastikan variabel di template EmailJS menggunakan salah satu nama di atas
(dengan kurung kurawal ganda, contoh: `{{name}}`).

---

### ❌ "Failed to fetch" atau tidak ada respons

**Penyebab:** Koneksi internet bermasalah, atau EmailJS sedang down.

**Solusi:**
1. Cek koneksi internet
2. Cek status EmailJS: https://status.emailjs.com
3. Coba lagi beberapa menit kemudian

---

### ❌ Form tidak menampilkan log (stuck di "Sending...")

**Penyebab:** Ada JavaScript error di browser.

**Solusi:**
1. Buka DevTools (F12) → tab **"Console"**
2. Lihat apakah ada error merah
3. Jika ada error terkait CORS atau fetch, pastikan `VITE_EMAILJS_PUBLIC_KEY` benar

---

## 11. Keamanan & Rate Limit

### Batasi Domain yang Boleh Menggunakan Key

1. EmailJS dashboard → **Account → Security**
2. Bagian **"Allowed Origins"** → tambahkan hanya domain kamu:
   ```
   https://porto-fakhul.vercel.app
   http://localhost:5173
   ```
3. Klik **Save**

Ini mencegah orang lain memakai Public Key kamu untuk mengirim email.

### Rate Limit EmailJS (Paket Gratis)

| Limit | Nilai |
|-------|-------|
| Email per bulan | 200 |
| Email per detik | 1 |
| Email per template per menit | Tidak ada (default) |

Untuk portfolio personal, 200 email/bulan sangat lebih dari cukup.

### Jangan Simpan Private Key

EmailJS punya dua jenis key:
- **Public Key** (`user_xxxx`) → aman di browser, ini yang kita pakai
- **Private Key** → JANGAN pernah di-expose ke browser atau di-commit ke Git

---

## 12. Ringkasan Semua ID yang Dibutuhkan

Setelah mengikuti panduan ini, kamu harus punya 4 ID berikut:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     EMAILJS IDs — PORTO-FAKHUL                      │
├───────────────────────────────┬─────────────────────────────────────┤
│  Variabel .env                │  Cara mendapatkan                   │
├───────────────────────────────┼─────────────────────────────────────┤
│  VITE_EMAILJS_PUBLIC_KEY      │  Account → API Keys → Public Key    │
│  VITE_EMAILJS_SERVICE_ID      │  Email Services → (nama service)    │
│  VITE_EMAILJS_TEMPLATE_CONTACT│  Template "Contact Notification"    │
│  VITE_EMAILJS_TEMPLATE_AUTOREPLY│ Template "Auto Reply Visitor"     │
└───────────────────────────────┴─────────────────────────────────────┘
```

**Format nilai ID:**
```
Public Key   : AbCdEfGhIjKlMnOpQrSt12345      (~20 karakter alphanumeric)
Service ID   : service_xxxxxxx                 (format: service_ + 7 karakter)
Template ID  : template_xxxxxxx                (format: template_ + 7 karakter)
```

**Template `.env` siap pakai:**
```env
# EmailJS
VITE_EMAILJS_PUBLIC_KEY=GANTI_DENGAN_PUBLIC_KEY_KAMU
VITE_EMAILJS_SERVICE_ID=GANTI_DENGAN_SERVICE_ID_KAMU
VITE_EMAILJS_TEMPLATE_CONTACT=GANTI_DENGAN_TEMPLATE_NOTIFIKASI_ID
VITE_EMAILJS_TEMPLATE_AUTOREPLY=GANTI_DENGAN_TEMPLATE_AUTOREPLY_ID
```

---

## File Referensi

| File | Fungsi |
|------|--------|
| `docs/emailjs-contact-template.html` | HTML template notifikasi ke Gmail kamu |
| `docs/emailjs-autoreply-template.html` | HTML template balasan otomatis ke pengunjung |
| `src/config/email.ts` | Konfigurasi EmailJS di kode (baca `.env`) |
| `src/lib/emailService.ts` | Logic pengiriman + logging detail |

---

*Dibuat untuk Porto-Fakhul Portfolio · Diperbarui Juni 2025*
