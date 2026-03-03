// @ts-nocheck
'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { fmtMoney } from '@/lib/utils'

const COLORS = ['#1e40af', '#e5e7eb']

export function CostBreakdownPie({ drugCost, totalCost, drugName }: { drugCost: number; totalCost: number; drugName: string }) {
  const pct = ((drugCost / totalCost) * 100)
  const pctStr = pct < 1 ? pct.toFixed(2) : pct.toFixed(1)
  // For tiny percentages, show a stat card instead of invisible pie slice
  return (
    <div className="text-center">
      <div className="bg-blue-50 rounded-xl p-6 inline-block">
        <p className="text-4xl font-bold text-primary">{pctStr}%</p>
        <p className="text-sm text-gray-600 mt-1">of total Medicare Part D spending</p>
        <p className="text-xs text-gray-400 mt-1">{fmtMoney(drugCost)} of {fmtMoney(totalCost)}</p>
      </div>
      {pct >= 1 && (
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={[{ name: drugName, value: drugCost }, { name: 'All Other Drugs', value: totalCost - drugCost }]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45} label={false}>
                <Cell fill={COLORS[0]} />
                <Cell fill={COLORS[1]} />
              </Pie>
              <Tooltip formatter={v => fmtMoney(v as number)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export function ProviderDistributionBar({ topPrescribers, totalCost }: { topPrescribers: { name: string; cost: number }[]; totalCost: number }) {
  const top10 = topPrescribers.slice(0, 10)
  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={top10.map(p => ({ name: p.name.length > 20 ? p.name.slice(0, 18) + '…' : p.name, cost: p.cost }))} layout="vertical" margin={{ left: 10, right: 10 }}>
          <XAxis type="number" tickFormatter={v => fmtMoney(v as number)} />
          <YAxis type="category" dataKey="name" width={0} tick={false} />
          <Tooltip formatter={v => fmtMoney(v as number)} />
          <Bar dataKey="cost" fill="#0ea5e9" radius={[0, 4, 4, 0]} label={{ position: 'insideLeft', formatter: (v: any, entry: any) => '', fill: '#fff', fontSize: 11 }} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-500 mt-1 text-center">Top {top10.length} prescribers of {fmtMoney(totalCost)} total</p>
    </div>
  )
}
