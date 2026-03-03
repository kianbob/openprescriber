import Link from 'next/link'

const articles = [
  { href: '/analysis/opioid-crisis', title: 'The Opioid Prescribing Crisis in Medicare', tag: 'Opioids' },
  { href: '/analysis/opioid-hotspots', title: 'Geographic Opioid Hotspots', tag: 'Opioids' },
  { href: '/analysis/pill-mills', title: 'Anatomy of a Pill Mill', tag: 'Opioids' },
  { href: '/analysis/cost-outliers', title: 'Cost Outlier Providers', tag: 'Cost' },
  { href: '/analysis/brand-generic-gap', title: 'The Brand vs Generic Gap', tag: 'Cost' },
  { href: '/analysis/ozempic-effect', title: 'The Ozempic Effect: GLP-1 Drugs', tag: 'Drugs' },
  { href: '/analysis/nurse-practitioners', title: 'NPs: The Most Flagged Group', tag: 'Specialty' },
  { href: '/analysis/fraud-risk-methodology', title: 'How We Score Fraud Risk', tag: 'Methodology' },
  { href: '/analysis/excluded-still-prescribing', title: 'Excluded Providers Still Prescribing', tag: 'Fraud' },
  { href: '/analysis/antipsychotic-elderly', title: 'Antipsychotic Use in the Elderly', tag: 'Risk' },
  { href: '/analysis/geographic-disparities', title: 'Geographic Prescribing Disparities', tag: 'Geography' },
  { href: '/analysis/prescribing-trends', title: '5-Year Prescribing Trends', tag: 'Trends' },
  { href: '/analysis/specialty-deep-dive', title: 'Specialty Prescribing Deep Dive', tag: 'Specialty' },
  { href: '/analysis/top-drugs-analysis', title: 'The Most Expensive Drugs in Medicare', tag: 'Drugs' },
  { href: '/analysis/medicare-drug-spending', title: 'Medicare Drug Spending Explainer', tag: 'Cost' },
  { href: '/analysis/state-of-prescribing', title: '2023 Report Card', tag: 'Annual' },
  { href: '/analysis/rural-prescribing', title: 'Rural Prescribing Problem', tag: 'Geography' },
  { href: '/analysis/polypharmacy', title: 'The Polypharmacy Problem', tag: 'Risk' },
  { href: '/analysis/state-rankings', title: 'State-by-State Prescribing Rankings', tag: 'Geography' },
  { href: '/analysis/telehealth-prescribing', title: 'How Telehealth Changed Prescribing', tag: 'Trends' },
  { href: '/analysis/pharmacy-benefit-managers', title: 'The PBM Middlemen Problem', tag: 'Cost' },
  { href: '/analysis/most-expensive-prescribers', title: 'Most Expensive Prescribers', tag: 'Cost' },
  { href: '/analysis/generic-adoption', title: 'The Generic Adoption Gap', tag: 'Drugs' },
  { href: '/analysis/controlled-substance-pipeline', title: 'Controlled Substance Pipeline', tag: 'Opioids' },
  { href: '/analysis/medicare-waste', title: 'How Much Medicare Part D Waste?', tag: 'Fraud' },
  { href: '/analysis/doctor-shopping', title: 'Doctor Shopping in Medicare', tag: 'Fraud' },
  { href: '/analysis/medicare-spending-by-state', title: 'Medicare Spending by State', tag: 'Geography' },
  { href: '/analysis/most-prescribed-drugs', title: 'The 50 Most Prescribed Drugs', tag: 'Drugs' },
  { href: '/analysis/pharmacy-fraud', title: 'Pharmacy Fraud Detection', tag: 'Fraud' },
  { href: '/analysis/160-million-prescriber', title: 'The $160 Million Prescriber', tag: 'Investigation' },
]

export default function RelatedAnalysis({ current }: { current: string }) {
  const currentArticle = articles.find(a => a.href === current)
  const others = articles.filter(a => a.href !== current)
  // Prefer same-tag articles first, then fill with others
  const sameTag = currentArticle ? others.filter(a => a.tag === currentArticle.tag) : []
  const diffTag = others.filter(a => !sameTag.includes(a))
  const related = [...sameTag, ...diffTag].slice(0, 4)
  return (
    <section className="mt-10 bg-gray-50 rounded-xl p-6 border">
      <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-4">Related Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {related.map(a => (
          <Link key={a.href} href={a.href} className="bg-white rounded-lg p-3 border hover:shadow-sm hover:border-primary/30 transition-all">
            <span className="text-xs bg-blue-100 text-primary px-2 py-0.5 rounded-full">{a.tag}</span>
            <p className="text-sm font-medium text-gray-800 mt-1">{a.title}</p>
          </Link>
        ))}
      </div>
      <Link href="/analysis" className="text-sm text-primary hover:underline mt-3 inline-block">View all analysis →</Link>
    </section>
  )
}
