import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'Medicare Part D Prescribing by State',
  description: 'Compare Medicare Part D prescribing patterns, drug costs, and opioid rates across all 60 U.S. states and territories.',
  alternates: { canonical: 'https://www.openprescriber.org/states' },
}

export default function StatesPage() {
  const states = loadData('states.json') as { state: string; providers: number; claims: number; cost: number; benes: number; opioidProv: number; highOpioid: number; avgOpioidRate: number; costPerBene: number }[]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'States' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Medicare Part D Prescribing by State</h1>
      <p className="text-gray-600 mb-6">Drug costs, prescriber counts, and opioid prescribing rates for all {states.length} states and territories.</p>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold">State</th>
              <th className="px-4 py-3 text-right font-semibold">Prescribers</th>
              <th className="px-4 py-3 text-right font-semibold">Drug Cost</th>
              <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Claims</th>
              <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Cost/Bene</th>
              <th className="px-4 py-3 text-right font-semibold">Avg Opioid Rate</th>
              <th className="px-4 py-3 text-right font-semibold hidden lg:table-cell">High Opioid</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {states.map((s, i) => (
              <tr key={s.state} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                <td className="px-4 py-2"><Link href={`/states/${s.state.toLowerCase()}`} className="font-medium text-primary hover:underline">{s.state}</Link></td>
                <td className="px-4 py-2 text-right font-mono">{fmt(s.providers)}</td>
                <td className="px-4 py-2 text-right font-mono">{fmtMoney(s.cost)}</td>
                <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(s.claims)}</td>
                <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmtMoney(s.costPerBene)}</td>
                <td className={`px-4 py-2 text-right font-mono font-semibold ${s.avgOpioidRate > 10 ? 'text-red-600' : ''}`}>{s.avgOpioidRate.toFixed(1)}%</td>
                <td className="px-4 py-2 text-right font-mono hidden lg:table-cell">{fmt(s.highOpioid)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
