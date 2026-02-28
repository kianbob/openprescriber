import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { fmtMoney, fmt, riskBadge } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'Medicare Part D Provider Directory',
  description: 'Browse and search Medicare Part D prescribers with risk scores, opioid rates, and prescribing data.',
  alternates: { canonical: 'https://www.openprescriber.org/providers' },
}

export default function ProvidersPage() {
  const providers = loadData('provider-index.json') as { npi: string; name: string; city: string; state: string; specialty: string; claims: number; cost: number; riskLevel: string }[]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Providers' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Provider Directory</h1>
      <p className="text-gray-600 mb-4">{fmt(providers.length)} Medicare Part D prescribers with detailed profiles, risk scores, and peer comparisons.</p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
        <p className="text-sm text-blue-800">Looking for a specific provider? Use our search to find by name, NPI, city, or specialty.</p>
        <Link href="/search" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 whitespace-nowrap ml-4">🔍 Search Providers</Link>
      </div>

      <p className="text-xs text-gray-500 mb-3">Showing top 200 by risk score. <Link href="/flagged" className="text-primary hover:underline">View all flagged providers</Link> or <Link href="/risk-explorer" className="text-primary hover:underline">explore risk data</Link>.</p>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Provider</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Specialty</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Location</th>
              <th className="px-4 py-3 text-right font-semibold">Claims</th>
              <th className="px-4 py-3 text-right font-semibold">Drug Cost</th>
              <th className="px-4 py-3 text-center font-semibold">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {providers.slice(0, 200).map(p => (
              <tr key={p.npi} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <Link href={`/providers/${p.npi}`} className="text-primary font-medium hover:underline">{p.name}</Link>
                </td>
                <td className="px-4 py-2 text-gray-600 hidden md:table-cell">{p.specialty}</td>
                <td className="px-4 py-2 text-gray-500 hidden md:table-cell">{p.city}, {p.state}</td>
                <td className="px-4 py-2 text-right font-mono">{fmt(p.claims)}</td>
                <td className="px-4 py-2 text-right font-mono">{fmtMoney(p.cost)}</td>
                <td className="px-4 py-2 text-center text-xs">{riskBadge(p.riskLevel)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
