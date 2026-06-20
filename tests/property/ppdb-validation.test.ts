/**
 * Property-Based Tests: Validasi Skema PPDB
 *
 * Validates: Requirements 8.5
 *
 * Property 1: Validasi formulir PPDB menolak data tidak valid dengan error spesifik
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { ppdbFormSchema } from '@/lib/validations/ppdb'
import type { PPDBFormData } from '@/lib/validations/ppdb'

// ============================================================
// Generator digit untuk NIK dan NISN
// ============================================================
const digitChar = fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9')

// Generator karakter alfanumerik aman untuk string fields
const alphaChar = fc.constantFrom(
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' '
)

// Generator string alfanumerik dengan panjang tertentu
const alphaStr = (minLength: number, maxLength: number) =>
  fc.stringOf(alphaChar, { minLength, maxLength }).filter(
    (s) => s.trim().length >= minLength
  )

// ============================================================
// Generator data valid sebagai base
// ============================================================
const validDataArb: fc.Arbitrary<PPDBFormData> = fc.record({
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
      '+6282345678901'
    )
  ),
  // Use a constrained email generator that Zod's email validator accepts
  email: fc.tuple(
    fc.stringOf(fc.constantFrom('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'), { minLength: 1, maxLength: 20 }),
    fc.constantFrom('gmail.com', 'yahoo.com', 'hotmail.com', 'example.com', 'test.org')
  ).map(([local, domain]) => `${local}@${domain}`),
})

// ============================================================
// Property 1: Validasi formulir PPDB menolak data tidak valid
// Validates: Requirements 8.5
// ============================================================
describe('Property 1: Validasi formulir PPDB menolak data tidak valid dengan error spesifik', () => {
  /**
   * Test 1 — NIK bukan 16 digit ditolak
   *
   * NIK yang panjangnya bukan 16 digit harus ditolak dengan error pada field `nik`.
   *
   * **Validates: Requirements 8.5**
   */
  it('Test 1: NIK bukan 16 digit ditolak', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          validDataArb,
          fc.oneof(
            fc.stringOf(digitChar, { minLength: 1, maxLength: 15 }),
            fc.stringOf(digitChar, { minLength: 17, maxLength: 30 })
          )
        ),
        ([validData, invalidNik]) => {
          const data = { ...validData, nik: invalidNik }
          const result = ppdbFormSchema.safeParse(data)

          expect(result.success).toBe(false)
          if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors
            expect(fieldErrors).toHaveProperty('nik')
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Test 2 — NIK berisi non-digit ditolak
   *
   * NIK yang mengandung karakter non-digit (huruf, simbol, dll) harus ditolak
   * dengan error pada field `nik`.
   *
   * **Validates: Requirements 8.5**
   */
  it('Test 2: NIK berisi non-digit ditolak', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          validDataArb,
          fc.string({ minLength: 16, maxLength: 16 }).filter((s) => /\D/.test(s))
        ),
        ([validData, invalidNik]) => {
          const data = { ...validData, nik: invalidNik }
          const result = ppdbFormSchema.safeParse(data)

          expect(result.success).toBe(false)
          if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors
            expect(fieldErrors).toHaveProperty('nik')
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Test 3 — Email tidak valid ditolak
   *
   * String yang bukan format email valid harus ditolak dengan error pada field `email`.
   *
   * **Validates: Requirements 8.5**
   */
  it('Test 3: Email tidak valid ditolak', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          validDataArb,
          fc.oneof(
            fc.constantFrom(
              'bukan-email',
              'test@',
              '@domain.com',
              'noatsign',
              'spaces in@email.com'
            )
          )
        ),
        ([validData, invalidEmail]) => {
          const data = { ...validData, email: invalidEmail }
          const result = ppdbFormSchema.safeParse(data)

          expect(result.success).toBe(false)
          if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors
            expect(fieldErrors).toHaveProperty('email')
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Test 4 — Nomor HP format salah ditolak
   *
   * Nomor HP yang tidak sesuai format 08xx atau +628xx harus ditolak
   * dengan error pada field `nomorHP`.
   *
   * **Validates: Requirements 8.5**
   */
  it('Test 4: Nomor HP format salah ditolak', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          validDataArb,
          fc.oneof(
            fc.constantFrom(
              '1234567890',
              '07123456789',
              '+1234567890',
              '0812',
              'abcdefghij'
            )
          )
        ),
        ([validData, invalidHP]) => {
          const data = { ...validData, nomorHP: invalidHP }
          const result = ppdbFormSchema.safeParse(data)

          expect(result.success).toBe(false)
          if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors
            expect(fieldErrors).toHaveProperty('nomorHP')
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Test 5 — NISN bukan 10 digit ditolak
   *
   * NISN yang panjangnya bukan 10 digit harus ditolak dengan error pada field `nisn`.
   *
   * **Validates: Requirements 8.5**
   */
  it('Test 5: NISN bukan 10 digit ditolak', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          validDataArb,
          fc.oneof(
            fc.stringOf(digitChar, { minLength: 1, maxLength: 9 }),
            fc.stringOf(digitChar, { minLength: 11, maxLength: 20 })
          )
        ),
        ([validData, invalidNisn]) => {
          const data = { ...validData, nisn: invalidNisn }
          const result = ppdbFormSchema.safeParse(data)

          expect(result.success).toBe(false)
          if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors
            expect(fieldErrors).toHaveProperty('nisn')
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Test 6 — Usia kurang dari 12 tahun ditolak
   *
   * Tanggal lahir yang menghasilkan usia kurang dari 12 tahun harus ditolak
   * dengan error pada field `tanggalLahir`.
   *
   * **Validates: Requirements 8.5**
   */
  it('Test 6: Usia kurang dari 12 tahun ditolak', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          validDataArb,
          fc.integer({ min: 0, max: 11 }).map((age) => {
            const d = new Date()
            d.setFullYear(d.getFullYear() - age)
            // Subtract one more day to ensure it's strictly less than 12 years
            d.setDate(d.getDate() + 1)
            return d.toISOString().split('T')[0]
          })
        ),
        ([validData, invalidTanggal]) => {
          const data = { ...validData, tanggalLahir: invalidTanggal }
          const result = ppdbFormSchema.safeParse(data)

          expect(result.success).toBe(false)
          if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors
            expect(fieldErrors).toHaveProperty('tanggalLahir')
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Test 7 — Field valid tidak terpengaruh saat satu field tidak valid
   *
   * Ketika hanya field `nik` yang tidak valid, field lain yang valid (email,
   * nomorHP, nisn, namaLengkap) tidak boleh memiliki error.
   *
   * **Validates: Requirements 8.5**
   */
  it('Test 7: Field valid tidak terpengaruh saat satu field tidak valid', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          validDataArb,
          fc.oneof(
            fc.stringOf(digitChar, { minLength: 1, maxLength: 15 }),
            fc.stringOf(digitChar, { minLength: 17, maxLength: 30 })
          )
        ),
        ([validData, invalidNik]) => {
          const data = { ...validData, nik: invalidNik }
          const result = ppdbFormSchema.safeParse(data)

          expect(result.success).toBe(false)
          if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors

            // Field tidak valid harus ada error
            expect(fieldErrors).toHaveProperty('nik')

            // Field valid tidak boleh terpengaruh
            expect(fieldErrors).not.toHaveProperty('email')
            expect(fieldErrors).not.toHaveProperty('nomorHP')
            expect(fieldErrors).not.toHaveProperty('nisn')
            expect(fieldErrors).not.toHaveProperty('namaLengkap')
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Test 8 — Data sepenuhnya valid diterima (sanity check)
   *
   * Generator data valid harus menghasilkan data yang benar-benar lolos validasi.
   * Ini memastikan generator tidak menghasilkan data yang secara tidak sengaja tidak valid.
   *
   * **Validates: Requirements 8.5**
   */
  it('Test 8: Data sepenuhnya valid diterima (sanity check)', () => {
    fc.assert(
      fc.property(validDataArb, (validData) => {
        const result = ppdbFormSchema.safeParse(validData)
        expect(result.success).toBe(true)
      }),
      { numRuns: 200 }
    )
  })
})
