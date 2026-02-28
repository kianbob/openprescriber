import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page not found</p>
      <p className="text-gray-500 mt-2">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-900">Go Home</Link>
        <Link href="/search" className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50">Search</Link>
      </div>
    </div>
  )
}
