import React, { useState } from 'react';
import { useRouter } from '../router/RouterContext';
import { Link } from '../router/Link';
import { productsData } from '../data/products';
import { Product } from '../types';
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Play,
  Share2,
  Layers,
  ArrowLeft,
  Calendar,
  Check,
  Zap,
  Activity,
  Shield,
  Workflow,
  Terminal,
  Cpu,
  RefreshCw,
  Send,
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { openMarinaModal } = useRouter();
  const product = productsData.find((p) => p.slug === slug) || productsData[0];

  // Interactive Demo Simulator State
  const [demoInput, setDemoInput] = useState('');
  const [demoLogs, setDemoLogs] = useState<string[]>([
    'Sistema inicializado e pronto.',
    `Conexões verificadas: ${product.integrations.slice(0, 3).join(', ')}.`,
  ]);
  const [isProcessingDemo, setIsProcessingDemo] = useState(false);

  const handleRunDemo = () => {
    if (isProcessingDemo) return;
    setIsProcessingDemo(true);
    setDemoLogs((prev) => [...prev, `> Disparando evento de teste para: ${product.name}...`]);

    setTimeout(() => {
      setDemoLogs((prev) => [
        ...prev,
        '  [Passo 1] Validação de contexto e parsing semântico concluídos.',
      ]);
    }, 600);

    setTimeout(() => {
      setDemoLogs((prev) => [
        ...prev,
        '  [Passo 2] Executando regra de negócio e chamando APIs seguras.',
      ]);
    }, 1200);

    setTimeout(() => {
      setDemoLogs((prev) => [
        ...prev,
        `  [Sucesso] Operação concluída em 0.84s com status 200 OK. Registro auditado no sistema.`,
      ]);
      setIsProcessingDemo(false);
    }, 1800);
  };

  return (
    <div id={`product-page-${product.slug}`} className="min-h-screen pt-24 pb-20 bg-[#0b0f17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BACK BREADCRUMB */}
        <div className="mb-8">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Portfólio</span>
          </Link>
        </div>

        {/* 1. HERO */}
        <section id="product-hero" className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* HERO TEXT */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  {product.categoryLabel}
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
                  {product.badge}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {product.name}
              </h1>

              <p className="text-lg font-semibold text-cyan-400/90 font-mono">
                {product.commercialHeadline}
              </p>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                {product.description}
              </p>

              {/* CTAS */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {product.liveUrl ? (
                  <a
                    id="btn-product-live"
                    href={product.liveUrl}
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 hover:text-white font-bold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Acessar Produto ao Vivo</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    id="btn-product-conhecer"
                    onClick={() => openMarinaModal(`Olá Marina! Gostaria de conhecer mais sobre o ${product.name}.`)}
                    className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Quero conhecer (Demonstração)</span>
                  </button>
                )}

                <button
                  id="btn-product-marina"
                  onClick={() => openMarinaModal(`Olá Marina! Gostaria de entender mais sobre o produto ${product.name}.`)}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Falar com a Marina</span>
                </button>
              </div>
            </div>

            {/* HERO MOCKUP / VISUAL */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 shadow-2xl shadow-cyan-950/60 bg-slate-950">
                <img
                  src={product.heroImage}
                  alt={product.name}
                  className="w-full h-80 sm:h-96 object-cover opacity-85"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-black/30" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Status: Em Produção
                    </span>
                    <span className="text-slate-400">Tempo de resposta: &lt; 1.2s</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 2. PROBLEMA VS SOLUÇÃO */}
        <section id="problema-solucao" className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* PROBLEMA (ANTES) */}
            <div className="p-8 rounded-3xl bg-[#140e14]/90 border border-rose-950/80 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-rose-400">
                <XCircle className="w-5 h-5" />
                <h3 className="text-lg font-bold uppercase tracking-wide">
                  {product.problemBefore.title}
                </h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                {product.problemBefore.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-rose-950/80 text-xs font-mono text-rose-300">
                <strong>Consequência:</strong> {product.problemBefore.consequence}
              </div>
            </div>

            {/* SOLUÇÃO (AGORA) */}
            <div className="p-8 rounded-3xl bg-[#09151f]/90 border border-cyan-950/80 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-lg font-bold uppercase tracking-wide">
                  {product.solutionNow.title}
                </h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                {product.solutionNow.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-cyan-950/80 text-xs font-mono text-cyan-300">
                <strong>Resultado:</strong> {product.solutionNow.outcome}
              </div>
            </div>

          </div>
        </section>

        {/* 3. COMO FUNCIONA (FLUXO VISUAL) */}
        <section id="como-funciona" className="mb-20 p-8 sm:p-12 rounded-3xl bg-[#0e1424] border border-slate-800">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              Arquitetura de Execução
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Como funciona na prática
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Cada etapa é rastreável, com validação de dados e contingência automática.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.workflowSteps.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/90 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono font-bold flex items-center justify-center text-sm">
                      0{step.step}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      Etapa {step.step}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {step.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-cyan-400/90">
                  {step.detail}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. RECURSOS (FUNCIONALIDADES REAIS) */}
        <section id="recursos" className="mb-20">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              Capacidades Reais
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Recursos construídos sob medida
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.features.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0e1422] border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {feat.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. BENEFÍCIOS REAIS */}
        <section id="beneficios" className="mb-20">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              Impacto de Negócio
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Benefícios mensuráveis
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.benefits.map((ben, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#0e1424] border border-slate-800 text-center space-y-3"
              >
                {ben.metric && (
                  <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-mono">
                    {ben.metric}
                  </div>
                )}
                <h3 className="text-base font-bold text-white">
                  {ben.label}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {ben.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. PARA QUEM É */}
        <section id="para-quem-e" className="mb-20 p-8 sm:p-12 rounded-3xl bg-[#0a0f1c] border border-slate-800">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              Aderência Operacional
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Para quem este sistema foi construído
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.targetAudience.map((target, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2"
              >
                <span className="text-xs font-mono text-cyan-400 uppercase font-bold">
                  {target.profile}
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {target.useCase}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. INTEGRAÇÕES REAIS */}
        <section id="integracoes-reais" className="mb-20 text-center">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-2">
            Compatibilidade
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
            Integrações suportadas de fábrica
          </h2>
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {product.integrations.map((tool, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-semibold"
              >
                {tool}
              </span>
            ))}
          </div>
        </section>

        {/* 9. FINAL PRODUCT CTA */}
        <section id="cta-produto" className="p-12 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-indigo-950/40 border border-cyan-500/40 text-center space-y-6">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            Próximo Passo
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Quer colocar essa tecnologia para trabalhar?
          </h2>

          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Fale agora com a Marina. Ela responde dúvidas técnicas, analisa seu volume e coloca você em contato direto com a equipe de engenharia da ANTUM.
          </p>

          <div className="pt-2">
            <button
              onClick={() => openMarinaModal(`Olá Marina! Quero implantar o ${product.name} na minha empresa.`)}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Falar com a Marina</span>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
