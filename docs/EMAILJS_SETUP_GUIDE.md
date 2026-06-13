# 📧 Panduan Lengkap Setup EmailJS untuk Sistem Kontak

## 🎯 Overview

EmailJS memungkinkan pengiriman email langsung dari browser tanpa backend server. Sistem ini sudah diintegrasikan ke dalam aplikasi Porto-Fakhul untuk mengirimkan:
1. **Notifikasi ke Anda** - Pesan pengunjung dikirim ke email Anda
2. **Auto-reply ke Pengunjung** - Konfirmasi otomatis ke pengirim

## 🔧 Prasyarat

1. **Akun EmailJS** - Daftar gratis di [emailjs.com](https://www.emailjs.com)
2. **Gmail/Email** - Untuk menerima notifikasi
3. **Template Email** - Buat 2 template di EmailJS

## 📋 Langkah-Langkah Setup

### 1. Buat Akun EmailJS
- Kunjungi [emailjs.com](https://www.emailjs.com)
- Sign up dengan Google atau email
- Verifikasi akun Anda

### 2. Tambahkan Email Service
1. Dari dashboard, klik **"Email Services"**
2. Pilih **"Add New Service"**
3. Pilih **"Gmail"** (atau email provider lainnya)
4. Login dengan akun Gmail Anda (fakhulrohman2@gmail.com)
5. Beri nama service: `Portfolio Contact`
6. Klik **"Create Service"**

### 3. Buat Template Email

#### Template 1: Notification (ke Anda)
1. Klik **"Email Templates"** → **"Create New Template"**
2. Beri nama: `Portfolio Contact Notification`
3. Isi form template:
   - **Subject**: `New Message from {{name}}`
   - **To Email**: `fakhulrohman2@gmail.com`
   - **From Name**: `{{name}}`
   - **From Email**: `{{email}}`
   - **Reply To**: `{{reply_to}}`
4. Konten email (sesuaikan dengan preferensi):
   ```
   Name: {{name}}
   Email: {{email}}
   Time: {{time}}
   
   Message:
   {{message}}
   
   ---
   Portfolio Contact Form - {{time}}
   ```
5. Klik **"Save"** → catat **Template ID** (format: `template_xxxxxxxxx`)

#### Template 2: Auto-reply (ke Pengunjung)
1. **"Create New Template"**
2. Beri nama: `Portfolio Auto Reply`
3. Isi form:
   - **Subject**: `Thank you for reaching out, {{name}}! ✨`
   - **To Email**: `{{to_email}}`
   - **From Name**: `Fakhul Rohman`
   - **From Email**: `fakhulrohman2@gmail.com`
4. **Paste HTML Template**:
   - Buka file `docs/emailjs-autoreply-template.html`
   - Copy seluruh konten HTML
   - Di EmailJS, pilih **"Code Editor"** (bukan visual editor)
   - Paste HTML template
   - **⚠️ IMPORTANT:** Ganti GIF URLs jika perlu (lihat komentar di HTML)
5. Klik **"Save"** → catat **Template ID**

### 4. Konfigurasi Environment Variables

Buat file `.env` di root project (samping `package.json`):

```env
# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_CONTACT=template_notification_id
VITE_EMAILJS_TEMPLATE_AUTOREPLY=template_autoreply_id
```

**Cara mendapatkan nilai-nilai ini:**

1. **Public Key**: Dashboard EmailJS → lihat sidebar kiri, "Account" → "API Keys" → "Public Key"
2. **Service ID**: Dashboard → "Email Services" → klik service Anda → lihat "Service ID"
3. **Template IDs**: Dashboard → "Email Templates" → klik template → lihat "Template ID"

### 5. Konfigurasi Security (Opsional tapi Direkomendasikan)

1. Kembali ke dashboard EmailJS
2. **"Security"** di sidebar
3. **"Add Origin"**:
   - `http://localhost:5173` (development)
   - `https://porto-fakhul.vercel.app` (production)
   - Domain lain yang digunakan
4. **Save**

## 🔍 Verifikasi Setup

### Cek Environment Variables
File `.env` harus berisi:
```
VITE_EMAILJS_PUBLIC_KEY=user_xxxxxxxxxxxxxxxx
VITE_EMAILJS_SERVICE_ID=service_xxxxxxxx
VITE_EMAILJS_TEMPLATE_CONTACT=template_xxxxxxxx
VITE_EMAILJS_TEMPLATE_AUTOREPLY=template_yyyyyyyy
```

### Test Local
1. Start dev server: `npm run dev`
2. Buka http://localhost:5173
3. Scroll ke section Contact
4. Isi form dan submit
5. Cek **Email Anda** dan **Email Pengirim** (jika auto-reply diaktifkan)

### Debug Console
Di UI Contact, akan muncul console log real-time:
- ✅ `Notification delivered` → berhasil ke email Anda
- ✅ `Auto-reply sent` → berhasil ke pengunjung
- ❌ Jika error, detail akan muncul di console

## 🚨 Troubleshooting

### "EmailJS is not configured"
- Pastikan `.env` file ada di root project
- Pastikan variable names benar (case-sensitive)
- Restart dev server setelah edit `.env`

### "HTTP 400/403 Error"
1. Cek **Security Settings** → pastikan origin domain di-allowlist
2. Cek **Template IDs** → pastikan benar dan template aktif
3. Cek **Service ID** → pastikan service aktif dan terkoneksi dengan email

### "Email tidak diterima"
1. Cek **Spam/Junk folder**
2. Verifikasi **To Email** di template benar
3. Test dengan email berbeda

### "Auto-reply tidak terkirim"
1. Pastikan `VITE_EMAILJS_TEMPLATE_AUTOREPLY` diisi
2. Cek **To Email** field di template auto-reply: harus `{{to_email}}`
3. Test dengan email valid

## 📊 Monitoring

### EmailJS Dashboard
- **Activity Log**: Melihat email yang terkirim/gagal
- **Usage Statistics**: Melihat jumlah email bulanan
- **Security**: Review allowed origins

### Rate Limits
- Free tier: 200 emails/bulan
- Monitor usage di dashboard
- Upgrade jika perlu lebih banyak

## 🔄 Maintenance

### Update Template
1. Edit template di EmailJS dashboard
2. Save changes
3. Tidak perlu update kode (kecuali variable berubah)

### Add New Variables
Jika ingin menambah variable baru di template:
1. Update template di EmailJS
2. Update `emailService.ts` → tambah di `baseParams`
3. Update payload di `Contact.tsx` jika perlu

### Backup Template
Export template HTML secara berkala:
1. EmailJS → Templates → Export
2. Simpan di `docs/emailjs-templates-backup/`

## 🔗 Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [HTML Email Templates Best Practices](https://www.emailjs.com/docs/email-templates/html-email-templates/)
- [EmailJS GitHub](https://github.com/emailjs-com)
- [Contact Support](https://www.emailjs.com/contact/)

## 📝 Catatan Penting

1. **Public Key aman di-expose** - dirancang untuk frontend
2. **Service harus aktif** - pastikan email service terkoneksi
3. **Template harus publish** - draft template tidak bisa digunakan
4. **Test di production** - localhost dan production domain berbeda
5. **Monitor usage** - jangan sampai melebihi limit

---

**Status Setup:** ✅ Siap digunakan  
**Last Updated:** June 13, 2026  
**Maintainer:** Fakhul Rohman  
**Support:** fakhulrohman2@gmail.com