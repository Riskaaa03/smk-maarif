import Link from 'next/link'
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react'

// ============================================================
// Data tautan cepat
// ============================================================
const quickLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Profil', href: '/profil' },
  { label: 'Program Keahlian', href: '/program-keahlian' },
  { label: 'Kurikulum', href: '/kurikulum' },
  { label: 'Sarana & Prasarana', href: '/sarana-prasarana' },
  { label: 'Kesiswaan', href: '/kesiswaan' },
  { label: 'Humas', href: '/humas' },
  { label: 'PPDB', href: '/ppdb' },
]

// ============================================================
// Kolom 1: Logo + tagline + deskripsi
// ============================================================
function FooterBrand() {
  return (
    <div className="flex flex-col gap-4">
      {/* Logo placeholder */}
      <div className="flex items-center gap-3">
        <div 
        className= "w-16 h-16 rounded-x1 bg-white flex items-center justify-center o verflow-hidden shadow-wd"
        aria-hidden="true"
        >
           <img 
            src="/images/logo_smk.png" 
            alt="Logo SMK Ma'arif NU 01 Karangkobar"
            className="w-full h-full object-contain p-2"
          />
          
        </div>  
        
      </div>

      {/* Nama sekolah */}
      <div>
        <p className="text-white font-bold text-base leading-snug">
          SMK Ma&apos;arif NU 01 Karangkobar
        </p>
        <p className="text-sage-200 text-sm mt-0.5 italic">
          Ahlussunnah Wal Jama&apos;ah
        </p>
      </div>

      {/* Deskripsi singkat */}
      <p className="text-sage-200 text-sm leading-relaxed">
        Sekolah Menengah Kejuruan berbasis Islam NU di Karangkobar, Banjarnegara, Jawa Tengah.
        Menyiapkan lulusan kompeten di bidang TBSM, TJKT, dan AKL di bawah naungan LP Ma&apos;arif NU.
      </p>
    </div>
  )
}

// ============================================================
// Kolom 2: Tautan cepat
// ============================================================
function FooterQuickLinks() {
  return (
    <div>
      <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
        Tautan Cepat
      </h3>
      <ul className="flex flex-col gap-2" role="list">
        {quickLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sage-200 text-sm hover:text-white transition-colors duration-150
                         focus:outline-none focus:text-white focus:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ============================================================
// Kolom 3: Kontak
// ============================================================
function FooterContact() {
  return (
    <div>
      <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
        Kontak
      </h3>
      <address className="not-italic flex flex-col gap-3">
        {/* Alamat */}
        <div className="flex items-start gap-2.5">
          <MapPin
            className="w-4 h-4 text-sage-300 shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-sage-200 text-sm leading-relaxed">
            Jl. Raya Karangkobar<br />
            Banjarnegara, Jawa Tengah
          </p>
        </div>

        {/* Telepon */}
        <div className="flex items-center gap-2.5">
          <Phone
            className="w-4 h-4 text-sage-300 shrink-0"
            aria-hidden="true"
          />
          <a
            href="tel:+6202865986000"
            className="text-sage-200 text-sm hover:text-white transition-colors duration-150
                       focus:outline-none focus:text-white focus:underline"
          >
            (0286) 5988 005
          </a>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2.5">
          <Mail
            className="w-4 h-4 text-sage-300 shrink-0"
            aria-hidden="true"
          />
          <a
            href="mailto:info@smkmaarifnu01karangkobar.sch.id"
            className="text-sage-200 text-sm hover:text-white transition-colors duration-150
                       focus:outline-none focus:text-white focus:underline break-all"
          >
            maarifnusmk@gmail.com
          </a>
        </div>
      </address>
    </div>
  )
}

// ============================================================
// Kolom 4: Media sosial + Google Maps mini
// ============================================================
function FooterSocialAndMap() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
          Ikuti Kami
        </h3>
        <div className="flex items-center gap-3">
          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Kunjungi halaman Facebook SMK Ma'arif NU 01 Karangkobar (membuka tab baru)"
            className="w-9 h-9 rounded-full bg-sage-700 hover:bg-sage-600 flex items-center
                       justify-center text-white transition-colors duration-150 focus:outline-none
                       focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sage-800"
          >
            <Facebook className="w-5 h-5" aria-hidden="true" />
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/@SMKSMAARIF01KARANGKOBAR"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Kunjungi halaman Instagram SMK Ma'arif NU 01 Karangkobar (membuka tab baru)"
            className="w-9 h-9 rounded-full bg-sage-700 hover:bg-sage-600 flex items-center
                       justify-center text-white transition-colors duration-150 focus:outline-none
                       focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sage-800"
          >
            <Instagram className="w-5 h-5" aria-hidden="true" />
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com/@SMKSMAARIF01KARANGKOBAR"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Kunjungi saluran YouTube SMK Ma'arif NU 01 Karangkobar (membuka tab baru)"
            className="w-9 h-9 rounded-full bg-sage-700 hover:bg-sage-600 flex items-center
                       justify-center text-white transition-colors duration-150 focus:outline-none
                       focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sage-800"
          >
            <Youtube className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Google Maps mini embed (iframe placeholder) */}
      <div>
        <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
          Lokasi Kami
        </h3>
        <div className="rounded-lg overflow-hidden border border-sage-700">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.123456789!2d109.6789!3d-7.3456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMjAnNDQuMiJTIDEwOcKwNDAnNDQuMCJF!5e0!3m2!1sid!2sid!4v1234567890"
            width="100%"
            height="160"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi SMK Ma'arif NU 01 Karangkobar di Google Maps"
            aria-label="Peta lokasi SMK Ma'arif NU 01 Karangkobar, Jl. Raya Karangkobar, Banjarnegara, Jawa Tengah"
          />
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Komponen utama: Footer
// ============================================================
export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="bg-[#172011] text-white"
    >
      {/* Grid 4 kolom: 1 kolom mobile, 2 kolom tablet, 4 kolom desktop */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <FooterBrand />
          <FooterQuickLinks />
          <FooterContact />
          <FooterSocialAndMap />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-sage-700" />

      {/* Copyright bar */}
      <div className="container mx-auto px-4 py-4">
        <p className="text-sage-300 text-sm text-center">
          &copy; {new Date().getFullYear()} SMK Ma&apos;arif NU 01 Karangkobar 
        </p>
      </div>
    </footer>
  )
}
