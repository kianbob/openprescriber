import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'About OpenPrescriber',
  description: 'OpenPrescriber is a free, open-data platform analyzing Medicare Part D prescribing patterns, drug costs, and fraud risk indicators.',
  alternates: { canonical: 'https://www.openprescriber.org/about' },
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'About' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-6">About OpenPrescriber</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600">
          OpenPrescriber is a free, open-data platform that makes Medicare Part D prescribing data accessible, searchable, and analyzable. We process CMS public use files to create provider profiles, fraud risk scores, and cost transparency tools.
        </p>

        <h2>What We Do</h2>
        <ul>
          <li><strong>Provider Profiles</strong> — Detailed prescribing data for 199,000+ Medicare Part D prescribers</li>
          <li><strong>Risk Scoring</strong> — Multi-factor statistical model flagging outlier prescribing patterns</li>
          <li><strong>Opioid Analysis</strong> — State-by-state and provider-level opioid prescribing tracking</li>
          <li><strong>Cost Transparency</strong> — $40.2 billion in drug costs broken down by provider, drug, state, and specialty</li>
          <li><strong>LEIE Cross-Reference</strong> — Matching active prescribers against the OIG&apos;s excluded provider list</li>
        </ul>

        <h2>Data Sources</h2>
        <ul>
          <li><strong>CMS Medicare Part D Prescribers by Provider (2019–2023)</strong> — 1,380,665 prescribers in 2023, 84 data fields per provider, 5 years of trend data</li>
          <li><strong>CMS Medicare Part D Prescribers by Provider and Drug (2023)</strong> — Provider-drug level prescribing detail</li>
          <li><strong>OIG LEIE Downloadable Database</strong> — 8,300+ excluded individuals and entities</li>
        </ul>

        <h2>Important Disclaimers</h2>
        <p>
          Risk scores are <strong>statistical indicators</strong> based on publicly available prescribing data. They do not constitute allegations of fraud, abuse, or medical malpractice. Many flagged patterns have legitimate clinical explanations — for example, pain management specialists are expected to have higher opioid prescribing rates. Always consider clinical context.
        </p>
        <p>
          This platform is not medical advice. Prescribing data reflects patterns, not quality of care. Provider names are public under CMS data release policies.
        </p>

        <h2>Part of TheDataProject.ai</h2>
        <p>
          OpenPrescriber is one of 9 data transparency platforms built by <a href="https://thedataproject.ai" className="text-primary">TheDataProject.ai</a>, covering healthcare, government spending, immigration, lobbying, vaccines, and farm subsidies.
        </p>
      </div>
    </div>
  )
}
