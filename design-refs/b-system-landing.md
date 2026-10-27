# Landing Comandou: design no b-system

Este documento adapta para o b-system o que foi extraído das referências (`scotch.md`, `thrad.md`, `easlo.md`).
Quando houver conflito, vale a ordem:
**`comandou-web/src/assets/b-system/colors_and_type.css` > b-system canônico (`.claude/skills/b-system-design`) > referências.**

- Tokens: [`landing-tokens.css`](landing-tokens.css). Ele não cria cor nova, só aliases para `--b-*`.
- Preview visual: [`preview.html`](preview.html). Abra direto no navegador.
- Marca: `docs/logo/kit/` e `GUIA-DE-USO.md`.

---

## 1. O que mudou na adaptação

| Item da referência | Origem | No b-system | Por quê |
|---|---|---|---|
| Fundo preto `#000` | Scotch | Faixas `--b-bg` / `--b-bg-sunken`, café `--b-fg` só no CTA final e no footer | Fundo nunca é preto puro, sempre quente |
| Laranja `#F54900` / `#EC521B` | Scotch / Thrad | `--b-primary-500` `#D95C25`, hover `--b-primary-600` | Cor da marca, sem token novo |
| Mori 600 / Inter 300 com tracking -0.065em | Scotch / Thrad | **Nunito 800** display, 700 títulos, tracking máx. `-0.02em` | A Nunito é arredondada, não aceita peso leve nem tracking agressivo |
| Escala 54/42/34 | Scotch | 56 / 40 / 20 / 18 / 16 (`--l-text-*`) | Escala canônica com `clamp()`, mobile-first |
| Botão pill | Scotch / Easlo | `--b-radius-sm` (8px), altura mín. 44px (48–52 na landing) | Regra do b-system: botões 8px, pill só em badge e avatar |
| Botão reto (raio 0) | Thrad | Descartado | Contra a linguagem arredondada |
| Borda via ring inset 1px | Scotch | `1px solid var(--b-border)` | Padrão do b-system |
| Fade em gradiente nos mockups, foto com overlay | Scotch / Thrad | **Removido**. Faixas sólidas e mockup em moldura | Sem gradiente de fundo nem foto full-bleed |
| Ilustração "montanha pontilhada" | Thrad | Textura de pontos em `--b-neutral-200`, opacidade baixa, só no hero | Textura sutil é permitida, imagem não |
| Painel com raio 56px | Easlo | `--b-radius-xl` (24px) | Maior raio do sistema |
| Sombra em camadas | Easlo | `--b-shadow-3` (moldura) e `--b-shadow-4` (device em destaque) | Sombras do sistema, já em tom marrom |
| Reveal 32px / 0.5–0.7s | Scotch / Thrad | **16px, 350ms**, spring na entrada | Durações do b-system (150 / 250 / 350) |
| Seta ↗ que gira no hover | Scotch | Seta → com `translateX(3px)`, 150ms | Hover sutil, sem susto |
| Cor de link no hover | Thrad | `--b-primary-600` + underline | Regra de link do b-system |
| Card hover | — | `--b-shadow-2` + `translateY(-2px)` | Regra de card do b-system |
| Press | — | `scale(0.98)` | Igual ao `.b-btn` do app |
| Title Case em inglês | todos | **Sentence case em PT-BR, falando com "você"** | Voz do b-system |
| Ícones variados | todos | **Lucide**, traço 1.5px, 20px na UI e 24px em features | Iconografia do b-system |

---

## 2. Fundamentos aplicados

### Cor (só `--b-*`)
| Uso | Token |
|---|---|
| Faixa padrão | `--b-bg` `#FBF8F3` |
| Faixa alternada | `--b-bg-sunken` `#F3EDE3` |
| Card, moldura | `--b-bg-elevated` `#FFF` |
| Faixa escura (CTA final, footer) | `--b-fg` `#2C1A0E` com texto `--b-fg-inverted` e muted `--b-neutral-300` |
| Faixa marca (no máx. 1, opcional) | `--b-primary-500` com logo `on-terra` |
| Texto / secundário / sutil | `--b-fg` / `--b-fg-muted` / `--b-fg-subtle` |
| CTA / hover / foco | `--b-primary-600` / `--b-primary-700` / `--b-border-focus`. **Não** `primary-500` com texto: creme sobre `#D95C25` dá 3,6:1 e falha no AA. O 500 fica para ícone, borda e pulso |
| Destaques suaves (eyebrow, ícone) | fundo `--b-primary-50`, texto `--b-primary-700` |
| Status no mock (pronto, preparo, pendente) | `--b-success-*`, `--b-warning-*`, `--b-neutral-*`, os mesmos do app |

