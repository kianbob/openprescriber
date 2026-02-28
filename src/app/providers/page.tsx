import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import ProvidersClient from './ProvidersClient'

export const metadata: Metadata = {
  title: 'Medicare Part D Provider Directory',
  description: 'Browse and search Medicare Part D prescribers with risk scores, opioid rates, and prescribing data.',
  alternates: { canonical: 'https://www.openprescriber.org/providers' },
}

export default function ProvidersPage() {
  const providers = loadData('provider-index.json') as { npi: string; name: string; city: string; state: string; specialty: string; claims: number; cost: number; riskLevel: string }[]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Providers' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Provider Directory</h1>
      <p className="text-gray-600 mb-4">{fmt(providers.length)} Medicare Part D prescribers with detailed profiles, risk scores, and peer comparisons.</p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
        <p className="text-sm text-blue-800">Looking for a specific provider? Use our search to find by name, NPI, city, or specialty.</p>
        <Link href="/search" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 whitespace-nowrap ml-4">Search Providers</Link>
      </div>

      <ProvidersClient providers={providers} />
    </div>
  )
}
