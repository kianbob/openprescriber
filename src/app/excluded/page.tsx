import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import { loadData } from '@/lib/server-utils'
import ExcludedClient from './ExcludedClient'

export const metadata: Metadata = {
  title: 'Excluded Providers Still Prescribing in Medicare Part D',
  description: 'Medicare Part D prescribers who appear on the OIG List of Excluded Individuals/Entities (LEIE) — providers convicted of healthcare fraud or abuse.',
  alternates: { canonical: 'https://www.openprescriber.org/excluded' },
}

export default function ExcludedPage() {
  const excluded = loadData('excluded.json') as { npi: string; name: string; credentials: string; city: string; state: string; specialty: string; claims: number; cost: number; opioidRate: number; riskScore: number; riskFlags: string[]; isExcluded: boolean }[]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Excluded Providers' }]} />
      <DisclaimerBanner variant="risk" />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Excluded Providers in Medicare Part D</h1>
      <p className="text-gray-600 mb-2">
        {excluded.length} providers in our dataset match the OIG&apos;s List of Excluded Individuals/Entities (LEIE). These are individuals or entities that have been convicted of healthcare fraud, patient abuse, or related offenses.
      </p>
      <ShareButtons title="Excluded Providers Still in Medicare Part D" />

      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-sm">
        <p className="text-red-800"><strong>What is the LEIE?</strong> The Office of Inspector General (OIG) maintains a list of providers excluded from all federal healthcare programs. Excluded providers are prohibited from receiving payment for services rendered to Medicare or Medicaid beneficiaries. Matching is based on NPI numbers and may include false positives.</p>
      </div>

      <div className="mt-8">
        <ExcludedClient excluded={excluded} />
      </div>
    </div>
  )
}
