-- Módulo financeiro Antum — migração 008: briefing do projeto (informações que o cliente envia para montarmos o serviço)
create table if not exists financeiro.briefings (
  id uuid primary key default gen_random_uuid(),
  assinatura_id uuid not null unique references financeiro.assinaturas(id) on delete cascade,
  cliente_id uuid not null references financeiro.clientes(id) on delete cascade,
  status text not null default 'RASCUNHO' check (status in ('RASCUNHO','ENVIADO','EM_PRODUCAO','CONCLUIDO')),
  dados jsonb not null default '{}'::jsonb,
  enviado_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists financeiro.briefing_arquivos (
  id uuid primary key default gen_random_uuid(),
  briefing_id uuid not null references financeiro.briefings(id) on delete cascade,
  nome text not null,
  mime text not null,
  tamanho int not null,
  conteudo bytea not null,
  created_at timestamptz not null default now()
);
create index if not exists briefing_arquivos_briefing_idx on financeiro.briefing_arquivos (briefing_id);

alter table financeiro.briefings enable row level security;
alter table financeiro.briefing_arquivos enable row level security;
do $$ declare t text; begin
  for t in select unnest(array['briefings','briefing_arquivos']) loop
    execute format('drop policy if exists antum_fin_all on financeiro.%I', t);
    execute format('create policy antum_fin_all on financeiro.%I for all to antum_fin using (true) with check (true)', t);
  end loop;
end $$;
grant select, insert, update on financeiro.briefings to antum_fin;
grant select, insert, update, delete on financeiro.briefing_arquivos to antum_fin;
