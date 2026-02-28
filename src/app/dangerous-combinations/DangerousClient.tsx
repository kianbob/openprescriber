'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { fmtMoney, fmt } from '@/lib/utils'

type Combo = { npi: string; name: string; city: string; state: string; specialty: string; claims: number; cost: number; opioidRate: number; riskLevel: string; anomalyScore: number }
type SortKey = 'name' | 'opioidRate' | 'claims' | 'cost' | 'anomalyScore'

export default function DangerousClient({ combos }: { combos: Combo[] }) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('anomalyScore')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [filter, setFilter] = useState('')
  const [showCount, setShowCount] = useState(50)

  const toggle = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }
  const arrow = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''

  const riskLevels = useMemo(() => Array.from(new Set(combos.map(c => c.riskLevel))).sort(), [combos])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    let list = combos.filter(c => {
      if (filter && c.riskLevel !== filter) return false
      return c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.state.toLowerCase().includes(q) || c.specialty.toLowerCase().includes(q)
    })
    list.sort((a, b) => {
      let av: number | string, bv: number | string
      switch (sortKey) {
        case 'name': av = a.name; bv = b.name; break
        case 'opioidRate': av = a.opioidRate; bv = b.opioidRate; break
        case 'claims': av = a.claims; bv = b.claims; break
        case 'cost': av = a.cost; bv = b.cost; break
        case 'anomalyScore': av = a.anomalyScore; bv = b.anomalyScore; break
        default: av = a.anomalyScore; bv = b.anomalyScore
      }
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av)
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
    return list
  }, [combos, search, sortKey, sortDir, filter])

  const visible = filtered.slice(0, showCount)

  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input type="text" placeholder="🔍 Search by name, location, or specialty..." value={search}
          onChange={e => { setSearch(e.target.value); setShowCount(50) }}
          className="rounded-lg border border-gray-200 px-4 py-2 w-full md:w-80" />
        <div className="flex gap-2">
          <button onClick={() => { setFilter(''); setShowCount(50) }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${!filter ? 'bg-[#1e40af] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All</button>
          {riskLevels.map(r => (
            <button key={r} onClick={() => { setFilter(r); setShowCount(50) }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${filter === r ? 'bg-[#1e40af] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{r}</button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm bg-white rounded-xl shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('name')}>Provider{arrow('name')}</th>
              <th className="px-3 py-2 text-left font-semibold">Specialty</th>
              <th className="px-3 py-2 text-left font-semibold">Location</th>
              <th className="px-3 py-2 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('opioidRate')}>Opioid Rate{arrow('opioidRate')}</th>
              <th className="px-3 py-2 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('claims')}>Claims{arrow('claims')}</th>
              <th className="px-3 py-2 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('cost')}>Cost{arrow('cost')}</th>
              <th className="px-3 py-2 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('anomalyScore')}>Score{arrow('anomalyScore')}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {visible.map(p => (
              <tr key={p.npi} className="hover:bg-gray-50">
                <td className="px-3 py-2">
                  <Link href={`/providers/${p.npi}`} className="text-primary hover:underline font-medium">{p.name}</Link>
                </td>
                <td className="px-3 py-2 text-xs text-gray-500">{p.specialty}</td>
                <td className="px-3 py-2 text-xs text-gray-500">{p.city}, {p.state}</td>
                <td className="px-3 py-2 text-right font-mono text-red-600 font-semibold">{p.opioidRate.toFixed(1)}%</td>
                <td className="px-3 py-2 text-right font-mono">{fmt(p.claims)}</td>
                <td className="px-3 py-2 text-right font-mono">{fmtMoney(p.cost)}</td>
                <td className="px-3 py-2 text-right font-mono font-bold">{p.anomalyScore.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500 mt-2">Showing {visible.length} of {filtered.length} co-prescribers</p>
      {showCount < filtered.length && (
        <button onClick={() => setShowCount(c => c + 50)} className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-[#1e40af] font-medium rounded-lg border mt-3">
          Show More ({filtered.length - showCount} remaining)
        </button>
      )}
    </>
  )
}
