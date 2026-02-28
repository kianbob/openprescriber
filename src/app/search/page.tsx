import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SearchClient from './SearchClient'

export const metadata: Metadata = {
  title: 'Search Medicare Part D Prescribers',
  description: 'Search 1.38 million Medicare Part D prescribers by name, NPI, city, state, or specialty.',
  alternates: { canonical: 'https://www.openprescriber.org/search' },
}

export default function SearchPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Search' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Search Prescribers</h1>
      <p className="text-gray-600 mb-6">Search 1.38 million Medicare Part D prescribers by name, NPI, city, state, or specialty. Detailed profiles available for 19,300+ flagged and high-volume providers.</p>
      <SearchClient />
      <div className="mt-8 bg-gray-50 rounded-xl p-5 border text-sm text-gray-600">
        <h2 className="font-semibold text-gray-800 mb-2">Search Tips</h2>
        <ul className="space-y-1 list-disc list-inside">
          <li>Search by <strong>provider name</strong> (e.g., &quot;Smith&quot;)</li>
          <li>Search by <strong>NPI number</strong> (e.g., &quot;1234567890&quot;)</li>
          <li>Search by <strong>city or state</strong> (e.g., &quot;Houston&quot; or &quot;TX&quot;)</li>
          <li>Search by <strong>specialty</strong> (e.g., &quot;Cardiology&quot;)</li>
          <li>Only providers flagged for risk or high-volume prescribing have detailed profiles</li>
        </ul>
      </div>

      {/* Popular Searches */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-6">Popular Searches</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Browse by State</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { name: 'California', slug: 'ca' },
                { name: 'Texas', slug: 'tx' },
                { name: 'Florida', slug: 'fl' },
                { name: 'New York', slug: 'ny' },
                { name: 'Ohio', slug: 'oh' },
                { name: 'Pennsylvania', slug: 'pa' },
              ].map(s => (
                <Link key={s.slug} href={`/states/${s.slug}`} className="bg-white rounded-lg border border-gray-200 px-4 py-3 text-center text-sm font-medium text-primary hover:border-primary/40 hover:shadow-sm transition-all">
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Browse by Specialty</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { name: 'Family Practice', slug: 'family-practice' },
                { name: 'Internal Medicine', slug: 'internal-medicine' },
                { name: 'Nurse Practitioner', slug: 'nurse-practitioner' },
                { name: 'Cardiology', slug: 'cardiology' },
                { name: 'Psychiatry', slug: 'psychiatry' },
              ].map(s => (
                <Link key={s.slug} href={`/specialties/${s.slug}`} className="bg-white rounded-lg border border-gray-200 px-4 py-3 text-center text-sm font-medium text-primary hover:border-primary/40 hover:shadow-sm transition-all">
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Explore</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Flagged Providers', href: '/flagged' },
                { name: 'ML Fraud Detection', href: '/ml-fraud-detection' },
                { name: 'Top Drugs', href: '/drugs' },
                { name: 'Opioid Prescribers', href: '/opioid-prescribers' },
              ].map(item => (
                <Link key={item.href} href={item.href} className="bg-white rounded-lg border border-gray-200 px-4 py-3 text-center text-sm font-medium text-primary hover:border-primary/40 hover:shadow-sm transition-all">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
