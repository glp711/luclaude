# Guia rapido para reuniao - Admin e Webhook

Data: 2026-06-16

## Como entrar no painel admin

URL do site:

```txt
https://luperfumes.vercel.app
```

Passo a passo:

1. Abrir `https://luperfumes.vercel.app/login`.
2. Entrar com o e-mail:

```txt
lopesguilherme2912@gmail.com
```

3. Depois de logar, abrir:

```txt
https://luperfumes.vercel.app/admin
```

Observacao: esse e-mail foi marcado como `admin` na tabela `profiles` do Supabase em 2026-06-16.

## O que mostrar no painel

### Dashboard

URL:

```txt
/admin
```

Mostra:

- faturamento do mes
- pedidos a despachar
- pedidos aguardando pagamento
- produtos ativos
- total de produtos
- produtos com estoque baixo

### Produtos

URL:

```txt
/admin/produtos
```

Serve para:

- ver todos os produtos
- buscar por nome
- filtrar por status: ativo, rascunho ou arquivado
- abrir um produto para editar
- criar produto novo em `/admin/produtos/novo`

Campos do produto:

- nome
- slug
- descricao
- categoria
- status
- preco
- preco "de" promocional
- SKU
- estoque
- peso e dimensoes para frete

Observacao para a cliente: hoje o admin edita dados do produto. O upload/gestao visual de imagens pode entrar como uma melhoria futura, se ela quiser autonomia total para fotos.

### Pedidos

URL:

```txt
/admin/pedidos
```

Serve para:

- listar pedidos
- filtrar por status
- abrir detalhes de um pedido
- ver cliente, total, pagamento, endereco e itens
- inserir codigo de rastreio
- mudar status do pedido

Status principais:

- `pending`: aguardando pagamento
- `paid`: pago
- `preparing`: preparando
- `shipped`: enviado
- `delivered`: entregue
- `canceled`: cancelado
- `refunded`: reembolsado

### Categorias

URL:

```txt
/admin/categorias
```

Serve para:

- criar categorias
- renomear categorias
- excluir categorias

O slug e gerado automaticamente pelo sistema.

### Newsletter

URL:

```txt
/admin/newsletter
```

Serve para:

- ver e-mails cadastrados na newsletter
- filtrar ativos ou todos
- conferir origem e data de cadastro

## Webhook Mercado Pago

URL configurada:

```txt
https://luperfumes.vercel.app/api/webhooks/mercadopago
```

Importante: webhook nao e uma pagina normal do site. O Mercado Pago chama essa URL por `POST` com assinatura de seguranca.

Foi adicionado um teste de saude em `GET`, entao abrir a URL no navegador passa a mostrar JSON dizendo que o webhook esta online.

Fluxo:

1. Cliente finaliza pedido no checkout.
2. O site cria pedido no Mercado Pago.
3. Mercado Pago retorna QR Code Pix.
4. Quando o pagamento muda de estado, o Mercado Pago chama o webhook.
5. O sistema valida a assinatura, grava em `webhook_events`, busca os dados no Mercado Pago e atualiza `orders` e `payments`.

## O que falar se a cliente perguntar sobre dominio

Hoje o site esta no dominio da Vercel:

```txt
https://luperfumes.vercel.app
```

Quando o dominio final for comprado, precisa atualizar:

- Vercel/domains
- `NEXT_PUBLIC_SITE_URL`
- URLs de webhook/callback no Mercado Pago
- URLs de callback no Supabase Auth, se necessario

## O que foi corrigido agora

- Criado `GET` de health check no webhook do Mercado Pago para nao parecer erro ao abrir no navegador.
- Confirmado que `lopesguilherme2912@gmail.com` existe no Supabase Auth.
- Promovido esse usuario para admin no Supabase (`profiles.role = admin`).
- Criado este guia para explicar o painel na reuniao.
