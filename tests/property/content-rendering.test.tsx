/**
 * Property-Based Tests: Rendering Koleksi Konten
 *
 * **Validates: Requirements 1.4, 1.5, 1.6, 1.7, 3.1, 3.2, 3.3, 3.4, 6.2, 8.2**
 *
 * Property 3: Rendering koleksi konten menampilkan semua item dengan field yang diperlukan
 *
 * Untuk setiap koleksi konten (foto, mitra, berita, ekstrakurikuler) yang diberikan,
 * komponen yang merender koleksi tersebut SHALL menampilkan semua item dengan field
 * yang dipersyaratkan, dengan batasan:
 * - GaleriSection: maksimal 6 foto
 * - BeritaTerbaruSection: 3 artikel terbaru
 * - MitraIndustriSection: semua mitra
 * - EkstrakurikulerSection: semua item atau default 10 item
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { render, screen, cleanup, within } from '@testing-library/react'
import * as React from 'react'
import GaleriSection from '@/components/home/GaleriSection'
import BeritaTerbaruSection from '@/components/home/BeritaTerbaruSection'
import MitraIndustriSection from '@/components/home/MitraIndustriSection'
import EkstrakurikulerSection from '@/components/home/EkstrakurikulerSection'
import type { GaleriItem, Berita, MitraIndustri } from '@/types/index'

// ============================================================
// Mocks
// ============================================================

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) =>
    React.createElement('img', { src, alt, ...props }),
}))

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

vi.mock('@/lib/utils', () => ({
  formatTanggal: (date: Date) => new Date(date).toLocaleDateString('id-ID'),
}))

// ============================================================
// Arbitraries
// ============================================================

/** GaleriItem arbitrary */
const galeriItemArb: fc.Arbitrary<GaleriItem> = fc.record({
  id: fc.uuid(),
  judul: fc.string({ minLength: 3, maxLength: 50 }).filter((s) => s.trim().length >= 3),
  deskripsi: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
  urlMedia: fc.constant('https://example.com/foto.jpg'),
  tipeMedia: fc.constantFrom('foto' as const, 'video' as const),
  kategori: fc.string({ minLength: 3, maxLength: 20 }),
  tanggal: fc.date(),
  urutan: fc.integer({ min: 0, max: 100 }),
  createdAt: fc.date(),
})

/** Berita arbitrary */
const beritaArb: fc.Arbitrary<Berita> = fc.record({
  id: fc.uuid(),
  slug: fc
    .string({ minLength: 3, maxLength: 50 })
    .map((s) =>
      s
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
    )
    .filter((s) => s.length >= 3),
  judul: fc.string({ minLength: 5, maxLength: 80 }),
  ringkasan: fc.string({ minLength: 10, maxLength: 200 }),
  konten: fc.string({ minLength: 10, maxLength: 500 }),
  thumbnail: fc.constant('https://example.com/thumbnail.jpg'),
  kategori: fc.constantFrom(
    'berita' as const,
    'pengumuman' as const,
    'prestasi' as const,
    'kegiatan' as const,
  ),
  penulis: fc.string({ minLength: 3, maxLength: 50 }),
  tanggalPublikasi: fc.date(),
  diterbitkan: fc.boolean(),
  createdAt: fc.date(),
  updatedAt: fc.date(),
})

/** MitraIndustri arbitrary (logoUrl = null agar namaMitra selalu ditampilkan) */
const mitraArb: fc.Arbitrary<MitraIndustri> = fc.record({
  id: fc.uuid(),
  namaMitra: fc.string({ minLength: 3, maxLength: 50 }),
  logoUrl: fc.constant(null),
  bidangUsaha: fc.string({ minLength: 3, maxLength: 50 }),
  kotaDomisili: fc.string({ minLength: 3, maxLength: 30 }),
  hasMOU: fc.boolean(),
  tanggalMOU: fc.constant(null),
  tempatPKL: fc.boolean(),
  urutan: fc.integer({ min: 0, max: 100 }),
})

