import db from '@/lib/db'
import { generateNomorPendaftaran } from '@/lib/ppdb'
import { ppdbSchema, type PPDBFormData } from '@/lib/validations/ppdb'
import type { PPDBSubmitResponse } from '@/types/index'

// =================================================================

export async function submitPPDB(formData: PPDBFormData): Promise<PPDBSubmitResponse> {
  // 1. Re-validasi di server menggunakan nama skema yang benar (ppdbSchema)
  const parsed = ppdbSchema.safeParse(formData)

  if (!parsed.success) {
    return {
      success: false,
      message: 'Validasi data gagal.',
      errors: parsed.error.errors.map((err) => ({
        field: err.path[0] as string,
        message: err.message,
      })),
    }
  }

  try {
    const nomorPendaftaran = await generateNomorPendaftaran()
    
    // Menyimpan ke database Prisma / database Anda
    await db.pendaftaranPPDB.create({
      data: {
        nomorPendaftaran,
        ...parsed.data,
      },
    })

    return {
      success: true,
      nomorPendaftaran,
    }
  } catch (error) {
    console.error('PPDB_SUBMIT_ERROR:', error)
    return {
      success: false,
      message: 'Gagal menyimpan data ke server. Silakan coba lagi nanti.',
    }
  }
}
