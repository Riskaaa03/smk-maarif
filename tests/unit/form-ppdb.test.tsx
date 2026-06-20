/**
 * Unit Tests: Komponen <FormPPDB />
 *
 * Validates: Requirements 8.4, 8.5
 *
 * Sub-tasks:
 * - Test render semua field
 * - Test pesan error muncul untuk field tidak valid
 * - Test data field valid tidak hilang saat ada error di field lain
 * - Test tampilan konfirmasi setelah submit berhasil
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within, fireEvent, act } from '@testing-library/react'
import * as React from 'react'
import FormPPDB from '@/components/ppdb/FormPPDB'

// ============================================================
// Mock Server Action
// ============================================================

vi.mock('@/lib/actions/ppdb', () => ({
  submitPPDB: vi.fn(),
}))

import { submitPPDB } from '@/lib/actions/ppdb'
const mockSubmitPPDB = vi.mocked(submitPPDB)

// ============================================================
// Data helper
// ============================================================

/** Data formulir yang sepenuhnya valid untuk digunakan dalam test */
const validFormData = {
  namaLengkap: 'Ahmad Fauzi Ramadhan',
  nik: '3301012345678901',
  tempatLahir: 'Banjarnegara',
  tanggalLahir: '2008-01-15',
  jenisKelamin: 'L' as const,
  agama: 'Islam',
  alamat: 'Jl. Merdeka No. 10, RT 01/RW 02, Karangkobar',
  asalSekolah: 'SMP Negeri 1 Karangkobar',
  nisn: '0012345678',
  tahunLulus: 2024,
  programKeahlianPilihan1: 'TBSM' as const,
  programKeahlianPilihan2: null,
  namaOrangTua: 'Budi Santoso',
  pekerjaanOrangTua: 'Petani',
  nomorHP: '081234567890',
  email: 'ahmad.fauzi@gmail.com',
}

/**
 * Helper untuk mengisi field dengan fireEvent untuk kecepatan.
 * fireEvent lebih cepat daripada userEvent.type (tidak mensimulasikan
 * keystroke per karakter).
 */
function fillField(el: HTMLElement, value: string) {
  fireEvent.change(el, { target: { value } })
  fireEvent.blur(el)
}

/**
 * Mengisi semua field formulir dengan data yang valid menggunakan fireEvent.
 * React Hook Form memerlukan event change + blur untuk memperbarui state internal.
 */
function fillValidForm() {
  fillField(screen.getByLabelText(/nama lengkap/i), validFormData.namaLengkap)
  fillField(screen.getByLabelText(/nik/i), validFormData.nik)
  fillField(screen.getByLabelText(/tempat lahir/i), validFormData.tempatLahir)
  fillField(screen.getByLabelText(/tanggal lahir/i), validFormData.tanggalLahir)

  // Jenis kelamin: radio button
  fireEvent.click(screen.getByRole('radio', { name: /laki-laki/i }))

  fillField(screen.getByLabelText(/agama/i), validFormData.agama)
  fillField(screen.getByLabelText(/alamat lengkap/i), validFormData.alamat)
  fillField(screen.getByLabelText(/nama sekolah asal/i), validFormData.asalSekolah)
  fillField(screen.getByLabelText(/nisn/i), validFormData.nisn)

  // Tahun lulus: input type="number" dengan valueAsNumber
  const tahunLulusInput = screen.getByLabelText(/tahun lulus/i)
  fireEvent.change(tahunLulusInput, {
    target: { value: String(validFormData.tahunLulus), valueAsNumber: validFormData.tahunLulus },
  })
  fireEvent.blur(tahunLulusInput)

  // Program keahlian pilihan 1: select
  fireEvent.change(screen.getByLabelText(/pilihan 1/i), { target: { value: 'TBSM' } })

  // Program keahlian pilihan 2: opsional, pilih nilai valid agar tidak menyebabkan error validasi
  // Schema ppdb tidak menerima empty string ('') untuk enum field ini
  fireEvent.change(screen.getByLabelText(/pilihan 2/i), { target: { value: 'TJKT' } })

  fillField(screen.getByLabelText(/nama orang tua \/ wali/i), validFormData.namaOrangTua)
  fillField(screen.getByLabelText(/pekerjaan orang tua \/ wali/i), validFormData.pekerjaanOrangTua)
  fillField(screen.getByLabelText(/nomor hp \/ whatsapp/i), validFormData.nomorHP)
  fillField(screen.getByLabelText(/alamat email/i), validFormData.email)
}

/**
 * Submit form dan tunggu react-hook-form memproses validasi / submission.
 */
