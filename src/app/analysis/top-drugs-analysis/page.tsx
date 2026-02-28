import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'

export const metadata: Metadata = {
  title: 'The Drugs That Cost Medicare Billions',
  description: 'Eliquis costs Medicare $7.75B annually. Semaglutide: $4.3B. Analysis of the most expensive drugs in Medicare Part D and the concentration of spending.',
  alternates: { canonical: 'https://www.openprescriber.org/analysis/top-drugs-analysis' },
}

export default function TopDrugsAnalysisPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema
        title="The Drugs That Cost Medicare Billions"
        description="Eliquis costs Medicare $7.75B annually. Analysis of the most expensive drugs in Medicare Part D."
        slug="top-drugs-analysis"
        date="2026-02-27"
      />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Top Drugs Analysis' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">The Drugs That Cost Medicare Billions</h1>
      <ShareButtons title="The Drugs That Cost Medicare Billions" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          A handful of drugs account for a staggering share of Medicare Part D spending. In 2023, the single most expensive drug — Eliquis — cost the program $7.75 billion. The top 10 drugs alone consumed more than $40 billion. Understanding which drugs drive spending is essential to understanding where the money goes.
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">$7.75B</p>
            <p className="text-xs text-blue-600">Eliquis (Blood Thinner)</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">$4.3B</p>
            <p className="text-xs text-blue-600">Semaglutide (Ozempic)</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">$3.58B</p>
            <p className="text-xs text-blue-600">Empagliflozin (Jardiance)</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">22%</p>
            <p className="text-xs text-red-600">Top 20 Drugs&apos; Share</p>
          </div>
        </div>

        <h2>The Billion-Dollar Club</h2>
        <p>
          In 2023, at least 25 individual drugs exceeded $1 billion in total Medicare Part D costs. This elite group spans therapeutic categories — from blood thinners and diabetes medications to cancer drugs and immunosuppressants. Together, they represent a concentrated core of spending that dwarfs the thousands of other medications in the formulary.
        </p>
        <p>
          <strong>Eliquis (apixaban)</strong> sits at the top at $7.75 billion. This blood thinner, prescribed to prevent stroke in patients with atrial fibrillation, has been the single most expensive Medicare drug for several years. Its patent protection and lack of generic alternatives (until recently) have kept prices high. It&apos;s also one of the first 10 drugs subject to Medicare price negotiation under the Inflation Reduction Act.
        </p>
        <p>
          <strong>Semaglutide</strong>, marketed as Ozempic for diabetes and Wegovy for weight loss, generated approximately $4.3 billion in Medicare Part D costs in 2023. This represents explosive growth — the drug barely registered in Medicare spending just four years ago. Its effectiveness for blood sugar control and cardiovascular risk reduction has driven massive adoption, but its list price of roughly $900-$1,000 per month makes it one of the most expensive chronic disease medications ever prescribed at scale.
        </p>
        <p>
          <strong>Empagliflozin (Jardiance)</strong>, another diabetes drug with proven cardiovascular and kidney benefits, cost Medicare $3.58 billion. The SGLT2 inhibitor class it belongs to has become a standard of care for type 2 diabetes with heart failure or kidney disease, expanding the eligible patient population significantly.
        </p>

        <h2>Drug Concentration: A System Risk</h2>
        <p>
          The concentration of spending in a small number of drugs creates systemic risk for Medicare. When a single drug costs $7.75 billion, any price increase — even a modest percentage — translates to hundreds of millions in additional spending. Conversely, the introduction of a generic or biosimilar competitor can produce dramatic savings.
        </p>
        <p>
          The top 20 drugs account for roughly 22% of all Medicare Part D spending. The top 100 account for over half. This means that more than 3,000 other drugs in the formulary collectively generate less spending than just 100 products. From a cost-management perspective, the leverage is clear: controlling costs for the most expensive drugs has an outsized impact.
        </p>

        <h2>The Generic Cliff That Wasn&apos;t</h2>
        <p>
          Several blockbuster drugs were expected to face generic competition during this period, but patent strategies and regulatory delays pushed back those timelines. Eliquis, for instance, has been the subject of intense patent litigation, with Bristol-Myers Squibb and Pfizer successfully extending exclusivity beyond initial projections.
        </p>
        <p>
          When generics do arrive, the impact can be transformative. The introduction of generic alternatives to drugs like Humira (adalimumab) showed initial price reductions of 5-10%, with deeper discounts emerging over time as more competitors enter the market. But for many of the current top-cost drugs, meaningful generic competition remains years away.
        </p>

        <h2>Therapeutic Categories Driving Spend</h2>
        <p>
          Beyond individual drugs, several therapeutic categories dominate spending:
        </p>
        <p>
          <strong>Anticoagulants</strong> (blood thinners) represent the single largest category, led by Eliquis and Xarelto. The shift from warfarin — a generic that costs pennies per day — to novel oral anticoagulants costing $15-20 per day has been clinically justified but enormously expensive.
        </p>
        <p>
          <strong>Diabetes medications</strong> represent the fastest-growing category, driven by GLP-1 receptor agonists (semaglutide, dulaglutide) and SGLT2 inhibitors (empagliflozin, dapagliflozin). These newer drugs offer genuine clinical advantages over older generics but at 10-50x the price.
        </p>
        <p>
          <strong>Oncology drugs</strong> are the highest per-prescription cost category, with individual treatments costing $10,000-$20,000 per month. While they affect fewer patients than chronic disease medications, their per-unit costs are extraordinary.
        </p>

        <h2>What Price Negotiation Could Change</h2>
        <p>
          The first round of Medicare drug price negotiation targets 10 high-cost drugs including Eliquis, Jardiance, and Xarelto. CMS estimates that negotiated prices will reduce costs by $6 billion in the first year of implementation (2026). While meaningful, this represents roughly 2% of total Part D spending — a start, not a solution.
        </p>
        <p>
          Future negotiation rounds will cover additional drugs, potentially expanding to 20+ products per year. If sustained, this could fundamentally alter the spending trajectory described in our <Link href="/analysis/prescribing-trends" className="text-primary hover:underline">five-year cost growth analysis</Link>.
        </p>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">Explore drug data: <Link href="/drugs" className="text-primary font-medium hover:underline">Search All Drugs →</Link></p>
        </div>

        <div className="mt-8 text-xs text-gray-400 border-t pt-4">
          <p>Data source: CMS Medicare Part D Prescribers dataset (2023). Drug costs represent total cost to Medicare including ingredient cost, dispensing fees, and sales tax. Individual drug totals aggregated from provider-level prescribing records. This analysis is for informational purposes only and does not constitute medical or legal advice.</p>
        </div>
      </div>
    </div>
  )
}
