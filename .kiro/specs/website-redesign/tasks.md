# Implementation Plan: Redesign Website SMK Ma'arif NU 01 Karangkobar

## Overview

Implementasi website baru SMK Ma'arif NU 01 Karangkobar menggunakan Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Payload CMS + PostgreSQL. Pendekatan incremental: mulai dari fondasi proyek, lalu komponen layout global, halaman-halaman konten statis, fitur PPDB, dan diakhiri dengan integrasi penuh serta pengujian.

## Tasks

- [x] 1. Setup proyek dan konfigurasi fondasi
  - Inisialisasi proyek Next.js 14 dengan App Router dan TypeScript
  - Konfigurasi Tailwind CSS dan shadcn/ui (tema warna hijau NU)
  - Setup Payload CMS dengan adapter PostgreSQL
  - Konfigurasi environment variables (DATABASE_URL, SMTP, dll.)
  - Setup Vitest, React Testing Library, fast-check, dan Playwright
  - Buat struktur direktori: `app/`, `components/`, `lib/`, `payload/`, `types/`
  - _Requirements: 10.1, 10.3_

- [x] 2. Definisikan tipe data dan skema validasi
  - [x] 2.1 Buat TypeScript interfaces untuk semua model data
    - Buat file `types/index.ts` dengan interface `RegistrasiPPDB`, `Berita`, `GaleriItem`, `ProgramKeahlian`, `MitraIndustri`, `PrestasiItem`
    - _Requirements: 8.4, 3.2, 3.3, 3.4, 1.4, 1.5, 7.1_

  - [x] 2.2 Implementasikan skema validasi Zod untuk FormPPDB
    - Buat file `lib/validations/ppdb.ts` dengan `ppdbFormSchema` dan `PPDBFormData` type
    - Implementasikan semua aturan validasi: NIK 16 digit, email valid, HP format `08xx`/`+628xx`, usia minimal 12 tahun, NISN 10 digit
    - _Requirements: 8.5_

  - [x] 2.3 Tulis property test untuk validasi skema PPDB (Property 1)
    - **Property 1: Validasi formulir PPDB menolak data tidak valid dengan error spesifik**
    - Gunakan `fc.record` dengan `fc.oneof` untuk menghasilkan data tidak valid (NIK bukan 16 digit, email tidak valid, HP format salah, field kosong)
    - Assert: `ppdbFormSchema.safeParse(data).success === false`, errors berisi key field bermasalah, field valid tidak terpengaruh
    - **Validates: Requirements 8.5**

- [x] 3. Implementasikan komponen layout global
  - [x] 3.1 Buat komponen `<Header />`
    - Logo sekolah + logo LP Ma'arif NU + logo NU di kiri
    - Menu navigasi horizontal untuk desktop (Beranda, Profil, Program Keahlian, Kurikulum, Sarana & Prasarana, Kesiswaan, Humas, PPDB)
    - Hamburger menu / drawer untuk mobile dengan `data-testid="hamburger-menu"` dan `data-testid="desktop-nav"`
    - Sticky header dengan shadow saat di-scroll
    - Komponen `<SearchBar />` terintegrasi di header dengan `data-testid="search-bar"`
    - _Requirements: 9.1, 9.2, 10.2, 11.1, 11.3_

  - [x] 3.2 Buat komponen `<Footer />`
    - Kolom logo + tagline NU + deskripsi singkat sekolah
    - Kolom tautan cepat ke halaman utama
    - Kolom kontak (alamat, telepon, email)
    - Kolom media sosial (Facebook, Instagram, YouTube) + Google Maps mini
    - Copyright + identitas LP Ma'arif NU
    - _Requirements: 1.8, 2.4, 2.6, 9.1, 9.3_

  - [x] 3.3 Buat komponen `<Breadcrumb />`
    - Tampilkan di semua halaman kecuali beranda
    - Format: `Beranda > [Halaman Saat Ini]` atau `Beranda > [Parent] > [Halaman]`
    - Tambahkan `data-testid="breadcrumb"` dan schema markup `BreadcrumbList`
    - _Requirements: 11.2_

  - [x] 3.4 Buat komponen `<PageHero />` dan `<SearchBar />`
    - `<PageHero />`: background foto + overlay + judul halaman + breadcrumb
    - `<SearchBar />`: input pencarian full-text, dapat diakses dari semua halaman
    - _Requirements: 11.3_

  - [x] 3.5 Tulis property test untuk navigasi global (Property 7)
    - **Property 7: Navigasi global — breadcrumb dan search bar ada di semua halaman**
    - Generator: pilih halaman acak dari daftar semua route yang terdefinisi
    - Assert: untuk halaman selain beranda, `[data-testid="breadcrumb"]` ada dan menampilkan path yang benar; untuk semua halaman, `[data-testid="search-bar"]` ada di header
    - **Validates: Requirements 11.2, 11.3**

  - [x] 3.6 Tulis property test untuk menu navigasi mobile (Property 5)
    - **Property 5: Menu navigasi mobile muncul pada semua viewport kecil**
    - Generator: integer acak antara 320 dan 767 (lebar viewport mobile) menggunakan `fc.integer({ min: 320, max: 767 })`
    - Assert: `[data-testid="hamburger-menu"]` visible; `[data-testid="desktop-nav"]` hidden
    - Dijalankan dengan Playwright + fast-check
    - **Validates: Requirements 10.2**

