'use client'
import { useState } from 'react'
import Link from 'next/link'

type StateData = { state: string; brandCost: number; genericCost: number; brandPct: number; providers: number; [key: string]: unknown }

const STATE_NAMES: Record<string, string> = {AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',DC:'District of Columbia',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',PR:'Puerto Rico',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',VI:'Virgin Islands',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming'}

function fmtMoney(n: number): string {
  if (Math.abs(n) >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B'
  if (Math.abs(n) >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M'
  if (Math.abs(n) >= 1e4) return '$' + (n / 1e3).toFixed(0) + 'K'
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export default function SavingsCalculatorClient({ states }: { states: StateData[] }) {
  const [selected, setSelected] = useState('')

  const nationalBrandCost = 185_400_000_000
  const nationalGenericCost = 39_400_000_000
  const nationalBrandPct = 13.4
  const estimatedSavingsRate = 0.73 // generics cost ~73% less on average
  const nationalSavings = nationalBrandCost * estimatedSavingsRate

  const stateData = states.find(s => s.state === selected)
  const stateSavings = stateData ? stateData.brandCost * estimatedSavingsRate : 0

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
          <p className="text-2xl font-bold text-blue-700">{fmtMoney(nationalBrandCost)}</p>
          <p className="text-xs text-blue-600">Brand Drug Spending</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
          <p className="text-2xl font-bold text-blue-700">{fmtMoney(nationalGenericCost)}</p>
          <p className="text-xs text-blue-600">Generic Drug Spending</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
          <p className="text-2xl font-bold text-blue-700">{nationalBrandPct}%</p>
          <p className="text-xs text-blue-600">Brand Rx Rate</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
          <p className="text-2xl font-bold text-green-700">{fmtMoney(nationalSavings)}</p>
          <p className="text-xs text-green-600">Potential Savings</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 my-8">
        <h3 className="font-bold text-lg mb-4">🔍 State-Level Savings Explorer</h3>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select a state to see potential generic savings:</label>
        <select
          className="w-full md:w-64 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="">— Choose a state —</option>
          {states.sort((a, b) => a.state.localeCompare(b.state)).map(s => (
            <option key={s.state} value={s.state}>{STATE_NAMES[s.state] || s.state}</option>
          ))}
        </select>

        {stateData && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold">{fmtMoney(stateData.brandCost)}</p>
              <p className="text-xs text-gray-500">Brand Spending</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold">{fmtMoney(stateData.genericCost)}</p>
              <p className="text-xs text-gray-500">Generic Spending</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold">{stateData.brandPct.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">Brand Rx Rate</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
              <p className="text-lg font-bold text-green-700">{fmtMoney(stateSavings)}</p>
              <p className="text-xs text-green-600">Potential Savings</p>
            </div>
          </div>
        )}

        {stateData && (
          <p className="text-sm text-gray-500 mt-4">
            If all brand-name prescriptions in <strong>{stateData.state}</strong> were switched to generic equivalents (where available), Medicare could save an estimated <strong>{fmtMoney(stateSavings)}</strong>. <Link href={`/states/${stateData.state.toLowerCase()}`} className="text-blue-600 hover:underline">View {stateData.state} prescribing data →</Link>
          </p>
        )}
      </div>
    </div>
  )
}
