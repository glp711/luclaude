# Handoff para Claude - Checkout Transparente Mercado Pago

Data: 2026-06-16

## Resumo

Foi implementada uma primeira versao do Checkout Transparente com Mercado Pago Payment Brick, mantendo o Checkout Pro antigo como fallback.

Objetivo do pedido: permitir que o comprador pague dentro da propria loja, sem ser levado para uma tela do Mercado Pago que pode parecer exigir login em conta Mercado Pago.

## Hotfix em 2026-06-16 - Pix sem QR Code

Problema observado pelo usuario: ao clicar para pagar com Pix, o QR Code nao aparecia.

Diagnostico inicial:

- Logs recentes da Vercel nao mostravam `POST /api/checkout/transparent`.
- Isso indicava que o clique do Pix nao estava chegando na rota backend.
- Possivel causa: o Payment Brick nao estava disparando `onSubmit` para o fluxo Pix antes de criar o pagamento.

Correcao aplicada:

- Para Pix, a tela agora mostra um botao direto `Gerar QR Code Pix`.
- Esse botao chama `/api/checkout/transparent` com `payment_method_id: pix`.
- Cartao e boleto continuam usando o Brick.
- A rota agora loga aviso se o Mercado Pago criar pagamento Pix sem retornar `qr_code` ou `qr_code_base64`.

Motivo tecnico:

- Pix nao envolve dados sensiveis de cartao no frontend.
- Portanto, e seguro chamar a API propria da loja diretamente para gerar o pagamento Pix no backend.
- O backend continua recalculando preco/frete e usando `MP_ACCESS_TOKEN` apenas no servidor.

## Ajuste em 2026-06-16 - Pix via Orders API

O painel do Mercado Pago pediu um Order ID de teste para medir a qualidade da integracao. Esse Order ID precisa vir da nova Orders API (`/v1/orders`) e nao da Payments API (`/v1/payments`).

Order ID de teste gerado com credenciais de teste:

```text
ORDTST01KV8FWCHVQQPQQRVQPN3F05W5
```

Resposta resumida da API:

```text
status: action_required
status_detail: waiting_transfer
payment_id: PAY01KV8FWCJNBEZC07Q4E1W573C3
qr_code: retornou
qr_code_base64: retornou
ticket_url: retornou
```

Alteracoes aplicadas:

- Pix em `/api/checkout/transparent` agora cria Order no Mercado Pago via `POST https://api.mercadopago.com/v1/orders`.
- A resposta do checkout agora pode retornar `mp_order_id`.
- A tela de resultado exibe `Order ID Mercado Pago`.
- O webhook agora aceita evento `type=order`, busca a Order no Mercado Pago e atualiza o pedido local quando houver mudanca de status.
- A validacao de assinatura do webhook tambem aceita o `data.id` em lowercase, conforme a documentacao de notificacoes da Orders API.

## Hotfix em 2026-06-16 - `invalid_email_for_sandbox`

Problema observado:

```text
MP order failed with status 400
```

Diagnostico:

- A chamada chegava na Vercel: `POST /api/checkout/transparent` retornando `502`.
- Reproduzindo localmente com o e-mail real do pedido cancelado, a Orders API respondeu:

```json
{"errors":[{"code":"invalid_email_for_sandbox","message":"Email format is invalid for sandbox environment, must contains '@testuser.com'."}]}
```

Causa:

- A aplicacao esta usando credenciais de teste/sandbox da Orders API.
- Nesse ambiente, o Mercado Pago exige que o e-mail do pagador termine com `@testuser.com`.
- O checkout estava enviando o e-mail real digitado pelo cliente, por isso o Mercado Pago retornava 400 e nao gerava QR Code.

Correcao aplicada:

- A rota de Pix agora tenta criar a Order com o e-mail real do comprador.
- Se o Mercado Pago retornar `invalid_email_for_sandbox`, a rota repete automaticamente a criacao com `test_user_br@testuser.com`.
- Em producao real, sem esse erro de sandbox, o fluxo continua usando o e-mail real do cliente.
- O erro do Mercado Pago agora e logado com resposta detalhada, em vez de salvar apenas `MP order failed with status 400`.

