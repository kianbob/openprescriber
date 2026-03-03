import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'
import RelatedAnalysis from '@/components/RelatedAnalysis'

export const metadata: Metadata = {
  title: 'How We Score Prescribing Risk: Specialty-Adjusted Peer Comparison',
  description: 'Our 10-component risk scoring model combines specialty-adjusted z-scores, population percentiles, drug combination analysis, and OIG exclusion matching across 1.38M providers.',
  openGraph: {
    title: 'How We Score Prescribing Risk: Specialty-Adjusted Peer Comparison',
    description: 'Our 10-component risk scoring model combines specialty-adjusted z-scores, population percentiles, drug combination analysis, and OIG exclusion matching across 1.38M providers.',
    url: 'https://www.openprescriber.org/analysis/fraud-risk-methodology',
    type: 'article',
  },
  alternates: { canonical: 'https://www.openprescriber.org/analysis/fraud-risk-methodology' },
}

export default function FraudRiskMethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema
        title="How We Score Prescribing Risk"
        description="Our 10-component risk scoring model combines specialty-adjusted z-scores, population percentiles, and drug combination analysis."
        slug="fraud-risk-methodology"
        date="2026-02-27"
      />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Risk Scoring Methodology' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">How We Score Prescribing Risk</h1>
      <ShareButtons title="How We Score Prescribing Risk — OpenPrescriber" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          OpenPrescriber uses a unified 10-component risk scoring model that combines two complementary approaches: <strong>specialty-adjusted peer comparison</strong> (how far does a provider deviate from others in their specialty?) and <strong>population-level analysis</strong> (where do they fall nationally?). This dual approach avoids the critical flaw of universal thresholds and produces more accurate results than either method alone.
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-3 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">10</p>
            <p className="text-xs text-blue-600">Risk Components</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">110</p>
            <p className="text-xs text-blue-600">Specialties Profiled</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">233</p>
            <p className="text-xs text-red-600">High Risk (≥50)</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
            <p className="text-2xl font-bold text-orange-700">6,473</p>
            <p className="text-xs text-orange-600">Elevated (≥30)</p>
          </div>
        </div>

        <h2>Why Specialty-Adjusted Scoring?</h2>
        <p>
          Most fraud detection tools use <strong>universal thresholds</strong> — for example, flagging anyone with an opioid prescribing rate above 20%. This approach generates massive false positives. A pain management specialist at 50% opioid prescribing is entirely normal for their field. A family doctor at 50% is 13 standard deviations above their specialty average — a genuinely extreme outlier.
        </p>
        <p>
          Our model computes baseline statistics (mean, standard deviation, percentile distributions) for <Link href="/specialty-profiles" className="text-primary hover:underline">110 medical specialties</Link>. Each provider is then scored against their own specialty peers. This means a pain management doctor is compared to other pain management doctors, an oncologist to other oncologists, and a family physician to other family physicians.
        </p>
        <p>
          The technical implementation uses <strong>z-scores</strong> — the number of standard deviations a provider&apos;s metric falls above or below their specialty mean. A z-score of 2 means the provider is roughly in the top 2-3% of their specialty. A z-score of 5 means they&apos;re far beyond what any normal clinical variation can explain.
        </p>

        <h2>The 10 Scoring Components</h2>
        <p>Each component contributes points to a composite score (max 100). Points are additive, with a volume multiplier applied at the end.</p>

        <h3>1. Specialty-Adjusted Opioid Rate (0–25 points)</h3>
        <p>
          The most important component. We compute each provider&apos;s opioid prescribing z-score against their specialty. A family doctor with 3.78% mean opioid rate (σ=10.2) gets flagged very differently than a pain management specialist with a 35.3% mean (σ=22.1).
        </p>
        <ul>
          <li><strong>&gt;5σ above peers:</strong> 25 points (extreme — virtually impossible by chance)</li>
          <li><strong>&gt;3σ above peers:</strong> 18 points (very high — top ~0.1% of specialty)</li>
          <li><strong>&gt;2σ above peers:</strong> 10 points (high — top ~2% of specialty)</li>
        </ul>

        <h3>2. Population Percentile Opioid Rate (0–15 points)</h3>
        <p>
          Independent of specialty, we check where the provider falls in the <strong>national distribution</strong> of all 433,324 providers with opioid claims. This catches cases where a specialty itself has unusual norms.
        </p>
        <ul>
          <li><strong>99th percentile</strong> (rate &gt;70.6%): 15 points</li>
          <li><strong>95th percentile</strong> (&gt;50.3%): 10 points</li>
          <li><strong>90th percentile</strong> (&gt;37.2%): 5 points</li>
        </ul>

        <h3>3. Cost Outlier (0–10 points)</h3>
        <p>
          Requires a <strong>dual condition</strong>: the provider must be high both in population percentile AND relative to their specialty peers (z-score). This prevents flagging oncologists whose high costs are normal for their field.
        </p>

        <h3>4. Brand-Name Preference (0–8 points)</h3>
        <p>
          Flags providers prescribing far more <Link href="/brand-vs-generic" className="text-primary hover:underline">brand-name drugs</Link> than their specialty peers. Only triggered when z-score exceeds 2–3 AND the absolute brand percentage exceeds 30–50%. This avoids flagging specialties where brand-name drugs are clinically necessary.
        </p>

        <h3>5. Long-Acting Opioid Rate (0–8 points)</h3>
        <p>
          Long-acting opioids (OxyContin, MS Contin, fentanyl patches) carry higher diversion and abuse potential. We flag providers whose long-acting opioid share exceeds 3 standard deviations above their specialty mean.
        </p>

        <h3>6. Elderly Antipsychotic Prescribing (0–10 points)</h3>
        <p>
          CMS specifically tracks <Link href="/analysis/antipsychotic-elderly" className="text-primary hover:underline">antipsychotic prescribing to patients 65+</Link> as a quality concern — these drugs carry FDA Black Box Warnings for increased mortality in elderly dementia patients.
        </p>

        <h3>7. Opioid + Benzodiazepine Co-Prescribing (0–8 points)</h3>
        <p>
          By analyzing the full <strong>11.9 million-row provider-drug dataset</strong>, we identify providers who prescribe both opioids and benzodiazepines. The FDA issued a <Link href="/dangerous-combinations" className="text-primary hover:underline">Black Box Warning</Link> about this combination due to life-threatening respiratory depression. We identified <strong>6,149 co-prescribers</strong>.
        </p>

        <h3>8. OIG Exclusion Match (0–20 points)</h3>
        <p>
          We cross-reference every provider NPI against the Office of Inspector General&apos;s <Link href="/excluded" className="text-primary hover:underline">List of Excluded Individuals/Entities (LEIE)</Link> — individuals convicted of healthcare fraud, patient abuse, or related offenses. We found <strong>372 excluded providers still actively prescribing</strong> in Medicare Part D.
        </p>

        <h3>9. Low Drug Diversity (0–5 points)</h3>
        <p>
          Providers who prescribe a very narrow range of drugs (≤5–10 unique medications) while also prescribing opioids may indicate a &ldquo;pill mill&rdquo; operation rather than a genuine medical practice. Legitimate practices typically prescribe across a broad range of drug categories.
        </p>

        <h3>10. High Fills Per Patient (0–5 points)</h3>
        <p>
          Providers whose patients average more than 15–20 prescription fills per year may indicate over-prescribing or patients being used as conduits for drug diversion. This metric is specialty-adjusted to account for fields like psychiatry where multiple maintenance medications are common.
        </p>

        <h2>Volume Adjustments</h2>
        <p>Two volume-related adjustments improve accuracy:</p>
        <ul>
          <li><strong>Minimum threshold:</strong> Providers with fewer than 100 claims are excluded entirely — too little data for meaningful statistical analysis.</li>
          <li><strong>Low-volume cap:</strong> Providers with 100–200 claims have their percentile-based flags capped at 60% — acknowledging higher statistical noise.</li>
          <li><strong>High-volume multiplier:</strong> Providers with &gt;5,000 claims receive a 15% score boost, because the same risky patterns at scale affect vastly more patients. Providers with &gt;2,000 claims get 5%.</li>
        </ul>

        <h2>Risk Levels</h2>
        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
          <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
            <p className="font-bold text-red-700">🔴 High (≥50)</p>
            <p className="text-xs text-gray-600">233 providers</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-200">
            <p className="font-bold text-orange-700">🟠 Elevated (30–49)</p>
            <p className="text-xs text-gray-600">6,473 providers</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-200">
            <p className="font-bold text-yellow-700">🟡 Moderate (15–29)</p>
            <p className="text-xs text-gray-600">43,120 providers</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
            <p className="font-bold text-green-700">🟢 Low (0–14)</p>
            <p className="text-xs text-gray-600">842,305 providers</p>
          </div>
        </div>

        <h2>What This Looks Like in Practice</h2>
        <p>Consider our highest-scoring provider (77/100): an internal medicine doctor who:</p>
        <ul>
          <li>Prescribes opioids at 62% of claims — <strong>2,687% above</strong> the internal medicine average of 2.2%</li>
          <li>Co-prescribes opioids and benzodiazepines (FDA Black Box Warning combination)</li>
          <li>Appears on the OIG exclusion list (convicted of healthcare offense)</li>
          <li>Prescribes only 6 unique drugs (extremely low diversity)</li>
          <li>Has elevated long-acting opioid prescribing vs peers</li>
        </ul>
        <p>
          Every single component is transparent and explainable. You can see exactly why they scored 77 — 25 points for extreme opioid vs peers, 10 for 95th percentile nationally, 20 for LEIE exclusion, 8 for opioid+benzo combo, 8 for LA opioid, 3 for elevated cost, and 3 for low diversity.
        </p>
        <p>
          Explore flagged providers yourself on the <Link href="/risk-explorer" className="text-primary hover:underline">Risk Explorer</Link>, or see the full <Link href="/flagged" className="text-primary hover:underline">flagged providers list</Link>.
        </p>

        <h2>Key Limitations</h2>
        <ul>
          <li><strong>No clinical context:</strong> We cannot see diagnoses, treatment plans, or medical necessity. High opioid rates may be entirely appropriate for hospice, palliative care, or addiction treatment.</li>
          <li><strong>Specialty misclassification:</strong> If CMS lists a provider under the wrong specialty, the peer comparison may be inaccurate.</li>
          <li><strong>Single-year snapshot:</strong> 2023 data only — providers may have changed practices since then.</li>
          <li><strong>Right-skewed distributions:</strong> Some specialties (like NPs, with mean 3.8% and σ=10.2%) have highly skewed distributions where the standard deviation is larger than the mean. Z-scores work less well for heavily skewed data.</li>
          <li><strong>Correlation ≠ fraud:</strong> Statistical outliers are not inherently problematic. Our scores identify unusual patterns, not bad actors.</li>
        </ul>

        <h2>Machine Learning Extension</h2>
        <p>
          Beyond the rule-based model, OpenPrescriber now includes a <strong>machine learning fraud detection system</strong> trained on 281 confirmed fraud cases from the OIG LEIE exclusion list. The ML model — a Bagged Decision Trees ensemble — analyzes the same 20 features and identifies <strong>non-obvious pattern combinations</strong> that hand-tuned rules miss.
        </p>
        <p>
          The ML model flagged <strong>4,100+ providers</strong> at ≥80% confidence. Cross-validated performance: 83% precision, 66.6% recall. See the <Link href="/ml-fraud-detection" className="text-primary hover:underline">ML Fraud Detection page</Link> for full results and the complete list of flagged providers.
        </p>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-blue-800 font-medium">Explore the Models</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/risk-explorer" className="text-sm text-primary hover:underline">Risk Explorer</Link>
            <Link href="/ml-fraud-detection" className="text-sm text-primary hover:underline">ML Fraud Detection</Link>
            <Link href="/flagged" className="text-sm text-primary hover:underline">🔴 Flagged Providers</Link>
            <Link href="/methodology" className="text-sm text-primary hover:underline">📋 Full Methodology</Link>
            <Link href="/peer-comparison" className="text-sm text-primary hover:underline">📊 Peer Comparison</Link>
            <Link href="/specialty-profiles" className="text-sm text-primary hover:underline">⚕️ Specialty Profiles</Link>
          </div>
        </div>

        <div className="mt-8 text-xs text-gray-400 border-t pt-4">
          <p>Data: CMS Medicare Part D (2023), OIG LEIE. Risk scores are computed by OpenPrescriber for informational purposes. They do not constitute allegations of fraud, abuse, or inappropriate prescribing.</p>
        </div>
      <RelatedAnalysis current={"/analysis/fraud-risk-methodology"} />
      </div>
    </div>
  )
}
