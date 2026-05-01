# 📋 Log Progres Proyek: Sistem Informasi Katedral Santo Yosef

> Dokumen ini merangkum seluruh perjalanan pengembangan proyek dari awal hingga saat ini.
> Terakhir diperbarui: 1 Mei 2026
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

#### 1. Penugasan Romo (Priest Assignment) ✅ SELESAI
- [x] Dropdown di halaman detail pernikahan untuk Admin memilih Romo
- [x] Update `priestId` di tabel `marriage_applications`
- [x] API endpoint `GET /api/admin/romo` untuk daftar imam
- [x] API action `ASSIGN_PRIEST` di `/api/admin/pernikahan`

#### 2. KPI "Perlu Verifikasi" di Admin ✅ SELESAI
- [x] KPI card ke-4 di ringkasan admin sudah dinamis
- [x] Query menghitung jumlah aplikasi aktif yang masih punya dokumen belum diterima

#### 3. Halaman Admin: Pengguna (`/admin/pengguna`) ✅ SELESAI
- [x] Tampilkan daftar semua user terdaftar (COUPLE, ADMIN, PRIEST)
- [x] Informasi: nama, email, role, tanggal daftar
- [x] KPI cards: jumlah per role
- [x] Badge role berwarna dan status verifikasi email

#### 4. Halaman Admin: Pengaturan (`/admin/pengaturan`) ✅ SELESAI
- [x] Form edit informasi gereja (nama, alamat, nomor telepon, email)
- [x] Pengaturan jam operasional sekretariat
- [x] Pengaturan jadwal misa default
- [x] API `GET/POST /api/admin/pengaturan` — simpan ke tabel `contents` (tanpa migrasi DB)
- [x] Dipisahkan dari pengaturan akun admin secara visual

### 🟡 Prioritas Menengah

#### 5. Notifikasi Email Otomatis ✅ SELESAI
- [x] Integrasi Resend SDK (`npm install resend`)
- [x] Template HTML branded untuk 3 jenis email: naik tahap, pembatalan, jadwal pemberkatan
- [x] Email dikirim saat ADVANCE_STAGE, CANCEL_APPLICATION, SET_WEDDING_DATE
- [x] Fire-and-forget (tidak memblokir API response) menggunakan `.catch(console.error)`
- [x] Graceful skip jika `RESEND_API_KEY` tidak dikonfigurasi
- *Catatan: Tambahkan `RESEND_API_KEY` di Vercel Dashboard untuk mengaktifkan email*

#### 6. Riwayat Tahap di Dasbor Pengantin ✅ SELESAI
- [x] Timeline riwayat perubahan tahap tampil di `/dasbor/beranda`
- [x] Query `stage_history` lengkap (tidak hanya yang terbaru)
- [x] Format: tanggal + jam + label tahap berwarna + catatan admin
- [x] Dot berwarna berbeda: terbaru (gold), selesai (hijau), pertama (abu)

#### 7. Jadwal Pemberkatan di Dasbor Pengantin ✅ SELESAI
- [x] Admin bisa input tanggal & jam pemberkatan di halaman detail pernikahan
- [x] API action `SET_WEDDING_DATE` di `/api/admin/pernikahan`
- [x] Banner hijau jadwal pemberkatan muncul di `/dasbor/beranda` pasangan
- [x] Notifikasi otomatis terkirim ke pasangan saat jadwal ditetapkan

#### 8. Print / Download Bukti Pendaftaran ✅ SELESAI
- [x] Halaman `/dasbor/cetak` dengan layout print-optimized
- [x] Menampilkan: nomor registrasi, data mempelai, status tahap, jadwal pemberkatan, checklist dokumen
- [x] Tombol "Cetak / Simpan PDF" (menggunakan `window.print()` — tanpa npm tambahan)
- [x] Tombol "Cetak Bukti" di header dasbor pengantin
- [x] Garis tanda tangan untuk Sekretariat & Mempelai

