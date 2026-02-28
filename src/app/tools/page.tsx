import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'OpenPrescriber Tools: Interactive Medicare Data Explorers',
  description: 'Interactive tools for exploring Medicare Part D prescribing data. Generic savings calculator, peer comparison lookup, and more.',
  alternates: { canonical: 'https://www.openprescriber.org/tools' },
}

const tools = [
  {
    title: 'Generic Savings Calculator',
    description: 'Calculate how much Medicare could save if providers switched from brand-name to generic drugs. Explore savings potential by state.',
    href: '/tools/savings-calculator',
    emoji: '💰',
    tag: 'Interactive',
  },
  {
    title: 'Prescriber Peer Comparison Tool',
    description: 'Look up any medical specialty to see opioid rates, costs, and brand prescribing benchmarks with percentile data.',
    href: '/tools/peer-lookup',
    emoji: '📊',
    tag: 'Interactive',
  },
]

export default function ToolsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Tools' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">Interactive Tools</h1>

      <p className="text-lg text-gray-600 mb-8">
        Explore Medicare Part D prescribing data with our interactive tools. These calculators and lookups provide unique insights you won&apos;t find anywhere else.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map(tool => (
          <Link key={tool.href} href={tool.href} className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{tool.emoji}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-lg">{tool.title}</h2>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{tool.tag}</span>
                </div>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
