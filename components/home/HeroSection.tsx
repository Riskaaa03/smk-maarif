'use client'

import Link from 'next/link'
import Image from 'next/image'
import fotoSekolah from './image/foto_sekolah.png'

export default function HeroSection({ backgroundImage }: { backgroundImage?: string }) {
  const imageToUse = backgroundImage || fotoSekolah.src

  return (
    <section className="relative overflow-hidden min-h-[88vh] flex items-end">
      {/* Background */}
      <div className="absolute inset-0">
        <Image src={imageToUse} alt="SMK Ma'arif NU 01 Karangkobar" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e1a] via-[#0d2e1a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2e1a]/40 to-transparent" />
      </div>

      {/* Ornamen geometris sudut kanan atas */}
      <div className="absolute top-8 right-8 opacity-20 hidden md:block">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <rect x="2" y="2" width="116" height="116" rx="2" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="8 4" />
          <rect x="18" y="18" width="84" height="84" rx="1" stroke="#d4af37" strokeWidth="0.75" />
          <circle cx="60" cy="60" r="20" stroke="#d4af37" strokeWidth="0.75" />
        </svg>
      </div>

      {/* Konten */}
      <div className="relative z-10 w-full pb-16 md:pb-24">
        <div className="container mx-auto px-6 md:px-10">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#d4af37]" />
            <span className="text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase">
              SMK Ma'arif NU 01 Karangkobar
            </span>
          </div>

          {/* Judul */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.02] max-w-3xl mb-5">
            Selamat<br />
            Datang di{' '}
            <span className="text-[#d4af37]">SMK<br />Ma'arif NU 01</span>
          </h1>

          {/* Subjudul */}
          <p className="text-white/60 text-base md:text-lg max-w-xl leading-relaxed mb-10">
            Membentuk Generasi Muslim yang Kompeten, Berakhlak Mulia, dan Berdaya Saing.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              href="/ppdb"
              className="group inline-flex items-center gap-2.5 bg-[#d4af37] hover:bg-[#c4a02e] text-[#0d2e1a] font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Daftar PPDB Sekarang
            </Link>
            <Link
              href="/program-keahlian"
              className="inline-flex items-center gap-2.5 border border-white/30 text-white hover:border-white/60 hover:bg-white/10 font-medium text-sm px-6 py-3 rounded-full transition-all duration-200"
            >
              Pelajari Program Keahlian
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Statistik */}
          <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '3+', label: 'Program Keahlian' },
              { value: '20+', label: 'Mitra Industri' },
              { value: '50+', label: 'Prestasi' },
              { value: '100+', label: 'Alumni Bekerja' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-white/40 text-xs uppercase tracking-wide mt-1">{stat.label}</p>
              </div>
            ))}
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
    </section>
  )
}
