import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from '../router/RouterContext';
import { Link } from '../router/Link';
import { CheckCircle2, ShieldCheck, Loader2, AlertTriangle, ExternalLink } from 'lucide-react';

interface PlanoInfo {
  plano: string;
  valor: number;
  diasPermitidos: number[];
  porConvite: boolean;
  nomeRef: string | null;
  emailRef: string | null;
  multaFixa: number;
}

interface Resultado {
  pagamentoUrl: string | null;
  vencimento: string | null;
  plano: string;
  valor: number;
}

const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dig = (s: string) => s.replace(/\D/g, '');

const maskDoc = (v: string, tipo: 'PF' | 'PJ') => {
  const d = dig(v).slice(0, tipo === 'PF' ? 11 : 14);
  if (tipo === 'PF')
    return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};
const maskFone = (v: string) => {
  const d = dig(v).slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
};
const maskCep = (v: string) => dig(v).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');

const MENSAGENS: Record<string, string> = {
  convite_invalido: 'Este link de cadastro não é válido. Peça um novo link à Antum.',
  convite_ja_utilizado: 'Este link já foi utilizado. Se precisar de ajuda, fale com a Antum.',
  convite_expirado: 'Este link expirou. Peça um novo link à Antum.',
  convite_de_outro_cliente: 'Este link já está vinculado a outro CPF/CNPJ.',
  plano_indisponivel: 'Este plano não está disponível no momento.',
  financeiro_nao_configurado: 'O cadastro está temporariamente indisponível. Tente novamente em breve.',
  muitas_requisicoes: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  nao_concluido: 'Não foi possível concluir agora. Tente novamente em instantes — nada foi cobrado em duplicidade.',
};

const campo =
  'w-full rounded-xl bg-slate-900/70 border border-slate-700 focus:border-cyan-400 focus:outline-none px-4 py-3 text-sm text-white placeholder-slate-500';
const rotulo = 'block text-xs font-semibold text-slate-300 mb-1.5';

