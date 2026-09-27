// Clientes da Antum exibidos na página /clientes.
// Para adicionar um cliente, acrescente um item nesta lista (só com informações que o cliente autorizou divulgar).
export interface ClientCase {
  name: string;
  segment: string;
  summary: string;
  delivered: string[];
  image: string;
  url: string;
}

export const clientsData: ClientCase[] = [
  {
    name: 'Citrino Semijoias',
    segment: 'Semijoias finas · E-commerce',
    summary:
      'Loja virtual completa para uma marca de semijoias, com painel próprio para a equipe gerenciar produtos, fotos e textos.',
    delivered: [
      'Loja virtual com catálogo por categorias, sacola e favoritos',
      'Área para revendedoras',
      'Painel de gestão (ERP) próprio',
      'Atendimento por IA no WhatsApp (Marina)',
    ],
    image: '/sites/citrino.jpg',
    url: 'https://citrinosemijoias.com.br/',
  },
  {
    name: 'FrançaRH',
    segment: 'Consultoria em RH · Recrutamento e seleção',
    summary:
      'Portal de recrutamento com áreas separadas para candidatos, empresas e a equipe da consultoria, tudo em um banco de dados próprio.',
    delivered: [
      'Login real para candidatos, empresas e administração',
      'Vagas, candidaturas e acompanhamento de etapas',
      'Currículo online e banco de talentos',
      'Site editável pela própria equipe',
    ],
    image: '/sites/francarh.jpg',
    url: 'https://francarh.antum.com.br/',
  },
  {
    name: 'Coisa e Tal',
    segment: 'Produtos para o lar · Loja virtual',
    summary: 'Loja virtual de produtos para casa, publicada em menos de uma semana, com pedidos direto pelo WhatsApp.',
    delivered: ['Catálogo por categorias e ofertas', 'Pedidos e atendimento pelo WhatsApp', 'Publicação em domínio próprio'],
    image: '/sites/coisaetal.jpg',
    url: 'https://coisaetal.antum.com.br/',
  },
  {
    name: 'Harmony Clube',
    segment: 'Proteção veicular · Site + sistema de gestão',
    summary: 'Site institucional com cotação online e um sistema de gestão (CRM) para leads, associados, veículos e contratos.',
    delivered: [
      'Site institucional com cotação online',
      'Atendimento por IA (Emily)',
      'Sistema de gestão: leads, associados, vistorias e contratos',
    ],
    image: '/sites/harmony.jpg',
    url: 'https://harmonyclube.com.br/',
  },
];
