// @ts-nocheck
'use client'
import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { fmtMoney, fmt } from '@/lib/utils'

type Spec = { specialty: string; providers: number; claims: number; cost: number; opioidProv: number; avgOpioidRate: number; avgBrandPct: number; costPerProvider: number }

const COLORS = ['#1e40af', '#0ea5e9', '#f59e0b']

const popularComparisons = [
  ['Internal Medicine', 'Family Practice'],
  ['Nurse Practitioner', 'Physician Assistant'],
  ['Cardiology', 'Gastroenterology', 'Pulmonary Disease'],
  ['Ophthalmology', 'Optometry'],
]

export default function SpecialtyCompareClient({ specialties }: { specialties: Spec[] }) {
  const [selected, setSelected] = useState<(string | '')[]>(['', '', ''])

  const specs = useMemo(() =>
    selected.map(name => specialties.find(s => s.specialty === name)).filter(Boolean) as Spec[],
    [selected, specialties]
  )

  function setSlot(i: number, val: string) {
    const next = [...selected]
    next[i] = val
    setSelected(next)
  }

  function applyPopular(names: string[]) {
    const next = ['', '', '']
    names.forEach((n, i) => { next[i] = n })
    setSelected(next)
  }

  const chartData = useMemo(() => {
    if (specs.length < 2) return []
    return [
      { metric: 'Providers', ...Object.fromEntries(specs.map((s, i) => [`s${i}`, s.providers])) },
      { metric: 'Avg Opioid %', ...Object.fromEntries(specs.map((s, i) => [`s${i}`, s.avgOpioidRate])) },
      { metric: 'Avg Brand %', ...Object.fromEntries(specs.map((s, i) => [`s${i}`, s.avgBrandPct])) },
      { metric: 'Cost/Provider ($K)', ...Object.fromEntries(specs.map((s, i) => [`s${i}`, Math.round(s.costPerProvider / 1000)])) },
    ]
  }, [specs])

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map(i => (
          <div key={i}>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Specialty {i + 1}{i < 2 ? ' *' : ' (optional)'}</label>
            <select
              value={selected[i]}
              onChange={e => setSlot(i, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Select specialty...</option>
              {specialties.map(s => (
                <option key={s.specialty} value={s.specialty}>{s.specialty}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {specs.length >= 2 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {specs.map((s, i) => (
              <div key={s.specialty} className="bg-white rounded-xl shadow-sm p-5 border" style={{ borderTopColor: COLORS[i], borderTopWidth: 4 }}>
                <h3 className="font-bold text-lg mb-3">{s.specialty}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Providers</span><span className="font-mono font-semibold">{fmt(s.providers)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Total Cost</span><span className="font-mono font-semibold">{fmtMoney(s.cost)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Avg Opioid Rate</span><span className="font-mono font-semibold">{s.avgOpioidRate.toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Avg Brand %</span><span className="font-mono font-semibold">{s.avgBrandPct.toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Cost/Provider</span><span className="font-mono font-semibold">{fmtMoney(s.costPerProvider)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Opioid Prescribers</span><span className="font-mono font-semibold">{fmt(s.opioidProv)}</span></div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border mt-6">
            <h3 className="font-bold text-lg mb-4">Comparison Chart</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: 10, right: 10 }}>
                  <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {specs.map((s, i) => (
                    <Bar key={s.specialty} dataKey={`s${i}`} name={s.specialty} fill={COLORS[i]} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {specs.length < 2 && (
        <p className="mt-6 text-gray-500 text-sm">Select at least 2 specialties to compare.</p>
      )}

      <div className="mt-10">
        <h3 className="font-bold text-lg mb-3">Popular Comparisons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {popularComparisons.map((combo, i) => (
            <button
              key={i}
              onClick={() => applyPopular(combo)}
              className="text-left bg-white border rounded-lg p-4 hover:shadow-sm hover:border-primary/30 transition-all"
            >
              <p className="font-medium text-sm text-primary">{combo.join(' vs ')}</p>
              <p className="text-xs text-gray-500 mt-1">Click to compare</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
