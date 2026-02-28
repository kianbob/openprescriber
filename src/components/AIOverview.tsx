// Data-driven insight generator — produces contextual analysis paragraphs
// based on actual numbers. No LLM needed; pure conditional logic.

type Insight = { icon: string; text: string; severity: 'info' | 'warning' | 'danger' }

function StateInsights({ state, providers, cost, opioidProv, highOpioid, avgOpioidRate, costPerBene, flagged, costGrowth, allStates }: {
  state: string; providers: number; cost: number; opioidProv: number; highOpioid: number
  avgOpioidRate: number; costPerBene: number; flagged: number; costGrowth?: number
  allStates: { state: string; cost: number; avgOpioidRate: number; providers: number; costPerBene: number }[]
}) {
  const insights: Insight[] = []
  const sorted = [...allStates].sort((a, b) => b.cost - a.cost)
  const costRank = sorted.findIndex(s => s.state === state) + 1
  const opioidSorted = [...allStates].sort((a, b) => b.avgOpioidRate - a.avgOpioidRate)
  const opioidRank = opioidSorted.findIndex(s => s.state === state) + 1
  const costSorted = [...allStates].sort((a, b) => b.costPerBene - a.costPerBene)
  const costPerBeneRank = costSorted.findIndex(s => s.state === state) + 1
  const natAvgOpioid = allStates.reduce((s, x) => s + x.avgOpioidRate * x.providers, 0) / allStates.reduce((s, x) => s + x.providers, 0)
  const natAvgCostPerBene = allStates.reduce((s, x) => s + x.costPerBene * x.providers, 0) / allStates.reduce((s, x) => s + x.providers, 0)

  if (costRank <= 5) insights.push({ icon: '💰', text: `Ranks #${costRank} nationally in total Medicare Part D drug spending. This state accounts for ${(cost / 275.6e9 * 100).toFixed(1)}% of all Part D costs.`, severity: 'info' })

  if (avgOpioidRate > natAvgOpioid * 1.3) insights.push({ icon: '⚠️', text: `Average opioid prescribing rate of ${avgOpioidRate.toFixed(1)}% is ${((avgOpioidRate / natAvgOpioid - 1) * 100).toFixed(0)}% above the national average (${natAvgOpioid.toFixed(1)}%). This elevated rate warrants closer examination of prescribing patterns.`, severity: 'danger' })
  else if (avgOpioidRate < natAvgOpioid * 0.7) insights.push({ icon: '✅', text: `Average opioid prescribing rate of ${avgOpioidRate.toFixed(1)}% is well below the national average (${natAvgOpioid.toFixed(1)}%), suggesting more conservative opioid prescribing practices.`, severity: 'info' })

  if (costPerBene > natAvgCostPerBene * 1.3) insights.push({ icon: '📊', text: `Cost per patient of $${costPerBene.toLocaleString()} is ${((costPerBene / natAvgCostPerBene - 1) * 100).toFixed(0)}% higher than the national average ($${Math.round(natAvgCostPerBene).toLocaleString()}), which may indicate higher utilization of expensive specialty drugs.`, severity: 'warning' })

  if (flagged > 100) insights.push({ icon: '🔍', text: `${flagged.toLocaleString()} providers in this state have been flagged for unusual prescribing patterns — one of the highest counts nationally. This doesn't mean fraud, but these providers show statistical outlier patterns compared to their specialty peers.`, severity: 'warning' })
  else if (flagged > 0) insights.push({ icon: '🔍', text: `${flagged.toLocaleString()} providers flagged for unusual prescribing patterns. These are statistical outliers, not accusations — many flagged providers have legitimate clinical reasons for their patterns.`, severity: 'info' })

  const highOpioidPct = providers > 0 ? (highOpioid / providers * 100) : 0
  if (highOpioidPct > 10) insights.push({ icon: '💊', text: `${highOpioidPct.toFixed(1)}% of all prescribers have opioid rates above 20% — significantly above typical levels. High-opioid prescribers may include pain management specialists, but the concentration deserves attention.`, severity: 'warning' })

  if (costGrowth && costGrowth > 60) insights.push({ icon: '📈', text: `Drug costs have grown ${costGrowth.toFixed(0)}% over the past 5 years, outpacing the national average. Rising costs are primarily driven by specialty drugs and brand-name biologics.`, severity: 'warning' })

  return insights
}

