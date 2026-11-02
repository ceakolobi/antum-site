import React, { useCallback, useEffect, useState } from 'react';
import { Link } from '../router/Link';
import { useRouter } from '../router/RouterContext';
import { Wallet, UserRound, LogOut, Loader2, FileText, ExternalLink, ShieldCheck } from 'lucide-react';

async function api<T = any>(path: string, body?: unknown): Promise<{ ok: boolean; status: number; data: T }> {
  try {
    const r = await fetch(path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
    });
    let data: any = {};
    try { data = await r.json(); } catch { /* resposta sem JSON */ }
    return { ok: r.ok, status: r.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: 'rede' } as any };
  }
}

const MSG: Record<string, string> = {
  credenciais_invalidas: 'E-mail ou senha incorretos.',
  conta_bloqueada_temporariamente: 'Muitas tentativas. Tente de novo em alguns minutos.',
  muitas_tentativas: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
  senha_fraca: 'Use pelo menos 10 caracteres, com letras e números.',
  link_invalido: 'Este link expirou ou já foi usado. Peça um novo em "Esqueci minha senha".',
  senha_atual_incorreta: 'A senha atual está incorreta.',
  rede: 'Sem conexão. Tente novamente.',
};
const erroTxt = (d: any) => MSG[d?.error] || 'Não foi possível concluir agora. Tente novamente.';

const brl = (n: number | string) => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dataBr = (iso?: string | null) => (iso ? String(iso).slice(0, 10).split('-').reverse().join('/') : '—');

const campo = 'w-full rounded-xl bg-slate-900/70 border border-slate-700 focus:border-cyan-400 focus:outline-none px-4 py-3 text-sm text-white placeholder-slate-500';
const rotulo = 'block text-xs font-semibold text-slate-300 mb-1.5';
const botao = 'w-full px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-bold text-sm';

const SITUACAO: Record<string, { t: string; c: string }> = {
  PENDING: { t: 'A vencer', c: 'text-amber-300 bg-amber-500/10' },
  OVERDUE: { t: 'Vencida', c: 'text-red-300 bg-red-500/10' },
  RECEIVED: { t: 'Paga', c: 'text-emerald-300 bg-emerald-500/10' },
  CONFIRMED: { t: 'Paga', c: 'text-emerald-300 bg-emerald-500/10' },
  RECEIVED_IN_CASH: { t: 'Paga', c: 'text-emerald-300 bg-emerald-500/10' },
  REFUNDED: { t: 'Estornada', c: 'text-slate-300 bg-slate-500/10' },
};
const ASSINATURA: Record<string, string> = { ATIVA: 'Ativa', CRIANDO: 'Em ativação', AGUARDANDO_APROVACAO: 'Aguardando aprovação', ERRO: 'Em análise' };

const Cartao: React.FC<{ children: React.ReactNode; titulo?: string }> = ({ children, titulo }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
    {titulo && <h2 className="text-lg font-bold text-white mb-4">{titulo}</h2>}
    {children}
  </div>
);

// ---------- definir / redefinir senha (link recebido por e-mail) ----------------
const DefinirSenha: React.FC = () => {
  const token = new URLSearchParams(window.location.search).get('token') || '';
  const [s1, setS1] = useState('');
  const [s2, setS2] = useState('');
  const [erro, setErro] = useState('');
  const [feito, setFeito] = useState(false);
  const [env, setEnv] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    if (s1 !== s2) return setErro('As senhas não são iguais.');
    setEnv(true);
    const r = await api('/api/cliente/definir-senha', { token, senha: s1 });
    setEnv(false);
    if (r.ok) { setFeito(true); window.history.replaceState({}, '', '/area-do-cliente/senha'); } else setErro(erroTxt(r.data));
  };

  if (feito) {
    return (
      <Cartao titulo="Senha definida">
        <p className="text-sm text-slate-300">Pronto! Agora você já pode entrar na sua área do cliente.</p>
        <a href="/area-do-cliente" className={`${botao} inline-block text-center mt-5`}>Entrar</a>
      </Cartao>
    );
  }
  return (
    <Cartao titulo="Definir senha">
      <form onSubmit={enviar} className="space-y-4">
        <div><label className={rotulo}>Nova senha</label><input className={campo} type="password" autoComplete="new-password" value={s1} onChange={(e) => setS1(e.target.value)} required /></div>
        <div><label className={rotulo}>Repita a nova senha</label><input className={campo} type="password" autoComplete="new-password" value={s2} onChange={(e) => setS2(e.target.value)} required /></div>
        <p className="text-xs text-slate-500">Mínimo de 10 caracteres, com letras e números.</p>
        {erro && <p className="text-sm text-red-300">{erro}</p>}
        <button className={botao} disabled={env || !token}>{env ? 'Salvando…' : 'Salvar senha'}</button>
        {!token && <p className="text-xs text-red-300">Link incompleto. Use o link do e-mail.</p>}
      </form>
    </Cartao>
  );
};

