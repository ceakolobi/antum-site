-- Módulo financeiro Antum + Asaas — migração 001
-- Todas as tabelas com RLS ligado e SEM políticas: só o backend (service_role) acessa.

create table if not exists public.fin_planos (
  slug text primary key,
  nome text not null,
  valor numeric(10,2) not null check (valor > 0),
  automatico boolean not null default false,
  dias_vencimento int[] not null default '{5,8,21}',
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);
insert into public.fin_planos (slug, nome, valor, automatico)
values ('marina-sdr', 'Marina SDR', 59.90, true)
on conflict (slug) do nothing;

create table if not exists public.fin_convites (
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

create table if not exists public.fin_clientes (
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

create table if not exists public.fin_assinaturas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.fin_clientes(id),
  convite_id uuid references public.fin_convites(id),
  plano_slug text references public.fin_planos(slug),
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

create table if not exists public.fin_cobrancas (
  id uuid primary key default gen_random_uuid(),
  asaas_payment_id text not null unique,
  assinatura_id uuid references public.fin_assinaturas(id),
  cliente_id uuid references public.fin_clientes(id),
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

create table if not exists public.fin_eventos (
  asaas_event_id text primary key,
  evento text not null,
  payload jsonb not null,
  recebido_em timestamptz not null default now(),
  processado_em timestamptz,
  resultado text
);

create table if not exists public.fin_emails (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references public.fin_clientes(id),
  tipo text not null,
  destinatario text not null,
  status text not null default 'PENDENTE' check (status in ('PENDENTE','ENVIADO','FALHA')),
  erro text,
  tentativas int not null default 0,
  created_at timestamptz not null default now(),
  enviado_em timestamptz
);

alter table public.fin_planos enable row level security;
alter table public.fin_convites enable row level security;
alter table public.fin_clientes enable row level security;
alter table public.fin_assinaturas enable row level security;
alter table public.fin_cobrancas enable row level security;
alter table public.fin_eventos enable row level security;
alter table public.fin_emails enable row level security;
