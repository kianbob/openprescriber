import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import DataFreshness from '@/components/DataFreshness'
import { loadData } from '@/lib/server-utils'
import { fmtMoney, fmt } from '@/lib/utils'
import { stateName } from '@/lib/state-names'
import fs from 'fs'
import path from 'path'

type CityData = {
  city: string; state: string; slug: string; providers: number;
  totalCost: number; totalClaims: number; highRisk: number; elevated: number;
  specialties: number; avgOpioidRate: number;
  topProviders: { npi: string; name: string; specialty: string; cost: number; claims: number; riskLevel: string; opioidRate: number }[];
}

function loadCity(slug: string): CityData | null {
  const fp = path.join(process.cwd(), 'public', 'data', 'cities', slug + '.json')
  if (!fs.existsSync(fp)) return null
  return JSON.parse(fs.readFileSync(fp, 'utf8'))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const city = loadCity(slug)
  if (!city) return { title: 'City Not Found' }
  const name = `${city.city}, ${stateName(city.state)}`
  return {
    title: `Medicare Part D Prescribers in ${name} — ${fmt(city.providers)} Providers`,
    description: `${fmt(city.providers)} Medicare Part D prescribers in ${name}. ${fmtMoney(city.totalCost)} in drug costs, ${city.highRisk} high-risk providers, ${city.specialties} specialties.`,
    alternates: { canonical: `https://www.openprescriber.org/cities/${slug}` },
    openGraph: {
      title: `Medicare Part D Prescribers in ${name}`,
      description: `${fmt(city.providers)} prescribers, ${fmtMoney(city.totalCost)} drug costs in ${name}.`,
      url: `https://www.openprescriber.org/cities/${slug}`,
      type: 'article',
    },
  }
}

export const dynamicParams = true

export async function generateStaticParams() {
  const index = loadData('cities-index.json') as { slug: string; providers: number }[]
  // Pre-render top 50 cities
  return index.slice(0, 50).map(c => ({ slug: c.slug }))
}

export default async function CityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const city = loadCity(slug)
  if (!city) notFound()

  const name = `${city.city}, ${stateName(city.state)}`
  const stateAbbr = city.state.toLowerCase()

  // Specialty breakdown
  const specCount: Record<string, number> = {}
  city.topProviders.forEach(p => {
    specCount[p.specialty] = (specCount[p.specialty] || 0) + 1
  })
  const topSpecs = Object.entries(specCount).sort((a, b) => b[1] - a[1]).slice(0, 10)

  const highRiskProviders = city.topProviders.filter(p => p.riskLevel === 'high').slice(0, 10)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Cities', href: '/cities' }, { label: name }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Medicare Part D Prescribers in {name}</h1>
      <p className="text-gray-600 mb-4">{fmt(city.providers)} flagged and high-volume prescribers across {city.specialties} medical specialties.</p>
      <DataFreshness />
      <ShareButtons title={`Medicare Part D Prescribers in ${name}`} />

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
          <p className="text-2xl font-bold text-blue-700">{fmt(city.providers)}</p>
          <p className="text-xs text-blue-600">Providers</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
          <p className="text-2xl font-bold text-green-700">{fmtMoney(city.totalCost)}</p>
          <p className="text-xs text-green-600">Total Drug Cost</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
          <p className="text-2xl font-bold text-red-700">{city.highRisk}</p>
          <p className="text-xs text-red-600">High Risk</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
          <p className="text-2xl font-bold text-orange-700">{(city.avgOpioidRate ?? 0).toFixed(1)}%</p>
          <p className="text-xs text-orange-600">Avg Opioid Rate</p>
        </div>
      </div>

      {/* High-risk providers */}
      {highRiskProviders.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">High-Risk Providers in {city.city}</h2>
          <p className="text-sm text-gray-500 mb-3">Providers flagged by our multi-factor risk scoring model. Risk scores are statistical indicators, not allegations of wrongdoing. <Link href="/analysis/fraud-risk-methodology" className="text-primary hover:underline">Learn about our methodology.</Link></p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded-xl shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Provider</th>
                  <th className="px-4 py-2 text-left font-semibold hidden sm:table-cell">Specialty</th>
                  <th className="px-4 py-2 text-right font-semibold">Drug Cost</th>
                  <th className="px-4 py-2 text-right font-semibold">Opioid Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {highRiskProviders.map(p => (
                  <tr key={p.npi} className="hover:bg-gray-50">
                    <td className="px-4 py-2"><Link href={`/providers/${p.npi}`} className="text-primary hover:underline">{p.name}</Link></td>
                    <td className="px-4 py-2 text-gray-600 hidden sm:table-cell">{p.specialty}</td>
                    <td className="px-4 py-2 text-right font-mono">{fmtMoney(p.cost)}</td>
                    <td className="px-4 py-2 text-right font-mono">{(p.opioidRate ?? 0).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Top providers by cost */}
      <section className="mt-10">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">Top Prescribers by Drug Cost</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Provider</th>
                <th className="px-4 py-2 text-left font-semibold hidden sm:table-cell">Specialty</th>
                <th className="px-4 py-2 text-right font-semibold">Claims</th>
                <th className="px-4 py-2 text-right font-semibold">Drug Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {city.topProviders.slice(0, 20).map(p => (
                <tr key={p.npi} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <Link href={`/providers/${p.npi}`} className="text-primary hover:underline">{p.name}</Link>
                    {p.riskLevel === 'high' && <span className="ml-1 text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">High Risk</span>}
                  </td>
                  <td className="px-4 py-2 text-gray-600 hidden sm:table-cell">{p.specialty}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(p.claims)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmtMoney(p.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Specialty breakdown */}
      <section className="mt-10">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">Specialties in {city.city}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {topSpecs.map(([spec, count]) => (
            <div key={spec} className="bg-white rounded-lg border p-3">
              <p className="text-sm font-medium">{spec}</p>
              <p className="text-xs text-gray-500">{count} provider{count !== 1 ? 's' : ''}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related links */}
      <section className="mt-10 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-4">Explore More</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href={`/states/${stateAbbr}`} className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-sm">All of {stateName(city.state)}</h3>
            <p className="text-xs text-gray-500 mt-1">Statewide prescribing patterns and risk analysis.</p>
          </Link>
          <Link href="/cities" className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-sm">Browse All Cities</h3>
            <p className="text-xs text-gray-500 mt-1">Compare prescribing across 982 cities.</p>
          </Link>
          <Link href="/search" className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-sm">Search Prescribers</h3>
            <p className="text-xs text-gray-500 mt-1">Find specific providers by name or NPI.</p>
          </Link>
        </div>
      </section>

      <div className="mt-6 text-xs text-gray-400">
        <p>Data from CMS Medicare Part D Prescriber Public Use File, 2023. Only providers meeting CMS disclosure thresholds are included. Risk scores are statistical indicators based on prescribing pattern analysis — not allegations of fraud or wrongdoing.</p>
      </div>
    </div>
  )
}
