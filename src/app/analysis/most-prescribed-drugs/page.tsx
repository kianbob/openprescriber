import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import RelatedAnalysis from '@/components/RelatedAnalysis'
import { fmtMoney, fmt, slugify } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

const title = 'The 50 Most Prescribed Drugs in Medicare Part D (2023)'
const description = 'Ranked by total claims — not cost — these are the 50 most commonly prescribed drugs in Medicare Part D, with cost-per-claim and provider counts.'
const slug = 'most-prescribed-drugs'
const canonical = `https://www.openprescriber.org/analysis/${slug}`

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: canonical, type: 'article' },
  alternates: { canonical },
}

export default function MostPrescribedDrugsPage() {
  const drugs = loadData('drugs.json') as {
    generic: string; brand: string; claims: number; cost: number
    benes: number; providers: number; fills: number; costPerClaim: number
  }[]
  const stats = loadData('stats.json') as { claims: number; cost: number; providers: number }

  // Sort by claims count (most prescribed)
  const byClaims = [...drugs].sort((a, b) => (b.claims ?? 0) - (a.claims ?? 0))
  const top50 = byClaims.slice(0, 50)

  const totalClaims50 = top50.reduce((s, d) => s + (d.claims ?? 0), 0)
  const totalCost50 = top50.reduce((s, d) => s + (d.cost ?? 0), 0)

  // Most expensive per claim among top 50
  const byCostPerClaim = [...top50].sort((a, b) => (b.costPerClaim ?? 0) - (a.costPerClaim ?? 0))

  // Cheapest per claim
  const cheapest = [...top50].sort((a, b) => (a.costPerClaim ?? 0) - (b.costPerClaim ?? 0))

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema title={title} description={description} slug={slug} date="2026-03-02" />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Most Prescribed Drugs' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">{title}</h1>
      <ShareButtons title={title} />
      <DisclaimerBanner />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          When people think of Medicare drug costs, they think of expensive specialty drugs. But the drugs
          prescribed <em>most often</em> tell a different story — dominated by chronic disease management:
          blood thinners, statins, blood pressure medications, and diabetes drugs.
        </p>

        {/* Key stats */}
        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmt(totalClaims50)}</p>
            <p className="text-xs text-blue-600">Claims (Top 50)</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">
              {stats.claims > 0 ? ((totalClaims50 / (stats.claims ?? 1)) * 100).toFixed(0) : 0}%
            </p>
            <p className="text-xs text-blue-600">Of All Claims</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmtMoney(totalCost50)}</p>
            <p className="text-xs text-blue-600">Cost (Top 50)</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">
              {stats.cost > 0 ? ((totalCost50 / (stats.cost ?? 1)) * 100).toFixed(0) : 0}%
            </p>
            <p className="text-xs text-blue-600">Of All Spending</p>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">The Complete Top 50</h2>
        <p>Ranked by total claim count across all Medicare Part D prescribers in 2023:</p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left font-semibold">#</th>
                <th className="px-2 py-2 text-left font-semibold">Drug (Generic)</th>
                <th className="px-2 py-2 text-left font-semibold">Brand</th>
                <th className="px-2 py-2 text-right font-semibold">Claims</th>
                <th className="px-2 py-2 text-right font-semibold">Total Cost</th>
                <th className="px-2 py-2 text-right font-semibold">$/Claim</th>
                <th className="px-2 py-2 text-right font-semibold">Providers</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {top50.map((d, i) => (
                <tr key={d.generic} className={i < 10 ? 'bg-blue-50' : ''}>
                  <td className="px-2 py-2 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-2 py-2 font-medium">
                    <Link href={`/drugs/${slugify(d.generic)}`} className="text-primary hover:underline text-xs">
                      {d.generic}
                    </Link>
                  </td>
                  <td className="px-2 py-2 text-xs text-gray-500">{d.brand}</td>
                  <td className="px-2 py-2 text-right font-mono">{fmt(d.claims ?? 0)}</td>
                  <td className="px-2 py-2 text-right font-mono">{fmtMoney(d.cost ?? 0)}</td>
                  <td className="px-2 py-2 text-right font-mono text-blue-600">${fmt(d.costPerClaim ?? 0)}</td>
                  <td className="px-2 py-2 text-right font-mono text-gray-500">{fmt(d.providers ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Volume vs. Cost: Two Different Lists</h2>
        <p>
          The most-prescribed drugs are often <em>not</em> the most expensive. The top 5 by claims are mostly
          generic statins, blood pressure meds, and diabetes drugs costing dollars per claim. Meanwhile, the
          top drugs by <em>cost</em> ({' '}
          <Link href="/analysis/top-drugs-analysis" className="text-primary hover:underline">see our cost analysis</Link>
          ) are specialty biologics costing hundreds or thousands per claim.
        </p>

        <h3 className="font-[family-name:var(--font-heading)]">Most Expensive Per Claim (Among Top 50)</h3>
        <div className="not-prose my-6">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Drug</th>
                <th className="px-4 py-2 text-right font-semibold">Cost/Claim</th>
                <th className="px-4 py-2 text-right font-semibold">Total Cost</th>
                <th className="px-4 py-2 text-right font-semibold">Claims</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {byCostPerClaim.slice(0, 10).map(d => (
                <tr key={d.generic}>
                  <td className="px-4 py-2">
                    <Link href={`/drugs/${slugify(d.generic)}`} className="text-primary hover:underline">{d.generic}</Link>
                    <span className="text-xs text-gray-400 ml-1">({d.brand})</span>
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-amber-600 font-semibold">${fmt(d.costPerClaim ?? 0)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmtMoney(d.cost ?? 0)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(d.claims ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="font-[family-name:var(--font-heading)]">Cheapest Per Claim (Among Top 50)</h3>
        <div className="not-prose my-6">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Drug</th>
                <th className="px-4 py-2 text-right font-semibold">Cost/Claim</th>
                <th className="px-4 py-2 text-right font-semibold">Claims</th>
                <th className="px-4 py-2 text-right font-semibold">Providers</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {cheapest.slice(0, 10).map(d => (
                <tr key={d.generic}>
                  <td className="px-4 py-2">
                    <Link href={`/drugs/${slugify(d.generic)}`} className="text-primary hover:underline">{d.generic}</Link>
                    <span className="text-xs text-gray-400 ml-1">({d.brand})</span>
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-green-600 font-semibold">${fmt(d.costPerClaim ?? 0)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(d.claims ?? 0)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(d.providers ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">What This Tells Us</h2>
        <div className="not-prose bg-blue-50 border border-blue-200 rounded-xl p-6 my-6">
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• <strong>Chronic disease dominates</strong> — the most-prescribed drugs treat conditions that require ongoing, daily medication</li>
            <li>• <strong>Generics work</strong> — the highest-volume drugs are overwhelmingly generic, keeping per-claim costs low</li>
            <li>• <strong>The cost problem is concentrated</strong> — a handful of expensive brand drugs consume disproportionate spending</li>
            <li>• <strong>Provider reach matters</strong> — the most-prescribed drugs are written by 100K+ providers each</li>
          </ul>
        </div>

        <p>
          Understanding prescription volume — not just cost — is essential for policy. Programs that focus
          only on high-cost drugs miss the everyday medications that millions of Medicare beneficiaries depend on.
        </p>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-blue-800 font-medium">Explore Drug Data</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/drugs" className="text-sm text-primary hover:underline">💊 All Drugs</Link>
            <Link href="/analysis/top-drugs-analysis" className="text-sm text-primary hover:underline">💰 Most Expensive Drugs</Link>
            <Link href="/analysis/ozempic-effect" className="text-sm text-primary hover:underline">💉 The Ozempic Effect</Link>
            <Link href="/analysis/brand-generic-gap" className="text-sm text-primary hover:underline">💊 Brand vs Generic Gap</Link>
            <Link href="/analysis/medicare-waste" className="text-sm text-primary hover:underline">🗑️ Medicare Waste</Link>
            <Link href="/prescription-drug-costs" className="text-sm text-primary hover:underline">📊 Drug Cost Explorer</Link>
          </div>
        </div>
        <RelatedAnalysis current={`/analysis/${slug}`} />
      </div>
    </div>
  )
}
