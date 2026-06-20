'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

// Mapping path segment ke label Bahasa Indonesia
const PATH_LABELS: Record<string, string> = {
  profil: 'Profil Sekolah',
  'program-keahlian': 'Program Keahlian',
  tbsm: 'TBSM',
  tjkt: 'TJKT',
  akl: 'AKL',
  kurikulum: 'Kurikulum',
  'sarana-prasarana': 'Sarana & Prasarana',
  kesiswaan: 'Kesiswaan',
  humas: 'Humas',
  ppdb: 'PPDB',
  berita: 'Berita',
  galeri: 'Galeri',
  search: 'Hasil Pencarian',
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  /** Override manual untuk item breadcrumb. Jika tidak diberikan, breadcrumb
   *  dibangun otomatis dari pathname saat ini. "Beranda" selalu ditambahkan
   *  sebagai item pertama secara otomatis. */
  items?: BreadcrumbItem[]
}

/**
 * Mengubah slug menjadi label yang lebih mudah dibaca.
 * Contoh: "artikel-terbaru" → "Artikel Terbaru"
 */
function slugToLabel(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Membangun daftar breadcrumb dari pathname saat ini.
 * Selalu dimulai dari "Beranda" (/).
 */
function buildBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)

  const items: BreadcrumbItem[] = [{ label: 'Beranda', href: '/' }]

  let currentPath = ''
  for (const segment of segments) {
    currentPath += `/${segment}`
    const label = PATH_LABELS[segment] ?? slugToLabel(segment)
    items.push({ label, href: currentPath })
  }

  return items
}

/**
 * Membangun daftar breadcrumb dari prop `items` yang diberikan secara manual.
 * "Beranda" selalu ditambahkan sebagai item pertama jika belum ada.
 */
function buildBreadcrumbsFromItems(items: BreadcrumbItem[]): BreadcrumbItem[] {
  const hasHome =
    items.length > 0 && items[0].label.toLowerCase() === 'beranda'

  if (hasHome) return items

  return [{ label: 'Beranda', href: '/' }, ...items]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const pathname = usePathname()

  // Tidak ditampilkan di beranda
  if (pathname === '/' && !items) return null

  const breadcrumbs = items
    ? buildBreadcrumbsFromItems(items)
    : buildBreadcrumbsFromPath(pathname)

  // Jika setelah dibangun hanya ada satu item (Beranda), tidak perlu ditampilkan
  if (breadcrumbs.length <= 1) return null

  // Schema markup JSON-LD BreadcrumbList untuk SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href
        ? { item: `https://smkmaarifnu01karangkobar.sch.id${item.href}` }
        : {}),
    })),
  }

  return (
    <>
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav
        data-testid="breadcrumb"
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-sm text-muted-foreground py-2"
      >
        <ol className="flex items-center gap-1 flex-wrap">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1

            return (
              <li key={`${item.href ?? item.label}-${index}`} className="flex items-center gap-1">
                {/* Separator — tidak ditampilkan sebelum item pertama */}
                {index > 0 && (
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-muted-foreground/60"
                    aria-hidden="true"
                  />
                )}

                {isLast ? (
                  // Item terakhir: halaman saat ini — hanya teks, bukan link
                  <span
                    className="font-medium text-foreground"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : index === 0 ? (
                  // Item pertama (Beranda): tampilkan ikon Home + teks
                  <Link
                    href={item.href ?? '/'}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <Home className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  // Item tengah: link jika ada href, teks biasa jika tidak
                  item.href ? (
                    <Link
                      href={item.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span>{item.label}</span>
                  )
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
