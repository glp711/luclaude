# CODEX - Mega menu com prévia de produtos

Data: 2026-06-18

## Objetivo

Melhorar o mega menu desktop para que, ao passar por cima das categorias, o cliente veja uma prévia visual de produtos, no estilo vitrine/curadoria, em vez de ver apenas texto.

## O que foi feito

1. `src/lib/navigation.ts`
   - Adicionado o tipo `MenuProductPreview`.
   - `MenuType` agora aceita `previews?: MenuProductPreview[]`.

2. `src/lib/menu-data.ts`
   - A query do menu agora busca também:
     - `products.slug`
     - `products.name`
     - `products.price_cents`
     - `products.created_at`
     - `product_images(url, position)`
   - Para cada categoria do menu, são coletados até 4 produtos ativos para preview.
   - As imagens são ordenadas por `position`, usando a primeira imagem como capa.

3. `src/components/Header/MegaMenu.tsx`
   - O painel do mega menu foi redesenhado.
   - Lado esquerdo:
     - categorias/tipos;
     - marcas;
     - categoria ativa com destaque visual.
   - Lado direito:
     - seção `Prévia dos produtos`;
     - cards com imagem, nome, preço e link direto para o produto;
     - link `Ver todos` para a categoria ativa.
   - Ao passar o mouse/focar em uma categoria, a vitrine de produtos muda para aquela categoria.

## Validação

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

## Observações

- Não foram alterados produtos, preços ou imagens no banco.
- O menu usa os produtos já cadastrados no Supabase.
- Se uma categoria tiver produto sem imagem, aparece um fallback `imagem em curadoria`.
- Mobile não foi alterado; a mudança é no mega menu desktop.
- O aviso conhecido do Next sobre `middleware` depreciado continua aparecendo no build e não quebra produção.

