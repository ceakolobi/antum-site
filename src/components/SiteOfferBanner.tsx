import React, { useEffect, useState } from 'react';
import { useRouter } from '../router/RouterContext';
import { Link } from '../router/Link';
import { demoSites, DemoSite } from '../data/demoSites';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

/** Mini-site de exemplo desenhado em CSS (empresa fictícia). */
const DemoMockup: React.FC<{ site: DemoSite }> = ({ site }) => {
  const text = site.dark ? '#F8FAFC' : '#0F172A';
  const muted = site.dark ? '#94A3B8' : '#475569';
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl shadow-black/50 bg-slate-900">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/80 border-b border-slate-700">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        <span className="ml-3 flex-1 text-[10px] font-mono text-slate-400 bg-slate-900/70 rounded px-2 py-0.5 truncate">
          www.{site.brand.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com.br
        </span>
      </div>
      <div style={{ background: site.soft, color: text }} className="p-5 sm:p-6 min-h-[300px] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-extrabold tracking-tight" style={{ color: site.accent }}>
            {site.brand}
          </span>
          <span className="hidden sm:flex gap-3 text-[10px]" style={{ color: muted }}>
            <span>Início</span>
            <span>Serviços</span>
            <span>Contato</span>
          </span>
        </div>
        <div className="pt-2">
          <h3 className="text-xl sm:text-2xl font-extrabold leading-tight max-w-[18ch]">{site.tagline}</h3>
          <span
            className="inline-block mt-3 px-4 py-2 rounded-lg text-xs font-bold text-white"
            style={{ background: site.accent }}
          >
            {site.cta}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-auto">
          {site.chips.map((c) => (
            <div
              key={c}
              className="px-3 py-2 rounded-lg text-[11px] font-semibold border"
              style={{
                borderColor: `${site.accent}55`,
                background: site.dark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                color: text,
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SiteOfferBanner: React.FC = () => {
  const { openMarinaModal } = useRouter();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % demoSites.length), 6000);
    return () => clearInterval(id);
  }, [paused]);

  const site = demoSites[index];
  const go = (d: number) => setIndex((i) => (i + d + demoSites.length) % demoSites.length);

  return (
    <section
      id="site-para-sua-empresa"
      className="py-20 bg-gradient-to-b from-[#0b0f17] via-[#0a1220] to-[#0b0f17] border-y border-slate-800/70"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">Site para a sua empresa</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
            Você quer um site para a sua empresa?
          </h2>
          <p className="text-base text-slate-300 mt-3 leading-relaxed">
            A gente cria e coloca no ar <strong className="text-white">sem cobrar pela criação</strong>. Você paga só a
            mensalidade: <strong className="text-cyan-300">R$ 70/mês</strong>, ou{' '}
            <strong className="text-cyan-300">R$ 99/mês com a Marina</strong> atendendo seus clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Texto do slide */}
          <div className="space-y-5 order-2 lg:order-1" key={site.id + '-txt'}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-wider">
              {site.segment}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{site.hook}</h3>
            <p className="text-slate-300 leading-relaxed">{site.pitch}</p>
            <ul className="space-y-2">
              {site.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => openMarinaModal(site.marinaPrompt)}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-sm tracking-wider uppercase shadow-xl shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Quero um site assim</span>
              </button>
              <Link
                to="/como-funciona"
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm text-center flex items-center justify-center gap-2"
              >
                <span>Como funciona</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </Link>
            </div>
          </div>

          {/* Mockup */}
          <div className="order-1 lg:order-2">
            <DemoMockup site={site} key={site.id} />
            <p className="mt-3 text-[11px] text-slate-500 text-center">
              Exemplo ilustrativo de empresa fictícia. Seu site é feito com a sua marca, suas fotos e seus serviços.
            </p>
          </div>
        </div>

        {/* Controles */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button onClick={() => go(-1)} aria-label="Exemplo anterior" className="p-2 rounded-full border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            {demoSites.map((d, i) => (
              <button
                key={d.id}
                onClick={() => setIndex(i)}
                aria-label={`Ver exemplo: ${d.segment}`}
                className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-600 hover:bg-slate-500'}`}
              />
            ))}
          </div>
          <button onClick={() => go(1)} aria-label="Próximo exemplo" className="p-2 rounded-full border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
