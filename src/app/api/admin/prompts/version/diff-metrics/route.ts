import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/auth/supabase';
import { itemFingerprint, itemDiffFields } from '@/lib/utils/fingerprint';
import { computeDiffStatsServer } from '@/lib/utils/diffMetricsServer';

function escCSV(v: any){
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (/[\",\n]/.test(s)) return '"'+s.replace(/"/g,'""')+'"';
  return s;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const v1 = url.searchParams.get('v1')||'';
  const v2 = url.searchParams.get('v2')||'';
  const format = (url.searchParams.get('format')||'json').toLowerCase();
  if (!v1 || !v2) return NextResponse.json({ error:'v1 & v2 required' }, { status:400 });

  const sb = supabaseServer();
  const { data: a } = await sb.from('prompt_pack_versions').select('*').eq('id', v1).maybeSingle();
  const { data: b } = await sb.from('prompt_pack_versions').select('*').eq('id', v2).maybeSingle();
  if (!a || !b) return NextResponse.json({ error:'versions not found' }, { status:404 });

  const mapA = new Map<string, any>(); (a.items||[]).forEach((it:any)=> mapA.set(itemFingerprint(it), it));
  const mapB = new Map<string, any>(); (b.items||[]).forEach((it:any)=> mapB.set(itemFingerprint(it), it));
  const keys = new Set<string>([...mapA.keys(), ...mapB.keys()]);

  const rows = Array.from(keys).map(fp => {
    const left = mapA.get(fp) || null;
    const right = mapB.get(fp) || null;
    const changed = itemDiffFields(left, right);

    const pA = String(left?.prompt||'');    const pB = String(right?.prompt||'');
    const nA = String(left?.negative_prompt||''); const nB = String(right?.negative_prompt||'');

    const PM = computeDiffStatsServer(pA, pB);
    const NM = computeDiffStatsServer(nA, nB);

    return {
      fp,
      subject: left?.subject || right?.subject || '',
      title: left?.title || right?.title || '',
      theme: left?.theme || right?.theme || '',
      location: left?.location || right?.location || '',
      changed,
      prompt: { old: pA, neu: pB, metrics: PM },
      negative: { old: nA, neu: nB, metrics: NM }
    };
  });

  // Totales
  const totals = rows.reduce((acc, r)=>{
    acc.tokensAdded += r.prompt.metrics.tokensAdded + r.negative.metrics.tokensAdded;
    acc.tokensRemoved += r.prompt.metrics.tokensRemoved + r.negative.metrics.tokensRemoved;
    acc.oldTokens += r.prompt.metrics.oldTokens + r.negative.metrics.oldTokens;
    acc.newTokens += r.prompt.metrics.newTokens + r.negative.metrics.newTokens;
    return acc;
  }, { tokensAdded:0, tokensRemoved:0, oldTokens:0, newTokens:0 });
  const net = totals.newTokens - totals.oldTokens;
  const pct = totals.oldTokens>0 ? ((totals.newTokens - totals.oldTokens)/totals.oldTokens)*100 : (totals.newTokens>0?100:0);

  if (format === 'csv') {
    const head = [
      'subject','title','theme','location','changed_fields',
      'P_tokensAdded','P_tokensRemoved','P_oldTokens','P_newTokens','P_pct',
      'N_tokensAdded','N_tokensRemoved','N_oldTokens','N_newTokens','N_pct'
    ].join(',');
    const lines = rows.map(r=>{
      const PM = r.prompt.metrics, NM = r.negative.metrics;
      const cf = r.changed.join('|');
      return [
        r.subject, r.title, r.theme, r.location, cf,
        PM.tokensAdded, PM.tokensRemoved, PM.oldTokens, PM.newTokens, PM.pctTokens.toFixed(1),
        NM.tokensAdded, NM.tokensRemoved, NM.oldTokens, NM.newTokens, NM.pctTokens.toFixed(1)
      ].map(escCSV).join(',');
    });
    const footer = [
      'TOTALS','','','',
      '', // changed_fields vacío
      rows.reduce((s,r)=>s+r.prompt.metrics.tokensAdded,0),
      rows.reduce((s,r)=>s+r.prompt.metrics.tokensRemoved,0),
      rows.reduce((s,r)=>s+r.prompt.metrics.oldTokens,0),
      rows.reduce((s,r)=>s+r.prompt.metrics.newTokens,0),
      '', // pct global no aplica por columna prompt
      rows.reduce((s,r)=>s+r.negative.metrics.tokensAdded,0),
      rows.reduce((s,r)=>s+r.negative.metrics.tokensRemoved,0),
      rows.reduce((s,r)=>s+r.negative.metrics.oldTokens,0),
      rows.reduce((s,r)=>s+r.negative.metrics.newTokens,0),
      ''  // pct global no aplica por columna negative
    ].map(escCSV).join(',');

    const csv = [head, ...lines, footer].join('\n');
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type':'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="diff-metrics-${a.pack_slug}-vs-${b.pack_slug}.csv"`
      }
    });
  }

  return NextResponse.json({
    meta: {
      pack_id: a.pack_id,
      v1: { id: a.id, slug: a.pack_slug, created_at: a.created_at },
      v2: { id: b.id, slug: b.pack_slug, created_at: b.created_at },
      totals: { ...totals, net, pct }
    },
    rows
  }, { status:200 });
}

