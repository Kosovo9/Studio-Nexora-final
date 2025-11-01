import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Studio Nexora · Diff Metrics Report' };

async function getData(searchParams: Record<string,string|undefined>) {
  const v1 = searchParams.v1||''; const v2 = searchParams.v2||'';
  if (!v1 || !v2) return { error: 'Missing v1/v2' };
  // Use absolute URL for server-side fetch
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  const url = `${baseUrl}/api/admin/prompts/version/diff-metrics?v1=${encodeURIComponent(v1)}&v2=${encodeURIComponent(v2)}`;
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) return { error: `HTTP ${r.status}` };
  const j = await r.json();
  return j;
}

export default async function Page({ searchParams }: { searchParams: { [k:string]: string|undefined }}) {
  const data = await getData(searchParams);
  if (data?.error) return <main className='p-8 text-white'>Error: {String(data.error)}</main>;
  const meta = data.meta;
  const rows = data.rows||[];
  const fmt = (n:number)=> new Intl.NumberFormat('en-US').format(n ?? 0);
  const ts = new Date(meta?.v2?.created_at||Date.now()).toLocaleString();

  return (
    <main className='min-h-screen text-white bg-black' data-report-ready='1'>
      <style>{`
        @media print {
          @page { size: A4; margin: 14mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        .card { border: 1px solid rgba(255,255,255,.15); border-radius: 16px; background: rgba(0,0,0,.55); }
        .chip { display:inline-block; padding:2px 8px; border-radius:999px; border:1px solid rgba(255,255,255,.2); margin-right:6px; margin-bottom:4px; font-size:11px; }
      `}</style>

      {/* Header */}
      <section className='p-8 pb-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold'>Studio Nexora — Diff Metrics Report</h1>
            <div className='opacity-80 text-sm'>Pack: <b>{meta?.v1?.slug}</b> → <b>{meta?.v2?.slug}</b></div>
            <div className='opacity-70 text-xs'>Generated: {ts}</div>
          </div>
          <div className='text-right'>
            <div className='text-lg font-semibold'>Total Δ tokens</div>
            <div className='text-2xl'>{fmt((meta?.totals?.newTokens || 0) - (meta?.totals?.oldTokens || 0))}</div>
            <div className='opacity-80 text-xs'>Δ {Number(meta?.totals?.pct||0).toFixed(1)}%</div>
          </div>
        </div>
      </section>

      {/* Totales */}
      <section className='px-8'>
        <div className='card p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm'>
          <div><div className='opacity-70'>Tokens +</div><div className='text-lg'>{fmt(meta?.totals?.tokensAdded)}</div></div>
          <div><div className='opacity-70'>Tokens −</div><div className='text-lg'>{fmt(meta?.totals?.tokensRemoved)}</div></div>
          <div><div className='opacity-70'>Tokens old→new</div><div className='text-lg'>{fmt(meta?.totals?.oldTokens)} → {fmt(meta?.totals?.newTokens)}</div></div>
          <div><div className='opacity-70'>Δ %</div><div className='text-lg'>{Number(meta?.totals?.pct||0).toFixed(1)}%</div></div>
        </div>
      </section>

      {/* Tabla */}
      <section className='p-8 pt-4'>
        <div className='card p-4 overflow-hidden'>
          <table className='w-full text-xs'>
            <thead className='opacity-80'>
              <tr>
                <th className='text-left p-2'>Subject</th>
                <th className='text-left p-2'>Title</th>
                <th className='text-left p-2'>Theme</th>
                <th className='text-left p-2'>Location</th>
                <th className='text-left p-2'>Changed</th>
                <th className='text-right p-2'>P + / − / Δ%</th>
                <th className='text-right p-2'>N + / − / Δ%</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r:any, i:number)=> {
                const PM = r.prompt?.metrics||{}, NM = r.negative?.metrics||{};
                return (
                  <tr key={r.fp||i} className='border-t border-white/10'>
                    <td className='p-2'>{r.subject||'—'}</td>
                    <td className='p-2'>{r.title||'—'}</td>
                    <td className='p-2'>{r.theme||'—'}</td>
                    <td className='p-2'>{r.location||'—'}</td>
                    <td className='p-2'>
                      {(r.changed||[]).length? (r.changed||[]).map((c:string,idx:number)=><span key={idx} className='chip'>{c}</span>) : <span className='chip' style={{opacity:0.7}}>no-change</span>}
                    </td>
                    <td className='p-2 text-right'>
                      +{fmt(PM.tokensAdded)} / −{fmt(PM.tokensRemoved)} / {(Number(PM.pctTokens||0)).toFixed(1)}%
                    </td>
                    <td className='p-2 text-right'>
                      +{fmt(NM.tokensAdded)} / −{fmt(NM.tokensRemoved)} / {(Number(NM.pctTokens||0)).toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className='px-8 pb-10 text-[11px] opacity-70'>
        <div>Notes: P = Prompt, N = Negative. Δ% calculado sobre tokens.</div>
      </section>
    </main>
  );
}

