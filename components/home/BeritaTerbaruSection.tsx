// BeritaTerbaruSection.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'

interface BeritaItem { 
  id: number; 
  judul: string; 
  slug: string; 
  ringkasan: string; 
  thumbnail_url: string | null; 
  tanggal_publikasi: string; 
  views: number 
}

interface BeritaTerbaruSectionProps { 
  articles: BeritaItem[] 
}

function formatTanggal(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BeritaTerbaruSection({ articles }: BeritaTerbaruSectionProps) {
  if (!articles?.length) return (
    <section className="bg-[#f8f8f6] py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-10 max-w-5xl">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="h-px w-6 bg-[#1a5c3a]" />
          <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">
            Informasi Terkini
          </span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-2">
          Berita Terbaru
        </h2>
        <p className="text-gray-400 text-sm mt-6">Belum ada berita tersedia.</p>
        <Link href="/admin/berita" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a5c3a]">
          Tambah berita
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )

  const featured = articles[0]
  const rest = articles.slice(1, 4)

  return (
    <section className="bg-[#f8f8f6] py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-10">
        {/* Header dengan gaya konsisten */}
        <div className="max-w-5xl mx-auto mb-14">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-px w-6 bg-[#1a5c3a]" />
            <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">
              Informasi Terkini
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111827] leading-tight">
              Berita Terbaru
            </h2>
            <Link
              href="/berita"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#1a5c3a] hover:gap-3 transition-all duration-200"
            >
              Lihat semua berita
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Grid berita dengan layout yang mirip galeri */}
        <div className="max-w-5xl mx-auto">
          {/* Featured berita (besar) + 2 berita kecil */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 mb-4">
            {/* Featured berita */}
            <Link href={`/berita/${featured.slug}`} className="group relative rounded-2xl overflow-hidden bg-gray-100 h-72 md:h-96 block">
              <div className="relative w-full h-full">
                {featured.thumbnail_url ? (
                  <Image
                    src={featured.thumbnail_url}
                    alt={featured.judul}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1a5c3a]/20 to-[#1a5c3a]/40 flex items-center justify-center">
                    <span className="text-5xl opacity-30">📰</span>
                  </div>
                )}
              </div>
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e1a]/70 via-transparent to-transparent" />
              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/50 mb-1">
                  {formatTanggal(featured.tanggal_publikasi)}
                </p>
                <h3 className="font-serif text-lg font-bold text-white leading-snug line-clamp-2">
                  {featured.judul}
                </h3>
                <p className="text-white/60 text-xs mt-1 line-clamp-1">{featured.ringkasan}</p>
              </div>
            </Link>

            {/* Kolom kanan — 2 berita stacked */}
            <div className="flex flex-col gap-4">
              {rest.slice(0, 2).map((item) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className="group relative rounded-2xl overflow-hidden bg-gray-100 flex-1 min-h-[140px] block"
                >
                  <div className="relative w-full h-full">
                    {item.thumbnail_url ? (
                      <Image
                        src={item.thumbnail_url}
                        alt={item.judul}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1a5c3a]/20 to-[#1a5c3a]/40 flex items-center justify-center">
                        <span className="text-3xl opacity-30">📰</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e1a]/65 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/50 mb-0.5">
                      {formatTanggal(item.tanggal_publikasi)}
                    </p>
                    <h3 className="font-serif text-sm font-bold text-white leading-snug line-clamp-1">
                      {item.judul}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Baris kedua — 1 berita jika ada */}
          {rest.length > 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {rest.slice(2, 3).map((item) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className="group relative rounded-2xl overflow-hidden bg-gray-100 h-44 block md:col-span-3"
                >
                  <div className="relative w-full h-full">
                    {item.thumbnail_url ? (
                      <Image
                        src={item.thumbnail_url}
                        alt={item.judul}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1a5c3a]/20 to-[#1a5c3a]/40 flex items-center justify-center">
                        <span className="text-3xl opacity-30">📰</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e1a]/65 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/50 mb-0.5">
                      {formatTanggal(item.tanggal_publikasi)}
                    </p>
                    <h3 className="font-serif text-sm font-bold text-white leading-snug line-clamp-1">
                      {item.judul}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}