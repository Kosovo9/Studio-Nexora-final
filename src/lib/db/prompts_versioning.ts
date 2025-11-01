'use server';
import objectHash from 'object-hash';
import { supabaseServer } from '@/lib/auth/supabase';
import { logAudit } from '@/lib/db/audit';

async function requireRole(roles: string[] = ['owner','admin','editor']) {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { ok:false as const, error:'unauthorized' };
  const { data: prof } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (!prof?.role || !roles.includes(prof.role)) return { ok:false as const, error:'forbidden' };
  return { ok:true as const, sb, user, role: prof.role as string };
}

export async function snapshotPack(pack_id: string) {
  const { ok, sb, error, user } = await requireRole(['owner','admin','editor']) as any;
  if (!ok) return { error };
  const { data: pack } = await sb.from('prompt_packs').select('*').eq('id', pack_id).maybeSingle();
  const { data: items } = await sb.from('prompt_items').select('*').eq('pack_id', pack_id).order('created_at',{ascending:true});
  if (!pack) return { error:'pack not found' };
  const payload = { pack, items };
  const checksum = objectHash(payload);
  const { data: ver, error: e } = await sb.from('prompt_pack_versions').insert({
    pack_id: pack.id,
    pack_slug: pack.slug, pack_name: pack.name, description: pack.description,
    items,
    checksum,
    created_by: user.id
  }).select('*').maybeSingle();
  if (e) return { error: e.message };
  await logAudit('pack_snapshot', String(pack.id), { version_id: ver.id, checksum, count: items?.length||0 });
  return { data: ver };
}

export async function listSnapshots(pack_id: string) {
  const { ok, sb, error } = await requireRole(['owner','admin','editor','viewer']);
  if (!ok) return { error };
  const { data, error: e } = await sb.from('prompt_pack_versions').select('id, created_at, checksum, pack_slug, pack_name, description').eq('pack_id', pack_id).order('created_at',{ascending:false});
  return e ? { error: e.message } : { data };
}

export async function getSnapshot(version_id: string) {
  const { ok, sb, error } = await requireRole(['owner','admin','editor','viewer']);
  if (!ok) return { error };
  const { data, error: e } = await sb.from('prompt_pack_versions').select('*').eq('id', version_id).maybeSingle();
  return e ? { error: e.message } : { data };
}

export async function restoreSnapshot(version_id: string) {
  const { ok, sb, error, user } = await requireRole(['owner','admin']) as any;
  if (!ok) return { error };
  const { data: ver } = await sb.from('prompt_pack_versions').select('*').eq('id', version_id).maybeSingle();
  if (!ver) return { error:'version not found' };
  // Upsert pack meta
  await sb.from('prompt_packs').upsert({
    id: ver.pack_id, slug: ver.pack_slug, name: ver.pack_name, description: ver.description, updated_at: new Date().toISOString()
  });
  // Replace items
  await sb.from('prompt_items').delete().eq('pack_id', ver.pack_id);
  const items = (ver.items||[]).map((it:any)=>({
    pack_id: ver.pack_id,
    subject: it.subject, title: it.title, theme: it.theme, location: it.location,
    prompt: it.prompt, negative_prompt: it.negative_prompt||'',
    cover_key: it.cover_key||it.coverKey||null,
    lqip: it.lqip||null, updated_at: new Date().toISOString()
  }));
  if (items.length) await sb.from('prompt_items').insert(items);
  await logAudit('pack_restore', String(ver.pack_id), { version_id, count: items.length });
  return { ok:true, count: items.length };
}

