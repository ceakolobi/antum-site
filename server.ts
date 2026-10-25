import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));

// Cabeçalhos de segurança em todo o site (a CSP estrita fica só na landing /marina-sdr)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', studio: 'ANTUM AI & Automation' });
});

// Diagnostico do chat
app.get('/api/diag', (req, res) => {
  res.json({
    mode: 'rule-based-sdr',
    lastLead,
    nodeEnv: process.env.NODE_ENV || null,
  });
});

// --- Captura de lead ---------------------------------------------------------
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://vlqfwdpgdqusugwebfwx.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || 'sb_publishable_G9JhPOfn-rPV93AgBFM0ig_UNvAXiMf';

let lastLead: { at: string | null; stored: boolean; error: string | null } = {
  at: null,
  stored: false,
  error: null,
};

app.post('/api/lead', async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const { name, company, contact, challenge, solutionOfInterest } = req.body || {};
  const lead = {
    p_name: name || null,
    p_company: company || null,
    p_contact: contact || null,
    p_challenge: challenge || null,
    p_solution_of_interest: solutionOfInterest || null,
    p_user_agent: (req.headers['user-agent'] || '').toString().slice(0, 300) || null,
  };

  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_site_lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(lead),
    });

    if (!r.ok) {
      const detail = await r.text();
      throw new Error(`Supabase ${r.status}: ${detail.slice(0, 300)}`);
    }

    const newId = (await r.json()) as string | null;
    lastLead = { at: new Date().toISOString(), stored: true, error: null };
    return res.json({
      success: true,
      leadId: newId,
      message: 'Solicitação registrada com sucesso.',
    });
  } catch (err: unknown) {
    const message = String((err as { message?: string })?.message ?? err);
    lastLead = { at: new Date().toISOString(), stored: false, error: message.slice(0, 400) };
    console.error('[LEAD NAO GRAVADO NO BANCO]', message, JSON.stringify(lead));
    return res.json({ success: true, leadId: null, message: 'Solicitação registrada com sucesso.' });
  }
});

// --- Marina SDR — motor de regras -------------------------------------------
// Responde de forma útil sem depender de nenhuma chave de API externa.
// Para plugar um LLM no futuro: adicionar a lógica aqui antes do fallback.

app.post('/api/chat-marina', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const { messages } = req.body || {};
  const lastUserMessage: string =
    messages && messages.length > 0
      ? (messages[messages.length - 1].text || messages[messages.length - 1].content || '').trim()
      : '';

  const lower = lastUserMessage.toLowerCase();
  let reply: string;

  if (/\b(ol[áa]|oi|bom dia|boa tarde|boa noite)\b/.test(lower)) {
    reply =
      'Olá! Sou a Marina, assistente de IA da Antum. Me conta rapidinho: qual processo hoje mais consome tempo da sua equipe?';
  } else if (/(lead|venda|sdr|comercial|prospec|whatsapp|atendimento)/.test(lower)) {
    reply =
      'Um agente de IA qualifica seus leads no WhatsApp em segundos e entrega a oportunidade pronta pro vendedor. Hoje quem faz esse primeiro atendimento aí?';
  } else if (/(rpa|repetit|manual|planilha|tempo|processo)/.test(lower)) {
    reply =
      'Rotinas manuais tipo digitação, conciliação em ERP e cópia de planilha são o caso perfeito pra automação. Quantas horas por semana isso toma da equipe?';
  } else if (/(pre[çc]o|quanto custa|valor|or[çc]amento|plano)/.test(lower)) {
    reply =
      'Depende do fluxo e das integrações, então prefiro te passar um número real. Me diz o que você quer automatizar primeiro?';
  } else if (/(integra|sistema|api|erp|crm)/.test(lower)) {
    reply =
      'A gente conecta a IA nos sistemas que você já usa: CRM, ERP, banco de dados, WhatsApp e APIs legadas, sem trocar seu stack. Quais ferramentas você quer integrar?';
  } else if (/(site|loja|landing|página)/.test(lower)) {
    reply =
      'A Antum cria e hospeda o site da sua empresa por R$ 70/mês — inclui 1 atualização por semana e fica pronto em até 7 dias. Qual é o ramo da empresa?';
  } else {
    reply =
      'Entendi. Esse é exatamente o tipo de rotina que a gente transforma em sistema que roda sozinho. Me conta um pouco mais de como funciona hoje?';
  }

  return res.json({ reply, model: 'sdr-rules' });
});

// --- Landing Marina SDR: cadastro do teste grátis ---------------------------
const ALLOWED_ORIGINS = new Set([
  'https://antum.com.br',
  'https://www.antum.com.br',
  'https://marinasuasdr.antum.com.br',
  ...(process.env.EXTRA_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean),
  ...(process.env.NODE_ENV !== 'production'
    ? ['http://localhost:3000', 'http://localhost:4173', 'http://127.0.0.1:3000', 'http://127.0.0.1:4173']
    : []),
]);

