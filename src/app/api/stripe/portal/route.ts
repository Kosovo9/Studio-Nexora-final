import { NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';

export async function POST(req: Request) {
  try {
    const { customerId, returnUrl } = await req.json();
    if (!customerId) return NextResponse.json({ error: 'customerId required' }, { status: 400 });

    const url = (returnUrl || process.env.NEXT_PUBLIC_STRIPE_PORTAL_RETURN_URL)!;
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: url
    });
    return NextResponse.json({ url: session.url });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message ?? 'portal failed' }, { status: 500 });
  }
}

