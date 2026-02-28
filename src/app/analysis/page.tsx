import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Analysis — Medicare Part D Research & Insights',
  description: 'Data-driven analysis of Medicare Part D prescribing patterns — opioid crisis, cost outliers, brand vs generic, geographic variation.',
  alternates: { canonical: 'https://www.openprescriber.org/analysis' },
}

const categories: { heading: string; articles: { title: string; slug: string; desc: string; emoji: string }[] }[] = [
  {
    heading: 'Opioid Crisis',
    articles: [
      { title: 'The Medicare Opioid Crisis in Numbers', slug: 'opioid-crisis', desc: 'One in three Medicare prescribers write opioid prescriptions. We mapped the geographic and specialty hotspots.', emoji: '💊' },
      { title: 'Geographic Hotspots for Opioid Prescribing', slug: 'opioid-hotspots', desc: 'State-by-state analysis reveals persistent geographic patterns in opioid prescribing.', emoji: '🗺️' },
      { title: 'Anatomy of a Pill Mill', slug: 'pill-mills', desc: 'What does a pill mill look like in Medicare data? The statistical fingerprints of high-risk opioid prescribers.', emoji: '🏭' },
      { title: 'Nurse Practitioners: The Most Flagged Prescriber Group', slug: 'nurse-practitioners', desc: 'NPs are 19% of prescribers but 49% of flagged providers. What structural factors drive this disproportionate risk signal?', emoji: '👩‍⚕️' },
    ],
  },
  {
    heading: 'Spending & Costs',
    articles: [
      { title: 'Who Are the Highest-Cost Prescribers?', slug: 'cost-outliers', desc: 'Some providers generate millions in drug costs. What drives the spending?', emoji: '💰' },
      { title: 'The Ozempic Effect: GLP-1 Drugs Reshaping Medicare', slug: 'ozempic-effect', desc: 'GLP-1 drugs now cost Medicare $8.4 billion annually — tripling since 2019. The fastest-growing drug category analyzed.', emoji: '💉' },
      { title: 'The Drugs That Cost Medicare Billions', slug: 'top-drugs-analysis', desc: 'Eliquis: $7.75B. Ozempic: $4.3B. The top 20 drugs consume 22% of all Part D spending.', emoji: '💊' },
      { title: 'Where Does $275.6 Billion Go?', slug: 'medicare-drug-spending', desc: 'The big picture of Medicare Part D spending — who pays, where it flows, and policy implications.', emoji: '🏛️' },
      { title: 'The $275 Billion Explosion: 5 Years of Medicare Drug Cost Growth', slug: 'prescribing-trends', desc: 'Medicare Part D drug costs surged 50% from $183B to $275.6B in five years. What\'s driving the explosion?', emoji: '📈' },
    ],
  },
  {
    heading: 'Fraud & Risk',
    articles: [
      { title: 'How We Score Prescribing Risk', slug: 'fraud-risk-methodology', desc: 'Our 10-component model plus ML fraud detection: specialty-adjusted z-scores, drug combinations, OIG matching, and machine learning.', emoji: '🔍' },
      { title: 'Excluded but Still Prescribing', slug: 'excluded-still-prescribing', desc: 'We found 372 providers on the OIG exclusion list who appear in active Medicare prescribing data.', emoji: '🚫' },
    ],
  },
  {
    heading: 'Geographic & Demographics',
    articles: [
      { title: 'Geographic Disparities in Medicare Prescribing', slug: 'geographic-disparities', desc: 'State-level spending and opioid variations reveal a 3x cost gap and persistent rural-urban divides.', emoji: '🌎' },
      { title: 'Rural America\'s Prescribing Problem', slug: 'rural-prescribing', desc: 'Rural providers have higher opioid rates, fewer generics, and higher per-patient costs. The urban-rural prescribing divide.', emoji: '🌾' },
      { title: 'The State of Prescribing: 2023 Report Card', slug: 'state-of-prescribing', desc: '10 key findings from 1.38 million prescribers and $275.6 billion in drug costs. The annual data report card.', emoji: '📋' },
    ],
  },
  {
    heading: 'Clinical Patterns',
    articles: [
      { title: 'Which Medical Specialties Drive the Most Drug Spending?', slug: 'specialty-deep-dive', desc: 'From oncologists generating millions to primary care\'s aggregate impact — specialty prescribing patterns revealed.', emoji: '🩺' },
      { title: 'The Polypharmacy Problem', slug: 'polypharmacy', desc: 'Medicare patients fill 31+ prescriptions per year on average. When too many drugs meet too little coordination.', emoji: '💊' },
      { title: 'Dangerous Drug Combinations', slug: 'dangerous-combinations', desc: 'Opioid + benzodiazepine co-prescribing and other high-risk drug combinations in Medicare data.', emoji: '⚠️' },
    ],
  },
]

export default function AnalysisPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
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
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{a.emoji}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{a.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{a.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
