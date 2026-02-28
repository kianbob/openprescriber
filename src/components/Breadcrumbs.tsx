import Link from 'next/link'

export default function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const all = [{ label: 'Home', href: '/' }, ...items]
  return (
    <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: all.map((item, i) => ({
          '@type': 'ListItem', position: i + 1,
          name: item.label, ...(item.href ? { item: `https://www.openprescriber.org${item.href}` } : {}),
        })),
      })}} />
      {all.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1">›</span>}
          {item.href ? <Link href={item.href} className="hover:text-primary">{item.label}</Link> : <span className="text-gray-700">{item.label}</span>}
        </span>
      ))}
    </nav>
  )
}
