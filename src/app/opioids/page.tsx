import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'Opioid Prescribing in Medicare Part D: Complete Analysis',
  description: 'Which doctors prescribe the most opioids? State-by-state analysis of opioid prescribing rates, long-acting opioids, and high-volume prescribers in Medicare Part D.',
  alternates: { canonical: 'https://www.openprescriber.org/opioids' },
}

export default function OpioidsPage() {
  const stats = loadData('stats.json')
  const opioidByState = loadData('opioid-by-state.json') as { state: string; providers: number; opioidProv: number; highOpioid: number; opioidClaims: number; avgOpioidRate: number; opioidPct: number }[]
  const topOpioid = loadData('top-opioid.json') as { npi: string; name: string; credentials: string; city: string; state: string; specialty: string; opioidRate: number; opioidClaims: number; claims: number; riskLevel: string }[]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Opioid Prescribing' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Opioid Prescribing in Medicare Part D</h1>
      <p className="text-gray-600 mb-2">A complete analysis of opioid prescribing patterns across {fmt(stats.providers)} Medicare Part D prescribers in 2023.</p>
      <ShareButtons title="Opioid Prescribing in Medicare Part D" />

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Opioid Prescribers', value: fmt(stats.opioidProv), color: 'text-red-600' },
          { label: 'High Rate (>20%)', value: fmt(stats.highOpioid), color: 'text-red-700' },
          { label: '% of All Prescribers', value: ((stats.opioidProv / stats.providers) * 100).toFixed(1) + '%', color: 'text-orange-600' },
          { label: 'Total Prescribers', value: fmt(stats.providers), color: 'text-primary' },
        ].map(t => (
          <div key={t.label} className="bg-white rounded-xl shadow-sm p-4 border text-center">
            <p className={`text-2xl font-bold ${t.color}`}>{t.value}</p>
            <p className="text-sm text-gray-600 mt-1">{t.label}</p>
          </div>
        ))}
      </div>

      {/* State Rankings */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-4">Opioid Prescribing by State</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">State</th>
                <th className="px-4 py-3 text-right font-semibold">Prescribers</th>
                <th className="px-4 py-3 text-right font-semibold">Opioid Prescribers</th>
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">% Prescribing</th>
                <th className="px-4 py-3 text-right font-semibold">Avg Opioid Rate</th>
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">High Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {opioidByState.filter(s => s.opioidProv > 0).slice(0, 30).map((s, i) => (
                <tr key={s.state} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-2"><Link href={`/states/${s.state.toLowerCase()}`} className="text-primary font-medium hover:underline">{s.state}</Link></td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(s.providers)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(s.opioidProv)}</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{s.opioidPct}%</td>
                  <td className={`px-4 py-2 text-right font-mono font-semibold ${s.avgOpioidRate > 10 ? 'text-red-600' : ''}`}>{s.avgOpioidRate.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(s.highOpioid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top Opioid Prescribers */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-4">Highest Opioid Prescribing Rates</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800">
          High opioid prescribing rates may reflect legitimate pain management specialization. Context matters.
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Provider</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Specialty</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Location</th>
                <th className="px-4 py-3 text-right font-semibold">Opioid Rate</th>
                <th className="px-4 py-3 text-right font-semibold">Opioid Claims</th>
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Total Claims</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topOpioid.slice(0, 50).map(p => (
                <tr key={p.npi} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <Link href={`/providers/${p.npi}`} className="text-primary font-medium hover:underline">{p.name}</Link>
                    {p.credentials && <span className="text-xs text-gray-400 ml-1">{p.credentials}</span>}
                  </td>
                  <td className="px-4 py-2 text-gray-600 hidden md:table-cell">{p.specialty}</td>
                  <td className="px-4 py-2 text-gray-500 hidden md:table-cell">{p.city}, {p.state}</td>
                  <td className="px-4 py-2 text-right font-mono text-red-600 font-semibold">{p.opioidRate.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(p.opioidClaims)}</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(p.claims)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
