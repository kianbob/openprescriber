import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'
import RelatedAnalysis from '@/components/RelatedAnalysis'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import { stateName } from '@/lib/state-names'

export const metadata: Metadata = {
  title: 'Rural America\'s Prescribing Problem: Why Small-Town Medicare Costs More',
  description: 'Rural providers have higher opioid prescribing rates, fewer generics, and higher per-patient costs than urban peers. What the Medicare data reveals.',
  openGraph: {
    title: "Rural America's Prescribing Problem: Why Small-Town Medicare Costs More",
    description: 'Rural providers have higher opioid prescribing rates, fewer generics, and higher per-patient costs than urban peers. What the Medicare data reveals.',
    url: 'https://www.openprescriber.org/analysis/rural-prescribing',
    type: 'article',
  },
  alternates: { canonical: 'https://www.openprescriber.org/analysis/rural-prescribing' },
}

export default function RuralPrescribingArticle() {
  const states = loadData('states.json') as { state: string; providers: number; cost: number; avgOpioidRate: number; costPerBene: number; benes: number }[]
  const stats = loadData('stats.json')
  const REAL = new Set('AL,AK,AZ,AR,CA,CO,CT,DE,DC,FL,GA,HI,ID,IL,IN,IA,KS,KY,LA,ME,MD,MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ,NM,NY,NC,ND,OH,OK,OR,PA,RI,SC,SD,TN,TX,UT,VT,VA,WA,WV,WI,WY'.split(','))

  // Rural-heavy states (high opioid, lower provider count per capita)
  const ruralStates = states.filter(s => REAL.has(s.state)).sort((a, b) => b.avgOpioidRate - a.avgOpioidRate)
  const top10Opioid = ruralStates.slice(0, 10)
  const bottom10Opioid = ruralStates.slice(-10).reverse()

  // Small states (fewer providers = more rural)
  const smallStates = states.filter(s => REAL.has(s.state) && s.providers < 10000).sort((a, b) => b.avgOpioidRate - a.avgOpioidRate)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema
        title="Rural America's Prescribing Problem"
        description="Why small-town Medicare costs more"
        slug="rural-prescribing"
        date="2026-02-28"
      />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Rural Prescribing' }]} />

      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Rural America&apos;s Prescribing Problem</h1>
      <p className="text-sm text-gray-500 mb-4">Analysis · February 2026</p>
      <ShareButtons title="Rural America's Prescribing Problem" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg">
          Medicare Part D prescribing looks very different depending on where you live. States with large rural populations consistently show higher opioid prescribing rates, more brand-name drug use, and higher per-patient costs. The urban-rural divide in prescribing isn&apos;t just a statistical curiosity — it has real consequences for patient outcomes and taxpayer costs.
        </p>

        <h2>The Opioid Geography</h2>
        <p>
          The states with the highest average opioid prescribing rates are disproportionately rural:
        </p>

        <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
          <div>
            <h3 className="font-bold text-sm text-red-700 mb-2">🔴 Highest Opioid Rates</h3>
            <div className="bg-white rounded-xl border overflow-hidden">
              {top10Opioid.map((s, i) => (
                <div key={s.state} className="flex items-center justify-between px-4 py-2 border-b last:border-0 hover:bg-red-50/50">
                  <Link href={`/states/${s.state.toLowerCase()}`} className="text-sm text-primary hover:underline">{i + 1}. {stateName(s.state)}</Link>
                  <span className="text-sm font-mono text-red-600 font-bold">{(s.avgOpioidRate ?? 0).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm text-green-700 mb-2">🟢 Lowest Opioid Rates</h3>
            <div className="bg-white rounded-xl border overflow-hidden">
              {bottom10Opioid.map((s, i) => (
                <div key={s.state} className="flex items-center justify-between px-4 py-2 border-b last:border-0 hover:bg-green-50/50">
                  <Link href={`/states/${s.state.toLowerCase()}`} className="text-sm text-primary hover:underline">{ruralStates.length - 9 + i}. {stateName(s.state)}</Link>
                  <span className="text-sm font-mono text-green-600 font-bold">{(s.avgOpioidRate ?? 0).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2>Why Rural Prescribing Differs</h2>
        <ol>
          <li><strong>Fewer specialists, more generalists</strong> — Rural areas rely heavily on Nurse Practitioners and Family Practice providers. These generalists handle a wider range of conditions, including chronic pain, leading to higher opioid prescribing rates.</li>
          <li><strong>Occupational injuries</strong> — Rural economies are dominated by farming, mining, logging, and manufacturing — physically demanding jobs with high injury rates that generate legitimate pain management needs.</li>
          <li><strong>Pharmacy access</strong> — Rural patients often have fewer pharmacy options, potentially limiting access to newer (and sometimes cheaper) medications.</li>
          <li><strong>Older populations</strong> — Rural America skews older. Medicare Part D beneficiaries in rural areas tend to have more chronic conditions requiring more medications.</li>
          <li><strong>Historical prescribing culture</strong> — Some regions developed high-prescribing patterns during the late 1990s/early 2000s opioid expansion and haven&apos;t fully corrected.</li>
        </ol>

        <h2>The Cost Implications</h2>
        <p>
          Higher opioid rates don&apos;t just affect patient health — they affect taxpayer costs. States with the highest opioid prescribing rates also tend to have higher per-patient drug costs, partly because opioid-heavy practices often coincide with:
        </p>
        <ul>
          <li>More brand-name prescribing (less access to generic alternatives)</li>
          <li>Higher emergency utilization from drug interactions and overdoses</li>
          <li>Longer treatment durations and dose escalation</li>
        </ul>

        <h2>Small States, Big Problems</h2>
        <p>
          States with fewer than 10,000 Medicare Part D prescribers — typically smaller, more rural states — tell a compelling story. Of the {smallStates.length} states in this category, the average opioid prescribing rate is {(smallStates.reduce((sum, s) => sum + (s.avgOpioidRate ?? 0), 0) / smallStates.length).toFixed(1)}%, compared to the national average of {(stats.avgOpioidRate ?? 0).toFixed(1)}%.
        </p>

        <div className="not-prose my-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h3 className="font-bold text-amber-900 mb-3">Small-State Prescribing ({smallStates.length} states with &lt;10K prescribers)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-amber-700">{smallStates.length}</p>
                <p className="text-xs text-amber-800">States</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">{fmt(smallStates.reduce((s, st) => s + st.providers, 0))}</p>
                <p className="text-xs text-amber-800">Prescribers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{(smallStates.reduce((sum, s) => sum + (s.avgOpioidRate ?? 0), 0) / smallStates.length).toFixed(1)}%</p>
                <p className="text-xs text-amber-800">Avg Opioid Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">{fmtMoney(smallStates.reduce((s, st) => s + st.cost, 0))}</p>
                <p className="text-xs text-amber-800">Total Drug Cost</p>
              </div>
            </div>
          </div>
        </div>

        <h2>The Specialist Desert</h2>
        <p>
          Rural areas face a critical shortage of specialists — pain management doctors, addiction medicine specialists, and psychiatrists are concentrated in urban centers. When a patient in rural West Virginia needs chronic pain treatment, they&apos;re far more likely to see a Family Practice provider than a dedicated pain management specialist.
        </p>
        <p>
          This matters because our <Link href="/peer-comparison">peer comparison data</Link> shows that generalists who manage pain have different prescribing patterns than dedicated pain specialists. A Family Practice doctor with a 15% opioid rate stands out among their peers, but a Pain Management specialist at 45% is within normal range for their specialty.
        </p>
        <p>
          The result: rural providers face pressure to treat conditions they weren&apos;t specifically trained for, with fewer consultation options and less access to alternative treatments like physical therapy or cognitive behavioral therapy.
        </p>

        <h2>Five-Year Trends: Is It Getting Better?</h2>
        <p>
          Nationally, opioid prescribing has been declining since 2019, driven by CDC guidelines, state prescription monitoring programs (PDMPs), and increased awareness. But the rural-urban gap persists. States that started with the highest rates have reduced prescribing, but they started from such elevated baselines that they still lead nationally.
        </p>
        <p>
          Colorado consistently shows among the highest state-level opioid rates — but this is partly a data artifact. Colorado has aggressive prescription monitoring, which means more opioid prescriptions are captured in the data rather than diverted off-record. States with less monitoring may undercount.
        </p>

        <h2>Policy Implications</h2>
        <p>
          The rural prescribing gap isn&apos;t primarily a fraud problem — it&apos;s a healthcare access problem wearing a prescribing costume. Addressing it requires:
        </p>
        <ul>
          <li><strong>Telehealth expansion</strong> — Our <Link href="/analysis/telehealth-prescribing">telehealth analysis</Link> shows that remote consultations can connect rural patients with specialists without requiring travel</li>
          <li><strong>Pain management alternatives</strong> — Physical therapy, acupuncture, and non-opioid medications need to be as accessible in rural Appalachia as in suburban Virginia</li>
          <li><strong>Provider education</strong> — Continuing education requirements should address rural-specific prescribing challenges</li>
          <li><strong>Data transparency</strong> — Tools like OpenPrescriber make geographic prescribing patterns visible, enabling targeted interventions rather than one-size-fits-all policies</li>
        </ul>

        <h2>What the Data Can&apos;t Tell Us</h2>
        <p>
          Medicare Part D data captures prescribing patterns but not patient outcomes. A high opioid rate might reflect appropriate care for a patient population with high injury rates — or it might reflect over-prescribing. Without linking to patient outcomes data (emergency visits, overdose rates, mortality), we can&apos;t definitively distinguish between the two.
        </p>
        <p>
          What we can say is that the <strong>geographic variation is persistent and significant</strong> — the same states led in opioid prescribing five years ago and still lead today. Whatever is driving these patterns isn&apos;t going away on its own.
        </p>

        <div className="not-prose mt-8 bg-gray-50 rounded-xl p-5 text-sm text-gray-600">
          <p><strong>Data source:</strong> CMS Medicare Part D Prescriber Public Use File, 2023. Opioid rates calculated from DEA-scheduled drug claims. Rural/urban classification based on state-level provider counts as a proxy — individual RUCA codes would provide more granular classification. <Link href="/methodology" className="text-primary hover:underline">Full methodology</Link></p>
        </div>
      </div>

      <RelatedAnalysis current="/analysis/rural-prescribing" />
    </div>
  )
}
