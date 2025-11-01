import { ImageResponse } from 'next/og';
export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'Studio Nexora';
  const subtitle = searchParams.get('subtitle') || 'IA · Media hiperrealista · SaaS';
  return new ImageResponse(
    (<div style={{height:'100%',width:'100%',display:'flex',flexDirection:'column',justifyContent:'flex-end',background:'linear-gradient(135deg,#0b1222,#1b2b53 60%,#0a2033)',color:'#fff',padding:48}}>
      <div style={{ fontSize: 22, opacity:.85, marginBottom:8 }}>Nexora Pro</div>
      <div style={{ fontSize: 58, fontWeight: 800 }}>{title}</div>
      <div style={{ fontSize: 22, opacity:.9, marginTop: 6 }}>{subtitle}</div>
    </div>), { ...size }
  );
}

