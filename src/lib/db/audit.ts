'use server';
import { supabaseServer } from '@/lib/auth/supabase';

export async function logAudit(action: string, entity?: string, meta?: any) {
  try {
    const sb = await supabaseServer();
    const { data: { user } } = await sb.auth.getUser();
    await sb.from('audit_logs').insert({
      user_id: user?.id || null, action, entity: entity || null, meta: meta || null
    });
  } catch (e) {
    // silencioso
  }
}

