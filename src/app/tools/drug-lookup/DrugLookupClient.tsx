// @ts-nocheck
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fmtMoney, fmt } from '@/lib/utils'

type Drug = { generic: string; brand: string; claims: number; cost: number; benes: number; providers: number; costPerClaim: number; fills: number }

export default function DrugLookupClient() {
  const [query, setQuery] = useState('')
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [results, setResults] = useState<Drug[]>([])

  useEffect(() => {
    fetch('/data/drugs-full.json').then(r => r.json()).then(setDrugs).catch(() => {
      fetch('/data/drugs.json').then(r => r.json()).then(setDrugs)
    })
  }, [])

  useEffect(() => {
    if (!query || query.length < 2 || drugs.length === 0) { setResults([]); return }
    const q = query.toLowerCase()
    setResults(drugs.filter(d =>
      d.brand?.toLowerCase().includes(q) ||
      d.generic?.toLowerCase().includes(q)
    ).slice(0, 50))
  }, [query, drugs])

  const totalCost = results.reduce((s, d) => s + d.cost, 0)

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search by drug name (e.g., Ozempic, Eliquis, metformin)..."
        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />

      {results.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">{results.length} results · Combined cost: {fmtMoney(totalCost)}</p>
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Brand</th>
                  <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Generic</th>
                  <th className="px-4 py-3 text-right font-semibold">Total Cost</th>
                  <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Claims</th>
                  <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">Patients</th>
                  <th className="px-4 py-3 text-right font-semibold">$/Claim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.map((d, i) => {
                  const slug = d.brand ? d.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : d.generic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                  return (
                    <tr key={i} className="hover:bg-blue-50">
                      <td className="px-4 py-2">
                        <Link href={`/drugs/${slug}`} className="font-medium text-primary hover:underline">{d.brand || '(Generic)'}</Link>
                      </td>
                      <td className="px-4 py-2 text-gray-600 hidden md:table-cell">{d.generic}</td>
                      <td className="px-4 py-2 text-right font-mono font-bold">{fmtMoney(d.cost)}</td>
                      <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(d.claims)}</td>
                      <td className="px-4 py-2 text-right font-mono hidden md:table-cell">{fmt(d.benes)}</td>
                      <td className="px-4 py-2 text-right font-mono">${d.costPerClaim?.toLocaleString() || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {query.length >= 2 && results.length === 0 && drugs.length > 0 && (
        <p className="mt-4 text-gray-500">No drugs matching &quot;{query}&quot;. Try a brand name (Eliquis) or generic name (apixaban).</p>
      )}

      {/* Quick links */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {['Eliquis', 'Ozempic', 'Jardiance', 'Xarelto', 'Humira', 'Trulicity', 'Revlimid', 'Mounjaro'].map(name => (
          <button key={name} onClick={() => setQuery(name)} className="bg-gray-50 border rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:border-primary/30 transition-colors">
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}
