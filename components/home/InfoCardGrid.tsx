import Link from 'next/link'

interface InfoCard {
  id: string
  judul: string
  deskripsi: string
  href: string
}

const cards: InfoCard[] = [
  {
    id: 'ppdb',
    judul: 'PPDB Online',
    deskripsi: 'Daftar sebagai peserta didik baru secara online. Mudah, cepat, dan tanpa antri.',
    href: '/ppdb',
  },
  {
    id: 'program-keahlian',
    judul: 'Program Keahlian',
    deskripsi: 'Tiga program unggulan: TBSM, TJKT, dan AKL. Pilih sesuai minat dan bakat kamu.',
    href: '/program-keahlian',
  },
  {
    id: 'galeri',
    judul: 'Galeri Kegiatan',
    deskripsi: 'Lihat foto dan video kegiatan sekolah, prestasi siswa, dan momen berkesan lainnya.',
    href: '/galeri',
  },
  {
    id: 'mitra-industri',
    judul: 'Mitra Industri',
    deskripsi: 'Jaringan mitra industri yang mendukung PKL dan penempatan kerja lulusan kami.',
    href: '/humas',
  },
]

const cardIcons: Record<string, React.ReactNode> = {
  ppdb: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </svg>
  ),
  'program-keahlian': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  galeri: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  ),
  'mitra-industri': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
}

export default function InfoCardGrid() {
  return (
    <section className="bg-[#f8f8f6] py-10 md:py-14">
      <div className="container mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group relative flex flex-col items-start p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-[#1a5c3a]/30 hover:shadow-md transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a5c3a]"
              aria-label={`${card.judul} — ${card.deskripsi}`}
            >
              {/* Icon badge */}
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0f9f4] border border-[#1a5c3a]/10 text-[#1a5c3a] group-hover:bg-[#0d2e1a] group-hover:text-[#d4af37] group-hover:border-transparent transition-all duration-200">
                {cardIcons[card.id]}
              </div>

              <h3 className="font-serif text-sm font-bold text-[#111827] leading-snug mb-1.5 group-hover:text-[#1a5c3a] transition-colors duration-200">
                {card.judul}
              </h3>

              <p className="text-xs text-gray-500 leading-relaxed hidden sm:block flex-1">
                {card.deskripsi}
              </p>

              <span
                className="mt-3 inline-flex items-center gap-1 text-[#1a5c3a] group-hover:text-[#d4af37] group-hover:gap-2 transition-all duration-150 hidden sm:inline-flex text-xs font-semibold tracking-wide uppercase"
                aria-hidden="true"
              >
                Lihat Detail
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
