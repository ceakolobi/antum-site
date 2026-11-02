// Contrato: preenche o modelo, gera o PDF e envia por e-mail (Resend). Sem dependência de chave para gerar.
import PDFDocument from 'pdfkit';

export type Variaveis = Record<string, string>;

// Troca {{variavel}} pelo valor. Variável desconhecida vira vazio (nunca mostra "undefined").
export function renderContrato(texto: string, vars: Variaveis): string {
  return texto
    .replace(/\{\{(\w+)\}\}/g, (_m, k: string) => vars[k] ?? '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function gerarPdf(titulo: string, corpo: string, rodape: string[], logoPath?: string): Promise<Buffer> {
  return new Promise((ok, erro) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 56, bottom: 64, left: 62, right: 62 },
      info: { Title: titulo, Author: 'Antum', Subject: 'Contrato de prestação de serviços' },
    });
    const partes: Buffer[] = [];
    doc.on('data', (c: Buffer) => partes.push(c));
    doc.on('end', () => ok(Buffer.concat(partes)));
    doc.on('error', erro);

    if (logoPath) {
      try {
        // logo horizontal: cabe em 230x70pt, alinhado à esquerda do cabeçalho
        doc.image(logoPath, doc.page.margins.left, 40, { fit: [230, 70] });
        doc.y = 40 + 70 + 12;
        doc.x = doc.page.margins.left;
      } catch { /* sem logo, segue só com o texto */ }
    }
    const linhas = corpo.split('\n');
    linhas.forEach((l, i) => {
      const t = l.trimEnd();
      if (!t) { doc.moveDown(0.5); return; }
      const titulo1 = i === 0;
      const clausula = /^CLÁUSULA\s/.test(t) || /^(CONTRATADA|CONTRATANTE):/.test(t);
      doc.font(titulo1 || clausula ? 'Helvetica-Bold' : 'Helvetica').fontSize(titulo1 ? 14 : 10.5);
      doc.text(t, { align: titulo1 ? 'center' : 'justify', lineGap: 2 });
      if (titulo1) doc.moveDown(0.8);
    });

    doc.moveDown(1.2);
    doc.moveTo(doc.x, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).strokeColor('#999999').stroke();
    doc.moveDown(0.6);
    doc.font('Helvetica-Bold').fontSize(10).text('REGISTRO DO ACEITE ELETRÔNICO');
    doc.font('Helvetica').fontSize(9).fillColor('#333333');
    rodape.forEach((l) => doc.text(l, { lineGap: 1 }));
    doc.end();
  });
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));

export async function enviarEmailContrato(opts: {
  chave: string; base?: string; de: string; para: string; responderPara?: string;
  nome: string; plano: string; pdf: Buffer; arquivo: string;
}): Promise<void> {
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#222;line-height:1.5">
    <p>Olá, ${esc(opts.nome)}!</p>
    <p>Recebemos o seu aceite do plano <strong>${esc(opts.plano)}</strong>. Segue em anexo a cópia do contrato em PDF.</p>
    <p>Guarde este e-mail. Qualquer dúvida, é só responder esta mensagem.</p>
    <p>Equipe Antum</p></div>`;
  const r = await fetch(`${opts.base || 'https://api.resend.com'}/emails`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${opts.chave}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: opts.de, to: [opts.para], subject: `Seu contrato Antum — ${opts.plano}`, html,
      reply_to: opts.responderPara || undefined,
      attachments: [{ filename: opts.arquivo, content: opts.pdf.toString('base64') }],
    }),
  });
  if (!r.ok) throw new Error(`resend ${r.status}: ${(await r.text()).slice(0, 200)}`);
}

export type TipoAviso = 'nova' | 'paga' | 'vencida';

const fmtBrl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtData = (iso: string) => String(iso).slice(0, 10).split('-').reverse().join('/');

// Aviso por e-mail de cobrança (substitui as notificações pagas do Asaas). Texto simples, link direto da fatura.
export async function enviarAvisoCobranca(opts: {
  chave: string; base?: string; de: string; para: string; responderPara?: string;
  tipo: TipoAviso; nome: string; plano: string; valor: number; vencimento: string; url: string | null;
}): Promise<void> {
  const v = fmtBrl(opts.valor);
  const d = fmtData(opts.vencimento);
  const botao = opts.url
    ? `<p><a href="${esc(opts.url)}" style="display:inline-block;background:#0891b2;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:bold">Ver cobrança e pagar</a></p>`
    : '';
  const textos: Record<TipoAviso, { assunto: string; corpo: string }> = {
    nova: {
      assunto: `Sua cobrança Antum — vence em ${d}`,
      corpo: `<p>Segue a cobrança do plano <strong>${esc(opts.plano)}</strong>: <strong>${v}</strong>, com vencimento em <strong>${d}</strong>.</p>${botao}<p>Pelo link você paga por PIX ou boleto e pode baixar a 2ª via quando quiser.</p>`,
    },
    paga: {
      assunto: 'Pagamento confirmado — Antum',
      corpo: `<p>Recebemos o pagamento de <strong>${v}</strong> do plano <strong>${esc(opts.plano)}</strong>. Obrigado!</p>`,
    },
    vencida: {
      assunto: `Cobrança vencida — Antum (${d})`,
      corpo: `<p>A cobrança de <strong>${v}</strong> do plano <strong>${esc(opts.plano)}</strong>, com vencimento em <strong>${d}</strong>, continua em aberto.</p>${botao}<p>Se já pagou, desconsidere este aviso. Qualquer dúvida, é só responder este e-mail.</p>`,
    },
  };
  const t = textos[opts.tipo];
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#222;line-height:1.5"><p>Olá, ${esc(opts.nome)}!</p>${t.corpo}<p>Equipe Antum</p></div>`;
  const r = await fetch(`${opts.base || 'https://api.resend.com'}/emails`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${opts.chave}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: opts.de, to: [opts.para], subject: t.assunto, html, reply_to: opts.responderPara || undefined }),
  });
  if (!r.ok) throw new Error(`resend ${r.status}: ${(await r.text()).slice(0, 200)}`);
}
