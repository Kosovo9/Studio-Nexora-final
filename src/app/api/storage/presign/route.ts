import { NextResponse } from 'next/server';
import { presignPut } from '@/lib/storage/s3';
import { supabaseServer } from '@/lib/auth/supabase';
import { csrfOk } from '@/lib/security/csrf-server';

export async function POST(req: Request) {
  if (!csrfOk(req)) return NextResponse.json({ error: 'CSRF' }, { status: 403 });
  const supa = supabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ error:'unauthorized' }, { status: 401 });

  const body = await req.json();
  const key = String(body?.key || '');
  const contentType = String(body?.contentType || 'application/octet-stream');
  if (!key) return NextResponse.json({ error:'key required' }, { status: 400 });

  // simple RBAC: owner/admin/editor
  const { data: prof } = await supa.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (!prof?.role || !['owner','admin','editor'].includes(prof.role)) return NextResponse.json({ error:'forbidden' }, { status: 403 });

  const out = await presignPut(key, contentType);
  await supa.from('audit_logs').insert({ user_id: user.id, action:'storage_presign', entity:key, meta:{contentType} });
  return NextResponse.json(out);
}

