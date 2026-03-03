import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'OpenPrescriber Tools: Interactive Medicare Data Explorers',
  description: 'Interactive tools for exploring Medicare Part D prescribing data. Generic savings calculator, peer comparison lookup, and more.',
  alternates: { canonical: 'https://www.openprescriber.org/tools' },
  openGraph: {
    title: 'Interactive Medicare Part D Tools',
    url: 'https://www.openprescriber.org/tools',
    type: 'website',
  },
}

const tools = [
  {
    title: 'Risk Score Calculator',
    description: 'Enter prescribing metrics to calculate a risk score. See how opioid rates, costs, and other factors contribute to our 10-component model.',
    href: '/tools/risk-calculator',
    tag: 'Calculator',
  },
  {
    title: 'Drug Cost Lookup',
    description: 'Search 500 of the most expensive drugs in Medicare Part D. See total cost, claims, patients, and cost per prescription.',
    href: '/tools/drug-lookup',
    tag: 'Search',
  },
  {
    title: 'State Report Card',
    description: 'Get a letter grade for your state\'s Medicare Part D performance. Rankings for drug costs, opioid rates, and cost per patient.',
    href: '/tools/state-report-card',
    tag: 'Interactive',
  },
  {
    title: 'Generic Savings Calculator',
    description: 'Calculate how much Medicare could save if providers switched from brand-name to generic drugs by state.',
    href: '/tools/savings-calculator',
    tag: 'Calculator',
  },
  {
    title: 'Prescriber Peer Comparison',
    description: 'Look up any medical specialty to see opioid rates, costs, and brand prescribing benchmarks with percentile data.',
    href: '/tools/peer-lookup',
    tag: 'Interactive',
  },
  {
    title: 'Compare Providers',
    description: 'Enter two NPI numbers and see a side-by-side comparison of claims, costs, opioid rates, risk scores, and prescribing flags.',
    href: '/tools/compare',
    tag: 'Interactive',
  },
  {
    title: 'City Lookup',
    description: 'Search for Medicare Part D prescribers by city. See provider names, specialties, costs, and risk levels for any U.S. city.',
    href: '/tools/city-lookup',
    tag: 'Search',
  },
  {
    title: 'Specialty Comparison',
    description: 'Compare 2-3 medical specialties side by side. See providers, costs, opioid rates, brand prescribing, and more.',
    href: '/tools/specialty-comparison',
    tag: 'Interactive',
  },
  {
    title: 'Risk Explorer',
    description: 'Filter and explore 6,700+ flagged Medicare Part D providers by risk score, state, specialty, and specific risk flags.',
    href: '/risk-explorer',
    tag: 'Interactive',
  },
  {
    title: 'Provider Search',
    description: 'Search 19,300+ Medicare Part D prescriber profiles by name, NPI, city, state, or specialty.',
    href: '/search',
    tag: 'Search',
  },
  {
    title: 'ML Fraud Detection',
    description: 'Machine learning model trained on confirmed fraud cases scores 1M+ providers. Explore 4,100+ flagged prescribers.',
    href: '/ml-fraud-detection',
    tag: 'AI/ML',
  },
]

export default function ToolsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.openprescriber.org' },
            { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.openprescriber.org/tools' },
          ],
        }) }}
      />
      <Breadcrumbs items={[{ label: 'Tools' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">Interactive Tools</h1>

      <p className="text-lg text-gray-600 mb-8">
        Explore Medicare Part D prescribing data with our interactive tools. These calculators and lookups provide unique insights you won&apos;t find anywhere else.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map(tool => (
          <Link key={tool.href} href={tool.href} className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-primary/30 transition-all">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-bold text-lg">{tool.title}</h2>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{tool.tag}</span>
            </div>
            <p className="text-sm text-gray-600">{tool.description}</p>
          </Link>
        ))}
      </div>

      <section className="mt-12 bg-gray-50 rounded-xl p-6 border">
        <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-4">You Might Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link href="/analysis" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm">
            <p className="font-medium text-gray-800">Analysis & Research</p>
            <p className="text-xs text-gray-500 mt-1">30 data-driven investigations</p>
          </Link>
          <Link href="/dashboard" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm">
            <p className="font-medium text-gray-800">Dashboard</p>
            <p className="text-xs text-gray-500 mt-1">5-year trends at a glance</p>
          </Link>
          <Link href="/prescriber-checkup-alternative" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm">
            <p className="font-medium text-gray-800">vs. ProPublica</p>
            <p className="text-xs text-gray-500 mt-1">How we compare</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
