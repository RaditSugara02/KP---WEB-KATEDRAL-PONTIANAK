# Master Project Tracker: Sistem Informasi Katedral Santo Yosef

Dokumen ini berfungsi sebagai peta jalan (*roadmap*) pengembangan proyek. Tanda `[x]` berarti fitur sudah selesai dikerjakan, sedangkan `[ ]` berarti masih dalam antrean (Prioritas).

## ✅ FASE 1: Fondasi & Autentikasi Dasar (SELESAI)
- [x] Inisialisasi Proyek (Next.js 15, Tailwind, TS)
- [x] Desain Sistem (Warna Katedral: Cokelat, Emas, Krem)
- [x] Setup Database Supabase (PostgreSQL) + Drizzle ORM
- [x] Migrasi Skema Database (`users`, `couple_profiles`, `marriage_applications`, dll)
- [x] Setup Better Auth (Google Auth)
- [x] Seeding Data Awal (Admin, Priest, Couple, Konten)

## ✅ FASE 2: Modul Utama Admin & Pengantin (SELESAI)
- [x] Pembuatan Layout Global (Navbar, Footer, Menu Navigasi)
- [x] Halaman Dasbor Pengantin (Profil, Ringkasan Pendaftaran)
- [x] Halaman Dasbor Admin (Ringkasan, Manajemen Pendaftar)
- [x] Fitur Hapus/Batal Pendaftaran (Soft Delete ke Tahap 99)
- [x] Hybrid Auth & Account Linking (Google Auth + Email/Sandi Manual)
- [x] Peningkatan UX Autentikasi (Validasi Kustom, Visibilitas Sandi)
- [x] Pemasangan Shadcn Sonner (Toast Notification)

---

## 🚀 FASE 3: Fitur Fungsional Kritis (SEDANG DIKERJAKAN)

### Prioritas 1: Sistem Dokumen & Keamanan

- [x] **Fitur Lupa Kata Sandi (Password Reset)**
  - Integrasi Email Provider (Resend/SMTP).
  - Pembuatan alur pengiriman token ke email dan formulir ganti sandi.

### Prioritas 2: Penyempurnaan Dasbor & Operasional
- [ ] **Penugasan Romo (Priest Assignment)**
  - Fitur bagi Admin untuk memilih dan menugaskan Romo pada pengajuan pernikahan (Tahap lanjut).

- [ ] **Pembaruan Tabel & Form dengan Shadcn**
  - Mengganti tabel biasa di dasbor Admin menjadi Shadcn Data-Table (Paginasi, Filter, Sortir).
  - Memasang Shadcn Date Picker dan Select untuk form.

### Prioritas 3: Portal Publik & Notifikasi
- [ ] **Sistem Manajemen Konten (CMS) Berita & Jadwal Misa**
  - Penyelesaian form unggah berita di sisi Admin.
  - Tampilan membaca berita di portal publik.
- [ ] **Sistem Notifikasi Email Otomatis**
  - *Trigger* email ketika status tahap pernikahan berubah (naik tahap atau dibatalkan).

---
*Catatan: Dokumen ini akan diperbarui secara berkala seiring berjalannya proses pengembangan.*
