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
  title: 'The Controlled Substance Pipeline: Beyond Opioids | OpenPrescriber',
  description: 'Beyond opioids: benzodiazepines, stimulants, gabapentin, and the broader controlled substance prescribing picture in Medicare Part D. Which providers prescribe multiple categories?',
  alternates: { canonical: 'https://www.openprescriber.org/analysis/controlled-substance-pipeline' },
  openGraph: {
    title: 'The Controlled Substance Pipeline: Beyond Opioids',
    description: 'Benzodiazepines, stimulants, gabapentin abuse — the broader controlled substance prescribing picture in Medicare.',
    url: 'https://www.openprescriber.org/analysis/controlled-substance-pipeline',
    type: 'article',
  },
}

export default function ControlledSubstancePipelinePage() {
  const stats = loadData('stats.json')
  const highRisk = loadData('high-risk.json') as { npi: string; name: string; specialty: string; state: string; city: string; opioidRate: number; riskScore: number; riskFlags: string[]; claims: number; cost: number }[]
  const specialties = loadData('specialties.json') as { specialty: string; providers: number; claims: number; cost: number; opioidRate: number }[]
  const states = loadData('states.json') as { state: string; providers: number; claims: number; cost: number; opioidRate: number }[]

  // Providers with opioid flags
  const opioidFlagged = highRisk.filter(p => p.riskFlags.some(f => f.includes('opioid')))

  // High opioid providers by specialty
  const highOpioidBySpecialty = new Map<string, number>()
  opioidFlagged.forEach(p => {
    highOpioidBySpecialty.set(p.specialty, (highOpioidBySpecialty.get(p.specialty) || 0) + 1)
  })
  const opioidSpecialtyRanking = Array.from(highOpioidBySpecialty.entries())
    .map(([specialty, count]) => ({ specialty, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)

  // Specialties with highest opioid rates
  const topOpioidSpecialties = [...specialties]
    .filter(s => s.providers > 100)
    .sort((a, b) => b.opioidRate - a.opioidRate)
    .slice(0, 15)

  // States with highest opioid rates
  const topOpioidStates = [...states]
    .sort((a, b) => b.opioidRate - a.opioidRate)
    .slice(0, 15)

  // Multi-flag providers (multiple risk categories)
  const multiFlagProviders = highRisk
    .filter(p => p.riskFlags.length >= 2)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 10)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema
        title="The Controlled Substance Pipeline: Beyond Opioids"
        description="Analysis of benzodiazepines, stimulants, gabapentin, and multi-category controlled substance prescribing in Medicare."
        slug="controlled-substance-pipeline"
        date="2026-03-02"
      />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Controlled Substance Pipeline' }]} />
      <DisclaimerBanner variant="risk" />

      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">
        The Controlled Substance Pipeline: Beyond Opioids
      </h1>
      <p className="text-sm text-gray-500 mb-4">Analysis · March 2026</p>
      <ShareButtons title="The Controlled Substance Pipeline: Beyond Opioids" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg">
          The opioid crisis dominates headlines, but it&apos;s only one part of a broader controlled substance prescribing
          picture. Benzodiazepines kill more people than any opioid except fentanyl. Stimulant prescriptions have surged
          amid the Adderall shortage. Gabapentin — technically not a controlled substance at the federal level — has become
          one of the most misused drugs in America. And some providers prescribe across <em>multiple</em> controlled substance
          categories simultaneously, creating compounded risk for their patients.
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmt(stats.opioidProv)}</p>
            <p className="text-xs text-blue-600">Opioid Prescribers</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">{fmt(stats.highOpioid)}</p>
            <p className="text-xs text-red-600">High-Rate Opioid Rx</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
            <p className="text-2xl font-bold text-amber-700">{fmt(opioidFlagged.length)}</p>
            <p className="text-xs text-amber-600">Opioid-Flagged Providers</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
            <p className="text-2xl font-bold text-purple-700">{fmt(multiFlagProviders.length > 0 ? highRisk.filter(p => p.riskFlags.length >= 2).length : 0)}</p>
            <p className="text-xs text-purple-600">Multi-Flag Providers</p>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">The Four Horsemen of Controlled Substances</h2>

        <h3>1. Opioids: The Known Crisis</h3>
        <p>
          Opioids remain the most scrutinized controlled substance category in Medicare. Among {fmt(stats.providers)} prescribers,
          {fmt(stats.opioidProv)} ({((stats.opioidProv / stats.providers) * 100).toFixed(0)}%) write at least some opioid
          prescriptions. Of these, {fmt(stats.highOpioid)} have opioid rates that exceed their specialty&apos;s norm —
          the providers most likely to be contributing to the crisis.
        </p>
        <p>
          But the opioid story has evolved. The current wave of overdose deaths is driven primarily by illicit fentanyl,
          not prescription opioids. Still, prescription opioids remain a gateway: approximately 80% of people who use
          heroin first misused prescription opioids. Medicare data captures the prescription pipeline — the legal supply
          that can feed into the illicit market.
        </p>

        <h3>2. Benzodiazepines: The Silent Killer</h3>
        <p>
          Benzodiazepines — Xanax (alprazolam), Valium (diazepam), Klonopin (clonazepam), Ativan (lorazepam) — are
          prescribed for anxiety, insomnia, and seizures. They&apos;re the most commonly prescribed psychotropic
          drugs in the US, and they&apos;re remarkably dangerous:
        </p>
        <ul>
          <li><strong>12,499 overdose deaths</strong> involving benzodiazepines in 2021 (CDC)</li>
          <li><strong>Synergistic with opioids</strong> — combining benzos with opioids dramatically increases overdose risk (the FDA issued a Black Box Warning)</li>
          <li><strong>Dependence develops quickly</strong> — physical dependence can develop in as little as 2-4 weeks</li>
          <li><strong>Elderly are most vulnerable</strong> — falls, cognitive impairment, and respiratory depression disproportionately affect Medicare-age patients</li>
        </ul>
        <p>
          The Beers Criteria — the American Geriatrics Society&apos;s list of potentially inappropriate medications
          for older adults — explicitly includes benzodiazepines. Yet millions of Medicare patients receive them.
        </p>

        <div className="not-prose bg-red-50 border border-red-200 rounded-xl p-6 my-6">
          <h4 className="font-bold text-red-900 mb-2">⚠️ The Opioid-Benzodiazepine Combination</h4>
          <p className="text-sm text-red-800">
            Concurrent prescribing of opioids and benzodiazepines is one of the most dangerous patterns we track.
            Both drug classes suppress breathing; together, they dramatically increase the risk of fatal respiratory
            depression. Despite the FDA&apos;s 2016 Black Box Warning, this combination remains alarmingly common
            in Medicare. Our <Link href="/analysis/pill-mills" className="text-[#1e40af] hover:underline">pill mill analysis</Link> identifies
            providers who co-prescribe these drug classes at high rates.
          </p>
        </div>

        <h3>3. Stimulants: The ADHD Surge</h3>
        <p>
          While stimulants (Adderall, Ritalin, Vyvanse, Concerta) are most associated with younger populations,
          their prescribing has implications for Medicare in several ways:
        </p>
        <ul>
          <li><strong>Growing ADHD diagnosis in adults 50+</strong> — recognition of adult ADHD has increased, leading to more stimulant prescriptions in the Medicare-eligible population</li>
          <li><strong>The Adderall shortage (2022-present)</strong> — DEA manufacturing quotas haven&apos;t kept pace with demand, leading to supply disruptions, pharmacy hopping, and desperate patients turning to telehealth mills</li>
          <li><strong>Diversion risk</strong> — stimulants are among the most commonly diverted prescription drugs</li>
          <li><strong>Cardiovascular risk</strong> — in elderly patients, stimulants carry significant cardiovascular risks including increased blood pressure, tachycardia, and potential for stroke</li>
        </ul>
        <p>
          The Adderall shortage has been particularly revealing. When legitimate supply channels fail, it exposes the
          fragility of the controlled substance distribution system and creates opportunities for exploitation by
          providers willing to prescribe more freely.
        </p>

        <h3>4. Gabapentin: The Unofficial Controlled Substance</h3>
        <p>
          Gabapentin (Neurontin) occupies a unique position in the controlled substance landscape. It&apos;s not
          federally scheduled, but:
        </p>
        <ul>
          <li><strong>8 states</strong> have classified gabapentin as a Schedule V controlled substance</li>
          <li><strong>Misuse is widespread</strong> — an estimated 40-65% of gabapentin prescriptions are misused</li>
          <li><strong>Potentiates opioids</strong> — gabapentin enhances the euphoric effects of opioids, making it popular for co-abuse</li>
          <li><strong>Found in 1 in 10 overdose deaths</strong> — gabapentin is increasingly detected in fatal overdose toxicology reports</li>
          <li><strong>Massive prescribing volume</strong> — gabapentin is one of the most prescribed drugs in the US (over 60 million prescriptions annually)</li>
        </ul>
        <p>
          In Medicare, gabapentin is often prescribed alongside opioids for pain management. While this can be
          legitimate (gabapentin is FDA-approved for post-herpetic neuralgia), the combination raises risk flags
          that our scoring system tracks.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">Multi-Category Controlled Substance Prescribers</h2>
        <p>
          The most concerning pattern isn&apos;t any single controlled substance category — it&apos;s providers who
          prescribe heavily across multiple categories. A provider who writes high volumes of opioids AND
          benzodiazepines AND gabapentin is creating compounded risk for their patients.
        </p>

        <h3>Providers with Multiple Risk Flags</h3>
        <p>
          Our risk scoring system flags providers based on individual risk factors. Those with flags across multiple
          controlled substance categories warrant the closest scrutiny:
        </p>

        {multiFlagProviders.length > 0 && (
          <div className="not-prose overflow-x-auto my-6">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-red-50">
                  <th className="px-3 py-2 text-left font-semibold text-red-900">Provider</th>
                  <th className="px-3 py-2 text-left font-semibold text-red-900">Specialty</th>
                  <th className="px-3 py-2 text-left font-semibold text-red-900">Location</th>
                  <th className="px-3 py-2 text-right font-semibold text-red-900">Risk Score</th>
                  <th className="px-3 py-2 text-left font-semibold text-red-900">Risk Flags</th>
                </tr>
              </thead>
              <tbody>
                {multiFlagProviders.map((p, i) => (
                  <tr key={p.npi} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2">
                      <Link href={`/providers/${p.npi}`} className="font-medium text-[#1e40af] hover:underline">{p.name}</Link>
                    </td>
                    <td className="px-3 py-2">{p.specialty}</td>
                    <td className="px-3 py-2">{p.city}, {p.state}</td>
                    <td className="px-3 py-2 text-right font-bold text-red-700">{p.riskScore}/100</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {p.riskFlags.map(f => (
                          <span key={f} className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-xs">{f}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h2 className="font-[family-name:var(--font-heading)]">Specialty Patterns in Controlled Substance Prescribing</h2>
        <p>
          Different specialties have vastly different relationships with controlled substances. Pain Management
          and Anesthesiology top the opioid rate charts by design — but when Family Practice or Internal Medicine
          providers match those rates, it&apos;s a red flag:
        </p>

        <div className="not-prose overflow-x-auto my-6">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-2 text-left font-semibold text-blue-900">Specialty</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900">Providers</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900">Opioid Rate</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900">Flagged Count</th>
              </tr>
            </thead>
            <tbody>
              {topOpioidSpecialties.map((s, i) => {
                const flagged = opioidSpecialtyRanking.find(r => r.specialty === s.specialty)
                return (
                  <tr key={s.specialty} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 font-medium">{s.specialty}</td>
                    <td className="px-4 py-2 text-right">{fmt(s.providers)}</td>
                    <td className="px-4 py-2 text-right font-medium text-red-700">{(s.opioidRate ?? 0).toFixed(1)}%</td>
                    <td className="px-4 py-2 text-right">{flagged ? fmt(flagged.count) : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Geographic Patterns</h2>
        <p>
          Controlled substance prescribing follows clear geographic patterns that reflect a combination of cultural
          factors, regulatory environments, provider density, and patient demographics:
        </p>

        <div className="not-prose overflow-x-auto my-6">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-2 text-left font-semibold text-blue-900">State</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900">Opioid Rate</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900">Providers</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {topOpioidStates.map((s, i) => (
                <tr key={s.state} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 font-medium">{s.state}</td>
                  <td className="px-4 py-2 text-right font-bold text-red-700">{(s.opioidRate ?? 0).toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right">{fmt(s.providers)}</td>
                  <td className="px-4 py-2 text-right">{fmtMoney(s.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">The Regulatory Patchwork</h2>
        <p>
          Controlled substance regulation in the US is a complex patchwork of federal and state rules that creates
          gaps exploitable by bad actors:
        </p>

        <div className="not-prose space-y-4 my-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-1">Federal (DEA) Scheduling</h4>
            <p className="text-sm text-gray-600">
              The Controlled Substances Act classifies drugs into Schedules I-V based on abuse potential and medical
              use. Schedule II (opioids, stimulants) requires new prescriptions each fill; Schedule IV (benzodiazepines)
              allows refills. Gabapentin is not federally scheduled.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-1">State Variations</h4>
            <p className="text-sm text-gray-600">
              States can impose stricter rules: some require PDMP checks before every controlled substance prescription,
              some limit initial opioid prescriptions to 3-7 days, and 8 states have scheduled gabapentin. These
              variations create &quot;arbitrage&quot; opportunities where patients seek prescriptions in less restrictive states.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-1">PDMP (Prescription Drug Monitoring Programs)</h4>
            <p className="text-sm text-gray-600">
              All 50 states have PDMPs, but interstate data sharing remains inconsistent. Only about 50% of states
              participate in the PMP InterConnect system for real-time interstate data. This means a patient getting
              benzodiazepines in Ohio and opioids in Kentucky may not trigger any alert.
            </p>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">What the Data Can&apos;t Tell Us</h2>
        <p>
          It&apos;s important to acknowledge the limitations of Medicare Part D claims data for controlled substance
          analysis:
        </p>
        <ul>
          <li><strong>No diagnosis codes</strong> — we can&apos;t see <em>why</em> a drug was prescribed</li>
          <li><strong>No benzodiazepine-specific rates</strong> — our data tracks opioid rates but not benzo rates at the provider level</li>
          <li><strong>No gabapentin abuse indicators</strong> — gabapentin claims look identical whether used for neuropathy or misused for recreation</li>
          <li><strong>No patient-level tracking</strong> — we see provider-level aggregates, not individual patient journeys across multiple providers</li>
          <li><strong>No illicit use</strong> — Part D data captures only legitimate prescriptions, not the downstream diversion that fuels abuse</li>
        </ul>

        <h2 className="font-[family-name:var(--font-heading)]">Recommendations</h2>
        <div className="not-prose bg-blue-50 border border-blue-200 rounded-xl p-6 my-6">
          <h4 className="font-bold text-[#1e40af] mb-3">Policy Changes Needed</h4>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">1.</span>
              <div>
                <strong>Federal gabapentin scheduling</strong> — Gabapentin should be classified as Schedule V
                nationally, not left to state-by-state patchwork.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">2.</span>
              <div>
                <strong>Mandatory multi-substance PDMP alerts</strong> — PDMPs should flag when a patient is
                receiving controlled substances from multiple categories (opioid + benzo + gabapentin), not just
                individual drug alerts.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">3.</span>
              <div>
                <strong>Universal interstate PDMP participation</strong> — All 50 states should participate in
                real-time interstate data sharing.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">4.</span>
              <div>
                <strong>Expanded Part D data</strong> — CMS should add benzodiazepine rates, stimulant rates,
                and gabapentin prescribing metrics to the public use file alongside opioid rates.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">5.</span>
              <div>
                <strong>Multi-category risk scoring</strong> — Oversight programs should shift from single-substance
                monitoring to cross-category risk assessment.
              </div>
            </div>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">The Bigger Picture</h2>
        <p>
          The controlled substance prescribing landscape is more complex than any single drug category can capture.
          While opioids get the attention, benzodiazepines, stimulants, and gabapentin each present their own
          risk profiles — and the real danger often comes from their intersection.
        </p>
        <p>
          Among the {fmt(stats.providers)} prescribers in our dataset, the vast majority prescribe controlled
          substances responsibly. But the minority who prescribe across multiple categories at high volumes —
          especially those flagged by our risk scoring system — represent a concentrated source of patient harm
          and potential diversion that deserves focused regulatory attention.
        </p>
        <p>
          The pipeline of controlled substances flowing through Medicare Part D is massive, geographically
          concentrated, and only partially visible through claims data. Improving that visibility — through
          better data, better interstate coordination, and better analytical tools — is essential for reducing
          harm while preserving access for patients who genuinely need these medications.
        </p>

        <div className="not-prose bg-gray-50 border border-gray-200 rounded-xl p-6 my-8">
          <h4 className="font-bold text-gray-900 mb-2">📚 Data Sources & Methodology</h4>
          <p className="text-sm text-gray-600">
            Provider-level data from CMS Medicare Part D Prescriber Public Use File (2023). Opioid prescribing rates
            are CMS-calculated. Risk flags are from our multi-factor scoring model. Overdose statistics from CDC WONDER.
            Gabapentin misuse data from the DEA and peer-reviewed literature. PDMP participation data from the
            National Alliance for Model State Drug Laws (NAMSDL).
          </p>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Explore Related Analysis</h2>
        <ul>
          <li><Link href="/analysis/opioid-crisis" className="text-[#1e40af] hover:underline">The Medicare Opioid Crisis in Numbers</Link></li>
          <li><Link href="/analysis/pill-mills" className="text-[#1e40af] hover:underline">Anatomy of a Pill Mill</Link></li>
          <li><Link href="/analysis/opioid-hotspots" className="text-[#1e40af] hover:underline">Geographic Hotspots for Opioid Prescribing</Link></li>
          <li><Link href="/analysis/telehealth-prescribing" className="text-[#1e40af] hover:underline">How Telehealth Changed Prescribing Patterns</Link></li>
          <li><Link href="/analysis/polypharmacy" className="text-[#1e40af] hover:underline">The Polypharmacy Problem</Link></li>
        </ul>
      </div>

      <RelatedAnalysis current="/analysis/controlled-substance-pipeline" />
    </div>
  )
}
