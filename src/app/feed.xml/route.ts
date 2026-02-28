const articles = [
  { slug: 'opioid-crisis', title: 'The Opioid Prescribing Crisis in Medicare Part D', date: '2026-02-27' },
  { slug: 'cost-outliers', title: 'Cost Outliers: Providers Prescribing the Most Expensive Drugs', date: '2026-02-27' },
  { slug: 'brand-generic-gap', title: 'Brand vs Generic: The Prescribing Gap That Costs Billions', date: '2026-02-27' },
  { slug: 'opioid-hotspots', title: 'Opioid Hotspots: Which States Have the Highest Prescribing Rates?', date: '2026-02-27' },
  { slug: 'excluded-still-prescribing', title: 'Excluded But Still Prescribing: LEIE Providers in Medicare', date: '2026-02-27' },
  { slug: 'antipsychotic-elderly', title: 'Antipsychotic Prescribing to Elderly Medicare Patients', date: '2026-02-27' },
  { slug: 'prescribing-trends', title: 'The $275 Billion Explosion: 5 Years of Medicare Drug Cost Growth', date: '2026-02-27' },
  { slug: 'specialty-deep-dive', title: 'Which Medical Specialties Drive the Most Drug Spending?', date: '2026-02-27' },
  { slug: 'geographic-disparities', title: 'Geographic Disparities in Medicare Prescribing', date: '2026-02-27' },
  { slug: 'top-drugs-analysis', title: 'The Drugs That Cost Medicare Billions', date: '2026-02-27' },
  { slug: 'fraud-risk-methodology', title: 'How We Score Prescribing Risk', date: '2026-02-27' },
  { slug: 'medicare-drug-spending', title: 'Where Does $275.6 Billion Go? Medicare Part D Spending Explained', date: '2026-02-27' },
  { slug: 'nurse-practitioners', title: 'Nurse Practitioners: The Largest and Most Flagged Prescriber Group', date: '2026-02-28' },
  { slug: 'ozempic-effect', title: 'The Ozempic Effect: How GLP-1 Drugs Are Reshaping Medicare Spending', date: '2026-02-28' },
  { slug: 'pill-mills', title: 'Anatomy of a Pill Mill: What Opioid Data Patterns Reveal', date: '2026-02-28' },
  { slug: 'state-of-prescribing', title: 'The State of Prescribing: 2023 Medicare Part D Report Card', date: '2026-02-28' },
  { slug: 'rural-prescribing', title: 'Rural America\'s Prescribing Problem: Why Small-Town Medicare Costs More', date: '2026-02-28' },
  { slug: 'polypharmacy', title: 'The Polypharmacy Problem: When Medicare Patients Take Too Many Drugs', date: '2026-02-28' },
  { slug: 'state-rankings', title: 'State-by-State Medicare Prescribing Rankings: A Deep Dive', date: '2026-02-28' },
]

// Non-analysis content pages for RSS
const contentPages = [
  { path: '/ml-fraud-detection', title: 'ML Fraud Detection: Machine Learning Identifies Suspicious Prescribers', date: '2026-02-28' },
  { path: '/ira-negotiation', title: 'IRA Drug Price Negotiation: $22 Billion in Medicare Savings', date: '2026-02-27' },
  { path: '/glp1-tracker', title: 'GLP-1 Spending Explosion: Ozempic, Mounjaro & the $8.4B Surge', date: '2026-02-27' },
  { path: '/dangerous-combinations', title: 'Dangerous Drug Combinations: 6,149 Opioid+Benzo Co-Prescribers', date: '2026-02-27' },
  { path: '/taxpayer-cost', title: 'Your Tax Dollar: Medicare Part D Cost Per Taxpayer by State', date: '2026-02-27' },
  { path: '/peer-comparison', title: 'How Does Your Doctor Compare? Specialty-Adjusted Analysis', date: '2026-02-27' },
  { path: '/specialty-profiles', title: 'Specialty Prescribing Profiles: Average Metrics by Medical Specialty', date: '2026-02-27' },
  { path: '/prescription-drug-costs', title: 'Medicare Prescription Drug Costs 2023', date: '2026-02-27' },
  { path: '/medicare-fraud', title: 'Medicare Fraud: How It Works, How We Detect It', date: '2026-02-28' },
  { path: '/opioid-prescribers', title: 'Opioid Prescribers in Medicare Part D: State Rankings', date: '2026-02-28' },
  { path: '/drug-costs', title: 'Medicare Drug Costs: The Most Expensive Drugs in Part D', date: '2026-02-28' },
  { path: '/medicare-part-d', title: 'Medicare Part D: Complete Guide to Prescription Drug Coverage', date: '2026-02-28' },
]

export async function GET() {
  const base = 'https://www.openprescriber.org'
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>OpenPrescriber Analysis</title>
    <link>${base}</link>
    <description>Data-driven analysis of Medicare Part D prescribing patterns, opioid trends, and fraud risk.</description>
    <language>en-us</language>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
    ${articles.map(a => `<item>
      <title>${a.title}</title>
      <link>${base}/analysis/${a.slug}</link>
      <guid>${base}/analysis/${a.slug}</guid>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
    </item>`).join('\n    ')}
    ${contentPages.map(a => `<item>
      <title>${a.title}</title>
      <link>${base}${a.path}</link>
      <guid>${base}${a.path}</guid>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
    </item>`).join('\n    ')}
  </channel>
</rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
