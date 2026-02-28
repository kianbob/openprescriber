export async function GET() {
  const base = 'https://www.openprescriber.org'
  const pages = [
    { title: 'Opioid Prescribing in Medicare Part D', path: '/opioids', date: '2026-02-27' },
    { title: 'Flagged Providers: Multi-Factor Risk Analysis', path: '/flagged', date: '2026-02-27' },
    { title: 'Brand vs Generic Prescribing Patterns', path: '/brand-vs-generic', date: '2026-02-27' },
    { title: 'Excluded Providers Still in Medicare Part D', path: '/excluded', date: '2026-02-27' },
    { title: 'Medicare Part D Dashboard', path: '/dashboard', date: '2026-02-27' },
  ]

  const items = pages.map(p => `
    <item>
      <title>${p.title}</title>
      <link>${base}${p.path}</link>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${p.title} — OpenPrescriber data analysis.</description>
    </item>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>OpenPrescriber</title>
    <link>${base}</link>
    <description>Medicare Part D prescribing analysis and fraud risk scoring</description>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}
