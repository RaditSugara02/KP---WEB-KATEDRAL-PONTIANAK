# 📋 Log Progres Proyek: Sistem Informasi Katedral Santo Yosef

> Dokumen ini merangkum seluruh perjalanan pengembangan proyek dari awal hingga saat ini.
> Terakhir diperbarui: 30 April 2026
>
> **📌 Aturan:** File ini WAJIB diperbarui setiap kali ada perubahan, fitur baru, atau perbaikan bug. Cantumkan tanggal dan deskripsi singkat perubahan.

---

## 🏗️ Informasi Proyek

| Atribut | Detail |
|---|---|
| **Nama Proyek** | Sistem Informasi Katedral Santo Yosef Martapura |
| **Framework** | Next.js 15 (App Router) |
| **Database** | PostgreSQL + Drizzle ORM (Supabase) |
| **Auth** | Better Auth (Email/Password + Google OAuth) |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Deployment** | Vercel |
| **Repositori** | https://github.com/RaditSugara02/KP---WEB-KATEDRAL-PONTIANAK |
| **URL Produksi** | https://kp-web-katedral-pontianak.vercel.app |

---

## 🔑 Akun & Kredensial

| Role | Email | Password |
|---|---|---|
| **Admin Katedral** | `admin@katedral.id` | `admin123` |
| **Imam / Romo 1** | `rm.antonius@katedral.id` | `priest123` |
| **Imam / Romo 2** | `rm.benediktus@katedral.id` | `priest123` |
| **Calon Pengantin 1** | `antonius.budi@gmail.com` | `couple123` |
| **Calon Pengantin 2** | `yohanes.pratama@gmail.com` | `couple123` |
| **Calon Pengantin 3** | `paulus.hendarto@gmail.com` | `couple123` |

---

## ✅ FASE 1 — Fondasi & Infrastruktur (SELESAI)

**Periode:** Awal April 2026

### Yang Dikerjakan:
- [x] Inisialisasi proyek Next.js 15 dengan TypeScript dan Tailwind CSS
- [x] Konfigurasi design system warna brand katedral (Gold `#B8960C`, Charcoal `#3D2B1F`, Cream `#FAF7F2`)
- [x] Konfigurasi Google Fonts (Cormorant Garamond, DM Sans)
- [x] **Migrasi Database:** SQLite lokal → Supabase (PostgreSQL)
  - Mengganti dependensi `better-sqlite3` → driver `postgres`
  - Mengubah `dialect: "sqlite"` → `dialect: "postgresql"` di `drizzle.config.ts`
  - Update koneksi di `lib/db/index.ts`
- [x] **Implementasi Skema Database** (`lib/db/schema.ts`):
  - `user` — Data pengguna + field `role` (COUPLE | ADMIN | PRIEST)
  - `session` — Manajemen sesi Better Auth
  - `account` — OAuth/credential accounts
  - `verification` — Token verifikasi email
  - `couple_profiles` — Data mempelai pria & wanita
  - `marriage_applications` — Pengajuan pernikahan (Tahap 1–5, Tahap 99 = Dibatalkan)
  - `stage_history` — Riwayat perubahan tahap
  - `required_documents` — Checklist 11 dokumen persyaratan
  - `notifications` — Notifikasi in-app
  - `contents` — Berita, Jadwal Misa, Agenda
- [x] Setup Better Auth dengan Google OAuth
- [x] Seeding data awal (Admin, Romo, Calon Pengantin, Konten)

---

## ✅ FASE 2 — Autentikasi & Layout Dasar (SELESAI)

### Yang Dikerjakan:
- [x] Instalasi komponen shadcn/ui (input, label, button, card, sheet, avatar, dropdown-menu, separator, tooltip, sonner)
- [x] **Halaman Login** (`/masuk`) — Form email+password + tombol Google OAuth
- [x] **Halaman Register** (`/daftar`) — Form pendaftaran manual
- [x] **Halaman Cek Email** (`/cek-email`) — Konfirmasi email setelah daftar
- [x] **Halaman Lupa Sandi** (`/lupa-sandi`) + Reset Sandi (`/reset-sandi`)
- [x] Komponen layout modular:
  - `SidebarAdmin` (tema gelap cokelat `#2C1F14`)
  - `SidebarUser` (tema terang)
  - `SidebarRomo` (tema terang — kemudian dihapus)
  - `HeaderBar` (dengan mobile menu)
