-- =============================================================================
-- Luperfumes — schema inicial
-- Convenções:
--   * snake_case
--   * id uuid (gen_random_uuid())
--   * timestamptz default now()
--   * dinheiro em centavos (int) — nunca float
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) profiles (estende auth.users)
-- -----------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  role        text not null default 'customer' check (role in ('customer','admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Helper para policies sem recursão RLS
create or replace function public.is_admin()
returns boolean
language sql security definer stable
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

-- Cria profile automaticamente quando um auth.users é criado
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 2) categories
-- -----------------------------------------------------------------------------
create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name       text not null,
  parent_id  uuid references public.categories(id) on delete set null,
  position   int  not null default 0,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 3) products
-- -----------------------------------------------------------------------------
create table public.products (
  id                     uuid primary key default gen_random_uuid(),
  slug                   text not null unique,
  name                   text not null,
  description            text,
  price_cents            int  not null check (price_cents >= 0),
  compare_at_price_cents int  check (compare_at_price_cents >= 0),
  sku                    text unique,
  stock_quantity         int  not null default 0 check (stock_quantity >= 0),
  weight_g               int,
  width_cm               numeric(6,2),
  height_cm              numeric(6,2),
  length_cm              numeric(6,2),
  status                 text not null default 'active'
                         check (status in ('active','draft','archived')),
  category_id            uuid references public.categories(id) on delete set null,
  source_url             text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create index products_status_idx   on public.products(status);
create index products_category_idx on public.products(category_id);

-- -----------------------------------------------------------------------------
-- 4) product_images
-- -----------------------------------------------------------------------------
create table public.product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url        text not null,
  alt        text,
  position   int  not null default 0
);
create index product_images_product_idx on public.product_images(product_id);

-- -----------------------------------------------------------------------------
-- 5) addresses
-- -----------------------------------------------------------------------------
create table public.addresses (
  id             uuid primary key default gen_random_uuid(),
  customer_id    uuid not null references public.profiles(id) on delete cascade,
  label          text,
  recipient_name text not null,
  postal_code    text not null,
  street         text not null,
  number         text not null,
  complement     text,
  neighborhood   text not null,
  city           text not null,
  state          text not null check (length(state) = 2),
  is_default     boolean not null default false,
  created_at     timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 6) orders
-- -----------------------------------------------------------------------------
create table public.orders (
  id                 uuid primary key default gen_random_uuid(),
  order_number       bigserial unique,
  customer_id        uuid references public.profiles(id) on delete set null,
  guest_email        text,

  status             text not null default 'pending'
                     check (status in ('pending','paid','preparing','shipped','delivered','canceled','refunded')),

  subtotal_cents     int not null check (subtotal_cents >= 0),
  shipping_cents     int not null default 0 check (shipping_cents >= 0),
  discount_cents     int not null default 0 check (discount_cents >= 0),
  total_cents        int not null check (total_cents >= 0),

  -- snapshot imutável do endereço no momento da compra
  shipping_address   jsonb not null,
  shipping_service   text,

  -- pagamento (Mercado Pago)
  payment_method     text,
  mp_preference_id   text,
  mp_payment_id      text,
  paid_at            timestamptz,

  -- envio (Melhor Envio)
  tracking_code      text,
  tracking_carrier   text,
  shipped_at         timestamptz,
  delivered_at       timestamptz,

  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index orders_customer_idx   on public.orders(customer_id);
create index orders_status_idx     on public.orders(status);
create index orders_mp_payment_idx on public.orders(mp_payment_id);

-- -----------------------------------------------------------------------------
-- 7) order_items
-- -----------------------------------------------------------------------------
create table public.order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.orders(id) on delete cascade,
  product_id       uuid references public.products(id) on delete set null,
  product_snapshot jsonb not null,
  quantity         int  not null check (quantity > 0),
  unit_price_cents int  not null check (unit_price_cents >= 0),
  total_cents      int  generated always as (quantity * unit_price_cents) stored
);
create index order_items_order_idx on public.order_items(order_id);

