/**
 * Unit tests untuk fungsi utilitas PPDB
 * Memverifikasi format generateNomorPendaftaran() dan formatTanggal()
 * Requirements: 8.4
 */

import * as fc from 'fast-check'
import { generateNomorPendaftaran, formatTanggal } from '../../lib/ppdb'

// ── generateNomorPendaftaran ─────────────────────────────────────────────────

describe('generateNomorPendaftaran()', () => {
  it('menghasilkan format PPDB-YYYY-XXXXX yang benar', () => {
    const result = generateNomorPendaftaran()
    expect(result).toMatch(/^PPDB-\d{4}-\d{5}$/)
  })

  it('bagian tahun sesuai dengan tahun saat ini', () => {
    const result = generateNomorPendaftaran()
    const year = new Date().getFullYear().toString()
    const parts = result.split('-')
    expect(parts[1]).toBe(year)
  })

  it('sufiks 5 digit adalah angka yang valid (00000–99999)', () => {
    const result = generateNomorPendaftaran()
    const suffix = result.split('-')[2]
    expect(suffix).toHaveLength(5)
    const num = parseInt(suffix, 10)
    expect(num).toBeGreaterThanOrEqual(0)
    expect(num).toBeLessThanOrEqual(99999)
  })

  it('menghasilkan nilai unik untuk 100 pemanggilan', () => {
    const results = Array.from({ length: 100 }, () => generateNomorPendaftaran())
    const unique = new Set(results)
    expect(unique.size).toBe(100)
  })

  /**
   * Property test: memanggil fungsi N kali menghasilkan semua nilai unik
   * Validates: Requirements 8.4
   */
  it('property: N pemanggilan menghasilkan semua nilai unik', () => {
    fc.assert(
      fc.property(fc.integer({ min: 2, max: 50 }), (n) => {
        const results = Array.from({ length: n }, () => generateNomorPendaftaran())
        const unique = new Set(results)
        return unique.size === n
      }),
    )
  })
})

// ── formatTanggal ────────────────────────────────────────────────────────────

describe('formatTanggal()', () => {
  it('memformat Date object dengan benar: 15 Januari 2024', () => {
    const result = formatTanggal(new Date(2024, 0, 15))
    expect(result).toContain('Januari')
    expect(result).toContain('2024')
    expect(result).toContain('15')
  })

  it('memformat string tanggal dengan benar: 17 Juni 2024', () => {
    const result = formatTanggal('2024-06-17')
    expect(result).toContain('Juni')
    expect(result).toContain('2024')
    expect(result).toContain('17')
  })

  it('memformat tanggal akhir tahun dengan benar: 31 Desember 2025', () => {
    const result = formatTanggal(new Date(2025, 11, 31))
    expect(result).toContain('Desember')
    expect(result).toContain('2025')
    expect(result).toContain('31')
  })

  it('menghasilkan semua 12 nama bulan Bahasa Indonesia dengan benar', () => {
    const expectedMonths = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ]

    expectedMonths.forEach((bulan, index) => {
      const result = formatTanggal(new Date(2024, index, 1))
      expect(result).toContain(bulan)
    })
  })

  it('menerima baik Date object maupun string sebagai input', () => {
    const dateObj = new Date(2024, 2, 20)
    const dateStr = '2024-03-20'

    const resultFromDate = formatTanggal(dateObj)
    const resultFromString = formatTanggal(dateStr)

    // Keduanya harus mengandung bulan dan tahun yang sama
    expect(resultFromDate).toContain('Maret')
    expect(resultFromDate).toContain('2024')
    expect(resultFromString).toContain('Maret')
    expect(resultFromString).toContain('2024')
  })
})
