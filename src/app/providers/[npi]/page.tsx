import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import { fmtMoney, fmt, riskBadge, riskColor } from '@/lib/utils'
import fs from 'fs'
import path from 'path'

type Provider = {
  npi: string; name: string; credentials: string; entityCode: string;
  city: string; state: string; zip5: string; specialty: string;
  claims: number; fills30: number; cost: number; daySupply: number; benes: number;
  costPerBene: number; costPerClaim: number;
  brandClaims: number; brandCost: number; genericClaims: number; genericCost: number; brandPct: number;
  opioidClaims: number; opioidCost: number; opioidBenes: number; opioidRate: number;
  opioidLAClaims: number; opioidLARate: number;
  antibioticClaims: number; antipsychGE65Claims: number;
  avgAge: number; femalePct: number | null; avgRiskScore: number;
  riskScore: number; riskFlags: string[]; riskLevel: string;
  isExcluded: boolean; exclusionInfo: { type: string; date: string; state: string } | null;
  topDrugs?: { drug: string; brand: string; claims: number; cost: number }[];
  zScores?: { opioid: number; cost: number; brand: number; claims: number; opioidLA: number };
  anomalyScore?: number;
  peerComparison?: { opioidVsPeer: number | null; costVsPeer: number | null; brandVsPeer: number | null };
  specialtyAvg?: { opioidRate: number; costPerBene: number; brandPct: number; providers: number };
  drugDiversity?: number;
  opioidBenzoCombination?: boolean;
  iraDrugCost?: number;
  glp1Cost?: number;
  claimsPerBene?: number;
  riskComponents?: Record<string, number>;
}

const FLAG_LABELS: Record<string, string> = {
  extreme_opioid: 'Extreme opioid prescribing rate',
  very_high_opioid: 'Very high opioid prescribing rate',
  high_opioid: 'High opioid prescribing rate',
  high_la_opioid: 'High long-acting opioid rate',
  elevated_la_opioid: 'Elevated long-acting opioid rate',
  extreme_cost: 'Extreme cost per beneficiary',
  high_cost: 'High cost per beneficiary',
  extreme_brand: 'Extreme brand-name prescribing',
  high_brand: 'High brand-name prescribing',
  high_antipsych_elderly: 'High antipsychotic prescribing (65+)',
  elevated_antipsych_elderly: 'Elevated antipsychotic prescribing (65+)',
  leie_excluded: 'OIG Excluded Provider',
  high_volume_opioid: 'High volume + high opioid combo',
}

export async function generateMetadata({ params }: { params: Promise<{ npi: string }> }): Promise<Metadata> {
  const { npi } = await params
  const filePath = path.join(process.cwd(), 'public', 'data', 'providers', `${npi}.json`)
  if (!fs.existsSync(filePath)) return { title: 'Provider Not Found' }
  const p: Provider = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  return {
    title: `${p.name}${p.credentials ? ', ' + p.credentials : ''} — Medicare Part D Prescribing Profile`,
    description: `${p.name} in ${p.city}, ${p.state} prescribed ${fmt(p.claims)} Medicare Part D claims totaling ${fmtMoney(p.cost)}. ${p.opioidRate > 0 ? `Opioid rate: ${p.opioidRate.toFixed(1)}%.` : ''} Specialty: ${p.specialty}.`,
    alternates: { canonical: `https://www.openprescriber.org/providers/${npi}` },
  }
}

export const dynamicParams = true

