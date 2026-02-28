import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import SearchClient from './SearchClient'

export const metadata: Metadata = {
  title: 'Search Medicare Part D Prescribers',
  description: 'Search 11,700+ Medicare Part D prescriber profiles by name, NPI, state, or specialty.',
  alternates: { canonical: 'https://www.openprescriber.org/search' },
}

export default function SearchPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Search' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-6">Search Prescribers</h1>
      <SearchClient />
    </div>
  )
}
