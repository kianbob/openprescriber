import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import { stateName } from '@/lib/state-names'

export const metadata: Metadata = {
  title: 'Opioid Prescribers in Medicare Part D — State Rankings & Data',
  description: 'Which doctors prescribe the most opioids? See state-by-state opioid prescribing rates, top prescribers, and prescribing patterns across 450,000+ Medicare providers.',
  alternates: { canonical: 'https://www.openprescriber.org/opioid-prescribers' },
}

export default function OpioidPrescribersPage() {
  const stats = loadData('stats.json')
  const states = loadData('states.json') as { state: string; providers: number; opioidProv: number; highOpioid: number; avgOpioidRate: number; opioidClaims: number; cost: number }[]
  const topOpioid = (loadData('top-opioid.json') as { npi: string; name: string; credentials: string; city: string; state: string; specialty: string; opioidRate: number; opioidClaims: number; claims: number }[]).filter(p => p.claims >= 100)
  const REAL = new Set('AL,AK,AZ,AR,CA,CO,CT,DE,DC,FL,GA,HI,ID,IL,IN,IA,KS,KY,LA,ME,MD,MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ,NM,NY,NC,ND,OH,OK,OR,PA,PR,RI,SC,SD,TN,TX,UT,VT,VA,WA,WV,WI,WY'.split(','))
  const realStates = states.filter(s => REAL.has(s.state)).sort((a, b) => b.avgOpioidRate - a.avgOpioidRate)

  const totalOpioidClaims = states.reduce((s, st) => s + (st.opioidClaims || 0), 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Opioid Prescribers' }]} />
      <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] mb-4">Opioid Prescribers in Medicare Part D</h1>
      <p className="text-lg text-gray-600 mb-2">
        <strong>{fmt(stats.opioidProv)}</strong> Medicare Part D providers prescribed opioids in 2023 — that&apos;s <strong>{(stats.opioidProv / stats.providers * 100).toFixed(0)}%</strong> of all prescribers. Here&apos;s where and how they prescribe.
      </p>
      <ShareButtons title="Opioid Prescribers in Medicare Part D" />

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-red-50 rounded-xl p-5 text-center border border-red-200">
          <p className="text-2xl font-bold text-red-700">{fmt(stats.opioidProv)}</p>
          <p className="text-xs text-gray-600 mt-1">Opioid Prescribers</p>
        </div>
        <div className="bg-red-50 rounded-xl p-5 text-center border border-red-200">
          <p className="text-2xl font-bold text-red-700">{fmt(stats.highOpioid)}</p>
          <p className="text-xs text-gray-600 mt-1">High Rate (&gt;20%)</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-200">
          <p className="text-2xl font-bold text-primary">{fmt(stats.providers)}</p>
          <p className="text-xs text-gray-600 mt-1">Total Prescribers</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-200">
          <p className="text-2xl font-bold text-primary">{(stats.opioidProv / stats.providers * 100).toFixed(1)}%</p>
          <p className="text-xs text-gray-600 mt-1">Prescribing Opioids</p>
        </div>
      </div>

      {/* State Rankings */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-4">Opioid Prescribing by State</h2>
        <p className="text-sm text-gray-600 mb-4">States ranked by average opioid prescribing rate among Medicare Part D providers.</p>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">State</th>
                <th className="px-4 py-3 text-right font-semibold">Avg Opioid Rate</th>
                <th className="px-4 py-3 text-right font-semibold">Opioid Prescribers</th>
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">High Rate (&gt;20%)</th>
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Total Prescribers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {realStates.map((s, i) => (
                <tr key={s.state} className={`hover:bg-gray-50 ${i < 10 ? 'bg-red-50/30' : ''}`}>
                  <td className="px-4 py-2 text-gray-500 font-mono">{i + 1}</td>
                  <td className="px-4 py-2">
                    <Link href={`/states/${s.state.toLowerCase()}`} className="font-medium text-primary hover:underline">{stateName(s.state)}</Link>
                  </td>
                  <td className={`px-4 py-2 text-right font-mono font-semibold ${s.avgOpioidRate > 15 ? 'text-red-600' : s.avgOpioidRate > 10 ? 'text-orange-600' : 'text-gray-700'}`}>
                    {s.avgOpioidRate.toFixed(1)}%
                  </td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(s.opioidProv)}</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(s.highOpioid)}</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(s.providers)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top Opioid Prescribers */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-4">Top 25 Opioid Prescribers</h2>
        <p className="text-sm text-gray-600 mb-4">Providers with the highest opioid prescribing rates (minimum 100 claims).</p>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-red-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Provider</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Specialty</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Location</th>
                <th className="px-4 py-3 text-right font-semibold">Opioid Rate</th>
                <th className="px-4 py-3 text-right font-semibold">Claims</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topOpioid.slice(0, 25).map(p => (
                <tr key={p.npi} className="hover:bg-red-50/50">
                  <td className="px-4 py-2">
                    <Link href={`/providers/${p.npi}`} className="font-medium text-primary hover:underline">{p.name}</Link>
                    {p.credentials && <span className="text-gray-400 ml-1 text-xs">{p.credentials}</span>}
                  </td>
                  <td className="px-4 py-2 text-gray-600 hidden md:table-cell text-xs">{p.specialty}</td>
                  <td className="px-4 py-2 text-gray-500 hidden md:table-cell text-xs">{p.city}, {p.state}</td>
                  <td className="px-4 py-2 text-right font-mono text-red-600 font-bold">{p.opioidRate.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(p.claims)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-right"><Link href="/opioids" className="text-primary text-sm font-medium hover:underline">View full opioid analysis →</Link></p>
      </section>

      {/* Context */}
      <section className="mt-10 prose prose-gray max-w-none">
        <h2>Understanding Opioid Prescribing Data</h2>
        <p>
          Not all opioid prescribing is inappropriate. Pain management specialists, oncologists, and palliative care providers legitimately prescribe opioids at higher rates. Our <Link href="/methodology">scoring methodology</Link> accounts for this by comparing each provider against their <strong>specialty peers</strong> — flagging only those who significantly exceed their own specialty&apos;s average.
        </p>
        <p>
          Key risk indicators include: prescribing rates far above specialty peers, high use of <Link href="/dangerous-combinations">opioid + benzodiazepine combinations</Link>, low drug diversity (prescribing only a handful of drugs, mostly controlled substances), and high fills per patient.
        </p>
      </section>

      {/* Related */}
      <section className="mt-10 bg-gray-50 rounded-xl p-6 border">
        <h2 className="text-lg font-bold mb-3">Related</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Link href="/opioids" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium">💊 Opioid Analysis</Link>
          <Link href="/analysis/opioid-crisis" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium">📊 Opioid Crisis in Medicare</Link>
          <Link href="/analysis/opioid-hotspots" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium">🗺️ Geographic Hotspots</Link>
          <Link href="/dangerous-combinations" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium">⚠️ Dangerous Combos</Link>
          <Link href="/flagged" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium">🔴 Flagged Providers</Link>
          <Link href="/risk-explorer" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium">🔍 Risk Explorer</Link>
        </div>
      </section>
    </div>
  )
}