async function clickSubmit() {
  const submitBtn = screen.getByRole('button', { name: /kirim pendaftaran/i })
  await act(async () => {
    fireEvent.click(submitBtn)
  })
}

// ============================================================
// Setup
// ============================================================

beforeEach(() => {
  vi.clearAllMocks()
})

// ============================================================
// Test Suite 1: Render semua field
// ============================================================

describe('Render semua field formulir', () => {
  it('menampilkan field namaLengkap', () => {
    render(<FormPPDB />)
    expect(screen.getByLabelText(/nama lengkap/i)).toBeInTheDocument()
  })

  it('menampilkan field NIK', () => {
    render(<FormPPDB />)
    expect(screen.getByLabelText(/nik/i)).toBeInTheDocument()
  })

  it('menampilkan field tempatLahir', () => {
    render(<FormPPDB />)
    expect(screen.getByLabelText(/tempat lahir/i)).toBeInTheDocument()
  })

  it('menampilkan field tanggalLahir', () => {
    render(<FormPPDB />)
    expect(screen.getByLabelText(/tanggal lahir/i)).toBeInTheDocument()
  })

  it('menampilkan field jenisKelamin (radio Laki-laki dan Perempuan)', () => {
    render(<FormPPDB />)
    expect(screen.getByRole('radio', { name: /laki-laki/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /perempuan/i })).toBeInTheDocument()
  })

  it('menampilkan field agama', () => {
    render(<FormPPDB />)
    expect(screen.getByLabelText(/agama/i)).toBeInTheDocument()
  })

  it('menampilkan field alamat', () => {
    render(<FormPPDB />)
    expect(screen.getByLabelText(/alamat lengkap/i)).toBeInTheDocument()
  })

  it('menampilkan field asalSekolah', () => {
    render(<FormPPDB />)
    expect(screen.getByLabelText(/nama sekolah asal/i)).toBeInTheDocument()
  })

  it('menampilkan field NISN', () => {
    render(<FormPPDB />)
    expect(screen.getByLabelText(/nisn/i)).toBeInTheDocument()
  })

  it('menampilkan field tahunLulus', () => {
    render(<FormPPDB />)
    expect(screen.getByLabelText(/tahun lulus/i)).toBeInTheDocument()
  })

  it('menampilkan field programKeahlianPilihan1', () => {
    render(<FormPPDB />)
    expect(screen.getByLabelText(/pilihan 1/i)).toBeInTheDocument()
  })

  it('menampilkan field programKeahlianPilihan2', () => {
    render(<FormPPDB />)
    expect(screen.getByLabelText(/pilihan 2/i)).toBeInTheDocument()
  })

  it('menampilkan field namaOrangTua', () => {
    render(<FormPPDB />)
    expect(screen.getByLabelText(/nama orang tua \/ wali/i)).toBeInTheDocument()
  })

  it('menampilkan field pekerjaanOrangTua', () => {
    render(<FormPPDB />)
    expect(screen.getByLabelText(/pekerjaan orang tua \/ wali/i)).toBeInTheDocument()
  })

  it('menampilkan field nomorHP', () => {
    render(<FormPPDB />)
    expect(screen.getByLabelText(/nomor hp \/ whatsapp/i)).toBeInTheDocument()
  })

  it('menampilkan field email', () => {
    render(<FormPPDB />)
    expect(screen.getByLabelText(/alamat email/i)).toBeInTheDocument()
  })

  it('menampilkan tombol submit', () => {
    render(<FormPPDB />)
    expect(screen.getByRole('button', { name: /kirim pendaftaran/i })).toBeInTheDocument()
  })

  it('menampilkan opsi TBSM, TJKT, AKL pada pilihan program keahlian 1', () => {
    render(<FormPPDB />)
    const select = screen.getByLabelText(/pilihan 1/i)
    expect(within(select as HTMLElement).getByRole('option', { name: /TBSM/i })).toBeInTheDocument()
    expect(within(select as HTMLElement).getByRole('option', { name: /TJKT/i })).toBeInTheDocument()
    expect(within(select as HTMLElement).getByRole('option', { name: /AKL/i })).toBeInTheDocument()
  })
})

// ============================================================
// Test Suite 2: Pesan error untuk field tidak valid
// ============================================================

