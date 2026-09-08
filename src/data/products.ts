import { Product } from '../types';

export const productsData: Product[] = [
  {
    id: 'marina-sdr',
    name: 'Marina — SDR de Inteligência Artificial',
    slug: 'marina-sdr',
    category: 'Agentes',
    categoryLabel: 'Agentes de IA & Vendas',
    badge: 'Flagship ANTUM',
    commercialHeadline: 'Sua prospecção e qualificação comercial trabalhando 24 horas por dia, 7 dias por semana.',
    shortDescription: 'Agente inteligente capaz de engajar leads instantaneamente, responder dúvidas complexas, contornar objeções e entregar oportunidades qualificadas prontas no CRM.',
    description: 'A Marina não é um chatbot baseado em menus ou árvores de decisão engessadas. Ela é uma SDR autônoma construída com modelos de linguagem avançados e orquestração em tempo real. Entende o contexto da empresa visitante, investiga dores reais e conduz o lead até a reunião com seu executivo de contas.',
    heroImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    ],
    problemBefore: {
      title: 'Antes da Marina',
      points: [
        'Leads que chegam à noite ou nos fins de semana esperam mais de 12 horas por uma resposta humana.',
        'SDRs juniores gastam 70% do tempo fazendo triagem básica e preenchendo campos de CRM em vez de gerar receita.',
        'Taxa de no-show elevada por falta de contextualização ágil e aquecimento da oportunidade.',
      ],
      consequence: 'Perda de até 45% dos leads quentes para concorrentes mais ágeis.',
    },
    solutionNow: {
      title: 'Agora com a Marina',
      points: [
        'Primeiro contato em menos de 15 segundos em qualquer canal (site, WhatsApp, formulários).',
        'Qualificação profunda via critérios BANT/MEDDIC adaptados ao segmento da sua empresa.',
        'Agendamento automático direto na agenda do vendedor e registro completo no CRM.',
      ],
      outcome: 'Pipeline alimentado com reuniões qualificadas sem sobrecarregar seu time comercial.',
    },
    workflowSteps: [
      {
        step: 1,
        title: 'Captura Instantânea',
        description: 'O visitante interage no site ou canal de entrada.',
        detail: 'Detecção imediata de intenção de compra e contexto corporativo.',
      },
      {
        step: 2,
        title: 'Qualificação Contextual',
        description: 'A Marina faz perguntas estratégicas e esclarece dúvidas.',
        detail: 'Compreensão de orçamento, volume, ferramentas atuais e urgência.',
      },
      {
        step: 3,
        title: 'Tratamento de Objeções',
        description: 'Respostas fundamentadas no manual de vendas da empresa.',
        detail: 'Explica diferenciais competitivos e segurança da solução.',
      },
      {
        step: 4,
        title: 'Conversão & Entrega',
        description: 'Oportunidade criada no CRM com histórico e reunião agendada.',
        detail: 'Notificação instantânea para o executivo de contas via Slack/WhatsApp.',
      },
    ],
    features: [
      {
        title: 'Compreensão Semântica Natural',
        description: 'Interpreta linguagem coloquial, áudios e mensagens complexas sem travar em menus rígidos.',
        icon: 'Brain',
      },
      {
        title: 'Sincronização Bidirecional com CRM',
        description: 'Atualiza campos personalizados, tags de interesse e grava a transcrição completa.',
        icon: 'RefreshCw',
      },
      {
        title: 'Agendamento Direto em Calendário',
        description: 'Verifica disponibilidade em tempo real no Google Calendar ou Outlook e envia convites.',
        icon: 'Calendar',
      },
      {
        title: 'Roteamento Inteligente por Regras',
        description: 'Distribui leads conforme segmento, faturamento ou regras de território da sua equipe.',
        icon: 'Network',
      },
    ],
    benefits: [
      {
        metric: '< 15s',
        label: 'Tempo de Primeira Resposta',
        description: 'Engajamento imediato no momento de pico de interesse do potencial cliente.',
      },
      {
        metric: '24/7',
        label: 'Disponibilidade Total',
        description: 'Atendimento comercial ativo em noites, feriados e fins de semana.',
      },
      {
        metric: '+60%',
        label: 'Capacidade de Agendamentos',
        description: 'Mais reuniões confirmadas na agenda de quem realmente fecha contratos.',
      },
    ],
    targetAudience: [
      {
        profile: 'Empresas B2B & SaaS',
        useCase: 'Triagem de inbound e qualificação de empresas com perfil de cliente ideal (ICP).',
      },
      {
        profile: 'Indústrias & Distribuidoras',
        useCase: 'Atendimento a pedidos de cotação técnica com múltiplos parâmetros.',
      },
      {
        profile: 'Serviços Financeiros & Consultorias',
        useCase: 'Coleta preliminar de dados e encaminhamento para especialistas corretos.',
      },
    ],
    integrations: ['HubSpot', 'Salesforce', 'RD Station', 'Pipedrive', 'WhatsApp Business API', 'Google Calendar', 'Slack'],
    ctaText: 'Falar com a Marina agora',
    seoTitle: 'Marina SDR de IA | Prospecção e Qualificação Autônoma — ANTUM',
    seoDescription: 'Conheça a Marina, SDR de Inteligência Artificial criada pela ANTUM para qualificar leads, responder objeções e agendar reuniões comerciais 24/7.',
    demoType: 'chat',
  },
  {
    id: 'harmony',
    name: 'Harmony — CRM de Proteção Veicular com IA',
    slug: 'harmony',
    category: 'SaaS',
    categoryLabel: 'SaaS Multi-Tenant & Agente de IA',
    badge: 'Produto ANTUM',
    commercialHeadline: 'Gestão completa de associação de proteção veicular — da cotação ao contrato, com IA integrada.',
    shortDescription: 'Plataforma SaaS multi-tenant para associações de proteção veicular. CRM, cotações, contratos, vistorias e mensalidades — tudo automatizado com Emily, a SDR de IA integrada.',
    description: 'O Harmony é um sistema de gestão completo para associações de proteção veicular (modelo mutualista conforme LC 213/2025). Cobre todo o ciclo do associado: captação via agente de IA (Emily), cotação inteligente com tabela FIPE, contratação digital, vistoria remota e gestão financeira de mensalidades.',
    heroImage: '/assets/harmony-hero.png',
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    ],
    problemBefore: {
      title: 'Antes do Harmony',
      points: [
        'Gestão fragmentada em planilhas, WhatsApp e sistemas genéricos sem integração real.',
        'Leads do site sem resposta automatizada — oportunidades perdidas fora do horário comercial.',
        'Vistorias agendadas manualmente e documentos de contrato preenchidos à mão, gerando retrabalho.',
      ],
      consequence: 'Taxa de conversão baixa e custo operacional elevado para escalar a carteira de associados.',
    },
    solutionNow: {
      title: 'Agora com o Harmony',
      points: [
        'Emily (SDR de IA) atende leads 24/7 no site e WhatsApp, faz cotação automática e fecha a contratação.',
        'Painel completo de CRM: leads, cotações, contratos, vistorias e financeiro em uma tela só.',
        'Contratos digitais gerados automaticamente e vistorias remotas com token seguro enviado por WhatsApp.',
      ],
      outcome: 'Carteira de associados crescendo de forma autônoma com operação enxuta e rastreável.',
    },
    workflowSteps: [
      {
        step: 1,
        title: 'Captação Inteligente',
        description: 'Emily atende o visitante no site e coleta nome, telefone e placa do veículo.',
        detail: 'Lead criado automaticamente no CRM com origem, data e canal de entrada.',
      },
      {
        step: 2,
        title: 'Cotação Automática',
        description: 'Sistema consulta tabela FIPE e calcula a mensalidade conforme o perfil do veículo.',
        detail: 'Apresentação dos planos e benefícios extras com total em tempo real.',
      },
      {
        step: 3,
        title: 'Contratação Digital',
        description: 'Contrato gerado automaticamente e enviado para assinatura digital.',
        detail: 'Vistoria remota agendada via link seguro — cliente envia fotos pelo celular.',
      },
      {
        step: 4,
        title: 'Gestão do Associado',
        description: 'Painel completo com mensalidades, benefícios ativos e histórico.',
        detail: 'Alertas automáticos de inadimplência e renovação para consultores e gerentes.',
      },
    ],
    features: [
      {
        title: 'Emily — SDR de IA Integrada',
        description: 'Agente de IA que vende e contrata sozinha no site e WhatsApp, sem intervenção humana.',
        icon: 'Brain',
      },
      {
        title: 'Multi-Tenant com Controle de Papéis',
        description: 'Isolamento total por empresa com hierarquia: consultor, gerente regional e admin.',
        icon: 'Shield',
      },
      {
        title: 'Cotação com Tabela FIPE',
        description: 'Cálculo de mensalidade em tempo real com 57 faixas de valor e benefícios extras.',
        icon: 'Calculator',
      },
      {
        title: 'Vistoria Remota por Link',
        description: 'Cliente realiza a vistoria pelo celular via link com token seguro e prazo de validade.',
        icon: 'Camera',
      },
    ],
    benefits: [
      {
        metric: '24/7',
        label: 'Vendas Autônomas com Emily',
        description: 'Contratações concluídas sem envolvimento da equipe comercial.',
      },
      {
        metric: '100%',
        label: 'Rastreabilidade da Operação',
        description: 'Cada lead, cotação, contrato e mensalidade com histórico completo e auditável.',
      },
      {
        metric: '-70%',
        label: 'Carga Operacional Administrativa',
        description: 'Contrato, vistoria e cobrança automatizados — equipe foca em relacionamento.',
      },
    ],
    targetAudience: [
      {
        profile: 'Associações de Proteção Veicular',
        useCase: 'Gestão completa da operação: captação, contratos, mensalidades e sinistros.',
      },
      {
        profile: 'Consultores de Vendas',
        useCase: 'Painel individual com carteira de clientes, comissões e metas em tempo real.',
      },
      {
        profile: 'Gerentes Regionais',
        useCase: 'Visão consolidada da regional com relatórios de desempenho e conversão.',
      },
    ],
    integrations: ['WhatsApp Business API', 'Anthropic API', 'Supabase', 'Tabela FIPE', 'Asaas (Pagamentos)', 'Google Calendar'],
    ctaText: 'Conhecer o Harmony',
    seoTitle: 'Harmony | CRM de Proteção Veicular com IA — ANTUM',
    seoDescription: 'Gerencie toda a operação de sua associação veicular com o Harmony: cotação automática, contratos digitais, vistoria remota e SDR de IA integrada.',
    demoType: 'pipeline',
  },
  {
    id: 'nexus-rpa',
    name: 'NEXUS RPA — Plataforma de RPA com Geração Automática de Robôs',
    slug: 'nexus-rpa',
    category: 'RPA',
    categoryLabel: 'Robotic Process Automation',
    badge: 'NEXUS RPA',
    commercialHeadline: 'Descreva o processo. O NEXUS RPA monta o robô e executa — sem programação manual.',
    shortDescription: 'Plataforma open-core de RPA que lê especificações técnicas em linguagem natural e auto-gera estruturas de robôs para sistemas legados, portais fiscais e ERPs desktop.',
    description: 'O NEXUS RPA combina IA generativa com o motor determinístico do rpaframework para criar uma nova categoria: RPA especificado. Você descreve o processo em linguagem estruturada, o NEXUS RPA sugere 3 arquiteturas de robô e monta o cenário de execução automaticamente. Sem jargão de programação, sem horas de configuração.',
    heroImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
    ],
    problemBefore: {
      title: 'Antes do NEXUS RPA',
      points: [
        'Configurar robôs de RPA exige programadores especializados e semanas de mapeamento de telas.',
        'Robôs quebram com qualquer mudança visual no sistema legado — manutenção constante e cara.',
        'Portais governamentais, ERPs desktop e sistemas sem API ficam de fora de qualquer automação.',
      ],
      consequence: 'RPA caro, frágil e restrito a quem tem orçamento e equipe técnica especializada.',
    },
    solutionNow: {
      title: 'Agora com o NEXUS RPA',
      points: [
        'Preenchimento de spec estruturada por departamento → sistema sugere 3 arquiteturas de robô prontas.',
        'Motor adaptativo com Browser Use como fallback para UIs instáveis (Receita Federal, SPAs).',
        'Execução em servidor dedicado ou na máquina local, com relatório de auditoria automático.',
      ],
      outcome: 'RPA acessível para qualquer empresa — do escritório contábil à indústria com ERP legado.',
    },
    workflowSteps: [
      {
        step: 1,
        title: 'Especificação do Processo',
        description: 'Preenchimento da spec estruturada: sistema, telas, ações, validações e destino.',
        detail: 'Formulário guiado por departamento — nenhum conhecimento técnico necessário.',
      },
      {
        step: 2,
        title: 'Geração das Arquiteturas',
        description: 'IA analisa a spec e propõe 3 cenários de robô com trade-offs explicados.',
        detail: 'Escolha entre velocidade, resiliência ou compatibilidade com o sistema alvo.',
      },
      {
        step: 3,
        title: 'Execução Controlada',
        description: 'Robô iniciado com credenciais seguras e execução passo a passo auditada.',
        detail: 'Fallback automático para visão computacional quando seletores falham.',
      },
      {
        step: 4,
        title: 'Relatório & Alertas',
        description: 'Sumário de execução com itens processados, erros e prints de exceções.',
        detail: 'Notificação imediata por WhatsApp ou Slack quando intervenção humana for necessária.',
      },
    ],
    features: [
      {
        title: 'Gerador Spec → Robô',
        description: 'IA transforma especificação em linguagem natural em estrutura de robô executável.',
        icon: 'Cpu',
      },
      {
        title: 'Motor Determinístico + Adaptativo',
        description: 'rpaframework (Apache) como base sólida + Browser Use como fallback para SPAs e UIs instáveis.',
        icon: 'GitFork',
      },
      {
        title: 'Cofre de Credenciais Criptografado',
        description: 'Senhas e tokens gerenciados com isolamento por empresa e zero exposição.',
        icon: 'Lock',
      },
      {
        title: 'Suporte a Sistemas Legados Brasileiros',
        description: 'Módulos nativos para Receita Federal, eSocial, SINTEGRA, SAP e TOTVS Protheus.',
        icon: 'Terminal',
      },
    ],
    benefits: [
      {
        metric: '10x',
        label: 'Velocidade de Configuração',
        description: 'Robô especificado e rodando em horas, não semanas.',
      },
      {
        metric: 'Zero',
        label: 'Alteração em Sistemas Legados',
        description: 'Nenhuma modificação no seu software existente é necessária.',
      },
      {
        metric: '100%',
        label: 'Rastreabilidade de Execução',
        description: 'Cada ação do robô registrada com timestamp, resultado e evidência.',
      },
    ],
    targetAudience: [
      {
        profile: 'Escritórios Contábeis & Fiscais',
        useCase: 'Download automático de NF-e, certidões negativas e apuração de tributos em portais da Receita.',
      },
      {
        profile: 'Indústrias com ERPs Desktop',
        useCase: 'Integração de TOTVS, SAP e sistemas legados sem API com fluxos modernos.',
      },
      {
        profile: 'Operações com Obrigações Regulatórias',
        useCase: 'Cumprimento automático de prazos fiscais, guias e declarações periódicas.',
      },
    ],
    integrations: ['TOTVS Protheus', 'SAP B1', 'Receita Federal (e-CAC)', 'eSocial', 'Excel / CSV', 'Slack / WhatsApp'],
    ctaText: 'Ver o NEXUS RPA em ação',
    seoTitle: 'NEXUS RPA | Geração Automática de Robôs para Sistemas Legados — ANTUM',
    seoDescription: 'Automatize processos em sistemas legados com o NEXUS RPA. Descreva o processo, a IA monta o robô — sem programação, sem quebrar sistemas existentes.',
    demoType: 'rpa',
  },
  {
    id: 'kate',
    name: 'Kate — Assistente Jurídico de Inteligência Artificial',
    slug: 'kate',
    category: 'IA',
    categoryLabel: 'IA para Escritórios Jurídicos',
    badge: 'LegalTech IA',
    commercialHeadline: 'Análise de documentos jurídicos e pesquisa de jurisprudência em segundos, não em horas.',
    shortDescription: 'SaaS multi-tenant de IA para escritórios de advocacia. Análise de contratos, extração de cláusulas críticas, pesquisa de jurisprudência e preparação de peças — com segurança e isolamento total por escritório.',
    description: 'O Kate coloca o poder dos modelos de linguagem avançados dentro do fluxo real de trabalho jurídico. Cada escritório tem sua biblioteca privada de jurisprudência, seus documentos e seus usuários — com isolamento total entre clientes. Advogados ganham velocidade; gestores ganham controle.',
    heroImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1000&auto=format&fit=crop',
    ],
    problemBefore: {
      title: 'Antes do Kate',
      points: [
        'Revisão manual de contratos extensos consume horas de advogado sênior em tarefas mecânicas.',
        'Pesquisa de jurisprudência espalhada por múltiplos portais sem organização centralizada.',
        'Risco de perder cláusulas críticas de multa, renovação automática ou prazo de prescrição.',
      ],
      consequence: 'Custo horário elevado em tarefas repetitivas e exposição a erros de leitura em documentos densos.',
    },
    solutionNow: {
      title: 'Agora com o Kate',
      points: [
        'Upload do documento → Kate extrai cláusulas críticas, partes, prazos e obrigações em segundos.',
        'Biblioteca privada de jurisprudência por escritório com busca semântica avançada.',
        'Relatório estruturado pronto para revisão final pelo advogado responsável.',
      ],
      outcome: 'Advogados focam em estratégia — o Kate cuida da leitura densa e da pesquisa repetitiva.',
    },
    workflowSteps: [
      {
        step: 1,
        title: 'Upload do Documento',
        description: 'Contrato, petição, minuta ou laudo enviado via interface ou integração.',
        detail: 'Suporte a PDF, Word e imagens digitalizadas com OCR embutido.',
      },
      {
        step: 2,
        title: 'Análise Semântica',
        description: 'Kate lê o documento e identifica cláusulas, partes, obrigações e riscos.',
        detail: 'Destaque automático de prazos, penalidades, renovações e responsabilidades.',
      },
      {
        step: 3,
        title: 'Pesquisa de Jurisprudência',
        description: 'Busca semântica na biblioteca privada do escritório e bases públicas.',
        detail: 'Retorna precedentes relevantes ranqueados por similaridade e tribunal.',
      },
      {
        step: 4,
        title: 'Relatório & Exportação',
        description: 'Resumo executivo estruturado com pontos de atenção e referências.',
        detail: 'Exportação em Word ou PDF pronto para revisão final e assinatura.',
      },
    ],
    features: [
      {
        title: 'Análise de Contratos com IA',
        description: 'Extração de cláusulas críticas, partes, prazos, penalidades e obrigações automaticamente.',
        icon: 'FileText',
      },
      {
        title: 'Biblioteca Privada de Jurisprudência',
        description: 'Cada escritório tem sua própria base vetorial — sem compartilhamento entre clientes.',
        icon: 'BookOpen',
      },
      {
        title: 'Multi-Tenant com Papéis Granulares',
        description: 'Até 5 usuários por escritório com perfis: admin, advogado e árbitro.',
        icon: 'Users',
      },
      {
        title: 'Segurança Total dos Documentos',
        description: 'Documentos isolados por escritório com políticas de storage granulares (LGPD).',
        icon: 'ShieldCheck',
      },
    ],
    benefits: [
      {
        metric: '-85%',
        label: 'Tempo de Revisão de Contrato',
        description: 'Do upload ao relatório de cláusulas críticas em menos de 60 segundos.',
      },
      {
        metric: '100%',
        label: 'Privacidade dos Documentos',
        description: 'Dados de cada escritório isolados — nenhum documento cruza entre clientes.',
      },
      {
        metric: '+3x',
        label: 'Capacidade por Advogado',
        description: 'Mais casos analisados no mesmo tempo sem comprometer a qualidade.',
      },
    ],
    targetAudience: [
      {
        profile: 'Escritórios de Advocacia',
        useCase: 'Revisão ágil de contratos e pesquisa de jurisprudência para dar mais pareceres por dia.',
      },
      {
        profile: 'Departamentos Jurídicos Corporativos',
        useCase: 'Análise preventiva de fornecedores, parceiros e contratos de serviço antes da assinatura.',
      },
      {
        profile: 'Árbitros & Mediadores',
        useCase: 'Pesquisa estruturada de precedentes para fundamentar laudos e decisões.',
      },
    ],
    integrations: ['Supabase (Multi-tenant)', 'Anthropic API', 'Google Drive', 'OneDrive', 'PDF / Word', 'Webhook'],
    ctaText: 'Conhecer o Kate',
    seoTitle: 'Kate | Assistente Jurídico de IA para Escritórios de Advocacia — ANTUM',
    seoDescription: 'Analise contratos e pesquise jurisprudência com IA. O Kate é o assistente jurídico inteligente da ANTUM para escritórios e departamentos jurídicos.',
    demoType: 'doc',
  },
  {
    id: 'yafit',
    name: 'Yafit — Gestão Inteligente para Salões e Barbearias',
    slug: 'yafit',
    category: 'SaaS',
    categoryLabel: 'SaaS & Automação para Beleza',
    badge: 'SaaS Vertical',
    commercialHeadline: 'Agendamento, atendimento e gestão do seu salão — tudo automático via WhatsApp.',
    shortDescription: 'SaaS de gestão completa para salões de beleza e barbearias. Agendamento inteligente com automação via WhatsApp, dashboard de profissional e painel gerencial com métricas em tempo real.',
    description: 'O Yafit integra um sistema de agendamento moderno com automação de WhatsApp para eliminar o vai e vem de mensagens manuais. Clientes agendam sozinhos, recebem confirmações automáticas e lembretes antes do horário. Profissionais têm sua agenda organizada. Gerentes têm visão completa do negócio.',
    heroImage: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1000&auto=format&fit=crop',
    ],
    problemBefore: {
      title: 'Antes do Yafit',
      points: [
        'Agendamento por WhatsApp manual: recepcionista ou profissional para tudo para responder mensagens.',
        'Clientes sem confirmação de horário ligam para confirmar — telefone ocupado, cliente desiste.',
        'Sem controle de faturamento, taxa de no-show ou desempenho por profissional.',
      ],
      consequence: 'Tempo desperdiçado em operação administrativa e perda de receita por horários vagos.',
    },
    solutionNow: {
      title: 'Agora com o Yafit',
      points: [
        'Agente de WhatsApp atende o cliente, mostra horários disponíveis e confirma o agendamento.',
        'Lembretes automáticos 24h e 1h antes — taxa de no-show cai drasticamente.',
        'Dashboard gerencial com faturamento, ocupação por profissional e horários de pico.',
      ],
      outcome: 'Agenda sempre cheia, equipe focada no atendimento e operação sem papel nem planilha.',
    },
    workflowSteps: [
      {
        step: 1,
        title: 'Agendamento pelo Cliente',
        description: 'Cliente manda mensagem no WhatsApp e o Yafit responde com horários disponíveis.',
        detail: 'Escolha de serviço, profissional preferido e horário em menos de 2 minutos.',
      },
      {
        step: 2,
        title: 'Confirmação Automática',
        description: 'Agendamento registrado no sistema com confirmação instantânea para o cliente.',
        detail: 'Profissional notificado em seu painel individual com detalhes do horário.',
      },
      {
        step: 3,
        title: 'Lembretes Inteligentes',
        description: 'Sistema envia lembrete 24h e 1h antes do horário confirmado.',
        detail: 'Cliente pode confirmar ou reagendar diretamente pelo WhatsApp.',
      },
      {
        step: 4,
        title: 'Relatório Gerencial',
        description: 'Painel do gerente com faturamento, taxa de ocupação e desempenho por profissional.',
        detail: 'Exportação de relatório mensal em um clique para controle financeiro.',
      },
    ],
    features: [
      {
        title: 'Agente de WhatsApp',
        description: 'Automação completa de agendamento via WhatsApp sem intervenção da equipe.',
        icon: 'MessageSquare',
      },
      {
        title: 'Dashboard por Profissional',
        description: 'Cada profissional vê sua própria agenda, serviços e histórico de clientes.',
        icon: 'User',
      },
      {
        title: 'Painel Gerencial em Tempo Real',
        description: 'Faturamento, taxa de ocupação, no-show e horários de pico atualizados ao vivo.',
        icon: 'BarChart2',
      },
      {
        title: 'Catálogo de Serviços & Preços',
        description: 'Cadastro de serviços com duração, preço e profissional responsável configurável.',
        icon: 'Scissors',
      },
    ],
    benefits: [
      {
        metric: '-60%',
        label: 'Taxa de No-Show',
        description: 'Lembretes automáticos reduzem drasticamente os horários desperdiçados.',
      },
      {
        metric: '24/7',
        label: 'Agendamento Online',
        description: 'Clientes agendam qualquer hora, sem depender de atendimento humano.',
      },
      {
        metric: '+40%',
        label: 'Ocupação da Agenda',
        description: 'Horários vagos preenchidos automaticamente com lista de espera inteligente.',
      },
    ],
    targetAudience: [
      {
        profile: 'Salões de Beleza',
        useCase: 'Gestão completa de agenda com múltiplos profissionais e serviços.',
      },
      {
        profile: 'Barbearias',
        useCase: 'Agendamento pelo WhatsApp sem recepcionista e controle de faturamento por barbeiro.',
      },
      {
        profile: 'Clínicas de Estética',
        useCase: 'Controle de agenda técnica com serviços de duração variada e profissional especializado.',
      },
    ],
    integrations: ['WhatsApp Business API', 'Evolution API', 'Google Calendar', 'Asaas (Pagamentos)', 'n8n', 'Supabase'],
    ctaText: 'Conhecer o Yafit',
    seoTitle: 'Yafit | Gestão Inteligente de Salão e Barbearia com IA — ANTUM',
    seoDescription: 'Automatize o agendamento do seu salão ou barbearia com o Yafit. WhatsApp inteligente, lembretes automáticos e dashboard gerencial completo.',
    demoType: 'sync',
  },
  {
    id: 'hagoth',
    name: 'Hagoth — Gerador de Criativos com IA',
    slug: 'hagoth',
    category: 'SaaS',
    categoryLabel: 'SaaS de Conteúdo & Marketing Digital',
    badge: 'Live em Produção',
    commercialHeadline: 'Crie posts profissionais para Instagram em segundos — legenda, hashtags e imagem gerados por IA.',
    shortDescription: 'SaaS que automatiza a criação de criativos para redes sociais. A IA gera texto persuasivo, hashtags otimizadas e imagem personalizada com a identidade visual da sua marca.',
    description: 'O Hagoth resolve o maior gargalo do marketing digital: a produção diária de conteúdo. Em vez de horas no Canva e no ChatGPT separados, o criativo completo — legenda, hashtags e imagem — sai em segundos. A marca do cliente é aplicada automaticamente no post, garantindo consistência visual sem esforço manual.',
    heroImage: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1000&auto=format&fit=crop',
    ],
    liveUrl: 'https://hagoth.antum.com.br',
    problemBefore: {
      title: 'Antes do Hagoth',
      points: [
        'Horas perdidas toda semana criando post no Canva, escrevendo legenda no ChatGPT e pesquisando hashtags manualmente.',
        'Inconsistência visual: identidade da marca aplicada de forma diferente a cada post.',
        'Criadores e pequenas agências travados na operação de produção em vez de focar em estratégia.',
      ],
      consequence: 'Feed irregular, sem constância e sem padrão visual — que derruba o alcance orgânico.',
    },
    solutionNow: {
      title: 'Agora com o Hagoth',
      points: [
        'Criativo completo (imagem + legenda + hashtags) gerado em menos de 30 segundos.',
        'Logo da marca aplicada automaticamente no post com posição, tamanho e opacidade configuráveis.',
        'Agenda integrada: lembretes de publicação por rede social para manter a consistência.',
      ],
      outcome: 'Feed profissional, frequente e com identidade visual consistente — sem equipe de design.',
    },
    workflowSteps: [
      {
        step: 1,
        title: 'Descreva o Post',
        description: 'Informe o tema, produto ou campanha desejada.',
        detail: 'O modelo de IA interpreta o contexto do negócio para criar conteúdo relevante.',
      },
      {
        step: 2,
        title: 'IA Gera o Criativo',
        description: 'Legenda persuasiva, hashtags estratégicas e imagem em alta resolução.',
        detail: 'Claude gera o texto; DALL-E 3 cria a imagem personalizada ao tema.',
      },
      {
        step: 3,
        title: 'Aplique sua Marca',
        description: 'Sua logo é sobreposta na imagem com um clique.',
        detail: 'Controle total de posição, tamanho e opacidade para cada post.',
      },
      {
        step: 4,
        title: 'Agende e Publique',
        description: 'Defina a data/hora de publicação e receba lembretes por rede.',
        detail: 'Biblioteca de posts salvos para reutilizar e iterar conteúdos que performaram.',
      },
    ],
    features: [
      {
        title: 'Geração de Imagem com DALL-E 3',
        description: 'Imagens originais e em alta resolução criadas especificamente para cada post.',
        icon: 'Image',
      },
      {
        title: 'Texto com IA Avançada',
        description: 'Legendas naturais e hashtags estratégicas geradas por Claude (Anthropic).',
        icon: 'Brain',
      },
      {
        title: 'Marca Personalizada no Post',
        description: 'Upload da logo da empresa e aplicação automática com controle visual total.',
        icon: 'Sparkles',
      },
      {
        title: 'Agenda de Publicação',
        description: 'Calendário de conteúdo com lembretes por rede social para manter frequência.',
        icon: 'Calendar',
      },
      {
        title: 'Painel Admin Completo',
        description: 'Gestão de usuários, posts gerados, feedbacks e controle de planos.',
        icon: 'Shield',
      },
      {
        title: 'Trial Grátis — Sem Cartão',
        description: '10 posts gratuitos por 7 dias para testar antes de assinar qualquer plano.',
        icon: 'Zap',
      },
    ],
    benefits: [
      {
        metric: '30s',
        label: 'Criativo Completo',
        description: 'Imagem + legenda + hashtags gerados em menos de 30 segundos.',
      },
      {
        metric: '10×',
        label: 'Mais Rápido',
        description: 'Comparado ao fluxo manual (Canva + ChatGPT + pesquisa de hashtag).',
      },
      {
        metric: '100%',
        label: 'Identidade Visual',
        description: 'Logo da marca aplicada automaticamente em todos os posts gerados.',
      },
    ],
    targetAudience: [
      {
        profile: 'Criadores de Conteúdo & Influenciadores',
        useCase: 'Produzir volume de conteúdo de qualidade sem depender de designer ou copywriter.',
      },
      {
        profile: 'Pequenas Agências de Marketing',
        useCase: 'Escalar produção de criativos para múltiplos clientes sem aumentar equipe.',
      },
      {
        profile: 'Pequenas e Médias Empresas',
        useCase: 'Manter presença digital ativa e profissional sem contratar time de marketing.',
      },
    ],
    integrations: ['Anthropic Claude', 'OpenAI DALL-E 3', 'Supabase', 'Kiwify', 'EasyPanel', 'React 19 + Vite 7'],
    ctaText: 'Testar o Hagoth grátis',
    seoTitle: 'Hagoth — Gerador de Criativos para Instagram com IA | ANTUM',
    seoDescription: 'Crie posts completos para Instagram em segundos com IA. Legenda, hashtags e imagem com a identidade visual da sua marca. 10 posts grátis para começar.',
    demoType: 'pipeline',
  },
  {
    id: 'antum-custom',
    name: 'ANTUM Custom — Sistemas & Plataformas Sob Medida',
    slug: 'antum-custom',
    category: 'SaaS',
    categoryLabel: 'Engenharia de Software & IA Customizada',
    badge: 'Custom Engineering',
    commercialHeadline: 'Transformamos a lógica do seu negócio em software proprietário com IA nativa.',
    shortDescription: 'Desenvolvimento de plataformas SaaS, portais corporativos e sistemas internos sob medida. Arquitetura moderna, banco de dados escalável e IA integrada desde a primeira linha de código.',
    description: 'Softwares genéricos forçam sua empresa a adaptar processos à ferramenta. Na ANTUM, desenvolvemos plataformas sob medida que colocam sua metodologia em código. Cada sistema entregue é um ativo digital proprietário — com segurança empresarial, escalabilidade real e componentes de IA prontos para uso.',
    heroImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    ],
    problemBefore: {
      title: 'Antes do Custom ANTUM',
      points: [
        'Dependência de SaaS genérico com mensalidades caras e funcionalidades que ninguém usa.',
        'Planilhas paralelas criadas para contornar limitações do sistema adquirido.',
        'Nenhuma propriedade intelectual sobre a principal vantagem competitiva da operação.',
      ],
      consequence: 'Operação lenta amarrada a ferramentas que não acompanham a evolução do negócio.',
    },
    solutionNow: {
      title: 'Agora com a ANTUM',
      points: [
        'Sistema desenhado especificamente para a jornada dos seus clientes e colaboradores.',
        'Código-fonte proprietário: o sistema e a inteligência pertencem integralmente à sua empresa.',
        'IA generativa e automação embutidas desde a primeira linha de código.',
      ],
      outcome: 'Ativo digital de alto valor que escala a operação e gera diferencial de mercado.',
    },
    workflowSteps: [
      {
        step: 1,
        title: 'Engenharia de Requisitos',
        description: 'Mapeamento detalhado dos processos, personas e modelo de dados.',
        detail: 'Arquitetura escalável e segurança definidas desde a concepção.',
      },
      {
        step: 2,
        title: 'Prototipagem & UI/UX',
        description: 'Design de telas focado em ergonomia e produtividade real.',
        detail: 'Interfaces limpas, rápidas e sem atritos desnecessários.',
      },
      {
        step: 3,
        title: 'Desenvolvimento Ágil',
        description: 'Ciclos curtos de entrega com código limpo e testes automatizados.',
        detail: 'Stack moderna: TypeScript, React, Supabase, Docker — tudo autocontido.',
      },
      {
        step: 4,
        title: 'Deploy & Evolução Contínua',
        description: 'Publicação em ambiente seguro (EasyPanel / AWS / GCP) com monitoramento.',
        detail: 'Roadmap de melhorias baseado em dados reais de uso após o lançamento.',
      },
    ],
    features: [
      {
        title: 'Arquitetura Multi-Tenant',
        description: 'Isolamento total de dados entre clientes com controle de papéis (RBAC) rigoroso.',
        icon: 'Shield',
      },
      {
        title: 'IA Nativa no Produto',
        description: 'Agentes, RAG, automação e LLM integrados como funcionalidade do sistema.',
        icon: 'Brain',
      },
      {
        title: 'APIs Documentadas',
        description: 'Fácil conexão com ferramentas de parceiros, clientes e fornecedores via REST.',
        icon: 'Globe',
      },
      {
        title: 'Infraestrutura Cloud Escalável',
        description: 'Deploy em nuvem com escala automática e zero downtime em atualizações.',
        icon: 'Cloud',
      },
    ],
    benefits: [
      {
        metric: '100%',
        label: 'Propriedade Intelectual',
        description: 'O código-fonte e o sistema pertencem integralmente ao seu negócio.',
      },
      {
        metric: '0 Bloqueios',
        label: 'Liberdade de Customização',
        description: 'Sem limitações de fornecedor para implementar novas funcionalidades.',
      },
      {
        metric: 'Escala Real',
        label: 'Suporte ao Crescimento',
        description: 'Construído para 10 a centenas de milhares de usuários com estabilidade.',
      },
    ],
    targetAudience: [
      {
        profile: 'Empresas em Crescimento Rápido',
        useCase: 'Substituição de planilhas e SaaS genérico por sistema interno exclusivo.',
      },
      {
        profile: 'Fundadores de Produtos Digitais',
        useCase: 'Lançamento de SaaS vertical com IA nativa e arquitetura pronta para escalar.',
      },
      {
        profile: 'Operações Especializadas',
        useCase: 'Setores regulados onde não existe solução de mercado adequada.',
      },
    ],
    integrations: ['AWS / GCP', 'Supabase', 'Stripe / Asaas', 'Anthropic / OpenAI', 'n8n', 'Docker & EasyPanel'],
    ctaText: 'Falar sobre meu projeto',
    seoTitle: 'Desenvolvimento de Software & SaaS Sob Medida com IA — ANTUM',
    seoDescription: 'Sistemas, plataformas SaaS e portais corporativos desenvolvidos sob medida pela ANTUM. Código proprietário, IA nativa e arquitetura escalável.',
    demoType: 'pipeline',
  },
];
