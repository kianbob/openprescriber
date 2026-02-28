import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt, slugify } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import { DrugInsights, DataInsights } from '@/components/AIOverview'
import { CostBreakdownPie, ProviderDistributionBar } from './DrugCharts'

type Drug = { generic: string; brand: string; claims: number; cost: number; benes: number; providers: number; fills: number; costPerClaim: number }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const drugs = loadData('drugs.json') as Drug[]
  const drug = drugs.find(d => slugify(d.generic) === slug)
  const name = drug?.generic || slug
  const brand = drug?.brand ? ` (${drug.brand})` : ''
  return {
    title: `${name}${brand} — Medicare Part D Prescribing Data`,
    description: drug ? `${name}${brand}: ${fmtMoney(drug.cost)} total cost, ${fmt(drug.claims)} claims by ${fmt(drug.providers)} providers in Medicare Part D 2023.` : `Prescribing data for ${name} in Medicare Part D.`,
    alternates: { canonical: `https://www.openprescriber.org/drugs/${slug}` },
  }
}

export async function generateStaticParams() {
  const drugs = loadData('drugs.json') as Drug[]
  return drugs.slice(0, 200).map(d => ({ slug: slugify(d.generic) }))
}

export const dynamicParams = true

export default async function DrugDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const drugs = loadData('drugs.json') as Drug[]
  const drug = drugs.find(d => slugify(d.generic) === slug)
  if (!drug) notFound()

  const allDrugs = drugs
  const rank = allDrugs.findIndex(d => slugify(d.generic) === slug) + 1

  // Find providers who prescribe this drug from provider-index
  // We can't search all 11K files efficiently, but we can check provider detail files
  // For now, show the drug stats and link to search
  const drugProviders = loadData('drug-providers.json') as Record<string, { npi: string; name: string; city: string; state: string; specialty: string; claims: number; cost: number }[]>
  const topPrescribers = drugProviders[drug.generic] || []

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Top Drugs', href: '/drugs' }, { label: drug.generic }]} />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-heading)]">
            {drug.generic}
          </h1>
          {drug.brand && <p className="text-lg text-gray-500 mt-1">Brand name: {drug.brand}</p>}
          <p className="text-sm text-gray-400 mt-1">Rank #{rank} of {allDrugs.length} drugs by total cost</p>
        </div>
        <div className="flex-shrink-0 bg-primary/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">{fmtMoney(drug.cost)}</p>
          <p className="text-xs text-gray-500">Total Cost</p>
        </div>
      </div>

      <ShareButtons title={`${drug.generic} — Medicare Part D Prescribing Data`} />

      {/* Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Total Claims', value: fmt(drug.claims) },
          { label: 'Total Cost', value: fmtMoney(drug.cost) },
          { label: 'Prescribers', value: fmt(drug.providers) },
          { label: 'Cost per Claim', value: fmtMoney(drug.costPerClaim) },
          { label: 'Beneficiaries', value: fmt(drug.benes) },
          { label: '30-Day Fills', value: fmt(Math.round(drug.fills)) },
          { label: 'Avg Cost/Provider', value: fmtMoney(drug.providers > 0 ? Math.round(drug.cost / drug.providers) : 0) },
          { label: 'Avg Claims/Provider', value: drug.providers > 0 ? fmt(Math.round(drug.claims / drug.providers)) : '—' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-4 border text-center">
            <p className="text-xl font-bold text-primary">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cost Charts */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-5 border">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Share of Medicare Part D Spending</h2>
          <CostBreakdownPie drugCost={drug.cost} totalCost={275647552066} drugName={drug.generic} />
        </div>
        {topPrescribers.length >= 3 && (
          <div className="bg-white rounded-xl shadow-sm p-5 border">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Top Prescribers by Cost</h2>
            <ProviderDistributionBar topPrescribers={topPrescribers} totalCost={drug.cost} />
          </div>
        )}
      </div>

      {/* AI Overview */}
      <DataInsights insights={DrugInsights({ generic: drug.generic, brand: drug.brand, cost: drug.cost, claims: drug.claims, costPerClaim: drug.costPerClaim, providers: drug.providers, benes: drug.benes, rank, totalDrugs: allDrugs.length })} />

      {/* Top Prescribers */}
      {topPrescribers.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">Top Prescribers of {drug.generic}</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">#</th>
                  <th className="px-4 py-3 text-left font-semibold">Provider</th>
                  <th className="px-4 py-3 text-left font-semibold">Specialty</th>
                  <th className="px-4 py-3 text-left font-semibold">Location</th>
                  <th className="px-4 py-3 text-right font-semibold">Claims</th>
                  <th className="px-4 py-3 text-right font-semibold">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topPrescribers.slice(0, 20).map((prov, i) => (
                  <tr key={prov.npi} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-2">
                      <Link href={`/providers/${prov.npi}`} className="text-primary hover:underline font-medium">{prov.name}</Link>
                    </td>
                    <td className="px-4 py-2 text-gray-600">{prov.specialty}</td>
                    <td className="px-4 py-2 text-gray-600">{prov.city}, {prov.state}</td>
                    <td className="px-4 py-2 text-right font-mono">{fmt(prov.claims)}</td>
                    <td className="px-4 py-2 text-right font-mono">{fmtMoney(prov.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Top prescribers ranked by total cost for this drug in 2023.</p>
        </section>
      )}

      {/* Related Drugs */}
      <section className="mt-8">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">Related Drugs by Cost</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">Drug</th>
                <th className="px-4 py-3 text-right font-semibold">Total Cost</th>
                <th className="px-4 py-3 text-right font-semibold">Claims</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allDrugs.slice(Math.max(0, rank - 4), rank + 3).map((d, i) => {
                const r = Math.max(0, rank - 4) + i + 1
                const isCurrent = slugify(d.generic) === slug
                return (
                  <tr key={d.generic} className={isCurrent ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-2 text-gray-500">{r}</td>
                    <td className="px-4 py-2">
                      {isCurrent ? (
                        <span className="font-bold text-primary">{d.generic} {d.brand && <span className="text-gray-400 text-xs">({d.brand})</span>}</span>
                      ) : (
                        <Link href={`/drugs/${slugify(d.generic)}`} className="text-primary hover:underline">{d.generic} {d.brand && <span className="text-gray-400 text-xs">({d.brand})</span>}</Link>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right font-mono">{fmtMoney(d.cost)}</td>
                    <td className="px-4 py-2 text-right font-mono">{fmt(d.claims)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-xs text-gray-400 mt-8">
        Data from CMS Medicare Part D Prescriber-Drug Public Use File, 2023. <Link href="/methodology" className="text-primary hover:underline">Methodology</Link>
      </p>
    </div>
  )
}
