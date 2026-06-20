'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface BeritaItem {
  id: number
  judul: string
  slug: string
  ringkasan: string
  konten: string
  kategori: string
  thumbnail_url: string | null
  penulis: string
  status: string
  views: number
  tanggal_publikasi: string
}

const KATEGORI_OPTIONS = [
  { value: 'berita', label: '📰 Berita' },
  { value: 'pengumuman', label: '📢 Pengumuman' },
  { value: 'prestasi', label: '🏆 Prestasi' },
  { value: 'kegiatan', label: '📅 Kegiatan' },
]

export default function AdminBerita() {
  // Form state
  const [judul, setJudul] = useState('')
  const [ringkasan, setRingkasan] = useState('')
  const [konten, setKonten] = useState('')
  const [kategori, setKategori] = useState('berita')
  const [penulis, setPenulis] = useState('Admin')
  const [status, setStatus] = useState('draft')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<BeritaItem[]>([])
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // Edit state
  const [editingItem, setEditingItem] = useState<BeritaItem | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  // Fetch berita
  const fetchBerita = async () => {
    try {
      const res = await fetch('/api/berita')
      const data = await res.json()
      if (data.success) {
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    fetchBerita()
  }, [])

  // Preview gambar
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

  // Reset form
  const resetForm = () => {
    setJudul('')
    setRingkasan('')
    setKonten('')
    setKategori('berita')
    setPenulis('Admin')
    setStatus('draft')
    setFile(null)
    setPreview('')
    setEditingItem(null)
  }

  // Submit tambah berita
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!judul) {
      setMessage({ type: 'error', text: 'Judul berita wajib diisi!' })
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('judul', judul)
    formData.append('ringkasan', ringkasan)
    formData.append('konten', konten)
    formData.append('kategori', kategori)
    formData.append('penulis', penulis)
    formData.append('status', status)
    if (file) {
      formData.append('file', file)
    }

    try {
      const res = await fetch('/api/berita', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: '✅ Berita berhasil ditambahkan!' })
        resetForm()
        fetchBerita()
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menambah berita' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan server' })
    } finally {
      setLoading(false)
    }
  }

  // Submit update berita
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return

    setLoading(true)
    const formData = new FormData()
    formData.append('id', editingItem.id.toString())
    formData.append('judul', judul)
    formData.append('ringkasan', ringkasan)
    formData.append('konten', konten)
    formData.append('kategori', kategori)
    formData.append('penulis', penulis)
    formData.append('status', status)
    if (editingItem.thumbnail_url) {
      formData.append('existingThumbnail', editingItem.thumbnail_url)
    }
    if (file) {
      formData.append('file', file)
    }

    try {
      const res = await fetch('/api/berita', {
        method: 'PUT',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: '✅ Berita berhasil diupdate!' })
        resetForm()
        setShowEditModal(false)
        fetchBerita()
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal mengupdate berita' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan server' })
    } finally {
      setLoading(false)
    }
  }

  // Buka modal edit
  const openEditModal = (item: BeritaItem) => {
    setEditingItem(item)
    setJudul(item.judul)
    setRingkasan(item.ringkasan || '')
    setKonten(item.konten || '')
    setKategori(item.kategori)
    setPenulis(item.penulis || 'Admin')
    setStatus(item.status)
    setFile(null)
    setPreview('')
    setShowEditModal(true)
  }

  // Hapus berita
  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus berita ini?')) return

    try {
      const res = await fetch(`/api/berita?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: '✅ Berita berhasil dihapus!' })
        fetchBerita()
      } else {
        setMessage({ type: 'error', text: 'Gagal menghapus berita' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan' })
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === 'published') {
      return <span className="bg-nu-green-100 text-nu-green-700 px-2 py-0.5 rounded-full text-xs">✓ Published</span>
    }
    return <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">📝 Draft</span>
  }

  const getKategoriBadge = (kategori: string) => {
    switch (kategori) {
      case 'berita': return 'bg-blue-100 text-blue-700'
      case 'pengumuman': return 'bg-yellow-100 text-yellow-700'
      case 'prestasi': return 'bg-nu-green-100 text-nu-green-700'
      case 'kegiatan': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">📰</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Berita</h1>
                <p className="text-xs text-gray-500">Kelola berita dan pengumuman sekolah</p>
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
          {/* Form Tambah Berita */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-24 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tambah Berita Baru
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Berita <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: Pembukaan PPDB 2024/2025"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ringkasan
                  </label>
                  <textarea
                    value={ringkasan}
                    onChange={(e) => setRingkasan(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Ringkasan singkat berita..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konten Lengkap
                  </label>
                  <textarea
                    value={konten}
                    onChange={(e) => setKonten(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={5}
                    placeholder="Isi berita lengkap..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <select
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {KATEGORI_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">📝 Draft</option>
                      <option value="published">✓ Publish</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Penulis
                  </label>
                  <input
                    type="text"
                    value={penulis}
                    onChange={(e) => setPenulis(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail / Foto
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-500 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label htmlFor="thumbnail-upload" className="cursor-pointer block">
                      <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-600">Klik untuk upload thumbnail</p>
                      <p className="text-xs text-gray-400">PNG, JPG (Max 2MB)</p>
                    </label>
                  </div>
                  {preview && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <div className="relative h-32 w-full rounded-xl overflow-hidden border bg-gray-50">
                        <Image src={preview} alt="Preview" fill className="object-contain" />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : '+ Tambah Berita'}
                </button>
              </form>
            </div>
          </div>

          {/* Daftar Berita */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="font-semibold text-gray-900">Daftar Berita</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{items.length} berita terdaftar</p>
                  </div>
                  <button onClick={fetchBerita} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 opacity-30">📰</div>
                    <p className="text-gray-500">Belum ada berita</p>
                    <p className="text-sm text-gray-400 mt-1">Tambahkan berita pertama Anda!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
                        <div className="flex gap-4">
                          {item.thumbnail_url ? (
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                              <Image src={item.thumbnail_url} alt={item.judul} width={80} height={80} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-20 h-20 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-3xl">📰</span>
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getKategoriBadge(item.kategori)}`}>
                                {item.kategori}
                              </span>
                              {getStatusBadge(item.status)}
                              <span className="text-xs text-gray-400">👁️ {item.views}</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 line-clamp-1">{item.judul}</h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.ringkasan}</p>
                            <p className="text-xs text-gray-400 mt-2">📅 {new Date(item.tanggal_publikasi).toLocaleDateString('id-ID')}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="text-blue-500 hover:text-blue-700 p-1"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-500 hover:text-red-700 p-1"
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

      {/* Modal Edit Berita */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 sticky top-0">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Berita
              </h2>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Berita
                </label>
                <input
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ringkasan
                </label>
                <textarea
                  value={ringkasan}
                  onChange={(e) => setRingkasan(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Konten Lengkap
                </label>
                <textarea
                  value={konten}
                  onChange={(e) => setKonten(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {KATEGORI_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">📝 Draft</option>
                    <option value="published">✓ Publish</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Penulis
                </label>
                <input
                  type="text"
                  value={penulis}
                  onChange={(e) => setPenulis(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail Baru (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
                {editingItem.thumbnail_url && !preview && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Thumbnail saat ini:</p>
                    <div className="relative h-24 w-24 rounded-lg overflow-hidden">
                      <Image src={editingItem.thumbnail_url} alt="Thumbnail" fill className="object-cover" />
                    </div>
                  </div>
                )}
                {preview && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Preview baru:</p>
                    <div className="relative h-24 w-24 rounded-lg overflow-hidden">
                      <Image src={preview} alt="Preview" fill className="object-cover" />
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
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
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
