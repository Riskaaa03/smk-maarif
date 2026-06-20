import fs from 'fs'
import path from 'path'

// @ts-ignore
const Database = require('better-sqlite3')

// Pastikan folder database ada
const dbDir = path.join(process.cwd(), 'database')
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new Database(path.join(dbDir, 'galeri.db'))

// ============================================================
// TABEL GALERI
// ============================================================
db.exec(`
  CREATE TABLE IF NOT EXISTS galeri (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    kategori TEXT DEFAULT 'kegiatan',
    imageUrl TEXT NOT NULL,
    date TEXT DEFAULT (date('now')),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// ============================================================
// TABEL MITRA INDUSTRI
// ============================================================
db.exec(`
  CREATE TABLE IF NOT EXISTS mitra_industri (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    deskripsi TEXT,
    deskripsiPanjang TEXT,
    logoUrl TEXT,
    fotoKerjasama TEXT,
    website TEXT,
    kota TEXT DEFAULT '',
    status TEXT DEFAULT 'mou',
    urutan INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// ============================================================
// TABEL PRESTASI
// ============================================================
db.exec(`
  CREATE TABLE IF NOT EXISTS prestasi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    program_slug TEXT NOT NULL,
    nama_kejuaraan TEXT NOT NULL,
    tingkat TEXT NOT NULL,
    tahun INTEGER NOT NULL,
    keterangan TEXT,
    peringkat TEXT,
    penyelenggara TEXT,
    foto_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// ============================================================
// TABEL BERITA
// ============================================================
db.exec(`
  CREATE TABLE IF NOT EXISTS berita (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    judul TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    ringkasan TEXT,
    konten TEXT,
    kategori TEXT DEFAULT 'berita',
    thumbnail_url TEXT,
    penulis TEXT DEFAULT 'Admin',
    status TEXT DEFAULT 'draft',
    views INTEGER DEFAULT 0,
    tanggal_publikasi DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// ============================================================
// TABEL PPDB
// ============================================================
db.exec(`
  CREATE TABLE IF NOT EXISTS ppdb (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nomor_pendaftaran TEXT UNIQUE NOT NULL,
    nama_siswa TEXT NOT NULL,
    jurusan TEXT NOT NULL,
    nik TEXT NOT NULL,
    nisn TEXT NOT NULL,
    tempat_lahir TEXT NOT NULL,
    tanggal_lahir TEXT NOT NULL,
    asal_sekolah TEXT NOT NULL,
    alamat_siswa TEXT NOT NULL,
    nomor_wa TEXT NOT NULL,
    email TEXT NOT NULL,
    jenis_kelamin TEXT NOT NULL,
    agama TEXT NOT NULL,
    memiliki_kip TEXT DEFAULT 'TIDAK',
    nama_kip TEXT,
    nomor_kip TEXT,
    direkomendasikan_oleh TEXT,
    nama_orang_tua TEXT NOT NULL,
    pekerjaan_orang_tua TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// ============================================================
// TABEL PKL (TEMPAT PRAKTIK KERJA LAPANGAN)
// ============================================================
db.exec(`
  CREATE TABLE IF NOT EXISTS pkl (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_perusahaan TEXT NOT NULL,
    bidang TEXT NOT NULL,
    kota TEXT NOT NULL,
    alamat TEXT,
    kontak TEXT,
    kuota INTEGER DEFAULT 0,
    status TEXT DEFAULT 'aktif',
    urutan INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// ============================================================
// TABEL ALUMNI
// ============================================================
db.exec(`
  CREATE TABLE IF NOT EXISTS alumni (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    angkatan INTEGER NOT NULL,
    program_keahlian TEXT NOT NULL,
    tempat_kerja TEXT,
    posisi TEXT,
    foto_url TEXT,
    testimonial TEXT,
    status TEXT DEFAULT 'aktif',
    urutan INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// ============================================================
// TABEL SARANA & PRASARANA
// ============================================================

// 1. Fasilitas Utama
db.exec(`
  CREATE TABLE IF NOT EXISTS fasilitas_utama (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    emoji TEXT DEFAULT '🏫',
    deskripsi TEXT NOT NULL,
    thumbnail TEXT,
    urutan INTEGER DEFAULT 0,
    status TEXT DEFAULT 'aktif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// 2. Sarana Pendukung
db.exec(`
  CREATE TABLE IF NOT EXISTS sarana_pendukung (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    emoji TEXT DEFAULT '🔧',
    deskripsi TEXT NOT NULL,
    thumbnail TEXT,
    urutan INTEGER DEFAULT 0,
    status TEXT DEFAULT 'aktif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// 3. Statistik Fasilitas
db.exec(`
  CREATE TABLE IF NOT EXISTS statistik_fasilitas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    angka TEXT NOT NULL,
    satuan TEXT NOT NULL,
    emoji TEXT DEFAULT '📊',
    urutan INTEGER DEFAULT 0,
    status TEXT DEFAULT 'aktif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

console.log('✅ Database siap digunakan')

export default db
