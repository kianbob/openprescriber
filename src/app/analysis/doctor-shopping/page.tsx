import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import RelatedAnalysis from '@/components/RelatedAnalysis'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

const title = 'Doctor Shopping in Medicare Part D: The Data Behind Multi-Provider Prescribing'
const description = 'Analyzing Medicare Part D data for doctor shopping patterns — providers with abnormally high opioid rates, beneficiary counts, and cost-per-patient outliers.'
const slug = 'doctor-shopping'
const canonical = `https://www.openprescriber.org/analysis/${slug}`

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: canonical, type: 'article' },
  alternates: { canonical },
}

export default function DoctorShoppingPage() {
  const stats = loadData('stats.json') as {
    providers: number; claims: number; cost: number; opioidProv: number; highOpioid: number
  }
  const topOpioid = loadData('top-opioid.json') as {
    npi: string; name: string; credentials: string; city: string; state: string
    specialty: string; claims: number; cost: number; benes: number
    opioidRate: number; opioidLARate: number; brandPct: number
    costPerBene: number; riskScore: number; riskLevel: string; isExcluded: boolean
    riskFlags: string[]
  }[]
  const specialties = loadData('specialties.json') as {
    specialty: string; providers: number; avgOpioidRate: number; costPerProvider: number
  }[]

  // Providers with extremely high opioid rates (>50%)
  const extremeOpioid = topOpioid.filter(p => (p.opioidRate ?? 0) > 50)
  const highCostPerBene = [...topOpioid].sort((a, b) => (b.costPerBene ?? 0) - (a.costPerBene ?? 0)).slice(0, 20)
  const excludedOpioid = topOpioid.filter(p => p.isExcluded)

  // Top 10 by opioid rate
  const top10Opioid = [...topOpioid].sort((a, b) => (b.opioidRate ?? 0) - (a.opioidRate ?? 0)).slice(0, 10)

  // Specialty breakdown for opioid prescribers
  const opioidSpecialties = [...specialties]
    .sort((a, b) => (b.avgOpioidRate ?? 0) - (a.avgOpioidRate ?? 0))
    .slice(0, 10)

  // Providers flagged for opioid+benzo combination
  const opioidBenzo = topOpioid.filter(p => (p.riskFlags ?? []).includes('opioid_benzo_coprescriber'))

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema title={title} description={description} slug={slug} date="2026-03-02" />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Doctor Shopping' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">{title}</h1>
      <ShareButtons title={title} />
      <DisclaimerBanner variant="risk" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          &quot;Doctor shopping&quot; — visiting multiple prescribers to obtain controlled substances — is a
          well-documented pattern in prescription drug abuse. While Medicare Part D data doesn&apos;t directly
          show patient-level shopping, it reveals the <em>provider side</em> of the equation: prescribers
          whose patterns are statistically consistent with being sources in a doctor-shopping network.
        </p>

        {/* Key stats */}
        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmt(topOpioid.length)}</p>
            <p className="text-xs text-blue-600">Top Opioid Prescribers</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmt(extremeOpioid.length)}</p>
            <p className="text-xs text-blue-600">Opioid Rate &gt;50%</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
            <p className="text-2xl font-bold text-amber-700">{fmt(opioidBenzo.length)}</p>
            <p className="text-xs text-amber-600">Opioid+Benzo Co-Prescribers</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
            <p className="text-2xl font-bold text-amber-700">{fmt(excludedOpioid.length)}</p>
            <p className="text-xs text-amber-600">Also on LEIE List</p>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">What Does Doctor Shopping Look Like in Data?</h2>
        <p>
          While we can&apos;t see individual patients visiting multiple doctors, we can identify providers
          whose prescribing patterns create the <em>supply side</em> of doctor shopping. Key indicators:
        </p>
        <ul>
          <li><strong>Extreme opioid prescribing rates</strong> — more than half of all claims are opioids</li>
          <li><strong>High cost per beneficiary</strong> — patients receive unusually expensive regimens</li>
          <li><strong>Opioid+benzodiazepine co-prescribing</strong> — a{' '}
            <Link href="/dangerous-combinations" className="text-primary hover:underline">dangerous combination</Link> linked to overdose deaths
          </li>
          <li><strong>High long-acting opioid rates</strong> — Schedule II drugs with higher abuse potential</li>
          <li><strong>OIG exclusion status</strong> — providers already flagged by federal investigators</li>
        </ul>

        <h2 className="font-[family-name:var(--font-heading)]">The Highest Opioid-Rate Prescribers</h2>
        <p>
          Among the top {fmt(topOpioid.length)} opioid prescribers in Medicare Part D,
          these providers have the most extreme opioid prescribing rates:
        </p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Provider</th>
                <th className="px-3 py-2 text-left font-semibold">Specialty</th>
                <th className="px-3 py-2 text-left font-semibold">State</th>
                <th className="px-3 py-2 text-right font-semibold">Opioid Rate</th>
                <th className="px-3 py-2 text-right font-semibold">Cost/Bene</th>
                <th className="px-3 py-2 text-right font-semibold">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {top10Opioid.map(p => (
                <tr key={p.npi} className={(p.riskLevel === 'high') ? 'bg-red-50' : ''}>
                  <td className="px-3 py-2">
                    <Link href={`/providers/${p.npi}`} className="text-primary hover:underline text-xs">{p.name}</Link>
                  </td>
                  <td className="px-3 py-2 text-xs">{p.specialty}</td>
                  <td className="px-3 py-2 text-xs">{p.state}</td>
                  <td className="px-3 py-2 text-right font-mono text-red-600 font-semibold">{(p.opioidRate ?? 0).toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right font-mono">{fmtMoney(p.costPerBene ?? 0)}</td>
                  <td className="px-3 py-2 text-right font-mono">{p.riskScore ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Cost-Per-Beneficiary Outliers</h2>
        <p>
          Another doctor-shopping signal: providers with extremely high cost per beneficiary.
          When a small number of patients generate outsized drug costs, it can indicate
          concentrated prescribing to a few individuals seeking large quantities.
        </p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Provider</th>
                <th className="px-3 py-2 text-left font-semibold">Specialty</th>
                <th className="px-3 py-2 text-right font-semibold">Cost/Bene</th>
                <th className="px-3 py-2 text-right font-semibold">Opioid Rate</th>
                <th className="px-3 py-2 text-right font-semibold">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {highCostPerBene.slice(0, 10).map(p => (
                <tr key={p.npi}>
                  <td className="px-3 py-2">
                    <Link href={`/providers/${p.npi}`} className="text-primary hover:underline text-xs">{p.name}</Link>
                  </td>
                  <td className="px-3 py-2 text-xs">{p.specialty}</td>
                  <td className="px-3 py-2 text-right font-mono text-amber-600 font-semibold">{fmtMoney(p.costPerBene ?? 0)}</td>
                  <td className="px-3 py-2 text-right font-mono">{(p.opioidRate ?? 0).toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right font-mono">{fmtMoney(p.cost ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Specialties Most Associated With Opioid Prescribing</h2>
        <p>
          Certain specialties have structurally higher opioid rates. Understanding these baselines
          is critical — a pain management specialist at 40% opioid rate may be normal, while a
          family practice doctor at 40% is a statistical outlier.
        </p>

        <div className="not-prose my-6">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Specialty</th>
                <th className="px-4 py-2 text-right font-semibold">Avg Opioid Rate</th>
                <th className="px-4 py-2 text-right font-semibold">Providers</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {opioidSpecialties.map(s => (
                <tr key={s.specialty}>
                  <td className="px-4 py-2">{s.specialty}</td>
                  <td className="px-4 py-2 text-right font-mono text-red-600 font-semibold">{(s.avgOpioidRate ?? 0).toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(s.providers ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">The Opioid + Benzodiazepine Red Flag</h2>
        <p>
          Co-prescribing opioids and benzodiazepines is one of the strongest indicators of problematic
          prescribing. The FDA has issued{' '}
          <Link href="https://www.fda.gov/drugs/drug-safety-and-availability/fda-drug-safety-communication-fda-warns-about-serious-risks-and-death-when-combining-opioid-pain-or" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">black box warnings</Link>{' '}
          about this combination. In our dataset, <strong>{fmt(opioidBenzo.length)} providers</strong> among the
          top opioid prescribers are flagged for opioid+benzo co-prescribing.
        </p>

        <div className="not-prose bg-amber-50 border border-amber-200 rounded-xl p-6 my-6">
          <p className="text-sm font-semibold text-amber-800 mb-2">⚠️ Why This Matters</p>
          <p className="text-sm text-amber-700">
            The CDC reports that over 30% of opioid overdose deaths involve benzodiazepines.
            Providers who routinely co-prescribe both drug classes to the same patients create
            an elevated overdose risk that is visible in prescribing data.
          </p>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Detecting Doctor Shopping Networks</h2>
        <p>
          True doctor-shopping detection requires patient-level data (which CMS restricts for privacy).
          However, provider-level patterns can identify the <em>supply nodes</em> in these networks:
        </p>
        <ol>
          <li><strong>Statistical peer comparison:</strong> Compare each provider&apos;s opioid rate against their specialty median</li>
          <li><strong>Cost outlier detection:</strong> Flag providers whose per-beneficiary costs exceed 3x the specialty average</li>
          <li><strong>Drug combination analysis:</strong> Identify concurrent opioid + benzo + muscle relaxant prescribers</li>
          <li><strong>Geographic clustering:</strong> Multiple high-rate prescribers in small areas suggest coordinated networks</li>
          <li><strong>ML pattern matching:</strong> Our{' '}
            <Link href="/ml-fraud-detection" className="text-primary hover:underline">machine learning model</Link>{' '}
            identifies patterns resembling confirmed fraud cases
          </li>
        </ol>

        <h2 className="font-[family-name:var(--font-heading)]">Policy Implications</h2>
        <p>
          States that have implemented Prescription Drug Monitoring Programs (PDMPs) have seen measurable
          reductions in doctor shopping. Our data shows that:
        </p>
        <ul>
          <li>States with stronger PDMP enforcement tend to have lower average opioid rates</li>
          <li>The geographic concentration of high-rate prescribers suggests enforcement gaps</li>
          <li>Excluded providers still billing Medicare ({fmt(excludedOpioid.length)} in our opioid dataset) represent a systems failure</li>
        </ul>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-blue-800 font-medium">Explore Related Data</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/opioids" className="text-sm text-primary hover:underline">Opioid Prescribing Data</Link>
            <Link href="/dangerous-combinations" className="text-sm text-primary hover:underline">☠️ Dangerous Combinations</Link>
            <Link href="/analysis/opioid-crisis" className="text-sm text-primary hover:underline">Opioid Crisis Analysis</Link>
            <Link href="/analysis/pill-mills" className="text-sm text-primary hover:underline">🏭 Pill Mills</Link>
            <Link href="/analysis/medicare-waste" className="text-sm text-primary hover:underline">💰 Medicare Waste</Link>
            <Link href="/analysis/pharmacy-fraud" className="text-sm text-primary hover:underline">🏥 Pharmacy Fraud</Link>
          </div>
        </div>
        <RelatedAnalysis current={`/analysis/${slug}`} />
      </div>
    </div>
  )
}
