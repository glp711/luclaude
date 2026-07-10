# Codex - Correcao do destaque de marca nos heroes

Data: 2026-07-10

## Contexto

A primeira versao do destaque de marca nos hero banners ficou visualmente pesada, com um card lateral grande ocupando a area vazia. A avaliacao foi que o resultado ficou ruim e chamativo demais.

## O que foi corrigido

- Removi o card lateral com borda, tags e monograma forte.
- Mantive a ideia de dar destaque para a marca, mas em formato muito mais sutil:
  - monograma grande como watermark quase transparente;
  - nome da marca em baixa opacidade;
  - pequena linha editorial `marca curada`;
  - nota curta da marca em baixa opacidade.
- O elemento continua aparecendo apenas em desktop largo (`min-[1360px]`), evitando poluir mobile e telas menores.
- A solucao continua em HTML/CSS, sem texto embutido na imagem.

## Arquivo alterado

- `src/components/Home/HeroSlide.tsx`

## Validacao

Comandos executados:

```bash
npm run lint
npm run typecheck
```

Print local de QA:

- `output/playwright/hero-brand-watermark-2026-07-10/home-firstfold-1920.png`

## Observacao para o Claude

O objeto `brand` em `src/lib/home-content.ts` continua existindo porque alimenta o watermark. A diferenca e que agora o destaque e discreto, funcionando como assinatura visual de fundo em vez de card editorial.