- [x] Layout server-side dengan pengecekan sesi untuk `/admin`, `/dasbor`
- [x] Hybrid Auth: Google OAuth + Email/Password manual dengan account linking

---

## ✅ FASE 3 — Dasbor Calon Pengantin (SELESAI)

### Yang Dikerjakan:
- [x] **API Endpoint** `/api/profil` — Simpan data ke `couple_profiles`, generate `registrationNumber` (format: `KP-2026-0001`), insert 11 dokumen otomatis ke `required_documents`
- [x] **Halaman Profil** (`/dasbor/profil`)
  - Jika belum ada profil: tampilkan form isian data mempelai pria & wanita
  - Jika sudah ada profil: tampilkan data read-only (terkunci untuk administrasi)
- [x] **Halaman Beranda Dasbor** (`/dasbor/beranda`)
  - Kartu progres tahap pernikahan (Tahap 1–5)
  - Ringkasan data pasangan
  - Status mode terkunci (merah) jika pendaftaran dibatalkan (Tahap 99)

---

## ✅ FASE 4 — Dokumen & Notifikasi Dasbor Pengantin (SELESAI)

### Yang Dikerjakan:
- [x] **Halaman Dokumen** (`/dasbor/dokumen`)
  - Checklist 11 dokumen persyaratan pernikahan
  - Status setiap dokumen (Belum Diterima / Sudah Diterima)
- [x] **Halaman Notifikasi** (`/dasbor/notifikasi`)
  - Daftar notifikasi dari Admin
  - Auto-mark as read saat halaman dikunjungi
- [x] **API Notifikasi Count** (`/api/notifikasi/count`) — Badge angka merah di sidebar

---

## ✅ FASE 5 — Dasbor Admin Sekretariat (SELESAI)

### Yang Dikerjakan:
- [x] **Halaman Ringkasan Admin** (`/admin/ringkasan`)
  - 4 KPI Cards: Total Pendaftar, Baru/Tahap 1, Pemberkatan Bulan Ini, Perlu Verifikasi
  - Tabel 5 pendaftaran terbaru
  - Timeline aktivitas terbaru
- [x] **Halaman Daftar Pernikahan** (`/admin/pernikahan`)
  - Tabel semua pendaftaran dengan status tahap
  - Filter dan navigasi ke detail
- [x] **Halaman Detail Pernikahan** (`/admin/pernikahan/[id]`)
  - Kelola status dokumen (centang/uncentang)
  - Naikkan tahap pendaftaran
  - Kirim catatan/notifikasi ke pasangan
  - Soft Delete: batalkan pendaftaran → pindah ke Tahap 99
- [x] **API Admin** (`/api/admin/pernikahan`) — CRUD operasi pernikahan

---

## ✅ FASE 6 — Halaman Publik (Landing Page) (SELESAI)

### Yang Dikerjakan:
- [x] **Navbar Publik** dengan menu: Beranda, Jadwal Misa, Berita, Sakramen Perkawinan
- [x] **Footer** dengan info gereja dan tautan
- [x] **Landing Page** (`/`) — Beranda utama dengan:
  - Hero section dengan CTA
  - Section informasi gereja
  - Section berita terbaru
  - Tanpa tombol "Daftar Pernikahan" (user diarahkan ke halaman Sakramen dahulu)
- [x] **Halaman Jadwal Misa** (`/jadwal-misa`) — Tampil dari data CMS
- [x] **Halaman Berita** (`/berita`) + Detail Berita (`/berita/[slug]`)
- [x] **Halaman Sakramen Perkawinan** (`/sakramen-perkawinan`)
  - Alur pendaftaran pernikahan
  - Daftar dokumen yang dibutuhkan
  - Informasi biaya
  - Tombol masuk (untuk login sebelum mendaftar)

---

