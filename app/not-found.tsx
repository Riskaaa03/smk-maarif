import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, User, BookOpen, ClipboardList } from 'lucide-react'

// ============================================================
// Metadata — Requirements: 11.4
// ============================================================
export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan',
  description: 'Halaman yang Anda cari tidak ditemukan.',
  robots: { index: false, follow: false },
}

// ============================================================
// Tautan navigasi utama yang ditampilkan di halaman 404
// ============================================================
const TAUTAN_UTAMA = [
  {
    label: 'Profil Sekolah',
    href: '/profil',
    icon: User,
    deskripsi: 'Visi, misi, dan informasi sekolah',
  },
  {
    label: 'Program Keahlian',
    href: '/program-keahlian',
    icon: BookOpen,
    deskripsi: 'TBSM, TJKT, dan AKL',
  },
  {
    label: 'PPDB',
    href: '/ppdb',
    icon: ClipboardList,
    deskripsi: 'Pendaftaran peserta didik baru',
  },
]

// ============================================================
// Halaman 404 — Requirements: 11.4
// Tidak menampilkan stack trace atau informasi teknis.
// ============================================================
export default function NotFound() {
  return (
    <main
      className="min-h-screen bg-gradient-to-br from-nu-green-50 to-white flex items-center justify-center px-4 py-16"
      aria-labelledby="not-found-heading"
    >
      <div className="max-w-lg w-full text-center">

        {/* ── Ilustrasi angka 404 ── */}
        <div
          className="mb-8 flex items-center justify-center gap-2 select-none"
          aria-hidden="true"
        >
          <span className="text-8xl font-extrabold text-nu-green-700 leading-none">4</span>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-nu-green-600 to-nu-green-800 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-extrabold text-white">0</span>
          </div>
          <span className="text-8xl font-extrabold text-nu-green-700 leading-none">4</span>
        </div>

        {/* ── Pesan utama ── */}
        <h1
          id="not-found-heading"
          className="text-2xl font-bold text-gray-900 mb-3"
        >
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-gray-600 leading-relaxed mb-8">
          Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
          Silakan kembali ke beranda atau pilih salah satu halaman di bawah ini.
        </p>

        {/* ── Tombol kembali ke beranda ── */}
        <Link
          href="/"
          aria-label="Kembali ke halaman beranda SMK Ma'arif NU 01 Karangkobar"
          className="inline-flex items-center gap-2 bg-nu-green-700 hover:bg-nu-green-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nu-green-600 focus-visible:ring-offset-2 mb-10"
        >
          <Home className="h-5 w-5" aria-hidden="true" />
          Kembali ke Beranda
        </Link>

        {/* ── Tautan ke halaman utama lainnya ── */}
        <nav aria-label="Halaman utama lainnya">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Atau kunjungi halaman lainnya
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="list">
            {TAUTAN_UTAMA.map(({ label, href, icon: Icon, deskripsi }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-nu-green-100 bg-white hover:bg-nu-green-50 hover:border-nu-green-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nu-green-600 focus-visible:ring-offset-2 group"
                >
                  <div
                    className="w-10 h-10 rounded-lg bg-nu-green-100 group-hover:bg-nu-green-200 flex items-center justify-center transition-colors"
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5 text-nu-green-700" />
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">{label}</span>
                  <span className="text-xs text-gray-500 text-center leading-snug">
                    {deskripsi}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Footer kecil identitas sekolah ── */}
        <p className="mt-10 text-xs text-gray-400">
          SMK Ma&apos;arif NU 01 Karangkobar &mdash; LP Ma&apos;arif NU
        </p>
      </div>
    </main>
  )
}
