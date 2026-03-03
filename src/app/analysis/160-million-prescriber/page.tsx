import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import { fmtMoney, fmt } from '@/lib/utils'
import RelatedAnalysis from '@/components/RelatedAnalysis'

const title = 'The $160 Million Prescriber: Investigating Medicare\'s Most Expensive Doctor'
const description =
  'One emergency medicine doctor in Moreno Valley, CA generated $160.3 million in Medicare Part D drug costs — more than any other prescriber in the dataset. Here\'s what the data tells us, and what it doesn\'t.'
const slug = '160-million-prescriber'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `https://www.openprescriber.org/analysis/${slug}`,
    type: 'article',
  },
  alternates: { canonical: `https://www.openprescriber.org/analysis/${slug}` },
}

export default function OneHundredSixtyMillionPrescriberPage() {
  // Key data points from CMS Medicare Part D dataset
  const totalCost = 160_300_000
  const brandCost = 160_200_000
  const genericCost = 116_000
  const totalClaims = 666_251
  const totalBeneficiaries = 492_011
  const costPerBene = 326
  const brandPct = 99.8
  const specialtyAvgBrandPct = 1.48
  const specialtyAvgCostPerBene = 78
  const claimsPerBene = 1.35
  const avgPatientAge = 74
  const emProviderCount = 44_021

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema
        title={title}
        description={description}
        slug={slug}
        date="2026-03-02"
      />
      <Breadcrumbs
        items={[
          { label: 'Analysis', href: '/analysis' },
          { label: 'The $160 Million Prescriber' },
        ]}
      />
      <DisclaimerBanner variant="risk" />

      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2 mt-6">
        The $160 Million Prescriber
      </h1>
      <p className="text-sm text-gray-500 mb-4">
        Published March 2, 2026 &middot; Analysis of 2023 CMS Medicare Part D Public Use File
      </p>
      <ShareButtons title={title} />

      <div className="prose prose-gray max-w-none mt-8">
        <p className="text-lg text-gray-600 leading-relaxed">
          In the entire Medicare Part D prescriber dataset — covering over 1.2 million providers —
          one name sits at the very top of the cost rankings. Not an oncologist prescribing
          cutting-edge biologics. Not a large institutional pharmacy. A single emergency medicine
          physician in Moreno Valley, California:{' '}
          <Link
            href="/providers/1639279417"
            className="text-primary font-semibold hover:underline"
          >
            Armaghan Azad, M.D.
          </Link>{' '}
          (NPI: 1639279417), with {fmtMoney(totalCost)} in total drug costs.
        </p>

        <p>
          That figure demands investigation. Not because it necessarily indicates wrongdoing — but
          because a number this far outside the norm deserves explanation. This analysis examines
          what the public data reveals, what plausible explanations exist, and where the data
          reaches its limits.
        </p>

        <div className="not-prose my-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
          <strong>Important:</strong> This analysis is based entirely on publicly available CMS
          data. It is not an allegation of fraud, waste, or abuse. The data aggregation methods
          used by CMS can produce misleading impressions when institutional prescribing is
          attributed to individual NPIs. We present the data as-is and explore explanations.
        </div>

        {/* ------------------------------------------------------------------ */}
        <h2>The Numbers</h2>

        <p>
          Let&rsquo;s start with the raw statistics, because they are genuinely extraordinary:
        </p>

        <div className="not-prose my-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Total Drug Cost', value: fmtMoney(totalCost) },
              { label: 'Total Claims', value: fmt(totalClaims) },
              { label: 'Unique Beneficiaries', value: fmt(totalBeneficiaries) },
              { label: 'Cost per Beneficiary', value: fmtMoney(costPerBene) },
              { label: 'Brand-Name Rate', value: `${(brandPct ?? 0).toFixed(1)}%` },
              { label: 'Claims per Beneficiary', value: `${(claimsPerBene ?? 0).toFixed(2)}` },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white border rounded-lg p-4 shadow-sm text-center"
              >
                <div className="text-2xl font-bold font-mono text-gray-900">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p>
          To put the volume in context: Dr. Azad&rsquo;s NPI is associated with{' '}
          {fmt(totalBeneficiaries)} unique Medicare beneficiaries. That is not a typo. Nearly half
          a million patients in a single year. The typical emergency medicine provider in the
          Medicare Part D dataset serves far fewer patients — the specialty median is in the low
          hundreds.
        </p>

        <p>
          The cost per beneficiary — {fmtMoney(costPerBene)} — is elevated but not absurd on its
          own. It&rsquo;s {(costPerBene / specialtyAvgCostPerBene).toFixed(1)}x the
          emergency medicine specialty average of {fmtMoney(specialtyAvgCostPerBene)}. Many
          individual providers exceed their specialty average by that margin. What makes this case
          extraordinary is not the per-patient cost but the sheer volume of patients and claims
          flowing through a single NPI.
        </p>

        <h3>The Brand-Name Anomaly</h3>

        <p>
          Perhaps the most striking statistic is the brand-name prescribing rate:{' '}
          {(brandPct ?? 0).toFixed(1)}% of all drug costs are for brand-name medications.
          The emergency medicine specialty average is just{' '}
          {(specialtyAvgBrandPct ?? 0).toFixed(2)}%.
        </p>

        <div className="not-prose my-6">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Metric</th>
                <th className="px-4 py-2 text-right font-semibold">Dr. Azad</th>
                <th className="px-4 py-2 text-right font-semibold">EM Average</th>
                <th className="px-4 py-2 text-right font-semibold">Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-2">Total Drug Cost</td>
                <td className="px-4 py-2 text-right font-mono font-semibold">
                  {fmtMoney(totalCost)}
                </td>
                <td className="px-4 py-2 text-right font-mono text-gray-500">—</td>
                <td className="px-4 py-2 text-right font-mono text-red-600">#1 overall</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Cost per Beneficiary</td>
                <td className="px-4 py-2 text-right font-mono">{fmtMoney(costPerBene)}</td>
                <td className="px-4 py-2 text-right font-mono text-gray-500">
                  {fmtMoney(specialtyAvgCostPerBene)}
                </td>
                <td className="px-4 py-2 text-right font-mono text-red-600">4.2x</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Brand-Name Rate</td>
                <td className="px-4 py-2 text-right font-mono">
                  {(brandPct ?? 0).toFixed(1)}%
                </td>
                <td className="px-4 py-2 text-right font-mono text-gray-500">
                  {(specialtyAvgBrandPct ?? 0).toFixed(2)}%
                </td>
                <td className="px-4 py-2 text-right font-mono text-red-600">67x</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Brand Drug Cost</td>
                <td className="px-4 py-2 text-right font-mono">{fmtMoney(brandCost)}</td>
                <td className="px-4 py-2 text-right font-mono text-gray-500">—</td>
                <td className="px-4 py-2 text-right font-mono">—</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Generic Drug Cost</td>
                <td className="px-4 py-2 text-right font-mono">{fmtMoney(genericCost)}</td>
                <td className="px-4 py-2 text-right font-mono text-gray-500">—</td>
                <td className="px-4 py-2 text-right font-mono">—</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {fmtMoney(brandCost)} in brand-name costs versus {fmtMoney(genericCost)} in generics.
          That ratio — 99.8% brand — is effectively 100%. This suggests that nearly every
          prescription associated with this NPI is for the same (or very few) brand-name
          drug(s). In emergency medicine, where typical prescribing is dominated by short courses
          of generic antibiotics, pain medications, and anti-nausea drugs, this pattern is
          remarkable.
        </p>

        {/* ------------------------------------------------------------------ */}
        <h2>What Could Explain This?</h2>

        <p>
          Before drawing conclusions, it&rsquo;s worth understanding the mechanics of Medicare
          Part D data and how hospital-based prescribing works. Several plausible explanations
          exist — some mundane, some concerning, all worth considering.
        </p>

        <h3>Hospital ER &ldquo;Incident-To&rdquo; Billing</h3>

        <p>
          The most likely explanation is structural. In many hospital emergency departments, a
          single supervising physician&rsquo;s NPI is used as the prescriber of record for all
          Part D prescriptions written in that facility. This is a feature of how CMS aggregates
          data, not necessarily how prescribing decisions are made.
        </p>

        <p>
          If Dr. Azad serves as the medical director or primary attending for a large-volume
          emergency department — or a network of emergency departments — in Moreno Valley, CA, it
          is plausible that hundreds of thousands of prescriptions written by dozens of ER
          physicians, nurse practitioners, and physician assistants are all attributed to his NPI.
        </p>

        <p>
          Moreno Valley is home to Riverside University Health System Medical Center, a major
          county hospital and Level II trauma center serving a large, predominantly Medicare-age
          population in the Inland Empire region. A facility of this size could easily see hundreds
          of thousands of Part D-eligible patients annually.
        </p>

        <p>
          The claims-per-beneficiary ratio supports this theory:{' '}
          {(claimsPerBene ?? 0).toFixed(2)} claims per patient. That is very close to 1 — meaning
          most patients associated with this NPI received a single prescription. This is
          consistent with an ER encounter pattern: patient arrives, receives one drug (likely
          administered in the ER), and the claim is filed under the attending NPI. It would be
          inconsistent with a physician maintaining ongoing relationships with patients.
        </p>

        <h3>A Single Expensive Drug</h3>

        <p>
          The {(brandPct ?? 0).toFixed(1)}% brand-name rate, combined with the near-1:1
          claims-to-beneficiary ratio, strongly suggests that one specific brand-name drug
          dominates this NPI&rsquo;s prescribing profile. While the CMS public use file does not
          break down costs by individual drug at the provider level in the summary dataset, the
          pattern is consistent with a single expensive injectable or biologic being administered
          to nearly every patient.
        </p>

        <p>
          In an emergency department context, several expensive brand-name drugs are commonly
          administered:
        </p>

        <ul>
          <li>
            <strong>Biologics and monoclonal antibodies</strong> — Some ER-administered drugs
            (e.g., for allergic reactions or acute conditions) can cost hundreds of dollars per dose
          </li>
          <li>
            <strong>Antivirals</strong> — Brand-name antiviral treatments for influenza or COVID-19
            can carry high per-dose costs
          </li>
          <li>
            <strong>Specialty injectables</strong> — Certain drugs administered in the ER setting
            are only available as brand-name products with no generic equivalent
          </li>
        </ul>

        <p>
          If the average cost per claim is roughly {fmtMoney(Math.round(totalCost / totalClaims))}{' '}
          ({fmtMoney(totalCost)} / {fmt(totalClaims)} claims), that places the per-prescription
          cost squarely in the range of an expensive brand-name injectable — not an outrageously
          priced specialty drug, but well above generic alternatives.
        </p>

        {/* ------------------------------------------------------------------ */}
        <h2>The 340B Factor</h2>

        <p>
          One factor that could amplify the dollar figures is the 340B Drug Pricing Program.
          Under 340B, qualifying hospitals (including safety-net hospitals and county medical
          centers) purchase outpatient drugs at deeply discounted prices — often 25-50% below
          average wholesale price. However, they may bill Medicare and other payers at standard
          rates.
        </p>

        <p>
          If Dr. Azad is affiliated with a 340B-eligible hospital, the {fmtMoney(totalCost)} in
          drug costs reported in the CMS data reflects Medicare&rsquo;s payment rate, not the
          hospital&rsquo;s actual acquisition cost. The facility could be purchasing these drugs
          for a fraction of that amount. The &ldquo;spread&rdquo; between acquisition cost and
          reimbursement is a feature of the 340B program — it is legal and intentional, designed
          to help safety-net hospitals fund care for uninsured and underinsured patients.
        </p>

        <p>
          This is relevant context because it means the {fmtMoney(totalCost)} figure may
          overstate the true economic cost. The drugs were likely acquired for far less. Whether
          this constitutes efficient use of Medicare funds is a policy question, not a fraud
          question.
        </p>

        <p>
          Riverside University Health System Medical Center, as a county-operated safety-net
          hospital, would almost certainly qualify for 340B pricing. This makes the 340B
          explanation highly plausible for this specific case.
        </p>

        {/* ------------------------------------------------------------------ */}
        <h2>What the Data Can&rsquo;t Tell Us</h2>

        <p>
          The CMS Medicare Part D Public Use File is a powerful dataset, but it has significant
          limitations that are directly relevant to interpreting cases like this one:
        </p>

        <ul>
          <li>
            <strong>No institutional context.</strong> The data attributes prescriptions to
            individual NPIs (this is an individual NPI, entity code &ldquo;I&rdquo;), but does
            not indicate whether the prescribing occurred in an institutional setting. There is no
            way to distinguish &ldquo;Dr. Azad personally chose this drug for this patient&rdquo;
            from &ldquo;this prescription was written in a facility where Dr. Azad&rsquo;s NPI is
            the default prescriber of record.&rdquo;
          </li>
          <li>
            <strong>No drug-level detail in the summary.</strong> The provider summary file shows
            aggregate costs and claim counts, but does not identify which specific drugs were
            prescribed. The drug-level detail files exist but are structured differently and
            subject to additional suppression rules.
          </li>
          <li>
            <strong>No 340B indicator.</strong> The dataset does not flag whether a provider or
            facility participates in the 340B program.
          </li>
          <li>
            <strong>No clinical context.</strong> We cannot determine whether the prescribing was
            clinically appropriate. A {fmtMoney(costPerBene)} cost per patient could be entirely
            justified if the drug is medically necessary and no cheaper alternative exists.
          </li>
          <li>
            <strong>No information on who actually wrote the prescription.</strong> In a hospital
            setting, the prescribing NPI may be a supervising physician who did not personally
            evaluate the patient or select the drug.
          </li>
        </ul>

        <p>
          These limitations are not unique to this case. They affect the interpretation of every
          high-volume provider in the dataset. But they are especially important here because the
          numbers are so large that they invite assumptions the data cannot support.
        </p>

        {/* ------------------------------------------------------------------ */}
        <h2>Other Notable Facts</h2>

        <p>A few additional data points that help round out the picture:</p>

        <ul>
          <li>
            <strong>No opioid prescribing.</strong> This NPI has no opioid claims in the dataset.
            Whatever is driving the cost, it is not controlled substances.
          </li>
          <li>
            <strong>No exclusions.</strong> Dr. Azad does not appear on the OIG exclusion list or
            any federal sanction databases we checked.
          </li>
          <li>
            <strong>Average patient age: {avgPatientAge}.</strong> Consistent with a Medicare
            population being seen in an emergency department.
          </li>
          <li>
            <strong>Risk score: 9 (low).</strong> Our risk model assigns a score of just 9 out of
            100, because the model adjusts for specialty context. Emergency medicine providers are
            expected to have high volume and certain prescribing patterns. The raw cost is
            extraordinary, but the model recognizes that this is a volume outlier, not necessarily
            a behavioral one.
          </li>
          <li>
            <strong>Out of {fmt(emProviderCount)} emergency medicine providers</strong> in the
            dataset, this NPI is the absolute #1 by total cost. The gap between #1 and #2 is
            enormous.
          </li>
        </ul>

        {/* ------------------------------------------------------------------ */}
        <h2>Why This Matters</h2>

        <p>
          This case is less about one doctor and more about how we interpret Medicare data. The
          CMS public use files are an extraordinary resource for understanding prescription drug
          spending. But they were designed for aggregate analysis, not individual provider
          evaluation. When we use them to rank individual providers, we inherit structural
          distortions.
        </p>

        <p>
          A physician whose NPI serves as the institutional prescriber for a major hospital ER
          will always appear as an outlier in provider-level data. That does not make the data
          wrong — the prescriptions are real, the costs are real, and Medicare did pay that money.
          But the attribution to a single individual can be misleading.
        </p>

        <p>
          This is why OpenPrescriber presents data in context rather than as a leaderboard of
          suspicion. High cost alone is not evidence of waste or fraud. High volume alone is not
          suspicious. Even a {(brandPct ?? 0).toFixed(1)}% brand-name rate might be explained by
          a single drug with no generic equivalent being the standard of care in an ER setting.
        </p>

        <p>
          What cases like this <em>do</em> highlight is the need for better data transparency.
          If CMS distinguished institutional prescribing from individual prescribing — or flagged
          340B participation — analyses like this one could be far more precise. Until then, we
          work with what we have and try to be honest about its limitations.
        </p>

        {/* ------------------------------------------------------------------ */}
        <h2>The Bigger Picture</h2>

        <p>
          Dr. Azad&rsquo;s NPI accounts for roughly 0.06% of all Medicare Part D drug spending
          by itself. Whether that spending represents efficient emergency care delivery, a 340B
          program working as intended, or something that warrants closer examination is a question
          the data alone cannot answer.
        </p>

        <p>
          What we can say is this: the Medicare system has a {fmtMoney(totalCost)} data point
          that is, at minimum, worth understanding. We&rsquo;ve presented what the data shows.
          The interpretation — and any action — belongs to those with access to the full clinical
          and institutional context.
        </p>

        {/* ------------------------------------------------------------------ */}
        <h2>Methodology Note</h2>

        <p>
          All figures in this analysis are derived from the{' '}
          <a
            href="https://data.cms.gov/provider-summary-by-type-of-service/medicare-part-d-prescribers/medicare-part-d-prescribers-by-provider"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            CMS Medicare Part D Prescribers by Provider
          </a>{' '}
          public use file for calendar year 2023, the most recent available at time of
          publication.
        </p>

        <p>
          Specialty averages are calculated across all providers in the Emergency Medicine
          specialty classification. Risk scores reference OpenPrescriber&rsquo;s{' '}
          <Link href="/analysis/fraud-risk-methodology" className="text-primary hover:underline">
            risk scoring methodology
          </Link>
          , which adjusts for specialty, geography, and patient mix to reduce false positives from
          structural billing patterns.
        </p>

        <p>
          Cost figures reflect total drug cost as reported by CMS, which includes ingredient
          cost, dispensing fees, and sales tax. They do not reflect manufacturer rebates, 340B
          discounts, or other post-point-of-sale adjustments.
        </p>

        {/* ------------------------------------------------------------------ */}
        <div className="not-prose mt-10 space-y-4">
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Explore Further</p>
            <ul className="text-sm space-y-1">
              <li>
                <Link
                  href="/providers/1639279417"
                  className="text-primary hover:underline"
                >
                  View Dr. Azad&rsquo;s full provider profile &rarr;
                </Link>
              </li>
              <li>
                <Link
                  href="/analysis/cost-outliers"
                  className="text-primary hover:underline"
                >
                  Who Are the Highest-Cost Prescribers? &rarr;
                </Link>
              </li>
              <li>
                <Link
                  href="/analysis/most-expensive-prescribers"
                  className="text-primary hover:underline"
                >
                  Most Expensive Prescribers Analysis &rarr;
                </Link>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
            <strong>Disclaimer:</strong> OpenPrescriber uses publicly available CMS data to
            promote transparency in Medicare prescription drug spending. Provider profiles and
            analyses are informational only and do not constitute allegations of fraud, waste,
            abuse, or clinical impropriety. Prescribing patterns may reflect institutional
            billing practices, patient demographics, specialty norms, or other factors not
            captured in the data. Always consider the full context before drawing conclusions
            about any individual provider.
          </div>
        </div>

        <RelatedAnalysis current="/analysis/160-million-prescriber" />
      </div>
    </div>
  )
}