## ✅ FASE 7 — Sistem Manajemen Konten / CMS Admin (SELESAI)

### Yang Dikerjakan:
- [x] **API CRUD Konten** (`/api/admin/konten`) — Create, Read, Update, Delete
- [x] **Halaman Daftar Konten** (`/admin/konten`) — Tabel berita & jadwal misa
- [x] **Halaman Tambah Konten** (`/admin/konten/tambah`) — Form buat berita/jadwal baru
- [x] **Halaman Edit Konten** (`/admin/konten/[id]`) — Form edit konten yang ada
- [x] Tombol Delete Konten dengan konfirmasi
- [x] Konten yang diterbitkan langsung tampil di halaman publik

---

## ✅ FASE 8 — Polishing & Navigasi (SELESAI)

### Yang Dikerjakan:
- [x] Redirect default: `/admin` → `/admin/ringkasan`, `/dasbor` → `/dasbor/beranda`
- [x] Perbaikan sidebar admin: hapus dead link, hubungkan tombol "Buat Pengumuman"
- [x] Badge notifikasi dinamis dari API (bukan hardcoded)
- [x] Halaman 404 kustom (`not-found.tsx`)
- [x] Loading UI untuk `/admin` dan `/dasbor`
- [x] Perbaikan alur redirect pasca login

---

## ✅ FASE 9 — Redesign Landing Page & Navigasi (SELESAI)

### Yang Dikerjakan:
- [x] Implementasi desain baru dari Stitch (Beranda Update Section)
- [x] Hapus seksi "Sejarah Gereja" dari landing page
- [x] Tambah menu "Sakramen Perkawinan" di navbar
- [x] Hapus tombol "Daftar Pernikahan" dari Hero dan Navbar
- [x] Hapus tombol "Masuk" dari navbar publik
- [x] Implementasi halaman Sakramen Perkawinan dari desain Stitch

---

## ✅ FASE 10 — Responsivitas & Deployment (SELESAI)

### Yang Dikerjakan:
- [x] Audit responsivitas mobile (375px) dan tablet (768px) seluruh halaman publik
- [x] Sidebar User/Couple: disembunyikan di mobile (`hidden md:flex`)
- [x] Sidebar Admin: disembunyikan di mobile (`hidden md:flex`)
- [x] `HeaderBar` dijadikan client component dengan Mobile Drawer:
  - Tombol hamburger menu (☰) muncul di mobile
  - Sheet drawer berisi menu navigasi yang kontekstual:
    - Admin: Ringkasan, Data Pernikahan, Kelola Konten, Pengaturan
    - Calon Pengantin: Beranda, Dokumen, Notifikasi, Profil Saya
- [x] **Perbaikan Build Errors Vercel:**
  - Cast `any` pada `data?.user?.role` di halaman Login
  - Null safety pada `currentStage` dan `changedAt` di `DetailClient.tsx`
  - Rename field `authorId` → `createdBy` di API konten
  - Hapus prop `asChild` yang tidak valid di `SheetTrigger`
  - Cast `any` pada property `badge` yang optional di nav items
- [x] Push ke GitHub & deploy ke Vercel
- [x] **Google OAuth berhasil berfungsi di production (Vercel):**
  - `BETTER_AUTH_URL` dan `NEXT_PUBLIC_APP_URL` dikonfigurasi di Vercel Dashboard
  - Authorized Redirect URI didaftarkan di Google Cloud Console
  - Login dengan Google sudah dapat digunakan di `https://kp-web-katedral-pontianak.vercel.app`

---

## ⚠️ YANG MASIH PERLU DIKERJAKAN (Backlog)

### 🔴 Prioritas Tinggi

#### 1. Penugasan Romo (Priest Assignment)
- [ ] Dropdown di halaman detail pernikahan untuk Admin memilih Romo
- [ ] Update `priestId` di tabel `marriage_applications`
- [ ] (Opsional) Dasbor sederhana untuk Romo melihat jadwal yang ditugaskan

#### 2. KPI "Perlu Verifikasi" di Admin
- [ ] KPI card ke-4 di ringkasan admin masih hardcoded `0`
- [ ] Perlu logika: hitung dokumen yang belum diverifikasi Admin

