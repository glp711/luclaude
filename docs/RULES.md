# Luperfumes — Regras de Negócio

> Documento de regras que governam o e-commerce. **Toda decisão de implementação deve referenciar este documento.** Alterações aqui exigem aprovação explícita antes de virarem código.
>
> Versão: 1.0 — 2026-06-08

---

## 1. Glossário rápido

| Termo | Definição |
|---|---|
| **Visitante** | Usuário sem login. Pode navegar e comprar como convidado. |
| **Cliente** | Usuário com conta (registro em Supabase Auth). |
| **Admin** | Usuário com `profiles.role = 'admin'`. |
| **Pedido** | Registro em `orders`. Identificado externamente por `order_number` (`#1042`). |
| **Snapshot** | Cópia imutável de dados no momento do pedido (preço, nome, endereço). Não muda nunca. |
| **Gateway** | Mercado Pago. |
| **Transportadora** | Melhor Envio (que opera Correios/Jadlog/etc.). |

---

## 2. Roles e permissões

### 2.1 Visitante (não autenticado)
- ✅ Ver catálogo (produtos `status='active'`).
- ✅ Buscar, filtrar por categoria, ver detalhe de produto.
- ✅ Montar carrinho (armazenado em `localStorage`).
- ✅ Fazer checkout como convidado (obrigatório informar e-mail + CPF + endereço).
- ✅ Acompanhar pedido via link mágico enviado por e-mail (token de acesso).
- ❌ Não tem "Meus Pedidos" persistente. Recupera só pelo link.

### 2.2 Cliente (autenticado)
- ✅ Tudo do visitante.
- ✅ Página "Meus Pedidos" lista histórico próprio.
- ✅ Cadastrar múltiplos endereços, definir padrão.
- ✅ Reaproveitar dados no checkout.
- ❌ Não pode ler dados de outros clientes (RLS).
- ❌ Não pode alterar pedidos pagos. Pode pedir cancelamento, admin executa.

### 2.3 Admin
- ✅ CRUD em produtos, categorias, imagens.
- ✅ Ver todos os pedidos, alterar status manualmente, registrar tracking manualmente se preciso.
- ✅ Ver dados de clientes (nome, e-mail, pedidos).
- ✅ Reembolsar pedido (manual via painel Mercado Pago + atualização de status).
- ❌ Não pode ver senha de cliente (não existe no banco — Auth gerencia).
- ❌ Não pode ver dados completos de cartão (gateway não retorna).

### 2.4 Promoção a admin
- Manual: alterar `profiles.role` direto no Supabase pelo dono do projeto.
- Nunca há fluxo público de "virar admin".

---

## 3. Catálogo de produtos

### 3.1 Estados
| Status | Visível na loja? | Comprável? |
|---|---|---|
| `active` | Sim | Sim, se `stock_quantity > 0` |
| `draft` | Não | Não |
| `archived` | Não | Não (mantém integridade em pedidos antigos) |

### 3.2 Campos obrigatórios para publicar (`active`)
- `name`, `slug` (gerado de name, único), `price_cents > 0`, `description`, ao menos 1 `product_image`, `weight_g > 0`, e ao menos uma dimensão (para cálculo de frete).
- Validação no servidor antes de virar `active`. Sem isso, retorna 422.

### 3.3 Slug
- Gerado de `name` (lowercase, sem acento, hífen). Editável manualmente.
- Mudança de slug **não invalida URLs antigas**: adicionar redirect 301 (futuro — V2).

### 3.4 Preço
- Sempre em centavos no banco. Formatação `R$ 176,90` é só na UI.
- `compare_at_price_cents` opcional: se preenchido e maior que `price_cents`, exibe como "De / Por".
- Mudança de preço NÃO afeta pedidos já feitos (snapshot).

