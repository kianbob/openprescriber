import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.openprescriber.org'

  const staticRoutes = [
    '', '/states', '/specialties', '/drugs', '/providers', '/dashboard',
    '/flagged', '/opioids', '/brand-vs-generic', '/excluded',
    '/search', '/about', '/methodology', '/analysis', '/downloads', '/faq', '/privacy',
    '/ira-negotiation', '/glp1-tracker', '/dangerous-combinations', '/peer-comparison',
    '/taxpayer-cost', '/specialty-profiles', '/prescription-drug-costs',
    '/tools/savings-calculator', '/tools/peer-lookup',
    '/analysis/opioid-crisis', '/analysis/cost-outliers', '/analysis/brand-generic-gap',
    '/analysis/opioid-hotspots', '/analysis/excluded-still-prescribing', '/analysis/antipsychotic-elderly',
    '/ira-negotiation', '/glp1-tracker', '/dangerous-combinations', '/peer-comparison',
    '/tools', '/tools/savings-calculator', '/tools/peer-lookup',
  ]

  // Provider detail pages
  const providersDir = path.join(process.cwd(), 'public', 'data', 'providers')
  const providerNPIs = fs.readdirSync(providersDir).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''))

  // State detail pages
  const states = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'states.json'), 'utf8')) as { state: string }[]

  // Drug detail pages
  const drugs = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'drugs.json'), 'utf8')) as { generic: string }[]
  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  // Specialty detail pages
  const specs = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'specialties.json'), 'utf8')) as { specialty: string }[]

  return [
    ...staticRoutes.map(r => ({ url: `${base}${r}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: r === '' ? 1 : 0.8 })),
    ...states.map(s => ({ url: `${base}/states/${s.state.toLowerCase()}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...drugs.map(d => ({ url: `${base}/drugs/${slugify(d.generic)}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...specs.map(s => ({ url: `${base}/specialties/${slugify(s.specialty)}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...providerNPIs.map(npi => ({ url: `${base}/providers/${npi}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 })),
  ]
}
