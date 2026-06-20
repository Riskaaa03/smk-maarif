import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import db from '@/lib/db.cjs'

// GET: Ambil data alumni
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const limit = searchParams.get('limit')
    
    if (id) {
      const item = db.prepare('SELECT * FROM alumni WHERE id = ?').get(id)
      if (!item) {
        return NextResponse.json(
          { success: false, error: 'Data tidak ditemukan' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true, data: item })
    }
    
    let query = `SELECT * FROM alumni ORDER BY urutan ASC, created_at DESC`
    const params: any[] = []
    
    if (limit) {
      query += ` LIMIT ?`
      params.push(parseInt(limit))
    }
    
    const items = db.prepare(query).all(...params)
    
    return NextResponse.json({ success: true, items })
  } catch (error) {
    console.error('Error GET:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data' },
      { status: 500 }
    )
  }
}

// POST: Tambah alumni baru
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const nama = formData.get('nama') as string
    const angkatan = parseInt(formData.get('angkatan') as string)
    const program_keahlian = formData.get('program_keahlian') as string
    const tempat_kerja = formData.get('tempat_kerja') as string || ''
    const posisi = formData.get('posisi') as string || ''
    const testimonial = formData.get('testimonial') as string || ''
    const status = formData.get('status') as string || 'aktif'
    const urutan = parseInt(formData.get('urutan') as string) || 0
    const file = formData.get('file') as File

    if (!nama || !angkatan || !program_keahlian) {
      return NextResponse.json(
        { success: false, error: 'Nama, angkatan, dan program keahlian wajib diisi' },
        { status: 400 }
      )
    }

    let fotoUrl = null

    if (file && file.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Hanya file JPG, PNG, WEBP yang diperbolehkan' },
          { status: 400 }
        )
      }

      const maxSize = 2 * 1024 * 1024
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: 'Ukuran file maksimal 2MB' },
          { status: 400 }
        )
      }

      const timestamp = Date.now()
      const originalName = file.name
      const extension = originalName.split('.').pop()
      const filename = `alumni-${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
      
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'alumni')
      await mkdir(uploadDir, { recursive: true })
      
      const buffer = Buffer.from(await file.arrayBuffer())
      const filePath = path.join(uploadDir, filename)
      await writeFile(filePath, buffer)

      fotoUrl = `/images/alumni/${filename}`
    }

    const stmt = db.prepare(`
      INSERT INTO alumni (nama, angkatan, program_keahlian, tempat_kerja, posisi, foto_url, testimonial, status, urutan) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(nama, angkatan, program_keahlian, tempat_kerja, posisi, fotoUrl, testimonial, status, urutan)

    return NextResponse.json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        nama,
        angkatan,
        program_keahlian,
        tempat_kerja,
        posisi,
        foto_url: fotoUrl,
        testimonial,
        status,
        urutan,
      },
    })
  } catch (error) {
    console.error('Error POST:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menambah data' },
      { status: 500 }
    )
  }
}

// PUT: Update alumni
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()
    const id = parseInt(formData.get('id') as string)
    const nama = formData.get('nama') as string
    const angkatan = parseInt(formData.get('angkatan') as string)
    const program_keahlian = formData.get('program_keahlian') as string
    const tempat_kerja = formData.get('tempat_kerja') as string || ''
    const posisi = formData.get('posisi') as string || ''
    const testimonial = formData.get('testimonial') as string || ''
    const status = formData.get('status') as string || 'aktif'
    const urutan = parseInt(formData.get('urutan') as string) || 0
    const existingFoto = formData.get('existingFoto') as string
    const file = formData.get('file') as File

    if (!id || !nama || !angkatan || !program_keahlian) {
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

      const maxSize = 2 * 1024 * 1024
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: 'Ukuran file maksimal 2MB' },
          { status: 400 }
        )
      }

      if (existingFoto) {
        const oldFilePath = path.join(process.cwd(), 'public', existingFoto)
        try { await unlink(oldFilePath) } catch (err) {}
      }

      const timestamp = Date.now()
      const originalName = file.name
      const extension = originalName.split('.').pop()
      const filename = `alumni-${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
      
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'alumni')
      await mkdir(uploadDir, { recursive: true })
      
      const buffer = Buffer.from(await file.arrayBuffer())
      const filePath = path.join(uploadDir, filename)
      await writeFile(filePath, buffer)

      fotoUrl = `/images/alumni/${filename}`
    }

    const stmt = db.prepare(`
      UPDATE alumni 
      SET nama = ?, angkatan = ?, program_keahlian = ?, tempat_kerja = ?, posisi = ?, 
          foto_url = ?, testimonial = ?, status = ?, urutan = ?
      WHERE id = ?
    `)
    
    stmt.run(nama, angkatan, program_keahlian, tempat_kerja, posisi, fotoUrl, testimonial, status, urutan, id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error PUT:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengupdate data' },
      { status: 500 }
    )
  }
}

// DELETE: Hapus alumni
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

    const item = db.prepare('SELECT foto_url FROM alumni WHERE id = ?').get(id) as any
    
    if (item && item.foto_url) {
      const filePath = path.join(process.cwd(), 'public', item.foto_url)
      try { await unlink(filePath) } catch (err) {}
    }

    db.prepare('DELETE FROM alumni WHERE id = ?').run(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error DELETE:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus data' },
      { status: 500 }
    )
  }
}