- [x] 4. Checkpoint — Pastikan semua tests layout global lulus
  - Pastikan semua tests lulus, tanyakan kepada user jika ada pertanyaan.

- [x] 5. Implementasikan komponen konten umum
  - [x] 5.1 Buat komponen `<ArticleCard />`
    - Thumbnail, kategori, judul, tanggal, ringkasan, tautan
    - Pastikan semua elemen `<img>` memiliki atribut `alt` yang tidak kosong
    - _Requirements: 1.7, 6.3_

  - [x] 5.2 Buat komponen `<GalleryGrid />` dengan lightbox
    - Masonry atau grid layout untuk foto
    - Lightbox dengan navigasi prev/next
    - Semua `<img>` harus memiliki atribut `alt` yang tidak kosong
    - _Requirements: 1.4, 5.1, 5.2, 5.3, 5.4, 6.4_

  - [x] 5.3 Tulis property test untuk aksesibilitas gambar (Property 6)
    - **Property 6: Aksesibilitas — semua gambar memiliki atribut alt yang tidak kosong**
    - Generator: array `GaleriItem` acak dengan berbagai judul dan deskripsi menggunakan `fc.array(fc.record(...))`
    - Assert: setiap elemen `<img>` yang dirender memiliki atribut `alt` yang tidak kosong (`alt !== ''` dan `alt !== undefined`)
    - **Validates: Requirements 10.5**

  - [x] 5.4 Buat komponen `<ContactMap />`
    - Embed Google Maps iframe untuk lokasi sekolah
    - Informasi kontak di samping peta
    - _Requirements: 2.5_

- [x] 6. Implementasikan halaman Beranda (`/`)
  - [x] 6.1 Buat komponen `<HeroSection />`
    - Background foto/video sekolah dengan overlay warna hijau NU
    - Judul, tagline Islam NU, dua tombol CTA: "Daftar PPDB Sekarang" dan "Pelajari Program Keahlian"
    - _Requirements: 1.1, 9.3_

  - [x] 6.2 Buat komponen `<InfoCardGrid />`, `<ProgramKeahlianSection />`, `<MitraIndustriSection />`, `<EkstrakurikulerSection />`
    - `<InfoCardGrid />`: 4 card (PPDB, Program Keahlian, Galeri, Mitra Industri)
    - `<ProgramKeahlianSection />`: 3 card TBSM, TJKT, AKL dengan deskripsi dan tautan
    - `<MitraIndustriSection />`: logo/nama mitra dalam carousel/grid
    - `<EkstrakurikulerSection />`: daftar ekstrakurikuler
    - _Requirements: 1.2, 1.3, 1.5, 1.6_

  - [x] 6.3 Buat komponen `<GaleriSection />` dan `<BeritaTerbaruSection />`
    - `<GaleriSection />`: grid minimal 6 foto terbaru dengan lightbox
    - `<BeritaTerbaruSection />`: 3 artikel terbaru (thumbnail, judul, tanggal, ringkasan)
    - _Requirements: 1.4, 1.7_

  - [x] 6.4 Rakit halaman Beranda (`app/page.tsx`) dengan ISR (revalidate: 3600)
    - Gabungkan semua section komponen beranda
    - Fetch data dari Payload CMS (galeri, berita, mitra, ekstrakurikuler)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

  - [x] 6.5 Tulis property test untuk rendering koleksi konten (Property 3)
    - **Property 3: Rendering koleksi konten menampilkan semua item dengan field yang diperlukan**
    - Generator: array item konten acak (foto, mitra, berita, ekstrakurikuler) dengan panjang bervariasi menggunakan `fc.array`
    - Assert: jumlah elemen yang dirender === jumlah item dalam koleksi; setiap elemen memiliki field yang dipersyaratkan; untuk galeri beranda minimal 6 foto; untuk berita beranda 3 terbaru
    - **Validates: Requirements 1.4, 1.5, 1.6, 1.7, 3.1, 3.2, 3.3, 3.4, 6.2, 8.2**

