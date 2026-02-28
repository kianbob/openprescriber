// @ts-nocheck
'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { fmtMoney, fmt } from '@/lib/utils'

const COLORS = ['#1e40af', '#0ea5e9', '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16']

export function StatesCostChart({ data }: { data: { state: string; cost: number }[] }) {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data.slice(0, 15)} layout="vertical" margin={{ left: 30, right: 10 }}>
          <XAxis type="number" tickFormatter={v => '$' + (v / 1e9).toFixed(1) + 'B'} />
          <YAxis type="category" dataKey="state" width={30} />
          <Tooltip formatter={v => fmtMoney(v as number)} />
          <Bar dataKey="cost" fill="#1e40af" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SpecialtyCostChart({ data }: { data: { specialty: string; cost: number }[] }) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data.slice(0, 10)} dataKey="cost" nameKey="specialty" cx="50%" cy="50%" outerRadius={100} label={({ specialty, percent }) => `${specialty.slice(0, 15)}… ${(percent * 100).toFixed(0)}%`}>
            {data.slice(0, 10).map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Pie>
          <Tooltip formatter={v => fmtMoney(v as number)} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function OpioidStateChart({ data }: { data: { state: string; avgOpioidRate: number }[] }) {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data.slice(0, 20)} layout="vertical" margin={{ left: 30, right: 10 }}>
          <XAxis type="number" unit="%" />
          <YAxis type="category" dataKey="state" width={30} />
          <Tooltip formatter={v => (v as number).toFixed(1) + '%'} />
          <Bar dataKey="avgOpioidRate" fill="#dc2626" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function RiskBreakdownChart({ data }: { data: { level: string; count: number }[] }) {
  const colors = { High: '#dc2626', Elevated: '#f59e0b', Moderate: '#6366f1', Low: '#10b981' }
  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="level" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((d, i) => <Cell key={i} fill={colors[d.level as keyof typeof colors] || COLORS[i]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
