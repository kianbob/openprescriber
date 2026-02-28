import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'Dangerous Drug Combinations: 6,149 Opioid+Benzo Co-Prescribers',
  description: 'FDA Black Box Warning: concurrent opioid and benzodiazepine prescribing kills thousands annually. We identified 6,149 Medicare providers co-prescribing these drugs.',
  alternates: { canonical: 'https://www.openprescriber.org/dangerous-combinations' },
}

export default function DangerousCombinationsPage() {
  const combos = loadData('drug-combos.json') as { npi: string; name: string; city: string; state: string; specialty: string; claims: number; cost: number; opioidRate: number; riskLevel: string; anomalyScore: number }[]
  const top50 = [...combos].sort((a, b) => b.anomalyScore - a.anomalyScore).slice(0, 50)
  const totalCost = combos.reduce((s, d) => s + d.cost, 0)
  const highRisk = combos.filter(c => c.riskLevel === 'high').length
  const stateMap: Record<string, number> = {}
  const specMap: Record<string, number> = {}
  combos.forEach(c => {
    stateMap[c.state] = (stateMap[c.state] || 0) + 1
    specMap[c.specialty] = (specMap[c.specialty] || 0) + 1
  })
  const topStates = Object.entries(stateMap).sort((a, b) => b[1] - a[1]).slice(0, 10)
  const topSpecs = Object.entries(specMap).sort((a, b) => b[1] - a[1]).slice(0, 10)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Risk Analysis', href: '/flagged' }, { label: 'Dangerous Drug Combinations' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">Dangerous Drug Combinations: {fmt(combos.length)} Opioid+Benzo Co-Prescribers</h1>
      <ShareButtons title="Dangerous Drug Combinations: 6,149 Opioid+Benzo Co-Prescribers" />

      <div className="prose prose-gray max-w-none mt-6">
        <div className="not-prose bg-red-50 border-2 border-red-300 rounded-xl p-6 my-4">
          <h3 className="font-bold text-red-800 mb-2">⚠️ FDA Black Box Warning</h3>
          <p className="text-sm text-red-700">
            In 2016, the FDA issued its strongest warning — a <strong>Black Box Warning</strong> — against concurrent prescribing of opioids and benzodiazepines. The combination can cause profound sedation, respiratory depression, coma, and death. Despite this, thousands of Medicare providers continue to co-prescribe these drug classes at elevated rates.
          </p>
        </div>

        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">{fmt(combos.length)}</p>
            <p className="text-xs text-red-600">Co-Prescribers</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">{fmt(highRisk)}</p>
            <p className="text-xs text-red-600">High Risk</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">{fmtMoney(totalCost)}</p>
            <p className="text-xs text-red-600">Total Cost</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">{topStates[0]?.[0] || 'N/A'}</p>
            <p className="text-xs text-red-600">Top State</p>
          </div>
        </div>

        <h2>Why This Matters</h2>
        <p>
          Opioids and benzodiazepines are each central nervous system depressants. When taken together, they compound respiratory depression — the mechanism behind most overdose deaths. According to the CDC, roughly <strong>16% of opioid overdose deaths</strong> also involve benzodiazepines. The FDA&apos;s 2016 Black Box Warning was an unprecedented step, requiring updated labels on nearly 400 products.
        </p>
        <p>
          Despite the warning, our analysis of the 2023 Medicare Part D dataset identified <strong>{fmt(combos.length)} providers</strong> who prescribe both opioids and benzodiazepines at rates that significantly exceed their specialty peers. These are not occasional prescribers — they are statistical outliers whose concurrent prescribing patterns warrant scrutiny.
        </p>

        <h2>Top 50 by Anomaly Score</h2>
        <p>
          We rank co-prescribers by an <strong>anomaly score</strong> that accounts for the volume and rate of concurrent prescribing relative to specialty norms. A higher score indicates greater deviation from expected patterns.
        </p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Provider</th>
                <th className="px-3 py-2 text-left font-semibold">Specialty</th>
                <th className="px-3 py-2 text-left font-semibold">Location</th>
                <th className="px-3 py-2 text-right font-semibold">Opioid Rate</th>
                <th className="px-3 py-2 text-right font-semibold">Claims</th>
                <th className="px-3 py-2 text-right font-semibold">Cost</th>
                <th className="px-3 py-2 text-right font-semibold">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {top50.slice(0, 25).map(p => (
                <tr key={p.npi}>
                  <td className="px-3 py-2">
                    <Link href={`/providers/${p.npi}`} className="text-primary hover:underline font-medium">{p.name}</Link>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500">{p.specialty}</td>
                  <td className="px-3 py-2 text-xs text-gray-500">{p.city}, {p.state}</td>
                  <td className="px-3 py-2 text-right font-mono text-red-600 font-semibold">{p.opioidRate.toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right font-mono">{fmt(p.claims)}</td>
                  <td className="px-3 py-2 text-right font-mono">{fmtMoney(p.cost)}</td>
                  <td className="px-3 py-2 text-right font-mono font-bold">{p.anomalyScore.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
            <tbody>
              <tr>
                <td colSpan={7}>
                  <details>
                    <summary className="px-3 py-3 text-sm text-primary font-medium cursor-pointer hover:bg-gray-50">Show all 50 co-prescribers →</summary>
                    <table className="w-full text-sm">
                      <tbody className="divide-y">
                        {top50.slice(25).map(p => (
                          <tr key={p.npi}>
                            <td className="px-3 py-2">
                              <Link href={`/providers/${p.npi}`} className="text-primary hover:underline font-medium">{p.name}</Link>
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-500">{p.specialty}</td>
                            <td className="px-3 py-2 text-xs text-gray-500">{p.city}, {p.state}</td>
                            <td className="px-3 py-2 text-right font-mono text-red-600 font-semibold">{p.opioidRate.toFixed(1)}%</td>
                            <td className="px-3 py-2 text-right font-mono">{fmt(p.claims)}</td>
                            <td className="px-3 py-2 text-right font-mono">{fmtMoney(p.cost)}</td>
                            <td className="px-3 py-2 text-right font-mono font-bold">{p.anomalyScore.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </details>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Breakdown by Specialty</h2>
        <p>Co-prescribing patterns vary significantly by specialty. The most common specialties among flagged co-prescribers:</p>
        <div className="not-prose my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {topSpecs.map(([spec, count]) => (
              <div key={spec} className="flex justify-between bg-gray-50 rounded-lg px-4 py-2 text-sm">
                <span>{spec}</span>
                <span className="font-mono font-semibold">{fmt(count)}</span>
              </div>
            ))}
          </div>
        </div>

        <h2>Breakdown by State</h2>
        <p>Geographic patterns in co-prescribing often mirror broader opioid crisis hotspots:</p>
        <div className="not-prose my-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {topStates.map(([state, count]) => (
              <div key={state} className="bg-red-50 rounded-lg px-3 py-2 text-center border border-red-100">
                <Link href={`/states/${state.toLowerCase()}`} className="text-primary hover:underline font-semibold">{state}</Link>
                <p className="text-xs text-red-600">{fmt(count)} providers</p>
              </div>
            ))}
          </div>
        </div>

        <h2>Methodology</h2>
        <p>
          Our co-prescribing analysis identifies providers who prescribe both opioid and benzodiazepine drug classes at rates exceeding their specialty-adjusted peer group mean by more than 2 standard deviations. The <strong>anomaly score</strong> combines the z-scores for opioid rate, benzodiazepine rate, and concurrent prescribing volume into a single composite metric. We use CMS Medicare Part D data which includes all claims for providers with 11+ claims per drug.
        </p>
        <p>
          It is important to note that some concurrent prescribing may be clinically appropriate — for example, in palliative care or carefully managed chronic pain. A high anomaly score does not necessarily indicate malpractice, but it does indicate a prescribing pattern that deviates significantly from peers and warrants review. Patients should discuss any concerns with their healthcare provider.
        </p>

        <div className="not-prose mt-8 space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">Related: <Link href="/opioids" className="text-primary font-medium hover:underline">Opioid Prescribing Analysis →</Link> | <Link href="/flagged" className="text-primary font-medium hover:underline">Flagged Providers →</Link> | <Link href="/peer-comparison" className="text-primary font-medium hover:underline">Peer Comparison Analysis →</Link></p>
          </div>
          <p className="text-xs text-gray-400">Data source: CMS Medicare Part D Prescribers dataset, 2023. Provider identification does not imply wrongdoing. This analysis is for educational and research purposes only and should not be used to make healthcare decisions.</p>
        </div>
      </div>
    </div>
  )
}
