# Progress Tracking (Gemini 3.1 pro)

File ini digunakan untuk melacak perubahan dan fitur yang dikerjakan pada proyek Katedral Santo Yosef.

## Fase 2 - Alur Pendaftaran & Dasbor UI

### Status Pekerjaan
* [x] Memulai proses pengerjaan
* [x] LANGKAH 1: Instalasi shadcn/ui
* [x] LANGKAH 2: Halaman Login (/masuk)
* [x] LANGKAH 3: Halaman Register (/daftar)
* [x] LANGKAH 4: Halaman Cek Email (/cek-email)
* [x] LANGKAH 5: Sidebar Admin
* [x] LANGKAH 6: Sidebar User COUPLE
* [x] LANGKAH 7: Sidebar Romo
* [x] LANGKAH 8: Header Bar
* [x] LANGKAH 9: Update Layout Files
* [x] LANGKAH 10: Verifikasi Akhir

### Log Perubahan
* **[Inisialisasi]** - Memulai pengerjaan berdasarkan `promnt plan fase 2.md`.
* **[Langkah 1]** - Selesai menginstall komponen shadcn/ui (input, label, form, separator, tooltip, dropdown-menu, avatar, card, sheet, button).
* **[Langkah 2]** - Membuat UI lengkap untuk `/masuk` sesuai spesifikasi desain.
* **[Langkah 3]** - Membuat UI lengkap untuk `/daftar` sesuai spesifikasi desain.
* **[Langkah 4]** - Membuat UI halaman `/cek-email`.
* **[Langkah 5-8]** - Membuat komponen layout modular: `SidebarAdmin` (Dark), `SidebarUser` (Light), `SidebarRomo` (Light), dan `HeaderBar`.
* **[Langkah 9]** - Mengintegrasikan komponen sidebar dan header ke `app/admin/layout.tsx`, `app/dasbor/layout.tsx`, dan `app/romo/layout.tsx` beserta pengecekan sesi server.
* **[Langkah 10]** - Melakukan verifikasi linting (`npm run lint`) dan proses build (`npm run build`) dengan sukses. Fase 2 selesai.

## Fase 3 - Beranda & Profil Calon Pengantin

### Status Pekerjaan
* [x] Memulai proses pengerjaan Fase 3
* [x] Membuat API endpoint `/api/profil`
* [x] Membuat Halaman Dasbor Beranda (`/dasbor/beranda`)
* [x] Membuat Halaman Dasbor Profil (`/dasbor/profil`)

### Log Perubahan
* **[Inisialisasi]** - Memulai pengerjaan Fase 3 berdasarkan spesifikasi (terutama section 7.2 dan 10.1 & 10.4).
* **[Pengerjaan Utama]** - Telah membuat API endpoint di `/api/profil/route.ts` dengan server-action untuk menyimpan data ke database, meng-generate `registrationNumber`, dan insert dokumen otomatis. Halaman `dasbor/profil` sudah memiliki form lengkap, dan `dasbor/beranda` sekarang sudah fungsional menarik data progres pernikahan.

## Fase 4 - Dokumen & Notifikasi Dasbor Pengantin

### Status Pekerjaan
* [x] Memulai proses pengerjaan Fase 4
* [x] Membuat Halaman Dasbor Dokumen (`/dasbor/dokumen`)
* [x] Membuat Halaman Dasbor Notifikasi (`/dasbor/notifikasi`)

### Log Perubahan
* **[Inisialisasi]** - Memulai pengerjaan Fase 4 berdasarkan spesifikasi (section 10.2 & 10.3).
* **[Pengerjaan Utama]** - Telah menyelesaikan antarmuka dan *fetching* data *Server-Side* untuk halaman Dokumen dan Notifikasi. Halaman notifikasi sekarang otomatis menandai pesan sebagai "Sudah Dibaca" saat dikunjungi. Alur untuk pengguna/calon pengantin telah selesai 100%.

## Fase 5 - Pembangunan Dasbor Sekretariat (ADMIN)

### Status Pekerjaan
* [x] Memulai proses pengerjaan Fase 5
* [x] Membuat Halaman Ringkasan (`/admin/ringkasan`)
* [x] Membuat Halaman Daftar Pernikahan (`/admin/pernikahan`)
* [x] Membuat Halaman Detail Pernikahan (`/admin/pernikahan/[id]`)
* [x] Membuat API Admin (`/api/admin/pernikahan/route.ts`)

