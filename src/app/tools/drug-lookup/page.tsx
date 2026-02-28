import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import DrugLookupClient from './DrugLookupClient'

export const metadata: Metadata = {
  title: 'Drug Cost Lookup — Search Medicare Part D Drug Prices & Spending',
  description: 'Look up any prescription drug to see its total Medicare Part D cost, number of claims, patients, and cost per prescription.',
  alternates: { canonical: 'https://www.openprescriber.org/tools/drug-lookup' },
}

export default function DrugLookupPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'Drug Lookup' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Drug Cost Lookup</h1>
      <p className="text-gray-600 mb-2">Search 500 of the most expensive drugs in Medicare Part D. See total cost, claims, patients, and per-prescription costs.</p>
      <ShareButtons title="Drug Cost Lookup — Medicare Part D" />
      <div className="mt-6">
        <DrugLookupClient />
      </div>
    </div>
  )
}