### 3.5 Estoque
- `stock_quantity` é decrementado **na confirmação do pagamento** (webhook `paid`), não na criação do pedido.
- Razão: pedido `pending` pode nunca ser pago (abandonos). Decrementar antes geraria estoque fantasma.
- Risco aceitável: overbooking se 2 clientes pagarem o último item simultaneamente. Mitigação: lock pessimista no decremento (`SELECT ... FOR UPDATE` em transação).
- Quando admin edita estoque manualmente, gravar `inventory_adjustments` (V2, log de auditoria — não no schema inicial).
- Cancelamento/reembolso de pedido pago: **devolve** ao estoque automaticamente.

### 3.6 Imagens
- Armazenadas em **Supabase Storage**, bucket `product-images` público.
- Convenção de nome: `{product_id}/{position}-{uuid}.{ext}`.
- Limite: 10 imagens por produto, máx 5MB cada, formatos `jpg/png/webp`.
- Primeira imagem (`position=0`) é a capa.

### 3.7 Categorias
- Hierarquia opcional (`parent_id`). MVP usa flat.
- Slug único. Categoria com produtos não pode ser deletada (cascade `set null`).

---

## 4. Carrinho

### 4.1 Persistência
- **Visitante:** `localStorage` (`luperfumes_cart_v1`), apenas `[{product_id, quantity}]`.
- **Cliente logado:** mesma chave; futura migração para tabela `carts` se múltiplos dispositivos virarem requisito (V2).
- Preço e disponibilidade são **revalidados no servidor** em todo cálculo de checkout. Cliente não dita preço.

### 4.2 Regras
- Quantidade mínima por item: 1. Máxima: 10 (anti-abuso).
- Carrinho com item de produto que mudou para `draft`/`archived` ou ficou sem estoque: item é **removido silenciosamente na próxima abertura** com aviso "Item X não está mais disponível".
- Carrinho não tem expiração no MVP. Pode ficar lá indefinidamente.

### 4.3 Cálculo
- Subtotal = soma de `unit_price * qty` (preços atuais do banco).
- Frete só é calculado após informar CEP no checkout.
- Total = subtotal + frete - desconto (cupom — V2).

---

## 5. Checkout

### 5.1 Fluxo
1. **Identificação** — escolher "Continuar como convidado" ou "Entrar".
2. **Endereço** — CEP, ViaCEP auto-preenche, restante manual.
3. **Frete** — cálculo Melhor Envio: lista opções (PAC, SEDEX, Jadlog), cliente escolhe.
4. **Pagamento** — Pix (default), cartão de crédito, boleto.
5. **Revisão** — totais, condições.
6. **Confirmação** — cria `order` em `pending`, chama gateway, redireciona/exibe instruções.

### 5.2 Dados obrigatórios — convidado
- Nome completo, e-mail, CPF, telefone, endereço completo de entrega.
- Sem senha. E-mail é a chave de identificação.

### 5.3 Dados obrigatórios — cliente
- Os mesmos, mas pré-preenchidos do perfil/endereços salvos.

### 5.4 Validação
- CPF: validação de dígito verificador no front + servidor.
- CEP: ViaCEP. Se ViaCEP off-line, aceita manual.
- E-mail: regex simples + DNS MX check no servidor (V2).
- Telefone: aceita formato BR `(XX) XXXXX-XXXX`.

### 5.5 Criação do pedido
- Tudo dentro de uma transação no servidor:
  1. Revalida preços e estoque (sem decrementar).
  2. Calcula frete (chama Melhor Envio cotação).
  3. Cria `order` com status `pending`, snapshot completo do endereço.
  4. Cria `order_items` com `product_snapshot`.
  5. Cria `preference` no Mercado Pago.
  6. Salva `mp_preference_id` na order.
  7. Gera `guest_access_token` (uuid v4) se convidado — salvar em `orders.guest_access_token`.
  8. Envia e-mail "Recebemos seu pedido #1042" com link de acompanhamento.
- Se qualquer passo falhar, rollback completo. Cliente vê erro genérico.

### 5.6 Acesso ao pedido por convidado
- URL: `/pedidos/{order_id}?t={guest_access_token}`.
- Token tem 36 chars (uuid). Sem fluxo de logout — é shareable, mas só vai pro e-mail dele.
- Cliente autenticado acessa pelo dono (`auth.uid()`), token não necessário.

