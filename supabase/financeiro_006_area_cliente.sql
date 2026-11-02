-- Módulo financeiro Antum — migração 006: área do cliente (login, sessões e links de senha)
create table if not exists financeiro.cliente_acessos (
  cliente_id uuid primary key references financeiro.clientes(id) on delete cascade,
  email text not null unique,
  senha_hash text,
  falhas int not null default 0,
  bloqueado_ate timestamptz,
  ultimo_login_em timestamptz,
  created_at timestamptz not null default now()
);

-- Links de "definir senha" (primeiro acesso) e "esqueci minha senha": guardamos só o hash, vale uma vez
create table if not exists financeiro.cliente_tokens (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references financeiro.clientes(id) on delete cascade,
  tipo text not null check (tipo in ('definir','reset')),
  token_hash text not null unique,
  expira_em timestamptz not null,
  usado_em timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists financeiro.cliente_sessoes (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references financeiro.clientes(id) on delete cascade,
  token_hash text not null unique,
  expira_em timestamptz not null,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists cliente_sessoes_expira_idx on financeiro.cliente_sessoes (expira_em);

alter table financeiro.cliente_acessos enable row level security;
alter table financeiro.cliente_tokens enable row level security;
alter table financeiro.cliente_sessoes enable row level security;
do $$ declare t text; begin
  for t in select unnest(array['cliente_acessos','cliente_tokens','cliente_sessoes']) loop
    execute format('drop policy if exists antum_fin_all on financeiro.%I', t);
    execute format('create policy antum_fin_all on financeiro.%I for all to antum_fin using (true) with check (true)', t);
  end loop;
end $$;
grant select, insert, update on financeiro.cliente_acessos to antum_fin;
grant select, insert, update, delete on financeiro.cliente_tokens, financeiro.cliente_sessoes to antum_fin;
