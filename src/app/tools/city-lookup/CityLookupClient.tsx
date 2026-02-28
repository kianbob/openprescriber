'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { fmtMoney, fmt, riskBadge, slugify } from '@/lib/utils'

type Provider = { npi: string; name: string; city: string; state: string; specialty: string; claims: number; cost: number; riskLevel: string }

type SortKey = 'name' | 'specialty' | 'claims' | 'cost' | 'riskLevel'

export default function CityLookupClient({ cities }: { cities: string[] }) {
  const [query, setQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('cost')
  const [sortAsc, setSortAsc] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestions = useMemo(() => {
    if (query.length < 2) return []
    const q = query.toLowerCase()
    return cities.filter(c => c.toLowerCase().includes(q)).slice(0, 10)
  }, [query, cities])

  async function search(city: string) {
    setSelectedCity(city)
    setQuery(city)
    setShowSuggestions(false)
    setLoading(true)
    try {
      const res = await fetch('/data/provider-index.json')
      const all: Provider[] = await res.json()
      setProviders(all.filter(p => p.city.toLowerCase() === city.split(',')[0].trim().toLowerCase()))
    } catch { setProviders([]) }
    setLoading(false)
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(key === 'name' || key === 'specialty') }
  }

  const grouped = useMemo(() => {
    const sorted = [...providers].sort((a, b) => {
      const m = sortAsc ? 1 : -1
      if (sortKey === 'name') return m * a.name.localeCompare(b.name)
      if (sortKey === 'specialty') return m * a.specialty.localeCompare(b.specialty)
      if (sortKey === 'riskLevel') { const order: Record<string, number> = { high: 3, elevated: 2, moderate: 1, low: 0 }; return m * ((order[a.riskLevel] || 0) - (order[b.riskLevel] || 0)) }
      return m * ((a[sortKey] as number) - (b[sortKey] as number))
    })
    const groups: Record<string, Provider[]> = {}
    for (const p of sorted) {
      if (!groups[p.state]) groups[p.state] = []
      groups[p.state].push(p)
    }
    return groups
  }, [providers, sortKey, sortAsc])

  const stateKeys = Object.keys(grouped).sort()
  const arrow = (key: SortKey) => sortKey === key ? (sortAsc ? ' ↑' : ' ↓') : ''

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.parentElement?.contains(e.target as Node)) setShowSuggestions(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className="mt-6">
      <div className="relative max-w-lg">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setShowSuggestions(true) }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Type a city name (e.g. Houston, Miami, Phoenix)..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
            {suggestions.map(c => (
              <li key={c}>
                <button onClick={() => search(c)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm">
                  {c}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && <p className="mt-6 text-gray-500">Loading providers...</p>}

      {!loading && selectedCity && providers.length === 0 && (
        <p className="mt-6 text-gray-500">No providers found in &quot;{selectedCity}&quot;.</p>
      )}

      {!loading && providers.length > 0 && (
        <div className="mt-6">
          <p className="text-lg font-semibold mb-4">
            {fmt(providers.length)} provider{providers.length !== 1 ? 's' : ''} in {selectedCity}
          </p>

          {stateKeys.map(st => (
            <div key={st} className="mb-6">
              {stateKeys.length > 1 && (
                <h3 className="text-md font-bold text-gray-700 mb-2">{st}</h3>
              )}
              <div className="bg-white rounded-xl shadow-sm overflow-x-auto border">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold cursor-pointer hover:text-primary" onClick={() => toggleSort('name')}>Provider{arrow('name')}</th>
                      <th className="px-4 py-3 text-left font-semibold hidden md:table-cell cursor-pointer hover:text-primary" onClick={() => toggleSort('specialty')}>Specialty{arrow('specialty')}</th>
                      <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-primary" onClick={() => toggleSort('claims')}>Claims{arrow('claims')}</th>
                      <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-primary" onClick={() => toggleSort('cost')}>Drug Cost{arrow('cost')}</th>
                      <th className="px-4 py-3 text-center font-semibold cursor-pointer hover:text-primary" onClick={() => toggleSort('riskLevel')}>Risk{arrow('riskLevel')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {grouped[st].map(p => (
                      <tr key={p.npi} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <Link href={`/providers/${p.npi}`} className="text-primary font-medium hover:underline">{p.name}</Link>
                        </td>
                        <td className="px-4 py-2 text-gray-600 hidden md:table-cell">{p.specialty}</td>
                        <td className="px-4 py-2 text-right font-mono">{fmt(p.claims)}</td>
                        <td className="px-4 py-2 text-right font-mono">{fmtMoney(p.cost)}</td>
                        <td className="px-4 py-2 text-center text-xs">{riskBadge(p.riskLevel)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
