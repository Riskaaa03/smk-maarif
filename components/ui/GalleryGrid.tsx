'use client'

/**
 * Komponen GalleryGrid — Grid galeri foto dengan lightbox.
 *
 * Requirements: 1.4, 5.1, 5.2, 5.3, 5.4, 6.4
 *
 * Fitur:
 * - Grid responsif: 2 kolom (mobile) → 3 kolom (tablet) → 4 kolom (desktop)
 * - Lightbox modal dengan foto besar, judul, deskripsi, dan navigasi prev/next
 * - Tutup lightbox: tombol X, klik di luar foto, atau tekan Escape
 * - Navigasi keyboard: ArrowLeft / ArrowRight untuk prev/next
 * - Aksesibel: aria-label, role="dialog", aria-modal, focus trap
 * - Hover effect: scale + overlay pada thumbnail
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { GaleriItem } from '@/types/index'

// ============================================================
// Ikon SVG inline (tidak perlu dependensi ikon eksternal)
// ============================================================

function IconClose() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function IconChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function IconImage() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-10 w-10 text-nu-green-200 opacity-60"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

// ============================================================
// Komponen Lightbox
// ============================================================

interface LightboxProps {
  items: GaleriItem[]
  activeIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

function Lightbox({ items, activeIndex, onClose, onPrev, onNext }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const activeItem = items[activeIndex]
  const hasPrev = activeIndex > 0
  const hasNext = activeIndex < items.length - 1

  // Focus trap: kumpulkan semua elemen yang bisa difokus di dalam modal
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!dialogRef.current) return []
    return Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute('disabled'))
  }, [])

  // Tangani keyboard: Escape, ArrowLeft, ArrowRight, Tab (focus trap)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          if (hasPrev) onPrev()
          break
        case 'ArrowRight':
          if (hasNext) onNext()
          break
        case 'Tab': {
          const focusable = getFocusableElements()
          if (focusable.length === 0) return
          const first = focusable[0]
          const last = focusable[focusable.length - 1]
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault()
              last.focus()
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault()
              first.focus()
            }
          }
          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [hasPrev, hasNext, onClose, onPrev, onNext, getFocusableElements])

  // Fokus ke tombol tutup saat lightbox terbuka
  useEffect(() => {
    closeBtnRef.current?.focus()
  }, [])

  // Cegah scroll body saat lightbox terbuka
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  // Klik di luar area foto (pada backdrop) menutup lightbox
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      aria-hidden="false"
    >
      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Lightbox: ${activeItem.judul}`}
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-gray-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header: judul + tombol tutup ── */}
        <div className="flex items-center justify-between gap-4 px-5 py-3 bg-gray-900/80">
          <h2
            id="lightbox-title"
            className="truncate text-base font-semibold text-white"
          >
            {activeItem.judul}
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup lightbox"
            className="flex-shrink-0 rounded-lg p-1.5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <IconClose />
          </button>
        </div>

        {/* ── Area foto ── */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black min-h-0">
          {/* Foto */}
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            <Image
              key={activeItem.id}
              src={activeItem.urlMedia}
              alt={activeItem.judul}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-contain"
              priority
            />
          </div>

          {/* Tombol Prev */}
          {hasPrev && (
            <button
              type="button"
              onClick={onPrev}
              aria-label="Foto sebelumnya"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <IconChevronLeft />
            </button>
          )}

          {/* Tombol Next */}
          {hasNext && (
            <button
              type="button"
              onClick={onNext}
              aria-label="Foto berikutnya"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <IconChevronRight />
            </button>
          )}
        </div>

        {/* ── Footer: deskripsi + counter ── */}
        <div className="flex items-start justify-between gap-4 px-5 py-3 bg-gray-900/80">
          <div className="flex-1 min-w-0">
            {activeItem.deskripsi && (
              <p className="text-sm text-gray-300 line-clamp-2">
                {activeItem.deskripsi}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">{activeItem.kategori}</p>
          </div>
          {/* Counter posisi */}
          <span
            className="flex-shrink-0 text-sm text-gray-400 tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {activeIndex + 1} / {items.length}
          </span>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Komponen GalleryGrid (utama)
// ============================================================

interface GalleryGridProps {
  /** Daftar item galeri yang akan ditampilkan */
  items: GaleriItem[]
}

/**
 * Grid galeri foto responsif dengan lightbox.
 *
 * - 2 kolom pada mobile, 3 kolom pada tablet (md), 4 kolom pada desktop (lg)
 * - Klik thumbnail membuka lightbox dengan foto besar
 * - Navigasi prev/next via tombol atau keyboard (← →)
 * - Tutup dengan tombol X, klik backdrop, atau Escape
 *
 * Requirements: 1.4, 5.1, 5.2, 5.3, 5.4, 6.4
 */
export default function GalleryGrid({ items }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))
  }, [])

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null && prev < items.length - 1 ? prev + 1 : prev,
    )
  }, [items.length])

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
        <IconImage />
        <p className="mt-4 text-sm">Belum ada foto dalam galeri.</p>
      </div>
    )
  }

  return (
    <>
      {/* ── Grid thumbnail ── */}
      <ul
        className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 sm:gap-4"
        aria-label="Galeri foto"
      >
        {items.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => openLightbox(index)}
              aria-label={`Buka foto: ${item.judul}`}
              className="group relative block w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nu-green-600 focus-visible:ring-offset-2"
            >
              {/* Thumbnail — rasio 4:3 */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-nu-green-900">
                <Image
                  src={item.urlMedia}
                  alt={item.judul}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Overlay saat hover */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/0 px-3 text-center opacity-0 transition-all duration-300 group-hover:bg-black/50 group-hover:opacity-100"
                  aria-hidden="true"
                >
                  {/* Ikon zoom */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-white drop-shadow"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  <span className="line-clamp-2 text-xs font-medium text-white drop-shadow">
                    {item.judul}
                  </span>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          activeIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </>
  )
}
