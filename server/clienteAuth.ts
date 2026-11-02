// Área do cliente: login por e-mail + senha (primeiro acesso e "esqueci" por link no e-mail), sessão em cookie
// HttpOnly, bloqueio por tentativas. O cliente só enxerga os próprios dados. Nenhuma senha em texto puro.
import crypto from 'crypto';
import type { Express, Request, Response, NextFunction } from 'express';
import { hashSenha, conferirSenha, HASH_FALSO, lerCookie, cookieSeguro, type Ajudantes } from './adminAuth';

const COOKIE = 'antum_cliente';
const SESSAO_HORAS = 12;
const MAX_FALHAS = 5;
const BLOQUEIO_MIN = 15;
const TOKEN_DEFINIR_H = 24 * 7;
const TOKEN_RESET_H = 1;

export interface ExtrasCliente {
  sincronizar: (clienteId: string) => Promise<void>;
  enviarLink: (cliente: { id: string; nome: string; email: string }, tipo: 'definir' | 'reset', token: string) => Promise<void>;
}

const senhaForte = (s: string) => s.length >= 10 && s.length <= 100 && /[A-Za-z]/.test(s) && /\d/.test(s);

function escreverCookie(res: Response, valor: string, maxAgeS: number) {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE}=${encodeURIComponent(valor)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAgeS}${cookieSeguro() ? '; Secure' : ''}`,
  );
}

export function registrarAreaCliente(app: Express, h: Ajudantes, x: ExtrasCliente) {
  const { db, str, sha256, limite, ipDe, origemOk, naoConfigurado } = h;

  // Gera um link de senha (e garante o registro de acesso). Devolve null se o e-mail não é de cliente.
  async function emitirLink(email: string, tipo: 'definir' | 'reset'): Promise<{ id: string; nome: string; email: string; token: string } | null> {
    const c = (await db('select id, nome, email from financeiro.clientes where lower(email) = $1 order by created_at desc limit 1', [email]))[0];
    if (!c) return null;
    await db(
      'insert into financeiro.cliente_acessos (cliente_id, email) values ($1,$2) on conflict (cliente_id) do nothing',
      [c.id, email],
    ).catch(() => undefined); // e-mail já usado por outro cadastro: segue sem criar
    const ac = (await db('select cliente_id from financeiro.cliente_acessos where cliente_id = $1', [c.id]))[0];
    if (!ac) return null;
    const token = crypto.randomBytes(32).toString('base64url');
    // links antigos do mesmo cliente deixam de valer
    await db("update financeiro.cliente_tokens set usado_em = now() where cliente_id = $1 and usado_em is null", [c.id]);
    await db(
      "insert into financeiro.cliente_tokens (cliente_id, tipo, token_hash, expira_em) values ($1,$2,$3, now() + ($4 || ' hours')::interval)",
      [c.id, tipo, sha256(token), String(tipo === 'definir' ? TOKEN_DEFINIR_H : TOKEN_RESET_H)],
    );
    return { id: c.id, nome: c.nome, email: c.email, token };
  }

  async function exigeCliente(req: Request, res: Response, next: NextFunction) {
    try {
      const token = lerCookie(req, COOKIE);
      if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return res.status(401).json({ error: 'nao_autorizado' });
      const r = (
        await db(
          `select c.id, c.nome, c.email from financeiro.cliente_sessoes s join financeiro.clientes c on c.id = s.cliente_id
            where s.token_hash = $1 and s.expira_em > now()`,
          [sha256(token)],
        )
      )[0];
      if (!r) return res.status(401).json({ error: 'nao_autorizado' });
      const m = req.method.toUpperCase();
      if (m !== 'GET' && m !== 'HEAD' && !origemOk(req)) return res.status(403).json({ error: 'origem_invalida' });
      res.locals.cliente = r;
      next();
    } catch (e) {
      console.error('[fin/cliente/sessao]', (e as Error).message);
      res.status(500).json({ error: 'erro_interno' });
    }
  }

  app.post('/api/cliente/login', naoConfigurado, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    if (!origemOk(req)) return res.status(403).json({ error: 'origem_invalida' });
    const ip = ipDe(req);
    if (!limite(`clogin:${ip}`, 10, 10 * 60_000) || !limite('clogin:global', 200, 60 * 60_000)) {
      return res.status(429).json({ error: 'muitas_tentativas' });
    }
    const email = str(req.body?.email, 150).toLowerCase();
    const senha = typeof req.body?.senha === 'string' ? req.body.senha.slice(0, 200) : '';
    try {
      const a = email ? (await db('select * from financeiro.cliente_acessos where email = $1', [email]))[0] : undefined;
      const bloqueado = a?.bloqueado_ate && new Date(a.bloqueado_ate) > new Date();
      const ok = await conferirSenha(senha, a?.senha_hash || HASH_FALSO);
      if (!a || !a.senha_hash || bloqueado || !ok) {
        if (a && !bloqueado) {
          const falhas = Number(a.falhas) + 1;
          if (falhas >= MAX_FALHAS) {
            await db("update financeiro.cliente_acessos set falhas = 0, bloqueado_ate = now() + ($2 || ' minutes')::interval where cliente_id = $1", [a.cliente_id, String(BLOQUEIO_MIN)]);
          } else {
            await db('update financeiro.cliente_acessos set falhas = $2 where cliente_id = $1', [a.cliente_id, falhas]);
          }
        }
        return bloqueado ? res.status(429).json({ error: 'conta_bloqueada_temporariamente' }) : res.status(401).json({ error: 'credenciais_invalidas' });
      }
      const token = crypto.randomBytes(32).toString('base64url');
      await db('delete from financeiro.cliente_sessoes where cliente_id = $1 and expira_em < now()', [a.cliente_id]);
      await db(
        "insert into financeiro.cliente_sessoes (cliente_id, token_hash, expira_em, ip, user_agent) values ($1,$2, now() + ($3 || ' hours')::interval, $4, $5)",
        [a.cliente_id, sha256(token), String(SESSAO_HORAS), ip, str(req.headers['user-agent'], 300)],
      );
      await db('update financeiro.cliente_acessos set falhas = 0, bloqueado_ate = null, ultimo_login_em = now() where cliente_id = $1', [a.cliente_id]);
      escreverCookie(res, token, SESSAO_HORAS * 3600);
      res.json({ ok: true });
    } catch (e) {
      console.error('[fin/cliente/login]', (e as Error).message);
      res.status(500).json({ error: 'erro_interno' });
    }
  });

  app.post('/api/cliente/logout', naoConfigurado, async (req, res) => {
    if (!origemOk(req)) return res.status(403).json({ error: 'origem_invalida' });
    try {
      const token = lerCookie(req, COOKIE);
      if (/^[A-Za-z0-9_-]{43}$/.test(token)) await db('delete from financeiro.cliente_sessoes where token_hash = $1', [sha256(token)]);
    } catch { /* sai mesmo assim */ }
    escreverCookie(res, '', 0);
    res.json({ ok: true });
  });

  // "Esqueci minha senha" e primeiro acesso: resposta sempre igual (não revela se o e-mail existe)
  app.post('/api/cliente/esqueci', naoConfigurado, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    if (!origemOk(req)) return res.status(403).json({ error: 'origem_invalida' });
    const ip = ipDe(req);
    const email = str(req.body?.email, 150).toLowerCase();
    if (!limite(`cesq:${ip}`, 5, 10 * 60_000) || !limite('cesq:global', 100, 60 * 60_000) || (email && !limite(`cesq:${email}`, 3, 60 * 60_000))) {
      return res.status(429).json({ error: 'muitas_tentativas' });
    }
    res.json({ ok: true });
    try {
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;
      const l = await emitirLink(email, 'reset');
      if (l) await x.enviarLink({ id: l.id, nome: l.nome, email: l.email }, 'reset', l.token);
    } catch (e) {
      console.error('[fin/cliente/esqueci]', String((e as Error).message).slice(0, 200));
    }
  });

  app.post('/api/cliente/definir-senha', naoConfigurado, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    if (!origemOk(req)) return res.status(403).json({ error: 'origem_invalida' });
    if (!limite(`cdef:${ipDe(req)}`, 10, 10 * 60_000)) return res.status(429).json({ error: 'muitas_tentativas' });
    const token = str(req.body?.token, 80);
    const senha = typeof req.body?.senha === 'string' ? req.body.senha : '';
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return res.status(400).json({ error: 'link_invalido' });
    if (!senhaForte(senha)) return res.status(400).json({ error: 'senha_fraca' });
    try {
      // consome o link de uma vez só (atômico): dois cliques ao mesmo tempo não passam os dois
      const t = (
        await db(
          'update financeiro.cliente_tokens set usado_em = now() where token_hash = $1 and usado_em is null and expira_em > now() returning cliente_id',
          [sha256(token)],
        )
      )[0];
      if (!t) return res.status(400).json({ error: 'link_invalido' });
      const hash = await hashSenha(senha);
      await db('update financeiro.cliente_acessos set senha_hash = $2, falhas = 0, bloqueado_ate = null where cliente_id = $1', [t.cliente_id, hash]);
      await db('delete from financeiro.cliente_sessoes where cliente_id = $1', [t.cliente_id]); // derruba sessões antigas
      res.json({ ok: true });
    } catch (e) {
      console.error('[fin/cliente/definir]', (e as Error).message);
      res.status(500).json({ error: 'erro_interno' });
    }
  });

  app.post('/api/cliente/trocar-senha', naoConfigurado, exigeCliente, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const atual = typeof req.body?.atual === 'string' ? req.body.atual.slice(0, 200) : '';
    const nova = typeof req.body?.nova === 'string' ? req.body.nova : '';
    if (!limite(`ctroca:${res.locals.cliente.id}`, 5, 10 * 60_000)) return res.status(429).json({ error: 'muitas_tentativas' });
    if (!senhaForte(nova)) return res.status(400).json({ error: 'senha_fraca' });
    try {
      const a = (await db('select senha_hash from financeiro.cliente_acessos where cliente_id = $1', [res.locals.cliente.id]))[0];
      if (!a?.senha_hash || !(await conferirSenha(atual, a.senha_hash))) return res.status(401).json({ error: 'senha_atual_incorreta' });
      await db('update financeiro.cliente_acessos set senha_hash = $2 where cliente_id = $1', [res.locals.cliente.id, await hashSenha(nova)]);
      res.json({ ok: true });
    } catch (e) {
      console.error('[fin/cliente/troca]', (e as Error).message);
      res.status(500).json({ error: 'erro_interno' });
    }
  });

  app.get('/api/cliente/painel', naoConfigurado, exigeCliente, async (_req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const c = res.locals.cliente;
    try {
      await x.sincronizar(c.id).catch(() => undefined); // traz do Asaas o que o webhook ainda não trouxe
      const [dados] = await db(
        'select nome, email, cpf_cnpj, celular, endereco, numero, complemento, bairro, cidade, uf, cep from financeiro.clientes where id = $1',
        [c.id],
      );
      const assinaturas = await db(
        `select a.id, a.plano_nome, a.valor, a.status, a.vencimento_dia, a.forma_pagamento, a.created_at, a.bloqueada,
                exists(select 1 from financeiro.contratos k where k.assinatura_id = a.id) as tem_contrato
           from financeiro.assinaturas a where a.cliente_id = $1 and a.status <> 'CANCELADA' order by a.created_at desc`,
        [c.id],
      );
      const cobrancas = await db(
        `select valor, vencimento, status, forma_pagamento, invoice_url, boleto_url, pago_em
           from financeiro.cobrancas where cliente_id = $1 order by vencimento desc limit 60`,
        [c.id],
      );
      res.json({ cliente: dados, assinaturas, cobrancas });
    } catch (e) {
      console.error('[fin/cliente/painel]', (e as Error).message);
      res.status(500).json({ error: 'erro_interno' });
    }
  });

  app.get('/api/cliente/contrato/:assinaturaId/pdf', naoConfigurado, exigeCliente, async (req, res) => {
    try {
      const idOk = /^[0-9a-f-]{36}$/i.test(String(req.params.assinaturaId));
      const [k] = idOk
        ? await db('select pdf from financeiro.contratos where assinatura_id = $1 and cliente_id = $2', [req.params.assinaturaId, res.locals.cliente.id])
        : [];
      if (!k?.pdf) return res.status(404).json({ error: 'contrato_nao_encontrado' });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="contrato-antum.pdf"');
      res.setHeader('Cache-Control', 'no-store');
      res.end(k.pdf);
    } catch (e) {
      console.error('[fin/cliente/contrato]', (e as Error).message);
      res.status(500).json({ error: 'erro_interno' });
    }
  });

  return { emitirLink, exigeCliente };
}
