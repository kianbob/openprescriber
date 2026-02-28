import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import RelatedAnalysis from '@/components/RelatedAnalysis'

export const metadata: Metadata = {
  title: 'Who Are the Highest-Cost Medicare Part D Prescribers?',
  description: 'Analysis of the providers generating the most drug costs in Medicare Part D — what drives the spending and where the money goes.',
  alternates: { canonical: 'https://www.openprescriber.org/analysis/cost-outliers' },
}

export default function CostOutliersPage() {
  const topCost = loadData('top-cost.json') as { npi: string; name: string; city: string; state: string; specialty: string; cost: number; claims: number; costPerBene: number; brandPct: number }[]
  const top10 = topCost.slice(0, 10)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Cost Outliers' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">Who Are the Highest-Cost Prescribers?</h1>
      <ShareButtons title="Highest-Cost Medicare Part D Prescribers" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          Medicare Part D spent $275.6 billion on prescription drugs in 2023, but spending is heavily concentrated among a relatively small number of providers. The top 1,000 prescribers alone account for a disproportionate share.
        </p>

        <h2>The Top 10 by Total Drug Cost</h2>
        <div className="not-prose my-6">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Provider</th>
                <th className="px-4 py-2 text-left font-semibold">Specialty</th>
                <th className="px-4 py-2 text-right font-semibold">Drug Cost</th>
                <th className="px-4 py-2 text-right font-semibold">Brand %</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {top10.map(p => (
                <tr key={p.npi}>
                  <td className="px-4 py-2"><Link href={`/providers/${p.npi}`} className="text-primary hover:underline">{p.name}</Link><br /><span className="text-xs text-gray-400">{p.city}, {p.state}</span></td>
                  <td className="px-4 py-2 text-gray-600">{p.specialty}</td>
                  <td className="px-4 py-2 text-right font-mono font-semibold">{fmtMoney(p.cost)}</td>
                  <td className="px-4 py-2 text-right font-mono">{p.brandPct > 0 ? p.brandPct.toFixed(0) + '%' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>What Drives High Costs?</h2>
        <p>Not all high-cost prescribers are problematic. Several legitimate factors drive costs:</p>
        <ul>
          <li><strong>Specialty drugs</strong> — Oncologists and rheumatologists prescribe biologics costing thousands per dose</li>
          <li><strong>Rare disease treatments</strong> — Some drugs have no generic alternatives</li>
          <li><strong>High patient volume</strong> — Large practices naturally generate more costs</li>
          <li><strong>Brand-name preference</strong> — Some providers prescribe brands when generics exist</li>
        </ul>
        <p>
          The last factor is where scrutiny matters most. Providers with both high costs <em>and</em> high brand-name percentages when generics are available may be costing Medicare billions unnecessarily.
        </p>

        <h2>Cost Per Patient</h2>
        <p>
          Raw cost totals can be misleading — a provider seeing 10,000 patients will naturally spend more than one seeing 100. Cost per beneficiary is a more useful metric. Our top-cost providers range from {fmtMoney(top10[top10.length - 1]?.costPerBene || 0)} to {fmtMoney(top10[0]?.costPerBene || 0)} per patient.
        </p>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-blue-800">Explore the data: <Link href="/brand-vs-generic" className="text-primary font-medium hover:underline">Brand vs Generic Analysis →</Link></p>
          <p className="text-sm text-blue-800">Cost outliers are a key input to our <Link href="/ml-fraud-detection" className="text-primary font-medium hover:underline">🤖 ML Fraud Detection model →</Link></p>
        </div>
      <RelatedAnalysis current={"/analysis/cost-outliers"} />
      </div>
    </div>
  )
}
