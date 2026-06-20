/**
 * TypeScript interfaces untuk semua model data
 * SMK Ma'arif NU 01 Karangkobar
 */

// ============================================================
// Model: RegistrasiPPDB
// Requirements: 8.4
// ============================================================
export interface RegistrasiPPDB {
  id: string // UUID, generated
  nomorPendaftaran: string // Format: PPDB-YYYY-XXXXX, generated

  // Data Calon Siswa
  namaLengkap: string // min 3, max 100 karakter
  nik: string // 16 digit angka
  tempatLahir: string // min 2, max 50 karakter
  tanggalLahir: Date // max: hari ini - 12 tahun
  jenisKelamin: 'L' | 'P'
  agama: string // Islam, dll.
  alamat: string // min 10, max 255 karakter

  // Asal Sekolah
  asalSekolah: string // nama SMP/MTs asal
  nisn: string // 10 digit angka
  tahunLulus: number // 4 digit tahun

  // Pilihan Program
  programKeahlianPilihan1: 'TBSM' | 'TJKT' | 'AKL'
  programKeahlianPilihan2: 'TBSM' | 'TJKT' | 'AKL' | null

  // Data Orang Tua/Wali
  namaOrangTua: string // min 3, max 100 karakter
  pekerjaanOrangTua: string
  nomorHP: string // format: 08xx atau +628xx
  email: string // valid email format

  // Metadata
  status: 'pending' | 'verified' | 'accepted' | 'rejected'
  tanggalDaftar: Date // auto: created_at
  updatedAt: Date // auto: updated_at
}

// ============================================================
// Model: Berita
// Requirements: 1.7, 6.3
// ============================================================
export interface Berita {
  id: string
  slug: string // URL-friendly, unique
  judul: string
  ringkasan: string // max 300 karakter
  konten: string // rich text / MDX
  thumbnail: string // URL gambar
  kategori: 'berita' | 'pengumuman' | 'prestasi' | 'kegiatan'
  penulis: string
  tanggalPublikasi: Date
  diterbitkan: boolean
  createdAt: Date
  updatedAt: Date
}

// ============================================================
// Model: GaleriItem
// Requirements: 1.4, 5.1, 5.2, 5.3, 5.4, 6.4
// ============================================================
export interface GaleriItem {
  id: string
  judul: string
  deskripsi: string | null
  urlMedia: string // URL foto atau video
  tipeMedia: 'foto' | 'video'
  kategori: string // kegiatan, prestasi, fasilitas, dll.
  tanggal: Date
  urutan: number // untuk sorting manual
  createdAt: Date
}

// ============================================================
// Model: PrestasiItem
// Requirements: 3.4, 6.2
// ============================================================
export interface PrestasiItem {
  id: string
  namaKejuaraan: string
  tingkat: 'kabupaten' | 'provinsi' | 'nasional' | 'internasional'
  tahun: number
  keterangan: string | null
  peringkat?:string | null
  penyelenggara?: string | null
  foto?: string | null 
  createdAt: Date
  updatedAt: Date
}

// ============================================================
// Model: ProgramKeahlian
// Requirements: 3.1, 3.2, 3.3, 3.4
// ============================================================
export interface ProgramKeahlian {
  id: string
  kode: 'TBSM' | 'TJKT' | 'AKL'
  namaLengkap: string
  deskripsiSingkat: string // max 200 karakter
  deskripsiLengkap: string // rich text
  tujuan: string // rich text
  kompetensi: string[] // daftar kompetensi
  prospekKerja: string[] // daftar prospek karir
  prestasi: PrestasiItem[]
  foto: string // URL foto utama program
  updatedAt: Date
}

// ============================================================
// Model: MitraIndustri
// Requirements: 1.5, 7.1, 7.2, 7.3
// ============================================================
export interface MitraIndustri {
  id: string
  namaMitra: string
  logoUrl: string | null
  bidangUsaha: string
  kotaDomisili: string
  hasMOU: boolean
  tanggalMOU: Date | null
  tempatPKL: boolean
  urutan: number
}

// ============================================================
// Model: Ekstrakurikuler
// Requirements: 1.6, 6.1
// ============================================================
export interface Ekstrakurikuler {
  id: string
  nama: string
  deskripsi: string
  foto: string | null
  pembina: string | null
  aktif: boolean
  urutan: number
}

// ============================================================
// Model: Alumni
// Requirements: 7.4
// ============================================================
export interface Alumni {
  id: string
  nama: string
  angkatan: number
  programKeahlian: 'TBSM' | 'TJKT' | 'AKL'
  tempatKerja: string
  posisi: string | null
  foto: string | null
  testimonial: string | null
}

// ============================================================
// Model: InfoPPDB
// Requirements: 8.1, 8.2, 8.3
// ============================================================
export interface InfoPPDB {
  tahunAjaran: string
  tanggalBuka: Date
  tanggalTutup: Date
  kuotaTBSM: number
  kuotaTJKT: number
  kuotaAKL: number
  biayaPendaftaran: number
  persyaratan: string[] // daftar dokumen yang diperlukan
  alurPendaftaran: LangkahPendaftaran[]
  catatan: string | null
}

export interface LangkahPendaftaran {
  urutan: number
  judul: string
  deskripsi: string
  ikon: string | null
}

// ============================================================
// Model: Fasilitas (Sarana & Prasarana)
// Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
// ============================================================
export interface Fasilitas {
  id: string
  nama: string
  deskripsi: string
  foto: string[]
  kategori: 'ruang_kelas' | 'laboratorium' | 'perpustakaan' | 'olahraga' | 'lainnya'
  kapasitas: number | null
  kondisi: 'baik' | 'cukup' | 'perlu_perbaikan'
}

// ============================================================
// Model: StrukturOrganisasi
// Requirements: 2.3
// ============================================================
export interface AnggotaOrganisasi {
  id: string
  nama: string
  jabatan: string
  foto: string | null
  urutan: number
  level: number // untuk hierarki diagram
  parentId: string | null
}

// ============================================================
// Tipe navigasi
// ============================================================
export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export interface BreadcrumbItem {
  label: string
  href: string
}

// ============================================================
// Tipe respons API
// ============================================================
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
}

export interface PPDBSubmitResponse {
  success: boolean
  nomorPendaftaran?: string
  errors?: Record<string, string[]>
}
