import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  output: undefined,
  async redirects() {
    return [
      { source: '/compare', destination: '/tools/compare', permanent: true },
    ]
  },
}
export default nextConfig
