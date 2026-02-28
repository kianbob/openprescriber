// @ts-nocheck
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { fmtMoney, fmt } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'

const FLAG_LABELS: Record<string, string> = {
  extreme_opioid_vs_peers: '🔴 Extreme opioid rate vs peers',
  very_high_opioid_vs_peers: '🟠 Very high opioid rate vs peers',
  high_opioid_vs_peers: '🟡 High opioid rate vs peers',
  '99th_pctile_opioid': '🔴 99th percentile opioid',
  '95th_pctile_opioid': '🟠 95th percentile opioid',
  '90th_pctile_opioid': '🟡 90th percentile opioid',
  high_la_opioid_vs_peers: '💊 High long-acting opioid',
  elevated_la_opioid: '💊 Elevated long-acting opioid',
  extreme_cost_outlier: '💰 Extreme cost outlier',
  high_cost_outlier: '💰 High cost outlier',
  elevated_cost: '💰 Elevated cost',
  extreme_brand_preference: '🏷️ Extreme brand preference',
  high_brand_preference: '🏷️ High brand preference',
  high_antipsych_elderly: '⚠️ High antipsychotic prescribing to 65+',
  elevated_antipsych_elderly: '⚠️ Elevated antipsychotic prescribing to 65+',
  opioid_benzo_coprescriber: '☠️ Opioid + benzo co-prescriber',
  leie_excluded: '🚫 OIG Excluded',
  very_low_drug_diversity: '🎯 Very low drug diversity',
  low_drug_diversity: '🎯 Low drug diversity',
  extreme_fills_per_patient: '🔄 Extreme fills per patient',
  high_fills_per_patient: '🔄 High fills per patient',
}

type Provider = {
  npi: string; name: string; credentials: string; city: string; state: string
  specialty: string; claims: number; cost: number; costPerBene: number
  opioidRate: number; brandPct: number; riskScore: number; riskLevel: string
  riskFlags: string[]; benes: number; isExcluded: boolean
}

const POPULAR_COMPARISONS = [
  { npi1: '1194726900', npi2: '1790786416', label: 'High-risk pain management providers' },
  { npi1: '1447252627', npi2: '1578560570', label: 'Top cost outlier prescribers' },
  { npi1: '1003000712', npi2: '1003035239', label: 'Different specialty comparison' },
]

