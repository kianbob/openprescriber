import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import PeerLookupClient from './PeerLookupClient'

export const metadata: Metadata = {
  title: 'Prescriber Peer Comparison Tool: Specialty Benchmarks',
  description: 'Look up any medical specialty to see opioid rates, costs, and brand prescribing benchmarks. Compare providers to their peers with percentile data.',
  alternates: { canonical: 'https://www.openprescriber.org/tools/peer-lookup' },
}

export default function PeerLookupPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'Peer Comparison Tool' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">Prescriber Peer Comparison Tool</h1>
      <ShareButtons title="Prescriber Peer Comparison Tool: Specialty Benchmarks" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          How does a provider compare to their specialty peers? This tool lets you explore prescribing benchmarks for any Medicare Part D specialty — including average opioid rates, cost per beneficiary, brand prescribing percentage, and the percentile thresholds used to identify statistical outliers. No other public tool offers this level of specialty-adjusted context.
        </p>
      </div>

      <PeerLookupClient />

      <div className="prose prose-gray max-w-none mt-8">
        <h2>Why This Tool Exists</h2>
        <p>
          When evaluating a provider&apos;s prescribing patterns, raw numbers are misleading without specialty context. A pain management specialist with a 15% opioid rate might be well below their peers&apos; average, while a dermatologist at 5% might be a major outlier. This tool provides the reference data needed to make meaningful comparisons.
        </p>
        <p>
          OpenPrescriber calculates these benchmarks from the complete 2023 Medicare Part D dataset, encompassing over 1.1 million prescribers across 156+ specialties. For each specialty, we compute the mean, standard deviation, median, and key percentiles (P90, P95) for three critical metrics: opioid prescribing rate, cost per beneficiary, and brand-name prescribing percentage.
        </p>

        <h2>Who Uses This Data?</h2>
        <p>
          <strong>Patients</strong> use peer comparison to understand whether their doctor&apos;s prescribing patterns are typical or unusual. <strong>Journalists</strong> use it to contextualize stories about prescribing outliers. <strong>Researchers</strong> use it to study variation in clinical practice. <strong>Policymakers</strong> use it to identify specialties where targeted interventions could reduce costs or improve safety.
        </p>
        <p>
          CMS uses similar specialty-adjusted methodologies internally for fraud detection and quality measurement. OpenPrescriber makes this approach publicly accessible for the first time, democratizing access to the analytical tools previously available only to government auditors and large health systems.
        </p>

        <h2>Limitations</h2>
        <p>
          Specialty benchmarks reflect averages across all providers in a specialty nationally. Regional variation, practice size, and patient population differences can all affect individual provider metrics. A provider who appears to be an outlier statistically may have legitimate clinical reasons for their prescribing patterns. This tool is intended for informational and educational purposes — not as a definitive assessment of provider quality or appropriateness.
        </p>

        <div className="not-prose mt-8 space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">Related: <Link href="/peer-comparison" className="text-primary font-medium hover:underline">Peer Comparison Analysis →</Link> | <Link href="/tools/savings-calculator" className="text-primary font-medium hover:underline">Generic Savings Calculator →</Link> | <Link href="/flagged" className="text-primary font-medium hover:underline">Flagged Providers →</Link></p>
          </div>
          <p className="text-xs text-gray-400">Data source: CMS Medicare Part D Prescribers dataset, 2023. Benchmarks are calculated for specialties with 30+ providers. This tool is for educational purposes only and should not be used as the sole basis for healthcare decisions.</p>
        </div>
      </div>
    </div>
  )
}
