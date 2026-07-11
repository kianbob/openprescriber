import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ArticleSchema from '@/components/ArticleSchema'
import FAQSchema from '@/components/FAQSchema'
import ShareButtons from '@/components/ShareButtons'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import RelatedAnalysis from '@/components/RelatedAnalysis'
import { fmtMoney, fmt, slugify } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

const title = 'Most Prescribed Drugs in America 2026: Top 20 by Volume, Cost & Trends'
const description = 'The 20 most prescribed drugs in the United States in 2026 — ranked by prescription volume with cost breakdowns, therapeutic trends, and what they reveal about America\'s biggest health challenges.'
const slug = 'most-prescribed-drugs-america-2026'
const canonical = `https://www.openprescriber.org/analysis/${slug}`

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: canonical, type: 'article' },
  alternates: { canonical },
}

const faqs = [
  { question: 'What is the most prescribed drug in America in 2026?', answer: 'Atorvastatin (Lipitor) remains the most prescribed drug in America in 2026, with tens of millions of Medicare Part D claims annually. It is a cholesterol-lowering statin used to prevent heart disease and costs roughly $2-5 per prescription as a generic.' },
  { question: 'How many prescriptions are filled in the US each year?', answer: 'Approximately 6.7 billion prescriptions are filled in the United States annually. Medicare Part D alone accounts for over 1 billion claims per year covering 67+ million beneficiaries.' },
  { question: 'What are the most expensive commonly prescribed drugs?', answer: 'Among commonly prescribed drugs, Eliquis (apixaban) is the most expensive at over $7.75 billion in annual Medicare costs. GLP-1 drugs like Ozempic ($1,000+/month) and Mounjaro are also high-cost high-volume medications. Most of the top 20 by volume, however, are cheap generics costing under $10 per fill.' },
  { question: 'Why are generic drugs prescribed more than brand-name drugs?', answer: 'Generic drugs contain the same active ingredients as brand-name drugs but cost 80-90% less. Insurance plans and pharmacy benefit managers incentivize generic use through lower copays, and most states allow pharmacists to substitute generics automatically unless the prescriber specifies otherwise.' },
  { question: 'Are the most prescribed drugs in 2026 different from previous years?', answer: 'The top 20 list is remarkably stable year over year — chronic disease medications like statins, blood pressure drugs, and metformin have dominated for over a decade. The biggest shifts are GLP-1 drugs (Ozempic, Mounjaro) climbing rapidly in both volume and cost, and the impact of IRA drug price negotiations on certain brand-name medications.' },
]

