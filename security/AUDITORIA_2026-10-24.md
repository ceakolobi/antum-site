# AUDITORIA DE SEGURANÇA — antum-site (landing /marina-sdr) — 2026-10-24 — nível RÁPIDO + fases tocadas

Status: PRONTO para publicar (0 CRÍTICO, 0 ALTO abertos). Itens NÃO VERIFICADO listados no fim.
Ambiente de teste: servidor de produção local (NODE_ENV=production, porta 4173). Nada foi testado contra o site em produção.

## Inventário (F0)
- Stack: React 19 + Vite + Express (server.ts), Docker, EasyPanel (app siteantum), Cloudflare na frente.
- Superfícies novas: GET /marina-sdr (estática), POST /api/marina-trial, redirect 301 /marina-teste.
- Dados pessoais coletados: nome, WhatsApp, e-mail, empresa (opcional), com consentimento (LGPD).
- Destino: Supabase, função submit_site_lead (mesma do formulário de contato), com chave publicável (pública por desenho).

## Resultados
| Fase | Item | Resultado | Evidência |
|---|---|---|---|
| F1 | Segredos no código | OK | git grep (JWT, service_role, sk-) sem achados; JWT legado removido de MarinaTeste.tsx; .env fora do git |
| F1 | Segredos no bundle dist | OK | grep "eyJhbGci" em dist sem resultado |
| F2 | npm audit --omit=dev | OK (corrigido) | Antes: 3 HIGH (vite 6.4.3 / launch-editor). `npm audit fix` -> vite 6.4.5, 0 vulnerabilidades; build refeito |
| F3 | Revisão do código novo | OK | Sem innerHTML/eval; textContent no front; erro de banco NÃO é engolido (retorna 502) |
| F4 | RLS marina_trials | OK | anon SELECT -> [] ; anon PATCH/DELETE -> [] (0 linhas) ; anon INSERT -> 401 (RLS bloqueia) |
| F7 | Origin inválida | OK | Origin evil.example -> 403; sem Origin -> 403 |
| F7 | Entrada inválida | OK | 400 com mensagens por campo |
| F7 | Honeypot | OK | campo "website" preenchido -> 200 sem gravar |
| F7 | Payload grande | OK | 30 KB -> 413 (limite 20 KB) |
| F7 | Rate limit | OK | 6ª requisição em 10 min do mesmo IP -> 429; teto global 200/h |
| F7 | Duplicado | OK | mesmo WhatsApp em 24h -> 200 sem nova gravação |
| F8 | Headers | OK | /marina-sdr: CSP estrita, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options DENY, HSTS |
| F8 | Página sob a CSP | OK | Chrome: sem erros de console, fontes/imagens/form funcionando |
| F15 | LGPD | OK | checkbox de consentimento obrigatório + links Termos/Privacidade |

## Achados
- [MÉDIO] M-01 — marina_trials bloqueia INSERT anônimo (RLS). O formulário antigo (/marina-teste) provavelmente não gravava inscritos. Correção: o novo endpoint grava via submit_site_lead (testado: grava). Cadastros caem na tabela de leads do site com solution_of_interest "Marina SDR - teste 7 dias gratis", e NÃO em marina_trials.
- [BAIXO] B-01 — Rate limit em memória (zera ao reiniciar; IP vem de cf-connecting-ip ou req.ip). Teto global mitiga. Melhorar com regra de rate limit no Cloudflare.
- [BAIXO] B-02 — package-lock.json não está versionado (já era assim). Recomendado versionar.
- [INFO] Chave publicável do Supabase está no código/default do server (pública por desenho).

## Linhas de teste criadas no banco (para apagar)
- 2 leads "TESTE SEGURANCA ANTUM" (WhatsApp 47900000001) em submit_site_lead (1 via RPC direto, 1 via endpoint).

## Não verificado
- Headers e redirect HTTP->HTTPS em produção (só após deploy; Cloudflare pode adicionar/alterar).
- Gitleaks/semgrep não instalados no PC; substituídos por git grep + revisão manual.
- Teste de restauração de backup do Supabase (sem acesso).

## Atualização 2026-10-25
- Decisão do Eduardo: a landing não coleta mais dados. Todos os botões levam a https://sdr.antum.com.br/ (cadastro e teste no painel). Formulário e endpoint POST /api/marina-trial REMOVIDOS (superfície de ataque menor; achados M-01 e B-01 deixam de se aplicar à landing).
- Links de cadastro recebem UTM (utm_source=landing, utm_medium=marina-sdr + campanha real, se houver).
- NOTA: sdr.antum.com.br exibe '500+ empresas atendidas' e '4,8 estrelas' sem comprovação visível; revisar (risco de propaganda enganosa).
