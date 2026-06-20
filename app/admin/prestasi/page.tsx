'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface PrestasiItem {
  id: number
  program_slug: string
  nama_kejuaraan: string
  tingkat: string
  tahun: number
  keterangan: string
  peringkat: string
  penyelenggara: string
  foto_url: string | null
  created_at: string
}

const PROGRAM_OPTIONS = [
  { value: 'tbsm', label: 'TBSM - Teknik & Bisnis Sepeda Motor' },
  { value: 'tjkt', label: 'TJKT - Teknik Jaringan Komputer & Telekomunikasi' },
  { value: 'akl', label: 'AKL - Akuntansi & Keuangan Lembaga' },
]

const TINGKAT_OPTIONS = [
  { value: 'kabupaten', label: 'Kabupaten' },
  { value: 'provinsi', label: 'Provinsi' },
  { value: 'nasional', label: 'Nasional' },
  { value: 'internasional', label: 'Internasional' },
]

export default function AdminPrestasi() {
  const [programSlug, setProgramSlug] = useState('tbsm')
  const [namaKejuaraan, setNamaKejuaraan] = useState('')
  const [tingkat, setTingkat] = useState('kabupaten')
  const [tahun, setTahun] = useState(new Date().getFullYear())
  const [keterangan, setKeterangan] = useState('')
  const [peringkat, setPeringkat] = useState('')
  const [penyelenggara, setPenyelenggara] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<PrestasiItem[]>([])
  const [message, setMessage] = useState({ type: '', text: '' })
  const [filterProgram, setFilterProgram] = useState('all')
  
  // State untuk edit
  const [editingItem, setEditingItem] = useState<PrestasiItem | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  // Ambil data prestasi
  const fetchPrestasi = async () => {
    try {
      const url = filterProgram === 'all' ? '/api/prestasi' : `/api/prestasi?program_slug=${filterProgram}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) {
        setItems(data.items || data.data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    fetchPrestasi()
  }, [filterProgram])

  // Preview gambar dengan validasi
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validasi ukuran file (maksimal 5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (selectedFile.size > maxSize) {
        setMessage({ type: 'error', text: `Ukuran file ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB melebihi batas maksimal 5MB!` })
        e.target.value = '' // Reset input
        return
      }
      
      // Validasi tipe file
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
      if (!validTypes.includes(selectedFile.type)) {
        setMessage({ type: 'error', text: 'Hanya JPG, PNG, dan WebP yang diperbolehkan!' })
        e.target.value = '' // Reset input
        return
      }
      
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
      
      // Hapus pesan error jika ada
      if (message.type === 'error') {
        setMessage({ type: '', text: '' })
      }
    }
  }

  const resetForm = () => {
    setProgramSlug('tbsm')
    setNamaKejuaraan('')
    setTingkat('kabupaten')
    setTahun(new Date().getFullYear())
    setKeterangan('')
    setPeringkat('')
    setPenyelenggara('')
    setFile(null)
    setPreview('')
    setEditingItem(null)
  }

  // Submit tambah prestasi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasi
    if (!namaKejuaraan) {
      setMessage({ type: 'error', text: 'Nama kejuaraan wajib diisi!' })
      return
    }

    // Validasi ukuran file jika ada
    if (file) {
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        setMessage({ type: 'error', text: `Ukuran file ${(file.size / 1024 / 1024).toFixed(2)}MB melebihi batas maksimal 5MB!` })
        return
      }
    }

    setLoading(true)
    setMessage({ type: '', text: '' })
    
    const formData = new FormData()
    formData.append('program_slug', programSlug)
    formData.append('nama_kejuaraan', namaKejuaraan)
    formData.append('tingkat', tingkat)
    formData.append('tahun', tahun.toString())
    formData.append('keterangan', keterangan)
    formData.append('peringkat', peringkat)
    formData.append('penyelenggara', penyelenggara)
    if (file) {
      formData.append('file', file)
    }

    try {
      const res = await fetch('/api/prestasi', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: '✅ Prestasi berhasil ditambahkan!' })
        resetForm()
        fetchPrestasi()
        // Scroll ke atas
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menambah prestasi' })
      }
    } catch (error) {
      console.error('Submit error:', error)
      setMessage({ type: 'error', text: 'Terjadi kesalahan server: ' + (error instanceof Error ? error.message : 'Unknown error') })
    } finally {
      setLoading(false)
    }
  }

  // Submit update prestasi
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return

    // Validasi ukuran file jika ada
    if (file) {
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        setMessage({ type: 'error', text: `Ukuran file ${(file.size / 1024 / 1024).toFixed(2)}MB melebihi batas maksimal 5MB!` })
        return
      }
    }

    setLoading(true)
    setMessage({ type: '', text: '' })
    
    const formData = new FormData()
    formData.append('id', editingItem.id.toString())
    formData.append('program_slug', programSlug)
    formData.append('nama_kejuaraan', namaKejuaraan)
    formData.append('tingkat', tingkat)
    formData.append('tahun', tahun.toString())
    formData.append('keterangan', keterangan)
    formData.append('peringkat', peringkat)
    formData.append('penyelenggara', penyelenggara)
    if (editingItem.foto_url) {
      formData.append('existingFoto', editingItem.foto_url)
    }
    if (file) {
      formData.append('file', file)
    }

    try {
      const res = await fetch('/api/prestasi', {
        method: 'PUT',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: '✅ Prestasi berhasil diupdate!' })
        resetForm()
        setShowEditModal(false)
        fetchPrestasi()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal mengupdate prestasi' })
      }
    } catch (error) {
      console.error('Update error:', error)
      setMessage({ type: 'error', text: 'Terjadi kesalahan server: ' + (error instanceof Error ? error.message : 'Unknown error') })
    } finally {
      setLoading(false)
    }
  }

  // Buka modal edit
  const openEditModal = (item: PrestasiItem) => {
    setEditingItem(item)
    setProgramSlug(item.program_slug)
    setNamaKejuaraan(item.nama_kejuaraan)
    setTingkat(item.tingkat)
    setTahun(item.tahun)
    setKeterangan(item.keterangan || '')
    setPeringkat(item.peringkat || '')
    setPenyelenggara(item.penyelenggara || '')
    setFile(null)
    setPreview('')
    setShowEditModal(true)
    setMessage({ type: '', text: '' })
  }

  // Hapus prestasi
  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus prestasi ini?')) return

    try {
      const res = await fetch(`/api/prestasi?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: '✅ Prestasi berhasil dihapus!' })
        fetchPrestasi()
      } else {
        setMessage({ type: 'error', text: 'Gagal menghapus prestasi' })
      }
    } catch (error) {
      console.error('Delete error:', error)
      setMessage({ type: 'error', text: 'Terjadi kesalahan' })
    }
  }

  const getProgramLabel = (slug: string) => {
    const program = PROGRAM_OPTIONS.find(p => p.value === slug)
    return program ? program.label.split(' - ')[0] : slug.toUpperCase()
  }

  const getTingkatBadge = (tingkat: string) => {
    switch (tingkat) {
      case 'kabupaten': return 'bg-blue-100 text-blue-800'
      case 'provinsi': return 'bg-purple-100 text-purple-800'
      case 'nasional': return 'bg-amber-100 text-amber-800'
      case 'internasional': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Reset error message setelah 5 detik
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message.text])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🏆</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Prestasi</h1>
                <p className="text-xs text-gray-500">Kelola prestasi per program studi</p>
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
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <span>{message.text}</span>
            <button onClick={() => setMessage({ type: '', text: '' })} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Tambah Prestasi */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-24 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tambah Prestasi Baru
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Keahlian <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={programSlug}
                    onChange={(e) => setProgramSlug(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {PROGRAM_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Kejuaraan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={namaKejuaraan}
                    onChange={(e) => setNamaKejuaraan(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Contoh: Lomba Kompetensi Siswa (LKS)"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tingkat <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={tingkat}
                      onChange={(e) => setTingkat(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {TINGKAT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tahun <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={tahun}
                      onChange={(e) => setTahun(parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      min="2015"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peringkat / Juara
                  </label>
                  <input
                    type="text"
                    value={peringkat}
                    onChange={(e) => setPeringkat(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Contoh: Juara 1, Juara 2, Juara Harapan 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Penyelenggara
                  </label>
                  <input
                    type="text"
                    value={penyelenggara}
                    onChange={(e) => setPenyelenggara(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Contoh: Dinas Pendidikan Provinsi Jawa Tengah"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keterangan / Deskripsi
                  </label>
                  <textarea
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows={2}
                    placeholder="Deskripsi singkat tentang prestasi ini..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Dokumentasi
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-amber-500 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="foto-upload"
                    />
                    <label htmlFor="foto-upload" className="cursor-pointer block">
                      <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-600">Klik untuk upload foto</p>
                      <p className="text-xs text-gray-400">PNG, JPG, WebP (Max 5MB)</p>
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
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Menyimpan...' : '+ Tambah Prestasi'}
                </button>
              </form>
            </div>
          </div>

          {/* Daftar Prestasi */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="font-semibold text-gray-900">Daftar Prestasi</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{items.length} prestasi terdaftar</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={filterProgram}
                      onChange={(e) => setFilterProgram(e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="all">Semua Program</option>
                      {PROGRAM_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label.split(' - ')[0]}</option>
                      ))}
                    </select>
                    <button onClick={fetchPrestasi} className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 opacity-30">🏆</div>
                    <p className="text-gray-500">Belum ada data prestasi</p>
                    <p className="text-sm text-gray-400 mt-1">Tambahkan prestasi pertama Anda!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
                        <div className="flex gap-4">
                          {/* Foto */}
                          {item.foto_url ? (
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                              <Image src={item.foto_url} alt={item.nama_kejuaraan} width={80} height={80} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-20 h-20 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-3xl">🏆</span>
                            </div>
                          )}
                          
                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-xs font-semibold bg-gray-200 px-2 py-0.5 rounded-full">
                                {getProgramLabel(item.program_slug)}
                              </span>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getTingkatBadge(item.tingkat)}`}>
                                {item.tingkat}
                              </span>
                              <span className="text-xs text-gray-500">{item.tahun}</span>
                            </div>
                            <h3 className="font-semibold text-gray-900">{item.nama_kejuaraan}</h3>
                            {item.peringkat && (
                              <p className="text-sm text-amber-600 font-medium mt-0.5">{item.peringkat}</p>
                            )}
                            {item.penyelenggara && (
                              <p className="text-xs text-gray-500 mt-0.5">Penyelenggara: {item.penyelenggara}</p>
                            )}
                            {item.keterangan && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.keterangan}</p>
                            )}
                          </div>
                          
                          {/* Actions */}
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

      {/* Modal Edit */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 sticky top-0">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Prestasi
              </h2>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Keahlian
                </label>
                <select
                  value={programSlug}
                  onChange={(e) => setProgramSlug(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {PROGRAM_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kejuaraan
                </label>
                <input
                  type="text"
                  value={namaKejuaraan}
                  onChange={(e) => setNamaKejuaraan(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tingkat
                  </label>
                  <select
                    value={tingkat}
                    onChange={(e) => setTingkat(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {TINGKAT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tahun
                  </label>
                  <input
                    type="number"
                    value={tahun}
                    onChange={(e) => setTahun(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peringkat
                </label>
                <input
                  type="text"
                  value={peringkat}
                  onChange={(e) => setPeringkat(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Juara 1, Juara 2, dll"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Penyelenggara
                </label>
                <input
                  type="text"
                  value={penyelenggara}
                  onChange={(e) => setPenyelenggara(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keterangan
                </label>
                <textarea
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foto Baru (Opsional) - Max 5MB
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
                {editingItem.foto_url && !preview && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Foto saat ini:</p>
                    <div className="relative h-24 w-24">
                      <Image src={editingItem.foto_url} alt="Foto" fill className="object-contain" />
                    </div>
                  </div>
                )}
                {preview && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Preview baru:</p>
                    <div className="relative h-24 w-24">
                      <Image src={preview} alt="Preview" fill className="object-contain" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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