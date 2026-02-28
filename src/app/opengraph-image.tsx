import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'OpenPrescriber — Medicare Part D Prescribing Transparency'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #0ea5e9 100%)', color: 'white', fontFamily: 'system-ui' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}>
          <div style={{ fontSize: 72, fontWeight: 800, marginBottom: 16 }}>OpenPrescriber</div>
          <div style={{ fontSize: 28, opacity: 0.9, marginBottom: 40 }}>Medicare Part D Prescribing Transparency</div>
          <div style={{ display: 'flex', gap: 40, fontSize: 22 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: '20px 30px' }}>
              <div style={{ fontSize: 36, fontWeight: 700 }}>1.38M</div>
              <div style={{ opacity: 0.8 }}>Prescribers</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: '20px 30px' }}>
              <div style={{ fontSize: 36, fontWeight: 700 }}>$275.6B</div>
              <div style={{ opacity: 0.8 }}>Drug Costs</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: '20px 30px' }}>
              <div style={{ fontSize: 36, fontWeight: 700 }}>5 Years</div>
              <div style={{ opacity: 0.8 }}>2019–2023</div>
            </div>
          </div>
          <div style={{ marginTop: 40, fontSize: 18, opacity: 0.7 }}>A TheDataProject.ai Platform</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
