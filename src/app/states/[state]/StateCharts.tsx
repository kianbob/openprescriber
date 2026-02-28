// @ts-nocheck
'use client'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { fmtMoney, fmt } from '@/lib/utils'

export function StateCostTrend({ data }: { data: { year: number; cost: number; providers: number }[] }) {
  if (!data || data.length < 2) return null
  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={v => '$' + (v / 1e9).toFixed(1) + 'B'} />
          <Tooltip formatter={(v: number) => fmtMoney(v)} />
          <Area type="monotone" dataKey="cost" stroke="#1e40af" fill="#1e40af" fillOpacity={0.15} strokeWidth={2} name="Drug Cost" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function StateOpioidTrend({ data }: { data: { year: number; opioidProv: number; avgOpioidRate: number }[] }) {
  if (!data || data.length < 2) return null
  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis yAxisId="left" tickFormatter={v => fmt(v)} />
          <YAxis yAxisId="right" orientation="right" unit="%" />
          <Tooltip />
          <Line yAxisId="left" type="monotone" dataKey="opioidProv" stroke="#dc2626" strokeWidth={2} name="Opioid Prescribers" dot={{ r: 3 }} />
          <Line yAxisId="right" type="monotone" dataKey="avgOpioidRate" stroke="#f59e0b" strokeWidth={2} name="Avg Rate %" dot={{ r: 3 }} />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
