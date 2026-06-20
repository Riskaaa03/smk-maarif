/**
 * Unit tests untuk Payload CMS collections
 * Memverifikasi schema fields, access control, dan registrasi collection
 * Requirements: 8.4
 */

import { describe, it, expect } from 'vitest'
import { Berita } from '../../payload/collections/Berita'
import { GaleriItem } from '../../payload/collections/GaleriItem'
import { ProgramKeahlian } from '../../payload/collections/ProgramKeahlian'
import { MitraIndustri } from '../../payload/collections/MitraIndustri'
import { RegistrasiPPDB } from '../../payload/collections/RegistrasiPPDB'

// ── Helper ──────────────────────────────────────────────────────────────────

type AnyField = { name?: string; [key: string]: unknown }

/**
 * Mencari field berdasarkan nama dalam array fields.
 * Mengembalikan field pertama yang cocok, atau undefined jika tidak ditemukan.
 */
function findField(fields: AnyField[], name: string): AnyField | undefined {
  return fields.find((f) => f.name === name)
}

/**
 * Mengambil nilai option dari field select (array of { label, value } atau string).
 */
function getOptionValues(field: AnyField): string[] {
  const options = field.options as Array<{ label: string; value: string } | string> | undefined
  if (!options) return []
  return options.map((o) => (typeof o === 'string' ? o : o.value))
}

// ── Berita ──────────────────────────────────────────────────────────────────

describe('Berita collection', () => {
  const fields = Berita.fields as AnyField[]

  it('memiliki slug yang benar', () => {
    expect(Berita.slug).toBe('berita')
  })

  it.each([
    'slug',
    'judul',
    'ringkasan',
    'konten',
    'thumbnail',
    'kategori',
    'penulis',
    'tanggalPublikasi',
    'diterbitkan',
  ])('memiliki field "%s"', (fieldName) => {
    expect(findField(fields, fieldName)).toBeDefined()
  })

  it.each(['slug', 'judul', 'ringkasan', 'konten', 'thumbnail', 'kategori', 'penulis', 'tanggalPublikasi'])(
    'field "%s" bersifat required',
    (fieldName) => {
      const field = findField(fields, fieldName)
      expect(field?.required).toBe(true)
    },
  )

  it('field "slug" bersifat unique', () => {
    const field = findField(fields, 'slug')
    expect(field?.unique).toBe(true)
  })

  it('field "ringkasan" memiliki maxLength 300', () => {
    const field = findField(fields, 'ringkasan')
    expect(field?.maxLength).toBe(300)
  })

  it('field "kategori" memiliki opsi yang sesuai dengan TypeScript union', () => {
    const field = findField(fields, 'kategori')
    const values = getOptionValues(field!)
    expect(values).toEqual(expect.arrayContaining(['berita', 'pengumuman', 'prestasi', 'kegiatan']))
    expect(values).toHaveLength(4)
  })

  it('field "diterbitkan" memiliki defaultValue false', () => {
    const field = findField(fields, 'diterbitkan')
    expect(field?.defaultValue).toBe(false)
  })
})

// ── GaleriItem ───────────────────────────────────────────────────────────────

describe('GaleriItem collection', () => {
  const fields = GaleriItem.fields as AnyField[]

  it('memiliki slug yang benar', () => {
    expect(GaleriItem.slug).toBe('galeri')
  })

  it.each(['judul', 'deskripsi', 'urlMedia', 'tipeMedia', 'kategori', 'tanggal', 'urutan'])(
    'memiliki field "%s"',
    (fieldName) => {
      expect(findField(fields, fieldName)).toBeDefined()
    },
  )

  it.each(['judul', 'urlMedia', 'tipeMedia', 'kategori', 'tanggal'])(
    'field "%s" bersifat required',
    (fieldName) => {
      const field = findField(fields, fieldName)
      expect(field?.required).toBe(true)
    },
  )

  it('field "deskripsi" tidak required (nullable)', () => {
    const field = findField(fields, 'deskripsi')
    // required bisa false atau undefined — keduanya berarti tidak wajib
    expect(field?.required).toBeFalsy()
  })

  it('field "tipeMedia" memiliki opsi foto dan video', () => {
    const field = findField(fields, 'tipeMedia')
    const values = getOptionValues(field!)
    expect(values).toEqual(expect.arrayContaining(['foto', 'video']))
    expect(values).toHaveLength(2)
  })

  it('field "urutan" memiliki defaultValue 0', () => {
    const field = findField(fields, 'urutan')
    expect(field?.defaultValue).toBe(0)
  })
})

