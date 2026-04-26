'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar } from '@/components/atoms/Avatar'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Marketplaces', href: '/marketplaces' },
  { label: 'Products', href: '/products' },
  { label: 'Profile', href: '/profile' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-soft">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">MarketHub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                pathname === item.href
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/profile" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <Avatar fallback="Alex Johnson" size="sm" />
          <span className="hidden sm:block text-sm font-medium text-slate-700">Alex</span>
        </Link>
      </div>
    </header>
  )
}
