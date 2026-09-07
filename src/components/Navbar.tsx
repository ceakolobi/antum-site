import React, { useState, useEffect } from 'react';
import { useRouter } from '../router/RouterContext';
import { Link } from '../router/Link';
import { Menu, X, Sparkles, ArrowUpRight, Cpu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPath, openMarinaModal } = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  const navLinks = [
    { label: 'INÍCIO', path: '/' },
    { label: 'SOLUÇÕES', path: '/solucoes' },
    { label: 'PORTFÓLIO', path: '/portfolio' },
    { label: 'SOBRE', path: '/sobre' },
    { label: 'CONTATO', path: '/contato' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/40 py-3'
          : 'bg-[#0b0f17]/60 backdrop-blur-sm border-b border-slate-800/40 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          id="navbar-logo"
          className="group flex items-center gap-3 focus:outline-none"
        >
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <span className="font-extrabold text-white text-lg tracking-tighter">A</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0b0f17] animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              ANTUM
            </span>
            <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">
              AI • AUTOMATION • SOFTWARE
            </span>
          </div>
        </Link>

        {/* DESKTOP EXACT 5 LINKS */}
        <nav
          id="desktop-navigation"
          aria-label="Menu Principal"
          className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80"
        >
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                id={`nav-link-${link.label.toLowerCase()}`}
                to={link.path}
                className={`relative px-4 py-1.5 text-xs font-semibold tracking-wider transition-all duration-200 rounded-full whitespace-nowrap ${
                  active
                    ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA: FALAR COM A MARINA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            id="navbar-cta-marina"
            onClick={() => openMarinaModal('Olá Marina! Gostaria de entender como a ANTUM pode automatizar minha empresa.')}
            className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-spin-slow group-hover:rotate-12 transition-transform" />
            <span>FALAR COM A MARINA</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            id="mobile-cta-marina-compact"
            onClick={() => openMarinaModal('Olá Marina!')}
            className="px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Marina</span>
          </button>

          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir Menu"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="md:hidden bg-[#0b0f17]/98 border-b border-slate-800 px-5 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200"
        >
          <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase px-2">
            Navegação
          </div>
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  id={`mobile-nav-${link.label.toLowerCase()}`}
                  to={link.path}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold tracking-wider flex items-center justify-between ${
                    active
                      ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              id="mobile-menu-marina-cta"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openMarinaModal('Olá Marina! Gostaria de entender o que a ANTUM pode automatizar para nós.');
              }}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>FALAR COM A MARINA (SDR DE IA)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
