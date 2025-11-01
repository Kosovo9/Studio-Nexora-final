import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { z } from 'zod';
import { getObjectBuffer } from '@/lib/storage/s3';
import { svgWatermarkText } from '@/lib/imagery/svgWatermark';
import { verifyQuery } from '@/lib/security/sign';
import { ratelimit } from '@/lib/limit/mem';

const schema = z.object({
  key: z.string().min(3),
  w: z.coerce.number().int().min(1).max(4096).optional(),
  h: z.coerce.number().int().min(1).max(4096).optional(),
  fmt: z.enum(['webp','avif','jpeg','png']).default('webp').optional(),
  fit: z.enum(['cover','contain','inside','outside','fill']).default('cover').optional(),
  q: z.coerce.number().int().min(1).max(95).default(82).optional(),
  wm: z.coerce.number().int().transform(n=>n?1:0).optional(), // 0/1
  wmPos: z.enum(['center','north','south','east','west','northeast','northwest','southeast','southwest']).default('southeast').optional(),
  wmColor: z.string().regex(/^#?[0-9a-fA-F]{6}$/).optional(),
  wmOpacity: z.coerce.number().min(0).max(1).optional(),
  sig: z.string().optional()
});

const GRAVITY: Record<string, keyof sharp.GravityEnum | 'centre'> = {
  center: 'centre',
  north: 'north', south:'south', east:'east', west:'west',
  northeast:'northeast', northwest:'northwest', southeast:'southeast', southwest:'southwest'
};

export async function GET(req: Request) {
  try{
    const url = new URL(req.url);
    const params = url.searchParams;
    // rate limit por IP
    const ip = (req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'ip') as string;
    const rl = ratelimit('img:'+ip, 120, 60_000); // 120 req/min
    if (!rl.ok) return new NextResponse('Too Many Requests', { status:429 });

    const parse = schema.safeParse(Object.fromEntries(params.entries()));
    if (!parse.success) return NextResponse.json({ error: 'bad params', issues: parse.error.issues }, { status: 400 });
    const { key, w, h, fmt='webp', fit='cover', q=82, wm=0, wmPos='southeast', wmColor='#ffffff', wmOpacity=0.2 } = parse.data;

    // Seguridad: si no hay firma válida, sólo permitir claves bajo public/
    const allowUnsigned = key.startsWith('public/');
    if (!allowUnsigned) {
      if (!process.env.IMG_SIGN_SECRET) return NextResponse.json({ error:'signing not configured' }, { status: 500 });
      const ok = verifyQuery(params);
      if (!ok) return new NextResponse('Forbidden (signature)', { status: 403 });
    }

    const src = await getObjectBuffer(key);
    let img = sharp(src, { failOn: false }).rotate();

    if (w || h) {
      img = img.resize({ width: w, height: h, fit });
    }

    // Watermark opcional
    if (wm) {
      // Para dimensionar el SVG, necesitamos conocer tamaño destino
      const meta = await img.metadata();
      const W = meta.width || (w ?? 1024);
      const H = meta.height || (h ?? 1024);
      const svg = svgWatermarkText('Studio Nexora', { width: W, height: H, color: wmColor.startsWith('#')? wmColor : ('#'+wmColor), opacity: wmOpacity ?? 0.2 });
      img = img.composite([{ input: svg, gravity: GRAVITY[wmPos] || 'southeast' }]);
    }

    // Formato de salida
    const pipeline = ((): sharp.Sharp => {
      switch(fmt){
        case 'avif': return img.avif({ quality: q, effort: 4 });
        case 'jpeg': return img.jpeg({ quality: q, mozjpeg: true });
        case 'png':  return img.png({ compressionLevel: 8 });
        default:     return img.webp({ quality: q });
      }
    })();

    const data = await pipeline.toBuffer();

    // Cache headers + ETag
    const etag = 'W/'+Buffer.from(`${key}|${w||''}|${h||''}|${fmt}|${fit}|${q}|${wm}|${wmPos}|${wmColor}|${wmOpacity}`).toString('base64url');
    const headers = new Headers({
      'Content-Type': contentType(fmt),
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
      'ETag': etag
    });
    return new NextResponse(data, { status: 200, headers });
  }catch(e:any){
    return new NextResponse('Image error: '+(e?.message||'unknown'), { status: 500 });
  }
}

function contentType(fmt: string){
  switch(fmt){
    case 'avif': return 'image/avif';
    case 'jpeg': return 'image/jpeg';
    case 'png':  return 'image/png';
    default:     return 'image/webp';
  }
}

