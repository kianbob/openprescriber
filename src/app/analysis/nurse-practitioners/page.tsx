import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'
import RelatedAnalysis from '@/components/RelatedAnalysis'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'Nurse Practitioners: The Largest — and Most Flagged — Prescriber Group in Medicare',
  description: 'Nurse Practitioners account for 19% of all Medicare Part D prescribers and 49% of all flagged providers. What\'s driving this disproportionate risk signal?',
  alternates: { canonical: 'https://www.openprescriber.org/analysis/nurse-practitioners' },
}

export default function NursePractitionerArticle() {
  const specs = loadData('specialties.json') as { specialty: string; providers: number; claims: number; cost: number; opioidProv: number; avgOpioidRate: number; avgBrandPct: number }[]
  const np = specs.find(s => s.specialty === 'Nurse Practitioner')!
  const pa = specs.find(s => s.specialty === 'Physician Assistant')!
  const im = specs.find(s => s.specialty === 'Internal Medicine')!
  const fp = specs.find(s => s.specialty === 'Family Practice')!
  const stats = loadData('stats.json')
  const highRisk = loadData('high-risk.json') as { specialty: string; riskScore: number }[]
  
  const npFlagged = highRisk.filter(p => p.specialty === 'Nurse Practitioner')
  const paFlagged = highRisk.filter(p => p.specialty === 'Physician Assistant')
  const totalFlagged = highRisk.length

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema
        title="Nurse Practitioners: The Largest — and Most Flagged — Prescriber Group"
        description="Analysis of NP prescribing patterns in Medicare Part D"
        slug="nurse-practitioners"
        date="2026-02-28"
      />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Nurse Practitioners' }]} />
      
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Nurse Practitioners: The Largest — and Most Flagged — Prescriber Group</h1>
      <p className="text-sm text-gray-500 mb-4">Analysis · February 2026</p>
      <ShareButtons title="Nurse Practitioners: Medicare Part D Analysis" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg">
          Nurse Practitioners are the single largest prescriber group in Medicare Part D — <strong>{fmt(np.providers)}</strong> providers generating <strong>{fmtMoney(np.cost)}</strong> in drug costs. They&apos;re also the most disproportionately flagged group in our risk analysis, accounting for <strong>{npFlagged.length}</strong> of {fmt(totalFlagged)} flagged providers ({(npFlagged.length / totalFlagged * 100).toFixed(0)}%).
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-xl font-bold text-primary">{fmt(np.providers)}</p>
            <p className="text-xs text-gray-600">NP Prescribers</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-xl font-bold text-primary">{fmtMoney(np.cost)}</p>
            <p className="text-xs text-gray-600">Drug Costs</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-xl font-bold text-red-700">{fmt(npFlagged.length)}</p>
            <p className="text-xs text-gray-600">Flagged NPs</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-xl font-bold text-red-700">{np.avgOpioidRate.toFixed(1)}%</p>
            <p className="text-xs text-gray-600">Avg Opioid Rate</p>
          </div>
        </div>

        <h2>The Numbers in Context</h2>
        <p>
          NPs now outnumber every physician specialty in Medicare Part D. For comparison:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm bg-white rounded-xl border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Specialty</th>
                <th className="px-4 py-3 text-right font-semibold">Providers</th>
                <th className="px-4 py-3 text-right font-semibold">Drug Cost</th>
                <th className="px-4 py-3 text-right font-semibold">Opioid Rate</th>
                <th className="px-4 py-3 text-right font-semibold">Flagged</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { ...np, flagged: npFlagged.length },
                { ...pa, flagged: paFlagged.length },
                { ...im, flagged: highRisk.filter(p => p.specialty === 'Internal Medicine').length },
                { ...fp, flagged: highRisk.filter(p => p.specialty === 'Family Practice').length },
              ].map(s => (
                <tr key={s.specialty} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{s.specialty}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(s.providers)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmtMoney(s.cost)}</td>
                  <td className="px-4 py-2 text-right font-mono">{s.avgOpioidRate.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right font-mono font-bold text-red-600">{fmt(s.flagged)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Why Are So Many NPs Flagged?</h2>
        <p>
          The high flag rate doesn&apos;t necessarily mean NPs are more likely to commit fraud. Several structural factors contribute:
        </p>
        <ol>
          <li><strong>Scope of practice expansion</strong> — Many states have granted NPs full independent prescribing authority. In some settings, NPs handle patient panels that were previously physician-managed, including chronic pain.</li>
          <li><strong>Primary care gap-filling</strong> — NPs disproportionately serve rural and underserved areas where opioid prescribing rates are historically higher.</li>
          <li><strong>Opioid rate of {np.avgOpioidRate.toFixed(1)}%</strong> — Nearly 3x higher than Internal Medicine ({im.avgOpioidRate.toFixed(1)}%) and Family Practice ({fp.avgOpioidRate.toFixed(1)}%). This is the single biggest driver of risk flags.</li>
          <li><strong>Volume</strong> — With {fmt(np.providers)} prescribers, NPs are simply the largest group. Even a low per-capita flag rate produces large absolute numbers.</li>
          <li><strong>Less structured oversight</strong> — Some states allow independent practice with minimal physician oversight, potentially reducing institutional checks on prescribing patterns.</li>
        </ol>

        <h2>The Physician Assistant Pattern</h2>
        <p>
          Physician Assistants show an even more extreme pattern: {pa.avgOpioidRate.toFixed(1)}% average opioid rate and {paFlagged.length} flagged providers from {fmt(pa.providers)} total — a flag rate of {(paFlagged.length / pa.providers * 100).toFixed(2)}% compared to NPs at {(npFlagged.length / np.providers * 100).toFixed(2)}%. PAs working in pain management, emergency medicine, and urgent care settings drive this disproportionate representation.
        </p>

        <h2>What This Means</h2>
        <p>
          The data doesn&apos;t tell us <em>why</em> individual NPs prescribe the way they do — it only identifies statistical outliers. Some flagged NPs may be running pill mills; others may be dedicated pain management providers serving complex patient populations in areas with few alternatives.
        </p>
        <p>
          What the data does suggest is that <strong>mid-level prescribers deserve the same level of prescribing oversight as physicians</strong> — particularly as their scope of practice continues to expand. Greater transparency through data like this is one mechanism for achieving that accountability.
        </p>
      </div>

      <RelatedAnalysis current="/analysis/nurse-practitioners" />
    </div>
  )
}
