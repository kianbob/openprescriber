import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'Medicare Prescription Drug Costs 2023 — Part D Spending Data',
  description: 'Explore $275.6 billion in Medicare Part D prescription drug costs. See spending by drug, provider, state, and specialty with 5 years of trend data.',
  alternates: { canonical: 'https://www.openprescriber.org/prescription-drug-costs' },
}

export default function PrescriptionDrugCostsPage() {
  const stats = loadData('stats.json') as { cost: number; claims: number; providers: number; benes: number; brandCost: number; genericCost: number; brandPct: number; opioidProv: number }
  const drugs = loadData('drugs.json') as { generic: string; brand: string; cost: number; claims: number; costPerClaim: number }[]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Prescription Drug Costs' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Medicare Prescription Drug Costs</h1>
      <p className="text-gray-600 mb-6">A comprehensive look at where $275.6 billion in Medicare Part D spending goes — every drug, every provider, every state.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
          <p className="text-2xl font-bold text-primary">{fmtMoney(stats.cost)}</p>
          <p className="text-xs text-gray-600">Total Drug Costs</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
          <p className="text-2xl font-bold text-primary">{fmt(stats.claims)}</p>
          <p className="text-xs text-gray-600">Prescriptions Filled</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
          <p className="text-2xl font-bold text-primary">{fmtMoney(stats.brandCost)}</p>
          <p className="text-xs text-gray-600">Brand-Name Drugs</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
          <p className="text-2xl font-bold text-primary">{fmtMoney(stats.genericCost)}</p>
          <p className="text-xs text-gray-600">Generic Drugs</p>
        </div>
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2>The Scope of Medicare Part D</h2>
        <p>Medicare Part D is the prescription drug benefit that covers over 48 million Americans. In 2023, {fmt(stats.providers)} healthcare providers wrote {fmt(stats.claims)} prescriptions totaling {fmtMoney(stats.cost)} in drug costs — making it one of the largest prescription drug programs in the world.</p>
        
        <h2>Top 10 Most Expensive Drugs</h2>
      </section>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto mt-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold">Drug</th>
              <th className="px-4 py-3 text-right font-semibold">Total Cost</th>
              <th className="px-4 py-3 text-right font-semibold">Claims</th>
              <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Cost/Claim</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {drugs.slice(0, 10).map((d, i) => (
              <tr key={d.generic} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                <td className="px-4 py-2 font-medium">{d.generic} {d.brand && <span className="text-gray-400 text-xs">({d.brand})</span>}</td>
                <td className="px-4 py-2 text-right font-mono font-semibold">{fmtMoney(d.cost)}</td>
                <td className="px-4 py-2 text-right font-mono">{fmt(d.claims)}</td>
                <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmtMoney(d.costPerClaim)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-right mt-2"><Link href="/drugs" className="text-primary text-sm hover:underline">See all 500 drugs →</Link></p>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2>Key Trends in Drug Spending</h2>
        <ul>
          <li><strong>50% growth in 5 years:</strong> Part D spending rose from $183B (2019) to $275.6B (2023)</li>
          <li><strong>GLP-1 explosion:</strong> Ozempic and similar drugs now cost Medicare <Link href="/glp1-tracker">$8.4 billion annually</Link></li>
          <li><strong>Brand vs generic gap:</strong> Brand drugs are {stats.brandPct}% of prescriptions but {Math.round(stats.brandCost / stats.cost * 100)}% of costs</li>
          <li><strong>IRA price negotiation:</strong> 10 drugs representing <Link href="/ira-negotiation">$22B in spending</Link> face negotiated prices starting 2026</li>
        </ul>

        <h2>Explore the Data</h2>
        <p>OpenPrescriber provides the most detailed public analysis of Medicare Part D prescribing data available:</p>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        {[
          { href: '/drugs', label: 'Top 500 Drugs', icon: '💊' },
          { href: '/states', label: 'By State', icon: '🗺️' },
          { href: '/specialties', label: 'By Specialty', icon: '⚕️' },
          { href: '/dashboard', label: 'Dashboard', icon: '📊' },
          { href: '/flagged', label: 'Flagged Providers', icon: '🔴' },
          { href: '/taxpayer-cost', label: 'Taxpayer Cost', icon: '💰' },
        ].map(l => (
          <Link key={l.href} href={l.href} className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow text-center">
            <span className="text-2xl">{l.icon}</span>
            <p className="text-sm font-medium mt-1">{l.label}</p>
          </Link>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-8">
        Data from CMS Medicare Part D Public Use Files, 2019-2023. <Link href="/methodology" className="text-primary hover:underline">Methodology</Link> · <Link href="/about" className="text-primary hover:underline">About</Link>
      </p>
    </div>
  )
}
