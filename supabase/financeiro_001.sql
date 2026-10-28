-- Módulo financeiro Antum + Asaas — migração 001
-- Schema próprio 'financeiro' (fora da API pública do Supabase). Acesso só pelo papel antum_fin.
create schema if not exists financeiro;


create table if not exists financeiro.planos (
  slug text primary key,
  nome text not null,
  valor numeric(10,2) not null check (valor > 0),
  automatico boolean not null default false,
  dias_vencimento int[] not null default '{5,8,21}',
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);
insert into financeiro.planos (slug, nome, valor, automatico)
values ('marina-sdr', 'Marina SDR', 59.90, true)
on conflict (slug) do nothing;

create table if not exists financeiro.convites (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  plano_nome text not null,
  valor numeric(10,2) not null check (valor > 0),
  vencimento_dia int not null check (vencimento_dia between 1 and 28),
  nome_ref text,
  email_ref text,
  expira_em timestamptz not null,
  cpf_cnpj_vinculado text,
  concluido_em timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists financeiro.clientes (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('PF','PJ')),
  nome text not null,
  cpf_cnpj text not null unique,
  email text not null,
  telefone text,
  celular text,
  cep text not null,
  endereco text not null,
  numero text not null,
  complemento text,
  bairro text not null,
  cidade text not null,
  uf text not null,
  asaas_customer_id text unique,
  status_cadastro text not null default 'RECEBIDO'
    check (status_cadastro in ('RECEBIDO','CONCLUIDO','ERRO')),
  ultimo_erro text,
  aceite_em timestamptz not null,
  aceite_ip text,
  aceite_user_agent text,
  aceite_versao text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists financeiro.assinaturas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references financeiro.clientes(id),
  convite_id uuid references financeiro.convites(id),
  plano_slug text references financeiro.planos(slug),
  plano_nome text not null,
  valor numeric(10,2) not null,
  vencimento_dia int not null,
  forma_pagamento text not null check (forma_pagamento in ('PIX','BOLETO')),
  asaas_subscription_id text unique,
  status text not null default 'CRIANDO'
    check (status in ('CRIANDO','ATIVA','ERRO','CANCELADA')),
  ultimo_erro text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists financeiro.cobrancas (
  id uuid primary key default gen_random_uuid(),
  asaas_payment_id text not null unique,
  assinatura_id uuid references financeiro.assinaturas(id),
  cliente_id uuid references financeiro.clientes(id),
  valor numeric(10,2) not null,
  valor_original numeric(10,2),
  multa_aplicada numeric(10,2) not null default 0,
  vencimento date not null,
  status text not null,
  forma_pagamento text,
  invoice_url text,
  boleto_url text,
  pago_em timestamptz,
  ultimo_evento_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists financeiro.eventos (
  asaas_event_id text primary key,
  evento text not null,
  payload jsonb not null,
  recebido_em timestamptz not null default now(),
  processado_em timestamptz,
  resultado text
);

create table if not exists financeiro.emails (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references financeiro.clientes(id),
  tipo text not null,
  destinatario text not null,
  status text not null default 'PENDENTE' check (status in ('PENDENTE','ENVIADO','FALHA')),
  erro text,
  tentativas int not null default 0,
  created_at timestamptz not null default now(),
  enviado_em timestamptz
);

alter table financeiro.planos enable row level security;
alter table financeiro.convites enable row level security;
alter table financeiro.clientes enable row level security;
alter table financeiro.assinaturas enable row level security;
alter table financeiro.cobrancas enable row level security;
alter table financeiro.eventos enable row level security;
alter table financeiro.emails enable row level security;

-- Papel restrito do servidor do site (a senha é definida fora do git, no painel)
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'antum_fin') then
    create role antum_fin login noinherit nobypassrls nosuperuser nocreatedb nocreaterole;
  end if;
end $$;
grant usage on schema financeiro to antum_fin;
grant select, insert, update on all tables in schema financeiro to antum_fin;
alter default privileges in schema financeiro grant select, insert, update on tables to antum_fin;
revoke all on schema public from antum_fin;
do $$ declare t text; begin
  for t in select tablename from pg_tables where schemaname = 'financeiro' loop
    execute format('drop policy if exists antum_fin_all on financeiro.%I', t);
    execute format('create policy antum_fin_all on financeiro.%I for all to antum_fin using (true) with check (true)', t);
  end loop;
end $$;
