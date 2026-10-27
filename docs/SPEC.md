# Spec: Landing page do Comandou (v1)

## Contexto
O Comandou (SaaS de comandas para restaurantes, com `comandou-web` em Angular e `comandou-api`) não tem uma página pública que apresente o produto. Hoje `comandou.app.br` redireciona para `www.comandou.app.br`, que serve o próprio app (o painel Master fica em `/master`).
O design já está definido e validado em `comandou-landing/design-refs/`:
- `b-system-landing.md`: spec visual, componentes e estrutura de seções.
- `landing-tokens.css`: tokens, só aliases de `--b-*`.
- `preview.html`: componentes funcionando, testados em desktop e mobile.

**Objetivo da v1:** uma landing estática, rápida e indexável, que leva o dono de restaurante a chamar no WhatsApp para pedir uma demonstração. Ela é publicada como preview na Vercel. A troca de domínio fica fora do escopo.

## Decisões (confirmadas com o usuário)
| Tema | Decisão |
|---|---|
| Stack | HTML + CSS + JS puro, sem build. Evolui a partir de `preview.html` |
| CTA | WhatsApp (`wa.me`) com mensagem pronta, usando o número pessoal do usuário (`5516991244009`) por enquanto, em **uma constante** (`CONTATO.whatsapp`) |
| Domínio | A landing fica em **`www.comandou.app.br`** (canônico); `comandou.app.br` redireciona para o www. O Master vai para `master.comandou.app.br`, e `/master` na landing redireciona para lá (307) |
| Preços | Fora da v1 |
| Números e depoimentos | Fora da v1, até existir dado real (regra da spec visual) |
| Telas do produto | **Mocks em HTML** (vindos da `preview.html`), não screenshots. O banco local não é tocado. Screenshots reais ficam para depois |

## Estrutura do projeto (`comandou-landing/`)
```
index.html            # página única com todas as seções e o sprite SVG dos ícones
css/b-system.css      # cópia de comandou-web/src/assets/b-system/colors_and_type.css (cabeçalho com a origem)
css/landing.css       # landing-tokens.css + componentes portados de design-refs/preview.html
js/main.js            # CONTATO, link do WhatsApp, header ao rolar, tabs, reveal, menu mobile
assets/logo/          # SVGs de docs/logo/kit/ (horizontal, horizontal-white, stacked-white)
assets/icons/         # favicons e ícones de docs/logo/kit/web/ + site.webmanifest
assets/og.png         # imagem 1200×630 para compartilhamento
robots.txt, sitemap.xml, vercel.json, .vercelignore (ignora refs/, design-refs/, docs/), README.md
docs/SPEC.md          # esta spec, versionada no repo
```

**Reuso, sem recriar:**
- Tokens: `comandou-web/src/assets/b-system/colors_and_type.css` (cópia) e `design-refs/landing-tokens.css`.
- Componentes, CSS e JS (tabs com teclado, reveal com IntersectionObserver, header com blur, fluxo SVG com pulso): `design-refs/preview.html`.
- Marca: `docs/logo/kit/` e `docs/logo/kit/web/head-snippet.html`, seguindo as regras do `GUIA-DE-USO.md` (logo horizontal com no mínimo 96px, branca sobre café).
- Ícones: Lucide **inline** num sprite `<symbol>` com só os ~20 ícones usados, sem CDN nem JS de runtime.

## Seções (conteúdo da v1)
| # | Seção | Faixa | Componentes (spec em `b-system-landing.md` §3) |
|---|---|---|---|
| 1 | Header | bg, sticky | `l-header`: âncoras, "Entrar" (link para o app atual) e CTA |
| 2 | Hero | bg | **Vídeo do brag em destaque no topo** (`l-video`): loop, tenta tocar com o som original e, se o navegador bloquear, toca mudo com o botão "Ativar som". Pausa fora da tela. Depois vêm eyebrow, H1, lead e os CTAs. As abas por função saíram, porque a seção 5 já cobre isso |
| 3 | Como funciona | sunken | `l-flow` Garçom → Cozinha → Caixa |
| 4 | Antes × depois | bg | `l-old-new` + título em dois tons |
| 5 | Por perfil | sunken | 4 blocos alternados (texto + mock da tela), cada um com `l-feature-trio`, baseado em `docs/FUNCIONALIDADES.md` |
| 6 | Instala no celular | bg | `l-device` (tablet com a Cozinha e celular com o Garçom) + bullets do PWA |
| 7 | CTA final + footer | café (`--b-fg`) | `l-cta-final`, `l-footer` (logo branca, © e contato) |

