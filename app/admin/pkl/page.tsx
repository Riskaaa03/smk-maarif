'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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
  created_at: string
}

export default function AdminTempatPKLPage() {
  const [items, setItems] = useState<TempatPKL[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nama_perusahaan: '',
    bidang: '',
    kota: '',
    alamat: '',
    kontak: '',
    kuota: 0,
    status: 'aktif',
    urutan: 0,
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  const fetchData = async () => {
    try {
      const res = await fetch('/api/pkl')
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      nama_perusahaan: '',
      bidang: '',
      kota: '',
      alamat: '',
      kontak: '',
      kuota: 0,
      status: 'aktif',
      urutan: 0,
    })
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    try {
      const url = '/api/pkl'
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId ? { id: editingId, ...formData } : formData

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: editingId ? '✅ Data berhasil diupdate!' : '✅ Data berhasil ditambahkan!' })
        resetForm()
        fetchData()
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menyimpan data' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan server' })
    }
  }

  const handleEdit = (item: TempatPKL) => {
    setEditingId(item.id)
    setFormData({
      nama_perusahaan: item.nama_perusahaan,
      bidang: item.bidang,
      kota: item.kota,
      alamat: item.alamat || '',
      kontak: item.kontak || '',
      kuota: item.kuota,
      status: item.status,
      urutan: item.urutan,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return

    try {
      const res = await fetch(`/api/pkl?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'success', text: '✅ Data berhasil dihapus!' })
        fetchData()
      } else {
        setMessage({ type: 'error', text: 'Gagal menghapus data' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan' })
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === 'aktif') {
      return <span className="inline-flex px-2 py-1 text-xs rounded-full bg-nu-green-100 text-nu-green-700">✓ Aktif</span>
    }
    return <span className="inline-flex px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">✗ Tidak Aktif</span>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-nu-green-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-500">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🏭</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Tempat PKL</h1>
                <p className="text-xs text-gray-500">Kelola data tempat Praktik Kerja Lapangan</p>
              </div>
            </div>
            <Link href="/" className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Notifikasi */}
        {message.text && (
          <div className={`mb-6 rounded-xl p-4 flex items-center justify-between shadow-md ${
            message.type === 'success' 
              ? 'bg-nu-green-50 text-nu-green-700 border border-nu-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <span>{message.text}</span>
            <button onClick={() => setMessage({ type: '', text: '' })}>✕</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Tambah/Edit */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-24 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {editingId ? 'Edit Tempat PKL' : 'Tambah Tempat PKL Baru'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Perusahaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_perusahaan"
                    value={formData.nama_perusahaan}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: PT Astra Honda Motor"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bidang <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bidang"
                    value={formData.bidang}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: Teknik Sepeda Motor"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kota <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="kota"
                    value={formData.kota}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: Banjarnegara"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Alamat lengkap perusahaan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kontak (Telp/Email)
                  </label>
                  <input
                    type="text"
                    name="kontak"
                    value={formData.kontak}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: (0286) 123456"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kuota PKL
                    </label>
                    <input
                      type="number"
                      name="kuota"
                      value={formData.kuota}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urutan
                    </label>
                    <input
                      type="number"
                      name="urutan"
                      value={formData.urutan}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                    <p className="text-xs text-gray-400 mt-1">Semakin kecil angka, semakin atas tampilannya</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="aktif">✓ Aktif</option>
                    <option value="nonaktif">✗ Tidak Aktif</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md"
                  >
                    {editingId ? 'Simpan Perubahan' : '+ Tambah Data'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Daftar Tempat PKL */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">Daftar Tempat PKL</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{items.length} tempat PKL terdaftar</p>
                  </div>
                  <button onClick={fetchData} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 opacity-30">🏭</div>
                    <p className="text-gray-500">Belum ada data tempat PKL</p>
                    <p className="text-sm text-gray-400 mt-1">Tambahkan data pertama Anda!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{item.nama_perusahaan}</h3>
                              {getStatusBadge(item.status)}
                            </div>
                            <p className="text-sm text-gray-600">🔧 {item.bidang}</p>
                            <p className="text-xs text-gray-500 mt-1">📍 {item.kota}</p>
                            {item.alamat && (
                              <p className="text-xs text-gray-400 mt-1 line-clamp-1">{item.alamat}</p>
                            )}
                            {item.kontak && (
                              <p className="text-xs text-gray-400 mt-1">📞 {item.kontak}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs text-gray-400">Kuota: {item.kuota} siswa</span>
                              <span className="text-xs text-gray-400">Urutan: {item.urutan}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-500 hover:text-blue-700 p-1 transition-colors"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-500 hover:text-red-700 p-1 transition-colors"
                              title="Hapus"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
