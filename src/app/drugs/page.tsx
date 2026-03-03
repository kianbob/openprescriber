import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import DrugsClient from './DrugsClient'
import DataFreshness from '@/components/DataFreshness'

export const metadata: Metadata = {
  title: 'Top 500 Medicare Part D Drugs by Cost',
  description: 'The most expensive drugs in Medicare Part D — ranked by total cost, with claims data and cost-per-claim analysis.',
  alternates: { canonical: 'https://www.openprescriber.org/drugs' },
  openGraph: {
    title: 'Top 500 Medicare Part D Drugs by Cost',
    description: 'The most expensive drugs in Medicare Part D — ranked by total cost, with claims data and cost-per-claim analysis.',
    url: 'https://www.openprescriber.org/drugs',
    type: 'website',
  },
}

export default function DrugsPage() {
  const drugs = loadData('drugs.json') as { generic: string; brand: string; claims: number; cost: number; benes: number; providers: number; costPerClaim: number }[]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.openprescriber.org' },
            { '@type': 'ListItem', position: 2, name: 'Drugs', item: 'https://www.openprescriber.org/drugs' },
          ],
        }) }}
      />
      <Breadcrumbs items={[{ label: 'Top Drugs' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Top 500 Medicare Part D Drugs</h1>
      <p className="text-gray-600 mb-4">Ranked by total drug cost paid by Medicare Part D in 2023.</p>
      <DataFreshness />

      {(() => {
        const totalCost = drugs.reduce((a, d) => a + d.cost, 0)
        const totalClaims = drugs.reduce((a, d) => a + d.claims, 0)
        const top10cost = drugs.slice(0, 10).reduce((a, d) => a + d.cost, 0)
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border text-center">
              <p className="text-xl font-bold text-primary">500</p>
              <p className="text-xs text-gray-500">Drugs Tracked</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border text-center">
              <p className="text-xl font-bold text-primary">{fmtMoney(totalCost)}</p>
              <p className="text-xs text-gray-500">Total Drug Costs</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border text-center">
              <p className="text-xl font-bold text-primary">{fmt(totalClaims)}</p>
              <p className="text-xs text-gray-500">Total Claims</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border text-center">
              <p className="text-xl font-bold text-red-600">{((top10cost / totalCost) * 100).toFixed(0)}%</p>
              <p className="text-xs text-gray-500">Top 10 Share of Cost</p>
            </div>
          </div>
        )
      })()}

      <DrugsClient drugs={drugs} />

      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-3">Related Analysis</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <Link href="/analysis/top-drugs-analysis" className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-sm">Drugs That Cost Billions</h3>
            <p className="text-xs text-gray-500 mt-1">Deep dive into the top 20 most expensive drugs.</p>
          </Link>
          <Link href="/analysis/ozempic-effect" className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-sm">💉 The Ozempic Effect</h3>
            <p className="text-xs text-gray-500 mt-1">GLP-1 drugs reshaping Medicare spending.</p>
          </Link>
          <Link href="/tools/drug-lookup" className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-sm">Drug Lookup Tool</h3>
            <p className="text-xs text-gray-500 mt-1">Search for any drug by name.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
