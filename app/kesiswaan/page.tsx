import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// Memaksa halaman dirender secara dinamis guna menghindari error ECONNREFUSED saat npm run build
export const dynamic = 'force-dynamic'

// ============================================================
// Metadata SEO
// ============================================================
export const metadata: Metadata = {
  title: 'Kesiswaan',
  description:
    "Kegiatan dan prestasi siswa SMK Ma'arif NU 01 Karangkobar: ekstrakurikuler, prestasi kejuaraan, berita kegiatan, dan galeri foto siswa.",
}

// ============================================================
// Data statis ekstrakurikuler (Req 6.1)
// ============================================================
interface EkstrakurikulerItem {
  nama: string
  deskripsi: string
  emoji: string
  kategori: string
}

const EKSTRAKURIKULER: EkstrakurikulerItem[] = [
  {
    nama: 'Pramuka',
    deskripsi:
      'Kegiatan kepramukaan yang membentuk karakter siswa melalui kegiatan alam, kepemimpinan, dan pengabdian masyarakat. Wajib diikuti oleh seluruh siswa kelas X.',
    emoji: '⛺',
    kategori: 'Wajib',
  },
  {
    nama: 'PMR (Palang Merah Remaja)',
    deskripsi:
      'Organisasi kemanusiaan yang melatih siswa dalam pertolongan pertama, donor darah, dan kepedulian sosial. Aktif dalam kegiatan bakti sosial di lingkungan sekolah dan masyarakat.',
    emoji: '🏥',
    kategori: 'Pilihan',
  },
  {
    nama: 'Futsal',
    deskripsi:
      'Tim futsal sekolah yang rutin berlatih dan mengikuti turnamen antar sekolah tingkat kabupaten dan provinsi. Melatih kerja sama tim, disiplin, dan sportivitas.',
    emoji: '⚽',
    kategori: 'Olahraga',
  },
  {
    nama: 'Bola Voli',
    deskripsi:
      'Ekstrakurikuler bola voli yang aktif mengikuti kompetisi antar sekolah. Terbuka untuk putra dan putri, melatih koordinasi, kekuatan, dan semangat juang.',
    emoji: '🏐',
    kategori: 'Olahraga',
  },
  {
    nama: 'Makapala',
    deskripsi:
      'Kegiatan yang berfokus pada aktivitas alam bebas, konservasi lingkungan hidup, dan operasi kemanusiaan.',
    emoji: '🌐',
    kategori: 'Akademik',
  },
  {
    nama: 'Pagar Nusa',
    deskripsi:
      'Seni bela diri tradisional Indonesia yang melatih fisik, mental, dan kedisiplinan siswa. Aktif mengikuti kejuaraan pencak silat tingkat kabupaten dan provinsi.',
    emoji: '🥋',
    kategori: 'Olahraga',
  },
]

// ============================================================
// Badge warna per tingkat prestasi
// ============================================================
const tingkatBadge: Record<string, { label: string; className: string; icon: string }> = {
  kabupaten: {
    label: 'Kabupaten',
    className: 'bg-blue-100 text-blue-700 border border-blue-200',
    icon: '🏛️',
  },
  provinsi: {
    label: 'Provinsi',
    className: 'bg-purple-100 text-purple-700 border border-purple-200',
    icon: '🏢',
  },
  nasional: {
    label: 'Nasional',
    className: 'bg-amber-100 text-amber-700 border border-amber-200',
    icon: '🇮🇩',
  },
  internasional: {
    label: 'Internasional',
    className: 'bg-green-100 text-green-700 border border-green-200',
    icon: '🌍',
  },
}

// ============================================================
// Divider ornamen
// ============================================================
function OrnamenDivider() {
  return (
    <div className="flex items-center justify-center gap-4 opacity-25 max-w-5xl mx-auto">
      <div className="h-px flex-1 bg-[#1a5c3a]" />
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5L10 2Z" fill="#1a5c3a" />
      </svg>
      <div className="h-px flex-1 bg-[#1a5c3a]" />
    </div>
  )
}

// ============================================================
// Fungsi fetch prestasi dari database
// ============================================================
async function fetchPrestasi() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    // Memperbaiki bentrok aturan cache (menggunakan cache no-store murni agar real-time)
    const res = await fetch(`${baseUrl}/api/prestasi`, {
      cache: 'no-store'
    })

    const data = await res.json()
    if (data.success) {
      return data.items || data.data || []
    }
    return []
  } catch (error) {
    console.error('Error fetching prestasi:', error)
    return []
  }
}

