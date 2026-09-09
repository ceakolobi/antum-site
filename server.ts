import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = process.cwd();

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
    name: name || 'Lead AnÃÂÃÂ´nimo',
    company: company || 'Empresa nÃÂÃÂ£o informada',
    contact: contact || 'Sem contato',
    challenge: challenge || 'Geral',
    solutionOfInterest: solutionOfInterest || 'NÃÂÃÂ£o especificada',
    createdAt: new Date().toISOString(),
  };
  leadsDatabase.push(leadRecord);
  res.json({ success: true, leadId: leadRecord.id, message: 'SolicitaÃÂÃÂ§ÃÂÃÂ£o registrada com sucesso.' });
});

// Marina SDR AI Chat endpoint
app.post('/api/chat-marina', async (req, res) => {
  try {
    const { messages, context } = req.body || {};
    const lastUserMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : '';

    const ai = getGenAI();

    // If Gemini key is available, use gemini-1.5-flash
    if (ai) {
      const systemInstruction = `VocÃÂÃÂª ÃÂÃÂ© a Marina, assistente de vendas da Antum.

COMO VOCÃÂÃÂ AGE:
- Responde em no mÃÂÃÂ¡ximo 2-3 linhas por mensagem.
- Fala como pessoa, nÃÂÃÂ£o como bot. Sem bullet points, sem emojis em excesso.
- Primeiro entende o problema do cliente. SÃÂÃÂ³ depois oferece soluÃÂÃÂ§ÃÂÃÂ£o.
- Pergunta o essencial pra entender o que ele precisa ÃÂ¢ÃÂÃÂ uma pergunta por vez.
- Quando entender a dor, vai direto ÃÂÃÂ  melhor soluÃÂÃÂ§ÃÂÃÂ£o pra aquele caso especÃÂÃÂ­fico.
- Nunca repete o que jÃÂÃÂ¡ foi dito. Nunca enrola.

COMO VOCÃÂÃÂ VENDE:
- NÃÂÃÂ£o empurra produto. Conecta o produto ÃÂÃÂ  dor real que o cliente acabou de contar.
- Antes de falar preÃÂÃÂ§o, mostra o valor.
- Se houver objeÃÂÃÂ§ÃÂÃÂ£o, valida com empatia, pergunta e redireciona ÃÂ¢ÃÂÃÂ nunca discute.
- O prÃÂÃÂ³ximo passo ÃÂÃÂ© convidar pra conversa com a equipe: https://antum.com.br

O QUE VOCÃÂÃÂ NUNCA FAZ:
- Mandar textÃÂÃÂ£o. MÃÂÃÂ¡ximo 3 linhas por mensagem.
- Listar features sem antes entender o que o cliente precisa.
- Fingir que nÃÂÃÂ£o ÃÂÃÂ© IA ÃÂ¢ÃÂÃÂ se perguntarem, confirma que ÃÂÃÂ© assistente de IA da Antum.

IDENTIDADE: Marina, assistente da Antum ÃÂ¢ÃÂÃÂ AI & Automation Studio (https://antum.com.br)`

      // Build message context
      const formattedContents = (messages || []).map((m: { sender: string; text?: string; content?: string }) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text || m.content || '' }],
      }));

      // Retry up to 3x on transient errors (503 high demand, etc.)
    let response: Awaited<ReturnType<typeof ai.models.generateContent>> | undefined;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
        break; // success — exit retry loop
      } catch (retryErr: unknown) {
        if (attempt === 2) throw retryErr; // last attempt — re-throw to outer catch
        await new Promise(r => setTimeout(r, 1200 * (attempt + 1))); // 1.2s, 2.4s
      }
    }

      const replyText = response.text || 'Entendi seu ponto. Como sua equipe lida com esse fluxo atualmente?';
      return res.json({ reply: replyText });
    }

    // Fallback SDR engine (Intelligent rule-based SDR conversation if no API key provided)
    const lower = (lastUserMessage || '').toLowerCase();
    let fallbackReply = '';

    if (lower.includes('olÃÂÃÂ¡') || lower.includes('oi') || lower.includes('bom dia') || lower.includes('boa tarde')) {
      fallbackReply = 'OlÃÂÃÂ¡! Sou a Marina, SDR de InteligÃÂÃÂªncia Artificial da ANTUM. Estou aqui para entender os processos da sua empresa e identificar onde a automaÃÂÃÂ§ÃÂÃÂ£o pode gerar mais eficiÃÂÃÂªncia. Qual ÃÂÃÂ© o principal desafio operacional que vocÃÂÃÂªs enfrentam hoje?';
    } else if (lower.includes('lead') || lower.includes('venda') || lower.includes('sdr') || lower.includes('comercial') || lower.includes('prospec')) {
      fallbackReply = 'Perfeito. Um agente de IA como eu pode qualificar leads no WhatsApp ou web em segundos, tirar dÃÂÃÂºvidas tÃÂÃÂ©cnicas, tratar objeÃÂÃÂ§ÃÂÃÂµes e entregar a oportunidade pronta na agenda do seu vendedor. VocÃÂÃÂªs usam algum CRM hoje (como HubSpot, RD Station ou Pipedrive)?';
    } else if (lower.includes('rpa') || lower.includes('repetit') || lower.includes('manual') || lower.includes('planilha') || lower.includes('tempo')) {
      fallbackReply = 'Processos manuais como digitaÃÂÃÂ§ÃÂÃÂ£o de notas, conciliaÃÂÃÂ§ÃÂÃÂ£o em ERP ou cÃÂÃÂ³pia de planilhas sÃÂÃÂ£o candidatos ideais para RPA e automaÃÂÃÂ§ÃÂÃÂ£o. Quantas horas por semana sua equipe costuma gastar com essas rotinas?';
    } else if (lower.includes('preÃÂÃÂ§o') || lower.includes('quanto custa') || lower.includes('valor') || lower.includes('orÃÂÃÂ§amento')) {
      fallbackReply = 'Cada projeto na ANTUM ÃÂÃÂ© desenhado sob medida ÃÂ¢ÃÂÃÂ desde a implantaÃÂÃÂ§ÃÂÃÂ£o de um agente SDR atÃÂÃÂ© sistemas completos de automaÃÂÃÂ§ÃÂÃÂ£o e RPA. O investimento depende da complexidade do fluxo e das integraÃÂÃÂ§ÃÂÃÂµes. Gostaria de agendar um diagnÃÂÃÂ³stico tÃÂÃÂ©cnico de 20 minutos com nossa equipe?';
    } else if (lower.includes('integra') || lower.includes('sistema') || lower.includes('api') || lower.includes('erp') || lower.includes('crm')) {
      fallbackReply = 'Conectamos agentes de IA e fluxos aos sistemas que sua empresa jÃÂÃÂ¡ utiliza: CRMs, ERPs, bancos de dados, WhatsApp e APIs legadas, sem necessidade de substituir seu stack atual. Quais ferramentas vocÃÂÃÂª gostaria de integrar?';
    } else {
      fallbackReply = 'Compreendo perfeitamente. Na ANTUM, transformamos exatamente esse tipo de rotina em sistemas autÃÂÃÂ´nomos que operam 24/7. Deixe seu WhatsApp ou e-mail corporativo para que um de nossos engenheiros apresente uma demonstraÃÂÃÂ§ÃÂÃÂ£o prÃÂÃÂ¡tica alinhada ao seu cenÃÂÃÂ¡rio.';
    }

    return res.json({ reply: fallbackReply });
  } catch (error: unknown) {
    console.error('Error in /api/chat-marina:', error);
    res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.status(500).json({
      reply: 'Tive uma pequena oscilaÃÂÃÂ§ÃÂÃÂ£o na conexÃÂÃÂ£o, mas estou pronta para te ouvir. Pode me contar qual processo vocÃÂÃÂª gostaria de automatizar?',
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
