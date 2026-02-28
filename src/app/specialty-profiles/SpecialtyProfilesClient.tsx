'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { fmtMoney, fmt, slugify } from '@/lib/utils'

type Profile = {
  specialty: string
  providers: number
  opioidMean: number
  opioidP90: number
  opioidP95: number
  costMean: number
  costP90: number
  brandMean: number
  n: number
}

type Category = 'opioid' | 'cost' | 'brand'
type SortKey = 'specialty' | 'value' | 'p90' | 'providers'

export default function SpecialtyProfilesClient({ opioid, cost, brand }: { opioid: Profile[]; cost: Profile[]; brand: Profile[] }) {
  const [tab, setTab] = useState<Category>('opioid')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('value')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [showCount, setShowCount] = useState(50)

  const toggle = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }
  const arrow = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''

  const data = tab === 'opioid' ? opioid : tab === 'cost' ? cost : brand

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    let list = data.filter(s => s.specialty.toLowerCase().includes(q))
    list.sort((a, b) => {
      let av: number | string, bv: number | string
      switch (sortKey) {
        case 'specialty': av = a.specialty; bv = b.specialty; break
        case 'value':
          if (tab === 'opioid') { av = a.opioidMean; bv = b.opioidMean }
          else if (tab === 'cost') { av = a.costMean; bv = b.costMean }
          else { av = a.brandMean; bv = b.brandMean }
          break
        case 'p90':
          if (tab === 'opioid') { av = a.opioidP90; bv = b.opioidP90 }
          else { av = a.costP90; bv = b.costP90 }
          break
        case 'providers': av = a.n; bv = b.n; break
        default: av = a.opioidMean; bv = b.opioidMean
      }
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av)
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
    return list
  }, [data, search, sortKey, sortDir, tab])

  const visible = filtered.slice(0, showCount)

  return (
    <>
      <div className="flex gap-2 mb-4 flex-wrap">
        {([['opioid', 'Opioid Rate'], ['cost', 'Cost/Patient'], ['brand', 'Brand %']] as [Category, string][]).map(([key, label]) => (
          <button key={key} onClick={() => { setTab(key); setShowCount(50); setSortKey('value'); setSortDir('desc') }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${tab === key ? 'bg-[#1e40af] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{label}</button>
        ))}
      </div>
      <div className="mb-4">
        <input type="text" placeholder="🔍 Search specialties..." value={search}
          onChange={e => { setSearch(e.target.value); setShowCount(50) }}
          className="rounded-lg border border-gray-200 px-4 py-2 w-full md:w-80" />
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className={tab === 'opioid' ? 'bg-red-50' : 'bg-gray-50'}>
            <tr>
              <th className="px-4 py-3 text-left font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('specialty')}>Specialty{arrow('specialty')}</th>
              <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('value')}>
                {tab === 'opioid' ? 'Avg Opioid Rate' : tab === 'cost' ? 'Avg Cost/Patient' : 'Avg Brand %'}{arrow('value')}
              </th>
              {tab !== 'brand' && (
                <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('p90')}>90th %ile{arrow('p90')}</th>
              )}
              {tab === 'opioid' && (
                <th className="px-4 py-3 text-right font-semibold">95th %ile</th>
              )}
              {tab === 'cost' && (
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Avg Brand %</th>
              )}
              {tab === 'brand' && (
                <th className="px-4 py-3 text-right font-semibold">Avg Cost/Patient</th>
              )}
              <th className="px-4 py-3 text-right font-semibold hidden md:table-cell cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('providers')}>Providers{arrow('providers')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.map(s => (
              <tr key={s.specialty} className="hover:bg-gray-50">
                <td className="px-4 py-2"><Link href={`/specialties/${slugify(s.specialty)}`} className="text-primary font-medium hover:underline">{s.specialty}</Link></td>
                {tab === 'opioid' && <>
                  <td className="px-4 py-2 text-right font-mono text-red-600 font-semibold">{s.opioidMean.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right font-mono">{s.opioidP90.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right font-mono">{s.opioidP95.toFixed(1)}%</td>
                </>}
                {tab === 'cost' && <>
                  <td className="px-4 py-2 text-right font-mono font-semibold">{fmtMoney(Math.round(s.costMean))}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmtMoney(Math.round(s.costP90))}</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{s.brandMean.toFixed(1)}%</td>
                </>}
                {tab === 'brand' && <>
                  <td className="px-4 py-2 text-right font-mono font-semibold">{s.brandMean.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right font-mono">{fmtMoney(Math.round(s.costMean))}</td>
                </>}
                <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(s.n)}</td>
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
