# Handoff para Claude - Mobile header e hero

Data: 2026-06-18
Projeto: `C:\Users\rainb\Desktop\lunovo`

## Objetivo

Corrigir a experiencia mobile da home, especialmente:

- menu hamburguer mais visivel;
- drawer lateral funcionando como menu de celular;
- header mobile menos confuso;
- hero banner com melhor enquadramento, menos altura e imagem menos lavada;
- CTAs do hero aparecendo dentro da primeira dobra do celular.

## Arquivos alterados

- `src/components/Header/Header.tsx`
- `src/components/Header/MobileMenuDrawer.tsx`
- `src/components/Home/HeroCarousel.tsx`
- `src/components/Home/HeroSlide.tsx`

## Alteracoes feitas

### Header mobile

Arquivo: `src/components/Header/Header.tsx`

- Reorganizado o header no mobile para 3 itens:
  - menu hamburguer a esquerda;
  - logo/marca no centro;
  - carrinho a direita.
- A busca central agora aparece apenas no desktop (`lg`).
- No mobile/tablet, a busca fica em uma linha separada abaixo do logo.
- A navegacao do mega menu agora fica realmente escondida no mobile e aparece so no desktop.
- Ajustado o breakpoint intermediario para evitar grade com 4 itens em 3 colunas.

### Drawer lateral

Arquivo: `src/components/Header/MobileMenuDrawer.tsx`

- Botao hamburguer ficou mais visivel:
  - borda coral suave;
  - fundo claro;
  - sombra leve.
- Drawer passou a abrir pela esquerda, como menu lateral mobile tradicional.
- Largura do drawer ajustada para `88%`, com `max-w-sm`.
- Mantidos atalhos:
  - Catalogo;
  - Marcas;
  - Ver ofertas e achadinhos.

### Hero carousel

Arquivo: `src/components/Home/HeroCarousel.tsx`

- Altura mobile reduzida de `720px` para `610px`.
- Desktop continua com altura de `640px`.
- Indicadores foram ajustados para ficarem mais bem posicionados.

### Hero slide

Arquivo: `src/components/Home/HeroSlide.tsx`

- Componente reescrito para limpar caracteres antigos e melhorar mobile.
- Imagem agora usa:
  - `quality={95}`;
  - `unoptimized`;
  - `sizes="100vw"`.
- Isso evita compressao/redimensionamento excessivo do Next nos banners do hero.
- Overlay mobile ficou menos agressivo:
  - antes a foto ficava muito coberta por bege, parecendo baixa qualidade;
  - agora a imagem aparece melhor e o texto fica apoiado no degradê inferior.
- Texto no mobile ficou mais compacto:
  - segundo e terceiro paragrafos aparecem a partir de `sm`;
  - no mobile fica so o primeiro paragrafo para caber melhor.
- CTAs ficaram menores no mobile e cabem na primeira tela.
- Layout mobile do hero alinha o texto na parte inferior da imagem, com gradiente para legibilidade.

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

- Next ainda avisa que `middleware` esta deprecated e recomenda `proxy`.

## Validacao visual/DOM no navegador

Viewport mobile testado: `390x844`.

Resultados:

- Sem overflow horizontal.
- Botao hamburguer encontrado e visivel no lado esquerdo.
- Drawer abre pela esquerda.
- Drawer tem `Catalogo` e `Marcas`.
- Hero ficou com altura de aproximadamente `611px`.
- CTAs do primeiro hero ficaram dentro da primeira tela:
  - `Explorar catalogo`
  - `Ver marcas`
- Imagem do hero passou a carregar direto de `/hero/universomarcas.jpg` em vez de URL otimizada `_next/image?...q=75`.

Viewport desktop tambem testado:

- Sem overflow horizontal.
- Busca desktop aparece.
- Mega menu desktop aparece.
- Botao hamburguer fica escondido.

## Observacoes

- As imagens originais dos heroes existem em `public/hero`.
- Dimensoes verificadas:
  - `universomarcas.jpg`: 1672x941
  - `danifernandes.jpg`: 1672x941
  - fotos verticais da Lu: 1067x1600
- A qualidade visual ruim vinha principalmente de overlay pesado + otimizacao/compressao do Next, nao necessariamente de ausencia de resolucao.
- Ainda existe texto com encoding antigo em alguns arquivos de conteudo (`home-content.ts`, footer etc.). Nao foi o foco deste ajuste, mas seria bom limpar depois.
