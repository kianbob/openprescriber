import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'Medicare Fraud: How It Works, How We Detect It, and What the Data Shows',
  description: 'Medicare fraud costs taxpayers $31+ billion annually. See how our data analysis and machine learning detect suspicious prescribing patterns in Medicare Part D.',
  alternates: { canonical: 'https://www.openprescriber.org/medicare-fraud' },
}

export default function MedicareFraudPage() {
  const stats = loadData('stats.json')
  const mlData = loadData('ml-predictions.json') as { totalFlagged: number; cv: { precision: number; recall: number }; predictions: { npi: string; name: string; city: string; state: string; specialty: string; score: number }[] }
  const excluded = loadData('excluded.json') as { npi: string; name: string }[]
  const highRisk = loadData('high-risk.json') as { riskScore: number; specialty: string; state: string }[]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Medicare Fraud' }]} />
      <DisclaimerBanner variant="risk" />

      <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] mb-4">Medicare Fraud: Following the Money in Part D</h1>
      <p className="text-lg text-gray-600 mb-4">
        Medicare improper payments exceeded <strong>$31 billion in 2024</strong> according to CMS. With $275.6 billion flowing through Part D alone, even small fraud rates translate to billions in waste. Here&apos;s what the data actually shows.
      </p>
      <ShareButtons title="Medicare Fraud: What the Data Shows" />

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-red-50 rounded-xl p-5 text-center border border-red-200">
          <p className="text-2xl font-bold text-red-700">{fmt(highRisk.filter(p => p.riskScore >= 50).length)}</p>
          <p className="text-xs text-gray-600 mt-1">High-Risk Providers</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-5 text-center border border-purple-200">
          <p className="text-2xl font-bold text-purple-700">4,100+</p>
          <p className="text-xs text-gray-600 mt-1">ML-Flagged Providers</p>
        </div>
        <div className="bg-red-50 rounded-xl p-5 text-center border border-red-200">
          <p className="text-2xl font-bold text-red-700">{excluded.length}</p>
          <p className="text-xs text-gray-600 mt-1">Excluded Still Active</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-200">
          <p className="text-2xl font-bold text-primary">$31B+</p>
          <p className="text-xs text-gray-600 mt-1">Improper Payments (FY2024)</p>
        </div>
      </div>

      <div className="prose prose-gray max-w-none mt-10">
        <h2>How Medicare Fraud Works</h2>
        <p>
          Medicare fraud comes in many forms, but in Part D (prescription drugs), the most common patterns include:
        </p>
        <ul>
          <li><strong>Pill mills</strong> — Providers running high-volume opioid practices with minimal patient evaluation, prescribing controlled substances to patients who don&apos;t need them or selling them on the black market.</li>
          <li><strong>Kickback schemes</strong> — Prescribing expensive brand-name drugs when cheaper generics exist, often in exchange for manufacturer payments or pharmacy rebates.</li>
          <li><strong>Identity fraud</strong> — Billing Medicare for prescriptions never written, using stolen patient or provider identities.</li>
          <li><strong>Unnecessary prescribing</strong> — Writing prescriptions for drugs patients don&apos;t need, generating revenue through volume.</li>
          <li><strong>Upcoding</strong> — Prescribing more expensive versions of drugs when cheaper alternatives would be clinically appropriate.</li>
        </ul>

        <h2>What Our Data Analysis Reveals</h2>
        <p>
          By analyzing {fmt(stats.providers)} Medicare Part D prescribers across $275.6 billion in drug costs, we&apos;ve identified several concerning patterns:
        </p>

        <h3>🔴 {excluded.length} Excluded Providers Still Prescribing</h3>
        <p>
          The OIG maintains a <Link href="/excluded">List of Excluded Individuals/Entities (LEIE)</Link> — providers convicted of healthcare fraud, patient abuse, or other offenses. Despite being excluded, {excluded.length} of these providers still appear as active Medicare Part D prescribers in 2023 data. This raises serious questions about CMS enforcement.
        </p>

        <h3>🤖 Machine Learning Catches What Rules Miss</h3>
        <p>
          Our <Link href="/ml-fraud-detection">ML fraud detection model</Link>, trained on 281 confirmed fraud cases from the LEIE, flagged 4,100+ providers with prescribing patterns that statistically resemble known fraud. Of these, 2,579 were <em>not</em> caught by traditional rule-based scoring — suggesting a significant blind spot in conventional approaches.
        </p>

        <h3>💊 The Opioid Signal</h3>
        <p>
          Opioid prescribing is the strongest single indicator in our model. Providers who prescribe opioids at rates far above their specialty peers — particularly <Link href="/dangerous-combinations">combined with benzodiazepines</Link> — are disproportionately represented among confirmed fraud cases. We track {fmt(stats.opioidProv)} opioid prescribers, with {fmt(stats.highOpioid)} prescribing at rates above 20%.
        </p>

        <h3>💰 Cost Outliers Signal Waste</h3>
        <p>
          Some providers prescribe drugs costing 10-50x more per patient than their specialty average. While some have legitimate clinical reasons (treating rare diseases, complex cases), the statistical overlap with fraud is significant. Our <Link href="/analysis/cost-outliers">cost outlier analysis</Link> breaks this down.
        </p>

        <h2>How We Detect Suspicious Patterns</h2>
        <p>
          OpenPrescriber uses two complementary approaches:
        </p>
        <ol>
          <li><strong><Link href="/methodology">10-Component Rule-Based Scoring</Link></strong> — Combines specialty-adjusted opioid z-scores, cost outliers, brand preference, elderly antipsychotic use, LEIE cross-referencing, drug diversity, and dangerous combinations into a transparent 0-100 score.</li>
          <li><strong><Link href="/ml-fraud-detection">Bagged Decision Tree ML Model</Link></strong> — 20 decision trees trained on confirmed fraud labels, achieving 83% precision and 67% recall in cross-validation.</li>
        </ol>
        <p>
          Neither system makes accusations — they identify statistical patterns for further investigation.
        </p>

        <h2>The $275 Billion Question</h2>
        <p>
          If even 3% of Medicare Part D spending involves fraud or waste, that&apos;s $8+ billion per year. Better data transparency — making prescribing patterns visible to researchers, journalists, and the public — is one of the most effective tools for accountability.
        </p>
        <p>
          Every dollar wasted on fraudulent prescriptions is a dollar not available for legitimate patient care.
        </p>
      </div>

      {/* Explore More */}
      <section className="mt-10 bg-gray-50 rounded-xl p-6 border">
        <h2 className="text-lg font-bold mb-4">Explore Fraud & Risk Data</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Link href="/flagged" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium">🔴 Flagged Providers</Link>
          <Link href="/ml-fraud-detection" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium">🤖 ML Fraud Detection</Link>
          <Link href="/excluded" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium">🚫 Excluded Providers</Link>
          <Link href="/risk-explorer" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium">🔍 Risk Explorer</Link>
          <Link href="/dangerous-combinations" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium">⚠️ Dangerous Combos</Link>
          <Link href="/methodology" className="bg-white rounded-lg p-3 border hover:shadow-sm text-sm text-primary font-medium">📋 Our Methodology</Link>
        </div>
      </section>
    </div>
  )
}
