import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'Medicare Drug Costs: The Most Expensive Prescription Drugs in Part D',
  description: 'Medicare Part D spent $275.6 billion on prescription drugs in 2023. See the most expensive drugs, cost trends, and where the money goes.',
  alternates: { canonical: 'https://www.openprescriber.org/drug-costs' },
}

export default function DrugCostsPage() {
  const stats = loadData('stats.json')
  const drugs = loadData('drugs.json') as { generic: string; brand: string; claims: number; cost: number; benes: number; providers: number; costPerClaim: number }[]
  const trends = loadData('yearly-trends.json') as { year: number; cost: number; claims: number; providers: number }[]

  const top25 = drugs.slice(0, 25)
  const topTotal = top25.reduce((s, d) => s + d.cost, 0)
  const costGrowth = ((trends[4].cost / trends[0].cost - 1) * 100).toFixed(0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Drug Costs' }]} />
      <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] mb-4">Medicare Drug Costs: Where $275.6 Billion Goes</h1>
      <p className="text-lg text-gray-600 mb-2">
        Medicare Part D drug spending grew <strong>{costGrowth}%</strong> in just 5 years — from {fmtMoney(trends[0].cost)} in 2019 to {fmtMoney(trends[4].cost)} in 2023. Here&apos;s what&apos;s driving the surge.
      </p>
      <ShareButtons title="Medicare Drug Costs: Where $275.6 Billion Goes" />

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-200">
          <p className="text-2xl font-bold text-primary">{fmtMoney(stats.cost)}</p>
          <p className="text-xs text-gray-600 mt-1">Total Drug Costs (2023)</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-200">
          <p className="text-2xl font-bold text-primary">{fmt(stats.claims)}</p>
          <p className="text-xs text-gray-600 mt-1">Total Claims</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-200">
          <p className="text-2xl font-bold text-primary">${stats.avgCostPerClaim}</p>
          <p className="text-xs text-gray-600 mt-1">Avg Cost Per Claim</p>
        </div>
        <div className="bg-red-50 rounded-xl p-5 text-center border border-red-200">
          <p className="text-2xl font-bold text-red-700">+{costGrowth}%</p>
          <p className="text-xs text-gray-600 mt-1">5-Year Growth</p>
        </div>
      </div>

      {/* 5 Year Trend */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-4">5-Year Cost Trend</h2>
        <div className="grid grid-cols-5 gap-2">
          {trends.map(t => (
            <div key={t.year} className="bg-white rounded-xl shadow-sm p-4 border text-center">
              <p className="text-sm font-bold text-gray-800">{t.year}</p>
              <p className="text-lg font-bold text-primary mt-1">{fmtMoney(t.cost)}</p>
              <p className="text-xs text-gray-500">{fmt(t.claims)} claims</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top 25 Most Expensive Drugs */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-2">Top 25 Most Expensive Drugs</h2>
        <p className="text-sm text-gray-600 mb-4">These 25 drugs account for <strong>{fmtMoney(topTotal)}</strong> — {(topTotal / stats.cost * 100).toFixed(0)}% of all Part D spending.</p>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">Drug</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Generic Name</th>
                <th className="px-4 py-3 text-right font-semibold">Total Cost</th>
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Claims</th>
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Patients</th>
                <th className="px-4 py-3 text-right font-semibold">Cost/Claim</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {top25.map((d, i) => (
                <tr key={d.brand} className={`hover:bg-gray-50 ${i < 5 ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-4 py-2 font-mono text-gray-500">{i + 1}</td>
                  <td className="px-4 py-2">
                    <Link href={`/drugs/${d.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`} className="font-semibold text-primary hover:underline">{d.brand}</Link>
                  </td>
                  <td className="px-4 py-2 text-gray-600 hidden md:table-cell">{d.generic}</td>
                  <td className="px-4 py-2 text-right font-mono font-bold">{fmtMoney(d.cost)}</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(d.claims)}</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(d.benes)}</td>
                  <td className="px-4 py-2 text-right font-mono">${d.costPerClaim.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-right"><Link href="/drugs" className="text-primary text-sm font-medium hover:underline">View all 500 drugs →</Link></p>
      </section>

      {/* What's driving costs */}
      <section className="mt-10 prose prose-gray max-w-none">
        <h2>What&apos;s Driving the Cost Surge?</h2>
        
        <h3>1. GLP-1 Drugs: The $8.4 Billion Category</h3>
        <p>
          Ozempic, Trulicity, and Mounjaro represent the fastest-growing drug category in Medicare. Originally for diabetes, these drugs have gained massive popularity for weight loss. GLP-1 spending has <strong>tripled since 2019</strong>. <Link href="/glp1-tracker">Track GLP-1 spending →</Link>
        </p>

        <h3>2. Brand-Name Drug Prices Keep Rising</h3>
        <p>
          Brand-name drugs account for just {stats.brandPct}% of prescriptions but <strong>{(stats.brandCost / stats.cost * 100).toFixed(0)}% of total cost</strong> — {fmtMoney(stats.brandCost)} vs {fmtMoney(stats.genericCost)} for generics. The average brand-name claim costs 4.7x more than generic. <Link href="/brand-vs-generic">See the brand vs generic breakdown →</Link>
        </p>

        <h3>3. IRA Negotiation: A Drop in the Bucket?</h3>
        <p>
          The Inflation Reduction Act allows Medicare to negotiate prices on 10 drugs starting in 2026, saving an estimated $1.5 billion in year one. But with $275 billion in annual spending, that&apos;s just 0.5%. <Link href="/ira-negotiation">See which drugs are being negotiated →</Link>
        </p>

        <h3>4. Specialty Drugs: Low Volume, Massive Cost</h3>
        <p>
          Drugs like Revlimid (cancer: {fmtMoney(drugs.find(d => d.brand === 'Revlimid')?.cost || 0)}), Xtandi (prostate cancer: {fmtMoney(drugs.find(d => d.brand === 'Xtandi')?.cost || 0)}), and Biktarvy (HIV: {fmtMoney(drugs.find(d => d.brand === 'Biktarvy')?.cost || 0)}) serve relatively few patients at extremely high per-claim costs.
        </p>
      </section>

      {/* Related */}
      <section className="mt-10 bg-gray-50 rounded-xl p-6 border">
        <h2 className="text-lg font-bold mb-3">Related</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Link href="/drugs" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium">💊 All Top Drugs</Link>
          <Link href="/glp1-tracker" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium">💉 GLP-1 Tracker</Link>
          <Link href="/ira-negotiation" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium">⚖️ IRA Drug Prices</Link>
          <Link href="/brand-vs-generic" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium">💰 Brand vs Generic</Link>
          <Link href="/taxpayer-cost" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium">🏛️ Taxpayer Cost</Link>
          <Link href="/dashboard" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium">📊 Dashboard</Link>
        </div>
      </section>
    </div>
  )
}
