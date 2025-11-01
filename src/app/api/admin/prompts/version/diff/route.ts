import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/auth/supabase';
import { create } from 'jsondiffpatch';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const v1 = url.searchParams.get('v1')||'';
  const v2 = url.searchParams.get('v2')||'';
  if (!v1 || !v2) return NextResponse.json({ error:'v1 & v2 required' }, { status:400 });
  const sb = supabaseServer();
  const { data: a } = await sb.from('prompt_pack_versions').select('*').eq('id', v1).maybeSingle();
  const { data: b } = await sb.from('prompt_pack_versions').select('*').eq('id', v2).maybeSingle();
  if (!a || !b) return NextResponse.json({ error:'versions not found' }, { status:404 });
  const jdp = create({ textDiff: { minLength: 20 } });
  const delta = jdp.diff({ pack:a.pack_slug, items:a.items }, { pack:b.pack_slug, items:b.items });
  return NextResponse.json({ delta });
}