export const CadastroPage: React.FC = () => {
  const { currentPath } = useRouter();
  const token = useMemo(() => {
    const m = currentPath.match(/^\/cadastro\/([A-Za-z0-9_-]+)\/?$/);
    return m ? m[1] : '';
  }, [currentPath]);

  const [plano, setPlano] = useState<PlanoInfo | null>(null);
  const [erroPlano, setErroPlano] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [buscandoCep, setBuscandoCep] = useState(false);

  const [f, setF] = useState({
    tipo: 'PF' as 'PF' | 'PJ',
    nome: '', cpfCnpj: '', email: '', celular: '', telefone: '',
    cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '',
    vencimentoDia: '', formaPagamento: 'PIX' as 'PIX' | 'BOLETO',
    aceite: false, website: '',
  });
  const set = (k: keyof typeof f, v: string | boolean) => setF((s) => ({ ...s, [k]: v as never }));

  useEffect(() => {
    document.title = 'Cadastro | ANTUM';
    let vivo = true;
    (async () => {
      try {
        const r = await fetch(`/api/cadastro/plano${token ? `?token=${encodeURIComponent(token)}` : ''}`);
        const j = await r.json();
        if (!vivo) return;
        if (!r.ok) return setErroPlano(MENSAGENS[j.error] || 'Não foi possível carregar o cadastro.');
        setPlano(j);
        setF((s) => ({
          ...s,
          nome: j.nomeRef || s.nome,
          email: j.emailRef || s.email,
          vencimentoDia: j.diasPermitidos.length === 1 ? String(j.diasPermitidos[0]) : s.vencimentoDia,
        }));
      } catch {
        if (vivo) setErroPlano('Não foi possível carregar o cadastro.');
      }
    })();
    return () => { vivo = false; };
  }, [token]);

  const buscarCep = async (cep: string) => {
    if (dig(cep).length !== 8) return;
    setBuscandoCep(true);
    try {
      const r = await fetch(`https://viacep.com.br/ws/${dig(cep)}/json/`);
      const j = await r.json();
      if (!j.erro) {
        setF((s) => ({
          ...s, endereco: j.logradouro || s.endereco, bairro: j.bairro || s.bairro,
          cidade: j.localidade || s.cidade, uf: j.uf || s.uf,
        }));
      }
    } catch { /* preenchimento manual */ }
    setBuscandoCep(false);
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    setEnviando(true); setErroEnvio(''); setErros({});
    try {
      const r = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...f, token: token || undefined,
          vencimentoDia: f.vencimentoDia ? Number(f.vencimentoDia) : undefined,
        }),
      });
      const j = await r.json();
      if (r.ok && j.ok && j.etapas?.assinatura) {
        setResultado(j);
      } else if (j.campos) {
        setErros(j.campos);
        setErroEnvio('Confira os campos destacados.');
      } else {
        setErroEnvio(j.mensagem || MENSAGENS[j.error] || 'Não foi possível concluir o cadastro.');
      }
    } catch {
      setErroEnvio('Falha de conexão. Tente novamente.');
    }
    setEnviando(false);
  };

  const Erro = ({ k }: { k: string }) =>
    erros[k] ? <p className="text-xs text-rose-400 mt-1">{erros[k]}</p> : null;

  if (erroPlano) {
    return (
      <section className="min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h1 className="text-xl font-bold text-white">Cadastro indisponível</h1>
          <p className="text-sm text-slate-400">{erroPlano}</p>
          <Link to="/contato" className="text-cyan-400 text-sm underline">Falar com a Antum</Link>
        </div>
      </section>
    );
  }

  if (resultado) {
    return (
      <section className="min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-lg mx-auto text-center space-y-5">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h1 className="text-2xl font-extrabold text-white">Cadastro concluído</h1>
          <p className="text-sm text-slate-300">
            Sua assinatura do plano <strong>{resultado.plano}</strong> ({brl(resultado.valor)}/mês) foi criada.
            {resultado.vencimento && <> Primeiro vencimento: <strong>{resultado.vencimento.split('-').reverse().join('/')}</strong>.</>}
          </p>
          {resultado.pagamentoUrl ? (
            <a
              href={resultado.pagamentoUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm"
            >
              Ver cobrança e pagar <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <p className="text-sm text-slate-400">
              A primeira cobrança ainda está sendo gerada. Você receberá o link assim que ela estiver disponível.
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Cadastro financeiro ANTUM</h1>
          {plano ? (
            <p className="text-sm text-slate-400 mt-3">
              Plano <strong className="text-cyan-300">{plano.plano}</strong> —{' '}
              <strong className="text-white">{brl(plano.valor)}/mês</strong>
            </p>
          ) : (
            <p className="text-sm text-slate-500 mt-3 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Carregando…
            </p>
          )}
        </div>

        {plano && (
          <form onSubmit={enviar} noValidate className="space-y-8">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
              value={f.website} onChange={(e) => set('website', e.target.value)}
              style={{ position: 'absolute', left: '-9999px', height: 0, width: 0, opacity: 0 }} />

            <fieldset className="space-y-4">
              <legend className="text-sm font-bold text-white mb-2">Seus dados</legend>
              <div className="grid grid-cols-2 gap-3">
                {(['PF', 'PJ'] as const).map((t) => (
                  <button type="button" key={t} onClick={() => { set('tipo', t); set('cpfCnpj', ''); }}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold ${f.tipo === t ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300' : 'border-slate-700 text-slate-400'}`}>
                    {t === 'PF' ? 'Pessoa física' : 'Pessoa jurídica'}
                  </button>
                ))}
              </div>
              <div>
                <label className={rotulo} htmlFor="nome">{f.tipo === 'PF' ? 'Nome completo' : 'Razão social'}</label>
                <input id="nome" className={campo} value={f.nome} maxLength={150} autoComplete="name" onChange={(e) => set('nome', e.target.value)} />
                <Erro k="nome" />
              </div>
              <div>
                <label className={rotulo} htmlFor="doc">{f.tipo === 'PF' ? 'CPF' : 'CNPJ'}</label>
                <input id="doc" className={campo} inputMode="numeric" value={f.cpfCnpj}
                  onChange={(e) => set('cpfCnpj', maskDoc(e.target.value, f.tipo))} />
                <Erro k="cpfCnpj" />
              </div>
              <div>
                <label className={rotulo} htmlFor="email">E-mail</label>
                <input id="email" type="email" className={campo} value={f.email} maxLength={150} autoComplete="email" onChange={(e) => set('email', e.target.value)} />
                <Erro k="email" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={rotulo} htmlFor="cel">Celular (WhatsApp)</label>
                  <input id="cel" className={campo} inputMode="tel" value={f.celular} autoComplete="tel" onChange={(e) => set('celular', maskFone(e.target.value))} />
                  <Erro k="celular" />
                </div>
                <div>
                  <label className={rotulo} htmlFor="tel">Telefone fixo (opcional)</label>
                  <input id="tel" className={campo} inputMode="tel" value={f.telefone} onChange={(e) => set('telefone', maskFone(e.target.value))} />
                  <Erro k="telefone" />
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-sm font-bold text-white mb-2">Endereço</legend>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3 sm:col-span-1">
                  <label className={rotulo} htmlFor="cep">CEP</label>
                  <input id="cep" className={campo} inputMode="numeric" value={f.cep} autoComplete="postal-code"
                    onChange={(e) => { const v = maskCep(e.target.value); set('cep', v); if (dig(v).length === 8) buscarCep(v); }} />
                  {buscandoCep && <p className="text-xs text-slate-500 mt-1">Buscando…</p>}
                  <Erro k="cep" />
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <label className={rotulo} htmlFor="end">Endereço</label>
                  <input id="end" className={campo} value={f.endereco} maxLength={150} autoComplete="address-line1" onChange={(e) => set('endereco', e.target.value)} />
                  <Erro k="endereco" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={rotulo} htmlFor="num">Número</label>
                  <input id="num" className={campo} value={f.numero} maxLength={20} onChange={(e) => set('numero', e.target.value)} />
                  <Erro k="numero" />
                </div>
                <div>
                  <label className={rotulo} htmlFor="comp">Complemento</label>
                  <input id="comp" className={campo} value={f.complemento} maxLength={80} onChange={(e) => set('complemento', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3 sm:col-span-1">
                  <label className={rotulo} htmlFor="bairro">Bairro</label>
                  <input id="bairro" className={campo} value={f.bairro} maxLength={100} onChange={(e) => set('bairro', e.target.value)} />
                  <Erro k="bairro" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className={rotulo} htmlFor="cidade">Cidade</label>
                  <input id="cidade" className={campo} value={f.cidade} maxLength={100} onChange={(e) => set('cidade', e.target.value)} />
                  <Erro k="cidade" />
                </div>
                <div className="col-span-1">
                  <label className={rotulo} htmlFor="uf">UF</label>
                  <input id="uf" className={campo} value={f.uf} maxLength={2} onChange={(e) => set('uf', e.target.value.toUpperCase())} />
                  <Erro k="uf" />
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-sm font-bold text-white mb-2">Pagamento</legend>
              {plano.diasPermitidos.length > 1 ? (
                <div>
                  <label className={rotulo}>Dia de vencimento</label>
                  <div className="flex gap-3">
                    {plano.diasPermitidos.map((d) => (
                      <button type="button" key={d} onClick={() => set('vencimentoDia', String(d))}
                        className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold ${f.vencimentoDia === String(d) ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300' : 'border-slate-700 text-slate-400'}`}>
                        Dia {d}
                      </button>
                    ))}
                  </div>
                  <Erro k="vencimentoDia" />
                </div>
              ) : (
                <p className="text-sm text-slate-300">Vencimento mensal: <strong>dia {plano.diasPermitidos[0]}</strong></p>
              )}
              <div>
                <label className={rotulo}>Forma de pagamento preferencial</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['PIX', 'BOLETO'] as const).map((m) => (
                    <button type="button" key={m} onClick={() => set('formaPagamento', m)}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold ${f.formaPagamento === m ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300' : 'border-slate-700 text-slate-400'}`}>
                      {m === 'PIX' ? 'PIX' : 'Boleto bancário'}
                    </button>
                  ))}
                </div>
                <Erro k="formaPagamento" />
              </div>
              <p className="text-xs text-slate-500">
                Pagamento em atraso: multa fixa de {brl(plano.multaFixa)} por fatura. Nunca pedimos senhas ou dados de cartão neste formulário.
              </p>
            </fieldset>

            <div className="space-y-2">
              <label className="flex items-start gap-3 text-sm text-slate-300">
                <input type="checkbox" className="mt-1 accent-cyan-400" checked={f.aceite} onChange={(e) => set('aceite', e.target.checked)} />
                <span>
                  Li e aceito os <Link to="/termos" className="text-cyan-400 underline">Termos de Uso</Link> e a{' '}
                  <Link to="/privacidade" className="text-cyan-400 underline">Política de Privacidade</Link>, e autorizo o
                  tratamento dos meus dados para cadastro e cobrança. Meu aceite fica registrado com data, hora e IP.
                </span>
              </label>
              <Erro k="aceite" />
            </div>

            {erroEnvio && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{erroEnvio}</div>
            )}

            <button type="submit" disabled={enviando}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-bold text-sm">
              {enviando ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando…</> : <><ShieldCheck className="w-4 h-4" /> Concluir cadastro</>}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
