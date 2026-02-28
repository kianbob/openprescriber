import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'Excluded but Still Prescribing: 372 OIG-Listed Providers in Medicare Part D',
  description: 'We found 372 providers on the OIG exclusion list who appear in active Medicare Part D prescribing data. How does this happen?',
  alternates: { canonical: 'https://www.openprescriber.org/analysis/excluded-still-prescribing' },
}

export default function ExcludedStillPrescribingPage() {
  const highRisk = loadData('high-risk.json') as { npi: string; name: string; credentials: string; city: string; state: string; specialty: string; claims: number; cost: number; isExcluded: boolean }[]
  const excluded = highRisk.filter(p => p.isExcluded)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Excluded Providers' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">Excluded but Still Prescribing</h1>
      <ShareButtons title="Excluded Providers Still in Medicare Part D" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          The Office of Inspector General (OIG) maintains a list of providers excluded from federal healthcare programs — typically due to convictions for fraud, abuse, or other offenses. Yet <strong>{excluded.length} of these providers</strong> appear in the 2023 Medicare Part D prescribing dataset.
        </p>

        <div className="not-prose bg-red-50 border border-red-200 rounded-xl p-6 my-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><p className="text-3xl font-bold text-red-700">{excluded.length}</p><p className="text-xs text-red-600">Excluded Matches</p></div>
            <div><p className="text-3xl font-bold text-red-700">{fmt(excluded.reduce((a, p) => a + p.claims, 0))}</p><p className="text-xs text-red-600">Combined Claims</p></div>
            <div><p className="text-3xl font-bold text-red-700">{fmtMoney(excluded.reduce((a, p) => a + p.cost, 0))}</p><p className="text-xs text-red-600">Combined Cost</p></div>
          </div>
        </div>

        <h2>What Does &ldquo;Excluded&rdquo; Mean?</h2>
        <p>
          OIG exclusion is serious. Excluded individuals are prohibited from participating in any federal healthcare program, including Medicare and Medicaid. Anyone who employs or contracts with an excluded individual for services billed to federal programs faces civil monetary penalties.
        </p>
        <p>Types of exclusions include:</p>
        <ul>
          <li><strong>Mandatory:</strong> Convictions for Medicare/Medicaid fraud, patient abuse, felony drug convictions</li>
          <li><strong>Permissive:</strong> Misdemeanor fraud, license revocation, default on student loans, controlled substance violations</li>
        </ul>

        <h2>How Does This Happen?</h2>
        <p>Several explanations exist:</p>
        <ul>
          <li><strong>NPI reuse or data lag</strong> — The CMS dataset and LEIE may not perfectly synchronize</li>
          <li><strong>Prescriptions under old NPIs</strong> — Claims may be filed under a provider&apos;s NPI before exclusion took effect</li>
          <li><strong>Reinstatement timing</strong> — Some providers may have been reinstated between the LEIE snapshot and the prescribing data period</li>
          <li><strong>Genuine violations</strong> — Some excluded providers may genuinely be prescribing when they shouldn&apos;t be</li>
        </ul>

        <h2>The Accountability Gap</h2>
        <p>
          Regardless of the reason, the presence of excluded NPIs in active prescribing data highlights a system gap. If CMS cannot reliably cross-reference its own prescribing data against OIG&apos;s exclusion list, it raises questions about oversight effectiveness.
        </p>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">View all matches: <Link href="/excluded" className="text-primary font-medium hover:underline">Excluded Providers List →</Link></p>
        </div>
      </div>
    </div>
  )
}
