// MitraIndustriSection.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function MitraIndustriSection() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/mitra')
      .then(res => res.json())
      .then(data => { if (data.success) setItems(data.items.slice(0, 5)); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <section className="bg-[#f8f8f6] py-20">
      <div className="container mx-auto px-6 md:px-10 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1a5c3a] border-t-transparent"></div>
      </div>
    </section>
  )
  
  if (!items.length) return null

  return (
    <section className="bg-[#f8f8f6] py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-10">
        {/* Header dengan gaya konsisten */}
        <div className="max-w-5xl mx-auto mb-14 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="h-px w-6 bg-[#1a5c3a]" />
            <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">
              Kolaborasi Industri
            </span>
            <div className="h-px w-6 bg-[#1a5c3a]" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-3">
            Mitra Industri
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Perusahaan mitra yang mendukung pengembangan kompetensi siswa
          </p>
        </div>

        {/* Grid mitra */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {items.map((item: any) => (
              <div 
                key={item.id} 
                className="group bg-white rounded-xl p-4 hover:shadow-lg transition-all duration-300 text-center hover:-translate-y-1 border border-gray-100 hover:border-[#1a5c3a]/30"
              >
                {item.logoUrl ? (
                  <div className="relative h-16 w-full mb-3">
                    <Image src={item.logoUrl} alt={item.nama} fill className="object-contain" />
                  </div>
                ) : (
                  <div className="text-3xl mb-3">🏭</div>
                )}
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 group-hover:text-[#1a5c3a] transition-colors">
                  {item.nama}
                </h3>
              </div>
            ))}
          </div>

          {/* Link lihat semua */}
          <div className="text-center mt-10">
            <Link 
              href="/humas" 
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#1a5c3a] hover:gap-3 transition-all duration-200"
            >
              Lihat Semua Mitra
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}