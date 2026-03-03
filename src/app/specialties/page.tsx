import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import SpecialtiesClient from './SpecialtiesClient'
import DataFreshness from '@/components/DataFreshness'

export const metadata: Metadata = {
  title: 'Medicare Part D Prescribing by Specialty',
  description: 'Compare prescribing patterns across 156 medical specialties — opioid rates, drug costs, brand vs generic preferences.',
  alternates: { canonical: 'https://www.openprescriber.org/specialties' },
  openGraph: {
    title: 'Medicare Part D Prescribing by Specialty',
    url: 'https://www.openprescriber.org/specialties',
    type: 'website',
  },
}

export default function SpecialtiesPage() {
  const specs = loadData('specialties.json') as { specialty: string; providers: number; claims: number; cost: number; opioidProv: number; avgOpioidRate: number; avgBrandPct: number; costPerProvider: number }[]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.openprescriber.org' },
            { '@type': 'ListItem', position: 2, name: 'Specialties', item: 'https://www.openprescriber.org/specialties' },
          ],
        }) }}
      />
      <Breadcrumbs items={[{ label: 'Specialties' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Prescribing by Specialty</h1>
      <p className="text-gray-600 mb-4">{specs.length} medical specialties ranked by number of Medicare Part D prescribers.</p>
      <DataFreshness />

      {(() => {
        const worstOpioid = [...specs].sort((a, b) => b.avgOpioidRate - a.avgOpioidRate)[0]
        const highestCost = [...specs].sort((a, b) => b.cost - a.cost)[0]
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border text-center">
              <p className="text-xl font-bold text-primary">{specs.length}</p>
              <p className="text-xs text-gray-500">Specialties</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border text-center">
              <p className="text-xl font-bold text-primary">{fmtMoney(specs.reduce((a, s) => a + s.cost, 0))}</p>
              <p className="text-xs text-gray-500">Total Drug Costs</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border text-center">
              <p className="text-xl font-bold text-red-600">{worstOpioid.specialty}</p>
              <p className="text-xs text-gray-500">Highest Opioid Rate ({(worstOpioid.avgOpioidRate ?? 0).toFixed(1)}%)</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border text-center">
              <p className="text-xl font-bold text-primary truncate">{highestCost.specialty}</p>
              <p className="text-xs text-gray-500">Most Costly ({fmtMoney(highestCost.cost)})</p>
            </div>
          </div>
        )
      })()}

      <SpecialtiesClient specs={specs} />

      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-3">Related Analysis</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <Link href="/analysis/specialty-deep-dive" className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-sm">Specialty Deep Dive</h3>
            <p className="text-xs text-gray-500 mt-1">Which specialties drive the most drug spending?</p>
          </Link>
          <Link href="/analysis/nurse-practitioners" className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-sm">👩‍⚕️ Nurse Practitioners</h3>
            <p className="text-xs text-gray-500 mt-1">The most flagged prescriber group.</p>
          </Link>
          <Link href="/tools/specialty-comparison" className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-sm">Compare Specialties</h3>
            <p className="text-xs text-gray-500 mt-1">Side-by-side specialty comparison.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
