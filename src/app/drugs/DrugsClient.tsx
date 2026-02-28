'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { fmtMoney, fmt, slugify } from '@/lib/utils'

type Drug = { generic: string; brand: string; claims: number; cost: number; benes: number; providers: number; costPerClaim: number }
type SortKey = 'name' | 'cost' | 'claims' | 'providers' | 'costPerClaim'

export default function DrugsClient({ drugs }: { drugs: Drug[] }) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('cost')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [showCount, setShowCount] = useState(50)

  const toggle = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }
  const arrow = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    let list = drugs.filter(d => d.generic.toLowerCase().includes(q) || (d.brand && d.brand.toLowerCase().includes(q)))
    list.sort((a, b) => {
      let av: number | string, bv: number | string
      switch (sortKey) {
        case 'name': av = a.generic; bv = b.generic; break
        case 'cost': av = a.cost; bv = b.cost; break
        case 'claims': av = a.claims; bv = b.claims; break
        case 'providers': av = a.providers; bv = b.providers; break
        case 'costPerClaim': av = a.costPerClaim; bv = b.costPerClaim; break
        default: av = a.cost; bv = b.cost
      }
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av)
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
    return list
  }, [drugs, search, sortKey, sortDir])

  const visible = filtered.slice(0, showCount)

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search by generic or brand name..."
          value={search}
          onChange={e => { setSearch(e.target.value); setShowCount(50) }}
          className="rounded-lg border border-gray-200 px-4 py-2 w-full md:w-80"
        />
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('name')}>Drug (Generic){arrow('name')}</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Brand</th>
              <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('cost')}>Total Cost{arrow('cost')}</th>
              <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('claims')}>Claims{arrow('claims')}</th>
              <th className="px-4 py-3 text-right font-semibold hidden md:table-cell cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('costPerClaim')}>Cost/Claim{arrow('costPerClaim')}</th>
              <th className="px-4 py-3 text-right font-semibold hidden lg:table-cell cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('providers')}>Providers{arrow('providers')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.map((d, i) => (
              <tr key={d.generic + i} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                <td className="px-4 py-2 font-medium"><Link href={`/drugs/${slugify(d.generic)}`} className="text-primary hover:underline">{d.generic}</Link></td>
                <td className="px-4 py-2 text-gray-500 hidden md:table-cell">{d.brand || '—'}</td>
                <td className="px-4 py-2 text-right font-mono font-semibold">{fmtMoney(d.cost)}</td>
                <td className="px-4 py-2 text-right font-mono">{fmt(d.claims)}</td>
                <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmtMoney(d.costPerClaim)}</td>
                <td className="px-4 py-2 text-right font-mono hidden lg:table-cell">{fmt(d.providers)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500 mt-2">Showing {visible.length} of {filtered.length} drugs</p>
      {showCount < filtered.length && (
        <button onClick={() => setShowCount(c => c + 50)} className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-[#1e40af] font-medium rounded-lg border mt-3">
          Show More ({filtered.length - showCount} remaining)
        </button>
      )}
    </>
  )
}
