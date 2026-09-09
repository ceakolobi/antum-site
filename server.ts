import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = process.cwd();

const app = express();
const PORT = 3000;

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', studio: 'ANTUM AI & Automation' });
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
    name: name || 'Lead Anônimo',
    company: company || 'Empresa não informada',
    contact: contact || 'Sem contato',
    challenge: challenge || 'Geral',
    solutionOfInterest: solutionOfInterest || 'Não especificada',
    createdAt: new Date().toISOString(),
  };
  leadsDatabase.push(leadRecord);
  res.json({ success: true, leadId: leadRecord.id, message: 'Solicitação registrada com sucesso.' });
});

// Marina SDR AI Chat endpoint
app.post('/api/chat-marina', async (req, res) => {
  try {
    const { messages, context } = req.body || {};
    const lastUserMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : '';

    const ai = getGenAI();

    // If Gemini key is available, use gemini-3.8-flash
    if (ai) {
      const systemInstruction = `Você é a Marina, assistente de vendas da Antum.

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

IDENTIDADE: Marina, assistente da Antum — AI & Automation Studio (https://antum.com.br)`

      // Build message context
      const formattedContents = (messages || []).map((m: { sender: string; text?: string; content?: string }) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text || m.content || '' }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || 'Entendi seu ponto. Como sua equipe lida com esse fluxo atualmente?';
      return res.json({ reply: replyText });
    }

    // Fallback SDR engine (Intelligent rule-based SDR conversation if no API key provided)
    const lower = (lastUserMessage || '').toLowerCase();
    let fallbackReply = '';

    if (lower.includes('olá') || lower.includes('oi') || lower.includes('bom dia') || lower.includes('boa tarde')) {
      fallbackReply = 'Olá! Sou a Marina, SDR de Inteligência Artificial da ANTUM. Estou aqui para entender os processos da sua empresa e identificar onde a automação pode gerar mais eficiência. Qual é o principal desafio operacional que vocês enfrentam hoje?';
    } else if (lower.includes('lead') || lower.includes('venda') || lower.includes('sdr') || lower.includes('comercial') || lower.includes('prospec')) {
      fallbackReply = 'Perfeito. Um agente de IA como eu pode qualificar leads no WhatsApp ou web em segundos, tirar dúvidas técnicas, tratar objeções e entregar a oportunidade pronta na agenda do seu vendedor. Vocês usam algum CRM hoje (como HubSpot, RD Station ou Pipedrive)?';
    } else if (lower.includes('rpa') || lower.includes('repetit') || lower.includes('manual') || lower.includes('planilha') || lower.includes('tempo')) {
      fallbackReply = 'Processos manuais como digitação de notas, conciliação em ERP ou cópia de planilhas são candidatos ideais para RPA e automação. Quantas horas por semana sua equipe costuma gastar com essas rotinas?';
    } else if (lower.includes('preço') || lower.includes('quanto custa') || lower.includes('valor') || lower.includes('orçamento')) {
      fallbackReply = 'Cada projeto na ANTUM é desenhado sob medida — desde a implantação de um agente SDR até sistemas completos de automação e RPA. O investimento depende da complexidade do fluxo e das integrações. Gostaria de agendar um diagnóstico técnico de 20 minutos com nossa equipe?';
    } else if (lower.includes('integra') || lower.includes('sistema') || lower.includes('api') || lower.includes('erp') || lower.includes('crm')) {
      fallbackReply = 'Conectamos agentes de IA e fluxos aos sistemas que sua empresa já utiliza: CRMs, ERPs, bancos de dados, WhatsApp e APIs legadas, sem necessidade de substituir seu stack atual. Quais ferramentas você gostaria de integrar?';
    } else {
      fallbackReply = 'Compreendo perfeitamente. Na ANTUM, transformamos exatamente esse tipo de rotina em sistemas autônomos que operam 24/7. Deixe seu WhatsApp ou e-mail corporativo para que um de nossos engenheiros apresente uma demonstração prática alinhada ao seu cenário.';
    }

    return res.json({ reply: fallbackReply });
  } catch (error: unknown) {
    console.error('Error in /api/chat-marina:', error);
    return res.status(500).json({
      reply: 'Tive uma pequena oscilação na conexão, mas estou pronta para te ouvir. Pode me contar qual processo você gostaria de automatizar?',
    });
  }
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
