import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'
import RelatedAnalysis from '@/components/RelatedAnalysis'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import { stateName } from '@/lib/state-names'

type StateData = { state: string; providers: number; claims: number; cost: number; benes: number; opioidProv: number; highOpioid: number; opioidClaims: number; avgOpioidRate: number; costPerBene: number }
type HighRisk = { npi: string; state: string }

export const metadata: Metadata = {
  title: 'State-by-State Medicare Prescribing Rankings — Deep Dive Analysis',
  description: 'Ranking all 50 states and territories across Medicare Part D metrics: drug costs, opioid rates, cost per beneficiary, and flagged providers.',
  alternates: { canonical: 'https://www.openprescriber.org/analysis/state-rankings' },
}

export default function StateRankingsPage() {
  const states = loadData('states.json') as StateData[]
  const highRisk = loadData('high-risk.json') as HighRisk[]

  const REAL_STATES = new Set('AL,AK,AZ,AR,CA,CO,CT,DE,DC,FL,GA,HI,ID,IL,IN,IA,KS,KY,LA,ME,MD,MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ,NM,NY,NC,ND,OH,OK,OR,PA,RI,SC,SD,TN,TX,UT,VT,VA,WA,WV,WI,WY'.split(','))
  const realStates = states.filter(s => REAL_STATES.has(s.state))

  // Count flagged per state
  const flaggedByState: Record<string, number> = {}
  for (const p of highRisk) {
    flaggedByState[p.state] = (flaggedByState[p.state] || 0) + 1
  }

  // Rankings
  const byProviders = [...realStates].sort((a, b) => b.providers - a.providers).slice(0, 5)
  const byCost = [...realStates].sort((a, b) => b.cost - a.cost).slice(0, 5)
  const byOpioidRate = [...realStates].sort((a, b) => b.avgOpioidRate - a.avgOpioidRate).slice(0, 5)
  const byCostPerBene = [...realStates].sort((a, b) => b.costPerBene - a.costPerBene).slice(0, 5)
  const byFlagged = [...realStates].sort((a, b) => (flaggedByState[b.state] || 0) - (flaggedByState[a.state] || 0)).slice(0, 5)

  // Best/worst opioid states
  const bestOpioid = [...realStates].sort((a, b) => a.avgOpioidRate - b.avgOpioidRate).slice(0, 5)
  const worstOpioid = byOpioidRate

  // Summary stats
  const totalCost = realStates.reduce((s, x) => s + x.cost, 0)
  const totalProviders = realStates.reduce((s, x) => s + x.providers, 0)
  const avgOpioid = realStates.reduce((s, x) => s + x.avgOpioidRate, 0) / realStates.length
  const totalFlagged = highRisk.filter(p => REAL_STATES.has(p.state)).length

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema
        title="State-by-State Medicare Prescribing Rankings"
        description="Ranking all 50 states across Medicare Part D metrics: drug costs, opioid rates, cost per beneficiary, and flagged providers."
        slug="state-rankings"
        date="2026-02-28"
      />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'State Rankings' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">State-by-State Medicare Prescribing Rankings</h1>
      <ShareButtons title="State-by-State Medicare Prescribing Rankings" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          Medicare Part D spending varies enormously across the United States. We ranked all 50 states (plus D.C.) across five key metrics to reveal where prescribing costs are highest, where opioid use is most concerning, and where the most flagged providers operate.
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-primary">{realStates.length}</p>
            <p className="text-xs text-blue-600">States Ranked</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-primary">{fmtMoney(totalCost)}</p>
            <p className="text-xs text-blue-600">Total Drug Cost</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-primary">{fmt(totalProviders)}</p>
            <p className="text-xs text-blue-600">Total Providers</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">{fmt(totalFlagged)}</p>
            <p className="text-xs text-red-600">Flagged Providers</p>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Most Providers</h2>
        <p>States with the largest Medicare Part D prescriber workforces:</p>
        <div className="not-prose">
          <ol className="space-y-2 mb-8">
            {byProviders.map((s, i) => (
              <li key={s.state} className="flex items-center gap-3 bg-white rounded-lg p-3 border">
                <span className="text-lg font-bold text-primary w-8">{i + 1}.</span>
                <Link href={`/states/${s.state.toLowerCase()}`} className="text-primary font-medium hover:underline">{stateName(s.state)}</Link>
                <span className="ml-auto font-mono text-sm">{fmt(s.providers)} providers</span>
              </li>
            ))}
          </ol>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Highest Total Drug Cost</h2>
        <p>The states where Medicare Part D spending is highest in absolute terms:</p>
        <div className="not-prose">
          <ol className="space-y-2 mb-8">
            {byCost.map((s, i) => (
              <li key={s.state} className="flex items-center gap-3 bg-white rounded-lg p-3 border">
                <span className="text-lg font-bold text-primary w-8">{i + 1}.</span>
                <Link href={`/states/${s.state.toLowerCase()}`} className="text-primary font-medium hover:underline">{stateName(s.state)}</Link>
                <span className="ml-auto font-mono text-sm">{fmtMoney(s.cost)}</span>
              </li>
            ))}
          </ol>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Highest Opioid Prescribing Rate</h2>
        <p>These states have the highest average opioid prescribing rates among their Medicare providers:</p>
        <div className="not-prose">
          <ol className="space-y-2 mb-8">
            {byOpioidRate.map((s, i) => (
              <li key={s.state} className="flex items-center gap-3 bg-white rounded-lg p-3 border">
                <span className="text-lg font-bold text-red-600 w-8">{i + 1}.</span>
                <Link href={`/states/${s.state.toLowerCase()}`} className="text-primary font-medium hover:underline">{stateName(s.state)}</Link>
                <span className="ml-auto font-mono text-sm text-red-600 font-semibold">{s.avgOpioidRate.toFixed(1)}%</span>
              </li>
            ))}
          </ol>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Highest Cost Per Beneficiary</h2>
        <p>States where Medicare Part D costs the most per patient:</p>
        <div className="not-prose">
          <ol className="space-y-2 mb-8">
            {byCostPerBene.map((s, i) => (
              <li key={s.state} className="flex items-center gap-3 bg-white rounded-lg p-3 border">
                <span className="text-lg font-bold text-primary w-8">{i + 1}.</span>
                <Link href={`/states/${s.state.toLowerCase()}`} className="text-primary font-medium hover:underline">{stateName(s.state)}</Link>
                <span className="ml-auto font-mono text-sm">{fmtMoney(s.costPerBene)}/patient</span>
              </li>
            ))}
          </ol>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Most Flagged Providers</h2>
        <p>States with the highest number of providers flagged by our risk model:</p>
        <div className="not-prose">
          <ol className="space-y-2 mb-8">
            {byFlagged.map((s, i) => (
              <li key={s.state} className="flex items-center gap-3 bg-white rounded-lg p-3 border">
                <span className="text-lg font-bold text-red-600 w-8">{i + 1}.</span>
                <Link href={`/states/${s.state.toLowerCase()}`} className="text-primary font-medium hover:underline">{stateName(s.state)}</Link>
                <span className="ml-auto font-mono text-sm text-red-600 font-semibold">{fmt(flaggedByState[s.state] || 0)} flagged</span>
              </li>
            ))}
          </ol>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Best vs Worst States for Opioid Prescribing</h2>
        <p>
          The gap between states with the highest and lowest opioid rates reveals stark geographic disparities. The worst state averages {worstOpioid[0]?.avgOpioidRate.toFixed(1)}% opioid claims, while the best manages just {bestOpioid[0]?.avgOpioidRate.toFixed(1)}% &mdash; a {((worstOpioid[0]?.avgOpioidRate || 0) / (bestOpioid[0]?.avgOpioidRate || 1)).toFixed(1)}x difference.
        </p>

        <div className="not-prose grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-red-50 rounded-xl p-5 border border-red-200">
            <h3 className="font-bold text-red-700 mb-3">Highest Opioid Rates</h3>
            <ol className="space-y-2">
              {worstOpioid.map((s, i) => (
                <li key={s.state} className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-red-600 w-5">{i + 1}.</span>
                  <Link href={`/states/${s.state.toLowerCase()}`} className="text-primary hover:underline">{stateName(s.state)}</Link>
                  <span className="ml-auto font-mono text-red-600">{s.avgOpioidRate.toFixed(1)}%</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="bg-green-50 rounded-xl p-5 border border-green-200">
            <h3 className="font-bold text-green-700 mb-3">Lowest Opioid Rates</h3>
            <ol className="space-y-2">
              {bestOpioid.map((s, i) => (
                <li key={s.state} className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-green-600 w-5">{i + 1}.</span>
                  <Link href={`/states/${s.state.toLowerCase()}`} className="text-primary hover:underline">{stateName(s.state)}</Link>
                  <span className="ml-auto font-mono text-green-600">{s.avgOpioidRate.toFixed(1)}%</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">The Bottom Line</h2>
        <p>
          Across {realStates.length} states and D.C., Medicare Part D spent {fmtMoney(totalCost)} on prescription drugs through {fmt(totalProviders)} providers. The average state opioid prescribing rate is {avgOpioid.toFixed(1)}%, but this masks enormous variation: some states prescribe opioids at more than double the national average. Meanwhile, {fmt(totalFlagged)} providers have been flagged by our risk model, with heavy concentration in a handful of states.
        </p>
        <p>
          These rankings underscore the importance of state-level policy interventions. States with high opioid rates and flagged provider counts may benefit most from prescription drug monitoring programs, prescriber education, and enhanced audit oversight.
        </p>

        <div className="not-prose mt-8 bg-blue-50 rounded-xl p-5 border border-blue-200">
          <h3 className="font-bold text-sm mb-2">Explore individual states</h3>
          <p className="text-sm text-gray-700 mb-3">Click any state to see detailed prescribing data, trends, and provider lists:</p>
          <div className="flex flex-wrap gap-2">
            {realStates.sort((a, b) => a.state.localeCompare(b.state)).map(s => (
              <Link key={s.state} href={`/states/${s.state.toLowerCase()}`} className="text-xs bg-white px-2 py-1 rounded border hover:border-primary/30 hover:text-primary">
                {s.state}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <RelatedAnalysis current="/analysis/state-rankings" />
    </div>
  )
}
