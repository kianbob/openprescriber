import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Methodology: How We Score Risk — Specialty-Adjusted Peer Comparison',
  description: 'OpenPrescriber\'s unified risk scoring methodology: specialty-adjusted z-scores, population percentiles, drug combination analysis, and OIG exclusion matching across 1.38M providers.',
  alternates: { canonical: 'https://www.openprescriber.org/methodology' },
}

export default function MethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Methodology' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-6">Risk Scoring Methodology</h1>

      <div className="prose prose-gray max-w-none">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 not-prose mb-6">
          <p className="text-sm text-amber-800"><strong>⚠️ Disclaimer:</strong> Risk scores are statistical indicators, not allegations of fraud or malpractice. Many flagged patterns have legitimate clinical explanations. Always consider the full context before drawing conclusions.</p>
        </div>

        <h2>Overview</h2>
        <p>OpenPrescriber uses a <strong>unified multi-factor risk scoring model</strong> that assigns each provider a score from 0–100. The model combines two complementary approaches:</p>
        <ol>
          <li><strong>Specialty-adjusted peer comparison</strong> — How far does this provider deviate from others in their specialty? (z-scores)</li>
          <li><strong>Population percentile analysis</strong> — Where does this provider fall in the national distribution?</li>
        </ol>
        <p>This dual approach avoids the critical flaw of universal thresholds. A pain management specialist prescribing 50% opioids is normal for their specialty. A family doctor at 50% is 13 standard deviations above their peers — and our model reflects that.</p>

        <h2>Scoring Components (Max 100 Points)</h2>

        <h3>Component 1: Specialty-Adjusted Opioid Rate (0–25 points)</h3>
        <p>We compute z-scores by comparing each provider&apos;s opioid prescribing rate to their specialty&apos;s mean and standard deviation. This is computed across <strong>110 specialties</strong> with at least 10 providers and a meaningful standard deviation (&gt;0.5%).</p>
        <ul>
          <li><strong>&gt;5 standard deviations:</strong> 25 points — extreme outlier vs peers</li>
          <li><strong>&gt;3 standard deviations:</strong> 18 points — very high vs peers</li>
          <li><strong>&gt;2 standard deviations:</strong> 10 points — high vs peers</li>
        </ul>
        <p>This is the most important and unique component. It answers the question: <em>&ldquo;Does this provider prescribe opioids at an abnormal rate compared to doctors in their same specialty?&rdquo;</em></p>

        <h3>Component 2: Population Percentile Opioid Rate (0–15 points)</h3>
        <p>Independent of specialty, we check where the provider falls in the national distribution of opioid prescribing rates among all 433,324 providers with opioid claims.</p>
        <ul>
          <li><strong>99th percentile</strong> (opioid rate &gt;70.6%): 15 points</li>
          <li><strong>95th percentile</strong> (&gt;50.3%): 10 points</li>
          <li><strong>90th percentile</strong> (&gt;37.2%): 5 points</li>
        </ul>
        <p>Requires ≥11 beneficiaries to avoid small-sample noise.</p>

        <h3>Component 3: Cost Outlier (0–10 points)</h3>
        <p>Flags providers whose cost-per-beneficiary is both high in absolute terms (population percentile) AND high relative to their specialty peers (z-score). This dual requirement reduces false positives from legitimately expensive specialties like oncology.</p>
        <ul>
          <li><strong>99th percentile + &gt;2σ vs peers:</strong> 10 points</li>
          <li><strong>95th percentile + &gt;1.5σ vs peers:</strong> 6 points</li>
          <li><strong>95th percentile alone:</strong> 3 points</li>
        </ul>

        <h3>Component 4: Brand-Name Preference (0–8 points)</h3>
        <p>Providers prescribing far more brand-name drugs than their specialty peers, where generics are available. Only flagged when the z-score exceeds 2–3 AND the absolute brand percentage exceeds 30–50%.</p>

        <h3>Component 5: Long-Acting Opioid Rate (0–8 points)</h3>
        <p>Long-acting opioids carry higher diversion and abuse potential. We flag providers whose long-acting opioid share exceeds 3 standard deviations above their specialty mean.</p>

        <h3>Component 6: Elderly Antipsychotic Prescribing (0–10 points)</h3>
        <p>CMS tracks antipsychotic prescribing to patients 65+ as a <Link href="https://www.cms.gov/newsroom/fact-sheets/cms-issues-final-rule-requiring-reporting-antipsychotic-drug-use-long-term-care-facilities">quality concern</Link>. Providers with &gt;50 claims receive 10 points; &gt;20 claims receive 5 points.</p>

        <h3>Component 7: Opioid + Benzodiazepine Co-Prescribing (0–8 points)</h3>
        <p>The FDA issued a <Link href="https://www.fda.gov/drugs/drug-safety-and-availability/fda-drug-safety-communication-fda-warns-about-serious-risks-and-death-when-combining-opioid-pain-or">Black Box Warning</Link> about combining opioids and benzodiazepines due to life-threatening respiratory depression. We analyze the full <strong>11.9 million-row</strong> provider-drug dataset to identify 6,149 providers who prescribe both drug classes.</p>

        <h3>Component 8: OIG Exclusion Match (0–20 points)</h3>
        <p>We cross-reference every provider NPI against the Office of Inspector General&apos;s <Link href="https://oig.hhs.gov/exclusions/">List of Excluded Individuals/Entities (LEIE)</Link> — individuals convicted of healthcare fraud, patient abuse, or related felonies. We matched <strong>372 excluded providers</strong> who are still actively prescribing in Medicare Part D.</p>

        <h3>Component 9: Low Drug Diversity (0–6 points)</h3>
        <p>Providers who prescribe very few unique drugs (≤5–10) while also prescribing opioids are flagged. A legitimate general practitioner prescribes dozens of different medications. A provider prescribing only 6 drugs — most of them opioids — is a red flag for a &ldquo;pill mill&rdquo; operation. Requires opioid rate &gt;10% and ≥100 claims.</p>

        <h3>Component 10: High Fills Per Patient (0–5 points)</h3>
        <p>Providers whose claims-per-beneficiary ratio exceeds the 95th or 99th percentile (national threshold: &gt;15–20 fills/patient/year). Extremely high fill rates may indicate patients receiving excessive prescriptions or potential doctor shopping facilitation.</p>

        <h3>Volume Multiplier (×1.0–1.15)</h3>
        <p>High-volume providers (&gt;5,000 claims) receive a 15% multiplier on their raw score, because the same risky patterns at scale affect more patients. Providers with &gt;2,000 claims get a 5% multiplier.</p>

        <h3>Minimum Thresholds</h3>
        <p>To reduce noise from low-volume statistical anomalies, we require:</p>
        <ul>
          <li><strong>≥100 claims</strong> for inclusion in scoring (eliminates borderline providers)</li>
          <li><strong>≥11 beneficiaries</strong> (CMS suppression threshold)</li>
          <li><strong>Low-volume penalty:</strong> Providers with &lt;200 claims receive reduced points for population percentile flags (60% cap)</li>
        </ul>

        <h2>Risk Levels</h2>
        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
          <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
            <p className="font-bold text-red-700">High (≥50)</p>
            <p className="text-xs text-gray-600">233 providers</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-200">
            <p className="font-bold text-orange-700">Elevated (30–49)</p>
            <p className="text-xs text-gray-600">6,473 providers</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-200">
            <p className="font-bold text-yellow-700">Moderate (15–29)</p>
            <p className="text-xs text-gray-600">43,120 providers</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
            <p className="font-bold text-green-700">Low (0–14)</p>
            <p className="text-xs text-gray-600">842,305 providers</p>
          </div>
        </div>

        <h2>What Makes This Unique</h2>
        <p>Most fraud detection tools use <strong>universal thresholds</strong> — e.g., &ldquo;flag anyone with &gt;20% opioid rate.&rdquo; This approach generates massive false positives for pain management, anesthesiology, and other specialties where high opioid prescribing is clinically appropriate.</p>
        <p>OpenPrescriber&apos;s specialty-adjusted model:</p>
        <ul>
          <li>Computes baseline statistics for <strong>110 medical specialties</strong> (mean, standard deviation, 50th/90th/95th percentiles)</li>
          <li>Measures each provider against their specialty peers, not the general population</li>
          <li>Requires deviations in <strong>multiple independent dimensions</strong> for high scores</li>
          <li>Analyzes <strong>11.9 million prescription records</strong> for drug combination risks</li>
          <li>Cross-references <strong>8,301 LEIE excluded NPIs</strong> against active prescribers</li>
        </ul>

        <h2>Limitations</h2>
        <ul>
          <li><strong>Specialty misclassification:</strong> If a provider&apos;s CMS-listed specialty doesn&apos;t match their actual practice, peer comparison may be inaccurate</li>
          <li><strong>Practice setting:</strong> Hospice, palliative care, and addiction treatment practices have legitimately high opioid rates that may appear as outliers even within their specialty</li>
          <li><strong>Single-year snapshot:</strong> We analyze 2023 data only; providers may have changed practice patterns since then</li>
          <li><strong>CMS data suppression:</strong> Providers with &lt;11 beneficiaries have certain metrics suppressed by CMS for privacy</li>
          <li><strong>No clinical context:</strong> We cannot see patient diagnoses, treatment plans, or medical necessity. A high opioid rate may be entirely appropriate for the patient population served</li>
          <li><strong>Minimum threshold:</strong> We require ≥50 claims for scoring — very low-volume providers are excluded</li>
        </ul>

        <h2>Machine Learning Fraud Detection</h2>
        <p>In addition to the rule-based scoring model, OpenPrescriber employs a <strong>machine learning model</strong> trained on confirmed fraud cases to identify providers with prescribing patterns consistent with fraud.</p>
        <ul>
          <li><strong>Training data:</strong> 281 confirmed fraud cases from the OIG LEIE exclusion list, matched to active Medicare Part D prescribers</li>
          <li><strong>Algorithm:</strong> Bagged Decision Trees ensemble (20 trees, max depth 7) with 3× oversampling of fraud cases</li>
          <li><strong>Features:</strong> 20 prescribing metrics including opioid rates, cost per beneficiary, brand preference, specialty-adjusted z-scores, drug combination flags, and drug diversity</li>
          <li><strong>Performance:</strong> 5-fold cross-validated — 83% precision, 66.6% recall, F1 score of 0.74</li>
          <li><strong>Results:</strong> 76.5% recall on known fraud cases. 4,100+ providers flagged at ≥80% confidence</li>
        </ul>
        <p>The ML model complements the rule-based system by detecting <strong>non-obvious pattern combinations</strong> that hand-tuned thresholds miss. Both systems are displayed on provider profiles. See the <Link href="/ml-fraud-detection" className="text-primary hover:underline">ML Fraud Detection page</Link> for full results.</p>

        <h2>Data Sources</h2>
        <ul>
          <li><strong>CMS Medicare Part D Prescribers - by Provider (2023):</strong> 1,380,665 provider records with opioid, brand/generic, cost, and demographic data</li>
          <li><strong>CMS Medicare Part D Prescribers - by Provider and Drug (2023):</strong> 11,935,116 prescription records across 1,702 unique drugs — used for drug combination and diversity analysis</li>
          <li><strong>OIG LEIE (Updated Monthly):</strong> 82,715 excluded individuals, 8,301 with valid NPIs — cross-referenced for active Medicare prescribers</li>
          <li><strong>CMS Historical Files (2019–2022):</strong> 5 years of trend data for year-over-year analysis</li>
        </ul>
        <p>All data is publicly available from <Link href="https://data.cms.gov">data.cms.gov</Link> and <Link href="https://oig.hhs.gov/exclusions/">oig.hhs.gov</Link>.</p>
      </div>
    </div>
  )
}