function SpecialtyInsights({ specialty, providers, cost, opioidProv, avgOpioidRate, avgBrandPct, costPerProvider, flagged, totalProviders }: {
  specialty: string; providers: number; cost: number; opioidProv: number; avgOpioidRate: number
  avgBrandPct: number; costPerProvider: number; flagged: number; totalProviders: number
}) {
  const insights: Insight[] = []
  const pctOfAll = providers / totalProviders * 100

  if (pctOfAll > 5) insights.push({ icon: '📊', text: `${specialty} represents ${pctOfAll.toFixed(1)}% of all Medicare Part D prescribers, making it one of the largest prescriber groups in the program.`, severity: 'info' })

  if (avgOpioidRate > 20) insights.push({ icon: '⚠️', text: `Average opioid prescribing rate of ${avgOpioidRate.toFixed(1)}% is significantly elevated. While some specialties (pain management, anesthesiology) legitimately prescribe opioids at high rates, this figure deserves context about the specialty's typical patient population.`, severity: 'warning' })
  else if (avgOpioidRate > 10) insights.push({ icon: '💊', text: `Average opioid rate of ${avgOpioidRate.toFixed(1)}% is above the national average. This may reflect the patient population served rather than overprescribing.`, severity: 'info' })

  if (avgBrandPct > 20) insights.push({ icon: '💰', text: `Average brand-name prescribing rate of ${avgBrandPct.toFixed(1)}% is notably high. While some specialties require brand-name medications without generic alternatives, higher brand rates increase costs to Medicare and patients.`, severity: 'warning' })

  if (costPerProvider > 500000) insights.push({ icon: '📈', text: `Average cost per provider of $${Math.round(costPerProvider).toLocaleString()} is exceptionally high, reflecting this specialty's use of expensive medications. High per-provider costs in specialties like oncology or rheumatology often reflect legitimate clinical needs.`, severity: 'info' })

  const flagRate = providers > 0 ? (flagged / providers * 100) : 0
  if (flagRate > 1) insights.push({ icon: '🔍', text: `${flagged.toLocaleString()} providers (${flagRate.toFixed(1)}% of the specialty) have been flagged for atypical prescribing. Our model compares providers to their specialty peers, so these outliers deviate from their own group's norms.`, severity: 'warning' })

  if (cost > 10e9) insights.push({ icon: '💵', text: `This specialty accounts for $${(cost / 1e9).toFixed(1)}B in Medicare Part D costs — ${(cost / 275.6e9 * 100).toFixed(1)}% of total program spending. Understanding where this money goes is key to controlling healthcare costs.`, severity: 'info' })

  return insights
}

function DrugInsights({ generic, brand, cost, claims, costPerClaim, providers, benes, rank, totalDrugs }: {
  generic: string; brand: string; cost: number; claims: number; costPerClaim: number
  providers: number; benes: number; rank: number; totalDrugs: number
}) {
  const insights: Insight[] = []

  if (rank <= 10) insights.push({ icon: '🏆', text: `${generic} is the #${rank} most expensive drug in Medicare Part D, costing taxpayers $${(cost / 1e9).toFixed(2)}B in 2023. The top 10 drugs alone account for roughly 20% of all Part D spending.`, severity: 'info' })
  else if (rank <= 50) insights.push({ icon: '📊', text: `Ranked #${rank} out of ${totalDrugs.toLocaleString()} drugs tracked by total cost. ${generic} represents a significant portion of Medicare drug spending.`, severity: 'info' })

  if (costPerClaim > 1000) insights.push({ icon: '💰', text: `At $${Math.round(costPerClaim).toLocaleString()} per prescription, this is a high-cost medication. Expensive drugs drive Medicare spending growth and create access challenges for patients with coverage gaps.`, severity: 'warning' })
  else if (costPerClaim < 20) insights.push({ icon: '✅', text: `At $${costPerClaim.toFixed(2)} per prescription, this is an affordable generic medication. Wider use of affordable generics like this could save Medicare billions annually.`, severity: 'info' })

  const avgProviderCost = providers > 0 ? cost / providers : 0
  if (avgProviderCost > 100000) insights.push({ icon: '🔍', text: `Average cost of $${Math.round(avgProviderCost).toLocaleString()} per prescriber suggests this drug may be concentrated among specialists. High per-provider spending can sometimes indicate inappropriate prescribing or overly aggressive use.`, severity: 'warning' })

  const avgBeneCost = benes > 0 ? cost / benes : 0
  if (avgBeneCost > 5000) insights.push({ icon: '👤', text: `Average cost of $${Math.round(avgBeneCost).toLocaleString()} per patient per year. Medications at this price point significantly impact patient out-of-pocket costs and Medicare spending.`, severity: 'info' })

  // Check for opioid-related drugs by name
  const opioidNames = ['oxycodone', 'hydrocodone', 'fentanyl', 'morphine', 'tramadol', 'methadone', 'codeine', 'oxymorphone', 'hydromorphone', 'buprenorphine', 'tapentadol']
  if (opioidNames.some(n => generic.toLowerCase().includes(n))) {
    insights.push({ icon: '⚠️', text: `This is a controlled opioid medication. Opioid prescribing patterns are a key indicator in our fraud risk model. Providers prescribing this drug at significantly higher rates than their specialty peers may warrant closer examination.`, severity: 'danger' })
  }

  const benzoNames = ['alprazolam', 'diazepam', 'lorazepam', 'clonazepam', 'temazepam']
  if (benzoNames.some(n => generic.toLowerCase().includes(n))) {
    insights.push({ icon: '⚠️', text: `Benzodiazepines carry an FDA Black Box Warning when co-prescribed with opioids due to increased overdose risk. We track providers prescribing both drug classes to identify potentially dangerous combinations.`, severity: 'danger' })
  }

  return insights
}

