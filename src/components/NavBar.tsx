'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/', label: 'Blog' },
  { href: '/videos', label: 'Videos' },
  { href: '/about', label: 'About' },
]

export function NavBar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between relative">
      <Link href="/" className="text-xl font-bold tracking-tight">
        Yet Another Blog
      </Link>

      {/* Desktop nav */}
      <div className="hidden sm:flex gap-6">
        {navLinks.map((link) => {
          const isActive =
            link.href === '/'
              ? pathname === '/' || pathname.startsWith('/blog')
              : pathname.startsWith(link.href)

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors py-1 ${
                isActive
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>

      {/* Mobile hamburger button */}
      <button
        className="sm:hidden flex flex-col justify-center items-center w-10 h-10 -mr-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        <span
          className={`block w-5 h-0.5 bg-gray-800 transition-transform duration-200 ${
            menuOpen ? 'rotate-45 translate-y-[3px]' : ''
          }`}
        />
        <span
          className={`block w-5 h-0.5 bg-gray-800 mt-1 transition-transform duration-200 ${
            menuOpen ? '-rotate-45 -translate-y-[3px]' : ''
          }`}
        />
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-sm sm:hidden z-50">
          <div className="flex flex-col px-4 py-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/' || pathname.startsWith('/blog')
                  : pathname.startsWith(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-3 text-sm font-medium border-b border-gray-100 last:border-b-0 ${
                    isActive ? 'text-black' : 'text-gray-500'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
