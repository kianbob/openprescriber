import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'

export const metadata: Metadata = {
  title: 'ProPublica Prescriber Checkup Alternative — OpenPrescriber',
  description:
    'Looking for an alternative to ProPublica Prescriber Checkup? OpenPrescriber offers 2023 Medicare Part D data, ML fraud detection, risk scoring, and trend analysis for 1.38M providers.',
  alternates: { canonical: 'https://www.openprescriber.org/prescriber-checkup-alternative' },
  openGraph: {
    title: 'ProPublica Prescriber Checkup Alternative — OpenPrescriber',
    description:
      'OpenPrescriber provides current 2023 Medicare Part D prescribing data, fraud risk scoring, and trend analysis — a modern alternative to ProPublica Prescriber Checkup.',
    url: 'https://www.openprescriber.org/prescriber-checkup-alternative',
    siteName: 'OpenPrescriber',
    type: 'website',
  },
}

const faqItems = [
  {
    question: 'Is ProPublica Prescriber Checkup still updated?',
    answer:
      'ProPublica Prescriber Checkup last updated its data in 2016 using CMS Medicare Part D data from that year. The tool remains online but has not been refreshed with newer data. OpenPrescriber uses the most current CMS data available (2023) and includes five years of trend data from 2019 to 2023.',
  },
  {
    question: 'What replaced ProPublica Prescriber Checkup?',
    answer:
      'While there is no official replacement, OpenPrescriber offers similar provider lookup functionality with significantly more current data (2023 vs 2016), plus additional features like ML-based fraud detection, 10-component risk scoring, opioid co-prescribing analysis, and five-year trend tracking for 1,380,665 providers.',
  },
  {
    question: 'How is OpenPrescriber different from ProPublica Prescriber Checkup?',
    answer:
      'OpenPrescriber covers 1,380,665 providers with 2023 data and includes specialty-adjusted risk scoring, machine learning fraud detection trained on 281 confirmed fraud cases, OIG excluded provider cross-referencing, opioid and benzodiazepine co-prescribing detection, and five years of trend data. ProPublica Prescriber Checkup provides basic provider lookup with 2016 data for approximately 1 million providers.',
  },
  {
    question: 'Is OpenPrescriber free to use?',
    answer:
      'Yes. OpenPrescriber is completely free and built on publicly available CMS Medicare Part D data. All provider profiles, risk scores, analysis articles, and interactive tools are accessible without registration or payment.',
  },
  {
    question: 'Can I look up a specific doctor on OpenPrescriber?',
    answer:
      'Yes. Use the search page to find any of the 1,380,665 Medicare Part D prescribers by name, NPI number, state, or specialty. Each provider profile includes prescribing patterns, cost data, risk indicators, and five-year trend charts.',
  },
]

export default function PrescriberCheckupAlternativePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Prescriber Checkup Alternative' }]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />

      {/* Hero Section */}
      <section className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] mb-4">
          Looking for a Prescriber Checkup Alternative?
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          ProPublica&apos;s Prescriber Checkup was a groundbreaking tool that made Medicare prescribing data
          accessible to the public. However, its data hasn&apos;t been updated since 2016. OpenPrescriber
          picks up where it left off — with current 2023 data, advanced fraud detection, and analytical
          tools that go far beyond basic provider lookup.
        </p>
        <div className="flex flex-wrap gap-3 mb-4">
          <Link
            href="/search"
            className="inline-flex items-center px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Search Providers
          </Link>
          <Link
            href="/risk-explorer"
            className="inline-flex items-center px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Explore Risk Scores
          </Link>
        </div>
        <ShareButtons title="ProPublica Prescriber Checkup Alternative — OpenPrescriber" />
      </section>

      {/* Why Data Currency Matters */}
      <section className="mb-12 bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-amber-900 mb-3">
          Why Data Currency Matters
        </h2>
        <p className="text-amber-900 mb-3">
          Medicare prescribing patterns shift significantly year over year. Between 2016 and 2023,
          the opioid crisis transformed prescribing practices, new drug approvals reshaped treatment
          standards, and the COVID-19 pandemic altered healthcare delivery nationwide. Relying on
          2016 data means missing seven years of changes — including providers who have since been
          excluded, retired, or significantly changed their prescribing behavior.
        </p>
        <p className="text-amber-900">
          OpenPrescriber uses the most recent CMS Medicare Part D data (2023) and maintains five years
          of historical data (2019-2023) so you can see how patterns have evolved over time.
        </p>
      </section>

      {/* Comparison Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-6">
          Side-by-Side Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 border border-gray-200 font-semibold">Feature</th>
                <th className="text-center p-3 border border-gray-200 font-semibold">ProPublica Prescriber Checkup</th>
                <th className="text-center p-3 border border-gray-200 font-semibold bg-blue-50">OpenPrescriber</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Most Recent Data', '2016', '2023'],
                ['Providers Covered', '~1,000,000', '1,380,665'],
                ['Total Drug Costs Analyzed', 'Not disclosed', '$275.6 billion'],
                ['Years of Trend Data', 'None', '5 years (2019-2023)'],
                ['Specialty-Adjusted Comparisons', 'No', 'Yes — 205 specialties'],
                ['Risk Scoring', 'No', '10-component scoring model'],
                ['ML Fraud Detection', 'No', 'Trained on 281 confirmed cases'],
                ['OIG Excluded Provider Alerts', 'No', '372 flagged providers'],
                ['Opioid Co-Prescribing Detection', 'No', 'Yes'],
                ['Analysis Articles', 'Limited', '29 in-depth articles'],
                ['Interactive Tools', 'Provider lookup', '9 tools'],
                ['State & Drug Pages', 'No', '62 states/territories, 500+ drugs'],
                ['Cost', 'Free', 'Free'],
              ].map(([feature, pp, op], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="p-3 border border-gray-200 font-medium">{feature}</td>
                  <td className="p-3 border border-gray-200 text-center text-gray-600">{pp}</td>
                  <td className="p-3 border border-gray-200 text-center bg-blue-50/50 font-medium">{op}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* What OpenPrescriber Adds */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-6">
          What OpenPrescriber Adds
        </h2>

        <div className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-3">Machine Learning Fraud Detection</h3>
            <p className="text-gray-600 mb-3">
              Our ML model was trained on 281 confirmed fraud cases from the OIG&apos;s List of Excluded
              Individuals and Entities (LEIE). It analyzes prescribing patterns across multiple dimensions
              to identify statistically anomalous behavior, flagging over 4,100 providers for further review.
            </p>
            <p className="text-gray-600">
              Additionally, we cross-reference all active prescribers against the OIG LEIE database,
              identifying 372 excluded providers who still appear in current Medicare prescribing data.
            </p>
            <Link href="/ml-fraud-detection" className="text-primary font-medium hover:underline text-sm mt-2 inline-block">
              Learn about our ML fraud detection methodology
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-3">10-Component Risk Scoring</h3>
            <p className="text-gray-600 mb-3">
              Every provider receives a composite risk score built from 10 specialty-adjusted components,
              including prescribing volume, cost per claim, brand-name preference, opioid rates, and
              controlled substance patterns. Scores are compared against peers in the same specialty,
              so a pain management specialist is measured against other pain management specialists — not
              all doctors.
            </p>
            <Link href="/methodology" className="text-primary font-medium hover:underline text-sm mt-2 inline-block">
              Read the full scoring methodology
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-3">Five-Year Trend Analysis</h3>
            <p className="text-gray-600 mb-3">
              Prescribing behavior in a single year can be misleading. OpenPrescriber tracks every provider
              across five years of CMS data (2019-2023), so you can see whether a provider&apos;s
              opioid prescribing is increasing, their costs are rising, or their patterns are changing
              over time.
            </p>
            <p className="text-gray-600">
              Trend data is available at the provider, state, drug, and specialty level — giving context
              that a single snapshot cannot provide.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-3">Dangerous Combination Detection</h3>
            <p className="text-gray-600">
              OpenPrescriber flags providers who co-prescribe opioids and benzodiazepines at high rates —
              a combination the FDA has specifically warned against due to increased risk of overdose and
              death. This analysis is not available in other prescriber lookup tools.
            </p>
            <Link href="/dangerous-combinations" className="text-primary font-medium hover:underline text-sm mt-2 inline-block">
              View dangerous combination analysis
            </Link>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-6">
          How to Use OpenPrescriber
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: 'Search for a Provider',
              desc: 'Look up any of 1,380,665 Medicare Part D prescribers by name, NPI, state, or specialty.',
              href: '/search',
              link: 'Search providers',
            },
            {
              title: 'Explore Risk Scores',
              desc: 'Browse providers ranked by composite risk score, filter by state and specialty.',
              href: '/risk-explorer',
              link: 'Open Risk Explorer',
            },
            {
              title: 'View Flagged Providers',
              desc: 'See providers flagged by ML fraud detection and OIG excluded provider cross-reference.',
              href: '/flagged',
              link: 'View flagged providers',
            },
            {
              title: 'Browse by State or Drug',
              desc: 'Explore prescribing patterns, costs, and trends for all 62 states/territories and 500+ drugs.',
              href: '/states',
              link: 'Browse states',
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{item.desc}</p>
              <span className="text-primary font-medium text-sm">{item.link} &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Who Uses OpenPrescriber */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-4">
          Who Uses OpenPrescriber
        </h2>
        <div className="prose prose-gray max-w-none">
          <ul>
            <li>
              <strong>Patients and caregivers</strong> researching their provider&apos;s prescribing
              patterns, drug costs, and how they compare to specialty peers.
            </li>
            <li>
              <strong>Journalists and researchers</strong> investigating healthcare fraud, opioid
              prescribing trends, and Medicare spending at the provider, state, or national level.
            </li>
            <li>
              <strong>Healthcare compliance professionals</strong> monitoring prescribing outliers,
              excluded provider alerts, and dangerous drug combination patterns.
            </li>
            <li>
              <strong>Policy analysts</strong> tracking five-year prescribing trends, brand-vs-generic
              utilization, and state-level cost variations across $275.6 billion in annual drug spending.
            </li>
          </ul>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="mb-12 bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">
          Go Deeper
        </h2>
        <p className="text-gray-600 mb-4">
          Beyond provider lookup, OpenPrescriber publishes in-depth analysis on prescribing trends,
          drug costs, and healthcare fraud indicators.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/drugs" className="text-primary font-medium hover:underline">Drug Profiles</Link>
          <span className="text-gray-300">|</span>
          <Link href="/states" className="text-primary font-medium hover:underline">State Profiles</Link>
          <span className="text-gray-300">|</span>
          <Link href="/analysis" className="text-primary font-medium hover:underline">Analysis Articles</Link>
          <span className="text-gray-300">|</span>
          <Link href="/methodology" className="text-primary font-medium hover:underline">Methodology</Link>
          <span className="text-gray-300">|</span>
          <Link href="/ml-fraud-detection" className="text-primary font-medium hover:underline">ML Fraud Detection</Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqItems.map((item, i) => (
            <div key={i}>
              <h3 className="font-bold text-lg mb-2">{item.question}</h3>
              <p className="text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-3">
          Ready to Explore?
        </h2>
        <p className="text-gray-600 mb-5 max-w-2xl mx-auto">
          OpenPrescriber is free, requires no registration, and provides the most current Medicare
          Part D prescribing data available. Search for any provider, explore risk scores, or browse
          by state and drug.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/search"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Search Providers
          </Link>
          <Link
            href="/risk-explorer"
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Risk Explorer
          </Link>
          <Link
            href="/flagged"
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Flagged Providers
          </Link>
        </div>
      </section>
    </div>
  )
}
