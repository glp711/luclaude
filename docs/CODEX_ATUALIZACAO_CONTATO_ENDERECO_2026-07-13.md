# Atualizacao de contato e endereco

Data: 2026-07-13

## Objetivo

Substituir o WhatsApp provisório pelos dados reais da loja e publicar o endereço informado pela cliente.

## Dados cadastrados

- WhatsApp tecnico: `5561981361941`.
- WhatsApp exibido: `(61) 98136-1941`.
- Endereco: `Av. das Araucárias, 1525 - Águas Claras, Brasília - DF, 72025-065, Brasil`.

## Alteracoes realizadas

- Os dados foram centralizados em `src/lib/contact.ts`.
- O novo WhatsApp alimenta o cabecalho, o botao flutuante e a pagina de contato.
- O telefone passou a ser exibido de forma legivel na pagina de contato e no rodape.
- O endereco foi adicionado a pagina de contato com link para o Google Maps.
- O endereco e o link do mapa foram adicionados ao rodape.
- Telefone e endereco foram adicionados ao JSON-LD `Store` da pagina inicial para SEO local.

## Arquivos alterados

- `src/lib/contact.ts`
- `src/app/(site)/contato/page.tsx`
- `src/app/(site)/layout.tsx`
- `src/app/(site)/page.tsx`
- `docs/CODEX_ATUALIZACAO_CONTATO_ENDERECO_2026-07-13.md`

## Validacoes

- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Observacoes

- Nenhuma regra de produto, preco, frete, checkout ou Supabase foi alterada.
- O numero foi salvo sem pontuacao para formar links validos do WhatsApp.
