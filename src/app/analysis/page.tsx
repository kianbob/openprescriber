import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Analysis — Medicare Part D Research & Insights',
  description: 'Data-driven analysis of Medicare Part D prescribing patterns — opioid crisis, cost outliers, brand vs generic, geographic variation.',
  alternates: { canonical: 'https://www.openprescriber.org/analysis' },
}

const articles = [
  { title: 'The Medicare Opioid Crisis in Numbers', slug: 'opioid-crisis', desc: 'One in three Medicare prescribers write opioid prescriptions. We mapped the geographic and specialty hotspots.', emoji: '💊' },
  { title: 'Who Are the Highest-Cost Prescribers?', slug: 'cost-outliers', desc: 'Some providers generate millions in drug costs. What drives the spending?', emoji: '💰' },
  { title: 'Brand vs Generic: The Billion-Dollar Gap', slug: 'brand-generic-gap', desc: 'Generic drugs could save Medicare billions more. Which specialties resist the switch?', emoji: '🏷️' },
  { title: 'Geographic Hotspots for Opioid Prescribing', slug: 'opioid-hotspots', desc: 'State-by-state analysis reveals persistent geographic patterns in opioid prescribing.', emoji: '🗺️' },
  { title: 'Excluded but Still Prescribing', slug: 'excluded-still-prescribing', desc: 'We found 372 providers on the OIG exclusion list who appear in active Medicare prescribing data.', emoji: '🚫' },
  { title: 'The Antipsychotic Problem in Elderly Care', slug: 'antipsychotic-elderly', desc: 'Why CMS tracks antipsychotic prescribing to patients 65+ and what the data shows.', emoji: '⚠️' },
  { title: 'The $275 Billion Explosion: 5 Years of Medicare Drug Cost Growth', slug: 'prescribing-trends', desc: 'Medicare Part D drug costs surged 50% from $183B to $275.6B in five years. What\'s driving the explosion?', emoji: '📈' },
  { title: 'Which Medical Specialties Drive the Most Drug Spending?', slug: 'specialty-deep-dive', desc: 'From oncologists generating millions to primary care\'s aggregate impact — specialty prescribing patterns revealed.', emoji: '🩺' },
  { title: 'Geographic Disparities in Medicare Prescribing', slug: 'geographic-disparities', desc: 'State-level spending and opioid variations reveal a 3x cost gap and persistent rural-urban divides.', emoji: '🌎' },
  { title: 'The Drugs That Cost Medicare Billions', slug: 'top-drugs-analysis', desc: 'Eliquis: $7.75B. Ozempic: $4.3B. The top 20 drugs consume 22% of all Part D spending.', emoji: '💊' },
  { title: 'How We Score Prescribing Risk', slug: 'fraud-risk-methodology', desc: 'Our 10-component model plus ML fraud detection: specialty-adjusted z-scores, drug combinations, OIG matching, and machine learning.', emoji: '🔍' },
  { title: 'Where Does $275.6 Billion Go?', slug: 'medicare-drug-spending', desc: 'The big picture of Medicare Part D spending — who pays, where it flows, and policy implications.', emoji: '🏛️' },
]

export default function AnalysisPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Analysis' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Analysis & Research</h1>
      <p className="text-gray-600 mb-8">Data-driven investigations into Medicare Part D prescribing patterns.</p>

      <div className="space-y-4">
        {articles.map(a => (
          <Link key={a.slug} href={`/analysis/${a.slug}`} className="block bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all">
            <div className="flex items-start gap-4">
              <span className="text-3xl">{a.emoji}</span>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{a.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{a.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
