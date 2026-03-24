import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { NavBar } from '@/components/NavBar'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Yet Another Blog',
    template: '%s | Yet Another Blog',
  },
  description: 'A personal blog about thoughts, videos, and more.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-gray-200">
            <NavBar />
          </header>
          <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">{children}</main>
          <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Yet Another Blog
          </footer>
        </div>
      </body>
    </html>
  )
}
