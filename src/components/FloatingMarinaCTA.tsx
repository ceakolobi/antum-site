import React, { useState, useEffect } from 'react';
import { useRouter } from '../router/RouterContext';
import { Sparkles, MessageSquare, X } from 'lucide-react';

export const FloatingMarinaCTA: React.FC = () => {
  const { openMarinaModal, isMarinaModalOpen } = useRouter();
  const [minimized, setMinimized] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(true);

  // Periodic subtle pulse reminder
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnimation((prev) => !prev);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  if (isMarinaModalOpen) return null;

  return (
    <aside
      id="floating-marina-container"
      aria-label="Atendimento com Marina SDR"
      className="fixed bottom-6 right-6 z-30 flex items-end gap-2 pointer-events-auto"
    >
      {/* TOOLTIP CALLOUT */}
      {!minimized && (
        <div
          id="marina-floating-callout"
          className="hidden sm:flex items-center gap-2 bg-slate-900/95 border border-cyan-500/40 text-slate-200 text-xs px-3.5 py-2 rounded-xl shadow-xl shadow-black/60 backdrop-blur-md animate-in fade-in slide-in-from-right-2 duration-300"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <p className="font-medium">
            Dúvidas sobre automação? <strong className="text-cyan-300 cursor-pointer" onClick={() => openMarinaModal()}>Fale com a Marina</strong>
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMinimized(true);
            }}
            aria-label="Fechar dica flutuante"
            className="text-slate-500 hover:text-slate-300 ml-1 p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* MAIN FLOATING BUTTON */}
      <button
        id="floating-marina-button"
        onClick={() => openMarinaModal('Olá Marina! Gostaria de uma análise rápida para meu negócio.')}
        className="group relative flex items-center gap-2.5 px-4 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-cyan-400/30"
      >
        <div className="relative">
          <Sparkles className="w-4 h-4 text-cyan-200 animate-spin-slow" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
        </div>
        <span className="hidden sm:inline">Falar com a Marina</span>
        <span className="sm:hidden">Marina SDR</span>

        {/* Subtle glow border */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-30 blur-sm transition-opacity -z-10" />
      </button>
    </aside>
  );
};
