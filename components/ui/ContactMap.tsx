import { MapPin, Phone, Mail, Clock } from 'lucide-react'

// ============================================================
// Data kontak sekolah
// Requirements: 2.4, 2.5
// ============================================================
const SCHOOL_INFO = {
  alamat: 'Jl. Raya Karangkobar, Karangkobar, Kec. Karangkobar, Kab. Banjarnegara, Jawa Tengah 53453',
  telepon: '(0286) 5986XXX',
  email: 'smkmaarifnu01karangkobar@gmail.com',
  jamOperasional: [
    { hari: 'Senin – Kamis', jam: '07.00 – 15.30 WIB' },
    { hari: 'Jumat', jam: '07.00 – 11.30 WIB' },
    { hari: 'Sabtu', jam: '07.00 – 13.00 WIB' },
    { hari: 'Minggu', jam: 'Tutup' },
  ],
} as const

// ============================================================
// Sub-komponen: satu baris informasi kontak
// ============================================================
interface ContactRowProps {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}

function ContactRow({ icon, label, children }: ContactRowProps) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-nu-green-100 text-nu-green-700"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </p>
        <div className="mt-0.5 text-sm text-gray-800">{children}</div>
      </div>
    </div>
  )
}

// ============================================================
// Komponen utama: ContactMap
// Requirements: 2.5
// ============================================================

/**
 * Komponen yang menampilkan peta lokasi sekolah (Google Maps embed)
 * bersama informasi kontak lengkap.
 *
 * Layout: 2 kolom di desktop (peta kiri, kontak kanan),
 * stack vertikal di mobile.
 *
 * Requirements: 2.5
 */
export default function ContactMap() {
  return (
    <section
      aria-label="Lokasi dan informasi kontak sekolah"
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* ── Kolom kiri: Google Maps iframe ── */}
        <div className="relative min-h-[300px] lg:min-h-[420px]">
          <iframe
            title="Peta lokasi SMK Ma'arif NU 01 Karangkobar, Banjarnegara, Jawa Tengah"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.0!2d109.6!3d-7.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a4b0000000001%3A0x0!2sSMK%20Ma'arif%20NU%2001%20Karangkobar!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        {/* ── Kolom kanan: informasi kontak ── */}
        <div className="flex flex-col justify-center gap-6 p-6 sm:p-8 lg:border-l lg:border-gray-200">
          {/* Judul */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Hubungi Kami
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              SMK Ma&apos;arif NU 01 Karangkobar siap melayani Anda.
            </p>
          </div>

          {/* Baris kontak */}
          <div className="flex flex-col gap-5">
            {/* Alamat */}
            <ContactRow
              icon={<MapPin className="h-4 w-4" />}
              label="Alamat"
            >
              <address className="not-italic leading-relaxed">
                {SCHOOL_INFO.alamat}
              </address>
            </ContactRow>

            {/* Telepon */}
            <ContactRow
              icon={<Phone className="h-4 w-4" />}
              label="Telepon"
            >
              <a
                href={`tel:${SCHOOL_INFO.telepon.replace(/\D/g, '')}`}
                className="hover:text-nu-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nu-green-600 focus-visible:ring-offset-1 rounded"
              >
                {SCHOOL_INFO.telepon}
              </a>
            </ContactRow>

            {/* Email */}
            <ContactRow
              icon={<Mail className="h-4 w-4" />}
              label="Email"
            >
              <a
                href={`mailto:${SCHOOL_INFO.email}`}
                className="break-all hover:text-nu-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nu-green-600 focus-visible:ring-offset-1 rounded"
              >
                {SCHOOL_INFO.email}
              </a>
            </ContactRow>

            {/* Jam operasional */}
            <ContactRow
              icon={<Clock className="h-4 w-4" />}
              label="Jam Operasional"
            >
              <ul className="mt-0.5 space-y-1">
                {SCHOOL_INFO.jamOperasional.map(({ hari, jam }) => (
                  <li key={hari} className="flex flex-wrap gap-x-2">
                    <span className="font-medium text-gray-700">{hari}:</span>
                    <span
                      className={
                        jam === 'Tutup' ? 'text-red-500' : 'text-gray-600'
                      }
                    >
                      {jam}
                    </span>
                  </li>
                ))}
              </ul>
            </ContactRow>
          </div>
        </div>
      </div>
    </section>
  )
}
