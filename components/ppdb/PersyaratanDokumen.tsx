/**
 * Komponen checklist persyaratan dokumen PPDB.
 * Requirements: 8.3
 */

interface DokumenItem {
  nama: string
  keterangan: string
}

const DOKUMEN_PERSYARATAN: DokumenItem[] = [
  {
    nama: 'Formulir Pendaftaran ',
    keterangan: '1 lembar',
  },
  {
    nama: 'Fotokopi Ijazah Atau Transkip Nilai ',
    keterangan: '1 lembar',
  },
  {
    nama: 'Fotokopi Kartu Keluarga',
    keterangan: '1 lembar',
  },
  {
    nama: 'Fotokopi Akta Kelahiran',
    keterangan: '1 lembar',
  },
  {
    nama: 'Fotokopi KTP Orang Tua',
    keterangan: '1 lembar',
  },
  {
    nama: 'Pas foto 3×4',
    keterangan: '4 lembar, background merah',
  },
  {
    nama: 'Fotocopy KIP (Jika Ada)',
    keterangan: '1 lembar',
  },
  {
    nama: 'Fotocopy Sertifikat Lomba/Piagam Penghargaan',
    keterangan: '1 lembar',
  },
  
]

export default function PersyaratanDokumen() {
  return (
    <section aria-labelledby="persyaratan-dokumen-heading">
      <h2
        id="persyaratan-dokumen-heading"
        className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2"
      >
        <span
          className="inline-block w-1 h-7 rounded bg-nu-green-600 mr-1"
          aria-hidden="true"
        />
        Persyaratan Dokumen
      </h2>
      <p className="text-gray-600 text-sm mb-8">
        Siapkan dokumen-dokumen berikut sebelum melakukan pendaftaran. Semua dokumen wajib
        diserahkan saat verifikasi berkas.
      </p>

      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-nu-green-700 px-6 py-4">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <span aria-hidden="true">📄</span>
            Daftar Dokumen yang Diperlukan
          </h3>
        </div>

        {/* Checklist */}
        <ul
          className="divide-y divide-gray-100"
          aria-label="Daftar persyaratan dokumen PPDB"
        >
          {DOKUMEN_PERSYARATAN.map((dokumen, idx) => (
            <li
              key={idx}
              className="flex items-start gap-4 px-6 py-4 hover:bg-nu-green-50 transition-colors duration-150"
            >
              {/* Ikon centang */}
              <div
                className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-nu-green-100 flex items-center justify-center"
                aria-hidden="true"
              >
                <svg
                  className="w-3.5 h-3.5 text-nu-green-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Nama & keterangan dokumen */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{dokumen.nama}</p>
                <p className="text-xs text-gray-500 mt-0.5">{dokumen.keterangan}</p>
              </div>

              {/* Nomor urut */}
              <span
                className="flex-shrink-0 text-xs font-mono text-gray-400"
                aria-hidden="true"
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
            </li>
          ))}
        </ul>

        {/* Catatan penting */}
        <div className="bg-amber-50 border-t border-amber-100 px-6 py-4">
          <p className="text-xs text-amber-800 flex items-start gap-2">
            <span className="flex-shrink-0 text-base" aria-hidden="true">⚠️</span>
            <span>
              <strong>Catatan:</strong> Dokumen asli wajib dibawa saat verifikasi untuk
              diperlihatkan kepada panitia. Dokumen yang tidak lengkap dapat menyebabkan
              proses pendaftaran ditunda.
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