#### 3. Halaman Admin: Pengguna (`/admin/pengguna`)
- [ ] Tampilkan daftar semua user terdaftar (COUPLE, ADMIN, PRIEST)
- [ ] Informasi: nama, email, role, tanggal daftar
- [ ] Tombol nonaktifkan/aktifkan akun user
- *Catatan: Folder sudah ada tapi halaman belum diimplementasi*

#### 4. Halaman Admin: Pengaturan (`/admin/pengaturan`)
- [ ] Form edit informasi gereja (nama, alamat, nomor telepon, email)
- [ ] Pengaturan jam operasional sekretariat
- [ ] Pengaturan jadwal misa default
- *Catatan: Folder sudah ada tapi halaman belum diimplementasi*

### 🟡 Prioritas Menengah

#### 5. Notifikasi Email Otomatis
- [ ] Integrasi email provider (Resend atau Nodemailer SMTP)
- [ ] Trigger email ke pasangan ketika tahap berubah
- [ ] Trigger email ke pasangan ketika pendaftaran dibatalkan
- [ ] Template email branded sesuai design system

#### 6. Riwayat Tahap di Dasbor Pengantin
- [ ] Tampilkan timeline perubahan tahap di `/dasbor/beranda`
- [ ] Data sudah ada di tabel `stage_history` — tinggal di-query dan ditampilkan
- [ ] Format: tanggal + keterangan perubahan tahap + nama admin yang mengubah

#### 7. Jadwal Pemberkatan di Dasbor Pengantin
- [ ] Setelah semua dokumen selesai, Admin bisa input tanggal & jam pemberkatan
- [ ] Pasangan dapat melihat jadwal pemberkatan di `/dasbor/beranda`
- [ ] Field baru di tabel `marriage_applications`: `ceremony_date`, `ceremony_time`

#### 8. Print / Download Bukti Pendaftaran
- [ ] Tombol "Cetak Bukti" di `/dasbor/beranda` atau `/dasbor/profil`
- [ ] Generate PDF sederhana berisi: nomor registrasi, nama mempelai, tanggal daftar, status tahap saat ini
- [ ] Gunakan library `react-pdf` atau `jsPDF`

#### 9. Pencarian & Filter di Tabel Admin Pernikahan
- [ ] Search by nama mempelai atau nomor registrasi di `/admin/pernikahan`
- [ ] Filter by status tahap (Tahap 1, 2, 3, 4, 5, Dibatalkan)
- [ ] Filter by bulan/tahun pemberkatan

### 🟢 Prioritas Rendah / Enhancement

#### 10. Data Table yang Lebih Canggih
- [ ] Ganti tabel biasa di Admin dengan Shadcn Data Table (paginasi, filter, sortir)
- [ ] Date Picker dan Select component dari shadcn untuk form

#### 11. End-to-End Testing
- [ ] Uji alur lengkap: Daftar akun → Isi profil → Lihat dokumen → Terima notifikasi
- [ ] Uji alur Admin: Login → Lihat pendaftar → Naikkan tahap → Kirim notifikasi
- [ ] Uji di device mobile nyata

#### 12. SEO & Metadata
- [ ] Tambah Open Graph meta tags di landing page
- [ ] Tambah `sitemap.xml` dan `robots.txt`
- [ ] Optimasi gambar dengan `next/image`

#### 13. Halaman Kontak & Lokasi (Publik)
- [ ] Buat halaman baru `/kontak`
- [ ] Konten: alamat lengkap, nomor telepon, email, jam operasional sekretariat
- [ ] Embed Google Maps
- [ ] Tambahkan link ke navbar publik

#### 14. Galeri Foto Gereja (Publik)
- [ ] Buat halaman `/galeri` atau section di landing page
- [ ] Admin bisa upload/kelola foto via CMS yang sudah ada
- [ ] Tambahkan type `"GALLERY"` di tabel `contents`
- [ ] Tampilan: grid masonry foto kegiatan gereja

---

## 🚫 FITUR YANG DI-SKIP / DITUNDA

