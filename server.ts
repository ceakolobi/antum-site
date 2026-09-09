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
    name: name || 'Lead AnÃ´nimo',
    company: company || 'Empresa nÃ£o informada',
    contact: contact || 'Sem contato',
    challenge: challenge || 'Geral',
    solutionOfInterest: solutionOfInterest || 'NÃ£o especificada',
    createdAt: new Date().toISOString(),
  };
  leadsDatabase.push(leadRecord);
  res.json({ success: true, leadId: leadRecord.id, message: 'SolicitaÃ§Ã£o registrada com sucesso.' });
});

// Marina SDR AI Chat endpoint
app.post('/api/chat-marina', async (req, res) => {
  try {
    const { messages, context } = req.body || {};
    const lastUserMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : '';

    const ai = getGenAI();

    // If Gemini key is available, use gemini-2.0-flash
    if (ai) {
      const systemInstruction = `VocÃª Ã© a Marina, assistente de vendas da Antum.

COMO VOCÃ AGE:
- Responde em no mÃ¡ximo 2-3 linhas por mensagem.
- Fala como pessoa, nÃ£o como bot. Sem bullet points, sem emojis em excesso.
- Primeiro entende o problema do cliente. SÃ³ depois oferece soluÃ§Ã£o.
- Pergunta o essencial pra entender o que ele precisa â uma pergunta por vez.
- Quando entender a dor, vai direto Ã  melhor soluÃ§Ã£o pra aquele caso especÃ­fico.
- Nunca repete o que jÃ¡ foi dito. Nunca enrola.

COMO VOCÃ VENDE:
- NÃ£o empurra produto. Conecta o produto Ã  dor real que o cliente acabou de contar.
- Antes de falar preÃ§o, mostra o valor.
- Se houver objeÃ§Ã£o, valida com empatia, pergunta e redireciona â nunca discute.
- O prÃ³ximo passo Ã© convidar pra conversa com a equipe: https://antum.com.br

O QUE VOCÃ NUNCA FAZ:
- Mandar textÃ£o. MÃ¡ximo 3 linhas por mensagem.
- Listar features sem antes entender o que o cliente precisa.
- Fingir que nÃ£o Ã© IA â se perguntarem, confirma que Ã© assistente de IA da Antum.

IDENTIDADE: Marina, assistente da Antum â AI & Automation Studio (https://antum.com.br)`

      // Build message context
      const formattedContents = (messages || []).map((m: { sender: string; text?: string; content?: string }) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text || m.content || '' }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
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

    if (lower.includes('olÃ¡') || lower.includes('oi') || lower.includes('bom dia') || lower.includes('boa tarde')) {
      fallbackReply = 'OlÃ¡! Sou a Marina, SDR de InteligÃªncia Artificial da ANTUM. Estou aqui para entender os processos da sua empresa e identificar onde a automaÃ§Ã£o pode gerar mais eficiÃªncia. Qual Ã© o principal desafio operacional que vocÃªs enfrentam hoje?';
    } else if (lower.includes('lead') || lower.includes('venda') || lower.includes('sdr') || lower.includes('comercial') || lower.includes('prospec')) {
      fallbackReply = 'Perfeito. Um agente de IA como eu pode qualificar leads no WhatsApp ou web em segundos, tirar dÃºvidas tÃ©cnicas, tratar objeÃ§Ãµes e entregar a oportunidade pronta na agenda do seu vendedor. VocÃªs usam algum CRM hoje (como HubSpot, RD Station ou Pipedrive)?';
    } else if (lower.includes('rpa') || lower.includes('repetit') || lower.includes('manual') || lower.includes('planilha') || lower.includes('tempo')) {
      fallbackReply = 'Processos manuais como digitaÃ§Ã£o de notas, conciliaÃ§Ã£o em ERP ou cÃ³pia de planilhas sÃ£o candidatos ideais para RPA e automaÃ§Ã£o. Quantas horas por semana sua equipe costuma gastar com essas rotinas?';
    } else if (lower.includes('preÃ§o') || lower.includes('quanto custa') || lower.includes('valor') || lower.includes('orÃ§amento')) {
      fallbackReply = 'Cada projeto na ANTUM Ã© desenhado sob medida â desde a implantaÃ§Ã£o de um agente SDR atÃ© sistemas completos de automaÃ§Ã£o e RPA. O investimento depende da complexidade do fluxo e das integraÃ§Ãµes. Gostaria de agendar um diagnÃ³stico tÃ©cnico de 20 minutos com nossa equipe?';
    } else if (lower.includes('integra') || lower.includes('sistema') || lower.includes('api') || lower.includes('erp') || lower.includes('crm')) {
      fallbackReply = 'Conectamos agentes de IA e fluxos aos sistemas que sua empresa jÃ¡ utiliza: CRMs, ERPs, bancos de dados, WhatsApp e APIs legadas, sem necessidade de substituir seu stack atual. Quais ferramentas vocÃª gostaria de integrar?';
    } else {
      fallbackReply = 'Compreendo perfeitamente. Na ANTUM, transformamos exatamente esse tipo de rotina em sistemas autÃ´nomos que operam 24/7. Deixe seu WhatsApp ou e-mail corporativo para que um de nossos engenheiros apresente uma demonstraÃ§Ã£o prÃ¡tica alinhada ao seu cenÃ¡rio.';
    }

    return res.json({ reply: fallbackReply });
  } catch (error: unknown) {
    console.error('Error in /api/chat-marina:', error);
    return res.status(500).json({
      reply: 'Tive uma pequena oscilaÃ§Ã£o na conexÃ£o, mas estou pronta para te ouvir. Pode me contar qual processo vocÃª gostaria de automatizar?',
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
