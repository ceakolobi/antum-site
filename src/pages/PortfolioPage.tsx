import React, { useState } from 'react';
import { useRouter } from '../router/RouterContext';
import { Link } from '../router/Link';
import { productsData } from '../data/products';
import { ProductCategory } from '../types';
import { Sparkles, ArrowRight, Filter, Layers, Check } from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const { openMarinaModal } = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Todos');

  const categories: ProductCategory[] = [
    'Todos',
    'IA',
    'Agentes',
    'Automação',
    'RPA',
    'SaaS',
    'CRM',
    'Integrações',
  ];

  const filteredProducts = selectedCategory === 'Todos'
    ? productsData
    : productsData.filter((p) => p.category === selectedCategory || p.categoryLabel.includes(selectedCategory));

  return (
    <div id="portfolio-page" className="min-h-screen pt-24 pb-20 bg-[#0b0f17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Layers className="w-3.5 h-3.5" />
            <span>PORTFÓLIO & SHOWROOM DE PRODUTOS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Tecnologia que saiu do papel.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Conheça alguns dos produtos, sistemas e experiências que desenvolvemos. Cada produto possui sua própria página individual com arquitetura completa e demonstração interativa.
          </p>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <span className="text-xs font-mono text-slate-500 uppercase flex items-center gap-1 shrink-0 mr-2">
            <Filter className="w-3.5 h-3.5" /> Filtro:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
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

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              id={`portfolio-item-${prod.slug}`}
              className="group rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-cyan-500/50 shadow-xl overflow-hidden transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* IMAGE CONTAINER */}
                <div className="relative h-52 overflow-hidden bg-slate-950">
                  <img
                    src={prod.heroImage}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424] via-transparent to-black/40" />

                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-cyan-300 border border-cyan-500/40">
                      {prod.category}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-slate-900/80 text-slate-300 border border-slate-700">
                      {prod.badge}
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {prod.name}
                  </h2>
                  <p className="text-xs text-cyan-400/90 font-mono mb-3">
                    {prod.commercialHeadline}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {prod.shortDescription}
                  </p>

                  {/* INTEGRATIONS TAGS */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {prod.integrations.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                    {prod.integrations.length > 4 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-500">
                        +{prod.integrations.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="p-6 pt-0">
                <Link
                  to={`/portfolio/${prod.slug}`}
                  id={`btn-view-${prod.slug}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-slate-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between"
                >
                  <span>Ver projeto</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* PORTFOLIO BOTTOM BANNER */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Precisa de um sistema ou produto com requisitos específicos?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Nossa equipe de engenharia desenvolve integrações e agentes sob medida para operações que necessitam de regras estritas ou sistemas legados.
            </p>
          </div>

          <button
            onClick={() => openMarinaModal('Quero desenvolver um sistema sob medida com a ANTUM!')}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Consultar Viabilidade com Marina</span>
          </button>
        </div>

      </div>
    </div>
  );
};