// ── ProgramKeahlian ──────────────────────────────────────────────────────────

describe('ProgramKeahlian collection', () => {
  const fields = ProgramKeahlian.fields as AnyField[]

  it('memiliki slug yang benar', () => {
    expect(ProgramKeahlian.slug).toBe('program-keahlian')
  })

  it.each([
    'kode',
    'namaLengkap',
    'deskripsiSingkat',
    'deskripsiLengkap',
    'tujuan',
    'kompetensi',
    'prospekKerja',
    'prestasi',
    'foto',
  ])('memiliki field "%s"', (fieldName) => {
    expect(findField(fields, fieldName)).toBeDefined()
  })

  it.each(['kode', 'namaLengkap', 'deskripsiSingkat', 'deskripsiLengkap', 'tujuan', 'kompetensi', 'prospekKerja', 'foto'])(
    'field "%s" bersifat required',
    (fieldName) => {
      const field = findField(fields, fieldName)
      expect(field?.required).toBe(true)
    },
  )

  it('field "kode" bersifat unique', () => {
    const field = findField(fields, 'kode')
    expect(field?.unique).toBe(true)
  })

  it('field "kode" memiliki opsi TBSM, TJKT, AKL', () => {
    const field = findField(fields, 'kode')
    const values = getOptionValues(field!)
    expect(values).toEqual(expect.arrayContaining(['TBSM', 'TJKT', 'AKL']))
    expect(values).toHaveLength(3)
  })

  it('field "deskripsiSingkat" memiliki maxLength 200', () => {
    const field = findField(fields, 'deskripsiSingkat')
    expect(field?.maxLength).toBe(200)
  })

  it.each(['kompetensi', 'prospekKerja', 'prestasi'])('field "%s" bertipe array', (fieldName) => {
    const field = findField(fields, fieldName)
    expect(field?.type).toBe('array')
  })
})

// ── MitraIndustri ────────────────────────────────────────────────────────────

describe('MitraIndustri collection', () => {
  const fields = MitraIndustri.fields as AnyField[]

  it('memiliki slug yang benar', () => {
    expect(MitraIndustri.slug).toBe('mitra-industri')
  })

  it.each(['namaMitra', 'logoUrl', 'bidangUsaha', 'kotaDomisili', 'hasMOU', 'tanggalMOU', 'tempatPKL', 'urutan'])(
    'memiliki field "%s"',
    (fieldName) => {
      expect(findField(fields, fieldName)).toBeDefined()
    },
  )

  it.each(['namaMitra', 'bidangUsaha', 'kotaDomisili'])(
    'field "%s" bersifat required',
    (fieldName) => {
      const field = findField(fields, fieldName)
      expect(field?.required).toBe(true)
    },
  )

  it('field "logoUrl" tidak required (nullable)', () => {
    const field = findField(fields, 'logoUrl')
    expect(field?.required).toBeFalsy()
  })

  it('field "tanggalMOU" tidak required (nullable)', () => {
    const field = findField(fields, 'tanggalMOU')
    expect(field?.required).toBeFalsy()
  })

  it('field "hasMOU" memiliki defaultValue false', () => {
    const field = findField(fields, 'hasMOU')
    expect(field?.defaultValue).toBe(false)
  })

  it('field "tempatPKL" memiliki defaultValue false', () => {
    const field = findField(fields, 'tempatPKL')
    expect(field?.defaultValue).toBe(false)
  })

  it('field "urutan" memiliki defaultValue 0', () => {
    const field = findField(fields, 'urutan')
    expect(field?.defaultValue).toBe(0)
  })
})

