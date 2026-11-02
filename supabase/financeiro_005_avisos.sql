-- Módulo financeiro Antum — migração 005: chave única nos e-mails de aviso (evita enviar o mesmo aviso duas vezes)
alter table financeiro.emails add column if not exists chave text;
create unique index if not exists emails_chave_uq on financeiro.emails (chave);
grant select, insert, update on financeiro.emails to antum_fin;
