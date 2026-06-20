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
  const params = useParams()
  const id = params?.id as string
  const [mitra, setMitra] = useState<MitraDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetch(`/api/mitra?id=${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setMitra(data.data)
          }
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-nu-green-600 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400 tracking-wide">Memuat data mitra...</p>
        </div>
      </div>
    )
  }

  if (!mitra) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <p className="text-5xl">😔</p>
          <h2 className="text-lg font-semibold text-gray-700">Mitra tidak ditemukan</h2>
          <Link href="/humas" className="text-nu-green-600 text-sm hover:underline inline-flex items-center gap-1">
            Kembali ke HUMAS
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="bg-[#f5f6f8] min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-nu-green-900">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #ffffff 1px, transparent 1px),
                              radial-gradient(circle at 80% 20%, #ffffff 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f5f6f8] to-transparent" />

        <div className="relative container mx-auto px-4 pt-8 pb-28">
          <Link
            href="/humas"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-white/90 text-xs tracking-widest uppercase transition-colors mb-10"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke HUMAS
          </Link>

          <div className="flex items-end gap-8 flex-wrap">
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-xl flex-shrink-0">
              {mitra.logoUrl ? (
                <Image src={mitra.logoUrl} alt={mitra.nama} width={64} height={64} className="object-contain p-2" />
              ) : (
                <span className="text-4xl">🏭</span>
              )}
            </div>

            <div className="pb-1">
              <p className="text-white/40 text-xs tracking-[0.15em] uppercase mb-1.5">Mitra Industri</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">{mitra.nama}</h1>
              <p className="text-white/60 text-sm mt-1.5">
                {mitra.kota || 'Lokasi tidak tersedia'}
                {mitra.deskripsi && <> - {mitra.deskripsi}</>}
              </p>

              <div className="flex gap-2 mt-4 flex-wrap">
                {(mitra.status === 'mou' || mitra.status === 'keduanya') && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium backdrop-blur-sm">
                    MOU
                  </span>
                )}
                {(mitra.status === 'pkl' || mitra.status === 'keduanya') && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium backdrop-blur-sm">
                    PKL
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

          {/* Konten Utama */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tentang Mitra */}
            <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-7">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-1 h-5 bg-nu-green-600 rounded-full" />
                <h2 className="text-base font-semibold text-gray-900 tracking-tight">Tentang Mitra</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-[15px] whitespace-pre-line">
                {mitra.deskripsiPanjang || mitra.deskripsi || 'Belum ada deskripsi lengkap untuk mitra ini.'}
              </p>

              {mitra.website && (
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <a
                    href={mitra.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-nu-green-700 font-medium hover:text-nu-green-800 group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-nu-green-50 flex items-center justify-center group-hover:bg-nu-green-100 transition-colors">
                      🌐
                    </span>
                    Kunjungi Website Resmi
                    <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>

            {/* Foto Kerjasama */}
            {mitra.fotoKerjasama && (
              <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-7 pt-6 pb-4 flex items-center gap-2.5">
                  <div className="w-1 h-5 bg-nu-green-600 rounded-full" />
                  <h2 className="text-base font-semibold text-gray-900 tracking-tight">Dokumentasi Kerjasama</h2>
                </div>
                <div className="relative">
                  <Image
                    src={mitra.fotoKerjasama}
                    alt={`Kerjasama dengan ${mitra.nama}`}
                    width={800}
                    height={500}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <p className="px-7 py-3 text-[11px] text-gray-400 border-t border-gray-100">
                  Dokumentasi kerjasama antara SMK Ma'arif NU 01 Karangkobar dengan {mitra.nama}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Info Kerjasama */}
            <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-1 h-5 bg-nu-green-600 rounded-full" />
                <h3 className="text-sm font-semibold text-gray-900 tracking-tight">Informasi Kerjasama</h3>
              </div>
              <ul className="space-y-0 divide-y divide-gray-100">
                <li className="flex justify-between items-center py-3">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Status</span>
                  <span className="text-sm font-medium text-gray-800">
                    {mitra.status === 'mou' && 'MOU Aktif'}
                    {mitra.status === 'pkl' && 'Tempat PKL'}
                    {mitra.status === 'keduanya' && 'MOU + Tempat PKL'}
                  </span>
                </li>
                <li className="flex justify-between items-center py-3">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Lokasi</span>
                  <span className="text-sm font-medium text-gray-800">{mitra.kota || '—'}</span>
                </li>
                <li className="flex justify-between items-center py-3">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Bergabung</span>
                  <span className="text-sm font-medium text-gray-800">
                    {mitra.createdAt ? new Date(mitra.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : '—'}
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-nu-green-900 rounded-2xl p-6 text-white">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Peluang Kerjasama</p>
              <h3 className="text-base font-semibold leading-snug mb-3">
                Tertarik bermitra dengan {mitra.nama}?
              </h3>
              <p className="text-sm text-white/60 mb-5 leading-relaxed">
                Hubungi bagian HUMAS kami untuk informasi lebih lanjut mengenai kerjasama.
              </p>
              <Link
                href="/profil#kontak"
                className="block text-center bg-white text-nu-green-900 hover:bg-nu-green-50 font-semibold text-sm py-2.5 rounded-xl transition-colors"
              >
                Hubungi HUMAS
              </Link>
            </div>

            {/* Tombol kembali mobile */}
            <div className="lg:hidden">
              <Link
                href="/humas"
                className="block text-center border border-gray-200 hover:bg-gray-50 text-gray-600 py-2.5 rounded-xl text-sm transition-colors"
              >
                Kembali ke Daftar Mitra
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
