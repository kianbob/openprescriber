import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'

export const metadata: Metadata = {
  title: 'How We Score Prescribing Risk',
  description: 'A transparent look at our multi-factor risk scoring model for Medicare prescribers — how percentiles work, what flags mean, and the methodology behind the scores.',
  alternates: { canonical: 'https://www.openprescriber.org/analysis/fraud-risk-methodology' },
}

export default function FraudRiskMethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema
        title="How We Score Prescribing Risk"
        description="A transparent look at our multi-factor risk scoring model for Medicare prescribers."
        slug="fraud-risk-methodology"
        date="2026-02-27"
      />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Risk Scoring Methodology' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">How We Score Prescribing Risk</h1>
      <ShareButtons title="How We Score Prescribing Risk" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          OpenPrescriber assigns risk scores to Medicare Part D providers based on multiple prescribing factors. This page explains exactly how those scores work — what goes into them, how percentiles are calculated, and what the flags mean. Transparency is fundamental to our mission.
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">5</p>
            <p className="text-xs text-blue-600">Risk Factors Scored</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">0–100</p>
            <p className="text-xs text-blue-600">Percentile Scale</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">95th+</p>
            <p className="text-xs text-red-600">High Risk Threshold</p>
          </div>
        </div>

        <h2>Why Risk Scores?</h2>
        <p>
          With over 1.38 million Medicare Part D prescribers, identifying unusual patterns requires systematic analysis. Human reviewers can&apos;t examine every provider individually, so CMS, insurance companies, and oversight bodies rely on statistical models to prioritize review. Our risk scores serve a similar purpose: surfacing providers whose prescribing patterns diverge significantly from their peers.
        </p>
        <p>
          Critically, a high risk score does <strong>not</strong> mean a provider is committing fraud or practicing bad medicine. It means their prescribing patterns are statistically unusual and may warrant closer examination. Many high-scoring providers have perfectly legitimate explanations — they may treat unusually complex patients, specialize in conditions requiring expensive medications, or practice in areas with unique demographic needs.
        </p>

        <h2>The Five Risk Factors</h2>
        <p>
          Our composite risk score combines five individual metrics, each calculated as a percentile rank within the provider&apos;s <Link href="/analysis/specialty-deep-dive" className="text-primary hover:underline">specialty peer group</Link>:
        </p>
        <p>
          <strong>1. Total Cost Percentile:</strong> Where does this provider&apos;s total drug cost fall relative to others in the same specialty? A provider at the 99th percentile generates more drug spending than 99% of their specialty peers. This captures both high-volume prescribing and preference for expensive medications.
        </p>
        <p>
          <strong>2. Opioid Rate Percentile:</strong> What percentage of this provider&apos;s prescriptions are for opioids, compared to specialty peers? Elevated opioid prescribing is one of the strongest signals tracked by CMS and law enforcement, as it correlates with both over-prescribing and diversion risk.
        </p>
        <p>
          <strong>3. Brand-Name Rate Percentile:</strong> How often does this provider choose brand-name drugs when generics are available? While sometimes clinically justified, persistently high brand-name rates can indicate pharmaceutical company influence or prescribing habits misaligned with evidence-based guidelines.
        </p>
        <p>
          <strong>4. Average Cost Per Claim Percentile:</strong> Is this provider&apos;s average cost per prescription unusually high? This helps identify providers who consistently prescribe the most expensive option within a drug class, even when less expensive alternatives have equivalent efficacy.
        </p>
        <p>
          <strong>5. Beneficiary-to-Claim Ratio:</strong> Does the ratio of unique patients to total claims suggest unusual patterns? Extremely high claims-per-beneficiary ratios can indicate over-prescribing, while unusual beneficiary patterns may suggest other concerns.
        </p>

        <h2>Specialty-Adjusted Percentiles</h2>
        <p>
          The most important design decision in our model is comparing providers against their specialty peers, not the overall population. An oncologist prescribing $3 million in cancer drugs should be compared to other oncologists, not to optometrists. Without specialty adjustment, the scores would simply flag every oncologist, cardiologist, and rheumatologist as high-risk — which tells us nothing useful.
        </p>
        <p>
          For each of the five factors, we calculate percentile ranks within specialty groups. A 95th percentile cost rank for a family physician means they cost more than 95% of other family physicians — a genuinely unusual pattern within their peer group.
        </p>

        <h2>Composite Score Calculation</h2>
        <p>
          The composite risk score is a weighted average of the five individual percentile scores. The weights reflect the relative importance of each factor based on published research on prescribing fraud indicators:
        </p>
        <p>
          Total cost and opioid rate receive the highest weights, as they are the strongest predictors of problematic prescribing in the academic literature. Brand-name rate and cost per claim receive moderate weights. The beneficiary-to-claim ratio receives the lowest weight, as it&apos;s the most susceptible to legitimate variation.
        </p>
        <p>
          The final composite score ranges from 0 to 100. We categorize providers into risk tiers: low (below 50th percentile), moderate (50th-75th), elevated (75th-90th), high (90th-95th), and very high (above 95th percentile).
        </p>

        <h2>What the Flags Mean</h2>
        <p>
          Beyond the numeric score, we flag specific concerning patterns:
        </p>
        <p>
          <strong>🔴 High Opioid Flag:</strong> Opioid rate above 20% of total prescriptions. This threshold aligns with CMS monitoring criteria and is applied regardless of specialty, though context (pain management, oncology) is noted.
        </p>
        <p>
          <strong>🟡 High Brand Flag:</strong> Brand-name prescribing rate significantly above specialty average. This doesn&apos;t necessarily indicate a problem but suggests the provider isn&apos;t following typical generic substitution patterns.
        </p>
        <p>
          <strong>🔴 OIG Exclusion Match:</strong> The provider appears on the <Link href="/analysis/excluded-still-prescribing" className="text-primary hover:underline">OIG exclusion list</Link>. This is the most serious flag and indicates the provider has been formally excluded from federal healthcare programs.
        </p>

        <h2>Limitations and Caveats</h2>
        <p>
          No statistical model can determine clinical appropriateness from claims data alone. Our scores identify statistical outliers, not bad actors. Important limitations include:
        </p>
        <p>
          The data doesn&apos;t include clinical diagnoses or patient complexity. A provider with a high opioid rate may exclusively treat chronic pain patients — entirely appropriate prescribing that looks like an outlier. We can&apos;t distinguish a cardiologist who treats the sickest patients from one who over-prescribes.
        </p>
        <p>
          Small-volume providers produce noisier statistics. A provider with only 20 prescriptions can show extreme percentiles that don&apos;t reflect stable patterns. We apply minimum thresholds to reduce noise, but some volatility remains for low-volume prescribers.
        </p>
        <p>
          The model reflects one year of data. Providers may have unusual years due to practice changes, patient panel shifts, or data reporting issues. Longitudinal analysis across multiple years would be more robust but is beyond the current scope.
        </p>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">Search providers: <Link href="/providers" className="text-primary font-medium hover:underline">Provider Search →</Link></p>
        </div>

        <div className="mt-8 text-xs text-gray-400 border-t pt-4">
          <p>Data source: CMS Medicare Part D Prescribers dataset (2023). Risk scores are computed by OpenPrescriber and are not endorsed by or affiliated with CMS. Scores are for informational and research purposes only. They do not constitute allegations of fraud, waste, abuse, or inappropriate prescribing. Always consider clinical context before drawing conclusions about any individual provider.</p>
        </div>
      </div>
    </div>
  )
}
