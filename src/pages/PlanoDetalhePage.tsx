import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from '../router/Link';
import { useRouter } from '../router/RouterContext';
import { conteudoPlanos } from '../data/planosConteudo';

interface Produto {
  slug: string; nome: string; descricao: string | null; recursos: string[];
  valor: number; taxaImplantacao: number; trialDias: number; requerAprovacao: boolean; condicoes: string | null;
}
const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const PlanoDetalhePage: React.FC = () => {
  const { currentPath } = useRouter();
  const slug = useMemo(() => currentPath.replace(/^\/planos\//, '').replace(/\/$/, ''), [currentPath]);
  const [lista, setLista] = useState<Produto[] | null>(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let vivo = true;
    fetch('/api/catalogo')
      .then(async (r) => {
        const j = await r.json();
        if (!vivo) return;
        if (!r.ok) return setErro('Não foi possível carregar este plano agora.');
        setLista(j.produtos || []);
      })
      .catch(() => vivo && setErro('Não foi possível carregar este plano agora.'));
    return () => { vivo = false; };
  }, []);

  const p = lista?.find((x) => x.slug === slug);
  const c = conteudoPlanos[slug];

  useEffect(() => { if (p) document.title = `${p.nome} | ANTUM`; }, [p]);

  if (erro) return <section className="min-h-screen pt-32 px-4 text-center text-sm text-rose-300">{erro}</section>;
  if (!lista) {
    return (
      <section className="min-h-screen pt-32 px-4 text-sm text-slate-500 flex items-start justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin mt-0.5" /> Carregando…
      </section>
    );
  }
  if (!p) {
    return (
      <section className="min-h-screen pt-32 px-4 text-center">
        <p className="text-slate-300">Não encontramos este plano.</p>
        <Link to="/planos" className="text-cyan-400 underline text-sm">Ver todos os planos</Link>
      </section>
    );
  }

  const contratar = `/cadastro?plano=${encodeURIComponent(p.slug)}`;
  const outros = lista.filter((x) => x.slug !== p.slug);

  return (
    <section className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/planos" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Planos / Produtos
        </Link>

        <div className="rounded-3xl border border-slate-700 bg-gradient-to-b from-cyan-950/30 to-[#0e1422] p-8 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{p.nome}</h1>
          <p className="mt-3 text-slate-300">{p.descricao || c?.resumo}</p>
          <p className="mt-5">
            <span className="text-4xl font-extrabold text-cyan-300">{brl(p.valor)}</span>
            <span className="text-sm text-slate-400">/mês</span>
          </p>
          <div className="mt-2 space-y-1 text-xs text-slate-400">
            {p.trialDias > 0 && <p>{p.trialDias} dias de teste antes da primeira cobrança.</p>}
            {p.taxaImplantacao > 0 && <p>Implantação: {brl(p.taxaImplantacao)} (cobrança única).</p>}
            {p.requerAprovacao && <p>Contratação sujeita a aprovação da Antum.</p>}
          </div>
          <a href={contratar} className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm uppercase tracking-wider">
            {p.requerAprovacao ? 'Solicitar este plano' : 'Contratar este plano'} <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {c && (
          <section className="mt-12">
            <h2 className="text-xl font-extrabold text-white">Para quem é</h2>
            <p className="mt-2 text-slate-300 leading-relaxed">{c.paraQuem}</p>
          </section>
        )}

        {c && (
          <section className="mt-12">
            <h2 className="text-xl font-extrabold text-white mb-4">Como ele ajuda o seu negócio</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {c.comoAjuda.map((x) => (
                <div key={x.titulo} className="rounded-2xl border border-slate-800 bg-[#0e1422] p-5">
                  <h3 className="font-bold text-white text-sm">{x.titulo}</h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">{x.texto}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-extrabold text-white mb-3">O que está incluso</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              {p.recursos.map((r) => (
                <li key={r} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />{r}</li>
              ))}
            </ul>
          </div>
          {c && (
            <div>
              <h2 className="text-xl font-extrabold text-white mb-3">Onde se aplica</h2>
              <ul className="space-y-2 text-sm text-slate-300">
                {c.aplicacoes.map((a) => (
                  <li key={a} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />{a}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {c && (
          <section className="mt-12">
            <h2 className="text-xl font-extrabold text-white mb-4">Como funciona a contratação</h2>
            <ol className="space-y-3">
              {c.passos.map((s, i) => (
                <li key={s} className="flex gap-3 text-sm text-slate-300">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-slate-500">
              {p.condicoes || 'Hospedagem fornecida pela Antum. Domínio, quando necessário, é contratado e pago pelo cliente.'}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Quer ver o passo a passo completo? <Link to="/como-funciona" className="text-cyan-400 underline">Como funciona</Link>
            </p>
          </section>
        )}

        <div className="mt-12 text-center">
          <a href={contratar} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm uppercase tracking-wider">
            {p.requerAprovacao ? 'Solicitar este plano' : 'Contratar este plano'} <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {outros.length > 0 && (
          <section className="mt-16">
            <h2 className="text-lg font-extrabold text-white mb-4">Outros planos</h2>
            <div className="flex flex-wrap gap-2">
              {outros.map((o) => (
                <Link key={o.slug} to={`/planos/${o.slug}`} className="px-4 py-2 rounded-full border border-slate-700 hover:border-cyan-400 text-sm text-slate-300 hover:text-white">
                  {o.nome}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
};
