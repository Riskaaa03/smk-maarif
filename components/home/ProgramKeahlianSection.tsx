import Link from "next/link";
import Image from "next/image";
import LogoTBSM from "./image/Logo_TBSM.png";
import LogoTJKT from "./image/Logo_TJKT.png";
import LogoAKL from "./image/Logo_Akuntansi.png";

const programs = [
  {
    kode: "TBSM",
    nama: "Teknik & Bisnis Sepeda Motor",
    deskripsi: "Perawatan, perbaikan mesin, kelistrikan, dan pengelasan.",
    logoUrl: LogoTBSM,
    aksen: "#2563eb",
    aksenLight: "#eff6ff",
  },
  {
    kode: "TJKT",
    nama: "Teknik Jaringan Komputer & Telekomunikasi",
    deskripsi: "Pemrograman, jaringan komputer, desain grafis, dan networking.",
    logoUrl: LogoTJKT,
    aksen: "#dc2626",
    aksenLight: "#fff1f2",
  },
  {
    kode: "AKL",
    nama: "Akuntansi & Keuangan Lembaga",
    deskripsi: "Akuntansi, perpajakan, dan manajemen keuangan lembaga.",
    logoUrl: LogoAKL,
    aksen: "#d97706",
    aksenLight: "#fffbeb",
  },
];

export default function ProgramKeahlianSection() {
  return (
    <section className="bg-[#f8f8f6] py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="max-w-5xl mx-auto mb-14">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-px w-6 bg-[#1a5c3a]" />
            <span className="text-[#1a5c3a] text-xs font-semibold tracking-[0.18em] uppercase">
              Jurusan Tersedia
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111827] leading-tight">
              Program Keahlian
            </h2>
            <Link
              href="/program-keahlian"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#1a5c3a] hover:gap-3 transition-all duration-200"
            >
              Lihat semua program
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {programs.map((program, idx) => (
            <Link
              key={program.kode}
              href={`/program-keahlian/${program.kode.toLowerCase()}`}
              className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Garis aksen warna di atas */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: program.aksen }}
              />

              <div className="p-6 flex flex-col flex-1">
                {/* Logo + nomor */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: program.aksenLight }}
                  >
                    <Image
                      src={program.logoUrl}
                      alt={`Logo ${program.nama}`}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <span className="font-serif text-4xl font-bold leading-none select-none text-gray-100">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-[#111827] leading-snug mb-2">
                  {program.nama}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed flex-1">
                  {program.deskripsi}
                </p>

                {/* Garis aksen + CTA */}
                <div className="flex items-center gap-2 mt-6 pt-5 border-t border-gray-100">
                  <div
                    className="w-4 h-0.5 rounded-full transition-all duration-300 group-hover:w-8"
                    style={{ backgroundColor: program.aksen }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: program.aksen }}
                  >
                    Pelajari program
                  </span>
                  <svg
                    className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200"
                    style={{ color: program.aksen }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}