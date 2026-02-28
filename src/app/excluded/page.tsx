import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

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
        <p className="text-red-800"><strong>🚫 What is the LEIE?</strong> The Office of Inspector General (OIG) maintains a list of providers excluded from all federal healthcare programs. Excluded providers are prohibited from receiving payment for services rendered to Medicare or Medicaid beneficiaries. Matching is based on NPI numbers and may include false positives.</p>
      </div>

      <div className="mt-8 space-y-4">
        {excluded.map(p => (
          <div key={p.npi} className="bg-white rounded-xl shadow-sm border border-red-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/providers/${p.npi}`} className="text-lg font-bold text-primary hover:underline">{p.name}</Link>
                  {p.credentials && <span className="text-sm text-gray-400">{p.credentials}</span>}
                  <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-medium">EXCLUDED</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{p.specialty} · {p.city}, {p.state}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span><strong>{fmt(p.claims)}</strong> claims</span>
                  <span><strong>{fmtMoney(p.cost)}</strong> drug cost</span>
                  {p.opioidRate > 0 && <span className="text-red-600"><strong>{p.opioidRate.toFixed(1)}%</strong> opioid rate</span>}
                </div>
              </div>
              <div className="flex-shrink-0 w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-red-700">{p.riskScore}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {excluded.length === 0 && (
        <p className="mt-8 text-center text-gray-500 py-12">No excluded provider matches found in the current dataset.</p>
      )}
    </div>
  )
}