describe('Pesan error muncul untuk field tidak valid', () => {
  it('menampilkan error NIK harus 16 digit saat NIK kurang dari 16 digit', async () => {
    render(<FormPPDB />)

    fillField(screen.getByLabelText(/nik/i), '123456789')

    await waitFor(() => {
      expect(screen.getByText(/NIK harus 16 digit/i)).toBeInTheDocument()
    })
  })

  it('menampilkan error format email tidak valid saat email salah format', async () => {
    render(<FormPPDB />)

    fillField(screen.getByLabelText(/alamat email/i), 'bukan-email-valid')

    await waitFor(() => {
      expect(screen.getByText(/format email tidak valid/i)).toBeInTheDocument()
    })
  })

  it('menampilkan error format nomor HP tidak valid saat HP salah format', async () => {
    render(<FormPPDB />)

    fillField(screen.getByLabelText(/nomor hp \/ whatsapp/i), '1234567890')

    await waitFor(() => {
      expect(screen.getByText(/format nomor hp tidak valid/i)).toBeInTheDocument()
    })
  })

  it('menampilkan error NISN harus 10 digit saat NISN kurang dari 10 digit', async () => {
    render(<FormPPDB />)

    fillField(screen.getByLabelText(/nisn/i), '12345')

    await waitFor(() => {
      expect(screen.getByText(/NISN harus 10 digit/i)).toBeInTheDocument()
    })
  })

  it('menampilkan error nama lengkap minimal 3 karakter saat nama terlalu pendek', async () => {
    render(<FormPPDB />)

    fillField(screen.getByLabelText(/nama lengkap/i), 'AB')

    await waitFor(() => {
      expect(screen.getByText(/nama lengkap minimal 3 karakter/i)).toBeInTheDocument()
    })
  })

  it('menampilkan error usia minimal 12 tahun saat tanggal lahir terlalu muda', async () => {
    render(<FormPPDB />)

    // Tanggal lahir 5 tahun yang lalu (terlalu muda)
    const fiveYearsAgo = new Date()
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5)
    const tanggalStr = fiveYearsAgo.toISOString().split('T')[0]

    fillField(screen.getByLabelText(/tanggal lahir/i), tanggalStr)

    await waitFor(() => {
      expect(screen.getByText(/usia minimal 12 tahun/i)).toBeInTheDocument()
    })
  })

  it('menampilkan error program keahlian pilihan 1 harus dipilih saat submit tanpa pilihan', async () => {
    render(<FormPPDB />)

    await clickSubmit()

    await waitFor(() => {
      expect(
        screen.getByText(/program keahlian pilihan 1 harus dipilih/i),
      ).toBeInTheDocument()
    })
  })

  it('menampilkan error jenis kelamin harus dipilih saat submit tanpa memilih jenis kelamin', async () => {
    render(<FormPPDB />)

    await clickSubmit()

    await waitFor(() => {
      expect(screen.getByText(/jenis kelamin harus dipilih/i)).toBeInTheDocument()
    })
  })

  it('menampilkan error alamat minimal 10 karakter saat alamat terlalu pendek', async () => {
    render(<FormPPDB />)

    fillField(screen.getByLabelText(/alamat lengkap/i), 'Jl. A')

    await waitFor(() => {
      expect(screen.getByText(/alamat minimal 10 karakter/i)).toBeInTheDocument()
    })
  })

  it('menampilkan beberapa error sekaligus saat submit dengan banyak field tidak valid', async () => {
    render(<FormPPDB />)

    fillField(screen.getByLabelText(/nik/i), '123')
    fillField(screen.getByLabelText(/alamat email/i), 'bukan-email')

    await clickSubmit()

    await waitFor(() => {
      expect(screen.getByText(/NIK harus 16 digit/i)).toBeInTheDocument()
      expect(screen.getByText(/format email tidak valid/i)).toBeInTheDocument()
    })
  })
})

// ============================================================
// Test Suite 3: Data field valid tidak hilang saat ada error di field lain
// ============================================================

