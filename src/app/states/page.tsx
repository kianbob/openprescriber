import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import { loadData } from '@/lib/server-utils'
import StatesClient from './StatesClient'

export const metadata: Metadata = {
  title: 'Medicare Part D Prescribing by State',
  description: 'Compare Medicare Part D prescribing patterns, drug costs, and opioid rates across all 60 U.S. states and territories.',
  alternates: { canonical: 'https://www.openprescriber.org/states' },
}

export default function StatesPage() {
  const states = loadData('states.json') as { state: string; providers: number; claims: number; cost: number; benes: number; opioidProv: number; highOpioid: number; avgOpioidRate: number; costPerBene: number }[]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'States' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Medicare Part D Prescribing by State</h1>
      <p className="text-gray-600 mb-6">Drug costs, prescriber counts, and opioid prescribing rates for all {states.length} states and territories.</p>
      <StatesClient states={states} />
    </div>
  )
}
