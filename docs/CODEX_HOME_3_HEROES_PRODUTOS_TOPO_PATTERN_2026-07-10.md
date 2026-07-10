# Codex - Home com 3 heroes e produtos logo abaixo

Data: 2026-07-10

## Pedido

Ajustar a home para:

- deixar apenas 3 hero banners principais;
- colocar produtos/best sellers logo abaixo dos heroes;
- melhorar a secao `best sellers / sets`;
- usar a imagem enviada como pattern se ficasse bom;
- reduzir a sensacao de que os produtos aparecem muito tarde na pagina.

## Arquivos alterados

### `src/lib/home-content.ts`

Reduzi o carrossel principal para 3 heroes:

1. M.Victoria
2. Lenvie
3. Dani Fernandes

Removidos do carrossel:

- Hero institucional `Um universo de aromas com curadoria`
- Hero da fundadora/curadoria `Tecnica, emocao e memoria`

Motivo:

- Os banners estavam ficando muito parecidos.
- A home precisava de menos repeticao no topo e mais ritmo no restante.

### `src/app/(site)/page.tsx`

Reordenei a home:

1. Marquee
2. HeroCarousel
3. Best sellers / sets
4. Beneficios
5. Categorias por ritual
6. Biblioteca de marcas
7. Paineis editoriais
8. Curadoria
9. Blocos finais

Tambem removi a segunda vitrine de produtos `novidades` da home.

Motivo:

- O produto precisava aparecer logo depois do hero.
- A home fica mais objetiva: primeiro emocao, depois compra/descoberta, depois narrativa.
- Menos secoes de produto evitam cansar e repeticao.

### `src/components/ProductCarousel.tsx`

Melhorei a secao de best sellers:

- Fundo agora usa faixa editorial com pattern suave.
- Adicionei label `selecao essencial`.
- Texto de apoio ficou mais curto e acolhedor.
- Menos padding vertical para os produtos subirem visualmente.
- Mantive o estilo de carrossel horizontal.

### `public/patterns/floral-cream-editorial-2026-07-10.jpg`

Criei uma versao otimizada da imagem enviada:

- Origem: `C:/Users/rainb/Downloads/ChatGPT Image Jul 10, 2026, 03_46_58 AM.png`
- Saida: JPG em `public/patterns/`
- Largura reduzida para 1600px
- Qualidade JPG: 82
- Tamanho final aproximado: 100 KB

Uso:

- Pattern sutil no lado direito da secao de best sellers.
- Opacidade baixa para nao competir com os produtos.

## Validacao visual

Foram gerados prints locais:

- `entregas/home-3heroes-produtos-topo-2026-07-10/home-3heroes-produtos-topo-desktop.png`
- `entregas/home-3heroes-produtos-topo-2026-07-10/home-3heroes-produtos-topo-mobile.png`

Resultado visual:

- Hero agora mostra apenas 3 indicadores.
- Produtos aparecem imediatamente abaixo do hero.
- Best sellers ficou mais leve e editorial.
- Pattern ficou discreto no desktop e nao pesa no mobile.

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

Observacao:

- O primeiro build falhou por arquivo gerado corrompido em `.next/dev/types`.
- Foi feita limpeza de `.next/dev`, e o build passou normalmente depois.

## Observacoes

- Produtos, checkout, admin, Supabase e dados nao foram alterados.
- A mudanca foi focada na estrutura visual da home.
- O localhost ativo nesta validacao ficou em `http://localhost:3001`, porque a porta 3000 estava presa por processo antigo.
