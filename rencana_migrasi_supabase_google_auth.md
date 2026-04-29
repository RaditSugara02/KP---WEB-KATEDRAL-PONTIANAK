# Rencana Migrasi Supabase & Integrasi Google Auth

Dokumen ini mencatat langkah-langkah terstruktur untuk memigrasikan database dari SQLite lokal ke **Supabase (PostgreSQL)**, serta mengganti sistem registrasi manual dengan **Google Auth** demi kenyamanan pengguna (UX) dan kesiapan produksi.

## 1. Persiapan Infrastruktur (Database)
* **Status:** ✅ Selesai
* **Langkah-langkah:**
  - Menghapus dependensi SQLite (`better-sqlite3`).
  - Menginstal driver PostgreSQL (`postgres` atau `pg`).
  - Mengubah `drizzle.config.ts` dari `dialect: "sqlite"` menjadi `dialect: "postgresql"`.
  - Memperbarui `lib/db/index.ts` untuk menggunakan koneksi berbasis URL Supabase.
  - Memperbarui `.env` dengan kredensial `DATABASE_URL` dari Supabase.

## 2. Refactoring Skema Database (`schema.ts`)
* **Status:** ✅ Selesai
* **Langkah-langkah:**
  - Mengganti semua fungsi `sqliteTable` menjadi `pgTable` dari `drizzle-orm/pg-core`.
  - Mengubah tipe data SQLite (`integer` untuk boolean/timestamp) menjadi tipe data native PostgreSQL (`boolean`, `timestamp`, `varchar`, dll).
  - Menjalankan perintah migrasi `npm run db:push` atau `npm run db:generate` untuk membuat tabel baru di Supabase.

## 3. Konfigurasi Google Auth
* **Status:** ✅ Selesai
* **Langkah-langkah:**
  - Mengonfigurasi `socialProviders.google` di dalam file `lib/auth.ts` (konfigurasi Better Auth).
  - Menambahkan `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` ke file `.env` (User perlu menyediakan kredensial ini dari Google Cloud Console).
  - Memastikan *callback URL* di Google Cloud Console mengarah ke `http://localhost:3000/api/auth/callback/google`.

## 4. Penyesuaian Antarmuka Pengguna (UI)
* **Status:** ✅ Selesai
* **Langkah-langkah:**
  - Mengubah halaman `app/(auth)/masuk/page.tsx` untuk menampilkan tombol "Lanjutkan dengan Google".
  - Mengubah halaman `app/(auth)/daftar/page.tsx` menjadi sangat sederhana, fokus pada tombol "Daftar dengan Google", dan membuang formulir input manual (Nama, Password).
  - Memastikan alur pengalihan (*redirect*) tetap menuju `/dasbor/beranda` setelah registrasi/login berhasil.

## 5. Uji Coba & Penyesuaian Data
* **Status:** ✅ Selesai
* **Langkah-langkah:**
  - Mencoba *login* menggunakan akun Google sungguhan.
  - Memastikan pengguna baru otomatis tercatat di tabel `users` Supabase.
  - Memastikan form di `/dasbor/profil` masih berjalan normal (karena form ini yang bertugas mengumpulkan sisa data yang tidak didapat dari Google, seperti nomor telepon).
  - Memasukkan kembali (Seeding) data akun Admin pertama.

## 6. Kebijakan Manajemen Data (Soft Delete)
* **Status:** ✅ Selesai
* **Langkah-langkah:**
  - Menerapkan konsep **Soft Delete** pada pembatalan pendaftaran pernikahan demi menjaga integritas data dan rekam jejak (*history*).
  - Data pendaftaran tidak dihapus secara fisik (*Hard Delete*) dari tabel `marriage_applications`.
  - Sistem menggunakan logika pengalihan tahap ke **"Tahap 99"** sebagai penanda bahwa pendaftaran tersebut berstatus **"Dibatalkan / Canceled"**.
  - Pendaftar di Tahap 99 secara otomatis tidak dihitung dalam statistik dasbor aktif, dan layar dasbor pasangan akan berubah menjadi mode peringatan merah (terkunci).

---
*Catatan: File ini akan di-update statusnya seiring berjalannya proses eksekusi.*
