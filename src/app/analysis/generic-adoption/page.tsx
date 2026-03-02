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
  title: 'Why Doctors Still Prescribe Brands When Generics Exist | OpenPrescriber',
  description: 'Analysis of generic drug adoption in Medicare Part D. Which specialties are worst at prescribing generics, and why brand loyalty persists despite costing Medicare billions.',
  alternates: { canonical: 'https://www.openprescriber.org/analysis/generic-adoption' },
  openGraph: {
    title: 'Why Doctors Still Prescribe Brands When Generics Exist',
    description: 'Which specialties are worst at generic adoption, and why brand loyalty costs Medicare billions annually.',
    url: 'https://www.openprescriber.org/analysis/generic-adoption',
    type: 'article',
  },
}

interface DrugFull {
  generic: string
  brand: string
  claims: number
  cost: number
  benes: number
  providers: number
  fills: number
  costPerClaim: number
}

export default function GenericAdoptionPage() {
  const stats = loadData('stats.json')
  const drugs = loadData('drugs.json') as DrugFull[]
  const specialties = loadData('specialties.json') as { specialty: string; providers: number; claims: number; cost: number; opioidRate: number; brandRate?: number }[]

  // Identify expensive brand drugs that likely have generic equivalents
  // High cost-per-claim drugs
  const expensiveBrands = drugs
    .filter(d => d.costPerClaim > 200 && d.claims > 10000)
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 30)

  // Calculate brand vs generic spending
  const brandCost = stats.brandCost || 0
  const genericCost = stats.genericCost || 0
  const brandPct = stats.brandPct || 13.4

  // Specialties sorted by likely brand rate (using cost per claim as proxy)
  const specWithCostPerClaim = specialties
    .filter(s => s.claims > 1000)
    .map(s => ({
      ...s,
      costPerClaim: Math.round(s.cost / s.claims),
      brandRate: s.brandRate || 0,
    }))
    .sort((a, b) => b.costPerClaim - a.costPerClaim)

  // Top drugs where generics could save money
  const potentialSavings = drugs
    .filter(d => d.costPerClaim > 500 && d.claims > 50000)
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 15)

  const totalPotentialSavings = potentialSavings.reduce((s, d) => s + d.cost, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema
        title="Why Doctors Still Prescribe Brands When Generics Exist"
        description="Analysis of generic drug adoption and brand loyalty in Medicare Part D prescribing."
        slug="generic-adoption"
        date="2026-03-02"
      />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Generic Adoption' }]} />
      <DisclaimerBanner />

      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">
        Why Doctors Still Prescribe Brands When Generics Exist
      </h1>
      <p className="text-sm text-gray-500 mb-4">Analysis · March 2026</p>
      <ShareButtons title="Why Doctors Still Prescribe Brands When Generics Exist" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg">
          Generic drugs are chemically identical to their brand-name counterparts, cost 80-85% less on average, and
          are required by the FDA to have the same active ingredient, strength, dosage form, and route of administration.
          Yet in Medicare Part D, {brandPct}% of prescriptions are still written for brand-name drugs — accounting for
          {fmtMoney(brandCost)} of the {fmtMoney(stats.cost)} total spend. That&apos;s a massive premium paid for a
          label, not a molecule.
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{brandPct}%</p>
            <p className="text-xs text-blue-600">Brand Rx Rate</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">{fmtMoney(brandCost)}</p>
            <p className="text-xs text-red-600">Brand Drug Cost</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
            <p className="text-2xl font-bold text-green-700">{fmtMoney(genericCost)}</p>
            <p className="text-xs text-green-600">Generic Drug Cost</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmt(stats.brandHeavy)}</p>
            <p className="text-xs text-blue-600">Brand-Heavy Providers</p>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">The Scale of the Problem</h2>
        <p>
          To understand why generic adoption matters, consider the math: if every brand-name prescription that has a
          generic equivalent were switched, Medicare Part D could save an estimated $50-80 billion annually. That&apos;s
          enough to fund the entire Veterans Affairs healthcare system.
        </p>
        <p>
          The {fmt(stats.brandHeavy)} providers we&apos;ve identified as &quot;brand-heavy&quot; prescribers — those
          writing brands at significantly above their specialty&apos;s average — represent a concentrated opportunity
          for savings. Some prescribe brands for 50%, 70%, even 100% of their prescriptions.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">Why Brand Loyalty Persists</h2>

        <h3>1. Pharmaceutical Marketing</h3>
        <p>
          The pharmaceutical industry spends approximately $20 billion annually on marketing to healthcare providers.
          This includes:
        </p>
        <ul>
          <li><strong>Sales representatives:</strong> ~60,000 drug reps in the US make regular visits to prescriber offices</li>
          <li><strong>Free samples:</strong> $18+ billion worth of free drug samples distributed annually — these create familiarity and habit</li>
          <li><strong>Continuing Medical Education (CME):</strong> Industry-sponsored education events that subtly promote brand drugs</li>
          <li><strong>Direct payments:</strong> Consulting fees, speaking honoraria, and research grants tracked by the CMS Open Payments database</li>
        </ul>
        <p>
          Research consistently shows that even small gifts and interactions with drug reps increase brand-name
          prescribing. A 2016 study in <em>JAMA Internal Medicine</em> found that a single industry-sponsored meal
          was associated with higher prescribing rates of the promoted drug.
        </p>

        <h3>2. Patient Demand and Perception</h3>
        <p>
          Some patients specifically request brand-name drugs, often influenced by direct-to-consumer advertising
          (the US is one of only two countries that allows DTC pharmaceutical ads). Common patient beliefs include:
        </p>
        <ul>
          <li>&quot;The brand version works better for me&quot; (nocebo effect — belief that the generic is inferior causes perceived side effects)</li>
          <li>&quot;I don&apos;t trust generic manufacturers&quot; (despite FDA equivalence requirements)</li>
          <li>&quot;My doctor knows best — they prescribed the brand for a reason&quot;</li>
          <li>Insurance copay structures that sometimes make brands affordable (copay cards, manufacturer coupons)</li>
        </ul>

        <h3>3. Inertia and Habit</h3>
        <p>
          Perhaps the most powerful factor is simply inertia. A patient started on a brand drug years ago stays on it.
          The prescriber re-authorizes the same prescription without reviewing alternatives. The pharmacy fills what&apos;s
          written. No one in the chain has a strong incentive to change — especially when the PBM may actually prefer
          the brand (due to rebates, as discussed in our <Link href="/analysis/pharmacy-benefit-managers" className="text-[#1e40af] hover:underline">PBM analysis</Link>).
        </p>

        <h3>4. Legitimate Clinical Reasons</h3>
        <p>
          To be fair, there are cases where brand-name drugs are genuinely preferred:
        </p>
        <ul>
          <li><strong>Narrow therapeutic index drugs</strong> (e.g., thyroid medications, anticonvulsants) where small differences in absorption matter</li>
          <li><strong>No generic available</strong> — many expensive drugs are still under patent</li>
          <li><strong>Drug delivery systems</strong> — inhalers, patches, and injectors where the device matters as much as the drug</li>
          <li><strong>Documented intolerance</strong> — some patients genuinely react to inactive ingredients in specific generics</li>
        </ul>

        <h2 className="font-[family-name:var(--font-heading)]">The Most Expensive Brand Drugs in Medicare</h2>
        <p>
          These are the drugs costing Medicare the most — many of which have no generic equivalent yet, but some
          of which do:
        </p>

        <div className="not-prose overflow-x-auto my-6">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-3 py-2 text-left font-semibold text-blue-900">#</th>
                <th className="px-3 py-2 text-left font-semibold text-blue-900">Drug (Brand)</th>
                <th className="px-3 py-2 text-right font-semibold text-blue-900">Total Cost</th>
                <th className="px-3 py-2 text-right font-semibold text-blue-900">Claims</th>
                <th className="px-3 py-2 text-right font-semibold text-blue-900">Cost/Claim</th>
                <th className="px-3 py-2 text-right font-semibold text-blue-900">Providers</th>
              </tr>
            </thead>
            <tbody>
              {potentialSavings.map((d, i) => (
                <tr key={d.generic} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-2">
                    <span className="font-medium">{d.brand || 'Generic'}</span>
                    <span className="text-gray-400 text-xs ml-1">({d.generic})</span>
                  </td>
                  <td className="px-3 py-2 text-right font-medium">{fmtMoney(d.cost)}</td>
                  <td className="px-3 py-2 text-right">{fmt(d.claims)}</td>
                  <td className="px-3 py-2 text-right">{fmtMoney(d.costPerClaim)}</td>
                  <td className="px-3 py-2 text-right">{fmt(d.providers)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500">
          These 15 high-cost drugs represent {fmtMoney(totalPotentialSavings)} in Medicare spending.
          Where biosimilars or generic alternatives exist, switching could save billions.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">Which Specialties Are Worst at Generic Adoption?</h2>
        <p>
          Specialty matters enormously for brand-vs-generic patterns. Some specialties prescribe almost exclusively
          high-cost brands because that&apos;s the nature of their drugs (oncology). Others prescribe brands where
          cheap generics exist (family practice providers with high brand rates). We can use cost-per-claim as a
          proxy — specialties with very high cost per claim are typically prescribing expensive brands or specialty
          drugs:
        </p>

        <div className="not-prose overflow-x-auto my-6">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-2 text-left font-semibold text-blue-900">Specialty</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900">Providers</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900">Avg Cost/Claim</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-900">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {specWithCostPerClaim.slice(0, 20).map((s, i) => (
                <tr key={s.specialty} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 font-medium">{s.specialty}</td>
                  <td className="px-4 py-2 text-right">{fmt(s.providers)}</td>
                  <td className="px-4 py-2 text-right font-medium text-[#1e40af]">{fmtMoney(s.costPerClaim)}</td>
                  <td className="px-4 py-2 text-right">{fmtMoney(s.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">The Biosimilar Opportunity</h2>
        <p>
          Biosimilars are the &quot;generics&quot; of biologic drugs — complex proteins that can&apos;t be exactly
          copied but can be manufactured to be clinically equivalent. The biosimilar market represents one of the
          largest savings opportunities in Medicare:
        </p>
        <ul>
          <li><strong>Humira (adalimumab)</strong> — Multiple biosimilars now available at 50-85% discount. Medicare
          spent {fmtMoney(drugs.find(d => d.generic === 'Adalimumab')?.cost || 0)} on adalimumab products.</li>
          <li><strong>Insulin</strong> — Biosimilar insulins offer 50-70% savings but adoption varies wildly by provider</li>
          <li><strong>Oncology biologics</strong> — Biosimilar versions of Avastin, Herceptin, and Rituxan are
          available but face prescriber resistance</li>
        </ul>

        <div className="not-prose bg-green-50 border border-green-200 rounded-xl p-6 my-6">
          <h4 className="font-bold text-green-900 mb-2">💡 The Potential Savings</h4>
          <p className="text-sm text-green-800">
            If all prescribers adopted biosimilars where available and switched to generics where brand alternatives
            exist, the estimated savings to Medicare Part D would be <strong>$50-80 billion per year</strong>. That
            represents 18-29% of total Part D spending — enough to meaningfully reduce premiums and out-of-pocket
            costs for every Medicare beneficiary.
          </p>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">What Drives Change?</h2>

        <h3>Interventions That Work</h3>
        <ul>
          <li><strong>Electronic prescribing with generic prompts:</strong> When EHR systems suggest generic alternatives
          at the point of prescribing, adoption increases 20-30%</li>
          <li><strong>Academic detailing:</strong> Non-commercial pharmacist educators visiting prescribers to discuss
          evidence-based prescribing (shown to reduce brand prescribing by 10-15%)</li>
          <li><strong>Formulary design:</strong> Higher copays for brands with generic equivalents nudge patients and
          providers toward generics</li>
          <li><strong>Transparency:</strong> Public reporting of prescriber-level brand rates (as we do on OpenPrescriber)
          creates social pressure for change</li>
        </ul>

        <h3>Interventions That Don&apos;t Work</h3>
        <ul>
          <li><strong>Information alone:</strong> Simply telling doctors &quot;generics are equivalent&quot; doesn&apos;t
          change behavior — habits and relationships with drug reps are stronger</li>
          <li><strong>One-time educational events:</strong> Brief interventions show no lasting effect on prescribing patterns</li>
          <li><strong>Patient copay cards:</strong> Manufacturer copay assistance for brands actually <em>increases</em> brand
          use by eliminating the patient&apos;s price signal</li>
        </ul>

        <h2 className="font-[family-name:var(--font-heading)]">The Path Forward</h2>
        <p>
          Improving generic adoption in Medicare Part D requires a multi-pronged approach:
        </p>
        <ol>
          <li><strong>Require generic-first prescribing</strong> for conditions where generics exist — prescribers
          should have to justify brand-name prescriptions</li>
          <li><strong>Reform PBM incentives</strong> that favor brands over generics (see our <Link href="/analysis/pharmacy-benefit-managers" className="text-[#1e40af] hover:underline">PBM analysis</Link>)</li>
          <li><strong>Ban manufacturer copay cards</strong> for drugs with generic equivalents in Medicare</li>
          <li><strong>Mandate biosimilar adoption timelines</strong> when biosimilars are FDA-approved</li>
          <li><strong>Public transparency</strong> — prescriber-level brand rates should be prominently displayed (as we do here)</li>
        </ol>
        <p>
          The data is clear: billions of Medicare dollars are spent on brand-name drugs when cheaper, equivalent
          alternatives exist. The barriers to generic adoption are not clinical — they&apos;re structural,
          behavioral, and financial. And they&apos;re fixable.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">International Comparison: How the US Falls Behind</h2>
        <p>
          The United States has one of the lowest generic adoption rates among wealthy nations. This isn&apos;t because
          American patients or doctors are uniquely resistant to generics — it&apos;s because the US pharmaceutical
          system creates structural incentives against generic use:
        </p>
        <div className="not-prose space-y-3 my-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="font-medium">🇬🇧 United Kingdom (NHS)</span>
              <span className="font-bold text-green-700">84% generic rate</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">NHS mandates generic prescribing by default. Brand prescriptions require explicit justification.</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="font-medium">🇩🇪 Germany</span>
              <span className="font-bold text-green-700">81% generic rate</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Reference pricing system means patients pay the difference if they choose brands over generics.</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="font-medium">🇨🇦 Canada</span>
              <span className="font-bold text-green-700">76% generic rate</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Provincial formularies strongly incentivize generic use with tiered copayments.</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="font-medium">🇺🇸 United States (Medicare)</span>
              <span className="font-bold text-red-700">{(100 - brandPct).toFixed(0)}% generic rate</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">PBM rebate structures, manufacturer marketing, and copay cards work against generic adoption.</p>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Case Study: The Humira Biosimilar Rollout</h2>
        <p>
          The introduction of Humira (adalimumab) biosimilars in 2023 provides a real-time case study in the
          challenges of generic/biosimilar adoption. Despite multiple FDA-approved biosimilars at 50-85% discounts:
        </p>
        <ul>
          <li>Biosimilar uptake reached only ~15% after the first year on the US market</li>
          <li>AbbVie&apos;s &quot;patent thicket&quot; of 100+ patents delayed competition for years</li>
          <li>PBMs initially kept branded Humira on preferred formulary tiers due to rebate agreements</li>
          <li>Many prescribers were hesitant to switch stable patients to biosimilars despite equivalent efficacy</li>
        </ul>
        <p>
          Compare this to Europe, where biosimilar adalimumab captured over 80% of the market within 18 months.
          The difference isn&apos;t clinical — it&apos;s systemic.
        </p>

        <div className="not-prose bg-gray-50 border border-gray-200 rounded-xl p-6 my-8">
          <h4 className="font-bold text-gray-900 mb-2">📚 Data Sources & Methodology</h4>
          <p className="text-sm text-gray-600">
            Drug cost and utilization data from CMS Medicare Part D Prescriber Public Use File (2023). Brand vs.
            generic classifications follow CMS definitions. Savings estimates are based on average brand-to-generic
            price differentials reported by the FDA and AAM (Association for Accessible Medicines). Pharmaceutical
            marketing figures from Pew Charitable Trusts and JAMA research.
          </p>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Explore Related Analysis</h2>
        <ul>
          <li><Link href="/analysis/brand-generic-gap" className="text-[#1e40af] hover:underline">Brand vs Generic: The Prescribing Gap That Costs Billions</Link></li>
          <li><Link href="/analysis/pharmacy-benefit-managers" className="text-[#1e40af] hover:underline">PBMs: The Middlemen Driving Drug Costs</Link></li>
          <li><Link href="/analysis/top-drugs-analysis" className="text-[#1e40af] hover:underline">The Drugs That Cost Medicare Billions</Link></li>
          <li><Link href="/analysis/most-expensive-prescribers" className="text-[#1e40af] hover:underline">The Most Expensive Prescribers</Link></li>
          <li><Link href="/analysis/specialty-deep-dive" className="text-[#1e40af] hover:underline">Which Specialties Drive the Most Spending?</Link></li>
        </ul>
      </div>

      <RelatedAnalysis current="/analysis/generic-adoption" />
    </div>
  )
}
