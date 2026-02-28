import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt, slugify } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

type Drug = { generic: string; brand: string; claims: number; cost: number; benes: number; providers: number; fills: number; costPerClaim: number }
type Provider = { npi: string; name: string; city: string; state: string; specialty: string; claims: number; cost: number; riskLevel: string; opioidRate?: number; topDrugs?: { drug: string; claims: number; cost: number }[] }

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
  const provIndex = loadData('provider-index.json') as Provider[]

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

      {/* Context */}
      <section className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-blue-900 mb-2">About {drug.generic}</h2>
        <p className="text-sm text-blue-800">
          {drug.generic}{drug.brand ? ` (sold as ${drug.brand})` : ''} was prescribed {fmt(drug.claims)} times by {fmt(drug.providers)} Medicare Part D providers in 2023, 
          costing the program {fmtMoney(drug.cost)}. At {fmtMoney(drug.costPerClaim)} per claim, 
          {drug.costPerClaim > 500 ? ' this is a high-cost medication.' : drug.costPerClaim > 100 ? ' this is a moderately priced medication.' : ' this is a relatively affordable medication.'}
        </p>
        {drug.cost > 1e9 && (
          <p className="text-sm text-blue-700 mt-2">
            💰 This drug alone accounts for {(drug.cost / 275647552066 * 100).toFixed(1)}% of all Medicare Part D drug spending.
          </p>
        )}
      </section>

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
