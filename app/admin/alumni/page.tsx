'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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
  created_at: string
}

const PROGRAM_OPTIONS = [
  { value: 'TBSM', label: 'TBSM - Teknik Bisnis Sepeda Motor' },
  { value: 'TJKT', label: 'TJKT - Teknik Jaringan Komputer dan Telekomunikasi' },
  { value: 'AKL', label: 'AKL - Akuntansi dan Keuangan Lembaga' },
]

export default function AdminAlumniPage() {
  const [items, setItems] = useState<AlumniItem[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nama: '',
    angkatan: new Date().getFullYear(),
    program_keahlian: 'TBSM',
    tempat_kerja: '',
    posisi: '',
    testimonial: '',
    status: 'aktif',
    urutan: 0,
  })
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  const fetchData = async () => {
    try {
      const res = await fetch('/api/alumni')
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

  const resetForm = () => {
    setFormData({
      nama: '',
      angkatan: new Date().getFullYear(),
      program_keahlian: 'TBSM',
      tempat_kerja: '',
      posisi: '',
      testimonial: '',
      status: 'aktif',
      urutan: 0,
    })
    setFile(null)
    setPreview('')
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    const formDataToSend = new FormData()
    formDataToSend.append('nama', formData.nama)
    formDataToSend.append('angkatan', formData.angkatan.toString())
    formDataToSend.append('program_keahlian', formData.program_keahlian)
    formDataToSend.append('tempat_kerja', formData.tempat_kerja)
    formDataToSend.append('posisi', formData.posisi)
    formDataToSend.append('testimonial', formData.testimonial)
    formDataToSend.append('status', formData.status)
    formDataToSend.append('urutan', formData.urutan.toString())
    if (file) {
      formDataToSend.append('file', file)
    }

    try {
      const url = '/api/alumni'
      const method = editingId ? 'PUT' : 'POST'
      if (editingId) {
        formDataToSend.append('id', editingId.toString())
        const existingItem = items.find(i => i.id === editingId)
        if (existingItem?.foto_url) {
          formDataToSend.append('existingFoto', existingItem.foto_url)
        }
      }

      const res = await fetch(url, {
        method,
        body: formDataToSend,
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

  const handleEdit = (item: AlumniItem) => {
    setEditingId(item.id)
    setFormData({
      nama: item.nama,
      angkatan: item.angkatan,
      program_keahlian: item.program_keahlian,
      tempat_kerja: item.tempat_kerja || '',
      posisi: item.posisi || '',
      testimonial: item.testimonial || '',
      status: item.status,
      urutan: item.urutan,
    })
    setPreview(item.foto_url || '')
    setFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return

    try {
      const res = await fetch(`/api/alumni?id=${id}`, { method: 'DELETE' })
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
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">👔</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Alumni</h1>
                <p className="text-xs text-gray-500">Kelola data alumni bekerja</p>
              </div>
            </div>
            <Link href="/" className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  {editingId ? 'Edit Alumni' : 'Tambah Alumni Baru'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Alumni <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Angkatan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="angkatan"
                      value={formData.angkatan}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="2015"
                      max={new Date().getFullYear()}
                      required
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
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Keahlian <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="program_keahlian"
                    value={formData.program_keahlian}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {PROGRAM_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tempat Kerja
                  </label>
                  <input
                    type="text"
                    name="tempat_kerja"
                    value={formData.tempat_kerja}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Contoh: PT Astra Honda Motor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Posisi / Jabatan
                  </label>
                  <input
                    type="text"
                    name="posisi"
                    value={formData.posisi}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Contoh: Teknisi Mekanik"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testimonial
                  </label>
                  <textarea
                    name="testimonial"
                    value={formData.testimonial}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="Testimonial tentang pengalaman di SMK..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-purple-500 transition-all cursor-pointer">
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
                    </label>
                  </div>
                  {preview && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden border bg-gray-50">
                        <Image src={preview} alt="Preview" fill className="object-contain" />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="aktif">✓ Aktif</option>
                    <option value="nonaktif">✗ Tidak Aktif</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md"
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

          {/* Daftar Alumni */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">Daftar Alumni</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{items.length} alumni terdaftar</p>
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
                    <div className="text-6xl mb-4 opacity-30">👔</div>
                    <p className="text-gray-500">Belum ada data alumni</p>
                    <p className="text-sm text-gray-400 mt-1">Tambahkan data alumni pertama Anda!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
                        <div className="flex items-start gap-4">
                          {item.foto_url ? (
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                              <Image src={item.foto_url} alt={item.nama} width={48} height={48} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-purple-600 text-lg font-bold">{item.nama.charAt(0)}</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{item.nama}</h3>
                              {getStatusBadge(item.status)}
                            </div>
                            <p className="text-sm text-gray-600">
                              {item.program_keahlian} • Angkatan {item.angkatan}
                            </p>
                            {item.tempat_kerja && (
                              <p className="text-xs text-gray-500 mt-1">💼 {item.tempat_kerja} {item.posisi && `- ${item.posisi}`}</p>
                            )}
                            {item.testimonial && (
                              <p className="text-xs text-gray-400 mt-1 italic line-clamp-2">"{item.testimonial}"</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-500 hover:text-blue-700 p-1"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-500 hover:text-red-700 p-1"
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
