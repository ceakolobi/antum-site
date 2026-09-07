import React, { useState } from 'react';
import { useRouter } from '../router/RouterContext';
import { Link } from '../router/Link';
import {
  Bot,
  Sparkles,
  Workflow,
  Cpu,
  Layers,
  Network,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const SolutionsPage: React.FC = () => {
  const { openMarinaModal } = useRouter();
  const [activeTab, setActiveTab] = useState('todos');

  const pillars = [
    {
      id: 'agentes',
      title: 'Agentes de IA Autônomos',
      badge: 'Inteligência Cognitiva',
      icon: Bot,
      short: 'Agentes com capacidade de raciocinar sobre dados não estruturados, executar ações via ferramentas e tomar decisões de negócio controladas.',
      problem: 'Decisões operacionais travadas porque dependem de um analista ler e-mails longos, documentos ou mensagens soltas.',
      solution: 'O agente interpreta o contexto, valida regras corporativas e aciona diretamente os sistemas internos.',
      concreteExamples: [
        'Triagem autônoma de chamados de suporte técnico de nível 1 e 2.',
        'Análise de conformidade e minuta preliminar de contratos jurídicos.',
        'Resumo executivo diário e priorização de alertas operacionais.',
      ],
      productLink: '/portfolio/marina-sdr',
      productName: 'Conhecer a Marina e Agentes Customizados',
    },
    {
      id: 'sdr',
      title: 'SDR com Inteligência Artificial',
      badge: 'Vendas & Prospecção',
      icon: Sparkles,
      short: 'Atendimento e qualificação comercial instantânea com agendamento direto na agenda dos seus executivos de vendas.',
      problem: 'Leads qualificados esfriam enquanto aguardam horas por um primeiro contato comercial humano.',
      solution: 'Engajamento em menos de 15 segundos, qualificação profunda BANT/MEDDIC e entrega da reunião confirmada no CRM.',
      concreteExamples: [
        'Atendimento 24/7 no site e WhatsApp Business.',
        'Reativação automatizada de base de leads inativos.',
        'Qualificação de cotações técnicas com múltiplos parâmetros.',
      ],
      productLink: '/portfolio/marina-sdr',
      productName: 'Ver projeto: Marina SDR de IA',
    },
    {
      id: 'automacao',
      title: 'Automação de Processos (Workflows)',
      badge: 'Orquestração de Dados',
      icon: Workflow,
      short: 'Fluxos de trabalho determinísticos que conectam webhooks, bancos de dados, planilhas e inteligência artificial sem intervenção humana.',
      problem: 'Equipes sobrecarregadas copiando dados entre plataformas e resolvendo gargalos de digitação.',
      solution: 'Gatilhos automáticos executados em milissegundos com regras de negócio rígidas e auditoria.',
      concreteExamples: [
        'Onboarding de novos clientes e emissão de contratos e ordens de serviço.',
        'Conciliação financeira automática entre gateways de pagamento e ERP.',
        'Sincronização de pedidos de e-commerce e faturamento em tempo real.',
      ],
      productLink: '/portfolio/antum-flow',
      productName: 'Ver projeto: Antum Flow',
    },
    {
      id: 'rpa',
      title: 'RPA em Sistemas Legados',
      badge: 'Automação sem APIs',
      icon: Cpu,
      short: 'Robôs virtuais que operam telas desktop, portais governamentais e softwares antigos exatamente como um operador humano.',
      problem: 'Sistemas essenciais sem APIs modernas onde a integração manual consome centenas de horas operacionais.',
      solution: 'Bots resilientes com visão computacional para preencher formulários, baixar guias e atualizar cadastros.',
      concreteExamples: [
        'Download diário de notas fiscais em portais de prefeituras e secretarias de fazenda.',
        'Inserção de pedidos em ERPs legados (Totvs, SAP, Senior) a partir de planilhas.',
        'Consulta em massa de certidões e restrições cadastrais.',
      ],
      productLink: '/portfolio/nexus-rpa',
      productName: 'Ver projeto: Nexus RPA',
    },
    {
      id: 'saas',
      title: 'Desenvolvimento de SaaS Sob Medida',
      badge: 'Software Proprietário',
      icon: Layers,
      short: 'Criação de plataformas web corporativas e produtos digitais desenhados exclusivamente para a metodologia da sua empresa.',
      problem: 'Softwares de mercado engessados que cobram mensalidades caras e não atendem particularidades da operação.',
      solution: 'Plataforma sob medida com código proprietário, IA nativa e infraestrutura escalável.',
      concreteExamples: [
        'Portais exclusivos de atendimento e autosserviço para clientes.',
        'Painéis de gestão operacional e controle de esteiras de produção.',
        'Produtos SaaS B2B lançados como novos negócios pela sua empresa.',
      ],
      productLink: '/portfolio/custom-saas',
      productName: 'Ver projeto: ANTUM Custom SaaS',
    },
    {
      id: 'integracoes',
      title: 'Integrações de IA com CRMs & ERPs',
      badge: 'Conectores Seguros',
      icon: Network,
      short: 'Ponte de dados segura entre modelos de inteligência artificial e os sistemas estruturados onde sua empresa já opera.',
      problem: 'IAs que funcionam como simples chatbots isolados sem poder consultar ou atualizar a operação real.',
      solution: 'Conectores tipados e protegidos por permissões corporativas e anonimização de dados pessoais.',
      concreteExamples: [
        'Agente consultando estoque real no ERP durante conversa com o cliente.',
        'Criação de oportunidades no Salesforce e envio de alertas no Slack.',
        'Sanitização e mascaramento de dados sensíveis para conformidade LGPD.',
      ],
      productLink: '/portfolio/sync-bridge',
      productName: 'Ver projeto: SyncBridge Hub',
    },
  ];

  return (
    <div id="solutions-page" className="min-h-screen pt-24 pb-20 bg-[#0b0f17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <span>ARQUITETURA DE SOLUÇÕES ANTUM</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engenharia de automação desenhada para trabalhar.
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Não vendemos pacotes genéricos. Diagnosticamos seu gargalo operacional e construímos a combinação exata de agentes de IA, automação e integrações necessária para eliminar o trabalho manual.
          </p>
        </div>

        {/* PILLARS GRID */}
        <div className="space-y-12 mb-20">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                id={`solucao-item-${pillar.id}`}
                className="p-8 sm:p-10 rounded-3xl bg-[#0e1424] border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* LEFT: TITLE & SHORT */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800 uppercase">
                          {pillar.badge}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                          {pillar.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {pillar.short}
                    </p>

                    <div className="pt-2">
                      <Link
                        to={pillar.productLink}
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300"
                      >
                        <span>{pillar.productName}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* RIGHT: PROBLEM, SOLUTION & USE CASES */}
                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80">
                    <div className="space-y-2">
                      <span className="text-[11px] font-mono font-bold text-rose-400 uppercase tracking-wider block">
                        O Gargalo Típico
                      </span>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {pillar.problem}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                        A Solução ANTUM
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {pillar.solution}
                      </p>
                    </div>

                    <div className="sm:col-span-2 pt-3 border-t border-slate-800">
                      <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-2">
                        Aplicações reais em clientes:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {pillar.concreteExamples.map((ex, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* COMPARISON / WHEN TO USE MATRIX */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#090d16] border border-slate-800 mb-20">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              Guia Prático de Escolha
            </span>
            <h3 className="text-2xl font-extrabold text-white mt-1">
              Agente de IA, Automação ou RPA: quando aplicar cada um?
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Escolher a tecnologia errada gera custo e fragilidade. Na ANTUM, combinamos a ferramenta exata para a natureza do seu dado.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-3 px-4">Critério</th>
                  <th className="py-3 px-4 text-cyan-400 font-bold">Agente de IA</th>
                  <th className="py-3 px-4 text-blue-400 font-bold">Automação (Flow)</th>
                  <th className="py-3 px-4 text-violet-400 font-bold">RPA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Natureza da Entrada</td>
                  <td className="py-3.5 px-4">Texto livre, áudio, linguagem natural, contexto aberto</td>
                  <td className="py-3.5 px-4">Webhooks estruturados, JSON, eventos de API</td>
                  <td className="py-3.5 px-4">Telas desktop, portais web sem API, planilhas</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Capacidade de Decisão</td>
                  <td className="py-3.5 px-4">Pondera múltiplos fatores e contorna ambiguidades</td>
                  <td className="py-3.5 px-4">Regras lógicas determinísticas (if/then/else)</td>
                  <td className="py-3.5 px-4">Sequência exata de cliques e preenchimentos</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Latência Média</td>
                  <td className="py-3.5 px-4">1 a 3 segundos (tempo de raciocínio)</td>
                  <td className="py-3.5 px-4">&lt; 100 milissegundos</td>
                  <td className="py-3.5 px-4">Velocidade da aplicação de tela (5s a 30s)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Melhor Caso de Uso</td>
                  <td className="py-3.5 px-4">Qualificação comercial (SDR), atendimento N1, análise de contratos</td>
                  <td className="py-3.5 px-4">Sincronização de CRM/ERP, faturamento, notificações</td>
                  <td className="py-3.5 px-4">Download de notas em prefeituras, digitação em sistemas legados</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="text-center p-12 rounded-3xl bg-gradient-to-b from-[#0e1628] to-[#090d16] border border-cyan-500/30">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Não sabe qual solução se encaixa melhor no seu caso?
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6">
            Converse com a Marina. Ela faz um diagnóstico rápido das suas ferramentas e orienta qual arquitetura trará mais retorno.
          </p>
          <button
            onClick={() => openMarinaModal('Olá Marina! Preciso de ajuda para escolher a solução certa para minha empresa.')}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Falar com a Marina agora</span>
          </button>
        </div>

      </div>
    </div>
  );
};
