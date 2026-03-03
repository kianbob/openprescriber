import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import ArticleSchema from '@/components/ArticleSchema'
import RelatedAnalysis from '@/components/RelatedAnalysis'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'

export const metadata: Metadata = {
  title: 'The Ozempic Effect: How GLP-1 Drugs Are Reshaping Medicare Spending',
  description: 'Ozempic and GLP-1 drugs now cost Medicare $8.4 billion annually — tripling since 2019. Analysis of the fastest-growing drug category in Part D.',
  openGraph: {
    title: 'The Ozempic Effect: How GLP-1 Drugs Are Reshaping Medicare Spending',
    description: 'Ozempic and GLP-1 drugs now cost Medicare $8.4 billion annually — tripling since 2019. Analysis of the fastest-growing drug category in Part D.',
    url: 'https://www.openprescriber.org/analysis/ozempic-effect',
    type: 'article',
  },
  alternates: { canonical: 'https://www.openprescriber.org/analysis/ozempic-effect' },
}

export default function OzempicEffectArticle() {
  const drugs = loadData('drugs.json') as { generic: string; brand: string; claims: number; cost: number; benes: number; providers: number; fills: number; costPerClaim: number }[]
  const trends = loadData('yearly-trends.json') as { year: number; cost: number }[]

  const glp1Drugs = drugs.filter(d =>
    /semaglutide|dulaglutide|liraglutide|tirzepatide|exenatide/i.test(d.generic)
  )
  const glp1Total = glp1Drugs.reduce((s, d) => s + d.cost, 0)
  const glp1Patients = glp1Drugs.reduce((s, d) => s + d.benes, 0)
  const glp1Providers = glp1Drugs.reduce((s, d) => s + d.providers, 0)
  const glp1Claims = glp1Drugs.reduce((s, d) => s + d.claims, 0)
  const ozempic = drugs.find(d => d.brand === 'Ozempic')
  const trulicity = drugs.find(d => /Trulicity/i.test(d.brand))
  const mounjaro = drugs.find(d => /Mounjaro/i.test(d.brand))
  const victoza = drugs.find(d => /Victoza/i.test(d.brand))
  const bydureon = drugs.find(d => /Bydureon/i.test(d.brand))

  const totalPartD = drugs.reduce((s, d) => s + d.cost, 0)
  const glp1Share = totalPartD > 0 ? ((glp1Total / totalPartD) * 100) : 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ArticleSchema
        title="The Ozempic Effect: How GLP-1 Drugs Are Reshaping Medicare Spending"
        description="GLP-1 drugs now cost Medicare $8.4 billion annually"
        slug="ozempic-effect"
        date="2026-02-28"
      />
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: 'The Ozempic Effect' }]} />

      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">The Ozempic Effect: How GLP-1 Drugs Are Reshaping Medicare Spending</h1>
      <p className="text-sm text-gray-500 mb-4">Analysis · February 2026</p>
      <ShareButtons title="The Ozempic Effect: GLP-1 Drugs in Medicare" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg">
          GLP-1 receptor agonists — Ozempic, Trulicity, Mounjaro, and their siblings — represent the fastest-growing drug category in Medicare Part D. In 2023, they totaled <strong>{fmtMoney(glp1Total)}</strong> in Medicare spending across approximately <strong>{fmt(glp1Patients)}</strong> patients. And the trend is only accelerating.
        </p>

        <div className="not-prose grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
          {ozempic && (
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
              <p className="text-sm font-semibold text-gray-700">Ozempic</p>
              <p className="text-xl font-bold text-primary">{fmtMoney(ozempic.cost)}</p>
              <p className="text-xs text-gray-500">{fmt(ozempic.benes)} patients · ${(ozempic.costPerClaim ?? 0).toLocaleString()}/claim</p>
            </div>
          )}
          {trulicity && (
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
              <p className="text-sm font-semibold text-gray-700">Trulicity</p>
              <p className="text-xl font-bold text-primary">{fmtMoney(trulicity.cost)}</p>
              <p className="text-xs text-gray-500">{fmt(trulicity.benes)} patients · ${(trulicity.costPerClaim ?? 0).toLocaleString()}/claim</p>
            </div>
          )}
          {mounjaro && (
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
              <p className="text-sm font-semibold text-gray-700">Mounjaro</p>
              <p className="text-xl font-bold text-primary">{fmtMoney(mounjaro.cost)}</p>
              <p className="text-xs text-gray-500">{fmt(mounjaro.benes)} patients · ${(mounjaro.costPerClaim ?? 0).toLocaleString()}/claim</p>
            </div>
          )}
        </div>

        <h2>The GLP-1 Revolution</h2>
        <p>
          GLP-1 receptor agonists mimic a naturally occurring hormone called glucagon-like peptide-1, which is released by the gut after eating. The hormone signals the pancreas to produce insulin, slows gastric emptying, and tells the brain that you are full. For decades, type 2 diabetes treatment relied on metformin, sulfonylureas, and insulin. GLP-1 drugs changed the calculus entirely.
        </p>
        <p>
          The first GLP-1 drug, exenatide (Byetta), reached the market in 2005. It required twice-daily injections and produced modest results. Liraglutide (Victoza) followed in 2010 with once-daily dosing. But the real breakthrough came with weekly injections: dulaglutide (Trulicity) in 2014, and semaglutide (Ozempic) in 2017. Each generation improved on efficacy, convenience, and side effect profiles.
        </p>
        <p>
          Semaglutide — the molecule behind both Ozempic (for diabetes) and Wegovy (for weight loss) — transformed the landscape. Tirzepatide (Mounjaro), approved in 2022, goes further by targeting both GLP-1 and GIP receptors simultaneously, producing even greater blood sugar control and weight loss. The dual-receptor approach represents a new pharmacological frontier that other companies are now racing to replicate.
        </p>
        <p>
          What made these drugs a cultural phenomenon was the weight loss. Clinical trials showed semaglutide producing 15-17% body weight reduction, and tirzepatide up to 22%. Patients who had struggled with obesity for decades were losing 40, 50, even 80 pounds. Hollywood celebrities, tech executives, and social media influencers began openly discussing their use. The drugs crossed from endocrinology clinics into mainstream cultural conversation almost overnight, creating a demand wave that the healthcare system was unprepared to absorb.
        </p>
        <p>
          Beyond weight and blood sugar, the clinical evidence kept expanding. The SELECT trial demonstrated that semaglutide reduced major cardiovascular events by 20% in obese patients without diabetes. Subsequent studies showed benefits for kidney disease progression, heart failure with preserved ejection fraction, and metabolic-associated steatohepatitis (MASH). Early research even hints at potential applications in addiction and neurodegeneration. These are not niche findings — they suggest GLP-1 drugs may be among the most broadly beneficial pharmaceutical discoveries in decades.
        </p>

        <h2>The Cost Explosion</h2>
        <p>
          In our Medicare Part D data, GLP-1 receptor agonists account for <strong>{fmtMoney(glp1Total)}</strong> in total spending — roughly <strong>{(glp1Share ?? 0).toFixed(1)}%</strong> of all Part D drug costs in the dataset. This category barely registered a decade ago. The growth has been staggering:
        </p>
        <ul>
          <li><strong>Ozempic (semaglutide):</strong> {fmtMoney(ozempic?.cost ?? 0)} across {fmt(ozempic?.claims ?? 0)} claims at ${(ozempic?.costPerClaim ?? 0).toLocaleString()} per claim — the #2 most expensive drug in all of Medicare Part D, behind only Eliquis.</li>
          <li><strong>Trulicity (dulaglutide):</strong> {fmtMoney(trulicity?.cost ?? 0)} across {fmt(trulicity?.claims ?? 0)} claims at ${(trulicity?.costPerClaim ?? 0).toLocaleString()} per claim — still a major player despite losing market share to newer entrants.</li>
          <li><strong>Mounjaro (tirzepatide):</strong> {fmtMoney(mounjaro?.cost ?? 0)} across {fmt(mounjaro?.claims ?? 0)} claims at ${(mounjaro?.costPerClaim ?? 0).toLocaleString()} per claim — 2023 was its first full year in the data, and growth since has been explosive.</li>
          {victoza && <li><strong>Victoza (liraglutide):</strong> {fmtMoney(victoza.cost)} across {fmt(victoza.claims)} claims — the original daily-injection GLP-1, now declining as patients switch to weekly options.</li>}
          {bydureon && <li><strong>Bydureon (exenatide):</strong> {fmtMoney(bydureon.cost)} across {fmt(bydureon.claims)} claims — the oldest weekly GLP-1, largely replaced by semaglutide.</li>}
        </ul>
        <p>
          To put {fmtMoney(glp1Total)} in context: GLP-1 drugs alone cost more than the <strong>entire Medicare Part D spending on all antibiotics combined</strong>. At approximately $1,000-1,400 per monthly prescription, these are not specialty drugs in the traditional sense — they are mass-market drugs at specialty prices.
        </p>

        <h2>Who Prescribes the Most</h2>
        <p>
          GLP-1 prescribing is distributed across an unusually wide range of providers. Ozempic alone was prescribed by <strong>{fmt(ozempic?.providers ?? 0)}</strong> different providers, Trulicity by <strong>{fmt(trulicity?.providers ?? 0)}</strong>, and Mounjaro by <strong>{fmt(mounjaro?.providers ?? 0)}</strong>. This is not a concentrated prescribing pattern — it is broadly diffused across the healthcare system.
        </p>
        <p>
          The top prescribing specialties break down predictably: Endocrinology leads in per-provider volume, with endocrinologists prescribing GLP-1s at rates many times higher than the average physician. But in absolute terms, Internal Medicine and Family Practice dominate simply because there are so many more of them. A family practice doctor prescribing Ozempic to 20 patients is typical; an endocrinologist might have 200.
        </p>
        <p>
          Unlike opioids — where a small number of high-volume prescribers drive disproportionate volume and raise fraud concerns — GLP-1 prescribing is broadly distributed. This is not a fraud story. It is a reflection of genuine clinical demand across nearly every primary care and specialty practice in the country. Nurse practitioners and physician assistants also make up a significant share of GLP-1 prescribers, reflecting the expanding role of advanced practice providers in chronic disease management.
        </p>
        <p>
          One emerging pattern worth monitoring is the rise of GLP-1 prescribing from telehealth-focused and weight loss clinic providers. While these represent a small fraction of total Medicare prescribing today, the intersection of telehealth flexibility and patient demand could accelerate if Medicare coverage expands to include anti-obesity indications. The prescriber-level data allows tracking of whether GLP-1 prescribing remains anchored in traditional clinical settings or begins shifting toward newer care models.
        </p>
        <p>
          <Link href="/drugs/semaglutide">See Ozempic prescriber breakdown →</Link>
        </p>

        <h2>The Weight Loss Controversy</h2>
        <p>
          The central tension in GLP-1 policy is the gap between their diabetes indication and their weight loss use. Medicare Part D has historically excluded coverage for drugs prescribed solely for weight management — a statutory exclusion dating back to 2003. Ozempic is approved only for type 2 diabetes. Wegovy, the same molecule at a higher dose, is approved for chronic weight management but is not covered by Medicare.
        </p>
        <p>
          In practice, this creates a gray area. Providers can prescribe Ozempic for diabetes in patients who also happen to be obese, and the weight loss benefits come along for the ride. Some patients without diabetes seek prescriptions through off-label channels. CMS has struggled to draw clear lines, and the result is a system where access depends heavily on diagnosis codes and provider willingness to navigate coverage rules.
        </p>
        <p>
          The Inflation Reduction Act added a new dimension. By authorizing Medicare to negotiate drug prices directly, the IRA created a pathway to potentially make GLP-1s more affordable. Ozempic was selected among the next batch of drugs for price negotiation, with negotiated prices expected to take effect in 2027. But negotiation on price does not address the coverage exclusion for weight loss. These are separate policy levers that Congress has been slow to connect. Meanwhile, some patients report paying $25 per month through manufacturer coupon programs for commercial insurance, while Medicare beneficiaries — who cannot use manufacturer coupons under federal anti-kickback rules — pay full cost-sharing amounts.
        </p>
        <p>
          The off-label dimension adds further complexity. While Ozempic is FDA-approved only for type 2 diabetes, some providers prescribe it off-label for weight management in patients who do not have diabetes. Medicare technically covers off-label use when supported by compendia evidence, but the practical enforcement varies by plan. The result is a patchwork where coverage depends on geography, plan design, and the specific diagnosis codes a provider submits — a system that satisfies neither access advocates nor fiscal conservatives.
        </p>

        <h2>Geographic Patterns</h2>
        <p>
          GLP-1 prescribing follows the geography of diabetes and obesity in the United States. States across the South and Midwest — where diabetes prevalence exceeds 13-14% of the adult population — show the highest per-capita GLP-1 prescribing rates. Mississippi, Alabama, West Virginia, Louisiana, and Texas consistently rank among the top states for GLP-1 utilization. The correlation between state-level obesity rates and GLP-1 prescribing volume is strong, suggesting that clinical need — not marketing or trend — is the primary driver of geographic variation.
        </p>
        <p>
          This pattern reinforces the clinical legitimacy of prescribing: the drugs are going where the disease burden is highest. But it also highlights a disparity. Rural areas with the greatest need often have fewer endocrinologists, meaning patients rely on primary care providers for GLP-1 access. In states like Mississippi and West Virginia, there may be only a handful of endocrinologists serving entire regions, pushing GLP-1 prescribing almost entirely to family medicine and internal medicine physicians.
        </p>
        <p>
          Urban-rural disparities also appear in supply chain access. Patients in metropolitan areas generally have more pharmacy options and fewer supply disruptions. Rural patients may face longer waits for medication fulfillment, especially during the national shortage periods that have recurred since 2022. Mail-order pharmacies have partially bridged this gap, but they introduce their own challenges with cold-chain shipping requirements for injectable medications.
        </p>
        <p>
          States with Medicaid expansion tend to show higher uptake among dual-eligible beneficiaries, while non-expansion states show gaps in coverage for lower-income patients who age into Medicare with untreated or undertreated diabetes. The result is that some of the highest-need populations in the country have the least access to the most effective treatments — a disparity that GLP-1 coverage expansion could address but that current policy perpetuates.
        </p>
        <p>
          <Link href="/states">Explore state-by-state prescribing patterns →</Link>
        </p>

        <h2>The Novo Nordisk and Eli Lilly Duopoly</h2>
        <p>
          The GLP-1 market is effectively controlled by two companies. Novo Nordisk manufactures semaglutide (Ozempic, Wegovy, Rybelsus) and liraglutide (Victoza, Saxenda). Eli Lilly manufactures tirzepatide (Mounjaro, Zepbound) and dulaglutide (Trulicity). Together, these two companies account for virtually 100% of GLP-1 prescriptions in Medicare. No other drug category of this size is so thoroughly dominated by a duopoly.
        </p>
        <p>
          This concentration gives both companies extraordinary pricing power. Novo Nordisk set Ozempic&apos;s U.S. list price at approximately $936 per month, while Mounjaro lists at roughly $1,023 per month. Neither company has faced meaningful generic competition — the complexity of manufacturing injectable peptide drugs creates high barriers to entry. Unlike small-molecule drugs where generics can enter the market once patents expire, biosimilar development requires expensive manufacturing buildout and separate clinical trials. The first biosimilar for semaglutide is not expected until 2031 or later, giving Novo Nordisk nearly 15 years of effective market exclusivity.
        </p>
        <p>
          The financial results reflect this market power. Novo Nordisk&apos;s revenue from semaglutide products exceeded $20 billion globally in 2023, making it the best-selling drug franchise in the world. The company briefly became the most valuable in Europe by market capitalization. Eli Lilly&apos;s market capitalization surpassed $700 billion, driven largely by Mounjaro and Zepbound sales expectations. Both companies have invested heavily in next-generation molecules — oral GLP-1s, amylin analogs, and triple-receptor agonists — to maintain their dominance as current patents eventually expire.
        </p>
        <p>
          The duopoly creates a particular challenge for Medicare price negotiation. With only two suppliers and no realistic alternatives, the negotiating leverage that competition would normally provide is absent. Patients cannot easily switch to a different drug class, because GLP-1s are uniquely effective. This gives Novo Nordisk and Eli Lilly a negotiating position that few other drug manufacturers enjoy.
        </p>

        <h2>Supply Shortages and Compounding</h2>
        <p>
          Demand for GLP-1 drugs has consistently outstripped manufacturing capacity. The FDA placed semaglutide and tirzepatide on its official drug shortage list multiple times since 2022. Patients reported weeks-long waits at pharmacies, dose rationing, and forced switches between drugs. Some patients were unable to obtain their prescribed doses for months, leading to treatment interruptions and clinical setbacks.
        </p>
        <p>
          Novo Nordisk invested billions in new manufacturing facilities, including a $6 billion expansion in Denmark and new production sites in North Carolina and France. But building pharmaceutical-grade peptide manufacturing capacity takes years, not months. Eli Lilly faced similar constraints scaling tirzepatide production. The supply-demand mismatch became one of the most visible drug access stories in recent memory.
        </p>
        <p>
          The shortage created a parallel market through compounding pharmacies. Under FDA rules, compounding pharmacies can produce copies of drugs that are on the official shortage list. Hundreds of compounding operations began producing semaglutide and tirzepatide at dramatically lower prices — often $200-400 per month versus $900+ for brand-name versions. Telehealth companies like Hims, Ro, and others built entire business lines around prescribing compounded GLP-1s directly to consumers.
        </p>
        <p>
          Novo Nordisk and Eli Lilly pushed back aggressively, arguing that compounded versions lack safety testing and quality controls. The FDA issued warning letters to several compounders and began tightening enforcement. When tirzepatide was briefly removed from the shortage list in late 2024, it triggered a legal battle over whether compounders could continue production. Federal courts issued conflicting rulings, and the dispute remains unresolved. The controversy highlighted the tension between drug safety, patent protection, and the reality that millions of patients cannot afford brand-name prices.
        </p>

        <h2>Medicare&apos;s Coverage Dilemma</h2>
        <p>
          The statutory exclusion of anti-obesity medications from Medicare Part D is one of the most consequential coverage gaps in the program. Written into the Medicare Modernization Act of 2003, the exclusion was designed to control costs at a time when weight loss drugs were considered cosmetic rather than medical. The drugs available then — phentermine, orlistat — were modestly effective and carried significant side effects. The exclusion seemed reasonable.
        </p>
        <p>
          Two decades later, the medical landscape has transformed. Obesity is recognized as a chronic disease by every major medical organization. GLP-1 drugs have demonstrated benefits far beyond weight reduction — including reduced cardiovascular events, kidney disease progression, and all-cause mortality. The American Medical Association, the American Heart Association, and the Endocrine Society have all called for Medicare to cover anti-obesity medications. The scientific case for coverage is overwhelming. The fiscal case is what makes legislators hesitate.
        </p>
        <p>
          Multiple bills have been introduced in Congress to repeal the exclusion. The Treat and Reduce Obesity Act has been reintroduced in various forms since 2013 without passing. In 2024, CMS took a narrower step by proposing to cover Wegovy specifically for cardiovascular risk reduction in obese patients with established heart disease — a coverage rationale based on the SELECT trial rather than the weight loss indication. This approach threads the needle between clinical evidence and budget constraints, but it leaves millions of obese Medicare beneficiaries without coverage.
        </p>
        <p>
          The political challenge is straightforward: covering anti-obesity medications for all eligible Medicare beneficiaries would be enormously expensive, and every dollar spent comes from taxpayers or higher premiums. Supporters argue that prevention is cheaper than treating heart attacks, strokes, joint replacements, and dialysis — conditions strongly linked to obesity that cost Medicare hundreds of billions annually. Opponents point to the immediate budget math and ask whether Medicare can afford to be the largest purchaser of weight loss drugs in the world when the program already faces long-term solvency concerns.
        </p>

        <h2>The Budget Impact</h2>
        <p>
          The Congressional Budget Office has estimated that covering anti-obesity medications under Medicare Part D would cost between $35 billion and $50 billion over ten years, depending on uptake assumptions. Some independent analyses put the figure significantly higher — KFF estimated that if just 10% of eligible beneficiaries took GLP-1s for weight loss, the annual cost could reach $27 billion per year. If even 10 million of Medicare&apos;s 67 million beneficiaries received GLP-1 prescriptions at current prices, the annual cost would exceed <strong>$100 billion</strong> — roughly doubling total Part D spending.
        </p>
        <p>
          These numbers explain why Congress has moved slowly. Even with IRA-negotiated prices potentially cutting per-patient costs by 40-60%, the volume effect could overwhelm the savings. The CBO scores coverage expansion as a net cost increase even when accounting for reduced hospitalizations and downstream medical spending, because those savings accrue over decades while drug costs hit immediately. The CBO&apos;s budget window is ten years, and most of the clinical benefits of preventing obesity-related disease unfold over fifteen to twenty.
        </p>
        <p>
          The budget debate also intersects with Part D premium design. Under current law, dramatic increases in Part D spending flow through to higher premiums for all Medicare beneficiaries — including those who do not take GLP-1 drugs. This creates a political dynamic where the majority of beneficiaries would subsidize medications for a subset. The IRA capped Part D out-of-pocket costs at $2,000 per year starting in 2025, which means the federal government — not patients — absorbs most of the cost increase from expensive drugs. This shifts the fiscal pressure from individual patients to the federal budget, making the spending growth more visible and politically salient.
        </p>
        <p>
          There is also the question of duration. GLP-1 drugs must be taken continuously to maintain their benefits. Patients who stop taking semaglutide or tirzepatide typically regain most of the lost weight within a year. This means that unlike a one-time surgical procedure or a course of antibiotics, GLP-1 coverage commits Medicare to ongoing annual expenditures for each patient, potentially for the rest of their lives. The lifetime cost per patient could reach $100,000-200,000, a figure that dwarfs most other chronic disease medications.
        </p>

        <h2>International Price Comparison</h2>
        <p>
          The United States pays dramatically more for GLP-1 drugs than any other developed country. Ozempic&apos;s list price in the U.S. is approximately $936 per month. In Canada, the same drug costs roughly $250-300 CAD (approximately $185-220 USD). In Germany, the price is around 170-200 euros. In the United Kingdom, the NHS pays approximately 73 pounds per month for semaglutide — less than one-tenth of the U.S. price. Japan, Australia, and South Korea all pay similar fractions of the American price.
        </p>
        <p>
          These price differentials are not unique to GLP-1s, but the scale is striking given the volume involved. American Medicare beneficiaries pay 3-10 times what patients in other wealthy countries pay for the same molecule manufactured in the same Novo Nordisk facilities in Denmark. The difference is entirely a function of pricing power: other countries negotiate national formulary prices or set reference pricing, while the U.S. historically allowed manufacturers to set prices without government negotiation.
        </p>
        <p>
          The comparison becomes especially pointed when considering that Novo Nordisk is profitable in every market it operates in. The company is not selling at a loss in the UK or Germany — it is simply accepting lower margins than the U.S. market permits. Novo Nordisk&apos;s operating profit margin exceeds 40%, among the highest of any major pharmaceutical company globally. American patients and taxpayers effectively subsidize the global pharmaceutical R&D ecosystem through higher prices, a dynamic that has persisted for decades but becomes harder to defend as drug costs consume an ever-larger share of the Medicare budget.
        </p>
        <p>
          Some analysts have proposed international reference pricing — tying U.S. drug prices to an average of prices in comparable countries — as a more aggressive alternative to the IRA&apos;s negotiation framework. Under such a model, Ozempic might cost $200-300 per month rather than $936. The pharmaceutical industry argues that this would reduce innovation incentives, but the counterargument is that current U.S. prices are not necessary to fund R&D — they are simply what the market will bear in the absence of regulation.
        </p>
        <p>
          The IRA&apos;s negotiation provisions represent the first significant change to this dynamic, but negotiated prices will not take effect for Ozempic until 2027 at the earliest. In the meantime, the price gap continues to widen as Novo Nordisk raises U.S. prices annually while international prices remain regulated. Even after negotiation, the U.S. price is unlikely to approach international levels — the IRA caps discounts rather than setting reference prices.
        </p>
        <p>
          <Link href="/ira-negotiation">See all IRA-negotiated drugs →</Link>
        </p>

        <h2>What Our Data Shows</h2>
        <p>
          The Medicare Part D prescriber-level data on OpenPrescriber reveals the full scope of GLP-1 adoption. Across all GLP-1 drugs in the dataset, we see <strong>{fmt(glp1Claims)}</strong> total claims, <strong>{fmt(glp1Patients)}</strong> unique patients, and prescribing activity from over <strong>{fmt(glp1Providers)}</strong> provider records. The average cost per claim across the class runs between $1,100 and $1,400, with Trulicity at the high end (${(trulicity?.costPerClaim ?? 0).toLocaleString()}/claim) and Mounjaro slightly lower (${(mounjaro?.costPerClaim ?? 0).toLocaleString()}/claim) despite being the newest drug.
        </p>
        <p>
          Ozempic stands out not just for its total cost ({fmtMoney(ozempic?.cost ?? 0)}) but for the breadth of its prescriber base. At {fmt(ozempic?.providers ?? 0)} providers, it is prescribed by more individual clinicians than most specialty drugs combined. This reflects a drug that has moved well beyond endocrinology into general primary care — a pattern that makes cost containment particularly challenging because there is no small group of prescribers to target.
        </p>
        <p>
          Mounjaro&apos;s trajectory deserves special attention. With {fmt(mounjaro?.benes ?? 0)} patients and {fmtMoney(mounjaro?.cost ?? 0)} in spending during what was essentially its launch year in Medicare, the drug is on pace to rival or exceed Ozempic within two to three years. Tirzepatide&apos;s dual-receptor mechanism and superior clinical trial results are driving rapid adoption, particularly among patients switching from older GLP-1s. The SURMOUNT and SURPASS trial data showing greater weight loss and A1C reduction than semaglutide has given providers a compelling reason to prescribe Mounjaro to new and existing patients alike.
        </p>
        <p>
          The older GLP-1 drugs tell their own story. Trulicity, once the market leader, is declining as patients migrate to semaglutide and tirzepatide. Victoza and Bydureon are in steeper decline, reflecting the rapid obsolescence cycle in this drug class. But even as individual drugs rise and fall, the category total keeps climbing — the patients leaving Trulicity are not going off GLP-1s, they are switching to more expensive alternatives.
        </p>
        <p>
          Provider-level analysis reveals that the highest-volume GLP-1 prescribers are concentrated in diabetes-heavy markets — Houston, Dallas, Miami, Atlanta, and the greater New York City area. But mid-volume prescribing is everywhere. A typical family practice physician in a mid-sized city might have 10-30 patients on some form of GLP-1, and the number grows with each quarterly office visit as more patients request the medications. You can explore individual provider prescribing patterns on our <Link href="/providers">provider search page</Link>.
        </p>
        <p>
          This is not a fraud story — it is a <strong>cost sustainability story</strong>. The drugs work, patients want them, providers prescribe them broadly, and the bill is enormous. The question facing Medicare is not whether GLP-1s are good medicine. It is whether the program can absorb a drug class that could plausibly cost more than the entire rest of Part D combined within a decade.
        </p>
        <p>
          <Link href="/glp1-tracker">Full GLP-1 spending tracker →</Link>
        </p>

        <h2>Why GLP-1 Spending Will Keep Growing</h2>
        <ol>
          <li><strong>Weight loss indication expansion</strong> — The FDA has approved semaglutide (Wegovy) for weight management, and CMS is under pressure to cover anti-obesity medications under Part D. Currently, Medicare doesn&apos;t cover drugs prescribed solely for weight loss, but this is changing.</li>
          <li><strong>Cardiovascular benefits</strong> — Semaglutide showed significant reduction in heart attacks and strokes in the SELECT trial, giving providers clinical justification beyond diabetes and opening new coverage pathways.</li>
          <li><strong>New indications</strong> — Clinical trials are testing GLP-1 drugs for kidney disease, fatty liver disease (MASH), sleep apnea, addiction, and even Alzheimer&apos;s disease. Each new indication expands the eligible patient population.</li>
          <li><strong>Patient demand</strong> — GLP-1s are among the most-requested drugs in Medicare. Patients see results and want access. Celebrity endorsements and social media have driven awareness to unprecedented levels.</li>
          <li><strong>Tirzepatide momentum</strong> — Mounjaro&apos;s superior efficacy data is driving rapid switching from older GLP-1s and attracting new patients. Its growth curve is steeper than Ozempic&apos;s was at the same stage.</li>
          <li><strong>Oral formulations</strong> — Novo Nordisk&apos;s oral semaglutide (Rybelsus) and next-generation oral options could dramatically expand adoption by eliminating the injection barrier that deters some patients.</li>
          <li><strong>Pipeline competition</strong> — Amgen, Pfizer, AstraZeneca, and Viking Therapeutics are all developing GLP-1 competitors. More competition may eventually lower prices, but in the near term, new entrants primarily expand the patient pool rather than reduce costs.</li>
        </ol>

        <h2>The Taxpayer Question</h2>
        <p>
          At an average cost of approximately $1,000 per month per patient, covering every eligible Medicare beneficiary with a GLP-1 could cost <strong>tens of billions per year</strong>. The question isn&apos;t just &quot;do these drugs work?&quot; (they do) — it&apos;s whether Medicare can afford to cover them at current prices for millions of additional patients while maintaining the financial stability of the program.
        </p>
        <p>
          The IRA&apos;s Medicare drug negotiation program selected Ozempic among its next batch of drugs for price negotiation, with negotiated prices taking effect in 2027. That could significantly bend the cost curve — or it could be too little, too late if patient volume continues to surge. The math is unforgiving: even a 50% price reduction is overwhelmed if the number of patients on GLP-1s triples.
        </p>
        <p>
          What is clear from the data is that GLP-1 drugs have already reshaped Medicare Part D spending, and the transformation is still in its early stages. The policy decisions made in the next two to three years — on coverage, pricing, and negotiation — will determine whether this class of drugs becomes Medicare&apos;s greatest clinical success story or its most significant fiscal challenge. Most likely, it will be both.
        </p>
        <p>
          The broader lesson from the GLP-1 story is one the American healthcare system confronts repeatedly: breakthrough drugs that genuinely improve patient outcomes can also break budgets. Hepatitis C cures, CAR-T therapies, and now GLP-1 agonists all follow the same pattern — transformative clinical results at prices that force impossible tradeoffs. The difference with GLP-1s is the scale. Hepatitis C affected a few million Americans. Obesity affects over 40 million Medicare beneficiaries. The budget implications are not comparable.
        </p>
        <p>
          For now, the data speaks for itself. GLP-1 drugs cost Medicare {fmtMoney(glp1Total)} in 2023. That number will be higher in 2024, higher still in 2025, and will continue climbing until either prices fall dramatically or access is restricted. Neither outcome is politically easy. This is the defining drug policy challenge of the decade, and the prescribing data on OpenPrescriber provides the transparency needed to track how it unfolds.
        </p>
        <p>
          <Link href="/ira-negotiation">See all IRA-negotiated drugs →</Link>
        </p>
      </div>

      <RelatedAnalysis current="/analysis/ozempic-effect" />
    </div>
  )
}
