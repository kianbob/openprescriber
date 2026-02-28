// @ts-nocheck
'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

type Provider = {
  npi: string; name: string; credentials: string;
  city: string; state: string; specialty: string;
  claims: number; cost: number; benes: number;
  opioidRate: number; costPerBene: number; brandPct: number;
  claimsPerBene: number;
  riskScore: number; riskLevel: string; riskFlags: string[];
  riskComponents: Record<string, number>;
  isExcluded: boolean; opioidBenzoCombination: boolean;
}

const FLAG_OPTIONS = [
  { value: 'leie_excluded', label: '🚫 LEIE Excluded' },
  { value: 'opioid_benzo_coprescriber', label: '☠️ Opioid+Benzo' },
  { value: 'extreme_opioid_vs_peers', label: '🔴 Extreme opioid vs peers' },
  { value: '99th_pctile_opioid', label: '🔴 99th pctile opioid' },
  { value: 'extreme_cost_outlier', label: '💰 Extreme cost outlier' },
  { value: 'high_antipsych_elderly', label: '⚠️ High antipsych elderly' },
  { value: 'extreme_brand_preference', label: '🏷️ Extreme brand preference' },
  { value: 'extreme_fills_per_patient', label: '🔄 Extreme fills/patient' },
  { value: 'very_low_drug_diversity', label: '🎯 Very low drug diversity' },
]

function fmt(n: number) { return n >= 1e9 ? `$${(n/1e9).toFixed(1)}B` : n >= 1e6 ? `$${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `$${(n/1e3).toFixed(0)}K` : `$${n}`; }
function fmtN(n: number) { return n.toLocaleString(); }

export default function RiskExplorerClient({ providers }: { providers: Provider[] }) {
  const [minScore, setMinScore] = useState(30)
  const [state, setState] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [requiredFlag, setRequiredFlag] = useState('')
  const [sortBy, setSortBy] = useState<'riskScore' | 'opioidRate' | 'cost' | 'claims'>('riskScore')

  const states = useMemo(() => [...new Set(providers.map(p => p.state))].sort(), [providers])
  const specialties = useMemo(() => [...new Set(providers.map(p => p.specialty))].sort(), [providers])

  const filtered = useMemo(() => {
    let result = providers.filter(p => p.riskScore >= minScore)
    if (state) result = result.filter(p => p.state === state)
    if (specialty) result = result.filter(p => p.specialty === specialty)
    if (requiredFlag) result = result.filter(p => p.riskFlags.includes(requiredFlag))
    result.sort((a, b) => {
      if (sortBy === 'opioidRate') return b.opioidRate - a.opioidRate
      if (sortBy === 'cost') return b.cost - a.cost
      if (sortBy === 'claims') return b.claims - a.claims
      return b.riskScore - a.riskScore
    })
    return result.slice(0, 100)
  }, [providers, minScore, state, specialty, requiredFlag, sortBy])

  const totalFiltered = useMemo(() => {
    let result = providers.filter(p => p.riskScore >= minScore)
    if (state) result = result.filter(p => p.state === state)
    if (specialty) result = result.filter(p => p.specialty === specialty)
    if (requiredFlag) result = result.filter(p => p.riskFlags.includes(requiredFlag))
    return result.length
  }, [providers, minScore, state, specialty, requiredFlag])

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-5 border mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Min Risk Score</label>
            <input type="range" min={15} max={70} value={minScore} onChange={e => setMinScore(+e.target.value)} className="w-full" />
            <span className="text-sm font-mono">{minScore}</span>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">State</label>
            <select value={state} onChange={e => setState(e.target.value)} className="w-full text-sm border rounded px-2 py-1.5">
              <option value="">All States</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Specialty</label>
            <select value={specialty} onChange={e => setSpecialty(e.target.value)} className="w-full text-sm border rounded px-2 py-1.5">
              <option value="">All Specialties</option>
              {specialties.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Must Have Flag</label>
            <select value={requiredFlag} onChange={e => setRequiredFlag(e.target.value)} className="w-full text-sm border rounded px-2 py-1.5">
              <option value="">Any</option>
              {FLAG_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Sort By</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="w-full text-sm border rounded px-2 py-1.5">
              <option value="riskScore">Risk Score</option>
              <option value="opioidRate">Opioid Rate</option>
              <option value="cost">Total Cost</option>
              <option value="claims">Total Claims</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">{fmtN(totalFiltered)} providers match · Showing top 100</p>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {filtered.map(p => (
          <div key={p.npi} className={`bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow ${p.riskLevel === 'high' ? 'border-red-200' : 'border-orange-100'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/providers/${p.npi}`} className="text-base font-bold text-primary hover:underline truncate">{p.name}</Link>
                  {p.credentials && <span className="text-xs text-gray-400">{p.credentials}</span>}
                  {p.isExcluded && <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">EXCLUDED</span>}
                  {p.opioidBenzoCombination && <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">OPIOID+BENZO</span>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{p.specialty} · {p.city}, {p.state}</p>
                <div className="flex flex-wrap gap-3 mt-1.5 text-xs">
                  <span>{fmtN(p.claims)} claims</span>
                  <span>{fmt(p.cost)} cost</span>
                  {p.opioidRate > 0 && <span className="text-red-600 font-semibold">{p.opioidRate}% opioid</span>}
                  {p.costPerBene > 0 && <span>{fmt(p.costPerBene)}/patient</span>}
                  {p.claimsPerBene > 0 && <span>{p.claimsPerBene} fills/patient</span>}
                </div>
              </div>
              <div className="text-center flex-shrink-0">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg ${p.riskScore >= 50 ? 'bg-red-500' : 'bg-orange-500'}`}>
                  {p.riskScore}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">{p.riskLevel}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {p.riskFlags.map(f => (
                <span key={f} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{f.replace(/_/g, ' ')}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
