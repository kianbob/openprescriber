import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import { loadData } from '@/lib/server-utils'
import RiskExplorerClient from './RiskExplorerClient'

export const metadata: Metadata = {
  title: 'Risk Explorer: Interactive Medicare Prescriber Risk Analysis',
  description: 'Explore 6,700+ flagged Medicare Part D prescribers with interactive filters. Filter by risk score, state, specialty, and specific risk flags.',
  alternates: { canonical: 'https://www.openprescriber.org/risk-explorer' },
  openGraph: {
    title: 'Prescriber Risk Explorer',
    url: 'https://www.openprescriber.org/risk-explorer',
    type: 'website',
  },
}

export default function RiskExplorerPage() {
  const providers = loadData('high-risk.json') as {
    npi: string; name: string; credentials: string;
    city: string; state: string; specialty: string;
    claims: number; cost: number; benes: number;
    opioidRate: number; costPerBene: number; brandPct: number;
    claimsPerBene: number;
    riskScore: number; riskLevel: string; riskFlags: string[];
    riskComponents: Record<string, number>;
    isExcluded: boolean; opioidBenzoCombination: boolean;
  }[]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'How does OpenPrescriber calculate Medicare fraud risk scores?', acceptedAnswer: { '@type': 'Answer', text: 'OpenPrescriber uses a machine learning model trained on 281 confirmed OIG exclusion cases. The model evaluates prescribing patterns including cost outliers, opioid rates, brand-name preference, and specialty peer comparisons to assign risk scores from 0 to 100.' } },
      { '@type': 'Question', name: 'What does a high fraud risk score mean?', acceptedAnswer: { '@type': 'Answer', text: 'A high risk score means a prescriber\'s patterns statistically resemble those of providers who were later excluded by the OIG for fraud or abuse. It does not prove fraud — it highlights providers whose data warrants closer review.' } },
      { '@type': 'Question', name: 'Can I filter flagged prescribers by state or specialty?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The Risk Explorer lets you filter flagged providers by risk score, state, specialty, and specific risk flags such as cost outliers, high opioid rates, or OIG exclusion matches.' } },
    ],
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Breadcrumbs items={[{ label: 'Risk Explorer' }]} />
      <DisclaimerBanner variant="risk" />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Risk Explorer</h1>
      <p className="text-gray-600 mb-2">
        Interactive tool to explore {providers.length.toLocaleString()} flagged Medicare Part D providers. 
        Filter by risk score, state, specialty, and specific risk flags.
      </p>
      <ShareButtons title="Medicare Part D Risk Explorer" />

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mb-6">
        <strong>⚠️</strong> Risk scores are statistical indicators based on publicly available prescribing data. They do not constitute allegations of fraud or malpractice. Many flagged patterns have legitimate clinical explanations. Also see <Link href="/ml-fraud-detection" className="text-amber-800 font-medium underline">ML Fraud Detection</Link> for machine learning-based analysis.
      </div>

      <RiskExplorerClient providers={providers} />
    </div>
  )
}
