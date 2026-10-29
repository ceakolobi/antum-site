// Módulo financeiro Antum + Asaas (cadastro, assinatura, webhook, admin).
// Toda chamada ao Asaas e ao banco acontece AQUI, no servidor. Nada de chave no frontend.
import type { Express, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import pg from 'pg';

const env = (k: string) => (process.env[k] || '').trim();

// Conexão direta com papel restrito (antum_fin): só enxerga o schema "financeiro".
const FIN_DATABASE_URL = () => env('FIN_DATABASE_URL');
// A chave do Asaas começa com "$aact_". Painéis como o EasyPanel tratam "$nome" como variável e
// esvaziam o valor, então aceitamos a chave SEM o "$" inicial e o recolocamos aqui.
const ASAAS_KEY = () => {
  const k = env('ASAAS_API_KEY');
  return k.startsWith('aact_') ? `$${k}` : k;
};
// Padrão = SANDBOX. Produção só com ASAAS_BASE_URL=https://api.asaas.com/v3 explícito.
const ASAAS_BASE = () => env('ASAAS_BASE_URL') || 'https://api-sandbox.asaas.com/v3';
const WEBHOOK_TOKEN = () => env('ASAAS_WEBHOOK_TOKEN');
const ADMIN_TOKEN = () => env('FIN_ADMIN_TOKEN');
const SITE_URL = () => env('SITE_URL') || 'https://antum.com.br';

const CONTRATO_VERSAO = 'contrato-v1-2026-10';
const MULTA_FIXA = 5.22;
const GRUPO_ASAAS = 'Sistemas';

const configurado = () => Boolean(FIN_DATABASE_URL() && ASAAS_KEY());

// ---------- utilitários -------------------------------------------------------
const onlyDigits = (s: unknown) => String(s ?? '').replace(/\D/g, '');
const str = (s: unknown, max = 200) => String(s ?? '').trim().slice(0, max);
const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex');

function cpfValido(c: string) {
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  const calc = (n: number) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += parseInt(c[i], 10) * (n + 1 - i);
    const r = (s * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === parseInt(c[9], 10) && calc(10) === parseInt(c[10], 10);
}
function cnpjValido(c: string) {
  if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false;
  const calc = (n: number) => {
    const pesos = n === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let s = 0;
    for (let i = 0; i < n; i++) s += parseInt(c[i], 10) * pesos[i];
    const r = s % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return calc(12) === parseInt(c[12], 10) && calc(13) === parseInt(c[13], 10);
}

const hojeSP = () => {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
  return new Date(`${p}T00:00:00Z`);
};
const iso = (d: Date) => d.toISOString().slice(0, 10);

// Próximo vencimento: o dia escolhido, com pelo menos 5 dias de folga a partir de hoje.
export function proximoVencimento(dia: number, hoje: Date = hojeSP()): string {
  const minimo = new Date(hoje.getTime() + 5 * 86400000);
  let ano = hoje.getUTCFullYear();
  let mes = hoje.getUTCMonth();
  for (let i = 0; i < 3; i++) {
    const cand = new Date(Date.UTC(ano, mes, dia));
    if (cand >= minimo) return iso(cand);
    mes += 1;
    if (mes > 11) { mes = 0; ano += 1; }
  }
  return iso(new Date(Date.UTC(ano, mes, dia)));
}

// ---------- clientes HTTP -----------------------------------------------------
let pool: pg.Pool | null = null;
async function db<T = any>(text: string, params: unknown[] = []): Promise<T[]> {
  if (!pool) {
    pool = new pg.Pool({
      connectionString: FIN_DATABASE_URL(),
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 20_000,
      connectionTimeoutMillis: 8_000,
    });
    pool.on('error', (e) => console.error('[fin/pool]', e.message));
  }
  const r = await pool.query(text, params as any[]);
  return r.rows as T[];
}

async function asaas<T = any>(method: string, path: string, body?: unknown): Promise<T> {
  const r = await fetch(`${ASAAS_BASE()}${path}`, {
    method,
    headers: {
      access_token: ASAAS_KEY(),
      'Content-Type': 'application/json',
      'User-Agent': 'antum-site',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await r.text();
  if (!r.ok) {
    let msg = text.slice(0, 300);
    try {
      const j = JSON.parse(text);
      if (j?.errors?.length) msg = j.errors.map((e: any) => e.description).join('; ');
    } catch { /* mantém texto */ }
    throw new Error(`asaas ${r.status}: ${msg}`);
  }
  return JSON.parse(text) as T;
}

// ---------- proteção básica ---------------------------------------------------
const ORIGENS = () =>
  (env('ALLOWED_ORIGINS') || 'https://antum.com.br,https://www.antum.com.br')
    .split(',').map((s) => s.trim()).filter(Boolean);

function origemOk(req: Request) {
  const o = (req.headers.origin || '').toString();
  if (!o) return false;
  if (process.env.NODE_ENV !== 'production' && /^http:\/\/localhost(:\d+)?$/.test(o)) return true;
  return ORIGENS().includes(o);
}

const hits = new Map<string, number[]>();
function limite(key: string, max: number, janelaMs: number) {
  const agora = Date.now();
  const lista = (hits.get(key) || []).filter((t) => agora - t < janelaMs);
  if (lista.length >= max) { hits.set(key, lista); return false; }
  lista.push(agora);
  hits.set(key, lista);
  return true;
}
const ipDe = (req: Request) =>
  (req.headers['cf-connecting-ip'] || req.ip || '').toString().slice(0, 64);

function igual(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function exigeAdmin(req: Request, res: Response, next: NextFunction) {
  const t = ADMIN_TOKEN();
  const h = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!t || t.length < 32 || !h || !igual(h, t)) return res.status(401).json({ error: 'nao_autorizado' });
  next();
}

// ---------- regras de plano ---------------------------------------------------
interface PlanoResolvido {
  conviteId: string | null;
  planoSlug: string | null;
  planoNome: string;
  valor: number;
  diasPermitidos: number[];
  nomeRef?: string | null;
  emailRef?: string | null;
  vinculado?: string | null;
}

async function resolverPlano(token: string | undefined): Promise<PlanoResolvido | { erro: string; status: number }> {
  if (token) {
    if (!/^[A-Za-z0-9_-]{32,64}$/.test(token)) return { erro: 'convite_invalido', status: 404 };
    const rows = await db('select * from financeiro.convites where token_hash = $1', [sha256(token)]);
    const c = rows[0];
    if (!c) return { erro: 'convite_invalido', status: 404 };
    if (c.concluido_em) return { erro: 'convite_ja_utilizado', status: 409 };
    if (new Date(c.expira_em) < new Date()) return { erro: 'convite_expirado', status: 410 };
    return {
      conviteId: c.id,
      planoSlug: null,
      planoNome: c.plano_nome,
      valor: Number(c.valor),
      diasPermitidos: [c.vencimento_dia],
      nomeRef: c.nome_ref,
      emailRef: c.email_ref,
      vinculado: c.cpf_cnpj_vinculado,
    };
  }
  const rows = await db("select * from financeiro.planos where slug = 'marina-sdr' and automatico and ativo");
  const p = rows[0];
  if (!p) return { erro: 'plano_indisponivel', status: 503 };
  return {
    conviteId: null,
    planoSlug: p.slug,
    planoNome: p.nome,
    valor: Number(p.valor),
    diasPermitidos: p.dias_vencimento,
  };
}

// ---------- validação do cadastro --------------------------------------------
function validar(b: any, plano: PlanoResolvido) {
  const erros: Record<string, string> = {};
  const tipo = b.tipo === 'PJ' ? 'PJ' : b.tipo === 'PF' ? 'PF' : '';
  if (!tipo) erros.tipo = 'Escolha pessoa física ou jurídica.';
  const doc = onlyDigits(b.cpfCnpj);
  if (tipo === 'PF' && !cpfValido(doc)) erros.cpfCnpj = 'CPF inválido.';
  if (tipo === 'PJ' && !cnpjValido(doc)) erros.cpfCnpj = 'CNPJ inválido.';
  const nome = str(b.nome, 150);
  if (nome.length < 3) erros.nome = 'Informe o nome completo ou a razão social.';
  const email = str(b.email, 150).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) erros.email = 'E-mail inválido.';
  const celular = onlyDigits(b.celular);
  if (celular.length < 10 || celular.length > 11) erros.celular = 'Celular com DDD inválido.';
  const telefone = onlyDigits(b.telefone);
  if (telefone && (telefone.length < 10 || telefone.length > 11)) erros.telefone = 'Telefone com DDD inválido.';
  const cep = onlyDigits(b.cep);
  if (cep.length !== 8) erros.cep = 'CEP inválido.';
  const endereco = str(b.endereco, 150);
  if (!endereco) erros.endereco = 'Informe o endereço.';
  const numero = str(b.numero, 20);
  if (!numero) erros.numero = 'Informe o número.';
  const bairro = str(b.bairro, 100);
  if (!bairro) erros.bairro = 'Informe o bairro.';
  const cidade = str(b.cidade, 100);
  if (!cidade) erros.cidade = 'Informe a cidade.';
  const uf = str(b.uf, 2).toUpperCase();
  if (!/^[A-Z]{2}$/.test(uf)) erros.uf = 'UF inválida.';
  const forma = b.formaPagamento === 'BOLETO' ? 'BOLETO' : b.formaPagamento === 'PIX' ? 'PIX' : '';
  if (!forma) erros.formaPagamento = 'Escolha PIX ou boleto.';
  const dia = plano.diasPermitidos.length === 1 ? plano.diasPermitidos[0] : parseInt(String(b.vencimentoDia), 10);
  if (!plano.diasPermitidos.includes(dia)) erros.vencimentoDia = 'Escolha um dia de vencimento válido.';
  if (b.aceite !== true) erros.aceite = 'É necessário aceitar o contrato e a política de privacidade.';
  return {
    erros,
    dados: {
      tipo, doc, nome, email, celular, telefone, cep, endereco, numero,
      complemento: str(b.complemento, 80), bairro, cidade, uf, forma, dia,
    },
  };
}

// ---------- fluxo principal ---------------------------------------------------
async function processarCadastro(req: Request, plano: PlanoResolvido, d: ReturnType<typeof validar>['dados']) {
  // 1) Cliente local (único por CPF/CNPJ) + registro do aceite
  let cliente: any;
  if (plano.vinculado && plano.vinculado !== d.doc) throw Object.assign(new Error('convite_de_outro_cliente'), { status: 409 });

  [cliente] = await db(
    `insert into financeiro.clientes
       (tipo, nome, cpf_cnpj, email, celular, telefone, cep, endereco, numero, complemento,
        bairro, cidade, uf, aceite_em, aceite_ip, aceite_user_agent, aceite_versao)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13, now(), $14,$15,$16)
     on conflict (cpf_cnpj) do update set
       tipo=excluded.tipo, nome=excluded.nome, email=excluded.email, celular=excluded.celular,
       telefone=excluded.telefone, cep=excluded.cep, endereco=excluded.endereco, numero=excluded.numero,
       complemento=excluded.complemento, bairro=excluded.bairro, cidade=excluded.cidade, uf=excluded.uf,
       aceite_em=excluded.aceite_em, aceite_ip=excluded.aceite_ip,
       aceite_user_agent=excluded.aceite_user_agent, aceite_versao=excluded.aceite_versao, updated_at=now()
     returning *`,
    [d.tipo, d.nome, d.doc, d.email, d.celular, d.telefone || null, d.cep, d.endereco, d.numero,
     d.complemento || null, d.bairro, d.cidade, d.uf, ipDe(req), str(req.headers['user-agent'], 300), CONTRATO_VERSAO],
  );

  // Vincula o convite a este CPF/CNPJ (só o primeiro que usar consegue)
  if (plano.conviteId && !plano.vinculado) {
    const v = await db('update financeiro.convites set cpf_cnpj_vinculado = $2 where id = $1 and cpf_cnpj_vinculado is null returning id', [plano.conviteId, d.doc]);
    if (!v.length) throw Object.assign(new Error('convite_de_outro_cliente'), { status: 409 });
  }

  // 2) Cliente no Asaas (sem duplicar)
  if (!cliente.asaas_customer_id) {
    const achados = await asaas<any>('GET', `/customers?cpfCnpj=${d.doc}&limit=1`);
    let cus = achados?.data?.[0];
    const payload = {
      name: d.nome, cpfCnpj: d.doc, email: d.email, mobilePhone: d.celular,
      phone: d.telefone || undefined, postalCode: d.cep, address: d.endereco,
      addressNumber: d.numero, complement: d.complemento || undefined, province: d.bairro,
      externalReference: cliente.id, groupName: GRUPO_ASAAS, notificationDisabled: true,
    };
    if (!cus) cus = await asaas<any>('POST', '/customers', payload);
    [cliente] = await db('update financeiro.clientes set asaas_customer_id = $2, updated_at = now() where id = $1 returning *', [cliente.id, cus.id]);
  }

  // 3) Assinatura (uma por cliente + plano/convite; reaproveita em nova tentativa)
  let ass: any = (
    await db(
      plano.conviteId
        ? "select * from financeiro.assinaturas where cliente_id = $1 and convite_id = $2 and status <> 'CANCELADA'"
        : "select * from financeiro.assinaturas where cliente_id = $1 and plano_slug = $2 and status <> 'CANCELADA'",
      [cliente.id, plano.conviteId ?? plano.planoSlug],
    )
  )[0];
  if (!ass) {
    [ass] = await db(
      `insert into financeiro.assinaturas
         (cliente_id, convite_id, plano_slug, plano_nome, valor, vencimento_dia, forma_pagamento)
       values ($1,$2,$3,$4,$5,$6,$7) returning *`,
      [cliente.id, plano.conviteId, plano.planoSlug, plano.planoNome, plano.valor, d.dia, d.forma],
    );
  }
  if (!ass.asaas_subscription_id) {
    // Se uma tentativa anterior criou no Asaas mas não gravou aqui, recupera pelo externalReference
    const ja = await asaas<any>('GET', `/subscriptions?externalReference=${ass.id}&limit=1`);
    let sub = ja?.data?.[0];
    if (!sub) {
      sub = await asaas<any>('POST', '/subscriptions', {
        customer: cliente.asaas_customer_id,
        billingType: ass.forma_pagamento,
        value: Number(ass.valor),
        nextDueDate: proximoVencimento(ass.vencimento_dia),
        cycle: 'MONTHLY',
        description: `Antum — ${ass.plano_nome}`,
        externalReference: ass.id,
        fine: { value: MULTA_FIXA, type: 'FIXED' },
      });
    }
    [ass] = await db(
      "update financeiro.assinaturas set asaas_subscription_id = $2, status = 'ATIVA', ultimo_erro = null, updated_at = now() where id = $1 returning *",
      [ass.id, sub.id],
    );
  }

  // 4) Primeira cobrança (link de pagamento)
  let pagamentoUrl: string | null = null;
  let vencimento: string | null = null;
  try {
    const pgs = await asaas<any>('GET', `/subscriptions/${ass.asaas_subscription_id}/payments?limit=10`);
    const p = (pgs?.data || []).sort((a: any, b: any) => String(a.dueDate).localeCompare(String(b.dueDate)))[0];
    if (p) { pagamentoUrl = p.invoiceUrl || p.bankSlipUrl || null; vencimento = p.dueDate; }
  } catch { /* cobrança ainda não materializada: o webhook completa depois */ }

  await db("update financeiro.clientes set status_cadastro = 'CONCLUIDO', ultimo_erro = null, updated_at = now() where id = $1", [cliente.id]);
  if (plano.conviteId) {
    await db('update financeiro.convites set concluido_em = now() where id = $1', [plano.conviteId]);
  }

  return {
    etapas: { cadastro: true, assinatura: true, cobranca: Boolean(pagamentoUrl) },
    pagamentoUrl, vencimento, plano: ass.plano_nome, valor: Number(ass.valor),
  };
}

// ---------- webhook -----------------------------------------------------------
const PAGOS = new Set(['RECEIVED', 'CONFIRMED', 'RECEIVED_IN_CASH']);

async function aplicarEventoPagamento(ev: any) {
  const p = ev.payment;
  if (!p?.id) return 'sem_pagamento';
  const quando = ev.dateCreated ? new Date(ev.dateCreated).toISOString() : new Date().toISOString();

  let assinaturaId: string | null = null;
  let clienteId: string | null = null;
  if (p.subscription) {
    const a = (await db('select id, cliente_id from financeiro.assinaturas where asaas_subscription_id = $1', [p.subscription]))[0];
    assinaturaId = a?.id ?? null; clienteId = a?.cliente_id ?? null;
  }
  if (!clienteId && p.customer) {
    const c = (await db('select id from financeiro.clientes where asaas_customer_id = $1', [p.customer]))[0];
    clienteId = c?.id ?? null;
  }
  const original = p.originalValue != null ? Number(p.originalValue) : null;
  const pago = PAGOS.has(String(p.status));
  const multa = pago && original != null ? Math.max(0, Math.round((Number(p.value) - original) * 100) / 100) : 0;

  // Upsert atômico: evento mais antigo que o já gravado NÃO sobrescreve (fora de ordem)
  const r = await db(
    `insert into financeiro.cobrancas
       (asaas_payment_id, assinatura_id, cliente_id, valor, valor_original, multa_aplicada, vencimento,
        status, forma_pagamento, invoice_url, boleto_url, pago_em, ultimo_evento_em)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     on conflict (asaas_payment_id) do update set
       assinatura_id = coalesce(excluded.assinatura_id, financeiro.cobrancas.assinatura_id),
       cliente_id = coalesce(excluded.cliente_id, financeiro.cobrancas.cliente_id),
       valor = excluded.valor, valor_original = excluded.valor_original,
       multa_aplicada = excluded.multa_aplicada, vencimento = excluded.vencimento,
       status = excluded.status, forma_pagamento = excluded.forma_pagamento,
       invoice_url = excluded.invoice_url, boleto_url = excluded.boleto_url,
       pago_em = excluded.pago_em, ultimo_evento_em = excluded.ultimo_evento_em, updated_at = now()
     where financeiro.cobrancas.ultimo_evento_em is null
        or financeiro.cobrancas.ultimo_evento_em <= excluded.ultimo_evento_em
     returning id`,
    [
      p.id, assinaturaId, clienteId, Number(p.value), original, multa, p.dueDate,
      String(p.status), p.billingType ?? null, p.invoiceUrl ?? null, p.bankSlipUrl ?? null,
      pago ? (p.confirmedDate || p.paymentDate || quando) : null, quando,
    ],
  );
  return r.length ? 'aplicado' : 'ignorado_fora_de_ordem';
}

// ---------- rotas -------------------------------------------------------------
export function registrarFinanceiro(app: Express) {
  const naoConfigurado = (_req: Request, res: Response, next: NextFunction) =>
    configurado() ? next() : res.status(503).json({ error: 'financeiro_nao_configurado' });

  // Dados do plano para montar a página (público ou por convite)
  app.get('/api/cadastro/plano', naoConfigurado, async (req, res) => {
    try {
      if (!limite(`plano:${ipDe(req)}`, 60, 10 * 60_000)) return res.status(429).json({ error: 'muitas_requisicoes' });
      const token = typeof req.query.token === 'string' ? req.query.token : undefined;
      const p = await resolverPlano(token);
      if ('erro' in p) return res.status(p.status).json({ error: p.erro });
      res.json({
        plano: p.planoNome, valor: p.valor, diasPermitidos: p.diasPermitidos,
        porConvite: Boolean(token), nomeRef: p.nomeRef ?? null, emailRef: p.emailRef ?? null,
        multaFixa: MULTA_FIXA, contratoVersao: CONTRATO_VERSAO,
      });
    } catch (e) {
      console.error('[fin/plano]', (e as Error).message);
      res.status(500).json({ error: 'erro_interno' });
    }
  });

  app.post('/api/cadastro', naoConfigurado, async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (!origemOk(req)) return res.status(403).json({ error: 'origem_invalida' });
    const b = req.body || {};
    if (b.website) return res.json({ ok: true }); // honeypot
    if (!limite(`cad:${ipDe(req)}`, 8, 10 * 60_000) || !limite('cad:global', 300, 3_600_000)) {
      return res.status(429).json({ error: 'muitas_requisicoes' });
    }
    try {
      const plano = await resolverPlano(typeof b.token === 'string' ? b.token : undefined);
      if ('erro' in plano) return res.status(plano.status).json({ error: plano.erro });
      const { erros, dados } = validar(b, plano);
      if (Object.keys(erros).length) return res.status(400).json({ error: 'dados_invalidos', campos: erros });
      const r = await processarCadastro(req, plano, dados);
      return res.json({ ok: true, ...r });
    } catch (e: any) {
      const msg = String(e?.message || e);
      console.error('[fin/cadastro]', msg.slice(0, 300)); // sem dados pessoais no log
      if (e?.status) return res.status(e.status).json({ error: msg });
      // Cadastro NÃO concluído: o cliente pode tentar de novo sem duplicar nada
      return res.status(502).json({ error: 'nao_concluido', mensagem: 'Não foi possível concluir agora. Tente novamente em instantes.' });
    }
  });

  // Webhook oficial do Asaas: autentica, grava o evento (idempotente), responde 200 e processa
  app.post('/api/asaas/webhook', naoConfigurado, async (req, res) => {
    const t = WEBHOOK_TOKEN();
    const h = (req.headers['asaas-access-token'] || '').toString();
    if (!t || t.length < 32 || !h || !igual(h, t)) return res.status(401).json({ error: 'nao_autorizado' });
    const ev = req.body || {};
    if (!ev.id || !ev.event) return res.status(400).json({ error: 'evento_invalido' });
    try {
      const r = await db(
        'insert into financeiro.eventos (asaas_event_id, evento, payload) values ($1,$2,$3) on conflict (asaas_event_id) do nothing returning asaas_event_id',
        [String(ev.id), String(ev.event), JSON.stringify(ev)],
      );
      res.status(200).json({ received: true });
      if (!r.length) return; // já recebido antes
      let resultado = 'sem_acao';
      try {
        if (String(ev.event).startsWith('PAYMENT_')) resultado = await aplicarEventoPagamento(ev);
      } catch (e) {
        resultado = `erro: ${String((e as Error).message).slice(0, 200)}`;
      }
      await db('update financeiro.eventos set processado_em = now(), resultado = $2 where asaas_event_id = $1', [String(ev.id), resultado]);
    } catch (e) {
      console.error('[fin/webhook]', (e as Error).message);
      if (!res.headersSent) res.status(500).json({ error: 'erro_interno' });
    }
  });

  // ----- Admin (Bearer FIN_ADMIN_TOKEN) -----
  app.post('/api/admin/convites', naoConfigurado, exigeAdmin, async (req, res) => {
    try {
      const b = req.body || {};
      const valor = Number(b.valor);
      const dia = parseInt(String(b.vencimentoDia), 10);
      const nome = str(b.planoNome, 120);
      if (!nome || !(valor > 0) || !(dia >= 1 && dia <= 28)) return res.status(400).json({ error: 'dados_invalidos' });
      const token = crypto.randomBytes(32).toString('base64url');
      const dias = Math.min(Math.max(parseInt(String(b.expiraDias ?? 7), 10) || 7, 1), 30);
      const [c] = await db(
        `insert into financeiro.convites (token_hash, plano_nome, valor, vencimento_dia, nome_ref, email_ref, expira_em)
         values ($1,$2,$3,$4,$5,$6, now() + ($7 || ' days')::interval) returning id, expira_em`,
        [sha256(token), nome, valor, dia, str(b.nomeRef, 120) || null, str(b.emailRef, 150) || null, String(dias)],
      );
      res.json({ id: c.id, link: `${SITE_URL()}/cadastro/${token}`, expiraEm: c.expira_em });
    } catch (e) {
      console.error('[fin/convite]', (e as Error).message);
      res.status(500).json({ error: 'erro_interno' });
    }
  });

  app.get('/api/admin/financeiro', naoConfigurado, exigeAdmin, async (_req, res) => {
    try {
      const [clientes, assinaturas, cobrancas, eventos] = await Promise.all([
        db('select id, nome, tipo, email, status_cadastro, asaas_customer_id, ultimo_erro, created_at from financeiro.clientes order by created_at desc limit 200'),
        db('select * from financeiro.assinaturas order by created_at desc limit 200'),
        db('select * from financeiro.cobrancas order by vencimento desc limit 300'),
        db('select asaas_event_id, evento, recebido_em, processado_em, resultado from financeiro.eventos order by recebido_em desc limit 100'),
      ]);
      res.json({ clientes, assinaturas, cobrancas, eventos, asaasBase: ASAAS_BASE().includes('sandbox') ? 'sandbox' : 'producao' });
    } catch (e) {
      console.error('[fin/admin]', (e as Error).message);
      res.status(500).json({ error: 'erro_interno' });
    }
  });
}
