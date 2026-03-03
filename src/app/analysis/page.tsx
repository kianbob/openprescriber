import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Analysis — Medicare Part D Research & Insights',
  description: 'Data-driven analysis of Medicare Part D prescribing patterns — opioid crisis, cost outliers, brand vs generic, geographic variation.',
  alternates: { canonical: 'https://www.openprescriber.org/analysis' },
}

const categories: { heading: string; articles: { title: string; slug: string; desc: string }[] }[] = [
  {
    heading: 'Opioid Crisis',
    articles: [
      { title: 'The Medicare Opioid Crisis in Numbers', slug: 'opioid-crisis', desc: 'One in three Medicare prescribers write opioid prescriptions. We mapped the geographic and specialty hotspots.' },
      { title: 'Geographic Hotspots for Opioid Prescribing', slug: 'opioid-hotspots', desc: 'State-by-state analysis reveals persistent geographic patterns in opioid prescribing.' },
      { title: 'Anatomy of a Pill Mill', slug: 'pill-mills', desc: 'What does a pill mill look like in Medicare data? The statistical fingerprints of high-risk opioid prescribers.' },
      { title: 'Nurse Practitioners: The Most Flagged Prescriber Group', slug: 'nurse-practitioners', desc: 'NPs are 19% of prescribers but 49% of flagged providers. What structural factors drive this disproportionate risk signal?' },
      { title: 'The Controlled Substance Pipeline: Beyond Opioids', slug: 'controlled-substance-pipeline', desc: 'Benzodiazepines, stimulants, gabapentin — the broader controlled substance prescribing picture and multi-category risk.' },
      { title: 'How Telehealth Changed Prescribing Patterns', slug: 'telehealth-prescribing', desc: 'Remote prescribing of controlled substances, DEA waivers, and the risks of prescriber shopping via telehealth.' },
    ],
  },
  {
    heading: 'Spending & Costs',
    articles: [
      { title: 'Who Are the Highest-Cost Prescribers?', slug: 'cost-outliers', desc: 'Some providers generate millions in drug costs. What drives the spending?' },
      { title: 'The $160 Million Prescriber', slug: '160-million-prescriber', desc: 'One ER doctor in California generated $160.3M in Medicare drug costs — more than any other provider. We investigated why.' },
      { title: 'The Most Expensive Prescribers in Medicare', slug: 'most-expensive-prescribers', desc: 'Deep dive into the top 100 prescribers by total cost. Who are they, what specialties, and is their spending justified?' },
      { title: 'The Ozempic Effect: GLP-1 Drugs Reshaping Medicare', slug: 'ozempic-effect', desc: 'GLP-1 drugs now cost Medicare $8.4 billion annually — tripling since 2019. The fastest-growing drug category analyzed.' },
      { title: 'The Drugs That Cost Medicare Billions', slug: 'top-drugs-analysis', desc: 'Eliquis: $7.75B. Ozempic: $4.3B. The top 20 drugs consume 22% of all Part D spending.' },
      { title: 'Pharmacy Benefit Managers: The Middlemen Problem', slug: 'pharmacy-benefit-managers', desc: 'How PBMs control drug pricing through spread pricing, rebate clawbacks, and formulary manipulation.' },
      { title: 'Why Doctors Still Prescribe Brands When Generics Exist', slug: 'generic-adoption', desc: 'Brand loyalty, pharma marketing, and specialty variation in generic drug adoption.' },
      { title: 'Where Does $275.6 Billion Go?', slug: 'medicare-drug-spending', desc: 'The big picture of Medicare Part D spending — who pays, where it flows, and policy implications.' },
      { title: 'The $275 Billion Explosion: 5 Years of Medicare Drug Cost Growth', slug: 'prescribing-trends', desc: 'Medicare Part D drug costs surged 50% from $183B to $275.6B in five years. What\'s driving the explosion?' },
      { title: 'The 50 Most Prescribed Drugs in Medicare Part D', slug: 'most-prescribed-drugs', desc: 'Ranked by claims count — the most commonly prescribed drugs in Medicare, with cost-per-claim and provider data.' },
    ],
  },
  {
    heading: 'Fraud & Risk',
    articles: [
      { title: 'How We Score Prescribing Risk', slug: 'fraud-risk-methodology', desc: 'Our 10-component model plus ML fraud detection: specialty-adjusted z-scores, drug combinations, OIG matching, and machine learning.' },
      { title: 'Excluded but Still Prescribing', slug: 'excluded-still-prescribing', desc: 'We found 372 providers on the OIG exclusion list who appear in active Medicare prescribing data.' },
      { title: 'How Much Medicare Part D Waste?', slug: 'medicare-waste', desc: 'A data-driven estimate of Medicare waste from brand overprescribing, excluded providers, cost outliers, and opioid excess.' },
      { title: 'Pharmacy Fraud in Medicare: How We Detect It', slug: 'pharmacy-fraud', desc: 'Our multi-layered fraud detection approach using ML, statistical analysis, and OIG exclusion matching.' },
      { title: 'Doctor Shopping in Medicare Part D', slug: 'doctor-shopping', desc: 'The data behind multi-provider prescribing — opioid rate outliers, cost-per-beneficiary extremes, and co-prescribing red flags.' },
    ],
  },
  {
    heading: 'Geographic & Demographics',
    articles: [
      { title: 'Geographic Disparities in Medicare Prescribing', slug: 'geographic-disparities', desc: 'State-level spending and opioid variations reveal a 3x cost gap and persistent rural-urban divides.' },
      { title: 'Rural America\'s Prescribing Problem', slug: 'rural-prescribing', desc: 'Rural providers have higher opioid rates, fewer generics, and higher per-patient costs. The urban-rural prescribing divide.' },
      { title: 'The State of Prescribing: 2023 Report Card', slug: 'state-of-prescribing', desc: '10 key findings from 1.38 million prescribers and $275.6 billion in drug costs. The annual data report card.' },
      { title: 'State Rankings: The Best and Worst of Medicare Prescribing', slug: 'state-rankings', desc: 'Ranking all 50 states by opioid rates, drug costs, risk scores, and brand prescribing.' },
      { title: 'Medicare Part D Spending by State', slug: 'medicare-spending-by-state', desc: 'State-by-state rankings of total cost, per-capita cost, cost growth, and opioid spending.' },
    ],
  },
  {
    heading: 'Clinical Patterns',
    articles: [
      { title: 'Which Medical Specialties Drive the Most Drug Spending?', slug: 'specialty-deep-dive', desc: 'From oncologists generating millions to primary care\'s aggregate impact — specialty prescribing patterns revealed.' },
      { title: 'The Polypharmacy Problem', slug: 'polypharmacy', desc: 'Medicare patients fill 31+ prescriptions per year on average. When too many drugs meet too little coordination.' },
      { title: 'Brand vs Generic: The $130 Billion Gap', slug: 'brand-generic-gap', desc: 'Brand-name drugs cost 10x more on average. Which providers and specialties resist generics?' },
      { title: 'Antipsychotics in the Elderly', slug: 'antipsychotic-elderly', desc: 'Off-label antipsychotic use in nursing homes — a pattern linked to excess mortality.' },
    ],
  },
]

export default function AnalysisPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.openprescriber.org' },
            { '@type': 'ListItem', position: 2, name: 'Analysis', item: 'https://www.openprescriber.org/analysis' },
          ],
        }) }}
      />
      <Breadcrumbs items={[{ label: 'Analysis' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Analysis & Research</h1>
      <p className="text-gray-600 mb-4">Data-driven investigations into Medicare Part D prescribing patterns.</p>
      <p className="text-sm text-gray-500 mb-10">
        These articles are based on our analysis of 1.38 million Medicare Part D prescribers and $275.6 billion in drug costs (2023). Each piece uses real CMS data to surface patterns in opioid prescribing, fraud risk, cost outliers, and geographic disparities.
      </p>

      {categories.map(cat => (
        <section key={cat.heading} className="mb-10">
          <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4 border-b pb-2">{cat.heading}</h2>
          <div className="space-y-4">
            {cat.articles.map(a => (
              <Link key={a.slug} href={`/analysis/${a.slug}`} className="block bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all">
                <h3 className="text-lg font-bold text-gray-900">{a.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{a.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
