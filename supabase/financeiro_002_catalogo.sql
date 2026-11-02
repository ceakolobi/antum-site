-- Módulo financeiro Antum — migração 002: catálogo de produtos/planos editável + congelamento do preço
-- Preços, descrições e condições vivem AQUI (banco), nunca no código. O admin edita pelo painel.

alter table financeiro.planos
  add column if not exists descricao text,
  add column if not exists recursos text[] not null default '{}',
  add column if not exists taxa_implantacao numeric(10,2) not null default 0 check (taxa_implantacao >= 0),
  add column if not exists trial_dias int not null default 0 check (trial_dias between 0 and 60),
  add column if not exists requer_aprovacao boolean not null default false,
  add column if not exists contrato_modelo text,
  add column if not exists condicoes text,
  add column if not exists ordem int not null default 100,
  add column if not exists updated_at timestamptz not null default now();

-- "automatico" (002 em diante: requer_aprovacao) — mantém coerência com o que já existia
update financeiro.planos set requer_aprovacao = not automatico where requer_aprovacao = false and automatico = false;

-- Convites (links do admin) também podem carregar teste, implantação e aprovação
alter table financeiro.convites
  add column if not exists taxa_implantacao numeric(10,2) not null default 0 check (taxa_implantacao >= 0),
  add column if not exists trial_dias int not null default 0 check (trial_dias between 0 and 60),
  add column if not exists requer_aprovacao boolean not null default false;

-- Cada contratação guarda uma FOTO do que valia no dia: alterar o catálogo depois NÃO muda contratos antigos
alter table financeiro.assinaturas
  add column if not exists taxa_implantacao numeric(10,2) not null default 0,
  add column if not exists trial_dias int not null default 0,
  add column if not exists plano_snapshot jsonb;

alter table financeiro.assinaturas drop constraint if exists assinaturas_status_check;
alter table financeiro.assinaturas
  add constraint assinaturas_status_check
  check (status in ('AGUARDANDO_APROVACAO','CRIANDO','ATIVA','ERRO','CANCELADA'));

-- Catálogo inicial (ON CONFLICT DO NOTHING: nunca sobrescreve o que o admin já editou)
insert into financeiro.planos (slug, nome, valor, automatico, requer_aprovacao, ordem, descricao, recursos, condicoes) values
('site-profissional', 'Site Profissional', 70.00, true, false, 10,
 'Site profissional responsivo, com hospedagem e SSL incluídos.',
 array['Site profissional responsivo','Hospedagem incluída','Certificado SSL','Otimização básica para mecanismos de busca','Formulário de contato','E-mails profissionais conforme configuração do plano'],
 'Hospedagem fornecida pela Antum. Domínio contratado e pago pelo cliente, quando necessário. Serviços adicionais podem ser incluídos individualmente.'),
('site-vera', 'Site + Vera SDR (IA)', 99.00, true, false, 20,
 'Site profissional com a Vera, atendente comercial com inteligência artificial.',
 array['Todos os recursos do Site Profissional','Atendente comercial com inteligência artificial','Atendimento automatizado','Qualificação de potenciais clientes','Integração com WhatsApp conforme disponibilidade e configuração','Automação do primeiro atendimento'],
 'Hospedagem fornecida pela Antum. Domínio contratado e pago pelo cliente, quando necessário. Serviços adicionais podem ser incluídos individualmente.'),
('loja-vera', 'Loja Virtual + Vera SDR', 180.00, true, false, 30,
 'Loja virtual completa com atendimento automatizado pela Vera.',
 array['Loja virtual','Cadastro de produtos','Gestão de catálogo','Estrutura para vendas online','Vera SDR com inteligência artificial','Atendimento automatizado aos interessados'],
 'Hospedagem fornecida pela Antum. Domínio contratado e pago pelo cliente, quando necessário. Serviços adicionais podem ser incluídos individualmente.'),
('site-crm-vera', 'Site + CRM + Vera SDR', 350.00, true, false, 40,
 'Site, CRM para gestão de clientes e leads, e a Vera atendendo seus interessados.',
 array['Site profissional','CRM para gestão de clientes','Cadastro e acompanhamento de leads','Gestão comercial','Vera SDR com inteligência artificial','Integração dos processos comerciais'],
 'Hospedagem fornecida pela Antum. Domínio contratado e pago pelo cliente, quando necessário. Serviços adicionais podem ser incluídos individualmente.'),
('site-sistema-vera', 'Site + Sistema + Vera SDR', 420.00, false, true, 50,
 'Site, sistema personalizado conforme o escopo contratado e a Vera atendendo seus interessados.',
 array['Site profissional','Sistema personalizado conforme escopo contratado','Área administrativa','Gestão de informações','Vera SDR com inteligência artificial','Integração entre site, sistema e atendimento'],
 'Sistema conforme escopo combinado com a Antum (a contratação aguarda aprovação). Hospedagem fornecida pela Antum. Domínio contratado e pago pelo cliente, quando necessário.'),
('crm-antum', 'CRM ANTUM', 169.90, true, false, 60,
 'CRM para organizar clientes, leads e oportunidades.',
 array['Gestão de clientes','Cadastro de leads','Acompanhamento comercial','Gestão de contatos','Organização de oportunidades','Painel administrativo'],
 'Hospedagem fornecida pela Antum. Serviços adicionais podem ser incluídos individualmente.')
on conflict (slug) do nothing;

-- Marina SDR (já existia): descrição e teste de 7 dias, só se o admin ainda não editou
update financeiro.planos
   set descricao = 'Atendente de IA no WhatsApp: responde, qualifica e agenda por você, 24 horas por dia.',
       recursos = array['Atendimento automático no WhatsApp','Qualificação de interessados','Painel para acompanhar as conversas','7 dias de teste'],
       trial_dias = 7, ordem = 5,
       condicoes = '7 dias de uso para testar. Depois, a cobrança mensal é emitida; você pode antecipar o pagamento quando quiser pela área do cliente.'
 where slug = 'marina-sdr' and descricao is null;
