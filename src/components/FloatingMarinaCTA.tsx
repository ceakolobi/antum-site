import React, { useState, useEffect } from 'react';
import { useRouter } from '../router/RouterContext';
import { Sparkles } from 'lucide-react';

// Botão flutuante discreto: só o ícone, sem balão de texto, e some quando o rodapé aparece
// (para nunca cobrir o texto do rodapé).
export const FloatingMarinaCTA: React.FC = () => {
  const { openMarinaModal, isMarinaModalOpen } = useRouter();
  const [rodapeVisivel, setRodapeVisivel] = useState(false);

  useEffect(() => {
    const alvo = document.getElementById('main-footer');
    if (!alvo || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(([e]) => setRodapeVisivel(e.isIntersecting), { threshold: 0 });
    obs.observe(alvo);
    return () => obs.disconnect();
  });

  if (isMarinaModalOpen || rodapeVisivel) return null;

  return (
    <aside id="floating-marina-container" aria-label="Atendimento com Marina SDR" className="fixed bottom-5 right-5 z-30">
      <button
        id="floating-marina-button"
        onClick={() => openMarinaModal('Olá Marina! Gostaria de uma análise rápida para meu negócio.')}
        aria-label="Falar com a Marina"
        title="Falar com a Marina"
        className="relative w-11 h-11 rounded-full flex items-center justify-center bg-slate-900/90 border border-cyan-500/40 text-cyan-300 shadow-lg shadow-black/50 backdrop-blur-md hover:bg-slate-800 hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        <Sparkles className="w-5 h-5" />
        <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
      </button>
    </aside>
  );
};
