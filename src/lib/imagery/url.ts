import { signQuery } from '@/lib/security/sign';

type Opts = {
  key: string;
  w?: number; h?: number;
  fmt?: 'webp'|'avif'|'jpeg'|'png';
  fit?: 'cover'|'contain'|'inside'|'outside'|'fill';
  q?: number;
  wm?: 0|1;                 // watermark on/off
  wmPos?: 'center'|'north'|'south'|'east'|'west'|'northeast'|'northwest'|'southeast'|'southwest';
  wmColor?: string;         // e.g. #ffffff
  wmOpacity?: number;       // 0..1
};
export function buildImgUrl(o: Opts){
  const params: Record<string,any> = {
    key:o.key, w:o.w, h:o.h, fmt:o.fmt, fit:o.fit, q:o.q,
    wm:o.wm, wmPos:o.wmPos, wmColor:o.wmColor, wmOpacity:o.wmOpacity
  };
  // firma
  const sig = signQuery(params);
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k,v])=>{ if(v!==undefined && v!==null && v!=='') usp.set(k, String(v));});
  usp.set('sig', sig);
  return '/api/img/resize?'+usp.toString();
}

