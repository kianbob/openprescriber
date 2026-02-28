// @ts-nocheck
'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { fmtMoney } from '@/lib/utils'

const COLORS = ['#1e40af', '#e5e7eb']

export function CostBreakdownPie({ drugCost, totalCost, drugName }: { drugCost: number; totalCost: number; drugName: string }) {
  const pct = ((drugCost / totalCost) * 100).toFixed(2)
  const data = [
    { name: drugName, value: drugCost },
    { name: 'All Other Drugs', value: totalCost - drugCost },
  ]
  return (
    <div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45} label={false}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip formatter={v => fmtMoney(v as number)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center text-sm text-gray-600 mt-1">
        <span className="font-bold text-primary">{pct}%</span> of {fmtMoney(totalCost)} total Medicare Part D spending
      </p>
    </div>
  )
}

export function ProviderDistributionBar({ topPrescribers, totalCost }: { topPrescribers: { name: string; cost: number }[]; totalCost: number }) {
  const top5 = topPrescribers.slice(0, 5)
  const top5Cost = top5.reduce((s, p) => s + p.cost, 0)
  const data = [
    ...top5.map(p => ({ name: p.name.length > 18 ? p.name.slice(0, 18) + '...' : p.name, cost: p.cost })),
    { name: 'All Others', cost: totalCost - top5Cost },
  ]
  return (
    <div className="h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 10, right: 10 }}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={50} />
          <YAxis tickFormatter={v => '$' + (v / 1e6).toFixed(0) + 'M'} />
          <Tooltip formatter={v => fmtMoney(v as number)} />
          <Bar dataKey="cost" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
