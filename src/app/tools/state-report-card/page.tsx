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
    </div>
  )
}
