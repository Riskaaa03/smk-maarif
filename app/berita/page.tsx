'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface BeritaItem {
  id: number
  judul: string
  slug: string
  ringkasan: string
  kategori: string
  thumbnail_url: string | null
  tanggal_publikasi: string
  views: number
}

function formatTanggal(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function getKategoriBadge(kategori: string): string {
  switch (kategori) {
    case 'berita': return 'bg-blue-100 text-blue-700'
    case 'pengumuman': return 'bg-yellow-100 text-yellow-700'
    case 'prestasi': return 'bg-green-100 text-green-700'
    case 'kegiatan': return 'bg-purple-100 text-purple-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

export default function BeritaPage() {
  const [items, setItems] = useState<BeritaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/berita')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setItems(data.items || [])
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main className="bg-[#f8f8f6] font-sans min-h-screen">
        {/* Hero Loading */}
        <div className="relative min-h-[50vh] flex items-end overflow-hidden bg-[#0d2e1a]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e1a] via-[#0d2e1a]/80 to-[#0d2e1a]/60" />
          <div className="relative w-full pb-16 md:pb-20">
            <div className="container mx-auto px-6 md:px-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-[#d4af37]" />
                <span className="text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase">Informasi</span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-white leading-[1.05] max-w-2xl mb-4">
                Berita
              </h1>
              <p className="text-white/60 text-base md:text-lg max-w-xl">
                Informasi terbaru dari SMK Ma'arif NU 01 Karangkobar
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1a5c3a] border-t-transparent"></div>
          <p className="mt-2 text-gray-500">Memuat berita...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#f8f8f6] font-sans min-h-screen">

      {/* ── Hero ── */}
      <div className="relative min-h-[50vh] flex items-end overflow-hidden bg-[#0d2e1a]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e1a] via-[#0d2e1a]/80 to-[#0d2e1a]/60" />
        
        {/* Ornamen geometris */}
        <div className="absolute top-8 right-8 opacity-20 hidden md:block">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <rect x="2" y="2" width="116" height="116" rx="2" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="8 4" />
            <rect x="18" y="18" width="84" height="84" rx="1" stroke="#d4af37" strokeWidth="0.75" />
            <circle cx="60" cy="60" r="20" stroke="#d4af37" strokeWidth="0.75" />
          </svg>
        </div>

        <div className="relative w-full pb-16 md:pb-20">
          <div className="container mx-auto px-6 md:px-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[#d4af37]" />
              <span className="text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase">Informasi</span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-white leading-[1.05] max-w-2xl mb-4">
              Berita
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl">
              Informasi terbaru dari SMK Ma'arif NU 01 Karangkobar
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/40" />
            <svg className="w-4 h-4 text-white/40 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Konten ── */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-50">📰</div>
            <h3 className="text-xl font-medium text-gray-600">Belum ada berita</h3>
            <p className="text-gray-400 mt-2">Berita akan segera ditambahkan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/berita/${item.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  {item.thumbnail_url ? (
                    <Image
                      src={item.thumbnail_url}
                      alt={item.judul}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0d2e1a] to-[#1a5c3a] flex items-center justify-center">
                      <span className="text-6xl opacity-30">📰</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${getKategoriBadge(item.kategori)}`}>
                      {item.kategori}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <span>📅 {formatTanggal(item.tanggal_publikasi)}</span>
                    <span>•</span>
                    <span>👁️ {item.views} dilihat</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 group-hover:text-[#1a5c3a] transition-colors">
                    {item.judul}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {item.ringkasan}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#1a5c3a] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Baca selengkapnya
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}