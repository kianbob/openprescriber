import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt, slugify } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'IRA Drug Price Negotiation: Impact on Medicare Part D',
  description: 'The Inflation Reduction Act targets 10 high-cost drugs representing $22.0B in Medicare Part D spending. See which drugs are affected and estimated savings.',
  alternates: { canonical: 'https://www.openprescriber.org/ira-negotiation' },
}

export default function IRANegotiationPage() {
  const drugs = loadData('ira-drugs.json') as { generic: string; brand: string; claims: number; cost: number; providers: number; topStates: { state: string; cost: number }[] }[]
  const totalCost = drugs.reduce((s, d) => s + d.cost, 0)
  const totalClaims = drugs.reduce((s, d) => s + d.claims, 0)
  const totalProviders = drugs.reduce((s, d) => s + d.providers, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'IRA Drug Price Negotiation' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">IRA Drug Price Negotiation: Impact on Medicare Part D</h1>
      <ShareButtons title="IRA Drug Price Negotiation: Impact on Medicare Part D" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          The Inflation Reduction Act of 2022 authorized Medicare to negotiate prices on high-cost drugs for the first time in the program&apos;s history. The first 10 drugs selected for negotiation represent a staggering <strong>{fmtMoney(totalCost)}</strong> in annual Medicare Part D spending — a watershed moment in U.S. drug pricing policy.
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">10</p>
            <p className="text-xs text-blue-600">Drugs Selected</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmtMoney(totalCost)}</p>
            <p className="text-xs text-blue-600">Total Part D Cost</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmt(totalClaims)}</p>
            <p className="text-xs text-blue-600">Total Claims</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmt(totalProviders)}</p>
            <p className="text-xs text-blue-600">Prescribers</p>
          </div>
        </div>

        <h2>The 10 Negotiated Drugs</h2>
        <p>
          In August 2023, CMS announced the first 10 drugs selected for Medicare price negotiation under the IRA. These drugs were chosen because they had the highest total Part D spending with no generic or biosimilar competition. Negotiated prices take effect on <strong>January 1, 2026</strong>, and are expected to save Medicare billions annually.
        </p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Drug (Generic)</th>
                <th className="px-4 py-2 text-left font-semibold">Brand</th>
                <th className="px-4 py-2 text-right font-semibold">Part D Cost</th>
                <th className="px-4 py-2 text-right font-semibold">Claims</th>
                <th className="px-4 py-2 text-right font-semibold">Providers</th>
                <th className="px-4 py-2 text-left font-semibold">Top States</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {drugs.sort((a, b) => b.cost - a.cost).map(d => (
                <tr key={d.generic}>
                  <td className="px-4 py-2">
                    <Link href={`/drugs/${slugify(d.generic)}`} className="text-primary hover:underline font-medium">{d.generic}</Link>
                  </td>
                  <td className="px-4 py-2 text-gray-500">{d.brand}</td>
                  <td className="px-4 py-2 text-right font-mono font-semibold">{fmtMoney(d.cost)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(d.claims)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(d.providers)}</td>
                  <td className="px-4 py-2 text-xs text-gray-500">
                    {d.topStates.slice(0, 3).map(s => `${s.state} (${fmtMoney(s.cost)})`).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Why These Drugs?</h2>
        <p>
          The IRA requires CMS to select drugs that have been on the market for at least 7 years (small-molecule) or 11 years (biologics), have no generic or biosimilar competition, and rank among the highest in total Medicare Part D spending. The first cohort is dominated by cardiovascular drugs like <strong>Eliquis</strong> (apixaban, {fmtMoney(7750000000)}) and <strong>Xarelto</strong> (rivarelbaan), diabetes treatments like <strong>Jardiance</strong> and <strong>Januvia</strong>, and specialty biologics like <strong>Enbrel</strong>, <strong>Stelara</strong>, and <strong>Imbruvica</strong>.
        </p>
        <p>
          Together, these 10 drugs account for approximately <strong>20%</strong> of all Medicare Part D drug spending — an extraordinary concentration of cost in a handful of brand-name products. Eliquis alone represents more Part D spending than thousands of generic drugs combined.
        </p>

        <h2>Estimated Savings</h2>
        <p>
          The Congressional Budget Office (CBO) estimates that IRA drug price negotiation will save Medicare approximately <strong>$98.5 billion</strong> over the first decade (2026–2035). For the initial 10 drugs, negotiated prices are expected to be <strong>25–60% lower</strong> than current list prices, depending on how long each drug has been on the market.
        </p>

        <div className="not-prose bg-green-50 border border-green-200 rounded-xl p-6 my-6">
          <h3 className="font-bold text-green-800 mb-2">Projected Impact</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• <strong>Year 1 (2026):</strong> Estimated $6–8B in savings on these 10 drugs</li>
            <li>• <strong>Beneficiary impact:</strong> Lower out-of-pocket costs for 9 million+ Medicare enrollees</li>
            <li>• <strong>Expansion:</strong> 15 more drugs added for 2027 negotiation, 15 for 2028, 20 for 2029+</li>
          </ul>
        </div>

        <h2>What This Means for Prescribers</h2>
        <p>
          Price negotiation does not change which drugs providers can prescribe — it changes what Medicare pays. However, the lower negotiated prices will flow through to beneficiary cost-sharing, potentially improving medication adherence. Providers prescribing these drugs to Medicare patients should expect changes in formulary placement and prior authorization requirements starting in 2026.
        </p>
        <p>
          The IRA also includes an inflation rebate provision: if drug manufacturers raise prices faster than inflation, they must pay rebates to Medicare. This creates downward pressure on list prices even for drugs not yet selected for negotiation.
        </p>

        <h2>Broader Context</h2>
        <p>
          The United States spends more on prescription drugs per capita than any other developed nation. Medicare Part D, which covers outpatient prescriptions for over 50 million beneficiaries, has historically been prohibited from negotiating drug prices — a restriction that the IRA partially lifts. Critics argue the negotiation scope is too narrow (only 10 drugs initially) and the timeline too slow, while pharmaceutical companies have filed lawsuits challenging the constitutionality of the program.
        </p>
        <p>
          Regardless of the legal outcome, the data on this page illustrates the extraordinary concentration of Medicare spending in a small number of brand-name drugs. Understanding which drugs cost the most — and who prescribes them — is essential context for any conversation about drug pricing reform.
        </p>

        <div className="not-prose mt-8 space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">Related: <Link href="/glp1-tracker" className="text-primary font-medium hover:underline">GLP-1 Spending Explosion →</Link> | <Link href="/brand-vs-generic" className="text-primary font-medium hover:underline">Brand vs Generic Analysis →</Link> | <Link href="/tools/savings-calculator" className="text-primary font-medium hover:underline">Generic Savings Calculator →</Link></p>
          </div>
          <p className="text-xs text-gray-400">Data source: CMS Medicare Part D Prescribers dataset, 2023. Costs reflect total Part D drug cost (plan + beneficiary). This analysis is for educational purposes; consult official CMS resources for definitive figures.</p>
        </div>
      </div>
    </div>
  )
}
