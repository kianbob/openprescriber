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
    </div>
  )
}
