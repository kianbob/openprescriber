import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt } from '@/lib/utils'
import { stateName } from '@/lib/state-names'
import { loadData } from '@/lib/server-utils'
import RelatedAnalysis from '@/components/RelatedAnalysis'

export const metadata: Metadata = {
  title: 'The Medicare Opioid Crisis in Numbers',
  description: 'One in three Medicare Part D prescribers write opioid prescriptions. Analysis of 65,349 opioid prescribers and 16,431 high-rate providers.',
  alternates: { canonical: 'https://www.openprescriber.org/analysis/opioid-crisis' },
}

export default function OpioidCrisisPage() {
  const stats = loadData('stats.json')
  const opioidByState = loadData('opioid-by-state.json') as { state: string; avgOpioidRate: number; highOpioid: number; opioidProv: number }[]
  const topStates = [...opioidByState].sort((a, b) => b.avgOpioidRate - a.avgOpioidRate).slice(0, 10)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'The Medicare Opioid Crisis' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">The Medicare Opioid Crisis in Numbers</h1>
      <ShareButtons title="The Medicare Opioid Crisis in Numbers" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          The opioid epidemic remains one of America&apos;s deadliest public health crises. Our analysis of the complete 2023 Medicare Part D prescribing dataset reveals the staggering scale of opioid prescribing among Medicare providers.
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">{fmt(stats.opioidProv)}</p>
            <p className="text-xs text-red-600">Opioid Prescribers</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">{((stats.opioidProv / stats.providers) * 100).toFixed(0)}%</p>
            <p className="text-xs text-red-600">Of All Prescribers</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">{fmt(stats.highOpioid)}</p>
            <p className="text-xs text-red-600">High Rate (&gt;20%)</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">156</p>
            <p className="text-xs text-red-600">Specialties Prescribing</p>
          </div>
        </div>

        <h2>One in Three</h2>
        <p>
          Out of {fmt(stats.providers)} Medicare Part D prescribers, <strong>{fmt(stats.opioidProv)} ({((stats.opioidProv / stats.providers) * 100).toFixed(0)}%)</strong> prescribed at least one opioid in 2023. That&apos;s roughly one in every three providers.
        </p>
        <p>
          Among those, <strong>{fmt(stats.highOpioid)} providers</strong> have opioid prescribing rates above 20% — meaning more than one in five of their prescriptions are for opioids. CMS considers 20% an elevated threshold.
        </p>

        <h2>Geographic Concentration</h2>
        <p>Opioid prescribing rates vary dramatically by state:</p>

        <div className="not-prose my-6">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">State</th>
                <th className="px-4 py-2 text-right font-semibold">Avg Opioid Rate</th>
                <th className="px-4 py-2 text-right font-semibold">High-Rate Providers</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topStates.map(s => (
                <tr key={s.state}>
                  <td className="px-4 py-2"><Link href={`/states/${s.state.toLowerCase()}`} className="text-primary hover:underline">{stateName(s.state)}</Link></td>
                  <td className="px-4 py-2 text-right font-mono text-red-600 font-semibold">{s.avgOpioidRate.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(s.highOpioid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>What This Means</h2>
        <p>
          Not all opioid prescribing is inappropriate — pain management specialists, oncologists, and palliative care providers legitimately prescribe opioids at high rates. But the sheer volume suggests the pipeline remains enormous, even as national efforts aim to curb unnecessary prescribing.
        </p>
        <p>
          The key question isn&apos;t just <em>how much</em> but <em>where and by whom</em>. Geographic hotspots and specialty patterns point to systemic issues that blanket regulations miss.
        </p>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-blue-800 font-medium">Related Analysis</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/opioids" className="text-sm text-primary hover:underline">💊 Opioid Prescribing Data</Link>
            <Link href="/dangerous-combinations" className="text-sm text-primary hover:underline">☠️ Opioid+Benzo Co-Prescribers</Link>
            <Link href="/risk-explorer" className="text-sm text-primary hover:underline">🔍 Risk Explorer</Link>
            <Link href="/analysis/opioid-hotspots" className="text-sm text-primary hover:underline">📍 Geographic Hotspots</Link>
            <Link href="/ml-fraud-detection" className="text-sm text-primary hover:underline">🤖 ML Fraud Detection</Link>
          </div>
        </div>
      <RelatedAnalysis current={"/analysis/opioid-crisis"} />
      </div>
    </div>
  )
}
