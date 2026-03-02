import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import RelatedAnalysis from '@/components/RelatedAnalysis'
import { fmtMoney, fmt } from '@/lib/utils'
import { stateName } from '@/lib/state-names'
import { loadData } from '@/lib/server-utils'

const title = 'Medicare Part D Spending by State: Who Pays the Most?'
const description = 'State-by-state rankings of Medicare Part D drug spending — total cost, per-capita cost, cost growth trends, and opioid spending by state.'
const slug = 'medicare-spending-by-state'
const canonical = `https://www.openprescriber.org/analysis/${slug}`

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: canonical, type: 'article' },
  alternates: { canonical },
}

export default function MedicareSpendingByStatePage() {
  const states = loadData('states.json') as {
    state: string; providers: number; claims: number; cost: number
    benes: number; opioidProv: number; highOpioid: number
    opioidClaims: number; avgOpioidRate: number; costPerBene: number
  }[]
  const stateYearly = loadData('state-yearly.json') as Record<string, {
    year: number; state: string; providers: number; claims: number
    cost: number; opioidProv: number; avgOpioidRate: number
  }[]>
  const stats = loadData('stats.json') as { cost: number; providers: number; claims: number }

  // Rankings
  const byTotalCost = [...states].sort((a, b) => (b.cost ?? 0) - (a.cost ?? 0))
  const byPerCapita = [...states].filter(s => (s.benes ?? 0) > 0).sort((a, b) => (b.costPerBene ?? 0) - (a.costPerBene ?? 0))
  const byOpioidRate = [...states].sort((a, b) => (b.avgOpioidRate ?? 0) - (a.avgOpioidRate ?? 0))

  // Cost growth by state (2019 vs 2023)
  const costGrowth = Object.entries(stateYearly).map(([st, years]) => {
    const sorted = [...years].sort((a, b) => a.year - b.year)
    const first = sorted[0]
    const last = sorted[sorted.length - 1]
    const growth = first && last && (first.cost ?? 0) > 0
      ? (((last.cost ?? 0) - (first.cost ?? 0)) / (first.cost ?? 0)) * 100
      : 0
    return { state: st, growth, cost2023: last?.cost ?? 0, cost2019: first?.cost ?? 0 }
  }).sort((a, b) => b.growth - a.growth)

  const top5Cost = byTotalCost.slice(0, 5)
  const totalCost = states.reduce((s, st) => s + (st.cost ?? 0), 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema title={title} description={description} slug={slug} date="2026-03-02" />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Spending by State' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">{title}</h1>
      <ShareButtons title={title} />
      <DisclaimerBanner />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          Medicare Part D spending varies dramatically across states — driven by population size,
          drug prices, prescribing culture, and specialty mix. Here&apos;s where the money goes.
        </p>

        {/* Key stats */}
        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmtMoney(stats.cost ?? 0)}</p>
            <p className="text-xs text-blue-600">Total Part D Spending</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmt(states.length)}</p>
            <p className="text-xs text-blue-600">States & Territories</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmtMoney(top5Cost.reduce((s, st) => s + (st.cost ?? 0), 0))}</p>
            <p className="text-xs text-blue-600">Top 5 States Combined</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">
              {totalCost > 0 ? ((top5Cost.reduce((s, st) => s + (st.cost ?? 0), 0) / totalCost) * 100).toFixed(0) : 0}%
            </p>
            <p className="text-xs text-blue-600">Share of Top 5</p>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Total Spending Rankings</h2>
        <p>The top 20 states by total Medicare Part D drug cost:</p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">#</th>
                <th className="px-3 py-2 text-left font-semibold">State</th>
                <th className="px-3 py-2 text-right font-semibold">Total Cost</th>
                <th className="px-3 py-2 text-right font-semibold">Providers</th>
                <th className="px-3 py-2 text-right font-semibold">Claims</th>
                <th className="px-3 py-2 text-right font-semibold">Cost/Bene</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {byTotalCost.slice(0, 20).map((s, i) => (
                <tr key={s.state} className={i < 5 ? 'bg-blue-50' : ''}>
                  <td className="px-3 py-2 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-3 py-2">
                    <Link href={`/states/${s.state.toLowerCase()}`} className="text-primary hover:underline font-medium">
                      {stateName(s.state)}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-semibold">{fmtMoney(s.cost ?? 0)}</td>
                  <td className="px-3 py-2 text-right font-mono">{fmt(s.providers ?? 0)}</td>
                  <td className="px-3 py-2 text-right font-mono">{fmt(s.claims ?? 0)}</td>
                  <td className="px-3 py-2 text-right font-mono text-blue-600">${fmt(s.costPerBene ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Per-Capita Spending: A Different Picture</h2>
        <p>
          Total spending is dominated by large states. Per-beneficiary spending tells a different story —
          revealing where Medicare pays the <em>most per person</em>:
        </p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">#</th>
                <th className="px-3 py-2 text-left font-semibold">State</th>
                <th className="px-3 py-2 text-right font-semibold">Cost/Bene</th>
                <th className="px-3 py-2 text-right font-semibold">Total Cost</th>
                <th className="px-3 py-2 text-right font-semibold">Opioid Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {byPerCapita.slice(0, 15).map((s, i) => (
                <tr key={s.state} className={i < 5 ? 'bg-amber-50' : ''}>
                  <td className="px-3 py-2 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-3 py-2">
                    <Link href={`/states/${s.state.toLowerCase()}`} className="text-primary hover:underline font-medium">
                      {stateName(s.state)}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-amber-600 font-semibold">${fmt(s.costPerBene ?? 0)}</td>
                  <td className="px-3 py-2 text-right font-mono">{fmtMoney(s.cost ?? 0)}</td>
                  <td className="px-3 py-2 text-right font-mono">{(s.avgOpioidRate ?? 0).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Cost Growth: Who&apos;s Growing Fastest?</h2>
        <p>
          Medicare Part D spending grew approximately 50% nationally from 2019 to 2023.
          But some states grew much faster:
        </p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">#</th>
                <th className="px-3 py-2 text-left font-semibold">State</th>
                <th className="px-3 py-2 text-right font-semibold">Growth</th>
                <th className="px-3 py-2 text-right font-semibold">2019 Cost</th>
                <th className="px-3 py-2 text-right font-semibold">2023 Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {costGrowth.slice(0, 15).map((s, i) => (
                <tr key={s.state} className={i < 5 ? 'bg-blue-50' : ''}>
                  <td className="px-3 py-2 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-3 py-2">
                    <Link href={`/states/${s.state.toLowerCase()}`} className="text-primary hover:underline font-medium">
                      {stateName(s.state)}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-blue-600 font-semibold">+{(s.growth ?? 0).toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right font-mono">{fmtMoney(s.cost2019 ?? 0)}</td>
                  <td className="px-3 py-2 text-right font-mono">{fmtMoney(s.cost2023 ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Opioid Spending by State</h2>
        <p>
          Opioid prescribing rates are a key driver of both health outcomes and costs.
          States with the highest average opioid prescribing rates:
        </p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">#</th>
                <th className="px-3 py-2 text-left font-semibold">State</th>
                <th className="px-3 py-2 text-right font-semibold">Avg Opioid Rate</th>
                <th className="px-3 py-2 text-right font-semibold">High-Rate Providers</th>
                <th className="px-3 py-2 text-right font-semibold">Opioid Claims</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {byOpioidRate.slice(0, 15).map((s, i) => (
                <tr key={s.state} className={i < 5 ? 'bg-red-50' : ''}>
                  <td className="px-3 py-2 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-3 py-2">
                    <Link href={`/states/${s.state.toLowerCase()}`} className="text-primary hover:underline font-medium">
                      {stateName(s.state)}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-red-600 font-semibold">{(s.avgOpioidRate ?? 0).toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right font-mono">{fmt(s.highOpioid ?? 0)}</td>
                  <td className="px-3 py-2 text-right font-mono">{fmt(s.opioidClaims ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Key Takeaways</h2>
        <div className="not-prose bg-blue-50 border border-blue-200 rounded-xl p-6 my-6">
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• <strong>California, Florida, and New York</strong> dominate total spending due to population</li>
            <li>• <strong>Per-capita spending</strong> tells a different story — smaller states often pay more per beneficiary</li>
            <li>• <strong>Southern states</strong> consistently have higher opioid prescribing rates</li>
            <li>• <strong>Cost growth</strong> varies by 2-3x between the fastest and slowest-growing states</li>
            <li>• Geographic variation suggests <strong>prescribing culture matters</strong> as much as demographics</li>
          </ul>
        </div>

        <p>
          These state-level patterns have policy implications: federal programs apply uniform rules,
          but the data suggests state-specific interventions might be more effective.
          Explore individual state profiles for deeper analysis.
        </p>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-blue-800 font-medium">Explore State Data</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/states" className="text-sm text-primary hover:underline">🗺️ All State Profiles</Link>
            <Link href="/taxpayer-cost" className="text-sm text-primary hover:underline">💵 Cost Per Taxpayer</Link>
            <Link href="/analysis/geographic-disparities" className="text-sm text-primary hover:underline">🌎 Geographic Disparities</Link>
            <Link href="/analysis/state-rankings" className="text-sm text-primary hover:underline">🏆 State Rankings</Link>
            <Link href="/analysis/opioid-hotspots" className="text-sm text-primary hover:underline">📍 Opioid Hotspots</Link>
            <Link href="/analysis/medicare-waste" className="text-sm text-primary hover:underline">💰 Medicare Waste</Link>
          </div>
        </div>
        <RelatedAnalysis current={`/analysis/${slug}`} />
      </div>
    </div>
  )
}
