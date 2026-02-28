import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import './globals.css'

const heading = Playfair_Display({ subsets: ['latin'], variable: '--font-heading', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.openprescriber.org'),
  title: { default: 'OpenPrescriber — Medicare Part D Prescribing Data & Analysis', template: '%s | OpenPrescriber' },
  description: 'Explore 1.38 million Medicare Part D prescribers, $275 billion in drug costs, opioid prescribing patterns, and fraud risk analysis. Free, open data.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={heading.variable}>
      <head>
        <link rel="alternate" type="application/rss+xml" title="OpenPrescriber Analysis" href="/feed.xml" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'OpenPrescriber',
          url: 'https://www.openprescriber.org',
          description: 'Medicare Part D prescribing data transparency platform with fraud risk scoring and opioid tracking.',
          potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: 'https://www.openprescriber.org/search?q={search_term_string}' }, 'query-input': 'required name=search_term_string' },
        })}} />
      </head>
      <body className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  )
}
