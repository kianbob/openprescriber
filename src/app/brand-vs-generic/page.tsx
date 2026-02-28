import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt, slugify } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'Brand vs Generic Prescribing in Medicare Part D',
  description: 'Which specialties and providers prescribe the most brand-name drugs? Analyzing brand vs generic prescribing patterns across Medicare Part D.',
  alternates: { canonical: 'https://www.openprescriber.org/brand-vs-generic' },
}

export default function BrandVsGenericPage() {
  const stats = loadData('stats.json')
  const specs = loadData('specialties.json') as { specialty: string; providers: number; cost: number; avgBrandPct: number }[]
  const topCost = loadData('top-cost.json') as { npi: string; name: string; city: string; state: string; specialty: string; cost: number; claims: number; brandPct: number; costPerBene: number }[]

  const byBrand = [...specs].sort((a, b) => b.avgBrandPct - a.avgBrandPct)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Brand vs Generic' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Brand vs Generic Prescribing</h1>
      <p className="text-gray-600 mb-2">
        Generic drugs save Medicare billions annually. Some providers consistently prescribe brand-name drugs when cheaper generics are available.
      </p>
      <ShareButtons title="Brand vs Generic Prescribing in Medicare Part D" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-5 border text-center">
          <p className="text-2xl font-bold text-primary">{fmtMoney(stats.brandCost)}</p>
          <p className="text-sm text-gray-500 mt-1">Brand-Name Drug Cost</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border text-center">
          <p className="text-2xl font-bold text-green-700">{fmtMoney(stats.genericCost)}</p>
          <p className="text-sm text-gray-500 mt-1">Generic Drug Cost</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border text-center">
          <p className="text-2xl font-bold text-primary">{stats.brandPct?.toFixed(1) || '—'}%</p>
          <p className="text-sm text-gray-500 mt-1">Overall Brand Rate</p>
        </div>
      </div>

      {/* Specialties by Brand % */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-4">Specialties with Highest Brand Prescribing</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">Specialty</th>
                <th className="px-4 py-3 text-right font-semibold">Providers</th>
                <th className="px-4 py-3 text-right font-semibold">Drug Cost</th>
                <th className="px-4 py-3 text-right font-semibold">Avg Brand %</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {byBrand.slice(0, 30).map((s, i) => (
                <tr key={s.specialty} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-2"><Link href={`/specialties/${slugify(s.specialty)}`} className="text-primary font-medium hover:underline">{s.specialty}</Link></td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(s.providers)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmtMoney(s.cost)}</td>
                  <td className={`px-4 py-2 text-right font-mono font-semibold ${s.avgBrandPct > 50 ? 'text-red-600' : ''}`}>{s.avgBrandPct.toFixed(1)}%{s.providers < 25 && <span className="text-gray-400 font-normal text-xs ml-1">(small sample)</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-500">Note: Specialties with fewer than 25 providers may show extreme percentages due to small sample sizes.</p>
      </section>

      {/* Top Cost Providers */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-4">Highest-Cost Prescribers</h2>
        <p className="text-gray-600 mb-4 text-sm">Providers with the highest total drug costs, along with their brand-name prescribing rate.</p>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Provider</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Specialty</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Location</th>
                <th className="px-4 py-3 text-right font-semibold">Drug Cost</th>
                <th className="px-4 py-3 text-right font-semibold">Brand %</th>
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Cost/Patient</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topCost.slice(0, 50).map(p => (
                <tr key={p.npi} className="hover:bg-gray-50">
                  <td className="px-4 py-2"><Link href={`/providers/${p.npi}`} className="text-primary font-medium hover:underline">{p.name}</Link></td>
                  <td className="px-4 py-2 text-gray-600 hidden md:table-cell">{p.specialty}</td>
                  <td className="px-4 py-2 text-gray-500 hidden md:table-cell">{p.city}, {p.state}</td>
                  <td className="px-4 py-2 text-right font-mono font-semibold">{fmtMoney(p.cost)}</td>
                  <td className={`px-4 py-2 text-right font-mono ${p.brandPct > 50 ? 'text-red-600 font-semibold' : ''}`}>{p.brandPct > 0 ? p.brandPct.toFixed(0) + '%' : '—'}</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmtMoney(p.costPerBene)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