- [x] 7. Implementasikan halaman konten statis (SSG)
  - [x] 7.1 Buat halaman Profil Sekolah (`app/profil/page.tsx`)
    - Sambutan kepala sekolah (foto + nama jabatan)
    - Visi dan Misi terpisah dan jelas
    - Struktur organisasi (diagram/tabel)
    - Informasi kontak + peta Google Maps + tautan media sosial
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 7.2 Buat halaman daftar Program Keahlian (`app/program-keahlian/page.tsx`) dan halaman detail (`app/program-keahlian/[slug]/page.tsx`)
    - Daftar: 3 program (TBSM, TJKT, AKL) dengan nama, deskripsi singkat, tautan detail
    - Detail: deskripsi lengkap, tujuan, kompetensi, prospek kerja, prestasi
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 7.3 Buat halaman Kurikulum (`app/kurikulum/page.tsx`)
    - Informasi kurikulum, mata pelajaran umum dan produktif (terpisah)
    - Metode pembelajaran, sistem penilaian, kegiatan luar kelas
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 7.4 Buat halaman Sarana & Prasarana (`app/sarana-prasarana/page.tsx`)
    - Informasi dan foto: ruang kelas, lab komputer, perpustakaan, sarana olahraga, sarana pendukung lainnya
    - Semua `<img>` harus memiliki atribut `alt` yang tidak kosong
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 7.5 Buat halaman Kesiswaan (`app/kesiswaan/page.tsx`) dengan ISR (revalidate: 3600)
    - Daftar ekstrakurikuler dengan deskripsi
    - Daftar prestasi siswa (nama kejuaraan, tingkat, tahun)
    - Berita kegiatan kesiswaan + galeri foto
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 7.6 Buat halaman Humas (`app/humas/page.tsx`)
    - Daftar mitra industri, informasi MOU, daftar tempat PKL, informasi alumni
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 8. Implementasikan Payload CMS collections
  - [x] 8.1 Buat Payload collection untuk `Berita`, `GaleriItem`, `ProgramKeahlian`, `MitraIndustri`
    - Definisikan fields sesuai TypeScript interfaces di `types/index.ts`
    - Konfigurasi upload media (Cloudinary atau local storage)
    - _Requirements: 1.4, 1.5, 1.7, 3.1, 3.2, 3.3, 3.4, 6.2, 7.1_

  - [x] 8.2 Buat Payload collection untuk `RegistrasiPPDB`
    - Definisikan fields sesuai interface `RegistrasiPPDB`
    - Konfigurasi akses: hanya admin yang dapat membaca/mengubah data
    - _Requirements: 8.4_

  - [x] 8.3 Tulis unit tests untuk Payload collections
    - Test bahwa schema collection sesuai dengan TypeScript interfaces
    - Test akses kontrol (pengunjung tidak dapat membaca data PPDB)
    - _Requirements: 8.4_

- [x] 9. Checkpoint — Pastikan semua tests halaman statis dan CMS lulus
  - Pastikan semua tests lulus, tanyakan kepada user jika ada pertanyaan.

