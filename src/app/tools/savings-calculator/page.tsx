import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { loadData } from '@/lib/server-utils'
import SavingsCalculatorClient from './SavingsCalculatorClient'

export const metadata: Metadata = {
  title: 'Generic Savings Calculator: How Much Could Medicare Save?',
  description: 'Calculate how much Medicare Part D could save if providers switched from brand-name to generic drugs. Explore state-by-state savings potential.',
  alternates: { canonical: 'https://www.openprescriber.org/tools/savings-calculator' },
}

export default function SavingsCalculatorPage() {
  const states = loadData('states.json')

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'Generic Savings Calculator' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">Generic Savings Calculator</h1>
      <ShareButtons title="Generic Savings Calculator: How Much Could Medicare Save?" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          Brand-name drugs cost Medicare Part D <strong>$185.4 billion</strong> annually, while generics cost just <strong>$39.4 billion</strong> — despite generics accounting for 86.6% of all prescriptions filled. This calculator shows the massive savings potential if more brand prescriptions were switched to generic equivalents.
        </p>
      </div>

      <SavingsCalculatorClient states={states} />

      <div className="prose prose-gray max-w-none">
        <h2>How This Calculator Works</h2>
        <p>
          We use a conservative estimate that generic drugs cost approximately <strong>73% less</strong> than their brand-name equivalents on average. This figure comes from FDA and academic research comparing brand vs. generic pricing across therapeutic categories. The actual savings would vary by drug, since some generics are nearly as expensive as brands while others cost 95%+ less.
        </p>
        <p>
          Not all brand prescriptions can be switched — some drugs have no generic equivalent (particularly newer biologics and specialty drugs). However, research consistently shows that a significant portion of brand prescribing occurs even when identical generics are available, driven by provider habit, patient preference, and pharmaceutical marketing.
        </p>

        <h2>Why Generic Prescribing Matters</h2>
        <p>
          The FDA requires that generic drugs have the same active ingredient, strength, dosage form, and route of administration as the brand-name product. They must also demonstrate <strong>bioequivalence</strong> — meaning they deliver the same amount of active ingredient to the body at the same rate. Despite this, brand prescribing persists at significant rates.
        </p>
        <p>
          For Medicare beneficiaries, the difference is not just systemic — it&apos;s personal. Brand-name drugs typically have higher copays, and the coverage gap (&quot;donut hole&quot;) hits faster with expensive brands. A provider who habitually prescribes brands over generics may be costing their patients hundreds or thousands of dollars annually in unnecessary out-of-pocket spending.
        </p>
        <p>
          OpenPrescriber tracks brand vs. generic prescribing rates for every Medicare Part D provider, enabling patients, researchers, and policymakers to identify patterns and outliers. States, specialties, and individual providers all show significant variation in generic prescribing — variation that translates directly into billions of dollars in potential savings.
        </p>

        <div className="not-prose mt-8 space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">Related: <Link href="/brand-vs-generic" className="text-primary font-medium hover:underline">Brand vs Generic Analysis →</Link> | <Link href="/ira-negotiation" className="text-primary font-medium hover:underline">IRA Drug Negotiation →</Link> | <Link href="/tools/peer-lookup" className="text-primary font-medium hover:underline">Peer Comparison Tool →</Link></p>
          </div>
          <p className="text-xs text-gray-400">Data source: CMS Medicare Part D Prescribers dataset, 2023. Savings estimates are illustrative and assume average generic substitution rates. Actual savings depend on generic availability and clinical appropriateness. This tool is for educational purposes only.</p>
        </div>
      </div>
    </div>
  )
}
