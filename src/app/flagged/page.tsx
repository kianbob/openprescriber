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
  openGraph: {
    title: 'Flagged High-Risk Providers',
    url: 'https://www.openprescriber.org/flagged',
    type: 'website',
  },
}

export default function FlaggedPage() {
  const highRisk = loadData('high-risk.json') as { npi: string; name: string; credentials: string; city: string; state: string; specialty: string; claims: number; cost: number; opioidRate: number; brandPct: number; costPerBene: number; riskScore: number; riskFlags: string[]; riskLevel: string; isExcluded: boolean }[]

  const highCount = highRisk.filter(p => p.riskScore >= 50).length
  const elevatedCount = highRisk.filter(p => p.riskScore >= 30 && p.riskScore < 50).length

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.openprescriber.org' },
            { '@type': 'ListItem', position: 2, name: 'Flagged Providers', item: 'https://www.openprescriber.org/flagged' },
          ],
        }) }}
      />
      <Breadcrumbs items={[{ label: 'Flagged Providers' }]} />
      <DisclaimerBanner variant="risk" />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Flagged Providers</h1>
      <p className="text-gray-600 mb-2">
        {fmt(highRisk.length)} providers flagged by our multi-factor statistical model — {highCount} high-risk (score ≥50) and {fmt(elevatedCount)} elevated (score ≥30). Scores combine specialty-adjusted peer comparison, population percentiles, drug combination analysis, and OIG exclusion matching.
      </p>
      <ShareButtons title="Flagged Medicare Part D Providers" />

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>⚠️ Important:</strong> Risk scores are statistical indicators based on publicly available prescribing data. They do not constitute allegations of fraud, abuse, or medical malpractice. Many flagged patterns have legitimate clinical explanations. <Link href="/methodology" className="underline">Read our methodology</Link>. Also see our <Link href="/ml-fraud-detection" className="text-primary underline font-medium">ML Fraud Detection</Link> — a machine learning model trained on confirmed fraud cases.
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

      {/* Related Analysis */}
      <section className="mt-12">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">Related Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/analysis/fraud-risk-methodology" className="bg-white rounded-xl shadow-sm p-5 border hover:border-primary transition-colors">
            <h3 className="font-semibold text-gray-900 mb-1">📋 Fraud Risk Methodology</h3>
            <p className="text-sm text-gray-600">How our multi-factor risk scoring model identifies statistical outliers in prescribing data.</p>
          </Link>
          <Link href="/ml-fraud-detection" className="bg-white rounded-xl shadow-sm p-5 border hover:border-primary transition-colors">
            <h3 className="font-semibold text-gray-900 mb-1">ML Fraud Detection</h3>
            <p className="text-sm text-gray-600">Machine learning model trained on confirmed fraud cases to identify similar prescribing patterns.</p>
          </Link>
          <Link href="/analysis/pill-mills" className="bg-white rounded-xl shadow-sm p-5 border hover:border-primary transition-colors">
            <h3 className="font-semibold text-gray-900 mb-1">💊 Pill Mill Analysis</h3>
            <p className="text-sm text-gray-600">Identifying providers with prescribing patterns consistent with pill mill operations.</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
