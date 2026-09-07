import React, { useState } from 'react';
import { useRouter } from '../router/RouterContext';
import { Link } from '../router/Link';
import { articlesData } from '../data/articles';
import { ArticleCategory } from '../types';
import { BookOpen, ArrowRight, Filter, Clock, Sparkles } from 'lucide-react';

export const ArticlesPage: React.FC = () => {
  const { openMarinaModal } = useRouter();
  const [selectedCat, setSelectedCat] = useState<string>('TODOS');

  const categories = ['TODOS', 'IA', 'AUTOMAÇÃO', 'RPA', 'AGENTES', 'VENDAS', 'TECNOLOGIA'];

  const filteredArticles = selectedCat === 'TODOS'
    ? articlesData
    : articlesData.filter((a) => a.category === selectedCat);

  return (
    <div id="articles-page" className="min-h-screen pt-24 pb-20 bg-[#0b0f17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <BookOpen className="w-3.5 h-3.5" />
            <span>CONTEÚDO PRÁTICO & EDITORIAL</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            IA na prática
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Sem teorias acadêmicas ou manuais técnicos densos. Análises diretas, critérios de engenharia e insights práticos sobre automação, agentes e sistemas inteligentes.
          </p>
        </div>

        {/* CATEGORY SELECTOR */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <span className="text-xs font-mono text-slate-500 uppercase flex items-center gap-1 shrink-0 mr-2">
            <Filter className="w-3.5 h-3.5" /> Tópico:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25 border border-cyan-400'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ARTICLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredArticles.map((art) => (
            <Link
              key={art.id}
              to={`/conteudo/${art.slug}`}
              id={`article-card-${art.id}`}
              className="group p-7 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-cyan-500/60 shadow-xl hover:shadow-cyan-950/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4 text-xs font-mono">
                  <span className="px-2.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 uppercase">
                    {art.category}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {art.readTime}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mb-3">
                  {art.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3 mb-6">
                  {art.excerpt}
                </p>

                {/* KEY TAKEAWAY BULLET */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-4">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                    Ponto Central:
                  </span>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {art.keyTakeaways[0]}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                <span>Ler artigo completo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* EDITORIAL CALLOUT */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Quer aplicar esses conceitos na sua operação?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Nossa SDR de IA pode analisar seu fluxo de trabalho atual e indicar se a solução ideal é um agente autônomo, um fluxo de automação ou um robô RPA.
            </p>
          </div>

          <button
            onClick={() => openMarinaModal('Olá Marina! Gostaria de uma avaliação sobre qual tecnologia aplicar na minha empresa.')}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Conversar com a Marina</span>
          </button>
        </div>

      </div>
    </div>
  );
};
