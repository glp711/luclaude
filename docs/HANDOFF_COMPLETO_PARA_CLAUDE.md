# Handoff completo para Claude

Data: 2026-06-16

Este e o documento unico recomendado para passar ao Claude. Ele consolida as mudancas feitas no projeto oficial `lunovo` / repo `glp711/luclaude`.

## Estado geral

- Projeto oficial alterado em `C:\Users\rainb\Desktop\lunovo`.
- Branch usada: `main`.
- Deploy via Vercel no projeto `luperfumes`.
- URL publica atual: `https://luperfumes.vercel.app`.
- Marca visivel atual: `perfumes de ambiente decor`.
- Instagram tecnico/handle mantido: `perfumesdeambientedecor`.
- Usuario admin configurado no Supabase: `lopesguilherme2912@gmail.com`.

## Checkout Mercado Pago

Foi migrado/ajustado o checkout para Fluxo Transparente com Pix.

Principais pontos:

- O checkout passou a criar pedido via Mercado Pago Orders API.
- O QR Code Pix passou a ser gerado e exibido no checkout.
- O sistema armazena IDs retornados pelo Mercado Pago:
  - `mp_preference_id` guarda o Order ID no fluxo Orders.
  - `mp_payment_id` guarda o Payment ID quando disponivel.
- Houve tratamento para payer/e-mail em sandbox.
- O checkout usa os dados do pedido local para enviar `external_reference`, permitindo o webhook localizar o pedido depois.

Arquivos principais:

- `src/app/api/checkout/transparent/route.ts`
- `src/app/(site)/checkout/CheckoutForm.tsx`
- `src/app/api/webhooks/mercadopago/route.ts`

Commits relacionados:

- `3960048 Fix Mercado Pago checkout payment filters`
- `24fcb65 Add Mercado Pago transparent checkout`
- `a2bec6d Fix Pix QR code generation`
- `6567a72 Use Orders API for Pix checkout`
- `f435bef Handle sandbox payer email for Pix orders`

## Webhook Mercado Pago

Endpoint:

```txt
https://luperfumes.vercel.app/api/webhooks/mercadopago
```

Comportamento:

- `POST`: usado pelo Mercado Pago com assinatura.
- `GET`: adicionado health check para abrir no navegador e retornar JSON `ok: true`.

Fluxo:

1. Mercado Pago envia evento para o webhook.
2. A rota valida assinatura HMAC.
3. Registra evento em `webhook_events`.
4. Busca o pedido/pagamento no Mercado Pago.
5. Atualiza `orders` e `payments`.
6. Quando o pedido vira pago, decrementa estoque e tenta enviar e-mail.

Observacoes:

- O Mercado Pago precisa estar configurado com o evento `Order (Mercado Pago)`.
- O painel de metricas do Mercado Pago pode mostrar chamadas com atraso.
- Sem assinatura valida, o `POST` retorna erro.

Commit relacionado:

- `2681390 Add webhook health check and admin meeting guide`

## Supabase/Admin

Foi identificado que nenhum usuario estava com `profiles.role = admin`.

Acao feita:

- Usuario `lopesguilherme2912@gmail.com` foi promovido para admin na tabela `profiles`.

Como entrar:

1. Abrir `https://luperfumes.vercel.app/login`.
2. Logar com `lopesguilherme2912@gmail.com`.
3. Abrir `https://luperfumes.vercel.app/admin`.

Importante:

- Sem login admin, `/admin` e subrotas retornam 404 de proposito.
- Isso vem de `requireAdmin()` em `src/lib/auth/guards.ts`.

## Branding e imagens

Foram adicionadas fotos reais da fundadora/produtos.

Arquivos adicionados:

- `public/founder/perfumesdeambientedecor-founder-diffuser.png`
- `public/founder/perfumesdeambientedecor-founder-gift.png`
- `public/founder/perfumesdeambientedecor-founder-card.png`
- `public/founder/perfumesdeambientedecor-product-kit.png`

Alteracoes:

- Home passou a usar foto real no hero.
- Secao da fundadora na home passou a usar foto real.
- Pagina `/sobre` passou a ter fotos reais.
- Nome visivel da marca virou `perfumes de ambiente decor`.
- O card sobreposto na foto da fundadora agora mostra apenas:

```txt
- lu
```

Mantido de proposito:

- `src/lib/contact.ts` continua com `INSTAGRAM_HANDLE = "perfumesdeambientedecor"`.
- URLs do Instagram continuam apontando para `https://www.instagram.com/perfumesdeambientedecor/`.
- Nomes dos arquivos de imagem continuam com `perfumesdeambientedecor`, por serem caminhos tecnicos.

Commits relacionados:

- `ea52f3b Update meeting branding and founder images`
- `5dc012a Adjust public brand name and founder signature`

## Painel admin visual

O painel admin foi redesenhado para ficar mais visivel.

Alteracoes:

- Header escuro com marca maior.
- Menu horizontal com botoes grandes.
- Botao `Ver loja`.
- Botao `Sair` mais forte.
- Dashboard com cards maiores e melhor contraste.
- Acoes rapidas no dashboard.
- Aba `Guia` adicionada ao menu.

Arquivos:

- `src/app/admin/layout.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/guia/page.tsx`

Commit relacionado:

