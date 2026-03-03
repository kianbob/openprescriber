import Link from 'next/link'
import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import CompareClient from './CompareClient'

export const metadata: Metadata = {
  title: 'Compare Medicare Providers Side-by-Side',
  description: 'Compare two Medicare Part D prescribers by NPI number. See side-by-side stats for claims, costs, opioid rates, risk scores, and prescribing flags.',
  alternates: { canonical: 'https://www.openprescriber.org/tools/compare' },
  openGraph: {
    title: 'Compare Providers — OpenPrescriber',
    description: 'Side-by-side comparison of two Medicare Part D prescribers.',
    url: 'https://www.openprescriber.org/tools/compare',
    type: 'website',
  },
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

      {/* You Might Also Like */}
      <section className="mt-12 border-t pt-8">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">You Might Also Like</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/tools/risk-calculator" className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-primary mb-1">Risk Calculator</h3>
            <p className="text-sm text-gray-600">See how our 10-component risk model works</p>
          </Link>
          <Link href="/tools/peer-lookup" className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-primary mb-1">Peer Comparison</h3>
            <p className="text-sm text-gray-600">Look up specialty benchmarks and percentiles</p>
          </Link>
          <Link href="/analysis/fraud-risk-methodology" className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-primary mb-1">Risk Methodology</h3>
            <p className="text-sm text-gray-600">How we score prescribing risk</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
