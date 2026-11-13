# Lolo Café — redesign e validação Cloudflare

Data: 2026-11-13. Branch de trabalho: `work`. Implementação: `875f45e`.

## Resultado e limites

Redesign implementado e validado no Worker local com Chromium real. Desenvolvimento,
compilação, tipagem, lint, empacotamento Cloudflare e testes de navegador funcionam.
**A integração na main foi realizada por fast-forward após autorização do usuário.**
O deploy direto foi tentado e bloqueado por ausência de autenticação Cloudflare.
A suíte completa ainda tem duas falhas de integração Neon. A versão publicada não
pôde ser validada remotamente; uma publicação automática externa após o push não foi confirmada.

## Diagnóstico do run / Cloudflare

Stack encontrada: React 19, TanStack Start, Vite 8, Nitro com preset Cloudflare,
Wrangler 4.161.0. Node 24.22.1 e npm 11.9.0. O build gera
`.output/server/index.mjs`, `.output/public` e `.output/server/wrangler.json`;
`ASSETS` e `DEFAULT_TENANT_ID` são os bindings declarados. Não foi encontrado
um script literalmente chamado `run`.

### 1. Wrangler não consegue gravar sua configuração

Reprodução: `npm run cf:preview -- --ip 0.0.0.0 --port 8787`.
Mensagem: `ENOENT: no such file or directory, mkdir '/home/agent/.config/.wrangler'`.
O diretório padrão do usuário não permite a criação do estado necessário nesta máquina.

Correção: `scripts/cloudflare.mjs` preserva a configuração normal quando gravável;
caso contrário, usa `XDG_CONFIG_HOME` em `.wrangler/config`, já ignorado pelo Git.
A configuração explícita do usuário continua sendo respeitada. O wrapper é usado
pelos comandos de preview e deploy via Wrangler. Não foram desabilitados logs,
verificação TLS ou verificações de integridade.

Evidência: [log original](docs/qa/logs/cloudflare-original.log).

### 2. Vite preview procura um artefato que esse adapter não gera

Reprodução: `npm run preview -- --host 0.0.0.0 --port 4173`, seguido de GET `/`.
O processo inicia, mas responde HTTP 500:
`ERR_MODULE_NOT_FOUND: Cannot find module '.../dist/server/server.js'`.
O plugin de preview do TanStack espera o servidor padrão; o projeto gera um Worker Nitro.

Correção: `npm run preview` agora executa Wrangler com a configuração gerada pelo
build, na porta 4173. `npm run cf:preview` permanece disponível na porta padrão 8787.
Não foi criado um arquivo falso em `dist` para mascarar o problema.

Evidência: [log original](docs/qa/logs/vite-preview-original.log).

### 3. Regressão de GSAP detectada e corrigida durante o trabalho

A primeira implementação com imports estáticos das novas animações passava no Vite,
mas o Worker retornava HTTP 500: `Disallowed operation called within global scope`.
GSAP inicializava um timer durante o carregamento do módulo, proibido no Worker.

Correção: GSAP, ScrollTrigger, `@gsap/react` e a inicialização do Lenis ficam em
`src/components/cafe-motion.tsx`, carregado por `React.lazy` dentro de `ClientOnly`.
O conteúdo continua renderizado pelo servidor; a camada de movimento só inicializa
no navegador. A validação final foi feita no Worker, não apenas no servidor Vite.

Evidência: [regressão capturada](docs/qa/logs/worker-gsap-regression.log) e
[matriz final HTTP 200](docs/qa/browser-results.json).

### Produção

A URL informada é <https://lolocafe.mi-c-openheimer.workers.dev/>. Tanto ela quanto
<https://moendacafe.com.br/> foram bloqueadas pelo proxy com HTTP 403 no CONNECT.
Não foi possível estudar a referência remota nem determinar se o erro original em
produção tem a mesma causa das falhas locais acima. Não alego que a produção foi corrigida.
`api.cloudflare.com` também está bloqueado nesta política de rede.

## Redesign entregue

- Tokens de creme `#F4EBDD`, bege `#E6D5BC`, café `#3A261D`, marrom secundário
  `#79543B` e champagne `#C5A06A`. Ouro usado como ornamento, sem texto de baixo contraste.
- Tipografia Cormorant Garamond, Jost e Great Vibes hospedada localmente. Nenhuma
  dependência de Google Fonts para a renderização.
