import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt, slugify } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'GLP-1 Spending Explosion: Ozempic, Mounjaro & the $8.4B Surge',
  description: 'GLP-1 receptor agonists are the fastest-growing drug class in Medicare Part D history. Track $8.4B in spending on Ozempic, Mounjaro, Trulicity and more.',
  alternates: { canonical: 'https://www.openprescriber.org/glp1-tracker' },
}

export default function GLP1TrackerPage() {
  const drugs = loadData('glp1-analysis.json') as { generic: string; brand: string; claims: number; cost: number; providers: number; topStates: { state: string; cost: number }[] }[]
  const totalCost = drugs.reduce((s, d) => s + d.cost, 0)
  const totalClaims = drugs.reduce((s, d) => s + d.claims, 0)
  const totalProviders = drugs.reduce((s, d) => s + d.providers, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'GLP-1 Spending Tracker' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">GLP-1 Spending Explosion: Ozempic, Mounjaro &amp; the $8.4B Surge</h1>
      <ShareButtons title="GLP-1 Spending Explosion: Ozempic, Mounjaro & the $8.4B Surge" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          GLP-1 receptor agonists have become the fastest-growing drug class in Medicare Part D history. Originally developed for type 2 diabetes, drugs like semaglutide (Ozempic/Wegovy) and tirzepatide (Mounjaro/Zepbound) have exploded in popularity due to their dramatic weight-loss effects — driving <strong>{fmtMoney(totalCost)}</strong> in Medicare spending.
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmtMoney(totalCost)}</p>
            <p className="text-xs text-blue-600">Total GLP-1 Spending</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmt(totalClaims)}</p>
            <p className="text-xs text-blue-600">Total Claims</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmt(totalProviders)}</p>
            <p className="text-xs text-blue-600">Prescribers</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{drugs.length}</p>
            <p className="text-xs text-blue-600">GLP-1 Drugs Tracked</p>
          </div>
        </div>

        <h2>GLP-1 Drugs by Medicare Spending</h2>
        <p>
          Semaglutide — marketed as Ozempic for diabetes and Wegovy for weight loss — dominates GLP-1 spending at over $4 billion in Medicare Part D costs alone. Tirzepatide (Mounjaro), a newer dual GIP/GLP-1 agonist, is growing at an unprecedented rate, while older drugs like Trulicity and Victoza still account for significant spending.
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
                <th className="px-4 py-2 text-left font-semibold">Top Prescribing States</th>
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

        <h2>The Weight Loss Revolution</h2>
        <p>
          GLP-1 receptor agonists work by mimicking the incretin hormone GLP-1, which stimulates insulin secretion and suppresses appetite. Clinical trials have shown weight loss of 15–22% of body weight with semaglutide and tirzepatide — results previously only achievable through bariatric surgery. This has created enormous demand, with Novo Nordisk and Eli Lilly struggling to meet supply.
        </p>
        <p>
          For Medicare, the implications are profound. Currently, Medicare Part D covers GLP-1s only for their FDA-approved diabetes indication — not for weight loss alone. However, the Anti-Obesity Medications (AOMs) coverage debate continues in Congress, and if Part D begins covering GLP-1s for obesity, spending could increase by an estimated <strong>$35–50 billion annually</strong>.
        </p>

        <h2>Growth Trajectory</h2>
        <p>
          GLP-1 spending in Medicare Part D has grown by an estimated <strong>40–60% year-over-year</strong> since 2020. Mounjaro (tirzepatide), approved in 2022, has been the fastest drug launch in pharmaceutical history. At current growth rates, GLP-1s could become the single largest drug spending category in Medicare within 2–3 years, surpassing even cancer drugs.
        </p>

        <div className="not-prose bg-red-50 border border-red-200 rounded-xl p-6 my-6">
          <h3 className="font-bold text-red-800 mb-2">⚠️ The Cost Challenge</h3>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• <strong>List price:</strong> Ozempic ~$936/month, Mounjaro ~$1,023/month</li>
            <li>• <strong>Lifetime therapy:</strong> GLP-1s require ongoing use; weight regain occurs upon discontinuation</li>
            <li>• <strong>If obesity coverage passes:</strong> Estimated 3.6 million additional Medicare beneficiaries could qualify</li>
            <li>• <strong>Budget impact:</strong> Could add $35–50B/year to Part D spending</li>
          </ul>
        </div>

        <h2>Prescribing Patterns</h2>
        <p>
          GLP-1 prescribing is concentrated among endocrinologists and internal medicine/family practice physicians. However, prescribing is expanding rapidly into cardiology (given cardiovascular benefits), nephrology, and even psychiatry. Geographic patterns show higher prescribing rates in Southern states with elevated diabetes prevalence, particularly Texas, Florida, and the Carolinas.
        </p>
        <p>
          The rapid expansion of GLP-1 prescribing raises important questions about appropriate use, cost-effectiveness, and equity. While these drugs show remarkable efficacy, their high cost means that access is often determined by insurance coverage rather than medical need. Monitoring prescribing patterns at the provider and geographic level — as OpenPrescriber enables — is essential for ensuring equitable access and identifying potential overuse.
        </p>

        <div className="not-prose mt-8 space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">Related: <Link href="/ira-negotiation" className="text-primary font-medium hover:underline">IRA Drug Price Negotiation →</Link> | <Link href="/drugs" className="text-primary font-medium hover:underline">Top Drugs by Spending →</Link> | <Link href="/brand-vs-generic" className="text-primary font-medium hover:underline">Brand vs Generic Gap →</Link></p>
          </div>
          <p className="text-xs text-gray-400">Data source: CMS Medicare Part D Prescribers dataset, 2023. Costs reflect total Part D drug cost. GLP-1 spending figures include only Part D claims; Part B (physician-administered) claims are excluded. This analysis is for educational purposes only.</p>
        </div>
      </div>
    </div>
  )
}
