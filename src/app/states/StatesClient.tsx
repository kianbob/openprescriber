'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { fmtMoney, fmt } from '@/lib/utils'
import { stateName } from '@/lib/state-names'

type State = { state: string; providers: number; claims: number; cost: number; benes: number; opioidProv: number; highOpioid: number; avgOpioidRate: number; costPerBene: number }
type SortKey = 'name' | 'providers' | 'claims' | 'cost' | 'costPerBene' | 'avgOpioidRate' | 'highOpioid'

export default function StatesClient({ states }: { states: State[] }) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('cost')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const toggle = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }
  const arrow = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    let list = states.filter(s => stateName(s.state).toLowerCase().includes(q) || s.state.toLowerCase().includes(q))
    list.sort((a, b) => {
      let av: number | string, bv: number | string
      switch (sortKey) {
        case 'name': av = stateName(a.state); bv = stateName(b.state); break
        case 'providers': av = a.providers; bv = b.providers; break
        case 'claims': av = a.claims; bv = b.claims; break
        case 'cost': av = a.cost; bv = b.cost; break
        case 'costPerBene': av = a.costPerBene; bv = b.costPerBene; break
        case 'avgOpioidRate': av = a.avgOpioidRate; bv = b.avgOpioidRate; break
        case 'highOpioid': av = a.highOpioid; bv = b.highOpioid; break
        default: av = a.cost; bv = b.cost
      }
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av)
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
    return list
  }, [states, search, sortKey, sortDir])

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search states..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-2 w-full md:w-80"
        />
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('name')}>State{arrow('name')}</th>
              <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('providers')}>Prescribers{arrow('providers')}</th>
              <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('cost')}>Drug Cost{arrow('cost')}</th>
              <th className="px-4 py-3 text-right font-semibold hidden md:table-cell cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('claims')}>Claims{arrow('claims')}</th>
              <th className="px-4 py-3 text-right font-semibold hidden md:table-cell cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('costPerBene')}>Cost/Bene{arrow('costPerBene')}</th>
              <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('avgOpioidRate')}>Avg Opioid Rate{arrow('avgOpioidRate')}</th>
              <th className="px-4 py-3 text-right font-semibold hidden lg:table-cell cursor-pointer hover:text-[#1e40af]" onClick={() => toggle('highOpioid')}>High Opioid{arrow('highOpioid')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((s, i) => (
              <tr key={s.state} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                <td className="px-4 py-2"><Link href={`/states/${s.state.toLowerCase()}`} className="font-medium text-primary hover:underline">{stateName(s.state)}</Link></td>
                <td className="px-4 py-2 text-right font-mono">{fmt(s.providers)}</td>
                <td className="px-4 py-2 text-right font-mono">{fmtMoney(s.cost)}</td>
                <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(s.claims)}</td>
                <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmtMoney(s.costPerBene)}</td>
                <td className={`px-4 py-2 text-right font-mono font-semibold ${s.avgOpioidRate > 10 ? 'text-red-600' : ''}`}>{s.avgOpioidRate.toFixed(1)}%</td>
                <td className="px-4 py-2 text-right font-mono hidden lg:table-cell">{fmt(s.highOpioid)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500 mt-2">Showing {filtered.length} of {states.length} states</p>
    </>
  )
}
