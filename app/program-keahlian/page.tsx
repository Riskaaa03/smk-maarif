import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

// ============================================================
// Metadata SEO
// ============================================================
export const metadata: Metadata = {
  title: 'Program Keahlian',
  description:
    'Tiga program keahlian unggulan SMK Ma\'arif NU 01 Karangkobar: TBSM (Teknik & Bisnis Sepeda Motor), TJKT (Teknik Jaringan Komputer & Telekomunikasi), dan AKL (Akuntansi & Keuangan Lembaga).',
}

// ============================================================
// DATA PROGRAM
// ============================================================

const PROGRAMS = [
  {
    slug: 'tbsm',
    kode: 'TBSM',
    namaLengkap: 'Teknik & Bisnis Sepeda Motor',
    deskripsiSingkat:
      'Mempelajari perawatan, perbaikan, dan bisnis kendaraan bermotor roda dua. Lulusan siap bekerja di bengkel resmi, dealer, atau membuka usaha mandiri.',
    logoUrl: '/images/program/Logo_TBSM.png',
    aksen: '#2563eb',
    aksenLight: '#eff6ff',
    detail: [
      'Perawatan mesin sepeda motor',
      'Kelistrikan sepeda motor',
      'Sistem injeksi dan diagnosis',
      'Bisnis otomotif dan kewirausahaan',
    ],
    prospek: [
      'Mekanik di bengkel resmi',
      'Teknisi di dealer motor',
      'Wirausaha bengkel mandiri',
      'Instruktur pelatihan otomotif',
    ],
  },
  {
    slug: 'tjkt',
    kode: 'TJKT',
    namaLengkap: 'Teknik Jaringan Komputer & Telekomunikasi',
    deskripsiSingkat:
      'Menguasai instalasi jaringan, keamanan siber, dan infrastruktur telekomunikasi. Lulusan siap berkarir di bidang IT, ISP, atau perusahaan teknologi.',
    logoUrl: '/images/program/Logo_TJKT.png',
    aksen: '#dc2626',
    aksenLight: '#fef2f2',
    detail: [
      'Administrasi infrastruktur jaringan',
      'Keamanan jaringan dan siber',
      'Pemrograman web dan mobile',
      'Teknologi layanan jaringan',
    ],
    prospek: [
      'Network Engineer',
      'System Administrator',
      'Web Developer',
      'IT Support Specialist',
    ],
  },
  {
    slug: 'akl',
    kode: 'AKL',
    namaLengkap: 'Akuntansi & Keuangan Lembaga',
    deskripsiSingkat:
      'Mempelajari pembukuan, laporan keuangan, perpajakan, dan manajemen keuangan. Lulusan siap bekerja di perusahaan, bank, koperasi, atau instansi pemerintah.',
    logoUrl: '/images/program/Logo_Akuntansi.png',
    aksen: '#d97706',
    aksenLight: '#fffbeb',
    detail: [
      'Akuntansi perusahaan jasa dan dagang',
      'Komputer akuntansi',
      'Administrasi pajak',
      'Manajemen keuangan lembaga',
    ],
    prospek: [
      'Staff Accounting',
      'Staff Pajak',
      'Admin Keuangan',
      'Auditor Junior',
    ],
  },
]

// ============================================================
// KOMPONEN
// ============================================================

function OrnamenDivider() {
  return (
    <div className="flex items-center justify-center gap-4 opacity-25 max-w-5xl mx-auto">
      <div className="h-px flex-1 bg-[#1a5c3a]" />
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5L10 2Z" fill="#1a5c3a"/>
      </svg>
      <div className="h-px flex-1 bg-[#1a5c3a]" />
    </div>
  )
}

