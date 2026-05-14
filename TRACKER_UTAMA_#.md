# Master Tracker Utama Katedral Santo Yosef

Proyek ini telah rampung **95%** untuk spesifikasi utamanya. Seluruh alur utama mulai dari pendaftaran hingga pemberkatan sudah beroperasi.

## ✅ FITUR UTAMA YANG SUDAH SELESAI
- **Sistem Autentikasi**: Google OAuth & Email/Sandi (Hybrid), Fitur Lupa Sandi.
- **Dasbor Calon Pengantin**: Pengisian Profil, Checklist Dokumen Fisik, Notifikasi, Print PDF Bukti Pendaftaran, Fitur Daftar Ulang.
- **Dasbor Admin**: KPI Ringkasan, Manajemen Pendaftar (Naik Tahap, Set Jadwal, Catatan), Penugasan Romo, Manajemen Pengguna, dan Pengaturan Gereja.
- **Sistem Manajemen Konten (CMS)**: Kelola Berita, Jadwal Misa, dan Galeri Foto secara dinamis.
- **Sistem Notifikasi Email Otomatis**: Integrasi API Resend untuk notifikasi (Naik Tahap, Penetapan Jadwal, Pembatalan).
- **Halaman Publik Teroptimasi**: Beranda, Sakramen, Berita (dengan Kategori & Paginasi), Jadwal Misa, Galeri, Kontak & Lokasi. Teroptimasi penuh untuk perangkat Mobile dan SEO.

---

## 🚀 SISA PEKERJAAN UTAMA (ENHANCEMENT & QA)

### 1. Peningkatan Antarmuka (UI/UX) Dasbor Admin
- [ ] **Shadcn Data-Table**: Mengganti tabel HTML bawaan di halaman Daftar Pernikahan Admin dengan komponen Shadcn Data-Table yang mendukung *Pagination* (nomor halaman), *Sorting* (pengurutan per kolom), dan *Filtering* tingkat lanjut.
- [ ] **Peningkatan Form Input**: Mengganti input tanggal biasa dengan komponen **Date Picker** Shadcn dan menggunakan komponen **Select** Shadcn yang lebih rapi untuk form di sisi Admin.

### 2. Quality Assurance (QA) & Pengujian
- [ ] **End-to-End Testing**: Melakukan pengujian menyeluruh seluruh alur aplikasi (dari pendaftaran pengguna hingga persetujuan admin) di perangkat nyata (mobile dan desktop) untuk memastikan tidak ada *bug* (bebas error) sebelum diluncurkan sepenuhnya.
