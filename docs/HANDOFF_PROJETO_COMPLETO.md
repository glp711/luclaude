# Projeto perfumes de ambiente decor — Handoff completo para Claude

Atualizado em: 2026-06-17
Commit base no momento da escrita: `6d6b423`
URL de producao: https://luperfumes.vercel.app
Repo: https://github.com/glp711/luclaude

Este documento eh autocontido. Um Claude novo lendo ele deve conseguir continuar
o trabalho sem precisar de mais contexto. Substitui a necessidade de ler
`HANDOFF_COMPLETO_PARA_CLAUDE.md` e `HANDOFF_MEGAMENU_BRANDS_HOME_CLAUDE.md`,
embora aqueles documentos continuem validos como referencia historica.

---

## 1. O que eh o projeto

**E-commerce multimarca** de perfumaria de ambiente (difusores, sabonetes, home
sprays, agua perfumada, essencias, velas e itens de corpo). Cliente final eh
**LU**, dona da `perfumes de ambiente decor`. O Instagram da loja eh
[@perfumesdeambientedecor](https://www.instagram.com/perfumesdeambientedecor/).
Owner tecnico/financeiro: Guilherme (`lopesguilherme2912@gmail.com`).

### Historia rapida

- **Inicio:** projeto comecou como "Luperfumes" — single-brand baseado num scrape
  do site Dani Fernandes (243 produtos importados).
- **Mid-flight:** marca virou "perfumes de ambiente decor" (rebrand sem trocar
  paths tecnicos).
- **Agora:** loja eh multimarca com 11 marcas cadastradas (so Dani Fernandes
  com produtos por enquanto). Estrutura pronta pra adicionar outras marcas a
  medida que LU for adquirindo.

### O usuario eh **paciente, autonomo, gosta de delegacao com confianca**

Padrao de interacao observado: ele descreve o que quer em alto nivel,
deixa o Claude tomar decisoes razoaveis, depois revisa. Nao gosta de
perguntas demais; gosta quando o Claude **planeja antes de codar** e
**explica decisoes apos**. Ele tem cliente real (LU) com reunioes
agendadas — entregar a tempo importa.

---

## 2. Stack tecnico

### Frontend
- **Next.js 16** com App Router (Turbopack)
- **React 19**
- **TypeScript 5**
- **Tailwind v4** (tokens em `@theme inline` dentro de `globals.css`)
- **Zustand** para carrinho (persistido em localStorage)
- **Zod** para validacao (envs + payloads de API)

### Backend
- API Routes do Next.js (mesmo deploy, sem servidor separado)
- Server Actions para mutacoes de admin/auth
- **Supabase** (Postgres + Auth + Storage)

### Integracoes
- **Mercado Pago** (Orders API — fluxo transparente com Pix QR Code,
  cartao 3x sem juros, boleto)
- **Melhor Envio** (sandbox por enquanto — cotacao de frete Correios/Jadlog,
  geracao de etiqueta)
- **Resend** (e-mails transacionais; remetente atual `onboarding@resend.dev`
  — precisa configurar dominio proprio antes de producao)

### Deploy
- **Vercel** Hobby (gratis ate certos limites)
- Auto-deploy via git push para `origin main`
- Project ID: `prj_jvskvCscxmgFFi9VU405K1iLnd25`
- Team ID: `team_Vu4pXJaH7Cni1DPTsAVh9bi6`
- Producao em https://luperfumes.vercel.app

---

## 3. Identidade visual

### Paleta (tokens CSS em `src/app/globals.css`)
```
cream         #f5ecdc   (background principal)
cream-soft    #faf4e9   (superficies elevadas)
cream-deep    #ebe0cc   (bordas, divisores)
coral         #efa89c   (CTAs, acentos primarios)
coral-deep    #e48b7d   (hover de CTAs)
coral-soft    #f8d3cb   (background de chips/badges)
sage          #a8c5bc   (acentos secundarios)
sage-deep     #87b1a4   (uppercase eyebrows)
sage-soft     #d4e3dd   (icones de beneficios)
ink           #2d2924   (texto principal, NAO eh preto puro)
ink-soft      #6e655a   (texto secundario)
ink-mute      #a89e91   (texto terciario)
```

### Tipografia
- **Font display:** Cormorant Garamond (Next font, `--font-display`).
  Usada em titulos, prices, eyebrows. Classe `font-display`.
- **Font sans:** Inter (`--font-sans`). Body, UI, formularios.

### Convencoes visuais
- Botoes principais: `rounded-full bg-coral px-7 py-3 text-sm font-medium text-white hover:bg-coral-deep`
- Cards: `rounded-2xl border border-cream-deep bg-cream-soft p-6`
- Cards admin: `rounded-[8px]` (estilo mais quadrado, decisao da LU)
- Eyebrows (texto antes de titulo): `text-xs uppercase tracking-widest text-sage-deep`
- Focus visible: ring coral, definido globalmente em `globals.css`
- Imagens decorativas com `bg-image` CSS (fallback gracioso quando arquivo nao existe)
- Imagens de produto/destaque com `<Image>` do next/image
- Logo: `/logo-mark.svg` (SVG inline com frasco coral em selo)

### Decisoes importantes de identidade
- **Nome publico:** "perfumes de ambiente decor" (com minusculas, sem caps).
- Em alguns lugares aparece com "decor" estilizado em `text-coral-deep`.
- A palavra "Luperfumes" so deve aparecer em paths tecnicos: pasta do projeto,
  variavel `name` no `package.json`, repo `luclaude` no GitHub, projeto `luperfumes`
  no Vercel. Em qualquer texto visivel pro usuario, usar **"perfumes de ambiente decor"**.
- "LU" agora aparece como assinatura nas paginas (footer, sobre).
- `INSTAGRAM_HANDLE` em `src/lib/contact.ts` continua `"perfumesdeambientedecor"`
  porque eh o handle do Instagram real (URL: instagram.com/perfumesdeambientedecor/).

---

## 4. Banco de dados (Supabase)

### Projeto
URL: `https://phkpwvdbmeotyqchybch.supabase.co`
Dashboard: https://supabase.com/dashboard/project/phkpwvdbmeotyqchybch

### Migrations executadas
Todas em `supabase/migrations/`. Rodar em ordem no SQL Editor do Studio.

1. **`0001_init.sql`** — schema inicial:
   - `profiles` (estende `auth.users`, com `role text`)
   - `categories` (id, slug, name, position)
   - `products` (slug, name, price_cents, compare_at_price_cents, sku,
     stock_quantity, weight_g, dimensoes, status, category_id, source_url,
     description)
   - `product_images` (url, alt, position)
   - `addresses` (perfil do cliente)
   - `orders` (status, total_cents, shipping_address jsonb, mp_*, tracking_*)
   - `order_items` (com snapshot imutavel do produto)
   - `payments` (log do gateway)
   - `shipments` (log de etiquetas)
   - `webhook_events` (idempotencia)
   - RLS em todas as tabelas
   - Helper `public.is_admin()` que olha `profiles.role = 'admin'`

2. **`0002_newsletter.sql`** — tabela `newsletter_subscriptions`
   (email, source, subscribed_at, unsubscribed_at, confirmed).

3. **`0003_decrement_stock.sql`** — funcao RPC
   `decrement_product_stock(p_id uuid, p_qty int)` chamada pelo webhook
   quando pedido vira pago. Usa `greatest(stock - qty, 0)` pra evitar negativo.

4. **`0004_brands_and_groups.sql`** — **PRECISA RODAR ESSA AINDA**:
   - Cria tabela `brands` com 11 marcas seedadas
   - Adiciona `products.brand_id` (FK nullable)
   - Adiciona `categories.group_slug` + `product_type_label`
   - Renomeia categorias antigas pros slugs do mega menu
   - Seed de 18 categorias novas (tipos de produto)
   - Backfill: todos os 243 produtos atuais -> brand `dani-fernandes`
   - RLS leitura publica + escrita admin
   - Idempotente (`on conflict do update`)

### Como rodar uma migration
1. Supabase Studio -> SQL Editor -> New query
2. Cola o conteudo do `.sql`
3. Run

### Schema apos todas as migrations

**Tabelas principais:**

`profiles` — perfil estende auth.users
- id (uuid, mesmo que auth.users.id)
- full_name, phone
- **role** ('admin' ou 'customer')
- created_at

`categories` — tipos de produto
- id, slug, name, position
- **group_slug** (ex.: 'difusores', 'aromatizacao') — adicionado em 0004
- **product_type_label** — label legivel do tipo

`brands` — marcas (adicionado em 0004)
- id, slug, name, position, active

`products`
- id, slug, name, description, sku
- price_cents, compare_at_price_cents
- stock_quantity, weight_g, width/height/length_cm
- status ('active' | 'draft' | 'archived')
- category_id (FK -> categories)
- **brand_id** (FK -> brands, nullable, adicionado em 0004)
- source_url (url original do scrape, opcional)
- created_at, updated_at

`product_images` — id, product_id, url, alt, position
   (imagens estao no Supabase Storage bucket `product-images`, publico)

`orders` — pedidos
- id, order_number (bigserial)
- customer_id (nullable, FK profiles), guest_email
- status ('pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' |
  'canceled' | 'refunded')
- subtotal_cents, shipping_cents, discount_cents, total_cents
- shipping_address (jsonb com snapshot do endereco)
- shipping_service (string descritiva)
- payment_method ('pix' | 'credit_card' | 'boleto')
- mp_preference_id, mp_payment_id, paid_at
- tracking_code, tracking_carrier, shipped_at, delivered_at
- notes
- created_at, updated_at

`order_items` — id, order_id, product_id (FK opcional),
   product_snapshot (jsonb imutavel), quantity, unit_price_cents,
   total_cents (generated coluna)

`payments` — log do gateway (id, order_id, gateway, gateway_payment_id,
   status, amount_cents, raw_payload jsonb)

`shipments` — log de etiquetas (id, order_id, provider, provider_order_id,
   service, tracking_code, label_url, status)

`webhook_events` — idempotencia (id, source, event_id UNIQUE,
   payload jsonb, processed_at, processing_error)

`newsletter_subscriptions` — id, email (UNIQUE lower), source,
   subscribed_at, unsubscribed_at, confirmed

### RLS (Row Level Security)

Resumo das politicas:
- `categories`, `brands`, `products`, `product_images`: leitura publica,
  escrita admin
- `orders`, `order_items`, `addresses`: cliente le proprio (`auth.uid()`),
  admin le tudo
- `webhook_events`: sem politica permissiva, so service_role
- `payments`, `shipments`: so service_role
- `profiles`: cada um le o proprio + admin le todos
- `newsletter_subscriptions`: insert publico (anon), leitura admin

### Helper `is_admin()`
```sql
create or replace function public.is_admin() returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql stable;
```

### Conta admin atual
Apenas `lopesguilherme2912@gmail.com` esta com `role = 'admin'`. Foi promovido
manualmente via SQL no Supabase. Para promover outro:
```sql
update public.profiles set role = 'admin' where id = (
  select id from auth.users where email = 'novo-admin@exemplo.com'
);
```

---

## 5. Estrutura de pastas (alto nivel)

```
C:\Users\rainb\Desktop\lunovo\
├── docs/                                  -> handoffs anteriores
│   ├── HANDOFF_COMPLETO_PARA_CLAUDE.md    (rodada anterior)
│   ├── HANDOFF_MEGAMENU_BRANDS_HOME_CLAUDE.md (rodada mais recente)
│   └── HANDOFF_PROJETO_COMPLETO.md        (este)
├── public/
│   ├── logo-mark.svg                      -> logo SVG inline (frasco coral)
│   └── founder/                           -> fotos da LU
│       ├── perfumesdeambientedecor-founder-diffuser.png
│       ├── perfumesdeambientedecor-founder-gift.png
│       ├── perfumesdeambientedecor-founder-card.png
│       └── perfumesdeambientedecor-product-kit.png
├── data/                                  -> seed inicial
│   ├── produtos_dani_fernandes_243.xlsx
│   └── produtos_dani_fernandes_243.csv
├── scripts/
│   ├── import-products.ts                 -> npm run import:products
│   └── import-images.ts                   -> npm run import:images
├── supabase/migrations/
│   ├── 0001_init.sql
│   ├── 0002_newsletter.sql
│   ├── 0003_decrement_stock.sql
│   └── 0004_brands_and_groups.sql         (NAO RODADA AINDA)
├── src/
│   ├── app/                               -> Next App Router
│   ├── components/
│   ├── lib/
│   └── types/
├── .env.local                             -> secrets locais (gitignored)
├── next.config.ts                         -> remotePatterns whitelist Supabase
├── package.json
└── tsconfig.json
```

---

## 6. Rotas do app

### Storefront `(site)`

| Rota | Arquivo | Descricao |
|------|---------|-----------|
| `/` | `(site)/page.tsx` | Home: hero, beneficios, atalhos, novidades, pilares, sobre fundadora |
| `/produtos` | `(site)/produtos/page.tsx` | Catalogo com filtros combinaveis (categoria + marca + busca + sort + page + ofertas) |
| `/produtos/[slug]` | `(site)/produtos/[slug]/page.tsx` | Detalhe do produto, galeria, relacionados, JSON-LD Product + Breadcrumb |
| `/produtos/[slug]/opengraph-image` | `opengraph-image.tsx` | OG image dinamica (1200x630) |
| `/produtos/loading.tsx`, `.../loading.tsx` | | Skeletons |
| `/marcas` | `(site)/marcas/page.tsx` | Lista todas as marcas ativas |
| `/carrinho` | `(site)/carrinho/page.tsx` + `CartContents.tsx` | Carrinho (Zustand + localStorage) |
| `/checkout` | `(site)/checkout/page.tsx` + `CheckoutForm.tsx` | Form de checkout, redirects pro MP |
| `/pedidos/[id]` | `(site)/pedidos/[id]/page.tsx` | Confirmacao publica pos-pagamento (MP back_urls levam pra ca) |
| `/minha-conta` | `(site)/minha-conta/page.tsx` | Dashboard do cliente logado |
| `/sobre` | `(site)/sobre/page.tsx` | Historia da marca |
| `/contato` | `(site)/contato/page.tsx` | WhatsApp + e-mail + Instagram |
| `/trocas-devolucoes` | `(site)/trocas-devolucoes/page.tsx` | Politica seguindo CDC |
| `/politica-de-privacidade` | `(site)/politica-de-privacidade/page.tsx` | LGPD |

### Auth

| Rota | Arquivo |
|------|---------|
| `/login` | `app/login/page.tsx` + `actions.ts` |
| `/cadastro` | `app/cadastro/page.tsx` + `actions.ts` |
| `/recuperar-senha` | `app/recuperar-senha/page.tsx` + `actions.ts` |
| `/redefinir-senha` | `app/redefinir-senha/page.tsx` + `actions.ts` |
| `/logout` | `app/logout/route.ts` |
| `/auth/callback` | `app/auth/callback/route.ts` (Supabase OAuth callback) |

### Admin (so `role = 'admin'` acessa; outros recebem 404)

| Rota | Descricao |
|------|-----------|
| `/admin` | Dashboard com MetricCards e QuickActions |
| `/admin/produtos` | Lista com thumbnails, filtros |
| `/admin/produtos/novo` | Criar produto (form em 3 etapas) |
| `/admin/produtos/[id]` | Editar produto, publicar/arquivar |
| `/admin/pedidos` | Lista com badges de status, junta `profiles` pra mostrar nome |
| `/admin/pedidos/[id]` | Detalhe do pedido, transitions de status, rastreio |
| `/admin/categorias` | CRUD de categorias |
| `/admin/newsletter` | Lista de inscritos (200 mais recentes) |
| `/admin/financeiro` | Faturamento do mes, grafico por dia, ticket medio. Lucro real = Pendente (schema nao tem `cost_cents`) |
| `/admin/guia` | Passo-a-passo interno pra ensinar a LU |

### API Routes

| Rota | Metodo | Descricao |
|------|--------|-----------|
| `/api/checkout` | POST | Versao "preferences" (cria order + MP preference). Ainda usada como fallback |
| `/api/checkout/transparent` | POST | Versao Orders API com Pix QR Code direto (atual) |
| `/api/shipping/quote` | POST | Cota frete via Melhor Envio |
| `/api/webhooks/mercadopago` | POST/GET | Webhook MP. GET retorna health check JSON |
| `/api/newsletter` | POST | Insere em `newsletter_subscriptions` |

### Static/Metadata

- `/robots.txt` (static, gerado por `app/robots.ts`)
- `/sitemap.xml` (dynamic, gerado por `app/sitemap.ts`)
- `/not-found.tsx` (404 personalizado)

---

## 7. Variaveis de ambiente

Todas em `.env.local` (gitignored) e replicadas no Vercel (production +
preview + development). Ver tambem secao 11 sobre o bug do Vercel CLI.

> **Os valores reais estao em `.env.local` (gitignored) e no painel da Vercel.**
> Este documento documenta apenas a estrutura.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_***"
SUPABASE_SERVICE_ROLE_KEY="sb_secret_***"          # NUNCA expor ao client
NEXT_PUBLIC_SITE_URL="https://luperfumes.vercel.app"

# Mercado Pago (test users — APP_USR- em test app, sem dinheiro real)
NEXT_PUBLIC_MP_PUBLIC_KEY="APP_USR-***"
MP_ACCESS_TOKEN="APP_USR-***"                       # server-only
MP_WEBHOOK_SECRET="***"                             # gerado ao criar webhook no MP
MP_CLIENT_ID="***"                                  # OAuth (opcional)
MP_CLIENT_SECRET="***"                              # OAuth (opcional)

# Melhor Envio (sandbox)
MELHORENVIO_TOKEN="***"                             # JWT longo
MELHORENVIO_BASE_URL="https://sandbox.melhorenvio.com.br"

# Loja
STORE_ORIGIN_CEP="01310100"
STORE_FALLBACK_SHIPPING_CENTS="2500"
STORE_FREE_SHIPPING_THRESHOLD_CENTS="25000"

# Resend (e-mails)
RESEND_API_KEY="re_***"
ADMIN_NOTIFICATION_EMAIL="lopesguilherme2912@gmail.com"
```

**Project ref do Supabase:** `phkpwvdbmeotyqchybch`
**Dashboard:** https://supabase.com/dashboard/project/phkpwvdbmeotyqchybch

### Validacao via Zod
`src/lib/env.ts` valida tudo. `clientEnv` so as `NEXT_PUBLIC_*`, `serverEnv()`
todas (chamado dentro de server components / route handlers).

---

## 8. Checkout: como funciona ponta a ponta

### Fluxo do usuario
1. Adiciona produto ao carrinho (Zustand + localStorage, `useCart`)
2. Vai pra `/carrinho` → "Finalizar compra"
3. `/checkout` mostra form: endereco (auto-fill ViaCEP), cotacao Melhor Envio,
   dados do cliente, metodo de pagamento
4. Submit → `/api/checkout/transparent`:
   - Valida com Zod
   - Re-busca produtos no DB (NUNCA confia em precos do body)
   - Verifica estoque
   - Re-cota frete no Melhor Envio (rejeita se `shipping_service_id` invalido)
   - Cria order com status `pending`
   - Cria order_items com snapshot imutavel
   - Cria order no Mercado Pago (Orders API com Pix QR Code se for pix)
   - Retorna `init_point` ou `qr_code` + `order_id`
5. Para Pix: cliente ve QR Code direto na pagina
6. Para cartao/boleto: redireciona pro Mercado Pago
7. Cliente paga
8. MP envia webhook pra `/api/webhooks/mercadopago`:
   - Valida HMAC SHA256 com `MP_WEBHOOK_SECRET`
   - Insere em `webhook_events` (UNIQUE evita duplicacao)
   - Re-consulta API do MP (`api.mercadopago.com/v1/orders/{id}`)
   - Mapeia status MP → status interno via `mpOrderStatusToOrderStatus`
   - Insere log em `payments`
   - Atualiza order (status, mp_payment_id, paid_at)
   - Se foi pra `paid`: chama RPC `decrement_product_stock` para cada item
   - Dispara e-mail de confirmacao via `sendOrderPaidEmail` (Resend)
9. MP redireciona cliente pra `/pedidos/[id]?ok=1` (back_url)

### Mapeamento de status MP → interno

`mpStatusToOrderStatus` (para evento type=payment):
```
approved              → paid
in_process/pending/authorized → pending
rejected/cancelled    → canceled
refunded/charged_back → refunded
```

`mpOrderStatusToOrderStatus` (para evento type=order, Orders API):
```
processed/completed/detail=accredited → paid
action_required/created/processing    → pending
cancelled/canceled/expired/failed     → canceled
refunded/charged_back                 → refunded
```

### Validacoes server-side criticas
1. **Preco** sempre re-buscado do DB. Carrinho do cliente eh so referencia.
2. **Estoque** verificado antes de criar order; nao decrementa ainda.
3. **Estoque** so decrementa quando webhook confirma `paid` (idempotencia
   via `webhook_events.event_id UNIQUE`).
4. **Frete** re-cotado, nao confia no valor enviado pelo cliente.
5. **Webhook signature** validada antes de processar.

### Webhook deve estar configurado no painel do MP

URL: `https://luperfumes.vercel.app/api/webhooks/mercadopago`
Eventos: marcar **Order (Mercado Pago)** (o evento legado "payment" tambem funciona).
Segredo de assinatura: o valor de `MP_WEBHOOK_SECRET`.

A rota responde `GET` com health check JSON se for aberta no navegador.

---

## 9. Navegacao: mega menu (rodada mais recente)

### Estrutura: GRUPO → TIPO → MARCA → catalogo filtrado

**Fonte unica** em `src/lib/navigation.ts`. Tipos:
```ts
type BrandLink = { slug: string; label: string };
type MenuType = { categorySlug: string; label: string; brands: BrandLink[] };
type MenuGroup = { slug: string; label: string; types: MenuType[]; feature?: MenuFeature };
```

### Grupos atuais (6 com painel + 2 links diretos)

1. **Aromatizacao**: agua-perfumada, home-spray, sachet-perfumado,
   essencia-concentrada, aroma-para-carro, gesso-perfumado, monograma
2. **Difusores**: difusor-de-varetas, refil-para-difusor-de-varetas,
   difusor-eletrico
3. **Sabonetes**: sabonete-liquido, sabonete-em-barra,
   refil-de-sabonete-liquido, sabonete-espumador, refil-de-sabonete-espumador
4. **Velas e Aromas**: vela-perfumada, cera-perfumada, luminaria-aromatica
5. **Corpo e Perfumaria**: hidratantes, body-splash, parfum
6. **Maison Berger**: lampe-berger, refil-para-lampe-berger
7. Link direto: **Marcas** (`/marcas`)
8. Link direto: **Ofertas** (`/produtos?ofertas=1`)

### 11 marcas (ALL_BRANDS)

`m-victoria`, `kailash`, `lenvie`, `dani-fernandes`, `doce-aroma`,
`chantree`, `via-aroma`, `bubas`, `la-florentina`, `maison-berger`,
`six-senses`

### Comportamento

**Desktop (`lg+`):**
- Hover ou foco no item da nav abre painel
- Bridge invisivel (8px de altura) entre item e painel evita fechamento
- ESC fecha, click fora fecha, navegar fecha
- ARIA: aria-expanded, aria-haspopup, aria-controls
- Ring de foco coral em focus-visible
- Lateral opcional pra `feature` (campanha/imagem)

**Mobile (`<lg`):**
- Botao hamburguer abre drawer lateral
- Drawer renderizado via `createPortal(document.body)` (escapa do
  `backdrop-blur` do header que cria containing block para `position: fixed`)
- Acordeao 3 niveis: Grupo → Tipo → Marcas
- Apenas um grupo aberto + um tipo aberto por vez
- Scroll lock, ESC, click no backdrop fecham
- Userarea no rodape

### Componentes
- `src/components/Header/Header.tsx` (server) — compoe tudo
- `src/components/Header/MegaMenu.tsx` (client) — painel desktop
- `src/components/Header/MobileMenuDrawer.tsx` (client) — drawer mobile
- `src/components/Header/SearchInput.tsx` (client) — submete pra `/produtos?busca=`

### URLs canonicas do catalogo
```
/produtos                                     -> tudo
/produtos?categoria=agua-perfumada            -> tipo
/produtos?marca=via-aroma                     -> so marca
/produtos?categoria=agua-perfumada&marca=m-victoria  -> combinado
/produtos?busca=tenue                         -> busca
/produtos?sort=price_asc                      -> ordenacao
/produtos?ofertas=1                           -> so produtos com compare_at_price
```

Helper em `src/lib/url.ts`:
- `buildProductsUrl({categoria, marca, busca, sort, page, ofertas})`
- `buildProductsUrlWithout(filters, key)` — usado nos chips de filtro

---

## 10. Primeira secao da home

### Componentes
- `src/components/Home/HeroBanner.tsx` — 2 colunas (texto + imagem),
  Image do next/image, focus-visible ring nos CTAs
- `src/components/Home/BenefitsBar.tsx` — 4 beneficios em SVG inline
- `src/components/Home/CategoryShortcuts.tsx` — 7 atalhos visuais

### Config (textos editaveis sem mexer em JSX)
`src/lib/home-content.ts`:
- `HERO` (eyebrow, title, description, primaryCta, secondaryCta, imageSrc, imageAlt)
- `BENEFITS` (4 itens com iconKey: shipping|secure|payment|support)
- `CATEGORY_SHORTCUTS` (7 atalhos categoria)

### Resto da home (NAO mexer sem motivo)
- Secao "Novidades" (8 produtos mais recentes do banco)
- Secao "Por que perfumes de ambiente decor" (PILLARS = 4 cards SVG)
- Secao "Sobre a fundadora" com placeholder de foto

---

## 11. Notas importantes / pegadinhas

### Vercel CLI estava bugado com pipe e `--value`
Quando eu (Claude) tentei popular envs via `vercel env add` com pipe do
PowerShell ou flag `--value`, **os valores subiam como string vazia**.
Possivelmente por causa do plugin `vercel@claude-plugins-official` interceptando.

**Workaround:** ler `~/AppData/Roaming/xdg.data/com.vercel.cli/auth.json`
e chamar `api.vercel.com/v10/projects/.../env` direto. O token expira; rodar
`vercel whoami` antes pra forcar refresh.

### Database = any
`src/types/database.ts` ainda esta com `Database = any`. Ideal gerar tipos
reais com `npx supabase gen types typescript --project-id ...` quando der
tempo. Nao bloqueia nada.

### Middleware esta com warning de deprecation
Next 16 quer migrar de `middleware.ts` pra `proxy.ts`. Nao bloqueia build.
Migrar quando der tempo.

### Vercel auth tier
`luperfumes.vercel.app` eh publico. As URLs longas
`luperfumes-lopesguilherme2912-gmailcoms-projects.vercel.app` tem Vercel Auth
ativado por default no Hobby — retornam 401 sem login. Usar a curta.

### Sandbox vs producao do Mercado Pago
- Test users criados no painel MP test, credentials comecam com `APP_USR-`
  mas estao limitados ao app de teste.
- Para producao real: gerar novas credentials no painel principal e
  trocar `MP_ACCESS_TOKEN` + `NEXT_PUBLIC_MP_PUBLIC_KEY`.
- O webhook secret tambem muda — gerar novo ao criar webhook em producao.

### Resend remetente
Ainda eh `onboarding@resend.dev`. Para producao:
1. Verificar dominio proprio no Resend (DNS TXT)
2. Trocar `FROM_ADDR` em `src/lib/email/orders.ts` pra
   `"perfumes de ambiente decor <pedidos@<dominio>>"`

### Migration 0004 NAO foi rodada ainda
Bloqueia: filtro de marca, pagina `/marcas`. Rodar antes de qualquer demo.

### Categoria de produtos atuais
Os 243 produtos da Dani Fernandes estavam todos em `category_slug=difusores`
antes da 0004. A 0004 renomeou esse slug pra `difusor-de-varetas`. Mas os
243 incluem produtos de outras categorias (refil, agua perfumada, gesso etc)
porque o script de import categorizou via palavra-chave no nome. Vale uma
auditoria por SQL apos rodar a 0004 pra ver distribuicao real:
```sql
select c.slug, count(*) from products p
left join categories c on c.id = p.category_id
group by c.slug order by count(*) desc;
```

### Decremento de estoque idempotente
A funcao SQL `decrement_product_stock` nao tem proteacao contra dupla
chamada — confia que webhook_events.UNIQUE evita reprocessamento. Se
algum dia mudar fluxo, atencao nisso.

---

## 12. Como operar a loja (LU como admin)

### Login admin
1. Entrar em `/login` com `lopesguilherme2912@gmail.com`
2. Acessar `/admin`

(Sem login admin, `/admin` retorna 404 — design proposital para nao revelar
existencia do admin.)

### Cadastrar produto
- `/admin/produtos/novo`
- Form em 3 etapas: basico → preco/estoque → dimensoes pra frete
- **Atualmente nao tem campo brand_id no form.** Setar via SQL ou aguardar
  Claude adicionar campo no form.

### Acompanhar pedidos
- `/admin/pedidos` — lista por status
- `/admin/pedidos/[id]` — detalhe, botoes de transicao manual,
  campo de tracking_code/carrier

### Financeiro
- `/admin/financeiro` — faturamento mensal + grafico por dia + ticket medio
- "Lucro real" = Pendente (schema sem `cost_cents`)

### Newsletter
- `/admin/newsletter` — lista de inscritos (200 mais recentes)
- API `/api/newsletter` ja salva server-side via Supabase

### Categorias
- `/admin/categorias` — CRUD basico

---

## 13. Pendencias tecnicas (lista priorizada)

### Critico antes de qualquer demo
1. **Rodar `0004_brands_and_groups.sql` no Supabase Studio.** Sem isso,
   filtros de marca nao funcionam. Idempotente.

### Curto prazo (apos validar com LU)
2. Adicionar campo `brand_id` no `ProductForm` do admin
3. Adicionar campo `cost_cents` em `products` + form admin + calculo
   de lucro real em `/admin/financeiro`
4. Auditoria das categorias dos 243 produtos (ver query acima)
5. Comprar dominio proprio + configurar Vercel + atualizar `NEXT_PUBLIC_SITE_URL`
   + Resend + Mercado Pago
6. Verificar dominio no Resend pra parar de mandar de `onboarding@resend.dev`

### Medio prazo (operacao real)
7. Subir credentials de PRODUCAO do Mercado Pago (sair de test users)
8. Subir token de PRODUCAO do Melhor Envio (sair de sandbox)
9. Configurar webhook de producao no MP
10. Geracao de tipos do Supabase pra trocar `Database = any` por
    tipos reais (`npx supabase gen types typescript`)
11. Migrar middleware pra proxy (warning do Next 16)
12. Importar/cadastrar produtos das outras 10 marcas

### Longo prazo / melhorias
13. Filtro por preco no catalogo
14. Filtro por fragrancia (precisa adicionar campo no schema)
15. Recomendacao de produtos baseada em historico
16. Reviews/avaliacoes
17. Cupom de desconto
18. Wishlist
19. Multi-imagem por produto no admin (hoje so uma via script)

---

## 14. Comandos uteis

```bash
# Dev local
cd C:\Users\rainb\Desktop\lunovo
npm run dev                   # http://localhost:3000

# Validacao
npm run typecheck             # tsc --noEmit
npm run lint                  # eslint
npm run build                 # next build

# Scripts de importacao
npm run import:products       # importa xlsx pro Supabase
npm run import:images         # baixa imagens das URLs originais

# Git
git status
git log --oneline -10
git push origin main          # auto-deploy Vercel

# Vercel CLI (autenticada)
vercel whoami                 # checa login (refresh do token)
vercel env pull .env.prod --environment=production --yes
vercel --prod --yes           # deploy manual (auto-deploy via git tambem funciona)
```

### Bash util pra testar prod
```bash
for path in / /produtos /marcas; do
  echo "$(curl -s -o /dev/null -w '%{http_code}' https://luperfumes.vercel.app$path)  $path"
done
```

---

## 15. Instrucoes criticas pra proximo Claude

### Antes de tocar em codigo

1. Ler este documento e `HANDOFF_MEGAMENU_BRANDS_HOME_CLAUDE.md` se quiser
   detalhe da rodada mais recente.
2. Rodar `git log --oneline -20` para ver os commits recentes.
3. Rodar `npm run build` para confirmar que o codigo atual compila.
4. Confirmar com o usuario se a migration 0004 ja foi rodada no Supabase.
   Sem ela, qualquer trabalho de marca/filtro vai parecer quebrado em prod.

### Decisoes que NAO devem ser revertidas

1. Nome publico **"perfumes de ambiente decor"** (com minusculas).
2. Paleta cream/coral/sage. Spec do usuario reforca usar identidade existente.
3. Tipografia Cormorant Garamond + Inter.
4. `INSTAGRAM_HANDLE = "perfumesdeambientedecor"` (sem espaco, eh URL real).
5. Pasta do projeto/repo/Vercel mantem nomes antigos (`lunovo`, `luclaude`,
   `luperfumes`) porque sao paths tecnicos.
6. `/admin` retorna 404 pra nao-admins (design intencional via `notFound()`).
7. Mega menu nao tem fragrancia como nivel (LU validou em audio em 17/06).
8. Marcas sem produto mostram empty state em vez de erro.

### Quando o usuario pede algo

- **Planeje primeiro:** liste o que vai mexer antes de mexer. Ele gosta
  disso e ja explicitou em prompts anteriores.
- **Reaproveite arquitetura:** nao reescreva se nao precisar.
- **Use config centralizada:** `navigation.ts`, `home-content.ts`,
  `contact.ts`. Evite hardcodar dados em componente.
- **Valide com `npm run build` no final.** O usuario espera que esteja
  verde antes de commitar.
- **Commita com mensagem em portugues** (sem acentos no titulo pra evitar
  encoding em terminal Windows).

### Quando tiver duvida estrategica

- Se eh sobre marca/branding: pergunte. LU eh sensivel a isso.
- Se eh sobre estrutura tecnica: decida e justifique.
- Se eh sobre credenciais/dinheiro: NAO execute, pergunte antes.

---

## 16. Contexto humano

- **Guilherme** (`lopesguilherme2912@gmail.com`) — owner tecnico, paga as
  contas, faz reunioes com a LU, executa migrations e configuracoes.
- **LU** — cliente final, dona da loja, valida UX. Reunioes sao
  geralmente em horario comercial. Comunica por audio no WhatsApp.
- A loja **ainda nao operou comercialmente** (em teste/sandbox). Quando for
  pra producao real, precisa rodar checklist da secao 13.

### Estilo de comunicacao do usuario

- Direto, sem rodeio.
- Prefere portugues, ate em commits.
- Aceita decisoes do Claude quando justificadas.
- Espera proatividade — se nota algo errado de passagem, conserta sem perguntar
  se for pequeno.
- Nao mistura assuntos: se pede X, foca em X.

---

## 17. Recursos externos

- **Supabase Dashboard:** https://supabase.com/dashboard/project/phkpwvdbmeotyqchybch
- **Vercel:** https://vercel.com/lopesguilherme2912-gmailcoms-projects/luperfumes
- **GitHub:** https://github.com/glp711/luclaude
- **Mercado Pago Devs:** https://www.mercadopago.com.br/developers/panel/app
- **Melhor Envio (sandbox):** https://sandbox.melhorenvio.com.br
- **Resend:** https://resend.com/api-keys
- **Instagram da loja:** https://www.instagram.com/perfumesdeambientedecor/

---

## 18. Glossario rapido

- **MP** = Mercado Pago
- **ME** = Melhor Envio
- **CDC** = Codigo de Defesa do Consumidor (lei brasileira)
- **LGPD** = Lei Geral de Protecao de Dados (lei brasileira)
- **mega menu** = painel grande que abre da nav superior com colunas
- **drawer** = painel lateral mobile
- **acordeao** = expansao com `details/summary` ou variantes de UI
- **slug** = identificador URL-safe (kebab-case)
- **bridge** = espaco invisivel entre dois elementos pra hover nao fechar
- **idempotente** = pode rodar varias vezes sem alterar resultado

---

Fim do handoff. Boa sorte 🌿
