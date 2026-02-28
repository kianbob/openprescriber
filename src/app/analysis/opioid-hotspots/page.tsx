import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'Geographic Hotspots for Opioid Prescribing in Medicare',
  description: 'State-by-state analysis reveals persistent geographic patterns in opioid prescribing rates across Medicare Part D.',
  alternates: { canonical: 'https://www.openprescriber.org/analysis/opioid-hotspots' },
}

export default function OpioidHotspotsPage() {
  const opioidByState = loadData('opioid-by-state.json') as { state: string; avgOpioidRate: number; highOpioid: number; opioidProv: number; providers: number }[]
  const sorted = [...opioidByState].filter(s => s.providers > 100).sort((a, b) => b.avgOpioidRate - a.avgOpioidRate)
  const top = sorted.slice(0, 10)
  const bottom = sorted.slice(-10).reverse()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Opioid Hotspots' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">Geographic Hotspots for Opioid Prescribing</h1>
      <ShareButtons title="Opioid Prescribing Hotspots by State" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          Opioid prescribing rates vary dramatically across the country. Some states average rates 2-3x higher than others — patterns that have persisted for years despite national reform efforts.
        </p>

        <h2>Highest Opioid Prescribing States</h2>
        <div className="not-prose my-6 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold text-red-700 mb-2">🔴 HIGHEST RATES</h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-red-50"><tr><th className="px-3 py-2 text-left font-semibold">State</th><th className="px-3 py-2 text-right font-semibold">Avg Rate</th><th className="px-3 py-2 text-right font-semibold">High-Rate</th></tr></thead>
                <tbody className="divide-y">
                  {top.map(s => (
                    <tr key={s.state}><td className="px-3 py-2"><Link href={`/states/${s.state.toLowerCase()}`} className="text-primary hover:underline">{s.state}</Link></td><td className="px-3 py-2 text-right font-mono text-red-600 font-semibold">{s.avgOpioidRate.toFixed(1)}%</td><td className="px-3 py-2 text-right font-mono">{fmt(s.highOpioid)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-green-700 mb-2">🟢 LOWEST RATES</h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-green-50"><tr><th className="px-3 py-2 text-left font-semibold">State</th><th className="px-3 py-2 text-right font-semibold">Avg Rate</th><th className="px-3 py-2 text-right font-semibold">High-Rate</th></tr></thead>
                <tbody className="divide-y">
                  {bottom.map(s => (
                    <tr key={s.state}><td className="px-3 py-2"><Link href={`/states/${s.state.toLowerCase()}`} className="text-primary hover:underline">{s.state}</Link></td><td className="px-3 py-2 text-right font-mono text-green-600 font-semibold">{s.avgOpioidRate.toFixed(1)}%</td><td className="px-3 py-2 text-right font-mono">{fmt(s.highOpioid)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <h2>What Drives the Variation?</h2>
        <ul>
          <li><strong>Regulation</strong> — States with stricter prescription drug monitoring programs (PDMPs) tend to have lower rates</li>
          <li><strong>Demographics</strong> — Older, more rural populations correlate with higher opioid use</li>
          <li><strong>Industry influence</strong> — Historical pharmaceutical marketing targeted high-prescribing regions</li>
          <li><strong>Cultural factors</strong> — Pain management norms vary by region</li>
        </ul>

        <h2>The Persistence Problem</h2>
        <p>
          Despite over a decade of interventions — CDC guidelines, state monitoring programs, prescriber limits — the geographic distribution of opioid prescribing remains remarkably stable. The same states that led in 2013 largely still lead today.
        </p>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-medium">Related Analysis</p>
          <div className="flex flex-wrap gap-3 mt-1">
            <Link href="/opioids" className="text-sm text-primary hover:underline">💊 Opioid Data</Link>
            <Link href="/dangerous-combinations" className="text-sm text-primary hover:underline">☠️ Dangerous Combos</Link>
            <Link href="/risk-explorer" className="text-sm text-primary hover:underline">🔍 Risk Explorer</Link>
            <Link href="/states" className="text-sm text-primary hover:underline">🗺️ State Profiles</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
