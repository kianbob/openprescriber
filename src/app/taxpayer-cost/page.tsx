import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import { stateName } from '@/lib/state-names'

export const metadata: Metadata = {
  title: 'Your Tax Dollar: Medicare Part D Cost Per Taxpayer by State',
  description: 'How much does Medicare Part D cost you? See prescription drug spending per taxpayer in every state.',
  alternates: { canonical: 'https://www.openprescriber.org/taxpayer-cost' },
}

export default function TaxpayerCostPage() {
  const stats = loadData('stats.json') as { cost: number; claims: number; providers: number; benes: number; brandCost: number; genericCost: number; brandPct: number }
  const states = loadData('states.json') as { state: string; cost: number; benes: number; providers: number; claims: number }[]

  // US has ~150M taxpayers; Medicare Part D has ~52M enrolled beneficiaries (CMS 2023)
  const US_TAXPAYERS = 150_000_000
  const PART_D_ENROLLEES = 52_000_000 // CMS 2023 enrollment (stats.benes is provider-summed, overcounts)
  const costPerTaxpayer = Math.round(stats.cost / US_TAXPAYERS)
  const costPerBene = Math.round(stats.cost / PART_D_ENROLLEES)

  // State taxpayer estimates (rough proportion by population, simplified)
  const stateRanked = [...states]
    .filter(s => s.benes > 1000)
    .map(s => ({
      ...s,
      name: stateName(s.state),
      costPerBene: s.benes > 0 ? Math.round(s.cost / s.benes) : 0,
    }))
    .sort((a, b) => b.costPerBene - a.costPerBene)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Taxpayer Cost' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Your Tax Dollar &amp; Medicare Part D</h1>
      <p className="text-gray-600 mb-2">Where does $275.6 billion in prescription drug spending actually go?</p>
      <ShareButtons title="Medicare Part D: Cost Per Taxpayer" />

      {/* Big Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-200">
          <p className="text-3xl font-bold text-primary">${costPerTaxpayer.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-1">Per Taxpayer/Year</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-200">
          <p className="text-3xl font-bold text-primary">{fmtMoney(stats.cost)}</p>
          <p className="text-xs text-gray-600 mt-1">Total Part D Spending</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-200">
          <p className="text-3xl font-bold text-primary">${costPerBene.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-1">Per Beneficiary</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-200">
          <p className="text-3xl font-bold text-primary">~52M</p>
          <p className="text-xs text-gray-600 mt-1">Part D Enrollees</p>
        </div>
      </div>

      {/* Where It Goes */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-4">Where Your ${costPerTaxpayer} Goes</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-5 border">
            <h3 className="font-bold text-lg">💊 Top 10 Drugs: $22 Billion</h3>
            <p className="text-sm text-gray-600 mt-1">Just 10 drugs account for 8% of all Part D spending. Eliquis alone costs $7.75 billion — more than NASA&apos;s annual science budget.</p>
            <Link href="/ira-negotiation" className="text-primary text-sm hover:underline mt-2 inline-block">See IRA negotiated drug prices →</Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border">
            <h3 className="font-bold text-lg">🏥 GLP-1 Diabetes/Weight Drugs: $8.4 Billion</h3>
            <p className="text-sm text-gray-600 mt-1">Ozempic, Trulicity, and Mounjaro are the fastest-growing drug category. Spending has tripled since 2019.</p>
            <Link href="/glp1-tracker" className="text-primary text-sm hover:underline mt-2 inline-block">Track GLP-1 spending →</Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border">
            <h3 className="font-bold text-lg">💰 Brand-Name Premium: $185 Billion</h3>
            <p className="text-sm text-gray-600 mt-1">Brand-name drugs cost 4.7x more per claim than generics, yet still account for 13.4% of all prescriptions.</p>
            <Link href="/brand-vs-generic" className="text-primary text-sm hover:underline mt-2 inline-block">Brand vs Generic analysis →</Link>
          </div>
        </div>
      </section>

      {/* Cost Per Beneficiary by State */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-4">Cost Per Beneficiary by State</h2>
        <p className="text-gray-600 text-sm mb-4">Some states cost Medicare significantly more per patient than others — driven by prescribing patterns, drug mix, and population health.</p>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">State</th>
                <th className="px-4 py-3 text-right font-semibold">Cost/Patient*</th>
                <th className="px-4 py-3 text-right font-semibold">Total Cost</th>
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Prescriptions*</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stateRanked.slice(0, 20).map((s, i) => (
                <tr key={s.state} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-2"><Link href={`/states/${s.state.toLowerCase()}`} className="text-primary font-medium hover:underline">{s.name}</Link></td>
                  <td className={`px-4 py-2 text-right font-mono font-semibold ${s.costPerBene > costPerBene * 1.2 ? 'text-red-600' : ''}`}>${s.costPerBene.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmtMoney(s.cost)}</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(s.claims)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* The Big Picture */}
      <section className="mt-10 bg-gray-50 rounded-xl p-6 border">
        <h2 className="text-xl font-bold mb-3">The Big Picture</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>📈 Part D spending grew <strong>50%</strong> from $183B (2019) to $275.6B (2023)</li>
          <li>💊 The top 500 drugs account for the vast majority of spending</li>
          <li>🏥 {fmt(stats.providers)} providers prescribed {fmt(stats.claims)} claims</li>
          <li>⚖️ The <Link href="/ira-negotiation" className="text-primary hover:underline">Inflation Reduction Act</Link> begins negotiating prices for 10 drugs in 2026</li>
          <li>💰 If all brand prescriptions switched to generics, estimated savings: <strong>{fmtMoney(stats.brandCost * 0.6)}</strong></li>
        </ul>
      </section>

      <p className="text-xs text-gray-400 mt-8">
        *Cost per patient is calculated from provider-level data (patients seeing multiple providers are counted once per provider). Actual Medicare Part D enrollment: ~52 million (CMS 2023).
        Data from CMS Medicare Part D Public Use Files, 2023. Taxpayer estimates based on ~150M federal income tax filers.
        <Link href="/methodology" className="text-primary hover:underline ml-2">Methodology</Link>
      </p>
    </div>
  )
}
