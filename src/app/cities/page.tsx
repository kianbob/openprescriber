import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { loadData } from '@/lib/server-utils'
import { fmtMoney, fmt } from '@/lib/utils'
import DataFreshness from '@/components/DataFreshness'

export const metadata: Metadata = {
  title: 'Medicare Part D Prescribers by City — Browse 982 Cities',
  description: 'Find Medicare Part D prescribers in your city. Browse prescribing data, drug costs, and risk analysis for 982 cities across the United States.',
  alternates: { canonical: 'https://www.openprescriber.org/cities' },
  openGraph: {
    title: 'Medicare Part D Prescribers by City',
    description: 'Find prescribers in your city. Browse data for 982 cities.',
    url: 'https://www.openprescriber.org/cities',
    type: 'website',
  },
}

type CityIndex = {
  city: string; state: string; slug: string; providers: number;
  totalCost: number; highRisk: number; elevated: number;
  specialties: number; avgOpioidRate: number;
}

export default function CitiesPage() {
  const cities = loadData('cities-index.json') as CityIndex[]
  const totalProviders = cities.reduce((s, c) => s + c.providers, 0)
  const totalCost = cities.reduce((s, c) => s + c.totalCost, 0)

  // Group by state
  const byState: Record<string, CityIndex[]> = {}
  cities.forEach(c => {
    if (!byState[c.state]) byState[c.state] = []
    byState[c.state].push(c)
  })
  const stateKeys = Object.keys(byState).sort()

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Cities' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Prescribers by City</h1>
      <p className="text-gray-600 mb-4">Browse Medicare Part D prescribing data for {fmt(cities.length)} cities across the United States. {fmt(totalProviders)} flagged and high-volume providers, {fmtMoney(totalCost)} in total drug costs.</p>
      <DataFreshness />

      {/* Top cities */}
      <section className="mt-8">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">Largest Cities by Provider Count</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">City</th>
                <th className="px-4 py-2 text-right font-semibold">Providers</th>
                <th className="px-4 py-2 text-right font-semibold">Drug Cost</th>
                <th className="px-4 py-2 text-right font-semibold hidden sm:table-cell">High Risk</th>
                <th className="px-4 py-2 text-right font-semibold hidden md:table-cell">Avg Opioid Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {cities.slice(0, 50).map(c => (
                <tr key={c.slug} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <Link href={`/cities/${c.slug}`} className="text-primary hover:underline font-medium">{c.city}, {c.state}</Link>
                  </td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(c.providers)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmtMoney(c.totalCost)}</td>
                  <td className="px-4 py-2 text-right font-mono hidden sm:table-cell">{c.highRisk > 0 ? <span className="text-red-600 font-semibold">{c.highRisk}</span> : '—'}</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{(c.avgOpioidRate ?? 0).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Browse by state */}
      <section className="mt-12">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">Browse by State</h2>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-6">
          {stateKeys.map(st => (
            <div key={st} className="break-inside-avoid mb-4">
              <h3 className="font-semibold text-sm text-gray-500 mb-1">{st}</h3>
              <ul className="space-y-0.5">
                {byState[st].slice(0, 8).map(c => (
                  <li key={c.slug}>
                    <Link href={`/cities/${c.slug}`} className="text-sm text-primary hover:underline">{c.city}</Link>
                    <span className="text-xs text-gray-400 ml-1">({c.providers})</span>
                  </li>
                ))}
                {byState[st].length > 8 && <li className="text-xs text-gray-400">+{byState[st].length - 8} more</li>}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
