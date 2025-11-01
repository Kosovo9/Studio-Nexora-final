import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createClient } from '@supabase/supabase-js';
import { itemFingerprint } from '@/lib/utils/fingerprint';
import { computeDiffStatsServer } from '@/lib/utils/diffMetricsServer';

const OUT = path.join(process.cwd(), 'exports');
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4321';
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SRK = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SLUG = process.env.PREVIEW_PACK_SLUG || 'halloween-dia-de-muertos';
const V1 = process.env.DIFF_V1 || '';
const V2 = process.env.DIFF_V2 || '';

async function ensureDir(){ try { await fs.mkdir(OUT, { recursive: true }); } catch {} }

async function ping(url:string){
  return await new Promise<boolean>(resolve=>{
    const req = http.get(url, res=>{ res.resume(); resolve((res.statusCode||500) < 500); });
    req.on('error', ()=> resolve(false));
    req.setTimeout(1200, ()=>{ req.destroy(); resolve(false); });
  });
}

function toCSV(rows:any[], aSlug:string, bSlug:string){
  const esc = (v:any)=> {
    if (v===null||v===undefined) return '';
    const s=String(v); return /[\",\n]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s;
  };
  const head = [
    'subject','title','theme','location','changed_fields',
    'P_tokensAdded','P_tokensRemoved','P_oldTokens','P_newTokens','P_pct',
    'N_tokensAdded','N_tokensRemoved','N_oldTokens','N_newTokens','N_pct'
  ].join(',');
  const lines = rows.map(r=>{
    const PM=r.prompt.metrics, NM=r.negative.metrics;
    return [
      r.subject, r.title, r.theme, r.location, (r.changed||[]).join('|'),
      PM.tokensAdded, PM.tokensRemoved, PM.oldTokens, PM.newTokens, PM.pctTokens.toFixed(1),
      NM.tokensAdded, NM.tokensRemoved, NM.oldTokens, NM.newTokens, NM.pctTokens.toFixed(1)
    ].map(esc).join(',');
  });
  return [head, ...lines].join('\n');
}

async function main(){
  await ensureDir();

  // 1) Intenta API (si dev server está activo)
  if (await ping(SITE)) {
    const qs = (V1 && V2) ? `?v1=${V1}&v2=${V2}` : '';
    const urlJ = `${SITE}/api/admin/prompts/version/diff-metrics${qs}`;
    const urlC = `${SITE}/api/admin/prompts/version/diff-metrics${qs}&format=csv`;
    const json = await (await fetch(urlJ)).json();
    const csv  = await (await fetch(urlC)).text();
    const ts = new Date().toISOString().replace(/[:.]/g,'-');
    await fs.writeFile(path.join(OUT, `diff-metrics-${json.meta?.v1?.slug}-vs-${json.meta?.v2?.slug}-${ts}.json`), JSON.stringify(json, null, 2));
    await fs.writeFile(path.join(OUT, `diff-metrics-${json.meta?.v1?.slug}-vs-${json.meta?.v2?.slug}-${ts}.csv`), csv);
    console.log('✅ Export usando API listo en /exports');
    return;
  }

  // 2) Fallback Supabase directo
  if (!SUPA_URL || !SRK) throw new Error('No API y faltan SUPABASE_URL/SERVICE_ROLE_KEY');
  const sb = createClient(SUPA_URL, SRK, { auth: { persistSession:false } });

  const { data: pack } = await sb.from('prompt_packs').select('id,slug').eq('slug', SLUG).maybeSingle();
  if (!pack?.id) throw new Error('Pack not found: '+SLUG);
  let vA = V1, vB = V2;
  if (!vA || !vB) {
    const { data: vers } = await sb.from('prompt_pack_versions').select('id,created_at').eq('pack_id', pack.id).order('created_at',{ascending:false}).limit(2);
    if (!vers || vers.length<2) throw new Error('Necesitas al menos 2 snapshots para diff');
    vA = vers[1].id; vB = vers[0].id;
  }
  const { data: a } = await sb.from('prompt_pack_versions').select('*').eq('id', vA).maybeSingle();
  const { data: b } = await sb.from('prompt_pack_versions').select('*').eq('id', vB).maybeSingle();
  if (!a || !b) throw new Error('Versions not found');
  
  const mapA = new Map<string, any>(); (a.items||[]).forEach((it:any)=> mapA.set(itemFingerprint(it), it));
  const mapB = new Map<string, any>(); (b.items||[]).forEach((it:any)=> mapB.set(itemFingerprint(it), it));
  const keys = new Set<string>([...mapA.keys(), ...mapB.keys()]);

  const rows = Array.from(keys).map(fp=>{
    const left = mapA.get(fp)||null, right = mapB.get(fp)||null;
    const pA = String(left?.prompt||''), pB = String(right?.prompt||'');
    const nA = String(left?.negative_prompt||''), nB = String(right?.negative_prompt||'');
    return {
      fp,
      subject: left?.subject || right?.subject || '',
      title: left?.title || right?.title || '',
      theme: left?.theme || right?.theme || '',
      location: left?.location || right?.location || '',
      changed: [], // opcional
      prompt: { old: pA, neu: pB, metrics: computeDiffStatsServer(pA,pB) },
      negative: { old: nA, neu: nB, metrics: computeDiffStatsServer(nA,nB) }
    };
  });

  const ts = new Date().toISOString().replace(/[:.]/g,'-');
  await fs.writeFile(path.join(OUT, `diff-metrics-${a.pack_slug}-vs-${b.pack_slug}-${ts}.json`), JSON.stringify({ meta:{ v1:{id:a.id,slug:a.pack_slug}, v2:{id:b.id,slug:b.pack_slug} }, rows }, null, 2));
  await fs.writeFile(path.join(OUT, `diff-metrics-${a.pack_slug}-vs-${b.pack_slug}-${ts}.csv`), toCSV(rows, a.pack_slug, b.pack_slug));
  console.log('✅ Export usando Supabase listo en /exports');
}

main().catch(e=>{ console.error('Export failed:', e); process.exit(1); });

