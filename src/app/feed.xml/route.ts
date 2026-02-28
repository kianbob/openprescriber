const articles = [
  { slug: 'opioid-crisis', title: 'The Opioid Prescribing Crisis in Medicare Part D', date: '2026-02-27' },
  { slug: 'cost-outliers', title: 'Cost Outliers: Providers Prescribing the Most Expensive Drugs', date: '2026-02-27' },
  { slug: 'brand-generic-gap', title: 'Brand vs Generic: The Prescribing Gap That Costs Billions', date: '2026-02-27' },
  { slug: 'opioid-hotspots', title: 'Opioid Hotspots: Which States Have the Highest Prescribing Rates?', date: '2026-02-27' },
  { slug: 'excluded-still-prescribing', title: 'Excluded But Still Prescribing: LEIE Providers in Medicare', date: '2026-02-27' },
  { slug: 'antipsychotic-elderly', title: 'Antipsychotic Prescribing to Elderly Medicare Patients', date: '2026-02-27' },
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
  </channel>
</rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
