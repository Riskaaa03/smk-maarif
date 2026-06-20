import { z } from 'zod'

export const ppdbSchema = z.object({
  namaLengkap: z.string().min(1, { message: 'Nama lengkap wajib diisi' }),
  nik: z.string().length(16, { message: 'NIK harus 16 digit' }),
  nisn: z.string().length(10, { message: 'NISN harus 10 digit' }),
  tempatLahir: z.string().min(1, { message: 'Tempat lahir wajib diisi' }),
  tanggalLahir: z.string().min(1, { message: 'Tanggal lahir wajib diisi' }),
  alamat: z.string().min(1, { message: 'Alamat wajib diisi' }),
  
  // Solusi mutlak masalah overload enum (image_8786e9.png):
  jenisKelamin: z.string().refine((val) => val === 'L' || val === 'P', {
    message: 'Jenis kelamin harus dipilih',
  }),
  
  agama: z.string().min(1, { message: 'Agama wajib diisi' }),
  nomorHP: z.string().min(1, { message: 'Nomor HP/WA wajib diisi' }),
  email: z.string().email({ message: 'Format email tidak valid' }).optional().or(z.literal('')),
  asalSekolah: z.string().min(1, { message: 'Asal sekolah wajib diisi' }),
  
  // Menggunakan cara refine yang sama agar aman dari error type signature
  programKeahlianPilihan1: z.string().refine((val) => val === 'TBSM' || val === 'TJKT' || val === 'AKL', {
    message: 'Program keahlian harus dipilih',
  }),

  tahunLulus: z.number().int().default(() => new Date().getFullYear()),
  memilikiKip: z.string().default('TIDAK'),
  namaKip: z.string().optional().or(z.literal('')),
  nomorKip: z.string().optional().or(z.literal('')),
  namaOrangTua: z.string().min(1, { message: 'Nama orang tua wajib diisi' }),
  pekerjaanOrangTua: z.string().min(1, { message: 'Pekerjaan orang tua wajib diisi' }),
  direkomendasikanOleh: z.string().optional().or(z.literal('')),
})

export type PPDBFormData = z.infer<typeof ppdbSchema>
