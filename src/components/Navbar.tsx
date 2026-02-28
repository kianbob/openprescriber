'use client'
import Link from 'next/link'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  {
    label: 'Explore',
    items: [
      { label: 'States', href: '/states' },
      { label: 'Specialties', href: '/specialties' },
      { label: 'Top Drugs', href: '/drugs' },
      { label: 'Providers', href: '/providers' },
      { label: 'Downloads', href: '/downloads' },
    ],
  },
  {
    label: 'Risk Analysis',
    items: [
      { label: 'Flagged Providers', href: '/flagged' },
      { label: 'Opioid Prescribing', href: '/opioids' },
      { label: 'Brand vs Generic', href: '/brand-vs-generic' },
      { label: 'Excluded Providers', href: '/excluded' },
    ],
  },
  {
    label: 'Analysis',
    items: [
      { label: 'All Analysis', href: '/analysis' },
      { label: 'Opioid Crisis', href: '/analysis/opioid-crisis' },
      { label: 'Cost Outliers', href: '/analysis/cost-outliers' },
    ],
  },
  { label: 'About', href: '/about' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="text-xl font-bold text-primary font-[family-name:var(--font-heading)]">
          OpenPrescriber
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navItems.map(item => (
            'items' in item && item.items ? (
              <div key={item.label} className="relative"
                onMouseEnter={() => setDropdown(item.label)}
                onMouseLeave={() => setDropdown(null)}>
                <button className="px-3 py-2 text-sm text-gray-700 hover:text-primary rounded-lg hover:bg-gray-50 flex items-center gap-1">
                  {item.label} <span className="text-xs">▾</span>
                </button>
                {dropdown === item.label && (
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg border border-gray-100 py-1 min-w-[200px]">
                    {item.items!.map(sub => (
                      <Link key={sub.href} href={sub.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary">
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.href} href={item.href!} className="px-3 py-2 text-sm text-gray-700 hover:text-primary rounded-lg hover:bg-gray-50">
                {item.label}
              </Link>
            )
          ))}
          <Link href="/search" className="ml-2 px-3 py-1.5 text-sm text-gray-400 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 w-48">
            🔍 Search prescribers…
          </Link>
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>☰</button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t px-4 py-3 space-y-2">
          {navItems.map(item =>
            'items' in item && item.items ? item.items.map(sub => (
              <Link key={sub.href} href={sub.href} className="block py-1 text-sm text-gray-700">{sub.label}</Link>
            )) : (
              <Link key={item.href} href={item.href!} className="block py-1 text-sm text-gray-700">{item.label}</Link>
            )
          )}
        </div>
      )}
    </nav>
  )
}
