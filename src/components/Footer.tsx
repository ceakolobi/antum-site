import React from 'react';
import { Link } from '../router/Link';
import { useRouter } from '../router/RouterContext';
import { Sparkles, ArrowUpRight, Cpu, ShieldCheck, Terminal, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { openMarinaModal } = useRouter();

  return (
    <footer id="main-footer" className="bg-[#070a10] border-t border-slate-800/80 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-slate-800/60">
          
          {/* BRAND COLUMN */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-lg">
                A
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  ANTUM
                </span>
                <span className="block text-[9px] font-mono tracking-widest text-slate-400 uppercase">
                  AI • AUTOMATION • SOFTWARE
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Não vendemos apenas tecnologia. Criamos sistemas que trabalham.
              Transformamos processos manuais repetitivos em fluxos inteligentes que operam continuamente.
            </p>

            {/* LIVE SYSTEM STATUS */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Sistemas & Agentes operando 24/7</span>
            </div>
          </div>

          {/* COL 2: PRODUTOS & SOLUÇÕES */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">
              Soluções & Sistemas
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/portfolio/marina-sdr" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>Marina — SDR com IA</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-cyan-950 text-cyan-400 rounded border border-cyan-800/50">Core</span>
                </Link>
              </li>
              <li>
                <Link to="/portfolio/antum-flow" className="hover:text-cyan-400 transition-colors">
                  Antum Flow (Automações)
                </Link>
              </li>
              <li>
                <Link to="/portfolio/nexus-rpa" className="hover:text-cyan-400 transition-colors">
                  Nexus RPA (Sistemas Legados)
                </Link>
              </li>
              <li>
                <Link to="/portfolio/sync-bridge" className="hover:text-cyan-400 transition-colors">
                  SyncBridge (Conexões CRM/ERP)
                </Link>
              </li>
              <li>
                <Link to="/portfolio/pulse-ops" className="hover:text-cyan-400 transition-colors">
                  PulseOps (Documentos & Backoffice)
                </Link>
              </li>
            </ul>
          </div>

          {/* COL 3: CONTEÚDO & LAB */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">
              Explorar
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/solucoes" className="hover:text-cyan-400 transition-colors">
                  Todas as Soluções
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-cyan-400 transition-colors">
                  Portfólio Completo
                </Link>
              </li>
              <li>
                <Link to="/conteudo" className="hover:text-cyan-400 transition-colors">
                  IA na Prática (Artigos)
                </Link>
              </li>
              <li>
                <Link to="/lab" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <span>ANTUM LAB</span>
                  <span className="text-[9px] px-1 py-0.2 bg-indigo-950 text-indigo-400 rounded border border-indigo-800/40">R&D</span>
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="hover:text-cyan-400 transition-colors">
                  Sobre a ANTUM
                </Link>
              </li>
              <li>
                <Link to="/contato" className="hover:text-cyan-400 transition-colors">
                  Falar com Engenharia
                </Link>
              </li>
            </ul>
          </div>

          {/* COL 4: MARINA AGENT PROMPT */}
          <div className="md:col-span-3 space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-inner">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span className="text-xs font-semibold text-white">Canal Direto de Vendas</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Quer saber como a IA se aplica ao seu fluxo específico? Fale agora com nossa SDR de IA.
              </p>
              <button
                onClick={() => openMarinaModal()}
                className="w-full py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Falar com a Marina</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} ANTUM Tecnologia. Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>São Paulo, Brasil</span>
            <span>•</span>
            <span className="text-slate-400">Transformamos processos em sistemas.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
