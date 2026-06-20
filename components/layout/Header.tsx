'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SearchBar from './SearchBar'
import logoSekolah from './images/logo_smk.png'

// ============================================================
// Tipe navigasi
// ============================================================
interface NavChild {
  label: string
  href: string
}

interface NavItem {
  label: string
  href: string
  children?: NavChild[]
}

// ============================================================
// Data navigasi utama
// ============================================================
const navItems: NavItem[] = [
  { label: 'Beranda', href: '/' },
  { label: 'Profil', href: '/profil' },
  {
    label: 'Program Keahlian',
    href: '/program-keahlian',
    children: [
      { label: 'TBSM — Teknik dan Bisnis Sepeda Motor', href: '/program-keahlian/tbsm' },
      { label: 'TJKT — Teknik Jaringan Komputer dan Telekomunikasi', href: '/program-keahlian/tjkt' },
      { label: 'AKL — Akuntansi dan Keuangan Lembaga', href: '/program-keahlian/akl' },
    ],
  },
  { label: 'Kurikulum', href: '/kurikulum' },
  { label: 'Sarana & Prasarana', href: '/sarana-prasarana' },
  { label: 'Kesiswaan', href: '/kesiswaan' },
  { label: 'Humas', href: '/humas' },
  { label: 'PPDB', href: '/ppdb' },
]

// ============================================================
// Sub-komponen: Logo area
// ============================================================
function LogoArea() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 shrink-0"
      aria-label="SMK Ma'arif NU 01 Karangkobar - Halaman Beranda"
    >
      {/* Logo Sekolah */}
      <div className="relative w-10 h-10 shrink-0">
        <Image
          src={logoSekolah}
          alt="Logo SMK Ma'arif NU 01 Karangkobar"
          fill
          className="object-contain"
          sizes="40px"
          priority
        />
      </div>

      {/* Nama sekolah */}
      <div className="hidden sm:block">
        <p className="text-sm font-bold text-sage-800 leading-tight">
          SMK Ma&apos;arif NU 01
        </p>
        <p className="text-xs text-sage-600 leading-tight">Karangkobar</p>
      </div>
    </Link>
  )
}

// ============================================================
// Sub-komponen: Dropdown item untuk desktop nav
// ============================================================
function DesktopDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false)
        }}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-1 px-1 py-2 text-sm font-medium text-gray-700
                   hover:text-sage-700 focus:outline-none focus:text-sage-700
                   transition-colors duration-150 whitespace-nowrap"
      >
        {item.label}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg
                     border border-gray-100 py-1 z-50"
        >
          {item.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-sage-50
                         hover:text-sage-700 transition-colors duration-150"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================
// Sub-komponen: Desktop navigation
// ============================================================
function DesktopNav() {
  return (
    <nav
      role="navigation"
      aria-label="Navigasi utama"
      data-testid="desktop-nav"
      className="hidden lg:flex items-center gap-1"
    >
      {navItems.map((item) =>
        item.children ? (
          <DesktopDropdown key={item.href} item={item} />
        ) : (
          <Link
            key={item.href}
            href={item.href}
            className="px-1 py-2 text-sm font-medium text-gray-700 hover:text-sage-700
                       focus:outline-none focus:text-sage-700 transition-colors duration-150
                       whitespace-nowrap"
          >
            {item.label}
          </Link>
        )
      )}
    </nav>
  )
}

// ============================================================
// Sub-komponen: Mobile drawer
// ============================================================
interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi mobile"
        className="fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-white z-50 shadow-xl
                   flex flex-col lg:hidden overflow-y-auto"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <LogoArea />
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu navigasi"
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100
                       focus:outline-none focus:ring-2 focus:ring-sage-500 transition-colors"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 py-3 border-b border-gray-100">
          <SearchBar onClose={onClose} />
        </div>

        <nav className="flex-1 px-2 py-2">
          {navItems.map((item) => (
            <div key={item.href}>
              {item.children ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedItem((prev) => (prev === item.href ? null : item.href))
                    }
                    aria-expanded={expandedItem === item.href}
                    className="w-full flex items-center justify-between px-3 py-3 text-sm
                               font-medium text-gray-700 hover:bg-sage-50 hover:text-sage-700
                               rounded-md transition-colors duration-150 focus:outline-none
                               focus:ring-2 focus:ring-sage-500"
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedItem === item.href ? 'rotate-180' : ''
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>

                  {expandedItem === item.href && (
                    <div className="ml-3 border-l-2 border-sage-200 pl-3 mb-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className="block px-3 py-2.5 text-sm text-gray-600
                                     hover:text-sage-700 hover:bg-sage-50 rounded-md
                                     transition-colors duration-150"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block px-3 py-3 text-sm font-medium text-gray-700
                             hover:bg-sage-50 hover:text-sage-700 rounded-md
                             transition-colors duration-150"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100 bg-sage-50">
          <p className="text-xs text-sage-700 font-medium text-center">
            SMK Ma&apos;arif NU 01 Karangkobar
          </p>
          
        </div>
      </div>
    </>
  )
}

// ============================================================
// Komponen utama: Header
// ============================================================
export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-30 w-full bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            <LogoArea />
            <DesktopNav />

            <div className="flex items-center gap-2">
              <div className="hidden lg:block">
                {searchOpen ? (
                  <div className="flex items-center gap-2">
                    <SearchBar className="w-64" onClose={() => setSearchOpen(false)} />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      aria-label="Tutup pencarian"
                      className="p-1.5 rounded-md text-gray-500 hover:text-gray-700
                                 hover:bg-gray-100 focus:outline-none focus:ring-2
                                 focus:ring-sage-500 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    aria-label="Buka pencarian"
                    className="p-2 rounded-md text-gray-500 hover:text-sage-700
                               hover:bg-sage-50 focus:outline-none focus:ring-2
                               focus:ring-sage-500 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Buka menu navigasi"
                aria-expanded={drawerOpen}
                aria-controls="mobile-drawer"
                data-testid="hamburger-menu"
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-sage-700
                           hover:bg-sage-50 focus:outline-none focus:ring-2
                           focus:ring-sage-500 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
