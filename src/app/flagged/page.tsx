import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'Flagged Providers: Medicare Part D Risk Analysis',
  description: 'Providers flagged by our multi-factor risk scoring model — opioid outliers, cost anomalies, brand-name bias, and OIG exclusion matches.',
  alternates: { canonical: 'https://www.openprescriber.org/flagged' },
}

const FLAG_LABELS: Record<string, string> = {
  extreme_opioid_vs_peers: '🔴 Extreme opioid rate vs specialty peers (>5σ)',
  very_high_opioid_vs_peers: '🟠 Very high opioid rate vs peers (>3σ)',
  high_opioid_vs_peers: '🟡 High opioid rate vs peers (>2σ)',
  '99th_pctile_opioid': '🔴 99th percentile opioid rate (population)',
  '95th_pctile_opioid': '🟠 95th percentile opioid rate',
  '90th_pctile_opioid': '🟡 90th percentile opioid rate',
  high_la_opioid_vs_peers: '💊 High long-acting opioid vs peers (>3σ)',
  elevated_la_opioid: '💊 Elevated long-acting opioid rate',
  extreme_cost_outlier: '💰 Extreme cost outlier (99th pctile + >2σ vs peers)',
  high_cost_outlier: '💰 High cost outlier (95th + >1.5σ vs peers)',
  elevated_cost: '💰 Elevated cost (95th percentile)',
  extreme_brand_preference: '🏷️ Extreme brand preference (>3σ vs peers, >50%)',
  high_brand_preference: '🏷️ High brand preference (>2σ vs peers, >30%)',
  high_antipsych_elderly: '⚠️ High antipsychotic prescribing to 65+',
  elevated_antipsych_elderly: '⚠️ Elevated antipsychotic prescribing to 65+',
  opioid_benzo_coprescriber: '☠️ Opioid + benzodiazepine co-prescriber (FDA Black Box)',
  leie_excluded: '🚫 OIG Excluded (LEIE match)',
  very_low_drug_diversity: '🎯 Very low drug diversity (≤5 drugs)',
  low_drug_diversity: '🎯 Low drug diversity (≤10 drugs)',
  extreme_fills_per_patient: '🔄 Extreme fills per patient (>20/year)',
  high_fills_per_patient: '🔄 High fills per patient (>15/year)',
}

export default function FlaggedPage() {
  const highRisk = loadData('high-risk.json') as { npi: string; name: string; credentials: string; city: string; state: string; specialty: string; claims: number; cost: number; opioidRate: number; brandPct: number; costPerBene: number; riskScore: number; riskFlags: string[]; riskLevel: string; isExcluded: boolean }[]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Flagged Providers' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Flagged Providers</h1>
      <p className="text-gray-600 mb-2">
        {fmt(highRisk.length)} providers flagged by our multi-factor statistical model — {highRisk.filter(p => p.riskLevel === 'high').length} high-risk (score ≥50) and {fmt(highRisk.filter(p => p.riskLevel === 'elevated').length)} elevated (score ≥30). Scores combine specialty-adjusted peer comparison, population percentiles, drug combination analysis, and OIG exclusion matching.
      </p>
      <ShareButtons title="Flagged Medicare Part D Providers" />

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>⚠️ Important:</strong> Risk scores are statistical indicators based on publicly available prescribing data. They do not constitute allegations of fraud, abuse, or medical malpractice. Many flagged patterns have legitimate clinical explanations. <Link href="/methodology" className="underline">Read our methodology</Link>. Also see our <Link href="/ml-fraud-detection" className="text-primary underline font-medium">🤖 ML Fraud Detection</Link> — a machine learning model trained on confirmed fraud cases that identifies thousands of additional suspicious providers.
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
          <p className="text-2xl font-bold text-red-700">{highRisk.filter(p => p.riskLevel === 'high').length}</p>
          <p className="text-xs text-gray-600">High Risk (≥50)</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
          <p className="text-2xl font-bold text-orange-700">{fmt(highRisk.filter(p => p.riskLevel === 'elevated').length)}</p>
          <p className="text-xs text-gray-600">Elevated (≥30)</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
          <p className="text-2xl font-bold text-primary">{fmt(highRisk.filter(p => p.isExcluded).length)}</p>
          <p className="text-xs text-gray-600">LEIE Excluded</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
          <p className="text-2xl font-bold text-purple-700">{fmt(highRisk.filter(p => p.riskFlags?.includes('opioid_benzo_coprescriber')).length)}</p>
          <p className="text-xs text-gray-600">Opioid+Benzo</p>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-6">Showing top 200 by risk score. Use <Link href="/search" className="text-primary hover:underline">search</Link> to find specific providers.</p>

      <div className="mt-4 space-y-4">
        {highRisk.slice(0, 200).map(p => (
          <div key={p.npi} className="bg-white rounded-xl shadow-sm border border-red-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/providers/${p.npi}`} className="text-lg font-bold text-primary hover:underline">{p.name}</Link>
                  {p.credentials && <span className="text-sm text-gray-400">{p.credentials}</span>}
                  {p.isExcluded && <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-medium">EXCLUDED</span>}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{p.specialty} · {p.city}, {p.state}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm">
                  <span><strong>{fmt(p.claims)}</strong> claims</span>
                  <span><strong>{fmtMoney(p.cost)}</strong> drug cost</span>
                  {p.opioidRate > 0 && <span className="text-red-600"><strong>{p.opioidRate.toFixed(1)}%</strong> opioid rate</span>}
                  {p.brandPct > 0 && <span><strong>{p.brandPct.toFixed(0)}%</strong> brand</span>}
                  {p.costPerBene > 0 && <span><strong>{fmtMoney(p.costPerBene)}</strong>/patient</span>}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.riskFlags.map(f => (
                    <span key={f} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                      {FLAG_LABELS[f] || f}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 text-center">
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-red-700">{p.riskScore}</span>
                </div>
                <p className="text-xs text-red-600 mt-1">Risk Score</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
