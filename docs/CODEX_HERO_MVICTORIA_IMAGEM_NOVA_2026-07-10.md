# Codex - Hero M.Victoria com imagem nova

Data: 2026-07-10

## Pedido

Usar a nova imagem enviada para o hero da M.Victoria e aproximar o banner da formula editorial definida para as marcas premium.

Imagem recebida:

- `C:/Users/rainb/Downloads/ChatGPT Image Jul 10, 2026, 03_13_08 AM.png`

## Arquivos alterados

### `public/hero/m-victoria-cha-branco-hero-2026-07-10.png`

Adicionei a nova imagem ao projeto como asset publico do hero.

### `src/lib/home-content.ts`

Adicionei M.Victoria como primeiro slide do carrossel da home.

Conteudo aplicado:

- Overline: `Assinatura M.Victoria`
- Titulo: `Cuidado e`
- Acento em italico/cor: `perfume.`
- Subtitulo: `Fragrancias delicadas para transformar a rotina em ritual.`
- CTA primario: `Ver M.Victoria`
- Link secundario: `Explorar fragrancias`
- Link dos CTAs: filtro de marca `m-victoria`

Observacao:

- A marca saiu do titulo e foi para o overline, seguindo a direcao editorial combinada.
- O subtitulo foi mantido curto para nao encher o banner.

### `src/components/Home/HeroSlide.tsx`

Atualizei o componente de hero:

- Adicionei `text-balance` no titulo para melhorar as quebras de linha.
- Transformei o CTA secundario em link sublinhado, em vez de botao/pilula.

Impacto:

- Os heroes ficam mais editoriais e menos parecidos com marketplace generico.
- A formula agora fica mais proxima de referencias premium como Diptyque, Trudon e L:A Bruket.

### `next.config.ts`

Adicionei:

```ts
qualities: [75, 95]
```

Motivo:

- O componente de hero usa imagens com `quality={95}`.
- O Next estava avisando que a qualidade `95` nao estava configurada.
- A mudanca remove o warning e deixa o config alinhado ao uso real dos heroes.

## Validacao visual

Foram geradas capturas locais para conferencia:

- `entregas/mvictoria-hero-2026-07-10/mvictoria-hero-desktop-v2.png`
- `entregas/mvictoria-hero-2026-07-10/mvictoria-hero-mobile-v2.png`

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

- A imagem nova foi usada no hero da M.Victoria.
- A home agora abre com M.Victoria como primeiro banner.
- Nenhum produto, checkout, admin ou banco de dados foi alterado.
