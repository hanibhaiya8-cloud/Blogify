'use client'

import { Sparkles, LogOut, Shield, Search, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface HeaderProps {
  isAdmin: boolean
  onAdminClick: () => void
  onLogout: () => void
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function Header({ isAdmin, onAdminClick, onLogout, searchTerm, onSearchChange }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close search when clicking outside or scrolling with empty search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    function handleScroll() {
      if (isSearchOpen && !searchTerm) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isSearchOpen, searchTerm])
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm">
      {/* Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Blogify
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen)
                if (!isSearchOpen && inputRef.current) {
                  setTimeout(() => inputRef.current?.focus(), 100)
                }
              }}
              className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            {!isAdmin ? (
              <button
                onClick={onAdminClick}
                className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all text-sm sm:text-base"
              >
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Admin</span>
              </button>
            ) : (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all text-sm sm:text-base"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div 
        ref={searchRef}
        className={`sticky top-0 z-30 bg-white/80 backdrop-blur-md border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
          isSearchOpen ? 'max-h-32 py-3' : 'max-h-0 py-0 border-t-0 -translate-y-full'
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search profiles by name, location, or description..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full px-4 py-2 pl-12 pr-10 text-gray-700 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-all duration-200"
            />
            <div className="absolute left-4 top-2.5 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            {isSearchOpen && (
              <button
                onClick={() => {
                  setIsSearchOpen(false)
                  onSearchChange('')
                }}
                className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
