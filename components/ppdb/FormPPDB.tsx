'use client'

import { useState } from 'react'

function FileIcon() {
  return (
    <svg
      className="h-[18px] w-[18px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg
      className="h-[15px] w-[15px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

const inputBase =
  'h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition-colors focus:border-nu-green-600 focus:bg-white'

const labelBase =
  'text-[11px] font-medium uppercase tracking-[0.06em] text-gray-400'

export default function FormPPDB() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [nomorPendaftaran, setNomorPendaftaran] = useState('')
  const [showKIPFields, setShowKIPFields] = useState(false)

  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    nisn: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    asal_sekolah: '',
    jurusan: '',
    hp: '',
    email: '',
    alamat: '',
    agama: 'Islam',
    nama_orang_tua: '',
    pekerjaan_orang_tua: '',
    memiliki_kip: 'TIDAK',
    nama_kip: '',
    nomor_kip: '',
    direkomendasikan_oleh: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/ppdb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namaSiswa: formData.nama,
          nik: formData.nik,
          nisn: formData.nisn,
          tempatLahir: formData.tempat_lahir,
          tanggalLahir: formData.tanggal_lahir,
          jenisKelamin: formData.jenis_kelamin,
          asalSekolah: formData.asal_sekolah,
          jurusan: formData.jurusan,
          nomorWA: formData.hp,
          email: formData.email,
          alamatSiswa: formData.alamat,
          agama: formData.agama,
          namaOrangTua: formData.nama_orang_tua,
          pekerjaanOrangTua: formData.pekerjaan_orang_tua,
          memilikiKIP: formData.memiliki_kip,
          namaKIP: formData.nama_kip,
          nomorKIP: formData.nomor_kip,
          direkomendasikanOleh: formData.direkomendasikan_oleh,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setNomorPendaftaran(data.nomorPendaftaran)
        setSubmitted(true)
      } else {
        setError(data.error || 'Gagal mengirim pendaftaran')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Terjadi kesalahan jaringan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-7 w-7 text-green-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="mb-2 font-serif text-xl font-bold text-gray-900">
          Pendaftaran Terkirim!
        </h3>
        <p className="mb-4 text-sm text-nu-green-700 font-mono">
          Nomor Pendaftaran: {nomorPendaftaran}
        </p>
        <p className="max-w-sm text-sm leading-relaxed text-gray-500">
          Terima kasih telah mendaftar. Konfirmasi pendaftaran akan dikirim ke
          alamat email yang Anda masukkan. Panitia akan menghubungi Anda untuk
          tahap selanjutnya.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100">
      {/* Form header */}
      <div className="flex items-center gap-3 bg-nu-green-800 px-7 py-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
          <FileIcon />
        </div>
        <div>
          <p className="text-[15px] font-semibold text-white">
            Formulir Pendaftaran PPDB 2026/2027
          </p>
          <p className="text-xs text-white/60">
            Semua kolom bertanda (*) wajib diisi
          </p>
        </div>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="p-7">
          {/* Error message */}
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {/* Data diri */}
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">
            Data Diri Calon Siswa
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nama" className={labelBase}>
                Nama Lengkap *
              </label>
              <input
                id="nama"
                name="nama"
                type="text"
                required
                placeholder="Sesuai akta kelahiran"
                className={inputBase}
                value={formData.nama}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="nik" className={labelBase}>
                NIK *
              </label>
              <input
                id="nik"
                name="nik"
                type="text"
                maxLength={16}
                placeholder="16 digit angka"
                className={inputBase}
                value={formData.nik}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="nisn" className={labelBase}>
                NISN
              </label>
              <input
                id="nisn"
                name="nisn"
                type="text"
                inputMode="numeric"
                maxLength={10}
                placeholder="10 digit angka"
                className={inputBase}
                value={formData.nisn}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="tempat_lahir" className={labelBase}>
                Tempat Lahir *
              </label>
              <input
                id="tempat_lahir"
                name="tempat_lahir"
                type="text"
                required
                placeholder="Contoh: Banjarnegara"
                className={inputBase}
                value={formData.tempat_lahir}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="tanggal_lahir" className={labelBase}>
                Tanggal Lahir *
              </label>
              <input
                id="tanggal_lahir"
                name="tanggal_lahir"
                type="date"
                required
                className={inputBase}
                value={formData.tanggal_lahir}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="jenis_kelamin" className={labelBase}>
                Jenis Kelamin *
              </label>
              <select
                id="jenis_kelamin"
                name="jenis_kelamin"
                required
                className={`${inputBase} appearance-none`}
                value={formData.jenis_kelamin}
                onChange={handleChange}
              >
                <option value="">Pilih...</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="asal_sekolah" className={labelBase}>
                Asal Sekolah (SMP/MTs) *
              </label>
              <input
                id="asal_sekolah"
                name="asal_sekolah"
                type="text"
                required
                placeholder="Nama sekolah asal"
                className={inputBase}
                value={formData.asal_sekolah}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="jurusan" className={labelBase}>
                Jurusan Pilihan *
              </label>
              <select
                id="jurusan"
                name="jurusan"
                required
                className={`${inputBase} appearance-none`}
                value={formData.jurusan}
                onChange={handleChange}
              >
                <option value="">Pilih jurusan...</option>
                <option value="TEKNIK KOMPUTER JARINGAN">Teknik Komputer Jaringan (TKJ)</option>
                <option value="AKUNTANSI DAN KEUANGAN LEMBAGA">Akuntansi dan Keuangan Lembaga (AKL)</option>
                <option value="TEKNIK SEPEDA MOTOR">Teknik Sepeda Motor (TSM)</option>
              </select>
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-gray-100" aria-hidden="true" />

          {/* Kontak */}
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">
            Kontak
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="hp" className={labelBase}>
                Nomor HP / WhatsApp *
              </label>
              <input
                id="hp"
                name="hp"
                type="tel"
                required
                placeholder="08xxxxxxxxxx"
                className={inputBase}
                value={formData.hp}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className={labelBase}>
                Alamat Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="email@aktif.com"
                className={inputBase}
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-full flex flex-col gap-1.5">
              <label htmlFor="alamat" className={labelBase}>
                Alamat Lengkap
              </label>
              <textarea
                id="alamat"
                name="alamat"
                rows={3}
                placeholder="Jalan, RT/RW, Desa, Kecamatan, Kabupaten"
                className="w-full resize-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-nu-green-600 focus:bg-white"
                value={formData.alamat}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Data Orang Tua */}
          <div className="my-6 h-px bg-gray-100" aria-hidden="true" />

          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">
            Data Orang Tua / Wali
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="agama" className={labelBase}>
                Agama *
              </label>
              <select
                id="agama"
                name="agama"
                required
                className={`${inputBase} appearance-none`}
                value={formData.agama}
                onChange={handleChange}
              >
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="nama_orang_tua" className={labelBase}>
                Nama Orang Tua / Wali *
              </label>
              <input
                id="nama_orang_tua"
                name="nama_orang_tua"
                type="text"
                required
                placeholder="Nama lengkap orang tua/wali"
                className={inputBase}
                value={formData.nama_orang_tua}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="pekerjaan_orang_tua" className={labelBase}>
                Pekerjaan Orang Tua / Wali *
              </label>
              <input
                id="pekerjaan_orang_tua"
                name="pekerjaan_orang_tua"
                type="text"
                required
                placeholder="Contoh: Petani, Wiraswasta, PNS"
                className={inputBase}
                value={formData.pekerjaan_orang_tua}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Data KIP */}
          <div className="my-6 h-px bg-gray-100" aria-hidden="true" />

          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">
            Kartu Indonesia Pintar (KIP)
          </p>
          <div className="grid grid-cols-1 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>Apakah Memiliki KIP?</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="memiliki_kip"
                    value="YA"
                    checked={formData.memiliki_kip === 'YA'}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, memiliki_kip: e.target.value }))
                      setShowKIPFields(true)
                    }}
                  />
                  YA
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="memiliki_kip"
                    value="TIDAK"
                    checked={formData.memiliki_kip === 'TIDAK'}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, memiliki_kip: e.target.value }))
                      setShowKIPFields(false)
                    }}
                  />
                  TIDAK
                </label>
              </div>
            </div>

            {(formData.memiliki_kip === 'YA' || showKIPFields) && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="nama_kip">Nama di Kartu KIP</label>
                  <input
                    id="nama_kip"
                    name="nama_kip"
                    type="text"
                    placeholder="Nama sesuai kartu KIP"
                    className={inputBase}
                    value={formData.nama_kip}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="nomor_kip">Nomor KIP</label>
                  <input
                    id="nomor_kip"
                    name="nomor_kip"
                    type="text"
                    placeholder="Nomor KIP"
                    className={inputBase}
                    value={formData.nomor_kip}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </div>

          {/* Informasi Tambahan */}
          <div className="my-6 h-px bg-gray-100" aria-hidden="true" />

          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">
            Informasi Tambahan
          </p>
          <div className="grid grid-cols-1 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="direkomendasikan_oleh">Direkomendasikan Oleh</label>
              <input
                id="direkomendasikan_oleh"
                name="direkomendasikan_oleh"
                type="text"
                placeholder="Nama yang merekomendasikan (opsional)"
                className={inputBase}
                value={formData.direkomendasikan_oleh}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit row */}
          <div className="my-6 h-px bg-gray-100" aria-hidden="true" />

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="max-w-sm text-xs leading-relaxed text-gray-400">
              Data Anda dijaga kerahasiaannya dan hanya digunakan untuk keperluan
              proses penerimaan siswa baru.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-nu-green-800 px-6 py-3 text-[13px] font-semibold tracking-[0.03em] text-white transition-colors hover:bg-nu-green-900 disabled:opacity-70"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
              {!isSubmitting && <ArrowIcon />}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}