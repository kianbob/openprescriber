import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import StatesClient from './StatesClient'
import DataFreshness from '@/components/DataFreshness'

export const metadata: Metadata = {
  title: 'Medicare Part D Prescribing by State',
  description: 'Compare Medicare Part D prescribing patterns, drug costs, and opioid rates across all 60 U.S. states and territories.',
  alternates: { canonical: 'https://www.openprescriber.org/states' },
  openGraph: {
    title: 'Medicare Part D Prescribing by State',
    description: 'Compare prescribing patterns, drug costs, and opioid rates across all U.S. states and territories.',
    url: 'https://www.openprescriber.org/states',
    type: 'website',
  },
}

export default function StatesPage() {
  const states = loadData('states.json') as { state: string; providers: number; claims: number; cost: number; benes: number; opioidProv: number; highOpioid: number; avgOpioidRate: number; costPerBene: number }[]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.openprescriber.org' },
            { '@type': 'ListItem', position: 2, name: 'States', item: 'https://www.openprescriber.org/states' },
          ],
        }) }}
      />
      <Breadcrumbs items={[{ label: 'States' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Medicare Part D Prescribing by State</h1>
      <p className="text-gray-600 mb-4">Drug costs, prescriber counts, and opioid prescribing rates for all {states.length} states and territories.</p>
      <DataFreshness />

      {(() => {
        const REAL = new Set('AL,AK,AZ,AR,CA,CO,CT,DE,DC,FL,GA,HI,ID,IL,IN,IA,KS,KY,LA,ME,MD,MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ,NM,NY,NC,ND,OH,OK,OR,PA,PR,RI,SC,SD,TN,TX,UT,VT,VA,VI,WA,WV,WI,WY'.split(','))
        const real = states.filter(s => REAL.has(s.state))
        const totalCost = real.reduce((a, s) => a + s.cost, 0)
        const totalProv = real.reduce((a, s) => a + s.providers, 0)
        const worst = [...real].sort((a, b) => b.avgOpioidRate - a.avgOpioidRate)[0]
        const best = [...real].sort((a, b) => a.avgOpioidRate - b.avgOpioidRate)[0]
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border text-center">
              <p className="text-xl font-bold text-primary">{fmt(totalProv)}</p>
              <p className="text-xs text-gray-500">Total Prescribers</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border text-center">
              <p className="text-xl font-bold text-primary">{fmtMoney(totalCost)}</p>
              <p className="text-xs text-gray-500">Total Drug Costs</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border text-center">
              <p className="text-xl font-bold text-red-600">{(worst.avgOpioidRate ?? 0).toFixed(1)}%</p>
              <p className="text-xs text-gray-500">Highest Opioid Rate ({worst.state})</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border text-center">
              <p className="text-xl font-bold text-green-600">{(best.avgOpioidRate ?? 0).toFixed(1)}%</p>
              <p className="text-xs text-gray-500">Lowest Opioid Rate ({best.state})</p>
            </div>
          </div>
        )
      })()}

      <StatesClient states={states} />

      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-3">Related Analysis</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <Link href="/analysis/state-rankings" className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-sm">State Rankings</h3>
            <p className="text-xs text-gray-500 mt-1">Best and worst states for prescribing patterns.</p>
          </Link>
          <Link href="/analysis/geographic-disparities" className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-sm">🌎 Geographic Disparities</h3>
            <p className="text-xs text-gray-500 mt-1">State-level spending and opioid variations.</p>
          </Link>
          <Link href="/tools/state-report-card" className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-sm">State Report Card</h3>
            <p className="text-xs text-gray-500 mt-1">Grade your state&apos;s prescribing patterns.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
