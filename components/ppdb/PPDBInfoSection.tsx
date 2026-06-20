'use client'

import React from 'react'

const infoItems = [
  {
    icon: '🏫',
    label: 'Kuota Tersedia',
    value: '108 Siswa',
  },
  {
    icon: '📋',
    label: 'Biaya Pendaftaran',
    value: 'Gratis',
  },
  {
    icon: '📝',
    label: 'Seleksi',
    value: 'Nilai Rapor + Wawancara',
  },
]

export default function PPDBInfoSection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 my-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Informasi Umum PPDB</h2>
        <p className="text-sm text-gray-500 mt-1">Ringkasan kuota, biaya, dan jalur seleksi masuk sekolah</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {infoItems.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100/50 hover:shadow-md transition-all"
          >
            <div className="text-4xl bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm">
              {item.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{item.label}</p>
              <p className="text-base font-semibold text-gray-800 mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
