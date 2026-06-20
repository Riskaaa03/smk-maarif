'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface MitraItem {
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

interface TempatPKL {
  id: number
  nama_perusahaan: string
  bidang: string
  kota: string
  alamat: string
  kontak: string
  kuota: number
  status: string
  urutan: number
}

interface AlumniItem {
  id: number
  nama: string
  angkatan: number
  program_keahlian: string
  tempat_kerja: string
  posisi: string
  foto_url: string | null
  testimonial: string
  status: string
  urutan: number
}

const OrnamenDivider = () => (
  <div className="flex items-center justify-center gap-4 opacity-25 my-2">
    <div className="h-px flex-1 bg-[#1a5c3a]" />
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5L10 2Z" fill="#1a5c3a" />
    </svg>
    <div className="h-px flex-1 bg-[#1a5c3a]" />
  </div>
)

export default function HumasPage() {
  const [mitraItems, setMitraItems] = useState<MitraItem[]>([])
  const [tempatPKL, setTempatPKL] = useState<TempatPKL[]>([])
  const [alumniItems, setAlumniItems] = useState<AlumniItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/mitra')
      .then(res => res.json())
      .then(data => { if (data.success) setMitraItems(data.items) })
      .catch(() => setMitraItems([]))
  }, [])

  useEffect(() => {
    fetch('/api/pkl')
      .then(res => res.json())
      .then(data => { if (data.success) setTempatPKL(data.items) })
      .catch(() => setTempatPKL([]))
  }, [])

  useEffect(() => {
    fetch('/api/alumni')
      .then(res => res.json())
      .then(data => { if (data.success) setAlumniItems(data.items) })
      .catch(() => setAlumniItems([]))
      .finally(() => setLoading(false))
  }, [])

  const totalMitra = mitraItems.length
  const totalMOU = mitraItems.filter(m => m.status === 'mou' || m.status === 'keduanya').length
  const totalPKL = tempatPKL.length

  // Warna hijau untuk semua mitra
  const aksenHijau = {
    aksen: '#1a5c3a',
    aksenLight: '#f0f9f4'
  }

  return (
    <main className="bg-[#f8f8f6] font-sans">

      {/* ── Hero ── */}
      <div className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/program/foto_semua_prodi.png"
            alt="Humas SMK Ma'arif NU 01 Karangkobar"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e1a] via-[#0d2e1a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d2e1a]/40 to-transparent" />
        </div>

        {/* Ornamen geometris */}
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
              <span className="text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase">Hubungan Masyarakat</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-[1.05] max-w-2xl mb-4">
              Humas &<br />
              <span className="text-[#d4af37]">Kemitraan</span>
            </h1>
            <p className="text-white/60 text-base md:text-lg mt-3 mb-8 max-w-xl">
              Membangun kemitraan industri yang kuat untuk masa depan siswa SMK Ma'arif NU 01 Karangkobar.
            </p>
            <a
              href="#mitra"
              className="group inline-flex items-center gap-2.5 bg-[#d4af37] hover:bg-[#c4a02e] text-[#0d2e1a] font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200"
            >
              Lihat Mitra Kami
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
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
      <div className="container mx-auto px-6 md:px-10 py-16 md:py-24 space-y-24 md:space-y-32">

        {/* ── Statistik ── */}
        <section>
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Mitra Industri', value: loading ? '—' : totalMitra, sub: 'perusahaan & instansi' },
              { label: 'MOU Aktif', value: loading ? '—' : totalMOU, sub: 'nota kesepahaman' },
              { label: 'Tempat PKL', value: loading ? '—' : totalPKL, sub: 'lokasi praktek' },
              { label: 'Alumni Bekerja', value: loading ? '—' : `${alumniItems.length}+`, sub: 'di dunia industri' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                <p className="font-serif text-3xl font-bold text-[#0d2e1a]">{stat.value}</p>
                <p className="text-[#1a5c3a] text-xs font-semibold tracking-wide uppercase mt-1">{stat.label}</p>
                <p className="text-gray-400 text-[11px] mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </section>

        <OrnamenDivider />

        {/* ── Mitra Industri ── */}
        {(loading || mitraItems.length > 0) && (
          <section id="mitra" aria-labelledby="mitra-heading">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="h-px w-6 bg-[#1a5c3a]" />
                <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">Jaringan Industri</span>
              </div>
              <h2 id="mitra-heading" className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-3">
                Mitra Industri
              </h2>
              <p className="text-gray-500 text-sm mb-10 max-w-2xl leading-relaxed">
                SMK Ma&apos;arif NU 01 Karangkobar menjalin kerja sama dengan berbagai perusahaan dan
                instansi untuk mendukung pengembangan kompetensi siswa dan penyerapan lulusan.
              </p>

              {loading ? (
                <div className="flex items-center gap-3 py-10">
                  <div className="w-6 h-6 rounded-full border-2 border-[#1a5c3a] border-t-transparent animate-spin" />
                  <p className="text-sm text-gray-400">Memuat data mitra...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {mitraItems.map((item, index) => (
                    <Link
                      key={item.id}
                      href={`/humas/mitra/detail?id=${item.id}`}
                      className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      {/* Garis aksen hijau di atas */}
                      <div
                        className="absolute top-0 left-0 right-0 h-0.5"
                        style={{ backgroundColor: aksenHijau.aksen }}
                      />

                      <div className="p-4 flex flex-col flex-1">
                        {/* Logo + nomor */}
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: aksenHijau.aksenLight }}
                          >
                            {item.logoUrl ? (
                              <img
                                src={item.logoUrl}
                                alt={item.nama}
                                className="w-8 h-8 object-contain"
                              />
                            ) : (
                              <span className="font-serif text-lg font-bold" style={{ color: aksenHijau.aksen }}>
                                {item.nama.charAt(0)}
                              </span>
                            )}
                          </div>
                          <span className="font-serif text-2xl font-bold leading-none select-none text-gray-100">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>

                        <h3 className="font-serif text-sm font-bold text-[#111827] leading-snug mb-1 line-clamp-2">
                          {item.nama}
                        </h3>
                        
                        {item.kota && (
                          <p className="text-xs text-gray-400 mb-1">
                            {item.kota}
                          </p>
                        )}

                        <p className="text-xs text-gray-400 leading-relaxed flex-1 line-clamp-2">
                          {item.deskripsi || 'Mitra Industri'}
                        </p>

                        {/* Status badges - tanpa background */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          <div
                            className="w-3 h-0.5 rounded-full transition-all duration-300 group-hover:w-6"
                            style={{ backgroundColor: aksenHijau.aksen }}
                          />
                          <div className="flex flex-wrap gap-2 ml-auto">
                            {(item.status === 'mou' || item.status === 'keduanya') && (
                              <span className="text-[10px] font-medium text-[#1a5c3a]">
                                MOU
                              </span>
                            )}
                            {(item.status === 'pkl' || item.status === 'keduanya') && (
                              <span className="text-[10px] font-medium text-[#1a5c3a]">
                                PKL
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <OrnamenDivider />

        {/* ── Tempat PKL ── */}
        <section id="pkl" aria-labelledby="pkl-heading">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-px w-6 bg-[#1a5c3a]" />
              <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">Praktek Kerja</span>
            </div>
            <h2 id="pkl-heading" className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-3">
              Tempat PKL
            </h2>
            <p className="text-gray-500 text-sm mb-10 max-w-2xl leading-relaxed">
              PKL adalah program wajib bagi siswa SMK untuk mendapatkan pengalaman kerja nyata di dunia industri.
            </p>

            {loading ? (
              <div className="flex items-center gap-3 py-10">
                <div className="w-6 h-6 rounded-full border-2 border-[#1a5c3a] border-t-transparent animate-spin" />
                <p className="text-sm text-gray-400">Memuat data PKL...</p>
              </div>
            ) : tempatPKL.length === 0 ? (
              <div className="text-center py-14 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 text-sm">Belum ada data tempat PKL</p>
                <p className="text-xs text-gray-400 mt-1">Data akan segera ditambahkan</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tempatPKL.map((tempat, idx) => (
                  <article
                    key={tempat.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-[#1a5c3a]/30 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-[#0d2e1a] flex items-center justify-center text-[#d4af37] font-mono text-xs font-bold flex-shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <h3 className="font-semibold text-[#111827] text-sm leading-snug pt-1">
                        {tempat.nama_perusahaan}
                      </h3>
                    </div>
                    <div className="space-y-1.5 border-t border-gray-50 pt-3">
                      <p className="text-xs text-gray-600">🏢 {tempat.bidang}</p>
                      <p className="text-xs text-gray-500">📍 {tempat.kota}</p>
                      {tempat.kuota > 0 && (
                        <p className="text-xs text-gray-400">👥 Kuota: {tempat.kuota} siswa</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <OrnamenDivider />

        {/* ── Alumni ── */}
        <section id="alumni" aria-labelledby="alumni-heading">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-px w-6 bg-[#1a5c3a]" />
              <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">Jejak Lulusan</span>
            </div>
            <h2 id="alumni-heading" className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-3">
              Alumni di Dunia Industri
            </h2>
            <p className="text-gray-500 text-sm mb-10 max-w-2xl leading-relaxed">
              Lulusan SMK Ma&apos;arif NU 01 Karangkobar telah berhasil memasuki dunia kerja di berbagai perusahaan.
            </p>

            {loading ? (
              <div className="flex items-center gap-3 py-10">
                <div className="w-6 h-6 rounded-full border-2 border-[#1a5c3a] border-t-transparent animate-spin" />
                <p className="text-sm text-gray-400">Memuat data alumni...</p>
              </div>
            ) : alumniItems.length === 0 ? (
              <div className="text-center py-14 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 text-sm">Belum ada data alumni</p>
                <p className="text-xs text-gray-400 mt-1">Data alumni akan segera ditambahkan</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {alumniItems.map((alumni) => (
                  <article
                    key={alumni.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-[#1a5c3a]/30 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      {alumni.foto_url ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                          <Image
                            src={alumni.foto_url}
                            alt={alumni.nama}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#0d2e1a] flex items-center justify-center text-[#d4af37] font-serif font-bold text-lg flex-shrink-0">
                          {alumni.nama.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#111827] text-sm">{alumni.nama}</h3>
                        <p className="text-xs text-[#1a5c3a] font-medium mt-0.5">{alumni.posisi || 'Alumni'}</p>
                        <p className="text-xs text-gray-400 truncate">{alumni.tempat_kerja || 'Tempat kerja belum diisi'}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#f0f9f4] text-[#1a5c3a] border border-[#1a5c3a]/15">
                        {alumni.program_keahlian}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-50 text-gray-500 border border-gray-100">
                        Angkatan {alumni.angkatan}
                      </span>
                    </div>

                    {alumni.testimonial && (
                      <blockquote className="border-l-2 border-[#1a5c3a]/20 pl-3">
                        <p className="text-xs text-gray-500 italic leading-relaxed">"{alumni.testimonial}"</p>
                      </blockquote>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        <section>
          <div className="max-w-5xl mx-auto">
            <div className="bg-[#0d2e1a] rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-64 h-64 rounded-full border border-white -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full border border-white translate-x-1/4 translate-y-1/4" />
              </div>
              <div className="relative">
                <p className="text-[#d4af37] text-xs font-semibold tracking-[0.18em] uppercase mb-3">Bergabung Bersama Kami</p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
                  Tertarik Bermitra?
                </h2>
                <p className="text-white/50 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                  Kami terbuka untuk kerja sama dengan perusahaan dan instansi yang ingin berkontribusi
                  dalam pengembangan pendidikan kejuruan.
                </p>
                <Link
                  href="/profil#kontak"
                  className="inline-flex items-center gap-2.5 bg-[#d4af37] hover:bg-[#c4a02e] text-[#0d2e1a] font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200"
                >
                  Hubungi Kami
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}