import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ArticleSchema from '@/components/ArticleSchema'
import ShareButtons from '@/components/ShareButtons'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import RelatedAnalysis from '@/components/RelatedAnalysis'

export const metadata: Metadata = {
  title: 'Excluded but Still Prescribing: 372 OIG-Listed Providers in Medicare Part D',
  description: 'We found 372 providers on the OIG exclusion list who appear in active Medicare Part D prescribing data. How does this happen?',
  openGraph: {
    title: 'Excluded but Still Prescribing: 372 OIG-Listed Providers in Medicare Part D',
    description: 'We found 372 providers on the OIG exclusion list who appear in active Medicare Part D prescribing data. How does this happen?',
    url: 'https://www.openprescriber.org/analysis/excluded-still-prescribing',
    type: 'article',
  },
  alternates: { canonical: 'https://www.openprescriber.org/analysis/excluded-still-prescribing' },
}

export default function ExcludedStillPrescribingPage() {
  const highRisk = loadData('high-risk.json') as { npi: string; name: string; credentials: string; city: string; state: string; specialty: string; claims: number; cost: number; isExcluded: boolean }[]
  const excluded = highRisk.filter(p => p.isExcluded)

  const totalClaims = excluded.reduce((a, p) => a + p.claims, 0)
  const totalCost = excluded.reduce((a, p) => a + p.cost, 0)
  const avgCost = excluded.length > 0 ? totalCost / excluded.length : 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Excluded Providers' }]} />
      <ArticleSchema title="Excluded but Still Prescribing" description="372 OIG-listed providers in active Medicare data." slug="excluded-still-prescribing" date="2026-03-01" />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">Excluded but Still Prescribing</h1>
      <ShareButtons title="Excluded Providers Still in Medicare Part D" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          The Office of Inspector General (OIG) maintains a list of providers excluded from federal healthcare programs — typically due to convictions for fraud, patient abuse, or other serious offenses. Yet when we cross-referenced this list against the most recent Medicare Part D prescribing data, we found something alarming: <strong>{excluded.length} excluded providers</strong> appear in the 2023 dataset, collectively responsible for {fmt(totalClaims)} prescription claims totaling {fmtMoney(totalCost)} in costs billed to Medicare.
        </p>
        <p>
          These are not hypothetical risks. These are real providers, with real National Provider Identifiers (NPIs), who were convicted of offenses serious enough to warrant exclusion from federal healthcare — and who nonetheless appear in active prescribing records paid for by taxpayer dollars.
        </p>

        <div className="not-prose bg-red-50 border border-red-200 rounded-xl p-6 my-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><p className="text-3xl font-bold text-red-700">{excluded.length}</p><p className="text-xs text-red-600">Excluded Matches</p></div>
            <div><p className="text-3xl font-bold text-red-700">{fmt(totalClaims)}</p><p className="text-xs text-red-600">Combined Claims</p></div>
            <div><p className="text-3xl font-bold text-red-700">{fmtMoney(totalCost)}</p><p className="text-xs text-red-600">Combined Cost</p></div>
          </div>
        </div>

        <h2>What Is the OIG Exclusion List?</h2>
        <p>
          The OIG exclusion list — formally known as the List of Excluded Individuals and Entities (LEIE) — is a federal database maintained by the U.S. Department of Health and Human Services Office of Inspector General. It contains the names and identifying information of every individual and organization that has been barred from participating in Medicare, Medicaid, and all other federal healthcare programs.
        </p>
        <p>
          Being placed on the LEIE is one of the most severe administrative actions in American healthcare. It means the federal government has determined, typically through a criminal conviction or administrative finding, that an individual poses such a risk to patients or program integrity that they should not be allowed to bill federal programs or provide services reimbursed by federal dollars.
        </p>
        <p>
          The consequences extend beyond the individual provider. Any hospital, pharmacy, or healthcare organization that knowingly employs or contracts with an excluded individual for services billed to federal programs faces civil monetary penalties of up to $100,000 per item or service. The LEIE is updated monthly and is publicly searchable on the OIG website, making it a critical compliance tool for healthcare employers.
        </p>

        <h2>Types of Exclusions</h2>
        <p>
          OIG exclusions fall into two broad categories, each reflecting different levels of severity and the government&apos;s discretion in imposing them.
        </p>
        <h3>Mandatory Exclusions</h3>
        <p>
          Mandatory exclusions are required by law. When a provider is convicted of certain offenses, OIG has no choice — exclusion is automatic. These offenses include:
        </p>
        <ul>
          <li><strong>Medicare or Medicaid fraud</strong> — Any felony or misdemeanor conviction related to the delivery of items or services under Medicare or Medicaid</li>
          <li><strong>Patient abuse or neglect</strong> — Criminal convictions related to abuse, neglect, or mistreatment of patients in connection with healthcare delivery</li>
          <li><strong>Felony healthcare fraud</strong> — Convictions for fraud against any healthcare program, public or private</li>
          <li><strong>Felony controlled substance convictions</strong> — Convictions related to the unlawful manufacture, distribution, prescription, or dispensing of controlled substances</li>
        </ul>
        <p>
          Mandatory exclusions carry a minimum five-year period. For subsequent convictions, the minimums increase — ten years for a second offense, permanent exclusion for a third.
        </p>
        <h3>Permissive Exclusions</h3>
        <p>
          Permissive exclusions are at the OIG&apos;s discretion. The OIG may exclude providers for a broader range of conduct, including:
        </p>
        <ul>
          <li><strong>Misdemeanor fraud convictions</strong> — Fraud against non-healthcare programs</li>
          <li><strong>License revocation or suspension</strong> — Loss of professional license for reasons related to professional competence or performance</li>
          <li><strong>Default on student loans</strong> — Health Education Assistance Loan defaults</li>
          <li><strong>Controlled substance violations</strong> — Misdemeanor convictions related to controlled substances</li>
          <li><strong>Excessive claims or unnecessary services</strong> — Submitting claims for services that are substantially in excess of the patient&apos;s needs</li>
          <li><strong>Kickbacks and referral schemes</strong> — Participation in illegal payment arrangements for patient referrals</li>
        </ul>
        <p>
          Permissive exclusion periods vary based on the severity of the conduct and any aggravating or mitigating factors the OIG considers during its review.
        </p>

        <h2>How We Found Them</h2>
        <p>
          Our methodology is straightforward: we performed a direct cross-reference between two publicly available federal datasets.
        </p>
        <p>
          The first dataset is the <strong>CMS Medicare Part D Prescribers</strong> file, published annually by the Centers for Medicare and Medicaid Services. This file contains every provider who wrote at least eleven prescriptions under Medicare Part D in a given year, including their NPI, name, specialty, total claims, and total drug costs. We used the 2023 release, the most recent available.
        </p>
        <p>
          The second dataset is the <strong>OIG LEIE</strong> database, which we downloaded in its entirety. The LEIE contains each excluded individual&apos;s name, NPI (when available), date of birth, exclusion type, exclusion date, and reinstatement date (if applicable).
        </p>
        <p>
          The matching process used NPI as the primary key. Every provider in the Medicare Part D dataset has a unique 10-digit NPI assigned by CMS. We matched these NPIs against the LEIE database, filtering for individuals whose exclusion was active during the 2023 prescribing period. This produced {excluded.length} confirmed matches — providers who appear on both lists simultaneously.
        </p>
        <p>
          This is not a fuzzy match or a probabilistic estimate. NPI is a unique, permanent identifier assigned to each healthcare provider. When the same NPI appears in both the exclusion list and the prescribing data, it represents the same individual.
        </p>

        <h2>What This Means</h2>
        <p>
          The implications are direct: {fmtMoney(totalCost)} in Medicare Part D spending is associated with providers the federal government itself has deemed unfit to participate in federal healthcare programs. That money comes from the Medicare Trust Fund, which is funded by payroll taxes, premiums paid by beneficiaries, and general tax revenue.
        </p>
        <p>
          At an average of {fmtMoney(avgCost)} per excluded provider, these are not trivial amounts. Each claim represents a prescription filled for a real Medicare beneficiary — an elderly or disabled American who relied on Medicare for their medication. The prescriptions were written by someone the government had already determined posed a risk to patients or program integrity.
        </p>
        <p>
          It is worth emphasizing what exclusion means in practice. These providers were not flagged for billing irregularities or placed on a watch list. They were formally excluded, in many cases following criminal convictions. The LEIE is not a list of suspicions — it is a list of adjudicated outcomes.
        </p>

        <h2>The Enforcement Gap</h2>
        <p>
          How can a provider excluded from federal healthcare programs still appear in active Medicare prescribing data? The answer reveals a systemic weakness in how CMS administers its programs.
        </p>
        <p>
          Several factors contribute to this gap:
        </p>
        <ul>
          <li><strong>Decentralized claims processing</strong> — Medicare claims are processed by private contractors (Medicare Administrative Contractors, or MACs) and Part D plan sponsors. Each entity is responsible for screening against the LEIE, but enforcement varies. There is no single automated gate that blocks an excluded NPI from appearing on a claim.</li>
          <li><strong>NPI persistence</strong> — An NPI is never deactivated when a provider is excluded. The NPI remains valid in the NPPES registry even after exclusion. This means pharmacies and plan sponsors may process prescriptions under an excluded NPI without receiving an automated rejection.</li>
          <li><strong>Prescribing vs. billing</strong> — A provider writes a prescription. The pharmacy fills it and bills Medicare. The provider&apos;s NPI appears on the claim as the prescriber, but the provider did not directly submit the claim. This creates a gap where the pharmacy may not know — or check — whether the prescriber is excluded.</li>
          <li><strong>Timing and data synchronization</strong> — The LEIE is updated monthly, but CMS prescribing data is compiled annually. Some matches may reflect narrow windows where exclusion took effect mid-year, or where reinstatement occurred between snapshots.</li>
          <li><strong>Limited pharmacy obligations</strong> — While healthcare employers are required to check the LEIE, pharmacies filling prescriptions may not consistently verify the exclusion status of every prescriber whose prescriptions they dispense. The legal obligation primarily falls on employers, not on pharmacies filling third-party prescriptions.</li>
        </ul>
        <p>
          The result is a system where exclusion is announced but not comprehensively enforced at the point of service. A provider can be placed on the LEIE and, in practice, continue to write prescriptions that Medicare pays for — because no automated system reliably prevents it.
        </p>

        <h2>Patterns We Observed</h2>
        <p>
          While we do not identify individual providers by name in this analysis, several patterns emerged from examining the {excluded.length} matches in aggregate.
        </p>
        <p>
          Geographic concentration was notable. Several states accounted for a disproportionate share of excluded-but-prescribing providers, with higher concentrations in states that also have large Medicare populations. This is not surprising — more providers means more potential matches — but it also suggests that some regional MACs may be less effective at screening than others.
        </p>
        <p>
          Specialty distribution was uneven. Certain specialties appeared more frequently among excluded providers than their share of the overall prescriber population would predict. This is consistent with OIG enforcement priorities, which tend to focus on specialties with higher fraud risk, such as those involving controlled substances or durable medical equipment referrals.
        </p>
        <p>
          Claim volumes varied dramatically. Some excluded providers had minimal prescribing activity — a handful of claims that might represent prescriptions written just before exclusion took effect. Others had substantial claim volumes, suggesting sustained prescribing activity throughout the year. A small number of excluded providers generated hundreds of claims and tens of thousands of dollars in costs, which is harder to explain by timing alone.
        </p>
        <p>
          Cost patterns also varied. The average cost per excluded provider was {fmtMoney(avgCost)}, but this average masks significant dispersion. Some providers were associated with low-cost generic prescriptions, while others prescribed expensive brand-name medications or controlled substances at elevated rates.
        </p>

        <h2>Why This Matters for Our ML Model</h2>
        <p>
          These {excluded.length} confirmed cases are not just a policy finding — they are the foundation of OpenPrescriber&apos;s <Link href="/ml-fraud-detection" className="text-primary font-medium hover:underline">machine learning fraud detection model</Link>.
        </p>
        <p>
          Building a fraud detection model requires labeled training data: known examples of providers who have been confirmed as problematic. In healthcare fraud detection, this is notoriously difficult to obtain. Fraud investigations are confidential, settlements often include non-disclosure provisions, and most publicly available data does not label individual providers as fraudulent.
        </p>
        <p>
          The LEIE cross-reference solves this problem. By matching excluded providers to their actual prescribing patterns, we create a dataset of {excluded.length} providers whose prescribing behavior can be studied in detail. We know their specialties, their geographic locations, their total claim volumes, their drug costs, and the specific drugs they prescribed. More importantly, we know they were excluded — giving us a confirmed positive label for supervised learning.
        </p>
        <p>
          Our model learns what distinguishes these {excluded.length} excluded providers from the broader population of Medicare prescribers. It identifies patterns in prescribing volume, drug selection, cost per claim, specialty-adjusted benchmarks, and geographic outlier status. These learned patterns are then applied to the full Medicare Part D dataset to identify additional providers whose prescribing behavior closely resembles the confirmed cases.
        </p>
        <p>
          The result: the model flags 4,183 additional providers as high-risk based on behavioral similarity to the {excluded.length} known exclusions. These flagged providers are not accused of fraud — they are identified as statistically similar to providers who were. You can explore the full results on our <Link href="/flagged" className="text-primary font-medium hover:underline">High Risk Providers</Link> page.
        </p>

        <h2>Data Limitations and Caveats</h2>
        <p>
          We present these findings with appropriate caveats. The cross-reference between the LEIE and Medicare Part D prescribing data is a point-in-time snapshot, not a real-time surveillance system. Several factors could affect interpretation:
        </p>
        <p>
          First, the LEIE snapshot and the prescribing data period may not perfectly overlap. A provider excluded in October 2023 would appear on the LEIE but may have legitimately prescribed for the first nine months of the year. Their claims would still appear in the annual dataset. We cannot distinguish, at the annual level, which specific claims occurred before versus after the exclusion date.
        </p>
        <p>
          Second, some providers on the LEIE may have been reinstated. OIG reinstatement is not automatic — providers must apply and demonstrate that they meet the conditions for reinstatement. However, there can be processing delays between reinstatement approval and LEIE database updates. A small number of our {excluded.length} matches may reflect recently reinstated providers who had not yet been removed from the LEIE at the time of our download.
        </p>
        <p>
          Third, we match on NPI only. While NPI is a unique identifier, data entry errors in either dataset could theoretically produce false matches. We consider this risk minimal given the structured nature of both datasets, but we acknowledge it as a possibility.
        </p>
        <p>
          Despite these caveats, the overall finding is robust. Even if a fraction of the {excluded.length} matches are explained by timing or data lag, the remainder represent a genuine enforcement gap that warrants investigation. And from a machine learning perspective, even imperfect labels provide valuable signal — the model learns general patterns of high-risk prescribing, not the specific circumstances of each individual case.
        </p>

        <h2>The Broader Context of Medicare Fraud</h2>
        <p>
          Medicare fraud is not a marginal problem. The Department of Justice estimates that fraud and improper payments account for billions of dollars annually across Medicare programs. The Government Accountability Office (GAO) has placed Medicare on its High Risk List every year since 1990, citing its vulnerability to fraud, waste, and abuse.
        </p>
        <p>
          Part D is particularly vulnerable because of its structure. Unlike Part A (hospital) and Part B (physician services), Part D is administered entirely through private plan sponsors — insurance companies that contract with CMS to provide prescription drug coverage. Each plan sponsor is responsible for its own claims processing, provider screening, and fraud detection. This decentralized model creates inconsistencies in oversight.
        </p>
        <p>
          The {excluded.length} excluded providers we identified represent only the most visible layer of the problem — cases where the government has already investigated, adjudicated, and excluded an individual, yet that individual&apos;s prescribing activity persists in paid claims data. If the system cannot catch providers it has already formally excluded, it raises serious questions about its ability to detect providers who have not yet been investigated.
        </p>

        <h2>Policy Implications</h2>
        <p>
          The existence of {excluded.length} excluded providers in active Medicare prescribing data points to several policy failures that deserve attention.
        </p>
        <p>
          <strong>Real-time claims screening is inadequate.</strong> If CMS and its contractors cannot reliably prevent excluded providers from appearing in paid claims data, the exclusion system has a fundamental enforcement problem. Exclusion without enforcement is merely a list.
        </p>
        <p>
          <strong>NPI deactivation should follow exclusion.</strong> Currently, a provider&apos;s NPI remains active in the National Plan and Provider Enumeration System (NPPES) even after OIG exclusion. Linking these two systems — so that exclusion triggers an NPI flag visible to pharmacies and plan sponsors at the point of service — would close a significant gap.
        </p>
        <p>
          <strong>Pharmacy-level screening needs strengthening.</strong> Pharmacies are the final point of contact before a Medicare-funded prescription is dispensed. Requiring pharmacy management systems to check prescriber NPIs against the LEIE at the point of dispensing would add a practical enforcement layer.
        </p>
        <p>
          <strong>Cross-dataset analysis should be routine.</strong> The fact that a simple NPI match between two public datasets reveals {excluded.length} concerning cases suggests this analysis is not being performed systematically by CMS. Automated cross-referencing between the LEIE and claims data should be a standard, recurring audit function.
        </p>
        <p>
          <strong>Transparency drives accountability.</strong> Both the Medicare Part D prescribing data and the LEIE are public. By making this cross-reference accessible through OpenPrescriber, we enable journalists, researchers, policymakers, and the public to examine these cases independently. Transparency is not a substitute for enforcement, but it creates pressure for improvement.
        </p>

        <h2>What You Can Do</h2>
        <p>
          If you are concerned about these findings, there are concrete steps you can take:
        </p>
        <ul>
          <li><strong>Check your own providers.</strong> You can search the OIG LEIE directly at <a href="https://exclusions.oig.hhs.gov/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">exclusions.oig.hhs.gov</a> to verify whether any of your healthcare providers have been excluded. You can also search any provider on OpenPrescriber to see their prescribing patterns and risk indicators.</li>
          <li><strong>Contact your representatives.</strong> The enforcement gap described here is a policy problem that requires legislative or regulatory action. Contacting your Congressional representatives about Medicare fraud oversight puts this issue on their radar.</li>
          <li><strong>Share this analysis.</strong> Public awareness drives change. Share this page with others who care about healthcare integrity and responsible use of taxpayer funds.</li>
          <li><strong>If you are a healthcare employer</strong>, verify that your organization screens all employees and contractors against the LEIE monthly. OIG provides a free screening tool, and failure to screen can result in civil monetary penalties.</li>
          <li><strong>If you are a researcher or journalist</strong>, the underlying data is public. We encourage independent verification and further investigation. Our <Link href="/methodology" className="text-primary font-medium hover:underline">methodology page</Link> documents our data sources and approach in detail.</li>
          <li><strong>Report suspected fraud.</strong> If you have reason to believe a healthcare provider is improperly billing Medicare, you can report it to the OIG hotline at 1-800-HHS-TIPS or online at <a href="https://oig.hhs.gov/fraud/report-fraud/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">oig.hhs.gov/fraud/report-fraud</a>. Reports can be made anonymously.</li>
        </ul>
        <p>
          The goal of OpenPrescriber is not to replace federal oversight — it is to demonstrate what is possible with public data and to make that analysis accessible to everyone. When a straightforward NPI cross-reference reveals {excluded.length} excluded providers in active prescribing data, it shows both the value of transparency and the urgency of systemic reform.
        </p>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-blue-800">View all matches: <Link href="/excluded" className="text-primary font-medium hover:underline">Excluded Providers List</Link></p>
          <p className="text-sm text-blue-800">These {excluded.length} confirmed cases serve as training data for our <Link href="/ml-fraud-detection" className="text-primary font-medium hover:underline">ML Fraud Detection model</Link>, which identifies 4,183 additional providers with similar prescribing patterns.</p>
          <p className="text-sm text-blue-800">Explore flagged providers: <Link href="/flagged" className="text-primary font-medium hover:underline">High Risk Providers</Link></p>
        </div>
      <RelatedAnalysis current={"/analysis/excluded-still-prescribing"} />
      </div>
    </div>
  )
}
