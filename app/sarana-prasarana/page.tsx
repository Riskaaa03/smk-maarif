import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sarana & Prasarana',
  description: 'Fasilitas lengkap SMK Ma\'arif NU 01 Karangkobar',
}

// ============================================================
// DATA
// ============================================================

const FASILITAS = [
  {
    id: 1,
    nama: 'Ruang Kelas',
    deskripsi: 'Ruang kelas yang nyaman dan kondusif untuk mendukung proses belajar mengajar. Setiap ruang dilengkapi dengan fasilitas modern untuk memaksimalkan pengalaman belajar siswa.',
    detail: [
      { label: 'Jumlah Ruang', nilai: '12 Ruang Kelas' },
      { label: 'Kapasitas per Ruang', nilai: '32 Siswa' },
      { label: 'Fasilitas', nilai: 'Papan tulis, proyektor, kipas angin, meja & kursi ergonomis' },
      { label: 'Kondisi', nilai: 'Baik dan terawat' },
    ]
  },
  {
    id: 2,
    nama: 'Laboratorium Komputer',
    deskripsi: 'Laboratorium komputer berstandar industri yang mendukung pembelajaran program keahlian TJKT dan AKL. Dilengkapi dengan perangkat keras terkini dan koneksi internet berkecepatan tinggi.',
    detail: [
      { label: 'Jumlah Unit Komputer', nilai: '40 Unit PC' },
      { label: 'Spesifikasi', nilai: 'Intel Core i5, RAM 8GB, SSD 256GB, Monitor 21"' },
      { label: 'Koneksi Internet', nilai: 'Fiber Optik 100 Mbps (dedicated)' },
      { label: 'Software', nilai: 'Windows 11, Microsoft Office, software desain & akuntansi' },
    ]
  },
  {
    id: 3,
    nama: 'Perpustakaan',
    deskripsi: 'Perpustakaan sekolah yang lengkap dengan koleksi buku pelajaran, buku referensi, dan bahan bacaan umum. Tersedia ruang baca yang nyaman dan akses ke sumber digital.',
    detail: [
      { label: 'Koleksi Buku', nilai: '± 3.500 judul buku' },
      { label: 'Fasilitas Baca', nilai: 'Ruang baca ber-AC, meja belajar, kursi nyaman' },
      { label: 'Akses Digital', nilai: 'Komputer akses e-book dan jurnal online' },
      { label: 'Jam Operasional', nilai: 'Senin–Sabtu, 07.00–15.00 WIB' },
    ]
  },
  {
    id: 4,
    nama: 'Sarana Olahraga',
    deskripsi: 'Fasilitas olahraga yang memadai untuk mendukung kegiatan PJOK dan ekstrakurikuler. Tersedia berbagai lapangan dan peralatan olahraga untuk mengembangkan bakat dan kebugaran siswa.',
    detail: [
      { label: 'Lapangan', nilai: 'Lapangan futsal, bola voli, bulu tangkis, dan upacara' },
      { label: 'Peralatan Olahraga', nilai: 'Bola, net, raket, matras, dan peralatan atletik' },
      { label: 'Kondisi', nilai: 'Terawat dan siap pakai' },
      { label: 'Penggunaan', nilai: 'Kegiatan PJOK, ekstrakurikuler, dan turnamen sekolah' },
    ]
  }
]

const SARANA_PENDUKUNG = [
  { nama: 'Mushola', deskripsi: 'Mushola yang bersih dan nyaman untuk kegiatan ibadah siswa, guru, dan karyawan.' },
  { nama: 'Kantin Sekolah', deskripsi: 'Kantin sekolah yang menyediakan makanan dan minuman sehat dengan harga terjangkau.' },
  { nama: 'UKS (Unit Kesehatan Sekolah)', deskripsi: 'UKS yang dilengkapi dengan peralatan P3K dan obat-obatan dasar.' },
  { nama: 'Toilet', deskripsi: 'Toilet yang bersih dan terpisah antara putra dan putri.' },
  { nama: 'Area Parkir', deskripsi: 'Area parkir yang luas dan aman untuk kendaraan siswa dan guru.' },
  { nama: 'Ruang Guru & Tata Usaha', deskripsi: 'Ruang guru yang representatif dan ruang tata usaha yang lengkap.' },
  { nama: 'Bengkel Praktik TBSM', deskripsi: 'Bengkel praktik dengan peralatan servis sepeda motor standar industri.' },
  { nama: 'Aula / Ruang Pertemuan', deskripsi: 'Aula serbaguna untuk kegiatan upacara, seminar, dan pertemuan.' }
]

const STATISTIK = [
  { angka: '12', satuan: 'Ruang Kelas' },
  { angka: '40', satuan: 'Unit Komputer' },
  { angka: '3.500+', satuan: 'Koleksi Buku' },
  { angka: '4', satuan: 'Lapangan Olahraga' }
]

// ============================================================
// KOMPONEN
// ============================================================

function OrnamenDivider() {
  return (
    <div className="flex items-center justify-center gap-4 opacity-25 max-w-5xl mx-auto">
      <div className="h-px flex-1 bg-[#1a5c3a]" />
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5L10 2Z" fill="#1a5c3a"/>
      </svg>
      <div className="h-px flex-1 bg-[#1a5c3a]" />
    </div>
  )
}

