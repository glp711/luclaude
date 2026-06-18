# Handoff para Claude - SEO tecnico

Data: 2026-06-18
Projeto: `C:\Users\rainb\Desktop\lunovo`

## Objetivo

Preparar a base tecnica de SEO para o site aparecer melhor no Google quando alguem buscar por perfumes de ambiente, difusores, home spray, sabonetes perfumados e marcas da curadoria.

Importante: SEO nao faz o site aparecer instantaneamente. O codigo melhora rastreamento, indexacao e entendimento do conteudo, mas ainda precisa cadastrar o dominio no Google Search Console e enviar o sitemap.

## Referencias oficiais usadas

- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Product structured data: https://developers.google.com/search/docs/appearance/structured-data/product
- Google structured data intro: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Google ecommerce structured data: https://developers.google.com/search/docs/specialty/ecommerce/include-structured-data-relevant-to-ecommerce

## Arquivos alterados

- `src/lib/seo.ts`
- `src/app/layout.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/app/(site)/page.tsx`
- `src/app/(site)/marcas/page.tsx`
- `src/app/(site)/produtos/[slug]/page.tsx`
- `src/app/cadastro/page.tsx`
- `src/app/login/page.tsx`
- `src/app/recuperar-senha/page.tsx`
- `src/app/redefinir-senha/page.tsx`
- `src/app/(site)/carrinho/page.tsx`
- `src/app/(site)/checkout/page.tsx`
- `src/app/(site)/minha-conta/page.tsx`
- `src/app/(site)/pedidos/[id]/page.tsx`

## O que foi feito

### Configuracao central de SEO

Criado `src/lib/seo.ts` com:

- `SITE_NAME`
- `SITE_BRAND_NAME`
- `SITE_DESCRIPTION`
- `SEO_KEYWORDS`
- `siteUrl()`
- `absoluteUrl()`
- `seoTitle()`
- `truncateDescription()`
- `SOCIAL_LINKS`

Isso evita repetir nome, descricao e origem do site em varios arquivos.

### Metadata global

Arquivo: `src/app/layout.tsx`

Adicionado:

- `metadataBase`
- titulo padrao com template
- descricao global
- keywords principais
- author/creator/publisher
- canonical global
- robots com `max-image-preview: large`
- Open Graph com imagem
- Twitter card

### Robots

Arquivo: `src/app/robots.ts`

Atualizado para usar `siteUrl()` e bloquear paginas privadas/fluxos:

- `/admin`
- `/api`
- `/auth`
- `/login`
- `/cadastro`
- `/carrinho`
- `/checkout`
- `/minha-conta`
- `/pedidos`

Continua expondo:

- `Host`
- `Sitemap`

### Sitemap

Arquivo: `src/app/sitemap.ts`

Reescrito para incluir:

- home
- `/produtos`
- `/marcas`
- `/sobre`
- `/contato`
- paginas legais
- URLs por categoria: `/produtos?categoria=...`
- URLs por marca: `/produtos?marca=...`
- URLs de produtos ativos: `/produtos/[slug]`

### Home

Arquivo: `src/app/(site)/page.tsx`

Adicionado JSON-LD `WebSite` com `SearchAction`:

- Google entende que a busca interna usa `/produtos?busca={search_term_string}`.

O JSON-LD `Store` agora usa dados centralizados de `src/lib/seo.ts`.

### Pagina de marcas

Arquivo: `src/app/(site)/marcas/page.tsx`

Adicionado:

- canonical `/marcas`
- Open Graph especifico para biblioteca de marcas
- descricao mais adequada para busca por marcas de perfumes de ambiente

### Pagina de produto

Arquivo: `src/app/(site)/produtos/[slug]/page.tsx`

Reescrita mantendo a funcionalidade visual e de compra, mas corrigindo SEO:

- `generateMetadata()` agora busca:
  - slug
  - nome
  - descricao
  - imagem
- Produto inexistente retorna `robots: noindex`.
- Produto existente recebe:
  - descricao truncada corretamente
  - canonical `/produtos/[slug]`
  - Open Graph
  - Twitter card
  - imagem principal absoluta quando existe
- JSON-LD `Product` melhorado:
  - `name`
  - `description`
  - `image`
  - `sku`
  - `brand` com a marca original do produto (`brands.name`) quando existir
  - `category`
  - `offers`
  - `priceCurrency`
  - `price`
  - `availability`
  - `itemCondition`
  - `seller`
- JSON-LD `BreadcrumbList` mantido.

### Paginas noindex

Adicionado `robots: { index: false, follow: false }` em paginas que nao devem ranquear:

- cadastro
- login
- recuperar senha
- redefinir senha
- carrinho
- checkout
- minha conta
- pedido individual

## Validacoes executadas

Comandos:

```bash
npm run typecheck
npm run lint
npm run build
```

Resultado:

- Typecheck: passou.
- Lint: passou.
- Build: passou.

Warning conhecido:

- Next ainda avisa que `middleware` file convention esta deprecated e recomenda `proxy`.

## Validacoes locais via HTTP

### Robots

URL testada:

- `http://localhost:3000/robots.txt`

Resultado:

- Status 200.
- Disallow para paginas privadas.
- Sitemap presente.

### Sitemap

URL testada:

- `http://localhost:3000/sitemap.xml`

Resultado:

- Status 200.
- Inclui `/marcas`.
- Inclui URLs por marca.
- Inclui produtos.

### Marcas

URL testada:

- `http://localhost:3000/marcas`

Resultado:

- Status 200.
- Canonical presente.
- Open Graph presente.
- Robots com max-image-preview presente.

### Produto

URL testada:

- `http://localhost:3000/produtos/aaaaaaaaaaaaaaaaaaaa`

Resultado:

- Status 200.
- JSON-LD `Product` presente.
- JSON-LD `Offer` presente.
- Canonical presente.
- Open Graph image presente.

## Proximos passos fora do codigo

1. Entrar no Google Search Console.
2. Adicionar propriedade do dominio:
   - `https://www.perfumesdeambiente.com`
3. Verificar a propriedade via DNS ou arquivo HTML.
4. Enviar sitemap:
   - `https://www.perfumesdeambiente.com/sitemap.xml`
5. Usar a ferramenta de inspecao de URL para pedir indexacao da home e paginas principais:
   - `/`
   - `/produtos`
   - `/marcas`
   - principais produtos
6. Criar Google Merchant Center para produtos aparecerem melhor em Shopping/free listings.
7. Criar textos melhores nos produtos, porque SEO depende muito de conteudo real:
   - marca
   - familia olfativa
   - uso indicado
   - volume/peso
   - ocasiao de presente
   - diferenciais do aroma

## Observacoes

- O catalogo ainda tem algumas strings antigas com encoding quebrado. Nao bloqueiam SEO tecnico, mas seria bom limpar depois.
- Query strings no sitemap (`?marca=` e `?categoria=`) ajudam descoberta, mas se o projeto ganhar paginas dedicadas `/marcas/[slug]` e `/categorias/[slug]`, isso seria melhor para SEO de longo prazo.
