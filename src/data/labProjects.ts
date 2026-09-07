import { LabExperiment } from '../types';

export const labExperimentsData: LabExperiment[] = [
  {
    id: 'exp-multi-agent-consensus',
    title: 'Consenso Multi-Agente para Análise de Risco de Crédito',
    status: 'Protótipo Ativo',
    category: 'Sistemas Multi-Agente',
    description: 'Três agentes especializados (Auditor Contábil, Especialista de Mercado e Analista de Fraudes) debatem em tempo real para emitir parecer de crédito corporativo.',
    techStack: ['LLM Orchestration', 'Debate Consensus Protocol', 'Vector Search'],
    keyInsight: 'O debate contraditório entre agentes reduziu falsos positivos em 34% comparado a um único modelo tentando analisar todo o balanço.',
    metricsOrHighlight: '-34% Falsos Positivos',
  },
  {
    id: 'exp-vision-legacy-screens',
    title: 'Visão Computacional Semântica para Telas de Mainframe e ERPs dos anos 90',
    status: 'Prova de Conceito',
    category: 'RPA + Visão',
    description: 'Mapeamento autônomo de interfaces legadas baseadas em terminal (telas verdes) ou Delphi antigo, identificando campos mesmo sem metadados do sistema operacional.',
    techStack: ['Vision AI', 'OCR Local', 'Synthetic Event Dispatcher'],
    keyInsight: 'Permite automação de sistemas bancários e industriais onde o código-fonte original foi perdido ou não pode ser alterado.',
    metricsOrHighlight: 'Zero dependência de API',
  },
  {
    id: 'exp-autonomous-doc-sanitizer',
    title: 'Sanitizador Autônomo de PII e Segredos Industriais em Tempo Real',
    status: 'Em Teste',
    category: 'Privacidade & LGPD',
    description: 'Pipeline de inferência de baixa latência (<25ms) que anonimiza dados confidenciais antes que qualquer prompt ou documento seja submetido a redes externas.',
    techStack: ['Regex Heuristics', 'Named Entity Recognition', 'Local Embeddings'],
    keyInsight: 'Conformidade rígida com LGPD e sigilo comercial sem degradar a qualidade do raciocínio dos modelos centrais.',
    metricsOrHighlight: '< 25ms Latência',
  },
  {
    id: 'exp-voice-sdr-portuguese',
    title: 'Agente de Voz em Português com Latência Ultrabaixa para Cold Calls Inbound',
    status: 'Em Pesquisa',
    category: 'Voz & Tempo Real',
    description: 'Pipeline de voz bidirecional capaz de atender ligações telefônicas no Brasil, com entonação coloquial, sem parecer robô e com interrupção natural do usuário.',
    techStack: ['WebRTC', 'Fast TTS Streaming', 'Speech-to-Speech Architecture'],
    keyInsight: 'A capacidade de interrupção instantânea (barge-in) faz o interlocutor acreditar que está conversando com um operador humano nos primeiros 3 minutos.',
    metricsOrHighlight: 'Latência < 600ms',
  },
];
