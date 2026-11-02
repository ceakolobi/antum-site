import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SenhaInput } from '../components/SenhaInput';
import { Loader2, LogOut, Copy, Check, AlertTriangle, RefreshCw } from 'lucide-react';

// ---------- tipos -------------------------------------------------------------
interface Resumo {
  clientes: number; ativas: number; aguardando: number; mrr: string; recebido_mes: string; vencidas: number; valor_vencido: string;
  recebido_total: string; a_receber: string; bloqueadas: number;
}
interface Cliente { id: string; nome: string; tipo: string; email: string; celular: string; cpf_cnpj: string; cidade: string; uf: string; status_cadastro: string; ultimo_erro: string | null; created_at: string; bloqueadas: number }
interface Assinatura { id: string; plano_slug: string | null; plano_nome: string; valor: string; taxa_implantacao: string; trial_dias: number; vencimento_dia: number; forma_pagamento: string; status: string; bloqueada: boolean; ultimo_erro: string | null; created_at: string; cliente: string; cliente_email: string }
interface Cobranca { id: string; valor: string; vencimento: string; status: string; forma_pagamento: string | null; invoice_url: string | null; pago_em: string | null; cliente: string | null }
interface Auditoria { quando: string; admin_email: string | null; acao: string; detalhe: any; ip: string | null }
interface Painel { resumo: Resumo; clientes: Cliente[]; assinaturas: Assinatura[]; cobrancas: Cobranca[]; auditoria: Auditoria[]; asaasBase: 'sandbox' | 'producao' }
interface Produto {
  slug: string; nome: string; valor: string; taxa_implantacao: string; trial_dias: number; dias_vencimento: number[];
  descricao: string | null; recursos: string[]; condicoes: string | null; requer_aprovacao: boolean; ativo: boolean; ordem: number; contratacoes: number;
}

// ---------- utilidades --------------------------------------------------------
const brl = (n: number | string) => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dataBR = (iso: string | null) => (iso ? String(iso).slice(0, 10).split('-').reverse().join('/') : '—');
const dataHora = (iso: string) => new Date(iso).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

const STATUS_COBRANCA: Record<string, string> = {
  PENDING: 'Aguardando', RECEIVED: 'Paga', CONFIRMED: 'Paga', RECEIVED_IN_CASH: 'Paga', OVERDUE: 'Vencida',
  REFUNDED: 'Estornada', CANCELED: 'Cancelada',
};
const STATUS_ASS: Record<string, string> = {
  AGUARDANDO_APROVACAO: 'Aguardando aprovação', CRIANDO: 'Criando', ATIVA: 'Ativa', ERRO: 'Erro', CANCELADA: 'Cancelada',
};
const corStatus = (s: string) =>
  /Paga|Ativa/.test(s) ? 'text-emerald-300 bg-emerald-500/10' : /Vencida|Erro/.test(s) ? 'text-red-300 bg-red-500/10' : /Aguardando|Criando/.test(s) ? 'text-amber-300 bg-amber-500/10' : 'text-slate-300 bg-slate-500/10';

const campo = 'w-full rounded-lg bg-slate-900/70 border border-slate-700 focus:border-cyan-400 focus:outline-none px-3 py-2 text-sm text-white placeholder-slate-500';
const rot = 'block text-xs font-semibold text-slate-300 mb-1';
const btn = 'px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm';
const btnSec = 'px-3 py-1.5 rounded-lg border border-slate-600 hover:border-cyan-400 text-slate-200 text-xs font-semibold';

async function api<T = any>(path: string, opts: { method?: string; body?: unknown } = {}): Promise<{ ok: boolean; status: number; data: T }> {
  const r = await fetch(path, {
    method: opts.method || 'GET',
    headers: opts.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    credentials: 'same-origin',
  });
  let data: any = {};
  try { data = await r.json(); } catch { /* sem corpo */ }
  return { ok: r.ok, status: r.status, data };
}

const ERROS: Record<string, string> = {
  credenciais_invalidas: 'E-mail ou senha incorretos.',
  conta_bloqueada_temporariamente: 'Muitas tentativas. Aguarde 15 minutos.',
  muitas_tentativas: 'Muitas tentativas. Aguarde alguns minutos.',
  origem_invalida: 'Acesso bloqueado por segurança. Recarregue a página.',
  nao_esta_aguardando_aprovacao: 'Esta contratação já foi tratada.',
  falha_ao_criar_no_asaas: 'O Asaas recusou a criação. Veja o erro na contratação.',
  slug_ja_existe: 'Já existe um produto com esse código.',
};

// ---------- login -------------------------------------------------------------
const Login: React.FC<{ onOk: (email: string) => void }> = ({ onOk }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [env, setEnv] = useState(false);
  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (env) return;
    setEnv(true); setErro('');
    const r = await api('/api/admin/login', { method: 'POST', body: { email, senha } });
    setEnv(false);
    if (r.ok) { setSenha(''); onOk(r.data.email); } else setErro(ERROS[r.data?.error] || 'Não foi possível entrar.');
  };
  return (
    <section className="min-h-screen pt-32 pb-20 px-4">
      <form onSubmit={entrar} className="max-w-sm mx-auto space-y-5 rounded-2xl border border-slate-700 bg-slate-900/60 p-7">
        <h1 className="text-xl font-extrabold text-white text-center">Painel Antum</h1>
        <div><label className={rot}>E-mail</label><input className={campo} type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div><label className={rot}>Senha</label><SenhaInput className={campo} autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} required /></div>
        {erro && <p className="text-sm text-red-300">{erro}</p>}
        <button className={`${btn} w-full`} disabled={env}>{env ? 'Entrando…' : 'Entrar'}</button>
      </form>
    </section>
  );
};

