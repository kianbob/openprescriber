import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import FlaggedClient from './FlaggedClient'

export const metadata: Metadata = {
  title: 'Flagged Providers: Medicare Part D Risk Analysis',
  description: 'Providers flagged by our multi-factor risk scoring model — opioid outliers, cost anomalies, brand-name bias, and OIG exclusion matches.',
  alternates: { canonical: 'https://www.openprescriber.org/flagged' },
}

export default function FlaggedPage() {
  const highRisk = loadData('high-risk.json') as { npi: string; name: string; credentials: string; city: string; state: string; specialty: string; claims: number; cost: number; opioidRate: number; brandPct: number; costPerBene: number; riskScore: number; riskFlags: string[]; riskLevel: string; isExcluded: boolean }[]

  const highCount = highRisk.filter(p => p.riskScore >= 50).length
  const elevatedCount = highRisk.filter(p => p.riskScore >= 30 && p.riskScore < 50).length

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Flagged Providers' }]} />
      <DisclaimerBanner variant="risk" />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Flagged Providers</h1>
      <p className="text-gray-600 mb-2">
        {fmt(highRisk.length)} providers flagged by our multi-factor statistical model — {highCount} high-risk (score ≥50) and {fmt(elevatedCount)} elevated (score ≥30). Scores combine specialty-adjusted peer comparison, population percentiles, drug combination analysis, and OIG exclusion matching.
      </p>
      <ShareButtons title="Flagged Medicare Part D Providers" />

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>⚠️ Important:</strong> Risk scores are statistical indicators based on publicly available prescribing data. They do not constitute allegations of fraud, abuse, or medical malpractice. Many flagged patterns have legitimate clinical explanations. <Link href="/methodology" className="underline">Read our methodology</Link>. Also see our <Link href="/ml-fraud-detection" className="text-primary underline font-medium">🤖 ML Fraud Detection</Link> — a machine learning model trained on confirmed fraud cases.
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
          <p className="text-2xl font-bold text-red-700">{highCount}</p>
          <p className="text-xs text-gray-600">High Risk (≥50)</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
          <p className="text-2xl font-bold text-orange-700">{fmt(elevatedCount)}</p>
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

      <FlaggedClient providers={highRisk.slice(0, 500)} />
    </div>
  )
}
