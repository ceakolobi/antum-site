// Briefing do projeto: o cliente conta o que precisa (e envia logo/fotos) para a Antum montar o serviço.
// As perguntas ficam AQUI no servidor (uma única fonte): o site só desenha o que o servidor manda.
import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import type { Ajudantes } from './adminAuth';

export interface Campo { id: string; rotulo: string; tipo: 'texto' | 'longo' | 'escolha'; obrigatorio?: boolean; ajuda?: string; opcoes?: string[] }
export interface Secao { titulo: string; campos: Campo[] }
export interface Modelo { tipo: string; titulo: string; secoes: Secao[] }

const t = (id: string, rotulo: string, o: Partial<Campo> = {}): Campo => ({ id, rotulo, tipo: 'texto', ...o });
const l = (id: string, rotulo: string, o: Partial<Campo> = {}): Campo => ({ id, rotulo, tipo: 'longo', ...o });
const e = (id: string, rotulo: string, opcoes: string[], o: Partial<Campo> = {}): Campo => ({ id, rotulo, tipo: 'escolha', opcoes, ...o });

const EMPRESA: Secao = { titulo: 'Sobre a empresa', campos: [
  t('nome_fantasia', 'Nome da empresa (como quer aparecer)', { obrigatorio: true }),
  t('ramo', 'Ramo de atuação', { obrigatorio: true, ajuda: 'Ex.: salão de beleza, oficina mecânica, escritório de contabilidade' }),
  t('cidade_atuacao', 'Cidade/região em que atua'),
  t('tempo_mercado', 'Há quanto tempo está no mercado?'),
  l('descricao', 'Descreva a sua empresa e o que ela faz', { obrigatorio: true }),
  l('diferenciais', 'Quais são seus diferenciais? Por que escolhem você?'),
  l('publico', 'Quem são os seus clientes? (público que você quer atingir)'),
] };
const SERVICOS: Secao = { titulo: 'Serviços e textos', campos: [
  l('servicos', 'Liste seus principais serviços ou produtos (um por linha)', { obrigatorio: true }),
  l('sobre_nos', 'Texto "Sobre nós" (se já tiver)', { ajuda: 'Se não tiver, escrevemos com base no que você contou acima.' }),
] };
const CONTATO: Secao = { titulo: 'Contato e redes sociais', campos: [
  t('whatsapp', 'WhatsApp (com DDD)', { obrigatorio: true }),
  t('email_contato', 'E-mail de contato que aparece no site', { obrigatorio: true }),
  t('telefone', 'Telefone fixo (opcional)'),
  t('endereco', 'Endereço completo (se quiser mostrar)'),
  t('horario', 'Horário de atendimento'),
  t('instagram', 'Instagram (link ou @)'),
  t('facebook', 'Facebook (link)'),
  t('outras_redes', 'Outras redes (TikTok, YouTube, LinkedIn…)'),
] };
const VISUAL: Secao = { titulo: 'Visual e domínio', campos: [
  t('cores', 'Cores que você gosta ou usa na marca'),
  e('estilo', 'Estilo desejado', ['Moderno e limpo', 'Elegante', 'Colorido e jovem', 'Sério e corporativo', 'Não sei, podem escolher']),
  l('referencias', 'Sites que você gosta (cole 2 ou 3 links)'),
  e('logo_info', 'Sobre a logo', ['Tenho logo (vou anexar abaixo)', 'Preciso de uma logo']),
  e('tem_dominio', 'Domínio (endereço do site)', ['Já tenho', 'Ainda não tenho', 'Não sei']),
  t('dominio', 'Qual domínio? (ex.: minhaempresa.com.br)', { ajuda: 'O domínio é pago por você, direto no site de registro.' }),
] };
const PAGINAS: Secao = { titulo: 'Páginas e observações', campos: [
  l('paginas', 'Quais páginas você quer?', { ajuda: 'Ex.: Início, Serviços, Sobre, Galeria, Contato' }),
  l('observacoes', 'Mais alguma coisa que devemos saber?'),
] };
const LOJA: Secao = { titulo: 'Loja virtual', campos: [
  l('categorias', 'Categorias de produtos', { obrigatorio: true }),
  t('qtd_produtos', 'Quantos produtos, aproximadamente?'),
  l('pagamento', 'Formas de pagamento que quer aceitar'),
  l('frete', 'Como é a entrega? (frete, retirada, regiões)'),
] };
const CRM: Secao = { titulo: 'O que o sistema precisa fazer', campos: [
  l('processo_atual', 'Como você controla clientes e vendas hoje?', { obrigatorio: true, ajuda: 'Ex.: planilha, caderno, WhatsApp, outro sistema' }),
  l('objetivo', 'O que você quer resolver com o sistema?', { obrigatorio: true }),
  l('modulos', 'Quais cadastros e telas você precisa?', { ajuda: 'Ex.: clientes, orçamentos, agenda, financeiro, estoque, relatórios' }),
  l('usuarios', 'Quantas pessoas vão usar e o que cada uma faz?'),
  l('integracoes', 'Precisa ligar com algo? (WhatsApp, e-mail, planilhas, outros)'),
  t('planilhas_link', 'Link das planilhas ou arquivos que usa hoje (Google Drive etc.)'),
] };
const SISTEMA: Secao = { titulo: 'Sistema sob medida', campos: [
  l('regras', 'Regras importantes do seu negócio que o sistema deve seguir'),
  l('relatorios', 'Relatórios e números que você precisa ver'),
  t('prazo', 'Para quando você precisa?'),
] };
const VERA: Secao = { titulo: 'Atendente de IA (Vera)', campos: [
  t('nome_atendente', 'Como quer chamar a atendente?', { ajuda: 'Se não escolher, usamos Vera.' }),
  t('numero_whatsapp', 'Número de WhatsApp que a atendente vai usar', { obrigatorio: true }),
  l('o_que_vende', 'O que a atendente deve saber sobre o que você vende', { obrigatorio: true }),
  l('faq', 'Perguntas que os clientes mais fazem, com as respostas', { obrigatorio: true }),
  t('horario_atendimento', 'Horário em que há pessoas para atender'),
  e('tom', 'Tom de conversa', ['Formal', 'Amigável', 'Descontraído']),
  l('passar_humano', 'Quando a atendente deve chamar uma pessoa?'),
] };
const GERAL: Secao = { titulo: 'O que você precisa', campos: [
  l('descricao', 'Conte o que você precisa', { obrigatorio: true }),
  t('contato', 'Melhor forma de falar com você (WhatsApp ou e-mail)', { obrigatorio: true }),
  l('observacoes', 'Mais alguma coisa que devemos saber?'),
] };

