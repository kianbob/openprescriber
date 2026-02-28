// @ts-nocheck
'use client'
import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { fmtMoney, fmt, riskBadge } from '@/lib/utils'

type Provider = {
  npi: string; name: string; city: string; state: string
  specialty: string; claims: number; cost: number; riskLevel: string
}

type SortKey = 'name' | 'claims' | 'cost' | 'riskLevel'
type RiskFilter = 'all' | 'high' | 'elevated' | 'moderate' | 'low'

const RISK_ORDER: Record<string, number> = { high: 0, elevated: 1, moderate: 2, low: 3 }

export default function ProvidersClient({ providers }: { providers: Provider[] }) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('riskLevel')
  const [sortAsc, setSortAsc] = useState(true)
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all')
  const [showCount, setShowCount] = useState(50)

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setShowCount(50)
  }, [])

  const filtered = useMemo(() => {
    let list = providers

    if (riskFilter !== 'all') {
      list = list.filter(p => p.riskLevel === riskFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.npi.includes(q)
      )
    }

    const sorted = [...list].sort((a, b) => {
      let cmp = 0
      switch (sortBy) {
        case 'name': cmp = a.name.localeCompare(b.name); break
        case 'claims': cmp = a.claims - b.claims; break
        case 'cost': cmp = a.cost - b.cost; break
        case 'riskLevel': cmp = (RISK_ORDER[a.riskLevel] ?? 4) - (RISK_ORDER[b.riskLevel] ?? 4); break
      }
      return sortAsc ? cmp : -cmp
    })

    return sorted
  }, [providers, search, sortBy, sortAsc, riskFilter])

  const visible = filtered.slice(0, showCount)

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortBy(key)
      setSortAsc(key === 'name')
    }
    setShowCount(50)
  }

  const sortIcon = (key: SortKey) => {
    if (sortBy !== key) return ' ↕'
    return sortAsc ? ' ↑' : ' ↓'
  }

  const riskCounts = useMemo(() => ({
    all: providers.length,
    high: providers.filter(p => p.riskLevel === 'high').length,
    elevated: providers.filter(p => p.riskLevel === 'elevated').length,
    moderate: providers.filter(p => p.riskLevel === 'moderate').length,
    low: providers.filter(p => p.riskLevel === 'low').length,
  }), [providers])

  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by name, city, or NPI..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
        />
      </div>

      {/* Risk filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {([
          { key: 'all', label: 'All' },
          { key: 'high', label: '🔴 High' },
          { key: 'elevated', label: '🟠 Elevated' },
          { key: 'moderate', label: '🟡 Moderate' },
          { key: 'low', label: '🟢 Low' },
        ] as { key: RiskFilter; label: string }[]).map(tab => (
          <button
            key={tab.key}
            onClick={() => { setRiskFilter(tab.key); setShowCount(50) }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              riskFilter === tab.key
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label} ({fmt(riskCounts[tab.key])})
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-3">
        Showing {Math.min(showCount, filtered.length)} of {fmt(filtered.length)} providers{search && ` matching "${search}"`}.
      </p>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">
                <button onClick={() => handleSort('name')} className="hover:text-primary">Provider{sortIcon('name')}</button>
              </th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Specialty</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Location</th>
              <th className="px-4 py-3 text-right font-semibold">
                <button onClick={() => handleSort('claims')} className="hover:text-primary">Claims{sortIcon('claims')}</button>
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                <button onClick={() => handleSort('cost')} className="hover:text-primary">Drug Cost{sortIcon('cost')}</button>
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                <button onClick={() => handleSort('riskLevel')} className="hover:text-primary">Risk{sortIcon('riskLevel')}</button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.map(p => (
              <tr key={p.npi} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <Link href={`/providers/${p.npi}`} className="text-primary font-medium hover:underline">{p.name}</Link>
                </td>
                <td className="px-4 py-2 text-gray-600 hidden md:table-cell">{p.specialty}</td>
                <td className="px-4 py-2 text-gray-500 hidden md:table-cell">{p.city}, {p.state}</td>
                <td className="px-4 py-2 text-right font-mono">{fmt(p.claims)}</td>
                <td className="px-4 py-2 text-right font-mono">{fmtMoney(p.cost)}</td>
                <td className="px-4 py-2 text-center text-xs">{riskBadge(p.riskLevel)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visible.length === 0 && (
        <p className="text-center text-gray-500 py-8">No providers match your search.</p>
      )}

      {showCount < filtered.length && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowCount(c => c + 50)}
            className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-blue-900 transition-colors font-medium"
          >
            Show More ({fmt(filtered.length - showCount)} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
