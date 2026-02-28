import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import RiskCalcClient from './RiskCalcClient'

export const metadata: Metadata = {
  title: 'Risk Score Calculator — Estimate Medicare Prescriber Risk',
  description: 'Enter prescribing metrics to calculate a risk score using our 10-component model. See how opioid rates, costs, and other factors contribute to risk scores.',
  alternates: { canonical: 'https://www.openprescriber.org/tools/risk-calculator' },
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
    </div>
  )
}
