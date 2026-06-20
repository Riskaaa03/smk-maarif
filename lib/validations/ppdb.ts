import { z } from 'zod'

/**
 * Skema validasi Zod untuk formulir PPDB
 * Requirements: 8.5
 *
 * Aturan validasi:
 * - NIK: 16 digit angka
 * - Email: format email valid
 * - Nomor HP: format 08xx atau +628xx
 * - Usia minimal 12 tahun
 * - NISN: 10 digit angka
 */
export const ppdbFormSchema = z.object({
  namaLengkap: z
    .string()
    .min(3, 'Nama lengkap minimal 3 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter'),

  nik: z
    .string()
    .length(16, 'NIK harus 16 digit')
    .regex(/^\d+$/, 'NIK hanya boleh berisi angka'),

  tempatLahir: z
    .string()
    .min(2, 'Tempat lahir minimal 2 karakter')
    .max(50, 'Tempat lahir maksimal 50 karakter'),

  tanggalLahir: z.string().refine(
    (val) => {
      const date = new Date(val)
      if (isNaN(date.getTime())) return false
      const minAge = new Date()
      minAge.setFullYear(minAge.getFullYear() - 12)
      return date <= minAge
    },
    { message: 'Usia minimal 12 tahun' }
  ),

  jenisKelamin: z.enum(['L', 'P'], {
    errorMap: () => ({ message: 'Jenis kelamin harus dipilih' }),
  }),

  agama: z.string().min(1, 'Agama harus diisi'),

  alamat: z
    .string()
    .min(10, 'Alamat minimal 10 karakter')
    .max(255, 'Alamat maksimal 255 karakter'),

  asalSekolah: z
    .string()
    .min(3, 'Nama sekolah asal minimal 3 karakter')
    .max(100, 'Nama sekolah asal maksimal 100 karakter'),

  nisn: z
    .string()
    .length(10, 'NISN harus 10 digit')
    .regex(/^\d+$/, 'NISN hanya boleh berisi angka'),

  tahunLulus: z
    .number({
      required_error: 'Tahun lulus harus diisi',
      invalid_type_error: 'Tahun lulus harus berupa angka',
    })
    .int('Tahun lulus harus bilangan bulat')
    .min(2020, 'Tahun lulus tidak valid')
    .max(new Date().getFullYear() + 1, 'Tahun lulus tidak valid'),

  programKeahlianPilihan1: z.enum(['TBSM', 'TJKT', 'AKL'], {
    errorMap: () => ({ message: 'Program keahlian pilihan 1 harus dipilih' }),
  }),

  programKeahlianPilihan2: z
    .enum(['TBSM', 'TJKT', 'AKL'])
    .nullable()
    .optional(),

  namaOrangTua: z
    .string()
    .min(3, 'Nama orang tua minimal 3 karakter')
    .max(100, 'Nama orang tua maksimal 100 karakter'),

  pekerjaanOrangTua: z
    .string()
    .min(2, 'Pekerjaan orang tua minimal 2 karakter'),

  nomorHP: z
    .string()
    .regex(
      /^(\+62|08)\d{8,11}$/,
      'Format nomor HP tidak valid. Gunakan format 08xx atau +628xx'
    ),

  email: z.string().email('Format email tidak valid'),
})

export type PPDBFormData = z.infer<typeof ppdbFormSchema>