## Arquivos alterados

- `package.json`
- `package-lock.json`
- `src/lib/env.ts`
- `src/app/(site)/checkout/CheckoutForm.tsx`
- `src/app/api/checkout/transparent/route.ts`
- `docs/PLANO_CHECKOUT_TRANSPARENTE_MERCADO_PAGO_CLAUDE.md`
- `docs/HANDOFF_CHECKOUT_TRANSPARENTE_IMPLEMENTACAO_CLAUDE.md`

## Dependencia adicionada

```text
@mercadopago/sdk-react
```

Ela renderiza o Payment Brick oficial do Mercado Pago no frontend.

## Variavel de ambiente nova

Adicionar na Vercel e no `.env.local`:

```text
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-... ou TEST-...
```

Essa e a chave publica do Mercado Pago.

O `MP_ACCESS_TOKEN` continua sendo privado e usado apenas no servidor.

Se `NEXT_PUBLIC_MP_PUBLIC_KEY` nao estiver configurada, o checkout transparente nao aparece e a loja continua usando o Checkout Pro antigo.

Confirmacao em 2026-06-16:

- `.env.local` local possui `NEXT_PUBLIC_MP_PUBLIC_KEY`.
- `.env.local` local possui `MP_ACCESS_TOKEN`.
- Vercel possui `NEXT_PUBLIC_MP_PUBLIC_KEY` em Production, Preview e Development.
- Vercel possui `MP_ACCESS_TOKEN` em Production, Preview e Development.

## Fluxo implementado

### Frontend

Arquivo:

```text
src/app/(site)/checkout/CheckoutForm.tsx
```

O checkout agora:

1. Mantem os dados de entrega, frete e dados pessoais.
2. Mantem as opcoes Pix, Cartao e Boleto na tela da loja.
3. Quando existe `NEXT_PUBLIC_MP_PUBLIC_KEY`, renderiza o Payment Brick para a forma escolhida.
4. Envia o payload do Brick para `/api/checkout/transparent`.
5. Mostra o resultado dentro da loja:
   - Pix: QR Code e copia e cola.
   - Boleto: botao para abrir boleto, se a URL vier do Mercado Pago.
   - Cartao: status do pagamento e link do pedido.
6. Mantem o botao "Usar checkout classico" como fallback operacional.

O formulario externo foi trocado de `<form>` para `<div>` porque o Brick renderiza seu proprio fluxo/formulario interno.

### Backend

Arquivo novo:

```text
src/app/api/checkout/transparent/route.ts
```

A nova rota:

1. Valida dados com Zod.
2. Busca usuario logado, se existir.
3. Rebusca produtos no Supabase.
4. Recalcula subtotal no servidor.
5. Valida estoque.
6. Recota frete no Melhor Envio.
7. Cria `orders`.
8. Cria `order_items`.
9. Cria pagamento no Mercado Pago via `payment.create`.
10. Usa `external_reference = order.id`.
11. Grava `mp_payment_id` no pedido.
12. Se o pagamento ja voltar `approved`, marca o pedido como `paid`, grava `paid_at`, baixa estoque e envia e-mail de pedido pago.
13. Para Pix/Boleto pendente, mantem pedido como `pending` e deixa o webhook atualizar depois.

## Webhook

Arquivo existente:

```text
src/app/api/webhooks/mercadopago/route.ts
```

Nao foi removido nem substituido.

Ele continua importante para:

- Confirmar Pix depois do pagamento.
- Confirmar boleto quando compensar.
- Atualizar pagamentos pendentes.
- Evitar confiar somente no retorno imediato do frontend.

Como a nova rota usa `external_reference = order.id`, o webhook atual deve continuar conseguindo mapear o pagamento para o pedido.

