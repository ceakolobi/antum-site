import React from 'react';
import { Link } from '../router/Link';
import { UserPlus, Wallet, ArrowRight, MessageCircle } from 'lucide-react';

export const AreaClientePage: React.FC = () => (
  <section className="min-h-screen pt-32 pb-20 px-4">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Área do cliente</h1>
        <p className="text-sm text-slate-400 mt-3">Cadastro, cobranças e atendimento da sua conta ANTUM.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Link
          to="/cadastro"
          className="group rounded-2xl border border-slate-700 hover:border-cyan-400 bg-slate-900/60 p-6 space-y-3 transition-colors"
        >
          <UserPlus className="w-7 h-7 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Contratar a Marina SDR</h2>
          <p className="text-sm text-slate-400">
            Faça seu cadastro, escolha o vencimento e receba o link da primeira cobrança na hora.
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
            Fazer cadastro <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3 opacity-90">
          <Wallet className="w-7 h-7 text-slate-500" />
          <h2 className="text-lg font-bold text-white">Minha conta / Financeiro</h2>
          <p className="text-sm text-slate-400">
            Em breve: suas cobranças, PIX, boleto e histórico de pagamentos num só lugar.
          </p>
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-slate-500">Em breve</span>
        </div>
      </div>

      <p className="text-center text-sm text-slate-400 mt-10">
        Recebeu um link exclusivo de cadastro da Antum? Abra o link que enviamos para você.
      </p>
      <div className="text-center mt-4">
        <Link to="/contato" className="inline-flex items-center gap-2 text-sm text-cyan-400 underline">
          <MessageCircle className="w-4 h-4" /> Falar com a Antum
        </Link>
      </div>
    </div>
  </section>
);