const ipHits = new Map<string, number[]>();
let globalHits: number[] = [];
const recentPhones = new Map<string, number>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const WINDOW = 10 * 60 * 1000;
  const mine = (ipHits.get(ip) || []).filter((t) => now - t < WINDOW);
  globalHits = globalHits.filter((t) => now - t < 60 * 60 * 1000);
  if (mine.length >= 5 || globalHits.length >= 200) {
    ipHits.set(ip, mine);
    return true;
  }
  mine.push(now);
  globalHits.push(now);
  ipHits.set(ip, mine);
  if (ipHits.size > 5000) ipHits.clear();
  return false;
}

function clean(v: unknown, max: number): string {
  return typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '';
}

app.post('/api/marina-trial', async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  const origin = req.headers.origin;
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return res.status(403).json({ ok: false, error: 'origin' });
  }
  if (!req.is('application/json')) {
    return res.status(415).json({ ok: false, error: 'content-type' });
  }

  const ip = (req.headers['cf-connecting-ip'] as string) || req.ip || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'rate' });
  }

  const b = (req.body || {}) as Record<string, unknown>;

  // Isca anti-robô: campo "website" preenchido => finge sucesso e não grava
  if (clean(b.website, 200)) {
    return res.json({ ok: true });
  }

  const name = clean(b.name, 100);
  const email = clean(b.email, 150).toLowerCase();
  const company = clean(b.company, 100);
  const phone = clean(b.whatsapp, 20).replace(/\D/g, '');

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = 'Escreva seu nome.';
  const okPhone =
    (phone.length === 10 || phone.length === 11) &&
    /^[1-9][1-9]/.test(phone) &&
    (phone.length === 10 || phone.charAt(2) === '9');
  if (!okPhone) errors.whatsapp = 'Digite o WhatsApp com DDD, por exemplo (47) 99999-9999.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Digite um e-mail válido.';
  if (b.consent !== true) errors.consent = 'Marque a caixa para continuar.';
  if (Object.keys(errors).length) {
    return res.status(400).json({ ok: false, errors });
  }

  // Duplicado recente (mesmo WhatsApp em 24h): responde ok sem gravar de novo
  const now = Date.now();
  const seen = recentPhones.get(phone);
  if (seen && now - seen < 24 * 3600 * 1000) {
    return res.json({ ok: true });
  }

  // marina_trials bloqueia INSERT anônimo (RLS), então gravamos pela função submit_site_lead,
  // a mesma do formulário de contato. UTM fica no Pixel/GA4.
  const utm = (b.utm && typeof b.utm === 'object' ? b.utm : {}) as Record<string, unknown>;
  const camp = clean(utm.utm_campaign, 40).replace(/[^\w.-]/g, '');
  const insert = () =>
    fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_site_lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        p_name: name,
        p_company: company || null,
        p_contact: `${phone} | ${email}`,
        p_challenge: `Teste 7 dias gratis (landing /marina-sdr)${camp ? ` | campanha: ${camp}` : ''}`,
        p_solution_of_interest: 'Marina SDR - teste 7 dias gratis',
        p_user_agent: (req.headers['user-agent'] || '').toString().slice(0, 300) || null,
      }),
      signal: AbortSignal.timeout(10000),
    });

  try {
    const r = await insert();
    if (!r.ok) {
      const detail = await r.text();
      throw new Error(`Supabase ${r.status}: ${detail.slice(0, 200)}`);
    }
    recentPhones.set(phone, now);
    if (recentPhones.size > 5000) recentPhones.clear();
    return res.json({ ok: true });
  } catch (err: unknown) {
    // Erro NÃO é engolido: o visitante vê a falha e pode tentar de novo.
    console.error('[MARINA-TRIAL NAO GRAVADO]', String((err as { message?: string })?.message ?? err).slice(0, 300));
    return res.status(502).json({ ok: false, error: 'storage' });
  }
});

// --- Landing Marina SDR: página estática com CSP estrita ---------------------
const MARINA_CSP = [
  "default-src 'self'",
  "script-src 'self' https://connect.facebook.net https://www.googletagmanager.com",
  "style-src 'self'",
  "img-src 'self' data: https://www.facebook.com https://www.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self'",
  "connect-src 'self' https://www.facebook.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  "media-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const marinaDir = () =>
  path.join(process.cwd(), process.env.NODE_ENV === 'production' ? 'dist' : 'public', 'marina-sdr');

app.get(['/marina-sdr', '/marina-sdr/'], (req, res) => {
  res.setHeader('Content-Security-Policy', MARINA_CSP);
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.sendFile(path.join(marinaDir(), 'index.html'));
});

app.get('/marina-sdr/index.html', (req, res) => res.redirect(301, '/marina-sdr'));
app.get('/marina-teste', (req, res) => res.redirect(301, '/marina-sdr'));

// Ativos da landing (fontes/imagens com cache longo; css/js com revalidação curta)
app.use(
  '/marina-sdr',
  express.static(marinaDir(), {
    index: false,
    redirect: false,
    setHeaders: (res, filePath) => {
      res.setHeader(
        'Cache-Control',
        /\.(woff2|webp|png)$/.test(filePath) ? 'public, max-age=2592000' : 'public, max-age=300',
      );
    },
  }),
);

// Arquivo inexistente dentro de /marina-sdr: 404 de verdade (sem cair no fallback do SPA)
app.use('/marina-sdr', (req, res) => res.status(404).type('text/plain').send('Not found'));

// Vite / Static setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ANTUM Studio] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
