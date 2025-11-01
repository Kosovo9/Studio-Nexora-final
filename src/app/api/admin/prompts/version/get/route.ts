import { NextResponse } from 'next/server';
import { getSnapshot } from '@/lib/db/prompts_versioning';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const version_id = url.searchParams.get('version_id')||'';
  if (!version_id) return NextResponse.json({ error:'version_id required' }, { status:400 });
  const r = await getSnapshot(version_id);
  return NextResponse.json(r, { status: r.error?400:200 });
}

