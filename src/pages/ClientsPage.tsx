import React from 'react';
import { useRouter } from '../router/RouterContext';
import { clientsData } from '../data/clients';
import { ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';

export const ClientsPage: React.FC = () => {
  const { openMarinaModal } = useRouter();

  return (
    <div id="clients-page" className="min-h-screen pt-28 pb-20 bg-[#0b0f17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">Clientes</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 tracking-tight">
            Quem já trabalha com a ANTUM
          </h1>
          <p className="text-base text-slate-400 mt-4 leading-relaxed">
            Empresas que colocaram a ANTUM para construir sites, sistemas e atendimento com IA. Veja o que entregamos
            para cada uma e visite os projetos no ar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clientsData.map((c) => (
            <article
              key={c.name}
              className="rounded-2xl bg-[#0e1422] border border-slate-800 hover:border-cyan-700/60 transition-colors overflow-hidden flex flex-col"
            >
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="block aspect-[16/8] overflow-hidden bg-slate-900">
                <img
                  src={c.image}
                  alt={`Site de ${c.name}`}
                  loading="lazy"
                  className="w-full h-full object-cover object-top hover:scale-[1.02] transition-transform duration-500"
                />
              </a>
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{c.name}</h2>
                  <p className="text-xs font-mono uppercase tracking-wider text-cyan-400 mt-1">{c.segment}</p>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{c.summary}</p>
                <ul className="space-y-2 flex-1">
                  {c.delivered.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  Visitar site <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-indigo-950/40 border border-slate-800 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Quer um projeto assim para a sua empresa?</h2>
          <p className="text-sm text-slate-400 mt-3 max-w-xl mx-auto">
            Conte o que você precisa e a Marina, nossa SDR de IA, já organiza o briefing para a equipe.
          </p>
          <button
            onClick={() => openMarinaModal('Olá Marina! Vi os clientes da ANTUM e gostaria de um projeto semelhante.')}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Falar com a Marina</span>
          </button>
        </div>
      </div>
    </div>
  );
};
