// Sites de EXEMPLO (empresas fictícias) usados nos banners da página inicial.
// São ilustrações para o visitante imaginar o próprio site; não são clientes reais.
export interface DemoSite {
  id: string;
  segment: string; // ramo do visitante
  brand: string; // nome fictício da empresa do exemplo
  tagline: string; // frase do site de exemplo
  cta: string; // botão do site de exemplo
  accent: string; // cor principal do exemplo
  soft: string; // cor de fundo suave do exemplo
  dark: boolean;
  chips: string[]; // itens exibidos no exemplo
  hook: string; // gancho de marketing (título do banner)
  pitch: string; // o que o site faz pelo negócio
  bullets: string[];
  marinaPrompt: string; // mensagem inicial enviada à Marina
}

export const demoSites: DemoSite[] = [
  {
    id: 'oficina',
    segment: 'Oficina mecânica',
    brand: 'Auto Center Ferreira',
    tagline: 'Revisão, freios e suspensão com hora marcada',
    cta: 'Agendar pelo WhatsApp',
    accent: '#F59E0B',
    soft: '#1F2937',
    dark: true,
    chips: ['Revisão completa', 'Freios', 'Suspensão', 'Elétrica'],
    hook: 'Sua oficina cheia de clientes que já chegam com hora marcada.',
    pitch: 'O cliente encontra sua oficina no Google, vê os serviços e agenda pelo WhatsApp em um toque.',
    bullets: ['Serviços e preços de referência à vista', 'Botão de agendamento direto no WhatsApp', 'Mapa, horário e avaliações'],
    marinaPrompt: 'Olá Marina! Tenho uma oficina mecânica e quero um site como o exemplo do Auto Center Ferreira.',
  },
  {
    id: 'salao',
    segment: 'Salão de beleza',
    brand: 'Studio Bella',
    tagline: 'Corte, coloração e unhas: agende em 1 minuto',
    cta: 'Agendar horário',
    accent: '#EC4899',
    soft: '#FDF2F8',
    dark: false,
    chips: ['Corte', 'Coloração', 'Manicure', 'Escova'],
    hook: 'Agenda cheia sem ficar respondendo mensagem o dia inteiro.',
    pitch: 'Um site bonito com serviços, valores e agenda, e a Marina tira as dúvidas das clientes enquanto você atende.',
    bullets: ['Galeria de trabalhos', 'Serviços e valores organizados', 'Atendimento automático de dúvidas (com a Marina)'],
    marinaPrompt: 'Olá Marina! Tenho um salão de beleza e quero um site como o exemplo do Studio Bella.',
  },
  {
    id: 'loja',
    segment: 'Loja',
    brand: 'Casa & Cor Decorações',
    tagline: 'Peças para deixar sua casa com a sua cara',
    cta: 'Pedir pelo WhatsApp',
    accent: '#0F766E',
    soft: '#F0FDFA',
    dark: false,
    chips: ['Sala', 'Quarto', 'Cozinha', 'Ofertas'],
    hook: 'Sua loja aberta 24 horas, mesmo com a porta fechada.',
    pitch: 'Catálogo online com fotos e preços, e o pedido chega direto no seu WhatsApp, sem complicação.',
    bullets: ['Catálogo por categorias', 'Pedido direto pelo WhatsApp', 'Ofertas da semana em destaque'],
    marinaPrompt: 'Olá Marina! Tenho uma loja e quero um site com catálogo como o exemplo da Casa & Cor.',
  },
  {
    id: 'clinica',
    segment: 'Clínica ou consultório',
    brand: 'Clínica Sorriso Vivo',
    tagline: 'Cuidado com o seu sorriso, sem fila e sem espera',
    cta: 'Marcar consulta',
    accent: '#2563EB',
    soft: '#EFF6FF',
    dark: false,
    chips: ['Avaliação', 'Limpeza', 'Clareamento', 'Ortodontia'],
    hook: 'Pacientes que confiam em você antes mesmo da primeira consulta.',
    pitch: 'Um site que passa confiança, apresenta a equipe e os tratamentos, e facilita marcar a consulta.',
    bullets: ['Equipe e tratamentos apresentados', 'Marcação de consulta simples', 'Localização e formas de pagamento'],
    marinaPrompt: 'Olá Marina! Tenho uma clínica e quero um site como o exemplo da Clínica Sorriso Vivo.',
  },
  {
    id: 'restaurante',
    segment: 'Restaurante ou lanchonete',
    brand: 'Fogo Burger',
    tagline: 'Hambúrguer artesanal: peça agora e receba quentinho',
    cta: 'Fazer pedido',
    accent: '#DC2626',
    soft: '#111827',
    dark: true,
    chips: ['Hambúrgueres', 'Porções', 'Bebidas', 'Combos'],
    hook: 'Cardápio sempre atualizado e pedidos chegando direto para você.',
    pitch: 'Cardápio digital com fotos, combos do dia e botão de pedido pelo WhatsApp, sem pagar comissão de aplicativo.',
    bullets: ['Cardápio com fotos e combos', 'Pedido pelo WhatsApp, sem comissão', 'Horário de funcionamento e endereço'],
    marinaPrompt: 'Olá Marina! Tenho um restaurante/lanchonete e quero um site como o exemplo do Fogo Burger.',
  },
];
