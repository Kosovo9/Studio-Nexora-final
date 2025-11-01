import { NextResponse } from 'next/server';
import { csrfOk } from '@/lib/security/csrf-server';
import { snapshotPack } from '@/lib/db/prompts_versioning';

export async function POST(req: Request) {
  if (!csrfOk(req)) return NextResponse.json({ error:'CSRF' }, { status:403 });
  const { pack_id } = await req.json();
  if (!pack_id) return NextResponse.json({ error:'pack_id required' }, { status:400 });
  const r = await snapshotPack(pack_id);
  return NextResponse.json(r, { status: r.error?400:200 });
}