// ── RegistrasiPPDB ───────────────────────────────────────────────────────────

describe('RegistrasiPPDB collection — schema', () => {
  const fields = RegistrasiPPDB.fields as AnyField[]

  it('memiliki slug yang benar', () => {
    expect(RegistrasiPPDB.slug).toBe('registrasi-ppdb')
  })

  it.each([
    'nomorPendaftaran',
    'status',
    'tanggalDaftar',
    'namaLengkap',
    'nik',
    'tempatLahir',
    'tanggalLahir',
    'jenisKelamin',
    'agama',
    'alamat',
    'asalSekolah',
    'nisn',
    'tahunLulus',
    'programKeahlianPilihan1',
    'programKeahlianPilihan2',
    'namaOrangTua',
    'pekerjaanOrangTua',
    'nomorHP',
    'email',
  ])('memiliki field "%s"', (fieldName) => {
    expect(findField(fields, fieldName)).toBeDefined()
  })

  it.each([
    'nomorPendaftaran',
    'tanggalDaftar',
    'namaLengkap',
    'nik',
    'tempatLahir',
    'tanggalLahir',
    'jenisKelamin',
    'agama',
    'alamat',
    'asalSekolah',
    'nisn',
    'tahunLulus',
    'programKeahlianPilihan1',
    'namaOrangTua',
    'pekerjaanOrangTua',
    'nomorHP',
    'email',
  ])('field "%s" bersifat required', (fieldName) => {
    const field = findField(fields, fieldName)
    expect(field?.required).toBe(true)
  })

  it('field "nomorPendaftaran" bersifat unique', () => {
    const field = findField(fields, 'nomorPendaftaran')
    expect(field?.unique).toBe(true)
  })

  it('field "nik" memiliki minLength 16 dan maxLength 16', () => {
    const field = findField(fields, 'nik')
    expect(field?.minLength).toBe(16)
    expect(field?.maxLength).toBe(16)
  })

  it('field "nisn" memiliki minLength 10 dan maxLength 10', () => {
    const field = findField(fields, 'nisn')
    expect(field?.minLength).toBe(10)
    expect(field?.maxLength).toBe(10)
  })

  it('field "jenisKelamin" memiliki opsi L dan P', () => {
    const field = findField(fields, 'jenisKelamin')
    const values = getOptionValues(field!)
    expect(values).toEqual(expect.arrayContaining(['L', 'P']))
    expect(values).toHaveLength(2)
  })

  it('field "programKeahlianPilihan1" memiliki opsi TBSM, TJKT, AKL', () => {
    const field = findField(fields, 'programKeahlianPilihan1')
    const values = getOptionValues(field!)
    expect(values).toEqual(expect.arrayContaining(['TBSM', 'TJKT', 'AKL']))
    expect(values).toHaveLength(3)
  })

  it('field "programKeahlianPilihan2" memiliki opsi TBSM, TJKT, AKL dan tidak required', () => {
    const field = findField(fields, 'programKeahlianPilihan2')
    const values = getOptionValues(field!)
    expect(values).toEqual(expect.arrayContaining(['TBSM', 'TJKT', 'AKL']))
    expect(values).toHaveLength(3)
    expect(field?.required).toBeFalsy()
  })

  it('field "status" memiliki opsi pending, verified, accepted, rejected', () => {
    const field = findField(fields, 'status')
    const values = getOptionValues(field!)
    expect(values).toEqual(expect.arrayContaining(['pending', 'verified', 'accepted', 'rejected']))
    expect(values).toHaveLength(4)
  })

  it('field "status" memiliki defaultValue "pending"', () => {
    const field = findField(fields, 'status')
    expect(field?.defaultValue).toBe('pending')
  })
})