describe('Data field valid tidak hilang saat ada error di field lain', () => {
  it('nilai namaLengkap yang valid tetap ada saat NIK tidak valid', async () => {
    render(<FormPPDB />)

    fillField(screen.getByLabelText(/nama lengkap/i), 'Ahmad Fajar')
    fillField(screen.getByLabelText(/nik/i), '123')

    await clickSubmit()

    await waitFor(() => {
      expect(screen.getByText(/NIK harus 16 digit/i)).toBeInTheDocument()
    })

    expect(screen.getByLabelText(/nama lengkap/i)).toHaveValue('Ahmad Fajar')
  })

  it('nilai email yang valid tetap ada saat NIK tidak valid', async () => {
    render(<FormPPDB />)

    fillField(screen.getByLabelText(/alamat email/i), 'test@example.com')
    fillField(screen.getByLabelText(/nik/i), '123')

    await clickSubmit()

    await waitFor(() => {
      expect(screen.getByText(/NIK harus 16 digit/i)).toBeInTheDocument()
    })

    expect(screen.getByLabelText(/alamat email/i)).toHaveValue('test@example.com')
  })

  it('nilai nomorHP yang valid tetap ada saat email tidak valid', async () => {
    render(<FormPPDB />)

    fillField(screen.getByLabelText(/nomor hp \/ whatsapp/i), '081234567890')
    fillField(screen.getByLabelText(/alamat email/i), 'bukan-email')

    await clickSubmit()

    await waitFor(() => {
      expect(screen.getByText(/format email tidak valid/i)).toBeInTheDocument()
    })

    expect(screen.getByLabelText(/nomor hp \/ whatsapp/i)).toHaveValue('081234567890')
  })

  it('nilai asalSekolah yang valid tetap ada saat NISN tidak valid', async () => {
    render(<FormPPDB />)

    fillField(screen.getByLabelText(/nama sekolah asal/i), 'SMP Negeri 1 Karangkobar')
    fillField(screen.getByLabelText(/nisn/i), '123')

    await clickSubmit()

    await waitFor(() => {
      expect(screen.getByText(/NISN harus 10 digit/i)).toBeInTheDocument()
    })

    expect(screen.getByLabelText(/nama sekolah asal/i)).toHaveValue('SMP Negeri 1 Karangkobar')
  })

  it('field yang valid tidak memiliki pesan error saat field lain tidak valid', async () => {
    render(<FormPPDB />)

    fillField(screen.getByLabelText(/nama lengkap/i), 'Ahmad Fauzi Ramadhan')
    fillField(screen.getByLabelText(/nik/i), '123')

    await clickSubmit()

    await waitFor(() => {
      expect(screen.getByText(/NIK harus 16 digit/i)).toBeInTheDocument()
    })

    // Tidak boleh ada error untuk nama lengkap karena nilai sudah valid
    expect(screen.queryByText(/nama lengkap minimal 3 karakter/i)).not.toBeInTheDocument()
  })
})

// ============================================================
// Test Suite 4: Tampilan konfirmasi setelah submit berhasil
// ============================================================

describe('Tampilan konfirmasi setelah submit berhasil', () => {
  it('menampilkan konfirmasi setelah submit berhasil', async () => {
    mockSubmitPPDB.mockResolvedValueOnce({
      success: true,
      nomorPendaftaran: 'PPDB-2026-00001',
    })

    render(<FormPPDB />)
    fillValidForm()
    await clickSubmit()

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /pendaftaran berhasil/i })).toBeInTheDocument()
    })
  })

  it('menampilkan nomor pendaftaran pada konfirmasi', async () => {
    mockSubmitPPDB.mockResolvedValueOnce({
      success: true,
      nomorPendaftaran: 'PPDB-2026-00001',
    })

    render(<FormPPDB />)
    fillValidForm()
    await clickSubmit()

    await waitFor(() => {
      expect(screen.getByText('PPDB-2026-00001')).toBeInTheDocument()
    })
  })

  it('menampilkan nama pendaftar pada halaman konfirmasi', async () => {
    mockSubmitPPDB.mockResolvedValueOnce({
      success: true,
      nomorPendaftaran: 'PPDB-2026-00001',
    })

    render(<FormPPDB />)
    fillValidForm()
    await clickSubmit()

    await waitFor(() => {
      expect(screen.getByText(new RegExp(validFormData.namaLengkap, 'i'))).toBeInTheDocument()
    })
  })

  it('menyembunyikan formulir setelah submit berhasil', async () => {
    mockSubmitPPDB.mockResolvedValueOnce({
      success: true,
      nomorPendaftaran: 'PPDB-2026-00001',
    })

    render(<FormPPDB />)
    fillValidForm()
    await clickSubmit()

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /pendaftaran berhasil/i })).toBeInTheDocument()
    })

    // Formulir tidak boleh lagi ditampilkan
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /kirim pendaftaran/i })).not.toBeInTheDocument()
  })

  it('menampilkan error server saat submit gagal', async () => {
    mockSubmitPPDB.mockResolvedValueOnce({
      success: false,
      errors: { _form: ['Terjadi kesalahan sistem'] },
    })

    render(<FormPPDB />)
    fillValidForm()
    await clickSubmit()

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/terjadi kesalahan sistem/i)
    })
  })

  it('tidak menampilkan halaman konfirmasi sebelum submit', () => {
    render(<FormPPDB />)
    expect(screen.queryByText(/pendaftaran berhasil/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/nomor pendaftaran anda/i)).not.toBeInTheDocument()
  })
})
