import Link from 'next/link'
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

      {/* You Might Also Like */}
      <section className="mt-12 border-t pt-8">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">You Might Also Like</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/tools/savings-calculator" className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-primary mb-1">Savings Calculator</h3>
            <p className="text-sm text-gray-600">How much could Medicare save with generics?</p>
          </Link>
          <Link href="/analysis/top-drugs-analysis" className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-primary mb-1">Top Drugs Analysis</h3>
            <p className="text-sm text-gray-600">The drugs costing Medicare billions</p>
          </Link>
          <Link href="/analysis/brand-generic-gap" className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-primary mb-1">Brand vs Generic Gap</h3>
            <p className="text-sm text-gray-600">Why some providers still prefer brands</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
