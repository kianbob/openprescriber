import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { loadData } from '@/lib/server-utils'
import { fmtMoney, fmt } from '@/lib/utils'
import { stateName } from '@/lib/state-names'
import DataFreshness from '@/components/DataFreshness'

export const metadata: Metadata = {
  title: 'Medicare Fraud Risk by State — Flagged Prescribers in Every State',
  description: 'Which states have the most Medicare Part D prescribers flagged for potential fraud? Browse high-risk provider counts, costs, and patterns for all 50 states.',
  alternates: { canonical: 'https://www.openprescriber.org/fraud' },
  openGraph: {
    title: 'Medicare Fraud Risk by State',
    description: 'Browse flagged prescribers in every state. 6,700+ high-risk providers identified.',
    url: 'https://www.openprescriber.org/fraud',
    type: 'website',
  },
}

type FraudState = { state: string; highRisk: number; flaggedCost: number; totalProviders: number }

export default function FraudByStatePage() {
  const states = loadData('fraud-by-state.json') as FraudState[]
  const totalFlagged = states.reduce((s, c) => s + c.highRisk, 0)
  const totalCost = states.reduce((s, c) => s + c.flaggedCost, 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Which state has the most Medicare fraud?', acceptedAnswer: { '@type': 'Answer', text: 'California has the most flagged prescribers (618), followed by Florida (359) and North Carolina (346). However, "flagged" indicates statistical anomalies in prescribing patterns, not confirmed fraud.' }},
          { '@type': 'Question', name: 'How are prescribers flagged for fraud risk?', acceptedAnswer: { '@type': 'Answer', text: 'OpenPrescriber uses a 10-component risk scoring model that analyzes opioid prescribing rates, brand-name preference, cost outliers, dangerous drug combinations, and deviation from specialty peers. Scores above 60/100 are flagged as high risk.' }},
          { '@type': 'Question', name: 'Does a high risk score mean a doctor committed fraud?', acceptedAnswer: { '@type': 'Answer', text: 'No. Risk scores identify statistical outliers in prescribing data. High scores may reflect legitimate clinical specialization, institutional billing, or data limitations. Only law enforcement can determine actual fraud.' }},
        ]
      })}} />
      <Breadcrumbs items={[{ label: 'Fraud Risk by State' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Medicare Fraud Risk by State</h1>
      <p className="text-gray-600 mb-4">
        {fmt(totalFlagged)} Medicare Part D prescribers flagged as high-risk across {states.length} states, generating {fmtMoney(totalCost)} in drug costs. Risk scores are statistical indicators based on prescribing pattern analysis — not allegations of fraud.
      </p>
      <DataFreshness />

      <div className="overflow-x-auto mt-8">
        <table className="w-full text-sm bg-white rounded-xl shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">State</th>
              <th className="px-4 py-2 text-right font-semibold">High-Risk Providers</th>
              <th className="px-4 py-2 text-right font-semibold">Flagged Cost</th>
              <th className="px-4 py-2 text-right font-semibold hidden sm:table-cell">Total Providers</th>
              <th className="px-4 py-2 text-right font-semibold hidden md:table-cell">% Flagged</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {states.map(s => (
              <tr key={s.state} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <Link href={`/fraud/${s.state.toLowerCase()}`} className="text-primary hover:underline font-medium">{stateName(s.state)}</Link>
                </td>
                <td className="px-4 py-2 text-right font-mono text-red-600 font-semibold">{fmt(s.highRisk)}</td>
                <td className="px-4 py-2 text-right font-mono">{fmtMoney(s.flaggedCost)}</td>
                <td className="px-4 py-2 text-right font-mono hidden sm:table-cell">{fmt(s.totalProviders)}</td>
                <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{s.totalProviders > 0 ? ((s.highRisk / s.totalProviders) * 100).toFixed(1) + '%' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-10 prose prose-gray max-w-none">
        <h2 className="font-[family-name:var(--font-heading)]">About This Data</h2>
        <p>
          These providers were flagged by our <Link href="/analysis/fraud-risk-methodology">10-component risk scoring model</Link> which analyzes prescribing patterns including opioid rates, brand-name preference, cost outliers, dangerous drug combinations, and comparison to specialty peers. Providers scoring above our high-risk threshold are included.
        </p>
        <p>
          High risk scores indicate statistical anomalies in prescribing patterns. They may reflect legitimate clinical specialization, institutional billing patterns, or data limitations — not necessarily fraud. See our <Link href="/methodology">methodology</Link> for details.
        </p>
      </section>
    </div>
  )
}
