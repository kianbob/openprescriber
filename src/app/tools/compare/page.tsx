import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import CompareClient from './CompareClient'

export const metadata: Metadata = {
  title: 'Compare Medicare Providers Side-by-Side',
  description: 'Compare two Medicare Part D prescribers by NPI number. See side-by-side stats for claims, costs, opioid rates, risk scores, and prescribing flags.',
  alternates: { canonical: 'https://www.openprescriber.org/tools/compare' },
}

export default function ComparePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'Compare Providers' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Compare Providers</h1>
      <p className="text-gray-600 mb-2">
        Enter two NPI numbers to see a side-by-side comparison of prescribing patterns, costs, risk scores, and flags.
      </p>
      <ShareButtons title="Compare Medicare Providers Side-by-Side | OpenPrescriber" />
      <div className="mt-6">
        <CompareClient />
      </div>
    </div>
  )
}
