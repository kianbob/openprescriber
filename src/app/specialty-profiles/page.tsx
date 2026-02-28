import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import SpecialtyProfilesClient from './SpecialtyProfilesClient'

export const metadata: Metadata = {
  title: 'Specialty Prescribing Profiles: Average Metrics by Medical Specialty',
  description: 'How does each medical specialty prescribe? Compare opioid rates, drug costs, brand preference, and prescribing volumes across 110 specialties.',
  alternates: { canonical: 'https://www.openprescriber.org/specialty-profiles' },
}

type SpecStat = { n: number; opioidRate: { mean: number; std: number; p50: number; p90: number; p95: number }; costPerBene: { mean: number; std: number; p50: number; p90: number; p95: number }; brandPct: { mean: number; std: number; p50: number; p90: number } }

export default function SpecialtyProfilesPage() {
  const specStats = loadData('specialty-stats.json') as Record<string, SpecStat>
  const specs = loadData('specialties.json') as { specialty: string; providers: number; claims: number; cost: number; opioidProv: number; avgOpioidRate: number; avgBrandPct: number; costPerProvider: number }[]

  const merged = specs
    .filter(s => specStats[s.specialty])
    .map(s => ({
      ...s,
      stats: specStats[s.specialty],
    }))

  // Prepare flattened data for client
  const profileData = merged.map(s => ({
    specialty: s.specialty,
    providers: s.providers,
    opioidMean: s.stats.opioidRate.mean,
    opioidP90: s.stats.opioidRate.p90,
    opioidP95: s.stats.opioidRate.p95,
    costMean: s.stats.costPerBene.mean,
    costP90: s.stats.costPerBene.p90,
    brandMean: s.stats.brandPct.mean,
    n: s.stats.n,
  }))

  const opioid = [...profileData].sort((a, b) => b.opioidMean - a.opioidMean)
  const cost = [...profileData].sort((a, b) => b.costMean - a.costMean)
  const brand = [...profileData].sort((a, b) => b.brandMean - a.brandMean)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Specialty Profiles' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Specialty Prescribing Profiles</h1>
      <p className="text-gray-600 mb-2">
        How different medical specialties prescribe — with peer-comparison statistics used in our <Link href="/peer-comparison" className="text-primary hover:underline">anomaly detection model</Link>.
      </p>
      <ShareButtons title="Specialty Prescribing Profiles in Medicare Part D" />

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6">
        <h2 className="font-bold text-blue-900">Why This Matters</h2>
        <p className="text-sm text-blue-800 mt-1">
          A pain management specialist prescribing 50% opioids is normal. A family doctor at 50% is a red flag. 
          Our specialty-adjusted scoring compares each provider to their peers, not to a universal threshold. 
          These profiles show the baseline for each specialty — the standard against which anomalies are measured.
        </p>
      </div>

      <div className="mt-8">
        <SpecialtyProfilesClient opioid={opioid} cost={cost} brand={brand} />
      </div>

      <div className="mt-8 bg-gray-50 rounded-xl p-5 border text-sm text-gray-600">
        <h3 className="font-bold text-gray-800 mb-2">How We Use This Data</h3>
        <p>These specialty averages power our <Link href="/peer-comparison" className="text-primary hover:underline">peer comparison system</Link>. When we flag a provider, it&apos;s because they deviate significantly from their own specialty peers — not from an arbitrary universal threshold. This approach reduces false positives and ensures that specialties with legitimately higher prescribing (like pain management) aren&apos;t unfairly flagged.</p>
      </div>

      <p className="text-xs text-gray-400 mt-8">
        Statistics computed from {fmt(merged.reduce((s, m) => s + m.stats.n, 0))} providers across {merged.length} specialties with 50+ claims.
        Data: CMS Medicare Part D, 2023. <Link href="/methodology" className="text-primary hover:underline">Methodology</Link>
      </p>
    </div>
  )
}
