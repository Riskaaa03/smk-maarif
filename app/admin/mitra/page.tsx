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

export default function AdminMitra() {
  // State untuk form
  const [nama, setNama] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [deskripsiPanjang, setDeskripsiPanjang] = useState('')
  const [website, setWebsite] = useState('')
  const [kota, setKota] = useState('')
  const [status, setStatus] = useState('mou')
  const [urutan, setUrutan] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [fotoKerjasama, setFotoKerjasama] = useState<File | null>(null)
  const [fotoKerjasamaPreview, setFotoKerjasamaPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<MitraItem[]>([])
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // State untuk edit
  const [editingItem, setEditingItem] = useState<MitraItem | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  // Ambil data mitra
  const fetchMitra = async () => {
    try {
      const res = await fetch('/api/mitra')
      const data = await res.json()
      if (data.success) {
        setItems(data.items)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    fetchMitra()
  }, [])

  // Preview logo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  // Preview foto kerjasama
  const handleFotoKerjasamaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFotoKerjasama(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoKerjasamaPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  // Reset form
  const resetForm = () => {
    setNama('')
    setDeskripsi('')
    setDeskripsiPanjang('')
    setWebsite('')
    setKota('')
    setStatus('mou')
    setUrutan(0)
    setFile(null)
    setPreview('')
    setFotoKerjasama(null)
    setFotoKerjasamaPreview('')
    setEditingItem(null)
  }

  // Submit tambah mitra
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nama) {
      setMessage({ type: 'error', text: 'Nama mitra wajib diisi!' })
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('nama', nama)
    formData.append('deskripsi', deskripsi)
    formData.append('deskripsiPanjang', deskripsiPanjang)
    formData.append('website', website)
    formData.append('kota', kota)
    formData.append('status', status)
    formData.append('urutan', urutan.toString())
    if (file) {
      formData.append('file', file)
    }
    if (fotoKerjasama) {
      formData.append('fotoKerjasama', fotoKerjasama)
    }

    try {
      const res = await fetch('/api/mitra', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: '✅ Mitra berhasil ditambahkan!' })
        resetForm()
        fetchMitra()
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menambah mitra' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan server' })
    } finally {
      setLoading(false)
    }
  }

  // Submit update mitra
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return

    setLoading(true)
    const formData = new FormData()
    formData.append('id', editingItem.id.toString())
    formData.append('nama', nama)
    formData.append('deskripsi', deskripsi)
    formData.append('deskripsiPanjang', deskripsiPanjang)
    formData.append('website', website)
    formData.append('kota', kota)
    formData.append('status', status)
    formData.append('urutan', urutan.toString())
    
    if (editingItem.logoUrl) {
      formData.append('existingLogo', editingItem.logoUrl)
    }
    if (editingItem.fotoKerjasama) {
      formData.append('existingFotoKerjasama', editingItem.fotoKerjasama)
    }
    if (file) {
      formData.append('file', file)
    }
    if (fotoKerjasama) {
      formData.append('fotoKerjasama', fotoKerjasama)
    }

    try {
      const res = await fetch('/api/mitra', {
        method: 'PUT',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: '✅ Mitra berhasil diupdate!' })
        resetForm()
        setShowEditModal(false)
        fetchMitra()
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal mengupdate mitra' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan server' })
    } finally {
      setLoading(false)
    }
  }

  // Buka modal edit
  const openEditModal = (item: MitraItem) => {
    setEditingItem(item)
    setNama(item.nama)
    setDeskripsi(item.deskripsi || '')
    setDeskripsiPanjang(item.deskripsiPanjang || '')
    setWebsite(item.website || '')
    setKota(item.kota || '')
    setStatus(item.status)
    setUrutan(item.urutan)
    setFile(null)
    setPreview('')
    setFotoKerjasama(null)
    setFotoKerjasamaPreview(item.fotoKerjasama || '')
    setShowEditModal(true)
  }

  // Hapus mitra
  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus mitra ini?')) return

    try {
      const res = await fetch(`/api/mitra?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: '✅ Mitra berhasil dihapus!' })
        fetchMitra()
      } else {
        setMessage({ type: 'error', text: 'Gagal menghapus mitra' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan' })
    }
  }

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'mou') {
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-nu-green-100 text-nu-green-700">📄 MOU</span>
    } else if (status === 'pkl') {
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">🏭 PKL</span>
    } else {
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">📄 MOU + 🏭 PKL</span>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nu-green-600 to-nu-green-700 flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🏭</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Mitra Industri</h1>
                <p className="text-xs text-gray-500">Kelola perusahaan mitra sekolah</p>
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
          {/* Form Tambah Mitra */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-24 overflow-hidden">
              <div className="bg-gradient-to-r from-nu-green-600 to-nu-green-700 px-6 py-4">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tambah Mitra Baru
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Nama Perusahaan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Perusahaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-nu-green-600"
                    placeholder="Contoh: PT Astra Honda Motor"
                    required
                  />
                </div>

                {/* Deskripsi Singkat */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-nu-green-600"
                    rows={2}
                    placeholder="Contoh: Otomotif dan Sepeda Motor"
                  />
                  <p className="text-xs text-gray-400 mt-1">Tampil di card mitra</p>
                </div>

                {/* Deskripsi Panjang */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Lengkap
                  </label>
                  <textarea
                    value={deskripsiPanjang}
                    onChange={(e) => setDeskripsiPanjang(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-nu-green-600"
                    rows={4}
                    placeholder="Tulis deskripsi lengkap tentang mitra ini..."
                  />
                  <p className="text-xs text-gray-400 mt-1">Tampil di halaman detail mitra</p>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-nu-green-600"
                    placeholder="https://..."
                  />
                </div>

                {/* Kota */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kota Domisili
                  </label>
                  <input
                    type="text"
                    value={kota}
                    onChange={(e) => setKota(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-nu-green-600"
                    placeholder="Contoh: Jakarta, Banjarnegara, Purwokerto"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Kerjasama <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-nu-green-600"
                  >
                    <option value="mou">📄 MOU (Kerjasama Resmi)</option>
                    <option value="pkl">🏭 Tempat PKL</option>
                    <option value="keduanya">📄 MOU + 🏭 Tempat PKL</option>
                  </select>
                </div>

                {/* Urutan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    value={urutan}
                    onChange={(e) => setUrutan(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-nu-green-600"
                    placeholder="0, 1, 2, ..."
                  />
                  <p className="text-xs text-gray-400 mt-1">Semakin kecil angka, semakin atas tampilannya</p>
                </div>

                {/* Logo Perusahaan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Perusahaan
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-nu-green-600 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer block">
                      <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-600">Klik untuk upload logo</p>
                      <p className="text-xs text-gray-400">PNG, JPG, SVG (Max 2MB)</p>
                    </label>
                  </div>
                  
                  {preview && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Preview Logo:</p>
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden border bg-gray-50">
                        <Image src={preview} alt="Preview" fill className="object-contain p-2" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Foto Kerjasama */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Dokumentasi Kerjasama
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-nu-green-600 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFotoKerjasamaChange}
                      className="hidden"
                      id="foto-kerjasama-upload"
                    />
                    <label htmlFor="foto-kerjasama-upload" className="cursor-pointer block">
                      <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-600">Klik untuk upload foto kerjasama</p>
                      <p className="text-xs text-gray-400">PNG, JPG (Max 2MB)</p>
                    </label>
                  </div>
                  
                  {fotoKerjasamaPreview && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Preview Foto Kerjasama:</p>
                      <div className="relative h-32 w-full rounded-xl overflow-hidden border bg-gray-50">
                        <Image src={fotoKerjasamaPreview} alt="Preview" fill className="object-contain" />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-nu-green-600 to-nu-green-700 hover:from-nu-green-700 hover:to-nu-green-800 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : '+ Tambah Mitra'}
                </button>
              </form>
            </div>
          </div>

          {/* Daftar Mitra */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">Daftar Mitra Industri</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{items.length} mitra terdaftar</p>
                  </div>
                  <button onClick={fetchMitra} className="text-gray-400 hover:text-gray-600">
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
                    <p className="text-gray-500">Belum ada mitra industri</p>
                    <p className="text-sm text-gray-400 mt-1">Tambahkan mitra pertama Anda!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                        {/* Logo */}
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
                          {item.logoUrl ? (
                            <Image src={item.logoUrl} alt={item.nama} width={50} height={50} className="object-contain" />
                          ) : (
                            <span className="text-2xl">🏭</span>
                          )}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.nama}</h3>
                          {item.deskripsi && (
                            <p className="text-xs text-gray-500 mt-0.5">{item.deskripsi}</p>
                          )}
                          {item.kota && (
                            <p className="text-xs text-gray-400">📍 {item.kota}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <StatusBadge status={item.status} />
                            <span className="text-xs text-gray-400">Urutan: {item.urutan}</span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="text-blue-500 hover:text-blue-700 p-2 transition-colors"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-500 hover:text-red-700 p-2 transition-colors"
                            title="Hapus"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
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

      {/* Modal Edit */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-nu-green-600 to-nu-green-700 px-6 py-4 sticky top-0">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Mitra
              </h2>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Perusahaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nu-green-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nu-green-600"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Lengkap
                </label>
                <textarea
                  value={deskripsiPanjang}
                  onChange={(e) => setDeskripsiPanjang(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nu-green-600"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nu-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kota
                </label>
                <input
                  type="text"
                  value={kota}
                  onChange={(e) => setKota(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nu-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nu-green-600"
                >
                  <option value="mou">📄 MOU</option>
                  <option value="pkl">🏭 PKL</option>
                  <option value="keduanya">📄 MOU + 🏭 PKL</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urutan
                </label>
                <input
                  type="number"
                  value={urutan}
                  onChange={(e) => setUrutan(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nu-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo Baru (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
                {editingItem.logoUrl && !preview && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Logo saat ini:</p>
                    <div className="relative h-16 w-16">
                      <Image src={editingItem.logoUrl} alt="Logo" fill className="object-contain" />
                    </div>
                  </div>
                )}
                {preview && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Preview baru:</p>
                    <div className="relative h-16 w-16">
                      <Image src={preview} alt="Preview" fill className="object-contain" />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foto Kerjasama Baru (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoKerjasamaChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
                {editingItem.fotoKerjasama && !fotoKerjasamaPreview && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Foto kerjasama saat ini:</p>
                    <div className="relative h-32 w-full">
                      <Image src={editingItem.fotoKerjasama} alt="Foto Kerjasama" fill className="object-contain" />
                    </div>
                  </div>
                )}
                {fotoKerjasamaPreview && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Preview baru:</p>
                    <div className="relative h-32 w-full">
                      <Image src={fotoKerjasamaPreview} alt="Preview" fill className="object-contain" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-nu-green-600 hover:bg-nu-green-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
