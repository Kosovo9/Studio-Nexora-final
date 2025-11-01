import { ImageResponse } from 'next/og';
export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: 'linear-gradient(135deg, #0b1222 0%, #1b2b53 60%, #0a2033 100%)',
          color: 'white',
          padding: '48px',
          fontSize: 56,
          fontWeight: 700
        }}
      >
        <div style={{ fontSize: 24, opacity: .8, marginBottom: 12 }}>Nexora Pro</div>
        <div>Studio Nexora</div>
        <div style={{ fontSize: 20, opacity: .9, marginTop: 6 }}>IA · Prompts · Media hiperrealista · SaaS</div>
      </div>
    ),
    { ...size }
  );
}