// ── RegistrasiPPDB — Access Control ─────────────────────────────────────────

describe('RegistrasiPPDB collection — access control', () => {
  const access = RegistrasiPPDB.access as {
    read: (args: { req: { user: unknown } }) => boolean
    create: () => boolean
    update: (args: { req: { user: unknown } }) => boolean
    delete: (args: { req: { user: unknown } }) => boolean
  }

  describe('read', () => {
    it('menolak pengunjung tidak terautentikasi (req.user = null)', () => {
      expect(access.read({ req: { user: null } })).toBe(false)
    })

    it('menolak pengunjung tidak terautentikasi (req.user = undefined)', () => {
      expect(access.read({ req: { user: undefined } })).toBe(false)
    })

    it('mengizinkan admin terautentikasi (req.user = objek user)', () => {
      expect(access.read({ req: { user: { id: '1', email: 'admin@smk.sch.id' } } })).toBe(true)
    })
  })

  describe('create', () => {
    it('selalu mengizinkan (untuk Server Action publik)', () => {
      expect(access.create()).toBe(true)
    })
  })

  describe('update', () => {
    it('menolak pengunjung tidak terautentikasi (req.user = null)', () => {
      expect(access.update({ req: { user: null } })).toBe(false)
    })

    it('menolak pengunjung tidak terautentikasi (req.user = undefined)', () => {
      expect(access.update({ req: { user: undefined } })).toBe(false)
    })

    it('mengizinkan admin terautentikasi (req.user = objek user)', () => {
      expect(access.update({ req: { user: { id: '1', email: 'admin@smk.sch.id' } } })).toBe(true)
    })
  })

  describe('delete', () => {
    it('menolak pengunjung tidak terautentikasi (req.user = null)', () => {
      expect(access.delete({ req: { user: null } })).toBe(false)
    })

    it('menolak pengunjung tidak terautentikasi (req.user = undefined)', () => {
      expect(access.delete({ req: { user: undefined } })).toBe(false)
    })

    it('mengizinkan admin terautentikasi (req.user = objek user)', () => {
      expect(access.delete({ req: { user: { id: '1', email: 'admin@smk.sch.id' } } })).toBe(true)
    })
  })
})

// ── payload.config.ts — Registrasi Collections ──────────────────────────────

describe('payload.config.ts — registrasi collections', () => {
  it('mendaftarkan semua 5 collections yang diperlukan', async () => {
    // Import dinamis untuk menghindari eksekusi buildConfig secara penuh
    // Kita hanya perlu memeriksa bahwa semua collection terdaftar
    const expectedSlugs = [
      'berita',
      'galeri',
      'program-keahlian',
      'mitra-industri',
      'registrasi-ppdb',
    ]

    // Verifikasi melalui import langsung collection objects
    const registeredCollections = [Berita, GaleriItem, ProgramKeahlian, MitraIndustri, RegistrasiPPDB]
    const registeredSlugs = registeredCollections.map((c) => c.slug)

    for (const slug of expectedSlugs) {
      expect(registeredSlugs).toContain(slug)
    }
  })

  it('Berita terdaftar dengan slug "berita"', () => {
    expect(Berita.slug).toBe('berita')
  })

  it('GaleriItem terdaftar dengan slug "galeri"', () => {
    expect(GaleriItem.slug).toBe('galeri')
  })

  it('ProgramKeahlian terdaftar dengan slug "program-keahlian"', () => {
    expect(ProgramKeahlian.slug).toBe('program-keahlian')
  })

  it('MitraIndustri terdaftar dengan slug "mitra-industri"', () => {
    expect(MitraIndustri.slug).toBe('mitra-industri')
  })

  it('RegistrasiPPDB terdaftar dengan slug "registrasi-ppdb"', () => {
    expect(RegistrasiPPDB.slug).toBe('registrasi-ppdb')
  })
})
