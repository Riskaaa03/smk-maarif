import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db.cjs'

// GET: Ambil semua data tempat PKL
export async function GET() {
  try {
    const items = db.prepare(`
      SELECT * FROM pkl
      ORDER BY urutan ASC, created_at DESC
    `).all()
    
    return NextResponse.json({ success: true, items })
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data' },
      { status: 500 }
    )
  }
}

// POST: Tambah tempat PKL baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nama_perusahaan, bidang, kota, alamat, kontak, kuota, status, urutan } = body

    if (!nama_perusahaan || !bidang || !kota) {
      return NextResponse.json(
        { success: false, error: 'Nama perusahaan, bidang, dan kota wajib diisi' },
        { status: 400 }
      )
    }

    const stmt = db.prepare(`
      INSERT INTO pkl (nama_perusahaan, bidang, kota, alamat, kontak, kuota, status, urutan) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      nama_perusahaan, 
      bidang, 
      kota, 
      alamat || '', 
      kontak || '', 
      kuota || 0, 
      status || 'aktif', 
      urutan || 0
    )

    return NextResponse.json({ 
      success: true, 
      id: result.lastInsertRowid 
    })
  } catch (error) {
    console.error('POST Error:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menambah data' },
      { status: 500 }
    )
  }
}

// PUT: Update tempat PKL
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, nama_perusahaan, bidang, kota, alamat, kontak, kuota, status, urutan } = body

    if (!id || !nama_perusahaan || !bidang || !kota) {
      return NextResponse.json(
        { success: false, error: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    const stmt = db.prepare(`
      UPDATE pkl 
      SET nama_perusahaan = ?, bidang = ?, kota = ?, alamat = ?, 
          kontak = ?, kuota = ?, status = ?, urutan = ?
      WHERE id = ?
    `)

    stmt.run(nama_perusahaan, bidang, kota, alamat, kontak, kuota, status, urutan, id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PUT Error:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengupdate data' },
      { status: 500 }
    )
  }
}

// DELETE: Hapus tempat PKL
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
    
    db.prepare('DELETE FROM pkl WHERE id = ?').run(id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE Error:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus data' },
      { status: 500 }
    )
  }
}
