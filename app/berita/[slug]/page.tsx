'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface BeritaDetail {
  id: number
  judul: string
  slug: string
  ringkasan: string
  konten: string
  kategori: string
  thumbnail_url: string | null
  penulis: string
  views: number
  tanggal_publikasi: string
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

export default function BeritaDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  
  const [berita, setBerita] = useState<BeritaDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!slug) return

    fetch(`/api/berita?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setBerita(data.data)
        } else {
          setError(true)
        }
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [slug])

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
                <span className="text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase">Loading...</span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-white leading-[1.05] max-w-2xl mb-4">
                Memuat Berita
              </h1>
              <p className="text-white/60 text-base md:text-lg max-w-xl">
                Mohon tunggu sebentar
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

  if (error || !berita) {
    return (
      <main className="bg-[#f8f8f6] font-sans min-h-screen">
        {/* Hero Error */}
        <div className="relative min-h-[50vh] flex items-end overflow-hidden bg-[#0d2e1a]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e1a] via-[#0d2e1a]/80 to-[#0d2e1a]/60" />
          <div className="relative w-full pb-16 md:pb-20">
            <div className="container mx-auto px-6 md:px-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-[#d4af37]" />
                <span className="text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase">Error</span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-white leading-[1.05] max-w-2xl mb-4">
                Berita Tidak Ditemukan
              </h1>
              <p className="text-white/60 text-base md:text-lg max-w-xl">
                Halaman yang Anda cari tidak tersedia
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-xl font-semibold text-gray-800">Berita tidak ditemukan</h2>
          <Link href="/berita" className="text-[#1a5c3a] mt-4 inline-block hover:underline font-medium">
            ← Kembali ke Berita
          </Link>
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
              <span className="text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase">
                {berita.kategori || 'Berita'}
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] max-w-3xl mb-4">
              {berita.judul}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
              <span>📅 {formatTanggal(berita.tanggal_publikasi)}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>✍️ {berita.penulis || 'Admin'}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>👁️ {berita.views} dilihat</span>
            </div>
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
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1a5c3a] transition-colors">Beranda</Link>
          <span>/</span>
          <Link href="/berita" className="hover:text-[#1a5c3a] transition-colors">Berita</Link>
          <span>/</span>
          <span className="text-gray-800 line-clamp-1">{berita.judul}</span>
        </div>

        {/* Thumbnail */}
        {berita.thumbnail_url && (
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-lg">
            <Image
              src={berita.thumbnail_url}
              alt={berita.judul}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Kategori */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className={`inline-flex text-sm font-semibold px-3 py-1 rounded-full ${getKategoriBadge(berita.kategori)}`}>
            {berita.kategori}
          </span>
        </div>

        {/* Ringkasan */}
        <div className="bg-[#f0f9f4] rounded-xl p-6 mb-8 border-l-4 border-[#1a5c3a]">
          <p className="text-gray-700 italic leading-relaxed">
            {berita.ringkasan}
          </p>
        </div>

        {/* Konten */}
        <div className="prose prose-gray max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {berita.konten}
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-200" />

        {/* Tombol Navigasi */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-[#1a5c3a] hover:text-[#0d2e1a] font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Berita
          </Link>
          <Link
            href="/ppdb"
            className="inline-flex items-center gap-2 bg-[#1a5c3a] hover:bg-[#0d2e1a] text-white px-6 py-2.5 rounded-lg transition-colors text-sm font-medium shadow-md hover:shadow-lg"
          >
            Daftar PPDB
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  )
}