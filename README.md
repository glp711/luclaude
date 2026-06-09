# Luperfumes

E-commerce de perfumaria de ambiente. Catálogo, checkout com Pix/cartão/boleto, rastreio automático e painel admin.

## Stack

- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4
- **Backend:** Next.js Route Handlers (mesmo deploy) — secrets só no servidor
- **Banco / Auth / Storage:** Supabase (Postgres + RLS)
- **Pagamento:** Mercado Pago (Pix / cartão / boleto)
- **Envio / Rastreio:** Melhor Envio
- **E-mail:** Resend
- **Deploy:** Vercel

## Documentos importantes

- [`docs/RULES.md`](docs/RULES.md) — Regras de negócio completas (catálogo, checkout, máquina de estados, segurança, LGPD). **Toda decisão de implementação referencia este documento.**
- [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) — Schema inicial (10 tabelas + RLS).

## Setup local

```bash
# 1. Instalar dependências
npm install

# 2. Copiar env e preencher
cp .env.example .env.local
# Edite .env.local com as chaves do seu projeto Supabase, Mercado Pago etc.

# 3. Subir o banco
#    Opção A — Supabase Cloud: cole o conteúdo de supabase/migrations/0001_init.sql no SQL Editor.
#    Opção B — Supabase CLI local:
#      npx supabase start
#      npx supabase db reset

# 4. Importar o catálogo (243 produtos como draft)
npm run import:products

# 5. Rodar dev
npm run dev
```

## Separação de segurança

O projeto separa **frontend** e **backend** dentro do mesmo deploy Next.js:

| Camada | Onde roda | Chaves disponíveis |
|---|---|---|
| **Frontend** — `src/app/**` (sem `api/`) e componentes client | Browser | Só `NEXT_PUBLIC_*` (anon key do Supabase, URL do site) |
| **Backend** — `src/app/api/**`, Server Components, Server Actions | Servidor Vercel | Tudo: `SUPABASE_SERVICE_ROLE_KEY`, `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, `MELHORENVIO_TOKEN`, `RESEND_API_KEY` |

Garantias:

- `src/lib/supabase/server.ts` → `createSupabaseAdminClient()` chama `serverEnv()` que lança se executado no browser.
- `src/lib/supabase/browser.ts` → só usa `anon key`.
- Toda mutação sensível (criar pedido, decrementar estoque, gerar etiqueta) passa por API Route ou Server Action.
- Postgres RLS é a segunda linha de defesa: mesmo com a anon key, cliente só lê o que é dele.

## Estrutura

```
luperfumes/
├── docs/
│   └── RULES.md                          # Regras de negócio
├── supabase/
│   └── migrations/
│       └── 0001_init.sql                 # Schema + RLS + seed
├── scripts/
│   └── import-products.ts                # xlsx → Supabase
├── src/
│   ├── middleware.ts                     # Renova sessão Supabase
│   ├── app/
│   │   ├── page.tsx                      # Home
│   │   ├── produtos/                     # Catálogo público
│   │   ├── admin/                        # Painel admin (gate por role)
│   │   └── api/
│   │       ├── checkout/route.ts         # Cria pedido + MP preference
│   │       ├── shipping/quote/route.ts   # Cotação Melhor Envio
│   │       └── webhooks/mercadopago/     # Webhook validado por assinatura
│   ├── lib/
│   │   ├── env.ts                        # Env tipado (client/server split)
│   │   ├── money.ts                      # Centavos ↔ BRL
│   │   ├── slug.ts
│   │   ├── auth/guards.ts                # requireAdmin, getCurrentUser
│   │   ├── cart/store.ts                 # Zustand + localStorage
│   │   ├── supabase/                     # Clientes browser/server/middleware
│   │   ├── mercadopago/                  # SDK + verifyMercadoPagoSignature
│   │   ├── melhorenvio/                  # Cliente HTTP + quoteShipping
│   │   └── email/resend.ts
│   └── types/database.ts                 # Tipos gerados pelo Supabase CLI
└── package.json
```

## Scripts

```bash
npm run dev               # Next em dev
npm run build             # Build de produção
npm run start             # Servir build
npm run lint              # ESLint
npm run typecheck         # TypeScript sem emitir
npm run import:products   # Importa xlsx → tabela products
npm run db:types          # Regenera src/types/database.ts via Supabase CLI
```

## Próximos passos do MVP

1. ✅ Regras de negócio (`docs/RULES.md`)
2. ✅ Schema SQL com RLS (`supabase/migrations/0001_init.sql`)
3. ✅ Scaffold Next.js + libs base
4. ⏳ Criar projeto Supabase, aplicar migration e preencher `.env.local`
5. ⏳ Importar 243 produtos
6. ⏳ Catálogo + carrinho (UI)
7. ⏳ Checkout + Mercado Pago
8. ⏳ Rastreio via Melhor Envio
9. ⏳ Admin CRUD
10. ⏳ Deploy Vercel
