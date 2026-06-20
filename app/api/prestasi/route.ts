import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import db from '@/lib/db.cjs'

// Konstanta ukuran maksimal 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// GET: Ambil data prestasi (bisa filter by program_slug)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const programSlug = searchParams.get('program_slug')
    const id = searchParams.get('id')
    
    // Jika ada ID, ambil data spesifik
    if (id) {
      const item = db.prepare('SELECT * FROM prestasi WHERE id = ?').get(id)
      if (!item) {
        return NextResponse.json(
          { success: false, error: 'Prestasi tidak ditemukan' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true, data: item })
    }
    
    // Jika ada program_slug, filter berdasarkan program
    if (programSlug) {
      const items = db.prepare(`
        SELECT * FROM prestasi 
        WHERE program_slug = ? 
        ORDER BY tahun DESC, created_at DESC
      `).all(programSlug)
      return NextResponse.json({ success: true, items })
    }
    
    // Ambil semua prestasi
    const items = db.prepare(`
      SELECT * FROM prestasi 
      ORDER BY tahun DESC, created_at DESC
    `).all()
    
    return NextResponse.json({ success: true, items })
  } catch (error) {
    console.error('Error GET:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data' },
      { status: 500 }
    )
  }
}

// POST: Tambah prestasi baru
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const program_slug = formData.get('program_slug') as string
    const nama_kejuaraan = formData.get('nama_kejuaraan') as string
    const tingkat = formData.get('tingkat') as string
    const tahun = parseInt(formData.get('tahun') as string)
    const keterangan = formData.get('keterangan') as string || ''
    const peringkat = formData.get('peringkat') as string || ''
    const penyelenggara = formData.get('penyelenggara') as string || ''
    const file = formData.get('file') as File

    if (!program_slug || !nama_kejuaraan || !tingkat || !tahun) {
      return NextResponse.json(
        { success: false, error: 'Program, nama kejuaraan, tingkat, dan tahun wajib diisi' },
        { status: 400 }
      )
    }

    let fotoUrl = null

    // Upload foto jika ada
    if (file && file.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Hanya file JPG, PNG, WEBP yang diperbolehkan' },
          { status: 400 }
        )
      }

      // Validasi ukuran file - 5MB
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: `Ukuran file ${(file.size / 1024 / 1024).toFixed(2)}MB melebihi batas maksimal 5MB` },
          { status: 400 }
        )
      }

      const timestamp = Date.now()
      const originalName = file.name
      const extension = originalName.split('.').pop()
      const filename = `prestasi-${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
      
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'prestasi')
      await mkdir(uploadDir, { recursive: true })
      
      const buffer = Buffer.from(await file.arrayBuffer())
      const filePath = path.join(uploadDir, filename)
      await writeFile(filePath, buffer)

      fotoUrl = `/images/prestasi/${filename}`
    }

    // Simpan ke database
    const stmt = db.prepare(`
      INSERT INTO prestasi (program_slug, nama_kejuaraan, tingkat, tahun, keterangan, peringkat, penyelenggara, foto_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(program_slug, nama_kejuaraan, tingkat, tahun, keterangan, peringkat, penyelenggara, fotoUrl)

    return NextResponse.json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        program_slug,
        nama_kejuaraan,
        tingkat,
        tahun,
        keterangan,
        peringkat,
        penyelenggara,
        foto_url: fotoUrl,
      },
      message: 'Prestasi berhasil ditambahkan'
    })
  } catch (error) {
    console.error('Error POST:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menambah prestasi: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

// DELETE: Hapus prestasi
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

    // Ambil data foto dari database
    const item = db.prepare('SELECT foto_url FROM prestasi WHERE id = ?').get(id) as any
    
    if (item && item.foto_url) {
      const filePath = path.join(process.cwd(), 'public', item.foto_url)
      try {
        await unlink(filePath)
      } catch (err) {
        console.log('File tidak ditemukan, lanjut hapus database')
      }
    }

    db.prepare('DELETE FROM prestasi WHERE id = ?').run(id)

    return NextResponse.json({ success: true, message: 'Prestasi berhasil dihapus' })
  } catch (error) {
    console.error('Error DELETE:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus prestasi' },
      { status: 500 }
    )
  }
}

// PUT: Update prestasi
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()
    const id = parseInt(formData.get('id') as string)
    const program_slug = formData.get('program_slug') as string
    const nama_kejuaraan = formData.get('nama_kejuaraan') as string
    const tingkat = formData.get('tingkat') as string
    const tahun = parseInt(formData.get('tahun') as string)
    const keterangan = formData.get('keterangan') as string || ''
    const peringkat = formData.get('peringkat') as string || ''
    const penyelenggara = formData.get('penyelenggara') as string || ''
    const existingFoto = formData.get('existingFoto') as string
    const file = formData.get('file') as File

    if (!id || !program_slug || !nama_kejuaraan || !tingkat || !tahun) {
      return NextResponse.json(
        { success: false, error: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    let fotoUrl = existingFoto || null

    if (file && file.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Hanya file JPG, PNG, WEBP yang diperbolehkan' },
          { status: 400 }
        )
      }

      // Validasi ukuran file - 5MB
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: `Ukuran file ${(file.size / 1024 / 1024).toFixed(2)}MB melebihi batas maksimal 5MB` },
          { status: 400 }
        )
      }

      // Hapus foto lama jika ada
      if (existingFoto) {
        const oldFilePath = path.join(process.cwd(), 'public', existingFoto)
        try { await unlink(oldFilePath) } catch (err) {}
      }

      const timestamp = Date.now()
      const originalName = file.name
      const extension = originalName.split('.').pop()
      const filename = `prestasi-${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
      
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'prestasi')
      await mkdir(uploadDir, { recursive: true })
      
      const buffer = Buffer.from(await file.arrayBuffer())
      const filePath = path.join(uploadDir, filename)
      await writeFile(filePath, buffer)

      fotoUrl = `/images/prestasi/${filename}`
    }

    const stmt = db.prepare(`
      UPDATE prestasi 
      SET program_slug = ?, nama_kejuaraan = ?, tingkat = ?, tahun = ?, 
          keterangan = ?, peringkat = ?, penyelenggara = ?, foto_url = ?
      WHERE id = ?
    `)
    
    stmt.run(program_slug, nama_kejuaraan, tingkat, tahun, keterangan, peringkat, penyelenggara, fotoUrl, id)

    // Ambil data yang sudah diupdate
    const updatedItem = db.prepare('SELECT * FROM prestasi WHERE id = ?').get(id)

    return NextResponse.json({ 
      success: true, 
      data: updatedItem,
      message: 'Prestasi berhasil diupdate' 
    })
  } catch (error) {
    console.error('Error PUT:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengupdate prestasi: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}