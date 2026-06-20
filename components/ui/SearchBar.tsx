'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

interface SearchBarProps {
  /** Placeholder teks pada input pencarian */
  placeholder?: string
  /** Class tambahan untuk wrapper element */
  className?: string
}

/**
 * Komponen SearchBar yang dapat digunakan di berbagai halaman.
 * Saat user submit (Enter atau klik tombol), redirect ke /search?q=[query].
 */
export default function SearchBar({
  placeholder = 'Cari informasi...',
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <div data-testid="search-bar" className={className}>
      {/* Label tersembunyi untuk screen reader */}
      <label htmlFor="search-bar-input" className="sr-only">
        Cari konten website
      </label>

      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex items-center gap-2"
      >
        <div className="relative flex items-center flex-1">
          <Search
            className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="search-bar-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            autoComplete="off"
            className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-full bg-background
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-nu-green-600 focus:border-transparent
                       transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          aria-label="Cari"
          className="shrink-0 px-4 py-2 text-sm font-medium text-white bg-nu-green-700
                     rounded-full hover:bg-nu-green-800 focus:outline-none focus:ring-2
                     focus:ring-nu-green-600 focus:ring-offset-1 transition-colors duration-200"
        >
          Cari
        </button>
      </form>
    </div>
  )
}
