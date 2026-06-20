// app/admin/sarpras/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface FasilitasItem {
  id: number
  nama: string
  emoji: string
  deskripsi: string
  thumbnail: string | null
  urutan: number
  status: 'aktif' | 'nonaktif'
}

interface SaranaItem {
  id: number
  nama: string
  emoji: string
  deskripsi: string
  thumbnail: string | null
  urutan: number
  status: 'aktif' | 'nonaktif'
}

interface StatistikItem {
  id: number
  angka: string
  satuan: string
  emoji: string
  urutan: number
  status: 'aktif' | 'nonaktif'
}

type ActiveTab = 'fasilitas' | 'sarana' | 'statistik'

export default function AdminSarpras() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('fasilitas')
  const [fasilitas, setFasilitas] = useState<FasilitasItem[]>([])
  const [sarana, setSarana] = useState<SaranaItem[]>([])
  const [statistik, setStatistik] = useState<StatistikItem[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [formData, setFormData] = useState({
    nama: '',
    emoji: '',
    deskripsi: '',
    thumbnail: '',
    urutan: 0,
    status: 'aktif'
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [preview, setPreview] = useState('')
  const [loadingUpload, setLoadingUpload] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/sarpras')
      const result = await res.json()
      if (result.success) {
        setFasilitas(result.data.fasilitas || [])
        setSarana(result.data.sarana || [])
        setStatistik(result.data.statistik || [])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', text: 'Gagal memuat data' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)

    setLoadingUpload(true)
    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const res = await fetch('/api/sarpras', {
        method: 'POST',
        body: formData,
      })
      
      const result = await res.json()
      
      if (result.success) {
        setFormData(prev => ({ ...prev, thumbnail: result.imageUrl }))
        setMessage({ type: 'success', text: '✅ Gambar berhasil diupload!' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal upload gambar' })
        setPreview('')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setMessage({ type: 'error', text: 'Gagal upload gambar' })
      setPreview('')
    } finally {
      setLoadingUpload(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nama || !formData.deskripsi) {
      setMessage({ type: 'error', text: 'Nama dan deskripsi wajib diisi!' })
      return
    }

    const endpoint = editingId
      ? `/api/sarpras?id=${editingId}`
      : '/api/sarpras'
    const method = editingId ? 'PUT' : 'POST'

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipe: activeTab === 'fasilitas' ? 'fasilitas_utama' : 
                activeTab === 'sarana' ? 'sarana_pendukung' : 'statistik',
          ...formData
        }),
      })
      const result = await res.json()

      if (result.success) {
        setMessage({ type: 'success', text: `✅ Data berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}!` })
        resetForm()
        fetchData()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal menyimpan' })
      }
    } catch (error) {
      console.error('Submit error:', error)
      setMessage({ type: 'error', text: 'Terjadi kesalahan server' })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return

    try {
      const res = await fetch(`/api/sarpras?id=${id}&tipe=${
        activeTab === 'fasilitas' ? 'fasilitas_utama' :
        activeTab === 'sarana' ? 'sarana_pendukung' : 'statistik'
      }`, {
        method: 'DELETE',
      })
      const result = await res.json()

      if (result.success) {
        setMessage({ type: 'success', text: '✅ Data berhasil dihapus!' })
        fetchData()
      } else {
        setMessage({ type: 'error', text: 'Gagal menghapus' })
      }
    } catch (error) {
      console.error('Delete error:', error)
      setMessage({ type: 'error', text: 'Terjadi kesalahan' })
    }
  }

  const resetForm = () => {
    setFormData({
      nama: '',
      emoji: '',
      deskripsi: '',
      thumbnail: '',
      urutan: 0,
      status: 'aktif'
    })
    setEditingId(null)
    setPreview('')
    setMessage({ type: '', text: '' })
  }

  const handleEdit = (item: FasilitasItem | SaranaItem | StatistikItem) => {
    setEditingId(item.id)
    setFormData({
      nama: 'nama' in item ? item.nama : '',
      emoji: item.emoji || '',
      deskripsi: 'deskripsi' in item ? item.deskripsi : '',
      thumbnail: item.thumbnail || '',
      urutan: item.urutan || 0,
      status: item.status || 'aktif'
    })
    if (item.thumbnail) setPreview(item.thumbnail)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getLabel = () => {
    switch (activeTab) {
      case 'fasilitas': return 'Fasilitas Utama'
      case 'sarana': return 'Sarana Pendukung'
      case 'statistik': return 'Statistik'
      default: return ''
    }
  }

  const getNamaPlaceholder = () => {
    switch (activeTab) {
      case 'fasilitas': return 'Contoh: Ruang Kelas'
      case 'sarana': return 'Contoh: Mushola'
      case 'statistik': return 'Contoh: 40'
      default: return ''
    }
  }

  const renderList = () => {
    const items = activeTab === 'fasilitas' ? fasilitas :
                  activeTab === 'sarana' ? sarana : statistik

    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-nu-green-600 border-t-transparent"></div>
          <p className="text-gray-500 mt-2">Memuat data...</p>
        </div>
      )
    }

    if (items.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4 opacity-30">
            {activeTab === 'fasilitas' ? '🏫' : activeTab === 'sarana' ? '🔧' : '📊'}
          </div>
          <p>Belum ada data</p>
          <p className="text-sm text-gray-400 mt-1">Tambahkan data baru!</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">{item.emoji || '📌'}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">
                  {'nama' in item ? item.nama : `${item.angka} ${item.satuan}`}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {'deskripsi' in item ? item.deskripsi : ''}
                </p>
                <div className="flex gap-3 mt-1 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.status === 'aktif' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {item.status}
                  </span>
                  <span className="text-xs text-gray-400">Urutan: {item.urutan}</span>
                  {item.thumbnail && (
                    <span className="text-xs text-gray-400">📷 Ada gambar</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nu-green-600 to-nu-green-700 flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🏗️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Sarana & Prasarana</h1>
                <p className="text-xs text-gray-500">Kelola fasilitas sekolah</p>
              </div>
            </div>
            <Link
              href="/sarana-prasarana"
              target="_blank"
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Lihat Halaman
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {message.text && (
          <div
            className={`mb-6 rounded-xl p-4 flex items-center justify-between shadow-md ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === 'success' ? '✅' : '❌'}
              <span>{message.text}</span>
            </div>
            <button
              onClick={() => setMessage({ type: '', text: '' })}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: 'fasilitas', label: '🏫 Fasilitas Utama' },
            { id: 'sarana', label: '🔧 Sarana Pendukung' },
            { id: 'statistik', label: '📊 Statistik' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as ActiveTab)
                resetForm()
              }}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-nu-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-24 overflow-hidden">
              <div className="bg-gradient-to-r from-nu-green-600 to-nu-green-700 px-6 py-4">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {editingId ? 'Edit Data' : `Tambah ${getLabel()}`}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {activeTab === 'statistik' ? 'Angka' : 'Nama'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-nu-green-600 focus:border-transparent transition-all"
                    placeholder={getNamaPlaceholder()}
                    required
                  />
                </div>

                {activeTab !== 'statistik' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Emoji
                      </label>
                      <input
                        type="text"
                        value={formData.emoji}
                        onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-nu-green-600 focus:border-transparent transition-all"
                        placeholder="Contoh: 🏫"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Deskripsi <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.deskripsi}
                        onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-nu-green-600 focus:border-transparent transition-all"
                        rows={3}
                        placeholder="Deskripsi fasilitas..."
                        required
                      />
                    </div>
                  </>
                )}

                {activeTab === 'statistik' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Satuan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.deskripsi}
                        onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-nu-green-600 focus:border-transparent transition-all"
                        placeholder="Contoh: Unit Komputer"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Emoji
                      </label>
                      <input
                        type="text"
                        value={formData.emoji}
                        onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-nu-green-600 focus:border-transparent transition-all"
                        placeholder="Contoh: 💻"
                      />
                    </div>
                  </>
                )}

                {activeTab !== 'statistik' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Gambar
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-nu-green-600 transition-all cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer block">
                        <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-600">Klik untuk pilih gambar</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP (Max 5MB)</p>
                      </label>
                    </div>
                    
                    {loadingUpload && (
                      <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                        <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-nu-green-600 border-t-transparent"></div>
                        Mengupload...
                      </div>
                    )}

                    {preview && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-1">Preview:</p>
                        <div className="relative h-32 w-full rounded-lg overflow-hidden border shadow-sm">
                          <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="object-contain bg-gray-100"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Urutan
                  </label>
                  <input
                    type="number"
                    value={formData.urutan}
                    onChange={(e) => setFormData({ ...formData, urutan: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-nu-green-600 focus:border-transparent transition-all"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-nu-green-600 focus:border-transparent transition-all bg-white"
                  >
                    <option value="aktif">✅ Aktif</option>
                    <option value="nonaktif">❌ Nonaktif</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-nu-green-600 to-nu-green-700 hover:from-nu-green-700 hover:to-nu-green-800 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {editingId ? '✏️ Update' : '➕ Tambah'}
                  </button>
                  {(editingId || formData.nama || formData.deskripsi || preview) && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">Daftar {getLabel()}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {(activeTab === 'fasilitas' ? fasilitas : activeTab === 'sarana' ? sarana : statistik).length} data
                  </p>
                </div>
                <button
                  onClick={fetchData}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Refresh"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                {renderList()}
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="text-xl">💡</div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Tips Mengelola Sarana & Prasarana</h4>
                  <ul className="text-xs text-gray-600 mt-1 space-y-1">
                    <li>• Gunakan emoji yang mewakili fasilitas untuk tampilan yang menarik</li>
                    <li>• Urutan menentukan posisi tampilan di halaman depan</li>
                    <li>• Status "Nonaktif" menyembunyikan data dari tampilan publik</li>
                    <li>• Upload gambar dengan resolusi baik untuk hasil optimal</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}