// ============================================================
// Halaman Kesiswaan — Server Component
// ============================================================
export default async function KesiswaanPage() {
  // Ambil data prestasi dari database
  const prestasiData = await fetchPrestasi()

  // Hitung jumlah program keahlian unik tanpa iterasi Set (menghindari error
  // "Set<unknown> can only be iterated through when using the '--downlevelIteration' flag")
  const programSlugCount = prestasiData.reduce((acc: Record<string, true>, p: any) => {
    if (p.program_slug) acc[p.program_slug] = true
    return acc
  }, {} as Record<string, true>)
  const jumlahProgramKeahlian = Object.keys(programSlugCount).length

  return (
    <main className="bg-[#f8f8f6] font-sans">

      {/* ── Hero ── */}
      <div className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/program/foto_semua_prodi.png"
            alt="Kesiswaan SMK Ma'arif NU 01 Karangkobar"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e1a] via-[#0d2e1a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d2e1a]/40 to-transparent" />
        </div>

        <div className="absolute top-8 right-8 opacity-20 hidden md:block">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <rect x="2" y="2" width="116" height="116" rx="2" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="8 4" />
            <rect x="18" y="18" width="84" height="84" rx="1" stroke="#d4af37" strokeWidth="0.75" />
            <circle cx="60" cy="60" r="20" stroke="#d4af37" strokeWidth="0.75" />
          </svg>
        </div>

        <div className="relative w-full pb-16 md:pb-24">
          <div className="container mx-auto px-6 md:px-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[#d4af37]" />
              <span className="text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase">Kesiswaan</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-[1.05] max-w-2xl mb-4">
              Kesiswaan
            </h1>
            <p className="text-white/60 text-base md:text-lg mt-3 mb-8 max-w-xl">
              Kegiatan, prestasi, dan pengembangan diri siswa SMK Ma'arif NU 01 Karangkobar
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#ekskul"
                className="group inline-flex items-center gap-2.5 bg-[#d4af37] hover:bg-[#c4a02e] text-[#0d2e1a] font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200"
              >
                Lihat Ekstrakurikuler
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#prestasi"
                className="inline-flex items-center gap-2.5 border border-white/30 text-white hover:border-white/60 hover:bg-white/10 font-medium text-sm px-6 py-3 rounded-full transition-all duration-200"
              >
                Lihat Prestasi
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/40" />
            <svg className="w-4 h-4 text-white/40 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-10 py-16 md:py-24 space-y-24 md:space-y-32">

        {/* ── Intro ── */}
        <section aria-labelledby="kesiswaan-intro-heading">
          <div className="grid md:grid-cols-[1fr_2.5fr] gap-12 md:gap-16 items-start max-w-5xl mx-auto">
            <div className="md:sticky md:top-8 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="h-px w-6 bg-[#1a5c3a]" />
                <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">
                  Tentang Kesiswaan
                </span>
              </div>
              <h2
                id="kesiswaan-intro-heading"
                className="font-serif text-3xl md:text-4xl font-bold text-[#111827] leading-tight"
              >
                Pengembangan<br />Potensi Siswa
              </h2>
            </div>
            <div className="border-l-2 border-[#1a5c3a]/15 pl-8 md:pl-12">
              <p className="text-gray-700 leading-[1.9] text-[0.95rem]">
                SMK Ma&apos;arif NU 01 Karangkobar berkomitmen mengembangkan potensi siswa secara
                menyeluruh — tidak hanya di bidang akademik dan kompetensi kejuruan, tetapi juga
                melalui kegiatan ekstrakurikuler, pembinaan karakter, dan pencapaian prestasi di
                berbagai bidang.
              </p>
              <blockquote className="mt-8 py-6 border-t border-b border-[#1a5c3a]/15">
                <p className="font-serif text-[#1a5c3a] text-lg italic leading-relaxed">
                  "Siswa yang berkembang utuh — cerdas, berkarakter, dan berprestasi — adalah
                  kebanggaan sejati sekolah."
                </p>
              </blockquote>
            </div>
          </div>
        </section>

        <OrnamenDivider />

        {/* ── Section 1: Ekstrakurikuler ── */}
        <section id="ekskul" aria-labelledby="ekskul-heading">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-px w-6 bg-[#1a5c3a]" />
              <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">
                Kegiatan Siswa
              </span>
            </div>
            <h2
              id="ekskul-heading"
              className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-2"
            >
              Ekstrakurikuler
            </h2>
            <p className="text-gray-400 text-sm mb-10">
              Berbagai kegiatan untuk mengembangkan bakat, minat, dan karakter siswa di luar jam pelajaran
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {EKSTRAKURIKULER.map((ekskul, index) => (
                <div
                  key={ekskul.nama}
                  className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Garis aksen hijau di atas */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#1a5c3a]" />

                  <div className="p-4 flex flex-col flex-1">
                    {/* Logo + nomor */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-lg bg-[#f0f9f4] flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">{ekskul.emoji}</span>
                      </div>
                      <span className="font-serif text-2xl font-bold leading-none select-none text-gray-100">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="font-serif text-sm font-bold text-[#111827] leading-snug mb-1 line-clamp-2">
                      {ekskul.nama}
                    </h3>

                    <p className="text-xs text-gray-400 leading-relaxed flex-1 line-clamp-3">
                      {ekskul.deskripsi}
                    </p>

                    {/* Kategori badge - tanpa background */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                      <div className="w-3 h-0.5 rounded-full bg-[#1a5c3a] transition-all duration-300 group-hover:w-6" />
                      <span className="text-[10px] font-medium text-[#1a5c3a] ml-auto">
                        {ekskul.kategori}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <OrnamenDivider />

        {/* ── Section 2: Prestasi Siswa (dari database) ── */}
        <section id="prestasi" aria-labelledby="prestasi-heading">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-px w-6 bg-[#1a5c3a]" />
              <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">
                Pencapaian
              </span>
            </div>
            <h2
              id="prestasi-heading"
              className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-2"
            >
              Prestasi Siswa
            </h2>
            <p className="text-gray-400 text-sm mb-10">
              Berbagai prestasi membanggakan yang telah diraih di berbagai bidang dan tingkat kompetisi
            </p>

            {prestasiData.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="text-4xl mb-3 opacity-20">🏆</div>
                <p className="text-gray-500 font-medium text-sm">Belum ada data prestasi</p>
                <p className="text-xs text-gray-400 mt-1">Admin dapat menambahkan prestasi melalui panel admin</p>
              </div>
            ) : (
              <>
                {/* Statistik ringkas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                  {[
                    { angka: prestasiData.length.toString(), label: 'Total Prestasi', emoji: '🏆' },
                    {
                      angka: prestasiData.filter((p: any) => p.tingkat !== 'kabupaten').length.toString(),
                      label: 'Tingkat Provinsi+',
                      emoji: '🥇',
                    },
                    { angka: new Date().getFullYear().toString(), label: 'Tahun Aktif', emoji: '📅' },
                    {
                      angka: jumlahProgramKeahlian.toString(),
                      label: 'Program Keahlian',
                      emoji: '📚'
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-all duration-200"
                    >
                      <div className="text-2xl mb-2">{stat.emoji}</div>
                      <div className="font-serif text-3xl font-bold text-[#111827] mb-1 leading-none">
                        {stat.angka}
                      </div>
                      <div className="text-gray-400 text-xs font-medium mt-2">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Daftar prestasi dari database */}
                <ol className="space-y-3">
                  {prestasiData.map((prestasi: any, idx: number) => {
                    const badge = tingkatBadge[prestasi.tingkat] || tingkatBadge.kabupaten
                    return (
                      <li
                        key={prestasi.id || idx}
                        className="group flex flex-col sm:flex-row sm:items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 hover:shadow-md hover:border-gray-200 transition-all duration-200"
                      >
                        <span
                          className="flex-shrink-0 font-serif text-2xl font-bold text-[#1a5c3a]/20 leading-none w-8 text-center"
                          aria-hidden="true"
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>

                        <div className="hidden sm:block w-px h-10 bg-gray-100 flex-shrink-0" />

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#111827] text-sm leading-snug">
                            {prestasi.nama_kejuaraan || prestasi.namaKejuaraan}
                          </p>
                          {prestasi.keterangan && (
                            <p className="text-xs text-gray-400 mt-0.5">{prestasi.keterangan}</p>
                          )}
                          {prestasi.program_slug && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              Program: <span className="font-medium text-[#1a5c3a]">{prestasi.program_slug.toUpperCase()}</span>
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
                          >
                            {badge.icon} {badge.label}
                          </span>
                          <span className="text-xs font-semibold text-gray-400 bg-gray-100 rounded-full px-2.5 py-0.5">
                            {prestasi.tahun}
                          </span>
                          {prestasi.peringkat && (
                            <span className="text-xs font-medium text-[#1a5c3a] bg-[#f0f9f4] rounded-full px-2.5 py-0.5">
                              {prestasi.peringkat}
                            </span>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </>
            )}
          </div>
        </section>

        {/* ── CTA PPDB ── */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0d2e1a] rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 rounded-full border border-white -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full border border-white translate-x-1/4 translate-y-1/4" />
            </div>

            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-[#d4af37]" />

            <div className="relative">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#d4af37]">
                Penerimaan Peserta Didik Baru
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
                Bergabunglah Bersama Kami!
              </h2>
              <p className="text-white/50 mb-8 max-w-lg mx-auto text-sm leading-relaxed">
                Kembangkan bakat dan raih prestasi bersama siswa-siswa berprestasi SMK Ma&apos;arif
                NU 01 Karangkobar. Daftarkan dirimu sekarang!
              </p>
              <Link
                href="/ppdb"
                className="inline-flex items-center gap-2 rounded-full font-semibold text-sm px-8 py-3 transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: '#d4af37', color: '#0d2e1a' }}
              >
                Daftar PPDB Sekarang
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
