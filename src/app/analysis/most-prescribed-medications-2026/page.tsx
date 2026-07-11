import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ArticleSchema from '@/components/ArticleSchema'
import ShareButtons from '@/components/ShareButtons'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import RelatedAnalysis from '@/components/RelatedAnalysis'
import FAQSchema from '@/components/FAQSchema'
import { fmtMoney, fmt, slugify } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

const title = 'Most Prescribed Medications in America 2026: The Complete Guide'
const description = 'The most commonly prescribed medications in the United States in 2026 — ranked by Medicare Part D claims data, with costs, trends, and what they reveal about American health.'
const slug = 'most-prescribed-medications-2026'
const canonical = `https://www.openprescriber.org/analysis/${slug}`

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: canonical, type: 'article' },
  alternates: { canonical },
}

export default function MostPrescribedMedications2026Page() {
  const drugs = loadData('drugs.json') as {
    generic: string; brand: string; claims: number; cost: number
    benes: number; providers: number; fills: number; costPerClaim: number
  }[]

  const byClaims = [...drugs].sort((a, b) => (b.claims ?? 0) - (a.claims ?? 0))
  const top20 = byClaims.slice(0, 20)
  const totalClaimsTop20 = top20.reduce((s, d) => s + (d.claims ?? 0), 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema title={title} description={description} slug={slug} date="2026-06-03" />
      <FAQSchema faqs={[
        { question: 'What is the most prescribed medication in America?', answer: 'Atorvastatin (generic Lipitor) is the most prescribed medication in America, with tens of millions of Medicare Part D claims annually. It is a statin used to lower cholesterol and prevent heart disease.' },
        { question: 'How many prescriptions are filled in the US each year?', answer: 'Approximately 6.7 billion prescriptions are filled annually in the United States. Medicare Part D alone accounts for over 1 billion claims per year.' },
        { question: 'What are the most prescribed drug categories?', answer: 'Cardiovascular medications (statins, blood pressure drugs, blood thinners) are the most prescribed category, followed by diabetes drugs, thyroid medications, and gastrointestinal treatments.' },
      ]} />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Most Prescribed Medications 2026' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">{title}</h1>
      <ShareButtons title={title} />
      <DisclaimerBanner />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          What medications do Americans take the most? The answer reveals as much about our collective health challenges as any epidemiological study. Using Medicare Part D prescribing data covering 1.38 million providers and over a billion claims, we&apos;ve ranked the most prescribed medications in America — and the results paint a clear picture of a nation managing chronic disease at massive scale.
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmt(totalClaimsTop20)}</p>
            <p className="text-xs text-blue-600">Top 20 Total Claims</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">4,000+</p>
            <p className="text-xs text-blue-600">Unique Drugs in Medicare</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">1.38M</p>
            <p className="text-xs text-blue-600">Prescribers</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">$275.6B</p>
            <p className="text-xs text-blue-600">Total Drug Costs</p>
          </div>
        </div>

        <h2>The Top 20 Most Prescribed Medications</h2>
        <p>
          The medications Americans take most often are overwhelmingly generic, inexpensive, and used for chronic conditions that affect tens of millions of people: high cholesterol, high blood pressure, diabetes, acid reflux, thyroid disorders, and pain.
        </p>

        <div className="not-prose my-6">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">#</th>
                <th className="px-3 py-2 text-left font-semibold">Drug</th>
                <th className="px-3 py-2 text-right font-semibold">Claims</th>
                <th className="px-3 py-2 text-right font-semibold">Cost/Claim</th>
                <th className="px-3 py-2 text-right font-semibold">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {top20.map((d, i) => (
                <tr key={d.generic}>
                  <td className="px-3 py-2 text-gray-400 font-mono">{i + 1}</td>
                  <td className="px-3 py-2">
                    <Link href={`/drugs/${slugify(d.generic)}`} className="text-primary hover:underline font-medium">{d.generic}</Link>
                    {d.brand && <span className="text-xs text-gray-400 ml-1">({d.brand})</span>}
                  </td>
                  <td className="px-3 py-2 text-right font-mono">{fmt(d.claims)}</td>
                  <td className="px-3 py-2 text-right font-mono">{fmtMoney(d.costPerClaim)}</td>
                  <td className="px-3 py-2 text-right font-mono font-semibold">{fmtMoney(d.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>What the Top Medications Tell Us About American Health</h2>
        <p>
          The most prescribed medications in America aren&apos;t exotic specialty drugs or cutting-edge biologics. They&apos;re the workhorses of chronic disease management — and their dominance tells a story about the health challenges facing 65+ million Medicare beneficiaries and the broader U.S. population.
        </p>

        <h3>Cardiovascular Disease Dominates</h3>
        <p>
          Statins (atorvastatin, rosuvastatin, simvastatin), blood pressure medications (lisinopril, amlodipine, losartan, metoprolol), and blood thinners (apixaban/Eliquis, warfarin) collectively make up the largest share of the most-prescribed list. Heart disease remains the leading cause of death in the United States, and these medications are the frontline defense for tens of millions of patients.
        </p>
        <p>
          <Link href="/drugs/atorvastatin">Atorvastatin</Link> (brand name Lipitor) typically ranks as the single most-prescribed drug in Medicare, with tens of millions of claims annually. At roughly $2-5 per claim as a generic, it&apos;s also among the cheapest — a remarkable contrast to drugs like <Link href="/analysis/ozempic-effect">Ozempic</Link>, which costs hundreds per fill but ranks much lower by claim volume.
        </p>

        <h3>Diabetes: A Growing Epidemic</h3>
        <p>
          Metformin, the first-line treatment for Type 2 diabetes, consistently appears in the top 5 most-prescribed medications. Combined with newer diabetes drugs like Jardiance and the GLP-1 class, diabetes medications represent one of Medicare&apos;s largest therapeutic categories. Over 30% of Medicare beneficiaries have diabetes, making it the single most common chronic condition in the program.
        </p>
        <p>
          The cost contrast within diabetes drugs is striking: metformin costs roughly $3 per claim, while newer brand-name options like Ozempic or Mounjaro can exceed $800. Our <Link href="/analysis/brand-generic-gap">brand vs generic gap analysis</Link> explores this divide in depth.
        </p>

        <h3>Mental Health and Pain</h3>
        <p>
          Gabapentin, sertraline, and other medications for pain, anxiety, and depression rank consistently high. Gabapentin in particular has seen significant scrutiny — originally approved for seizures, it&apos;s now one of the most-prescribed medications in America, used off-label for nerve pain, anxiety, and increasingly as an opioid alternative. Our data shows it appears in prescribing patterns of providers across virtually every specialty.
        </p>
        <p>
          The presence of <Link href="/analysis/opioid-crisis">opioid medications</Link> in the broader prescribing landscape has declined significantly from its peak, though hydrocodone and oxycodone combinations still generate millions of claims annually. Our <Link href="/analysis/opioid-hotspots">geographic opioid hotspot analysis</Link> tracks where opioid prescribing remains elevated.
        </p>

        <h3>Thyroid and Acid Reflux</h3>
        <p>
          Levothyroxine (for hypothyroidism) and omeprazole/pantoprazole (proton pump inhibitors for acid reflux) round out the most commonly prescribed categories. An estimated 20 million Americans take thyroid medication, and PPIs are among the most widely used drug classes globally.
        </p>

        <h2>Most Prescribed vs. Most Expensive: Two Different Lists</h2>
        <p>
          There&apos;s a critical distinction between the drugs prescribed most <em>often</em> and the drugs that <em>cost</em> the most. The top 20 by claim volume are mostly cheap generics — the backbone of chronic disease management. The top 20 by cost are dominated by expensive brand-name specialty drugs.
        </p>
        <p>
          For example, Eliquis (apixaban) is both highly prescribed <em>and</em> expensive — the rare drug that appears near the top of both lists. At $7.75 billion in annual Medicare costs, it&apos;s the <Link href="/analysis/top-drugs-analysis">single most expensive drug in Part D</Link>. But most top-prescribed drugs like atorvastatin and metformin barely register on the cost list because they&apos;re so cheap per fill.
        </p>
        <p>
          This disconnect matters for policy. Efforts to reduce Medicare drug spending need to target the cost list (expensive specialty drugs, brand holdouts), not the volume list (cheap generics that are already cost-effective). See our <Link href="/analysis/medicare-drug-costs-2026">2026 Medicare drug costs guide</Link> for how the IRA&apos;s drug negotiations are addressing this.
        </p>

        <h2>How Prescribing Patterns Vary</h2>
        <p>
          The most-prescribed medications nationally don&apos;t necessarily match local patterns. Prescribing varies significantly by:
        </p>
        <ul>
          <li><strong>Geography</strong> — <Link href="/analysis/geographic-disparities">Southern and rural states</Link> tend to have higher rates of cardiovascular and diabetes medications, reflecting higher disease prevalence</li>
          <li><strong>Specialty</strong> — <Link href="/analysis/specialty-deep-dive">Different medical specialties</Link> have radically different prescribing profiles. A cardiologist&apos;s top drugs look nothing like a psychiatrist&apos;s.</li>
          <li><strong>Provider type</strong> — <Link href="/analysis/nurse-practitioners">Nurse practitioners</Link> and physician assistants have distinct prescribing patterns compared to physicians</li>
          <li><strong>Urban vs. rural</strong> — <Link href="/analysis/rural-prescribing">Rural providers</Link> prescribe more opioids and fewer generics on average</li>
        </ul>
        <p>
          Use our <Link href="/tools/drug-lookup">drug lookup tool</Link> to search any medication and see detailed prescribing statistics, or explore <Link href="/tools/city-lookup">prescribing patterns by city</Link>.
        </p>

        <h2>2026 Trends to Watch</h2>
        <p>
          Several shifts are reshaping what Americans are prescribed most:
        </p>
        <ul>
          <li><strong>GLP-1 surge</strong> — Ozempic, Wegovy, Mounjaro, and Zepbound are climbing the volume charts rapidly. If Part D expands obesity coverage, GLP-1 drugs could enter the top 20 by claims within 2-3 years.</li>
          <li><strong>Generic Eliquis</strong> — Patent expirations for major brand drugs continue to shift the landscape. When Eliquis eventually goes generic, it will dramatically change the cost picture.</li>
          <li><strong>Biosimilars</strong> — Cheaper alternatives to expensive biologics are gaining market share, though adoption remains slower than generic drugs.</li>
          <li><strong>IRA negotiation impact</strong> — The <Link href="/ira-negotiation">first 10 negotiated drugs</Link> now have lower prices, potentially shifting prescribing toward negotiated alternatives.</li>
        </ul>

        <h2>Explore the Data Yourself</h2>
        <p>
          Our database covers every drug prescribed under Medicare Part D. Search by drug name, compare costs across providers, and see how prescribing patterns vary across the country:
        </p>
        <ul>
          <li><Link href="/drugs">Browse all 4,000+ drugs</Link> in the Medicare Part D database</li>
          <li><Link href="/analysis/most-prescribed-drugs">See the full top 50 most prescribed drugs</Link> with detailed cost breakdowns</li>
          <li><Link href="/tools/drug-lookup">Drug lookup tool</Link> — search any medication</li>
          <li><Link href="/tools/compare">Compare drugs</Link> side by side</li>
          <li><Link href="/providers">Search prescribers</Link> to see what individual doctors prescribe</li>
        </ul>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-blue-800">Full drug rankings: <Link href="/analysis/most-prescribed-drugs" className="text-primary font-medium hover:underline">Top 50 Most Prescribed Drugs in Medicare →</Link></p>
          <p className="text-sm text-blue-800">Cost analysis: <Link href="/analysis/medicare-drug-costs-2026" className="text-primary font-medium hover:underline">Medicare Drug Costs 2026 →</Link></p>
          <p className="text-sm text-blue-800">The expensive list: <Link href="/analysis/top-drugs-analysis" className="text-primary font-medium hover:underline">The Drugs That Cost Medicare Billions →</Link></p>
        </div>

        <RelatedAnalysis current={`/analysis/${slug}`} />
      </div>
    </div>
  )
}
