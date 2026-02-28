'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { fmtMoney, fmt } from '@/lib/utils'

type Excluded = { npi: string; name: string; credentials: string; city: string; state: string; specialty: string; claims: number; cost: number; opioidRate: number; riskScore: number; riskFlags: string[]; isExcluded: boolean }
type SortKey = 'name' | 'claims' | 'cost' | 'riskScore'

export default function ExcludedClient({ excluded }: { excluded: Excluded[] }) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('riskScore')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [showCount, setShowCount] = useState(25)

  const toggle = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    let list = excluded.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q) ||
      p.specialty.toLowerCase().includes(q)
    )
    list.sort((a, b) => {
      let av: number | string, bv: number | string
      switch (sortKey) {
        case 'name': av = a.name; bv = b.name; break
        case 'claims': av = a.claims; bv = b.claims; break
        case 'cost': av = a.cost; bv = b.cost; break
        case 'riskScore': av = a.riskScore; bv = b.riskScore; break
        default: av = a.riskScore; bv = b.riskScore
      }
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av)
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
    return list
  }, [excluded, search, sortKey, sortDir])

  const visible = filtered.slice(0, showCount)

  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="🔍 Search by name, city, state, or specialty..."
          value={search}
          onChange={e => { setSearch(e.target.value); setShowCount(25) }}
          className="rounded-lg border border-gray-200 px-4 py-2 w-full md:w-96"
        />
        <div className="flex gap-2 flex-wrap">
          {(['riskScore', 'cost', 'claims', 'name'] as SortKey[]).map(key => (
            <button key={key} onClick={() => toggle(key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${sortKey === key ? 'bg-[#1e40af] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {key === 'riskScore' ? 'Risk Score' : key === 'cost' ? 'Cost' : key === 'claims' ? 'Claims' : 'Name'}
              {sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-4">Showing {visible.length} of {filtered.length} providers</p>
      <div className="space-y-4">
        {visible.map(p => (
          <div key={p.npi} className="bg-white rounded-xl shadow-sm border border-red-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/providers/${p.npi}`} className="text-lg font-bold text-primary hover:underline">{p.name}</Link>
                  {p.credentials && <span className="text-sm text-gray-400">{p.credentials}</span>}
                  <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-medium">EXCLUDED</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{p.specialty} · {p.city}, {p.state}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span><strong>{fmt(p.claims)}</strong> claims</span>
                  <span><strong>{fmtMoney(p.cost)}</strong> drug cost</span>
                  {p.opioidRate > 0 && <span className="text-red-600"><strong>{p.opioidRate.toFixed(1)}%</strong> opioid rate</span>}
                </div>
              </div>
              <div className="flex-shrink-0 w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-red-700">{p.riskScore}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showCount < filtered.length && (
        <button onClick={() => setShowCount(c => c + 25)} className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-[#1e40af] font-medium rounded-lg border mt-4">
          Show More ({filtered.length - showCount} remaining)
        </button>
      )}
      {filtered.length === 0 && (
        <p className="mt-8 text-center text-gray-500 py-12">No providers match your search.</p>
      )}
    </>
  )
}
