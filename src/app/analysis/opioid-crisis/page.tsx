import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ArticleSchema from '@/components/ArticleSchema'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt } from '@/lib/utils'
import { stateName } from '@/lib/state-names'
import { loadData } from '@/lib/server-utils'
import RelatedAnalysis from '@/components/RelatedAnalysis'

export const metadata: Metadata = {
  title: 'The Medicare Opioid Crisis in Numbers',
  description: 'One in three Medicare Part D prescribers write opioid prescriptions. Analysis of 65,349 opioid prescribers and 16,431 high-rate providers.',
  openGraph: {
    title: 'The Medicare Opioid Crisis in Numbers',
    description: 'One in three Medicare Part D prescribers write opioid prescriptions. Analysis of 65,349 opioid prescribers and 16,431 high-rate providers.',
    url: 'https://www.openprescriber.org/analysis/opioid-crisis',
    type: 'article',
  },
  alternates: { canonical: 'https://www.openprescriber.org/analysis/opioid-crisis' },
}

export default function OpioidCrisisPage() {
  const stats = loadData('stats.json')
  const opioidByState = loadData('opioid-by-state.json') as { state: string; avgOpioidRate: number; highOpioid: number; opioidProv: number }[]
  const topStates = [...opioidByState].sort((a, b) => b.avgOpioidRate - a.avgOpioidRate).slice(0, 10)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'The Medicare Opioid Crisis' }]} />
      <ArticleSchema title="The Medicare Opioid Crisis in Numbers" description="One in three Medicare Part D prescribers write opioid prescriptions." slug="opioid-crisis" date="2026-03-01" />
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
                  <td className="px-4 py-2 text-right font-mono text-red-600 font-semibold">{(s.avgOpioidRate ?? 0).toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(s.highOpioid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>The Specialty Dimension</h2>
        <p>
          Opioid prescribing is not uniformly distributed across medical specialties. Pain management specialists and anesthesiologists prescribe opioids at the highest rates — often above 50% — and this is clinically expected. But the crisis signal comes from specialties where opioid prescribing should be rare:
        </p>
        <ul>
          <li><strong>Family Practice and Internal Medicine</strong> account for the most total opioid prescriptions by sheer volume, even at moderate rates</li>
          <li><strong>Nurse Practitioners</strong> are disproportionately flagged — they&apos;re 19% of prescribers but nearly half of flagged providers (see our <Link href="/analysis/nurse-practitioners">NP analysis</Link>)</li>
          <li><strong>Emergency Medicine</strong> providers prescribing opioids at high rates raises questions about acute prescribing turning into chronic use</li>
          <li><strong>Psychiatry</strong> opioid prescribing is particularly concerning given co-occurring substance use disorders</li>
        </ul>

        <h2>The Dangerous Combination</h2>
        <p>
          Beyond opioid prescribing alone, we identified <strong>6,149 providers</strong> who co-prescribe opioids and benzodiazepines — a combination the FDA has <Link href="/dangerous-combinations">specifically warned against</Link> due to dramatically increased overdose risk. This co-prescribing pattern is one of the strongest signals in our risk scoring model.
        </p>

        <h2>Long-Acting Opioids: The Escalation Signal</h2>
        <p>
          Not all opioids carry equal risk. Long-acting opioids (like OxyContin, fentanyl patches, and methadone) are prescribed for chronic pain and carry substantially higher addiction potential. In our data, providers with high long-acting opioid rates relative to their specialty peers receive elevated risk scores — this pattern often indicates escalation from acute to chronic prescribing.
        </p>

        <h2>What This Means</h2>
        <p>
          Not all opioid prescribing is inappropriate — pain management specialists, oncologists, and palliative care providers legitimately prescribe opioids at high rates. But the sheer volume suggests the pipeline remains enormous, even as national efforts aim to curb unnecessary prescribing.
        </p>
        <p>
          The key question isn&apos;t just <em>how much</em> but <em>where and by whom</em>. Geographic hotspots and specialty patterns point to systemic issues that blanket regulations miss. Our <Link href="/analysis/pill-mills">pill mill analysis</Link> identifies the statistical fingerprints of the most extreme cases — providers whose prescribing patterns look nothing like their peers.
        </p>
        <p>
          The data also reveals that the opioid crisis hasn&apos;t ended — it has shifted. While overall prescribing volumes have declined from their 2012 peak, the patients who remain on opioids are often on higher doses and more dangerous combinations. Medicare Part D data captures this: 113,169 providers still prescribe opioids at rates above 20%, and the geographic concentration in Southeastern and Appalachian states persists.
        </p>

        <h2>What You Can Do With This Data</h2>
        <p>
          OpenPrescriber makes this data actionable. You can:
        </p>
        <ul>
          <li><Link href="/opioids">Explore opioid prescribing patterns</Link> by state, specialty, and individual provider</li>
          <li><Link href="/risk-explorer">Use the Risk Explorer</Link> to filter flagged providers by opioid-related risk flags</li>
          <li><Link href="/dangerous-combinations">View dangerous combination prescribers</Link> — opioid + benzodiazepine co-prescribers</li>
          <li><Link href="/analysis/opioid-hotspots">See geographic hotspots</Link> — which states and regions have the highest rates</li>
          <li><Link href="/ml-fraud-detection">Review ML-flagged providers</Link> — machine learning identifies patterns that rules miss</li>
        </ul>

        <div className="not-prose mt-8 bg-gray-50 border rounded-lg p-4">
          <p className="text-xs text-gray-500">
            Data from CMS Medicare Part D Prescriber Public Use File, 2023. Opioid prescribing rates represent the percentage of a provider&apos;s total claims that are for opioid medications. &quot;High-rate&quot; is defined as above 20%. This analysis does not evaluate the clinical appropriateness of individual prescriptions.
          </p>
        </div>
      <RelatedAnalysis current={"/analysis/opioid-crisis"} />
      </div>
    </div>
  )
}
