/**
 * Property-Based Tests: Data PPDB Round-Trip
 *
 * Validates: Requirements 8.4
 *
 * Property 2: Data PPDB round-trip — tersimpan dan dapat diambil kembali secara identik
 *
 * Karena ini adalah property test (bukan integration test dengan DB nyata),
 * digunakan in-memory store mock untuk `saveRegistrasi` dan `getRegistrasiById`.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import * as fc from 'fast-check'
import { generateNomorPendaftaran } from '@/lib/ppdb'
import type { PPDBFormData } from '@/lib/validations/ppdb'

// ============================================================
// In-memory store untuk simulasi penyimpanan dan pengambilan data
// ============================================================

interface RegistrasiRecord {
  id: string
  nomorPendaftaran: string
  data: PPDBFormData
  tanggalDaftar: string
}

class InMemoryRegistrasiStore {
  private store: Map<string, RegistrasiRecord> = new Map()
  private counter = 0

  saveRegistrasi(data: PPDBFormData): { id: string; nomorPendaftaran: string } {
    const id = `reg-${++this.counter}`
    const nomorPendaftaran = generateNomorPendaftaran()
    const record: RegistrasiRecord = {
      id,
      nomorPendaftaran,
      data: { ...data },
      tanggalDaftar: new Date().toISOString(),
    }
    this.store.set(id, record)
    return { id, nomorPendaftaran }
  }

  getRegistrasiById(id: string): RegistrasiRecord | undefined {
    return this.store.get(id)
  }

  getAllNomorPendaftaran(): string[] {
    return Array.from(this.store.values()).map((r) => r.nomorPendaftaran)
  }

  clear(): void {
    this.store.clear()
    this.counter = 0
  }
}

// ============================================================
// Generator karakter
// ============================================================
const digitChar = fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9')

const alphaChar = fc.constantFrom(
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' '
)

const alphaStr = (minLength: number, maxLength: number) =>
  fc.stringOf(alphaChar, { minLength, maxLength }).filter(
    (s) => s.trim().length >= minLength
  )

// ============================================================
// Generator objek PPDBFormData yang valid secara acak
// ============================================================
const validPPDBDataArb: fc.Arbitrary<PPDBFormData> = fc.record({
  namaLengkap: alphaStr(3, 100),
  nik: fc.stringOf(digitChar, { minLength: 16, maxLength: 16 }),
  tempatLahir: alphaStr(2, 50),
  tanggalLahir: fc.integer({ min: 13, max: 80 }).map((age) => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - age)
    return d.toISOString().split('T')[0]
  }),
  jenisKelamin: fc.constantFrom('L' as const, 'P' as const),
  agama: fc.constantFrom('Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha'),
  alamat: alphaStr(10, 255),
  asalSekolah: alphaStr(3, 100),
  nisn: fc.stringOf(digitChar, { minLength: 10, maxLength: 10 }),
  tahunLulus: fc.constantFrom(2020, 2021, 2022, 2023, 2024, 2025),
  programKeahlianPilihan1: fc.constantFrom('TBSM' as const, 'TJKT' as const, 'AKL' as const),
  programKeahlianPilihan2: fc.constantFrom(null, 'TBSM' as const, 'TJKT' as const, 'AKL' as const),
  namaOrangTua: alphaStr(3, 100),
  pekerjaanOrangTua: alphaStr(2, 50),
  nomorHP: fc.oneof(
    fc.constantFrom(
      '081234567890',
      '082345678901',
      '+6281234567890',
      '+6282345678901',
      '085678901234',
      '087890123456'
    )
  ),
  email: fc.tuple(
    fc.stringOf(
      fc.constantFrom(
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
      ),
      { minLength: 1, maxLength: 20 }
    ),
    fc.constantFrom('gmail.com', 'yahoo.com', 'hotmail.com', 'example.com', 'test.org')
  ).map(([local, domain]) => `${local}@${domain}`),
})

// ============================================================
// Property 2: Data PPDB round-trip — tersimpan dan dapat diambil kembali secara identik
// Validates: Requirements 8.4
// ============================================================
describe('Property 2: Data PPDB round-trip — tersimpan dan dapat diambil kembali secara identik', () => {
  let store: InMemoryRegistrasiStore

  beforeEach(() => {
    store = new InMemoryRegistrasiStore()
  })

  /**
   * Test 1 — Data yang disimpan dapat diambil kembali secara identik
   *
   * Untuk sembarang data PPDB yang valid, setelah `saveRegistrasi(data)`,
   * `getRegistrasiById(id)` harus mengembalikan data yang identik dengan
   * data yang disimpan (round-trip).
   *
   * **Validates: Requirements 8.4**
   */
  it('Test 1: Data yang disimpan dapat diambil kembali secara identik (round-trip)', () => {
    fc.assert(
      fc.property(validPPDBDataArb, (formData) => {
        // Reset store untuk setiap run agar tidak ada interferensi
        store.clear()

        // Simpan data
        const { id } = store.saveRegistrasi(formData)

        // Ambil kembali data
        const retrieved = store.getRegistrasiById(id)

        // Harus ada
        expect(retrieved).toBeDefined()

        // Semua field harus identik
        expect(retrieved!.data.namaLengkap).toBe(formData.namaLengkap)
        expect(retrieved!.data.nik).toBe(formData.nik)
        expect(retrieved!.data.tempatLahir).toBe(formData.tempatLahir)
        expect(retrieved!.data.tanggalLahir).toBe(formData.tanggalLahir)
        expect(retrieved!.data.jenisKelamin).toBe(formData.jenisKelamin)
        expect(retrieved!.data.agama).toBe(formData.agama)
        expect(retrieved!.data.alamat).toBe(formData.alamat)
        expect(retrieved!.data.asalSekolah).toBe(formData.asalSekolah)
        expect(retrieved!.data.nisn).toBe(formData.nisn)
        expect(retrieved!.data.tahunLulus).toBe(formData.tahunLulus)
        expect(retrieved!.data.programKeahlianPilihan1).toBe(formData.programKeahlianPilihan1)
        expect(retrieved!.data.programKeahlianPilihan2).toBe(formData.programKeahlianPilihan2)
        expect(retrieved!.data.namaOrangTua).toBe(formData.namaOrangTua)
        expect(retrieved!.data.pekerjaanOrangTua).toBe(formData.pekerjaanOrangTua)
        expect(retrieved!.data.nomorHP).toBe(formData.nomorHP)
        expect(retrieved!.data.email).toBe(formData.email)
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Test 2 — Semua nomorPendaftaran untuk N pendaftaran acak adalah unik
   *
   * Untuk N pendaftaran acak yang disimpan secara berurutan,
   * semua `nomorPendaftaran` yang dihasilkan harus unik (tidak ada duplikat).
   *
   * **Validates: Requirements 8.4**
   */
  it('Test 2: Semua nomorPendaftaran untuk N pendaftaran acak adalah unik', () => {
    fc.assert(
      fc.property(
        fc.array(validPPDBDataArb, { minLength: 2, maxLength: 20 }),
        (formDataList) => {
          // Reset store untuk setiap run
          store.clear()

          // Simpan semua pendaftaran
          const nomorList: string[] = []
          for (const formData of formDataList) {
            const { nomorPendaftaran } = store.saveRegistrasi(formData)
            nomorList.push(nomorPendaftaran)
          }

          // Semua nomor pendaftaran harus unik
          const uniqueNomor = new Set(nomorList)
          expect(uniqueNomor.size).toBe(nomorList.length)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Test 3 — ID yang tidak ada mengembalikan undefined
   *
   * `getRegistrasiById` dengan ID yang tidak ada harus mengembalikan undefined,
   * bukan melempar error atau mengembalikan data yang salah.
   *
   * **Validates: Requirements 8.4**
   */
  it('Test 3: ID yang tidak ada mengembalikan undefined', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter((s) => !s.startsWith('reg-')),
        (nonExistentId) => {
          store.clear()
          const result = store.getRegistrasiById(nonExistentId)
          expect(result).toBeUndefined()
        }
      ),
      { numRuns: 100 }
    )
  })
})