Ritmo de faixas: `bg → sunken → bg → sunken → … → fg (café)`. Nunca duas faixas iguais seguidas.

### Tipografia (Nunito 400–800)
| Papel | Tamanho | Peso | LH | Tracking |
|---|---|---|---|---|
| Display (H1 hero) | `--l-text-display` 40→56 | 800 | 1.15 | -0.02em |
| H2 de seção | `--l-text-h1` 32→40 | 800 | 1.15 | -0.02em |
| H3 card/feature | `--l-text-h3` 20 | 700 | 1.3 | 0 |
| Lead | `--l-text-lead` 18 | 400 | 1.5 | 0 |
| Body | `--b-font-size-md` 16 | 400 | 1.5 | 0 |
| Small / caption | 14 / 12 | 500–600 | 1.5 | 0 |
| Label (eyebrow) | 12 | 700 | 1.5 | +0.08em, uppercase |
| Stat | `--l-text-stat` 36→48 | 800 | 1.15 | -0.02em |

**Texto em dois tons** (Scotch "old way"): a frase-chave fica em `--b-fg` e o restante em `--b-fg-subtle`, no mesmo parágrafo.

### Layout
- Mobile-first. Breakpoints 768 / 1024 / 1280 (`min-width`).
- Container `1200px`. Gutter 16, 24 e 32. Seção 64 → 128px.
- Grid: 1 coluna → split 5/7 em tablet (texto | mockup) → 12 colunas no desktop.
- Toque: alvo mínimo de 44×44px.

### Raio e elevação
`xs 4` badge · `sm 8` botão, tab, input · `md 12` card · `lg 16` moldura de mockup · `xl 24` painel de seção · `full` eyebrow e avatar.
`shadow-1` card em repouso · `shadow-2` hover · `shadow-3` moldura · `shadow-4` device do hero.

### Motion
| Uso | Duração | Easing |
|---|---|---|
| Hover, cor, foco | 150ms | smooth |
| Troca de aba / mockup | 250ms | smooth (crossfade) |
| Reveal de bloco (`[data-rise]`) | 350ms, stagger 60ms, offset 16px | opacity smooth + transform spring |
| Pulso do fluxo | 2.4s, infinito | linear |
| Marquee de logos | 40s, infinito, pausa no hover | linear |

O reveal roda só uma vez. Com `prefers-reduced-motion`, tudo fica estático: o fluxo vira linhas fixas e o marquee para.

---

## 3. Componentes

Classes com prefixo `l-` para não colidir com `.b-*` do app. Botões reaproveitam `.b-btn-*` quando o CSS do app estiver disponível.

### `l-header`
- Sticky, 64px. Logo **horizontal** (mín. 96px de largura, área de proteção = meia altura do sino).
- Nav (âncoras): Como funciona · Recursos · Preços · Contato. Em < 1024px vira hambúrguer com drawer e scrim.
- Direita: "Entrar" (`b-btn-ghost`) + "Agendar demonstração" (`b-btn-primary`). Em < 768px o CTA vira só "Agendar", ao lado do hambúrguer, e a logo cai para 112px.
- Ao rolar mais de 8px: fundo `--b-bg` a 85% + `backdrop-filter: blur(12px)` + `border-bottom: 1px solid var(--b-border)`. É a única transparência permitida.

### `l-eyebrow` (de Scotch "Introducing" + Thrad "■ What we do")
Pill `radius-full`, fundo `--b-primary-50`, texto `--b-primary-700` 12/700 uppercase +0.08em, dot 6px `--b-primary-500` à esquerda.

### Botões
| Variante | Base | Landing |
|---|---|---|
| Primário | `.b-btn-primary` | altura 52, padding 0 24, 16/700, ícone `arrow-right` 20 que desliza 3px no hover |
| Secundário | `.b-btn-secondary` | altura 52, ícone `play-circle` ("Ver o sistema funcionando") |
| Link | — | `--b-primary-500` 16/700 + seta, hover `--b-primary-600` com underline |
| No escuro | — | primário igual; secundário com borda `--b-neutral-600` e texto `--b-fg-inverted` |

**Um CTA só na página:** "Agendar demonstração" (ou "Falar no WhatsApp").

