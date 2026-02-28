import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'
import RelatedAnalysis from '@/components/RelatedAnalysis'

export const metadata: Metadata = {
  title: 'Geographic Disparities in Medicare Prescribing',
  description: 'State-level analysis reveals dramatic geographic variation in Medicare drug spending, opioid rates, and prescribing patterns across the United States.',
  alternates: { canonical: 'https://www.openprescriber.org/analysis/geographic-disparities' },
}

export default function GeographicDisparitiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema
        title="Geographic Disparities in Medicare Prescribing"
        description="State-level analysis reveals dramatic geographic variation in Medicare prescribing."
        slug="geographic-disparities"
        date="2026-02-27"
      />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Geographic Disparities' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">Geographic Disparities in Medicare Prescribing</h1>
      <ShareButtons title="Geographic Disparities in Medicare Prescribing" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          Where a Medicare beneficiary lives dramatically affects what drugs they&apos;re prescribed, how much those drugs cost, and whether their provider reaches for an opioid. Our analysis of state-level prescribing data reveals persistent geographic patterns that defy simple explanation.
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">3x</p>
            <p className="text-xs text-blue-600">Cost Variation by State</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">4x</p>
            <p className="text-xs text-red-600">Opioid Rate Variation</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">50 States</p>
            <p className="text-xs text-blue-600">+ DC &amp; Territories</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">$275.6B</p>
            <p className="text-xs text-blue-600">Total Distributed</p>
          </div>
        </div>

        <h2>The Spending Map</h2>
        <p>
          Per-capita Medicare drug spending varies by as much as three-fold across states. States with older populations, higher chronic disease burdens, and more providers tend to show higher per-beneficiary costs. But demographics alone don&apos;t explain the variation — practice patterns, local formulary preferences, and the availability of specialists all play significant roles.
        </p>
        <p>
          States in the Southeast and Appalachian regions consistently rank among the highest in per-beneficiary spending. West Virginia, Kentucky, and Mississippi show some of the highest average drug costs per provider, driven by high rates of chronic conditions like diabetes, heart disease, and chronic pain.
        </p>
        <p>
          In contrast, states like Hawaii, Minnesota, and Vermont tend to have lower per-beneficiary drug costs. These states generally have healthier populations, stronger managed care penetration, and practice cultures that emphasize conservative prescribing.
        </p>

        <h2>The Opioid Geography</h2>
        <p>
          <Link href="/analysis/opioid-crisis" className="text-primary hover:underline">Opioid prescribing rates</Link> show some of the most dramatic geographic variation in the entire dataset. Alabama, Tennessee, and Mississippi consistently show the highest average opioid prescribing rates, with some states averaging more than double the national mean.
        </p>
        <p>
          The Appalachian corridor — stretching from West Virginia through eastern Kentucky, Tennessee, and into northern Alabama — represents the epicenter of high-rate opioid prescribing. This aligns with decades of research on the opioid epidemic&apos;s geographic concentration, but the persistence of these patterns even after years of interventions is striking.
        </p>
        <p>
          Western states like Oregon, Washington, and California tend to show lower opioid rates, though they face their own challenges with fentanyl and illicit opioid use that don&apos;t appear in prescription data.
        </p>

        <h2>Rural vs. Urban Divide</h2>
        <p>
          One of the most significant and least-discussed disparities is between rural and urban prescribing patterns. Rural providers tend to prescribe at higher per-patient costs, use more brand-name medications, and have higher opioid rates than their urban counterparts.
        </p>
        <p>
          Several factors contribute to this divide. Rural areas often have fewer pharmacies, limiting competition and generic availability. Patients may see fewer specialists, leading primary care providers to manage complex conditions with medications they might otherwise defer to a specialist. And rural populations tend to be older and sicker, with higher rates of the chronic conditions that drive drug spending.
        </p>
        <p>
          Access to pain management specialists is particularly scarce in rural areas. When the nearest pain clinic is two hours away, primary care providers often become the de facto pain managers — leading to higher opioid prescribing rates not because of poor judgment, but because of limited alternatives for patients in chronic pain.
        </p>

        <h2>State-Level Policy Effects</h2>
        <p>
          States that implemented prescription drug monitoring programs (PDMPs) early tend to show lower opioid rates in recent data, though causation is difficult to establish. States with more aggressive Medicaid expansion may also show different Medicare patterns, as dual-eligible patients shift between programs.
        </p>
        <p>
          Interestingly, states with higher concentrations of academic medical centers don&apos;t always show lower costs. While teaching hospitals may practice more evidence-based prescribing, they also have access to cutting-edge (and expensive) therapies that community hospitals might not use.
        </p>

        <h2>The Cost of Geography</h2>
        <p>
          If every state matched the per-beneficiary drug spending of the lowest-cost quintile, Medicare could save tens of billions annually. Of course, this oversimplifies — population health differences are real, and you can&apos;t just transplant Minnesota&apos;s prescribing patterns into Mississippi without addressing underlying health disparities.
        </p>
        <p>
          But the magnitude of geographic variation suggests that at least some of the difference reflects practice pattern variation rather than clinical necessity. Two providers treating identical patients in different states may prescribe very different medications at very different costs — not because of patient needs, but because of local norms and habits.
        </p>

        <h2>Exploring the Data</h2>
        <p>
          We&apos;ve built state-level profiles that let you explore these patterns in detail. Each state page shows provider counts, average costs, opioid metrics, top prescribers, and specialty breakdowns. Compare your state against national benchmarks to see where it stands.
        </p>
        <p>
          The geographic lens is also critical for understanding <Link href="/analysis/fraud-risk-methodology" className="text-primary hover:underline">prescribing risk scores</Link>. Our model adjusts for state-level baselines so that a provider in a high-prescribing state isn&apos;t automatically flagged simply for matching local norms — but extreme outliers within any state still surface.
        </p>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-medium">Related Analysis</p>
          <div className="flex flex-wrap gap-3 mt-1">
            <Link href="/states" className="text-sm text-primary hover:underline">🗺️ State Profiles</Link>
            <Link href="/taxpayer-cost" className="text-sm text-primary hover:underline">💰 Taxpayer Cost</Link>
            <Link href="/analysis/opioid-hotspots" className="text-sm text-primary hover:underline">📍 Opioid Hotspots</Link>
          </div>
        </div>

        <div className="mt-8 text-xs text-gray-400 border-t pt-4">
          <p>Data source: CMS Medicare Part D Prescribers dataset (2023). State-level aggregations computed from individual provider records. Geographic assignment based on provider practice address. This analysis is for informational purposes only and does not constitute medical or legal advice.</p>
        </div>
      <RelatedAnalysis current={"/analysis/geographic-disparities"} />
      </div>
    </div>
  )
}
