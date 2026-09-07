import React, { useState, useEffect } from 'react';
import { useRouter } from '../router/RouterContext';
import { Link } from '../router/Link';
import { productsData } from '../data/products';
import { articlesData } from '../data/articles';
import { labExperimentsData } from '../data/labProjects';
import { EcosystemDiagram } from '../components/EcosystemDiagram';
import { MicroHistory } from '../components/MicroHistory';
import { TechStackSection } from '../components/TechStackSection';
import {
  Sparkles,
  ArrowRight,
  Bot,
  Cpu,
  Workflow,
  Layers,
  Network,
  CheckCircle,
  Clock,
  Terminal,
  ArrowUpRight,
  FlaskConical,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate, openMarinaModal } = useRouter();

  // Simulated typing chat state for Marina preview section
  const [chatStep, setChatStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setChatStep((prev) => (prev < 4 ? prev + 1 : 0));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const solutionCards = [
    {
      title: 'AGENTES DE IA',
      desc: 'Agentes capazes de conversar, raciocinar e executar tarefas.',
      icon: Bot,
      color: 'from-cyan-500 to-blue-600',
      link: '/portfolio/marina-sdr',
      tag: 'Autonomia Cognitiva',
    },
    {
      title: 'SDR COM IA',
      desc: 'Prospecção, qualificação e atendimento comercial automatizados.',
      icon: Sparkles,
      color: 'from-blue-500 to-indigo-600',
      link: '/portfolio/marina-sdr',
      tag: 'Vendas 24/7',
    },
    {
      title: 'AUTOMAÇÃO',
      desc: 'Processos repetitivos transformados em fluxos automáticos.',
      icon: Workflow,
      color: 'from-indigo-500 to-violet-600',
      link: '/portfolio/nefi',
      tag: 'Zero Falhas',
    },
    {
      title: 'RPA',
      desc: 'Robôs para executar tarefas em sistemas e aplicações.',
      icon: Cpu,
      color: 'from-violet-500 to-purple-600',
      link: '/portfolio/nefi',
      tag: 'Sistemas Legados',
    },
    {
      title: 'SAAS',
      desc: 'Produtos digitais e plataformas desenvolvidas sob medida.',
      icon: Layers,
      color: 'from-cyan-600 to-teal-600',
      link: '/portfolio/antum-custom',
      tag: 'Software Proprietário',
    },
    {
      title: 'INTEGRAÇÕES',
      desc: 'Conectamos IA aos sistemas que sua empresa já utiliza.',
      icon: Network,
      color: 'from-teal-500 to-emerald-600',
      link: '/portfolio/harmony',
      tag: 'CRMs, ERPs & APIs',
    },
  ];

  return (
    <div id="home-page" className="min-h-screen pt-20">
      {/* 4. HOME — HERO */}
      <section
        id="hero-section"
        className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden"
      >
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d10_1px,transparent_1px),linear-gradient(to_bottom,#1f293d10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* HERO LEFT: TEXT & CTAS */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI & AUTOMATION STUDIO</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                A tecnologia mudou.{' '}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                  Seu negócio também pode mudar.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                Na ANTUM, criamos agentes de IA, automações e sistemas capazes de transformar tarefas que antes dependiam de pessoas em processos inteligentes que trabalham continuamente.
              </p>

              {/* CTAS */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  id="hero-btn-solutions"
                  to="/solucoes"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm tracking-wide text-center transition-all flex items-center justify-center gap-2"
                >
                  <span>Conhecer nossas soluções</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </Link>

                <button
                  id="hero-btn-marina"
                  onClick={() => openMarinaModal('Olá Marina! Gostaria de uma demonstração de como a IA pode transformar meu negócio.')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-sm tracking-wider uppercase shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-cyan-200 animate-spin-slow" />
                  <span>Falar com a Marina</span>
                </button>
              </div>

              {/* Trust statement */}
              <div className="pt-4 flex items-center gap-6 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Sem menus engessados
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Integração com seu CRM/ERP
                </span>
              </div>
            </div>

            {/* HERO RIGHT: ECOSYSTEM VISUAL COMPOSITION */}
            <div className="lg:col-span-6">
              <EcosystemDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* 5. MICRO-HISTÓRIA — "E SE..." */}
      <MicroHistory />

      {/* 6. O QUE A ANTUM CRIA */}
      <section id="o-que-criamos" className="py-24 bg-[#0b0f17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              Capacidades de Engenharia
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2 leading-tight">
              Não vendemos apenas tecnologia.{' '}
              <span className="block text-slate-400">Criamos sistemas que trabalham.</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-4">
              Cada solução é desenhada para substituir esforço mecânico humano por execução autônoma com alta fidelidade.
            </p>
          </div>

          {/* 6 CARDS COM MICROINTERAÇÕES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutionCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Link
                  key={idx}
                  to={card.link}
                  id={`card-solucao-${card.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group relative p-7 rounded-2xl bg-[#0e1422] border border-slate-800 hover:border-cyan-500/60 shadow-lg hover:shadow-cyan-950/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                        {card.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                    <span>Ver detalhes do sistema</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. MARINA — SDR DE IA SPOTLIGHT */}
      <section
        id="marina-spotlight"
        className="py-24 bg-gradient-to-b from-[#080d16] via-[#0d1525] to-[#080d16] border-y border-slate-800/90 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT TEXT */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-xs font-mono text-cyan-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AGENTE COMERCIAL AUTÔNOMO</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Você está falando com uma pessoa?{' '}
                <span className="block text-cyan-400">Talvez não.</span>
              </h2>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-200">
                  Marina — SDR de Inteligência Artificial
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  A Marina foi criada para conversar com potenciais clientes, entender necessidades, responder dúvidas, tratar objeções, apresentar soluções e conduzir oportunidades comerciais.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <button
                  id="spotlight-converse-com-marina"
                  onClick={() => openMarinaModal('Quero entender como você trabalha no WhatsApp e no site!')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-cyan-200" />
                  <span>Converse com a Marina</span>
                </button>

                <Link
                  to="/portfolio/marina-sdr"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Página completa da Marina</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* RIGHT: INTERACTIVE ANIMATED CONVERSATION SIMULATOR */}
            <div className="lg:col-span-6">
              <div className="bg-[#0b101c] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl shadow-cyan-950/60">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      M
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">Marina</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-cyan-950 text-cyan-400 border border-cyan-700/50 rounded font-mono">
                          SDR IA
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Online • Resposta imediata
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    Sessão em Tempo Real
                  </span>
                </div>

                {/* ANIMATED CONVERSATION THREAD */}
                <div className="space-y-3 font-sans text-xs sm:text-sm min-h-[220px]">
                  {/* Step 1: Lead asks */}
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-md">
                      <p className="font-semibold text-[11px] text-cyan-200 mb-0.5">CLIENTE</p>
                      <p>Quero automatizar meu atendimento.</p>
                    </div>
                  </div>

                  {/* Step 2: Marina answers */}
                  {chatStep >= 1 && (
                    <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="bg-slate-900 border border-slate-800 text-slate-200 p-3.5 rounded-2xl rounded-tl-sm max-w-[88%] shadow-md">
                        <p className="font-semibold text-[11px] text-cyan-400 mb-0.5">MARINA (SDR DE IA)</p>
                        <p>
                          Ótimo. Vou entender rapidamente como sua empresa trabalha e identificar onde a automação pode gerar mais resultado.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Marina qualifies */}
                  {chatStep >= 2 && (
                    <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="bg-slate-900 border border-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-sm max-w-[88%] shadow-md">
                        <p className="text-xs text-slate-300">
                          Qual o canal que recebe mais solicitações hoje: WhatsApp, formulário do site ou e-mail?
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Typing simulation */}
                  {chatStep === 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono py-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      <span>Marina está digitando...</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Quer testar uma pergunta real?
                  </span>
                  <button
                    onClick={() => openMarinaModal()}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Abrir terminal de chat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PORTFÓLIO VITRINE TEASER */}
      <section id="portfolio-teaser" className="py-24 bg-[#0b0f17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                Portfólio & Showroom
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                Tecnologia que saiu do papel.
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xl">
                Conheça alguns dos produtos, sistemas e experiências que desenvolvemos. Cada produto possui sua própria página individual com arquitetura completa.
              </p>
            </div>

            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-200 transition-colors"
            >
              <span>Ver todo o portfólio</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </Link>
          </div>

          {/* SHOWCASE OF PRODUCTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productsData.slice(0, 3).map((prod) => (
              <Link
                key={prod.id}
                to={`/portfolio/${prod.slug}`}
                id={`portfolio-card-${prod.slug}`}
                className="group rounded-2xl bg-[#0e1422] border border-slate-800 hover:border-cyan-500/60 overflow-hidden shadow-lg hover:shadow-cyan-950/30 transition-all flex flex-col"
              >
                <div className="h-44 overflow-hidden relative bg-slate-900">
                  <img
                    src={prod.heroImage}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                    {prod.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {prod.shortDescription}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-cyan-400">
                    <span>Ver projeto completo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SEÇÃO EDITORIAL — "IA NA PRÁTICA" */}
      <section id="ia-na-pratica-teaser" className="py-24 bg-[#070a10] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                Conteúdo & Visão Prática
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                IA na prática
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xl">
                Sem teorias vazias ou termos complicados. Conteúdo objetivo sobre como implementar automação que gera resultado de verdade.
              </p>
            </div>

            <Link
              to="/conteudo"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300"
            >
              <span>Ver todas as matérias</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articlesData.slice(0, 3).map((art) => (
              <Link
                key={art.id}
                to={`/conteudo/${art.slug}`}
                id={`article-card-${art.id}`}
                className="group p-6 rounded-2xl bg-[#0b0f19] border border-slate-800/90 hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-slate-500">
                    <span className="text-cyan-400 uppercase">{art.category}</span>
                    <span>{art.readTime}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mb-3">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                  <span>Ler artigo</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 13. "POR TRÁS DA TECNOLOGIA" */}
      <TechStackSection />

      {/* 15. ANTUM LAB TEASER */}
      <section id="lab-highlight" className="py-20 bg-[#0a0f1c] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/40 text-xs font-mono">
                <FlaskConical className="w-3.5 h-3.5 text-indigo-400" />
                <span>ANTUM LAB • R&D</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Pesquisamos e construímos o que vem depois.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                No ANTUM LAB, prototipamos sistemas multi-agente, visão computacional adaptativa para softwares legados e síntese de voz em tempo real. Veja nossas provas de conceito ativas.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <Link
                to="/lab"
                className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <span>Conhecer o ANTUM LAB</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section id="final-home-cta" className="py-24 bg-[#080d16] text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            Canal Direto de Vendas & Engenharia
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Quer colocar essa tecnologia para trabalhar?
          </h2>

          <p className="text-base text-slate-400 max-w-xl mx-auto">
            Conte-nos qual processo está travando sua operação ou converse diretamente com nossa SDR de IA para um diagnóstico em tempo real.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openMarinaModal('Olá Marina! Gostaria de uma proposta para meu projeto.')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-sm uppercase tracking-wider shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Falar com a Marina</span>
            </button>

            <Link
              to="/contato"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm tracking-wider text-center transition-all"
            >
              Enviar Briefing Técnico
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
