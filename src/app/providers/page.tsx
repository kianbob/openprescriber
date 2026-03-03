import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { fmt, fmtMoney } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import ProvidersClient from './ProvidersClient'
import DataFreshness from '@/components/DataFreshness'

export const metadata: Metadata = {
  title: 'Medicare Part D Provider Directory',
  description: 'Browse and search Medicare Part D prescribers with risk scores, opioid rates, and prescribing data.',
  alternates: { canonical: 'https://www.openprescriber.org/providers' },
  openGraph: {
    title: 'Medicare Part D Providers',
    url: 'https://www.openprescriber.org/providers',
    type: 'website',
  },
}

export default function ProvidersPage() {
  const providers = loadData('provider-index.json') as { npi: string; name: string; city: string; state: string; specialty: string; claims: number; cost: number; riskLevel: string }[]
  const stats = loadData('stats.json') as { providers: number; cost: number; avgClaimsPerProvider: number; riskCounts: { high: number; elevated: number } }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.openprescriber.org' },
            { '@type': 'ListItem', position: 2, name: 'Providers', item: 'https://www.openprescriber.org/providers' },
          ],
        }) }}
      />
      <Breadcrumbs items={[{ label: 'Providers' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Provider Directory</h1>
      <p className="text-gray-600 mb-4">{fmt(providers.length)} Medicare Part D prescribers with detailed profiles, risk scores, and peer comparisons.</p>
      <DataFreshness />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 text-center border">
          <p className="text-2xl font-bold text-primary">{fmt(stats.providers ?? 0)}</p>
          <p className="text-xs text-gray-600">Total Providers</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center border">
          <p className="text-2xl font-bold text-primary">{fmtMoney(stats.cost ?? 0)}</p>
          <p className="text-xs text-gray-600">Total Drug Costs</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center border">
          <p className="text-2xl font-bold text-primary">{fmt(Math.round(stats.avgClaimsPerProvider ?? 0))}</p>
          <p className="text-xs text-gray-600">Avg Claims/Provider</p>
        </div>
        <div className="bg-red-50 rounded-xl shadow-sm p-4 text-center border border-red-200">
          <p className="text-2xl font-bold text-red-700">{fmt((stats.riskCounts?.high ?? 0) + (stats.riskCounts?.elevated ?? 0))}</p>
          <p className="text-xs text-gray-600">Total Flagged</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
        <p className="text-sm text-blue-800">Looking for a specific provider? Use our search to find by name, NPI, city, or specialty.</p>
        <Link href="/search" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 whitespace-nowrap ml-4">Search Providers</Link>
      </div>

      <ProvidersClient providers={providers} />
    </div>
  )
}
