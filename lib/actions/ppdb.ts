'use server' // 👈 Wajib ada di baris pertama agar Next.js tahu ini dieksekusi di server

import db from '@/lib/db'
import { ppdbSchema, type PPDBFormData } from '@/lib/validations/ppdb'

// Interface untuk response balik ke client component
export interface PPDBSubmitResponse {
  success: boolean
  message?: string
  nomorPendaftaran?: string
  errors?: Array<{ field: string; message: string }>
}

// Fungsi pembantu untuk generate nomor pendaftaran otomatis secara acak/sequential
async function generateNomorPendaftaran(): Promise<string> {
  const tahun = new Date().getFullYear()
  const randomDigits = Math.floor(1000 + Math.random() * 9000) // 4 digit acak
  return `PPDB-${tahun}-${randomDigits}`
}

export async function submitPPDB(formData: PPDBFormData): Promise<PPDBSubmitResponse> {
  // 1. Validasi ulang data di sisi server menggunakan ppdbSchema yang benar
  const parsed = ppdbSchema.safeParse(formData)

  if (!parsed.success) {
    return {
      success: false,
      message: 'Validasi data gagal di server.',
      errors: parsed.error.errors.map((err) => ({
        field: err.path[0] as string,
        message: err.message,
      })),
    }
  }

  try {
    const dataSiswa = parsed.data
    const nomorPendaftaran = await generateNomorPendaftaran()

    // 2. Insert data langsung ke SQLite menggunakan sintaks better-sqlite3 native
    const stmt = db.prepare(`
      INSERT INTO ppdb (
        nomor_pendaftaran, nama_siswa, jurusan, nik, nisn, 
        tempat_lahir, tanggal_lahir, asal_sekolah, alamat_siswa, 
        nomor_wa, email, jenis_kelamin, agama, memiliki_kip, 
        nama_kip, nomor_kip, direkomendasikan_oleh, nama_orang_tua, 
        pekerjaan_orang_tua, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      nomorPendaftaran,
      dataSiswa.namaLengkap,
      dataSiswa.programKeahlianPilihan1, // mapping ke kolom 'jurusan'
      dataSiswa.nik,
      dataSiswa.nisn,
      dataSiswa.tempatLahir,
      dataSiswa.tanggalLahir,
      dataSiswa.asalSekolah,
      dataSiswa.alamat,                 // mapping ke kolom 'alamat_siswa'
      dataSiswa.nomorHP,                // mapping ke kolom 'nomor_wa'
      dataSiswa.email || '',
      dataSiswa.jenisKelamin,
      dataSiswa.agama,
      dataSiswa.memilikiKip,
      dataSiswa.namaKip || null,
      dataSiswa.nomorKip || null,
      dataSiswa.direkomendasikanOleh || null,
      dataSiswa.namaOrangTua,
      dataSiswa.pekerjaanOrangTua,
      'pending'                         // status default awal
    )

    return {
      success: true,
      nomorPendaftaran,
    }
  } catch (error: any) {
    console.error('❌ PPDB_SUBMIT_SERVER_ERROR:', error)
    
    // Deteksi jika NIK atau NISN duplikat di database
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return {
        success: false,
        message: 'Nomor NIK, NISN, atau Nomor Pendaftaran tersebut sudah terdaftar di sistem.',
      }
    }

    return {
      success: false,
      message: 'Gagal menyimpan data ke database server. Silakan coba lagi nanti.',
    }
  }
}
