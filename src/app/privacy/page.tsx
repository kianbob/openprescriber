import { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'OpenPrescriber privacy policy — how we handle your data.',
  alternates: { canonical: 'https://www.openprescriber.org/privacy' },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-6">Privacy Policy</h1>
      <div className="prose prose-gray max-w-none">
        <p><strong>Last updated:</strong> February 2026</p>

        <h2>What We Collect</h2>
        <p>OpenPrescriber uses Google Analytics to collect anonymous usage statistics (pages visited, time on site, referral source). We do not collect personally identifiable information, require account creation, or use cookies for advertising.</p>

        <h2>Data on This Site</h2>
        <p>All prescribing data displayed on OpenPrescriber comes from publicly available CMS Medicare Part D Public Use Files and the OIG List of Excluded Individuals/Entities. Provider names, NPIs, and practice locations are public information released by CMS under federal data transparency policies.</p>

        <h2>No Accounts or Tracking</h2>
        <p>OpenPrescriber does not require registration, login, or any personal information. There are no ads, no paywalls, and no third-party tracking beyond Google Analytics.</p>

        <h2>Third-Party Services</h2>
        <ul>
          <li><strong>Google Analytics</strong> — Anonymous usage statistics</li>
          <li><strong>Vercel</strong> — Hosting and CDN</li>
        </ul>

        <h2>Contact</h2>
        <p>Questions about this policy? Contact us at <a href="mailto:kian@thedataproject.ai" className="text-primary">kian@thedataproject.ai</a>.</p>
      </div>
    </div>
  )
}
