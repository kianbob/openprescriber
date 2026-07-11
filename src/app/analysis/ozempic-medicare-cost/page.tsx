import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ArticleSchema from '@/components/ArticleSchema'
import FAQSchema from '@/components/FAQSchema'
import ShareButtons from '@/components/ShareButtons'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import RelatedAnalysis from '@/components/RelatedAnalysis'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

const title = 'Ozempic Medicare Cost: What Taxpayers Are Paying for GLP-1 Drugs in 2026'
const description = 'How much does Ozempic cost Medicare? We break down taxpayer spending on Ozempic, Wegovy, Mounjaro, and other GLP-1 drugs — costs per patient, total Medicare burden, and the policy debate over who should pay.'
const slug = 'ozempic-medicare-cost'
const canonical = `https://www.openprescriber.org/analysis/${slug}`

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: canonical, type: 'article' },
  alternates: { canonical },
}

const faqs = [
  { question: 'How much does Ozempic cost Medicare per patient?', answer: 'Ozempic costs Medicare approximately $1,000-1,400 per monthly prescription, or roughly $12,000-17,000 per patient per year. The exact cost per claim varies by dosage and pharmacy, but it consistently ranks among the most expensive high-volume drugs in Medicare Part D.' },
  { question: 'Is Ozempic covered by Medicare in 2026?', answer: 'Ozempic is covered by Medicare Part D when prescribed for its FDA-approved indication of type 2 diabetes. However, Medicare does not currently cover Ozempic or Wegovy when prescribed solely for weight loss. CMS has proposed limited coverage for cardiovascular risk reduction in obese patients with heart disease, but broad obesity coverage remains under Congressional debate.' },
  { question: 'How much does Medicare spend on GLP-1 drugs total?', answer: 'Medicare spends billions annually on GLP-1 drugs including Ozempic, Trulicity, Mounjaro, and others. This spending has tripled since 2019 and continues to grow rapidly as more patients are prescribed these medications for diabetes management.' },
  { question: 'Will Ozempic get cheaper under Medicare?', answer: 'Ozempic has been selected for Medicare drug price negotiation under the Inflation Reduction Act, with negotiated prices expected to take effect in 2027. This could reduce costs by 40-60%, but the impact may be offset by growing patient volume. The first semaglutide biosimilars are not expected until 2031 or later.' },
  { question: 'Does Medicare cover Wegovy for weight loss?', answer: 'No. Medicare Part D has a statutory exclusion for drugs prescribed solely for weight loss, dating back to 2003. Wegovy (semaglutide at a higher dose than Ozempic) is FDA-approved for chronic weight management but is not covered by Medicare. Multiple bills to remove this exclusion have been introduced but not passed.' },
  { question: 'How does the cost of Ozempic in the US compare to other countries?', answer: 'Ozempic costs approximately $936/month in the US compared to $185-220 in Canada, $170-200 in Germany, and about $90 in the UK. American patients and taxpayers pay 3-10x what other wealthy countries pay for the identical medication manufactured in the same facilities.' },
]