// ============================================================
// HALAMAN UTAMA
// ============================================================
export default function SaranaPrasaranaPage() {
  return (
    <main className="bg-[#f8f8f6] font-sans min-h-screen py-16">
      <div className="container mx-auto px-6 md:px-10 max-w-5xl">

        {/* ===== HEADER ===== */}
        <div className="mb-12">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-px w-6 bg-[#1a5c3a]" />
            <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">
              Fasilitas Sekolah
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#111827] mb-2">
            Sarana &amp; Prasarana
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl">
            Fasilitas lengkap untuk mendukung proses belajar mengajar yang optimal, nyaman, dan berstandar industri.
          </p>
        </div>

        {/* ===== INTRO ===== */}
        <section className="mb-16">
          <div className="grid md:grid-cols-[1fr_2.5fr] gap-12 md:gap-16 items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="h-px w-6 bg-[#1a5c3a]" />
                <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">
                  Tentang Fasilitas
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111827] leading-tight">
                Fasilitas<br />Unggulan
              </h2>
            </div>
            <div className="border-l-2 border-[#1a5c3a]/15 pl-8 md:pl-12">
              <p className="text-gray-700 leading-[1.9] text-[0.95rem]">
                SMK Ma&apos;arif NU 01 Karangkobar berkomitmen menyediakan fasilitas belajar yang
                lengkap dan berkualitas. Setiap fasilitas dirancang untuk mendukung pengembangan
                kompetensi siswa sesuai standar industri dan kebutuhan dunia kerja.
              </p>
              <blockquote className="mt-6 py-4 border-t border-b border-[#1a5c3a]/15">
                <p className="font-serif text-[#1a5c3a] text-lg italic leading-relaxed">
                  "Lingkungan belajar yang baik adalah fondasi dari prestasi yang luar biasa."
                </p>
              </blockquote>
            </div>
          </div>
        </section>

        <OrnamenDivider />

        {/* ===== FASILITAS UTAMA ===== */}
        <section id="fasilitas-utama" className="my-16">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-px w-6 bg-[#1a5c3a]" />
            <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">
              Fasilitas Utama
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-2">
            Fasilitas Belajar Utama
          </h2>
          <p className="text-gray-400 text-sm mb-10">
            Fasilitas inti yang mendukung kegiatan belajar mengajar setiap hari
          </p>

          <div className="space-y-8">
            {FASILITAS.map((fasilitas, idx) => {
              const isEven = idx % 2 === 0
              return (
                <article key={fasilitas.id} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4 md:gap-6">
                    <span className="font-serif text-5xl md:text-6xl font-bold leading-none select-none text-[#1a5c3a]/10 flex-shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-serif text-xl md:text-2xl font-bold text-[#111827] mb-2">
                        {fasilitas.nama}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-4">
                        {fasilitas.deskripsi}
                      </p>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {fasilitas.detail.map((item) => (
                          <div key={item.label} className="flex gap-2 text-sm bg-[#f8f8f6] rounded-lg px-4 py-2">
                            <dt className="font-semibold text-[#1a5c3a] whitespace-nowrap">{item.label}:</dt>
                            <dd className="text-gray-600">{item.nilai}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <OrnamenDivider />

        {/* ===== SARANA PENDUKUNG ===== */}
        <section id="sarana-pendukung" className="my-16">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-px w-6 bg-[#1a5c3a]" />
            <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">
              Pendukung
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-2">
            Sarana Pendukung Lainnya
          </h2>
          <p className="text-gray-400 text-sm mb-10">
            Fasilitas penunjang untuk kenyamanan seluruh warga sekolah
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SARANA_PENDUKUNG.map((sarana, index) => (
              <div
                key={sarana.nama}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f0f9f4] flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[#1a5c3a]">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <span className="font-serif text-lg font-bold text-[#111827]">{sarana.nama}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                  {sarana.deskripsi}
                </p>
              </div>
            ))}
          </div>
        </section>

        <OrnamenDivider />

        {/* ===== STATISTIK ===== */}
        <section className="my-16">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-px w-6 bg-[#1a5c3a]" />
            <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">
              Angka & Fakta
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-10">
            Fasilitas dalam Angka
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATISTIK.map((stat) => (
              <div
                key={stat.satuan}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-all"
              >
                <div className="font-serif text-4xl font-bold text-[#1a5c3a] mb-1 leading-none">
                  {stat.angka}
                </div>
                <div className="text-gray-400 text-xs font-medium">{stat.satuan}</div>
              </div>
            ))}
          </div>
        </section>

        <OrnamenDivider />

        {/* ===== CTA ===== */}
        <div className="mt-16">
          <div className="bg-[#0d2e1a] rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-64 h-64 rounded-full border border-white -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full border border-white translate-x-1/4 translate-y-1/4" />
            </div>
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-[#d4af37]" />
            <div className="relative">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#d4af37]">
                Penerimaan Peserta Didik Baru
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
                Tertarik Belajar di Sini?
              </h2>
              <p className="text-white/50 mb-8 max-w-lg mx-auto text-sm leading-relaxed">
                Bergabunglah dengan SMK Ma&apos;arif NU 01 Karangkobar dan nikmati fasilitas
                lengkap yang mendukung proses belajarmu menjadi lebih optimal.
              </p>
              <Link
                href="/ppdb"
                className="inline-flex items-center gap-2 rounded-full font-semibold text-sm px-8 py-3 transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: '#d4af37', color: '#0d2e1a' }}
              >
                Daftar PPDB Sekarang
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* ===== BACK ===== */}
        <div className="text-center mt-12">
          <Link href="/" className="inline-flex items-center gap-2 text-[#1a5c3a] hover:text-[#0d2e1a] font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

      </div>
    </main>
  )
}