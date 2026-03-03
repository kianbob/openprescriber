import Link from 'next/link'
import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import RiskCalcClient from './RiskCalcClient'

export const metadata: Metadata = {
  title: 'Risk Score Calculator — Estimate Medicare Prescriber Risk',
  description: 'Enter prescribing metrics to calculate a risk score using our 10-component model. See how opioid rates, costs, and other factors contribute to risk scores.',
  alternates: { canonical: 'https://www.openprescriber.org/tools/risk-calculator' },
  openGraph: {
    title: 'Risk Score Calculator — OpenPrescriber',
    description: 'Calculate Medicare Part D prescribing risk scores using our 10-component model.',
    url: 'https://www.openprescriber.org/tools/risk-calculator',
    type: 'website',
  },
}

export default function RiskCalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'Risk Calculator' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Risk Score Calculator</h1>
      <p className="text-gray-600 mb-2">Enter prescribing metrics to see how our risk scoring model would evaluate a provider. This simplified calculator demonstrates the methodology behind our 10-component scoring system.</p>
      <ShareButtons title="Risk Score Calculator — OpenPrescriber" />
      <div className="mt-6">
        <RiskCalcClient />
      </div>

      {/* You Might Also Like */}
      <section className="mt-12 border-t pt-8">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">You Might Also Like</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/tools/compare" className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-primary mb-1">Compare Providers</h3>
            <p className="text-sm text-gray-600">Side-by-side provider comparison</p>
          </Link>
          <Link href="/tools/peer-lookup" className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-primary mb-1">Peer Comparison</h3>
            <p className="text-sm text-gray-600">Look up specialty benchmarks</p>
          </Link>
          <Link href="/analysis/fraud-risk-methodology" className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-primary mb-1">Risk Methodology</h3>
            <p className="text-sm text-gray-600">Our 10-component scoring model explained</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
