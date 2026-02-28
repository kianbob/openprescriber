import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'Top 500 Medicare Part D Drugs by Cost',
  description: 'The most expensive drugs in Medicare Part D — ranked by total cost, with claims data and cost-per-claim analysis.',
  alternates: { canonical: 'https://www.openprescriber.org/drugs' },
}

export default function DrugsPage() {
  const drugs = loadData('drugs.json') as { generic: string; brand: string; claims: number; cost: number; benes: number; providers: number; costPerClaim: number }[]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Top Drugs' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Top 500 Medicare Part D Drugs</h1>
      <p className="text-gray-600 mb-6">Ranked by total drug cost paid by Medicare Part D in 2023.</p>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold">Drug (Generic)</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Brand</th>
              <th className="px-4 py-3 text-right font-semibold">Total Cost</th>
              <th className="px-4 py-3 text-right font-semibold">Claims</th>
              <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Cost/Claim</th>
              <th className="px-4 py-3 text-right font-semibold hidden lg:table-cell">Providers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {drugs.map((d, i) => (
              <tr key={d.generic + i} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                <td className="px-4 py-2 font-medium text-gray-900">{d.generic}</td>
                <td className="px-4 py-2 text-gray-500 hidden md:table-cell">{d.brand || '—'}</td>
                <td className="px-4 py-2 text-right font-mono font-semibold">{fmtMoney(d.cost)}</td>
                <td className="px-4 py-2 text-right font-mono">{fmt(d.claims)}</td>
                <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmtMoney(d.costPerClaim)}</td>
                <td className="px-4 py-2 text-right font-mono hidden lg:table-cell">{fmt(d.providers)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
