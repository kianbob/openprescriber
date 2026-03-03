import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import DataFreshness from '@/components/DataFreshness'
import { loadData } from '@/lib/server-utils'
import { fmtMoney, fmt } from '@/lib/utils'
import { stateName } from '@/lib/state-names'
import fs from 'fs'
import path from 'path'

type FraudStateData = {
  state: string; highRisk: number; flaggedCost: number;
  totalProviders: number; stateCost: number; opioidProv: number; avgOpioidRate: number;
  topFlagged: {
    npi: string; name: string; specialty: string; city: string;
    cost: number; riskScore: number; riskLevel: string; opioidRate: number; flags: number;
  }[];
}

function loadFraud(state: string): FraudStateData | null {
  const fp = path.join(process.cwd(), 'public', 'data', 'fraud-states', state + '.json')
  if (!fs.existsSync(fp)) return null
  return JSON.parse(fs.readFileSync(fp, 'utf8'))
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params
  const data = loadFraud(state)
  if (!data) return { title: 'State Not Found' }
  const name = stateName(data.state)
  return {
    title: `Medicare Fraud Risk in ${name} — ${fmt(data.highRisk)} Flagged Prescribers`,
    description: `${fmt(data.highRisk)} Medicare Part D prescribers in ${name} flagged for potential fraud risk. ${fmtMoney(data.flaggedCost)} in drug costs from flagged providers.`,
    alternates: { canonical: `https://www.openprescriber.org/fraud/${state}` },
    openGraph: {
      title: `Medicare Fraud Risk in ${name}`,
      description: `${fmt(data.highRisk)} flagged prescribers, ${fmtMoney(data.flaggedCost)} in drug costs.`,
      url: `https://www.openprescriber.org/fraud/${state}`,
      type: 'article',
    },
  }
}

export async function generateStaticParams() {
  const index = loadData('fraud-by-state.json') as { state: string }[]
  return index.map(s => ({ state: s.state.toLowerCase() }))
}

export default async function FraudStatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params
  const data = loadFraud(state)
  if (!data) notFound()

  const name = stateName(data.state)
  const pctFlagged = data.totalProviders > 0 ? ((data.highRisk / data.totalProviders) * 100).toFixed(2) : '0'

  // Specialty breakdown of flagged
  const specCount: Record<string, number> = {}
  data.topFlagged.forEach(p => { specCount[p.specialty] = (specCount[p.specialty] || 0) + 1 })
  const topSpecs = Object.entries(specCount).sort((a, b) => b[1] - a[1]).slice(0, 8)

  // City breakdown
  const cityCount: Record<string, number> = {}
  data.topFlagged.forEach(p => { cityCount[p.city] = (cityCount[p.city] || 0) + 1 })
  const topCities = Object.entries(cityCount).sort((a, b) => b[1] - a[1]).slice(0, 8)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Fraud Risk', href: '/fraud' }, { label: name }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Medicare Fraud Risk in {name}</h1>
      <p className="text-gray-600 mb-4">
        {fmt(data.highRisk)} of {fmt(data.totalProviders)} Medicare Part D prescribers in {name} ({pctFlagged}%) were flagged as high-risk by our multi-factor scoring model.
      </p>
      <DataFreshness />
      <ShareButtons title={`Medicare Fraud Risk in ${name}`} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
          <p className="text-2xl font-bold text-red-700">{fmt(data.highRisk)}</p>
          <p className="text-xs text-red-600">High-Risk Providers</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
          <p className="text-2xl font-bold text-orange-700">{fmtMoney(data.flaggedCost)}</p>
          <p className="text-xs text-orange-600">Flagged Provider Costs</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
          <p className="text-2xl font-bold text-blue-700">{pctFlagged}%</p>
          <p className="text-xs text-blue-600">Of Providers Flagged</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
          <p className="text-2xl font-bold text-purple-700">{(data.avgOpioidRate ?? 0).toFixed(1)}%</p>
          <p className="text-xs text-purple-600">State Avg Opioid Rate</p>
        </div>
      </div>

      {/* Flagged providers table */}
      <section className="mt-10">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-2">Highest-Risk Prescribers in {name}</h2>
        <p className="text-sm text-gray-500 mb-4">Risk scores are statistical indicators, not allegations of wrongdoing. <Link href="/analysis/fraud-risk-methodology" className="text-primary hover:underline">Learn about our methodology.</Link></p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Provider</th>
                <th className="px-4 py-2 text-left font-semibold hidden sm:table-cell">City</th>
                <th className="px-4 py-2 text-left font-semibold hidden md:table-cell">Specialty</th>
                <th className="px-4 py-2 text-right font-semibold">Risk Score</th>
                <th className="px-4 py-2 text-right font-semibold">Drug Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.topFlagged.map(p => (
                <tr key={p.npi} className="hover:bg-gray-50">
                  <td className="px-4 py-2"><Link href={`/providers/${p.npi}`} className="text-primary hover:underline">{p.name}</Link></td>
                  <td className="px-4 py-2 text-gray-600 hidden sm:table-cell">{p.city}</td>
                  <td className="px-4 py-2 text-gray-600 hidden md:table-cell">{p.specialty}</td>
                  <td className="px-4 py-2 text-right font-mono text-red-600 font-semibold">{(p.riskScore ?? 0).toFixed(0)}/100</td>
                  <td className="px-4 py-2 text-right font-mono">{fmtMoney(p.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Breakdown */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div>
          <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-3">By Specialty</h2>
          <div className="space-y-2">
            {topSpecs.map(([spec, count]) => (
              <div key={spec} className="flex justify-between bg-white rounded-lg border px-4 py-2">
                <span className="text-sm">{spec}</span>
                <span className="text-sm font-mono text-red-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-3">By City</h2>
          <div className="space-y-2">
            {topCities.map(([city, count]) => (
              <div key={city} className="flex justify-between bg-white rounded-lg border px-4 py-2">
                <span className="text-sm">{city}</span>
                <span className="text-sm font-mono text-red-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="mt-10 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-4">Explore More</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href={`/states/${state}`} className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-sm">All {name} Data</h3>
            <p className="text-xs text-gray-500 mt-1">Complete prescribing overview for {name}.</p>
          </Link>
          <Link href="/fraud" className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-sm">All States</h3>
            <p className="text-xs text-gray-500 mt-1">Compare fraud risk across all states.</p>
          </Link>
          <Link href="/ml-fraud-detection" className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-sm">ML Fraud Detection</h3>
            <p className="text-xs text-gray-500 mt-1">Machine learning identifies patterns rules miss.</p>
          </Link>
        </div>
      </section>

      <div className="mt-6 text-xs text-gray-400">
        <p>Data from CMS Medicare Part D Prescriber Public Use File, 2023. Risk scores are computed using our 10-component statistical model analyzing prescribing patterns relative to specialty peers. High risk scores indicate unusual patterns that may warrant review — they are not accusations of fraud. <Link href="mailto:info@thedataproject.ai?subject=Data%20Dispute%20-%20Fraud%20Page%20-%20{data.state}" className="text-primary hover:underline">Dispute this data</Link></p>
      </div>
    </div>
  )
}