export default async function ProviderPage({ params }: { params: Promise<{ npi: string }> }) {
  const { npi } = await params
  const filePath = path.join(process.cwd(), 'public', 'data', 'providers', `${npi}.json`)
  if (!fs.existsSync(filePath)) notFound()
  const p: Provider = JSON.parse(fs.readFileSync(filePath, 'utf8'))

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Providers', href: '/providers' }, { label: p.name }]} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-heading)]">
            {p.name}{p.credentials && <span className="text-gray-400 ml-2 text-xl">{p.credentials}</span>}
          </h1>
          <p className="text-gray-600 mt-1">{p.specialty} · {p.city}, {p.state} {p.zip5}</p>
          <p className="text-xs text-gray-400 mt-1">NPI: {p.npi}</p>
        </div>
        {p.riskScore > 0 && (
          <div className={`flex-shrink-0 rounded-xl p-3 border text-center ${riskColor(p.riskLevel)}`}>
            <p className="text-2xl font-bold">{p.riskScore}</p>
            <p className="text-xs font-medium">{riskBadge(p.riskLevel)}</p>
          </div>
        )}
      </div>

      {/* Excluded Banner */}
      {p.isExcluded && (
        <div className="mt-4 bg-red-600 text-white rounded-lg p-4">
          <p className="font-bold">🚫 This provider appears on the OIG List of Excluded Individuals/Entities (LEIE)</p>
          {p.exclusionInfo && (
            <p className="text-sm mt-1 text-red-100">
              Exclusion type: {p.exclusionInfo.type} · Date: {p.exclusionInfo.date} · State: {p.exclusionInfo.state}
            </p>
          )}
        </div>
      )}

      {/* Risk Flags */}
      {p.riskFlags.length > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-red-800 mb-2">Risk Flags</h3>
          <div className="flex flex-wrap gap-2">
            {p.riskFlags.map(f => (
              <span key={f} className="text-xs bg-white text-red-700 px-2 py-1 rounded-full border border-red-200">{FLAG_LABELS[f] || f}</span>
            ))}
          </div>
          <p className="text-xs text-red-600 mt-2">Risk indicators are statistical patterns, not allegations. <Link href="/methodology" className="underline">Learn more</Link></p>
        </div>
      )}

      {/* Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Total Claims', value: fmt(p.claims) },
          { label: 'Drug Cost', value: fmtMoney(p.cost) },
          { label: 'Beneficiaries', value: fmt(p.benes) },
          { label: 'Cost/Patient', value: fmtMoney(p.costPerBene) },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-4 border text-center">
            <p className="text-xl font-bold text-primary">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Risk Score Breakdown */}
      {p.riskComponents && p.riskScore > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-3">Risk Score Breakdown <span className="text-sm font-normal text-gray-500">{p.riskScore}/100</span></h2>
          <div className="bg-white rounded-xl shadow-sm p-5 border">
            {/* Score bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                <div className={`h-full rounded-full transition-all ${p.riskScore >= 50 ? 'bg-red-500' : p.riskScore >= 30 ? 'bg-orange-500' : p.riskScore >= 15 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, p.riskScore)}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Low (0)</span><span>Moderate (15)</span><span>Elevated (30)</span><span>High (50+)</span>
              </div>
            </div>
            {/* Component breakdown */}
            <div className="space-y-2">
              {Object.entries(p.riskComponents).filter(([, v]) => (v as number) > 0).sort((a, b) => (b[1] as number) - (a[1] as number)).map(([key, pts]) => {
                const labels: Record<string, string> = {
                  opioidPeer: 'Opioid rate vs specialty peers',
                  opioidPop: 'Opioid rate (national percentile)',
                  costOutlier: 'Cost per patient outlier',
                  brandPref: 'Brand-name preference',
                  opioidLA: 'Long-acting opioid rate',
                  antipsych: 'Elderly antipsychotic prescribing',
                  drugCombo: 'Opioid + benzodiazepine combo',
                  leie: 'OIG excluded provider',
                  lowDiversity: 'Low drug diversity',
                  frequentFills: 'High fills per patient',
                };
                return (
                  <div key={key} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">{labels[key] || key}</span>
                        <span className="font-mono font-semibold text-gray-900">+{pts as number}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                        <div className="h-full bg-red-400 rounded-full" style={{ width: `${Math.min(100, (pts as number) / 25 * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-3">Score components are additive. <Link href="/methodology" className="text-primary hover:underline">Read full methodology</Link></p>
          </div>
        </section>
      )}

      {/* Peer Comparison */}
      {p.peerComparison && p.specialtyAvg && (
        <section className="mt-8">
          <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-3">Peer Comparison <span className="text-sm font-normal text-gray-500">vs. {fmt(p.specialtyAvg.providers)} {p.specialty} providers</span></h2>
          <div className="bg-white rounded-xl shadow-sm p-5 border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {p.peerComparison.opioidVsPeer != null && p.peerComparison.opioidVsPeer !== 0 && (
                <div className="text-center">
                  <p className={`text-2xl font-bold ${p.peerComparison.opioidVsPeer > 100 ? 'text-red-600' : p.peerComparison.opioidVsPeer > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {p.peerComparison.opioidVsPeer > 0 ? '+' : ''}{p.peerComparison.opioidVsPeer}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Opioid rate vs peers</p>
                  <p className="text-xs text-gray-400">{p.opioidRate.toFixed(1)}% vs {p.specialtyAvg.opioidRate.toFixed(1)}% avg</p>
                </div>
              )}
              {p.peerComparison.costVsPeer != null && (
                <div className="text-center">
                  <p className={`text-2xl font-bold ${p.peerComparison.costVsPeer > 200 ? 'text-red-600' : p.peerComparison.costVsPeer > 50 ? 'text-orange-600' : 'text-gray-700'}`}>
                    {p.peerComparison.costVsPeer > 0 ? '+' : ''}{p.peerComparison.costVsPeer}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Cost per patient vs peers</p>
                  <p className="text-xs text-gray-400">{fmtMoney(p.costPerBene)} vs {fmtMoney(p.specialtyAvg.costPerBene)} avg</p>
                </div>
              )}
              {p.peerComparison.brandVsPeer != null && p.peerComparison.brandVsPeer !== 0 && (
                <div className="text-center">
                  <p className={`text-2xl font-bold ${p.peerComparison.brandVsPeer > 200 ? 'text-red-600' : p.peerComparison.brandVsPeer > 50 ? 'text-orange-600' : 'text-gray-700'}`}>
                    {p.peerComparison.brandVsPeer > 0 ? '+' : ''}{p.peerComparison.brandVsPeer}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Brand preference vs peers</p>
                  <p className="text-xs text-gray-400">{p.brandPct.toFixed(1)}% vs {p.specialtyAvg.brandPct.toFixed(1)}% avg</p>
                </div>
              )}
            </div>
            {p.zScores && (Math.max(p.zScores.opioid, p.zScores.cost, p.zScores.brand) > 3) && (
              <p className="text-xs text-red-600 mt-3 bg-red-50 rounded p-2">
                ⚠️ This provider has metrics more than 3 standard deviations above their specialty average in one or more categories.
              </p>
            )}
          </div>
        </section>
      )}

      {/* Dangerous Drug Combination Warning */}
      {p.opioidBenzoCombination && (
        <div className="mt-6 bg-red-50 border border-red-300 rounded-lg p-4">
          <p className="text-sm font-bold text-red-800">⚠️ Opioid + Benzodiazepine Co-Prescriber</p>
          <p className="text-xs text-red-700 mt-1">This provider prescribes both opioids and benzodiazepines. The FDA has issued a <a href="https://www.fda.gov/drugs/drug-safety-and-availability/fda-drug-safety-communication-fda-warns-about-serious-risks-and-death-when-combining-opioid-pain-or" target="_blank" rel="noopener noreferrer" className="underline">Black Box Warning</a> about the life-threatening risks of concurrent use.</p>
        </div>
      )}

      {/* Opioid Section */}
      {p.opioidRate > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-3">Opioid Prescribing</h2>
          <div className="bg-white rounded-xl shadow-sm p-5 border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className={`text-2xl font-bold ${p.opioidRate > 20 ? 'text-red-600' : p.opioidRate > 10 ? 'text-orange-600' : 'text-gray-900'}`}>{p.opioidRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">Opioid Rate</p>
              </div>
              <div>
                <p className="text-xl font-bold">{fmt(p.opioidClaims)}</p>
                <p className="text-xs text-gray-500">Opioid Claims</p>
              </div>
              <div>
                <p className="text-xl font-bold">{fmtMoney(p.opioidCost)}</p>
                <p className="text-xs text-gray-500">Opioid Cost</p>
              </div>
              <div>
                <p className="text-xl font-bold">{p.opioidLARate > 0 ? p.opioidLARate.toFixed(1) + '%' : '—'}</p>
                <p className="text-xs text-gray-500">Long-Acting Rate</p>
              </div>
            </div>
            {p.opioidRate > 20 && (
              <p className="text-sm text-red-600 mt-3 bg-red-50 rounded p-2">
                This provider&apos;s opioid prescribing rate of {p.opioidRate.toFixed(1)}% is above the 20% threshold that CMS considers elevated.
              </p>
            )}
          </div>
        </section>
      )}

      {/* Brand vs Generic */}
      <section className="mt-8">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-3">Brand vs Generic</h2>
        <div className="bg-white rounded-xl shadow-sm p-5 border">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${100 - p.brandPct}%` }} />
            </div>
            <span className="text-sm font-mono">{(100 - p.brandPct).toFixed(0)}% generic</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Brand: {fmt(p.brandClaims)} claims · {fmtMoney(p.brandCost)}</p>
            </div>
            <div>
              <p className="font-semibold">Generic: {fmt(p.genericClaims)} claims · {fmtMoney(p.genericCost)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Prescribed Drugs */}
      {p.topDrugs && p.topDrugs.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-3">Top Prescribed Drugs</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Drug (Generic)</th>
                  <th className="px-4 py-2 text-left font-semibold hidden md:table-cell">Brand</th>
                  <th className="px-4 py-2 text-right font-semibold">Claims</th>
                  <th className="px-4 py-2 text-right font-semibold">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {p.topDrugs.map((d, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{d.drug}</td>
                    <td className="px-4 py-2 text-gray-500 hidden md:table-cell">{d.brand || '—'}</td>
                    <td className="px-4 py-2 text-right font-mono">{fmt(d.claims)}</td>
                    <td className="px-4 py-2 text-right font-mono">{fmtMoney(d.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Drug Diversity & Special Categories */}
      {(p.drugDiversity || p.iraDrugCost || p.glp1Cost) && (
        <section className="mt-8">
          <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-3">Prescribing Profile</h2>
          <div className="bg-white rounded-xl shadow-sm p-5 border grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {p.drugDiversity && (
              <div>
                <p className="text-xl font-bold">{p.drugDiversity}</p>
                <p className="text-xs text-gray-500">Unique Drugs</p>
              </div>
            )}
            {p.iraDrugCost != null && p.iraDrugCost > 0 && (
              <div>
                <p className="text-xl font-bold text-blue-700">{fmtMoney(p.iraDrugCost)}</p>
                <p className="text-xs text-gray-500"><Link href="/ira-negotiation" className="text-primary hover:underline">IRA Negotiated Drugs</Link></p>
              </div>
            )}
            {p.glp1Cost != null && p.glp1Cost > 0 && (
              <div>
                <p className="text-xl font-bold text-purple-700">{fmtMoney(p.glp1Cost)}</p>
                <p className="text-xs text-gray-500"><Link href="/glp1-tracker" className="text-primary hover:underline">GLP-1 Drugs</Link></p>
              </div>
            )}
            {p.anomalyScore != null && p.anomalyScore > 0 && (
              <div>
                <p className={`text-xl font-bold ${p.anomalyScore > 50 ? 'text-red-600' : p.anomalyScore > 20 ? 'text-orange-600' : 'text-gray-700'}`}>{p.anomalyScore.toFixed(1)}</p>
                <p className="text-xs text-gray-500">Anomaly Score</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Patient Demographics */}
      <section className="mt-8">
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-3">Patient Profile</h2>
        <div className="bg-white rounded-xl shadow-sm p-5 border grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-bold">{p.avgAge > 0 ? p.avgAge.toFixed(0) : '—'}</p>
            <p className="text-xs text-gray-500">Avg Age</p>
          </div>
          <div>
            <p className="text-xl font-bold">{p.femalePct != null ? p.femalePct.toFixed(0) + '%' : '—'}</p>
            <p className="text-xs text-gray-500">Female</p>
          </div>
          <div>
            <p className="text-xl font-bold">{p.avgRiskScore > 0 ? p.avgRiskScore.toFixed(2) : '—'}</p>
            <p className="text-xs text-gray-500">Avg Risk Score</p>
          </div>
        </div>
      </section>

      <p className="text-xs text-gray-400 mt-8">
        Data from CMS Medicare Part D Prescriber Public Use File, 2023. <Link href="/methodology" className="text-primary hover:underline">Methodology</Link> · <Link href="/about" className="text-primary hover:underline">About</Link>
      </p>
    </div>
  )
}
