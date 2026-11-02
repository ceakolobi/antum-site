// Login do administrador da Antum: e-mail + senha, sessão em cookie HttpOnly, bloqueio por tentativas
// e trilha de auditoria. Nada de segredo no frontend e nenhuma senha em texto puro em lugar algum.
import crypto from 'crypto';
import type { Express, Request, Response, NextFunction } from 'express';

export interface Ajudantes {
  db: <T = any>(text: string, params?: unknown[]) => Promise<T[]>;
  str: (s: unknown, max?: number) => string;
  sha256: (s: string) => string;
  limite: (key: string, max: number, janelaMs: number) => boolean;
  ipDe: (req: Request) => string;
  origemOk: (req: Request) => boolean;
  naoConfigurado: (req: Request, res: Response, next: NextFunction) => void;
}

const COOKIE = 'antum_admin';
const SESSAO_HORAS = 8;
const MAX_FALHAS = 5;
const BLOQUEIO_MIN = 15;
const SCRYPT = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

const scrypt = (senha: string, salt: Buffer, len = 64) =>
  new Promise<Buffer>((ok, erro) =>
    crypto.scrypt(senha.normalize('NFKC'), salt, len, SCRYPT, (e, k) => (e ? erro(e) : ok(k))),
  );

export async function hashSenha(senha: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const k = await scrypt(senha, salt);
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('hex')}$${k.toString('hex')}`;
}

async function conferirSenha(senha: string, guardado: string): Promise<boolean> {
  const p = guardado.split('$');
  if (p.length !== 6 || p[0] !== 'scrypt') return false;
  const salt = Buffer.from(p[4], 'hex');
  const esperado = Buffer.from(p[5], 'hex');
  const k = await scrypt(senha, salt, esperado.length);
  return k.length === esperado.length && crypto.timingSafeEqual(k, esperado);
}

// Hash falso para gastar o mesmo tempo quando o e-mail não existe (evita descobrir e-mails pelo tempo)
const HASH_FALSO = `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${'00'.repeat(16)}$${'00'.repeat(64)}`;

function lerCookie(req: Request, nome: string): string {
  const h = req.headers.cookie || '';
  for (const parte of h.split(';')) {
    const i = parte.indexOf('=');
    if (i > 0 && parte.slice(0, i).trim() === nome) return decodeURIComponent(parte.slice(i + 1).trim());
  }
  return '';
}

const cookieSeguro = () => process.env.NODE_ENV === 'production' && process.env.FIN_COOKIE_INSECURE !== '1';

function escreverCookie(res: Response, valor: string, maxAgeS: number) {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE}=${encodeURIComponent(valor)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAgeS}${cookieSeguro() ? '; Secure' : ''}`,
  );
}

export function registrarAdminAuth(app: Express, h: Ajudantes) {
  const { db, str, sha256, limite, ipDe, origemOk, naoConfigurado } = h;

  async function auditar(email: string | null, acao: string, detalhe: unknown, ip: string) {
    try {
      await db('insert into financeiro.auditoria (admin_email, acao, detalhe, ip) values ($1,$2,$3::jsonb,$4)', [
        email, acao, JSON.stringify(detalhe ?? {}), ip,
      ]);
    } catch (e) {
      console.error('[fin/auditoria]', (e as Error).message);
    }
  }

  // Exige sessão válida. Em pedidos que alteram dados, exige também a origem correta (proteção CSRF).
  async function exigeAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const token = lerCookie(req, COOKIE);
      if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return res.status(401).json({ error: 'nao_autorizado' });
      const r = (
        await db(
          `select a.id, a.email from financeiro.admin_sessoes s join financeiro.admins a on a.id = s.admin_id
            where s.token_hash = $1 and s.expira_em > now() and a.ativo`,
          [sha256(token)],
        )
      )[0];
      if (!r) return res.status(401).json({ error: 'nao_autorizado' });
      const metodo = req.method.toUpperCase();
      if (metodo !== 'GET' && metodo !== 'HEAD' && !origemOk(req)) return res.status(403).json({ error: 'origem_invalida' });
      res.locals.admin = { id: r.id, email: r.email };
      next();
    } catch (e) {
      console.error('[fin/admin/sessao]', (e as Error).message);
      res.status(500).json({ error: 'erro_interno' });
    }
  }

  app.post('/api/admin/login', naoConfigurado, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    if (!origemOk(req)) return res.status(403).json({ error: 'origem_invalida' });
    const ip = ipDe(req);
    if (!limite(`adlogin:${ip}`, 10, 10 * 60_000) || !limite('adlogin:global', 100, 60 * 60_000)) {
      return res.status(429).json({ error: 'muitas_tentativas' });
    }
    const email = str(req.body?.email, 150).toLowerCase();
    const senha = typeof req.body?.senha === 'string' ? req.body.senha.slice(0, 200) : '';
    const falha = () => res.status(401).json({ error: 'credenciais_invalidas' });
    try {
      const a = email ? (await db('select * from financeiro.admins where email = $1', [email]))[0] : undefined;
      const bloqueado = a?.bloqueado_ate && new Date(a.bloqueado_ate) > new Date();
      const ok = await conferirSenha(senha, a?.senha_hash || HASH_FALSO);
      if (!a || !a.ativo || bloqueado || !ok) {
        if (a && !bloqueado) {
          const falhas = Number(a.falhas) + 1;
          if (falhas >= MAX_FALHAS) {
            await db("update financeiro.admins set falhas = 0, bloqueado_ate = now() + ($2 || ' minutes')::interval where id = $1", [a.id, String(BLOQUEIO_MIN)]);
            await auditar(email, 'login_bloqueado', { motivo: 'tentativas_excedidas' }, ip);
          } else {
            await db('update financeiro.admins set falhas = $2 where id = $1', [a.id, falhas]);
          }
        }
        await auditar(email || null, 'login_falhou', {}, ip);
        return bloqueado ? res.status(429).json({ error: 'conta_bloqueada_temporariamente' }) : falha();
      }
      const token = crypto.randomBytes(32).toString('base64url');
      await db('delete from financeiro.admin_sessoes where admin_id = $1 and expira_em < now()', [a.id]);
      await db(
        "insert into financeiro.admin_sessoes (admin_id, token_hash, expira_em, ip, user_agent) values ($1,$2, now() + ($3 || ' hours')::interval, $4, $5)",
        [a.id, sha256(token), String(SESSAO_HORAS), ip, str(req.headers['user-agent'], 300)],
      );
      await db('update financeiro.admins set falhas = 0, bloqueado_ate = null, ultimo_login_em = now() where id = $1', [a.id]);
      await auditar(email, 'login', {}, ip);
      escreverCookie(res, token, SESSAO_HORAS * 3600);
      res.json({ ok: true, email });
    } catch (e) {
      console.error('[fin/admin/login]', (e as Error).message);
      res.status(500).json({ error: 'erro_interno' });
    }
  });

  app.post('/api/admin/logout', naoConfigurado, async (req, res) => {
    if (!origemOk(req)) return res.status(403).json({ error: 'origem_invalida' });
    try {
      const token = lerCookie(req, COOKIE);
      if (/^[A-Za-z0-9_-]{43}$/.test(token)) await db('delete from financeiro.admin_sessoes where token_hash = $1', [sha256(token)]);
    } catch { /* sai mesmo assim */ }
    escreverCookie(res, '', 0);
    res.json({ ok: true });
  });

  app.get('/api/admin/me', naoConfigurado, exigeAdmin, (_req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json({ email: res.locals.admin.email });
  });

  return { exigeAdmin, auditar };
}
