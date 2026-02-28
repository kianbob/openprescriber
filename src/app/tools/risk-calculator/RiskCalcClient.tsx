// @ts-nocheck
'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function RiskCalcClient() {
  const [opioidRate, setOpioidRate] = useState('')
  const [costPerBene, setCostPerBene] = useState('')
  const [brandPct, setBrandPct] = useState('')
  const [isExcluded, setIsExcluded] = useState(false)
  const [hasBenzoCombo, setHasBenzoCombo] = useState(false)
  const [lowDiversity, setLowDiversity] = useState(false)
  const [elderlyAntipsych, setElderlyAntipsych] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [breakdown, setBreakdown] = useState<{label: string; pts: number}[]>([])

  const calculate = () => {
    const op = parseFloat(opioidRate) || 0
    const cpb = parseFloat(costPerBene) || 0
    const bp = parseFloat(brandPct) || 0
    const parts: {label: string; pts: number}[] = []

    // Opioid peer (simplified - assume avg specialty rate ~12%)
    if (op > 70) parts.push({ label: 'Extreme opioid rate vs peers', pts: 25 })
    else if (op > 50) parts.push({ label: 'Very high opioid rate vs peers', pts: 20 })
    else if (op > 30) parts.push({ label: 'High opioid rate vs peers', pts: 12 })
    else if (op > 20) parts.push({ label: 'Elevated opioid rate', pts: 6 })

    // Opioid population percentile
    if (op > 70.6) parts.push({ label: '99th percentile opioid (national)', pts: 15 })
    else if (op > 50.3) parts.push({ label: '95th percentile opioid (national)', pts: 10 })
    else if (op > 37.2) parts.push({ label: '90th percentile opioid (national)', pts: 5 })

    // Cost outlier
    if (cpb > 15157) parts.push({ label: 'Extreme cost outlier (99th percentile)', pts: 10 })
    else if (cpb > 4216) parts.push({ label: 'High cost outlier (95th percentile)', pts: 6 })
    else if (cpb > 2395) parts.push({ label: 'Elevated cost per patient', pts: 3 })

    // Brand preference
    if (bp > 60) parts.push({ label: 'Extreme brand preference', pts: 8 })
    else if (bp > 40) parts.push({ label: 'High brand preference', pts: 5 })
    else if (bp > 25) parts.push({ label: 'Elevated brand preference', pts: 2 })

    // Flags
    if (isExcluded) parts.push({ label: 'OIG excluded provider', pts: 20 })
    if (hasBenzoCombo) parts.push({ label: 'Opioid + benzodiazepine combo', pts: 8 })
    if (lowDiversity) parts.push({ label: 'Low drug diversity', pts: 5 })
    if (elderlyAntipsych) parts.push({ label: 'Elderly antipsychotic prescribing', pts: 10 })

    const total = Math.min(100, parts.reduce((s, p) => s + p.pts, 0))
    setBreakdown(parts)
    setScore(total)
  }

  const riskLevel = score === null ? '' : score >= 50 ? 'High' : score >= 30 ? 'Elevated' : score >= 15 ? 'Moderate' : 'Low'
  const riskColor = score === null ? '' : score >= 50 ? 'text-red-600 bg-red-50 border-red-200' : score >= 30 ? 'text-orange-600 bg-orange-50 border-orange-200' : score >= 15 ? 'text-yellow-600 bg-yellow-50 border-yellow-200' : 'text-green-600 bg-green-50 border-green-200'

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm p-6 border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opioid Prescribing Rate (%)</label>
            <input type="number" value={opioidRate} onChange={e => setOpioidRate(e.target.value)} placeholder="e.g., 25" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <p className="text-xs text-gray-400 mt-1">National avg: ~12%. 95th: 50.3%</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost Per Patient ($)</label>
            <input type="number" value={costPerBene} onChange={e => setCostPerBene(e.target.value)} placeholder="e.g., 3000" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <p className="text-xs text-gray-400 mt-1">Median: ~$800. 95th: $4,216</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand-Name Rate (%)</label>
            <input type="number" value={brandPct} onChange={e => setBrandPct(e.target.value)} placeholder="e.g., 15" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <p className="text-xs text-gray-400 mt-1">National avg: 13.4%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'OIG Excluded', state: isExcluded, set: setIsExcluded },
            { label: 'Opioid + Benzo Combo', state: hasBenzoCombo, set: setHasBenzoCombo },
            { label: 'Low Drug Diversity (≤10)', state: lowDiversity, set: setLowDiversity },
            { label: 'Elderly Antipsychotics', state: elderlyAntipsych, set: setElderlyAntipsych },
          ].map(flag => (
            <label key={flag.label} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${flag.state ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
              <input type="checkbox" checked={flag.state} onChange={e => flag.set(e.target.checked)} className="rounded" />
              <span className="text-sm">{flag.label}</span>
            </label>
          ))}
        </div>

        <button onClick={calculate} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors">
          Calculate Risk Score
        </button>
      </div>

      {score !== null && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center ${riskColor}`}>
              <span className="text-3xl font-bold">{score}</span>
              <span className="text-xs font-medium">/100</span>
            </div>
            <div>
              <p className="text-xl font-bold">{riskLevel} Risk</p>
              <p className="text-sm text-gray-600">Based on simplified scoring model</p>
            </div>
          </div>

          {/* Score bar */}
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div className={`h-full rounded-full transition-all ${score >= 50 ? 'bg-red-500' : score >= 30 ? 'bg-orange-500' : score >= 15 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, score)}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Low (0)</span><span>Moderate (15)</span><span>Elevated (30)</span><span>High (50+)</span>
          </div>

          {/* Breakdown */}
          {breakdown.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-5 border">
              <h3 className="font-bold mb-3">Score Breakdown</h3>
              <div className="space-y-2">
                {breakdown.sort((a, b) => b.pts - a.pts).map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-mono font-bold text-red-600">+{item.pts}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500">
            This is a simplified version of our <Link href="/methodology" className="text-primary hover:underline">full 10-component scoring model</Link>. Actual scores also consider specialty-adjusted z-scores, long-acting opioid rates, fills per patient, and volume multipliers.
          </p>
        </div>
      )}
    </div>
  )
}