## Fallback preservado

O fluxo antigo continua em:

```text
src/app/api/checkout/route.ts
```

Ele ainda cria Preference e retorna `init_point`.

No frontend, quando o checkout transparente estiver ativo, aparece o botao:

```text
Usar checkout classico
```

Isso e intencional para nao deixar a loja sem venda caso o Brick falhe ou alguma credencial esteja faltando.

## Validacoes executadas

Comandos rodados:

```bash
npm run typecheck
npm run lint
npm run build
```

Resultado:

- Typecheck passou.
- Lint passou.
- Build de producao passou.
- A build listou a nova rota `ƒ /api/checkout/transparent`.

Observacao do build:

```text
The "middleware" file convention is deprecated. Please use "proxy" instead.
```

Esse aviso ja existia no padrao do Next e nao foi tratado porque nao faz parte do checkout.

## Documentacao oficial consultada

- Checkout Bricks overview: https://www.mercadopago.com.br/developers/en/docs/checkout-bricks/overview
- Inicializacao comum dos Bricks: https://www.mercadopago.com.br/developers/en/docs/checkout-bricks/common-initialization
- Payment Brick default rendering: https://www.mercadopago.com.br/developers/en/docs/checkout-bricks/payment-brick/default-rendering
- Payment Brick payment submission: https://www.mercadopago.com.br/developers/en/docs/checkout-bricks/payment-brick/payment-submission
- Cards submission: https://www.mercadopago.com.br/developers/en/docs/checkout-bricks/payment-brick/payment-submission/cards
- Pix submission: https://www.mercadopago.com.br/developers/en/docs/checkout-bricks/payment-brick/payment-submission/pix
- Other payment methods / boleto: https://www.mercadopago.com.br/developers/en/docs/checkout-bricks/payment-brick/payment-submission/other-payment-methods

## O que precisa configurar antes de testar em producao

Na Vercel:

```text
NEXT_PUBLIC_MP_PUBLIC_KEY
MP_ACCESS_TOKEN
MP_WEBHOOK_SECRET
NEXT_PUBLIC_SITE_URL=https://luperfumes.vercel.app
```

No Mercado Pago:

- Conta vendedora correta.
- Credenciais de producao ou sandbox consistentes entre Public Key e Access Token.
- Pix habilitado na conta.
- Boleto habilitado, se for usar.
- Webhook apontando para:

```text
https://luperfumes.vercel.app/api/webhooks/mercadopago
```

## Pontos para testar manualmente

1. Checkout com Pix:
   - preencher dados;
   - escolher frete;
   - selecionar Pix;
   - confirmar se aparece QR Code/copia e cola;
   - pagar em sandbox/ambiente real controlado;
   - verificar se webhook muda pedido para `paid`.

2. Checkout com cartao:
   - usar cartao de teste Mercado Pago;
   - confirmar status `approved`/`rejected`;
   - se aprovado, verificar baixa de estoque.

3. Checkout com boleto:
   - confirmar se a conta Mercado Pago retorna `ticket_url`;
   - conferir se o pedido fica `pending`.

4. Fallback:
   - clicar em "Usar checkout classico";
   - confirmar redirecionamento para o Checkout Pro atual.

## Pendencias / riscos

- Teste real de pagamento nao foi executado aqui porque depende das credenciais e ambiente Mercado Pago.
- O banco ainda nao salva detalhes permanentes de Pix/Boleto, como QR Code, linha digitavel, expiracao ou URL do boleto. Esses dados aparecem no retorno imediato da tela.
- A tabela `payments` continua sendo preenchida principalmente pelo webhook.
- Se o webhook estiver mal configurado, Pix/Boleto podem ficar `pending`.
- Confirmar se boleto esta habilitado na conta Mercado Pago da cliente.

## Recomendacao

Subir primeiro com fallback preservado.

Depois de testar Pix, Cartao e Boleto, decidir se remove o Checkout Pro classico ou se mantem como backup.
