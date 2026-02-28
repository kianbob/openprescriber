import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import { loadData } from '@/lib/server-utils'
import SpecialtiesClient from './SpecialtiesClient'

export const metadata: Metadata = {
  title: 'Medicare Part D Prescribing by Specialty',
  description: 'Compare prescribing patterns across 156 medical specialties — opioid rates, drug costs, brand vs generic preferences.',
  alternates: { canonical: 'https://www.openprescriber.org/specialties' },
}

export default function SpecialtiesPage() {
  const specs = loadData('specialties.json') as { specialty: string; providers: number; claims: number; cost: number; opioidProv: number; avgOpioidRate: number; avgBrandPct: number; costPerProvider: number }[]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Specialties' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Prescribing by Specialty</h1>
      <p className="text-gray-600 mb-6">{specs.length} medical specialties ranked by number of Medicare Part D prescribers.</p>
      <SpecialtiesClient specs={specs} />
    </div>
  )
}
