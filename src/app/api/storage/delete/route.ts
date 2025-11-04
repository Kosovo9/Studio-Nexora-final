import { NextResponse } from 'next/server';
import { deleteObject } from '@/lib/storage/s3';
import { supabaseServer } from '@/lib/auth/supabase';
import { csrfOk } from '@/lib/security/csrf-server';

export async function POST(req: Request) {
  if (!(await csrfOk(req))) return NextResponse.json({ error: 'CSRF' }, { status: 403 });
  const supa = await supabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ error:'unauthorized' }, { status: 401 });

  const body = await req.json();
  const key = String(body?.key || '');
  if (!key) return NextResponse.json({ error:'key required' }, { status: 400 });

  // sólo owner/admin borran
  const { data: prof } = await supa.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (!prof?.role || !['owner','admin'].includes(prof.role)) return NextResponse.json({ error:'forbidden' }, { status: 403 });

  await deleteObject(key);
  await supa.from('audit_logs').insert({ user_id: user.id, action:'storage_delete', entity:key });
  return NextResponse.json({ ok: true });
}

