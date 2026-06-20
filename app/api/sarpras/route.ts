// app/api/sarpras/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Data statis untuk API
const fasilitasData = [
  {
    id: 1,
    nama: 'Ruang Kelas',
    emoji: '🏫',
    deskripsi: 'Ruang kelas yang nyaman dan kondusif untuk mendukung proses belajar mengajar.',
    thumbnail: '/uploads/sarpras/ruang-kelas.jpg',
    detail: [
      { label: 'Jumlah Ruang', nilai: '12 Ruang Kelas' },
      { label: 'Kapasitas per Ruang', nilai: '32 Siswa' },
    ]
  },
  // ... data lainnya
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        fasilitas: fasilitasData,
        sarana: [], // data sarana
        statistik: [] // data statistik
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Gagal mengambil data'
    }, { status: 500 })
  }
}