// ============================================================
// Property 3: GaleriSection
// Validates: Requirements 1.4, 6.2
// ============================================================
describe('Property 3: GaleriSection — rendering koleksi foto', () => {
  /**
   * Test 1 — GaleriSection menampilkan semua item (maks 6) dari koleksi
   *
   * Untuk array GaleriItem acak dengan panjang 1–20, GaleriSection harus
   * merender tombol "Buka foto:" sebanyak min(items.length, 6).
   *
   * **Validates: Requirements 1.4**
   */
  it('Test 1: GaleriSection menampilkan semua item (maks 6) dari koleksi', () => {
    fc.assert(
      fc.property(fc.array(galeriItemArb, { minLength: 1, maxLength: 20 }), (items) => {
        render(<GaleriSection items={items} />)
        const buttons = screen.queryAllByRole('button', { name: /^Buka foto:/ })
        expect(buttons.length).toBe(Math.min(items.length, 6))
        cleanup()
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Test 2 — GaleriSection menampilkan placeholder saat koleksi kosong
   *
   * Ketika items = [], GaleriSection tidak boleh merender
   * <ul aria-label="Galeri foto"> dan harus menampilkan teks placeholder.
   *
   * **Validates: Requirements 1.4**
   */
  it('Test 2: GaleriSection menampilkan placeholder saat koleksi kosong', () => {
    render(<GaleriSection items={[]} />)
    const list = screen.queryByRole('list', { name: 'Galeri foto' })
    expect(list).toBeNull()
    expect(screen.getByText(/Belum ada foto dalam galeri kegiatan/i)).toBeInTheDocument()
    cleanup()
  })

  /**
   * Test 3 — GaleriSection: setiap item memiliki judul yang ditampilkan
   *
   * Untuk array GaleriItem acak dengan panjang 1–6 dan ID unik, setiap item dalam
   * items.slice(0, 6) harus memiliki tombol dengan aria-label
   * "Buka foto: {item.judul}".
   *
   * **Validates: Requirements 1.4**
   */
  it('Test 3: GaleriSection — setiap item memiliki judul yang ditampilkan', () => {
    // Use uniqueArray with selector on id to ensure unique React keys
    const uniqueGaleriItemsArb = fc
      .uniqueArray(galeriItemArb, { selector: (item) => item.id, minLength: 1, maxLength: 6 })

    fc.assert(
      fc.property(uniqueGaleriItemsArb, (items) => {
        const { container } = render(<GaleriSection items={items} />)
        const displayItems = items.slice(0, 6)
        // Collect all aria-label values from rendered buttons
        const allButtons = container.querySelectorAll('button[aria-label]')
        const ariaLabels = Array.from(allButtons).map((btn) => btn.getAttribute('aria-label'))
        for (const item of displayItems) {
          const expectedLabel = `Buka foto: ${item.judul}`
          expect(ariaLabels).toContain(expectedLabel)
        }
        cleanup()
      }),
      { numRuns: 100 },
    )
  })
})

// ============================================================
// Property 3: BeritaTerbaruSection
// Validates: Requirements 1.7, 3.4, 8.2
// ============================================================
describe('Property 3: BeritaTerbaruSection — rendering koleksi berita', () => {
  /**
   * Test 4 — BeritaTerbaruSection menampilkan maks 3 artikel terbaru
   *
   * Untuk array Berita acak dengan panjang 1–10, BeritaTerbaruSection harus
   * merender tepat min(articles.length, 3) elemen <li> dalam daftar berita.
   *
   * **Validates: Requirements 1.7**
   */
  it('Test 4: BeritaTerbaruSection menampilkan maks 3 artikel terbaru', () => {
    fc.assert(
      fc.property(fc.array(beritaArb, { minLength: 1, maxLength: 10 }), (articles) => {
        render(<BeritaTerbaruSection articles={articles} />)
        const list = screen.queryByRole('list', { name: 'Daftar berita terbaru' })
        expect(list).not.toBeNull()
        const items = within(list!).queryAllByRole('listitem')
        expect(items.length).toBe(Math.min(articles.length, 3))
        cleanup()
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Test 5 — BeritaTerbaruSection menampilkan placeholder saat tidak ada artikel
   *
   * Ketika articles = [], BeritaTerbaruSection tidak boleh merender
   * <ul aria-label="Daftar berita terbaru">.
   *
   * **Validates: Requirements 1.7**
   */
  it('Test 5: BeritaTerbaruSection menampilkan placeholder saat tidak ada artikel', () => {
    render(<BeritaTerbaruSection articles={[]} />)
    const list = screen.queryByRole('list', { name: 'Daftar berita terbaru' })
    expect(list).toBeNull()
    expect(screen.getByText(/Belum ada berita yang diterbitkan/i)).toBeInTheDocument()
    cleanup()
  })

  /**
   * Test 6 — BeritaTerbaruSection: setiap artikel memiliki judul dan ringkasan
   *
   * Untuk array Berita acak dengan panjang 1–3, setiap artikel dalam
   * articles.slice(0, 3) harus memiliki judul dan ringkasan yang tampil di DOM.
   *
   * **Validates: Requirements 1.7, 3.4**
   */
  it('Test 6: BeritaTerbaruSection — setiap artikel memiliki judul dan ringkasan', () => {
    fc.assert(
      fc.property(fc.array(beritaArb, { minLength: 1, maxLength: 3 }), (articles) => {
        render(<BeritaTerbaruSection articles={articles} />)
        const displayArticles = articles.slice(0, 3)
        for (const article of displayArticles) {
          // Judul harus ada di DOM (mungkin sebagai teks dalam elemen heading/link)
          expect(document.body.textContent).toContain(article.judul)
          // Ringkasan harus ada di DOM
          expect(document.body.textContent).toContain(article.ringkasan)
        }
        cleanup()
      }),
      { numRuns: 100 },
    )
  })
})

// ============================================================
// Property 3: MitraIndustriSection
// Validates: Requirements 1.5, 3.1, 3.2, 3.3
// ============================================================
describe('Property 3: MitraIndustriSection — rendering koleksi mitra', () => {
  /**
   * Test 7 — MitraIndustriSection menampilkan semua mitra
   *
   * Untuk array MitraIndustri acak dengan panjang 1–15, MitraIndustriSection
   * harus merender tepat items.length elemen <li> dalam daftar mitra.
   *
   * **Validates: Requirements 1.5**
   */
  it('Test 7: MitraIndustriSection menampilkan semua mitra', () => {
    fc.assert(
      fc.property(fc.array(mitraArb, { minLength: 1, maxLength: 15 }), (items) => {
        render(<MitraIndustriSection items={items} />)
        const list = screen.queryByRole('list', { name: 'Daftar mitra industri' })
        expect(list).not.toBeNull()
        const listItems = within(list!).queryAllByRole('listitem')
        expect(listItems.length).toBe(items.length)
        cleanup()
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Test 8 — MitraIndustriSection: setiap mitra menampilkan namaMitra
   *
   * Untuk array MitraIndustri acak (tanpa logoUrl) dengan panjang 1–5,
   * setiap mitra harus menampilkan namaMitra di DOM.
   *
   * **Validates: Requirements 1.5, 3.1, 3.2, 3.3**
   */
  it('Test 8: MitraIndustriSection — setiap mitra menampilkan namaMitra', () => {
    fc.assert(
      fc.property(fc.array(mitraArb, { minLength: 1, maxLength: 5 }), (items) => {
        render(<MitraIndustriSection items={items} />)
        for (const mitra of items) {
          expect(document.body.textContent).toContain(mitra.namaMitra)
        }
        cleanup()
      }),
      { numRuns: 100 },
    )
  })
})

// ============================================================
// Property 3: EkstrakurikulerSection
// Validates: Requirements 1.6, 6.2
// ============================================================
describe('Property 3: EkstrakurikulerSection — rendering koleksi ekstrakurikuler', () => {
  /**
   * Test 9 — EkstrakurikulerSection menampilkan semua item yang diberikan
   *
   * Untuk array string acak dengan panjang 1–15, EkstrakurikulerSection
   * harus merender tepat items.length elemen <li> dalam daftar ekstrakurikuler.
   *
   * **Validates: Requirements 1.6**
   */
  it('Test 9: EkstrakurikulerSection menampilkan semua item yang diberikan', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 3, maxLength: 30 }), { minLength: 1, maxLength: 15 }),
        (items) => {
          render(<EkstrakurikulerSection items={items} />)
          const list = screen.queryByRole('list', { name: 'Daftar ekstrakurikuler' })
          expect(list).not.toBeNull()
          const listItems = within(list!).queryAllByRole('listitem')
          expect(listItems.length).toBe(items.length)
          cleanup()
        },
      ),
      { numRuns: 100 },
    )
  })

  /**
   * Test 10 — EkstrakurikulerSection menggunakan default items saat tidak ada props
   *
   * Ketika EkstrakurikulerSection dirender tanpa props items, komponen harus
   * menggunakan DEFAULT_EKSKUL (10 item) dan merender tepat 10 elemen <li>.
   *
   * **Validates: Requirements 1.6**
   */
  it('Test 10: EkstrakurikulerSection menggunakan default items saat tidak ada props', () => {
    render(<EkstrakurikulerSection />)
    const list = screen.queryByRole('list', { name: 'Daftar ekstrakurikuler' })
    expect(list).not.toBeNull()
    const listItems = within(list!).queryAllByRole('listitem')
    expect(listItems.length).toBe(10)
    cleanup()
  })
})
