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
