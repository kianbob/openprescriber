import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt, slugify } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'How Does Your Doctor Compare? Specialty-Adjusted Prescribing Analysis',
  description: 'Compare prescribers to their specialty peers using z-score methodology. See opioid rates, costs, and brand preference across 156 specialties.',
  alternates: { canonical: 'https://www.openprescriber.org/peer-comparison' },
}

type SpecStats = {
  n: number
  opioidRate: { mean: number; std: number; p50: number; p90: number; p95: number }
  costPerBene: { mean: number; std: number; p50: number; p90: number; p95: number }
  brandPct: { mean: number; std: number; p50: number; p90: number; p95: number }
}

export default function PeerComparisonPage() {
  const data = loadData('specialty-stats.json') as Record<string, SpecStats>
  const specialties = Object.entries(data).sort((a, b) => b[1].n - a[1].n)
  const totalProviders = specialties.reduce((s, [, v]) => s + v.n, 0)
  const highestOpioid = [...specialties].sort((a, b) => b[1].opioidRate.mean - a[1].opioidRate.mean).slice(0, 5)
  const lowestOpioid = [...specialties].filter(([, v]) => v.n >= 100).sort((a, b) => a[1].opioidRate.mean - b[1].opioidRate.mean).slice(0, 5)
  const highestCost = [...specialties].sort((a, b) => b[1].costPerBene.mean - a[1].costPerBene.mean).slice(0, 5)
  const highestBrand = [...specialties].sort((a, b) => b[1].brandPct.mean - a[1].brandPct.mean).slice(0, 5)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Peer Comparison' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">How Does Your Doctor Compare? Specialty-Adjusted Prescribing Analysis</h1>
      <ShareButtons title="How Does Your Doctor Compare? Specialty-Adjusted Prescribing Analysis" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          A family doctor prescribing 5% opioids is very different from a pain management specialist prescribing 5% opioids. Raw numbers are meaningless without context. OpenPrescriber uses <strong>specialty-adjusted peer comparison</strong> — comparing every provider to their specialty peers using z-scores — to identify true outliers. No other public tool does this.
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmt(specialties.length)}</p>
            <p className="text-xs text-blue-600">Specialties Tracked</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmt(totalProviders)}</p>
            <p className="text-xs text-blue-600">Total Providers</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">3</p>
            <p className="text-xs text-blue-600">Key Metrics</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">Z-Score</p>
            <p className="text-xs text-blue-600">Methodology</p>
          </div>
        </div>

        <h2>The Z-Score Approach</h2>
        <p>
          A <strong>z-score</strong> measures how many standard deviations a value is from the mean. For each provider, we calculate z-scores for three key metrics relative to their specialty peers:
        </p>
        <ul>
          <li><strong>Opioid Rate:</strong> What percentage of their prescriptions are opioids?</li>
          <li><strong>Cost per Beneficiary:</strong> How much does their average prescription cost?</li>
          <li><strong>Brand Name %:</strong> How often do they prescribe brand over generic?</li>
        </ul>
        <p>
          A z-score of 0 means average for their specialty. A z-score of +2 means they are 2 standard deviations above their peers — placing them in roughly the top 2.5%. This is the threshold we use to flag statistical outliers. This approach ensures a pain management specialist isn&apos;t unfairly compared to a dermatologist, and vice versa.
        </p>

        <h2>Specialty Benchmarks</h2>
        <p>The table below shows average metrics for each specialty, sorted by number of providers. Click any specialty to see its full profile.</p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Specialty</th>
                <th className="px-3 py-2 text-right font-semibold">Providers</th>
                <th className="px-3 py-2 text-right font-semibold">Avg Opioid %</th>
                <th className="px-3 py-2 text-right font-semibold">Avg Cost/Bene</th>
                <th className="px-3 py-2 text-right font-semibold">Avg Brand %</th>
                <th className="px-3 py-2 text-right font-semibold">P95 Opioid</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {specialties.slice(0, 40).map(([spec, s]) => (
                <tr key={spec}>
                  <td className="px-3 py-2">
                    <Link href={`/specialties/${slugify(spec)}`} className="text-primary hover:underline font-medium text-xs">{spec}</Link>
                  </td>
                  <td className="px-3 py-2 text-right font-mono">{fmt(s.n)}</td>
                  <td className="px-3 py-2 text-right font-mono">{s.opioidRate.mean.toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right font-mono">{fmtMoney(s.costPerBene.mean)}</td>
                  <td className="px-3 py-2 text-right font-mono">{s.brandPct.mean.toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right font-mono text-red-600">{s.opioidRate.p95.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          {specialties.length > 40 && (
            <p className="text-xs text-gray-400 mt-2">Showing top 40 of {specialties.length} specialties by provider count. <Link href="/specialties" className="text-primary hover:underline">View all →</Link></p>
          )}
        </div>

        <h2>Highest Opioid Prescribing Specialties</h2>
        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <h4 className="font-bold text-red-800 text-sm mb-2">🔴 Highest Opioid Rate</h4>
            {highestOpioid.map(([spec, s]) => (
              <div key={spec} className="flex justify-between text-sm py-1">
                <Link href={`/specialties/${slugify(spec)}`} className="text-primary hover:underline text-xs">{spec}</Link>
                <span className="font-mono text-red-700 font-semibold">{s.opioidRate.mean.toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <h4 className="font-bold text-green-800 text-sm mb-2">🟢 Lowest Opioid Rate (n≥100)</h4>
            {lowestOpioid.map(([spec, s]) => (
              <div key={spec} className="flex justify-between text-sm py-1">
                <Link href={`/specialties/${slugify(spec)}`} className="text-primary hover:underline text-xs">{spec}</Link>
                <span className="font-mono text-green-700 font-semibold">{s.opioidRate.mean.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 className="font-bold text-blue-800 text-sm mb-2">💰 Highest Cost per Beneficiary</h4>
            {highestCost.map(([spec, s]) => (
              <div key={spec} className="flex justify-between text-sm py-1">
                <Link href={`/specialties/${slugify(spec)}`} className="text-primary hover:underline text-xs">{spec}</Link>
                <span className="font-mono text-blue-700 font-semibold">{fmtMoney(s.costPerBene.mean)}</span>
              </div>
            ))}
          </div>
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <h4 className="font-bold text-orange-800 text-sm mb-2">💊 Highest Brand Name %</h4>
            {highestBrand.map(([spec, s]) => (
              <div key={spec} className="flex justify-between text-sm py-1">
                <Link href={`/specialties/${slugify(spec)}`} className="text-primary hover:underline text-xs">{spec}</Link>
                <span className="font-mono text-orange-700 font-semibold">{s.brandPct.mean.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <h2>Why Peer Comparison Matters</h2>
        <p>
          Most public prescribing transparency tools show raw numbers — total claims, total cost, whether a provider prescribes opioids. This approach is fundamentally flawed because it ignores the clinical context of different specialties. An orthopedic surgeon who prescribes opioids for post-surgical pain is behaving normally; the same rate from a dermatologist would be alarming.
        </p>
        <p>
          OpenPrescriber&apos;s specialty-adjusted approach solves this. By computing statistics within each specialty group, we can identify providers whose patterns truly deviate from their peers. This is the same methodology used by CMS in its own internal fraud detection algorithms, but we make it publicly accessible for the first time.
        </p>
        <p>
          Whether you&apos;re a patient researching your doctor, a journalist investigating prescribing patterns, or a researcher studying Medicare spending, peer comparison provides the context necessary for meaningful analysis.
        </p>

        <div className="not-prose mt-8 space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">Try it yourself: <Link href="/tools/peer-lookup" className="text-primary font-medium hover:underline">Peer Comparison Tool →</Link> | <Link href="/flagged" className="text-primary font-medium hover:underline">Flagged Providers →</Link> | <Link href="/specialties" className="text-primary font-medium hover:underline">All Specialties →</Link></p>
          </div>
          <p className="text-xs text-gray-400">Data source: CMS Medicare Part D Prescribers dataset, 2023. Z-scores are calculated within specialty groups with n≥30 providers. Statistical outlier identification does not imply inappropriate prescribing. This analysis is for educational and research purposes only.</p>
        </div>
      </div>
    </div>
  )
}
