import Image from 'next/image'
import Link from 'next/link'
import { type Berita } from '@/types/index'
import { formatTanggal } from '@/lib/utils'

// ============================================================
// Konfigurasi badge warna per kategori
// Requirements: 1.7, 6.3
// ============================================================
const kategoriBadgeConfig: Record<
  Berita['kategori'],
  { label: string; className: string }
> = {
  berita: {
    label: 'Berita',
    className: 'bg-blue-100 text-blue-700 border border-blue-200',
  },
  pengumuman: {
    label: 'Pengumuman',
    className: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  },
  prestasi: {
    label: 'Prestasi',
    className: 'bg-nu-green-100 text-nu-green-700 border border-nu-green-200',
  },
  kegiatan: {
    label: 'Kegiatan',
    className: 'bg-purple-100 text-purple-700 border border-purple-200',
  },
}

// ============================================================
// Ikon placeholder saat tidak ada thumbnail
// ============================================================
function ThumbnailPlaceholder() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-gradient-to-br from-nu-green-700 to-nu-green-900"
      aria-hidden="true"
    >
      {/* Ikon dokumen/artikel */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-12 w-12 text-nu-green-200 opacity-70"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    </div>
  )
}

// ============================================================
// Props
// ============================================================
interface ArticleCardProps {
  article: Berita
}

/**
 * Komponen kartu artikel untuk menampilkan berita/artikel sekolah.
 *
 * Menampilkan thumbnail, badge kategori, judul, tanggal (format Indonesia),
 * ringkasan, dan tautan ke halaman detail artikel.
 *
 * Requirements: 1.7, 6.3
 */
export default function ArticleCard({ article }: ArticleCardProps) {
  const { label: badgeLabel, className: badgeClassName } =
    kategoriBadgeConfig[article.kategori]

  const tanggalFormatted = formatTanggal(article.tanggalPublikasi)
  const articleHref = `/berita/${article.slug}`

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* ── Thumbnail ── */}
      <Link
        href={articleHref}
        aria-label={`Baca artikel: ${article.judul}`}
        className="relative block aspect-video w-full overflow-hidden bg-nu-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nu-green-600 focus-visible:ring-offset-2"
        tabIndex={-1}
      >
        {article.thumbnail ? (
          <Image
            src={article.thumbnail}
            alt={article.judul}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <ThumbnailPlaceholder />
        )}
      </Link>

      {/* ── Konten ── */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Badge kategori */}
        <span
          className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClassName}`}
        >
          {badgeLabel}
        </span>

        {/* Judul */}
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900">
          <Link
            href={articleHref}
            aria-label={`Baca artikel: ${article.judul}`}
            className="hover:text-nu-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nu-green-600 focus-visible:ring-offset-1 rounded"
          >
            {article.judul}
          </Link>
        </h3>

        {/* Tanggal */}
        <time
          dateTime={
            article.tanggalPublikasi instanceof Date
              ? article.tanggalPublikasi.toISOString()
              : new Date(article.tanggalPublikasi).toISOString()
          }
          className="text-xs text-gray-500"
        >
          {tanggalFormatted}
        </time>

        {/* Ringkasan */}
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
          {article.ringkasan}
        </p>

        {/* Tautan selengkapnya */}
        <Link
          href={articleHref}
          aria-label={`Selengkapnya tentang: ${article.judul}`}
          className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-nu-green-700 hover:text-nu-green-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nu-green-600 focus-visible:ring-offset-1 rounded"
        >
          Selengkapnya
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </article>
  )
}
