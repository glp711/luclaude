# Plano para trocar Checkout Pro por Checkout Transparente / Bricks

Data: 2026-06-16

## Status em 2026-06-16

Implementacao inicial feita no projeto oficial, mantendo Checkout Pro como fallback.

Handoff tecnico completo:

```text
docs/HANDOFF_CHECKOUT_TRANSPARENTE_IMPLEMENTACAO_CLAUDE.md
```

Validacoes realizadas:

```bash
npm run typecheck
npm run lint
npm run build
```

Todas passaram.

## Pedido do usuario

O usuario perguntou se da para trocar o checkout atual do Mercado Pago para Checkout Transparente, porque no Checkout Pro o comprador e levado para uma tela do Mercado Pago e pode parecer que precisa logar na conta Mercado Pago. Nem todo cliente usa Mercado Pago.

## Resposta curta

Sim, da para trocar.

E faz sentido para melhorar conversao e experiencia do comprador, porque o pagamento passa a acontecer dentro da loja, sem redirecionar para a tela do Mercado Pago.

O comprador nao precisa ter conta Mercado Pago. Ele pode pagar com:

- Cartao.
- Pix.
- Boleto, se a conta/credencial permitir.

## Importante sobre dominio

Ainda nao ter dominio proprio nao impede testar Checkout Transparente.

A Vercel ja entrega HTTPS, entao a URL temporaria pode ser usada:

```text
https://luperfumes.vercel.app
```

Dominio proprio continua sendo recomendado para:

- Marca.
- Confianca.
- E-mail profissional.
- DNS/SMTP.

Mas nao e obrigatorio para iniciar a integracao do checkout transparente.

## Situacao atual do projeto

Hoje o projeto usa Checkout Pro.

Arquivo principal:

```text
src/app/api/checkout/route.ts
```

Fluxo atual:

1. Cliente preenche dados no checkout da loja.
2. Backend cria pedido `orders`.
3. Backend cria itens `order_items`.
4. Backend cria uma `preference` no Mercado Pago com `preference.create`.
5. API retorna `init_point`.
6. Frontend redireciona o comprador para Mercado Pago.
7. Mercado Pago processa o pagamento.
8. Webhook atualiza pedido.

O ponto que causa a experiencia ruim e o passo 6: o cliente sai da loja.

## Caminho recomendado

Recomendo trocar para **Mercado Pago Checkout Bricks**, especialmente o `Payment Brick`, antes de partir para uma implementacao 100% manual.

Motivo:

- Mantem o pagamento dentro da loja.
- Evita que o comprador precise logar no Mercado Pago.
- O Mercado Pago fornece componentes prontos para dados sensiveis.
- Reduz risco de PCI, porque os dados do cartao sao tokenizados pelo SDK do Mercado Pago.
- E mais rapido do que montar todos os campos de cartao manualmente.

Documentacao oficial consultada:

- Checkout Bricks overview: https://www.mercadopago.com.br/developers/en/docs/checkout-bricks/overview
- Checkout Transparente via Orders: https://www.mercadopago.com.br/developers/en/docs/checkout-api-orders/overview
- Checkout Pro overview: https://www.mercadopago.com.mx/developers/en/docs/checkout-pro/overview
- Checkout API/Payments overview: https://www.mercadopago.com.br/developers/en/docs/checkout-api-payments/overview.md

Observacao da doc oficial: Mercado Pago recomenda a nova documentacao via Orders API para novas integracoes de Checkout Transparente.

## O que muda no codigo

### 1. Frontend do checkout

Arquivo atual:

```text
src/app/(site)/checkout/CheckoutForm.tsx
```

Hoje ele envia os dados para `/api/checkout` e redireciona:

```ts
window.location.href = data.init_point;
```

Com Checkout Transparente/Bricks, essa parte muda.

Novo fluxo esperado:

1. Cliente preenche frete e dados pessoais.
2. Cliente escolhe Pix, Cartao ou Boleto dentro da loja.
3. A tela renderiza o Brick do Mercado Pago ou um formulario proprio integrado ao SDK.
4. O SDK gera token/dados seguros quando necessario.
5. Frontend envia dados do pagamento para o backend.
6. Backend cria o pagamento/ordem no Mercado Pago.
7. Frontend mostra resultado dentro da propria loja:
   - Pix: QR Code / copia e cola.
   - Cartao: aprovado, recusado ou pendente.
   - Boleto: link/linha digitavel, se habilitado.

### 2. Variaveis de ambiente

Hoje existe:

```text
MP_ACCESS_TOKEN
MP_WEBHOOK_SECRET
```

Para Bricks/SDK no frontend, tambem sera necessario:

```text
NEXT_PUBLIC_MP_PUBLIC_KEY
```

Essa chave publica pode ir para o browser.

O `MP_ACCESS_TOKEN` continua somente no servidor.

### 3. Backend de checkout

Hoje `/api/checkout` cria uma Preference.

No Checkout Transparente, ele deve criar:

- Payment via API/SDK; ou
- Order via nova Orders API do Mercado Pago.