---

## 6. Pagamento (Mercado Pago)

### 6.1 Métodos aceitos no MVP
- **Pix** (default, melhor margem).
- **Cartão de crédito** (à vista; parcelamento V2).
- **Boleto** (com aviso de prazo de compensação).

### 6.2 Estados do pagamento (mapa MP → nosso)
| MP status | Nosso `orders.status` |
|---|---|
| `pending`, `in_process` | `pending` |
| `approved` | `paid` |
| `rejected`, `cancelled` | `canceled` |
| `refunded`, `charged_back` | `refunded` |

### 6.3 Webhook
- Endpoint: `POST /api/webhooks/mercadopago`.
- **Validação obrigatória** da assinatura `x-signature` (HMAC SHA256 do MP). Sem assinatura válida → 401. Sem isso, qualquer um marca pedido como pago.
- Idempotência: usar `webhook_events.unique(source, event_id)`. Se já existe, retornar 200 sem reprocessar.
- Fluxo no recebimento:
  1. Validar assinatura.
  2. Inserir em `webhook_events` (falha de unique = duplicado, retorna 200).
  3. Buscar pagamento na API do MP por `payment_id` (não confiar no payload — pode ser forjado).
  4. Atualizar `payments` + `orders.status` conforme tabela 6.2.
  5. Se aprovou: decrementar estoque, disparar geração de etiqueta (Melhor Envio), enviar e-mail "Pagamento aprovado".
  6. Marcar `webhook_events.processed_at`.
- Timeout do handler: 10s. Trabalho pesado (etiqueta, e-mail) vai pra fila/Edge Function async (V2). MVP faz inline.

### 6.4 Reembolso
- Manual: admin faz reembolso no painel MP, depois atualiza status no painel da loja para `refunded`.
- Devolução automática ao estoque dos itens.
- V2: botão "Reembolsar" no admin que chama API do MP.

### 6.5 Boleto vencido
- Cron diário (V2) marca pedidos com boleto vencido como `canceled`. MVP: manual via admin.

---

## 7. Frete e rastreio (Melhor Envio)

### 7.1 Cotação
- Chamada server-side para `/me/shipment/calculate` com peso/dimensões/CEP origem/CEP destino.
- CEP de origem: configurável em env var `STORE_ORIGIN_CEP`.
- Retorna opções (PAC, SEDEX, Jadlog .Package, etc.). Cliente escolhe.
- Erro/timeout do Melhor Envio: oferecer **frete fixo de fallback** (`STORE_FALLBACK_SHIPPING_CENTS`, default R$ 25,00) para não bloquear venda.

### 7.2 Geração de etiqueta
- Disparada após pagamento aprovado (webhook).
- Fluxo:
  1. Adicionar pedido ao carrinho Melhor Envio (`/me/cart`).
  2. Realizar checkout (`/me/shipment/checkout`).
  3. Pagar etiqueta (saldo Melhor Envio — admin precisa manter recarregado).
  4. Gerar etiqueta (`/me/shipment/generate`).
  5. Imprimir / obter PDF (`/me/shipment/print`).
- Resultado salvo em `shipments` + `orders.tracking_code` + `orders.tracking_carrier`.
- Falha: pedido fica `paid` com `tracking_code IS NULL`. Admin é notificado por e-mail. Pode gerar manualmente.

### 7.3 Acompanhamento
- Cliente vê `tracking_code` em `/pedidos/{id}`.
- Link direto: depende da transportadora. Tabela de URLs (`correios`, `jadlog`).
- Webhook do Melhor Envio (eventos de rastreio) — V2.

### 7.4 Política comercial (sugestão, validar)
- **Frete grátis acima de R$ 250,00?** (sugestão — confirme).
- **Prazo:** o que o Melhor Envio informar. Não prometer prazo menor.
- **Áreas atendidas:** todo Brasil. Sem entrega internacional.

---

## 8. Máquina de estados do pedido

