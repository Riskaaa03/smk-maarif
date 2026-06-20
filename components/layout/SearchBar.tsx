'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  className?: string
  placeholder?: string
  onClose?: () => void
}

export default function SearchBar({
  className = '',
  placeholder = 'Cari informasi...',
  onClose,
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
      onClose?.()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose?.()
    }
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 ${className}`}
      data-testid="search-bar"
    >
      <label htmlFor="search-input" className="sr-only">
        Cari konten website
      </label>
      <div className="relative flex items-center w-full">
        {/* Search icon */}
        <svg
          className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none"
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
        <input
          ref={inputRef}
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-full
                     text-gray-800 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent
                     transition-all duration-200"
          autoComplete="off"
        />
      </div>
      <button
        type="submit"
        className="shrink-0 px-4 py-2 text-sm font-medium text-white bg-sage-600
                   rounded-full hover:bg-sage-700 focus:outline-none focus:ring-2
                   focus:ring-sage-500 focus:ring-offset-1 transition-colors duration-200"
        aria-label="Cari"
      >
        Cari
      </button>
    </form>
  )
}
