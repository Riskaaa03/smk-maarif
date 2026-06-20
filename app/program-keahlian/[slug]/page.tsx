import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ProgramKeahlian } from '@/types/index'
import db from '@/lib/db' // 👈 Mengimpor database langsung untuk bypass API fetch

export const dynamicParams = true

// ============================================================
// Data statis program keahlian (hardcode — CMS belum tersedia)
// ============================================================

type ProgramSlug = 'tbsm' | 'tjkt' | 'akl'

type ProgramData = Omit<ProgramKeahlian, 'id' | 'foto' | 'updatedAt' | 'prestasi'> & {
  slug: ProgramSlug
  emoji: string
  fotoUrl: string
  warnaUtama: string
  warnaSekunder: string
  warnaAksen: string
  iconBg: string
  badgeBg: string
}

interface PrestasiData {
  id: number
  program_slug: string
  nama_kejuaraan: string
  tingkat: string
  tahun: number
  peringkat?: string
  penyelenggara?: string
  keterangan?: string
  foto_url?: string
}

const PROGRAMS_DATA: Record<ProgramSlug, ProgramData> = {
  tbsm: {
    slug: 'tbsm',
    kode: 'TBSM',
    namaLengkap: 'Teknik & Bisnis Sepeda Motor',
    emoji: '🔧',
    fotoUrl: '/images/program/foto_tumblain_tbsm.png',
    warnaUtama: 'blue',
    warnaSekunder: 'cyan',
    warnaAksen: 'blue',
    iconBg: 'bg-blue-100',
    badgeBg: 'bg-blue-600',
    deskripsiSingkat:
      'Mempelajari perawatan, perbaikan, dan bisnis kendaraan bermotor roda dua. Lulusan siap bekerja di bengkel resmi, dealer, atau membuka usaha mandiri.',
    deskripsiLengkap:
      'Program Keahlian Teknik & Bisnis Sepeda Motor (TBSM) membekali peserta didik dengan kompetensi teknis dan kewirausahaan di bidang otomotif roda dua. Siswa mempelajari sistem kerja mesin sepeda motor, teknik perawatan berkala, diagnosa kerusakan, serta manajemen bengkel dan bisnis otomotif. Program ini bekerja sama dengan bengkel resmi dan dealer sepeda motor terkemuka untuk memberikan pengalaman praktik kerja lapangan yang nyata.',
    tujuan:
      'Mencetak tenaga ahli otomotif roda dua yang kompeten, profesional, dan berjiwa wirausaha; mampu melakukan perawatan, perbaikan, dan pengelolaan bisnis di bidang sepeda motor sesuai standar industri nasional.',
    kompetensi: [
      'Perawatan dan perbaikan mesin sepeda motor 2-tak dan 4-tak',
      'Sistem kelistrikan dan elektronik sepeda motor',
      'Diagnosa kerusakan menggunakan alat scan modern',
      'Perawatan sistem bahan bakar injeksi (EFI)',
      'Perbaikan sistem rem, suspensi, dan transmisi',
      'Manajemen bengkel dan pelayanan pelanggan',
      'Kewirausahaan di bidang otomotif',
      'Keselamatan dan kesehatan kerja (K3) bengkel',
    ],
    prospekKerja: [
      'Teknisi di bengkel resmi AHRS, YAMAHA, atau HONDA',
      'Mekanik di dealer sepeda motor',
      'Wirausaha bengkel sepeda motor mandiri',
      'Staf teknis di perusahaan leasing kendaraan',
      'Instruktur pelatihan otomotif',
      'Teknisi di perusahaan ekspedisi dan logistik',
    ],
  },
  tjkt: {
    slug: 'tjkt',
    kode: 'TJKT',
    namaLengkap: 'Teknik Jaringan Komputer & Telekomunikasi',
    emoji: '💻',
    fotoUrl: '/images/program/foto_tumblain_tjkt.png',
    warnaUtama: 'red',
    warnaSekunder: 'rose',
    warnaAksen: 'red',
    iconBg: 'bg-red-100',
    badgeBg: 'bg-red-600',
    deskripsiSingkat:
      'Menguasai instalasi jaringan, keamanan siber, dan infrastruktur telekomunikasi. Lulusan siap berkarir di bidang IT, ISP, atau perusahaan teknologi.',
    deskripsiLengkap:
      'Program Keahlian Teknik Jaringan Komputer & Telekomunikasi (TJKT) mempersiapkan peserta didik untuk menjadi tenaga ahli di bidang teknologi informasi dan komunikasi. Siswa mempelajari perancangan, instalasi, konfigurasi, dan pemeliharaan jaringan komputer lokal maupun berbasis cloud, serta keamanan siber dan sistem telekomunikasi. Program ini dilengkapi dengan laboratorium komputer dan jaringan yang modern serta kemitraan dengan perusahaan IT terkemuka.',
    tujuan:
      'Menghasilkan tenaga profesional di bidang jaringan komputer dan telekomunikasi yang mampu merancang, mengimplementasikan, dan mengelola infrastruktur IT; serta memiliki kemampuan keamanan siber untuk menghadapi tantangan era digital.',
    kompetensi: [
      'Instalasi dan konfigurasi jaringan LAN, WAN, dan WLAN',
      'Administrasi server Linux dan Windows Server',
      'Keamanan jaringan dan siber (cybersecurity)',
      'Konfigurasi router dan switch (Cisco, MikroTik)',
      'Virtualisasi dan cloud computing (AWS, Google Cloud)',
      'Pemrograman web dasar (HTML, CSS, JavaScript)',
      'Sistem telekomunikasi dan fiber optik',
      'Troubleshooting dan pemeliharaan infrastruktur IT',
    ],
    prospekKerja: [
      'Network Engineer di perusahaan IT atau ISP',
      'System Administrator di instansi pemerintah atau swasta',
      'Teknisi jaringan di perusahaan telekomunikasi',
      'IT Support Specialist',
      'Cybersecurity Analyst',
      'Web Developer atau IT Consultant',
      'Wirausaha di bidang jasa IT dan jaringan',
    ],
  },
  akl: {
    slug: 'akl',
    kode: 'AKL',
    namaLengkap: 'Akuntansi & Keuangan Lembaga',
    emoji: '📊',
    fotoUrl: '/images/program/foto_tumblain_akl.png',
    warnaUtama: 'yellow',
    warnaSekunder: 'amber',
    warnaAksen: 'yellow',
    iconBg: 'bg-yellow-100',
    badgeBg: 'bg-yellow-600',
    deskripsiSingkat:
      'Mempelajari pembukuan, laporan keuangan, perpajakan, dan manajemen keuangan. Lulusan siap bekerja di perusahaan, bank, koperasi, atau instansi pemerintah.',
    deskripsiLengkap:
      'Program Keahlian Akuntansi & Keuangan Lembaga (AKL) membekali peserta didik dengan pengetahuan dan keterampilan di bidang akuntansi, keuangan, dan perpajakan. Siswa mempelajari siklus akuntansi lengkap mulai dari pencatatan transaksi hingga penyusunan laporan keuangan, serta penggunaan software akuntansi modern. Program ini mempersiapkan lulusan yang siap bekerja di berbagai lembaga keuangan dan perusahaan, maupun melanjutkan pendidikan ke jenjang yang lebih tinggi.',
    tujuan:
      'Menghasilkan tenaga akuntansi dan keuangan yang kompeten, jujur, dan profesional; mampu mengelola keuangan lembaga, menyusun laporan keuangan sesuai standar akuntansi, serta memahami regulasi perpajakan yang berlaku di Indonesia.',
    kompetensi: [
      'Siklus akuntansi perusahaan jasa, dagang, dan manufaktur',
      'Penyusunan laporan keuangan (neraca, laba rugi, arus kas)',
      'Akuntansi perbankan dan koperasi',
      'Perpajakan (PPh, PPN, dan pelaporan SPT)',
      'Penggunaan software akuntansi (MYOB, Accurate, Zahir)',
      'Manajemen kas dan pengelolaan piutang',
      'Audit internal dan pengendalian keuangan',
      'Spreadsheet keuangan (Microsoft Excel tingkat lanjut)',
    ],
    prospekKerja: [
      'Staf akuntansi di perusahaan swasta atau BUMN',
      'Teller atau customer service di perbankan',
      'Staf keuangan di koperasi atau lembaga keuangan mikro',
      'Staf perpajakan di kantor konsultan pajak',
      'Bendahara di instansi pemerintah atau sekolah',
      'Wirausaha di bidang jasa akuntansi dan pembukuan',
      'Melanjutkan studi ke perguruan tinggi jurusan Akuntansi atau Manajemen',
    ],
  },
}

