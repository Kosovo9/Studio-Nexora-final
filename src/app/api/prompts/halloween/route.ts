import { NextResponse } from 'next/server';
import { loadHalloweenPack } from '@/lib/prompts/halloween';

export async function GET() {
  try {
    const data = loadHalloweenPack(process.cwd());
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'load error' }, { status: 500 });
  }
}