// ---------- peças -------------------------------------------------------------
const Selo: React.FC<{ texto: string }> = ({ texto }) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${corStatus(texto)}`}>{texto}</span>;

const Tabela: React.FC<{ cols: string[]; vazio: string; children: React.ReactNode; vazioQuando: boolean }> = ({ cols, vazio, children, vazioQuando }) => (
  <div className="overflow-x-auto rounded-xl border border-slate-800">
    <table className="w-full text-sm text-left">
      <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400">
        <tr>{cols.map((c) => <th key={c} className="px-3 py-2.5 whitespace-nowrap">{c}</th>)}</tr>
      </thead>
      <tbody className="divide-y divide-slate-800 text-slate-200">{children}</tbody>
    </table>
    {vazioQuando && <p className="p-5 text-center text-sm text-slate-500">{vazio}</p>}
  </div>
);

const Cartao: React.FC<{ titulo: string; valor: string; sub?: string; alerta?: boolean }> = ({ titulo, valor, sub, alerta }) => (
  <div className={`rounded-xl border p-4 ${alerta ? 'border-red-500/40 bg-red-500/5' : 'border-slate-800 bg-slate-900/50'}`}>
    <p className="text-xs text-slate-400">{titulo}</p>
    <p className="text-xl font-extrabold text-white mt-1">{valor}</p>
    {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
  </div>
);

// ---------- catálogo ----------------------------------------------------------
const CatalogoAba: React.FC = () => {
  const [lista, setLista] = useState<Produto[] | null>(null);
  const [edit, setEdit] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const carregar = useCallback(async () => {
    const r = await api('/api/admin/catalogo');
    if (r.ok) setLista(r.data.produtos);
  }, []);
  useEffect(() => { carregar(); }, [carregar]);

  const salvar = async (p: Produto, novo: boolean, f: any) => {
    const corpo = {
      slug: novo ? f.slug : undefined, nome: f.nome, valor: f.valor, taxaImplantacao: f.taxa, trialDias: f.trial,
      diasPermitidos: String(f.dias).split(',').map((x: string) => x.trim()).filter(Boolean),
      descricao: f.descricao, condicoes: f.condicoes, recursos: String(f.recursos).split('\n').map((x: string) => x.trim()).filter(Boolean),
      requerAprovacao: f.aprov, ativo: f.ativo, ordem: f.ordem,
    };
    const r = novo ? await api('/api/admin/catalogo', { method: 'POST', body: corpo }) : await api(`/api/admin/catalogo/${p.slug}`, { method: 'PUT', body: corpo });
    if (r.ok) { setMsg('Salvo.'); setEdit(null); carregar(); }
    else setMsg(r.data?.campos ? Object.values(r.data.campos).join(' ') : ERROS[r.data?.error] || 'Não foi possível salvar.');
  };

  const vazio: Produto = { slug: '', nome: '', valor: '0', taxa_implantacao: '0', trial_dias: 0, dias_vencimento: [5, 8, 21], descricao: '', recursos: [], condicoes: '', requer_aprovacao: false, ativo: true, ordem: 100, contratacoes: 0 };

  if (!lista) return <p className="text-sm text-slate-500 flex gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Carregando…</p>;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">Mudar preço vale só para <strong>novas</strong> contratações. Contratos antigos mantêm o preço do dia.</p>
        <button className={btn} onClick={() => setEdit('__novo')}>Novo produto</button>
      </div>
      {msg && <p className="text-sm text-cyan-300">{msg}</p>}
      {edit === '__novo' && <FormProduto p={vazio} novo onSalvar={(f) => salvar(vazio, true, f)} onCancelar={() => setEdit(null)} />}
      {lista.map((p) => (
        <div key={p.slug} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold text-white">{p.nome} <span className="text-xs font-normal text-slate-500">({p.slug})</span></p>
              <p className="text-sm text-slate-400">
                {brl(p.valor)}/mês{Number(p.taxa_implantacao) > 0 && <> · implantação {brl(p.taxa_implantacao)}</>}{p.trial_dias > 0 && <> · {p.trial_dias} dias de teste</>}
                {p.requer_aprovacao && <> · com aprovação</>} · {p.contratacoes} contratação(ões)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Selo texto={p.ativo ? 'Ativo' : 'Desativado'} />
              <button className={btnSec} onClick={() => setEdit(edit === p.slug ? null : p.slug)}>{edit === p.slug ? 'Fechar' : 'Editar'}</button>
            </div>
          </div>
          {edit === p.slug && <FormProduto p={p} onSalvar={(f) => salvar(p, false, f)} onCancelar={() => setEdit(null)} />}
        </div>
      ))}
    </div>
  );
};

const FormProduto: React.FC<{ p: Produto; novo?: boolean; onSalvar: (f: any) => void; onCancelar: () => void }> = ({ p, novo, onSalvar, onCancelar }) => {
  const [f, setF] = useState({
    slug: p.slug, nome: p.nome, valor: String(p.valor), taxa: String(p.taxa_implantacao), trial: String(p.trial_dias),
    dias: p.dias_vencimento.join(', '), descricao: p.descricao || '', condicoes: p.condicoes || '', recursos: (p.recursos || []).join('\n'),
    aprov: p.requer_aprovacao, ativo: p.ativo, ordem: String(p.ordem),
  });
  const set = (k: string, v: string | boolean) => setF((s) => ({ ...s, [k]: v }));
  return (
    <div className="mt-4 grid sm:grid-cols-2 gap-3">
      {novo && <div><label className={rot}>Código (letras minúsculas e hífen)</label><input className={campo} value={f.slug} onChange={(e) => set('slug', e.target.value)} /></div>}
      <div><label className={rot}>Nome</label><input className={campo} value={f.nome} onChange={(e) => set('nome', e.target.value)} /></div>
      <div><label className={rot}>Mensalidade (R$)</label><input className={campo} inputMode="decimal" value={f.valor} onChange={(e) => set('valor', e.target.value.replace(',', '.'))} /></div>
      <div><label className={rot}>Implantação (R$, cobrança única)</label><input className={campo} inputMode="decimal" value={f.taxa} onChange={(e) => set('taxa', e.target.value.replace(',', '.'))} /></div>
      <div><label className={rot}>Dias de teste grátis</label><input className={campo} inputMode="numeric" value={f.trial} onChange={(e) => set('trial', e.target.value)} /></div>
      <div><label className={rot}>Dias de vencimento permitidos (ex.: 5, 8, 21)</label><input className={campo} value={f.dias} onChange={(e) => set('dias', e.target.value)} /></div>
      <div><label className={rot}>Ordem na lista</label><input className={campo} inputMode="numeric" value={f.ordem} onChange={(e) => set('ordem', e.target.value)} /></div>
      <div className="sm:col-span-2"><label className={rot}>Descrição</label><textarea className={campo} rows={2} value={f.descricao} onChange={(e) => set('descricao', e.target.value)} /></div>
      <div className="sm:col-span-2"><label className={rot}>O que está incluso (um item por linha)</label><textarea className={campo} rows={5} value={f.recursos} onChange={(e) => set('recursos', e.target.value)} /></div>
      <div className="sm:col-span-2"><label className={rot}>Condições comerciais</label><textarea className={campo} rows={2} value={f.condicoes} onChange={(e) => set('condicoes', e.target.value)} /></div>
      <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={f.aprov} onChange={(e) => set('aprov', e.target.checked)} /> Precisa da minha aprovação antes de cobrar</label>
      <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={f.ativo} onChange={(e) => set('ativo', e.target.checked)} /> Ativo (aparece para contratação)</label>
      <div className="sm:col-span-2 flex gap-2"><button className={btn} onClick={() => onSalvar(f)}>Salvar</button><button className={btnSec} onClick={onCancelar}>Cancelar</button></div>
    </div>
  );
};

// ---------- links -------------------------------------------------------------
const LinksAba: React.FC = () => {
  const [prod, setProd] = useState<Produto[]>([]);
  const [f, setF] = useState({ planoNome: '', valor: '', vencimentoDia: '5', nomeRef: '', emailRef: '', taxaImplantacao: '0', trialDias: '0', requerAprovacao: false, expiraDias: '7' });
  const [link, setLink] = useState('');
  const [erro, setErro] = useState('');
  const [copiado, setCopiado] = useState(false);
  useEffect(() => { api('/api/admin/catalogo').then((r) => r.ok && setProd(r.data.produtos)); }, []);
  const set = (k: string, v: string | boolean) => setF((s) => ({ ...s, [k]: v }));
  const preencher = (slug: string) => {
    const p = prod.find((x) => x.slug === slug);
    if (p) setF((s) => ({ ...s, planoNome: p.nome, valor: String(p.valor), taxaImplantacao: String(p.taxa_implantacao), trialDias: String(p.trial_dias), requerAprovacao: p.requer_aprovacao, vencimentoDia: String(p.dias_vencimento[0] ?? 5) }));
  };
  const gerar = async (e: React.FormEvent) => {
    e.preventDefault(); setErro(''); setLink('');
    const r = await api('/api/admin/convites', { method: 'POST', body: f });
    if (r.ok) setLink(r.data.link); else setErro('Confira os campos (nome, valor e dia de vencimento).');
  };
  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-sm text-slate-400">Gere um link exclusivo para um cliente. O link vale para um único CPF/CNPJ e expira.</p>
      <form onSubmit={gerar} className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2"><label className={rot}>Começar a partir de um produto do catálogo</label>
          <select className={campo} onChange={(e) => preencher(e.target.value)} defaultValue=""><option value="">— escolher —</option>{prod.map((p) => <option key={p.slug} value={p.slug}>{p.nome}</option>)}</select></div>
        <div><label className={rot}>Nome do plano no contrato</label><input className={campo} value={f.planoNome} onChange={(e) => set('planoNome', e.target.value)} required /></div>
        <div><label className={rot}>Mensalidade (R$)</label><input className={campo} inputMode="decimal" value={f.valor} onChange={(e) => set('valor', e.target.value.replace(',', '.'))} required /></div>
        <div><label className={rot}>Dia do vencimento (1 a 28)</label><input className={campo} inputMode="numeric" value={f.vencimentoDia} onChange={(e) => set('vencimentoDia', e.target.value)} required /></div>
        <div><label className={rot}>Implantação (R$)</label><input className={campo} inputMode="decimal" value={f.taxaImplantacao} onChange={(e) => set('taxaImplantacao', e.target.value.replace(',', '.'))} /></div>
        <div><label className={rot}>Dias de teste grátis</label><input className={campo} inputMode="numeric" value={f.trialDias} onChange={(e) => set('trialDias', e.target.value)} /></div>
        <div><label className={rot}>Validade do link (dias)</label><input className={campo} inputMode="numeric" value={f.expiraDias} onChange={(e) => set('expiraDias', e.target.value)} /></div>
        <div><label className={rot}>Nome do cliente (opcional)</label><input className={campo} value={f.nomeRef} onChange={(e) => set('nomeRef', e.target.value)} /></div>
        <div><label className={rot}>E-mail do cliente (opcional)</label><input className={campo} type="email" value={f.emailRef} onChange={(e) => set('emailRef', e.target.value)} /></div>
        <label className="sm:col-span-2 flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={f.requerAprovacao} onChange={(e) => set('requerAprovacao', e.target.checked)} /> Eu aprovo antes de a cobrança ser criada</label>
        <div className="sm:col-span-2"><button className={btn}>Gerar link</button></div>
      </form>
      {erro && <p className="text-sm text-red-300">{erro}</p>}
      {link && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4 space-y-2">
          <p className="text-xs text-emerald-300 font-semibold">Link gerado. Copie agora, ele não é mostrado de novo.</p>
          <p className="text-sm text-white break-all">{link}</p>
          <button className={btnSec} onClick={() => { navigator.clipboard?.writeText(link); setCopiado(true); }}>
            {copiado ? <span className="inline-flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Copiado</span> : <span className="inline-flex items-center gap-1"><Copy className="w-3.5 h-3.5" /> Copiar</span>}
          </button>
        </div>
      )}
    </div>
  );
};

// ---------- dados da empresa (usados no contrato) -----------------------------
const EmpresaAba: React.FC = () => {
  const [f, setF] = useState({ empresa_razao: '', empresa_cnpj: '', empresa_endereco: '', empresa_email: '', empresa_foro: '' });
  const [emailOk, setEmailOk] = useState<boolean | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; texto: string } | null>(null);
  useEffect(() => {
    api('/api/admin/config').then((r) => { if (r.ok) { setF((s) => ({ ...s, ...r.data.config })); setEmailOk(r.data.emailConfigurado); } });
  }, []);
  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));
  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await api('/api/admin/config', { method: 'PUT', body: f });
    setMsg({ ok: r.ok, texto: r.ok ? 'Dados salvos. Valem para os próximos contratos.' : 'Não foi possível salvar.' });
  };
  return (
    <form onSubmit={salvar} className="max-w-2xl space-y-3">
      <p className="text-sm text-slate-400">Estes dados aparecem como CONTRATADA no contrato. Contratos já aceitos não mudam.</p>
      <div><label className={rot}>Razão social (e nome comercial)</label><input className={campo} value={f.empresa_razao} onChange={(e) => set('empresa_razao', e.target.value)} /></div>
      <div><label className={rot}>CNPJ</label><input className={campo} value={f.empresa_cnpj} onChange={(e) => set('empresa_cnpj', e.target.value)} /></div>
      <div><label className={rot}>Endereço completo</label><input className={campo} value={f.empresa_endereco} onChange={(e) => set('empresa_endereco', e.target.value)} /></div>
      <div><label className={rot}>E-mail de contato (opcional, também recebe as respostas do cliente)</label><input className={campo} type="email" value={f.empresa_email} onChange={(e) => set('empresa_email', e.target.value)} /></div>
      <div><label className={rot}>Foro</label><input className={campo} value={f.empresa_foro} onChange={(e) => set('empresa_foro', e.target.value)} /></div>
      <p className={`text-xs ${emailOk ? 'text-emerald-300' : 'text-amber-300'}`}>
        {emailOk === null ? '' : emailOk ? 'Envio de e-mail do contrato: ativo.' : 'Envio de e-mail do contrato: desligado (falta a chave do Resend no servidor). O PDF é gerado e guardado do mesmo jeito.'}
      </p>
      {msg && <p className={`text-sm ${msg.ok ? 'text-emerald-300' : 'text-red-300'}`}>{msg.texto}</p>}
      <button className={btn}>Salvar</button>
    </form>
  );
};

// ---------- impressão: só a área marcada sai no papel --------------------------
const EstiloImpressao: React.FC = () => (
  <style>{`
    @media print {
      body * { visibility: hidden !important; }
      .area-impressao, .area-impressao * { visibility: visible !important; }
      .area-impressao { position: absolute !important; left: 0; top: 0; width: 100% !important; background: #fff !important; color: #000 !important; padding: 8mm !important; }
      .area-impressao * { color: #000 !important; background: transparent !important; border-color: #999 !important; box-shadow: none !important; }
      .modal-impressao { position: static !important; overflow: visible !important; height: auto !important; background: #fff !important; }
      .no-print { display: none !important; }
    }
  `}</style>
);

const STATUS_ABERTA = new Set(['PENDING']);
const ehPaga = (st: string) => st === 'RECEIVED' || st === 'CONFIRMED' || st === 'RECEIVED_IN_CASH';

interface Ficha {
  cliente: {
    id: string; tipo: string; nome: string; cpf_cnpj: string; email: string; celular: string; telefone: string | null; cep: string; endereco: string;
    numero: string; complemento: string | null; bairro: string; cidade: string; uf: string; status_cadastro: string; aceite_em: string | null;
    aceite_ip: string | null; created_at: string; ultimo_login_em: string | null; tem_senha: boolean;
  };
  assinaturas: { id: string; plano_nome: string; valor: string; taxa_implantacao: string; trial_dias: number; vencimento_dia: number; forma_pagamento: string; status: string; bloqueada: boolean; bloqueada_em: string | null; bloqueio_motivo: string | null; tem_contrato: boolean }[];
  cobrancas: { valor: string; vencimento: string; status: string; forma_pagamento: string | null; invoice_url: string | null; pago_em: string | null }[];
}

const CAMPOS_EDIT: [string, string][] = [
  ['nome', 'Nome'], ['email', 'E-mail'], ['celular', 'Celular'], ['telefone', 'Telefone fixo'], ['cep', 'CEP'],
  ['endereco', 'Endereço'], ['numero', 'Número'], ['complemento', 'Complemento'], ['bairro', 'Bairro'], ['cidade', 'Cidade'], ['uf', 'UF'],
];

const FichaCliente: React.FC<{ id: string; editarInicial?: boolean; onFechar: () => void; onMudou: () => void }> = ({ id, editarInicial, onFechar, onMudou }) => {
  const [f, setF] = useState<Ficha | null>(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);

  const carregar = useCallback(async () => {
    const r = await api<Ficha>(`/api/admin/clientes/${id}`);
    if (r.ok) setF(r.data); else setMsg({ ok: false, t: 'Não foi possível carregar o cliente.' });
  }, [id]);
  useEffect(() => { carregar(); }, [carregar]);
  useEffect(() => {
    if (f && editarInicial && !editando && Object.keys(form).length === 0) iniciarEdicao();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f]);

  const iniciarEdicao = () => {
    if (!f) return;
    const c = f.cliente as unknown as Record<string, string | null>;
    setForm(Object.fromEntries(CAMPOS_EDIT.map(([k]) => [k, String(c[k] ?? '')])));
    setEditando(true); setMsg(null);
  };
  const salvar = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(null);
    const r = await api(`/api/admin/clientes/${id}`, { method: 'PUT', body: form });
    if (r.ok) {
      setMsg({ ok: true, t: r.data.asaas === false ? 'Salvo aqui. O Asaas não atualizou agora: confira o cadastro lá.' : 'Dados salvos, aqui e no Asaas.' });
      setEditando(false); await carregar(); onMudou();
    } else setMsg({ ok: false, t: r.data?.error === 'dados_invalidos' ? 'Confira os dados: e-mail, celular, CEP e UF precisam estar corretos.' : 'Não foi possível salvar.' });
  };
  const bloqueio = async (aid: string, bloquear: boolean) => {
    let motivo = '';
    if (bloquear) {
      const m = window.prompt('Motivo do bloqueio (opcional):', 'Inadimplência');
      if (m === null) return;
      motivo = m;
    } else if (!window.confirm('Desbloquear este serviço?')) return;
    const r = await api(`/api/admin/assinaturas/${aid}/bloqueio`, { method: 'POST', body: { bloquear, motivo } });
    setMsg({ ok: r.ok, t: r.ok ? (bloquear ? 'Serviço bloqueado.' : 'Serviço desbloqueado.') : 'Não foi possível alterar o serviço.' });
    await carregar(); onMudou();
  };

  const c = f?.cliente;
  const total = (f?.cobrancas || []).reduce((a, x) => ({
    pago: a.pago + (ehPaga(x.status) ? Number(x.valor) : 0),
    aberto: a.aberto + (STATUS_ABERTA.has(x.status) ? Number(x.valor) : 0),
    vencido: a.vencido + (x.status === 'OVERDUE' ? Number(x.valor) : 0),
  }), { pago: 0, aberto: 0, vencido: 0 });

  return (
    <div className="modal-impressao fixed inset-0 z-50 bg-black/70 overflow-y-auto p-4" onClick={onFechar}>
      <div className="area-impressao max-w-3xl mx-auto my-6 rounded-2xl bg-[#0e1422] border border-slate-700 p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Ficha do cliente — Antum</p>
            <h2 className="text-xl font-extrabold text-white">{c?.nome || 'Carregando…'}</h2>
          </div>
          <div className="no-print flex gap-2">
            {f && !editando && <button className={btnSec} onClick={iniciarEdicao}>Editar</button>}
            {f && <button className={btnSec} onClick={() => window.print()}>Imprimir</button>}
            <button className={btnSec} onClick={onFechar}>Fechar</button>
          </div>
        </div>
        {msg && <p className={`no-print text-sm ${msg.ok ? 'text-emerald-300' : 'text-red-300'}`}>{msg.t}</p>}
        {!f && !msg && <p className="text-sm text-slate-500 flex gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Carregando…</p>}

        {f && c && !editando && (
          <>
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {[
                [c.tipo === 'PJ' ? 'CNPJ' : 'CPF', c.cpf_cnpj], ['E-mail', c.email], ['Celular', c.celular], ['Telefone', c.telefone || '—'],
                ['Endereço', `${c.endereco}, ${c.numero}${c.complemento ? ' - ' + c.complemento : ''}, ${c.bairro}, ${c.cidade}/${c.uf} — CEP ${c.cep}`],
                ['Cadastro em', dataHora(c.created_at)], ['Aceite do contrato', c.aceite_em ? `${dataHora(c.aceite_em)} (IP ${c.aceite_ip || '—'})` : '—'],
                ['Área do cliente', c.tem_senha ? `Senha criada${c.ultimo_login_em ? ' · último acesso ' + dataHora(c.ultimo_login_em) : ' · ainda não entrou'}` : 'Ainda não criou a senha'],
              ].map(([k, v]) => (<div key={k} className={k === 'Endereço' ? 'sm:col-span-2' : ''}><dt className="text-xs text-slate-500">{k}</dt><dd className="text-white break-words">{v}</dd></div>))}
            </dl>

            <div>
              <h3 className="text-sm font-bold text-white mb-2">Serviços contratados</h3>
              {f.assinaturas.length === 0 ? <p className="text-sm text-slate-500">Nenhum serviço.</p> : (
                <ul className="space-y-2">
                  {f.assinaturas.map((a) => (
                    <li key={a.id} className="rounded-xl border border-slate-700 p-3 text-sm flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{a.plano_nome} {a.bloqueada && <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold text-red-300 bg-red-500/10">BLOQUEADO</span>}</p>
                        <p className="text-xs text-slate-400">{brl(a.valor)}/mês · vence dia {a.vencimento_dia} · {STATUS_ASS[a.status] || a.status}{Number(a.taxa_implantacao) > 0 ? ` · implantação ${brl(a.taxa_implantacao)}` : ''}</p>
                        {a.bloqueada && <p className="text-xs text-red-300">Bloqueado em {a.bloqueada_em ? dataHora(a.bloqueada_em) : '—'}{a.bloqueio_motivo ? ` — ${a.bloqueio_motivo}` : ''}</p>}
                      </div>
                      <div className="no-print flex gap-2">
                        {a.tem_contrato && <a className={btnSec} href={`/api/admin/contratos/${a.id}/pdf`} target="_blank" rel="noopener noreferrer">Contrato PDF</a>}
                        {a.status !== 'CANCELADA' && (a.bloqueada
                          ? <button className={btnSec} onClick={() => bloqueio(a.id, false)}>Desbloquear</button>
                          : <button className="px-3 py-1.5 rounded-lg border border-red-500/60 hover:border-red-400 text-red-300 text-xs font-semibold" onClick={() => bloqueio(a.id, true)}>Bloquear</button>)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-2">Cobranças</h3>
              <p className="text-xs text-slate-400 mb-2">Recebido {brl(total.pago)} · A receber {brl(total.aberto)} · Vencido {brl(total.vencido)}</p>
              {f.cobrancas.length === 0 ? <p className="text-sm text-slate-500">Nenhuma cobrança registrada.</p> : (
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-xs text-slate-500"><th className="py-1 pr-3">Vencimento</th><th className="py-1 pr-3">Valor</th><th className="py-1 pr-3">Situação</th><th className="py-1">Pago em</th></tr></thead>
                  <tbody className="divide-y divide-slate-800">
                    {f.cobrancas.map((x, i) => (
                      <tr key={i}><td className="py-1.5 pr-3 text-white">{dataBR(x.vencimento)}</td><td className="py-1.5 pr-3 text-white">{brl(x.valor)}</td><td className="py-1.5 pr-3">{STATUS_COBRANCA[x.status] || x.status}</td><td className="py-1.5">{dataBR(x.pago_em)}</td></tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <p className="hidden print:block text-xs text-slate-500">Impresso em {new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
          </>
        )}

        {f && c && editando && (
          <form onSubmit={salvar} className="space-y-3">
            <p className="text-xs text-slate-500">{c.tipo === 'PJ' ? 'CNPJ' : 'CPF'} {c.cpf_cnpj} não pode ser alterado aqui.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {CAMPOS_EDIT.map(([k, rotulo]) => (
                <div key={k} className={k === 'endereco' || k === 'nome' ? 'sm:col-span-2' : ''}>
                  <label className={rot}>{rotulo}</label>
                  <input className={campo} value={form[k] ?? ''} onChange={(e) => setForm((x) => ({ ...x, [k]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div className="flex gap-2"><button className={btn}>Salvar</button><button type="button" className={btnSec} onClick={() => setEditando(false)}>Cancelar</button></div>
          </form>
        )}
      </div>
    </div>
  );
};

// ---------- cobranças: filtro por mês e situação, totais e impressão --------------
const CobrancasAba: React.FC<{ lista: Cobranca[] }> = ({ lista }) => {
  const [mes, setMes] = useState('todos');
  const [sit, setSit] = useState('todas');
  const meses = useMemo(() => Array.from(new Set(lista.map((b) => String(b.vencimento).slice(0, 7)))).sort().reverse(), [lista]);
  const filtradas = useMemo(() => lista.filter((b) =>
    (mes === 'todos' || String(b.vencimento).slice(0, 7) === mes) &&
    (sit === 'todas' || (sit === 'pagas' ? ehPaga(b.status) : sit === 'aberto' ? b.status === 'PENDING' : b.status === 'OVERDUE')),
  ), [lista, mes, sit]);
  const t = filtradas.reduce((a, b) => ({
    pago: a.pago + (ehPaga(b.status) ? Number(b.valor) : 0),
    aberto: a.aberto + (b.status === 'PENDING' ? Number(b.valor) : 0),
    vencido: a.vencido + (b.status === 'OVERDUE' ? Number(b.valor) : 0),
  }), { pago: 0, aberto: 0, vencido: 0 });
  const nomeMes = (m: string) => (m === 'todos' ? 'Todos os meses' : `${m.slice(5)}/${m.slice(0, 4)}`);

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap items-end gap-3">
        <div><label className={rot}>Mês de vencimento</label>
          <select className={campo} value={mes} onChange={(e) => setMes(e.target.value)}><option value="todos">Todos os meses</option>{meses.map((m) => <option key={m} value={m}>{nomeMes(m)}</option>)}</select></div>
        <div><label className={rot}>Situação</label>
          <select className={campo} value={sit} onChange={(e) => setSit(e.target.value)}><option value="todas">Todas</option><option value="pagas">Pagas</option><option value="aberto">A receber</option><option value="vencidas">Vencidas</option></select></div>
        <button className={btn} onClick={() => window.print()}>Imprimir</button>
      </div>
      <div className="area-impressao space-y-4">
        <div className="hidden print:block">
          <h2 className="text-lg font-bold">Extrato de cobranças — Antum</h2>
          <p className="text-xs">{nomeMes(mes)} · {sit === 'todas' ? 'todas as situações' : sit} · impresso em {new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Cartao titulo="Recebido" valor={brl(t.pago)} />
          <Cartao titulo="A receber" valor={brl(t.aberto)} />
          <Cartao titulo="Vencido" valor={brl(t.vencido)} alerta={t.vencido > 0} />
          <Cartao titulo="Total" valor={brl(t.pago + t.aberto + t.vencido)} sub={`${filtradas.length} cobrança${filtradas.length === 1 ? '' : 's'}`} />
        </div>
        <Tabela cols={['Cliente', 'Valor', 'Vencimento', 'Status', 'Forma', 'Pago em', 'Link']} vazio="Nenhuma cobrança neste filtro." vazioQuando={filtradas.length === 0}>
          {filtradas.map((b) => (
            <tr key={b.id}>
              <td className="px-3 py-2 font-semibold text-white">{b.cliente || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap">{brl(b.valor)}</td>
              <td className="px-3 py-2 whitespace-nowrap">{dataBR(b.vencimento)}</td>
              <td className="px-3 py-2"><Selo texto={STATUS_COBRANCA[b.status] || b.status} /></td>
              <td className="px-3 py-2">{b.forma_pagamento || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap">{dataBR(b.pago_em)}</td>
              <td className="px-3 py-2 no-print">{b.invoice_url ? <a className="text-cyan-300 underline" href={b.invoice_url} target="_blank" rel="noopener noreferrer">abrir</a> : '—'}</td>
            </tr>
          ))}
        </Tabela>
      </div>
    </div>
  );
};

// ---------- página ------------------------------------------------------------
const ABAS = ['Resumo', 'Contratações', 'Clientes', 'Cobranças', 'Catálogo', 'Links', 'Empresa', 'Atividade'] as const;

export const AdminPage: React.FC = () => {
  const [sessao, setSessao] = useState<string | null | undefined>(undefined); // undefined = verificando
  const [painel, setPainel] = useState<Painel | null>(null);
  const [aba, setAba] = useState<(typeof ABAS)[number]>('Resumo');
  const [aviso, setAviso] = useState<{ texto: string; ok: boolean } | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [ficha, setFicha] = useState<{ id: string; editar: boolean } | null>(null);

  useEffect(() => {
    document.title = 'Painel | ANTUM';
    let m = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!m) { m = document.createElement('meta'); m.name = 'robots'; document.head.appendChild(m); }
    m.content = 'noindex,nofollow';
    api('/api/admin/me').then((r) => setSessao(r.ok ? r.data.email : null));
  }, []);

  const carregar = useCallback(async () => {
    const r = await api<Painel>('/api/admin/painel');
    if (r.status === 401) { setSessao(null); return; }
    if (r.ok) setPainel(r.data);
  }, []);
  useEffect(() => { if (sessao) carregar(); }, [sessao, carregar]);

  const sincronizar = async () => {
    setAviso(null); setOcupado('sync');
    const r = await api('/api/admin/sincronizar', { method: 'POST', body: {} });
    setOcupado(null);
    setAviso({ ok: r.ok, texto: r.ok ? `Sincronizado com o Asaas (${r.data.clientes} cliente${r.data.clientes === 1 ? '' : 's'}${r.data.falhas ? `, ${r.data.falhas} com falha` : ''}).` : r.status === 429 ? 'Aguarde alguns segundos e tente de novo.' : 'Não foi possível sincronizar agora.' });
    carregar();
  };

  const sair = async () => { await api('/api/admin/logout', { method: 'POST', body: {} }); setSessao(null); setPainel(null); };

  const aprovar = async (id: string) => {
    if (!window.confirm('Aprovar e criar a assinatura no Asaas agora?')) return;
    setOcupado(id); setAviso(null);
    const r = await api(`/api/admin/assinaturas/${id}/aprovar`, { method: 'POST', body: {} });
    setOcupado(null);
    setAviso({ ok: r.ok, texto: r.ok ? 'Contratação aprovada e criada no Asaas.' : ERROS[r.data?.error] || 'Não foi possível aprovar.' });
    carregar();
  };

  const reenviar = async (id: string) => {
    if (!window.confirm('Reenviar o contrato em PDF para o e-mail do cliente?')) return;
    setAviso(null);
    const r = await api(`/api/admin/contratos/${id}/reenviar`, { method: 'POST', body: {} });
    const t = r.data?.status === 'ENVIADO' ? 'Contrato reenviado por e-mail.' : r.data?.status === 'SEM_CHAVE' ? 'E-mail desligado: falta a chave do Resend no servidor.' : r.status === 404 ? 'Esta contratação não tem contrato gerado.' : 'Não foi possível enviar o e-mail.';
    setAviso({ ok: r.data?.status === 'ENVIADO', texto: t });
  };

  const pendentes = useMemo(() => painel?.assinaturas.filter((a) => a.status === 'AGUARDANDO_APROVACAO').length ?? 0, [painel]);

  if (sessao === undefined) return <section className="min-h-screen pt-32 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-500" /></section>;
  if (!sessao) return <Login onOk={setSessao} />;

  return (
    <section className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Painel Antum</h1>
            <p className="text-xs text-slate-500">{sessao}</p>
          </div>
          <div className="flex items-center gap-2">
            {painel && (
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${painel.asaasBase === 'producao' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
                Asaas: {painel.asaasBase === 'producao' ? 'PRODUÇÃO' : 'sandbox (teste)'}
              </span>
            )}
            <button className={btnSec} onClick={carregar}><RefreshCw className="w-3.5 h-3.5 inline mr-1" />Atualizar</button>
            <button className={btnSec} disabled={ocupado === 'sync'} onClick={sincronizar}>{ocupado === 'sync' ? 'Sincronizando…' : 'Sincronizar com o Asaas'}</button>
            <button className={btnSec} onClick={sair}><LogOut className="w-3.5 h-3.5 inline mr-1" />Sair</button>
          </div>
        </div>

        <nav className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {ABAS.map((a) => (
            <button key={a} onClick={() => { setAba(a); setAviso(null); }} className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${aba === a ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}>
              {a}{a === 'Contratações' && pendentes > 0 && <span className="ml-1.5 px-1.5 rounded-full bg-amber-400 text-slate-950 text-xs">{pendentes}</span>}
            </button>
          ))}
        </nav>

        {aviso && (
          <p className={`text-sm flex items-center gap-2 ${aviso.ok ? 'text-emerald-300' : 'text-red-300'}`}>
            {aviso.ok ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}{aviso.texto}
          </p>
        )}
        {!painel && aba !== 'Catálogo' && aba !== 'Links' && <p className="text-sm text-slate-500 flex gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Carregando…</p>}

        {painel && aba === 'Resumo' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Cartao titulo="Clientes" valor={String(painel.resumo.clientes)} />
            <Cartao titulo="Assinaturas ativas" valor={String(painel.resumo.ativas)} />
            <Cartao titulo="Aguardando aprovação" valor={String(painel.resumo.aguardando)} alerta={painel.resumo.aguardando > 0} />
            <Cartao titulo="Mensalidades contratadas" valor={brl(painel.resumo.mrr)} sub="por mês" />
            <Cartao titulo="Recebido neste mês" valor={brl(painel.resumo.recebido_mes)} />
            <Cartao titulo="Cobranças vencidas" valor={String(painel.resumo.vencidas)} sub={brl(painel.resumo.valor_vencido)} alerta={painel.resumo.vencidas > 0} />
            <Cartao titulo="Recebido (total)" valor={brl(painel.resumo.recebido_total)} />
            <Cartao titulo="A receber" valor={brl(painel.resumo.a_receber)} />
            <Cartao titulo="Previsto (total)" valor={brl(Number(painel.resumo.recebido_total) + Number(painel.resumo.a_receber) + Number(painel.resumo.valor_vencido))} sub="recebido + a receber + vencido" />
            <Cartao titulo="Serviços bloqueados" valor={String(painel.resumo.bloqueadas)} alerta={painel.resumo.bloqueadas > 0} />
          </div>
        )}

        {painel && aba === 'Contratações' && (
          <Tabela cols={['Cliente', 'Plano', 'Mensalidade', 'Implantação', 'Teste', 'Venc.', 'Status', '']} vazio="Nenhuma contratação ainda." vazioQuando={painel.assinaturas.length === 0}>
            {painel.assinaturas.map((a) => (
              <tr key={a.id}>
                <td className="px-3 py-2"><div className="font-semibold text-white">{a.cliente}</div><div className="text-xs text-slate-500">{a.cliente_email}</div></td>
                <td className="px-3 py-2">{a.plano_nome}</td>
                <td className="px-3 py-2 whitespace-nowrap">{brl(a.valor)}</td>
                <td className="px-3 py-2 whitespace-nowrap">{Number(a.taxa_implantacao) > 0 ? brl(a.taxa_implantacao) : '—'}</td>
                <td className="px-3 py-2">{a.trial_dias > 0 ? `${a.trial_dias} dias` : '—'}</td>
                <td className="px-3 py-2">dia {a.vencimento_dia}</td>
                <td className="px-3 py-2"><Selo texto={STATUS_ASS[a.status] || a.status} />{a.bloqueada && <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold text-red-300 bg-red-500/10">Bloqueado</span>}{a.ultimo_erro && <div className="text-xs text-red-300 mt-1 max-w-[220px]">{a.ultimo_erro}</div>}</td>
                <td className="px-3 py-2 whitespace-nowrap space-x-2">
                  {a.status === 'AGUARDANDO_APROVACAO' && <button className={btn} disabled={ocupado === a.id} onClick={() => aprovar(a.id)}>{ocupado === a.id ? 'Criando…' : 'Aprovar'}</button>}
                  <a className={btnSec} href={`/api/admin/contratos/${a.id}/pdf`} target="_blank" rel="noopener noreferrer">Contrato PDF</a>
                  <button className={btnSec} onClick={() => reenviar(a.id)}>Reenviar e-mail</button>
                </td>
              </tr>
            ))}
          </Tabela>
        )}

        {painel && aba === 'Clientes' && (
          <Tabela cols={['Nome', 'CPF/CNPJ', 'E-mail', 'Celular', 'Cidade', 'Cadastro', '']} vazio="Nenhum cliente ainda." vazioQuando={painel.clientes.length === 0}>
            {painel.clientes.map((c) => (
              <tr key={c.id}>
                <td className="px-3 py-2 font-semibold text-white">{c.nome}{c.bloqueadas > 0 && <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold text-red-300 bg-red-500/10">Bloqueado</span>}</td>
                <td className="px-3 py-2 whitespace-nowrap">{c.cpf_cnpj}</td>
                <td className="px-3 py-2">{c.email}</td>
                <td className="px-3 py-2 whitespace-nowrap">{c.celular}</td>
                <td className="px-3 py-2">{c.cidade}/{c.uf}</td>
                <td className="px-3 py-2"><Selo texto={c.status_cadastro === 'CONCLUIDO' ? 'Ativa' : c.status_cadastro === 'ERRO' ? 'Erro' : 'Aguardando'} /></td>
                <td className="px-3 py-2 whitespace-nowrap space-x-2">
                  <button className={btnSec} onClick={() => setFicha({ id: c.id, editar: false })}>Consultar</button>
                  <button className={btnSec} onClick={() => setFicha({ id: c.id, editar: true })}>Editar</button>
                </td>
              </tr>
            ))}
          </Tabela>
        )}

        {painel && aba === 'Cobranças' && <CobrancasAba lista={painel.cobrancas} />}

        {aba === 'Catálogo' && <CatalogoAba />}
        {aba === 'Links' && <LinksAba />}
        {aba === 'Empresa' && <EmpresaAba />}

        {painel && aba === 'Atividade' && (
          <Tabela cols={['Quando', 'Quem', 'O que', 'Detalhe', 'IP']} vazio="Sem atividade." vazioQuando={painel.auditoria.length === 0}>
            {painel.auditoria.map((l, i) => (
              <tr key={i}>
                <td className="px-3 py-2 whitespace-nowrap">{dataHora(l.quando)}</td>
                <td className="px-3 py-2">{l.admin_email || '—'}</td>
                <td className="px-3 py-2">{l.acao}</td>
                <td className="px-3 py-2 text-xs text-slate-400 max-w-[280px] truncate">{l.detalhe && Object.keys(l.detalhe).length ? JSON.stringify(l.detalhe) : ''}</td>
                <td className="px-3 py-2 text-xs">{l.ip}</td>
              </tr>
            ))}
          </Tabela>
        )}
      </div>
      <EstiloImpressao />
      {ficha && <FichaCliente id={ficha.id} editarInicial={ficha.editar} onFechar={() => setFicha(null)} onMudou={carregar} />}
    </section>
  );
};
