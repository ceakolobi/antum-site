-- Módulo financeiro Antum — migração 004: dados da empresa, modelos de contrato e contratos aceitos (com PDF)

-- Dados da Antum usados no contrato (editáveis no painel). Vazios até o administrador preencher.
create table if not exists financeiro.config (
  chave text primary key,
  valor text not null default '',
  updated_at timestamptz not null default now()
);
insert into financeiro.config (chave, valor) values
  ('empresa_razao', ''), ('empresa_cnpj', ''), ('empresa_endereco', ''),
  ('empresa_email', ''), ('empresa_foro', 'Comarca de Joinville/SC')
on conflict (chave) do nothing;
-- Dados do cartão CNPJ (13/10/2026). Só preenche se ainda estiver vazio; depois edite no painel.
update financeiro.config set valor = v.valor, updated_at = now()
  from (values
    ('empresa_razao','MARKA NOSSA SERVICOS ADMINISTRATIVOS LTDA (nome comercial ANTUM)'),
    ('empresa_cnpj','08.754.551/0001-52'),
    ('empresa_endereco','Rua Bernardo Aguiar, nº 352, Escritório, Centro, Barra Velha/SC, CEP 88.390-000')
  ) as v(chave, valor)
 where config.chave = v.chave and config.valor = '';

-- Modelos de contrato: texto com {{variaveis}}. Editar o modelo NUNCA altera contratos já aceitos.
create table if not exists financeiro.contrato_modelos (
  slug text primary key,
  titulo text not null,
  versao text not null,
  texto text not null,
  ativo boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Contrato aceito: cópia exata do texto, hash, PDF, e a prova do aceite (data, hora, IP, navegador)
create table if not exists financeiro.contratos (
  id uuid primary key default gen_random_uuid(),
  assinatura_id uuid not null unique references financeiro.assinaturas(id),
  cliente_id uuid not null references financeiro.clientes(id),
  modelo_slug text,
  versao text not null,
  titulo text not null,
  texto text not null,
  texto_sha256 text not null,
  pdf bytea,
  aceite_em timestamptz not null default now(),
  aceite_ip text,
  aceite_user_agent text,
  email_status text not null default 'PENDENTE' check (email_status in ('PENDENTE','ENVIADO','FALHA','SEM_CHAVE')),
  email_enviado_em timestamptz,
  email_erro text,
  created_at timestamptz not null default now()
);

alter table financeiro.config enable row level security;
alter table financeiro.contrato_modelos enable row level security;
alter table financeiro.contratos enable row level security;
do $$ declare t text; begin
  for t in select unnest(array['config','contrato_modelos','contratos']) loop
    execute format('drop policy if exists antum_fin_all on financeiro.%I', t);
    execute format('create policy antum_fin_all on financeiro.%I for all to antum_fin using (true) with check (true)', t);
  end loop;
end $$;
grant select, insert, update on financeiro.config, financeiro.contrato_modelos, financeiro.contratos to antum_fin;
-- contrato aceito não pode ser apagado pelo site
revoke delete on financeiro.contratos from antum_fin;

insert into financeiro.contrato_modelos (slug, titulo, versao, texto) values ('padrao', 'Contrato de Prestação de Serviços', 'contrato-v1-2026-11',
$contrato$CONTRATO DE PRESTAÇÃO DE SERVIÇOS — {{plano_nome}}

CONTRATADA: {{empresa_razao}}, inscrita no CNPJ nº {{empresa_cnpj}}, com sede em {{empresa_endereco}}{{empresa_email_trecho}} (doravante "ANTUM").

CONTRATANTE: {{cliente_nome}}, {{cliente_doc_rotulo}} nº {{cliente_doc}}, com endereço em {{cliente_endereco}}, e-mail {{cliente_email}}, celular {{cliente_celular}} (doravante "CLIENTE").

CLÁUSULA 1 – DO OBJETO
1.1. Este contrato tem por objeto a prestação, pela ANTUM ao CLIENTE, do plano "{{plano_nome}}", que inclui:
{{recursos_lista}}
1.2. {{condicoes}}
1.3. Serviços adicionais, personalizações e implantações fora do escopo do plano poderão ser contratados à parte, com preço próprio, e não se confundem com a mensalidade.

CLÁUSULA 2 – DO PREÇO E DO PAGAMENTO
2.1. O CLIENTE pagará à ANTUM a mensalidade de {{valor_mensal}}, com vencimento todo dia {{vencimento_dia}}, por {{forma_pagamento}}, por meio da plataforma de pagamentos Asaas.
{{bloco_implantacao}}
{{bloco_trial}}
2.2. O valor registrado neste contrato fica mantido para esta contratação, ainda que a ANTUM altere os valores de tabela para novos clientes. Qualquer reajuste dependerá de comunicação prévia por escrito, com pelo menos 30 dias de antecedência.
2.3. Em caso de atraso, incidirá multa fixa de {{multa_fixa}} por cobrança em atraso.

CLÁUSULA 3 – DA VIGÊNCIA, DO CANCELAMENTO E DA SUSPENSÃO
3.1. O contrato vigora por prazo indeterminado, com cobrança mensal.
3.2. Qualquer das partes poderá cancelá-lo a qualquer tempo, por comunicação escrita (e-mail), sem multa de rescisão, com efeitos ao final do período mensal em curso. Os valores vencidos até o cancelamento continuam devidos.
3.3. Havendo atraso superior a 15 (quinze) dias, a ANTUM poderá suspender os serviços até a regularização.

CLÁUSULA 4 – DA HOSPEDAGEM E DO DOMÍNIO
4.1. A hospedagem é fornecida pela ANTUM enquanto o contrato estiver vigente.
4.2. O domínio, quando necessário, é contratado e pago pelo CLIENTE e permanece de sua titularidade.

CLÁUSULA 5 – DAS RESPONSABILIDADES
5.1. A ANTUM executará os serviços com diligência e boa técnica.
5.2. O CLIENTE fornecerá as informações, conteúdos e autorizações necessários, responsabilizando-se pela licitude e pelo direito de uso do que fornecer.
5.3. Recursos de inteligência artificial e de atendimento automatizado podem produzir respostas imprecisas; cabe ao CLIENTE supervisionar o uso nos seus processos comerciais.

CLÁUSULA 6 – DA PROTEÇÃO DE DADOS
6.1. As partes tratarão os dados pessoais em conformidade com a Lei nº 13.709/2018 (LGPD), utilizando-os apenas para a execução deste contrato, para cobrança e para cumprimento de obrigações legais.

CLÁUSULA 7 – DO ACEITE ELETRÔNICO
7.1. O CLIENTE declara ter lido e concordado com este contrato. O aceite eletrônico, com registro de data, hora, endereço IP e versão do documento, vale como assinatura. Uma cópia em PDF é enviada ao e-mail informado.

CLÁUSULA 8 – DO FORO
8.1. Fica eleito o foro da {{empresa_foro}} para dirimir dúvidas decorrentes deste contrato.$contrato$)
on conflict (slug) do nothing;
