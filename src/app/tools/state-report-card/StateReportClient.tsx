// @ts-nocheck
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fmtMoney, fmt } from '@/lib/utils'

const STATE_NAMES: Record<string, string> = {AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',DC:'District of Columbia',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',PR:'Puerto Rico',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming'}

type StateData = { state: string; providers: number; claims: number; cost: number; benes: number; opioidProv: number; highOpioid: number; avgOpioidRate: number; costPerBene: number }

export default function StateReportClient() {
  const [states, setStates] = useState<StateData[]>([])
  const [selected, setSelected] = useState('')

  useEffect(() => {
    fetch('/data/states.json').then(r => r.json()).then(setStates)
  }, [])

  const realStates = states.filter(s => STATE_NAMES[s.state]).sort((a, b) => (STATE_NAMES[a.state] || '').localeCompare(STATE_NAMES[b.state] || ''))
  const s = realStates.find(st => st.state === selected)
  const allSorted = {
    byCost: [...realStates].sort((a, b) => b.cost - a.cost),
    byOpioid: [...realStates].sort((a, b) => b.avgOpioidRate - a.avgOpioidRate),
    byCostPerBene: [...realStates].sort((a, b) => b.costPerBene - a.costPerBene),
  }

  const getRank = (list: StateData[], abbr: string) => list.findIndex(x => x.state === abbr) + 1
  const getGrade = (opioidRank: number, costRank: number, total: number) => {
    const avg = (opioidRank + costRank) / 2
    const pct = avg / total
    if (pct <= 0.2) return { grade: 'A', color: 'text-green-600 bg-green-50 border-green-200' }
    if (pct <= 0.4) return { grade: 'B', color: 'text-blue-600 bg-blue-50 border-blue-200' }
    if (pct <= 0.6) return { grade: 'C', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' }
    if (pct <= 0.8) return { grade: 'D', color: 'text-orange-600 bg-orange-50 border-orange-200' }
    return { grade: 'F', color: 'text-red-600 bg-red-50 border-red-200' }
  }

  return (
    <div>
      <select
        value={selected}
        onChange={e => setSelected(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
      >
        <option value="">Select a state...</option>
        {realStates.map(st => (
          <option key={st.state} value={st.state}>{STATE_NAMES[st.state]} ({st.state})</option>
        ))}
      </select>

      {s && (() => {
        const costRank = getRank(allSorted.byCost, s.state)
        const opioidRank = getRank(allSorted.byOpioid, s.state)
        const costPerBeneRank = getRank(allSorted.byCostPerBene, s.state)
        const total = realStates.length
        // For grade: lower opioid rank (=less opioid) and lower cost/bene rank is better
        // But our ranks are "highest first", so invert: total - rank + 1 = position from bottom
        const invertedOpioidRank = total - opioidRank + 1
        const invertedCostRank = total - costPerBeneRank + 1
        const { grade, color } = getGrade(invertedOpioidRank, invertedCostRank, total)

        return (
          <div className="mt-6 space-y-6">
            {/* Grade Card */}
            <div className="flex items-center gap-6">
              <div className={`w-24 h-24 rounded-2xl border-2 flex items-center justify-center ${color}`}>
                <span className="text-5xl font-bold">{grade}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{STATE_NAMES[s.state]}</h2>
                <p className="text-gray-600">Medicare Part D Report Card</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl shadow-sm p-4 border text-center">
                <p className="text-xl font-bold text-primary">{fmt(s.providers)}</p>
                <p className="text-xs text-gray-500">Prescribers</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border text-center">
                <p className="text-xl font-bold text-primary">{fmtMoney(s.cost)}</p>
                <p className="text-xs text-gray-500">Drug Costs</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border text-center">
                <p className={`text-xl font-bold ${s.avgOpioidRate > 15 ? 'text-red-600' : 'text-gray-800'}`}>{s.avgOpioidRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">Avg Opioid Rate</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border text-center">
                <p className="text-xl font-bold text-primary">{fmtMoney(s.costPerBene)}</p>
                <p className="text-xs text-gray-500">Cost Per Patient</p>
              </div>
            </div>

            {/* Rankings */}
            <div className="bg-white rounded-xl shadow-sm p-5 border">
              <h3 className="font-bold mb-3">National Rankings (out of {total} states)</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">💰 Total Drug Spending</span>
                  <span className="font-mono font-bold">#{costRank}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">💊 Opioid Prescribing Rate</span>
                  <span className={`font-mono font-bold ${opioidRank <= 10 ? 'text-red-600' : ''}`}>#{opioidRank}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">💵 Cost Per Patient</span>
                  <span className={`font-mono font-bold ${costPerBeneRank <= 10 ? 'text-red-600' : ''}`}>#{costPerBeneRank}</span>
                </div>
              </div>
            </div>

            {/* Opioid Detail */}
            <div className="bg-white rounded-xl shadow-sm p-5 border">
              <h3 className="font-bold mb-3">Opioid Prescribing</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold">{fmt(s.opioidProv)}</p>
                  <p className="text-xs text-gray-500">Opioid Prescribers</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-red-600">{fmt(s.highOpioid)}</p>
                  <p className="text-xs text-gray-500">High Rate (&gt;20%)</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{(s.opioidProv / s.providers * 100).toFixed(0)}%</p>
                  <p className="text-xs text-gray-500">% Prescribing Opioids</p>
                </div>
              </div>
            </div>

            <Link href={`/states/${s.state.toLowerCase()}`} className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors">
              View Full {STATE_NAMES[s.state]} Profile →
            </Link>
          </div>
        )
      })()}
    </div>
  )
}
