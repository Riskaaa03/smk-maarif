const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

// Koneksi ke database
const dbDir = path.join(process.cwd(), 'database')
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new Database(path.join(dbDir, 'galeri.db'))

// ============================================================
// DATA FASILITAS UTAMA dengan link gambar
// ============================================================
const fasilitasData = [
  {
    nama: 'Ruang Kelas',
    emoji: '🏫',
    deskripsi: 'Ruang kelas yang nyaman dan kondusif untuk mendukung proses belajar mengajar. Setiap ruang dilengkapi dengan fasilitas modern untuk memaksimalkan pengalaman belajar siswa.',
    thumbnail: '/uploads/sarpras/ruang-kelas.jpg',
    urutan: 1,
    status: 'aktif'
  },
  {
    nama: 'Laboratorium Komputer',
    emoji: '💻',
    deskripsi: 'Laboratorium komputer berstandar industri yang mendukung pembelajaran program keahlian TJKT dan AKL. Dilengkapi dengan perangkat keras terkini dan koneksi internet berkecepatan tinggi.',
    thumbnail: '/uploads/sarpras/lab-komputer.jpg',
    urutan: 2,
    status: 'aktif'
  },
  {
    nama: 'Perpustakaan',
    emoji: '📚',
    deskripsi: 'Perpustakaan sekolah yang lengkap dengan koleksi buku pelajaran, buku referensi, dan bahan bacaan umum. Tersedia ruang baca yang nyaman dan akses ke sumber digital.',
    thumbnail: '/uploads/sarpras/perpustakaan.jpg',
    urutan: 3,
    status: 'aktif'
  },
  {
    nama: 'Sarana Olahraga',
    emoji: '⚽',
    deskripsi: 'Fasilitas olahraga yang memadai untuk mendukung kegiatan PJOK dan ekstrakurikuler. Tersedia berbagai lapangan dan peralatan olahraga untuk mengembangkan bakat dan kebugaran siswa.',
    thumbnail: '/uploads/sarpras/sarana-olahraga.jpg',
    urutan: 4,
    status: 'aktif'
  }
]

// ============================================================
// DATA SARANA PENDUKUNG
// ============================================================
const saranaData = [
  {
    nama: 'Mushola',
    emoji: '🕌',
    deskripsi: 'Mushola yang bersih dan nyaman untuk kegiatan ibadah siswa, guru, dan karyawan. Dilengkapi dengan tempat wudhu yang memadai dan perlengkapan shalat.',
    thumbnail: null,
    urutan: 1,
    status: 'aktif'
  },
  {
    nama: 'Kantin Sekolah',
    emoji: '🍽️',
    deskripsi: 'Kantin sekolah yang menyediakan makanan dan minuman sehat dengan harga terjangkau. Dikelola secara higienis untuk menjaga kesehatan seluruh warga sekolah.',
    thumbnail: null,
    urutan: 2,
    status: 'aktif'
  },
  {
    nama: 'UKS (Unit Kesehatan Sekolah)',
    emoji: '🏥',
    deskripsi: 'UKS yang dilengkapi dengan peralatan P3K, tempat istirahat, dan obat-obatan dasar. Ditangani oleh tenaga kesehatan terlatih untuk memberikan pertolongan pertama.',
    thumbnail: null,
    urutan: 3,
    status: 'aktif'
  },
  {
    nama: 'Toilet',
    emoji: '🚻',
    deskripsi: 'Toilet yang bersih dan terpisah antara putra dan putri. Tersedia di beberapa titik strategis di lingkungan sekolah untuk kenyamanan seluruh warga sekolah.',
    thumbnail: null,
    urutan: 4,
    status: 'aktif'
  },
  {
    nama: 'Area Parkir',
    emoji: '🅿️',
    deskripsi: 'Area parkir yang luas dan aman untuk kendaraan siswa, guru, dan tamu. Dilengkapi dengan sistem keamanan untuk menjaga keamanan kendaraan.',
    thumbnail: null,
    urutan: 5,
    status: 'aktif'
  },
  {
    nama: 'Ruang Guru & Tata Usaha',
    emoji: '🏢',
    deskripsi: 'Ruang guru yang representatif dan ruang tata usaha yang lengkap untuk mendukung administrasi sekolah. Dilengkapi dengan peralatan kantor modern.',
    thumbnail: null,
    urutan: 6,
    status: 'aktif'
  },
  {
    nama: 'Bengkel Praktik TBSM',
    emoji: '🔧',
    deskripsi: 'Bengkel praktik khusus program TBSM yang dilengkapi dengan peralatan servis sepeda motor standar industri. Mendukung pembelajaran teknis yang komprehensif.',
    thumbnail: null,
    urutan: 7,
    status: 'aktif'
  },
  {
    nama: 'Aula / Ruang Pertemuan',
    emoji: '🎭',
    deskripsi: 'Aula serbaguna yang digunakan untuk kegiatan upacara, seminar, pertemuan orang tua, dan berbagai acara sekolah lainnya.',
    thumbnail: null,
    urutan: 8,
    status: 'aktif'
  }
]

