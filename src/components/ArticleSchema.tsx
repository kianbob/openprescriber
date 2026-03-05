export default function ArticleSchema({ title, description, slug, date }: { title: string; description: string; slug: string; date: string }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      url: `https://www.openprescriber.org/analysis/${slug}`,
      datePublished: date,
      dateModified: date,
      author: { '@type': 'Organization', name: 'OpenPrescriber', url: 'https://www.openprescriber.org' },
      publisher: { '@type': 'Organization', name: 'OpenPrescriber', url: 'https://www.openprescriber.org' },
      isAccessibleForFree: true,
    })}} />
  )
}
