# Codex - Hero horizontal Lenvie

Data: 2026-06-29

## Objetivo

Trocar o hero da Lenvie por uma imagem horizontal ja preparada para banner, com produtos reais a direita e area limpa a esquerda para texto em HTML/CSS.

## Arquivo de origem

- `C:\Users\rainb\Downloads\hero_lenvie_produtos_reais_1920x800.jpg`

## Arquivos alterados

- `public/hero/lenvie-produtos-reais-hero-1920x800.jpg`
- `src/lib/home-content.ts`

## O que foi feito

1. A imagem foi copiada para o projeto com nome limpo:

```txt
public/hero/lenvie-produtos-reais-hero-1920x800.jpg
```

2. O primeiro slide do hero da home agora usa essa imagem:

```txt
/hero/lenvie-produtos-reais-hero-1920x800.jpg
```

3. O `imagePosition` voltou para:

```txt
center center
```

Motivo: a imagem ja foi montada com composicao horizontal, area limpa para texto a esquerda e produtos reais a direita.

## Validacao visual

- Desktop: o texto fica em area limpa, com os produtos Lenvie a direita.
- Mobile: o texto continua legivel e a imagem mantem parte dos produtos no enquadramento.

## Observacao

O texto do hero continua em HTML/CSS, nao embutido na imagem. Isso facilita editar titulo, descricao e CTAs sem precisar refazer o banner.