- [x] 10. Implementasikan fitur PPDB
  - [x] 10.1 Buat fungsi utilitas PPDB
    - Implementasikan `generateNomorPendaftaran()` dengan format `PPDB-YYYY-XXXXX`
    - Implementasikan `formatTanggal()` untuk format tanggal Bahasa Indonesia
    - _Requirements: 8.4_

  - [x] 10.2 Tulis unit tests untuk fungsi utilitas PPDB
    - Test `generateNomorPendaftaran()`: format yang benar dan keunikan untuk N pemanggilan
    - Test `formatTanggal()`: format tanggal Bahasa Indonesia yang benar
    - _Requirements: 8.4_

  - [x] 10.3 Implementasikan Server Action untuk submit formulir PPDB
    - Re-validasi dengan `ppdbFormSchema` di server (tidak mempercayai data client)
    - Simpan data ke PostgreSQL via Payload CMS
    - Generate `nomorPendaftaran` unik
    - Kirim email konfirmasi via Nodemailer (SMTP Gmail/Zoho)
    - Return `{ success: true, nomorPendaftaran }` atau `{ success: false, errors }`
    - _Requirements: 8.4, 8.6_

  - [x] 10.4 Tulis property test untuk round-trip data PPDB (Property 2)
    - **Property 2: Data PPDB round-trip — tersimpan dan dapat diambil kembali secara identik**
    - Generator: objek `PPDBFormData` valid secara acak (nama acak, NIK 16 digit acak, email valid acak, HP valid acak) menggunakan `fc.record`
    - Assert: setelah `saveRegistrasi(data)`, `getRegistrasiById(id)` mengembalikan data identik; untuk N pendaftaran acak, semua `nomorPendaftaran` adalah unik
    - **Validates: Requirements 8.4**

  - [x] 10.5 Buat komponen `<FormPPDB />` dengan React Hook Form
    - Formulir dengan semua field: nama lengkap, NIK, tempat/tanggal lahir, asal sekolah, program keahlian pilihan, nama orang tua, nomor HP, email
    - Validasi real-time client-side (Zod + React Hook Form) dengan pesan error per field
    - Loading state saat submit, tampilan konfirmasi setelah berhasil
    - Data field valid tidak dihapus saat ada error di field lain
    - _Requirements: 8.4, 8.5_

  - [x] 10.6 Tulis unit tests untuk komponen `<FormPPDB />`
    - Test render semua field
    - Test pesan error muncul untuk field tidak valid
    - Test data field valid tidak hilang saat ada error di field lain
    - Test tampilan konfirmasi setelah submit berhasil
    - _Requirements: 8.4, 8.5_

  - [x] 10.7 Buat halaman PPDB (`app/ppdb/page.tsx`) dengan SSR
    - Rakit `<PPDBInfoSection />`, `<AlurPendaftaran />`, `<PersyaratanDokumen />`, `<FormPPDB />`
    - `<PPDBInfoSection />`: jadwal, kuota per program, biaya pendaftaran
    - `<AlurPendaftaran />`: stepper visual langkah demi langkah
    - `<PersyaratanDokumen />`: checklist dokumen yang diperlukan
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 11. Implementasikan halaman Berita dan Galeri
  - [x] 11.1 Buat halaman daftar Berita (`app/berita/page.tsx`) dengan ISR (revalidate: 1800)
    - Daftar artikel dengan `<ArticleCard />` (thumbnail, kategori, judul, tanggal, ringkasan)
    - _Requirements: 1.7, 6.3_

  - [x] 11.2 Buat halaman detail Berita (`app/berita/[slug]/page.tsx`) dengan ISR
    - Konten artikel lengkap (rich text)
    - Breadcrumb: `Beranda > Berita > [Judul Artikel]`
    - _Requirements: 11.2_

  - [x] 11.3 Buat halaman Galeri (`app/galeri/page.tsx`)
    - `<GalleryGrid />` dengan semua foto/video
    - Filter berdasarkan kategori
    - _Requirements: 1.4, 6.4_

