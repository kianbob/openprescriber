import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import DataFreshness from '@/components/DataFreshness'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import ExcludedClient from './ExcludedClient'

export const metadata: Metadata = {
  title: 'Excluded Providers Still Prescribing in Medicare Part D',
  description: 'Medicare Part D prescribers who appear on the OIG List of Excluded Individuals/Entities (LEIE) — providers convicted of healthcare fraud or abuse.',
  alternates: { canonical: 'https://www.openprescriber.org/excluded' },
  openGraph: {
    title: 'Excluded Providers Still Prescribing',
    url: 'https://www.openprescriber.org/excluded',
    type: 'website',
  },
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
      <DataFreshness />
      <ShareButtons title="Excluded Providers Still in Medicare Part D" />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
          <p className="text-2xl font-bold text-red-700">{fmt(excluded.length)}</p>
          <p className="text-xs text-gray-600">Excluded Providers</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border">
          <p className="text-2xl font-bold text-primary">{fmt(excluded.reduce((s, p) => s + (p.claims ?? 0), 0))}</p>
          <p className="text-xs text-gray-600">Total Claims</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border">
          <p className="text-2xl font-bold text-primary">{fmtMoney(excluded.reduce((s, p) => s + (p.cost ?? 0), 0))}</p>
          <p className="text-xs text-gray-600">Total Drug Costs</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
          <p className="text-2xl font-bold text-orange-700">{fmt(excluded.filter(p => (p.riskScore ?? 0) >= 50).length)}</p>
          <p className="text-xs text-gray-600">High Risk (≥50)</p>
        </div>
      </div>

      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-sm">
        <p className="text-red-800"><strong>What is the LEIE?</strong> The Office of Inspector General (OIG) maintains a list of providers excluded from all federal healthcare programs. Excluded providers are prohibited from receiving payment for services rendered to Medicare or Medicaid beneficiaries. Matching is based on NPI numbers and may include false positives.</p>
      </div>

      <div className="mt-8">
        <ExcludedClient excluded={excluded} />
      </div>

      {/* Related Analysis */}
      <section className="mt-12">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">Related Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <Link href="/analysis/excluded-still-prescribing" className="bg-white rounded-xl shadow-sm p-5 border hover:border-primary transition-colors">
            <h3 className="font-semibold text-gray-900 mb-1">🚫 Excluded Providers Still Prescribing</h3>
            <p className="text-sm text-gray-600">Deep dive into how OIG-excluded providers continue to appear in Medicare Part D prescribing data.</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
