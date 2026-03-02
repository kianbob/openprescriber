import Link from 'next/link'
import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import StateReportClient from './StateReportClient'

export const metadata: Metadata = {
  title: 'State Report Card — Medicare Part D Prescribing Grades by State',
  description: 'Get a letter grade for your state\'s Medicare Part D prescribing patterns. Rankings for drug costs, opioid rates, and cost per patient.',
  alternates: { canonical: 'https://www.openprescriber.org/tools/state-report-card' },
}

export default function StateReportCardPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'State Report Card' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">State Report Card</h1>
      <p className="text-gray-600 mb-2">How does your state rank for Medicare Part D prescribing? Select a state to see its letter grade, national rankings, and opioid prescribing data.</p>
      <ShareButtons title="State Report Card — Medicare Part D" />
      <div className="mt-6">
        <StateReportClient />
      </div>

      {/* You Might Also Like */}
      <section className="mt-12 border-t pt-8">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">You Might Also Like</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/tools/city-lookup" className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-primary mb-1">City Lookup</h3>
            <p className="text-sm text-gray-600">Find prescribers in any city</p>
          </Link>
          <Link href="/tools/savings-calculator" className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-primary mb-1">Savings Calculator</h3>
            <p className="text-sm text-gray-600">Generic savings potential by state</p>
          </Link>
          <Link href="/analysis/state-rankings" className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-primary mb-1">State Rankings</h3>
            <p className="text-sm text-gray-600">All 50 states ranked on prescribing metrics</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
