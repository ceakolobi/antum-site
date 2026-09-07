import React from 'react';
import { useRouter } from '../router/RouterContext';
import { Link } from '../router/Link';
import { articlesData } from '../data/articles';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Share2,
  Bookmark,
  Check,
} from 'lucide-react';

interface ArticleDetailPageProps {
  slug: string;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ slug }) => {
  const { openMarinaModal } = useRouter();
  const article = articlesData.find((a) => a.slug === slug) || articlesData[0];
  const otherArticles = articlesData.filter((a) => a.id !== article.id).slice(0, 2);

  return (
    <div id={`article-page-${article.id}`} className="min-h-screen pt-24 pb-20 bg-[#0b0f17]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMB */}
        <div className="mb-8">
          <Link
            to="/conteudo"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para IA na Prática</span>
          </Link>
        </div>

        {/* HEADER */}
        <header className="mb-10 space-y-4">
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase">
              {article.category}
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {article.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed pt-2">
            {article.excerpt}
          </p>
        </header>

        {/* KEY TAKEAWAYS CALLOUT */}
        <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-[#0e1628] border border-cyan-500/40 shadow-xl space-y-4">
          <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Principais Pontos Destaque
          </span>
          <ul className="space-y-2.5">
            {article.keyTakeaways.map((takeaway, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ARTICLE BODY PARAGRAPHS */}
        <article className="prose prose-invert max-w-none space-y-6 text-sm sm:text-base text-slate-300 leading-relaxed">
          {article.contentParagraphs.map((para, idx) => (
            <p key={idx} className="leading-relaxed">
              {para}
            </p>
          ))}

          {/* CHECKLIST IF AVAILABLE */}
          {article.checklist && article.checklist.length > 0 && (
            <div className="my-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Checklist Prático de Implementação
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {article.checklist.map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-[10px] shrink-0">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CONCLUSION */}
          <div className="pt-6 border-t border-slate-800">
            <h4 className="text-base font-bold text-white mb-2">Conclusão</h4>
            <p className="text-sm sm:text-base text-slate-300">
              {article.conclusion}
            </p>
          </div>
        </article>

        {/* DIRECT MARINA ACTION BLOCK */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-cyan-950/50 to-blue-950/40 border border-cyan-500/40 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Quer discutir a aplicação prática deste artigo no seu negócio?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            A Marina está pronta para analisar seu fluxo de vendas, suporte ou processos internos em segundos.
          </p>
          <button
            onClick={() => openMarinaModal(`Olá Marina! Acabei de ler o artigo "${article.title}" e gostaria de entender como aplicar isso na minha empresa.`)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Falar com a Marina sobre este tema</span>
          </button>
        </div>

        {/* RELATED ARTICLES */}
        {otherArticles.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-800">
            <h3 className="text-lg font-bold text-white mb-6">
              Outras matérias recomendadas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherArticles.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/conteudo/${rel.slug}`}
                  className="p-6 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-cyan-500/50 transition-all block space-y-2 group"
                >
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">
                    {rel.category} • {rel.readTime}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {rel.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
