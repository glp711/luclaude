# Setup das contas externas

Este guia te leva do zero até o `.env.local` preenchido. Tempo estimado: **40–50 minutos** no total.

> **Antes de começar:** tenha em mãos um e-mail (use `lopesguilherme2912@gmail.com` que já está nas regras), um telefone para receber SMS de verificação, e o terminal aberto neste repo.

---

## 1. Supabase (10 min)

### 1.1 Criar conta e projeto

1. Vá em https://supabase.com/dashboard/sign-up e crie a conta (sign in com GitHub é o mais rápido).
2. Clique em **New project**.
3. Preencha:
   - **Name:** `luperfumes`
   - **Database password:** gere uma forte e **salve no seu gerenciador de senhas**. Você precisará dela se for usar o CLI/conexão direta ao Postgres.
   - **Region:** **South America (São Paulo) — `sa-east-1`**.
   - **Pricing plan:** Free (por enquanto).
4. Aguarde ~2 minutos enquanto o projeto sobe.

### 1.2 Aplicar a migration

1. No sidebar do projeto, vá em **SQL Editor** → **New query**.
2. Abra `supabase/migrations/0001_init.sql` no repo e cole **todo o conteúdo** no editor.
3. Clique **Run** (Ctrl+Enter). Deve mostrar "Success. No rows returned."
4. Confira: sidebar → **Table Editor**. Você deve ver: `profiles`, `categories` (com 7 linhas seed), `products`, `product_images`, `addresses`, `orders`, `order_items`, `payments`, `shipments`, `webhook_events`.

### 1.3 Configurar Auth

1. Sidebar → **Authentication** → **Providers**.
2. Em **Email**:
   - Deixe ligado.
   - **Confirm email:** ligar (cliente precisa confirmar antes do primeiro login).
3. Em **URL Configuration** (mesma página):
   - **Site URL:** `http://localhost:3000` (mude para o domínio em produção depois).
   - **Redirect URLs:** adicione `http://localhost:3000/**` e `https://*.vercel.app/**`.

### 1.4 Pegar as credenciais

1. Sidebar → **Project Settings** → **API**.
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ **service_role** dá acesso total ao banco. NUNCA cole no frontend, NUNCA commitar.

### 1.5 Criar sua conta de admin

1. Rode o projeto local depois de preencher `.env.local`:
   ```bash
   npm run dev
   ```
2. Vá em `http://localhost:3000/login`, registre com `lopesguilherme2912@gmail.com`.
3. Confirme o e-mail (link no inbox).
4. Volte ao **SQL Editor** do Supabase e rode:
   ```sql
   update public.profiles
      set role = 'admin'
    where id = (select id from auth.users where email = 'lopesguilherme2912@gmail.com');
   ```
5. Faça logout/login. Agora `/admin` abre.

---

## 2. Mercado Pago (15 min)

### 2.1 Conta

1. https://www.mercadopago.com.br/registration → criar conta como **vendedor**.
2. Verifique CPF e e-mail.

### 2.2 Criar aplicação

1. Vá em https://www.mercadopago.com.br/developers/panel/app → **Criar aplicação**.
2. Preencha:
   - **Nome:** `Luperfumes`
   - **Modelo de integração:** "CheckoutPro / Checkout Bricks / Checkout Transparente" — escolha **Checkout Pro** (é o mais simples e atende ao MVP).
   - **Produtos que vende:** físicos.
3. Salve.

### 2.3 Pegar credenciais de teste (sandbox)

1. Dentro da aplicação criada, sidebar esquerda → **Credenciais**.
2. Aba **Credenciais de teste**:
   - **Access Token** (começa com `TEST-`) → `MP_ACCESS_TOKEN`.
3. Aba **Webhook** ou **Notificações**:
   - **URL:** `https://SEU-DOMINIO/api/webhooks/mercadopago` (em dev você não precisa ainda — use ngrok ou pule até deploy).
   - **Eventos:** marque `Pagamentos`.
   - **Chave secreta** que aparece após salvar → `MP_WEBHOOK_SECRET`.

### 2.4 Cartões de teste

Para testar o checkout em sandbox, use:
- **Aprovado:** `5031 4332 1540 6351` — CVV `123` — qualquer data futura — nome `APRO`.
- **Recusado:** mesmo cartão com nome `OTHE`.
- Pix: aparece QR Code de teste que aprova após ~30s sem cobrar.

> Doc oficial: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/integration-test/integration

---

## 3. Melhor Envio sandbox (15 min)

### 3.1 Conta sandbox

1. https://sandbox.melhorenvio.com.br/cadastro → crie conta de **vendedor**.
2. Confirme e-mail.
3. Login.

### 3.2 Criar aplicação OAuth

1. No painel → **Configurações** → **Tokens**.
2. **Criar token de aplicação** (ou "Gerar token").
3. Permissões mínimas:
   - `shipping-calculate`
   - `shipping-cart`
   - `shipping-checkout`
   - `shipping-companies`
   - `shipping-services`
   - `shipping-tracking`
   - `shipping-print`
   - `cart-write`, `cart-read`
