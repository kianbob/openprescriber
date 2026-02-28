import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'
import RelatedAnalysis from '@/components/RelatedAnalysis'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'The Polypharmacy Problem: When Medicare Patients Take Too Many Drugs',
  description: 'Some Medicare patients receive prescriptions from dozens of providers. Analysis of high-fills-per-patient patterns and dangerous drug accumulation.',
  alternates: { canonical: 'https://www.openprescriber.org/analysis/polypharmacy' },
}

export default function PolypharmacyArticle() {
  const stats = loadData('stats.json')
  const drugs = loadData('drugs.json') as { brand: string; generic: string; cost: number; claims: number; benes: number }[]
  const combos = loadData('drug-combos.json') as { npi: string }[]

  const avgClaimsPerBene = (stats.claims / 52_000_000).toFixed(1) // ~52M enrollees

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema
        title="The Polypharmacy Problem: When Patients Take Too Many Drugs"
        description="Analysis of polypharmacy patterns in Medicare Part D"
        slug="polypharmacy"
        date="2026-02-28"
      />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Polypharmacy' }]} />

      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">The Polypharmacy Problem: Too Many Drugs, Too Little Coordination</h1>
      <p className="text-sm text-gray-500 mb-4">Analysis · February 2026</p>
      <ShareButtons title="The Polypharmacy Problem in Medicare" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg">
          The average Medicare Part D enrollee filled approximately <strong>{avgClaimsPerBene} prescriptions</strong> in 2023 — more than two prescriptions per month. For some patients, the number is far higher. Polypharmacy — the concurrent use of multiple medications — is a growing problem with real consequences: adverse drug interactions, hospitalizations, and death.
        </p>

        <div className="not-prose grid grid-cols-3 gap-4 my-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-primary">{fmt(stats.claims)}</p>
            <p className="text-xs text-gray-600">Total Claims (2023)</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-primary">~{avgClaimsPerBene}</p>
            <p className="text-xs text-gray-600">Claims Per Enrollee</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">{fmt(combos.length)}</p>
            <p className="text-xs text-gray-600">Opioid+Benzo Prescribers</p>
          </div>
        </div>

        <h2>Why Polypharmacy Matters</h2>
        <p>
          Research consistently shows that patients taking 5+ medications face exponentially higher risks of adverse drug events. For Medicare patients — who are overwhelmingly 65+ with multiple chronic conditions — polypharmacy is the norm, not the exception.
        </p>
        <ul>
          <li><strong>Drug interactions</strong> — Each additional medication increases the risk of harmful interactions. A patient on a blood thinner, beta blocker, ACE inhibitor, statin, and pain reliever has dozens of potential interaction pathways.</li>
          <li><strong>Falls and fractures</strong> — Certain drug combinations (sedatives, blood pressure medications, opioids) significantly increase fall risk in elderly patients — the #1 cause of injury death in Americans over 65.</li>
          <li><strong>Cognitive impairment</strong> — Multiple studies link high medication burden to accelerated cognitive decline and increased dementia risk.</li>
          <li><strong>Hospitalizations</strong> — Adverse drug events account for an estimated 700,000+ emergency department visits per year in patients over 65.</li>
        </ul>

        <h2>The Dangerous Combinations</h2>
        <p>
          We identified <strong>{fmt(combos.length)} providers</strong> who prescribe both opioids and benzodiazepines — a combination the FDA has issued a <Link href="/dangerous-combinations">Black Box Warning</Link> about due to life-threatening respiratory depression. This is just one of many dangerous combinations hiding in the data.
        </p>
        <p>
          Other concerning combinations that our data can flag:
        </p>
        <ul>
          <li><strong>Opioids + muscle relaxants</strong> — Triple the overdose risk</li>
          <li><strong>Antipsychotics in elderly dementia patients</strong> — FDA Black Box Warning (we track {stats.riskCounts.high > 0 ? 'this' : 'these'} via our <Link href="/analysis/antipsychotic-elderly">antipsychotic analysis</Link>)</li>
          <li><strong>Multiple prescribers for the same patient</strong> — &quot;Doctor shopping&quot; patterns that enable drug accumulation</li>
        </ul>

        <h2>The Top 10 Most-Prescribed Drugs</h2>
        <p>
          The sheer volume of prescriptions for common drugs gives context to the polypharmacy problem:
        </p>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm bg-white rounded-xl border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">#</th>
                <th className="px-4 py-2 text-left font-semibold">Drug</th>
                <th className="px-4 py-2 text-right font-semibold">Claims</th>
                <th className="px-4 py-2 text-right font-semibold">Patients</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {drugs.sort((a, b) => b.claims - a.claims).slice(0, 10).map((d, i) => (
                <tr key={d.brand}>
                  <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-2 font-medium">{d.brand} <span className="text-gray-400 text-xs">({d.generic})</span></td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(d.claims)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(d.benes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>What Can Be Done?</h2>
        <ol>
          <li><strong>Medication therapy management (MTM)</strong> — CMS already requires Part D plans to offer MTM to high-risk patients, but utilization remains low.</li>
          <li><strong>Deprescribing protocols</strong> — Actively reviewing and reducing unnecessary medications, especially in elderly patients with long medication lists.</li>
          <li><strong>Better data sharing</strong> — Prescription Drug Monitoring Programs (PDMPs) help, but cross-state and cross-provider coordination remains poor.</li>
          <li><strong>Transparency</strong> — Tools like OpenPrescriber that surface prescribing patterns help patients, caregivers, and regulators identify potential problems.</li>
        </ol>
      </div>

      <RelatedAnalysis current="/analysis/polypharmacy" />
    </div>
  )
}
