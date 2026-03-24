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

const themeScript = `
(function() {
  var theme = localStorage.getItem('theme');
  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
})();
`

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.className} bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors`}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-gray-200 dark:border-gray-800">
            <NavBar />
          </header>
          <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">{children}</main>
          <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Yet Another Blog
          </footer>
        </div>
      </body>
    </html>
  )
}
