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
  title: 'Pharmacy Benefit Managers: The Middlemen Driving Drug Costs | OpenPrescriber',
  description: 'How PBMs like Express Scripts, CVS Caremark, and OptumRx control drug pricing through spread pricing, rebate clawbacks, and formulary manipulation — and what it costs Medicare.',
  alternates: { canonical: 'https://openprescriber.vercel.app/analysis/pharmacy-benefit-managers' },
  openGraph: {
    title: 'Pharmacy Benefit Managers: The Middlemen Driving Drug Costs',
    description: 'How PBMs control drug pricing through spread pricing, rebate clawbacks, and formulary manipulation — and what it costs Medicare.',
    url: 'https://openprescriber.vercel.app/analysis/pharmacy-benefit-managers',
    type: 'article',
  },
}

export default function PharmacyBenefitManagersPage() {
  const stats = loadData('stats.json')
  const drugs = loadData('drugs.json') as { generic: string; brand: string; claims: number; cost: number; benes: number; providers: number; costPerClaim: number }[]

  // Top drugs by cost - these are the ones PBMs profit most from
  const topDrugs = drugs.slice(0, 20)
  const totalTopCost = topDrugs.reduce((s, d) => s + d.cost, 0)

  // Brand-heavy drugs where PBMs extract the most rebates
  const brandDrugs = drugs.filter(d => d.costPerClaim > 500).slice(0, 15)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema
        title="Pharmacy Benefit Managers: The Middlemen Driving Drug Costs"
        description="How PBMs control drug pricing and what it costs Medicare Part D."
        slug="pharmacy-benefit-managers"
        date="2026-03-02"
      />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'Pharmacy Benefit Managers' }]} />
      <DisclaimerBanner />

      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">
        Pharmacy Benefit Managers: The Middlemen Driving Drug Costs
      </h1>
      <p className="text-sm text-gray-500 mb-4">Analysis · March 2026</p>
      <ShareButtons title="Pharmacy Benefit Managers: The Middlemen Driving Drug Costs" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg">
          Between the doctor who writes a prescription and the patient who picks it up, there&apos;s an industry most
          people have never heard of that controls what you pay, what drugs are available, and how much your pharmacist
          gets reimbursed. Pharmacy Benefit Managers — PBMs — process over 80% of all prescriptions in the United States.
          Three companies (Express Scripts, CVS Caremark, and OptumRx) control roughly 80% of the market. And their
          business model creates perverse incentives that may be driving up the cost of the {fmtMoney(stats.cost)} in
          Medicare Part D drug spending we analyze.
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">3</p>
            <p className="text-xs text-blue-600">PBMs Control 80% of Rx</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{fmtMoney(stats.cost)}</p>
            <p className="text-xs text-blue-600">Medicare Part D Spending</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-2xl font-bold text-red-700">$100B+</p>
            <p className="text-xs text-red-600">Est. PBM Revenue</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{stats.brandPct}%</p>
            <p className="text-xs text-blue-600">Brand Rx Rate</p>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">What PBMs Actually Do</h2>
        <p>
          PBMs were originally created to simplify prescription drug claims processing. In theory, they negotiate lower
          drug prices on behalf of health plans and employers. In practice, their business model has evolved into something
          far more complex — and far more profitable for the PBMs themselves.
        </p>

        <h3>The Big Three</h3>
        <div className="not-prose space-y-4 my-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-1">CVS Caremark</h4>
            <p className="text-sm text-gray-600">
              Owned by CVS Health, which also owns Aetna (insurance) and CVS Pharmacy (retail). This vertical integration
              means one company controls the insurance, the PBM, and the pharmacy — creating obvious conflicts of interest.
              Market share: ~33%.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-1">Express Scripts (Cigna)</h4>
            <p className="text-sm text-gray-600">
              Owned by Cigna Group. Processes over 1.4 billion prescriptions annually. Like CVS, the insurance-PBM
              integration creates a closed loop where the entity negotiating drug prices also profits from higher
              overall healthcare spending. Market share: ~24%.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-1">OptumRx (UnitedHealth)</h4>
            <p className="text-sm text-gray-600">
              Owned by UnitedHealth Group, the largest health insurer in the US. OptumRx is part of the Optum subsidiary
              that also runs medical clinics and data analytics — another vertical monopoly spanning insurance, pharmacy
              benefits, and care delivery. Market share: ~23%.
            </p>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">How PBMs Profit: The Mechanisms</h2>

        <h3>1. Spread Pricing</h3>
        <p>
          Spread pricing is arguably the most controversial PBM practice. Here&apos;s how it works: a PBM charges the
          health plan (in Medicare&apos;s case, the Part D plan sponsor) one price for a drug, then reimburses the
          pharmacy a lower price, and keeps the difference — the &quot;spread.&quot;
        </p>
        <div className="not-prose bg-gray-50 border border-gray-200 rounded-xl p-6 my-6">
          <h4 className="font-bold text-gray-900 mb-3">Example: How Spread Pricing Works</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">PBM charges Part D plan:</span>
              <span className="font-bold text-red-700">$150 per prescription</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">PBM reimburses pharmacy:</span>
              <span className="font-bold text-blue-700">$95 per prescription</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">PBM keeps (the &quot;spread&quot;):</span>
              <span className="font-bold text-green-700">$55 per prescription</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            This example is illustrative. Actual spreads vary widely by drug, ranging from a few dollars for generics
            to hundreds of dollars for specialty medications.
          </p>
        </div>

        <p>
          The Ohio Medicaid program audited its PBMs in 2018 and found spread pricing cost taxpayers $224 million in
          one year. For generic drugs — which should be cheap — PBMs charged Medicaid an average of 31% more than they
          paid pharmacies. The practice has since been banned in Ohio Medicaid but remains legal in most Medicare Part D
          contracts.
        </p>

        <h3>2. Rebate Clawbacks</h3>
        <p>
          Drug manufacturers pay PBMs rebates for favorable formulary placement — essentially paying to have their
          drug on the &quot;preferred&quot; list. These rebates can be 30-70% of the drug&apos;s list price. Here&apos;s
          the catch: PBMs often don&apos;t pass the full rebate through to the plan (and thus to Medicare/patients).
        </p>
        <p>
          A 2024 FTC report found that the Big Three PBMs retained an average of 23% of all manufacturer rebates.
          On a {fmtMoney(stats.cost)} Medicare Part D program, even a few percentage points of retained rebates
          translates to billions of dollars.
        </p>

        <h3>3. Formulary Manipulation</h3>
        <p>
          PBMs decide which drugs are on their formulary and at what &quot;tier&quot; (which determines patient copays).
          This creates a powerful incentive structure: a PBM might prefer a $500/month brand drug that offers a 60%
          rebate over a $50/month generic that offers no rebate — because the PBM makes more money on the expensive
          drug even though it costs Medicare more.
        </p>

        <h3>4. Pharmacy DIR (Direct and Indirect Remuneration) Fees</h3>
        <p>
          DIR fees are retroactive charges that PBMs impose on pharmacies after prescriptions are filled. A pharmacy
          might fill a prescription and receive $100, only to have $15-25 clawed back months later as a DIR fee.
          These fees make it nearly impossible for independent pharmacies to predict their revenue — and many have
          closed as a result.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">The PBM Impact on Medicare Part D Drugs</h2>
        <p>
          The drugs that generate the most PBM profit are typically expensive brand-name medications with high rebates.
          Here are the top 20 drugs in Medicare Part D by total cost — each one passes through the PBM system:
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
              </tr>
            </thead>
            <tbody>
              {topDrugs.map((d, i) => (
                <tr key={d.generic} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-2 font-medium">{d.brand || d.generic}</td>
                  <td className="px-3 py-2 text-right font-medium">{fmtMoney(d.cost)}</td>
                  <td className="px-3 py-2 text-right">{fmt(d.claims)}</td>
                  <td className="px-3 py-2 text-right">{fmtMoney(d.costPerClaim)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500">
          These top 20 drugs account for {fmtMoney(totalTopCost)} — roughly {((totalTopCost / stats.cost) * 100).toFixed(0)}%
          of all Medicare Part D spending. Each transaction passes through a PBM that extracts value at every step.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">The Perverse Incentive Problem</h2>
        <p>
          The fundamental issue with PBMs is structural: <strong>PBMs make more money when drugs cost more</strong>.
          Their profit comes from percentages — rebates calculated as a percentage of list price, spread pricing
          margins that increase with higher prices, and administrative fees pegged to drug costs. A PBM that
          successfully lowered overall drug prices would be reducing its own revenue.
        </p>

        <div className="not-prose bg-red-50 border border-red-200 rounded-xl p-6 my-6">
          <h4 className="font-bold text-red-900 mb-2">The Insulin Example</h4>
          <p className="text-sm text-red-800">
            Insulin costs roughly $2-$5 to manufacture. Yet list prices reached $300+ per vial — and PBMs played a
            central role. Insulin manufacturers raised list prices knowing that PBMs demanded larger rebates. PBMs
            preferred higher list prices because they received larger rebates (even if they passed some through).
            The patient — especially those in the Medicare Part D coverage gap — paid based on the inflated list
            price. The Inflation Reduction Act&apos;s $35/month insulin cap finally broke this cycle for Medicare
            patients, but the broader dynamic persists for other drugs.
          </p>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Impact on Independent Pharmacies</h2>
        <p>
          The PBM business model has been devastating for independent pharmacies. Over 10,000 independent pharmacies
          have closed since 2010, with PBM reimbursement practices cited as the leading cause. The pattern is clear:
        </p>
        <ul>
          <li>PBMs reimburse independent pharmacies at lower rates than their own affiliated pharmacies</li>
          <li>Retroactive DIR fees make revenue unpredictable and often negative on individual prescriptions</li>
          <li>Preferred pharmacy networks steer patients to PBM-owned or PBM-affiliated pharmacies</li>
          <li>Audit clawbacks — where PBMs audit pharmacy records and demand refunds — create an adversarial dynamic</li>
        </ul>
        <p>
          This matters for Medicare patients because independent pharmacies disproportionately serve rural communities
          and underserved urban neighborhoods. When these pharmacies close, patients lose access — creating prescription
          deserts that compound existing health disparities.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">What&apos;s Being Done About It</h2>

        <h3>The FTC Investigation (2024-2025)</h3>
        <p>
          The Federal Trade Commission launched a comprehensive investigation into PBM practices in 2022, culminating
          in a 2024 report that confirmed many long-suspected abuses. Key findings included:
        </p>
        <ul>
          <li>PBMs steered patients toward PBM-owned pharmacies, even when cheaper alternatives existed</li>
          <li>Rebate structures favored higher-cost drugs over clinically equivalent cheaper alternatives</li>
          <li>Pharmacy reimbursement rates were often below the pharmacy&apos;s acquisition cost</li>
          <li>The three largest PBMs had collective market power that stifled competition</li>
        </ul>

        <h3>Congressional Action</h3>
        <p>
          Multiple bills have been introduced targeting PBM practices:
        </p>
        <ul>
          <li><strong>Pharmacy Benefit Manager Transparency Act</strong> — Would require PBMs to disclose rebate amounts, spread pricing margins, and administrative fees</li>
          <li><strong>PBM Reform Act</strong> — Would ban spread pricing in Medicare and require 100% rebate passthrough</li>
          <li><strong>Delinking Act</strong> — Would decouple PBM compensation from drug prices, requiring flat-fee contracts</li>
        </ul>

        <h3>CMS Rule Changes</h3>
        <p>
          CMS has made incremental changes to Medicare Part D that affect PBMs:
        </p>
        <ul>
          <li>DIR fee reform (effective 2024) requires price concessions to be reflected at the point of sale</li>
          <li>IRA provisions cap insulin at $35/month and begin Medicare drug price negotiations</li>
          <li>New transparency requirements for Part D plan sponsors regarding PBM contracts</li>
        </ul>

        <h2 className="font-[family-name:var(--font-heading)]">How This Connects to Our Data</h2>
        <p>
          When you see a drug in our database costing {fmtMoney(stats.avgCostPerClaim)} per claim on average, that
          figure reflects the <em>price after PBM processing</em>. The actual amounts flowing between manufacturers,
          PBMs, pharmacies, and plans are far more complex:
        </p>

        <div className="not-prose bg-blue-50 border border-blue-200 rounded-xl p-6 my-6">
          <h4 className="font-bold text-[#1e40af] mb-3">The Drug Pricing Waterfall</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs font-mono">$500</span>
              <span>Manufacturer list price (WAC)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">↓ Rebate to PBM (30%)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs font-mono">$350</span>
              <span>Net price after rebate</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">↓ PBM retains portion (~23%)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs font-mono">$385</span>
              <span>Price charged to Part D plan</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">↓ Spread pricing margin</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-green-100 text-green-800 rounded px-2 py-1 text-xs font-mono">$310</span>
              <span>Pharmacy reimbursement</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">↓ DIR fee clawback</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-red-100 text-red-800 rounded px-2 py-1 text-xs font-mono">$285</span>
              <span>What the pharmacy actually keeps</span>
            </div>
          </div>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">The Brand vs. Generic Decision</h2>
        <p>
          PBM incentives directly affect the brand-vs-generic prescribing patterns we see in our data. Currently,
          {stats.brandPct}% of Medicare Part D claims are for brand-name drugs. But brand drugs account for
          {fmtMoney(stats.brandCost)} of the {fmtMoney(stats.cost)} total — a disproportionate share driven partly
          by PBM formulary decisions that favor rebated brands over cheaper generics.
        </p>
        <p>
          When a generic drug becomes available, the PBM <em>should</em> switch patients to save money. But if the
          brand manufacturer offers a large enough rebate, the PBM may keep the brand on the preferred tier. The
          patient pays more (higher brand copay), Medicare pays more (higher plan liability), but the PBM profits
          from the rebate.
        </p>

        <h2 className="font-[family-name:var(--font-heading)]">What Would Real Reform Look Like?</h2>
        <ol>
          <li><strong>Ban spread pricing in Medicare</strong> — PBMs should be paid flat administrative fees, not percentage-based margins</li>
          <li><strong>100% rebate passthrough</strong> — All manufacturer rebates should flow to plans and patients, not PBMs</li>
          <li><strong>Delink PBM compensation from drug prices</strong> — Remove the incentive to prefer expensive drugs</li>
          <li><strong>Prohibit vertical integration</strong> — or at minimum require structural separation between PBM, pharmacy, and insurance functions</li>
          <li><strong>Real-time pricing transparency</strong> — Patients and prescribers should see the actual net cost of drugs at the point of prescribing</li>
        </ol>

        <div className="not-prose bg-gray-50 border border-gray-200 rounded-xl p-6 my-8">
          <h4 className="font-bold text-gray-900 mb-2">📚 Data Sources & Methodology</h4>
          <p className="text-sm text-gray-600">
            Drug cost data is from CMS Medicare Part D Prescriber Public Use File (2023). PBM market share estimates
            are from Drug Channels Institute. FTC findings are from the 2024 Interim Report on PBMs. Spread pricing
            data is from the Ohio Medicaid audit (2018) and subsequent state investigations.
          </p>
        </div>

        <h2 className="font-[family-name:var(--font-heading)]">Explore Related Analysis</h2>
        <ul>
          <li><Link href="/analysis/brand-generic-gap" className="text-[#1e40af] hover:underline">Brand vs Generic: The Prescribing Gap That Costs Billions</Link></li>
          <li><Link href="/analysis/generic-adoption" className="text-[#1e40af] hover:underline">Why Doctors Still Prescribe Brands When Generics Exist</Link></li>
          <li><Link href="/analysis/medicare-drug-spending" className="text-[#1e40af] hover:underline">Where Does $275.6 Billion Go?</Link></li>
          <li><Link href="/analysis/top-drugs-analysis" className="text-[#1e40af] hover:underline">The Drugs That Cost Medicare Billions</Link></li>
          <li><Link href="/analysis/most-expensive-prescribers" className="text-[#1e40af] hover:underline">The Most Expensive Prescribers in Medicare</Link></li>
        </ul>
      </div>

      <RelatedAnalysis current="/analysis/pharmacy-benefit-managers" />
    </div>
  )
}
