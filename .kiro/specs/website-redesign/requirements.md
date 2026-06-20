# Requirements Document

## Introduction

Redesign website SMK Ma'arif NU 01 Karangkobar (https://www.smkmaarifnu01karangkobar.sch.id/) untuk mengatasi masalah utama pada website lama: informasi tidak terstruktur, tampilan tidak modern dan tidak mobile-friendly, tidak ada alur PPDB online yang jelas, identitas sekolah kejuruan berbasis Islam NU kurang menonjol, serta calon siswa dan orang tua kesulitan mengenal program keahlian (TBSM, TJKT, AKL).

Website baru dirancang untuk menjadi media informasi utama sekolah yang modern, responsif, dan mencerminkan identitas LP Ma'arif NU, dengan fitur PPDB online yang jelas dan navigasi yang mudah bagi calon siswa, orang tua, dan masyarakat umum.

## Glossary

- **Website**: Sistem website SMK Ma'arif NU 01 Karangkobar yang baru
- **Pengunjung**: Pengguna umum yang mengakses website (calon siswa, orang tua, masyarakat)
- **Admin**: Pengelola konten website dari pihak sekolah
- **PPDB**: Penerimaan Peserta Didik Baru — proses pendaftaran siswa baru
- **Program_Keahlian**: Salah satu dari tiga jurusan: TBSM, TJKT, atau AKL
- **TBSM**: Teknik dan Bisnis Sepeda Motor
- **TJKT**: Teknik Jaringan Komputer dan Telekomunikasi
- **AKL**: Akuntansi dan Keuangan Lembaga
- **Hero_Section**: Bagian utama di atas halaman beranda yang menampilkan pesan selamat datang
- **CMS**: Content Management System — sistem pengelolaan konten website

---

## Requirements

### Requirement 1: Halaman Beranda (Homepage)

**User Story:** Sebagai pengunjung, saya ingin melihat ringkasan lengkap tentang sekolah di halaman utama, sehingga saya dapat memahami identitas dan keunggulan SMK Ma'arif NU 01 Karangkobar dengan cepat.

#### Acceptance Criteria

1. WHEN pengunjung membuka halaman beranda, THE Website SHALL menampilkan Hero Section dengan judul selamat datang, tagline sekolah, dan tombol CTA menuju halaman PPDB
2. WHEN pengunjung melihat beranda, THE Website SHALL menampilkan 4 card utama yang merangkum informasi PPDB, Program Keahlian, Galeri Kegiatan, dan Mitra Industri
3. WHEN pengunjung melihat beranda, THE Website SHALL menampilkan daftar 3 Program Keahlian (TBSM, TJKT, AKL) beserta deskripsi singkat dan tautan ke halaman detail masing-masing
4. WHEN pengunjung melihat beranda, THE Website SHALL menampilkan galeri kegiatan sekolah dengan minimal 6 foto terbaru
5. WHEN pengunjung melihat beranda, THE Website SHALL menampilkan daftar mitra industri sekolah dalam bentuk logo atau nama perusahaan
6. WHEN pengunjung melihat beranda, THE Website SHALL menampilkan daftar ekstrakurikuler yang tersedia
7. WHEN pengunjung melihat beranda, THE Website SHALL menampilkan 3 berita atau artikel terbaru dengan judul, tanggal, dan ringkasan singkat
8. THE Website SHALL menampilkan footer yang berisi alamat sekolah, nomor telepon, email, dan tautan media sosial (Facebook, Instagram, YouTube) di setiap halaman

---

### Requirement 2: Halaman Profil Sekolah

**User Story:** Sebagai pengunjung, saya ingin mengetahui profil lengkap sekolah, sehingga saya dapat memahami latar belakang, visi misi, dan cara menghubungi sekolah.

#### Acceptance Criteria

1. WHEN pengunjung membuka halaman Profil, THE Website SHALL menampilkan sambutan kepala sekolah 
2. WHEN pengunjung membuka halaman Profil, THE Website SHALL menampilkan Visi dan Misi sekolah secara terpisah dan jelas
3. WHEN pengunjung membuka halaman Profil, THE Website SHALL menampilkan struktur organisasi sekolah dalam bentuk diagram atau tabel
4. WHEN pengunjung membuka halaman Profil, THE Website SHALL menampilkan informasi kontak yang mencakup alamat lengkap, nomor telepon, dan email
5. WHEN pengunjung membuka halaman Profil, THE Website SHALL menampilkan peta lokasi sekolah yang terintegrasi dengan Google Maps
6. WHEN pengunjung membuka halaman Profil, THE Website SHALL menampilkan tautan ke akun media sosial resmi sekolah (Facebook, Instagram, YouTube)

---

