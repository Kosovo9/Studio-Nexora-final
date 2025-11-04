import { NextResponse } from 'next/server';
import { csrfOk } from '@/lib/security/csrf-server';
import { restoreSnapshot } from '@/lib/db/prompts_versioning';

export async function POST(req: Request) {
  if (!(await csrfOk(req))) return NextResponse.json({ error:'CSRF' }, { status:403 });
  const { version_id } = await req.json();
  if (!version_id) return NextResponse.json({ error:'version_id required' }, { status:400 });
  const r = await restoreSnapshot(version_id);
  return NextResponse.json(r, { status: r.error?400:200 });
}

