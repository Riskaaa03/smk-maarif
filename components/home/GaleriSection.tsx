'use client'

import Link from 'next/link'
import Image from 'next/image'

interface GaleriItem {
  id: number
  title: string
  description: string
  imageUrl: string
  date: string
  kategori?: string
}

interface GaleriSectionProps {
  items: GaleriItem[]
}

export default function GaleriSection({ items }: GaleriSectionProps) {
  // Ambil 6 foto terbaru
  const displayItems = items.slice(0, 6)

  // Jika tidak ada data
  if (!items || items.length === 0) {
    return (
      <section className="bg-[#f8f8f6] py-20">
        <div className="container mx-auto px-6 md:px-10 max-w-5xl">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-px w-6 bg-[#1a5c3a]" />
            <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">
              Dokumentasi
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-2">
            Galeri Kegiatan
          </h2>
          <p className="text-gray-400 text-sm mt-6">Belum ada foto tersedia.</p>
          <Link href="/admin/galeri" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a5c3a]">
            Upload foto
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    )
  }

  // Ambil featured dan rest
  const [featured, ...restItems] = displayItems

  return (
    <section className="bg-[#f8f8f6] py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="max-w-5xl mx-auto mb-14">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-px w-6 bg-[#1a5c3a]" />
            <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">
              Dokumentasi
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111827] leading-tight">
                Galeri Kegiatan
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {items.length} foto terbaru
              </p>
            </div>
            <Link
              href="/galeri"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#1a5c3a] hover:gap-3 transition-all duration-200"
            >
              Lihat semua galeri
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Grid galeri - tanpa filter */}
        <div className="max-w-5xl mx-auto">

          {/* Layout: 1 foto besar kiri + 2 kecil kanan (baris pertama) */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 mb-4">

            {/* Foto featured (besar) */}
            <div className="group relative rounded-2xl overflow-hidden bg-gray-100 h-72 md:h-96">
              <Image
                src={featured.imageUrl}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://via.placeholder.com/800x600?text=No+Image'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e1a]/70 via-transparent to-transparent" />
              {featured.kategori && (
                <span className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                  {featured.kategori === 'kegiatan' && '📅 Kegiatan'}
                  {featured.kategori === 'prestasi' && '🏆 Prestasi'}
                  {featured.kategori === 'fasilitas' && '🏫 Fasilitas'}
                  {featured.kategori === 'pembelajaran' && '📚 Pembelajaran'}
                  {featured.kategori === 'ekskul' && '🎭 Ekskul'}
                </span>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/50 mb-1">
                  {featured.date}
                </p>
                <h3 className="font-serif text-lg font-bold text-white leading-snug line-clamp-2">
                  {featured.title}
                </h3>
                {featured.description && (
                  <p className="text-white/60 text-xs mt-1 line-clamp-1">{featured.description}</p>
                )}
              </div>
            </div>

            {/* Kolom kanan — 2 foto stacked */}
            <div className="flex flex-col gap-4">
              {restItems.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden bg-gray-100 flex-1 min-h-[140px]"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e1a]/65 via-transparent to-transparent" />
                  {item.kategori && (
                    <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[8px] font-semibold px-2 py-0.5 rounded-full">
                      {item.kategori === 'kegiatan' && '📅'}
                      {item.kategori === 'prestasi' && '🏆'}
                      {item.kategori === 'fasilitas' && '🏫'}
                      {item.kategori === 'pembelajaran' && '📚'}
                      {item.kategori === 'ekskul' && '🎭'}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/50 mb-0.5">
                      {item.date}
                    </p>
                    <h3 className="font-serif text-sm font-bold text-white leading-snug line-clamp-1">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Baris kedua — 3 foto sejajar */}
          {restItems.slice(2).length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {restItems.slice(2, 5).map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden bg-gray-100 h-44"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e1a]/65 via-transparent to-transparent" />
                  {item.kategori && (
                    <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[8px] font-semibold px-2 py-0.5 rounded-full">
                      {item.kategori === 'kegiatan' && '📅'}
                      {item.kategori === 'prestasi' && '🏆'}
                      {item.kategori === 'fasilitas' && '🏫'}
                      {item.kategori === 'pembelajaran' && '📚'}
                      {item.kategori === 'ekskul' && '🎭'}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/50 mb-0.5">
                      {item.date}
                    </p>
                    <h3 className="font-serif text-sm font-bold text-white leading-snug line-clamp-1">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Menampilkan sisa foto jika ada lebih dari 6 */}
          {items.length > 6 && (
            <div className="text-center mt-8">
              <Link
                href="/galeri"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a5c3a] text-white rounded-xl hover:bg-[#134d2e] transition-all shadow-md hover:shadow-lg"
              >
                Lihat semua foto ({items.length})
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}