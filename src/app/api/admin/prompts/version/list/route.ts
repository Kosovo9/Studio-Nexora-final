import { NextResponse } from 'next/server';
import { listSnapshots } from '@/lib/db/prompts_versioning';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const pack_id = url.searchParams.get('pack_id')||'';
  if (!pack_id) return NextResponse.json({ error:'pack_id required' }, { status:400 });
  const r = await listSnapshots(pack_id);
  return NextResponse.json(r, { status: r.error?400:200 });
}

