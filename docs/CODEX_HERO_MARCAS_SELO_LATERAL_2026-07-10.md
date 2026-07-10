# Codex - Selo lateral de marca nos hero banners

Data: 2026-07-10

## Objetivo

Dar mais destaque para a marca dentro dos hero banners, usando a area vazia do lado esquerdo em desktop grande. A solicitacao foi preencher o espaco em branco marcado no print com elementos editoriais que reforcem a identidade de cada marca.

## Alteracoes realizadas

### Dados dos heroes

Adicionei um objeto `brand` em cada hero com:

- `name`: nome da marca;
- `monogram`: monograma curto usado no selo;
- `note`: frase curta de posicionamento;
- `details`: tags pequenas para reforcar categoria/ritual.

Marcas configuradas:

- M.Victoria: `MV`, cuidado decorativo, Cha branco, perfumaria decor, ritual suave.
- Lenvie: `LV`, ritual da casa, difusores, refis, atmosfera.
- Dani Fernandes: `DF`, fragrancias autorais, Tenue, floral suave, presenteavel.

Arquivo:

- `src/lib/home-content.ts`

### HeroSlide

Criei o componente interno `BrandSideMark` em `HeroSlide`.

O selo:

- aparece apenas em desktop largo (`min-[1360px]`);
- fica na area vazia lateral esquerda do hero;
- usa monograma grande, nome da marca, nota editorial e tags pequenas;
- tem borda, blur e sombra suave para parecer elemento premium/editorial;
- e marcado como `aria-hidden`, porque e reforco visual e o conteudo principal da marca ja existe no hero.

Arquivo:

- `src/components/Home/HeroSlide.tsx`

## Validacao

Comandos executados com sucesso:

```bash
npm run lint
npm run typecheck
npm run build
```

Resultado:

- Lint OK.
- Typecheck OK.
- Build OK.
- Permanece apenas o aviso conhecido do Next.js sobre `middleware` deprecated, sem bloquear deploy.

## QA visual

Prints locais gerados em:

- `output/playwright/hero-brand-mark-2026-07-10/home-firstfold-1920.png`
- `output/playwright/hero-brand-mark-2026-07-10/home-slide-2-1920.png`
- `output/playwright/hero-brand-mark-2026-07-10/home-slide-3-1920.png`

Observacao: a pasta `output/` e apenas artefato local de QA e nao precisa ir para producao.

## Observacoes para o Claude

- A solucao nao altera imagens dos banners; todos os elementos novos sao HTML/CSS.
- Em telas menores, o selo fica oculto para nao atrapalhar legibilidade.
- A estrutura permite editar facilmente marca, monograma e tags no `home-content.ts`.
