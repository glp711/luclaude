# CODEX - Hero banners com Dani Fernandes, universo de marcas e fundadora

Data: 2026-06-18

## Objetivo

Restaurar os hero banners que tinham funcionado melhor na versão anterior, usando as imagens:

- `public/hero/universomarcas.jpg`
- `public/hero/danifernandes.jpg`

E manter apenas um banner da fundadora/Lu no hero.

## O que foi feito

1. Recoloquei as imagens antigas do hero:
   - `public/hero/universomarcas.jpg`
   - `public/hero/danifernandes.jpg`

2. Atualizei `src/lib/home-content.ts` para ter 3 hero banners:
   - Banner 1: universo de produtos e curadoria.
   - Banner 2: marca Dani Fernandes.
   - Banner 3: fundadora/curadoria, usando apenas uma imagem da Lu.

3. CTAs do hero:
   - Universo/curadoria:
     - `Explorar catálogo`
     - `Ver marcas`
   - Dani Fernandes:
     - `Ver Dani Fernandes`
     - `Explorar difusores`
   - Fundadora:
     - `Ver marcas`
     - `Explorar catálogo`

4. Reorganizei a home em `src/app/(site)/page.tsx`:
   - Hero e navegação principal ficam no começo.
   - Categorias, marcas e produtos aparecem antes.
   - Blocos com mais presença da Lu/fundadora foram jogados mais para o final:
     - `PromoTrio`
     - `CurationBanner`
     - `EditorialDuo`

## Arquivos alterados

- `src/lib/home-content.ts`
- `src/app/(site)/page.tsx`
- `public/hero/danifernandes.jpg`
- `public/hero/universomarcas.jpg`

## Validação

Comandos executados:

```bash
npm run typecheck
npm run lint
npm run build
```

Resultado:

- `typecheck`: passou.
- `lint`: passou.
- `build`: passou.

Validação visual local:

- URL: `http://127.0.0.1:3000/`
- H1 do primeiro banner: `Um universo de aromas com curadoria.`
- Imagens carregadas no hero:
  - `universomarcas.jpg`
  - `danifernandes.jpg`
  - `lu-curadoria-difusor.jpeg`

## Observações para o Claude

- Não foram alterados produtos no banco.
- `Perfumes de Ambiente Décor` continua sendo a loja/curadoria, não marca de produto.
- Dani Fernandes segue como marca original do produto.
- O aviso de `middleware` depreciado no build continua existindo e não quebra produção.