```
            ┌──────────┐
            │ pending  │ ← criado no checkout
            └────┬─────┘
                 │ webhook MP aprovou
                 ▼
            ┌──────────┐
   ┌────────│   paid   │
   │        └────┬─────┘
   │             │ admin marca / cron
   │             ▼
   │        ┌───────────┐
   │        │ preparing │
   │        └────┬──────┘
   │             │ etiqueta gerada + objeto postado
   │             ▼
   │        ┌──────────┐
   │        │ shipped  │
   │        └────┬─────┘
   │             │ Melhor Envio confirma entrega (V2) ou admin marca
   │             ▼
   │        ┌────────────┐
   │        │ delivered  │  (terminal)
   │        └────────────┘
   │
   │   webhook MP rejeitou /
   │   admin cancela / boleto venceu
   │             ▼
   │        ┌──────────┐
   ├────────│ canceled │  (terminal)
   │        └──────────┘
   │
   │   reembolso pós-paid
   │             ▼
   │        ┌──────────┐
   └────────│ refunded │  (terminal)
            └──────────┘
```

### 8.1 Transições válidas
- `pending → paid` — só via webhook MP.
- `pending → canceled` — webhook MP rejeitou / boleto venceu / admin cancela.
- `paid → preparing` — admin ou automático após etiqueta gerada.
- `preparing → shipped` — admin marca / Melhor Envio confirma postagem.
- `shipped → delivered` — admin marca / Melhor Envio confirma entrega.
- `paid → refunded` — reembolso admin.
- `paid → canceled` — admin cancela e reembolsa.

### 8.2 Efeitos colaterais
- Entrar em `paid`: decrementar estoque, gerar etiqueta, e-mail cliente.
- Entrar em `shipped`: e-mail cliente com tracking_code.
- Entrar em `delivered`: e-mail "Avalie sua compra" (V2).
- Entrar em `canceled` ou `refunded` vindo de `paid`: devolver estoque.

### 8.3 O que pedido `paid` ou posterior **não** permite
- Alterar itens, endereço, total, preço.
- Deletar (apenas cancelar).

---

## 9. Conta do cliente

### 9.1 Cadastro
- E-mail + senha (mínimo 8 chars, 1 letra, 1 número).
- Magic link via e-mail também aceito.
- Google Sign-In (V2).
- Confirmação de e-mail **obrigatória** antes do primeiro login.

### 9.2 Recuperação de senha
- Link via e-mail (Supabase Auth nativo).
- Token expira em 1h.

### 9.3 Dados que o cliente edita
- Nome, telefone (CPF não — fixo após primeiro uso).
- Endereços (CRUD).
- Senha.

### 9.4 Encerramento de conta (LGPD)
- Cliente solicita por e-mail (MVP) → admin executa.
- V2: botão "Excluir conta" → soft-delete: anonimizar `profiles` (nome → "Cliente removido", phone null) mas **manter** `orders` para obrigações fiscais. CPF mascarado.

---

## 10. Admin

### 10.1 Acesso
- Rota `/admin` protegida por middleware: `auth.uid()` válido + `profiles.role = 'admin'`.
- Sem isso, 404 (não 403, para não revelar a existência).

### 10.2 Funcionalidades MVP
- **Dashboard:** vendas do mês, pedidos `pending` + `paid` (a despachar), produtos sem estoque.
- **Produtos:** lista, criar, editar, arquivar, upload de imagens.
- **Categorias:** CRUD.
- **Pedidos:** lista filtrável (status, data, cliente), detalhe com timeline, ação "Marcar como enviado", "Marcar como entregue", "Cancelar".
- **Clientes:** lista, ver pedidos do cliente.

### 10.3 Auditoria (V2)
- `audit_log(actor_id, action, entity, entity_id, diff, created_at)` para toda ação de admin.

### 10.4 Quem pode ser admin
- Decidido pelo dono do projeto. Sem onboarding self-service.

---

## 11. Segurança

