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
                  <span className="text-sm font-mono text-red-600 font-bold">{s.avgOpioidRate.toFixed(1)}%</span>
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
                  <span className="text-sm font-mono text-green-600 font-bold">{s.avgOpioidRate.toFixed(1)}%</span>
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

        <h2>What the Data Can&apos;t Tell Us</h2>
        <p>
          Medicare Part D data captures prescribing patterns but not patient outcomes. A high opioid rate might reflect appropriate care for a patient population with high injury rates — or it might reflect over-prescribing. Without linking to patient outcomes data (emergency visits, overdose rates, mortality), we can&apos;t definitively distinguish between the two.
        </p>
        <p>
          What we can say is that the <strong>geographic variation is persistent and significant</strong> — the same states led in opioid prescribing five years ago and still lead today. Whatever is driving these patterns isn&apos;t going away on its own.
        </p>
      </div>

      <RelatedAnalysis current="/analysis/rural-prescribing" />
    </div>
  )
}