- Hero com PNG recortado existente, splash inteiro, órbitas, selo, grãos e colher,
  rosetas vetoriais e dois CTAs com área clicável clara. Sem fachada gerada.
- Marquee amplo com dois grupos idênticos para loop contínuo e alternativa estática
  com conteúdo reorganizado em movimento reduzido.
- The Lolo Counter com plataforma elíptica, item central e escolhas laterais;
  no mobile, navegação por botões de 44 px. Sem preços inventados.
- Fotos reais organizadas em alimentos/bebidas, ambiente e visita. A fachada fica
  exclusivamente em Visit us. Legendas e alt descrevem os assuntos reais das fotos.
- Narrativa em quatro etapas; palco visual sticky no desktop e passos naturais
  com imagens no mobile, sem pinning que bloqueie a rolagem.
- Header sticky com navegação ativa, correção do estado no fim da página e menu mobile.
- Horários, endereço exato, estoque e disponibilidade não foram apresentados como
  confirmados. O Instagram já presente no repositório é o contato para confirmação.
- Os sete derivados WebP das fotos somam 239.986 bytes, frente a 2.327.947 bytes dos
  PNGs correspondentes: redução de 89,7%. Originais e PNGs promocionais foram preservados.

## Animações efetivamente implementadas

Em `src/components/cafe-motion.tsx`: entrada escalonada do hero; parallax do splash
e dos grãos com ScrollTrigger; troca animada de imagem, detalhes e grãos do menu;
entrada das fotografias; troca de cenas da narrativa ao rolar para baixo e para cima.
Lenis usa o ticker do GSAP e atualiza ScrollTrigger. A versão instalada já considera
`scroll-padding`, por isso foi removido um offset duplicado que deslocava as âncoras.
Os contextos, triggers, listeners e ticker são limpos ao desmontar; posições são
atualizadas após fontes e imagens. Mudanças de `prefers-reduced-motion` são respeitadas
sem exigir reload. A transição visual das cenas usa CSS e é desativada nesse modo.

Não usei Framer Motion nem Three.js: não agregariam uma interação necessária a este
fluxo. Genjutsu não foi encontrada entre as skills instaladas. Foram consultadas as
skills frontend-design, apple-design e gsap-scrolltrigger. A referência externa
Moenda não foi acessível; não copiei seus textos, identidade ou código.

## Pickup honesto e segurança

O fluxo antigo gerava uma confirmação e um identificador no cliente sem persistir
um pedido no servidor. Isso foi removido. A interface identifica claramente
**Demo only — no order will be sent**.

O carrinho permite adicionar, aumentar, diminuir e remover itens, com persistência
local. A restauração aceita apenas IDs conhecidos, usa os dados do catálogo em vez
de nomes/URLs armazenados, limita quantidades inteiras a 20 e trata armazenamento
indisponível com mensagem explícita. O modal nativo contém o foco, fecha com Escape
e devolve o foco ao controle de origem.

Campos de contato e horário estão preparados, mas desabilitados, assim como a
submissão. Não há coleta de cartão, confirmação falsa, reserva de estoque ou promessa
de horário. O projeto não oferece uma API de pedidos funcional nem regras comerciais
confirmadas; nenhuma migration ou infraestrutura nova foi criada.

Removi credenciais literais de conexão de `src/lib/db.ts` e `.env.example`.
A conexão agora requer binding autorizado de `DATABASE_URL` ou `NEON_DATABASE_URL`.
Não alterei credenciais no provedor. Como os valores antigos já estavam no histórico,
o responsável deve revogá-los/rotacioná-los no serviço gerenciado; o histórico não foi reescrito.

## Validação executada

| Comando / verificação                                        | Resultado                                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `npm ci --cache /workspace/.npm`                             | Passou; instalação repetível com lockfile                                       |
| `npm run build`                                              | Passou; Worker e assets gerados                                                 |
| `npm run lint`                                               | Exit 0; zero erros, seis avisos preexistentes de Fast Refresh em componentes UI |
| `npm run typecheck`                                          | Passou; corrigidos cinco acessos a env incompatíveis com a configuração estrita |
| `NODE_USE_ENV_PROXY=1 npm test`                              | 11 testes executados: 9 passaram, 2 falharam; nenhum foi removido ou pulado     |
| `npm run deploy:wrangler -- --dry-run`                       | Passou; validação local do pacote, sem publicação                               |
| GET no Vite de desenvolvimento                               | HTTP 200 com conteúdo SSR esperado                                              |
| GET no Worker de preview                                     | HTTP 200 com conteúdo SSR esperado                                              |
| `QA_BASE_URL=http://127.0.0.1:4173 ... npm run test:browser` | Passou no Worker com Chromium real                                              |
| `git diff --check`                                           | Passou                                                                          |

