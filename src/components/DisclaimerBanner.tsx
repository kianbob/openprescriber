import Link from 'next/link'

export default function DisclaimerBanner({ variant = 'default' }: { variant?: 'default' | 'risk' | 'ml' }) {
  const messages: Record<string, { icon: string; text: string }> = {
    default: {
      icon: 'ℹ️',
      text: 'Data sourced from CMS Medicare Part D Public Use Files (2023). This site provides statistical analysis for transparency — not medical advice or accusations.',
    },
    risk: {
      icon: '⚠️',
      text: 'Risk scores are statistical indicators based on prescribing patterns compared to specialty peers. They are NOT allegations of fraud, misconduct, or improper care. Many legitimate medical reasons can explain outlier prescribing.',
    },
    ml: {
      icon: '🤖',
      text: 'Machine learning predictions identify statistical patterns consistent with confirmed fraud cases. A high ML score does NOT mean a provider is committing fraud — it means their prescribing patterns statistically resemble those of providers who were.',
    },
  }

  const { icon, text } = messages[variant]

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 text-sm text-amber-800 flex gap-2">
      <span className="flex-shrink-0">{icon}</span>
      <div>
        <p>{text}</p>
        <Link href="/methodology" className="text-amber-700 hover:underline text-xs font-medium mt-1 inline-block">Read our methodology →</Link>
      </div>
    </div>
  )
}
