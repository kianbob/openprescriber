export function fmtMoney(n: number | null | undefined): string {
  if (n == null) return 'N/A'
  if (Math.abs(n) >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B'
  if (Math.abs(n) >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M'
  if (Math.abs(n) >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K'
  return '$' + n.toFixed(0)
}

export function fmt(n: number | null | undefined): string {
  if (n == null) return 'N/A'
  return n.toLocaleString()
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function titleCase(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

export function riskColor(level: string): string {
  switch (level) {
    case 'high': return 'text-red-700 bg-red-50 border-red-200'
    case 'elevated': return 'text-orange-700 bg-orange-50 border-orange-200'
    case 'moderate': return 'text-yellow-700 bg-yellow-50 border-yellow-200'
    default: return 'text-green-700 bg-green-50 border-green-200'
  }
}

export function riskBadge(level: string): string {
  switch (level) {
    case 'high': return '🔴 High Risk'
    case 'elevated': return '🟠 Elevated'
    case 'moderate': return '🟡 Moderate'
    default: return '🟢 Low'
  }
}
