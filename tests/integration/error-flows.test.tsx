/**
 * Integration Tests: Alur Error
 *
 * Validates: Requirements 8.5, 11.4
 *
 * - Halaman 404 kustom ditampilkan untuk URL tidak valid
 * - Formulir PPDB menampilkan error untuk data tidak valid,
 *   dan data valid tidak hilang setelah submit gagal
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import * as React from 'react'

// ============================================================
// Mock next/link sebagai <a> biasa
// ============================================================
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => React.createElement('a', { href, ...props }, children),
}))

// ============================================================
// Mock lucide-react (menghindari masalah SVG rendering)
// ============================================================
vi.mock('lucide-react', () => ({
  Home: () => null,
  User: () => null,
  BookOpen: () => null,
  ClipboardList: () => null,
  AlertTriangle: () => null,
  RefreshCw: () => null,
}))

// ============================================================
// Mock Server Action PPDB
// ============================================================
vi.mock('@/lib/actions/ppdb', () => ({
  submitPPDB: vi.fn(),
}))

// ============================================================
// Import komponen setelah mock
// ============================================================
import NotFound from '@/app/not-found'
import ErrorPage from '@/app/error'
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
// Helper: isi field + blur (untuk react-hook-form mode 'onBlur')
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
// Test Suite
// ============================================================

describe('Integration Tests: Alur Error', () => {
  // ----------------------------------------------------------
  // Halaman 404 Kustom
  // ----------------------------------------------------------
  describe('Halaman 404 Kustom', () => {
    it('menampilkan heading "Halaman Tidak Ditemukan"', () => {
      render(<NotFound />)
      expect(
        screen.getByRole('heading', { level: 1, name: /halaman tidak ditemukan/i }),
      ).toBeInTheDocument()
    })

    it('menampilkan pesan deskriptif dalam Bahasa Indonesia', () => {
      render(<NotFound />)
      const paragraphs = document.querySelectorAll('p')
      const hasDescriptiveText = Array.from(paragraphs).some(
        (p) =>
          /halaman/i.test(p.textContent ?? '') ||
          /tidak ditemukan/i.test(p.textContent ?? ''),
      )
      expect(hasDescriptiveText).toBe(true)
    })

    it('memiliki tombol/tautan "Kembali ke Beranda" yang mengarah ke "/"', () => {
      render(<NotFound />)
      const links = screen.getAllByRole('link')
      const homeLink = links.find(
        (link) =>
          link.getAttribute('href') === '/' &&
          /beranda/i.test(link.textContent ?? ''),
      )
      expect(homeLink).toBeDefined()
      expect(homeLink).toBeInTheDocument()
    })

    it('menampilkan tautan ke halaman Profil, Program Keahlian, dan PPDB', () => {
      render(<NotFound />)
      expect(screen.getByRole('link', { name: /profil sekolah/i })).toHaveAttribute('href', '/profil')
      expect(screen.getByRole('link', { name: /program keahlian/i })).toHaveAttribute('href', '/program-keahlian')
      expect(screen.getByRole('link', { name: /ppdb/i })).toHaveAttribute('href', '/ppdb')
    })

    it('tidak menampilkan stack trace atau informasi teknis', () => {
      render(<NotFound />)
      expect(document.querySelector('pre')).toBeNull()
      expect(document.querySelector('code')).toBeNull()
      const bodyText = document.body.textContent ?? ''
      expect(/\bat\s+\w+\s*\(/.test(bodyText)).toBe(false)
    })

    it('halaman dapat diakses (aria-labelledby pada main)', () => {
      render(<NotFound />)
      const main = document.querySelector('main')
      expect(main).toHaveAttribute('aria-labelledby', 'not-found-heading')
    })
  })

  // ----------------------------------------------------------
  // Error Boundary
  // ----------------------------------------------------------
  describe('Error Boundary', () => {
    const mockError = new Error('Test error message')
    const mockReset = vi.fn()

    it('menampilkan heading "Terjadi Kesalahan"', () => {
      render(<ErrorPage error={mockError} reset={mockReset} />)
      expect(
        screen.getByRole('heading', { level: 1, name: /terjadi kesalahan/i }),
      ).toBeInTheDocument()
    })

    it('memiliki tombol "Coba Lagi" yang memanggil reset()', () => {
      render(<ErrorPage error={mockError} reset={mockReset} />)
      const btn = screen.getByRole('button', { name: /coba muat ulang halaman ini/i })
      expect(btn).toBeInTheDocument()
      fireEvent.click(btn)
      expect(mockReset).toHaveBeenCalledTimes(1)
    })

    it('memiliki tautan "Kembali ke Beranda" yang mengarah ke "/"', () => {
      render(<ErrorPage error={mockError} reset={mockReset} />)
      const link = screen.getByRole('link', { name: /kembali ke halaman beranda/i })
      expect(link).toHaveAttribute('href', '/')
    })

    it('tidak menampilkan error.message kepada pengguna', () => {
      const sensitiveError = new Error('Database connection failed')
      render(<ErrorPage error={sensitiveError} reset={mockReset} />)
      expect(screen.queryByText('Database connection failed')).not.toBeInTheDocument()
    })

    it('tidak menampilkan stack trace', () => {
      render(<ErrorPage error={mockError} reset={mockReset} />)
      expect(document.querySelector('pre')).toBeNull()
      expect(document.querySelector('code')).toBeNull()
    })

    it('log error ke console', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      render(<ErrorPage error={mockError} reset={mockReset} />)
      expect(consoleSpy).toHaveBeenCalledWith(mockError)
      consoleSpy.mockRestore()
    })
  })

  // ----------------------------------------------------------
  // Alur Error PPDB — data tidak valid
  // ----------------------------------------------------------
  describe('Alur Error PPDB — data tidak valid', () => {
    it('menampilkan pesan error saat submit dengan NIK tidak valid', async () => {
      render(<FormPPDB />)
      fillField(screen.getByLabelText(/nik/i), '123')
      await clickSubmit()
      await waitFor(() => {
        expect(screen.getByText(/NIK harus 16 digit/i)).toBeInTheDocument()
      })
    })

    it('menampilkan pesan error saat submit dengan email tidak valid', async () => {
      render(<FormPPDB />)
      fillField(screen.getByLabelText(/alamat email/i), 'bukan-email')
      await clickSubmit()
      await waitFor(() => {
        expect(screen.getByText(/format email tidak valid/i)).toBeInTheDocument()
      })
    })

    it('menampilkan pesan error saat submit tanpa memilih program keahlian', async () => {
      render(<FormPPDB />)
      await clickSubmit()
      await waitFor(() => {
        expect(
          screen.getByText(/program keahlian pilihan 1 harus dipilih/i),
        ).toBeInTheDocument()
      })
    })

    it('data field valid tidak hilang setelah submit dengan error', async () => {
      render(<FormPPDB />)
      fillField(screen.getByLabelText(/nama lengkap/i), 'Ahmad Fajar')
      fillField(screen.getByLabelText(/nik/i), '123')
      await clickSubmit()
      await waitFor(() => {
        expect(screen.getByText(/NIK harus 16 digit/i)).toBeInTheDocument()
      })
      expect(screen.getByLabelText(/nama lengkap/i)).toHaveValue('Ahmad Fajar')
    })

    it('data email valid tidak hilang saat field lain error', async () => {
      render(<FormPPDB />)
      fillField(screen.getByLabelText(/alamat email/i), 'valid@test.com')
      fillField(screen.getByLabelText(/nik/i), '123')
      await clickSubmit()
      await waitFor(() => {
        expect(screen.getByText(/NIK harus 16 digit/i)).toBeInTheDocument()
      })
      expect(screen.getByLabelText(/alamat email/i)).toHaveValue('valid@test.com')
    })

    it('server error ditampilkan saat submitPPDB gagal', async () => {
      mockSubmitPPDB.mockResolvedValueOnce({
        success: false,
        errors: { _form: ['Terjadi kesalahan sistem'] },
      })
      render(<FormPPDB />)
      fillAllValidFields()
      await clickSubmit()
      await waitFor(() => {
        const alert = screen.getByRole('alert')
        expect(alert).toHaveTextContent(/terjadi kesalahan sistem/i)
      })
    })
  })
})
