import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ArticleSchema from '@/components/ArticleSchema'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import RelatedAnalysis from '@/components/RelatedAnalysis'

export const metadata: Metadata = {
  title: 'Who Are the Highest-Cost Medicare Part D Prescribers?',
  description: 'Analysis of the providers generating the most drug costs in Medicare Part D — what drives the spending and where the money goes.',
  openGraph: {
    title: 'Who Are the Highest-Cost Medicare Part D Prescribers?',
    description: 'Analysis of the providers generating the most drug costs in Medicare Part D — what drives the spending and where the money goes.',
    url: 'https://www.openprescriber.org/analysis/cost-outliers',
    type: 'article',
  },
  alternates: { canonical: 'https://www.openprescriber.org/analysis/cost-outliers' },
}

export default function CostOutliersPage() {
  const topCost = loadData('top-cost.json') as { npi: string; name: string; city: string; state: string; specialty: string; cost: number; claims: number; costPerBene: number; brandPct: number }[]
  const top10 = topCost.slice(0, 10)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Cost Outliers' }]} />
      <ArticleSchema title="Who Are the Highest-Cost Prescribers?" description="Some providers generate millions in drug costs." slug="cost-outliers" date="2026-03-01" />
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
                  <td className="px-4 py-2 text-right font-mono">{p.brandPct > 0 ? (p.brandPct ?? 0).toFixed(0) + '%' : '—'}</td>
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

        <h2>The Brand-Name Connection</h2>
        <p>
          One of the most striking patterns among high-cost prescribers is brand-name preference. Several of the top 10 prescribers have brand rates above 99% — meaning virtually every prescription they write is for a brand-name drug, even when cheaper generics exist.
        </p>
        <p>
          The Medicare Part D specialty average for brand prescribing varies by field, but most specialties average 5-15%. A provider prescribing 99% brand-name drugs is an extreme statistical outlier. In some cases this reflects legitimate clinical need (e.g., a narrow-therapeutic-index drug with no bioequivalent generic). In others, it may indicate pharmaceutical marketing influence, formulary gaming, or institutional billing patterns.
        </p>
        <p>
          Our analysis found that switching just the top 1,000 brand-heavy prescribers to generics where available could save Medicare billions annually. See our <Link href="/analysis/generic-adoption">Generic Adoption Gap</Link> analysis for the full picture.
        </p>

        <h2>Cost Per Patient</h2>
        <p>
          Raw cost totals can be misleading — a provider seeing 10,000 patients will naturally spend more than one seeing 100. Cost per beneficiary is a more useful metric. Our top-cost providers range from {fmtMoney(top10[top10.length - 1]?.costPerBene || 0)} to {fmtMoney(top10[0]?.costPerBene || 0)} per patient.
        </p>
        <p>
          The most extreme case in our dataset is Dr. Armaghan Azad, an emergency medicine physician in Moreno Valley, California, who generated $160.3 million in drug costs across 492,011 beneficiaries. At $326 per patient, the individual cost isn&apos;t outrageous — it&apos;s the extraordinary volume that demands investigation. We wrote a <Link href="/analysis/160-million-prescriber">full investigation</Link> exploring what could explain these numbers.
        </p>

        <h2>The 340B Factor</h2>
        <p>
          Some of the most extreme cost outliers may be explained by the 340B Drug Pricing Program. Under 340B, qualifying hospitals can purchase drugs at steep discounts but bill Medicare at full price — generating significant revenue. A single NPI at a large 340B hospital emergency department could accumulate hundreds of millions in &quot;drug costs&quot; that represent institutional billing, not individual prescribing decisions.
        </p>
        <p>
          CMS data doesn&apos;t distinguish between drugs purchased through 340B and those purchased at market price. This is a major limitation when interpreting cost outlier data.
        </p>

        <h2>How Our Model Handles Cost</h2>
        <p>
          Cost outlier status is one component of our <Link href="/analysis/fraud-risk-methodology">10-component risk scoring model</Link>. We use specialty-adjusted z-scores rather than raw cost thresholds — a provider spending $10 million in oncology may be normal, while the same amount in family practice would be extraordinary.
        </p>
        <p>
          Our ML fraud detection model also considers cost patterns as a feature. Providers with cost profiles similar to the 281 confirmed fraud cases in our training data receive elevated ML scores. This catches patterns that simple cost thresholds would miss.
        </p>

        <h2>What You Can Do With This Data</h2>
        <ul>
          <li><Link href="/drugs">Browse the 500 most expensive drugs</Link> driving Medicare Part D costs</li>
          <li><Link href="/brand-vs-generic">Explore the brand vs generic divide</Link> and potential savings</li>
          <li><Link href="/risk-explorer">Use the Risk Explorer</Link> to filter providers by cost-related risk flags</li>
          <li><Link href="/analysis/most-expensive-prescribers">See our full analysis</Link> of the most expensive prescribers</li>
        </ul>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-blue-800">Explore the data: <Link href="/brand-vs-generic" className="text-primary font-medium hover:underline">Brand vs Generic Analysis →</Link></p>
          <p className="text-sm text-blue-800">Cost outliers are a key input to our <Link href="/ml-fraud-detection" className="text-primary font-medium hover:underline">ML Fraud Detection model →</Link></p>
          <p className="text-sm text-blue-800">Deep dive: <Link href="/analysis/160-million-prescriber" className="text-primary font-medium hover:underline">The $160 Million Prescriber — investigating Medicare&apos;s #1 most expensive doctor →</Link></p>
        </div>
      <RelatedAnalysis current={"/analysis/cost-outliers"} />
      </div>
    </div>
  )
}
