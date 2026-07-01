# Codex - Verde de referencia e ajuste dos heroes mobile

Data: 2026-06-30

## Pedido

Aplicar uma tonalidade de verde inspirada na referencia visual da Carol Rosa e corrigir a experiencia dos banners no mobile.

Referencia analisada:
- https://www.shopcarolrosa.com.br/

## Cores aplicadas

Foram identificadas como principais na referencia:

- Verde oliva principal: `#686d58`
- Verde sage/oliva claro: `#a0a67d`

Essas cores foram usadas como inspiracao, sem copiar a identidade da outra loja. A paleta do projeto continua mantendo off-white, coral e tons naturais.

## Arquivos alterados

### `src/app/globals.css`

Atualizei os tokens globais de `sage`:

- `--color-sage`: de `#a8c5bc` para `#a0a67d`
- `--color-sage-deep`: de `#87b1a4` para `#686d58`
- `--color-sage-soft`: de `#d4e3dd` para `#e5e7d7`

Impacto:
- Todo componente que ja usa `sage`, `sage-deep` ou `sage-soft` passa a receber a nova tonalidade verde.
- O site ganha um verde mais sofisticado/oliva, mais proximo da referencia enviada pela cliente.

### `src/components/PromoBar.tsx`

Troquei a barra promocional superior:

- Antes: fundo coral.
- Depois: fundo verde oliva `bg-sage-deep`.

Impacto:
- O topo do site fica mais alinhado com a nova direcao de cor.
- O coral permanece como detalhe de marca, principalmente em textos e destaques.

### `src/components/Home/HeroCarousel.tsx`

Melhorei o comportamento do carrossel no mobile:

- Altura mobile reduzida de `610px` para `560px`, com ajuste para telas a partir de `390px`.
- Indicadores dos banners agora ficam centralizados no mobile.
- Indicadores receberam fundo translucido para leitura melhor sobre imagem.
- Botao de pausar banners foi escondido no mobile para nao poluir o hero.
- Barra de progresso e indicadores ativos passaram para verde oliva.
- Setas desktop passaram a usar foco/hover verde.

Impacto:
- Menos sensacao de banner pesado no celular.
- CTAs nao competem mais com os controles do carrossel.
- O carrossel fica mais claro para toque/swipe.

### `src/components/Home/HeroSlide.tsx`

Melhorei a composicao dos slides no mobile:

- Degrade mobile reforcado no rodape para garantir leitura do texto.
- Mais padding inferior no mobile para separar CTAs dos indicadores.
- Titulo mobile reduzido e com melhor largura (`max-w-[13ch]`).
- Texto descritivo mobile ajustado para tamanho mais confortavel.
- CTA principal mudou de preto para verde oliva.
- CTA secundario passou a usar borda/hover verde.
- Tints visuais foram suavizados para dialogar melhor com a nova paleta.

Impacto:
- Melhor legibilidade do hero em telas pequenas.
- Mantem o layout desktop aprovado: texto a esquerda e imagem/produtos a direita.
- Mantem o coral como detalhe premium, mas insere o verde pedido pela cliente.

## Validacao feita

Comandos executados:

```bash
npm run lint
npm run typecheck
```

Resultado:
- Lint passou.
- Typecheck passou.

Tambem foi feita verificacao visual com Playwright em:

- Mobile 390x844
- Desktop 1440x900

Screenshots de verificacao foram geradas apenas como apoio local em `output/playwright/` e nao fazem parte da alteracao final do site.

## Observacoes

- A mudanca foi focada nos banners da home e na tonalidade verde global.
- Produtos, dados, checkout, Supabase e admin nao foram alterados nesta rodada.
- O coral nao foi removido da identidade, apenas deixou de ser a cor dominante em alguns pontos do topo/hero.