-- -----------------------------------------------------------------------------
-- 8) payments (log do gateway)
-- -----------------------------------------------------------------------------
create table public.payments (
  id                 uuid primary key default gen_random_uuid(),
  order_id           uuid not null references public.orders(id) on delete cascade,
  gateway            text not null default 'mercadopago',
  gateway_payment_id text,
  status             text not null,
  amount_cents       int  not null,
  raw_payload        jsonb,
  created_at         timestamptz not null default now()
);
create index payments_order_idx on public.payments(order_id);

-- -----------------------------------------------------------------------------
-- 9) shipments (log de etiquetas)
-- -----------------------------------------------------------------------------
create table public.shipments (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders(id) on delete cascade,
  provider          text not null default 'melhorenvio',
  provider_order_id text,
  service           text,
  tracking_code     text,
  label_url         text,
  status            text,
  posted_at         timestamptz,
  raw_payload       jsonb,
  created_at        timestamptz not null default now()
);
create index shipments_order_idx on public.shipments(order_id);

-- -----------------------------------------------------------------------------
-- 10) webhook_events (idempotência)
-- -----------------------------------------------------------------------------
create table public.webhook_events (
  id               uuid primary key default gen_random_uuid(),
  source           text not null,           -- 'mercadopago' | 'melhorenvio'
  event_id         text not null,           -- id no provider, usado para dedup
  payload          jsonb not null,
  processed_at     timestamptz,
  processing_error text,
  received_at      timestamptz not null default now(),
  unique (source, event_id)
);

-- =============================================================================
-- Trigger genérico de updated_at
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger products_updated before update on public.products
  for each row execute function public.set_updated_at();
create trigger orders_updated   before update on public.orders
  for each row execute function public.set_updated_at();

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table public.profiles       enable row level security;
alter table public.categories     enable row level security;
alter table public.products       enable row level security;
alter table public.product_images enable row level security;
alter table public.addresses      enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;
alter table public.payments       enable row level security;
alter table public.shipments      enable row level security;
alter table public.webhook_events enable row level security;

-- profiles: dono lê/edita o próprio; admin tudo
create policy profiles_self_read    on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy profiles_self_update  on public.profiles for update using (auth.uid() = id);
create policy profiles_admin_all    on public.profiles for all    using (public.is_admin());

-- categories: leitura pública; escrita admin
create policy categories_public_read on public.categories for select using (true);
create policy categories_admin_write on public.categories for all    using (public.is_admin());

-- products: público lê só status='active'; admin tudo
create policy products_public_read on public.products for select using (status = 'active' or public.is_admin());
create policy products_admin_write on public.products for all    using (public.is_admin());

-- product_images: segue o produto
create policy product_images_public_read on public.product_images for select
  using (exists (
    select 1 from public.products p
    where p.id = product_id and (p.status = 'active' or public.is_admin())
  ));
create policy product_images_admin_write on public.product_images for all using (public.is_admin());

-- addresses: dono CRUD; admin lê
create policy addresses_owner_all  on public.addresses for all    using (auth.uid() = customer_id);
create policy addresses_admin_read on public.addresses for select using (public.is_admin());

-- orders: dono lê os próprios; admin tudo. INSERT/UPDATE apenas via service_role (API).
create policy orders_owner_read on public.orders for select
  using (auth.uid() = customer_id or public.is_admin());

create policy order_items_owner_read on public.order_items for select
  using (exists (
    select 1 from public.orders o
    where o.id = order_id and (o.customer_id = auth.uid() or public.is_admin())
  ));

-- payments / shipments: só admin lê (cliente vê tracking_code pela order)
create policy payments_admin_read  on public.payments  for select using (public.is_admin());
create policy shipments_admin_read on public.shipments for select using (public.is_admin());

-- webhook_events: sem policy permissiva → só service_role acessa

-- =============================================================================
-- Seed de categorias (ajuste depois)
-- =============================================================================
insert into public.categories (slug, name, position) values
  ('difusores',       'Difusores de Ambiente', 1),
  ('home-spray',      'Home Spray',            2),
  ('sabonetes',       'Sabonetes',             3),
  ('agua-perfumada',  'Água Perfumada',        4),
  ('cremes',          'Cremes',                5),
  ('kits',            'Kits',                  6),
  ('acessorios',      'Acessórios',            7)
on conflict (slug) do nothing;
