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
  extreme_opioid: '🔴 Extreme opioid rate (99th percentile)',
  very_high_opioid: '🟠 Very high opioid rate (95th percentile)',
  high_opioid: '🟡 High opioid rate (90th percentile)',
  high_la_opioid: '💊 High long-acting opioid rate',
  elevated_la_opioid: '💊 Elevated long-acting opioid rate',
  extreme_cost: '💰 Extreme cost per beneficiary (99th pctile)',
  high_cost: '💰 High cost per beneficiary (95th pctile)',
  extreme_brand: '🏷️ Extreme brand-name prescribing (99th pctile)',
  high_brand: '🏷️ High brand-name prescribing (95th pctile)',
  high_antipsych_elderly: '⚠️ High antipsychotic prescribing to 65+',
  elevated_antipsych_elderly: '⚠️ Elevated antipsychotic prescribing to 65+',
  leie_excluded: '🚫 OIG Excluded (LEIE match)',
  high_volume_opioid: '📈 High-volume + high opioid combo',
}

export default function FlaggedPage() {
  const highRisk = loadData('high-risk.json') as { npi: string; name: string; credentials: string; city: string; state: string; specialty: string; claims: number; cost: number; opioidRate: number; brandPct: number; costPerBene: number; riskScore: number; riskFlags: string[]; riskLevel: string; isExcluded: boolean }[]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Flagged Providers' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Flagged Providers</h1>
      <p className="text-gray-600 mb-2">
        {highRisk.length} providers flagged as high-risk by our multi-factor statistical model. Risk scores are based on opioid prescribing outliers, cost anomalies, brand-name bias, antipsychotic prescribing to elderly patients, and OIG exclusion status.
      </p>
      <ShareButtons title="Flagged Medicare Part D Providers" />

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>⚠️ Important:</strong> Risk scores are statistical indicators based on publicly available prescribing data. They do not constitute allegations of fraud, abuse, or medical malpractice. Many flagged patterns have legitimate clinical explanations. <Link href="/methodology" className="underline">Read our methodology</Link>.
      </div>

      <div className="mt-8 space-y-4">
        {highRisk.map(p => (
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
