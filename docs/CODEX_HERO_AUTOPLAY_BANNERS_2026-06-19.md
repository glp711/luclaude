# Codex - Autoplay dos banners hero

Data: 2026-06-19

## Contexto

O carrossel principal da home precisava passar automaticamente. A experiencia anterior dependia muito de acao manual e, no mobile, os banners pareciam parados.

## Arquivos alterados

- `src/components/Home/HeroCarousel.tsx`
- `src/app/globals.css`

## O que foi feito

1. O autoplay do hero foi refeito com `setTimeout` controlado por slide ativo.
   - O banner avanca sozinho a cada 5 segundos.
   - Ao trocar de slide, o temporizador reinicia corretamente.
   - Isso evita intervalos acumulados ou comportamento instavel.

2. Adicionei controles manuais mais visiveis.
   - Setas laterais no desktop e no mobile.
   - Bolinhas de navegacao no rodape do hero.
   - Botao para pausar ou retomar os banners automaticos.

3. Adicionei suporte a swipe no mobile.
   - Arrastar para a esquerda avanca.
   - Arrastar para a direita volta.
   - O swipe ignora movimentos verticais para nao atrapalhar a rolagem da pagina.

4. Adicionei barra de progresso do slide.
   - A barra mostra visualmente o tempo ate o proximo banner.
   - Quando o usuario pausa, a barra fica parada.

5. Ajustei a pausa por interacao.
   - No desktop, passar o mouse sobre o hero pausa temporariamente.
   - Ao tirar o mouse, o autoplay volta.
   - O foco de elementos internos nao pausa mais automaticamente, para evitar que o carrossel pare sem o usuario perceber.

## Detalhes tecnicos

- O intervalo principal ficou em `ROTATE_MS = 5000`.
- A funcao `normalizeSlide` garante loop infinito sem quebrar em indice negativo.
- O carrossel usa `translate3d` para melhorar a suavidade da transicao.
- A animacao CSS `hero-progress` foi adicionada no `globals.css`.
- A animacao respeita `prefers-reduced-motion: reduce`.

## Validacao feita

- `npm run typecheck`
- `npm run lint`
- `npm run build`

Todos passaram.

Observacao: tentei validar visualmente pelo navegador interno, mas ele ficou preso em uma pagina antiga de erro de conexao e bloqueou a navegacao automatica. O servidor local respondeu `200` em `http://localhost:3000`, e a validacao tecnica passou.

## Como testar manualmente

1. Abrir a home.
2. Esperar 5 segundos sem clicar em nada.
3. Confirmar que o banner troca sozinho.
4. Clicar no botao de pausa e confirmar que ele para.
5. Clicar novamente e confirmar que volta.
6. No celular, arrastar o hero para os lados e confirmar que o slide muda.

