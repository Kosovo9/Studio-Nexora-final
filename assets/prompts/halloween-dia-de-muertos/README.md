
# Studio Nexora — Prompt Pack: Halloween & Día de Muertos (v1)

Contenido:
- `prompts_master.json` · 100 super prompts × 6 variantes (600 total) con metadatos.
- `google_ai_studio.jsonl` · 600 líneas para colas/lotes.
- `wan2.jsonl` · 600 líneas genéricas.
- `pixverse_prompts.txt` · 600 prompts en texto (con NEG).
- `grok_prompts.txt` · 600 prompts en texto (con NEG).
- `families_groups.jsonl` · 24 prompts para familias y/o grupos.

Notas de estilo (común a todos):
- Hiperrealista 8K, respeto absoluto de rasgos físicos/faciales originales.
- Sin gore/violencia. Representación cultural respetuosa.
- `NEG` incluye artefactos y deformaciones frecuentes.

---

## Integración express en Studio Nexora Final (Next.js/TS)

Estructura sugerida (Windows):
```
C:\studio-nexora\assets\prompts\halloween-dia-de-muertos\
  ├─ prompts_master.json
  ├─ google_ai_studio.jsonl
  ├─ wan2.jsonl
  ├─ pixverse_prompts.txt
  ├─ grok_prompts.txt
  └─ families_groups.jsonl
```

TypeScript helper (`/lib/prompts/halloween.ts`):
```ts
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
}

export type SNItem = {
  id: string;
  location: string;
  theme: string;
  variants: SNVariant[];
}

export function loadHalloweenPack(baseDir = process.cwd()) {
  const p = path.join(baseDir, 'assets', 'prompts', 'halloween-dia-de-muertos', 'prompts_master.json');
  const raw = fs.readFileSync(p, 'utf-8');
  const json = JSON.parse(raw) as { pack: string; items: SNItem[] };
  return json;
}
```

Uso en servidor (Next.js Route Handler):
```ts
// app/api/prompts/halloween/route.ts
import { NextResponse } from 'next/server';
import { loadHalloweenPack } from '@/lib/prompts/halloween';

export async function GET() {
  const data = loadHalloweenPack(process.cwd());
  return NextResponse.json(data);
}
```

Comandos listos para pegar en CURSOR (PowerShell):
```powershell
# 1) Rutas
$root = 'C:\studio-nexora'
$dest = Join-Path $root 'assets\prompts\halloween-dia-de-muertos'
New-Item -ItemType Directory -Force -Path $dest | Out-Null

# 2) Descarga manual del ZIP y extracción
# Descarga el archivo ZIP y colócalo en Descargas con el nombre indicado.
$zipFile = "$env:USERPROFILE\Downloads\studio_nexora_prompts_halloween_muertos_v1.zip"
Expand-Archive -Path $zipFile -DestinationPath $dest -Force

# 3) Crear helper TS
$lib = Join-Path $root 'lib\prompts'
New-Item -ItemType Directory -Force -Path $lib | Out-Null
$helperPath = Join-Path $lib 'halloween.ts'
@"
import fs from 'node:fs';
import path from 'node:path';
export function loadHalloweenPack(baseDir = process.cwd()) {
  const p = path.join(baseDir, 'assets', 'prompts', 'halloween-dia-de-muertos', 'prompts_master.json');
  const raw = fs.readFileSync(p, 'utf-8');
  return JSON.parse(raw);
}
"@ | Set-Content -Encoding UTF8 $helperPath

# 4) Git rápido (opcional)
Set-Location $root
git add .
git commit -m "feat(prompts): Halloween & Día de Muertos pack v1 (600 + familias)"
git push
```

Adaptadores por plataforma (genéricos):
- Google AI Studio: usa `google_ai_studio.jsonl` (`input_text`, `negative_text`) en colas/batch.
- Grok: copia desde `grok_prompts.txt` por bloque [ID].
- PixVerse/Pixaverse: usa `pixverse_prompts.txt` (texto + NEG).
- Wan 2: consume `wan2.jsonl` con campos estándar (input_text, negative_text, ancho/alto).
```

Licencia & uso:
Prompts originales por Studio Nexora. Uso interno/comercial permitido para el ecosistema Nexora.