### Requirement 3: Halaman Program Keahlian

**User Story:** Sebagai calon siswa atau orang tua, saya ingin mengetahui detail setiap program keahlian, sehingga saya dapat memilih jurusan yang sesuai dengan minat dan prospek karir.

#### Acceptance Criteria

1. WHEN pengunjung membuka halaman daftar Program Keahlian, THE Website SHALL menampilkan ketiga program (TBSM, TJKT, AKL) dengan nama lengkap, deskripsi singkat, dan tautan ke halaman detail
2. WHEN pengunjung membuka halaman detail Program_Keahlian, THE Website SHALL menampilkan profil program yang mencakup deskripsi lengkap, tujuan, dan kompetensi yang dipelajari
3. WHEN pengunjung membuka halaman detail Program_Keahlian, THE Website SHALL menampilkan daftar prospek kerja lulusan program tersebut
4. WHEN pengunjung membuka halaman detail Program_Keahlian, THE Website SHALL menampilkan prestasi yang pernah diraih oleh program keahlian tersebut

---

### Requirement 4: Halaman Kurikulum

**User Story:** Sebagai calon siswa atau orang tua, saya ingin mengetahui kurikulum yang digunakan, sehingga saya dapat memahami materi pembelajaran yang akan diterima.

#### Acceptance Criteria

1. WHEN pengunjung membuka halaman Kurikulum, THE Website SHALL menampilkan informasi kurikulum yang digunakan beserta penjelasan singkat
2. WHEN pengunjung membuka halaman Kurikulum, THE Website SHALL menampilkan daftar mata pelajaran umum dan mata pelajaran produktif secara terpisah
3. WHEN pengunjung membuka halaman Kurikulum, THE Website SHALL menampilkan penjelasan metode pembelajaran yang diterapkan
4. WHEN pengunjung membuka halaman Kurikulum, THE Website SHALL menampilkan informasi sistem penilaian dan evaluasi yang digunakan
5. WHEN pengunjung membuka halaman Kurikulum, THE Website SHALL menampilkan informasi kegiatan pembelajaran di luar kelas (praktik, PKL, dll.)

---

### Requirement 5: Halaman Sarana & Prasarana

**User Story:** Sebagai calon siswa atau orang tua, saya ingin melihat fasilitas yang tersedia di sekolah, sehingga saya dapat menilai kualitas lingkungan belajar.

#### Acceptance Criteria

1. WHEN pengunjung membuka halaman Sarana & Prasarana, THE Website SHALL menampilkan informasi dan foto ruang kelas
2. WHEN pengunjung membuka halaman Sarana & Prasarana, THE Website SHALL menampilkan informasi dan foto laboratorium komputer
3. WHEN pengunjung membuka halaman Sarana & Prasarana, THE Website SHALL menampilkan informasi dan foto perpustakaan
4. WHEN pengunjung membuka halaman Sarana & Prasarana, THE Website SHALL menampilkan informasi dan foto sarana olahraga
5. WHEN pengunjung membuka halaman Sarana & Prasarana, THE Website SHALL menampilkan informasi sarana pendukung lainnya yang tersedia di sekolah

---

### Requirement 6: Halaman Kesiswaan

**User Story:** Sebagai pengunjung, saya ingin mengetahui kegiatan dan prestasi siswa, sehingga saya dapat melihat keaktifan dan pencapaian siswa SMK Ma'arif NU 01 Karangkobar.

#### Acceptance Criteria

1. WHEN pengunjung membuka halaman Kesiswaan, THE Website SHALL menampilkan daftar ekstrakurikuler yang tersedia beserta deskripsi singkat masing-masing
2. WHEN pengunjung membuka halaman Kesiswaan, THE Website SHALL menampilkan kegiatan kemaarifan yang menunjukkan ciri khas NU
3. WHEN pengunjung membuka halaman Kesiswaan, THE Website SHALL menampilkan berita atau artikel terkait kegiatan kesiswaan
4. WHEN pengunjung membuka halaman Kesiswaan, THE Website SHALL menampilkan galeri foto kegiatan siswa

---

### Requirement 7: Halaman Humas (Hubungan Masyarakat)

**User Story:** Sebagai pengunjung atau mitra industri, saya ingin mengetahui kemitraan dan jaringan industri sekolah, sehingga saya dapat memahami peluang kerja sama dan penempatan lulusan.

#### Acceptance Criteria

1. WHEN pengunjung membuka halaman Humas, THE Website SHALL menampilkan daftar mitra industri yang bekerja sama dengan sekolah
2. WHEN pengunjung membuka halaman Humas, THE Website SHALL menampilkan informasi MOU (Memorandum of Understanding) kerja sama yang telah ditandatangani
3. WHEN pengunjung membuka halaman Humas, THE Website SHALL menampilkan daftar tempat PKL (Praktik Kerja Lapangan) yang tersedia
4. WHEN pengunjung membuka halaman Humas, THE Website SHALL menampilkan informasi alumni yang telah bekerja di industri

