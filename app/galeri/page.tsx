'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface GaleriItem {
  id: number
  title: string
  description: string
  imageUrl: string
  date: string
  kategori?: string
}

export default function GaleriPage() {
  const [items, setItems] = useState<GaleriItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GaleriItem | null>(null)

  useEffect(() => {
    fetch('/api/galeri')
      .then(res => res.json())
      .then(data => {
        if (data.success) setItems(data.items)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main>
        {/* Hero dengan Background Foto - Loading state */}
        <div className="relative bg-gradient-to-r from-nu-green-800 to-nu-green-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-nu-green-900/40 to-nu-green-800/30" />
          <div className="relative container mx-auto px-4 py-20 md:py-28">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 border border-white/30">
                <span className="text-lg">📸</span>
                <span className="text-sm font-semibold tracking-wide">Dokumentasi Kegiatan</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
                Galeri
              </h1>
              <p className="text-white/90 text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed drop-shadow">
                Momen berharga dan prestasi siswa SMK Ma'arif NU 01 Karangkobar
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-nu-green-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-500">Memuat galeri...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-gradient-to-b from-white to-gray-50">
      {/* ── Hero dengan Background Foto ── */}
      <div className="relative bg-gradient-to-r from-nu-green-800 to-nu-green-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/program/foto_semua_prodi.png"
            alt="Galeri Kegiatan SMK Ma'arif NU 01 Karangkobar"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-nu-green-900/40 to-nu-green-800/30" />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 border border-white/30">
              <span className="text-lg">📸</span>
              <span className="text-sm font-semibold tracking-wide">Dokumentasi Kegiatan</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
              Galeri
            </h1>
            <p className="text-white/90 text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed drop-shadow">
              Momen berharga dan prestasi siswa SMK Ma'arif NU 01 Karangkobar
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-50">📸</div>
            <h3 className="text-xl font-medium text-gray-600">Belum ada foto</h3>
            <p className="text-gray-400 mt-2">Foto akan segera ditambahkan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                onClick={() => setSelectedImage(item)}
              >
                {/* Foto */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Kategori Badge */}
                  {item.kategori && (
                    <span className="absolute top-3 left-3 bg-black/50 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
                      {item.kategori === 'kegiatan' && '📅 Kegiatan'}
                      {item.kategori === 'prestasi' && '🏆 Prestasi'}
                      {item.kategori === 'fasilitas' && '🏫 Fasilitas'}
                      {item.kategori === 'pembelajaran' && '📚 Pembelajaran'}
                      {item.kategori === 'ekskul' && '🎭 Ekskul'}
                    </span>
                  )}
                </div>

                {/* Deskripsi */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                    {item.title}
                  </h3>
                  
                  {/* Deskripsi akan muncul di sini */}
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  
                  {/* Jika tidak ada deskripsi, tampilkan placeholder */}
                  {!item.description && (
                    <p className="text-gray-400 text-sm italic mb-3">
                      Tidak ada deskripsi
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {item.date}
                    </p>
                    <span className="text-xs text-nu-green-600 group-hover:translate-x-1 transition-transform">
                      Lihat →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal dengan Deskripsi */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              width={1400}
              height={900}
              className="object-contain max-h-[85vh] w-auto rounded-xl shadow-2xl"
            />
            
            {/* Caption dengan Deskripsi */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 rounded-b-xl">
              <h3 className="text-white text-xl font-bold mb-1">
                {selectedImage.title}
              </h3>
              {selectedImage.description && (
                <p className="text-white/80 text-sm mb-2 leading-relaxed">
                  {selectedImage.description}
                </p>
              )}
              {!selectedImage.description && (
                <p className="text-white/50 text-sm italic mb-2">
                  Tidak ada deskripsi untuk foto ini
                </p>
              )}
              <p className="text-white/40 text-xs">
                📅 {selectedImage.date}
              </p>
            </div>
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur">
            {items.findIndex(i => i.id === selectedImage.id) + 1} / {items.length}
          </div>
        </div>
      )}
    </main>
  )
}
