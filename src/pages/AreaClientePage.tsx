import React from 'react';
import { Link } from '../router/Link';
import { Wallet, MessageCircle } from 'lucide-react';

export const AreaClientePage: React.FC = () => (
  <section className="min-h-screen pt-32 pb-20 px-4">
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Área do cliente</h1>
        <p className="text-sm text-slate-400 mt-3">Suas cobranças e o atendimento da sua conta ANTUM.</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
        <Wallet className="w-7 h-7 text-slate-500" />
        <h2 className="text-lg font-bold text-white">Minha conta / Financeiro</h2>
        <p className="text-sm text-slate-400">
          Em breve: suas cobranças, PIX, boleto e histórico de pagamentos num só lugar.
        </p>
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-slate-500">Em breve</span>
      </div>

      <p className="text-center text-sm text-slate-400 mt-10">
        Quer contratar um serviço? Veja os <Link to="/planos" className="text-cyan-400 underline">Planos / Produtos</Link>.
      </p>
      <div className="text-center mt-4">
        <Link to="/contato" className="inline-flex items-center gap-2 text-sm text-cyan-400 underline">
          <MessageCircle className="w-4 h-4" /> Falar com a Antum
        </Link>
      </div>
    </div>
  </section>
);
