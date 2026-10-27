# Comandou: landing page

Página pública do Comandou, feita em HTML, CSS e JS puros, sem build. Spec em [`docs/SPEC.md`](docs/SPEC.md). O design vem de [`design-refs/b-system-landing.md`](design-refs/b-system-landing.md).

## Rodar local
```bash
python3 -m http.server 5173
```
Depois abra http://localhost:5173. Os caminhos são absolutos (`/css/...`), então a página não funciona abrindo o arquivo direto (`file://`).

## Configurar o contato
O número do WhatsApp fica em `js/main.js`, na constante `CONTATO.whatsapp`: só dígitos, com DDI e DDD (ex.: `5511999998888`). Enquanto estiver vazio, os botões levam para a seção de contato.

## Estrutura
| Caminho | O quê |
|---|---|
| `index.html` | Página única, com o sprite de ícones Lucide inline |
| `css/b-system.css` | **Cópia** de `comandou-web/src/assets/b-system/colors_and_type.css`. Ressincronize se os tokens mudarem no app |
| `css/landing.css` | Tokens da landing (aliases de `--b-*`) e componentes |
| `js/main.js` | Contato, header, menu mobile, abas e reveal ao rolar |
| `assets/` | Logo, favicons e `og.png` |
| `refs/`, `design-refs/`, `docs/` | Referências e documentação. Ficam fora do deploy (`.vercelignore`) |

## Deploy
Vercel, como site estático (sem build, raiz = esta pasta). O `vercel.json` define o cache de `/assets` e os headers de segurança.

Visitas: painel da Vercel → projeto `comandou-landing` → **Analytics** (Vercel Web Analytics, sem cookie).
