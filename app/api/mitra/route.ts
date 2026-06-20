import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import db from '@/lib/db.cjs'

// GET: Ambil semua data mitra industri
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    // Jika ada parameter id, ambil data spesifik
    if (id) {
      const item = db.prepare('SELECT * FROM mitra_industri WHERE id = ?').get(id)
      if (!item) {
        return NextResponse.json(
          { success: false, error: 'Mitra tidak ditemukan' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true, data: item })
    }
    
    // Jika tidak ada id, ambil semua data
    const items = db.prepare(`
      SELECT * FROM mitra_industri 
      ORDER BY urutan ASC, createdAt DESC
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

// POST: Tambah mitra industri baru
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const nama = formData.get('nama') as string
    const deskripsi = formData.get('deskripsi') as string || ''
    const deskripsiPanjang = formData.get('deskripsiPanjang') as string || ''
    const website = formData.get('website') as string || ''
    const kota = formData.get('kota') as string || ''
    const status = formData.get('status') as string || 'mou'
    const urutan = parseInt(formData.get('urutan') as string) || 0
    const file = formData.get('file') as File
    const fotoKerjasama = formData.get('fotoKerjasama') as File

    if (!nama) {
      return NextResponse.json(
        { success: false, error: 'Nama mitra wajib diisi' },
        { status: 400 }
      )
    }

    let logoUrl = null
    let fotoKerjasamaUrl = null

    // Upload logo
    if (file && file.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Hanya file JPG, PNG, WEBP, atau SVG yang diperbolehkan' },
          { status: 400 }
        )
      }

      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: 'Ukuran file maksimal 2MB' },
          { status: 400 }
        )
      }

      const timestamp = Date.now()
      const originalName = file.name
      const extension = originalName.split('.').pop()
      const filename = `mitra-${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
      
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'mitra')
      await mkdir(uploadDir, { recursive: true })
      
      const buffer = Buffer.from(await file.arrayBuffer())
      const filePath = path.join(uploadDir, filename)
      await writeFile(filePath, buffer)

      logoUrl = `/images/mitra/${filename}`
    }

    // Upload foto kerjasama
    if (fotoKerjasama && fotoKerjasama.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
      if (!allowedTypes.includes(fotoKerjasama.type)) {
        return NextResponse.json(
          { success: false, error: 'Hanya file JPG, PNG, WEBP yang diperbolehkan untuk foto kerjasama' },
          { status: 400 }
        )
      }

      const maxSize = 5 * 1024 * 1024
      if (fotoKerjasama.size > maxSize) {
        return NextResponse.json(
          { success: false, error: 'Ukuran file maksimal 2MB' },
          { status: 400 }
        )
      }

      const timestamp = Date.now()
      const originalName = fotoKerjasama.name
      const extension = originalName.split('.').pop()
      const filename = `kerjasama-${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
      
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'mitra')
      await mkdir(uploadDir, { recursive: true })
      
      const buffer = Buffer.from(await fotoKerjasama.arrayBuffer())
      const filePath = path.join(uploadDir, filename)
      await writeFile(filePath, buffer)

      fotoKerjasamaUrl = `/images/mitra/${filename}`
    }

    // Simpan ke database
    const stmt = db.prepare(`
      INSERT INTO mitra_industri (nama, deskripsi, deskripsiPanjang, logoUrl, fotoKerjasama, website, kota, status, urutan) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(nama, deskripsi, deskripsiPanjang, logoUrl, fotoKerjasamaUrl, website, kota, status, urutan)

    return NextResponse.json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        nama,
        deskripsi,
        deskripsiPanjang,
        logoUrl,
        fotoKerjasama: fotoKerjasamaUrl,
        website,
        kota,
        status,
        urutan,
      },
    })
  } catch (error) {
    console.error('Error POST:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menambah mitra' },
      { status: 500 }
    )
  }
}

