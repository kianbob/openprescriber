import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'OpenPrescriber — Medicare Part D Prescribing Analysis'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #0c4a6e 100%)', color: 'white', fontFamily: 'system-ui' }}>
        <div style={{ fontSize: 72, fontWeight: 800, marginBottom: 16 }}>💊 OpenPrescriber</div>
        <div style={{ fontSize: 28, opacity: 0.9, maxWidth: 800, textAlign: 'center' }}>Medicare Part D Prescribing Analysis & Fraud Risk Scoring</div>
        <div style={{ display: 'flex', gap: 48, marginTop: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 40, fontWeight: 700 }}>199,202</div>
            <div style={{ fontSize: 16, opacity: 0.7 }}>Prescribers</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 40, fontWeight: 700 }}>$40.2B</div>
            <div style={{ fontSize: 16, opacity: 0.7 }}>Drug Costs</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 40, fontWeight: 700 }}>176</div>
            <div style={{ fontSize: 16, opacity: 0.7 }}>Flagged Providers</div>
          </div>
        </div>
        <div style={{ fontSize: 14, opacity: 0.5, marginTop: 32 }}>openprescriber.org · A TheDataProject.ai Platform</div>
      </div>
    ),
    { ...size }
  )
}
