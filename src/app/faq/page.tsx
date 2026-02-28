import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Common questions about OpenPrescriber, Medicare Part D data, risk scoring, and how to use the site.',
  alternates: { canonical: 'https://www.openprescriber.org/faq' },
}

const faqs = [
  {
    q: 'What is Medicare Part D?',
    a: 'Medicare Part D is the prescription drug benefit for Medicare enrollees. It covers outpatient prescription drugs through private insurance plans approved by Medicare. In 2023, Part D covered over 32 million beneficiaries.',
  },
  {
    q: 'Where does this data come from?',
    a: 'All data comes from publicly available CMS (Centers for Medicare & Medicaid Services) Medicare Part D Public Use Files for 2023, plus the OIG List of Excluded Individuals/Entities (LEIE). These are official government datasets released for public transparency.',
  },
  {
    q: 'What does a high risk score mean?',
    a: 'A high risk score indicates that a provider\'s prescribing patterns deviate significantly from statistical norms across multiple factors (opioid prescribing, cost outliers, brand-name bias, etc.). It does NOT mean the provider is committing fraud — many flagged patterns have legitimate clinical explanations. Pain management specialists, for example, are expected to prescribe more opioids.',
  },
  {
    q: 'How is the risk score calculated?',
    a: 'We use a 10-component rule-based model scoring providers on opioid prescribing, costs, brand preference, drug combinations, LEIE exclusion, and more — all adjusted by specialty. In addition, a machine learning model trained on 281 confirmed fraud cases identifies providers with similar prescribing patterns. See our Methodology page for details.',
  },
  {
    q: 'What is the ML Fraud Detection model?',
    a: 'Our machine learning model is a Bagged Decision Trees ensemble trained on confirmed fraud cases from the OIG exclusion list. It analyzes 20 prescribing features and identifies non-obvious pattern combinations that our rule-based scoring misses. The model flagged 4,100+ providers at ≥80% confidence. ML scores appear on provider profiles and on the ML Fraud Detection page.',
  },
  {
    q: 'Why are provider names public?',
    a: 'CMS releases provider-level prescribing data as public information under federal transparency policies. The Supreme Court upheld this in 2015. Provider names, NPIs, and practice locations are intentionally public to enable oversight and research.',
  },
  {
    q: 'What does "EXCLUDED" mean?',
    a: 'Providers marked as excluded appear on the OIG\'s List of Excluded Individuals/Entities (LEIE). These are individuals convicted of healthcare fraud, patient abuse, or related offenses. Excluded providers are prohibited from participating in federal healthcare programs. Our matching is based on NPI numbers.',
  },
  {
    q: 'Why does a provider show 100% opioid rate?',
    a: 'Providers with very small numbers of claims (e.g., 12 total claims) can show extreme rates. We filter the Top Opioid Prescribers list to providers with at least 100 claims to avoid misleading small-sample results.',
  },
  {
    q: 'Is this site anti-doctor?',
    a: 'No. OpenPrescriber is a data transparency tool. The vast majority of providers have normal prescribing patterns. We provide context and disclaimers throughout the site noting that statistical outliers are not allegations. The goal is informed public discourse, not witch hunts.',
  },
  {
    q: 'Can I download the data?',
    a: 'Yes! Visit our Downloads page for processed JSON datasets, or access the original source data directly from CMS and OIG.',
  },
  {
    q: 'How often is the data updated?',
    a: 'CMS releases new Part D data annually, typically with a 2-year lag. We currently show 2023 data (the most recent available). We will update when CMS publishes 2024 data.',
  },
]

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'FAQ' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-6">Frequently Asked Questions</h1>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question', name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      })}} />

      <div className="space-y-6">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">{f.q}</h2>
            <p className="text-gray-600 mt-2">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm">
        Have more questions? Check our <Link href="/methodology" className="text-primary hover:underline">Methodology</Link> or <Link href="/about" className="text-primary hover:underline">About</Link> pages.
      </div>
    </div>
  )
}
