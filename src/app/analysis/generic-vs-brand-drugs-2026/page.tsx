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

const title = 'Generic vs Brand Name Drugs: 2026 Price Comparison Guide'
const description = 'How much can you save with generic drugs vs brand-name medications in 2026? We compare costs for the most common prescriptions using real Medicare data — average savings of 80-95% on generics.'
const slug = 'generic-vs-brand-drugs-2026'
const canonical = `https://www.openprescriber.org/analysis/${slug}`

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: canonical, type: 'article' },
  alternates: { canonical },
}

const faqs = [
  { question: 'Are generic drugs as effective as brand-name drugs?', answer: 'Yes. The FDA requires generic drugs to have the same active ingredient, dosage, strength, route of administration, and intended use as the brand-name drug. Generic drugs must also demonstrate bioequivalence — meaning they deliver the same amount of medication to the bloodstream at the same rate. Clinical outcomes are identical.' },
  { question: 'How much cheaper are generic drugs than brand-name?', answer: 'Generic drugs typically cost 80-95% less than their brand-name equivalents. In Medicare Part D data, the average brand-name drug costs over $300 per claim while the average generic costs under $15 per claim — a roughly 20:1 cost difference.' },
  { question: 'Why do some doctors still prescribe brand-name drugs?', answer: 'Reasons include pharmaceutical marketing, patient preference or perceived effectiveness, minor differences in inactive ingredients (which can matter for a small number of patients with allergies), and lack of generic availability for newer drugs. Some specialties like dermatology and ophthalmology have higher brand-prescribing rates due to fewer generic alternatives in topical and ophthalmic formulations.' },
  { question: 'What are the most expensive brand-name drugs that have generic alternatives?', answer: 'Some of the biggest savings opportunities include switching from brand Lipitor to generic atorvastatin (saves ~$200/month), brand Crestor to generic rosuvastatin, and brand Nexium to generic esomeprazole. The largest potential savings for Medicare would come from a generic version of Eliquis (apixaban), which currently costs over $7 billion annually.' },
  { question: 'When will Ozempic and Eliquis have generics?', answer: 'Generic apixaban (Eliquis) is expected within the next few years as patents expire, potentially saving Medicare billions. Biosimilar semaglutide (Ozempic) is not expected until 2031 or later due to the complexity of manufacturing injectable peptide drugs and ongoing patent protections.' },
  { question: 'How much could Medicare save if all prescriptions used generics?', answer: 'Our analysis estimates Medicare could save tens of billions annually if providers switched to generics wherever available. Some specialties prescribe brands at rates exceeding 30% when generic alternatives exist, representing significant potential savings for taxpayers.' },
]

// Common brand/generic pairs with approximate cost comparisons
const comparisons = [
  { brand: 'Lipitor', generic: 'Atorvastatin', use: 'High cholesterol', brandCost: 280, genericCost: 4, savings: 99 },
  { brand: 'Crestor', generic: 'Rosuvastatin', use: 'High cholesterol', brandCost: 260, genericCost: 8, savings: 97 },
  { brand: 'Prinivil/Zestril', generic: 'Lisinopril', use: 'High blood pressure', brandCost: 145, genericCost: 3, savings: 98 },
  { brand: 'Glucophage', generic: 'Metformin', use: 'Type 2 diabetes', brandCost: 180, genericCost: 4, savings: 98 },
  { brand: 'Norvasc', generic: 'Amlodipine', use: 'High blood pressure', brandCost: 150, genericCost: 4, savings: 97 },
  { brand: 'Prilosec', generic: 'Omeprazole', use: 'Acid reflux', brandCost: 200, genericCost: 6, savings: 97 },
  { brand: 'Synthroid', generic: 'Levothyroxine', use: 'Thyroid disorder', brandCost: 55, genericCost: 8, savings: 85 },
  { brand: 'Zoloft', generic: 'Sertraline', use: 'Depression', brandCost: 190, genericCost: 5, savings: 97 },
  { brand: 'Neurontin', generic: 'Gabapentin', use: 'Nerve pain/seizures', brandCost: 350, genericCost: 7, savings: 98 },
  { brand: 'Lopressor', generic: 'Metoprolol', use: 'Heart disease/BP', brandCost: 120, genericCost: 4, savings: 97 },
]