Recomendacao atual: avaliar a Orders API, pois a propria doc do Mercado Pago sinaliza a nova integracao por Orders para Checkout Transparente.

O backend precisa continuar fazendo o que ja faz bem hoje:

- Revalidar produtos no banco.
- Revalidar estoque.
- Recalcular frete no servidor.
- Criar `orders`.
- Criar `order_items`.
- Nunca confiar em preco vindo do frontend.

Mas a etapa final deixa de ser:

```ts
preference.create(...)
```

E passa a ser criacao de pagamento/ordem.

### 4. Webhook

Arquivo atual:

```text
src/app/api/webhooks/mercadopago/route.ts
```

Ele provavelmente pode ser reaproveitado em parte, mas precisa ser revisado.

Pontos a conferir:

- O tipo de evento recebido no Checkout Transparente.
- O ID retornado pela API de pagamento/ordem.
- Como mapear o pagamento de volta para `orders.id`.
- Se o campo `external_reference` continua sendo suficiente.

### 5. Banco de dados

O schema atual provavelmente ja tem boa parte do necessario:

- `orders`
- `order_items`
- `payments`
- `webhook_events`

Mas talvez seja util adicionar campos, dependendo do desenho final:

- `mp_order_id`
- `mp_payment_id`
- `payment_status_detail`
- `payment_raw_response`
- campos para Pix: QR Code, copia e cola, expiracao
- campos para boleto: link PDF, linha digitavel, vencimento

Antes de mexer no schema, revisar a resposta real da API escolhida.

## Etapas recomendadas de implementacao

### Etapa 1 - Prova de conceito

Objetivo: fazer Pix transparente funcionar em ambiente de teste.

Tarefas:

1. Adicionar `NEXT_PUBLIC_MP_PUBLIC_KEY` na Vercel/local.
2. Criar componente de pagamento com Mercado Pago JS/Brick.
3. Criar nova rota backend, por exemplo:

```text
POST /api/checkout/transparent
```

4. Criar pagamento Pix no backend.
5. Mostrar QR Code / copia e cola na tela.
6. Confirmar webhook atualizando pedido.

### Etapa 2 - Cartao

Objetivo: aceitar cartao sem redirecionar.

Tarefas:

1. Usar Card Payment Brick ou Payment Brick.
2. Tokenizar cartao no frontend via SDK.
3. Enviar token para backend.
4. Criar pagamento com token no Mercado Pago.
5. Tratar aprovado/recusado/pendente.
6. Garantir que nenhum dado sensivel de cartao seja salvo no banco.

### Etapa 3 - Boleto

Objetivo: aceitar boleto, se a conta Mercado Pago permitir.

Tarefas:

1. Criar pagamento boleto.
2. Mostrar link/linha digitavel.
3. Manter pedido `pending`.
4. Atualizar status por webhook quando pago/expirado.

### Etapa 4 - Refinamento

Tarefas:

- Melhorar tela de resultado de pagamento.
- Adicionar estados de erro amigaveis.
- Atualizar e-mails de pedido.
- Atualizar painel admin para mostrar Pix/Boleto/Cartao com detalhes.
- Testar em mobile.
- Testar sandbox e producao.

## Cuidados importantes

### Cartao

Nao implementar formulario de cartao "na mao" salvando numero, CVV ou dados sensiveis.

Usar SDK/Brick do Mercado Pago para tokenizacao.

### Conta Mercado Pago

Mesmo com Checkout Transparente, Pix/Boleto dependem da conta Mercado Pago.

Conferir:

- Conta vendedora brasileira.
- Chave Pix cadastrada.
- Credenciais corretas.
- Meio boleto habilitado, se for usar.
- Webhook configurado.

### Teste

Nao testar compra com a mesma conta vendedora.

Usar comprador de teste no sandbox.

## Estimativa de complexidade

Trocar para Checkout Transparente nao e um ajuste pequeno como mudar uma linha.

E uma migracao media/grande porque envolve:

- UI de pagamento.
- SDK frontend.
- Nova API backend.
- Webhook.
- Estados de pedido.
- Testes com sandbox.
- Testes em producao.

Estimativa pratica:

- Pix transparente primeiro: medio.
- Cartao com Brick: medio.
- Pix + Cartao + Boleto bem acabado: medio/grande.

## Recomendacao final

Para entregar uma loja mais profissional para a cliente, vale migrar para Checkout Transparente/Bricks.

Mas eu recomendaria fazer em fases:

1. Manter Checkout Pro funcionando como fallback.
2. Implementar Pix transparente primeiro.
3. Depois implementar Cartao com Payment Brick.
4. Depois Boleto, se realmente for necessario.
5. So remover Checkout Pro quando os testes estiverem bons.

Assim a loja nao fica sem receber pagamento durante a migracao.

## Mensagem simples para explicar para a cliente

"Hoje o pagamento abre a tela segura do Mercado Pago. Da para melhorar isso colocando o pagamento dentro da propria loja, sem exigir que o cliente tenha conta Mercado Pago. Essa troca e possivel, mas e uma etapa maior de desenvolvimento porque muda o modo como Pix, cartao e boleto sao processados."
