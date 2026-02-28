'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { fmtMoney, fmt } from '@/lib/utils'
import { stateName } from '@/lib/state-names'

type OpioidState = { state: string; providers: number; opioidProv: number; highOpioid: number; opioidClaims: number; avgOpioidRate: number; opioidPct: number }
type OpioidProvider = { npi: string; name: string; credentials: string; city: string; state: string; specialty: string; opioidRate: number; opioidClaims: number; claims: number; riskLevel: string }

type StateSortKey = 'name' | 'providers' | 'opioidProv' | 'opioidPct' | 'avgOpioidRate' | 'highOpioid'
type ProvSortKey = 'name' | 'opioidRate' | 'opioidClaims' | 'claims'

export default function OpioidClient({ opioidByState, topOpioid }: { opioidByState: OpioidState[]; topOpioid: OpioidProvider[] }) {
  // State table
  const [stateSearch, setStateSearch] = useState('')
  const [stateSortKey, setStateSortKey] = useState<StateSortKey>('avgOpioidRate')
  const [stateSortDir, setStateSortDir] = useState<'asc' | 'desc'>('desc')

  const toggleState = (key: StateSortKey) => {
    if (stateSortKey === key) setStateSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setStateSortKey(key); setStateSortDir('desc') }
  }
  const stateArrow = (key: StateSortKey) => stateSortKey === key ? (stateSortDir === 'asc' ? ' ▲' : ' ▼') : ''

  const filteredStates = useMemo(() => {
    const q = stateSearch.toLowerCase()
    let list = opioidByState.filter(s => s.opioidProv > 0).filter(s => stateName(s.state).toLowerCase().includes(q) || s.state.toLowerCase().includes(q))
    list.sort((a, b) => {
      let av: number | string, bv: number | string
      switch (stateSortKey) {
        case 'name': av = stateName(a.state); bv = stateName(b.state); break
        case 'providers': av = a.providers; bv = b.providers; break
        case 'opioidProv': av = a.opioidProv; bv = b.opioidProv; break
        case 'opioidPct': av = a.opioidPct; bv = b.opioidPct; break
        case 'avgOpioidRate': av = a.avgOpioidRate; bv = b.avgOpioidRate; break
        case 'highOpioid': av = a.highOpioid; bv = b.highOpioid; break
        default: av = a.avgOpioidRate; bv = b.avgOpioidRate
      }
      if (typeof av === 'string') return stateSortDir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av)
      return stateSortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
    return list
  }, [opioidByState, stateSearch, stateSortKey, stateSortDir])

  // Provider table
  const [provSearch, setProvSearch] = useState('')
  const [provSortKey, setProvSortKey] = useState<ProvSortKey>('opioidRate')
  const [provSortDir, setProvSortDir] = useState<'asc' | 'desc'>('desc')
  const [provFilter, setProvFilter] = useState('')
  const [provShowCount, setProvShowCount] = useState(50)

  const toggleProv = (key: ProvSortKey) => {
    if (provSortKey === key) setProvSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setProvSortKey(key); setProvSortDir('desc') }
  }
  const provArrow = (key: ProvSortKey) => provSortKey === key ? (provSortDir === 'asc' ? ' ▲' : ' ▼') : ''

  const provStates = useMemo(() => {
    const s = new Set(topOpioid.map(p => p.state))
    return Array.from(s).sort()
  }, [topOpioid])

  const filteredProvs = useMemo(() => {
    const q = provSearch.toLowerCase()
    let list = topOpioid.filter(p => {
      if (provFilter && p.state !== provFilter) return false
      return p.name.toLowerCase().includes(q) || p.state.toLowerCase().includes(q) || (p.city && p.city.toLowerCase().includes(q))
    })
    list.sort((a, b) => {
      let av: number | string, bv: number | string
      switch (provSortKey) {
        case 'name': av = a.name; bv = b.name; break
        case 'opioidRate': av = a.opioidRate; bv = b.opioidRate; break
        case 'opioidClaims': av = a.opioidClaims; bv = b.opioidClaims; break
        case 'claims': av = a.claims; bv = b.claims; break
        default: av = a.opioidRate; bv = b.opioidRate
      }
      if (typeof av === 'string') return provSortDir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av)
      return provSortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
    return list
  }, [topOpioid, provSearch, provSortKey, provSortDir, provFilter])

  const visibleProvs = filteredProvs.slice(0, provShowCount)

  return (
    <>
      {/* State Rankings */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-4">Opioid Prescribing by State</h2>
        <div className="mb-4">
          <input type="text" placeholder="🔍 Search states..." value={stateSearch} onChange={e => setStateSearch(e.target.value)} className="rounded-lg border border-gray-200 px-4 py-2 w-full md:w-80" />
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggleState('name')}>State{stateArrow('name')}</th>
                <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggleState('providers')}>Prescribers{stateArrow('providers')}</th>
                <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggleState('opioidProv')}>Opioid Prescribers{stateArrow('opioidProv')}</th>
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell cursor-pointer hover:text-[#1e40af]" onClick={() => toggleState('opioidPct')}>% Prescribing{stateArrow('opioidPct')}</th>
                <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggleState('avgOpioidRate')}>Avg Opioid Rate{stateArrow('avgOpioidRate')}</th>
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell cursor-pointer hover:text-[#1e40af]" onClick={() => toggleState('highOpioid')}>High Rate{stateArrow('highOpioid')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStates.map((s, i) => (
                <tr key={s.state} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-2"><Link href={`/states/${s.state.toLowerCase()}`} className="text-primary font-medium hover:underline">{stateName(s.state)}</Link></td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(s.providers)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(s.opioidProv)}</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{s.opioidPct}%</td>
                  <td className={`px-4 py-2 text-right font-mono font-semibold ${s.avgOpioidRate > 10 ? 'text-red-600' : ''}`}>{s.avgOpioidRate.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(s.highOpioid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500 mt-2">Showing {filteredStates.length} states</p>
      </section>

      {/* Top Opioid Prescribers */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-4">Highest Opioid Prescribing Rates</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800">
          High opioid prescribing rates may reflect legitimate pain management specialization. Context matters.
        </div>
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input type="text" placeholder="🔍 Search by name or state..." value={provSearch} onChange={e => { setProvSearch(e.target.value); setProvShowCount(50) }} className="rounded-lg border border-gray-200 px-4 py-2 w-full md:w-80" />
          <select value={provFilter} onChange={e => { setProvFilter(e.target.value); setProvShowCount(50) }} className="rounded-lg border border-gray-200 px-4 py-2">
            <option value="">All States</option>
            {provStates.map(s => <option key={s} value={s}>{stateName(s)}</option>)}
          </select>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggleProv('name')}>Provider{provArrow('name')}</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Specialty</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Location</th>
                <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggleProv('opioidRate')}>Opioid Rate{provArrow('opioidRate')}</th>
                <th className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-[#1e40af]" onClick={() => toggleProv('opioidClaims')}>Opioid Claims{provArrow('opioidClaims')}</th>
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell cursor-pointer hover:text-[#1e40af]" onClick={() => toggleProv('claims')}>Total Claims{provArrow('claims')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleProvs.map(p => (
                <tr key={p.npi} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <Link href={`/providers/${p.npi}`} className="text-primary font-medium hover:underline">{p.name}</Link>
                    {p.credentials && <span className="text-xs text-gray-400 ml-1">{p.credentials}</span>}
                  </td>
                  <td className="px-4 py-2 text-gray-600 hidden md:table-cell">{p.specialty}</td>
                  <td className="px-4 py-2 text-gray-500 hidden md:table-cell">{p.city}, {p.state}</td>
                  <td className="px-4 py-2 text-right font-mono text-red-600 font-semibold">{p.opioidRate.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(p.opioidClaims)}</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(p.claims)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500 mt-2">Showing {visibleProvs.length} of {filteredProvs.length} prescribers</p>
        {provShowCount < filteredProvs.length && (
          <button onClick={() => setProvShowCount(c => c + 50)} className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-[#1e40af] font-medium rounded-lg border mt-3">
            Show More ({filteredProvs.length - provShowCount} remaining)
          </button>
        )}
      </section>
    </>
  )
}
