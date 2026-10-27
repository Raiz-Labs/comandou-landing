# Spec: ajustes antes de divulgar a landing

- **Status:** item 1 em spec no comandou-web; itens 2 e 3 implementados (aguardando commit)
- **Data:** 2026-10-27
- **Repos:** `comandou-web` (item 1), `brag-output` + `comandou-landing` (item 2), `comandou-landing` (item 3)

## Contexto

A landing está no ar em `www.comandou.app.br`, com `comandou.app.br` redirecionando para o www. Ela já está cadastrada no Google Search Console e no Bing Webmaster. Antes de divulgar o link, três problemas precisam de correção:

1. Os subdomínios do app (`*.comandou.app.br`, projeto `comandou-web`) podem ser indexados com o título "Comandou" e competir com a landing.
2. O final do vídeo do hero mostra um domínio que não existe.
3. Não há como medir as visitas da landing.

---

## 1. noindex nos subdomínios do app

> **Movido para o comandou-web:** issue [Raiz-Labs/comandou-web#54](https://github.com/Raiz-Labs/comandou-web/issues/54), spec `comandou-web/docs/specs/54-noindex-subdominios.md`. A spec de lá é a que vale.

### Problema
O `comandou-web` responde em `*.comandou.app.br`, incluindo `master.`, `demo.` e cada restaurante. Ele não manda `X-Robots-Tag` nem `<meta name="robots">`. Como é uma SPA com rewrite total para `/index.html`, o `/robots.txt` devolve o HTML do app, e toda rota tem o `<title>Comandou</title>`.

Resultado: o Google pode indexar telas de login, do Master e de restaurantes com o nome da marca. Essas páginas disputam a busca "comandou" com a landing e expõem endereços internos.

### Decisão
- Cabeçalho `X-Robots-Tag: noindex` em todas as rotas do `comandou-web`, **menos `/cardapio`**. O cardápio público é a vitrine do restaurante, e aparecer no Google interessa ao cliente.
- No tenant de demonstração (`demo.comandou.app.br`), noindex em tudo, cardápio incluído, para o cardápio de exemplo não ser indexado.
- Usar cabeçalho, e não `Disallow` no robots.txt: com `Disallow` o Google não rastreia a página, logo nunca lê o noindex, e a URL ainda pode aparecer sem descrição.

### Mudança (`comandou-web/vercel.json`)
```json
"headers": [
  {
    "source": "/((?!cardapio).*)",
    "headers": [{ "key": "X-Robots-Tag", "value": "noindex" }]
  },
  {
    "source": "/(.*)",
    "has": [{ "type": "host", "value": "demo.comandou.app.br" }],
    "headers": [{ "key": "X-Robots-Tag", "value": "noindex" }]
  }
]
```
O `rewrites` atual continua igual. Os cabeçalhos são aplicados pelo caminho pedido, antes do rewrite para `/index.html`.

### Critérios de aceite
- [ ] `curl -sI https://master.comandou.app.br/master/login` traz `x-robots-tag: noindex`.
- [ ] `curl -sI https://<slug-real>.comandou.app.br/login` traz `x-robots-tag: noindex`.
- [ ] `curl -sI https://<slug-real>.comandou.app.br/cardapio` **não** traz `x-robots-tag`.
- [ ] `curl -sI https://demo.comandou.app.br/cardapio` traz `x-robots-tag: noindex`.
- [ ] `curl -sI https://www.comandou.app.br/` (landing, outro projeto) **não** traz `x-robots-tag`.
- [ ] Os assets do app (`/*.js`, `/icons/*`) continuam respondendo 200. O noindex neles não atrapalha.

### Fluxo
Branch em `comandou-web` a partir de `dev`, depois PR. O deploy de preview da Vercel permite validar os cabeçalhos antes do merge. Depois do deploy em produção, usar a Inspeção de URL do Search Console em `master.comandou.app.br/master/login` e confirmar "Excluída pela tag noindex".

### Fora do escopo
- `<title>` e meta description próprios por restaurante no cardápio (SEO do cardápio). Vale uma spec separada se os restaurantes pedirem.
- `robots.txt` no app. Hoje a resposta é HTML, que o Google trata como "sem restrições", e o noindex já resolve.

---

## 2. Corrigir o domínio no final do vídeo

### Problema
A cena de outro do vídeo do hero (17,9s a 21,6s) mostra **`seurestaurante.comandou.com.br`**. O domínio `.com.br` não é nosso: o produto usa `comandou.app.br`. Quem assiste e digita o endereço cai em lugar nenhum.

### Decisão
Trocar o texto por **`comandou.app.br`**, o endereço que a pessoa deve digitar para conhecer o produto. Usar o domínio sem `www`, que é mais curto e redireciona para a landing. O `seurestaurante.` sai: ele mostrava a ideia de subdomínio por restaurante, mas no vídeo de venda o que importa é a pessoa achar o site.

### Mudança
1. `brag-output/composition/index.html:283`: `<div id="o-url">comandou.app.br</div>`. Animação, posição e estilo continuam iguais (linhas 199 e 476).
2. Renderizar de novo: `cd brag-output/composition && npm run render`. Antes, rodar `npm run check`.
3. Atualizar `brag-output/brag-plan.md` e `brag-output/composition-brief.md`, que citam o domínio antigo.
4. Gerar de novo os arquivos da landing com os mesmos parâmetros da v1:
   - `assets/video/comandou.mp4`: H.264, áudio AAC original, `+faststart`;
   - `assets/video/comandou.webm`: VP9 com 1280px de largura, Opus 96k;
   - `assets/video/poster.jpg`: o mesmo quadro da v1, que não muda porque o poster é do começo do vídeo.

### Critérios de aceite
- [ ] O quadro de ~20s do vídeo novo mostra `comandou.app.br` sem cortes nem sobreposição.
- [ ] O tamanho dos arquivos fica próximo da v1 (mp4 ~1,3 MB, webm ~0,9 MB).
- [ ] A duração (21,6s), o áudio e o loop sem emenda continuam iguais.
- [ ] Na landing local (`python3 -m http.server 5173`), o vídeo toca nos dois formatos e o botão "Ativar som" funciona.
- [ ] Commit e push no `comandou-landing` só com a confirmação do usuário.

### Achado relacionado (fora do escopo)
`docs/FUNCIONALIDADES.md:7` e `comandou-web/src/app/features/master/login/master-login.component.ts:28` (placeholder `admin@comandou.com.br`) também usam `.com.br`. Os testes em `environment.spec.ts` usam `.com.br` só como exemplo de host, o que é inofensivo. Vale uma correção separada.

---

## 3. Analytics na landing (Vercel Web Analytics)

### Problema
Não sabemos quantas pessoas visitam a landing, de onde elas vêm nem quais páginas e dispositivos usam.

### Decisão
**Vercel Web Analytics**, que já vem com a hospedagem:
- não usa cookie nem guarda dados pessoais, então não precisa de banner de consentimento (LGPD);
- o script é pequeno (~1 KB) e é servido pelo próprio domínio, sem custo perceptível no Lighthouse;
- o plano Hobby é gratuito, com limite mensal de eventos muito acima do volume esperado.

**Limitação:** no Hobby **não há eventos personalizados**, então não dá para contar cliques no botão do WhatsApp. Para a v1, a referência é "visitantes → conversas que chegaram no WhatsApp", contadas à mão. Se for preciso medir o clique, as opções são o plano Pro ou um parâmetro na mensagem do WhatsApp (por exemplo `[site]`) para identificar a origem.

### Mudança
1. **Painel Vercel → projeto `comandou-landing` → Analytics → Enable.** É feito no navegador e não muda código.
2. `comandou-landing/index.html`, antes de `</head>`:
   ```html
   <script>window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };</script>
   <script defer src="/_vercel/insights/script.js"></script>
   ```
   Não é preciso pacote npm: a landing não tem build.
3. `README.md`: uma linha dizendo onde ver os dados.

### Critérios de aceite
- [ ] Depois do deploy, `https://www.comandou.app.br/_vercel/insights/script.js` responde 200.
- [ ] Ao abrir a landing, sai um `POST` para `/_vercel/insights/view` (ver no DevTools ou no Playwright).
- [ ] A visita aparece no painel Analytics do projeto em alguns minutos.
- [ ] Localmente (`python3 -m http.server`), o script dá 404 sem quebrar nada: nenhum erro de JS que afete a página e o vídeo continua funcionando.
- [ ] Lighthouse mobile da landing continua com Performance ≥ 95 e SEO = 100.

### Fora do escopo
- Speed Insights (Core Web Vitals reais). Com o tráfego atual o volume não justifica, e o Search Console já mostra os Core Web Vitals.
- Google Analytics e Meta Pixel, que usam cookie e exigiriam banner de consentimento.

---

## Ordem e entrega

| # | Repo | Entrega | Depende de |
|---|------|---------|-----------|
| 1 | `comandou-web` | PR para `dev` | — |
| 2 | `brag-output` + `comandou-landing` | vídeo renderizado de novo + commit na landing | — |
| 3 | `comandou-landing` + painel Vercel | commit na landing + Analytics habilitado | — |

Os três itens são independentes. O 2 e o 3 tocam o `comandou-landing` e podem sair juntos em um único push. O deploy é automático pela integração GitHub → Vercel.
