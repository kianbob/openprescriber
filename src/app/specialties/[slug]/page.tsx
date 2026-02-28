import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt, slugify } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import { stateName } from '@/lib/state-names'
import { SpecialtyInsights, DataInsights } from '@/components/AIOverview'

type Spec = { specialty: string; providers: number; claims: number; cost: number; opioidProv: number; avgOpioidRate: number; avgBrandPct: number; costPerProvider: number }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const specs = loadData('specialties.json') as Spec[]
  const spec = specs.find(s => slugify(s.specialty) === slug)
  const name = spec?.specialty || slug
  return {
    title: `${name} — Medicare Part D Prescribing Profile`,
    description: `Prescribing patterns for ${name} in Medicare Part D: ${spec ? fmt(spec.providers) + ' providers, ' + fmtMoney(spec.cost) + ' drug costs' : ''}.`,
    alternates: { canonical: `https://www.openprescriber.org/specialties/${slug}` },
  }
}

export async function generateStaticParams() {
  const specs = loadData('specialties.json') as Spec[]
  return specs.map(s => ({ slug: slugify(s.specialty) }))
}

export default async function SpecialtyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const specs = loadData('specialties.json') as Spec[]
  const spec = specs.find(s => slugify(s.specialty) === slug)
  if (!spec) notFound()

  const allProviders = loadData('provider-index.json') as { npi: string; name: string; city: string; state: string; specialty: string; claims: number; cost: number; riskLevel: string }[]
  const specProviders = allProviders.filter(p => p.specialty === spec.specialty).slice(0, 50)
  const highRisk = loadData('high-risk.json') as { npi: string; name: string; city: string; state: string; specialty: string; claims: number; cost: number; riskScore: number }[]
  const specFlagged = highRisk.filter(p => p.specialty === spec.specialty)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Specialties', href: '/specialties' }, { label: spec.specialty }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">{spec.specialty}</h1>
      <p className="text-gray-600 mb-2">{fmt(spec.providers)} Medicare Part D prescribers, {fmtMoney(spec.cost)} in drug costs.</p>
      <ShareButtons title={`${spec.specialty} — Medicare Part D`} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Prescribers', value: fmt(spec.providers) },
          { label: 'Drug Cost', value: fmtMoney(spec.cost) },
          { label: 'Claims', value: fmt(spec.claims) },
          { label: 'Cost/Provider', value: fmtMoney(spec.costPerProvider) },
          { label: 'Opioid Prescribers', value: fmt(spec.opioidProv), color: 'text-red-600' },
          { label: 'Avg Opioid Rate', value: spec.avgOpioidRate.toFixed(1) + '%', color: spec.avgOpioidRate > 10 ? 'text-red-600' : '' },
          { label: 'Avg Brand %', value: spec.avgBrandPct.toFixed(1) + '%' },
          { label: 'Flagged', value: String(specFlagged.length), color: specFlagged.length > 0 ? 'text-red-600' : '' },
        ].map(t => (
          <div key={t.label} className="bg-white rounded-xl shadow-sm p-4 border text-center">
            <p className={`text-xl font-bold ${t.color || 'text-primary'}`}>{t.value}</p>
            <p className="text-xs text-gray-500 mt-1">{t.label}</p>
          </div>
        ))}
      </div>

      {/* AI Overview */}
      <DataInsights insights={SpecialtyInsights({ specialty: spec.specialty, providers: spec.providers, cost: spec.cost, opioidProv: spec.opioidProv, avgOpioidRate: spec.avgOpioidRate, avgBrandPct: spec.avgBrandPct, costPerProvider: spec.costPerProvider, flagged: specFlagged.length, totalProviders: 1380665 })} />

      {/* Top States */}
      {(() => {
        const stateCounts: Record<string, number> = {}
        for (const p of allProviders.filter(p => p.specialty === spec.specialty)) {
          stateCounts[p.state] = (stateCounts[p.state] || 0) + 1
        }
        const topStates = Object.entries(stateCounts).sort((a, b) => b[1] - a[1]).slice(0, 10)
        return topStates.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">Top States for {spec.specialty}</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto border">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">#</th>
                    <th className="px-4 py-3 text-left font-semibold">State</th>
                    <th className="px-4 py-3 text-right font-semibold">Providers</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {topStates.map(([st, count], i) => (
                    <tr key={st} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-2"><Link href={`/states/${st.toLowerCase()}`} className="text-primary font-medium hover:underline">{stateName(st)}</Link></td>
                      <td className="px-4 py-2 text-right font-mono">{fmt(count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null
      })()}

      {specFlagged.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">⚠️ Flagged {spec.specialty} Providers</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-red-50"><tr><th className="px-4 py-3 text-left font-semibold">Provider</th><th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Location</th><th className="px-4 py-3 text-right font-semibold">Drug Cost</th><th className="px-4 py-3 text-center font-semibold">Risk</th></tr></thead>
              <tbody className="divide-y">
                {specFlagged.map(p => (
                  <tr key={p.npi} className="hover:bg-red-50">
                    <td className="px-4 py-2"><Link href={`/providers/${p.npi}`} className="text-primary font-medium hover:underline">{p.name}</Link></td>
                    <td className="px-4 py-2 text-gray-500 hidden md:table-cell">{p.city}, {p.state}</td>
                    <td className="px-4 py-2 text-right font-mono">{fmtMoney(p.cost)}</td>
                    <td className="px-4 py-2 text-center"><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">{p.riskScore}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">Top {spec.specialty} Prescribers</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left font-semibold">Provider</th><th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Location</th><th className="px-4 py-3 text-right font-semibold">Claims</th><th className="px-4 py-3 text-right font-semibold">Drug Cost</th></tr></thead>
            <tbody className="divide-y">
              {specProviders.map(p => (
                <tr key={p.npi} className="hover:bg-gray-50">
                  <td className="px-4 py-2"><Link href={`/providers/${p.npi}`} className="text-primary font-medium hover:underline">{p.name}</Link></td>
                  <td className="px-4 py-2 text-gray-500 hidden md:table-cell">{p.city}, {p.state}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(p.claims)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmtMoney(p.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
