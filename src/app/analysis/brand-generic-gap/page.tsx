import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt, slugify } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import RelatedAnalysis from '@/components/RelatedAnalysis'

export const metadata: Metadata = {
  title: 'Brand vs Generic: The Billion-Dollar Gap in Medicare Part D',
  description: 'Generic drugs save Medicare billions, but some specialties still prescribe brands at high rates. Which ones and why?',
  alternates: { canonical: 'https://www.openprescriber.org/analysis/brand-generic-gap' },
}

export default function BrandGenericGapPage() {
  const stats = loadData('stats.json')
  const specs = loadData('specialties.json') as { specialty: string; providers: number; cost: number; avgBrandPct: number }[]
  const topBrand = [...specs].sort((a, b) => b.avgBrandPct - a.avgBrandPct).filter(s => s.providers >= 50).slice(0, 10)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Brand vs Generic Gap' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">Brand vs Generic: The Billion-Dollar Gap</h1>
      <ShareButtons title="Brand vs Generic: The Billion-Dollar Gap" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          Generic drugs are bioequivalent to their brand-name counterparts but cost a fraction of the price. Every brand-name prescription where a generic exists represents potential waste — and the numbers add up fast.
        </p>

        <h2>The Overall Picture</h2>
        <p>
          In 2023, Medicare Part D spent <strong>{fmtMoney(stats.brandCost)}</strong> on brand-name drugs and <strong>{fmtMoney(stats.genericCost)}</strong> on generics. The overall brand rate across all prescribers is approximately <strong>{stats.brandPct?.toFixed(1) || 'N/A'}%</strong>.
        </p>

        <h2>Specialties with Highest Brand Rates</h2>
        <p>Some specialties have legitimately high brand rates (oncology, for example, relies on patented biologics). But others raise questions:</p>

        <div className="not-prose my-6">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Specialty</th>
                <th className="px-4 py-2 text-right font-semibold">Providers</th>
                <th className="px-4 py-2 text-right font-semibold">Avg Brand %</th>
                <th className="px-4 py-2 text-right font-semibold">Drug Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topBrand.map(s => (
                <tr key={s.specialty}>
                  <td className="px-4 py-2"><Link href={`/specialties/${slugify(s.specialty)}`} className="text-primary hover:underline">{s.specialty}</Link></td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(s.providers)}</td>
                  <td className="px-4 py-2 text-right font-mono font-semibold text-red-600">{s.avgBrandPct.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right font-mono">{fmtMoney(s.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Why It Matters</h2>
        <p>
          The FDA requires generics to demonstrate bioequivalence — same active ingredient, same dosage, same route of administration. Yet brand loyalty persists among some providers, driven by pharmaceutical marketing, patient demand, or clinical inertia.
        </p>
        <p>
          Shifting just 10% of unnecessary brand prescriptions to generics could save Medicare hundreds of millions annually — money that could extend Part D&apos;s solvency or reduce patient copays.
        </p>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">See the full breakdown: <Link href="/brand-vs-generic" className="text-primary font-medium hover:underline">Brand vs Generic Explorer →</Link></p>
        </div>
      <RelatedAnalysis current={"/analysis/brand-generic-gap"} />
      </div>
    </div>
  )
}
