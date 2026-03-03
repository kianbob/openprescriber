'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts'

type YearData = {
  year: number; cost: number; claims: number; providers: number;
  opioidProv: number; highOpioid: number; brandCost: number; genericCost: number;
  brandPct: number; opioidPct: number;
}

export default function TrendsCharts({ data }: { data: YearData[] }) {
  const costData = data.map(d => ({
    year: d.year,
    'Total Cost ($B)': +(d.cost / 1e9).toFixed(1),
    'Brand Cost ($B)': +(d.brandCost / 1e9).toFixed(1),
    'Generic Cost ($B)': +(d.genericCost / 1e9).toFixed(1),
  }))

  const opioidData = data.map(d => ({
    year: d.year,
    'Opioid Prescribers': d.opioidProv,
    'High-Rate (>20%)': d.highOpioid,
  }))

  return (
    <div className="space-y-10 mt-8">
      <div>
        <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-4">Drug Cost Trends</h2>
        <div className="bg-white rounded-xl border p-4" style={{ height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(v) => `$${v}B`} />
              <Tooltip formatter={(v) => `$${v}B`} />
              <Legend />
              <Line type="monotone" dataKey="Total Cost ($B)" stroke="#1e40af" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Brand Cost ($B)" stroke="#dc2626" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Generic Cost ($B)" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-4">Opioid Prescribing Trends</h2>
        <div className="bg-white rounded-xl border p-4" style={{ height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={opioidData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => typeof v === 'number' ? v.toLocaleString() : v} />
              <Legend />
              <Bar dataKey="Opioid Prescribers" fill="#f59e0b" />
              <Bar dataKey="High-Rate (>20%)" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
