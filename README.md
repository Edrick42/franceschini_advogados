# Franceschini Advogados Associados — site institucional

Site bilíngue PT/EN do escritório Franceschini Advogados Associados.

- **Stack:** Astro 5 (static) · Vercel · Decap CMS sobre GitHub
- **Idiomas:** `/` (PT-BR padrão) e `/en/` (EN-US)
- **Conteúdo gerenciável** via `/admin` (Decap)

## Comandos

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # bundle estático para deploy
npm run preview  # serve o build
npm run check    # Astro check (types + content schemas)
```

## Variáveis de ambiente

Veja `.env.example` — copie para `.env` (dev) e configure no Vercel.

## Estrutura

```
src/
├── pages/         # rotas PT na raiz, EN em /en/
├── components/    # componentes Astro
├── layouts/       # Layout.astro (SEO, JSON-LD, hreflang)
├── content/       # Content Collections (artigos, equipe, áreas)
├── data/          # site.json (config central, gerenciado via CMS)
├── i18n/          # dicionários pt.json / en.json
├── lib/           # helpers (seo, etc)
└── styles/        # tokens, fonts, reset, global
public/
├── admin/         # Decap CMS auto-hospedado
├── fonts/         # Inter + Frank Ruhl Libre (woff2)
└── images/        # estáticos otimizados
```
