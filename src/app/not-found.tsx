import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white rounded-2xl p-10 shadow-lg">
          <h1 className="text-7xl font-bold font-[family-name:var(--font-heading)] opacity-80">404</h1>
          <p className="text-xl mt-4">Page not found</p>
          <p className="text-blue-200 mt-2">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>

          <form action="/search" method="get" className="mt-6 flex gap-2 max-w-md mx-auto">
            <input
              type="text"
              name="q"
              placeholder="Search providers, drugs, states..."
              className="flex-1 px-4 py-2 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button type="submit" className="bg-accent hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Search
            </button>
          </form>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">You might be looking for:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Search Providers', href: '/search' },
              { label: 'Top Drugs', href: '/drugs' },
              { label: 'Flagged Providers', href: '/flagged' },
              { label: 'Opioid Data', href: '/opioids' },
              { label: 'State Rankings', href: '/states' },
              { label: 'Dashboard', href: '/dashboard' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 py-3 text-sm font-medium text-primary hover:shadow-md hover:border-primary/20 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-primary hover:underline text-sm font-medium">
            &larr; Back to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
