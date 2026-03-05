import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact Us | OpenPrescriber',
  description: 'Get in touch with the OpenPrescriber team for general inquiries, data corrections, media requests, or provider disputes.',
  alternates: { canonical: 'https://www.openprescriber.org/contact' },
}

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Contact Us</h1>
      <p className="text-gray-600 mb-10 text-lg">We&apos;d love to hear from you. Reach out using one of the channels below.</p>

      <div className="space-y-8">
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">General Inquiries</h2>
          <p className="text-gray-600 mb-3">Questions about our data, methodology, or website? We&apos;re happy to help.</p>
          <a href="mailto:contact@openprescriber.org" className="text-blue-600 hover:underline font-medium">contact@openprescriber.org</a>
        </section>

        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Data Corrections</h2>
          <p className="text-gray-600 mb-3">
            If you believe your risk score is inaccurate or your data needs correction, please contact us. 
            We take data accuracy seriously and will review all disputes promptly.
          </p>
          <a href="mailto:contact@openprescriber.org?subject=Data%20Correction%20Request" className="text-blue-600 hover:underline font-medium">contact@openprescriber.org</a>
        </section>

        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Media &amp; Press</h2>
          <p className="text-gray-600 mb-3">
            Journalists and researchers are welcome to reach out for data requests, interviews, or collaboration opportunities.
          </p>
          <a href="mailto:contact@openprescriber.org?subject=Media%20Inquiry" className="text-blue-600 hover:underline font-medium">contact@openprescriber.org</a>
        </section>

        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">For Healthcare Providers</h2>
          <p className="text-gray-700">
            If you are a prescriber and believe your profile contains errors or your risk score does not accurately 
            reflect your practice, please email us with your NPI number and a description of the issue. 
            We review all provider inquiries within 5 business days.
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-gray-500">
        See also our <Link href="/methodology" className="text-blue-600 hover:underline">Methodology</Link>, <Link href="/faq" className="text-blue-600 hover:underline">FAQ</Link>, and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
      </p>
    </main>
  )
}
