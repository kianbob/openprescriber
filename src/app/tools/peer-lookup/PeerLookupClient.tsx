'use client'
import { useState, useEffect } from 'react'

type Dist = { mean: number; std: number; p50: number; p90: number; p95: number }
type SpecStats = { n: number; opioidRate: Dist; costPerBene: Dist; brandPct: Dist }

function fmtMoney(n: number): string {
  if (Math.abs(n) >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B'
  if (Math.abs(n) >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M'
  if (Math.abs(n) >= 1e4) return '$' + (n / 1e3).toFixed(0) + 'K'
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function Metric({ label, emoji, dist, unit }: { label: string; emoji: string; dist: Dist; unit: 'pct' | 'money' }) {
  const format = (v: number) => unit === 'money' ? fmtMoney(v) : v.toFixed(1) + '%'
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h4 className="font-bold text-sm mb-3">{emoji} {label}</h4>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-blue-50 rounded-lg p-2 text-center">
          <p className="font-bold text-blue-700">{format(dist.mean)}</p>
          <p className="text-xs text-blue-500">Average</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="font-bold">{format(dist.p50)}</p>
          <p className="text-xs text-gray-500">Median (P50)</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-2 text-center">
          <p className="font-bold text-orange-700">{format(dist.p90)}</p>
          <p className="text-xs text-orange-500">90th Percentile</p>
        </div>
        <div className="bg-red-50 rounded-lg p-2 text-center">
          <p className="font-bold text-red-700">{format(dist.p95)}</p>
          <p className="text-xs text-red-500">95th Percentile</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">Std Dev: {unit === 'money' ? fmtMoney(dist.std) : dist.std.toFixed(1) + '%'} · Outlier threshold (mean+2σ): {format(dist.mean + 2 * dist.std)}</p>
    </div>
  )
}

export default function PeerLookupClient() {
  const [data, setData] = useState<Record<string, SpecStats> | null>(null)
  const [selected, setSelected] = useState('')

  useEffect(() => {
    fetch('/data/specialty-stats.json').then(r => r.json()).then(setData).catch(() => {})
  }, [])

  if (!data) return <p className="text-gray-500 py-8">Loading specialty data…</p>

  const specialties = Object.keys(data).sort()
  const spec = selected ? data[selected] : null

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 my-8">
        <h3 className="font-bold text-lg mb-4">🔍 Select a Specialty</h3>
        <select
          className="w-full md:w-96 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="">— Choose a specialty —</option>
          {specialties.map(s => (
            <option key={s} value={s}>{s} ({data[s].n.toLocaleString()} providers)</option>
          ))}
        </select>
      </div>

      {spec && (
        <div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6">
            <p className="text-sm text-blue-800">
              <strong>{selected}</strong> has <strong>{spec.n.toLocaleString()}</strong> Medicare Part D prescribers. Below are the prescribing benchmarks for this specialty — any provider more than 2 standard deviations above the mean is flagged as a statistical outlier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Metric label="Opioid Rate" emoji="💊" dist={spec.opioidRate} unit="pct" />
            <Metric label="Cost per Beneficiary" emoji="💰" dist={spec.costPerBene} unit="money" />
            <Metric label="Brand Name %" emoji="🏷️" dist={spec.brandPct} unit="pct" />
          </div>

          <div className="bg-gray-50 rounded-xl p-5 mt-6 border border-gray-200">
            <h4 className="font-bold text-sm mb-2">📊 How to Interpret These Numbers</h4>
            <p className="text-sm text-gray-600">
              If a <strong>{selected}</strong> provider has an opioid rate of <strong>{(spec.opioidRate.mean + 2 * spec.opioidRate.std).toFixed(1)}%</strong> or higher, they exceed the outlier threshold (mean + 2σ) and are in the top ~2.5% of their peers. Similarly, a cost per beneficiary above <strong>{fmtMoney(spec.costPerBene.mean + 2 * spec.costPerBene.std)}</strong> or brand rate above <strong>{(spec.brandPct.mean + 2 * spec.brandPct.std).toFixed(1)}%</strong> would be flagged.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              The median (P50) represents the &quot;typical&quot; provider. The gap between mean and median indicates skew — a large gap means a few high-volume prescribers pull the average up.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
