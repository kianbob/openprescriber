// @ts-nocheck
'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { fmtMoney, fmt, riskBadge } from '@/lib/utils'

type Provider = { npi: string; name: string; city: string; state: string; specialty: string; claims: number; cost: number; riskLevel: string }

function SearchInner() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<Provider[]>([])
  const [all, setAll] = useState<Provider[]>([])

  useEffect(() => {
    fetch('/data/provider-index.json').then(r => r.json()).then(setAll)
  }, [])

  useEffect(() => {
    if (!query || query.length < 2 || all.length === 0) { setResults([]); return }
    const q = query.toLowerCase()
    setResults(all.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q) ||
      p.state?.toLowerCase() === q ||
      p.specialty?.toLowerCase().includes(q) ||
      p.npi.includes(q)
    ).slice(0, 100))
  }, [query, all])

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search by name, NPI, city, state, or specialty..."
        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />

      {results.length > 0 && (
        <div className="mt-4 bg-white rounded-xl shadow-sm overflow-hidden">
          <p className="px-4 py-2 text-sm text-gray-500 bg-gray-50">{results.length} result{results.length !== 1 ? 's' : ''}</p>
          <div className="divide-y divide-gray-100">
            {results.map(p => (
              <Link key={p.npi} href={`/providers/${p.npi}`} className="flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition-colors">
                <div>
                  <p className="font-medium text-primary">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.specialty} · {p.city}, {p.state}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-mono">{fmt(p.claims)} claims</p>
                  <p>{riskBadge(p.riskLevel)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {query.length >= 2 && results.length === 0 && all.length > 0 && (
        <p className="mt-4 text-gray-500 text-center py-8">No providers found for &ldquo;{query}&rdquo;</p>
      )}
    </div>
  )
}

export default function SearchClient() {
  return <Suspense fallback={<div className="h-12 bg-gray-100 rounded-xl animate-pulse" />}><SearchInner /></Suspense>
}
