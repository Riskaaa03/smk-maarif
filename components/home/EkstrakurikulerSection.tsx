// EkstrakurikulerSection.tsx
'use client'

import Link from 'next/link'

interface EkstrakurikulerSectionProps {
  items?: string[]
}

// Data ekstrakurikuler default (hanya 5 yang ditampilkan di beranda)
const DEFAULT_EKSKUL: string[] = [
  'Pramuka',
  'PMR (Palang Merah Remaja)',
  'Futsal',
  'Bola Voli',
  'Mapala',
]

// SVG inline — tidak terlihat AI, lebih bersih dari emoji
const EKSKUL_ICONS: Record<string, React.ReactNode> = {
  Pramuka: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L4 20h16L12 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17M8 14h8" />
    </svg>
  ),
  'PMR (Palang Merah Remaja)': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M4 12h16" />
      <rect x="3" y="3" width="18" height="18" rx="3" strokeLinecap="round" />
    </svg>
  ),
  Futsal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c0 4-2 6-2 9s2 5 2 9M3 12c4 0 6-2 9-2s5 2 9 2" />
    </svg>
  ),
  'Bola Voli': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M3.5 9.5C6 8 9 9 12 8s5-3 7.5-2" />
      <path strokeLinecap="round" d="M3.5 14.5C6 16 9 15 12 16s5 3 7.5 2" />
      <line x1="12" y1="3" x2="12" y2="21" strokeLinecap="round" />
    </svg>
  ),
  Mapala: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 20L9 8l4 6 3-4 5 10H3z" />
    </svg>
  ),
  'Pagar Nusa': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2 5h5l-4 3 1.5 5L12 13l-4.5 3L9 11 5 8h5l2-5z" />
    </svg>
  ),
}

const EKSKUL_DESCRIPTIONS: Record<string, string> = {
  Pramuka: 'Karakter, kedisiplinan, dan jiwa kepemimpinan',
  'PMR (Palang Merah Remaja)': 'Pertolongan pertama dan kepedulian sosial',
  Futsal: 'Kerja sama tim dan sportivitas',
  'Bola Voli': 'Koordinasi dan kekuatan fisik',
  Mapala: 'Konservasi alam dan penjelajahan',
  'Pagar Nusa': 'Seni bela diri tradisional untuk fisik dan mental',
}

function getIcon(nama: string): React.ReactNode {
  return EKSKUL_ICONS[nama] ?? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 8v4l3 3" />
    </svg>
  )
}

function getDescription(nama: string): string {
  return EKSKUL_DESCRIPTIONS[nama] ?? 'Kegiatan ekstrakurikuler untuk mengembangkan bakat dan minat siswa'
}

export default function EkstrakurikulerSection({ items }: EkstrakurikulerSectionProps) {
  const ekskul = items && items.length > 0 ? items : DEFAULT_EKSKUL

  return (
    <section
      aria-labelledby="ekstrakurikuler-heading"
      className="py-20 bg-[#f8f8f6]"
    >
      <div className="container mx-auto px-6 md:px-10">
        {/* Header - Center dengan aksen garis seperti komponen lain */}
        <div className="max-w-5xl mx-auto mb-14 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="h-px w-6 bg-[#1a5c3a]" />
            <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">
              Pengembangan Bakat
            </span>
            <div className="h-px w-6 bg-[#1a5c3a]" />
          </div>
          <h2
            id="ekstrakurikuler-heading"
            className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-3"
          >
            Ekstrakurikuler
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Kembangkan bakat dan minatmu melalui berbagai kegiatan ekstrakurikuler yang kami sediakan.
          </p>
        </div>

        {/* Grid Ekstrakurikuler - 5 kolom */}
        <div className="max-w-5xl mx-auto">
          <ul
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
            aria-label="Daftar ekstrakurikuler"
          >
            {ekskul.map((nama) => (
              <li key={nama}>
                <div className="group flex flex-col items-center text-center gap-3 p-5 rounded-xl border border-gray-100 bg-white hover:border-[#1a5c3a]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full cursor-default">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f9f4] text-[#1a5c3a] group-hover:bg-[#1a5c3a] group-hover:text-white transition-all duration-200"
                    aria-hidden="true"
                  >
                    {getIcon(nama)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-1 group-hover:text-[#1a5c3a] transition-colors">
                      {nama}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {getDescription(nama)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Link ke Halaman Kesiswaan */}
          <div className="text-center mt-10">
            <Link
              href="/kesiswaan"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#1a5c3a] hover:gap-3 transition-all duration-200"
            >
              Lihat Semua Ekstrakurikuler
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}