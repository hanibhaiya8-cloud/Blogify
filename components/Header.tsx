'use client'

import { Sparkles, LogOut, Shield, Search, X, Menu } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface HeaderProps {
  isAdmin: boolean
  onAdminClick: () => void
  onLogout: () => void
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function Header({ isAdmin, onAdminClick, onLogout, searchTerm, onSearchChange }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close search/menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && 
          !(event.target as HTMLElement).closest('button[aria-label="Menu"]')) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSearchOpen, searchTerm])
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-1.5 rounded-lg shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Blogify
              </h1>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2 text-gray-600 hover:text-purple-600"
              aria-label="Menu"
              aria-expanded={isMenuOpen}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex items-center gap-6">
              <Link href="/gallery" className="text-gray-700 hover:text-purple-600 font-medium">
                Gallery
              </Link>
              <Link href="/profiles" className="text-gray-700 hover:text-purple-600 font-medium">
                Profiles
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-purple-600 font-medium">
                Contact
              </Link>
            </nav>

            <div className="hidden sm:flex items-center gap-2 ml-4">
              <button
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen)
                  if (!isSearchOpen && inputRef.current) {
                    setTimeout(() => inputRef.current?.focus(), 100)
                  }
                }}
                className="p-2 text-gray-600 hover:text-purple-600"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {!isAdmin ? (
                <button
                  onClick={onAdminClick}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg transition-all"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              ) : (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          ref={menuRef}
          className={`sm:hidden mt-4 space-y-3 overflow-hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-96 py-2' : 'max-h-0 py-0'
          }`}
        >
          <Link 
            href="/gallery" 
            className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Gallery
          </Link>
          <Link 
            href="/profiles" 
            className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Profiles
          </Link>
          <Link 
            href="/contact" 
            className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          
          <div className="pt-2 border-t border-gray-200 mt-2">
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen)
                setIsMenuOpen(false)
                if (!isSearchOpen && inputRef.current) {
                  setTimeout(() => inputRef.current?.focus(), 100)
                }
              }}
              className="w-full flex items-center justify-between py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <span>Search</span>
              <Search className="w-4 h-4" />
            </button>

            {!isAdmin ? (
              <button
                onClick={() => {
                  onAdminClick()
                  setIsMenuOpen(false)
                }}
                className="w-full flex items-center justify-between py-2 px-4 mt-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <span>Admin Login</span>
                <Shield className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onLogout()
                  setIsMenuOpen(false)
                }}
                className="w-full flex items-center justify-between py-2 px-4 mt-2 text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span>Logout</span>
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div 
        ref={searchRef}
        className={`bg-white/80 backdrop-blur-md border-t border-gray-100 transition-all duration-300 ${
          isSearchOpen ? 'max-h-32 py-4' : 'max-h-0 py-0 border-t-0'
        }`}
      >
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search profiles by name, location, or description..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 pl-12 pr-10 text-gray-700 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-2.5 w-5 h-5 text-gray-400" />
            <button
              onClick={() => {
                setIsSearchOpen(false)
                onSearchChange('')
              }}
              className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
