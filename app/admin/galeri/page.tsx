'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface GaleriItem {
  id: number
  title: string
  description: string
  imageUrl: string
  date: string
  kategori?: string
}

export default function AdminGaleri() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [kategori, setKategori] = useState('kegiatan')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<GaleriItem[]>([])
  const [message, setMessage] = useState({ type: '', text: '' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Ambil data galeri
  const fetchGaleri = async () => {
    try {
      const res = await fetch('/api/galeri')
      const data = await res.json()
      if (data.success) {
        setItems(data.items)
      }
    } catch (error) {
      console.error('Error fetching:', error)
    }
  }

  useEffect(() => {
    fetchGaleri()
  }, [])

  // Preview gambar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Ukuran file maksimal 5MB!' })
        return
      }
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
      if (!validTypes.includes(selectedFile.type)) {
        setMessage({ type: 'error', text: 'Hanya JPG, PNG, dan WebP yang diperbolehkan!' })
        return
      }
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  // Submit upload / edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Judul wajib diisi!' })
      return
    }

    if (!isEditing && !file) {
      setMessage({ type: 'error', text: 'Foto wajib diupload!' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('description', description.trim())
      formData.append('kategori', kategori)
      
      if (file) {
        formData.append('file', file)
      }
      
      if (isEditing && editingId) {
        formData.append('id', editingId.toString())
      }

      const url = '/api/galeri'
      const method = isEditing ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method: method,
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: isEditing ? '✅ Foto berhasil diperbarui!' : '✅ Foto berhasil diupload!' 
        })
        resetForm()
        await fetchGaleri()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Gagal menyimpan data. Silakan coba lagi.' 
        })
      }
    } catch (error) {
      console.error('Submit error:', error)
      setMessage({ 
        type: 'error', 
        text: 'Terjadi kesalahan: ' + (error instanceof Error ? error.message : 'Unknown error') 
      })
    } finally {
      setLoading(false)
    }
  }

  // Edit foto
  const handleEdit = (item: GaleriItem) => {
    setTitle(item.title)
    setDescription(item.description || '')
    setKategori(item.kategori || 'kegiatan')
    setEditingId(item.id)
    setIsEditing(true)
    setPreview(item.imageUrl)
    setFile(null)
    setMessage({ type: '', text: '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Hapus foto
  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus foto ini?')) return

    try {
      const res = await fetch(`/api/galeri?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: '✅ Foto berhasil dihapus!' })
        await fetchGaleri()
      } else {
        setMessage({ type: 'error', text: 'Gagal menghapus foto' })
      }
    } catch (error) {
      console.error('Delete error:', error)
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menghapus' })
    }
  }

  // Reset form
  const resetForm = () => {
    setTitle('')
    setDescription('')
    setKategori('kegiatan')
    setFile(null)
    setPreview('')
    setEditingId(null)
    setIsEditing(false)
  }

  // Cancel edit
  const handleCancelEdit = () => {
    resetForm()
    setMessage({ type: '', text: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Admin */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a5c3a] to-[#134d2e] flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">📸</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Galeri</h1>
                <p className="text-xs text-gray-500">Kelola foto kegiatan sekolah</p>
              </div>
            </div>
            <Link
              href="/galeri"
              target="_blank"
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Lihat Galeri
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Notifikasi */}
        {message.text && (
          <div
            className={`mb-6 rounded-xl p-4 flex items-center justify-between shadow-md ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-sm">{message.text}</span>
            </div>
            <button
              onClick={() => setMessage({ type: '', text: '' })}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Upload/Edit */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-24 overflow-hidden">
              <div className={`px-6 py-4 ${
                isEditing 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
                  : 'bg-gradient-to-r from-[#1a5c3a] to-[#134d2e]'
              }`}>
                <h2 className="text-white font-semibold flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Foto
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload Foto Baru
                    </>
                  )}
                </h2>
                {isEditing && (
                  <p className="text-white/80 text-xs mt-1">Sedang mengedit: ID #{editingId}</p>
                )}
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Foto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all"
                    placeholder="Contoh: Upacara Bendera 17 Agustus"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all"
                    rows={3}
                    placeholder="Ceritakan sedikit tentang momen ini..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all bg-white"
                  >
                    <option value="kegiatan">📅 Kegiatan Sekolah</option>
                    <option value="prestasi">🏆 Prestasi</option>
                    <option value="fasilitas">🏫 Fasilitas</option>
                    <option value="pembelajaran">📚 Pembelajaran</option>
                    <option value="ekskul">🎭 Ekstrakurikuler</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isEditing ? 'Ganti Foto (Opsional)' : 'Pilih Foto *'}
                  </label>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                    isEditing 
                      ? 'border-blue-300 hover:border-blue-500 bg-blue-50 hover:bg-blue-100' 
                      : 'border-gray-300 hover:border-[#1a5c3a] bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer block">
                      <svg className="w-10 h-10 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-600">
                        {isEditing ? 'Klik untuk ganti foto (opsional)' : 'Klik untuk pilih foto'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP (Max 5MB)</p>
                    </label>
                  </div>
                  
                  {preview && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                        <svg className="w-4 h-4 text-[#1a5c3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Preview:
                      </p>
                      <div className="relative h-40 w-full rounded-xl overflow-hidden border shadow-md">
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

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                      isEditing
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                        : 'bg-gradient-to-r from-[#1a5c3a] to-[#134d2e] hover:from-[#134d2e] hover:to-[#0d2e1a]'
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {isEditing ? 'Menyimpan...' : 'Uploading...'}
                      </>
                    ) : (
                      <>
                        {isEditing ? (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Simpan Perubahan
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Upload Foto
                          </>
                        )}
                      </>
                    )}
                  </button>
                  
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                    >
                      Batal
                    </button>
                  )}
                  
                  {!isEditing && (title || description || preview) && (
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

          {/* Daftar Foto */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">Daftar Foto Galeri</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {items.length} foto • Terbaru di atas
                  </p>
                </div>
                <button
                  onClick={fetchGaleri}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Refresh"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 opacity-30">🖼️</div>
                    <p className="text-gray-500">Belum ada foto</p>
                    <p className="text-sm text-gray-400 mt-1">Upload foto pertama Anda!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`group bg-gray-50 rounded-xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${
                          editingId === item.id 
                            ? 'border-blue-400 shadow-lg ring-2 ring-blue-400' 
                            : 'border-gray-100 hover:shadow-xl'
                        }`}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Kategori Badge */}
                          {item.kategori && (
                            <span className="absolute top-3 left-3 bg-black/50 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
                              {item.kategori === 'kegiatan' && '📅 Kegiatan'}
                              {item.kategori === 'prestasi' && '🏆 Prestasi'}
                              {item.kategori === 'fasilitas' && '🏫 Fasilitas'}
                              {item.kategori === 'pembelajaran' && '📚 Pembelajaran'}
                              {item.kategori === 'ekskul' && '🎭 Ekskul'}
                            </span>
                          )}
                          
                          {/* Action Buttons */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleEdit(item)}
                              className="bg-white hover:bg-blue-50 text-blue-600 p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110"
                              title="Edit foto"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="bg-white hover:bg-red-50 text-red-500 p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110"
                              title="Hapus foto"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
                              {item.title}
                            </h3>
                            {editingId === item.id && (
                              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full ml-2 whitespace-nowrap">
                                Editing
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {item.date}
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tips Upload */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="text-xl">💡</div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Tips Foto yang Bagus</h4>
                  <ul className="text-xs text-gray-600 mt-1 space-y-1">
                    <li>• Gunakan foto dengan pencahayaan yang cukup (siang hari lebih baik)</li>
                    <li>• Pilih momen candid (natural) untuk hasil yang lebih hidup</li>
                    <li>• Variasikan angle foto (close up, wide, detail kegiatan)</li>
                    <li>• Berikan judul dan deskripsi yang informatif dan personal</li>
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