- `d4708a3 Improve admin dashboard and add guide tab`

## Aba Guia do Admin

URL:

```txt
/admin/guia
```

Conteudo:

- Como entrar no painel.
- Como usar dashboard.
- Como cadastrar/editar produtos.
- Como ver financeiro.
- Como acompanhar pedidos.
- Como organizar categorias.
- Como consultar newsletter.
- Fluxo recomendado de operacao.
- Explicacao do webhook.
- Status dos pedidos.

## Novo produto / formulario de produto

O formulario de criar/editar produto foi refeito para ficar mais facil de entender.

Alteracoes:

- Layout em etapas:
  - Etapa 1: informacoes principais.
  - Etapa 2: preco e estoque.
  - Etapa 3: frete e medidas.
- Campos maiores e com contraste melhor.
- Placeholders mais explicativos.
- Dicas de preenchimento em cada campo.
- Sidebar de publicacao com status/categoria.
- Caixa "Antes de salvar" explicando cuidados.
- Botoes mais visiveis.
- Tela `/admin/produtos/novo` ganhou header escuro explicativo.

Arquivos:

- `src/app/admin/produtos/ProductForm.tsx`
- `src/app/admin/produtos/novo/page.tsx`

## Financeiro / faturamento / lucro

Foi criada uma pagina especifica de financeiro.

URL:

```txt
/admin/financeiro
```

Alteracoes:

- O card `Faturamento do mes` no dashboard agora abre `/admin/financeiro`.
- Menu do admin ganhou item `Financeiro`.
- Pagina financeira mostra:
  - faturamento bruto do mes
  - pedidos pagos usados no calculo
  - ticket medio
  - lucro real como `Pendente`
  - grafico de faturamento por dia
  - composicao: subtotal, frete, desconto e total
  - lista de pedidos usados no calculo

Status usados no faturamento:

- `paid`
- `preparing`
- `shipped`
- `delivered`

Importante sobre lucro:

O lucro real nao foi calculado porque o schema atual nao possui campos de custo.

O banco tem:

- preco de venda (`price_cents`)
- subtotal do pedido
- frete cobrado
- desconto
- total

O banco ainda nao tem:

- custo do produto
- custo de embalagem
- taxa do Mercado Pago
- custo real do frete
- custo operacional

Por isso a tela mostra `Lucro real: Pendente` em vez de inventar um numero errado.

Proximo passo tecnico recomendado:

- Adicionar `cost_cents` em `products`.
- Opcionalmente adicionar campos de taxa/custos no pedido ou tabela financeira.
- Atualizar formulario de produto para cadastrar custo.
- Atualizar `/admin/financeiro` para calcular:

```txt
lucro = faturamento - custo_produtos - taxas - custos_frete/embalagem
```

Arquivos:

- `src/app/admin/financeiro/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/layout.tsx`
- `src/app/admin/guia/page.tsx`

## E-mails

Textos de e-mail de pedido foram ajustados para a marca atual.

Arquivo:

- `src/lib/email/orders.ts`

Observacao:

- O remetente ainda usa `onboarding@resend.dev`. Para producao de verdade, configurar dominio/verificacao no Resend.

## Melhor Envio

O `User-Agent` foi ajustado para a marca atual.

Arquivo:

- `src/lib/melhorenvio/client.ts`

## Arquivos de documentacao criados anteriormente

Existem documentos separados em `docs/`, mas este arquivo deve ser considerado o principal para enviar ao Claude.

Documentos antigos/auxiliares:

- `HANDOFF_REUNIAO_BRANDING_WEBHOOK_CLAUDE.md`
- `GUIA_REUNIAO_ADMIN_WEBHOOK.md`
- `HANDOFF_AJUSTE_NOME_MARCA_LU_CLAUDE.md`
- `HANDOFF_MELHORIA_ADMIN_GUIA_CLAUDE.md`

## Validacoes feitas nos ciclos anteriores

Foram executados em diferentes etapas:

```txt
npm run typecheck
npm run lint
npm run build
```

As validacoes passaram antes dos pushes feitos para o GitHub/Vercel.

## Observacoes tecnicas importantes

- O arquivo `src/types/database.ts` ainda esta como `Database = any`. Ideal gerar tipos reais do Supabase depois.
- O arquivo `middleware` gera aviso no build do Next 16 para migrar para `proxy`, mas nao bloqueia deploy.
- Admin depende de `profiles.role = admin`.
- O dominio final ainda nao foi comprado. Quando comprar, atualizar:
  - Vercel Domains
  - `NEXT_PUBLIC_SITE_URL`
  - Mercado Pago webhooks/callbacks
  - Supabase Auth redirect URLs, se aplicavel

## Commits principais desta rodada de trabalho

```txt
3960048 Fix Mercado Pago checkout payment filters
24fcb65 Add Mercado Pago transparent checkout
a2bec6d Fix Pix QR code generation
6567a72 Use Orders API for Pix checkout
f435bef Handle sandbox payer email for Pix orders
f697cad Document Mercado Pago order webhook setup
ea52f3b Update meeting branding and founder images
2681390 Add webhook health check and admin meeting guide
5dc012a Adjust public brand name and founder signature
d4708a3 Improve admin dashboard and add guide tab
commit atual: Improve product admin and add finance dashboard
```
