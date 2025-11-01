import fs from 'node:fs';
import path from 'node:path';

export type SNVariant = {
  subject: 'hombre'|'mujer'|'perrito'|'perrita'|'ninio'|'ninia';
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  cfg_scale: number;
  seed: number;
  sampler: string;
  steps: number;
};

export type SNItem = {
  id: string;
  location: string;
  theme: string;
  variants: SNVariant[];
};

export function loadHalloweenPack(baseDir = process.cwd()) {
  const p = path.join(
    baseDir,
    'assets','prompts','halloween-dia-de-muertos',
    'prompts_master.json'
  );
  const raw = fs.readFileSync(p, 'utf-8');
  const json = JSON.parse(raw) as { pack: string; items: SNItem[] };
  return json;
}