// ============================================================
// DATA STATISTIK FASILITAS
// ============================================================
const statistikData = [
  {
    angka: '12',
    satuan: 'Ruang Kelas',
    emoji: '🏫',
    urutan: 1,
    status: 'aktif'
  },
  {
    angka: '40',
    satuan: 'Unit Komputer',
    emoji: '💻',
    urutan: 2,
    status: 'aktif'
  },
  {
    angka: '3.500+',
    satuan: 'Koleksi Buku',
    emoji: '📚',
    urutan: 3,
    status: 'aktif'
  },
  {
    angka: '4',
    satuan: 'Lapangan Olahraga',
    emoji: '⚽',
    urutan: 4,
    status: 'aktif'
  }
]

// ============================================================
// FUNGSI INSERT DATA
// ============================================================

function insertFasilitas() {
  console.log('📝 Memasukkan data Fasilitas Utama...')
  
  // Hapus data lama
  db.exec('DELETE FROM fasilitas_utama')
  
  const stmt = db.prepare(`
    INSERT INTO fasilitas_utama (nama, emoji, deskripsi, thumbnail, urutan, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  
  for (const item of fasilitasData) {
    stmt.run(item.nama, item.emoji, item.deskripsi, item.thumbnail, item.urutan, item.status)
    console.log(`   ✅ ${item.nama} - ${item.thumbnail || 'tanpa gambar'}`)
  }
  
  console.log(`✅ ${fasilitasData.length} data Fasilitas Utama berhasil dimasukkan`)
}

function insertSarana() {
  console.log('📝 Memasukkan data Sarana Pendukung...')
  
  // Hapus data lama
  db.exec('DELETE FROM sarana_pendukung')
  
  const stmt = db.prepare(`
    INSERT INTO sarana_pendukung (nama, emoji, deskripsi, thumbnail, urutan, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  
  for (const item of saranaData) {
    stmt.run(item.nama, item.emoji, item.deskripsi, item.thumbnail, item.urutan, item.status)
    console.log(`   ✅ ${item.nama}`)
  }
  
  console.log(`✅ ${saranaData.length} data Sarana Pendukung berhasil dimasukkan`)
}

function insertStatistik() {
  console.log('📝 Memasukkan data Statistik Fasilitas...')
  
  // Hapus data lama
  db.exec('DELETE FROM statistik_fasilitas')
  
  const stmt = db.prepare(`
    INSERT INTO statistik_fasilitas (angka, satuan, emoji, urutan, status)
    VALUES (?, ?, ?, ?, ?)
  `)
  
  for (const item of statistikData) {
    stmt.run(item.angka, item.satuan, item.emoji, item.urutan, item.status)
    console.log(`   ✅ ${item.angka} ${item.satuan}`)
  }
  
  console.log(`✅ ${statistikData.length} data Statistik Fasilitas berhasil dimasukkan`)
}

// ============================================================
// CEK TABEL
// ============================================================
function checkTables() {
  console.log('📋 Mengecek tabel...')
  
  try {
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
    console.log('   Tabel yang tersedia:', tables.map(t => t.name).join(', '))
  } catch (error) {
    console.log('   ⚠️ Gagal mengecek tabel:', error.message)
  }
}

// ============================================================
// EKSEKUSI
// ============================================================

try {
  console.log('')
  console.log('🚀 Mulai memasukkan data Sarana & Prasarana...')
  console.log('===============================================')
  console.log('')
  
  checkTables()
  console.log('')
  
  insertFasilitas()
  console.log('')
  
  insertSarana()
  console.log('')
  
  insertStatistik()
  console.log('')
  
  console.log('===============================================')
  console.log('✅ SEMUA DATA BERHASIL DIMASUKKAN!')
  console.log(`   - Fasilitas Utama: ${fasilitasData.length} data`)
  console.log(`   - Sarana Pendukung: ${saranaData.length} data`)
  console.log(`   - Statistik Fasilitas: ${statistikData.length} data`)
  console.log('')
  console.log('📌 Buka halaman: http://localhost:3000/sarana-prasarana')
  console.log('📌 Buka admin: http://localhost:3000/admin/sarpras')
  
} catch (error) {
  console.error('❌ Error:', error.message)
  console.error(error.stack)
} finally {
  db.close()
}