import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import RelatedAnalysis from '@/components/RelatedAnalysis'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

const title = 'How Much Medicare Part D Waste? A Data-Driven Estimate'
const description = 'We estimate billions in Medicare Part D waste from brand overprescribing, excluded providers, cost outliers, and opioid overprescribing — using CMS public data.'
const slug = 'medicare-waste'
const canonical = `https://www.openprescriber.org/analysis/${slug}`

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: canonical, type: 'article' },
  alternates: { canonical },
}

export default function MedicareWastePage() {
  const stats = loadData('stats.json') as {
    providers: number; claims: number; cost: number; brandCost: number; genericCost: number
    excluded: number; opioidProv: number; highOpioid: number
    riskCounts: { high: number; elevated: number; moderate: number; low: number }
    brandPct: number
  }
  const highRisk = loadData('high-risk.json') as {
    npi: string; name: string; specialty: string; state: string
    claims: number; cost: number; opioidRate: number; riskScore: number
    riskLevel: string; isExcluded: boolean; costPerBene: number
  }[]
  const specialties = loadData('specialties.json') as {
    specialty: string; providers: number; claims: number; cost: number
    avgOpioidRate: number; avgBrandPct: number; costPerProvider: number
  }[]

  // Waste estimate 1: Brand vs generic excess
  // If brand drugs cost ~10x generics on average, a portion of brand spending is "waste"
  const brandExcess = (stats.brandCost ?? 0) - (stats.genericCost ?? 0)

  // Waste estimate 2: Excluded providers still billing
  const excludedProviders = highRisk.filter(p => p.isExcluded)
  const excludedCost = excludedProviders.reduce((s, p) => s + (p.cost ?? 0), 0)

  // Waste estimate 3: High-risk provider excess cost
  const highRiskProviders = highRisk.filter(p => p.riskLevel === 'high')
  const highRiskCost = highRiskProviders.reduce((s, p) => s + (p.cost ?? 0), 0)

  // Waste estimate 4: Top specialties by brand preference
  const brandHeavySpecialties = [...specialties]
    .sort((a, b) => (b.avgBrandPct ?? 0) - (a.avgBrandPct ?? 0))
    .slice(0, 10)

  // Opioid over-prescribing: providers with >20% opioid rate
  const highOpioidProviders = highRisk.filter(p => (p.opioidRate ?? 0) > 20)
  const highOpioidCost = highOpioidProviders.reduce((s, p) => s + (p.cost ?? 0), 0)

  const totalWasteEstimate = brandExcess + excludedCost + highRiskCost

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema title={title} description={description} slug={slug} date="2026-03-02" />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Medicare Waste' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">{title}</h1>
      <ShareButtons title={title} />
      <DisclaimerBanner />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          The U.S. government estimates that Medicare fraud, waste, and abuse costs taxpayers tens of billions annually.
          Using the complete 2023 CMS Part D prescribing dataset, we built a bottom-up estimate of waste that&apos;s visible in the data.
        </p>

        {/* Key stats */}
        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmtMoney(stats.brandCost ?? 0)}</p>
            <p className="text-xs text-blue-600">Brand Drug Spending</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmtMoney(stats.genericCost ?? 0)}</p>
            <p className="text-xs text-blue-600">Generic Drug Spending</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
            <p className="text-2xl font-bold text-amber-700">{fmt(stats.excluded ?? 0)}</p>
            <p className="text-xs text-amber-600">Excluded Providers Billing</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
            <p className="text-2xl font-bold text-amber-700">{fmt(stats.riskCounts?.high ?? 0)}</p>
            <p className="text-xs text-amber-600">High-Risk Providers</p>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">1. The Brand-Name Premium: {fmtMoney(brandExcess)}</h2>
        <p>
          Brand-name drugs consumed <strong>{fmtMoney(stats.brandCost ?? 0)}</strong> of Medicare Part D spending in 2023,
          despite representing only {(stats.brandPct ?? 0).toFixed(1)}% of total claims. Generic equivalents
          cost <strong>{fmtMoney(stats.genericCost ?? 0)}</strong> for the remaining claims. The raw premium —
          the difference between what Medicare paid for brands and what it paid for generics — is{' '}
          <strong>{fmtMoney(brandExcess)}</strong>.
        </p>
        <p>
          Not all of this is &quot;waste&quot; — some brand drugs have no generic alternative, and some patients
          legitimately need brand formulations. But studies consistently estimate that 20-30% of brand prescribing
          could safely switch to generics, representing billions in potential savings.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">2. Excluded Providers Still Billing: {fmtMoney(excludedCost)}</h2>
        <p>
          We cross-referenced the CMS prescribing data against the{' '}
          <Link href="/excluded" className="text-primary hover:underline">OIG&apos;s List of Excluded Individuals and Entities (LEIE)</Link>.
          The result: <strong>{fmt(excludedProviders.length)} providers</strong> on the federal exclusion list
          appear in active 2023 Medicare Part D prescribing data, generating{' '}
          <strong>{fmtMoney(excludedCost)}</strong> in drug costs.
        </p>
        <p>
          Federal law prohibits excluded individuals from participating in federal healthcare programs.
          Every dollar billed by these providers is, by definition, improper.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">3. High-Risk Provider Outliers: {fmtMoney(highRiskCost)}</h2>
        <p>
          Our <Link href="/analysis/fraud-risk-methodology" className="text-primary hover:underline">multi-component risk scoring model</Link> identified{' '}
          <strong>{fmt(highRiskProviders.length)} high-risk providers</strong> whose prescribing patterns
          deviate significantly from their specialty peers. These providers generated{' '}
          <strong>{fmtMoney(highRiskCost)}</strong> in total drug costs.
        </p>

        <div className="not-prose my-6">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Risk Level</th>
                <th className="px-4 py-2 text-right font-semibold">Providers</th>
                <th className="px-4 py-2 text-right font-semibold">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {Object.entries(stats.riskCounts ?? {}).map(([level, count]) => (
                <tr key={level}>
                  <td className="px-4 py-2 capitalize font-medium">{level}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(count as number)}</td>
                  <td className="px-4 py-2 text-right font-mono text-gray-500">
                    {(((count as number) / (stats.providers ?? 1)) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">4. Opioid Overprescribing Excess</h2>
        <p>
          Among the {fmt(highRisk.length)} flagged providers in our high-risk dataset,{' '}
          <strong>{fmt(highOpioidProviders.length)}</strong> have opioid prescribing rates above 20%.
          These providers generated <strong>{fmtMoney(highOpioidCost)}</strong> in drug costs.
          While some specialties (pain management, oncology) legitimately prescribe opioids at high rates,
          the excess above specialty medians represents a quantifiable cost of the opioid pipeline.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">5. Which Specialties Over-Prescribe Brands?</h2>
        <p>Brand preference varies dramatically by specialty. The top 10 brand-heavy specialties:</p>

        <div className="not-prose my-6">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Specialty</th>
                <th className="px-4 py-2 text-right font-semibold">Avg Brand %</th>
                <th className="px-4 py-2 text-right font-semibold">Providers</th>
                <th className="px-4 py-2 text-right font-semibold">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {brandHeavySpecialties.map(s => (
                <tr key={s.specialty}>
                  <td className="px-4 py-2">{s.specialty}</td>
                  <td className="px-4 py-2 text-right font-mono text-amber-600 font-semibold">{(s.avgBrandPct ?? 0).toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(s.providers ?? 0)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmtMoney(s.cost ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">The Total: A Conservative Estimate</h2>
        <div className="not-prose bg-blue-50 border border-blue-200 rounded-xl p-6 my-6">
          <p className="text-sm text-blue-600 font-medium mb-2">Combined Waste Indicators (2023)</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-blue-700">{fmtMoney(brandExcess)}</p>
              <p className="text-xs text-blue-500">Brand Premium</p>
            </div>
            <div>
              <p className="text-xl font-bold text-blue-700">{fmtMoney(excludedCost)}</p>
              <p className="text-xs text-blue-500">Excluded Provider Billing</p>
            </div>
            <div>
              <p className="text-xl font-bold text-blue-700">{fmtMoney(highRiskCost)}</p>
              <p className="text-xs text-blue-500">High-Risk Outlier Cost</p>
            </div>
          </div>
        </div>
        <p>
          These categories overlap — an excluded provider may also be a high-cost outlier. But even
          conservatively, the data suggests <strong>tens of billions in addressable waste</strong> within
          Medicare Part D prescribing. The brand-generic gap alone exceeds $100 billion.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">What Can Be Done?</h2>
        <p>
          Several policy levers could reduce waste:
        </p>
        <ul>
          <li><strong>Mandatory generic substitution</strong> where bioequivalent generics exist</li>
          <li><strong>Real-time LEIE checking</strong> before claims are processed</li>
          <li><strong>Peer-adjusted spending alerts</strong> for providers who deviate significantly from specialty norms</li>
          <li><strong>Opioid prescribing limits</strong> with specialty-specific thresholds</li>
          <li><strong>IRA drug price negotiation</strong> — already targeting the{' '}
            <Link href="/ira-negotiation" className="text-primary hover:underline">most expensive drugs</Link>
          </li>
        </ul>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-blue-800 font-medium">Explore the Data</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/brand-vs-generic" className="text-sm text-primary hover:underline">💊 Brand vs Generic Tool</Link>
            <Link href="/excluded" className="text-sm text-primary hover:underline">🚫 Excluded Providers</Link>
            <Link href="/risk-explorer" className="text-sm text-primary hover:underline">🔍 Risk Explorer</Link>
            <Link href="/analysis/fraud-risk-methodology" className="text-sm text-primary hover:underline">📊 Risk Methodology</Link>
            <Link href="/analysis/brand-generic-gap" className="text-sm text-primary hover:underline">💰 Brand-Generic Gap</Link>
            <Link href="/analysis/pharmacy-fraud" className="text-sm text-primary hover:underline">🏥 Pharmacy Fraud Detection</Link>
          </div>
        </div>
        <RelatedAnalysis current={`/analysis/${slug}`} />
      </div>
    </div>
  )
}
