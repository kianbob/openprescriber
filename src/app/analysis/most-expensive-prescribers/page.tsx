import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'
import RelatedAnalysis from '@/components/RelatedAnalysis'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'The Most Expensive Prescribers in Medicare Part D | OpenPrescriber',
  description: 'Deep dive into the top prescribers by total cost. Who are they, what specialties do they represent, and is their spending justified? Cost per beneficiary analysis.',
  alternates: { canonical: 'https://openprescriber.vercel.app/analysis/most-expensive-prescribers' },
  openGraph: {
    title: 'The Most Expensive Prescribers in Medicare Part D',
    description: 'Deep dive into the top prescribers by total cost — who they are, what they prescribe, and whether their spending is justified.',
    url: 'https://openprescriber.vercel.app/analysis/most-expensive-prescribers',
    type: 'article',
  },
}

interface TopCostProvider {
  npi: string
  name: string
  credentials: string
  city: string
  state: string
  specialty: string
  claims: number
  cost: number
  benes: number
  opioidRate: number
  opioidLARate: number
  brandPct: number
  costPerBene: number
  riskScore: number
  riskFlags: string[]
  riskLevel: string
  isExcluded: boolean
}

export default function MostExpensivePrescribersPage() {
  const stats = loadData('stats.json')
  const topCost = loadData('top-cost.json') as TopCostProvider[]

  // Top 50 by cost
  const top50 = topCost.slice(0, 50)
  const top100 = topCost.slice(0, 100)

  // Specialty breakdown of top 100
  const specialtyMap = new Map<string, { count: number; totalCost: number; totalClaims: number }>()
  top100.forEach(p => {
    const existing = specialtyMap.get(p.specialty) || { count: 0, totalCost: 0, totalClaims: 0 }
    existing.count++
    existing.totalCost += p.cost
    existing.totalClaims += p.claims
    specialtyMap.set(p.specialty, existing)
  })
  const specialtyBreakdown = Array.from(specialtyMap.entries())
    .map(([specialty, data]) => ({ specialty, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)

  // State breakdown of top 100
  const stateMap = new Map<string, number>()
  top100.forEach(p => stateMap.set(p.state, (stateMap.get(p.state) || 0) + 1))
  const stateBreakdown = Array.from(stateMap.entries())
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Highest cost per beneficiary
  const highCostPerBene = top100
    .filter(p => p.benes > 0)
    .sort((a, b) => b.costPerBene - a.costPerBene)
    .slice(0, 10)

  // Risk analysis
  const flaggedInTop100 = top100.filter(p => p.riskScore > 0)
  const excludedInTop = top100.filter(p => p.isExcluded)
  const highOpioidInTop = top100.filter(p => p.opioidRate > 30)

  // Average metrics
  const avgCost = top100.reduce((s, p) => s + p.cost, 0) / top100.length
  const avgClaims = top100.reduce((s, p) => s + p.claims, 0) / top100.length
  const totalCostTop100 = top100.reduce((s, p) => s + p.cost, 0)
  const avgBrandPct = top100.reduce((s, p) => s + p.brandPct, 0) / top100.length

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema
        title="The Most Expensive Prescribers in Medicare Part D"
        description="Deep dive into the top prescribers by total cost in Medicare Part D."
        slug="most-expensive-prescribers"
        date="2026-03-02"
      />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Most Expensive Prescribers' }]} />
      <DisclaimerBanner variant="risk" />

      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">
        The Most Expensive Prescribers in Medicare Part D
      </h1>
      <p className="text-sm text-gray-500 mb-4">Analysis · March 2026</p>
      <ShareButtons title="The Most Expensive Prescribers in Medicare Part D" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg">
          Not all prescribers cost the same. Among {fmt(stats.providers)} Medicare Part D providers, a small number
          generate vastly disproportionate drug spending. But high cost doesn&apos;t necessarily mean bad practice —
          an oncologist prescribing life-saving cancer drugs will always cost more than a family doctor writing
          prescriptions for blood pressure medication. The question is: <strong>which high-cost prescribers are
          justified, and which warrant scrutiny?</strong>
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmtMoney(totalCostTop100)}</p>
            <p className="text-xs text-blue-600">Top 100 Total Cost</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmtMoney(avgCost)}</p>
            <p className="text-xs text-blue-600">Avg Cost (Top 100)</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{Math.round(avgClaims)}</p>
            <p className="text-xs text-blue-600">Avg Claims (Top 100)</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">{flaggedInTop100.length}</p>
            <p className="text-xs text-red-600">Flagged for Risk</p>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">The Top 25 Most Expensive Prescribers</h2>
        <p>
          These are the providers who generated the most drug spending in Medicare Part D. The list reveals a mix
          of specialties, practice sizes, and geographic locations:
        </p>

        <div className="not-prose overflow-x-auto my-6">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-2 py-2 text-left font-semibold text-blue-900">#</th>
                <th className="px-2 py-2 text-left font-semibold text-blue-900">Provider</th>
                <th className="px-2 py-2 text-left font-semibold text-blue-900">Specialty</th>
                <th className="px-2 py-2 text-left font-semibold text-blue-900">Location</th>
                <th className="px-2 py-2 text-right font-semibold text-blue-900">Total Cost</th>
                <th className="px-2 py-2 text-right font-semibold text-blue-900">Claims</th>
                <th className="px-2 py-2 text-right font-semibold text-blue-900">$/Bene</th>
                <th className="px-2 py-2 text-right font-semibold text-blue-900">Risk</th>
              </tr>
            </thead>
            <tbody>
              {top50.slice(0, 25).map((p, i) => (
                <tr key={p.npi} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-2 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-2 py-1.5 font-medium">
                    <Link href={`/providers/${p.npi}`} className="text-[#1e40af] hover:underline">
                      {p.name}
                    </Link>
                    {p.credentials && <span className="text-gray-400 ml-1">{p.credentials}</span>}
                  </td>
                  <td className="px-2 py-1.5">{p.specialty}</td>
                  <td className="px-2 py-1.5">{p.city}, {p.state}</td>
                  <td className="px-2 py-1.5 text-right font-medium">{fmtMoney(p.cost)}</td>
                  <td className="px-2 py-1.5 text-right">{fmt(p.claims)}</td>
                  <td className="px-2 py-1.5 text-right">{p.costPerBene > 0 ? fmtMoney(p.costPerBene) : '—'}</td>
                  <td className="px-2 py-1.5 text-right">
                    {p.riskLevel === 'elevated' && <span className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded text-xs">⚠</span>}
                    {p.riskLevel === 'moderate' && <span className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-xs">△</span>}
                    {p.riskLevel === 'low' && <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs">✓</span>}
                    {p.riskLevel === 'high' && <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-xs">🔴</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Which Specialties Dominate?</h2>
        <p>
          The specialty distribution of top-cost prescribers tells an important story about where Medicare drug
          dollars actually flow:
        </p>

        <div className="not-prose overflow-x-auto my-6">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-2 text-left font-semibold text-blue-900">Specialty</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900"># in Top 100</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900">Total Cost</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900">Avg Cost/Provider</th>
              </tr>
            </thead>
            <tbody>
              {specialtyBreakdown.map((s, i) => (
                <tr key={s.specialty} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 font-medium">{s.specialty}</td>
                  <td className="px-4 py-2 text-right">{s.count}</td>
                  <td className="px-4 py-2 text-right">{fmtMoney(s.totalCost)}</td>
                  <td className="px-4 py-2 text-right">{fmtMoney(Math.round(s.totalCost / s.count))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>Justified vs. Questionable High Cost</h3>
        <p>
          Context matters enormously when evaluating prescriber cost. Some specialties <em>should</em> generate
          high drug costs:
        </p>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <h4 className="font-bold text-green-900 mb-2">✓ Expected High Cost</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• <strong>Oncology</strong> — Cancer drugs routinely cost $10K-$50K/month</li>
              <li>• <strong>Nephrology</strong> — Kidney disease drugs (EPO, immunosuppressants)</li>
              <li>• <strong>Rheumatology</strong> — Biologics like Humira cost $5K-$7K/month</li>
              <li>• <strong>Neurology</strong> — MS drugs, seizure medications</li>
              <li>• <strong>Infectious Disease</strong> — HIV antiretrovirals, hepatitis C cures</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <h4 className="font-bold text-red-900 mb-2">⚠ Warrants Scrutiny</h4>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• <strong>Family Practice</strong> with costs above $50K</li>
              <li>• <strong>Nurse Practitioners</strong> with very high per-beneficiary costs</li>
              <li>• <strong>Dentists/Optometrists</strong> generating high drug costs</li>
              <li>• Any provider with high costs AND high opioid rates</li>
              <li>• Providers with extreme brand preference + high cost</li>
            </ul>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Geographic Distribution</h2>
        <p>
          Where are the most expensive prescribers located? The state distribution of the top 100 reveals
          concentration in large population states, but some smaller states are overrepresented:
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-5 gap-3 my-6">
          {stateBreakdown.map(s => (
            <div key={s.state} className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
              <p className="text-xl font-bold text-blue-700">{s.state}</p>
              <p className="text-sm text-blue-600">{s.count} providers</p>
            </div>
          ))}
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Cost Per Beneficiary: The Real Measure</h2>
        <p>
          Total cost alone is misleading. A provider seeing 500 patients who generates $80K in drug costs is
          different from one seeing 10 patients who generates the same. Cost per beneficiary normalizes for
          patient volume and reveals which providers are prescribing the most expensive drugs per person:
        </p>

        <div className="not-prose overflow-x-auto my-6">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-3 py-2 text-left font-semibold text-blue-900">Provider</th>
                <th className="px-3 py-2 text-left font-semibold text-blue-900">Specialty</th>
                <th className="px-3 py-2 text-right font-semibold text-blue-900">Cost/Bene</th>
                <th className="px-3 py-2 text-right font-semibold text-blue-900">Benes</th>
                <th className="px-3 py-2 text-right font-semibold text-blue-900">Total Cost</th>
                <th className="px-3 py-2 text-right font-semibold text-blue-900">Brand %</th>
              </tr>
            </thead>
            <tbody>
              {highCostPerBene.map((p, i) => (
                <tr key={p.npi} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 font-medium">
                    <Link href={`/providers/${p.npi}`} className="text-[#1e40af] hover:underline">{p.name}</Link>
                  </td>
                  <td className="px-3 py-2">{p.specialty}</td>
                  <td className="px-3 py-2 text-right font-bold text-red-700">{fmtMoney(p.costPerBene)}</td>
                  <td className="px-3 py-2 text-right">{fmt(p.benes)}</td>
                  <td className="px-3 py-2 text-right">{fmtMoney(p.cost)}</td>
                  <td className="px-3 py-2 text-right">{p.brandPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          The national average cost per beneficiary is roughly {fmtMoney(Math.round(stats.cost / (stats.benes || 1)))}. Providers
          at 10x or more above this average are worth investigating — though specialty context is essential.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">Risk Flags Among Top Prescribers</h2>
        <p>
          Of the top 100 most expensive prescribers, {flaggedInTop100.length} have at least one risk flag in our
          scoring system. The flags found include:
        </p>

        <div className="not-prose space-y-3 my-6">
          {flaggedInTop100.slice(0, 8).map(p => (
            <div key={p.npi} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex items-center justify-between">
              <div>
                <Link href={`/providers/${p.npi}`} className="font-medium text-[#1e40af] hover:underline">{p.name}</Link>
                <span className="text-sm text-gray-500 ml-2">{p.specialty} · {p.city}, {p.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{fmtMoney(p.cost)}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  p.riskLevel === 'elevated' ? 'bg-orange-100 text-orange-800' :
                  p.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                  p.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {p.riskFlags.join(', ')}
                </span>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">The Brand Name Premium</h2>
        <p>
          Among the top 100 most expensive prescribers, the average brand-name prescription rate is {avgBrandPct.toFixed(1)}%
          (vs. the national average of {stats.brandPct}%). Some of the highest-cost providers prescribe brands at
          extraordinarily high rates:
        </p>

        {(() => {
          const highBrand = top100.filter(p => p.brandPct > 30).sort((a, b) => b.brandPct - a.brandPct).slice(0, 5)
          return highBrand.length > 0 ? (
            <div className="not-prose space-y-2 my-6">
              {highBrand.map(p => (
                <div key={p.npi} className="flex items-center justify-between bg-amber-50 rounded-lg px-4 py-3 border border-amber-200">
                  <div>
                    <Link href={`/providers/${p.npi}`} className="font-medium text-[#1e40af] hover:underline">{p.name}</Link>
                    <span className="text-sm text-gray-500 ml-2">{p.specialty}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-800">{p.brandPct}% brand</span>
                    <span className="text-sm text-gray-500 ml-2">{fmtMoney(p.cost)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : null
        })()}

        <h2 className="font-[family-name:var(--font-heading)]">What This Means for Medicare</h2>
        <p>
          The concentration of drug costs among a relatively small number of prescribers has important policy
          implications:
        </p>
        <ul>
          <li><strong>Targeted oversight</strong> — Monitoring the top 1% of prescribers by cost could capture a disproportionate share of wasteful spending</li>
          <li><strong>Specialty-adjusted benchmarks</strong> — Comparing prescribers to their peers within the same specialty is more meaningful than raw cost rankings</li>
          <li><strong>Biosimilar adoption</strong> — High-cost prescribers in oncology and rheumatology who aren&apos;t using available biosimilars represent a significant savings opportunity</li>
          <li><strong>Prior authorization</strong> — While burdensome, prior auth for the most expensive drugs can redirect spending when cheaper alternatives exist</li>
        </ul>

        <div className="not-prose bg-gray-50 border border-gray-200 rounded-xl p-6 my-8">
          <h4 className="font-bold text-gray-900 mb-2">📚 Data Sources & Methodology</h4>
          <p className="text-sm text-gray-600">
            Provider-level data is from CMS Medicare Part D Prescriber Public Use File (2023). Cost figures represent
            total drug costs attributed to each prescriber. Risk scores are calculated using our multi-factor model
            (see <Link href="/analysis/fraud-risk-methodology" className="text-[#1e40af] hover:underline">methodology</Link>).
            This analysis uses top-cost.json containing the highest-cost providers in our dataset.
          </p>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Explore Related Analysis</h2>
        <ul>
          <li><Link href="/analysis/cost-outliers" className="text-[#1e40af] hover:underline">Who Are the Highest-Cost Prescribers?</Link></li>
          <li><Link href="/analysis/specialty-deep-dive" className="text-[#1e40af] hover:underline">Which Specialties Drive the Most Spending?</Link></li>
          <li><Link href="/analysis/pharmacy-benefit-managers" className="text-[#1e40af] hover:underline">PBMs: The Middlemen Driving Drug Costs</Link></li>
          <li><Link href="/analysis/brand-generic-gap" className="text-[#1e40af] hover:underline">Brand vs Generic: The Prescribing Gap</Link></li>
          <li><Link href="/analysis/fraud-risk-methodology" className="text-[#1e40af] hover:underline">How We Score Prescribing Risk</Link></li>
        </ul>
      </div>

      <RelatedAnalysis current="/analysis/most-expensive-prescribers" />
    </div>
  )
}
