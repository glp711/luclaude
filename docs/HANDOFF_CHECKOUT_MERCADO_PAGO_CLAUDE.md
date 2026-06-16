# Handoff para Claude - ajuste do checkout Mercado Pago

Data: 2026-06-16

## Contexto

O projeto oficial fica em:

`C:\Users\rainb\Desktop\lunovo`

O usuario autorizou aplicar no projeto oficial a correcao investigada antes na copia `LUNOVOCODEX`.

Problema observado:

Ao finalizar compra e ir para o Mercado Pago, a tela mostrava somente opcoes como:

- Novo cartao / pre-pago
- Cartao de Debito Virtual CAIXA

O usuario tambem comentou que ainda nao tem dominio proprio e esta usando Vercel porque a cliente ainda nao fechou a compra do dominio.

## Ponto importante

Nao ter dominio proprio ainda nao impede testar Checkout Pro do Mercado Pago.

A URL da Vercel pode ser usada temporariamente:

```text
https://luperfumes.vercel.app
```

Desde que:

- `NEXT_PUBLIC_SITE_URL` esteja configurado como `https://luperfumes.vercel.app`.
- O webhook do Mercado Pago aponte para `https://luperfumes.vercel.app/api/webhooks/mercadopago`.
- As credenciais do Mercado Pago estejam corretas.

Dominio proprio e melhor para marca, confianca e e-mail profissional, mas nao e o motivo direto para Pix/Boleto nao aparecerem.

## Causa encontrada no codigo

Arquivo alterado:

`src/app/api/checkout/route.ts`

Antes, quando a loja mandava `payment_method = "pix"`, o backend criava a preferencia do Mercado Pago excluindo apenas:

```text
credit_card
ticket
```

Isso deixava outros tipos de pagamento passarem, como:

```text
debit_card
prepaid_card
```

Por isso o Mercado Pago podia mostrar cartao pre-pago e debito virtual mesmo quando a escolha na loja era Pix.

## Alteracao feita

Foi criada a funcao:

```ts
mercadoPagoPaymentMethods(method)
```

Ela centraliza as restricoes de meios de pagamento enviadas ao Mercado Pago.

### Pix

Agora exclui:

```text
credit_card
debit_card
prepaid_card
ticket
atm
```

Intencao: deixar passar Pix/bank transfer.

### Cartao

Agora exclui:

```text
debit_card
prepaid_card
ticket
atm
pix
```

E mantem:

```text
installments: 3
```

### Boleto

Agora exclui:

```text
credit_card
debit_card
prepaid_card
atm
pix
```

Intencao: deixar passar boleto/ticket.

## Avaliacao da alteracao

Esta alteracao e boa e faz sentido para o projeto.

Motivos:

- Mantem o checkout atual com Mercado Pago Checkout Pro.
- Nao troca gateway, nao muda banco e nao muda fluxo de pedido.
- Corrige uma incoerencia entre a escolha feita na loja e os metodos exibidos no Mercado Pago.
- Reduz chance de o cliente escolher um meio inesperado quando a loja selecionou Pix, Cartao ou Boleto.
- Centraliza a regra em uma funcao pequena, facilitando ajuste futuro.

Risco residual:

- O Mercado Pago ainda pode esconder Pix ou Boleto se a conta vendedora/credencial nao estiver habilitada para esses meios.
- A correcao no codigo nao substitui a necessidade de configurar chave Pix, credenciais corretas e webhook.

## O que ainda precisa conferir no Mercado Pago

Mesmo com o codigo corrigido, Pix/Boleto so aparecem se o Mercado Pago permitir para aquela conta e credencial.

Conferir:

1. A conta Mercado Pago usada no `MP_ACCESS_TOKEN` e uma conta vendedora brasileira.
2. A conta tem Pix habilitado e chave Pix cadastrada.
3. Se estiver usando sandbox:
   - `MP_ACCESS_TOKEN` deve comecar com `TEST-`.
   - Usar comprador de teste, nao a mesma conta vendedora.
4. Se estiver usando producao:
   - `MP_ACCESS_TOKEN` deve ser de producao.
   - A conta precisa estar apta a vender.
   - Pix e boleto precisam estar habilitados.

Observacao importante da documentacao do Mercado Pago: Pix so aparece se houver chave Pix registrada na conta Mercado Pago.

## Como testar

1. Fazer deploy dessa alteracao na Vercel.
2. Abrir a loja em `https://luperfumes.vercel.app`.
3. Adicionar produto ao carrinho.
4. Ir ao checkout.
5. Escolher Pix.
6. Confirmar que no Mercado Pago nao aparecem cartao pre-pago/debito virtual.
7. Se Pix ainda nao aparecer, revisar chave Pix e credenciais da conta Mercado Pago.
8. Repetir teste com Cartao.
9. Repetir teste com Boleto.

## Status tecnico

Alteracao aplicada no projeto oficial:

`C:\Users\rainb\Desktop\lunovo`

Arquivo modificado:

`src/app/api/checkout/route.ts`

Este arquivo `.md` foi criado para documentar a mudanca para o Claude:

`docs/HANDOFF_CHECKOUT_MERCADO_PAGO_CLAUDE.md`

Validacao local executada:

```bash
npm run typecheck
```

Resultado:

```text
tsc --noEmit passou sem erros
```

## Commit e deploy

Este projeto esta na branch:

```text
main
```

Remoto:

```text
https://github.com/glp711/luclaude.git
```

Quando o commit for enviado com `git push origin main`, a Vercel deve iniciar um novo deploy automaticamente se o projeto estiver conectado ao GitHub.

Depois do deploy, testar em:

```text
https://luperfumes.vercel.app
```
