import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import { StatesCostChart, SpecialtyCostChart, OpioidStateChart, RiskBreakdownChart, CostTrendChart, OpioidTrendChart, ProviderGrowthChart, TopDrugsCostChart, CostGrowthRateChart, SpecialtyOpioidChart } from './DashboardCharts'

export const metadata: Metadata = {
  title: 'Medicare Part D Dashboard — Interactive Charts',
  description: 'Interactive dashboard visualizing Medicare Part D prescribing data — drug costs by state, opioid rates, specialty breakdown, and risk analysis.',
  alternates: { canonical: 'https://www.openprescriber.org/dashboard' },
}

export default function DashboardPage() {
  const stats = loadData('stats.json')
  const REAL_STATES = new Set('AL,AK,AZ,AR,CA,CO,CT,DE,DC,FL,GA,HI,ID,IL,IN,IA,KS,KY,LA,ME,MD,MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ,NM,NY,NC,ND,OH,OK,OR,PA,PR,RI,SC,SD,TN,TX,UT,VT,VA,VI,WA,WV,WI,WY'.split(','))
  const states = (loadData('states.json') as { state: string; cost: number; avgOpioidRate: number }[]).filter(s => REAL_STATES.has(s.state))
  const specs = loadData('specialties.json') as { specialty: string; cost: number; avgOpioidRate: number }[]
  const drugs = loadData('drugs.json') as { generic: string; cost: number }[]

  const trends = loadData('yearly-trends.json') as { year: number; providers: number; claims: number; cost: number; opioidProv: number; opioidPct: number; highOpioid: number }[]

  const growthData = trends.slice(1).map((t, i) => ({
    year: t.year,
    growthRate: ((t.cost - trends[i].cost) / trends[i].cost) * 100,
  }))

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

      {/* 5-Year Trends */}
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5 border">
          <h2 className="text-lg font-bold mb-2">Drug Costs Over Time</h2>
          <p className="text-xs text-gray-500 mb-3">Total Medicare Part D spending, 2019–2023</p>
          <CostTrendChart data={trends} />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border">
          <h2 className="text-lg font-bold mb-2">Opioid Prescribing Trends</h2>
          <p className="text-xs text-gray-500 mb-3">Opioid prescribers and average rate, 2019–2023</p>
          <OpioidTrendChart data={trends} />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border">
          <h2 className="text-lg font-bold mb-2">Prescriber Growth</h2>
          <p className="text-xs text-gray-500 mb-3">Total providers in Medicare Part D, 2019–2023</p>
          <ProviderGrowthChart data={trends} />
        </div>
      </div>

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

      {/* Top Drugs + Cost Growth */}
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-xl shadow-sm p-5 border">
          <h2 className="text-lg font-bold mb-2">Top 10 Drugs by Cost</h2>
          <p className="text-xs text-gray-500 mb-3">Highest-cost drugs in Medicare Part D, 2023</p>
          <TopDrugsCostChart data={drugs.slice(0, 10)} />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border">
          <h2 className="text-lg font-bold mb-2">Cost Growth Rate</h2>
          <p className="text-xs text-gray-500 mb-3">Year-over-year % change in total drug spending</p>
          <CostGrowthRateChart data={growthData} />
        </div>
      </div>

      {/* Specialty Opioid Chart */}
      <div className="mt-8">
        <div className="bg-white rounded-xl shadow-sm p-5 border">
          <h2 className="text-lg font-bold mb-2">Top 15 Specialties by Opioid Prescribing Rate</h2>
          <p className="text-xs text-gray-500 mb-3">Average opioid prescribing rate by provider specialty</p>
          <SpecialtyOpioidChart data={[...specs].sort((a, b) => b.avgOpioidRate - a.avgOpioidRate).slice(0, 15)} />
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-3">Explore Our Analysis</h2>
        <p className="text-sm text-gray-700 mb-4">
          Dive deeper into the trends behind these numbers with our in-depth analysis articles.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/analysis/opioid-crisis" className="text-primary hover:underline font-medium">The Opioid Crisis in Numbers →</Link>
          <Link href="/analysis/cost-outliers" className="text-primary hover:underline font-medium">Cost Outliers →</Link>
          <Link href="/analysis/ozempic-effect" className="text-primary hover:underline font-medium">The Ozempic Effect →</Link>
          <Link href="/ml-fraud-detection" className="text-primary hover:underline font-medium">ML Fraud Detection →</Link>
        </div>
      </div>
    </div>
  )
}
