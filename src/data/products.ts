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
    id: 'antum-flow',
    name: 'Antum Flow — Motor de Automação de Processos',
    slug: 'antum-flow',
    category: 'Automação',
    categoryLabel: 'Orquestração & Automação',
    badge: 'Core Engine',
    commercialHeadline: 'Transformamos rotinas manuais repetitivas em fluxos autônomos à prova de falhas.',
    shortDescription: 'Motor de orquestração que liga sistemas internos, webhooks, planilhas e inteligência artificial para executar processos ponta a ponta sem intervenção humana.',
    description: 'Empresas perdem centenas de horas operacionais copiando dados entre plataformas e aguardando aprovações em e-mails. O Antum Flow estrutura gatilhos lógicos, validações com IA e sincronizações automáticas, garantindo que cada evento de negócio dispare as ações corretas.',
    heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1000&auto=format&fit=crop',
    ],
    problemBefore: {
      title: 'Antes do Antum Flow',
      points: [
        'Colaboradores alternam entre 4 a 6 telas para concluir um único pedido ou cadastro.',
        'Erros de digitação geram inconsistências em faturamento e atrasos em entregas.',
        'Processos travam quando um responsável está ausente ou sobrecarregado.',
      ],
      consequence: 'Gargalos operacionais constantes e desperdício de talentos em tarefas mecânicas.',
    },
    solutionNow: {
      title: 'Agora com o Antum Flow',
      points: [
        'Disparo automático de fluxos a partir de eventos em APIs, webhooks ou mensagens.',
        'Validação de dados por regras de negócio e checagem semântica antes de gravar.',
        'Logs de auditoria e reprocessamento automático em caso de instabilidade externa.',
      ],
      outcome: 'Operação fluida com execução em milissegundos e rastreabilidade total.',
    },
    workflowSteps: [
      {
        step: 1,
        title: 'Evento Gatilho',
        description: 'Novo contrato assinado, lead gerado ou status alterado no ERP.',
        detail: 'Escuta contínua de eventos via webhook ou polling seguro.',
      },
      {
        step: 2,
        title: 'Enriquecimento com IA',
        description: 'Padronização, categorização e validação de informações.',
        detail: 'Elimina ruídos de dados e detecta anomalias instantaneamente.',
      },
      {
        step: 3,
        title: 'Execução Multifronte',
        description: 'Atualiza múltiplos sistemas em paralelo.',
        detail: 'Emissão de ordens, provisionamento de acessos e notificações.',
      },
      {
        step: 4,
        title: 'Auditoria & Confirmação',
        description: 'Histórico gravado com carimbo de tempo e status de sucesso.',
        detail: 'Alertas imediatos apenas se houver exceção real que demande humano.',
      },
    ],
    features: [
      {
        title: 'Orquestração Híbrida',
        description: 'Combina regras tradicionais if/else com nós de decisão impulsionados por IA.',
        icon: 'GitFork',
      },
      {
        title: 'Fallback & Tolerância a Falhas',
        description: 'Retentativas com backoff exponencial e fila de contingência.',
        icon: 'ShieldCheck',
      },
      {
        title: 'Painel de Telemetria Operacional',
        description: 'Métricas claras de throughput, tempo médio de execução e gargalos.',
        icon: 'Activity',
      },
      {
        title: 'Webhooks & Conectores Nativos',
        description: 'Pronto para comunicar com qualquer plataforma que possua endpoint REST ou GraphQL.',
        icon: 'Layers',
      },
    ],
    benefits: [
      {
        metric: '0 Erros',
        label: 'Precisão em Lançamentos',
        description: 'Eliminação completa de falhas humanas em transferências de dados.',
      },
      {
        metric: '95%',
        label: 'Redução de Tempo de Ciclo',
        description: 'Processos que levavam dias passam a ser concluídos em segundos.',
      },
      {
        metric: '100%',
        label: 'Rastreabilidade',
        description: 'Histórico auditável de cada transação executada no sistema.',
      },
    ],
    targetAudience: [
      {
        profile: 'Operações & Logística',
        useCase: 'Atualização de estoques, rastreamento de fretes e confirmação de entregas.',
      },
      {
        profile: 'Financeiro & Faturamento',
        useCase: 'Geração automática de cobranças, conciliação e emissão de notas fiscais.',
      },
      {
        profile: 'RH & Departamento Pessoal',
        useCase: 'Onboarding automatizado de novos colaboradores e liberação de acessos.',
      },
    ],
    integrations: ['Webhooks REST', 'Make / n8n', 'Zapier', 'PostgreSQL', 'S3 / Cloud Storage', 'Slack / Teams'],
    ctaText: 'Automatizar meus processos',
    seoTitle: 'Antum Flow | Motor de Automação de Processos Empresariais — ANTUM',
    seoDescription: 'Elimine tarefas manuais com o Antum Flow. Orquestração inteligente de fluxos de trabalho que integram IA, APIs e sistemas internos.',
    demoType: 'pipeline',
  },
  {
    id: 'nexus-rpa',
    name: 'Nexus RPA — Robôs de Execução em Sistemas Legados',
    slug: 'nexus-rpa',
    category: 'RPA',
    categoryLabel: 'Robotic Process Automation',
    badge: 'Enterprise RPA',
    commercialHeadline: 'Robôs que operam softwares legados exatamente como uma pessoa, sem precisar de APIs.',
    shortDescription: 'Automação robótica de processos capaz de navegar em sistemas legados, portais governamentais, planilhas e softwares desktop para executar rotinas mecânicas.',
    description: 'Muitos sistemas essenciais da sua empresa não possuem APIs modernas ou integrações diretas. O Nexus RPA atua na interface do usuário (UI) ou em segundo plano, preenchendo formulários, baixando relatórios e integrando bancos de dados onde a integração convencional seria cara ou impossível.',
    heroImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
    ],
    problemBefore: {
      title: 'Antes do Nexus RPA',
      points: [
        'Funcionários dedicados exclusivamente a copiar dados de PDFs para telas de ERPs legados.',
        'Acesso manual a portais de órgãos reguladores e prefeituras para baixar guias uma a uma.',
        'Desenvolvimento de APIs para sistemas antigos custaria meses e orçamentos inviáveis.',
      ],
      consequence: 'Custos operacionais elevados e lentidão crônica em rotinas regulatórias e fiscais.',
    },
    solutionNow: {
      title: 'Agora com o Nexus RPA',
      points: [
        'Robôs virtuais executando tarefas programadas em horários de baixo tráfego ou sob demanda.',
        'Reconhecimento visual inteligente de elementos na tela mesmo após pequenas alterações visuais.',
        'Validação cruzada de dados antes do envio final.',
      ],
      outcome: 'Processos legados rodando em velocidade computacional com zero horas extras da equipe.',
    },
    workflowSteps: [
      {
        step: 1,
        title: 'Mapeamento do Fluxo',
        description: 'Identificação exata de cada clique, digitação e validação necessária.',
        detail: 'Criação de scripts robustos com captura de elementos por seletores e visão computacional.',
      },
      {
        step: 2,
        title: 'Execução Controlada',
        description: 'O bot inicializa a aplicação legado com credenciais seguras criptografadas.',
        detail: 'Navegação pelas telas com verificação de carregamento e campos obrigatórios.',
      },
      {
        step: 3,
        title: 'Extração e Inserção',
        description: 'Captura dados da fonte e insere no destino com validação de formato.',
        detail: 'Tratamento de pop-ups, mensagens de erro do sistema legado e recaptcha.',
      },
      {
        step: 4,
        title: 'Relatório de Execução',
        description: 'Envio de comprovantes fiscais e sumário com itens processados.',
        detail: 'Disponibilização imediata em pasta em nuvem compartilhada.',
      },
    ],
    features: [
      {
        title: 'Visão Computacional Resiliente',
        description: 'Não quebra com simples mudanças de resolução ou tema de interface.',
        icon: 'Eye',
      },
      {
        title: 'Gestão Segura de Credenciais',
        description: 'Cofre criptografado com acesso restrito e sem exposição de senhas.',
        icon: 'Lock',
      },
      {
        title: 'Execução Silenciosa ou Assistida',
        description: 'Pode rodar em servidores dedicados ou em máquinas locais ao lado do operador.',
        icon: 'Cpu',
      },
      {
        title: 'Tratamento de Exceções Avançado',
        description: 'Tira prints de telas de erro inesperadas e alerta o suporte imediatamente.',
        icon: 'AlertCircle',
      },
    ],
    benefits: [
      {
        metric: '10x',
        label: 'Velocidade de Execução',
        description: 'Preenchimento e consulta de registros em fração do tempo manual.',
      },
      {
        metric: '100%',
        label: 'Conformidade Regulatória',
        description: 'Prazos de guias fiscais e obrigações cumpridos sem risco de multas.',
      },
      {
        metric: 'Zero',
        label: 'Alteração em Sistemas Legados',
        description: 'Não exige nenhuma modificação ou código no seu software antigo.',
      },
    ],
    targetAudience: [
      {
        profile: 'Escritórios Contábeis & Fiscais',
        useCase: 'Download automático de NF-e, certidões negativas e apuração de tributos.',
      },
      {
        profile: 'Seguradoras & Operadoras de Saúde',
        useCase: 'Auditoria de sinistros e inclusão de beneficiários em portais legados.',
      },
      {
        profile: 'Varejo & E-commerce',
        useCase: 'Atualização de preços e pedidos em marketplaces sem integração oficial.',
      },
    ],
    integrations: ['ERPs Desktop (Totvs, SAP, Senior)', 'Portais Web Governamentais', 'Excel / CSV', 'Bancos de Dados SQL', 'Sistemas de CRM'],
    ctaText: 'Ver demonstração de RPA',
    seoTitle: 'Nexus RPA | Automação de Sistemas Legados e Tarefas Repetitivas — ANTUM',
    seoDescription: 'Automatize sistemas legados sem APIs com o Nexus RPA da ANTUM. Robôs virtuais para tarefas repetitivas, fiscais e operacionais.',
    demoType: 'rpa',
  },
  {
    id: 'sync-bridge',
    name: 'SyncBridge — Hub de Integração de IA com CRM e ERP',
    slug: 'sync-bridge',
    category: 'Integrações',
    categoryLabel: 'Conectores & Dados',
    badge: 'Integration Hub',
    commercialHeadline: 'Conectamos a inteligência artificial aos sistemas que sua empresa já utiliza.',
    shortDescription: 'Camada de integração unificada que conecta agentes de IA, LLMs e automações aos seus bancos de dados, ferramentas de vendas e ERPs corporativos.',
    description: 'A IA só gera valor real quando tem acesso aos dados certos e capacidade de escrever no seu sistema oficial. O SyncBridge fornece conectores bidirecionais seguros, traduzindo solicitações em linguagem natural para chamadas de banco de dados e APIs empresariais com permissões granulares.',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    ],
    problemBefore: {
      title: 'Antes do SyncBridge',
      points: [
        'A IA ficava isolada em telas de chat sem poder alterar registros reais do negócio.',
        'Dados fragmentados em silos impediam respostas contextualizadas e assertivas.',
        'Receio de vazamento de informações corporativas para modelos públicos de terceiros.',
      ],
      consequence: 'Projetos de IA que não saíam do protótipo por falta de integração prática com a operação.',
    },
    solutionNow: {
      title: 'Agora com o SyncBridge',
      points: [
        'Acesso seguro e em tempo real aos dados estruturados da empresa via RAG e function calling.',
        'Filtro rigoroso de privacidade e sanitização de dados sensíveis (LGPD ready).',
        'Controle de permissões para garantir que a IA execute apenas ações autorizadas.',
      ],
      outcome: 'A inteligência artificial vira um braço operacional dos seus sistemas existentes.',
    },
    workflowSteps: [
      {
        step: 1,
        title: 'Autenticação e Permissão',
        description: 'Conexão criptografada com chaves de API e tokens OAuth corporativos.',
        detail: 'Definição de escopos de leitura e escrita por perfil de agente.',
      },
      {
        step: 2,
        title: 'Mapeamento Semântico',
        description: 'Tradução do esquema de dados do cliente em contexto para o agente de IA.',
        detail: 'Criação de esquemas de funções que o modelo pode invocar com segurança.',
      },
      {
        step: 3,
        title: 'Validação e Sanitização',
        description: 'Verificação de dados antes de submeter alterações ao banco.',
        detail: 'Bloqueio de injeções de prompt e proteção de dados sigilosos.',
      },
      {
        step: 4,
        title: 'Sincronização em Tempo Real',
        description: 'Gravação instantânea e confirmação de resposta ao usuário.',
        detail: 'Registro completo de auditoria para compliance corporativo.',
      },
    ],
    features: [
      {
        title: 'Function Calling Seguro',
        description: 'A IA aciona métodos de negócio reais de forma controlada e tipada.',
        icon: 'Code',
      },
      {
        title: 'Sanitização LGPD',
        description: 'Mascaramento automático de CPF, cartões e dados pessoais antes do envio aos modelos.',
        icon: 'Lock',
      },
      {
        title: 'Cache Semântico de Baixa Latência',
        description: 'Respostas para consultas frequentes entregues em menos de 100ms.',
        icon: 'Zap',
      },
      {
        title: 'Monitor de Saúde das APIs',
        description: 'Dashboard de status das conexões com alertas de instabilidade em tempo real.',
        icon: 'CheckCircle',
      },
    ],
    benefits: [
      {
        metric: '100%',
        label: 'Isolamento de Dados',
        description: 'Seus dados confidenciais nunca são utilizados para treinar modelos públicos.',
      },
      {
        metric: '+50',
        label: 'Conectores Prontos',
        description: 'Integração ágil com os principais CRMs, ERPs e ferramentas do mercado.',
      },
      {
        metric: '99.9%',
        label: 'Uptime das Conexões',
        description: 'Infraestrutura resiliente desenhada para operações de missão crítica.',
      },
    ],
    targetAudience: [
      {
        profile: 'Times de Engenharia & TI',
        useCase: 'Acelerar a adoção de IA sem reescrever a arquitetura legada de sistemas.',
      },
      {
        profile: 'Empresas com Múltiplos CRMs/ERPs',
        useCase: 'Centralizar a camada de inteligência e unificar a visão do cliente.',
      },
      {
        profile: 'Startups em Escala',
        useCase: 'Prover recursos de IA para seus próprios usuários finais de forma rápida.',
      },
    ],
    integrations: ['Salesforce', 'HubSpot', 'SAP B1', 'Omie', 'Bling', 'PostgreSQL / MySQL', 'Stripe', 'WhatsApp'],
    ctaText: 'Integrar meus sistemas com IA',
    seoTitle: 'SyncBridge | Integração de Inteligência Artificial com CRM e ERP — ANTUM',
    seoDescription: 'Conecte modelos de IA aos seus CRMs, ERPs e bancos de dados corporativos com segurança, conformidade e alto desempenho.',
    demoType: 'sync',
  },
  {
    id: 'pulse-ops',
    name: 'PulseOps — Inteligência de Documentos & Backoffice Autônomo',
    slug: 'pulse-ops',
    category: 'IA',
    categoryLabel: 'Document Intelligence & Backoffice',
    badge: 'AI Document Vision',
    commercialHeadline: 'Leitura, extração e conferência de contratos, notas e relatórios em segundos.',
    shortDescription: 'Plataforma de inteligência visual e semântica que lê documentos fiscais, contratos e faturas complexas, extrai dados estruturados e cruza com regras de conformidade.',
    description: 'Se sua equipe gasta tempo abrindo anexos de e-mail, conferindo dados de fornecedores e digitando valores em planilhas, o PulseOps assume esse trabalho. Com visão computacional e modelos de raciocínio, ele compreende documentos mesmo em layouts variados ou fotos de baixa qualidade.',
    heroImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    ],
    problemBefore: {
      title: 'Antes do PulseOps',
      points: [
        'Horas diárias gastas abrindo e-mails de fornecedores e baixando PDFs manualmente.',
        'Erros humanos na leitura de impostos retidos, datas de vencimento ou códigos de barras.',
        'Gargalos no fechamento mensal por acúmulo de notas e recibos não processados.',
      ],
      consequence: 'Pagamentos com juros por atraso e retrabalho constante no setor de contas a pagar.',
    },
    solutionNow: {
      title: 'Agora com o PulseOps',
      points: [
        'Processamento automático no instante em que o arquivo chega à caixa postal ou pasta.',
        'Extração semântica dos itens, impostos, dados bancários e conferência contra pedido de compra.',
        'Lançamento automático de títulos no ERP e envio de alertas para aprovação se houver divergência.',
      ],
      outcome: 'Fechamento financeiro contínuo e backoffice enxuto focado em estratégia.',
    },
    workflowSteps: [
      {
        step: 1,
        title: 'Ingestão Multicanal',
        description: 'Documentos recebidos via e-mail, upload web ou pasta em nuvem.',
        detail: 'Suporte a PDF, imagens, digitalizações e arquivos XML/JSON.',
      },
      {
        step: 2,
        title: 'OCR & Raciocínio Semântico',
        description: 'Leitura dos dados independente do formato gráfico do emissor.',
        detail: 'Identificação de CNPJ, razão social, itens, retenções e datas.',
      },
      {
        step: 3,
        title: 'Conferência de Três Vias',
        description: 'Cruzamento com o pedido de compra e confirmação de entrega física.',
        detail: 'Cálculo de margem de tolerância e detecção de duplicidades.',
      },
      {
        step: 4,
        title: 'Exportação Estruturada',
        description: 'Gravação no ERP ou banco financeiro com anexo arquivado.',
        detail: 'Indexação completa para busca instantânea futura.',
      },
    ],
    features: [
      {
        title: 'Layout-Free Extraction',
        description: 'Não requer modelos ou templates rígidos para cada fornecedor.',
        icon: 'FileText',
      },
      {
        title: 'Detecção de Fraudes e Duplicidades',
        description: 'Verifica se a mesma nota ou boleto já foi submetido anteriormente.',
        icon: 'ShieldAlert',
      },
      {
        title: 'Auditoria de Cláusulas Contratuais',
        description: 'Identifica cláusulas de renovação automática, multas e prazos críticos.',
        icon: 'Search',
      },
      {
        title: 'Interface de Validação Rápida',
        description: 'Para casos limítrofes, operador valida em 1 clique com highlight na imagem.',
        icon: 'CheckSquare',
      },
    ],
    benefits: [
      {
        metric: '98.5%',
        label: 'Acurácia de Extração',
        description: 'Precisão mesmo em impressões imperfeitas ou fotos de celular.',
      },
      {
        metric: '-80%',
        label: 'Custo por Documento',
        description: 'Redução drástica do custo operacional por nota processada.',
      },
      {
        metric: '< 5s',
        label: 'Tempo Médio de Análise',
        description: 'Documentos complexos analisados e prontos para faturamento quase em tempo real.',
      },
    ],
    targetAudience: [
      {
        profile: 'Departamentos Financeiros & Controladoria',
        useCase: 'Contas a pagar, conferência de fretes e conciliação de faturas de compras.',
      },
      {
        profile: 'Jurídico Corporativo & Compliance',
        useCase: 'Revisão prévia de minutas contratuais e extração de prazos regulatórios.',
      },
      {
        profile: 'Logística & Transportadoras',
        useCase: 'Processamento de comprovantes de entrega (canhotos) e conhecimentos de transporte (CT-e).',
      },
    ],
    integrations: ['SAP', 'Totvs Protheus', 'Omie', 'ContaAzul', 'Google Drive / OneDrive', 'E-mail corporativo (IMAP / Exchange)'],
    ctaText: 'Ver extração em ação',
    seoTitle: 'PulseOps | Inteligência de Documentos e Backoffice — ANTUM',
    seoDescription: 'Extraia dados de notas fiscais, contratos e faturas com IA. PulseOps automatiza o backoffice financeiro com precisão milimétrica.',
    demoType: 'doc',
  },
  {
    id: 'custom-saas',
    name: 'ANTUM Custom SaaS — Plataformas Digitais Sob Medida',
    slug: 'custom-saas',
    category: 'SaaS',
    categoryLabel: 'Desenvolvimento Sob Medida',
    badge: 'Custom Engineering',
    commercialHeadline: 'Software proprietário construído com arquitetura moderna e IA nativa no código.',
    shortDescription: 'Desenvolvimento de produtos digitais, portais de clientes e sistemas corporativos de alta performance desenhados para resolver dores únicas do seu modelo de negócio.',
    description: 'Softwares de prateleira muitas vezes forçam sua empresa a adaptar seus processos à ferramenta. Na ANTUM, desenvolvemos plataformas sob medida que colocam sua metodologia em código, com segurança empresarial, banco de dados escalável e componentes de IA perfeitamente integrados.',
    heroImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    ],
    problemBefore: {
      title: 'Antes do Custom SaaS',
      points: [
        'Dependência de softwares engessados com mensalidades caras e funcionalidades que ninguém usa.',
        'Planilhas paralelas criadas para contornar limitações do sistema contratado.',
        'Falta de propriedade intelectual sobre a principal vantagem competitiva da sua operação.',
      ],
      consequence: 'Operação lenta amarrada a ferramentas que não acompanham a evolução do negócio.',
    },
    solutionNow: {
      title: 'Agora com o Custom SaaS da ANTUM',
      points: [
        'Software desenhado especificamente para a jornada dos seus clientes e colaboradores.',
        'Código proprietário: o sistema e a inteligência pertencem integralmente à sua empresa.',
        'IA generativa e automação embutidas desde a primeira linha de código.',
      ],
      outcome: 'Ativo digital de alto valor que escala a operação e gera diferencial de mercado.',
    },
    workflowSteps: [
      {
        step: 1,
        title: 'Engenharia de Requisitos',
        description: 'Mapeamento detalhado dos processos e modelo de dados.',
        detail: 'Definição de arquitetura escalável e segurança desde a concepção.',
      },
      {
        step: 2,
        title: 'Prototipagem & UI/UX',
        description: 'Design de telas focado em ergonomia e produtividade do operador.',
        detail: 'Interfaces limpas, rápidas e sem atritos desnecessários.',
      },
      {
        step: 3,
        title: 'Desenvolvimento Ágil',
        description: 'Ciclos curtos de entrega com código limpo e testes automatizados.',
        detail: 'Stack moderna com TypeScript, bancos relacionais e containers em nuvem.',
      },
      {
        step: 4,
        title: 'Deploy & Evolução Contínua',
        description: 'Publicação em ambiente seguro com monitoramento 24/7.',
        detail: 'Roadmap de melhorias baseado em dados reais de uso.',
      },
    ],
    features: [
      {
        title: 'Arquitetura Multi-Tenant Segura',
        description: 'Isolamento de dados entre empresas clientes com controle RBAC rigoroso.',
        icon: 'Shield',
      },
      {
        title: 'Design System Exclusivo',
        description: 'Componentes modernos com acessibilidade, responsividade e rapidez.',
        icon: 'Layout',
      },
      {
        title: 'APIs REST e GraphQL Documentadas',
        description: 'Fácil conexão com ferramentas de clientes, parceiros e fornecedores.',
        icon: 'Globe',
      },
      {
        title: 'Infraestrutura Cloud Escalável',
        description: 'Hospedagem em nuvem de ponta (AWS / GCP) com escala automática sob demanda.',
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
        description: 'Sem limitações de fornecedores externos para implementar novas ideias.',
      },
      {
        metric: 'Escala Real',
        label: 'Suporte ao Crescimento',
        description: 'Construído para suportar de 10 a centenas de milhares de usuários com estabilidade.',
      },
    ],
    targetAudience: [
      {
        profile: 'Empresas em Crescimento Rápido',
        useCase: 'Substituição de planilhas complexas por um ERP ou CRM interno exclusivo.',
      },
      {
        profile: 'Fundadores & Novos Negócios',
        useCase: 'Lançamento de novos produtos digitais SaaS com IA nativa.',
      },
      {
        profile: 'Operações Especializadas',
        useCase: 'Setores regulados ou nichos onde não existe solução de mercado adequada.',
      },
    ],
    integrations: ['AWS', 'Google Cloud', 'PostgreSQL', 'Stripe / Asaas', 'OpenAI / Gemini', 'Docker & Kubernetes'],
    ctaText: 'Estruturar meu projeto de software',
    seoTitle: 'Desenvolvimento de SaaS & Software Sob Medida — ANTUM',
    seoDescription: 'Desenvolvimento de plataformas SaaS e produtos digitais sob medida com IA nativa. Código proprietário e engenharia robusta.',
    demoType: 'pipeline',
  },
];
