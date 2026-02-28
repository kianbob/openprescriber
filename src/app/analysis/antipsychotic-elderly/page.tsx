import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import RelatedAnalysis from '@/components/RelatedAnalysis'

export const metadata: Metadata = {
  title: 'The Antipsychotic Problem in Elderly Medicare Patients',
  description: 'CMS tracks antipsychotic prescribing to patients 65+ as a quality concern. What does the data show about patterns in Medicare Part D?',
  alternates: { canonical: 'https://www.openprescriber.org/analysis/antipsychotic-elderly' },
}

export default function AntipsychoticElderlyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Antipsychotic Prescribing' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">The Antipsychotic Problem in Elderly Care</h1>
      <ShareButtons title="Antipsychotic Prescribing to Elderly Patients" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          Antipsychotic medications prescribed to elderly patients — particularly those with dementia — carry serious risks including increased mortality. CMS specifically tracks this metric, and our risk model incorporates it.
        </p>

        <h2>Why CMS Tracks This</h2>
        <p>
          The FDA issued a black box warning in 2005 for atypical antipsychotics used in elderly dementia patients, citing a 1.6-1.7x increase in mortality. In 2008, this was extended to conventional antipsychotics. Despite these warnings, antipsychotic use in nursing homes and elderly care settings remained stubbornly high.
        </p>
        <p>
          CMS now tracks antipsychotic prescribing to patients aged 65 and older as a <strong>quality measure</strong> for nursing homes. High rates may indicate chemical restraint use rather than medically necessary treatment.
        </p>

        <h2>What the Data Shows</h2>
        <p>
          The Medicare Part D dataset includes a field specifically for antipsychotic claims prescribed to beneficiaries aged 65+. Providers with elevated rates in this field appear in our risk scoring model.
        </p>

        <h2>Legitimate vs Concerning Use</h2>
        <p>Antipsychotics have legitimate uses in elderly patients:</p>
        <ul>
          <li><strong>Schizophrenia and bipolar disorder</strong> — These don&apos;t disappear at 65</li>
          <li><strong>Severe agitation with psychosis</strong> — When non-pharmacological interventions fail</li>
          <li><strong>Delirium</strong> — Short-term use in acute settings</li>
        </ul>
        <p>But they are concerning when used as:</p>
        <ul>
          <li><strong>Chemical restraints</strong> — Sedating patients for staff convenience</li>
          <li><strong>First-line dementia management</strong> — Before behavioral interventions</li>
          <li><strong>Chronic prescriptions without review</strong> — Indefinite use without reassessment</li>
        </ul>

        <h2>Our Approach</h2>
        <p>
          We assign risk points to providers whose antipsychotic prescribing to patients 65+ exceeds statistical norms. This is one of ten components in our <Link href="/methodology">specialty-adjusted risk model</Link>. It is not, by itself, an indicator of wrongdoing — but it raises questions worth examining.
        </p>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">See flagged providers: <Link href="/flagged" className="text-primary font-medium hover:underline">All Flagged Providers →</Link></p>
        </div>
      <RelatedAnalysis current={"/analysis/antipsychotic-elderly"} />
      </div>
    </div>
  )
}
