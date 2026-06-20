'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface MitraDetail {
  id: number
  nama: string
  deskripsi: string
  deskripsiPanjang: string
  logoUrl: string | null
  fotoKerjasama: string | null
  website: string
  kota: string
  status: string
  urutan: number
  createdAt: string
}

export default function MitraDetailPage() {
  const { id } = useParams()
  const [mitra, setMitra] = useState<MitraDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetch(`/api/mitra?id=${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setMitra(data.data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#1a5c3a] border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-gray-400 tracking-wide">Memuat data mitra...</p>
        </div>
      </div>
    )
  }

  if (!mitra) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-5xl">😔</p>
          <h2 className="font-serif text-xl font-bold text-[#111827]">Mitra tidak ditemukan</h2>
          <Link href="/humas" className="text-[#1a5c3a] text-sm hover:underline inline-flex items-center gap-1">
            ← Kembali ke HUMAS
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="bg-[#f8f8f6] font-sans min-h-screen">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-[#0d2e1a]">
        {/* Ornamen dot */}
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`, backgroundSize: '32px 32px' }}
        />
        {/* Ornamen geometris sudut kanan */}
        <div className="absolute top-8 right-8 opacity-20 hidden md:block">
          <svg width="100" height="100" viewBox="0 0 120 120" fill="none">
            <rect x="2" y="2" width="116" height="116" rx="2" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="8 4" />
            <rect x="18" y="18" width="84" height="84" rx="1" stroke="#d4af37" strokeWidth="0.75" />
            <circle cx="60" cy="60" r="20" stroke="#d4af37" strokeWidth="0.75" />
          </svg>
        </div>
        {/* Fade ke bawah */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f8f8f6] to-transparent" />

        <div className="relative container mx-auto px-6 md:px-10 pt-10 pb-24">
          <Link
            href="/humas"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/80 text-xs tracking-[0.18em] uppercase transition-colors mb-10"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke HUMAS
          </Link>

          <div className="flex items-end gap-7 flex-wrap">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-xl flex-shrink-0">
              {mitra.logoUrl ? (
                <Image src={mitra.logoUrl} alt={mitra.nama} width={56} height={56} className="object-contain p-2" />
              ) : (
                <span className="font-serif text-3xl font-bold text-[#d4af37]">{mitra.nama.charAt(0)}</span>
              )}
            </div>

            <div className="pb-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-6 bg-[#d4af37]" />
                <span className="text-[#d4af37] text-xs font-semibold tracking-[0.18em] uppercase">Mitra Industri</span>
              </div>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                {mitra.nama}
              </h1>
              <p className="text-white/50 text-sm mt-2">
                {mitra.kota || 'Lokasi tidak tersedia'}
                {mitra.deskripsi && <> &middot; {mitra.deskripsi}</>}
              </p>
              <div className="flex gap-2 mt-4 flex-wrap">
                {(mitra.status === 'mou' || mitra.status === 'keduanya') && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium">
                    📄 MOU
                  </span>
                )}
                {(mitra.status === 'pkl' || mitra.status === 'keduanya') && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium">
                    🏭 PKL
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container mx-auto px-6 md:px-10 py-14">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Konten Utama */}
          <div className="lg:col-span-2 space-y-8">

            {/* Tentang Mitra */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="h-px w-6 bg-[#1a5c3a]" />
                <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">Tentang</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#111827] mb-4">Profil Mitra</h2>
              <p className="text-gray-600 leading-[1.85] text-[0.95rem] whitespace-pre-line">
                {mitra.deskripsiPanjang || mitra.deskripsi || 'Belum ada deskripsi lengkap untuk mitra ini.'}
              </p>

              {mitra.website && (
                <div className="mt-7 pt-6 border-t border-gray-100">
                  <a
                    href={mitra.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm text-[#1a5c3a] font-medium hover:text-[#0d2e1a] group transition-colors"
                  >
                    <span className="w-7 h-7 rounded-lg bg-[#f0f9f4] border border-[#1a5c3a]/10 flex items-center justify-center group-hover:bg-[#e0f5ea] transition-colors">
                      🌐
                    </span>
                    Kunjungi Website Resmi
                    <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>

            {/* Foto Kerjasama */}
            {mitra.fotoKerjasama && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 pt-7 pb-4 flex items-center gap-2.5">
                  <div className="h-px w-6 bg-[#1a5c3a]" />
                  <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">Dokumentasi</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#111827] px-8 mb-5">Foto Kerjasama</h2>
                <Image
                  src={mitra.fotoKerjasama}
                  alt={`Kerjasama dengan ${mitra.nama}`}
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                />
                <p className="px-8 py-3 text-[11px] text-gray-400 border-t border-gray-100">
                  Foto dokumentasi kerjasama antara SMK Ma'arif NU 01 Karangkobar dengan {mitra.nama}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Info Kerjasama */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-px w-6 bg-[#1a5c3a]" />
                <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">Informasi</span>
              </div>
              <ul className="divide-y divide-gray-50">
                <li className="flex justify-between items-center py-3">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Status</span>
                  <span className="text-sm font-semibold text-[#111827]">
                    {mitra.status === 'mou' && 'MOU Aktif'}
                    {mitra.status === 'pkl' && 'Tempat PKL'}
                    {mitra.status === 'keduanya' && 'MOU + PKL'}
                  </span>
                </li>
                <li className="flex justify-between items-center py-3">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Lokasi</span>
                  <span className="text-sm font-semibold text-[#111827]">{mitra.kota || '—'}</span>
                </li>
                <li className="flex justify-between items-center py-3">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Bergabung</span>
                  <span className="text-sm font-semibold text-[#111827]">
                    {mitra.createdAt
                      ? new Date(mitra.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
                      : '—'}
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-[#0d2e1a] rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full border border-white translate-x-1/4 translate-y-1/4" />
              </div>
              <div className="relative">
                <p className="text-[#d4af37] text-[10px] font-semibold tracking-[0.18em] uppercase mb-2">Peluang Kerjasama</p>
                <h3 className="font-serif text-lg font-bold text-white leading-snug mb-3">
                  Tertarik bermitra dengan {mitra.nama}?
                </h3>
                <p className="text-white/50 text-xs mb-5 leading-relaxed">
                  Hubungi bagian HUMAS kami untuk informasi lebih lanjut.
                </p>
                <Link
                  href="/profil#kontak"
                  className="block text-center bg-[#d4af37] hover:bg-[#c4a02e] text-[#0d2e1a] font-semibold text-sm py-2.5 rounded-full transition-colors"
                >
                  Hubungi HUMAS
                </Link>
              </div>
            </div>

            {/* Tombol kembali mobile */}
            <div className="lg:hidden">
              <Link
                href="/humas"
                className="block text-center border border-gray-200 hover:border-[#1a5c3a]/30 text-gray-500 py-2.5 rounded-full text-sm transition-colors"
              >
                ← Kembali ke Daftar Mitra
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
