import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from '../router/Link';
import { conteudoPlanos } from '../data/planosConteudo';

interface Produto {
  slug: string;
  nome: string;
  descricao: string | null;
  recursos: string[];
  valor: number;
  taxaImplantacao: number;
  trialDias: number;
  requerAprovacao: boolean;
}

const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Preços vêm do catálogo (banco), editável no painel admin. Nada de valor fixo aqui.
export const PlanosPage: React.FC = () => {
  const [lista, setLista] = useState<Produto[] | null>(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let vivo = true;
    fetch('/api/catalogo')
      .then(async (r) => {
        const j = await r.json();
        if (!vivo) return;
        if (!r.ok) return setErro('Não foi possível carregar os planos agora. Tente novamente em instantes.');
        setLista(j.produtos || []);
      })
      .catch(() => vivo && setErro('Não foi possível carregar os planos agora. Tente novamente em instantes.'));
    return () => { vivo = false; };
  }, []);

  return (
    <section className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Planos / Produtos</h1>
          <p className="text-sm text-slate-400 mt-3">Veja o que está incluso, o valor e contrate em poucos minutos.</p>
        </div>

        {erro ? (
          <p className="text-center text-sm text-rose-300">{erro}</p>
        ) : !lista ? (
          <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Carregando…
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lista.map((p) => (
              <div key={p.slug} className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6 flex flex-col">
                <h2 className="text-lg font-bold text-white">{p.nome}</h2>
                <p className="mt-1 text-2xl font-extrabold text-cyan-300">
                  {brl(p.valor)}<span className="text-sm font-medium text-slate-400">/mês</span>
                </p>
                <p className="text-sm text-slate-400 mt-3">{conteudoPlanos[p.slug]?.resumo || p.descricao}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-slate-300 flex-1">
                  {p.recursos.map((r) => (
                    <li key={r} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />{r}</li>
                  ))}
                </ul>
                <div className="mt-4 space-y-1 text-xs text-slate-400">
                  {p.trialDias > 0 && <p>{p.trialDias} dias de teste antes da primeira cobrança.</p>}
                  {p.taxaImplantacao > 0 && <p>Implantação: {brl(p.taxaImplantacao)} (cobrança única).</p>}
                  {p.requerAprovacao && <p>Contratação sujeita a aprovação da Antum.</p>}
                </div>
                <Link
                  to={`/planos/${p.slug}`}
                  className="mt-5 w-full text-center px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm"
                >
                  Conheça o plano
                </Link>
                <a
                  href={`/cadastro?plano=${encodeURIComponent(p.slug)}`}
                  className="mt-2 w-full text-center px-5 py-2.5 rounded-xl border border-slate-700 hover:border-cyan-400 text-slate-200 text-sm font-semibold"
                >
                  {p.requerAprovacao ? 'Solicitar' : 'Contratar direto'}
                </a>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-slate-500 mt-8">
          Hospedagem fornecida pela Antum. Domínio, quando necessário, é contratado e pago pelo cliente.
        </p>
        <p className="text-center text-sm text-slate-400 mt-4">
          Quer entender como funciona antes de contratar?{' '}
          <Link to="/como-funciona" className="text-cyan-400 underline">Veja o passo a passo</Link>
        </p>
      </div>
    </section>
  );
};
