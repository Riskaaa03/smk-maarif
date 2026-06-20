import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import db from '@/lib/db'

// Helper functions
function getAllGaleri() {
  const stmt = db.prepare('SELECT * FROM galeri ORDER BY id DESC')
  return stmt.all()
}

function getGaleriById(id: number) {
  const stmt = db.prepare('SELECT * FROM galeri WHERE id = ?')
  return stmt.get(id)
}

function createGaleri(title: string, description: string, kategori: string, imageUrl: string, date: string) {
  const stmt = db.prepare(`
    INSERT INTO galeri (title, description, kategori, imageUrl, date)
    VALUES (?, ?, ?, ?, ?)
  `)
  const info = stmt.run(title, description, kategori, imageUrl, date)
  return getGaleriById(info.lastInsertRowid)
}

function updateGaleri(id: number, title: string, description: string, kategori: string, imageUrl?: string) {
  if (imageUrl) {
    const stmt = db.prepare(`
      UPDATE galeri 
      SET title = ?, description = ?, kategori = ?, imageUrl = ?
      WHERE id = ?
    `)
    stmt.run(title, description, kategori, imageUrl, id)
  } else {
    const stmt = db.prepare(`
      UPDATE galeri 
      SET title = ?, description = ?, kategori = ?
      WHERE id = ?
    `)
    stmt.run(title, description, kategori, id)
  }
  return getGaleriById(id)
}

function deleteGaleri(id: number) {
  const stmt = db.prepare('DELETE FROM galeri WHERE id = ?')
  return stmt.run(id)
}

// GET - Ambil semua data galeri
export async function GET() {
  try {
    const items = getAllGaleri()
    return NextResponse.json({
      success: true,
      items
    })
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Gagal mengambil data'
    }, { status: 500 })
  }
}

// POST - Upload foto baru
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string || ''
    const kategori = formData.get('kategori') as string || 'kegiatan'
    const file = formData.get('file') as File

    // Validasi
    if (!title) {
      return NextResponse.json({
        success: false,
        error: 'Judul wajib diisi'
      }, { status: 400 })
    }

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'File foto wajib diupload'
      }, { status: 400 })
    }

    // Validasi tipe file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Hanya JPG, PNG, dan WebP yang diperbolehkan'
      }, { status: 400 })
    }

    // Validasi ukuran file (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        error: 'Ukuran file maksimal 5MB'
      }, { status: 400 })
    }

    // Upload file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Buat folder jika belum ada
    const uploadDir = path.join(process.cwd(), 'public/uploads/galeri')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate nama file unik
    const timestamp = Date.now()
    const ext = path.extname(file.name)
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}${ext}`
    const filePath = path.join(uploadDir, fileName)
    
    await writeFile(filePath, buffer)
    
    // URL untuk akses publik
    const imageUrl = `/uploads/galeri/${fileName}`

    // Format tanggal Indonesia
    const date = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    // Simpan ke database
    const newItem = createGaleri(title, description, kategori, imageUrl, date)

    return NextResponse.json({
      success: true,
      item: newItem,
      message: 'Foto berhasil diupload'
    })

  } catch (error) {
    console.error('POST Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan saat upload: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}

// PUT - Update foto
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string || ''
    const kategori = formData.get('kategori') as string || 'kegiatan'
    const file = formData.get('file') as File | null

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID tidak ditemukan'
      }, { status: 400 })
    }

    // Cek apakah data ada
    const existingItem = getGaleriById(parseInt(id))
    if (!existingItem) {
      return NextResponse.json({
        success: false,
        error: 'Data tidak ditemukan'
      }, { status: 404 })
    }

    let imageUrl = undefined

    // Jika ada file baru, upload
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
      if (!validTypes.includes(file.type)) {
        return NextResponse.json({
          success: false,
          error: 'Hanya JPG, PNG, dan WebP yang diperbolehkan'
        }, { status: 400 })
      }

      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({
          success: false,
          error: 'Ukuran file maksimal 5MB'
        }, { status: 400 })
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const uploadDir = path.join(process.cwd(), 'public/uploads/galeri')
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }

      const timestamp = Date.now()
      const ext = path.extname(file.name)
      const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}${ext}`
      const filePath = path.join(uploadDir, fileName)
      
      await writeFile(filePath, buffer)
      imageUrl = `/uploads/galeri/${fileName}`
    }

    // Update data
    const updatedItem = updateGaleri(
      parseInt(id),
      title,
      description,
      kategori,
      imageUrl
    )

    return NextResponse.json({
      success: true,
      item: updatedItem,
      message: 'Foto berhasil diperbarui'
    })

  } catch (error) {
    console.error('PUT Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan saat update: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}

// DELETE - Hapus foto
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID tidak ditemukan'
      }, { status: 400 })
    }

    // Cek apakah data ada
    const existingItem = getGaleriById(parseInt(id))
    if (!existingItem) {
      return NextResponse.json({
        success: false,
        error: 'Data tidak ditemukan'
      }, { status: 404 })
    }

    // Hapus file gambar jika ada
    if (existingItem.imageUrl) {
      try {
        const filePath = path.join(process.cwd(), 'public', existingItem.imageUrl)
        if (existsSync(filePath)) {
          await unlink(filePath)
        }
      } catch (error) {
        console.error('Error deleting file:', error)
      }
    }

    // Hapus dari database
    deleteGaleri(parseInt(id))

    return NextResponse.json({
      success: true,
      message: 'Foto berhasil dihapus'
    })

  } catch (error) {
    console.error('DELETE Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan saat menghapus: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}