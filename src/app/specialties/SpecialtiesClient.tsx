'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { fmtMoney, fmt, slugify } from '@/lib/utils'

type Spec = { specialty: string; providers: number; claims: number; cost: number; opioidProv: number; avgOpioidRate: number; avgBrandPct: number; costPerProvider: number }
type SortKey = 'name' | 'providers' | 'claims' | 'cost' | 'avgOpioidRate' | 'avgBrandPct' | 'costPerProvider'

export default function SpecialtiesClient({ specs }: { specs: Spec[] }) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('providers')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [showCount, setShowCount] = useState(50)

  const toggle = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }
  const arrow = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    let list = specs.filter(s => s.specialty.toLowerCase().includes(q))
    list.sort((a, b) => {
      let av: number | string, bv: number | string
      switch (sortKey) {
        case 'name': av = a.specialty; bv = b.specialty; break
        case 'providers': av = a.providers; bv = b.providers; break
        case 'claims': av = a.claims; bv = b.claims; break
        case 'cost': av = a.cost; bv = b.cost; break
        case 'avgOpioidRate': av = a.avgOpioidRate; bv = b.avgOpioidRate; break
        case 'avgBrandPct': av = a.avgBrandPct; bv = b.avgBrandPct; break
        case 'costPerProvider': av = a.costPerProvider; bv = b.costPerProvider; break
        default: av = a.providers; bv = b.providers
      }
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av)
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
    return list
  }, [specs, search, sortKey, sortDir])

  const visible = filtered.slice(0, showCount)

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search specialties..."
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
              <th className="px-4 py-3 text-left font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('name')}>Specialty{arrow('name')}</th>
              <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('providers')}>Prescribers{arrow('providers')}</th>
              <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('cost')}>Drug Cost{arrow('cost')}</th>
              <th className="px-4 py-3 text-right font-semibold hidden md:table-cell cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('claims')}>Claims{arrow('claims')}</th>
              <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('avgOpioidRate')}>Avg Opioid Rate{arrow('avgOpioidRate')}</th>
              <th className="px-4 py-3 text-right font-semibold hidden md:table-cell cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('avgBrandPct')}>Avg Brand %{arrow('avgBrandPct')}</th>
              <th className="px-4 py-3 text-right font-semibold hidden lg:table-cell cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('costPerProvider')}>Cost/Provider{arrow('costPerProvider')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.map((s, i) => (
              <tr key={s.specialty} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                <td className="px-4 py-2"><Link href={`/specialties/${slugify(s.specialty)}`} className="font-medium text-primary hover:underline">{s.specialty}</Link></td>
                <td className="px-4 py-2 text-right font-mono">{fmt(s.providers)}</td>
                <td className="px-4 py-2 text-right font-mono">{fmtMoney(s.cost)}</td>
                <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(s.claims)}</td>
                <td className={`px-4 py-2 text-right font-mono font-semibold ${s.avgOpioidRate > 10 ? 'text-red-600' : ''}`}>{s.avgOpioidRate.toFixed(1)}%</td>
                <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{s.avgBrandPct.toFixed(1)}%</td>
                <td className="px-4 py-2 text-right font-mono hidden lg:table-cell">{fmtMoney(s.costPerProvider)}</td>
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