---

### Requirement 8: Halaman PPDB (Penerimaan Peserta Didik Baru)

**User Story:** Sebagai calon siswa atau orang tua, saya ingin mendaftar dan mendapatkan informasi PPDB secara online, sehingga saya dapat melakukan pendaftaran dengan mudah tanpa harus datang langsung ke sekolah.

#### Acceptance Criteria

1. WHEN pengunjung membuka halaman PPDB, THE Website SHALL menampilkan informasi PPDB yang mencakup jadwal pendaftaran, kuota, dan biaya pendaftaran
2. WHEN pengunjung membuka halaman PPDB, THE Website SHALL menampilkan alur pendaftaran langkah demi langkah secara visual (step-by-step)
3. WHEN pengunjung membuka halaman PPDB, THE Website SHALL menampilkan daftar persyaratan dokumen yang harus disiapkan calon siswa
4. WHEN pengunjung mengisi dan mengirimkan formulir pendaftaran PPDB, THE Website SHALL menyimpan data pendaftaran dan menampilkan konfirmasi bahwa pendaftaran berhasil diterima
5. IF pengunjung mengisi formulir PPDB dengan data yang tidak lengkap atau tidak valid, THEN THE Website SHALL menampilkan pesan kesalahan yang spesifik pada field yang bermasalah tanpa menghapus data yang sudah diisi dengan benar
6. WHEN formulir PPDB berhasil dikirim, THE Website SHALL mengirimkan notifikasi konfirmasi ke alamat email yang didaftarkan

---

### Requirement 9: Identitas Islam NU

**User Story:** Sebagai pengunjung, saya ingin melihat identitas Islam NU yang kuat pada website, sehingga saya dapat mengenali bahwa sekolah ini berafiliasi dengan LP Ma'arif NU dan memiliki nilai-nilai keislaman.

#### Acceptance Criteria

1. THE Website SHALL menampilkan smk maarif nu 01 karangkobar konsisten di header atau footer setiap halaman
2. THE Website SHALL menggunakan elemen visual (warna, motif, atau ikon) yang mencerminkan identitas LP Ma'arif NU pada desain keseluruhan website
3. WHEN pengunjung melihat halaman mana pun, THE Website SHALL menampilkan tagline atau slogan yang mencerminkan nilai-nilai Islam NU sekolah

---

### Requirement 10: Responsivitas dan Aksesibilitas

**User Story:** Sebagai pengunjung yang mengakses dari perangkat mobile, saya ingin website dapat diakses dengan nyaman dari smartphone, sehingga saya tidak perlu menggunakan komputer untuk mendapatkan informasi sekolah.

#### Acceptance Criteria

1. THE Website SHALL menampilkan layout yang responsif dan dapat digunakan dengan baik pada layar dengan lebar minimal 320px (smartphone) hingga 1920px (desktop)
2. WHEN pengunjung mengakses website dari perangkat mobile, THE Website SHALL menampilkan menu navigasi dalam bentuk hamburger menu atau drawer yang mudah digunakan
3. THE Website SHALL memuat halaman utama dalam waktu tidak lebih dari 3 detik pada koneksi internet standar (4G)
4. THE Website SHALL menggunakan ukuran teks minimal 16px untuk konten utama agar mudah dibaca di semua perangkat
5. WHEN pengunjung menggunakan screen reader, THE Website SHALL menyediakan atribut alt pada semua gambar dan label yang dapat dibaca oleh teknologi assistif

---

### Requirement 11: Navigasi dan Struktur Informasi

**User Story:** Sebagai pengunjung, saya ingin dapat menemukan informasi yang saya cari dengan mudah, sehingga saya tidak perlu menghabiskan waktu lama untuk menjelajahi website.

#### Acceptance Criteria

1. THE Website SHALL menyediakan menu navigasi utama yang mencakup semua halaman utama: Beranda, Profil, Program Keahlian, Kurikulum, Sarana & Prasarana, Kesiswaan, Humas, dan PPDB
2. WHEN pengunjung berada di halaman mana pun, THE Website SHALL menampilkan breadcrumb atau indikator posisi halaman saat ini
3. THE Website SHALL menyediakan fitur pencarian konten yang dapat diakses dari semua halaman
4. WHEN pengunjung mengklik tautan yang mengarah ke halaman yang tidak ditemukan, THE Website SHALL menampilkan halaman 404 yang informatif dengan tautan kembali ke beranda
