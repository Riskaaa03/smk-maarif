import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import db from '@/lib/db.cjs'

// Helper: Generate slug dari judul
function generateSlug(judul: string): string {
  const slug = judul
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
  return `${slug}-${Date.now()}`
}

// GET: Ambil data berita
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const id = searchParams.get('id')
    const limit = searchParams.get('limit')
    const kategori = searchParams.get('kategori')
    
    // Jika ada slug, ambil detail berita (untuk halaman detail)
    if (slug) {
      const item = db.prepare(`
        SELECT * FROM berita WHERE slug = ? AND status = 'published'
      `).get(slug)
      
      if (!item) {
        return NextResponse.json(
          { success: false, error: 'Berita tidak ditemukan' },
          { status: 404 }
        )
      }
      
      // Update views (tambah 1 setiap dilihat)
      db.prepare(`UPDATE berita SET views = views + 1 WHERE slug = ?`).run(slug)
      
      return NextResponse.json({ success: true, data: item })
    }
    
    // Jika ada id, ambil berdasarkan id
    if (id) {
      const item = db.prepare('SELECT * FROM berita WHERE id = ?').get(id)
      if (!item) {
        return NextResponse.json(
          { success: false, error: 'Berita tidak ditemukan' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true, data: item })
    }
    
    // Build query untuk daftar berita (halaman daftar berita)
    let query = `SELECT * FROM berita WHERE status = 'published'`
    const params: any[] = []
    
    if (kategori && kategori !== 'semua') {
      query += ` AND kategori = ?`
      params.push(kategori)
    }
    
    query += ` ORDER BY tanggal_publikasi DESC`
    
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

// POST: Tambah berita baru (untuk admin)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const judul = formData.get('judul') as string
    const ringkasan = formData.get('ringkasan') as string || ''
    const konten = formData.get('konten') as string || ''
    const kategori = formData.get('kategori') as string || 'berita'
    const penulis = formData.get('penulis') as string || 'Admin'
    const status = formData.get('status') as string || 'draft'
    const file = formData.get('file') as File

    if (!judul) {
      return NextResponse.json(
        { success: false, error: 'Judul berita wajib diisi' },
        { status: 400 }
      )
    }

    const slug = generateSlug(judul)
    let thumbnailUrl = null

    // Upload thumbnail jika ada
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
      const filename = `berita-${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
      
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'berita')
      await mkdir(uploadDir, { recursive: true })
      
      const buffer = Buffer.from(await file.arrayBuffer())
      const filePath = path.join(uploadDir, filename)
      await writeFile(filePath, buffer)

      thumbnailUrl = `/images/berita/${filename}`
    }

    // Simpan ke database
    const stmt = db.prepare(`
      INSERT INTO berita (judul, slug, ringkasan, konten, kategori, thumbnail_url, penulis, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(judul, slug, ringkasan, konten, kategori, thumbnailUrl, penulis, status)

    return NextResponse.json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        judul,
        slug,
        ringkasan,
        konten,
        kategori,
        thumbnail_url: thumbnailUrl,
        penulis,
        status,
      },
    })
  } catch (error) {
    console.error('Error POST:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menambah berita' },
      { status: 500 }
    )
  }
}

// DELETE: Hapus berita
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

    // Ambil data thumbnail dari database
    const item = db.prepare('SELECT thumbnail_url FROM berita WHERE id = ?').get(id) as any
    
    if (item && item.thumbnail_url) {
      const filePath = path.join(process.cwd(), 'public', item.thumbnail_url)
      try {
        await unlink(filePath)
      } catch (err) {
        console.log('File tidak ditemukan, lanjut hapus database')
      }
    }

    db.prepare('DELETE FROM berita WHERE id = ?').run(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error DELETE:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus berita' },
      { status: 500 }
    )
  }
}

// PUT: Update berita
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()
    const id = parseInt(formData.get('id') as string)
    const judul = formData.get('judul') as string
    const ringkasan = formData.get('ringkasan') as string || ''
    const konten = formData.get('konten') as string || ''
    const kategori = formData.get('kategori') as string || 'berita'
    const penulis = formData.get('penulis') as string || 'Admin'
    const status = formData.get('status') as string || 'draft'
    const existingThumbnail = formData.get('existingThumbnail') as string
    const file = formData.get('file') as File

    if (!id || !judul) {
      return NextResponse.json(
        { success: false, error: 'ID dan judul wajib diisi' },
        { status: 400 }
      )
    }

    let thumbnailUrl = existingThumbnail || null

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

      if (existingThumbnail) {
        const oldFilePath = path.join(process.cwd(), 'public', existingThumbnail)
        try { await unlink(oldFilePath) } catch (err) {}
      }

      const timestamp = Date.now()
      const originalName = file.name
      const extension = originalName.split('.').pop()
      const filename = `berita-${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
      
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'berita')
      await mkdir(uploadDir, { recursive: true })
      
      const buffer = Buffer.from(await file.arrayBuffer())
      const filePath = path.join(uploadDir, filename)
      await writeFile(filePath, buffer)

      thumbnailUrl = `/images/berita/${filename}`
    }

    const stmt = db.prepare(`
      UPDATE berita 
      SET judul = ?, ringkasan = ?, konten = ?, kategori = ?, 
          thumbnail_url = ?, penulis = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    stmt.run(judul, ringkasan, konten, kategori, thumbnailUrl, penulis, status, id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error PUT:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengupdate berita' },
      { status: 500 }
    )
  }
}
