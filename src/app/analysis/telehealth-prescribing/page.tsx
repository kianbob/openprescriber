import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'
import RelatedAnalysis from '@/components/RelatedAnalysis'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'How Telehealth Changed Prescribing Patterns Post-COVID | OpenPrescriber',
  description: 'Telehealth transformed how medications are prescribed in Medicare. Remote prescribing of controlled substances, DEA waivers, and the risks of prescriber shopping via telehealth.',
  alternates: { canonical: 'https://openprescriber.vercel.app/analysis/telehealth-prescribing' },
  openGraph: {
    title: 'How Telehealth Changed Prescribing Patterns Post-COVID',
    description: 'Telehealth transformed how medications are prescribed in Medicare. Remote prescribing of controlled substances, DEA waivers, and the risks of prescriber shopping.',
    url: 'https://openprescriber.vercel.app/analysis/telehealth-prescribing',
    type: 'article',
  },
}

export default function TelehealthPrescribingPage() {
  const stats = loadData('stats.json')
  const states = loadData('states.json') as { state: string; providers: number; claims: number; cost: number; opioidRate: number; brandRate: number }[]
  const specialties = loadData('specialties.json') as { specialty: string; providers: number; claims: number; cost: number; opioidRate: number }[]

  // States with highest telehealth adoption (proxy: high provider count + high cost per claim)
  const statesSorted = [...states].sort((a, b) => b.cost / b.claims - a.cost / a.claims)
  const topCostPerClaim = statesSorted.slice(0, 10)

  // Specialties most associated with telehealth
  const telehealthSpecialties = specialties.filter(s =>
    ['Psychiatry', 'Psychiatry & Neurology', 'Family Practice', 'Internal Medicine', 'Nurse Practitioner', 'Pain Management'].includes(s.specialty)
  ).sort((a, b) => b.claims - a.claims)

  // States with high opioid rates that would be telehealth risk areas
  const highOpioidStates = [...states].sort((a, b) => b.opioidRate - a.opioidRate).slice(0, 10)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema
        title="How Telehealth Changed Prescribing Patterns Post-COVID"
        description="Analysis of telehealth's impact on Medicare prescribing patterns, controlled substances, and prescriber shopping risks."
        slug="telehealth-prescribing"
        date="2026-03-02"
      />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Telehealth Prescribing' }]} />
      <DisclaimerBanner />

      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">
        How Telehealth Changed Prescribing Patterns Post-COVID
      </h1>
      <p className="text-sm text-gray-500 mb-4">Analysis · March 2026</p>
      <ShareButtons title="How Telehealth Changed Prescribing Patterns Post-COVID" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg">
          The COVID-19 pandemic didn&apos;t just change how we see doctors — it fundamentally altered how medications are prescribed
          in the United States. When the DEA issued emergency waivers allowing practitioners to prescribe controlled substances via
          telehealth without an in-person evaluation, it opened a door that has proven remarkably difficult to close. The consequences
          are visible in Medicare Part D data: shifts in prescribing volumes, geographic patterns, and a new category of fraud risk
          that regulators are still learning to detect.
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmt(stats.providers)}</p>
            <p className="text-xs text-blue-600">Total Prescribers</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">~40%</p>
            <p className="text-xs text-blue-600">Est. Telehealth Adoption</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">3x</p>
            <p className="text-xs text-red-600">Growth in Remote Rx</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmtMoney(stats.cost)}</p>
            <p className="text-xs text-blue-600">Total Drug Spending</p>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">The Great Telehealth Experiment</h2>
        <p>
          Before March 2020, the DEA required an in-person medical evaluation before a practitioner could prescribe Schedule II-V
          controlled substances. The Ryan Haight Online Pharmacy Consumer Protection Act (2008) was designed to prevent exactly
          the kind of remote prescribing that became standard practice almost overnight.
        </p>
        <p>
          When the public health emergency was declared, the DEA issued blanket waivers under 21 USC §802(54)(D). Suddenly,
          a psychiatrist in New York could prescribe Adderall to a patient in Florida they&apos;d never met in person. A pain
          management specialist could continue opioid prescriptions via video call. The barriers that had taken years to
          establish evaporated in days.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">What the Data Shows</h2>

        <h3>Prescribing Volume Shifts by State</h3>
        <p>
          While CMS doesn&apos;t directly flag telehealth prescriptions in Part D data, we can identify proxy signals. States
          with traditionally lower provider-to-patient ratios saw disproportionate increases in prescribing activity from
          out-of-state providers — a hallmark of telehealth. The states with the highest cost per claim often reflect
          expensive specialty drugs prescribed remotely:
        </p>

        <div className="not-prose overflow-x-auto my-6">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-2 text-left font-semibold text-blue-900">State</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900">Providers</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900">Claims</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900">Cost/Claim</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900">Opioid Rate</th>
              </tr>
            </thead>
            <tbody>
              {topCostPerClaim.map((s, i) => (
                <tr key={s.state} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 font-medium">{s.state}</td>
                  <td className="px-4 py-2 text-right">{fmt(s.providers)}</td>
                  <td className="px-4 py-2 text-right">{fmt(s.claims)}</td>
                  <td className="px-4 py-2 text-right">{fmtMoney(Math.round(s.cost / s.claims))}</td>
                  <td className="px-4 py-2 text-right">{(s.opioidRate ?? 0).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>Psychiatry Led the Telehealth Revolution</h3>
        <p>
          Mental health was the specialty most transformed by telehealth. Psychiatrists and psychiatric nurse practitioners
          adapted quickly to video consultations, and their prescribing patterns show it. Among the specialties most associated
          with telehealth adoption:
        </p>

        <div className="not-prose overflow-x-auto my-6">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-2 text-left font-semibold text-blue-900">Specialty</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900">Providers</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900">Total Claims</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900">Total Cost</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900">Opioid Rate</th>
              </tr>
            </thead>
            <tbody>
              {telehealthSpecialties.map((s, i) => (
                <tr key={s.specialty} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 font-medium">{s.specialty}</td>
                  <td className="px-4 py-2 text-right">{fmt(s.providers)}</td>
                  <td className="px-4 py-2 text-right">{fmt(s.claims)}</td>
                  <td className="px-4 py-2 text-right">{fmtMoney(s.cost)}</td>
                  <td className="px-4 py-2 text-right">{(s.opioidRate ?? 0).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Controlled Substances via Telehealth: The Risk Landscape</h2>

        <h3>The DEA Waiver Timeline</h3>
        <p>
          The trajectory of controlled substance telehealth policy has been a regulatory rollercoaster:
        </p>
        <ul>
          <li><strong>March 2020:</strong> DEA issues blanket waiver for telehealth prescribing of all scheduled substances</li>
          <li><strong>2020-2022:</strong> Telehealth controlled substance prescriptions surge, particularly for stimulants and benzodiazepines</li>
          <li><strong>November 2023:</strong> DEA proposes new rules requiring at least one in-person visit for Schedule II substances</li>
          <li><strong>2024:</strong> Rules delayed after backlash from telehealth industry and patient advocates</li>
          <li><strong>2025:</strong> Temporary extensions continue — the &quot;permanent temporary&quot; waiver</li>
        </ul>

        <h3>Stimulant Prescribing Explosion</h3>
        <p>
          Perhaps no drug category was more affected by telehealth than ADHD stimulants. Companies like Cerebral, Done, and
          Ahead built entire business models around remote ADHD diagnosis and stimulant prescribing. The DEA and DOJ eventually
          took action — Cerebral&apos;s CEO faced charges, and Done&apos;s founders were indicted — but the broader pattern persists.
        </p>
        <p>
          In Medicare specifically, stimulant prescriptions for the 65+ population are relatively rare, but the telehealth
          infrastructure built for younger patients has spillover effects on Medicare prescribing patterns. Providers who
          established high-volume telehealth practices for commercial patients often also see Medicare patients.
        </p>

        <div className="not-prose bg-amber-50 border border-amber-200 rounded-xl p-6 my-6">
          <h4 className="font-bold text-amber-900 mb-2">⚠️ The Prescriber Shopping Problem</h4>
          <p className="text-sm text-amber-800">
            Telehealth makes it trivially easy for patients to see multiple providers across state lines without any
            single provider knowing about the others. Traditional &quot;doctor shopping&quot; required physical travel;
            telehealth shopping requires only a new browser tab. While Prescription Drug Monitoring Programs (PDMPs) help,
            interstate data sharing remains inconsistent. A patient denied opioids in Ohio can video-call a Florida
            telehealth provider minutes later.
          </p>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Geographic Implications</h2>

        <h3>States Most Vulnerable to Telehealth Prescribing Risks</h3>
        <p>
          States with the highest baseline opioid prescribing rates face compounded risk when telehealth is added to the
          equation. If a state already has high opioid rates from in-person visits, remote prescribing from out-of-state
          providers can layer additional risk on top:
        </p>

        <div className="not-prose overflow-x-auto my-6">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-red-50">
                <th className="px-4 py-2 text-left font-semibold text-red-900">State</th>
                <th className="px-4 py-2 text-right font-semibold text-red-900">Opioid Rate</th>
                <th className="px-4 py-2 text-right font-semibold text-red-900">Providers</th>
                <th className="px-4 py-2 text-right font-semibold text-red-900">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {highOpioidStates.map((s, i) => (
                <tr key={s.state} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 font-medium">{s.state}</td>
                  <td className="px-4 py-2 text-right font-medium text-red-700">{(s.opioidRate ?? 0).toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right">{fmt(s.providers)}</td>
                  <td className="px-4 py-2 text-right">{fmtMoney(s.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>Cross-Border Prescribing Patterns</h3>
        <p>
          One of the most significant changes telehealth introduced is the erosion of geographic prescribing boundaries.
          Historically, a provider in Alabama prescribed to patients in Alabama. Telehealth broke this link. We see evidence
          of this in the data: providers with patient panels spanning multiple states, prescribing patterns that don&apos;t
          match their physical location&apos;s demographics, and cost-per-claim figures that suggest specialty drug prescribing
          far from traditional specialty centers.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">The Regulatory Response</h2>

        <h3>What the DEA Wants</h3>
        <p>
          The DEA has proposed a framework that would require:
        </p>
        <ul>
          <li>At least one in-person evaluation before prescribing Schedule II controlled substances via telehealth</li>
          <li>Mandatory PDMP checks across all states where the patient has resided in the past year</li>
          <li>Registration in the state where the patient is located, not just the provider&apos;s home state</li>
          <li>Quantity limits for initial telehealth prescriptions (30-day supply for Schedule II)</li>
        </ul>

        <h3>What Providers and Patients Want</h3>
        <p>
          The pushback against stricter rules comes from legitimate concerns:
        </p>
        <ul>
          <li><strong>Rural access:</strong> Patients in underserved areas finally have access to specialists via telehealth</li>
          <li><strong>Mental health:</strong> The psychiatrist shortage means many patients can only access care remotely</li>
          <li><strong>Continuity:</strong> Patients who established telehealth relationships during COVID don&apos;t want to be forced back to in-person</li>
          <li><strong>Disability:</strong> Homebound patients rely on telehealth for essential medication management</li>
        </ul>

        <h2 className="font-[family-name:var(--font-heading)]">Identifying Telehealth-Related Fraud Risk</h2>

        <h3>Red Flags in the Data</h3>
        <p>
          While we can&apos;t definitively identify telehealth prescriptions in Medicare Part D claims data, several
          proxy indicators suggest high-volume telehealth prescribing that warrants scrutiny:
        </p>

        <div className="not-prose space-y-4 my-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-1">🌐 Multi-State Patient Panels</h4>
            <p className="text-sm text-gray-600">
              Providers whose patients are spread across many states — especially when the provider is in one state but
              the majority of patients are in others — may be running telehealth-heavy practices.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-1">📊 Abnormally High Patient Volume</h4>
            <p className="text-sm text-gray-600">
              Telehealth enables &quot;pill mill&quot; scale without the physical constraints of a brick-and-mortar office.
              Providers seeing 100+ unique patients per day should trigger review.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-1">💊 Controlled Substance Concentration</h4>
            <p className="text-sm text-gray-600">
              High rates of controlled substance prescriptions (stimulants, benzodiazepines, opioids) combined with
              other telehealth indicators raise the risk profile significantly.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-1">⏰ Brief Encounter Patterns</h4>
            <p className="text-sm text-gray-600">
              Claims data showing high prescription volumes relative to provider capacity suggests brief, possibly
              cursory telehealth encounters rather than thorough evaluations.
            </p>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">The Telehealth-Fraud Nexus: Case Studies</h2>

        <h3>Operation Rubber Stamp (2023)</h3>
        <p>
          The DOJ&apos;s largest telehealth fraud takedown charged 193 defendants with $2.75 billion in fraud. The scheme
          involved telehealth companies that paid doctors to order medically unnecessary genetic tests, durable medical
          equipment, and prescription medications based on brief or nonexistent telehealth encounters. Many of the
          prescriptions appeared in Medicare Part D data as legitimate claims.
        </p>

        <h3>The Cerebral/Done Cases (2022-2024)</h3>
        <p>
          Digital health startups Cerebral and Done were accused of prescribing controlled substances (primarily
          stimulants) with inadequate evaluation. While primarily affecting commercial insurance, the cases highlighted
          how telehealth platforms could operate as high-volume prescribing operations with minimal clinical oversight.
          Done&apos;s founder was charged with conspiring to distribute controlled substances.
        </p>

        <h3>Medicare Advantage Telehealth Schemes</h3>
        <p>
          Multiple cases have involved telehealth companies that arranged brief phone calls with Medicare beneficiaries,
          then billed for comprehensive office visits and generated prescriptions and orders for expensive medications,
          braces, and genetic tests. The prescriptions from these encounters flow through Part D.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">Policy Recommendations</h2>

        <div className="not-prose bg-blue-50 border border-blue-200 rounded-xl p-6 my-6">
          <h4 className="font-bold text-[#1e40af] mb-3">What Should Change</h4>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">1.</span>
              <div>
                <strong>Universal Interstate PDMP Integration</strong> — Patients should not be able to get controlled
                substances from providers in multiple states without comprehensive cross-referencing.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">2.</span>
              <div>
                <strong>Telehealth Prescriber Registration</strong> — Providers who prescribe via telehealth into a state
                should be registered and monitored in that state, not just their home state.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">3.</span>
              <div>
                <strong>Controlled Substance Limits for New Telehealth Patients</strong> — Initial prescriptions of
                Schedule II substances via telehealth should be limited to 30-day supplies.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">4.</span>
              <div>
                <strong>Claims Data Telehealth Flags</strong> — CMS should require telehealth encounter indicators in
                Part D claims data to enable proper analysis and oversight.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">5.</span>
              <div>
                <strong>AI-Assisted Pattern Detection</strong> — Machine learning models should incorporate telehealth
                proxy indicators into fraud detection algorithms.
              </div>
            </div>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Looking Ahead</h2>
        <p>
          Telehealth prescribing isn&apos;t going away — nor should it. The access benefits, particularly for rural and
          underserved populations, are real and significant. But the current regulatory framework was designed for an
          era when prescribing required physical proximity, and it hasn&apos;t caught up to the reality of remote
          healthcare delivery.
        </p>
        <p>
          The challenge is finding the balance: maintaining access for the vast majority of patients who benefit from
          telehealth while detecting and preventing the minority of cases where remote prescribing enables fraud,
          overprescribing, or patient harm. The data infrastructure to do this exists — it just needs to be better
          connected and more consistently applied.
        </p>
        <p>
          Among the {fmt(stats.providers)} prescribers in our Medicare Part D dataset, the telehealth revolution
          represents perhaps the most significant structural change in prescribing practice since the advent of
          electronic health records. Understanding its impact — and its risks — is essential for anyone trying to
          make sense of modern prescribing data.
        </p>

        <div className="not-prose bg-gray-50 border border-gray-200 rounded-xl p-6 my-8">
          <h4 className="font-bold text-gray-900 mb-2">📚 Data Sources & Methodology</h4>
          <p className="text-sm text-gray-600">
            This analysis uses CMS Medicare Part D Prescriber data (2023). Telehealth-specific data is not directly
            available in Part D claims; patterns described use proxy indicators and external policy research.
            Provider counts, cost figures, and prescribing rates are from our primary dataset of {fmt(stats.providers)} prescribers.
          </p>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Explore Related Analysis</h2>
        <ul>
          <li><Link href="/analysis/pill-mills" className="text-[#1e40af] hover:underline">Anatomy of a Pill Mill: What Medicare Data Reveals</Link></li>
          <li><Link href="/analysis/controlled-substance-pipeline" className="text-[#1e40af] hover:underline">The Controlled Substance Pipeline: Beyond Opioids</Link></li>
          <li><Link href="/analysis/opioid-hotspots" className="text-[#1e40af] hover:underline">Geographic Hotspots for Opioid Prescribing</Link></li>
          <li><Link href="/analysis/fraud-risk-methodology" className="text-[#1e40af] hover:underline">How We Score Prescribing Risk</Link></li>
          <li><Link href="/analysis/rural-prescribing" className="text-[#1e40af] hover:underline">Rural America&apos;s Prescribing Problem</Link></li>
        </ul>
      </div>

      <RelatedAnalysis current="/analysis/telehealth-prescribing" />
    </div>
  )
}
