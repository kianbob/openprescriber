import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import RelatedAnalysis from '@/components/RelatedAnalysis'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

const title = 'Pharmacy Fraud in Medicare: How We Detect It'
const description = 'How we use machine learning, statistical analysis, and OIG exclusion data to detect pharmacy fraud patterns in Medicare Part D prescribing data.'
const slug = 'pharmacy-fraud'
const canonical = `https://www.openprescriber.org/analysis/${slug}`

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: canonical, type: 'article' },
  alternates: { canonical },
}

export default function PharmacyFraudPage() {
  const stats = loadData('stats.json') as {
    providers: number; claims: number; cost: number; excluded: number
    riskCounts: { high: number; elevated: number; moderate: number; low: number }
  }
  const mlData = loadData('ml-predictions.json') as {
    model: { type: string; trees: number; maxDepth: number; features: number; fraudLabels: number; threshold: number }
    cv: { precision: number; recall: number; f1: number }
    recall: number; totalScored: number; totalFlagged: number
    predictions: {
      npi: string; name: string; city: string; state: string; specialty: string
      mlScore: number; claims: number; cost: number; opioidRate: number; brandPct: number; costPerBene: number
    }[]
  }
  const highRisk = loadData('high-risk.json') as {
    npi: string; name: string; specialty: string; state: string; city: string
    claims: number; cost: number; opioidRate: number; riskScore: number
    riskLevel: string; isExcluded: boolean; costPerBene: number; riskFlags: string[]
  }[]
  const excluded = loadData('excluded.json') as {
    npi: string; name: string; specialty: string; state: string; city: string
    claims: number; cost: number; riskScore: number; riskLevel: string; isExcluded: boolean
  }[]

  const mlPredictions = mlData.predictions ?? []
  const topML = [...mlPredictions].sort((a, b) => (b.mlScore ?? 0) - (a.mlScore ?? 0)).slice(0, 10)
  const highRiskExcluded = highRisk.filter(p => p.isExcluded)
  const highRiskHigh = highRisk.filter(p => p.riskLevel === 'high')

  // Case studies: providers that are both ML-flagged and in high-risk
  const mlNpis = new Set(mlPredictions.map(p => p.npi))
  const dualFlagged = highRiskHigh.filter(p => mlNpis.has(p.npi)).slice(0, 5)

  // Breakdown by risk flag
  const flagCounts: Record<string, number> = {}
  highRisk.forEach(p => {
    (p.riskFlags ?? []).forEach(f => { flagCounts[f] = (flagCounts[f] ?? 0) + 1 })
  })
  const topFlags = Object.entries(flagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema title={title} description={description} slug={slug} date="2026-03-02" />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Pharmacy Fraud Detection' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">{title}</h1>
      <ShareButtons title={title} />
      <DisclaimerBanner variant="ml" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          Medicare fraud costs taxpayers an estimated $60 billion per year. We built a multi-layered detection
          system that combines statistical analysis, peer comparison, and machine learning to identify
          prescribing patterns consistent with fraud — all from public CMS data.
        </p>

        {/* Key stats */}
        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmt(mlData.totalScored ?? 0)}</p>
            <p className="text-xs text-blue-600">Providers Scored by ML</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmt(mlData.totalFlagged ?? 0)}</p>
            <p className="text-xs text-blue-600">ML-Flagged Providers</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
            <p className="text-2xl font-bold text-amber-700">{fmt(highRisk.length)}</p>
            <p className="text-xs text-amber-600">High-Risk (Rule-Based)</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
            <p className="text-2xl font-bold text-amber-700">{fmt(excluded.length)}</p>
            <p className="text-xs text-amber-600">OIG-Excluded Active</p>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Our Three-Layer Detection Approach</h2>

        <h3 className="font-[family-name:var(--font-heading)]">Layer 1: Rule-Based Risk Scoring</h3>
        <p>
          Our <Link href="/analysis/fraud-risk-methodology" className="text-primary hover:underline">10-component risk scoring model</Link>{' '}
          evaluates every provider against their specialty peers. Components include:
        </p>
        <ul>
          <li>Opioid prescribing rate vs. specialty median (z-score)</li>
          <li>Population-level opioid percentile</li>
          <li>Cost outlier detection (per-beneficiary)</li>
          <li>Brand preference vs. peers</li>
          <li>Long-acting opioid rates</li>
          <li>Antipsychotic prescribing patterns</li>
          <li>Dangerous drug combinations (opioid+benzo)</li>
          <li>OIG exclusion list matching</li>
          <li>Low drug diversity (few unique drugs, many claims)</li>
          <li>Frequent fill patterns</li>
        </ul>

        <div className="not-prose my-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">Most Common Risk Flags</p>
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Flag</th>
                <th className="px-4 py-2 text-right font-semibold">Providers</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topFlags.map(([flag, count]) => (
                <tr key={flag}>
                  <td className="px-4 py-2 font-mono text-xs">{flag}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(count)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="font-[family-name:var(--font-heading)]">Layer 2: Machine Learning</h3>
        <p>
          We trained a <strong>{mlData.model?.type ?? 'ensemble'}</strong> model using{' '}
          <strong>{fmt(mlData.model?.fraudLabels ?? 0)} confirmed fraud labels</strong> from OIG enforcement
          actions. The model uses {mlData.model?.features ?? 0} features to identify prescribing patterns
          that resemble known fraud cases.
        </p>

        <div className="not-prose bg-blue-50 border border-blue-200 rounded-xl p-6 my-6">
          <p className="text-sm font-semibold text-blue-800 mb-3">Model Performance</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-blue-700">{((mlData.cv?.precision ?? 0) * 100).toFixed(1)}%</p>
              <p className="text-xs text-blue-500">Precision</p>
            </div>
            <div>
              <p className="text-xl font-bold text-blue-700">{((mlData.cv?.recall ?? 0) * 100).toFixed(1)}%</p>
              <p className="text-xs text-blue-500">Recall (CV)</p>
            </div>
            <div>
              <p className="text-xl font-bold text-blue-700">{((mlData.cv?.f1 ?? 0) * 100).toFixed(1)}%</p>
              <p className="text-xs text-blue-500">F1 Score</p>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-3">
            Cross-validated on held-out fraud labels. Production recall on full LEIE match set: {((mlData.recall ?? 0) * 100).toFixed(1)}%.
          </p>
        </div>

        <p>
          The model flagged <strong>{fmt(mlData.totalFlagged ?? 0)} providers</strong> out of{' '}
          {fmt(mlData.totalScored ?? 0)} scored — a flag rate of{' '}
          {mlData.totalScored > 0 ? (((mlData.totalFlagged ?? 0) / mlData.totalScored) * 100).toFixed(2) : '0'}%.
          This is intentionally conservative: high precision minimizes false positives.
        </p>

        <h3 className="font-[family-name:var(--font-heading)]">Layer 3: OIG Exclusion Cross-Reference</h3>
        <p>
          We match all prescribers against the{' '}
          <Link href="/excluded" className="text-primary hover:underline">OIG List of Excluded Individuals and Entities (LEIE)</Link>.
          Result: <strong>{fmt(excluded.length)} excluded providers</strong> appear in active 2023 prescribing data.
          These providers are <em>prohibited by federal law</em> from billing Medicare.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">Top ML-Flagged Providers</h2>
        <p>Providers with the highest machine learning fraud probability scores:</p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Provider</th>
                <th className="px-3 py-2 text-left font-semibold">Specialty</th>
                <th className="px-3 py-2 text-left font-semibold">State</th>
                <th className="px-3 py-2 text-right font-semibold">ML Score</th>
                <th className="px-3 py-2 text-right font-semibold">Cost</th>
                <th className="px-3 py-2 text-right font-semibold">Opioid %</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topML.map(p => (
                <tr key={p.npi} className="bg-red-50">
                  <td className="px-3 py-2">
                    <Link href={`/providers/${p.npi}`} className="text-primary hover:underline text-xs">{p.name}</Link>
                  </td>
                  <td className="px-3 py-2 text-xs">{p.specialty}</td>
                  <td className="px-3 py-2 text-xs">{p.state}</td>
                  <td className="px-3 py-2 text-right font-mono text-red-600 font-semibold">{(p.mlScore ?? 0).toFixed(2)}</td>
                  <td className="px-3 py-2 text-right font-mono">{fmtMoney(p.cost ?? 0)}</td>
                  <td className="px-3 py-2 text-right font-mono">{(p.opioidRate ?? 0).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Case Studies: Dual-Flagged Providers</h2>
        <p>
          Providers flagged by <em>both</em> our rule-based system (high risk score) and the ML model
          represent the strongest signals. Here are examples:
        </p>

        {dualFlagged.length > 0 ? (
          <div className="not-prose space-y-4 my-6">
            {dualFlagged.map(p => (
              <div key={p.npi} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/providers/${p.npi}`} className="text-primary hover:underline font-semibold">{p.name}</Link>
                    <p className="text-xs text-gray-500">{p.specialty} — {p.city}, {p.state}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">
                      Risk: {p.riskScore ?? 0}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
                  <div><span className="text-gray-500">Claims:</span> <span className="font-mono">{fmt(p.claims ?? 0)}</span></div>
                  <div><span className="text-gray-500">Cost:</span> <span className="font-mono">{fmtMoney(p.cost ?? 0)}</span></div>
                  <div><span className="text-gray-500">Opioid:</span> <span className="font-mono text-red-600">{(p.opioidRate ?? 0).toFixed(1)}%</span></div>
                  <div><span className="text-gray-500">Excluded:</span> <span className="font-mono">{p.isExcluded ? '⚠️ Yes' : 'No'}</span></div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(p.riskFlags ?? []).map(f => (
                    <span key={f} className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">{f}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No dual-flagged providers found in current dataset.</p>
        )}

        <h2 className="font-[family-name:var(--font-heading)]">How Pharmacy Fraud Works</h2>
        <p>Common pharmacy fraud schemes that our system can detect signals of:</p>

        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-semibold text-sm mb-1">💊 Phantom Billing</p>
            <p className="text-xs text-gray-600">Billing for prescriptions never dispensed. Signal: high claims volume with few unique beneficiaries.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-semibold text-sm mb-1">🔄 Upcoding</p>
            <p className="text-xs text-gray-600">Substituting cheaper generics but billing for brand. Signal: abnormally high brand percentage vs peers.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-semibold text-sm mb-1">🏭 Pill Mill Operations</p>
            <p className="text-xs text-gray-600">High-volume controlled substance dispensing. Signal: extreme opioid rates, low drug diversity.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-semibold text-sm mb-1">🚫 Excluded Provider Billing</p>
            <p className="text-xs text-gray-600">Billing through another provider&apos;s credentials. Signal: LEIE match with active claims.</p>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Limitations & Ethics</h2>
        <p>
          Our detection system identifies <em>statistical patterns</em>, not confirmed fraud. Important caveats:
        </p>
        <ul>
          <li>A high risk score or ML flag is <strong>not an accusation</strong> — many legitimate reasons can explain outlier patterns</li>
          <li>Pain management, oncology, and palliative care providers will naturally score higher on opioid metrics</li>
          <li>Rural providers may appear as cost outliers due to smaller patient panels</li>
          <li>Only law enforcement with full claims data can determine actual fraud</li>
        </ul>

        <div className="not-prose bg-blue-50 border border-blue-200 rounded-xl p-6 my-6">
          <p className="text-sm font-semibold text-blue-800 mb-2">Our Goal</p>
          <p className="text-sm text-blue-700">
            We aim to make public data accessible for transparency. Every data point comes from
            CMS public use files. We provide analysis — not accusations. If you believe our data
            contains errors, <Link href="/methodology" className="text-primary hover:underline">contact us</Link>.
          </p>
        </div>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-blue-800 font-medium">Explore Fraud Detection</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/ml-fraud-detection" className="text-sm text-primary hover:underline">🤖 ML Fraud Detection</Link>
            <Link href="/risk-explorer" className="text-sm text-primary hover:underline">🔍 Risk Explorer</Link>
            <Link href="/excluded" className="text-sm text-primary hover:underline">🚫 Excluded Providers</Link>
            <Link href="/analysis/fraud-risk-methodology" className="text-sm text-primary hover:underline">📊 Risk Methodology</Link>
            <Link href="/analysis/doctor-shopping" className="text-sm text-primary hover:underline">💊 Doctor Shopping</Link>
            <Link href="/analysis/medicare-waste" className="text-sm text-primary hover:underline">💰 Medicare Waste</Link>
          </div>
        </div>
        <RelatedAnalysis current={`/analysis/${slug}`} />
      </div>
    </div>
  )
}
