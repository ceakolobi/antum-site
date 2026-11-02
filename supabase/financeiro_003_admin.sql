-- Módulo financeiro Antum — migração 003: login do administrador, sessões e trilha de auditoria
create table if not exists financeiro.admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  senha_hash text not null,
  ativo boolean not null default true,
  falhas int not null default 0,
  bloqueado_ate timestamptz,
  ultimo_login_em timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists financeiro.admin_sessoes (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references financeiro.admins(id) on delete cascade,
  token_hash text not null unique,
  expira_em timestamptz not null,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists admin_sessoes_expira_idx on financeiro.admin_sessoes (expira_em);

-- Histórico de tudo que o administrador faz (quem, quando, o quê, de onde)
create table if not exists financeiro.auditoria (
  id uuid primary key default gen_random_uuid(),
  quando timestamptz not null default now(),
  admin_email text,
  acao text not null,
  detalhe jsonb,
  ip text
);
create index if not exists auditoria_quando_idx on financeiro.auditoria (quando desc);

alter table financeiro.admins enable row level security;
alter table financeiro.admin_sessoes enable row level security;
alter table financeiro.auditoria enable row level security;

do $$ declare t text; begin
  for t in select unnest(array['admins','admin_sessoes','auditoria']) loop
    execute format('drop policy if exists antum_fin_all on financeiro.%I', t);
    execute format('create policy antum_fin_all on financeiro.%I for all to antum_fin using (true) with check (true)', t);
  end loop;
end $$;

grant select, insert, update on financeiro.admins, financeiro.auditoria to antum_fin;
grant select, insert, update, delete on financeiro.admin_sessoes to antum_fin;
-- auditoria é só de acréscimo: o site nunca apaga nem altera registros antigos
revoke update, delete on financeiro.auditoria from antum_fin;
