import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'
import RelatedAnalysis from '@/components/RelatedAnalysis'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'The Polypharmacy Problem: When Medicare Patients Take Too Many Drugs',
  description: 'Some Medicare patients receive prescriptions from dozens of providers. Analysis of high-fills-per-patient patterns and dangerous drug accumulation.',
  openGraph: {
    title: 'The Polypharmacy Problem: When Medicare Patients Take Too Many Drugs',
    description: 'Some Medicare patients receive prescriptions from dozens of providers. Analysis of high-fills-per-patient patterns and dangerous drug accumulation.',
    url: 'https://www.openprescriber.org/analysis/polypharmacy',
    type: 'article',
  },
  alternates: { canonical: 'https://www.openprescriber.org/analysis/polypharmacy' },
}

export default function PolypharmacyArticle() {
  const stats = loadData('stats.json')
  const drugs = loadData('drugs.json') as { brand: string; generic: string; cost: number; claims: number; benes: number }[]
  const combos = loadData('drug-combos.json') as { npi: string }[]

  const avgClaimsPerBene = ((stats.claims ?? 0) / 52_000_000).toFixed(1) // ~52M enrollees

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema
        title="The Polypharmacy Problem: When Patients Take Too Many Drugs"
        description="Analysis of polypharmacy patterns in Medicare Part D"
        slug="polypharmacy"
        date="2026-02-28"
      />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Polypharmacy' }]} />

      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">The Polypharmacy Problem: Too Many Drugs, Too Little Coordination</h1>
      <p className="text-sm text-gray-500 mb-4">Analysis · February 2026</p>
      <ShareButtons title="The Polypharmacy Problem in Medicare" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg">
          The average Medicare Part D enrollee filled approximately <strong>{avgClaimsPerBene} prescriptions</strong> in 2023 — more than two prescriptions per month. For some patients, the number is far higher. Polypharmacy — the concurrent use of multiple medications — is a growing problem with real consequences: adverse drug interactions, hospitalizations, and death.
        </p>

        <div className="not-prose grid grid-cols-3 gap-4 my-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-primary">{fmt(stats.claims)}</p>
            <p className="text-xs text-gray-600">Total Claims (2023)</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-primary">~{avgClaimsPerBene}</p>
            <p className="text-xs text-gray-600">Claims Per Enrollee</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">{fmt(combos.length)}</p>
            <p className="text-xs text-gray-600">Opioid+Benzo Prescribers</p>
          </div>
        </div>

        <h2>What Is Polypharmacy?</h2>
        <p>
          Polypharmacy is most commonly defined as the concurrent use of five or more medications by a single patient. The term itself carries no inherent judgment — some patients genuinely require multiple drugs to manage complex, overlapping conditions. But the threshold of five medications is clinically significant because it marks the point where the risk of adverse drug events begins to climb steeply. Beyond ten medications, those risks become difficult to manage even with careful oversight.
        </p>
        <p>
          For the elderly population that makes up the majority of Medicare enrollees, polypharmacy is especially dangerous. Age-related changes in liver and kidney function slow drug metabolism, meaning medications linger in the body longer and at higher effective concentrations. Reduced body water and increased body fat alter how drugs distribute through tissues. A dose that is safe for a 50-year-old may produce toxic effects in an 80-year-old — and when that 80-year-old is taking eight other medications simultaneously, the pharmacokinetic complexity becomes enormous.
        </p>

        <h2>The Medicare Population</h2>
        <p>
          Medicare Part D covers approximately 52 million enrollees, the vast majority of whom are 65 or older. Studies consistently find that the average Medicare beneficiary takes between four and five prescription medications concurrently, and roughly 40 percent take five or more. Among nursing home residents covered by Medicare, the average is closer to nine medications.
        </p>
        <p>
          These numbers reflect the chronic disease burden of an aging population. Hypertension, diabetes, hyperlipidemia, arthritis, depression, and heart failure are all common in Medicare beneficiaries, and each condition typically requires at least one medication. A patient with three chronic conditions — a typical Medicare enrollee — may need a statin, an ACE inhibitor, metformin, a proton pump inhibitor for reflux, and an SSRI for depression before any acute problems arise. That is already five drugs, and the patient has not yet visited a specialist.
        </p>
        <p>
          The {fmt(stats.claims)} total claims in the 2023 Part D data reflect this reality. Each claim represents a prescription filled at a pharmacy, and many patients fill the same prescriptions month after month. The sheer volume of prescribing creates an environment where oversight gaps are inevitable.
        </p>

        <h2>Drug Interactions and Adverse Events</h2>
        <p>
          The mathematics of drug interactions are unforgiving. A patient taking two medications has one potential drug-drug interaction to monitor. A patient on five medications has ten potential pairwise interactions. At ten medications, the number rises to 45. At fifteen — not unusual for complex Medicare patients — there are 105 potential interactions, many of which have never been studied in clinical trials because trials typically exclude patients on more than a handful of drugs.
        </p>
        <p>
          Adverse drug events (ADEs) account for an estimated 700,000 emergency department visits annually among Americans over 65, and roughly 100,000 hospitalizations. The most common culprits are blood thinners (warfarin, direct oral anticoagulants), diabetes medications (insulin, sulfonylureas causing hypoglycemia), and opioid pain medications. These are among the most commonly prescribed drug classes in Medicare Part D, which means the patients at highest risk of ADEs are also the patients most likely to be enrolled in the program.
        </p>
        <p>
          Many of these events are preventable. A 2023 study in the <em>Journal of the American Geriatrics Society</em> estimated that 40 to 50 percent of ADEs in elderly patients result from known drug interactions or inappropriate dosing — problems that could be caught with better medication review processes.
        </p>

        <h2>The Prescriber Fragmentation Problem</h2>
        <p>
          One of the most insidious drivers of polypharmacy is prescriber fragmentation: patients seeing multiple specialists, each adding medications within their domain, with no single provider reviewing the complete medication list. A cardiologist prescribes a beta blocker and a statin. An endocrinologist adds metformin and glipizide. A psychiatrist prescribes sertraline. A rheumatologist adds a corticosteroid. A pain specialist prescribes gabapentin. Each prescription may be individually appropriate, but the combination may not be.
        </p>
        <p>
          Medicare Part D data reveals the scope of this problem. Many beneficiaries receive prescriptions from five, ten, or even fifteen distinct providers in a single year. Each provider may check for interactions with the drugs they know about, but they often lack visibility into what other specialists have prescribed. The patient themselves may not remember or accurately report their full medication list, especially if cognitive decline is a factor.
        </p>
        <p>
          Primary care physicians are theoretically positioned to serve as the coordinator, but in practice they face 15-minute appointment windows, incomplete medication records, and the reluctance to countermand a specialist&#39;s prescription. The result is a system where drugs accumulate but rarely get removed.
        </p>

        <h2>Which Drug Classes Are Most Involved</h2>
        <p>
          Certain therapeutic categories dominate the polypharmacy landscape in Medicare Part D. <strong>Cardiovascular medications</strong> are the most common: statins, ACE inhibitors, ARBs, beta blockers, calcium channel blockers, and diuretics. A single patient with hypertension and heart failure may take three or four cardiovascular drugs alone.
        </p>
        <p>
          <strong>Diabetes medications</strong> are the second major category. As diabetes management has become more complex, patients often take metformin alongside a sulfonylurea, a DPP-4 inhibitor or GLP-1 agonist, and sometimes insulin — contributing three or four drugs from a single condition.
        </p>
        <p>
          <strong>Psychiatric medications</strong> represent a growing share of polypharmacy. Antidepressants, anti-anxiety medications, sleep aids, and antipsychotics are frequently prescribed to Medicare beneficiaries, and they carry significant interaction potential with cardiovascular and pain medications. The combination of an SSRI with a blood thinner, for example, increases bleeding risk.
        </p>
        <p>
          <strong>Pain medications</strong> — particularly opioids, NSAIDs, and gabapentinoids — complete the picture. We identified <strong>{fmt(combos.length)} providers</strong> who prescribe both opioids and benzodiazepines, a combination the FDA has flagged with a <Link href="/dangerous-combinations">Black Box Warning</Link> due to life-threatening respiratory depression. Opioid-benzodiazepine combinations are especially dangerous in elderly patients whose respiratory drive is already compromised.
        </p>

        <h2>The Cascade Effect</h2>
        <p>
          The prescribing cascade is one of the most underrecognized mechanisms driving polypharmacy. It works like this: Drug A causes a side effect that is misidentified as a new medical condition. Drug B is prescribed to treat that &quot;condition.&quot; Drug B then causes its own side effect, which prompts Drug C. Each step adds a medication while the original problem — an adverse reaction to Drug A — goes unaddressed.
        </p>
        <p>
          Classic examples are disturbingly common in geriatric medicine. A calcium channel blocker causes ankle swelling, which is treated with a diuretic, which causes potassium depletion, which is treated with a potassium supplement and sometimes an additional medication to manage the resulting muscle cramps. An NSAID raises blood pressure, prompting a new antihypertensive. A cholinesterase inhibitor for dementia causes urinary incontinence, which is treated with an anticholinergic — a drug class known to worsen cognitive function.
        </p>
        <p>
          The cascade effect is nearly invisible in claims data because each new prescription appears clinically justified in isolation. Only when you examine the full timeline of a patient&#39;s medication history does the pattern become apparent. Our data can help surface these patterns by showing when providers add medications in rapid succession, particularly when the new drug treats a known side effect of an existing one.
        </p>

        <h2>Identifying Cascades in Claims Data</h2>
        <p>
          While individual prescribing cascades are difficult to confirm without clinical records, population-level patterns can suggest where cascades are prevalent. When a provider&#39;s patient panel shows high rates of anti-nausea drugs alongside chemotherapy agents, that is expected. When a provider&#39;s patients disproportionately receive both NSAIDs and antihypertensives, or both cholinesterase inhibitors and anticholinergics, the pattern is more suspicious. Our data allows researchers and oversight bodies to flag these co-prescribing patterns at scale, across hundreds of thousands of providers, creating a starting point for more targeted clinical review.
        </p>
        <p>
          Breaking the cascade requires a mindset shift. When a patient on multiple medications develops a new symptom, the first question should not be &quot;What drug do we add?&quot; but rather &quot;Could an existing drug be causing this?&quot; That question is simple in theory but requires access to the full medication history — information that is often fragmented across providers and pharmacies.
        </p>

        <h2>Geographic Patterns</h2>
        <p>
          Polypharmacy rates are not uniform across the country. States in the Southeast — including Mississippi, Alabama, West Virginia, and Kentucky — consistently show higher rates of per-beneficiary prescribing, higher opioid utilization, and more providers prescribing high-risk combinations. These geographic patterns closely mirror the distribution of chronic disease: states with higher rates of obesity, diabetes, and cardiovascular disease naturally generate more prescriptions per patient.
        </p>
        <p>
          But disease burden alone does not explain the variation. Provider density, prescribing culture, access to non-pharmacological treatments, and the availability of clinical pharmacists all play roles. States with robust Prescription Drug Monitoring Programs and active pharmacy review requirements tend to show lower rates of dangerous combinations, even after adjusting for disease prevalence.
        </p>
        <p>
          Our <Link href="/analysis/geographic">geographic analysis</Link> breaks down prescribing patterns by state, allowing comparisons of per-provider claim volumes, unique drug counts, and high-risk prescribing rates across regions. The variation is striking — and suggests that local prescribing norms matter as much as patient need.
        </p>

        <h2>Age and Polypharmacy</h2>
        <p>
          Within the Medicare population, polypharmacy risk increases sharply with age. Beneficiaries aged 65 to 74 average roughly four concurrent medications. Those 75 to 84 average six. And those 85 and older — the fastest-growing segment of the Medicare population — average eight or more. This trajectory reflects the accumulation of chronic conditions over time, but it also reflects a medical culture that is far more comfortable adding medications than removing them.
        </p>
        <p>
          Age-related frailty compounds the pharmacological risks. Frail elderly patients have reduced physiological reserves, meaning they are less able to compensate for drug side effects. A blood pressure medication that causes mild dizziness in a robust 70-year-old may cause a catastrophic fall in a frail 88-year-old. Falls are the leading cause of injury death in Americans over 65, and medications — particularly sedatives, antihypertensives, and opioids — are a contributing factor in an estimated 40 percent of fall-related hospitalizations.
        </p>
        <p>
          The challenge is that clinical trials rarely include patients over 80, and almost never include frail patients. The evidence base for drug safety in the oldest Medicare beneficiaries is thin, which means providers are often prescribing based on data from younger, healthier populations.
        </p>

        <h2>Rural vs. Urban Prescribing</h2>
        <p>
          Rural Medicare beneficiaries face a distinct polypharmacy challenge. Fewer specialists means primary care providers manage more conditions independently, sometimes leading to broader prescribing within a single practice. At the same time, rural patients may have less access to clinical pharmacists who could review their medication lists. Telehealth has begun to close some of these gaps, but medication reconciliation — the process of comparing a patient&#39;s medication list against their actual needs — remains harder when patients travel long distances for care and see providers who do not share electronic health records.
        </p>

        <h2>The Deprescribing Movement</h2>
        <p>
          Deprescribing — the systematic process of identifying and discontinuing medications that are no longer necessary, no longer effective, or potentially harmful — has emerged as a critical field in geriatric medicine. Unlike the traditional medical instinct to add treatments, deprescribing asks a fundamentally different question: which of these drugs can we safely stop?
        </p>
        <p>
          Evidence for deprescribing is growing. Randomized trials have shown that carefully reducing medication burden in elderly patients can improve quality of life, reduce falls, improve cognitive function, and in some cases reduce mortality — all while lowering costs. Proton pump inhibitors, benzodiazepines, antipsychotics, and statins in patients over 80 with limited life expectancy are among the most commonly deprescribed drug classes.
        </p>
        <p>
          The challenge is implementation. Deprescribing requires time (to review the full medication list), expertise (to assess which drugs are still providing benefit), and courage (to stop a drug that another provider prescribed). It also requires patient buy-in — many patients are understandably anxious about stopping a medication they have taken for years, even when the evidence supports discontinuation.
        </p>

        <h2>The Beers Criteria</h2>
        <p>
          The American Geriatrics Society&#39;s Beers Criteria is the most widely used tool for identifying potentially inappropriate medications in older adults. Updated every three years, the list identifies drugs that should generally be avoided in patients over 65 — including certain benzodiazepines, first-generation antihistamines, long-acting sulfonylureas, and non-COX-selective NSAIDs. Despite wide awareness of the Beers Criteria, studies consistently show that 20 to 40 percent of Medicare beneficiaries receive at least one Beers-listed medication in a given year. Our data can identify providers with unusually high rates of Beers-listed prescribing, adjusted for specialty and patient complexity.
        </p>

        <h2>How Our Data Captures This</h2>
        <p>
          Medicare Part D public use files report the number of unique drugs each provider prescribes, the total claims, and the number of beneficiaries served. While we cannot see individual patient medication lists (that data is not public), we can identify providers whose prescribing patterns suggest high polypharmacy exposure for their patients.
        </p>
        <p>
          A provider with 200 beneficiaries and 40 unique drugs is likely managing a complex patient population with varied needs. A provider with 200 beneficiaries and 200 unique drugs raises different questions — are patients receiving highly individualized regimens, or is prescribing unusually broad? We use specialty-adjusted thresholds to distinguish expected complexity (a rheumatologist will naturally prescribe more unique drugs than a dermatologist) from potential outliers.
        </p>
        <p>
          The <Link href="/providers">provider search</Link> on OpenPrescriber surfaces these metrics for every Part D prescriber in the country. Users can examine a provider&#39;s unique drug count, average claims per beneficiary, and specific drug mix to assess whether prescribing patterns warrant further review. Combined with our <Link href="/analysis/dangerous-combinations">dangerous combinations analysis</Link>, this data provides a window into the polypharmacy landscape that was previously available only to CMS and large health systems.
        </p>

        <h2>Limitations of Public Data</h2>
        <p>
          It is important to acknowledge what Medicare Part D public use files cannot tell us. We cannot see individual patient medication lists, only provider-level aggregates. We cannot confirm that two drugs prescribed by the same provider were given to the same patient. We cannot assess clinical appropriateness — a provider with high unique drug counts may be serving a genuinely complex population. These limitations mean our analyses identify patterns that warrant further investigation, not definitive evidence of inappropriate prescribing. The data is a screening tool, not a verdict.
        </p>

        <h2>The Cost Dimension</h2>
        <p>
          Polypharmacy is expensive from every angle. Direct drug costs are the most obvious: more medications mean higher out-of-pocket costs for patients and higher expenditures for Part D plans. But the indirect costs are often larger. Adverse drug events generate emergency department visits averaging $2,000 to $4,000 each. Drug-related hospitalizations in elderly patients average $10,000 to $15,000 per stay. And the downstream effects — rehabilitation, long-term care placement after a fall, cognitive decline requiring increased caregiver support — can cost tens of thousands more.
        </p>
        <p>
          CMS has estimated that preventable adverse drug events cost the Medicare system between $8 billion and $12 billion annually. Much of this spending is concentrated in patients taking the most medications — the same patients who are least likely to have a coordinated medication review. The economics of polypharmacy create a perverse dynamic: the system pays for each new prescription but has limited mechanisms to pay for the time-intensive work of reviewing and reducing medications.
        </p>
        <p>
          Part D plan spending data, which we aggregate across providers and drug categories, reveals the scale of this problem. The top drug classes by total cost closely overlap with the drug classes most involved in polypharmacy and adverse events — cardiovascular, diabetes, and psychiatric medications account for a disproportionate share of both spending and risk.
        </p>

        <h2>Policy Implications</h2>
        <p>
          <strong>Medication Therapy Management (MTM)</strong> is the most direct policy tool currently available. CMS requires Part D plans to offer MTM programs to beneficiaries who meet certain criteria — typically those taking multiple drugs for multiple chronic conditions and exceeding a cost threshold. MTM involves a comprehensive medication review by a pharmacist, who can identify interactions, duplications, and deprescribing opportunities. Despite its proven effectiveness, MTM uptake remains low: fewer than 15 percent of eligible beneficiaries receive a comprehensive review in a given year.
        </p>
        <p>
          <strong>Pharmacist roles</strong> are expanding but remain underutilized. Clinical pharmacists embedded in primary care practices have been shown to reduce polypharmacy, improve medication adherence, and lower adverse event rates. Some Medicare Advantage plans have begun integrating pharmacist reviews into care management, but fee-for-service Medicare still lacks a robust mechanism to reimburse pharmacists for this work outside of MTM.
        </p>
        <p>
          <strong>CMS Star Ratings</strong> include medication-related quality measures that incentivize Part D plans to address polypharmacy. High-risk medication use in the elderly (HRM) and medication adherence for diabetes, hypertension, and cholesterol are all Star Rating measures. Plans that score poorly face financial penalties and reduced enrollment, creating a business case for medication review programs. However, the measures focus more on adherence (ensuring patients take prescribed drugs) than on appropriateness (ensuring the prescribed drugs are still needed).
        </p>
        <p>
          Looking forward, several policy proposals could meaningfully reduce polypharmacy harm: requiring annual comprehensive medication reviews for all beneficiaries taking five or more drugs, expanding pharmacist prescriptive authority for deprescribing, integrating <Link href="/analysis/geographic">regional prescribing data</Link> into plan oversight, and creating quality measures that reward medication reduction where appropriate — not just medication adherence.
        </p>

        <h2>The Role of Pharmacy Benefit Managers</h2>
        <p>
          Pharmacy benefit managers (PBMs) sit at the intersection of prescribing and dispensing, giving them unique visibility into polypharmacy. PBMs manage formularies, process claims, and in theory can flag dangerous combinations at the point of sale. In practice, alert fatigue is a significant problem: pharmacists may see dozens of drug interaction warnings per shift, most of which are clinically insignificant, leading them to override even serious alerts. CMS has pushed Part D plans to implement more targeted, high-priority alerts, but the technology and workflow challenges remain substantial.
        </p>
        <p>
          Some PBMs have begun implementing &quot;comprehensive medication review&quot; programs that go beyond automated alerts. These programs assign a clinical pharmacist to review a patient&#39;s entire medication profile, contact prescribers about potential problems, and recommend changes. Early evidence suggests these programs can reduce emergency department visits and hospitalizations, but they require significant investment in pharmacist time — a cost that plans must weigh against potential savings.
        </p>

        <h2>Patient and Caregiver Empowerment</h2>
        <p>
          Patients and their families are often the last line of defense against harmful polypharmacy, yet they are rarely given the tools to play that role effectively. Most patients cannot name all their medications, let alone assess whether the combination is safe. Caregivers — often adult children managing a parent&#39;s care — may not have access to the full prescription history, especially when multiple providers and pharmacies are involved.
        </p>
        <p>
          OpenPrescriber aims to change this dynamic. By making provider-level prescribing data accessible and understandable, we give patients and caregivers the ability to ask informed questions: &quot;I see you prescribe 45 unique drugs to your patient panel — can we review whether all of mine are still necessary?&quot; Transparency does not replace clinical judgment, but it enables the conversations that clinical judgment requires.
        </p>

        <h2>The Dangerous Combinations</h2>
        <p>
          We identified <strong>{fmt(combos.length)} providers</strong> who prescribe both opioids and benzodiazepines — a combination the FDA has issued a <Link href="/dangerous-combinations">Black Box Warning</Link> about due to life-threatening respiratory depression. This is just one of many dangerous combinations hiding in the data.
        </p>
        <p>
          Other concerning combinations that our data can flag:
        </p>
        <ul>
          <li><strong>Opioids + muscle relaxants</strong> — Triple the overdose risk</li>
          <li><strong>Antipsychotics in elderly dementia patients</strong> — FDA Black Box Warning (we track this via our <Link href="/analysis/antipsychotic-elderly">antipsychotic analysis</Link>)</li>
          <li><strong>Multiple prescribers for the same patient</strong> — &quot;Doctor shopping&quot; patterns that enable drug accumulation</li>
        </ul>

        <h2>The Top 10 Most-Prescribed Drugs</h2>
        <p>
          The sheer volume of prescriptions for common drugs gives context to the polypharmacy problem:
        </p>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm bg-white rounded-xl border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">#</th>
                <th className="px-4 py-2 text-left font-semibold">Drug</th>
                <th className="px-4 py-2 text-right font-semibold">Claims</th>
                <th className="px-4 py-2 text-right font-semibold">Patients</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {drugs.sort((a, b) => b.claims - a.claims).slice(0, 10).map((d, i) => (
                <tr key={d.brand}>
                  <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-2 font-medium">{d.brand} <span className="text-gray-400 text-xs">({d.generic})</span></td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(d.claims)}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(d.benes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Looking Ahead</h2>
        <p>
          The polypharmacy problem is unlikely to resolve on its own. The Medicare population is aging, chronic disease prevalence is rising, and new medications continue to enter the market. Without deliberate intervention — better coordination, routine deprescribing, expanded pharmacist roles, and transparent data — the burden of unnecessary and harmful medication use will continue to grow.
        </p>
        <p>
          Artificial intelligence and machine learning tools may eventually help. Algorithms trained on claims data can identify patients at highest risk of adverse drug events, flag prescribing cascades in real time, and prioritize patients for medication review. Several academic medical centers are piloting such tools, though none have yet achieved widespread adoption. The foundation of any such system is data — and Medicare Part D&#39;s public use files represent one of the richest prescribing datasets in the world.
        </p>

        <h2>What Can Be Done?</h2>
        <ol>
          <li><strong>Medication therapy management (MTM)</strong> — CMS already requires Part D plans to offer MTM to high-risk patients, but utilization remains low.</li>
          <li><strong>Deprescribing protocols</strong> — Actively reviewing and reducing unnecessary medications, especially in elderly patients with long medication lists.</li>
          <li><strong>Better data sharing</strong> — Prescription Drug Monitoring Programs (PDMPs) help, but cross-state and cross-provider coordination remains poor.</li>
          <li><strong>Transparency</strong> — Tools like OpenPrescriber that surface prescribing patterns help patients, caregivers, and regulators identify potential problems.</li>
          <li><strong>Annual medication audits</strong> — Requiring a yearly comprehensive review for all beneficiaries on 5+ medications, not just those who meet current MTM cost thresholds.</li>
          <li><strong>Interoperable health records</strong> — Ensuring every provider can see every active prescription, regardless of which pharmacy filled it or which health system ordered it.</li>
        </ol>
        <p>
          The data exists to make meaningful progress on polypharmacy. What remains is the collective will — among providers, payers, regulators, and patients — to use it. Every unnecessary medication removed is a potential adverse event prevented, a hospitalization avoided, and a patient whose quality of life improves. The stakes could not be higher for Medicare&#39;s most vulnerable beneficiaries.
        </p>
      </div>

      <RelatedAnalysis current="/analysis/polypharmacy" />
    </div>
  )
}
