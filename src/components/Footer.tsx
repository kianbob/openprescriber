import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Explore</h3>
          <ul className="space-y-2">
            <li><Link href="/states" className="hover:text-white">States</Link></li>
            <li><Link href="/specialties" className="hover:text-white">Specialties</Link></li>
            <li><Link href="/drugs" className="hover:text-white">Top Drugs</Link></li>
            <li><Link href="/providers" className="hover:text-white">Providers</Link></li>
            <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Risk Analysis</h3>
          <ul className="space-y-2">
            <li><Link href="/flagged" className="hover:text-white">Flagged Providers</Link></li>
            <li><Link href="/opioids" className="hover:text-white">Opioid Prescribing</Link></li>
            <li><Link href="/brand-vs-generic" className="hover:text-white">Brand vs Generic</Link></li>
            <li><Link href="/excluded" className="hover:text-white">Excluded Providers</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Analysis</h3>
          <ul className="space-y-2">
            <li><Link href="/analysis" className="hover:text-white">All Analysis</Link></li>
            <li><Link href="/analysis/opioid-crisis" className="hover:text-white">Opioid Crisis</Link></li>
            <li><Link href="/analysis/cost-outliers" className="hover:text-white">Cost Outliers</Link></li>
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/methodology" className="hover:text-white">Methodology</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Sister Sites</h3>
          <ul className="space-y-2">
            <li><a href="https://www.openmedicaid.org" className="hover:text-white">OpenMedicaid</a></li>
            <li><a href="https://www.openmedicare.us" className="hover:text-white">OpenMedicare</a></li>
            <li><a href="https://www.vaccinewatch.org" className="hover:text-white">VaccineWatch</a></li>
            <li><a href="https://www.openlobby.us" className="hover:text-white">OpenLobby</a></li>
            <li><a href="https://www.opensubsidies.org" className="hover:text-white">OpenSubsidies</a></li>
            <li><a href="https://www.openimmigration.us" className="hover:text-white">OpenImmigration</a></li>
            <li><a href="https://thedataproject.ai" className="hover:text-white">TheDataProject.ai</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
        <p>Data from CMS Medicare Part D Prescriber Public Use Files + OIG LEIE. Not medical advice.</p>
        <p className="mt-1">A <a href="https://thedataproject.ai" className="text-primary hover:underline">TheDataProject.ai</a> platform · © {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}
