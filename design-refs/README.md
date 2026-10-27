# Design refs: Landing Comandou

Extração técnica das referências em `../refs/`, feita a partir dos sites **ao vivo**, porque os `.html` salvos vieram sem as pastas `_files`. Os valores são **computados no navegador** (Playwright, 1440×900 e 390×844) em 2026-10-27.

| Arquivo | O que tem |
|---|---|
| **[b-system-landing.md](b-system-landing.md)** | **Spec final**: referências adaptadas ao b-system (o que mudou e por quê, fundamentos, componentes, estrutura, copy) |
| **[preview.html](preview.html)** | Preview vivo dos componentes, usando o CSS real do comandou-web e o kit de logo |
| [scotch.md](scotch.md) | **Referência principal**: estrutura, narrativa, componentes, UX |
| [thrad.md](thrad.md) | Paleta creme/terracota, sistema de tokens semânticos, motion tokenizado, diagrama de fluxo SVG |
| [easlo.md](easlo.md) | Secundária: mockups em dispositivos compostos, painéis arredondados, sombra em camadas |
| [landing-tokens.css](landing-tokens.css) | Tokens da landing que **complementam** o b-system (display, faixas, motion, `[data-rise]`), só como aliases de `--b-*`, sem cor nova |

> A síntese abaixo foi a primeira leitura das referências. Onde ela divergir de `b-system-landing.md`, vale o `b-system-landing.md`.
| `shots/` | Prints desktop (grid de scroll) e mobile de cada referência |
| `raw/` | JSON bruto da extração (cores, type scale, transições, keyframes, hovers) |

---

## Síntese: o que cada referência dá ao Comandou

| Camada | Fonte | Decisão |
|---|---|---|
| Estrutura e narrativa | **Scotch** | Hero com tabs de produto, feature trio, old way/new way, depoimentos, CTA final; um CTA só repetido |
| Cor | **b-system** + forma do Thrad | Primary `#D95C25`, fundo `#FBF8F3`, faixas `bg`/`bg-sunken` alternadas, bloco escuro quente `#2A160B` (nada de preto puro) |
| Tipografia | **b-system** (Nunito) + escala do Scotch | Display em Nunito 800 (40→64 / 30→42), texto 16–18. Não copiar o Inter 300 do Thrad |
| Raio | **b-system** | Pills nos CTAs, 16px em frames, 32px em painéis. Não copiar o raio 0 do Thrad |
| Motion | **Thrad** | Rise 24px (0.6s `ease-rise`), stagger 80ms, hover 0.15–0.2s, `prefers-reduced-motion` obrigatório |
| Mockups | **Scotch** + **Easlo** | Screenshot real em frame com raio 16 e sombra em camadas; tablet (Cozinha) + celular (Garçom) compostos |
| Componente-assinatura | **Thrad** | Diagrama **Garçom → Cozinha → Caixa** com linhas SVG e pulso percorrendo, mostrando o tempo real |

## Mapa de componentes (nome Comandou ← origem)

| Componente | Origem | Notas |
|---|---|---|
| `SiteHeader` | Scotch + Thrad | 64px, sticky; ao rolar ganha `--l-glass` + `backdrop-filter: blur(12px)` + hairline |
| `EyebrowPill` | Scotch | pill com ring hairline e dot primary ("Novo · Comanda digital") |
| `CtaPrimary` | Scotch | pill primary-500, ícone ↗ que gira -45°→0 no hover (0.3s) |
| `LinkArrow` | Scotch | "Ver como funciona →", seta `translateX(2px)` no hover |
| `ProductTabs` | Scotch | Garçom · Cozinha · Caixa · Admin, trocando o mockup; `role=tablist`, setas do teclado |
| `FeatureTrio` | Scotch | "**Título** complemento em muted" na mesma linha |
| `FlowDiagram` | Thrad | 3 nós, o do meio (Cozinha) sólido em primary, paths SVG `pathLength=100` + pulso `stroke-dashoffset` |
| `OldNewWay` | Scotch | comanda de papel/bloquinho vs. tela; texto 2 tons (fg / fg-subtle) |
| `StatCard` | Thrad | número em `--l-text-stat` + legenda muted |
| `DeviceMockup` | Easlo | tablet + celular sobrepostos, `--l-shadow-device` |
| `LogoMarquee` | Scotch | quando houver clientes; CSS puro `translateX(-50%)` linear, conteúdo duplicado, pausa no hover |
| `Testimonials` | Scotch | card com foto, citação, nome, cargo, restaurante, cidade |
| `FinalCta` + `FooterEmber` | Scotch + Thrad | bloco `--l-band-dark` com CTA repetido |

## Regras de UX herdadas
1. **Um CTA só** (WhatsApp/demonstração), repetido no header, no hero, no meio e no fim.
2. **Produto real** em todo bloco. Nada de ilustração genérica.
3. A dor do público aparece nomeada (old way) antes da solução.
4. Uma métrica concreta, repetida duas vezes.
5. Motion sempre a serviço da leitura: entra uma vez (`once`), sem loop chamativo fora do diagrama de fluxo.