const VALID_SLUGS: ProgramSlug[] = ['tbsm', 'tjkt', 'akl']

export function generateStaticParams(): { slug: ProgramSlug }[] {
  return VALID_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const params = await props.params
  const slug = params.slug
  const program = PROGRAMS_DATA[slug as ProgramSlug]

  if (!program) {
    return { title: 'Program Tidak Ditemukan' }
  }

  return {
    title: `${program.kode} — ${program.namaLengkap}`,
    description: program.deskripsiSingkat,
  }
}

const TINGKAT_LABEL: Record<string, string> = {
  kabupaten: 'Kabupaten',
  provinsi: 'Provinsi',
  nasional: 'Nasional',
  internasional: 'Internasional',
}

function getProgramAccent(warnaUtama: string) {
  switch (warnaUtama) {
    case 'blue':
      return {
        accent: '#2563eb',
        accentLight: '#eff6ff',
        accentMid: '#bfdbfe',
        label: 'text-blue-700',
        dot: 'bg-blue-600',
      }
    case 'red':
      return {
        accent: '#dc2626',
        accentLight: '#fff1f2',
        accentMid: '#fecdd3',
        label: 'text-red-700',
        dot: 'bg-red-600',
      }
    case 'yellow':
      return {
        accent: '#d97706',
        accentLight: '#fffbeb',
        accentMid: '#fde68a',
        label: 'text-amber-700',
        dot: 'bg-amber-600',
      }
    default:
      return {
        accent: '#1a5c3a',
        accentLight: '#f0f9f4',
        accentMid: '#bbf7d0',
        label: 'text-green-700',
        dot: 'bg-green-600',
      }
  }
}

