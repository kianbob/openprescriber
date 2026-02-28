'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { fmtMoney, fmt, slugify } from '@/lib/utils'

type SpecEntry = { name: string; n: number; opioidMean: number; costMean: number; brandMean: number; opioidP95: number }
type SortKey = 'name' | 'n' | 'opioidMean' | 'costMean' | 'brandMean' | 'opioidP95'

export default function PeerComparisonClient({ specialties }: { specialties: SpecEntry[] }) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('n')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [showCount, setShowCount] = useState(50)

  const toggle = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }
  const arrow = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    let list = specialties.filter(s => s.name.toLowerCase().includes(q))
    list.sort((a, b) => {
      let av: number | string, bv: number | string
      switch (sortKey) {
        case 'name': av = a.name; bv = b.name; break
        case 'n': av = a.n; bv = b.n; break
        case 'opioidMean': av = a.opioidMean; bv = b.opioidMean; break
        case 'costMean': av = a.costMean; bv = b.costMean; break
        case 'brandMean': av = a.brandMean; bv = b.brandMean; break
        case 'opioidP95': av = a.opioidP95; bv = b.opioidP95; break
        default: av = a.n; bv = b.n
      }
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av)
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
    return list
  }, [specialties, search, sortKey, sortDir])

  const visible = filtered.slice(0, showCount)

  return (
    <>
      <div className="mb-4">
        <input type="text" placeholder="🔍 Search specialties..." value={search}
          onChange={e => { setSearch(e.target.value); setShowCount(50) }}
          className="rounded-lg border border-gray-200 px-4 py-2 w-full md:w-80" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm bg-white rounded-xl shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('name')}>Specialty{arrow('name')}</th>
              <th className="px-3 py-2 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('n')}>Providers{arrow('n')}</th>
              <th className="px-3 py-2 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('opioidMean')}>Avg Opioid %{arrow('opioidMean')}</th>
              <th className="px-3 py-2 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('costMean')}>Avg Cost/Bene{arrow('costMean')}</th>
              <th className="px-3 py-2 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('brandMean')}>Avg Brand %{arrow('brandMean')}</th>
              <th className="px-3 py-2 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('opioidP95')}>P95 Opioid{arrow('opioidP95')}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {visible.map(s => (
              <tr key={s.name} className="hover:bg-gray-50">
                <td className="px-3 py-2">
                  <Link href={`/specialties/${slugify(s.name)}`} className="text-primary hover:underline font-medium text-xs">{s.name}</Link>
                </td>
                <td className="px-3 py-2 text-right font-mono">{fmt(s.n)}</td>
                <td className="px-3 py-2 text-right font-mono">{s.opioidMean.toFixed(1)}%</td>
                <td className="px-3 py-2 text-right font-mono">{fmtMoney(s.costMean)}</td>
                <td className="px-3 py-2 text-right font-mono">{s.brandMean.toFixed(1)}%</td>
                <td className="px-3 py-2 text-right font-mono text-red-600">{s.opioidP95.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500 mt-2">Showing {visible.length} of {filtered.length} specialties</p>
      {showCount < filtered.length && (
        <button onClick={() => setShowCount(c => c + 50)} className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-[#1e40af] font-medium rounded-lg border mt-3">
          Show More ({filtered.length - showCount} remaining)
        </button>
      )}
    </>
  )
}
