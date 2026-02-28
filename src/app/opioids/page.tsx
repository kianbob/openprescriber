import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import OpioidClient from './OpioidClient'

export const metadata: Metadata = {
  title: 'Opioid Prescribing in Medicare Part D: Complete Analysis',
  description: 'Which doctors prescribe the most opioids? State-by-state analysis of opioid prescribing rates, long-acting opioids, and high-volume prescribers in Medicare Part D.',
  alternates: { canonical: 'https://www.openprescriber.org/opioids' },
}

export default function OpioidsPage() {
  const stats = loadData('stats.json')
  const opioidByState = loadData('opioid-by-state.json') as { state: string; providers: number; opioidProv: number; highOpioid: number; opioidClaims: number; avgOpioidRate: number; opioidPct: number }[]
  const topOpioid = (loadData('top-opioid.json') as { npi: string; name: string; credentials: string; city: string; state: string; specialty: string; opioidRate: number; opioidClaims: number; claims: number; riskLevel: string }[]).filter(p => p.claims >= 100)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Opioid Prescribing' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Opioid Prescribing in Medicare Part D</h1>
      <p className="text-gray-600 mb-2">A complete analysis of opioid prescribing patterns across {fmt(stats.providers)} Medicare Part D prescribers in 2023.</p>
      <ShareButtons title="Opioid Prescribing in Medicare Part D" />

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Opioid Prescribers', value: fmt(stats.opioidProv), color: 'text-red-600' },
          { label: 'High Rate (>20%)', value: fmt(stats.highOpioid), color: 'text-red-700' },
          { label: '% of All Prescribers', value: ((stats.opioidProv / stats.providers) * 100).toFixed(1) + '%', color: 'text-orange-600' },
          { label: 'Total Prescribers', value: fmt(stats.providers), color: 'text-primary' },
        ].map(t => (
          <div key={t.label} className="bg-white rounded-xl shadow-sm p-4 border text-center">
            <p className={`text-2xl font-bold ${t.color}`}>{t.value}</p>
            <p className="text-sm text-gray-600 mt-1">{t.label}</p>
          </div>
        ))}
      </div>

      <OpioidClient opioidByState={opioidByState} topOpioid={topOpioid} />
    </div>
  )
}
