import type { Metadata } from 'next'
// HAPUS import PageHero karena kita buat hero sendiri
// import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: 'Kurikulum',
  description:
    "Kurikulum Merdeka Belajar SMK Ma'arif NU 01 Karangkobar: mata pelajaran umum dan produktif, metode pembelajaran, sistem penilaian, dan kegiatan luar kelas.",
}

const MAPEL_UMUM: string[] = [
  'Pendidikan Agama Islam dan Budi Pekerti',
  'Pendidikan Pancasila dan Kewarganegaraan (PKn)',
  'Bahasa Indonesia',
  'Matematika',
  'Bahasa Inggris',
  'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
  'Seni Budaya',
  'Sejarah Indonesia',
  'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
  'Informatika',
  'Projek Penguatan Profil Pelajar Pancasila dan Profil Pelajar Rahmatan Lil Alamin (P5-PPRA)',
]

interface MapelProduktif {
  mataPelajaran: string
}

interface ProgramProduktif {
  kode: string
  namaLengkap: string
  mapel: MapelProduktif[]
}

const MAPEL_PRODUKTIF: ProgramProduktif[] = [
  {
    kode: 'TBSM',
    namaLengkap: 'Teknik & Bisnis Sepeda Motor',
    mapel: [
      { mataPelajaran: 'Dasar-Dasar Teknik Otomotif' },
      { mataPelajaran: 'Pemeliharaan Mesin Sepeda Motor' },
      { mataPelajaran: 'Pemeliharaan Sasis dan Pemindah Tenaga Sepeda Motor' },
      { mataPelajaran: 'Pemeliharaan Kelistrikan Sepeda Motor' },
      { mataPelajaran: 'Pengelolaan Bengkel Sepeda Motor' },
      { mataPelajaran: 'Bisnis Otomotif' },
      { mataPelajaran: 'Produk Kreatif dan Kewirausahaan' },
    ],
  },
  {
    kode: 'TJKT',
    namaLengkap: 'Teknik Jaringan Komputer & Telekomunikasi',
    mapel: [
      { mataPelajaran: 'Dasar-Dasar Teknik Jaringan Komputer dan Telekomunikasi' },
      { mataPelajaran: 'Administrasi Infrastruktur Jaringan' },
      { mataPelajaran: 'Administrasi Sistem Jaringan' },
      { mataPelajaran: 'Teknologi Layanan Jaringan' },
      { mataPelajaran: 'Keamanan Jaringan' },
      { mataPelajaran: 'Pemrograman Web dan Perangkat Bergerak' },
      { mataPelajaran: 'Produk Kreatif dan Kewirausahaan' },
    ],
  },
  {
    kode: 'AKL',
    namaLengkap: 'Akuntansi & Keuangan Lembaga',
    mapel: [
      { mataPelajaran: 'Dasar-Dasar Akuntansi dan Keuangan Lembaga' },
      { mataPelajaran: 'Akuntansi Dasar' },
      { mataPelajaran: 'Akuntansi Perusahaan Jasa dan Dagang' },
      { mataPelajaran: 'Akuntansi Perusahaan Manufaktur' },
      { mataPelajaran: 'Komputer Akuntansi' },
      { mataPelajaran: 'Administrasi Pajak' },
      { mataPelajaran: 'Produk Kreatif dan Kewirausahaan' },
    ],
  },
]

interface MetodePembelajaran {
  judul: string
  deskripsi: string
  ikon: string
}

const METODE_PEMBELAJARAN: MetodePembelajaran[] = [
  {
    judul: 'Project-Based Learning (PjBL)',
    deskripsi:
      'Siswa belajar melalui proyek nyata yang relevan dengan dunia kerja. Setiap proyek dirancang untuk mengembangkan kompetensi teknis sekaligus soft skills seperti kerja tim, komunikasi, dan pemecahan masalah.',
    ikon: 'target',
  },
  {
    judul: 'Praktik Industri',
    deskripsi:
      'Pembelajaran langsung di bengkel, laboratorium, dan fasilitas praktik sekolah yang dilengkapi peralatan standar industri. Siswa menerapkan teori dalam kondisi kerja yang sesungguhnya.',
    ikon: 'tools',
  },
  {
    judul: 'Teaching Factory',
    deskripsi:
      'Model pembelajaran berbasis produksi nyata di sekolah. Siswa menghasilkan produk atau layanan yang dapat dijual, sehingga belajar sambil berwirausaha dan memahami proses bisnis secara langsung.',
    ikon: 'factory',
  },
  {
    judul: 'Pembelajaran Berbasis Masalah (PBL)',
    deskripsi:
      'Siswa dihadapkan pada permasalahan nyata dari dunia industri dan ditantang untuk menemukan solusi. Metode ini melatih kemampuan analitis, kritis, dan inovatif.',
    ikon: 'puzzle',
  },
  {
    judul: 'Kolaborasi dengan Industri',
    deskripsi:
      'Guru tamu dari perusahaan mitra, kunjungan industri, dan sesi mentoring dengan praktisi industri memberikan wawasan langsung tentang tren dan kebutuhan dunia kerja terkini.',
    ikon: 'collab',
  },
]

