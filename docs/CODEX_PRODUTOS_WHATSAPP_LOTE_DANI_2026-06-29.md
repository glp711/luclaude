# Codex - Lote de produtos Dani Fernandes via WhatsApp - 2026-06-29

## Objetivo

Cadastrar no site os produtos enviados pela cliente no WhatsApp com descricao, preco e fotos.

Conversa usada:

- Contato solicitado: `+55 61 9697-2023`
- Nome exibido no WhatsApp: `Luciola Brito`
- Escopo lido: blocos de produtos com preco/descricao e fotos proximas no chat.
- Nenhuma mensagem foi enviada, apagada ou encaminhada.

## Produtos identificados no WhatsApp

Foram encontrados quatro produtos com descricao e preco:

1. `Oleo Difusor de Aromas Flor de Figo 250ml Jardim Secreto Dani Fernandes Best Seller`
2. `Kit Presenteavel Difusor e Sabonete Liquido Verbena e Limao Siciliano 120ml`
3. `Oleo Difusor de Aromas Verbena e Limao Siciliano 250ml Jardim Secreto Dani Fernandes Best Seller`
4. `Kit Presenteavel Difusor e Sabonete Liquido Tenue 120ml`

O produto `Kit Presenteavel Difusor e Sabonete Liquido Tenue 120ml` ja havia sido cadastrado no passo anterior em:

- `docs/CODEX_PRODUTO_KIT_TENUE_DANI_2026-06-29.md`
- Produto Supabase: `4552e86f-6a7f-4384-861b-33719273cb05`
- Slug: `kit-presenteavel-difusor-e-sabonete-liquido-tenue-120ml`

Neste lote foram adicionados os outros tres produtos.

## Downloads e imagens

As fotos foram baixadas individualmente da galeria do WhatsApp Web, depois deduplicadas por hash.

Destino temporario organizado:

`C:\Users\rainb\Downloads\Produtos_WhatsApp_556196972023_2026-06-29\produtos-cadastro-2026-06-29`

Destino versionado no projeto:

`public/produtos/dani-fernandes/`

### Flor de Figo Jardim Secreto 250ml

Pasta:

`public/produtos/dani-fernandes/flor-de-figo-jardim-secreto-250ml/`

Arquivos:

- `flor-de-figo-jardim-secreto-250ml-01.jpeg`
- `flor-de-figo-jardim-secreto-250ml-02.jpeg`
- `flor-de-figo-jardim-secreto-250ml-03.jpeg`

### Kit Verbena e Limao Siciliano 120ml

Pasta:

`public/produtos/dani-fernandes/kit-verbena-limao-siciliano-120ml/`

Arquivos:

- `kit-verbena-limao-siciliano-120ml-01.jpeg`
- `kit-verbena-limao-siciliano-120ml-02.jpeg`
- `kit-verbena-limao-siciliano-120ml-03.jpeg`
- `kit-verbena-limao-siciliano-120ml-04.jpeg`

### Verbena e Limao Siciliano Jardim Secreto 250ml

Pasta:

`public/produtos/dani-fernandes/verbena-limao-siciliano-jardim-secreto-250ml/`

Arquivos:

- `verbena-limao-siciliano-jardim-secreto-250ml-01.jpeg`
- `verbena-limao-siciliano-jardim-secreto-250ml-02.jpeg`
- `verbena-limao-siciliano-jardim-secreto-250ml-03.jpeg`
- `verbena-limao-siciliano-jardim-secreto-250ml-04.jpeg`

## Produtos cadastrados no Supabase

Todos foram salvos como:

- Marca: `Dani Fernandes`
- Status: `active`
- Estoque inicial: `10`
- `source_url`: `null`

### 1. Flor de Figo Jardim Secreto

- ID: `a788c255-c525-438c-bfd9-e18ff9fc1d5a`
- Slug: `oleo-difusor-de-aromas-flor-de-figo-250ml-jardim-secreto-dani-fernandes-best-seller`
- Nome: `Óleo Difusor de Aromas Flor de Figo 250ml Jardim Secreto Dani Fernandes Best Seller`
- Preco: `R$ 419,90`
- Categoria: `difusor-de-varetas`
- SKU: `DF-JS-FLOR-FIGO-250ML`
- Imagens: `3`
- Peso/dimensoes temporarios:
  - `weight_g`: `750`
  - `width_cm`: `16`
  - `height_cm`: `24`
  - `length_cm`: `16`

### 2. Kit Verbena e Limao Siciliano

- ID: `09cdae78-2b5d-4d8f-b71e-ec1af4ea8d7e`
- Slug: `kit-presenteavel-difusor-e-sabonete-liquido-verbena-e-limao-siciliano-120ml`
- Nome: `Kit Presenteável Difusor e Sabonete Líquido Verbena e Limão Siciliano 120ml`
- Preco: `R$ 269,90`
- Categoria: `kits`
- SKU: `DF-KIT-VERBENA-LIMAO-120ML`
- Imagens: `4`
- Peso/dimensoes temporarios:
  - `weight_g`: `850`
  - `width_cm`: `24`
  - `height_cm`: `8`
  - `length_cm`: `18`

### 3. Verbena e Limao Siciliano Jardim Secreto

- ID: `d202c7f4-4f6a-4011-967c-23f7b160531c`
- Slug: `oleo-difusor-de-aromas-verbena-e-limao-siciliano-250ml-jardim-secreto-dani-fernandes-best-seller`
- Nome: `Óleo Difusor de Aromas Verbena e Limão Siciliano 250ml Jardim Secreto Dani Fernandes Best Seller`
- Preco: `R$ 419,90`
- Categoria: `difusor-de-varetas`
- SKU: `DF-JS-VERBENA-LIMAO-250ML`
- Imagens: `4`
- Peso/dimensoes temporarios:
  - `weight_g`: `750`
  - `width_cm`: `16`
  - `height_cm`: `24`
  - `length_cm`: `16`

## Observacoes tecnicas

- Os textos foram inseridos no Supabase usando escapes Unicode para preservar acentos.
- A primeira verificacao confirmou que nomes, precos, status, marca, categoria e galerias ficaram salvos.
- A colecao `product_images` foi recriada por produto a cada upsert para evitar duplicatas.
- Os produtos ficam visiveis quando o banco tem os registros e a Vercel recebe as imagens versionadas no repositorio.
- Nao foram cadastrados produtos sem descricao/preco claro.

## URLs esperadas

- `/produtos/oleo-difusor-de-aromas-flor-de-figo-250ml-jardim-secreto-dani-fernandes-best-seller`
- `/produtos/kit-presenteavel-difusor-e-sabonete-liquido-verbena-e-limao-siciliano-120ml`
- `/produtos/oleo-difusor-de-aromas-verbena-e-limao-siciliano-250ml-jardim-secreto-dani-fernandes-best-seller`
- `/produtos/kit-presenteavel-difusor-e-sabonete-liquido-tenue-120ml`
