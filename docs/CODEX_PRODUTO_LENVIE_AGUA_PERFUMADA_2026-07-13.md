# Produto Lenvie em Agua Perfumada

Data: 2026-07-13

## Objetivo

Cadastrar rapidamente um produto Lenvie na categoria `Agua Perfumada` para demonstrar que a navegacao por `Aromatizacao > Agua Perfumada` e o filtro por marca estao funcionando.

## Produto cadastrado

- Nome: `Agua Perfumada Splash Lotus Garden 250ml | Lenvie + PatBO`.
- Slug: `agua-perfumada-splash-lotus-garden-250ml-lenvie-patbo`.
- Marca: `Lenvie`.
- Categoria: `Agua Perfumada`.
- Grupo da categoria: `aromatizacao`.
- Preco cadastrado: `R$ 129,00`.
- Estoque: `0`.
- Status: `active`.
- Imagem: `/hero/lenvie-lotus-collection.jpeg`.
- ID do produto: `d5d1c1d2-3cbd-466a-97d0-839be555a119`.

## Seguranca comercial

O produto foi publicado com estoque zero. Ele aparece no catalogo e comprova o funcionamento da categoria, mas nao pode ser comprado antes da confirmacao de estoque da cliente.

## Fonte das informacoes

Os dados de nome, volume, descricao olfativa e preco foram conferidos na pagina oficial da Lenvie:

`https://www.lenvieparfums.com/produto/agua-perfumada-splash-250-ml-lotus-garden-patbo-555`

## Validacao

Foi consultada a rota:

`/produtos?categoria=agua-perfumada&marca=lenvie`

Resultado confirmado:

- `1 produto` encontrado.
- Produto associado a marca `Lenvie`.
- Produto associado a categoria `Agua Perfumada`.
- Nome e imagem renderizados.
- Estado `Esgotado` exibido por causa do estoque zero.

## Alteracoes no projeto

- Nenhuma tabela, migration ou politica RLS foi alterada.
- Foi inserido um registro em `products` e um registro em `product_images`.
- Este documento foi adicionado para repasse ao Claude.
