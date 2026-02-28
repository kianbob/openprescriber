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
