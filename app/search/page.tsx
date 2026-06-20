import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/ui/PageHero'

// ============================================================
// SSR — query dinamis dari searchParams
// Requirements: 11.3
// ============================================================
export const dynamic = 'force-dynamic'

// ============================================================
// Metadata SEO
// ============================================================
export const metadata: Metadata = {
  title: 'Hasil Pencarian',
  description: "Cari informasi di website SMK Ma'arif NU 01 Karangkobar.",
}

// ============================================================
// Data statis program keahlian (untuk pencarian)
// ============================================================
interface ProgramKeahlianResult {
  id: string
  kode: string
  namaLengkap: string
  deskripsiSingkat: string
}

const PROGRAM_KEAHLIAN: ProgramKeahlianResult[] = [
  {
    id: '1',
    kode: 'TBSM',
    namaLengkap: 'Teknik & Bisnis Sepeda Motor',
    deskripsiSingkat: 'Mempelajari perawatan, perbaikan, dan bisnis kendaraan bermotor roda dua.',
  },
  {
    id: '2',
    kode: 'TJKT',
    namaLengkap: 'Teknik Jaringan Komputer & Telekomunikasi',
    deskripsiSingkat: 'Menguasai instalasi jaringan, keamanan siber, dan infrastruktur telekomunikasi.',
  },
  {
    id: '3',
    kode: 'AKL',
    namaLengkap: 'Akuntansi & Keuangan Lembaga',
    deskripsiSingkat: 'Mempelajari pembukuan, laporan keuangan, perpajakan, dan manajemen keuangan.',
  },
]

// ============================================================
// Peta kode program ke slug URL
// ============================================================
const KODE_TO_SLUG: Record<string, string> = {
  TBSM: 'tbsm',
  TJKT: 'tjkt',
  AKL: 'akl',
}

// ============================================================
// Fungsi pencarian program keahlian (client-side nanti)
// Karena server component, kita filter di server
// ============================================================
function searchProgramKeahlian(q: string): ProgramKeahlianResult[] {
  const query = q.toLowerCase()
  return PROGRAM_KEAHLIAN.filter(
    (program) =>
      program.namaLengkap.toLowerCase().includes(query) ||
      program.deskripsiSingkat.toLowerCase().includes(query) ||
      program.kode.toLowerCase().includes(query)
  )
}

// ============================================================
// Komponen halaman pencarian kosong (tanpa query)
// ============================================================
function EmptySearchPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-6" aria-hidden="true">
        🔍
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Cari Informasi Sekolah
      </h2>
      <p className="text-gray-500 text-sm max-w-sm mb-8">
        Masukkan kata kunci untuk mencari berita, program keahlian, dan informasi lainnya.
      </p>
      <form action="/search" method="get" className="w-full max-w-md">
        <div className="flex gap-2">
          <label htmlFor="search-input" className="sr-only">
            Kata kunci pencarian
          </label>
          <input
            id="search-input"
            type="search"
            name="q"
            placeholder="Contoh: TBSM, berita kelulusan..."
            autoFocus
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-nu-green-500 focus:outline-none focus:ring-2 focus:ring-nu-green-500/30"
          />
          <button
            type="submit"
            className="rounded-lg bg-nu-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-nu-green-800 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nu-green-600"
          >
            Cari
          </button>
        </div>
      </form>
    </div>
  )
}

// ============================================================
// Props halaman — Next.js App Router searchParams
// ============================================================
interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

// ============================================================
// Halaman Hasil Pencarian — Server Component (SSR)
// Requirements: 11.3
// ============================================================
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const q = params.q?.trim() ?? ''

  // Jika query kosong, tampilkan halaman pencarian kosong
  if (!q) {
    return (
      <main>
        <PageHero title="Hasil Pencarian" />
        <div className="container mx-auto px-4 py-12">
          <EmptySearchPage />
        </div>
      </main>
    )
  }

  // Cari program keahlian
  const programResults = searchProgramKeahlian(q)
  const totalHasil = programResults.length

  return (
    <main>
      {/* ── Hero ── */}
      <PageHero title="Hasil Pencarian" />

      <div className="container mx-auto px-4 py-12">
        {/* ── Info jumlah hasil ── */}
        <div className="mb-8">
          <p className="text-gray-600 text-sm">
            Menampilkan{' '}
            <span className="font-semibold text-gray-900">{totalHasil} hasil</span>{' '}
            untuk kata kunci{' '}
            <span className="font-semibold text-nu-green-700">&ldquo;{q}&rdquo;</span>
          </p>
        </div>

        {/* ── Tidak ada hasil ── */}
        {totalHasil === 0 && (
          <div
            className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center"
            role="status"
            aria-label="Tidak ada hasil pencarian"
          >
            <div className="text-5xl mb-4" aria-hidden="true">
              😔
            </div>
            <h2 className="text-base font-semibold text-gray-700 mb-2">
              Tidak ada hasil untuk &ldquo;{q}&rdquo;
            </h2>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Coba gunakan kata kunci yang berbeda atau lebih umum.
            </p>
          </div>
        )}

        {/* ── Hasil Program Keahlian ── */}
        {programResults.length > 0 && (
          <section aria-labelledby="hasil-program-heading">
            <h2
              id="hasil-program-heading"
              className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"
            >
              <span aria-hidden="true">🎓</span>
              Program Keahlian
              <span className="text-sm font-normal text-gray-500">
                ({programResults.length} hasil)
              </span>
            </h2>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              aria-label="Hasil pencarian program keahlian"
            >
              {programResults.map((program) => (
                <article
                  key={program.id}
                  className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  <div className="flex-1 p-5">
                    {/* Badge kode */}
                    <span className="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-nu-green-100 text-nu-green-800 mb-3">
                      {program.kode}
                    </span>
                    {/* Nama lengkap */}
                    <h3 className="text-base font-semibold text-gray-900 leading-snug mb-2">
                      {program.namaLengkap}
                    </h3>
                    {/* Deskripsi singkat */}
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {program.deskripsiSingkat}
                    </p>
                  </div>
                  {/* Tautan ke halaman detail */}
                  <div className="px-5 pb-5">
                    <Link
                      href={`/program-keahlian/${KODE_TO_SLUG[program.kode]}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-nu-green-700 hover:text-nu-green-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nu-green-600 focus-visible:ring-offset-1 rounded"
                      aria-label={`Lihat detail program ${program.namaLengkap}`}
                    >
                      Lihat Detail
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
