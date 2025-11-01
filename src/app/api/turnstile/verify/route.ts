import { NextResponse } from 'next/server';
import { verifyTurnstile } from '@/lib/security/turnstile';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0]?.trim() || undefined;

    const result = await verifyTurnstile(token, ip);

    if (result.success) {
      const res = NextResponse.json({ ok: true }, { status: 200 });
      res.headers.set('Set-Cookie', 'human_ok=1; Path=/; Max-Age=86400; SameSite=Lax');
      return res;
    }

    return NextResponse.json({ ok: false, errors: result['error-codes'] ?? [] }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'verify error' }, { status: 500 });
  }
}