// Plano -> modelo. Marina SDR tem integração própria (sem briefing aqui).
export function modeloPara(slug: string | null): Modelo | null {
  switch (slug) {
    case 'marina-sdr': return null;
    case 'site-profissional': return { tipo: 'site', titulo: 'Informações para o seu site', secoes: [EMPRESA, SERVICOS, CONTATO, VISUAL, PAGINAS] };
    case 'site-vera': return { tipo: 'site-vera', titulo: 'Informações para o seu site e a atendente de IA', secoes: [EMPRESA, SERVICOS, CONTATO, VISUAL, PAGINAS, VERA] };
    case 'loja-vera': return { tipo: 'loja', titulo: 'Informações para a sua loja virtual', secoes: [EMPRESA, SERVICOS, LOJA, CONTATO, VISUAL, PAGINAS, VERA] };
    case 'site-crm-vera': return { tipo: 'site-crm', titulo: 'Informações para o site, o CRM e a atendente de IA', secoes: [EMPRESA, SERVICOS, CONTATO, VISUAL, PAGINAS, CRM, VERA] };
    case 'site-sistema-vera': return { tipo: 'site-sistema', titulo: 'Informações para o site, o sistema e a atendente de IA', secoes: [EMPRESA, SERVICOS, CONTATO, VISUAL, PAGINAS, CRM, SISTEMA, VERA] };
    case 'crm-antum': return { tipo: 'crm', titulo: 'Informações para o seu CRM', secoes: [EMPRESA, CRM] };
    default: return { tipo: 'geral', titulo: 'Informações do seu projeto', secoes: [GERAL] };
  }
}