// ============================================================
// HALAMAN UTAMA
// ============================================================
export default function ProgramKeahlianPage() {
  return (
    <main className="bg-[#f8f8f6] font-sans min-h-screen">

      {/* ===== HERO ===== */}
      <div className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/program/foto_semua_prodi.png"
            alt="Program Keahlian SMK Ma'arif NU 01 Karangkobar"
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
              <span className="text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase">
                Program Keahlian
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-[1.05] max-w-3xl mb-4">
              Program <br />
              <span className="text-[#d4af37]">Keahlian</span>
            </h1>
            <p className="text-white/60 text-base md:text-lg mt-3 mb-8 max-w-xl leading-relaxed">
              Pilih program keahlian yang sesuai dengan minat dan cita-citamu. 
              Kami siapkan kamu untuk dunia kerja dan wirausaha.
            </p>

            <div className="flex flex-wrap gap-3">
              {PROGRAMS.map((program) => (
                <a
                  key={program.kode}
                  href={`#${program.slug}`}
                  className="inline-flex items-center gap-2 border border-white/30 text-white hover:border-white/60 hover:bg-white/10 font-medium text-sm px-5 py-2.5 rounded-full transition-all duration-200"
                >
                  {program.kode}
                </a>
              ))}
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

      {/* ===== KONTEN ===== */}
      <div className="container mx-auto px-6 md:px-10 py-16 md:py-24">

        {/* ===== INTRO ===== */}
        <div className="max-w-5xl mx-auto mb-14">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-px w-6 bg-[#1a5c3a]" />
            <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">
              Pilihan Jurusan
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-4">
            Pilih Program Keahlianmu
          </h2>
          <p className="text-gray-500 max-w-2xl leading-relaxed">
            SMK Ma&apos;arif NU 01 Karangkobar menyediakan tiga program keahlian unggulan yang
            dirancang untuk mempersiapkan lulusan yang kompeten, berkarakter, dan siap bersaing
            di dunia kerja maupun berwirausaha.
          </p>
        </div>

        <OrnamenDivider />

        {/* ===== CARD PROGRAM (3 kolom sejajar) ===== */}
        <div className="max-w-5xl mx-auto mt-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROGRAMS.map((program, idx) => (
              <Link
                key={program.kode}
                href={`/program-keahlian/${program.slug}`}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Garis aksen warna di atas */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: program.aksen }}
                />

                <div className="p-6 flex flex-col flex-1">
                  {/* Logo + nomor */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: program.aksenLight }}
                    >
                      <img
                        src={program.logoUrl}
                        alt={`Logo ${program.namaLengkap}`}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <span className="font-serif text-4xl font-bold leading-none select-none text-gray-100">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Badge kode */}
                  <span
                    className="inline-flex self-start rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide mb-2"
                    style={{ backgroundColor: program.aksenLight, color: program.aksen }}
                  >
                    {program.kode}
                  </span>

                  <h3 className="font-serif text-lg font-bold text-[#111827] leading-snug mb-2">
                    {program.namaLengkap}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed flex-1 line-clamp-2">
                    {program.deskripsiSingkat}
                  </p>

                  {/* Garis aksen + CTA */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <div
                      className="w-4 h-0.5 rounded-full transition-all duration-300 group-hover:w-8"
                      style={{ backgroundColor: program.aksen }}
                    />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: program.aksen }}
                    >
                      Lihat Detail
                    </span>
                    <svg
                      className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200"
                      style={{ color: program.aksen }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <OrnamenDivider />

        {/* ===== CTA PPDB ===== */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="bg-[#0d2e1a] rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-64 h-64 rounded-full border border-white -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full border border-white translate-x-1/4 translate-y-1/4" />
            </div>
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-[#d4af37]" />

            <div className="relative">
              <div className="text-5xl mb-4">🎓</div>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#d4af37]">
                Penerimaan Peserta Didik Baru
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
                Tertarik Bergabung?
              </h2>
              <p className="text-white/50 mb-8 max-w-lg mx-auto text-sm leading-relaxed">
                Daftarkan dirimu sekarang melalui jalur PPDB online dan pilih program keahlian
                yang sesuai dengan minatmu.
              </p>
              <Link
                href="/ppdb"
                className="inline-flex items-center gap-2 rounded-full font-semibold text-sm px-8 py-3 transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: '#d4af37', color: '#0d2e1a' }}
              >
                Daftar PPDB Sekarang
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}