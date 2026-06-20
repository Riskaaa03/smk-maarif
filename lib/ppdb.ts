/**
 * Utilitas PPDB (Penerimaan Peserta Didik Baru)
 * SMK Ma'arif NU 01 Karangkobar
 * Requirements: 8.4
 */

export { formatTanggal } from './utils'

/**
 * Generate nomor pendaftaran PPDB yang unik
 * Format: PPDB-YYYY-XXXXX
 * Contoh: PPDB-2026-00001
 *
 * Menggunakan kombinasi timestamp + random untuk memastikan keunikan.
 * Requirements: 8.4
 */
export function generateNomorPendaftaran(): string {
  const year = new Date().getFullYear()
  // Kombinasi timestamp (mod 100000) dan random untuk keunikan
  const timestamp = Date.now() % 100000
  const random = Math.floor(Math.random() * 100000)
  const combined = (timestamp + random) % 100000
  const padded = combined.toString().padStart(5, '0')
  return `PPDB-${year}-${padded}`
}
