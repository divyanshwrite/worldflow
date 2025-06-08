-- Nodes table
create table if not exists nodes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  x float not null,
  y float not null,
  label text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Edges table
create table if not exists edges (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  source text not null,
  target text not null,
  label text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Realtime
alter table nodes enable row level security;
alter table edges enable row level security; 