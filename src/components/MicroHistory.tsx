import React from 'react';
import { useRouter } from '../router/RouterContext';
import { Sparkles, Moon, Clock, Check, ArrowRight } from 'lucide-react';

export const MicroHistory: React.FC = () => {
  const { openMarinaModal } = useRouter();

  const events = [
    { time: '23:42', label: 'O lead chegou pelo site.' },
    { time: '23:42', label: 'A IA respondeu em 12 segundos.' },
    { time: '23:44', label: 'O cliente fez uma pergunta técnica complexa.' },
    { time: '23:44', label: 'A IA consultou a base e respondeu com precisão.' },
    { time: '23:46', label: 'O cliente apresentou uma objeção de orçamento.' },
    { time: '23:47', label: 'A IA tratou a objeção com dados de retorno sobre investimento.' },
    { time: '23:49', label: 'O sistema registrou todo o histórico no CRM.' },
    { time: '08:00', label: 'O vendedor iniciou o dia com a reunião agendada e a oportunidade pronta.' },
  ];

  return (
    <section
      id="secao-e-se"
      className="py-20 bg-gradient-to-b from-[#0b0f17] via-[#0d1424] to-[#0b0f17] border-y border-slate-800/80 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-mono uppercase tracking-widest mb-4">
            <Moon className="w-3.5 h-3.5" />
            <span>Operação 24 Horas Autônoma</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            E se o seu negócio pudesse trabalhar enquanto você dorme?
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            A maioria dos negócios perde oportunidades fora do horário comercial. Veja o que acontece quando a inteligência artificial assume a primeira linha:
          </p>
        </div>

        {/* TIMELINE OF EVENTS */}
        <div className="max-w-2xl mx-auto bg-[#070b12]/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="space-y-4">
            {events.map((evt, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-2.5 rounded-lg hover:bg-slate-900/60 transition-colors border-l-2 border-slate-800 hover:border-cyan-400 pl-4"
              >
                <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-cyan-400 shrink-0 pt-0.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{evt.time}</span>
                </div>
                <div className="flex items-center justify-between flex-1 gap-2">
                  <p className="text-xs sm:text-sm font-medium text-slate-200">
                    {evt.label}
                  </p>
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
              </div>
            ))}
          </div>

          {/* CONCLUSION BLOCK */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <p className="text-sm font-bold text-white uppercase tracking-wider">
                Isso já deixou de ser ficção.
              </p>
              <p className="text-xs text-cyan-400 font-mono">
                É automação aplicada.
              </p>
            </div>

            <button
              onClick={() => openMarinaModal('Quero que meu negócio trabalhe no piloto automático!')}
              className="px-5 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Ver como funciona na prática</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
