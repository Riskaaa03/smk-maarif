'use client'

// ============================================================
// Error Boundary — Requirements: 11.4
// Wajib 'use client' karena menggunakan useEffect dan props
// dari Next.js error boundary.
// Tidak menampilkan stack trace atau informasi teknis ke user.
// ============================================================

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  // Log error ke console untuk keperluan debugging (tidak ditampilkan ke user)
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-nu-green-50 to-white flex items-center justify-center px-4 py-16"
      aria-labelledby="error-heading"
    >
      <div className="max-w-md w-full text-center">

        {/* ── Ikon peringatan ── */}
        <div
          className="mb-6 flex justify-center"
          aria-hidden="true"
        >
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-amber-600" />
          </div>
        </div>

        {/* ── Pesan error generik ── */}
        <h1
          id="error-heading"
          className="text-2xl font-bold text-gray-900 mb-3"
        >
          Terjadi Kesalahan
        </h1>
        <p className="text-gray-600 leading-relaxed mb-8">
          Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba lagi atau
          kembali ke beranda.
        </p>

        {/* ── Tombol aksi ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Tombol Coba Lagi — memanggil reset() dari Next.js */}
          <button
            type="button"
            onClick={reset}
            aria-label="Coba muat ulang halaman ini"
            className="inline-flex items-center gap-2 bg-nu-green-700 hover:bg-nu-green-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nu-green-600 focus-visible:ring-offset-2"
          >
            <RefreshCw className="h-5 w-5" aria-hidden="true" />
            Coba Lagi
          </button>

          {/* Tombol kembali ke beranda */}
          <Link
            href="/"
            aria-label="Kembali ke halaman beranda"
            className="inline-flex items-center gap-2 border border-nu-green-300 hover:bg-nu-green-50 text-nu-green-800 font-semibold px-6 py-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nu-green-600 focus-visible:ring-offset-2"
          >
            <Home className="h-5 w-5" aria-hidden="true" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* ── Footer kecil identitas sekolah ── */}
        <p className="mt-10 text-xs text-gray-400">
          SMK Ma&apos;arif NU 01 Karangkobar &mdash; LP Ma&apos;arif NU
        </p>
      </div>
    </main>
  )
}