#### 9. Pencarian & Filter di Tabel Admin Pernikahan ✅ SELESAI
- [x] Search by nama mempelai atau nomor registrasi (live, client-side)
- [x] Filter by status tahap (Tahap 1–5, Dibatalkan) dengan dropdown
- [x] Tombol reset filter
- [x] Counter hasil pencarian di bawah tabel
- [x] Diimplementasikan sebagai `PernikahanTableClient.tsx` (client component)

### 🟢 Prioritas Rendah / Enhancement

#### 10. Data Table yang Lebih Canggih
- [ ] Ganti tabel biasa di Admin dengan Shadcn Data Table (paginasi, filter, sortir)
- [ ] Date Picker dan Select component dari shadcn untuk form

#### 11. End-to-End Testing
- [ ] Uji alur lengkap: Daftar akun → Isi profil → Lihat dokumen → Terima notifikasi
- [ ] Uji alur Admin: Login → Lihat pendaftar → Naikkan tahap → Kirim notifikasi
- [ ] Uji di device mobile nyata

#### 12. SEO & Metadata ✅ SELESAI
- [x] Open Graph meta tags lengkap di root layout
- [x] Title template dinamis (`%s | Katedral Santo Yosef`)
- [x] `sitemap.xml` otomatis via `app/sitemap.ts`
- [x] `robots.txt` via `app/robots.ts` — blokir `/admin/`, `/dasbor/`, `/api/`
- [x] keywords, author, creator, twitter card

#### 13. Halaman Kontak & Lokasi (Publik) ✅ SELESAI
- [x] Halaman `/kontak` dengan tampilan premium
- [x] Data diambil dari church settings API secara dinamis (ISR)
- [x] Kartu: Alamat, Telepon, Email, Jam Operasional, Jadwal Misa
- [x] Embed Google Maps
- [x] CTA pendaftaran pernikahan di bagian bawah
- [x] Link "Kontak" ditambahkan ke navbar publik
- [x] API publik `/api/public/church-info` (tanpa auth, dengan cache)

#### 14. Galeri Foto Gereja (Publik) ✅ SELESAI
- [x] Halaman `/galeri` dengan layout masonry 3 kolom (responsif)
- [x] Admin kelola foto via CMS admin (`Tipe: Foto Galeri`)
- [x] Tipe `"GALLERY"` di tabel `contents` — tiap entri = 1 foto
- [x] API publik `/api/public/galeri` dengan ISR cache
- [x] Hover overlay dengan keterangan foto
- [x] Empty state bila belum ada foto
- [x] Link "Galeri" di navbar publik
- [x] Entri galeri ditambahkan ke `sitemap.xml`

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
| 30 Apr 2026 | Implementasi: Penugasan Romo, KPI Perlu Verifikasi, Halaman Pengguna |
| 30 Apr 2026 | Implementasi: Search/Filter pernikahan, Timeline riwayat tahap, Halaman pengaturan gereja |
| 30 Apr 2026 | Implementasi: Jadwal pemberkatan (admin+dasbor), Print/PDF bukti pendaftaran |
| 30 Apr 2026 | Implementasi: Email Resend, SEO metadata+sitemap+robots, Halaman Kontak publik |

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

---

## 📅 PEMBARUAN — 1 Mei 2026

### ✅ Fitur Daftar Ulang Lengkap

**Deskripsi:** Implementasi sistem daftar ulang pernikahan yang memungkinkan pasangan yang pendaftarannya dibatalkan untuk mengajukan pendaftaran baru, dengan visibilitas penuh bagi Admin.

#### Perubahan Database
- [x] Tambah kolom `is_reregistration BOOLEAN DEFAULT false` pada tabel `marriage_applications`
- [x] Tambah kolom `previous_application_id TEXT NULL` pada tabel `marriage_applications` (referensi ke aplikasi yang dibatalkan)
- [x] Migrasi dijalankan langsung ke Supabase via SQL

