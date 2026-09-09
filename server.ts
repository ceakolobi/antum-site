import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Lazy-initialized Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAIClient;
}

// Modelos candidatos, em ordem de preferencia. Se um estiver indisponivel
// (aposentado, sem permissao na chave, etc) cai automaticamente pro proximo.
const MODEL_CANDIDATES = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-flash-latest',
  'gemini-2.5-flash-lite',
];

// Diagnostico da ultima chamada (sem expor segredos)
let lastDiag: {
  at: string | null;
  workingModel: string | null;
  lastError: string | null;
  triedModels: string[];
} = { at: null, workingModel: null, lastError: null, triedModels: [] };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', studio: 'ANTUM AI & Automation' });
});

// Diagnostico do chat (sem vazar a chave)
app.get('/api/diag', (req, res) => {
  const key = process.env.GEMINI_API_KEY || '';
  res.json({
    hasGeminiKey: key.length > 0,
    keyLength: key.length,
    candidates: MODEL_CANDIDATES,
    lastCall: lastDiag,
    nodeEnv: process.env.NODE_ENV || null,
  });
});

// Lead capture endpoint
const leadsDatabase: Array<{
  id: string;
  name?: string;
  company?: string;
  contact?: string;
  challenge?: string;
  solutionOfInterest?: string;
  createdAt: string;
}> = [];

app.post('/api/lead', (req, res) => {
  const { name, company, contact, challenge, solutionOfInterest } = req.body || {};
  const leadRecord = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name || 'Lead anônimo',
    company: company || 'Empresa não informada',
    contact: contact || 'Sem contato',
    challenge: challenge || 'Geral',
    solutionOfInterest: solutionOfInterest || 'Não especificada',
    createdAt: new Date().toISOString(),
  };
  leadsDatabase.push(leadRecord);
  res.json({ success: true, leadId: leadRecord.id, message: 'Solicitação registrada com sucesso.' });
});

const SYSTEM_INSTRUCTION = `Você é a Marina, assistente de vendas da Antum.

COMO VOCÊ AGE:
- Responde em no máximo 2-3 linhas por mensagem.
- Fala como pessoa, não como bot. Sem bullet points, sem emojis em excesso.
- Primeiro entende o problema do cliente. Só depois oferece solução.
- Pergunta o essencial pra entender o que ele precisa — uma pergunta por vez.
- Quando entender a dor, vai direto à melhor solução pra aquele caso específico.
- Nunca repete o que já foi dito. Nunca enrola.

COMO VOCÊ VENDE:
- Não empurra produto. Conecta o produto à dor real que o cliente acabou de contar.
- Antes de falar preço, mostra o valor.
- Se houver objeção, valida com empatia, pergunta e redireciona — nunca discute.
- O próximo passo é convidar pra conversa com a equipe: https://antum.com.br

O QUE VOCÊ NUNCA FAZ:
- Mandar textão. Máximo 3 linhas por mensagem.
- Listar features sem antes entender o que o cliente precisa.
- Fingir que não é IA — se perguntarem, confirma que é assistente de IA da Antum.

IDENTIDADE: Marina, assistente da Antum — AI & Automation Studio (https://antum.com.br)`;

type IncomingMessage = { sender?: string; role?: string; text?: string; content?: string };

// Converte o historico do front no formato do Gemini.
// A API exige que o PRIMEIRO item tenha role 'user' — as mensagens de abertura
// da Marina sao descartadas do inicio do historico.
function buildContents(messages: IncomingMessage[]) {
  const mapped = (messages || [])
    .map((m) => {
      const text = (m.text ?? m.content ?? '').trim();
      const isUser = m.sender === 'user' || m.role === 'user';
      return { role: isUser ? 'user' : 'model', parts: [{ text }] };
    })
    .filter((m) => m.parts[0].text.length > 0);

  // remove qualquer bloco 'model' no inicio
  while (mapped.length > 0 && mapped[0].role === 'model') {
    mapped.shift();
  }
  return mapped;
}

function isModelUnavailable(err: unknown): boolean {
  const msg = String((err as { message?: string })?.message ?? err ?? '');
  return /404|NOT_FOUND|not found|is not supported|deprecated|PERMISSION_DENIED|403/i.test(msg);
}

