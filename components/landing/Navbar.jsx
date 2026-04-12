'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, ShoppingBag, Menu, X } from 'lucide-react'
import { navLinks } from '@/lib/config'

export default function Navbar({ cartCount = 0, onCartToggle, onSearch }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const searchRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus()
    }
  }, [searchOpen])

  const handleLinkClick = () => {
    setMobileOpen(false)
  }

  const toggleSearch = () => {
    if (searchOpen) {
      setSearchOpen(false)
      setSearchTerm('')
      onSearch?.('')
    } else {
      setSearchOpen(true)
    }
  }

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    onSearch?.(value)
    if (value.length > 0) {
      const el = document.getElementById('productos')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSearchClear = () => {
    setSearchTerm('')
    setSearchOpen(false)
    onSearch?.('')
  }

  return (
    <nav
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-6 py-3">
        {/* Logo */}
        <a href="#inicio" className="flex-shrink-0">
          <img src="/logo.jpeg" alt="Norte Sport" className="h-[44px] w-auto" />
        </a>

        {/* Center nav links */}
        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-medium text-sm text-primary hover:text-accent transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="flex items-center">
            {searchOpen && (
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 mr-1">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Buscar productos..."
                  className="bg-transparent text-sm text-primary outline-none w-[180px] placeholder:text-secondary/50"
                />
                {searchTerm && (
                  <button
                    onClick={handleSearchClear}
                    className="ml-1 text-secondary hover:text-primary"
                    aria-label="Limpiar búsqueda"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}
            <button
              onClick={toggleSearch}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                searchOpen ? 'text-accent' : 'text-primary'
              }`}
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>
          </div>

          <button
            onClick={onCartToggle}
            className="relative p-2 rounded-full hover:bg-gray-100 text-primary"
            aria-label="Carrito de compras"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-sale text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center justify-between px-4 py-3">
        {/* Hamburger left */}
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-full hover:bg-gray-100 text-primary"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>

        {/* Logo center */}
        <a href="#inicio">
          <img src="/logo.jpeg" alt="Norte Sport" className="h-[38px] w-auto" />
        </a>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleSearch}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
              searchOpen ? 'text-accent' : 'text-primary'
            }`}
            aria-label="Buscar"
          >
            <Search size={20} />
          </button>
          <button
            onClick={onCartToggle}
            className="relative p-2 rounded-full hover:bg-gray-100 text-primary"
            aria-label="Carrito de compras"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-sale text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2.5">
            <Search size={16} className="text-secondary/50 flex-shrink-0" />
            <input
              ref={!searchOpen ? undefined : searchRef}
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar productos..."
              className="bg-transparent text-sm text-primary outline-none flex-1 ml-2 placeholder:text-secondary/50"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={handleSearchClear}
                className="ml-1 text-secondary hover:text-primary"
                aria-label="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />

          {/* Menu panel */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md menu-slide-in">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-primary"
              aria-label="Cerrar menu"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center gap-6">
              {navLinks.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="text-xl font-medium text-primary hover:text-accent transition-colors duration-200"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
