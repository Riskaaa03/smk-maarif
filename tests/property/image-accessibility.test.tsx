/**
 * Property-Based Tests: Aksesibilitas Gambar
 *
 * Validates: Requirements 10.5
 *
 * Property 6: Aksesibilitas — semua gambar memiliki atribut alt yang tidak kosong
 *
 * For any halaman website yang dirender, semua elemen <img> SHALL memiliki
 * atribut `alt` yang tidak kosong sehingga dapat dibaca oleh teknologi assistif
 * (screen reader).
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { render, screen } from '@testing-library/react'
import * as React from 'react'
import GalleryGrid from '@/components/ui/GalleryGrid'
import ArticleCard from '@/components/ui/ArticleCard'
import type { GaleriItem, Berita } from '@/types/index'

// ============================================================
// Helpers
// ============================================================

/**
 * Kembalikan semua elemen <img> yang dirender di dalam container.
 * next/image merender sebagai <img> di lingkungan jsdom.
 */
function getAllImages(container: HTMLElement): HTMLImageElement[] {
  return Array.from(container.querySelectorAll('img'))
}

/**
 * Assert bahwa setiap <img> memiliki atribut alt yang tidak kosong.
 */
function assertAllImagesHaveAlt(images: HTMLImageElement[]): void {
  for (const img of images) {
    const alt = img.getAttribute('alt')
    expect(alt, `<img src="${img.getAttribute('src')}"> harus memiliki atribut alt`).not.toBeNull()
    expect(alt, `<img src="${img.getAttribute('src')}"> atribut alt tidak boleh string kosong`).not.toBe('')
  }
}

// ============================================================
// Arbitraries
// ============================================================

/** Karakter aman untuk judul dan deskripsi (tanpa karakter kontrol) */
const safeChar = fc.constantFrom(
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', '-', '_',
)

const safeStr = (minLength: number, maxLength: number) =>
  fc.stringOf(safeChar, { minLength, maxLength }).filter((s) => s.trim().length >= minLength)

/** Generator satu GaleriItem dengan judul dan deskripsi acak */
const galeriItemArb: fc.Arbitrary<GaleriItem> = fc.record({
  id: fc.uuid(),
  judul: safeStr(3, 80),
  deskripsi: fc.oneof(fc.constant(null), safeStr(5, 200)),
  urlMedia: fc.constant('https://placehold.co/400x300/png'),
  tipeMedia: fc.constantFrom('foto' as const, 'video' as const),
  kategori: fc.constantFrom('kegiatan', 'prestasi', 'fasilitas', 'lainnya'),
  tanggal: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
  urutan: fc.integer({ min: 1, max: 100 }),
  createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
})

/** Generator array GaleriItem (1–20 item) */
const galeriItemsArb: fc.Arbitrary<GaleriItem[]> = fc.array(galeriItemArb, {
  minLength: 1,
  maxLength: 20,
})

/** Generator satu Berita dengan thumbnail acak */
const beritaWithThumbnailArb: fc.Arbitrary<Berita> = fc.record({
  id: fc.uuid(),
  slug: safeStr(3, 50).map((s) => s.toLowerCase().replace(/\s+/g, '-')),
  judul: safeStr(5, 100),
  ringkasan: safeStr(10, 300),
  konten: safeStr(20, 500),
  thumbnail: fc.constant('https://placehold.co/640x360/png'),
  kategori: fc.constantFrom(
    'berita' as const,
    'pengumuman' as const,
    'prestasi' as const,
    'kegiatan' as const,
  ),
  penulis: safeStr(3, 50),
  tanggalPublikasi: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
  diterbitkan: fc.boolean(),
  createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
  updatedAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
})

/** Generator Berita tanpa thumbnail (thumbnail kosong string) */
const beritaWithoutThumbnailArb: fc.Arbitrary<Berita> = beritaWithThumbnailArb.map((b) => ({
  ...b,
  thumbnail: '',
}))