interface SistemPenilaian {
  jenis: string
  deskripsi: string
  contoh: string[]
}

const SISTEM_PENILAIAN: SistemPenilaian[] = [
  {
    jenis: 'Penilaian Formatif',
    deskripsi:
      'Penilaian berkelanjutan yang dilakukan selama proses pembelajaran untuk memantau perkembangan siswa dan memberikan umpan balik segera.',
    contoh: [
      'Kuis harian dan tanya jawab',
      'Observasi praktik di bengkel/lab',
      'Diskusi kelompok dan presentasi',
      'Tugas dan latihan soal',
    ],
  },
  {
    jenis: 'Penilaian Sumatif',
    deskripsi:
      'Penilaian akhir yang dilakukan untuk mengukur pencapaian kompetensi siswa setelah menyelesaikan satu unit atau periode pembelajaran.',
    contoh: [
      'Ujian Tengah Semester (UTS)',
      'Ujian Akhir Semester (UAS)',
      'Ujian Kompetensi Keahlian (UKK)',
      'Ujian Sekolah',
    ],
  },
  {
    jenis: 'Penilaian Portofolio',
    deskripsi:
      'Pengumpulan bukti karya dan pencapaian siswa secara sistematis untuk menunjukkan perkembangan kompetensi dari waktu ke waktu.',
    contoh: [
      'Kumpulan laporan praktik',
      'Dokumentasi proyek yang diselesaikan',
      'Sertifikat kompetensi dan penghargaan',
      'Jurnal refleksi pembelajaran',
    ],
  },
  {
    jenis: 'Penilaian Berbasis Kompetensi',
    deskripsi:
      'Penilaian yang mengacu pada standar kompetensi industri untuk memastikan lulusan memenuhi kualifikasi yang dibutuhkan dunia kerja.',
    contoh: [
      'Uji kompetensi oleh Lembaga Sertifikasi Profesi (LSP)',
      'Penilaian praktik kerja industri',
      'Asesmen berbasis standar SKKNI',
    ],
  },
]

interface KegiatanLuarKelas {
  nama: string
  deskripsi: string
  durasi: string
  ikon: string
}

const KEGIATAN_LUAR_KELAS: KegiatanLuarKelas[] = [
  {
    nama: 'Praktik Kerja Lapangan (PKL)',
    deskripsi:
      'Program magang di perusahaan atau industri mitra selama 3-6 bulan. Siswa mendapatkan pengalaman kerja nyata, membangun jaringan profesional, dan menerapkan kompetensi yang dipelajari di sekolah.',
    durasi: '3-6 bulan (Kelas XI-XII)',
    ikon: 'office',
  },
  {
    nama: 'Kunjungan Industri',
    deskripsi:
      'Kunjungan langsung ke perusahaan, pabrik, atau instansi terkait untuk memperluas wawasan siswa tentang dunia kerja, proses produksi, dan budaya kerja profesional.',
    durasi: '1-3 hari per semester',
    ikon: 'bus',
  },
  {
    nama: 'Magang Guru di Industri',
    deskripsi:
      'Program peningkatan kompetensi guru produktif melalui magang di industri mitra, sehingga materi pembelajaran selalu relevan dengan perkembangan teknologi dan kebutuhan industri terkini.',
    durasi: '1-2 minggu per tahun',
    ikon: 'teacher',
  },
  {
    nama: 'Uji Kompetensi Keahlian (UKK)',
    deskripsi:
      'Ujian praktik yang dilaksanakan di akhir masa studi untuk mengukur dan mensertifikasi kompetensi siswa sesuai standar industri. Dilaksanakan bekerja sama dengan Lembaga Sertifikasi Profesi (LSP).',
    durasi: 'Kelas XII (semester akhir)',
    ikon: 'trophy',
  },
  {
    nama: 'Projek Penguatan Profil Pelajar Pancasila (P5)',
    deskripsi:
      'Kegiatan pembelajaran berbasis proyek lintas mata pelajaran yang bertujuan memperkuat karakter siswa sesuai profil Pelajar Pancasila: beriman, berkebinekaan, bergotong royong, mandiri, bernalar kritis, dan kreatif.',
    durasi: 'Sepanjang tahun ajaran',
    ikon: 'leaf',
  },
]

