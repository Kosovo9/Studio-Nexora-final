import { NextResponse } from 'next/server';
import { loadHalloweenFamilies } from '@/lib/prompts/halloween';

export async function GET() {
  try {
    const data = loadHalloweenFamilies(process.cwd());
    return NextResponse.json({ items: data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'load error' }, { status: 500 });
  }
}