#### Sisi Admin
- [x] **Badge "🔄 Daftar Ulang"** di tabel `/admin/pernikahan` — muncul di samping nama pasangan
- [x] **Filter "🔄 Daftar Ulang"** di dropdown filter tahap
- [x] **Badge di header** halaman detail `/admin/pernikahan/[id]` — tampil berdampingan dengan badge tahap
- [x] **Section "Riwayat Pendaftaran Sebelumnya"** di halaman detail — tabel berisi:
  - No. registrasi lama
  - Tanggal daftar pertama
  - Tanggal dibatalkan
  - Alasan pembatalan dari sekretariat
  - Status: DIBATALKAN

#### Sisi Pengantin (Dasbor)
- [x] **Tombol "Ajukan Daftar Ulang"** di banner pembatalan pada `/dasbor/beranda`
- [x] Konfirmasi dialog sebelum submit
- [x] Spinner loading saat proses berlangsung
- [x] Redirect otomatis ke dasbor aktif setelah sukses

#### API Baru
- [x] `POST /api/dasbor/daftar-ulang` — membuat aplikasi baru dengan:
  - `isReregistration = true`
  - `previousApplicationId` = id aplikasi yang dibatalkan
  - 11 dokumen default direset
  - Riwayat tahap dicatat
  - Notifikasi dikirim ke pengantin

#### File yang Diubah/Dibuat
| File | Perubahan |
|---|---|
| `lib/db/schema.ts` | +2 kolom baru di `marriageApplications` |
| `app/api/dasbor/daftar-ulang/route.ts` | **[BARU]** API endpoint daftar ulang |
| `app/dasbor/beranda/DaftarUlangButton.tsx` | **[BARU]** Client component tombol |
| `app/dasbor/beranda/page.tsx` | Import + tambah tombol di banner |
| `app/admin/pernikahan/page.tsx` | Query tambah `isReregistration` |
| `app/admin/pernikahan/PernikahanTableClient.tsx` | Badge + filter daftar ulang |
| `app/admin/pernikahan/[id]/page.tsx` | Fetch previous app data + badge header |
| `app/admin/pernikahan/[id]/DetailClient.tsx` | Section riwayat pendaftaran sebelumnya |

---

### ✅ Perbaikan Halaman Berita (Pagination & Kategori Dinamis)

**Deskripsi:** Memperbarui sistem berita agar kategori yang muncul dapat menyesuaikan dengan data input dari admin, serta mengimplementasikan fungsionalitas limit (10 berita/grid) dengan nomor halaman.

#### Perubahan yang Dilakukan
- **Database Schema:** Menambahkan kolom `category` (VARCHAR 50) pada tabel `contents` untuk menyimpan sub-kategori khusus tipe `NEWS` (seperti Pengumuman, Kegiatan, Renungan, dsb).
- **Admin UI:** Menambahkan field input teks "Kategori Berita" pada form `tambah/page.tsx` dan `EditKontenClient.tsx` (muncul hanya jika tipe konten adalah "Berita / Artikel").
- **API Server:** Memperbarui `POST` dan `PUT` pada endpoint `/api/admin/konten/route.ts` untuk memproses dan menyimpan atribut `category`.
- **Public UI (Client Component):** Membuat komponen baru `BeritaListClient.tsx` yang menangani:
  - Ekstraksi kategori secara dinamis dari database (tombol filter menyesuaikan otomatis dengan kategori berita yang sudah diinput admin).
  - Sistem filter berita client-side yang sangat responsif.
  - Implementasi *pagination* dengan membatasi grid maksimal 10 berita per halaman, beserta kontrol nomor halaman di bagian bawah.
  - Skenario layar kosong (Empty State) yang menampilkan placeholder apabila belum ada berita dalam kategori tersebut.
- **Berita Page Wrapper:** Mengubah halaman `app/(public)/berita/page.tsx` untuk mengambil semua berita (`type="NEWS"`) secara *Server-Side* dari database lalu meneruskannya ke `BeritaListClient` untuk interaktivitas instan tanpa memuat ulang (reload) halaman.