// ---------- login ---------------------------------------------------------------
const Login: React.FC<{ aoEntrar: () => void }> = ({ aoEntrar }) => {
  const [modo, setModo] = useState<'entrar' | 'esqueci'>('entrar');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [env, setEnv] = useState(false);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault(); setErro(''); setEnv(true);
    const r = await api('/api/cliente/login', { email, senha });
    setEnv(false);
    if (r.ok) aoEntrar(); else setErro(erroTxt(r.data));
  };
  const esqueci = async (e: React.FormEvent) => {
    e.preventDefault(); setErro(''); setAviso(''); setEnv(true);
    const r = await api('/api/cliente/esqueci', { email });
    setEnv(false);
    if (r.ok) setAviso('Se este e-mail tem cadastro na Antum, enviamos um link para definir a senha. Confira também o spam.');
    else setErro(erroTxt(r.data));
  };

  return (
    <Cartao titulo={modo === 'entrar' ? 'Entrar' : 'Primeiro acesso ou senha esquecida'}>
      {modo === 'entrar' ? (
        <form onSubmit={entrar} className="space-y-4">
          <div><label className={rotulo}>E-mail</label><input className={campo} type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div><label className={rotulo}>Senha</label><input className={campo} type="password" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} required /></div>
          {erro && <p className="text-sm text-red-300">{erro}</p>}
          <button className={botao} disabled={env}>{env ? 'Entrando…' : 'Entrar'}</button>
          <button type="button" className="text-sm text-cyan-400 underline" onClick={() => { setModo('esqueci'); setErro(''); }}>Primeiro acesso ou esqueci minha senha</button>
        </form>
      ) : (
        <form onSubmit={esqueci} className="space-y-4">
          <p className="text-sm text-slate-400">Informe o e-mail do seu cadastro. Enviaremos um link para você definir uma senha.</p>
          <div><label className={rotulo}>E-mail</label><input className={campo} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          {erro && <p className="text-sm text-red-300">{erro}</p>}
          {aviso && <p className="text-sm text-emerald-300">{aviso}</p>}
          <button className={botao} disabled={env}>{env ? 'Enviando…' : 'Enviar link'}</button>
          <button type="button" className="text-sm text-cyan-400 underline" onClick={() => { setModo('entrar'); setAviso(''); }}>Voltar para o login</button>
        </form>
      )}
    </Cartao>
  );
};

// ---------- painel --------------------------------------------------------------
interface Painel {
  cliente: { nome: string; email: string; cpf_cnpj: string; celular: string; endereco: string; numero: string; complemento: string | null; bairro: string; cidade: string; uf: string; cep: string };
  assinaturas: { id: string; plano_nome: string; valor: string; status: string; vencimento_dia: number; tem_contrato: boolean }[];
  cobrancas: { valor: string; vencimento: string; status: string; invoice_url: string | null; boleto_url: string | null; pago_em: string | null }[];
}

