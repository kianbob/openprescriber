'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { fmtMoney, fmt } from '@/lib/utils'

type Drug = { generic: string; brand: string; claims: number; cost: number; benes: number; providers: number; costPerClaim: number }
type SortKey = 'brand' | 'generic' | 'cost' | 'claims' | 'benes' | 'costPerClaim'

export default function DrugCostsClient({ drugs }: { drugs: Drug[] }) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('cost')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [showCount, setShowCount] = useState(25)

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
        case 'brand': av = a.brand || ''; bv = b.brand || ''; break
        case 'generic': av = a.generic; bv = b.generic; break
        case 'cost': av = a.cost; bv = b.cost; break
        case 'claims': av = a.claims; bv = b.claims; break
        case 'benes': av = a.benes; bv = b.benes; break
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
          placeholder="🔍 Search by drug or brand name..."
          value={search}
          onChange={e => { setSearch(e.target.value); setShowCount(25) }}
          className="rounded-lg border border-gray-200 px-4 py-2 w-full md:w-80"
        />
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('brand')}>Drug{arrow('brand')}</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('generic')}>Generic Name{arrow('generic')}</th>
              <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('cost')}>Total Cost{arrow('cost')}</th>
              <th className="px-4 py-3 text-right font-semibold hidden md:table-cell cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('claims')}>Claims{arrow('claims')}</th>
              <th className="px-4 py-3 text-right font-semibold hidden md:table-cell cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('benes')}>Patients{arrow('benes')}</th>
              <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('costPerClaim')}>Cost/Claim{arrow('costPerClaim')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.map((d, i) => (
              <tr key={d.brand + i} className={`hover:bg-gray-50 ${i < 5 && !search ? 'bg-blue-50/30' : ''}`}>
                <td className="px-4 py-2 font-mono text-gray-500">{i + 1}</td>
                <td className="px-4 py-2">
                  <Link href={`/drugs/${(d.brand || d.generic).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`} className="font-semibold text-primary hover:underline">{d.brand || d.generic}</Link>
                </td>
                <td className="px-4 py-2 text-gray-600 hidden md:table-cell">{d.generic}</td>
                <td className="px-4 py-2 text-right font-mono font-bold">{fmtMoney(d.cost)}</td>
                <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(d.claims)}</td>
                <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(d.benes)}</td>
                <td className="px-4 py-2 text-right font-mono">${d.costPerClaim.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500 mt-2">Showing {visible.length} of {filtered.length} drugs</p>
      {showCount < filtered.length && (
        <button onClick={() => setShowCount(c => c + 25)} className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-[#1e40af] font-medium rounded-lg border mt-3">
          Show More ({filtered.length - showCount} remaining)
        </button>
      )}
    </>
  )
}
