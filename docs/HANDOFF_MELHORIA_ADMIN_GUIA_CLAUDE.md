# Handoff para Claude - melhoria visual do admin e aba Guia

Data: 2026-06-16

## Pedido

Melhorar o painel administrativo para ficar mais visivel, com CSS mais forte, fonte/contraste melhores e criar uma aba chamada `Guia` ensinando a usar o painel passo a passo.

## Alteracoes feitas

- Refeito o layout principal do admin em `src/app/admin/layout.tsx`.
- Header do admin agora tem:
  - fundo escuro
  - marca maior
  - subtitulo `Painel administrativo`
  - botao `Ver loja`
  - botao `Sair` mais visivel
  - menu horizontal com botoes grandes
- Adicionada aba `Guia` no menu do admin.
- Refeito o dashboard em `src/app/admin/page.tsx`.
- Dashboard agora tem:
  - bloco principal escuro com titulo grande
  - cards de metricas maiores
  - textos explicando cada numero
  - acoes rapidas para criar produto, ver pedidos e abrir guia
- Criada pagina `src/app/admin/guia/page.tsx`.

## Nova aba Guia

URL:

```txt
https://luperfumes.vercel.app/admin/guia
```

Conteudo da aba:

- como entrar no painel
- como usar o dashboard
- como cadastrar/editar produtos
- como acompanhar pedidos
- como organizar categorias
- como consultar newsletter
- fluxo recomendado de operacao diaria
- explicacao do webhook Mercado Pago
- explicacao dos status dos pedidos

## Arquivos alterados

- `src/app/admin/layout.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/guia/page.tsx`
- `docs/HANDOFF_MELHORIA_ADMIN_GUIA_CLAUDE.md`

## Observacoes

- A seguranca do admin nao foi alterada: continua exigindo usuario com `profiles.role = admin`.
- O e-mail admin ja configurado anteriormente foi `lopesguilherme2912@gmail.com`.
- A nova aba `Guia` e interna ao painel, entao tambem exige login admin.
