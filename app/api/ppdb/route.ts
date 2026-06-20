import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db.cjs'

// GET: Ambil data pendaftaran (untuk admin panel)
export async function GET() {
  try {
    const items = db.prepare(`
      SELECT * FROM ppdb 
      ORDER BY created_at DESC
    `).all()
    
    return NextResponse.json({ success: true, items })
  } catch (error: any) {
    console.error('Error GET:', error.message)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data' },
      { status: 500 }
    )
  }
}

// POST: Simpan data pendaftaran PPDB
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      namaSiswa,
      nik,
      nisn,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      asalSekolah,
      jurusan,
      nomorWA,
      email,
      alamatSiswa,
      agama,
      namaOrangTua,
      pekerjaanOrangTua,
      memilikiKIP,
      namaKIP,
      nomorKIP,
      direkomendasikanOleh,
    } = body

    // Validasi data wajib
    if (!namaSiswa || !asalSekolah || !jurusan || !nomorWA || !email) {
      return NextResponse.json(
        { success: false, error: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    const nomorPendaftaran = `PPDB-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    const stmt = db.prepare(`
      INSERT INTO ppdb (
        nomor_pendaftaran, nama_siswa, nik, nisn, tempat_lahir, tanggal_lahir,
        jenis_kelamin, asal_sekolah, jurusan, nomor_wa, email, alamat_siswa,
        agama, nama_orang_tua, pekerjaan_orang_tua,
        memiliki_kip, nama_kip, nomor_kip, direkomendasikan_oleh, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      nomorPendaftaran, 
      namaSiswa, 
      nik || null,
      nisn || null,
      tempatLahir || null,
      tanggalLahir || null,
      jenisKelamin || null,
      asalSekolah,
      jurusan,
      nomorWA,
      email,
      alamatSiswa || null,
      agama || 'Islam',
      namaOrangTua || null,
      pekerjaanOrangTua || null,
      memilikiKIP || 'TIDAK',
      namaKIP || null,
      nomorKIP || null,
      direkomendasikanOleh || null,
      'pending'
    )

    console.log('✅ Data saved, ID:', stmt.lastInsertRowid)

    return NextResponse.json({
      success: true,
      nomorPendaftaran,
    })
  } catch (error: any) {
    console.error('❌ Error saving PPDB:', error.message)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server: ' + error.message },
      { status: 500 }
    )
  }
}

// PUT: Update status pendaftaran
export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json()
    
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'ID dan status wajib diisi' },
        { status: 400 }
      )
    }
    
    const stmt = db.prepare(`UPDATE ppdb SET status = ? WHERE id = ?`)
    stmt.run(status, id)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error PUT:', error.message)
    return NextResponse.json(
      { success: false, error: 'Gagal mengupdate status' },
      { status: 500 }
    )
  }
}

// DELETE: Hapus pendaftaran
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID tidak ditemukan' },
        { status: 400 }
      )
    }
    
    db.prepare('DELETE FROM ppdb WHERE id = ?').run(id)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error DELETE:', error.message)
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus data' },
      { status: 500 }
    )
  }
}