import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import DataFreshness from '@/components/DataFreshness'
import { loadData } from '@/lib/server-utils'
import { fmtMoney, fmt } from '@/lib/utils'
import fs from 'fs'
import path from 'path'

type DrugClassData = {
  name: string; slug: string; totalCost: number; totalClaims: number;
  drugs: { generic: string; brand: string; cost: number; claims: number; providers: number; costPerClaim: number }[];
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function loadClass(slug: string): DrugClassData | null {
  const fp = path.join(process.cwd(), 'public', 'data', 'drug-classes', slug + '.json')
  if (!fs.existsSync(fp)) return null
  return JSON.parse(fs.readFileSync(fp, 'utf8'))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cls = loadClass(slug)
  if (!cls) return { title: 'Drug Class Not Found' }
  return {
    title: `${cls.name} — Medicare Part D Drug Costs & Prescribing`,
    description: `${cls.drugs.length} ${cls.name.toLowerCase()} drugs in Medicare Part D. ${fmtMoney(cls.totalCost)} total cost, ${fmt(cls.totalClaims)} claims in 2023.`,
    alternates: { canonical: `https://www.openprescriber.org/drug-classes/${slug}` },
    openGraph: {
      title: `${cls.name} — Medicare Part D`,
      description: `${cls.drugs.length} drugs, ${fmtMoney(cls.totalCost)} total cost.`,
      url: `https://www.openprescriber.org/drug-classes/${slug}`,
      type: 'article',
    },
  }
}

export async function generateStaticParams() {
  const index = loadData('drug-classes-index.json') as { slug: string }[]
  return index.map(c => ({ slug: c.slug }))
}

export default async function DrugClassDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cls = loadClass(slug)
  if (!cls) notFound()

  const avgCostPerClaim = cls.totalClaims > 0 ? cls.totalCost / cls.totalClaims : 0
  const totalProviders = cls.drugs.reduce((s, d) => s + d.providers, 0)
  const mostExpensive = cls.drugs.reduce((a, b) => (a.costPerClaim > b.costPerClaim ? a : b), cls.drugs[0])
  const mostPrescribed = cls.drugs.reduce((a, b) => (a.claims > b.claims ? a : b), cls.drugs[0])

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Drug Classes', href: '/drug-classes' }, { label: cls.name }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">{cls.name}</h1>
      <p className="text-gray-600 mb-4">{cls.drugs.length} drugs in this class, prescribed by {fmt(totalProviders)} Medicare Part D providers.</p>
      <DataFreshness />
      <ShareButtons title={`${cls.name} — Medicare Part D Costs`} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
          <p className="text-2xl font-bold text-blue-700">{fmtMoney(cls.totalCost)}</p>
          <p className="text-xs text-blue-600">Total Cost</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
          <p className="text-2xl font-bold text-green-700">{fmt(cls.totalClaims)}</p>
          <p className="text-xs text-green-600">Claims</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
          <p className="text-2xl font-bold text-purple-700">{cls.drugs.length}</p>
          <p className="text-xs text-purple-600">Drugs</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
          <p className="text-2xl font-bold text-orange-700">{fmtMoney(avgCostPerClaim)}</p>
          <p className="text-xs text-orange-600">Avg Cost/Claim</p>
        </div>
      </div>

      {/* Key insights */}
      <div className="mt-6 bg-gray-50 rounded-xl p-5 border text-sm">
        <h2 className="font-semibold mb-2">Key Insights</h2>
        <ul className="space-y-1 text-gray-700">
          <li>Most expensive per prescription: <strong>{mostExpensive.brand || mostExpensive.generic}</strong> at {fmtMoney(mostExpensive.costPerClaim)}/claim</li>
          <li>Most prescribed: <strong>{mostPrescribed.brand || mostPrescribed.generic}</strong> with {fmt(mostPrescribed.claims)} claims</li>
          <li>This class represents <strong>{((cls.totalCost / 275600000000) * 100).toFixed(1)}%</strong> of total Medicare Part D spending</li>
        </ul>
      </div>

      {/* Drugs table */}
      <section className="mt-10">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">All {cls.name} Drugs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Drug</th>
                <th className="px-4 py-2 text-left font-semibold hidden sm:table-cell">Brand</th>
                <th className="px-4 py-2 text-right font-semibold">Cost</th>
                <th className="px-4 py-2 text-right font-semibold">Claims</th>
                <th className="px-4 py-2 text-right font-semibold hidden md:table-cell">$/Claim</th>
                <th className="px-4 py-2 text-right font-semibold hidden md:table-cell">Providers</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {cls.drugs.map(d => (
                <tr key={d.generic} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <Link href={`/drugs/${slugify(d.generic)}`} className="text-primary hover:underline font-medium">{d.generic}</Link>
                  </td>
                  <td className="px-4 py-2 text-gray-500 hidden sm:table-cell">{d.brand || '—'}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmtMoney(d.cost)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(d.claims)}</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmtMoney(d.costPerClaim)}</td>
                  <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(d.providers)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Related links */}
      <section className="mt-10 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-4">Explore More</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/drug-classes" className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-sm">All Drug Classes</h3>
            <p className="text-xs text-gray-500 mt-1">Compare spending across 24 therapeutic categories.</p>
          </Link>
          <Link href="/drugs" className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-sm">Top 500 Drugs</h3>
            <p className="text-xs text-gray-500 mt-1">Individual drug costs and prescribing data.</p>
          </Link>
          <Link href="/analysis/most-prescribed-drugs" className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-sm">Most Prescribed Drugs</h3>
            <p className="text-xs text-gray-500 mt-1">Analysis of the drugs driving Medicare spending.</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
