import Link from 'next/link'
import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { loadData } from '@/lib/server-utils'
import CityLookupClient from './CityLookupClient'

export const metadata: Metadata = {
  title: 'Provider Lookup by City — Find Medicare Prescribers in Any City',
  description: 'Search for Medicare Part D prescribers by city. See provider names, specialties, claims, costs, and risk levels for any U.S. city.',
  alternates: { canonical: 'https://www.openprescriber.org/tools/city-lookup' },
  openGraph: {
    title: 'City Lookup — OpenPrescriber',
    description: 'Search for Medicare Part D prescribers by city.',
    url: 'https://www.openprescriber.org/tools/city-lookup',
    type: 'website',
  },
}

export default function CityLookupPage() {
  const providers = loadData('provider-index.json') as { city: string; state: string }[]
  const citySet = new Set<string>()
  for (const p of providers) {
    if (p.city && p.state) citySet.add(`${p.city}, ${p.state}`)
  }
  const cities = [...citySet].sort()

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'City Lookup' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Provider Lookup by City</h1>
      <p className="text-gray-600 mb-2">Search for Medicare Part D prescribers in any U.S. city. See provider names, specialties, prescribing volumes, costs, and risk levels.</p>
      <ShareButtons title="Provider Lookup by City" />

      <CityLookupClient cities={cities} />

      <div className="mt-10 bg-blue-50 rounded-xl p-5 border border-blue-200">
        <h2 className="font-bold text-sm mb-2">About this tool</h2>
        <p className="text-sm text-gray-700">
          This tool searches {cities.length.toLocaleString()} cities across all U.S. states and territories. Data covers Medicare Part D prescribers with 10+ claims in 2023. Results are sortable by name, specialty, claims, cost, and risk level.
        </p>
      </div>

      {/* You Might Also Like */}
      <section className="mt-12 border-t pt-8">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">You Might Also Like</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/tools/drug-lookup" className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-primary mb-1">Drug Lookup</h3>
            <p className="text-sm text-gray-600">Search drug costs and Medicare spending data</p>
          </Link>
          <Link href="/tools/peer-lookup" className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-primary mb-1">Peer Comparison</h3>
            <p className="text-sm text-gray-600">Compare providers against specialty benchmarks</p>
          </Link>
          <Link href="/analysis/geographic-disparities" className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-primary mb-1">Geographic Disparities</h3>
            <p className="text-sm text-gray-600">How location shapes prescribing patterns</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
