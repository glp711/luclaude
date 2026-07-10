# Codex - Home mais premium e aconchegante abaixo dos banners

Data: 2026-07-10

## Pedido

Melhorar o design do site sem focar nos banners/heroes, porque os banners estavam ficando muito parecidos. A referencia enviada tinha uma linguagem mais editorial, premium e aconchegante, com:

- produtos em vitrine minimalista;
- secoes com mais respiro;
- blocos visuais grandes;
- tipografia limpa;
- menos cara de marketplace generico.

## Arquivos alterados

### `src/components/ProductCard.tsx`

Atualizei o card de produto para uma leitura mais premium:

- Removi o card pesado com borda/sombra forte.
- Imagem agora fica em uma base clean `cream-soft`, com sombra suave.
- Produto usa `object-contain` para parecer mais vitrine/editorial.
- Nome e preco ficaram mais discretos.
- O botao "Ver detalhes" virou link textual pequeno e sublinhado.

Impacto:

- A vitrine de produtos fica menos agressiva e mais parecida com curadoria.

### `src/components/ProductCarousel.tsx`

Recriei o componente com linguagem editorial:

- Fundo claro em faixa ampla.
- Titulo com bolinha, inspirado na referencia visual enviada.
- Segundo label aparece ao lado como uma aba/contraponto suave.
- Cards ficam menores e com mais espaco entre si.
- Link "Ver tudo" virou link sublinhado, nao botao.
- Setas ficaram mais discretas e alinhadas ao verde-salvia.

Impacto:

- A secao de produtos deixou de parecer grade padrao de ecommerce.
- Ficou mais parecida com uma vitrine horizontal de marca premium.

### `src/components/Home/CategoryShortcuts.tsx`

Recriei a secao de categorias:

- Antes era uma grade uniforme de cards pequenos.
- Agora os 3 primeiros atalhos aparecem como paineis editoriais grandes.
- Categorias restantes viraram chips discretos.
- Headline mudou para uma linguagem mais sensorial: `Encontre pelo gesto que a casa pede.`

Impacto:

- A secao ganhou ritmo visual e ficou menos repetitiva.
- Aproxima o site de uma experiencia editorial/curadoria.

### `src/components/Home/BrandsShowcase.tsx`

Recriei a secao de marcas:

- Antes era uma grade de cards/botoes.
- Agora virou uma "biblioteca olfativa" com lista editorial em duas colunas.
- Mantive links para marcas com produtos ativos.
- Mantive estado `Em breve` para marcas sem produto.

Impacto:

- Reforca que Perfumes de Ambiente Decor e uma curadoria de marcas, nao uma marca unica de produto.

### `src/components/Home/PromoTrio.tsx`

Recriei os 3 paineis promocionais:

- Menos arredondamento grande.
- Mais imagem cheia.
- Overlay escuro suave.
- Tipografia maior e mais editorial.
- CTA virou link sublinhado.

Impacto:

- A home ganha contraste visual depois dos produtos, sem parecer uma fileira de cards genericos.

### `src/app/(site)/page.tsx`

Ajustei os labels das secoes de produto:

- Primeira vitrine:
  - titulo: `best sellers`
  - label secundario: `sets`
- Segunda vitrine:
  - titulo: `novidades`

Impacto:

- Linguagem mais proxima da referencia enviada.

## Validacao visual

Foram gerados prints locais para conferencia:

- `entregas/home-premium-resto-2026-07-10/home-premium-desktop-full.png`
- `entregas/home-premium-resto-2026-07-10/home-premium-mobile-full.png`

Observacao:

- Em prints full-page, algumas imagens de produto abaixo da dobra podem aparecer sem carregar por causa de lazy-load do navegador. No uso real, elas carregam quando a pessoa rola ate a secao.

## Validacao tecnica

Comandos executados:

```bash
npm run lint
npm run typecheck
npm run build
```

Resultado:

- Lint passou.
- Typecheck passou.
- Build passou.

## Observacoes

- Os heroes/banners nao foram redesenhados nesta rodada.
- A mudanca foi focada no restante da home.
- Produtos, checkout, admin, Supabase e dados nao foram alterados.
