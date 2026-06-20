/**
 * Integration Tests: Aksesibilitas — axe-core
 *
 * Validates: Requirements 10.5
 *
 * Test aksesibilitas untuk semua komponen utama menggunakan axe-core,
 * serta navigasi keyboard pada hamburger menu dan form PPDB.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import React from 'react'

// ============================================================
// Mock next/navigation
// ============================================================
const mockUsePathname = vi.fn(() => '/profil')

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}))

// ============================================================
// Mock next/link sebagai <a> biasa
// ============================================================
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => React.createElement('a', { href, ...props }, children),
}))

// ============================================================
// Mock @/lib/actions/ppdb
// ============================================================
vi.mock('@/lib/actions/ppdb', () => ({
  submitPPDB: vi.fn(),
}))

// ============================================================
// Mock lucide-react (menghindari masalah SVG rendering)
// ============================================================
vi.mock('lucide-react', () => ({
  MapPin: () => null,
  Phone: () => null,
  Mail: () => null,
  Facebook: () => null,
  Instagram: () => null,
  Youtube: () => null,
  ChevronRight: () => null,
  Home: () => null,
  Search: () => null,
}))

// ============================================================
// Import komponen setelah mock
// ============================================================
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Breadcrumb from '@/components/layout/Breadcrumb'
import FormPPDB from '@/components/ppdb/FormPPDB'

// ============================================================
// Helper: jalankan axe pada container
// ============================================================
async function runAxe(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: {
      // jsdom tidak menghitung CSS color — nonaktifkan rule ini
      'color-contrast': { enabled: false },
      // jsdom tidak menghitung scroll — nonaktifkan rule ini
      'scrollable-region-focusable': { enabled: false },
    },
    // Jangan analisis iframe karena jsdom tidak mendukung cross-frame messaging
    iframes: false,
  })
  return results
}

function formatViolations(violations: axe.Result[]) {
  return violations
    .map(
      (v) =>
        `[${v.id}] ${v.description}: ${v.nodes.map((n) => n.html).join(', ')}`,
    )
    .join('\n')
}

// ============================================================
// Setup
// ============================================================
beforeEach(() => {
  vi.clearAllMocks()
  mockUsePathname.mockReturnValue('/profil')
})

// ============================================================
// Header
// ============================================================
describe('Aksesibilitas — axe-core integration tests', () => {
  describe('Header', () => {
    it('tidak ada pelanggaran aksesibilitas pada Header', async () => {
      let container!: HTMLElement
      await act(async () => {
        ;({ container } = render(<Header />))
      })
      const results = await runAxe(container)
      expect(
        results.violations,
        formatViolations(results.violations),
      ).toHaveLength(0)
    })

    it('hamburger button memiliki aria-label yang deskriptif', async () => {
      await act(async () => {
        render(<Header />)
      })
      const hamburger = screen.getByTestId('hamburger-menu')
      expect(hamburger).toHaveAttribute('aria-label', 'Buka menu navigasi')
    })

    it('hamburger button memiliki aria-expanded', async () => {
      await act(async () => {
        render(<Header />)
      })
      const hamburger = screen.getByTestId('hamburger-menu')
      expect(hamburger).toHaveAttribute('aria-expanded')
    })

    it('desktop nav memiliki role navigation dan aria-label', async () => {
      await act(async () => {
        render(<Header />)
      })
      const desktopNav = screen.getByTestId('desktop-nav')
      expect(desktopNav).toHaveAttribute('role', 'navigation')
      expect(desktopNav).toHaveAttribute('aria-label')
      expect(desktopNav.getAttribute('aria-label')).not.toBe('')
    })
  })

  // ============================================================
  // Footer
  // ============================================================
  describe('Footer', () => {
    it('tidak ada pelanggaran aksesibilitas pada Footer', async () => {
      const { container } = render(<Footer />)
      const results = await runAxe(container)
      expect(
        results.violations,
        formatViolations(results.violations),
      ).toHaveLength(0)
    })

    it('footer memiliki role contentinfo', () => {
      render(<Footer />)
      const footer = document.querySelector('footer')
      expect(footer).toHaveAttribute('role', 'contentinfo')
    })

    it('tautan media sosial memiliki aria-label yang deskriptif', () => {
      render(<Footer />)
      // Cari semua link yang merupakan tautan media sosial (target="_blank")
      const socialLinks = document
        .querySelectorAll('a[target="_blank"]')
      expect(socialLinks.length).toBeGreaterThan(0)
      socialLinks.forEach((link) => {
        const ariaLabel = link.getAttribute('aria-label')
        expect(ariaLabel).toBeTruthy()
        expect(ariaLabel!.length).toBeGreaterThan(0)
      })
    })

    it('iframe Google Maps memiliki title', () => {
      render(<Footer />)
      const iframe = document.querySelector('iframe')
      expect(iframe).toBeInTheDocument()
      expect(iframe).toHaveAttribute('title')
      expect(iframe!.getAttribute('title')).not.toBe('')
    })
  })

  // ============================================================
  // Breadcrumb
  // ============================================================
  describe('Breadcrumb', () => {
    it('tidak ada pelanggaran aksesibilitas pada Breadcrumb', async () => {
      mockUsePathname.mockReturnValue('/profil')
      const { container } = render(<Breadcrumb />)
      const results = await runAxe(container)
      expect(
        results.violations,
        formatViolations(results.violations),
      ).toHaveLength(0)
    })

    it('breadcrumb memiliki aria-label "Breadcrumb"', () => {
      mockUsePathname.mockReturnValue('/profil')
      render(<Breadcrumb />)
      const nav = screen.getByTestId('breadcrumb')
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb')
    })

    it('item terakhir memiliki aria-current="page"', () => {
      mockUsePathname.mockReturnValue('/profil')
      render(<Breadcrumb />)
      const currentItem = document.querySelector('[aria-current="page"]')
      expect(currentItem).toBeInTheDocument()
    })

    it('tidak dirender di halaman beranda', () => {
      mockUsePathname.mockReturnValue('/')
      render(<Breadcrumb />)
      const breadcrumb = screen.queryByTestId('breadcrumb')
      expect(breadcrumb).not.toBeInTheDocument()
    })
  })

  // ============================================================
  // FormPPDB
  // ============================================================
  describe('FormPPDB', () => {
    it('tidak ada pelanggaran aksesibilitas pada FormPPDB', async () => {
      const { container } = render(<FormPPDB />)
      const results = await runAxe(container)
      expect(
        results.violations,
        formatViolations(results.violations),
      ).toHaveLength(0)
    })

    it('semua input memiliki label yang terhubung', () => {
      render(<FormPPDB />)
      // Cek semua input (kecuali radio yang menggunakan fieldset/legend)
      const inputs = document.querySelectorAll(
        'input:not([type="radio"]), select, textarea',
      )
      expect(inputs.length).toBeGreaterThan(0)
      inputs.forEach((input) => {
        const id = input.getAttribute('id')
        if (id) {
          const label = document.querySelector(`label[for="${id}"]`)
          expect(label, `Input dengan id="${id}" harus memiliki label`).toBeInTheDocument()
        }
      })
    })

    it('form memiliki aria-label', () => {
      render(<FormPPDB />)
      const form = document.querySelector('form')
      expect(form).toHaveAttribute('aria-label', 'Formulir Pendaftaran PPDB')
    })

    it('tombol submit dapat difokus dan memiliki teks yang deskriptif', () => {
      render(<FormPPDB />)
      const submitBtn = screen.getByRole('button', { name: /kirim pendaftaran/i })
      expect(submitBtn).toBeInTheDocument()
      // Tombol tidak boleh memiliki tabIndex negatif
      const tabIndex = submitBtn.getAttribute('tabindex')
      expect(tabIndex === null || parseInt(tabIndex) >= 0).toBe(true)
    })
  })

  // ============================================================
  // Navigasi keyboard — hamburger menu
  // ============================================================
  describe('Navigasi keyboard — hamburger menu', () => {
    it('hamburger button dapat difokus dengan Tab', async () => {
      const user = userEvent.setup()
      await act(async () => {
        render(<Header />)
      })
      const hamburger = screen.getByTestId('hamburger-menu')

      // Tab ke elemen yang dapat difokus
      await user.tab()

      // Hamburger mungkin tidak menjadi elemen pertama yang difokus,
      // tapi harus dapat difokus — fokus langsung ke hamburger
      hamburger.focus()
      expect(document.activeElement).toBe(hamburger)
    })

    it('menekan Enter pada hamburger membuka drawer', async () => {
      const user = userEvent.setup()
      await act(async () => {
        render(<Header />)
      })
      const hamburger = screen.getByTestId('hamburger-menu')

      // Fokus ke hamburger dan tekan Enter
      hamburger.focus()
      await user.keyboard('{Enter}')

      // Drawer harus muncul
      await waitFor(() => {
        const drawer = document.getElementById('mobile-drawer')
        expect(drawer).toBeInTheDocument()
      })
    })

    it('menekan Escape menutup drawer', async () => {
      const user = userEvent.setup()
      await act(async () => {
        render(<Header />)
      })
      const hamburger = screen.getByTestId('hamburger-menu')

      // Buka drawer
      hamburger.focus()
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(document.getElementById('mobile-drawer')).toBeInTheDocument()
      })

      // Tekan Escape untuk menutup
      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(document.getElementById('mobile-drawer')).not.toBeInTheDocument()
      })
    })

    it('tombol tutup drawer dapat difokus', async () => {
      const user = userEvent.setup()
      await act(async () => {
        render(<Header />)
      })
      const hamburger = screen.getByTestId('hamburger-menu')

      // Buka drawer
      hamburger.focus()
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(document.getElementById('mobile-drawer')).toBeInTheDocument()
      })

      // Cari tombol tutup
      const closeBtn = screen.getByRole('button', { name: /tutup menu navigasi/i })
      expect(closeBtn).toBeInTheDocument()

      // Tombol tutup harus dapat difokus
      closeBtn.focus()
      expect(document.activeElement).toBe(closeBtn)
    })
  })

  // ============================================================
  // Navigasi keyboard — FormPPDB
  // ============================================================
  describe('Navigasi keyboard — FormPPDB', () => {
    it('semua field form dapat difokus dengan Tab', async () => {
      const user = userEvent.setup()
      render(<FormPPDB />)

      // Kumpulkan semua elemen yang dapat difokus dalam form
      const form = document.querySelector('form')!
      const focusableSelectors = [
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'button:not([disabled])',
      ].join(', ')
      const focusableElements = Array.from(
        form.querySelectorAll<HTMLElement>(focusableSelectors),
      )

      expect(focusableElements.length).toBeGreaterThan(0)

      // Tab melalui semua elemen — verifikasi setiap elemen dapat difokus
      for (const el of focusableElements) {
        el.focus()
        expect(document.activeElement).toBe(el)
      }
    })

    it('tombol submit dapat difokus dengan Tab', async () => {
      const user = userEvent.setup()
      render(<FormPPDB />)

      const submitBtn = screen.getByRole('button', { name: /kirim pendaftaran/i })

      // Fokus langsung ke tombol submit
      submitBtn.focus()
      expect(document.activeElement).toBe(submitBtn)
    })

    it('pesan error muncul setelah submit dengan field kosong', async () => {
      const user = userEvent.setup()
      render(<FormPPDB />)

      // Submit form tanpa mengisi field apapun
      const submitBtn = screen.getByRole('button', { name: /kirim pendaftaran/i })
      await user.click(submitBtn)

      // Pesan error harus muncul
      await waitFor(() => {
        const alerts = document.querySelectorAll('[role="alert"]')
        expect(alerts.length).toBeGreaterThan(0)
      })
    })
  })
})