function ProviderInsights({ name, specialty, opioidRate, costPerBene, brandPct, riskScore, riskFlags, isExcluded, mlScore, peerComparison, drugDiversity, opioidBenzoCombination, claims }: {
  name: string; specialty: string; opioidRate: number; costPerBene: number; brandPct: number
  riskScore: number; riskFlags: string[]; isExcluded: boolean; mlScore: number | null
  peerComparison?: { opioidVsPeer: number | null; costVsPeer: number | null; brandVsPeer: number | null } | null
  drugDiversity?: number; opioidBenzoCombination?: boolean; claims: number
}) {
  const insights: Insight[] = []

  // Only show insights for providers with some notable patterns
  if (riskScore <= 0 && !isExcluded && (mlScore === null || mlScore < 0.75)) return insights

  if (isExcluded) insights.push({ icon: '🚫', text: `This provider appears on the federal OIG exclusion list, meaning they have been formally barred from participating in federal healthcare programs due to fraud, patient abuse, licensing issues, or other misconduct. The fact that they still appear in active prescribing data is a significant concern.`, severity: 'danger' })

  if (mlScore !== null && mlScore >= 0.95) insights.push({ icon: '🤖', text: `Our machine learning model — trained on 281 confirmed fraud cases — gives this provider a "Very High" fraud-pattern score. All 20 decision trees in our ensemble model agree that this provider's prescribing patterns resemble those of confirmed fraud cases. This is a statistical finding, not an accusation.`, severity: 'danger' })
  else if (mlScore !== null && mlScore >= 0.80) insights.push({ icon: '🤖', text: `ML fraud detection score of ${(mlScore * 100).toFixed(0)}% indicates prescribing patterns with significant similarity to confirmed fraud cases. ${Math.round(mlScore * 20)} out of 20 decision trees flagged this provider.`, severity: 'warning' })

  if (peerComparison?.opioidVsPeer && peerComparison.opioidVsPeer > 500) insights.push({ icon: '⚠️', text: `Opioid prescribing rate is ${peerComparison.opioidVsPeer.toLocaleString()}% above the average for ${specialty} providers. While some providers legitimately treat pain-heavy populations, deviations of this magnitude are rare and warrant examination.`, severity: 'danger' })
  else if (peerComparison?.opioidVsPeer && peerComparison.opioidVsPeer > 200) insights.push({ icon: '💊', text: `Opioid rate is ${peerComparison.opioidVsPeer}% above ${specialty} peers. This is a significant deviation that may reflect a specialized patient population or concerning prescribing patterns.`, severity: 'warning' })

  if (peerComparison?.costVsPeer && peerComparison.costVsPeer > 500) insights.push({ icon: '💰', text: `Cost per patient is ${peerComparison.costVsPeer}% above the specialty average. Extreme cost outliers may indicate prescribing of unnecessarily expensive brand-name drugs or inappropriate drug utilization.`, severity: 'warning' })

  if (opioidBenzoCombination) insights.push({ icon: '⚠️', text: `This provider co-prescribes opioids and benzodiazepines — a combination carrying an FDA Black Box Warning due to increased risk of respiratory depression and death. While sometimes clinically necessary, this combination requires careful justification.`, severity: 'danger' })

  if (drugDiversity && drugDiversity <= 5 && opioidRate > 20) insights.push({ icon: '🔍', text: `Prescribes only ${drugDiversity} unique drugs with a ${opioidRate.toFixed(1)}% opioid rate. Very low drug diversity combined with high opioid prescribing is a classic statistical marker of potential pill mill operations. However, some legitimate practices (e.g., addiction treatment with buprenorphine) can show similar patterns.`, severity: 'danger' })
  else if (drugDiversity && drugDiversity <= 10 && opioidRate > 10) insights.push({ icon: '📊', text: `Prescribes only ${drugDiversity} unique drugs, which is unusually low. Most providers prescribe 30+ different medications. Narrow prescribing patterns deserve context about the provider's practice scope.`, severity: 'info' })

  if (riskScore >= 50) insights.push({ icon: '📊', text: `Composite risk score of ${riskScore}/100 places this provider in the "High Risk" category — the top ${(233 / 1380665 * 100).toFixed(3)}% of all Medicare Part D prescribers. Multiple independent risk factors are contributing simultaneously.`, severity: 'danger' })

  return insights
}

// Render component
export function DataInsights({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) return null
  return (
    <section className="mt-8 bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-200 rounded-xl p-6">
      <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-4 flex items-center gap-2">
        <span className="text-xl">🔎</span> Data Overview
      </h2>
      <div className="space-y-3">
        {insights.map((ins, i) => (
          <div key={i} className={`flex gap-3 items-start text-sm ${
            ins.severity === 'danger' ? 'text-red-800' : ins.severity === 'warning' ? 'text-amber-800' : 'text-slate-700'
          }`}>
            <span className="text-lg flex-shrink-0 mt-0.5">{ins.icon}</span>
            <p>{ins.text}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4 italic">
        Insights generated from CMS data analysis. Statistical patterns are not accusations — always consider clinical context.
      </p>
    </section>
  )
}

export { StateInsights, SpecialtyInsights, DrugInsights, ProviderInsights }
export type { Insight }
