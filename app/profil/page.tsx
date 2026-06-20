import type { Metadata } from 'next'
import Link from 'next/link'
import { Facebook, Instagram, Youtube, CheckCircle2, Users, ChevronRight, Award, Target, Building2 } from 'lucide-react'
import ContactMap from '@/components/ui/ContactMap'

// ============================================================
// Metadata SEO
// ============================================================
export const metadata: Metadata = {
  title: 'Profil Sekolah',
  description:
    'Profil lengkap SMK Ma\'arif NU 01 Karangkobar: sambutan kepala sekolah, visi dan misi, struktur organisasi, informasi kontak, dan media sosial resmi sekolah.',
}

// ============================================================
// Data statis halaman profil
// ============================================================

const VISI =
  "Unggul dalam keahlian mandiri dan berakhlak qurani."

const MISI: string[] = [
  'Menguatkan perilaku keagamaan melalui kegiatan bimbingan keagamaan.',
  'Meningkatkan prestasi dan akademik non akademik melalui kegiatan saling pembelajaran.',
  'Menjalin kerjasama dengan DUDI melalui kegiatan praktek kerja lapangan (PKL) dan kunjungan industri (KI).',
]

interface StrukturItem {
  jabatan: string
  nama: string
  level: number
}

const STRUKTUR_ORGANISASI: StrukturItem[] = [
  { jabatan: 'Kepala Sekolah', nama: 'Drs. H. [Nama Kepala Sekolah]', level: 0 },
  { jabatan: 'Wakil Kepala Sekolah Bid. Kurikulum', nama: '[Nama Wakasek Kurikulum]', level: 1 },
  { jabatan: 'Wakil Kepala Sekolah Bid. Kesiswaan', nama: '[Nama Wakasek Kesiswaan]', level: 1 },
  { jabatan: 'Wakil Kepala Sekolah Bid. Sarana & Prasarana', nama: '[Nama Wakasek Sarpras]', level: 1 },
  { jabatan: 'Wakil Kepala Sekolah Bid. Humas', nama: '[Nama Wakasek Humas]', level: 1 },
  { jabatan: 'Ketua Jurusan TBSM', nama: '[Nama Kajur TBSM]', level: 2 },
  { jabatan: 'Ketua Jurusan TJKT', nama: '[Nama Kajur TJKT]', level: 2 },
  { jabatan: 'Ketua Jurusan AKL', nama: '[Nama Kajur AKL]', level: 2 },
  { jabatan: 'Kepala Tata Usaha', nama: '[Nama Kepala TU]', level: 1 },
  { jabatan: 'Bendahara Sekolah', nama: '[Nama Bendahara]', level: 1 },
]

const SOSMED = [
  {
    nama: 'Facebook',
    href: 'https://facebook.com/smkmaarifnu01karangkobar',
    icon: Facebook,
    warna: 'bg-blue-600 hover:bg-blue-700',
    label: 'Ikuti kami di Facebook',
  },
  {
    nama: 'Instagram',
    href: 'https://instagram.com/smkmaarifnu01karangkobar',
    icon: Instagram,
    warna: 'bg-pink-600 hover:bg-pink-700',
    label: 'Ikuti kami di Instagram',
  },
  {
    nama: 'YouTube',
    href: 'https://youtube.com/@smkmaarifnu01karangkobar',
    icon: Youtube,
    warna: 'bg-red-600 hover:bg-red-700',
    label: 'Subscribe channel YouTube kami',
  },
]

