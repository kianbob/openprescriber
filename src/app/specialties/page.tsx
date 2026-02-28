import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { fmtMoney, fmt, slugify } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'Medicare Part D Prescribing by Specialty',
  description: 'Compare prescribing patterns across 156 medical specialties — opioid rates, drug costs, brand vs generic preferences.',
  alternates: { canonical: 'https://www.openprescriber.org/specialties' },
}

export default function SpecialtiesPage() {
  const specs = loadData('specialties.json') as { specialty: string; providers: number; claims: number; cost: number; opioidProv: number; avgOpioidRate: number; avgBrandPct: number; costPerProvider: number }[]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Specialties' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Prescribing by Specialty</h1>
      <p className="text-gray-600 mb-6">{specs.length} medical specialties ranked by number of Medicare Part D prescribers.</p>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold">Specialty</th>
              <th className="px-4 py-3 text-right font-semibold">Prescribers</th>
              <th className="px-4 py-3 text-right font-semibold">Drug Cost</th>
              <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Claims</th>
              <th className="px-4 py-3 text-right font-semibold">Avg Opioid Rate</th>
              <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Avg Brand %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {specs.slice(0, 50).map((s, i) => (
              <tr key={s.specialty} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                <td className="px-4 py-2"><Link href={`/specialties/${slugify(s.specialty)}`} className="font-medium text-primary hover:underline">{s.specialty}</Link></td>
                <td className="px-4 py-2 text-right font-mono">{fmt(s.providers)}</td>
                <td className="px-4 py-2 text-right font-mono">{fmtMoney(s.cost)}</td>
                <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(s.claims)}</td>
                <td className={`px-4 py-2 text-right font-mono font-semibold ${s.avgOpioidRate > 10 ? 'text-red-600' : ''}`}>{s.avgOpioidRate.toFixed(1)}%</td>
                <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{s.avgBrandPct.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