### 11.1 Camadas
| Dado | Onde vive | Quem acessa |
|---|---|---|
| `anon key` Supabase | Frontend (público) | Browser. Só lê dados públicos protegidos por RLS. |
| `service_role` Supabase | Env do servidor (Vercel) | Apenas API routes do backend. Bypassa RLS. |
| `MP_ACCESS_TOKEN` | Env do servidor | API routes e webhook. |
| `MP_WEBHOOK_SECRET` | Env do servidor | Validação de assinatura. |
| `MELHORENVIO_TOKEN` | Env do servidor | API routes que falam com Melhor Envio. |

**Nenhum `NEXT_PUBLIC_*` carrega secret de gateway, service_role, ou token de transportadora.**

### 11.2 Validações server-side obrigatórias
- Preço dos itens (não confiar no carrinho).
- Estoque.
- CPF.
- Assinatura de webhook.
- `role = 'admin'` antes de qualquer ação de admin (não confiar em UI).

### 11.3 Rate limiting (V2)
- Login: 5 tentativas/min/IP.
- Checkout: 3 criações de pedido/min/IP.
- Webhook: sem limit (vem do MP).

### 11.4 HTTPS
- Obrigatório. Vercel já entrega. Webhook MP recusa http.

### 11.5 CORS
- API routes próprias: same-origin (frontend e backend no mesmo deploy Vercel).
- Webhooks: aceitam qualquer origem (Mercado Pago/Melhor Envio).

---

## 12. LGPD

### 12.1 Dados pessoais coletados
- Nome, e-mail, CPF, telefone, endereço de entrega.
- Histórico de pedidos.
- Dados de pagamento — **não armazenamos cartão**; só ID de pagamento do MP.

### 12.2 Finalidades (a declarar na política de privacidade)
- Processar pedido, gerar nota fiscal, enviar produto, comunicar status.
- Marketing: opt-in explícito separado (V2).

### 12.3 Retenção
- Pedidos: 5 anos (obrigação fiscal — Receita Federal).
- Dados de marketing: até revogação.
- Conta sem pedidos: 2 anos sem login → e-mail de aviso → exclusão.

### 12.4 Direitos do titular
- Acesso, correção, exclusão, portabilidade — atendidos por contato com admin via `contato@luperfumes...` (a definir).
- Prazo: 15 dias.

### 12.5 Cookies
- Banner de consentimento. Categorias: estritamente necessários (sempre), analytics (opt-in).

---

## 13. E-mails transacionais

### 13.1 Eventos que disparam e-mail
| Evento | Para | Conteúdo |
|---|---|---|
| Cadastro | Cliente | Confirmação de e-mail |
| Recuperação senha | Cliente | Link de redefinição |
| Pedido criado | Cliente + guest | Resumo + link de acompanhamento (com token se guest) |
| Pagamento aprovado | Cliente | Confirmação + previsão de envio |
| Pedido enviado | Cliente | `tracking_code` + link transportadora |
| Pedido entregue | Cliente | (V2) avaliação |
| Pedido cancelado | Cliente | Motivo |
| Reembolso | Cliente | Confirmação |
| Estoque baixo (`stock_quantity <= 3`) | Admin | (V2) |
| Falha de geração de etiqueta | Admin | Pedido + erro |

### 13.2 Provedor
- MVP: **Resend** (boa DX, free tier 100/dia). Alternativa: Supabase SMTP nativo (Auth) + SendGrid para transacionais.
- Domínio: `noreply@<dominio-luperfumes>`. Configurar SPF + DKIM.

---

## 14. Operacional

### 14.1 Logs
- Vercel logs: 7 dias.
- Erros de webhook: gravar em `webhook_events.processing_error`.
- Erros 5xx críticos: integrar Sentry (V2).

### 14.2 Backup
- Supabase faz backup diário (plano free: 7 dias).

### 14.3 Ambientes
- `production` (Vercel prod + Supabase prod).
- `preview` (Vercel preview + Supabase mesmo banco — usar `mp` sandbox).
- `local` (Next dev + Supabase local via CLI ou projeto separado de dev).

