import React, { useEffect } from 'react';
import { RouterProvider, useRouter } from './router/RouterContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingMarinaCTA } from './components/FloatingMarinaCTA';
import { MarinaModal } from './components/MarinaModal';
import { HomePage } from './pages/HomePage';
import { SolutionsPage } from './pages/SolutionsPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LabPage } from './pages/LabPage';
import { Link } from './router/Link';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';

const RouteDispatcher: React.FC = () => {
  const { currentPath } = useRouter();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPath]);

  // Dynamic document title update for multi-page SEO
  useEffect(() => {
    if (currentPath === '/') {
      document.title = 'ANTUM — AI & Automation Studio | Sistemas que trabalham';
    } else if (currentPath === '/solucoes') {
      document.title = 'Soluções de IA & Automação | ANTUM Studio';
    } else if (currentPath === '/portfolio') {
      document.title = 'Portfólio & Showroom de Produtos | ANTUM';
    } else if (currentPath.startsWith('/portfolio/')) {
      const slug = currentPath.replace('/portfolio/', '');
      const formatted = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      document.title = `${formatted} | Portfólio ANTUM`;
    } else if (currentPath === '/conteudo') {
      document.title = 'IA na Prática — Artigos & Visão Operacional | ANTUM';
    } else if (currentPath.startsWith('/conteudo/')) {
      document.title = 'Artigo — IA na Prática | ANTUM';
    } else if (currentPath === '/sobre') {
      document.title = 'Sobre a ANTUM — Nossa História & Crença';
    } else if (currentPath === '/contato') {
      document.title = 'Contato Comercial & Briefing Técnico | ANTUM';
    } else if (currentPath === '/lab') {
      document.title = 'ANTUM LAB — R&D, Protótipos & Experimentos de IA';
    }
  }, [currentPath]);

  // 1. Home
  if (currentPath === '/' || currentPath === '') {
    return <HomePage />;
  }

  // 2. Solutions
  if (currentPath === '/solucoes') {
    return <SolutionsPage />;
  }

  // 3. Portfolio
  if (currentPath === '/portfolio') {
    return <PortfolioPage />;
  }

  // 3.1 Product Detail Dynamic Route: /portfolio/:slug
  if (currentPath.startsWith('/portfolio/')) {
    const slug = currentPath.replace('/portfolio/', '');
    return <ProductDetailPage slug={slug} />;
  }

  // 4. Content / Articles
  if (currentPath === '/conteudo') {
    return <ArticlesPage />;
  }

  // 4.1 Article Detail Dynamic Route: /conteudo/:slug
  if (currentPath.startsWith('/conteudo/')) {
    const slug = currentPath.replace('/conteudo/', '');
    return <ArticleDetailPage slug={slug} />;
  }

  // 5. About
  if (currentPath === '/sobre') {
    return <AboutPage />;
  }

  // 6. Contact
  if (currentPath === '/contato') {
    return <ContactPage />;
  }

  // 7. Lab
  if (currentPath === '/lab') {
    return <LabPage />;
  }

  // 404 Fallback Page
  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#0b0f17] flex items-center justify-center text-center px-4">
      <div className="max-w-md mx-auto space-y-6">
        <span className="text-4xl font-mono font-bold text-cyan-400">404</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Página não encontrada
        </h1>
        <p className="text-sm text-slate-400">
          A rota que você tentou acessar não existe ou foi reorganizada na nova arquitetura da ANTUM.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Voltar para a Página Inicial</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <div className="min-h-screen bg-[#0b0f17] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar />
        <main>
          <RouteDispatcher />
        </main>
        <Footer />
        <FloatingMarinaCTA />
        <MarinaModal />
      </div>
    </RouterProvider>
  );
}
