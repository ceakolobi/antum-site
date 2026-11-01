import React from 'react';

/**
 * Banner da Marina SDR, logo abaixo do menu.
 * Leva para a landing /marina-sdr (pagina estatica servida pelo Express),
 * por isso usa <a> comum e nao o roteador interno do SPA.
 */
export const MarinaBanner: React.FC = () => (
  <section id="marina-banner" aria-label="Marina SDR - Atendente Comercial Inteligente" className="px-4 sm:px-6 lg:px-8 pt-4">
    <a
      href="/marina-sdr"
      className="group block max-w-7xl mx-auto rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-400/60 shadow-lg shadow-black/40 hover:shadow-cyan-500/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      <img
        src="/assets/marina-sdr-banner.webp"
        srcSet="/assets/marina-sdr-banner-1080.webp 1080w, /assets/marina-sdr-banner.webp 2172w"
        sizes="(max-width: 1280px) 100vw, 1280px"
        width={2172}
        height={724}
        alt="Marina SDR, atendente comercial inteligente: atendimento automatico no WhatsApp, qualificacao de leads, agendamento de reunioes e mais vendas. Conheca a Marina."
        className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.01]"
        fetchPriority="high"
        decoding="async"
      />
    </a>
  </section>
);