### 14.4 Configuração / env vars
```
# Public (frontend)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://luperfumes...

# Server-only (NUNCA usar NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=
MP_ACCESS_TOKEN=
MP_WEBHOOK_SECRET=
MELHORENVIO_TOKEN=
MELHORENVIO_BASE_URL=https://sandbox.melhorenvio.com.br  # sandbox em dev
STORE_ORIGIN_CEP=
STORE_FALLBACK_SHIPPING_CENTS=2500
RESEND_API_KEY=
ADMIN_NOTIFICATION_EMAIL=
```

---

## 15. Roadmap pós-MVP (V2+)

- Cupons de desconto.
- Variantes de produto (tamanho/aroma) com estoque por variante.
- Reembolso automatizado via API do MP.
- Avaliações de produto.
- Wishlist.
- Newsletter integrada.
- Webhook do Melhor Envio para atualização automática de status.
- Audit log de admin.
- Reset de boleto vencido por cron.
- Cron de abandono de carrinho (e-mail "Você esqueceu algo").
- Múltiplos endereços de retirada / loja física.

---

## 16. Definição de pronto (MVP)

O MVP está pronto quando:

- [ ] Catálogo navegável com 243 produtos importados.
- [ ] Carrinho funciona (add/remove/update).
- [ ] Checkout convidado e logado finaliza com **Pix sandbox** aprovado.
- [ ] Webhook MP atualiza pedido para `paid` e decrementa estoque.
- [ ] Etiqueta é gerada no Melhor Envio sandbox e `tracking_code` aparece no detalhe do pedido.
- [ ] Cliente recebe e-mail em cada transição.
- [ ] Admin loga, edita produto, vê pedidos, marca como enviado.
- [ ] Deploy Vercel + Supabase + Resend funcionando.
- [ ] Lighthouse mobile > 80 na home e detalhe.
- [ ] Sem chave sensível no bundle do frontend (auditado).

---

## 17. Decisões aplicadas (2026-06-08, provisórias — usuário pode rever)

| # | Decisão | Status |
|---|---|---|
| 1 | **Frete grátis acima de R$ 250,00.** Configurável em `STORE_FREE_SHIPPING_THRESHOLD_CENTS=25000`. | ✅ default |
| 2 | **CEP de origem:** placeholder `01310-100` (Av Paulista, SP). Trocar antes de produção. | ⚠️ TODO antes de prod |
| 3 | **Domínio:** placeholder `luperfumes.com.br`. Confirmar e comprar antes do deploy. | ⚠️ TODO antes de prod |
| 4 | **CNPJ:** não necessário em sandbox. Necessário pra produção (MP + Melhor Envio + emissão de NF). | ⚠️ TODO antes de prod |
| 5 | **Política de troca/devolução:** 7 dias corridos a partir do recebimento (CDC art. 49 — direito de arrependimento). Texto completo na seção 18. | ✅ default |
| 6 | **Frete fallback:** R$ 25,00 (`STORE_FALLBACK_SHIPPING_CENTS=2500`). | ✅ default |
| 7 | **Admin inicial:** `lopesguilherme2912@gmail.com` → recebe `role='admin'` após primeiro cadastro. | ✅ confirmado |
| 8 | **Categorias seed:** Difusores, Home Spray, Sabonetes, Água Perfumada, Cremes, Kits, Acessórios. | ✅ confirmado |
| 9 | **Parcelamento no cartão:** V2. MVP só à vista. | ✅ default |
| 10 | **Checkout de convidado:** habilitado conforme seção 5. | ✅ confirmado |

## 18. Política de troca e devolução (padrão CDC)

- **Arrependimento (CDC art. 49):** 7 dias corridos a partir do recebimento. Cliente solicita por e-mail. Reembolso integral (produto + frete original). Frete de retorno por conta da loja.
- **Defeito:** 30 dias (não-durável) / 90 dias (durável). Troca ou reembolso à escolha do cliente. Frete de retorno por conta da loja.
- **Produto correto sem defeito (gosto pessoal pós-7 dias):** sem direito a devolução.
- **Estado do produto na devolução:** lacrado, sem uso, embalagem original.

> Esta política vai no rodapé do site e na confirmação do pedido por e-mail.
