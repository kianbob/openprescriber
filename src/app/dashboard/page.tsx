import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import { StatesCostChart, SpecialtyCostChart, OpioidStateChart, RiskBreakdownChart } from './DashboardCharts'

export const metadata: Metadata = {
  title: 'Medicare Part D Dashboard — Interactive Charts',
  description: 'Interactive dashboard visualizing Medicare Part D prescribing data — drug costs by state, opioid rates, specialty breakdown, and risk analysis.',
  alternates: { canonical: 'https://www.openprescriber.org/dashboard' },
}

export default function DashboardPage() {
  const stats = loadData('stats.json')
  const states = loadData('states.json') as { state: string; cost: number; avgOpioidRate: number }[]
  const specs = loadData('specialties.json') as { specialty: string; cost: number }[]

  const riskData = [
    { level: 'High', count: stats.riskCounts.high },
    { level: 'Elevated', count: stats.riskCounts.elevated },
    { level: 'Moderate', count: stats.riskCounts.moderate },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Medicare Part D Dashboard</h1>
      <p className="text-gray-600 mb-8">Interactive overview of prescribing patterns across {fmt(stats.providers)} providers and {fmtMoney(stats.cost)} in drug costs.</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-5 border">
          <h2 className="text-lg font-bold mb-4">Drug Costs by State (Top 15)</h2>
          <StatesCostChart data={states} />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border">
          <h2 className="text-lg font-bold mb-4">Drug Costs by Specialty (Top 10)</h2>
          <SpecialtyCostChart data={specs} />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border">
          <h2 className="text-lg font-bold mb-4">Opioid Prescribing Rate by State</h2>
          <OpioidStateChart data={[...states].sort((a, b) => b.avgOpioidRate - a.avgOpioidRate)} />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border">
          <h2 className="text-lg font-bold mb-4">Risk Score Distribution</h2>
          <RiskBreakdownChart data={riskData} />
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>{fmt(stats.riskCounts.high)} high risk · {fmt(stats.riskCounts.elevated)} elevated · {fmt(stats.riskCounts.moderate)} moderate</p>
          </div>
        </div>
      </div>
    </div>
  )
}