- [x] 12. Implementasikan halaman 404 dan error handling
  - [x] 12.1 Buat halaman 404 kustom (`app/not-found.tsx`)
    - Desain sesuai identitas sekolah, pesan informatif Bahasa Indonesia
    - Tombol "Kembali ke Beranda" dan tautan ke halaman utama
    - Tidak menampilkan stack trace atau informasi teknis
    - _Requirements: 11.4_

  - [x] 12.2 Buat error boundary (`app/error.tsx`) dan konfigurasi error handling global
    - Halaman error kustom dengan tombol "Coba Lagi"
    - Log error ke console (dapat dikonfigurasi ke Sentry)
    - _Requirements: 11.4_

  - [x]* 12.3 Tulis integration tests untuk alur error
    - Test URL tidak valid → halaman 404 kustom ditampilkan
    - Test submit PPDB dengan data tidak valid → error ditampilkan, data valid tidak hilang
    - _Requirements: 8.5, 11.4_

- [x] 13. Checkpoint — Pastikan semua tests fitur PPDB dan halaman lulus
  - Pastikan semua tests lulus, tanyakan kepada user jika ada pertanyaan.

- [x] 14. Implementasikan responsivitas dan aksesibilitas
  - [x] 14.1 Audit dan perbaiki responsivitas semua halaman
    - Pastikan layout responsif dari 320px hingga 1920px
    - Pastikan tidak ada horizontal overflow pada semua breakpoint
    - Ukuran teks minimal 16px untuk konten utama
    - _Requirements: 10.1, 10.4_

  - [x]* 14.2 Tulis property test untuk responsivitas layout (Property 4)
    - **Property 4: Responsivitas layout tanpa horizontal overflow pada semua lebar layar**
    - Generator: integer acak antara 320 dan 1920 menggunakan `fc.integer({ min: 320, max: 1920 })`
    - Assert: tidak ada elemen dengan `scrollWidth > clientWidth` pada body (tidak ada horizontal overflow)
    - Dijalankan dengan Playwright + fast-check
    - **Validates: Requirements 10.1**

  - [x] 14.3 Audit dan perbaiki aksesibilitas semua halaman
    - Pastikan semua `<img>` memiliki atribut `alt` yang tidak kosong dan deskriptif
    - Pastikan semua form field memiliki label yang terhubung
    - Pastikan navigasi keyboard berfungsi di semua komponen interaktif
    - Jalankan axe-core untuk verifikasi WCAG 2.1 AA
    - _Requirements: 10.5_

  - [x]* 14.4 Tulis integration tests aksesibilitas dengan axe-core
    - Test semua halaman utama dengan axe-core
    - Test navigasi keyboard pada hamburger menu dan form PPDB
    - _Requirements: 10.5_

- [x] 15. Integrasi akhir dan wiring komponen
  - [x] 15.1 Pastikan semua halaman menggunakan layout global (`<Header />`, `<Footer />`, `<Breadcrumb />`)
    - Konfigurasi `app/layout.tsx` dengan layout global
    - Pastikan identitas LP Ma'arif NU (logo, warna, tagline) konsisten di semua halaman
    - _Requirements: 9.1, 9.2, 9.3, 11.1_

  - [x] 15.2 Implementasikan fitur pencarian konten
    - Pencarian full-text terhadap konten berita, program keahlian, dan halaman statis
    - Halaman hasil pencarian (`app/search/page.tsx`) dengan parameter `?q=...`
    - _Requirements: 11.3_

  - [x] 15.3 Tulis integration tests untuk alur PPDB end-to-end
    - Test alur lengkap: input valid → Server Action → database tersimpan → email terkirim
    - Test alur error: input tidak valid → error ditampilkan → data valid tidak hilang
    - Gunakan Playwright untuk simulasi interaksi pengguna
    - _Requirements: 8.4, 8.5, 8.6_

- [x] 16. Final checkpoint — Pastikan semua tests lulus
  - Jalankan seluruh test suite (unit, property, integration, accessibility)
  - Pastikan semua tests lulus, tanyakan kepada user jika ada pertanyaan.

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirements spesifik untuk keterlacakan
- Property tests menggunakan fast-check dengan minimal 100 iterasi per property
- Property tests 4 dan 5 dijalankan dengan Playwright + fast-check untuk simulasi viewport
- Checkpoint memastikan validasi incremental sebelum melanjutkan ke fase berikutnya
- Semua komponen menggunakan TypeScript strict mode
- Payload CMS admin panel memungkinkan staf sekolah mengelola konten tanpa coding