// ============================================================
// Halaman Profil Sekolah — Server Component (SSG)
// ============================================================
export default function ProfilPage() {
  return (
    <main className="bg-[#f8f8f6] font-sans">

      {/* ── Hero ── */}
      <div className="relative min-h-[88vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/program/foto_semua_prodi.png"
            alt="SMK Ma'arif NU 01 Karangkobar"
            className="w-full h-full object-cover"
          />
          {/* Gradient dari bawah, lebih dramatis */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e1a] via-[#0d2e1a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d2e1a]/40 to-transparent" />
        </div>

        {/* Ornamen geometris sudut kanan atas */}
        <div className="absolute top-8 right-8 opacity-20 hidden md:block">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <rect x="2" y="2" width="116" height="116" rx="2" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="8 4"/>
            <rect x="18" y="18" width="84" height="84" rx="1" stroke="#d4af37" strokeWidth="0.75"/>
            <circle cx="60" cy="60" r="20" stroke="#d4af37" strokeWidth="0.75"/>
          </svg>
        </div>

        <div className="relative w-full pb-16 md:pb-24">
          <div className="container mx-auto px-6 md:px-10">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[#d4af37]" />
              <span className="text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase">Profil Sekolah</span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-[1.05] max-w-2xl mb-4">
              SMK Ma'arif<br />
              <span className="text-[#d4af37]">NU 01</span>
            </h1>
            <p className="text-white/60 text-base md:text-lg mt-3 mb-8">
              Karangkobar, Banjarnegara
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#sambutan"
                className="group inline-flex items-center gap-2.5 bg-[#d4af37] hover:bg-[#c4a02e] text-[#0d2e1a] font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200"
              >
                Baca Sambutan
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#kontak"
                className="inline-flex items-center gap-2.5 border border-white/30 text-white hover:border-white/60 hover:bg-white/10 font-medium text-sm px-6 py-3 rounded-full transition-all duration-200"
              >
                Hubungi Kami
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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

      {/* ── Konten Utama ── */}
      <div className="container mx-auto px-6 md:px-10 py-16 md:py-24 space-y-24 md:space-y-32">

        {/* ── 1. SAMBUTAN KEPALA SEKOLAH ── */}
        <section id="sambutan" aria-labelledby="sambutan-heading">
          <div className="grid md:grid-cols-[1fr_2.5fr] gap-12 md:gap-16 items-start max-w-5xl mx-auto">

            {/* Label kolom kiri — sticky saat scroll */}
            <div className="md:sticky md:top-8 space-y-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="h-px w-6 bg-[#1a5c3a]" />
                <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">Dari Pimpinan</span>
              </div>
              <h2 id="sambutan-heading" className="font-serif text-3xl md:text-4xl font-bold text-[#111827] leading-tight">
                Sambutan<br />Kepala<br />Sekolah
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Pesan dan harapan untuk seluruh warga belajar SMK Ma'arif NU 01 Karangkobar.
              </p>
            </div>

            {/* Konten sambutan — tampak seperti surat terbuka */}
            <div className="border-l-2 border-[#1a5c3a]/15 pl-8 md:pl-12 space-y-5 text-gray-700 leading-[1.85] text-[0.95rem]">

              <p className="font-semibold text-[#111827]">Assalamu Alaikum Wr Wb</p>

              <p>
                Alhamdulillahi Rabbil Alamiin. Segala Puji Milik Allah SWT Sang Pemberi Nikmat Dan Anugerah Kepada Seluruh Alam.
              </p>

              <p>
                Rahmat Beserta Salam Kita Haturkan Kepada Nabi Muhammad SAW. Semoga Kita Mendapatkan Syafaatnya Kelak Di Hari Kiamat. Amiin.
              </p>

              <p>
                Manusia Belajar Agar Dapat Berubah Dan Berkembang Menjadi Pribadi Yang Lebih Baik. Baik Di Dunia Maupun Baik Di Akhirat. Baik Perilakunya Maupun Baik Dalam Ilmu, Keterampilan Atau Keterampilannya.
              </p>

              <p>
                Orang Yang Berilmu Haruslah Memiliki Akhlak Yang Baik. Karena Berilmu Tanpa Akhlak Yang Baik Kurang Mendatangkan Manfaat Bahkan Dapat Merugikan Orang Lain. Tanpa Akhlak Yang Baik, Seseorang Dapat Mencari Keuntungan Sebanyak Banyaknya Tanpa Peduli Nasib Dan Penderitaan Orang Lain. Bahkan Jika Nafsu Duniawi Menjadi Pemimpinnya, Ia Akan Menghalalkan Segala Cara Untuk Mendapatkan Tujuan.
              </p>

              <p>
                Akhlak adalah Tujuan Agama. Nabi Muhammad SAW Sang Pembawa Agama Islam Berkata; Sesungguhnya Saya Diutus Untuk Menyempurnakan Akhlak. Dan Juga Berkata: Barang Siapa Yang Allah SWT Kehendaki Menjadi Baik, Maka Allah Akan Memahamkannya Atas Ilmu Agama.
              </p>

              <p>
                Untuk Menjadi Orang Baik, Haruslah Menyadari Dan Memahami Nilai Nilai Ajaran Agama Dan Bagaimana Penerapannya. Menerapkan Sikap Yang Baik Dan Berbuat Baik Pada Sesama. Berpikir Positif, Objektif, Konsisten Dalam Kebaikan, Toleran Dan Juga Moderat Dalam Bersikap Antar Sesama. Beribadah Secara Murni Kepada Allah SWT Berpasrah Diri Kepada-Nya Dan Tidak Putus Asa Atas Rahmat-Nya Serta Terus Berdoa.
              </p>

              <p>
                Di Sela-Sela Itu, Agama Juga Menganjurkan Orang Bekerja Keras Memenuhi Kewajiban Mencari Nafkah. Agar Mandiri Tidak Bergantung Kepada Orang Lain (Mahluk). Bekerjalah Untuk Duniamu Seakan Engkau Akan Hidup Selamanya. Beribadahlah Untuk Akhiratmu Seakan Engkau Akan Mati Esok.
              </p>

              {/* Pull quote — signature element */}
              <blockquote className="my-8 py-6 border-t border-b border-[#1a5c3a]/15 space-y-2">
                <p className="font-serif text-[#1a5c3a] text-lg md:text-xl italic leading-relaxed">
                  "Bagaimana Mungkin Sukses Dunia Akan Mudah Tercapai Jika Tanpa Skill Atau Keterampilan...??!!"
                </p>
                <p className="font-serif text-[#1a5c3a] text-lg md:text-xl italic leading-relaxed">
                  "Bagaimana Mungkin Sukses Akhirat Akan Tercapai Jika Tanpa Pemahaman Agama Dan Akhlak...??!!"
                </p>
              </blockquote>

              <p>
                Kecuali Allah SWT Memberikan Rahmat Dan Keutamaan Kepada Hambanya, Karena Hanya Kepada-Nya Kita Bergantung Dan Hanya Kepada-Nya Tempat Kembali.
              </p>

              <p>
                Maka, Dengan Ini Kami Atas Nama Keluarga Besar SMK Maarif NU 01 Karangkobar, Dengan Bekal Sekolah Kejuruan Dan Materi Keagamaan Yang Dipadukan, Memohon Doa Dan Dukungan Agar Dapat Mewujudkan Cita Cita Sebagai Mana Visi;
              </p>

              {/* Visi dalam sambutan */}
              <div className="bg-[#1a5c3a] text-white rounded-2xl px-7 py-5 my-2">
                <p className="font-serif text-lg md:text-xl text-center leading-relaxed">
                  "Unggul dalam keahlian mandiri dan berakhlak qurani."
                </p>
                <p className="text-center text-[#d4af37] text-sm mt-2 font-medium">Bekal Dunia Sampai Akhirat!!</p>
              </div>

              <p>Wallahul Muwaffiq Ila Aqwamit Thariq.</p>

              <p className="font-semibold text-[#111827]">Wassalamu Alaikum Wr Wb</p>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-400">Kepala Sekolah,</p>
                <p className="font-semibold text-[#111827] mt-0.5">Ahmad Rofiq, S Pd.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider ornamen */}
        <div className="flex items-center justify-center gap-4 opacity-25">
          <div className="h-px flex-1 bg-[#1a5c3a]" />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5L10 2Z" fill="#1a5c3a"/>
          </svg>
          <div className="h-px flex-1 bg-[#1a5c3a]" />
        </div>

        {/* ── 2. VISI DAN MISI ── */}
        <section id="visi-misi" aria-labelledby="visi-misi-heading">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-px w-6 bg-[#1a5c3a]" />
              <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">Arah &amp; Tujuan</span>
            </div>
            <h2 id="visi-misi-heading" className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-10">
              Visi &amp; Misi
            </h2>

            <div className="grid md:grid-cols-[1fr_1.4fr] gap-6">
              {/* Visi */}
              <div className="relative rounded-2xl bg-[#0d2e1a] text-white p-8 md:p-10 overflow-hidden flex flex-col justify-between min-h-[260px]">
                {/* Ornamen lingkaran */}
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-white/10" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full border border-white/5" />

                <div className="relative">
                  <p className="text-[#d4af37] text-xs font-semibold tracking-[0.18em] uppercase mb-4">Visi</p>
                  <p className="font-serif text-xl md:text-2xl text-white leading-snug">
                    "{VISI}"
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

              {/* Misi */}
              <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-10 shadow-sm">
                <p className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase mb-6">Misi</p>
                <div className="space-y-6">
                  {MISI.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#f0f9f4] border border-[#1a5c3a]/20 text-[#1a5c3a] text-xs font-bold flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-gray-700 leading-relaxed text-[0.925rem]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider ornamen */}
        <div className="flex items-center justify-center gap-4 opacity-25">
          <div className="h-px flex-1 bg-[#1a5c3a]" />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5L10 2Z" fill="#1a5c3a"/>
          </svg>
          <div className="h-px flex-1 bg-[#1a5c3a]" />
        </div>

        {/* ── 3. STRUKTUR ORGANISASI ── */}
        <section aria-labelledby="struktur-heading">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-px w-6 bg-[#1a5c3a]" />
              <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">Kepengurusan</span>
            </div>
            <h2 id="struktur-heading" className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-10">
              Struktur Organisasi
            </h2>

            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0d2e1a] text-white">
                    <th className="px-6 py-4 text-left font-medium text-white/60 text-xs w-14">No</th>
                    <th className="px-6 py-4 text-left font-semibold">Jabatan</th>
                    <th className="px-6 py-4 text-left font-semibold">Nama</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {STRUKTUR_ORGANISASI.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#f0f9f4] transition-colors duration-150"
                    >
                      <td className="px-6 py-3.5 text-gray-300 font-mono text-xs">{String(idx + 1).padStart(2, '0')}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          {item.level > 0 && (
                            <span className="flex items-center gap-0 text-gray-200">
                              {Array.from({ length: item.level }).map((_, i) => (
                                <ChevronRight key={i} className="h-3 w-3" />
                              ))}
                            </span>
                          )}
                          <span
                            className={
                              item.level === 0
                                ? 'font-semibold text-[#1a5c3a] text-[0.9rem]'
                                : item.level === 1
                                ? 'text-gray-700 text-[0.9rem]'
                                : 'text-gray-500 text-[0.875rem]'
                            }
                          >
                            {item.jabatan}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-gray-500 text-[0.875rem]">{item.nama}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              Struktur organisasi dapat berubah sesuai kebijakan sekolah
            </p>
          </div>
        </section>

        {/* Divider ornamen */}
        <div className="flex items-center justify-center gap-4 opacity-25">
          <div className="h-px flex-1 bg-[#1a5c3a]" />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5L10 2Z" fill="#1a5c3a"/>
          </svg>
          <div className="h-px flex-1 bg-[#1a5c3a]" />
        </div>

        {/* ── 4. INFORMASI KONTAK & PETA ── */}
        <section id="kontak" aria-labelledby="kontak-heading">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-px w-6 bg-[#1a5c3a]" />
              <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">Temukan Kami</span>
            </div>
            <h2 id="kontak-heading" className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-10">
              Informasi Kontak &amp; Lokasi
            </h2>
            <ContactMap />
          </div>
        </section>

        {/* ── 5. MEDIA SOSIAL ── */}
        <section aria-labelledby="sosmed-heading">
          <div className="max-w-5xl mx-auto">
            <div className="bg-[#0d2e1a] rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
              {/* Ornamen background */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-64 h-64 rounded-full border border-white -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full border border-white translate-x-1/4 translate-y-1/4" />
              </div>

              <div className="relative">
                <p className="text-[#d4af37] text-xs font-semibold tracking-[0.18em] uppercase mb-3">Tetap Terhubung</p>
                <h2 id="sosmed-heading" className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
                  Media Sosial Resmi
                </h2>
                <p className="text-white/50 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                  Dapatkan informasi terbaru seputar kegiatan sekolah, pengumuman, dan prestasi siswa melalui akun media sosial resmi kami.
                </p>

                <div className="flex flex-wrap justify-center gap-3">
                  {SOSMED.map(({ nama, href, icon: Icon, warna, label }) => (
                    <a
                      key={nama}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-white font-medium text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-black/30 ${warna}`}
                    >
                      <Icon className="h-4 w-4" />
                      {nama}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}