Copy em PT-BR, sentence case, falando com "você", sem jargão (regras da spec §5). O link do WhatsApp fica `https://wa.me/<CONTATO.whatsapp>?text=<encodeURIComponent("Olá! Quero ver o Comandou funcionando no meu restaurante.")>`, com `target="_blank" rel="noopener"`.

## Etapas
1. **Scaffold:** criar a estrutura acima, copiar os tokens e os assets de marca, salvar esta spec em `docs/SPEC.md` e rodar `git init`.
2. **Base:** portar o CSS e o JS da `preview.html` para `css/landing.css` e `js/main.js`, tirando as faixas "spec" e a tabela de tokens da preview. Criar o sprite de ícones e o menu mobile (drawer com scrim, como a spec do `l-header` pede).
3. **Conteúdo:** escrever as seções 1 a 7 no `index.html` com a copy final, colocar `data-rise` nos blocos e a constante `CONTATO` em `main.js`.
4. ~~Screenshots reais~~: **substituídos por mocks em HTML** (decisão do usuário, 2026-10-27: não mexer no banco local).
5. **SEO e meta:** `<title>`, meta description, canonical, Open Graph e Twitter card com `og.png`, JSON-LD `SoftwareApplication`, `lang="pt-BR"`, um único `h1`, favicons do kit, `robots.txt` e `sitemap.xml`. Nunito via Google Fonts com `preconnect` e `display=swap`, igual ao app.
6. **Deploy de preview:** `vercel.json` (cache longo em `/assets/*`, `cleanUrls`) e `.vercelignore`. Criar o repo `Raiz-Labs/comandou-landing` e fazer o deploy na Vercel **só com a confirmação do usuário**. O plugin da Vercel precisa ser autorizado via `/mcp`, ou o usuário faz login com o `vercel` CLI.

## Verificação
- **Playwright local** (`comandou-web/node_modules/playwright`, `file://` ou `npx serve`) em 1440×900 e 390×844:
  - nenhum erro de console e nenhuma requisição falhando;
  - sem overflow horizontal: `scrollWidth <= innerWidth`;
  - todos os `[data-rise]` recebem `.is-in` depois de rolar a página;
  - tabs: clique e ←/→ trocam `aria-selected` e o painel;
  - o CTA tem `href` começando com `https://wa.me/` e o número configurado;
  - o menu mobile abre e fecha, e o Esc fecha;
  - screenshots full-page dos dois tamanhos para revisão visual.
- **`prefers-reduced-motion: reduce`** (emulado no Playwright): nada animando, todos os blocos visíveis.
- **Lighthouse** (`npx lighthouse <url> --preset=desktop` e mobile): meta é Performance ≥ 95, Acessibilidade e SEO = 100.
- **Contraste:** `--b-fg-subtle` só em texto de 24px ou mais (título em dois tons). O resto usa `--b-fg` ou `--b-fg-muted`.
- **Depois do deploy:** abrir a URL de preview no navegador interno, testar o CTA no mobile e validar a prévia de compartilhamento (OG).

## Fora do escopo (próximas etapas)
- **Troca de domínio:** a landing vai para `comandou.app.br`/`www` e o Master para um subdomínio. Antes, criar uma lista de **slugs reservados** em `comandou-api/src/modules/master/master.schemas.ts` (`www`, `master`, `app`, `api`, `admin`). Hoje nada impede um tenant de usar esses nomes.
- Screenshots reais das telas, no lugar dos mocks.
- Número corporativo (chip com WhatsApp Business): é trocar só `CONTATO.whatsapp`.
- Seções de números, depoimentos e preços, quando houver dado real.
- Analytics: Vercel Web Analytics, que não usa cookie e não precisa de banner.

## Crédito
A música do vídeo é de Sascha Ende (ende.app), sob CC BY 4.0. O crédito fica no footer e é obrigatório enquanto o vídeo tiver áudio.