function isTransient(err: unknown): boolean {
  const msg = String((err as { message?: string })?.message ?? err ?? '');
  return /429|500|502|503|504|UNAVAILABLE|overloaded|RESOURCE_EXHAUSTED|timeout|ECONN/i.test(msg);
}

// Marina SDR AI Chat endpoint
app.post('/api/chat-marina', async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const { messages } = req.body || {};
  const lastUserMessage =
    messages && messages.length > 0
      ? messages[messages.length - 1].text || messages[messages.length - 1].content || ''
      : '';

  const ai = getGenAI();

  if (ai) {
    const contents = buildContents(messages);
    const tried: string[] = [];
    let lastErr: unknown = null;

    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: lastUserMessage || 'Olá' }] });
    }

    for (const model of MODEL_CANDIDATES) {
      tried.push(model);
      // ate 3 tentativas por modelo, so pra erros transitorios (503/429)
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
            config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.7 },
          });

          const replyText =
            (response?.text || '').trim() ||
            'Entendi seu ponto. Como sua equipe lida com esse fluxo atualmente?';

          lastDiag = {
            at: new Date().toISOString(),
            workingModel: model,
            lastError: null,
            triedModels: tried,
          };
          return res.json({ reply: replyText, model });
        } catch (err: unknown) {
          lastErr = err;
          if (isModelUnavailable(err)) break; // modelo nao serve — proximo candidato
          if (!isTransient(err)) break; // erro real (payload, chave) — proximo candidato
          if (attempt === 2) break;
          await sleep(1200 * (attempt + 1));
        }
      }
    }

    // Todos os modelos falharam — registra e cai no motor de regras (200, nao 500)
    lastDiag = {
      at: new Date().toISOString(),
      workingModel: null,
      lastError: String((lastErr as { message?: string })?.message ?? lastErr ?? 'erro desconhecido').slice(0, 400),
      triedModels: tried,
    };
    console.error('[chat-marina] todos os modelos falharam:', lastDiag.lastError);
  } else {
    lastDiag = {
      at: new Date().toISOString(),
      workingModel: null,
      lastError: 'GEMINI_API_KEY ausente no ambiente',
      triedModels: [],
    };
  }

  // Motor SDR de regras (fallback) — responde util mesmo sem IA
  const lower = (lastUserMessage || '').toLowerCase();
  let fallbackReply: string;

  if (/\b(ol[áa]|oi|bom dia|boa tarde|boa noite)\b/.test(lower)) {
    fallbackReply =
      'Olá! Sou a Marina, assistente de IA da Antum. Me conta rapidinho: qual processo hoje mais consome tempo da sua equipe?';
  } else if (/(lead|venda|sdr|comercial|prospec|whatsapp|atendimento)/.test(lower)) {
    fallbackReply =
      'Um agente de IA qualifica seus leads no WhatsApp em segundos e entrega a oportunidade pronta pro vendedor. Hoje quem faz esse primeiro atendimento aí?';
  } else if (/(rpa|repetit|manual|planilha|tempo|processo)/.test(lower)) {
    fallbackReply =
      'Rotinas manuais tipo digitação, conciliação em ERP e cópia de planilha são o caso perfeito pra automação. Quantas horas por semana isso toma da equipe?';
  } else if (/(pre[çc]o|quanto custa|valor|or[çc]amento|plano)/.test(lower)) {
    fallbackReply =
      'Depende do fluxo e das integrações, então prefiro te passar um número real e não um chute. Me diz o que você quer automatizar primeiro?';
  } else if (/(integra|sistema|api|erp|crm)/.test(lower)) {
    fallbackReply =
      'A gente conecta a IA nos sistemas que você já usa: CRM, ERP, banco de dados, WhatsApp e APIs legadas, sem trocar seu stack. Quais ferramentas você quer integrar?';
  } else {
    fallbackReply =
      'Entendi. Esse é exatamente o tipo de rotina que a gente transforma em sistema que roda sozinho. Me conta um pouco mais de como funciona hoje?';
  }

  return res.json({ reply: fallbackReply, model: 'fallback' });
});

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
