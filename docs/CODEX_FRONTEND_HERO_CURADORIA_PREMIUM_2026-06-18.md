# CODEX - Hero premium e branding de curadoria

Data: 2026-06-18

## Objetivo

Atualizar a home para seguir a direção visual aprovada pela cliente: doce, sofisticada, suave e premium, com cara de vitrine de curadoria de aromas para casa.

## Diretrizes aplicadas

- Fundo claro/off-white com tons naturais.
- Paleta suave com coral, verde acinzentado e creme.
- Hero grande com texto em HTML/CSS, sem texto embutido na imagem.
- Desktop com texto à esquerda e foto/produto à direita.
- Mobile com texto legível e imagem aparecendo bem enquadrada abaixo do copy.
- Botões arredondados e delicados.
- A loja continua como curadoria/biblioteca de marcas.
- Nenhum produto foi criado ou renomeado para `Perfumes de Ambiente Décor`.

## O que foi alterado

1. Novo hero editorial da home.
   - Arquivo principal: `src/components/Home/HeroSlide.tsx`
   - O slide agora é dividido em duas áreas:
     - texto à esquerda;
     - imagem editorial da Lu/produto à direita.
   - O texto do hero é renderizado via HTML/CSS.
   - A imagem é carregada via `next/image`.
   - Foram adicionados botões:
     - `Ver marcas`
     - `Explorar catálogo`
   - No mobile, os mini indicadores numéricos ficam ocultos para a foto aparecer mais cedo.

2. Ajuste do carrossel do hero.
   - Arquivo: `src/components/Home/HeroCarousel.tsx`
   - Alturas revisadas para desktop, tablet e mobile.
   - Setas foram movidas para o canto inferior direito no desktop, evitando sobrepor o texto.
   - Mobile usa dots, sem setas laterais por cima do conteúdo.

3. Novo conteúdo de branding da home.
   - Arquivo: `src/lib/home-content.ts`
   - Texto principal aplicado:
     - `11 marcas, um só lugar.`
     - `Uma curadoria olfativa feita com técnica, emoção e memória.`
     - `Fragrâncias, extratos e matérias-primas selecionadas com olhar estético, sensibilidade e respeito à arte de perfumar.`
     - `Em cada frasco, uma história. Em cada aroma, um gesto de arte.`
   - Segundo slide usa o texto da cliente sobre:
     - busca pelo extraordinário;
     - técnica, emoção e memória;
     - matérias-primas da França, Espanha, Alemanha, Inglaterra, Líbano, Itália e Brasil.
   - `Perfume de Ambiente Décor` foi tratado como marca da curadoria/loja, não como marca de produto.

4. Novas fotos da Lu adicionadas ao projeto.
   - Origem: `C:/Users/rainb/Downloads/fotoslup/`
   - Destino:
     - `public/hero/lu-curadoria-difusor.jpeg`
     - `public/hero/lu-vitrine-curadoria.jpeg`
     - `public/hero/detalhe-materia-prima.jpeg`
     - `public/hero/lu-home-spray.jpeg`

5. Banner de curadoria atualizado.
   - Arquivo: `src/components/Home/CurationBanner.tsx`
   - Agora reforça o branding:
     - `Uma busca pelo extraordinário`
     - técnica, emoção e memória;
     - matérias-primas nobres;
     - tradição, sensibilidade e assinatura.

6. Limpeza de textos e detalhes visuais da home.
   - Arquivo: `src/app/(site)/page.tsx`
   - Corrigidos textos sem acento e copy institucional.
   - Cards finais passaram a usar raio de 8px.
   - `CategoryShortcuts` e `BrandsShowcase` receberam ajustes de texto/estilo.

## Arquivos alterados

- `src/app/(site)/page.tsx`
- `src/components/Home/HeroSlide.tsx`
- `src/components/Home/HeroCarousel.tsx`
- `src/components/Home/CurationBanner.tsx`
- `src/components/Home/CategoryShortcuts.tsx`
- `src/components/Home/BrandsShowcase.tsx`
- `src/lib/home-content.ts`
- `public/hero/lu-curadoria-difusor.jpeg`
- `public/hero/lu-vitrine-curadoria.jpeg`
- `public/hero/detalhe-materia-prima.jpeg`
- `public/hero/lu-home-spray.jpeg`

## Validação feita

Comandos:

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

- Desktop em `http://127.0.0.1:3000/`
  - H1 renderizado: `11 marcas, um só lugar.`
  - Hero com texto à esquerda e foto da Lu à direita.
  - Setas sem sobrepor o texto.

- Mobile simulado em `390x844`
  - Texto legível.
  - Foto aparece na primeira dobra, logo abaixo dos CTAs.
  - Mini indicadores ocultos no mobile para evitar excesso visual.

## Observações para o Claude

1. As integrações não foram mexidas:
   - Mercado Pago;
   - Supabase;
   - Resend;
   - Melhor Envio.

2. Nenhum produto foi criado, renomeado ou alterado no banco.

3. As imagens antigas do hero (`public/hero/danifernandes.jpg` e `public/hero/universomarcas.jpg`) já apareciam como removidas no working tree antes desta rodada. O novo hero não depende mais delas.

4. O build continua mostrando apenas o aviso conhecido do Next:
   - `middleware` está depreciado e deve virar `proxy` futuramente.
   - Isso não quebrou o build.

