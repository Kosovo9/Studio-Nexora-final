import { NextResponse } from 'next/server';
import { csrfOk } from '@/lib/security/csrf-server';
import { supabaseServer } from '@/lib/auth/supabase';
import { logAudit } from '@/lib/db/audit';

async function requireRole(roles: string[] = ['owner','admin','editor']) {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { ok:false as const, error:'unauthorized' };
  const { data: prof } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (!prof?.role || !roles.includes(prof.role)) return { ok:false as const, error:'forbidden' };
  return { ok:true as const, sb, user };
}

export async function POST(req: Request) {
  if (!csrfOk(req)) return NextResponse.json({ error:'CSRF' }, { status:403 });
  const { ok, sb, error } = await requireRole(['owner','admin','editor']);
  if (!ok) return NextResponse.json({ error }, { status:401 });
  const body = await req.json();
  const source_id = String(body.source_id||'');
  const slug = String(body.slug||'').toLowerCase().replace(/[^a-z0-9\-]/g,'-').replace(/\-+/g,'-').replace(/^\-|\-$/g,'');
  const name = String(body.name||slug||'Cloned Pack');
  const coverPrefix = String(body.cover_prefix||'');
  if (!source_id || !slug) return NextResponse.json({ error:'source_id & slug required' }, { status:400 });
  const { data: src } = await sb.from('prompt_packs').select('*').eq('id', source_id).maybeSingle();
  const { data: items } = await sb.from('prompt_items').select('*').eq('pack_id', source_id);
  if (!src) return NextResponse.json({ error:'source pack not found' }, { status:404 });
  const { data: npack, error: e1 } = await sb.from('prompt_packs').insert({ slug, name, description: src.description||null }).select('*').maybeSingle();
  if (e1) return NextResponse.json({ error: e1.message }, { status:400 });
  const mapped = (items||[]).map((it:any)=>({
    pack_id: npack!.id,
    subject: it.subject, title: it.title, theme: it.theme, location: it.location,
    prompt: it.prompt, negative_prompt: it.negative_prompt||'',
    cover_key: coverPrefix? `${coverPrefix.replace(/\/?$/,'/')}${(it.cover_key||'')}`.replace(/\/+/g,'/') : it.cover_key||null,
    lqip: it.lqip||null
  }));
  if (mapped.length) await sb.from('prompt_items').insert(mapped);
  await logAudit('pack_clone', String(npack!.id), { source: source_id, count: mapped.length });
  return NextResponse.json({ ok:true, pack: npack, count: mapped.length });
}

