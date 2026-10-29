// Teste ponta a ponta do módulo financeiro contra o SANDBOX do Asaas (local, porta 3055).
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const envFile = process.argv[2];
const env = { ...process.env, PORT: '3055', NODE_ENV: 'development' };
for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
  const i = line.indexOf('=');
  if (i > 0) env[line.slice(0, i)] = line.slice(i + 1);
}
// O servidor recebe a chave SEM o "$" inicial (como no EasyPanel); o teste usa a versão completa nas chamadas diretas.
const asaasKeyFull = env.ASAAS_API_KEY.startsWith('$') ? env.ASAAS_API_KEY : '$' + env.ASAAS_API_KEY;
env.ASAAS_API_KEY = asaasKeyFull.slice(1);
if (!env.ASAAS_BASE_URL.includes('sandbox')) { console.log('ABORT: base nao e sandbox'); process.exit(1); }

const srv = spawn(process.execPath, ['node_modules/tsx/dist/cli.mjs', 'server.ts'], { env, stdio: ['ignore', 'pipe', 'pipe'] });
let log = '';
srv.stdout.on('data', (d) => (log += d));
srv.stderr.on('data', (d) => (log += d));
const base = 'http://localhost:3055';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = [];
const ok = (nome, cond, extra = '') => { out.push(`${cond ? 'OK  ' : 'FALHA'} ${nome} ${extra}`); };

try {
  for (let i = 0; i < 30; i++) { try { const r = await fetch(base + '/api/health'); if (r.ok) break; } catch {} await sleep(1000); }

  let r = await fetch(base + '/api/cadastro/plano');
  let j = await r.json();
  ok('GET /api/cadastro/plano', r.status === 200 && j.valor, `status=${r.status} plano=${j.plano} valor=${j.valor} dias=${JSON.stringify(j.diasPermitidos)}`);

  const corpo = {
    tipo: 'PF', cpfCnpj: '529.982.247-25', nome: 'Teste Antum Sandbox', email: 'teste.sandbox@antum.com.br',
    celular: '(47) 98843-1352', cep: '89201-100', endereco: 'Rua XV de Novembro', numero: '100',
    bairro: 'Centro', cidade: 'Joinville', uf: 'SC', formaPagamento: 'PIX', vencimentoDia: 8, aceite: true,
  };
  r = await fetch(base + '/api/cadastro', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: base }, body: JSON.stringify(corpo) });
  j = await r.json();
  ok('POST /api/cadastro', r.status === 200 && j.ok, `status=${r.status} etapas=${JSON.stringify(j.etapas)} venc=${j.vencimento} valor=${j.valor} erro=${j.error || ''}`);
  ok('link de pagamento gerado', Boolean(j.pagamentoUrl), j.pagamentoUrl ? '(url ok)' : '(sem url)');

  // idempotência: repetir não pode duplicar
  r = await fetch(base + '/api/cadastro', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: base }, body: JSON.stringify(corpo) });
  j = await r.json();
  ok('repetir cadastro (sem duplicar)', r.status === 200 && j.ok, `status=${r.status}`);

  // origem inválida
  r = await fetch(base + '/api/cadastro', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://evil.example' }, body: JSON.stringify(corpo) });
  ok('origem invalida bloqueada', r.status === 403, `status=${r.status}`);

  // CPF inválido
  r = await fetch(base + '/api/cadastro', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: base }, body: JSON.stringify({ ...corpo, cpfCnpj: '111.111.111-11' }) });
  ok('CPF invalido rejeitado', r.status === 400, `status=${r.status}`);

  // webhook sem token / token errado
  r = await fetch(base + '/api/asaas/webhook', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: 'x', event: 'PAYMENT_RECEIVED' }) });
  ok('webhook sem token = 401', r.status === 401, `status=${r.status}`);
  r = await fetch(base + '/api/asaas/webhook', { method: 'POST', headers: { 'Content-Type': 'application/json', 'asaas-access-token': 'errado'.repeat(8) }, body: JSON.stringify({ id: 'x', event: 'PAYMENT_RECEIVED' }) });
  ok('webhook token errado = 401', r.status === 401, `status=${r.status}`);

  // admin
  r = await fetch(base + '/api/admin/financeiro');
  ok('admin sem token = 401', r.status === 401, `status=${r.status}`);
  r = await fetch(base + '/api/admin/financeiro', { headers: { Authorization: 'Bearer ' + env.FIN_ADMIN_TOKEN } });
  const adm = await r.json();
  ok('admin com token', r.status === 200, `clientes=${adm.clientes?.length} assinaturas=${adm.assinaturas?.length} cobrancas=${adm.cobrancas?.length} base=${adm.asaasBase}`);

  // webhook simulado usando a cobrança REAL criada no Asaas
  const cob = adm.cobrancas?.[0];
  const ass = adm.assinaturas?.[0];
  let paymentId = cob?.asaas_payment_id;
  let payment;
  if (!paymentId && ass?.asaas_subscription_id) {
    const pr = await fetch(`${env.ASAAS_BASE_URL}/subscriptions/${ass.asaas_subscription_id}/payments?limit=1`, { headers: { access_token: asaasKeyFull } });
    payment = (await pr.json()).data?.[0];
    paymentId = payment?.id;
  }
  if (paymentId) {
    const evId = 'evt_teste_' + Date.now();
    const pay = payment || { id: paymentId, value: 59.9, dueDate: cob.vencimento, status: 'PENDING', billingType: 'PIX', subscription: ass?.asaas_subscription_id, customer: null };
    const ev = { id: evId, event: 'PAYMENT_CREATED', dateCreated: new Date().toISOString().replace('T', ' ').slice(0, 19), payment: pay };
    r = await fetch(base + '/api/asaas/webhook', { method: 'POST', headers: { 'Content-Type': 'application/json', 'asaas-access-token': env.ASAAS_WEBHOOK_TOKEN }, body: JSON.stringify(ev) });
    ok('webhook valido = 200', r.status === 200, `status=${r.status}`);
    await sleep(2500);
    r = await fetch(base + '/api/asaas/webhook', { method: 'POST', headers: { 'Content-Type': 'application/json', 'asaas-access-token': env.ASAAS_WEBHOOK_TOKEN }, body: JSON.stringify(ev) });
    ok('webhook repetido (idempotente)', r.status === 200, `status=${r.status}`);
    await sleep(1000);
    r = await fetch(base + '/api/admin/financeiro', { headers: { Authorization: 'Bearer ' + env.FIN_ADMIN_TOKEN } });
    const adm2 = await r.json();
    const e = adm2.eventos?.find((x) => x.asaas_event_id === evId);
    ok('evento gravado e processado', Boolean(e?.processado_em), `resultado=${e?.resultado}`);
    ok('cobranca no banco', adm2.cobrancas?.some((c) => c.asaas_payment_id === paymentId), `total_cobrancas=${adm2.cobrancas?.length}`);
  } else {
    ok('cobranca real encontrada para simular webhook', false, 'sem payment id');
  }
} catch (e) {
  out.push('ERRO no teste: ' + String(e?.message || e).slice(0, 300));
} finally {
  srv.kill();
  console.log(out.join('\n'));
  const logSafe = log.split('\n').filter((l) => /fin\/|error|Error|listening|Server/i.test(l)).slice(0, 15).join('\n');
  console.log('--- log do servidor (filtrado) ---\n' + logSafe);
}
