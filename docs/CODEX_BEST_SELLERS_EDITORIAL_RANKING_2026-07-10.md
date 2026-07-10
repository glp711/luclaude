# Codex - Best sellers editorial com ranking

Data: 2026-07-10

## Pedido

Usar os exemplos enviados para deixar a secao `best sellers` mais premium, com visual de vitrine nobre:

- titulo centralizado;
- icone no topo;
- linhas horizontais;
- cards grandes;
- numeracao 01, 02, 03, 04;
- produto como objeto de desejo;
- menos cara de carrossel generico.

## Arquivos alterados

### `src/components/ProductCarousel.tsx`

Reestruturei o cabecalho da vitrine:

- Adicionei icone de coroa em SVG.
- Adicionei linhas laterais no topo.
- Titulo ficou centralizado em uppercase: `BEST SELLERS`.
- `sets` ficou como label secundario discreto abaixo.
- Setas do carrossel passaram para as laterais da vitrine no desktop.
- Pattern floral ficou ainda mais sutil no fundo.
- O carrossel agora mostra 4 cards grandes por vez no desktop.

### `src/components/ProductCard.tsx`

Atualizei os cards de produto:

- Adicionei prop opcional `rank`.
- Mostro o ranking em circulo coral transluzido no canto superior esquerdo.
- Fundo do card ficou mais cremoso, com gradiente suave.
- Produto ganhou mais presenca dentro da moldura.
- Selos de promocao/estoque foram movidos para o canto superior direito para nao conflitar com o ranking.

## Validacao visual

Foram gerados prints locais:

- `entregas/best-sellers-editorial-2026-07-10/best-sellers-editorial-desktop-full.png`
- `entregas/best-sellers-editorial-2026-07-10/best-sellers-editorial-mobile-full.png`

Resultado:

- Desktop ficou com leitura proxima ao exemplo enviado.
- Mobile manteve a vitrine logo abaixo do hero, com dois produtos visiveis por tela.

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

- Nao alterei dados de produto, checkout, admin ou Supabase.
- A mudanca foi visual e focada na secao best sellers.
- O localhost usado na validacao ficou em `http://localhost:3002`, porque as portas anteriores estavam ocupadas.
