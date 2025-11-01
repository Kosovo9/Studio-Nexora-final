import { NextResponse } from 'next/server';
import { listObjects } from '@/lib/storage/s3';
import { supabaseServer } from '@/lib/auth/supabase';

export async function GET(req: Request) {
  const supa = supabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ error:'unauthorized' }, { status: 401 });
  const url = new URL(req.url);
  const prefix = url.searchParams.get('prefix') || '';
  const list = await listObjects(prefix, 200);
  return NextResponse.json({ items: list });
}

