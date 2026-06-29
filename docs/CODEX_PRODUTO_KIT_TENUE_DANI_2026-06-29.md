# Codex - Produto Dani Fernandes Kit Tenue 120ml - 2026-06-29

## Objetivo

Adicionar ao site o produto enviado pelo Guilherme/cliente:

`Kit Presenteavel Difusor e Sabonete Liquido Tenue 120ml`

No Supabase, o nome foi salvo com acentos corretos:

`Kit Presenteável Difusor e Sabonete Líquido Tênue 120ml`

## Produto cadastrado no Supabase

- Tabela: `products`
- ID: `4552e86f-6a7f-4384-861b-33719273cb05`
- Slug: `kit-presenteavel-difusor-e-sabonete-liquido-tenue-120ml`
- SKU: `DF-KIT-TENUE-120ML`
- Marca: `Dani Fernandes`
- Categoria: `Kits`
- Status: `active`
- Preco: `R$ 269,90` (`26990` centavos)
- Estoque inicial: `10`
- Peso/dimensoes temporarios para frete:
  - `weight_g`: `850`
  - `width_cm`: `24`
  - `height_cm`: `8`
  - `length_cm`: `18`

## Descricao cadastrada

```text
O aroma Tênue:

Família Olfativa: Amadeirado especiado - o aroma Tênue é a união perfeita entre notas florais e amadeiradas, originando uma fragrância delicada e única! Transformando em uma fragrância floral de fundo amadeirado.

Pirâmide olfativa:

Notas de saída: Lima, Alecrim, Manjericão
Notas de corpo: Rosa, Jasmim, Cedro
Notas de fundo: Sândalo, Patchouli

Um presente que encanta pelo perfume, pela beleza e pelo cuidado.

Este kit especial reúne dois clássicos da Dani Fernandes em uma embalagem encantadora e pronta para presentear. Composto por um Difusor de Aromas 120ml e um Sabonete Líquido 120ml, ambos na fragrância Tênue, ele é ideal para surpreender.
```

## Imagens adicionadas ao projeto

Pasta criada:

`public/produtos/dani-fernandes/kit-tenue-120ml/`

Arquivos:

- `kit-tenue-120ml-ambiente.png`
- `kit-tenue-120ml-produto-aberto.png`
- `kit-tenue-120ml-caixa-frente.png`
- `kit-tenue-120ml-caixa-lateral.png`

## Galeria cadastrada no Supabase

Tabela: `product_images`

URLs salvas:

- `/produtos/dani-fernandes/kit-tenue-120ml/kit-tenue-120ml-ambiente.png`
- `/produtos/dani-fernandes/kit-tenue-120ml/kit-tenue-120ml-produto-aberto.png`
- `/produtos/dani-fernandes/kit-tenue-120ml/kit-tenue-120ml-caixa-frente.png`
- `/produtos/dani-fernandes/kit-tenue-120ml/kit-tenue-120ml-caixa-lateral.png`

## Observacoes importantes

- O produto foi cadastrado diretamente no Supabase de producao usando service role local.
- As imagens ficam versionadas no repositorio em `public/`, entao precisam de commit/push para existirem na Vercel.
- Houve uma primeira tentativa em que os acentos foram corrompidos pelo terminal PowerShell. Em seguida, o cadastro foi corrigido usando escapes Unicode e verificado por codepoints.
- O produto deve aparecer em:
  - `/produtos/kit-presenteavel-difusor-e-sabonete-liquido-tenue-120ml`
  - `/produtos?busca=tenue`
  - `/produtos?categoria=kits`
  - `/produtos?marca=dani-fernandes`
