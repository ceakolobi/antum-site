import React, { useState, useEffect } from 'react';
import { useRouter } from '../router/RouterContext';
import { Link } from '../router/Link';
import { Menu, X, Cpu, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPath } = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

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
    setOpenMenu(null);
  }, [currentPath]);

  const navLinks: { label: string; path: string; children?: { label: string; desc: string; path: string }[] }[] = [
    { label: 'INÍCIO', path: '/' },
    { label: 'SOLUÇÕES', path: '/solucoes' },
    {
      label: 'PLANOS / PRODUTOS',
      path: '/planos',
      children: [
        { label: 'Planos e preços', desc: 'Escolha, veja o valor e contrate', path: '/planos' },
        { label: 'Como funciona', desc: 'Do briefing ao site no ar', path: '/como-funciona' },
      ] as { label: string; desc: string; path: string }[],
    },
    {
      label: 'PORTFÓLIO',
      path: '/portfolio',
      children: [
        { label: 'Produtos Antum', desc: 'Marina, RPA, CRM e mais', path: '/portfolio' },
        { label: 'Sites & Landing Pages', desc: 'Sites que já entregamos', path: '/portfolio/sites-ia' },
        { label: 'Clientes', desc: 'Quem trabalha com a ANTUM', path: '/clientes' },
      ] as { label: string; desc: string; path: string }[],
    },
    { label: 'SOBRE', path: '/sobre' },
    { label: 'CONTATO', path: '/contato' },
    { label: 'ÁREA DO CLIENTE', path: '/area-do-cliente' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path === '/portfolio' && currentPath === '/clientes') return true;
    if (path === '/planos' && currentPath === '/como-funciona') return true;
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
          className="group relative focus:outline-none"
        >
          <img
            src="/assets/antum-logo-branca.png?v=3"
            alt="ANTUM"
            className="h-9 w-auto opacity-95 group-hover:opacity-100 transition-opacity drop-shadow-sm"
          />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0b0f17] animate-pulse" />
        </Link>

        {/* DESKTOP EXACT 5 LINKS */}
        <nav
          id="desktop-navigation"
          aria-label="Menu Principal"
          className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80"
        >
          {navLinks.map((link) => {
            const active = isActive(link.path);
            const cls = `relative px-4 py-1.5 text-xs font-semibold tracking-wider transition-all duration-200 rounded-full whitespace-nowrap inline-flex items-center gap-1 ${
              active
                ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`;
            if (link.children) {
              return (
                <div
                  key={link.path}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(link.path)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <Link to={link.path} id={`nav-link-${link.label.toLowerCase()}`} className={cls}>
                    {link.label}
                    <ChevronDown className={`w-3 h-3 transition-transform ${openMenu === link.path ? 'rotate-180' : ''}`} />
                  </Link>
                  {openMenu === link.path && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50">
                      <div className="w-64 rounded-2xl bg-[#0e1422] border border-slate-800 shadow-xl shadow-black/50 p-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`block px-3 py-2.5 rounded-xl hover:bg-slate-800/70 transition-colors ${
                              currentPath === child.path ? 'bg-cyan-950/50' : ''
                            }`}
                          >
                            <span className="block text-sm font-semibold text-white tracking-normal">{child.label}</span>
                            <span className="block text-[11px] text-slate-500 tracking-normal mt-0.5">{child.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link key={link.path} id={`nav-link-${link.label.toLowerCase()}`} to={link.path} className={cls}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Acesso discreto ao painel admin */}
        <div className="hidden md:flex items-center">
          <a
            id="navbar-painel-admin"
            href="/admin"
            className="text-[11px] tracking-wide text-slate-500 hover:text-slate-300 transition-colors"
          >
            Painel admin
          </a>
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex items-center gap-2 md:hidden">

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
                <React.Fragment key={link.path}>
                <Link
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
              {link.children &&
                link.children.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    className={`ml-4 pl-4 py-2 border-l border-slate-800 text-sm ${
                      currentPath === child.path ? 'text-cyan-300' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {child.label}
                  </Link>
                ))}
                </React.Fragment>
              );
            })}
          </div>

          <div className="pt-2 text-center">
            <a id="mobile-menu-painel-admin" href="/admin" className="text-[11px] tracking-wide text-slate-500 hover:text-slate-300">
              Painel admin
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
