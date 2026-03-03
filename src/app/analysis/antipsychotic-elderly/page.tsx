import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ArticleSchema from '@/components/ArticleSchema'
import ShareButtons from '@/components/ShareButtons'
import RelatedAnalysis from '@/components/RelatedAnalysis'

export const metadata: Metadata = {
  title: 'The Antipsychotic Problem in Elderly Medicare Patients',
  description: 'CMS tracks antipsychotic prescribing to patients 65+ as a quality concern. What does the data show about patterns in Medicare Part D?',
  openGraph: {
    title: 'The Antipsychotic Problem in Elderly Medicare Patients',
    description: 'CMS tracks antipsychotic prescribing to patients 65+ as a quality concern. What does the data show about patterns in Medicare Part D?',
    url: 'https://www.openprescriber.org/analysis/antipsychotic-elderly',
    type: 'article',
  },
  alternates: { canonical: 'https://www.openprescriber.org/analysis/antipsychotic-elderly' },
}

export default function AntipsychoticElderlyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Antipsychotic Prescribing' }]} />
      <ArticleSchema title="Antipsychotics in Elderly Medicare Patients" description="Off-label antipsychotic prescribing in nursing homes." slug="antipsychotic-elderly" date="2026-03-01" />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">The Antipsychotic Problem in Elderly Care</h1>
      <ShareButtons title="Antipsychotic Prescribing to Elderly Patients" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          Antipsychotic medications prescribed to elderly patients — particularly those with dementia — carry serious
          risks including increased mortality. Despite FDA warnings dating back nearly two decades, hundreds of thousands
          of elderly Americans continue to receive these drugs, often without a psychiatric diagnosis that would justify
          their use. CMS specifically tracks this metric as a quality measure, and our risk model incorporates it as a
          key signal of potentially problematic prescribing.
        </p>

        <h2>The FDA Black Box Warning</h2>
        <p>
          In 2005, the FDA took the extraordinary step of requiring a <strong>black box warning</strong> — the most
          serious warning the agency can mandate — on all atypical antipsychotic medications when prescribed to elderly
          patients with dementia-related psychosis. The warning was based on a meta-analysis of 17 placebo-controlled
          trials involving drugs like olanzapine, aripiprazole, risperidone, and quetiapine. These trials showed that
          elderly dementia patients taking atypical antipsychotics had roughly <strong>1.6 to 1.7 times the risk of
          death</strong> compared to those taking a placebo.
        </p>
        <p>
          The causes of death varied — heart failure, sudden cardiac death, infections, particularly pneumonia — but the
          pattern was consistent across drugs in the class. In 2008, the FDA extended the black box warning to
          conventional (first-generation) antipsychotics like haloperidol, after observational studies suggested the
          mortality risk was at least as high, and potentially higher, with the older drugs.
        </p>
        <p>
          It is important to understand what this warning means in practice: <strong>no antipsychotic medication is
          FDA-approved for the treatment of dementia-related behavioral symptoms</strong>. Every prescription of an
          antipsychotic for agitation, aggression, or psychosis in an elderly dementia patient is, by definition,
          off-label use. This does not make it automatically inappropriate — physicians prescribe off-label for many
          conditions — but it does mean that each prescription should reflect a careful weighing of risks against
          benefits, with informed consent from the patient or their surrogate decision-maker.
        </p>

        <h2>The Nursing Home Problem</h2>
        <p>
          The black box warning was issued in 2005, but antipsychotic use in nursing homes barely budged. By 2011,
          studies found that roughly <strong>one in four nursing home residents</strong> with dementia was receiving an
          antipsychotic medication. For most of these patients, there was no documented diagnosis of schizophrenia,
          bipolar disorder, or another condition for which antipsychotics are approved.
        </p>
        <p>
          The problem is rooted in a difficult reality. Dementia patients can exhibit behaviors that are genuinely
          distressing and dangerous — hitting, screaming, wandering, resisting care. These behaviors are exhausting for
          caregivers and disruptive to other residents. Antipsychotics sedate patients effectively, and in understaffed
          facilities, the pressure to prescribe is enormous.
        </p>
        <p>
          This practice has a name: <strong>chemical restraint</strong>. Rather than physical restraints — strapping a
          patient to a bed or wheelchair, which fell out of favor after reforms in the 1980s and 1990s — facilities
          turned to medications that achieved a similar outcome. A sedated patient does not wander, does not hit, does
          not scream. The patient is &quot;managed.&quot;
        </p>
        <p>
          Federal regulations under the Nursing Home Reform Act of 1987 (OBRA &apos;87) explicitly prohibit the use of
          chemical restraints for the convenience of staff. Yet enforcement has historically been inconsistent. Surveyors
          may note antipsychotic use in facility records, but the line between &quot;medically necessary&quot; and
          &quot;convenience prescribing&quot; is often blurry in practice, and facilities have learned to document
          justifications that satisfy inspectors without necessarily reflecting clinical reality.
        </p>

        <h2>CMS and the National Partnership</h2>
        <p>
          In 2012, CMS launched the <strong>National Partnership to Improve Dementia Care in Nursing Homes</strong>,
          an ambitious initiative with a specific, measurable goal: reduce antipsychotic use in nursing homes. The
          Partnership brought together state survey agencies, nursing home operators, medical directors, and advocacy
          groups. It emphasized non-pharmacological interventions — music therapy, structured activities, individualized
          care plans, staff training in dementia care — as alternatives to medication.
        </p>
        <p>
          The results were significant. Between 2012 and 2020, the national rate of antipsychotic use in long-stay
          nursing home residents declined by roughly <strong>40 percent</strong>. CMS began publicly reporting
          facility-level antipsychotic use rates on its Nursing Home Compare website (now Care Compare), creating
          transparency and competitive pressure among facilities.
        </p>
        <p>
          However, critics have raised concerns about how much of this decline represents genuine improvement versus
          diagnostic gaming. Some facilities began adding diagnoses of schizophrenia or bipolar disorder to patient
          records — conditions that exclude patients from the quality measure — without clear clinical justification.
          A 2021 HHS Office of Inspector General report found that the rate of schizophrenia diagnoses among newly
          admitted nursing home residents had increased suspiciously during the same period that antipsychotic quality
          measures were being tracked.
        </p>
        <p>
          Despite these concerns, the National Partnership represents one of the most successful quality improvement
          initiatives in Medicare&apos;s history. The combination of transparency, measurement, and education did move
          the needle — even if the picture is more complicated than the headline numbers suggest.
        </p>

        <h2>What Our Data Shows</h2>
        <p>
          The Medicare Part D prescriber dataset includes a specific field — <code>antipsychGE65Claims</code> —
          that counts the number of antipsychotic prescriptions each provider wrote for beneficiaries aged 65 and older.
          This field allows us to identify providers with unusually high volumes of elderly antipsychotic prescribing
          relative to their peers in the same specialty.
        </p>
        <p>
          Across the dataset, the distribution of this field is heavily skewed. Most providers have zero or very few
          antipsychotic claims for elderly patients. A small number of providers account for a disproportionate share
          of total prescriptions. This pattern is consistent with what we would expect: a small number of clinicians
          serving nursing homes or long-term care facilities where antipsychotic use is concentrated.
        </p>
        <p>
          When a provider&apos;s antipsychotic prescribing to patients 65+ significantly exceeds the norm for their
          specialty, our model assigns risk points. The threshold is not a simple cutoff — it accounts for specialty
          type, total patient volume, and the statistical distribution of prescribing within that specialty. A
          psychiatrist treating patients in a state psychiatric hospital will naturally have more antipsychotic claims
          than a family medicine physician, and our model accounts for this.
        </p>

        <h2>Which Specialties Prescribe the Most</h2>
        <p>
          Antipsychotic prescribing to elderly patients is not evenly distributed across medical specialties.
          As one would expect, <strong>psychiatry</strong> accounts for the highest per-provider rates. Psychiatrists
          are the specialists most likely to treat schizophrenia, bipolar disorder, and treatment-resistant psychosis
          in elderly populations, and many of their prescriptions are clinically appropriate.
        </p>
        <p>
          More concerning are elevated rates among <strong>internal medicine physicians</strong>,{' '}
          <strong>family medicine physicians</strong>, and <strong>nurse practitioners</strong> — particularly those
          who serve as attending providers in nursing homes and long-term care facilities. These providers may be
          under pressure from facility staff to prescribe antipsychotics for behavioral management, and they may
          lack the psychiatric training to fully evaluate whether the medication is appropriate or whether
          non-pharmacological alternatives have been adequately tried.
        </p>
        <p>
          Nurse practitioners have become an increasingly significant presence in nursing home care, partly due to
          physician shortages in long-term care settings. While many NPs provide excellent care, the combination of
          autonomous prescribing authority, limited psychiatric training, and the high-pressure nursing home environment
          creates conditions where antipsychotic overprescribing can occur. Our data reflects this — NPs appear among
          flagged providers at rates that warrant attention.
        </p>

        <h2>The Human Cost</h2>
        <p>
          The statistics about increased mortality risk can feel abstract, so it is worth stating plainly what they
          mean. For every 100 elderly dementia patients treated with antipsychotics for a typical course of 10-12
          weeks, the evidence suggests that roughly <strong>one to two additional patients will die</strong> compared
          to a group receiving a placebo. These are excess deaths — deaths that would not have occurred without the
          medication.
        </p>
        <p>
          Beyond mortality, antipsychotics carry a range of serious side effects in elderly patients. They increase
          the risk of stroke and cerebrovascular events. They cause sedation that leads to falls, which in frail
          elderly patients can result in hip fractures and subsequent decline. They can worsen cognitive impairment,
          accelerating the very dementia they are sometimes prescribed to manage. They cause metabolic effects
          including weight gain and diabetes. And they can cause extrapyramidal symptoms — involuntary movements,
          rigidity, tremor — that reduce quality of life.
        </p>
        <p>
          For patients who are already in the final stages of life, sedation may sometimes be compassionate. But for
          the many elderly patients who are prescribed antipsychotics chronically — months or years without
          reassessment — the cumulative harm is substantial. Studies suggest that many nursing home residents
          could have their antipsychotics safely tapered and discontinued, with behavioral symptoms managed through
          non-pharmacological approaches, yet inertia and convenience keep prescriptions in place.
        </p>

        <h2>Legitimate vs Concerning Use</h2>
        <p>
          Not every antipsychotic prescription for an elderly patient represents poor care. There are clear clinical
          scenarios where these medications are appropriate:
        </p>
        <ul>
          <li><strong>Schizophrenia and bipolar disorder</strong> — These conditions do not disappear at age 65.
            Patients with lifelong psychiatric illness continue to need their medications, and discontinuing
            antipsychotics in a stable schizophrenia patient would be harmful.</li>
          <li><strong>Severe agitation with psychosis</strong> — When a patient is experiencing hallucinations or
            delusions that cause significant distress or danger, and non-pharmacological interventions have been
            tried and failed, short-term antipsychotic use may be the most humane option.</li>
          <li><strong>Delirium</strong> — In acute hospital settings, low-dose antipsychotics are sometimes used
            for hyperactive delirium, though evidence for this practice is mixed.</li>
          <li><strong>Parkinson&apos;s disease psychosis</strong> — Pimavanserin (Nuplazid) is specifically approved
            for this indication, and quetiapine and clozapine are used off-label with reasonable evidence.</li>
        </ul>
        <p>The prescriptions that raise concern are those that look like:</p>
        <ul>
          <li><strong>Chemical restraints</strong> — Sedating patients primarily for the convenience of facility staff
            rather than for the patient&apos;s clinical benefit</li>
          <li><strong>First-line dementia management</strong> — Prescribing antipsychotics before adequately trying
            behavioral interventions, environmental modifications, or caregiver training</li>
          <li><strong>Chronic prescriptions without review</strong> — Continuing antipsychotics indefinitely without
            periodic reassessment and attempts at dose reduction or discontinuation</li>
          <li><strong>Multiple antipsychotics simultaneously</strong> — Polypharmacy with two or more antipsychotics,
            which compounds risks without clear evidence of benefit</li>
        </ul>

        <h2>How We Flag This</h2>
        <p>
          Antipsychotic prescribing to patients 65+ is one of the components in our{' '}
          <Link href="/methodology">specialty-adjusted risk model</Link>. When a provider&apos;s volume of elderly
          antipsychotic claims is statistically elevated relative to their specialty peers, the model assigns risk
          points proportional to the degree of deviation.
        </p>
        <p>
          This metric is not evaluated in isolation. A provider who appears elevated on antipsychotic elderly
          prescribing but is otherwise unremarkable will receive a modest risk score. A provider who is elevated on
          antipsychotic elderly prescribing <em>and</em> shows other concerning patterns — high opioid volume,
          unusual brand-name prescribing, geographic outlier status — will receive a higher composite score that
          reflects the convergence of multiple signals.
        </p>
        <p>
          We emphasize that a flag does not indicate wrongdoing. Many flagged providers are psychiatrists or
          geriatric specialists serving high-acuity populations where antipsychotic use, while elevated compared
          to the average, is clinically justified. The flag is an invitation to look more closely — not a verdict.
        </p>

        <h2>Policy Implications</h2>
        <p>
          The persistence of antipsychotic overprescribing in elderly care, despite nearly two decades of warnings
          and a major national initiative, suggests that the problem is structural rather than merely educational.
          Providers know about the risks. The issue is that the incentives and conditions in long-term care settings
          continue to favor prescribing over alternatives.
        </p>
        <p>
          Meaningful reform likely requires several approaches working in concert: <strong>adequate staffing
          ratios</strong> in nursing homes so that behavioral interventions are feasible, not just aspirational;{' '}
          <strong>robust enforcement</strong> of existing chemical restraint prohibitions by state survey agencies;{' '}
          <strong>prescriber education</strong> that goes beyond awareness and includes practical training in
          non-pharmacological dementia care; and <strong>transparency tools</strong> like OpenPrescriber that make
          prescribing patterns visible to families, regulators, and the public.
        </p>
        <p>
          The data also points to a need for better diagnostic integrity. If quality measures are driving diagnostic
          gaming — adding schizophrenia diagnoses to avoid antipsychotic quality flags — then the measures need to
          be redesigned to account for this. CMS has begun exploring diagnosis-adjusted metrics, but progress has
          been slow.
        </p>

        <h2>What You Can Do</h2>
        <p>
          If you have a family member in a nursing home or long-term care facility, you have the right to ask
          questions about their medications. Specifically:
        </p>
        <ul>
          <li><strong>Ask whether they are receiving antipsychotics</strong> — and if so, for what diagnosis.
            If the answer is &quot;agitation&quot; or &quot;behavioral management&quot; without a qualifying
            psychiatric diagnosis, ask whether non-pharmacological alternatives have been tried.</li>
          <li><strong>Request a gradual dose reduction</strong> — Federal regulations require facilities to
            attempt dose reductions of antipsychotics unless clinically contraindicated. You can ask about
            this process and whether it has been attempted.</li>
          <li><strong>Check the facility&apos;s quality ratings</strong> — CMS Care Compare
            reports antipsychotic use rates for every Medicare-certified nursing home. Facilities with
            rates significantly above the national average deserve scrutiny.</li>
          <li><strong>Use OpenPrescriber</strong> — Search for the prescribing provider on our platform to see
            how their antipsychotic prescribing compares to their peers. Context matters, but data is a
            starting point for informed conversations.</li>
        </ul>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            See flagged providers:{' '}
            <Link href="/flagged" className="text-primary font-medium hover:underline">
              All Flagged Providers →
            </Link>
          </p>
        </div>
      <RelatedAnalysis current={"/analysis/antipsychotic-elderly"} />
      </div>
    </div>
  )
}
