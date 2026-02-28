import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.openprescriber.org'

  const staticRoutes = [
    '', '/states', '/specialties', '/drugs', '/providers', '/dashboard',
    '/flagged', '/opioids', '/brand-vs-generic', '/excluded',
    '/search', '/about', '/methodology', '/analysis',
  ]

  // Provider detail pages
  const providersDir = path.join(process.cwd(), 'public', 'data', 'providers')
  const providerNPIs = fs.readdirSync(providersDir).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''))

  // State detail pages
  const states = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'states.json'), 'utf8')) as { state: string }[]

  return [
    ...staticRoutes.map(r => ({ url: `${base}${r}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: r === '' ? 1 : 0.8 })),
    ...states.map(s => ({ url: `${base}/states/${s.state.toLowerCase()}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...providerNPIs.map(npi => ({ url: `${base}/providers/${npi}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 })),
  ]
}
