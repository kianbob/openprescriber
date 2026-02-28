import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { loadData } from '@/lib/server-utils'
import RiskExplorerClient from './RiskExplorerClient'

export const metadata: Metadata = {
  title: 'Risk Explorer: Interactive Medicare Prescriber Risk Analysis',
  description: 'Explore 6,700+ flagged Medicare Part D prescribers with interactive filters. Filter by risk score, state, specialty, and specific risk flags.',
  alternates: { canonical: 'https://www.openprescriber.org/risk-explorer' },
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Risk Explorer' }]} />
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
