import React, { useState, useEffect } from 'react';
import { UserCheck, Bot, Server, Workflow, Database, CheckCircle2, ArrowDown } from 'lucide-react';

export const EcosystemDiagram: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'cliente',
      label: 'CLIENTE',
      sublabel: 'Inbound / Lead / Usuário',
      desc: 'Entrada multicanal via site, WhatsApp, e-mail ou portal corporativo.',
      icon: UserCheck,
      color: 'from-sky-500 to-cyan-500',
      tag: 'Gatilho 24/7',
    },
    {
      id: 'agente',
      label: 'AGENTE DE IA',
      sublabel: 'Raciocínio & Triagem',
      desc: 'Compreende a intenção, qualifica, consulta regras e define a melhor ação.',
      icon: Bot,
      color: 'from-cyan-500 to-blue-500',
      tag: 'Marina & LLMs',
    },
    {
      id: 'sistemas',
      label: 'SISTEMAS',
      sublabel: 'CRMs, ERPs & APIs',
      desc: 'Comunicação direta com Salesforce, SAP, RD Station, Totvs e bancos.',
      icon: Server,
      color: 'from-blue-500 to-indigo-500',
      tag: 'Conectores Seguros',
    },
    {
      id: 'automacoes',
      label: 'AUTOMAÇÕES',
      sublabel: 'RPA & Workflows',
      desc: 'Execução instantânea de tarefas mecânicas, cliques em telas e rotinas.',
      icon: Workflow,
      color: 'from-indigo-500 to-violet-500',
      tag: 'Zero Falhas',
    },
    {
      id: 'dados',
      label: 'DADOS',
      sublabel: 'Logs & Auditoria',
      desc: 'Gravação estruturada, conformidade LGPD e atualização de indicadores.',
      icon: Database,
      color: 'from-violet-500 to-purple-500',
      tag: 'Histórico Vivo',
    },
    {
      id: 'resultado',
      label: 'RESULTADO',
      sublabel: 'Conversão & Eficiência',
      desc: 'Oportunidade pronta no CRM ou processo finalizado sem intervenção manual.',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-500',
      tag: 'Receita & Tempo Salvo',
    },
  ];

  // Subtle cycle for animation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div
      id="ecosystem-diagram"
      className="relative p-6 sm:p-8 rounded-2xl bg-[#0e1626]/80 border border-slate-800/90 shadow-2xl shadow-cyan-950/40 backdrop-blur-md"
    >
      {/* HEADER LABEL */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest text-cyan-300 uppercase font-bold">
            ARQUITETURA DO ECOSSISTEMA ANTUM
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          Fluxo Contínuo
        </span>
      </div>

      {/* PIPELINE NODES */}
      <div className="flex flex-col space-y-3">
        {steps.map((node, index) => {
          const isCurrent = activeStep === index;
          const Icon = node.icon;
          return (
            <React.Fragment key={node.id}>
              <div
                onClick={() => setActiveStep(index)}
                className={`group relative p-3 sm:p-3.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-500/10 -translate-y-0.5'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                      isCurrent
                        ? `bg-gradient-to-br ${node.color} text-white shadow-md shadow-cyan-500/30`
                        : 'bg-slate-900 text-slate-400 group-hover:text-cyan-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-mono font-bold tracking-wider ${
                          isCurrent ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {node.label}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 font-mono text-slate-400">
                        {node.tag}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block">
                      {node.sublabel}
                    </span>
                  </div>
                </div>

                <div className="hidden sm:block text-right max-w-[210px]">
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {node.desc}
                  </p>
                </div>
              </div>

              {/* ARROW CONNECTOR */}
              {index < steps.length - 1 && (
                <div className="flex justify-center -my-1">
                  <div
                    className={`flex items-center justify-center transition-colors ${
                      isCurrent ? 'text-cyan-400' : 'text-slate-700'
                    }`}
                  >
                    <ArrowDown className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>Tempo de ciclo médio: &lt; 3.8s</span>
        <span className="text-cyan-400/80">Sistemas que trabalham sozinhos</span>
      </div>
    </div>
  );
};
