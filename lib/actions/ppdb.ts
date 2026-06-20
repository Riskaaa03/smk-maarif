'use server' // Wajib di baris pertama untuk Server Action

import db from '@/lib/db'
import { ppdbSchema, type PPDBFormData } from '@/lib/validations/ppdb'

export interface PPDBSubmitResponse {
  success: boolean
  message?: string
  nomorPendaftaran?: string
  errors?: Array<{ field: string; message: string }>
}

async function generateNomorPendaftaran(): Promise<string> {
  const tahun = new Date().getFullYear()
  const randomDigits = Math.floor(1000 + Math.random() * 9000)
  return `PPDB-${tahun}-${randomDigits}`
}

export async function submitPPDB(formData: PPDBFormData): Promise<PPDBSubmitResponse> {
  // 1. Validasi ulang data di sisi server
  const parsed = ppdbSchema.safeParse(formData)

  // JIKA GAGAL: Menggunakan parsed.error.issues (Syntax Zod yang benar)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Validasi data gagal di server.',
      errors: parsed.error.issues.map((issue) => ({
        field: issue.path[0] as string,
        message: issue.message,
      })),
    }
  }

  try {
    const dataSiswa = parsed.data
    const nomorPendaftaran = await generateNomorPendaftaran()

    // 2. Simpan ke database SQLite
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
      dataSiswa.programKeahlianPilihan1,
      dataSiswa.nik,
      dataSiswa.nisn,
      dataSiswa.tempatLahir,
      dataSiswa.tanggalLahir,
      dataSiswa.asalSekolah,
      dataSiswa.alamat,
      dataSiswa.nomorHP,
      dataSiswa.email || '',
      dataSiswa.jenisKelamin,
      dataSiswa.agama,
      dataSiswa.memilikiKip,
      dataSiswa.namaKip || null,
      dataSiswa.nomorKip || null,
      dataSiswa.direkomendasikanOleh || null,
      dataSiswa.namaOrangTua,
      dataSiswa.pekerjaanOrangTua,
      'pending'
    )

    return {
      success: true,
      nomorPendaftaran,
    }
  } catch (error: any) {
    console.error('❌ PPDB_SUBMIT_SERVER_ERROR:', error)
    
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return {
        success: false,
        message: 'Nomor NIK, NISN, atau Nomor Pendaftaran tersebut sudah terdaftar.',
      }
    }

    return {
      success: false,
      message: 'Gagal menyimpan data ke server. Silakan coba lagi nanti.',
    }
  }
}
