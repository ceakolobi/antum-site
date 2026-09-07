import React, { useState } from 'react';
import {
  Brain,
  Cpu,
  Bot,
  Layers,
  Database,
  Network,
  Workflow,
  Shield,
  Code2,
  Terminal,
} from 'lucide-react';

export const TechStackSection: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<number | null>(0);

  const techStack = [
    {
      name: 'Agentes Autônomos',
      category: 'Raciocínio & Decisão',
      description: 'Arquiteturas ReAct e multi-agentes que decompõem metas complexas em passos executáveis e chamadas de ferramentas.',
      icon: Bot,
      highlight: 'Orquestração de tarefas',
    },
    {
      name: 'LLMs & Modelos de Linguagem',
      category: 'Inteligência Central',
      description: 'Modelos de fronteira selecionados por caso de uso com latência otimizada, streaming de respostas e tokenização eficiente.',
      icon: Brain,
      highlight: 'Processamento semântico',
    },
    {
      name: 'RAG (Retrieval-Augmented Generation)',
      category: 'Dados Proprietários',
      description: 'Bases vetoriais que alimentam a IA com manuais, políticas de preços e regras internas da sua empresa sem risco de alucinação.',
      icon: Database,
      highlight: 'Zero alucinação',
    },
    {
      name: 'APIs & Webhooks Corporativos',
      category: 'Conectividade',
      description: 'Comunicação direta com CRMs, ERPs, bancos de dados relacionais e gateways de mensageria via protocolos seguros.',
      icon: Network,
      highlight: 'Comunicação em tempo real',
    },
    {
      name: 'RPA & Automação de Interface',
      category: 'Execução Mecânica',
      description: 'Robôs com visão computacional para navegar em softwares legados, portais governamentais e telas sem API.',
      icon: Workflow,
      highlight: 'Operação em sistemas antigos',
    },
    {
      name: 'SaaS & Arquitetura Cloud',
      category: 'Engenharia de Software',
      description: 'Aplicações modernas em TypeScript, containers Docker e microsserviços em nuvem com alta disponibilidade e conformidade LGPD.',
      icon: Layers,
      highlight: 'Escalabilidade e segurança',
    },
  ];

  return (
    <section id="tech-stack" className="py-20 bg-[#070b12] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
              <Terminal className="w-3.5 h-3.5" />
              <span>Por trás da tecnologia</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Construímos com tecnologia real.
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Não empacotamos soluções genéricas. Desenvolvemos sistemas de software, agentes e automações robustas fundamentadas em engenharia sólida.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500">
            <span>Stack de Produção • Zero Dependência Frágil</span>
          </div>
        </div>

        {/* INTERACTIVE STACK GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {techStack.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = selectedTech === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedTech(idx)}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-950/50 -translate-y-1'
                    : 'bg-[#0a0f19] border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                        : 'bg-slate-800 text-cyan-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-cyan-400">{item.highlight}</span>
                  <span className="text-slate-500">#0{idx + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
