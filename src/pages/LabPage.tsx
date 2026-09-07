import React, { useState } from 'react';
import { useRouter } from '../router/RouterContext';
import { labExperimentsData } from '../data/labProjects';
import {
  FlaskConical,
  Sparkles,
  Terminal,
  ArrowRight,
  Activity,
  Cpu,
  Eye,
  Mic,
  Workflow,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export const LabPage: React.FC = () => {
  const { openMarinaModal } = useRouter();
  const [activeTab, setActiveTab] = useState<string>('todos');

  return (
    <div id="lab-page" className="min-h-screen pt-24 pb-20 bg-[#070b12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/40 text-xs font-mono text-indigo-300">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>R&D & PROTÓTIPOS EXPERIMENTAIS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            ANTUM LAB
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Pesquisamos, testamos e construímos a fronteira da inteligência artificial aplicada. Conheça nossos experimentos em andamento, arquiteturas conceituais e protótipos em fase de validação.
          </p>
        </div>

        {/* EXPERIMENTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {labExperimentsData.map((exp) => (
            <div
              key={exp.id}
              id={`lab-card-${exp.id}`}
              className="p-8 rounded-3xl bg-[#0c1220] border border-indigo-500/20 hover:border-indigo-500/50 shadow-2xl transition-all space-y-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                    {exp.category}
                  </span>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      exp.status === 'Protótipo Ativo'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                        : exp.status === 'Em Teste'
                        ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-800/60'
                    }`}
                  >
                    ● {exp.status}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {exp.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  {exp.description}
                </p>

                {/* HIGHLIGHTS */}
                <div className="space-y-2 mb-6">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                    Insight de Engenharia:
                  </span>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300">
                    <p className="text-cyan-300 font-mono mb-1">{exp.keyInsight}</p>
                    {exp.metricsOrHighlight && (
                      <p className="text-slate-400">{exp.metricsOrHighlight}</p>
                    )}
                  </div>
                </div>

                {/* TECH STACK TAGS */}
                <div className="flex flex-wrap gap-1.5">
                  {exp.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* ACTION */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Acesso antecipado para clientes ANTUM
                </span>
                <button
                  onClick={() => openMarinaModal(`Olá Marina! Tenho interesse no experimento do Lab: "${exp.title}". Como posso testar?`)}
                  className="px-4 py-2 rounded-xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Solicitar Acesso Alpha</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* LAB BOTTOM MANIFESTO */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/40 border border-indigo-500/30 text-center space-y-4">
          <h3 className="text-2xl font-extrabold text-white">
            Tem um desafio não resolvido na sua indústria?
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Projetamos provas de conceito (PoCs) e co-desenvolvemos protótipos de alta complexidade em parceria com clientes estratégicos.
          </p>
          <div className="pt-2">
            <button
              onClick={() => openMarinaModal('Olá Marina! Gostaria de propor uma PoC (Prova de Conceito) com o ANTUM LAB.')}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Propor uma Prova de Conceito</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
