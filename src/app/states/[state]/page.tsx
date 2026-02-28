import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt, slugify } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import { stateName } from '@/lib/state-names'
import { StateCostTrend, StateOpioidTrend } from './StateCharts'
import { StateInsights, DataInsights } from '@/components/AIOverview'

type StateTrend = { year: number; state: string; providers: number; claims: number; cost: number; opioidProv: number; avgOpioidRate: number }
type StateData = { state: string; providers: number; claims: number; cost: number; benes: number; opioidProv: number; highOpioid: number; opioidClaims: number; avgOpioidRate: number; costPerBene: number }
type Provider = { npi: string; name: string; city: string; state: string; specialty: string; claims: number; cost: number; riskLevel: string; opioidRate?: number }

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params
  const abbr = state.toUpperCase()
  const name = stateName(abbr)
  return {
    title: `Medicare Part D Prescribing in ${name} (${abbr})`,
    description: `Drug costs, opioid prescribing rates, and provider risk analysis for Medicare Part D in ${name}.`,
    alternates: { canonical: `https://www.openprescriber.org/states/${state}` },
  }
}

export async function generateStaticParams() {
  const states = loadData('states.json') as StateData[]
  return states.map(s => ({ state: s.state.toLowerCase() }))
}

export default async function StateDetailPage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params
  const abbr = state.toUpperCase()
  const states = loadData('states.json') as StateData[]
  const s = states.find(x => x.state === abbr)
  if (!s) notFound()

  const name = stateName(abbr)
  const allProviders = loadData('provider-index.json') as Provider[]
  const stateProviders = allProviders.filter(p => p.state === abbr).slice(0, 50)
  const topOpioid = loadData('top-opioid.json') as (Provider & { opioidRate: number; opioidClaims: number })[]
  const stateOpioid = topOpioid.filter(p => p.state === abbr).slice(0, 20)
  const highRisk = loadData('high-risk.json') as (Provider & { riskScore: number; riskLevel: string })[]
  const stateFlagged = highRisk.filter(p => p.state === abbr)
  const stateYearly = (loadData('state-yearly.json') as Record<string, StateTrend[]>)[abbr] || []

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'States', href: '/states' }, { label: name }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Medicare Part D in {name}</h1>
      <p className="text-gray-600 mb-2">Prescribing data for {fmt(s.providers)} providers in {name}, totaling {fmtMoney(s.cost)} in drug costs.</p>
      <ShareButtons title={`Medicare Part D Prescribing in ${name}`} />

      {/* Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Prescribers', value: fmt(s.providers) },
          { label: 'Drug Cost', value: fmtMoney(s.cost) },
          { label: 'Claims', value: fmt(s.claims) },
          { label: 'Cost/Patient', value: fmtMoney(s.costPerBene) },
          { label: 'Opioid Prescribers', value: fmt(s.opioidProv), color: 'text-red-600' },
          { label: 'High Opioid Rate', value: fmt(s.highOpioid), color: 'text-red-600' },
          { label: 'Avg Opioid Rate', value: s.avgOpioidRate.toFixed(1) + '%', color: s.avgOpioidRate > 10 ? 'text-red-600' : '' },
          { label: 'Flagged Providers', value: String(stateFlagged.length), color: stateFlagged.length > 0 ? 'text-red-600' : '' },
        ].map(t => (
          <div key={t.label} className="bg-white rounded-xl shadow-sm p-4 border text-center">
            <p className={`text-xl font-bold ${t.color || 'text-primary'}`}>{t.value}</p>
            <p className="text-xs text-gray-500 mt-1">{t.label}</p>
          </div>
        ))}
      </div>

      {/* AI Overview */}
      {(() => {
        const costGrowth = stateYearly.length >= 2 ? ((stateYearly[stateYearly.length - 1].cost / stateYearly[0].cost - 1) * 100) : undefined
        const REAL_STATES = new Set('AL,AK,AZ,AR,CA,CO,CT,DE,DC,FL,GA,HI,ID,IL,IN,IA,KS,KY,LA,ME,MD,MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ,NM,NY,NC,ND,OH,OK,OR,PA,PR,RI,SC,SD,TN,TX,UT,VT,VA,VI,WA,WV,WI,WY'.split(','))
        const filtered = states.filter(st => REAL_STATES.has(st.state))
        const insights = StateInsights({ state: abbr, providers: s.providers, cost: s.cost, opioidProv: s.opioidProv, highOpioid: s.highOpioid, avgOpioidRate: s.avgOpioidRate, costPerBene: s.costPerBene, flagged: stateFlagged.length, costGrowth, allStates: filtered })
        return <DataInsights insights={insights} />
      })()}

      {/* 5-Year Trends */}
      {stateYearly.length >= 2 && (
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-sm p-5 border">
            <h2 className="text-lg font-bold mb-3">Drug Cost Trends (2019–2023)</h2>
            <StateCostTrend data={stateYearly} />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border">
            <h2 className="text-lg font-bold mb-3">Opioid Prescribing Trends</h2>
            <StateOpioidTrend data={stateYearly} />
          </div>
        </div>
      )}

      {/* Top Specialties */}
      {(() => {
        const specCounts: Record<string, number> = {}
        for (const p of allProviders.filter(p => p.state === abbr)) {
          specCounts[p.specialty] = (specCounts[p.specialty] || 0) + 1
        }
        const topSpecs = Object.entries(specCounts).sort((a, b) => b[1] - a[1]).slice(0, 10)
        return topSpecs.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">Top Specialties in {name}</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto border">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">#</th>
                    <th className="px-4 py-3 text-left font-semibold">Specialty</th>
                    <th className="px-4 py-3 text-right font-semibold">Providers</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {topSpecs.map(([spec, count], i) => (
                    <tr key={spec} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-2"><Link href={`/specialties/${slugify(spec)}`} className="text-primary font-medium hover:underline">{spec}</Link></td>
                      <td className="px-4 py-2 text-right font-mono">{fmt(count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null
      })()}

      {/* Flagged */}
      {stateFlagged.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">⚠️ Flagged Providers in {name}</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Provider</th>
                  <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Specialty</th>
                  <th className="px-4 py-3 text-right font-semibold">Drug Cost</th>
                  <th className="px-4 py-3 text-center font-semibold">Risk Score</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stateFlagged.map(p => (
                  <tr key={p.npi} className="hover:bg-red-50">
                    <td className="px-4 py-2"><Link href={`/providers/${p.npi}`} className="text-primary font-medium hover:underline">{p.name}</Link><br /><span className="text-xs text-gray-500">{p.city}</span></td>
                    <td className="px-4 py-2 text-gray-600 hidden md:table-cell">{p.specialty}</td>
                    <td className="px-4 py-2 text-right font-mono">{fmtMoney(p.cost)}</td>
                    <td className="px-4 py-2 text-center"><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">{p.riskScore}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Top Opioid Prescribers in State */}
      {stateOpioid.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">Top Opioid Prescribers in {name}</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Provider</th>
                  <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Specialty</th>
                  <th className="px-4 py-3 text-right font-semibold">Opioid Rate</th>
                  <th className="px-4 py-3 text-right font-semibold">Opioid Claims</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stateOpioid.map(p => (
                  <tr key={p.npi} className="hover:bg-gray-50">
                    <td className="px-4 py-2"><Link href={`/providers/${p.npi}`} className="text-primary font-medium hover:underline">{p.name}</Link><br /><span className="text-xs text-gray-500">{p.city}</span></td>
                    <td className="px-4 py-2 text-gray-600 hidden md:table-cell">{p.specialty}</td>
                    <td className="px-4 py-2 text-right font-mono text-red-600 font-semibold">{p.opioidRate.toFixed(1)}%</td>
                    <td className="px-4 py-2 text-right font-mono">{fmt(p.opioidClaims)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* All Providers */}
      <section className="mt-8">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">Prescribers in {name}</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Provider</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Specialty</th>
                <th className="px-4 py-3 text-right font-semibold">Claims</th>
                <th className="px-4 py-3 text-right font-semibold">Drug Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stateProviders.map(p => (
                <tr key={p.npi} className="hover:bg-gray-50">
                  <td className="px-4 py-2"><Link href={`/providers/${p.npi}`} className="text-primary font-medium hover:underline">{p.name}</Link><br /><span className="text-xs text-gray-500">{p.city}</span></td>
                  <td className="px-4 py-2 text-gray-600 hidden md:table-cell">{p.specialty}</td>
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
