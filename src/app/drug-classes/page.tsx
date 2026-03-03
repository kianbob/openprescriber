import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { loadData } from '@/lib/server-utils'
import { fmtMoney, fmt } from '@/lib/utils'
import DataFreshness from '@/components/DataFreshness'

export const metadata: Metadata = {
  title: 'Drug Classes — Medicare Part D Spending by Therapeutic Category',
  description: 'Explore Medicare Part D drug spending by therapeutic class. Compare costs across 24 drug categories including blood thinners, GLP-1s, insulins, opioids, and more.',
  alternates: { canonical: 'https://www.openprescriber.org/drug-classes' },
  openGraph: {
    title: 'Drug Classes — Medicare Part D Spending',
    description: 'Explore drug spending by therapeutic class. 24 categories covering $63B+ in Medicare costs.',
    url: 'https://www.openprescriber.org/drug-classes',
    type: 'website',
  },
}

type DrugClass = { name: string; slug: string; drugs: number; totalCost: number; totalClaims: number; topDrug: string }

export default function DrugClassesPage() {
  const classes = loadData('drug-classes-index.json') as DrugClass[]
  const totalCost = classes.reduce((s, c) => s + c.totalCost, 0)
  const totalDrugs = classes.reduce((s, c) => s + c.drugs, 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Drug Classes' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Drug Classes</h1>
      <p className="text-gray-600 mb-4">Medicare Part D spending organized by therapeutic category. {totalDrugs} drugs across {classes.length} classes, totaling {fmtMoney(totalCost)} in 2023.</p>
      <DataFreshness />

      <div className="mt-8 grid gap-4">
        {classes.map((c, i) => (
          <Link key={c.slug} href={`/drug-classes/${c.slug}`} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow flex items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-lg">{c.name}</h2>
              <p className="text-sm text-gray-500">{c.drugs} drug{c.drugs !== 1 ? 's' : ''} · Top: {c.topDrug}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-bold font-mono text-primary">{fmtMoney(c.totalCost)}</p>
              <p className="text-xs text-gray-400">{fmt(c.totalClaims)} claims</p>
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-10 prose prose-gray max-w-none">
        <h2 className="font-[family-name:var(--font-heading)]">About Drug Classification</h2>
        <p>
          Drugs are grouped by their therapeutic mechanism — how they work in the body. This classification helps identify which categories drive the most Medicare spending and where cost-saving opportunities exist.
        </p>
        <p>
          Blood thinners and GLP-1 receptor agonists together account for nearly $19 billion — more than the next four categories combined. The rapid growth of GLP-1 drugs (Ozempic, Mounjaro) for diabetes and weight loss is reshaping Medicare drug spending.
        </p>
        <p>
          See our <Link href="/analysis/most-prescribed-drugs">Most Prescribed Drugs</Link> analysis or <Link href="/analysis/generic-adoption">Generic Adoption Gap</Link> for more context.
        </p>
      </section>
    </div>
  )
}