Os dois testes que falham são os existentes em `src/test/neon-services.test.ts`:
consulta ao tenant/produtos e saúde do JWKS Neon Auth. Não há binding de banco
injetado; os serviços Neon externos também não estão acessíveis pela política atual.
As asserções não foram relaxadas nem os testes excluídos. Esses resultados não
comprovam um defeito da nova vitrine; bloqueiam afirmar que a integração está pronta.

A matriz de navegador cobriu 320, 375, 768, 1024, 1440 e 1920 px. Verificou HTTP 200,
nenhum overflow horizontal, imagens visíveis carregadas, seleção do menu, quantidades,
recarga/persistência, esvaziamento, submissão desabilitada, foco e Escape do modal,
menu mobile, âncoras e estado ativo. Também exercitou resize, volta no histórico,
rolagem reversa da narrativa e troca de preferência de movimento. Resultado final:
**nenhum pageerror, console.error ou HTTP de recurso com falha**.

Contrastes calculados dos tokens: café/creme 12,05:1; marrom secundário/creme 5,65:1;
marrom secundário/bege 4,65:1; texto claro/CTA café 13,11:1. Foco visível e alvos
principais de pelo menos 44 px. Esta é uma auditoria funcional/visual em Chromium;
não foi executada medição de 60 fps, Lighthouse ou teste em iPhone físico.

## Evidências

- [Antes, desktop](docs/qa/before-desktop.webp)
- [Hero desktop](docs/qa/hero-desktop.webp) e [hero mobile](docs/qa/hero-mobile.webp)
- [Página mobile completa](docs/qa/full-mobile.webp)
- [Counter](docs/qa/counter-desktop.webp), [galeria](docs/qa/food-desktop.webp),
  [narrativa](docs/qa/ritual-desktop.webp), [ambiente](docs/qa/atmosphere-desktop.webp)
  e [fachada mobile](docs/qa/visit-mobile.webp)
- [Resultados estruturados](docs/qa/browser-results.json) e [log do navegador](docs/qa/logs/browser.log)
- Logs: [install](docs/qa/logs/install.log), [build](docs/qa/logs/build.log),
  [lint](docs/qa/logs/lint.log), [tipagem](docs/qa/logs/typecheck.log),
  [Vitest](docs/qa/logs/vitest.log), [dry-run](docs/qa/logs/cloudflare-dry-run.log)
  e [autenticação](docs/qa/logs/cloudflare-auth.log).

Capturas PNG completas de todas as larguras e seções também estão em
`/workspace/lolo-evidence/final`; a seleção acima acompanha o repositório em WebP.

## Arquivos e Git

Mudanças principais: `src/routes/index.tsx`, `src/styles.css`,
`src/components/cafe-motion.tsx`, `src/routes/__root.tsx`, `src/lib/pickup.ts`,
`src/lib/db.ts`, `src/lib/auth.ts`, `src/test/pickup-validation.test.ts`,
`scripts/cloudflare.mjs`, `scripts/qa-browser.mjs`, `package.json`, `package-lock.json`,
`.env.example`, `.gitignore`, `README.md`, `public/favicon.png` e sete fotos otimizadas.
Evidências e este relatório ficam em `docs/qa/` e `RELATORIO_FINAL.md`.
Os lockfiles npm e Bun foram sincronizados; Bun 1.2.15 foi validado após a falha de instalação no CI, conforme a atualização abaixo.

O checkout estava limpo em `ba93929` antes do trabalho. Commit local de implementação:
`875f45e` — `feat: redesign Lolo Cafe and fix Cloudflare preview runtime`.
O relatório e as evidências são registrados em um commit documental separado.
Após autorização explícita do usuário, os dois commits foram integrados à `main`
remota por fast-forward, sem conflitos, force push ou rebase. O remoto foi confirmado
em `d3f049b278b44d8a5ce0b8e4ef32371fc853d134` antes desta atualização documental.