function riskBadgeEl(level: string) {
  const map: Record<string, { emoji: string; text: string; cls: string }> = {
    high: { emoji: '🔴', text: 'High Risk', cls: 'bg-red-50 text-red-700 border-red-200' },
    elevated: { emoji: '🟠', text: 'Elevated', cls: 'bg-orange-50 text-orange-700 border-orange-200' },
    moderate: { emoji: '🟡', text: 'Moderate', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    low: { emoji: '🟢', text: 'Low', cls: 'bg-green-50 text-green-700 border-green-200' },
  }
  const r = map[level] || map.low
  return <span className={`text-xs px-2 py-1 rounded-full border ${r.cls}`}>{r.emoji} {r.text}</span>
}

function StatCard({ label, v1, v2, format, lowerBetter }: {
  label: string; v1: number; v2: number; format: (n: number) => string; lowerBetter?: boolean
}) {
  const better = lowerBetter ? (v1 < v2 ? 1 : v1 > v2 ? 2 : 0) : (v1 > v2 ? 1 : v1 < v2 ? 2 : 0)
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs text-gray-500 font-medium mb-2 text-center">{label}</p>
      <div className="grid grid-cols-2 gap-3">
        <div className={`text-center rounded-lg p-2 ${better === 1 ? 'bg-red-50' : better === 2 ? 'bg-green-50' : 'bg-gray-50'}`}>
          <p className={`font-bold text-lg ${better === 1 ? 'text-red-700' : better === 2 ? 'text-green-700' : 'text-gray-700'}`}>
            {format(v1)}
          </p>
        </div>
        <div className={`text-center rounded-lg p-2 ${better === 2 ? 'bg-red-50' : better === 1 ? 'bg-green-50' : 'bg-gray-50'}`}>
          <p className={`font-bold text-lg ${better === 2 ? 'text-red-700' : better === 1 ? 'text-green-700' : 'text-gray-700'}`}>
            {format(v2)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CompareClient() {
  const [npi1, setNpi1] = useState('')
  const [npi2, setNpi2] = useState('')
  const [p1, setP1] = useState<Provider | null>(null)
  const [p2, setP2] = useState<Provider | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const compare = async (n1?: string, n2?: string) => {
    const a = n1 || npi1.trim()
    const b = n2 || npi2.trim()
    if (!a || !b) { setError('Please enter two NPI numbers.'); return }
    if (a === b) { setError('Please enter two different NPI numbers.'); return }
    setError('')
    setLoading(true)
    setP1(null)
    setP2(null)
    try {
      const [r1, r2] = await Promise.all([
        fetch(`/data/providers/${a}.json`),
        fetch(`/data/providers/${b}.json`),
      ])
      if (!r1.ok || !r2.ok) {
        const bad = !r1.ok && !r2.ok ? 'Both NPIs were' : !r1.ok ? `NPI ${a} was` : `NPI ${b} was`
        setError(`${bad} not found. Only providers with 11+ claims are included.`)
        setLoading(false)
        return
      }
      setP1(await r1.json())
      setP2(await r2.json())
    } catch {
      setError('Failed to fetch provider data. Please try again.')
    }
    setLoading(false)
  }

  const chartData = p1 && p2 ? [
    { metric: 'Claims', p1: p1.claims, p2: p2.claims },
    { metric: 'Opioid %', p1: p1.opioidRate, p2: p2.opioidRate },
    { metric: 'Brand %', p1: p1.brandPct, p2: p2.brandPct },
    { metric: 'Risk Score', p1: p1.riskScore, p2: p2.riskScore },
  ] : []

  return (
    <div>
      {/* Input section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Provider 1 NPI</label>
            <input
              type="text"
              value={npi1}
              onChange={e => setNpi1(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="e.g. 1194726900"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Provider 2 NPI</label>
            <input
              type="text"
              value={npi2}
              onChange={e => setNpi2(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="e.g. 1790786416"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
        <button
          onClick={() => compare()}
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-blue-900 transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Compare Providers'}
        </button>
        {error && <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}
      </div>

      {/* Results */}
      {p1 && p2 && (
        <div>
          {/* Provider headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[p1, p2].map(p => (
              <div key={p.npi} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <Link href={`/providers/${p.npi}`} className="text-lg font-bold text-primary hover:underline">{p.name}</Link>
                  {riskBadgeEl(p.riskLevel)}
                </div>
                <p className="text-sm text-gray-500">{p.specialty}</p>
                <p className="text-sm text-gray-400">{p.city}, {p.state} &middot; NPI: {p.npi}</p>
              </div>
            ))}
          </div>

          {/* Stat comparison cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard label="Total Claims" v1={p1.claims} v2={p2.claims} format={v => fmt(v)} />
            <StatCard label="Total Drug Cost" v1={p1.cost} v2={p2.cost} format={v => fmtMoney(v)} lowerBetter />
            <StatCard label="Cost per Patient" v1={p1.costPerBene} v2={p2.costPerBene} format={v => fmtMoney(v)} lowerBetter />
            <StatCard label="Opioid Rate" v1={p1.opioidRate} v2={p2.opioidRate} format={v => v.toFixed(1) + '%'} lowerBetter />
            <StatCard label="Brand Name %" v1={p1.brandPct} v2={p2.brandPct} format={v => v.toFixed(1) + '%'} lowerBetter />
            <StatCard label="Risk Score" v1={p1.riskScore} v2={p2.riskScore} format={v => String(v)} lowerBetter />
          </div>

          {/* Bar chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="font-bold text-lg mb-4 font-[family-name:var(--font-heading)]">Side-by-Side Comparison</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: 10, right: 10 }}>
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="p1" name={p1.name.split(' ').slice(-1)[0]} fill="#1e40af" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="p2" name={p2.name.split(' ').slice(-1)[0]} fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk flags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[p1, p2].map(p => (
              <div key={p.npi} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold mb-3">Risk Flags: {p.name.split(' ').slice(-1)[0]}</h3>
                {p.riskFlags.length === 0 ? (
                  <p className="text-sm text-gray-500">No risk flags</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {p.riskFlags.map(f => (
                      <span key={f} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full border border-red-200">
                        {FLAG_LABELS[f] || f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular comparisons */}
      <div className="mt-10 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-3 font-[family-name:var(--font-heading)]">Popular Comparisons</h3>
        <div className="space-y-2">
          {POPULAR_COMPARISONS.map(c => (
            <button
              key={c.npi1 + c.npi2}
              onClick={() => { setNpi1(c.npi1); setNpi2(c.npi2); compare(c.npi1, c.npi2) }}
              className="block w-full text-left bg-white rounded-lg border border-blue-100 p-3 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <p className="text-sm font-medium text-primary">{c.label}</p>
              <p className="text-xs text-gray-400">NPI {c.npi1} vs {c.npi2}</p>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">Find NPIs using the <Link href="/search" className="text-primary hover:underline">provider search</Link>.</p>
      </div>
    </div>
  )
}