// FIX TOTAL: Mengambil data langsung lewat modul SQLite native tanpa perantara HTTP Fetch
function getPrestasiFromDBDirect(programSlug: string): PrestasiData[] {
  try {
    const stmt = db.prepare(`
      SELECT id, program_slug, nama_kejuaraan, tingkat, tahun, peringkat, penyelenggara, keterangan, foto_url 
      FROM prestasi 
      WHERE program_slug = ? 
      ORDER BY tahun DESC
    `)
    return stmt.all(programSlug.toLowerCase()) as PrestasiData[]
  } catch (error) {
    console.error(`❌ Gagal mengambil data prestasi langsung dari SQLite untuk ${programSlug}:`, error)
    return []
  }
}

export default async function ProgramKeahlianDetailPage(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const slug = params.slug

  if (!VALID_SLUGS.includes(slug as ProgramSlug)) {
    notFound()
  }

  const program = PROGRAMS_DATA[slug as ProgramSlug]
  const accent = getProgramAccent(program.warnaUtama)
  
  // Memanggil fungsi baru yang terhubung langsung ke SQLite
  const prestasiList = getPrestasiFromDBDirect(slug)

  return (
    <main className="bg-[#f8f8f6] font-sans">
      {/* ── Hero ── */}
      <div className="relative min-h-[88vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={program.fotoUrl}
            alt={program.namaLengkap}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e1a] via-[#0d2e1a]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d2e1a]/40 to-transparent" />
        </div>

        <div className="absolute top-8 right-8 opacity-20 hidden md:block">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <rect x="2" y="2" width="116" height="116" rx="2" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="8 4"/>
            <rect x="18" y="18" width="84" height="84" rx="1" stroke="#d4af37" strokeWidth="0.75"/>
            <circle cx="60" cy="60" r="20" stroke="#d4af37" strokeWidth="0.75"/>
          </svg>
        </div>

        <div className="relative w-full pb-16 md:pb-24">
          <div className="container mx-auto px-6 md:px-10">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-6">
              <Link href="/" className="hover:text-white/80 transition-colors">Beranda</Link>
              <span>/</span>
              <Link href="/program-keahlian" className="hover:text-white/80 transition-colors">Program Keahlian</Link>
              <span>/</span>
              <span className="text-white/80">{program.kode}</span>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8" style={{ backgroundColor: '#d4af37' }} />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#d4af37' }}>
                Program Keahlian · {program.kode}
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-[1.05] max-w-2xl mb-4">
              {program.namaLengkap.split('&').map((part, i, arr) => (
                <span key={i}>
                  {part.trim()}
                  {i < arr.length - 1 && (
                    <span style={{ color: '#d4af37' }}> &amp; </span>
                  )}
                </span>
              ))}
            </h1>

            <p className="text-white/60 text-base md:text-lg mt-3 mb-8 max-w-xl leading-relaxed">
              {program.deskripsiSingkat}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/ppdb"
                className="group inline-flex items-center gap-2.5 font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200"
                style={{ backgroundColor: '#d4af37', color: '#0d2e1a' }}
              >
                Daftar PPDB Sekarang
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href="#deskripsi"
                className="inline-flex items-center gap-2.5 border border-white/30 text-white hover:border-white/60 hover:bg-white/10 font-medium text-sm px-6 py-3 rounded-full transition-all duration-200"
              >
                Pelajari Lebih Lanjut
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
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

      {/* ── Konten Utama ── */}
      <div id="deskripsi" className="container mx-auto px-6 md:px-10 py-16 md:py-24 space-y-24 md:space-y-32">
        <section>
          <div className="grid md:grid-cols-[1fr_2.5fr] gap-12 md:gap-16 items-start max-w-5xl mx-auto">
            <div className="md:sticky md:top-8 space-y-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="h-px w-6 bg-[#1a5c3a]" />
                <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">Tentang Program</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111827] leading-tight">
                {program.kode}
              </h2>

              <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm" style={{ backgroundColor: accent.accentLight }}>
                {program.kode === 'TBSM' && (
                  <img src="/images/program/Logo_TBSM.png" alt="Logo TBSM" className="w-full h-full object-contain p-2" />
                )}
                {program.kode === 'TJKT' && (
                  <img src="/images/program/Logo_TJKT.png" alt="Logo TJKT" className="w-full h-full object-contain p-2" />
                )}
                {program.kode === 'AKL' && (
                  <img src="/images/program/Logo_Akuntansi.png" alt="Logo AKL" className="w-full h-full object-contain p-2" />
                )}
              </div>

              <p className="text-sm text-gray-400 leading-relaxed">
                {program.namaLengkap}
              </p>
            </div>

            <div className="border-l-2 border-[#1a5c3a]/15 pl-8 md:pl-12">
              <p className="text-gray-700 leading-[1.9] text-[0.95rem]">
                {program.deskripsiLengkap}
              </p>
              {program.tujuan && (
                <blockquote className="mt-8 py-6 border-t border-b border-[#1a5c3a]/15">
                  <p className="font-serif text-[#1a5c3a] text-lg italic leading-relaxed">
                    "{program.tujuan}"
                  </p>
                </blockquote>
              )}
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center gap-4 opacity-25 max-w-5xl mx-auto">
          <div className="h-px flex-1 bg-[#1a5c3a]" />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5L10 2Z" fill="#1a5c3a"/>
          </svg>
          <div className="h-px flex-1 bg-[#1a5c3a]" />
        </div>

        <section>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-px w-6 bg-[#1a5c3a]" />
              <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">Materi Keahlian</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-2">
              Apa yang Akan Kamu Pelajari?
            </h2>
            <p className="text-gray-400 text-sm mb-10">Kompetensi yang akan dikuasai selama menempuh pendidikan</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {program.kompetensi.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold"
                    style={{ backgroundColor: accent.accent }}
                  >
                    {idx + 1}
                  </div>
                  <span className="text-gray-700 leading-relaxed text-[0.9rem]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center gap-4 opacity-25 max-w-5xl mx-auto">
          <div className="h-px flex-1 bg-[#1a5c3a]" />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5L10 2Z" fill="#1a5c3a"/>
          </svg>
          <div className="h-px flex-1 bg-[#1a5c3a]" />
        </div>

        <section>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-px w-6 bg-[#1a5c3a]" />
              <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">Karier Lulusan</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-2">
              Prospek Kerja Lulusan
            </h2>
            <p className="text-gray-400 text-sm mb-10">Peluang karier setelah lulus dari program keahlian ini</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {program.prospekKerja.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group"
                >
                  <div
                    className="w-8 h-0.5 rounded-full mb-4 transition-all duration-300 group-hover:w-14"
                    style={{ backgroundColor: accent.accent }}
                  />
                  <p className="text-gray-700 text-[0.9rem] leading-relaxed font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center gap-4 opacity-25 max-w-5xl mx-auto">
          <div className="h-px flex-1 bg-[#1a5c3a]" />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5L10 2Z" fill="#1a5c3a"/>
          </svg>
          <div className="h-px flex-1 bg-[#1a5c3a]" />
        </div>

        <section>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-px w-6 bg-[#1a5c3a]" />
              <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">Pencapaian</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-2">
              Prestasi Program Keahlian
            </h2>
            <p className="text-gray-400 text-sm mb-10">Berbagai pencapaian yang telah diraih oleh siswa dan tim</p>

            {prestasiList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {prestasiList.map((prestasi, idx) => (
                  <div
                    key={prestasi.id || idx}
                    className="group bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative h-52 bg-gray-100 overflow-hidden">
                      {prestasi.foto_url ? (
                        <img
                          src={prestasi.foto_url}
                          alt={prestasi.nama_kejuaraan}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                          <span className="text-5xl opacity-20">🏆</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <span className="text-white text-sm font-medium">
                          {prestasi.tahun}
                        </span>
                        {prestasi.peringkat && prestasi.peringkat !== '' && (
                          <span className="text-white/90 text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            {prestasi.peringkat}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <span>{TINGKAT_LABEL[prestasi.tingkat] || prestasi.tingkat}</span>
                        {prestasi.penyelenggara && prestasi.penyelenggara !== '' && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{prestasi.penyelenggara}</span>
                          </>
                        )}
                      </div>
                      <h3 className="font-semibold text-[#111827] text-base leading-snug">
                        {prestasi.nama_kejuaraan}
                      </h3>
                      {prestasi.keterangan && prestasi.keterangan !== '' && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {prestasi.keterangan}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="text-4xl mb-3 opacity-20">🏆</div>
                <p className="text-gray-500 font-medium text-sm">Belum ada data prestasi untuk program ini</p>
                <p className="text-xs text-gray-400 mt-1">Admin dapat menambahkan prestasi melalui panel admin</p>
              </div>
            )}
          </div>
        </section>

        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0d2e1a] rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-64 h-64 rounded-full border border-white -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full border border-white translate-x-1/4 translate-y-1/4" />
            </div>

            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ backgroundColor: accent.accent }} />

            <div className="relative">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: '#d4af37' }}>
                Bergabung Bersama Kami
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
                Siap Bergabung dengan<br />
                <span style={{ color: '#d4af37' }}>Program {program.kode}?</span>
              </h2>
              <p className="text-white/50 mb-8 text-sm max-w-md mx-auto leading-relaxed">
                Daftarkan dirimu sekarang melalui jalur PPDB online dan pilih{' '}
                <span className="text-white/80">{program.namaLengkap}</span> sebagai program keahlian impianmu.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/ppdb"
                  className="inline-flex items-center justify-center gap-2 rounded-full font-semibold text-sm px-8 py-3 transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: '#d4af37', color: '#0d2e1a' }}
                >
                  Daftar PPDB Sekarang
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/program-keahlian"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 text-white hover:border-white/40 hover:bg-white/10 font-medium text-sm px-8 py-3 transition-all duration-200"
                >
                  Lihat Program Lainnya
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
