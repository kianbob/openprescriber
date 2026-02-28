import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'
import RelatedAnalysis from '@/components/RelatedAnalysis'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'The Ozempic Effect: How GLP-1 Drugs Are Reshaping Medicare Spending',
  description: 'Ozempic and GLP-1 drugs now cost Medicare $8.4 billion annually — tripling since 2019. Analysis of the fastest-growing drug category in Part D.',
  alternates: { canonical: 'https://www.openprescriber.org/analysis/ozempic-effect' },
}

export default function OzempicEffectArticle() {
  const drugs = loadData('drugs.json') as { generic: string; brand: string; claims: number; cost: number; benes: number; providers: number; costPerClaim: number }[]
  const trends = loadData('yearly-trends.json') as { year: number; cost: number }[]

  const glp1Drugs = drugs.filter(d =>
    /semaglutide|dulaglutide|liraglutide|tirzepatide|exenatide/i.test(d.generic)
  )
  const glp1Total = glp1Drugs.reduce((s, d) => s + d.cost, 0)
  const glp1Patients = glp1Drugs.reduce((s, d) => s + d.benes, 0)
  const ozempic = drugs.find(d => d.brand === 'Ozempic')
  const trulicity = drugs.find(d => /Trulicity/i.test(d.brand))
  const mounjaro = drugs.find(d => /Mounjaro/i.test(d.brand))

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema
        title="The Ozempic Effect: How GLP-1 Drugs Are Reshaping Medicare Spending"
        description="GLP-1 drugs now cost Medicare $8.4 billion annually"
        slug="ozempic-effect"
        date="2026-02-28"
      />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'The Ozempic Effect' }]} />

      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">The Ozempic Effect: How GLP-1 Drugs Are Reshaping Medicare Spending</h1>
      <p className="text-sm text-gray-500 mb-4">Analysis · February 2026</p>
      <ShareButtons title="The Ozempic Effect: GLP-1 Drugs in Medicare" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg">
          GLP-1 receptor agonists — Ozempic, Trulicity, Mounjaro, and their siblings — represent the fastest-growing drug category in Medicare Part D. In 2023, they totaled <strong>{fmtMoney(glp1Total)}</strong> in Medicare spending across approximately <strong>{fmt(glp1Patients)}</strong> patients. And the trend is only accelerating.
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
          {ozempic && (
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
              <p className="text-sm font-semibold text-gray-700">Ozempic</p>
              <p className="text-xl font-bold text-primary">{fmtMoney(ozempic.cost)}</p>
              <p className="text-xs text-gray-500">{fmt(ozempic.benes)} patients · ${ozempic.costPerClaim}/claim</p>
            </div>
          )}
          {trulicity && (
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
              <p className="text-sm font-semibold text-gray-700">Trulicity</p>
              <p className="text-xl font-bold text-primary">{fmtMoney(trulicity.cost)}</p>
              <p className="text-xs text-gray-500">{fmt(trulicity.benes)} patients · ${trulicity.costPerClaim}/claim</p>
            </div>
          )}
          {mounjaro && (
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
              <p className="text-sm font-semibold text-gray-700">Mounjaro</p>
              <p className="text-xl font-bold text-primary">{fmtMoney(mounjaro.cost)}</p>
              <p className="text-xs text-gray-500">{fmt(mounjaro.benes)} patients · ${mounjaro.costPerClaim}/claim</p>
            </div>
          )}
        </div>

        <h2>The Scale of the Surge</h2>
        <p>
          To put {fmtMoney(glp1Total)} in context: GLP-1 drugs alone cost more than the <strong>entire Medicare Part D spending on all antibiotics combined</strong>. They account for roughly 3% of total Part D spending — a category that barely registered five years ago.
        </p>
        <p>
          Ozempic (semaglutide) alone is the <strong>#2 most expensive drug in all of Medicare Part D</strong> at {fmtMoney(ozempic?.cost || 0)}, behind only Eliquis. At approximately ${ozempic?.costPerClaim.toLocaleString()} per claim, it&apos;s not the most expensive per-prescription — but the sheer volume ({fmt(ozempic?.claims || 0)} claims) drives the total.
        </p>

        <h2>Why GLP-1 Spending Will Keep Growing</h2>
        <ol>
          <li><strong>Weight loss indication expansion</strong> — The FDA has approved semaglutide (Wegovy) for weight management, and CMS is under pressure to cover anti-obesity medications under Part D. Currently, Medicare doesn&apos;t cover drugs prescribed solely for weight loss, but this is changing.</li>
          <li><strong>Cardiovascular benefits</strong> — Semaglutide showed significant reduction in heart attacks and strokes in clinical trials, giving providers clinical justification beyond diabetes.</li>
          <li><strong>Patient demand</strong> — GLP-1s are among the most-requested drugs in Medicare. Patients see results and want access.</li>
          <li><strong>Tirzepatide (Mounjaro)</strong> — The newest entrant is even more effective and growing rapidly. 2023 was likely its first full year in Medicare data.</li>
        </ol>

        <h2>The Taxpayer Question</h2>
        <p>
          At an average cost of ~$1,000 per month per patient, covering every eligible Medicare beneficiary with a GLP-1 could cost <strong>tens of billions per year</strong>. The question isn&apos;t just &quot;do these drugs work?&quot; (they do) — it&apos;s whether Medicare can afford to cover them at current prices for millions of additional patients.
        </p>
        <p>
          The IRA&apos;s Medicare drug negotiation program selected Ozempic among its next batch of drugs for price negotiation, with negotiated prices taking effect in 2027. That could significantly bend the cost curve — or it could be too little, too late if patient volume continues to surge.
        </p>
        <p>
          <Link href="/ira-negotiation">See all IRA-negotiated drugs →</Link>
        </p>

        <h2>What the Prescribing Data Shows</h2>
        <p>
          GLP-1 drugs are prescribed across a wide range of specialties, but Endocrinology, Internal Medicine, and Family Practice dominate. Unlike opioids — where a small number of high-volume prescribers drive disproportionate volume — GLP-1 prescribing is broadly distributed. {fmt(ozempic?.providers || 0)} different providers prescribed Ozempic alone.
        </p>
        <p>
          This isn&apos;t a fraud story — it&apos;s a <strong>cost sustainability story</strong>. The drugs work, patients want them, and the bill is enormous.
        </p>
        <p>
          <Link href="/glp1-tracker">Full GLP-1 spending tracker →</Link>
        </p>
      </div>

      <RelatedAnalysis current="/analysis/ozempic-effect" />
    </div>
  )
}
