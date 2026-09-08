export type ProductCategory = 
  | 'Todos' 
  | 'IA' 
  | 'Agentes' 
  | 'Automação' 
  | 'RPA' 
  | 'SaaS' 
  | 'CRM' 
  | 'Integrações';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'IA' | 'Agentes' | 'Automação' | 'RPA' | 'SaaS' | 'CRM' | 'Integrações';
  categoryLabel: string;
  badge: string;
  shortDescription: string;
  commercialHeadline: string;
  description: string;
  heroImage: string;
  screenshots: string[];
  liveUrl?: string;
  problemBefore: {
    title: string;
    points: string[];
    consequence: string;
  };
  solutionNow: {
    title: string;
    points: string[];
    outcome: string;
  };
  workflowSteps: Array<{
    step: number;
    title: string;
    description: string;
    detail: string;
  }>;
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  benefits: Array<{
    metric?: string;
    label: string;
    description: string;
  }>;
  targetAudience: Array<{
    profile: string;
    useCase: string;
  }>;
  integrations: string[];
  ctaText: string;
  seoTitle: string;
  seoDescription: string;
  demoType: 'chat' | 'pipeline' | 'rpa' | 'sync' | 'doc';
}

export type ArticleCategory = 
  | 'IA' 
  | 'AUTOMAÇÃO' 
  | 'RPA' 
  | 'AGENTES' 
  | 'VENDAS' 
  | 'TECNOLOGIA';

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: ArticleCategory;
  readTime: string;
  date: string;
  excerpt: string;
  keyTakeaways: string[];
  contentParagraphs: string[];
  checklist?: string[];
  conclusion: string;
  seoTitle: string;
  seoDescription: string;
}

export interface LabExperiment {
  id: string;
  title: string;
  status: 'Em Teste' | 'Prova de Conceito' | 'Protótipo Ativo' | 'Em Pesquisa';
  description: string;
  category: string;
  techStack: string[];
  keyInsight: string;
  metricsOrHighlight?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'marina';
  text: string;
  timestamp: string;
}
