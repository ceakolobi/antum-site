-- Módulo financeiro Antum — migração 007: bloqueio e desbloqueio de serviço (por assinatura)
alter table financeiro.assinaturas add column if not exists bloqueada boolean not null default false;
alter table financeiro.assinaturas add column if not exists bloqueada_em timestamptz;
alter table financeiro.assinaturas add column if not exists bloqueio_motivo text;
