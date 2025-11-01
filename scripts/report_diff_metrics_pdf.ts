import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4321';
const OUTDIR = path.join(process.cwd(), 'exports');
const SLUG = process.env.PREVIEW_PACK_SLUG || 'halloween-dia-de-muertos';
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SRK = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const V1 = process.env.DIFF_V1 || '';
const V2 = process.env.DIFF_V2 || '';

async function wait(url:string, ms=25000){
  const start=Date.now();
  while(Date.now()-start<ms){
    const ok = await new Promise<boolean>(resolve=>{
      const req = http.get(url, res=>{ res.resume(); resolve((res.statusCode||500) < 500); });
      req.on('error', ()=>resolve(false));
      req.setTimeout(1200, ()=>{ req.destroy(); resolve(false); });
    });
    if(ok) return true;
    await new Promise(r=>setTimeout(r,500));
  }
  return false;
}

async function ensureSnapshots(): Promise<{packId:string, v1:string, v2:string, aSlug:string, bSlug:string}> {
  if (!SUPA_URL || !SRK) throw new Error('SUPABASE URL/SERVICE_ROLE_KEY required (o define DIFF_V1/DIFF_V2 y usa server dev)');
  const sb = createClient(SUPA_URL, SRK, { auth:{ persistSession:false }});
  const { data: pack } = await sb.from('prompt_packs').select('id,slug').eq('slug', SLUG).maybeSingle();
  if (!pack?.id) throw new Error('Pack not found: '+SLUG);
  let v1 = V1, v2 = V2;
  if (!v1 || !v2){
    const { data: vers } = await sb.from('prompt_pack_versions').select('id, created_at, pack_slug').eq('pack_id', pack.id).order('created_at',{ascending:false}).limit(2);
    if (!vers || vers.length<2) throw new Error('Necesitas al menos dos snapshots');
    v1 = vers[1].id; v2 = vers[0].id;
    return { packId: pack.id, v1, v2, aSlug: vers[1].pack_slug, bSlug: vers[0].pack_slug };
  } else {
    const { data: a } = await sb.from('prompt_pack_versions').select('id, pack_id, pack_slug').eq('id', v1).maybeSingle();
    const { data: b } = await sb.from('prompt_pack_versions').select('id, pack_id, pack_slug').eq('id', v2).maybeSingle();
    return { packId: a?.pack_id || pack.id, v1, v2, aSlug: a?.pack_slug||'v1', bSlug: b?.pack_slug||'v2' };
  }
}

async function main(){
  await fs.mkdir(OUTDIR, { recursive: true }).catch(()=>{});

  // Dev server must be running (use dev bypass auth if needed)
  const ok = await wait(SITE, 25000);
  if (!ok) throw new Error('Dev server not responding: '+SITE);

  const { v1, v2, aSlug, bSlug } = await ensureSnapshots();
  const url = `${SITE}/admin/reports/diff-metrics?v1=${encodeURIComponent(v1)}&v2=${encodeURIComponent(v2)}`;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1240, height: 1754 } }); // aprox A4 96dpi
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForSelector('[data-report-ready="1"]', { timeout: 15000 }).catch(()=>{});
  // Espera un frame para fuentes/render
  await page.waitForTimeout(500);

  const ts = new Date().toISOString().replace(/[:.]/g,'-');
  const out = path.join(OUTDIR, `report-diff-metrics-${aSlug}-vs-${bSlug}-${ts}.pdf`);
  await page.pdf({
    path: out,
    format: 'A4',
    printBackground: true,
    margin: { top: '12mm', bottom: '12mm', left: '12mm', right: '12mm' }
  });

  await browser.close();
  console.log('✅ PDF listo:', out);
}

main().catch(e=>{ console.error('PDF failed:', e); process.exit(1); });

