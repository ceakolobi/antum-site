import React, { useEffect, useState } from 'react';
import { useRouter } from '../router/RouterContext';
import { Link } from '../router/Link';
import { demoSites, DemoSite } from '../data/demoSites';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

/** Mini-site de exemplo (empresa fictícia) com foto de fundo. */
const DemoMockup: React.FC<{ site: DemoSite }> = ({ site }) => {
  const initial = site.brand.charAt(0);
  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl shadow-black/60 bg-slate-900">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/90 border-b border-slate-700">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        <span className="ml-3 flex-1 text-[10px] font-mono text-slate-400 bg-slate-900/70 rounded px-2 py-0.5 truncate">
          www.{site.brand.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com.br
        </span>
      </div>

      {/* cabeçalho do site */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: site.dark ? '#0B1220' : '#FFFFFF' }}>
        <div className="flex items-center gap-2">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold text-white"
            style={{ background: site.accent }}
          >
            {initial}
          </span>
          <span className="text-xs font-extrabold tracking-tight" style={{ color: site.dark ? '#F8FAFC' : '#0F172A' }}>
            {site.brand}
          </span>
        </div>
        <span className="hidden sm:flex gap-4 text-[10px] font-medium" style={{ color: site.dark ? '#94A3B8' : '#475569' }}>
          <span>Início</span>
          <span>Serviços</span>
          <span>Sobre</span>
          <span>Contato</span>
        </span>
      </div>

      {/* hero com foto */}
      <div className="relative h-[210px] sm:h-[240px]">
        <img src={site.image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(2,6,23,0.88) 0%, rgba(2,6,23,0.55) 55%, rgba(2,6,23,0.15) 100%)' }} />
        <div className="relative h-full p-5 sm:p-6 flex flex-col justify-center gap-3 max-w-[78%]">
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: site.accent }}>
            {site.open}
          </span>
          <h3 className="text-lg sm:text-2xl font-extrabold leading-tight text-white">{site.tagline}</h3>
          <span
            className="self-start px-4 py-2 rounded-lg text-[11px] font-bold text-white shadow-lg"
            style={{ background: site.accent }}
          >
            {site.cta}
          </span>
        </div>
      </div>

      {/* serviços */}
      <div className="grid grid-cols-4 gap-2 p-3" style={{ background: site.dark ? '#0B1220' : '#F8FAFC' }}>
        {site.chips.map((chip) => (
          <div
            key={chip}
            className="rounded-lg px-2 py-2.5 text-center text-[10px] font-semibold leading-tight border"
            style={{
              borderColor: site.dark ? 'rgba(255,255,255,0.10)' : '#E2E8F0',
              background: site.dark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
              color: site.dark ? '#E2E8F0' : '#0F172A',
            }}
          >
            <span className="block w-1.5 h-1.5 rounded-full mx-auto mb-1.5" style={{ background: site.accent }} />
            {chip}
          </div>
        ))}
      </div>

      {/* ícone flutuante de WhatsApp */}
      <span className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#25D366] shadow-lg shadow-black/40 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.22-8.23 8.22zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
        </svg>
      </span>
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
            <strong className="text-cyan-300">R$ 99/mês com a Marina</strong> atendendo seus clientes. Loja virtual ou
            sistema com a Marina: <strong className="text-cyan-300">R$ 180/mês</strong>.
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