const todosCampos = (m: Modelo) => m.secoes.flatMap((s) => s.campos);

// Mantém só campos que existem no modelo, como texto limpo e com tamanho limitado
function limpar(m: Modelo, dados: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  const d = (dados && typeof dados === 'object' ? dados : {}) as Record<string, unknown>;
  for (const c of todosCampos(m)) {
    const v = d[c.id];
    if (typeof v !== 'string') continue;
    const txt = v.replace(/\u0000/g, '').trim().slice(0, c.tipo === 'longo' ? 3000 : 300);
    if (c.tipo === 'escolha' && txt && !c.opcoes?.includes(txt)) continue;
    if (txt) out[c.id] = txt;
  }
  return out;
}

const faltando = (m: Modelo, dados: Record<string, string>) => todosCampos(m).filter((c) => c.obrigatorio && !dados[c.id]).map((c) => c.rotulo);

// Tipo do arquivo pelos primeiros bytes (não confia no nome nem no tipo informado pelo navegador)
function tipoPorBytes(b: Buffer): { mime: string; ext: string } | null {
  if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { mime: 'image/png', ext: 'png' };
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { mime: 'image/jpeg', ext: 'jpg' };
  if (b.length > 12 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') return { mime: 'image/webp', ext: 'webp' };
  if (b.length > 5 && b.toString('ascii', 0, 5) === '%PDF-') return { mime: 'application/pdf', ext: 'pdf' };
  return null;
}
const nomeSeguro = (n: string, ext: string) => {
  const base = n.normalize('NFKD').replace(/[^\w.\- ]+/g, '').replace(/\s+/g, '_').replace(/\.[A-Za-z0-9]+$/, '').slice(0, 60) || 'arquivo';
  return `${base}.${ext}`;
};

const MAX_ARQUIVOS = 10;
const MAX_BYTES = 3 * 1024 * 1024;
const uuid = (v: unknown) => /^[0-9a-f-]{36}$/i.test(String(v));

export interface ExtrasBriefing {
  exigeCliente: (req: Request, res: Response, next: NextFunction) => void;
  exigeAdmin: (req: Request, res: Response, next: NextFunction) => void;
  auditar: (email: string | null, acao: string, detalhe: unknown, ip: string) => Promise<void>;
  avisarEquipe: (assunto: string, html: string) => Promise<void>;
}

export function registrarBriefing(app: Express, h: Ajudantes, x: ExtrasBriefing) {
  const { db, ipDe, limite, naoConfigurado } = h;
  const raw = express.raw({ type: 'application/octet-stream', limit: MAX_BYTES + 1024 });

  // Assinatura do cliente logado (ou 404). Devolve também o modelo de perguntas do plano.
  async function minhaAssinatura(res: Response, aid: string) {
    if (!uuid(aid)) return null;
    const a = (await db(
      "select id, plano_slug, plano_nome, status from financeiro.assinaturas where id = $1 and cliente_id = $2 and status <> 'CANCELADA'",
      [aid, res.locals.cliente.id],
    ))[0];
    if (!a) return null;
    return { ...a, modelo: modeloPara(a.plano_slug) as Modelo | null };
  }

  app.get('/api/cliente/briefings', naoConfigurado, x.exigeCliente, async (_req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    try {
      const rows = await db(
        `select a.id, a.plano_slug, a.plano_nome, coalesce(b.status, 'PENDENTE') as status
           from financeiro.assinaturas a left join financeiro.briefings b on b.assinatura_id = a.id
          where a.cliente_id = $1 and a.status <> 'CANCELADA' order by a.created_at desc`,
        [res.locals.cliente.id],
      );
      res.json({ projetos: rows.filter((r: any) => modeloPara(r.plano_slug)).map((r: any) => ({ id: r.id, plano_nome: r.plano_nome, status: r.status })) });
    } catch (err) {
      console.error('[fin/briefings]', (err as Error).message);
      res.status(500).json({ error: 'erro_interno' });
    }
  });

  app.get('/api/cliente/briefing/:aid', naoConfigurado, x.exigeCliente, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    try {
      const a = await minhaAssinatura(res, req.params.aid);
      if (!a?.modelo) return res.status(404).json({ error: 'projeto_nao_encontrado' });
      const b = (await db('select id, status, dados, enviado_em, updated_at from financeiro.briefings where assinatura_id = $1', [a.id]))[0];
      const arquivos = b ? await db('select id, nome, mime, tamanho from financeiro.briefing_arquivos where briefing_id = $1 order by created_at', [b.id]) : [];
      res.json({ plano_nome: a.plano_nome, modelo: a.modelo, status: b?.status || 'PENDENTE', dados: b?.dados || {}, enviado_em: b?.enviado_em || null, arquivos });
    } catch (err) {
      console.error('[fin/briefing/get]', (err as Error).message);
      res.status(500).json({ error: 'erro_interno' });
    }
  });

  async function garantir(a: any, clienteId: string) {
    return (await db(
      `insert into financeiro.briefings (assinatura_id, cliente_id) values ($1,$2)
       on conflict (assinatura_id) do update set updated_at = financeiro.briefings.updated_at returning id, status`,
      [a.id, clienteId],
    ))[0];
  }
  const travado = (st: string) => st === 'EM_PRODUCAO' || st === 'CONCLUIDO';

  app.put('/api/cliente/briefing/:aid', naoConfigurado, x.exigeCliente, async (req, res) => {
    try {
      const a = await minhaAssinatura(res, req.params.aid);
      if (!a?.modelo) return res.status(404).json({ error: 'projeto_nao_encontrado' });
      const b = await garantir(a, res.locals.cliente.id);
      if (travado(b.status)) return res.status(409).json({ error: 'projeto_em_producao' });
      await db('update financeiro.briefings set dados = $2::jsonb, updated_at = now() where id = $1', [b.id, JSON.stringify(limpar(a.modelo, req.body?.dados))]);
      res.json({ ok: true });
    } catch (err) {
      console.error('[fin/briefing/put]', (err as Error).message);
      res.status(500).json({ error: 'erro_interno' });
    }
  });

  app.post('/api/cliente/briefing/:aid/enviar', naoConfigurado, x.exigeCliente, async (req, res) => {
    try {
      const a = await minhaAssinatura(res, req.params.aid);
      if (!a?.modelo) return res.status(404).json({ error: 'projeto_nao_encontrado' });
      const b = await garantir(a, res.locals.cliente.id);
      if (travado(b.status)) return res.status(409).json({ error: 'projeto_em_producao' });
      const dados = limpar(a.modelo, req.body?.dados);
      const falta = faltando(a.modelo, dados);
      if (falta.length) return res.status(400).json({ error: 'campos_obrigatorios', faltando: falta });
      await db("update financeiro.briefings set dados = $2::jsonb, status = 'ENVIADO', enviado_em = now(), updated_at = now() where id = $1", [b.id, JSON.stringify(dados)]);
      res.json({ ok: true });
      x.avisarEquipe(
        `Briefing enviado — ${res.locals.cliente.nome} (${a.plano_nome})`,
        `<p>O cliente <strong>${res.locals.cliente.nome.replace(/[<>&]/g, '')}</strong> enviou as informações do projeto <strong>${a.plano_nome.replace(/[<>&]/g, '')}</strong>. Veja no painel, em Clientes → Consultar.</p>`,
      ).catch(() => undefined);
    } catch (err) {
      console.error('[fin/briefing/enviar]', (err as Error).message);
      if (!res.headersSent) res.status(500).json({ error: 'erro_interno' });
    }
  });

  // Upload: corpo bruto (application/octet-stream), nome no cabeçalho x-nome-arquivo. Só png, jpg, webp e pdf, até 3 MB.
  app.post('/api/cliente/briefing/:aid/arquivo', naoConfigurado, x.exigeCliente, raw, async (req, res) => {
    try {
      if (!limite(`bupl:${res.locals.cliente.id}`, 30, 10 * 60_000)) return res.status(429).json({ error: 'muitas_tentativas' });
      const a = await minhaAssinatura(res, req.params.aid);
      if (!a?.modelo) return res.status(404).json({ error: 'projeto_nao_encontrado' });
      const corpo = req.body as Buffer;
      if (!Buffer.isBuffer(corpo) || corpo.length === 0) return res.status(400).json({ error: 'arquivo_vazio' });
      if (corpo.length > MAX_BYTES) return res.status(413).json({ error: 'arquivo_grande' });
      const tipo = tipoPorBytes(corpo);
      if (!tipo) return res.status(400).json({ error: 'tipo_nao_aceito' });
      const b = await garantir(a, res.locals.cliente.id);
      if (travado(b.status)) return res.status(409).json({ error: 'projeto_em_producao' });
      const qtd = (await db('select count(*)::int as n from financeiro.briefing_arquivos where briefing_id = $1', [b.id]))[0].n;
      if (qtd >= MAX_ARQUIVOS) return res.status(400).json({ error: 'limite_de_arquivos' });
      let nome = 'arquivo';
      try { nome = decodeURIComponent(String(req.headers['x-nome-arquivo'] || 'arquivo')); } catch { /* usa o padrão */ }
      const [f] = await db(
        'insert into financeiro.briefing_arquivos (briefing_id, nome, mime, tamanho, conteudo) values ($1,$2,$3,$4,$5) returning id, nome, mime, tamanho',
        [b.id, nomeSeguro(nome, tipo.ext), tipo.mime, corpo.length, corpo],
      );
      res.json({ ok: true, arquivo: f });
    } catch (err) {
      console.error('[fin/briefing/upload]', (err as Error).message);
      if (!res.headersSent) res.status(500).json({ error: 'erro_interno' });
    }
  });

  app.delete('/api/cliente/briefing/:aid/arquivo/:fid', naoConfigurado, x.exigeCliente, async (req, res) => {
    try {
      const a = await minhaAssinatura(res, req.params.aid);
      if (!a || !uuid(req.params.fid)) return res.status(404).json({ error: 'arquivo_nao_encontrado' });
      const r = await db(
        `delete from financeiro.briefing_arquivos f using financeiro.briefings b
          where f.id = $1 and f.briefing_id = b.id and b.assinatura_id = $2 and b.status not in ('EM_PRODUCAO','CONCLUIDO') returning f.id`,
        [req.params.fid, a.id],
      );
      if (!r.length) return res.status(404).json({ error: 'arquivo_nao_encontrado' });
      res.json({ ok: true });
    } catch (err) {
      console.error('[fin/briefing/del]', (err as Error).message);
      res.status(500).json({ error: 'erro_interno' });
    }
  });

  const enviarArquivo = (res: Response, f: any) => {
    res.setHeader('Content-Type', f.mime);
    res.setHeader('Content-Disposition', `attachment; filename="${String(f.nome).replace(/[^\w.\-]/g, '_')}"`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');
    res.end(f.conteudo);
  };

  app.get('/api/cliente/briefing/:aid/arquivo/:fid', naoConfigurado, x.exigeCliente, async (req, res) => {
    try {
      const a = await minhaAssinatura(res, req.params.aid);
      if (!a || !uuid(req.params.fid)) return res.status(404).json({ error: 'arquivo_nao_encontrado' });
      const f = (await db(
        `select f.nome, f.mime, f.conteudo from financeiro.briefing_arquivos f join financeiro.briefings b on b.id = f.briefing_id
          where f.id = $1 and b.assinatura_id = $2`, [req.params.fid, a.id]))[0];
      if (!f) return res.status(404).json({ error: 'arquivo_nao_encontrado' });
      enviarArquivo(res, f);
    } catch (err) {
      console.error('[fin/briefing/dl]', (err as Error).message);
      res.status(500).json({ error: 'erro_interno' });
    }
  });

  // ----- Administrador -----
  app.get('/api/admin/briefing/:aid', naoConfigurado, x.exigeAdmin, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    try {
      if (!uuid(req.params.aid)) return res.status(404).json({ error: 'projeto_nao_encontrado' });
      const a = (await db('select id, plano_slug, plano_nome from financeiro.assinaturas where id = $1', [req.params.aid]))[0];
      const modelo = a ? modeloPara(a.plano_slug) : null;
      if (!a || !modelo) return res.status(404).json({ error: 'projeto_nao_encontrado' });
      const b = (await db('select id, status, dados, enviado_em, updated_at from financeiro.briefings where assinatura_id = $1', [a.id]))[0];
      const arquivos = b ? await db('select id, nome, mime, tamanho from financeiro.briefing_arquivos where briefing_id = $1 order by created_at', [b.id]) : [];
      res.json({ plano_nome: a.plano_nome, modelo, status: b?.status || 'PENDENTE', dados: b?.dados || {}, enviado_em: b?.enviado_em || null, updated_at: b?.updated_at || null, arquivos });
    } catch (err) {
      console.error('[fin/admin/briefing]', (err as Error).message);
      res.status(500).json({ error: 'erro_interno' });
    }
  });

  app.get('/api/admin/briefing/:aid/arquivo/:fid', naoConfigurado, x.exigeAdmin, async (req, res) => {
    try {
      if (!uuid(req.params.aid) || !uuid(req.params.fid)) return res.status(404).json({ error: 'arquivo_nao_encontrado' });
      const f = (await db(
        `select f.nome, f.mime, f.conteudo from financeiro.briefing_arquivos f join financeiro.briefings b on b.id = f.briefing_id
          where f.id = $1 and b.assinatura_id = $2`, [req.params.fid, req.params.aid]))[0];
      if (!f) return res.status(404).json({ error: 'arquivo_nao_encontrado' });
      enviarArquivo(res, f);
    } catch (err) {
      console.error('[fin/admin/briefing/dl]', (err as Error).message);
      res.status(500).json({ error: 'erro_interno' });
    }
  });

  app.post('/api/admin/briefing/:aid/status', naoConfigurado, x.exigeAdmin, async (req, res) => {
    try {
      const novo = String(req.body?.status || '');
      if (!uuid(req.params.aid) || !['ENVIADO', 'EM_PRODUCAO', 'CONCLUIDO'].includes(novo)) return res.status(400).json({ error: 'dados_invalidos' });
      const r = await db('update financeiro.briefings set status = $2, updated_at = now() where assinatura_id = $1 returning id', [req.params.aid, novo]);
      if (!r.length) return res.status(404).json({ error: 'projeto_nao_encontrado' });
      await x.auditar(String(res.locals.admin?.email || ''), 'briefing_status', { assinatura: req.params.aid, status: novo }, ipDe(req));
      res.json({ ok: true });
    } catch (err) {
      console.error('[fin/admin/briefing/status]', (err as Error).message);
      res.status(500).json({ error: 'erro_interno' });
    }
  });
}
