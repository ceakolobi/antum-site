// Textos explicativos de cada plano. NÃO tem preço aqui: valor, recursos e teste vêm do catálogo (banco).
export interface ConteudoPlano {
  resumo: string;           // frase curta do card
  paraQuem: string;
  comoAjuda: { titulo: string; texto: string }[];
  aplicacoes: string[];
  passos: string[];
}

const passosPadrao = [
  'Você escolhe o plano e faz o cadastro, leva poucos minutos.',
  'Conferimos o contrato e o seu aceite chega por e-mail, em PDF.',
  'A Antum implanta e coloca tudo para funcionar.',
  'Você acompanha as cobranças na Área do cliente.',
];

export const conteudoPlanos: Record<string, ConteudoPlano> = {
  'marina-sdr': {
    resumo: 'Atendente de IA no WhatsApp, 24 horas por dia.',
    paraQuem: 'Para quem perde cliente por demora na resposta e quer um primeiro atendimento sempre disponível, inclusive de madrugada e fim de semana.',
    comoAjuda: [
      { titulo: 'Responde na hora', texto: 'A Marina atende quem chama no WhatsApp, tira dúvidas sobre a sua empresa e mantém a conversa andando.' },
      { titulo: 'Qualifica os interessados', texto: 'Ela entende o que a pessoa procura e separa quem tem interesse real de quem só perguntou.' },
      { titulo: 'Acompanhe tudo', texto: 'Um painel mostra as conversas e os contatos, para você assumir quando for a hora de fechar.' },
    ],
    aplicacoes: ['Atendimento de primeiro contato', 'Pré-venda e qualificação', 'Dúvidas frequentes', 'Captação de contatos para a equipe comercial'],
    passos: ['Você faz o cadastro e começa o período de teste.', 'A Marina é configurada com as informações da sua empresa.', 'Você testa no dia a dia, sem pagar nada durante o teste.', 'Depois do teste, a cobrança mensal é emitida, e você pode antecipar o pagamento quando quiser.'],
  },
  'site-profissional': {
    resumo: 'Site profissional no ar, hospedado e seguro.',
    paraQuem: 'Para empresas e profissionais que querem aparecer bem no Google e receber contatos pelo celular todos os dias.',
    comoAjuda: [
      { titulo: 'Feito e implantado por nós', texto: 'Design, textos, hospedagem e publicação ficam com a Antum.' },
      { titulo: 'Rápido e seguro', texto: 'Funciona bem no celular, com certificado SSL e hospedagem incluídos.' },
      { titulo: 'Fácil de ser encontrado', texto: 'Otimização básica para o Google e formulário de contato para você receber os pedidos.' },
    ],
    aplicacoes: ['Apresentar a empresa e os serviços', 'Receber pedidos de orçamento', 'Mostrar portfólio e depoimentos', 'Ter um endereço próprio na internet'],
    passos: passosPadrao,
  },
  'site-vera': {
    resumo: 'Site profissional com atendente de IA.',
    paraQuem: 'Para quem quer o site e também um atendimento automático que responde os visitantes e passa os contatos para você.',
    comoAjuda: [
      { titulo: 'Tudo do site profissional', texto: 'Site responsivo, hospedagem, SSL, formulário e otimização básica.' },
      { titulo: 'A Vera atende por você', texto: 'Atendente comercial com inteligência artificial para o primeiro atendimento, sem demora.' },
      { titulo: 'Contatos já qualificados', texto: 'A Vera identifica o interesse do visitante e entrega o contato organizado.' },
    ],
    aplicacoes: ['Atendimento de visitantes do site', 'Primeiro atendimento pelo WhatsApp, conforme configuração', 'Triagem de interessados', 'Menos contatos perdidos fora do horário comercial'],
    passos: passosPadrao,
  },
  'loja-vera': {
    resumo: 'Loja virtual completa com atendimento por IA.',
    paraQuem: 'Para quem vende pela internet e quer cadastrar produtos, organizar o catálogo e ter atendimento automático aos interessados.',
    comoAjuda: [
      { titulo: 'Loja pronta para vender', texto: 'Estrutura de vendas online, cadastro de produtos e gestão do catálogo.' },
      { titulo: 'Atendimento automatizado', texto: 'A Vera responde dúvidas dos interessados e conduz a conversa.' },
      { titulo: 'Tudo em um só lugar', texto: 'Loja, catálogo e atendimento funcionando juntos.' },
    ],
    aplicacoes: ['Venda de produtos pela internet', 'Catálogo atualizado', 'Dúvidas sobre produtos e pedidos', 'Atendimento fora do horário comercial'],
    passos: passosPadrao,
  },
  'site-crm-vera': {
    resumo: 'Site, CRM para gestão comercial e atendente de IA.',
    paraQuem: 'Para empresas que querem organizar clientes e leads, acompanhar as negociações e ter um atendimento automático alimentando tudo.',
    comoAjuda: [
      { titulo: 'Site profissional', texto: 'A sua vitrine na internet, hospedada e segura.' },
      { titulo: 'CRM para gestão comercial', texto: 'Cadastro de clientes, acompanhamento de leads e organização do funil.' },
      { titulo: 'Vera integrada', texto: 'O atendimento automático e os processos comerciais trabalham de forma integrada.' },
    ],
    aplicacoes: ['Controle de clientes e leads', 'Acompanhamento comercial', 'Qualificação automática de interessados', 'Visão única do relacionamento com o cliente'],
    passos: passosPadrao,
  },
  'site-sistema-vera': {
    resumo: 'Site, sistema sob medida e atendente de IA.',
    paraQuem: 'Para quem precisa de um sistema próprio, desenhado conforme o escopo combinado com a Antum, junto com site e atendimento automático.',
    comoAjuda: [
      { titulo: 'Sistema conforme o seu escopo', texto: 'Definimos com você o que o sistema precisa fazer e como vai ser a área administrativa.' },
      { titulo: 'Site e atendimento integrados', texto: 'Site, sistema e Vera conectados, sem retrabalho.' },
      { titulo: 'Acompanhamento da Antum', texto: 'Como o escopo é personalizado, a contratação passa por uma análise nossa antes da ativação.' },
    ],
    aplicacoes: ['Gestão de informações do seu negócio', 'Painel administrativo próprio', 'Processos específicos da sua empresa', 'Atendimento automático ligado ao sistema'],
    passos: [
      'Você envia o pedido de contratação pelo cadastro.',
      'A Antum analisa o escopo e entra em contato com você.',
      'Aprovado, o contrato é emitido e a cobrança é gerada.',
      'Implantamos o site, o sistema e a Vera.',
    ],
  },
  'crm-antum': {
    resumo: 'CRM para organizar clientes, leads e oportunidades.',
    paraQuem: 'Para quem quer sair das planilhas e ter clientes, contatos e negociações organizados em um painel só.',
    comoAjuda: [
      { titulo: 'Clientes e contatos organizados', texto: 'Tudo cadastrado em um lugar, fácil de achar.' },
      { titulo: 'Acompanhamento comercial', texto: 'Veja em que ponto está cada oportunidade e quem precisa de retorno.' },
      { titulo: 'Painel administrativo', texto: 'Visão geral do seu relacionamento com os clientes.' },
    ],
    aplicacoes: ['Cadastro de leads', 'Funil de vendas', 'Gestão de contatos', 'Organização do pós-venda'],
    passos: passosPadrao,
  },
};
