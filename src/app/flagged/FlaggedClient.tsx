// @ts-nocheck
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { fmtMoney, fmt } from '@/lib/utils'

const FLAG_LABELS: Record<string, string> = {
  extreme_opioid_vs_peers: '🔴 Extreme opioid rate vs specialty peers',
  very_high_opioid_vs_peers: '🟠 Very high opioid rate vs peers',
  high_opioid_vs_peers: '🟡 High opioid rate vs peers',
  '99th_pctile_opioid': '🔴 99th percentile opioid rate',
  '95th_pctile_opioid': '🟠 95th percentile opioid rate',
  '90th_pctile_opioid': '🟡 90th percentile opioid rate',
  high_la_opioid_vs_peers: '💊 High long-acting opioid vs peers',
  elevated_la_opioid: '💊 Elevated long-acting opioid rate',
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
  npi: string; name: string; credentials: string; city: string; state: string;
  specialty: string; claims: number; cost: number; opioidRate: number;
  brandPct: number; costPerBene: number; riskScore: number; riskFlags: string[];
  riskLevel: string; isExcluded: boolean
}

export default function FlaggedClient({ providers }: { providers: Provider[] }) {
  const [filter, setFilter] = useState<'all' | 'high' | 'excluded' | 'opioid_benzo'>('all')
  const [showCount, setShowCount] = useState(50)

  const filtered = providers.filter(p => {
    if (filter === 'high') return p.riskScore >= 50
    if (filter === 'excluded') return p.isExcluded
    if (filter === 'opioid_benzo') return p.riskFlags?.includes('opioid_benzo_coprescriber')
    return true
  })

  const visible = filtered.slice(0, showCount)

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mt-6 mb-4">
        {[
          { key: 'all', label: `All (${providers.length})` },
          { key: 'high', label: `High Risk ≥50 (${providers.filter(p => p.riskScore >= 50).length})` },
          { key: 'excluded', label: `OIG Excluded (${providers.filter(p => p.isExcluded).length})` },
          { key: 'opioid_benzo', label: `Opioid+Benzo (${providers.filter(p => p.riskFlags?.includes('opioid_benzo_coprescriber')).length})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setFilter(tab.key as typeof filter); setShowCount(50) }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Showing {Math.min(showCount, filtered.length)} of {filtered.length} providers, sorted by risk score.
      </p>

      {/* Provider cards */}
      <div className="space-y-3">
        {visible.map(p => (
          <div key={p.npi} className="bg-white rounded-xl shadow-sm border border-red-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/providers/${p.npi}`} className="text-base font-bold text-primary hover:underline">{p.name}</Link>
                  {p.credentials && <span className="text-sm text-gray-400">{p.credentials}</span>}
                  {p.isExcluded && <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-medium">EXCLUDED</span>}
                </div>
                <p className="text-sm text-gray-500">{p.specialty} · {p.city}, {p.state}</p>
                <div className="flex flex-wrap gap-3 mt-1.5 text-sm">
                  <span><strong>{fmt(p.claims)}</strong> claims</span>
                  <span><strong>{fmtMoney(p.cost)}</strong> drug cost</span>
                  {p.opioidRate > 0 && <span className="text-red-600"><strong>{p.opioidRate.toFixed(1)}%</strong> opioid</span>}
                  {p.costPerBene > 0 && <span><strong>{fmtMoney(p.costPerBene)}</strong>/patient</span>}
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {p.riskFlags.slice(0, 4).map(f => (
                    <span key={f} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                      {FLAG_LABELS[f] || f}
                    </span>
                  ))}
                  {p.riskFlags.length > 4 && <span className="text-xs text-gray-400">+{p.riskFlags.length - 4} more</span>}
                </div>
              </div>
              <div className="flex-shrink-0 text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${p.riskScore >= 50 ? 'bg-red-100' : 'bg-orange-100'}`}>
                  <span className={`text-xl font-bold ${p.riskScore >= 50 ? 'text-red-700' : 'text-orange-700'}`}>{p.riskScore}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{p.riskLevel}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCount < filtered.length && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowCount(c => c + 50)}
            className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors font-medium"
          >
            Show More ({filtered.length - showCount} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
