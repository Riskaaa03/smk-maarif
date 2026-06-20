'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface PPDBItem {
  id: number
  nomor_pendaftaran: string
  nama_siswa: string
  jurusan: string
  nik: string
  nisn: string
  tempat_lahir: string
  tanggal_lahir: string
  asal_sekolah: string
  alamat_siswa: string
  nomor_wa: string
  email: string
  jenis_kelamin: string
  agama: string
  memiliki_kip: string
  nama_kip: string | null
  nomor_kip: string | null
  direkomendasikan_oleh: string | null
  nama_orang_tua: string
  pekerjaan_orang_tua: string
  status: string
  created_at: string
}

export default function AdminPPDBPage() {
  const [items, setItems] = useState<PPDBItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<PPDBItem | null>(null)
  const [showModal, setShowModal] = useState(false)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/ppdb')
      const data = await res.json()
      if (data.success) {
        setItems(data.items)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch('/api/ppdb', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      })
      const data = await res.json()
      if (data.success) {
        fetchData()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteItem = async (id: number) => {
    if (!confirm('Yakin ingin menghapus data pendaftaran ini?')) return
    try {
      const res = await fetch(`/api/ppdb?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        fetchData()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const openDetail = (item: PPDBItem) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  const getStatusBadge = (status: string) => {
    if (status === 'pending') {
      return (
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            ⏳ Menunggu
          </span>
        </div>
      )
    } else if (status === 'approved') {
      return (
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            ✓ Diterima
          </span>
        </div>
      )
    } else if (status === 'rejected') {
      return (
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-rose-500"></div>
          <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            ✗ Ditolak
          </span>
        </div>
      )
    }
    return (
      <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
        {status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-3 text-sm text-slate-500">Memuat data pendaftar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Manajemen PPDB</h1>
                <p className="text-xs text-slate-400">Kelola data pendaftar peserta didik baru</p>
              </div>
            </div>
            <Link href="/" className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all duration-200 hover:shadow-sm">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistik Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Pendaftar</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{items.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Menunggu</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{items.filter(i => i.status === 'pending').length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Diterima</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{items.filter(i => i.status === 'approved').length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Ditolak</p>
                <p className="text-2xl font-bold text-rose-600 mt-1">{items.filter(i => i.status === 'rejected').length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Pendaftar */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-5 border-b border-slate-100">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-semibold text-slate-800 text-lg">Daftar Pendaftar</h2>
                <p className="text-xs text-slate-400 mt-0.5">Semua data pendaftar PPDB 2026/2027</p>
              </div>
              <button 
                onClick={fetchData} 
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-12">No</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nomor Pendaftaran</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Siswa</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Jurusan</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Asal Sekolah</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">WhatsApp</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="px-5 py-3 text-slate-400 font-mono text-xs">{idx + 1}</td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        {item.nomor_pendaftaran}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-700">{item.nama_siswa}</td>
                    <td className="px-5 py-3 text-slate-600">
                      <span className="text-xs">
                        {item.jurusan === 'TEKNIK KOMPUTER JARINGAN' && '💻 TKJ'}
                        {item.jurusan === 'AKUNTANSI DAN KEUANGAN LEMBAGA' && '📊 AKL'}
                        {item.jurusan === 'TEKNIK SEPEDA MOTOR' && '🔧 TSM'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 max-w-[180px] truncate" title={item.asal_sekolah}>
                      {item.asal_sekolah}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{item.nomor_wa}</td>
                    <td className="px-5 py-3">
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className={`text-xs rounded-lg px-2 py-1.5 border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer ${
                          item.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                          item.status === 'approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                          'bg-rose-50 border-rose-200 text-rose-700'
                        }`}
                      >
                        <option value="pending" className="text-amber-700">⏳ Pending</option>
                        <option value="approved" className="text-emerald-700">✓ Approved</option>
                        <option value="rejected" className="text-rose-700">✗ Rejected</option>
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetail(item)}
                          className="text-slate-500 hover:text-emerald-600 transition-colors p-1.5 rounded-lg hover:bg-emerald-50"
                          title="Detail"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-rose-50"
                          title="Hapus"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {items.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">Belum ada pendaftar</p>
              <p className="text-xs text-slate-400 mt-1">Data pendaftar akan muncul di sini</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Detail */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5 sticky top-0 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-lg">Detail Pendaftar</h2>
                    <p className="text-white/60 text-xs">Informasi lengkap pendaftar PPDB</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white transition-colors text-2xl leading-none">
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Nomor Pendaftaran</p>
                    <p className="text-base font-bold text-emerald-800 font-mono mt-1">{selectedItem.nomor_pendaftaran}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                  </div>
                </div>
              </div>

              {/* Data Pribadi */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-slate-700">Data Pribadi</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-10">
                  <div className="border-b border-slate-100 pb-2">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Nama Lengkap</p>
                    <p className="text-sm font-medium text-slate-700">{selectedItem.nama_siswa}</p>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Jurusan</p>
                    <p className="text-sm text-slate-600">{selectedItem.jurusan}</p>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">NIK</p>
                    <p className="text-sm font-mono text-slate-600">{selectedItem.nik}</p>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">NISN</p>
                    <p className="text-sm font-mono text-slate-600">{selectedItem.nisn}</p>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Tempat, Tanggal Lahir</p>
                    <p className="text-sm text-slate-600">{selectedItem.tempat_lahir}, {new Date(selectedItem.tanggal_lahir).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Jenis Kelamin & Agama</p>
                    <p className="text-sm text-slate-600">{selectedItem.jenis_kelamin} • {selectedItem.agama}</p>
                  </div>
                </div>
              </div>

              {/* Alamat & Sekolah */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-600 text-xs font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-slate-700">Alamat & Sekolah</h3>
                </div>
                <div className="space-y-3 pl-10">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Asal Sekolah</p>
                    <p className="text-sm text-slate-600">{selectedItem.asal_sekolah}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Alamat Lengkap</p>
                    <p className="text-sm text-slate-600 whitespace-pre-line">{selectedItem.alamat_siswa}</p>
                  </div>
                </div>
              </div>

              {/* Kontak */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 text-xs font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-slate-700">Kontak</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-10">
                  <div className="border-b border-slate-100 pb-2">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">WhatsApp</p>
                    <p className="text-sm text-slate-600">{selectedItem.nomor_wa}</p>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Email</p>
                    <p className="text-sm text-slate-600 break-all">{selectedItem.email}</p>
                  </div>
                </div>
              </div>

              {/* Data KIP */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-600 text-xs font-bold">4</span>
                  </div>
                  <h3 className="font-semibold text-slate-700">Kartu Indonesia Pintar (KIP)</h3>
                </div>
                <div className="pl-10 space-y-3">
                  <div className={`rounded-lg p-3 ${selectedItem.memiliki_kip === 'YA' ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Memiliki KIP</p>
                    <p className="text-sm font-medium text-slate-700">{selectedItem.memiliki_kip}</p>
                  </div>
                  {selectedItem.memiliki_kip === 'YA' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="border-b border-slate-100 pb-2">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Nama di KIP</p>
                        <p className="text-sm text-slate-600">{selectedItem.nama_kip || '-'}</p>
                      </div>
                      <div className="border-b border-slate-100 pb-2">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Nomor KIP</p>
                        <p className="text-sm text-slate-600">{selectedItem.nomor_kip || '-'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Orang Tua */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center">
                    <span className="text-pink-600 text-xs font-bold">5</span>
                  </div>
                  <h3 className="font-semibold text-slate-700">Orang Tua / Wali</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-10">
                  <div className="border-b border-slate-100 pb-2">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Nama</p>
                    <p className="text-sm text-slate-600">{selectedItem.nama_orang_tua}</p>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Pekerjaan</p>
                    <p className="text-sm text-slate-600">{selectedItem.pekerjaan_orang_tua}</p>
                  </div>
                </div>
              </div>

              {/* Info Tambahan */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                    <span className="text-slate-500 text-xs font-bold">6</span>
                  </div>
                  <h3 className="font-semibold text-slate-700">Informasi Tambahan</h3>
                </div>
                <div className="pl-10 space-y-3">
                  <div className="border-b border-slate-100 pb-2">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Direkomendasikan oleh</p>
                    <p className="text-sm text-slate-600">{selectedItem.direkomendasikan_oleh || '-'}</p>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Tanggal Pendaftaran</p>
                    <p className="text-sm text-slate-600">{new Date(selectedItem.created_at).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 p-5 bg-slate-50 rounded-b-2xl">
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}