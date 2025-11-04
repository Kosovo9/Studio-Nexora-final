'use server';
import { supabaseServer } from '@/lib/auth/supabase';

export async function requireRole(roles: string[] = ['owner','admin','editor']) {
  // DEV PREVIEW BYPASS (solo local): si DEV_PREVIEW_ADMIN=1, regresa owner fake
  if (process.env.NODE_ENV !== 'production' && process.env.DEV_PREVIEW_ADMIN === '1') {
    const fake = { id: 'dev-fake-user', email: 'dev@local' };
    // @ts-ignore
    return { ok: true as const, sb: await supabaseServer(), user: fake, role: 'owner' };
  }

  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { ok:false as const, error:'unauthorized' };
  const { data: prof } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (!prof?.role || !roles.includes(prof.role)) return { ok:false as const, error:'forbidden' };
  return { ok:true as const, sb, user, role: prof.role as string };
}

