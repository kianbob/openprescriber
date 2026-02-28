import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

const heading = Playfair_Display({ subsets: ['latin'], variable: '--font-heading', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.openprescriber.org'),
  title: { default: 'OpenPrescriber — Medicare Part D Prescribing Data & Analysis', template: '%s | OpenPrescriber' },
  description: 'Explore 199,000+ Medicare Part D prescribers, $40 billion in drug costs, opioid prescribing patterns, and fraud risk analysis. Free, open data.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={heading.variable}>
      <body className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
