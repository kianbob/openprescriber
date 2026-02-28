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
    title: 'Risk Score Calculator',
    description: 'Enter prescribing metrics to calculate a risk score. See how opioid rates, costs, and other factors contribute to our 10-component model.',
    href: '/tools/risk-calculator',
    emoji: '🎯',
    tag: 'Calculator',
  },
  {
    title: 'Drug Cost Lookup',
    description: 'Search 500 of the most expensive drugs in Medicare Part D. See total cost, claims, patients, and cost per prescription.',
    href: '/tools/drug-lookup',
    emoji: '💊',
    tag: 'Search',
  },
  {
    title: 'State Report Card',
    description: 'Get a letter grade for your state\'s Medicare Part D performance. Rankings for drug costs, opioid rates, and cost per patient.',
    href: '/tools/state-report-card',
    emoji: '🏆',
    tag: 'Interactive',
  },
  {
    title: 'Generic Savings Calculator',
    description: 'Calculate how much Medicare could save if providers switched from brand-name to generic drugs by state.',
    href: '/tools/savings-calculator',
    emoji: '💰',
    tag: 'Calculator',
  },
  {
    title: 'Prescriber Peer Comparison',
    description: 'Look up any medical specialty to see opioid rates, costs, and brand prescribing benchmarks with percentile data.',
    href: '/tools/peer-lookup',
    emoji: '📊',
    tag: 'Interactive',
  },
  {
    title: 'Compare Providers',
    description: 'Enter two NPI numbers and see a side-by-side comparison of claims, costs, opioid rates, risk scores, and prescribing flags.',
    href: '/tools/compare',
    emoji: '⚖️',
    tag: 'Interactive',
  },
  {
    title: 'City Lookup',
    description: 'Search for Medicare Part D prescribers by city. See provider names, specialties, costs, and risk levels for any U.S. city.',
    href: '/tools/city-lookup',
    emoji: '🏙️',
    tag: 'Search',
  },
  {
    title: 'Specialty Comparison',
    description: 'Compare 2-3 medical specialties side by side. See providers, costs, opioid rates, brand prescribing, and more.',
    href: '/tools/specialty-comparison',
    emoji: '🔬',
    tag: 'Interactive',
  },
  {
    title: 'Risk Explorer',
    description: 'Filter and explore 6,700+ flagged Medicare Part D providers by risk score, state, specialty, and specific risk flags.',
    href: '/risk-explorer',
    emoji: '🔍',
    tag: 'Interactive',
  },
  {
    title: 'Provider Search',
    description: 'Search 19,300+ Medicare Part D prescriber profiles by name, NPI, city, state, or specialty.',
    href: '/search',
    emoji: '👤',
    tag: 'Search',
  },
  {
    title: 'ML Fraud Detection',
    description: 'Machine learning model trained on confirmed fraud cases scores 1M+ providers. Explore 4,100+ flagged prescribers.',
    href: '/ml-fraud-detection',
    emoji: '🤖',
    tag: 'AI/ML',
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
          <Link key={tool.href} href={tool.href} className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-primary/30 transition-all">
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
