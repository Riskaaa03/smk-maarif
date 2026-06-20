import Breadcrumb, { type BreadcrumbItem } from '@/components/layout/Breadcrumb'

interface PageHeroProps {
  /** Judul halaman yang ditampilkan sebagai h1 */
  title: string
  /** Subjudul opsional di bawah judul */
  subtitle?: string
  /** URL foto background. Jika tidak ada, gunakan gradient hijau NU sebagai fallback */
  backgroundImage?: string
  /** Override manual untuk item breadcrumb */
  breadcrumbItems?: BreadcrumbItem[]
}

/**
 * Komponen hero untuk halaman-halaman selain beranda.
 * Menampilkan judul halaman di atas background foto (atau gradient hijau NU)
 * dengan overlay, disertai breadcrumb di bawah judul.
 */
export default function PageHero({
  title,
  subtitle,
  backgroundImage,
  breadcrumbItems,
}: PageHeroProps) {
  return (
    <section
      aria-label={`Hero halaman ${title}`}
      className="relative flex flex-col items-center justify-center min-h-[200px] py-16 overflow-hidden"
    >
      {/* Background: foto dengan overlay atau gradient fallback */}
      {backgroundImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay hijau NU */}
          <div
            className="absolute inset-0 bg-nu-green-800/80"
            aria-hidden="true"
          />
        </>
      ) : (
        /* Gradient hijau NU sebagai fallback */
        <div
          className="absolute inset-0 bg-gradient-to-br from-nu-green-800 via-nu-green-700 to-nu-green-900"
          aria-hidden="true"
        />
      )}

      {/* Konten */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl drop-shadow-md">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-3 text-base sm:text-lg text-white/90 max-w-2xl mx-auto drop-shadow">
            {subtitle}
          </p>
        )}

        {/* Breadcrumb — teks disesuaikan agar kontras di atas background gelap */}
        <div className="mt-4 flex justify-center [&_a]:text-white/80 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/60">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
    </section>
  )
}
