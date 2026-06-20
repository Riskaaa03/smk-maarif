import type { Metadata } from 'next'
import Link from 'next/link'
import PPDBInfoSection from '@/components/ppdb/PPDBInfoSection'
import AlurPendaftaran from '@/components/ppdb/AlurPendaftaran'
import PersyaratanDokumen from '@/components/ppdb/PersyaratanDokumen'
import FormPPDB from '@/components/ppdb/FormPPDB'

// ============================================================
// SSR — formulir dinamis, data real-time (Requirements: 8.1–8.6)
// ============================================================
export const dynamic = 'force-dynamic'

// ============================================================
// Metadata SEO
// ============================================================
export const metadata: Metadata = {
  title: 'PPDB - Penerimaan Peserta Didik Baru',
  description:
    "Daftar sekarang! Informasi lengkap PPDB SMK Ma'arif NU 01 Karangkobar: jadwal pendaftaran, alur, persyaratan dokumen, dan formulir pendaftaran online.",
}

// ============================================================
// Halaman PPDB — Server Component (SSR)
// ============================================================
export default function PPDBPage() {
  return (
    <main>
      {/* ── Hero Split Layout ── */}
      <div className="relative overflow-hidden bg-nu-green-900">
        {/* Decorative circle */}
        <div
          className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-amber-500/[0.07]"
          aria-hidden="true"
        />
        {/* Right-panel subtle overlay */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 border-l border-white/[0.06] bg-white/[0.025]"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2">
          {/* Left: headline */}
          <div className="flex flex-col justify-center px-8 py-14 md:px-12 md:py-16 lg:px-16">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-400">
              SMK Ma&apos;arif NU 01 Karangkobar
            </p>
            <h1 className="mb-3 font-serif text-5xl font-bold leading-[1.05] text-white md:text-6xl">
              PPDB<br />2026/2027
            </h1>
            <p className="mb-9 max-w-sm text-sm leading-relaxed text-white/60">
              Penerimaan Peserta Didik Baru — Daftarkan diri Anda sekarang dan
              mulai perjalanan bersama kami.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#form-ppdb-heading"
                className="inline-flex items-center gap-2 rounded bg-amber-500 px-6 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-amber-600"
              >
                Daftar Sekarang
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="#informasi"
                className="inline-flex items-center gap-2 rounded border border-white/25 px-6 py-3 text-[13px] font-semibold text-white/80 transition-colors hover:bg-white/10"
              >
                Lihat Informasi
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right: info cards */}
          <div className="flex flex-col justify-center gap-3 px-8 py-10 md:px-10 md:py-12">
            {/* Periode */}
            <div className="flex items-start gap-3.5 rounded-md border border-white/10 bg-white/[0.07] p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 mt-0.5">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <p className="mb-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-white/40">
                  Periode Pendaftaran
                </p>
                <p className="text-sm font-medium text-white">
                  11 Februari – 04 Juli 2026
                </p>
              </div>
            </div>

            {/* Jurusan */}
            <div className="flex items-start gap-3.5 rounded-md border border-white/10 bg-white/[0.07] p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 mt-0.5">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <p className="mb-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-white/40">
                  Jurusan Tersedia
                </p>
                <p className="text-sm font-medium text-white">
                  TKJ · Farmasi · Akuntansi
                </p>
              </div>
            </div>

            {/* Pengumuman */}
            <div className="flex items-start gap-3.5 rounded-md border border-white/10 bg-white/[0.07] p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 mt-0.5">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <p className="mb-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-white/40">
                  Pengumuman
                </p>
                <p className="text-sm font-medium text-white">06 Juli 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div
        className="mx-auto max-w-4xl px-4 py-16 space-y-16 sm:px-6 lg:px-8"
        id="informasi"
      >
        {/* ── Section 1: Informasi PPDB (Req 8.1) ── */}
        <PPDBInfoSection />

        {/* ── Section 2: Alur Pendaftaran (Req 8.2) ── */}
        <AlurPendaftaran />

        {/* ── Section 3: Persyaratan Dokumen (Req 8.3) ── */}
        <PersyaratanDokumen />

        {/* ── Section 4: Formulir Pendaftaran (Req 8.4, 8.5, 8.6) ── */}
        <section aria-labelledby="form-ppdb-heading" id="form-ppdb-heading">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-600">
              Daftar Sekarang
            </span>
            <span className="h-px w-8 bg-amber-600/40" aria-hidden="true" />
          </div>
          <h2 className="mb-1 font-serif text-2xl font-bold text-gray-900">
            Formulir Pendaftaran Online
          </h2>
          <p className="mb-8 max-w-xl text-sm leading-relaxed text-gray-500">
            Isi formulir di bawah ini dengan data yang benar dan lengkap. Pastikan
            alamat email yang Anda masukkan aktif karena konfirmasi pendaftaran
            akan dikirim ke email tersebut.
          </p>
          <FormPPDB />
        </section>

        {/* ── CTA Kontak ── */}
        <div className="grid grid-cols-1 items-center gap-8 rounded-xl bg-nu-green-800 p-8 sm:grid-cols-[1fr_auto] md:p-12">
          <div>
            <h2 className="mb-2 font-serif text-xl font-bold text-white">
              Ada Pertanyaan?
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-white/60">
              Hubungi panitia PPDB SMK Ma&apos;arif NU 01 Karangkobar jika Anda
              membutuhkan informasi lebih lanjut atau mengalami kendala dalam
              proses pendaftaran.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row sm:items-center">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded bg-white px-5 py-2.5 text-[13px] font-semibold text-nu-green-800 transition-colors hover:bg-nu-green-50 whitespace-nowrap"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.852L0 24l6.335-1.652A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.213-3.727.972.993-3.62-.234-.373A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
              </svg>
              Hubungi via WhatsApp
            </a>
            <Link
              href="/profil"
              className="inline-flex items-center justify-center gap-2 rounded border border-white/25 px-5 py-2.5 text-[13px] font-semibold text-white/80 transition-colors hover:bg-white/10 whitespace-nowrap"
            >
              Lihat Informasi Kontak
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