export default function MostPrescribedDrugsAmerica2026Page() {
  const drugs = loadData('drugs.json') as {
    generic: string; brand: string; claims: number; cost: number
    benes: number; providers: number; fills: number; costPerClaim: number
  }[]

  const byClaims = [...drugs].sort((a, b) => (b.claims ?? 0) - (a.claims ?? 0))
  const top20 = byClaims.slice(0, 20)
  const totalClaimsTop20 = top20.reduce((s, d) => s + (d.claims ?? 0), 0)
  const totalCostTop20 = top20.reduce((s, d) => s + (d.cost ?? 0), 0)
  const totalAllCost = drugs.reduce((s, d) => s + (d.cost ?? 0), 0)

  // GLP-1 drugs for trend section
  const glp1Drugs = drugs.filter(d => /semaglutide|dulaglutide|liraglutide|tirzepatide|exenatide/i.test(d.generic))
  const glp1Total = glp1Drugs.reduce((s, d) => s + (d.cost ?? 0), 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema title={title} description={description} slug={slug} date="2026-07-10" />
      <FAQSchema faqs={faqs} />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Most Prescribed Drugs in America 2026' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">{title}</h1>
      <ShareButtons title={title} />
      <DisclaimerBanner />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          Every year, billions of prescriptions are filled across the United States. The medications Americans take most frequently reveal a nation grappling with chronic disease at massive scale — heart disease, diabetes, high blood pressure, and mental health conditions dominate the list. Using comprehensive Medicare Part D data covering 1.38 million prescribers, here are the 20 most prescribed drugs in America heading into 2026.
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmt(totalClaimsTop20)}</p>
            <p className="text-xs text-blue-600">Top 20 Claims</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmtMoney(totalCostTop20)}</p>
            <p className="text-xs text-blue-600">Top 20 Total Cost</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">1.38M</p>
            <p className="text-xs text-blue-600">Prescribers</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmtMoney(totalAllCost)}</p>
            <p className="text-xs text-blue-600">Total Part D Spending</p>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Top 20 Most Prescribed Drugs in America (2026 Data)</h2>
        <p>
          Ranked by total prescription claims in the most recent Medicare Part D dataset. These are the drugs that doctors write most often — not necessarily the most expensive:
        </p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">#</th>
                <th className="px-3 py-2 text-left font-semibold">Drug (Generic Name)</th>
                <th className="px-3 py-2 text-left font-semibold">Brand</th>
                <th className="px-3 py-2 text-left font-semibold">Used For</th>
                <th className="px-3 py-2 text-right font-semibold">Claims</th>
                <th className="px-3 py-2 text-right font-semibold">Cost/Rx</th>
                <th className="px-3 py-2 text-right font-semibold">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {top20.map((d, i) => {
                const uses: Record<string, string> = {
                  'ATORVASTATIN CALCIUM': 'High cholesterol',
                  'LEVOTHYROXINE SODIUM': 'Thyroid disorder',
                  'LISINOPRIL': 'High blood pressure',
                  'METFORMIN HCL': 'Type 2 diabetes',
                  'AMLODIPINE BESYLATE': 'High blood pressure',
                  'METOPROLOL SUCCINATE': 'Heart disease/BP',
                  'OMEPRAZOLE': 'Acid reflux (GERD)',
                  'SIMVASTATIN': 'High cholesterol',
                  'LOSARTAN POTASSIUM': 'High blood pressure',
                  'GABAPENTIN': 'Nerve pain/seizures',
                  'HYDROCHLOROTHIAZIDE': 'High blood pressure',
                  'SERTRALINE HCL': 'Depression/anxiety',
                  'ROSUVASTATIN CALCIUM': 'High cholesterol',
                  'FUROSEMIDE': 'Heart failure/edema',
                  'PANTOPRAZOLE SODIUM': 'Acid reflux (GERD)',
                  'MONTELUKAST SODIUM': 'Asthma/allergies',
                  'APIXABAN': 'Blood clot prevention',
                  'TRAMADOL HCL': 'Pain management',
                  'POTASSIUM CHLORIDE': 'Potassium supplement',
                  'ALBUTEROL SULFATE': 'Asthma/COPD',
                  'METOPROLOL TARTRATE': 'Heart disease/BP',
                  'ACETAMINOPHEN WITH CODEINE': 'Pain management',
                  'CLOPIDOGREL BISULFATE': 'Heart attack prevention',
                  'PRAVASTATIN SODIUM': 'High cholesterol',
                  'CARVEDILOL': 'Heart failure/BP',
                  'WARFARIN SODIUM': 'Blood clot prevention',
                  'ESCITALOPRAM OXALATE': 'Depression/anxiety',
                  'DULOXETINE HCL': 'Depression/nerve pain',
                  'MELOXICAM': 'Arthritis/inflammation',
                  'PREDNISONE': 'Inflammation',
                }
                return (
                  <tr key={d.generic} className={i < 5 ? 'bg-blue-50' : ''}>
                    <td className="px-3 py-2 text-gray-400 font-mono text-sm">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">
                      <Link href={`/drugs/${slugify(d.generic)}`} className="text-primary hover:underline text-sm">{d.generic.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</Link>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500">{d.brand || '—'}</td>
                    <td className="px-3 py-2 text-xs text-gray-600">{uses[d.generic] || '—'}</td>
                    <td className="px-3 py-2 text-right font-mono text-sm">{fmt(d.claims)}</td>
                    <td className="px-3 py-2 text-right font-mono text-sm">${(d.costPerClaim ?? 0).toFixed(0)}</td>
                    <td className="px-3 py-2 text-right font-mono text-sm font-semibold">{fmtMoney(d.cost)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="text-xs text-gray-400 mt-2">Source: CMS Medicare Part D Prescriber Public Use File. Claims = total 30-day equivalent prescriptions.</p>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Key Takeaways from the 2026 Prescribing Data</h2>

        <h3 className="font-[family-name:var(--font-heading)]">1. Chronic Disease Management Dominates</h3>
        <p>
          The top 20 reads like a checklist of America&apos;s biggest health challenges. Heart disease medications (statins, ACE inhibitors, beta-blockers, blood thinners) account for roughly half the list. Diabetes drugs, thyroid medications, and gastrointestinal treatments fill the rest. These are medications people take every day, often for the rest of their lives.
        </p>
        <p>
          This isn&apos;t surprising — heart disease kills more Americans than any other condition, and over 37 million Americans have diabetes. But it underscores that the foundation of American prescribing is <em>maintenance medication</em> for conditions that don&apos;t go away.
        </p>

        <h3 className="font-[family-name:var(--font-heading)]">2. Generics Keep Costs Down — Mostly</h3>
        <p>
          Most of the top 20 are available as generics, keeping per-prescription costs in the single digits. Atorvastatin, metformin, and lisinopril each cost roughly $2-5 per fill. But there are notable exceptions: <Link href="/drugs/apixaban">Eliquis (apixaban)</Link> costs over $200 per fill and generates more than $7.75 billion in annual Medicare spending — making it the <Link href="/analysis/top-drugs-analysis">most expensive drug in Medicare Part D</Link> despite being only moderately high in claim volume.
        </p>
        <p>
          The lesson: a single expensive drug among the top 20 can cost more than the other 19 combined. For a deeper look at this divide, see our <Link href="/analysis/generic-vs-brand-drugs-2026">Generic vs Brand Name Drugs: 2026 Price Comparison Guide</Link>.
        </p>

        <h3 className="font-[family-name:var(--font-heading)]">3. The GLP-1 Revolution Is Climbing the Charts</h3>
        <p>
          While GLP-1 drugs like <Link href="/analysis/ozempic-medicare-cost">Ozempic</Link> and Mounjaro don&apos;t yet crack the top 20 by claim volume, they&apos;re among the fastest-growing categories in all of medicine. GLP-1 drugs currently cost Medicare <strong>{fmtMoney(glp1Total)}</strong> annually and are climbing rapidly. If Medicare expands coverage to include weight loss indications, they could enter the top 20 within 2-3 years.
        </p>
        <p>
          Read our full analysis: <Link href="/analysis/ozempic-effect">The Ozempic Effect: How GLP-1 Drugs Are Reshaping Medicare</Link>
        </p>

        <h3 className="font-[family-name:var(--font-heading)]">4. Mental Health Medications Are Rising</h3>
        <p>
          Sertraline (Zoloft), escitalopram (Lexapro), and duloxetine (Cymbalta) — all antidepressants — have been climbing the prescription charts steadily. Gabapentin, originally an anti-seizure drug, is now one of the most-prescribed medications in America largely due to off-label use for anxiety and nerve pain. The mental health medication surge reflects both greater awareness and a growing crisis that the pandemic accelerated.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">Most Prescribed vs. Most Expensive: Why It Matters</h2>
        <p>
          One of the most important distinctions in drug policy is the difference between <em>volume</em> and <em>cost</em>. The most-prescribed drugs are cheap generics that keep millions of people alive and functional. The most <em>expensive</em> drugs are specialty biologics and brand-name medications that serve smaller populations at vastly higher per-patient costs.
        </p>
        <div className="not-prose bg-amber-50 border border-amber-200 rounded-xl p-6 my-6">
          <p className="font-semibold text-amber-800 mb-2">The Cost Concentration Problem</p>
          <ul className="space-y-2 text-sm text-amber-800">
            <li>• The top 20 drugs by volume are mostly under $10/fill — together they cost {fmtMoney(totalCostTop20)}</li>
            <li>• The top 20 drugs by <em>cost</em> consume over 22% of all Part D spending</li>
            <li>• Eliquis alone costs more than the bottom 3,000+ drugs combined</li>
            <li>• GLP-1 drugs ({fmtMoney(glp1Total)}) cost more than all antibiotics in Medicare</li>
          </ul>
        </div>
        <p>
          This means cost-saving efforts should focus on the expensive drugs, not the high-volume generics that are already cost-effective. The Inflation Reduction Act&apos;s <Link href="/ira-negotiation">drug price negotiation program</Link> reflects this approach, targeting the highest-cost medications for direct Medicare price negotiations.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">2026 Trends Reshaping American Prescribing</h2>
        <ul>
          <li><strong>IRA Drug Negotiations:</strong> The first 10 Medicare-negotiated drug prices took effect in 2026, including Eliquis. This could shift prescribing patterns and reduce costs for some of the most expensive commonly-prescribed drugs.</li>
          <li><strong>Biosimilar Growth:</strong> Cheaper alternatives to expensive biologics are gaining market share, particularly for drugs like Humira and insulin.</li>
          <li><strong>GLP-1 Expansion:</strong> <Link href="/analysis/ozempic-medicare-cost">Ozempic and Mounjaro</Link> continue explosive growth. Congressional debates about Medicare coverage for obesity treatment could dramatically expand their reach.</li>
          <li><strong>Generic Wave:</strong> Several major brand drugs are approaching patent expiration, which will shift them from the &quot;most expensive&quot; list to the &quot;most prescribed&quot; list as generic versions launch.</li>
          <li><strong>$2,000 Out-of-Pocket Cap:</strong> The IRA&apos;s new cap on Medicare Part D out-of-pocket costs may increase prescription fills as patients face lower cost barriers. See our <Link href="/analysis/medicare-drug-costs-2026">Medicare Drug Costs 2026 guide</Link> for details.</li>
        </ul>

        <h2 className="font-[family-name:var(--font-heading)]">How Prescribing Varies Across the Country</h2>
        <p>
          National averages mask significant geographic variation. <Link href="/analysis/geographic-disparities">Southern and rural states</Link> tend to have higher rates of cardiovascular and diabetes medications, reflecting higher disease prevalence. <Link href="/analysis/opioid-hotspots">Opioid prescribing hotspots</Link> persist in Appalachia and parts of the South. Urban areas tend to see higher rates of specialty drug prescribing.
        </p>
        <p>
          Explore your state: <Link href="/states">State-by-state prescribing data →</Link>
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <div key={i} className="mb-4">
            <h3 className="font-[family-name:var(--font-heading)] text-lg">{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-blue-800 font-medium">Explore More Drug Data</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/drugs" className="text-sm text-primary hover:underline">💊 All 4,000+ Drugs</Link>
            <Link href="/analysis/most-prescribed-drugs" className="text-sm text-primary hover:underline">📊 Full Top 50 List</Link>
            <Link href="/analysis/top-drugs-analysis" className="text-sm text-primary hover:underline">💰 Most Expensive Drugs</Link>
            <Link href="/analysis/ozempic-medicare-cost" className="text-sm text-primary hover:underline">💉 Ozempic Medicare Costs</Link>
            <Link href="/analysis/generic-vs-brand-drugs-2026" className="text-sm text-primary hover:underline">💊 Generic vs Brand 2026</Link>
            <Link href="/tools/drug-lookup" className="text-sm text-primary hover:underline">🔍 Drug Lookup Tool</Link>
          </div>
        </div>
        <RelatedAnalysis current={`/analysis/${slug}`} />
      </div>
    </div>
  )
}
