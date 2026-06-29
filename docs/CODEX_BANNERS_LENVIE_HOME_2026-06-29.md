# Codex - Banners Lenvie na home

Data: 2026-06-29

## Objetivo

Usar as fotos reais enviadas pela cliente para criar um destaque da marca Lenvie na home, mantendo a ideia de curadoria premium e sem tratar "Perfumes de Ambiente Decor" como marca de produto.

## Arquivos alterados

- `src/lib/home-content.ts`
- `src/components/Home/HeroCarousel.tsx`

## Imagens adicionadas

As fotos foram copiadas para `public/hero/` com nomes limpos:

- `public/hero/lenvie-lotus-collection.jpeg`
- `public/hero/lenvie-agua-de-coco.jpeg`
- `public/hero/lenvie-ritual-assinatura.jpeg`
- `public/hero/lenvie-vanilla-bloom.jpeg`
- `public/hero/lenvie-summer-pear.jpeg`
- `public/hero/lenvie-lotus-close.jpeg`

## O que foi feito

1. Lenvie virou o primeiro slide do hero principal.
   - Imagem: `lenvie-lotus-collection.jpeg`
   - CTA principal: `/produtos?marca=lenvie`
   - CTA secundario: `/produtos?categoria=difusor-de-varetas&marca=lenvie`

2. O slide da Dani Fernandes foi mantido.
   - A home agora abre com Lenvie e continua tendo Dani Fernandes como destaque de marca.

3. O slide institucional de universo de marcas foi mantido.
   - Continua reforcando a ideia de curadoria de marcas, nao marketplace generico.

4. O bloco promocional "aromatize" passou a usar Lenvie.
   - Imagem: `lenvie-agua-de-coco.jpeg`
   - Link: `/produtos?marca=lenvie`

5. Os dois cards editoriais largos passaram a usar Lenvie.
   - Card 1: `lenvie-ritual-assinatura.jpeg`
   - Card 2: `lenvie-vanilla-bloom.jpeg`

6. No mobile, as setas laterais do hero foram escondidas.
   - Motivo: elas atrapalhavam a leitura e ficavam sobre o texto/produto.
   - A navegacao mobile continua funcionando por autoplay, bolinhas e swipe.

7. `home-content.ts` foi normalizado em ASCII.
   - O arquivo estava com varios acentos corrompidos.
   - Isso evitou que novos textos ficassem com mojibake.

## Validacao feita

- `npm run typecheck`
- `npm run lint`
- Conferencia visual no navegador local:
  - Desktop: hero abre com Lenvie, CTA aponta para `marca=lenvie`.
  - Mobile: hero sem setas laterais, texto legivel e produto visivel.

## Observacao para o Claude

As imagens `lenvie-summer-pear.jpeg` e `lenvie-lotus-close.jpeg` foram adicionadas ao projeto, mas ainda nao estao em uso na home. Elas ficaram prontas para proximos banners, produtos ou pagina especifica da marca Lenvie.

