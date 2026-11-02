// Cria (ou redefine a senha de) um administrador do painel Antum.
// Rode no console do app "siteantum":   node scripts/criar-admin.mjs seu@email.com
// A senha é digitada aqui, escondida, e guardada só como hash forte (nunca em texto puro).
import crypto from 'node:crypto';
import readline from 'node:readline';
import pg from 'pg';

const email = String(process.argv[2] || '').trim().toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
  console.error('Uso: node scripts/criar-admin.mjs seu@email.com');
  process.exit(1);
}
const url = (process.env.FIN_DATABASE_URL || '').trim();
if (!url) {
  console.error('ERRO: FIN_DATABASE_URL não está definida neste app.');
  process.exit(1);
}

function secreto(pergunta) {
  return new Promise((ok) => {
    if (!process.stdin.isTTY) {
      const rl = readline.createInterface({ input: process.stdin });
      rl.once('line', (l) => { rl.close(); ok(l); });
      return;
    }
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (rl.mudo) rl.output.write(s.includes('\n') ? s : '*'); else rl.output.write(s); };
    process.stdout.write(pergunta);
    rl.mudo = true;
    rl.question('', (v) => { rl.close(); process.stdout.write('\n'); ok(v); });
  });
}

const senha = process.env.FIN_NOVA_SENHA || (await secreto('Senha nova (mínimo 12 caracteres): '));
if (senha.length < 12 || !/[A-Za-z]/.test(senha) || !/\d/.test(senha)) {
  console.error('ERRO: a senha precisa ter 12+ caracteres, com letras e números.');
  process.exit(1);
}
if (!process.env.FIN_NOVA_SENHA) {
  const de_novo = await secreto('Repita a senha: ');
  if (de_novo !== senha) {
    console.error('ERRO: as senhas não conferem.');
    process.exit(1);
  }
}

const N = 16384, r = 8, p = 1;
const salt = crypto.randomBytes(16);
const k = await new Promise((ok, no) =>
  crypto.scrypt(senha.normalize('NFKC'), salt, 64, { N, r, p, maxmem: 64 * 1024 * 1024 }, (e, d) => (e ? no(e) : ok(d))),
);
const hash = `scrypt$${N}$${r}$${p}$${salt.toString('hex')}$${k.toString('hex')}`;

const ssl = process.env.FIN_DB_SSL ? process.env.FIN_DB_SSL === 'true' : /supabase\.(co|com)/i.test(url);
const client = new pg.Client({ connectionString: url, ssl: ssl ? { rejectUnauthorized: false } : false, connectionTimeoutMillis: 8000 });
try {
  await client.connect();
  const res = await client.query(
    `insert into financeiro.admins (email, senha_hash) values ($1, $2)
     on conflict (email) do update set senha_hash = excluded.senha_hash, falhas = 0, bloqueado_ate = null, ativo = true
     returning (xmax = 0) as novo`,
    [email, hash],
  );
  await client.query("insert into financeiro.auditoria (admin_email, acao, detalhe) values ($1, $2, '{}'::jsonb)", [
    email, res.rows[0].novo ? 'admin_criado' : 'admin_senha_redefinida',
  ]);
  console.log(`OK: administrador ${email} ${res.rows[0].novo ? 'criado' : 'com senha redefinida'}. Acesse https://antum.com.br/admin`);
} catch (e) {
  console.error('ERRO:', e.message);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
