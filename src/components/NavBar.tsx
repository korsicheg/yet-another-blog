'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Blog' },
  { href: '/videos', label: 'Videos' },
  { href: '/about', label: 'About' },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold tracking-tight">
        Yet Another Blog
      </Link>
      <div className="flex gap-6">
        {navLinks.map((link) => {
          const isActive =
            link.href === '/'
              ? pathname === '/' || pathname.startsWith('/blog')
              : pathname.startsWith(link.href)

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                isActive
                  ? 'text-black border-b-2 border-black pb-0.5'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