| Fitur | Alasan |
|---|---|
| **Sistem Unggah Dokumen (File Uploads)** | Ditunda — kemungkinan besar tidak akan dipakai karena ada perubahan rencana sistem laporan. Bisa diimplementasi ulang jika dibutuhkan di masa mendatang. |
| **Dasbor Romo** | Di-skip sejak awal — scope terlalu luas untuk fase ini. |

---

## 📝 Riwayat Perubahan (Changelog)

| Tanggal | Perubahan |
|---|---|
| 26 Apr 2026 | Inisialisasi proyek, setup database, auth, skema |
| 26 Apr 2026 | Fase 2–3: Auth pages, layout, dasbor pengantin |
| 27 Apr 2026 | Fase 4–5: Dokumen, notifikasi, dasbor admin |
| 27 Apr 2026 | Fase 6–7: Landing page publik, CMS Admin |
| 27 Apr 2026 | Fase 8–9: Polishing, redesign landing page dari Stitch |
| 29 Apr 2026 | Fase 10: Responsivitas mobile, deploy ke Vercel, perbaikan build errors |
| 30 Apr 2026 | Google OAuth production berhasil dikonfigurasi |
| 30 Apr 2026 | Sistem unggah dokumen di-skip; file PROGRESS_LOG.md dibuat |
| 30 Apr 2026 | Tambah 8 fitur baru ke backlog berdasarkan analisis gap |

---

## 📁 Struktur Halaman Saat Ini

```
app/
├── (auth)/
│   ├── masuk/            # Login (email + Google)
│   ├── daftar/           # Register akun baru
│   ├── cek-email/        # Konfirmasi email
│   ├── lupa-sandi/       # Request reset password
│   └── reset-sandi/      # Form ganti password baru
│
├── (public)/
│   ├── page.tsx          # Landing page utama
│   ├── berita/           # Daftar berita
│   ├── berita/[slug]/    # Detail artikel berita
│   ├── jadwal-misa/      # Jadwal misa mingguan
│   └── sakramen-perkawinan/ # Info & alur pernikahan
│
├── dasbor/               # Portal Calon Pengantin
│   ├── beranda/          # Overview progres pendaftaran
│   ├── profil/           # Data diri mempelai
│   ├── dokumen/          # Checklist dokumen
│   └── notifikasi/       # Pesan dari Admin
│
├── admin/                # Panel Sekretariat
│   ├── ringkasan/        # Dashboard KPI + aktivitas
│   ├── pernikahan/       # Daftar semua pendaftaran
│   ├── pernikahan/[id]/  # Detail & kelola pernikahan
│   ├── konten/           # Daftar berita & jadwal
│   ├── konten/tambah/    # Buat konten baru
│   ├── konten/[id]/      # Edit konten
│   ├── pengguna/         # Manajemen pengguna
│   └── pengaturan/       # Pengaturan sistem
│
└── api/
    ├── auth/[...all]/    # Better Auth handler
    ├── profil/           # CRUD profil pasangan
    ├── notifikasi/count/ # Hitung notif belum dibaca
    ├── admin/pernikahan/ # CRUD pernikahan (Admin)
    └── admin/konten/     # CRUD konten CMS (Admin)
```

---

## 🔧 Tech Stack & Konfigurasi

### Environment Variables yang Dibutuhkan
```env
# Database
DATABASE_URL=postgresql://...supabase.co/...

# Better Auth
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://kp-web-katedral-pontianak.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# App
NEXT_PUBLIC_APP_URL=https://kp-web-katedral-pontianak.vercel.app
```

### Perintah Penting
```bash
npm run dev          # Jalankan development server
npm run build        # Build production
npm run db:push      # Push skema ke database
npm run db:studio    # Buka Drizzle Studio (GUI database)
npm run db:seed      # Isi data awal
```

---

*Catatan: Dokumen ini dikompilasi dari `PROJECT_TRACKER.md`, `progress_tracking_(Gemini 3.1 pro).md`, `rencana_migrasi_supabase_google_auth.md`, dan riwayat sesi pengembangan.*
