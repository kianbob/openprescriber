import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'

export const metadata: Metadata = {
  title: 'Download Medicare Part D Data',
  description: 'Download processed Medicare Part D prescribing datasets — state summaries, specialty analysis, opioid data, and risk scores.',
  alternates: { canonical: 'https://www.openprescriber.org/downloads' },
}

export default function DownloadsPage() {
  const categories = [
    {
      heading: 'Provider Data',
      files: [
        { name: 'provider-index.json', desc: 'Searchable index of 18,700+ flagged/high-volume providers', size: '~550KB' },
        { name: 'high-risk.json', desc: 'All providers flagged as high-risk by our 10-component scoring model', size: '~400KB' },
        { name: 'excluded.json', desc: '372 OIG-excluded providers still active in Medicare Part D', size: '~50KB' },
        { name: 'top-opioid.json', desc: 'Top 1,000 opioid prescribers by rate', size: '~310KB' },
        { name: 'top-cost.json', desc: 'Top 1,000 prescribers by total drug cost', size: '~300KB' },
        { name: 'risk-distribution.json', desc: 'Risk score distribution across all scored providers', size: '~2KB' },
      ],
    },
    {
      heading: 'Drug Data',
      files: [
        { name: 'drugs.json', desc: 'Top 500 drugs by total Medicare Part D cost', size: '~40KB' },
        { name: 'drug-combos.json', desc: '6,149 opioid + benzodiazepine co-prescribers', size: '~100KB' },
      ],
    },
    {
      heading: 'Geographic Data',
      files: [
        { name: 'states.json', desc: '62 states/territories with prescriber counts, costs, opioid rates', size: '~12KB' },
        { name: 'opioid-by-state.json', desc: 'State-level opioid prescribing breakdown', size: '~8KB' },
      ],
    },
    {
      heading: 'Specialty & ML Data',
      files: [
        { name: 'specialties.json', desc: '205 medical specialties with prescribing patterns', size: '~20KB' },
        { name: 'ml-predictions.json', desc: 'Top 2,000 ML fraud detection predictions with confidence scores', size: '~400KB' },
      ],
    },
    {
      heading: 'Summary',
      files: [
        { name: 'stats.json', desc: 'Aggregate statistics: providers, claims, cost, opioid counts, risk breakdown', size: '~2KB' },
        { name: 'yearly-trends.json', desc: '5-year trend data (2019–2023): costs, providers, opioid rates', size: '~1KB' },
      ],
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Downloads' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Download Data</h1>
      <p className="text-gray-600 mb-6">All processed datasets are available as JSON files for research and analysis. Data is derived from CMS Medicare Part D Public Use Files (2023).</p>

      <div className="space-y-8">
        {categories.map(cat => (
          <div key={cat.heading}>
            <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-3">{cat.heading}</h2>
            <div className="space-y-3">
              {cat.files.map(f => (
                <a key={f.name} href={`/data/${f.name}`} download className="flex items-center justify-between bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all">
                  <div>
                    <p className="font-mono text-sm font-medium text-primary">{f.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{f.size}</span>
                    <span>⬇️</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-gray-700">
        All files are JSON format. Need CSV? Open in any JSON-to-CSV converter or use our API documentation.
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">Source Data</h3>
        <ul className="space-y-1">
          <li>• <a href="https://data.cms.gov/provider-summary-by-type-of-service/medicare-part-d-prescribers/medicare-part-d-prescribers-by-provider" className="text-primary hover:underline" target="_blank" rel="noopener">CMS Medicare Part D Prescribers by Provider (2023)</a></li>
          <li>• <a href="https://data.cms.gov/provider-summary-by-type-of-service/medicare-part-d-prescribers/medicare-part-d-prescribers-by-provider-and-drug" className="text-primary hover:underline" target="_blank" rel="noopener">CMS Medicare Part D Prescribers by Provider and Drug (2023)</a></li>
          <li>• <a href="https://oig.hhs.gov/exclusions/exclusions_list.asp" className="text-primary hover:underline" target="_blank" rel="noopener">OIG List of Excluded Individuals/Entities (LEIE)</a></li>
        </ul>
      </div>
    </div>
  )
}
