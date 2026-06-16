# Panduan Integrasi Halaman Error & Maintenance

Dokumen ini berisi informasi mengenai perubahan yang dilakukan pada sistem routing portfolio Anda, serta cara manual untuk mengarahkan detail proyek atau tautan demo/repository ke halaman **Maintenance**.

---

## 🛠️ Ringkasan Perubahan

1. **Halaman 404 (NotFound)**:
   - File: [NotFound.tsx](file:///root/Porto-Fakhul/src/sections/NotFound.tsx)
   - Ditambahkan panel diagnosik interaktif bergaya terminal/HUD yang menampilkan:
     - Path yang bermasalah (`Request Path`)
     - Kode error (`ERR_ROUTE_NOT_FOUND_404`)
     - Alasan error yang dinamis (bisa dilempar dari query parameter `?reason=...`)
     - Log diagnosik sistem yang bisa dikolaps/ditampilkan secara real-time.
   - Memperbaiki data nama placeholder `"Sora Takahashi"` menjadi `"Fakhul Rohman"` dan `"Tokyo, Japan"` menjadi `"Depok, Indonesia"`.

2. **Halaman Maintenance**:
   - File baru: [Maintenance.tsx](file:///root/Porto-Fakhul/src/sections/Maintenance.tsx)
   - Halaman premium baru dengan animasi rotasi kunci inggris/alat perbaikan, filter noise overlay, aurora glow, dan pesan yang menyatakan bahwa demonstrasi & kode sumber proyek sedang disiapkan.

3. **Routing Client-Side**:
   - File: [App.tsx](file:///root/Porto-Fakhul/src/App.tsx)
   - Rute `/maintenance` akan memuat halaman Maintenance secara instan.
   - Rute lainnya selain `/` dan `/maintenance` akan memuat halaman 404.
   - Ditambahkan event listener `popstate` dan patch API `pushState` / `replaceState` agar navigasi berjalan secara instan di client-side tanpa reload halaman secara penuh (full-page reload).

4. **Penerjemahan (Localization)**:
   - File: [en.json](file:///root/Porto-Fakhul/src/locales/en.json), [id.json](file:///root/Porto-Fakhul/src/locales/id.json), [zh.json](file:///root/Porto-Fakhul/src/locales/zh.json)
   - Ditambahkan entitas `errorPages` untuk pelokalan teks pada kedua halaman tersebut ke dalam bahasa Inggris, Indonesia, dan Mandarin.

5. **Perbaikan UI Keahlian Soft Skill (Chrome Bug)**:
   - File: [About.tsx](file:///root/Porto-Fakhul/src/sections/About.tsx#L610)
   - Mengubah elemen `<motion.span>` menjadi `<motion.div>` karena Google Chrome memiliki bug layout saat elemen inline (`span`) diberikan properti `display: flex` di dalam CSS Grid / Flexbox.

---

## 📝 Cara Mengarahkan Proyek ke Halaman Maintenance secara Manual

Anda dapat menggunakan salah satu dari dua cara berikut untuk mengarahkan proyek ke halaman pemeliharaan (Maintenance):

### Cara 1: Mengarahkan Tautan Demo / Repository ke Halaman Maintenance
Jika detail proyek tetap ingin ditampilkan (overlay slide-in terbuka), tetapi tombol tautan **Live Demo** atau **Repository** di dalamnya mengarah ke halaman maintenance:

1. Buka file data proyek Anda: [projects.ts](file:///root/Porto-Fakhul/src/data/projects.ts).
2. Temukan proyek yang ingin Anda sesuaikan (misalnya `ecommerce-platform`).
3. Pada bagian `links`, ubah nilai `href` menjadi `/maintenance`.

Contoh konfigurasi proyek:
```typescript
{
  id: 'ecommerce-platform',
  title: 'E-Commerce Platform',
  // ... data proyek lainnya
  links: [
    { label: 'Live', href: '/maintenance', type: 'live' }, // Mengarah ke maintenance
    { label: 'Repository', href: '/maintenance', type: 'repo' } // Mengarah ke maintenance
  ],
  status: 'live',
  // ...
}
```

---

### Cara 2: Mengarahkan Klik Kartu Proyek secara Instan ke Halaman Maintenance
Jika Anda ingin agar ketika kartu proyek di halaman utama diklik, aplikasi **tidak membuka modal detail** melainkan langsung mengarahkan pengguna ke halaman `/maintenance`:

1. Buka file [App.tsx](file:///root/Porto-Fakhul/src/App.tsx).
2. Temukan baris pemanggilan komponen `<Projects>` (biasanya di sekitar baris 183):
   ```tsx
   <Projects onSelectProject={(id) => setSelectedProjectId(id)} />
   ```
3. Ubah menjadi logika pengecekan berbasis status proyek atau manual ID seperti ini:
   ```tsx
   <Projects onSelectProject={(id) => {
     const project = projectsData.find((p) => p.id === id);
     
     // Anda bisa memicu redirect jika status proyek 'in-progress'
     // atau jika seluruh tautannya disetel ke '/maintenance'
     if (project?.status === 'in-progress' || project?.links.every(l => l.href === '/maintenance')) {
       window.history.pushState(null, '', '/maintenance');
     } else {
       setSelectedProjectId(id);
     }
   }} />
   ```

> [!TIP]
> Logika di atas secara otomatis mendeteksi proyek dengan status `"in-progress"` (seperti *Multi-Purpose Management Platform*) atau proyek yang link-nya mengarah ke `/maintenance`, lalu langsung meluncurkan halaman maintenance secara instan tanpa memuat ulang browser.
