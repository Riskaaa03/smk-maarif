/**
 * Integration Tests: Alur PPDB End-to-End
 *
 * Validates: Requirements 8.4, 8.5, 8.6
 *
 * - Alur sukses: input valid → Server Action → konfirmasi ditampilkan
 * - Alur error: input tidak valid → error ditampilkan → data valid tidak hilang
 * - Alur error: kegagalan Server Action → pesan error → formulir tetap tampil
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import * as React from 'react'

// ============================================================
// Mock Server Action PPDB
// ============================================================
vi.mock('@/lib/actions/ppdb', () => ({
  submitPPDB: vi.fn(),
}))

import FormPPDB from '@/components/ppdb/FormPPDB'
import { submitPPDB } from '@/lib/actions/ppdb'

const mockSubmitPPDB = vi.mocked(submitPPDB)

// ============================================================
// Setup
// ============================================================
beforeEach(() => {
  vi.clearAllMocks()
})

// ============================================================
// Helper: isi field + blur (react-hook-form mode 'onBlur')
// ============================================================
function fillField(el: HTMLElement, value: string) {
  fireEvent.change(el, { target: { value } })
  fireEvent.blur(el)
}

async function clickSubmit() {
  const submitBtn = screen.getByRole('button', { name: /kirim pendaftaran/i })
  await act(async () => {
    fireEvent.click(submitBtn)
  })
}

function fillAllValidFields() {
  fillField(screen.getByLabelText(/nama lengkap/i), 'Ahmad Fauzi Ramadhan')
  fillField(screen.getByLabelText(/nik/i), '3301012345678901')
  fillField(screen.getByLabelText(/tempat lahir/i), 'Banjarnegara')
  fillField(screen.getByLabelText(/tanggal lahir/i), '2008-01-15')
  fireEvent.click(screen.getByRole('radio', { name: /laki-laki/i }))
  fillField(screen.getByLabelText(/agama/i), 'Islam')
  fillField(screen.getByLabelText(/alamat lengkap/i), 'Jl. Merdeka No. 10, RT 01/RW 02, Karangkobar')
  fillField(screen.getByLabelText(/nama sekolah asal/i), 'SMP Negeri 1 Karangkobar')
  fillField(screen.getByLabelText(/nisn/i), '0012345678')
  const tahunInput = screen.getByLabelText(/tahun lulus/i)
  fireEvent.change(tahunInput, { target: { value: '2024', valueAsNumber: 2024 } })
  fireEvent.blur(tahunInput)
  fireEvent.change(screen.getByLabelText(/pilihan 1/i), { target: { value: 'TBSM' } })
  fireEvent.change(screen.getByLabelText(/pilihan 2/i), { target: { value: 'TJKT' } })
  fillField(screen.getByLabelText(/nama orang tua \/ wali/i), 'Budi Santoso')
  fillField(screen.getByLabelText(/pekerjaan orang tua \/ wali/i), 'Petani')
  fillField(screen.getByLabelText(/nomor hp \/ whatsapp/i), '081234567890')
  fillField(screen.getByLabelText(/alamat email/i), 'ahmad.fauzi@gmail.com')
}

// ============================================================
// Test Suites
// ============================================================

describe('Integration Tests: Alur PPDB End-to-End', () => {
  // ----------------------------------------------------------
  // Alur sukses: input valid → Server Action → konfirmasi
  // ----------------------------------------------------------
  describe('Alur sukses: input valid → Server Action → konfirmasi', () => {
    it('submit dengan data valid memanggil submitPPDB', async () => {
      mockSubmitPPDB.mockResolvedValueOnce({
        success: true,
        nomorPendaftaran: 'PPDB-2026-12345',
      })

      render(<FormPPDB />)
      fillAllValidFields()
      await clickSubmit()

      await waitFor(() => {
        expect(mockSubmitPPDB).toHaveBeenCalledTimes(1)
      })
    })

    it('submit berhasil menampilkan halaman konfirmasi', async () => {
      mockSubmitPPDB.mockResolvedValueOnce({
        success: true,
        nomorPendaftaran: 'PPDB-2026-12345',
      })

      render(<FormPPDB />)
      fillAllValidFields()
      await clickSubmit()

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: /pendaftaran berhasil/i }),
        ).toBeInTheDocument()
      })
    })

    it('submit berhasil menampilkan nomor pendaftaran', async () => {
      mockSubmitPPDB.mockResolvedValueOnce({
        success: true,
        nomorPendaftaran: 'PPDB-2026-12345',
      })

      render(<FormPPDB />)
      fillAllValidFields()
      await clickSubmit()

      await waitFor(() => {
        expect(screen.getByText('PPDB-2026-12345')).toBeInTheDocument()
      })
    })

    it('submit berhasil menyembunyikan formulir', async () => {
      mockSubmitPPDB.mockResolvedValueOnce({
        success: true,
        nomorPendaftaran: 'PPDB-2026-12345',
      })

      render(<FormPPDB />)
      fillAllValidFields()
      await clickSubmit()

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: /pendaftaran berhasil/i }),
        ).toBeInTheDocument()
      })

      expect(screen.queryByRole('button', { name: /kirim pendaftaran/i })).not.toBeInTheDocument()
    })

    it('submit berhasil menampilkan nama pendaftar dalam konfirmasi', async () => {
      mockSubmitPPDB.mockResolvedValueOnce({
        success: true,
        nomorPendaftaran: 'PPDB-2026-12345',
      })

      render(<FormPPDB />)
      fillAllValidFields()
      await clickSubmit()

      await waitFor(() => {
        expect(
          screen.getByText(/ahmad fauzi ramadhan/i),
        ).toBeInTheDocument()
      })
    })
  })

  // ----------------------------------------------------------
  // Alur error: input tidak valid → error ditampilkan
  // ----------------------------------------------------------
  describe('Alur error: input tidak valid → error ditampilkan', () => {
    it('submit formulir kosong menampilkan error pada field wajib', async () => {
      render(<FormPPDB />)
      await clickSubmit()

      await waitFor(() => {
        const alerts = screen.getAllByRole('alert')
        expect(alerts.length).toBeGreaterThan(1)
      })
    })

    it('submit dengan NIK tidak valid menampilkan error spesifik', async () => {
      render(<FormPPDB />)
      fillField(screen.getByLabelText(/nik/i), '12345')
      await clickSubmit()

      await waitFor(() => {
        expect(screen.getByText(/NIK harus 16 digit/i)).toBeInTheDocument()
      })
    })

    it('submit dengan email tidak valid menampilkan error spesifik', async () => {
      render(<FormPPDB />)
      fillField(screen.getByLabelText(/alamat email/i), 'bukan-email')
      await clickSubmit()

      await waitFor(() => {
        expect(screen.getByText(/format email tidak valid/i)).toBeInTheDocument()
      })
    })

    it('submit dengan HP tidak valid menampilkan error spesifik', async () => {
      render(<FormPPDB />)
      fillField(screen.getByLabelText(/nomor hp \/ whatsapp/i), '1234567890')
      await clickSubmit()

      await waitFor(() => {
        expect(screen.getByText(/format nomor hp tidak valid/i)).toBeInTheDocument()
      })
    })

    it('submit dengan NISN tidak valid menampilkan error spesifik', async () => {
      render(<FormPPDB />)
      fillField(screen.getByLabelText(/nisn/i), '12345')
      await clickSubmit()

      await waitFor(() => {
        expect(screen.getByText(/NISN harus 10 digit/i)).toBeInTheDocument()
      })
    })

    it('blur pada field NIK tidak valid menampilkan error tanpa submit', async () => {
      render(<FormPPDB />)
      fillField(screen.getByLabelText(/nik/i), '123')

      await waitFor(() => {
        expect(screen.getByText(/NIK harus 16 digit/i)).toBeInTheDocument()
      })
    })
  })

  // ----------------------------------------------------------
  // Alur error: data valid tidak hilang saat ada error
  // ----------------------------------------------------------
  describe('Alur error: data valid tidak hilang saat ada error', () => {
    it('namaLengkap valid tidak hilang saat NIK error', async () => {
      render(<FormPPDB />)
      fillField(screen.getByLabelText(/nama lengkap/i), 'Ahmad Fauzi Ramadhan')
      fillField(screen.getByLabelText(/nik/i), '123')
      await clickSubmit()

      await waitFor(() => {
        expect(screen.getByText(/NIK harus 16 digit/i)).toBeInTheDocument()
      })

      expect(screen.getByLabelText(/nama lengkap/i)).toHaveValue('Ahmad Fauzi Ramadhan')
    })

    it('email valid tidak hilang saat NIK error', async () => {
      render(<FormPPDB />)
      fillField(screen.getByLabelText(/alamat email/i), 'ahmad.fauzi@gmail.com')
      fillField(screen.getByLabelText(/nik/i), '123')
      await clickSubmit()

      await waitFor(() => {
        expect(screen.getByText(/NIK harus 16 digit/i)).toBeInTheDocument()
      })

      expect(screen.getByLabelText(/alamat email/i)).toHaveValue('ahmad.fauzi@gmail.com')
    })

    it('asalSekolah valid tidak hilang saat NISN error', async () => {
      render(<FormPPDB />)
      fillField(screen.getByLabelText(/nama sekolah asal/i), 'SMP Negeri 1 Karangkobar')
      fillField(screen.getByLabelText(/nisn/i), '123')
      await clickSubmit()

      await waitFor(() => {
        expect(screen.getByText(/NISN harus 10 digit/i)).toBeInTheDocument()
      })

      expect(screen.getByLabelText(/nama sekolah asal/i)).toHaveValue('SMP Negeri 1 Karangkobar')
    })

    it('nomorHP valid tidak hilang saat email error', async () => {
      render(<FormPPDB />)
      fillField(screen.getByLabelText(/nomor hp \/ whatsapp/i), '081234567890')
      fillField(screen.getByLabelText(/alamat email/i), 'bukan-email')
      await clickSubmit()

      await waitFor(() => {
        expect(screen.getByText(/format email tidak valid/i)).toBeInTheDocument()
      })

      expect(screen.getByLabelText(/nomor hp \/ whatsapp/i)).toHaveValue('081234567890')
    })
  })

  // ----------------------------------------------------------
  // Alur error: kegagalan Server Action
  // ----------------------------------------------------------
  describe('Alur error: kegagalan Server Action', () => {
    it('Server Action gagal menampilkan pesan error generik', async () => {
      mockSubmitPPDB.mockResolvedValueOnce({
        success: false,
        errors: { _form: ['Terjadi kesalahan sistem, coba lagi'] },
      })

      render(<FormPPDB />)
      fillAllValidFields()
      await clickSubmit()

      await waitFor(() => {
        expect(
          screen.getByRole('alert'),
        ).toHaveTextContent(/terjadi kesalahan sistem, coba lagi/i)
      })
    })

    it('Server Action gagal tidak menampilkan konfirmasi', async () => {
      mockSubmitPPDB.mockResolvedValueOnce({
        success: false,
        errors: { _form: ['Terjadi kesalahan sistem, coba lagi'] },
      })

      render(<FormPPDB />)
      fillAllValidFields()
      await clickSubmit()

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      expect(screen.queryByText(/pendaftaran berhasil/i)).not.toBeInTheDocument()
    })

    it('Server Action gagal mempertahankan formulir', async () => {
      mockSubmitPPDB.mockResolvedValueOnce({
        success: false,
        errors: { _form: ['Terjadi kesalahan sistem, coba lagi'] },
      })

      render(<FormPPDB />)
      fillAllValidFields()
      await clickSubmit()

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      expect(
        screen.getByRole('button', { name: /kirim pendaftaran/i }),
      ).toBeInTheDocument()
    })
  })
})
