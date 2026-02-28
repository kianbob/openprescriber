import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import SearchClient from './SearchClient'

export const metadata: Metadata = {
  title: 'Search Medicare Part D Prescribers',
  description: 'Search 19,300+ Medicare Part D prescriber profiles by name, NPI, state, or specialty.',
  alternates: { canonical: 'https://www.openprescriber.org/search' },
}

export default function SearchPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Search' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Search Prescribers</h1>
      <p className="text-gray-600 mb-6">Look up any of 19,300+ Medicare Part D prescribers with detailed profiles, risk scores, and prescribing data.</p>
      <SearchClient />
      <div className="mt-8 bg-gray-50 rounded-xl p-5 border text-sm text-gray-600">
        <h2 className="font-semibold text-gray-800 mb-2">Search Tips</h2>
        <ul className="space-y-1 list-disc list-inside">
          <li>Search by <strong>provider name</strong> (e.g., &quot;Smith&quot;)</li>
          <li>Search by <strong>NPI number</strong> (e.g., &quot;1234567890&quot;)</li>
          <li>Search by <strong>city or state</strong> (e.g., &quot;Houston&quot; or &quot;TX&quot;)</li>
          <li>Search by <strong>specialty</strong> (e.g., &quot;Cardiology&quot;)</li>
          <li>Only providers flagged for risk or high-volume prescribing have detailed profiles</li>
        </ul>
      </div>
    </div>
  )
}
