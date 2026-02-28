import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'
import RelatedAnalysis from '@/components/RelatedAnalysis'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'Anatomy of a Pill Mill: What Opioid Data Patterns Reveal About High-Risk Prescribers',
  description: 'What does a pill mill look like in Medicare data? We analyze the statistical fingerprints of high-risk opioid prescribers using specialty-adjusted z-scores.',
  alternates: { canonical: 'https://www.openprescriber.org/analysis/pill-mills' },
}

export default function PillMillsArticle() {
  const stats = loadData('stats.json')
  const highRisk = loadData('high-risk.json') as { npi: string; name: string; specialty: string; state: string; city: string; opioidRate: number; riskScore: number; riskFlags: string[]; claims: number; cost: number }[]
  const combos = loadData('drug-combos.json') as { npi: string; name: string }[]

  // Pill mill indicators: high opioid + low diversity + high volume
  const pillMillCandidates = highRisk.filter(p =>
    p.opioidRate > 50 &&
    p.riskScore >= 40 &&
    p.riskFlags.some(f => f.includes('opioid'))
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema
        title="Anatomy of a Pill Mill"
        description="Statistical fingerprints of high-risk opioid prescribers in Medicare Part D"
        slug="pill-mills"
        date="2026-02-28"
      />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Pill Mills' }]} />
      <DisclaimerBanner variant="risk" />

      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Anatomy of a Pill Mill: What Medicare Data Reveals</h1>
      <p className="text-sm text-gray-500 mb-4">Analysis · February 2026</p>
      <ShareButtons title="Anatomy of a Pill Mill: Medicare Data Analysis" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg">
          &quot;Pill mill&quot; is colloquial, but the data signature is specific. When a provider&apos;s opioid prescribing rate vastly exceeds their specialty peers, they prescribe a narrow range of drugs (mostly controlled substances), and they combine opioids with benzodiazepines at high rates — the statistical fingerprint starts to look very different from legitimate pain management.
        </p>

        <h2>The Data Fingerprint</h2>
        <p>
          Across {fmt(stats.providers)} Medicare Part D prescribers, we identified <strong>{pillMillCandidates.length}</strong> providers with prescribing patterns that match multiple pill mill indicators simultaneously:
        </p>
        <ul>
          <li><strong>Opioid rate &gt;50%</strong> — More than half of all prescriptions are opioids (vs. national average ~12%)</li>
          <li><strong>Risk score ≥40/100</strong> — Multiple independent risk factors flagged</li>
          <li><strong>Specialty-adjusted outlier</strong> — Opioid rate significantly above their own specialty&apos;s mean</li>
        </ul>

        <h2>Five Warning Signs in the Data</h2>

        <h3>1. Extreme Opioid Concentration</h3>
        <p>
          A typical Family Practice provider prescribes opioids for about 3.9% of claims. A pain management specialist might legitimately hit 30-50%. But when a non-specialist is writing opioids for 70-90% of their Medicare patients, the data raises questions. Our scoring system compares each provider to their <em>own specialty peers</em>, so a pain specialist at 40% isn&apos;t flagged — but a family doctor at 40% generates a significant z-score.
        </p>

        <h3>2. Low Drug Diversity</h3>
        <p>
          Legitimate physicians prescribe dozens to hundreds of different medications. Providers prescribing fewer than 10 unique drugs — especially when most are Schedule II-IV controlled substances — exhibit a pattern inconsistent with genuine medical practice.
        </p>

        <h3>3. Opioid + Benzodiazepine Combinations</h3>
        <p>
          The FDA has issued a <a href="https://www.fda.gov/drugs/drug-safety-and-availability/fda-drug-safety-communication-fda-warns-about-serious-risks-and-death-when-combining-opioid-pain-or" target="_blank" rel="noopener noreferrer">Black Box Warning</a> about concurrent opioid and benzodiazepine use due to life-threatening respiratory depression. We identified <strong>{fmt(combos.length)}</strong> providers who prescribe both. While some have legitimate clinical reasons, the combination is a well-established red flag.
        </p>

        <h3>4. High Fills Per Patient</h3>
        <p>
          When a provider has an unusually high number of prescription fills per patient, it may indicate excessive prescribing or &quot;frequent flyer&quot; patients seeking repeat refills.
        </p>

        <h3>5. Extreme Cost Per Beneficiary</h3>
        <p>
          Some opioid-heavy providers also show extremely high cost per patient — not because opioids themselves are expensive, but because they may be prescribing high-cost brand-name formulations when generics exist, or writing for expensive long-acting formulations unnecessarily.
        </p>

        <h2>What Machine Learning Adds</h2>
        <p>
          Our <Link href="/ml-fraud-detection">ML fraud detection model</Link> — trained on 281 providers actually convicted of healthcare fraud — identifies patterns that rule-based systems miss. The model learns the <em>combination</em> of features that distinguish fraud cases from legitimate outliers. It flagged 2,579 providers that our rule-based scoring missed entirely.
        </p>

        <h2>Legitimate High-Opioid Prescribers Exist</h2>
        <p>
          It&apos;s important to note: some providers with very high opioid rates are providing essential care. Palliative care, hospice, cancer pain management, and addiction treatment (buprenorphine/Suboxone prescribers) all legitimately generate high opioid prescribing rates. Our methodology accounts for specialty baselines, but no statistical model perfectly distinguishes fraud from specialized care.
        </p>
        <p>
          That&apos;s why we emphasize: <strong>these are statistical indicators, not accusations</strong>. The goal is to surface patterns that warrant further examination — by CMS, by state medical boards, by journalists, or by the providers themselves.
        </p>
      </div>

      {pillMillCandidates.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-3">Highest-Risk Providers ({pillMillCandidates.length})</h2>
          <p className="text-sm text-gray-600 mb-3">Providers with opioid rate &gt;50% and risk score ≥40. Statistical patterns only — not accusations.</p>
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto border">
            <table className="w-full text-sm">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Provider</th>
                  <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Specialty</th>
                  <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Location</th>
                  <th className="px-4 py-3 text-right font-semibold">Opioid Rate</th>
                  <th className="px-4 py-3 text-center font-semibold">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pillMillCandidates.slice(0, 20).map(p => (
                  <tr key={p.npi} className="hover:bg-red-50/50">
                    <td className="px-4 py-2"><Link href={`/providers/${p.npi}`} className="font-medium text-primary hover:underline">{p.name}</Link></td>
                    <td className="px-4 py-2 text-gray-600 hidden md:table-cell text-xs">{p.specialty}</td>
                    <td className="px-4 py-2 text-gray-500 hidden md:table-cell text-xs">{p.city}, {p.state}</td>
                    <td className="px-4 py-2 text-right font-mono text-red-600 font-bold">{p.opioidRate.toFixed(1)}%</td>
                    <td className="px-4 py-2 text-center"><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">{p.riskScore}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <RelatedAnalysis current="/analysis/pill-mills" />
    </div>
  )
}