export default function GenericVsBrand2026Page() {
  const drugs = loadData('drugs.json') as {
    generic: string; brand: string; claims: number; cost: number
    benes: number; providers: number; fills: number; costPerClaim: number
  }[]
  const specs = loadData('specialties.json') as { specialty: string; providers: number; cost: number; avgBrandPct: number }[]

  const totalCost = drugs.reduce((s, d) => s + (d.cost ?? 0), 0)

  // High brand-rate specialties
  const topBrand = [...specs]
    .filter(s => s.providers >= 50)
    .sort((a, b) => (b.avgBrandPct ?? 0) - (a.avgBrandPct ?? 0))
    .slice(0, 10)

  // Most expensive drugs (likely brand)
  const byCost = [...drugs].sort((a, b) => (b.cost ?? 0) - (a.cost ?? 0))
  const top10Cost = byCost.slice(0, 10)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema title={title} description={description} slug={slug} date="2026-07-10" />
      <FAQSchema faqs={faqs} />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Generic vs Brand Name Drugs 2026' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">{title}</h1>
      <ShareButtons title={title} />
      <DisclaimerBanner />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          The single easiest way to save money on prescriptions is to use generic drugs. They contain the same active ingredients as brand-name medications, are FDA-approved for the same uses, and cost <strong>80-95% less</strong>. Yet billions of dollars are wasted every year on brand-name drugs when identical generics are available. Here&apos;s the 2026 data on exactly how much you — and taxpayers — can save.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">Price Comparison: Brand vs. Generic for the Most Common Drugs</h2>
        <p>
          These are approximate monthly costs for some of the <Link href="/analysis/most-prescribed-drugs-america-2026">most prescribed drugs in America</Link>, comparing brand-name to generic equivalents:
        </p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Brand Name</th>
                <th className="px-3 py-2 text-left font-semibold">Generic Name</th>
                <th className="px-3 py-2 text-left font-semibold">Used For</th>
                <th className="px-3 py-2 text-right font-semibold">Brand $/mo</th>
                <th className="px-3 py-2 text-right font-semibold">Generic $/mo</th>
                <th className="px-3 py-2 text-right font-semibold">Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {comparisons.map(c => (
                <tr key={c.generic}>
                  <td className="px-3 py-2 font-medium text-gray-500">{c.brand}</td>
                  <td className="px-3 py-2 font-medium text-primary">{c.generic}</td>
                  <td className="px-3 py-2 text-xs text-gray-600">{c.use}</td>
                  <td className="px-3 py-2 text-right font-mono text-red-600">${c.brandCost}</td>
                  <td className="px-3 py-2 text-right font-mono text-green-600">${c.genericCost}</td>
                  <td className="px-3 py-2 text-right font-mono font-semibold text-green-700">{c.savings}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-400 mt-2">Prices are approximate monthly costs. Actual costs vary by pharmacy, insurance, and dosage. Sources: GoodRx, Medicare Part D data.</p>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Why Generic Drugs Cost So Much Less</h2>
        <p>
          Brand-name drug companies invest billions in research, clinical trials, and FDA approval for new medications. In exchange, they receive patent protection — typically 20 years from the filing date — during which no competitor can sell the same drug. During this exclusivity period, the manufacturer sets prices to recoup R&D costs and generate profit.
        </p>
        <p>
          When patents expire, other manufacturers can produce the same drug as a &quot;generic.&quot; Because generic manufacturers don&apos;t need to repeat the expensive clinical trials (the original company already proved the drug works), their costs are dramatically lower. Competition among multiple generic manufacturers drives prices down further — often to just a few dollars per month.
        </p>
        <p>
          The FDA requires generics to be <strong>bioequivalent</strong> to the brand: same active ingredient, same strength, same dosage form, same route of administration. Minor differences in inactive ingredients (fillers, binders, dyes) are allowed but do not affect how the drug works. For the vast majority of patients, switching from brand to generic produces identical clinical results.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">The Drugs Without Generic Alternatives</h2>
        <p>
          Not every drug has a generic version. The most expensive drugs in Medicare are often those still under patent protection. These are the biggest cost drivers in the program:
        </p>

        <div className="not-prose my-6">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Drug</th>
                <th className="px-4 py-2 text-right font-semibold">Medicare Cost</th>
                <th className="px-4 py-2 text-right font-semibold">Cost/Claim</th>
                <th className="px-4 py-2 text-left font-semibold">Generic Available?</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {top10Cost.map(d => (
                <tr key={d.generic}>
                  <td className="px-4 py-2">
                    <span className="font-medium">{d.brand || d.generic}</span>
                    <span className="text-xs text-gray-400 ml-1">({d.generic.toLowerCase()})</span>
                  </td>
                  <td className="px-4 py-2 text-right font-mono font-semibold text-red-600">{fmtMoney(d.cost)}</td>
                  <td className="px-4 py-2 text-right font-mono">${(d.costPerClaim ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-2 text-xs">{(d.costPerClaim ?? 0) < 20 ? <span className="text-green-600">✅ Yes</span> : <span className="text-red-600">❌ No / Brand only</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          The contrast is stark: drugs with generic competition cost a few dollars per prescription. Drugs without it cost hundreds or thousands. The single biggest cost-saving event in Medicare prescribing is when a major brand drug goes generic. When <Link href="/analysis/top-drugs-analysis">Eliquis (apixaban)</Link> eventually loses patent protection, it could save Medicare billions annually.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">Which Specialties Prescribe the Most Brand-Name Drugs?</h2>
        <p>
          Not all doctors prescribe generics at the same rate. Some specialties have consistently higher brand-name prescribing — sometimes because generic alternatives don&apos;t exist in their therapeutic area, sometimes because of marketing or habit. See our <Link href="/analysis/brand-generic-gap">in-depth brand vs generic gap analysis</Link> for the full breakdown.
        </p>

        {topBrand.length > 0 && (
          <div className="not-prose my-6">
            <table className="w-full text-sm bg-white rounded-xl shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Specialty</th>
                  <th className="px-4 py-2 text-right font-semibold">Avg Brand %</th>
                  <th className="px-4 py-2 text-right font-semibold">Providers</th>
                  <th className="px-4 py-2 text-right font-semibold">Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topBrand.map(s => (
                  <tr key={s.specialty}>
                    <td className="px-4 py-2 font-medium">{s.specialty}</td>
                    <td className="px-4 py-2 text-right font-mono text-amber-600 font-semibold">{(s.avgBrandPct ?? 0).toFixed(1)}%</td>
                    <td className="px-4 py-2 text-right font-mono text-gray-500">{fmt(s.providers)}</td>
                    <td className="px-4 py-2 text-right font-mono">{fmtMoney(s.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h2 className="font-[family-name:var(--font-heading)]">The GLP-1 Exception: Expensive Drugs Without Generic Options</h2>
        <p>
          The biggest gap in the generic landscape is <Link href="/analysis/ozempic-medicare-cost">GLP-1 drugs like Ozempic and Mounjaro</Link>. These are mass-market drugs used by millions of patients, but they have no generic or biosimilar competition — and won&apos;t until 2031 at the earliest. At $1,000+ per month, they represent the largest category of brand-only drugs in Medicare by total spending.
        </p>
        <p>
          Unlike traditional small-molecule drugs where generics can enter once patents expire, GLP-1 drugs are injectable peptides that require expensive manufacturing and separate clinical trials to produce biosimilar versions. This gives their manufacturers — Novo Nordisk and Eli Lilly — effectively unchallenged pricing power for years to come.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">How to Save Money: Practical Steps</h2>
        <div className="not-prose bg-green-50 border border-green-200 rounded-xl p-6 my-6">
          <p className="font-semibold text-green-800 mb-3">💰 Tips for Reducing Your Prescription Costs</p>
          <ul className="space-y-2 text-sm text-green-800">
            <li>• <strong>Ask for the generic:</strong> Always ask your doctor or pharmacist if a generic version is available. Most states allow automatic substitution.</li>
            <li>• <strong>Use our drug lookup:</strong> <Link href="/tools/drug-lookup" className="text-primary hover:underline">Search any drug</Link> to see cost data and compare options.</li>
            <li>• <strong>Compare pharmacies:</strong> Prices can vary 2-5x between pharmacies for the same generic drug.</li>
            <li>• <strong>Check the $2,000 cap:</strong> Medicare Part D now caps out-of-pocket costs at $2,000/year. If you take expensive medications, you benefit from this cap.</li>
            <li>• <strong>Review IRA-negotiated drugs:</strong> <Link href="/ira-negotiation" className="text-primary hover:underline">10 drugs now have Medicare-negotiated prices</Link> that could reduce your costs.</li>
            <li>• <strong>Use savings calculators:</strong> Our <Link href="/tools/savings-calculator" className="text-primary hover:underline">savings calculator</Link> estimates how much you could save by switching to generics.</li>
          </ul>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">2026 Changes Affecting Generic vs. Brand Costs</h2>
        <ul>
          <li><strong>IRA Drug Negotiations:</strong> The Inflation Reduction Act&apos;s first batch of 10 negotiated drugs now have lower Medicare prices. This narrows the gap between some brand drugs and their eventual generics.</li>
          <li><strong>Biosimilar Pipeline:</strong> New biosimilar versions of expensive biologics are entering the market, offering 15-40% savings over originator brands.</li>
          <li><strong>$2,000 Out-of-Pocket Cap:</strong> The new annual cap protects patients from catastrophic costs, particularly for those taking expensive brand-name drugs without generic alternatives.</li>
          <li><strong>Patent Cliffs:</strong> Several major brand drugs are approaching patent expiration, which will create new generic opportunities and significant cost reductions.</li>
        </ul>

        <h2 className="font-[family-name:var(--font-heading)]">The Medicare Savings Opportunity</h2>
        <p>
          Our <Link href="/analysis/medicare-waste">Medicare waste analysis</Link> estimates that unnecessary brand-name prescribing costs taxpayers billions annually. If every provider switched to generics where available, Medicare could save enough to fund significant program improvements — without reducing access to any medication.
        </p>
        <p>
          The good news: generic adoption rates have been steadily increasing. The bad news: the fastest-growing drug categories (GLP-1s, specialty biologics) don&apos;t have generic alternatives, meaning the overall cost picture keeps worsening even as generic adoption improves for older drug classes.
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
            <Link href="/analysis/brand-generic-gap" className="text-sm text-primary hover:underline">📊 Brand vs Generic Gap (Medicare Data)</Link>
            <Link href="/analysis/generic-adoption" className="text-sm text-primary hover:underline">📈 Generic Adoption Trends</Link>
            <Link href="/analysis/most-prescribed-drugs-america-2026" className="text-sm text-primary hover:underline">💊 Most Prescribed Drugs 2026</Link>
            <Link href="/analysis/ozempic-medicare-cost" className="text-sm text-primary hover:underline">💉 Ozempic Medicare Costs</Link>
            <Link href="/tools/savings-calculator" className="text-sm text-primary hover:underline">🧮 Savings Calculator</Link>
            <Link href="/analysis/medicare-drug-costs-2026" className="text-sm text-primary hover:underline">💰 Medicare Drug Costs 2026</Link>
          </div>
        </div>
        <RelatedAnalysis current={`/analysis/${slug}`} />
      </div>
    </div>
  )
}
