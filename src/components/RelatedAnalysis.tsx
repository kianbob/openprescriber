import Link from 'next/link'

const articles = [
  { href: '/analysis/opioid-crisis', title: 'The Opioid Prescribing Crisis in Medicare', tag: 'Opioids' },
  { href: '/analysis/opioid-hotspots', title: 'Geographic Opioid Hotspots', tag: 'Opioids' },
  { href: '/analysis/cost-outliers', title: 'Cost Outlier Providers', tag: 'Cost' },
  { href: '/analysis/brand-generic-gap', title: 'The Brand vs Generic Gap', tag: 'Cost' },
  { href: '/analysis/fraud-risk-methodology', title: 'How We Score Fraud Risk', tag: 'Methodology' },
  { href: '/analysis/excluded-still-prescribing', title: 'Excluded Providers Still Prescribing', tag: 'Fraud' },
  { href: '/analysis/antipsychotic-elderly', title: 'Antipsychotic Use in the Elderly', tag: 'Risk' },
  { href: '/analysis/geographic-disparities', title: 'Geographic Prescribing Disparities', tag: 'Geography' },
  { href: '/analysis/prescribing-trends', title: '5-Year Prescribing Trends', tag: 'Trends' },
  { href: '/analysis/specialty-deep-dive', title: 'Specialty Prescribing Deep Dive', tag: 'Specialty' },
  { href: '/analysis/top-drugs-analysis', title: 'The Most Expensive Drugs in Medicare', tag: 'Drugs' },
  { href: '/analysis/medicare-drug-spending', title: 'Medicare Drug Spending Explainer', tag: 'Cost' },
]

export default function RelatedAnalysis({ current }: { current: string }) {
  const related = articles.filter(a => a.href !== current).slice(0, 4)
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