### `l-tabs` (Scotch product tabs)
- Segmented control: track `--b-bg-sunken` com `radius-sm` e padding 4px; aba ativa `--b-bg-elevated` + `shadow-1` + texto `--b-fg`; inativa `--b-fg-muted`.
- Abas: **Garçom · Cozinha · Caixa · Admin**, cada uma com ícone Lucide (`smartphone`, `chef-hat`, `receipt`, `bar-chart-3`).
- `role="tablist"`, setas ←/→, `aria-controls`. Troca do mockup em crossfade de 250ms.
- Mobile: scroll horizontal com snap. O controle não quebra linha.

### `l-frame` (moldura de mockup)
Fundo `--b-bg-elevated`, `radius-lg`, `1px --b-border`, `shadow-3`, barra superior de 32px com três dots `--b-neutral-200`. O conteúdo é **screenshot real** do comandou-web.

### `l-device` (Easlo)
Tablet (Cozinha) com celular (Garçom) sobreposto no canto inferior direito, deslocado em 12%. Moldura `--b-fg` com bezel 10px, `radius-xl` e `shadow-4`.

### `l-feature-trio` (Scotch)
Ícone 24 em quadrado 44 (`--b-primary-50`, `radius-sm`) + **título em `--b-fg`** e complemento em `--b-fg-muted` na mesma frase.
Ex.: "**Pedido direto na cozinha**, sem papel e sem grito no balcão."

### `l-flow` (assinatura, vem do diagrama do Thrad)
Três nós ligados por linhas SVG: **Garçom → Cozinha → Caixa**.
- Nós: cards `md` com ícone e legenda. O do meio é sólido `--b-primary-500` com texto `--b-fg-inverted`.
- Linhas: `stroke --b-border-strong` 1.5px tracejado. Por cima, um pulso `--b-primary-500` de 12% do comprimento percorre o caminho (`pathLength=100`, `stroke-dasharray: 12 88`, anima `stroke-dashoffset`).
- Legendas das etapas: "Pedido lançado" → "Em preparo" → "Pronto" → "Conta fechada", com badges nas cores de status do app.
- Mobile: vertical, com as linhas descendo.

### `l-old-new` (Scotch "old way / new way")
Dois cards lado a lado (empilhados no mobile):
- **Antes**: `--b-bg-sunken`, ícones `x-circle` em `--b-danger-500`. "Comanda de papel que some", "Pedido errado na cozinha", "Fechar a conta na calculadora".
- **Com o Comandou**: `--b-bg-elevated` + borda `--b-primary-200`, ícones `check-circle-2` em `--b-success-600`.
Título da seção em dois tons.

### `l-stat` (Thrad stat)
Número em `--l-text-stat` 800 `--b-primary-500` + legenda 14 `--b-fg-muted`. Em grupo de três, separados por divisor `--b-border`.
⚠️ Só com número real. Sem dado, a seção não entra.

### `l-testimonial` (Scotch)
Card `md`: aspas `quote` em `--b-primary-300`, citação 18/600, avatar 40 `full`, nome 14/700, função, restaurante e cidade 14 muted. Carrossel com setas de 44px (`b-btn-secondary` quadrado). Só com depoimento real.

### `l-cta-final` + `l-footer`
Faixa `--l-band-dark` (café): logo **branca**, H2 em `--b-fg-inverted`, lead em `--b-neutral-300`, botão primário. O footer continua na mesma faixa, separado por divisor `--b-neutral-700`.

---

## 4. Estrutura da página (Scotch adaptado)

| # | Seção | Faixa | Componentes |
|---|---|---|---|
| 1 | Header | bg (sticky) | `l-header` |
| 2 | Hero | bg + textura de pontos | eyebrow, H1, lead, 2 CTAs, `l-tabs` + `l-frame` |
| 3 | Como funciona | sunken | H2, `l-flow` |
| 4 | Antes × depois | bg | `l-old-new` |
| 5 | Por perfil | sunken | 4 blocos alternando texto e mockup (Garçom, Cozinha, Caixa, Admin), com `l-feature-trio` |
| 6 | Instala no celular | bg | `l-device` + bullets (PWA, sem loja de app, funciona em tablet e TV) |
| 7 | Números / depoimentos | sunken | `l-stat`, `l-testimonial` (só com dado real) |
| 8 | CTA final + footer | fg (café) | `l-cta-final`, `l-footer` |

## 5. Copy (voz do b-system)
- Sentence case sempre, em PT-BR, falando com "você".
- Direto e caloroso: "Seu salão e sua cozinha falando a mesma língua".
- Sem jargão técnico: em vez de "WebSocket", "atualiza na hora, sem recarregar".
- Emoji não entra em nenhum lugar da landing.
