import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import { fmtMoney, fmt } from '@/lib/utils'
import { loadData } from '@/lib/server-utils'
import { stateName } from '@/lib/state-names'

export const metadata: Metadata = {
  title: 'ML Fraud Detection — Machine Learning Identifies Suspicious Prescribers',
  description: 'A machine learning model trained on confirmed fraud cases identifies Medicare Part D prescribers with patterns consistent with fraud. Scores 1M+ providers.',
  alternates: { canonical: 'https://www.openprescriber.org/ml-fraud-detection' },
}

type Prediction = {
  npi: string; name: string; city: string; state: string; specialty: string;
  mlScore: number; claims: number; cost: number; opioidRate: number; brandPct: number; costPerBene: number;
}

type MLData = {
  model: { type: string; trees: number; features: number; fraudLabels: number; threshold: number };
  cv: { precision: number; recall: number; f1: number };
  recall: number; totalScored: number; totalFlagged: number;
  predictions: Prediction[];
}

export default function MLFraudPage() {
  const data = loadData('ml-predictions.json') as MLData
  const preds = data.predictions

  // Group by risk tier
  const tier1 = preds.filter(p => p.mlScore >= 0.95) // Very High
  const tier2 = preds.filter(p => p.mlScore >= 0.85 && p.mlScore < 0.95) // High
  const tier3 = preds.filter(p => p.mlScore >= 0.80 && p.mlScore < 0.85) // Elevated

  // Top specialties
  const bySpec: Record<string, number> = {}
  preds.forEach(p => { bySpec[p.specialty] = (bySpec[p.specialty] || 0) + 1 })
  const topSpecs = Object.entries(bySpec).sort((a, b) => b[1] - a[1]).slice(0, 8)

  // Top states
  const byState: Record<string, number> = {}
  preds.forEach(p => { if (p.state) byState[p.state] = (byState[p.state] || 0) + 1 })
  const topStates = Object.entries(byState).sort((a, b) => b[1] - a[1]).slice(0, 10)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'ML Fraud Detection' }]} />

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)]">
            🤖 ML Fraud Detection
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Machine learning model identifies Medicare prescribers with patterns consistent with confirmed fraud cases
          </p>
          <ShareButtons title="ML Fraud Detection — OpenPrescriber" />
        </div>
      </div>

      {/* Important Disclaimer */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-r-lg">
        <p className="text-amber-800 text-sm font-semibold mb-1">⚠️ Important Disclaimer</p>
        <p className="text-amber-700 text-sm">
          ML predictions are <strong>statistical indicators only, not accusations of fraud</strong>. These providers exhibit prescribing patterns similar to confirmed fraud cases, but there may be legitimate medical explanations. High-volume pain specialists, for example, may appear flagged due to medically appropriate opioid prescribing. Always consider clinical context.
        </p>
      </div>

      {/* Model Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 text-center border">
          <p className="text-2xl font-bold text-primary">{fmt(data.totalScored)}</p>
          <p className="text-xs text-gray-500">Providers Scored</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center border">
          <p className="text-2xl font-bold text-red-600">{fmt(data.totalFlagged)}</p>
          <p className="text-xs text-gray-500">ML Flagged (≥80%)</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center border">
          <p className="text-2xl font-bold text-green-600">{(data.recall * 100).toFixed(1)}%</p>
          <p className="text-xs text-gray-500">Known Fraud Recall</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center border">
          <p className="text-2xl font-bold text-blue-600">{(data.cv.precision * 100).toFixed(1)}%</p>
          <p className="text-xs text-gray-500">Model Precision</p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8 border">
        <h2 className="text-xl font-bold mb-3">How the ML Model Works</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Training Data</h3>
            <ul className="space-y-1">
              <li>• <strong>{data.model.fraudLabels} confirmed fraud cases</strong> from the OIG LEIE exclusion list cross-matched to active Medicare prescribers</li>
              <li>• <strong>{fmt(data.totalScored)} total providers</strong> with ≥50 claims in 2023</li>
              <li>• <strong>{data.model.features} prescribing features</strong> per provider including opioid rates, costs, brand preferences, specialty-adjusted z-scores, and drug combination patterns</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Model Performance</h3>
            <ul className="space-y-1">
              <li>• <strong>Precision: {(data.cv.precision * 100).toFixed(1)}%</strong> — {(data.cv.precision * 100).toFixed(0)}% of flagged providers match fraud patterns</li>
              <li>• <strong>Recall: {(data.cv.recall * 100).toFixed(1)}%</strong> — catches {(data.cv.recall * 100).toFixed(0)}% of known fraud cases</li>
              <li>• <strong>F1 Score: {data.cv.f1.toFixed(3)}</strong> — harmonic mean of precision and recall</li>
              <li>• 5-fold cross-validation on held-out data</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Model: {data.model.type} ensemble with {data.model.trees} trees. Trained with oversampled fraud cases and reservoir-sampled negatives. 
          See <Link href="/methodology" className="text-primary hover:underline">full methodology</Link>.
        </p>
      </div>

      {/* Risk Tiers */}
      <h2 className="text-xl font-bold mb-4">Risk Tiers</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-lg font-bold text-red-700">{fmt(tier1.length)} providers</p>
          <p className="text-sm text-red-600">Very High (≥95% ML confidence)</p>
          <p className="text-xs text-gray-500 mt-1">Strongest match to fraud patterns</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-lg font-bold text-orange-700">{fmt(tier2.length)} providers</p>
          <p className="text-sm text-orange-600">High (85-94% ML confidence)</p>
          <p className="text-xs text-gray-500 mt-1">Strong match to fraud patterns</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-lg font-bold text-yellow-700">{fmt(tier3.length)} providers</p>
          <p className="text-sm text-yellow-600">Elevated (80-84% ML confidence)</p>
          <p className="text-xs text-gray-500 mt-1">Notable pattern similarities</p>
        </div>
      </div>

      {/* Top Flagged Providers */}
      <h2 className="text-xl font-bold mb-4">Highest ML Fraud Scores</h2>
      <p className="text-sm text-gray-600 mb-3">
        Top 100 providers ranked by ML fraud probability. These providers were <strong>not</strong> in the LEIE exclusion list — they are new predictions.
      </p>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto border mb-8">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-3 py-3 text-left font-semibold">Provider</th>
              <th className="px-3 py-3 text-left font-semibold hidden md:table-cell">Specialty</th>
              <th className="px-3 py-3 text-left font-semibold hidden lg:table-cell">Location</th>
              <th className="px-3 py-3 text-right font-semibold">ML Score</th>
              <th className="px-3 py-3 text-right font-semibold hidden md:table-cell">Opioid %</th>
              <th className="px-3 py-3 text-right font-semibold hidden md:table-cell">Cost/Bene</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {preds.slice(0, 100).map((p, i) => (
              <tr key={p.npi} className="hover:bg-red-50/50">
                <td className="px-3 py-2">
                  <Link href={`/providers/${p.npi}`} className="text-primary font-medium hover:underline">{p.name || p.npi}</Link>
                </td>
                <td className="px-3 py-2 text-gray-600 hidden md:table-cell text-xs">{p.specialty}</td>
                <td className="px-3 py-2 text-gray-500 hidden lg:table-cell text-xs">{p.city}, {stateName(p.state)}</td>
                <td className="px-3 py-2 text-right">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                    p.mlScore >= 0.95 ? 'bg-red-100 text-red-700' :
                    p.mlScore >= 0.85 ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {p.mlScore >= 1 ? 'Very High' : `${(p.mlScore * 100).toFixed(0)}%`}
                  </span>
                </td>
                <td className="px-3 py-2 text-right font-mono text-xs hidden md:table-cell">
                  {p.opioidRate > 0 ? `${p.opioidRate}%` : '—'}
                </td>
                <td className="px-3 py-2 text-right font-mono text-xs hidden md:table-cell">{fmtMoney(p.costPerBene)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Geographic + Specialty Breakdown */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-bold mb-3">Top Flagged Specialties</h2>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            {topSpecs.map(([spec, count]) => (
              <div key={spec} className="flex justify-between py-2 border-b last:border-0">
                <span className="text-sm">{spec}</span>
                <span className="text-sm font-mono text-gray-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-3">Top Flagged States</h2>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            {topStates.map(([st, count]) => (
              <div key={st} className="flex justify-between py-2 border-b last:border-0">
                <span className="text-sm">{stateName(st) || st}</span>
                <span className="text-sm font-mono text-gray-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison with Rule-Based */}
      <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
        <h2 className="text-xl font-bold mb-3">ML vs. Rule-Based Scoring</h2>
        <p className="text-sm text-gray-700 mb-3">
          OpenPrescriber uses two complementary fraud detection approaches:
        </p>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-1">📋 Rule-Based (10-Component Score)</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• Hand-tuned thresholds and z-scores</li>
              <li>• Transparent and explainable</li>
              <li>• Good at catching extreme outliers</li>
              <li>• <Link href="/flagged" className="text-primary hover:underline">View flagged providers →</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-1">🤖 Machine Learning (This Page)</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• Trained on confirmed fraud cases</li>
              <li>• Finds non-obvious pattern combinations</li>
              <li>• Better at detecting subtle fraud</li>
              <li>• Identifies providers rules miss</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="bg-gray-50 rounded-xl p-6 border">
        <h2 className="text-lg font-bold mb-3">Related Resources</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/flagged" className="text-sm text-primary hover:underline">🔴 Rule-Based Flagged</Link>
          <Link href="/risk-explorer" className="text-sm text-primary hover:underline">🔍 Risk Explorer</Link>
          <Link href="/excluded" className="text-sm text-primary hover:underline">🚫 LEIE Excluded</Link>
          <Link href="/methodology" className="text-sm text-primary hover:underline">📋 Methodology</Link>
          <Link href="/analysis/fraud-risk-methodology" className="text-sm text-primary hover:underline">📊 Fraud Analysis</Link>
          <Link href="/opioids" className="text-sm text-primary hover:underline">💊 Opioid Data</Link>
          <Link href="/dangerous-combinations" className="text-sm text-primary hover:underline">⚠️ Drug Combos</Link>
          <Link href="/analysis/excluded-still-prescribing" className="text-sm text-primary hover:underline">📰 Excluded Prescribers</Link>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-8">
        Data from CMS Medicare Part D Prescriber Public Use File, 2023. Fraud labels from OIG LEIE. ML predictions are statistical indicators, not accusations.
      </p>
    </div>
  )
}
