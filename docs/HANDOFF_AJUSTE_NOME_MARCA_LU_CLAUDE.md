# Handoff para Claude - ajuste de nome da marca e assinatura da fundadora

Data: 2026-06-16

## Pedido

Trocar o nome visivel da marca no site de `perfumesdeambientedecor` para:

```txt
perfumes de ambiente decor
```

E, no card da foto da fundadora na home, remover a assinatura `perfumesdeambientedecor` e deixar apenas:

```txt
- lu
```

## Alteracoes feitas

- Atualizados textos visiveis, metadados e labels principais do site para `perfumes de ambiente decor`.
- Atualizados logos textuais no header, menu mobile, auth e admin:
  - `perfumes de ambiente decor`
- Atualizados textos em:
  - home
  - sobre
  - contato
  - carrinho
  - produtos
  - politica de privacidade
  - trocas e devolucoes
  - newsletter
  - WhatsApp
  - e-mail de pedido
  - checkout transparente
  - SEO/OpenGraph de produto
- Na home, o card sobreposto na foto da fundadora agora mostra apenas `- lu`.

## O que nao foi alterado de proposito

- `INSTAGRAM_HANDLE` continua como `perfumesdeambientedecor`, porque esse e o usuario real do Instagram.
- URLs do Instagram continuam usando `https://www.instagram.com/perfumesdeambientedecor/`.
- Nomes dos arquivos em `public/founder/` continuam com `perfumesdeambientedecor`, porque renomear sem necessidade poderia quebrar referencias de imagem.

## Arquivos principais alterados

- `src/app/(site)/page.tsx`
- `src/app/(site)/layout.tsx`
- `src/components/MobileNav.tsx`
- `src/app/layout.tsx`
- `src/app/admin/layout.tsx`
- `src/app/login/page.tsx`
- `src/app/cadastro/page.tsx`
- `src/app/recuperar-senha/page.tsx`
- `src/app/redefinir-senha/page.tsx`
- `src/app/(site)/sobre/page.tsx`
- `src/app/(site)/contato/page.tsx`
- `src/app/(site)/carrinho/CartContents.tsx`
- `src/app/(site)/produtos/page.tsx`
- `src/app/(site)/produtos/[slug]/page.tsx`
- `src/app/(site)/produtos/[slug]/opengraph-image.tsx`
- `src/components/Newsletter.tsx`
- `src/components/WhatsappFab.tsx`
- `src/lib/email/orders.ts`
- `src/lib/melhorenvio/client.ts`
- `src/app/api/checkout/transparent/route.ts`
- `public/logo-mark.svg`
