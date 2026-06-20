'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { submitPPDB } from '@/lib/actions/ppdb'
import type { PPDBFormData } from '@/lib/validations/ppdb'

// Import komponen pendukung
import PPDBInfoSection from '@/components/ppdb/PPDBInfoSection'

export default function PPDBPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    // PEMETAAN DATA: Mengubah key dari snake_case elemen HTML menjadi camelCase Zod Schema
    const data: PPDBFormData = {
      namaLengkap: formData.get('nama_siswa') as string,
      nik: formData.get('nik') as string,
      nisn: formData.get('nisn') as string,
      tempatLahir: formData.get('tempat_lahir') as string,
      tanggalLahir: formData.get('tanggal_lahir') as string,
      alamat: formData.get('alamat_siswa') as string,
      jenisKelamin: (formData.get('jenis_kelamin') as string || '').toUpperCase() as "L" | "P",
      agama: formData.get('agama') as string,
      nomorHP: formData.get('nomor_wa') as string, 
      email: formData.get('email') as string || '',
      asalSekolah: formData.get('asal_sekolah') as string,
      programKeahlianPilihan1: (formData.get('jurusan') as string || '').toUpperCase() as "TBSM" | "TJKT" | "AKL",
      
      // Properti tambahan bawaan skema agar tidak memicu missing property
      tahunLulus: new Date().getFullYear(),
      memilikiKip: (formData.get('memiliki_kip') as string || 'TIDAK').toUpperCase() as "YA" | "TIDAK",
      namaKip: formData.get('nama_kip') as string || '',
      nomorKip: formData.get('nomor_kip') as string || '',
      namaOrangTua: formData.get('nama_orang_tua') as string,
      pekerjaanOrangTua: formData.get('pekerjaan_orang_tua') as string,
      direkomendasikanOleh: formData.get('direkomendasikan_oleh') as string || '',
    }

    try {
      const result = await submitPPDB(data)
      
      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/ppdb/success?nomor=${result.nomorPendaftaran}`)
        }, 1500)
      } else {
        setError(result.message || 'Terjadi kesalahan')
      }
    } catch (err) {
      setError('Terjadi kesalahan server. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-[#f8f8f6] min-h-screen py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-[#1a5c3a] hover:underline text-sm">
            &larr; Kembali ke Beranda
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mt-4">
            Pendaftaran PPDB
          </h1>
          <p className="text-gray-500 mt-2">
            Isi formulir di bawah ini untuk mendaftar sebagai peserta didik baru
            SMK Ma&apos;arif NU 01 Karangkobar.
          </p>
        </div>

        {/* Informasi PPDB Section */}
        <div className="mb-6">
          <PPDBInfoSection />
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6">
            ✅ Pendaftaran berhasil! Mengalihkan ke halaman sukses...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
            ❌ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Siswa */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama_siswa"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all"
                placeholder="Contoh: Ahmad Fauzi"
              />
            </div>

            {/* NIK */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                NIK <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nik"
                required
                maxLength={16}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all"
                placeholder="16 digit"
              />
            </div>

            {/* NISN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                NISN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nisn"
                required
                maxLength={10}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all"
                placeholder="10 digit"
              />
            </div>

            {/* Tempat Lahir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tempat Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="tempat_lahir"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all"
                placeholder="Contoh: Banjarnegara"
              />
            </div>

            {/* Tanggal Lahir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal_lahir"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all"
              />
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <select
                name="jenis_kelamin"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all bg-white"
              >
                <option value="">Pilih</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            {/* Agama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Agama <span className="text-red-500">*</span>
              </label>
              <select
                name="agama"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all bg-white"
              >
                <option value="">Pilih</option>
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Budha">Budha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
            </div>

            {/* Alamat */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                name="alamat_siswa"
                required
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all"
                placeholder="Alamat lengkap sesuai KK/KTP"
              />
            </div>

            {/* Nomor WA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nomor WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nomor_wa"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all"
                placeholder="Contoh: 081234567890"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all"
                placeholder="email@example.com"
              />
            </div>

            {/* Asal Sekolah */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Asal Sekolah <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="asal_sekolah"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all"
                placeholder="Nama sekolah asal Mts/SMP"
              />
            </div>

            {/* Jurusan */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Pilih Jurusan <span className="text-red-500">*</span>
              </label>
              <select
                name="jurusan"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all bg-white"
              >
                <option value="">Pilih Jurusan</option>
                <option value="tbsm">TBSM - Teknik &amp; Bisnis Sepeda Motor</option>
                <option value="tjkt">TJKT - Teknik Jaringan Komputer &amp; Telekomunikasi</option>
                <option value="akl">AKL - Akuntansi &amp; Keuangan Lembaga</option>
              </select>
            </div>

            {/* KIP */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Memiliki Kartu Indonesia Pintar (KIP)?
              </label>
              <select
                name="memiliki_kip"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all bg-white"
              >
                <option value="TIDAK">Tidak</option>
                <option value="YA">Ya</option>
              </select>
            </div>

            {/* Nama KIP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama di KIP
              </label>
              <input
                type="text"
                name="nama_kip"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all"
                placeholder="Nama sesuai KIP"
              />
            </div>

            {/* Nomor KIP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nomor KIP
              </label>
              <input
                type="text"
                name="nomor_kip"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all"
                placeholder="Nomor KIP"
              />
            </div>

            {/* Nama Orang Tua */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama Orang Tua / Wali <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama_orang_tua"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all"
                placeholder="Nama ayah/ibu/wali"
              />
            </div>

            {/* Pekerjaan Orang Tua */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Pekerjaan Orang Tua <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pekerjaan_orang_tua"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all"
                placeholder="Contoh: Petani, Wiraswasta, PNS"
              />
            </div>

            {/* Direkomendasikan oleh */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Direkomendasikan oleh
              </label>
              <input
                type="text"
                name="direkomendasikan_oleh"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a] focus:border-transparent transition-all"
                placeholder="Nama perekomendasi (opsional)"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a5c3a] hover:bg-[#0d2e1a] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Memproses Pendaftaran...
                </>
              ) : (
                'Kirim Formulir Pendaftaran'
              )}
            </button>
            <p className="text-xs text-gray-400 text-center mt-4">
              * Data yang diisikan akan langsung diverifikasi dan disimpan ke sistem database sekolah secara aman.
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}
