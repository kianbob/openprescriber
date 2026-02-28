import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'Medicare Part D: Complete Guide to Prescription Drug Coverage & Data',
  description: 'Everything you need to know about Medicare Part D — what it covers, how much it costs, 2023 data analysis of 1.38M prescribers and $275.6B in drug spending.',
  alternates: { canonical: 'https://www.openprescriber.org/medicare-part-d' },
}

export default function MedicarePartDPage() {
  const stats = loadData('stats.json')
  const trends = loadData('yearly-trends.json') as { year: number; cost: number; claims: number; providers: number }[]
  const drugs = loadData('drugs.json') as { brand: string; generic: string; cost: number; claims: number; benes: number }[]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Medicare Part D' }]} />
      <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] mb-4">Medicare Part D: The Complete Data Guide</h1>
      <p className="text-lg text-gray-600 mb-4">
        Medicare Part D is the federal prescription drug benefit, covering <strong>~52 million</strong> Americans. In 2023, Part D cost <strong>{fmtMoney(stats.cost)}</strong> across <strong>{fmt(stats.claims)}</strong> prescriptions filled by <strong>{fmt(stats.providers)}</strong> providers.
      </p>
      <ShareButtons title="Medicare Part D: Complete Guide" />

      <div className="prose prose-gray max-w-none mt-8">
        <h2>What Is Medicare Part D?</h2>
        <p>
          Medicare Part D is the optional prescription drug benefit available to all Medicare beneficiaries. Created by the Medicare Modernization Act of 2003 and launched in 2006, it&apos;s administered through private insurance plans — not directly by the government.
        </p>
        <p>Key facts:</p>
        <ul>
          <li><strong>~52 million enrollees</strong> (2023)</li>
          <li><strong>{fmtMoney(stats.cost)} in total drug costs</strong> (2023)</li>
          <li><strong>{fmt(stats.providers)} prescribers</strong> across {stats.totalSpecialties} specialties</li>
          <li>Covers brand-name and generic drugs through formulary tiers</li>
          <li>$2,000 out-of-pocket cap starting 2025 (IRA provision)</li>
        </ul>

        <h2>Part D by the Numbers (2023)</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
        <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-200">
          <p className="text-2xl font-bold text-primary">{fmtMoney(stats.cost)}</p>
          <p className="text-xs text-gray-600 mt-1">Total Drug Costs</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-200">
          <p className="text-2xl font-bold text-primary">{fmt(stats.claims)}</p>
          <p className="text-xs text-gray-600 mt-1">Prescriptions Filled</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-200">
          <p className="text-2xl font-bold text-primary">{fmt(stats.providers)}</p>
          <p className="text-xs text-gray-600 mt-1">Prescribers</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-200">
          <p className="text-2xl font-bold text-primary">${stats.avgCostPerClaim}</p>
          <p className="text-xs text-gray-600 mt-1">Avg Cost Per Rx</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-200">
          <p className="text-2xl font-bold text-primary">{stats.brandPct}%</p>
          <p className="text-xs text-gray-600 mt-1">Brand-Name Rx</p>
        </div>
        <div className="bg-red-50 rounded-xl p-5 text-center border border-red-200">
          <p className="text-2xl font-bold text-red-700">{fmt(stats.opioidProv)}</p>
          <p className="text-xs text-gray-600 mt-1">Opioid Prescribers</p>
        </div>
      </div>

      <div className="prose prose-gray max-w-none">
        <h2>5-Year Spending Trend</h2>
        <p>Part D costs have grown {((trends[4].cost / trends[0].cost - 1) * 100).toFixed(0)}% in five years:</p>
      </div>

      <div className="grid grid-cols-5 gap-2 my-4">
        {trends.map(t => (
          <div key={t.year} className="bg-white rounded-xl shadow-sm p-3 border text-center">
            <p className="text-sm font-bold">{t.year}</p>
            <p className="text-lg font-bold text-primary">{fmtMoney(t.cost)}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-gray max-w-none">
        <h2>Most Expensive Drugs in Part D</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto my-4 border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold">Drug</th>
              <th className="px-4 py-3 text-right font-semibold">Cost</th>
              <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Patients</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {drugs.slice(0, 10).map((d, i) => (
              <tr key={d.brand} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                <td className="px-4 py-2 font-semibold">{d.brand} <span className="text-gray-400 font-normal text-xs">({d.generic})</span></td>
                <td className="px-4 py-2 text-right font-mono font-bold">{fmtMoney(d.cost)}</td>
                <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(d.benes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-gray max-w-none">
        <p><Link href="/drugs">See all 500 top drugs →</Link></p>

        <h2>Key Issues in Part D</h2>

        <h3>Drug Price Negotiation (IRA)</h3>
        <p>
          For the first time, Medicare can now negotiate drug prices. The first 10 drugs have negotiated prices effective 2026, with 15 more coming in 2027. <Link href="/ira-negotiation">See the IRA drug list →</Link>
        </p>

        <h3>Opioid Prescribing</h3>
        <p>
          {fmt(stats.opioidProv)} Part D prescribers wrote opioid prescriptions in 2023, with {fmt(stats.highOpioid)} showing rates above 20%. <Link href="/opioid-prescribers">See opioid prescribing data →</Link>
        </p>

        <h3>Fraud and Waste</h3>
        <p>
          CMS estimated $31+ billion in improper Medicare payments in FY2024. Our analysis flags {stats.riskCounts.high} high-risk prescribers and identified {stats.excluded} excluded providers still active in the system. <Link href="/medicare-fraud">See fraud analysis →</Link>
        </p>

        <h3>GLP-1 Drug Surge</h3>
        <p>
          Ozempic, Trulicity, and Mounjaro are the fastest-growing drug category, now costing Medicare $8+ billion annually. <Link href="/glp1-tracker">Track GLP-1 spending →</Link>
        </p>

        <h2>Explore the Data</h2>
        <p>
          OpenPrescriber makes all of this data freely searchable and analyzable. No paywall, no login required.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        <Link href="/states" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium text-center">🏥 Browse by State</Link>
        <Link href="/specialties" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium text-center">⚕️ Browse by Specialty</Link>
        <Link href="/drugs" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium text-center">💊 Browse by Drug</Link>
        <Link href="/search" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium text-center">🔍 Search Prescribers</Link>
        <Link href="/dashboard" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium text-center">📊 Dashboard</Link>
        <Link href="/analysis" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium text-center">📝 Analysis Articles</Link>
      </div>
    </div>
  )
}