4. Copie o **token** → `MELHORENVIO_TOKEN`.
5. `MELHORENVIO_BASE_URL` em dev = `https://sandbox.melhorenvio.com.br`.

### 3.3 Adicionar saldo de teste

Em sandbox, o saldo é "fake" — você pode adicionar quanto quiser pela UI em **Carteira** → **Adicionar crédito**. Em produção, você precisa fazer transferência via PIX/boleto.

> Doc: https://docs.melhorenvio.com.br/reference/criar-um-token-de-aplicacao

---

## 4. Resend (5 min)

### 4.1 Conta

1. https://resend.com/signup → conta com Google/GitHub.
2. Plano Free dá 100 e-mails/dia e 3.000/mês — suficiente para MVP.

### 4.2 API Key

1. Sidebar → **API Keys** → **Create API Key**.
2. **Name:** `luperfumes-prod` (ou `luperfumes-dev`).
3. **Permission:** `Sending access`.
4. Copie → `RESEND_API_KEY`.

### 4.3 Domínio (pode pular em dev)

- Em dev: você pode mandar do remetente `onboarding@resend.dev` — não precisa configurar nada.
- Em produção: sidebar → **Domains** → adicionar seu domínio (`luperfumes.com.br` quando comprar) → configurar SPF + DKIM no DNS conforme as instruções da tela.

---

## 5. Preencher `.env.local`

No repo:

```bash
cp .env.example .env.local
```

Edite `.env.local` colando os valores que você copiou:

```env
NEXT_PUBLIC_SUPABASE_URL="https://abc123.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

SUPABASE_SERVICE_ROLE_KEY="eyJ..."

MP_ACCESS_TOKEN="TEST-..."
MP_WEBHOOK_SECRET="..."

MELHORENVIO_TOKEN="..."
MELHORENVIO_BASE_URL="https://sandbox.melhorenvio.com.br"

STORE_ORIGIN_CEP="01310100"          # troque depois pelo CEP real
STORE_FALLBACK_SHIPPING_CENTS="2500"
STORE_FREE_SHIPPING_THRESHOLD_CENTS="25000"

RESEND_API_KEY="re_..."
ADMIN_NOTIFICATION_EMAIL="lopesguilherme2912@gmail.com"
```

Salvar. **Nunca commitar este arquivo** — já está no `.gitignore`.

---

## 6. Importar os 243 produtos

Depois do `.env.local` pronto:

```bash
npm run import:products
```

O script lê o xlsx em `C:\Users\admme\Documents\Codex\2026-06-08\https-danifernandes-com-br-todos-os\outputs\produtos_dani_fernandes_243.xlsx`, categoriza por palavra-chave (difusor → "difusores", sabonete → "sabonetes", etc.) e faz upsert na tabela `products` como **draft**.

### 6.1 Publicar tudo de uma vez (cuidado — leia primeiro)

Como os produtos entram como `draft` sem peso/dimensão (e nossa regra `RULES.md §3.2` exige isso para publicar), a UI da loja vai aparecer vazia. Para testar a loja rapidamente sem revisar 243 produtos um a um, rode no SQL Editor:

```sql
update public.products
   set status         = 'active',
       stock_quantity = 100,
       weight_g       = 300,
       width_cm       = 10,
       height_cm      = 20,
       length_cm      = 10
 where status = 'draft';
```

> Isso usa dimensões/peso médios e estoque arbitrário. Antes de ir pra produção, revise produto por produto no admin.

---

## 7. Rodar local

```bash
npm run dev
```

Abra http://localhost:3000:
- `/` — home placeholder
- `/produtos` — catálogo (vazio até importar)
- `/login` — entrar
- `/admin` — só abre depois de promover seu usuário a admin (§1.5)

---

## 8. Próximos passos (deploy)

Quando estiver pronto para produção:

1. **Comprar domínio** (Registro.br para `.com.br` — ~R$ 40/ano).
2. **Vercel:** importar o repo, conectar GitHub, adicionar mesmas env vars na dashboard (Settings → Environment Variables).
3. **Trocar Mercado Pago para produção:** aba "Credenciais de produção" → trocar `MP_ACCESS_TOKEN`. Exige CNPJ + dados bancários.
4. **Trocar Melhor Envio para produção:** criar app em https://melhorenvio.com.br (sem `sandbox.`). Trocar `MELHORENVIO_TOKEN` e `MELHORENVIO_BASE_URL=https://melhorenvio.com.br`.
5. **Verificar domínio no Resend** e trocar remetente de `onboarding@resend.dev` para `noreply@seudominio.com.br`.
6. **Atualizar webhook URL no Mercado Pago** para `https://seudominio.com.br/api/webhooks/mercadopago` e regerar `MP_WEBHOOK_SECRET`.
7. **Atualizar Site URL e Redirect URLs no Supabase** para o domínio real.