const mascaraDoc = (d: string) => (d.length === 11 ? `${d.slice(0, 3)}.***.***-${d.slice(9)}` : `${d.slice(0, 2)}.***.***/****-${d.slice(12)}`);

const TrocarSenha: React.FC = () => {
  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const salvar = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(null);
    const r = await api('/api/cliente/trocar-senha', { atual, nova });
    if (r.ok) { setMsg({ ok: true, t: 'Senha alterada.' }); setAtual(''); setNova(''); } else setMsg({ ok: false, t: erroTxt(r.data) });
  };
  return (
    <form onSubmit={salvar} className="space-y-3 max-w-sm">
      <div><label className={rotulo}>Senha atual</label><input className={campo} type="password" autoComplete="current-password" value={atual} onChange={(e) => setAtual(e.target.value)} required /></div>
      <div><label className={rotulo}>Nova senha</label><input className={campo} type="password" autoComplete="new-password" value={nova} onChange={(e) => setNova(e.target.value)} required /></div>
      {msg && <p className={`text-sm ${msg.ok ? 'text-emerald-300' : 'text-red-300'}`}>{msg.t}</p>}
      <button className={botao}>Alterar senha</button>
    </form>
  );
};

const PainelCliente: React.FC<{ aoSair: () => void }> = ({ aoSair }) => {
  const [p, setP] = useState<Painel | null>(null);
  const [aba, setAba] = useState<'fin' | 'conta'>('fin');
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    const r = await api<Painel>('/api/cliente/painel');
    if (r.status === 401) return aoSair();
    if (r.ok) setP(r.data); else setErro('Não foi possível carregar seus dados agora.');
  }, [aoSair]);
  useEffect(() => { carregar(); }, [carregar]);

  const sair = async () => { await api('/api/cliente/logout', {}); aoSair(); };

  if (erro) return <p className="text-center text-sm text-red-300">{erro}</p>;
  if (!p) return <p className="text-sm text-slate-500 flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Carregando…</p>;

  const abertas = p.cobrancas.filter((c) => c.status === 'PENDING' || c.status === 'OVERDUE');
  const tab = (id: 'fin' | 'conta', texto: string, Icone: React.ElementType) => (
    <button onClick={() => setAba(id)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${aba === id ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}>
      <Icone className="w-4 h-4" /> {texto}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">Área do cliente</p>
          <h1 className="text-xl font-extrabold text-white">Olá, {p.cliente.nome.split(' ')[0]}</h1>
        </div>
        <button onClick={sair} className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"><LogOut className="w-4 h-4" /> Sair</button>
      </div>

      <div className="flex gap-2">{tab('fin', 'Financeiro', Wallet)}{tab('conta', 'Minha conta', UserRound)}</div>

      {aba === 'fin' && (
        <Cartao titulo="Cobranças">
          {abertas.length > 0 && (
            <p className="text-sm text-amber-300 mb-4">Você tem {abertas.length} cobrança{abertas.length > 1 ? 's' : ''} em aberto.</p>
          )}
          {p.cobrancas.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhuma cobrança por enquanto. Quando houver, ela aparece aqui.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-slate-500"><th className="py-2 pr-4">Vencimento</th><th className="py-2 pr-4">Valor</th><th className="py-2 pr-4">Situação</th><th className="py-2"></th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {p.cobrancas.map((c, i) => {
                    const s = SITUACAO[c.status] || { t: c.status, c: 'text-slate-300 bg-slate-500/10' };
                    const aberta = c.status === 'PENDING' || c.status === 'OVERDUE';
                    const link = c.invoice_url || c.boleto_url;
                    return (
                      <tr key={i}>
                        <td className="py-3 pr-4 text-white">{dataBr(c.vencimento)}</td>
                        <td className="py-3 pr-4 text-white">{brl(c.valor)}</td>
                        <td className="py-3 pr-4"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.c}`}>{s.t}</span></td>
                        <td className="py-3 text-right">
                          {aberta && link && <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold">Pagar / 2ª via <ExternalLink className="w-3.5 h-3.5" /></a>}
                          {!aberta && c.pago_em && <span className="text-xs text-slate-500">Pago em {dataBr(c.pago_em)}</span>}
                          {!aberta && link && <a href={link} target="_blank" rel="noopener noreferrer" className="ml-3 text-xs text-cyan-400 underline">Ver fatura</a>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-xs text-slate-500 mt-4">Pagamento por PIX ou boleto, pelo link da cobrança. Dúvidas? <Link to="/contato" className="text-cyan-400 underline">Fale com a Antum</Link>.</p>
        </Cartao>
      )}

      {aba === 'conta' && (
        <div className="space-y-6">
          <Cartao titulo="Meus contratos">
            {p.assinaturas.length === 0 ? <p className="text-sm text-slate-400">Nenhuma contratação ativa.</p> : (
              <ul className="space-y-3">
                {p.assinaturas.map((a) => (
                  <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="font-semibold text-white">{a.plano_nome}</p>
                      <p className="text-xs text-slate-400">{brl(a.valor)}/mês · vence todo dia {a.vencimento_dia} · {ASSINATURA[a.status] || a.status}</p>
                    </div>
                    {a.tem_contrato && <a href={`/api/cliente/contrato/${a.id}/pdf`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-cyan-400 underline"><FileText className="w-4 h-4" /> Contrato (PDF)</a>}
                  </li>
                ))}
              </ul>
            )}
          </Cartao>
          <Cartao titulo="Meus dados">
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                ['Nome', p.cliente.nome], ['CPF/CNPJ', mascaraDoc(p.cliente.cpf_cnpj)], ['E-mail', p.cliente.email], ['Celular', p.cliente.celular],
                ['Endereço', `${p.cliente.endereco}, ${p.cliente.numero}${p.cliente.complemento ? ' - ' + p.cliente.complemento : ''}, ${p.cliente.bairro}, ${p.cliente.cidade}/${p.cliente.uf} — CEP ${p.cliente.cep}`],
              ].map(([k, v]) => (<div key={k} className={k === 'Endereço' ? 'sm:col-span-2' : ''}><dt className="text-xs text-slate-500">{k}</dt><dd className="text-white">{v}</dd></div>))}
            </dl>
            <p className="text-xs text-slate-500 mt-4">Para corrigir algum dado, fale com a Antum.</p>
          </Cartao>
          <Cartao titulo="Alterar senha"><TrocarSenha /></Cartao>
        </div>
      )}
    </div>
  );
};

// ---------- página --------------------------------------------------------------
export const AreaClientePage: React.FC = () => {
  const { currentPath } = useRouter();
  const [logado, setLogado] = useState<boolean | undefined>(undefined);
  const modoSenha = currentPath.startsWith('/area-do-cliente/senha');

  useEffect(() => {
    document.title = 'Área do cliente | ANTUM';
    let m = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!m) { m = document.createElement('meta'); m.name = 'robots'; document.head.appendChild(m); }
    m.content = 'noindex,nofollow';
    if (!modoSenha) api('/api/cliente/painel').then((r) => setLogado(r.status === 401 || !r.ok ? false : true));
  }, [modoSenha]);

  return (
    <section className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {modoSenha ? (
          <div className="max-w-md mx-auto"><DefinirSenha /></div>
        ) : logado === undefined ? (
          <p className="text-sm text-slate-500 flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Carregando…</p>
        ) : logado ? (
          <PainelCliente aoSair={() => setLogado(false)} />
        ) : (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Área do cliente</h1>
              <p className="text-sm text-slate-400 mt-3">Suas cobranças, 2ª via de boleto e contrato num só lugar.</p>
            </div>
            <Login aoEntrar={() => setLogado(true)} />
            <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Acesso protegido. Nunca pedimos senha por e-mail ou WhatsApp.</p>
            <p className="text-center text-sm text-slate-400">Quer contratar? Veja os <Link to="/planos" className="text-cyan-400 underline">Planos / Produtos</Link>.</p>
          </div>
        )}
      </div>
    </section>
  );
};
