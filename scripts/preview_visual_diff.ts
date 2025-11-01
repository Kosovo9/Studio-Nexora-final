import { createClient } from '@supabase/supabase-js';
import { chromium } from 'playwright';
import http from 'node:http';
import { setTimeout as sleep } from 'node:timers/promises';

const PORT = 4321;
const BASE = process.env.NEXT_PUBLIC_SITE_URL || `http://localhost:${PORT}`;
const SLUG = process.env.PREVIEW_PACK_SLUG || 'halloween-dia-de-muertos';

// Usa SERVICE_ROLE si la tienes para DB directa (más rápido). Si no, intenta sin ella.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SRK = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function waitForServer(url: string, ms = 20000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    const ok = await new Promise<boolean>((resolve) => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve(res.statusCode ? res.statusCode < 500 : false);
      });
      req.on('error', () => resolve(false));
      req.setTimeout(1500, () => { req.destroy(); resolve(false); });
    });
    if (ok) return true;
    await sleep(500);
  }
  return false;
}

async function getPackAndSnapshots() {
  if (!SUPABASE_URL || !SRK) {
    // fallback: asume que ya tienes packId visible en /admin/prompts manualmente
    return { packId: 'unknown', v1: '', v2: '' };
  }
  const sb = createClient(SUPABASE_URL, SRK, { auth: { persistSession: false } });
  const { data: pack } = await sb.from('prompt_packs').select('id,slug').eq('slug', SLUG).maybeSingle();
  if (!pack?.id) throw new Error(`Pack not found for slug=${SLUG}`);
  const { data: vers } = await sb
    .from('prompt_pack_versions')
    .select('id,created_at')
    .eq('pack_id', pack.id)
    .order('created_at', { ascending: false })
    .limit(2);
  if (!vers || vers.length < 2) {
    // crea snapshots directos (toma estado actual)
    const { data: items } = await sb.from('prompt_items').select('*').eq('pack_id', pack.id).order('created_at', { ascending: true });
    const payload = { pack_id: pack.id, pack_slug: SLUG, pack_name: SLUG, description: null, items, checksum: String(Date.now()), created_by: null };
    await sb.from('prompt_pack_versions').insert(payload);
    await sb.from('prompt_pack_versions').insert({ ...payload, checksum: String(Date.now()+1) });
    const { data: vers2 } = await sb
      .from('prompt_pack_versions')
      .select('id,created_at')
      .eq('pack_id', pack.id)
      .order('created_at', { ascending: false })
      .limit(2);
    if (!vers2 || vers2.length < 2) throw new Error('Failed to generate minimal snapshots');
    return { packId: pack.id, v1: vers2[1].id, v2: vers2[0].id };
  }
  return { packId: pack.id, v1: vers[1].id, v2: vers[0].id };
}

async function main() {
  // 1) espera dev server
  const ok = await waitForServer(`${BASE}/`, 25000);
  if (!ok) throw new Error(`Dev server not responding at ${BASE}`);

  // 2) obtiene pack + últimas 2 versiones
  const { packId, v1, v2 } = await getPackAndSnapshots();

  const url = `${BASE}/admin/prompts/${packId}/visual-diff?v1=${encodeURIComponent(v1)}&v2=${encodeURIComponent(v2)}`;
  console.log('Preview URL:', url);

  // 3) abre en Chromium headless y saca pantallazo
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
  // espera marcador de la página
  await page.waitForSelector('text=Visual Diff por Item', { timeout: 20000 }).catch(()=>{});
  await page.waitForTimeout(1000);
  const ts = new Date().toISOString().replace(/[:.]/g,'-');
  await page.screenshot({ path: `screenshots/visual-diff-${ts}.png`, fullPage: false });
  await browser.close();

  console.log(`✅ Screenshot: screenshots/visual-diff-${ts}.png`);
}

main().catch((e)=>{ console.error('Preview failed:', e.message); process.exit(1); });