// ============================================================
// Property 6: Aksesibilitas — semua gambar memiliki atribut alt yang tidak kosong
// Validates: Requirements 10.5
// ============================================================
describe('Property 6: Aksesibilitas — semua gambar memiliki atribut alt yang tidak kosong', () => {
  /**
   * Test 1 — GalleryGrid: setiap thumbnail memiliki alt dari judul item
   *
   * Untuk array GaleriItem acak dengan berbagai judul dan deskripsi,
   * setiap <img> yang dirender oleh GalleryGrid harus memiliki atribut alt
   * yang tidak null dan tidak kosong.
   *
   * **Validates: Requirements 10.5**
   */
  it('Test 1: GalleryGrid — setiap thumbnail memiliki atribut alt tidak kosong', () => {
    fc.assert(
      fc.property(galeriItemsArb, (items) => {
        const { container } = render(<GalleryGrid items={items} />)
        const images = getAllImages(container)

        // Harus ada gambar yang dirender (satu per item)
        expect(images.length).toBeGreaterThan(0)

        // Setiap gambar harus memiliki alt yang tidak kosong
        assertAllImagesHaveAlt(images)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Test 2 — GalleryGrid: alt gambar sesuai dengan judul item
   *
   * Atribut alt pada setiap thumbnail harus sama persis dengan judul
   * GaleriItem yang bersangkutan, bukan string generik atau kosong.
   *
   * **Validates: Requirements 10.5**
   */
  it('Test 2: GalleryGrid — alt gambar sesuai dengan judul item', () => {
    fc.assert(
      fc.property(galeriItemsArb, (items) => {
        const { container } = render(<GalleryGrid items={items} />)
        const images = getAllImages(container)

        // Kumpulkan semua nilai alt yang dirender
        const renderedAlts = images.map((img) => img.getAttribute('alt'))

        // Setiap judul item harus muncul sebagai alt di salah satu gambar
        for (const item of items) {
          expect(
            renderedAlts,
            `alt "${item.judul}" harus ada di antara gambar yang dirender`,
          ).toContain(item.judul)
        }
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Test 3 — GalleryGrid: jumlah gambar sesuai jumlah item
   *
   * Jumlah elemen <img> yang dirender harus sama dengan jumlah GaleriItem
   * yang diberikan (satu thumbnail per item).
   *
   * **Validates: Requirements 10.5**
   */
  it('Test 3: GalleryGrid — jumlah gambar sesuai jumlah item', () => {
    fc.assert(
      fc.property(galeriItemsArb, (items) => {
        const { container } = render(<GalleryGrid items={items} />)
        const images = getAllImages(container)

        expect(images.length).toBe(items.length)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Test 4 — ArticleCard dengan thumbnail: gambar memiliki alt dari judul artikel
   *
   * Ketika ArticleCard dirender dengan artikel yang memiliki thumbnail,
   * elemen <img> harus memiliki atribut alt yang tidak kosong dan sesuai
   * dengan judul artikel.
   *
   * **Validates: Requirements 10.5**
   */
  it('Test 4: ArticleCard dengan thumbnail — gambar memiliki alt tidak kosong', () => {
    fc.assert(
      fc.property(beritaWithThumbnailArb, (article) => {
        const { container } = render(<ArticleCard article={article} />)
        const images = getAllImages(container)

        // Harus ada tepat satu gambar (thumbnail artikel)
        expect(images.length).toBe(1)

        // Gambar harus memiliki alt yang tidak kosong
        assertAllImagesHaveAlt(images)

        // Alt harus sesuai dengan judul artikel
        expect(images[0].getAttribute('alt')).toBe(article.judul)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Test 5 — ArticleCard tanpa thumbnail: tidak ada <img> yang dirender
   *
   * Ketika ArticleCard dirender tanpa thumbnail (thumbnail = ''), komponen
   * harus menampilkan placeholder SVG (bukan <img>), sehingga tidak ada
   * elemen <img> tanpa alt yang muncul.
   *
   * **Validates: Requirements 10.5**
   */
  it('Test 5: ArticleCard tanpa thumbnail — tidak ada img tanpa alt', () => {
    fc.assert(
      fc.property(beritaWithoutThumbnailArb, (article) => {
        const { container } = render(<ArticleCard article={article} />)
        const images = getAllImages(container)

        // Tanpa thumbnail, tidak ada <img> yang dirender (placeholder pakai SVG)
        // Jika ada <img>, semuanya harus memiliki alt yang tidak kosong
        assertAllImagesHaveAlt(images)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Test 6 — GalleryGrid: alt tidak pernah undefined atau null
   *
   * Memastikan secara eksplisit bahwa tidak ada <img> dengan alt === null
   * atau alt === undefined, bahkan untuk item dengan judul yang mengandung
   * karakter khusus atau spasi.
   *
   * **Validates: Requirements 10.5**
   */
  it('Test 6: GalleryGrid — alt tidak pernah null atau undefined', () => {
    fc.assert(
      fc.property(galeriItemsArb, (items) => {
        const { container } = render(<GalleryGrid items={items} />)
        const images = getAllImages(container)

        for (const img of images) {
          // getAttribute('alt') mengembalikan null jika atribut tidak ada
          expect(img.getAttribute('alt')).not.toBeNull()
          // Nilai alt tidak boleh string 'undefined' atau 'null'
          expect(img.getAttribute('alt')).not.toBe('undefined')
          expect(img.getAttribute('alt')).not.toBe('null')
        }
      }),
      { numRuns: 100 },
    )
  })
})
