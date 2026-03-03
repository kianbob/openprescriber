import Link from 'next/link'
import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { loadData } from '@/lib/server-utils'
import SpecialtyCompareClient from './SpecialtyCompareClient'

type Spec = { specialty: string; providers: number; claims: number; cost: number; opioidProv: number; avgOpioidRate: number; avgBrandPct: number; costPerProvider: number }

export const metadata: Metadata = {
  title: 'Compare Medical Specialties — Side-by-Side Medicare Prescribing',
  description: 'Compare 2-3 medical specialties side by side. See providers, costs, opioid rates, brand prescribing, and more in Medicare Part D.',
  alternates: { canonical: 'https://www.openprescriber.org/tools/specialty-comparison' },
  openGraph: {
    title: 'Specialty Comparison — OpenPrescriber',
    description: 'Compare medical specialties side by side on costs, opioid rates, and more.',
    url: 'https://www.openprescriber.org/tools/specialty-comparison',
    type: 'website',
  },
}

export default function SpecialtyComparisonPage() {
  const specialties = loadData('specialties.json') as Spec[]
  const sorted = [...specialties].sort((a, b) => a.specialty.localeCompare(b.specialty))

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'Specialty Comparison' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Compare Medical Specialties</h1>
      <p className="text-gray-600 mb-2">Select 2-3 medical specialties to compare prescribing patterns, costs, opioid rates, and brand-name prescribing side by side.</p>
      <ShareButtons title="Compare Medical Specialties" />

      <SpecialtyCompareClient specialties={sorted} />

      {/* You Might Also Like */}
      <section className="mt-12 border-t pt-8">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">You Might Also Like</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/tools/peer-lookup" className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-primary mb-1">Peer Comparison</h3>
            <p className="text-sm text-gray-600">Specialty benchmarks and percentiles</p>
          </Link>
          <Link href="/tools/savings-calculator" className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-primary mb-1">Savings Calculator</h3>
            <p className="text-sm text-gray-600">Generic savings potential by state</p>
          </Link>
          <Link href="/analysis/specialty-deep-dive" className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-primary mb-1">Specialty Deep Dive</h3>
            <p className="text-sm text-gray-600">Which specialties drive spending?</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
