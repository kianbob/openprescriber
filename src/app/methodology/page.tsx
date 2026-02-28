import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Methodology: How We Score Risk',
  description: 'Detailed explanation of OpenPrescriber\'s multi-factor risk scoring methodology for Medicare Part D providers.',
  alternates: { canonical: 'https://www.openprescriber.org/methodology' },
}

export default function MethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Methodology' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-6">Risk Scoring Methodology</h1>

      <div className="prose prose-gray max-w-none">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 not-prose mb-6">
          <p className="text-sm text-amber-800"><strong>⚠️ Disclaimer:</strong> Risk scores are statistical indicators, not allegations. Many flagged patterns have legitimate clinical explanations.</p>
        </div>

        <h2>Overview</h2>
        <p>Our risk scoring model assigns each provider a score from 0–100 based on six independent factors. Each factor measures how far a provider deviates from statistical norms.</p>

        <h2>Scoring Factors</h2>

        <h3>1. Opioid Prescribing Rate (0–30 points)</h3>
        <p>We compare each provider&apos;s opioid prescribing rate (percentage of claims that are opioids) against the distribution of all prescribers with opioid claims.</p>
        <ul>
          <li><strong>99th percentile or above:</strong> 30 points (extreme outlier)</li>
          <li><strong>95th–99th percentile:</strong> 20 points (very high)</li>
          <li><strong>90th–95th percentile:</strong> 10 points (high)</li>
        </ul>

        <h3>2. Long-Acting Opioid Rate (0–15 points)</h3>
        <p>Long-acting opioids carry higher abuse potential. We flag providers where long-acting opioids make up a disproportionate share of prescribing.</p>
        <ul>
          <li><strong>Rate above 10%:</strong> 15 points</li>
          <li><strong>Rate 5–10%:</strong> 8 points</li>
        </ul>

        <h3>3. Cost Per Beneficiary (0–15 points)</h3>
        <p>Providers whose cost-per-patient exceeds the 95th or 99th percentile. Requires at least 11 beneficiaries to avoid small-sample bias.</p>

        <h3>4. Brand-Name Prescribing (0–10 points)</h3>
        <p>Providers prescribing a disproportionate share of brand-name drugs when generics are available. Requires at least 50 claims.</p>

        <h3>5. Antipsychotic Prescribing to Elderly (0–15 points)</h3>
        <p>CMS tracks antipsychotic prescribing to patients 65+ as a quality concern. We flag providers with elevated rates.</p>

        <h3>6. OIG Exclusion Status (100 points)</h3>
        <p>Providers matched to the OIG&apos;s List of Excluded Individuals/Entities (LEIE) — individuals convicted of healthcare fraud, patient abuse, or related offenses — automatically receive the maximum score.</p>

        <h3>7. High-Volume + High Opioid Combo (0–15 points)</h3>
        <p>Providers with both high volume (&gt;5,000 claims) and elevated opioid rates (&gt;15%) receive additional weight, as the combination amplifies potential impact.</p>

        <h2>Risk Levels</h2>
        <ul>
          <li><strong>🔴 High (50+):</strong> Multiple significant risk factors or LEIE exclusion</li>
          <li><strong>🟠 Elevated (25–49):</strong> One or more notable risk factors</li>
          <li><strong>🟡 Moderate (10–24):</strong> Minor statistical deviations</li>
          <li><strong>🟢 Low (0–9):</strong> Within normal ranges</li>
        </ul>

        <h2>Limitations</h2>
        <ul>
          <li>Pain management specialists are expected to have higher opioid rates</li>
          <li>Oncologists prescribe expensive brand-name drugs by clinical necessity</li>
          <li>Small beneficiary counts can skew per-patient metrics</li>
          <li>CMS suppresses data for providers with fewer than 11 beneficiaries</li>
          <li>One year of data cannot capture trends or context</li>
        </ul>

        <h2>Data Processing</h2>
        <p>All percentiles are computed against the full population of 199,202 Medicare Part D prescribers in the 2023 dataset. Percentile calculations use sampled data (every 3rd record) for memory efficiency with no statistically significant difference from full computation.</p>
      </div>
    </div>
  )
}
