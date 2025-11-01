-- scripts/sb_prompts_audit_versioning.sql
-- Ejecutar una sola vez en Supabase (SQL Editor)

-- Auditoría (genérica)
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  action text not null,
  entity text,
  meta jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_audit_created on audit_logs(created_at desc);

-- Versiones a nivel PACK (snapshot completo)
create table if not exists prompt_pack_versions (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid references prompt_packs(id) on delete cascade,
  pack_slug text,
  pack_name text,
  description text,
  items jsonb not null,              -- snapshot de prompt_items
  checksum text,                     -- hash de snapshot
  created_by uuid,
  created_at timestamptz default now()
);
create index if not exists idx_pack_versions_pack on prompt_pack_versions(pack_id, created_at desc);

