// @ts-nocheck
'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { fmtMoney, fmt } from '@/lib/utils'

const COLORS = ['#1e40af', '#0ea5e9', '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

export function SpecialtyDrugChart({ drugs }: { drugs: { drug: string; claims: number; cost: number }[] }) {
  if (!drugs || drugs.length === 0) return null
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={drugs.slice(0, 10)} layout="vertical" margin={{ left: 80, right: 10 }}>
          <XAxis type="number" tickFormatter={v => fmtMoney(v)} />
          <YAxis type="category" dataKey="drug" width={80} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v: number) => fmtMoney(v)} />
          <Bar dataKey="cost" fill="#1e40af" radius={[0, 4, 4, 0]} name="Drug Cost" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function RiskPie({ data }: { data: { level: string; count: number }[] }) {
  if (!data || data.length === 0) return null
  const colors: Record<string, string> = { high: '#dc2626', elevated: '#f59e0b', moderate: '#6366f1', low: '#10b981' }
  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="level" cx="50%" cy="50%" outerRadius={70} label>
            {data.map((d, i) => <Cell key={i} fill={colors[d.level] || COLORS[i]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