## Atualização após autorização de merge e deploy

- `git fetch origin main`: a main permanecia em `ba93929`; nenhuma alteração remota concorrente.
- `git merge-base --is-ancestor origin/main HEAD`: passou.
- `git push origin HEAD:refs/heads/main`: passou, avanço `ba93929..d3f049b`.
- `git ls-remote origin refs/heads/main`: confirmou os commits no remoto.
- `NODE_USE_ENV_PROXY=1 npm test`: novamente 9 passaram e 2 falharam na integração Neon.
  A autorização para integrar foi dada pelo usuário após essas falhas terem sido informadas.
- `node scripts/cloudflare.mjs whoami`: confirmou ausência de autenticação.
- `CI=1 npm run deploy:wrangler`: exit 1, com exigência explícita de
  `CLOUDFLARE_API_TOKEN` no ambiente não interativo. Nenhum deploy direto concluído.
- A sondagem HTTPS de `api.cloudflare.com/client/v4/user` foi negada pelo proxy
  com HTTP 403 no CONNECT. A política efetiva ainda não inclui esse destino.
- A API GitHub também está bloqueada pela rede, embora Git fetch/push funcione;
  não foi possível observar pipelines externos pela API.

Evidências: [tentativa de deploy](docs/qa/logs/release-deploy.log) e
[testes reexecutados](docs/qa/logs/release-tests.log). Não foi usado `--temporary`,
pois criaria um destino diferente do Worker autorizado.

## Correção da instalação congelada no Cloudflare

O log de CI fornecido pelo usuário mostrou falha antes da compilação:
`bun install --frozen-lockfile` com Bun 1.2.15 retornava
`error: lockfile had changes, but lockfile is frozen`.
A validação inicial cobriu npm e deixou `bun.lock` desatualizado. O Cloudflare
seleciona Bun quando encontra esse arquivo, portanto o npm lockfile correto não
foi suficiente para esse pipeline.

Reproduzi o erro com a mesma versão Bun 1.2.15 em `/tmp/lolo-bun-check`, sem alterar
as dependências instaladas no checkout de desenvolvimento. Nesse diretório isolado,
regerei `bun.lock` pela migração suportada de `package-lock.json` usando
`bun install --lockfile-only --save-text-lockfile`. O novo lockfile preserva as
versões resolvidas pelo npm e todos os requisitos do manifesto.

Validação com instalação limpa:

- `bun install --frozen-lockfile`: passou; 578 pacotes instalados.
- `bun run build`: passou; Worker, assets e configuração Wrangler gerados.
- Nenhum manifesto, versão de dependência, checksum ou proteção de instalação foi
  alterado para contornar a falha. O comando congelado permanece ativo no CI.

O novo `bun.lock` foi copiado ao repositório para corrigir a próxima instalação no
Cloudflare. Isso valida a correção local; o resultado do próximo pipeline remoto
não foi observado nesta sessão, devido ao bloqueio da API GitHub/Cloudflare.

Evidências: [reprodução](docs/qa/logs/bun-frozen-before.log),
[instalação congelada corrigida](docs/qa/logs/bun-frozen-after.log) e
[build com Bun](docs/qa/logs/bun-build.log).

## Pendências concretas para publicação

1. Aplicar acesso de rede aos serviços Neon, a `api.cloudflare.com` e ao hostname
   público do Worker. Para comparação com a referência, liberar também `moendacafe.com.br`.
2. Disponibilizar a conexão Neon autorizada e os dados esperados pelos testes via
   configuração segura do projeto. Não fornecer valores em chat ou no Git.
3. Autenticar a Cloudflare pelo wrapper (`node scripts/cloudflare.mjs login`) ou por
   bindings seguros de `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`.
   `whoami` confirmou ausência de autenticação; não inferi isso apenas pela ausência de variáveis.
4. Reexecutar as integrações após essas mudanças. Somente com os checks necessários
   passando, seguir a política de merge, publicar pelo pipeline existente e verificar
   HTTP e funcionalidades na URL de produção.
5. Para ativar pedidos reais, confirmar catálogo/preços, disponibilidade, política de
   retirada e backend de pedidos com persistência, validação e idempotência no servidor.
   Até isso existir, o modo demonstração deve permanecer explícito.