// PUT: Update mitra industri
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()
    const id = parseInt(formData.get('id') as string)
    const nama = formData.get('nama') as string
    const deskripsi = formData.get('deskripsi') as string || ''
    const deskripsiPanjang = formData.get('deskripsiPanjang') as string || ''
    const website = formData.get('website') as string || ''
    const kota = formData.get('kota') as string || ''
    const status = formData.get('status') as string || 'mou'
    const urutan = parseInt(formData.get('urutan') as string) || 0
    const file = formData.get('file') as File
    const fotoKerjasama = formData.get('fotoKerjasama') as File
    const existingLogo = formData.get('existingLogo') as string
    const existingFotoKerjasama = formData.get('existingFotoKerjasama') as string

    if (!id || !nama) {
      return NextResponse.json(
        { success: false, error: 'ID dan nama mitra wajib diisi' },
        { status: 400 }
      )
    }

    let logoUrl = existingLogo || null
    let fotoKerjasamaUrl = existingFotoKerjasama || null

    // Upload logo baru jika ada
    if (file && file.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Hanya file JPG, PNG, WEBP, atau SVG yang diperbolehkan' },
          { status: 400 }
        )
      }

      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: 'Ukuran file maksimal 2MB' },
          { status: 400 }
        )
      }

      // Hapus logo lama
      if (existingLogo) {
        const oldFilePath = path.join(process.cwd(), 'public', existingLogo)
        try {
          await unlink(oldFilePath)
        } catch (err) {}
      }

      const timestamp = Date.now()
      const originalName = file.name
      const extension = originalName.split('.').pop()
      const filename = `mitra-${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
      
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'mitra')
      await mkdir(uploadDir, { recursive: true })
      
      const buffer = Buffer.from(await file.arrayBuffer())
      const filePath = path.join(uploadDir, filename)
      await writeFile(filePath, buffer)

      logoUrl = `/images/mitra/${filename}`
    }

    // Upload foto kerjasama baru jika ada
    if (fotoKerjasama && fotoKerjasama.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
      if (!allowedTypes.includes(fotoKerjasama.type)) {
        return NextResponse.json(
          { success: false, error: 'Hanya file JPG, PNG, WEBP yang diperbolehkan' },
          { status: 400 }
        )
      }

      const maxSize = 5 * 1024 * 1024
      if (fotoKerjasama.size > maxSize) {
        return NextResponse.json(
          { success: false, error: 'Ukuran file maksimal 2MB' },
          { status: 400 }
        )
      }

      // Hapus foto kerjasama lama
      if (existingFotoKerjasama) {
        const oldFilePath = path.join(process.cwd(), 'public', existingFotoKerjasama)
        try {
          await unlink(oldFilePath)
        } catch (err) {}
      }

      const timestamp = Date.now()
      const originalName = fotoKerjasama.name
      const extension = originalName.split('.').pop()
      const filename = `kerjasama-${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
      
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'mitra')
      await mkdir(uploadDir, { recursive: true })
      
      const buffer = Buffer.from(await fotoKerjasama.arrayBuffer())
      const filePath = path.join(uploadDir, filename)
      await writeFile(filePath, buffer)

      fotoKerjasamaUrl = `/images/mitra/${filename}`
    }

    // Update database
    const stmt = db.prepare(`
      UPDATE mitra_industri 
      SET nama = ?, deskripsi = ?, deskripsiPanjang = ?, logoUrl = ?, fotoKerjasama = ?, website = ?, kota = ?, status = ?, urutan = ?
      WHERE id = ?
    `)
    
    stmt.run(nama, deskripsi, deskripsiPanjang, logoUrl, fotoKerjasamaUrl, website, kota, status, urutan, id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error PUT:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengupdate mitra' },
      { status: 500 }
    )
  }
}

// DELETE: Hapus mitra industri
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

    const item = db.prepare('SELECT logoUrl, fotoKerjasama FROM mitra_industri WHERE id = ?').get(id) as any
    
    if (item) {
      if (item.logoUrl) {
        const filePath = path.join(process.cwd(), 'public', item.logoUrl)
        try { await unlink(filePath) } catch (err) {}
      }
      if (item.fotoKerjasama) {
        const filePath = path.join(process.cwd(), 'public', item.fotoKerjasama)
        try { await unlink(filePath) } catch (err) {}
      }
    }

    db.prepare('DELETE FROM mitra_industri WHERE id = ?').run(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error DELETE:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus mitra' },
      { status: 500 }
    )
  }
}
