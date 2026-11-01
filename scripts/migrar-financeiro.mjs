// Migração do banco do módulo financeiro (Postgres próprio no EasyPanel).
// Rode UMA vez no console do app "siteantum":  node scripts/migrar-financeiro.mjs
//
// Variáveis de ambiente TEMPORÁRIAS (defina, rode, e REMOVA depois):
//   FIN_ADMIN_DB_URL  = postgres://USUARIO_ADMIN:SENHA_ADMIN@HOST_INTERNO:5432/antum_fin   (do painel "Credenciais" do serviço)
//   FIN_APP_PASSWORD  = senha NOVA do papel antum_fin (>= 24 caracteres; use só letras e números)
// Opcional: FIN_DB_SSL=true  (só se o banco exigir SSL)
//
// O script nunca imprime senhas. É idempotente: pode rodar de novo sem duplicar nada.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'supabase');
const adminUrl = (process.env.FIN_ADMIN_DB_URL || '').trim();
const appPwd = (process.env.FIN_APP_PASSWORD || '').trim();

function falha(msg) {
  console.error(`ERRO: ${msg}`);
  process.exit(1);
}
if (!adminUrl) falha('defina FIN_ADMIN_DB_URL (URL de administrador do banco).');
if (appPwd.length < 24) falha('FIN_APP_PASSWORD precisa ter 24+ caracteres.');
if (!/^[A-Za-z0-9]+$/.test(appPwd)) falha('FIN_APP_PASSWORD: use apenas letras e números (evita problemas na URL).');

const arquivos = fs.readdirSync(dir).filter((f) => /^financeiro_\d+.*\.sql$/.test(f)).sort();
if (!arquivos.length) falha(`nenhum arquivo financeiro_*.sql em ${dir}`);

const client = new pg.Client({
  connectionString: adminUrl,
  ssl: process.env.FIN_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 8000,
});

try {
  await client.connect();
  await client.query(
    'create table if not exists public.antum_migracoes (nome text primary key, aplicada_em timestamptz not null default now())',
  );
  for (const arq of arquivos) {
    const ja = await client.query('select 1 from public.antum_migracoes where nome = $1', [arq]);
    if (ja.rowCount) {
      console.log(`= ${arq}: já aplicada`);
      continue;
    }
    const sql = fs.readFileSync(path.join(dir, arq), 'utf8');
    try {
      await client.query('begin');
      await client.query(sql);
      await client.query('insert into public.antum_migracoes (nome) values ($1)', [arq]);
      await client.query('commit');
      console.log(`+ ${arq}: aplicada`);
    } catch (e) {
      await client.query('rollback').catch(() => {});
      falha(`${arq}: ${e.message}`);
    }
  }
  // Define a senha do papel restrito do site (antum_fin).
  await client.query(`alter role antum_fin with login password ${client.escapeLiteral(appPwd)}`);
  const t = await client.query("select count(*)::int n from pg_tables where schemaname = 'financeiro'");
  console.log(`OK: schema financeiro com ${t.rows[0].n} tabelas; senha do papel antum_fin definida.`);
  console.log('Próximo passo: defina FIN_DATABASE_URL no app e REMOVA FIN_ADMIN_DB_URL e FIN_APP_PASSWORD.');
} catch (e) {
  falha(e.message);
} finally {
  await client.end().catch(() => {});
}
