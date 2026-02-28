import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'
import RelatedAnalysis from '@/components/RelatedAnalysis'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import { stateName } from '@/lib/state-names'

export const metadata: Metadata = {
  title: 'The State of Prescribing: 2023 Medicare Part D Report Card',
  description: 'A comprehensive report card for Medicare Part D in 2023 — cost trends, opioid patterns, risk findings, and key takeaways from 1.38 million prescribers.',
  alternates: { canonical: 'https://www.openprescriber.org/analysis/state-of-prescribing' },
}

export default function StateOfPrescribingArticle() {
  const stats = loadData('stats.json')
  const trends = loadData('yearly-trends.json') as { year: number; cost: number; claims: number; providers: number; opioidProv: number; opioidPct: number }[]
  const states = loadData('states.json') as { state: string; providers: number; cost: number; avgOpioidRate: number }[]
  const drugs = loadData('drugs.json') as { brand: string; generic: string; cost: number; claims: number }[]
  const REAL = new Set('AL,AK,AZ,AR,CA,CO,CT,DE,DC,FL,GA,HI,ID,IL,IN,IA,KS,KY,LA,ME,MD,MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ,NM,NY,NC,ND,OH,OK,OR,PA,PR,RI,SC,SD,TN,TX,UT,VT,VA,WA,WV,WI,WY'.split(','))

  const t0 = trends[0]
  const t4 = trends[4]
  const costGrowth = ((t4.cost / t0.cost - 1) * 100).toFixed(0)
  const provGrowth = ((t4.providers / t0.providers - 1) * 100).toFixed(0)

  const topStates = states.filter(s => REAL.has(s.state)).sort((a, b) => b.cost - a.cost).slice(0, 5)
  const topOpioidStates = states.filter(s => REAL.has(s.state)).sort((a, b) => b.avgOpioidRate - a.avgOpioidRate).slice(0, 5)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema
        title="The State of Prescribing: 2023 Medicare Part D Report Card"
        description="Comprehensive annual report on Medicare Part D prescribing"
        slug="state-of-prescribing"
        date="2026-02-28"
      />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'State of Prescribing 2023' }]} />

      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">The State of Prescribing: 2023 Report Card</h1>
      <p className="text-sm text-gray-500 mb-4">Annual Report · February 2026</p>
      <ShareButtons title="State of Prescribing 2023" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg">
          2023 was a record year for Medicare Part D. <strong>{fmtMoney(t4.cost)}</strong> in drug costs across <strong>{fmt(t4.providers)}</strong> prescribers — up {costGrowth}% from 2019. Here are the ten most important things the data tells us.
        </p>

        <h2>1. Drug Costs Hit $275.6 Billion</h2>
        <p>
          Part D spending has increased every single year, from {fmtMoney(t0.cost)} in 2019 to {fmtMoney(t4.cost)} in 2023 — a {costGrowth}% increase in five years. At this rate, Part D will exceed $350 billion by 2027.
        </p>

        <h2>2. The Prescriber Workforce Grew {provGrowth}%</h2>
        <p>
          From {fmt(t0.providers)} to {fmt(t4.providers)} prescribers in five years. Most of this growth comes from Nurse Practitioners and Physician Assistants, who now outnumber any single physician specialty.
        </p>

        <h2>3. Eliquis Is King — at $7.75 Billion</h2>
        <p>
          The blood thinner Eliquis (apixaban) is the most expensive drug in Part D by a wide margin. At {fmtMoney(drugs[0]?.cost || 0)}, it costs more than the next two drugs combined. <Link href="/drugs">See all drug rankings →</Link>
        </p>

        <h2>4. GLP-1 Drugs Are the Fastest Growing Category</h2>
        <p>
          Ozempic, Trulicity, and Mounjaro have collectively tripled in cost since 2019. They now account for over $8 billion annually — and Medicare hasn&apos;t even started widely covering weight-loss indications yet. <Link href="/analysis/ozempic-effect">Read our GLP-1 analysis →</Link>
        </p>

        <h2>5. One-Third of Prescribers Write Opioids</h2>
        <p>
          {fmt(stats.opioidProv)} providers prescribed opioids in 2023 — {(stats.opioidProv / stats.providers * 100).toFixed(0)}% of all prescribers. While the opioid prescribing rate has been declining since the late 2010s, it remains remarkably persistent.
        </p>

        <h2>6. The Top 5 States Spend More Than Some Countries</h2>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm bg-white rounded-xl border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">State</th>
                <th className="px-4 py-2 text-right font-semibold">Drug Spending</th>
                <th className="px-4 py-2 text-right font-semibold">Prescribers</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topStates.map(s => (
                <tr key={s.state}>
                  <td className="px-4 py-2"><Link href={`/states/${s.state.toLowerCase()}`} className="text-primary hover:underline">{stateName(s.state)}</Link></td>
                  <td className="px-4 py-2 text-right font-mono font-bold">{fmtMoney(s.cost)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(s.providers)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>7. Brand Drugs: 13% of Volume, 67% of Cost</h2>
        <p>
          Brand-name drugs account for just {stats.brandPct}% of prescriptions but {(stats.brandCost / stats.cost * 100).toFixed(0)}% of total spending. Every 1% shift from brand to generic saves roughly $1.5 billion. <Link href="/brand-vs-generic">Brand vs generic analysis →</Link>
        </p>

        <h2>8. {stats.excluded} Excluded Providers Still Active</h2>
        <p>
          Despite being on the OIG&apos;s exclusion list for fraud, abuse, or other offenses, {stats.excluded} providers appeared in 2023 prescribing data. This represents a persistent gap in CMS enforcement. <Link href="/excluded">See excluded providers →</Link>
        </p>

        <h2>9. Machine Learning Found 2,579 Providers Rules Missed</h2>
        <p>
          Our ML model, trained on confirmed fraud cases, identified 4,100+ suspicious prescribers. Of these, 2,579 were <em>not</em> flagged by our rule-based scoring — suggesting significant blind spots in traditional approaches. <Link href="/ml-fraud-detection">ML fraud detection →</Link>
        </p>

        <h2>10. The Opioid Geography Hasn&apos;t Changed</h2>
        <p>
          The same states that led in opioid prescribing five years ago still lead today:
        </p>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm bg-white rounded-xl border">
            <thead className="bg-red-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">State</th>
                <th className="px-4 py-2 text-right font-semibold">Avg Opioid Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topOpioidStates.map(s => (
                <tr key={s.state}>
                  <td className="px-4 py-2"><Link href={`/states/${s.state.toLowerCase()}`} className="text-primary hover:underline">{stateName(s.state)}</Link></td>
                  <td className="px-4 py-2 text-right font-mono text-red-600 font-bold">{s.avgOpioidRate.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>The Bottom Line</h2>
        <p>
          Medicare Part D is getting more expensive, more complex, and more reliant on high-cost specialty drugs. The IRA&apos;s drug price negotiation provisions are a start, but at current growth rates, they&apos;ll barely dent the trajectory. Meanwhile, opioid prescribing patterns remain stubbornly persistent, and fraud detection still has significant gaps.
        </p>
        <p>
          Transparency is the first step. That&apos;s why we build tools like OpenPrescriber — to make this data visible, searchable, and actionable for everyone.
        </p>
      </div>

      <RelatedAnalysis current="/analysis/state-of-prescribing" />
    </div>
  )
}
