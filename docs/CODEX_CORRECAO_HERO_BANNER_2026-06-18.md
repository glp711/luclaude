# CODEX - Correção do hero para formato banner

Data: 2026-06-18

## Contexto

Após a atualização anterior, o hero ficou com aparência de layout editorial dividido, com imagem em moldura/card. Isso descaracterizou a ideia de `hero banner` grande aprovada pela cliente.

Esta correção restaura a sensação de banner de vitrine:

- imagem grande ocupando o fundo do hero;
- texto sobreposto via HTML/CSS;
- fundo claro/off-white com overlay para leitura;
- CTAs preservados;
- fotos novas da Lu preservadas.

## O que foi corrigido

1. `src/components/Home/HeroSlide.tsx`
   - Removida a moldura/card da imagem.
   - A imagem voltou a ocupar o hero como banner grande.
   - O texto continua em HTML/CSS, sobreposto ao banner.
   - Adicionado overlay claro para garantir legibilidade no desktop e mobile.
   - Mantidos os CTAs:
     - `Ver marcas`
     - `Explorar catálogo`

2. `src/components/Home/HeroCarousel.tsx`
   - Altura ajustada para comportamento de banner:
     - mobile: `720px`
     - desktop: `640px`
   - Setas reposicionadas para não cobrir o texto.
   - Dots mantidos no canto inferior direito.

## Validação visual

Desktop local:

- URL: `http://127.0.0.1:3000/`
- H1: `11 marcas, um só lugar.`
- Hero renderizado como banner grande com foto de fundo.
- Texto à esquerda, sobreposto e legível.
- Setas fora do texto.

Mobile local:

- Viewport: `390x844`
- Hero renderizado como banner com imagem ao fundo.
- Texto legível.
- CTAs visíveis.

## Validação técnica

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

## Observações para o Claude

- Esta correção não altera produtos, marcas, banco de dados ou integrações.
- Mantém `Perfumes de Ambiente Décor` como marca da loja/curadoria, não como marca de produto.
- As fotos novas da Lu continuam sendo usadas a partir de `public/hero/`.
- O aviso de `middleware` depreciado segue existindo no build, mas não quebra produção.