export default function OzempicMedicareCostPage() {
  const drugs = loadData('drugs.json') as {
    generic: string; brand: string; claims: number; cost: number
    benes: number; providers: number; fills: number; costPerClaim: number
  }[]

  const glp1Drugs = drugs.filter(d =>
    /semaglutide|dulaglutide|liraglutide|tirzepatide|exenatide/i.test(d.generic)
  )
  const glp1Total = glp1Drugs.reduce((s, d) => s + d.cost, 0)
  const glp1Patients = glp1Drugs.reduce((s, d) => s + d.benes, 0)
  const glp1Claims = glp1Drugs.reduce((s, d) => s + d.claims, 0)
  const glp1Providers = glp1Drugs.reduce((s, d) => s + d.providers, 0)
  const totalPartD = drugs.reduce((s, d) => s + d.cost, 0)
  const glp1Share = totalPartD > 0 ? ((glp1Total / totalPartD) * 100) : 0

  const ozempic = drugs.find(d => d.brand === 'Ozempic')
  const trulicity = drugs.find(d => /Trulicity/i.test(d.brand))
  const mounjaro = drugs.find(d => /Mounjaro/i.test(d.brand))

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema title={title} description={description} slug={slug} date="2026-07-10" />
      <FAQSchema faqs={faqs} />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Ozempic Medicare Cost' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">{title}</h1>
      <ShareButtons title={title} />
      <DisclaimerBanner />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          Ozempic has become one of the most talked-about drugs in America — and one of the most expensive for taxpayers. As a Medicare-covered diabetes medication that also produces dramatic weight loss, semaglutide sits at the center of a multi-billion dollar policy debate: How much should the federal government pay for drugs that millions of Americans want, but that cost over $1,000 per month each?
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">{fmtMoney(ozempic?.cost ?? 0)}</p>
            <p className="text-xs text-red-600">Ozempic Medicare Cost</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">{fmtMoney(glp1Total)}</p>
            <p className="text-xs text-red-600">All GLP-1 Medicare Spending</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">{glp1Share.toFixed(1)}%</p>
            <p className="text-xs text-red-600">Of All Part D Spending</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">{fmt(glp1Patients)}</p>
            <p className="text-xs text-red-600">GLP-1 Patients</p>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">The Taxpayer Tab: GLP-1 Drug Costs in Medicare</h2>
        <p>
          Here&apos;s what Medicare — funded by taxpayer dollars and beneficiary premiums — is spending on GLP-1 receptor agonist drugs:
        </p>

        <div className="not-prose my-6">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Drug</th>
                <th className="px-4 py-2 text-right font-semibold">Total Medicare Cost</th>
                <th className="px-4 py-2 text-right font-semibold">Patients</th>
                <th className="px-4 py-2 text-right font-semibold">Cost/Claim</th>
                <th className="px-4 py-2 text-right font-semibold">Prescribers</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {glp1Drugs.sort((a, b) => b.cost - a.cost).map(d => (
                <tr key={d.generic + d.brand}>
                  <td className="px-4 py-2">
                    <span className="font-medium">{d.brand || d.generic}</span>
                    <span className="text-xs text-gray-400 ml-1">({d.generic.toLowerCase()})</span>
                  </td>
                  <td className="px-4 py-2 text-right font-mono font-semibold text-red-600">{fmtMoney(d.cost)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(d.benes)}</td>
                  <td className="px-4 py-2 text-right font-mono">${(d.costPerClaim ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-2 text-right font-mono text-gray-500">{fmt(d.providers)}</td>
                </tr>
              ))}
              <tr className="bg-red-50 font-semibold">
                <td className="px-4 py-2">Total GLP-1 Class</td>
                <td className="px-4 py-2 text-right font-mono text-red-700">{fmtMoney(glp1Total)}</td>
                <td className="px-4 py-2 text-right font-mono">{fmt(glp1Patients)}</td>
                <td className="px-4 py-2 text-right font-mono">—</td>
                <td className="px-4 py-2 text-right font-mono">{fmt(glp1Providers)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Why Ozempic Costs So Much</h2>
        <p>
          At approximately <strong>${(ozempic?.costPerClaim ?? 0).toLocaleString()} per prescription fill</strong>, Ozempic is not a specialty drug in the traditional sense — it&apos;s a mass-market medication at specialty prices. A single patient on Ozempic costs Medicare roughly <strong>$12,000-17,000 per year</strong>. Multiply that by {fmt(ozempic?.benes ?? 0)} patients in the dataset, and you get {fmtMoney(ozempic?.cost ?? 0)} in Medicare spending on one drug.
        </p>
        <p>
          Several factors keep Ozempic expensive:
        </p>
        <ul>
          <li><strong>No generic competition:</strong> Semaglutide is a complex injectable peptide. The first biosimilar isn&apos;t expected until 2031 or later, giving Novo Nordisk nearly 15 years of market exclusivity.</li>
          <li><strong>Duopoly pricing:</strong> Only two companies — Novo Nordisk (Ozempic/Wegovy) and Eli Lilly (Mounjaro/Zepbound) — dominate the GLP-1 market, limiting competitive pressure.</li>
          <li><strong>Massive demand:</strong> The combination of clinical efficacy and cultural awareness has created unprecedented patient demand that manufacturers have leveraged to maintain premium pricing.</li>
          <li><strong>U.S. pricing structure:</strong> The same drug costs $90/month in the UK and $185-220 in Canada. American taxpayers pay 3-10x more for identical medication.</li>
        </ul>

        <h2 className="font-[family-name:var(--font-heading)]">The Coverage Gap: Diabetes vs. Weight Loss</h2>
        <p>
          Here&apos;s the policy tension at the heart of the Ozempic cost debate: Medicare covers Ozempic for <strong>type 2 diabetes</strong>, but it does <em>not</em> cover the same molecule (Wegovy) when prescribed for <strong>weight loss</strong>. This creates a two-tier system:
        </p>
        <div className="not-prose bg-amber-50 border border-amber-200 rounded-xl p-6 my-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-amber-800 mb-2">✅ Covered by Medicare</p>
              <ul className="space-y-1 text-amber-700">
                <li>• Ozempic for type 2 diabetes</li>
                <li>• Mounjaro for type 2 diabetes</li>
                <li>• Trulicity for type 2 diabetes</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-amber-800 mb-2">❌ Not Covered by Medicare</p>
              <ul className="space-y-1 text-amber-700">
                <li>• Wegovy for weight loss</li>
                <li>• Zepbound for weight loss</li>
                <li>• Any GLP-1 prescribed solely for obesity</li>
              </ul>
            </div>
          </div>
        </div>
        <p>
          The statutory exclusion of anti-obesity medications from Medicare Part D dates to 2003, when weight loss drugs were considered cosmetic. Two decades later, the science has changed dramatically — obesity is recognized as a chronic disease, and GLP-1 drugs reduce cardiovascular events, kidney disease, and mortality. But the law hasn&apos;t caught up.
        </p>
        <p>
          Multiple bills — including the Treat and Reduce Obesity Act — have been introduced to repeal the exclusion. None have passed. The reason is fiscal: the Congressional Budget Office estimates that covering anti-obesity medications for all eligible beneficiaries would cost <strong>$35-50 billion over ten years</strong>. Some independent estimates are far higher.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">What Would Full Obesity Coverage Cost Taxpayers?</h2>
        <p>
          The numbers are staggering. Over 40 million Medicare beneficiaries are overweight or obese. If even a fraction sought GLP-1 prescriptions:
        </p>
        <div className="not-prose bg-red-50 border border-red-200 rounded-xl p-6 my-6">
          <ul className="space-y-3 text-sm text-red-800">
            <li>• <strong>5% uptake (3.4M patients):</strong> ~$40-50 billion per year in additional costs</li>
            <li>• <strong>10% uptake (6.7M patients):</strong> ~$80-100 billion per year — roughly doubling Part D spending</li>
            <li>• <strong>15% uptake (10M patients):</strong> ~$120-150 billion per year</li>
          </ul>
          <p className="text-xs text-red-600 mt-3">Estimates based on ~$12,000/patient/year at current prices. Actual costs would vary with negotiated prices and utilization patterns.</p>
        </div>
        <p>
          These costs would flow through to <em>all</em> Medicare beneficiaries via higher Part D premiums, and to taxpayers through increased federal spending. The IRA&apos;s $2,000 out-of-pocket cap means the federal government — not patients — absorbs most of the cost increase for expensive drugs, shifting the burden directly to the national budget.
        </p>
        <p>
          Supporters argue that preventing obesity-related conditions (heart attacks, strokes, joint replacements, dialysis) would save Medicare money in the long run. This may be true over 15-20 years, but the CBO&apos;s 10-year budget window captures the costs immediately while the savings accrue gradually. It&apos;s the classic government budgeting problem: pay now, save later — but &quot;later&quot; doesn&apos;t fit in the scoring window.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">Price Negotiation: Will the IRA Help?</h2>
        <p>
          The Inflation Reduction Act authorized Medicare to negotiate drug prices for the first time. Ozempic was selected among the next batch of drugs for price negotiation, with negotiated prices expected in <strong>2027</strong>. Based on the first round of negotiations (which achieved 38-79% discounts), Ozempic&apos;s Medicare price could drop to $300-600 per month.
        </p>
        <p>
          But negotiated prices only help if volume doesn&apos;t overwhelm the savings. A 50% price cut is negated if patient volume triples — which is exactly the trajectory GLP-1 drugs are on. The math is simple: lower per-unit costs × higher volume can still equal higher total spending. This is the fundamental challenge the IRA faces with blockbuster drug categories.
        </p>
        <p>
          For more on how the IRA affects drug costs: <Link href="/ira-negotiation">See all IRA-negotiated drugs →</Link>
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">International Price Comparison: What Other Countries Pay</h2>
        <div className="not-prose my-6">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Country</th>
                <th className="px-4 py-2 text-right font-semibold">Monthly Cost (USD equiv.)</th>
                <th className="px-4 py-2 text-right font-semibold">vs. US Price</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="bg-red-50"><td className="px-4 py-2 font-medium">🇺🇸 United States</td><td className="px-4 py-2 text-right font-mono font-semibold">$936</td><td className="px-4 py-2 text-right">—</td></tr>
              <tr><td className="px-4 py-2">🇨🇦 Canada</td><td className="px-4 py-2 text-right font-mono">$185-220</td><td className="px-4 py-2 text-right text-green-600">77% less</td></tr>
              <tr><td className="px-4 py-2">🇩🇪 Germany</td><td className="px-4 py-2 text-right font-mono">$170-200</td><td className="px-4 py-2 text-right text-green-600">79% less</td></tr>
              <tr><td className="px-4 py-2">🇦🇺 Australia</td><td className="px-4 py-2 text-right font-mono">$115-140</td><td className="px-4 py-2 text-right text-green-600">85% less</td></tr>
              <tr><td className="px-4 py-2">🇬🇧 United Kingdom</td><td className="px-4 py-2 text-right font-mono">~$90</td><td className="px-4 py-2 text-right text-green-600">90% less</td></tr>
              <tr><td className="px-4 py-2">🇯🇵 Japan</td><td className="px-4 py-2 text-right font-mono">$75-100</td><td className="px-4 py-2 text-right text-green-600">90% less</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-gray-400 mt-2">Sources: GoodRx, OECD pharmaceutical pricing data, national formulary pricing. Prices approximate and vary by pharmacy/plan.</p>
        </div>
        <p>
          Novo Nordisk is profitable in every market it operates in — the company&apos;s operating profit margin exceeds 40%. The US price is not necessary to fund R&D; it&apos;s what the market bears in the absence of price regulation. American taxpayers effectively subsidize pharmaceutical profits through higher Medicare spending.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">Who Prescribes the Most Ozempic?</h2>
        <p>
          Ozempic is prescribed by an unusually wide range of providers — <strong>{fmt(ozempic?.providers ?? 0)}</strong> individual prescribers in our dataset. This is not a concentrated prescribing pattern like opioids; it&apos;s broadly distributed across the healthcare system:
        </p>
        <ul>
          <li><strong>Endocrinologists</strong> prescribe the most per provider but are a small group</li>
          <li><strong>Internal medicine and family practice</strong> drive the highest absolute volume</li>
          <li><strong>Nurse practitioners and PAs</strong> are a significant and growing share of prescribers</li>
          <li><strong>Geographic concentration</strong> follows diabetes prevalence — highest in Southern and Midwestern states</li>
        </ul>
        <p>
          Explore individual prescriber data: <Link href="/providers">Search Medicare prescribers →</Link>
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">The Mounjaro Factor</h2>
        <p>
          While Ozempic dominates the headlines, Eli Lilly&apos;s Mounjaro (tirzepatide) may be the bigger long-term cost driver. With {fmt(mounjaro?.benes ?? 0)} patients and {fmtMoney(mounjaro?.cost ?? 0)} in spending during its launch year, Mounjaro is on pace to rival Ozempic within 2-3 years. Its dual-receptor mechanism produces greater weight loss and blood sugar control than semaglutide, driving rapid adoption and provider switching.
        </p>
        <p>
          Together, Ozempic and Mounjaro represent a new reality for Medicare: two drugs from two companies that could collectively cost more than <Link href="/analysis/medicare-drug-spending">any other drug category</Link> in the program within a few years.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">The Bottom Line for Taxpayers</h2>
        <div className="not-prose bg-blue-50 border border-blue-200 rounded-xl p-6 my-6">
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• <strong>GLP-1 drugs work</strong> — they reduce blood sugar, body weight, cardiovascular events, and potentially more</li>
            <li>• <strong>The cost is enormous</strong> — {fmtMoney(glp1Total)} annually and growing rapidly, funded by taxpayers and premiums</li>
            <li>• <strong>Coverage expansion would be transformative and expensive</strong> — covering obesity could add $50-150B/year to Medicare</li>
            <li>• <strong>Price negotiation helps but isn&apos;t enough</strong> — volume growth may outpace price reductions</li>
            <li>• <strong>Americans pay 3-10x more</strong> than patients in other wealthy countries for the identical drug</li>
            <li>• <strong>No generic competition until 2031+</strong> — the duopoly pricing structure will persist for years</li>
          </ul>
        </div>
        <p>
          The GLP-1 cost challenge is the defining drug policy question of this decade. The drugs are genuinely effective — perhaps the most broadly beneficial pharmaceutical advance in years. But at current prices and growing volume, they threaten to consume an ever-larger share of the Medicare budget. The answer isn&apos;t to deny patients effective treatment. It&apos;s to fix the pricing system that makes these drugs 10x more expensive in America than anywhere else in the world.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <div key={i} className="mb-4">
            <h3 className="font-[family-name:var(--font-heading)] text-lg">{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-blue-800 font-medium">Related Analysis</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/analysis/ozempic-effect" className="text-sm text-primary hover:underline">📊 The Full Ozempic Effect Analysis</Link>
            <Link href="/glp1-tracker" className="text-sm text-primary hover:underline">📈 GLP-1 Spending Tracker</Link>
            <Link href="/analysis/medicare-drug-costs-2026" className="text-sm text-primary hover:underline">💰 Medicare Drug Costs 2026</Link>
            <Link href="/ira-negotiation" className="text-sm text-primary hover:underline">🏛️ IRA Drug Negotiations</Link>
            <Link href="/analysis/most-prescribed-drugs-america-2026" className="text-sm text-primary hover:underline">💊 Most Prescribed Drugs 2026</Link>
            <Link href="/analysis/generic-vs-brand-drugs-2026" className="text-sm text-primary hover:underline">💊 Generic vs Brand 2026</Link>
          </div>
        </div>
        <RelatedAnalysis current={`/analysis/${slug}`} />
      </div>
    </div>
  )
}
