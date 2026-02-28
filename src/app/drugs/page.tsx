import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import { loadData } from '@/lib/server-utils'
import DrugsClient from './DrugsClient'

export const metadata: Metadata = {
  title: 'Top 500 Medicare Part D Drugs by Cost',
  description: 'The most expensive drugs in Medicare Part D — ranked by total cost, with claims data and cost-per-claim analysis.',
  alternates: { canonical: 'https://www.openprescriber.org/drugs' },
}

export default function DrugsPage() {
  const drugs = loadData('drugs.json') as { generic: string; brand: string; claims: number; cost: number; benes: number; providers: number; costPerClaim: number }[]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Top Drugs' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Top 500 Medicare Part D Drugs</h1>
      <p className="text-gray-600 mb-6">Ranked by total drug cost paid by Medicare Part D in 2023.</p>
      <DrugsClient drugs={drugs} />
    </div>
  )
}
