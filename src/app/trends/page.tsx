import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { loadData } from '@/lib/server-utils'
import { fmtMoney, fmt } from '@/lib/utils'
import DataFreshness from '@/components/DataFreshness'
import TrendsCharts from './TrendsCharts'

export const metadata: Metadata = {
  title: 'Medicare Part D Trends (2019-2023) — 5-Year Prescribing Analysis',
  description: 'How Medicare Part D prescribing has changed from 2019 to 2023. Drug costs grew 50% to $275.6B while opioid prescribing declined. 5-year trend analysis.',
  alternates: { canonical: 'https://www.openprescriber.org/trends' },
  openGraph: {
    title: 'Medicare Part D Trends (2019-2023)',
    description: 'Drug costs grew 50% to $275.6B while opioid prescribing declined.',
    url: 'https://www.openprescriber.org/trends',
    type: 'article',
  },
}

type YearData = {
  year: number; providers: number; claims: number; cost: number; benes: number;
  opioidProv: number; highOpioid: number; brandClaims: number; genericClaims: number;
  brandCost: number; genericCost: number; brandPct: number; opioidPct: number;
}

export default function TrendsPage() {
  const trends = loadData('yearly-trends.json') as YearData[]
  const first = trends[0]
  const last = trends[trends.length - 1]
  const costGrowth = ((last.cost - first.cost) / first.cost * 100).toFixed(0)
  const opioidChange = ((last.opioidProv - first.opioidProv) / first.opioidProv * 100).toFixed(0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Trends (2019-2023)' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Medicare Part D Trends: 2019-2023</h1>
      <p className="text-gray-600 mb-4">Five years of prescribing data reveal dramatic shifts in drug costs, opioid prescribing, and the brand-generic divide.</p>
      <DataFreshness />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
          <p className="text-2xl font-bold text-blue-700">+{costGrowth}%</p>
          <p className="text-xs text-blue-600">Cost Growth</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
          <p className="text-2xl font-bold text-green-700">{fmtMoney(last.cost)}</p>
          <p className="text-xs text-green-600">2023 Total Cost</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
          <p className="text-2xl font-bold text-red-700">{opioidChange}%</p>
          <p className="text-xs text-red-600">Opioid Prescriber Change</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
          <p className="text-2xl font-bold text-purple-700">{fmt(last.providers)}</p>
          <p className="text-xs text-purple-600">2023 Providers</p>
        </div>
      </div>

      <TrendsCharts data={trends} />

      <div className="prose prose-gray max-w-none mt-10">
        <h2 className="font-[family-name:var(--font-heading)]">The Cost Explosion</h2>
        <p>
          Medicare Part D drug spending grew from {fmtMoney(first.cost)} in {first.year} to {fmtMoney(last.cost)} in {last.year} — a {costGrowth}% increase over five years. This growth far outpaces inflation and reflects several converging forces:
        </p>
        <ul>
          <li><strong>New specialty drugs</strong> — GLP-1 drugs (Ozempic, Mounjaro) barely existed in 2019; by 2023 they accounted for $8.5 billion</li>
          <li><strong>Brand-name pricing</strong> — Brand drugs cost an average of {fmtMoney(last.brandCost / last.brandClaims)} per claim vs {fmtMoney(last.genericCost / last.genericClaims)} for generics</li>
          <li><strong>Medicare enrollment growth</strong> — More beneficiaries entering the system</li>
          <li><strong>Biologic medications</strong> — High-cost biologics for cancer, autoimmune diseases, and rare conditions</li>
        </ul>

        <h2 className="font-[family-name:var(--font-heading)]">The Opioid Prescribing Decline</h2>
        <p>
          One bright spot: opioid prescribing continues to decline. The percentage of providers prescribing opioids dropped from {first.opioidPct}% in {first.year} to {last.opioidPct}% in {last.year}. The number of high-rate opioid prescribers (above 20% of claims) fell from {fmt(first.highOpioid)} to {fmt(last.highOpioid)}.
        </p>
        <p>
          However, this decline in <em>prescribing</em> hasn&apos;t translated to a proportional decline in <em>overdose deaths</em>. The crisis has shifted from prescription opioids to illicit fentanyl — a transition our data captures on the supply side but not the demand side.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">Brand vs Generic</h2>
        <p>
          The brand-generic mix has shifted slightly toward generics over five years. Brand prescriptions went from {first.brandPct}% of all claims in {first.year} to {last.brandPct}% in {last.year}. But because brand drugs are so much more expensive per claim, they still account for approximately {((last.brandCost / last.cost) * 100).toFixed(0)}% of total costs.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">Year-by-Year Data</h2>
        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Year</th>
                <th className="px-3 py-2 text-right font-semibold">Total Cost</th>
                <th className="px-3 py-2 text-right font-semibold">Claims</th>
                <th className="px-3 py-2 text-right font-semibold hidden sm:table-cell">Providers</th>
                <th className="px-3 py-2 text-right font-semibold hidden md:table-cell">Opioid %</th>
                <th className="px-3 py-2 text-right font-semibold hidden md:table-cell">Brand %</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {trends.map(y => (
                <tr key={y.year}>
                  <td className="px-3 py-2 font-semibold">{y.year}</td>
                  <td className="px-3 py-2 text-right font-mono">{fmtMoney(y.cost)}</td>
                  <td className="px-3 py-2 text-right font-mono">{fmt(y.claims)}</td>
                  <td className="px-3 py-2 text-right font-mono hidden sm:table-cell">{fmt(y.providers)}</td>
                  <td className="px-3 py-2 text-right font-mono hidden md:table-cell">{(y.opioidPct ?? 0).toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right font-mono hidden md:table-cell">{(y.brandPct ?? 0).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">What to Watch</h2>
        <ul>
          <li><strong>Inflation Reduction Act</strong> — Medicare can now negotiate prices on select drugs starting 2026. The first 10 drugs were announced in 2023</li>
          <li><strong>GLP-1 coverage expansion</strong> — If CMS extends Part D coverage to weight loss (currently excluded), costs could surge by $50B+</li>
          <li><strong>Biosimilar competition</strong> — Humira biosimilars arrived in 2023, potentially saving billions</li>
          <li><strong>Part D redesign</strong> — The $2,000 out-of-pocket cap takes effect in 2025</li>
        </ul>

        <div className="not-prose mt-6 bg-gray-50 rounded-xl p-5 border">
          <h3 className="font-semibold text-sm mb-3">Related</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/analysis/ozempic-effect" className="text-sm text-primary hover:underline">The Ozempic Effect</Link>
            <Link href="/analysis/generic-adoption" className="text-sm text-primary hover:underline">Generic Adoption Gap</Link>
            <Link href="/analysis/medicare-drug-spending" className="text-sm text-primary hover:underline">Medicare Drug Spending</Link>
            <Link href="/analysis/opioid-crisis" className="text-sm text-primary hover:underline">The Opioid Crisis in Numbers</Link>
            <Link href="/dashboard" className="text-sm text-primary hover:underline">Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
