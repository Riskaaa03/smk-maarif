'use client'

const steps = [
  {
    number: '1',
    stepLabel: 'Langkah pertama',
    title: 'Isi Formulir Online',
    desc: 'Lengkapi formulir pendaftaran di halaman ini dengan data diri yang akurat dan lengkap.',
  },
  {
    number: '2',
    stepLabel: 'Langkah kedua',
    title: 'Unggah Dokumen',
    desc: 'Siapkan dan unggah seluruh dokumen persyaratan dalam format yang ditentukan.',
  },
  {
    number: '3',
    stepLabel: 'Langkah ketiga',
    title: 'Verifikasi & Wawancara',
    desc: 'Panitia akan menghubungi Anda untuk jadwal verifikasi berkas dan sesi wawancara.',
  },
  {
    number: '4',
    stepLabel: 'Langkah terakhir',
    title: 'Pengumuman & Daftar Ulang',
    desc: 'Hasil seleksi diumumkan 7 Juli 2026. Peserta yang diterima wajib melakukan daftar ulang.',
  },
]

export default function AlurPendaftaran() {
  return (
    <section aria-labelledby="alur-heading">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-600">
          Cara Daftar
        </span>
        <span className="h-px w-8 bg-amber-600/40" aria-hidden="true" />
      </div>
      <h2
        id="alur-heading"
        className="mb-1 font-serif text-2xl font-bold text-gray-900"
      >
        Alur Pendaftaran
      </h2>
      <p className="mb-8 max-w-xl text-sm leading-relaxed text-gray-500">
        Ikuti langkah-langkah berikut untuk menyelesaikan proses pendaftaran.
      </p>

      <div className="flex flex-col">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1
          return (
            <div key={step.number} className="grid grid-cols-[40px_1fr] gap-x-5">
              {/* Left: dot + connector */}
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-nu-green-700 font-serif text-xs font-bold text-white">
                  {step.number}
                </div>
                {!isLast && (
                  <div className="w-px flex-1 bg-gray-200" aria-hidden="true" />
                )}
              </div>

              {/* Right: content */}
              <div className={isLast ? 'pb-0 pt-1' : 'pb-8 pt-1'}>
                <p className="mb-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
                  {step.stepLabel}
                </p>
                <h3 className="mb-1 text-[15px] font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {step.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
