import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt, slugify } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'Specialty Prescribing Profiles: Average Metrics by Medical Specialty',
  description: 'How does each medical specialty prescribe? Compare opioid rates, drug costs, brand preference, and prescribing volumes across 110 specialties.',
  alternates: { canonical: 'https://www.openprescriber.org/specialty-profiles' },
}

type SpecStat = { n: number; opioidRate: { mean: number; std: number; p50: number; p90: number; p95: number }; costPerBene: { mean: number; std: number; p50: number; p90: number; p95: number }; brandPct: { mean: number; std: number; p50: number; p90: number } }

export default function SpecialtyProfilesPage() {
  const specStats = loadData('specialty-stats.json') as Record<string, SpecStat>
  const specs = loadData('specialties.json') as { specialty: string; providers: number; claims: number; cost: number; opioidProv: number; avgOpioidRate: number; avgBrandPct: number; costPerProvider: number }[]

  // Merge stats with specialty data
  const merged = specs
    .filter(s => specStats[s.specialty])
    .map(s => ({
      ...s,
      stats: specStats[s.specialty],
    }))
    .sort((a, b) => b.stats.opioidRate.mean - a.stats.opioidRate.mean)

  const highOpioid = merged.filter(s => s.stats.opioidRate.mean > 10).slice(0, 15)
  const highCost = [...merged].sort((a, b) => b.stats.costPerBene.mean - a.stats.costPerBene.mean).slice(0, 15)
  const highBrand = [...merged].sort((a, b) => b.stats.brandPct.mean - a.stats.brandPct.mean).slice(0, 15)

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

      {/* Highest Opioid Specialties */}
      <section className="mt-8">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">🔴 Highest Opioid Prescribing Specialties</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-red-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Specialty</th>
                <th className="px-4 py-3 text-right font-semibold">Avg Opioid Rate</th>
                <th className="px-4 py-3 text-right font-semibold">90th %ile</th>
                <th className="px-4 py-3 text-right font-semibold">95th %ile</th>
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Providers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {highOpioid.map(s => (
                <tr key={s.specialty} className="hover:bg-gray-50">
                  <td className="px-4 py-2"><Link href={`/specialties/${slugify(s.specialty)}`} className="text-primary font-medium hover:underline">{s.specialty}</Link></td>
                  <td className="px-4 py-2 text-right font-mono text-red-600 font-semibold">{s.stats.opioidRate.mean.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right font-mono">{s.stats.opioidRate.p90.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right font-mono">{s.stats.opioidRate.p95.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(s.stats.n)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Most Expensive Specialties */}
      <section className="mt-8">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">💰 Highest Cost Per Patient</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Specialty</th>
                <th className="px-4 py-3 text-right font-semibold">Avg Cost/Patient</th>
                <th className="px-4 py-3 text-right font-semibold">90th %ile</th>
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Avg Brand %</th>
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Providers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {highCost.map(s => (
                <tr key={s.specialty} className="hover:bg-gray-50">
                  <td className="px-4 py-2"><Link href={`/specialties/${slugify(s.specialty)}`} className="text-primary font-medium hover:underline">{s.specialty}</Link></td>
                  <td className="px-4 py-2 text-right font-mono font-semibold">{fmtMoney(Math.round(s.stats.costPerBene.mean))}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmtMoney(Math.round(s.stats.costPerBene.p90))}</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{s.stats.brandPct.mean.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(s.stats.n)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Highest Brand Preference */}
      <section className="mt-8">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">💊 Highest Brand-Name Preference</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Specialty</th>
                <th className="px-4 py-3 text-right font-semibold">Avg Brand %</th>
                <th className="px-4 py-3 text-right font-semibold">Avg Cost/Patient</th>
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Providers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {highBrand.map(s => (
                <tr key={s.specialty} className="hover:bg-gray-50">
                  <td className="px-4 py-2"><Link href={`/specialties/${slugify(s.specialty)}`} className="text-primary font-medium hover:underline">{s.specialty}</Link></td>
                  <td className="px-4 py-2 text-right font-mono font-semibold">{s.stats.brandPct.mean.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right font-mono">{fmtMoney(Math.round(s.stats.costPerBene.mean))}</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(s.stats.n)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

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
