import { Metadata } from 'next'
import Link from 'next/link'
import { fmtMoney, fmt, riskBadge } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import { CostTrendChart } from './dashboard/DashboardCharts'
import { stateName } from '@/lib/state-names'

export const metadata: Metadata = {
  title: 'OpenPrescriber — Medicare Part D Prescribing Data & Analysis',
  description: 'Explore 1.38 million Medicare Part D prescribers, $275 billion in drug costs, opioid prescribing patterns, and fraud risk analysis. Free, open data.',
  alternates: { canonical: 'https://www.openprescriber.org' },
}

export default function HomePage() {
  const stats = loadData('stats.json')
  const states = loadData('states.json') as { state: string; providers: number; claims: number; cost: number; opioidProv: number; highOpioid: number; avgOpioidRate: number }[]
  const highRisk = loadData('high-risk.json') as { npi: string; name: string; credentials: string; city: string; state: string; specialty: string; claims: number; cost: number; opioidRate: number; riskScore: number; riskLevel: string; riskFlags: string[]; isExcluded: boolean }[]
  const topOpioid = (loadData('top-opioid.json') as { npi: string; name: string; credentials: string; city: string; state: string; specialty: string; opioidRate: number; opioidClaims: number; claims: number; riskLevel: string }[]).filter(p => p.claims >= 100)
  const topCost = loadData('top-cost.json') as { npi: string; name: string; city: string; state: string; specialty: string; cost: number; claims: number; costPerBene: number; brandPct: number }[]
  const trends = loadData('yearly-trends.json') as { year: number; providers: number; claims: number; cost: number }[]
  const REAL_STATES = new Set('AL,AK,AZ,AR,CA,CO,CT,DE,DC,FL,GA,HI,ID,IL,IN,IA,KS,KY,LA,ME,MD,MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ,NM,NY,NC,ND,OH,OK,OR,PA,PR,RI,SC,SD,TN,TX,UT,VT,VA,VI,WA,WV,WI,WY'.split(','))

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-heading)] mb-4">
            {fmt(stats.providers)} Prescribers. {fmtMoney(stats.cost)}. Every Pill Tracked.
          </h1>
          <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto mb-8">
            The most comprehensive open analysis of Medicare Part D prescribing data — 5 years of trends, fraud risk scoring, opioid tracking, and cost transparency for every provider.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/risk-explorer" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              🔍 Explore Risk Data
            </Link>
            <Link href="/flagged" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold border border-white/30 transition-colors">
              🔴 Flagged Providers
            </Link>
            <Link href="/search" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold border border-white/30 transition-colors">
              🔍 Search Prescribers
            </Link>
          </div>
        </div>
      </section>

      {/* Stat Tiles */}
      <section className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Prescribers', value: fmt(stats.providers), sub: fmt(stats.totalSpecialties) + ' specialties' },
            { label: 'Drug Costs', value: fmtMoney(stats.cost), sub: fmt(stats.claims) + ' claims' },
            { label: 'Opioid Prescribers', value: fmt(stats.opioidProv), sub: fmt(stats.highOpioid) + ' high-rate', color: 'text-red-600' },
            { label: 'Flagged High Risk', value: fmt(stats.riskCounts.high), sub: fmt(stats.riskCounts.elevated) + ' elevated', color: 'text-red-600' },
          ].map(tile => (
            <div key={tile.label} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 text-center">
              <p className={`text-2xl md:text-3xl font-bold ${tile.color || 'text-primary'}`}>{tile.value}</p>
              <p className="text-sm font-medium text-gray-700 mt-1">{tile.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{tile.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Risk Alert Banner */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-red-800 mb-2">⚠️ Risk Analysis Findings</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-2xl font-bold text-red-700">{stats.riskCounts.high}</p>
              <p className="text-red-800">High-risk providers flagged by our multi-factor scoring model</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-700">{fmt(stats.highOpioid)}</p>
              <p className="text-red-800">Providers with opioid prescribing rates above 20%</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-700">{stats.excluded}</p>
              <p className="text-red-800">Active prescribers matched to the OIG exclusion list</p>
            </div>
          </div>
          <Link href="/flagged" className="inline-block mt-4 text-sm text-red-700 font-medium hover:underline">View all flagged providers →</Link>
        </div>
      </section>

      {/* Cost Trend */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold font-[family-name:var(--font-heading)]">Drug Costs: 5-Year Trend</h2>
              <p className="text-sm text-gray-500">Medicare Part D spending grew 50% from 2019 to 2023</p>
            </div>
            <Link href="/dashboard" className="text-sm text-primary hover:underline">Full dashboard →</Link>
          </div>
          <CostTrendChart data={trends} />
        </div>
      </section>

      {/* Top Flagged Providers */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-6">Highest Risk Providers</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Provider</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Specialty</th>
                <th className="px-4 py-3 text-right font-semibold">Claims</th>
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Drug Cost</th>
                <th className="px-4 py-3 text-right font-semibold">Opioid Rate</th>
                <th className="px-4 py-3 text-center font-semibold">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {highRisk.slice(0, 15).map(p => (
                <tr key={p.npi} className="hover:bg-red-50">
                  <td className="px-4 py-2">
                    <Link href={`/providers/${p.npi}`} className="font-medium text-primary hover:underline">{p.name}</Link>
                    {p.credentials && <span className="text-gray-400 ml-1 text-xs">{p.credentials}</span>}
                    <br /><span className="text-xs text-gray-500">{p.city}, {p.state}</span>
                    {p.isExcluded && <span className="ml-1 text-xs bg-red-100 text-red-700 px-1.5 rounded">EXCLUDED</span>}
                  </td>
                  <td className="px-4 py-2 text-gray-600 hidden md:table-cell">{p.specialty}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(p.claims)}</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmtMoney(p.cost)}</td>
                  <td className="px-4 py-2 text-right font-mono">{p.opioidRate > 0 ? p.opioidRate.toFixed(1) + '%' : '—'}</td>
                  <td className="px-4 py-2 text-center">
                    <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{p.riskScore}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-right"><Link href="/flagged" className="text-primary text-sm font-medium hover:underline">View all {stats.riskCounts.high} flagged providers →</Link></p>
      </section>

      {/* Two-Column: Top Opioid + Top Cost */}
      <section className="max-w-6xl mx-auto px-4 mt-12 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">Top Opioid Prescribers</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Provider</th>
                  <th className="px-3 py-2 text-right font-semibold">Opioid Rate</th>
                  <th className="px-3 py-2 text-right font-semibold">Claims</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topOpioid.slice(0, 10).map(p => (
                  <tr key={p.npi} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <Link href={`/providers/${p.npi}`} className="text-primary hover:underline text-xs font-medium">{p.name}</Link>
                      <br /><span className="text-xs text-gray-400">{p.state} · {p.specialty}</span>
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-red-600 font-semibold">{p.opioidRate.toFixed(1)}%</td>
                    <td className="px-3 py-2 text-right font-mono text-gray-600">{fmt(p.claims)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-right"><Link href="/opioids" className="text-primary text-sm hover:underline">See all →</Link></p>
        </div>

        <div>
          <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">Highest Cost Prescribers</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Provider</th>
                  <th className="px-3 py-2 text-right font-semibold">Drug Cost</th>
                  <th className="px-3 py-2 text-right font-semibold">Brand %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topCost.slice(0, 10).map(p => (
                  <tr key={p.npi} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <Link href={`/providers/${p.npi}`} className="text-primary hover:underline text-xs font-medium">{p.name}</Link>
                      <br /><span className="text-xs text-gray-400">{p.state} · {p.specialty}</span>
                    </td>
                    <td className="px-3 py-2 text-right font-mono font-semibold">{fmtMoney(p.cost)}</td>
                    <td className="px-3 py-2 text-right font-mono text-gray-600">{p.brandPct > 0 ? p.brandPct.toFixed(0) + '%' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-right"><Link href="/drugs" className="text-primary text-sm hover:underline">See all →</Link></p>
        </div>
      </section>

      {/* Top States by Opioid Risk */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-6">Opioid Prescribing by State</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">State</th>
                <th className="px-4 py-3 text-right font-semibold">Prescribers</th>
                <th className="px-4 py-3 text-right font-semibold">Opioid Prescribers</th>
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">High Rate (&gt;20%)</th>
                <th className="px-4 py-3 text-right font-semibold">Avg Opioid Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...states].filter(s => REAL_STATES.has(s.state)).sort((a, b) => b.avgOpioidRate - a.avgOpioidRate).slice(0, 15).map((s, i) => (
                <tr key={s.state} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-2">
                    <Link href={`/states/${s.state.toLowerCase()}`} className="font-medium text-primary hover:underline">{stateName(s.state)}</Link>
                  </td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(s.providers)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(s.opioidProv)}</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(s.highOpioid)}</td>
                  <td className={`px-4 py-2 text-right font-mono font-semibold ${s.avgOpioidRate > 10 ? 'text-red-600' : 'text-gray-700'}`}>
                    {s.avgOpioidRate.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-right"><Link href="/states" className="text-primary text-sm font-medium hover:underline">View all {states.length} states →</Link></p>
      </section>

      {/* Explore Grid */}
      <section className="max-w-6xl mx-auto px-4 mt-12 mb-8">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-6 text-center">Explore the Data</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🏥', label: 'States', href: '/states', sub: '60 states & territories' },
            { icon: '⚕️', label: 'Specialties', href: '/specialties', sub: '205 provider types' },
            { icon: '💊', label: 'Top Drugs', href: '/drugs', sub: '500 drugs by cost' },
            { icon: '👤', label: 'Providers', href: '/providers', sub: '19,300+ profiles' },
            { icon: '🔴', label: 'Flagged', href: '/flagged', sub: 'Risk-scored providers' },
            { icon: '💉', label: 'Opioids', href: '/opioids', sub: 'Prescribing patterns' },
            { icon: '💰', label: 'Brand vs Generic', href: '/brand-vs-generic', sub: 'Cost analysis' },
            { icon: '📊', label: 'Dashboard', href: '/dashboard', sub: '5-year trends' },
            { icon: '⚖️', label: 'IRA Drug Prices', href: '/ira-negotiation', sub: '$22B in negotiated drugs' },
            { icon: '💉', label: 'GLP-1 Tracker', href: '/glp1-tracker', sub: 'Ozempic spending' },
            { icon: '☠️', label: 'Dangerous Combos', href: '/dangerous-combinations', sub: 'Opioid+benzo risks' },
            { icon: '🤖', label: 'ML Fraud Detection', href: '/ml-fraud-detection', sub: '4,100+ ML-flagged' },
            { icon: '📋', label: 'Peer Comparison', href: '/peer-comparison', sub: 'Specialty-adjusted' },
            { icon: '🎯', label: 'Risk Calculator', href: '/tools/risk-calculator', sub: 'Try the scoring model' },
            { icon: '🏆', label: 'State Report Card', href: '/tools/state-report-card', sub: 'Grade your state' },
            { icon: '💊', label: 'Drug Lookup', href: '/tools/drug-lookup', sub: 'Search 500 drugs by name. See costs, claims, and top prescribers.' },
          ].map(item => (
            <Link key={item.href} href={item.href} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all text-center">
              <span className="text-2xl">{item.icon}</span>
              <p className="font-semibold text-gray-900 mt-2">{item.label}</p>
              <p className="text-xs text-gray-500">{item.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-6 text-center">What Sets OpenPrescriber Apart</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-green-100">
            <p className="text-3xl mb-2">🎯</p>
            <h3 className="font-semibold text-gray-900">Specialty-Adjusted Scoring</h3>
            <p className="text-sm text-gray-600 mt-2">We compare each provider against their own specialty peers using z-scores — a pain specialist prescribing opioids isn&apos;t the same as a dermatologist doing so.</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-purple-100">
            <p className="text-3xl mb-2">🤖</p>
            <h3 className="font-semibold text-gray-900">Machine Learning Detection</h3>
            <p className="text-sm text-gray-600 mt-2">Our ML model trained on 281 confirmed fraud cases catches 2,579 providers that rule-based systems miss entirely.</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-blue-100">
            <p className="text-3xl mb-2">📅</p>
            <h3 className="font-semibold text-gray-900">2023 Data — Most Current Available</h3>
            <p className="text-sm text-gray-600 mt-2">CMS releases Part D data on a ~1-year lag. Our 2023 dataset is the newest available — while competitors like ProPublica&apos;s Prescriber Checkup remain stuck on 2016.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-12 mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-8 text-center">How We Score Risk</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Opioid Prescribing', desc: 'We flag providers whose opioid prescribing rate exceeds the 95th percentile for their specialty. Long-acting opioids carry additional weight.' },
              { num: '02', title: 'Cost & Brand Patterns', desc: 'Providers prescribing mostly brand-name drugs when generics exist, or with abnormally high cost-per-beneficiary, receive elevated scores.' },
              { num: '03', title: 'Cross-Reference', desc: 'We match all providers against the OIG\'s List of Excluded Individuals/Entities (LEIE) — providers convicted of fraud or abuse.' },
              { num: '04', title: 'Machine Learning', desc: 'A model trained on 281 confirmed fraud cases identifies providers with similar prescribing patterns that rules alone miss.' },
            ].map(item => (
              <div key={item.num} className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-bold mx-auto">{item.num}</div>
                <h3 className="font-semibold text-gray-900 mt-3">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-sm text-gray-500">
            Risk scores are statistical indicators, not allegations. <Link href="/methodology" className="text-primary hover:underline">Read our methodology →</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
