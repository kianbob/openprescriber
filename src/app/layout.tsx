import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import './globals.css'

const heading = Playfair_Display({ subsets: ['latin'], variable: '--font-heading', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.openprescriber.org'),
  title: { default: 'OpenPrescriber — Medicare Prescriber Data & Fraud Analysis', template: '%s | OpenPrescriber' },
  description: 'Search 1.38 million Medicare prescriber records, flag fraud with ML risk scoring, track opioid hotspots, and explore $275B in Part D drug costs. Free, open data.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={heading.variable}>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-HT9HV6KT4D" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-HT9HV6KT4D');` }} />
        <link rel="alternate" type="application/rss+xml" title="OpenPrescriber Analysis" href="/feed.xml" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'OpenPrescriber',
          url: 'https://www.openprescriber.org',
          description: 'Medicare Part D prescribing data transparency platform with fraud risk scoring and opioid tracking.',
          potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: 'https://www.openprescriber.org/search?q={search_term_string}' }, 'query-input': 'required name=search_term_string' },
        })}} />
        <meta name="google-adsense-account" content="ca-pub-9872374508496229" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9872374508496229" crossOrigin="anonymous"></script>      </head>
      <body className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  )
}
