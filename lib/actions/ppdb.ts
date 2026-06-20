'use server'

/**
 * Server Action untuk submit formulir PPDB
 * SMK Ma'arif NU 01 Karangkobar
 * Requirements: 8.4, 8.6
 */

import nodemailer from 'nodemailer'
import db from '@/lib/db'
import { generateNomorPendaftaran } from '@/lib/ppdb'
import { ppdbFormSchema, type PPDBFormData } from '@/lib/validations/ppdb'
import type { PPDBSubmitResponse } from '@/types/index'

// ============================================================
// Pastikan tabel PPDB ada di database
// ============================================================
function ensurePPDBTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS registrasi_ppdb (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nomorPendaftaran TEXT UNIQUE NOT NULL,
      namaLengkap TEXT NOT NULL,
      nik TEXT NOT NULL,
      tempatLahir TEXT NOT NULL,
      tanggalLahir TEXT NOT NULL,
      jenisKelamin TEXT NOT NULL,
      agama TEXT NOT NULL,
      alamat TEXT NOT NULL,
      asalSekolah TEXT NOT NULL,
      nisn TEXT NOT NULL,
      tahunLulus INTEGER NOT NULL,
      programKeahlianPilihan1 TEXT NOT NULL,
      programKeahlianPilihan2 TEXT,
      namaOrangTua TEXT NOT NULL,
      pekerjaanOrangTua TEXT NOT NULL,
      nomorHP TEXT NOT NULL,
      email TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      tanggalDaftar TEXT DEFAULT CURRENT_TIMESTAMP,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

// Panggil fungsi untuk memastikan tabel ada
ensurePPDBTable()

/**
 * Kirim email konfirmasi pendaftaran PPDB ke calon siswa.
 * Jika gagal, error di-log ke console dan tidak melempar exception.
 */
async function sendKonfirmasiEmail(
  email: string,
  namaLengkap: string,
  nomorPendaftaran: string,
): Promise<void> {
  // Cek apakah SMTP dikonfigurasi
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('[PPDB] SMTP tidak dikonfigurasi, email tidak dikirim')
    return
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Konfirmasi Pendaftaran PPDB</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    <h2 style="color: #1a5276; margin-top: 0;">Konfirmasi Pendaftaran PPDB</h2>
    <p style="color: #333333;">SMK Ma'arif NU 01 Karangkobar</p>
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 16px 0;" />

    <p style="color: #333333;">Yth. <strong>${namaLengkap}</strong>,</p>
    <p style="color: #333333;">
      Terima kasih telah mendaftar di SMK Ma'arif NU 01 Karangkobar.
      Pendaftaran Anda telah berhasil diterima dengan detail berikut:
    </p>

    <div style="background-color: #eaf4fb; border-left: 4px solid #1a5276; padding: 16px; border-radius: 4px; margin: 16px 0;">
      <p style="margin: 0; color: #1a5276; font-size: 14px;">Nomor Pendaftaran</p>
      <p style="margin: 8px 0 0; color: #1a5276; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
        ${nomorPendaftaran}
      </p>
    </div>

    <p style="color: #555555; font-size: 14px;">
      Simpan nomor pendaftaran ini sebagai bukti pendaftaran Anda.
      Panitia PPDB akan menghubungi Anda untuk proses selanjutnya.
    </p>

    <p style="color: #555555; font-size: 14px;">
      Jika ada pertanyaan, silakan hubungi kami melalui:
    </p>
    <ul style="color: #555555; font-size: 14px;">
      <li>Telepon / WhatsApp: (0286) XXXXXXX</li>
      <li>Email: ppdb@smkmaarif-karangkobar.sch.id</li>
    </ul>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0 16px;" />
    <p style="color: #999999; font-size: 12px; margin: 0;">
      Email ini dikirim secara otomatis. Mohon tidak membalas email ini.
    </p>
    <p style="color: #999999; font-size: 12px; margin: 4px 0 0;">
      &copy; ${new Date().getFullYear()} SMK Ma'arif NU 01 Karangkobar
    </p>
  </div>
</body>
</html>
  `.trim()

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? `"PPDB SMK Ma'arif NU 01 Karangkobar" <noreply@smkmaarif-karangkobar.sch.id>`,
    to: email,
    subject: `Konfirmasi Pendaftaran PPDB – ${nomorPendaftaran}`,
    html,
  })
}

/**
 * Server Action: submit formulir PPDB.
 *
 * Alur:
 * 1. Re-validasi data di server dengan Zod
 * 2. Generate nomor pendaftaran unik
 * 3. Simpan ke database SQLite
 * 4. Kirim email konfirmasi (non-blocking terhadap response sukses)
 * 5. Return nomor pendaftaran
 *
 * Requirements: 8.4, 8.6
 */
export async function submitPPDB(formData: PPDBFormData): Promise<PPDBSubmitResponse> {
  // 1. Re-validasi di server
  const parsed = ppdbFormSchema.safeParse(formData)
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const data = parsed.data

  // 2. Generate nomor pendaftaran
  const nomorPendaftaran = generateNomorPendaftaran()

  // 3. Simpan ke database SQLite
  try {
    const stmt = db.prepare(`
      INSERT INTO registrasi_ppdb (
        nomorPendaftaran, namaLengkap, nik, tempatLahir, tanggalLahir,
        jenisKelamin, agama, alamat, asalSekolah, nisn, tahunLulus,
        programKeahlianPilihan1, programKeahlianPilihan2,
        namaOrangTua, pekerjaanOrangTua, nomorHP, email, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      nomorPendaftaran,
      data.namaLengkap,
      data.nik,
      data.tempatLahir,
      data.tanggalLahir,
      data.jenisKelamin,
      data.agama,
      data.alamat,
      data.asalSekolah,
      data.nisn,
      data.tahunLulus,
      data.programKeahlianPilihan1,
      data.programKeahlianPilihan2 ?? null,
      data.namaOrangTua,
      data.pekerjaanOrangTua,
      data.nomorHP,
      data.email,
      'pending'
    )
  } catch (dbError) {
    console.error('[PPDB] Database error saat menyimpan pendaftaran:', dbError)
    return {
      success: false,
      errors: { _form: ['Terjadi kesalahan sistem, coba lagi'] },
    }
  }

  // 4. Kirim email konfirmasi — jika gagal, tetap return sukses
  try {
    await sendKonfirmasiEmail(data.email, data.namaLengkap, nomorPendaftaran)
  } catch (emailError) {
    console.error('[PPDB] Gagal mengirim email konfirmasi:', emailError)
    // Tidak melempar error — pendaftaran tetap dianggap berhasil
  }

  // 5. Return sukses
  return {
    success: true,
    nomorPendaftaran,
  }
}