function getMetodeIkon(ikon: string): string {
  const map: Record<string, string> = {
    target: 'target',
    tools: 'tools',
    factory: 'factory',
    puzzle: 'puzzle',
    collab: 'collab',
  }
  return map[ikon] ?? ikon
}

function getKegiatanIkon(ikon: string): string {
  const map: Record<string, string> = {
    office: 'office',
    bus: 'bus',
    teacher: 'teacher',
    trophy: 'trophy',
    leaf: 'leaf',
  }
  return map[ikon] ?? ikon
}

// Ornamen divider yang sama dengan halaman lain
function SectionDivider() {
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

// Header section yang konsisten
function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-5xl mx-auto mb-10">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="h-px w-6 bg-[#1a5c3a]" />
        <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">{eyebrow}</span>
      </div>
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111827]">{title}</h2>
      {subtitle && <p className="text-gray-400 text-sm mt-2">{subtitle}</p>}
    </div>
  )
}

export default function KurikulumPage() {
  return (
    <main className="bg-[#f8f8f6] font-sans">

      {/* ── HERO KURIKULUM ── */}
      <div className="relative min-h-[88vh] flex items-end overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/program/foto_semua_prodi.png"
            alt="Kurikulum SMK Ma'arif NU 01 Karangkobar"
            className="w-full h-full object-cover"
          />
          {/* Gradient dari bawah */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e1a] via-[#0d2e1a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d2e1a]/40 to-transparent" />
        </div>

        {/* Ornamen geometris sudut kanan atas */}
        <div className="absolute top-8 right-8 opacity-20 hidden md:block">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <rect x="2" y="2" width="116" height="116" rx="2" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="8 4" />
            <rect x="18" y="18" width="84" height="84" rx="1" stroke="#d4af37" strokeWidth="0.75" />
            <circle cx="60" cy="60" r="20" stroke="#d4af37" strokeWidth="0.75" />
          </svg>
        </div>

        {/* Konten Hero */}
        <div className="relative w-full pb-16 md:pb-24">
          <div className="container mx-auto px-6 md:px-10">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[#d4af37]" />
              <span className="text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase">
                Kurikulum
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-[1.05] max-w-2xl mb-4">
              Kurikulum<br />
              <span className="text-[#d4af37]">Merdeka Belajar</span>
            </h1>
            <p className="text-white/60 text-base md:text-lg mt-3 mb-8 max-w-xl leading-relaxed">
              Kurikulum Merdeka Belajar yang fleksibel, berpusat pada siswa, dan terintegrasi dengan nilai-nilai keislaman serta kebutuhan industri.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#kurikulum-heading"
                className="group inline-flex items-center gap-2.5 bg-[#d4af37] hover:bg-[#c4a02e] text-[#0d2e1a] font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200"
              >
                Lihat Struktur Kurikulum
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#metode-heading"
                className="inline-flex items-center gap-2.5 border border-white/30 text-white hover:border-white/60 hover:bg-white/10 font-medium text-sm px-6 py-3 rounded-full transition-all duration-200"
              >
                Metode Pembelajaran
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/40" />
            <svg className="w-4 h-4 text-white/40 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── KONTEN UTAMA ── */}
      <div className="container mx-auto px-6 md:px-10 py-16 md:py-24 space-y-24 md:space-y-32">

        {/* ── 1. INFORMASI KURIKULUM ── */}
        <section id="kurikulum-heading" aria-labelledby="kurikulum-heading">
          <SectionHeader
            eyebrow="Kerangka Pembelajaran"
            title="Kurikulum yang Digunakan"
          />

          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6">
            {/* Panel gelap — Kurikulum Merdeka */}
            <div className="relative rounded-2xl bg-[#0d2e1a] text-white p-8 md:p-10 overflow-hidden flex flex-col justify-between min-h-[280px]">
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-white/10" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full border border-white/5" />

              <div className="relative">
                <p className="text-[#d4af37] text-xs font-semibold tracking-[0.18em] uppercase mb-4">
                  Implementasi Penuh sejak 2023/2024
                </p>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
                  Kurikulum Merdeka
                </h3>
                <p className="text-white/70 leading-relaxed text-[0.9rem]">
                  SMK Ma&apos;arif NU 01 Karangkobar telah mengimplementasikan Kurikulum Merdeka
                  secara penuh. Kurikulum ini memberikan fleksibilitas kepada sekolah untuk
                  merancang pembelajaran yang sesuai dengan kebutuhan siswa dan potensi daerah,
                  dengan tetap mengacu pada Capaian Pembelajaran (CP) yang ditetapkan pemerintah.
                </p>
              </div>
              <div className="relative mt-8 pt-4 border-t border-white/10">
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-0.5 rounded-full bg-[#d4af37]" style={{ width: i === 0 ? 24 : 8, opacity: i === 0 ? 1 : 0.4 }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Panel putih — Keunggulan */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-10 shadow-sm">
              <p className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase mb-6">
                Keunggulan
              </p>
              <div className="space-y-4">
                {[
                  'Fokus pada pengembangan kompetensi esensial dan karakter siswa',
                  'Pembelajaran berbasis proyek (P5) untuk penguatan profil pelajar',
                  'Fleksibilitas dalam pemilihan mata pelajaran pilihan',
                  'Asesmen yang beragam dan berpusat pada siswa',
                  'Kolaborasi erat dengan dunia usaha dan industri (DUDI)',
                  "Integrasi nilai-nilai Islam Ahlussunnah Wal Jama'ah dalam pembelajaran",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f0f9f4] border border-[#1a5c3a]/20 text-[#1a5c3a] text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 text-[0.9rem] leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── 2. MATA PELAJARAN ── */}
        <section id="mapel-heading" aria-labelledby="mapel-heading">
          <SectionHeader
            eyebrow="Struktur Kurikulum"
            title="Mata Pelajaran"
          />

          <div className="max-w-5xl mx-auto space-y-12">

            {/* Mapel Umum */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0d2e1a] text-white text-xs font-bold">
                  A
                </span>
                <div>
                  <h3 className="font-semibold text-[#111827] text-base">Mata Pelajaran Umum</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Wajib ditempuh oleh seluruh siswa dari semua program keahlian</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" aria-label="Daftar mata pelajaran umum">
                {MAPEL_UMUM.map((mapel, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm hover:border-[#1a5c3a]/20 hover:shadow-md transition-all duration-200"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#f0f9f4] border border-[#1a5c3a]/15 text-[#1a5c3a] text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-[0.875rem] text-gray-700 leading-snug">{mapel}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mapel Produktif */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0d2e1a] text-white text-xs font-bold">
                  B
                </span>
                <div>
                  <h3 className="font-semibold text-[#111827] text-base">Mata Pelajaran Produktif per Program Keahlian</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Dirancang untuk membangun kompetensi teknis yang dibutuhkan industri</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5" aria-label="Mata pelajaran produktif per program keahlian">
                {MAPEL_PRODUKTIF.map((program) => (
                  <div
                    key={program.kode}
                    className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
                  >
                    {/* Header program */}
                    <div className="bg-[#0d2e1a] px-5 py-4 text-white">
                      <span className="text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.15em]">
                        {program.kode}
                      </span>
                      <p className="text-sm font-semibold mt-1 text-white/90 leading-snug">
                        {program.namaLengkap}
                      </p>
                    </div>
                    <ol className="divide-y divide-gray-50" aria-label={`Mata pelajaran produktif ${program.kode}`}>
                      {program.mapel.map((mp, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 px-5 py-3 hover:bg-[#f0f9f4] transition-colors"
                        >
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f0f9f4] border border-[#1a5c3a]/15 text-[#1a5c3a] text-[10px] font-bold flex items-center justify-center mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-[0.85rem] text-gray-700 leading-snug">{mp.mataPelajaran}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── 3. METODE PEMBELAJARAN ── */}
        <section id="metode-heading" aria-labelledby="metode-heading">
          <SectionHeader
            eyebrow="Pendekatan Belajar"
            title="Metode Pembelajaran"
            subtitle="Berbagai pendekatan yang diterapkan untuk memastikan pembelajaran yang efektif dan relevan"
          />

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Daftar metode pembelajaran">
            {METODE_PEMBELAJARAN.map((metode, idx) => {
              const ikon = getMetodeIkon(metode.ikon)
              const emoji =
                ikon === 'target' ? '🎯'
                : ikon === 'tools' ? '🔧'
                : ikon === 'factory' ? '🏭'
                : ikon === 'puzzle' ? '🧩'
                : '🤝'
              return (
                <div
                  key={idx}
                  className="group bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-8 h-0.5 rounded-full bg-[#1a5c3a] mb-4 transition-all duration-300 group-hover:w-14" />
                  <div className="text-2xl mb-3" aria-hidden="true">{emoji}</div>
                  <h3 className="font-semibold text-[#111827] text-[0.9rem] mb-2 leading-snug">
                    {metode.judul}
                  </h3>
                  <p className="text-[0.85rem] text-gray-500 leading-relaxed">{metode.deskripsi}</p>
                </div>
              )
            })}
          </div>
        </section>

        <SectionDivider />

        {/* ── 4. SISTEM PENILAIAN ── */}
        <section id="penilaian-heading" aria-labelledby="penilaian-heading">
          <SectionHeader
            eyebrow="Evaluasi Belajar"
            title="Sistem Penilaian & Evaluasi"
            subtitle="Penilaian yang beragam untuk mengukur perkembangan siswa secara menyeluruh"
          />

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5" aria-label="Sistem penilaian dan evaluasi">
            {SISTEM_PENILAIAN.map((penilaian, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ backgroundColor: '#1a5c3a' }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-semibold text-[#111827] text-[0.9rem]">{penilaian.jenis}</h3>
                </div>
                <div className="px-6 py-5">
                  <p className="text-[0.875rem] text-gray-500 leading-relaxed mb-4">
                    {penilaian.deskripsi}
                  </p>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.15em] mb-2.5">
                    Contoh
                  </p>
                  <ul className="space-y-1.5" aria-label={`Contoh ${penilaian.jenis}`}>
                    {penilaian.contoh.map((c, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-[0.875rem] text-gray-600">
                        <span className="w-1 h-1 rounded-full bg-[#1a5c3a] flex-shrink-0" aria-hidden="true" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* ── 5. KEGIATAN LUAR KELAS ── */}
        <section id="luar-kelas-heading" aria-labelledby="luar-kelas-heading">
          <SectionHeader
            eyebrow="Pengalaman Nyata"
            title="Kegiatan Pembelajaran di Luar Kelas"
            subtitle="Pengalaman belajar yang melampaui ruang kelas untuk mempersiapkan siswa menghadapi dunia kerja"
          />

          <div className="max-w-5xl mx-auto space-y-4" aria-label="Daftar kegiatan pembelajaran di luar kelas">
            {KEGIATAN_LUAR_KELAS.map((kegiatan, idx) => {
              const ikon = getKegiatanIkon(kegiatan.ikon)
              const emoji =
                ikon === 'office' ? '🏢'
                : ikon === 'bus' ? '🚌'
                : ikon === 'teacher' ? '👩‍🏫'
                : ikon === 'trophy' ? '🏆'
                : '🌱'
              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row gap-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-[#1a5c3a]/15 transition-all duration-200"
                >
                  {/* Nomor + emoji */}
                  <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 flex-shrink-0">
                    <span className="text-xs font-mono text-gray-300">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-2xl" aria-hidden="true">{emoji}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[#111827] text-[0.95rem]">{kegiatan.nama}</h3>
                      <span
                        className="inline-block text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: '#f0f9f4', color: '#1a5c3a' }}
                      >
                        {kegiatan.durasi}
                      </span>
                    </div>
                    <p className="text-[0.875rem] text-gray-500 leading-relaxed">{kegiatan.deskripsi}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── CTA PPDB ── */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0d2e1a] rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-64 h-64 rounded-full border border-white -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full border border-white translate-x-1/4 translate-y-1/4" />
            </div>

            <div className="relative">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: '#d4af37' }}>
                Bergabung Bersama Kami
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
                Siap Belajar Bersama Kami?
              </h2>
              <p className="text-white/50 mb-8 text-sm max-w-md mx-auto leading-relaxed">
                Bergabunglah dengan SMK Ma&apos;arif NU 01 Karangkobar dan rasakan pengalaman
                belajar yang menyenangkan, relevan, dan berkarakter.
              </p>
              <a
                href="/ppdb"
                className="inline-flex items-center justify-center gap-2 rounded-full font-semibold text-sm px-8 py-3 transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: '#d4af37', color: '#0d2e1a' }}
              >
                Daftar PPDB Sekarang
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}