### Log Perubahan
* **[Inisialisasi]** - Memulai pengerjaan Fase 5 berdasarkan spesifikasi (section 11.1, 11.2, & 11.3).
* **[Pengerjaan Utama]** - Telah berhasil menyelesaikan Dasbor Admin yang meliputi Ringkasan (KPI dan riwayat aktivitas), Daftar Pernikahan, dan Halaman Kelola Detail. Fitur interaktif seperti mengubah status dokumen, menaikkan tahap pendaftaran, serta mengirim catatan ke pengguna sudah berfungsi dan tersambung dengan API.

## Fase 6 - Pembangunan Halaman Publik (Landing Page)

### Status Pekerjaan
* [x] Memulai proses pengerjaan Fase 6
* [x] Membuat Navigasi & Footer Publik
* [x] Membangun Halaman Beranda Utama (`app/page.tsx`)
* [x] Membangun Halaman Jadwal Misa
* [x] Membangun Halaman Berita & Detail Berita

### Log Perubahan
* **[Inisialisasi]** - Memulai pengerjaan Fase 6, Dasbor Romo telah diputuskan untuk dilewati (di-skip) berdasarkan instruksi pengguna. Fokus diarahkan penuh pada antarmuka publik gereja.
* **[Pengerjaan Utama]** - Telah berhasil membangun seluruh komponen halaman publik mulai dari Navbar, Footer, Beranda Landing Page, Jadwal Misa, hingga Daftar Berita dan Detail Berita.

## Fase 7 - Sistem Manajemen Konten (CMS Admin)

### Status Pekerjaan
* [x] Memulai proses pengerjaan Fase 7
* [x] Membuat API CRUD Konten (`/api/admin/konten/route.ts`)
* [x] Membuat Halaman Daftar Konten (`/admin/konten`)
* [x] Membuat Halaman Tambah Konten (`/admin/konten/tambah`)
* [x] Membuat Halaman Edit Konten (`/admin/konten/[id]`)

### Log Perubahan
* **[Inisialisasi]** - Memulai pengerjaan Fase 7. Ini adalah fase terakhir dari spesifikasi utama sistem.
* **[Pengerjaan Utama]** - Telah berhasil menyelesaikan sistem CMS Admin secara penuh. Admin dapat menambah, mengedit, dan menghapus Berita maupun Jadwal Misa. Setiap perubahan langsung terlihat di halaman publik secara *real-time*. Seluruh fase pengembangan utama dari spesifikasi telah selesai dikerjakan.

## Fase 8 - Polishing & Perbaikan Navigasi

### Status Pekerjaan
* [x] Sidebar Admin: hapus menu dead link, hubungkan tombol "Buat Pengumuman" ke `/admin/konten/tambah`
* [x] Redirect Default: `/admin` → `/admin/ringkasan`, `/dasbor` → `/dasbor/beranda`
* [x] Badge Notifikasi: Diubah dari *hardcoded* menjadi dinamis dari API `/api/notifikasi/count`

### Log Perubahan
* **[Pengerjaan Utama]** - Seluruh navigasi, redirect, dan komponen sidebar sudah dibenahi. Sistem kini berjalan penuh dari ujung ke ujung.

## Fase 9 - Finalisasi & Peningkatan UX Kritis

### Status Pekerjaan
* [x] Memulai proses pengerjaan Fase 9
* [x] Memperbaiki redirect pasca login
* [x] Membuat halaman 404 Kustom
* [x] Membuat antarmuka loading statis (Loading UI)

### Log Perubahan
* **[Inisialisasi]** - Memulai pengerjaan Fase 9 untuk memperbaiki hal-hal kritis pada User Experience (UX).
* **[Pengerjaan Utama]** - Selesai menambahkan *loading indicator* bawaan Next.js untuk rute berjenjang (`app/admin` & `app/dasbor`), membuat halaman khusus 404 Not Found, serta memperbaiki alur *redirect* saat pengguna masuk. Pengguna akan secara eksplisit dipaksa mengunjungi `/dasbor` setelah autentikasi sukses, sehingga *middleware* Next.js dapat berfungsi optimal mengatur rute berdasarkan perannya. Penghapusan komponen tak terpakai (Romo) juga telah dilakukan.
